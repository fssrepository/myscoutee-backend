/* global AdminJobFixture */
(() => {
  "use strict";
  const F = AdminJobFixture;
  const job = "event-tournament-review";
  const eventId = F.fixtureId(job, "event");
  const stageId = F.fixtureId(job, "stage");

  F.run({
    job,
    ruleKey: job,
    variations: ["ended", "future"],
    build(variation) {
      const isolatedEventIds = F.collection("events")
        .find({
          published: true,
          _id: { $ne: eventId },
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
      return {
        pendingCount: 1,
        pendingCountUnit: "admin.jobs.table.affected",
        expected: variation === "ended"
          ? "The active stage changes to stageStatus=SR, reason=stage-ended, with stageStatusUpdatedAt set."
          : "The active first stage changes to stageStatus=RS, reason=awaiting-tournament-start, with stageStatusUpdatedAt set.",
        context: { eventId, stageId, isolatedEventIds },
        specs: [
          { collection: "events", selector: { _id: { $in: [...isolatedEventIds, eventId] } } }
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
    },
    afterPrepare() {
      print(
        `[admin-job-fixtures] Existing tournament-capable demo events were temporarily quarantined. `
          + `This avoids the global review pass changing dozens of stages; reset this job when finished.`
      );
    },
    status(context) {
      const event = F.collection("events").findOne({ _id: context.eventId || eventId });
      const stage = event && (event.subEvents || []).find(item => item.id === (context.stageId || stageId));
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
  });
})();
