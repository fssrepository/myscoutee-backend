/* global AdminJobFixture */
(() => {
  "use strict";
  const F = AdminJobFixture;
  const job = "event-random-groups";
  const eventId = F.fixtureId(job, "event");
  const subEventId = F.fixtureId(job, "stage");
  const defaultGroupIds = [`${subEventId}:group:1`, `${subEventId}:group:2`];
  const defaultGroupOwnerIds =
    defaultGroupIds.map(groupId => `random-room:${eventId}:${subEventId}:${groupId}`);

  function roomIds(roomCount) {
    return Array.from(
      { length: roomCount },
      (_, index) => `${subEventId}:group:${index + 1}`
    );
  }

  function syntheticUserIds(userCount) {
    return Array.from(
      { length: userCount },
      (_, index) => F.fixtureId(job, `quality-user-${String(index + 1).padStart(3, "0")}`)
    );
  }

  function affinityPairKey(leftUserId, rightUserId) {
    return [leftUserId, rightUserId].sort().join(":");
  }

  function syntheticAffinityEdges(userIds, cohortSizes) {
    const edges = [];
    const cohorts = [];
    let userOffset = 0;
    (cohortSizes || []).forEach(cohortSize => {
      cohorts.push(userIds.slice(userOffset, userOffset + cohortSize));
      userOffset += cohortSize;
    });
    for (const cohort of cohorts) {
      for (let leftIndex = 0; leftIndex < cohort.length; leftIndex += 1) {
        for (
          let rightIndex = leftIndex + 1;
          rightIndex < cohort.length;
          rightIndex += 1
        ) {
          edges.push({
            leftUserId: cohort[leftIndex],
            rightUserId: cohort[rightIndex],
            affinityScore: 0.95,
            edgeWeight: 0.95,
            evidence: {
              mutualSingleCount: 5,
              singleOneSidedCount: 0,
              pairOutsideNetworkCount: 0,
              pairInsideNetworkCount: 0,
              metCount: 1,
              strongestAffinityScore: 0.95,
              totalMultiplier: 5.5
            }
          });
        }
      }
    }
    for (let cohortIndex = 0; cohortIndex < cohorts.length; cohortIndex += 1) {
      const current = cohorts[cohortIndex];
      const next = cohorts[(cohortIndex + 1) % cohorts.length];
      if (current.length === 0 || next.length === 0) {
        continue;
      }
      edges.push({
        leftUserId: current[0],
        rightUserId: next[0],
        affinityScore: 0.05,
        edgeWeight: 0.05,
        evidence: {
          mutualSingleCount: 0,
          singleOneSidedCount: 1,
          pairOutsideNetworkCount: 0,
          pairInsideNetworkCount: 0,
          metCount: 0,
          strongestAffinityScore: 0.05,
          totalMultiplier: 1
        }
      });
    }
    return edges.map((edge, index) => ({
      _id: F.fixtureId(job, `quality-edge-${String(index + 1).padStart(4, "0")}`),
      pairKey: affinityPairKey(edge.leftUserId, edge.rightUserId),
      ...edge
    }));
  }

  function syntheticForestEdges(userIds, cohortSizes) {
    const edges = [];
    let userOffset = 0;
    for (const cohortSize of cohortSizes || []) {
      const component = userIds.slice(userOffset, userOffset + cohortSize);
      userOffset += cohortSize;
      for (let index = 0; index + 1 < component.length; index += 1) {
        edges.push({
          leftUserId: component[index],
          rightUserId: component[index + 1],
          affinityScore: 0.95,
          edgeWeight: 0.95,
          evidence: {
            mutualSingleCount: 5,
            singleOneSidedCount: 0,
            pairOutsideNetworkCount: 0,
            pairInsideNetworkCount: 0,
            metCount: 1,
            strongestAffinityScore: 0.95,
            totalMultiplier: 5.5
          }
        });
      }
    }
    if (userIds.length >= 6) {
      edges.push({
        leftUserId: userIds[2],
        rightUserId: userIds[3],
        affinityScore: 0.05,
        edgeWeight: 0.05,
        evidence: {
          mutualSingleCount: 0,
          singleOneSidedCount: 1,
          pairOutsideNetworkCount: 0,
          pairInsideNetworkCount: 0,
          metCount: 0,
          strongestAffinityScore: 0.05,
          totalMultiplier: 1
        }
      });
    }
    return edges.map((edge, index) => ({
      _id: F.fixtureId(job, `forest-edge-${String(index + 1).padStart(4, "0")}`),
      pairKey: affinityPairKey(edge.leftUserId, edge.rightUserId),
      ...edge
    }));
  }

  function generatedEdges(variation, userIds, cohortSizes) {
    return [
      "disconnected-forest",
      "under-min-connected-component",
      "below-minimum-total"
    ].includes(variation)
      ? syntheticForestEdges(userIds, cohortSizes)
      : syntheticAffinityEdges(userIds, cohortSizes);
  }

  function fingerprint(value) {
    return JSON.stringify(value);
  }

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
    manualTrigger: false,
    variations: [
      "balanced",
      "anchored",
      "anchored-full-and-empty",
      "five-rooms",
      "twenty-rooms",
      "one-leftover",
      "partial-room",
      "flexible-redistribution",
      "disconnected-forest",
      "under-min-connected-component",
      "below-minimum-total",
      "quality-200",
      "quality-1000"
    ],
    build(variation) {
      const syntheticQuality =
        variation === "twenty-rooms"
        || variation === "one-leftover"
        || variation === "partial-room"
        || variation === "flexible-redistribution"
        || variation === "disconnected-forest"
        || variation === "under-min-connected-component"
        || variation === "below-minimum-total"
        || variation === "quality-200"
        || variation === "quality-1000";
      const userCount = variation === "quality-1000"
        ? 1000
        : variation === "quality-200"
          ? 200
          : variation === "disconnected-forest"
            ? 11
            : variation === "flexible-redistribution"
              ? 11
            : variation === "under-min-connected-component"
              ? 8
              : variation === "below-minimum-total"
                ? 2
                : variation === "partial-room"
                  ? 62
                  : variation === "one-leftover"
                    ? 61
                    : variation === "twenty-rooms"
                      ? 60
                      : variation === "five-rooms" ? 15 : 6;
      const roomCapacityMax =
        variation === "quality-200"
          || variation === "quality-1000"
          || variation === "flexible-redistribution"
          ? 5
          : 3;
      const roomCapacityMin = variation === "partial-room"
        ? 2
        : variation === "flexible-redistribution"
          ? 3
          : roomCapacityMax;
      const roomCount = variation === "one-leftover"
        || variation === "disconnected-forest"
        || variation === "under-min-connected-component"
        ? Math.floor(userCount / roomCapacityMax)
        : Math.ceil(userCount / roomCapacityMax);
      const expectedRoomCount = variation === "below-minimum-total"
        ? 0
        : roomCount;
      const expectedCohortSizes = syntheticQuality
        ? variation === "one-leftover"
          ? [...Array(20).fill(3), 1]
          : variation === "disconnected-forest"
            ? [3, 3, 3, 1, 1]
          : variation === "under-min-connected-component"
              ? [3, 3, 2]
              : variation === "flexible-redistribution"
                ? [5, 3, 3]
              : variation === "below-minimum-total"
                ? [2]
                : variation === "partial-room"
                  ? [...Array(20).fill(3), 2]
                  : Array(roomCount).fill(roomCapacityMax)
        : [];
      const userIds = syntheticQuality
        ? syntheticUserIds(userCount)
        : graphUsers(userCount);
      const syntheticEdges = syntheticQuality
        ? generatedEdges(variation, userIds, expectedCohortSizes)
        : [];
      const expectedUnassignedUserIds = variation === "one-leftover"
        ? userIds.slice(-1)
        : variation === "disconnected-forest"
          ? userIds.slice(-2)
          : variation === "under-min-connected-component"
            ? userIds.slice(-2)
            : variation === "below-minimum-total"
              ? userIds.slice()
              : [];
      const expectedPartialRoomUserIds = variation === "partial-room"
        ? userIds.slice(-2)
        : variation === "flexible-redistribution"
          ? userIds.slice(5)
          : [];
      const groupIds = roomIds(roomCount);
      const groupOwnerIds =
        groupIds.map(groupId => `random-room:${eventId}:${subEventId}:${groupId}`);
      const memberIds = userIds.map((userId, index) => F.fixtureId(job, `event-member-${index + 1}`));
      const expectedAnchoredUserIdsByGroup = variation === "anchored"
        ? [[userIds[0]], [userIds[3]]]
        : variation === "anchored-full-and-empty"
          ? [userIds.slice(0, 3), []]
          : [];
      const anchorIds = expectedAnchoredUserIdsByGroup.length > 0
        ? expectedAnchoredUserIdsByGroup
          .flat()
          .map((userId, index) => F.fixtureId(job, `anchor-${index + 1}`))
        : [];
      const expectedStrongEdgeCount = syntheticEdges
        .filter(edge => (
          edge.edgeWeight === 0.95
          && !expectedUnassignedUserIds.includes(edge.leftUserId)
          && !expectedUnassignedUserIds.includes(edge.rightUserId)
        ))
        .length;
      const expectedFirstRunCount = variation === "anchored-full-and-empty"
        ? 3
        : userCount - expectedUnassignedUserIds.length;
      const affinityUserTaskIds = userIds.map(
        (_, index) => F.fixtureId(job, `affinity-user-task-${index + 1}`)
      );
      const affinityUserTaskKeys = userIds.map(userId => `USER:${userId}`);
      return {
        pendingCount: expectedFirstRunCount,
        pendingCountUnit: "admin.jobs.table.users",
        expected: variation === "anchored"
          ? "The 6 accepted users are split into two groups of 3, while the two pre-anchored users remain in their original rooms. A second Run should make no assignment changes."
          : variation === "anchored-full-and-empty"
            ? "One room starts full with 3 anchored users and must remain unchanged; the other starts empty and receives exactly the remaining 3 users."
          : variation === "one-leftover"
            ? "With 61 users and exact room size 3, status reveals whether the one under-minimum remainder is unassigned, mixed into another room, or persisted below minimum."
            : variation === "disconnected-forest"
              ? "A 6-user tree is cut at its weak bridge into two correct rooms, the separate 3-user tree stays intact, and only the two isolated overflow users remain unassigned."
              : variation === "under-min-connected-component"
                ? "A weakly joined 6-user tree is cut into two valid 3-user rooms, while the separate connected 2-user component is the exact set left unassigned below the configured minimum."
                : variation === "below-minimum-total"
                  ? "The complete 2-user graph is below the room minimum of 3, so no room membership or notification is created and both users remain unassigned."
                  : variation === "flexible-redistribution"
                    ? "With 11 users and room capacity 3..5, all users stay assigned in three valid affinity cohorts of 5, 3, and 3; the one-user max-capacity remainder must be redistributed instead of dropped."
                    : variation === "partial-room"
                      ? "With 62 users and room capacity 2..3, all users should fit into twenty rooms of 3 and one valid partial room of 2."
                      : `The ${userCount} accepted users are split into ${roomCount} new Random Room events of exactly ${roomCapacityMax}; every event has its own chat and system identity. A second scheduler pass should make no assignment changes.`,
        context: {
          eventId,
          subEventId,
          syntheticQuality,
          expectedStrongEdgeWeight: 0.95,
          expectedStrongEdgeCount,
          expectedRoomCount,
          expectedFirstRunCount,
          expectNoOutputArtifacts: variation === "below-minimum-total",
          expectedRoomSize: roomCapacityMax,
          expectedRoomMin: roomCapacityMin,
          expectedRoomMax: roomCapacityMax,
          expectedCohortSizes,
          expectedUnassignedUserIds,
          expectedPartialRoomUserIds,
          groupIds,
          groupOwnerIds,
          userIds,
          memberIds,
          anchorIds,
          affinityUserTaskIds,
          affinityUserTaskKeys,
          expectedAnchoredUserIdsByGroup,
          syntheticEdgeIds: syntheticEdges.map(edge => edge._id),
          syntheticEdgePairKeys: syntheticEdges.map(edge => edge.pairKey)
        },
        specs: [
          {
            collection: "events",
            selector: {
              $or: [
                { _id: eventId },
                { sourceId: { $in: groupOwnerIds } }
              ]
            }
          },
          {
            collection: "users",
            selector: { $or: [{ _id: { $in: userIds } }, { userId: { $in: userIds } }] }
          },
          {
            collection: "userAffinityEdges",
            selector: {
              $or: [
                { _id: { $in: syntheticEdges.map(edge => edge._id) } },
                { pairKey: { $in: syntheticEdges.map(edge => edge.pairKey) } }
              ]
            }
          },
          {
            collection: "activityMembers",
            selector: {
              $or: [
                { _id: { $in: [...memberIds, ...anchorIds] } },
                { ownerType: "event", ownerId: eventId },
                { ownerType: "event", ownerId: { $in: groupOwnerIds } }
              ]
            }
          },
          {
            collection: "chats",
            selector: { id: { $in: groupOwnerIds } }
          },
          {
            collection: "schedulerPlanMarkers",
            selector: {
              $or: [
                { ownerId: { $in: groupOwnerIds } },
                { scopeId: { $regex: eventId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") } }
              ]
            }
          },
          {
            collection: "notificationOutbox",
            selector: {
              $or: [
                { entityId: { $in: groupOwnerIds } },
                { "payload.eventId": { $in: groupOwnerIds } },
                { "payload.parentEventId": eventId }
              ]
            }
          },
          {
            collection: "userNotifications",
            selector: {
              $or: [
                { sourceId: { $in: groupOwnerIds } },
                { "payload.eventId": { $in: groupOwnerIds } },
                { "payload.parentEventId": eventId }
              ]
            }
          },
          {
            collection: "affinityRecomputeTasks",
            selector: {
              $or: [
                { targetId: eventId },
                { taskKey: { $in: affinityUserTaskKeys } }
              ]
            }
          }
        ]
      };
    },
    prepare(variation, context) {
      const now = F.nowIso();
      const runningUserTask = F.collection("affinityRecomputeTasks").findOne({
        taskKey: { $in: context.affinityUserTaskKeys || [] },
        status: "running"
      });
      if (runningUserTask) {
        F.fail(
          `random fixture user task '${runningUserTask.taskKey}' is currently running; `
            + "wait for the affinity worker to finish and prepare again."
        );
      }
      const rule = F.requireRule(job);
      const sourceScopeParameter = {
        key: "jobs.process.randomGroups.sourceEventIds",
        label: "Fixture event scope",
        labelKey: "",
        group: "Fixture",
        groupKey: "",
        valueType: "text",
        numberValue: null,
        textValue: context.eventId,
        unit: "",
        options: [],
        strategy: "",
        strategyKey: "",
        readOnly: true
      };
      F.collection("notificationRuleConfigs").updateOne(
        { ruleKey: job },
        {
          $set: {
            parameters: [
              ...(rule.parameters || []).filter(
                parameter => parameter.key !== sourceScopeParameter.key
              ),
              sourceScopeParameter
            ],
            updatedDate: now,
            updatedUser: F.FIXTURE_ACTOR
          }
        }
      );
      if (context.syntheticQuality) {
        F.collection("users").insertMany(context.userIds.map((userId, index) => ({
          _id: userId,
          syncKey: userId,
          userId,
          name: `Graph Quality ${String(index + 1).padStart(3, "0")}`,
          initials: `G${(index % 10) + 1}`,
          city: "Fixture graph",
          status: "A",
          profileStatus: "public",
          profileFormVersion: 1,
          completion: 100,
          headline: "Synthetic graph quality participant",
          about: "Temporary deterministic affinity fixture.",
          images: [],
          profileDetails: [],
          partitionKey: "country:hu",
          createdDate: now,
          createdUser: F.FIXTURE_ACTOR,
          updatedDate: now,
          updatedUser: F.FIXTURE_ACTOR
        })));
        F.collection("userAffinityEdges").insertMany(
          generatedEdges(
            variation,
            context.userIds,
            context.expectedCohortSizes
          ).map(edge => ({
            ...edge,
            updatedDate: now
          }))
        );
      }
      F.collection("events").insertOne({
        _id: eventId,
        sourceId: eventId,
        syncKey: eventId,
        title: "Admin fixture graph rooms",
        subtitle: "Accepted participants are assigned to affinity-based event rooms.",
        status: "A",
        ownerUserId: context.userIds[0],
        creatorUserId: context.userIds[0],
        admins: [context.userIds[0]],
        avatar: "RF",
        creatorName: "Random room fixture host",
        creatorInitials: "RF",
        creatorCity: "Fixture graph",
        visibility: "Public",
        blindMode: "Open Event",
        imageUrl: "https://picsum.photos/seed/admin-job-fixture-random-groups/1200/700",
        location: "Fixture graph rooms",
        capacityMin: context.userIds.length,
        capacityMax: context.userIds.length,
        capacityTotal: context.userIds.length,
        full: true,
        autoInviter: false,
        frequency: "One-time",
        ticketing: false,
        approvalRequired: false,
        policiesEnabled: false,
        slotsEnabled: false,
        generated: false,
        eventType: "main",
        acceptedMembers: context.userIds.length,
        pendingMembers: 0,
        acceptedMemberUserIds: [...context.userIds],
        pendingMemberUserIds: [],
        invitedMemberUserIds: [],
        pendingRequestMemberUserIds: [],
        topics: ["#Fixture", "#Rooms"],
        subEventsEnabled: true,
        subEventDefinitions: [],
        mode: "Casual",
        rating: 0,
        boost: 0,
        affinity: 0,
        startAtIso: F.futureIso(180),
        endAtIso: F.futureIso(360),
        subEvents: [{
          id: subEventId,
          name: "Fixture graph grouping stage",
          createdByUserId: context.userIds[0],
          tournamentGroupCapacityMin: context.expectedRoomMin,
          tournamentGroupCapacityMax: context.expectedRoomMax,
          capacityMin: context.userIds.length,
          capacityMax: context.userIds.length,
          membersAccepted: context.userIds.length,
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
      const anchorMembers = [];
      let anchorIndex = 0;
      (context.expectedAnchoredUserIdsByGroup || []).forEach(
        (anchoredUserIds, groupIndex) => {
          (anchoredUserIds || []).forEach(userId => {
            const anchorId = context.anchorIds[anchorIndex];
            anchorIndex += 1;
            anchorMembers.push({
              _id: anchorId,
              syncKey: anchorId,
              ownerType: "event",
              ownerId: context.groupOwnerIds[groupIndex],
              userId,
              role: "Member",
              status: "accepted",
              actionAtIso: now,
              createdDate: now,
              createdUser: F.FIXTURE_ACTOR,
              updatedDate: now,
              updatedUser: F.FIXTURE_ACTOR
            });
          });
        }
      );
      if (anchorMembers.length > 0) {
        F.collection("activityMembers").insertMany(anchorMembers);
      }
      F.collection("affinityRecomputeTasks").deleteMany({
        taskKey: { $in: context.affinityUserTaskKeys || [] }
      });
      F.collection("affinityRecomputeTasks").insertMany(
        context.userIds.map((userId, index) => ({
          _id: context.affinityUserTaskIds[index],
          version: 0,
          taskKey: context.affinityUserTaskKeys[index],
          targetType: "USER",
          targetId: userId,
          reasons: ["USER_CHANGED"],
          status: "pending",
          pendingCounterTracked: true,
          availableAtIso: "2099-01-01T00:00:00.000Z",
          rerunRequested: false,
          attemptCount: 0,
          createdDate: now,
          updatedDate: now,
          updatedUser: F.FIXTURE_ACTOR
        }))
      );
    },
    afterPrepare(variation, context) {
      print(
        `[admin-job-fixtures] The rule is scoped to only '${context.eventId}'; no other `
          + `published event was modified. The existing Java scheduler will pick it up automatically.`
      );
    },
    status(context, snapshot) {
      const ownerIds = context.groupOwnerIds || defaultGroupOwnerIds;
      const event = F.collection("events").findOne({ _id: context.eventId || eventId });
      const groups = ownerIds.map(ownerId => ({
        ownerId,
        event: F.collection("events").findOne(
          { sourceId: ownerId },
          {
            _id: 1,
            sourceId: 1,
            title: 1,
            status: 1,
            eventType: 1,
            creatorUserId: 1,
            creatorName: 1,
            imageUrl: 1,
            parentEventId: 1
          }
        ),
        chatOwnerUserIds: F.collection("chats")
          .find({ id: ownerId }, { ownerUserId: 1 })
          .sort({ ownerUserId: 1 })
          .map(chat => chat.ownerUserId)
          .toArray(),
        acceptedUserIds: F.collection("activityMembers")
          .find({ ownerType: "event", ownerId, status: "accepted" })
          .sort({ userId: 1 })
          .map(member => member.userId)
          .toArray()
      }));
      const assignedUserIds = groups.flatMap(group => group.acceptedUserIds);
      const assignedCounts = new Map();
      assignedUserIds.forEach(userId => {
        assignedCounts.set(userId, (assignedCounts.get(userId) || 0) + 1);
      });
      const expectedUserIds = context.userIds || [];
      const expectedUserIdSet = new Set(expectedUserIds);
      const duplicateUserIds = [...assignedCounts.entries()]
        .filter(([, count]) => count > 1)
        .map(([userId]) => userId)
        .sort();
      const missingUserIds = expectedUserIds
        .filter(userId => !assignedCounts.has(userId))
        .sort();
      const unexpectedUserIds = [...assignedCounts.keys()]
        .filter(userId => !expectedUserIdSet.has(userId))
        .sort();
      const expectedUnassignedUserIds =
        (context.expectedUnassignedUserIds || []).slice().sort();
      const unassignedUserIdsMatchExpectation =
        JSON.stringify(missingUserIds)
        === JSON.stringify(expectedUnassignedUserIds);
      const roomSizes = groups.map(group => group.acceptedUserIds.length);
      const expectedRoomCount = Number.isInteger(context.expectedRoomCount)
        ? context.expectedRoomCount
        : ownerIds.length;
      const expectedRoomSize = context.expectedRoomSize || 3;
      const expectedRoomMin = context.expectedRoomMin || expectedRoomSize;
      const expectedRoomMax = context.expectedRoomMax || expectedRoomSize;
      const actualRoomCount = roomSizes.filter(size => size > 0).length;
      const emptyRoomIndexes = roomSizes
        .map((size, index) => ({ size, index }))
        .filter(item => item.size === 0)
        .map(item => item.index + 1);
      const belowMinimumRoomIndexes = roomSizes
        .map((size, index) => ({ size, index }))
        .filter(item => item.size > 0 && item.size < expectedRoomMin)
        .map(item => item.index + 1);
      const aboveMaximumRoomIndexes = roomSizes
        .map((size, index) => ({ size, index }))
        .filter(item => item.size > expectedRoomMax)
        .map(item => item.index + 1);
      const partialRoomIndexes = roomSizes
        .map((size, index) => ({ size, index }))
        .filter(item => (
          item.size >= expectedRoomMin && item.size < expectedRoomMax
        ))
        .map(item => item.index + 1);
      const actualPartialRoomUserIds = groups
        .filter(group => (
          group.acceptedUserIds.length >= expectedRoomMin
          && group.acceptedUserIds.length < expectedRoomMax
        ))
        .flatMap(group => group.acceptedUserIds)
        .sort();
      const expectedPartialRoomUserIds =
        (context.expectedPartialRoomUserIds || []).slice().sort();
      const partialRoomSelectionValid =
        JSON.stringify(actualPartialRoomUserIds)
        === JSON.stringify(expectedPartialRoomUserIds);
      const configuredRemainder = expectedUserIds.length % expectedRoomMax;
      let observedRemainderPolicy = "all-assigned-within-range";
      if (belowMinimumRoomIndexes.length > 0) {
        observedRemainderPolicy = "below-minimum-room-created";
      } else if (aboveMaximumRoomIndexes.length > 0) {
        observedRemainderPolicy = "above-maximum-room-created";
      } else if (missingUserIds.length > 0) {
        observedRemainderPolicy = "remainder-unassigned";
      } else if (configuredRemainder > 0) {
        observedRemainderPolicy = partialRoomIndexes.length > 0
          ? "remainder-kept-in-valid-partial-room"
          : "remainder-redistributed-within-range";
      }
      const expectedAnchoredUserIdsByGroup =
        context.expectedAnchoredUserIdsByGroup || [];
      const anchorsPreserved = expectedAnchoredUserIdsByGroup.every(
        (anchoredUserIds, groupIndex) => (
          Boolean(groups[groupIndex])
          && (anchoredUserIds || []).every(
            userId => groups[groupIndex].acceptedUserIds.includes(userId)
          )
        )
      );
      const activeRoomArtifactsValid = groups.every((group, index) => {
        if (group.acceptedUserIds.length === 0) {
          return group.event == null && group.chatOwnerUserIds.length === 0;
        }
        const room = group.event || {};
        return room.sourceId === group.ownerId
          && room.title === `Random Room R${index + 1}`
          && room.status === "A"
          && room.eventType === "random-room"
          && !room.creatorUserId
          && room.creatorName === "MyScoutee System"
          && room.imageUrl === "/media/public?key=images/system/random-room-default.png"
          && !room.parentEventId
          && JSON.stringify(group.chatOwnerUserIds)
            === JSON.stringify(group.acceptedUserIds.slice().sort());
      });
      const assignmentValid =
        actualRoomCount === expectedRoomCount
        && roomSizes.every(size => (
          size === 0 || (size >= expectedRoomMin && size <= expectedRoomMax)
        ))
        && assignedCounts.size
          === expectedUserIds.length - expectedUnassignedUserIds.length
        && duplicateUserIds.length === 0
        && unassignedUserIdsMatchExpectation
        && unexpectedUserIds.length === 0
        && partialRoomSelectionValid
        && anchorsPreserved
        && activeRoomArtifactsValid;
      let quality = null;
      if (context.syntheticQuality) {
        const expectedCohortSizes =
          context.expectedCohortSizes
          || Array(expectedRoomCount).fill(expectedRoomMax);
        const expectedCohortByUserId = new Map();
        const expectedUsersByCohort = [];
        let cohortUserOffset = 0;
        expectedCohortSizes.forEach((cohortSize, cohortIndex) => {
          const cohortUsers = expectedUserIds.slice(
            cohortUserOffset,
            cohortUserOffset + cohortSize
          );
          expectedUsersByCohort.push(cohortUsers);
          cohortUsers.forEach(userId => {
            expectedCohortByUserId.set(userId, cohortIndex);
          });
          cohortUserOffset += cohortSize;
        });
        const roomCohortIds = groups.map(group => [
          ...new Set(group.acceptedUserIds.map(userId => (
            expectedCohortByUserId.has(userId)
              ? expectedCohortByUserId.get(userId)
              : -1
          )))
        ].sort((left, right) => left - right));
        const mixedRoomIndexes = roomCohortIds
          .map((cohortIds, index) => ({ cohortIds, index }))
          .filter(item => (
            groups[item.index].acceptedUserIds.length > 0
            && (item.cohortIds.length !== 1 || item.cohortIds[0] < 0)
          ))
          .map(item => item.index + 1);
        const cohortRoomIndexes = new Map();
        roomCohortIds.forEach((cohortIds, roomIndex) => {
          cohortIds.filter(cohortId => cohortId >= 0).forEach(cohortId => {
            if (!cohortRoomIndexes.has(cohortId)) {
              cohortRoomIndexes.set(cohortId, new Set());
            }
            cohortRoomIndexes.get(cohortId).add(roomIndex);
          });
        });
        const splitCohortIndexes = Array.from(
          { length: expectedCohortSizes.length },
          (_, cohortIndex) => cohortIndex
        ).filter(cohortIndex => (
          !cohortRoomIndexes.has(cohortIndex)
          || cohortRoomIndexes.get(cohortIndex).size !== 1
        ));
        const underMinimumCohortIndexes = expectedCohortSizes
          .map((size, index) => ({ size, index }))
          .filter(item => item.size < expectedRoomMin)
          .map(item => item.index);
        const eligibleSplitCohortIndexes = splitCohortIndexes
          .filter(cohortIndex => (
            !underMinimumCohortIndexes.includes(cohortIndex)
          ));
        const underMinimumUserIds = underMinimumCohortIndexes
          .flatMap(cohortIndex => expectedUsersByCohort[cohortIndex] || [])
          .sort();
        const underMinimumAssignedUserIds = underMinimumUserIds
          .filter(userId => assignedCounts.has(userId));
        const underMinimumUserIdSet = new Set(underMinimumUserIds);
        const correctlyUnassignedUnderMinimumUserIds = missingUserIds
          .filter(userId => underMinimumUserIdSet.has(userId));
        const wronglyUnassignedUserIds = missingUserIds
          .filter(userId => !underMinimumUserIdSet.has(userId));
        const unassignedSelectionValid =
          correctlyUnassignedUnderMinimumUserIds.length
            === underMinimumUserIds.length
          && wronglyUnassignedUserIds.length === 0
          && underMinimumAssignedUserIds.length === 0;
        const misplacedUserIds = groups
          .filter((group, index) => mixedRoomIndexes.includes(index + 1))
          .flatMap(group => group.acceptedUserIds)
          .sort();
        const actualRoomPairKeys = [];
        groups.forEach(group => {
          for (
            let leftIndex = 0;
            leftIndex < group.acceptedUserIds.length;
            leftIndex += 1
          ) {
            for (
              let rightIndex = leftIndex + 1;
              rightIndex < group.acceptedUserIds.length;
              rightIndex += 1
            ) {
              actualRoomPairKeys.push(affinityPairKey(
                group.acceptedUserIds[leftIndex],
                group.acceptedUserIds[rightIndex]
              ));
            }
          }
        });
        const actualAffinityWeight = F.collection("userAffinityEdges")
          .find(
            { pairKey: { $in: actualRoomPairKeys } },
            { edgeWeight: 1 }
          )
          .map(edge => Number(edge.edgeWeight) || 0)
          .toArray()
          .reduce((total, weight) => total + weight, 0);
        const expectedStrongEdgeCount =
          Number.isInteger(context.expectedStrongEdgeCount)
            ? context.expectedStrongEdgeCount
            : expectedCohortSizes.reduce(
              (total, cohortSize) => total
                + (cohortSize * (cohortSize - 1) / 2),
              0
            );
        const expectedAffinityWeight = expectedStrongEdgeCount
          * (Number(context.expectedStrongEdgeWeight) || 0.95);
        const affinityQualityRatio = expectedAffinityWeight > 0
          ? actualAffinityWeight / expectedAffinityWeight
          : 1;
        quality = {
          cohortIntegrityValid:
            mixedRoomIndexes.length === 0
            && eligibleSplitCohortIndexes.length === 0
            && underMinimumAssignedUserIds.length === 0,
          expectedCohortCount: expectedCohortSizes.length,
          expectedStrongEdgeCount,
          perfectCohortRoomCount: groups.filter((group, roomIndex) => {
            const cohortIds = roomCohortIds[roomIndex];
            return cohortIds.length === 1
              && cohortIds[0] >= 0
              && group.acceptedUserIds.length
                === expectedCohortSizes[cohortIds[0]];
          }).length,
          mixedRoomIndexes,
          splitCohortIndexes,
          eligibleSplitCohortIndexes,
          underMinimumCohortIndexes,
          underMinimumUserIds,
          underMinimumAssignedUserIds,
          correctlyUnassignedUnderMinimumUserIds,
          wronglyUnassignedUserIds,
          unassignedSelectionValid,
          misplacedUserIds,
          expectedAffinityWeight:
            Number(expectedAffinityWeight.toFixed(6)),
          actualAffinityWeight:
            Number(actualAffinityWeight.toFixed(6)),
          affinityQualityRatio:
            Number(affinityQualityRatio.toFixed(6))
        };
      }
      const groupMemberRows = F.collection("activityMembers")
        .find(
          { ownerType: "event", ownerId: { $in: ownerIds } },
          {
            _id: 1,
            ownerId: 1,
            userId: 1,
            status: 1,
            requestKind: 1,
            updatedDate: 1
          }
        )
        .sort({ ownerId: 1, userId: 1, _id: 1 })
        .toArray();
      const markerRows = F.collection("schedulerPlanMarkers")
        .find(
          { ownerId: { $in: ownerIds } },
          {
            _id: 1,
            ownerId: 1,
            scopeId: 1,
            userIds: 1,
            fingerprint: 1,
            updatedDate: 1
          }
        )
        .sort({ ownerId: 1, scopeId: 1, _id: 1 })
        .toArray();
      const notificationSelector = {
        $or: [
          { entityId: { $in: ownerIds } },
          { "payload.eventId": { $in: ownerIds } },
          { "payload.parentEventId": context.eventId || eventId }
        ]
      };
      const outboxRows = F.collection("notificationOutbox")
        .find(
          notificationSelector,
          {
            _id: 1,
            syncKey: 1,
            collapseKey: 1,
            recipientUserIds: 1,
            entityType: 1,
            entityId: 1,
            type: 1
          }
        )
        .sort({ _id: 1 })
        .toArray();
      const bellRows = F.collection("userNotifications")
        .find(
          {
            $or: [
              { sourceId: { $in: ownerIds } },
              { "payload.eventId": { $in: ownerIds } },
              { "payload.parentEventId": context.eventId || eventId }
            ]
          },
          {
            _id: 1,
            syncKey: 1,
            outboxId: 1,
            recipientUserId: 1,
            senderUserId: 1,
            kind: 1,
            sourceType: 1,
            sourceId: 1
          }
        )
        .sort({ _id: 1 })
        .toArray();
      const outboxCount = outboxRows.length;
      const bellCount = bellRows.length;
      const generatedRoomEvents = groups
        .map(group => group.event)
        .filter(Boolean);
      const roomChatRows = F.collection("chats")
        .find({ id: { $in: ownerIds } }, { _id: 1, id: 1, ownerUserId: 1 })
        .sort({ id: 1, ownerUserId: 1 })
        .toArray();
      const noOutputArtifacts =
        generatedRoomEvents.length === 0
        && roomChatRows.length === 0
        && groupMemberRows.length === 0
        && markerRows.length === 0
        && outboxCount === 0
        && bellCount === 0;
      const currentAssignmentFingerprint = fingerprint({
        storedSubEventGroups:
          event && event.subEvents && event.subEvents[0] && event.subEvents[0].groups,
        generatedRoomEvents,
        roomChatRows,
        groupMemberRows,
        markerRows,
        outboxRows,
        bellRows
      });
      const rule = F.requireRule(job);
      const runState = rule.runState || {};
      const currentRunAtIso = F.safeText(
        runState.lastRunAtIso || runState.runFinishedAtIso
      );
      const preparedAtIso = F.safeText(snapshot && snapshot.preparedAtIso);
      const currentRunAtMillis = Date.parse(currentRunAtIso);
      const preparedAtMillis = Date.parse(preparedAtIso);
      const runObservedAfterPrepare =
        Number.isFinite(currentRunAtMillis)
        && Number.isFinite(preparedAtMillis)
        && currentRunAtMillis >= preparedAtMillis;
      const expectedFirstRunCount =
        Number.isInteger(context.expectedFirstRunCount)
          ? context.expectedFirstRunCount
          : expectedUserIds.length - expectedUnassignedUserIds.length;
      const baseline = context.assignmentBaseline || null;
      const firstPassAffectedExpectedUsers = Boolean(baseline)
        || (
          runState.lastRunStatus === "completed"
          && runState.lastRunCount === expectedFirstRunCount
        );
      const qualityValid = !quality
        || (
          quality.cohortIntegrityValid
          && quality.unassignedSelectionValid
          && quality.affinityQualityRatio === 1
        );
      const firstPassComplete =
        assignmentValid
        && qualityValid
        && (!context.expectNoOutputArtifacts || noOutputArtifacts)
        && runObservedAfterPrepare
        && firstPassAffectedExpectedUsers;
      if (firstPassComplete && !baseline && snapshot) {
        F.collection(F.SNAPSHOT_COLLECTION).updateOne(
          { _id: snapshot._id },
          {
            $set: {
              "context.assignmentBaseline": {
                fingerprint: currentAssignmentFingerprint,
                runAtIso: currentRunAtIso,
                capturedAtIso: F.nowIso()
              }
            }
          }
        );
      }
      const repeatedPassObserved = Boolean(
        baseline
        && runState.lastRunStatus === "completed"
        && runState.lastRunCount === 0
        && currentRunAtIso
        && currentRunAtIso !== baseline.runAtIso
      );
      return {
        sourceScopeEventId: context.eventId || eventId,
        unrelatedPublishedEventsModified: 0,
        fixtureEventPublished: Boolean(event && F.safeText(event.status) === "A"),
        storedSubEventGroups:
          event && event.subEvents && event.subEvents[0] && event.subEvents[0].groups,
        derivedGroupIds: context.groupIds || defaultGroupIds,
        groups,
        assignedUserCount: assignedCounts.size,
        validation: {
          assignmentValid,
          expectedUserCount: expectedUserIds.length,
          expectedRoomCount,
          expectedRoomSize,
          expectedRoomMin,
          expectedRoomMax,
          actualRoomCount,
          roomSizes,
          duplicateUserIds,
          missingUserIds,
          unexpectedUserIds,
          anchorsPreserved,
          activeRoomArtifactsValid,
          expectedNoOutputArtifacts: Boolean(context.expectNoOutputArtifacts),
          noOutputArtifacts,
          repeatedRun: {
            expectedFirstPassAffectedUserCount: expectedFirstRunCount,
            firstPassAffectedExpectedUsers,
            runObservedAfterPrepare,
            firstPassComplete,
            baselineCaptured: Boolean(baseline) || firstPassComplete,
            repeatedPassObserved,
            repeatedPassChangedZeroGroups: repeatedPassObserved,
            assignmentFingerprintUnchanged:
              repeatedPassObserved
              && baseline.fingerprint === currentAssignmentFingerprint
          },
          capacityPolicy: {
            configuredRemainder,
            fullRoomCount:
              roomSizes.filter(size => size === expectedRoomMax).length,
            partialRoomIndexes,
            emptyRoomIndexes,
            belowMinimumRoomIndexes,
            aboveMaximumRoomIndexes,
            expectedUnassignedUserIds,
            unassignedUserIds: missingUserIds,
            unassignedUserIdsMatchExpectation,
            expectedPartialRoomUserIds,
            actualPartialRoomUserIds,
            partialRoomSelectionValid,
            observedRemainderPolicy
          },
          quality
        },
        planMarkerCount: F.collection("schedulerPlanMarkers").countDocuments({
          ownerId: { $in: ownerIds }
        }),
        generatedRoomEventCount: generatedRoomEvents.length,
        roomChatViewCount: roomChatRows.length,
        outboxCount,
        bellCount
      };
    }
  });
})();
