/* global AdminJobFixture */
(() => {
  "use strict";
  const F = AdminJobFixture;
  const job = "bell-rating-feedback";

  function uniqueIds(values) {
    return [...new Set((values || []).map(F.safeText).filter(Boolean))].sort();
  }

  function sameIds(actual, expected) {
    const left = uniqueIds(actual);
    const right = uniqueIds(expected);
    return left.length === right.length && left.every((value, index) => value === right[index]);
  }

  function targetUserIds(context) {
    return context.mode === "rating"
      ? [context.targetUserId]
      : uniqueIds(context.targetUserIds);
  }

  function logicalNotificationSelector(context) {
    if (context.mode === "rating") {
      return {
        kind: "user-rated",
        sourceType: "user-rate",
        sourceId: F.safeText(context.rateId),
        senderUserId: context.actorUserId
      };
    }
    return {
      kind: "event-feedback-submitted",
      sourceType: "event",
      sourceId: context.eventId,
      senderUserId: context.actorUserId
    };
  }

  function logicalOutboxSelector(context) {
    if (context.mode === "rating") {
      return {
        notificationType: "user-rated",
        entityType: "user-rate",
        entityId: F.safeText(context.rateId),
        "payload.senderUserId": context.actorUserId
      };
    }
    return {
      notificationType: "event-feedback-submitted",
      entityType: "event",
      entityId: context.eventId,
      "payload.senderUserId": context.actorUserId
    };
  }

  function afterPreparedAt(selector, preparedAtIso) {
    return {
      $and: [
        selector,
        { createdDate: { $gt: preparedAtIso } }
      ]
    };
  }

  function reconcileUnreadProjection(userIds) {
    for (const userId of uniqueIds(userIds)) {
      const unreadCount = F.collection("userNotifications").countDocuments({
        recipientUserId: userId,
        readAtIso: null
      });
      F.collection("users").updateOne(
        { userId },
        {
          $set: {
            "activities.notifications": unreadCount,
            updatedDate: F.nowIso(),
            updatedUser: F.FIXTURE_ACTOR
          }
        }
      );
    }
  }

  function projectionRows(userIds) {
    return uniqueIds(userIds).map(userId => {
      const unreadCount = F.collection("userNotifications").countDocuments({
        recipientUserId: userId,
        readAtIso: null
      });
      const user = F.collection("users").findOne({ userId });
      const storedCount = Number(user && user.activities && user.activities.notifications) || 0;
      return {
        userId,
        unreadCount,
        storedCount,
        valid: storedCount === unreadCount
      };
    });
  }

  function isolateLogicalNotification(context) {
    const outboxSelector = logicalOutboxSelector(context);
    const trackedOutboxCount = F.collection("notificationOutbox").countDocuments({
      $and: [
        outboxSelector,
        { pendingCounterTracked: true }
      ]
    });
    if (trackedOutboxCount > 0) {
      F.fail(
        "the selected rating/feedback notification still has tracked outbox work; "
          + "wait for the existing worker and prepare again."
      );
    }
    const affectedUserIds = [context.actorUserId, ...targetUserIds(context)];
    F.collection("userNotifications").deleteMany({
      $and: [
        logicalNotificationSelector(context),
        { recipientUserId: { $in: affectedUserIds } }
      ]
    });
    F.collection("notificationOutbox").deleteMany(outboxSelector);
    reconcileUnreadProjection(affectedUserIds);
  }

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
    const rate = candidates.find(item => {
      const actorUserId = F.safeText(item.ownerUserId);
      const targetUserId = F.safeText(item.relatedUserId);
      const rateId = F.safeText(item._id);
      return users.has(actorUserId)
        && users.has(targetUserId)
        && actorUserId !== targetUserId
        && F.collection("notificationOutbox").countDocuments({
          notificationType: "user-rated",
          entityType: "user-rate",
          entityId: rateId,
          "payload.senderUserId": actorUserId,
          pendingCounterTracked: true
        }) === 0;
    });
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
      targetName: target && target.name
    };
  }

  function feedbackTargets(event, actorUserId, users) {
    const hostId = [event.creatorUserId, event.ownerUserId]
      .map(F.safeText)
      .find(userId => userId && users.has(userId)) || actorUserId;
    const targetIds = [];
    if (hostId && hostId !== actorUserId) {
      targetIds.push(hostId);
    }
    const attendeeIds = [];
    for (const rawUserId of [
      ...(event.acceptedMemberUserIds || []),
      ...(event.pendingMemberUserIds || [])
    ]) {
      const userId = F.safeText(rawUserId);
      if (!userId
          || userId === actorUserId
          || userId === hostId
          || !users.has(userId)
          || attendeeIds.includes(userId)) {
        continue;
      }
      attendeeIds.push(userId);
      if (attendeeIds.length >= 5) {
        break;
      }
    }
    targetIds.push(...attendeeIds);
    return uniqueIds(targetIds);
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
      const hasTrackedOutbox = F.collection("notificationOutbox").countDocuments({
        notificationType: "event-feedback-submitted",
        entityType: "event",
        entityId: eventId,
        "payload.senderUserId": actorUserId,
        pendingCounterTracked: true
      }) > 0;
      if (event && acceptedMember && !hasTrackedOutbox) {
        selected = { answer, event };
        break;
      }
    }
    if (!selected) {
      F.fail("feedback variation needs one seeded accepted attendee feedback submission.");
    }
    const actorUserId = F.safeText(selected.answer.viewerUserId);
    const eventId = F.safeText(selected.answer.eventId);
    const targetUserIds = feedbackTargets(selected.event, actorUserId, users);
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
      })
    };
  }

  function pairSelectors(context) {
    const allUserIds = context.mode === "rating"
      ? [context.actorUserId, context.targetUserId]
      : [context.actorUserId, ...(context.targetUserIds || [])];
    const notificationSelector = logicalNotificationSelector(context);
    const outboxSelector = logicalOutboxSelector(context);
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
        selector: {
          $and: [
            notificationSelector,
            { recipientUserId: { $in: allUserIds } }
          ]
        }
      },
      {
        collection: "notificationOutbox",
        selector: outboxSelector
      },
      {
        collection: "notificationRuleConfigs",
        selector: {
          ruleKey: { $in: ["notification-outbox", "affinity-recompute"] }
        }
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
          ? "After the actor submits a non-zero rating, exactly one logical outbox item and one unread target bell appear with the expected source, sender, payload, and projection; the actor receives none."
          : "After the actor resubmits feedback, exactly one logical outbox fanout and one unread bell per submitted other-party target appear with no duplicate or actor notification.",
        next: variation === "rating"
          ? "Use the existing demo app as the printed actor, submit a non-zero rating, inspect the target bell, then run status bell-rating-feedback."
          : "Use the existing demo app as the printed actor, submit event feedback, inspect a printed target bell, then run status bell-rating-feedback.",
        context,
        specs: pairSelectors(context)
      };
    },
    prepare(variation, context) {
      const now = F.nowIso();
      isolateLogicalNotification(context);
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
        const rateId = F.safeText(context.rateId);
        const outboxes = F.collection("notificationOutbox")
          .find(afterPreparedAt(logicalOutboxSelector(context), snapshot.preparedAtIso))
          .toArray();
        const bells = F.collection("userNotifications")
          .find(afterPreparedAt(logicalNotificationSelector(context), snapshot.preparedAtIso))
          .toArray();
        const actorBellCount = bells.filter(item =>
          F.safeText(item.recipientUserId) === context.actorUserId
        ).length;
        const projection = projectionRows([context.targetUserId]);
        const actionStored = Number(rate && rate.scoreGiven) > 0;
        const exactOutbox = outboxes.length === 1
          && sameIds(outboxes[0].recipientUserIds, [context.targetUserId])
          && outboxes[0].recipientScope === "rated-users"
          && outboxes[0].payload
          && outboxes[0].payload.rateId === rateId
          && outboxes[0].payload.mode === "single"
          && outboxes[0].payload.senderUserId === context.actorUserId
          && outboxes[0].payload.type === "user-rated"
          && outboxes[0].payload.entityType === "user-rate"
          && outboxes[0].payload.entityId === rateId;
        const exactBells = bells.length === 1
          && bells[0].recipientUserId === context.targetUserId
          && bells[0].kind === "user-rated"
          && bells[0].category === "user"
          && bells[0].senderUserId === context.actorUserId
          && bells[0].sourceType === "user-rate"
          && bells[0].sourceId === rateId
          && bells[0].actionPath === "/game"
          && bells[0].readAtIso == null
          && bells[0].payload
          && bells[0].payload.rateId === rateId
          && bells[0].payload.mode === "single"
          && bells[0].payload.senderUserId === context.actorUserId;
        const validation = {
          actionStored,
          exactSingleOutbox: exactOutbox,
          exactSingleTargetBell: exactBells,
          actorExcluded: actorBellCount === 0,
          noDuplicateRecipients: sameIds(
            bells.map(item => item.recipientUserId),
            [context.targetUserId]
          ),
          unreadProjectionMatchesCollection: projection.every(item => item.valid)
        };
        const pass = Object.values(validation).every(Boolean);
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
          outboxes,
          bells,
          actorBellCount,
          projection,
          validation,
          notificationCheck: pass
            ? "PASS: rating persistence, exact outbox, exact unread target bell, actor exclusion, and projection all match."
            : actionStored
              ? "FAIL/GAP: rating persisted, but the exact outbox/bell recipient or unread projection contract failed."
              : "WAITING: submit a non-zero rating in the app."
        };
      }
      const submissions = F.collection("eventFeedbackAnswers")
        .find({
          viewerUserId: context.actorUserId,
          eventId: context.eventId
        })
        .toArray();
      const state = F.collection("eventFeedbackStates").findOne({
        viewerUserId: context.actorUserId,
        eventId: context.eventId
      });
      const submittedTargetUserIds = uniqueIds(
        submissions
          .map(answer => answer.targetUserId)
          .filter(userId => F.safeText(userId) !== context.actorUserId)
      );
      const allowedTargetUserIds = targetUserIds(context);
      const outboxes = F.collection("notificationOutbox")
        .find(afterPreparedAt(logicalOutboxSelector(context), snapshot.preparedAtIso))
        .toArray();
      const bells = F.collection("userNotifications")
        .find(afterPreparedAt(logicalNotificationSelector(context), snapshot.preparedAtIso))
        .toArray();
      const expectedEventTitle = F.safeText(context.eventTitle) || "Event";
      const actorBellCount = bells.filter(item =>
        F.safeText(item.recipientUserId) === context.actorUserId
      ).length;
      const projection = projectionRows(submittedTargetUserIds);
      const actionStored = submissions.length > 0 && Boolean(state && state.submittedAtIso);
      const exactOutbox = outboxes.length === 1
        && sameIds(outboxes[0].recipientUserIds, submittedTargetUserIds)
        && outboxes[0].recipientScope === "feedback-targets"
        && outboxes[0].payload
        && outboxes[0].payload.eventId === context.eventId
        && outboxes[0].payload.eventTitle === expectedEventTitle
        && outboxes[0].payload.senderUserId === context.actorUserId
        && outboxes[0].payload.type === "event-feedback-submitted"
        && outboxes[0].payload.entityType === "event"
        && outboxes[0].payload.entityId === context.eventId;
      const exactBells = bells.length === submittedTargetUserIds.length
        && sameIds(
          bells.map(item => item.recipientUserId),
          submittedTargetUserIds
        )
        && bells.every(item =>
          item.kind === "event-feedback-submitted"
            && item.category === "event"
            && item.senderUserId === context.actorUserId
            && item.sourceType === "event"
            && item.sourceId === context.eventId
            && item.actionPath === "/game"
            && item.readAtIso == null
            && item.payload
            && item.payload.eventId === context.eventId
            && item.payload.eventTitle === expectedEventTitle
            && item.payload.senderUserId === context.actorUserId
        );
      const validation = {
        actionStored,
        submittedTargetsAreAllowed: submittedTargetUserIds.length > 0
          && submittedTargetUserIds.every(userId => allowedTargetUserIds.includes(userId)),
        exactSingleOutbox: exactOutbox,
        exactOneBellPerSubmittedTarget: exactBells,
        actorExcluded: actorBellCount === 0,
        noDuplicateRecipients: bells.length === uniqueIds(
          bells.map(item => item.recipientUserId)
        ).length,
        unreadProjectionMatchesCollection: projection.every(item => item.valid)
      };
      const pass = Object.values(validation).every(Boolean);
      return {
        actor: { userId: context.actorUserId, name: context.actorName },
        event: { eventId: context.eventId, title: context.eventTitle },
        targets: context.targetNames,
        submittedAnswerCount: submissions.length,
        submittedTargetUserIds,
        submittedAtIso: state && state.submittedAtIso,
        outboxes,
        bells,
        actorBellCount,
        projection,
        validation,
        notificationCheck: pass
          ? "PASS: feedback persistence, exact outbox fanout, one unread bell per submitted target, actor exclusion, and projection all match."
          : actionStored
            ? "FAIL/GAP: feedback persisted, but the exact outbox/bell fanout or unread projection contract failed."
            : "WAITING: submit feedback in the app."
      };
    }
  });
})();
