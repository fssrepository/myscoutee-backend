/* global ManualQa, db, process */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "event-domain";
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const checkpointId = Q.text(process.env.MANUAL_QA_CHECKPOINT_ID).toUpperCase();
  const hostUserId = Q.text(process.env.MANUAL_QA_CREATOR_USER_ID)
    || "650000000000000000000061";
  const participantUserId = Q.text(process.env.MANUAL_QA_INVITEE_USER_ID)
    || "650000000000000000000062";
  const thirdUserId = "650000000000000000000063";
  const PREFIX = "manual-qa-checkpoint:v1:event-domain";
  const EVENT_ID = `${PREFIX}:event`;
  const LOCKED_EVENT_ID = `${PREFIX}:feedback-locked`;
  const TRASHED_EVENT_ID = `${PREFIX}:feedback-trashed`;
  const PENDING_EVENT_ID = `${PREFIX}:feedback-pending`;
  const EVENT_IDS = [EVENT_ID, LOCKED_EVENT_ID, TRASHED_EVENT_ID, PENDING_EVENT_ID];
  const TICKET_CODE = "TKT-12345678-1234-4123-8123-123456789abc";
  const EXPECTED_TITLE = `Manual QA ${checkpointId}`;

  const CHECKPOINTS = {
    "EVENT-EDITOR-001": {
      stage: "editor-empty",
      why: "Prove that Event Editor creation persists one canonical draft rather than only updating local form state.",
      action: `As host, create one casual draft titled exactly '${EXPECTED_TITLE}', Save once, close it and reopen it from Drafts/Hosting.`,
      expected: "Exactly one canonical draft exists and every entered field reopens unchanged; it is absent from unrelated-user Explore.",
      worker: "MUST RUN on Save: one event recompute. Close, reopen and refresh MUST NOT RUN another task."
    },
    "EVENT-EDITOR-002": {
      stage: "draft",
      why: "Prove that publish is a separate canonical lifecycle checkpoint with visibility enforcement.",
      action: "As host, publish the staged draft once; compare host Hosting and unrelated-user Explore.",
      expected: "The same event becomes active once, survives reopen and is visible only to users allowed by its visibility setting.",
      worker: "MUST RUN: one event recompute; reminder and attachment consumers are conditional."
    },
    "EVENT-EDITOR-003": {
      stage: "active-no-auto",
      why: "Prove that editor persistence supplies the real auto-inviter rather than a fixture creating the invitation.",
      action: "As host, enable Auto inviter and Save once. Then continue with the dedicated STAT-012 scheduler staging/arming workflow before waiting for the real scheduler.",
      expected: "The saved event retains the eligibility inputs and the later real scheduler creates the one pending invitation.",
      worker: "Editor Save MUST RUN event recompute. Invitation creation MUST RUN through the named real event-auto-inviter scheduler helper."
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
      why: "Prove that accepting an owner/admin invitation creates one terminal accepted membership.",
      action: "As invited participant, accept once; then reopen Event Members and the accepted-only event chat.",
      expected: "Pending becomes accepted once, invitation fields clear, no duplicate row remains and chat appears only after the accepted state.",
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
    "CHAT-AUTH-001": {
      stage: "invitation-pending",
      why: "Assemble the invitation-to-chat authorization boundary across pending, accepted and left states.",
      action: "Prove direct chat denial while pending, accept the invitation, send one unique message, then leave and repeat the denial check.",
      expected: "Only terminal accepted membership grants history read and one message write; pending and left states are server-denied.",
      worker: "Chat write has normal realtime/counter consumers; authorization reads MUST NOT RUN a scheduler."
    },
    "TOURNAMENT-001": {
      stage: "tournament",
      why: "Verify the persisted tournament definition and zero/initial runtime projection before grouping.",
      action: "As host, open the staged tournament in Event Editor, stage list and tournament group popup without starting it.",
      expected: "Parent, two stages, capacities, sequence, status and initial group counts agree on every surface.",
      worker: "MUST NOT RUN: this is a read-only definition checkpoint."
    },
    "TOURNAMENT-002": {
      stage: "tournament",
      why: "Prove the real grouping path materializes exact group membership and group-scoped chat.",
      action: "Start the first tournament stage through the visible action, then let its documented grouping path finish.",
      expected: "Each accepted participant occurs once in the correct group; group member UI and group chat match the same group identity.",
      worker: "MUST RUN only through the named grouping path; pending invitations must not be promoted implicitly."
    },
    "TOURNAMENT-003": {
      stage: "tournament",
      why: "Prove exact-once tournament review and advancement from one finalized stage.",
      action: "Finalize the first stage with deterministic results, arm the named tournament-review schedule and observe the next stage.",
      expected: "Winners advance once, stale losers are absent, stage status and notifications agree, and an unchanged second review is a no-op.",
      worker: "MUST RUN: event-tournament-review real scheduler; unchanged second review MUST NOT create another domain delta."
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
      expected: "Only the eligible event appears: accepted, non-admin, non-trashed and more than two hours after start. Locked, trashed and pending controls stay absent.",
      worker: "MUST NOT RUN: loading feedback eligibility is read-only."
    },
    "EVENT-FEEDBACK-002": {
      stage: "feedback-empty",
      why: "Follow one persisted event-feedback mutation into organizer, notification, recompute and profile projections.",
      action: "As the participant, submit the staged event feedback once with one distinctive personality trait.",
      expected: "One state and one answer per card persist; the organizer received view and first-submission bell agree with the target IDs.",
      worker: "MUST RUN: target-user recompute and first-submission notification outbox."
    },
    "EVENT-FEEDBACK-003": {
      stage: "feedback-submitted",
      why: "Prove that editing feedback updates existing evidence without duplicating first-submit effects.",
      action: "As the participant, reopen the staged submitted feedback, change one answer and Save once.",
      expected: "Existing answer/state rows update; there is no duplicate state or first-submission bell/outbox item.",
      worker: "CONDITIONAL: changed targets may recompute; duplicate first-submission delivery MUST NOT RUN."
    },
    "EVENT-FEEDBACK-004": {
      stage: "feedback-submitted",
      why: "Verify feedback list removal/restoration separately from answer evidence used by Impressions.",
      action: "As the participant, remove the staged feedback item, capture it, then restore it once.",
      expected: "Only the feedback state/bucket changes; answer rows and target Impression evidence remain present.",
      worker: "MUST NOT RUN: no affinity recompute and no notification outbox for remove/restore."
    },
    "EVENT-FEEDBACK-005": {
      stage: "feedback-submitted",
      why: "Prove that an organizer note is local metadata rather than new participant feedback.",
      action: "As the host, open received feedback for the staged event, save one unique organizer note and reopen it.",
      expected: "The exact note persists while participant answers, traits, event buckets, tasks and notifications stay unchanged.",
      worker: "MUST NOT RUN: only the documented feedback counter refresh is allowed."
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
      stage: "ticketing-on",
      why: "Verify exact-one credential issue and reuse for an eligible accepted participant.",
      action: "As the accepted participant, open the staged event ticket twice.",
      expected: "Both opens show the same event/holder/code and the database contains exactly one credential.",
      worker: "MUST NOT RUN: credential issue is a direct request path, not a scheduler."
    },
    "EVENT-TICKET-003": {
      stage: "ticket-ready",
      why: "Verify authorized ticket check-in is exact-once and negative scans are no-ops.",
      action: `As host, scan ${TICKET_CODE} once, scan it again, then try one invalid code from an unauthorized session.`,
      expected: "The first scan succeeds and sets one used timestamp; repeat is already-used and negative scans do not mutate it.",
      worker: "MUST NOT RUN: check-in is a direct request path."
    },
    "EVENT-TICKET-004": {
      stage: "ticket-ready",
      why: "Verify that one event lifecycle mutation invalidates ticket use without deleting holder membership.",
      action: "Choose one named lineage for this run: disable ticketing, unpublish, trash, or move past end; then open/scan the same ticket.",
      expected: "The ticket is unavailable, revoked or expired as appropriate; the accepted holder identity remains correct.",
      worker: "Only the owning event mutation MUST RUN recompute. The rejected ticket read/scan MUST NOT RUN another job."
    }
  };

  function config() {
    const value = CHECKPOINTS[checkpointId];
    if (!value) {
      Q.fail(`unsupported event-domain checkpoint '${checkpointId}'.`);
    }
    return value;
  }

  function dateIso(offsetMinutes) {
    return new Date(Date.now() + offsetMinutes * 60000).toISOString();
  }

  function eventDocument(id, title, options = {}) {
    const now = Q.nowIso();
    const status = options.status || "A";
    const accepted = Array.isArray(options.acceptedUserIds)
      ? [...options.acceptedUserIds]
      : options.accepted === false ? [] : [participantUserId];
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
      autoInviter: false,
      ticketing: options.ticketing === true,
      approvalRequired: false,
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
        tournamentGroupCount: 2,
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
        tournamentGroupCount: 1,
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

  function insertReadyTicket(stagedAtIso) {
    Q.collection("eventTickets").insertOne({
      _id: `${PREFIX}:ticket`,
      code: TICKET_CODE,
      eventId: EVENT_ID,
      holderUserId: participantUserId,
      status: "active",
      issuedAtIso: stagedAtIso,
      usedAtIso: null,
      usedByUserId: null
    });
  }

  function selectors() {
    return [
      { collection: "events", selector: { $or: [
        { _id: { $in: EVENT_IDS } },
        { sourceId: { $in: EVENT_IDS } },
        { title: EXPECTED_TITLE }
      ] } },
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
      { collection: "eventTickets", selector: { $or: [{ eventId: { $in: EVENT_IDS } }, { code: TICKET_CODE }] } },
      { collection: "notificationOutbox", selector: { $or: [{ entityId: { $in: EVENT_IDS } }, { "payload.eventId": { $in: EVENT_IDS } }] } },
      { collection: "userNotifications", selector: { $or: [{ sourceId: { $in: EVENT_IDS } }, { "payload.eventId": { $in: EVENT_IDS } }] } },
      { collection: "affinityRecomputeTasks", selector: { targetId: { $in: EVENT_IDS } } },
      { collection: "schedulerPlanMarkers", selector: { ownerId: { $in: EVENT_IDS } } }
    ];
  }

  function currentEventIds() {
    const values = Q.collection("events").find({
      $or: [
        { _id: { $in: EVENT_IDS } },
        { sourceId: { $in: EVENT_IDS } },
        { title: EXPECTED_TITLE }
      ]
    }).toArray();
    const ids = [...EVENT_IDS];
    for (const value of values) {
      const sourceId = Q.text(value.sourceId);
      const id = Q.text(value._id);
      if (sourceId) ids.push(sourceId);
      if (id) ids.push(id);
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
    Q.collection("eventTickets").deleteMany({ eventId: { $in: eventIds } });
    Q.collection("notificationOutbox").deleteMany({
      $or: [{ entityId: { $in: eventIds } }, { "payload.eventId": { $in: eventIds } }]
    });
    Q.collection("userNotifications").deleteMany({
      $or: [{ sourceId: { $in: eventIds } }, { "payload.eventId": { $in: eventIds } }]
    });
    Q.collection("affinityRecomputeTasks").deleteMany({ targetId: { $in: eventIds } });
    Q.collection("schedulerPlanMarkers").deleteMany({ ownerId: { $in: eventIds } });
    Q.collection("events").deleteMany({
      $or: [
        { _id: { $in: eventIds } },
        { sourceId: { $in: eventIds } },
        { title: EXPECTED_TITLE }
      ]
    });
  }

  function clearFixture() {
    for (const spec of selectors()) Q.collection(spec.collection).deleteMany(spec.selector);
  }

  function stageData(stageKind, stagedAtIso, context = {}) {
    const future = { startAtIso: dateIso(180), endAtIso: dateIso(300) };
    const past = { startAtIso: dateIso(-240), endAtIso: dateIso(-120) };
    if (stageKind === "editor-empty") return;
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
      const definitions = casualSlotDefinitions();
      const event = eventDocument(EVENT_ID, EXPECTED_TITLE, {
        acceptedUserIds: [participantUserId],
        startAtIso: context.parentStartAtIso,
        endAtIso: context.parentEndAtIso,
        subEventsEnabled: true,
        subEventDefinitions: definitions,
        subEvents: definitions,
        mode: "Casual"
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
      event.capacityMax = 1;
      event.capacityTotal = 1;
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
    if (stageKind === "tournament") {
      const definitions = tournamentStages();
      const event = eventDocument(EVENT_ID, EXPECTED_TITLE, {
        ...future,
        acceptedUserIds: [participantUserId, thirdUserId],
        mode: "Tournament",
        subEventsEnabled: true,
        subEventDefinitions: definitions,
        subEvents: definitions.map(item => ({ ...item, membersAccepted: 0, membersPending: 0 }))
      });
      Q.collection("events").insertOne(event);
      Q.collection("activityMembers").insertMany([
        memberDocument(EVENT_ID, hostUserId, "Admin", "accepted"),
        memberDocument(EVENT_ID, participantUserId, "Member", "accepted"),
        memberDocument(EVENT_ID, thirdUserId, "Member", "accepted")
      ]);
      return;
    }

    const options = { ...future };
    if (stageKind.startsWith("feedback-")) Object.assign(options, past);
    if (stageKind === "trashed") {
      options.status = "T";
      options.statusBeforeSuppression = "A";
    }
    if (stageKind === "ticketing-on" || stageKind === "ticket-ready") options.ticketing = true;
    const event = eventDocument(EVENT_ID, `Manual QA ${checkpointId}`, options);
    insertEventWithMembers(event);
    if (stageKind === "feedback-submitted") insertSubmittedFeedback(stagedAtIso);
    if (stageKind === "ticket-ready") insertReadyTicket(stagedAtIso);
  }

  function eventSummary() {
    return Q.collection("events").find({
      $or: [{ sourceId: { $in: EVENT_IDS } }, { title: EXPECTED_TITLE }]
    }).toArray().map(event => ({
      eventId: Q.text(event.sourceId),
      title: Q.text(event.title),
      status: Q.text(event.status),
      published: event.published,
      isTrashed: event.isTrashed,
      statusBeforeSuppression: event.statusBeforeSuppression,
      ticketing: event.ticketing,
      acceptedMemberUserIds: event.acceptedMemberUserIds || [],
      pendingMemberUserIds: event.pendingMemberUserIds || [],
      invitedMemberUserIds: event.invitedMemberUserIds || [],
      mode: Q.text(event.mode),
      autoInviter: event.autoInviter === true,
      frequency: Q.text(event.frequency),
      slotsEnabled: event.slotsEnabled === true,
      slotTemplates: (event.slotTemplates || []).map(item => ({
        id: Q.text(item.id),
        startAt: item.startAt,
        closed: item.closed === true,
        overrideDate: item.overrideDate
      })),
      subEventDefinitions: (event.subEventDefinitions || []).map(item => ({
        id: Q.text(item.id),
        name: Q.text(item.name),
        stageStatus: Q.text(item.stageStatus),
        tournamentGroupCount: item.tournamentGroupCount,
        tournamentGroupCapacityMin: item.tournamentGroupCapacityMin,
        tournamentGroupCapacityMax: item.tournamentGroupCapacityMax,
        tournamentAdvancePerGroup: item.tournamentAdvancePerGroup
      })),
      startAtIso: event.startAtIso,
      endAtIso: event.endAtIso
    }));
  }

  function oracle(state) {
    const dynamicEventIds = currentEventIds();
    const event = Q.collection("events").findOne({
      $or: [{ sourceId: EVENT_ID }, { title: EXPECTED_TITLE }]
    }) || {};
    const members = Q.collection("activityMembers").find({ $or: [
      { ownerType: "event", ownerId: { $in: dynamicEventIds } },
      { ownerId: { $regex: `^${PREFIX}` } }
    ] }).toArray();
    const feedbackStates = Q.collection("eventFeedbackStates").find({ eventId: { $in: EVENT_IDS } }).toArray();
    const feedbackAnswers = Q.collection("eventFeedbackAnswers").find({ eventId: { $in: EVENT_IDS } }).toArray();
    const tickets = Q.collection("eventTickets").find({ eventId: { $in: EVENT_IDS } }).toArray();
    const stageRuntime = Q.collection("activitySubEventStageRuntime").find({ ownerId: { $regex: `^${PREFIX}` } }).toArray();
    const groups = Q.collection("activitySubEventGroups").find({ ownerId: { $regex: `^${PREFIX}` } }).toArray();
    const leaderboard = Q.collection("eventLeaderboardEntries").find({ eventId: { $regex: `^${PREFIX}` } }).toArray();
    const outboxCount = Q.collection("notificationOutbox").countDocuments({
      $and: [
        { $or: [{ entityId: { $in: EVENT_IDS } }, { "payload.eventId": { $in: EVENT_IDS } }] },
        { createdDate: { $gt: state.stagedAtIso } }
      ]
    });
    const taskCount = Q.collection("affinityRecomputeTasks").countDocuments({
      targetId: { $in: [...EVENT_IDS, hostUserId, participantUserId] },
      updatedDate: { $gt: state.stagedAtIso }
    });
    return {
      events: eventSummary(),
      primaryEvent: {
        status: Q.text(event.status),
        isTrashed: event.isTrashed === true,
        statusBeforeSuppression: Q.text(event.statusBeforeSuppression),
        ticketing: event.ticketing === true
      },
      members: members.map(member => ({
        eventId: Q.text(member.ownerId),
        ownerType: Q.text(member.ownerType),
        userId: Q.text(member.userId),
        role: Q.text(member.role),
        status: Q.text(member.status),
        requestKind: Q.text(member.requestKind),
        pendingSource: Q.text(member.pendingSource),
        invitedByUserId: Q.text(member.invitedByUserId),
        updatedDate: member.updatedDate
      })),
      feedbackStates: feedbackStates.map(item => ({
        viewerUserId: Q.text(item.viewerUserId),
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
        personalityTraitIds: item.personalityTraitIds || [],
        updatedDate: item.updatedDate
      })),
      tickets: tickets.map(ticket => ({
        code: Q.text(ticket.code),
        eventId: Q.text(ticket.eventId),
        holderUserId: Q.text(ticket.holderUserId),
        status: Q.text(ticket.status),
        usedAtIso: ticket.usedAtIso,
        usedByUserId: ticket.usedByUserId
      })),
      stageRuntime: stageRuntime.map(item => ({
        ownerId: Q.text(item.ownerId),
        subEventId: Q.text(item.subEventId),
        stageStatus: Q.text(item.stageStatus),
        stageStatusReason: Q.text(item.stageStatusReason),
        stageFinalizedAt: item.stageFinalizedAt,
        groupsCount: item.groupsCount
      })),
      tournamentGroups: groups.map(item => ({
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
      afterStageRecomputeTaskCount: taskCount
    };
  }

  function stage() {
    const selected = config();
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    if (hostUserId === participantUserId) Q.fail("host and participant must differ.");
    Q.ensureUser(hostUserId, "event host");
    Q.ensureUser(participantUserId, "event participant");
    if (["invitation-ordinary", "invitation-full", "tournament", "slot-past-tournament"].includes(selected.stage)) {
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
    const runtimeContext = slotContext(selected.stage, stagedAtIso);
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
      snapshots: Q.snapshotSpecs(selectors())
    };
    Q.collection(Q.STATE_COLLECTION).insertOne(state);
    try {
      clearFixture();
      stageData(selected.stage, stagedAtIso, runtimeContext);
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
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "inspect-manual-checkpoint",
      why: selected.why,
      workerExpectation: selected.worker,
      oracle: oracle(state),
      expectedVisibleResult: selected.expected,
      next: "Compare the UI screenshot with this identity-level oracle. If it agrees, record PASS and reset this checkpoint; otherwise retain both as defect evidence."
    });
  }

  function reset() {
    config();
    const state = requireMatchingState();
    clearDynamicEventEffects(currentEventIds());
    Q.restoreSnapshots(state.snapshots);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "reset-complete",
      restoredAtIso: Q.nowIso(),
      next: `Run status event-domain ${checkpointId}; expected phase is not-staged.`
    });
  }

  Q.assertDeploymentSafety();
  switch (command) {
    case "stage": stage(); break;
    case "next": next(); break;
    case "status": status(); break;
    case "reset": reset(); break;
    default: Q.fail(`unsupported command '${command}'.`);
  }
})();
