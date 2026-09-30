/* global AdminJobFixture */
(() => {
  "use strict";
  const F = AdminJobFixture;
  const job = "event-counter-expiry";
  const eventId = F.fixtureId(job, "event");
  const controlEventId = F.fixtureId(job, "future-control");
  const userId = F.fixtureId(job, "user");
  const watchEventId = F.fixtureId(job, "watch-control");
  const watchOwnerId = F.fixtureId(job, "watch-owner");

  function domainFingerprint(event, controlEvent, user) {
    return JSON.stringify({
      event: event && {
        expired: event.expired,
        updatedDate: event.updatedDate,
        updatedUser: event.updatedUser
      },
      controlEvent: controlEvent && {
        expired: controlEvent.expired,
        startAtIso: controlEvent.startAtIso,
        endAtIso: controlEvent.endAtIso,
        updatedDate: controlEvent.updatedDate,
        updatedUser: controlEvent.updatedUser
      },
      activities: user && user.activities
    });
  }

  F.run({
    job,
    ruleKey: job,
    variations: ["event", "ticket-only", "start-fallback-future-control", "end-boundary"],
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
          : variation === "ticket-only"
            ? "The ticket record becomes expired=true; the rule source count remains zero because ticket-only rows are tracked separately."
            : variation === "end-boundary"
              ? "The event initially ends 90 seconds after preparation. A normal HTTP counter refresh must include both hosted events before that boundary; the real expiry worker later removes only the ended event. Recount and repeated expiry must retain exactly the future control."
              : "The active event with no endAtIso expires through its past startAtIso fallback, while the otherwise identical future control remains active and unmodified. Only one due source is reported and the owner's nested event counters retain exactly the future hosted event.",
        context: {
          eventId,
          controlEventId,
          watchEventId,
          userId,
          isolatedEventIds,
          variation,
          startFallback: variation === "start-fallback-future-control" || variation === "end-boundary",
          // A real end time also makes the existing friendship projection due.
          expectedFirstRunCount: variation === "ticket-only" ? 0 : variation === "end-boundary" ? 2 : 1
        },
        specs: [
          {
            collection: "events",
            selector: {
              _id: { $in: [...isolatedEventIds, eventId, controlEventId, watchEventId] }
            }
          },
          { collection: "users", selector: { _id: { $in: [userId, watchOwnerId] } } },
          { collection: "eventWatchSubscriptions", selector: { userId } },
          { collection: "userSessionStates", selector: { userId } },
          { collection: "userLoginAudits", selector: { userId } },
          { collection: "userNotifications", selector: { recipientUserId: userId } }
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
      const fixtureEvent = {
        _id: eventId,
        sourceId: eventId,
        syncKey: eventId,
        title: variation === "event"
          ? "Fixture expired active event"
          : variation === "ticket-only"
            ? "Fixture expired ticket-only record"
            : "Fixture start-only expired event",
        status: variation === "event" ? "A" : "B",
        published: false,
        ticketing: variation === "ticket-only",
        expired: false,
        ownerUserId: userId,
        creatorUserId: userId,
        startAtIso: F.pastIso(120),
        ...(variation === "start-fallback-future-control"
          ? { status: "A", published: true }
          : variation === "end-boundary"
            ? { status: "A", published: true, endAtIso: new Date(Date.now() + 90_000).toISOString() }
            : { endAtIso: F.pastIso(60) }),
        createdDate: now,
        createdUser: F.FIXTURE_ACTOR,
        updatedDate: now,
        updatedUser: F.FIXTURE_ACTOR
      };
      F.collection("events").insertOne(fixtureEvent);
      if (variation === "start-fallback-future-control" || variation === "end-boundary") {
        F.collection("events").insertOne({
          _id: controlEventId,
          sourceId: controlEventId,
          syncKey: controlEventId,
          title: "Fixture future start-only control",
          status: "A",
          published: true,
          ticketing: false,
          expired: false,
          ownerUserId: userId,
          creatorUserId: userId,
          startAtIso: F.futureIso(120),
          endAtIso: null,
          createdDate: now,
          createdUser: F.FIXTURE_ACTOR,
          updatedDate: now,
          updatedUser: F.FIXTURE_ACTOR
        });
      }
      if (variation === "end-boundary") {
        F.collection("users").insertOne({
          _id: watchOwnerId, userId: watchOwnerId, syncKey: watchOwnerId,
          name: "Counter QA watch control owner", status: "A", profileStatus: "public",
          createdDate: now, createdUser: F.FIXTURE_ACTOR
        });
        F.collection("events").insertOne({
          _id: watchEventId, sourceId: watchEventId, syncKey: watchEventId,
          title: "Counter QA public watch control", status: "A", published: true,
          expired: false, ownerUserId: watchOwnerId, creatorUserId: watchOwnerId,
          startAtIso: F.futureIso(120), endAtIso: F.futureIso(180),
          createdDate: now, createdUser: F.FIXTURE_ACTOR
        });
      }
    },
    trigger(context, snapshot) {
      if (context.variation !== "end-boundary" || !context.expiryBaseline) return;
      // The explicit HTTP recount includes a fresh login notification. Compare
      // the repeat worker with its own pre-run state, after those user actions.
      const event = F.collection("events").findOne({ _id: context.eventId });
      const control = F.collection("events").findOne({ _id: context.controlEventId });
      const user = F.collection("users").findOne({ _id: context.userId });
      F.collection(F.SNAPSHOT_COLLECTION).updateOne({ _id: snapshot._id }, {
        $set: { "context.repeatFingerprint": domainFingerprint(event, control, user) }
      });
    },
    status(context, snapshot) {
      const event = F.collection("events").findOne({ _id: context.eventId || eventId });
      const controlEvent = context.startFallback
        ? F.collection("events").findOne({
            _id: context.controlEventId || controlEventId
          })
        : null;
      const user = F.collection("users").findOne({ _id: context.userId || userId });
      const eventCounters = user && user.activities && user.activities.event;
      const rule = F.requireRule(job);
      const runState = rule.runState || {};
      const currentRunAtIso = F.safeText(
        runState.lastRunAtIso || runState.runFinishedAtIso
      );
      const preparedAtIso = F.safeText(snapshot && snapshot.preparedAtIso);
      const runObservedAfterPrepare =
        Number.isFinite(Date.parse(currentRunAtIso))
        && Number.isFinite(Date.parse(preparedAtIso))
        && Date.parse(currentRunAtIso) >= Date.parse(preparedAtIso);
      const baseline = context.expiryBaseline || null;
      const expectedFirstRunCount = Number(context.expectedFirstRunCount || 0);
      const firstPassRunCountExact = Boolean(baseline)
        || Boolean(
          runState.lastRunStatus === "completed"
          && runState.lastRunCount === expectedFirstRunCount
        );
      const dueEventExpired = Boolean(event && event.expired === true);
      const futureControlUnchanged = !context.startFallback
        || Boolean(
          controlEvent
          && controlEvent.expired === false
          && controlEvent.status === "A"
          && controlEvent.endAtIso === null
          && Date.parse(controlEvent.startAtIso) > Date.now()
          && controlEvent.updatedUser === F.FIXTURE_ACTOR
        );
      const ownerCountersValid = context.startFallback
        ? Boolean(
          user
          && user.activities
          && user.activities.invitations === 0
          && user.activities.events === 0
          && user.activities.hosting === 1
          && eventCounters
          && eventCounters.all === 1
          && eventCounters.active === 0
          && eventCounters.pending === 0
          && eventCounters.invitations === 0
          && eventCounters.hosting === 1
          && eventCounters.drafts === 0
          && eventCounters.trash === 0
        )
        : context.variation === "ticket-only"
          ? Boolean(eventCounters && eventCounters.all === 99)
          : Boolean(
            user
            && user.activities
            && user.activities.invitations === 0
            && user.activities.events === 0
            && user.activities.hosting === 0
            && eventCounters
            && eventCounters.all === 0
          );
      const currentFingerprint = domainFingerprint(event, controlEvent, user);
      const firstPassComplete = dueEventExpired
        && futureControlUnchanged
        && ownerCountersValid
        && runObservedAfterPrepare
        && firstPassRunCountExact;
      if (firstPassComplete && !baseline && snapshot) {
        F.collection(F.SNAPSHOT_COLLECTION).updateOne(
          { _id: snapshot._id },
          {
            $set: {
              "context.expiryBaseline": {
                fingerprint: currentFingerprint,
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
        quarantinedPreexistingDueRecords: (context.isolatedEventIds || []).length,
        event: event && {
          id: event._id,
          status: event.status,
          ticketing: event.ticketing,
          expired: event.expired,
          updatedUser: event.updatedUser
        },
        futureControl: controlEvent && {
          id: controlEvent._id,
          status: controlEvent.status,
          startAtIso: controlEvent.startAtIso,
          endAtIso: controlEvent.endAtIso,
          expired: controlEvent.expired,
          updatedUser: controlEvent.updatedUser
        },
        ownerEventCounters: eventCounters,
        validation: {
          dueEventExpired,
          futureControlUnchanged,
          ownerCountersValid,
          expectedFirstRunCount,
          firstPassRunCountExact,
          runObservedAfterPrepare,
          firstPassComplete,
          baselineCaptured: Boolean(baseline) || firstPassComplete,
          repeatedPassObserved,
          repeatedPassChangedZeroSources: repeatedPassObserved,
          eventControlAndCountersUnchanged:
            repeatedPassObserved
            && (context.repeatFingerprint || baseline.fingerprint) === currentFingerprint
        }
      };
    }
  });
})();
