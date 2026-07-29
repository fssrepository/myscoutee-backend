/* global AdminJobFixture */
(() => {
  "use strict";
  const F = AdminJobFixture;
  const job = "event-counter-expiry";
  const eventId = F.fixtureId(job, "event");
  const userId = F.fixtureId(job, "user");

  F.run({
    job,
    ruleKey: job,
    variations: ["event", "ticket-only"],
    build(variation) {
      const now = F.nowIso();
      const isolatedEventIds = F.collection("events")
        .find({
          _id: { $ne: eventId },
          expired: { $ne: true },
          sourceId: { $exists: true, $nin: ["", null] },
          $and: [
            {
              $or: [
                { status: "A" },
                { ticketing: true, status: { $ne: "T" } }
              ]
            },
            {
              $or: [
                { endAtIso: { $lte: now } },
                {
                  $and: [
                    { $or: [{ endAtIso: { $exists: false } }, { endAtIso: null }, { endAtIso: "" }] },
                    { startAtIso: { $lte: now } }
                  ]
                }
              ]
            }
          ]
        }, { projection: { _id: 1 } })
        .map(event => event._id)
        .toArray();
      return {
        pendingCount: 1,
        pendingCountUnit: "admin.jobs.table.affected",
        expected: variation === "event"
          ? "The fixture event becomes expired=true and the rule reports one due source."
          : "The ticket record becomes expired=true; the rule source count remains zero because ticket-only rows are tracked separately.",
        context: { eventId, userId, isolatedEventIds },
        specs: [
          { collection: "events", selector: { _id: { $in: [...isolatedEventIds, eventId] } } },
          { collection: "users", selector: { _id: userId } }
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
              expired: true,
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
        name: "Admin fixture counter owner",
        initials: "CF",
        status: "A",
        profileStatus: "public",
        activities: {
          event: { all: 99, active: 99, pending: 0, invitations: 0, hosting: 99, drafts: 0, trash: 0 }
        },
        createdDate: now,
        createdUser: F.FIXTURE_ACTOR,
        updatedDate: now,
        updatedUser: F.FIXTURE_ACTOR
      });
      F.collection("events").insertOne({
        _id: eventId,
        sourceId: eventId,
        syncKey: eventId,
        title: variation === "event" ? "Fixture expired active event" : "Fixture expired ticket-only record",
        status: variation === "event" ? "A" : "B",
        published: false,
        ticketing: variation === "ticket-only",
        expired: false,
        ownerUserId: userId,
        creatorUserId: userId,
        startAtIso: F.pastIso(120),
        endAtIso: F.pastIso(60),
        createdDate: now,
        createdUser: F.FIXTURE_ACTOR,
        updatedDate: now,
        updatedUser: F.FIXTURE_ACTOR
      });
    },
    status(context) {
      const event = F.collection("events").findOne({ _id: context.eventId || eventId });
      const user = F.collection("users").findOne({ _id: context.userId || userId });
      return {
        quarantinedPreexistingDueRecords: (context.isolatedEventIds || []).length,
        event: event && {
          id: event._id,
          status: event.status,
          ticketing: event.ticketing,
          expired: event.expired,
          updatedUser: event.updatedUser
        },
        ownerEventCounters: user && user.activities && user.activities.event
      };
    }
  });
})();
