/* global AdminJobFixture */
(() => {
  "use strict";
  const F = AdminJobFixture;
  const job = "event-tournament-review";
  const eventId = F.fixtureId(job, "event");
  const stageId = F.fixtureId(job, "stage");
  const qualifierStageId = F.fixtureId(job, "qualifier");
  const finalStageId = F.fixtureId(job, "final");

  function advancementContext(scoreTie = false, noAdvancers = false) {
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
    const memberNames = userIds.map((_, index) => `Tournament Fixture ${index + 1}`);
    return {
      advancement: true,
      scoreTie,
      noAdvancers,
      userIds,
      memberNames,
      scoreValues: scoreTie ? [10, 10, 2, 8, 8, 1] : [2, 10, 3, 4, 9, 1],
      qualifierGroupIds,
      finalGroupId,
      qualifierGroupOwnerIds,
      finalGroupOwnerId,
      expectedWinnerUserIds: noAdvancers
        ? []
        : scoreTie
          ? [userIds[0], userIds[3]]
          : [userIds[1], userIds[4]],
      expectedLoserUserIds: noAdvancers
        ? userIds
        : scoreTie
          ? [userIds[1], userIds[2], userIds[4], userIds[5]]
          : [userIds[0], userIds[2], userIds[3], userIds[5]],
      expectedFirstRunCount: 2,
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
    variations: [
      "ended",
      "future",
      "advancement",
      "advancement-score-tie",
      "no-advancers-clears-stale"
    ],
    build(variation) {
      const isolatedEventIds = tournamentEventIds();
      const advancement = [
        "advancement",
        "advancement-score-tie",
        "no-advancers-clears-stale"
      ].includes(variation)
        ? advancementContext(
            variation === "advancement-score-tie",
            variation === "no-advancers-clears-stale"
          )
        : null;
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
            : variation === "advancement"
              ? "The scheduled rule ranks two finalized Score groups, advances exactly user-2 and user-5 into the final, removes the pre-seeded loser, and a repeated pass changes zero groups."
              : variation === "advancement-score-tie"
                ? "Each finalized Score group has a tied top score; the scheduled rule advances the lexicographically first member name from each tie, removes the pre-seeded loser, and a repeated pass changes zero groups."
                : "The finalized qualifier has scores but no accepted group members, so no user may advance; the scheduled rule moves the final to start review, clears the stale final member, persists an empty score marker, reports the two changed stage/group units, and a repeated pass changes zero groups.",
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

      if (!context.advancement) {
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
        name: context.memberNames[index],
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
        status: context.noAdvancers ? "disqualified" : "accepted",
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

      F.collection("eventLeaderboardEntries").insertMany(context.userIds.map((userId, index) => ({
        _id: context.leaderboardEntryIds[index],
        syncKey: context.leaderboardEntryIds[index],
        eventId,
        subEventId: qualifierStageId,
        groupId: context.qualifierGroupIds[index < 3 ? 0 : 1],
        entryType: "score",
        memberId: userId,
        scoreValue: context.scoreValues[index],
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
      if ([
        "advancement",
        "advancement-score-tie",
        "no-advancers-clears-stale"
      ].includes(variation)) {
        print(
          `[admin-job-fixtures] The six synthetic winners/losers have no affinity edges on purpose. `
            + `Ranking must still advance the exact winners; affinity may only influence their later grouping.`
        );
      }
      if (variation === "no-advancers-clears-stale") {
        print(
          `[admin-job-fixtures] Qualifier score rows exist, but every qualifier membership is disqualified. `
            + `The scheduler must not promote a scored user who is no longer accepted.`
        );
      }
    },
    status(context, snapshot) {
      const event = F.collection("events").findOne({ _id: context.eventId || eventId });
      if (!snapshot || !context.advancement) {
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
      const qualifierRows = (context.qualifierGroupOwnerIds || [])
        .flatMap(ownerId => memberRows(ownerId));
      const acceptedQualifierUserIds = qualifierRows
        .filter(row => row.status === "accepted")
        .map(row => row.userId)
        .sort();
      const acceptedQualifierUserIdSet = new Set(acceptedQualifierUserIds);
      const totalsByGroupAndUser = {};
      entries.forEach(entry => {
        const key = `${entry.groupId}:${entry.memberId}`;
        totalsByGroupAndUser[key] = (totalsByGroupAndUser[key] || 0) + Number(entry.scoreValue || 0);
      });
      const memberNamesByUserId = Object.fromEntries(
        (context.userIds || []).map((userId, index) => [
          userId,
          (context.memberNames || [])[index] || userId
        ])
      );
      const calculatedWinners = (context.qualifierGroupIds || []).map(groupId =>
        Object.entries(totalsByGroupAndUser)
          .filter(([key]) => key.startsWith(`${groupId}:`))
          .filter(([key]) => acceptedQualifierUserIdSet.has(
            key.slice(groupId.length + 1)
          ))
          .map(([key, total]) => ({
            userId: key.slice(groupId.length + 1),
            total
          }))
          .sort((left, right) =>
            right.total - left.total
              || memberNamesByUserId[left.userId].localeCompare(memberNamesByUserId[right.userId])
              || left.userId.localeCompare(right.userId)
          )[0]
      ).filter(Boolean);
      const tiedTopGroups = (context.qualifierGroupIds || []).map(groupId => {
        const rows = Object.entries(totalsByGroupAndUser)
          .filter(([key]) => key.startsWith(`${groupId}:`))
          .map(([key, total]) => ({
            userId: key.slice(groupId.length + 1),
            memberName: memberNamesByUserId[key.slice(groupId.length + 1)],
            total
          }))
          .sort((left, right) =>
            right.total - left.total
              || left.memberName.localeCompare(right.memberName)
              || left.userId.localeCompare(right.userId)
          );
        const topTotal = rows.length > 0 ? rows[0].total : null;
        return {
          groupId,
          topTotal,
          tiedUserIds: rows
            .filter(row => row.total === topTotal)
            .map(row => row.userId),
          deterministicWinnerUserId: rows.length > 0 ? rows[0].userId : null
        };
      });
      const marker = F.collection("schedulerPlanMarkers").findOne({
        wrapperType: "score",
        actionType: "group-members",
        ownerId: context.finalGroupId,
        scopeId: `score:${eventId}:${qualifierStageId}->${finalStageId}`
      });
      const rule = F.requireRule(job);
      const baseline = context.advancementBaseline || null;
      const staleLoserRows = finalRows.filter(
        row => row.userId === context.staleLoserUserId
      );
      const exactMarkerUserIds = Boolean(marker)
        && fingerprint([...(marker.userIds || [])].sort()) === fingerprint(expectedWinners);
      const emptyScoreMarkerValid = !context.noAdvancers
        || Boolean(
          marker
          && Array.isArray(marker.userIds)
          && marker.userIds.length === 0
          && marker.fingerprint === ""
        );
      const staleLoserDeleted = staleLoserRows.length === 1
        && staleLoserRows[0].status === "deleted";
      const firstPassRunCountExact = Boolean(baseline)
        || Boolean(
          rule.runState
          && rule.runState.lastRunStatus === "completed"
          && rule.runState.lastRunCount === context.expectedFirstRunCount
        );
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
      const deterministicScoreTieBreak = !context.scoreTie
        || (tiedTopGroups.length === (context.qualifierGroupIds || []).length
          && tiedTopGroups.every(group => group.tiedUserIds.length >= 2)
          && fingerprint(tiedTopGroups.map(group => group.deterministicWinnerUserId).sort())
            === fingerprint(expectedWinners));
      const qualifierEligibilityValid = !context.noAdvancers
        || (
          acceptedQualifierUserIds.length === 0
          && qualifierRows.length === (context.userIds || []).length
          && qualifierRows.every(row => row.status === "disqualified")
          && entries.length === (context.userIds || []).length
        );
      const firstPassComplete = assignmentValid
        && rankingValid
        && deterministicScoreTieBreak
        && qualifierEligibilityValid
        && exactMarkerUserIds
        && emptyScoreMarkerValid
        && staleLoserDeleted
        && firstPassRunCountExact;
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
        && rule.runState.lastRunStatus === "completed"
        && rule.runState.lastRunCount === 0
      );
      return {
        quarantinedTournamentEvents: (context.isolatedEventIds || []).length,
        expectedWinnerUserIds: expectedWinners,
        scoreTie: Boolean(context.scoreTie),
        noAdvancers: Boolean(context.noAdvancers),
        expectedFirstRunCount: context.expectedFirstRunCount,
        tiedTopGroups: context.scoreTie ? tiedTopGroups : [],
        acceptedQualifierUserIds,
        qualifierRows,
        calculatedWinners,
        acceptedFinalUserIds,
        missingWinnerUserIds,
        advancedLoserUserIds,
        staleLoserRows,
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
          deterministicScoreTieBreak,
          qualifierEligibilityValid,
          assignmentValid,
          exactWinnersOnly: assignmentValid && rankingValid,
          exactMarkerUserIds,
          emptyScoreMarkerValid,
          staleLoserDeleted,
          firstPassChangedExpectedGroups: firstPassRunCountExact,
          firstPassRunCountExact,
          firstPassChangedExactlyTwoRecords:
            context.expectedFirstRunCount === 2 ? firstPassRunCountExact : null,
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
