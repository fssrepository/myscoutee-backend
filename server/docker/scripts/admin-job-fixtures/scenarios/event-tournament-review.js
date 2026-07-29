/* global AdminJobFixture */
(() => {
  "use strict";
  const F = AdminJobFixture;
  const job = "event-tournament-review";
  const eventId = F.fixtureId(job, "event");
  const stageId = F.fixtureId(job, "stage");
  const qualifierStageId = F.fixtureId(job, "qualifier");
  const finalStageId = F.fixtureId(job, "final");

  function advancementContext() {
    const userIds = Array.from(
      { length: 6 },
      (_, index) => F.fixtureId(job, `user-${index + 1}`)
    );
    const qualifierGroupIds = [
      `${qualifierStageId}:group:1`,
      `${qualifierStageId}:group:2`
    ];
    const finalGroupId = `${finalStageId}:group:1`;
    const qualifierGroupOwnerIds = qualifierGroupIds.map(
      groupId => `${eventId}:${qualifierStageId}:${groupId}`
    );
    const finalGroupOwnerId = `${eventId}:${finalStageId}:${finalGroupId}`;
    return {
      userIds,
      qualifierGroupIds,
      finalGroupId,
      qualifierGroupOwnerIds,
      finalGroupOwnerId,
      expectedWinnerUserIds: [userIds[1], userIds[4]],
      expectedLoserUserIds: [userIds[0], userIds[2], userIds[3], userIds[5]],
      staleLoserUserId: userIds[2],
      eventMemberIds: userIds.map((_, index) =>
        F.fixtureId(job, `event-member-${index + 1}`)),
      qualifierMemberIds: userIds.map((_, index) =>
        F.fixtureId(job, `qualifier-member-${index + 1}`)),
      staleFinalMemberId: F.fixtureId(job, "stale-final-member"),
      leaderboardEntryIds: userIds.map((_, index) =>
        F.fixtureId(job, `score-${index + 1}`))
    };
  }

  function tournamentEventIds() {
    return F.collection("events")
      .find({
        _id: { $ne: eventId },
        status: "A",
        $or: [
          { mode: { $regex: /^tournament$/i } },
          {
            subEvents: {
              $elemMatch: {
                $or: [
                  { tournamentLeaderboardType: { $in: ["Score", "Fifa", "score", "fifa"] } },
                  { tournamentGroupCapacityMin: { $gt: 0 } },
                  { tournamentGroupCapacityMax: { $gt: 0 } }
                ]
              }
            }
          }
        ]
      }, { projection: { _id: 1 } })
      .map(event => event._id)
      .toArray();
  }

  function memberRows(ownerId) {
    return F.collection("activityMembers")
      .find({ ownerType: "group", ownerId })
      .sort({ userId: 1, _id: 1 })
      .map(member => ({
        id: member._id,
        userId: member.userId,
        status: member.status,
        updatedDate: member.updatedDate
      }))
      .toArray();
  }

  function fingerprint(value) {
    return JSON.stringify(value);
  }

  F.run({
    job,
    ruleKey: job,
    variations: ["ended", "future", "advancement"],
    build(variation) {
      const isolatedEventIds = tournamentEventIds();
      const advancement = variation === "advancement" ? advancementContext() : null;
      const groupOwnerIds = advancement
        ? [...advancement.qualifierGroupOwnerIds, advancement.finalGroupOwnerId]
        : [];
      const memberIds = advancement
        ? [
            ...advancement.eventMemberIds,
            ...advancement.qualifierMemberIds,
            advancement.staleFinalMemberId
          ]
        : [];
      const userIds = advancement ? advancement.userIds : [];
      const leaderboardEntryIds = advancement ? advancement.leaderboardEntryIds : [];
      return {
        pendingCount: 1,
        pendingCountUnit: "admin.jobs.table.affected",
        expected: variation === "ended"
          ? "The active stage changes to stageStatus=SR, reason=stage-ended, with stageStatusUpdatedAt set."
          : variation === "future"
            ? "The active first stage changes to stageStatus=RS, reason=awaiting-tournament-start, with stageStatusUpdatedAt set."
            : "The scheduled rule ranks two finalized Score groups, advances exactly user-2 and user-5 into the final, removes the pre-seeded loser, and a repeated pass changes zero groups.",
        context: {
          eventId,
          stageId,
          qualifierStageId,
          finalStageId,
          isolatedEventIds,
          ...(advancement || {})
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
                { _id: { $in: memberIds } },
                { ownerType: "event", ownerId: eventId },
                { ownerType: "group", ownerId: { $in: groupOwnerIds } }
              ]
            }
          },
          {
            collection: "eventLeaderboardEntries",
            selector: {
              $or: [
                { _id: { $in: leaderboardEntryIds } },
                { eventId }
              ]
            }
          },
          {
            collection: "schedulerPlanMarkers",
            selector: {
              $or: [
                { ownerId: advancement ? advancement.finalGroupId : "" },
                { scopeId: { $regex: eventId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") } }
              ]
            }
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
              status: "I",
              published: false,
              updatedDate: now,
              updatedUser: F.FIXTURE_ACTOR
            }
          }
        );
      }

      if (variation !== "advancement") {
        F.collection("events").insertOne({
          _id: eventId,
          sourceId: eventId,
          syncKey: eventId,
          title: "Admin fixture tournament review",
          mode: "TOURNAMENT",
          status: "A",
          published: true,
          capacityMin: 2,
          capacityMax: 4,
          capacityTotal: 4,
          subEvents: [{
            id: stageId,
            name: "Fixture tournament stage",
            startAt: variation === "ended" ? F.pastIso(120) : F.futureIso(60),
            endAt: variation === "ended" ? F.pastIso(30) : F.futureIso(120),
            tournamentGroupCapacityMin: 2,
            tournamentGroupCapacityMax: 2,
            tournamentLeaderboardType: "Score",
            tournamentAdvancePerGroup: 1,
            capacityMin: 2,
            capacityMax: 4,
            stageStatus: "A",
            stageStatusReason: null,
            stageStatusUpdatedAt: null,
            stageFinalizedAt: null,
            groups: []
          }],
          createdDate: now,
          createdUser: F.FIXTURE_ACTOR,
          updatedDate: now,
          updatedUser: F.FIXTURE_ACTOR
        });
        return;
      }

      F.collection("users").insertMany(context.userIds.map((userId, index) => ({
        _id: userId,
        syncKey: userId,
        userId,
        name: `Tournament Fixture ${index + 1}`,
        initials: `T${index + 1}`,
        city: "Fixture tournament",
        status: "A",
        profileStatus: "public",
        profileFormVersion: 1,
        completion: 100,
        images: [],
        profileDetails: [],
        partitionKey: "country:hu",
        createdDate: now,
        createdUser: F.FIXTURE_ACTOR,
        updatedDate: now,
        updatedUser: F.FIXTURE_ACTOR
      })));
      F.collection("events").insertOne({
        _id: eventId,
        sourceId: eventId,
        syncKey: eventId,
        title: "Admin fixture tournament advancement",
        mode: "TOURNAMENT",
        status: "A",
        published: true,
        ownerUserId: context.userIds[0],
        creatorUserId: context.userIds[0],
        capacityMin: 6,
        capacityMax: 6,
        capacityTotal: 6,
        subEvents: [
          {
            id: qualifierStageId,
            name: "Fixture qualifier",
            startAt: F.pastIso(180),
            endAt: F.pastIso(120),
            tournamentGroupCapacityMin: 3,
            tournamentGroupCapacityMax: 3,
            tournamentLeaderboardType: "Score",
            tournamentAdvancePerGroup: 1,
            capacityMin: 6,
            capacityMax: 6,
            membersAccepted: 6,
            membersPending: 0,
            stageStatus: "F",
            stageStatusReason: "fixture-finalized",
            stageStatusUpdatedAt: F.pastIso(60),
            stageFinalizedAt: F.pastIso(60),
            stageFinalizedByUserId: context.userIds[0],
            groups: []
          },
          {
            id: finalStageId,
            name: "Fixture final",
            startAt: F.futureIso(60),
            endAt: F.futureIso(120),
            tournamentGroupCapacityMin: 2,
            tournamentGroupCapacityMax: 2,
            tournamentLeaderboardType: "Score",
            tournamentAdvancePerGroup: 1,
            capacityMin: 2,
            capacityMax: 2,
            membersAccepted: 0,
            membersPending: 0,
            stageStatus: "A",
            groups: []
          }
        ],
        createdDate: now,
        createdUser: F.FIXTURE_ACTOR,
        updatedDate: now,
        updatedUser: F.FIXTURE_ACTOR
      });

      F.collection("activityMembers").insertMany(context.userIds.map((userId, index) => ({
        _id: context.eventMemberIds[index],
        syncKey: context.eventMemberIds[index],
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
      })));
      F.collection("activityMembers").insertMany(context.userIds.map((userId, index) => ({
        _id: context.qualifierMemberIds[index],
        syncKey: context.qualifierMemberIds[index],
        ownerType: "group",
        ownerId: context.qualifierGroupOwnerIds[index < 3 ? 0 : 1],
        userId,
        role: "Member",
        status: "accepted",
        actionAtIso: now,
        createdDate: now,
        createdUser: F.FIXTURE_ACTOR,
        updatedDate: now,
        updatedUser: F.FIXTURE_ACTOR
      })));
      F.collection("activityMembers").insertOne({
        _id: context.staleFinalMemberId,
        syncKey: context.staleFinalMemberId,
        ownerType: "group",
        ownerId: context.finalGroupOwnerId,
        userId: context.staleLoserUserId,
        role: "Member",
        status: "accepted",
        actionAtIso: now,
        createdDate: now,
        createdUser: F.FIXTURE_ACTOR,
        updatedDate: now,
        updatedUser: F.FIXTURE_ACTOR
      });

      const scoreValues = [2, 10, 3, 4, 9, 1];
      F.collection("eventLeaderboardEntries").insertMany(context.userIds.map((userId, index) => ({
        _id: context.leaderboardEntryIds[index],
        syncKey: context.leaderboardEntryIds[index],
        eventId,
        subEventId: qualifierStageId,
        groupId: context.qualifierGroupIds[index < 3 ? 0 : 1],
        entryType: "score",
        memberId: userId,
        scoreValue: scoreValues[index],
        note: "deterministic fixture score",
        createdAtIso: new Date(Date.now() + index * 1000).toISOString(),
        createdUser: F.FIXTURE_ACTOR,
        updatedDate: now,
        updatedUser: F.FIXTURE_ACTOR
      })));
    },
    afterPrepare(variation) {
      print(
        `[admin-job-fixtures] Existing active tournament-capable demo events were temporarily quarantined. `
          + `This keeps the global scheduled review limited to the fixture; reset this job when finished.`
      );
      if (variation === "advancement") {
        print(
          `[admin-job-fixtures] The six synthetic winners/losers have no affinity edges on purpose. `
            + `Ranking must still advance the exact winners; affinity may only influence their later grouping.`
        );
      }
    },
    status(context, snapshot) {
      const event = F.collection("events").findOne({ _id: context.eventId || eventId });
      if (!snapshot || snapshot.variation !== "advancement") {
        const stage = event && (event.subEvents || []).find(
          item => item.id === (context.stageId || stageId)
        );
        return {
          quarantinedTournamentEvents: (context.isolatedEventIds || []).length,
          eventUpdatedUser: event && event.updatedUser,
          stage: stage && {
            id: stage.id,
            startAt: stage.startAt,
            endAt: stage.endAt,
            stageStatus: stage.stageStatus,
            stageStatusReason: stage.stageStatusReason,
            stageStatusUpdatedAt: stage.stageStatusUpdatedAt,
            stageFinalizedAt: stage.stageFinalizedAt
          }
        };
      }

      const expectedWinners = [...(context.expectedWinnerUserIds || [])].sort();
      const expectedLosers = [...(context.expectedLoserUserIds || [])].sort();
      const finalRows = memberRows(context.finalGroupOwnerId);
      const acceptedFinalUserIds = finalRows
        .filter(row => row.status === "accepted")
        .map(row => row.userId)
        .sort();
      const missingWinnerUserIds = expectedWinners.filter(
        userId => !acceptedFinalUserIds.includes(userId)
      );
      const advancedLoserUserIds = expectedLosers.filter(
        userId => acceptedFinalUserIds.includes(userId)
      );
      const entries = F.collection("eventLeaderboardEntries")
        .find({ eventId, subEventId: qualifierStageId, entryType: "score" })
        .toArray();
      const totalsByGroupAndUser = {};
      entries.forEach(entry => {
        const key = `${entry.groupId}:${entry.memberId}`;
        totalsByGroupAndUser[key] = (totalsByGroupAndUser[key] || 0) + Number(entry.scoreValue || 0);
      });
      const calculatedWinners = (context.qualifierGroupIds || []).map(groupId =>
        Object.entries(totalsByGroupAndUser)
          .filter(([key]) => key.startsWith(`${groupId}:`))
          .map(([key, total]) => ({
            userId: key.slice(groupId.length + 1),
            total
          }))
          .sort((left, right) =>
            right.total - left.total || left.userId.localeCompare(right.userId)
          )[0]
      ).filter(Boolean);
      const marker = F.collection("schedulerPlanMarkers").findOne({
        wrapperType: "score",
        actionType: "group-members",
        ownerId: context.finalGroupId,
        scopeId: `score:${eventId}:${qualifierStageId}->${finalStageId}`
      });
      const rule = F.requireRule(job);
      const currentFingerprint = fingerprint({
        finalRows,
        marker: marker && {
          id: marker._id,
          fingerprint: marker.fingerprint,
          userIds: marker.userIds,
          updatedDate: marker.updatedDate
        }
      });
      const assignmentValid =
        fingerprint(acceptedFinalUserIds) === fingerprint(expectedWinners)
        && missingWinnerUserIds.length === 0
        && advancedLoserUserIds.length === 0;
      const rankingValid =
        fingerprint(calculatedWinners.map(item => item.userId).sort())
          === fingerprint(expectedWinners);
      const firstPassComplete = assignmentValid && rankingValid && Boolean(marker);
      const baseline = context.advancementBaseline || null;
      if (firstPassComplete && !baseline && snapshot) {
        F.collection(F.SNAPSHOT_COLLECTION).updateOne(
          { _id: snapshot._id },
          {
            $set: {
              "context.advancementBaseline": {
                fingerprint: currentFingerprint,
                capturedAtIso: F.nowIso()
              }
            }
          }
        );
      }
      const repeatedPassObserved = Boolean(
        baseline
        && rule.runState
        && rule.runState.lastRunCount === 0
      );
      return {
        quarantinedTournamentEvents: (context.isolatedEventIds || []).length,
        expectedWinnerUserIds: expectedWinners,
        calculatedWinners,
        acceptedFinalUserIds,
        missingWinnerUserIds,
        advancedLoserUserIds,
        staleLoserRows: finalRows.filter(row => row.userId === context.staleLoserUserId),
        finalRows,
        marker: marker && {
          ownerId: marker.ownerId,
          scopeId: marker.scopeId,
          userIds: marker.userIds,
          fingerprint: marker.fingerprint,
          updatedDate: marker.updatedDate
        },
        validation: {
          rankingValid,
          assignmentValid,
          exactWinnersOnly: assignmentValid && rankingValid,
          firstPassComplete,
          baselineCaptured: Boolean(baseline) || firstPassComplete,
          repeatedPassObserved,
          repeatedPassChangedZeroGroups: repeatedPassObserved,
          membershipAndMarkerUnchanged:
            repeatedPassObserved
            && baseline.fingerprint === currentFingerprint
        }
      };
    }
  });
})();
