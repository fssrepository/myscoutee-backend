/* global AdminJobFixture */
(() => {
  "use strict";
  const F = AdminJobFixture;
  const job = "event-random-groups";
  const eventId = F.fixtureId(job, "event");
  const subEventId = F.fixtureId(job, "stage");
  const groupIds = [`${subEventId}:group:1`, `${subEventId}:group:2`];
  const groupOwnerIds = groupIds.map(groupId => `${eventId}:${subEventId}:${groupId}`);

  function graphUsers(count) {
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
      if (!existingUsers.has(left) || !existingUsers.has(right) || left === right) {
        return;
      }
      if (!adjacency.has(left)) adjacency.set(left, new Set());
      if (!adjacency.has(right)) adjacency.set(right, new Set());
      adjacency.get(left).add(right);
      adjacency.get(right).add(left);
    });
    const center = [...adjacency.entries()]
      .filter(([, neighbours]) => neighbours.size >= count - 1)
      .sort((left, right) => right[1].size - left[1].size)[0];
    if (!center) {
      F.fail(`random fixture needs a seeded affinity node with at least ${count - 1} neighbours.`);
    }
    return [center[0], ...[...center[1]].sort().slice(0, count - 1)];
  }

  F.run({
    job,
    ruleKey: job,
    manualTrigger: true,
    variations: ["balanced", "anchored"],
    build(variation) {
      const userIds = graphUsers(6);
      const isolatedEventIds = F.collection("events")
        .find({ published: true, _id: { $ne: eventId } }, { projection: { _id: 1 } })
        .map(event => event._id)
        .toArray();
      const memberIds = userIds.map((userId, index) => F.fixtureId(job, `event-member-${index + 1}`));
      const anchorIds = variation === "anchored"
        ? [F.fixtureId(job, "anchor-1"), F.fixtureId(job, "anchor-2")]
        : [];
      return {
        pendingCount: 1,
        pendingCountUnit: "admin.jobs.table.affected",
        expected: variation === "anchored"
          ? "The 6 accepted users are split into two groups of 3, while the two pre-anchored users remain in their original rooms. A second Run should make no assignment changes."
          : "The 6 accepted users are split into two generated groups of exactly 3. A second Run should make no assignment changes.",
        context: {
          eventId,
          subEventId,
          groupIds,
          groupOwnerIds,
          userIds,
          isolatedEventIds,
          memberIds,
          anchorIds
        },
        specs: [
          {
            collection: "events",
            selector: { _id: { $in: [...isolatedEventIds, eventId] } }
          },
          {
            collection: "users",
            selector: { $or: [{ _id: { $in: userIds } }, { userId: { $in: userIds } }] }
          },
          {
            collection: "activityMembers",
            selector: {
              $or: [
                { _id: { $in: [...memberIds, ...anchorIds] } },
                { ownerType: "event", ownerId: eventId },
                { ownerType: "group", ownerId: { $in: groupOwnerIds } }
              ]
            }
          },
          {
            collection: "schedulerPlanMarkers",
            selector: {
              $or: [
                { ownerId: { $in: groupIds } },
                { scopeId: { $regex: eventId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") } }
              ]
            }
          },
          {
            collection: "notificationOutbox",
            selector: { $or: [{ entityId: eventId }, { "payload.eventId": eventId }] }
          },
          {
            collection: "userNotifications",
            selector: { $or: [{ sourceId: eventId }, { "payload.eventId": eventId }] }
          },
          {
            collection: "affinityRecomputeTasks",
            selector: { targetId: eventId }
          }
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
              published: false,
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
        title: "Admin fixture graph rooms",
        status: "A",
        published: true,
        randomGroups: true,
        ownerUserId: context.userIds[0],
        creatorUserId: context.userIds[0],
        capacityMin: 6,
        capacityMax: 6,
        capacityTotal: 6,
        startAtIso: F.futureIso(180),
        endAtIso: F.futureIso(360),
        subEvents: [{
          id: subEventId,
          name: "Fixture graph grouping stage",
          createdByUserId: context.userIds[0],
          tournamentGroupCapacityMin: 3,
          tournamentGroupCapacityMax: 3,
          capacityMin: 6,
          capacityMax: 6,
          membersAccepted: 6,
          membersPending: 0,
          stageStatus: "A",
          groups: []
        }],
        createdDate: now,
        createdUser: F.FIXTURE_ACTOR,
        updatedDate: now,
        updatedUser: F.FIXTURE_ACTOR
      });
      const eventMembers = context.userIds.map((userId, index) => ({
        _id: context.memberIds[index],
        syncKey: context.memberIds[index],
        ownerType: "event",
        ownerId: eventId,
        userId,
        role: index === 0 ? "Admin" : "Member",
        status: "accepted",
        actionAtIso: now,
        createdDate: now,
        createdUser: F.FIXTURE_ACTOR,
        updatedDate: now,
        updatedUser: F.FIXTURE_ACTOR
      }));
      F.collection("activityMembers").insertMany(eventMembers);
      if (variation === "anchored") {
        F.collection("activityMembers").insertMany([
          {
            _id: context.anchorIds[0],
            syncKey: context.anchorIds[0],
            ownerType: "group",
            ownerId: groupOwnerIds[0],
            userId: context.userIds[0],
            role: "Member",
            status: "accepted",
            actionAtIso: now,
            createdDate: now,
            createdUser: F.FIXTURE_ACTOR,
            updatedDate: now,
            updatedUser: F.FIXTURE_ACTOR
          },
          {
            _id: context.anchorIds[1],
            syncKey: context.anchorIds[1],
            ownerType: "group",
            ownerId: groupOwnerIds[1],
            userId: context.userIds[3],
            role: "Member",
            status: "accepted",
            actionAtIso: now,
            createdDate: now,
            createdUser: F.FIXTURE_ACTOR,
            updatedDate: now,
            updatedUser: F.FIXTURE_ACTOR
          }
        ]);
      }
    },
    afterPrepare() {
      print(
        `[admin-job-fixtures] Existing published demo events were temporarily quarantined so the global `
          + `parallel graph job stays limited to this six-user fixture. Reset this job when finished.`
      );
    },
    status(context) {
      const ownerIds = context.groupOwnerIds || groupOwnerIds;
      const event = F.collection("events").findOne({ _id: context.eventId || eventId });
      const groups = ownerIds.map(ownerId => ({
        ownerId,
        acceptedUserIds: F.collection("activityMembers")
          .find({ ownerType: "group", ownerId, status: "accepted" })
          .sort({ userId: 1 })
          .map(member => member.userId)
          .toArray()
      }));
      return {
        quarantinedPublishedEvents: (context.isolatedEventIds || []).length,
        fixtureEventPublished: event && event.published,
        materializedGroups: event && event.subEvents && event.subEvents[0] && event.subEvents[0].groups,
        groups,
        assignedUserCount: [...new Set(groups.flatMap(group => group.acceptedUserIds))].length,
        planMarkerCount: F.collection("schedulerPlanMarkers").countDocuments({
          ownerId: { $in: context.groupIds || groupIds }
        }),
        outboxCount: F.collection("notificationOutbox").countDocuments({
          $or: [{ entityId: context.eventId || eventId }, { "payload.eventId": context.eventId || eventId }]
        }),
        bellCount: F.collection("userNotifications").countDocuments({
          $or: [{ sourceId: context.eventId || eventId }, { "payload.eventId": context.eventId || eventId }]
        })
      };
    }
  });
})();
