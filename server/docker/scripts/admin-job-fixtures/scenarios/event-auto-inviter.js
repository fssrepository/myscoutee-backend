/* global AdminJobFixture */
(() => {
  "use strict";
  const F = AdminJobFixture;
  const job = "event-auto-inviter";
  const eventId = F.fixtureId(job, "event");

  function weightedFixture(equalCandidateWeights = false) {
    const creatorUserId = F.fixtureId(job, "weighted-creator");
    const reservedUserId = F.fixtureId(job, "weighted-reserved");
    const candidateUserIds = Array.from(
      { length: 4 },
      (_, index) => F.fixtureId(job, `weighted-candidate-${index + 1}`)
    );
    const weightedUserIds = [creatorUserId, reservedUserId, ...candidateUserIds];
    const weights = equalCandidateWeights
      ? [0.99, 0.50, 0.50, 0.50, 0.50]
      : [0.99, 0.95, 0.80, 0.40, 0.10];
    const edgeUserIds = [reservedUserId, ...candidateUserIds];
    const edges = edgeUserIds.map((rightUserId, index) => ({
      _id: F.fixtureId(job, `weighted-edge-${index + 1}`),
      syncKey: F.fixtureId(job, `weighted-edge-${index + 1}`),
      pairKey: [creatorUserId, rightUserId].sort().join(":"),
      leftUserId: creatorUserId,
      rightUserId,
      affinityScore: weights[index],
      edgeWeight: weights[index],
      evidenceCount: 1,
      updatedUser: F.FIXTURE_ACTOR
    }));
    return {
      creatorUserId,
      reservedUserId,
      candidateUserIds,
      userIds: weightedUserIds,
      edges,
      weightedTie: equalCandidateWeights,
      expectedInviteeUserIds: equalCandidateWeights
        ? [...candidateUserIds].sort().slice(0, 2)
        : candidateUserIds.slice(0, 2),
      expectedExcludedUserIds: [
        reservedUserId,
        ...(equalCandidateWeights
          ? [...candidateUserIds].sort().slice(2)
          : candidateUserIds.slice(2))
      ]
    };
  }

  function waitlistCapacityFixture() {
    const creatorUserId = F.fixtureId(job, "waitlist-creator");
    const reservedUserId = F.fixtureId(job, "waitlist-reserved");
    const waitingUserIds = Array.from(
      { length: 4 },
      (_, index) => F.fixtureId(job, `waitlist-candidate-${index + 1}`)
    );
    return {
      creatorUserId,
      reservedUserId,
      waitingUserIds,
      userIds: [creatorUserId, reservedUserId, ...waitingUserIds],
      expectedPromotedUserIds: waitingUserIds.slice(0, 2),
      expectedWaitingUserIds: waitingUserIds.slice(2)
    };
  }

  function pendingJoinCapacityFixture() {
    const creatorUserId = F.fixtureId(job, "pending-join-creator");
    const pendingJoinUserId = F.fixtureId(job, "pending-join-requester");
    const candidateUserIds = [
      F.fixtureId(job, "pending-join-candidate-strong"),
      F.fixtureId(job, "pending-join-candidate-weak")
    ];
    const edgeUserIds = [pendingJoinUserId, ...candidateUserIds];
    const weights = [0.99, 0.90, 0.40];
    const edges = edgeUserIds.map((rightUserId, index) => ({
      _id: F.fixtureId(job, `pending-join-edge-${index + 1}`),
      syncKey: F.fixtureId(job, `pending-join-edge-${index + 1}`),
      pairKey: [creatorUserId, rightUserId].sort().join(":"),
      leftUserId: creatorUserId,
      rightUserId,
      affinityScore: weights[index],
      edgeWeight: weights[index],
      evidenceCount: 1,
      updatedUser: F.FIXTURE_ACTOR
    }));
    return {
      creatorUserId,
      pendingJoinUserId,
      candidateUserIds,
      userIds: [creatorUserId, pendingJoinUserId, ...candidateUserIds],
      edges,
      pendingJoinMemberId: F.fixtureId(job, "pending-join-member"),
      pendingJoinAtIso: F.pastIso(15),
      expectedInviteeUserIds: candidateUserIds.slice(0, 1),
      expectedExcludedUserIds: [pendingJoinUserId, candidateUserIds[1]]
    };
  }

  function creatorAndCandidates() {
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
      if (!existingUsers.has(left) || !existingUsers.has(right) || left === right) return;
      if (!adjacency.has(left)) adjacency.set(left, new Set());
      if (!adjacency.has(right)) adjacency.set(right, new Set());
      adjacency.get(left).add(right);
      adjacency.get(right).add(left);
    });
    const selected = [...adjacency.entries()]
      .filter(([, neighbours]) => neighbours.size >= 2)
      .sort((left, right) => right[1].size - left[1].size)[0];
    if (!selected) F.fail("auto-inviter fixture needs a seeded affinity user with two neighbours.");
    return [selected[0], ...[...selected[1]].sort().slice(0, 2)];
  }

  F.run({
    job,
    ruleKey: job,
    variations: [
      "open-spots",
      "full",
      "weighted",
      "weighted-tie",
      "waitlist-capacity",
      "pending-join-does-not-reserve"
    ],
    build(variation) {
      const weighted = ["weighted", "weighted-tie"].includes(variation)
        ? weightedFixture(variation === "weighted-tie")
        : null;
      const waitlistCapacity = variation === "waitlist-capacity"
        ? waitlistCapacityFixture()
        : null;
      const pendingJoinCapacity = variation === "pending-join-does-not-reserve"
        ? pendingJoinCapacityFixture()
        : null;
      const synthetic = weighted || waitlistCapacity || pendingJoinCapacity;
      const syntheticEdges = synthetic && synthetic.edges ? synthetic.edges : [];
      const userIds = synthetic ? synthetic.userIds : creatorAndCandidates();
      const isolatedEventIds = F.collection("events")
        .find({ autoInviter: true, _id: { $ne: eventId } }, { projection: { _id: 1 } })
        .map(event => event._id)
        .toArray();
      const isolatedWaitlistMemberIds = F.collection("activityMembers")
        .find({
          ownerType: "event",
          status: "pending",
          requestKind: { $in: ["waitlist", "waitlist-invite"] }
        }, { projection: { _id: 1 } })
        .map(member => member._id)
        .toArray();
      return {
        pendingCount: 1,
        pendingCountUnit: "admin.jobs.table.affected",
        expected: variation === "open-spots"
          ? "Two connected candidates become pending event invite members; invite outbox/bell records and one priority plan marker appear."
          : variation === "full"
            ? "No invitations are created because accepted capacity is already full."
            : variation === "weighted"
              ? "The pending highest-weight user stays excluded; the next two exact weighted candidates are invited, and a repeated scheduled pass changes zero records."
              : variation === "weighted-tie"
                ? "Four candidates have exactly equal affinity and only two places; the lexicographically first two user IDs are invited with an exact marker/outbox/bell oracle, and a repeated scheduled pass changes zero records."
                : variation === "waitlist-capacity"
                  ? "Exactly the two oldest of four waitlisted users are promoted into the two unreserved places; the other two remain waitlisted and a repeated pass changes zero records."
                  : "A member-origin pending join request stays byte-for-byte stable and locks that user out of candidacy without reserving invite capacity; the strongest eligible affinity candidate receives the only invitation, and a repeated scheduled pass changes zero records.",
        context: {
          eventId,
          userIds,
          weighted: Boolean(weighted),
          waitlistCapacity: Boolean(waitlistCapacity),
          pendingJoinCapacity: Boolean(pendingJoinCapacity),
          ...(synthetic || {}),
          isolatedEventIds,
          isolatedWaitlistMemberIds,
          initialMemberId: F.fixtureId(job, "creator-member"),
          reservedMemberId: F.fixtureId(job, "reserved-member")
        },
        specs: [
          { collection: "events", selector: { _id: { $in: [...isolatedEventIds, eventId] } } },
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
                { ownerType: "event", ownerId: eventId },
                { _id: { $in: isolatedWaitlistMemberIds } }
              ]
            }
          },
          { collection: "schedulerPlanMarkers", selector: { ownerId: eventId } },
          {
            collection: "notificationOutbox",
            selector: { $or: [{ entityId: eventId }, { "payload.eventId": eventId }] }
          },
          {
            collection: "userNotifications",
            selector: { $or: [{ sourceId: eventId }, { "payload.eventId": eventId }] }
          },
          { collection: "affinityRecomputeTasks", selector: { targetId: eventId } }
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
              autoInviter: false,
              updatedDate: now,
              updatedUser: F.FIXTURE_ACTOR
            }
          }
        );
      }
      if ((context.isolatedWaitlistMemberIds || []).length > 0) {
        F.collection("activityMembers").updateMany(
          { _id: { $in: context.isolatedWaitlistMemberIds } },
          {
            $set: {
              requestKind: "admin-fixture-quarantined",
              updatedDate: now,
              updatedUser: F.FIXTURE_ACTOR
            }
          }
        );
      }
      if (context.weighted || context.waitlistCapacity || context.pendingJoinCapacity) {
        F.collection("users").insertMany(context.userIds.map((userId, index) => ({
          _id: userId,
          syncKey: userId,
          userId,
          name: `Auto Inviter Fixture ${index + 1}`,
          initials: `A${index + 1}`,
          city: "Fixture inviter",
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
      }
      if (context.weighted || context.pendingJoinCapacity) {
        F.collection("userAffinityEdges").insertMany(context.edges.map(edge => ({
          ...edge,
          updatedDate: now
        })));
      }
      F.collection("events").insertOne({
        _id: eventId,
        sourceId: eventId,
        syncKey: eventId,
        title: "Admin fixture auto inviter",
        status: "A",
        published: true,
        autoInviter: variation !== "waitlist-capacity",
        ownerUserId: context.creatorUserId || context.userIds[0],
        creatorUserId: context.creatorUserId || context.userIds[0],
        capacityMin: 1,
        capacityMax: ["weighted", "weighted-tie", "waitlist-capacity"].includes(variation)
          ? 4
          : variation === "open-spots"
            ? 3
            : variation === "pending-join-does-not-reserve"
              ? 2
              : 1,
        capacityTotal: ["weighted", "weighted-tie", "waitlist-capacity"].includes(variation)
          ? 4
          : variation === "open-spots"
            ? 3
            : variation === "pending-join-does-not-reserve"
              ? 2
              : 1,
        acceptedMembers: 1,
        pendingMembers: ["weighted", "weighted-tie"].includes(variation)
          ? 1
          : variation === "waitlist-capacity"
            ? 5
            : variation === "pending-join-does-not-reserve"
              ? 1
              : 0,
        subEvents: [],
        startAtIso: F.futureIso(180),
        endAtIso: F.futureIso(360),
        createdDate: now,
        createdUser: F.FIXTURE_ACTOR,
        updatedDate: now,
        updatedUser: F.FIXTURE_ACTOR
      });
      const initialMembers = [{
        _id: context.initialMemberId,
        syncKey: context.initialMemberId,
        ownerType: "event",
        ownerId: eventId,
        userId: context.creatorUserId || context.userIds[0],
        role: "Admin",
        status: "accepted",
        actionAtIso: now,
        createdDate: now,
        createdUser: F.FIXTURE_ACTOR,
        updatedDate: now,
        updatedUser: F.FIXTURE_ACTOR
      }];
      if (["weighted", "weighted-tie", "waitlist-capacity"].includes(variation)) {
        initialMembers.push({
          _id: context.reservedMemberId,
          syncKey: context.reservedMemberId,
          ownerType: "event",
          ownerId: eventId,
          userId: context.reservedUserId,
          role: "Member",
          status: "pending",
          requestKind: "invite",
          pendingSource: "admin",
          invitedByUserId: context.creatorUserId || context.userIds[0],
          actionAtIso: now,
          createdDate: now,
          createdUser: F.FIXTURE_ACTOR,
          updatedDate: now,
          updatedUser: F.FIXTURE_ACTOR
        });
      }
      if (variation === "waitlist-capacity") {
        const waitlistActionMinutesAgo = [80, 60, 40, 20];
        const waitlistMembers = context.waitingUserIds.map((userId, index) => {
          const queuedAtIso = F.pastIso(waitlistActionMinutesAgo[index]);
          return {
            _id: F.fixtureId(job, `waitlist-member-${index + 1}`),
            syncKey: F.fixtureId(job, `waitlist-member-${index + 1}`),
            ownerType: "event",
            ownerId: eventId,
            userId,
            role: "Member",
            status: "pending",
            requestKind: "waitlist",
            pendingSource: "member",
            actionAtIso: queuedAtIso,
            createdDate: queuedAtIso,
            createdUser: F.FIXTURE_ACTOR,
            updatedDate: now,
            updatedUser: F.FIXTURE_ACTOR
          };
        });
        initialMembers.push(...waitlistMembers.reverse());
      }
      if (variation === "pending-join-does-not-reserve") {
        initialMembers.push({
          _id: context.pendingJoinMemberId,
          syncKey: context.pendingJoinMemberId,
          ownerType: "event",
          ownerId: eventId,
          userId: context.pendingJoinUserId,
          role: "Member",
          status: "pending",
          requestKind: "join",
          pendingSource: "member",
          actionAtIso: context.pendingJoinAtIso,
          createdDate: context.pendingJoinAtIso,
          createdUser: F.FIXTURE_ACTOR,
          updatedDate: context.pendingJoinAtIso,
          updatedUser: F.FIXTURE_ACTOR
        });
      }
      F.collection("activityMembers").insertMany(initialMembers);
    },
    afterPrepare() {
      print(
        `[admin-job-fixtures] Existing auto-inviter events and pending waitlist rows were temporarily `
          + `quarantined so the global worker cannot invite hundreds of demo users. Reset this job when finished.`
      );
    },
    status(context, snapshot) {
      const currentEventId = context.eventId || eventId;
      const members = F.collection("activityMembers")
        .find({ ownerType: "event", ownerId: currentEventId })
        .sort({ userId: 1, _id: 1 })
        .map(member => ({
          id: member._id,
          userId: member.userId,
          status: member.status,
          requestKind: member.requestKind,
          pendingSource: member.pendingSource,
          invitedByUserId: member.invitedByUserId,
          role: member.role,
          actionAtIso: member.actionAtIso,
          createdDate: member.createdDate,
          updatedDate: member.updatedDate
        }))
        .toArray();
      const markerDocuments = F.collection("schedulerPlanMarkers")
        .find({ ownerId: currentEventId })
        .sort({ _id: 1 })
        .toArray();
      const outboxDocuments = F.collection("notificationOutbox")
        .find({
          notificationType: "event-invite",
          $or: [{ entityId: currentEventId }, { "payload.eventId": currentEventId }]
        })
        .sort({ _id: 1 })
        .toArray();
      const bellDocuments = F.collection("userNotifications")
        .find({
          kind: "event-invite",
          $or: [{ sourceId: currentEventId }, { "payload.eventId": currentEventId }]
        })
        .sort({ recipientUserId: 1, _id: 1 })
        .toArray();
      const result = {
        quarantinedAutoInviterEvents: (context.isolatedEventIds || []).length,
        quarantinedWaitlistMembers: (context.isolatedWaitlistMemberIds || []).length,
        members,
        invitationCount: members.filter(member =>
          member.status === "pending" && ["invite", "waitlist-invite"].includes(member.requestKind)
        ).length,
        planMarkerCount: markerDocuments.length,
        outboxCount: outboxDocuments.length,
        bellCount: bellDocuments.length
      };
      const sorted = values => [...(values || [])].sort();
      const same = (left, right) => JSON.stringify(sorted(left)) === JSON.stringify(sorted(right));
      if (context.waitlistCapacity) {
        const expectedPromotedUserIds = sorted(context.expectedPromotedUserIds);
        const expectedWaitingUserIds = sorted(context.expectedWaitingUserIds);
        const promotedMembers = members.filter(member =>
          expectedPromotedUserIds.includes(member.userId)
          && member.status === "pending"
          && member.requestKind === "waitlist-invite"
        );
        const waitingMembers = members.filter(member =>
          expectedWaitingUserIds.includes(member.userId)
          && member.status === "pending"
          && member.requestKind === "waitlist"
        );
        const promotedUserIds = sorted(promotedMembers.map(member => member.userId));
        const stillWaitingUserIds = sorted(waitingMembers.map(member => member.userId));
        const creatorMember = members.find(member => member.userId === context.creatorUserId);
        const reservedMember = members.find(member => member.userId === context.reservedUserId);
        const outboxRecipientUserIds = sorted(
          outboxDocuments.flatMap(item => item.recipientUserIds || [])
        );
        const bellRecipientUserIds = sorted(
          bellDocuments.map(item => item.recipientUserId)
        );
        const exactPromotions = same(promotedUserIds, expectedPromotedUserIds)
          && promotedMembers.every(member =>
            member.pendingSource === "admin"
            && member.invitedByUserId === context.creatorUserId
          );
        const exactRemainingWaitlist = same(stillWaitingUserIds, expectedWaitingUserIds)
          && waitingMembers.every(member => member.pendingSource === "member");
        const exactMembershipCardinality = members.length === 6
          && Boolean(creatorMember && creatorMember.status === "accepted");
        const reservedInvitePreserved = Boolean(
          reservedMember
          && reservedMember.status === "pending"
          && reservedMember.requestKind === "invite"
        );
        const exactOutboxRecipients = outboxDocuments.length === 1
          && same(outboxRecipientUserIds, expectedPromotedUserIds);
        const exactBellRecipients = same(bellRecipientUserIds, expectedPromotedUserIds);
        const noPriorityPlanMarker = markerDocuments.length === 0;
        const rule = F.requireRule(job);
        const baseline = context.waitlistBaseline || null;
        const firstPassRunCountExact = Boolean(baseline)
          || Boolean(
            rule.runState
            && rule.runState.lastRunStatus === "completed"
            && rule.runState.lastRunCount === 2
          );
        const firstPassComplete = exactPromotions
          && exactRemainingWaitlist
          && exactMembershipCardinality
          && reservedInvitePreserved
          && exactOutboxRecipients
          && exactBellRecipients
          && noPriorityPlanMarker
          && firstPassRunCountExact;
        const currentFingerprint = JSON.stringify({
          members,
          markers: markerDocuments,
          outbox: outboxDocuments.map(item => ({
            id: item._id,
            collapseKey: item.collapseKey,
            recipientUserIds: sorted(item.recipientUserIds)
          })),
          bells: bellDocuments.map(item => ({
            id: item._id,
            recipientUserId: item.recipientUserId,
            sourceId: item.sourceId
          }))
        });
        if (firstPassComplete && !baseline && snapshot) {
          F.collection(F.SNAPSHOT_COLLECTION).updateOne(
            { _id: snapshot._id },
            {
              $set: {
                "context.waitlistBaseline": {
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
          ...result,
          expectedPromotedUserIds,
          expectedWaitingUserIds,
          promotedUserIds,
          stillWaitingUserIds,
          reservedMember,
          outboxRecipientUserIds,
          bellRecipientUserIds,
          validation: {
            exactPromotions,
            exactRemainingWaitlist,
            exactMembershipCardinality,
            reservedInvitePreserved,
            exactOutboxRecipients,
            exactBellRecipients,
            noPriorityPlanMarker,
            firstPassChangedExactlyTwoRecords: firstPassRunCountExact,
            firstPassComplete,
            baselineCaptured: Boolean(baseline) || firstPassComplete,
            repeatedPassObserved,
            repeatedPassChangedZeroRecords: repeatedPassObserved,
            membershipAndNotificationSetUnchanged:
              repeatedPassObserved
              && baseline.fingerprint === currentFingerprint
          }
        };
      }
      if (context.pendingJoinCapacity) {
        const expectedInvitees = sorted(context.expectedInviteeUserIds);
        const expectedExcluded = sorted(context.expectedExcludedUserIds);
        const creatorMember = members.find(member => member.userId === context.creatorUserId);
        const pendingJoinMember = members.find(
          member => member.userId === context.pendingJoinUserId
        );
        const invitedMembers = members.filter(member =>
          member.status === "pending"
          && ["invite", "waitlist-invite"].includes(member.requestKind)
        );
        const invitedUserIds = sorted(invitedMembers.map(member => member.userId));
        const pendingJoinDocument = F.collection("activityMembers").findOne({
          _id: context.pendingJoinMemberId
        });
        const expectedPendingJoinDocument = {
          _id: context.pendingJoinMemberId,
          syncKey: context.pendingJoinMemberId,
          ownerType: "event",
          ownerId: currentEventId,
          userId: context.pendingJoinUserId,
          role: "Member",
          status: "pending",
          requestKind: "join",
          pendingSource: "member",
          actionAtIso: context.pendingJoinAtIso,
          createdDate: context.pendingJoinAtIso,
          createdUser: F.FIXTURE_ACTOR,
          updatedDate: context.pendingJoinAtIso,
          updatedUser: F.FIXTURE_ACTOR
        };
        const canonicalRecord = document => {
          if (!document) return null;
          return Object.keys(document)
            .sort()
            .reduce((resultDocument, key) => {
              resultDocument[key] = document[key];
              return resultDocument;
            }, {});
        };
        const pendingJoinDocumentUnchanged =
          JSON.stringify(canonicalRecord(pendingJoinDocument))
          === JSON.stringify(canonicalRecord(expectedPendingJoinDocument));
        const marker = markerDocuments.find(item =>
          item.wrapperType === "priority"
          && item.actionType === "invite-batch"
          && item.scopeId === currentEventId
        );
        const priorityMarkers = markerDocuments.filter(item =>
          item.wrapperType === "priority"
          && item.actionType === "invite-batch"
          && item.scopeId === currentEventId
        );
        const outboxRecipientUserIds = sorted(
          outboxDocuments.flatMap(item => item.recipientUserIds || [])
        );
        const bellRecipientUserIds = sorted(
          bellDocuments.map(item => item.recipientUserId)
        );
        const exactInvitee = same(invitedUserIds, expectedInvitees)
          && invitedMembers.length === 1
          && invitedMembers.every(member =>
            member.pendingSource === "admin"
            && member.invitedByUserId === context.creatorUserId
          );
        const excludedUsersNotInvited = expectedExcluded.every(
          userId => !invitedUserIds.includes(userId)
        );
        const exactMembershipCardinality = members.length === 3
          && Boolean(creatorMember && creatorMember.status === "accepted")
          && Boolean(
            pendingJoinMember
            && pendingJoinMember.status === "pending"
            && pendingJoinMember.requestKind === "join"
            && pendingJoinMember.pendingSource === "member"
          );
        const exactMarker = priorityMarkers.length === 1
          && Boolean(marker)
          && same(marker.userIds, expectedInvitees);
        const exactOutboxRecipients = outboxDocuments.length === 1
          && same(outboxRecipientUserIds, expectedInvitees);
        const exactBellRecipients = same(bellRecipientUserIds, expectedInvitees);
        const joinEdge = (context.edges || []).find(
          edge => edge.rightUserId === context.pendingJoinUserId
        );
        const eligibleEdges = (context.edges || []).filter(
          edge => (context.candidateUserIds || []).includes(edge.rightUserId)
        );
        const strongestEligibleEdge = [...eligibleEdges].sort(
          (left, right) => Number(right.edgeWeight) - Number(left.edgeWeight)
        )[0];
        const pendingJoinHasHighestWeight = Boolean(
          joinEdge
          && eligibleEdges.length > 0
          && eligibleEdges.every(
            edge => Number(joinEdge.edgeWeight) > Number(edge.edgeWeight)
          )
        );
        const strongestEligibleInvited = Boolean(
          strongestEligibleEdge
          && expectedInvitees.length === 1
          && strongestEligibleEdge.rightUserId === expectedInvitees[0]
          && invitedUserIds[0] === strongestEligibleEdge.rightUserId
        );
        const fixtureEvent = F.collection("events").findOne({ _id: currentEventId });
        const capacityFixtureExact = Boolean(
          fixtureEvent
          && Number(fixtureEvent.capacityTotal) === 2
          && Number(fixtureEvent.capacityMax) === 2
        );
        const rule = F.requireRule(job);
        const baseline = context.pendingJoinBaseline || null;
        const firstPassRunCountExact = Boolean(baseline)
          || Boolean(
            rule.runState
            && rule.runState.lastRunStatus === "completed"
            && rule.runState.lastRunCount === 1
          );
        const firstPassComplete = exactInvitee
          && excludedUsersNotInvited
          && exactMembershipCardinality
          && pendingJoinDocumentUnchanged
          && exactMarker
          && exactOutboxRecipients
          && exactBellRecipients
          && pendingJoinHasHighestWeight
          && strongestEligibleInvited
          && capacityFixtureExact
          && firstPassRunCountExact;
        const currentFingerprint = JSON.stringify({
          members,
          pendingJoinDocument: canonicalRecord(pendingJoinDocument),
          marker: marker && {
            id: marker._id,
            fingerprint: marker.fingerprint,
            userIds: sorted(marker.userIds),
            updatedDate: marker.updatedDate
          },
          outbox: outboxDocuments.map(item => ({
            id: item._id,
            collapseKey: item.collapseKey,
            recipientUserIds: sorted(item.recipientUserIds)
          })),
          bells: bellDocuments.map(item => ({
            id: item._id,
            recipientUserId: item.recipientUserId,
            sourceId: item.sourceId
          }))
        });
        if (firstPassComplete && !baseline && snapshot) {
          F.collection(F.SNAPSHOT_COLLECTION).updateOne(
            { _id: snapshot._id },
            {
              $set: {
                "context.pendingJoinBaseline": {
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
          ...result,
          capacityTotal: fixtureEvent && fixtureEvent.capacityTotal,
          expectedInviteeUserIds: expectedInvitees,
          expectedExcludedUserIds: expectedExcluded,
          invitedUserIds,
          pendingJoinMember,
          marker: marker && {
            ownerId: marker.ownerId,
            scopeId: marker.scopeId,
            userIds: marker.userIds,
            fingerprint: marker.fingerprint,
            updatedDate: marker.updatedDate
          },
          outboxRecipientUserIds,
          bellRecipientUserIds,
          validation: {
            exactInvitee,
            excludedUsersNotInvited,
            exactMembershipCardinality,
            pendingJoinDocumentUnchanged,
            pendingJoinHasHighestWeight,
            strongestEligibleInvited,
            capacityFixtureExact,
            pendingJoinDidNotReserveOnlyInviteSlot:
              exactInvitee && capacityFixtureExact && pendingJoinDocumentUnchanged,
            exactMarker,
            exactOutboxRecipients,
            exactBellRecipients,
            firstPassChangedExactlyOneRecord: firstPassRunCountExact,
            firstPassComplete,
            baselineCaptured: Boolean(baseline) || firstPassComplete,
            repeatedPassObserved,
            repeatedPassChangedZeroRecords: repeatedPassObserved,
            membershipMarkerAndNotificationSetUnchanged:
              repeatedPassObserved
              && baseline.fingerprint === currentFingerprint
          }
        };
      }
      if (!context.weighted) {
        return result;
      }

      const expectedInvitees = sorted(context.expectedInviteeUserIds);
      const expectedExcluded = sorted(context.expectedExcludedUserIds);
      const invitedUserIds = sorted(members
        .filter(member =>
          member.status === "pending"
          && ["invite", "waitlist-invite"].includes(member.requestKind)
          && member.userId !== context.reservedUserId
        )
        .map(member => member.userId));
      const unexpectedlyInvitedUserIds = expectedExcluded.filter(
        userId => userId !== context.reservedUserId && invitedUserIds.includes(userId)
      );
      const reservedMember = members.find(member => member.userId === context.reservedUserId);
      const marker = markerDocuments.find(item =>
        item.wrapperType === "priority"
        && item.actionType === "invite-batch"
        && item.scopeId === currentEventId
      );
      const priorityMarkers = markerDocuments.filter(item =>
        item.wrapperType === "priority"
        && item.actionType === "invite-batch"
        && item.scopeId === currentEventId
      );
      const outboxRecipientUserIds = sorted(
        outboxDocuments.flatMap(item => item.recipientUserIds || [])
      );
      const bellRecipientUserIds = sorted(
        bellDocuments.map(item => item.recipientUserId)
      );
      const exactInvitees = same(invitedUserIds, expectedInvitees);
      const exactMarker = priorityMarkers.length === 1
        && Boolean(marker)
        && same(marker.userIds, expectedInvitees);
      const exactOutboxRecipients = outboxDocuments.length === 1
        && same(outboxRecipientUserIds, expectedInvitees);
      const exactBellRecipients = same(bellRecipientUserIds, expectedInvitees);
      const reservedInvitePreserved = Boolean(
        reservedMember
        && reservedMember.status === "pending"
        && reservedMember.requestKind === "invite"
      );
      const equalWeightCandidateEdges = (context.edges || []).filter(
        edge => (context.candidateUserIds || []).includes(edge.rightUserId)
      );
      const tieBreakExpectedInvitees = sorted(context.candidateUserIds).slice(0, 2);
      const equalCandidateWeights = equalWeightCandidateEdges.length
        === (context.candidateUserIds || []).length
        && new Set(equalWeightCandidateEdges.map(edge => Number(edge.edgeWeight))).size === 1;
      const deterministicTieBreak = !context.weightedTie
        || (equalCandidateWeights
          && same(expectedInvitees, tieBreakExpectedInvitees)
          && same(invitedUserIds, tieBreakExpectedInvitees));
      const rule = F.requireRule(job);
      const baseline = context.weightedBaseline || null;
      const firstPassRunCountExact = Boolean(baseline)
        || Boolean(
          rule.runState
          && rule.runState.lastRunStatus === "completed"
          && rule.runState.lastRunCount === 2
        );
      const firstPassComplete =
        exactInvitees
        && unexpectedlyInvitedUserIds.length === 0
        && reservedInvitePreserved
        && exactMarker
        && exactOutboxRecipients
        && exactBellRecipients
        && deterministicTieBreak
        && firstPassRunCountExact;
      const currentFingerprint = JSON.stringify({
        members,
        marker: marker && {
          id: marker._id,
          fingerprint: marker.fingerprint,
          userIds: sorted(marker.userIds),
          updatedDate: marker.updatedDate
        },
        outbox: outboxDocuments.map(item => ({
          id: item._id,
          collapseKey: item.collapseKey,
          recipientUserIds: sorted(item.recipientUserIds)
        })),
        bells: bellDocuments.map(item => ({
          id: item._id,
          recipientUserId: item.recipientUserId,
          sourceId: item.sourceId
        }))
      });
      if (firstPassComplete && !baseline && snapshot) {
        F.collection(F.SNAPSHOT_COLLECTION).updateOne(
          { _id: snapshot._id },
          {
            $set: {
              "context.weightedBaseline": {
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
        ...result,
        expectedInviteeUserIds: expectedInvitees,
        expectedExcludedUserIds: expectedExcluded,
        invitedUserIds,
        unexpectedlyInvitedUserIds,
        weightedTie: Boolean(context.weightedTie),
        tieBreakExpectedInviteeUserIds: context.weightedTie
          ? tieBreakExpectedInvitees
          : [],
        reservedMember,
        marker: marker && {
          ownerId: marker.ownerId,
          scopeId: marker.scopeId,
          userIds: marker.userIds,
          fingerprint: marker.fingerprint,
          updatedDate: marker.updatedDate
        },
        outboxRecipientUserIds,
        bellRecipientUserIds,
        validation: {
          exactInvitees,
          reservedHighestWeightUserExcluded: reservedInvitePreserved,
          lowerWeightUsersExcluded: unexpectedlyInvitedUserIds.length === 0,
          exactMarker,
          exactOutboxRecipients,
          exactBellRecipients,
          equalCandidateWeights: !context.weightedTie || equalCandidateWeights,
          deterministicEqualWeightTieBreak: deterministicTieBreak,
          firstPassChangedExactlyTwoRecords: firstPassRunCountExact,
          firstPassComplete,
          baselineCaptured: Boolean(baseline) || firstPassComplete,
          repeatedPassObserved,
          repeatedPassChangedZeroRecords: repeatedPassObserved,
          membershipMarkerAndNotificationSetUnchanged:
            repeatedPassObserved
            && baseline.fingerprint === currentFingerprint
        }
      };
    }
  });
})();
