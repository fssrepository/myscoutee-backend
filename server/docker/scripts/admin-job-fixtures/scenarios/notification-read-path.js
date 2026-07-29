/* global AdminJobFixture, EJSON */
(() => {
  "use strict";
  const F = AdminJobFixture;
  const job = "notification-read-path";
  const senderUserId = F.fixtureId(job, "sender");
  const recipientUserId = F.fixtureId(job, "recipient");
  const chatId = F.fixtureId(job, "chat");
  const eventId = F.fixtureId(job, "event");
  const subEventId = F.fixtureId(job, "sub-event");
  const groupId = F.fixtureId(job, "group");
  const groupOwnerId = F.fixtureId(job, "group-owner");
  const messageText = "Admin fixture notification read path";

  function numberAt(value, path) {
    let current = value;
    for (const key of path) {
      if (current == null || typeof current !== "object") {
        return 0;
      }
      current = current[key];
    }
    const normalized = Number(current);
    return Number.isFinite(normalized) ? normalized : 0;
  }

  function sameIds(actual, expected) {
    const normalizedActual = [...new Set((actual || []).map(F.safeText).filter(Boolean))].sort();
    const normalizedExpected = [...new Set((expected || []).map(F.safeText).filter(Boolean))].sort();
    return EJSON.stringify(normalizedActual) === EJSON.stringify(normalizedExpected);
  }

  F.run({
    job,
    variations: ["group-chat"],
    build() {
      return {
        expected:
          "The wrapper posts one message through the existing app. The real enqueue path creates exactly one chat outbox item and one bell item for the other participant, never for the sender. Status accepts only the exact unread baseline or the exact API-marked-read state while preserving the group-chat context.",
        next:
          "The wrapper now calls the existing local app once. Run status notification-read-path for the unread baseline, trigger notification-read-path to mark the exact bell read through the API, then repeat status/trigger to verify stable read state and idempotency.",
        context: {
          senderUserId,
          recipientUserId,
          chatId,
          eventId,
          subEventId,
          groupId,
          groupOwnerId,
          messageText
        },
        specs: [
          {
            collection: "users",
            selector: {
              $or: [
                { _id: { $in: [senderUserId, recipientUserId] } },
                { userId: { $in: [senderUserId, recipientUserId] } }
              ]
            }
          },
          {
            collection: "events",
            selector: { sourceId: eventId }
          },
          {
            collection: "chats",
            selector: {
              $or: [
                { id: chatId },
                { _id: { $in: [F.fixtureId(job, "chat-sender"), F.fixtureId(job, "chat-recipient")] } }
              ]
            }
          },
          {
            collection: "chatMessages",
            selector: { chatId }
          },
          {
            collection: "activityMembers",
            selector: { ownerType: "group", ownerId: groupOwnerId }
          },
          {
            collection: "notificationOutbox",
            selector: {
              $or: [
                { entityType: "chat", entityId: chatId },
                { "payload.chatId": chatId }
              ]
            }
          },
          {
            collection: "userNotifications",
            selector: {
              $or: [
                { sourceType: "chat", sourceId: chatId },
                { "payload.chatId": chatId },
                { recipientUserId: { $in: [senderUserId, recipientUserId] } }
              ]
            }
          },
          {
            collection: "notificationRuleConfigs",
            selector: { ruleKey: "notification-outbox" }
          }
        ]
      };
    },
    prepare(variation, context) {
      const now = F.nowIso();
      const baseActivities = {
        game: 0,
        chats: 0,
        invitations: 0,
        events: 0,
        hosting: 0,
        cars: 0,
        accommodation: 0,
        supplies: 0,
        tickets: 0,
        contacts: 0,
        feedback: 0,
        adminJobs: 0,
        adminMetrics: 0,
        notifications: 0,
        chat: {
          all: 0,
          event: 0,
          subEvent: 0,
          group: 0,
          service: 0,
          appSupport: 0
        }
      };
      F.collection("users").insertMany([
        {
          _id: context.senderUserId,
          syncKey: context.senderUserId,
          userId: context.senderUserId,
          name: "Notification fixture sender",
          initials: "NS",
          gender: "man",
          status: "A",
          profileStatus: "public",
          profileFormVersion: 1,
          completion: 100,
          devices: [],
          activities: baseActivities,
          notificationPreferences: { muted: false },
          createdDate: now,
          createdUser: F.FIXTURE_ACTOR,
          updatedDate: now,
          updatedUser: F.FIXTURE_ACTOR
        },
        {
          _id: context.recipientUserId,
          syncKey: context.recipientUserId,
          userId: context.recipientUserId,
          name: "Notification fixture recipient",
          initials: "NR",
          gender: "woman",
          status: "A",
          profileStatus: "public",
          profileFormVersion: 1,
          completion: 100,
          devices: [],
          activities: EJSON.parse(EJSON.stringify(baseActivities)),
          notificationPreferences: { muted: false },
          createdDate: now,
          createdUser: F.FIXTURE_ACTOR,
          updatedDate: now,
          updatedUser: F.FIXTURE_ACTOR
        }
      ]);
      F.collection("events").insertOne({
        _id: context.eventId,
        syncKey: context.eventId,
        sourceId: context.eventId,
        ownerUserId: context.senderUserId,
        creatorUserId: context.senderUserId,
        admins: [context.senderUserId],
        title: "Notification fixture event",
        status: "A",
        published: true,
        capacityMin: 2,
        capacityMax: 2,
        capacityTotal: 2,
        acceptedMembers: 2,
        pendingMembers: 0,
        subEvents: [{
          id: context.subEventId,
          name: "Notification fixture stage",
          capacityMin: 2,
          capacityMax: 2,
          membersAccepted: 2,
          membersPending: 0,
          stageStatus: "A",
          groups: [{
            id: context.groupId,
            name: "Notification fixture group",
            capacityMin: 2,
            capacityMax: 2,
            source: "fixture"
          }]
        }],
        createdDate: now,
        createdUser: F.FIXTURE_ACTOR,
        updatedDate: now,
        updatedUser: F.FIXTURE_ACTOR
      });
      F.collection("activityMembers").insertMany([
        {
          _id: F.fixtureId(job, "member-sender"),
          syncKey: F.fixtureId(job, "member-sender"),
          ownerType: "group",
          ownerId: context.groupOwnerId,
          userId: context.senderUserId,
          role: "Member",
          status: "accepted",
          actionAtIso: now,
          createdDate: now,
          createdUser: F.FIXTURE_ACTOR,
          updatedDate: now,
          updatedUser: F.FIXTURE_ACTOR
        },
        {
          _id: F.fixtureId(job, "member-recipient"),
          syncKey: F.fixtureId(job, "member-recipient"),
          ownerType: "group",
          ownerId: context.groupOwnerId,
          userId: context.recipientUserId,
          role: "Member",
          status: "accepted",
          actionAtIso: now,
          createdDate: now,
          createdUser: F.FIXTURE_ACTOR,
          updatedDate: now,
          updatedUser: F.FIXTURE_ACTOR
        }
      ]);
      F.collection("chats").insertMany([
        {
          _id: F.fixtureId(job, "chat-sender"),
          id: context.chatId,
          ownerUserId: context.senderUserId,
          avatar: "NR",
          title: "Notification fixture group",
          lastMessage: "",
          lastSenderId: "",
          memberIds: [context.senderUserId, context.recipientUserId],
          unread: 0,
          dateIso: now,
          channelType: "groupSubEvent",
          ownerId: context.groupOwnerId,
          eventId: context.eventId,
          subEventId: context.subEventId,
          groupId: context.groupId
        },
        {
          _id: F.fixtureId(job, "chat-recipient"),
          id: context.chatId,
          ownerUserId: context.recipientUserId,
          avatar: "NS",
          title: "Notification fixture group",
          lastMessage: "",
          lastSenderId: "",
          memberIds: [context.senderUserId, context.recipientUserId],
          unread: 0,
          dateIso: now,
          channelType: "groupSubEvent",
          ownerId: context.groupOwnerId,
          eventId: context.eventId,
          subEventId: context.subEventId,
          groupId: context.groupId
        }
      ]);
    },
    afterPrepare(variation, context) {
      F.printObject({
        apiAction: "The shell wrapper posts exactly one chat message through the already-running local app.",
        senderUserId: context.senderUserId,
        recipientUserId: context.recipientUserId,
        chatId: context.chatId,
        eventId: context.eventId,
        subEventId: context.subEventId,
        groupId: context.groupId
      });
    },
    status(context, snapshot) {
      if (!snapshot) {
        return {
          instruction: "Prepare group-chat first; status needs the snapshotted fixture context."
        };
      }
      const outboxes = F.collection("notificationOutbox")
        .find({
          notificationType: "chat-message",
          entityType: "chat",
          entityId: context.chatId,
          createdDate: { $gte: snapshot.preparedAtIso }
        })
        .sort({ createdDate: 1, _id: 1 })
        .toArray();
      const outboxIds = outboxes.map(item => F.safeText(item._id)).filter(Boolean);
      const notifications = outboxIds.length === 0
        ? []
        : F.collection("userNotifications")
            .find({ outboxId: { $in: outboxIds } })
            .sort({ createdDate: 1, _id: 1 })
            .toArray();
      const messages = F.collection("chatMessages")
        .find({ chatId: context.chatId })
        .sort({ sentAtIso: 1, _id: 1 })
        .toArray();
      const chatCopies = F.collection("chats")
        .find({ id: context.chatId })
        .sort({ ownerUserId: 1 })
        .toArray();
      const sender = F.collection("users").findOne({ userId: context.senderUserId });
      const recipient = F.collection("users").findOne({ userId: context.recipientUserId });
      const recipientUnreadDocuments = F.collection("userNotifications").countDocuments({
        recipientUserId: context.recipientUserId,
        $or: [
          { readAtIso: { $exists: false } },
          { readAtIso: null }
        ]
      });
      const recipientStoredUnread = numberAt(recipient, ["activities", "notifications"]);
      const outbox = outboxes[0];
      const notification = notifications[0];
      const notificationReadAtIso = F.safeText(notification && notification.readAtIso);
      const notificationRead = Boolean(notificationReadAtIso);
      const expectedNotificationUnread = notificationRead ? 0 : 1;
      const recipientCopy = chatCopies.find(item => item.ownerUserId === context.recipientUserId);
      const senderCopy = chatCopies.find(item => item.ownerUserId === context.senderUserId);
      const uniqueNotificationSyncKeys = new Set(
        notifications.map(item => F.safeText(item.syncKey)).filter(Boolean)
      );
      const exactOutboxRecipient = outboxes.length === 1
        && sameIds(outbox.recipientUserIds, [context.recipientUserId]);
      const exactBellRecipient = notifications.length === 1
        && notification.recipientUserId === context.recipientUserId
        && !notifications.some(item => item.recipientUserId === context.senderUserId);
      const exactOutboxBellLink = Boolean(
        outbox
          && notification
          && notification.outboxId === F.safeText(outbox._id)
          && notification.syncKey === `${outbox.syncKey}:${context.recipientUserId}`
      );
      const notificationContextValid = Boolean(
        notification
          && notification.kind === "chat-message"
          && notification.category === "chat"
          && notification.sourceType === "chat"
          && notification.sourceId === context.chatId
          && notification.senderUserId === context.senderUserId
          && (
            notification.readAtIso == null
            || (typeof notification.readAtIso === "string" && notificationReadAtIso.length > 0)
          )
          && notification.actionPath === `/game?chatId=${context.chatId}`
          && notification.payload
          && notification.payload.chatId === context.chatId
          && notification.payload.senderId === context.senderUserId
          && F.safeText(notification.payload.messageId)
      );
      const chatContextValid = chatCopies.length === 2
        && chatCopies.every(item =>
          item.channelType === "groupSubEvent"
            && item.eventId === context.eventId
            && item.subEventId === context.subEventId
            && item.groupId === context.groupId
            && item.ownerId === context.groupOwnerId
        )
        && Number(recipientCopy && recipientCopy.unread) === 1
        && Number(senderCopy && senderCopy.unread) === 0;
      const countersValid = recipientUnreadDocuments === expectedNotificationUnread
        && recipientStoredUnread === expectedNotificationUnread
        && numberAt(recipient, ["activities", "chats"]) === 1
        && numberAt(recipient, ["activities", "chat", "all"]) === 1
        && numberAt(recipient, ["activities", "chat", "group"]) === 1
        && numberAt(sender, ["activities", "notifications"]) === 0;
      const noDuplicates = outboxes.length === 1
        && notifications.length === 1
        && uniqueNotificationSyncKeys.size === notifications.length;
      const messageValid = messages.length === 1
        && messages[0].senderAvatar
        && messages[0].senderAvatar.id === context.senderUserId
        && messages[0].text === context.messageText;
      const deployment = F.collection("deploymentConfigurations").findOne({
        _id: "deployment-configuration"
      });

      return {
        exactRecipient: {
          expected: context.recipientUserId,
          outboxRecipientUserIds: outbox && outbox.recipientUserIds,
          bellRecipientUserIds: notifications.map(item => item.recipientUserId),
          senderExcluded: !notifications.some(item => item.recipientUserId === context.senderUserId),
          valid: exactOutboxRecipient && exactBellRecipient
        },
        deduplication: {
          outboxCount: outboxes.length,
          bellCount: notifications.length,
          uniqueNotificationSyncKeyCount: uniqueNotificationSyncKeys.size,
          exactOutboxBellLink,
          valid: noDuplicates && exactOutboxBellLink
        },
        outbox: outbox && {
          id: outbox._id,
          syncKey: outbox.syncKey,
          status: outbox.status,
          retryCount: outbox.retryCount,
          tokenSuccessCount: outbox.tokenSuccessCount,
          tokenFailureCount: outbox.tokenFailureCount,
          pendingCounterTracked: outbox.pendingCounterTracked,
          firebaseActive: Boolean(deployment && deployment.firebase && deployment.firebase.active),
          workerNote: deployment && deployment.firebase && deployment.firebase.active
            ? "The existing worker may move this no-token item to sent with zero token successes."
            : "Firebase is disabled, so pending is expected; bell materialization occurs during enqueue before push delivery."
        },
        bellReadModel: notification && {
          id: notification._id,
          outboxId: notification.outboxId,
          syncKey: notification.syncKey,
          recipientUserId: notification.recipientUserId,
          senderUserId: notification.senderUserId,
          kind: notification.kind,
          category: notification.category,
          readAtIso: notification.readAtIso,
          actionPath: notification.actionPath,
          sourceType: notification.sourceType,
          sourceId: notification.sourceId,
          payload: notification.payload,
          readState: notificationRead ? "read" : "unread",
          unreadDocumentCount: recipientUnreadDocuments,
          storedNotificationCounter: recipientStoredUnread,
          contextValid: notificationContextValid
        },
        chatReadModel: {
          chatId: context.chatId,
          eventId: context.eventId,
          subEventId: context.subEventId,
          groupId: context.groupId,
          channelType: "groupSubEvent",
          senderUnread: Number(senderCopy && senderCopy.unread),
          recipientUnread: Number(recipientCopy && recipientCopy.unread),
          recipientStoredChatCounters: {
            chats: numberAt(recipient, ["activities", "chats"]),
            all: numberAt(recipient, ["activities", "chat", "all"]),
            group: numberAt(recipient, ["activities", "chat", "group"])
          },
          contextValid: chatContextValid
        },
        messageCount: messages.length,
        databaseCheck: {
          messageValid,
          countersValid,
          overallPass: exactOutboxRecipient
            && exactBellRecipient
            && exactOutboxBellLink
            && noDuplicates
            && notificationContextValid
            && chatContextValid
            && countersValid
            && messageValid
        }
      };
    }
  });
})();
