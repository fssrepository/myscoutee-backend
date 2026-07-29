/* global AdminJobFixture */
(() => {
  "use strict";
  const F = AdminJobFixture;
  const job = "event-auto-inviter";
  const eventId = F.fixtureId(job, "event");

  function weightedFixture() {
    const creatorUserId = F.fixtureId(job, "weighted-creator");
    const reservedUserId = F.fixtureId(job, "weighted-reserved");
    const candidateUserIds = Array.from(
      { length: 4 },
      (_, index) => F.fixtureId(job, `weighted-candidate-${index + 1}`)
    );
    const weightedUserIds = [creatorUserId, reservedUserId, ...candidateUserIds];
    const weights = [0.99, 0.95, 0.80, 0.40, 0.10];
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
      expectedInviteeUserIds: candidateUserIds.slice(0, 2),
      expectedExcludedUserIds: [reservedUserId, ...candidateUserIds.slice(2)]
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
    variations: ["open-spots", "full", "weighted"],
    build(variation) {
      const weighted = variation === "weighted" ? weightedFixture() : null;
      const userIds = weighted ? weighted.userIds : creatorAndCandidates();
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
            : "The pending highest-weight user stays excluded; the next two exact weighted candidates are invited, and a repeated scheduled pass changes zero records.",
        context: {
          eventId,
          userIds,
          weighted: Boolean(weighted),
          ...(weighted || {}),
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
                { _id: { $in: weighted ? weighted.edges.map(edge => edge._id) : [] } },
                { pairKey: { $in: weighted ? weighted.edges.map(edge => edge.pairKey) : [] } }
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
      if (context.weighted) {
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
        autoInviter: true,
        ownerUserId: context.creatorUserId || context.userIds[0],
        creatorUserId: context.creatorUserId || context.userIds[0],
        capacityMin: 1,
        capacityMax: variation === "open-spots" ? 3 : variation === "weighted" ? 4 : 1,
        capacityTotal: variation === "open-spots" ? 3 : variation === "weighted" ? 4 : 1,
        acceptedMembers: 1,
        pendingMembers: variation === "weighted" ? 1 : 0,
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
      if (variation === "weighted") {
        initialMembers.push({
          _id: context.reservedMemberId,
          syncKey: context.reservedMemberId,
          ownerType: "event",
          ownerId: eventId,
          userId: context.reservedUserId,
          role: "Member",
          status: "pending",
          requestKind: "invite",
          pendingSource: "fixture-existing-invite",
          actionAtIso: now,
          createdDate: now,
          createdUser: F.FIXTURE_ACTOR,
          updatedDate: now,
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
          role: member.role,
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
      if (!context.weighted) {
        return result;
      }

      const sorted = values => [...(values || [])].sort();
      const same = (left, right) => JSON.stringify(sorted(left)) === JSON.stringify(sorted(right));
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
      const outboxRecipientUserIds = sorted(
        outboxDocuments.flatMap(item => item.recipientUserIds || [])
      );
      const bellRecipientUserIds = sorted(
        bellDocuments.map(item => item.recipientUserId)
      );
      const exactInvitees = same(invitedUserIds, expectedInvitees);
      const exactMarker = Boolean(marker) && same(marker.userIds, expectedInvitees);
      const exactOutboxRecipients = same(outboxRecipientUserIds, expectedInvitees);
      const exactBellRecipients = same(bellRecipientUserIds, expectedInvitees);
      const reservedInvitePreserved = Boolean(
        reservedMember
        && reservedMember.status === "pending"
        && reservedMember.requestKind === "invite"
      );
      const firstPassComplete =
        exactInvitees
        && unexpectedlyInvitedUserIds.length === 0
        && reservedInvitePreserved
        && exactMarker
        && exactOutboxRecipients
        && exactBellRecipients;
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
      const baseline = context.weightedBaseline || null;
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
      const rule = F.requireRule(job);
      const repeatedPassObserved = Boolean(
        baseline
        && rule.runState
        && rule.runState.lastRunCount === 0
      );
      return {
        ...result,
        expectedInviteeUserIds: expectedInvitees,
        expectedExcludedUserIds: expectedExcluded,
        invitedUserIds,
        unexpectedlyInvitedUserIds,
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
