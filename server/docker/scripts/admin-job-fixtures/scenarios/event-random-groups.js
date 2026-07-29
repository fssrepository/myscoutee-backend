/* global AdminJobFixture */
(() => {
  "use strict";
  const F = AdminJobFixture;
  const job = "event-random-groups";
  const eventId = F.fixtureId(job, "event");
  const subEventId = F.fixtureId(job, "stage");
  const defaultGroupIds = [`${subEventId}:group:1`, `${subEventId}:group:2`];
  const defaultGroupOwnerIds =
    defaultGroupIds.map(groupId => `${eventId}:${subEventId}:${groupId}`);

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
    return variation === "disconnected-forest"
      ? syntheticForestEdges(userIds, cohortSizes)
      : syntheticAffinityEdges(userIds, cohortSizes);
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
    manualTrigger: true,
    variations: [
      "balanced",
      "anchored",
      "five-rooms",
      "twenty-rooms",
      "one-leftover",
      "partial-room",
      "disconnected-forest",
      "quality-200",
      "quality-1000"
    ],
    build(variation) {
      const syntheticQuality =
        variation === "twenty-rooms"
        || variation === "one-leftover"
        || variation === "partial-room"
        || variation === "disconnected-forest"
        || variation === "quality-200"
        || variation === "quality-1000";
      const userCount = variation === "quality-1000"
        ? 1000
        : variation === "quality-200"
          ? 200
          : variation === "disconnected-forest"
            ? 11
            : variation === "partial-room"
              ? 62
              : variation === "one-leftover"
                ? 61
                : variation === "twenty-rooms"
                  ? 60
                  : variation === "five-rooms" ? 15 : 6;
      const roomCapacityMax =
        variation === "quality-200" || variation === "quality-1000"
          ? 5
          : 3;
      const roomCapacityMin = variation === "partial-room"
        ? 2
        : roomCapacityMax;
      const roomCount = variation === "one-leftover"
        || variation === "disconnected-forest"
        ? Math.floor(userCount / roomCapacityMax)
        : Math.ceil(userCount / roomCapacityMax);
      const expectedCohortSizes = syntheticQuality
        ? variation === "one-leftover"
          ? [...Array(20).fill(3), 1]
          : variation === "disconnected-forest"
            ? [3, 3, 3, 1, 1]
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
          : [];
      const expectedPartialRoomUserIds = variation === "partial-room"
        ? userIds.slice(-2)
        : [];
      const groupIds = roomIds(roomCount);
      const groupOwnerIds =
        groupIds.map(groupId => `${eventId}:${subEventId}:${groupId}`);
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
          : variation === "one-leftover"
            ? "With 61 users and exact room size 3, status reveals whether the one under-minimum remainder is unassigned, mixed into another room, or persisted below minimum."
            : variation === "disconnected-forest"
              ? "A 6-user tree is cut at its weak bridge into two correct rooms, the separate 3-user tree stays intact, and only the two isolated overflow users remain unassigned."
              : variation === "partial-room"
                ? "With 62 users and room capacity 2..3, all users should fit into twenty rooms of 3 and one valid partial room of 2."
                : `The ${userCount} accepted users are split into ${roomCount} generated groups of exactly ${roomCapacityMax}. A second Run should make no assignment changes.`,
        context: {
          eventId,
          subEventId,
          syntheticQuality,
          expectedStrongEdgeWeight: 0.95,
          expectedStrongEdgeCount:
            syntheticEdges.filter(edge => edge.edgeWeight === 0.95).length,
          expectedRoomCount: roomCount,
          expectedRoomSize: roomCapacityMax,
          expectedRoomMin: roomCapacityMin,
          expectedRoomMax: roomCapacityMax,
          expectedCohortSizes,
          expectedUnassignedUserIds,
          expectedPartialRoomUserIds,
          groupIds,
          groupOwnerIds,
          userIds,
          isolatedEventIds,
          memberIds,
          anchorIds,
          syntheticEdgeIds: syntheticEdges.map(edge => edge._id),
          syntheticEdgePairKeys: syntheticEdges.map(edge => edge.pairKey)
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
        status: "A",
        published: true,
        randomGroups: true,
        ownerUserId: context.userIds[0],
        creatorUserId: context.userIds[0],
        capacityMin: context.userIds.length,
        capacityMax: context.userIds.length,
        capacityTotal: context.userIds.length,
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
      if (variation === "anchored") {
        F.collection("activityMembers").insertMany([
          {
            _id: context.anchorIds[0],
            syncKey: context.anchorIds[0],
            ownerType: "group",
            ownerId: context.groupOwnerIds[0],
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
            ownerId: context.groupOwnerIds[1],
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
    afterPrepare(variation, context) {
      print(
        `[admin-job-fixtures] Existing published demo events were temporarily quarantined so the global `
          + `parallel graph job stays limited to this ${context.userIds.length}-user fixture. `
          + `Reset this job when finished.`
      );
    },
    status(context) {
      const ownerIds = context.groupOwnerIds || defaultGroupOwnerIds;
      const event = F.collection("events").findOne({ _id: context.eventId || eventId });
      const groups = ownerIds.map(ownerId => ({
        ownerId,
        acceptedUserIds: F.collection("activityMembers")
          .find({ ownerType: "group", ownerId, status: "accepted" })
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
      const expectedRoomCount = context.expectedRoomCount || ownerIds.length;
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
      const anchorsPreserved = (context.anchorIds || []).length === 0
        || (groups[0].acceptedUserIds.includes(expectedUserIds[0])
          && groups[1].acceptedUserIds.includes(expectedUserIds[3]));
      const assignmentValid =
        actualRoomCount === expectedRoomCount
        && roomSizes.every(size => (
          size >= expectedRoomMin && size <= expectedRoomMax
        ))
        && assignedCounts.size
          === expectedUserIds.length - expectedUnassignedUserIds.length
        && duplicateUserIds.length === 0
        && unassignedUserIdsMatchExpectation
        && unexpectedUserIds.length === 0
        && partialRoomSelectionValid
        && anchorsPreserved;
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
          .filter(item => item.cohortIds.length !== 1 || item.cohortIds[0] < 0)
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
      return {
        quarantinedPublishedEvents: (context.isolatedEventIds || []).length,
        fixtureEventPublished: event && event.published,
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
          ownerId: { $in: context.groupIds || defaultGroupIds }
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
