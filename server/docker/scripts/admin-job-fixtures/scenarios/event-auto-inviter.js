/* global AdminJobFixture */
(() => {
  "use strict";
  const F = AdminJobFixture;
  const job = "event-auto-inviter";
  const eventId = F.fixtureId(job, "event");

  function creatorAndCandidates() {
    const existingUsers = new Set(
      F.collection("users")
        .find({ userId: { $exists: true, $nin: ["", null] } }, { projection: { userId: 1 } })
        .map(user => F.safeText(user.userId || user._id))
        .toArray()
    );
    const adjacency = new Map();
    F.collection("userAffinityEdges").find({ edgeWeight: { $gt: 0 } }).forEach(edge => {
      const left = F.safeText(edge.leftUserId);
      const right = F.safeText(edge.rightUserId);
      if (!existingUsers.has(left) || !existingUsers.has(right) || left === right) return;
      if (!adjacency.has(left)) adjacency.set(left, new Set());
      if (!adjacency.has(right)) adjacency.set(right, new Set());
      adjacency.get(left).add(right);
      adjacency.get(right).add(left);
    });
    const selected = [...adjacency.entries()]
      .filter(([, neighbours]) => neighbours.size >= 2)
      .sort((left, right) => right[1].size - left[1].size)[0];
    if (!selected) F.fail("auto-inviter fixture needs a seeded affinity user with two neighbours.");
    return [selected[0], ...[...selected[1]].sort().slice(0, 2)];
  }

  F.run({
    job,
    ruleKey: job,
    variations: ["open-spots", "full"],
    build(variation) {
      const userIds = creatorAndCandidates();
      const isolatedEventIds = F.collection("events")
        .find({ autoInviter: true, _id: { $ne: eventId } }, { projection: { _id: 1 } })
        .map(event => event._id)
        .toArray();
      const isolatedWaitlistMemberIds = F.collection("activityMembers")
        .find({
          ownerType: "event",
          status: "pending",
          requestKind: { $in: ["waitlist", "waitlist-invite"] }
        }, { projection: { _id: 1 } })
        .map(member => member._id)
        .toArray();
      return {
        pendingCount: 1,
        pendingCountUnit: "admin.jobs.table.affected",
        expected: variation === "open-spots"
          ? "Two connected candidates become pending event invite members; invite outbox/bell records and one priority plan marker appear."
          : "No invitations are created because accepted capacity is already full.",
        context: {
          eventId,
          userIds,
          isolatedEventIds,
          isolatedWaitlistMemberIds,
          initialMemberId: F.fixtureId(job, "creator-member")
        },
        specs: [
          { collection: "events", selector: { _id: { $in: [...isolatedEventIds, eventId] } } },
          {
            collection: "users",
            selector: { $or: [{ _id: { $in: userIds } }, { userId: { $in: userIds } }] }
          },
          {
            collection: "activityMembers",
            selector: {
              $or: [
                { ownerType: "event", ownerId: eventId },
                { _id: { $in: isolatedWaitlistMemberIds } }
              ]
            }
          },
          { collection: "schedulerPlanMarkers", selector: { ownerId: eventId } },
          {
            collection: "notificationOutbox",
            selector: { $or: [{ entityId: eventId }, { "payload.eventId": eventId }] }
          },
          {
            collection: "userNotifications",
            selector: { $or: [{ sourceId: eventId }, { "payload.eventId": eventId }] }
          },
          { collection: "affinityRecomputeTasks", selector: { targetId: eventId } }
        ]
      };
    },
    prepare(variation, context) {
      const now = F.nowIso();
      if ((context.isolatedEventIds || []).length > 0) {
        F.collection("events").updateMany(
          { _id: { $in: context.isolatedEventIds } },
          {
            $set: {
              autoInviter: false,
              updatedDate: now,
              updatedUser: F.FIXTURE_ACTOR
            }
          }
        );
      }
      if ((context.isolatedWaitlistMemberIds || []).length > 0) {
        F.collection("activityMembers").updateMany(
          { _id: { $in: context.isolatedWaitlistMemberIds } },
          {
            $set: {
              requestKind: "admin-fixture-quarantined",
              updatedDate: now,
              updatedUser: F.FIXTURE_ACTOR
            }
          }
        );
      }
      F.collection("events").insertOne({
        _id: eventId,
        sourceId: eventId,
        syncKey: eventId,
        title: "Admin fixture auto inviter",
        status: "A",
        published: true,
        autoInviter: true,
        ownerUserId: context.userIds[0],
        creatorUserId: context.userIds[0],
        capacityMin: 1,
        capacityMax: variation === "open-spots" ? 3 : 1,
        capacityTotal: variation === "open-spots" ? 3 : 1,
        acceptedMembers: 1,
        pendingMembers: 0,
        subEvents: [],
        startAtIso: F.futureIso(180),
        endAtIso: F.futureIso(360),
        createdDate: now,
        createdUser: F.FIXTURE_ACTOR,
        updatedDate: now,
        updatedUser: F.FIXTURE_ACTOR
      });
      F.collection("activityMembers").insertOne({
        _id: context.initialMemberId,
        syncKey: context.initialMemberId,
        ownerType: "event",
        ownerId: eventId,
        userId: context.userIds[0],
        role: "Admin",
        status: "accepted",
        actionAtIso: now,
        createdDate: now,
        createdUser: F.FIXTURE_ACTOR,
        updatedDate: now,
        updatedUser: F.FIXTURE_ACTOR
      });
    },
    afterPrepare() {
      print(
        `[admin-job-fixtures] Existing auto-inviter events and pending waitlist rows were temporarily `
          + `quarantined so the global worker cannot invite hundreds of demo users. Reset this job when finished.`
      );
    },
    status(context) {
      const currentEventId = context.eventId || eventId;
      const members = F.collection("activityMembers")
        .find({ ownerType: "event", ownerId: currentEventId })
        .sort({ userId: 1 })
        .map(member => ({
          userId: member.userId,
          status: member.status,
          requestKind: member.requestKind,
          pendingSource: member.pendingSource,
          role: member.role
        }))
        .toArray();
      return {
        quarantinedAutoInviterEvents: (context.isolatedEventIds || []).length,
        quarantinedWaitlistMembers: (context.isolatedWaitlistMemberIds || []).length,
        members,
        invitationCount: members.filter(member =>
          member.status === "pending" && ["invite", "waitlist-invite"].includes(member.requestKind)
        ).length,
        planMarkerCount: F.collection("schedulerPlanMarkers").countDocuments({ ownerId: currentEventId }),
        outboxCount: F.collection("notificationOutbox").countDocuments({
          $or: [{ entityId: currentEventId }, { "payload.eventId": currentEventId }]
        }),
        bellCount: F.collection("userNotifications").countDocuments({
          $or: [{ sourceId: currentEventId }, { "payload.eventId": currentEventId }]
        })
      };
    }
  });
})();
