/* global ManualQa, UUID, db, process */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "event-domain";
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const checkpointId = Q.text(process.env.MANUAL_QA_CHECKPOINT_ID).toUpperCase();
  const sourceCheckpointId = Q.text(process.env.MANUAL_QA_SOURCE_CHECKPOINT_ID).toUpperCase();
  const requestedDelaySeconds = Number.parseInt(
    Q.text(process.env.MANUAL_QA_DELAY_SECONDS) || "30",
    10
  );
  const hostUserId = Q.text(process.env.MANUAL_QA_CREATOR_USER_ID)
    || "650000000000000000000061";
  const participantUserId = Q.text(process.env.MANUAL_QA_INVITEE_USER_ID)
    || "650000000000000000000062";
  const thirdUserId = "650000000000000000000063";
  const visibilityFriendUserId = "178e8d0cbe164fa3fede5884";
  const visibilityNonFriendUserId = "2d520f3c98b0440c1556f4af";
  const PREFIX = "manual-qa-checkpoint:v1:event-domain";
  const EVENT_ID = `${PREFIX}:event`;
  const ISOLATION_EVENT_ID = `${PREFIX}:ticket-isolation-control`;
  const LOCKED_EVENT_ID = `${PREFIX}:feedback-locked`;
  const TRASHED_EVENT_ID = `${PREFIX}:feedback-trashed`;
  const PENDING_EVENT_ID = `${PREFIX}:feedback-pending`;
  const EVENT_IDS = [EVENT_ID, ISOLATION_EVENT_ID, LOCKED_EVENT_ID, TRASHED_EVENT_ID, PENDING_EVENT_ID];
  const AUTO_INVITER_RULE = "event-auto-inviter";
  const TOURNAMENT_REVIEW_RULE = "event-tournament-review";
  const TOURNAMENT_ROOM_LIFE_CHECKPOINT = "TOURNAMENT-ROOM-LIFE-001";
  const TOURNAMENT_ROOM_LIFE_STATE_ID = `${PREFIX}:tournament-room-life:state`;
  const TOURNAMENT_ROOM_LIFE_PREFIX = `${PREFIX}:tournament-room-life`;
  const TOURNAMENT_ROOM_LIFE_EVENT_ID = `${TOURNAMENT_ROOM_LIFE_PREFIX}:event`;
  const TOURNAMENT_ROOM_LIFE_QUALIFIER_ID = "qualifiers";
  const TOURNAMENT_ROOM_LIFE_FINAL_ID = "final";
  const TOURNAMENT_ROOM_LIFE_GROUP_A = "qualifiers:group:1";
  const TOURNAMENT_ROOM_LIFE_GROUP_B = "qualifiers:group:2";
  const TOURNAMENT_ROOM_LIFE_ROOM_A = `random-room:${TOURNAMENT_ROOM_LIFE_EVENT_ID}:${TOURNAMENT_ROOM_LIFE_QUALIFIER_ID}:${TOURNAMENT_ROOM_LIFE_GROUP_A}`;
  const TOURNAMENT_ROOM_LIFE_ROOM_B = `random-room:${TOURNAMENT_ROOM_LIFE_EVENT_ID}:${TOURNAMENT_ROOM_LIFE_QUALIFIER_ID}:${TOURNAMENT_ROOM_LIFE_GROUP_B}`;
  const TOURNAMENT_CARD_CHECKPOINT = "TOURNAMENT-CARD-001";
  const TOURNAMENT_CARD_PREFIX = `${PREFIX}:tournament-card`;
  const TOURNAMENT_CARD_STATE_ID = `${TOURNAMENT_CARD_PREFIX}:state`;
  const TOURNAMENT_CARD_EVENT_ID = `${TOURNAMENT_CARD_PREFIX}:event`;
  const TOURNAMENT_CARD_QUALIFIER_ID = "qualifiers";
  const TOURNAMENT_CARD_FINAL_ID = "final";
  const TOURNAMENT_ROOM_IMAGE_URL = "/media/public?key=images/system/tournament-room/v1/large.webp";
  const AUTO_INVITER_HOLD_SECONDS = 3600;
  const AUTO_INVITER_INITIAL_EDGE_ID = `${PREFIX}:auto-inviter-initial-edge`;
  const AUTO_INVITER_LATER_EDGE_ID = `${PREFIX}:auto-inviter-later-edge`;
  const eventImageUrl = Q.text(process.env.MANUAL_QA_EVENT_IMAGE_URL);
  const EXPECTED_TITLE = `QA ${checkpointId}`;

  function newFixtureTicketCode() {
    return `TKT-${UUID().toUUID().toString()}`;
  }

  function optionalField(source, key) {
    return source && Object.prototype.hasOwnProperty.call(source, key)
      ? { present: true, value: source[key] }
      : { present: false, value: null };
  }

  function userActivitiesSnapshot(userId) {
    const user = Q.collection("users").findOne({
      $or: [{ _id: userId }, { userId }]
    });
    if (!user) Q.fail(`user '${userId}' was not found while activity counters were snapshotted.`);
    return {
      userId,
      activities: optionalField(user, "activities")
    };
  }

  function restoreUserActivities(saved) {
    if (!saved || !Q.text(saved.userId)) return;
    const update = saved.activities && saved.activities.present
      ? { $set: { activities: saved.activities.value } }
      : { $unset: { activities: "" } };
    const result = Q.collection("users").updateOne({
      $or: [{ _id: saved.userId }, { userId: saved.userId }]
    }, update);
    if (result.matchedCount !== 1) {
      Q.fail(`user '${saved.userId}' disappeared before activity counters could be restored.`);
    }
  }

  function feedbackCounterSnapshot(saved) {
    const activities = saved && saved.activities && saved.activities.present
      ? saved.activities.value || {}
      : {};
    const eventFeedback = activities.eventFeedback || {};
    return {
      ownEvents: normalizeActivityCount(eventFeedback.ownEvents),
      pending: normalizeActivityCount(eventFeedback.pending),
      feedbacked: normalizeActivityCount(eventFeedback.feedbacked),
      removed: normalizeActivityCount(eventFeedback.removed)
    };
  }

  function savedUserActivity(state, userId) {
    return (state.userActivitySnapshots || []).find(saved => saved.userId === userId) || null;
  }

  function applyFeedbackFixtureCounters(state, userId, delta) {
    const saved = savedUserActivity(state, userId);
    if (!saved) Q.fail(`feedback stage has no activity snapshot for '${userId}'.`);
    const baseline = feedbackCounterSnapshot(saved);
    const next = {
      ownEvents: Math.max(0, baseline.ownEvents + normalizeActivityCount(delta.ownEvents)),
      pending: Math.max(0, baseline.pending + normalizeActivityCount(delta.pending)),
      feedbacked: Math.max(0, baseline.feedbacked + normalizeActivityCount(delta.feedbacked)),
      removed: Math.max(0, baseline.removed + normalizeActivityCount(delta.removed))
    };
    const result = Q.collection("users").updateOne({
      $or: [{ _id: userId }, { userId }]
    }, {
      $set: {
        "activities.feedback": next.pending + next.ownEvents,
        "activities.eventFeedback.ownEvents": next.ownEvents,
        "activities.eventFeedback.pending": next.pending,
        "activities.eventFeedback.feedbacked": next.feedbacked,
        "activities.eventFeedback.removed": next.removed
      }
    });
    if (result.matchedCount !== 1) Q.fail(`feedback counter target '${userId}' disappeared.`);
  }

  function insertPendingFeedbackEligibility(stagedAtIso, viewerUserId = participantUserId) {
    const normalizedViewerUserId = Q.text(viewerUserId);
    Q.collection("eventFeedbackStates").insertOne({
      _id: normalizedViewerUserId === participantUserId
        ? `${PREFIX}:feedback-state`
        : `${PREFIX}:feedback-state:${normalizedViewerUserId}`,
      syncKey: normalizedViewerUserId === participantUserId
        ? `${PREFIX}:feedback-state`
        : `${PREFIX}:feedback-state:${normalizedViewerUserId}`,
      viewerUserId: normalizedViewerUserId,
      eventId: EVENT_ID,
      removed: false,
      eligible: true,
      counterTracked: true,
      submittedAtIso: null,
      removedAtIso: null,
      organizerNote: "",
      createdDate: stagedAtIso,
      createdUser: "event-feedback-counter",
      updatedDate: stagedAtIso,
      updatedUser: "event-feedback-counter"
    });
  }

  function stageFeedbackProjection(stageKind, stagedAtIso, state) {
    if (stageKind !== "feedback-empty" && stageKind !== "feedback-submitted") return;
    if (stageKind === "feedback-empty") {
      insertPendingFeedbackEligibility(stagedAtIso);
    } else {
      Q.collection("eventFeedbackStates").updateOne({
        viewerUserId: participantUserId,
        eventId: EVENT_ID
      }, {
        $set: { eligible: true, counterTracked: true }
      });
    }
    if (checkpointId === "EVENT-FEEDBACK-002") {
      insertPendingFeedbackEligibility(stagedAtIso, thirdUserId);
    }
    applyFeedbackFixtureCounters(state, hostUserId, stageKind === "feedback-empty"
      ? { ownEvents: 0, pending: 0, feedbacked: 0, removed: 0 }
      : { ownEvents: 1, pending: 0, feedbacked: 0, removed: 0 });
    applyFeedbackFixtureCounters(state, participantUserId, stageKind === "feedback-empty"
      ? { ownEvents: 0, pending: 1, feedbacked: 0, removed: 0 }
      : { ownEvents: 0, pending: 0, feedbacked: 1, removed: 0 });
    if (checkpointId === "EVENT-FEEDBACK-002") {
      applyFeedbackFixtureCounters(state, thirdUserId, {
        ownEvents: 0, pending: 1, feedbacked: 0, removed: 0
      });
    }
  }

  function backfillLegacyFeedbackHostSnapshot(state) {
    if (!Q.text(state && state.checkpointId).startsWith("EVENT-FEEDBACK-")
        || savedUserActivity(state, hostUserId)) return;
    const saved = userActivitiesSnapshot(hostUserId);
    const event = Q.collection("events").findOne(manualEventSelector()) || {};
    const trackedOwners = Array.isArray(event.feedbackOwnEventCounterUserIds)
      ? event.feedbackOwnEventCounterUserIds
      : [];
    if (saved.activities && saved.activities.present && trackedOwners.includes(hostUserId)) {
      const activities = saved.activities.value || {};
      const counters = activities.eventFeedback || {};
      activities.eventFeedback = {
        ...counters,
        ownEvents: Math.max(0, normalizeActivityCount(counters.ownEvents) - 1)
      };
      saved.activities.value = activities;
    }
    const snapshots = [...(state.userActivitySnapshots || []), saved];
    state.userActivitySnapshots = snapshots;
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: state._id },
      { $set: { userActivitySnapshots: snapshots } }
    );
  }

  function projectedFeedbackBaselineOutsideFixture(userId) {
    const excludedEventIds = currentEventIds();
    const ownedEventSourceIds = Q.collection("events").distinct("sourceId", {
      sourceId: { $nin: excludedEventIds },
      status: { $ne: "T" },
      generated: { $ne: true },
      $or: [
        { ownerUserId: userId },
        { creatorUserId: userId },
        { admins: userId }
      ]
    });
    const viewerStates = Q.collection("eventFeedbackStates").find({
      viewerUserId: userId,
      eventId: { $nin: excludedEventIds },
      eligible: true,
      counterTracked: true
    }).toArray();
    const receivedStates = ownedEventSourceIds.length === 0
      ? []
      : Q.collection("eventFeedbackStates").find({
          eventId: { $in: ownedEventSourceIds },
          submittedAtIso: { $nin: [null, ""] },
          removed: { $ne: true }
        }).toArray();
    const result = {
      ownEvents: receivedStates.length,
      pending: 0,
      feedbacked: 0,
      removed: 0
    };
    for (const state of viewerStates) {
      if (state.removed === true) result.removed += 1;
      else if (Q.text(state.submittedAtIso)) result.feedbacked += 1;
      else result.pending += 1;
    }
    return result;
  }

  function reconcileLegacyFeedbackSnapshots(state) {
    if (!Q.text(state && state.checkpointId).startsWith("EVENT-FEEDBACK-")) return;
    const snapshots = [...(state.userActivitySnapshots || [])];
    const feedbackUserIds = checkpointId === "EVENT-FEEDBACK-002"
      ? [hostUserId, participantUserId, thirdUserId]
      : [hostUserId, participantUserId];
    for (const userId of feedbackUserIds) {
      let saved = snapshots.find(item => item.userId === userId);
      if (!saved) {
        saved = userActivitiesSnapshot(userId);
        snapshots.push(saved);
      }
      if (!saved.activities || !saved.activities.present) continue;
      const activities = saved.activities.value || {};
      const baseline = projectedFeedbackBaselineOutsideFixture(userId);
      activities.feedback = baseline.pending + baseline.ownEvents;
      activities.eventFeedback = baseline;
      saved.activities.value = activities;
    }
    state.userActivitySnapshots = snapshots;
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: state._id },
      { $set: { userActivitySnapshots: snapshots } }
    );
  }

  function normalizeActivityCount(value) {
    const count = Number(value);
    return Number.isFinite(count) ? Math.max(0, Math.trunc(count)) : 0;
  }

  function synchronizeEventActivityCounters(requestedUserIds) {
    const userIds = sortedUnique(Array.isArray(requestedUserIds) ? requestedUserIds : [requestedUserIds]);
    const deletedMembershipSourceIdsByUserId = new Map(userIds.map(userId => [userId, new Set()]));
    for (const member of Q.collection("activityMembers").find({
      ownerType: "event",
      userId: { $in: userIds }
    }).toArray()) {
      const userId = Q.text(member.userId);
      if (!deletedMembershipSourceIdsByUserId.has(userId)) continue;
      const status = Q.text(member.status).toUpperCase();
      if (status === "DELETED" || status === "D") {
        const sourceId = Q.text(member.ownerId);
        if (sourceId) deletedMembershipSourceIdsByUserId.get(userId).add(sourceId);
      }
    }

    const relevantEvents = Q.collection("events").find({
      generated: { $ne: true },
      sourceId: { $exists: true, $ne: "" },
      $or: [
        { ownerUserId: { $in: userIds } },
        { admins: { $in: userIds } },
        { acceptedMemberUserIds: { $in: userIds } },
        { invitedMemberUserIds: { $in: userIds }, status: "A" },
        { pendingRequestMemberUserIds: { $in: userIds } }
      ]
    }).toArray();
    const sourceIdsByUserId = new Map(userIds.map(userId => [
      userId,
      new Set(deletedMembershipSourceIdsByUserId.get(userId))
    ]));
    for (const event of relevantEvents) {
      const ownerUserId = Q.text(event.ownerUserId);
      const admins = sortedUnique(event.admins || []);
      const accepted = sortedUnique(event.acceptedMemberUserIds || []);
      const invited = sortedUnique(event.invitedMemberUserIds || []);
      const pending = sortedUnique(event.pendingRequestMemberUserIds || []);
      const status = Q.text(event.status).toUpperCase();
      const generated = event.generated === true
        || Q.text(event.parentEventId)
        || Q.text(event.eventType).toLowerCase() === "slot";
      const sourceId = generated
        ? Q.text(event.parentEventId)
        : Q.text(event.sourceId);
      if (!sourceId) continue;
      for (const userId of userIds) {
        if (ownerUserId === userId
            || admins.includes(userId)
            || accepted.includes(userId)
            || (status === "A" && invited.includes(userId))
            || pending.includes(userId)) {
          sourceIdsByUserId.get(userId).add(sourceId);
        }
      }
    }

    const allSourceIds = sortedUnique(
      [...sourceIdsByUserId.values()].flatMap(sourceIds => [...sourceIds])
    );
    const eventsBySourceId = new Map();
    if (allSourceIds.length > 0) {
      for (const event of Q.collection("events").find({ sourceId: { $in: allSourceIds } }).toArray()) {
        const sourceId = Q.text(event.sourceId);
        if (!eventsBySourceId.has(sourceId)) eventsBySourceId.set(sourceId, []);
        eventsBySourceId.get(sourceId).push(event);
      }
    }

    const eventStatus = event => Q.text(event && event.status).toUpperCase();
    const eventAdmins = event => sortedUnique(event && event.admins || []);
    const isTrash = event => event && (event.isTrashed === true || eventStatus(event) === "T");
    const isActive = event => event && (eventStatus(event) === "A" || !eventStatus(event));
    const isHosting = (event, userId) => event && userId
      && (Q.text(event.creatorUserId) === userId || eventAdmins(event).includes(userId));
    const preference = (event, userId) => {
      if (!event) return 0;
      const creatorUserId = Q.text(event.creatorUserId);
      return (Q.text(event.ownerUserId) === userId ? 64 : 0)
        + (isTrash(event) ? 0 : 16)
        + (isHosting(event, creatorUserId) ? 8 : 0)
        + (isActive(event) ? 2 : 0)
        + (eventAdmins(event).length > 0 ? 1 : 0);
    };

    for (const userId of userIds) {
      const counters = {
        active: 0,
        pending: 0,
        invitations: 0,
        hosting: 0,
        drafts: 0,
        trash: 0
      };
      for (const sourceId of sourceIdsByUserId.get(userId)) {
        let preferred = null;
        for (const event of eventsBySourceId.get(sourceId) || []) {
          if (!preferred || preference(event, userId) > preference(preferred, userId)) preferred = event;
        }
        if (!preferred) continue;
        if (isTrash(preferred)) {
          // Organizer Trash is a global event suppression, not a participant
          // leave. Only the host/admin owns this bucket; accepted members lose
          // Active/All without receiving a personal Trash entry.
          if (isHosting(preferred, userId)) counters.trash += 1;
          continue;
        }
        if (deletedMembershipSourceIdsByUserId.get(userId).has(sourceId)) {
          counters.trash += 1;
          continue;
        }
        if (sortedUnique(preferred.invitedMemberUserIds || []).includes(userId)) {
          counters.invitations += 1;
          continue;
        }
        if (isHosting(preferred, userId)) {
          counters.hosting += 1;
          if (preferred.published === false || eventStatus(preferred) === "DR") counters.drafts += 1;
          if (["UR", "B"].includes(eventStatus(preferred))) counters.pending += 1;
          continue;
        }
        if (sortedUnique(preferred.pendingRequestMemberUserIds || []).includes(userId)
            || ["UR", "B"].includes(eventStatus(preferred))) {
          counters.pending += 1;
          continue;
        }
        if (sortedUnique(preferred.acceptedMemberUserIds || []).includes(userId) || isActive(preferred)) {
          counters.active += 1;
        }
      }
      const all = counters.active + counters.pending + counters.invitations + counters.hosting;
      const result = Q.collection("users").updateOne({
        $or: [{ _id: userId }, { userId }]
      }, { $set: {
        "activities.invitations": counters.invitations,
        "activities.events": counters.active,
        "activities.hosting": counters.hosting,
        "activities.event.all": all,
        "activities.event.active": counters.active,
        "activities.event.pending": counters.pending,
        "activities.event.invitations": counters.invitations,
        "activities.event.hosting": counters.hosting,
        "activities.event.drafts": counters.drafts,
        "activities.event.trash": counters.trash
      } });
      if (result.matchedCount !== 1) {
        Q.fail(`user '${userId}' disappeared while baseline activity counters were synchronized.`);
      }
    }
  }

  function applyEventActivityCounterDeltas(userId, deltas) {
    const user = Q.collection("users").findOne({
      $or: [{ _id: userId }, { userId }]
    });
    if (!user) Q.fail(`user '${userId}' disappeared while event activity counter deltas were applied.`);
    const activities = user.activities || {};
    const event = activities.event || {};
    const valueAfterDelta = (value, delta) => Math.max(
      0,
      normalizeActivityCount(value) + Math.trunc(Number(delta) || 0)
    );
    const update = {};
    for (const [key, delta] of Object.entries(deltas.event || {})) {
      update[`activities.event.${key}`] = valueAfterDelta(event[key], delta);
    }
    for (const [key, delta] of Object.entries(deltas.menu || {})) {
      update[`activities.${key}`] = valueAfterDelta(activities[key], delta);
    }
    if (Object.keys(update).length === 0) return;
    const result = Q.collection("users").updateOne({
      $or: [{ _id: userId }, { userId }]
    }, { $set: update });
    if (result.matchedCount !== 1) {
      Q.fail(`user '${userId}' disappeared while event activity counter deltas were applied.`);
    }
  }

  function applyTicketActivityCounterDelta(userId, delta) {
    const user = Q.collection("users").findOne({
      $or: [{ _id: userId }, { userId }]
    });
    if (!user) Q.fail(`user '${userId}' disappeared while ticket activity counters were applied.`);
    const activities = user.activities || {};
    const asset = activities.asset || {};
    const valueAfterDelta = value => Math.max(
      0,
      normalizeActivityCount(value) + Math.trunc(Number(delta) || 0)
    );
    const result = Q.collection("users").updateOne({
      $or: [{ _id: userId }, { userId }]
    }, { $set: {
      "activities.tickets": valueAfterDelta(activities.tickets),
      "activities.asset.tickets": valueAfterDelta(asset.tickets)
    } });
    if (result.matchedCount !== 1) {
      Q.fail(`user '${userId}' disappeared while ticket activity counters were applied.`);
    }
  }

  function isTicketingStage(stageKind) {
    return [
      "ticketing-off",
      "ticketing-on",
      "ticket-ready",
      "ticket-join",
      "ticket-invitation",
      "ticket-expiring",
      "ticket-isolation"
    ].includes(stageKind);
  }

  function hasTicketPendingControl() {
    return ["EVENT-TICKET-002", "EVENT-TICKET-POLL-001", "EVENT-TICKET-008"].includes(checkpointId);
  }

  function isFriendPair(firstUserId, secondUserId) {
    const first = Q.text(firstUserId);
    const second = Q.text(secondUserId);
    if (!first || !second || first === second) return false;
    const lower = first <= second ? first : second;
    const upper = first <= second ? second : first;
    const value = `friend-pair:${lower}:${upper}`;
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
      hash = (hash * 31 + value.charCodeAt(index)) % 104729;
    }
    return (Math.abs(hash) % 100) < 32;
  }

  const CHECKPOINTS = {
    "EVENT-EDITOR-001": {
      stage: "editor-empty",
      why: "Prove that Event Editor creation persists one canonical draft rather than only updating local form state.",
      action: `As host, create one casual draft titled exactly '${EXPECTED_TITLE}'. Use capacity 2-8, location label 'Austin, TX', description 'Manual QA draft persistence checkpoint.', Invitation only, Open Event, topics Music and Outdoors, Auto inviter Off, Ticketing Off, Auto approve On, Sub Events Off, Slots Off, Pricing Off, Event Policies Off, and a one-time local 18:00-20:00 range. Save once, close it and reopen it from Drafts/Hosting.`,
      expected: "Exactly one canonical draft exists and every entered field reopens unchanged; the event keeps the free-text venue label but its proximity coordinates equal the host user's current coordinates; it is absent from every unrelated-user event bucket.",
      worker: "MUST RUN on Save: one event recompute. Close, reopen and refresh MUST NOT RUN another task."
    },
    "EVENT-EDITOR-002": {
      stage: "draft",
      why: "Prove that publish is a separate canonical lifecycle checkpoint with visibility enforcement.",
      action: "As host, publish the staged draft once; compare host Hosting and unrelated-user Explore.",
      expected: "The same event becomes active once, survives reopen and is visible only to users allowed by its visibility setting.",
      worker: "MUST RUN: one event recompute; reminder and attachment consumers are conditional."
    },
    "EVENT-VISIBILITY-001": {
      stage: "visibility-friends",
      why: "Reuse the completed ticket event to prove the Friends Only Explore boundary without confusing accepted participation with discovery eligibility.",
      action: "After EVENT-TICKET-007 is fully complete, keep Nova's and Riley's ticket IDs, codes and stored counters as the before oracle. As Casey, use Unpublish -> Friends Only -> Publish on the same event, recording the lifecycle-owned ticket rotation. Then compare Event Explore in the external non-member Lina Park and Liam Parker sessions through a normal list poll.",
      expected: "Lina Park, the deterministic Casey-friend control, sees the event exactly once in Explore. Liam Parker, the non-friend control, does not see it and direct detail access is denied. Neither control gains membership, invitation, ticket or counters. Casey/Nova/Riley membership is unchanged; Unpublish retains both old tickets as D and republish creates one new A ticket per accepted non-admin with new IDs/codes and restored counters.",
      worker: "Only Casey's owning lifecycle writes may run their normal event recompute. Explore polling and direct visibility reads MUST NOT write or run a scheduler."
    },
    "EVENT-PUBLISH-CHAT-001": {
      stage: "publish-chat-draft",
      why: "Prove that publishing an event materializes its main chat from canonical accepted membership before any invitation is accepted.",
      action: "Keep the Admin and two pending recipients in isolated sessions. Confirm all three event-chat lists have no row for the draft and record the Admin top-level Chats badge, publish once from the Admin Draft card, then reopen the Admin chat list while leaving both pending-recipient chat lists open for one SmartList interval.",
      expected: "Exactly one empty main-event chat with unread 0 appears for the accepted Admin; Publish creates no automatic chat system message and no notification for the actor. The Admin top-level Chats badge and Chat > All/Event attention counters remain unchanged immediately and after reload. My Events remains exactly 1 while Drafts changes from 1 to 0. Both pending recipients' chat counters and lists remain unchanged. The event returns to active with accepted occupancy 1/capacity and pending badge 2, and publish creates no invitation-accepted notification.",
      worker: "Publish MUST RUN its normal event recompute and directly materialize the main chat. No scheduler is required; pending recipients MUST NOT be added by chat materialization."
    },
    "EVENT-EDITOR-003": {
      stage: "draft-no-auto",
      why: "Prove that editor persistence supplies the real auto-inviter rather than a fixture creating the invitation.",
      action: "Keep the retained event unpublished. As host, reopen the draft, enable Auto inviter and Save once without publishing. Capture the persisted draft baseline, then execute the CARD-PUBLISH variant from the Draft card's overflow menu without reopening Event Editor. After the initial candidate is verified, prepare the distinct periodic candidate, keep the recipient Invitations and host My Events lists open, and arm the short persisted real schedule.",
      expected: "The same event remains one editable draft with Auto inviter enabled and no invitation or notification at baseline. CARD-PUBLISH moves that identity from Drafts to My Events and the synchronous initial batch invites only the prepared initial candidate. The later real periodic run invites only the newly eligible candidate, and both already-open event lists converge within one SmartList poll without reopening.",
      worker: "Unpublish and changed Editor Save may refresh the one deduplicated event recompute. Draft events MUST NOT be consumed by the event-auto-inviter scheduler. Only schedule-auto-inviter may make the real periodic rule due; no fixture command may call the worker directly."
    },
    "EVENT-EDITOR-004": {
      stage: "draft",
      why: "Prove that a manually saved tournament definition survives reopen before any runtime grouping.",
      action: "As host, edit the staged draft into Tournament mode with two stages, explicit group capacities and Save once; close and reopen it.",
      expected: "Mode, stage order, group capacities and advancement settings persist; runtime group counts remain at their baseline until grouping is started.",
      worker: "Save MUST RUN event recompute. Tournament grouping/review MUST NOT RUN until explicitly armed."
    },
    "EVENT-EDITOR-005": {
      stage: "active",
      why: "Prove one downstream-relevant active-event edit and one no-op reopen independently.",
      action: "As host, change exactly one of ticketing, capacity, schedule or sub-event definition and Save once; then reopen without saving.",
      expected: "Only the selected field and its documented projection change; the no-op reopen adds no notification, task or domain mutation.",
      worker: "Changed Save MUST RUN event recompute; no-op reopen MUST NOT RUN."
    },
    "EVENT-SLOT-001": {
      stage: "slot-editor-draft",
      why: "Prove that one recurring slot definition saved in Event Editor becomes multiple occurrence sections in the Sub-event list.",
      action: `As host, edit '${EXPECTED_TITLE}': set a Weekly schedule spanning at least four weeks, enable Slots, add one slot template, add two named sub-events and Save once. Open the Sub-event list in Upcoming order.`,
      expected: "Multiple dated slot sections appear; every section contains the same two definitions with occurrence-specific timeframes and stable parent/slot/sub-event identity, without duplicate sections.",
      worker: "Save MUST RUN one event recompute. Opening, paging and changing the list order MUST NOT RUN a scheduler."
    },
    "EVENT-SLOT-002": {
      stage: "slot-future",
      why: "Prove that operation availability on generated future sub-events follows role, mode and time boundaries.",
      action: "As host, open the staged event Sub-event list in Upcoming order and inspect every runtime menu; then repeat as the participant without mutating anything.",
      expected: "The host sees only valid manage/member/resource actions, the participant sees only permitted read/participation actions, and future stages do not expose Close or Finalize.",
      worker: "MUST NOT RUN: this is a read-only action-gating checkpoint."
    },
    "EVENT-SLOT-003": {
      stage: "slot-past-tournament",
      why: "Prove that a generated past tournament occurrence resolves to its own runtime state and exposes Close Stage only after its end boundary.",
      action: "As host, open the staged event Sub-event list in Past order, select the printed recentPastSlotId, open the Qualifier runtime menu and choose Close Stage once.",
      expected: "Only the selected slot/stage changes from RS to SR with reason stage-closed; sibling occurrences and the parent definition remain unchanged.",
      worker: "The direct stage action MUST enqueue normal event recompute; it MUST NOT impersonate tournament-review scheduling."
    },
    "EVENT-SLOT-004": {
      stage: "slot-past-tournament",
      why: "Prove that leaderboard groups, members and scores are scoped to one generated past slot rather than leaking across recurrences.",
      action: "As host, open Past, select the printed recentPastSlotId, open Qualifier Groups and its leaderboard, change one score once and reopen it.",
      expected: "The same group contains exactly the staged two users; the changed score persists only for the printed slot/stage/group identity and other occurrences remain unchanged.",
      worker: "Leaderboard Save MUST enqueue the documented tournament-input recompute. Merely opening Groups or leaderboard MUST NOT RUN a task."
    },
    "EVENT-INV-001": {
      stage: "invitation-empty",
      why: "Prove that one owner/admin invitation creates matching pending projections with the same identity.",
      action: "As host, open Event Members, invite the staged participant once and Save once.",
      expected: "One pending invite row and one recipient Invitations entry identify the same event, inviter and participant.",
      worker: "MUST NOT use a scheduler. Notification outbox and member recompute are conditional direct consumers."
    },
    "EVENT-INV-002": {
      stage: "invitation-pending",
      why: "Prove the pending-invitation privacy boundary in both UI and server authorization.",
      action: "As invited participant, inspect the invitation and try accepted-only controls plus a direct chat/deep link without accepting.",
      expected: "Invitation affordances may be visible, but accepted-only chat, participant resources and protected reads remain unavailable and server-denied.",
      worker: "MUST NOT RUN: this checkpoint is read-only."
    },
    "EVENT-INV-003": {
      stage: "invitation-pending",
      why: "Prove that accepting an owner/admin invitation creates one terminal accepted membership and all of its authorized side effects.",
      action: "Keep three isolated sessions open: accepted recipient, still-pending control recipient and event Admin. Accept once as the selected recipient; then compare Event Members and the event-chat list in all three sessions, and inspect the Admin notification list.",
      expected: "Pending becomes accepted once, invitation fields clear and no duplicate row remains. The accepted recipient's original event-invite notification becomes read/resolved exactly once. The accepted recipient and Admin can see the same event chat; the still-pending control recipient cannot. The pending control is not a chat member and does not increase the accepted-member avatar stack, while Sub-events > Members shows its pending badge from the current member signal. The chat contains exactly one member-joined system message, but it creates no chat-message notification. Every other participant allowed to view the event member list receives exactly one acceptance event notification naming the accepted recipient and event; the actor and hidden ordinary members receive none.",
      worker: "CONDITIONAL direct membership recompute/outbox; no scheduler is required."
    },
    "EVENT-INV-004": {
      stage: "invitation-ordinary",
      why: "Prove that an ordinary-member invitation still requires the documented admin terminal approval.",
      action: "As target, accept the ordinary member's invitation; verify chat stays denied. Then approve once as host/admin.",
      expected: "Target remains pending until admin approval and becomes accepted exactly once only after that approval.",
      worker: "CONDITIONAL direct membership recompute/outbox; no scheduler is required."
    },
    "EVENT-INV-005": {
      stage: "invitation-full",
      why: "Prove rejection/cancellation/capacity/idempotence branches without overbooking or duplicate memberships.",
      action: "Use the staged full event for one named branch in this run; reject or cancel the pending invite, or attempt one repeated accept.",
      expected: "Capacity is never exceeded; no duplicate member, stale live invitation or rejected-user chat access remains.",
      worker: "CONDITIONAL only for a real member transition; a repeated/no-op action MUST NOT duplicate effects."
    },
    "EVENT-INV-006": {
      stage: "invitation-visibility",
      why: "Prove that invitation-acceptance notifications follow the Open/Blind event-member visibility boundary.",
      action: "Keep isolated Admin, pending-control and actor sessions open. As the actor, accept the Open invitation once and then the Blind invitation once; compare all three notification lists and both event chats.",
      expected: "For Open, Admin and the still-pending control each receive exactly one acceptance event notification while the actor receives none. For Blind, Admin receives exactly one while the hidden pending control and actor receive none. Each chat contains exactly one member-joined system message and those system rows create zero chat-message notifications.",
      worker: "CONDITIONAL direct membership recompute/outbox; no scheduler is required."
    },
    "EVENT-ACTIVITY-REFRESH-001": {
      stage: "invitation-empty",
      why: "Prove that every event activity bucket follows one live-convergence contract instead of requiring popup reopen for selected buckets.",
      action: "Keep the recipient Events > Invitations list and the host Events > My Events list open in isolated sessions. Create one controlled invitation through the owning manual or scheduled checkpoint, do not close either popup, and observe one configured 30-second SmartList poll interval. Then open All and the other relevant event buckets without a browser refresh.",
      expected: "The recipient invitation row and Invitations counter appear without reopening; the host card shows the same member/capacity and pending badge projection; All and every affected event bucket agree, while unaffected buckets remain unchanged.",
      worker: "The owning mutation may run its documented direct or scheduled consumers. The event-bucket poll itself MUST NOT create a domain write, recompute task, outbox item or job-history row."
    },
    "CHAT-AUTH-001": {
      stage: "chat-authorized",
      why: "Assemble the event-chat authorization boundary across Admin, accepted, pending and left states without inferring authorization from a hidden button.",
      action: "Use three isolated sessions for the event Admin, one accepted recipient and one still-pending control recipient. Compare their event-chat lists: prove Admin and accepted visibility, pending absence plus direct server denial, send one unique message from the accepted session and prove the Admin receives it. Then leave and repeat the former participant denial check.",
      expected: "The Admin and terminal accepted member can read the same event-chat history and exchange exactly one proof message. The pending and left users have no channel projection and are server-denied; they must not receive the proof message.",
      worker: "Chat write has normal realtime/counter consumers; authorization reads MUST NOT RUN a scheduler."
    },
    "TOURNAMENT-001": {
      stage: "tournament-definition-draft",
      why: "Verify the persisted tournament definition and zero/initial runtime projection before grouping.",
      action: "Open the explicit draft baseline in Event Editor without saving. Compare it with the separately captured published runtime list/group-popup baseline; never Unpublish merely to reach the editor for this read-only checkpoint.",
      expected: "The draft editor definition and the equivalent published runtime projection agree on parent capacity, two stages, sequence and derived initial group counts.",
      worker: "MUST NOT RUN: this is a read-only definition checkpoint."
    },
    "TOURNAMENT-002": {
      stage: "tournament",
      why: "Prove the real grouping path materializes exact group membership and group-scoped chat.",
      action: "Start the first tournament stage through the visible action, then let its documented grouping path finish.",
      expected: "Each accepted participant occurs once in the correct group; group member UI and group chat match the same group identity.",
      worker: "MUST RUN only through the named grouping path; pending invitations must not be promoted implicitly."
    },
    "TOURNAMENT-MEMBER-001": {
      stage: "tournament-member-cutoff",
      why: "Prove that only terminal parent membership at first-stage Start becomes Tournament participants; a pending invitation remains parent-scoped.",
      action: "As Nova, open the prepared QA TOURNAMENT-MEMBER-001 invitation and accept it once. Do not act as Riley and do not start the Tournament yet.",
      expected: "Before Start, Casey and Nova are the only accepted parent members while Riley remains the one pending invitation. After Casey starts Qualifiers once, Nova appears once in one generated room, leaderboard and group chat; Riley appears in none of them.",
      worker: "MUST NOT RUN a scheduler for the invitation acceptance. The one visible Start action owns the real grouping path; wait only for that documented path to finish."
    },
    "TOURNAMENT-MEMBER-002": {
      stage: "tournament-member-removal",
      why: "Prove that removing a participant after the Tournament and Qualifiers have already started exits its parent and generated-room participation without deleting the historical score identity.",
      action: "Confirm the parent current stage and Qualifiers runtime are active, not blocked. Then as Casey open QA TOURNAMENT-MEMBER-002 > Members and Remove Nova once. Do not Start, disqualify or block Nova.",
      expected: "Nova disappears from active parent and generated-room membership and loses the room chat. Her one existing score row remains auditable and she receives exactly one self-removal notification. Casey receives none as actor; Riley receives one parent-event participant notification and the parent Event chat message. Only affected Group A receives the tournament-group removal message; Riley's unrelated Group B receives no group message, unread delta or content change.",
      worker: "No scheduler or manual data repair. The one visible Remove action owns every membership, chat and counter change."
    },
    "TOURNAMENT-003": {
      stage: "tournament",
      why: "Prove exact-once tournament review and advancement from one finalized stage.",
      action: "Finalize the first stage with deterministic results, arm the named tournament-review schedule and observe the next stage.",
      expected: "Winners advance once, stale losers are absent, stage status and notifications agree, and an unchanged second review is a no-op.",
      worker: "MUST RUN: event-tournament-review real scheduler; unchanged second review MUST NOT create another domain delta."
    },
    "TOURNAMENT-004": {
      stage: "tournament-final-carry-forward",
      why: "Prove Final Start and terminal tournament completion from the exact advancement boundary retained from TOURNAMENT-003.",
      action: "Carry the closed TOURNAMENT-003 state forward without reset. As Casey, Start Final exactly once; later Finalize it only after the valid ended/review boundary.",
      expected: "Only Casey and Riley remain in Final. Actual Final Start writes one Final-named stage notification for Riley, excludes Casey as the manual actor and excludes eliminated Nova. Terminal Finalize later writes one whole-tournament result without changing the earlier Qualifiers evidence.",
      worker: "Final Start uses the visible direct stage action and its normal grouping path. Assignment to Final alone MUST NOT impersonate Start; unchanged replay MUST NOT add another lifecycle notification."
    },
    "TOURNAMENT-CARD-001": {
      stage: "tournament-card-isolated",
      why: "Prove that the root tournament card reads a persisted current-stage wire value and follows a real lifecycle action without a nested event projection.",
      action: "Keep Casey's My Events list open under View Event. Finalize the staged Qualifiers once, then compare the parent-card row before the next poll and after one explicit reload.",
      expected: "The parent card changes from Qualifiers 1/2 to Final 2/2 in place and survives reload; generated tournament rooms remain nested and are never emitted as root cards.",
      worker: "The real Finalize action may run its existing tournament consumers. The event-list read projects currentStage only and MUST NOT load nested subEvents to reconstruct the row."
    },
    "EVENT-LIFE-001": {
      stage: "active",
      why: "Prove that unpublishing changes the canonical lifecycle and every visibility bucket exactly once.",
      action: "In the host session, open the staged event and choose Unpublish once.",
      expected: "The event leaves unrelated-user Explore, remains once in host Drafts/Hosting, and one event recompute is attributable to the mutation.",
      worker: "MUST RUN: one event affinity recompute. Reopen and refresh afterward MUST NOT RUN anything."
    },
    "EVENT-LIFE-002": {
      stage: "active",
      why: "Prove that organizer deletion is a global lifecycle mutation, not a participant leave.",
      action: "In the host session, move the staged event to Trash once.",
      expected: "Only the host Trash bucket contains the event; active entry paths disappear and the prior active status is preserved for restore.",
      worker: "MUST RUN: one event affinity recompute; lifecycle notification, reminder and attachment effects are conditional."
    },
    "EVENT-LIFE-003": {
      stage: "trashed",
      why: "Prove that restore returns the event to its preserved lifecycle bucket without duplication.",
      action: "In the host Trash bucket, restore the staged event once.",
      expected: "The event returns once as active, suppression fields clear, and no member, resource or ticket is duplicated.",
      worker: "MUST RUN: one event affinity recompute. A later read-only refresh MUST NOT RUN anything."
    },
    "EVENT-LIFE-004": {
      stage: "accepted",
      why: "Separate participant leave/restore from organizer event deletion.",
      action: "In the participant session, leave the staged event once; capture status, then restore that personal participation once.",
      expected: "Only the participant Attending/Trash projection changes; the host still sees one active canonical event throughout.",
      worker: "CONDITIONAL: member mutation effects only. Organizer lifecycle jobs MUST NOT RUN."
    },
    "EVENT-LIFE-005": {
      stage: "accepted",
      why: "Prove that bucket navigation is a read-only projection.",
      action: "Open and refresh Hosting, Drafts, Attending, Invitations and Trash without editing the staged event.",
      expected: "Each identity appears only in its documented bucket and every domain/task/outbox count remains unchanged.",
      worker: "MUST NOT RUN: no recompute, outbox or scheduled-job history change."
    },
    "EVENT-FEEDBACK-001": {
      stage: "feedback-boundary",
      why: "Verify the actual feedback eligibility boundary and its negative controls.",
      action: "As the participant, open Event Feedback and compare the four staged event titles.",
      expected: "Only the eligible event appears: accepted, non-admin, non-trashed and at least two hours after its end. Locked, trashed and pending controls stay absent.",
      worker: "MUST NOT RUN: loading feedback eligibility is read-only."
    },
    "EVENT-FEEDBACK-002": {
      stage: "feedback-empty",
      why: "Follow one persisted event-feedback mutation into organizer, notification, recompute and profile projections.",
      action: "Submit feedback once as each of the two accepted participants, using distinguishable answers; keep both submissions on the same staged event.",
      expected: "Before submission the reloaded host profile has exact main feedback 0 with no red Feedback badge and Own Events count 0, while the Own Events list still contains exactly one staged zero-response event card. After the first and second participant submissions, the host Own Events and main Feedback counters become 1 and then 2 while the event-card count remains exactly 1; the card's response badge becomes 2.",
      checks: [
        "Open Activities -> My Events -> Past and compare its membership card with Members: Casey Admin plus both accepted participants must produce acceptedMembers=3 and an exact 3/8 capacity badge.",
        "Reload the participant profile/menu: the main Feedback badge is exactly 1 because activities.feedback and eventFeedback.pending are both exactly 1; the independent Rates badge is not a substitute.",
        "Reload the host profile/menu before submission: the main Feedback tile has no red badge because activities.feedback and eventFeedback.ownEvents are both exactly 0.",
        "Open Event Feedback -> Own Events: its counter is 0 while exactly one staged event card remains visible with the persisted title and image before any response exists.",
        "Open View Feedbacks: the event identity remains visible and the zero-response detail contains no response rows or trait evidence.",
        "Repeat the read-only oracle after those openings: no answer, submitted state, affinity recompute, notification or notification outbox may have been created.",
        "On the first event-feedback page enter a unique event opinion of at most 160 characters; pasted and typed values share the same backend-enforced limit.",
        "After submission open View my feedback and the organizer received-feedback detail: both show the exact event opinion, and neither merges it with the separate note-to-organizer field.",
        "Submit a distinguishable response as the second accepted participant; after Casey reloads, require main Feedback=2 and Own Events=2 while exactly one event card remains and its response badge is 2."
      ],
      worker: "MUST RUN: target-user recompute and first-submission notification outbox."
    },
    "EVENT-FEEDBACK-005": {
      stage: "feedback-submitted",
      why: "Prove that a participant note to the organizer is separate metadata rather than a new structured feedback answer.",
      action: "As the participant, use Add note on the pending or feedbacked staged event, save one unique note, then reopen View my feedback and the organizer received-feedback detail.",
      expected: "The Add/Edit note action remains available after feedback submission. The exact note persists in feedback state and both viewers show it separately from the event opinion while participant answers, traits, event buckets, tasks and notifications stay unchanged.",
      worker: "MUST NOT RUN: only the documented feedback counter refresh is allowed."
    },
    "EVENT-FEEDBACK-006": {
      stage: "feedback-empty",
      why: "Prove the pending-item remove and restore transitions before any structured feedback answer exists.",
      action: "As the participant, choose Remove once on the staged pending event, verify it in Removed, then choose Restore once.",
      expected: "The same event identity and persisted image move from Pending to Removed and back to Pending. Participant feedback/pending/removed changes 1/1/0 -> 0/0/1 -> 1/1/0 while feedbacked stays 0; Casey Own Events stays 0 because no response was submitted. No answer, event opinion, organizer note, recompute, notification or outbox is created.",
      checks: [
        "Before Remove require exactly one eligible and counter-tracked pending state, participant feedback/pending/removed 1/1/0, host Own Events 0, and zero answer, note, task, notification and outbox rows.",
        "After Remove open the Removed bucket and require the same event title and persisted image exactly once; Pending is empty.",
        "Require removed=true with submittedAtIso empty and exact participant feedback/pending/feedbacked/removed 0/0/0/1; host Own Events remains 0.",
        "Choose Restore once; require Removed empty, the same event back in Pending exactly once, removed=false and exact participant feedback/pending/feedbacked/removed 1/1/0/0; host Own Events remains 0.",
        "After Restore require answers, event opinion, organizer note, affinity tasks, notifications and outbox rows to remain unchanged and empty.",
        "Reset only through this checkpoint harness, then restage EVENT-FEEDBACK-002 before testing submission."
      ],
      worker: "MUST NOT RUN: synchronous feedback-state writes apply the exact remove/restore counter transitions; affinity recompute and notification outbox remain unchanged."
    },
    "EVENT-IMPRESSION-001": {
      stage: "feedback-empty",
      why: "Prove that event-feedback trait evidence reaches the correct Host or Attendee section of the target profile.",
      action: "Capture the host Impressions popup, submit the staged host-target feedback as participant, then observe the normal realtime refresh and reopen the popup.",
      expected: "The distinctive trait evidence changes in Host only; Attendee is X. Persisted feedback and the popup must agree after the normal realtime window.",
      worker: "Feedback submit MUST RUN target recompute; opening or refreshing Impressions MUST NOT RUN a task."
    },
    "EVENT-TICKET-001": {
      stage: "ticketing-off",
      why: "Verify that enabling ticketing persists to the canonical event and participant overlay without changing roles.",
      action: "As host, enable Ticketing in Event Editor, Save once, close and reopen the event.",
      expected: "Ticketing remains enabled for the same event and participant; membership roles and unrelated fields are unchanged.",
      worker: "MUST RUN: the normal event recompute for Save. Ticket UI reads MUST NOT RUN a scheduler."
    },
    "EVENT-TICKET-002": {
      stage: "ticketing-off",
      why: "Verify that the real publish write creates exactly one eligible participant physical ticket and no Admin ticket.",
      action: "As Casey, unpublish the staged event, enable Ticketing, and publish it again through the UI. After publish succeeds, switch to Nova and open the Ticket list twice.",
      expected: "The event stays 2 / 8 from Casey accepted Admin plus Nova accepted Member, with Riley pending as a ticketless control. Publish creates one Nova status A EventTicket and no Casey or Riley ticket/counter. Both Ticket opens read the same event/holder/code, and the card requests the retained managed medium.webp.",
      worker: "MUST RUN: the publish mutation owns its normal event recompute, participant projection and physical ticket creation. MUST NOT RUN: subsequent credential reads require no scheduler or write."
    },
    "EVENT-TICKET-POLL-001": {
      stage: "ticketing-off",
      why: "Prove foreground Ticket-popup polling and resumed background side-menu polling through one shared coordinator and ActivityStore signal.",
      action: "Phase 1: as Nova leave Ticket -> Upcoming open while Casey performs Unpublish -> Ticketing On -> Publish, then observe one foreground poll. Phase 2: close Nova's popup, leave the side menu open, and have Casey Unpublish once; observe one background realtime poll without reopening or reloading.",
      expected: "Phase 1 converges Nova's open ticket list and shared Ticket counter from 0 to 1 without oscillation. Phase 2 proves ownership returns to the side-menu poll: after Casey Unpublish, Nova's Events and Ticket counters both change from 1 to 0 while the popup stays closed. Ticketing remains configured On in the draft, but Unpublish revokes the physical ticket from A to D; Casey receives none and Riley remains pending and ticketless.",
      worker: "MUST RUN: Casey's publish owns one normal event recompute and physical ticket creation; Casey's unpublish owns physical ticket A-to-D revocation plus its normal event/ticket counter refresh. MUST NOT RUN: either frontend poll creates or changes a ticket, recompute, notification or outbox item."
    },
    "EVENT-TICKET-003": {
      stage: "ticket-ready",
      why: "Verify physical-phone Admin QR check-in is exact-once and negative scans are no-ops.",
      action: "Connect and authorize the Android phone, run adb reverse tcp:8080 tcp:80, open http://localhost:8080 as Casey Admin and grant camera access. Display Nova's newly issued QR on a separate screen, retain its screenshot, scan it once with the phone, scan it again, then try one invalid code from an unauthorized session.",
      expected: "The physical-phone first scan succeeds and sets one used timestamp; repeat is already-used and negative scans do not mutate it.",
      worker: "MUST NOT RUN: check-in is a direct request path."
    },
    "EVENT-TICKET-004": {
      stage: "ticket-ready",
      why: "Verify the physical ticket A/D lifecycle and its audit trail across Unpublish and a later republish.",
      action: "As Casey, Unpublish once while Ticketing stays configured On and verify Nova's current physical ticket becomes D. Then Publish again and open Nova's new ticket.",
      expected: "Unpublish retains the old ticket as D. Republish with Ticketing On creates a new A ticket object with a different id, QR code and issuedAtIso; Nova stays accepted and exactly one active ticket is visible.",
      worker: "Each owning event mutation may run its one normal recompute. Ticket reads MUST NOT create or reactivate a credential."
    },
    "EVENT-TICKET-005": {
      stage: "ticket-join",
      why: "Prove the complete Public Explore Join, Cancel request, re-Join and Admin approval flow with action-owned notifications and ticket creation only at terminal acceptance.",
      action: "Keep Casey Notifications and Nova Explore open. Run Join -> Cancel -> Join -> Cancel -> Join. At every Join stop for an oracle proving one physical approval-pending basket, pending membership and zero tickets; at every Cancel require one ID-scoped removal of only the matching pending Activity row while adjacent cards remain unchanged. On the last pending Join reload Explore once: the Public event card and its orange Continue booking plus other contextual actions must remain. Then approve Nova once as Casey and open Nova Ticket twice.",
      expected: "Join creates one pending member-origin approval request, one visible approval-pending checkout basket, no EventTicket and a Casey Pending notification. Basket visibility, not member pending status, retains the Explore card across reload and drives the orange warning-tone Continue booking action without hiding the card's other actions. Cancel changes the physical membership to suppressed, removes the visible pending projection, returns currentUserMembershipStatus=none, clears the prior basket/session/result state, keeps ticket counters zero and adds a separate Casey Cancelled row. The visible card changes from Continue booking to fresh Join/Book immediately and stays fresh after reload. Re-Join creates a new pending attempt without reusing the old basket/session/policy, adds another Pending row and still creates no ticket. Casey approval directly accepts Nova and creates one A ticket; Casey receives none and repeated Ticket reads reuse it.",
      worker: "Join, Cancel and re-Join own their membership, counter and separate notification writes but are ticket non-producers. Only terminal Admin approval owns ticket creation. Explore, Notification and Ticket reads MUST NOT create a ticket or scheduler job."
    },
    "EVENT-TICKET-006": {
      stage: "ticket-expiring",
      why: "Prove that event expiry changes ticket bucketing, not the physical ticket's A/D lifecycle.",
      action: "Open Nova's Upcoming Ticket list against the stable pre-expiry baseline and capture the ticket id/code/status. Only after that manual boundary is proved, run arm-ticket-expiry to start the controlled two-minute expiry window. Keep the session open through the end-time poll, then open Past and scan the same QR once.",
      expected: "The same A ticket disappears from Upcoming and appears once in Past with unchanged id and code. Scan returns expired without changing the ticket to D or creating another object.",
      worker: "The normal event-expiry counter worker may mark event projections expired. Ticket list reads and the rejected expired scan MUST NOT create a ticket or another scheduler job."
    },
    "EVENT-TICKET-007": {
      stage: "ticket-invitation",
      why: "Prove the complete ordinary-member invitation flow: the invitee must respond before Admin approval, and only the later terminal Admin approval creates the invitee's physical ticket plus target approval notification.",
      action: "Keep Casey accepted Admin and Nova accepted Member. As Nova, invite Riley; before Riley responds verify the unread event-invite in Notifications New. As Riley, accept and prove the same membership remains pending for Admin approval and ticketless. Then approve as Casey, keep Riley's menu open through its normal poll, verify one unread event-member-approved row in Notifications New before opening it, and open Ticket twice as Riley.",
      expected: "Nova starts with one existing A ticket and both stored ticket counters at 1; Riley starts outside the membership with no ticket/counter. Nova's invite leaves Riley pending with one unread invite notification. Riley's acceptance resolves that notification, converts the row to a pending Admin-approval request and remains ticketless. Casey's terminal approval creates exactly one Riley A ticket, changes both Riley users-table counters to 1 and emits exactly one unread target approval notification without replacing or duplicating Nova's ticket.",
      worker: "Invite and invitee acceptance own their membership/counter/notification effects but MUST NOT create Riley's ticket. Casey's terminal Admin approval owns target-only ticket creation, target approval notification and its normal recompute effects. Ticket and Notification reads MUST NOT write except an explicit notification-row read action."
    },
    "EVENT-TICKET-008": {
      stage: "ticket-isolation",
      why: "Prove that two structurally similar events with the same roles retain independent physical tickets and counters.",
      action: "Capture Nova's two ticket cards and both ticket identities. As Casey, Unpublish only the event whose title ends in A; prove only A disappears and its physical ticket becomes D. Publish A again with Ticketing still On and prove a new A credential appears while event B retains its original id/code/status throughout.",
      expected: "Both events start published and Ticketing On with Casey Admin, Nova accepted and Riley pending. Nova owns two distinct A tickets. Event A Unpublish changes only A to D and counters 2 -> 1; event B remains visible with the same A ticket. Event A republish creates a new id/code and counters return 1 -> 2 without changing or duplicating event B.",
      worker: "Only event A lifecycle writes may change A's overlay/ticket/counters and run their normal recompute. Event B and all Ticket reads MUST remain X."
    },
    "EVENT-TICKET-011": {
      stage: "ticket-ready",
      why: "Prove that the first successful physical-ticket check-in writes an event-scoped attendance projection without replacing accepted membership.",
      action: "Keep Casey's Event Members popup open on Nova's accepted row, display Nova's unused QR, and scan it once through Casey's authorized scanner. Wait for the open Members list's own delta poll; do not close or reload it.",
      expected: "Nova remains accepted and appears exactly once with Checked in plus the scan time. Ticket usedAtIso and member checkedInAtIso are identical, Casey is the actor, and the member references the exact physical ticket. Casey membership, event capacity and counters remain unchanged.",
      worker: "MUST NOT RUN: the first scan is a direct ticket/member write. The already-open Members delta poll is read-only and must not replace the shared SmartList implementation."
    }
  };

  function config() {
    const value = CHECKPOINTS[checkpointId];
    if (!value) {
      Q.fail(`unsupported event-domain checkpoint '${checkpointId}'.`);
    }
    return value;
  }

  function activeExpectedTitle() {
    const state = Q.activeState(SCENARIO, false);
    return Q.text(state && state.context && state.context.expectedTitle) || EXPECTED_TITLE;
  }

  function activeEventSourceId() {
    const state = Q.activeState(SCENARIO, false);
    return Q.text(state && state.context && state.context.actualEventSourceId);
  }

  function autoInviterRule() {
    const rules = Q.collection("notificationRuleConfigs")
      .find({ ruleKey: AUTO_INVITER_RULE })
      .limit(2)
      .toArray();
    if (rules.length !== 1) {
      Q.fail(`expected exactly one '${AUTO_INVITER_RULE}' rule, found ${rules.length}.`);
    }
    return rules[0];
  }

  function autoInviterRuleSummary() {
    const rule = autoInviterRule();
    const timing = rule.timing || {};
    const runState = rule.runState || {};
    const intervalSeconds = Number(timing.intervalSeconds || 0);
    const lastRunAt = new Date(Q.text(runState.lastRunAtIso));
    const dueAt = Number.isFinite(lastRunAt.getTime()) && intervalSeconds > 0
      ? new Date(lastRunAt.getTime() + intervalSeconds * 1000)
      : null;
    return {
      enabled: rule.enabled === true,
      manualRunEnabled: rule.manualRunEnabled === true,
      intervalSeconds,
      currentStatus: Q.text(runState.currentStatus),
      lastRunAtIso: runState.lastRunAtIso,
      calculatedDueAtIso: dueAt && dueAt.toISOString(),
      secondsUntilEligible: dueAt
        ? Math.max(0, Math.ceil((dueAt.getTime() - Date.now()) / 1000))
        : null
    };
  }

  function autoInviterAffinitySelector() {
    return {
      $or: [
        { leftUserId: hostUserId },
        { rightUserId: hostUserId },
        { _id: { $in: [AUTO_INVITER_INITIAL_EDGE_ID, AUTO_INVITER_LATER_EDGE_ID] } }
      ]
    };
  }

  function sortedUnique(values) {
    return [...new Set((values || []).map(Q.text).filter(Boolean))].sort();
  }

  function sameIds(actual, expected) {
    return JSON.stringify(sortedUnique(actual)) === JSON.stringify(sortedUnique(expected));
  }

  function nestedNumber(document, path) {
    let value = document;
    for (const segment of path.split(".")) {
      value = value && value[segment];
    }
    return Number(value || 0);
  }

  function eventInviteArtifactsSummary(eventId) {
    const members = Q.collection("activityMembers")
      .find({
        ownerType: "event",
        ownerId: eventId,
        status: "pending",
        requestKind: "invite"
      })
      .toArray();
    const markers = Q.collection("schedulerPlanMarkers")
      .find({ ownerId: eventId })
      .toArray();
    const outbox = Q.collection("notificationOutbox")
      .find({
        notificationType: "event-invite",
        $or: [{ entityId: eventId }, { "payload.eventId": eventId }]
      })
      .toArray();
    const notifications = Q.collection("userNotifications")
      .find({
        $and: [
          { $or: [{ notificationType: "event-invite" }, { "payload.type": "event-invite" }] },
          { $or: [{ sourceId: eventId }, { "payload.eventId": eventId }] }
        ]
      })
      .toArray();
    return {
      pendingInviteMemberCount: members.length,
      pendingInviteUserIds: sortedUnique(members.map(member => member.userId)),
      markerCount: markers.length,
      markerUserIds: sortedUnique(markers.flatMap(marker => marker.userIds || [])),
      outboxCount: outbox.length,
      outboxUserIds: sortedUnique(outbox.flatMap(item => item.recipientUserIds || [])),
      notificationCount: notifications.length,
      notificationUserIds: sortedUnique(notifications.map(item => item.recipientUserId))
    };
  }

  function autoInviterPeriodicSummary(state) {
    if (!state || !state.autoInviterPeriodic) return null;
    const event = Q.collection("events").findOne(manualEventSelector());
    const eventId = event ? Q.text(event.sourceId || event._id) : "";
    return {
      preparedAtIso: state.autoInviterPeriodic.preparedAtIso,
      scheduledAtIso: state.autoInviterScheduler && state.autoInviterScheduler.scheduledAtIso,
      scheduledDelaySeconds: state.autoInviterScheduler && state.autoInviterScheduler.scheduledDelaySeconds,
      expectedDueAtIso: state.autoInviterScheduler && state.autoInviterScheduler.expectedDueAtIso,
      initialCandidate: Q.user(participantUserId),
      periodicCandidate: Q.user(thirdUserId),
      artifacts: eventId ? eventInviteArtifactsSummary(eventId) : null
    };
  }

  function autoInviterEligibilitySummary(state) {
    const prepared = state && state.autoInviterEligibility;
    if (!prepared || !prepared.preparedAtIso) return null;
    const edges = Q.collection("userAffinityEdges")
      .find(autoInviterAffinitySelector())
      .sort({ _id: 1 })
      .toArray();
    return {
      preparedAtIso: prepared.preparedAtIso,
      initialCandidate: Q.user(participantUserId),
      laterCandidate: Q.user(thirdUserId),
      incidentEdges: edges.map(edge => ({
        id: Q.text(edge._id),
        leftUserId: Q.text(edge.leftUserId),
        rightUserId: Q.text(edge.rightUserId),
        edgeWeight: Number(edge.edgeWeight || 0)
      })),
      isolatedAutoInviterEventCount: (prepared.isolatedEventIds || []).length,
      quarantinedWaitlistCount: (prepared.isolatedWaitlistMemberIds || []).length
    };
  }

  function manualEventSelector() {
    const expectedTitle = activeExpectedTitle();
    const actualEventSourceId = activeEventSourceId();
    const sourceIds = actualEventSourceId ? [...EVENT_IDS, actualEventSourceId] : EVENT_IDS;
    return {
      $or: [
        { _id: { $in: sourceIds } },
        { sourceId: { $in: sourceIds } },
        { title: expectedTitle }
      ]
    };
  }

  function escapeRegex(value) {
    return Q.text(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function generatedRandomRoomSelector() {
    const actualEventSourceId = activeEventSourceId();
    const parentIds = [...new Set([
      ...EVENT_IDS,
      ...(actualEventSourceId ? [actualEventSourceId] : [])
    ])];
    return {
      $or: parentIds.flatMap(parentId => {
        const prefix = `^random-room:${escapeRegex(parentId)}:`;
        return [
          { _id: { $regex: prefix } },
          { sourceId: { $regex: prefix } }
        ];
      })
    };
  }

  function ticketInviteCandidateRateSelector() {
    return {
      mode: "single",
      $or: [
        { ownerUserId: participantUserId, relatedUserId: thirdUserId },
        { ownerUserId: thirdUserId, relatedUserId: participantUserId }
      ]
    };
  }

  function dateIso(offsetMinutes) {
    return new Date(Date.now() + offsetMinutes * 60000).toISOString();
  }

  function eventDocument(id, title, options = {}) {
    const now = Q.nowIso();
    const status = options.status || "A";
    const requestedAccepted = Array.isArray(options.acceptedUserIds)
      ? [...options.acceptedUserIds]
      : options.accepted === false ? [] : [participantUserId];
    // Production materializes the event creator as an accepted Admin member.
    // Keep the embedded occupancy projection consistent with that canonical
    // activityMembers record, including host-only manual-QA fixtures.
    const accepted = sortedUnique([hostUserId, ...requestedAccepted]);
    const pending = Array.isArray(options.pendingUserIds)
      ? [...options.pendingUserIds]
      : options.pending === true ? [participantUserId] : [];
    const invited = Array.isArray(options.invitedUserIds) ? [...options.invitedUserIds] : [];
    return {
      _id: id,
      sourceId: id,
      syncKey: id,
      title,
      subtitle: "Manual event-domain QA checkpoint",
      status,
      published: status === "A",
      isTrashed: status === "T",
      statusBeforeSuppression: options.statusBeforeSuppression || null,
      trashedAtIso: status === "T" ? now : null,
      ownerUserId: hostUserId,
      creatorUserId: hostUserId,
      admins: [hostUserId],
      visibility: "public",
      blindMode: options.blindMode || "Open Event",
      autoInviter: false,
      ticketing: options.ticketing === true,
      approvalRequired: options.approvalRequired === true,
      capacityMin: 1,
      capacityMax: 8,
      capacityTotal: 8,
      acceptedMembers: accepted.length,
      pendingMembers: pending.length,
      acceptedMemberUserIds: accepted,
      pendingMemberUserIds: pending,
      invitedMemberUserIds: invited,
      pendingRequestMemberUserIds: pending.filter(userId => !invited.includes(userId)),
      subEvents: options.subEvents || [],
      subEventsEnabled: options.subEventsEnabled === true,
      subEventDefinitions: options.subEventDefinitions || [],
      mode: options.mode || "Casual",
      topics: ["Manual QA"],
      imageUrl: Q.text(options.imageUrl),
      feedbackCountersProjected: options.feedbackCountersProjected === true,
      feedbackOwnEventCountersProjected: options.feedbackOwnEventCountersProjected === true,
      feedbackOwnEventCounterUserIds: Array.isArray(options.feedbackOwnEventCounterUserIds)
        ? [...options.feedbackOwnEventCounterUserIds]
        : [],
      startAtIso: options.startAtIso || dateIso(180),
      endAtIso: options.endAtIso || dateIso(300),
      createdDate: now,
      createdUser: Q.ACTOR,
      updatedDate: now,
      updatedUser: Q.ACTOR
    };
  }

  function memberDocument(eventId, userId, role, status, requestKind = null, options = {}) {
    const id = `${PREFIX}:member:${eventId.split(":").pop()}:${userId}`;
    const now = Q.nowIso();
    return {
      _id: id,
      syncKey: id,
      ownerType: "event",
      ownerId: eventId,
      userId,
      role,
      status,
      pendingSource: status === "pending" ? (options.pendingSource || "admin") : null,
      requestKind,
      invitedByUserId: status === "pending" && requestKind === "invite"
        ? (options.invitedByUserId || hostUserId)
        : null,
      actionAtIso: now,
      createdDate: now,
      createdUser: Q.ACTOR,
      updatedDate: now,
      updatedUser: Q.ACTOR
    };
  }

  function insertEventWithMembers(event, participantStatus = "accepted") {
    Q.collection("events").insertOne(event);
    Q.collection("activityMembers").insertMany([
      memberDocument(event.sourceId, hostUserId, "Admin", "accepted"),
      memberDocument(
        event.sourceId,
        participantUserId,
        "Member",
        participantStatus,
        participantStatus === "pending" ? "join" : null
      )
    ]);
  }

  function insertHostOnlyEvent(event) {
    Q.collection("events").insertOne(event);
    Q.collection("activityMembers").insertOne(
      memberDocument(event.sourceId, hostUserId, "Admin", "accepted")
    );
  }

  function invitationFixtureUserIds(stageKind) {
    return ["invitation-ordinary", "invitation-full", "invitation-visibility"].includes(stageKind)
        || checkpointId === "EVENT-INV-003"
      ? [hostUserId, participantUserId, thirdUserId]
      : [hostUserId, participantUserId];
  }

  function insertEmptyMainEventChat(event, acceptedUserIds, stagedAtIso) {
    const chatId = Q.text(event.sourceId || event._id);
    const memberIds = sortedUnique(acceptedUserIds);
    Q.collection("chats").insertMany(memberIds.map(ownerUserId => ({
      _id: `${PREFIX}:chat:${ownerUserId}`,
      id: chatId,
      ownerUserId,
      avatar: "SY",
      title: Q.text(event.title),
      lastMessage: "",
      lastSenderId: null,
      memberIds,
      unread: 0,
      dateIso: stagedAtIso,
      channelType: "mainEvent",
      ownerId: chatId,
      eventId: chatId,
      ownerStatus: Q.text(event.status) || "A",
      revision: 1,
      subEventId: null,
      groupId: null
    })));
  }

  function tournamentStages() {
    const stageOneId = `${EVENT_ID}:stage:qualifiers`;
    const stageTwoId = `${EVENT_ID}:stage:final`;
    return [
      {
        id: stageOneId,
        name: "Qualifiers",
        description: "Manual QA qualifiers",
        timing: "During",
        offsetMinutes: 0,
        durationMinutes: 60,
        optional: false,
        capacityMin: 2,
        capacityMax: 4,
        tournamentGroupCapacityMin: 1,
        tournamentGroupCapacityMax: 2,
        tournamentLeaderboardType: "Score",
        tournamentAdvancePerGroup: 1,
        stageStatus: "RS",
        stageStatusReason: "awaiting-tournament-start",
        groupsCount: 0,
        groupsPending: 0
      },
      {
        id: stageTwoId,
        name: "Final",
        description: "Manual QA final",
        timing: "After",
        offsetMinutes: 0,
        durationMinutes: 45,
        optional: false,
        capacityMin: 1,
        capacityMax: 2,
        tournamentGroupCapacityMin: 1,
        tournamentGroupCapacityMax: 2,
        tournamentLeaderboardType: "Score",
        tournamentAdvancePerGroup: 0,
        stageStatus: "RS",
        stageStatusReason: "awaiting-prior-stage",
        groupsCount: 0,
        groupsPending: 0
      }
    ];
  }

  function isTournamentFixtureStage(stageKind) {
    return ["tournament", "tournament-definition-draft", "tournament-member-cutoff", "tournament-member-removal"].includes(stageKind);
  }

  function isTournamentMemberRemovalStage(stageKind) {
    return stageKind === "tournament-member-removal";
  }

  function materializeTournamentStageTimes(definitions, parentStartAtIso) {
    const parentStartMs = new Date(parentStartAtIso).getTime();
    if (!Number.isFinite(parentStartMs)) {
      Q.fail("tournament fixture parent start time is invalid.");
    }
    let priorEndMs = parentStartMs;
    return (definitions || []).map(stage => {
      const offsetMs = Math.max(0, Number(stage.offsetMinutes || 0)) * 60000;
      const durationMs = Math.max(1, Number(stage.durationMinutes || 0)) * 60000;
      const startsAfterPrior = Q.text(stage.timing).toLowerCase() === "after";
      const startMs = (startsAfterPrior ? priorEndMs : parentStartMs) + offsetMs;
      const endMs = startMs + durationMs;
      priorEndMs = endMs;
      return {
        ...stage,
        startAt: new Date(startMs).toISOString(),
        endAt: new Date(endMs).toISOString()
      };
    });
  }

  function tournamentMemberRemovalRoomChat(roomId, title, memberIds, ownerUserId, stagedAtIso) {
    return {
      _id: `${PREFIX}:tournament-member-removal:chat:${roomId}:${ownerUserId}`,
      id: roomId,
      ownerUserId,
      avatar: TOURNAMENT_ROOM_IMAGE_URL,
      title,
      lastMessage: "",
      lastSenderId: null,
      memberIds: [...memberIds].sort(),
      unread: 0,
      dateIso: stagedAtIso,
      channelType: "mainEvent",
      ownerId: roomId,
      eventId: roomId,
      ownerStatus: "A",
      revision: 1,
      subEventId: null,
      groupId: null
    };
  }

  function stageTournamentMemberRemoval(stagedAtIso) {
    const timing = { startAtIso: dateIso(-30), endAtIso: dateIso(180) };
    const definitions = materializeTournamentStageTimes(tournamentStages(), timing.startAtIso)
      .map((stage, index) => index === 0
        ? {
            ...stage,
            stageStatus: "A",
            stageStatusReason: "stage-started",
            stageStatusUpdatedAt: stagedAtIso,
            membersAccepted: 3,
            membersPending: 0,
            groupsCount: 2,
            groupsPending: 0
          }
        : {
            ...stage,
            stageStatus: "RS",
            stageStatusReason: "awaiting-prior-stage",
            membersAccepted: 0,
            membersPending: 0,
            groupsCount: 0,
            groupsPending: 0
          });
    const qualifier = definitions[0];
    const definitionDocuments = definitions.map(stage => ({
      id: stage.id,
      name: stage.name,
      description: stage.description,
      timing: stage.timing,
      offsetMinutes: stage.offsetMinutes,
      durationMinutes: stage.durationMinutes,
      location: stage.location,
      tournamentGroupCapacityMin: stage.tournamentGroupCapacityMin,
      tournamentGroupCapacityMax: stage.tournamentGroupCapacityMax,
      tournamentLeaderboardType: stage.tournamentLeaderboardType,
      tournamentAdvancePerGroup: stage.tournamentAdvancePerGroup,
      optional: stage.optional,
      pricing: stage.pricing,
      capacityMin: stage.capacityMin,
      capacityMax: stage.capacityMax,
      icon: stage.icon
    }));
    const groupAId = `${qualifier.id}:group:1`;
    const groupBId = `${qualifier.id}:group:2`;
    const roomAId = `random-room:${EVENT_ID}:${qualifier.id}:${groupAId}`;
    const roomBId = `random-room:${EVENT_ID}:${qualifier.id}:${groupBId}`;
    const parent = eventDocument(EVENT_ID, EXPECTED_TITLE, {
      ...timing,
      mode: "Tournament",
      subEventsEnabled: true,
      subEventDefinitions: definitionDocuments,
      subEvents: definitions,
      acceptedUserIds: [participantUserId, thirdUserId]
    });
    parent.currentStage = {
      id: qualifier.id,
      name: qualifier.name,
      stageNumber: 1,
      totalStages: definitions.length,
      status: "A"
    };
    const room = (id, title, acceptedUserIds, groupId) => ({
      _id: id,
      sourceId: id,
      syncKey: `scheduler:${id}`,
      title,
      subtitle: `Tournament group for ${EXPECTED_TITLE}.`,
      status: "A",
      published: true,
      ownerUserId: null,
      creatorUserId: null,
      organizerUserId: hostUserId,
      admins: [],
      visibility: "Invitation only",
      blindMode: "Open Event",
      autoInviter: false,
      ticketing: false,
      approvalRequired: false,
      capacityMin: 1,
      capacityMax: 2,
      capacityTotal: 2,
      acceptedMembers: acceptedUserIds.length,
      pendingMembers: 0,
      acceptedMemberUserIds: acceptedUserIds,
      pendingMemberUserIds: [],
      invitedMemberUserIds: [],
      pendingRequestMemberUserIds: [],
      subEvents: [],
      subEventsEnabled: false,
      subEventDefinitions: [],
      mode: "Tournament",
      topics: ["Manual QA"],
      imageUrl: TOURNAMENT_ROOM_IMAGE_URL,
      startAtIso: timing.startAtIso,
      endAtIso: timing.endAtIso,
      parentEventId: EVENT_ID,
      generated: true,
      eventType: "tournament-room",
      groupId,
      createdDate: stagedAtIso,
      createdUser: Q.ACTOR,
      updatedDate: stagedAtIso,
      updatedUser: Q.ACTOR
    });
    Q.collection("events").insertMany([
      parent,
      room(roomAId, "Tournament Group A", [hostUserId, participantUserId], groupAId),
      room(roomBId, "Tournament Group B", [thirdUserId], groupBId)
    ]);
    Q.collection("activityMembers").insertMany([
      memberDocument(EVENT_ID, hostUserId, "Admin", "accepted"),
      memberDocument(EVENT_ID, participantUserId, "Member", "accepted"),
      memberDocument(EVENT_ID, thirdUserId, "Member", "accepted"),
      memberDocument(roomAId, hostUserId, "Member", "accepted"),
      memberDocument(roomAId, participantUserId, "Member", "accepted"),
      memberDocument(roomBId, thirdUserId, "Member", "accepted")
    ]);
    const runtimeId = `${PREFIX}:tournament-member-removal:runtime:qualifiers`;
    Q.collection("activitySubEventStageRuntime").insertOne({
      _id: runtimeId,
      syncKey: runtimeId,
      recordId: `${EVENT_ID}:${qualifier.id}`,
      status: "A",
      ownerId: EVENT_ID,
      subEventId: qualifier.id,
      stageStatus: "A",
      stageStatusReason: "stage-started",
      stageStatusUpdatedAt: stagedAtIso,
      groupsCount: 2,
      groupResourceMetricsByAssetOwnerId: {},
      createdDate: stagedAtIso,
      createdUser: Q.ACTOR,
      updatedDate: stagedAtIso,
      updatedUser: Q.ACTOR
    });
    Q.collection("eventLeaderboardEntries").insertOne({
      _id: `${PREFIX}:tournament-member-removal:score:nova`,
      syncKey: `${PREFIX}:tournament-member-removal:score:nova`,
      eventId: EVENT_ID,
      subEventId: qualifier.id,
      groupId: groupAId,
      entryType: "score",
      memberId: participantUserId,
      scoreValue: 7,
      note: "Manual QA retained removal-history score",
      createdAtIso: stagedAtIso,
      createdUser: hostUserId,
      updatedDate: stagedAtIso,
      updatedUser: hostUserId
    });
    Q.collection("chats").insertMany([
      tournamentMemberRemovalRoomChat(roomAId, "Tournament Group A", [hostUserId, participantUserId], hostUserId, stagedAtIso),
      tournamentMemberRemovalRoomChat(roomAId, "Tournament Group A", [hostUserId, participantUserId], participantUserId, stagedAtIso),
      tournamentMemberRemovalRoomChat(roomBId, "Tournament Group B", [thirdUserId], thirdUserId, stagedAtIso)
    ]);
    // The fixture bypasses normal writes only while establishing its baseline.
    // Its post-Remove counters are produced exclusively by the application write.
    applyEventActivityCounterDeltas(hostUserId, {
      menu: { hosting: 1 }, event: { all: 1, hosting: 1 }
    });
    applyEventActivityCounterDeltas(participantUserId, {
      menu: { events: 1 }, event: { all: 1, active: 1 }
    });
    applyEventActivityCounterDeltas(thirdUserId, {
      menu: { events: 1 }, event: { all: 1, active: 1 }
    });
    return { qualifierId: qualifier.id, groupAId, groupBId, roomAId, roomBId };
  }

  function casualSlotDefinitions() {
    return [
      {
        id: `${EVENT_ID}:sub-event:welcome`,
        name: "Welcome",
        description: "Manual QA slot welcome",
        timing: "During",
        offsetMinutes: 0,
        durationMinutes: 45,
        location: "Austin",
        optional: false,
        capacityMin: 1,
        capacityMax: 8
      },
      {
        id: `${EVENT_ID}:sub-event:main`,
        name: "Main activity",
        description: "Manual QA slot main activity",
        timing: "After",
        offsetMinutes: 45,
        durationMinutes: 60,
        location: "Austin",
        optional: true,
        capacityMin: 1,
        capacityMax: 8
      }
    ];
  }

  function slotContext(stageKind, stagedAtIso) {
    if (!["slot-future", "slot-past-tournament"].includes(stageKind)) return {};
    const stagedAt = new Date(stagedAtIso);
    stagedAt.setMilliseconds(0);
    const templateId = `${EVENT_ID}:slot-template:weekly`;
    const recentPast = new Date(stagedAt.getTime() - 180 * 60000);
    const templateStart = new Date(recentPast.getTime() - 7 * 24 * 60 * 60000);
    const future = new Date(recentPast.getTime() + 7 * 24 * 60 * 60000);
    const instant = value => value.toISOString().replace(".000Z", "Z");
    const local = value => value.toISOString().replace(".000Z", "").replace("Z", "");
    const slotId = value => `${EVENT_ID}:slot:${templateId}:${instant(value)}`;
    return {
      templateId,
      templateStartAt: local(templateStart),
      recentPastSlotStartAtIso: instant(recentPast),
      recentPastSlotId: slotId(recentPast),
      nextSlotStartAtIso: instant(future),
      nextSlotId: slotId(future),
      parentStartAtIso: instant(new Date(templateStart.getTime() - 24 * 60 * 60000)),
      parentEndAtIso: instant(new Date(future.getTime() + 8 * 24 * 60 * 60000))
    };
  }

  function insertSubmittedFeedback(stagedAtIso) {
    const submittedAtIso = new Date(new Date(stagedAtIso).getTime() - 60000).toISOString();
    Q.collection("eventFeedbackStates").insertOne({
      _id: `${PREFIX}:feedback-state`,
      syncKey: `${PREFIX}:feedback-state`,
      viewerUserId: participantUserId,
      eventId: EVENT_ID,
      removed: false,
      submittedAtIso,
      removedAtIso: null,
      organizerNote: "",
      createdDate: submittedAtIso,
      createdUser: participantUserId,
      updatedDate: submittedAtIso,
      updatedUser: participantUserId
    });
    Q.collection("eventFeedbackAnswers").insertOne({
      _id: `${PREFIX}:feedback-answer`,
      syncKey: `${PREFIX}:feedback-answer`,
      viewerUserId: participantUserId,
      eventId: EVENT_ID,
      cardId: `feedback-event-${EVENT_ID}`,
      kind: "event",
      targetUserId: hostUserId,
      targetRole: "Admin",
      primaryValue: "good",
      secondaryValue: "timing",
      personalityTraitIds: ["calm-one"],
      tags: [],
      submittedAtIso,
      createdDate: submittedAtIso,
      createdUser: participantUserId,
      updatedDate: submittedAtIso,
      updatedUser: participantUserId
    });
  }

  function insertReadyTicket(
      stagedAtIso,
      eventId = EVENT_ID,
      ticketId = `${PREFIX}:ticket`,
      code = newFixtureTicketCode()) {
    Q.collection("eventTickets").insertOne({
      _id: ticketId,
      code,
      eventId,
      holderUserId: participantUserId,
      status: "A",
      issuedAtIso: stagedAtIso,
      usedAtIso: null,
      usedByUserId: null
    });
  }

  function insertTicketInviteCandidateRate(stagedAtIso) {
    const id = `${PREFIX}:rate:ticket-invite-candidate`;
    const metAtIso = new Date(new Date(stagedAtIso).getTime() - 24 * 60 * 60000).toISOString();
    Q.collection("userRates").insertOne({
      _id: id,
      syncKey: id,
      mode: "single",
      ownerUserId: participantUserId,
      relatedUserId: thirdUserId,
      secondaryRelatedUserId: null,
      met: true,
      eventName: "Manual QA prior meetup",
      affinityScore: 1,
      createdDate: metAtIso,
      createdUser: Q.ACTOR,
      updatedDate: metAtIso,
      updatedUser: Q.ACTOR
    });
  }

  function participationOverlay(event, eventId, suffix) {
    return {
      ...event,
      _id: `${eventId}:overlay:${participantUserId}`,
      syncKey: `${eventId}:overlay:${suffix}:${participantUserId}`,
      ownerUserId: participantUserId
    };
  }

  function insertTicketIsolationBaseline(stagedAtIso, future, ticketCodes) {
    if (!eventImageUrl) {
      Q.fail("MANUAL_QA_EVENT_IMAGE_URL must contain the uploaded QA fixture image URL.");
    }
    const memberOptions = {
      ...future,
      imageUrl: eventImageUrl,
      ticketing: true,
      acceptedUserIds: [hostUserId, participantUserId],
      pendingUserIds: [thirdUserId]
    };
    const eventA = eventDocument(EVENT_ID, "Manual QA EVENT-TICKET-008 A", memberOptions);
    const eventB = eventDocument(ISOLATION_EVENT_ID, "Manual QA EVENT-TICKET-008 B", memberOptions);
    Q.collection("events").insertMany([
      eventA,
      participationOverlay(eventA, EVENT_ID, "a"),
      eventB,
      participationOverlay(eventB, ISOLATION_EVENT_ID, "b")
    ]);
    Q.collection("activityMembers").insertMany([EVENT_ID, ISOLATION_EVENT_ID].flatMap(eventId => [
      memberDocument(eventId, hostUserId, "Admin", "accepted"),
      memberDocument(eventId, participantUserId, "Member", "accepted"),
      memberDocument(eventId, thirdUserId, "Member", "pending", "join", {
        pendingSource: "member"
      })
    ]));
    insertReadyTicket(stagedAtIso, EVENT_ID, `${PREFIX}:ticket:isolation:a`, ticketCodes.ticketCode);
    insertReadyTicket(
      stagedAtIso,
      ISOLATION_EVENT_ID,
      `${PREFIX}:ticket:isolation:b`,
      ticketCodes.isolationTicketCode);
    applyEventActivityCounterDeltas(hostUserId, {
      menu: { hosting: 2 },
      event: { all: 2, hosting: 2 }
    });
    applyEventActivityCounterDeltas(participantUserId, {
      menu: { events: 2 },
      event: { all: 2, active: 2 }
    });
    applyEventActivityCounterDeltas(thirdUserId, {
      event: { all: 2, pending: 2 }
    });
    applyTicketActivityCounterDelta(participantUserId, 2);
  }

  function selectors() {
    return [
      { collection: "events", selector: manualEventSelector() },
      { collection: "activityMembers", selector: { $or: [
        { ownerType: "event", ownerId: { $in: EVENT_IDS } },
        { ownerId: { $regex: `^${PREFIX}` } }
      ] } },
      { collection: "activityResources", selector: { ownerId: { $regex: `^${PREFIX}` } } },
      { collection: "activitySubEventGroups", selector: { ownerId: { $regex: `^${PREFIX}` } } },
      { collection: "activitySubEventStageRuntime", selector: { ownerId: { $regex: `^${PREFIX}` } } },
      { collection: "eventLeaderboardEntries", selector: { eventId: { $regex: `^${PREFIX}` } } },
      { collection: "chats", selector: { $or: [
        { eventId: { $in: EVENT_IDS } },
        { ownerId: { $in: EVENT_IDS } },
        { eventId: { $regex: `^${PREFIX}` } },
        { ownerId: { $regex: `^${PREFIX}` } }
      ] } },
      { collection: "eventFeedbackStates", selector: { eventId: { $in: EVENT_IDS } } },
      { collection: "eventFeedbackAnswers", selector: { eventId: { $in: EVENT_IDS } } },
      { collection: "eventCheckoutBasketItems", selector: { sourceId: { $in: EVENT_IDS } } },
      { collection: "payments", selector: { sourceId: { $in: EVENT_IDS } } },
      { collection: "eventTickets", selector: { eventId: { $in: EVENT_IDS } } },
      { collection: "eventTicketAudit", selector: { eventId: { $in: EVENT_IDS } } },
      { collection: "notificationOutbox", selector: { $or: [{ entityId: { $in: EVENT_IDS } }, { "payload.eventId": { $in: EVENT_IDS } }] } },
      { collection: "userNotifications", selector: { $or: [{ sourceId: { $in: EVENT_IDS } }, { "payload.eventId": { $in: EVENT_IDS } }] } },
      { collection: "scheduledMessageTasks", selector: { eventId: { $in: EVENT_IDS } } },
      { collection: "affinityRecomputeTasks", selector: { targetId: { $in: EVENT_IDS } } },
      { collection: "schedulerPlanMarkers", selector: { $or: [
        { ownerId: { $in: EVENT_IDS } },
        { ownerId: { $regex: `^${PREFIX}` } }
      ] } },
      ...(checkpointId === "TOURNAMENT-003"
        ? [{ collection: "notificationRuleConfigs", selector: { ruleKey: TOURNAMENT_REVIEW_RULE } }]
        : []),
      ...(checkpointId === "EVENT-TICKET-007"
        ? [{ collection: "userRates", selector: ticketInviteCandidateRateSelector() }]
        : [])
    ];
  }

  function currentEventIds() {
    const parentIds = [...new Set([
      ...EVENT_IDS,
      ...(activeEventSourceId() ? [activeEventSourceId()] : [])
    ])];
    const values = [
      ...Q.collection("events").find(manualEventSelector()).toArray(),
      ...Q.collection("events").find(generatedRandomRoomSelector()).toArray()
    ];
    const orphanedTournamentRoomArtifacts = [
      ...Q.collection("notificationOutbox").find({
        "payload.parentEventId": { $in: parentIds },
        "payload.eventScope": "tournament-room"
      }).toArray(),
      ...Q.collection("userNotifications").find({
        "payload.parentEventId": { $in: parentIds },
        "payload.eventScope": "tournament-room"
      }).toArray()
    ];
    const ids = [...parentIds];
    for (const value of values) {
      const sourceId = Q.text(value.sourceId);
      const id = Q.text(value._id);
      if (sourceId) ids.push(sourceId);
      if (id) ids.push(id);
    }
    for (const value of orphanedTournamentRoomArtifacts) {
      const entityId = Q.text(value.entityId);
      const sourceId = Q.text(value.sourceId);
      const payloadEventId = Q.text(value.payload && value.payload.eventId);
      if (entityId) ids.push(entityId);
      if (sourceId) ids.push(sourceId);
      if (payloadEventId) ids.push(payloadEventId);
    }
    return [...new Set(ids)];
  }

  function clearDynamicEventEffects(eventIds) {
    const chatIds = Q.collection("chats").find({
      $or: [{ eventId: { $in: eventIds } }, { ownerId: { $in: eventIds } }]
    }).toArray().map(chat => Q.text(chat.id || chat._id)).filter(Boolean);
    if (chatIds.length > 0) Q.collection("chatMessages").deleteMany({ chatId: { $in: chatIds } });
    Q.collection("chats").deleteMany({
      $or: [{ eventId: { $in: eventIds } }, { ownerId: { $in: eventIds } }]
    });
    for (const collection of [
      "activityResources",
      "activitySubEventGroups",
      "activitySubEventStageRuntime"
    ]) Q.collection(collection).deleteMany({ $or: [
      { ownerId: { $in: eventIds } },
      { ownerId: { $regex: `^${PREFIX}` } }
    ] });
    Q.collection("eventLeaderboardEntries").deleteMany({ $or: [
      { eventId: { $in: eventIds } },
      { eventId: { $regex: `^${PREFIX}` } }
    ] });
    Q.collection("activityMembers").deleteMany({ $or: [
      { ownerType: "event", ownerId: { $in: eventIds } },
      { ownerId: { $regex: `^${PREFIX}` } }
    ] });
    Q.collection("eventFeedbackStates").deleteMany({ eventId: { $in: eventIds } });
    Q.collection("eventFeedbackAnswers").deleteMany({ eventId: { $in: eventIds } });
    Q.collection("eventCheckoutBasketItems").deleteMany({ sourceId: { $in: eventIds } });
    Q.collection("payments").deleteMany({ sourceId: { $in: eventIds } });
    Q.collection("eventTickets").deleteMany({ eventId: { $in: eventIds } });
    Q.collection("eventTicketAudit").deleteMany({ eventId: { $in: eventIds } });
    Q.collection("notificationOutbox").deleteMany({ $or: [
      { entityId: { $in: [...eventIds, ...chatIds] } },
      { "payload.eventId": { $in: eventIds } },
      { "payload.chatId": { $in: chatIds } }
    ] });
    Q.collection("userNotifications").deleteMany({ $or: [
      { sourceId: { $in: [...eventIds, ...chatIds] } },
      { "payload.eventId": { $in: eventIds } },
      { "payload.chatId": { $in: chatIds } }
    ] });
    if (checkpointId.startsWith("TOURNAMENT-")) {
      const reminderMessage = `${EXPECTED_TITLE} is coming up. Open the event before the stage starts.`;
      const reminderRuleKey = `event-stage-reminder:${EVENT_ID}:${EVENT_ID}:stage:final`;
      Q.collection("notificationOutbox").deleteMany({
        notificationType: "scheduled-template",
        entityType: "notification-template",
        entityId: "event-stage-reminder-v1",
        recipientUserIds: { $in: [hostUserId, participantUserId, thirdUserId] },
        title: "Final starts soon",
        body: reminderMessage,
        "payload.ruleKey": reminderRuleKey
      });
      Q.collection("userNotifications").deleteMany({
        kind: "scheduled-template",
        sourceId: "event-stage-reminder-v1",
        recipientUserId: { $in: [hostUserId, participantUserId, thirdUserId] },
        title: "Final starts soon",
        message: reminderMessage,
        "payload.ruleKey": reminderRuleKey
      });
    }
    Q.collection("scheduledMessageTasks").deleteMany({ eventId: { $in: eventIds } });
    Q.collection("affinityRecomputeTasks").deleteMany({ targetId: { $in: eventIds } });
    Q.collection("schedulerPlanMarkers").deleteMany({ $or: [
      { ownerId: { $in: eventIds } },
      { ownerId: { $regex: `^${PREFIX}` } }
    ] });
    Q.collection("events").deleteMany({
      $or: [{ _id: { $in: eventIds } }, { sourceId: { $in: eventIds } }, { title: activeExpectedTitle() }]
    });
  }

  function clearFixture() {
    clearDynamicEventEffects(currentEventIds());
    for (const spec of selectors()) {
      // Global scheduler configuration is snapshotted for exact reset, but it
      // must remain present so TOURNAMENT-003 can hold/arm the real rule.
      if (spec.collection === "notificationRuleConfigs") continue;
      Q.collection(spec.collection).deleteMany(spec.selector);
    }
  }

  function insertTournamentReviewBaseline(stagedAtIso) {
    const stageTimes = materializeTournamentStageTimes(tournamentStages(), dateIso(-90));
    const qualifierId = `${EVENT_ID}:stage:qualifiers`;
    const finalId = `${EVENT_ID}:stage:final`;
    const qualifierGroupA = `${qualifierId}:group:1`;
    const qualifierGroupB = `${qualifierId}:group:2`;
    const nowIso = Q.nowIso();
    const stages = stageTimes.map((stage, index) => index === 0
      ? {
          ...stage,
          stageStatus: "SR",
          stageStatusReason: "stage-ended",
          stageStatusUpdatedAt: stagedAtIso,
          stageFinalizedAt: null,
          stageFinalizedByUserId: null,
          membersAccepted: 3,
          membersPending: 0,
          groupsCount: 2,
          groupsPending: 0
        }
      : {
          ...stage,
          startAt: dateIso(180),
          endAt: dateIso(300),
          stageStatus: "RS",
          stageStatusReason: "awaiting-prior-stage",
          stageStatusUpdatedAt: null,
          stageFinalizedAt: null,
          stageFinalizedByUserId: null,
          membersAccepted: 0,
          membersPending: 0,
          groupsCount: 0,
          groupsPending: 0
        });
    const event = eventDocument(EVENT_ID, activeExpectedTitle(), {
      acceptedUserIds: [participantUserId, thirdUserId],
      startAtIso: dateIso(-90),
      endAtIso: dateIso(300),
      subEventsEnabled: true,
      subEventDefinitions: stages,
      subEvents: stages,
      mode: "Tournament"
    });
    Q.collection("events").insertOne(event);
    Q.collection("activityMembers").insertMany([
      memberDocument(EVENT_ID, hostUserId, "Admin", "accepted"),
      memberDocument(EVENT_ID, participantUserId, "Member", "accepted"),
      memberDocument(EVENT_ID, thirdUserId, "Member", "accepted"),
      { ...memberDocument(qualifierGroupA, hostUserId, "Member", "accepted"), ownerType: "group" },
      { ...memberDocument(qualifierGroupA, participantUserId, "Member", "accepted"), ownerType: "group" },
      { ...memberDocument(qualifierGroupB, thirdUserId, "Member", "accepted"), ownerType: "group" }
    ]);
    Q.collection("activitySubEventStageRuntime").insertOne({
      _id: `${PREFIX}:stage-runtime:tournament-review-qualifiers`,
      syncKey: `${PREFIX}:stage-runtime:tournament-review-qualifiers`,
      recordId: `${EVENT_ID}:${qualifierId}`,
      status: "A",
      ownerId: EVENT_ID,
      subEventId: qualifierId,
      stageStatus: "SR",
      stageStatusReason: "stage-ended",
      stageStatusUpdatedAt: stagedAtIso,
      stageFinalizedAt: null,
      stageFinalizedByUserId: null,
      groupsCount: 2,
      groupResourceMetricsByAssetOwnerId: {},
      createdDate: nowIso,
      createdUser: Q.ACTOR,
      updatedDate: nowIso,
      updatedUser: Q.ACTOR
    });
    Q.collection("eventLeaderboardEntries").insertMany([
      {
        _id: `${PREFIX}:tournament-review:score:casey`,
        syncKey: `${PREFIX}:tournament-review:score:casey`,
        eventId: EVENT_ID,
        subEventId: qualifierId,
        groupId: qualifierGroupA,
        entryType: "score",
        memberId: hostUserId,
        scoreValue: 9,
        note: "Manual QA deterministic winner",
        createdAtIso: nowIso,
        createdUser: hostUserId,
        updatedDate: nowIso,
        updatedUser: hostUserId
      },
      {
        _id: `${PREFIX}:tournament-review:score:nova`,
        syncKey: `${PREFIX}:tournament-review:score:nova`,
        eventId: EVENT_ID,
        subEventId: qualifierId,
        groupId: qualifierGroupA,
        entryType: "score",
        memberId: participantUserId,
        scoreValue: 4,
        note: "Manual QA deterministic non-advancer",
        createdAtIso: nowIso,
        createdUser: hostUserId,
        updatedDate: nowIso,
        updatedUser: hostUserId
      },
      {
        _id: `${PREFIX}:tournament-review:score:riley`,
        syncKey: `${PREFIX}:tournament-review:score:riley`,
        eventId: EVENT_ID,
        subEventId: qualifierId,
        groupId: qualifierGroupB,
        entryType: "score",
        memberId: thirdUserId,
        scoreValue: 7,
        note: "Manual QA deterministic winner",
        createdAtIso: nowIso,
        createdUser: hostUserId,
        updatedDate: nowIso,
        updatedUser: hostUserId
      }
    ]);
    const heldUntilIso = dateIso(60);
    const held = Q.collection("notificationRuleConfigs").updateOne(
      { ruleKey: TOURNAMENT_REVIEW_RULE },
      {
        $set: {
          enabled: true,
          "runState.currentStatus": "idle",
          "runState.lastRunAtIso": heldUntilIso,
          "runState.progressPercent": 0,
          "runState.progressDetail": "Held by TOURNAMENT-003 until the manual Finalize is persisted.",
          updatedDate: nowIso,
          updatedUser: Q.ACTOR
        },
        $unset: {
          "runState.startedAtIso": "",
          "runState.finishedAtIso": ""
        }
      }
    );
    if (held.matchedCount !== 1) {
      Q.fail(`notification rule '${TOURNAMENT_REVIEW_RULE}' was not found for TOURNAMENT-003.`);
    }
  }

  function stageData(stageKind, stagedAtIso, context = {}) {
    const future = { startAtIso: dateIso(180), endAtIso: dateIso(300) };
    const past = { startAtIso: dateIso(-240), endAtIso: dateIso(-120) };
    if (stageKind === "editor-empty") return;
    if (stageKind === "ticket-isolation") {
      insertTicketIsolationBaseline(stagedAtIso, future, context);
      return;
    }
    if (stageKind === "feedback-boundary") {
      insertEventWithMembers(eventDocument(EVENT_ID, "Manual QA feedback eligible", past));
      insertEventWithMembers(eventDocument(LOCKED_EVENT_ID, "Manual QA feedback locked", {
        startAtIso: dateIso(-60), endAtIso: dateIso(60)
      }));
      insertEventWithMembers(eventDocument(TRASHED_EVENT_ID, "Manual QA feedback trashed", {
        ...past,
        status: "T",
        statusBeforeSuppression: "A"
      }));
      insertEventWithMembers(eventDocument(PENDING_EVENT_ID, "Manual QA feedback pending", {
        ...past,
        accepted: false,
        pending: true
      }), "pending");
      return;
    }

    if (stageKind === "draft") {
      insertHostOnlyEvent(eventDocument(EVENT_ID, EXPECTED_TITLE, {
        ...future,
        status: "DR",
        accepted: false
      }));
      return;
    }
    if (stageKind === "publish-chat-draft") {
      const event = eventDocument(EVENT_ID, EXPECTED_TITLE, {
        ...future,
        status: "DR",
        acceptedUserIds: [hostUserId],
        pendingUserIds: [participantUserId, thirdUserId],
        invitedUserIds: [participantUserId, thirdUserId]
      });
      Q.collection("events").insertOne(event);
      Q.collection("activityMembers").insertMany([
        memberDocument(EVENT_ID, hostUserId, "Admin", "accepted"),
        memberDocument(EVENT_ID, participantUserId, "Member", "pending", "invite"),
        memberDocument(EVENT_ID, thirdUserId, "Member", "pending", "invite")
      ]);
      synchronizeEventActivityCounters([hostUserId, participantUserId, thirdUserId]);
      return;
    }
    if (stageKind === "slot-editor-draft") {
      insertHostOnlyEvent(eventDocument(EVENT_ID, EXPECTED_TITLE, {
        status: "DR",
        accepted: false,
        startAtIso: dateIso(-1440),
        endAtIso: dateIso(28 * 1440)
      }));
      return;
    }
    if (stageKind === "slot-future") {
      const definitions = tournamentStages();
      const event = eventDocument(EVENT_ID, EXPECTED_TITLE, {
        acceptedUserIds: [participantUserId],
        startAtIso: context.parentStartAtIso,
        endAtIso: context.parentEndAtIso,
        subEventsEnabled: true,
        subEventDefinitions: definitions,
        subEvents: definitions,
        mode: "Tournament"
      });
      event.frequency = "Weekly";
      event.slotsEnabled = true;
      event.slotTemplates = [{
        id: context.templateId,
        startAt: context.templateStartAt,
        overrideDate: null,
        closed: false,
        subEventDefinitions: []
      }];
      insertEventWithMembers(event);
      return;
    }
    if (stageKind === "slot-past-tournament") {
      const definitions = tournamentStages();
      const qualifier = definitions[0];
      const groupId = `${qualifier.id}:group:1`;
      const runtimeId = `${PREFIX}:stage-runtime:past-qualifier`;
      const groupOwnerId = `${context.recentPastSlotId}:${qualifier.id}:${groupId}`;
      const event = eventDocument(EVENT_ID, EXPECTED_TITLE, {
        acceptedUserIds: [participantUserId, thirdUserId],
        startAtIso: context.parentStartAtIso,
        endAtIso: context.parentEndAtIso,
        subEventsEnabled: true,
        subEventDefinitions: definitions,
        subEvents: definitions.map((item, index) => ({
          ...item,
          startAt: new Date(new Date(context.recentPastSlotStartAtIso).getTime() + index * 60 * 60000).toISOString(),
          endAt: new Date(new Date(context.recentPastSlotStartAtIso).getTime() + (index + 1) * 60 * 60000).toISOString(),
          membersAccepted: 2,
          membersPending: 0,
          groupsCount: index === 0 ? 1 : 0,
          groupsPending: 0
        })),
        mode: "Tournament"
      });
      event.frequency = "Weekly";
      event.slotsEnabled = true;
      event.slotTemplates = [{
        id: context.templateId,
        startAt: context.templateStartAt,
        overrideDate: null,
        closed: false,
        subEventDefinitions: []
      }];
      Q.collection("events").insertOne(event);
      Q.collection("activityMembers").insertMany([
        memberDocument(EVENT_ID, hostUserId, "Admin", "accepted"),
        memberDocument(EVENT_ID, participantUserId, "Member", "accepted"),
        memberDocument(EVENT_ID, thirdUserId, "Member", "accepted"),
        { ...memberDocument(groupOwnerId, participantUserId, "Member", "accepted"), ownerType: "group" },
        { ...memberDocument(groupOwnerId, thirdUserId, "Member", "accepted"), ownerType: "group" }
      ]);
      const now = Q.nowIso();
      Q.collection("activitySubEventStageRuntime").insertOne({
        _id: runtimeId,
        syncKey: runtimeId,
        recordId: `${context.recentPastSlotId}:${qualifier.id}`,
        status: "A",
        ownerId: context.recentPastSlotId,
        subEventId: qualifier.id,
        stageStatus: "RS",
        stageStatusReason: "awaiting-tournament-start",
        groupsCount: 1,
        groupResourceMetricsByAssetOwnerId: {},
        createdDate: now,
        createdUser: Q.ACTOR,
        updatedDate: now,
        updatedUser: Q.ACTOR
      });
      Q.collection("activitySubEventGroups").insertOne({
        _id: `${PREFIX}:group:past-qualifier`,
        syncKey: `${PREFIX}:group:past-qualifier`,
        recordId: `${runtimeId}:${groupId}`,
        status: "A",
        ownerId: runtimeId,
        groupId,
        name: "Group A",
        capacityMin: 2,
        capacityMax: 2,
        createdDate: now,
        createdUser: Q.ACTOR,
        updatedDate: now,
        updatedUser: Q.ACTOR
      });
      Q.collection("eventLeaderboardEntries").insertMany([
        {
          _id: `${PREFIX}:score:participant`,
          syncKey: `${PREFIX}:score:participant`,
          eventId: context.recentPastSlotId,
          subEventId: qualifier.id,
          groupId,
          entryType: "score",
          memberId: participantUserId,
          scoreValue: 7,
          note: "Manual QA baseline score",
          createdAtIso: now,
          createdUser: hostUserId,
          updatedDate: now,
          updatedUser: hostUserId
        },
        {
          _id: `${PREFIX}:score:third`,
          syncKey: `${PREFIX}:score:third`,
          eventId: context.recentPastSlotId,
          subEventId: qualifier.id,
          groupId,
          entryType: "score",
          memberId: thirdUserId,
          scoreValue: 4,
          note: "Manual QA baseline score",
          createdAtIso: now,
          createdUser: hostUserId,
          updatedDate: now,
          updatedUser: hostUserId
        }
      ]);
      return;
    }
    if (checkpointId === "TOURNAMENT-003") {
      insertTournamentReviewBaseline(stagedAtIso);
      return;
    }
    if (stageKind === "active-no-auto" || stageKind === "invitation-empty") {
      insertHostOnlyEvent(eventDocument(EVENT_ID, EXPECTED_TITLE, {
        ...future,
        accepted: false
      }));
      return;
    }
    if (stageKind === "invitation-pending") {
      const event = eventDocument(EVENT_ID, EXPECTED_TITLE, {
        ...future,
        accepted: false,
        pendingUserIds: [participantUserId],
        invitedUserIds: [participantUserId]
      });
      insertHostOnlyEvent(event);
      Q.collection("activityMembers").insertOne(memberDocument(
        EVENT_ID,
        participantUserId,
        "Member",
        "pending",
        "invite",
        { invitedByUserId: hostUserId }
      ));
      return;
    }
    if (stageKind === "chat-authorized") {
      const acceptedUserIds = [hostUserId, thirdUserId];
      const event = eventDocument(EVENT_ID, EXPECTED_TITLE, {
        ...future,
        acceptedUserIds,
        pendingUserIds: [participantUserId],
        invitedUserIds: [participantUserId]
      });
      Q.collection("events").insertOne(event);
      Q.collection("activityMembers").insertMany([
        memberDocument(EVENT_ID, hostUserId, "Admin", "accepted"),
        memberDocument(EVENT_ID, thirdUserId, "Member", "accepted"),
        memberDocument(EVENT_ID, participantUserId, "Member", "pending", "invite")
      ]);
      insertEmptyMainEventChat(event, acceptedUserIds, stagedAtIso);
      applyEventActivityCounterDeltas(hostUserId, {
        menu: { hosting: 1 },
        event: { all: 1, hosting: 1 }
      });
      applyEventActivityCounterDeltas(thirdUserId, {
        menu: { events: 1 },
        event: { all: 1, active: 1 }
      });
      applyEventActivityCounterDeltas(participantUserId, {
        menu: { invitations: 1 },
        event: { all: 1, invitations: 1 }
      });
      return;
    }
    if (stageKind === "invitation-visibility") {
      const openEvent = eventDocument(EVENT_ID, `${EXPECTED_TITLE} OPEN`, {
        ...future,
        blindMode: "Open Event",
        acceptedUserIds: [hostUserId],
        pendingUserIds: [participantUserId, thirdUserId],
        invitedUserIds: [participantUserId, thirdUserId]
      });
      const blindEvent = eventDocument(LOCKED_EVENT_ID, `${EXPECTED_TITLE} BLIND`, {
        ...future,
        blindMode: "Blind Event",
        acceptedUserIds: [hostUserId],
        pendingUserIds: [participantUserId, thirdUserId],
        invitedUserIds: [participantUserId, thirdUserId]
      });
      Q.collection("events").insertMany([openEvent, blindEvent]);
      Q.collection("activityMembers").insertMany([
        memberDocument(EVENT_ID, hostUserId, "Admin", "accepted"),
        memberDocument(EVENT_ID, participantUserId, "Member", "pending", "invite"),
        memberDocument(EVENT_ID, thirdUserId, "Member", "pending", "invite"),
        memberDocument(LOCKED_EVENT_ID, hostUserId, "Admin", "accepted"),
        memberDocument(LOCKED_EVENT_ID, participantUserId, "Member", "pending", "invite"),
        memberDocument(LOCKED_EVENT_ID, thirdUserId, "Member", "pending", "invite")
      ]);
      return;
    }
    if (stageKind === "invitation-ordinary") {
      const event = eventDocument(EVENT_ID, EXPECTED_TITLE, {
        ...future,
        acceptedUserIds: [participantUserId],
        pendingUserIds: [thirdUserId],
        invitedUserIds: [thirdUserId]
      });
      Q.collection("events").insertOne(event);
      Q.collection("activityMembers").insertMany([
        memberDocument(EVENT_ID, hostUserId, "Admin", "accepted"),
        memberDocument(EVENT_ID, participantUserId, "Member", "accepted"),
        memberDocument(EVENT_ID, thirdUserId, "Member", "pending", "invite", {
          invitedByUserId: participantUserId,
          pendingSource: "member"
        })
      ]);
      return;
    }
    if (stageKind === "invitation-full") {
      const event = eventDocument(EVENT_ID, EXPECTED_TITLE, {
        ...future,
        acceptedUserIds: [participantUserId],
        pendingUserIds: [thirdUserId],
        invitedUserIds: [thirdUserId]
      });
      // Casey and Nova already occupy two seats; Riley's pending invitation
      // reserves the third. This is the full boundary without staging an
      // impossible over-capacity document that the first normal member sync
      // would have to repair.
      event.capacityMax = 3;
      event.capacityTotal = 3;
      Q.collection("events").insertOne(event);
      Q.collection("activityMembers").insertMany([
        memberDocument(EVENT_ID, hostUserId, "Admin", "accepted"),
        memberDocument(EVENT_ID, participantUserId, "Member", "accepted"),
        memberDocument(EVENT_ID, thirdUserId, "Member", "pending", "invite", {
          invitedByUserId: hostUserId
        })
      ]);
      return;
    }
    if (isTournamentMemberRemovalStage(stageKind)) {
      return stageTournamentMemberRemoval(stagedAtIso);
    }
    if (isTournamentFixtureStage(stageKind)) {
      const definitions = tournamentStages();
      const tournamentTiming = checkpointId === "TOURNAMENT-002" || checkpointId === "TOURNAMENT-MEMBER-001"
        ? { startAtIso: dateIso(-5), endAtIso: dateIso(115) }
        : future;
      const materializedDefinitions = materializeTournamentStageTimes(
        definitions,
        tournamentTiming.startAtIso
      );
      const isMemberCutoff = stageKind === "tournament-member-cutoff";
      const event = eventDocument(EVENT_ID, EXPECTED_TITLE, {
        ...tournamentTiming,
        status: stageKind === "tournament-definition-draft" ? "DR" : "A",
        acceptedUserIds: isMemberCutoff ? [] : [participantUserId, thirdUserId],
        pendingUserIds: isMemberCutoff ? [participantUserId, thirdUserId] : [],
        invitedUserIds: isMemberCutoff ? [participantUserId, thirdUserId] : [],
        mode: "Tournament",
        subEventsEnabled: true,
        subEventDefinitions: materializedDefinitions,
        subEvents: materializedDefinitions.map(item => ({ ...item, membersAccepted: 0, membersPending: 0 }))
      });
      Q.collection("events").insertOne(event);
      Q.collection("activityMembers").insertMany(isMemberCutoff
        ? [
            memberDocument(EVENT_ID, hostUserId, "Admin", "accepted"),
            memberDocument(EVENT_ID, participantUserId, "Member", "pending", "invite"),
            memberDocument(EVENT_ID, thirdUserId, "Member", "pending", "invite")
          ]
        : [
            memberDocument(EVENT_ID, hostUserId, "Admin", "accepted"),
            memberDocument(EVENT_ID, participantUserId, "Member", "accepted"),
            memberDocument(EVENT_ID, thirdUserId, "Member", "accepted")
          ]);
      return;
    }

    const options = { ...future };
    if ((stageKind.startsWith("feedback-") || isTicketingStage(stageKind)) && !eventImageUrl) {
      Q.fail("MANUAL_QA_EVENT_IMAGE_URL must contain the uploaded QA fixture image URL.");
    }
    if (stageKind.startsWith("feedback-") || isTicketingStage(stageKind)) {
      options.imageUrl = eventImageUrl;
    }
    if (isTicketingStage(stageKind)) {
      options.acceptedUserIds = [hostUserId, participantUserId];
    }
    if (hasTicketPendingControl()) {
      options.pendingUserIds = [thirdUserId];
    }
    if (stageKind.startsWith("feedback-")) {
      Object.assign(options, past, {
        acceptedUserIds: [hostUserId, participantUserId]
      });
      if (stageKind === "feedback-empty" || stageKind === "feedback-submitted") {
        Object.assign(options, {
          feedbackCountersProjected: true,
          feedbackOwnEventCountersProjected: true,
          feedbackOwnEventCounterUserIds: [hostUserId]
        });
      }
      if (checkpointId === "EVENT-FEEDBACK-002") {
        options.acceptedUserIds = [hostUserId, participantUserId, thirdUserId];
      }
    }
    if (stageKind === "trashed") {
      options.status = "T";
      options.statusBeforeSuppression = "A";
    }
    if (["ticketing-on", "ticket-ready", "ticket-join", "ticket-invitation", "ticket-expiring"].includes(stageKind)) options.ticketing = true;
    if (stageKind === "ticket-join") {
      options.acceptedUserIds = [hostUserId];
      options.pendingUserIds = [];
      options.approvalRequired = true;
    }
    if (stageKind === "ticket-expiring") {
      options.startAtIso = dateIso(-60);
      options.endAtIso = dateIso(24 * 60);
    }
    const event = eventDocument(EVENT_ID, EXPECTED_TITLE, options);
    if (checkpointId === "EVENT-FEEDBACK-002") {
      Q.collection("events").insertOne(event);
      Q.collection("activityMembers").insertMany([
        memberDocument(EVENT_ID, hostUserId, "Admin", "accepted"),
        memberDocument(EVENT_ID, participantUserId, "Member", "accepted"),
        memberDocument(EVENT_ID, thirdUserId, "Member", "accepted")
      ]);
    } else if (hasTicketPendingControl()) {
      Q.collection("events").insertOne(event);
      Q.collection("activityMembers").insertMany([
        memberDocument(EVENT_ID, hostUserId, "Admin", "accepted"),
        memberDocument(EVENT_ID, participantUserId, "Member", "accepted"),
        memberDocument(EVENT_ID, thirdUserId, "Member", "pending", "join", {
          pendingSource: "member"
        })
      ]);
    } else if (stageKind === "ticket-join") {
      insertHostOnlyEvent(event);
    } else {
      insertEventWithMembers(event, "accepted");
    }
    if (stageKind === "ticket-ready") {
      insertEmptyMainEventChat(event, [hostUserId, participantUserId], stagedAtIso);
    }
    if (isTicketingStage(stageKind)) {
      applyEventActivityCounterDeltas(hostUserId, {
        menu: { hosting: 1 },
        event: { all: 1, hosting: 1 }
      });
      if (stageKind !== "ticket-join") {
        applyEventActivityCounterDeltas(participantUserId, {
          menu: { events: 1 },
          event: { all: 1, active: 1 }
        });
      }
      if (hasTicketPendingControl()) {
        applyEventActivityCounterDeltas(thirdUserId, {
          event: { all: 1, pending: 1 }
        });
      }
    }
    if (stageKind === "feedback-submitted") insertSubmittedFeedback(stagedAtIso);
    if (["ticket-ready", "ticket-invitation", "ticket-expiring"].includes(stageKind)) {
      Q.collection("events").insertOne(
        participationOverlay(event, EVENT_ID, stageKind)
      );
      insertReadyTicket(stagedAtIso, EVENT_ID, `${PREFIX}:ticket`, context.ticketCode);
      applyTicketActivityCounterDelta(participantUserId, 1);
    }
    if (stageKind === "ticket-invitation") {
      insertTicketInviteCandidateRate(stagedAtIso);
    }
  }

  function eventSummary() {
    const host = Q.collection("users").findOne({
      $or: [{ _id: hostUserId }, { userId: hostUserId }]
    }) || {};
    const hostCoordinates = host.locationCoordinates || null;
    const coordinatesMatch = eventCoordinates => {
      if (!hostCoordinates || !eventCoordinates) return null;
      return Number(hostCoordinates.latitude) === Number(eventCoordinates.latitude)
        && Number(hostCoordinates.longitude) === Number(eventCoordinates.longitude);
    };
    return Q.collection("events").find(manualEventSelector()).toArray().map(event => ({
      recordId: Q.text(event._id),
      eventId: Q.text(event.sourceId),
      ownerUserId: Q.text(event.ownerUserId),
      creatorUserId: Q.text(event.creatorUserId),
      title: Q.text(event.title),
      imageUrl: Q.text(event.imageUrl),
      status: Q.text(event.status),
      published: Q.text(event.status) === "A",
      isTrashed: Q.text(event.status) === "T" || event.isTrashed === true,
      statusBeforeSuppression: event.statusBeforeSuppression,
      trashedAtIso: Q.text(event.trashedAtIso),
      ticketing: event.ticketing,
      visibility: Q.text(event.visibility),
      blindMode: Q.text(event.blindMode),
      acceptedMembers: Number(event.acceptedMembers || 0),
      pendingMembers: Number(event.pendingMembers || 0),
      capacityTotal: Number(event.capacityTotal || 0),
      acceptedMemberUserIds: event.acceptedMemberUserIds || [],
      pendingMemberUserIds: event.pendingMemberUserIds || [],
      invitedMemberUserIds: event.invitedMemberUserIds || [],
      pendingRequestMemberUserIds: event.pendingRequestMemberUserIds || [],
      mode: Q.text(event.mode),
      autoInviter: event.autoInviter === true,
      frequency: Q.text(event.frequency),
      timeframe: Q.text(event.timeframe),
      location: Q.text(event.location),
      locationCoordinates: event.locationCoordinates || null,
      hostLocationCoordinates: hostCoordinates,
      locationCoordinatesMatchHost: coordinatesMatch(event.locationCoordinates),
      slotsEnabled: event.slotsEnabled === true,
      subEventsEnabled: event.subEventsEnabled === true,
      slotTemplates: (event.slotTemplates || []).map(item => ({
        id: Q.text(item.id || item._id),
        startAt: item.startAt,
        closed: item.closed === true,
        overrideDate: item.overrideDate
      })),
      subEventDefinitions: (event.subEventDefinitions || []).map((item, index) => {
        const editorEstimate = tournamentEditorGroupCountEstimate(item);
        return {
          id: Q.text(item.id),
          name: Q.text(item.name),
          description: Q.text(item.description),
          timing: Q.text(item.timing),
          offsetMinutes: Number(item.offsetMinutes || 0),
          durationMinutes: Number(item.durationMinutes || 0),
          startAt: item.startAt,
          endAt: item.endAt,
          optional: item.optional === true,
          capacityMin: Number(item.capacityMin || 0),
          capacityMax: Number(item.capacityMax || 0),
          stageStatus: Q.text(item.stageStatus),
          editorEstimatedGroupsMin: editorEstimate.min,
          editorEstimatedGroupsMax: editorEstimate.max,
          editorEstimatedGroupsLabel: `${editorEstimate.min} - ${editorEstimate.max}`,
          expectedGeneratedGroupsCount: expectedTournamentGroupCount(event, index),
          tournamentGroupCapacityMin: item.tournamentGroupCapacityMin,
          tournamentGroupCapacityMax: item.tournamentGroupCapacityMax,
          tournamentLeaderboardType: Q.text(item.tournamentLeaderboardType),
          tournamentAdvancePerGroup: item.tournamentAdvancePerGroup
        };
      }),
      startAtIso: event.startAtIso,
      endAtIso: event.endAtIso
    }));
  }

  function expectedTournamentGroupCount(event, targetIndex) {
    const definitions = event.subEventDefinitions || [];
    let incomingCapacityMax = Math.max(0, Number(event.capacityMax || event.capacityTotal || 0));
    for (let index = 0; index < definitions.length && index <= targetIndex; index += 1) {
      const stage = definitions[index] || {};
      const groupCapacityMin = Math.max(0, Number(stage.tournamentGroupCapacityMin || 0));
      const groupCapacityMax = Math.max(groupCapacityMin, Number(stage.tournamentGroupCapacityMax || groupCapacityMin));
      const stageCapacityMax = Math.max(0, Number(stage.capacityMax || 0));
      const effectiveCapacityMax = incomingCapacityMax > 0 && stageCapacityMax > 0
        ? Math.min(incomingCapacityMax, stageCapacityMax)
        : Math.max(incomingCapacityMax, stageCapacityMax);
      const divisor = Math.max(1, groupCapacityMax > 0 ? groupCapacityMax : groupCapacityMin);
      const groupsNeededForMaximum = effectiveCapacityMax > 0
        ? Math.ceil(effectiveCapacityMax / divisor)
        : 0;
      const groupsAllowedByMinimum = groupCapacityMin > 0
        ? Math.max(1, Math.floor(effectiveCapacityMax / groupCapacityMin))
        : groupsNeededForMaximum;
      const groupCount = groupCapacityMin > 0 || groupCapacityMax > 0
        ? Math.min(groupsNeededForMaximum, groupsAllowedByMinimum)
        : 0;
      if (index === targetIndex) return groupCount;
      const advancePerGroup = Math.max(0, Number(stage.tournamentAdvancePerGroup || 0));
      incomingCapacityMax = groupCount > 0 && advancePerGroup > 0
        ? groupCount * advancePerGroup
        : 0;
    }
    return 0;
  }

  function tournamentEditorGroupCountEstimate(stage) {
    const positiveInteger = value => {
      const parsed = Math.trunc(Number(value));
      return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
    };
    const groupMin = Math.max(1, positiveInteger(stage.tournamentGroupCapacityMin) || 1);
    const groupMax = Math.max(groupMin, positiveInteger(stage.tournamentGroupCapacityMax));
    const stageMin = positiveInteger(stage.capacityMin);
    const stageMax = Math.max(stageMin, positiveInteger(stage.capacityMax));
    const min = Math.max(1, Math.ceil(stageMin / groupMax));
    const max = Math.max(min, Math.ceil(stageMax / groupMin));
    return { min, max };
  }

  function generatedTournamentGroupIdentity(room, event) {
    const roomEventId = Q.text(room && (room.sourceId || room._id));
    const parentCandidates = [...new Set([
      Q.text(event && (event.sourceId || event._id)),
      ...EVENT_IDS,
      activeEventSourceId()
    ].filter(Boolean))]
      .sort((left, right) => right.length - left.length);
    const parentEventId = parentCandidates.find(candidate => (
      roomEventId.startsWith(`random-room:${candidate}:`)
    )) || "";
    const suffix = parentEventId
      ? roomEventId.slice(`random-room:${parentEventId}:`.length)
      : "";
    const stageCandidates = [
      ...((event && event.subEventDefinitions) || []),
      ...((event && event.subEvents) || [])
    ]
      .map(stage => Q.text(stage && stage.id))
      .filter(Boolean)
      .sort((left, right) => right.length - left.length);
    const stageId = stageCandidates.find(candidate => suffix.startsWith(`${candidate}:`)) || "";
    const groupId = stageId ? suffix.slice(`${stageId}:`.length) : suffix;
    return { roomEventId, parentEventId, stageId, groupId };
  }

  function oracle(state) {
    const dynamicEventIds = currentEventIds();
    const event = Q.collection("events").findOne(manualEventSelector()) || {};
    const generatedRoomEvents = Q.collection("events")
      .find(generatedRandomRoomSelector())
      .sort({ sourceId: 1, _id: 1 })
      .toArray();
    const members = Q.collection("activityMembers").find({ $or: [
      { ownerType: "event", ownerId: { $in: dynamicEventIds } },
      { ownerId: { $regex: `^${PREFIX}` } }
    ] }).toArray();
    const feedbackStates = Q.collection("eventFeedbackStates").find({ eventId: { $in: dynamicEventIds } }).toArray();
    const feedbackAnswers = Q.collection("eventFeedbackAnswers").find({ eventId: { $in: dynamicEventIds } }).toArray();
    const checkoutBasketItems = Q.collection("eventCheckoutBasketItems")
      .find({ sourceId: { $in: dynamicEventIds } })
      .sort({ createdAtIso: 1, _id: 1 })
      .toArray();
    const payments = Q.collection("payments")
      .find({ sourceId: { $in: dynamicEventIds } })
      .sort({ createdDate: 1, _id: 1 })
      .toArray();
    const ticketInviteCandidateRates = checkpointId === "EVENT-TICKET-007"
      ? Q.collection("userRates")
          .find(ticketInviteCandidateRateSelector())
          .sort({ createdDate: 1, _id: 1 })
          .toArray()
      : [];
    const tickets = Q.collection("eventTickets").find({ eventId: { $in: dynamicEventIds } }).toArray();
    const ticketReplayAudits = Q.collection("eventTicketAudit").find({
      eventId: { $in: dynamicEventIds },
      action: "check-in-replay",
      result: "already_used"
    }).sort({ createdDate: 1 }).toArray();
    const ticketReplayOutbox = Q.collection("notificationOutbox").find({
      notificationType: "event-ticket-replay-warning",
      $or: [{ entityId: { $in: dynamicEventIds } }, { "payload.eventId": { $in: dynamicEventIds } }]
    }).sort({ createdDate: 1 }).toArray();
    const ticketReplayNotifications = Q.collection("userNotifications").find({
      kind: "event-ticket-replay-warning",
      $or: [{ sourceId: { $in: dynamicEventIds } }, { "payload.eventId": { $in: dynamicEventIds } }]
    }).sort({ createdDate: 1 }).toArray();
    const stageRuntime = Q.collection("activitySubEventStageRuntime").find({ ownerId: { $regex: `^${PREFIX}` } }).toArray();
    const groups = Q.collection("activitySubEventGroups").find({ ownerId: { $regex: `^${PREFIX}` } }).toArray();
    const leaderboard = Q.collection("eventLeaderboardEntries").find({ eventId: { $regex: `^${PREFIX}` } }).toArray();
    const eventChats = Q.collection("chats").find({
      $or: [
        { chatId: { $in: dynamicEventIds } },
        { eventId: { $in: dynamicEventIds } },
        { ownerId: { $in: dynamicEventIds } }
      ]
    }).toArray();
    const eventChatIds = sortedUnique(eventChats.map(chat => chat.id || chat.chatId || chat._id));
    const eventChatArtifactIds = sortedUnique([...eventChatIds, ...dynamicEventIds]);
    const eventChatMessages = eventChatArtifactIds.length > 0
      ? Q.collection("chatMessages").find({ chatId: { $in: eventChatArtifactIds } }).toArray()
      : [];
    const eventChatNotificationOutbox = eventChatArtifactIds.length > 0
      ? Q.collection("notificationOutbox").find({
          notificationType: "chat-message",
          $or: [{ entityId: { $in: eventChatArtifactIds } }, { "payload.chatId": { $in: eventChatArtifactIds } }]
        }).toArray()
      : [];
    const eventChatNotifications = eventChatArtifactIds.length > 0
      ? Q.collection("userNotifications").find({
          kind: "chat-message",
          $or: [{ sourceId: { $in: eventChatArtifactIds } }, { "payload.chatId": { $in: eventChatArtifactIds } }]
        }).toArray()
      : [];
    const generatedRoomNotificationOutbox = eventChatArtifactIds.length > 0
      ? Q.collection("notificationOutbox").find({
          notificationType: "event-random-groups",
          $or: [{ entityId: { $in: eventChatArtifactIds } }, { "payload.eventId": { $in: eventChatArtifactIds } }]
        }).sort({ entityId: 1, _id: 1 }).toArray()
      : [];
    const generatedRoomNotifications = eventChatArtifactIds.length > 0
      ? Q.collection("userNotifications").find({
          kind: "event-random-groups",
          $or: [{ sourceId: { $in: eventChatArtifactIds } }, { "payload.eventId": { $in: eventChatArtifactIds } }]
        }).sort({ sourceId: 1, recipientUserId: 1, _id: 1 }).toArray()
      : [];
    const tournamentReminderNotifications = checkpointId.startsWith("TOURNAMENT-")
      ? Q.collection("userNotifications").find({
          recipientUserId: { $in: [hostUserId, participantUserId, thirdUserId] },
          title: { $in: ["Tournament started", "Final starts soon"] }
        }).sort({ createdDate: 1, recipientUserId: 1, _id: 1 }).toArray()
      : [];
    const invitationAcceptanceOutbox = Q.collection("notificationOutbox").find({
      notificationType: "event-invitation-accepted",
      $or: [{ entityId: { $in: dynamicEventIds } }, { "payload.eventId": { $in: dynamicEventIds } }]
    }).toArray();
    const invitationAcceptanceNotifications = Q.collection("userNotifications").find({
      kind: "event-invitation-accepted",
      $or: [{ sourceId: { $in: dynamicEventIds } }, { "payload.eventId": { $in: dynamicEventIds } }]
    }).toArray();
    const eventInvitationNotifications = Q.collection("userNotifications").find({
      kind: "event-invite",
      recipientUserId: { $in: [hostUserId, participantUserId, thirdUserId] },
      $or: [{ sourceId: { $in: dynamicEventIds } }, { "payload.eventId": { $in: dynamicEventIds } }]
    }).toArray();
    const eventInvitationOutbox = Q.collection("notificationOutbox").find({
      notificationType: "event-invite",
      $or: [{ entityId: { $in: dynamicEventIds } }, { "payload.eventId": { $in: dynamicEventIds } }]
    }).sort({ createdDate: 1, _id: 1 }).toArray();
    const eventJoinRequestNotifications = Q.collection("userNotifications").find({
      kind: { $in: ["event-admin-join-request", "event-admin-join-request-cancelled"] },
      $or: [{ sourceId: { $in: dynamicEventIds } }, { "payload.eventId": { $in: dynamicEventIds } }]
    }).sort({ createdDate: 1, _id: 1 }).toArray();
    const eventMemberApprovalOutbox = Q.collection("notificationOutbox").find({
      notificationType: "event-member-approved",
      $or: [{ entityId: { $in: dynamicEventIds } }, { "payload.eventId": { $in: dynamicEventIds } }]
    }).sort({ createdDate: 1, _id: 1 }).toArray();
    const eventMemberApprovalNotifications = Q.collection("userNotifications").find({
      kind: "event-member-approved",
      $or: [{ sourceId: { $in: dynamicEventIds } }, { "payload.eventId": { $in: dynamicEventIds } }]
    }).sort({ createdDate: 1, _id: 1 }).toArray();
    const eventLifecycleTasks = Q.collection("scheduledMessageTasks").find({
      actionKey: "event.definition.changed",
      eventId: { $in: dynamicEventIds }
    }).sort({ updatedDate: 1, _id: 1 }).toArray();
    const eventLifecycleOutbox = Q.collection("notificationOutbox").find({
      notificationType: { $in: ["event-deleted", "event-under-review", "event-modified", "event-details-changed"] },
      $or: [{ entityId: { $in: dynamicEventIds } }, { "payload.eventId": { $in: dynamicEventIds } }]
    }).sort({ createdDate: 1, _id: 1 }).toArray();
    const eventLifecycleNotifications = Q.collection("userNotifications").find({
      kind: { $in: ["event-deleted", "event-under-review", "event-modified", "event-details-changed"] },
      $or: [{ sourceId: { $in: dynamicEventIds } }, { "payload.eventId": { $in: dynamicEventIds } }]
    }).sort({ createdDate: 1, _id: 1 }).toArray();
    const eventRecomputeTasks = Q.collection("affinityRecomputeTasks").find({
      targetId: { $in: dynamicEventIds },
      updatedDate: { $gt: state.stagedAtIso }
    }).sort({ updatedDate: 1, _id: 1 }).toArray();
    const workerRules = Q.collection("notificationRuleConfigs").find({
      ruleKey: { $in: [
        "notification-outbox",
        "affinity-recompute",
        ...(checkpointId === "TOURNAMENT-003" ? [TOURNAMENT_REVIEW_RULE] : [])
      ] }
    }).sort({ ruleKey: 1 }).toArray();
    const feedbackNotificationOutbox = Q.collection("notificationOutbox").find({
      notificationType: "event-feedback-submitted",
      $or: [{ entityId: { $in: dynamicEventIds } }, { "payload.eventId": { $in: dynamicEventIds } }]
    }).toArray();
    const feedbackNotifications = Q.collection("userNotifications").find({
      kind: "event-feedback-submitted",
      $or: [{ sourceId: { $in: dynamicEventIds } }, { "payload.eventId": { $in: dynamicEventIds } }]
    }).toArray();
    const feedbackRecomputeTasks = Q.collection("affinityRecomputeTasks").find({
      targetId: { $in: [hostUserId, participantUserId] },
      updatedDate: { $gt: state.stagedAtIso }
    }).toArray();
    const feedbackTarget = Q.collection("users").findOne({
      $or: [{ _id: hostUserId }, { userId: hostUserId }]
    }) || {};
    const summarizeImpressionsSection = section => ({
      unreadCount: Number(section && section.unreadCount || 0),
      averageRating: section && section.averageRating,
      peopleMet: Number(section && section.peopleMet || 0),
      totalEvents: Number(section && section.totalEvents || 0),
      personalityTraits: (section && section.personalityTraits || []).map(trait => ({
        id: Q.text(trait.id),
        label: Q.text(trait.label),
        percent: Number(trait.percent || 0),
        evidenceCount: Number(trait.evidenceCount || 0),
        lastRatedAtIso: Q.text(trait.lastRatedAtIso)
      }))
    });
    const outboxCount = Q.collection("notificationOutbox").countDocuments({
      $and: [
        { $or: [{ entityId: { $in: dynamicEventIds } }, { "payload.eventId": { $in: dynamicEventIds } }] },
        { createdDate: { $gt: state.stagedAtIso } }
      ]
    });
    const taskCount = Q.collection("affinityRecomputeTasks").countDocuments({
      targetId: { $in: [...dynamicEventIds, hostUserId, participantUserId] },
      updatedDate: { $gt: state.stagedAtIso }
    });
    const tournamentReview = checkpointId === "TOURNAMENT-003"
      ? (() => {
          const qualifierStageId = `${EVENT_ID}:stage:qualifiers`;
          const finalStageId = `${EVENT_ID}:stage:final`;
          const qualifierGroupIds = sortedUnique(leaderboard
            .filter(entry => Q.text(entry.subEventId) === qualifierStageId)
            .map(entry => entry.groupId));
          const qualifierGroups = qualifierGroupIds.map(groupId => {
            const scores = leaderboard
              .filter(entry => Q.text(entry.subEventId) === qualifierStageId
                && Q.text(entry.groupId) === groupId)
              .map(entry => ({
                userId: Q.text(entry.memberId),
                user: Q.user(Q.text(entry.memberId)),
                score: Number(entry.scoreValue || 0)
              }))
              .sort((left, right) => right.score - left.score
                || left.userId.localeCompare(right.userId));
            return {
              groupId,
              acceptedMemberUserIds: sortedUnique(members
                .filter(member => Q.text(member.ownerType) === "group"
                  && Q.text(member.ownerId) === groupId
                  && Q.text(member.status).toLowerCase() === "accepted")
                .map(member => member.userId)),
              scores,
              advancingUserIds: scores.slice(0, 1).map(entry => entry.userId)
            };
          });
          const reviewRule = workerRules.find(item => Q.text(item.ruleKey) === TOURNAMENT_REVIEW_RULE) || {};
          const finalGroupMembers = members
            .filter(member => Q.text(member.ownerType) === "group"
              && Q.text(member.ownerId).startsWith(`${finalStageId}:group:`)
              && Q.text(member.status).toLowerCase() === "accepted");
          return {
            qualifierStageId,
            finalStageId,
            advancePerGroup: 1,
            qualifierGroups,
            expectedFinalMemberUserIds: sortedUnique(
              qualifierGroups.flatMap(group => group.advancingUserIds)
            ),
            finalGroupOwnerIds: sortedUnique(finalGroupMembers.map(member => member.ownerId)),
            finalMemberUserIds: sortedUnique(finalGroupMembers.map(member => member.userId)),
            finalRoomEventIds: generatedRoomEvents
              .filter(room => Q.text(room.parentSubEventId) === finalStageId)
              .map(room => Q.text(room.sourceId || room._id))
              .filter(Boolean),
            armCount: Number(state.tournamentReviewArmCount || 0),
            reviewRule: {
              ruleKey: Q.text(reviewRule.ruleKey),
              enabled: reviewRule.enabled === true,
              intervalSeconds: Number(reviewRule.timing && reviewRule.timing.intervalSeconds || 0),
              currentStatus: Q.text(reviewRule.runState && reviewRule.runState.currentStatus),
              lastRunAtIso: Q.text(reviewRule.runState && reviewRule.runState.lastRunAtIso),
              lastRunCount: Number(reviewRule.runState && reviewRule.runState.lastRunCount || 0),
              progressDetail: Q.text(reviewRule.runState && reviewRule.runState.progressDetail)
            }
          };
        })()
      : null;
    return {
      events: eventSummary(),
      tournamentReview,
      generatedRoomEvents: generatedRoomEvents.map(room => {
        const identity = generatedTournamentGroupIdentity(room, event);
        return {
          recordId: Q.text(room._id),
          eventId: identity.roomEventId,
          parentEventId: identity.parentEventId,
          parentSubEventId: identity.stageId,
          groupId: identity.groupId,
          identitySource: "stable-random-room-id",
          title: Q.text(room.title),
          subtitle: Q.text(room.subtitle),
          creatorUserId: Q.text(room.creatorUserId),
          organizerUserId: Q.text(room.organizerUserId),
          creatorName: Q.text(room.creatorName),
          creatorInitials: Q.text(room.creatorInitials),
          avatar: Q.text(room.avatar),
          imageUrl: Q.text(room.imageUrl),
          status: Q.text(room.status),
          generated: room.generated === true,
          eventType: Q.text(room.eventType),
          acceptedMembers: Number(room.acceptedMembers || 0),
          acceptedMemberUserIds: sortedUnique(room.acceptedMemberUserIds || []),
          capacityMin: Number(room.capacityMin || 0),
          capacityMax: Number(room.capacityMax || 0)
        };
      }),
      generatedTournamentGroups: generatedRoomEvents.map(room => {
        const identity = generatedTournamentGroupIdentity(room, event);
        return {
          parentEventId: identity.parentEventId,
          subEventId: identity.stageId,
          groupId: identity.groupId,
          membershipOwnerType: "event",
          membershipOwnerId: identity.roomEventId,
          acceptedMembers: Number(room.acceptedMembers || 0),
          acceptedMemberUserIds: sortedUnique(room.acceptedMemberUserIds || []),
          capacityMin: Number(room.capacityMin || 0),
          capacityMax: Number(room.capacityMax || 0)
        };
      }),
      primaryEvent: {
        status: Q.text(event.status),
        isTrashed: Q.text(event.status) === "T" || event.isTrashed === true,
        statusBeforeSuppression: Q.text(event.statusBeforeSuppression),
        trashedAtIso: Q.text(event.trashedAtIso),
        ticketing: event.ticketing === true
      },
      members: members.map(member => ({
        eventId: Q.text(member.ownerId),
        ownerType: Q.text(member.ownerType),
        userId: Q.text(member.userId),
        role: Q.text(member.role),
        status: Q.text(member.status),
        statusBeforeSuppression: Q.text(member.statusBeforeSuppression),
        suppressionRootOwnerId: Q.text(member.suppressionRootOwnerId),
        suppressedAtIso: Q.text(member.suppressedAtIso),
        attendanceStatus: Q.text(member.attendanceStatus),
        checkedInAtIso: Q.text(member.checkedInAtIso),
        checkedInByUserId: Q.text(member.checkedInByUserId),
        checkedInTicketId: Q.text(member.checkedInTicketId),
        actionAtIso: Q.text(member.actionAtIso),
        requestKind: Q.text(member.requestKind),
        pendingSource: Q.text(member.pendingSource),
        invitedByUserId: Q.text(member.invitedByUserId),
        updatedDate: member.updatedDate
      })),
      checkoutBasketItems: checkoutBasketItems.map(item => ({
        id: Q.text(item._id),
        itemId: Q.text(item.itemId),
        userId: Q.text(item.userId),
        eventId: Q.text(item.sourceId),
        status: Q.text(item.status),
        resultState: Q.text(item.resultState),
        reservationActive: item.reservationActive === true,
        checkoutSessionId: Q.text(item.checkoutSessionId),
        createdAtIso: Q.text(item.createdAtIso),
        updatedAtIso: Q.text(item.updatedAtIso)
      })),
      payments: payments.map(item => ({
        id: Q.text(item._id),
        userId: Q.text(item.userId),
        eventId: Q.text(item.sourceId),
        status: Q.text(item.status),
        bookingStatus: Q.text(item.bookingStatus),
        checkoutSessionId: Q.text(item.checkoutSessionId),
        gatewaySessionId: Q.text(item.gatewaySessionId),
        joinedAtIso: Q.text(item.joinedAtIso),
        cancelledAtIso: Q.text(item.cancelledAtIso),
        refundStatus: Q.text(item.refundStatus),
        createdDate: Q.text(item.createdDate)
      })),
      ticketInviteCandidateRates: ticketInviteCandidateRates.map(item => ({
        id: Q.text(item._id),
        mode: Q.text(item.mode),
        ownerUserId: Q.text(item.ownerUserId),
        relatedUserId: Q.text(item.relatedUserId),
        met: item.met === true,
        eventName: Q.text(item.eventName),
        affinityScore: Number(item.affinityScore || 0),
        createdDate: Q.text(item.createdDate),
        updatedDate: Q.text(item.updatedDate)
      })),
      eventChats: eventChats.map(chat => ({
        chatId: Q.text(chat.id || chat.chatId || chat._id),
        eventId: Q.text(chat.eventId),
        ownerUserId: Q.text(chat.ownerUserId),
        memberUserIds: sortedUnique(chat.memberIds || []),
        channelType: Q.text(chat.channelType),
        title: Q.text(chat.title),
        avatar: Q.text(chat.avatar),
        lastMessage: Q.text(chat.lastMessage),
        unread: Number(chat.unread || 0)
      })),
      eventChatMessages: eventChatMessages.map(message => ({
        chatId: Q.text(message.chatId),
        messageId: Q.text(message.id || message._id),
        clientId: Q.text(message.clientId),
        sender: Q.text(message.sender),
        senderUserId: Q.text(message.senderAvatar && message.senderAvatar.id),
        senderGender: Q.text(message.senderAvatar && message.senderAvatar.gender),
        text: Q.text(message.text),
        sentAtIso: Q.text(message.sentAtIso)
      })),
      eventChatNotificationOutbox: eventChatNotificationOutbox.map(item => ({
        notificationType: Q.text(item.notificationType),
        chatId: Q.text(item.entityId || item.payload && item.payload.chatId),
        messageId: Q.text(item.payload && item.payload.messageId),
        recipientUserIds: sortedUnique(item.recipientUserIds || []),
        status: Q.text(item.status)
      })),
      eventChatNotifications: eventChatNotifications.map(item => ({
        recipientUserId: Q.text(item.recipientUserId),
        kind: Q.text(item.kind),
        chatId: Q.text(item.sourceId || item.payload && item.payload.chatId),
        messageId: Q.text(item.payload && item.payload.messageId),
        title: Q.text(item.title),
        message: Q.text(item.message)
      })),
      generatedRoomNotificationOutbox: generatedRoomNotificationOutbox.map(item => ({
        id: Q.text(item._id),
        eventId: Q.text(item.entityId || item.payload && item.payload.eventId),
        recipientUserIds: sortedUnique(item.recipientUserIds || []),
        title: Q.text(item.title),
        body: Q.text(item.body),
        eventScope: Q.text(item.payload && item.payload.eventScope),
        eventTitle: Q.text(item.payload && item.payload.eventTitle),
        iconUrl: Q.text(item.iconUrl || item.payload && item.payload.icon),
        status: Q.text(item.status)
      })),
      generatedRoomNotifications: generatedRoomNotifications.map(item => ({
        id: Q.text(item._id),
        eventId: Q.text(item.sourceId || item.payload && item.payload.eventId),
        recipientUserId: Q.text(item.recipientUserId),
        kind: Q.text(item.kind),
        title: Q.text(item.title),
        message: Q.text(item.message),
        eventScope: Q.text(item.payload && item.payload.eventScope),
        eventTitle: Q.text(item.payload && item.payload.eventTitle),
        iconUrl: Q.text(item.payload && item.payload.icon),
        readAtIso: Q.text(item.readAtIso),
        createdDate: Q.text(item.createdDate)
      })),
      tournamentNotificationCausality: checkpointId.startsWith("TOURNAMENT-")
        ? (() => {
            const started = tournamentReminderNotifications
              .filter(item => Q.text(item.kind) === "event-tournament-started");
            const roomReady = generatedRoomNotifications;
            const startedRecipients = sortedUnique(started.map(item => item.recipientUserId));
            const roomReadyRecipients = sortedUnique(roomReady.map(item => item.recipientUserId));
            const latestStartedAt = started.map(item => Q.text(item.createdDate)).filter(Boolean).sort().pop() || "";
            const earliestRoomReadyAt = roomReady.map(item => Q.text(item.createdDate)).filter(Boolean).sort()[0] || "";
            return {
              startedRecipients,
              expectedStartedRecipients: sortedUnique([participantUserId, thirdUserId]),
              actorExcluded: !startedRecipients.includes(hostUserId),
              roomReadyRecipients,
              expectedRoomReadyRecipients: sortedUnique([hostUserId, participantUserId, thirdUserId]),
              latestStartedAt,
              earliestRoomReadyAt,
              startedBeforeEveryRoomReady: Boolean(latestStartedAt)
                && Boolean(earliestRoomReadyAt)
                && latestStartedAt < earliestRoomReadyAt
            };
          })()
        : null,
      tournamentReminderNotifications: tournamentReminderNotifications.map(item => ({
        id: Q.text(item._id),
        recipientUserId: Q.text(item.recipientUserId),
        kind: Q.text(item.kind),
        eventId: Q.text(item.sourceId || item.payload && item.payload.eventId),
        subEventId: Q.text(item.payload && item.payload.subEventId),
        title: Q.text(item.title),
        message: Q.text(item.message),
        readAtIso: Q.text(item.readAtIso),
        createdDate: Q.text(item.createdDate)
      })),
      userActivityCounters: checkpointId.startsWith("TOURNAMENT-")
        ? [hostUserId, participantUserId, thirdUserId].map(userId => {
            const current = userActivitiesSnapshot(userId);
            const baseline = (state.actionBaselineUserActivitySnapshots || [])
              .find(saved => saved.userId === userId);
            const currentActivities = current.activities.value || {};
            const baselineActivities = baseline && baseline.activities.value || {};
            const delta = path => nestedNumber(currentActivities, path) - nestedNumber(baselineActivities, path);
            return {
              user: Q.user(userId),
              current: {
                game: nestedNumber(currentActivities, "game"),
                chats: nestedNumber(currentActivities, "chats"),
                chat: currentActivities.chat || {},
                events: nestedNumber(currentActivities, "events"),
                hosting: nestedNumber(currentActivities, "hosting"),
                event: currentActivities.event || {}
              },
              actionDelta: {
                game: delta("game"),
                chats: delta("chats"),
                chatAll: delta("chat.all"),
                chatEvent: delta("chat.event"),
                events: delta("events"),
                hosting: delta("hosting"),
                eventAll: delta("event.all"),
                eventActive: delta("event.active"),
                eventHosting: delta("event.hosting"),
                eventDrafts: delta("event.drafts")
              }
            };
          })
        : checkpointId === "EVENT-PUBLISH-CHAT-001"
        ? [hostUserId, participantUserId, thirdUserId].map(userId => {
            const current = userActivitiesSnapshot(userId);
            const baseline = (state.actionBaselineUserActivitySnapshots || [])
              .find(saved => saved.userId === userId);
            const currentActivities = current.activities.value || {};
            const baselineActivities = baseline && baseline.activities.value || {};
            const delta = path => nestedNumber(currentActivities, path) - nestedNumber(baselineActivities, path);
            return {
              user: Q.user(userId),
              current: {
                chats: nestedNumber(currentActivities, "chats"),
                chat: currentActivities.chat || {},
                invitations: nestedNumber(currentActivities, "invitations"),
                events: nestedNumber(currentActivities, "events"),
                hosting: nestedNumber(currentActivities, "hosting"),
                event: currentActivities.event || {}
              },
              actionDelta: {
                chats: delta("chats"),
                chatAll: delta("chat.all"),
                chatEvent: delta("chat.event"),
                invitations: delta("invitations"),
                events: delta("events"),
                hosting: delta("hosting"),
                eventAll: delta("event.all"),
                eventActive: delta("event.active"),
                eventPending: delta("event.pending"),
                eventInvitations: delta("event.invitations"),
                eventHosting: delta("event.hosting"),
                eventDrafts: delta("event.drafts"),
                eventTrash: delta("event.trash")
              }
            };
          })
        : (checkpointId.startsWith("EVENT-TICKET-") || checkpointId === "EVENT-VISIBILITY-001")
          ? (checkpointId === "EVENT-VISIBILITY-001"
              ? [hostUserId, participantUserId, thirdUserId, visibilityFriendUserId, visibilityNonFriendUserId]
              : (hasTicketPendingControl() || checkpointId === "EVENT-TICKET-007")
                ? [hostUserId, participantUserId, thirdUserId]
              : [hostUserId, participantUserId]).map(userId => {
              const current = userActivitiesSnapshot(userId);
              const baseline = savedUserActivity(state, userId);
              const currentActivities = current.activities.value || {};
              const baselineActivities = baseline && baseline.activities.value || {};
              const delta = path => nestedNumber(currentActivities, path) - nestedNumber(baselineActivities, path);
              return {
                user: Q.user(userId),
                current: {
                  events: nestedNumber(currentActivities, "events"),
                  hosting: nestedNumber(currentActivities, "hosting"),
                  tickets: nestedNumber(currentActivities, "tickets"),
                  assetTickets: nestedNumber(currentActivities, "asset.tickets"),
                  event: currentActivities.event || {}
                },
                stageDelta: {
                  events: delta("events"),
                  hosting: delta("hosting"),
                  tickets: delta("tickets"),
                  assetTickets: delta("asset.tickets"),
                  eventAll: delta("event.all"),
                  eventActive: delta("event.active"),
                  eventPending: delta("event.pending"),
                  eventHosting: delta("event.hosting")
                }
              };
            })
          : checkpointId.startsWith("EVENT-FEEDBACK-")
          ? (checkpointId === "EVENT-FEEDBACK-002"
              ? [hostUserId, participantUserId, thirdUserId]
              : [hostUserId, participantUserId]).map(userId => {
              const current = userActivitiesSnapshot(userId);
              const currentActivities = current.activities.value || {};
              return {
                user: Q.user(userId),
                current: {
                  feedback: nestedNumber(currentActivities, "feedback"),
                  eventFeedback: {
                    ownEvents: nestedNumber(currentActivities, "eventFeedback.ownEvents"),
                    pending: nestedNumber(currentActivities, "eventFeedback.pending"),
                    feedbacked: nestedNumber(currentActivities, "eventFeedback.feedbacked"),
                    removed: nestedNumber(currentActivities, "eventFeedback.removed")
                  }
                }
              };
            })
        : (checkpointId.startsWith("EVENT-INV-") || checkpointId === "EVENT-ACTIVITY-REFRESH-001")
          ? invitationFixtureUserIds(config().stage).map(userId => {
              const current = userActivitiesSnapshot(userId);
              const baseline = savedUserActivity(state, userId);
              const currentActivities = current.activities.value || {};
              const baselineActivities = baseline && baseline.activities.value || {};
              const delta = path => nestedNumber(currentActivities, path) - nestedNumber(baselineActivities, path);
              return {
                user: Q.user(userId),
                current: {
                  chats: nestedNumber(currentActivities, "chats"),
                  chat: currentActivities.chat || {},
                  invitations: nestedNumber(currentActivities, "invitations"),
                  events: nestedNumber(currentActivities, "events"),
                  hosting: nestedNumber(currentActivities, "hosting"),
                  event: currentActivities.event || {}
                },
                stageDelta: {
                  chats: delta("chats"),
                  chatAll: delta("chat.all"),
                  chatEvent: delta("chat.event"),
                  invitations: delta("invitations"),
                  events: delta("events"),
                  hosting: delta("hosting"),
                  eventAll: delta("event.all"),
                  eventActive: delta("event.active"),
                  eventPending: delta("event.pending"),
                  eventInvitations: delta("event.invitations"),
                  eventHosting: delta("event.hosting"),
                  eventDrafts: delta("event.drafts"),
                  eventTrash: delta("event.trash")
                }
              };
            })
        : checkpointId.startsWith("EVENT-LIFE-")
          ? [hostUserId, participantUserId].map(userId => {
              const current = userActivitiesSnapshot(userId);
              const baseline = (state.lifecycleActionBaselineUserActivitySnapshots || [])
                .find(saved => saved.userId === userId);
              const currentActivities = current.activities.value || {};
              const baselineActivities = baseline && baseline.activities.value || {};
              const delta = path => nestedNumber(currentActivities, path) - nestedNumber(baselineActivities, path);
              return {
                user: Q.user(userId),
                current: {
                  events: nestedNumber(currentActivities, "events"),
                  hosting: nestedNumber(currentActivities, "hosting"),
                  event: currentActivities.event || {}
                },
                actionDelta: baseline ? {
                  events: delta("events"),
                  hosting: delta("hosting"),
                  eventAll: delta("event.all"),
                  eventActive: delta("event.active"),
                  eventPending: delta("event.pending"),
                  eventInvitations: delta("event.invitations"),
                  eventHosting: delta("event.hosting"),
                  eventDrafts: delta("event.drafts"),
                  eventTrash: delta("event.trash")
                } : null
              };
            })
        : [],
      invitationAcceptanceOutbox: invitationAcceptanceOutbox.map(item => ({
        notificationType: Q.text(item.notificationType),
        eventId: Q.text(item.entityId || item.payload && item.payload.eventId),
        recipientUserIds: sortedUnique(item.recipientUserIds || []),
        memberUserId: Q.text(item.payload && item.payload.memberUserId),
        membershipAction: Q.text(item.payload && item.payload.membershipAction),
        status: Q.text(item.status)
      })),
      invitationAcceptanceNotifications: invitationAcceptanceNotifications.map(item => ({
        recipientUserId: Q.text(item.recipientUserId),
        kind: Q.text(item.kind),
        eventId: Q.text(item.sourceId || item.payload && item.payload.eventId),
        memberUserId: Q.text(item.payload && item.payload.memberUserId),
        membershipAction: Q.text(item.payload && item.payload.membershipAction),
        title: Q.text(item.title),
        message: Q.text(item.message)
      })),
      eventInvitationNotifications: eventInvitationNotifications.map(item => ({
        recipientUserId: Q.text(item.recipientUserId),
        kind: Q.text(item.kind),
        eventId: Q.text(item.sourceId || item.payload && item.payload.eventId),
        senderUserId: Q.text(item.senderUserId || item.payload && item.payload.senderUserId),
        readAtIso: Q.text(item.readAtIso),
        read: Boolean(Q.text(item.readAtIso))
      })),
      eventInvitationOutbox: eventInvitationOutbox.map(item => ({
        id: Q.text(item._id),
        notificationType: Q.text(item.notificationType),
        eventId: Q.text(item.entityId || item.payload && item.payload.eventId),
        senderUserId: Q.text(item.payload && item.payload.senderUserId),
        recipientUserIds: sortedUnique(item.recipientUserIds || []),
        status: Q.text(item.status)
      })),
      eventJoinRequestNotifications: eventJoinRequestNotifications.map(item => ({
        recipientUserId: Q.text(item.recipientUserId),
        kind: Q.text(item.kind),
        eventId: Q.text(item.sourceId || item.payload && item.payload.eventId),
        memberUserId: Q.text(item.payload && item.payload.memberUserId),
        membershipAction: Q.text(item.payload && item.payload.membershipAction),
        badge: Q.text(item.payload && item.payload.notification_status_badge_fallback),
        readAtIso: Q.text(item.readAtIso),
        createdDate: Q.text(item.createdDate)
      })),
      eventMemberApprovalOutbox: eventMemberApprovalOutbox.map(item => ({
        id: Q.text(item._id),
        notificationType: Q.text(item.notificationType),
        eventId: Q.text(item.entityId || item.payload && item.payload.eventId),
        recipientUserIds: sortedUnique(item.recipientUserIds || []),
        memberUserId: Q.text(item.payload && item.payload.memberUserId),
        membershipAction: Q.text(item.payload && item.payload.membershipAction),
        senderUserId: Q.text(item.payload && item.payload.senderUserId),
        status: Q.text(item.status)
      })),
      eventMemberApprovalNotifications: eventMemberApprovalNotifications.map(item => ({
        id: Q.text(item._id),
        recipientUserId: Q.text(item.recipientUserId),
        kind: Q.text(item.kind),
        category: Q.text(item.category),
        eventId: Q.text(item.sourceId || item.payload && item.payload.eventId),
        memberUserId: Q.text(item.payload && item.payload.memberUserId),
        membershipAction: Q.text(item.payload && item.payload.membershipAction),
        senderUserId: Q.text(item.senderUserId || item.payload && item.payload.senderUserId),
        readAtIso: Q.text(item.readAtIso),
        title: Q.text(item.title),
        message: Q.text(item.message)
      })),
      eventLifecycleTasks: eventLifecycleTasks.map(item => ({
        id: Q.text(item._id),
        taskKey: Q.text(item.taskKey),
        eventId: Q.text(item.eventId),
        status: Q.text(item.status),
        dueAtIso: Q.text(item.dueAtIso),
        audienceUserIds: Q.text(item.payload && item.payload.audienceUserIds)
          .split(",").map(Q.text).filter(Boolean),
        changeReasons: Q.text(item.payload && item.payload.changeReasons)
          .split(",").map(Q.text).filter(Boolean),
        lastRunAtIso: Q.text(item.lastRunAtIso),
        lastRunStatus: Q.text(item.lastRunStatus),
        lastRunDetail: Q.text(item.lastRunDetail),
        lastRunCount: Number(item.lastRunCount || 0),
        updatedDate: Q.text(item.updatedDate)
      })),
      eventLifecycleOutbox: eventLifecycleOutbox.map(item => ({
        id: Q.text(item._id),
        notificationType: Q.text(item.notificationType),
        eventId: Q.text(item.entityId || item.payload && item.payload.eventId),
        recipientUserIds: sortedUnique(item.recipientUserIds || []),
        status: Q.text(item.status),
        createdDate: Q.text(item.createdDate)
      })),
      eventLifecycleNotifications: eventLifecycleNotifications.map(item => ({
        id: Q.text(item._id),
        recipientUserId: Q.text(item.recipientUserId),
        kind: Q.text(item.kind),
        eventId: Q.text(item.sourceId || item.payload && item.payload.eventId),
        readAtIso: Q.text(item.readAtIso),
        title: Q.text(item.title),
        message: Q.text(item.message),
        createdDate: Q.text(item.createdDate)
      })),
      eventRecomputeTasks: eventRecomputeTasks.map(item => ({
        id: Q.text(item._id),
        targetType: Q.text(item.targetType),
        targetId: Q.text(item.targetId),
        reasons: item.reasons || [],
        status: Q.text(item.status),
        availableAtIso: Q.text(item.availableAtIso),
        attemptCount: Number(item.attemptCount || 0),
        lastError: Q.text(item.lastError),
        completedAtIso: Q.text(item.completedAtIso),
        updatedDate: Q.text(item.updatedDate)
      })),
      workerRules: workerRules.map(item => ({
        ruleKey: Q.text(item.ruleKey),
        enabled: item.enabled === true,
        intervalSeconds: Number(item.timing && item.timing.intervalSeconds || 0),
        pendingCount: Number(item.pendingCount || 0),
        currentStatus: Q.text(item.runState && item.runState.currentStatus),
        lastRunAtIso: Q.text(item.runState && item.runState.lastRunAtIso),
        progressDetail: Q.text(item.runState && item.runState.progressDetail)
      })),
      feedbackNotificationOutbox: feedbackNotificationOutbox.map(item => ({
        notificationType: Q.text(item.notificationType),
        eventId: Q.text(item.entityId || item.payload && item.payload.eventId),
        recipientUserIds: sortedUnique(item.recipientUserIds || []),
        senderUserId: Q.text(item.payload && item.payload.senderUserId),
        status: Q.text(item.status)
      })),
      feedbackNotifications: feedbackNotifications.map(item => ({
        recipientUserId: Q.text(item.recipientUserId),
        kind: Q.text(item.kind),
        eventId: Q.text(item.sourceId || item.payload && item.payload.eventId),
        senderUserId: Q.text(item.payload && item.payload.senderUserId),
        title: Q.text(item.title),
        message: Q.text(item.message)
      })),
      feedbackRecomputeTasks: feedbackRecomputeTasks.map(item => ({
        targetType: Q.text(item.targetType),
        targetId: Q.text(item.targetId),
        reason: Q.text(item.reason),
        status: Q.text(item.status),
        updatedDate: item.updatedDate
      })),
      feedbackTargetImpressions: {
        user: Q.user(hostUserId),
        host: summarizeImpressionsSection(feedbackTarget.impressions && feedbackTarget.impressions.host),
        member: summarizeImpressionsSection(feedbackTarget.impressions && feedbackTarget.impressions.member)
      },
      feedbackHostZeroResponseBaseline: checkpointId === "EVENT-FEEDBACK-002"
        ? (() => {
            const hostActivities = feedbackTarget.activities || {};
            const hostEventFeedback = hostActivities.eventFeedback || {};
            const submittedStates = feedbackStates.filter(item => Boolean(item.submittedAtIso));
            const hostImpressions = summarizeImpressionsSection(
              feedbackTarget.impressions && feedbackTarget.impressions.host
            );
            return {
              expected: {
                mainFeedback: 0,
                ownEvents: 0,
                stagedCardCount: 1,
                submittedStateCount: 0,
                answerCount: 0,
                hostTraitEvidenceCount: 0
              },
              current: {
                mainFeedback: nestedNumber(hostActivities, "feedback"),
                ownEvents: nestedNumber(hostActivities, "eventFeedback.ownEvents"),
                stagedCardCount: Q.text(event.sourceId) === EVENT_ID ? 1 : 0,
                eventId: Q.text(event.sourceId),
                title: Q.text(event.title),
                imageUrl: Q.text(event.imageUrl),
                submittedStateCount: submittedStates.length,
                answerCount: feedbackAnswers.length,
                hostTraitEvidenceCount: hostImpressions.personalityTraits.reduce(
                  (total, trait) => total + Number(trait.evidenceCount || 0),
                  0
                )
              },
              checks: {
                mainBadgeMustBeAbsent: nestedNumber(hostActivities, "feedback") === 0,
                ownEventsBucketMustBeZero: nestedNumber(hostActivities, "eventFeedback.ownEvents") === 0,
                stagedIdentityMustMatch: Q.text(event.sourceId) === EVENT_ID
                  && Q.text(event.title) === EXPECTED_TITLE,
                persistedImageMustExist: Boolean(Q.text(event.imageUrl)),
                zeroResponsesMustRemainVisible: submittedStates.length === 0
                  && feedbackAnswers.length === 0,
                traitsMustRemainEmpty: hostImpressions.personalityTraits.length === 0
              }
            };
          })()
        : null,
      feedbackStates: feedbackStates.map(item => ({
        viewerUserId: Q.text(item.viewerUserId),
        eligible: item.eligible === true,
        counterTracked: item.counterTracked === true,
        removed: item.removed === true,
        submittedAtIso: item.submittedAtIso,
        organizerNote: Q.text(item.organizerNote),
        updatedDate: item.updatedDate
      })),
      feedbackAnswers: feedbackAnswers.map(item => ({
        viewerUserId: Q.text(item.viewerUserId),
        targetUserId: Q.text(item.targetUserId),
        kind: Q.text(item.kind),
        primaryValue: Q.text(item.primaryValue),
        secondaryValue: Q.text(item.secondaryValue),
        eventComment: Q.text(item.eventComment),
        personalityTraitIds: item.personalityTraitIds || [],
        updatedDate: item.updatedDate
      })),
      tickets: tickets.map(ticket => ({
        id: Q.text(ticket._id),
        code: Q.text(ticket.code),
        eventId: Q.text(ticket.eventId),
        holderUserId: Q.text(ticket.holderUserId),
        status: Q.text(ticket.status),
        issuedAtIso: ticket.issuedAtIso,
        usedAtIso: ticket.usedAtIso,
        usedByUserId: ticket.usedByUserId
      })),
      ticketReplayAudits: ticketReplayAudits.map(item => ({
        id: Q.text(item._id),
        action: Q.text(item.action),
        result: Q.text(item.result),
        ticketId: Q.text(item.ticketId),
        eventId: Q.text(item.eventId),
        holderUserId: Q.text(item.holderUserId),
        actorUserId: Q.text(item.actorUserId),
        attemptedAtIso: item.attemptedAtIso,
        originalUsedAtIso: item.originalUsedAtIso,
        originalUsedByUserId: Q.text(item.originalUsedByUserId)
      })),
      ticketReplayOutbox: ticketReplayOutbox.map(item => ({
        id: Q.text(item._id),
        notificationType: Q.text(item.notificationType),
        recipientUserIds: sortedUnique(item.recipientUserIds || []),
        actorUserId: Q.text(item.payload && item.payload.actorUserId),
        ticketId: Q.text(item.payload && item.payload.ticketId),
        rawCodePresent: Boolean(Q.text(item.payload && (item.payload.code || item.payload.ticketCode))),
        status: Q.text(item.status)
      })),
      ticketReplayNotifications: ticketReplayNotifications.map(item => ({
        id: Q.text(item._id),
        recipientUserId: Q.text(item.recipientUserId),
        senderUserId: Q.text(item.senderUserId),
        ticketId: Q.text(item.payload && item.payload.ticketId),
        occurrenceCount: Number(item.occurrenceCount || 1),
        notificationTone: Q.text(item.payload && item.payload.notification_tone),
        aggregationKey: Q.text(item.aggregationKey),
        readAtIso: Q.text(item.readAtIso),
        rawCodePresent: Boolean(Q.text(item.payload && (item.payload.code || item.payload.ticketCode)))
      })),
      stageRuntime: stageRuntime.map(item => ({
        ownerId: Q.text(item.ownerId),
        subEventId: Q.text(item.subEventId),
        stageStatus: Q.text(item.stageStatus),
        stageStatusReason: Q.text(item.stageStatusReason),
        stageFinalizedAt: item.stageFinalizedAt,
        groupsCount: item.groupsCount
      })),
      manualTournamentGroups: groups.map(item => ({
        ownerId: Q.text(item.ownerId),
        groupId: Q.text(item.groupId),
        name: Q.text(item.name),
        status: Q.text(item.status),
        capacityMin: item.capacityMin,
        capacityMax: item.capacityMax
      })),
      leaderboard: leaderboard.map(item => ({
        eventId: Q.text(item.eventId),
        subEventId: Q.text(item.subEventId),
        groupId: Q.text(item.groupId),
        memberId: Q.text(item.memberId),
        scoreValue: item.scoreValue,
        updatedDate: item.updatedDate
      })),
      afterStageOutboxCount: outboxCount,
      afterStageRecomputeTaskCount: taskCount,
      autoInviterRule: checkpointId === "EVENT-EDITOR-003" ? autoInviterRuleSummary() : null,
      autoInviterEligibility: checkpointId === "EVENT-EDITOR-003"
        ? autoInviterEligibilitySummary(state)
        : null,
      autoInviterPeriodic: checkpointId === "EVENT-EDITOR-003"
        ? autoInviterPeriodicSummary(state)
        : null,
      ticketExpiryArm: checkpointId === "EVENT-TICKET-006"
        ? (state.ticketExpiryArm || null)
        : null,
      visibilityControls: checkpointId === "EVENT-VISIBILITY-001"
        ? [visibilityFriendUserId, visibilityNonFriendUserId].map(userId => ({
            user: Q.user(userId),
            expectedFriendOfCasey: isFriendPair(hostUserId, userId),
            trackedParticipation: members.some(member => Q.text(member.userId) === userId
              && Q.text(member.status).toUpperCase() !== "D")
          }))
        : null
    };
  }

  function ticketAttendanceSnapshot() {
    const canonicalEvent = Q.collection("events").findOne({
      sourceId: EVENT_ID,
      ownerUserId: hostUserId
    }) || {};
    const members = Q.collection("activityMembers").find({
      ownerType: "event",
      ownerId: EVENT_ID
    }).sort({ userId: 1, _id: 1 }).toArray();
    const tickets = Q.collection("eventTickets").find({ eventId: EVENT_ID })
      .sort({ issuedAtIso: 1, _id: 1 }).toArray();
    const replayAudits = Q.collection("eventTicketAudit").find({
      eventId: EVENT_ID,
      action: "check-in-replay",
      result: "already_used"
    }).sort({ createdDate: 1, _id: 1 }).toArray();
    const memberSummary = member => member ? {
      id: Q.text(member._id),
      status: Q.text(member.status),
      role: Q.text(member.role),
      actionAtIso: Q.text(member.actionAtIso),
      attendanceStatus: Q.text(member.attendanceStatus),
      checkedInAtIso: Q.text(member.checkedInAtIso),
      checkedInByUserId: Q.text(member.checkedInByUserId),
      checkedInTicketId: Q.text(member.checkedInTicketId),
      updatedDate: Q.text(member.updatedDate)
    } : null;
    const ticketSummary = ticket => ticket ? {
      id: Q.text(ticket._id),
      status: Q.text(ticket.status),
      issuedAtIso: Q.text(ticket.issuedAtIso),
      usedAtIso: Q.text(ticket.usedAtIso),
      usedByUserId: Q.text(ticket.usedByUserId)
    } : null;
    const counterSummary = userId => {
      const saved = userActivitiesSnapshot(userId);
      const activities = saved.activities.value || {};
      return {
        events: nestedNumber(activities, "events"),
        hosting: nestedNumber(activities, "hosting"),
        tickets: nestedNumber(activities, "tickets"),
        assetTickets: nestedNumber(activities, "asset.tickets"),
        eventAll: nestedNumber(activities, "event.all"),
        eventActive: nestedNumber(activities, "event.active"),
        eventHosting: nestedNumber(activities, "event.hosting")
      };
    };
    const profileStatus = userId => {
      const user = Q.collection("users").findOne({ $or: [{ _id: userId }, { userId }] }) || {};
      return Q.text(user.status);
    };
    return {
      event: {
        id: Q.text(canonicalEvent._id),
        status: Q.text(canonicalEvent.status),
        acceptedMembers: Number(canonicalEvent.acceptedMembers || 0),
        pendingMembers: Number(canonicalEvent.pendingMembers || 0),
        capacityTotal: Number(canonicalEvent.capacityTotal || 0)
      },
      memberCount: members.length,
      hostMember: memberSummary(members.find(member => Q.text(member.userId) === hostUserId)),
      participantMember: memberSummary(
        members.find(member => Q.text(member.userId) === participantUserId)
      ),
      ticketCount: tickets.length,
      ticket: ticketSummary(tickets[0]),
      hostCounters: counterSummary(hostUserId),
      participantCounters: counterSummary(participantUserId),
      hostProfileStatus: profileStatus(hostUserId),
      participantProfileStatus: profileStatus(participantUserId),
      replayAudits: replayAudits.map(item => ({
        id: Q.text(item._id),
        ticketId: Q.text(item.ticketId),
        holderUserId: Q.text(item.holderUserId),
        actorUserId: Q.text(item.actorUserId),
        originalUsedAtIso: Q.text(item.originalUsedAtIso),
        originalUsedByUserId: Q.text(item.originalUsedByUserId)
      }))
    };
  }

  function sameJson(left, right) {
    return JSON.stringify(left) === JSON.stringify(right);
  }

  function jsonDifferences(left, right) {
    const before = JSON.parse(JSON.stringify(left));
    const after = JSON.parse(JSON.stringify(right));
    const differences = [];
    const visit = (beforeValue, afterValue, path) => {
      if (sameJson(beforeValue, afterValue)) return;
      if (Array.isArray(beforeValue) && Array.isArray(afterValue)) {
        if (beforeValue.length !== afterValue.length) {
          differences.push({
            path: `${path}.length`,
            before: beforeValue.length,
            after: afterValue.length
          });
        }
        const length = Math.max(beforeValue.length, afterValue.length);
        for (let index = 0; index < length; index += 1) {
          visit(beforeValue[index], afterValue[index], `${path}[${index}]`);
        }
        return;
      }
      if (beforeValue && afterValue
          && typeof beforeValue === "object" && typeof afterValue === "object") {
        const keys = [...new Set([...Object.keys(beforeValue), ...Object.keys(afterValue)])].sort();
        keys.forEach(key => visit(
          beforeValue[key], afterValue[key], path ? `${path}.${key}` : key));
        return;
      }
      differences.push({ path, before: beforeValue, after: afterValue });
    };
    visit(before, after, "");
    return differences;
  }

  function tournamentReviewRule() {
    return Q.collection("notificationRuleConfigs").findOne({ ruleKey: TOURNAMENT_REVIEW_RULE });
  }

  function tournamentReviewStableSnapshot() {
    const event = Q.collection("events").findOne(manualEventSelector()) || {};
    const qualifierId = `${EVENT_ID}:stage:qualifiers`;
    const finalId = `${EVENT_ID}:stage:final`;
    const rooms = Q.collection("events")
      .find(generatedRandomRoomSelector())
      .sort({ sourceId: 1, _id: 1 })
      .toArray()
      .filter(item => generatedTournamentGroupIdentity(item, event).stageId === finalId);
    const roomIds = rooms.map(item => Q.text(item.sourceId || item._id)).filter(Boolean);
    const finalGroupMembers = Q.collection("activityMembers")
      .find({
        ownerType: "group",
        ownerId: { $regex: `^${finalId}:group:` }
      })
      .sort({ ownerId: 1, userId: 1, _id: 1 })
      .toArray();
    const finalGroupOwnerIds = sortedUnique(finalGroupMembers.map(member => member.ownerId));
    const counters = [hostUserId, participantUserId, thirdUserId].map(userId => {
      const saved = userActivitiesSnapshot(userId);
      const activities = saved.activities && saved.activities.present
        ? saved.activities.value || {}
        : {};
      return {
        userId,
        events: activities.events || 0,
        hosting: activities.hosting || 0,
        chats: activities.chats || 0,
        event: activities.event || {},
        chat: activities.chat || {}
      };
    });
    return {
      stages: (event.subEvents || []).map(stage => ({
        id: Q.text(stage.id),
        stageStatus: Q.text(stage.stageStatus),
        stageStatusReason: Q.text(stage.stageStatusReason),
        stageFinalizedAt: Q.text(stage.stageFinalizedAt),
        stageFinalizedByUserId: Q.text(stage.stageFinalizedByUserId),
        groupsCount: Number(stage.groupsCount || 0)
      })),
      finalRooms: rooms.map(room => {
        const identity = generatedTournamentGroupIdentity(room, event);
        return {
          eventId: identity.roomEventId,
          parentEventId: identity.parentEventId,
          parentSubEventId: identity.stageId,
          groupId: identity.groupId,
          title: Q.text(room.title),
          status: Q.text(room.status),
          acceptedMemberUserIds: sortedUnique(room.acceptedMemberUserIds || []),
          acceptedMembers: Number(room.acceptedMembers || 0)
        };
      }),
      finalGroups: finalGroupOwnerIds.map(ownerId => ({
        ownerId,
        acceptedMemberUserIds: sortedUnique(finalGroupMembers
          .filter(member => Q.text(member.ownerId) === ownerId
            && Q.text(member.status).toLowerCase() === "accepted")
          .map(member => member.userId))
      })),
      finalGroupMembers: finalGroupMembers.map(member => ({
          ownerId: Q.text(member.ownerId),
          userId: Q.text(member.userId),
          role: Q.text(member.role),
          status: Q.text(member.status)
        })),
      stageRuntime: Q.collection("activitySubEventStageRuntime")
        .find({ ownerId: EVENT_ID })
        .sort({ subEventId: 1, _id: 1 })
        .toArray()
        .map(runtime => ({
          subEventId: Q.text(runtime.subEventId),
          stageStatus: Q.text(runtime.stageStatus),
          stageStatusReason: Q.text(runtime.stageStatusReason),
          stageFinalizedAt: Q.text(runtime.stageFinalizedAt),
          stageFinalizedByUserId: Q.text(runtime.stageFinalizedByUserId),
          groupsCount: Number(runtime.groupsCount || 0)
        })),
      leaderboard: Q.collection("eventLeaderboardEntries")
        .find({ eventId: EVENT_ID })
        .sort({ subEventId: 1, groupId: 1, memberId: 1, _id: 1 })
        .toArray()
        .map(entry => ({
          subEventId: Q.text(entry.subEventId),
          groupId: Q.text(entry.groupId),
          memberId: Q.text(entry.memberId),
          scoreValue: Number(entry.scoreValue || 0)
        })),
      chats: Q.collection("chats")
        .find({ $or: [{ eventId: { $in: roomIds } }, { ownerId: { $in: roomIds } }] })
        .sort({ eventId: 1, ownerUserId: 1, _id: 1 })
        .toArray()
        .map(chat => ({
          chatId: Q.text(chat.chatId || chat.id || chat._id),
          eventId: Q.text(chat.eventId),
          ownerUserId: Q.text(chat.ownerUserId),
          memberUserIds: sortedUnique(chat.memberUserIds || chat.memberIds || []),
          title: Q.text(chat.title),
          unread: Number(chat.unread || 0)
        })),
      planMarkers: Q.collection("schedulerPlanMarkers")
        .find({
          wrapperType: "score",
          actionType: "group-members",
          ownerId: { $regex: `^${finalId}:group:` }
        })
        .sort({ actionType: 1, scopeId: 1, _id: 1 })
        .toArray()
        .map(marker => ({
          actionType: Q.text(marker.actionType),
          ownerId: Q.text(marker.ownerId),
          scopeId: Q.text(marker.scopeId),
          fingerprint: Q.text(marker.fingerprint),
          userIds: sortedUnique(marker.userIds || [])
        })),
      outboxIntents: Q.collection("notificationOutbox")
        .find({ $or: [
          { entityId: { $in: [EVENT_ID, ...roomIds] } },
          { "payload.eventId": { $in: [EVENT_ID, ...roomIds] } }
        ] })
        .sort({ notificationType: 1, entityId: 1, _id: 1 })
        .toArray()
        .map(item => ({
          id: Q.text(item._id),
          notificationType: Q.text(item.notificationType),
          entityId: Q.text(item.entityId),
          recipientUserIds: sortedUnique(item.recipientUserIds || []),
          title: Q.text(item.title),
          body: Q.text(item.body)
        })),
      counters
    };
  }

  function armTournamentReview() {
    if (checkpointId !== "TOURNAMENT-003") {
      Q.fail("arm-tournament-review is restricted to TOURNAMENT-003.");
    }
    const state = requireMatchingState();
    const event = Q.collection("events").findOne(manualEventSelector());
    const stages = event && Array.isArray(event.subEvents) ? event.subEvents : [];
    const qualifier = stages.find(stage => Q.text(stage.id) === `${EVENT_ID}:stage:qualifiers`);
    if (!qualifier || Q.text(qualifier.stageStatus).toUpperCase() !== "F") {
      Q.fail("Qualifiers is not finalized; run the visible Finalize Stage action once before arming tournament review.");
    }
    const armCount = Number(state.tournamentReviewArmCount || 0);
    if (armCount >= 2) {
      Q.fail("TOURNAMENT-003 tournament review has already been armed twice; run the no-op verifier.");
    }
    const rule = tournamentReviewRule();
    if (!rule) {
      Q.fail(`notification rule '${TOURNAMENT_REVIEW_RULE}' is missing.`);
    }
    const stateUpdate = {
      tournamentReviewArmCount: armCount + 1,
      tournamentReviewArmedAtIso: Q.nowIso()
    };
    if (armCount === 1) {
      const firstPass = tournamentReviewStableSnapshot();
      const expectedWinners = [hostUserId, thirdUserId].sort();
      const actualWinners = sortedUnique(firstPass.finalGroupMembers
        .filter(member => Q.text(member.status).toLowerCase() === "accepted")
        .map(member => member.userId));
      const runState = rule.runState || {};
      if (firstPass.finalGroups.length !== 1
          || !sameJson(actualWinners, expectedWinners)
          || firstPass.planMarkers.length !== 1
          || Q.text(runState.currentStatus) !== "completed"
          || Number(runState.lastRunCount) !== 1) {
        Q.fail("the first real tournament-review run is not at the exact one-group Casey+Riley advancement boundary.");
      }
      const notifications = tournamentFinalizeNotificationSnapshot();
      const finalizedRecipients = [participantUserId, thirdUserId].sort();
      if (notifications.outbox.length !== 1
          || !sameJson(notifications.outbox[0].recipientUserIds, finalizedRecipients)
          || notifications.outbox[0].notificationAvatarTone !== ""
          || notifications.outbox[0].notificationAvatarIcon !== ""
          || notifications.advancementOutbox.length !== 1
          || !sameJson(notifications.advancementOutbox[0].recipientUserIds, expectedWinners)
          || notifications.advancementOutbox[0].notificationTitleKey !== "notification.event.stage.advanced.title"
          || notifications.advancementOutbox[0].notificationMessageKey !== "notification.event.stage.advanced.message"
          || notifications.advancementOutbox[0].stageTitle !== "Qualifiers"
          || notifications.advancementOutbox[0].nextStageTitle !== "Final"
          || notifications.advancementOutbox[0].stageIndex !== "2"
          || notifications.notAdvancingOutbox.length !== 1
          || !sameJson(notifications.notAdvancingOutbox[0].recipientUserIds, [participantUserId])
          || notifications.notAdvancingOutbox[0].notificationTitleKey !== "notification.event.stage.not-advanced.title"
          || notifications.notAdvancingOutbox[0].notificationMessageKey !== "notification.event.stage.not-advanced.message"
          || notifications.notAdvancingOutbox[0].stageTitle !== "Qualifiers"
          || notifications.notAdvancingOutbox[0].nextStageTitle !== "Final"
          || notifications.notAdvancingOutbox[0].stageIndex !== "1"
          || notifications.outbox[0].createdDate >= notifications.advancementOutbox[0].createdDate
          || notifications.outbox[0].createdDate >= notifications.notAdvancingOutbox[0].createdDate) {
        Q.fail("the first real tournament-review run did not preserve Casey's manual notification before the two separate automatic outcome notifications.");
      }
      stateUpdate.tournamentReviewNoopBaseline = firstPass;
      stateUpdate.tournamentReviewNotificationNoopBaseline = notifications;
      stateUpdate.tournamentReviewHistoryLength = Array.isArray(rule.runHistory) ? rule.runHistory.length : 0;
    }
    const armedAtIso = dateIso(-31);
    const nowIso = Q.nowIso();
    const updated = Q.collection("notificationRuleConfigs").updateOne(
      { ruleKey: TOURNAMENT_REVIEW_RULE },
      {
        $set: {
          enabled: true,
          "runState.currentStatus": "idle",
          "runState.lastRunAtIso": armedAtIso,
          "runState.progressPercent": 0,
          "runState.progressDetail": armCount === 0
            ? "Armed by TOURNAMENT-003 after manual Finalize."
            : "Armed by TOURNAMENT-003 for the unchanged no-op replay.",
          updatedDate: nowIso,
          updatedUser: Q.ACTOR
        },
        $unset: {
          "runState.startedAtIso": "",
          "runState.finishedAtIso": ""
        }
      }
    );
    if (updated.matchedCount !== 1) {
      Q.fail(`notification rule '${TOURNAMENT_REVIEW_RULE}' disappeared while it was armed.`);
    }
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: state._id },
      { $set: stateUpdate }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: armCount === 0 ? "tournament-review-armed" : "tournament-review-noop-armed",
      armNumber: armCount + 1,
      armedLastRunAtIso: armedAtIso,
      next: armCount === 0
        ? "Wait for the real event-tournament-review scheduler, then run status."
        : "Wait for the second real scheduler pass, then run verify-tournament-review-noop."
    });
  }

  function verifyTournamentReviewNoop() {
    if (checkpointId !== "TOURNAMENT-003") {
      Q.fail("verify-tournament-review-noop is restricted to TOURNAMENT-003.");
    }
    const state = requireMatchingState();
    if (Number(state.tournamentReviewArmCount || 0) !== 2 || !state.tournamentReviewNoopBaseline) {
      Q.fail("the second tournament-review pass has not been armed from a verified first-pass boundary.");
    }
    const rule = tournamentReviewRule();
    const runState = rule && rule.runState ? rule.runState : {};
    const historyLength = rule && Array.isArray(rule.runHistory) ? rule.runHistory.length : 0;
    if (Q.text(runState.currentStatus) !== "completed"
        || Number(runState.lastRunCount) !== 0
        || historyLength !== Number(state.tournamentReviewHistoryLength || 0) + 1) {
      Q.fail("the second real tournament-review run has not completed exactly once with affected count 0.");
    }
    const current = tournamentReviewStableSnapshot();
    const notifications = tournamentFinalizeNotificationSnapshot();
    if (!sameJson(current, state.tournamentReviewNoopBaseline)) {
      Q.fail(`the unchanged second tournament-review run changed domain state: ${JSON.stringify(jsonDifferences(state.tournamentReviewNoopBaseline, current))}`);
    }
    if (!sameJson(notifications, state.tournamentReviewNotificationNoopBaseline)) {
      Q.fail("the unchanged second tournament-review run duplicated or changed tournament notifications.");
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "tournament-review-noop-verified",
      affectedCount: Number(runState.lastRunCount),
      domain: current,
      next: "Complete the remaining UI comparison and record TOURNAMENT-003 PASS/CLOSED."
    });
  }

  function tournamentFinalizeNotificationSnapshot() {
    const eventSelector = {
      $or: [
        { entityId: EVENT_ID },
        { "payload.eventId": EVENT_ID }
      ]
    };
    return {
      outbox: Q.collection("notificationOutbox")
        .find({ notificationType: "event-stage-finalized", ...eventSelector })
        .sort({ createdDate: 1, _id: 1 })
        .toArray()
        .map(item => ({
          id: Q.text(item._id),
          recipientUserIds: sortedUnique(item.recipientUserIds || []),
          title: Q.text(item.title),
          body: Q.text(item.body),
          createdDate: Q.text(item.createdDate),
          notificationTitleKey: Q.text(item.payload && item.payload.notification_title_key),
          notificationMessageKey: Q.text(item.payload && item.payload.notification_message_key),
          notificationTone: Q.text(item.payload && item.payload.notification_tone),
          notificationAvatarTone: Q.text(item.payload && item.payload.notification_avatar_tone),
          notificationAvatarIcon: Q.text(item.payload && item.payload.notification_avatar_icon),
          stageIndex: Q.text(item.payload && item.payload.stageIndex),
          stageTotal: Q.text(item.payload && item.payload.stageTotal),
          stageTitle: Q.text(item.payload && item.payload.stageTitle),
          nextStageTitle: Q.text(item.payload && item.payload.nextStageTitle)
        })),
      notifications: Q.collection("userNotifications")
        .find({
          kind: "event-stage-finalized",
          $or: [
            { sourceId: EVENT_ID },
            { "payload.eventId": EVENT_ID }
          ]
        })
        .sort({ recipientUserId: 1, createdDate: 1, _id: 1 })
        .toArray()
        .map(item => ({
          id: Q.text(item._id),
          recipientUserId: Q.text(item.recipientUserId),
          title: Q.text(item.title),
          message: Q.text(item.message),
          readAtIso: Q.text(item.readAtIso),
          createdDate: Q.text(item.createdDate),
          notificationTitleKey: Q.text(item.payload && item.payload.notification_title_key),
          notificationMessageKey: Q.text(item.payload && item.payload.notification_message_key),
          notificationTone: Q.text(item.payload && item.payload.notification_tone),
          notificationAvatarTone: Q.text(item.payload && item.payload.notification_avatar_tone),
          notificationAvatarIcon: Q.text(item.payload && item.payload.notification_avatar_icon),
          stageIndex: Q.text(item.payload && item.payload.stageIndex),
          stageTotal: Q.text(item.payload && item.payload.stageTotal),
          stageTitle: Q.text(item.payload && item.payload.stageTitle),
          nextStageTitle: Q.text(item.payload && item.payload.nextStageTitle)
        })),
      advancementOutbox: Q.collection("notificationOutbox")
        .find({ notificationType: "event-stage-advanced", ...eventSelector })
        .sort({ createdDate: 1, _id: 1 })
        .toArray()
        .map(item => ({
          id: Q.text(item._id),
          recipientUserIds: sortedUnique(item.recipientUserIds || []),
          title: Q.text(item.title),
          body: Q.text(item.body),
          createdDate: Q.text(item.createdDate),
          notificationTitleKey: Q.text(item.payload && item.payload.notification_title_key),
          notificationMessageKey: Q.text(item.payload && item.payload.notification_message_key),
          notificationTone: Q.text(item.payload && item.payload.notification_tone),
          notificationAvatarTone: Q.text(item.payload && item.payload.notification_avatar_tone),
          notificationAvatarIcon: Q.text(item.payload && item.payload.notification_avatar_icon),
          stageIndex: Q.text(item.payload && item.payload.stageIndex),
          stageTotal: Q.text(item.payload && item.payload.stageTotal),
          stageTitle: Q.text(item.payload && item.payload.stageTitle),
          nextStageTitle: Q.text(item.payload && item.payload.nextStageTitle)
        })),
      advancementNotifications: Q.collection("userNotifications")
        .find({
          kind: "event-stage-advanced",
          $or: [
            { sourceId: EVENT_ID },
            { "payload.eventId": EVENT_ID }
          ]
        })
        .sort({ recipientUserId: 1, createdDate: 1, _id: 1 })
        .toArray()
        .map(item => ({
          id: Q.text(item._id),
          recipientUserId: Q.text(item.recipientUserId),
          title: Q.text(item.title),
          message: Q.text(item.message),
          readAtIso: Q.text(item.readAtIso),
          createdDate: Q.text(item.createdDate),
          notificationTitleKey: Q.text(item.payload && item.payload.notification_title_key),
          notificationMessageKey: Q.text(item.payload && item.payload.notification_message_key),
          notificationTone: Q.text(item.payload && item.payload.notification_tone),
          notificationAvatarTone: Q.text(item.payload && item.payload.notification_avatar_tone),
          notificationAvatarIcon: Q.text(item.payload && item.payload.notification_avatar_icon),
          stageIndex: Q.text(item.payload && item.payload.stageIndex),
          stageTotal: Q.text(item.payload && item.payload.stageTotal),
          stageTitle: Q.text(item.payload && item.payload.stageTitle),
          nextStageTitle: Q.text(item.payload && item.payload.nextStageTitle)
        })),
      notAdvancingOutbox: Q.collection("notificationOutbox")
        .find({ notificationType: "event-stage-not-advanced", ...eventSelector })
        .sort({ createdDate: 1, _id: 1 })
        .toArray()
        .map(item => ({
          id: Q.text(item._id),
          recipientUserIds: sortedUnique(item.recipientUserIds || []),
          title: Q.text(item.title),
          body: Q.text(item.body),
          createdDate: Q.text(item.createdDate),
          notificationTitleKey: Q.text(item.payload && item.payload.notification_title_key),
          notificationMessageKey: Q.text(item.payload && item.payload.notification_message_key),
          notificationTone: Q.text(item.payload && item.payload.notification_tone),
          notificationAvatarTone: Q.text(item.payload && item.payload.notification_avatar_tone),
          notificationAvatarIcon: Q.text(item.payload && item.payload.notification_avatar_icon),
          stageIndex: Q.text(item.payload && item.payload.stageIndex),
          stageTotal: Q.text(item.payload && item.payload.stageTotal),
          stageTitle: Q.text(item.payload && item.payload.stageTitle),
          nextStageTitle: Q.text(item.payload && item.payload.nextStageTitle)
        })),
      notAdvancingNotifications: Q.collection("userNotifications")
        .find({
          kind: "event-stage-not-advanced",
          $or: [
            { sourceId: EVENT_ID },
            { "payload.eventId": EVENT_ID }
          ]
        })
        .sort({ recipientUserId: 1, createdDate: 1, _id: 1 })
        .toArray()
        .map(item => ({
          id: Q.text(item._id),
          recipientUserId: Q.text(item.recipientUserId),
          title: Q.text(item.title),
          message: Q.text(item.message),
          readAtIso: Q.text(item.readAtIso),
          createdDate: Q.text(item.createdDate),
          notificationTitleKey: Q.text(item.payload && item.payload.notification_title_key),
          notificationMessageKey: Q.text(item.payload && item.payload.notification_message_key),
          notificationTone: Q.text(item.payload && item.payload.notification_tone),
          notificationAvatarTone: Q.text(item.payload && item.payload.notification_avatar_tone),
          notificationAvatarIcon: Q.text(item.payload && item.payload.notification_avatar_icon),
          stageIndex: Q.text(item.payload && item.payload.stageIndex),
          stageTotal: Q.text(item.payload && item.payload.stageTotal),
          stageTitle: Q.text(item.payload && item.payload.stageTitle),
          nextStageTitle: Q.text(item.payload && item.payload.nextStageTitle)
        }))
    };
  }

  function tournamentFinalLifecycleNotificationSnapshot() {
    const lifecycleTypes = [
      "event-tournament-started",
      "event-tournament-finalized",
      "event-tournament-won",
      "event-tournament-not-won"
    ];
    const eventSelector = {
      $or: [
        { entityId: EVENT_ID },
        { "payload.eventId": EVENT_ID }
      ]
    };
    const summarize = item => ({
      id: Q.text(item._id),
      type: Q.text(item.notificationType || item.kind),
      recipientUserIds: sortedUnique(item.recipientUserIds || []),
      recipientUserId: Q.text(item.recipientUserId),
      title: Q.text(item.title),
      body: Q.text(item.body || item.message),
      actorUserId: Q.text(item.actorUserId || item.createdUser || item.updatedUser),
      senderUserId: Q.text(item.senderUserId),
      readAtIso: Q.text(item.readAtIso),
      createdDate: Q.text(item.createdDate),
      notificationTitleKey: Q.text(item.payload && item.payload.notification_title_key),
      notificationMessageKey: Q.text(item.payload && item.payload.notification_message_key),
      notificationTone: Q.text(item.payload && item.payload.notification_tone),
      notificationAvatarTone: Q.text(item.payload && item.payload.notification_avatar_tone),
      notificationAvatarIcon: Q.text(item.payload && item.payload.notification_avatar_icon),
      stageIndex: Q.text(item.payload && item.payload.stageIndex),
      stageTotal: Q.text(item.payload && item.payload.stageTotal),
      stageTitle: Q.text(item.payload && item.payload.stageTitle),
      tournamentComplete: Q.text(item.payload && item.payload.tournamentComplete),
      winnerNames: Q.text(item.payload && item.payload.winnerNames)
    });
    return {
      outbox: Q.collection("notificationOutbox")
        .find({
          $and: [
            eventSelector,
            { $or: [
              { notificationType: { $in: lifecycleTypes } },
              { notificationType: "event-stage-finalized", "payload.stageTitle": "Final" }
            ] }
          ]
        })
        .sort({ createdDate: 1, _id: 1 })
        .toArray()
        .map(summarize),
      notifications: Q.collection("userNotifications")
        .find({
          $and: [
            {
              $or: [
                { sourceId: EVENT_ID },
                { "payload.eventId": EVENT_ID }
              ]
            },
            { $or: [
              { kind: { $in: lifecycleTypes } },
              { kind: "event-stage-finalized", "payload.stageTitle": "Final" }
            ] }
          ]
        })
        .sort({ recipientUserId: 1, createdDate: 1, _id: 1 })
        .toArray()
        .map(summarize)
    };
  }

  function tournamentFinalRoomReadyNotificationSnapshot() {
    const summarize = item => ({
      id: Q.text(item._id),
      outboxId: Q.text(item.outboxId),
      recipientUserIds: sortedUnique(item.recipientUserIds || []),
      recipientUserId: Q.text(item.recipientUserId),
      eventId: Q.text(item.entityId || item.sourceId || item.payload && item.payload.eventId),
      title: Q.text(item.title),
      body: Q.text(item.body || item.message),
      createdDate: Q.text(item.createdDate),
      senderName: Q.text(item.payload && item.payload.senderName),
      eventScope: Q.text(item.payload && item.payload.eventScope),
      eventTitle: Q.text(item.payload && item.payload.eventTitle),
      parentEventTitle: Q.text(item.payload && item.payload.parentEventTitle)
    });
    return {
      outbox: Q.collection("notificationOutbox")
        .find({
          notificationType: "event-random-groups",
          "payload.parentEventId": EVENT_ID,
          "payload.eventScope": "tournament-room"
        })
        .sort({ createdDate: 1, _id: 1 })
        .toArray()
        .map(summarize),
      notifications: Q.collection("userNotifications")
        .find({
          kind: "event-random-groups",
          "payload.parentEventId": EVENT_ID,
          "payload.eventScope": "tournament-room"
        })
        .sort({ createdDate: 1, recipientUserId: 1, _id: 1 })
        .toArray()
        .map(summarize)
    };
  }

  function prepareTournamentFinalCarryForward() {
    config();
    if (checkpointId !== "TOURNAMENT-004") {
      Q.fail("prepare-tournament-final-carry-forward is restricted to TOURNAMENT-004.");
    }
    const state = Q.activeState(SCENARIO, true);
    const stagedCheckpointId = Q.text(state.checkpointId).toUpperCase();
    if (stagedCheckpointId === "TOURNAMENT-004") {
      if (!state.tournamentFinalLifecycle || !state.tournamentFinalLifecycle.preparedAtIso) {
        Q.fail("TOURNAMENT-004 is active without its guarded carry-forward baseline.");
      }
      Q.printObject({
        scenario: SCENARIO,
        checkpointId,
        phase: "tournament-final-carry-forward-already-prepared",
        preparedAtIso: state.tournamentFinalLifecycle.preparedAtIso,
        next: "Do not prepare again. Casey may perform the one visible Final Start transaction."
      });
      return;
    }
    if (stagedCheckpointId !== "TOURNAMENT-003") {
      Q.fail(`staged checkpoint is '${state.checkpointId}', not the required closed TOURNAMENT-003 source.`);
    }
    const replay = state.tournamentNotificationSequenceRetest;
    const sourceDomainBaseline = replay && replay.noOpDomainBaseline
      ? replay.noOpDomainBaseline
      : state.tournamentReviewNoopBaseline;
    const sourceNotificationBaseline = replay && replay.verifiedNotificationSequence
      ? replay.verifiedNotificationSequence
      : state.tournamentReviewNotificationNoopBaseline;
    const sourceNoOpVerified = Boolean(replay && replay.noOpVerifiedAtIso)
      || (Number(state.tournamentReviewArmCount || 0) === 2
        && Boolean(state.tournamentReviewNoopBaseline)
        && Boolean(state.tournamentReviewNotificationNoopBaseline));
    if (!sourceNoOpVerified || !sourceDomainBaseline || !sourceNotificationBaseline) {
      Q.fail("TOURNAMENT-003 has not reached its verified ordered-notification count-0 boundary.");
    }
    const domain = tournamentReviewStableSnapshot();
    const priorNotifications = tournamentFinalizeNotificationSnapshot();
    if (!sameJson(domain, sourceDomainBaseline)) {
      Q.fail(`the retained TOURNAMENT-003 domain changed after closure: ${JSON.stringify(jsonDifferences(sourceDomainBaseline, domain))}`);
    }
    if (!sameJson(priorNotifications, sourceNotificationBaseline)) {
      Q.fail("the retained TOURNAMENT-003 manual/automatic notification boundary changed after closure.");
    }

    const qualifierId = `${EVENT_ID}:stage:qualifiers`;
    const finalId = `${EVENT_ID}:stage:final`;
    const qualifier = domain.stages.find(stage => stage.id === qualifierId);
    const finalStage = domain.stages.find(stage => stage.id === finalId);
    const qualifierRuntime = domain.stageRuntime.find(stage => stage.subEventId === qualifierId);
    const finalRuntime = domain.stageRuntime.find(stage => stage.subEventId === finalId);
    const expectedFinalUsers = [hostUserId, thirdUserId].sort();
    const actualFinalUsers = sortedUnique(domain.finalGroupMembers
      .filter(member => Q.text(member.status).toLowerCase() === "accepted")
      .map(member => member.userId));
    const reviewRule = tournamentReviewRule();
    const reviewState = reviewRule && reviewRule.runState ? reviewRule.runState : {};
    if (!qualifier || Q.text(qualifier.stageStatus).toUpperCase() !== "F"
        || qualifier.stageStatusReason !== "stage-finalized"
        || qualifier.stageFinalizedByUserId !== hostUserId
        || !qualifierRuntime || Q.text(qualifierRuntime.stageStatus).toUpperCase() !== "F"
        || !finalStage || Q.text(finalStage.stageStatus).toUpperCase() !== "RS"
        || finalStage.stageStatusReason !== "awaiting-prior-stage"
        || (finalRuntime && Q.text(finalRuntime.stageStatus).toUpperCase() !== "RS")
        || domain.finalGroups.length !== 1
        || !sameJson(actualFinalUsers, expectedFinalUsers)
        || actualFinalUsers.includes(participantUserId)
        || domain.finalRooms.length !== 0
        || domain.chats.length !== 0
        || domain.planMarkers.length !== 1
        || Q.text(reviewState.currentStatus) !== "completed"
        || Number(reviewState.lastRunCount) !== 0) {
      Q.fail("the retained tournament is not at the exact Qualifiers-F / Final-RS / Casey+Riley carry-forward boundary.");
    }
    if (priorNotifications.outbox.length !== 1
        || !sameJson(priorNotifications.outbox[0].recipientUserIds, [participantUserId, thirdUserId].sort())
        || priorNotifications.advancementOutbox.length !== 1
        || !sameJson(priorNotifications.advancementOutbox[0].recipientUserIds, expectedFinalUsers)
        || priorNotifications.notAdvancingOutbox.length !== 1
        || !sameJson(priorNotifications.notAdvancingOutbox[0].recipientUserIds, [participantUserId])) {
      Q.fail("the closed TOURNAMENT-003 recipient split is no longer exact.");
    }
    const lifecycleNotifications = tournamentFinalLifecycleNotificationSnapshot();
    if (lifecycleNotifications.outbox.length !== 0 || lifecycleNotifications.notifications.length !== 0) {
      Q.fail("Final Start or terminal tournament Finalize was written before TOURNAMENT-004 began.");
    }
    const expectedTranslations = {
      "en:notification.event.stage.started.title": "{stageTitle} started",
      "en:notification.event.stage.started.message": "{stageTitle} has started. Groups are ready.",
      "hu:notification.event.stage.started.title": "Elindult: {stageTitle}",
      "hu:notification.event.stage.started.message": "A(z) {stageTitle} szakasz elindult. A csoportok elkészültek.",
      "en:notification.event.tournament.finalized.title": "Tournament finalized",
      "hu:notification.event.tournament.finalized.title": "A verseny lezárult"
    };
    const translationKeys = [...new Set(Object.keys(expectedTranslations)
      .map(item => item.substring(item.indexOf(":") + 1)))];
    const translations = Q.collection("i18n_messages").find({
      lang: { $in: ["en", "hu"] },
      key: { $in: translationKeys }
    }).toArray();
    const actualTranslations = Object.fromEntries(translations.map(item => [
      `${Q.text(item.lang)}:${Q.text(item.key)}`,
      Q.text(item.value)
    ]));
    if (Object.entries(expectedTranslations).some(([key, value]) => actualTranslations[key] !== value)) {
      Q.fail("the live Mongo EN/HU Final Start/finalized translation boundary is incomplete.");
    }

    const preparedAtIso = Q.nowIso();
    const tournamentFinalLifecycle = {
      preparedAtIso,
      sourceCheckpointId: "TOURNAMENT-003",
      sourceNoOpVerifiedAtIso: Q.text(replay && replay.noOpVerifiedAtIso)
        || Q.text(state.tournamentReviewArmedAtIso),
      expectedFinalUserIds: expectedFinalUsers,
      domainBaseline: domain,
      priorNotificationBaseline: priorNotifications,
      lifecycleNotificationBaseline: lifecycleNotifications
    };
    const updated = Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: state._id, checkpointId: "TOURNAMENT-003" },
      {
        $set: {
          checkpointId: "TOURNAMENT-004",
          tournamentFinalLifecycle
        }
      }
    );
    if (updated.matchedCount !== 1 || updated.modifiedCount !== 1) {
      Q.fail("the guarded TOURNAMENT-003 to TOURNAMENT-004 metadata handoff was not applied exactly once.");
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "tournament-final-carry-forward-prepared",
      preparedAtIso,
      eventId: EVENT_ID,
      eventTitle: activeExpectedTitle(),
      qualifierStatus: qualifier.stageStatus,
      finalStatus: finalStage.stageStatus,
      finalMemberUserIds: actualFinalUsers,
      lifecycleNotifications,
      next: "Casey performs only Final -> Start Stage -> Start once. Do not Finalize yet."
    });
  }

  function verifyTournamentFinalStart() {
    config();
    if (checkpointId !== "TOURNAMENT-004") {
      Q.fail("verify-tournament-final-start is restricted to TOURNAMENT-004.");
    }
    const state = requireMatchingState();
    const lifecycle = state.tournamentFinalLifecycle;
    if (!lifecycle || !lifecycle.preparedAtIso) {
      Q.fail("TOURNAMENT-004 has no guarded T003 carry-forward baseline.");
    }
    if (!lifecycle.startWindowPreparedAtIso) {
      Q.fail("TOURNAMENT-004 Final Start has no guarded startable fixture window.");
    }
    if (!lifecycle.cleanStartRetestPreparedAtIso
        || lifecycle.priorNotificationsLiveRestored !== false) {
      Q.fail("TOURNAMENT-004 Final Start is not based on the clean replay fixture.");
    }
    if (lifecycle.startVerifiedAtIso) {
      Q.fail("TOURNAMENT-004 Final Start is already verified; do not replay it.");
    }
    const livePriorNotifications = tournamentFinalizeNotificationSnapshot();
    if (Object.values(livePriorNotifications).some(items => items.length !== 0)) {
      Q.fail("the clean Final Start replay restored closed Qualifiers notifications into the live inbox/outbox.");
    }
    const domain = tournamentReviewStableSnapshot();
    const qualifierId = `${EVENT_ID}:stage:qualifiers`;
    const finalId = `${EVENT_ID}:stage:final`;
    const qualifier = domain.stages.find(stage => stage.id === qualifierId);
    const finalStage = domain.stages.find(stage => stage.id === finalId);
    const qualifierRuntime = domain.stageRuntime.find(stage => stage.subEventId === qualifierId);
    const finalRuntime = domain.stageRuntime.find(stage => stage.subEventId === finalId);
    const expectedFinalUsers = sortedUnique(lifecycle.expectedFinalUserIds || []);
    const actualFinalUsers = sortedUnique(domain.finalGroupMembers
      .filter(member => Q.text(member.status).toLowerCase() === "accepted")
      .map(member => member.userId));
    const qualifierLeaderboardBefore = (lifecycle.domainBaseline.leaderboard || [])
      .filter(entry => entry.subEventId === qualifierId);
    const qualifierLeaderboardNow = (domain.leaderboard || [])
      .filter(entry => entry.subEventId === qualifierId);
    const cleanBaseline = lifecycle.startRecipientRetestDomainBaseline;
    const finalRoom = domain.finalRooms[0];
    const finalChatOwnerUserIds = sortedUnique(domain.chats.map(chat => chat.ownerUserId));
    if (!qualifier || Q.text(qualifier.stageStatus).toUpperCase() !== "F"
        || !qualifierRuntime || Q.text(qualifierRuntime.stageStatus).toUpperCase() !== "F"
        || !sameJson(qualifierLeaderboardNow, qualifierLeaderboardBefore)
        || !finalStage || Q.text(finalStage.stageStatus).toUpperCase() !== "A"
        || finalStage.stageStatusReason !== "tournament-started"
        || !finalRuntime || Q.text(finalRuntime.stageStatus).toUpperCase() !== "A"
        || finalRuntime.stageStatusReason !== "tournament-started"
        || domain.finalGroups.length !== 1
        || !sameJson(actualFinalUsers, expectedFinalUsers)
        || actualFinalUsers.includes(participantUserId)
        || domain.finalRooms.length !== 1
        || !finalRoom
        || finalRoom.parentEventId !== EVENT_ID
        || finalRoom.parentSubEventId !== finalId
        || finalRoom.title !== "Tournament Group R1"
        || !sameJson(finalRoom.acceptedMemberUserIds, expectedFinalUsers)
        || domain.chats.length !== 2
        || !sameJson(finalChatOwnerUserIds, expectedFinalUsers)
        || domain.chats.some(chat => !sameJson(chat.memberUserIds, expectedFinalUsers))
        || domain.planMarkers.length !== 1
        || !cleanBaseline
        || cleanBaseline.finalRooms.length !== 0
        || cleanBaseline.chats.length !== 0
        || cleanBaseline.outboxIntents.length !== 0) {
      Q.fail("Final Start did not preserve Qualifiers while creating exactly one Casey+Riley Final room and its two owner chat copies.");
    }
    const finalRoomMemberUserIds = sortedUnique(domain.finalRooms
      .flatMap(room => room.acceptedMemberUserIds || []));
    if (finalRoomMemberUserIds.some(userId => !expectedFinalUsers.includes(userId))) {
      Q.fail("Final Start admitted an eliminated or unrelated user to a generated Final room.");
    }

    const notifications = tournamentFinalLifecycleNotificationSnapshot();
    const startedOutbox = notifications.outbox.filter(item => item.type === "event-tournament-started");
    const finalizedOutbox = notifications.outbox.filter(item => item.type === "event-tournament-finalized");
    if (startedOutbox.length !== 1
        || !sameJson(startedOutbox[0].recipientUserIds, [thirdUserId])
        || startedOutbox[0].actorUserId !== hostUserId
        || startedOutbox[0].title !== "Final started"
        || startedOutbox[0].body !== "Final has started. Groups are ready."
        || startedOutbox[0].notificationTitleKey !== "notification.event.stage.started.title"
        || startedOutbox[0].notificationMessageKey !== "notification.event.stage.started.message"
        || startedOutbox[0].notificationAvatarTone !== "stage"
        || startedOutbox[0].notificationAvatarIcon !== "emoji_events"
        || startedOutbox[0].stageIndex !== "2"
        || startedOutbox[0].stageTotal !== "2"
        || startedOutbox[0].stageTitle !== "Final"
        || finalizedOutbox.length !== 0) {
      Q.fail("Final Start did not write exactly one stage-branded Riley-only notification intent with Casey/Nova excluded.");
    }
    const deliveredStart = notifications.notifications
      .filter(item => item.type === "event-tournament-started");
    const readyNotifications = tournamentFinalRoomReadyNotificationSnapshot();
    if (deliveredStart.length === 0 || readyNotifications.notifications.length === 0) {
      Q.printObject({
        scenario: SCENARIO,
        checkpointId,
        phase: "tournament-final-start-delivery-pending",
        deliveredStartCount: deliveredStart.length,
        deliveredRoomReadyCount: readyNotifications.notifications.length,
        next: "Wait for the existing notification-outbox worker, then rerun this verifier."
      });
      return;
    }
    const deliveredRecipients = deliveredStart.map(item => item.recipientUserId).sort();
    if (deliveredStart.length !== 1
        || !sameJson(deliveredRecipients, [thirdUserId])
        || deliveredStart[0].title !== "Final started"
        || deliveredStart[0].body !== "Final has started. Groups are ready."
        || deliveredStart[0].senderUserId !== hostUserId) {
      Q.fail("delivered Final Start notifications do not preserve the Riley-only Casey-authored boundary.");
    }
    const expectedReadyRecipients = [hostUserId, thirdUserId].sort();
    const readyOutbox = readyNotifications.outbox;
    const readyInboxRecipients = readyNotifications.notifications
      .map(item => item.recipientUserId)
      .sort();
    if (readyOutbox.length !== 1
        || !sameJson(readyOutbox[0].recipientUserIds, expectedReadyRecipients)
        || readyOutbox[0].eventId !== finalRoom.eventId
        || readyOutbox[0].title !== "Tournament Group R1 is ready"
        || readyOutbox[0].body !== `Your tournament group for ${activeExpectedTitle()} is ready.`
        || readyOutbox[0].senderName !== "MyScoutee System"
        || readyOutbox[0].eventScope !== "tournament-room"
        || readyOutbox[0].eventTitle !== "Tournament Group R1"
        || readyNotifications.notifications.length !== 2
        || !sameJson(readyInboxRecipients, expectedReadyRecipients)
        || readyNotifications.notifications.some(item => item.eventId !== finalRoom.eventId
          || item.title !== "Tournament Group R1 is ready"
          || item.body !== `Your tournament group for ${activeExpectedTitle()} is ready.`
          || item.senderName !== "MyScoutee System"
          || item.eventScope !== "tournament-room"
          || item.eventTitle !== "Tournament Group R1")) {
      Q.fail("Final Start did not create exactly one system room-ready intent and one delivered row for Casey and Riley.");
    }
    if (!startedOutbox[0].createdDate
        || !readyOutbox[0].createdDate
        || startedOutbox[0].createdDate >= readyOutbox[0].createdDate
        || deliveredStart[0].createdDate >= readyNotifications.notifications[0].createdDate) {
      Q.fail("Final Start causality is wrong: Casey's start notification must be persisted before the system room-ready notifications.");
    }
    const verifiedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: {
        "tournamentFinalLifecycle.startVerifiedAtIso": verifiedAtIso,
        "tournamentFinalLifecycle.startDomain": domain,
        "tournamentFinalLifecycle.startNotifications": notifications
      }
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "tournament-final-start-verified",
      verifiedAtIso,
      finalStatus: finalStage.stageStatus,
      finalMemberUserIds: actualFinalUsers,
      finalRoomMemberUserIds,
      startOutbox: startedOutbox,
      deliveredStart,
      roomReadyOutbox: readyOutbox,
      deliveredRoomReady: readyNotifications.notifications,
      next: "Compare the three live lists: Casey has only Tournament Group R1 is ready; Nova has none; Riley has Tournament Group R1 is ready above Casey's Final started."
    });
  }

  function prepareTournamentFinalCompletionBoundary() {
    config();
    if (checkpointId !== "TOURNAMENT-004") {
      Q.fail("prepare-tournament-final-completion-boundary is restricted to TOURNAMENT-004.");
    }
    const state = requireMatchingState();
    const lifecycle = state.tournamentFinalLifecycle;
    if (!lifecycle || !lifecycle.startVerifiedAtIso
        || !lifecycle.startDomain || !lifecycle.startNotifications) {
      Q.fail("the verified TOURNAMENT-004 Final Start boundary is missing.");
    }
    if (lifecycle.completionBoundaryPreparedAtIso) {
      Q.printObject({
        scenario: SCENARIO,
        checkpointId,
        phase: "tournament-final-completion-boundary-already-prepared",
        preparedAtIso: lifecycle.completionBoundaryPreparedAtIso,
        next: "Do not prepare again. Casey may perform the one visible Finalize action."
      });
      return;
    }

    const startDomain = tournamentReviewStableSnapshot();
    const startNotifications = tournamentFinalLifecycleNotificationSnapshot();
    const roomReadyNotifications = tournamentFinalRoomReadyNotificationSnapshot();
    if (!sameJson(startDomain, lifecycle.startDomain)) {
      Q.fail(`the PASS Final Start domain changed before completion setup: ${JSON.stringify(jsonDifferences(lifecycle.startDomain, startDomain))}`);
    }
    if (!sameJson(startNotifications, lifecycle.startNotifications)) {
      Q.fail("the PASS Final Start notification records changed before completion setup.");
    }
    const expectedFinalUsers = sortedUnique(lifecycle.expectedFinalUserIds || []);
    const expectedReadyRecipients = [hostUserId, thirdUserId].sort();
    if (roomReadyNotifications.outbox.length !== 1
        || !sameJson(roomReadyNotifications.outbox[0].recipientUserIds, expectedReadyRecipients)
        || roomReadyNotifications.notifications.length !== 2
        || !sameJson(
          roomReadyNotifications.notifications.map(item => item.recipientUserId).sort(),
          expectedReadyRecipients)) {
      Q.fail("the PASS Final room-ready audience changed before completion setup.");
    }

    const finalId = `${EVENT_ID}:stage:final`;
    const finalGroupId = `${finalId}:group:1`;
    const finalStage = startDomain.stages.find(stage => stage.id === finalId);
    const finalRuntime = startDomain.stageRuntime.find(stage => stage.subEventId === finalId);
    const actualFinalUsers = sortedUnique(startDomain.finalGroupMembers
      .filter(member => Q.text(member.status).toLowerCase() === "accepted")
      .map(member => member.userId));
    const finalLeaderboardBefore = startDomain.leaderboard
      .filter(entry => entry.subEventId === finalId);
    if (!finalStage || Q.text(finalStage.stageStatus).toUpperCase() !== "A"
        || finalStage.stageStatusReason !== "tournament-started"
        || !finalRuntime || Q.text(finalRuntime.stageStatus).toUpperCase() !== "A"
        || finalRuntime.stageStatusReason !== "tournament-started"
        || !sameJson(actualFinalUsers, expectedFinalUsers)
        || !sameJson(expectedFinalUsers, [hostUserId, thirdUserId].sort())
        || finalLeaderboardBefore.length !== 0
        || startNotifications.outbox.some(item => item.type === "event-tournament-finalized")
        || startNotifications.notifications.some(item => item.type === "event-tournament-finalized")) {
      Q.fail("Final is not at the exact active Casey+Riley pre-completion boundary.");
    }

    const preparedAtIso = Q.nowIso();
    const endedAtIso = dateIso(-1);
    const heldUntilIso = dateIso(60);
    const reviewRule = tournamentReviewRule();
    if (!reviewRule) {
      Q.fail(`notification rule '${TOURNAMENT_REVIEW_RULE}' is missing.`);
    }
    const held = Q.collection("notificationRuleConfigs").updateOne(
      { ruleKey: TOURNAMENT_REVIEW_RULE },
      {
        $set: {
          enabled: true,
          "runState.currentStatus": "idle",
          "runState.lastRunAtIso": heldUntilIso,
          "runState.progressPercent": 0,
          "runState.progressDetail": "Held during TOURNAMENT-004 terminal Finalize.",
          updatedDate: preparedAtIso,
          updatedUser: Q.ACTOR
        },
        $unset: {
          "runState.startedAtIso": "",
          "runState.finishedAtIso": ""
        }
      }
    );
    const eventUpdate = Q.collection("events").updateOne(
      manualEventSelector(),
      {
        $set: {
          "subEvents.$[final].endAt": endedAtIso,
          "subEvents.$[final].stageStatus": "SR",
          "subEvents.$[final].stageStatusReason": "stage-ended",
          "subEvents.$[final].stageStatusUpdatedAt": preparedAtIso,
          "subEvents.$[final].stageFinalizedAt": null,
          "subEvents.$[final].stageFinalizedByUserId": null,
          updatedDate: preparedAtIso,
          updatedUser: Q.ACTOR
        }
      },
      { arrayFilters: [{ "final.id": finalId }] }
    );
    const runtimeUpdate = Q.collection("activitySubEventStageRuntime").updateOne(
      { ownerId: EVENT_ID, subEventId: finalId },
      {
        $set: {
          stageStatus: "SR",
          stageStatusReason: "stage-ended",
          stageStatusUpdatedAt: preparedAtIso,
          stageFinalizedAt: null,
          stageFinalizedByUserId: null,
          updatedDate: preparedAtIso,
          updatedUser: Q.ACTOR
        }
      }
    );
    if (held.matchedCount !== 1
        || eventUpdate.matchedCount !== 1 || eventUpdate.modifiedCount !== 1
        || runtimeUpdate.matchedCount !== 1 || runtimeUpdate.modifiedCount !== 1) {
      Q.fail("the guarded Final completion boundary was not applied exactly once.");
    }

    Q.collection("eventLeaderboardEntries").insertMany([
      {
        _id: `${PREFIX}:tournament-final:score:casey`,
        syncKey: `${PREFIX}:tournament-final:score:casey`,
        eventId: EVENT_ID,
        subEventId: finalId,
        groupId: finalGroupId,
        entryType: "score",
        memberId: hostUserId,
        scoreValue: 9,
        note: "Manual QA deterministic tournament winner",
        createdAtIso: preparedAtIso,
        createdUser: hostUserId,
        updatedDate: preparedAtIso,
        updatedUser: hostUserId
      },
      {
        _id: `${PREFIX}:tournament-final:score:riley`,
        syncKey: `${PREFIX}:tournament-final:score:riley`,
        eventId: EVENT_ID,
        subEventId: finalId,
        groupId: finalGroupId,
        entryType: "score",
        memberId: thirdUserId,
        scoreValue: 7,
        note: "Manual QA deterministic tournament runner-up",
        createdAtIso: preparedAtIso,
        createdUser: hostUserId,
        updatedDate: preparedAtIso,
        updatedUser: hostUserId
      }
    ]);

    const preparedDomain = tournamentReviewStableSnapshot();
    const preparedFinal = preparedDomain.stages.find(stage => stage.id === finalId);
    const preparedRuntime = preparedDomain.stageRuntime.find(stage => stage.subEventId === finalId);
    const preparedFinalScores = preparedDomain.leaderboard
      .filter(entry => entry.subEventId === finalId);
    const qualifierLeaderboardBefore = startDomain.leaderboard
      .filter(entry => entry.subEventId !== finalId);
    const qualifierLeaderboardAfter = preparedDomain.leaderboard
      .filter(entry => entry.subEventId !== finalId);
    if (!preparedFinal || Q.text(preparedFinal.stageStatus).toUpperCase() !== "SR"
        || preparedFinal.stageStatusReason !== "stage-ended"
        || !preparedRuntime || Q.text(preparedRuntime.stageStatus).toUpperCase() !== "SR"
        || preparedRuntime.stageStatusReason !== "stage-ended"
        || preparedFinalScores.length !== 2
        || !sameJson(preparedFinalScores.map(item => ({
          memberId: item.memberId,
          scoreValue: item.scoreValue
        })), [
          { memberId: hostUserId, scoreValue: 9 },
          { memberId: thirdUserId, scoreValue: 7 }
        ].sort((left, right) => left.memberId.localeCompare(right.memberId)))
        || !sameJson(qualifierLeaderboardAfter, qualifierLeaderboardBefore)
        || !sameJson(preparedDomain.finalRooms, startDomain.finalRooms)
        || !sameJson(preparedDomain.finalGroups, startDomain.finalGroups)
        || !sameJson(preparedDomain.finalGroupMembers, startDomain.finalGroupMembers)
        || !sameJson(preparedDomain.chats, startDomain.chats)
        || !sameJson(preparedDomain.planMarkers, startDomain.planMarkers)
        || !sameJson(preparedDomain.outboxIntents, startDomain.outboxIntents)
        || !sameJson(preparedDomain.counters, startDomain.counters)
        || !sameJson(tournamentFinalLifecycleNotificationSnapshot(), startNotifications)
        || !sameJson(tournamentFinalRoomReadyNotificationSnapshot(), roomReadyNotifications)) {
      Q.fail("the completion setup changed evidence outside Final status/time and its two deterministic scores.");
    }

    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: {
        "tournamentFinalLifecycle.completionBoundaryPreparedAtIso": preparedAtIso,
        "tournamentFinalLifecycle.completionEndedAtIso": endedAtIso,
        "tournamentFinalLifecycle.completionWorkerHeldUntilIso": heldUntilIso,
        "tournamentFinalLifecycle.completionDomain": preparedDomain,
        "tournamentFinalLifecycle.completionRoomReadyNotifications": roomReadyNotifications
      }
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "tournament-final-completion-boundary-prepared",
      preparedAtIso,
      finalStatus: preparedFinal.stageStatus,
      finalMemberUserIds: actualFinalUsers,
      finalScores: preparedFinalScores,
      preservedStartOutboxCount: startNotifications.outbox.length,
      preservedRoomReadyOutboxCount: roomReadyNotifications.outbox.length,
      next: "Casey opens the retained event, Final -> Groups, confirms Casey 9 / Riley 7, then uses Finalize exactly once."
    });
  }

  function prepareTournamentFinalCompletionRetest() {
    config();
    if (checkpointId !== "TOURNAMENT-004") {
      Q.fail("prepare-tournament-final-completion-retest is restricted to TOURNAMENT-004.");
    }
    const state = requireMatchingState();
    const lifecycle = state.tournamentFinalLifecycle;
    if (!lifecycle || !lifecycle.startVerifiedAtIso
        || !lifecycle.startDomain || !lifecycle.startNotifications
        || !lifecycle.completionBoundaryPreparedAtIso
        || !lifecycle.completionDomain
        || !lifecycle.completionRoomReadyNotifications) {
      Q.fail("the verified Final Start and failed terminal boundary are not both available.");
    }
    if (lifecycle.completionVerifiedAtIso) {
      Q.fail("TOURNAMENT-004 Final completion is already verified; do not prepare a replay.");
    }
    if (lifecycle.completionRetestPreparedAtIso) {
      Q.fail("TOURNAMENT-004 terminal replay is already prepared; do not rewind it again.");
    }

    const finalId = `${EVENT_ID}:stage:final`;
    const finalGroupId = `${finalId}:group:1`;
    const failedDomain = tournamentReviewStableSnapshot();
    const failedFinal = failedDomain.stages.find(stage => stage.id === finalId);
    const failedRuntime = failedDomain.stageRuntime.find(stage => stage.subEventId === finalId);
    const baseline = lifecycle.completionDomain;
    const failedScores = failedDomain.leaderboard.filter(entry => entry.subEventId === finalId);
    const baselineScores = baseline.leaderboard.filter(entry => entry.subEventId === finalId);
    if (!failedFinal || Q.text(failedFinal.stageStatus).toUpperCase() !== "F"
        || failedFinal.stageStatusReason !== "stage-finalized"
        || failedFinal.stageFinalizedByUserId !== hostUserId
        || !failedRuntime || Q.text(failedRuntime.stageStatus).toUpperCase() !== "F"
        || failedRuntime.stageStatusReason !== "stage-finalized"
        || failedRuntime.stageFinalizedByUserId !== hostUserId
        || !sameJson(failedScores, baselineScores)
        || !sameJson(failedDomain.finalRooms, baseline.finalRooms)
        || !sameJson(failedDomain.finalGroups, baseline.finalGroups)
        || !sameJson(failedDomain.finalGroupMembers, baseline.finalGroupMembers)
        || !sameJson(failedDomain.chats, baseline.chats)
        || !sameJson(failedDomain.planMarkers, baseline.planMarkers)
        || !sameJson(failedDomain.counters, baseline.counters)) {
      Q.fail("the failed terminal transaction is no longer at the exact preserved Final boundary.");
    }

    const failedNotifications = tournamentFinalLifecycleNotificationSnapshot();
    const failedStarted = {
      outbox: failedNotifications.outbox.filter(item => item.type === "event-tournament-started"),
      notifications: failedNotifications.notifications.filter(item => item.type === "event-tournament-started")
    };
    const failedMergedOutbox = failedNotifications.outbox
      .filter(item => item.type === "event-tournament-finalized");
    const failedMergedNotifications = failedNotifications.notifications
      .filter(item => item.type === "event-tournament-finalized");
    const expectedMergedRecipients = [participantUserId, thirdUserId].sort();
    if (!sameJson(failedStarted, lifecycle.startNotifications)
        || failedMergedOutbox.length !== 1
        || !sameJson(failedMergedOutbox[0].recipientUserIds, expectedMergedRecipients)
        || failedMergedOutbox[0].actorUserId !== hostUserId
        || failedMergedOutbox[0].title !== "Tournament finalized"
        || failedMergedNotifications.length !== 2
        || !sameJson(
          failedMergedNotifications.map(item => item.recipientUserId).sort(),
          expectedMergedRecipients)
        || failedMergedNotifications.some(item => item.senderUserId !== hostUserId)
        || failedNotifications.outbox.some(item => [
          "event-stage-finalized",
          "event-tournament-won",
          "event-tournament-not-won"
        ].includes(item.type))
        || failedNotifications.notifications.some(item => [
          "event-stage-finalized",
          "event-tournament-won",
          "event-tournament-not-won"
        ].includes(item.type))) {
      Q.fail("the terminal failure is not the exact one merged Casey/result notification boundary.");
    }
    if (!sameJson(
      tournamentFinalRoomReadyNotificationSnapshot(),
      lifecycle.completionRoomReadyNotifications)) {
      Q.fail("the PASS Final room-ready records changed before terminal replay preparation.");
    }

    const preparedAtIso = Q.nowIso();
    const endedAtIso = dateIso(-1);
    const heldUntilIso = dateIso(60);
    const reviewRule = tournamentReviewRule();
    const held = Q.collection("notificationRuleConfigs").updateOne(
      { ruleKey: TOURNAMENT_REVIEW_RULE },
      {
        $set: {
          enabled: true,
          "runState.currentStatus": "idle",
          "runState.lastRunAtIso": heldUntilIso,
          "runState.progressPercent": 0,
          "runState.progressDetail": "Held during TOURNAMENT-004 terminal notification replay.",
          updatedDate: preparedAtIso,
          updatedUser: Q.ACTOR
        },
        $unset: {
          "runState.startedAtIso": "",
          "runState.finishedAtIso": ""
        }
      }
    );
    if (!reviewRule || held.matchedCount !== 1) {
      Q.fail(`notification rule '${TOURNAMENT_REVIEW_RULE}' disappeared during terminal replay preparation.`);
    }

    const eventUpdate = Q.collection("events").updateOne(
      manualEventSelector(),
      {
        $set: {
          "subEvents.$[final].endAt": endedAtIso,
          "subEvents.$[final].stageStatus": "SR",
          "subEvents.$[final].stageStatusReason": "stage-ended",
          "subEvents.$[final].stageStatusUpdatedAt": preparedAtIso,
          "subEvents.$[final].stageFinalizedAt": null,
          "subEvents.$[final].stageFinalizedByUserId": null,
          updatedDate: preparedAtIso,
          updatedUser: Q.ACTOR
        }
      },
      { arrayFilters: [{ "final.id": finalId }] }
    );
    const runtimeUpdate = Q.collection("activitySubEventStageRuntime").updateOne(
      { ownerId: EVENT_ID, subEventId: finalId },
      {
        $set: {
          stageStatus: "SR",
          stageStatusReason: "stage-ended",
          stageStatusUpdatedAt: preparedAtIso,
          stageFinalizedAt: null,
          stageFinalizedByUserId: null,
          updatedDate: preparedAtIso,
          updatedUser: Q.ACTOR
        }
      }
    );
    const caseyScoreUpdate = Q.collection("eventLeaderboardEntries").updateOne(
      {
        eventId: EVENT_ID,
        subEventId: finalId,
        groupId: finalGroupId,
        memberId: hostUserId,
        scoreValue: 9
      },
      { $set: { scoreValue: 7, updatedDate: preparedAtIso, updatedUser: Q.ACTOR } }
    );
    const rileyScoreUpdate = Q.collection("eventLeaderboardEntries").updateOne(
      {
        eventId: EVENT_ID,
        subEventId: finalId,
        groupId: finalGroupId,
        memberId: thirdUserId,
        scoreValue: 7
      },
      { $set: { scoreValue: 9, updatedDate: preparedAtIso, updatedUser: Q.ACTOR } }
    );
    if (eventUpdate.matchedCount !== 1 || eventUpdate.modifiedCount !== 1
        || runtimeUpdate.matchedCount !== 1 || runtimeUpdate.modifiedCount !== 1
        || caseyScoreUpdate.matchedCount !== 1 || caseyScoreUpdate.modifiedCount !== 1
        || rileyScoreUpdate.matchedCount !== 1 || rileyScoreUpdate.modifiedCount !== 1) {
      Q.fail("the Final event/runtime and exact 9/7 score boundary were not rewound once.");
    }

    const outboxRemoval = Q.collection("notificationOutbox").deleteMany({
      notificationType: "event-tournament-finalized",
      $or: [{ entityId: EVENT_ID }, { "payload.eventId": EVENT_ID }]
    });
    const notificationRemoval = Q.collection("userNotifications").deleteMany({
      kind: "event-tournament-finalized",
      $or: [{ sourceId: EVENT_ID }, { "payload.eventId": EVENT_ID }]
    });
    if (outboxRemoval.deletedCount !== 1 || notificationRemoval.deletedCount !== 2) {
      Q.fail("the exact merged terminal notification artifacts changed during replay preparation.");
    }

    const translations = [
      ["en", "notification.event.tournament.won.title", "Won the tournament"],
      ["en", "notification.event.tournament.won.message", "You won in {stageTitle}."],
      ["en", "notification.event.tournament.not-won.title", "Did not win the tournament"],
      ["en", "notification.event.tournament.not-won.message", "You did not win in {stageTitle}."],
      ["hu", "notification.event.tournament.won.title", "Megnyerted a versenyt"],
      ["hu", "notification.event.tournament.won.message", "Megnyerted a versenyt a(z) {stageTitle} szakaszban."],
      ["hu", "notification.event.tournament.not-won.title", "Nem nyerted meg a versenyt"],
      ["hu", "notification.event.tournament.not-won.message", "Nem nyerted meg a versenyt a(z) {stageTitle} szakaszban."]
    ];
    for (const [lang, key, value] of translations) {
      const translationUpdate = Q.collection("i18n_messages").updateOne(
        { key, lang },
        {
          $set: { value },
          $setOnInsert: {
            _id: `i18n-message-${lang}-${key.replaceAll(".", "-")}`
          }
        },
        { upsert: true }
      );
      if (translationUpdate.matchedCount + translationUpdate.upsertedCount !== 1) {
        Q.fail(`terminal notification translation '${lang}:${key}' was not upserted exactly once.`);
      }
    }

    for (const userId of [hostUserId, participantUserId, thirdUserId]) {
      const unreadNotifications = Q.collection("userNotifications").countDocuments({
        recipientUserId: userId,
        $or: [{ readAtIso: { $exists: false } }, { readAtIso: null }]
      });
      const counterUpdate = Q.collection("users").updateOne(
        { $or: [{ _id: userId }, { userId }] },
        { $set: { "activities.notifications": unreadNotifications } }
      );
      if (counterUpdate.matchedCount !== 1) {
        Q.fail(`notification counter target '${userId}' disappeared during terminal replay preparation.`);
      }
    }

    const preparedDomain = tournamentReviewStableSnapshot();
    const expectedLeaderboard = baseline.leaderboard.map(entry => {
      if (entry.subEventId !== finalId) return entry;
      if (entry.memberId === hostUserId) return { ...entry, scoreValue: 7 };
      if (entry.memberId === thirdUserId) return { ...entry, scoreValue: 9 };
      return entry;
    });
    const expectedPreparedDomain = { ...baseline, leaderboard: expectedLeaderboard };
    if (!sameJson(preparedDomain, expectedPreparedDomain)
        || !sameJson(tournamentFinalLifecycleNotificationSnapshot(), lifecycle.startNotifications)
        || !sameJson(
          tournamentFinalRoomReadyNotificationSnapshot(),
          lifecycle.completionRoomReadyNotifications)) {
      Q.fail("terminal replay preparation changed evidence outside Final status and its two reversed scores.");
    }

    const stateUpdate = Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: state._id },
      {
        $set: {
          "tournamentFinalLifecycle.completionRetestPreparedAtIso": preparedAtIso,
          "tournamentFinalLifecycle.completionRetestEndedAtIso": endedAtIso,
          "tournamentFinalLifecycle.completionRetestHeldUntilIso": heldUntilIso,
          "tournamentFinalLifecycle.completionRetestDomain": preparedDomain,
          "tournamentFinalLifecycle.completionFailedDomain": failedDomain,
          "tournamentFinalLifecycle.completionFailedNotifications": failedNotifications
        },
        $unset: {
          "tournamentFinalLifecycle.completionVerifiedAtIso": "",
          "tournamentFinalLifecycle.completionVerifiedDomain": "",
          "tournamentFinalLifecycle.completionNotifications": ""
        }
      }
    );
    if (stateUpdate.matchedCount !== 1 || stateUpdate.modifiedCount !== 1) {
      Q.fail("the guarded terminal replay metadata was not persisted exactly once.");
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "tournament-final-completion-retest-prepared",
      preparedAtIso,
      finalStatus: "SR",
      finalScores: preparedDomain.leaderboard.filter(entry => entry.subEventId === finalId),
      preservedStartOutboxCount: lifecycle.startNotifications.outbox.length,
      preservedRoomReadyOutboxCount: lifecycle.completionRoomReadyNotifications.outbox.length,
      removedMergedOutboxCount: outboxRemoval.deletedCount,
      removedMergedNotificationCount: notificationRemoval.deletedCount,
      next: "Reload only Casey's retained Final view, confirm Casey 7 / Riley 9, then Finalize exactly once. Do not replay Start."
    });
  }

  function verifyTournamentFinalCompletion() {
    config();
    if (checkpointId !== "TOURNAMENT-004") {
      Q.fail("verify-tournament-final-completion is restricted to TOURNAMENT-004.");
    }
    const state = requireMatchingState();
    const lifecycle = state.tournamentFinalLifecycle;
    if (!lifecycle || !lifecycle.startVerifiedAtIso
        || !lifecycle.completionRetestPreparedAtIso
        || !lifecycle.completionRetestDomain) {
      Q.fail("the guarded Final terminal replay boundary is missing.");
    }
    if (lifecycle.completionVerifiedAtIso) {
      Q.fail("TOURNAMENT-004 Final completion is already verified; do not replay it.");
    }

    const domain = tournamentReviewStableSnapshot();
    const finalId = `${EVENT_ID}:stage:final`;
    const finalStage = domain.stages.find(stage => stage.id === finalId);
    const finalRuntime = domain.stageRuntime.find(stage => stage.subEventId === finalId);
    const baseline = lifecycle.completionRetestDomain;
    const finalScores = domain.leaderboard.filter(entry => entry.subEventId === finalId);
    const baselineFinalScores = baseline.leaderboard.filter(entry => entry.subEventId === finalId);
    if (!finalStage || Q.text(finalStage.stageStatus).toUpperCase() !== "F"
        || finalStage.stageStatusReason !== "stage-finalized"
        || finalStage.stageFinalizedByUserId !== hostUserId
        || !finalStage.stageFinalizedAt
        || !finalRuntime || Q.text(finalRuntime.stageStatus).toUpperCase() !== "F"
        || finalRuntime.stageStatusReason !== "stage-finalized"
        || finalRuntime.stageFinalizedByUserId !== hostUserId
        || !finalRuntime.stageFinalizedAt
        || !sameJson(finalScores, baselineFinalScores)
        || !sameJson(domain.finalRooms, baseline.finalRooms)
        || !sameJson(domain.finalGroups, baseline.finalGroups)
        || !sameJson(domain.finalGroupMembers, baseline.finalGroupMembers)
        || !sameJson(domain.chats, baseline.chats)
        || !sameJson(domain.planMarkers, baseline.planMarkers)
        || !sameJson(domain.counters, baseline.counters)) {
      Q.fail("Final Finalize did not preserve the proven room/group/chat/score boundary.");
    }

    const notifications = tournamentFinalLifecycleNotificationSnapshot();
    const started = {
      outbox: notifications.outbox.filter(item => item.type === "event-tournament-started"),
      notifications: notifications.notifications.filter(item => item.type === "event-tournament-started")
    };
    const humanOutbox = notifications.outbox.filter(item => item.type === "event-stage-finalized");
    const wonOutbox = notifications.outbox.filter(item => item.type === "event-tournament-won");
    const notWonOutbox = notifications.outbox.filter(item => item.type === "event-tournament-not-won");
    const oldMergedOutbox = notifications.outbox.filter(item => item.type === "event-tournament-finalized");
    const terminalNotifications = notifications.notifications.filter(item => [
      "event-stage-finalized",
      "event-tournament-won",
      "event-tournament-not-won"
    ].includes(item.type));
    if (!sameJson(started, lifecycle.startNotifications)
        || oldMergedOutbox.length !== 0
        || notifications.notifications.some(item => item.type === "event-tournament-finalized")
        || humanOutbox.length !== 1
        || !sameJson(humanOutbox[0].recipientUserIds, [thirdUserId])
        || humanOutbox[0].actorUserId !== hostUserId
        || humanOutbox[0].title !== "Final finalized"
        || humanOutbox[0].body !== "Final has been finalized."
        || humanOutbox[0].notificationTitleKey !== "notification.event.stage.finalized.title"
        || humanOutbox[0].notificationMessageKey !== "notification.event.stage.finalized.message"
        || humanOutbox[0].notificationTone !== "info"
        || humanOutbox[0].notificationAvatarTone !== ""
        || humanOutbox[0].notificationAvatarIcon !== ""
        || humanOutbox[0].stageIndex !== "2"
        || humanOutbox[0].stageTotal !== "2"
        || humanOutbox[0].stageTitle !== "Final"
        || wonOutbox.length !== 1
        || !sameJson(wonOutbox[0].recipientUserIds, [thirdUserId])
        || wonOutbox[0].actorUserId !== "scheduler"
        || wonOutbox[0].title !== "Won the tournament"
        || wonOutbox[0].body !== "You won in Final."
        || wonOutbox[0].notificationTitleKey !== "notification.event.tournament.won.title"
        || wonOutbox[0].notificationMessageKey !== "notification.event.tournament.won.message"
        || wonOutbox[0].notificationTone !== "success"
        || wonOutbox[0].notificationAvatarTone !== "stage"
        || wonOutbox[0].notificationAvatarIcon !== "emoji_events"
        || wonOutbox[0].stageIndex !== "2"
        || wonOutbox[0].stageTotal !== "2"
        || wonOutbox[0].stageTitle !== "Final"
        || wonOutbox[0].tournamentComplete !== "true"
        || notWonOutbox.length !== 1
        || !sameJson(notWonOutbox[0].recipientUserIds, [hostUserId])
        || notWonOutbox[0].actorUserId !== "scheduler"
        || notWonOutbox[0].title !== "Did not win the tournament"
        || notWonOutbox[0].body !== "You did not win in Final."
        || notWonOutbox[0].notificationTitleKey !== "notification.event.tournament.not-won.title"
        || notWonOutbox[0].notificationMessageKey !== "notification.event.tournament.not-won.message"
        || notWonOutbox[0].notificationTone !== "warning"
        || notWonOutbox[0].notificationAvatarTone !== "stage"
        || notWonOutbox[0].notificationAvatarIcon !== "emoji_events"
        || notWonOutbox[0].stageIndex !== "2"
        || notWonOutbox[0].stageTotal !== "2"
        || notWonOutbox[0].stageTitle !== "Final"
        || notWonOutbox[0].tournamentComplete !== "true"
        || humanOutbox[0].createdDate >= wonOutbox[0].createdDate
        || humanOutbox[0].createdDate >= notWonOutbox[0].createdDate) {
      Q.fail("terminal Finalize did not persist one Casey audit followed by two separate short system outcomes.");
    }
    if (terminalNotifications.length < 3) {
      Q.printObject({
        scenario: SCENARIO,
        checkpointId,
        phase: "tournament-final-completion-delivery-pending",
        terminalOutbox: [...humanOutbox, ...wonOutbox, ...notWonOutbox],
        next: "Wait for the existing notification-outbox worker, then rerun this verifier."
      });
      return;
    }
    const humanNotification = terminalNotifications
      .filter(item => item.type === "event-stage-finalized");
    const wonNotification = terminalNotifications
      .filter(item => item.type === "event-tournament-won");
    const notWonNotification = terminalNotifications
      .filter(item => item.type === "event-tournament-not-won");
    if (terminalNotifications.length !== 3
        || humanNotification.length !== 1
        || humanNotification[0].recipientUserId !== thirdUserId
        || humanNotification[0].senderUserId !== hostUserId
        || humanNotification[0].title !== "Final finalized"
        || humanNotification[0].body !== "Final has been finalized."
        || wonNotification.length !== 1
        || wonNotification[0].recipientUserId !== thirdUserId
        || wonNotification[0].title !== "Won the tournament"
        || wonNotification[0].body !== "You won in Final."
        || wonNotification[0].notificationTone !== "success"
        || wonNotification[0].notificationAvatarTone !== "stage"
        || wonNotification[0].notificationAvatarIcon !== "emoji_events"
        || notWonNotification.length !== 1
        || notWonNotification[0].recipientUserId !== hostUserId
        || notWonNotification[0].title !== "Did not win the tournament"
        || notWonNotification[0].body !== "You did not win in Final."
        || notWonNotification[0].notificationTone !== "warning"
        || notWonNotification[0].notificationAvatarTone !== "stage"
        || notWonNotification[0].notificationAvatarIcon !== "emoji_events"
        || terminalNotifications.some(item => item.recipientUserId === participantUserId)) {
      Q.fail("delivered terminal rows do not preserve Casey's audit and the separate Riley-won/Casey-not-won system results.");
    }
    if (!sameJson(
      tournamentFinalRoomReadyNotificationSnapshot(),
      lifecycle.completionRoomReadyNotifications)) {
      Q.fail("terminal Finalize changed or duplicated the PASS Final room-ready records.");
    }

    const verifiedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: {
        "tournamentFinalLifecycle.completionVerifiedAtIso": verifiedAtIso,
        "tournamentFinalLifecycle.completionVerifiedDomain": domain,
        "tournamentFinalLifecycle.completionNotifications": notifications
      }
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "tournament-final-completion-verified",
      verifiedAtIso,
      finalStatus: finalStage.stageStatus,
      actorUserId: hostUserId,
      winnerUserId: thirdUserId,
      nonWinnerUserId: hostUserId,
      terminalOutbox: [...humanOutbox, ...wonOutbox, ...notWonOutbox],
      terminalNotifications,
      next: "Compare New: Riley has the short system win above Casey's separate Final finalized audit; Casey has only the short system non-win; Nova has no terminal row."
    });
  }

  function repairTournamentFinalStartWindow() {
    config();
    if (checkpointId !== "TOURNAMENT-004") {
      Q.fail("repair-tournament-final-start-window is restricted to TOURNAMENT-004.");
    }
    const state = requireMatchingState();
    const lifecycle = state.tournamentFinalLifecycle;
    if (!lifecycle || !lifecycle.preparedAtIso) {
      Q.fail("TOURNAMENT-004 has no guarded T003 carry-forward baseline.");
    }
    if (lifecycle.startVerifiedAtIso) {
      Q.fail("TOURNAMENT-004 Final Start is already verified; its fixture window must not be changed.");
    }
    if (lifecycle.startWindowPreparedAtIso) {
      Q.fail("TOURNAMENT-004 Final Start fixture window is already prepared; do not replay the repair.");
    }
    if (!sameJson(tournamentFinalizeNotificationSnapshot(), lifecycle.priorNotificationBaseline)
        || !sameJson(tournamentFinalLifecycleNotificationSnapshot(), lifecycle.lifecycleNotificationBaseline)) {
      Q.fail("the closed TOURNAMENT-003 notification boundary changed before the Final window repair.");
    }

    const domainBefore = tournamentReviewStableSnapshot();
    const qualifierId = `${EVENT_ID}:stage:qualifiers`;
    const finalId = `${EVENT_ID}:stage:final`;
    const qualifier = domainBefore.stages.find(stage => stage.id === qualifierId);
    const finalStage = domainBefore.stages.find(stage => stage.id === finalId);
    const qualifierRuntime = domainBefore.stageRuntime.find(stage => stage.subEventId === qualifierId);
    const finalRuntime = domainBefore.stageRuntime.find(stage => stage.subEventId === finalId);
    const expectedFinalUsers = sortedUnique(lifecycle.expectedFinalUserIds || []);
    const actualFinalUsers = sortedUnique(domainBefore.finalGroupMembers
      .filter(member => Q.text(member.status).toLowerCase() === "accepted")
      .map(member => member.userId));
    if (!qualifier || Q.text(qualifier.stageStatus).toUpperCase() !== "F"
        || !qualifierRuntime || Q.text(qualifierRuntime.stageStatus).toUpperCase() !== "F"
        || !finalStage || Q.text(finalStage.stageStatus).toUpperCase() !== "RS"
        || finalStage.stageStatusReason !== "awaiting-prior-stage"
        || finalRuntime
        || domainBefore.finalGroups.length !== 1
        || !sameJson(actualFinalUsers, expectedFinalUsers)
        || actualFinalUsers.includes(participantUserId)
        || domainBefore.finalRooms.length !== 0
        || domainBefore.chats.length !== 0) {
      Q.fail("the tournament is not at the exact no-op Final Start repair boundary.");
    }

    const events = Q.collection("events").find(manualEventSelector()).toArray();
    if (events.length !== 1) {
      Q.fail(`expected one retained tournament event for Final window repair, found ${events.length}.`);
    }
    const event = events[0];
    const subEvents = (event.subEvents || []).map(stage => ({ ...stage }));
    const finalIndex = subEvents.findIndex(stage => Q.text(stage.id) === finalId);
    if (finalIndex < 0) {
      Q.fail("the retained tournament has no materialized Final stage.");
    }
    const originalStartAt = Q.text(subEvents[finalIndex].startAt);
    const originalEndAt = Q.text(subEvents[finalIndex].endAt);
    const originalStartMs = Date.parse(originalStartAt);
    const originalEndMs = Date.parse(originalEndAt);
    const nowMs = Date.now();
    if (!Number.isFinite(originalStartMs) || !Number.isFinite(originalEndMs)
        || originalStartMs <= nowMs) {
      Q.fail("the rejected Final Start is not explained by a future materialized start instant.");
    }

    const startAt = new Date(nowMs - 2 * 60 * 1000).toISOString();
    const endAt = new Date(nowMs + 120 * 60 * 1000).toISOString();
    subEvents[finalIndex] = { ...subEvents[finalIndex], startAt, endAt };
    const updated = Q.collection("events").updateOne(
      { _id: event._id, sourceId: EVENT_ID },
      { $set: { subEvents } }
    );
    if (updated.matchedCount !== 1 || updated.modifiedCount !== 1) {
      Q.fail("the guarded Final startable-window repair was not applied exactly once.");
    }

    const repaired = Q.collection("events").findOne({ _id: event._id });
    const repairedFinal = (repaired && repaired.subEvents || [])
      .find(stage => Q.text(stage.id) === finalId);
    if (!repairedFinal
        || Q.text(repairedFinal.stageStatus).toUpperCase() !== "RS"
        || repairedFinal.stageStatusReason !== "awaiting-prior-stage"
        || Q.text(repairedFinal.startAt) !== startAt
        || Q.text(repairedFinal.endAt) !== endAt
        || Date.parse(repairedFinal.startAt) >= Date.now()
        || Date.parse(repairedFinal.endAt) <= Date.now()) {
      Q.fail("the repaired Final stage is not at a startable RS boundary.");
    }
    const domainAfter = tournamentReviewStableSnapshot();
    if (!sameJson(domainAfter, domainBefore)
        || !sameJson(tournamentFinalizeNotificationSnapshot(), lifecycle.priorNotificationBaseline)
        || !sameJson(tournamentFinalLifecycleNotificationSnapshot(), lifecycle.lifecycleNotificationBaseline)) {
      Q.fail("the Final startable-window repair changed closed domain or notification evidence.");
    }

    const preparedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: {
        "tournamentFinalLifecycle.startWindowPreparedAtIso": preparedAtIso,
        "tournamentFinalLifecycle.startWindowOriginalStartAt": originalStartAt,
        "tournamentFinalLifecycle.startWindowOriginalEndAt": originalEndAt,
        "tournamentFinalLifecycle.startWindowStartAt": startAt,
        "tournamentFinalLifecycle.startWindowEndAt": endAt
      }
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "tournament-final-start-window-repaired",
      preparedAtIso,
      originalStartAt,
      originalEndAt,
      startAt,
      endAt,
      finalStatus: repairedFinal.stageStatus,
      finalMemberUserIds: actualFinalUsers,
      next: "Close the unchanged failure dialog, reopen Final -> Start Stage and perform Start once."
    });
  }

  function prepareTournamentFinalStartRecipientRetest() {
    config();
    if (checkpointId !== "TOURNAMENT-004") {
      Q.fail("prepare-tournament-final-start-recipient-retest is restricted to TOURNAMENT-004.");
    }
    const state = requireMatchingState();
    const lifecycle = state.tournamentFinalLifecycle;
    if (!lifecycle || !lifecycle.startWindowPreparedAtIso) {
      Q.fail("TOURNAMENT-004 has no guarded startable Final window.");
    }
    if (lifecycle.startVerifiedAtIso) {
      Q.fail("TOURNAMENT-004 Final Start is already verified; do not prepare a recipient replay.");
    }
    if (lifecycle.startRecipientRetestPreparedAtIso) {
      Q.fail("TOURNAMENT-004 Final Start recipient replay is already prepared; do not repeat it.");
    }
    if (!sameJson(tournamentFinalizeNotificationSnapshot(), lifecycle.priorNotificationBaseline)) {
      Q.fail("the closed TOURNAMENT-003 notification boundary changed before the Final Start recipient replay.");
    }

    const domain = tournamentReviewStableSnapshot();
    const qualifierId = `${EVENT_ID}:stage:qualifiers`;
    const finalId = `${EVENT_ID}:stage:final`;
    const qualifier = domain.stages.find(stage => stage.id === qualifierId);
    const finalStage = domain.stages.find(stage => stage.id === finalId);
    const qualifierRuntime = domain.stageRuntime.find(stage => stage.subEventId === qualifierId);
    const finalRuntime = domain.stageRuntime.find(stage => stage.subEventId === finalId);
    const expectedFinalUsers = sortedUnique(lifecycle.expectedFinalUserIds || []);
    const actualFinalUsers = sortedUnique(domain.finalGroupMembers
      .filter(member => Q.text(member.status).toLowerCase() === "accepted")
      .map(member => member.userId));
    const finalRoomMemberUserIds = sortedUnique(domain.finalRooms
      .flatMap(room => room.acceptedMemberUserIds || []));
    if (!qualifier || Q.text(qualifier.stageStatus).toUpperCase() !== "F"
        || !qualifierRuntime || Q.text(qualifierRuntime.stageStatus).toUpperCase() !== "F"
        || !finalStage || Q.text(finalStage.stageStatus).toUpperCase() !== "A"
        || finalStage.stageStatusReason !== "tournament-started"
        || !finalRuntime || Q.text(finalRuntime.stageStatus).toUpperCase() !== "A"
        || finalRuntime.stageStatusReason !== "tournament-started"
        || domain.finalGroups.length !== 1
        || !sameJson(actualFinalUsers, expectedFinalUsers)
        || actualFinalUsers.includes(participantUserId)
        || finalRoomMemberUserIds.some(userId => !expectedFinalUsers.includes(userId))
        || domain.planMarkers.length !== 1) {
      Q.fail("the failed recipient transaction is not at the exact successful-domain Final Start boundary.");
    }

    const notifications = tournamentFinalLifecycleNotificationSnapshot();
    const startedOutbox = notifications.outbox.filter(item => item.type === "event-tournament-started");
    const startedNotifications = notifications.notifications
      .filter(item => item.type === "event-tournament-started");
    if (startedOutbox.length !== 1
        || !sameJson(startedOutbox[0].recipientUserIds, [participantUserId, thirdUserId].sort())
        || startedOutbox[0].actorUserId !== hostUserId
        || startedNotifications.length !== 2
        || !sameJson(startedNotifications.map(item => item.recipientUserId).sort(), [participantUserId, thirdUserId].sort())
        || startedNotifications.some(item => item.senderUserId !== hostUserId)
        || notifications.outbox.some(item => item.type === "event-tournament-finalized")
        || notifications.notifications.some(item => item.type === "event-tournament-finalized")) {
      Q.fail("the failed Final Start recipient evidence is not the exact Nova+Riley over-broadcast boundary.");
    }

    const preparedAtIso = Q.nowIso();
    const eventUpdate = Q.collection("events").updateOne(
      manualEventSelector(),
      {
        $set: {
          "subEvents.$[final].stageStatus": "RS",
          "subEvents.$[final].stageStatusReason": "awaiting-prior-stage",
          "subEvents.$[final].stageStatusUpdatedAt": null,
          "subEvents.$[final].stageFinalizedAt": null,
          "subEvents.$[final].stageFinalizedByUserId": null,
          updatedDate: preparedAtIso,
          updatedUser: Q.ACTOR
        }
      },
      { arrayFilters: [{ "final.id": finalId }] }
    );
    const runtimeUpdate = Q.collection("activitySubEventStageRuntime").updateOne(
      { ownerId: EVENT_ID, subEventId: finalId },
      {
        $set: {
          stageStatus: "RS",
          stageStatusReason: "awaiting-prior-stage",
          stageStatusUpdatedAt: null,
          stageFinalizedAt: null,
          stageFinalizedByUserId: null,
          updatedDate: preparedAtIso,
          updatedUser: Q.ACTOR
        }
      }
    );
    if (eventUpdate.matchedCount !== 1 || eventUpdate.modifiedCount !== 1
        || runtimeUpdate.matchedCount !== 1 || runtimeUpdate.modifiedCount !== 1) {
      Q.fail("the Final event/runtime state could not be rewound exactly once for the focused recipient replay.");
    }

    const outboxRemoval = Q.collection("notificationOutbox").deleteMany({
      notificationType: "event-tournament-started",
      $or: [{ entityId: EVENT_ID }, { "payload.eventId": EVENT_ID }]
    });
    const notificationRemoval = Q.collection("userNotifications").deleteMany({
      kind: "event-tournament-started",
      $or: [{ sourceId: EVENT_ID }, { "payload.eventId": EVENT_ID }]
    });
    if (outboxRemoval.deletedCount !== 1 || notificationRemoval.deletedCount !== 2) {
      Q.fail("the defective Final Start notification artifacts changed during replay preparation.");
    }
    for (const userId of [hostUserId, participantUserId, thirdUserId]) {
      const unreadNotifications = Q.collection("userNotifications").countDocuments({
        recipientUserId: userId,
        $or: [{ readAtIso: { $exists: false } }, { readAtIso: null }]
      });
      const counterUpdate = Q.collection("users").updateOne(
        { $or: [{ _id: userId }, { userId }] },
        { $set: { "activities.notifications": unreadNotifications } }
      );
      if (counterUpdate.matchedCount !== 1) {
        Q.fail(`notification counter target '${userId}' disappeared during Final Start replay preparation.`);
      }
    }

    const preparedDomain = tournamentReviewStableSnapshot();
    const preparedFinal = preparedDomain.stages.find(stage => stage.id === finalId);
    const preparedRuntime = preparedDomain.stageRuntime.find(stage => stage.subEventId === finalId);
    if (!preparedFinal || Q.text(preparedFinal.stageStatus).toUpperCase() !== "RS"
        || !preparedRuntime || Q.text(preparedRuntime.stageStatus).toUpperCase() !== "RS"
        || !sameJson(preparedDomain.finalRooms, domain.finalRooms)
        || !sameJson(preparedDomain.finalGroups, domain.finalGroups)
        || !sameJson(preparedDomain.finalGroupMembers, domain.finalGroupMembers)
        || !sameJson(preparedDomain.chats, domain.chats)
        || !sameJson(preparedDomain.planMarkers, domain.planMarkers)
        || tournamentFinalLifecycleNotificationSnapshot().outbox.length !== 0
        || tournamentFinalLifecycleNotificationSnapshot().notifications.length !== 0) {
      Q.fail("the focused Final Start recipient replay did not preserve the proven room/domain boundary.");
    }
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: {
        "tournamentFinalLifecycle.startRecipientRetestPreparedAtIso": preparedAtIso,
        "tournamentFinalLifecycle.startRecipientRetestDomainBaseline": domain,
        "tournamentFinalLifecycle.startRecipientRetestFailedNotifications": notifications
      }
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "tournament-final-start-recipient-retest-prepared",
      preparedAtIso,
      finalStatus: preparedFinal.stageStatus,
      retainedFinalRoomIds: preparedDomain.finalRooms.map(room => room.eventId),
      retainedFinalMemberUserIds: actualFinalUsers,
      removedRecipientUserIds: [participantUserId, thirdUserId].sort(),
      next: "Reload Casey once, verify Final is Blocked because its RS start instant has passed and Start Stage is available, then perform Final Start exactly once."
    });
  }

  function recoverTournamentFinalStartRecipientRetestAfterSeedReset() {
    config();
    if (checkpointId !== "TOURNAMENT-004") {
      Q.fail("recover-tournament-final-start-recipient-retest-after-seed-reset is restricted to TOURNAMENT-004.");
    }
    const state = requireMatchingState();
    const lifecycle = state.tournamentFinalLifecycle;
    if (!lifecycle
        || !lifecycle.preparedAtIso
        || !lifecycle.startWindowPreparedAtIso
        || !lifecycle.startRecipientRetestPreparedAtIso
        || !lifecycle.domainBaseline
        || !lifecycle.priorNotificationBaseline
        || !lifecycle.startRecipientRetestDomainBaseline) {
      Q.fail("TOURNAMENT-004 has no complete, previously proven recipient-retest oracle to recover.");
    }
    if (lifecycle.cleanStartRetestPreparedAtIso) {
      Q.fail("TOURNAMENT-004 clean Final Start retest is already prepared; do not rebuild it again.");
    }
    const discardedFailedReplay = lifecycle.startVerifiedAtIso
      ? {
          capturedAtIso: Q.nowIso(),
          verifiedAtIso: lifecycle.startVerifiedAtIso,
          domain: tournamentReviewStableSnapshot(),
          lifecycleNotifications: tournamentFinalLifecycleNotificationSnapshot(),
          priorNotifications: tournamentFinalizeNotificationSnapshot()
        }
      : null;
    const existingEvent = Q.collection("events").findOne(manualEventSelector());
    if (existingEvent) {
      if (lifecycle.startVerifiedAtIso) {
        const currentFinal = discardedFailedReplay.domain.stages
          .find(stage => stage.id === `${EVENT_ID}:stage:final`);
        const currentStarted = discardedFailedReplay.lifecycleNotifications.outbox
          .filter(item => item.type === "event-tournament-started");
        if (!currentFinal
            || currentFinal.stageStatus !== "A"
            || currentFinal.stageStatusReason !== "tournament-started"
            || currentStarted.length !== 1
            || !sameJson(currentStarted[0].recipientUserIds, [thirdUserId])) {
          Q.fail("the failed T004 replay is not the exact previously verified Final-start boundary; clean rebuild is forbidden.");
        }
      } else if (lifecycle.seedResetRecoveryAtIso) {
        Q.printObject({
          scenario: SCENARIO,
          checkpointId,
          phase: "tournament-final-start-seed-reset-recovery-already-applied",
          recoveredAtIso: lifecycle.seedResetRecoveryAtIso,
          next: "Run status. Do not recover or replay the closed Qualifiers branches again."
        });
        return;
      } else {
        const partialDomain = tournamentReviewStableSnapshot();
        const partialPrior = tournamentFinalizeNotificationSnapshot();
        if (Q.text(existingEvent.createdUser) !== Q.ACTOR
            || partialDomain.finalGroupMembers.length !== 0
            || partialPrior.outbox.length !== 0
            || partialPrior.advancementOutbox.length !== 0
            || partialPrior.notAdvancingOutbox.length !== 0) {
          Q.fail("the retained tournament event still exists and is not an identifiable partial seed-reset recovery; recovery is forbidden.");
        }
      }
    }
    const retainedSnapshotDocuments = (state.snapshots || [])
      .reduce((count, snapshot) => count + (snapshot.documents || []).length, 0);
    if (retainedSnapshotDocuments < 1) {
      Q.fail("the retained T004 reset snapshot is missing; recovery would not have a safe later reset path.");
    }

    const qualifierId = `${EVENT_ID}:stage:qualifiers`;
    const finalId = `${EVENT_ID}:stage:final`;
    const finalGroupId = `${finalId}:group:1`;
    const expectedFinalUsers = sortedUnique(lifecycle.expectedFinalUserIds || []);
    if (!sameJson(expectedFinalUsers, [hostUserId, thirdUserId].sort())) {
      Q.fail("the saved T004 Final audience is not the exact Casey+Riley boundary.");
    }

    clearFixture();
    const recoveredAtIso = Q.nowIso();
    insertTournamentReviewBaseline(recoveredAtIso);

    const event = Q.collection("events").findOne(manualEventSelector());
    if (!event || Q.text(event.title) !== activeExpectedTitle()) {
      Q.fail("the restart recovery did not recreate the retained QA TOURNAMENT-003 event identity.");
    }
    const startAt = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    const endAt = new Date(Date.now() + 120 * 60 * 1000).toISOString();
    const savedQualifier = (lifecycle.domainBaseline.stages || [])
      .find(stage => stage.id === qualifierId);
    if (!savedQualifier
        || Q.text(savedQualifier.stageStatus).toUpperCase() !== "F"
        || savedQualifier.stageFinalizedByUserId !== hostUserId) {
      Q.fail("the saved closed Qualifiers oracle is incomplete.");
    }
    const recoverStages = stages => (stages || []).map(stage => {
      if (Q.text(stage.id) === qualifierId) {
        return {
          ...stage,
          stageStatus: "F",
          stageStatusReason: "stage-finalized",
          stageStatusUpdatedAt: savedQualifier.stageFinalizedAt,
          stageFinalizedAt: savedQualifier.stageFinalizedAt,
          stageFinalizedByUserId: hostUserId,
          groupsCount: 0,
          groupsPending: 0
        };
      }
      if (Q.text(stage.id) === finalId) {
        return {
          ...stage,
          startAt,
          endAt,
          stageStatus: "RS",
          stageStatusReason: "awaiting-prior-stage",
          stageStatusUpdatedAt: null,
          stageFinalizedAt: null,
          stageFinalizedByUserId: null,
          membersAccepted: 2,
          membersPending: 0,
          groupsCount: 0,
          groupsPending: 0
        };
      }
      return stage;
    });
    const eventUpdate = Q.collection("events").updateOne(
      { _id: event._id, sourceId: EVENT_ID },
      {
        $set: {
          title: activeExpectedTitle(),
          subEvents: recoverStages(event.subEvents),
          subEventDefinitions: recoverStages(event.subEventDefinitions),
          updatedDate: recoveredAtIso,
          updatedUser: Q.ACTOR
        }
      }
    );
    const qualifierRuntimeUpdate = Q.collection("activitySubEventStageRuntime").updateOne(
      { ownerId: EVENT_ID, subEventId: qualifierId },
      {
        $set: {
          stageStatus: "F",
          stageStatusReason: "stage-finalized",
          stageStatusUpdatedAt: savedQualifier.stageFinalizedAt,
          stageFinalizedAt: savedQualifier.stageFinalizedAt,
          stageFinalizedByUserId: hostUserId,
          groupsCount: 2,
          updatedDate: recoveredAtIso,
          updatedUser: Q.ACTOR
        }
      }
    );
    if (eventUpdate.matchedCount !== 1 || qualifierRuntimeUpdate.matchedCount !== 1) {
      Q.fail("the recovered event or closed Qualifiers runtime was not written exactly once.");
    }
    Q.collection("activitySubEventStageRuntime").insertOne({
      _id: `${PREFIX}:stage-runtime:tournament-review-final`,
      syncKey: `${PREFIX}:stage-runtime:tournament-review-final`,
      recordId: `${EVENT_ID}:${finalId}`,
      status: "A",
      ownerId: EVENT_ID,
      subEventId: finalId,
      stageStatus: "RS",
      stageStatusReason: "awaiting-prior-stage",
      stageStatusUpdatedAt: null,
      stageFinalizedAt: null,
      stageFinalizedByUserId: null,
      groupsCount: 1,
      groupResourceMetricsByAssetOwnerId: {},
      createdDate: recoveredAtIso,
      createdUser: Q.ACTOR,
      updatedDate: recoveredAtIso,
      updatedUser: Q.ACTOR
    });
    Q.collection("activityMembers").insertMany(expectedFinalUsers.map(userId => {
      const member = memberDocument(finalGroupId, userId, "Member", "accepted");
      const id = `${PREFIX}:member:final-group:${userId}`;
      return {
        ...member,
        _id: id,
        syncKey: id,
        ownerType: "group"
      };
    }));
    const savedMarker = (lifecycle.domainBaseline.planMarkers || [])[0];
    if (!savedMarker
        || savedMarker.ownerId !== finalGroupId
        || !sameJson(sortedUnique(savedMarker.userIds || []), expectedFinalUsers)) {
      Q.fail("the saved Final assignment marker is incomplete.");
    }
    Q.collection("schedulerPlanMarkers").insertOne({
      _id: `${PREFIX}:tournament-review:final-group-marker`,
      syncKey: `${PREFIX}:tournament-review:final-group-marker`,
      wrapperType: "score",
      actionType: "group-members",
      ownerId: savedMarker.ownerId,
      scopeId: savedMarker.scopeId,
      fingerprint: savedMarker.fingerprint,
      userIds: expectedFinalUsers,
      createdDate: recoveredAtIso,
      createdUser: Q.ACTOR,
      updatedDate: recoveredAtIso,
      updatedUser: Q.ACTOR
    });

    const prior = lifecycle.priorNotificationBaseline;
    const savedPriorOutboxCount = (prior.outbox || []).length
      + (prior.advancementOutbox || []).length
      + (prior.notAdvancingOutbox || []).length;
    const savedPriorInboxCount = (prior.notifications || []).length
      + (prior.advancementNotifications || []).length
      + (prior.notAdvancingNotifications || []).length;
    if (savedPriorOutboxCount !== 3 || savedPriorInboxCount !== 5) {
      Q.fail("the saved T003 notification split is not the expected three intents and five inbox rows.");
    }

    const recoveredCounters = lifecycle.domainBaseline.counters || [];
    for (const userId of [hostUserId, participantUserId, thirdUserId]) {
      const saved = recoveredCounters.find(item => item.userId === userId);
      if (!saved) Q.fail(`the saved restart counter oracle is missing '${userId}'.`);
      const counterUpdate = Q.collection("users").updateOne(
        { $or: [{ _id: userId }, { userId }] },
        { $set: {
          "activities.events": Number(saved.events || 0),
          "activities.hosting": Number(saved.hosting || 0),
          "activities.chats": Number(saved.chats || 0),
          "activities.event": saved.event || {},
          "activities.chat": saved.chat || {},
          "activities.notifications": 0
        } }
      );
      if (counterUpdate.matchedCount !== 1) {
        Q.fail(`restart recovery counter target '${userId}' disappeared.`);
      }
    }

    const domain = tournamentReviewStableSnapshot();
    const qualifier = domain.stages.find(stage => stage.id === qualifierId);
    const finalStage = domain.stages.find(stage => stage.id === finalId);
    const qualifierRuntime = domain.stageRuntime.find(stage => stage.subEventId === qualifierId);
    const finalRuntime = domain.stageRuntime.find(stage => stage.subEventId === finalId);
    const actualFinalUsers = sortedUnique(domain.finalGroupMembers
      .filter(member => Q.text(member.status).toLowerCase() === "accepted")
      .map(member => member.userId));
    const emptyPriorNotifications = {
      outbox: [],
      notifications: [],
      advancementOutbox: [],
      advancementNotifications: [],
      notAdvancingOutbox: [],
      notAdvancingNotifications: []
    };
    const livePriorNotifications = tournamentFinalizeNotificationSnapshot();
    const liveLifecycleNotifications = tournamentFinalLifecycleNotificationSnapshot();
    const orphanedReadyOutboxCount = Q.collection("notificationOutbox").countDocuments({
      notificationType: "event-random-groups",
      "payload.parentEventId": EVENT_ID,
      "payload.eventScope": "tournament-room"
    });
    const orphanedReadyInboxCount = Q.collection("userNotifications").countDocuments({
      kind: "event-random-groups",
      "payload.parentEventId": EVENT_ID,
      "payload.eventScope": "tournament-room"
    });
    if (!qualifier || qualifier.stageStatus !== "F"
        || !qualifierRuntime || qualifierRuntime.stageStatus !== "F"
        || !finalStage || finalStage.stageStatus !== "RS"
        || finalStage.stageStatusReason !== "awaiting-prior-stage"
        || !finalRuntime || finalRuntime.stageStatus !== "RS"
        || domain.finalGroups.length !== 1
        || !sameJson(actualFinalUsers, expectedFinalUsers)
        || actualFinalUsers.includes(participantUserId)
        || domain.finalRooms.length !== 0
        || domain.chats.length !== 0
        || domain.planMarkers.length !== 1
        || domain.outboxIntents.length !== 0
        || !sameJson(domain.leaderboard, lifecycle.domainBaseline.leaderboard)
        || !sameJson(livePriorNotifications, emptyPriorNotifications)
        || liveLifecycleNotifications.outbox.length !== 0
        || liveLifecycleNotifications.notifications.length !== 0
        || orphanedReadyOutboxCount !== 0
        || orphanedReadyInboxCount !== 0) {
      Q.fail("the recovery did not recreate a clean Final-RS boundary without historical or orphaned notification records.");
    }

    const stateUpdate = Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: {
        "tournamentFinalLifecycle.seedResetRecoveryAtIso": recoveredAtIso,
        "tournamentFinalLifecycle.seedResetRecoveryDomainBaseline": domain,
        "tournamentFinalLifecycle.cleanStartRetestPreparedAtIso": recoveredAtIso,
        "tournamentFinalLifecycle.startRecipientRetestDomainBaseline": domain,
        "tournamentFinalLifecycle.priorNotificationsLiveRestored": false,
        "tournamentFinalLifecycle.discardedFailedStartReplay": discardedFailedReplay,
        "tournamentFinalLifecycle.startWindowPreparedAtIso": recoveredAtIso,
        "tournamentFinalLifecycle.startWindowStartAt": startAt,
        "tournamentFinalLifecycle.startWindowEndAt": endAt
      },
      $unset: {
        "tournamentFinalLifecycle.startVerifiedAtIso": "",
        "tournamentFinalLifecycle.startDomain": "",
        "tournamentFinalLifecycle.startNotifications": ""
      }
    });
    if (stateUpdate.matchedCount !== 1 || stateUpdate.modifiedCount !== 1) {
      Q.fail("the guarded clean T004 replay metadata was not applied exactly once.");
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "tournament-final-start-clean-retest-prepared",
      recoveredAtIso,
      eventTitle: activeExpectedTitle(),
      qualifierStatus: qualifier.stageStatus,
      finalStatus: finalStage.stageStatus,
      finalMemberUserIds: actualFinalUsers,
      livePriorNotificationCount: 0,
      liveLifecycleNotificationCount: 0,
      liveTournamentRoomReadyNotificationCount: 0,
      startAt,
      endAt,
      next: "Reload the three existing actors, then Casey performs only Final -> Start Stage -> Start once. Do not replay Qualifiers."
    });
  }

  function prepareTournamentFinalizeNotificationRetest() {
    if (checkpointId !== "TOURNAMENT-003") {
      Q.fail("prepare-tournament-finalize-notification-retest is restricted to TOURNAMENT-003.");
    }
    const state = requireMatchingState();
    if (Number(state.tournamentReviewArmCount || 0) !== 2
        || !state.tournamentReviewNoopBaseline) {
      Q.fail("the exact first-pass advancement and second-pass no-op must be proven before the focused notification replay.");
    }
    if (state.tournamentFinalizeNotificationRetest
        && !state.tournamentFinalizeNotificationRetest.verifiedAtIso) {
      Q.fail("the focused Finalize notification replay is already prepared; do not rewind it again.");
    }

    const current = tournamentReviewStableSnapshot();
    const qualifierId = `${EVENT_ID}:stage:qualifiers`;
    const qualifier = current.stages.find(stage => stage.id === qualifierId);
    const runtime = current.stageRuntime.find(stage => stage.subEventId === qualifierId);
    const expectedWinners = [hostUserId, thirdUserId].sort();
    const actualWinners = sortedUnique(current.finalGroupMembers
      .filter(member => Q.text(member.status).toLowerCase() === "accepted")
      .map(member => member.userId));
    if (!qualifier || Q.text(qualifier.stageStatus).toUpperCase() !== "F"
        || !runtime || Q.text(runtime.stageStatus).toUpperCase() !== "F"
        || current.finalGroups.length !== 1
        || !sameJson(actualWinners, expectedWinners)
        || current.planMarkers.length !== 1) {
      Q.fail("TOURNAMENT-003 is not at the proven finalized/no-op boundary required for the focused notification replay.");
    }

    const notificationBefore = tournamentFinalizeNotificationSnapshot();
    if (notificationBefore.outbox.length !== 1
        || !sameJson(
          notificationBefore.outbox[0].recipientUserIds,
          [hostUserId, participantUserId, thirdUserId].sort())) {
      Q.fail("the original defective Finalize outbox is not the exact three-recipient evidence expected before repair replay.");
    }

    const preparedAtIso = Q.nowIso();
    const eventUpdate = Q.collection("events").updateOne(
      manualEventSelector(),
      {
        $set: {
          "subEvents.$[qualifier].stageStatus": "SR",
          "subEvents.$[qualifier].stageStatusReason": "stage-ended",
          "subEvents.$[qualifier].stageStatusUpdatedAt": preparedAtIso,
          "subEvents.$[qualifier].stageFinalizedAt": null,
          "subEvents.$[qualifier].stageFinalizedByUserId": null,
          updatedDate: preparedAtIso,
          updatedUser: Q.ACTOR
        }
      },
      { arrayFilters: [{ "qualifier.id": qualifierId }] }
    );
    const runtimeUpdate = Q.collection("activitySubEventStageRuntime").updateOne(
      { ownerId: EVENT_ID, subEventId: qualifierId },
      {
        $set: {
          stageStatus: "SR",
          stageStatusReason: "stage-ended",
          stageStatusUpdatedAt: preparedAtIso,
          stageFinalizedAt: null,
          stageFinalizedByUserId: null,
          updatedDate: preparedAtIso,
          updatedUser: Q.ACTOR
        }
      }
    );
    if (eventUpdate.matchedCount !== 1 || eventUpdate.modifiedCount !== 1
        || runtimeUpdate.matchedCount !== 1 || runtimeUpdate.modifiedCount !== 1) {
      Q.fail("the Qualifiers event/runtime projection could not be rewound exactly once.");
    }

    const outboxRemoval = Q.collection("notificationOutbox").deleteMany({
      notificationType: "event-stage-finalized",
      $or: [{ entityId: EVENT_ID }, { "payload.eventId": EVENT_ID }]
    });
    const notificationRemoval = Q.collection("userNotifications").deleteMany({
      kind: "event-stage-finalized",
      $or: [{ sourceId: EVENT_ID }, { "payload.eventId": EVENT_ID }]
    });
    if (outboxRemoval.deletedCount !== 1
        || notificationRemoval.deletedCount !== notificationBefore.notifications.length) {
      Q.fail("the original Finalize notification artifacts changed while the focused replay was being prepared.");
    }

    for (const userId of [hostUserId, participantUserId, thirdUserId]) {
      const unreadNotifications = Q.collection("userNotifications").countDocuments({
        recipientUserId: userId,
        $or: [{ readAtIso: { $exists: false } }, { readAtIso: null }]
      });
      const counterUpdate = Q.collection("users").updateOne(
        { $or: [{ _id: userId }, { userId }] },
        { $set: { "activities.notifications": unreadNotifications } }
      );
      if (counterUpdate.matchedCount !== 1) {
        Q.fail(`notification counter target '${userId}' disappeared during the focused replay preparation.`);
      }
    }

    const reviewRule = tournamentReviewRule();
    const heldUntilIso = dateIso(60);
    const held = Q.collection("notificationRuleConfigs").updateOne(
      { ruleKey: TOURNAMENT_REVIEW_RULE },
      {
        $set: {
          enabled: true,
          "runState.currentStatus": "idle",
          "runState.lastRunAtIso": heldUntilIso,
          "runState.progressPercent": 0,
          "runState.progressDetail": "Held during TOURNAMENT-003 focused Finalize notification replay.",
          updatedDate: preparedAtIso,
          updatedUser: Q.ACTOR
        },
        $unset: {
          "runState.startedAtIso": "",
          "runState.finishedAtIso": ""
        }
      }
    );
    if (!reviewRule || held.matchedCount !== 1) {
      Q.fail(`notification rule '${TOURNAMENT_REVIEW_RULE}' disappeared while the focused replay was prepared.`);
    }

    const preserved = tournamentReviewStableSnapshot();
    const preservedWinners = sortedUnique(preserved.finalGroupMembers
      .filter(member => Q.text(member.status).toLowerCase() === "accepted")
      .map(member => member.userId));
    if (!sameJson(preservedWinners, expectedWinners)
        || preserved.finalGroups.length !== 1
        || preserved.planMarkers.length !== 1
        || preserved.leaderboard.length !== current.leaderboard.length) {
      Q.fail("the focused notification replay preparation changed previously proven advancement or score evidence.");
    }

    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: {
        tournamentFinalizeNotificationRetest: {
          preparedAtIso,
          heldUntilIso,
          originalNotification: notificationBefore,
          preservedFinalGroupOwnerIds: preserved.finalGroups.map(group => group.ownerId),
          preservedFinalMemberUserIds: preservedWinners
        }
      }
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "tournament-finalize-notification-retest-prepared",
      qualifierStageStatus: "SR",
      preservedFinalMemberUserIds: preservedWinners,
      removedOutboxCount: outboxRemoval.deletedCount,
      removedNotificationCount: notificationRemoval.deletedCount,
      next: "Reload only Casey's event detail, manually Finalize Qualifiers once, then run verify-tournament-finalize-notification. Do not rerun tournament review."
    });
  }

  function verifyTournamentFinalizeNotification() {
    if (checkpointId !== "TOURNAMENT-003") {
      Q.fail("verify-tournament-finalize-notification is restricted to TOURNAMENT-003.");
    }
    const state = requireMatchingState();
    const replay = state.tournamentFinalizeNotificationRetest;
    if (!replay || !replay.preparedAtIso) {
      Q.fail("the focused Finalize notification replay has not been prepared.");
    }
    if (replay.verifiedAtIso) {
      Q.fail("the focused Finalize notification replay is already verified; do not execute it again.");
    }

    const current = tournamentReviewStableSnapshot();
    const qualifierId = `${EVENT_ID}:stage:qualifiers`;
    const qualifier = current.stages.find(stage => stage.id === qualifierId);
    const runtime = current.stageRuntime.find(stage => stage.subEventId === qualifierId);
    const expectedWinners = [hostUserId, thirdUserId].sort();
    const actualWinners = sortedUnique(current.finalGroupMembers
      .filter(member => Q.text(member.status).toLowerCase() === "accepted")
      .map(member => member.userId));
    if (!qualifier || Q.text(qualifier.stageStatus).toUpperCase() !== "F"
        || !runtime || Q.text(runtime.stageStatus).toUpperCase() !== "F"
        || current.finalGroups.length !== 1
        || !sameJson(actualWinners, expectedWinners)
        || current.planMarkers.length !== 1) {
      Q.fail("the focused manual Finalize did not preserve the proven stage/group boundary.");
    }

    const notification = tournamentFinalizeNotificationSnapshot();
    const expectedRecipients = [participantUserId, thirdUserId].sort();
    if (notification.outbox.length !== 1
        || !sameJson(notification.outbox[0].recipientUserIds, expectedRecipients)) {
      Q.fail("manual Finalize did not persist exactly one Nova+Riley outbox with Casey excluded.");
    }
    const actualNotificationRecipients = notification.notifications
      .map(item => item.recipientUserId)
      .sort();
    if (notification.notifications.length > 0
        && !sameJson(actualNotificationRecipients, expectedRecipients)) {
      Q.fail("delivered Finalize notifications do not target exactly Nova and Riley with Casey excluded.");
    }

    const verifiedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: {
        "tournamentFinalizeNotificationRetest.verifiedAtIso": verifiedAtIso,
        "tournamentFinalizeNotificationRetest.verifiedNotification": notification
      }
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "tournament-finalize-notification-verified",
      actorUserId: hostUserId,
      recipientUserIds: expectedRecipients,
      outbox: notification.outbox,
      notifications: notification.notifications,
      next: notification.notifications.length === 2
        ? "Compare Casey/Nova/Riley live notification counters and lists, then close TOURNAMENT-003."
        : "Wait for the existing notification-outbox worker, run status, then compare the three live notification counters and lists."
    });
  }

  function prepareTournamentNotificationSequenceRetest() {
    if (checkpointId !== "TOURNAMENT-003") {
      Q.fail("prepare-tournament-notification-sequence-retest is restricted to TOURNAMENT-003.");
    }
    const state = requireMatchingState();
    const previousReplay = state.tournamentFinalizeNotificationRetest;
    if (!previousReplay || !previousReplay.verifiedAtIso) {
      Q.fail("the actor-exclusion Finalize replay must be verified before the ordered notification sequence replay.");
    }
    if (state.tournamentNotificationSequenceRetest
        && !state.tournamentNotificationSequenceRetest.verifiedAtIso) {
      Q.fail("the ordered tournament notification sequence replay is already active.");
    }
    const expectedTranslations = {
      "en:notification.event.stage.started.title": "{stageTitle} started",
      "en:notification.event.stage.started.message": "{stageTitle} has started. Groups are ready.",
      "en:notification.event.stage.finalized.title": "{stageTitle} finalized",
      "en:notification.event.stage.finalized.message": "{stageTitle} has been finalized.",
      "en:notification.event.stage.advanced.title": "Advanced to {nextStageTitle}",
      "en:notification.event.stage.advanced.message": "You advanced from {stageTitle} to {nextStageTitle}.",
      "en:notification.event.stage.not-advanced.title": "Did not advance from {stageTitle}",
      "en:notification.event.stage.not-advanced.message": "You did not advance from {stageTitle} to {nextStageTitle}.",
      "en:notification.event.tournament.finalized.title": "Tournament finalized",
      "en:notification.event.tournament.finalized.message": "{stageTitle} is complete. The tournament has been finalized. Open the event results to review the standings.",
      "en:notification.event.tournament.finalized.message.winner": "{stageTitle} is complete. The tournament has been finalized. Winner: {winnerNames}.",
      "en:notification.event.tournament.finalized.message.winners": "{stageTitle} is complete. The tournament has been finalized. Winners: {winnerNames}.",
      "hu:notification.event.stage.started.title": "Elindult: {stageTitle}",
      "hu:notification.event.stage.started.message": "A(z) {stageTitle} szakasz elindult. A csoportok elkészültek.",
      "hu:notification.event.stage.finalized.title": "Lezárult: {stageTitle}",
      "hu:notification.event.stage.finalized.message": "A(z) {stageTitle} szakasz lezárult.",
      "hu:notification.event.stage.advanced.title": "Továbbjutottál: {nextStageTitle}",
      "hu:notification.event.stage.advanced.message": "Továbbjutottál a(z) {stageTitle} szakaszból a(z) {nextStageTitle} szakaszba.",
      "hu:notification.event.stage.not-advanced.title": "Nem jutottál tovább: {stageTitle}",
      "hu:notification.event.stage.not-advanced.message": "Nem jutottál tovább a(z) {stageTitle} szakaszból a(z) {nextStageTitle} szakaszba.",
      "hu:notification.event.tournament.finalized.title": "A verseny lezárult",
      "hu:notification.event.tournament.finalized.message": "A(z) {stageTitle} szakasz lezárult. A teljes verseny véget ért. Nyisd meg az eredményeket a helyezések megtekintéséhez.",
      "hu:notification.event.tournament.finalized.message.winner": "A(z) {stageTitle} szakasz lezárult. A teljes verseny véget ért. Győztes: {winnerNames}.",
      "hu:notification.event.tournament.finalized.message.winners": "A(z) {stageTitle} szakasz lezárult. A teljes verseny véget ért. Győztesek: {winnerNames}."
    };
    const translationKeys = [...new Set(Object.keys(expectedTranslations)
      .map(item => item.substring(item.indexOf(":") + 1)))];
    const liveTranslations = Q.collection("i18n_messages").find({
      lang: { $in: ["en", "hu"] },
      key: { $in: translationKeys }
    }).toArray();
    const actualTranslations = Object.fromEntries(liveTranslations.map(item => [
      `${Q.text(item.lang)}:${Q.text(item.key)}`,
      Q.text(item.value)
    ]));
    if (liveTranslations.length !== Object.keys(expectedTranslations).length
        || Object.entries(expectedTranslations)
          .some(([key, value]) => actualTranslations[key] !== value)) {
      Q.fail("the live Mongo EN/HU tournament notification translations do not match the replay contract.");
    }

    const current = tournamentReviewStableSnapshot();
    const qualifierId = `${EVENT_ID}:stage:qualifiers`;
    const finalGroupOwnerId = `${EVENT_ID}:stage:final:group:1`;
    const qualifier = current.stages.find(stage => stage.id === qualifierId);
    const runtime = current.stageRuntime.find(stage => stage.subEventId === qualifierId);
    const expectedWinners = [hostUserId, thirdUserId].sort();
    const actualWinners = sortedUnique(current.finalGroupMembers
      .filter(member => Q.text(member.status).toLowerCase() === "accepted")
      .map(member => member.userId));
    const notificationBefore = tournamentFinalizeNotificationSnapshot();
    if (!qualifier || Q.text(qualifier.stageStatus).toUpperCase() !== "F"
        || !runtime || Q.text(runtime.stageStatus).toUpperCase() !== "F"
        || current.finalGroups.length !== 1
        || !sameJson(actualWinners, expectedWinners)
        || current.planMarkers.length !== 1
        || notificationBefore.outbox.length !== 1
        || !sameJson(notificationBefore.outbox[0].recipientUserIds, [participantUserId, thirdUserId].sort())
        || notificationBefore.advancementOutbox.length !== 0
        || notificationBefore.notAdvancingOutbox.length !== 0) {
      Q.fail("TOURNAMENT-003 is not at the proven Finalize/group boundary required for the ordered notification replay.");
    }

    const preparedAtIso = Q.nowIso();
    const eventUpdate = Q.collection("events").updateOne(
      manualEventSelector(),
      {
        $set: {
          "subEvents.$[qualifier].stageStatus": "SR",
          "subEvents.$[qualifier].stageStatusReason": "stage-ended",
          "subEvents.$[qualifier].stageStatusUpdatedAt": preparedAtIso,
          "subEvents.$[qualifier].stageFinalizedAt": null,
          "subEvents.$[qualifier].stageFinalizedByUserId": null,
          updatedDate: preparedAtIso,
          updatedUser: Q.ACTOR
        }
      },
      { arrayFilters: [{ "qualifier.id": qualifierId }] }
    );
    const runtimeUpdate = Q.collection("activitySubEventStageRuntime").updateOne(
      { ownerId: EVENT_ID, subEventId: qualifierId },
      {
        $set: {
          stageStatus: "SR",
          stageStatusReason: "stage-ended",
          stageStatusUpdatedAt: preparedAtIso,
          stageFinalizedAt: null,
          stageFinalizedByUserId: null,
          updatedDate: preparedAtIso,
          updatedUser: Q.ACTOR
        }
      }
    );
    if (eventUpdate.matchedCount !== 1 || eventUpdate.modifiedCount !== 1
        || runtimeUpdate.matchedCount !== 1 || runtimeUpdate.modifiedCount !== 1) {
      Q.fail("the ordered replay could not rewind the Qualifiers event/runtime pair exactly once.");
    }

    const finalizedOutboxRemoval = Q.collection("notificationOutbox").deleteMany({
      notificationType: "event-stage-finalized",
      $or: [{ entityId: EVENT_ID }, { "payload.eventId": EVENT_ID }]
    });
    const finalizedNotificationRemoval = Q.collection("userNotifications").deleteMany({
      kind: "event-stage-finalized",
      $or: [{ sourceId: EVENT_ID }, { "payload.eventId": EVENT_ID }]
    });
    const advancementOutboxRemoval = Q.collection("notificationOutbox").deleteMany({
      notificationType: "event-stage-advanced",
      $or: [{ entityId: EVENT_ID }, { "payload.eventId": EVENT_ID }]
    });
    const advancementNotificationRemoval = Q.collection("userNotifications").deleteMany({
      kind: "event-stage-advanced",
      $or: [{ sourceId: EVENT_ID }, { "payload.eventId": EVENT_ID }]
    });
    const notAdvancingOutboxRemoval = Q.collection("notificationOutbox").deleteMany({
      notificationType: "event-stage-not-advanced",
      $or: [{ entityId: EVENT_ID }, { "payload.eventId": EVENT_ID }]
    });
    const notAdvancingNotificationRemoval = Q.collection("userNotifications").deleteMany({
      kind: "event-stage-not-advanced",
      $or: [{ sourceId: EVENT_ID }, { "payload.eventId": EVENT_ID }]
    });
    const finalMemberRemoval = Q.collection("activityMembers").deleteMany({
      ownerType: "group",
      ownerId: finalGroupOwnerId,
      userId: { $in: expectedWinners }
    });
    const markerRemoval = Q.collection("schedulerPlanMarkers").deleteMany({
      wrapperType: "score",
      actionType: "group-members",
      ownerId: finalGroupOwnerId
    });
    if (finalizedOutboxRemoval.deletedCount !== 1
        || finalizedNotificationRemoval.deletedCount !== notificationBefore.notifications.length
        || advancementOutboxRemoval.deletedCount !== 0
        || advancementNotificationRemoval.deletedCount !== 0
        || notAdvancingOutboxRemoval.deletedCount !== 0
        || notAdvancingNotificationRemoval.deletedCount !== 0
        || finalMemberRemoval.deletedCount !== 2
        || markerRemoval.deletedCount !== 1) {
      Q.fail("the ordered replay artifacts changed while the fixture boundary was being rewound.");
    }

    for (const userId of [hostUserId, participantUserId, thirdUserId]) {
      const unreadNotifications = Q.collection("userNotifications").countDocuments({
        recipientUserId: userId,
        $or: [{ readAtIso: { $exists: false } }, { readAtIso: null }]
      });
      const counterUpdate = Q.collection("users").updateOne(
        { $or: [{ _id: userId }, { userId }] },
        { $set: { "activities.notifications": unreadNotifications } }
      );
      if (counterUpdate.matchedCount !== 1) {
        Q.fail(`notification counter target '${userId}' disappeared during ordered replay preparation.`);
      }
    }

    const heldUntilIso = dateIso(60);
    const reviewRule = tournamentReviewRule();
    const held = Q.collection("notificationRuleConfigs").updateOne(
      { ruleKey: TOURNAMENT_REVIEW_RULE },
      {
        $set: {
          enabled: true,
          "runState.currentStatus": "idle",
          "runState.lastRunAtIso": heldUntilIso,
          "runState.progressPercent": 0,
          "runState.progressDetail": "Held during TOURNAMENT-003 ordered notification replay.",
          updatedDate: preparedAtIso,
          updatedUser: Q.ACTOR
        },
        $unset: {
          "runState.startedAtIso": "",
          "runState.finishedAtIso": ""
        }
      }
    );
    if (!reviewRule || held.matchedCount !== 1) {
      Q.fail(`notification rule '${TOURNAMENT_REVIEW_RULE}' disappeared while the ordered replay was prepared.`);
    }

    const prepared = tournamentReviewStableSnapshot();
    if (prepared.finalGroupMembers.length !== 0
        || prepared.planMarkers.length !== 0
        || prepared.leaderboard.length !== current.leaderboard.length) {
      Q.fail("the ordered replay did not preserve scores while clearing only the reproducible advancement write.");
    }
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: {
        tournamentNotificationSequenceRetest: {
          preparedAtIso,
          heldUntilIso,
          baselineNotification: notificationBefore,
          expectedWinnerUserIds: expectedWinners,
          expectedFinalGroupOwnerId: finalGroupOwnerId,
          leaderboardBaseline: current.leaderboard
        }
      }
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "tournament-notification-sequence-retest-prepared",
      qualifierStageStatus: "SR",
      removedFinalMemberUserIds: expectedWinners,
      removedPlanMarkerCount: markerRemoval.deletedCount,
      next: "Reload only Casey's event detail and manually Finalize Qualifiers once. Do not run the tournament worker manually."
    });
  }

  function verifyTournamentFinalizeSequence() {
    if (checkpointId !== "TOURNAMENT-003") {
      Q.fail("verify-tournament-finalize-sequence is restricted to TOURNAMENT-003.");
    }
    const state = requireMatchingState();
    const replay = state.tournamentNotificationSequenceRetest;
    if (!replay || !replay.preparedAtIso || replay.finalizeVerifiedAtIso) {
      Q.fail("the ordered replay is not prepared or its Finalize phase is already verified.");
    }
    const current = tournamentReviewStableSnapshot();
    const qualifierId = `${EVENT_ID}:stage:qualifiers`;
    const qualifier = current.stages.find(stage => stage.id === qualifierId);
    const runtime = current.stageRuntime.find(stage => stage.subEventId === qualifierId);
    if (!qualifier || Q.text(qualifier.stageStatus).toUpperCase() !== "F"
        || !runtime || Q.text(runtime.stageStatus).toUpperCase() !== "F"
        || current.finalGroupMembers.length !== 0
        || current.planMarkers.length !== 0
        || !sameJson(current.leaderboard, replay.leaderboardBaseline)) {
      Q.fail("manual Finalize did not preserve the staged pre-advancement boundary.");
    }
    const notifications = tournamentFinalizeNotificationSnapshot();
    const finalizedRecipients = [participantUserId, thirdUserId].sort();
    if (notifications.outbox.length !== 1
        || !sameJson(notifications.outbox[0].recipientUserIds, finalizedRecipients)
        || notifications.outbox[0].notificationTitleKey !== "notification.event.stage.finalized.title"
        || notifications.outbox[0].notificationMessageKey !== "notification.event.stage.finalized.message"
        || notifications.outbox[0].notificationAvatarTone !== ""
        || notifications.outbox[0].notificationAvatarIcon !== ""
        || notifications.outbox[0].stageIndex !== "1"
        || notifications.outbox[0].stageTotal !== "2"
        || notifications.outbox[0].stageTitle !== "Qualifiers"
        || notifications.advancementOutbox.length !== 0
        || notifications.notAdvancingOutbox.length !== 0) {
      Q.fail("manual Finalize did not write the translated Nova+Riley stage-finalized intent before advancement.");
    }
    const deliveredRecipients = notifications.notifications.map(item => item.recipientUserId).sort();
    if (notifications.notifications.length > 0
        && !sameJson(deliveredRecipients, finalizedRecipients)) {
      Q.fail("manual Finalize deliveries do not target exactly Nova and Riley before advancement.");
    }

    const rule = tournamentReviewRule();
    if (!rule) {
      Q.fail(`notification rule '${TOURNAMENT_REVIEW_RULE}' is missing.`);
    }
    const armedAtIso = dateIso(-31);
    const armedIso = Q.nowIso();
    const historyLength = Array.isArray(rule.runHistory) ? rule.runHistory.length : 0;
    const armed = Q.collection("notificationRuleConfigs").updateOne(
      { ruleKey: TOURNAMENT_REVIEW_RULE },
      {
        $set: {
          enabled: true,
          "runState.currentStatus": "idle",
          "runState.lastRunAtIso": armedAtIso,
          "runState.progressPercent": 0,
          "runState.progressDetail": "Armed for TOURNAMENT-003 advancement notification sequence replay.",
          updatedDate: armedIso,
          updatedUser: Q.ACTOR
        },
        $unset: {
          "runState.startedAtIso": "",
          "runState.finishedAtIso": ""
        }
      }
    );
    if (armed.matchedCount !== 1) {
      Q.fail(`notification rule '${TOURNAMENT_REVIEW_RULE}' disappeared while advancement was armed.`);
    }
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: {
        "tournamentNotificationSequenceRetest.finalizeVerifiedAtIso": armedIso,
        "tournamentNotificationSequenceRetest.finalizeNotification": notifications,
        "tournamentNotificationSequenceRetest.workerArmedAtIso": armedIso,
        "tournamentNotificationSequenceRetest.workerHistoryLength": historyLength
      }
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "tournament-finalize-sequence-verified",
      finalizedRecipients,
      workerArmedLastRunAtIso: armedAtIso,
      next: "Wait for the real event-tournament-review worker, then run verify-tournament-advancement-sequence."
    });
  }

  function verifyTournamentAdvancementSequence() {
    if (checkpointId !== "TOURNAMENT-003") {
      Q.fail("verify-tournament-advancement-sequence is restricted to TOURNAMENT-003.");
    }
    const state = requireMatchingState();
    const replay = state.tournamentNotificationSequenceRetest;
    if (!replay || !replay.workerArmedAtIso || replay.advancementVerifiedAtIso) {
      Q.fail("the advancement worker replay is not armed or is already verified.");
    }
    const rule = tournamentReviewRule();
    const runState = rule && rule.runState ? rule.runState : {};
    const historyLength = rule && Array.isArray(rule.runHistory) ? rule.runHistory.length : 0;
    if (Q.text(runState.currentStatus) !== "completed"
        || Number(runState.lastRunCount) !== 1
        || historyLength !== Number(replay.workerHistoryLength || 0) + 1) {
      Q.fail("the real tournament worker has not completed exactly once with one changed group.");
    }
    const current = tournamentReviewStableSnapshot();
    const expectedWinners = sortedUnique(replay.expectedWinnerUserIds || []);
    const actualWinners = sortedUnique(current.finalGroupMembers
      .filter(member => Q.text(member.status).toLowerCase() === "accepted")
      .map(member => member.userId));
    if (current.finalGroups.length !== 1
        || !sameJson(actualWinners, expectedWinners)
        || current.planMarkers.length !== 1
        || !sameJson(current.leaderboard, replay.leaderboardBaseline)) {
      Q.fail("the real tournament worker did not write the exact proven memberships into the existing Final group.");
    }
    const notifications = tournamentFinalizeNotificationSnapshot();
    const finalizedRecipients = [participantUserId, thirdUserId].sort();
    if (notifications.outbox.length !== 1
        || !sameJson(notifications.outbox[0].recipientUserIds, finalizedRecipients)
        || notifications.advancementOutbox.length !== 1
        || !sameJson(notifications.advancementOutbox[0].recipientUserIds, expectedWinners)
        || notifications.advancementOutbox[0].notificationTitleKey !== "notification.event.stage.advanced.title"
        || notifications.advancementOutbox[0].notificationMessageKey !== "notification.event.stage.advanced.message"
        || notifications.advancementOutbox[0].notificationTone !== "success"
        || notifications.advancementOutbox[0].notificationAvatarTone !== "stage"
        || notifications.advancementOutbox[0].notificationAvatarIcon !== "emoji_events"
        || notifications.advancementOutbox[0].stageIndex !== "2"
        || notifications.advancementOutbox[0].stageTotal !== "2"
        || notifications.advancementOutbox[0].stageTitle !== "Qualifiers"
        || notifications.advancementOutbox[0].nextStageTitle !== "Final"
        || notifications.notAdvancingOutbox.length !== 1
        || !sameJson(notifications.notAdvancingOutbox[0].recipientUserIds, [participantUserId])
        || notifications.notAdvancingOutbox[0].notificationTitleKey !== "notification.event.stage.not-advanced.title"
        || notifications.notAdvancingOutbox[0].notificationMessageKey !== "notification.event.stage.not-advanced.message"
        || notifications.notAdvancingOutbox[0].notificationTone !== "warning"
        || notifications.notAdvancingOutbox[0].notificationAvatarTone !== "stage"
        || notifications.notAdvancingOutbox[0].notificationAvatarIcon !== "emoji_events"
        || notifications.notAdvancingOutbox[0].stageIndex !== "1"
        || notifications.notAdvancingOutbox[0].stageTotal !== "2"
        || notifications.notAdvancingOutbox[0].stageTitle !== "Qualifiers"
        || notifications.notAdvancingOutbox[0].nextStageTitle !== "Final"
        || notifications.outbox[0].createdDate >= notifications.advancementOutbox[0].createdDate
        || notifications.outbox[0].createdDate >= notifications.notAdvancingOutbox[0].createdDate) {
      Q.fail("the ordered Casey Finalize then automatic participant outcome contract is not persisted exactly.");
    }
    const deliveredAdvancers = notifications.advancementNotifications
      .map(item => item.recipientUserId)
      .sort();
    if (notifications.advancementNotifications.length > 0
        && !sameJson(deliveredAdvancers, expectedWinners)) {
      Q.fail("advancement deliveries do not target exactly Casey and Riley.");
    }
    const deliveredNonAdvancers = notifications.notAdvancingNotifications
      .map(item => item.recipientUserId)
      .sort();
    if (notifications.notAdvancingNotifications.length > 0
        && !sameJson(deliveredNonAdvancers, [participantUserId])) {
      Q.fail("non-advancement deliveries do not target exactly Nova.");
    }

    const armedAtIso = dateIso(-31);
    const verifiedAtIso = Q.nowIso();
    const noOpHistoryLength = Array.isArray(rule.runHistory) ? rule.runHistory.length : 0;
    const armed = Q.collection("notificationRuleConfigs").updateOne(
      { ruleKey: TOURNAMENT_REVIEW_RULE },
      {
        $set: {
          enabled: true,
          "runState.currentStatus": "idle",
          "runState.lastRunAtIso": armedAtIso,
          "runState.progressPercent": 0,
          "runState.progressDetail": "Armed for TOURNAMENT-003 advancement-notification no-op replay.",
          updatedDate: verifiedAtIso,
          updatedUser: Q.ACTOR
        },
        $unset: {
          "runState.startedAtIso": "",
          "runState.finishedAtIso": ""
        }
      }
    );
    if (armed.matchedCount !== 1) {
      Q.fail(`notification rule '${TOURNAMENT_REVIEW_RULE}' disappeared while the advancement no-op was armed.`);
    }
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: {
        "tournamentNotificationSequenceRetest.advancementVerifiedAtIso": verifiedAtIso,
        "tournamentNotificationSequenceRetest.verifiedNotificationSequence": notifications,
        "tournamentNotificationSequenceRetest.noOpArmedAtIso": verifiedAtIso,
        "tournamentNotificationSequenceRetest.noOpHistoryLength": noOpHistoryLength,
        "tournamentNotificationSequenceRetest.noOpDomainBaseline": current
      }
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "tournament-advancement-sequence-verified",
      finalizedRecipients,
      advancementRecipients: expectedWinners,
      notAdvancingRecipients: [participantUserId],
      next: "Wait for the real unchanged tournament worker pass, then run verify-tournament-advancement-sequence-noop."
    });
  }

  function verifyTournamentAdvancementSequenceNoop() {
    if (checkpointId !== "TOURNAMENT-003") {
      Q.fail("verify-tournament-advancement-sequence-noop is restricted to TOURNAMENT-003.");
    }
    const state = requireMatchingState();
    const replay = state.tournamentNotificationSequenceRetest;
    if (!replay || !replay.noOpArmedAtIso || replay.verifiedAtIso) {
      Q.fail("the advancement no-op replay is not armed or is already verified.");
    }
    const rule = tournamentReviewRule();
    const runState = rule && rule.runState ? rule.runState : {};
    const historyLength = rule && Array.isArray(rule.runHistory) ? rule.runHistory.length : 0;
    if (Q.text(runState.currentStatus) !== "completed"
        || Number(runState.lastRunCount) !== 0
        || historyLength !== Number(replay.noOpHistoryLength || 0) + 1) {
      Q.fail("the unchanged tournament worker has not completed exactly once with affected count 0.");
    }
    const current = tournamentReviewStableSnapshot();
    const notifications = tournamentFinalizeNotificationSnapshot();
    if (!sameJson(current, replay.noOpDomainBaseline)
        || !sameJson(notifications, replay.verifiedNotificationSequence)) {
      Q.fail("the unchanged worker pass altered domain or notification state.");
    }
    const verifiedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: {
        "tournamentNotificationSequenceRetest.verifiedAtIso": verifiedAtIso,
        "tournamentNotificationSequenceRetest.noOpVerifiedAtIso": verifiedAtIso
      }
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "tournament-advancement-sequence-noop-verified",
      affectedCount: Number(runState.lastRunCount),
      next: "Compare Casey/Nova/Riley live counters and lists: Casey has the automatic advancement result; Nova and Riley each have Casey's Finalize plus their own automatic outcome."
    });
  }

  function verifyTicketAttendanceFirstScan() {
    if (checkpointId !== "EVENT-TICKET-011") {
      Q.fail("verify-ticket-attendance-first-scan is only valid for EVENT-TICKET-011.");
    }
    const state = requireMatchingState();
    if (state.ticketAttendanceFirstScan) {
      Q.fail("EVENT-TICKET-011 first-scan oracle is already recorded; continue with the replay.");
    }
    const before = state.ticketAttendanceBaseline;
    const current = ticketAttendanceSnapshot();
    if (!before || before.memberCount !== 2 || before.ticketCount !== 1
        || !before.hostMember || !before.participantMember || !before.ticket) {
      Q.fail("EVENT-TICKET-011 has no exact two-member, one-unused-ticket staging baseline.");
    }
    if (before.participantMember.status !== "accepted"
        || before.participantMember.attendanceStatus
        || before.participantMember.checkedInAtIso
        || before.participantMember.checkedInByUserId
        || before.participantMember.checkedInTicketId
        || before.ticket.status !== "A" || before.ticket.usedAtIso || before.ticket.usedByUserId) {
      Q.fail("EVENT-TICKET-011 staging baseline already contained attendance or a consumed ticket.");
    }
    if (current.memberCount !== 2 || current.ticketCount !== 1
        || !current.hostMember || !current.participantMember || !current.ticket) {
      Q.fail("the first scan changed the controlled member/ticket cardinality.");
    }
    if (current.participantMember.status !== "accepted"
        || current.participantMember.attendanceStatus !== "checked-in"
        || !current.participantMember.checkedInAtIso
        || current.participantMember.checkedInAtIso !== current.ticket.usedAtIso
        || current.participantMember.checkedInByUserId !== hostUserId
        || current.participantMember.checkedInByUserId !== current.ticket.usedByUserId
        || current.participantMember.checkedInTicketId !== current.ticket.id) {
      Q.fail("the first scan did not persist the exact accepted-member attendance identity.");
    }
    if (current.ticket.id !== before.ticket.id || current.ticket.status !== "A"
        || current.ticket.issuedAtIso !== before.ticket.issuedAtIso
        || current.hostMember.status !== before.hostMember.status
        || current.hostMember.actionAtIso !== before.hostMember.actionAtIso
        || current.hostMember.attendanceStatus || current.hostMember.checkedInAtIso
        || current.hostMember.checkedInByUserId || current.hostMember.checkedInTicketId
        || current.participantMember.actionAtIso !== before.participantMember.actionAtIso
        || !sameJson(current.event, before.event)
        || !sameJson(current.hostCounters, before.hostCounters)
        || !sameJson(current.participantCounters, before.participantCounters)
        || current.hostProfileStatus !== before.hostProfileStatus
        || current.participantProfileStatus !== before.participantProfileStatus
        || current.replayAudits.length !== 0) {
      Q.fail("the first scan changed membership, capacity, counters, profile status or replay audit controls.");
    }
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: state._id },
      { $set: { ticketAttendanceFirstScan: current } }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "ticket-attendance-first-scan-verified",
      attendance: current,
      next: "Scan the same saved Nova QR once more as Casey, then run verify-ticket-attendance-replay."
    });
  }

  function verifyTicketAttendanceReplay() {
    if (checkpointId !== "EVENT-TICKET-011") {
      Q.fail("verify-ticket-attendance-replay is only valid for EVENT-TICKET-011.");
    }
    const state = requireMatchingState();
    const first = state.ticketAttendanceFirstScan;
    if (!first || !first.ticket || !first.participantMember) {
      Q.fail("verify the first EVENT-TICKET-011 scan before verifying its replay.");
    }
    const current = ticketAttendanceSnapshot();
    const immutableFirst = { ...first, replayAudits: [] };
    const immutableCurrent = { ...current, replayAudits: [] };
    if (!sameJson(immutableCurrent, immutableFirst)) {
      Q.fail("the replay rewrote attendance, ticket, membership, capacity, counters or profile state.");
    }
    if (current.replayAudits.length !== first.replayAudits.length + 1) {
      Q.fail("the single replay did not create exactly one immutable already-used audit.");
    }
    const audit = current.replayAudits[current.replayAudits.length - 1];
    if (audit.ticketId !== first.ticket.id
        || audit.holderUserId !== participantUserId
        || audit.actorUserId !== hostUserId
        || audit.originalUsedAtIso !== first.ticket.usedAtIso
        || audit.originalUsedByUserId !== hostUserId) {
      Q.fail("the replay audit does not preserve the first scan's ticket/holder/actor identity.");
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "ticket-attendance-replay-verified",
      attendance: current,
      next: "If Casey's still-open Members row stayed single and unchanged during replay, record EVENT-TICKET-011 PASS/CLOSED."
    });
  }

  function tournamentRoomLifeSelectors() {
    const eventIds = [
      TOURNAMENT_ROOM_LIFE_EVENT_ID,
      TOURNAMENT_ROOM_LIFE_ROOM_A,
      TOURNAMENT_ROOM_LIFE_ROOM_B
    ];
    return [
      { collection: "events", selector: { $or: [
        { _id: { $in: eventIds } },
        { sourceId: { $in: eventIds } },
        { syncKey: { $regex: `^${TOURNAMENT_ROOM_LIFE_PREFIX}` } }
      ] } },
      { collection: "activityMembers", selector: { ownerId: { $in: eventIds } } },
      { collection: "activitySubEventStageRuntime", selector: { ownerId: TOURNAMENT_ROOM_LIFE_EVENT_ID } },
      { collection: "activitySubEventGroups", selector: { ownerId: { $regex: `^${TOURNAMENT_ROOM_LIFE_PREFIX}` } } },
      { collection: "eventLeaderboardEntries", selector: { eventId: TOURNAMENT_ROOM_LIFE_EVENT_ID } },
      { collection: "chats", selector: { $or: [
        { eventId: { $in: eventIds } },
        { ownerId: { $in: eventIds } }
      ] } },
      { collection: "chatMessages", selector: { chatId: { $in: eventIds } } },
      { collection: "notificationOutbox", selector: { $or: [
        { entityId: { $in: eventIds } },
        { "payload.eventId": { $in: eventIds } },
        { "payload.chatId": { $in: eventIds } },
        { "payload.parentEventId": TOURNAMENT_ROOM_LIFE_EVENT_ID }
      ] } },
      { collection: "userNotifications", selector: { $or: [
        { sourceId: { $in: eventIds } },
        { "payload.eventId": { $in: eventIds } },
        { "payload.chatId": { $in: eventIds } },
        { "payload.parentEventId": TOURNAMENT_ROOM_LIFE_EVENT_ID }
      ] } },
      { collection: "affinityRecomputeTasks", selector: { targetId: { $in: eventIds } } },
      { collection: "scheduledMessageTasks", selector: { eventId: { $in: eventIds } } },
      { collection: "schedulerPlanMarkers", selector: { ownerId: { $regex: `^${TOURNAMENT_ROOM_LIFE_PREFIX}` } } }
    ];
  }

  function tournamentRoomLifeCounterSummary(userId) {
    const user = Q.ensureUser(userId, "tournament-room-life counter user");
    return {
      userId,
      chats: nestedNumber(user, "activities.chats"),
      chatAll: nestedNumber(user, "activities.chat.all"),
      chatEvent: nestedNumber(user, "activities.chat.event"),
      events: nestedNumber(user, "activities.events"),
      hosting: nestedNumber(user, "activities.hosting"),
      eventAll: nestedNumber(user, "activities.event.all"),
      eventActive: nestedNumber(user, "activities.event.active"),
      eventPending: nestedNumber(user, "activities.event.pending"),
      eventInvitations: nestedNumber(user, "activities.event.invitations"),
      eventHosting: nestedNumber(user, "activities.event.hosting"),
      eventDrafts: nestedNumber(user, "activities.event.drafts"),
      eventTrash: nestedNumber(user, "activities.event.trash")
    };
  }

  function tournamentRoomLifeCounterWithDelta(baseline, delta) {
    const result = { ...baseline };
    for (const [key, value] of Object.entries(delta || {})) {
      result[key] = Math.max(0, Number(result[key] || 0) + Number(value || 0));
    }
    return result;
  }

  function persistTournamentRoomLifeCounters(expected) {
    for (const summary of expected) {
      const result = Q.collection("users").updateOne({
        $or: [{ _id: summary.userId }, { userId: summary.userId }]
      }, { $set: {
        "activities.chats": summary.chats,
        "activities.chat.all": summary.chatAll,
        "activities.chat.event": summary.chatEvent,
        "activities.events": summary.events,
        "activities.hosting": summary.hosting,
        "activities.event.all": summary.eventAll,
        "activities.event.active": summary.eventActive,
        "activities.event.pending": summary.eventPending,
        "activities.event.invitations": summary.eventInvitations,
        "activities.event.hosting": summary.eventHosting,
        "activities.event.drafts": summary.eventDrafts,
        "activities.event.trash": summary.eventTrash
      } });
      if (result.matchedCount !== 1) {
        Q.fail(`tournament-room-life counter user '${summary.userId}' disappeared.`);
      }
    }
  }

  function tournamentRoomLifeEventDocument(id, title, acceptedUserIds, stagedAtIso, options = {}) {
    return {
      _id: id,
      sourceId: id,
      syncKey: options.syncKey || id,
      ownerUserId: options.ownerUserId == null ? null : options.ownerUserId,
      status: "A",
      published: true,
      admins: options.admins || [],
      avatar: options.avatar || "",
      title,
      subtitle: options.subtitle || "Manual tournament-room lifecycle QA checkpoint",
      timeframe: "",
      inviter: null,
      unread: 0,
      activity: Number(options.activity || 0),
      isExpired: false,
      creatorUserId: options.creatorUserId == null ? null : options.creatorUserId,
      organizerUserId: options.organizerUserId == null ? null : options.organizerUserId,
      creatorName: options.creatorName || "",
      creatorInitials: options.creatorInitials || "",
      creatorGender: options.creatorGender || "",
      creatorCity: options.creatorCity || "Austin",
      visibility: options.visibility || "public",
      blindMode: "Open Event",
      startAtIso: options.startAtIso,
      endAtIso: options.endAtIso,
      distanceKm: 0,
      imageUrl: options.imageUrl || "",
      location: "",
      capacityMin: options.capacityMin || 1,
      capacityMax: options.capacityMax || 8,
      capacityTotal: options.capacityMax || 8,
      full: false,
      autoInviter: false,
      frequency: "One-time",
      ticketing: false,
      approvalRequired: false,
      policiesEnabled: false,
      policies: [],
      slotsEnabled: false,
      slotTemplates: [],
      parentEventId: options.parentEventId || null,
      slotTemplateId: null,
      generated: options.generated === true,
      eventType: options.eventType || "event",
      upcomingSlots: [],
      acceptedMembers: acceptedUserIds.length,
      pendingMembers: (options.pendingUserIds || []).length,
      acceptedMemberUserIds: [...acceptedUserIds],
      pendingMemberUserIds: [...(options.pendingUserIds || [])],
      invitedMemberUserIds: [...(options.invitedUserIds || [])],
      pendingRequestMemberUserIds: [],
      topics: options.topics || ["#Tournament", "#Competition"],
      subEventsEnabled: options.subEventsEnabled === true,
      subEventDefinitions: options.subEventDefinitions || [],
      subEvents: options.subEvents || [],
      currentStage: options.currentStage || null,
      mode: "Tournament",
      rating: 0,
      boost: 0,
      affinity: 0,
      createdDate: stagedAtIso,
      createdUser: Q.ACTOR,
      updatedDate: stagedAtIso,
      updatedUser: Q.ACTOR
    };
  }

  function tournamentRoomLifeMember(ownerId, userId, role, stagedAtIso, options = {}) {
    return {
      _id: `${TOURNAMENT_ROOM_LIFE_PREFIX}:member:${ownerId === TOURNAMENT_ROOM_LIFE_EVENT_ID ? "parent" : ownerId === TOURNAMENT_ROOM_LIFE_ROOM_A ? "room-a" : "room-b"}:${userId}`,
      syncKey: `${TOURNAMENT_ROOM_LIFE_PREFIX}:member:${ownerId}:${userId}`,
      ownerType: "event",
      ownerId,
      userId,
      role,
      status: options.status || "accepted",
      pendingSource: options.pendingSource || null,
      requestKind: options.requestKind || null,
      invitedByUserId: options.invitedByUserId || null,
      actionAtIso: stagedAtIso,
      createdDate: stagedAtIso,
      createdUser: Q.ACTOR,
      updatedDate: stagedAtIso,
      updatedUser: Q.ACTOR
    };
  }

  function tournamentRoomLifeChat(roomId, title, memberIds, ownerUserId, welcome, stagedAtIso) {
    return {
      _id: `${TOURNAMENT_ROOM_LIFE_PREFIX}:chat:${roomId === TOURNAMENT_ROOM_LIFE_ROOM_A ? "room-a" : "room-b"}:${ownerUserId}`,
      id: roomId,
      ownerUserId,
      avatar: TOURNAMENT_ROOM_IMAGE_URL,
      title,
      lastMessage: welcome,
      lastSenderId: null,
      memberIds: [...memberIds].sort(),
      unread: 1,
      dateIso: stagedAtIso,
      channelType: "mainEvent",
      ownerId: roomId,
      eventId: roomId,
      ownerStatus: "A",
      revision: 1,
      subEventId: null,
      groupId: null
    };
  }

  function tournamentRoomLifeWelcome(roomId, text, stagedAtIso) {
    return {
      _id: `chat-message:${roomId}:system:tournament-room-welcome`,
      chatId: roomId,
      id: "system:tournament-room-welcome",
      clientId: "tournament-room-welcome",
      sender: "MyScoutee System",
      senderAvatar: { id: "", initials: "MS", gender: "system" },
      text,
      time: "",
      sentAtIso: stagedAtIso,
      mine: false,
      readBy: [],
      replyTo: null,
      reactions: [],
      attachments: [],
      messageSenderUserIds: [],
      messageReadByUserIds: [],
      messageReactionUserIds: [],
      messageAttachmentKeys: [],
      pollVoterUserIds: []
    };
  }

  function tournamentRoomLifeSnapshot() {
    const eventIds = [
      TOURNAMENT_ROOM_LIFE_EVENT_ID,
      TOURNAMENT_ROOM_LIFE_ROOM_A,
      TOURNAMENT_ROOM_LIFE_ROOM_B
    ];
    const events = Q.collection("events").find({ sourceId: { $in: eventIds } })
      .sort({ sourceId: 1, ownerUserId: 1, _id: 1 }).toArray();
    const members = Q.collection("activityMembers").find({ ownerId: { $in: eventIds } })
      .sort({ ownerId: 1, userId: 1 }).toArray();
    const chats = Q.collection("chats").find({ eventId: { $in: eventIds } })
      .sort({ eventId: 1, ownerUserId: 1 }).toArray();
    const messages = Q.collection("chatMessages").find({ chatId: { $in: eventIds } })
      .sort({ chatId: 1, sentAtIso: 1, id: 1 }).toArray();
    return {
      events: events.map(item => ({
        recordId: Q.text(item._id),
        sourceId: Q.text(item.sourceId),
        ownerUserId: Q.text(item.ownerUserId),
        status: Q.text(item.status),
        statusBeforeSuppression: Q.text(item.statusBeforeSuppression),
        trashedAtIso: Q.text(item.trashedAtIso),
        title: Q.text(item.title),
        organizerUserId: Q.text(item.organizerUserId),
        creatorUserId: Q.text(item.creatorUserId),
        parentEventId: Q.text(item.parentEventId),
        generated: item.generated === true,
        activity: Number(item.activity || 0),
        acceptedMembers: Number(item.acceptedMembers || 0),
        acceptedMemberUserIds: sortedUnique(item.acceptedMemberUserIds || []),
        pendingMembers: Number(item.pendingMembers || 0),
        pendingMemberUserIds: sortedUnique(item.pendingMemberUserIds || []),
        capacityMin: Number(item.capacityMin || 0),
        capacityMax: Number(item.capacityMax || 0),
        eventType: Q.text(item.eventType),
        imageUrl: Q.text(item.imageUrl),
        stagePending: (item.subEvents || []).map(subEvent => ({
          id: Q.text(subEvent.id),
          groupsPending: Number(subEvent.groupsPending || 0)
        }))
      })),
      members: members.map(item => ({
        ownerType: Q.text(item.ownerType),
        ownerId: Q.text(item.ownerId),
        userId: Q.text(item.userId),
        role: Q.text(item.role),
        status: Q.text(item.status),
        statusBeforeSuppression: Q.text(item.statusBeforeSuppression),
        suppressionRootOwnerId: Q.text(item.suppressionRootOwnerId),
        suppressedAtIso: Q.text(item.suppressedAtIso)
      })),
      chats: chats.map(item => ({
        chatId: Q.text(item.id || item.chatId),
        ownerUserId: Q.text(item.ownerUserId),
        memberIds: sortedUnique(item.memberIds || []),
        title: Q.text(item.title),
        avatar: Q.text(item.avatar),
        lastMessage: Q.text(item.lastMessage),
        unread: Number(item.unread || 0)
      })),
      messages: messages.map(item => ({
        chatId: Q.text(item.chatId),
        id: Q.text(item.id),
        clientId: Q.text(item.clientId),
        sender: Q.text(item.sender),
        text: Q.text(item.text)
      })),
      stageRuntime: Q.collection("activitySubEventStageRuntime")
        .find({ ownerId: TOURNAMENT_ROOM_LIFE_EVENT_ID })
        .sort({ subEventId: 1 }).toArray().map(item => ({
          ownerId: Q.text(item.ownerId),
          subEventId: Q.text(item.subEventId),
          stageStatus: Q.text(item.stageStatus),
          stageStatusReason: Q.text(item.stageStatusReason),
          groupsCount: Number(item.groupsCount || 0)
        })),
      manualGroups: Q.collection("activitySubEventGroups")
        .find({ ownerId: { $regex: `^${TOURNAMENT_ROOM_LIFE_PREFIX}` } }).count(),
      leaderboard: Q.collection("eventLeaderboardEntries")
        .find({ eventId: TOURNAMENT_ROOM_LIFE_EVENT_ID }).count(),
      planMarkers: Q.collection("schedulerPlanMarkers")
        .find({ ownerId: { $regex: `^${TOURNAMENT_ROOM_LIFE_PREFIX}` } }).count(),
      notifications: Q.collection("userNotifications").find({ $or: [
        { sourceId: { $in: eventIds } },
        { "payload.eventId": { $in: eventIds } },
        { "payload.parentEventId": TOURNAMENT_ROOM_LIFE_EVENT_ID }
      ] }).count(),
      outbox: Q.collection("notificationOutbox").find({ $or: [
        { entityId: { $in: eventIds } },
        { "payload.eventId": { $in: eventIds } },
        { "payload.parentEventId": TOURNAMENT_ROOM_LIFE_EVENT_ID }
      ] }).count(),
      recomputeTasks: Q.collection("affinityRecomputeTasks").find({ targetId: { $in: eventIds } })
        .sort({ updatedDate: 1 }).toArray().map(item => ({
          targetId: Q.text(item.targetId),
          reasons: sortedUnique(item.reasons || []),
          status: Q.text(item.status)
        })),
      counters: [hostUserId, participantUserId, thirdUserId].map(tournamentRoomLifeCounterSummary)
    };
  }

  function assertTournamentRoomLifeBaseline(snapshot, expectedCounters) {
    const parent = snapshot.events.filter(item => item.sourceId === TOURNAMENT_ROOM_LIFE_EVENT_ID);
    const roomA = snapshot.events.filter(item => item.sourceId === TOURNAMENT_ROOM_LIFE_ROOM_A);
    const roomB = snapshot.events.filter(item => item.sourceId === TOURNAMENT_ROOM_LIFE_ROOM_B);
    if (parent.length !== 1 || parent[0].ownerUserId !== hostUserId
        || parent[0].status !== "A"
        || parent[0].activity !== 0
        || !parent[0].stagePending.some(item => (
          item.id === TOURNAMENT_ROOM_LIFE_QUALIFIER_ID && item.groupsPending === 0))
        || !sameIds(parent[0].acceptedMemberUserIds, [hostUserId, participantUserId, thirdUserId])
        || roomA.length !== 1 || roomA[0].ownerUserId || roomA[0].status !== "A"
        || !sameIds(roomA[0].acceptedMemberUserIds, [hostUserId, participantUserId])
        || roomA[0].acceptedMembers !== 2 || roomA[0].pendingMembers !== 0
        || roomA[0].pendingMemberUserIds.length !== 0
        || roomA[0].capacityMin !== 1 || roomA[0].capacityMax !== 3
        || roomB.length !== 1 || roomB[0].ownerUserId || roomB[0].status !== "A"
        || !sameIds(roomB[0].acceptedMemberUserIds, [thirdUserId])
        || roomB[0].acceptedMembers !== 1 || roomB[0].capacityMin !== 1 || roomB[0].capacityMax !== 2
        || ![roomA[0], roomB[0]].every(room => room.eventType === "tournament-room"
          && room.generated && room.parentEventId === TOURNAMENT_ROOM_LIFE_EVENT_ID
          && room.organizerUserId === hostUserId && !room.creatorUserId
          && room.imageUrl === TOURNAMENT_ROOM_IMAGE_URL)) {
      Q.fail("TOURNAMENT-ROOM-LIFE-001 parent/room event baseline is not exact.");
    }
    const expectedMembers = [
      [TOURNAMENT_ROOM_LIFE_EVENT_ID, hostUserId, "Admin"],
      [TOURNAMENT_ROOM_LIFE_EVENT_ID, participantUserId, "Member"],
      [TOURNAMENT_ROOM_LIFE_EVENT_ID, thirdUserId, "Member"],
      [TOURNAMENT_ROOM_LIFE_ROOM_A, hostUserId, "Member"],
      [TOURNAMENT_ROOM_LIFE_ROOM_A, participantUserId, "Member"],
      [TOURNAMENT_ROOM_LIFE_ROOM_B, thirdUserId, "Member"]
    ].map(([ownerId, userId, role]) => `${ownerId}|${userId}|${role}|accepted`).sort();
    const actualMembers = snapshot.members.map(item => (
      `${item.ownerId}|${item.userId}|${item.role}|${item.status}`)).sort();
    const expectedChats = [
      `${TOURNAMENT_ROOM_LIFE_ROOM_A}|${hostUserId}|${[hostUserId, participantUserId].sort().join(",")}|1`,
      `${TOURNAMENT_ROOM_LIFE_ROOM_A}|${participantUserId}|${[hostUserId, participantUserId].sort().join(",")}|1`,
      `${TOURNAMENT_ROOM_LIFE_ROOM_B}|${thirdUserId}|${thirdUserId}|1`
    ].sort();
    const actualChats = snapshot.chats.map(item => (
      `${item.chatId}|${item.ownerUserId}|${item.memberIds.join(",")}|${item.unread}`)).sort();
    if (!sameJson(actualMembers, expectedMembers)
        || !sameJson(actualChats, expectedChats)
        || snapshot.messages.length !== 2
        || !snapshot.messages.every(item => item.id === "system:tournament-room-welcome")
        || snapshot.stageRuntime.length !== 1
        || snapshot.stageRuntime[0].subEventId !== TOURNAMENT_ROOM_LIFE_QUALIFIER_ID
        || snapshot.stageRuntime[0].stageStatus !== "A"
        || snapshot.stageRuntime[0].groupsCount !== 2
        || snapshot.manualGroups !== 0 || snapshot.leaderboard !== 0 || snapshot.planMarkers !== 0
        || snapshot.notifications !== 0 || snapshot.outbox !== 0
        || snapshot.recomputeTasks.length !== 0
        || !sameJson(snapshot.counters, expectedCounters)) {
      Q.fail("TOURNAMENT-ROOM-LIFE-001 membership/chat/runtime/counter baseline is not exact.");
    }
  }

  function requireTournamentRoomLifeState() {
    const state = Q.collection(Q.STATE_COLLECTION).findOne({ _id: TOURNAMENT_ROOM_LIFE_STATE_ID });
    if (!state) Q.fail(`${TOURNAMENT_ROOM_LIFE_CHECKPOINT} is not staged.`);
    return state;
  }

  function tournamentCardSelectors() {
    const relatedId = { $regex: TOURNAMENT_CARD_EVENT_ID };
    return [
      { collection: "events", selector: { $or: [
        { sourceId: TOURNAMENT_CARD_EVENT_ID },
        { parentEventId: TOURNAMENT_CARD_EVENT_ID },
        { sourceId: relatedId }
      ] } },
      { collection: "activityMembers", selector: { ownerId: relatedId } },
      { collection: "activitySubEventStageRuntime", selector: { ownerId: relatedId } },
      { collection: "activitySubEventGroups", selector: { ownerId: relatedId } },
      { collection: "eventLeaderboardEntries", selector: { eventId: TOURNAMENT_CARD_EVENT_ID } },
      { collection: "chats", selector: { $or: [
        { eventId: relatedId }, { ownerId: relatedId }, { id: relatedId }, { chatId: relatedId }
      ] } },
      { collection: "chatMessages", selector: { chatId: relatedId } },
      { collection: "userNotifications", selector: { $or: [
        { sourceId: relatedId },
        { "payload.eventId": TOURNAMENT_CARD_EVENT_ID },
        { "payload.parentEventId": TOURNAMENT_CARD_EVENT_ID }
      ] } },
      { collection: "notificationOutbox", selector: { $or: [
        { entityId: relatedId },
        { "payload.eventId": TOURNAMENT_CARD_EVENT_ID },
        { "payload.parentEventId": TOURNAMENT_CARD_EVENT_ID }
      ] } },
      { collection: "affinityRecomputeTasks", selector: { targetId: relatedId } },
      { collection: "scheduledMessageTasks", selector: { eventId: relatedId } },
      { collection: "schedulerPlanMarkers", selector: { ownerId: relatedId } },
      { collection: "notificationRuleConfigs", selector: { ruleKey: TOURNAMENT_REVIEW_RULE } }
    ];
  }

  function tournamentCardSnapshot() {
    const parent = Q.collection("events").findOne({ sourceId: TOURNAMENT_CARD_EVENT_ID });
    const stages = parent && Array.isArray(parent.subEvents) ? parent.subEvents : [];
    return {
      parent: parent ? {
        sourceId: Q.text(parent.sourceId),
        title: Q.text(parent.title),
        status: Q.text(parent.status),
        mode: Q.text(parent.mode),
        currentStage: parent.currentStage ? {
          id: Q.text(parent.currentStage.id),
          name: Q.text(parent.currentStage.name),
          stageNumber: Number(parent.currentStage.stageNumber || 0),
          totalStages: Number(parent.currentStage.totalStages || 0),
          status: Q.text(parent.currentStage.status)
        } : null,
        stages: stages.map(stage => ({
          id: Q.text(stage.id),
          name: Q.text(stage.name),
          stageStatus: Q.text(stage.stageStatus),
          groupsCount: Number(stage.groupsCount || 0)
        })),
        acceptedMemberUserIds: sortedUnique(parent.acceptedMemberUserIds || [])
      } : null,
      rootRecords: Q.collection("events").countDocuments({ sourceId: TOURNAMENT_CARD_EVENT_ID }),
      generatedRooms: Q.collection("events").countDocuments({
        parentEventId: TOURNAMENT_CARD_EVENT_ID,
        generated: true
      }),
      parentMembers: Q.collection("activityMembers").countDocuments({
        ownerId: TOURNAMENT_CARD_EVENT_ID,
        status: "accepted"
      }),
      runtime: Q.collection("activitySubEventStageRuntime")
        .find({ ownerId: TOURNAMENT_CARD_EVENT_ID })
        .sort({ subEventId: 1 }).toArray().map(item => ({
          subEventId: Q.text(item.subEventId),
          stageStatus: Q.text(item.stageStatus),
          groupsCount: Number(item.groupsCount || 0)
        }))
    };
  }

  function assertTournamentCardBaseline(snapshot) {
    const parent = snapshot.parent;
    if (!parent || snapshot.rootRecords !== 1 || snapshot.generatedRooms !== 0
        || snapshot.parentMembers !== 3 || parent.status !== "A" || parent.mode !== "Tournament"
        || !sameIds(parent.acceptedMemberUserIds, [hostUserId, participantUserId, thirdUserId])
        || !parent.currentStage
        || parent.currentStage.id !== TOURNAMENT_CARD_QUALIFIER_ID
        || parent.currentStage.name !== "Qualifiers"
        || parent.currentStage.stageNumber !== 1 || parent.currentStage.totalStages !== 2
        || parent.currentStage.status !== "SR"
        || parent.stages.length !== 2
        || parent.stages[0].id !== TOURNAMENT_CARD_QUALIFIER_ID
        || parent.stages[0].stageStatus !== "SR"
        || parent.stages[1].id !== TOURNAMENT_CARD_FINAL_ID
        || parent.stages[1].stageStatus !== "RS"
        || snapshot.runtime.length !== 1
        || snapshot.runtime[0].subEventId !== TOURNAMENT_CARD_QUALIFIER_ID
        || snapshot.runtime[0].stageStatus !== "SR") {
      Q.fail("TOURNAMENT-CARD-001 persisted Qualifiers baseline is not exact.");
    }
  }

  function assertTournamentCardTransition(snapshot) {
    const parent = snapshot.parent;
    if (!parent || snapshot.rootRecords !== 1 || !parent.currentStage
        || parent.currentStage.id !== TOURNAMENT_CARD_FINAL_ID
        || parent.currentStage.name !== "Final"
        || parent.currentStage.stageNumber !== 2 || parent.currentStage.totalStages !== 2
        || parent.currentStage.status !== "RS"
        || parent.stages.length !== 2
        || parent.stages[0].stageStatus !== "F"
        || parent.stages[1].stageStatus !== "RS") {
      Q.fail("TOURNAMENT-CARD-001 persisted Final transition is not exact.");
    }
  }

  function stageTournamentCard() {
    Q.assertDeploymentSafety();
    if (checkpointId !== TOURNAMENT_CARD_CHECKPOINT) {
      Q.fail("the isolated tournament-card stage is restricted to TOURNAMENT-CARD-001.");
    }
    if (Q.collection(Q.STATE_COLLECTION).findOne({ _id: TOURNAMENT_CARD_STATE_ID })) {
      Q.fail("TOURNAMENT-CARD-001 is already staged; use status or reset.");
    }
    const retainedTournamentState = Q.activeState(SCENARIO, false);
    if (retainedTournamentState && (
      Q.text(retainedTournamentState.checkpointId).toUpperCase() !== "TOURNAMENT-004"
      || !Q.text(retainedTournamentState.tournamentFinalLifecycle
        && retainedTournamentState.tournamentFinalLifecycle.completionVerifiedAtIso))) {
      Q.fail("an unclosed event-domain checkpoint is active; the card fixture may coexist only with closed TOURNAMENT-004 evidence.");
    }
    const otherState = Q.collection(Q.STATE_COLLECTION).findOne({
      _id: { $nin: [Q.stateId(SCENARIO), TOURNAMENT_ROOM_LIFE_STATE_ID, TOURNAMENT_CARD_STATE_ID] }
    });
    if (otherState) {
      Q.fail(`another manual scenario '${Q.text(otherState.scenario)}' is staged.`);
    }
    if (Q.collection(Q.STATE_COLLECTION).findOne({ _id: TOURNAMENT_ROOM_LIFE_STATE_ID })) {
      Q.fail("TOURNAMENT-ROOM-LIFE-001 is still staged; reset it before staging the isolated card fixture.");
    }
    [hostUserId, participantUserId, thirdUserId]
      .forEach((userId, index) => Q.ensureUser(userId, ["Casey", "Nova", "Riley"][index]));
    for (const spec of tournamentCardSelectors().filter(spec => spec.collection !== "notificationRuleConfigs")) {
      if (Q.collection(spec.collection).countDocuments(spec.selector) !== 0) {
        Q.fail(`stale tournament-card data exists in '${spec.collection}'; do not overwrite it.`);
      }
    }

    const stagedAtIso = Q.nowIso();
    const originalCounters = [hostUserId, participantUserId, thirdUserId]
      .map(tournamentRoomLifeCounterSummary);
    const expectedCounters = [
      tournamentRoomLifeCounterWithDelta(originalCounters[0], {
        events: 1, hosting: 1, eventAll: 1, eventHosting: 1
      }),
      tournamentRoomLifeCounterWithDelta(originalCounters[1], {
        events: 1, eventAll: 1, eventActive: 1
      }),
      tournamentRoomLifeCounterWithDelta(originalCounters[2], {
        events: 1, eventAll: 1, eventActive: 1
      })
    ];
    const state = {
      _id: TOURNAMENT_CARD_STATE_ID,
      scenario: SCENARIO,
      checkpointId,
      stagedAtIso,
      snapshots: Q.snapshotSpecs(tournamentCardSelectors()),
      originalCounters,
      expectedCounters,
      context: {
        eventId: TOURNAMENT_CARD_EVENT_ID,
        qualifierStageId: TOURNAMENT_CARD_QUALIFIER_ID,
        finalStageId: TOURNAMENT_CARD_FINAL_ID
      }
    };
    Q.collection(Q.STATE_COLLECTION).insertOne(state);
    try {
      const qualifierStartAtIso = dateIso(-120);
      const qualifierEndAtIso = dateIso(-30);
      const finalStartAtIso = dateIso(30);
      const finalEndAtIso = dateIso(90);
      const parentEndAtIso = dateIso(150);
      const qualifiers = {
        id: TOURNAMENT_CARD_QUALIFIER_ID,
        name: "Qualifiers",
        description: "Manual QA persisted current-stage baseline",
        timing: "During",
        offsetMinutes: 0,
        durationMinutes: 90,
        startAt: qualifierStartAtIso,
        endAt: qualifierEndAtIso,
        optional: false,
        capacityMin: 2,
        capacityMax: 6,
        tournamentGroupCapacityMin: 1,
        tournamentGroupCapacityMax: 3,
        tournamentLeaderboardType: "Score",
        tournamentAdvancePerGroup: 1,
        stageStatus: "SR",
        stageStatusReason: "stage-ended",
        stageStatusUpdatedAt: stagedAtIso,
        membersAccepted: 3,
        membersPending: 0,
        groupsCount: 2,
        groupsPending: 0
      };
      const finalStage = {
        id: TOURNAMENT_CARD_FINAL_ID,
        name: "Final",
        description: "Manual QA persisted current-stage transition target",
        timing: "After",
        offsetMinutes: 0,
        durationMinutes: 60,
        startAt: finalStartAtIso,
        endAt: finalEndAtIso,
        optional: false,
        capacityMin: 1,
        capacityMax: 2,
        tournamentGroupCapacityMin: 1,
        tournamentGroupCapacityMax: 2,
        tournamentLeaderboardType: "Score",
        tournamentAdvancePerGroup: 0,
        stageStatus: "RS",
        stageStatusReason: "awaiting-prior-stage",
        membersAccepted: 0,
        membersPending: 0,
        groupsCount: 0,
        groupsPending: 0
      };
      const parent = tournamentRoomLifeEventDocument(
        TOURNAMENT_CARD_EVENT_ID,
        "QA TOURNAMENT-CARD-001",
        [hostUserId, participantUserId, thirdUserId],
        stagedAtIso,
        {
          ownerUserId: hostUserId,
          creatorUserId: hostUserId,
          organizerUserId: hostUserId,
          admins: [hostUserId],
          creatorName: "Casey Bridge",
          creatorInitials: "CB",
          visibility: "public",
          startAtIso: qualifierStartAtIso,
          endAtIso: parentEndAtIso,
          capacityMin: 1,
          capacityMax: 8,
          subEventsEnabled: true,
          subEventDefinitions: [qualifiers, finalStage],
          subEvents: [qualifiers, finalStage],
          currentStage: {
            id: TOURNAMENT_CARD_QUALIFIER_ID,
            name: "Qualifiers",
            stageNumber: 1,
            totalStages: 2,
            status: "SR"
          }
        });
      Q.collection("events").insertOne(parent);
      const qualifierGroupA = `${TOURNAMENT_CARD_QUALIFIER_ID}:group:1`;
      const qualifierGroupB = `${TOURNAMENT_CARD_QUALIFIER_ID}:group:2`;
      const parentMembers = [
        [TOURNAMENT_CARD_EVENT_ID, hostUserId, "Admin", "parent-casey"],
        [TOURNAMENT_CARD_EVENT_ID, participantUserId, "Member", "parent-nova"],
        [TOURNAMENT_CARD_EVENT_ID, thirdUserId, "Member", "parent-riley"],
        [qualifierGroupA, hostUserId, "Member", "group-a-casey"],
        [qualifierGroupA, participantUserId, "Member", "group-a-nova"],
        [qualifierGroupB, thirdUserId, "Member", "group-b-riley"]
      ].map(([ownerId, userId, role, key]) => ({
        _id: `${TOURNAMENT_CARD_PREFIX}:member:${key}`,
        syncKey: `${TOURNAMENT_CARD_PREFIX}:member:${ownerId}:${userId}`,
        ownerType: ownerId === TOURNAMENT_CARD_EVENT_ID ? "event" : "group",
        ownerId,
        userId,
        role,
        status: "accepted",
        actionAtIso: stagedAtIso,
        createdDate: stagedAtIso,
        createdUser: Q.ACTOR,
        updatedDate: stagedAtIso,
        updatedUser: Q.ACTOR
      }));
      Q.collection("activityMembers").insertMany(parentMembers);
      Q.collection("activitySubEventStageRuntime").insertOne({
        _id: `${TOURNAMENT_CARD_PREFIX}:stage-runtime:qualifiers`,
        syncKey: `${TOURNAMENT_CARD_PREFIX}:stage-runtime:qualifiers`,
        recordId: `${TOURNAMENT_CARD_EVENT_ID}:${TOURNAMENT_CARD_QUALIFIER_ID}`,
        status: "A",
        ownerId: TOURNAMENT_CARD_EVENT_ID,
        subEventId: TOURNAMENT_CARD_QUALIFIER_ID,
        stageStatus: "SR",
        stageStatusReason: "stage-ended",
        stageStatusUpdatedAt: stagedAtIso,
        groupsCount: 2,
        groupResourceMetricsByAssetOwnerId: {},
        createdDate: stagedAtIso,
        createdUser: Q.ACTOR,
        updatedDate: stagedAtIso,
        updatedUser: Q.ACTOR
      });
      Q.collection("eventLeaderboardEntries").insertMany([
        ["casey", hostUserId, qualifierGroupA, 9],
        ["nova", participantUserId, qualifierGroupA, 4],
        ["riley", thirdUserId, qualifierGroupB, 7]
      ].map(([key, memberId, groupId, scoreValue]) => ({
        _id: `${TOURNAMENT_CARD_PREFIX}:score:${key}`,
        syncKey: `${TOURNAMENT_CARD_PREFIX}:score:${key}`,
        eventId: TOURNAMENT_CARD_EVENT_ID,
        subEventId: TOURNAMENT_CARD_QUALIFIER_ID,
        groupId,
        entryType: "score",
        memberId,
        scoreValue,
        note: "TOURNAMENT-CARD-001 deterministic score",
        createdAtIso: stagedAtIso,
        createdUser: hostUserId,
        updatedDate: stagedAtIso,
        updatedUser: hostUserId
      })));
      const held = Q.collection("notificationRuleConfigs").updateOne(
        { ruleKey: TOURNAMENT_REVIEW_RULE },
        { $set: {
          enabled: true,
          "runState.currentStatus": "idle",
          "runState.lastRunAtIso": dateIso(60),
          "runState.progressPercent": 0,
          "runState.progressDetail": "Held by TOURNAMENT-CARD-001 until the persisted card transition is observed.",
          updatedDate: stagedAtIso,
          updatedUser: Q.ACTOR
        } }
      );
      if (held.matchedCount !== 1) {
        Q.fail(`notification rule '${TOURNAMENT_REVIEW_RULE}' was not found for TOURNAMENT-CARD-001.`);
      }
      persistTournamentRoomLifeCounters(expectedCounters);
      const baseline = tournamentCardSnapshot();
      assertTournamentCardBaseline(baseline);
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
        $set: { baseline, baselineVerifiedAtIso: Q.nowIso() }
      });
      Q.printObject({
        scenario: SCENARIO,
        checkpointId,
        phase: "tournament-card-baseline-verified",
        stagedAtIso,
        context: state.context,
        baseline,
        next: "Open Casey My Events, keep the root card underneath View Event, and verify Current stage: Qualifiers 1/2 before Finalize."
      });
    } catch (error) {
      Q.fail(`isolated tournament-card stage failed after snapshot: ${Q.text(error && error.message)}. Run reset event-domain ${checkpointId}.`);
    }
  }

  function statusTournamentCard() {
    Q.assertDeploymentSafety();
    const state = Q.collection(Q.STATE_COLLECTION).findOne({ _id: TOURNAMENT_CARD_STATE_ID });
    if (!state) {
      Q.printObject({
        scenario: SCENARIO,
        checkpointId,
        phase: "not-staged",
        next: `Run stage event-domain ${TOURNAMENT_CARD_CHECKPOINT}.`
      });
      return;
    }
    const oracle = tournamentCardSnapshot();
    const phase = oracle.parent && oracle.parent.currentStage
      && oracle.parent.currentStage.id === TOURNAMENT_CARD_FINAL_ID
      ? "tournament-card-final-active"
      : "tournament-card-qualifiers-active";
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase,
      stagedAtIso: state.stagedAtIso,
      baselineVerifiedAtIso: state.baselineVerifiedAtIso,
      context: state.context,
      oracle,
      next: phase === "tournament-card-final-active"
        ? "Verify the Final 2/2 row after reload, then run verify-tournament-card-transition."
        : "Verify the Qualifiers 1/2 row, then Finalize Qualifiers once."
    });
  }

  function verifyTournamentCardTransition() {
    Q.assertDeploymentSafety();
    const state = Q.collection(Q.STATE_COLLECTION).findOne({ _id: TOURNAMENT_CARD_STATE_ID });
    if (!state) Q.fail("TOURNAMENT-CARD-001 is not staged.");
    const oracle = tournamentCardSnapshot();
    assertTournamentCardTransition(oracle);
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: { transitionVerifiedAtIso: Q.nowIso(), transitionOracle: oracle }
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "tournament-card-transition-verified",
      oracle,
      next: "Close only after the Final 2/2 parent-card row has also survived an explicit browser reload."
    });
  }

  function resetTournamentCard() {
    Q.assertDeploymentSafety();
    const state = Q.collection(Q.STATE_COLLECTION).findOne({ _id: TOURNAMENT_CARD_STATE_ID });
    if (!state) Q.fail("TOURNAMENT-CARD-001 is not staged.");
    Q.restoreSnapshots(state.snapshots || []);
    persistTournamentRoomLifeCounters(state.originalCounters || []);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "tournament-card-reset-complete",
      preservedClosedTournament004: true,
      restoredAtIso: Q.nowIso()
    });
  }

  function discardStaleTournamentCard() {
    Q.assertDeploymentSafety();
    const state = Q.collection(Q.STATE_COLLECTION).findOne({ _id: TOURNAMENT_CARD_STATE_ID });
    if (!state) Q.fail("TOURNAMENT-CARD-001 is not staged.");
    if (!Q.text(state.transitionVerifiedAtIso)) {
      Q.fail("TOURNAMENT-CARD-001 has no terminal transition evidence; use the normal reset path.");
    }
    const reviewRule = Q.collection("notificationRuleConfigs")
      .findOne({ ruleKey: TOURNAMENT_REVIEW_RULE });
    if (Q.text(reviewRule && reviewRule.runState && reviewRule.runState.progressDetail)
      .includes(TOURNAMENT_CARD_CHECKPOINT)) {
      Q.fail("TOURNAMENT-CARD-001 still owns the tournament-review hold; use the normal reset path.");
    }
    const managedSnapshots = (state.snapshots || [])
      .filter(snapshot => snapshot.collection !== "notificationRuleConfigs");
    Q.restoreSnapshots(managedSnapshots);
    const retained = tournamentCardSelectors()
      .filter(spec => spec.collection !== "notificationRuleConfigs")
      .map(spec => ({
        collection: spec.collection,
        count: Q.collection(spec.collection).countDocuments(spec.selector)
      }))
      .filter(item => item.count !== 0);
    if (retained.length !== 0) {
      Q.fail(`TOURNAMENT-CARD-001 managed fixture cleanup was incomplete: ${JSON.stringify(retained)}.`);
    }
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "stale-tournament-card-checkpoint-discarded",
      discardedAtIso: Q.nowIso(),
      preservedClosedTournament004: true,
      restoredManagedSnapshots: managedSnapshots.length,
      restoredCounters: false,
      next: "Proceed with the next isolated Tournament checkpoint."
    });
  }

  function stageTournamentRoomLife() {
    Q.assertDeploymentSafety();
    if (checkpointId !== TOURNAMENT_ROOM_LIFE_CHECKPOINT) {
      Q.fail("the isolated room-life stage is restricted to TOURNAMENT-ROOM-LIFE-001.");
    }
    if (Q.collection(Q.STATE_COLLECTION).findOne({ _id: TOURNAMENT_ROOM_LIFE_STATE_ID })) {
      Q.fail("TOURNAMENT-ROOM-LIFE-001 is already staged; use status or reset.");
    }
    const retainedTournamentState = Q.activeState(SCENARIO, false);
    if (retainedTournamentState && (
      Q.text(retainedTournamentState.checkpointId).toUpperCase() !== "TOURNAMENT-004"
      || !Q.text(retainedTournamentState.tournamentFinalLifecycle
        && retainedTournamentState.tournamentFinalLifecycle.completionVerifiedAtIso))) {
      Q.fail("an unclosed event-domain checkpoint is active; the isolated room-life fixture may coexist only with closed TOURNAMENT-004 evidence.");
    }
    const otherState = Q.collection(Q.STATE_COLLECTION).findOne({
      _id: { $nin: [Q.stateId(SCENARIO), TOURNAMENT_ROOM_LIFE_STATE_ID] }
    });
    if (otherState) {
      Q.fail(`another manual scenario '${Q.text(otherState.scenario)}' is staged.`);
    }
    [hostUserId, participantUserId, thirdUserId]
      .forEach((userId, index) => (
        Q.ensureUser(userId, ["Casey", "Nova", "Riley"][index])));
    for (const spec of tournamentRoomLifeSelectors()) {
      if (Q.collection(spec.collection).countDocuments(spec.selector) !== 0) {
        Q.fail(`stale isolated room-life data exists in '${spec.collection}'; do not overwrite it.`);
      }
    }
    const stagedAtIso = Q.nowIso();
    const originalCounters = [hostUserId, participantUserId, thirdUserId]
      .map(tournamentRoomLifeCounterSummary);
    const expectedCounters = [
      tournamentRoomLifeCounterWithDelta(originalCounters[0], {
        chats: 1, chatAll: 1, chatEvent: 1,
        events: 1, hosting: 1, eventAll: 1, eventHosting: 1
      }),
      tournamentRoomLifeCounterWithDelta(originalCounters[1], {
        chats: 1, chatAll: 1, chatEvent: 1,
        events: 1, eventAll: 1, eventActive: 1
      }),
      tournamentRoomLifeCounterWithDelta(originalCounters[2], {
        chats: 1, chatAll: 1, chatEvent: 1,
        events: 1, eventAll: 1, eventActive: 1
      })
    ];
    const state = {
      _id: TOURNAMENT_ROOM_LIFE_STATE_ID,
      scenario: SCENARIO,
      checkpointId,
      stagedAtIso,
      snapshots: Q.snapshotSpecs(tournamentRoomLifeSelectors()),
      originalCounters,
      expectedCounters,
      context: {
        parentEventId: TOURNAMENT_ROOM_LIFE_EVENT_ID,
        qualifierStageId: TOURNAMENT_ROOM_LIFE_QUALIFIER_ID,
        retainedRoomId: TOURNAMENT_ROOM_LIFE_ROOM_A,
        controlRoomId: TOURNAMENT_ROOM_LIFE_ROOM_B,
        retainedMemberUserId: hostUserId,
        controlMemberUserId: thirdUserId
      }
    };
    Q.collection(Q.STATE_COLLECTION).insertOne(state);
    try {
      const startAtIso = dateIso(-30);
      const qualifierEndAtIso = dateIso(60);
      const finalEndAtIso = dateIso(105);
      const parentEndAtIso = dateIso(180);
      const qualifiers = {
        id: TOURNAMENT_ROOM_LIFE_QUALIFIER_ID,
        name: "Qualifiers",
        description: "Manual QA nested accepted-room qualifiers",
        timing: "During",
        offsetMinutes: 0,
        durationMinutes: 90,
        startAt: startAtIso,
        endAt: qualifierEndAtIso,
        optional: false,
        capacityMin: 2,
        capacityMax: 6,
        tournamentGroupCapacityMin: 1,
        tournamentGroupCapacityMax: 3,
        tournamentLeaderboardType: "Score",
        tournamentAdvancePerGroup: 1,
        stageStatus: "A",
        stageStatusReason: "stage-started",
        stageStatusUpdatedAt: stagedAtIso,
        membersAccepted: 3,
        membersPending: 0,
        groupsCount: 2,
        groupsPending: 0
      };
      const finalStage = {
        id: TOURNAMENT_ROOM_LIFE_FINAL_ID,
        name: "Final",
        description: "Manual QA room-leave control final",
        timing: "After",
        offsetMinutes: 0,
        durationMinutes: 45,
        startAt: qualifierEndAtIso,
        endAt: finalEndAtIso,
        optional: false,
        capacityMin: 1,
        capacityMax: 2,
        tournamentGroupCapacityMin: 1,
        tournamentGroupCapacityMax: 2,
        tournamentLeaderboardType: "Score",
        tournamentAdvancePerGroup: 0,
        stageStatus: "RS",
        stageStatusReason: "awaiting-prior-stage",
        membersAccepted: 0,
        membersPending: 0,
        groupsCount: 0,
        groupsPending: 0
      };
      const parent = tournamentRoomLifeEventDocument(
        TOURNAMENT_ROOM_LIFE_EVENT_ID,
        "QA TOURNAMENT-ROOM-LIFE-001",
        [hostUserId, participantUserId, thirdUserId],
        stagedAtIso,
        {
          ownerUserId: hostUserId,
          creatorUserId: hostUserId,
          organizerUserId: hostUserId,
          admins: [hostUserId],
          creatorName: "Casey Bridge",
          creatorInitials: "CB",
          visibility: "public",
          startAtIso,
          endAtIso: parentEndAtIso,
          capacityMin: 1,
          capacityMax: 8,
          activity: 0,
          eventType: "event",
          subEventsEnabled: true,
          subEventDefinitions: [qualifiers, finalStage],
          subEvents: [qualifiers, finalStage]
        });
      const roomA = tournamentRoomLifeEventDocument(
        TOURNAMENT_ROOM_LIFE_ROOM_A,
        "Tournament Group R1",
        [hostUserId, participantUserId],
        stagedAtIso,
        {
          syncKey: `scheduler:random-room:${TOURNAMENT_ROOM_LIFE_ROOM_A}`,
          organizerUserId: hostUserId,
          creatorName: "MyScoutee System",
          visibility: "Invitation only",
          startAtIso,
          endAtIso: parentEndAtIso,
          capacityMin: 1,
          capacityMax: 3,
          eventType: "tournament-room",
          parentEventId: TOURNAMENT_ROOM_LIFE_EVENT_ID,
          generated: true,
          avatar: TOURNAMENT_ROOM_IMAGE_URL,
          imageUrl: TOURNAMENT_ROOM_IMAGE_URL,
          subtitle: "Tournament group for QA TOURNAMENT-ROOM-LIFE-001."
        });
      const roomB = tournamentRoomLifeEventDocument(
        TOURNAMENT_ROOM_LIFE_ROOM_B,
        "Tournament Group R2",
        [thirdUserId],
        stagedAtIso,
        {
          syncKey: `scheduler:random-room:${TOURNAMENT_ROOM_LIFE_ROOM_B}`,
          organizerUserId: hostUserId,
          creatorName: "MyScoutee System",
          visibility: "Invitation only",
          startAtIso,
          endAtIso: parentEndAtIso,
          capacityMin: 1,
          capacityMax: 2,
          eventType: "tournament-room",
          parentEventId: TOURNAMENT_ROOM_LIFE_EVENT_ID,
          generated: true,
          avatar: TOURNAMENT_ROOM_IMAGE_URL,
          imageUrl: TOURNAMENT_ROOM_IMAGE_URL,
          subtitle: "Tournament group for QA TOURNAMENT-ROOM-LIFE-001."
        });
      Q.collection("events").insertMany([parent, roomA, roomB]);
      Q.collection("activityMembers").insertMany([
        tournamentRoomLifeMember(TOURNAMENT_ROOM_LIFE_EVENT_ID, hostUserId, "Admin", stagedAtIso),
        tournamentRoomLifeMember(TOURNAMENT_ROOM_LIFE_EVENT_ID, participantUserId, "Member", stagedAtIso),
        tournamentRoomLifeMember(TOURNAMENT_ROOM_LIFE_EVENT_ID, thirdUserId, "Member", stagedAtIso),
        tournamentRoomLifeMember(TOURNAMENT_ROOM_LIFE_ROOM_A, hostUserId, "Member", stagedAtIso),
        tournamentRoomLifeMember(TOURNAMENT_ROOM_LIFE_ROOM_A, participantUserId, "Member", stagedAtIso),
        tournamentRoomLifeMember(TOURNAMENT_ROOM_LIFE_ROOM_B, thirdUserId, "Member", stagedAtIso)
      ]);
      Q.collection("activitySubEventStageRuntime").insertOne({
        _id: `${TOURNAMENT_ROOM_LIFE_PREFIX}:stage-runtime:qualifiers`,
        syncKey: `${TOURNAMENT_ROOM_LIFE_PREFIX}:stage-runtime:qualifiers`,
        recordId: `${TOURNAMENT_ROOM_LIFE_EVENT_ID}:${TOURNAMENT_ROOM_LIFE_QUALIFIER_ID}`,
        status: "A",
        ownerId: TOURNAMENT_ROOM_LIFE_EVENT_ID,
        subEventId: TOURNAMENT_ROOM_LIFE_QUALIFIER_ID,
        stageStatus: "A",
        stageStatusReason: "stage-started",
        stageStatusUpdatedAt: stagedAtIso,
        groupsCount: 2,
        groupResourceMetricsByAssetOwnerId: {},
        createdDate: stagedAtIso,
        createdUser: Q.ACTOR,
        updatedDate: stagedAtIso,
        updatedUser: Q.ACTOR
      });
      const roomAWelcome = "Welcome to your tournament group for QA TOURNAMENT-ROOM-LIFE-001. Use this chat to coordinate with your group and follow stage updates.";
      const roomBWelcome = roomAWelcome;
      Q.collection("chats").insertMany([
        tournamentRoomLifeChat(TOURNAMENT_ROOM_LIFE_ROOM_A, "Tournament Group R1", [hostUserId, participantUserId], hostUserId, roomAWelcome, stagedAtIso),
        tournamentRoomLifeChat(TOURNAMENT_ROOM_LIFE_ROOM_A, "Tournament Group R1", [hostUserId, participantUserId], participantUserId, roomAWelcome, stagedAtIso),
        tournamentRoomLifeChat(TOURNAMENT_ROOM_LIFE_ROOM_B, "Tournament Group R2", [thirdUserId], thirdUserId, roomBWelcome, stagedAtIso)
      ]);
      Q.collection("chatMessages").insertMany([
        tournamentRoomLifeWelcome(TOURNAMENT_ROOM_LIFE_ROOM_A, roomAWelcome, stagedAtIso),
        tournamentRoomLifeWelcome(TOURNAMENT_ROOM_LIFE_ROOM_B, roomBWelcome, stagedAtIso)
      ]);
      persistTournamentRoomLifeCounters(expectedCounters);
      const baseline = tournamentRoomLifeSnapshot();
      assertTournamentRoomLifeBaseline(baseline, expectedCounters);
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
        $set: { baseline, baselineVerifiedAtIso: Q.nowIso() }
      });
      Q.printObject({
        scenario: SCENARIO,
        checkpointId,
        phase: "tournament-room-life-baseline-verified",
        stagedAtIso,
        context: state.context,
        baseline,
        next: "Launch the configured three demo sessions and verify that generated rooms stay nested, accepted group membership is exact and every pending counter is zero."
      });
    } catch (error) {
      Q.fail(`isolated room-life stage failed after snapshot: ${Q.text(error && error.message)}. Run reset event-domain ${checkpointId}.`);
    }
  }

  function statusTournamentRoomLife() {
    Q.assertDeploymentSafety();
    const state = Q.collection(Q.STATE_COLLECTION).findOne({ _id: TOURNAMENT_ROOM_LIFE_STATE_ID });
    if (!state) {
      Q.printObject({
        scenario: SCENARIO,
        checkpointId,
        phase: "not-staged",
        next: `Run stage event-domain ${TOURNAMENT_ROOM_LIFE_CHECKPOINT}.`
      });
      return;
    }
    const current = tournamentRoomLifeSnapshot();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "tournament-room-life-baseline-active",
      stagedAtIso: state.stagedAtIso,
      baselineVerifiedAtIso: state.baselineVerifiedAtIso,
      context: state.context,
      oracle: current,
      next: "Verify that root room cards are absent and the parent stage/group views show accepted-only room membership with zero pending counters."
    });
  }

  function verifyTournamentRoomLifeBaseline() {
    Q.assertDeploymentSafety();
    const state = requireTournamentRoomLifeState();
    const current = tournamentRoomLifeSnapshot();
    assertTournamentRoomLifeBaseline(current, state.expectedCounters || []);
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "tournament-room-life-baseline-verified",
      oracle: current,
      next: "In Casey's parent tournament, follow View Event -> Qualifiers -> Groups and verify exact accepted-only Group A/Group B membership with zero pending counters."
    });
  }

  function resetTournamentRoomLife() {
    Q.assertDeploymentSafety();
    const state = requireTournamentRoomLifeState();
    Q.restoreSnapshots(state.snapshots || []);
    persistTournamentRoomLifeCounters(state.originalCounters || []);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "tournament-room-life-reset-complete",
      preservedClosedTournament004: true,
      restoredAtIso: Q.nowIso()
    });
  }

  function stage() {
    const selected = config();
    if (checkpointId === "TOURNAMENT-004") {
      Q.fail("TOURNAMENT-004 must be carried forward from the closed TOURNAMENT-003 state; staging or reset-based reconstruction is forbidden.");
    }
    if (selected.stage === "visibility-friends") {
      Q.fail("EVENT-VISIBILITY-001 must be advanced from a completed EVENT-TICKET-007 so the same event, membership and pre-transition ticket identities are retained as the before oracle.");
    }
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    if (hostUserId === participantUserId) Q.fail("host and participant must differ.");
    Q.ensureUser(hostUserId, "event host");
    Q.ensureUser(participantUserId, "event participant");
    if (["invitation-ordinary", "invitation-full", "invitation-visibility", "tournament", "tournament-definition-draft", "tournament-member-removal", "slot-past-tournament", "publish-chat-draft", "chat-authorized"].includes(selected.stage)
        || checkpointId === "EVENT-INV-003"
        || checkpointId === "EVENT-FEEDBACK-002"
        || hasTicketPendingControl()
        || checkpointId === "EVENT-TICKET-007") {
      Q.ensureUser(thirdUserId, "event third participant");
    }
    const colliding = Q.collection("events").findOne({
      title: EXPECTED_TITLE,
      sourceId: { $nin: EVENT_IDS }
    });
    if (colliding) {
      Q.fail(`an unrelated event already uses the reserved title '${EXPECTED_TITLE}'. Rename it before staging.`);
    }
    const stagedAtIso = Q.nowIso();
    const runtimeContext = {
      ...slotContext(selected.stage, stagedAtIso),
      ...(isTicketingStage(selected.stage)
        ? {
            ticketCode: newFixtureTicketCode(),
            isolationTicketCode: newFixtureTicketCode()
          }
        : {})
    };
    const state = {
      _id: Q.stateId(SCENARIO),
      scenario: SCENARIO,
      checkpointId,
      database: db.getName(),
      stagedAtIso,
      context: {
        hostUserId,
        participantUserId,
        thirdUserId,
        eventId: EVENT_ID,
        expectedTitle: EXPECTED_TITLE,
        ...runtimeContext
      },
      snapshots: Q.snapshotSpecs(selectors()),
      userActivitySnapshots: (["publish-chat-draft", "chat-authorized"].includes(selected.stage)
          || isTournamentFixtureStage(selected.stage))
        ? [hostUserId, participantUserId, thirdUserId].map(userActivitiesSnapshot)
        : isTicketingStage(selected.stage)
          ? ((hasTicketPendingControl() || checkpointId === "EVENT-TICKET-007")
              ? [hostUserId, participantUserId, thirdUserId]
              : [hostUserId, participantUserId]).map(userActivitiesSnapshot)
          : selected.stage.startsWith("invitation-")
            ? invitationFixtureUserIds(selected.stage).map(userActivitiesSnapshot)
          : selected.stage.startsWith("feedback-")
            ? (checkpointId === "EVENT-FEEDBACK-002"
                ? [hostUserId, participantUserId, thirdUserId]
                : [hostUserId, participantUserId]).map(userActivitiesSnapshot)
            : checkpointId.startsWith("EVENT-LIFE-")
              ? [hostUserId, participantUserId].map(userActivitiesSnapshot)
            : []
    };
    Q.collection(Q.STATE_COLLECTION).insertOne(state);
    try {
      clearFixture();
      const stagedContext = stageData(selected.stage, stagedAtIso, runtimeContext) || {};
      if (isTournamentMemberRemovalStage(selected.stage)) {
        Object.assign(state.context, stagedContext);
      }
      if (selected.stage.startsWith("invitation-")) {
        synchronizeEventActivityCounters(invitationFixtureUserIds(selected.stage));
      }
      if (isTournamentFixtureStage(selected.stage) && !isTournamentMemberRemovalStage(selected.stage)) {
        synchronizeEventActivityCounters([hostUserId, participantUserId, thirdUserId]);
      }
      if (isTournamentFixtureStage(selected.stage)) {
        state.actionBaselineUserActivitySnapshots = [hostUserId, participantUserId, thirdUserId]
          .map(userActivitiesSnapshot);
        Q.collection(Q.STATE_COLLECTION).updateOne(
          { _id: state._id },
          { $set: {
            context: state.context,
            actionBaselineUserActivitySnapshots: state.actionBaselineUserActivitySnapshots
          } }
        );
      }
      if (checkpointId.startsWith("EVENT-LIFE-")) {
        synchronizeEventActivityCounters([hostUserId, participantUserId]);
      }
      stageFeedbackProjection(selected.stage, stagedAtIso, state);
      if (checkpointId === "EVENT-TICKET-011") {
        state.ticketAttendanceBaseline = ticketAttendanceSnapshot();
        Q.collection(Q.STATE_COLLECTION).updateOne(
          { _id: state._id },
          { $set: { ticketAttendanceBaseline: state.ticketAttendanceBaseline } }
        );
      }
      if (selected.stage === "publish-chat-draft") {
        state.actionBaselineUserActivitySnapshots = [hostUserId, participantUserId, thirdUserId]
          .map(userActivitiesSnapshot);
        Q.collection(Q.STATE_COLLECTION).updateOne(
          { _id: state._id },
          { $set: { actionBaselineUserActivitySnapshots: state.actionBaselineUserActivitySnapshots } }
        );
      }
    } catch (error) {
      Q.fail(`stage failed after snapshot: ${Q.text(error && error.message)}. Run reset event-domain ${checkpointId}.`);
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "baseline-ready",
      stagedAtIso,
      host: Q.user(hostUserId),
      participant: Q.user(participantUserId),
      eventId: EVENT_ID,
      identities: state.context,
      why: selected.why,
      workerExpectation: selected.worker,
      verificationSteps: selected.checks || [],
      baseline: oracle(state),
      next: selected.action,
      expectedVisibleResult: selected.expected
    });
  }

  function requireMatchingState() {
    const state = Q.activeState(SCENARIO, true);
    if (Q.text(state.checkpointId).toUpperCase() !== checkpointId) {
      Q.fail(`staged checkpoint is '${state.checkpointId}', not '${checkpointId}'.`);
    }
    return state;
  }

  function repairTournamentRoomPresentation() {
    if (checkpointId !== "TOURNAMENT-002") {
      Q.fail("repair-tournament-room-presentation is restricted to TOURNAMENT-002.");
    }
    const state = requireMatchingState();
    if (state.fixtureRepairs && state.fixtureRepairs.tournamentRoomPresentation) {
      Q.fail("the TOURNAMENT-002 tournament-room presentation has already been repaired.");
    }

    const parentEvent = Q.collection("events").findOne(manualEventSelector());
    const rooms = Q.collection("events")
      .find(generatedRandomRoomSelector())
      .sort({ sourceId: 1, _id: 1 })
      .toArray();
    if (!parentEvent || Q.text(parentEvent.title) !== "QA TOURNAMENT-002" || rooms.length !== 2) {
      Q.fail("TOURNAMENT-002 requires its exact parent event and two generated rooms before presentation repair.");
    }
    if (!rooms.every((room, index) => (
      Q.text(room.title) === `Random Room R${index + 1}`
      && Q.text(room.eventType) === "random-room"
      && Number(room.acceptedMembers || 0) === (index === 0 ? 2 : 1)
    ))) {
      Q.fail("generated room identity, order, type or accepted occupancy no longer matches the proven TOURNAMENT-002 boundary.");
    }

    const roomIds = rooms.map(room => Q.text(room.sourceId || room._id));
    const chats = Q.collection("chats").find({ id: { $in: roomIds } }).toArray();
    const messages = Q.collection("chatMessages").find({ chatId: { $in: roomIds } }).toArray();
    if (chats.length !== 3
        || chats.reduce((total, chat) => total + Number(chat.unread || 0), 0) !== 3
        || messages.length !== 2
        || !messages.every(message => (
          Q.text(message.id) === "system:random-room-welcome"
          && Q.text(message.clientId) === "random-room-welcome"
        ))) {
      Q.fail("TOURNAMENT-002 chat copies, unread counters or welcome messages no longer match the proven transaction.");
    }

    const repairedAtIso = Q.nowIso();
    const imageUrl = "/media/public?key=images/system/tournament-room/v1/large.webp";
    const welcome = "Welcome to your tournament group for QA TOURNAMENT-002. "
      + "Use this chat to coordinate with your group and follow stage updates.";
    const repairedRooms = [];
    rooms.forEach((room, index) => {
      const roomId = roomIds[index];
      const title = `Tournament Group R${index + 1}`;
      const roomUpdate = Q.collection("events").updateOne({ _id: room._id }, { $set: {
        title,
        subtitle: "Tournament group for QA TOURNAMENT-002.",
        avatar: imageUrl,
        imageUrl,
        eventType: "tournament-room",
        topics: ["#Tournament", "#Competition"],
        mode: "Tournament",
        updatedDate: repairedAtIso,
        updatedUser: Q.ACTOR
      } });
      const chatUpdate = Q.collection("chats").updateMany({ id: roomId }, { $set: {
        title,
        avatar: imageUrl,
        lastMessage: welcome,
        revision: Date.now()
      } });
      const messageUpdate = Q.collection("chatMessages").updateOne({
        chatId: roomId,
        id: "system:random-room-welcome"
      }, { $set: {
        id: "system:tournament-room-welcome",
        clientId: "tournament-room-welcome",
        text: welcome
      } });
      if (roomUpdate.matchedCount !== 1
          || chatUpdate.matchedCount !== Number(room.acceptedMembers || 0)
          || messageUpdate.matchedCount !== 1) {
        Q.fail(`TOURNAMENT-002 presentation repair was incomplete for '${roomId}'.`);
      }
      repairedRooms.push({
        roomId,
        title,
        chatCopies: chatUpdate.modifiedCount,
        welcomeMessages: messageUpdate.modifiedCount
      });
    });

    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: {
      "fixtureRepairs.tournamentRoomPresentation": {
        repairedAtIso,
        imageUrl,
        retainedRoomIds: roomIds,
        retainedMembershipCount: 3,
        retainedChatCopyCount: 3,
        retainedUnreadTotal: 3
      }
    } });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "tournament-room-presentation-repaired",
      repairedAtIso,
      imageUrl,
      repairedRooms,
      retainedTransaction: {
        roomIds,
        memberships: 3,
        chatCopies: 3,
        unreadTotal: 3,
        startReplayed: false
      },
      next: "Reload Casey once, reopen Activities -> Chats -> All, and verify Tournament Group R1 with the trophy avatar and tournament-specific welcome text."
    });
  }

  function repairTournamentRoomNotifications() {
    if (checkpointId !== "TOURNAMENT-002") {
      Q.fail("repair-tournament-room-notifications is restricted to TOURNAMENT-002.");
    }
    const state = requireMatchingState();
    if (!state.fixtureRepairs || !state.fixtureRepairs.tournamentRoomPresentation) {
      Q.fail("repair the TOURNAMENT-002 tournament-room presentation before its notifications.");
    }
    if (state.fixtureRepairs.tournamentRoomNotifications) {
      Q.fail("the TOURNAMENT-002 tournament-room notifications have already been repaired.");
    }

    const parentEvent = Q.collection("events").findOne(manualEventSelector());
    const rooms = Q.collection("events")
      .find(generatedRandomRoomSelector())
      .sort({ sourceId: 1, _id: 1 })
      .toArray();
    if (!parentEvent || Q.text(parentEvent.title) !== "QA TOURNAMENT-002" || rooms.length !== 2) {
      Q.fail("TOURNAMENT-002 requires its exact parent and two generated rooms before notification repair.");
    }
    if (!rooms.every((room, index) => (
      Q.text(room.title) === `Tournament Group R${index + 1}`
      && Q.text(room.eventType) === "tournament-room"
      && Number(room.acceptedMembers || 0) === (index === 0 ? 2 : 1)
    ))) {
      Q.fail("the repaired tournament rooms no longer match the proven TOURNAMENT-002 boundary.");
    }

    const roomIds = rooms.map(room => Q.text(room.sourceId || room._id));
    const expectedRecipients = [
      sortedUnique([hostUserId, participantUserId]),
      sortedUnique([thirdUserId])
    ];
    const outbox = Q.collection("notificationOutbox").find({
      notificationType: "event-random-groups",
      entityId: { $in: roomIds }
    }).sort({ entityId: 1, _id: 1 }).toArray();
    const notifications = Q.collection("userNotifications").find({
      kind: "event-random-groups",
      sourceId: { $in: roomIds }
    }).sort({ sourceId: 1, recipientUserId: 1, _id: 1 }).toArray();
    if (outbox.length !== 2 || notifications.length !== 3) {
      Q.fail("TOURNAMENT-002 requires exactly two room outbox records and three inbox notifications.");
    }

    rooms.forEach((room, index) => {
      const roomId = roomIds[index];
      const oldTitle = `Random Room R${index + 1} is ready`;
      const oldEventTitle = `Random Room R${index + 1}`;
      const oldBody = "Your system-generated room for QA TOURNAMENT-002 is ready.";
      const matchingOutbox = outbox.filter(item => Q.text(item.entityId) === roomId);
      const matchingNotifications = notifications.filter(item => Q.text(item.sourceId) === roomId);
      if (matchingOutbox.length !== 1
          || !sameJson(sortedUnique(matchingOutbox[0].recipientUserIds || []), expectedRecipients[index])
          || Q.text(matchingOutbox[0].status) !== "pending"
          || Q.text(matchingOutbox[0].title) !== oldTitle
          || Q.text(matchingOutbox[0].body) !== oldBody
          || Q.text(matchingOutbox[0].payload && matchingOutbox[0].payload.eventScope) !== "random-room"
          || Q.text(matchingOutbox[0].payload && matchingOutbox[0].payload.eventTitle) !== oldEventTitle
          || Q.text(matchingOutbox[0].iconUrl) !== "/media/public?key=images/system/random-room-default.png"
          || matchingNotifications.length !== expectedRecipients[index].length
          || !sameJson(sortedUnique(matchingNotifications.map(item => item.recipientUserId)), expectedRecipients[index])
          || !matchingNotifications.every(item => (
            Q.text(item.title) === oldTitle
            && Q.text(item.message) === oldBody
            && Q.text(item.payload && item.payload.eventScope) === "random-room"
            && Q.text(item.payload && item.payload.eventTitle) === oldEventTitle
            && Q.text(item.payload && item.payload.icon) === "/media/public?key=images/system/random-room-default.png"
          ))) {
        Q.fail(`TOURNAMENT-002 notification state for '${roomId}' no longer matches the exact repair boundary.`);
      }
    });

    const repairedAtIso = Q.nowIso();
    const imageUrl = "/media/public?key=images/system/tournament-room/v1/large.webp";
    const repaired = [];
    rooms.forEach((room, index) => {
      const roomId = roomIds[index];
      const title = `Tournament Group R${index + 1} is ready`;
      const eventTitle = `Tournament Group R${index + 1}`;
      const body = "Your tournament group for QA TOURNAMENT-002 is ready.";
      const fields = {
        title,
        body,
        iconUrl: imageUrl,
        "payload.title": title,
        "payload.body": body,
        "payload.eventScope": "tournament-room",
        "payload.eventTitle": eventTitle,
        "payload.icon": imageUrl,
        updatedDate: repairedAtIso,
        updatedUser: Q.ACTOR
      };
      const outboxUpdate = Q.collection("notificationOutbox").updateOne({
        notificationType: "event-random-groups",
        entityId: roomId,
        status: "pending"
      }, { $set: fields });
      const notificationUpdate = Q.collection("userNotifications").updateMany({
        kind: "event-random-groups",
        sourceId: roomId
      }, { $set: {
        title,
        message: body,
        "payload.title": title,
        "payload.body": body,
        "payload.eventScope": "tournament-room",
        "payload.eventTitle": eventTitle,
        "payload.icon": imageUrl
      } });
      if (outboxUpdate.matchedCount !== 1
          || notificationUpdate.matchedCount !== expectedRecipients[index].length) {
        Q.fail(`TOURNAMENT-002 notification repair was incomplete for '${roomId}'.`);
      }
      repaired.push({
        roomId,
        title,
        outboxRecords: outboxUpdate.modifiedCount,
        inboxRecords: notificationUpdate.modifiedCount,
        retainedRecipients: expectedRecipients[index]
      });
    });

    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: {
      "fixtureRepairs.tournamentRoomNotifications": {
        repairedAtIso,
        imageUrl,
        retainedRoomIds: roomIds,
        retainedOutboxCount: 2,
        retainedInboxCount: 3
      }
    } });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "tournament-room-notifications-repaired",
      repairedAtIso,
      imageUrl,
      repaired,
      retainedTransaction: {
        roomIds,
        outboxRecords: 2,
        inboxRecords: 3,
        recipients: 3,
        unreadStateChanged: false,
        activityCountersChanged: false,
        startReplayed: false
      },
      next: "Close and reopen Notifications > New in Casey, then verify Tournament Group R1 is ready with the trophy icon and tournament-group body."
    });
  }

  function repairTicketPaymentFixture() {
    if (checkpointId !== "EVENT-TICKET-007") {
      Q.fail("repair-ticket-payment-fixture is restricted to EVENT-TICKET-007.");
    }
    const state = requireMatchingState();
    if (state.fixtureRepairs && state.fixtureRepairs.paymentContamination) {
      Q.fail("the EVENT-TICKET-007 payment contamination has already been repaired.");
    }
    const eventId = activeEventSourceId() || EVENT_ID;
    const eventDocuments = Q.collection("events").find({ sourceId: eventId }).toArray();
    const members = Q.collection("activityMembers").find({
      ownerType: "event",
      ownerId: eventId
    }).toArray();
    const tickets = Q.collection("eventTickets").find({ eventId }).toArray();
    const baskets = Q.collection("eventCheckoutBasketItems").countDocuments({ sourceId: eventId });
    const payments = Q.collection("payments").find({ sourceId: eventId }).toArray();
    const acceptedByUserId = new Map(members.map(member => [
      Q.text(member.userId),
      Q.text(member.status)
    ]));
    if (eventDocuments.length !== 2
        || acceptedByUserId.get(hostUserId) !== "accepted"
        || acceptedByUserId.get(participantUserId) !== "accepted"
        || acceptedByUserId.has(thirdUserId)
        || baskets !== 0
        || tickets.length !== 1
        || Q.text(tickets[0].holderUserId) !== participantUserId
        || Q.text(tickets[0].status) !== "A") {
      Q.fail("EVENT-TICKET-007 is no longer at the untouched staged baseline; retain the evidence and do not repair payments.");
    }
    if (payments.length === 0) {
      Q.fail("no checkpoint-owned payment contamination exists; use the normal status oracle.");
    }
    const unexpectedPayment = payments.find(payment =>
      Q.text(payment.userId) !== participantUserId
      || !["joined", "initiated"].includes(Q.text(payment.bookingStatus))
      || Q.text(payment.cancelledAtIso)
      || Q.text(payment.refundStatus) === "full"
    );
    if (unexpectedPayment) {
      Q.fail("an unexpected payment is attached to the reserved checkpoint event; retain it as evidence and do not mutate it.");
    }
    const paymentSelector = { sourceId: eventId };
    if ((state.snapshots || []).some(snapshot => snapshot.collection === "payments")) {
      Q.fail("the active state already owns a payment snapshot; use normal reset/stage instead of the legacy repair.");
    }
    const repairedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $push: {
        snapshots: {
          collection: "payments",
          selector: paymentSelector,
          documents: []
        }
      },
      $set: {
        "fixtureRepairs.paymentContamination": {
          repairedAtIso,
          removedPaymentIds: payments.map(payment => Q.text(payment._id)),
          reason: "legacy event-domain checkpoints did not own the payments collection"
        }
      }
    });
    const removal = Q.collection("payments").deleteMany(paymentSelector);
    if (removal.deletedCount !== payments.length) {
      Q.fail("the reserved-event payments changed during repair; use reset to restore the guarded empty payment baseline.");
    }
    const refreshedState = requireMatchingState();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "ticket-payment-fixture-repaired",
      repairedAtIso,
      removedPaymentCount: removal.deletedCount,
      baseline: oracle(refreshedState),
      next: "Wait for the existing backend hot-deploy to finish, then replay only Nova's Active Events list before continuing the invitation."
    });
  }

  function prepareTicketInviteCandidate() {
    if (checkpointId !== "EVENT-TICKET-007") {
      Q.fail("prepare-ticket-invite-candidate is restricted to EVENT-TICKET-007.");
    }
    const state = requireMatchingState();
    if (state.fixturePreparations && state.fixturePreparations.ticketInviteCandidate) {
      Q.fail("the EVENT-TICKET-007 invite candidate has already been prepared.");
    }
    const eventId = activeEventSourceId() || EVENT_ID;
    const eventDocuments = Q.collection("events").find({ sourceId: eventId }).toArray();
    const members = Q.collection("activityMembers").find({
      ownerType: "event",
      ownerId: eventId
    }).toArray();
    const acceptedByUserId = new Map(members.map(member => [
      Q.text(member.userId),
      Q.text(member.status)
    ]));
    const targetUser = Q.collection("users").findOne({
      $or: [{ _id: thirdUserId }, { userId: thirdUserId }]
    });
    if (eventDocuments.length !== 2
        || acceptedByUserId.get(hostUserId) !== "accepted"
        || acceptedByUserId.get(participantUserId) !== "accepted"
        || acceptedByUserId.has(thirdUserId)
        || Q.collection("eventCheckoutBasketItems").countDocuments({ sourceId: eventId }) !== 0
        || Q.collection("payments").countDocuments({ sourceId: eventId }) !== 0
        || Q.collection("eventTickets").countDocuments({
          eventId,
          holderUserId: participantUserId,
          status: "A"
        }) !== 1
        || !targetUser
        || Q.text(targetUser.profileStatus).toLowerCase() !== "public") {
      Q.fail("EVENT-TICKET-007 is no longer at the untouched pre-invite baseline; retain the evidence and do not prepare a candidate.");
    }
    if ((state.snapshots || []).some(snapshot => snapshot.collection === "userRates")) {
      Q.fail("the active state already owns the invite-candidate rate snapshot; use normal reset/stage instead of the legacy preparation.");
    }
    const rateSnapshot = Q.snapshotSpecs([
      { collection: "userRates", selector: ticketInviteCandidateRateSelector() }
    ])[0];
    const preparedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $push: { snapshots: rateSnapshot },
      $set: {
        "fixturePreparations.ticketInviteCandidate": {
          preparedAtIso,
          candidateUserId: thirdUserId,
          replacedRateIds: (rateSnapshot.documents || []).map(item => Q.text(item._id))
        }
      }
    });
    Q.collection("userRates").deleteMany(ticketInviteCandidateRateSelector());
    insertTicketInviteCandidateRate(preparedAtIso);
    const refreshedState = requireMatchingState();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "ticket-invite-candidate-ready",
      preparedAtIso,
      candidate: Q.user(thirdUserId),
      baseline: oracle(refreshedState),
      next: "Close and reopen only Nova's Invite members popup; Riley Outside must appear as the sole selectable candidate."
    });
  }

  function prepareTicketInviteeResponseRetest() {
    if (checkpointId !== "EVENT-TICKET-007") {
      Q.fail("prepare-ticket-invitee-response-retest is restricted to EVENT-TICKET-007.");
    }
    const state = requireMatchingState();
    const eventId = activeEventSourceId() || EVENT_ID;
    const eventDocuments = Q.collection("events").find({ sourceId: eventId }).toArray();
    if (eventDocuments.length !== 2 || eventDocuments.some(event =>
      Q.text(event.status) !== "A"
      || Number(event.acceptedMembers || 0) !== 2
      || Number(event.pendingMembers || 0) !== 1
      || !sameIds(event.acceptedMemberUserIds, [hostUserId, participantUserId])
      || !sameIds(event.pendingMemberUserIds, [thirdUserId])
      || !sameIds(event.invitedMemberUserIds, [])
      || !sameIds(event.pendingRequestMemberUserIds, [thirdUserId]))) {
      Q.fail("EVENT-TICKET-007 is not at the exact post-invitee-response event boundary; preserve the current evidence and do not re-arm it.");
    }

    const controlledMembers = Q.collection("activityMembers").find({
      ownerType: "event",
      ownerId: eventId,
      userId: { $in: [hostUserId, participantUserId, thirdUserId] }
    }).toArray();
    const memberByUserId = new Map(controlledMembers.map(member => [Q.text(member.userId), member]));
    const hostMember = memberByUserId.get(hostUserId);
    const participantMember = memberByUserId.get(participantUserId);
    const inviteeMember = memberByUserId.get(thirdUserId);
    if (controlledMembers.length !== 3
        || Q.text(hostMember && hostMember.status) !== "accepted"
        || Q.text(hostMember && hostMember.role) !== "Admin"
        || Q.text(participantMember && participantMember.status) !== "accepted"
        || Q.text(participantMember && participantMember.role) !== "Member"
        || Q.text(inviteeMember && inviteeMember.status) !== "pending"
        || Q.text(inviteeMember && inviteeMember.role) !== "Member"
        || Q.text(inviteeMember && inviteeMember.requestKind) !== "approval"
        || Q.text(inviteeMember && inviteeMember.pendingSource) !== "member"
        || Q.text(inviteeMember && inviteeMember.invitedByUserId)) {
      Q.fail("EVENT-TICKET-007 membership rows are not at the exact Riley pending-approval boundary; preserve the evidence and do not re-arm it.");
    }

    const tickets = Q.collection("eventTickets").find({ eventId }).toArray();
    if (tickets.length !== 1
        || Q.text(tickets[0].holderUserId) !== participantUserId
        || Q.text(tickets[0].status) !== "A"
        || Q.collection("eventCheckoutBasketItems").countDocuments({ sourceId: eventId }) !== 0
        || Q.collection("payments").countDocuments({ sourceId: eventId }) !== 0) {
      Q.fail("EVENT-TICKET-007 ticket/payment invariants changed after Riley's response; preserve the evidence and use a full reset if required.");
    }
    const eventChatCount = Q.collection("chats").countDocuments({
      $or: [{ chatId: eventId }, { eventId }, { ownerId: eventId }]
    });
    const eventChatMessageCount = Q.collection("chatMessages").countDocuments({ chatId: eventId });
    if (eventChatCount !== 0 || eventChatMessageCount !== 0) {
      Q.fail("Riley's non-terminal response unexpectedly produced event chat state; preserve that evidence and do not re-arm it.");
    }

    const inviteeUser = Q.collection("users").findOne({
      $or: [{ _id: thirdUserId }, { userId: thirdUserId }]
    });
    if (!inviteeUser
        || nestedNumber(inviteeUser, "activities.events") !== 0
        || nestedNumber(inviteeUser, "activities.invitations") !== 0
        || nestedNumber(inviteeUser, "activities.tickets") !== 0
        || nestedNumber(inviteeUser, "activities.asset.tickets") !== 0
        || nestedNumber(inviteeUser, "activities.event.all") !== 1
        || nestedNumber(inviteeUser, "activities.event.active") !== 0
        || nestedNumber(inviteeUser, "activities.event.pending") !== 1
        || nestedNumber(inviteeUser, "activities.event.invitations") !== 0) {
      Q.fail("Riley's stored activity counters are not at the exact post-response ticketless boundary; preserve the evidence and do not re-arm it.");
    }

    const invitationNotificationSelector = {
      recipientUserId: thirdUserId,
      kind: "event-invite",
      $or: [{ sourceId: eventId }, { "payload.eventId": eventId }]
    };
    const invitationNotifications = Q.collection("userNotifications")
      .find(invitationNotificationSelector)
      .toArray();
    if (invitationNotifications.length !== 1 || !Q.text(invitationNotifications[0].readAtIso)) {
      Q.fail("Riley's single event-invite notification is not in the resolved state required for a focused response replay.");
    }

    const joinRequestOutboxSelector = {
      notificationType: "event-admin-join-request",
      "payload.memberUserId": thirdUserId,
      $or: [{ entityId: eventId }, { "payload.eventId": eventId }]
    };
    const joinRequestNotificationSelector = {
      recipientUserId: hostUserId,
      kind: "event-admin-join-request",
      "payload.memberUserId": thirdUserId,
      $or: [{ sourceId: eventId }, { "payload.eventId": eventId }]
    };
    const joinRequestOutbox = Q.collection("notificationOutbox")
      .find(joinRequestOutboxSelector)
      .toArray();
    const joinRequestNotifications = Q.collection("userNotifications")
      .find(joinRequestNotificationSelector)
      .toArray();
    if (joinRequestOutbox.length !== 1 || joinRequestNotifications.length !== 1) {
      Q.fail("Riley's response-owned Admin join-request artifacts are not exact-once; preserve the evidence and do not re-arm it.");
    }

    const preparedAtIso = Q.nowIso();
    const eventUpdate = Q.collection("events").updateMany({
      _id: { $in: eventDocuments.map(event => event._id) }
    }, {
      $set: {
        invitedMemberUserIds: [thirdUserId],
        pendingRequestMemberUserIds: [],
        updatedDate: preparedAtIso,
        updatedUser: Q.ACTOR
      }
    });
    if (eventUpdate.matchedCount !== eventDocuments.length) {
      Q.fail("the EVENT-TICKET-007 event projection changed while Riley's response replay was being prepared.");
    }
    const memberUpdate = Q.collection("activityMembers").updateOne({
      _id: inviteeMember._id,
      status: "pending",
      requestKind: "approval",
      pendingSource: "member"
    }, {
      $set: {
        status: "pending",
        role: "Member",
        pendingSource: "admin",
        requestKind: "invite",
        invitedByUserId: participantUserId,
        actionAtIso: preparedAtIso,
        updatedDate: preparedAtIso,
        updatedUser: Q.ACTOR
      }
    });
    if (memberUpdate.matchedCount !== 1) {
      Q.fail("Riley's membership changed while the response replay was being prepared.");
    }
    const activityUpdate = Q.collection("users").updateOne({ _id: inviteeUser._id }, {
      $set: {
        "activities.invitations": 1,
        "activities.event.pending": 0,
        "activities.event.invitations": 1
      }
    });
    if (activityUpdate.matchedCount !== 1) {
      Q.fail("Riley's user activity projection disappeared while the response replay was being prepared.");
    }
    const inviteReset = Q.collection("userNotifications").updateOne(
      invitationNotificationSelector,
      { $set: { readAtIso: null, updatedDate: preparedAtIso } }
    );
    if (inviteReset.matchedCount !== 1) {
      Q.fail("Riley's invitation notification changed while the response replay was being prepared.");
    }
    const outboxRemoval = Q.collection("notificationOutbox").deleteMany(joinRequestOutboxSelector);
    const notificationRemoval = Q.collection("userNotifications").deleteMany(joinRequestNotificationSelector);
    if (outboxRemoval.deletedCount !== 1 || notificationRemoval.deletedCount !== 1) {
      Q.fail("Riley's response-owned join-request artifacts changed while the response replay was being prepared.");
    }
    for (const userId of [hostUserId, participantUserId, thirdUserId]) {
      const unreadNotifications = Q.collection("userNotifications").countDocuments({
        recipientUserId: userId,
        $or: [{ readAtIso: { $exists: false } }, { readAtIso: null }]
      });
      Q.collection("users").updateOne({
        $or: [{ _id: userId }, { userId }]
      }, {
        $set: { "activities.notifications": unreadNotifications }
      });
    }

    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: { "context.actualEventSourceId": eventId },
      $push: {
        ticketInviteeResponseRetests: {
          preparedAtIso,
          eventId,
          inviteeUserId: thirdUserId,
          inviterUserId: participantUserId,
          eventAdminUserId: hostUserId,
          retainedTicketId: Q.text(tickets[0]._id),
          retainedTicketCode: Q.text(tickets[0].code),
          removedJoinRequestOutboxId: Q.text(joinRequestOutbox[0]._id),
          removedJoinRequestNotificationId: Q.text(joinRequestNotifications[0]._id)
        }
      }
    });
    const refreshedState = requireMatchingState();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "ticket-invitee-response-retest-ready",
      preparedAtIso,
      eventId,
      invitee: Q.user(thirdUserId),
      inviter: Q.user(participantUserId),
      eventAdmin: Q.user(hostUserId),
      retainedTicket: {
        id: Q.text(tickets[0]._id),
        code: Q.text(tickets[0].code),
        holderUserId: Q.text(tickets[0].holderUserId),
        status: Q.text(tickets[0].status)
      },
      baseline: oracle(refreshedState),
      next: "Let Riley's existing Activities surface reach the prepared Invitations 1 baseline through its normal read, or close/reopen only Invitations if it loads on demand; use a full document reload only if that baseline cannot otherwise be reached. Accept QA EVENT-TICKET-007 exactly once, then without reloading immediately verify Invitations removal, Pending counter 1 and the same Pending row. Leave Casey and Nova untouched."
    });
  }

  function prepareTicketAdminApprovalRetest() {
    if (checkpointId !== "EVENT-TICKET-007") {
      Q.fail("prepare-ticket-admin-approval-retest is restricted to EVENT-TICKET-007.");
    }
    const state = requireMatchingState();
    const eventId = activeEventSourceId() || EVENT_ID;
    const eventDocuments = Q.collection("events").find({ sourceId: eventId }).toArray();
    const inviteeOverlay = eventDocuments.filter(event => Q.text(event.ownerUserId) === thirdUserId);
    if (eventDocuments.length !== 3
        || inviteeOverlay.length !== 1
        || eventDocuments.some(event =>
          Q.text(event.status) !== "A"
          || Number(event.acceptedMembers || 0) !== 3
          || Number(event.pendingMembers || 0) !== 0
          || !sameIds(event.acceptedMemberUserIds, [hostUserId, participantUserId, thirdUserId])
          || !sameIds(event.pendingMemberUserIds, [])
          || !sameIds(event.invitedMemberUserIds, [])
          || !sameIds(event.pendingRequestMemberUserIds, []))) {
      Q.fail("EVENT-TICKET-007 is not at the exact post-Admin-approval event boundary; preserve the current evidence and do not re-arm it.");
    }

    const controlledMembers = Q.collection("activityMembers").find({
      ownerType: "event",
      ownerId: eventId,
      userId: { $in: [hostUserId, participantUserId, thirdUserId] }
    }).toArray();
    const memberByUserId = new Map(controlledMembers.map(member => [Q.text(member.userId), member]));
    const hostMember = memberByUserId.get(hostUserId);
    const participantMember = memberByUserId.get(participantUserId);
    const inviteeMember = memberByUserId.get(thirdUserId);
    if (controlledMembers.length !== 3
        || Q.text(hostMember && hostMember.status) !== "accepted"
        || Q.text(hostMember && hostMember.role) !== "Admin"
        || Q.text(participantMember && participantMember.status) !== "accepted"
        || Q.text(participantMember && participantMember.role) !== "Member"
        || Q.text(inviteeMember && inviteeMember.status) !== "accepted"
        || Q.text(inviteeMember && inviteeMember.role) !== "Member") {
      Q.fail("EVENT-TICKET-007 membership rows are not at the exact post-approval boundary; preserve the current evidence and do not re-arm it.");
    }

    const tickets = Q.collection("eventTickets").find({ eventId }).toArray();
    const participantTicket = tickets.find(ticket => Q.text(ticket.holderUserId) === participantUserId);
    const inviteeTicket = tickets.find(ticket => Q.text(ticket.holderUserId) === thirdUserId);
    if (tickets.length !== 2
        || !participantTicket
        || Q.text(participantTicket._id) !== `${PREFIX}:ticket`
        || Q.text(participantTicket.code) !== Q.text(state.context && state.context.ticketCode)
        || Q.text(participantTicket.status) !== "A"
        || !inviteeTicket
        || Q.text(inviteeTicket.status) !== "A"
        || Q.collection("eventCheckoutBasketItems").countDocuments({ sourceId: eventId }) !== 0
        || Q.collection("payments").countDocuments({ sourceId: eventId }) !== 0) {
      Q.fail("EVENT-TICKET-007 ticket/payment invariants are not at the exact terminal-approval boundary; preserve the evidence and do not re-arm it.");
    }

    const usersById = new Map([hostUserId, participantUserId, thirdUserId].map(userId => [
      userId,
      Q.collection("users").findOne({ $or: [{ _id: userId }, { userId }] })
    ]));
    const hostUser = usersById.get(hostUserId);
    const participantUser = usersById.get(participantUserId);
    const inviteeUser = usersById.get(thirdUserId);
    if (!hostUser || !participantUser || !inviteeUser
        || nestedNumber(hostUser, "activities.tickets") !== 0
        || nestedNumber(hostUser, "activities.asset.tickets") !== 0
        || nestedNumber(participantUser, "activities.tickets") !== 1
        || nestedNumber(participantUser, "activities.asset.tickets") !== 1
        || nestedNumber(inviteeUser, "activities.events") !== 1
        || nestedNumber(inviteeUser, "activities.tickets") !== 1
        || nestedNumber(inviteeUser, "activities.asset.tickets") !== 1
        || nestedNumber(inviteeUser, "activities.event.all") !== 1
        || nestedNumber(inviteeUser, "activities.event.active") !== 1
        || nestedNumber(inviteeUser, "activities.event.pending") !== 0
        || nestedNumber(inviteeUser, "activities.event.invitations") !== 0) {
      Q.fail("EVENT-TICKET-007 stored user counters are not at the exact post-approval boundary; preserve the evidence and do not re-arm it.");
    }

    const invitationNotificationSelector = {
      recipientUserId: thirdUserId,
      kind: "event-invite",
      $or: [{ sourceId: eventId }, { "payload.eventId": eventId }]
    };
    const invitationNotifications = Q.collection("userNotifications")
      .find(invitationNotificationSelector)
      .toArray();
    if (invitationNotifications.length !== 1 || !Q.text(invitationNotifications[0].readAtIso)) {
      Q.fail("Riley's original event-invite notification is not in the resolved post-response state required for the approval replay.");
    }

    const joinRequestNotificationSelector = {
      recipientUserId: hostUserId,
      kind: "event-admin-join-request",
      "payload.memberUserId": thirdUserId,
      $or: [{ sourceId: eventId }, { "payload.eventId": eventId }]
    };
    if (Q.collection("userNotifications").countDocuments(joinRequestNotificationSelector) !== 1) {
      Q.fail("Riley's response-owned Casey join-request notification is not exact-once; preserve the evidence and do not re-arm approval.");
    }

    const approvalOutboxSelector = {
      notificationType: "event-member-approved",
      "payload.memberUserId": thirdUserId,
      $or: [{ entityId: eventId }, { "payload.eventId": eventId }]
    };
    const approvalNotificationSelector = {
      recipientUserId: thirdUserId,
      kind: "event-member-approved",
      "payload.memberUserId": thirdUserId,
      $or: [{ sourceId: eventId }, { "payload.eventId": eventId }]
    };
    const approvalOutbox = Q.collection("notificationOutbox").find(approvalOutboxSelector).toArray();
    const approvalNotifications = Q.collection("userNotifications").find(approvalNotificationSelector).toArray();
    if (approvalOutbox.length > 1 || approvalNotifications.length > 1) {
      Q.fail("Admin approval notification artifacts are not exact-once; preserve the duplicate evidence and do not re-arm approval.");
    }

    const eventChats = Q.collection("chats").find({
      $or: [{ chatId: eventId }, { eventId }, { ownerId: eventId }]
    }).toArray();
    const chatMemberSetsMatch = eventChats.every(chat =>
      Q.text(chat.channelType) === "mainEvent"
      && sameIds(chat.memberIds || [], [hostUserId, participantUserId, thirdUserId]));
    const eventChatMessages = Q.collection("chatMessages").find({ chatId: eventId }).toArray();
    if (eventChats.length !== 3
        || !chatMemberSetsMatch
        || eventChatMessages.length !== 1
        || Q.text(eventChatMessages[0].clientId) !== "member-joined"
        || Q.text(eventChatMessages[0].text) !== `${Q.user(thirdUserId).name} joined the event.`
        || Q.collection("notificationOutbox").countDocuments({
          notificationType: "chat-message",
          $or: [{ entityId: eventId }, { "payload.chatId": eventId }]
        }) !== 0
        || Q.collection("userNotifications").countDocuments({
          kind: "chat-message",
          $or: [{ sourceId: eventId }, { "payload.chatId": eventId }]
        }) !== 0) {
      Q.fail("EVENT-TICKET-007 approval-owned chat state is not the exact three-projection/one-system-message boundary; preserve the evidence and do not re-arm it.");
    }

    const savedActivitiesByUserId = new Map([hostUserId, participantUserId, thirdUserId].map(userId => {
      const saved = savedUserActivity(state, userId);
      if (!saved || !saved.activities || !saved.activities.present) {
        Q.fail(`EVENT-TICKET-007 has no saved pre-stage activity baseline for '${userId}'.`);
      }
      return [userId, saved.activities.value || {}];
    }));
    const preparedAtIso = Q.nowIso();

    const overlayRemoval = Q.collection("events").deleteOne({ _id: inviteeOverlay[0]._id });
    if (overlayRemoval.deletedCount !== 1) {
      Q.fail("Riley's approval-owned event overlay changed while approval replay was being prepared.");
    }
    const eventUpdate = Q.collection("events").updateMany({ sourceId: eventId }, { $set: {
      acceptedMembers: 2,
      pendingMembers: 1,
      acceptedMemberUserIds: [hostUserId, participantUserId],
      pendingMemberUserIds: [thirdUserId],
      invitedMemberUserIds: [],
      pendingRequestMemberUserIds: [thirdUserId],
      updatedDate: preparedAtIso,
      updatedUser: Q.ACTOR
    } });
    if (eventUpdate.matchedCount !== 2) {
      Q.fail("the retained EVENT-TICKET-007 event projections changed while approval replay was being prepared.");
    }
    const memberUpdate = Q.collection("activityMembers").updateOne({ _id: inviteeMember._id }, {
      $set: {
        status: "pending",
        role: "Member",
        pendingSource: "member",
        requestKind: "approval",
        actionAtIso: preparedAtIso,
        updatedDate: preparedAtIso,
        updatedUser: Q.ACTOR
      },
      $unset: { invitedByUserId: "" }
    });
    if (memberUpdate.matchedCount !== 1) {
      Q.fail("Riley's accepted membership changed while approval replay was being prepared.");
    }
    const ticketRemoval = Q.collection("eventTickets").deleteOne({ _id: inviteeTicket._id });
    if (ticketRemoval.deletedCount !== 1) {
      Q.fail("Riley's approval-owned ticket changed while approval replay was being prepared.");
    }
    const messageRemoval = Q.collection("chatMessages").deleteMany({ chatId: eventId });
    const chatRemoval = Q.collection("chats").deleteMany({
      $or: [{ chatId: eventId }, { eventId }, { ownerId: eventId }]
    });
    if (messageRemoval.deletedCount !== 1 || chatRemoval.deletedCount !== 3) {
      Q.fail("the approval-owned event chat changed while approval replay was being prepared.");
    }
    const approvalOutboxRemoval = Q.collection("notificationOutbox").deleteMany(approvalOutboxSelector);
    const approvalNotificationRemoval = Q.collection("userNotifications").deleteMany(approvalNotificationSelector);
    if (approvalOutboxRemoval.deletedCount !== approvalOutbox.length
        || approvalNotificationRemoval.deletedCount !== approvalNotifications.length) {
      Q.fail("the approval notification artifacts changed while approval replay was being prepared.");
    }
    const recomputeTaskRemoval = Q.collection("affinityRecomputeTasks").deleteMany({
      targetId: eventId,
      updatedDate: { $gt: state.stagedAtIso }
    });

    for (const userId of [hostUserId, participantUserId, thirdUserId]) {
      const baselineActivities = savedActivitiesByUserId.get(userId);
      const baselineChat = baselineActivities.chat || {};
      const update = {
        "activities.chats": nestedNumber(baselineActivities, "chats"),
        "activities.chat": baselineChat
      };
      if (userId === thirdUserId) {
        update["activities.events"] = nestedNumber(baselineActivities, "events");
        update["activities.tickets"] = nestedNumber(baselineActivities, "tickets");
        update["activities.asset.tickets"] = nestedNumber(baselineActivities, "asset.tickets");
        update["activities.event.all"] = nestedNumber(baselineActivities, "event.all") + 1;
        update["activities.event.active"] = nestedNumber(baselineActivities, "event.active");
        update["activities.event.pending"] = nestedNumber(baselineActivities, "event.pending") + 1;
        update["activities.event.invitations"] = nestedNumber(baselineActivities, "event.invitations");
      }
      const userUpdate = Q.collection("users").updateOne({
        $or: [{ _id: userId }, { userId }]
      }, { $set: update });
      if (userUpdate.matchedCount !== 1) {
        Q.fail(`user '${userId}' disappeared while approval-owned activity counters were restored.`);
      }
    }
    for (const userId of [hostUserId, participantUserId, thirdUserId]) {
      const unreadNotifications = Q.collection("userNotifications").countDocuments({
        recipientUserId: userId,
        $or: [{ readAtIso: { $exists: false } }, { readAtIso: null }]
      });
      Q.collection("users").updateOne({
        $or: [{ _id: userId }, { userId }]
      }, {
        $set: { "activities.notifications": unreadNotifications }
      });
    }

    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: { "context.actualEventSourceId": eventId },
      $push: {
        ticketAdminApprovalRetests: {
          preparedAtIso,
          eventId,
          eventAdminUserId: hostUserId,
          inviteeUserId: thirdUserId,
          retainedTicketId: Q.text(participantTicket._id),
          retainedTicketCode: Q.text(participantTicket.code),
          removedInviteeTicketId: Q.text(inviteeTicket._id),
          removedInviteeTicketCode: Q.text(inviteeTicket.code),
          removedApprovalOutboxIds: approvalOutbox.map(item => Q.text(item._id)),
          removedApprovalNotificationIds: approvalNotifications.map(item => Q.text(item._id)),
          removedRecomputeTaskCount: recomputeTaskRemoval.deletedCount
        }
      }
    });
    const refreshedState = requireMatchingState();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "ticket-admin-approval-retest-ready",
      preparedAtIso,
      eventId,
      eventAdmin: Q.user(hostUserId),
      invitee: Q.user(thirdUserId),
      retainedParticipantTicket: {
        id: Q.text(participantTicket._id),
        code: Q.text(participantTicket.code),
        status: Q.text(participantTicket.status)
      },
      removedFailedApprovalTicket: {
        id: Q.text(inviteeTicket._id),
        code: Q.text(inviteeTicket.code)
      },
      baseline: oracle(refreshedState),
      next: "Close and reopen only Casey's EVENT-TICKET-007 Members surface if needed so Riley is shown as pending, then Approve Riley exactly once. Before opening or clicking Riley's notification, verify its normal poll exposes one unread event-member-approved row in Notifications > New."
    });
  }

  function prepareInvitationAdminApprovalRetest() {
    if (checkpointId !== "EVENT-INV-004") {
      Q.fail("prepare-invitation-admin-approval-retest is restricted to EVENT-INV-004.");
    }
    const state = requireMatchingState();
    const eventId = activeEventSourceId() || EVENT_ID;
    const eventDocuments = Q.collection("events").find({ sourceId: eventId }).toArray();
    if (eventDocuments.length !== 1
        || eventDocuments.some(event =>
          Q.text(event.status) !== "A"
          || Number(event.acceptedMembers || 0) !== 3
          || Number(event.pendingMembers || 0) !== 0
          || !sameIds(event.acceptedMemberUserIds, [hostUserId, participantUserId, thirdUserId])
          || !sameIds(event.pendingMemberUserIds, [])
          || !sameIds(event.invitedMemberUserIds, [])
          || !sameIds(event.pendingRequestMemberUserIds, []))) {
      Q.fail("EVENT-INV-004 is not at the exact post-Admin-approval event boundary; preserve the evidence and do not re-arm it.");
    }

    const controlledMembers = Q.collection("activityMembers").find({
      ownerType: "event",
      ownerId: eventId,
      userId: { $in: [hostUserId, participantUserId, thirdUserId] }
    }).toArray();
    const memberByUserId = new Map(controlledMembers.map(member => [Q.text(member.userId), member]));
    const hostMember = memberByUserId.get(hostUserId);
    const participantMember = memberByUserId.get(participantUserId);
    const inviteeMember = memberByUserId.get(thirdUserId);
    if (controlledMembers.length !== 3
        || Q.text(hostMember && hostMember.status) !== "accepted"
        || Q.text(hostMember && hostMember.role) !== "Admin"
        || Q.text(participantMember && participantMember.status) !== "accepted"
        || Q.text(participantMember && participantMember.role) !== "Member"
        || Q.text(inviteeMember && inviteeMember.status) !== "accepted"
        || Q.text(inviteeMember && inviteeMember.role) !== "Member") {
      Q.fail("EVENT-INV-004 membership rows are not at the exact post-approval boundary; preserve the evidence and do not re-arm it.");
    }
    if (Q.collection("eventTickets").countDocuments({ eventId }) !== 0
        || Q.collection("eventCheckoutBasketItems").countDocuments({ sourceId: eventId }) !== 0
        || Q.collection("payments").countDocuments({ sourceId: eventId }) !== 0) {
      Q.fail("EVENT-INV-004 gained ticket or payment artifacts; preserve the evidence and do not re-arm it.");
    }

    const joinRequestNotificationSelector = {
      recipientUserId: hostUserId,
      kind: "event-admin-join-request",
      "payload.memberUserId": thirdUserId,
      $or: [{ sourceId: eventId }, { "payload.eventId": eventId }]
    };
    if (Q.collection("userNotifications").countDocuments(joinRequestNotificationSelector) !== 1) {
      Q.fail("Riley's response-owned Casey join-request notification is not exact-once; preserve the evidence and do not re-arm approval.");
    }
    const approvalOutboxSelector = {
      notificationType: "event-member-approved",
      "payload.memberUserId": thirdUserId,
      $or: [{ entityId: eventId }, { "payload.eventId": eventId }]
    };
    const approvalNotificationSelector = {
      recipientUserId: thirdUserId,
      kind: "event-member-approved",
      "payload.memberUserId": thirdUserId,
      $or: [{ sourceId: eventId }, { "payload.eventId": eventId }]
    };
    const approvalOutbox = Q.collection("notificationOutbox").find(approvalOutboxSelector).toArray();
    const approvalNotifications = Q.collection("userNotifications").find(approvalNotificationSelector).toArray();
    if (approvalOutbox.length !== 1 || approvalNotifications.length !== 1) {
      Q.fail("EVENT-INV-004 approval notification artifacts are not exact-once; preserve the evidence and do not re-arm it.");
    }

    const eventChatSelector = { $or: [{ chatId: eventId }, { eventId }, { ownerId: eventId }] };
    const eventChats = Q.collection("chats").find(eventChatSelector).toArray();
    const eventChatMessages = Q.collection("chatMessages").find({ chatId: eventId }).toArray();
    if (eventChats.length !== 3
        || eventChats.some(chat =>
          Q.text(chat.channelType) !== "mainEvent"
          || Number(chat.unread || 0) !== 1
          || !sameIds(chat.memberIds || [], [hostUserId, participantUserId, thirdUserId]))
        || eventChatMessages.length !== 1
        || Q.text(eventChatMessages[0].clientId) !== "member-joined"
        || Q.text(eventChatMessages[0].text) !== `${Q.user(thirdUserId).name} joined the event.`
        || Q.collection("notificationOutbox").countDocuments({
          notificationType: "chat-message",
          $or: [{ entityId: eventId }, { "payload.chatId": eventId }]
        }) !== 0
        || Q.collection("userNotifications").countDocuments({
          kind: "chat-message",
          $or: [{ sourceId: eventId }, { "payload.chatId": eventId }]
        }) !== 0) {
      Q.fail("EVENT-INV-004 approval-owned chat state is not the exact three-projection/one-system-message boundary; preserve the evidence and do not re-arm it.");
    }

    const savedActivitiesByUserId = new Map([hostUserId, participantUserId, thirdUserId].map(userId => {
      const saved = savedUserActivity(state, userId);
      if (!saved || !saved.activities || !saved.activities.present) {
        Q.fail(`EVENT-INV-004 has no saved pre-stage activity baseline for '${userId}'.`);
      }
      return [userId, saved.activities.value || {}];
    }));
    for (const userId of [hostUserId, participantUserId, thirdUserId]) {
      const user = Q.collection("users").findOne({ $or: [{ _id: userId }, { userId }] });
      const baseline = savedActivitiesByUserId.get(userId);
      if (!user
          || nestedNumber(user, "activities.chats") !== nestedNumber(baseline, "chats") + 1
          || nestedNumber(user, "activities.chat.all") !== nestedNumber(baseline, "chat.all") + 1
          || nestedNumber(user, "activities.chat.event") !== nestedNumber(baseline, "chat.event") + 1) {
        Q.fail(`EVENT-INV-004 user '${userId}' is not at the exact post-approval chat-counter boundary.`);
      }
    }

    const preparedAtIso = Q.nowIso();
    const eventUpdate = Q.collection("events").updateOne({ _id: eventDocuments[0]._id }, { $set: {
      acceptedMembers: 2,
      pendingMembers: 1,
      acceptedMemberUserIds: [hostUserId, participantUserId],
      pendingMemberUserIds: [thirdUserId],
      invitedMemberUserIds: [],
      pendingRequestMemberUserIds: [thirdUserId],
      updatedDate: preparedAtIso,
      updatedUser: Q.ACTOR
    } });
    const memberUpdate = Q.collection("activityMembers").updateOne({ _id: inviteeMember._id }, {
      $set: {
        status: "pending",
        role: "Member",
        pendingSource: "member",
        requestKind: "approval",
        actionAtIso: preparedAtIso,
        updatedDate: preparedAtIso,
        updatedUser: Q.ACTOR
      },
      $unset: { invitedByUserId: "" }
    });
    const messageRemoval = Q.collection("chatMessages").deleteOne({ _id: eventChatMessages[0]._id });
    const chatRemoval = Q.collection("chats").deleteMany(eventChatSelector);
    const approvalOutboxRemoval = Q.collection("notificationOutbox").deleteOne({ _id: approvalOutbox[0]._id });
    const approvalNotificationRemoval = Q.collection("userNotifications").deleteOne({ _id: approvalNotifications[0]._id });
    if (eventUpdate.matchedCount !== 1
        || memberUpdate.matchedCount !== 1
        || messageRemoval.deletedCount !== 1
        || chatRemoval.deletedCount !== 3
        || approvalOutboxRemoval.deletedCount !== 1
        || approvalNotificationRemoval.deletedCount !== 1) {
      Q.fail("EVENT-INV-004 terminal artifacts changed during the guarded approval replay preparation.");
    }
    const recomputeTaskRemoval = Q.collection("affinityRecomputeTasks").deleteMany({
      targetId: eventId,
      updatedDate: { $gt: state.stagedAtIso }
    });

    for (const userId of [hostUserId, participantUserId, thirdUserId]) {
      const baseline = savedActivitiesByUserId.get(userId);
      const update = {
        "activities.chats": nestedNumber(baseline, "chats"),
        "activities.chat": baseline.chat || {}
      };
      if (userId === thirdUserId) {
        update["activities.events"] = nestedNumber(baseline, "events");
        update["activities.event.all"] = nestedNumber(baseline, "event.all") + 1;
        update["activities.event.active"] = nestedNumber(baseline, "event.active");
        update["activities.event.pending"] = nestedNumber(baseline, "event.pending") + 1;
        update["activities.event.invitations"] = nestedNumber(baseline, "event.invitations");
      }
      const userUpdate = Q.collection("users").updateOne(
        { $or: [{ _id: userId }, { userId }] },
        { $set: update }
      );
      if (userUpdate.matchedCount !== 1) {
        Q.fail(`user '${userId}' disappeared while approval-owned counters were restored.`);
      }
    }
    for (const userId of [hostUserId, participantUserId, thirdUserId]) {
      const unreadNotifications = Q.collection("userNotifications").countDocuments({
        recipientUserId: userId,
        $or: [{ readAtIso: { $exists: false } }, { readAtIso: null }]
      });
      Q.collection("users").updateOne(
        { $or: [{ _id: userId }, { userId }] },
        { $set: { "activities.notifications": unreadNotifications } }
      );
    }
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: { "context.actualEventSourceId": eventId },
      $push: {
        invitationAdminApprovalRetests: {
          preparedAtIso,
          eventId,
          eventAdminUserId: hostUserId,
          inviteeUserId: thirdUserId,
          removedApprovalOutboxId: Q.text(approvalOutbox[0]._id),
          removedApprovalNotificationId: Q.text(approvalNotifications[0]._id),
          removedRecomputeTaskCount: recomputeTaskRemoval.deletedCount
        }
      }
    });
    const refreshedState = requireMatchingState();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "invitation-admin-approval-retest-ready",
      preparedAtIso,
      eventId,
      eventAdmin: Q.user(hostUserId),
      invitee: Q.user(thirdUserId),
      baseline: oracle(refreshedState),
      next: "Keep Casey's Members popup open, expose Riley's pending row through its normal member poll, and Approve Riley exactly once. The action response must change Casey Chats 0->1 immediately while the popup remains open; then retain the popup for a later member poll and close/reopen read check."
    });
  }

  function prepareVisibilitySaveRetest() {
    if (checkpointId !== "EVENT-VISIBILITY-001") {
      Q.fail("prepare-visibility-save-retest is restricted to EVENT-VISIBILITY-001.");
    }
    const state = requireMatchingState();
    const eventId = activeEventSourceId() || EVENT_ID;
    const eventDocuments = Q.collection("events").find({ sourceId: eventId }).toArray();
    if (eventDocuments.length !== 3
        || eventDocuments.some(event =>
          Q.text(event.status) !== "A"
          || event.ticketing !== true
          || Q.text(event.visibility).toLowerCase() !== "friends only"
          || Number(event.acceptedMembers || 0) !== 3
          || Number(event.pendingMembers || 0) !== 0
          || !sameIds(event.acceptedMemberUserIds, [hostUserId, participantUserId, thirdUserId])
          || !sameIds(event.pendingMemberUserIds, [])
          || !sameIds(event.invitedMemberUserIds, [])
          || !sameIds(event.pendingRequestMemberUserIds, []))) {
      Q.fail("EVENT-VISIBILITY-001 is not at the exact active Friends only post-Publish boundary; preserve the evidence and do not re-arm Save.");
    }

    const controlledMembers = Q.collection("activityMembers").find({
      ownerType: "event",
      ownerId: eventId,
      userId: { $in: [hostUserId, participantUserId, thirdUserId] }
    }).toArray();
    if (controlledMembers.length !== 3
        || controlledMembers.some(member => Q.text(member.status) !== "accepted")
        || controlledMembers.filter(member => Q.text(member.role) === "Admin").length !== 1
        || Q.text(controlledMembers.find(member => Q.text(member.role) === "Admin").userId) !== hostUserId) {
      Q.fail("EVENT-VISIBILITY-001 membership is not the exact retained three-accepted boundary; preserve the evidence and do not re-arm Save.");
    }

    const tickets = Q.collection("eventTickets").find({ eventId }).toArray();
    const activeTickets = tickets.filter(ticket => Q.text(ticket.status) === "A");
    const deletedTickets = tickets.filter(ticket => Q.text(ticket.status) === "D");
    if (tickets.length !== 4
        || activeTickets.length !== 2
        || deletedTickets.length !== 2
        || !sameIds(activeTickets.map(ticket => ticket.holderUserId), [participantUserId, thirdUserId])
        || !sameIds(deletedTickets.map(ticket => ticket.holderUserId), [participantUserId, thirdUserId])) {
      Q.fail("EVENT-VISIBILITY-001 ticket history is not the exact two-D plus two-A post-Publish boundary; preserve the evidence and do not re-arm Save.");
    }
    for (const userId of [participantUserId, thirdUserId]) {
      const user = Q.collection("users").findOne({ $or: [{ _id: userId }, { userId }] });
      if (!user
          || nestedNumber(user, "activities.tickets") !== 1
          || nestedNumber(user, "activities.asset.tickets") !== 1) {
        Q.fail(`user '${userId}' is not at the exact active-ticket counter boundary; preserve the evidence and do not re-arm Save.`);
      }
    }

    const failedTaskSelector = {
      taskKey: `event-definition-changed:${eventId}`,
      actionKey: "event.definition.changed",
      eventId
    };
    const failedTasks = Q.collection("scheduledMessageTasks").find(failedTaskSelector).toArray();
    const failedOutboxSelector = {
      notificationType: "event-details-changed",
      $or: [{ entityId: eventId }, { "payload.eventId": eventId }]
    };
    const failedNotificationSelector = {
      kind: "event-details-changed",
      $or: [{ sourceId: eventId }, { "payload.eventId": eventId }]
    };
    const failedOutbox = Q.collection("notificationOutbox").find(failedOutboxSelector).toArray();
    const failedNotifications = Q.collection("userNotifications").find(failedNotificationSelector).toArray();
    const failedReasons = failedTasks.length === 1
      ? Q.text(failedTasks[0].payload && failedTasks[0].payload.changeReasons).split(",").map(Q.text).filter(Boolean)
      : [];
    if (failedTasks.length !== 1
        || !sameIds(failedReasons, ["schedule", "sub-events"])
        || failedOutbox.length !== 2
        || failedNotifications.length !== 2
        || !sameIds(failedOutbox.flatMap(item => item.recipientUserIds || []), [participantUserId, thirdUserId])
        || !sameIds(failedNotifications.map(item => item.recipientUserId), [participantUserId, thirdUserId])) {
      Q.fail("The visibility-only Save failure artifacts are no longer the exact one task/two-recipient occurrence; preserve the evidence and do not re-arm Save.");
    }

    const preparedAtIso = Q.nowIso();
    const eventUpdate = Q.collection("events").updateMany({ sourceId: eventId }, {
      $set: {
        status: "DR",
        published: false,
        isTrashed: false,
        visibility: "public",
        updatedDate: preparedAtIso,
        updatedUser: Q.ACTOR
      }
    });
    if (eventUpdate.matchedCount !== 3) {
      Q.fail("The retained event projections changed while the visibility Save replay was being prepared.");
    }
    const canonicalUpdate = Q.collection("events").updateOne({
      sourceId: eventId,
      ownerUserId: hostUserId
    }, {
      $unset: { frequency: "", slotsEnabled: "" },
      $set: {
        subEventsEnabled: false,
        subEventDefinitions: [],
        slotTemplates: []
      }
    });
    if (canonicalUpdate.matchedCount !== 1) {
      Q.fail("The canonical event disappeared while legacy-equivalent defaults were re-armed.");
    }
    const ticketUpdate = Q.collection("eventTickets").updateMany({
      eventId,
      status: "A"
    }, {
      $set: {
        status: "D",
        updatedDate: preparedAtIso,
        updatedUser: Q.ACTOR
      }
    });
    if (ticketUpdate.matchedCount !== 2 || ticketUpdate.modifiedCount !== 2) {
      Q.fail("The active replacement tickets changed while the visibility Save replay was being prepared.");
    }
    for (const userId of [participantUserId, thirdUserId]) {
      applyTicketActivityCounterDelta(userId, -1);
    }
    synchronizeEventActivityCounters(hostUserId);
    Q.collection("chats").updateMany({
      $or: [{ chatId: eventId }, { eventId }, { ownerId: eventId }]
    }, {
      $set: { ownerStatus: "DR" },
      $inc: { revision: 1 }
    });

    const taskRemoval = Q.collection("scheduledMessageTasks").deleteMany(failedTaskSelector);
    const outboxRemoval = Q.collection("notificationOutbox").deleteMany(failedOutboxSelector);
    const notificationRemoval = Q.collection("userNotifications").deleteMany(failedNotificationSelector);
    if (taskRemoval.deletedCount !== 1
        || outboxRemoval.deletedCount !== 2
        || notificationRemoval.deletedCount !== 2) {
      Q.fail("The failed Save artifacts changed during guarded cleanup; stop before replay.");
    }
    for (const userId of [participantUserId, thirdUserId]) {
      const unreadNotifications = Q.collection("userNotifications").countDocuments({
        recipientUserId: userId,
        $or: [{ readAtIso: { $exists: false } }, { readAtIso: null }]
      });
      const userUpdate = Q.collection("users").updateOne({
        $or: [{ _id: userId }, { userId }]
      }, {
        $set: { "activities.notifications": unreadNotifications }
      });
      if (userUpdate.matchedCount !== 1) {
        Q.fail(`user '${userId}' disappeared while the notification counter was reconciled.`);
      }
    }

    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: { "context.actualEventSourceId": eventId },
      $push: {
        visibilitySaveRetests: {
          preparedAtIso,
          eventId,
          retainedDeletedTicketIds: deletedTickets.map(ticket => Q.text(ticket._id)),
          rearmedActiveTicketIds: activeTickets.map(ticket => Q.text(ticket._id)),
          removedFailedTaskIds: failedTasks.map(item => Q.text(item._id)),
          removedFailedOutboxIds: failedOutbox.map(item => Q.text(item._id)),
          removedFailedNotificationIds: failedNotifications.map(item => Q.text(item._id))
        }
      }
    });
    const refreshedState = requireMatchingState();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "visibility-save-retest-ready",
      preparedAtIso,
      eventId,
      actors: [Q.user(hostUserId), Q.user(participantUserId), Q.user(thirdUserId)],
      baseline: oracle(refreshedState),
      next: "Open Notifications > New for Nova and Riley and record the stable baseline. In Casey My Events edit only Public to Friends only and Save once. Do not Publish. Require no new event-details-changed task/outbox/notification and no Nova/Riley unread delta before Publish."
    });
  }

  function prepareVisibilityPublishWindow() {
    if (checkpointId !== "EVENT-VISIBILITY-001") {
      Q.fail("prepare-visibility-publish-window is restricted to EVENT-VISIBILITY-001.");
    }
    const state = requireMatchingState();
    if ((state.visibilityPublishWindows || []).length > 0) {
      Q.fail("EVENT-VISIBILITY-001 already has a prepared stable Publish window; do not move it again.");
    }
    const eventId = activeEventSourceId() || EVENT_ID;
    const eventDocuments = Q.collection("events").find({ sourceId: eventId }).toArray();
    const canonicalEvent = eventDocuments.find(event => Q.text(event.ownerUserId) === hostUserId);
    const nowIso = Q.nowIso();
    const now = new Date(nowIso).getTime();
    if (eventDocuments.length !== 3
        || !canonicalEvent
        || canonicalEvent.ticketing !== true
        || eventDocuments.some(event =>
          Q.text(event.status) !== "DR"
          || Q.text(event.visibility).toLowerCase() !== "friends only"
          || Number(event.acceptedMembers || 0) !== 3
          || Number(event.pendingMembers || 0) !== 0
          || !sameIds(event.acceptedMemberUserIds, [hostUserId, participantUserId, thirdUserId])
          || !sameIds(event.pendingMemberUserIds, [])
          || !sameIds(event.invitedMemberUserIds, [])
          || !sameIds(event.pendingRequestMemberUserIds, [])
          || !Number.isFinite(new Date(event.endAtIso).getTime())
          || new Date(event.endAtIso).getTime() > now)) {
      Q.fail("EVENT-VISIBILITY-001 is not at the exact expired DR/Friends only post-Save boundary; preserve the evidence and do not move its window.");
    }

    const controlledMembers = Q.collection("activityMembers").find({
      ownerType: "event",
      ownerId: eventId,
      userId: { $in: [hostUserId, participantUserId, thirdUserId] }
    }).toArray();
    if (controlledMembers.length !== 3
        || controlledMembers.some(member => Q.text(member.status) !== "accepted")
        || controlledMembers.filter(member => Q.text(member.role) === "Admin").length !== 1
        || Q.text(controlledMembers.find(member => Q.text(member.role) === "Admin").userId) !== hostUserId) {
      Q.fail("EVENT-VISIBILITY-001 membership changed after the fixed Save replay; preserve the evidence and do not move its window.");
    }

    const tickets = Q.collection("eventTickets").find({ eventId }).toArray();
    if (tickets.length !== 4
        || tickets.some(ticket => Q.text(ticket.status) !== "D")
        || tickets.filter(ticket => Q.text(ticket.holderUserId) === participantUserId).length !== 2
        || tickets.filter(ticket => Q.text(ticket.holderUserId) === thirdUserId).length !== 2) {
      Q.fail("EVENT-VISIBILITY-001 ticket audit is not the exact four-D post-Save boundary; preserve the evidence and do not move its window.");
    }
    for (const userId of [participantUserId, thirdUserId]) {
      const user = Q.collection("users").findOne({ $or: [{ _id: userId }, { userId }] });
      if (!user
          || nestedNumber(user, "activities.tickets") !== 0
          || nestedNumber(user, "activities.asset.tickets") !== 0) {
        Q.fail(`user '${userId}' is not at the exact zero-ticket counter boundary; preserve the evidence and do not move the window.`);
      }
    }

    const falseTaskCount = Q.collection("scheduledMessageTasks").countDocuments({
      taskKey: `event-definition-changed:${eventId}`,
      actionKey: "event.definition.changed",
      eventId
    });
    const falseOutboxCount = Q.collection("notificationOutbox").countDocuments({
      notificationType: "event-details-changed",
      $or: [{ entityId: eventId }, { "payload.eventId": eventId }]
    });
    const falseNotificationCount = Q.collection("userNotifications").countDocuments({
      kind: "event-details-changed",
      $or: [{ sourceId: eventId }, { "payload.eventId": eventId }]
    });
    if (falseTaskCount !== 0 || falseOutboxCount !== 0 || falseNotificationCount !== 0) {
      Q.fail("The fixed visibility-only Save oracle regressed; preserve the evidence and do not move the window.");
    }
    const recomputeTasks = Q.collection("affinityRecomputeTasks").find({
      targetType: "EVENT",
      targetId: eventId
    }).toArray();
    if (recomputeTasks.length !== 1
        || Q.text(recomputeTasks[0].status) !== "done"
        || Q.text(recomputeTasks[0].lastError)) {
      Q.fail("The fixed Save's normal event recompute is not at the exact clean terminal boundary; preserve the evidence and do not move the window.");
    }

    const startAtIso = new Date(now + 12 * 60 * 60000).toISOString();
    const endAtIso = new Date(now + 36 * 60 * 60000).toISOString();
    const previousWindows = eventDocuments.map(event => ({
      recordId: Q.text(event._id),
      ownerUserId: Q.text(event.ownerUserId),
      startAtIso: Q.text(event.startAtIso),
      endAtIso: Q.text(event.endAtIso)
    }));
    const eventUpdate = Q.collection("events").updateMany({ sourceId: eventId }, {
      $set: {
        startAtIso,
        endAtIso,
        updatedDate: nowIso,
        updatedUser: Q.ACTOR
      }
    });
    if (eventUpdate.matchedCount !== 3 || eventUpdate.modifiedCount !== 3) {
      Q.fail("The retained event projections changed while the stable Publish window was being prepared.");
    }
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $push: {
        visibilityPublishWindows: {
          preparedAtIso: nowIso,
          eventId,
          previousWindows,
          startAtIso,
          endAtIso,
          reason: "fixture-expired-before-manual-publish"
        }
      }
    });
    const refreshedState = requireMatchingState();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "visibility-publish-window-ready",
      preparedAtIso: nowIso,
      eventId,
      startAtIso,
      endAtIso,
      baseline: oracle(refreshedState),
      next: "Wait for Casey's already-open My Events Upcoming list to show QA EVENT-TICKET-007 again through its normal poll. Do not reload or repeat Save. Then Publish once while Nova and Riley Notifications > New remain open."
    });
  }

  function normalizeStoredFeedbackAggregate(userId) {
    const user = Q.collection("users").findOne({
      $or: [{ _id: userId }, { userId }]
    });
    if (!user) Q.fail(`feedback aggregate target '${userId}' was not found.`);
    const activities = user.activities || {};
    const counters = activities.eventFeedback || {};
    const feedback = normalizeActivityCount(counters.pending)
      + normalizeActivityCount(counters.ownEvents);
    Q.collection("users").updateOne({
      $or: [{ _id: userId }, { userId }]
    }, {
      $set: { "activities.feedback": feedback }
    });
  }

  function addFeedbackParticipant() {
    config();
    if (checkpointId !== "EVENT-FEEDBACK-002") {
      Q.fail("add-feedback-participant is restricted to EVENT-FEEDBACK-002.");
    }
    const state = requireMatchingState();
    Q.ensureUser(thirdUserId, "second feedback participant");

    const snapshots = [...(state.userActivitySnapshots || [])];
    if (!snapshots.some(saved => saved.userId === thirdUserId)) {
      snapshots.push(userActivitiesSnapshot(thirdUserId));
      state.userActivitySnapshots = snapshots;
      Q.collection(Q.STATE_COLLECTION).updateOne(
        { _id: state._id },
        { $set: { userActivitySnapshots: snapshots } }
      );
    }

    const event = Q.collection("events").findOne(manualEventSelector());
    if (!event) Q.fail("the staged feedback event was not found.");
    const acceptedUserIds = sortedUnique([
      ...(event.acceptedMemberUserIds || []),
      hostUserId,
      participantUserId,
      thirdUserId
    ]);
    const pendingUserIds = (event.pendingMemberUserIds || []).filter(userId => userId !== thirdUserId);
    const invitedUserIds = (event.invitedMemberUserIds || []).filter(userId => userId !== thirdUserId);
    Q.collection("events").updateOne({ _id: event._id }, {
      $set: {
        acceptedMembers: acceptedUserIds.length,
        acceptedMemberUserIds: acceptedUserIds,
        pendingMembers: pendingUserIds.length,
        pendingMemberUserIds: pendingUserIds,
        invitedMemberUserIds: invitedUserIds
      }
    });

    const memberSelector = {
      ownerType: "event",
      ownerId: Q.text(event.sourceId || event._id),
      userId: thirdUserId
    };
    const existingMember = Q.collection("activityMembers").findOne(memberSelector);
    if (existingMember) {
      Q.collection("activityMembers").updateOne({ _id: existingMember._id }, {
        $set: {
          role: "Member",
          status: "accepted",
          pendingSource: null,
          requestKind: null,
          invitedByUserId: null,
          actionAtIso: Q.nowIso(),
          updatedDate: Q.nowIso(),
          updatedUser: Q.ACTOR
        }
      });
    } else {
      Q.collection("activityMembers").insertOne(
        memberDocument(Q.text(event.sourceId || event._id), thirdUserId, "Member", "accepted")
      );
    }

    const secondParticipantState = Q.collection("eventFeedbackStates").findOne({
      viewerUserId: thirdUserId,
      eventId: EVENT_ID
    });
    if (!secondParticipantState) {
      insertPendingFeedbackEligibility(Q.nowIso(), thirdUserId);
      applyFeedbackFixtureCounters(state, thirdUserId, {
        ownEvents: 0, pending: 1, feedbacked: 0, removed: 0
      });
    }
    for (const userId of [hostUserId, participantUserId, thirdUserId]) {
      normalizeStoredFeedbackAggregate(userId);
    }

    const updatedEvent = Q.collection("events").findOne({ _id: event._id }) || {};
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "second-feedback-participant-ready",
      secondParticipant: Q.user(thirdUserId),
      acceptedMembers: normalizeActivityCount(updatedEvent.acceptedMembers),
      acceptedMemberUserIds: sortedUnique(updatedEvent.acceptedMemberUserIds || []),
      hostCounters: userActivitiesSnapshot(hostUserId).activities.value.eventFeedback,
      next: "Reload Casey: main Feedback must be 1 now. Then submit one distinguishable feedback as the second participant; Casey must end at main Feedback=2 and Own Events=2 with one event card whose response badge is 2."
    });
  }

  function next() {
    const selected = config();
    const state = requireMatchingState();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "awaiting-manual-action",
      why: selected.why,
      action: selected.action,
      expectedVisibleResult: selected.expected,
      workerExpectation: selected.worker,
      identities: state.context
    });
  }

  function armTicketExpiry() {
    config();
    if (checkpointId !== "EVENT-TICKET-006") {
      Q.fail("arm-ticket-expiry is only valid for EVENT-TICKET-006.");
    }
    const state = requireMatchingState();
    if (state.ticketExpiryArm && state.ticketExpiryArm.armedAtIso) {
      Q.fail("EVENT-TICKET-006 expiry is already armed; reset and stage again instead of moving the deadline.");
    }
    const ticket = Q.collection("eventTickets").findOne({
      eventId: EVENT_ID,
      holderUserId: participantUserId,
      status: "A"
    });
    if (!ticket) {
      Q.fail("the active Nova ticket disappeared before expiry could be armed.");
    }
    const eventRecords = Q.collection("events").find({ sourceId: EVENT_ID }).toArray();
    if (eventRecords.length !== 2) {
      Q.fail(`EVENT-TICKET-006 requires exactly the host event and Nova overlay, found ${eventRecords.length}.`);
    }
    const now = Date.now();
    if (eventRecords.some(event => !Number.isFinite(new Date(event.endAtIso).getTime())
        || new Date(event.endAtIso).getTime() <= now)) {
      Q.fail("the stable pre-expiry baseline has already ended; reset and stage again before arming.");
    }
    const armedAtIso = Q.nowIso();
    const expectedEndAtIso = new Date(new Date(armedAtIso).getTime() + 2 * 60000).toISOString();
    const update = Q.collection("events").updateMany({ sourceId: EVENT_ID }, {
      $set: {
        endAtIso: expectedEndAtIso,
        updatedDate: armedAtIso,
        updatedUser: Q.ACTOR
      }
    });
    if (update.matchedCount !== 2 || update.modifiedCount !== 2) {
      Q.fail(`expiry arm expected to update two event projections, matched ${update.matchedCount} and modified ${update.modifiedCount}.`);
    }
    const ticketExpiryArm = {
      armedAtIso,
      expectedEndAtIso,
      windowSeconds: 120,
      ticketId: Q.text(ticket._id),
      ticketCode: Q.text(ticket.code),
      ticketStatus: Q.text(ticket.status)
    };
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: { ticketExpiryArm }
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "ticket-expiry-armed",
      ...ticketExpiryArm,
      next: "Keep Nova's already-open Upcoming Ticket surface open through the printed expectedEndAtIso and the next normal foreground poll; then prove the same ticket appears once under Past."
    });
  }

  function advance() {
    const selected = config();
    const state = Q.activeState(SCENARIO, true);
    const currentCheckpointId = Q.text(state.checkpointId).toUpperCase();
    if (!sourceCheckpointId || currentCheckpointId !== sourceCheckpointId) {
      Q.fail(`staged checkpoint is '${currentCheckpointId}', not source '${sourceCheckpointId}'.`);
    }
    const event = Q.collection("events").findOne(manualEventSelector());
    if (!event) Q.fail("cannot advance without the manually created event.");
    if (selected.stage === "visibility-friends") {
      if (sourceCheckpointId !== "EVENT-TICKET-007") {
        Q.fail("EVENT-VISIBILITY-001 must advance directly from EVENT-TICKET-007.");
      }
      Q.ensureUser(visibilityFriendUserId, "Friends Only friend control");
      Q.ensureUser(visibilityNonFriendUserId, "Friends Only non-friend control");
      if (!isFriendPair(hostUserId, visibilityFriendUserId)
          || isFriendPair(hostUserId, visibilityNonFriendUserId)) {
        Q.fail("the configured Friends Only controls no longer resolve to one Casey friend and one Casey non-friend.");
      }
      const eventId = Q.text(event.sourceId || event._id);
      const trackedControls = Q.collection("activityMembers").find({
        ownerType: "event",
        ownerId: eventId,
        userId: { $in: [visibilityFriendUserId, visibilityNonFriendUserId] },
        status: { $ne: "D" }
      }).toArray();
      if (trackedControls.length > 0) {
        Q.fail("Friends Only controls must remain external non-members with no tracked participation.");
      }
      const acceptedUserIds = sortedUnique(event.acceptedMemberUserIds || []);
      if (!sameIds(acceptedUserIds, [hostUserId, participantUserId, thirdUserId])) {
        Q.fail("EVENT-VISIBILITY-001 requires Casey, Nova and Riley to be accepted before the visibility transition.");
      }
      const activeTickets = Q.collection("eventTickets").find({
        eventId,
        status: "A"
      }).toArray();
      if (activeTickets.length !== 2
          || !sameIds(activeTickets.map(ticket => ticket.holderUserId), [participantUserId, thirdUserId])) {
        Q.fail("EVENT-VISIBILITY-001 requires the completed Nova and Riley active-ticket baseline.");
      }
      const visibilitySnapshots = [...(state.userActivitySnapshots || [])];
      for (const userId of [visibilityFriendUserId, visibilityNonFriendUserId]) {
        if (!visibilitySnapshots.some(saved => saved.userId === userId)) {
          visibilitySnapshots.push(userActivitiesSnapshot(userId));
        }
      }
      state.userActivitySnapshots = visibilitySnapshots;
    }
    if (selected.stage === "draft" && Q.text(event.status) !== "DR") {
      Q.fail(`next checkpoint requires a draft event, but status is '${Q.text(event.status)}'.`);
    }
    const advancedAtIso = Q.nowIso();
    const history = Array.isArray(state.checkpointHistory) ? state.checkpointHistory : [];
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: {
        checkpointId,
        stagedAtIso: advancedAtIso,
        userActivitySnapshots: state.userActivitySnapshots || [],
        "context.actualEventSourceId": Q.text(event.sourceId || event._id),
        "context.visibilityFriendUserId": selected.stage === "visibility-friends" ? visibilityFriendUserId : null,
        "context.visibilityNonFriendUserId": selected.stage === "visibility-friends" ? visibilityNonFriendUserId : null
      },
      $push: {
        checkpointHistory: {
          checkpointId: sourceCheckpointId,
          completedAtIso: advancedAtIso
        }
      }
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "continued-manual-checkpoint",
      advancedFrom: sourceCheckpointId,
      advancedAtIso,
      retainedCheckpointCount: history.length + 1,
      eventId: Q.text(event.sourceId || event._id),
      eventTitle: Q.text(event.title),
      why: selected.why,
      action: selected.action,
      expectedVisibleResult: selected.expected,
      workerExpectation: selected.worker,
      note: "The original snapshots are retained so one later reset restores the pre-chain baseline."
    });
  }

  function prepareInvitationAcceptanceRetest() {
    if (checkpointId !== "EVENT-INV-003") {
      Q.fail("prepare-invitation-acceptance-retest is only valid for EVENT-INV-003.");
    }
    const state = requireMatchingState();
    if (state.invitationAcceptanceRetest && state.invitationAcceptanceRetest.preparedAtIso) {
      Q.fail("the invitation acceptance retest is already prepared for this checkpoint.");
    }

    const event = Q.collection("events").findOne(manualEventSelector());
    if (!event) Q.fail("the retained manual event does not exist.");
    const eventId = Q.text(event.sourceId || event._id);
    if (Q.text(event.status) !== "A") {
      Q.fail(`the retained event must be active, but status is '${Q.text(event.status)}'.`);
    }
    if (Number(event.acceptedMembers || 0) !== 2
        || Number(event.pendingMembers || 0) !== 1
        || !sameIds(event.acceptedMemberUserIds, [hostUserId, thirdUserId])
        || !sameIds(event.pendingMemberUserIds, [participantUserId])
        || !sameIds(event.invitedMemberUserIds, [participantUserId])) {
      Q.fail("the retained event is not at the expected Casey-accepted, Riley-accepted, Nova-pending pre-retest boundary.");
    }

    const controlledMembers = Q.collection("activityMembers").find({
      ownerType: "event",
      ownerId: eventId,
      userId: { $in: [hostUserId, participantUserId, thirdUserId] }
    }).toArray();
    const memberByUserId = new Map(controlledMembers.map(member => [Q.text(member.userId), member]));
    const hostMember = memberByUserId.get(hostUserId);
    const pendingControl = memberByUserId.get(participantUserId);
    const acceptedRecipient = memberByUserId.get(thirdUserId);
    if (controlledMembers.length !== 3
        || Q.text(hostMember && hostMember.status) !== "accepted"
        || Q.text(hostMember && hostMember.role) !== "Admin"
        || Q.text(pendingControl && pendingControl.status) !== "pending"
        || Q.text(pendingControl && pendingControl.requestKind) !== "invite"
        || Q.text(acceptedRecipient && acceptedRecipient.status) !== "accepted"
        || Q.text(acceptedRecipient && acceptedRecipient.role) !== "Member") {
      Q.fail("the three controlled membership rows do not match the required pre-retest boundary.");
    }

    const existingChatDocuments = Q.collection("chats").find({
      $or: [{ chatId: eventId }, { eventId }, { ownerId: eventId }]
    }).toArray();
    const existingChatMessages = Q.collection("chatMessages").find({ chatId: eventId }).toArray();
    const unexpectedChatOwnerIds = existingChatDocuments
      .map(chat => Q.text(chat.ownerUserId))
      .filter(userId => ![hostUserId, thirdUserId].includes(userId));
    const nonSystemChatMessages = existingChatMessages.filter(message =>
      Q.text(message.senderAvatar && message.senderAvatar.gender).toLowerCase() !== "system"
    );
    if (unexpectedChatOwnerIds.length > 0 || nonSystemChatMessages.length > 0) {
      Q.fail("the retained chat contains an unexpected owner or participant-authored message; preserve that evidence and use a full checkpoint reset.");
    }
    const existingAcceptanceOutboxCount = Q.collection("notificationOutbox").countDocuments({
      notificationType: "event-invitation-accepted",
      $or: [{ entityId: eventId }, { "payload.eventId": eventId }]
    });
    const existingAcceptanceNotificationCount = Q.collection("userNotifications").countDocuments({
      kind: "event-invitation-accepted",
      $or: [{ sourceId: eventId }, { "payload.eventId": eventId }]
    });

    const recipientUser = Q.collection("users").findOne({
      $or: [{ _id: thirdUserId }, { userId: thirdUserId }]
    });
    if (!recipientUser) Q.fail("the accepted-recipient user no longer exists.");
    const currentEvents = nestedNumber(recipientUser, "activities.events");
    const currentActive = nestedNumber(recipientUser, "activities.event.active");
    if (currentEvents < 1 || currentActive < 1) {
      Q.fail("the accepted-recipient activity projection is not active and cannot be safely re-armed.");
    }

    const preparedAtIso = Q.nowIso();
    const chatUnreadByOwner = new Map(existingChatDocuments.map(chat => [
      Q.text(chat.ownerUserId),
      normalizeActivityCount(chat.unread)
    ]));
    Q.collection("notificationOutbox").deleteMany({
      $or: [
        {
          notificationType: "event-invitation-accepted",
          $or: [{ entityId: eventId }, { "payload.eventId": eventId }]
        },
        {
          notificationType: "chat-message",
          $or: [{ entityId: eventId }, { "payload.chatId": eventId }]
        }
      ]
    });
    Q.collection("userNotifications").deleteMany({
      $or: [
        {
          kind: "event-invitation-accepted",
          $or: [{ sourceId: eventId }, { "payload.eventId": eventId }]
        },
        {
          kind: "chat-message",
          $or: [{ sourceId: eventId }, { "payload.chatId": eventId }]
        }
      ]
    });
    Q.collection("chatMessages").deleteMany({ chatId: eventId });
    Q.collection("chats").deleteMany({
      $and: [
        { $or: [{ chatId: eventId }, { eventId }, { ownerId: eventId }] },
        { ownerUserId: thirdUserId }
      ]
    });
    Q.collection("chats").updateMany({
      $and: [
        { $or: [{ chatId: eventId }, { eventId }, { ownerId: eventId }] },
        { ownerUserId: hostUserId }
      ]
    }, {
      $set: {
        memberIds: [hostUserId],
        lastMessage: "",
        lastSenderId: "",
        unread: 0,
        updatedDate: preparedAtIso,
        updatedUser: Q.ACTOR
      }
    });
    Q.collection("userNotifications").updateMany({
      recipientUserId: thirdUserId,
      kind: "event-invite",
      $or: [{ sourceId: eventId }, { "payload.eventId": eventId }]
    }, {
      $set: { readAtIso: null }
    });

    const memberUpdate = Q.collection("activityMembers").updateOne({
      _id: acceptedRecipient._id,
      status: "accepted"
    }, {
      $set: {
        status: "pending",
        role: "Member",
        pendingSource: "admin",
        requestKind: "invite",
        invitedByUserId: hostUserId,
        actionAtIso: preparedAtIso,
        updatedDate: preparedAtIso,
        updatedUser: Q.ACTOR
      }
    });
    if (memberUpdate.matchedCount !== 1) {
      Q.fail("the accepted-recipient membership changed while the retest was being prepared.");
    }

    const eventUpdate = Q.collection("events").updateOne({
      _id: event._id,
      acceptedMembers: 2,
      pendingMembers: 1
    }, {
      $set: {
        acceptedMembers: 1,
        pendingMembers: 2,
        acceptedMemberUserIds: [hostUserId],
        pendingMemberUserIds: [participantUserId, thirdUserId],
        invitedMemberUserIds: [participantUserId, thirdUserId],
        pendingRequestMemberUserIds: [],
        updatedDate: preparedAtIso,
        updatedUser: Q.ACTOR
      }
    });
    if (eventUpdate.matchedCount !== 1) {
      Q.fail("the retained event changed while the retest was being prepared; use reset to restore the original checkpoint snapshot.");
    }

    const activityUpdate = Q.collection("users").updateOne({
      _id: recipientUser._id
    }, {
      $set: {
        "activities.events": currentEvents - 1,
        "activities.invitations": nestedNumber(recipientUser, "activities.invitations") + 1,
        "activities.event.active": currentActive - 1,
        "activities.event.invitations": nestedNumber(recipientUser, "activities.event.invitations") + 1,
        "activities.chats": Math.max(
          0,
          nestedNumber(recipientUser, "activities.chats") - (chatUnreadByOwner.get(thirdUserId) || 0)
        ),
        "activities.chat.all": Math.max(
          0,
          nestedNumber(recipientUser, "activities.chat.all") - (chatUnreadByOwner.get(thirdUserId) || 0)
        ),
        "activities.chat.event": Math.max(
          0,
          nestedNumber(recipientUser, "activities.chat.event") - (chatUnreadByOwner.get(thirdUserId) || 0)
        )
      }
    });
    if (activityUpdate.matchedCount !== 1) {
      Q.fail("the accepted-recipient activity projection disappeared; use reset to restore the original checkpoint snapshot.");
    }
    const hostUser = Q.collection("users").findOne({
      $or: [{ _id: hostUserId }, { userId: hostUserId }]
    });
    if (!hostUser) Q.fail("the event Admin user no longer exists.");
    const hostUnreadDelta = chatUnreadByOwner.get(hostUserId) || 0;
    Q.collection("users").updateOne({ _id: hostUser._id }, { $set: {
      "activities.chats": Math.max(0, nestedNumber(hostUser, "activities.chats") - hostUnreadDelta),
      "activities.chat.all": Math.max(0, nestedNumber(hostUser, "activities.chat.all") - hostUnreadDelta),
      "activities.chat.event": Math.max(0, nestedNumber(hostUser, "activities.chat.event") - hostUnreadDelta)
    } });
    for (const userId of [hostUserId, participantUserId, thirdUserId]) {
      const unreadNotifications = Q.collection("userNotifications").countDocuments({
        recipientUserId: userId,
        $or: [{ readAtIso: { $exists: false } }, { readAtIso: null }]
      });
      Q.collection("users").updateOne({
        $or: [{ _id: userId }, { userId }]
      }, {
        $set: { "activities.notifications": unreadNotifications }
      });
    }

    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: {
        "context.actualEventSourceId": eventId,
        "context.acceptanceRecipientUserId": thirdUserId,
        "context.pendingControlUserId": participantUserId,
        "context.eventAdminUserId": hostUserId,
        invitationAcceptanceRetest: {
          preparedAtIso,
          eventId,
          acceptanceRecipientUserId: thirdUserId,
          pendingControlUserId: participantUserId,
          eventAdminUserId: hostUserId,
          clearedAcceptanceOutboxCount: existingAcceptanceOutboxCount,
          clearedAcceptanceNotificationCount: existingAcceptanceNotificationCount,
          clearedSystemChatMessageCount: existingChatMessages.length
        }
      }
    });
    const refreshedState = requireMatchingState();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "invitation-acceptance-retest-ready",
      preparedAtIso,
      eventId,
      acceptedRecipient: Q.user(thirdUserId),
      pendingControl: Q.user(participantUserId),
      eventAdmin: Q.user(hostUserId),
      baseline: oracle(refreshedState),
      next: "Reload all three isolated sessions once. As Riley, accept this invitation exactly once. Then verify Casey and Nova each receive one acceptance event notification, Riley receives none, Casey and Riley share one event chat with one member-joined row, and no chat-message notification is created from that system row."
    });
  }

  function holdAutoInviter() {
    if (checkpointId !== "EVENT-EDITOR-003") {
      Q.fail("hold-auto-inviter is only valid for EVENT-EDITOR-003.");
    }
    const state = requireMatchingState();
    if (state.autoInviterScheduler && state.autoInviterScheduler.heldAtIso) {
      Q.fail("the auto-inviter scheduler is already held for this checkpoint.");
    }
    const rule = autoInviterRule();
    if (Q.text(rule.runState && rule.runState.currentStatus) === "running") {
      Q.fail("the auto-inviter rule is running; wait for its terminal state and retry.");
    }
    const heldAtIso = Q.nowIso();
    const snapshot = {
      collection: "notificationRuleConfigs",
      selector: { ruleKey: AUTO_INVITER_RULE },
      documents: [rule]
    };
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $push: { snapshots: snapshot },
      $set: {
        autoInviterScheduler: {
          heldAtIso,
          originalIntervalSeconds: Number(rule.timing && rule.timing.intervalSeconds || 0),
          scheduledAtIso: null,
          expectedDueAtIso: null
        }
      }
    });
    const update = Q.collection("notificationRuleConfigs").updateOne(
      { ruleKey: AUTO_INVITER_RULE, "runState.currentStatus": { $ne: "running" } },
      {
        $set: {
          enabled: true,
          manualRunEnabled: false,
          scheduleSlots: [],
          "timing.mode": "interval",
          "timing.intervalAmount": 1,
          "timing.intervalUnit": "hours",
          "timing.intervalSeconds": AUTO_INVITER_HOLD_SECONDS,
          "timing.intervalMinutes": 60,
          "timing.time": "00:00",
          "timing.timezone": "UTC",
          "runState.currentStatus": "idle",
          "runState.progressPercent": 0,
          "runState.progressDetail": "Manual EVENT-EDITOR-003 baseline is held; the short schedule has not been armed.",
          "runState.lastRunAtIso": heldAtIso,
          "runState.pendingCount": 0,
          "runState.pendingCountUnit": "admin.jobs.table.affected",
          "runState.pendingCountUpdatedAtIso": heldAtIso,
          updatedDate: heldAtIso,
          updatedUser: Q.ACTOR
        },
        $unset: {
          "runState.startedAtIso": "",
          "runState.finishedAtIso": "",
          "runState.lastError": ""
        }
      }
    );
    if (update.matchedCount !== 1) {
      Q.fail("the auto-inviter rule started while the hold was being saved; use reset to restore its snapshot.");
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "auto-inviter-held",
      heldAtIso,
      rule: autoInviterRuleSummary(),
      next: "Keep the retained event unpublished, enable Auto inviter and Save once. Do not publish yet. The scheduler remains ineligible for approximately one hour."
    });
  }

  function prepareAutoInviter() {
    if (checkpointId !== "EVENT-EDITOR-003") {
      Q.fail("prepare-auto-inviter is only valid for EVENT-EDITOR-003.");
    }
    const state = requireMatchingState();
    if (!state.autoInviterScheduler || !state.autoInviterScheduler.heldAtIso) {
      Q.fail("hold the auto-inviter scheduler before preparing candidates.");
    }
    if (state.autoInviterEligibility && state.autoInviterEligibility.preparedAtIso) {
      Q.fail("auto-inviter eligibility is already prepared for this checkpoint.");
    }
    const rule = autoInviterRule();
    if (Q.text(rule.runState && rule.runState.currentStatus) === "running") {
      Q.fail("the auto-inviter rule is running; wait for its terminal state and retry.");
    }
    const event = Q.collection("events").findOne(manualEventSelector());
    if (!event) Q.fail("the retained manual event does not exist.");
    if (Q.text(event.status) !== "DR" || event.autoInviter !== true) {
      Q.fail("the retained event must be a draft with Auto inviter enabled before candidates are prepared.");
    }
    const eventId = Q.text(event.sourceId || event._id);
    const existingArtifacts = Q.collection("activityMembers").countDocuments({
      ownerType: "event",
      ownerId: eventId,
      status: "pending",
      requestKind: "invite"
    }) + Q.collection("schedulerPlanMarkers").countDocuments({ ownerId: eventId });
    if (existingArtifacts !== 0) {
      Q.fail("the retained event already has auto-inviter artifacts; reset before preparing candidates.");
    }
    Q.ensureUser(participantUserId, "initial auto-inviter candidate");
    Q.ensureUser(thirdUserId, "later periodic auto-inviter candidate");
    for (const candidateUserId of [participantUserId, thirdUserId]) {
      const candidate = Q.collection("users").findOne({
        $or: [{ _id: candidateUserId }, { userId: candidateUserId }]
      });
      if (Q.text(candidate && candidate.profileStatus).toLowerCase() !== "public") {
        Q.fail(`candidate '${candidateUserId}' must have a public profile for the real auto-inviter.`);
      }
    }

    const isolatedEventIds = Q.collection("events")
      .find({
        autoInviter: true,
        $and: [
          { _id: { $ne: event._id } },
          { sourceId: { $ne: eventId } }
        ]
      }, { projection: { _id: 1 } })
      .toArray()
      .map(item => item._id);
    const isolatedWaitlistMemberIds = Q.collection("activityMembers")
      .find({
        ownerType: "event",
        status: "pending",
        requestKind: { $in: ["waitlist", "waitlist-invite"] }
      }, { projection: { _id: 1 } })
      .toArray()
      .map(item => item._id);
    const addedSnapshots = Q.snapshotSpecs([
      { collection: "events", selector: { _id: { $in: isolatedEventIds } } },
      { collection: "activityMembers", selector: { _id: { $in: isolatedWaitlistMemberIds } } },
      { collection: "userAffinityEdges", selector: autoInviterAffinitySelector() }
    ]);
    const preparedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $push: { snapshots: { $each: addedSnapshots } },
      $set: {
        autoInviterEligibility: {
          preparedAtIso,
          initialCandidateUserId: participantUserId,
          laterCandidateUserId: thirdUserId,
          isolatedEventIds,
          isolatedWaitlistMemberIds
        }
      }
    });
    try {
      if (isolatedEventIds.length > 0) {
        Q.collection("events").updateMany(
          { _id: { $in: isolatedEventIds } },
          { $set: { autoInviter: false, updatedDate: preparedAtIso, updatedUser: Q.ACTOR } }
        );
      }
      if (isolatedWaitlistMemberIds.length > 0) {
        Q.collection("activityMembers").updateMany(
          { _id: { $in: isolatedWaitlistMemberIds } },
          {
            $set: {
              requestKind: "manual-qa-checkpoint-quarantined",
              updatedDate: preparedAtIso,
              updatedUser: Q.ACTOR
            }
          }
        );
      }
      Q.collection("userAffinityEdges").deleteMany(autoInviterAffinitySelector());
      const pair = [hostUserId, participantUserId].sort();
      Q.collection("userAffinityEdges").insertOne({
        _id: AUTO_INVITER_INITIAL_EDGE_ID,
        pairKey: `${pair[0]}:${pair[1]}`,
        leftUserId: hostUserId,
        rightUserId: participantUserId,
        affinityScore: 1,
        edgeWeight: 1,
        evidence: {
          mutualSingleCount: 1,
          singleOneSidedCount: 0,
          pairOutsideNetworkCount: 0,
          pairInsideNetworkCount: 0,
          metCount: 0,
          strongestAffinityScore: 1,
          totalMultiplier: 1
        },
        updatedDate: preparedAtIso,
        updatedUser: Q.ACTOR
      });
    } catch (error) {
      Q.fail(`candidate preparation failed after snapshot: ${Q.text(error && error.message)}. Run reset event-domain ${checkpointId}.`);
    }
    const refreshedState = requireMatchingState();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "initial-auto-inviter-candidate-ready",
      event: { eventId, title: Q.text(event.title), status: Q.text(event.status), autoInviter: true },
      eligibility: autoInviterEligibilitySummary(refreshedState),
      invitationArtifacts: 0,
      next: "Execute CARD-PUBLISH once from the retained Draft card's overflow menu without reopening Event Editor. The publish-time initial batch, not the periodic scheduler, should invite only the printed initial candidate."
    });
  }

  function captureAutoInviterBaseline() {
    if (checkpointId !== "EVENT-EDITOR-003") {
      Q.fail("capture-auto-inviter-baseline is only valid for EVENT-EDITOR-003.");
    }
    const state = requireMatchingState();
    if (!state.autoInviterEligibility || !state.autoInviterEligibility.preparedAtIso) {
      Q.fail("prepare auto-inviter eligibility before capturing recipient counters.");
    }
    if (Array.isArray(state.autoInviterRecipientActivitySnapshots)) {
      Q.fail("auto-inviter recipient activity counters are already captured for this checkpoint.");
    }
    const event = Q.collection("events").findOne(manualEventSelector());
    if (!event) Q.fail("the retained manual event does not exist.");
    const eventId = Q.text(event.sourceId || event._id);
    if (Q.text(event.status) !== "DR" || event.autoInviter !== true) {
      Q.fail("capture the recipient baseline while the retained event is still a draft with Auto inviter enabled.");
    }
    const controlledArtifacts = Q.collection("activityMembers").countDocuments({
      ownerType: "event",
      ownerId: eventId,
      requestKind: "invite"
    }) + Q.collection("schedulerPlanMarkers").countDocuments({ ownerId: eventId });
    if (controlledArtifacts !== 0) {
      Q.fail("the retained event already has invitation artifacts; reset and repeat the pre-publish baseline.");
    }
    const capturedAtIso = Q.nowIso();
    const snapshots = [
      userActivitiesSnapshot(participantUserId),
      userActivitiesSnapshot(thirdUserId)
    ];
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: {
        autoInviterRecipientActivitySnapshots: snapshots,
        autoInviterRecipientBaselineCapturedAtIso: capturedAtIso
      }
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "auto-inviter-recipient-baseline-captured",
      capturedAtIso,
      eventId,
      recipients: [Q.user(participantUserId), Q.user(thirdUserId)],
      invitationArtifacts: 0,
      executionVariant: "CARD-PUBLISH",
      next: "From the retained Draft card's overflow menu, execute Publish once without reopening Event Editor. Keep both recipient sessions open and attribute the first invitation only to the synchronous publish-time initial batch."
    });
  }

  function preparePeriodicAutoInviter() {
    if (checkpointId !== "EVENT-EDITOR-003") {
      Q.fail("prepare-periodic-auto-inviter is only valid for EVENT-EDITOR-003.");
    }
    const state = requireMatchingState();
    if (!state.autoInviterEligibility || !state.autoInviterEligibility.preparedAtIso) {
      Q.fail("prepare the initial auto-inviter candidate before the periodic candidate.");
    }
    if (!state.autoInviterScheduler || !state.autoInviterScheduler.heldAtIso) {
      Q.fail("hold the auto-inviter scheduler before preparing the periodic candidate.");
    }
    if (state.autoInviterPeriodic && state.autoInviterPeriodic.preparedAtIso) {
      Q.fail("the periodic auto-inviter candidate is already prepared for this checkpoint.");
    }
    const rule = autoInviterRule();
    if (Q.text(rule.runState && rule.runState.currentStatus) === "running") {
      Q.fail("the auto-inviter rule is running; wait for its terminal state and retry.");
    }
    const event = Q.collection("events").findOne(manualEventSelector());
    if (!event) Q.fail("the retained manual event does not exist.");
    const eventId = Q.text(event.sourceId || event._id);
    if (Q.text(event.status) !== "A" || event.autoInviter !== true) {
      Q.fail("the retained event must be active with Auto inviter enabled before the periodic candidate is prepared.");
    }
    const artifacts = eventInviteArtifactsSummary(eventId);
    if (JSON.stringify(artifacts.pendingInviteUserIds) !== JSON.stringify([participantUserId])) {
      Q.fail("the publish-time baseline must contain exactly the initial candidate invitation and no periodic candidate invitation.");
    }
    if (Q.collection("userAffinityEdges").countDocuments({ _id: AUTO_INVITER_LATER_EDGE_ID }) !== 0) {
      Q.fail("the periodic candidate affinity edge already exists; reset before repeating this preparation.");
    }
    const preparedAtIso = Q.nowIso();
    const pair = [hostUserId, thirdUserId].sort();
    Q.collection("userAffinityEdges").insertOne({
      _id: AUTO_INVITER_LATER_EDGE_ID,
      pairKey: `${pair[0]}:${pair[1]}`,
      leftUserId: hostUserId,
      rightUserId: thirdUserId,
      affinityScore: 1,
      edgeWeight: 1,
      evidence: {
        mutualSingleCount: 1,
        singleOneSidedCount: 0,
        pairOutsideNetworkCount: 0,
        pairInsideNetworkCount: 0,
        metCount: 0,
        strongestAffinityScore: 1,
        totalMultiplier: 1
      },
      updatedDate: preparedAtIso,
      updatedUser: Q.ACTOR
    });
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: {
        autoInviterPeriodic: {
          preparedAtIso,
          candidateUserId: thirdUserId,
          edgeId: AUTO_INVITER_LATER_EDGE_ID
        }
      }
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "periodic-auto-inviter-candidate-ready",
      why: "Prove that a later eligibility change is consumed by the real periodic scheduler and that an already-open event SmartList converges without reopening.",
      event: { eventId, title: Q.text(event.title), status: Q.text(event.status), autoInviter: true },
      publishTimeArtifacts: artifacts,
      periodicCandidate: Q.user(thirdUserId),
      rule: autoInviterRuleSummary(),
      next: "Open the host My Events list and the periodic candidate Invitations list in separate authenticated sessions. Keep both lists open, then run schedule-auto-inviter with a 10-120 second delay."
    });
  }

  function scheduleAutoInviter() {
    if (checkpointId !== "EVENT-EDITOR-003") {
      Q.fail("schedule-auto-inviter is only valid for EVENT-EDITOR-003.");
    }
    const state = requireMatchingState();
    if (!state.autoInviterPeriodic || !state.autoInviterPeriodic.preparedAtIso) {
      Q.fail("prepare the periodic auto-inviter candidate before scheduling the real worker.");
    }
    if (state.autoInviterScheduler && state.autoInviterScheduler.scheduledAtIso) {
      Q.fail("the periodic auto-inviter run is already scheduled for this checkpoint.");
    }
    if (!Number.isInteger(requestedDelaySeconds)
        || requestedDelaySeconds < 10
        || requestedDelaySeconds > 120) {
      Q.fail("delay-seconds must be an integer from 10 through 120.");
    }
    const rule = autoInviterRule();
    if (Q.text(rule.runState && rule.runState.currentStatus) === "running") {
      Q.fail("the auto-inviter rule is running; wait for its terminal state and retry.");
    }
    const event = Q.collection("events").findOne(manualEventSelector());
    if (!event) Q.fail("the retained manual event does not exist.");
    const eventId = Q.text(event.sourceId || event._id);
    if (Q.text(event.status) !== "A" || event.autoInviter !== true) {
      Q.fail("the retained event must remain active with Auto inviter enabled while the periodic run is scheduled.");
    }
    const artifacts = eventInviteArtifactsSummary(eventId);
    if (JSON.stringify(artifacts.pendingInviteUserIds) !== JSON.stringify([participantUserId])) {
      Q.fail("the pre-schedule baseline no longer contains exactly the initial candidate invitation.");
    }
    if (Q.collection("userAffinityEdges").countDocuments({ _id: AUTO_INVITER_LATER_EDGE_ID }) !== 1) {
      Q.fail("the periodic candidate affinity edge is missing or duplicated.");
    }
    const scheduledAt = new Date();
    const lastRunAt = new Date(
      scheduledAt.getTime() - (AUTO_INVITER_HOLD_SECONDS - requestedDelaySeconds) * 1000
    );
    const dueAt = new Date(lastRunAt.getTime() + AUTO_INVITER_HOLD_SECONDS * 1000);
    const scheduledAtIso = scheduledAt.toISOString();
    const expectedDueAtIso = dueAt.toISOString();
    const update = Q.collection("notificationRuleConfigs").updateOne(
      { ruleKey: AUTO_INVITER_RULE, "runState.currentStatus": { $ne: "running" } },
      {
        $set: {
          enabled: true,
          manualRunEnabled: false,
          scheduleSlots: [],
          "timing.mode": "interval",
          "timing.intervalAmount": 1,
          "timing.intervalUnit": "hours",
          "timing.intervalSeconds": AUTO_INVITER_HOLD_SECONDS,
          "timing.intervalMinutes": 60,
          "timing.time": "00:00",
          "timing.timezone": "UTC",
          "runState.currentStatus": "idle",
          "runState.progressPercent": 0,
          "runState.progressDetail": `Manual EVENT-EDITOR-003 periodic run is eligible after ${expectedDueAtIso}.`,
          "runState.lastRunAtIso": lastRunAt.toISOString(),
          "runState.pendingCount": 1,
          "runState.pendingCountUnit": "admin.jobs.table.affected",
          "runState.pendingCountUpdatedAtIso": scheduledAtIso,
          updatedDate: scheduledAtIso,
          updatedUser: Q.ACTOR
        },
        $unset: {
          "runState.startedAtIso": "",
          "runState.finishedAtIso": "",
          "runState.lastError": ""
        }
      }
    );
    if (update.matchedCount !== 1) {
      Q.fail("the auto-inviter started while its short schedule was being saved.");
    }
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: {
        "autoInviterScheduler.scheduledAtIso": scheduledAtIso,
        "autoInviterScheduler.scheduledDelaySeconds": requestedDelaySeconds,
        "autoInviterScheduler.expectedDueAtIso": expectedDueAtIso
      }
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "periodic-auto-inviter-scheduled",
      why: "Exercise the production scheduler path without directly invoking a worker or inserting an invitation.",
      scheduledAtIso,
      delaySeconds: requestedDelaySeconds,
      expectedDueAtIso,
      rule: autoInviterRuleSummary(),
      expectedVisibleResult: "After the real scheduler run and at most one 30-second SmartList poll, Riley receives exactly one invitation, the already-open Invitations list shows its card without close/reopen, and the already-open host card keeps accepted occupancy at 1/8 while its pending badge changes from 1 to 2 without a full popup reload."
    });
  }

  function status() {
    const selected = config();
    const state = Q.activeState(SCENARIO, false);
    if (!state) {
      Q.printObject({
        scenario: SCENARIO,
        checkpointId,
        phase: "not-staged",
        why: selected.why,
        next: `Run stage event-domain ${checkpointId}.`
      });
      return;
    }
    if (Q.text(state.checkpointId).toUpperCase() !== checkpointId) {
      Q.fail(`staged checkpoint is '${state.checkpointId}', not '${checkpointId}'.`);
    }
    const persistedOracle = oracle(state);
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "inspect-manual-checkpoint",
      why: selected.why,
      workerExpectation: selected.worker,
      verificationSteps: selected.checks || [],
      oracle: checkpointId === "TOURNAMENT-MEMBER-002"
        ? { ...persistedOracle, tournamentMemberRemoval: tournamentMemberRemovalSnapshot(state) }
        : persistedOracle,
      expectedVisibleResult: selected.expected,
      next: "Compare the UI screenshot with this identity-level oracle. If it agrees, record PASS and reset this checkpoint; otherwise retain both as defect evidence."
    });
  }

  function tournamentMemberRemovalSnapshot(state) {
    const context = state && state.context ? state.context : {};
    const roomIds = [Q.text(context.roomAId), Q.text(context.roomBId)].filter(Boolean);
    const ownerIds = [EVENT_ID, ...roomIds];
    const eventBySourceId = new Map(Q.collection("events").find({ sourceId: { $in: ownerIds } })
      .toArray().map(item => [Q.text(item.sourceId), item]));
    const activeMemberIds = ownerId => Q.collection("activityMembers").find({
      ownerType: "event",
      ownerId,
      status: { $in: ["accepted", "pending"] }
    }).toArray().map(member => Q.text(member.userId)).sort();
    const storedMemberStatus = (ownerId, userId) => {
      const member = Q.collection("activityMembers").findOne({
        ownerType: "event",
        ownerId,
        userId
      });
      return Q.text(member && member.status).toLowerCase();
    };
    const roomChats = roomIds.flatMap(roomId => Q.collection("chats").find({ eventId: roomId })
      .toArray().map(chat => ({
        roomId,
        ownerUserId: Q.text(chat.ownerUserId),
        memberIds: sortedUnique(chat.memberIds || []),
        chatId: Q.text(chat.id || chat.chatId)
      })));
    const chatChannel = chatId => {
      const copies = Q.collection("chats").find({
        $or: [{ id: chatId }, { chatId }, { ownerId: chatId }, { eventId: chatId }]
      }).toArray();
      const messages = Q.collection("chatMessages").find({ chatId }).sort({ sentAtIso: 1, id: 1 }).toArray();
      return {
        copies: copies.map(chat => ({
          ownerUserId: Q.text(chat.ownerUserId),
          memberIds: sortedUnique(chat.memberIds || []),
          unread: Number(chat.unread || 0),
          lastMessage: Q.text(chat.lastMessage)
        })).sort((left, right) => left.ownerUserId.localeCompare(right.ownerUserId)),
        messages: messages.map(message => ({
          clientId: Q.text(message.clientId),
          text: Q.text(message.text)
        }))
      };
    };
    const score = Q.collection("eventLeaderboardEntries").findOne({
      _id: `${PREFIX}:tournament-member-removal:score:nova`
    });
    const counter = userId => {
      const user = Q.ensureUser(userId, "tournament-member-removal user");
      return {
        userId,
        events: nestedNumber(user, "activities.events"),
        eventAll: nestedNumber(user, "activities.event.all"),
        eventActive: nestedNumber(user, "activities.event.active")
      };
    };
    const removalOutbox = Q.collection("notificationOutbox")
      .find({ "payload.parentEventId": EVENT_ID, "payload.membershipAction": "removed" })
      .toArray();
    const removalInbox = Q.collection("userNotifications")
      .find({ "payload.parentEventId": EVENT_ID, "payload.membershipAction": "removed" })
      .toArray();
    const parentEvent = eventBySourceId.get(EVENT_ID) || {};
    const qualifierRuntime = Q.collection("activitySubEventStageRuntime").findOne({
      ownerId: EVENT_ID,
      subEventId: Q.text(context.qualifierId)
    });
    return {
      parent: {
        acceptedMemberUserIds: sortedUnique(parentEvent.acceptedMemberUserIds || []),
        activeMemberUserIds: activeMemberIds(EVENT_ID),
        status: Q.text(parentEvent.status),
        currentStage: {
          id: Q.text(parentEvent.currentStage && parentEvent.currentStage.id),
          name: Q.text(parentEvent.currentStage && parentEvent.currentStage.name),
          stageNumber: Number(parentEvent.currentStage && parentEvent.currentStage.stageNumber || 0),
          totalStages: Number(parentEvent.currentStage && parentEvent.currentStage.totalStages || 0),
          status: Q.text(parentEvent.currentStage && parentEvent.currentStage.status)
        },
        qualifierRuntimeStatus: Q.text(qualifierRuntime && qualifierRuntime.stageStatus),
        novaMembershipStatus: storedMemberStatus(EVENT_ID, participantUserId)
      },
      rooms: roomIds.map(roomId => ({
        roomId,
        acceptedMemberUserIds: sortedUnique((eventBySourceId.get(roomId) || {}).acceptedMemberUserIds || []),
        activeMemberUserIds: activeMemberIds(roomId),
        status: Q.text((eventBySourceId.get(roomId) || {}).status),
        novaMembershipStatus: storedMemberStatus(roomId, participantUserId)
      })),
      roomChats,
      eventChat: chatChannel(EVENT_ID),
      roomChatChannels: roomIds.map(roomId => ({ roomId, ...chatChannel(roomId) })),
      retainedScore: score ? {
        id: Q.text(score._id),
        eventId: Q.text(score.eventId),
        subEventId: Q.text(score.subEventId),
        groupId: Q.text(score.groupId),
        memberId: Q.text(score.memberId),
        scoreValue: Number(score.scoreValue || 0),
        note: Q.text(score.note)
      } : null,
      removalNotifications: {
        outbox: removalOutbox.map(item => ({
          recipientScope: Q.text(item.recipientScope),
          recipientUserIds: sortedUnique(item.recipientUserIds || []),
          recipientRole: Q.text(item.payload && item.payload.recipientRole),
          memberName: Q.text(item.payload && item.payload.memberName),
          title: Q.text(item.title),
          body: Q.text(item.body || item.message)
        })),
        inbox: removalInbox.map(item => ({
          recipientUserId: Q.text(item.recipientUserId),
          recipientRole: Q.text(item.payload && item.payload.recipientRole),
          memberName: Q.text(item.payload && item.payload.memberName),
          title: Q.text(item.title),
          body: Q.text(item.body || item.message)
        }))
      },
      counters: [hostUserId, participantUserId, thirdUserId].map(counter)
    };
  }

  function counterFromSnapshot(snapshots, userId) {
    const saved = (snapshots || []).find(item => Q.text(item.userId) === userId);
    const activities = saved && saved.activities && saved.activities.present
      ? saved.activities.value || {}
      : {};
    return {
      events: nestedNumber(activities, "events"),
      eventAll: nestedNumber(activities, "event.all"),
      eventActive: nestedNumber(activities, "event.active")
    };
  }

  function verifyTournamentMemberRemoval() {
    if (checkpointId !== "TOURNAMENT-MEMBER-002") {
      Q.fail("verify-tournament-member-removal is only valid for TOURNAMENT-MEMBER-002.");
    }
    const state = requireMatchingState();
    const current = tournamentMemberRemovalSnapshot(state);
    const roomA = current.rooms.find(item => item.roomId === Q.text(state.context.roomAId));
    const roomB = current.rooms.find(item => item.roomId === Q.text(state.context.roomBId));
    const novaCounter = current.counters.find(item => item.userId === participantUserId);
    const caseyCounter = current.counters.find(item => item.userId === hostUserId);
    const rileyCounter = current.counters.find(item => item.userId === thirdUserId);
    const beforeNova = counterFromSnapshot(state.actionBaselineUserActivitySnapshots, participantUserId);
    const beforeCasey = counterFromSnapshot(state.actionBaselineUserActivitySnapshots, hostUserId);
    const beforeRiley = counterFromSnapshot(state.actionBaselineUserActivitySnapshots, thirdUserId);
    const expectedScore = {
      id: `${PREFIX}:tournament-member-removal:score:nova`,
      eventId: EVENT_ID,
      subEventId: Q.text(state.context.qualifierId),
      groupId: Q.text(state.context.groupAId),
      memberId: participantUserId,
      scoreValue: 7,
      note: "Manual QA retained removal-history score"
    };
    const novaHasRoomChat = current.roomChats.some(chat => (
      chat.ownerUserId === participantUserId || chat.memberIds.includes(participantUserId)));
    const removalOutbox = current.removalNotifications.outbox;
    const removalInbox = current.removalNotifications.inbox;
    const removedMemberOutbox = removalOutbox.find(item => item.recipientRole === "removed-member");
    const participantOutbox = removalOutbox.find(item => item.recipientRole === "event-participant");
    const novaInbox = removalInbox.find(item => item.recipientUserId === participantUserId);
    const rileyInbox = removalInbox.find(item => item.recipientUserId === thirdUserId);
    const roomAChat = current.roomChatChannels.find(item => item.roomId === Q.text(state.context.roomAId));
    const roomBChat = current.roomChatChannels.find(item => item.roomId === Q.text(state.context.roomBId));
    const exactSystemMessage = (channel, text) => channel
      && channel.messages.length === 1
      && channel.messages[0].clientId === "member-removed"
      && channel.messages[0].text === text;
    if (!current.parent
        || current.parent.status !== "A"
        || current.parent.currentStage.id !== Q.text(state.context.qualifierId)
        || current.parent.currentStage.name !== "Qualifiers"
        || current.parent.currentStage.stageNumber !== 1
        || current.parent.currentStage.totalStages !== 2
        || current.parent.currentStage.status !== "A"
        || current.parent.qualifierRuntimeStatus !== "A"
        || current.parent.activeMemberUserIds.includes(participantUserId)
        || current.parent.acceptedMemberUserIds.includes(participantUserId)
        || current.parent.novaMembershipStatus !== "deleted"
        || !roomA || !roomB
        || roomA.status !== "A" || roomB.status !== "A"
        || roomA.activeMemberUserIds.includes(participantUserId)
        || roomA.acceptedMemberUserIds.includes(participantUserId)
        || roomA.novaMembershipStatus !== "removed"
        || roomA.novaMembershipStatus === "disqualified"
        || novaHasRoomChat
        || !exactSystemMessage(current.eventChat, "Nova Social was removed from the event.")
        || !sameJson(current.eventChat.copies.map(copy => copy.ownerUserId).sort(), [hostUserId, thirdUserId].sort())
        || current.eventChat.copies.some(copy => copy.memberIds.includes(participantUserId))
        || !exactSystemMessage(roomAChat, "Nova Social was removed from the tournament group.")
        || !sameJson(roomAChat && roomAChat.copies.map(copy => copy.ownerUserId), [hostUserId])
        || roomAChat.copies.some(copy => copy.memberIds.includes(participantUserId))
        || !roomBChat
        || roomBChat.messages.length !== 0
        || !sameJson(roomBChat.copies, [{
          ownerUserId: thirdUserId,
          memberIds: [thirdUserId],
          unread: 0,
          lastMessage: ""
        }])
        || !roomB.activeMemberUserIds.includes(thirdUserId)
        || !roomB.acceptedMemberUserIds.includes(thirdUserId)
        || !sameJson(current.retainedScore, expectedScore)
        || removalOutbox.length !== 2
        || !removedMemberOutbox
        || removedMemberOutbox.recipientScope !== "removed-member"
        || !sameJson(removedMemberOutbox.recipientUserIds, [participantUserId])
        || removedMemberOutbox.memberName !== "Nova Social"
        || removedMemberOutbox.title !== EXPECTED_TITLE
        || removedMemberOutbox.body !== `You were removed from ${EXPECTED_TITLE}.`
        || !participantOutbox
        || participantOutbox.recipientScope !== "event-participants"
        || !sameJson(participantOutbox.recipientUserIds, [thirdUserId])
        || participantOutbox.memberName !== "Nova Social"
        || participantOutbox.title !== EXPECTED_TITLE
        || participantOutbox.body !== `Nova Social was removed from ${EXPECTED_TITLE}.`
        || removalOutbox.some(item => item.recipientUserIds.includes(hostUserId))
        || removalInbox.length !== 2
        || !novaInbox
        || novaInbox.recipientRole !== "removed-member"
        || novaInbox.memberName !== "Nova Social"
        || !rileyInbox
        || rileyInbox.recipientRole !== "event-participant"
        || rileyInbox.memberName !== "Nova Social"
        || removalInbox.some(item => item.recipientUserId === hostUserId)
        || !novaCounter
        || novaCounter.events !== Math.max(0, beforeNova.events - 1)
        || novaCounter.eventAll !== Math.max(0, beforeNova.eventAll - 1)
        || novaCounter.eventActive !== Math.max(0, beforeNova.eventActive - 1)
        || !sameJson(caseyCounter && {
          events: caseyCounter.events, eventAll: caseyCounter.eventAll, eventActive: caseyCounter.eventActive
        }, beforeCasey)
        || !sameJson(rileyCounter && {
          events: rileyCounter.events, eventAll: rileyCounter.eventAll, eventActive: rileyCounter.eventActive
        }, beforeRiley)) {
      Q.fail("TOURNAMENT-MEMBER-002 did not preserve the removal, score, recipient and chat-scope boundary: parent Event and affected Group A must each receive one message while unrelated Group B stays byte-for-byte unread and message-empty.");
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "tournament-member-removal-verified",
      oracle: current,
      next: "In Group A standings confirm active Casey, then R / Nova Social / 7, then V / -----. Casey checks the parent Event plus Group A removal messages. Riley checks the parent Event removal message and verifies Group B has no new group message or red counter. Nova checks the self-removal notification and cannot reopen parent/room; then record PASS/CLOSED and reset."
    });
  }

  function verifyTicketPollResume() {
    if (checkpointId !== "EVENT-TICKET-POLL-001") {
      Q.fail("verify-ticket-poll-resume is only valid for EVENT-TICKET-POLL-001.");
    }
    const state = requireMatchingState();
    const event = Q.collection("events").findOne({
      sourceId: EVENT_ID,
      ownerUserId: hostUserId
    });
    if (!event || Q.text(event.status) !== "DR") {
      Q.fail("Casey's canonical event must be Draft after the real Unpublish action.");
    }
    if (!Boolean(event.ticketing)) {
      Q.fail("Unpublish must preserve Ticketing On; this phase tests lifecycle deactivation, not the Ticketing toggle.");
    }
    if (Number(event.acceptedMembers || 0) !== 2
        || Number(event.pendingMembers || 0) !== 1
        || !sameIds(event.acceptedMemberUserIds, [hostUserId, participantUserId])
        || !sameIds(event.pendingMemberUserIds, [thirdUserId])) {
      Q.fail("Unpublish changed the controlled 2 / 8 plus Riley-pending membership baseline.");
    }
    const tickets = Q.collection("eventTickets").find({ eventId: EVENT_ID }).toArray();
    const participantTickets = tickets.filter(ticket => Q.text(ticket.holderUserId) === participantUserId);
    if (participantTickets.length !== 1 || Q.text(participantTickets[0].status) !== "D") {
      Q.fail("Unpublish must retain Nova's one physical ticket exactly once as a deleted audit record with status D.");
    }
    const userCounters = [hostUserId, participantUserId, thirdUserId].map(userId => {
      const user = Q.collection("users").findOne({ $or: [{ _id: userId }, { userId }] });
      if (!user) Q.fail(`controlled user '${userId}' no longer exists.`);
      return {
        user: Q.user(userId),
        events: nestedNumber(user, "activities.events"),
        activeEvents: nestedNumber(user, "activities.event.active"),
        tickets: nestedNumber(user, "activities.tickets"),
        assetTickets: nestedNumber(user, "activities.asset.tickets")
      };
    });
    const hostCounters = userCounters.find(counter => counter.user.userId === hostUserId);
    const participantCounters = userCounters.find(counter => counter.user.userId === participantUserId);
    const thirdUserCounters = userCounters.find(counter => counter.user.userId === thirdUserId);
    if (!participantCounters
        || participantCounters.events !== 0
        || participantCounters.activeEvents !== 0
        || participantCounters.tickets !== 0
        || participantCounters.assetTickets !== 0) {
      Q.fail("Nova must finish with Events 0 / active 0 and Ticket counters 0 / 0 after Unpublish revokes the active ticket.");
    }
    if (!hostCounters || hostCounters.tickets !== 0 || hostCounters.assetTickets !== 0
        || !thirdUserCounters || thirdUserCounters.tickets !== 0 || thirdUserCounters.assetTickets !== 0) {
      Q.fail("Casey and Riley must remain ticketless at users-table counters 0 / 0.");
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "ticket-popup-closed-background-poll-oracle-ready",
      verifiedAtIso: Q.nowIso(),
      event: {
        eventId: EVENT_ID,
        status: Q.text(event.status),
        ticketing: Boolean(event.ticketing),
        acceptedMembers: Number(event.acceptedMembers || 0),
        pendingMembers: Number(event.pendingMembers || 0),
        capacityTotal: Number(event.capacityTotal || 0)
      },
      revokedTicket: {
        id: Q.text(participantTickets[0]._id),
        code: Q.text(participantTickets[0].code),
        status: Q.text(participantTickets[0].status),
        holderUserId: Q.text(participantTickets[0].holderUserId)
      },
      userCounters,
      expectedVisibleResult: "With every popup closed, Nova's open side menu changes Events 1 -> 0 and Ticket 1 -> 0 within one normal background poll interval; no popup reopen or browser reload is allowed.",
      next: "If the side-menu counter reached 0 without popup reopen/reload, record EVENT-TICKET-POLL-001 PASS/CLOSED and continue with EVENT-TICKET-003."
    });
  }

  function verifyTicketIsolation(expectedPhase) {
    if (checkpointId !== "EVENT-TICKET-008") {
      Q.fail(`${command} is only valid for EVENT-TICKET-008.`);
    }
    const state = requireMatchingState();
    const eventA = Q.collection("events").findOne({
      sourceId: EVENT_ID,
      ownerUserId: hostUserId
    });
    const eventB = Q.collection("events").findOne({
      sourceId: ISOLATION_EVENT_ID,
      ownerUserId: hostUserId
    });
    const expectedAStatus = expectedPhase === "unpublished" ? "DR" : "A";
    if (!eventA || Q.text(eventA.status) !== expectedAStatus || !Boolean(eventA.ticketing)) {
      Q.fail(`event A must be ${expectedAStatus} with Ticketing On during the ${expectedPhase} isolation phase.`);
    }
    if (!eventB || Q.text(eventB.status) !== "A" || !Boolean(eventB.ticketing)) {
      Q.fail("control event B must remain active with Ticketing On.");
    }
    for (const event of [eventA, eventB]) {
      if (Number(event.acceptedMembers || 0) !== 2
          || Number(event.pendingMembers || 0) !== 1
          || !sameIds(event.acceptedMemberUserIds, [hostUserId, participantUserId])
          || !sameIds(event.pendingMemberUserIds, [thirdUserId])) {
        Q.fail(`event '${Q.text(event.sourceId)}' lost the controlled Casey/Nova accepted plus Riley pending membership.`);
      }
    }
    const eventATickets = Q.collection("eventTickets").find({ eventId: EVENT_ID }).toArray();
    const eventBTickets = Q.collection("eventTickets").find({ eventId: ISOLATION_EVENT_ID }).toArray();
    const originalA = eventATickets.find(ticket => Q.text(ticket._id) === `${PREFIX}:ticket:isolation:a`);
    const activeA = eventATickets.filter(ticket => Q.text(ticket.status) === "A");
    if (!originalA
        || Q.text(originalA.code) !== Q.text(state.context && state.context.ticketCode)
        || Q.text(originalA.status) !== "D") {
      Q.fail("event A's original physical ticket must remain exactly once as the unchanged D audit record.");
    }
    if (expectedPhase === "unpublished" && (eventATickets.length !== 1 || activeA.length !== 0)) {
      Q.fail("unpublished event A must have its one original D ticket and no active ticket.");
    }
    if (expectedPhase === "republished"
        && (eventATickets.length !== 2
          || activeA.length !== 1
          || Q.text(activeA[0]._id) === Q.text(originalA._id)
          || Q.text(activeA[0].code) === Q.text(originalA.code))) {
      Q.fail("republished event A must have one new active ticket with a new id and QR code beside the original D audit record.");
    }
    if (eventBTickets.length !== 1
        || Q.text(eventBTickets[0]._id) !== `${PREFIX}:ticket:isolation:b`
        || Q.text(eventBTickets[0].code) !== Q.text(state.context && state.context.isolationTicketCode)
        || Q.text(eventBTickets[0].status) !== "A"
        || Q.text(eventBTickets[0].holderUserId) !== participantUserId) {
      Q.fail("control event B's physical ticket id/code/holder/A status changed or was duplicated.");
    }
    const crossBoundTickets = [...eventATickets, ...eventBTickets].filter(ticket =>
      Q.text(ticket.holderUserId) !== participantUserId
    );
    if (crossBoundTickets.length !== 0) {
      Q.fail("Casey or pending Riley received a physical ticket in the isolation fixture.");
    }
    const savedParticipant = savedUserActivity(state, participantUserId);
    const baselineActivities = savedParticipant && savedParticipant.activities && savedParticipant.activities.present
      ? savedParticipant.activities.value || {}
      : {};
    const expectedIncrement = expectedPhase === "unpublished" ? 1 : 2;
    const participant = Q.collection("users").findOne({
      $or: [{ _id: participantUserId }, { userId: participantUserId }]
    });
    if (!participant
        || nestedNumber(participant, "activities.tickets") !== nestedNumber(baselineActivities, "tickets") + expectedIncrement
        || nestedNumber(participant, "activities.asset.tickets") !== nestedNumber(baselineActivities, "asset.tickets") + expectedIncrement) {
      Q.fail(`Nova's stored ticket counters must equal the pre-fixture baseline plus ${expectedIncrement}.`);
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: `ticket-isolation-${expectedPhase}-verified`,
      verifiedAtIso: Q.nowIso(),
      events: [eventA, eventB].map(event => ({
        eventId: Q.text(event.sourceId),
        title: Q.text(event.title),
        status: Q.text(event.status),
        ticketing: Boolean(event.ticketing)
      })),
      eventATickets: eventATickets.map(ticket => ({
        id: Q.text(ticket._id),
        code: Q.text(ticket.code),
        status: Q.text(ticket.status),
        holderUserId: Q.text(ticket.holderUserId)
      })),
      controlEventBTicket: {
        id: Q.text(eventBTickets[0]._id),
        code: Q.text(eventBTickets[0].code),
        status: Q.text(eventBTickets[0].status),
        holderUserId: Q.text(eventBTickets[0].holderUserId)
      },
      participantTicketCounters: {
        tickets: nestedNumber(participant, "activities.tickets"),
        assetTickets: nestedNumber(participant, "activities.asset.tickets")
      },
      next: expectedPhase === "unpublished"
        ? "Publish only event A with Ticketing still On, wait for Nova's normal poll, then run verify-ticket-isolation-republish."
        : "If Nova shows both event tickets exactly once and event B never changed identity, record EVENT-TICKET-008 PASS/CLOSED."
    });
  }

  function reset() {
    config();
    const state = requireMatchingState();
    backfillLegacyFeedbackHostSnapshot(state);
    resetState(state);
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "reset-complete",
      restoredAtIso: Q.nowIso(),
      next: `Run status event-domain ${checkpointId}; expected phase is not-staged.`
    });
  }

  function repairLifecycleCounterBaseline() {
    config();
    if (checkpointId !== "EVENT-LIFE-002") {
      Q.fail("repair-lifecycle-counter-baseline currently supports only EVENT-LIFE-002.");
    }
    const state = requireMatchingState();
    if ((state.userActivitySnapshots || []).length > 0) {
      Q.fail("lifecycle activity snapshots already exist; refusing to replace the reset baseline.");
    }
    const event = Q.collection("events").findOne({ sourceId: EVENT_ID });
    if (!event
        || Q.text(event.status).toUpperCase() !== "A"
        || event.published !== true
        || event.isTrashed === true
        || Q.text(event.statusBeforeSuppression)) {
      Q.fail("EVENT-LIFE-002 is no longer at the untouched active baseline; do not repair counters after the Trash action.");
    }

    const snapshots = [hostUserId, participantUserId].map(userActivitiesSnapshot);
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: state._id },
      { $set: { userActivitySnapshots: snapshots } }
    );
    synchronizeEventActivityCounters([hostUserId, participantUserId]);

    const summary = [hostUserId, participantUserId].map(userId => {
      const current = userActivitiesSnapshot(userId).activities.value || {};
      return {
        user: Q.user(userId),
        events: nestedNumber(current, "events"),
        hosting: nestedNumber(current, "hosting"),
        event: current.event || {}
      };
    });
    const host = summary.find(item => Q.text(item.user && item.user.userId) === hostUserId);
    const participant = summary.find(item => Q.text(item.user && item.user.userId) === participantUserId);
    if (!host || host.hosting < 1 || !participant || participant.events < 1) {
      Q.fail("lifecycle counter projection did not expose the staged host/member event on both users.");
    }

    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "baseline-counter-projection-repaired",
      activitySnapshotsCaptured: snapshots.length,
      counters: summary,
      smartListChanged: false,
      eventChanged: false,
      next: "Reload Casey and Nova once. My Events and Events counters must already be visible before either popup is opened."
    });
  }

  function repairLifecycleOccupancyBaseline() {
    config();
    if (checkpointId !== "EVENT-LIFE-002") {
      Q.fail("repair-lifecycle-occupancy-baseline currently supports only EVENT-LIFE-002.");
    }
    requireMatchingState();
    const event = Q.collection("events").findOne({ sourceId: EVENT_ID });
    if (!event
        || Q.text(event.status).toUpperCase() !== "A"
        || event.published !== true
        || event.isTrashed === true
        || Q.text(event.statusBeforeSuppression)) {
      Q.fail("EVENT-LIFE-002 is no longer at the untouched active baseline; do not repair occupancy after the Trash action.");
    }
    const acceptedMembershipUserIds = sortedUnique(Q.collection("activityMembers").find({
      ownerType: "event",
      ownerId: EVENT_ID,
      status: "accepted"
    }).toArray().map(member => member.userId));
    if (!sameIds(acceptedMembershipUserIds, [hostUserId, participantUserId])) {
      Q.fail("EVENT-LIFE-002 must retain exactly Casey Admin and Nova Member as accepted memberships before occupancy repair.");
    }

    const alreadyCanonical = Number(event.acceptedMembers || 0) === 2
      && sameIds(event.acceptedMemberUserIds, acceptedMembershipUserIds);
    if (!alreadyCanonical) {
      const update = Q.collection("events").updateOne({
        _id: event._id,
        sourceId: EVENT_ID,
        status: "A"
      }, {
        $set: {
          acceptedMembers: acceptedMembershipUserIds.length,
          acceptedMemberUserIds: acceptedMembershipUserIds,
          updatedDate: Q.nowIso(),
          updatedUser: Q.ACTOR
        }
      });
      if (update.matchedCount !== 1) {
        Q.fail("EVENT-LIFE-002 occupancy repair lost its guarded active event target.");
      }
    }

    const repaired = Q.collection("events").findOne({ sourceId: EVENT_ID });
    if (!repaired
        || Number(repaired.acceptedMembers || 0) !== 2
        || !sameIds(repaired.acceptedMemberUserIds, acceptedMembershipUserIds)) {
      Q.fail("EVENT-LIFE-002 embedded occupancy still disagrees with its canonical accepted memberships.");
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: alreadyCanonical ? "baseline-occupancy-already-canonical" : "baseline-occupancy-repaired",
      eventId: EVENT_ID,
      acceptedMembers: Number(repaired.acceptedMembers || 0),
      acceptedMemberUserIds: repaired.acceptedMemberUserIds || [],
      capacityTotal: Number(repaired.capacityTotal || 0),
      membershipChanged: false,
      smartListChanged: false,
      next: "Keep both event popups open. Their normal popup poll must converge from 1 / 8 to 2 / 8 without a browser reload."
    });
  }

  function captureLifecycleActionBaseline() {
    config();
    if (checkpointId !== "EVENT-LIFE-002") {
      Q.fail("capture-lifecycle-action-baseline currently supports only EVENT-LIFE-002.");
    }
    const state = requireMatchingState();
    if (state.lifecycleActionBaseline) {
      Q.fail("EVENT-LIFE-002 action baseline is already captured; do not move the attribution boundary.");
    }
    const current = oracle(state);
    const event = (current.events || []).find(item => item.eventId === EVENT_ID);
    const acceptedMemberIds = sortedUnique((current.members || [])
      .filter(member => member.eventId === EVENT_ID && member.status === "accepted")
      .map(member => member.userId));
    if (!event
        || event.status !== "A"
        || event.published !== true
        || event.isTrashed === true
        || event.statusBeforeSuppression
        || event.acceptedMembers !== 2
        || event.capacityTotal !== 8
        || !sameIds(event.acceptedMemberUserIds, [hostUserId, participantUserId])
        || !sameIds(acceptedMemberIds, [hostUserId, participantUserId])) {
      Q.fail("EVENT-LIFE-002 must be the canonical active Casey/Nova 2 / 8 baseline before attribution capture.");
    }
    const unfinishedRecompute = (current.eventRecomputeTasks || []).filter(task =>
      ["pending", "running", "in_progress"].includes(Q.text(task.status).toLowerCase()));
    if (unfinishedRecompute.length > 0) {
      Q.fail("EVENT-LIFE-002 still has an unfinished pre-action recompute; wait for the existing worker before baseline capture.");
    }

    const capturedAtIso = Q.nowIso();
    const lifecycleActionBaseline = {
      capturedAtIso,
      event: {
        eventId: event.eventId,
        status: event.status,
        published: event.published,
        isTrashed: event.isTrashed,
        statusBeforeSuppression: event.statusBeforeSuppression,
        acceptedMembers: event.acceptedMembers,
        acceptedMemberUserIds: event.acceptedMemberUserIds,
        capacityTotal: event.capacityTotal
      },
      members: (current.members || []).filter(member => member.eventId === EVENT_ID),
      eventLifecycleTasks: current.eventLifecycleTasks || [],
      eventLifecycleOutbox: current.eventLifecycleOutbox || [],
      eventLifecycleNotifications: current.eventLifecycleNotifications || [],
      eventRecomputeTasks: current.eventRecomputeTasks || []
    };
    const lifecycleActionBaselineUserActivitySnapshots = [hostUserId, participantUserId]
      .map(userActivitiesSnapshot);
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: {
        lifecycleActionBaseline,
        lifecycleActionBaselineUserActivitySnapshots
      }
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "lifecycle-action-baseline-captured",
      capturedAtIso,
      event: lifecycleActionBaseline.event,
      memberCount: lifecycleActionBaseline.members.length,
      preActionArtifacts: {
        lifecycleTasks: lifecycleActionBaseline.eventLifecycleTasks.length,
        lifecycleOutbox: lifecycleActionBaseline.eventLifecycleOutbox.length,
        lifecycleNotifications: lifecycleActionBaseline.eventLifecycleNotifications.length,
        recomputeTasks: lifecycleActionBaseline.eventRecomputeTasks.length
      },
      userCounters: lifecycleActionBaselineUserActivitySnapshots.map(snapshot => ({
        user: Q.user(snapshot.userId),
        events: nestedNumber(snapshot.activities.value || {}, "events"),
        hosting: nestedNumber(snapshot.activities.value || {}, "hosting"),
        event: snapshot.activities.value && snapshot.activities.value.event || {}
      })),
      next: "Casey opens QA EVENT-LIFE-002 card actions and chooses Delete Event exactly once. Nova does not interact."
    });
  }

  function verifyLifecycleTrash() {
    config();
    if (checkpointId !== "EVENT-LIFE-002") {
      Q.fail("verify-lifecycle-trash currently supports only EVENT-LIFE-002.");
    }
    const state = requireMatchingState();
    const baseline = state.lifecycleActionBaseline;
    if (!baseline || !baseline.capturedAtIso) {
      Q.fail("EVENT-LIFE-002 requires its saved lifecycle action baseline before Trash verification.");
    }
    const current = oracle(state);
    const event = (current.events || []).find(item => item.eventId === EVENT_ID);
    if (!event
        || event.status !== "T"
        || event.statusBeforeSuppression !== "A"
        || !event.trashedAtIso
        || event.trashedAtIso <= baseline.capturedAtIso
        || event.acceptedMembers !== 2
        || event.capacityTotal !== 8
        || !sameIds(event.acceptedMemberUserIds, [hostUserId, participantUserId])) {
      Q.fail("EVENT-LIFE-002 must retain the canonical Casey/Nova 2 / 8 identity with T, statusBeforeSuppression=A and a post-baseline trashedAtIso.");
    }

    const acceptedMembers = (current.members || [])
      .filter(member => member.eventId === EVENT_ID && member.status === "accepted");
    if (acceptedMembers.length !== 2
        || !sameIds(acceptedMembers.map(member => member.userId), [hostUserId, participantUserId])
        || !acceptedMembers.some(member => member.userId === hostUserId && member.role === "Admin")
        || !acceptedMembers.some(member => member.userId === participantUserId && member.role === "Member")) {
      Q.fail("Organizer Trash must retain the exact accepted Casey Admin and Nova Member membership audit rows.");
    }

    const countersByUserId = new Map((current.userActivityCounters || [])
      .map(item => [Q.text(item.user && item.user.userId), item.current || {}]));
    const hostCounters = countersByUserId.get(hostUserId) || {};
    const participantCounters = countersByUserId.get(participantUserId) || {};
    const hostEvent = hostCounters.event || {};
    const participantEvent = participantCounters.event || {};
    if (Number(hostCounters.hosting || 0) !== 0
        || Number(hostEvent.all || 0) !== 0
        || Number(hostEvent.hosting || 0) !== 0
        || Number(hostEvent.trash || 0) !== 1) {
      Q.fail("Casey must finish Hosting/All/Hosting bucket 0 with organizer Trash exactly 1.");
    }
    if (Number(participantCounters.events || 0) !== 0
        || Number(participantEvent.all || 0) !== 0
        || Number(participantEvent.active || 0) !== 0
        || Number(participantEvent.trash || 0) !== 0) {
      Q.fail("Nova must lose Active/All without gaining a personal Trash entry.");
    }

    const baselineLifecycleTaskIds = new Set((baseline.eventLifecycleTasks || []).map(item => Q.text(item.id)));
    const lifecycleTaskDelta = (current.eventLifecycleTasks || [])
      .filter(item => !baselineLifecycleTaskIds.has(Q.text(item.id)));
    if (lifecycleTaskDelta.length !== 1
        || lifecycleTaskDelta[0].status !== "completed"
        || lifecycleTaskDelta[0].lastRunStatus !== "completed"
        || lifecycleTaskDelta[0].lastRunCount !== 1
        || !sameIds(lifecycleTaskDelta[0].audienceUserIds, [participantUserId])
        || !sameIds(lifecycleTaskDelta[0].changeReasons, ["deleted"])) {
      Q.fail("Trash must produce exactly one completed deleted lifecycle task for Nova.");
    }

    const baselineNotificationIds = new Set((baseline.eventLifecycleNotifications || []).map(item => Q.text(item.id)));
    const notificationDelta = (current.eventLifecycleNotifications || [])
      .filter(item => !baselineNotificationIds.has(Q.text(item.id)));
    if (notificationDelta.length !== 1
        || notificationDelta[0].recipientUserId !== participantUserId
        || notificationDelta[0].kind !== "event-deleted"
        || notificationDelta[0].eventId !== EVENT_ID
        || notificationDelta[0].readAtIso) {
      Q.fail("Trash must create exactly one unread event-deleted notification for Nova and none for Casey.");
    }

    const baselineOutboxIds = new Set((baseline.eventLifecycleOutbox || []).map(item => Q.text(item.id)));
    const outboxDelta = (current.eventLifecycleOutbox || [])
      .filter(item => !baselineOutboxIds.has(Q.text(item.id)));
    if (outboxDelta.length !== 1
        || outboxDelta[0].notificationType !== "event-deleted"
        || outboxDelta[0].eventId !== EVENT_ID
        || outboxDelta[0].status !== "pending"
        || !sameIds(outboxDelta[0].recipientUserIds, [participantUserId])) {
      Q.fail("Dev-mode Trash must retain exactly one pending Firebase event-deleted outbox record for Nova.");
    }

    const baselineRecomputeById = new Map((baseline.eventRecomputeTasks || [])
      .map(item => [Q.text(item.id), item]));
    const recomputeDelta = (current.eventRecomputeTasks || []).filter(item => {
      const before = baselineRecomputeById.get(Q.text(item.id));
      return !before || Q.text(item.updatedDate) > Q.text(before.updatedDate);
    });
    if (recomputeDelta.length !== 1
        || !recomputeDelta[0].reasons.includes("EVENT_CHANGED")
        || recomputeDelta[0].status !== "done"
        || !recomputeDelta[0].completedAtIso
        || recomputeDelta[0].updatedDate <= baseline.capturedAtIso) {
      Q.fail("Trash must add exactly one terminal EVENT_CHANGED recompute delta after the saved action baseline.");
    }

    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "lifecycle-trash-verified",
      verifiedAtIso: Q.nowIso(),
      actionBaselineCapturedAtIso: baseline.capturedAtIso,
      event: {
        eventId: event.eventId,
        status: event.status,
        statusBeforeSuppression: event.statusBeforeSuppression,
        trashedAtIso: event.trashedAtIso,
        acceptedMembers: event.acceptedMembers,
        capacityTotal: event.capacityTotal
      },
      counters: { host: hostCounters, participant: participantCounters },
      lifecycleTask: lifecycleTaskDelta[0],
      lifecycleOutbox: outboxDelta[0],
      notification: notificationDelta[0],
      recompute: recomputeDelta[0],
      immediateTrashCounterObservation: "NOT EXECUTED: the user did not observe whether Casey Trash +1 came from the action delta or a later poll.",
      next: "Persisted Trash transaction is verified. Follow CURRENT_QA_SESSION.md for the remaining UI/read branch; do not replay Delete."
    });
  }

  function lifecycleResourceSnapshot() {
    return Q.collection("activityResources").find({
      ownerId: { $regex: `^${PREFIX}` }
    }).sort({ _id: 1 }).toArray().map(item => ({
      id: Q.text(item._id),
      ownerId: Q.text(item.ownerId),
      ownerType: Q.text(item.ownerType),
      type: Q.text(item.type),
      status: Q.text(item.status)
    }));
  }

  function captureLifecycleRestoreBaseline() {
    config();
    if (checkpointId !== "EVENT-LIFE-003") {
      Q.fail("capture-lifecycle-restore-baseline currently supports only EVENT-LIFE-003.");
    }
    const state = requireMatchingState();
    if (state.lifecycleRestoreBaseline && state.lifecycleRestoreBaseline.capturedAtIso) {
      Q.fail("EVENT-LIFE-003 already has a saved Restore baseline.");
    }
    const current = oracle(state);
    const event = (current.events || []).find(item => item.eventId === EVENT_ID);
    const acceptedMembers = (current.members || [])
      .filter(member => member.eventId === EVENT_ID && member.status === "accepted");
    const countersByUserId = new Map((current.userActivityCounters || [])
      .map(item => [Q.text(item.user && item.user.userId), item.current || {}]));
    const hostCounters = countersByUserId.get(hostUserId) || {};
    const participantCounters = countersByUserId.get(participantUserId) || {};
    const hostEvent = hostCounters.event || {};
    const participantEvent = participantCounters.event || {};
    if ((current.events || []).length !== 1
        || !event
        || event.status !== "T"
        || event.statusBeforeSuppression !== "A"
        || !event.trashedAtIso
        || event.acceptedMembers !== 2
        || event.capacityTotal !== 8
        || !sameIds(event.acceptedMemberUserIds, [hostUserId, participantUserId])
        || acceptedMembers.length !== 2
        || !sameIds(acceptedMembers.map(member => member.userId), [hostUserId, participantUserId])
        || Number(hostCounters.hosting || 0) !== 0
        || Number(hostEvent.all || 0) !== 0
        || Number(hostEvent.trash || 0) !== 1
        || Number(participantCounters.events || 0) !== 0
        || Number(participantEvent.all || 0) !== 0
        || Number(participantEvent.active || 0) !== 0
        || Number(participantEvent.trash || 0) !== 0
        || (current.eventLifecycleTasks || []).length !== 0
        || (current.eventLifecycleOutbox || []).length !== 0
        || (current.eventLifecycleNotifications || []).length !== 0
        || (current.eventRecomputeTasks || []).length !== 0) {
      Q.fail("EVENT-LIFE-003 is not at the exact clean Casey-only Trash baseline.");
    }
    const capturedAtIso = Q.nowIso();
    const lifecycleRestoreBaseline = {
      capturedAtIso,
      events: current.events,
      members: current.members,
      resources: lifecycleResourceSnapshot(),
      checkoutBasketItems: current.checkoutBasketItems,
      payments: current.payments,
      tickets: current.tickets,
      eventChats: current.eventChats,
      eventLifecycleTasks: current.eventLifecycleTasks,
      eventLifecycleOutbox: current.eventLifecycleOutbox,
      eventLifecycleNotifications: current.eventLifecycleNotifications,
      eventRecomputeTasks: current.eventRecomputeTasks
    };
    const lifecycleActionBaselineUserActivitySnapshots = [hostUserId, participantUserId]
      .map(userActivitiesSnapshot);
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: { lifecycleRestoreBaseline, lifecycleActionBaselineUserActivitySnapshots }
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "lifecycle-restore-baseline-captured",
      capturedAtIso,
      event: {
        eventId: event.eventId,
        status: event.status,
        statusBeforeSuppression: event.statusBeforeSuppression,
        trashedAtIso: event.trashedAtIso,
        acceptedMembers: event.acceptedMembers,
        capacityTotal: event.capacityTotal
      },
      counters: { host: hostCounters, participant: participantCounters },
      cardinality: {
        events: current.events.length,
        members: current.members.length,
        resources: lifecycleRestoreBaseline.resources.length,
        tickets: current.tickets.length
      },
      next: "Casey restores QA EVENT-LIFE-003 exactly once from Events > Trash."
    });
  }

  function verifyLifecycleRestore() {
    config();
    if (checkpointId !== "EVENT-LIFE-003") {
      Q.fail("verify-lifecycle-restore currently supports only EVENT-LIFE-003.");
    }
    const state = requireMatchingState();
    const baseline = state.lifecycleRestoreBaseline;
    if (!baseline || !baseline.capturedAtIso) {
      Q.fail("EVENT-LIFE-003 requires its saved Restore baseline before verification.");
    }
    const current = oracle(state);
    const event = (current.events || []).find(item => item.eventId === EVENT_ID);
    const originalEvent = (baseline.events || [])[0] || {};
    if ((current.events || []).length !== 1
        || !event
        || event.recordId !== originalEvent.recordId
        || event.eventId !== originalEvent.eventId
        || event.title !== originalEvent.title
        || event.status !== "A"
        || event.published !== true
        || event.isTrashed !== false
        || event.statusBeforeSuppression
        || event.trashedAtIso
        || event.acceptedMembers !== 2
        || event.capacityTotal !== 8
        || !sameIds(event.acceptedMemberUserIds, [hostUserId, participantUserId])) {
      Q.fail("Restore must preserve one event identity and return it to A with suppression fields cleared.");
    }
    if (!sameJson(current.members || [], baseline.members || [])
        || !sameJson(lifecycleResourceSnapshot(), baseline.resources || [])
        || !sameJson(current.checkoutBasketItems || [], baseline.checkoutBasketItems || [])
        || !sameJson(current.payments || [], baseline.payments || [])
        || !sameJson(current.tickets || [], baseline.tickets || [])
        || !sameJson(current.eventChats || [], baseline.eventChats || [])) {
      Q.fail("Restore duplicated or rewrote member, resource, basket, payment, ticket or chat identity.");
    }
    const countersByUserId = new Map((current.userActivityCounters || [])
      .map(item => [Q.text(item.user && item.user.userId), item.current || {}]));
    const hostCounters = countersByUserId.get(hostUserId) || {};
    const participantCounters = countersByUserId.get(participantUserId) || {};
    const hostEvent = hostCounters.event || {};
    const participantEvent = participantCounters.event || {};
    if (Number(hostCounters.hosting || 0) !== 1
        || Number(hostEvent.all || 0) !== 1
        || Number(hostEvent.hosting || 0) !== 1
        || Number(hostEvent.trash || 0) !== 0
        || Number(participantCounters.events || 0) !== 1
        || Number(participantEvent.all || 0) !== 1
        || Number(participantEvent.active || 0) !== 1
        || Number(participantEvent.trash || 0) !== 0) {
      Q.fail("Restore must return Casey to Hosting/All and Nova to Active/All exactly once.");
    }
    if (!sameJson(current.eventLifecycleTasks || [], baseline.eventLifecycleTasks || [])
        || !sameJson(current.eventLifecycleOutbox || [], baseline.eventLifecycleOutbox || [])
        || !sameJson(current.eventLifecycleNotifications || [], baseline.eventLifecycleNotifications || [])) {
      Q.fail("Restore must not manufacture a lifecycle message, outbox row or notification.");
    }
    const baselineRecomputeById = new Map((baseline.eventRecomputeTasks || [])
      .map(item => [Q.text(item.id), item]));
    const recomputeDelta = (current.eventRecomputeTasks || []).filter(item => {
      const before = baselineRecomputeById.get(Q.text(item.id));
      return !before || Q.text(item.updatedDate) > Q.text(before.updatedDate);
    });
    if (recomputeDelta.length !== 1
        || !recomputeDelta[0].reasons.includes("EVENT_CHANGED")
        || recomputeDelta[0].status !== "done"
        || !recomputeDelta[0].completedAtIso
        || recomputeDelta[0].updatedDate <= baseline.capturedAtIso) {
      Q.fail("Restore must produce exactly one terminal EVENT_CHANGED recompute delta.");
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "lifecycle-restore-verified",
      verifiedAtIso: Q.nowIso(),
      actionBaselineCapturedAtIso: baseline.capturedAtIso,
      event,
      counters: { host: hostCounters, participant: participantCounters },
      recompute: recomputeDelta[0],
      unchangedCardinality: {
        events: current.events.length,
        members: current.members.length,
        resources: lifecycleResourceSnapshot().length,
        tickets: current.tickets.length
      },
      next: "Run the documented fresh read-only Casey/Nova UI reconstruction; it must not create another task."
    });
  }

  function captureParticipantLifecycleBaseline() {
    config();
    if (checkpointId !== "EVENT-LIFE-004") {
      Q.fail("capture-participant-lifecycle-baseline currently supports only EVENT-LIFE-004.");
    }
    const state = requireMatchingState();
    if (state.participantLifecycleBaseline && state.participantLifecycleBaseline.capturedAtIso) {
      Q.fail("EVENT-LIFE-004 already has a saved participant lifecycle baseline.");
    }
    const current = oracle(state);
    const event = (current.events || []).find(item => item.eventId === EVENT_ID);
    const acceptedMembers = (current.members || [])
      .filter(member => member.eventId === EVENT_ID && member.status === "accepted");
    const countersByUserId = new Map((current.userActivityCounters || [])
      .map(item => [Q.text(item.user && item.user.userId), item.current || {}]));
    const hostCounters = countersByUserId.get(hostUserId) || {};
    const participantCounters = countersByUserId.get(participantUserId) || {};
    const hostEvent = hostCounters.event || {};
    const participantEvent = participantCounters.event || {};
    if ((current.events || []).length !== 1
        || !event
        || event.status !== "A"
        || event.isTrashed !== false
        || event.statusBeforeSuppression
        || event.trashedAtIso
        || event.acceptedMembers !== 2
        || event.capacityTotal !== 8
        || !sameIds(event.acceptedMemberUserIds, [hostUserId, participantUserId])
        || acceptedMembers.length !== 2
        || !acceptedMembers.some(member => member.userId === hostUserId && member.role === "Admin")
        || !acceptedMembers.some(member => member.userId === participantUserId && member.role === "Member")
        || Number(hostCounters.hosting || 0) !== 1
        || Number(hostEvent.all || 0) !== 1
        || Number(hostEvent.hosting || 0) !== 1
        || Number(hostEvent.trash || 0) !== 0
        || Number(participantCounters.events || 0) !== 1
        || Number(participantEvent.all || 0) !== 1
        || Number(participantEvent.active || 0) !== 1
        || Number(participantEvent.trash || 0) !== 0
        || (current.eventLifecycleTasks || []).length !== 0
        || (current.eventLifecycleOutbox || []).length !== 0
        || (current.eventLifecycleNotifications || []).length !== 0
        || (current.eventRecomputeTasks || []).length !== 0) {
      Q.fail("EVENT-LIFE-004 is not at the exact clean active Casey/Nova 2 / 8 baseline.");
    }
    const capturedAtIso = Q.nowIso();
    const participantLifecycleBaseline = {
      capturedAtIso,
      events: current.events,
      members: current.members,
      resources: lifecycleResourceSnapshot(),
      checkoutBasketItems: current.checkoutBasketItems,
      payments: current.payments,
      tickets: current.tickets,
      eventChats: current.eventChats,
      eventLifecycleTasks: current.eventLifecycleTasks,
      eventLifecycleOutbox: current.eventLifecycleOutbox,
      eventLifecycleNotifications: current.eventLifecycleNotifications,
      eventRecomputeTasks: current.eventRecomputeTasks
    };
    const lifecycleActionBaselineUserActivitySnapshots = [hostUserId, participantUserId]
      .map(userActivitiesSnapshot);
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: { participantLifecycleBaseline, lifecycleActionBaselineUserActivitySnapshots }
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "participant-lifecycle-baseline-captured",
      capturedAtIso,
      event: {
        eventId: event.eventId,
        status: event.status,
        acceptedMembers: event.acceptedMembers,
        acceptedMemberUserIds: event.acceptedMemberUserIds,
        capacityTotal: event.capacityTotal
      },
      counters: { host: hostCounters, participant: participantCounters },
      cardinality: {
        events: current.events.length,
        members: current.members.length,
        resources: participantLifecycleBaseline.resources.length,
        tickets: current.tickets.length
      },
      next: "Nova leaves the retained active event exactly once; Casey does not interact."
    });
  }

  function participantCounters(current) {
    const byUserId = new Map((current.userActivityCounters || [])
      .map(item => [Q.text(item.user && item.user.userId), item.current || {}]));
    return {
      host: byUserId.get(hostUserId) || {},
      participant: byUserId.get(participantUserId) || {}
    };
  }

  function assertParticipantLifecycleSideCollectionsUnchanged(current, baseline, phase) {
    if (!sameJson(lifecycleResourceSnapshot(), baseline.resources || [])
        || !sameJson(current.checkoutBasketItems || [], baseline.checkoutBasketItems || [])
        || !sameJson(current.payments || [], baseline.payments || [])
        || !sameJson(current.tickets || [], baseline.tickets || [])
        || !sameJson(current.eventLifecycleTasks || [], baseline.eventLifecycleTasks || [])
        || !sameJson(current.eventLifecycleOutbox || [], baseline.eventLifecycleOutbox || [])
        || !sameJson(current.eventLifecycleNotifications || [], baseline.eventLifecycleNotifications || [])
        || !sameJson(current.eventChatNotificationOutbox || [], baseline.eventChatNotificationOutbox || [])
        || !sameJson(current.eventChatNotifications || [], baseline.eventChatNotifications || [])) {
      Q.fail(`${phase} changed a resource, basket, payment, ticket, lifecycle or chat-notification collection.`);
    }
  }

  function participantLifecycleSnapshot(current, capturedAtIso) {
    return {
      capturedAtIso,
      events: current.events || [],
      members: current.members || [],
      resources: lifecycleResourceSnapshot(),
      checkoutBasketItems: current.checkoutBasketItems || [],
      payments: current.payments || [],
      tickets: current.tickets || [],
      eventChats: current.eventChats || [],
      eventChatMessages: current.eventChatMessages || [],
      eventChatNotificationOutbox: current.eventChatNotificationOutbox || [],
      eventChatNotifications: current.eventChatNotifications || [],
      eventLifecycleTasks: current.eventLifecycleTasks || [],
      eventLifecycleOutbox: current.eventLifecycleOutbox || [],
      eventLifecycleNotifications: current.eventLifecycleNotifications || [],
      eventRecomputeTasks: current.eventRecomputeTasks || []
    };
  }

  function captureParticipantLeaveState() {
    config();
    if (checkpointId !== "EVENT-LIFE-004") {
      Q.fail("capture-participant-leave-state currently supports only EVENT-LIFE-004.");
    }
    const state = requireMatchingState();
    if (state.participantObservedLeaveState && state.participantObservedLeaveState.capturedAtIso) {
      Q.fail("EVENT-LIFE-004 already captured the original Leave state.");
    }
    const current = oracle(state);
    const canonical = (current.events || []).find(event => event.ownerUserId === hostUserId);
    const overlay = (current.events || []).find(event => event.ownerUserId === participantUserId);
    const hostMember = (current.members || []).find(member => member.userId === hostUserId);
    const participantMember = (current.members || []).find(member => member.userId === participantUserId);
    if ((current.events || []).length !== 2
        || !canonical || canonical.status !== "A" || canonical.isTrashed
        || canonical.acceptedMembers !== 1
        || !sameIds(canonical.acceptedMemberUserIds, [hostUserId])
        || !overlay || overlay.status !== "T" || overlay.statusBeforeSuppression !== "A"
        || !overlay.trashedAtIso
        || !hostMember || hostMember.status !== "accepted" || hostMember.role !== "Admin"
        || !participantMember || participantMember.status !== "suppressed"
        || participantMember.statusBeforeSuppression !== "accepted"
        || participantMember.suppressionRootOwnerId !== EVENT_ID
        || !participantMember.suppressedAtIso) {
      Q.fail("EVENT-LIFE-004 is not at the exact persisted participant Leave identity state.");
    }
    const capturedAtIso = Q.nowIso();
    const snapshot = participantLifecycleSnapshot(current, capturedAtIso);
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: { participantObservedLeaveState: snapshot }
    });
    const counters = participantCounters(current);
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "participant-original-leave-state-captured",
      capturedAtIso,
      canonical,
      overlay,
      participantMember,
      counters,
      knownDefectEvidence: Number((counters.participant.event || {}).trash || 0) === 0
        ? "Original Leave persisted Nova Trash=0 although the UI action delta showed Trash=1."
        : "Original Leave already persisted Nova Trash=1.",
      next: "After the backend fix is hot-deployed, Nova restores the event once from Trash."
    });
  }

  function assertParticipantActiveState(current, phase) {
    const canonical = (current.events || []).find(event => event.ownerUserId === hostUserId);
    const overlay = (current.events || []).find(event => event.ownerUserId === participantUserId);
    const hostMember = (current.members || []).find(member => member.userId === hostUserId);
    const participantMember = (current.members || []).find(member => member.userId === participantUserId);
    if ((current.events || []).length !== 2
        || !canonical || canonical.status !== "A" || canonical.isTrashed
        || canonical.acceptedMembers !== 2
        || !sameIds(canonical.acceptedMemberUserIds, [hostUserId, participantUserId])
        || !overlay || overlay.status !== "A" || overlay.isTrashed
        || overlay.statusBeforeSuppression || overlay.trashedAtIso
        || !hostMember || hostMember.status !== "accepted" || hostMember.role !== "Admin"
        || !participantMember || participantMember.status !== "accepted" || participantMember.role !== "Member"
        || participantMember.statusBeforeSuppression
        || participantMember.suppressionRootOwnerId
        || participantMember.suppressedAtIso) {
      Q.fail(`${phase} did not return the same canonical/overlay/member identities to the exact active state.`);
    }
    const counters = participantCounters(current);
    const hostEvent = counters.host.event || {};
    const participantEvent = counters.participant.event || {};
    if (Number(counters.host.hosting || 0) !== 1
        || Number(hostEvent.all || 0) !== 1
        || Number(hostEvent.hosting || 0) !== 1
        || Number(hostEvent.trash || 0) !== 0
        || Number(counters.participant.events || 0) !== 1
        || Number(participantEvent.all || 0) !== 1
        || Number(participantEvent.active || 0) !== 1
        || Number(participantEvent.trash || 0) !== 0) {
      Q.fail(`${phase} did not persist the exact Casey Hosting and Nova Active counter state.`);
    }
    return { canonical, overlay, hostMember, participantMember, counters };
  }

  function assertOneParticipantSystemMessage(current, baseline, clientId, textValue, phase) {
    const beforeIds = new Set((baseline.eventChatMessages || []).map(message => Q.text(message.messageId)));
    const delta = (current.eventChatMessages || []).filter(message => !beforeIds.has(Q.text(message.messageId)));
    if (delta.length !== 1
        || delta[0].clientId !== clientId
        || delta[0].sender !== "System"
        || delta[0].text !== textValue
        || delta[0].sentAtIso <= baseline.capturedAtIso) {
      Q.fail(`${phase} must append exactly one '${clientId}' system chat message.`);
    }
    return delta[0];
  }

  function assertParticipantChat(current, baseline, expectedMemberUserIds, phase) {
    const chats = current.eventChats || [];
    const beforeChats = baseline.eventChats || [];
    const expectedOwners = expectedMemberUserIds;
    if (chats.length !== expectedOwners.length
        || !sameIds(chats.map(chat => chat.ownerUserId), expectedOwners)
        || !chats.every(chat => chat.chatId === EVENT_ID
          && chat.eventId === EVENT_ID
          && chat.channelType === "mainEvent"
          && sameIds(chat.memberUserIds, expectedMemberUserIds))) {
      Q.fail(`${phase} did not retain exactly the expected per-user projections of the same main-event chat identity.`);
    }
    const hostChat = chats.find(chat => chat.ownerUserId === hostUserId);
    const beforeHostChat = beforeChats.find(chat => chat.ownerUserId === hostUserId);
    if (!hostChat || !beforeHostChat
        || Number(hostChat.unread || 0) !== Number(beforeHostChat.unread || 0) + 1) {
      Q.fail(`${phase} did not append exactly one unread system message to Casey's retained chat projection.`);
    }
    const participantChat = chats.find(chat => chat.ownerUserId === participantUserId);
    const beforeParticipantChat = beforeChats.find(chat => chat.ownerUserId === participantUserId);
    if (expectedOwners.includes(participantUserId)
        && (!participantChat
          || Number(participantChat.unread || 0) !== Number(beforeParticipantChat && beforeParticipantChat.unread || 0) + 1)) {
      Q.fail(`${phase} did not restore Nova's chat projection with exactly the new system message unread.`);
    }
    return chats;
  }

  function updatedParticipantRecompute(current, baseline, phase) {
    const beforeById = new Map((baseline.eventRecomputeTasks || [])
      .map(task => [Q.text(task.id), task]));
    const delta = (current.eventRecomputeTasks || []).filter(task => {
      const before = beforeById.get(Q.text(task.id));
      return !before || Q.text(task.updatedDate) > Q.text(before.updatedDate);
    });
    if (delta.length !== 1
        || !delta[0].reasons.includes("EVENT_MEMBERS_CHANGED")
        || !["pending", "running", "in_progress", "done"].includes(Q.text(delta[0].status).toLowerCase())
        || delta[0].updatedDate <= baseline.capturedAtIso) {
      Q.fail(`${phase} must produce one coalesced EVENT_MEMBERS_CHANGED recompute delta.`);
    }
    return delta[0];
  }

  function verifyParticipantRestore() {
    config();
    if (checkpointId !== "EVENT-LIFE-004") {
      Q.fail("verify-participant-restore currently supports only EVENT-LIFE-004.");
    }
    const state = requireMatchingState();
    const finalRestore = Boolean(state.participantVerifiedLeaveState);
    const baseline = finalRestore ? state.participantVerifiedLeaveState : state.participantObservedLeaveState;
    if (!baseline || !baseline.capturedAtIso) {
      Q.fail("EVENT-LIFE-004 requires a captured Leave state before Restore verification.");
    }
    const current = oracle(state);
    const active = assertParticipantActiveState(current, finalRestore ? "Final Restore" : "Restore");
    assertParticipantLifecycleSideCollectionsUnchanged(current, baseline, finalRestore ? "Final Restore" : "Restore");
    const message = assertOneParticipantSystemMessage(
      current, baseline, "member-joined", "Nova Social joined the event.", finalRestore ? "Final Restore" : "Restore");
    const chat = assertParticipantChat(current, baseline, [hostUserId, participantUserId], finalRestore ? "Final Restore" : "Restore");
    const recompute = updatedParticipantRecompute(current, baseline, finalRestore ? "Final Restore" : "Restore");
    const verifiedAtIso = Q.nowIso();
    const snapshot = participantLifecycleSnapshot(current, verifiedAtIso);
    const update = finalRestore
      ? { participantFinalRestoreState: snapshot, participantFinalRestoreVerifiedAtIso: verifiedAtIso }
      : { participantReplayBaseline: snapshot, participantFirstRestoreVerifiedAtIso: verifiedAtIso };
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: update });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: finalRestore ? "participant-final-restore-verified" : "participant-first-restore-verified",
      verifiedAtIso,
      active,
      chat,
      message,
      recompute,
      next: finalRestore
        ? "Run the final fresh read-only Casey/Nova UI reconstruction; do not mutate the event again."
        : "Capture boundary is saved. Nova now leaves the same event once more to replay only the corrected write path."
    });
  }

  function verifyParticipantLeave() {
    config();
    if (checkpointId !== "EVENT-LIFE-004") {
      Q.fail("verify-participant-leave currently supports only EVENT-LIFE-004.");
    }
    const state = requireMatchingState();
    const baseline = state.participantReplayBaseline;
    if (!baseline || !baseline.capturedAtIso) {
      Q.fail("EVENT-LIFE-004 requires its saved post-Restore replay baseline before Leave verification.");
    }
    if (state.participantVerifiedLeaveState) {
      Q.fail("EVENT-LIFE-004 corrected Leave was already verified; do not replay it again.");
    }
    const current = oracle(state);
    const canonical = (current.events || []).find(event => event.ownerUserId === hostUserId);
    const overlay = (current.events || []).find(event => event.ownerUserId === participantUserId);
    const hostMember = (current.members || []).find(member => member.userId === hostUserId);
    const participantMember = (current.members || []).find(member => member.userId === participantUserId);
    if ((current.events || []).length !== 2
        || !canonical || canonical.status !== "A" || canonical.isTrashed
        || canonical.acceptedMembers !== 1
        || !sameIds(canonical.acceptedMemberUserIds, [hostUserId])
        || !overlay || overlay.status !== "T" || overlay.statusBeforeSuppression !== "A"
        || !overlay.trashedAtIso || overlay.trashedAtIso <= baseline.capturedAtIso
        || !hostMember || hostMember.status !== "accepted" || hostMember.role !== "Admin"
        || !participantMember || participantMember.status !== "suppressed"
        || participantMember.statusBeforeSuppression !== "accepted"
        || participantMember.suppressionRootOwnerId !== EVENT_ID
        || !participantMember.suppressedAtIso
        || participantMember.suppressedAtIso <= baseline.capturedAtIso) {
      Q.fail("Corrected Leave did not preserve the canonical event while suppressing only Nova's retained identities.");
    }
    const counters = participantCounters(current);
    const hostEvent = counters.host.event || {};
    const participantEvent = counters.participant.event || {};
    if (Number(counters.host.hosting || 0) !== 1
        || Number(hostEvent.all || 0) !== 1
        || Number(hostEvent.hosting || 0) !== 1
        || Number(hostEvent.trash || 0) !== 0
        || Number(counters.participant.events || 0) !== 0
        || Number(participantEvent.all || 0) !== 0
        || Number(participantEvent.active || 0) !== 0
        || Number(participantEvent.trash || 0) !== 1) {
      Q.fail("Corrected Leave must persist Casey Hosting=1 and Nova Active/All=0, personal Trash=1.");
    }
    assertParticipantLifecycleSideCollectionsUnchanged(current, baseline, "Corrected Leave");
    const message = assertOneParticipantSystemMessage(
      current, baseline, "member-left", "Nova Social left the event.", "Corrected Leave");
    const chat = assertParticipantChat(current, baseline, [hostUserId], "Corrected Leave");
    const recompute = updatedParticipantRecompute(current, baseline, "Corrected Leave");
    const verifiedAtIso = Q.nowIso();
    const snapshot = participantLifecycleSnapshot(current, verifiedAtIso);
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: { participantVerifiedLeaveState: snapshot, participantLeaveVerifiedAtIso: verifiedAtIso }
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "participant-corrected-leave-verified",
      verifiedAtIso,
      canonical,
      overlay,
      participantMember,
      counters,
      chat,
      message,
      recompute,
      next: "Reload Nova's page and reconstruct Events > Trash. It must still show exactly this one personal Trash item; then Restore once for the final branch."
    });
  }

  function stableBucketReadValue(value) {
    if (value === undefined) return null;
    if (Array.isArray(value)) return value.map(stableBucketReadValue);
    if (value && typeof value === "object") {
      return Object.fromEntries(Object.entries(value)
        .map(([key, item]) => [key, stableBucketReadValue(item)]));
    }
    return value;
  }

  function bucketReadSnapshot(current, capturedAtIso) {
    return stableBucketReadValue({
      capturedAtIso,
      events: current.events || [],
      members: current.members || [],
      resources: lifecycleResourceSnapshot(),
      checkoutBasketItems: current.checkoutBasketItems || [],
      payments: current.payments || [],
      tickets: current.tickets || [],
      ticketReplayAudits: current.ticketReplayAudits || [],
      ticketReplayOutbox: current.ticketReplayOutbox || [],
      ticketReplayNotifications: current.ticketReplayNotifications || [],
      eventChats: current.eventChats || [],
      eventChatMessages: current.eventChatMessages || [],
      eventChatNotificationOutbox: current.eventChatNotificationOutbox || [],
      eventChatNotifications: current.eventChatNotifications || [],
      invitationAcceptanceOutbox: current.invitationAcceptanceOutbox || [],
      invitationAcceptanceNotifications: current.invitationAcceptanceNotifications || [],
      eventInvitationNotifications: current.eventInvitationNotifications || [],
      eventInvitationOutbox: current.eventInvitationOutbox || [],
      eventJoinRequestNotifications: current.eventJoinRequestNotifications || [],
      eventMemberApprovalOutbox: current.eventMemberApprovalOutbox || [],
      eventMemberApprovalNotifications: current.eventMemberApprovalNotifications || [],
      eventLifecycleTasks: current.eventLifecycleTasks || [],
      eventLifecycleOutbox: current.eventLifecycleOutbox || [],
      eventLifecycleNotifications: current.eventLifecycleNotifications || [],
      eventRecomputeTasks: current.eventRecomputeTasks || [],
      feedbackNotificationOutbox: current.feedbackNotificationOutbox || [],
      feedbackNotifications: current.feedbackNotifications || [],
      feedbackRecomputeTasks: current.feedbackRecomputeTasks || [],
      feedbackStates: current.feedbackStates || [],
      feedbackAnswers: current.feedbackAnswers || [],
      stageRuntime: current.stageRuntime || [],
      manualTournamentGroups: current.manualTournamentGroups || [],
      generatedTournamentGroups: current.generatedTournamentGroups || [],
      leaderboard: current.leaderboard || [],
      userActivityCounters: (current.userActivityCounters || []).map(item => ({
        userId: Q.text(item.user && item.user.userId),
        current: item.current || {}
      }))
    });
  }

  function assertBucketReadActiveBoundary(current) {
    const canonical = (current.events || []).find(event => event.ownerUserId === hostUserId);
    const overlay = (current.events || []).find(event => event.ownerUserId === participantUserId);
    const counters = participantCounters(current);
    const hostEvent = counters.host.event || {};
    const participantEvent = counters.participant.event || {};
    if ((current.events || []).length !== 2
        || !canonical || canonical.status !== "A" || canonical.isTrashed
        || canonical.acceptedMembers !== 2
        || !sameIds(canonical.acceptedMemberUserIds, [hostUserId, participantUserId])
        || !overlay || overlay.status !== "A" || overlay.isTrashed
        || overlay.statusBeforeSuppression || overlay.trashedAtIso
        || (current.members || []).length !== 2
        || !(current.members || []).every(member => member.status === "accepted")
        || Number(counters.host.hosting || 0) !== 1
        || Number(hostEvent.all || 0) !== 1
        || Number(hostEvent.hosting || 0) !== 1
        || Number(hostEvent.drafts || 0) !== 0
        || Number(hostEvent.trash || 0) !== 0
        || Number(counters.participant.events || 0) !== 1
        || Number(participantEvent.all || 0) !== 1
        || Number(participantEvent.active || 0) !== 1
        || Number(participantEvent.invitations || 0) !== 0
        || Number(participantEvent.trash || 0) !== 0) {
      Q.fail("EVENT-LIFE-005 requires the exact active Casey Hosting / Nova Attending boundary before and after read-only navigation.");
    }
    return { canonical, overlay, counters };
  }

  function captureBucketReadBaseline() {
    config();
    if (checkpointId !== "EVENT-LIFE-005") {
      Q.fail("capture-bucket-read-baseline currently supports only EVENT-LIFE-005.");
    }
    const state = requireMatchingState();
    if (state.bucketReadBaseline && state.bucketReadBaseline.capturedAtIso) {
      Q.fail("EVENT-LIFE-005 already has a saved read-only baseline.");
    }
    const current = oracle(state);
    const active = assertBucketReadActiveBoundary(current);
    if ((current.eventRecomputeTasks || []).length !== 0) {
      Q.fail("EVENT-LIFE-005 cannot capture its baseline with a post-advance event recompute delta.");
    }
    const capturedAtIso = Q.nowIso();
    const bucketReadBaseline = bucketReadSnapshot(current, capturedAtIso);
    const lifecycleActionBaselineUserActivitySnapshots = [hostUserId, participantUserId]
      .map(userActivitiesSnapshot);
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: { bucketReadBaseline, lifecycleActionBaselineUserActivitySnapshots }
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "bucket-read-baseline-captured",
      capturedAtIso,
      active,
      trackedCollections: Object.keys(bucketReadBaseline).filter(key => key !== "capturedAtIso"),
      next: "Execute only the documented Casey organizer bucket reads, then the Nova participant bucket reads; no action menu or mutation is allowed."
    });
  }

  function verifyBucketReadonly() {
    config();
    if (checkpointId !== "EVENT-LIFE-005") {
      Q.fail("verify-bucket-readonly currently supports only EVENT-LIFE-005.");
    }
    const state = requireMatchingState();
    const baseline = state.bucketReadBaseline;
    if (!baseline || !baseline.capturedAtIso) {
      Q.fail("EVENT-LIFE-005 requires its saved read-only baseline before verification.");
    }
    const current = oracle(state);
    const active = assertBucketReadActiveBoundary(current);
    const currentSnapshot = bucketReadSnapshot(current, baseline.capturedAtIso);
    if (!sameJson(currentSnapshot, baseline)) {
      const changedKeys = Object.keys(currentSnapshot)
        .filter(key => !sameJson(currentSnapshot[key], baseline[key]));
      Q.fail(`EVENT-LIFE-005 navigation changed persisted state in: ${changedKeys.join(", ")}.`);
    }
    const verifiedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: { bucketReadVerifiedAtIso: verifiedAtIso }
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "bucket-navigation-readonly-verified",
      baselineCapturedAtIso: baseline.capturedAtIso,
      verifiedAtIso,
      active,
      changedPersistedCollections: [],
      schedulerNote: "Global worker-rule heartbeat timestamps are intentionally excluded; no event-scoped task/outbox/history record changed.",
      next: "Record the final Casey/Nova bucket DOM evidence and close EVENT-LIFE-005 without replay."
    });
  }

  function diagnoseBucketReadChanges() {
    config();
    if (checkpointId !== "EVENT-LIFE-005") {
      Q.fail("diagnose-bucket-read-changes currently supports only EVENT-LIFE-005.");
    }
    const state = requireMatchingState();
    const baseline = state.bucketReadBaseline;
    if (!baseline || !baseline.capturedAtIso) {
      Q.fail("EVENT-LIFE-005 requires its saved read-only baseline before diagnosis.");
    }
    const current = oracle(state);
    const currentSnapshot = bucketReadSnapshot(current, baseline.capturedAtIso);
    const changedKeys = Object.keys(currentSnapshot)
      .filter(key => !sameJson(currentSnapshot[key], baseline[key]));
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "bucket-navigation-readonly-diagnosis",
      baselineCapturedAtIso: baseline.capturedAtIso,
      diagnosedAtIso: Q.nowIso(),
      changedKeys,
      differences: changedKeys.flatMap(key => jsonDifferences(
        baseline[key], currentSnapshot[key]).map(difference => ({
          ...difference,
          path: difference.path ? `${key}.${difference.path}` : key
        }))),
      mutation: "none; this command only compares the saved baseline with a fresh oracle snapshot"
    });
  }

  function invitationActionSnapshot(state, capturedAtIso) {
    const current = oracle(state);
    return stableBucketReadValue({
      capturedAtIso,
      events: current.events || [],
      members: current.members || [],
      resources: lifecycleResourceSnapshot(),
      checkoutBasketItems: current.checkoutBasketItems || [],
      payments: current.payments || [],
      tickets: current.tickets || [],
      eventChats: current.eventChats || [],
      eventChatMessages: current.eventChatMessages || [],
      eventChatNotificationOutbox: current.eventChatNotificationOutbox || [],
      eventChatNotifications: current.eventChatNotifications || [],
      eventInvitationOutbox: current.eventInvitationOutbox || [],
      eventInvitationNotifications: current.eventInvitationNotifications || [],
      eventJoinRequestNotifications: current.eventJoinRequestNotifications || [],
      eventMemberApprovalOutbox: current.eventMemberApprovalOutbox || [],
      eventMemberApprovalNotifications: current.eventMemberApprovalNotifications || [],
      eventLifecycleTasks: current.eventLifecycleTasks || [],
      eventLifecycleOutbox: current.eventLifecycleOutbox || [],
      eventLifecycleNotifications: current.eventLifecycleNotifications || [],
      eventRecomputeTasks: current.eventRecomputeTasks || [],
      userActivityCounters: (current.userActivityCounters || []).map(item => ({
        userId: Q.text(item.user && item.user.userId),
        current: item.current || {}
      }))
    });
  }

  function assertInvitationEmptyBoundary(snapshot) {
    const event = (snapshot.events || [])[0];
    const member = (snapshot.members || [])[0];
    const counters = new Map((snapshot.userActivityCounters || [])
      .map(item => [Q.text(item.userId), item.current || {}]));
    const hostCounters = counters.get(hostUserId) || {};
    const participantCounters = counters.get(participantUserId) || {};
    const hostEvent = hostCounters.event || {};
    const participantEvent = participantCounters.event || {};
    if ((snapshot.events || []).length !== 1
        || !event || event.ownerUserId !== hostUserId || event.status !== "A"
        || event.acceptedMembers !== 1 || event.pendingMembers !== 0
        || !sameIds(event.acceptedMemberUserIds, [hostUserId])
        || (event.pendingMemberUserIds || []).length !== 0
        || (event.invitedMemberUserIds || []).length !== 0
        || (snapshot.members || []).length !== 1
        || !member || member.userId !== hostUserId || member.role !== "Admin"
        || member.status !== "accepted"
        || Number(hostCounters.hosting || 0) !== 1
        || Number(hostEvent.all || 0) !== 1
        || Number(hostEvent.hosting || 0) !== 1
        || Number(hostEvent.drafts || 0) !== 0
        || Number(hostEvent.trash || 0) !== 0
        || Number(participantCounters.invitations || 0) !== 0
        || Number(participantCounters.events || 0) !== 0
        || Number(participantEvent.all || 0) !== 0
        || Number(participantEvent.invitations || 0) !== 0
        || (snapshot.eventInvitationOutbox || []).length !== 0
        || (snapshot.eventInvitationNotifications || []).length !== 0
        || (snapshot.eventRecomputeTasks || []).length !== 0) {
      Q.fail("EVENT-INV-001 requires the exact host-only 1/8 baseline with Casey counters1 and Nova invitation counters0.");
    }
    return { event, member, hostCounters, participantCounters };
  }

  function captureInvitationActionBaseline() {
    config();
    if (checkpointId !== "EVENT-INV-001") {
      Q.fail("capture-invitation-action-baseline currently supports only EVENT-INV-001.");
    }
    const state = requireMatchingState();
    if (state.invitationActionBaseline && state.invitationActionBaseline.capturedAtIso) {
      Q.fail("EVENT-INV-001 already has a saved invitation action baseline.");
    }
    const capturedAtIso = Q.nowIso();
    const invitationActionBaseline = invitationActionSnapshot(state, capturedAtIso);
    const active = assertInvitationEmptyBoundary(invitationActionBaseline);
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: { invitationActionBaseline }
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "invitation-action-baseline-captured",
      capturedAtIso,
      active,
      next: "Observe Casey's one-member Event Members baseline, then invite Nova and Save exactly once."
    });
  }

  function verifyInvitationCreated() {
    config();
    if (checkpointId !== "EVENT-INV-001") {
      Q.fail("verify-invitation-created currently supports only EVENT-INV-001.");
    }
    const state = requireMatchingState();
    const baseline = state.invitationActionBaseline;
    if (!baseline || !baseline.capturedAtIso) {
      Q.fail("EVENT-INV-001 requires its saved invitation action baseline before verification.");
    }
    if (state.invitationCreatedVerifiedAtIso) {
      Q.fail("EVENT-INV-001 invitation creation is already verified.");
    }
    assertInvitationEmptyBoundary(baseline);
    const current = invitationActionSnapshot(state, baseline.capturedAtIso);
    const event = (current.events || [])[0];
    const hostMember = (current.members || []).find(member => member.userId === hostUserId);
    const participantMember = (current.members || []).find(member => member.userId === participantUserId);
    if ((current.events || []).length !== 1
        || !event || event.ownerUserId !== hostUserId || event.status !== "A"
        || event.acceptedMembers !== 1 || event.pendingMembers !== 1
        || !sameIds(event.acceptedMemberUserIds, [hostUserId])
        || !sameIds(event.pendingMemberUserIds, [participantUserId])
        || !sameIds(event.invitedMemberUserIds, [participantUserId])
        || (event.pendingRequestMemberUserIds || []).length !== 0
        || (current.members || []).length !== 2
        || !hostMember || hostMember.role !== "Admin" || hostMember.status !== "accepted"
        || !participantMember || participantMember.role !== "Member"
        || participantMember.status !== "pending"
        || participantMember.requestKind !== "invite"
        || participantMember.pendingSource !== "admin"
        || participantMember.invitedByUserId !== hostUserId) {
      Q.fail("EVENT-INV-001 did not persist exactly one Casey-authored pending invitation for Nova.");
    }
    const baselineCounters = new Map((baseline.userActivityCounters || [])
      .map(item => [Q.text(item.userId), item.current || {}]));
    const currentCounters = new Map((current.userActivityCounters || [])
      .map(item => [Q.text(item.userId), item.current || {}]));
    const hostCounters = currentCounters.get(hostUserId) || {};
    const participantCounters = currentCounters.get(participantUserId) || {};
    const participantEvent = participantCounters.event || {};
    if (!sameJson(hostCounters, baselineCounters.get(hostUserId) || {})
        || Number(participantCounters.invitations || 0) !== 1
        || Number(participantCounters.events || 0) !== 0
        || Number(participantCounters.hosting || 0) !== 0
        || Number(participantEvent.all || 0) !== 1
        || Number(participantEvent.active || 0) !== 0
        || Number(participantEvent.pending || 0) !== 0
        || Number(participantEvent.invitations || 0) !== 1
        || Number(participantEvent.hosting || 0) !== 0
        || Number(participantEvent.drafts || 0) !== 0
        || Number(participantEvent.trash || 0) !== 0) {
      Q.fail("EVENT-INV-001 invitation did not persist the exact host-stable and Nova Invitations1 counter projection.");
    }
    const outbox = current.eventInvitationOutbox || [];
    const notifications = current.eventInvitationNotifications || [];
    if (outbox.length !== 1
        || outbox[0].notificationType !== "event-invite"
        || outbox[0].eventId !== EVENT_ID
        || outbox[0].senderUserId !== hostUserId
        || !sameIds(outbox[0].recipientUserIds, [participantUserId])
        || notifications.length !== 1
        || notifications[0].kind !== "event-invite"
        || notifications[0].eventId !== EVENT_ID
        || notifications[0].recipientUserId !== participantUserId
        || notifications[0].senderUserId !== hostUserId
        || notifications[0].read) {
      Q.fail("EVENT-INV-001 requires one Casey-to-Nova event-invite outbox item and one unread inbox notification.");
    }
    for (const key of [
      "resources", "checkoutBasketItems", "payments", "tickets", "eventChats",
      "eventChatMessages", "eventChatNotificationOutbox", "eventChatNotifications",
      "eventJoinRequestNotifications", "eventMemberApprovalOutbox",
      "eventMemberApprovalNotifications", "eventLifecycleTasks",
      "eventLifecycleOutbox", "eventLifecycleNotifications", "eventRecomputeTasks"
    ]) {
      if (!sameJson(current[key], baseline[key])) {
        Q.fail(`EVENT-INV-001 invitation changed unrelated persisted state in '${key}'.`);
      }
    }
    const verifiedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: { invitationCreatedVerifiedAtIso: verifiedAtIso }
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "invitation-created-verified",
      baselineCapturedAtIso: baseline.capturedAtIso,
      verifiedAtIso,
      event,
      members: current.members,
      counters: { host: hostCounters, participant: participantCounters },
      outbox,
      notifications,
      unchangedUnrelatedCollections: true,
      next: "Confirm Casey sees Nova once as pending and Nova sees the same event once in Invitations with an unread new notification."
    });
  }

  function diagnoseInvitationChatCounter() {
    config();
    if (checkpointId !== "EVENT-INV-001") {
      Q.fail("diagnose-invitation-chat-counter currently supports only EVENT-INV-001.");
    }
    const state = requireMatchingState();
    const saved = savedUserActivity(state, participantUserId);
    if (!saved || !saved.activities || !saved.activities.present) {
      Q.fail("EVENT-INV-001 has no saved Nova activity-counter baseline.");
    }
    const baselineActivities = saved.activities.value || {};
    const current = userActivitiesSnapshot(participantUserId);
    const currentActivities = current.activities.value || {};
    const eventIds = currentEventIds();
    const eventChats = Q.collection("chats").find({
      $or: [
        { eventId: { $in: eventIds } },
        { ownerId: { $in: eventIds } },
        { chatId: { $in: eventIds } }
      ]
    }).toArray();
    const summary = activities => ({
      chats: nestedNumber(activities, "chats"),
      chat: activities.chat || {},
      invitations: nestedNumber(activities, "invitations"),
      event: activities.event || {}
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "invitation-chat-counter-diagnosis",
      diagnosedAtIso: Q.nowIso(),
      participant: Q.user(participantUserId),
      baseline: summary(baselineActivities),
      current: summary(currentActivities),
      delta: {
        chats: nestedNumber(currentActivities, "chats") - nestedNumber(baselineActivities, "chats"),
        chatAll: nestedNumber(currentActivities, "chat.all") - nestedNumber(baselineActivities, "chat.all"),
        chatEvent: nestedNumber(currentActivities, "chat.event") - nestedNumber(baselineActivities, "chat.event")
      },
      eventChatDocuments: eventChats.map(chat => ({
        id: Q.text(chat._id),
        chatId: Q.text(chat.id || chat.chatId),
        ownerUserId: Q.text(chat.ownerUserId),
        eventId: Q.text(chat.eventId),
        ownerId: Q.text(chat.ownerId),
        channelType: Q.text(chat.channelType)
      })),
      mutation: "none; this command only compares persisted counters and event-chat documents"
    });
  }

  function resetState(state) {
    clearDynamicEventEffects(currentEventIds());
    Q.restoreSnapshots(state.snapshots);
    for (const saved of state.autoInviterRecipientActivitySnapshots || []) {
      restoreUserActivities(saved);
    }
    for (const saved of state.userActivitySnapshots || []) {
      restoreUserActivities(saved);
    }
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
  }

  function restage() {
    const selected = config();
    if (!selected.stage.startsWith("feedback-")) {
      Q.fail("restage is currently restricted to feedback checkpoints.");
    }
    const state = requireMatchingState();
    backfillLegacyFeedbackHostSnapshot(state);
    reconcileLegacyFeedbackSnapshots(state);
    resetState(state);
    stage();
  }

  function switchCheckpoint() {
    const selected = config();
    if (!selected.stage.startsWith("feedback-")) {
      Q.fail("switch is currently restricted to feedback checkpoints.");
    }
    const state = Q.activeState(SCENARIO, true);
    const currentCheckpointId = Q.text(state.checkpointId).toUpperCase();
    if (!sourceCheckpointId || currentCheckpointId !== sourceCheckpointId) {
      Q.fail(`staged checkpoint is '${currentCheckpointId}', not source '${sourceCheckpointId}'.`);
    }
    backfillLegacyFeedbackHostSnapshot(state);
    reconcileLegacyFeedbackSnapshots(state);
    resetState(state);
    stage();
  }

  function discardStale() {
    config();
    const state = requireMatchingState();
    if (Q.collection("events").findOne(manualEventSelector())) {
      Q.fail("the staged event still exists; use the normal reset command instead.");
    }
    const retainedDocuments = (state.snapshots || [])
      .reduce((count, snapshot) => count + (snapshot.documents || []).length, 0);
    if (retainedDocuments !== 0) {
      Q.fail("the stale checkpoint contains original fixture documents and cannot be discarded safely.");
    }
    clearDynamicEventEffects(currentEventIds());
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "stale-checkpoint-discarded",
      discardedAtIso: Q.nowIso(),
      retainedUserActivities: true,
      next: `Run stage event-domain ${checkpointId}.`
    });
  }

  Q.assertDeploymentSafety();
  switch (command) {
    case "stage": checkpointId === TOURNAMENT_ROOM_LIFE_CHECKPOINT
      ? stageTournamentRoomLife()
      : checkpointId === TOURNAMENT_CARD_CHECKPOINT
        ? stageTournamentCard()
        : stage(); break;
    case "restage": restage(); break;
    case "switch": switchCheckpoint(); break;
    case "advance": advance(); break;
    case "prepare-invitation-acceptance-retest": prepareInvitationAcceptanceRetest(); break;
    case "prepare-invitation-admin-approval-retest": prepareInvitationAdminApprovalRetest(); break;
    case "hold-auto-inviter": holdAutoInviter(); break;
    case "prepare-auto-inviter": prepareAutoInviter(); break;
    case "capture-auto-inviter-baseline": captureAutoInviterBaseline(); break;
    case "prepare-periodic-auto-inviter": preparePeriodicAutoInviter(); break;
    case "schedule-auto-inviter": scheduleAutoInviter(); break;
    case "arm-ticket-expiry": armTicketExpiry(); break;
    case "arm-tournament-review": armTournamentReview(); break;
    case "verify-tournament-review-noop": verifyTournamentReviewNoop(); break;
    case "prepare-tournament-finalize-notification-retest": prepareTournamentFinalizeNotificationRetest(); break;
    case "verify-tournament-finalize-notification": verifyTournamentFinalizeNotification(); break;
    case "prepare-tournament-notification-sequence-retest": prepareTournamentNotificationSequenceRetest(); break;
    case "verify-tournament-finalize-sequence": verifyTournamentFinalizeSequence(); break;
    case "verify-tournament-advancement-sequence": verifyTournamentAdvancementSequence(); break;
    case "verify-tournament-advancement-sequence-noop": verifyTournamentAdvancementSequenceNoop(); break;
    case "prepare-tournament-final-carry-forward": prepareTournamentFinalCarryForward(); break;
    case "repair-tournament-final-start-window": repairTournamentFinalStartWindow(); break;
    case "prepare-tournament-final-start-recipient-retest": prepareTournamentFinalStartRecipientRetest(); break;
    case "recover-tournament-final-start-recipient-retest-after-seed-reset": recoverTournamentFinalStartRecipientRetestAfterSeedReset(); break;
    case "verify-tournament-final-start": verifyTournamentFinalStart(); break;
    case "prepare-tournament-final-completion-boundary": prepareTournamentFinalCompletionBoundary(); break;
    case "prepare-tournament-final-completion-retest": prepareTournamentFinalCompletionRetest(); break;
    case "verify-tournament-final-completion": verifyTournamentFinalCompletion(); break;
    case "repair-ticket-payment-fixture": repairTicketPaymentFixture(); break;
    case "repair-tournament-room-presentation": repairTournamentRoomPresentation(); break;
    case "repair-tournament-room-notifications": repairTournamentRoomNotifications(); break;
    case "prepare-ticket-invite-candidate": prepareTicketInviteCandidate(); break;
    case "prepare-ticket-invitee-response-retest": prepareTicketInviteeResponseRetest(); break;
    case "prepare-ticket-admin-approval-retest": prepareTicketAdminApprovalRetest(); break;
    case "prepare-visibility-save-retest": prepareVisibilitySaveRetest(); break;
    case "prepare-visibility-publish-window": prepareVisibilityPublishWindow(); break;
    case "add-feedback-participant": addFeedbackParticipant(); break;
    case "next": next(); break;
    case "verify-ticket-poll-resume": verifyTicketPollResume(); break;
    case "verify-ticket-isolation-unpublish": verifyTicketIsolation("unpublished"); break;
    case "verify-ticket-isolation-republish": verifyTicketIsolation("republished"); break;
    case "verify-ticket-attendance-first-scan": verifyTicketAttendanceFirstScan(); break;
    case "verify-ticket-attendance-replay": verifyTicketAttendanceReplay(); break;
    case "status": checkpointId === TOURNAMENT_ROOM_LIFE_CHECKPOINT
      ? statusTournamentRoomLife()
      : checkpointId === TOURNAMENT_CARD_CHECKPOINT
        ? statusTournamentCard()
        : status(); break;
    case "reset": checkpointId === TOURNAMENT_ROOM_LIFE_CHECKPOINT
      ? resetTournamentRoomLife()
      : checkpointId === TOURNAMENT_CARD_CHECKPOINT
        ? resetTournamentCard()
        : reset(); break;
    case "verify-tournament-room-life-baseline": verifyTournamentRoomLifeBaseline(); break;
    case "verify-tournament-member-removal": verifyTournamentMemberRemoval(); break;
    case "verify-tournament-card-transition": verifyTournamentCardTransition(); break;
    case "repair-lifecycle-counter-baseline": repairLifecycleCounterBaseline(); break;
    case "repair-lifecycle-occupancy-baseline": repairLifecycleOccupancyBaseline(); break;
    case "capture-lifecycle-action-baseline": captureLifecycleActionBaseline(); break;
    case "verify-lifecycle-trash": verifyLifecycleTrash(); break;
    case "capture-lifecycle-restore-baseline": captureLifecycleRestoreBaseline(); break;
    case "verify-lifecycle-restore": verifyLifecycleRestore(); break;
    case "capture-participant-lifecycle-baseline": captureParticipantLifecycleBaseline(); break;
    case "capture-participant-leave-state": captureParticipantLeaveState(); break;
    case "verify-participant-restore": verifyParticipantRestore(); break;
    case "verify-participant-leave": verifyParticipantLeave(); break;
    case "capture-bucket-read-baseline": captureBucketReadBaseline(); break;
    case "verify-bucket-readonly": verifyBucketReadonly(); break;
    case "diagnose-bucket-read-changes": diagnoseBucketReadChanges(); break;
    case "capture-invitation-action-baseline": captureInvitationActionBaseline(); break;
    case "verify-invitation-created": verifyInvitationCreated(); break;
    case "diagnose-invitation-chat-counter": diagnoseInvitationChatCounter(); break;
    case "discard-stale": checkpointId === TOURNAMENT_CARD_CHECKPOINT
      ? discardStaleTournamentCard()
      : discardStale(); break;
    default: Q.fail(`unsupported command '${command}'.`);
  }
})();
