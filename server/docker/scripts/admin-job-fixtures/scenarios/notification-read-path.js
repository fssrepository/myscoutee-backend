/* global AdminJobFixture, EJSON */
(() => {
  "use strict";
  const F = AdminJobFixture;
  const job = "notification-read-path";
  const senderUserId = F.fixtureId(job, "sender");
  const recipientUserId = F.fixtureId(job, "recipient");
  const secondRecipientUserId = F.fixtureId(job, "recipient-two");
  const mutedRecipientUserId = F.fixtureId(job, "recipient-muted");
  const chatId = F.fixtureId(job, "chat");
  const eventId = F.fixtureId(job, "event");
  const subEventId = F.fixtureId(job, "sub-event");
  const groupId = F.fixtureId(job, "group");
  const groupOwnerId = F.fixtureId(job, "group-owner");
  const controlNotificationId = F.fixtureId(job, "preexisting-unread-control");
  const controlNotificationSyncKey = F.fixtureId(job, "preexisting-unread-control-sync");
  const controlSourceId = F.fixtureId(job, "preexisting-unread-source");
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

  function recipientProfiles(variation) {
    const recipients = [
      {
        key: "recipient",
        userId: recipientUserId,
        name: "Notification fixture recipient",
        initials: "NR",
        muted: false,
        notificationsEnabled: true
      }
    ];
    if (variation === "group-chat-audience") {
      recipients.push(
        {
          key: "recipient-two",
          userId: secondRecipientUserId,
          name: "Notification fixture second recipient",
          initials: "N2",
          muted: false,
          notificationsEnabled: true
        },
        {
          key: "recipient-muted",
          userId: mutedRecipientUserId,
          name: "Notification fixture muted recipient",
          initials: "NM",
          muted: true,
          notificationsEnabled: false
        }
      );
    }
    return recipients;
  }

  function clone(value) {
    return EJSON.parse(EJSON.stringify(value));
  }

  F.run({
    job,
    variations: ["group-chat", "group-chat-audience", "preexisting-unread"],
    build(variation) {
      const recipients = recipientProfiles(variation);
      const recipientUserIds = recipients.map(item => item.userId);
      const allUserIds = [senderUserId, ...recipientUserIds];
      const hasPreexistingUnread = variation === "preexisting-unread";
      const chatDocumentIds = [
        F.fixtureId(job, "chat-sender"),
        ...recipients.map(item => F.fixtureId(job, `chat-${item.key}`))
      ];
      return {
        expected: variation === "group-chat-audience"
          ? "The wrapper posts one message as the sender to a four-person group. The real enqueue path must keep exactly all three non-senders in one outbox and create one bell plus one unread chat projection for each, including the muted recipient whose device has push notifications disabled; the sender must receive none."
          : hasPreexistingUnread
            ? "The recipient starts with exactly one unrelated unread control bell and notification counter 1. The real chat enqueue must add exactly one chat outbox and one chat bell, raising the unread/profile counter to 2. Marking only the chat bell read must leave the control bell unread, the counter at 1, the chat unread projection at 1, and a repeated read must preserve the first readAtIso."
            : "The wrapper posts one message through the existing app. The real enqueue path creates exactly one chat outbox item and one bell item for the other participant, never for the sender. Status accepts only the exact unread baseline or the exact API-marked-read state while preserving the group-chat context.",
        next:
          "The wrapper now calls the existing local app once. Run status notification-read-path for the unread baseline, trigger notification-read-path to mark the exact bell read through the API, then repeat status/trigger to verify stable read state and idempotency.",
        context: {
          variation,
          hasPreexistingUnread,
          senderUserId,
          recipientUserId,
          recipientUserIds,
          recipientProfiles: recipients,
          mutedRecipientUserId: variation === "group-chat-audience" ? mutedRecipientUserId : "",
          controlNotificationId: hasPreexistingUnread ? controlNotificationId : "",
          controlNotificationSyncKey: hasPreexistingUnread ? controlNotificationSyncKey : "",
          controlSourceId: hasPreexistingUnread ? controlSourceId : "",
          expectedUnreadBeforeChatRead: hasPreexistingUnread ? 2 : 1,
          expectedUnreadAfterChatRead: hasPreexistingUnread ? 1 : 0,
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
                { _id: { $in: allUserIds } },
                { userId: { $in: allUserIds } }
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
                { _id: { $in: chatDocumentIds } }
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
                { recipientUserId: { $in: allUserIds } }
              ]
            }
          }
        ]
      };
    },
    prepare(variation, context) {
      const now = F.nowIso();
      const participantUserIds = [context.senderUserId, ...context.recipientUserIds];
      const participantCount = participantUserIds.length;
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
      const sender = {
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
        activities: clone(baseActivities),
        notificationPreferences: { muted: false },
        createdDate: now,
        createdUser: F.FIXTURE_ACTOR,
        updatedDate: now,
        updatedUser: F.FIXTURE_ACTOR
      };
      const recipients = context.recipientProfiles.map((profile, index) => {
        const activities = clone(baseActivities);
        if (context.hasPreexistingUnread && profile.userId === context.recipientUserId) {
          activities.notifications = 1;
        }
        return {
          _id: profile.userId,
          syncKey: profile.userId,
          userId: profile.userId,
          name: profile.name,
          initials: profile.initials,
          gender: index % 2 === 0 ? "woman" : "man",
          status: "A",
          profileStatus: "public",
          profileFormVersion: 1,
          completion: 100,
          devices: profile.notificationsEnabled
            ? []
            : [{
                deviceId: F.fixtureId(job, "muted-device"),
                platform: "web",
                firebaseToken: F.fixtureId(job, "muted-disabled-token"),
                notificationsEnabled: false,
                lastRegisteredAtIso: now,
                lastSeenAtIso: now
              }],
          activities,
          notificationPreferences: { muted: profile.muted },
          createdDate: now,
          createdUser: F.FIXTURE_ACTOR,
          updatedDate: now,
          updatedUser: F.FIXTURE_ACTOR
        };
      });
      F.collection("users").insertMany([sender, ...recipients]);
      if (context.hasPreexistingUnread) {
        F.collection("userNotifications").insertOne({
          _id: context.controlNotificationId,
          syncKey: context.controlNotificationSyncKey,
          outboxId: null,
          recipientUserId: context.recipientUserId,
          kind: "fixture-control",
          category: "user",
          title: "Unrelated fixture notification",
          message: "This unread control must survive the chat-bell read.",
          senderUserId: null,
          actionPath: "/game?fixtureControl=preexisting-unread",
          sourceType: "fixture-control",
          sourceId: context.controlSourceId,
          payload: {
            fixture: "notification-read-path",
            control: "preexisting-unread"
          },
          readAtIso: null,
          createdDate: now,
          createdUser: F.FIXTURE_ACTOR,
          updatedDate: now,
          updatedUser: F.FIXTURE_ACTOR
        });
      }
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
        capacityMin: participantCount,
        capacityMax: participantCount,
        capacityTotal: participantCount,
        acceptedMembers: participantCount,
        pendingMembers: 0,
        subEvents: [{
          id: context.subEventId,
          name: "Notification fixture stage",
          capacityMin: participantCount,
          capacityMax: participantCount,
          membersAccepted: participantCount,
          membersPending: 0,
          stageStatus: "A",
          groups: [{
            id: context.groupId,
            name: "Notification fixture group",
            capacityMin: participantCount,
            capacityMax: participantCount,
            source: "fixture"
          }]
        }],
        createdDate: now,
        createdUser: F.FIXTURE_ACTOR,
        updatedDate: now,
        updatedUser: F.FIXTURE_ACTOR
      });
      const memberProfiles = [
        { key: "sender", userId: context.senderUserId },
        ...context.recipientProfiles.map(profile => ({
          key: profile.key,
          userId: profile.userId
        }))
      ];
      F.collection("activityMembers").insertMany(memberProfiles.map(profile => ({
          _id: F.fixtureId(job, `member-${profile.key}`),
          syncKey: F.fixtureId(job, `member-${profile.key}`),
          ownerType: "group",
          ownerId: context.groupOwnerId,
          userId: profile.userId,
          role: "Member",
          status: "accepted",
          actionAtIso: now,
          createdDate: now,
          createdUser: F.FIXTURE_ACTOR,
          updatedDate: now,
          updatedUser: F.FIXTURE_ACTOR
        })));
      const chatProfiles = [
        { key: "sender", userId: context.senderUserId, avatar: "NR" },
        ...context.recipientProfiles.map(profile => ({
          key: profile.key,
          userId: profile.userId,
          avatar: "NS"
        }))
      ];
      F.collection("chats").insertMany(chatProfiles.map(profile => ({
          _id: F.fixtureId(job, `chat-${profile.key}`),
          id: context.chatId,
          ownerUserId: profile.userId,
          avatar: profile.avatar,
          title: "Notification fixture group",
          lastMessage: "",
          lastSenderId: "",
          memberIds: participantUserIds,
          unread: 0,
          dateIso: now,
          channelType: "groupSubEvent",
          ownerId: context.groupOwnerId,
          eventId: context.eventId,
          subEventId: context.subEventId,
          groupId: context.groupId
        })));
    },
    afterPrepare(variation, context) {
      F.printObject({
        apiAction: "The shell wrapper posts exactly one chat message through the already-running local app.",
        senderUserId: context.senderUserId,
        recipientUserId: context.recipientUserId,
        recipientUserIds: context.recipientUserIds,
        mutedRecipientUserId: context.mutedRecipientUserId || null,
        controlNotificationId: context.controlNotificationId || null,
        controlSourceId: context.controlSourceId || null,
        expectedUnreadBeforeChatRead: context.expectedUnreadBeforeChatRead,
        expectedUnreadAfterChatRead: context.expectedUnreadAfterChatRead,
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
      const controlNotifications = context.hasPreexistingUnread
        ? F.collection("userNotifications")
            .find({
              _id: context.controlNotificationId,
              syncKey: context.controlNotificationSyncKey,
              recipientUserId: context.recipientUserId
            })
            .toArray()
        : [];
      const messages = F.collection("chatMessages")
        .find({ chatId: context.chatId })
        .sort({ sentAtIso: 1, _id: 1 })
        .toArray();
      const chatCopies = F.collection("chats")
        .find({ id: context.chatId })
        .sort({ ownerUserId: 1 })
        .toArray();
      const sender = F.collection("users").findOne({ userId: context.senderUserId });
      const recipientUserIds = context.recipientUserIds || [context.recipientUserId];
      const profiles = context.recipientProfiles || [{
        key: "recipient",
        userId: context.recipientUserId,
        muted: false,
        notificationsEnabled: true
      }];
      const outbox = outboxes[0];
      const senderCopy = chatCopies.find(item => item.ownerUserId === context.senderUserId);
      const uniqueNotificationSyncKeys = new Set(
        notifications.map(item => F.safeText(item.syncKey)).filter(Boolean)
      );
      const recipientRows = profiles.map(profile => {
        const user = F.collection("users").findOne({ userId: profile.userId });
        const recipientNotifications = notifications.filter(
          item => item.recipientUserId === profile.userId
        );
        const notification = recipientNotifications[0];
        const notificationReadAtIso = F.safeText(notification && notification.readAtIso);
        const notificationRead = Boolean(notificationReadAtIso);
        const expectsControl = context.hasPreexistingUnread
          && profile.userId === context.recipientUserId;
        const controlNotification = expectsControl ? controlNotifications[0] : null;
        const controlUnread = Boolean(
          controlNotification
            && controlNotification.readAtIso == null
        );
        const expectedNotificationUnread = (notificationRead ? 0 : 1)
          + (expectsControl ? 1 : 0);
        const expectedTotalNotificationCount = expectsControl ? 2 : 1;
        const totalDocumentCount = F.collection("userNotifications").countDocuments({
          recipientUserId: profile.userId
        });
        const unreadDocumentCount = F.collection("userNotifications").countDocuments({
          recipientUserId: profile.userId,
          $or: [
            { readAtIso: { $exists: false } },
            { readAtIso: null }
          ]
        });
        const storedNotificationCounter = numberAt(user, ["activities", "notifications"]);
        const chatCopy = chatCopies.find(item => item.ownerUserId === profile.userId);
        const muted = Boolean(
          user
            && user.notificationPreferences
            && user.notificationPreferences.muted
        );
        const disabledPushDevice = Boolean(
          user
            && (user.devices || []).some(device => device && device.notificationsEnabled === false)
        );
        const exactOutboxBellLink = Boolean(
          outbox
            && notification
            && notification.outboxId === F.safeText(outbox._id)
            && notification.syncKey === `${outbox.syncKey}:${profile.userId}`
        );
        const notificationContextValid = Boolean(
          recipientNotifications.length === 1
            && notification
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
        const countersValid = unreadDocumentCount === expectedNotificationUnread
          && storedNotificationCounter === expectedNotificationUnread
          && numberAt(user, ["activities", "chats"]) === 1
          && numberAt(user, ["activities", "chat", "all"]) === 1
          && numberAt(user, ["activities", "chat", "group"]) === 1;
        const chatValid = Boolean(chatCopy)
          && Number(chatCopy.unread) === 1;
        const controlNotificationValid = !expectsControl || Boolean(
          controlNotifications.length === 1
            && controlUnread
            && controlNotification.outboxId == null
            && controlNotification.kind === "fixture-control"
            && controlNotification.category === "user"
            && controlNotification.sourceType === "fixture-control"
            && controlNotification.sourceId === context.controlSourceId
            && controlNotification.actionPath === "/game?fixtureControl=preexisting-unread"
            && controlNotification.payload
            && controlNotification.payload.fixture === "notification-read-path"
            && controlNotification.payload.control === "preexisting-unread"
            && F.safeText(controlNotification.createdDate)
            && (!outbox || F.safeText(controlNotification.createdDate) <= F.safeText(outbox.createdDate))
        );
        const exactNotificationSet = totalDocumentCount === expectedTotalNotificationCount;
        const preferencesValid = muted === Boolean(profile.muted)
          && (profile.notificationsEnabled !== false || disabledPushDevice);
        return {
          userId: profile.userId,
          expectedMuted: Boolean(profile.muted),
          muted,
          expectedNotificationsEnabled: profile.notificationsEnabled !== false,
          disabledPushDevice,
          readState: notificationRead ? "read" : "unread",
          chatNotificationId: notification && notification._id,
          chatNotificationReadAtIso: notificationReadAtIso || null,
          unreadDocumentCount,
          expectedUnreadDocumentCount: expectedNotificationUnread,
          totalDocumentCount,
          expectedTotalDocumentCount: expectedTotalNotificationCount,
          storedNotificationCounter,
          storedChatCounters: {
            chats: numberAt(user, ["activities", "chats"]),
            all: numberAt(user, ["activities", "chat", "all"]),
            group: numberAt(user, ["activities", "chat", "group"])
          },
          chatUnread: Number(chatCopy && chatCopy.unread),
          notification: notification && {
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
            payload: notification.payload
          },
          exactOutboxBellLink,
          notificationContextValid,
          countersValid,
          chatValid,
          controlNotification: controlNotification && {
            id: controlNotification._id,
            syncKey: controlNotification.syncKey,
            outboxId: controlNotification.outboxId,
            recipientUserId: controlNotification.recipientUserId,
            kind: controlNotification.kind,
            category: controlNotification.category,
            readAtIso: controlNotification.readAtIso,
            actionPath: controlNotification.actionPath,
            sourceType: controlNotification.sourceType,
            sourceId: controlNotification.sourceId,
            payload: controlNotification.payload,
            createdDate: controlNotification.createdDate
          },
          controlNotificationValid,
          exactNotificationSet,
          preferencesValid,
          valid: exactOutboxBellLink
            && notificationContextValid
            && countersValid
            && chatValid
            && controlNotificationValid
            && exactNotificationSet
            && preferencesValid
        };
      });
      const exactOutboxAudience = outboxes.length === 1
        && sameIds(outbox.recipientUserIds, recipientUserIds);
      const exactBellAudience = notifications.length === recipientUserIds.length
        && sameIds(
          notifications.map(item => item.recipientUserId),
          recipientUserIds
        )
        && !notifications.some(item => item.recipientUserId === context.senderUserId);
      const exactOutboxBellLinks = recipientRows.every(row => row.exactOutboxBellLink);
      const expectedChatOwnerIds = [context.senderUserId, ...recipientUserIds];
      const chatContextValid = chatCopies.length === expectedChatOwnerIds.length
        && sameIds(
          chatCopies.map(item => item.ownerUserId),
          expectedChatOwnerIds
        )
        && chatCopies.every(item =>
          item.channelType === "groupSubEvent"
            && item.eventId === context.eventId
            && item.subEventId === context.subEventId
            && item.groupId === context.groupId
            && item.ownerId === context.groupOwnerId
            && sameIds(item.memberIds, expectedChatOwnerIds)
        )
        && Number(senderCopy && senderCopy.unread) === 0
        && recipientRows.every(row => row.chatValid);
      const countersValid = numberAt(sender, ["activities", "notifications"]) === 0
        && recipientRows.every(row => row.countersValid);
      const preferencesValid = recipientRows.every(row => row.preferencesValid);
      const mutedAudienceValid = !context.mutedRecipientUserId
        || recipientRows.some(row =>
          row.userId === context.mutedRecipientUserId
            && row.muted
            && row.disabledPushDevice
            && row.notification
        );
      const noDuplicates = outboxes.length === 1
        && notifications.length === recipientUserIds.length
        && uniqueNotificationSyncKeys.size === notifications.length;
      const messageValid = messages.length === 1
        && messages[0].senderAvatar
        && messages[0].senderAvatar.id === context.senderUserId
        && messages[0].text === context.messageText;
      const deployment = F.collection("deploymentConfigurations").findOne({
        _id: "deployment-configuration"
      });
      const primaryRecipientRow = recipientRows.find(
        row => row.userId === context.recipientUserId
      );
      const preexistingUnreadValid = !context.hasPreexistingUnread || Boolean(
        primaryRecipientRow
          && primaryRecipientRow.controlNotificationValid
          && primaryRecipientRow.exactNotificationSet
          && primaryRecipientRow.unreadDocumentCount
            === (primaryRecipientRow.readState === "read" ? 1 : 2)
          && primaryRecipientRow.storedNotificationCounter
            === (primaryRecipientRow.readState === "read" ? 1 : 2)
          && primaryRecipientRow.chatUnread === 1
      );

      return {
        exactAudience: {
          expectedRecipientUserIds: recipientUserIds,
          outboxRecipientUserIds: outbox && outbox.recipientUserIds,
          bellRecipientUserIds: notifications.map(item => item.recipientUserId),
          senderExcluded: !notifications.some(item => item.recipientUserId === context.senderUserId),
          mutedRecipientUserId: context.mutedRecipientUserId || null,
          mutedRecipientStillGetsBell: mutedAudienceValid,
          valid: exactOutboxAudience && exactBellAudience && mutedAudienceValid
        },
        deduplication: {
          outboxCount: outboxes.length,
          bellCount: notifications.length,
          uniqueNotificationSyncKeyCount: uniqueNotificationSyncKeys.size,
          exactOutboxBellLinks,
          valid: noDuplicates && exactOutboxBellLinks
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
        bellReadModels: recipientRows,
        preexistingUnreadControl: {
          enabled: Boolean(context.hasPreexistingUnread),
          recipientUserId: context.hasPreexistingUnread ? context.recipientUserId : null,
          controlNotificationId: context.controlNotificationId || null,
          controlSourceId: context.controlSourceId || null,
          chatNotificationId: primaryRecipientRow
            ? primaryRecipientRow.chatNotificationId
            : null,
          chatNotificationReadAtIso: primaryRecipientRow
            ? primaryRecipientRow.chatNotificationReadAtIso
            : null,
          chatReadState: primaryRecipientRow ? primaryRecipientRow.readState : null,
          controlReadAtIso: primaryRecipientRow && primaryRecipientRow.controlNotification
            ? primaryRecipientRow.controlNotification.readAtIso
            : null,
          expectedUnreadCount: primaryRecipientRow
            ? primaryRecipientRow.expectedUnreadDocumentCount
            : null,
          actualUnreadCount: primaryRecipientRow
            ? primaryRecipientRow.unreadDocumentCount
            : null,
          storedNotificationCounter: primaryRecipientRow
            ? primaryRecipientRow.storedNotificationCounter
            : null,
          chatUnread: primaryRecipientRow ? primaryRecipientRow.chatUnread : null,
          readAtIsoStabilityKey: primaryRecipientRow
            ? primaryRecipientRow.chatNotificationReadAtIso
            : null,
          valid: preexistingUnreadValid
        },
        chatReadModel: {
          chatId: context.chatId,
          eventId: context.eventId,
          subEventId: context.subEventId,
          groupId: context.groupId,
          channelType: "groupSubEvent",
          senderUnread: Number(senderCopy && senderCopy.unread),
          recipients: recipientRows.map(row => ({
            userId: row.userId,
            unread: row.chatUnread,
            storedChatCounters: row.storedChatCounters
          })),
          contextValid: chatContextValid
        },
        messageCount: messages.length,
        databaseCheck: {
          messageValid,
          countersValid,
          preferencesValid,
          overallPass: exactOutboxAudience
            && exactBellAudience
            && exactOutboxBellLinks
            && noDuplicates
            && recipientRows.every(row => row.notificationContextValid)
            && chatContextValid
            && countersValid
            && preferencesValid
            && mutedAudienceValid
            && preexistingUnreadValid
            && messageValid
        }
      };
    }
  });
})();
