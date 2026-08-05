/* global ManualQa, db, process */
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
  const PREFIX = "manual-qa-checkpoint:v1:event-domain";
  const EVENT_ID = `${PREFIX}:event`;
  const LOCKED_EVENT_ID = `${PREFIX}:feedback-locked`;
  const TRASHED_EVENT_ID = `${PREFIX}:feedback-trashed`;
  const PENDING_EVENT_ID = `${PREFIX}:feedback-pending`;
  const EVENT_IDS = [EVENT_ID, LOCKED_EVENT_ID, TRASHED_EVENT_ID, PENDING_EVENT_ID];
  const TICKET_CODE = "TKT-12345678-1234-4123-8123-123456789abc";
  const AUTO_INVITER_RULE = "event-auto-inviter";
  const AUTO_INVITER_HOLD_SECONDS = 3600;
  const AUTO_INVITER_INITIAL_EDGE_ID = `${PREFIX}:auto-inviter-initial-edge`;
  const AUTO_INVITER_LATER_EDGE_ID = `${PREFIX}:auto-inviter-later-edge`;
  const feedbackEventImageUrl = Q.text(process.env.MANUAL_QA_EVENT_IMAGE_URL);
  const EXPECTED_TITLE = `Manual QA ${checkpointId}`;

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

  function normalizeActivityCount(value) {
    const count = Number(value);
    return Number.isFinite(count) ? Math.max(0, Math.trunc(count)) : 0;
  }

  function synchronizeHostEventActivityCounters(userId) {
    const directEvents = Q.collection("events").find({
      $or: [
        { ownerUserId: userId },
        { creatorUserId: userId },
        { admins: userId }
      ]
    }).toArray();
    const preferredBySourceId = new Map();
    for (const event of directEvents) {
      const parentEventId = Q.text(event.parentEventId);
      const sourceId = parentEventId || Q.text(event.sourceId || event._id);
      if (!sourceId) continue;
      const current = preferredBySourceId.get(sourceId);
      const preference = item => {
        if (!item) return -1;
        const status = Q.text(item.status).toUpperCase();
        const trashed = item.isTrashed === true || status === "T";
        const generated = item.generated === true || Q.text(item.parentEventId) || Q.text(item.eventType) === "slot";
        return (generated ? 0 : 4) + (trashed ? 0 : 2) + (Q.text(item.ownerUserId) === userId ? 1 : 0);
      };
      if (!current || preference(event) > preference(current)) {
        preferredBySourceId.set(sourceId, event);
      }
    }

    let hosting = 0;
    let drafts = 0;
    for (const event of preferredBySourceId.values()) {
      const status = Q.text(event.status).toUpperCase();
      if (event.isTrashed === true || status === "T") continue;
      hosting += 1;
      if (event.published === false || status === "DR") drafts += 1;
    }

    const user = Q.collection("users").findOne({
      $or: [{ _id: userId }, { userId }]
    });
    if (!user) Q.fail(`user '${userId}' disappeared while baseline activity counters were synchronized.`);
    const eventCounters = user.activities && user.activities.event || {};
    const eventAll = normalizeActivityCount(eventCounters.active)
      + normalizeActivityCount(eventCounters.pending)
      + normalizeActivityCount(eventCounters.invitations)
      + hosting;
    const result = Q.collection("users").updateOne({
      $or: [{ _id: userId }, { userId }]
    }, { $set: {
      "activities.hosting": hosting,
      "activities.event.all": eventAll,
      "activities.event.hosting": hosting,
      "activities.event.drafts": drafts
    } });
    if (result.matchedCount !== 1) {
      Q.fail(`user '${userId}' disappeared while baseline activity counters were synchronized.`);
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
      blindMode: options.blindMode || "Open Event",
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
      imageUrl: Q.text(options.imageUrl),
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
      { collection: "eventTickets", selector: { $or: [{ eventId: { $in: EVENT_IDS } }, { code: TICKET_CODE }] } },
      { collection: "notificationOutbox", selector: { $or: [{ entityId: { $in: EVENT_IDS } }, { "payload.eventId": { $in: EVENT_IDS } }] } },
      { collection: "userNotifications", selector: { $or: [{ sourceId: { $in: EVENT_IDS } }, { "payload.eventId": { $in: EVENT_IDS } }] } },
      { collection: "affinityRecomputeTasks", selector: { targetId: { $in: EVENT_IDS } } },
      { collection: "schedulerPlanMarkers", selector: { ownerId: { $in: EVENT_IDS } } }
    ];
  }

  function currentEventIds() {
    const values = Q.collection("events").find(manualEventSelector()).toArray();
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
    Q.collection("affinityRecomputeTasks").deleteMany({ targetId: { $in: eventIds } });
    Q.collection("schedulerPlanMarkers").deleteMany({ ownerId: { $in: eventIds } });
    Q.collection("events").deleteMany({
      $or: [{ _id: { $in: eventIds } }, { sourceId: { $in: eventIds } }, { title: activeExpectedTitle() }]
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
      synchronizeHostEventActivityCounters(hostUserId);
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
    if (stageKind.startsWith("feedback-")) {
      if (!feedbackEventImageUrl) {
        Q.fail("MANUAL_QA_EVENT_IMAGE_URL must contain the uploaded QA fixture image URL.");
      }
      Object.assign(options, past, { imageUrl: feedbackEventImageUrl });
    }
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
      eventId: Q.text(event.sourceId),
      title: Q.text(event.title),
      imageUrl: Q.text(event.imageUrl),
      status: Q.text(event.status),
      published: event.published,
      isTrashed: event.isTrashed,
      statusBeforeSuppression: event.statusBeforeSuppression,
      ticketing: event.ticketing,
      blindMode: Q.text(event.blindMode),
      acceptedMemberUserIds: event.acceptedMemberUserIds || [],
      pendingMemberUserIds: event.pendingMemberUserIds || [],
      invitedMemberUserIds: event.invitedMemberUserIds || [],
      mode: Q.text(event.mode),
      autoInviter: event.autoInviter === true,
      frequency: Q.text(event.frequency),
      location: Q.text(event.location),
      locationCoordinates: event.locationCoordinates || null,
      hostLocationCoordinates: hostCoordinates,
      locationCoordinatesMatchHost: coordinatesMatch(event.locationCoordinates),
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
    const event = Q.collection("events").findOne(manualEventSelector()) || {};
    const members = Q.collection("activityMembers").find({ $or: [
      { ownerType: "event", ownerId: { $in: dynamicEventIds } },
      { ownerId: { $regex: `^${PREFIX}` } }
    ] }).toArray();
    const feedbackStates = Q.collection("eventFeedbackStates").find({ eventId: { $in: dynamicEventIds } }).toArray();
    const feedbackAnswers = Q.collection("eventFeedbackAnswers").find({ eventId: { $in: dynamicEventIds } }).toArray();
    const tickets = Q.collection("eventTickets").find({ eventId: { $in: dynamicEventIds } }).toArray();
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
      eventChats: eventChats.map(chat => ({
        chatId: Q.text(chat.id || chat.chatId || chat._id),
        eventId: Q.text(chat.eventId),
        ownerUserId: Q.text(chat.ownerUserId),
        memberUserIds: sortedUnique(chat.memberIds || []),
        channelType: Q.text(chat.channelType),
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
      userActivityCounters: checkpointId === "EVENT-PUBLISH-CHAT-001"
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
        : checkpointId.startsWith("EVENT-FEEDBACK-")
          ? (() => {
              const current = userActivitiesSnapshot(participantUserId);
              const currentActivities = current.activities.value || {};
              return [{
                user: Q.user(participantUserId),
                current: {
                  feedback: nestedNumber(currentActivities, "feedback"),
                  eventFeedback: {
                    ownEvents: nestedNumber(currentActivities, "eventFeedback.ownEvents"),
                    pending: nestedNumber(currentActivities, "eventFeedback.pending"),
                    feedbacked: nestedNumber(currentActivities, "eventFeedback.feedbacked"),
                    removed: nestedNumber(currentActivities, "eventFeedback.removed")
                  }
                }
              }];
            })()
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
        readAtIso: Q.text(item.readAtIso),
        read: Boolean(Q.text(item.readAtIso))
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
      afterStageRecomputeTaskCount: taskCount,
      autoInviterRule: checkpointId === "EVENT-EDITOR-003" ? autoInviterRuleSummary() : null,
      autoInviterEligibility: checkpointId === "EVENT-EDITOR-003"
        ? autoInviterEligibilitySummary(state)
        : null,
      autoInviterPeriodic: checkpointId === "EVENT-EDITOR-003"
        ? autoInviterPeriodicSummary(state)
        : null
    };
  }

  function stage() {
    const selected = config();
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    if (hostUserId === participantUserId) Q.fail("host and participant must differ.");
    Q.ensureUser(hostUserId, "event host");
    Q.ensureUser(participantUserId, "event participant");
    if (["invitation-ordinary", "invitation-full", "tournament", "slot-past-tournament", "publish-chat-draft", "chat-authorized"].includes(selected.stage)) {
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
      snapshots: Q.snapshotSpecs(selectors()),
      userActivitySnapshots: ["publish-chat-draft", "chat-authorized"].includes(selected.stage)
        ? [hostUserId, participantUserId, thirdUserId].map(userActivitiesSnapshot)
        : selected.stage.startsWith("feedback-")
          ? [participantUserId].map(userActivitiesSnapshot)
          : []
    };
    Q.collection(Q.STATE_COLLECTION).insertOne(state);
    try {
      clearFixture();
      stageData(selected.stage, stagedAtIso, runtimeContext);
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

  function advance() {
    const selected = config();
    const state = Q.activeState(SCENARIO, true);
    const currentCheckpointId = Q.text(state.checkpointId).toUpperCase();
    if (!sourceCheckpointId || currentCheckpointId !== sourceCheckpointId) {
      Q.fail(`staged checkpoint is '${currentCheckpointId}', not source '${sourceCheckpointId}'.`);
    }
    const event = Q.collection("events").findOne(manualEventSelector());
    if (!event) Q.fail("cannot advance without the manually created event.");
    if (selected.stage === "draft" && Q.text(event.status) !== "DR") {
      Q.fail(`next checkpoint requires a draft event, but status is '${Q.text(event.status)}'.`);
    }
    const advancedAtIso = Q.nowIso();
    const history = Array.isArray(state.checkpointHistory) ? state.checkpointHistory : [];
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: {
        checkpointId,
        stagedAtIso: advancedAtIso,
        "context.actualEventSourceId": Q.text(event.sourceId || event._id)
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
    for (const saved of state.autoInviterRecipientActivitySnapshots || []) {
      restoreUserActivities(saved);
    }
    for (const saved of state.userActivitySnapshots || []) {
      restoreUserActivities(saved);
    }
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "reset-complete",
      restoredAtIso: Q.nowIso(),
      next: `Run status event-domain ${checkpointId}; expected phase is not-staged.`
    });
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
    case "stage": stage(); break;
    case "advance": advance(); break;
    case "prepare-invitation-acceptance-retest": prepareInvitationAcceptanceRetest(); break;
    case "hold-auto-inviter": holdAutoInviter(); break;
    case "prepare-auto-inviter": prepareAutoInviter(); break;
    case "capture-auto-inviter-baseline": captureAutoInviterBaseline(); break;
    case "prepare-periodic-auto-inviter": preparePeriodicAutoInviter(); break;
    case "schedule-auto-inviter": scheduleAutoInviter(); break;
    case "next": next(); break;
    case "status": status(); break;
    case "reset": reset(); break;
    case "discard-stale": discardStale(); break;
    default: Q.fail(`unsupported command '${command}'.`);
  }
})();
