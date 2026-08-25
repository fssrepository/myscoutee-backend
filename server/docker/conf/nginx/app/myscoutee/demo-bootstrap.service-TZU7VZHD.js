import {
  AdminHelpSeedBuilder,
  AdminModerationSeedBuilder,
  AdminMonitoringSeedBuilder,
  AdminNotificationsSeedBuilder,
  AdminParamsSeedBuilder,
  AdminProfileSeedBuilder,
  AdminStatsSeedBuilder,
  SEED_SCHEDULE_REFERENCE_DATE,
  SeedAssetBuilder,
  SeedChatsBuilder,
  SeedEventBuilder,
  SeedEventFeedbackBuilder,
  SeedEventTicketsBuilder,
  SeedEventsBuilder,
  SeedHelpCenterRepository,
  SeedIdeaPostsRepository,
  SeedNotificationsBuilder,
  SeedProfileExperienceBuilder,
  SeedUserBuilder,
  SeedUserImpressionsBuilder,
  SeedUserRatesBuilder,
  demoAssetPlaceholder,
  demoAssetTemplateIds
} from "./chunk-EE3CJV6S.js";
import {
  UserProfileState
} from "./chunk-XQJEDEHI.js";
import {
  APP_STATIC_DATA,
  LocalChatMessageMapper,
  LocalChatThreadMapper,
  LocalUserFilterPreferencesMapper,
  LocalUserRatesMapper
} from "./chunk-BHFMDA67.js";
import {
  ASSET_TYPES,
  ASSET_TYPE_ACCOMMODATION,
  ASSET_TYPE_SUPPLIES,
  ASSET_TYPE_TRANSPORT,
  AppUtils
} from "./chunk-ILMZK7SM.js";
import {
  LocalOperatorRegistryRepository,
  Location
} from "./chunk-J7IJFFQ2.js";
import {
  ACTIVITY_MEMBERS_TABLE_NAME,
  ACTIVITY_RESOURCES_TABLE_NAME,
  ASSETS_TABLE_NAME,
  ASSET_REQUESTS_TABLE_NAME,
  CHATS_TABLE_NAME,
  CHAT_MESSAGES_TABLE_NAME,
  CONTACTS_TABLE_NAME,
  EVENTS_TABLE_NAME,
  EVENT_FEEDBACK_TABLE_NAME,
  EVENT_TICKETS_TABLE_NAME,
  HELP_CENTER_TABLE_NAME,
  IDEA_POSTS_TABLE_NAME,
  LocalMemoryDb,
  NOTIFICATIONS_TABLE_NAME,
  PROFILE_EXPERIENCES_TABLE_NAME,
  SHARE_TOKENS_TABLE_NAME,
  SeedOperatorRegistryBuilder,
  USERS_TABLE_NAME,
  USER_FILTER_PREFERENCES_TABLE_NAME,
  USER_RATES_OUTBOX_TABLE_NAME,
  USER_RATES_TABLE_NAME
} from "./chunk-XQACYBVS.js";
import {
  BootstrapProcessService,
  bootstrapProcessStep
} from "./chunk-B2DKYQGD.js";
import {
  defaultUserGameFilterPreferences
} from "./chunk-6POEHVT7.js";
import {
  APP_INDEXED_DB_KEYS
} from "./chunk-LERGHE7K.js";
import "./chunk-SKAK727J.js";
import {
  Injectable,
  __spreadProps,
  __spreadValues,
  environment,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-XJL7SWH7.js";

// src/app/shared/core/local/seed/repositories/activity-members-seed.repository.ts
var SeedActivityMembersRepository = class _SeedActivityMembersRepository {
  static MAX_BOOTSTRAP_RECORDS = 5e3;
  static MAX_SEEDED_ASSETS_PER_USER = 2;
  static MAX_SEEDED_ASSET_REQUESTS_PER_OWNER = 1;
  static MEMBER_MET_PLACES = [
    "Coffee Social",
    "Workshop",
    "Gallery Evening",
    "Trail Weekend",
    "Game Night"
  ];
  memoryDb = inject(LocalMemoryDb);
  lastSeedToken = "";
  seedDefaults(ownerUserIds, assetsByUserId, seedUsers = []) {
    const state = this.memoryDb.read();
    const users = this.resolveSeedUsers(seedUsers, state[USERS_TABLE_NAME]);
    const normalizedOwnerUserIds = Array.from(new Set((ownerUserIds ?? users.map((user) => user.id)).map((userId) => `${userId ?? ""}`.trim()).filter((userId) => userId.length > 0)));
    const eventsTable = state[EVENTS_TABLE_NAME];
    const currentTable = this.normalizeCollection(state[ACTIVITY_MEMBERS_TABLE_NAME]);
    const seedToken = [
      eventsTable.ids.length,
      currentTable.ids.length,
      Object.keys(currentTable.idsByOwnerKey).length,
      normalizedOwnerUserIds.join("|")
    ].join(":");
    if (this.lastSeedToken === seedToken) {
      return;
    }
    const usersById = new Map(users.map((user) => [user.id, user]));
    const existingOwnerKeys = new Set(Object.entries(currentTable.idsByOwnerKey).filter(([ownerKey, ids]) => ownerKey.length > 0 && ids.some((id) => Boolean(currentTable.byId[id]))).map(([ownerKey]) => ownerKey));
    const desiredOwners = /* @__PURE__ */ new Map();
    const preferredEvents = this.computePreferredEventRecords(eventsTable);
    const explicitUserIdsByEventId = this.buildExplicitSeedMemberUserIdsByEventId();
    for (const eventRecord of preferredEvents) {
      this.setDesiredOwner(desiredOwners, this.buildSeededRecordsForEvent(eventRecord, users, usersById, explicitUserIdsByEventId));
    }
    this.setDesiredOwner(desiredOwners, this.buildSeededHomeSocialBridgeRecords(usersById));
    this.setDesiredOwner(desiredOwners, this.buildSeededTournamentGroupMemberRecords(preferredEvents, desiredOwners));
    for (const userId of normalizedOwnerUserIds) {
      this.setDesiredOwner(desiredOwners, this.buildSeededAssetOwnerRecordsForUser(userId, assetsByUserId?.get(userId) ?? this.readOwnedAssetsByUser(userId, state[ASSETS_TABLE_NAME]), users, usersById));
    }
    const merge = this.mergeDesiredOwners(currentTable, desiredOwners, existingOwnerKeys);
    if (merge.changed) {
      this.memoryDb.write((currentState) => {
        const syncedEvents = this.syncEventSummariesFromMembers(currentState[EVENTS_TABLE_NAME], merge.table);
        return __spreadProps(__spreadValues({}, currentState), {
          [ACTIVITY_MEMBERS_TABLE_NAME]: merge.table,
          [EVENTS_TABLE_NAME]: syncedEvents
        });
      });
    } else {
      const syncedEvents = this.syncEventSummariesFromMembers(eventsTable, currentTable);
      if (syncedEvents !== eventsTable) {
        this.memoryDb.write((currentState) => __spreadProps(__spreadValues({}, currentState), {
          [EVENTS_TABLE_NAME]: syncedEvents
        }));
      }
    }
    const finalTable = merge.changed ? merge.table : currentTable;
    this.lastSeedToken = [
      eventsTable.ids.length,
      finalTable.ids.length,
      Object.keys(finalTable.idsByOwnerKey).length,
      normalizedOwnerUserIds.join("|")
    ].join(":");
  }
  resolveSeedUsers(seedUsers, usersTable) {
    const source = seedUsers.length > 0 ? seedUsers : usersTable.ids.map((id) => usersTable.byId[id]).filter((user) => Boolean(user));
    return source.map((user) => __spreadProps(__spreadValues({}, user), { images: [...user.images ?? []] }));
  }
  setDesiredOwner(desiredOwners, records) {
    for (const record of records) {
      const ownerKey = record.ownerKey.trim();
      if (!ownerKey) {
        continue;
      }
      const bucket = desiredOwners.get(ownerKey) ?? [];
      bucket.push(record);
      desiredOwners.set(ownerKey, bucket);
    }
  }
  mergeDesiredOwners(currentTable, desiredOwners, existingOwnerKeys) {
    let nextById = __spreadValues({}, currentTable.byId);
    let nextIds = [...currentTable.ids];
    let nextIdsByOwnerKey = this.cloneOwnerKeyIndex(currentTable.idsByOwnerKey);
    let changed = false;
    for (const [ownerKey, records] of desiredOwners.entries()) {
      const shouldReplace = ownerKey.startsWith("event:") || ownerKey.startsWith("group:") ? this.ownerNeedsRefresh(currentTable, ownerKey, records) : !existingOwnerKeys.has(ownerKey);
      if (!shouldReplace) {
        continue;
      }
      if (!ownerKey.startsWith("event:") && nextIds.length + records.length > _SeedActivityMembersRepository.MAX_BOOTSTRAP_RECORDS) {
        continue;
      }
      nextById = __spreadValues({}, nextById);
      nextIds = nextIds.filter((id) => {
        const existing = nextById[id];
        if (existing?.ownerKey !== ownerKey) {
          return true;
        }
        delete nextById[id];
        return false;
      });
      nextIdsByOwnerKey = this.cloneOwnerKeyIndex(nextIdsByOwnerKey);
      nextIdsByOwnerKey[ownerKey] = [];
      for (const record of records) {
        nextById[record.id] = this.cloneRecord(record);
        nextIds.push(record.id);
        nextIdsByOwnerKey[ownerKey].push(record.id);
      }
      changed = true;
    }
    return {
      table: {
        byId: nextById,
        ids: nextIds,
        idsByOwnerKey: nextIdsByOwnerKey
      },
      changed
    };
  }
  ownerNeedsRefresh(currentTable, ownerKey, desiredRecords) {
    const currentRecords = (currentTable.idsByOwnerKey[ownerKey] ?? []).map((id) => currentTable.byId[id]).filter((record) => Boolean(record));
    if (currentRecords.length === 0) {
      return desiredRecords.length > 0;
    }
    return currentRecords.filter((record) => record.status === "accepted").length !== desiredRecords.filter((record) => record.status === "accepted").length || currentRecords.filter((record) => record.status === "pending").length !== desiredRecords.filter((record) => record.status === "pending").length || !this.sameUserIds(currentRecords.map((record) => record.userId), desiredRecords.map((record) => record.userId));
  }
  buildSeededRecordsForEvent(record, users, usersById, explicitUserIdsByEventId) {
    const owner = { ownerType: "event", ownerId: record.id };
    const creator = this.resolveDemoUser(record.creatorUserId, users, usersById, record.creatorName, record.creatorInitials, record.creatorCity, record.creatorGender);
    const row = {
      id: record.id,
      type: "events",
      isAdmin: true
    };
    const rowKey = `${row.type}:${row.id}`;
    const explicit = explicitUserIdsByEventId.get(record.id) ?? null;
    const userIds = this.seedMemberUserIdsForEventRecord(record, users, explicit);
    const adminIds = this.normalizeMemberUserIds([record.creatorUserId, ...record.adminIds ?? []]);
    const invitedUserIds = new Set(this.normalizeMemberUserIds(record.invitedMemberUserIds));
    const pendingRequestUserIds = new Set(this.normalizeMemberUserIds(record.pendingRequestMemberUserIds));
    const entries = [
      ...userIds.acceptedMemberUserIds.map((userId) => this.toEntryForUserId(owner, row, rowKey, creator, userId, "accepted", users, usersById, { adminIds })),
      ...userIds.pendingMemberUserIds.map((userId) => this.toEntryForUserId(owner, row, rowKey, creator, userId, "pending", users, usersById, {
        adminIds,
        pendingSource: pendingRequestUserIds.has(userId) && !invitedUserIds.has(userId) ? "member" : "admin",
        requestKind: pendingRequestUserIds.has(userId) && !invitedUserIds.has(userId) ? "join" : "invite"
      }))
    ];
    return entries.map((entry) => this.toRecord(owner, entry));
  }
  seedMemberUserIdsForEventRecord(record, users, explicit) {
    const acceptedTarget = Math.max(0, this.normalizeMemberCount(record.acceptedMembers) ?? 0);
    const pendingTarget = Math.max(0, this.normalizeMemberCount(record.pendingMembers) ?? 0);
    const ownerUserId = record.userId.trim();
    const seedActiveUserId = record.creatorUserId || ownerUserId;
    const seededMemberUserIds = SeedEventBuilder.seededEventMemberIds(record.id, Math.max(acceptedTarget + pendingTarget, acceptedTarget, 1), users, seedActiveUserId);
    const usedUserIds = /* @__PURE__ */ new Set();
    const explicitAcceptedUserIds = explicit ? this.normalizeMemberUserIds(explicit.accepted) : [];
    const explicitPendingUserIds = explicit ? this.normalizeMemberUserIds(explicit.pending).filter((userId) => !explicitAcceptedUserIds.includes(userId)) : [];
    const recordAcceptedUserIds = this.normalizeMemberUserIds(record.acceptedMemberUserIds);
    const recordPendingUserIds = this.normalizeMemberUserIds(record.pendingMemberUserIds);
    const acceptedSource = recordAcceptedUserIds.length > 0 ? recordAcceptedUserIds : explicit ? [
      ...ownerUserId && !explicitPendingUserIds.includes(ownerUserId) && !explicitAcceptedUserIds.includes(ownerUserId) ? [ownerUserId] : [],
      ...explicitAcceptedUserIds
    ] : this.normalizeMemberUserIds(seededMemberUserIds).filter((userId) => userId !== ownerUserId);
    const pendingSource = recordPendingUserIds.length > 0 ? recordPendingUserIds : explicit ? [
      ...explicitPendingUserIds
    ] : seededMemberUserIds;
    return {
      acceptedMemberUserIds: this.collectTargetMemberUserIds(acceptedSource, seededMemberUserIds, acceptedTarget, usedUserIds),
      pendingMemberUserIds: this.collectTargetMemberUserIds(pendingSource, seededMemberUserIds, pendingTarget, usedUserIds)
    };
  }
  toEntryForUserId(owner, row, rowKey, creator, userId, status, users, usersById, options = {}) {
    void owner;
    const user = this.resolveDemoUser(userId, users, usersById);
    const isAdmin = this.normalizeMemberUserIds(options.adminIds).includes(user.id);
    const pendingSource = status === "accepted" ? null : options.pendingSource ?? "admin";
    const requestKind = status === "accepted" ? null : options.requestKind ?? "invite";
    const seed = AppUtils.hashText(`${rowKey}:${user.id}`);
    const metAt = AppUtils.addDays(/* @__PURE__ */ new Date("2026-02-24T12:00:00"), -(seed % 220 + 1));
    const place = _SeedActivityMembersRepository.MEMBER_MET_PLACES[seed % _SeedActivityMembersRepository.MEMBER_MET_PLACES.length] ?? "Demo event";
    const base = {
      id: `${rowKey}:${user.id}`,
      userId: user.id,
      name: user.name,
      initials: user.initials,
      gender: user.gender,
      city: user.city,
      statusText: user.statusText,
      role: row.isAdmin && user.id === creator.id ? "Admin" : "Member",
      status,
      pendingSource,
      requestKind: status === "pending" ? "invite" : null,
      invitedByActiveUser: false,
      invitedByUserId: null,
      metAtIso: AppUtils.toIsoDateTime(metAt),
      actionAtIso: AppUtils.toIsoDateTime(metAt),
      metWhere: place,
      avatarUrl: AppUtils.firstImageUrl(user.images),
      profile: user
    };
    return __spreadProps(__spreadValues({}, base), {
      role: isAdmin ? "Admin" : "Member",
      requestKind,
      pendingSource,
      statusText: status === "accepted" ? base.statusText : requestKind === "join" ? "Waiting for organizer approval." : "Invitation pending.",
      invitedByUserId: requestKind === "invite" ? creator.id : null
    });
  }
  buildSeededHomeSocialBridgeRecords(usersById) {
    const seedGroups = [
      { ownerId: "demo-home-fic-u1-bridge", metWhere: "Coffee Social Bridge", userIds: ["u1", "u2"] },
      { ownerId: "demo-home-fic-u1-candidate", metWhere: "Coffee Social Bridge", userIds: ["u2", "u42"] },
      { ownerId: "demo-home-fic-u4-bridge", metWhere: "Workshop Social Bridge", userIds: ["u4", "u3"] },
      { ownerId: "demo-home-fic-u4-candidate", metWhere: "Workshop Social Bridge", userIds: ["u3", "u43"] },
      { ownerId: "demo-home-fic-u6-bridge", metWhere: "Gallery Social Bridge", userIds: ["u6", "u8"] },
      { ownerId: "demo-home-fic-u6-candidate", metWhere: "Gallery Social Bridge", userIds: ["u8", "u46"] }
    ];
    const records = [];
    for (const group of seedGroups) {
      const owner = { ownerType: "group", ownerId: group.ownerId };
      for (const userId of group.userIds) {
        const user = this.resolveDemoUser(userId, [...usersById.values()], usersById);
        const metAtIso = AppUtils.rebaseDateTime("2026-03-22T18:00:00.000Z", SEED_SCHEDULE_REFERENCE_DATE, environment.bootstrapOffsetInDays) ?? "2026-03-22T18:00:00.000Z";
        records.push(this.toRecord(owner, {
          id: `home-fic-seed:${group.ownerId}:${user.id}`.toLowerCase().replace(/[^a-z0-9:-]+/g, "-"),
          userId: user.id,
          name: user.name,
          initials: user.initials,
          gender: user.gender,
          city: user.city,
          statusText: "Met at event.",
          role: "Member",
          status: "accepted",
          pendingSource: null,
          requestKind: null,
          invitedByActiveUser: false,
          invitedByUserId: null,
          metAtIso,
          actionAtIso: metAtIso,
          metWhere: group.metWhere,
          avatarUrl: user.images?.[0] ?? "",
          profile: user
        }));
      }
    }
    return records;
  }
  buildSeededTournamentGroupMemberRecords(events, desiredOwners) {
    const records = [];
    for (const event of events) {
      const acceptedParentMembers = (desiredOwners.get(`event:${event.id}`) ?? []).filter((member) => member.status === "accepted");
      if (acceptedParentMembers.length === 0) {
        continue;
      }
      for (const subEvent of event.subEvents ?? []) {
        if (subEvent.optional === true) {
          continue;
        }
        const subEventId = `${subEvent.id ?? ""}`.trim();
        const groupsCount = Math.max(0, Math.trunc(Number(subEvent.groupsCount) || 0));
        const groupIds = Array.from({ length: groupsCount }, (_, index) => `${subEventId}-group-${index + 1}`);
        if (!subEventId || groupIds.length === 0) {
          continue;
        }
        acceptedParentMembers.forEach((parentMember, memberIndex) => {
          const groupId = groupIds[memberIndex % groupIds.length];
          const ownerId = `${event.id}:${subEventId}:${groupId}`;
          records.push(__spreadProps(__spreadValues({}, this.cloneRecord(parentMember)), {
            id: `seed-tournament-group-member:${ownerId}:${parentMember.userId}`,
            ownerType: "group",
            ownerId,
            ownerKey: `group:${ownerId}`,
            metWhere: `${event.title} \xB7 ${subEvent.name ?? "Tournament group"}`
          }));
        });
      }
    }
    return records;
  }
  buildSeededAssetOwnerRecordsForUser(ownerUserId, assets, users, usersById) {
    return assets.slice(0, _SeedActivityMembersRepository.MAX_SEEDED_ASSETS_PER_USER).flatMap((asset) => this.buildSeededEntriesForAsset(ownerUserId, asset, users, usersById).map((entry) => this.toRecord({ ownerType: "asset", ownerId: asset.id }, entry)));
  }
  buildSeededEntriesForAsset(ownerUserId, asset, users, usersById) {
    const seedBaseDate = AppUtils.shiftDate(/* @__PURE__ */ new Date("2026-02-24T12:00:00.000Z"), SEED_SCHEDULE_REFERENCE_DATE, environment.bootstrapOffsetInDays);
    const owner = this.resolveDemoUser(ownerUserId, users, usersById, asset.ownerName?.trim() || "Asset owner", "", asset.city);
    const ownerEntry = {
      id: `${asset.id}:owner`,
      userId: owner.id,
      name: owner.name,
      initials: owner.initials,
      gender: owner.gender,
      city: owner.city || asset.city,
      statusText: "Responsible manager for this asset.",
      role: "Manager",
      status: "accepted",
      pendingSource: null,
      requestKind: null,
      invitedByActiveUser: false,
      invitedByUserId: null,
      metAtIso: asset.updatedAtIso ?? seedBaseDate.toISOString(),
      actionAtIso: asset.updatedAtIso ?? seedBaseDate.toISOString(),
      metWhere: asset.title,
      avatarUrl: AppUtils.firstImageUrl(owner.images),
      profile: owner
    };
    const requests = asset.requests.length > 0 ? [...asset.requests] : this.buildFallbackAssetRequests(ownerUserId, asset, users);
    const userList = [...users];
    const requestEntries = requests.slice(0, _SeedActivityMembersRepository.MAX_SEEDED_ASSET_REQUESTS_PER_OWNER).map((request, index) => {
      const requestUserId = AppUtils.resolveAssetRequestUserId(request, userList);
      const matchedUser = usersById.get(requestUserId) ?? AppUtils.findUserByName(userList, request.name) ?? this.resolveDemoUser(requestUserId, users, usersById, request.name, request.initials, asset.city, request.gender);
      const seed = AppUtils.hashText(`asset-members:${asset.id}:${request.id}:${matchedUser.id}:${index}`);
      const actionAtIso = AppUtils.toIsoDateTime(AppUtils.addDays(seedBaseDate, -(seed % 90 + 1)));
      const status = request.status === "pending" ? "pending" : "accepted";
      return {
        id: request.id?.trim() || `${asset.id}:member:${index + 1}`,
        userId: matchedUser.id,
        name: request.name,
        initials: request.initials,
        gender: request.gender,
        city: matchedUser.city || asset.city,
        statusText: request.note?.trim() || (status === "pending" ? "Waiting for owner confirmation." : "Accepted for this asset."),
        role: status === "accepted" && index === 1 ? "Manager" : "Member",
        status,
        pendingSource: status === "pending" ? "admin" : null,
        requestKind: status === "pending" ? "invite" : null,
        invitedByActiveUser: false,
        invitedByUserId: null,
        metAtIso: actionAtIso,
        actionAtIso,
        metWhere: asset.title,
        avatarUrl: AppUtils.firstImageUrl(matchedUser.images),
        profile: matchedUser
      };
    });
    return [ownerEntry, ...requestEntries];
  }
  buildFallbackAssetRequests(ownerUserId, asset, users) {
    const requestUsers = UserProfileState.friendUsersForActiveUser(users, ownerUserId, 2);
    return requestUsers.map((user, index) => ({
      id: `${asset.id}:request:${index + 1}`,
      userId: user.id,
      name: user.name,
      initials: user.initials,
      gender: user.gender,
      status: index === 0 ? "pending" : "accepted",
      note: index === 0 ? "Waiting for owner confirmation." : "Accepted for this asset."
    }));
  }
  syncEventSummariesFromMembers(eventsTable, membersTable) {
    const nextById = __spreadValues({}, eventsTable.byId);
    let changed = false;
    for (const id of eventsTable.ids) {
      const current = eventsTable.byId[id];
      if (!current) {
        continue;
      }
      const ownerKey = this.ownerKey({ ownerType: "event", ownerId: current.id });
      const records = (membersTable.idsByOwnerKey[ownerKey] ?? []).map((memberId) => membersTable.byId[memberId]).filter((record) => Boolean(record));
      if (records.length === 0) {
        continue;
      }
      const acceptedMembers = records.filter((record) => record.status === "accepted").length;
      const pendingMembers = records.filter((record) => record.status === "pending").length;
      const acceptedMemberUserIds = this.normalizeMemberUserIds(records.filter((record) => record.status === "accepted").map((record) => record.userId));
      const pendingMemberUserIds = this.normalizeMemberUserIds(records.filter((record) => record.status === "pending").map((record) => record.userId));
      const invitedMemberUserIds = this.normalizeMemberUserIds(records.filter((record) => record.status === "pending" && (record.pendingSource === "admin" || record.requestKind === "invite")).map((record) => record.userId));
      const pendingRequestMemberUserIds = this.normalizeMemberUserIds(records.filter((record) => record.status === "pending" && (record.pendingSource === "member" || record.requestKind === "join")).map((record) => record.userId));
      const adminIds = this.normalizeMemberUserIds([
        current.creatorUserId,
        ...records.filter((record) => record.status === "accepted" && record.role === "Admin").map((record) => record.userId)
      ]);
      const capacityTotal = Math.max(acceptedMembers, current.capacityTotal);
      if (current.acceptedMembers === acceptedMembers && current.pendingMembers === pendingMembers && current.capacityTotal === capacityTotal && this.sameUserIds(current.acceptedMemberUserIds, acceptedMemberUserIds) && this.sameUserIds(current.pendingMemberUserIds, pendingMemberUserIds) && this.sameUserIds(current.invitedMemberUserIds, invitedMemberUserIds) && this.sameUserIds(current.pendingRequestMemberUserIds, pendingRequestMemberUserIds) && this.sameUserIds(current.adminIds, adminIds)) {
        continue;
      }
      nextById[id] = __spreadProps(__spreadValues({}, current), {
        acceptedMembers,
        pendingMembers,
        acceptedMemberUserIds,
        pendingMemberUserIds,
        invitedMemberUserIds,
        pendingRequestMemberUserIds,
        adminIds,
        capacityTotal
      });
      changed = true;
    }
    return changed ? { byId: nextById, ids: [...eventsTable.ids] } : eventsTable;
  }
  computePreferredEventRecords(table) {
    const preferredRecordByEventId = /* @__PURE__ */ new Map();
    for (const id of table.ids) {
      const record = table.byId[id];
      if (!record) {
        continue;
      }
      const current = preferredRecordByEventId.get(record.id);
      if (!current || this.shouldPreferRecord(record, current)) {
        preferredRecordByEventId.set(record.id, record);
      }
    }
    return [...preferredRecordByEventId.values()];
  }
  buildExplicitSeedMemberUserIdsByEventId() {
    const next = /* @__PURE__ */ new Map();
    const absorb = (item) => {
      const eventId = `${item.id ?? ""}`.trim();
      if (!eventId) {
        return;
      }
      const accepted = this.normalizeMemberUserIds(item.acceptedMemberUserIds);
      const pending = this.normalizeMemberUserIds(item.pendingMemberUserIds).filter((userId) => !accepted.includes(userId));
      if (accepted.length === 0 && pending.length === 0) {
        return;
      }
      const current = next.get(eventId) ?? { accepted: [], pending: [] };
      const mergedAccepted = this.normalizeMemberUserIds([...current.accepted, ...accepted]);
      const mergedPending = this.normalizeMemberUserIds([...current.pending, ...pending]).filter((userId) => !mergedAccepted.includes(userId));
      next.set(eventId, {
        accepted: mergedAccepted,
        pending: mergedPending
      });
    };
    for (const items of Object.values(SeedEventsBuilder.buildSeedInvitationItemsByUser())) {
      for (const item of items) {
        absorb(item);
      }
    }
    for (const items of Object.values(SeedEventsBuilder.buildSeedEventItemsByUser())) {
      for (const item of items) {
        absorb(item);
      }
    }
    for (const items of Object.values(SeedEventsBuilder.buildSeedHostingItemsByUser())) {
      for (const item of items) {
        absorb(item);
      }
    }
    return next;
  }
  collectTargetMemberUserIds(sourceUserIds, fallbackUserIds, target, usedUserIds) {
    const next = [];
    for (const userId of this.normalizeMemberUserIds([...sourceUserIds, ...fallbackUserIds])) {
      if (next.length >= target) {
        break;
      }
      if (usedUserIds.has(userId)) {
        continue;
      }
      next.push(userId);
      usedUserIds.add(userId);
    }
    return next;
  }
  resolveDemoUser(userId, users, usersById, fallbackName = "Unknown User", fallbackInitials = AppUtils.initialsFromText(fallbackName), fallbackCity = "", fallbackGender = "man") {
    const normalizedUserId = userId.trim();
    const byId = usersById.get(normalizedUserId);
    if (byId) {
      return byId;
    }
    const templateSeed = AppUtils.hashText(`${normalizedUserId}:${fallbackName}`);
    const template = users[templateSeed % Math.max(1, users.length)];
    return __spreadProps(__spreadValues({}, template ?? {
      id: normalizedUserId || "unknown-user",
      name: fallbackName,
      age: 30,
      birthday: "1996-01-01",
      city: fallbackCity,
      height: "170 cm",
      physique: "",
      languages: [],
      horoscope: "",
      initials: fallbackInitials || "UN",
      gender: fallbackGender,
      statusText: "Recently Active",
      hostTier: "",
      traitLabel: "",
      completion: 0,
      headline: "",
      about: "",
      profileStatus: "public",
      activities: { game: 0, chats: 0, invitations: 0, events: 0, hosting: 0 }
    }), {
      id: normalizedUserId || template?.id || "unknown-user",
      name: fallbackName || template?.name || "Unknown User",
      initials: fallbackInitials || template?.initials || "UN",
      city: fallbackCity || template?.city || "",
      gender: fallbackGender || template?.gender || "man"
    });
  }
  readOwnedAssetsByUser(ownerUserId, table) {
    return (table.idsByOwnerUserId[ownerUserId] ?? []).map((id) => table.byId[id]).filter((record) => Boolean(record)).filter((record) => !this.isSuppressedAssetStatus(record.status));
  }
  normalizeCollection(value) {
    const source = value;
    const byId = source?.byId && typeof source.byId === "object" ? __spreadValues({}, source.byId) : {};
    const ids = Array.isArray(source?.ids) ? source.ids.map((id) => String(id)).filter(Boolean) : Object.keys(byId);
    const idsByOwnerKey = this.cloneOwnerKeyIndex(source?.idsByOwnerKey);
    for (const id of ids) {
      const ownerKey = `${byId[id]?.ownerKey ?? ""}`.trim();
      if (!ownerKey) {
        continue;
      }
      const bucket = idsByOwnerKey[ownerKey] ?? [];
      if (!bucket.includes(id)) {
        bucket.push(id);
      }
      idsByOwnerKey[ownerKey] = bucket;
    }
    return { byId, ids, idsByOwnerKey };
  }
  cloneOwnerKeyIndex(index) {
    const next = {};
    for (const [ownerKey, ids] of Object.entries(index ?? {})) {
      const normalizedOwnerKey = ownerKey.trim();
      if (!normalizedOwnerKey || !Array.isArray(ids)) {
        continue;
      }
      next[normalizedOwnerKey] = ids.map((id) => String(id)).filter(Boolean);
    }
    return next;
  }
  toRecord(owner, member) {
    const ownerKey = this.ownerKey(owner);
    const createdMs = AppUtils.toSortableDate(member.actionAtIso) || Date.now();
    const createdAtIso = member.actionAtIso || new Date(createdMs).toISOString();
    const invitedByUserId = member.status === "pending" && (member.requestKind === "invite" || member.requestKind === "waitlist-invite") ? member.invitedByUserId?.trim() || null : null;
    return __spreadProps(__spreadValues({}, member), {
      invitedByUserId,
      invitedByActiveUser: invitedByUserId ? member.invitedByActiveUser === true : false,
      ownerType: owner.ownerType,
      ownerId: owner.ownerId,
      ownerKey,
      createdMs,
      updatedMs: createdMs,
      createdAtIso,
      updatedAtIso: createdAtIso
    });
  }
  cloneRecord(record) {
    return __spreadProps(__spreadValues({}, record), {
      profile: record.profile ? __spreadProps(__spreadValues({}, record.profile), { images: [...record.profile.images ?? []] }) : record.profile
    });
  }
  ownerKey(owner) {
    return `${owner.ownerType}:${owner.ownerId}`;
  }
  shouldPreferRecord(next, current) {
    return next.acceptedMembers >= current.acceptedMembers;
  }
  sameUserIds(left, right) {
    const leftIds = this.normalizeMemberUserIds(left);
    const rightIds = this.normalizeMemberUserIds(right);
    return leftIds.length === rightIds.length && leftIds.every((userId, index) => userId === rightIds[index]);
  }
  normalizeMemberUserIds(userIds) {
    if (!Array.isArray(userIds)) {
      return [];
    }
    return Array.from(new Set(userIds.map((userId) => `${userId ?? ""}`.trim()).filter((userId) => userId.length > 0)));
  }
  normalizeMemberCount(value) {
    if (!Number.isFinite(Number(value))) {
      return null;
    }
    return Math.max(0, Math.trunc(Number(value)));
  }
  isSuppressedAssetStatus(status) {
    const normalized = `${status ?? ""}`.trim();
    return normalized === "UR" || normalized === "B" || normalized === "D" || normalized === "I" || normalized === "T";
  }
  static \u0275fac = function SeedActivityMembersRepository_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SeedActivityMembersRepository)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SeedActivityMembersRepository, factory: _SeedActivityMembersRepository.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SeedActivityMembersRepository, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/local/seed/repositories/activity-resources-seed.repository.ts
var SeedActivityResourcesRepository = class _SeedActivityResourcesRepository {
  memoryDb = inject(LocalMemoryDb);
  lastSeedToken = "";
  seedDefaults(ownerUserIds, sourceRecordsByUserId, assetsByUserId) {
    const normalizedUserIds = Array.from(new Set((ownerUserIds ?? []).map((userId) => `${userId ?? ""}`.trim()).filter((userId) => userId.length > 0)));
    if (normalizedUserIds.length === 0) {
      return;
    }
    const state = this.memoryDb.read();
    const eventsTable = state[EVENTS_TABLE_NAME];
    const activityMembersTable = state[ACTIVITY_MEMBERS_TABLE_NAME];
    const currentTable = this.normalizeCollection(state[ACTIVITY_RESOURCES_TABLE_NAME]);
    const currentAssetRequestsTable = this.normalizeAssetRequestsCollection(state[ASSET_REQUESTS_TABLE_NAME]);
    const seedToken = [
      eventsTable.ids.length,
      currentTable.ids.length,
      Object.keys(currentTable.idsByOwnerKey).length,
      currentAssetRequestsTable.ids.length,
      normalizedUserIds.join("|")
    ].join(":");
    if (this.lastSeedToken === seedToken) {
      return;
    }
    const ownedAssetsByUserId = assetsByUserId ?? this.readOwnedAssetsByUsers(normalizedUserIds, this.normalizeAssetsCollection(state[ASSETS_TABLE_NAME]));
    const sourceRecords = this.mergeSourceRecordsByUserId(normalizedUserIds, sourceRecordsByUserId, this.collectSourceRecordsByUserId(normalizedUserIds, eventsTable));
    const acceptedMemberUserIdsByEventId = this.acceptedMemberUserIdsByEventId(activityMembersTable);
    const contributorUserIdsByEventId = /* @__PURE__ */ new Map();
    const generatedEventResourceRecords = normalizedUserIds.flatMap((userId) => this.buildSeededRecordsForUser(userId, sourceRecords.get(userId), ownedAssetsByUserId.get(userId), contributorUserIdsByEventId, acceptedMemberUserIdsByEventId));
    const manualAssignmentResourceRecords = this.buildAssetRequestResourceRecords(normalizedUserIds, currentAssetRequestsTable, ownedAssetsByUserId);
    const assetJoinShowcaseRecords = this.buildAssetJoinShowcaseRecords(sourceRecords, ownedAssetsByUserId);
    const desiredRecords = this.uniqueSeededResourceRecords([
      ...generatedEventResourceRecords,
      ...manualAssignmentResourceRecords,
      ...assetJoinShowcaseRecords
    ]);
    const desiredRecordIds = new Set(desiredRecords.map((record) => record.id));
    const managedUserIds = new Set(normalizedUserIds);
    const nextRecords = [];
    const retainedRecordIds = /* @__PURE__ */ new Set();
    let changed = false;
    for (const id of currentTable.ids) {
      const record = currentTable.byId[id];
      if (!record || retainedRecordIds.has(record.id)) {
        continue;
      }
      const belongsManagedUser = managedUserIds.has(record.assetOwnerUserId);
      if (belongsManagedUser && !desiredRecordIds.has(record.id)) {
        changed = true;
        continue;
      }
      nextRecords.push(this.cloneRecord(record));
      retainedRecordIds.add(record.id);
    }
    for (const record of desiredRecords) {
      if (retainedRecordIds.has(record.id)) {
        continue;
      }
      nextRecords.push(this.cloneRecord(record));
      retainedRecordIds.add(record.id);
      changed = true;
    }
    if (!changed) {
      this.lastSeedToken = seedToken;
      return;
    }
    const nextTable = this.buildCollection(nextRecords);
    const nextAssetsTable = this.syncManualRequestsInAssetsTable(this.normalizeAssetsCollection(state[ASSETS_TABLE_NAME]), nextRecords, new Map(eventsTable.ids.map((id) => [eventsTable.byId[id]?.id ?? id, eventsTable.byId[id]])));
    this.memoryDb.write((currentState) => __spreadProps(__spreadValues({}, currentState), {
      [ACTIVITY_RESOURCES_TABLE_NAME]: nextTable,
      [ASSETS_TABLE_NAME]: nextAssetsTable
    }));
    this.lastSeedToken = [
      eventsTable.ids.length,
      nextTable.ids.length,
      Object.keys(nextTable.idsByOwnerKey).length,
      currentAssetRequestsTable.ids.length,
      normalizedUserIds.join("|")
    ].join(":");
  }
  buildSeededRecordsForUser(userId, seedSourceRecords, _seedAssets, contributorUserIdsByEventId, acceptedMemberUserIdsByEventId) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return [];
    }
    const sourceRecords = seedSourceRecords ?? [];
    const seenRecordIds = /* @__PURE__ */ new Set();
    const nextRecords = [];
    let createdMs = AppUtils.anchorDate(environment.bootstrapOffsetInDays).getTime();
    for (const record of sourceRecords) {
      if (!this.shouldSeedResourcesForParticipant(record, normalizedUserId, contributorUserIdsByEventId, acceptedMemberUserIdsByEventId)) {
        continue;
      }
      const subEventIds = this.resourceSeedSubEventIds(record);
      if (!this.isGeneratedSlotRecord(record) || subEventIds.length === 0) {
        continue;
      }
      for (const subEventId of subEventIds) {
        const normalizedRef = this.normalizeRef({
          ownerId: record.id,
          subEventId,
          assetOwnerUserId: normalizedUserId
        });
        if (!normalizedRef) {
          continue;
        }
        const recordId = this.resourceRecordId(normalizedRef);
        if (seenRecordIds.has(recordId)) {
          continue;
        }
        seenRecordIds.add(recordId);
        const createdAtIso = new Date(createdMs).toISOString();
        nextRecords.push({
          id: recordId,
          ownerKey: this.resourceOwnerKey(normalizedRef),
          ownerId: normalizedRef.ownerId,
          subEventId: normalizedRef.subEventId,
          assetOwnerUserId: normalizedRef.assetOwnerUserId,
          assetAssignmentIds: {},
          assetSettingsByType: {},
          supplyContributionEntriesByAssetId: {},
          fallbackAssetCardsByType: {},
          createdMs,
          updatedMs: createdMs,
          createdAtIso,
          updatedAtIso: createdAtIso
        });
        createdMs += 1;
      }
    }
    return nextRecords;
  }
  buildAssetJoinShowcaseRecords(sourceRecordsByUserId, assetsByUserId) {
    const event = (sourceRecordsByUserId.get("u3") ?? []).find((record) => record.id === "asset-join-demo-nagy-eszter");
    const activeUserId = "u3";
    const assetManagerUserId = "u4";
    const asset = (assetsByUserId.get(assetManagerUserId) ?? []).find((record) => record.id === `${assetManagerUserId}:asset-transport-3`);
    const subEventId = "asset-join-demo-nagy-eszter-transport-pickup";
    if (!event || !asset || !this.resourceSeedSubEventIds(event).includes(subEventId)) {
      return [];
    }
    const ref = this.normalizeRef({
      ownerId: event.id,
      subEventId,
      assetOwnerUserId: activeUserId
    });
    if (!ref) {
      return [];
    }
    const createdMs = AppUtils.anchorDate(environment.bootstrapOffsetInDays).getTime() + 5e4;
    const createdAtIso = new Date(createdMs).toISOString();
    return [{
      id: this.resourceRecordId(ref),
      status: "A",
      ownerKey: this.resourceOwnerKey(ref),
      ownerId: ref.ownerId,
      subEventId: ref.subEventId,
      assetOwnerUserId: ref.assetOwnerUserId,
      assetAssignmentIds: {
        [ASSET_TYPE_TRANSPORT]: [asset.id]
      },
      assetSettingsByType: {
        [ASSET_TYPE_TRANSPORT]: {
          [asset.id]: {
            capacityMin: 0,
            capacityMax: Math.max(1, Math.trunc(Number(asset.capacityTotal) || 1)),
            quantity: 1,
            addedByUserId: assetManagerUserId,
            routeEnabled: (asset.routes ?? []).length > 0,
            routes: this.normalizeRoutes(asset.routes)
          }
        }
      },
      supplyContributionEntriesByAssetId: {},
      fallbackAssetCardsByType: this.cloneFallbackAssetCardsByType({
        [ASSET_TYPE_TRANSPORT]: [asset]
      }),
      createdMs,
      updatedMs: createdMs,
      createdAtIso,
      updatedAtIso: createdAtIso
    }];
  }
  shouldSeedResourcesForParticipant(record, userId, contributorUserIdsByEventId, acceptedMemberUserIdsByEventId) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return false;
    }
    let contributorUserIds = contributorUserIdsByEventId?.get(record.id);
    if (!contributorUserIds) {
      contributorUserIds = this.resolveSeededResourceContributorUserIds(record, acceptedMemberUserIdsByEventId?.get(record.id) ?? []);
      contributorUserIdsByEventId?.set(record.id, contributorUserIds);
    }
    return contributorUserIds.includes(normalizedUserId);
  }
  resolveSeededResourceContributorUserIds(record, acceptedMemberUserIds) {
    const creatorUserId = `${record.creatorUserId ?? ""}`.trim();
    const candidateUserIds = Array.from(new Set([
      creatorUserId,
      ...acceptedMemberUserIds
    ].filter((userId) => userId.length > 0)));
    if (candidateUserIds.length <= 1) {
      return candidateUserIds;
    }
    const targetCount = this.resolveSeededResourceContributorTarget(record, candidateUserIds.length);
    if (targetCount >= candidateUserIds.length) {
      return candidateUserIds;
    }
    return [...candidateUserIds].sort((left, right) => {
      if (left === creatorUserId && right !== creatorUserId) {
        return -1;
      }
      if (right === creatorUserId && left !== creatorUserId) {
        return 1;
      }
      const leftWeight = AppUtils.hashText(`activity-resource:${record.id}:${left}`);
      const rightWeight = AppUtils.hashText(`activity-resource:${record.id}:${right}`);
      return leftWeight - rightWeight;
    }).slice(0, targetCount);
  }
  resolveSeededResourceContributorTarget(record, maxCount) {
    if (maxCount <= 1) {
      return maxCount;
    }
    const seed = AppUtils.hashText(`activity-resource-target:${record.id}:${record.creatorUserId}:${record.activity}`);
    const bucket = seed % 100;
    let target = 1 + seed % 2;
    if (bucket >= 65 && bucket < 88) {
      target = 2 + (seed >> 3) % 3;
    } else if (bucket >= 88 && bucket < 97) {
      target = 4 + (seed >> 5) % 3;
    } else if (bucket >= 97) {
      target = 10 + (seed >> 7) % 4;
    }
    return Math.max(1, Math.min(maxCount, target));
  }
  collectSourceRecordsByUserId(userIds, eventsTable) {
    const recordsByUserId = /* @__PURE__ */ new Map();
    for (const userId of userIds) {
      const sourceRecordsByEventId = /* @__PURE__ */ new Map();
      for (const id of eventsTable.ids) {
        const record = eventsTable.byId[id];
        if (!record || !record.id || !this.isGeneratedSlotRecord(record) || this.resourceSeedSubEventIds(record).length === 0 || record.status === "T" || !this.isEventAdminRecord(record, userId)) {
          continue;
        }
        const current = sourceRecordsByEventId.get(record.id);
        if (!current || this.shouldPreferParticipantSourceRecord(record, current)) {
          sourceRecordsByEventId.set(record.id, record);
        }
      }
      recordsByUserId.set(userId, [...sourceRecordsByEventId.values()]);
    }
    return recordsByUserId;
  }
  mergeSourceRecordsByUserId(userIds, sourceRecordsByUserId, generatedSlotRecordsByUserId) {
    const result = /* @__PURE__ */ new Map();
    for (const userId of userIds) {
      const byId = /* @__PURE__ */ new Map();
      for (const record of sourceRecordsByUserId?.get(userId) ?? []) {
        if (this.isGeneratedSlotRecord(record) && this.resourceSeedSubEventIds(record).length > 0) {
          byId.set(record.id, record);
        }
      }
      for (const record of generatedSlotRecordsByUserId.get(userId) ?? []) {
        byId.set(record.id, record);
      }
      result.set(userId, [...byId.values()]);
    }
    return result;
  }
  resourceSeedSubEventIds(record) {
    return (record?.subEventDefinitions ?? []).map((item, index) => `${item?.id ?? ""}`.trim() || `subevent-${index + 1}`).filter((item, index, items) => item.length > 0 && items.indexOf(item) === index);
  }
  isGeneratedSlotRecord(record) {
    return Boolean(record?.generated) || record?.eventType === "slot" || Boolean(record?.parentEventId);
  }
  shouldPreferParticipantSourceRecord(next, current) {
    const nextPublished = this.isPublishedEventStatus(next.status);
    const currentPublished = this.isPublishedEventStatus(current.status);
    if (nextPublished !== currentPublished) {
      return nextPublished;
    }
    return next.activity >= current.activity;
  }
  isEventAdminRecord(record, userId) {
    const normalizedUserId = `${userId ?? ""}`.trim();
    if (!normalizedUserId) {
      return false;
    }
    return this.normalizeUserIds([record.creatorUserId, ...record.adminIds ?? []]).includes(normalizedUserId);
  }
  normalizeUserIds(userIds) {
    return Array.from(new Set((userIds ?? []).map((userId) => `${userId ?? ""}`.trim()).filter((userId) => userId.length > 0)));
  }
  isPublishedEventStatus(status) {
    return `${status ?? "A"}`.trim() === "A";
  }
  readOwnedAssetsByUsers(userIds, table) {
    const assetsByUserId = /* @__PURE__ */ new Map();
    for (const userId of userIds) {
      assetsByUserId.set(userId, (table.idsByOwnerUserId[userId] ?? []).map((id) => table.byId[id]).filter((record) => Boolean(record)));
    }
    return assetsByUserId;
  }
  acceptedMemberUserIdsByEventId(table) {
    const result = /* @__PURE__ */ new Map();
    for (const [ownerKey, memberIds] of Object.entries(table.idsByOwnerKey)) {
      if (!ownerKey.startsWith("event:")) {
        continue;
      }
      const eventId = ownerKey.slice("event:".length).trim();
      if (!eventId) {
        continue;
      }
      result.set(eventId, Array.from(new Set(memberIds.map((memberId) => table.byId[memberId]).filter((member) => member?.status === "accepted").map((member) => `${member?.userId ?? ""}`.trim()).filter(Boolean))));
    }
    return result;
  }
  buildAssetRequestResourceRecords(ownerUserIds, requestsTable, assetsByUserId) {
    const managedUserIds = new Set(ownerUserIds.map((userId) => `${userId ?? ""}`.trim()).filter(Boolean));
    const assetById = /* @__PURE__ */ new Map();
    for (const [userId, assets] of assetsByUserId.entries()) {
      if (!managedUserIds.has(`${userId ?? ""}`.trim())) {
        continue;
      }
      for (const asset of assets ?? []) {
        const assetId = `${asset?.id ?? ""}`.trim();
        if (assetId) {
          assetById.set(assetId, asset);
        }
      }
    }
    const recordsById = /* @__PURE__ */ new Map();
    for (const requestId of requestsTable.ids) {
      const request = requestsTable.byId[requestId];
      if (!this.isAcceptedManualBookedRequest(request)) {
        continue;
      }
      const ownerUserId = `${request.ownerUserId ?? ""}`.trim();
      if (!managedUserIds.has(ownerUserId)) {
        continue;
      }
      const asset = assetById.get(`${request.assetId ?? ""}`.trim());
      if (!asset || `${asset.ownerUserId ?? ""}`.trim() !== ownerUserId) {
        continue;
      }
      const normalizedRef = this.normalizeRef({
        ownerId: `${request.booking?.eventId ?? ""}`.trim(),
        subEventId: `${request.booking?.subEventId ?? ""}`.trim(),
        assetOwnerUserId: ownerUserId
      });
      if (!normalizedRef) {
        continue;
      }
      const recordId = this.resourceRecordId(normalizedRef);
      const record = recordsById.get(recordId) ?? this.createAssetRequestResourceRecord(normalizedRef, request);
      this.applyAssetRequestAssignment(record, asset, request);
      recordsById.set(recordId, record);
    }
    return [...recordsById.values()];
  }
  uniqueSeededResourceRecords(records) {
    const byId = /* @__PURE__ */ new Map();
    for (const record of records) {
      byId.set(record.id, this.cloneRecord(record));
    }
    return [...byId.values()];
  }
  createAssetRequestResourceRecord(ref, request) {
    const createdMs = this.assetRequestSeedMs(request);
    const createdAtIso = request.createdAtIso || new Date(createdMs).toISOString();
    return {
      id: this.resourceRecordId(ref),
      status: "A",
      ownerKey: this.resourceOwnerKey(ref),
      ownerId: ref.ownerId,
      subEventId: ref.subEventId,
      assetOwnerUserId: ref.assetOwnerUserId,
      assetAssignmentIds: {},
      assetSettingsByType: {},
      supplyContributionEntriesByAssetId: {},
      fallbackAssetCardsByType: {},
      createdMs,
      updatedMs: createdMs,
      createdAtIso,
      updatedAtIso: createdAtIso
    };
  }
  applyAssetRequestAssignment(record, asset, request) {
    const type = asset.type;
    const assetId = asset.id.trim();
    if (!assetId) {
      return;
    }
    const assignedIds = record.assetAssignmentIds[type] ?? [];
    if (!assignedIds.includes(assetId)) {
      record.assetAssignmentIds[type] = [...assignedIds, assetId];
    }
    const routes = this.normalizeRoutes(asset.routes);
    const settingsByAssetId = record.assetSettingsByType[type] ?? {};
    record.assetSettingsByType[type] = __spreadProps(__spreadValues({}, settingsByAssetId), {
      [assetId]: {
        capacityMin: 0,
        capacityMax: this.assetRequestAssignmentCapacity(asset, request),
        quantity: this.assetRequestQuantity(request),
        addedByUserId: record.assetOwnerUserId,
        routeEnabled: routes.length > 0,
        routes
      }
    });
    if (type === ASSET_TYPE_SUPPLIES) {
      const quantity = this.assetRequestQuantity(request);
      const entryId = `${request.id}:seed-supply`;
      const existingEntries = record.supplyContributionEntriesByAssetId[assetId] ?? [];
      if (!existingEntries.some((entry) => entry.id === entryId)) {
        record.supplyContributionEntriesByAssetId[assetId] = [
          ...existingEntries,
          {
            id: entryId,
            userId: record.assetOwnerUserId,
            quantity,
            addedAtIso: request.createdAtIso || record.createdAtIso
          }
        ];
      }
    }
    const updatedMs = this.assetRequestUpdatedMs(request);
    if (updatedMs >= record.updatedMs) {
      record.updatedMs = updatedMs;
      record.updatedAtIso = request.updatedAtIso || new Date(updatedMs).toISOString();
    }
  }
  isAcceptedManualBookedRequest(request) {
    return Boolean(request && request.requestKind === "manual" && request.status === "accepted" && `${request.assetId ?? ""}`.trim() && `${request.ownerUserId ?? ""}`.trim() && `${request.booking?.eventId ?? ""}`.trim() && `${request.booking?.subEventId ?? ""}`.trim());
  }
  assetRequestAssignmentCapacity(asset, request) {
    if (asset.type === ASSET_TYPE_SUPPLIES) {
      return this.assetRequestQuantity(request);
    }
    const capacity = Math.trunc(Number(asset.capacityTotal));
    if (Number.isFinite(capacity) && capacity > 0) {
      return capacity;
    }
    return 1;
  }
  assetRequestQuantity(request) {
    const quantity = Math.trunc(Number(request.booking?.quantity));
    return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
  }
  assignmentRecordQuantity(settings) {
    const quantity = Math.trunc(Number(settings?.quantity));
    return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
  }
  assetRequestSeedMs(request) {
    const createdMs = Math.trunc(Number(request.createdMs));
    if (Number.isFinite(createdMs) && createdMs > 0) {
      return createdMs;
    }
    const sortableCreatedAt = AppUtils.toSortableDate(request.createdAtIso);
    return sortableCreatedAt > 0 ? sortableCreatedAt : Date.now();
  }
  assetRequestUpdatedMs(request) {
    const updatedMs = Math.trunc(Number(request.updatedMs));
    if (Number.isFinite(updatedMs) && updatedMs > 0) {
      return updatedMs;
    }
    const sortableUpdatedAt = AppUtils.toSortableDate(request.updatedAtIso);
    return sortableUpdatedAt > 0 ? sortableUpdatedAt : this.assetRequestSeedMs(request);
  }
  buildCollection(records) {
    const byId = {};
    const ids = [];
    const idsByOwnerKey = {};
    for (const record of records) {
      byId[record.id] = this.cloneRecord(record);
      ids.push(record.id);
      const ownerBucket = idsByOwnerKey[record.ownerKey] ?? [];
      ownerBucket.push(record.id);
      idsByOwnerKey[record.ownerKey] = ownerBucket;
    }
    return { byId, ids, idsByOwnerKey };
  }
  normalizeCollection(value) {
    const source = value;
    const byId = source?.byId && typeof source.byId === "object" ? __spreadValues({}, source.byId) : {};
    const ids = Array.isArray(source?.ids) ? source.ids.map((id) => `${id}`) : Object.keys(byId);
    const idsByOwnerKey = source?.idsByOwnerKey && typeof source.idsByOwnerKey === "object" ? Object.fromEntries(Object.entries(source.idsByOwnerKey).map(([ownerKey, recordIds]) => [
      ownerKey,
      Array.isArray(recordIds) ? recordIds.map((id) => `${id}`) : []
    ])) : {};
    for (const id of ids) {
      const record = byId[id];
      const ownerKey = `${record?.ownerKey ?? ""}`.trim();
      if (!ownerKey) {
        continue;
      }
      const bucket = idsByOwnerKey[ownerKey] ?? [];
      if (!bucket.includes(id)) {
        bucket.push(id);
      }
      idsByOwnerKey[ownerKey] = bucket;
    }
    return { byId, ids, idsByOwnerKey };
  }
  normalizeAssetRequestsCollection(value) {
    const source = value;
    return {
      byId: source?.byId && typeof source.byId === "object" ? __spreadValues({}, source.byId) : {},
      ids: Array.isArray(source?.ids) ? source.ids.map((id) => `${id}`).filter(Boolean) : [],
      idsByOwnerKey: source?.idsByOwnerKey && typeof source.idsByOwnerKey === "object" ? Object.fromEntries(Object.entries(source.idsByOwnerKey).map(([ownerKey, requestIds]) => [
        `${ownerKey ?? ""}`.trim(),
        Array.isArray(requestIds) ? requestIds.map((id) => `${id}`).filter(Boolean) : []
      ]).filter(([ownerKey]) => ownerKey.length > 0)) : {}
    };
  }
  cloneRecord(record) {
    return __spreadProps(__spreadValues({}, record), {
      assetAssignmentIds: this.cloneAssetAssignmentIds(record.assetAssignmentIds),
      assetSettingsByType: this.cloneAssetSettingsByType(record.assetSettingsByType),
      supplyContributionEntriesByAssetId: this.cloneSupplyContributionEntriesByAssetId(record.supplyContributionEntriesByAssetId),
      fallbackAssetCardsByType: this.cloneFallbackAssetCardsByType(record.fallbackAssetCardsByType)
    });
  }
  syncManualRequestsInAssetsTable(table, resourceRecords, eventsById) {
    const nextById = __spreadValues({}, table.byId);
    const events = Array.from(eventsById.values()).filter((event) => Boolean(event?.id));
    let changed = false;
    for (const record of resourceRecords) {
      const event = eventsById.get(record.ownerId) ?? events.find((candidate) => record.ownerId.startsWith(`${candidate.id}:`));
      const subEventId = this.resourceSeedSubEventIds(event).find((item) => item === record.subEventId) ?? "";
      if (!event || !subEventId) {
        continue;
      }
      for (const type of ASSET_TYPES) {
        const assignedIds = record.assetAssignmentIds[type] ?? [];
        for (const assetId of assignedIds) {
          const card = nextById[assetId];
          if (!card) {
            continue;
          }
          const existingRequestIndex = card.requests.findIndex((request) => request.requestKind === "manual" && `${request.booking?.eventId ?? ""}`.trim() === record.ownerId && `${request.booking?.subEventId ?? ""}`.trim() === subEventId);
          const existingRequest = existingRequestIndex >= 0 ? card.requests[existingRequestIndex] : null;
          const settings = record.assetSettingsByType[type]?.[assetId] ?? null;
          const quantity = type === ASSET_TYPE_SUPPLIES ? (record.supplyContributionEntriesByAssetId[assetId] ?? []).reduce((sum, entry) => sum + entry.quantity, 0) || this.assignmentRecordQuantity(settings) : this.assignmentRecordQuantity(settings);
          if (type === ASSET_TYPE_SUPPLIES && quantity <= 0) {
            if (existingRequestIndex >= 0) {
              const nextRequests = [...card.requests];
              nextRequests.splice(existingRequestIndex, 1);
              nextById[assetId] = __spreadProps(__spreadValues({}, card), {
                requests: nextRequests,
                updatedMs: record.updatedMs,
                updatedAtIso: record.updatedAtIso
              });
              changed = true;
            }
            continue;
          }
          const desiredRequest = {
            id: existingRequest?.id ?? `manual:${record.ownerId}:${subEventId}:${card.id}`,
            userId: record.assetOwnerUserId,
            name: "Demo User",
            initials: "DU",
            gender: "man",
            status: "accepted",
            note: "",
            requestKind: "manual",
            requestedAtIso: existingRequest?.requestedAtIso ?? record.createdAtIso,
            booking: {
              eventId: record.ownerId,
              subEventId,
              startAtIso: event.startAtIso,
              endAtIso: event.endAtIso,
              quantity,
              totalAmount: 0,
              currency: "USD",
              acceptedPolicyIds: [],
              paymentSessionId: "",
              inventoryApplied: true
            }
          };
          if (!existingRequest || this.assetRequestSyncSignature(existingRequest) !== this.assetRequestSyncSignature(desiredRequest)) {
            const nextRequests = [...card.requests];
            if (existingRequestIndex >= 0) {
              nextRequests[existingRequestIndex] = desiredRequest;
            } else {
              nextRequests.push(desiredRequest);
            }
            nextById[assetId] = __spreadProps(__spreadValues({}, card), {
              requests: nextRequests,
              updatedMs: record.updatedMs,
              updatedAtIso: record.updatedAtIso
            });
            changed = true;
          }
        }
      }
    }
    return changed ? __spreadProps(__spreadValues({}, table), { byId: nextById }) : table;
  }
  normalizeAssetsCollection(value) {
    const source = value;
    return {
      byId: source?.byId ? __spreadValues({}, source.byId) : {},
      ids: Array.isArray(source?.ids) ? [...source.ids] : [],
      idsByOwnerUserId: source?.idsByOwnerUserId ? __spreadValues({}, source.idsByOwnerUserId) : {}
    };
  }
  normalizeRef(ref) {
    const ownerId = `${ref?.ownerId ?? ""}`.trim();
    const subEventId = `${ref?.subEventId ?? ""}`.trim();
    const assetOwnerUserId = `${ref?.assetOwnerUserId ?? ""}`.trim();
    if (!ownerId || !subEventId || !assetOwnerUserId) {
      return null;
    }
    return { ownerId, subEventId, assetOwnerUserId };
  }
  resourceOwnerKey(ref) {
    return `${ref.assetOwnerUserId}:${ref.ownerId}`;
  }
  resourceRecordId(ref) {
    return `${ref.assetOwnerUserId}:${ref.ownerId}:${ref.subEventId}`;
  }
  cloneAssetAssignmentIds(source) {
    const next = {};
    for (const type of this.assetTypes()) {
      const ids = Array.isArray(source?.[type]) ? source?.[type] : [];
      const normalizedIds = Array.from(new Set(ids.map((id) => `${id ?? ""}`.trim()).filter((id) => id.length > 0)));
      if (normalizedIds.length > 0) {
        next[type] = normalizedIds;
      }
    }
    return next;
  }
  cloneAssetSettingsByType(source) {
    const next = {};
    for (const type of this.assetTypes()) {
      const rawMap = source?.[type];
      if (!rawMap || typeof rawMap !== "object") {
        continue;
      }
      const normalizedMap = {};
      for (const [assetId, settings] of Object.entries(rawMap)) {
        const normalizedAssetId = `${assetId ?? ""}`.trim();
        if (!normalizedAssetId || !settings) {
          continue;
        }
        const routes = this.normalizeRoutes(settings.routes);
        normalizedMap[normalizedAssetId] = {
          capacityMin: Math.max(0, Math.trunc(Number(settings.capacityMin) || 0)),
          capacityMax: Math.max(0, Math.trunc(Number(settings.capacityMax) || 0)),
          quantity: this.assignmentRecordQuantity(settings),
          addedByUserId: `${settings.addedByUserId ?? ""}`.trim(),
          routeEnabled: settings.routeEnabled === true && routes.length > 0,
          routes
        };
      }
      if (Object.keys(normalizedMap).length > 0) {
        next[type] = normalizedMap;
      }
    }
    return next;
  }
  cloneSupplyContributionEntriesByAssetId(source) {
    const next = {};
    if (!source || typeof source !== "object") {
      return next;
    }
    for (const [assetId, rawEntries] of Object.entries(source)) {
      const normalizedAssetId = `${assetId ?? ""}`.trim();
      if (!normalizedAssetId || !Array.isArray(rawEntries)) {
        continue;
      }
      const entries = rawEntries.map((entry) => ({
        id: `${entry?.id ?? ""}`.trim(),
        userId: `${entry?.userId ?? ""}`.trim(),
        quantity: Math.max(0, Math.trunc(Number(entry?.quantity) || 0)),
        addedAtIso: `${entry?.addedAtIso ?? ""}`.trim()
      })).filter((entry) => entry.id.length > 0 && entry.userId.length > 0 && entry.quantity > 0).sort((left, right) => AppUtils.toSortableDate(left.addedAtIso) - AppUtils.toSortableDate(right.addedAtIso));
      if (entries.length > 0) {
        next[normalizedAssetId] = entries;
      }
    }
    return next;
  }
  cloneFallbackAssetCardsByType(source) {
    const next = {};
    for (const type of this.assetTypes()) {
      const cards = source?.[type];
      if (!Array.isArray(cards) || cards.length === 0) {
        continue;
      }
      next[type] = cards.map((card) => __spreadProps(__spreadValues({}, card), {
        requests: (card.requests ?? []).map((request) => __spreadProps(__spreadValues({}, request), {
          booking: request.booking ? __spreadProps(__spreadValues({}, request.booking), {
            acceptedPolicyIds: [...request.booking.acceptedPolicyIds ?? []]
          }) : null,
          menuActions: [...request.menuActions ?? []]
        })),
        menuActions: [...card.menuActions ?? []]
      }));
    }
    return next;
  }
  isSubEventManualAssignmentRequest(request, subEventId) {
    const normalizedSubEventId = subEventId.trim();
    return request.requestKind === "manual" && normalizedSubEventId.length > 0 && request.id.startsWith(`manual:${normalizedSubEventId}:`);
  }
  assetRequestSyncSignature(request) {
    return JSON.stringify({
      id: request.id,
      userId: request.userId ?? "",
      status: request.status,
      requestKind: request.requestKind ?? "",
      bookingQuantity: request.booking?.quantity ?? "",
      bookingAcceptedPolicyIds: [...request.booking?.acceptedPolicyIds ?? []]
    });
  }
  normalizeRoutes(routes) {
    return Array.from(new Set((routes ?? []).map((route) => `${route ?? ""}`.trim()).filter((route) => route.length > 0)));
  }
  assetTypes() {
    return ASSET_TYPES;
  }
  static \u0275fac = function SeedActivityResourcesRepository_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SeedActivityResourcesRepository)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SeedActivityResourcesRepository, factory: _SeedActivityResourcesRepository.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SeedActivityResourcesRepository, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/local/seed/repositories/assets-seed.repository.ts
var SeedAssetsRepository = class _SeedAssetsRepository {
  memoryDb = inject(LocalMemoryDb);
  lastSeedToken = "";
  seedDefaults(ownerUserIds, seedUsers = []) {
    const allUsers = [...seedUsers];
    const normalizedOwnerIds = Array.from(new Set((ownerUserIds ?? allUsers.map((user) => user.id)).map((userId) => `${userId ?? ""}`.trim()).filter(Boolean)));
    if (normalizedOwnerIds.length === 0) {
      return /* @__PURE__ */ new Map();
    }
    const currentState = this.memoryDb.read();
    const currentTable = this.normalizeCollection(currentState[ASSETS_TABLE_NAME]);
    const currentRequestsTable = this.normalizeRequestsCollection(currentState[ASSET_REQUESTS_TABLE_NAME]);
    const seedToken = `${currentTable.ids.length}:${normalizedOwnerIds.join("|")}`;
    if (this.lastSeedToken !== seedToken) {
      const nextTable = this.mergeSeededRecords(currentTable, currentRequestsTable, normalizedOwnerIds, allUsers);
      if (nextTable.changed) {
        this.memoryDb.write((state) => __spreadProps(__spreadValues({}, state), {
          [ASSETS_TABLE_NAME]: nextTable.assetsTable,
          [ASSET_REQUESTS_TABLE_NAME]: nextTable.requestsTable
        }));
      }
      this.lastSeedToken = seedToken;
    }
    return this.peekOwnedAssetsByUsers(normalizedOwnerIds);
  }
  peekOwnedAssetsByUsers(userIds) {
    const table = this.normalizeCollection(this.memoryDb.read()[ASSETS_TABLE_NAME]);
    const assetsByUserId = /* @__PURE__ */ new Map();
    for (const userId of userIds) {
      const normalizedUserId = `${userId ?? ""}`.trim();
      if (!normalizedUserId) {
        continue;
      }
      const assets = (table.idsByOwnerUserId[normalizedUserId] ?? []).map((id) => table.byId[id]).filter((record) => Boolean(record)).filter((record) => !this.isSuppressedAssetStatus(record.status)).sort((left, right) => right.updatedMs - left.updatedMs);
      assetsByUserId.set(normalizedUserId, assets);
    }
    return assetsByUserId;
  }
  mergeSeededRecords(currentTable, currentRequestsTable, ownerUserIds, allUsers) {
    const sampleCards = SeedAssetBuilder.buildSampleAssetCards(allUsers);
    const sampleCardById = new Map(sampleCards.map((card) => [card.id, card]));
    const managedOwnerIds = new Set(ownerUserIds);
    const managedTemplateIds = new Set(sampleCards.map((card) => card.id));
    const desiredSeedAssetIds = new Set(ownerUserIds.flatMap((ownerUserId) => demoAssetTemplateIds(ownerUserId).map((templateId) => `${ownerUserId}:${templateId}`)));
    const usersById = new Map(allUsers.map((user) => [user.id, user]));
    const nextById = __spreadValues({}, currentTable.byId);
    let nextIds = [...currentTable.ids];
    const nextIdSet = new Set(nextIds);
    const nextIdsByOwnerUserId = this.cloneOwnerUserIdIndex(currentTable.idsByOwnerUserId);
    let nextRequestsTable = this.cloneRequestsCollection(currentRequestsTable);
    let changed = false;
    const isManagedSeedAssetId = (assetId) => {
      const separatorIndex = assetId.indexOf(":");
      if (separatorIndex <= 0)
        return false;
      return managedOwnerIds.has(assetId.slice(0, separatorIndex)) && managedTemplateIds.has(assetId.slice(separatorIndex + 1));
    };
    const staleSeedAssetIds = nextIds.filter((assetId) => isManagedSeedAssetId(assetId) && !desiredSeedAssetIds.has(assetId));
    if (staleSeedAssetIds.length > 0) {
      const staleSeedAssetIdSet = new Set(staleSeedAssetIds);
      for (const assetId of staleSeedAssetIds) {
        delete nextById[assetId];
        nextIdSet.delete(assetId);
      }
      nextIds = nextIds.filter((assetId) => !staleSeedAssetIdSet.has(assetId));
      for (const [ownerUserId, assetIds] of Object.entries(nextIdsByOwnerUserId)) {
        nextIdsByOwnerUserId[ownerUserId] = assetIds.filter((assetId) => !staleSeedAssetIdSet.has(assetId));
      }
      changed = true;
    }
    const managedRequestIds = new Set(nextRequestsTable.ids.filter((requestId) => {
      const request = nextRequestsTable.byId[requestId];
      return Boolean(request && isManagedSeedAssetId(request.assetId));
    }));
    if (managedRequestIds.size > 0) {
      for (const requestId of managedRequestIds)
        delete nextRequestsTable.byId[requestId];
      nextRequestsTable.ids = nextRequestsTable.ids.filter((requestId) => !managedRequestIds.has(requestId));
      for (const [ownerKey, requestIds] of Object.entries(nextRequestsTable.idsByOwnerKey)) {
        nextRequestsTable.idsByOwnerKey[ownerKey] = requestIds.filter((requestId) => !managedRequestIds.has(requestId));
      }
      changed = true;
    }
    for (const ownerUserId of ownerUserIds) {
      const owner = usersById.get(ownerUserId);
      if (!owner) {
        continue;
      }
      const ownerBucket = nextIdsByOwnerUserId[ownerUserId] ?? [];
      const ownerIdSet = new Set(ownerBucket);
      const createdAt = AppUtils.shiftDate(/* @__PURE__ */ new Date("2026-02-01T12:00:00.000Z"), SEED_SCHEDULE_REFERENCE_DATE, environment.bootstrapOffsetInDays);
      const ownerCards = demoAssetTemplateIds(ownerUserId).map((templateId) => sampleCardById.get(templateId)).filter((card) => Boolean(card));
      for (const [index, card] of ownerCards.entries()) {
        const id = `${ownerUserId}:${card.id}`;
        const presentation = demoAssetPlaceholder(`${ownerUserId}-${card.id}`);
        const seededCard = __spreadProps(__spreadValues({}, card), {
          title: presentation.title,
          subtitle: presentation.subtitle,
          category: presentation.category,
          details: presentation.details,
          imageUrl: presentation.imageUrl
        });
        const seededRequests = this.seedAssetRequests(id, seededCard, owner, allUsers, createdAt);
        for (const request of seededRequests) {
          const upserted = this.upsertAssetRequest(nextRequestsTable, request);
          nextRequestsTable = upserted.table;
          changed = upserted.changed || changed;
        }
        if (ownerIdSet.has(id)) {
          const existing = nextById[id];
          if (existing && (existing.title !== presentation.title || existing.subtitle !== presentation.subtitle || existing.category !== presentation.category || existing.details !== presentation.details || existing.imageUrl !== presentation.imageUrl || existing.visibility !== presentation.visibility || existing.status !== presentation.status || existing.statusBeforeSuppression !== null)) {
            nextById[id] = __spreadProps(__spreadValues({}, existing), {
              title: presentation.title,
              subtitle: presentation.subtitle,
              category: presentation.category,
              details: presentation.details,
              imageUrl: presentation.imageUrl,
              visibility: presentation.visibility,
              status: presentation.status,
              statusBeforeSuppression: null
            });
            changed = true;
          }
          continue;
        }
        const createdMs = createdAt.getTime() + index * 6e4;
        const createdAtIso = new Date(createdMs).toISOString();
        const record = __spreadProps(__spreadValues({}, seededCard), {
          id,
          city: owner.city || card.city,
          sourceLink: "",
          ownerUserId,
          ownerName: owner.name,
          visibility: presentation.visibility,
          status: presentation.status,
          statusBeforeSuppression: null,
          pricing: SeedAssetBuilder.clonePricingConfig(card.pricing) ?? void 0,
          policies: (card.policies ?? []).map((policy) => __spreadValues({}, policy)),
          requests: [],
          routes: [...card.routes ?? []],
          topics: [...card.topics ?? []],
          menuActions: [...card.menuActions ?? []],
          affinity: Math.max(0, Math.trunc(Number(owner.affinity) || 0)),
          boost: Math.max(0, 100 - index),
          createdAtIso,
          updatedAtIso: createdAtIso,
          createdMs,
          updatedMs: createdMs
        });
        nextById[id] = record;
        if (!nextIdSet.has(id)) {
          nextIds.unshift(id);
          nextIdSet.add(id);
        }
        ownerBucket.unshift(id);
        ownerIdSet.add(id);
        changed = true;
      }
      nextIdsByOwnerUserId[ownerUserId] = ownerBucket;
    }
    return {
      assetsTable: {
        byId: nextById,
        ids: nextIds,
        idsByOwnerUserId: nextIdsByOwnerUserId
      },
      requestsTable: nextRequestsTable,
      changed
    };
  }
  seedAssetRequests(assetId, card, owner, allUsers, anchorDate) {
    const members = allUsers.filter((user) => user.id !== owner.id).slice(0, 6);
    if (members.length === 0) {
      return [];
    }
    if (card.id === "asset-sup-1") {
      return [
        this.seedAssetRequest(assetId, owner.id, card, "camp-assigned-1", members[0], "manual", "accepted", anchorDate, 1, 9, 1, {
          quantity: 1,
          note: "Reserved and assigned by the owner.",
          eventTitle: "Trail Weekend",
          subEventTitle: "Base camp setup"
        }),
        this.seedAssetRequest(assetId, owner.id, card, "camp-borrow-1", members[1], "borrow", "accepted", anchorDate, 1, 10, 2, {
          quantity: 2,
          note: "Borrow request approved by the owner.",
          eventTitle: "Trail Weekend",
          subEventTitle: "Overnight gear"
        }),
        this.seedAssetRequest(assetId, owner.id, card, "camp-pending-1", members[2], "borrow", "pending", anchorDate, 1, 12, 1, {
          quantity: 1,
          note: "Awaiting owner confirmation.",
          eventTitle: "Trail Weekend",
          subEventTitle: "Extra lamp"
        }),
        this.seedAssetRequest(assetId, owner.id, card, "camp-borrow-2", members[3], "borrow", "accepted", anchorDate, 3, 14, 1, {
          quantity: 1,
          note: "Approved and synced with the plan.",
          eventTitle: "Lake Picnic",
          subEventTitle: "Shelter kit"
        }),
        this.seedAssetRequest(assetId, owner.id, card, "camp-pending-2", members[4] ?? members[0], "borrow", "pending", anchorDate, 6, 11, 2, {
          quantity: 2,
          note: "Awaiting owner confirmation.",
          eventTitle: "Outdoor Skills",
          subEventTitle: "Tent handoff"
        })
      ];
    }
    if (card.id === "asset-sup-3") {
      return [
        this.seedAssetRequest(assetId, owner.id, card, "kitchen-borrow-1", members[1], "borrow", "accepted", anchorDate, 2, 8, 2, {
          quantity: 2,
          note: "Borrow request approved by the owner.",
          eventTitle: "Field Breakfast",
          subEventTitle: "Cooking block"
        }),
        this.seedAssetRequest(assetId, owner.id, card, "kitchen-pending-1", members[2], "borrow", "pending", anchorDate, 2, 10, 1, {
          quantity: 1,
          note: "Awaiting owner confirmation.",
          eventTitle: "Field Breakfast",
          subEventTitle: "Serving tools"
        })
      ];
    }
    if (card.id === "asset-transport-3") {
      return [
        this.seedAssetRequest(assetId, owner.id, card, "van-borrow-1", members[3] ?? members[0], "borrow", "accepted", anchorDate, 4, 7, 1, {
          quantity: 1,
          note: "Borrow request approved by the owner.",
          eventTitle: "Volunteer Run",
          subEventTitle: "Morning transfer"
        }),
        this.seedAssetRequest(assetId, owner.id, card, "van-pending-1", members[4] ?? members[1], "borrow", "pending", anchorDate, 4, 13, 1, {
          quantity: 1,
          note: "Awaiting owner confirmation.",
          eventTitle: "Volunteer Run",
          subEventTitle: "Afternoon pickup"
        }),
        this.seedAssetRequest(assetId, owner.id, card, "van-borrow-2", members[1], "borrow", "accepted", anchorDate, 6, 16, 2, {
          quantity: 1,
          note: "Approved for the late volunteer transfer.",
          eventTitle: "Crew Shuttle",
          subEventTitle: "Evening return"
        })
      ];
    }
    if (card.id === "asset-transport-4") {
      return [
        this.seedAssetRequest(assetId, owner.id, card, "summit-assigned-1", members[0], "manual", "accepted", anchorDate, 7, 8, 1, {
          quantity: 1,
          note: "Assigned by the owner for the speaker transfer.",
          eventTitle: "Summit Logistics",
          subEventTitle: "Speaker pickup"
        }),
        this.seedAssetRequest(assetId, owner.id, card, "summit-pending-1", members[2], "borrow", "pending", anchorDate, 7, 10, 1, {
          quantity: 1,
          note: "Awaiting owner confirmation for the hotel return.",
          eventTitle: "Summit Logistics",
          subEventTitle: "Hotel return"
        }),
        this.seedAssetRequest(assetId, owner.id, card, "summit-borrow-1", members[4] ?? members[1], "borrow", "accepted", anchorDate, 9, 15, 2, {
          quantity: 1,
          note: "Borrow request approved for the afternoon transfer.",
          eventTitle: "Partner Meetup",
          subEventTitle: "Station transfer"
        })
      ];
    }
    return [];
  }
  seedAssetRequest(assetId, ownerUserId, card, requestKey, user, requestKind, status, anchorDate, offsetDays, hour, durationHours, options) {
    const start = this.seedRequestDate(anchorDate, offsetDays, hour);
    const end = new Date(start.getTime() + Math.max(1, durationHours) * 60 * 60 * 1e3);
    const requestedAtIso = AppUtils.addDays(start, -1).toISOString();
    const createdMs = start.getTime() - 24 * 60 * 60 * 1e3;
    return {
      id: `${assetId}:${requestKey}`,
      assetId,
      ownerUserId,
      ownerKey: this.assetRequestOwnerKey(assetId),
      assetCapacity: this.assetRequestCapacity(card),
      userId: user.id,
      name: user.name,
      initials: user.initials,
      gender: user.gender,
      status,
      note: options.note,
      requestKind,
      requestedAtIso,
      booking: {
        eventId: `${requestKey}:event`,
        eventTitle: options.eventTitle,
        subEventId: `${requestKey}:sub-event`,
        subEventTitle: options.subEventTitle,
        slotKey: `${requestKey}:slot`,
        slotLabel: options.subEventTitle,
        timeframe: `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} ${start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`,
        startAtIso: start.toISOString(),
        endAtIso: end.toISOString(),
        quantity: Math.max(1, Math.trunc(Number(options.quantity) || 1)),
        totalAmount: null,
        currency: null,
        acceptedPolicyIds: [],
        paymentSessionId: null,
        inventoryApplied: status === "accepted" && requestKind !== "manual"
      },
      menuActions: status === "accepted" && requestKind !== "manual" ? ["makeManager"] : [],
      createdMs,
      updatedMs: createdMs,
      createdAtIso: requestedAtIso,
      updatedAtIso: requestedAtIso
    };
  }
  seedRequestDate(anchorDate, offsetDays, hour) {
    const date = AppUtils.addDays(anchorDate, offsetDays);
    date.setHours(Math.max(0, Math.min(23, Math.trunc(hour))), 0, 0, 0);
    return date;
  }
  cloneAssetRequest(request) {
    return __spreadProps(__spreadValues({}, request), {
      booking: request.booking ? __spreadProps(__spreadValues({}, request.booking), {
        acceptedPolicyIds: [...request.booking.acceptedPolicyIds ?? []]
      }) : null,
      menuActions: [...request.menuActions ?? []]
    });
  }
  normalizeCollection(value) {
    const source = value;
    return {
      byId: source?.byId && typeof source.byId === "object" ? __spreadValues({}, source.byId) : {},
      ids: Array.isArray(source?.ids) ? source.ids.map((id) => String(id)).filter(Boolean) : [],
      idsByOwnerUserId: this.cloneOwnerUserIdIndex(source?.idsByOwnerUserId)
    };
  }
  normalizeRequestsCollection(value) {
    const source = value;
    return {
      byId: source?.byId && typeof source.byId === "object" ? __spreadValues({}, source.byId) : {},
      ids: Array.isArray(source?.ids) ? source.ids.map((id) => String(id)).filter(Boolean) : [],
      idsByOwnerKey: this.cloneOwnerUserIdIndex(source?.idsByOwnerKey)
    };
  }
  cloneRequestsCollection(table) {
    return {
      byId: Object.fromEntries(Object.entries(table.byId).map(([id, request]) => [id, this.cloneAssetRequest(request)])),
      ids: [...table.ids],
      idsByOwnerKey: this.cloneOwnerUserIdIndex(table.idsByOwnerKey)
    };
  }
  upsertAssetRequest(table, request) {
    const existing = table.byId[request.id];
    if (existing && existing.updatedAtIso === request.updatedAtIso) {
      return { table, changed: false };
    }
    const nextById = __spreadProps(__spreadValues({}, table.byId), {
      [request.id]: this.cloneAssetRequest(request)
    });
    const nextIds = table.ids.includes(request.id) ? [...table.ids] : [request.id, ...table.ids];
    const nextIdsByOwnerKey = this.cloneOwnerUserIdIndex(table.idsByOwnerKey);
    const ownerBucket = nextIdsByOwnerKey[request.ownerKey] ?? [];
    nextIdsByOwnerKey[request.ownerKey] = ownerBucket.includes(request.id) ? [...ownerBucket] : [request.id, ...ownerBucket];
    return {
      table: {
        byId: nextById,
        ids: nextIds,
        idsByOwnerKey: nextIdsByOwnerKey
      },
      changed: true
    };
  }
  assetRequestOwnerKey(assetId) {
    return `asset:${assetId.trim()}`;
  }
  storedQuantityValue(card) {
    const parsed = Math.trunc(Number(card.quantity));
    if (Number.isFinite(parsed) && parsed >= 0) {
      return parsed;
    }
    return this.normalizeQuantity(card.type, card.quantity, card.capacityTotal);
  }
  assetRequestCapacity(card) {
    if (card.type === ASSET_TYPE_SUPPLIES) {
      return this.storedQuantityValue(card);
    }
    const capacity = Math.trunc(Number(card.capacityTotal));
    return Number.isFinite(capacity) && capacity > 0 ? capacity : 1;
  }
  normalizeQuantity(type, value, capacityTotal) {
    const parsed = Math.trunc(Number(value));
    if (Number.isFinite(parsed) && parsed >= 0) {
      return parsed;
    }
    const capacity = Math.trunc(Number(capacityTotal));
    if (Number.isFinite(capacity) && capacity >= 0) {
      return capacity;
    }
    return type === ASSET_TYPE_SUPPLIES ? 6 : 1;
  }
  cloneOwnerUserIdIndex(value) {
    const next = {};
    for (const [ownerUserId, ids] of Object.entries(value ?? {})) {
      const normalizedOwnerUserId = ownerUserId.trim();
      if (!normalizedOwnerUserId || !Array.isArray(ids)) {
        continue;
      }
      next[normalizedOwnerUserId] = ids.map((id) => String(id)).filter(Boolean);
    }
    return next;
  }
  isSuppressedAssetStatus(status) {
    const normalized = `${status ?? ""}`.trim();
    return normalized === "UR" || normalized === "B" || normalized === "D" || normalized === "I" || normalized === "T";
  }
  static \u0275fac = function SeedAssetsRepository_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SeedAssetsRepository)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SeedAssetsRepository, factory: _SeedAssetsRepository.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SeedAssetsRepository, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/local/seed/repositories/chats-seed.repository.ts
var SeedChatsRepository = class _SeedChatsRepository {
  memoryDb = inject(LocalMemoryDb);
  initialized = false;
  seedRecords = null;
  seedDefaults() {
    if (this.initialized) {
      return;
    }
    const records = SeedChatsBuilder.buildSeedRecordCollection();
    this.seedRecords = this.cloneSeedRecords(records);
    this.memoryDb.write((currentState) => __spreadProps(__spreadValues({}, currentState), {
      [CHATS_TABLE_NAME]: records.chats,
      [CHAT_MESSAGES_TABLE_NAME]: records.chatMessages
    }));
    this.initialized = true;
  }
  seedContextualRecordsForUser(userId, eventRecords) {
    this.seedDefaults();
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return false;
    }
    const seeded = SeedChatsBuilder.buildContextualRecordCollectionForUser(normalizedUserId, eventRecords);
    if (seeded.chats.ids.length === 0) {
      return false;
    }
    this.mergeSeedRecords(seeded);
    this.memoryDb.write((currentState) => __spreadProps(__spreadValues({}, currentState), {
      [CHATS_TABLE_NAME]: this.mergeChatTable(currentState[CHATS_TABLE_NAME], seeded.chats),
      [CHAT_MESSAGES_TABLE_NAME]: this.mergeChatMessagesTable(currentState[CHAT_MESSAGES_TABLE_NAME], seeded.chatMessages),
      [USERS_TABLE_NAME]: this.applyStoredChatCounterChanges(currentState, normalizedUserId, seeded.chats)
    }));
    return true;
  }
  seedChatMessages(chat, messages) {
    const ownerUserId = `${chat.ownerUserId ?? ""}`.trim();
    const chatId = `${chat.id ?? ""}`.trim();
    if (!ownerUserId || !chatId || messages.length === 0) {
      return;
    }
    const normalizedMessages = this.applySeedUnreadState(chat, ownerUserId, messages);
    const unread = this.countUnreadMessages(normalizedMessages, ownerUserId);
    const messageRecords = normalizedMessages.map((message) => LocalChatMessageMapper.toRecord(ownerUserId, chatId, message));
    const latest = [...normalizedMessages].sort((left, right) => AppUtils.toSortableDate(right.sentAtIso) - AppUtils.toSortableDate(left.sentAtIso) || `${right.id ?? ""}`.localeCompare(`${left.id ?? ""}`))[0] ?? null;
    const recordKey = LocalChatThreadMapper.buildRecordKey(ownerUserId, chatId);
    const chatRecord = __spreadProps(__spreadValues({}, chat), {
      id: chatId,
      memberIds: [...chat.memberIds ?? []],
      unread,
      lastMessage: latest ? latest.text || this.chatAttachmentSummary(latest) || chat.lastMessage : chat.lastMessage,
      lastSenderId: latest?.senderAvatar.id ?? chat.lastSenderId,
      dateIso: latest?.sentAtIso ?? chat.dateIso,
      ownerUserId
    });
    const records = {
      chats: {
        byId: {
          [recordKey]: chatRecord
        },
        ids: [recordKey]
      },
      chatMessages: {
        byId: Object.fromEntries(messageRecords.map((message) => [message.recordId, message])),
        ids: messageRecords.map((message) => message.recordId),
        idsByChatKey: {
          [LocalChatMessageMapper.chatKey(ownerUserId, chatId)]: messageRecords.map((message) => message.recordId)
        }
      }
    };
    this.mergeSeedRecords(records);
    this.memoryDb.write((currentState) => __spreadProps(__spreadValues({}, currentState), {
      [CHATS_TABLE_NAME]: this.mergeChatTable(currentState[CHATS_TABLE_NAME], records.chats),
      [CHAT_MESSAGES_TABLE_NAME]: this.mergeChatMessagesTable(currentState[CHAT_MESSAGES_TABLE_NAME], records.chatMessages)
    }));
  }
  applySeedUnreadState(chat, ownerUserId, messages) {
    const unreadTarget = Math.max(0, Math.trunc(Number(chat.unread) || 0));
    const incomingIndexes = messages.map((message, index) => ({ message, index })).filter((entry) => !entry.message.mine && `${entry.message.senderAvatar?.id ?? ""}`.trim() !== ownerUserId).sort((left, right) => AppUtils.toSortableDate(right.message.sentAtIso) - AppUtils.toSortableDate(left.message.sentAtIso) || `${right.message.id ?? ""}`.localeCompare(`${left.message.id ?? ""}`)).map((entry) => entry.index);
    const unreadIndexes = new Set(incomingIndexes.slice(0, unreadTarget));
    const reader = this.seedReader(ownerUserId, messages);
    return messages.map((message, index) => {
      if (message.mine || `${message.senderAvatar?.id ?? ""}`.trim() === ownerUserId) {
        return message;
      }
      return unreadIndexes.has(index) ? this.withoutMessageReader(message, ownerUserId) : this.withMessageReader(message, reader);
    });
  }
  seedReader(ownerUserId, messages) {
    const avatar = messages.map((message) => message.senderAvatar).find((candidate) => `${candidate?.id ?? ""}`.trim() === ownerUserId) ?? messages.flatMap((message) => message.readBy ?? []).find((candidate) => `${candidate?.id ?? ""}`.trim() === ownerUserId) ?? null;
    return {
      id: ownerUserId,
      initials: `${avatar?.initials ?? ""}`.trim() || AppUtils.initialsFromText(ownerUserId),
      gender: avatar?.gender ?? "man",
      imageUrl: avatar?.imageUrl ?? null
    };
  }
  withoutMessageReader(message, ownerUserId) {
    const readBy = (message.readBy ?? []).filter((reader) => `${reader.id ?? ""}`.trim() !== ownerUserId);
    return readBy.length === (message.readBy ?? []).length ? message : __spreadProps(__spreadValues({}, message), {
      readBy
    });
  }
  withMessageReader(message, reader) {
    if ((message.readBy ?? []).some((entry) => `${entry.id ?? ""}`.trim() === reader.id)) {
      return message;
    }
    return __spreadProps(__spreadValues({}, message), {
      readBy: [...message.readBy ?? [], reader]
    });
  }
  countUnreadMessages(messages, ownerUserId) {
    return messages.filter((message) => !message.mine && `${message.senderAvatar?.id ?? ""}`.trim() !== ownerUserId && !(message.readBy ?? []).some((reader) => `${reader.id ?? ""}`.trim() === ownerUserId)).length;
  }
  queryChatItemById(userId, chatId) {
    const normalizedUserId = `${userId ?? ""}`.trim();
    const normalizedChatId = `${chatId ?? ""}`.trim();
    if (!normalizedUserId || !normalizedChatId) {
      return null;
    }
    const record = this.seedRecords?.chats.byId[LocalChatThreadMapper.buildRecordKey(normalizedUserId, normalizedChatId)];
    return record ? LocalChatThreadMapper.cloneRecord(record) : null;
  }
  queryChatMessagesPage(chat, page, pageSize) {
    const ownerUserId = typeof chat.ownerUserId === "string" ? `${chat.ownerUserId ?? ""}`.trim() : "";
    const sourceId = `${chat.id ?? ""}`.trim();
    if (!ownerUserId || !sourceId || !this.seedRecords) {
      return [];
    }
    const record = this.seedRecords.chats.byId[LocalChatThreadMapper.buildRecordKey(ownerUserId, sourceId)];
    if (!record) {
      return [];
    }
    const normalizedPage = Math.max(0, Math.trunc(Number(page) || 0));
    const normalizedPageSize = Math.max(1, Math.trunc(Number(pageSize) || 20));
    const start = normalizedPage * normalizedPageSize;
    const chatKey = LocalChatMessageMapper.chatKey(ownerUserId, sourceId);
    const snapshot = this.seedRecords.chatMessages;
    const orderedIds = snapshot.idsByChatKey[chatKey] ?? [];
    const pageRecords = orderedIds.slice().reverse().slice(start, start + normalizedPageSize).map((id) => snapshot.byId[id]).filter((message) => Boolean(message));
    return LocalChatMessageMapper.toDtoList(pageRecords);
  }
  upsertMessageRecord(table, message) {
    if (!message.recordId) {
      return table;
    }
    const chatKey = LocalChatMessageMapper.chatKey(message.ownerUserId, message.chatId);
    const nextById = __spreadProps(__spreadValues({}, table.byId), {
      [message.recordId]: message
    });
    const nextIds = table.ids.includes(message.recordId) ? [...table.ids] : [...table.ids, message.recordId];
    const nextChatIds = table.idsByChatKey[chatKey]?.includes(message.recordId) ? [...table.idsByChatKey[chatKey]] : [...table.idsByChatKey[chatKey] ?? [], message.recordId];
    nextChatIds.sort((leftId, rightId) => {
      const left = nextById[leftId];
      const right = nextById[rightId];
      return left && right ? AppUtils.toSortableDate(left.sentAtIso) - AppUtils.toSortableDate(right.sentAtIso) || `${left.messageId ?? ""}`.localeCompare(`${right.messageId ?? ""}`) : left ? -1 : right ? 1 : 0;
    });
    return {
      byId: nextById,
      ids: nextIds,
      idsByChatKey: __spreadProps(__spreadValues({}, table.idsByChatKey), {
        [chatKey]: nextChatIds
      })
    };
  }
  chatAttachmentSummary(message) {
    const firstAttachment = message.attachments?.[0];
    if (!firstAttachment) {
      return "";
    }
    if (firstAttachment.type === "image") {
      return "Sent an image";
    }
    if (firstAttachment.type === "event") {
      return "Shared an event";
    }
    if (firstAttachment.type === "asset") {
      return "Shared an asset";
    }
    return firstAttachment.title || "Shared an attachment";
  }
  mergeSeedRecords(records) {
    const current = this.seedRecords ?? {
      chats: { byId: {}, ids: [] },
      chatMessages: { byId: {}, ids: [], idsByChatKey: {} }
    };
    this.seedRecords = {
      chats: this.mergeChatTable(current.chats, records.chats),
      chatMessages: this.mergeChatMessagesTable(current.chatMessages, records.chatMessages)
    };
  }
  mergeChatTable(current, incoming) {
    const byId = __spreadValues({}, current.byId);
    const ids = [...current.ids];
    for (const id of incoming.ids) {
      const record = incoming.byId[id];
      if (!record) {
        continue;
      }
      byId[id] = LocalChatThreadMapper.cloneRecord(record);
      if (!ids.includes(id)) {
        ids.push(id);
      }
    }
    return { byId, ids };
  }
  applyStoredChatCounterChanges(state, userId, incoming) {
    const users = state[USERS_TABLE_NAME];
    const user = users.byId[userId];
    if (!user) {
      return users;
    }
    const normalize = (value) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? Math.max(0, Math.trunc(parsed)) : 0;
    };
    const counters = {
      all: normalize(user.activities.chat?.all ?? user.activities.chats),
      event: normalize(user.activities.chat?.event),
      subEvent: normalize(user.activities.chat?.subEvent),
      group: normalize(user.activities.chat?.group),
      service: normalize(user.activities.chat?.service),
      appSupport: normalize(user.activities.chat?.appSupport)
    };
    for (const id of incoming.ids) {
      const previous = state[CHATS_TABLE_NAME].byId[id];
      const next = incoming.byId[id];
      if (previous) {
        this.addChatUnread(counters, previous, -1);
      }
      if (next) {
        this.addChatUnread(counters, next, 1);
      }
    }
    const nextUser = __spreadProps(__spreadValues({}, user), {
      activities: __spreadProps(__spreadValues({}, user.activities), {
        chats: counters.all,
        chat: counters
      })
    });
    return {
      byId: __spreadProps(__spreadValues({}, users.byId), { [userId]: nextUser }),
      ids: [...users.ids]
    };
  }
  addChatUnread(counters, chat, direction) {
    const delta = direction * Math.max(0, Math.trunc(Number(chat.unread) || 0));
    counters.all = Math.max(0, counters.all + delta);
    const key = this.chatCounterKey(chat.channelType);
    if (key) {
      counters[key] = Math.max(0, counters[key] + delta);
    }
  }
  chatCounterKey(channelType) {
    switch (channelType) {
      case "mainEvent":
        return "event";
      case "optionalSubEvent":
        return "subEvent";
      case "groupSubEvent":
        return "group";
      case "serviceEvent":
        return "service";
      case "appSupport":
      case "supportCase":
        return "appSupport";
      default:
        return null;
    }
  }
  mergeChatMessagesTable(current, incoming) {
    let next = current;
    for (const id of incoming.ids) {
      const record = incoming.byId[id];
      if (record) {
        next = this.upsertMessageRecord(next, record);
      }
    }
    return next;
  }
  cloneSeedRecords(records) {
    return {
      chats: this.mergeChatTable({ byId: {}, ids: [] }, records.chats),
      chatMessages: this.mergeChatMessagesTable({ byId: {}, ids: [], idsByChatKey: {} }, records.chatMessages)
    };
  }
  static \u0275fac = function SeedChatsRepository_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SeedChatsRepository)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SeedChatsRepository, factory: _SeedChatsRepository.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SeedChatsRepository, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/local/seed/repositories/users-ratings-seed.repository.ts
var SeedUsersRatingsRepository = class _SeedUsersRatingsRepository {
  static DEFAULT_DEMO_USERS_COUNT = 50;
  static MIN_ACTIVITY_RATE_CONNECTIONS = 8;
  static DEMO_ACTIVITY_RATE_SEED_COVERAGE_RATIO = 0.25;
  static FEATURED_DEMO_ACTIVITY_RATE_OWNER_COUNT = 3;
  static FEATURED_DEMO_ACTIVITY_RATE_EXTRA_SINGLE_GIVEN_COUNT = 4;
  static DEFAULT_DEMO_ACTIVITY_RATE_EXTRA_SINGLE_GIVEN_COUNT = 1;
  static MAX_DEMO_ACTIVITY_RATE_BOOTSTRAP_RECORDS = 1e3;
  memoryDb = inject(LocalMemoryDb);
  initialized = false;
  seedDefaults(seedUsers) {
    if (this.initialized) {
      return;
    }
    const users = seedUsers?.length ? [...seedUsers] : this.querySeedUsers();
    const visibleSeedUsers = users.filter((user) => UserProfileState.isActivityRateVisibleProfile(user));
    const ownerIdsToSeed = this.collectOwnerIdsNeedingActivityRateSeed(visibleSeedUsers);
    const currentRatesCount = this.memoryDb.read()[USER_RATES_TABLE_NAME].ids.length;
    const remainingBootstrapSlots = Math.max(0, _SeedUsersRatingsRepository.MAX_DEMO_ACTIVITY_RATE_BOOTSTRAP_RECORDS - currentRatesCount);
    if (ownerIdsToSeed.length === 0 || remainingBootstrapSlots <= 0) {
      this.initialized = true;
      return;
    }
    const records = [];
    for (let ownerIndex = 0; ownerIndex < ownerIdsToSeed.length; ownerIndex += 1) {
      const ownerUserId = ownerIdsToSeed[ownerIndex];
      if (!ownerUserId) {
        continue;
      }
      const ownerGraphCohortUsers = this.graphSeedCohortUsers(visibleSeedUsers, ownerUserId);
      const ownerRecords = SeedUserRatesBuilder.buildGeneratedRateItemsForUser(ownerGraphCohortUsers, ownerUserId, {
        extraSingleGivenCount: ownerIndex < _SeedUsersRatingsRepository.FEATURED_DEMO_ACTIVITY_RATE_OWNER_COUNT ? _SeedUsersRatingsRepository.FEATURED_DEMO_ACTIVITY_RATE_EXTRA_SINGLE_GIVEN_COUNT : _SeedUsersRatingsRepository.DEFAULT_DEMO_ACTIVITY_RATE_EXTRA_SINGLE_GIVEN_COUNT,
        userCoverageRatio: _SeedUsersRatingsRepository.DEMO_ACTIVITY_RATE_SEED_COVERAGE_RATIO
      }).map((item) => LocalUserRatesMapper.toRecord(ownerUserId, item));
      if (records.length + ownerRecords.length > remainingBootstrapSlots) {
        break;
      }
      records.push(...ownerRecords);
    }
    if (records.length === 0) {
      this.initialized = true;
      return;
    }
    this.memoryDb.write((state) => {
      const current = state[USER_RATES_TABLE_NAME];
      const byId = __spreadValues({}, current.byId);
      const ids = [...current.ids];
      const existingIds = new Set(ids);
      for (const record of records) {
        byId[record.id] = __spreadValues({}, record);
        if (!existingIds.has(record.id)) {
          existingIds.add(record.id);
          ids.push(record.id);
        }
      }
      return __spreadProps(__spreadValues({}, state), {
        [USER_RATES_TABLE_NAME]: this.rebuildUserRatesTableIndex(__spreadProps(__spreadValues({}, current), {
          byId,
          ids
        }))
      });
    });
    this.initialized = true;
  }
  querySeedUsers() {
    const usersTable = this.memoryDb.read()[USERS_TABLE_NAME];
    if (usersTable.ids.length > 0) {
      return usersTable.ids.map((id) => usersTable.byId[id]).filter((user) => Boolean(user?.id?.trim()));
    }
    return SeedUserBuilder.buildExpandedDemoUsers(_SeedUsersRatingsRepository.DEFAULT_DEMO_USERS_COUNT);
  }
  collectOwnerIdsNeedingActivityRateSeed(users) {
    const counterpartIdsByOwner = /* @__PURE__ */ new Map();
    for (const user of users) {
      const ownerUserId = user.id.trim();
      if (!ownerUserId) {
        continue;
      }
      counterpartIdsByOwner.set(ownerUserId, /* @__PURE__ */ new Set());
    }
    const ratesTable = this.memoryDb.read()[USER_RATES_TABLE_NAME];
    for (const id of ratesTable.ids) {
      const record = ratesTable.byId[id];
      if (!record) {
        continue;
      }
      const ownerUserId = record.ownerUserId?.trim() ?? "";
      const bucket = counterpartIdsByOwner.get(ownerUserId);
      if (!bucket) {
        continue;
      }
      for (const counterpartUserId of this.activityRateCounterpartUserIds(record, ownerUserId)) {
        if (counterpartUserId) {
          bucket.add(counterpartUserId);
        }
      }
    }
    return [...counterpartIdsByOwner.entries()].filter(([, counterpartIds]) => counterpartIds.size < _SeedUsersRatingsRepository.MIN_ACTIVITY_RATE_CONNECTIONS).map(([ownerUserId]) => ownerUserId);
  }
  graphSeedCohortUsers(users, ownerUserId) {
    if (users.length < _SeedUsersRatingsRepository.MIN_ACTIVITY_RATE_CONNECTIONS * 2) {
      return users;
    }
    const midpoint = Math.ceil(users.length * 2 / 3);
    const ownerIndex = users.findIndex((user) => user.id.trim() === ownerUserId.trim());
    if (ownerIndex < 0) {
      return users;
    }
    const cohortStart = ownerIndex < midpoint ? 0 : midpoint;
    const cohortEnd = ownerIndex < midpoint ? midpoint : users.length;
    return users.slice(cohortStart, cohortEnd);
  }
  activityRateCounterpartUserIds(record, ownerUserId) {
    const normalizedOwnerUserId = ownerUserId.trim();
    if (!normalizedOwnerUserId) {
      return [];
    }
    if (record.mode === "pair" && record.ownerUserId?.trim() === normalizedOwnerUserId) {
      return [record.fromUserId.trim(), record.toUserId.trim()].filter((userId) => userId.length > 0 && userId !== normalizedOwnerUserId);
    }
    if (record.fromUserId.trim() === normalizedOwnerUserId) {
      return [record.toUserId.trim()].filter(Boolean);
    }
    if (record.toUserId.trim() === normalizedOwnerUserId) {
      return [record.fromUserId.trim()].filter(Boolean);
    }
    return [];
  }
  rebuildUserRatesTableIndex(table) {
    const idsByRelevantUserId = {};
    for (const id of table.ids) {
      const record = table.byId[id];
      if (!record) {
        continue;
      }
      for (const userId of this.relevantUserRateUserIds(record)) {
        const bucket = idsByRelevantUserId[userId] ?? [];
        bucket.push(id);
        idsByRelevantUserId[userId] = bucket;
      }
    }
    for (const ids of Object.values(idsByRelevantUserId)) {
      ids.sort((leftId, rightId) => {
        const left = table.byId[leftId];
        const right = table.byId[rightId];
        return this.dynamicRecordDateValue(right) - this.dynamicRecordDateValue(left);
      });
    }
    return __spreadProps(__spreadValues({}, table), {
      idsByRelevantUserId
    });
  }
  relevantUserRateUserIds(record) {
    return [...new Set([record.ownerUserId, record.fromUserId, record.toUserId].map((value) => `${value ?? ""}`.trim()).filter(Boolean))];
  }
  dynamicRecordDateValue(record) {
    return AppUtils.toSortableDate(record?.happenedAtIso ?? record?.updatedAtIso ?? record?.createdAtIso ?? "");
  }
  static \u0275fac = function SeedUsersRatingsRepository_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SeedUsersRatingsRepository)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SeedUsersRatingsRepository, factory: _SeedUsersRatingsRepository.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SeedUsersRatingsRepository, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/local/seed/repositories/users-seed.repository.ts
var SeedUsersRepository = class _SeedUsersRepository {
  static DEFAULT_DEMO_USERS_COUNT = 50;
  static INITIAL_EVENT_FEEDBACK_UNLOCK_DELAY_MS = 2 * 60 * 60 * 1e3;
  memoryDb = inject(LocalMemoryDb);
  initialized = false;
  async whenReady() {
    await this.memoryDb.whenReady();
  }
  queryUserById(userId) {
    const normalizedUserId = `${userId ?? ""}`.trim();
    if (!normalizedUserId) {
      return null;
    }
    const user = this.memoryDb.read()[USERS_TABLE_NAME].byId[normalizedUserId];
    return user ?? null;
  }
  upsertUser(user) {
    const userId = `${user.id ?? ""}`.trim();
    if (!userId) {
      return user;
    }
    const saved = user.id === userId ? user : __spreadProps(__spreadValues({}, user), { id: userId });
    this.memoryDb.write((currentState) => {
      const usersTable = currentState[USERS_TABLE_NAME];
      return __spreadProps(__spreadValues({}, currentState), {
        [USERS_TABLE_NAME]: {
          byId: __spreadProps(__spreadValues({}, usersTable.byId), {
            [userId]: saved
          }),
          ids: usersTable.ids.includes(userId) ? [...usersTable.ids] : [...usersTable.ids, userId]
        }
      });
    });
    return saved;
  }
  seedDefaults() {
    if (this.initialized) {
      this.synchronizeSeededTicketCounts();
      return this.queryUsersFromTable();
    }
    const state = this.memoryDb.read();
    const usersTable = state[USERS_TABLE_NAME];
    const seededUsers = SeedUserBuilder.buildExpandedDemoUsers(_SeedUsersRepository.DEFAULT_DEMO_USERS_COUNT);
    if (usersTable.ids.length > 0) {
      const migration = this.mergeSeededUsers(usersTable, seededUsers);
      if (migration.changed) {
        this.memoryDb.write((currentState) => __spreadProps(__spreadValues({}, currentState), {
          [USERS_TABLE_NAME]: migration.table
        }));
      }
      this.initialized = true;
      this.synchronizeSeededTicketCounts();
      return this.queryUsersFromTable();
    }
    this.memoryDb.write((currentState) => __spreadProps(__spreadValues({}, currentState), {
      [USERS_TABLE_NAME]: this.buildUsersTable(seededUsers)
    }));
    this.initialized = true;
    this.synchronizeSeededTicketCounts();
    return this.queryUsersFromTable();
  }
  synchronizeSeededTicketCounts() {
    const usersTable = this.memoryDb.read()[USERS_TABLE_NAME];
    let changed = false;
    const byId = __spreadValues({}, usersTable.byId);
    for (const userId of usersTable.ids) {
      const user = usersTable.byId[userId];
      if (!user) {
        continue;
      }
      const tickets = this.countTicketItemsByUser(userId);
      if (user.activities.tickets === tickets && user.activities.asset?.tickets === tickets) {
        continue;
      }
      byId[userId] = __spreadProps(__spreadValues({}, user), {
        activities: __spreadProps(__spreadValues({}, user.activities), {
          tickets,
          asset: __spreadProps(__spreadValues({}, user.activities.asset), {
            tickets
          })
        })
      });
      changed = true;
    }
    if (!changed) {
      return;
    }
    this.memoryDb.write((currentState) => __spreadProps(__spreadValues({}, currentState), {
      [USERS_TABLE_NAME]: {
        byId,
        ids: [...usersTable.ids]
      }
    }));
  }
  seedDefaultUserFilterPreferencesForUser(userId) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return false;
    }
    const state = this.memoryDb.read();
    const user = state[USERS_TABLE_NAME].byId[normalizedUserId];
    const filterTable = state[USER_FILTER_PREFERENCES_TABLE_NAME];
    if (!user || Object.prototype.hasOwnProperty.call(filterTable.byId, normalizedUserId)) {
      return false;
    }
    this.memoryDb.write((current) => {
      const currentFilterTable = current[USER_FILTER_PREFERENCES_TABLE_NAME];
      if (Object.prototype.hasOwnProperty.call(currentFilterTable.byId, normalizedUserId)) {
        return current;
      }
      return __spreadProps(__spreadValues({}, current), {
        [USER_FILTER_PREFERENCES_TABLE_NAME]: {
          byId: __spreadProps(__spreadValues({}, currentFilterTable.byId), {
            [normalizedUserId]: LocalUserFilterPreferencesMapper.toRecord(defaultUserGameFilterPreferences())
          }),
          ids: currentFilterTable.ids.includes(normalizedUserId) ? [...currentFilterTable.ids] : [...currentFilterTable.ids, normalizedUserId]
        }
      });
    });
    return true;
  }
  stampSeededActivityCountsForUser(userId) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return false;
    }
    const table = this.memoryDb.read()[USERS_TABLE_NAME];
    const user = table.byId[normalizedUserId];
    if (!user) {
      return false;
    }
    const stampedUser = this.applySeededActivityCounts(user);
    if (this.sameActivityCounts(user, stampedUser)) {
      return false;
    }
    this.memoryDb.write((currentState) => __spreadProps(__spreadValues({}, currentState), {
      [USERS_TABLE_NAME]: {
        byId: __spreadProps(__spreadValues({}, currentState[USERS_TABLE_NAME].byId), {
          [normalizedUserId]: stampedUser
        }),
        ids: [...currentState[USERS_TABLE_NAME].ids]
      }
    }));
    return true;
  }
  stampSeededImpressionsForUser(userId) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return false;
    }
    const table = this.memoryDb.read()[USERS_TABLE_NAME];
    const user = table.byId[normalizedUserId];
    if (!user) {
      return false;
    }
    const stampedUser = SeedUserImpressionsBuilder.withSeededImpressions(user);
    if (this.sameImpressions(user, stampedUser)) {
      return false;
    }
    this.memoryDb.write((currentState) => __spreadProps(__spreadValues({}, currentState), {
      [USERS_TABLE_NAME]: {
        byId: __spreadProps(__spreadValues({}, currentState[USERS_TABLE_NAME].byId), {
          [normalizedUserId]: stampedUser
        }),
        ids: [...currentState[USERS_TABLE_NAME].ids]
      }
    }));
    return true;
  }
  mergeSeededUsers(currentTable, seededUsers) {
    const nextById = __spreadValues({}, currentTable.byId);
    const nextIds = [...currentTable.ids];
    let changed = false;
    for (const seededUser of seededUsers) {
      const userId = seededUser.id.trim();
      if (!userId) {
        continue;
      }
      const existing = currentTable.byId[userId];
      if (!existing) {
        nextById[userId] = seededUser;
        nextIds.push(userId);
        changed = true;
        continue;
      }
      if (this.shouldStampCurrentProfileFormVersion(existing, seededUser)) {
        nextById[userId] = __spreadProps(__spreadValues({}, existing), {
          profileFormVersion: seededUser.profileFormVersion
        });
        changed = true;
      }
    }
    return {
      table: {
        byId: nextById,
        ids: [...new Set(nextIds)]
      },
      changed
    };
  }
  buildUsersTable(users) {
    const byId = {};
    const ids = [];
    for (const user of users) {
      const userId = user.id.trim();
      if (!userId) {
        continue;
      }
      byId[userId] = user;
      ids.push(userId);
    }
    return {
      byId,
      ids
    };
  }
  shouldStampCurrentProfileFormVersion(existing, seeded) {
    const existingVersion = Math.trunc(Number(existing.profileFormVersion) || 0);
    const seededVersion = Math.trunc(Number(seeded.profileFormVersion) || 0);
    return existingVersion <= 0 && seededVersion > 0 && this.hasRequiredProfileFields(existing);
  }
  hasRequiredProfileFields(user) {
    return Boolean(user.name?.trim() && user.birthday?.trim() && user.city?.trim() && user.height?.trim() && user.physique?.trim() && (user.languages ?? []).some((language) => language.trim().length > 0));
  }
  queryUsersFromTable() {
    const users = this.memoryDb.read()[USERS_TABLE_NAME];
    return users.ids.map((id) => users.byId[id]).filter((user) => Boolean(user));
  }
  applySeededActivityCounts(user) {
    if (UserProfileState.isEmptyOnboardingProfile(user)) {
      return __spreadProps(__spreadValues({}, user), {
        activities: {
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
          notifications: user.activities?.notifications ?? 0,
          chat: {
            all: 0,
            event: 0,
            subEvent: 0,
            group: 0,
            service: 0,
            appSupport: 0
          },
          event: {
            all: 0,
            active: 0,
            pending: 0,
            invitations: 0,
            hosting: 0,
            drafts: 0,
            trash: 0
          },
          asset: {
            cars: 0,
            accommodation: 0,
            supplies: 0,
            tickets: 0
          },
          eventFeedback: {
            ownEvents: 0,
            pending: 0,
            feedbacked: 0,
            removed: 0
          },
          adminJobs: user.activities?.adminJobs ?? 0,
          adminMetrics: user.activities?.adminMetrics ?? 0
        }
      });
    }
    return this.applyDerivedActivityCounts(user, __spreadProps(__spreadValues({
      invitationItems: this.queryInvitationItemsByUser(user.id),
      eventsCount: this.countUpcomingActiveEventItemsByUser(user.id),
      hostingItems: this.queryHostingItemsByUser(user.id),
      rateItems: this.queryActivityRateItemsByUserId(user.id)
    }, this.countOwnedAssetsByType(user.id)), {
      ticketsCount: this.countTicketItemsByUser(user.id),
      contactsCount: user.activities?.contacts ?? 0,
      feedbackCount: this.countPendingEventFeedbackByUser(user.id, _SeedUsersRepository.INITIAL_EVENT_FEEDBACK_UNLOCK_DELAY_MS),
      feedbackOwnEventsCount: this.countSubmittedFeedbackForOwnedEventsByUser(user.id)
    }));
  }
  applyDerivedActivityCounts(user, sources) {
    const normalizeCounter = (value) => {
      const count = Number(value);
      return Number.isFinite(count) ? Math.max(0, Math.trunc(count)) : 0;
    };
    const activities = user.activities;
    const chats = normalizeCounter(activities.chats);
    const chat = {
      all: normalizeCounter(activities.chat?.all ?? chats),
      event: normalizeCounter(activities.chat?.event),
      subEvent: normalizeCounter(activities.chat?.subEvent),
      group: normalizeCounter(activities.chat?.group),
      service: normalizeCounter(activities.chat?.service),
      appSupport: normalizeCounter(activities.chat?.appSupport)
    };
    const invitations = sources.invitationItems ? sources.invitationItems.length : activities.invitations;
    const events = Number.isFinite(sources.eventsCount) ? normalizeCounter(sources.eventsCount) : activities.events;
    const hosting = sources.hostingItems ? sources.hostingItems.length : activities.hosting;
    const game = sources.rateItems ? sources.rateItems.length : activities.game;
    const cars = Number.isFinite(sources.carsCount) ? normalizeCounter(sources.carsCount) : activities.cars;
    const accommodation = Number.isFinite(sources.accommodationCount) ? normalizeCounter(sources.accommodationCount) : activities.accommodation;
    const supplies = Number.isFinite(sources.suppliesCount) ? normalizeCounter(sources.suppliesCount) : activities.supplies;
    const tickets = Number.isFinite(sources.ticketsCount) ? normalizeCounter(sources.ticketsCount) : activities.tickets;
    const contacts = Number.isFinite(sources.contactsCount) ? normalizeCounter(sources.contactsCount) : activities.contacts;
    const fallbackFeedback = Number.isFinite(sources.feedbackCount) ? normalizeCounter(sources.feedbackCount) : normalizeCounter(activities.feedback);
    const event = activities.event;
    const asset = activities.asset;
    const eventFeedback = activities.eventFeedback;
    const hasEventSources = Boolean(sources.invitationItems) || Number.isFinite(sources.eventsCount) || Boolean(sources.hostingItems);
    const eventPending = normalizeCounter(event?.pending);
    const eventDrafts = sources.hostingItems ? sources.hostingItems.filter((item) => this.isDraftEventStatus(item.status)).length : normalizeCounter(event?.drafts);
    const eventTrash = normalizeCounter(event?.trash);
    const eventActive = hasEventSources ? events : normalizeCounter(event?.active ?? events);
    const eventInvitations = hasEventSources ? invitations : normalizeCounter(event?.invitations ?? invitations);
    const eventHosting = hasEventSources ? hosting : normalizeCounter(event?.hosting ?? hosting);
    const eventAll = hasEventSources ? eventActive + eventPending + eventInvitations + eventHosting : normalizeCounter(event?.all ?? events + invitations + hosting);
    const assetCars = Number.isFinite(sources.carsCount) ? cars : normalizeCounter(asset?.cars ?? cars);
    const assetAccommodation = Number.isFinite(sources.accommodationCount) ? accommodation : normalizeCounter(asset?.accommodation ?? accommodation);
    const assetSupplies = Number.isFinite(sources.suppliesCount) ? supplies : normalizeCounter(asset?.supplies ?? supplies);
    const assetTickets = Number.isFinite(sources.ticketsCount) ? tickets : normalizeCounter(asset?.tickets ?? tickets);
    const eventFeedbackPending = Number.isFinite(sources.feedbackCount) ? fallbackFeedback : normalizeCounter(eventFeedback?.pending ?? fallbackFeedback);
    const eventFeedbackOwnEvents = Number.isFinite(sources.feedbackOwnEventsCount) ? normalizeCounter(sources.feedbackOwnEventsCount) : normalizeCounter(eventFeedback?.ownEvents);
    const feedback = eventFeedbackPending + eventFeedbackOwnEvents;
    return __spreadProps(__spreadValues({}, user), {
      activities: __spreadProps(__spreadValues({}, activities), {
        chats,
        chat,
        invitations,
        events,
        hosting,
        game,
        cars,
        accommodation,
        supplies,
        tickets,
        contacts,
        feedback,
        event: {
          all: eventAll,
          active: eventActive,
          pending: eventPending,
          invitations: eventInvitations,
          hosting: eventHosting,
          drafts: eventDrafts,
          trash: eventTrash
        },
        asset: {
          cars: assetCars,
          accommodation: assetAccommodation,
          supplies: assetSupplies,
          tickets: assetTickets
        },
        eventFeedback: {
          ownEvents: eventFeedbackOwnEvents,
          pending: eventFeedbackPending,
          feedbacked: normalizeCounter(eventFeedback?.feedbacked),
          removed: normalizeCounter(eventFeedback?.removed)
        }
      })
    });
  }
  queryInvitationItemsByUser(userId) {
    return this.queryUserEventRecords(userId).filter((record) => this.eventInvitedMemberUserIds(record).includes(userId.trim())).filter((record) => record.status !== "T").map((record) => ({ unread: Math.max(0, Math.trunc(Number(record.unread) || 0)) }));
  }
  queryHostingItemsByUser(userId) {
    return this.queryUserEventRecords(userId).filter((record) => this.isEventAdminRecord(record, userId)).filter((record) => record.status !== "T").map((record) => ({
      activity: Math.max(0, Math.trunc(Number(record.activity) || 0)),
      status: record.status
    }));
  }
  countUpcomingActiveEventItemsByUser(userId) {
    return this.queryUserEventRecords(userId).filter((record) => !this.isEventAdminRecord(record, userId)).filter((record) => !this.eventInvitedMemberUserIds(record).includes(userId.trim())).filter((record) => record.status !== "T").filter((record) => this.isPublishedEventStatus(record.status)).length;
  }
  isPublishedEventStatus(status) {
    return `${status ?? "A"}`.trim() === "A";
  }
  isDraftEventStatus(status) {
    return `${status ?? ""}`.trim() === "DR";
  }
  countTicketItemsByUser(userId) {
    const normalizedUserId = userId.trim();
    const table = this.memoryDb.read()[EVENT_TICKETS_TABLE_NAME];
    return table.ids.map((id) => table.byId[id]).filter((ticket) => ticket?.holderUserId === normalizedUserId && ticket.status === "A").length;
  }
  countPendingEventFeedbackByUser(userId, feedbackUnlockDelayMs) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return 0;
    }
    const feedbackTable = this.memoryDb.read()[EVENT_FEEDBACK_TABLE_NAME];
    const nowMs = Date.now();
    return this.queryUserEventRecords(normalizedUserId).filter((item) => {
      if (this.isEventAdminRecord(item, normalizedUserId) || this.eventInvitedMemberUserIds(item).includes(normalizedUserId) || !this.eventAcceptedMemberUserIds(item).includes(normalizedUserId) || item.status === "T") {
        return false;
      }
      const endMs = new Date(item.endAtIso ?? "").getTime();
      if (!Number.isFinite(endMs) || nowMs < endMs + feedbackUnlockDelayMs) {
        return false;
      }
      const feedbackRecord = feedbackTable.byId[`${normalizedUserId}::${item.id}`];
      if (!feedbackRecord) {
        return true;
      }
      if (feedbackRecord.removed) {
        return false;
      }
      return !feedbackRecord.submittedAtIso?.trim();
    }).length;
  }
  countSubmittedFeedbackForOwnedEventsByUser(userId) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return 0;
    }
    const ownedEventIds = new Set(this.queryUserEventRecords(normalizedUserId).filter((item) => this.isEventAdminRecord(item, normalizedUserId) && item.status !== "T").map((item) => item.id.trim()).filter(Boolean));
    const feedbackTable = this.memoryDb.read()[EVENT_FEEDBACK_TABLE_NAME];
    return feedbackTable.ids.filter((id) => {
      const record = feedbackTable.byId[id];
      return Boolean(record && ownedEventIds.has(record.eventId.trim()) && record.submittedAtIso?.trim() && !record.removed);
    }).length;
  }
  queryActivityRateItemsByUserId(userId) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return [];
    }
    const state = this.memoryDb.read();
    const ratesTable = state[USER_RATES_TABLE_NAME];
    const outboxTable = state[USER_RATES_OUTBOX_TABLE_NAME];
    const ids = new Set(ratesTable.idsByRelevantUserId[normalizedUserId] ?? []);
    for (const id of outboxTable.ids) {
      const record = outboxTable.byId[id];
      if (record?.payload?.fromUserId === normalizedUserId || record?.payload?.toUserId === normalizedUserId) {
        ids.add(record.payload.id);
      }
    }
    return [...ids];
  }
  queryUserEventRecords(userId) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return [];
    }
    const table = this.memoryDb.read()[EVENTS_TABLE_NAME];
    const records = table.ids.map((id) => table.byId[id]).filter((record) => Boolean(record)).filter((record) => !this.isGeneratedSlotRecord(record)).filter((record) => this.isEventAdminRecord(record, normalizedUserId) || this.eventAcceptedMemberUserIds(record).includes(normalizedUserId) || this.eventPendingRequestMemberUserIds(record).includes(normalizedUserId) || this.eventInvitedMemberUserIds(record).includes(normalizedUserId));
    return this.aggregateUserEventRecords(records, normalizedUserId);
  }
  aggregateUserEventRecords(records, userId) {
    const byEventId = /* @__PURE__ */ new Map();
    for (const record of records) {
      const eventId = `${record.id ?? ""}`.trim();
      if (!eventId) {
        continue;
      }
      const existing = byEventId.get(eventId);
      if (!existing || this.eventRecordPreference(record, userId) > this.eventRecordPreference(existing, userId)) {
        byEventId.set(eventId, record);
      }
    }
    return [...byEventId.values()];
  }
  eventRecordPreference(record, userId) {
    return (this.isEventAdminRecord(record, userId) ? 40 : 0) + (this.eventInvitedMemberUserIds(record).includes(userId) ? 30 : 0) + (this.eventPendingRequestMemberUserIds(record).includes(userId) ? 20 : 0) + (this.eventAcceptedMemberUserIds(record).includes(userId) ? 10 : 0) + (this.isPublishedEventStatus(record.status) ? 1 : 0);
  }
  isGeneratedSlotRecord(record) {
    return Boolean(record?.generated) || record?.eventType === "slot" || Boolean(record?.parentEventId);
  }
  isEventAdminRecord(record, userId) {
    const normalizedUserId = `${userId ?? ""}`.trim();
    if (!normalizedUserId) {
      return false;
    }
    return this.normalizeUserIds([record.creatorUserId, ...record.adminIds ?? []]).includes(normalizedUserId);
  }
  eventAcceptedMemberUserIds(record) {
    return this.normalizeUserIds(record.acceptedMemberUserIds);
  }
  eventInvitedMemberUserIds(record) {
    return this.normalizeUserIds(record.invitedMemberUserIds);
  }
  eventPendingRequestMemberUserIds(record) {
    return this.normalizeUserIds(record.pendingRequestMemberUserIds);
  }
  normalizeUserIds(userIds) {
    return Array.from(new Set((userIds ?? []).map((userId) => `${userId ?? ""}`.trim()).filter((userId) => userId.length > 0)));
  }
  countOwnedAssetsByType(userId) {
    const normalizedUserId = userId.trim();
    const table = this.normalizeAssetsCollection(this.memoryDb.read()[ASSETS_TABLE_NAME]);
    const counts = {
      carsCount: 0,
      accommodationCount: 0,
      suppliesCount: 0
    };
    if (!normalizedUserId) {
      return counts;
    }
    for (const id of table.idsByOwnerUserId[normalizedUserId] ?? []) {
      const record = table.byId[id];
      if (!record || this.isSuppressedAssetStatus(record.status)) {
        continue;
      }
      if (record.type === ASSET_TYPE_TRANSPORT) {
        counts.carsCount += 1;
      } else if (record.type === ASSET_TYPE_ACCOMMODATION) {
        counts.accommodationCount += 1;
      } else if (record.type === ASSET_TYPE_SUPPLIES) {
        counts.suppliesCount += 1;
      }
    }
    return counts;
  }
  isSuppressedAssetStatus(status) {
    const normalized = this.normalizeAssetStatus(status);
    return normalized === "UR" || normalized === "B" || normalized === "D" || normalized === "I" || normalized === "T";
  }
  normalizeAssetStatus(status) {
    const normalized = `${status ?? ""}`.trim();
    switch (normalized) {
      case "active":
        return "A";
      case "under-review":
      case "under review":
        return "UR";
      case "blocked":
        return "B";
      case "deleted":
        return "D";
      case "inactive":
        return "I";
      case "trashed":
      case "trash":
        return "T";
      default:
        return normalized || "A";
    }
  }
  normalizeAssetsCollection(value) {
    const source = value;
    const byId = source?.byId && typeof source.byId === "object" ? __spreadValues({}, source.byId) : {};
    const ids = Array.isArray(source?.ids) ? source.ids.map((id) => String(id)) : [];
    const idsByOwnerUserId = {};
    if (source?.idsByOwnerUserId && typeof source.idsByOwnerUserId === "object") {
      for (const [ownerUserId, ownerIds] of Object.entries(source.idsByOwnerUserId)) {
        const normalizedOwnerUserId = ownerUserId.trim();
        if (!normalizedOwnerUserId || !Array.isArray(ownerIds)) {
          continue;
        }
        idsByOwnerUserId[normalizedOwnerUserId] = ownerIds.map((id) => String(id)).filter((id) => Boolean(byId[id]));
      }
    }
    for (const id of ids) {
      const record = byId[id];
      const ownerUserId = `${record?.ownerUserId ?? ""}`.trim();
      if (!ownerUserId) {
        continue;
      }
      const bucket = idsByOwnerUserId[ownerUserId] ?? [];
      if (!bucket.includes(id)) {
        bucket.push(id);
      }
      idsByOwnerUserId[ownerUserId] = bucket;
    }
    return {
      byId,
      ids,
      idsByOwnerUserId
    };
  }
  sameActivityCounts(left, right) {
    const normalizeCounter = (value) => {
      return Number.isFinite(Math.trunc(Number(value))) ? Math.trunc(Number(value)) : 0;
    };
    const leftEvent = left.activities.event;
    const rightEvent = right.activities.event;
    const leftChat = left.activities.chat;
    const rightChat = right.activities.chat;
    const leftAsset = left.activities.asset;
    const rightAsset = right.activities.asset;
    const leftEventFeedback = left.activities.eventFeedback;
    const rightEventFeedback = right.activities.eventFeedback;
    return left.activities.game === right.activities.game && left.activities.chats === right.activities.chats && left.activities.invitations === right.activities.invitations && left.activities.events === right.activities.events && left.activities.hosting === right.activities.hosting && (left.activities.cars ?? 0) === (right.activities.cars ?? 0) && (left.activities.accommodation ?? 0) === (right.activities.accommodation ?? 0) && (left.activities.supplies ?? 0) === (right.activities.supplies ?? 0) && (left.activities.tickets ?? 0) === (right.activities.tickets ?? 0) && (left.activities.contacts ?? 0) === (right.activities.contacts ?? 0) && (left.activities.feedback ?? 0) === (right.activities.feedback ?? 0) && (left.activities.notifications ?? 0) === (right.activities.notifications ?? 0) && Boolean(left.activities.chat) === Boolean(right.activities.chat) && normalizeCounter(leftChat?.all) === normalizeCounter(rightChat?.all) && normalizeCounter(leftChat?.event) === normalizeCounter(rightChat?.event) && normalizeCounter(leftChat?.subEvent) === normalizeCounter(rightChat?.subEvent) && normalizeCounter(leftChat?.group) === normalizeCounter(rightChat?.group) && normalizeCounter(leftChat?.service) === normalizeCounter(rightChat?.service) && normalizeCounter(leftChat?.appSupport) === normalizeCounter(rightChat?.appSupport) && Boolean(left.activities.event) === Boolean(right.activities.event) && normalizeCounter(leftEvent?.all) === normalizeCounter(rightEvent?.all) && normalizeCounter(leftEvent?.active) === normalizeCounter(rightEvent?.active) && normalizeCounter(leftEvent?.pending) === normalizeCounter(rightEvent?.pending) && normalizeCounter(leftEvent?.invitations) === normalizeCounter(rightEvent?.invitations) && normalizeCounter(leftEvent?.hosting) === normalizeCounter(rightEvent?.hosting) && normalizeCounter(leftEvent?.drafts) === normalizeCounter(rightEvent?.drafts) && normalizeCounter(leftEvent?.trash) === normalizeCounter(rightEvent?.trash) && Boolean(left.activities.asset) === Boolean(right.activities.asset) && normalizeCounter(leftAsset?.cars) === normalizeCounter(rightAsset?.cars) && normalizeCounter(leftAsset?.accommodation) === normalizeCounter(rightAsset?.accommodation) && normalizeCounter(leftAsset?.supplies) === normalizeCounter(rightAsset?.supplies) && normalizeCounter(leftAsset?.tickets) === normalizeCounter(rightAsset?.tickets) && Boolean(left.activities.eventFeedback) === Boolean(right.activities.eventFeedback) && normalizeCounter(leftEventFeedback?.ownEvents) === normalizeCounter(rightEventFeedback?.ownEvents) && normalizeCounter(leftEventFeedback?.pending) === normalizeCounter(rightEventFeedback?.pending) && normalizeCounter(leftEventFeedback?.feedbacked) === normalizeCounter(rightEventFeedback?.feedbacked) && normalizeCounter(leftEventFeedback?.removed) === normalizeCounter(rightEventFeedback?.removed) && normalizeCounter(left.activities.adminJobs) === normalizeCounter(right.activities.adminJobs) && normalizeCounter(left.activities.adminMetrics) === normalizeCounter(right.activities.adminMetrics);
  }
  sameImpressions(left, right) {
    return JSON.stringify(left.impressions ?? null) === JSON.stringify(right.impressions ?? null);
  }
  static \u0275fac = function SeedUsersRepository_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SeedUsersRepository)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SeedUsersRepository, factory: _SeedUsersRepository.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SeedUsersRepository, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/local/seed/repositories/admin-store-seed.repository.ts
var SeedAdminStoreRepository = class _SeedAdminStoreRepository {
  memoryDb = inject(LocalMemoryDb);
  async resetAndSeedAdminStores(stores) {
    await Promise.all([
      this.memoryDb.writeIndexedDbTableEntry(APP_INDEXED_DB_KEYS.adminModeration, stores.moderation),
      this.memoryDb.writeIndexedDbTableEntry(APP_INDEXED_DB_KEYS.adminNotificationRules, stores.notificationCenter),
      this.memoryDb.writeIndexedDbTableEntry(APP_INDEXED_DB_KEYS.adminMonitoring, stores.monitoring),
      this.memoryDb.writeIndexedDbTableEntry(APP_INDEXED_DB_KEYS.adminStats, stores.stats),
      this.memoryDb.writeIndexedDbTableEntry(APP_INDEXED_DB_KEYS.adminParams, stores.params)
    ]);
    return {
      notificationCenter: stores.notificationCenter,
      monitoring: stores.monitoring
    };
  }
  static \u0275fac = function SeedAdminStoreRepository_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SeedAdminStoreRepository)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SeedAdminStoreRepository, factory: _SeedAdminStoreRepository.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SeedAdminStoreRepository, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/local/seed/repositories/admin-affinity-graph-seed.repository.ts
var ADMIN_AFFINITY_GRAPH_STORE_KEY = APP_INDEXED_DB_KEYS.adminAffinityGraph;
var SeedAdminAffinityGraphRepository = class _SeedAdminAffinityGraphRepository {
  memoryDb = inject(LocalMemoryDb);
  activeGraphProfileStatuses = /* @__PURE__ */ new Set(["public", "friends only", "host only"]);
  async buildGraphSnapshot() {
    await this.memoryDb.whenReady();
    const state = this.memoryDb.read();
    const usersTable = state[USERS_TABLE_NAME];
    const ratesTable = state[USER_RATES_TABLE_NAME];
    const nodes = usersTable.ids.map((id) => usersTable.byId[id]).filter((user) => this.isGraphMember(user)).map((user) => this.toNodeDto(user));
    const nodeIds = new Set(nodes.map((node) => node.id));
    const edgesByKey = /* @__PURE__ */ new Map();
    for (const id of ratesTable.ids) {
      const record = ratesTable.byId[id];
      if (record) {
        this.addRateEdge(edgesByKey, nodeIds, record);
      }
    }
    return {
      generatedAtIso: (/* @__PURE__ */ new Date()).toISOString(),
      source: "demo",
      layoutVersion: `demo-${nodes.length}-${edgesByKey.size}`,
      nodes,
      edges: [...edgesByKey.values()]
    };
  }
  async writeGraphSnapshot(snapshot) {
    await this.memoryDb.writeIndexedDbTableEntry(ADMIN_AFFINITY_GRAPH_STORE_KEY, snapshot);
  }
  async buildAndWriteGraphSnapshot() {
    const snapshot = await this.buildGraphSnapshot();
    await this.writeGraphSnapshot(snapshot);
    return snapshot;
  }
  isGraphMember(user) {
    const id = `${user?.id ?? ""}`.trim();
    if (!id || id.startsWith("admin-demo-")) {
      return false;
    }
    return this.activeGraphProfileStatuses.has(`${user?.profileStatus ?? ""}`.trim().toLowerCase());
  }
  toNodeDto(user) {
    const images = (user.images ?? []).map((image) => `${image ?? ""}`.trim()).filter(Boolean);
    return {
      id: user.id.trim(),
      name: user.name?.trim() || user.initials?.trim() || user.id.trim(),
      initials: this.initialsFor(user),
      gender: user.gender,
      city: user.city ?? null,
      age: Number.isFinite(user.age) ? Math.trunc(Number(user.age)) : null,
      headline: user.headline ?? null,
      traitLabel: user.traitLabel ?? null,
      statusText: user.statusText ?? null,
      profileStatus: user.profileStatus ?? null,
      image: images[0] ?? null,
      images
    };
  }
  addRateEdge(edgesByKey, nodeIds, record) {
    const source = `${record.fromUserId ?? ""}`.trim();
    const target = `${record.toUserId ?? ""}`.trim();
    if (!source || !target || source === target || !nodeIds.has(source) || !nodeIds.has(target)) {
      return;
    }
    const key = this.edgeKey(source, target);
    const weight = this.rateWeight(record);
    if (weight <= 0) {
      return;
    }
    const existing = edgesByKey.get(key);
    if (existing && existing.weight >= weight) {
      return;
    }
    edgesByKey.set(key, {
      id: key,
      source,
      target,
      weight,
      affinityScore: weight,
      updatedDate: record.updatedAtIso ?? record.happenedAtIso ?? record.createdAtIso ?? null
    });
  }
  rateWeight(record) {
    const score = Math.max(Number(record.rate) || 0, Number(record.scoreGiven) || 0, Number(record.scoreReceived) || 0);
    return this.clamp(score / 10, 0, 1);
  }
  edgeKey(source, target) {
    return source.localeCompare(target) <= 0 ? `${source}:${target}` : `${target}:${source}`;
  }
  initialsFor(user) {
    const explicit = `${user.initials ?? ""}`.trim();
    if (explicit) {
      return explicit.slice(0, 3).toUpperCase();
    }
    return `${user.name ?? ""}`.trim().split(/\s+/).map((part) => part[0] ?? "").join("").slice(0, 2).toUpperCase() || "M";
  }
  clamp(value, min, max) {
    return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
  }
  static \u0275fac = function SeedAdminAffinityGraphRepository_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SeedAdminAffinityGraphRepository)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SeedAdminAffinityGraphRepository, factory: _SeedAdminAffinityGraphRepository.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SeedAdminAffinityGraphRepository, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/local/seed/repositories/share-tokens-seed.repository.ts
var SeedShareTokensRepository = class _SeedShareTokensRepository {
  static TOKEN_TTL_MS = 24 * 60 * 60 * 1e3;
  memoryDb = inject(LocalMemoryDb);
  ensureAdminHelpToken(request) {
    const adminId = `${request.adminId ?? ""}`.trim();
    const userId = `${request.userId ?? ""}`.trim();
    const targetKey = `${request.targetKey ?? ""}`.trim();
    const targetUrl = `${request.targetUrl ?? ""}`.trim();
    if (!adminId || !userId || !targetKey || !targetUrl) {
      return "";
    }
    const safeAdminId = adminId.replace(/[^A-Za-z0-9-]/g, "-");
    const targetSuffix = targetKey === "current" ? "" : `-${targetKey}`;
    const token = `myscoutee:token:admin-help-${safeAdminId}-${userId}${targetSuffix}`;
    const now = /* @__PURE__ */ new Date();
    const expiresAt = new Date(now.getTime() + _SeedShareTokensRepository.TOKEN_TTL_MS);
    const record = {
      token,
      kind: "adminHelp",
      entityId: targetUrl,
      ownerUserId: userId,
      createdAtIso: now.toISOString(),
      expiresAtIso: expiresAt.toISOString()
    };
    this.memoryDb.write((state) => {
      const table = state[SHARE_TOKENS_TABLE_NAME];
      const existing = table.byToken[token];
      if (existing && !this.isExpired(existing) && existing.entityId === targetUrl) {
        return state;
      }
      return __spreadProps(__spreadValues({}, state), {
        [SHARE_TOKENS_TABLE_NAME]: {
          byToken: __spreadProps(__spreadValues({}, table.byToken), {
            [token]: record
          }),
          tokens: table.tokens.includes(token) ? [...table.tokens] : [...table.tokens, token]
        }
      });
    });
    return token;
  }
  isExpired(record) {
    if (!record) {
      return true;
    }
    const expiresAtMs = Date.parse(record.expiresAtIso);
    return !Number.isFinite(expiresAtMs) || expiresAtMs <= Date.now();
  }
  static \u0275fac = function SeedShareTokensRepository_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SeedShareTokensRepository)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SeedShareTokensRepository, factory: _SeedShareTokensRepository.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SeedShareTokensRepository, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/local/seed/repositories/admin-bootstrap-seed.repository.ts
var SeedAdminBootstrapRepository = class _SeedAdminBootstrapRepository {
  location = inject(Location);
  usersSeed = inject(SeedUsersRepository);
  usersRatingsSeed = inject(SeedUsersRatingsRepository);
  affinityGraphSeed = inject(SeedAdminAffinityGraphRepository);
  chatsSeed = inject(SeedChatsRepository);
  shareTokensSeed = inject(SeedShareTokensRepository);
  storeSeed = inject(SeedAdminStoreRepository);
  helpCenterSeed = inject(SeedHelpCenterRepository);
  ideaPostsSeed = inject(SeedIdeaPostsRepository);
  async whenUsersReady() {
    await this.usersSeed.whenReady();
  }
  async seedHelpCenter() {
    return await this.helpCenterSeed.seedDefaults();
  }
  async seedIdeaPosts() {
    return await this.ideaPostsSeed.seedDefaults();
  }
  seedUserRatings(seedUsers) {
    this.usersRatingsSeed.seedDefaults(seedUsers);
  }
  seedChats() {
    this.chatsSeed.seedDefaults();
  }
  async seedDemoAdminUsers() {
    for (const admin of [
      this.resolveDemoAdmin("admin-demo-ava"),
      this.resolveDemoAdmin("admin-demo-noel")
    ]) {
      const seededAdmin = AdminProfileSeedBuilder.buildDemoAdminUser(admin);
      const existing = this.findUser(admin.id);
      if (existing) {
        const seededImages = this.demoAdminImages(admin.id);
        const existingImages = existing.images ?? [];
        const shouldRefreshImages = seededImages.length > 0 && (existingImages.length === 0 || existingImages.some((image) => this.isLegacyDemoAdminImage(image)));
        const shouldRefreshAdminFields = existing.admin !== true || `${existing.city ?? ""}`.trim().length === 0 || `${existing.hostTier ?? ""}`.trim().toLowerCase() !== "admin";
        if (shouldRefreshAdminFields || shouldRefreshImages) {
          await this.saveUser(__spreadProps(__spreadValues({}, existing), {
            admin: true,
            city: `${existing.city ?? ""}`.trim() || seededAdmin.city,
            hostTier: `${existing.hostTier ?? ""}`.trim().toLowerCase() === "admin" ? existing.hostTier : seededAdmin.hostTier,
            images: shouldRefreshImages ? seededImages : existingImages
          }));
        }
        continue;
      }
      await this.saveUser(seededAdmin);
    }
  }
  async seedDemoAdminStores() {
    const moderation = this.buildSeedDemoModerationStore();
    return await this.resetAndSeedAdminStores({
      moderation,
      notificationCenter: AdminNotificationsSeedBuilder.buildDefaultNotificationCenter(),
      monitoring: AdminMonitoringSeedBuilder.buildDefaultMonitoringState(),
      stats: AdminStatsSeedBuilder.buildSeedDemoStatsSnapshot(),
      params: AdminParamsSeedBuilder.buildDefaultParamsStore()
    });
  }
  async seedDemoAdminMenuCounters(seedState) {
    const notificationCenter = seedState.notificationCenter;
    const monitoringState = seedState.monitoring;
    const adminJobs = this.countFailedNotificationRules(notificationCenter);
    const adminMetrics = this.countAlertMonitoringMetrics(monitoringState);
    for (const admin of [
      this.resolveDemoAdmin("admin-demo-ava"),
      this.resolveDemoAdmin("admin-demo-noel")
    ]) {
      const user = this.findUser(admin.id);
      if (!user) {
        continue;
      }
      const nextActivities = __spreadProps(__spreadValues({}, user.activities), {
        game: Math.max(0, Math.trunc(Number(user.activities?.game) || 0)),
        chats: Math.max(0, Math.trunc(Number(user.activities?.chats) || 0)),
        invitations: Math.max(0, Math.trunc(Number(user.activities?.invitations) || 0)),
        events: Math.max(0, Math.trunc(Number(user.activities?.events) || 0)),
        hosting: Math.max(0, Math.trunc(Number(user.activities?.hosting) || 0)),
        tickets: Math.max(0, Math.trunc(Number(user.activities?.tickets) || 0)),
        feedback: Math.max(0, Math.trunc(Number(user.activities?.feedback) || 0)),
        adminJobs,
        adminMetrics
      });
      if (nextActivities.adminJobs === Math.max(0, Math.trunc(Number(user.activities?.adminJobs) || 0)) && nextActivities.adminMetrics === Math.max(0, Math.trunc(Number(user.activities?.adminMetrics) || 0))) {
        continue;
      }
      await this.saveUser(__spreadProps(__spreadValues({}, user), {
        activities: nextActivities
      }));
    }
  }
  async seedDemoAdminSupport(adminUserId) {
    const admin = this.resolveDemoAdmin(adminUserId);
    const helpUser = this.findUser("u1");
    if (!helpUser) {
      return;
    }
    const now = /* @__PURE__ */ new Date();
    const chat = {
      id: `c-admin-service-help-${helpUser.id}`,
      avatar: helpUser.initials,
      title: `MyScoutee Support \xB7 ${helpUser.name}`,
      lastMessage: "Please help me with what I see on MyScoutee.",
      lastSenderId: helpUser.id,
      memberIds: [admin.id, helpUser.id],
      unread: 1,
      dateIso: now.toISOString(),
      channelType: "appSupport",
      ownerUserId: admin.id
    };
    const messages = [];
    for (let index = 0; index < this.demoAdminHelpTargets().length; index += 1) {
      const target = this.demoAdminHelpTargets()[index];
      if (!target) {
        continue;
      }
      const token = this.ensureAdminHelpToken({
        adminId: admin.id,
        userId: helpUser.id,
        targetKey: target.key,
        targetUrl: target.targetUrl
      });
      const helpUrl = this.location.prepareExternalUrl(`/admin/help/${encodeURIComponent(token)}`);
      const sentAt = new Date(now.getTime() + index * 1e3);
      const sentAtIso = sentAt.toISOString();
      const message = {
        id: target.messageId,
        sender: helpUser.name,
        senderAvatar: {
          id: helpUser.id,
          initials: helpUser.initials,
          gender: helpUser.gender
        },
        text: target.text,
        time: sentAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        sentAtIso,
        mine: false,
        readBy: [],
        attachments: [{
          id: target.attachmentId,
          type: target.attachmentType,
          title: target.title,
          entityId: target.attachmentType === "link" ? token : target.attachmentEntityId,
          assetType: target.assetType ?? null,
          ownerUserId: helpUser.id,
          subtitle: target.subtitle,
          description: target.description,
          url: helpUrl,
          previewUrl: target.previewUrl ?? null
        }]
      };
      messages.push(message);
    }
    this.seedChatMessages(chat, messages);
  }
  async buildAndWriteAffinityGraphSnapshot() {
    await this.affinityGraphSeed.buildAndWriteGraphSnapshot();
  }
  async resetAndSeedAdminStores(stores) {
    return await this.storeSeed.resetAndSeedAdminStores(stores);
  }
  buildSeedDemoModerationStore() {
    return AdminModerationSeedBuilder.buildSeedDemoModerationStore({
      userImageUrl: (userId) => this.firstUserImage(this.findUser(userId)),
      chatMessages: (ownerUserId, chatId) => this.demoChatMessages(ownerUserId, chatId)
    });
  }
  demoChatMessages(ownerUserId, chatId) {
    const chat = this.findChatById(ownerUserId, chatId);
    if (!chat) {
      return [];
    }
    return this.readChatMessagesPage(chat).map((message) => ({
      id: message.id,
      sender: message.sender,
      senderUserId: message.senderAvatar.id,
      senderInitials: message.senderAvatar.initials,
      senderGender: message.senderAvatar.gender,
      text: message.text,
      time: message.time,
      sentAtIso: message.sentAtIso
    }));
  }
  findUser(userId) {
    return this.usersSeed.queryUserById(userId);
  }
  async saveUser(user) {
    return this.usersSeed.upsertUser(user);
  }
  findChatById(userId, chatId) {
    return this.chatsSeed.queryChatItemById(userId, chatId);
  }
  readChatMessagesPage(chat) {
    return this.chatsSeed.queryChatMessagesPage(chat, 0, 50);
  }
  seedChatMessages(chat, messages) {
    this.chatsSeed.seedChatMessages(chat, messages);
  }
  ensureAdminHelpToken(request) {
    return this.shareTokensSeed.ensureAdminHelpToken(request);
  }
  demoAdminHelpTargets() {
    return AdminHelpSeedBuilder.demoAdminHelpTargets();
  }
  resolveDemoAdmin(adminUserId) {
    const id = `${adminUserId ?? ""}`.trim();
    if (id === "admin-demo-noel") {
      return {
        id: "admin-demo-noel",
        name: "Noel Safety",
        initials: "NS",
        email: "admin2@myscoutee.local",
        images: this.demoAdminImages("admin-demo-noel")
      };
    }
    return {
      id: "admin-demo-ava",
      name: "Ava",
      initials: "AM",
      email: "admin1@myscoutee.local",
      images: this.demoAdminImages("admin-demo-ava")
    };
  }
  demoAdminImages(adminUserId) {
    return AdminProfileSeedBuilder.demoAdminImages(adminUserId);
  }
  isLegacyDemoAdminImage(imageUrl) {
    return AdminProfileSeedBuilder.isLegacyDemoAdminImage(imageUrl);
  }
  firstUserImage(user) {
    return user?.images?.find((image) => image.trim().length > 0) ?? null;
  }
  countFailedNotificationRules(state) {
    return (state?.rules ?? []).filter((rule) => {
      const current = `${rule.runState?.currentStatus ?? ""}`.trim().toLowerCase();
      const last = `${rule.runState?.lastRunStatus ?? ""}`.trim().toLowerCase();
      return this.isFailureStatus(current) || this.isFailureStatus(last);
    }).length;
  }
  countAlertMonitoringMetrics(state) {
    return (state?.categories ?? []).flatMap((category) => category.nodes ?? []).flatMap((node) => node.metrics ?? []).filter((metric) => metric.status === "alert" || this.isFailureStatus(metric.key) || this.isFailureStatus(metric.labelKey)).reduce((total, metric) => total + Math.max(0, Math.trunc(Number(metric.value) || 0)), 0);
  }
  isFailureStatus(value) {
    const normalized = `${value ?? ""}`.trim().toLowerCase();
    return normalized.includes("failed") || normalized.includes("error") || normalized.includes("missed") || normalized.includes("timeout") || normalized.includes("hiany") || normalized.includes("hiba");
  }
  static \u0275fac = function SeedAdminBootstrapRepository_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SeedAdminBootstrapRepository)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SeedAdminBootstrapRepository, factory: _SeedAdminBootstrapRepository.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SeedAdminBootstrapRepository, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/local/seed/repositories/contacts-seed.repository.ts
var DEMO_CONTACT_OWNER_USER_ID = "bf057de7c586eede7e84bdc7";
var DEMO_CONTACT_UPDATED_AT_ISO = "2026-05-04T00:00:00Z";
var DEMO_CONTACT_METHODS_BY_USER_ID = {
  b29df68956f3fe15e04558de: [
    { id: "kb-phone", type: "phone", value: "+1 312 555 0184" },
    { id: "kb-email", type: "email", value: "balazs.kiss@example.com" }
  ],
  "9f3b3f085e23af6c89dbc432": [
    { id: "ne-instagram", type: "instagram", value: "eszter.groups" },
    { id: "ne-telegram", type: "telegram", value: "@eszter_groups" }
  ],
  "1b1c70be2349b3359a8f6f94": [
    { id: "ms-whatsapp", type: "whatsapp", value: "+1 619 555 0142" },
    { id: "ms-linkedin", type: "linkedin", value: "https://www.linkedin.com/in/maya-stone-demo" }
  ]
};
var DEMO_CONTACT_CREATED_AT_BY_USER_ID = {
  b29df68956f3fe15e04558de: "2026-04-22T08:15:00Z",
  "9f3b3f085e23af6c89dbc432": "2026-04-24T10:30:00Z",
  "1b1c70be2349b3359a8f6f94": "2026-04-29T17:45:00Z"
};
var SeedContactsRepository = class _SeedContactsRepository {
  memoryDb = inject(LocalMemoryDb);
  seedDefaultContacts(users) {
    const ownerUserId = DEMO_CONTACT_OWNER_USER_ID;
    const table = this.memoryDb.read()[CONTACTS_TABLE_NAME];
    if ((table.byOwnerUserId[ownerUserId] ?? []).length > 0) {
      return false;
    }
    const usersById = new Map(users.map((user) => [user.id.trim(), user]));
    const contacts = Object.entries(DEMO_CONTACT_METHODS_BY_USER_ID).map(([contactUserId, methods]) => this.toSeedContact(usersById.get(contactUserId), methods)).filter((contact) => Boolean(contact));
    if (contacts.length === 0) {
      return false;
    }
    this.memoryDb.write((state) => {
      const current = state[CONTACTS_TABLE_NAME];
      return __spreadProps(__spreadValues({}, state), {
        [CONTACTS_TABLE_NAME]: {
          byOwnerUserId: __spreadProps(__spreadValues({}, current.byOwnerUserId), {
            [ownerUserId]: contacts.map((contact) => this.cloneContact(contact))
          }),
          ownerUserIds: [.../* @__PURE__ */ new Set([...current.ownerUserIds, ownerUserId])]
        }
      });
    });
    return true;
  }
  toSeedContact(user, methods) {
    const userId = user?.id?.trim() ?? "";
    if (!user || !userId) {
      return null;
    }
    return {
      id: userId,
      userId,
      name: `${user.name ?? ""}`.trim() || "Contact",
      initials: `${user.initials ?? ""}`.trim(),
      gender: user.gender === "woman" ? "woman" : "man",
      city: `${user.city ?? ""}`.trim(),
      avatarUrl: `${user.images?.[0] ?? ""}`.trim(),
      headline: `${user.headline ?? user.statusText ?? ""}`.trim(),
      createdAtIso: DEMO_CONTACT_CREATED_AT_BY_USER_ID[userId] ?? DEMO_CONTACT_UPDATED_AT_ISO,
      updatedAtIso: DEMO_CONTACT_UPDATED_AT_ISO,
      methods: methods.map((method) => __spreadValues({}, method))
    };
  }
  cloneContact(contact) {
    return __spreadProps(__spreadValues({}, contact), {
      methods: contact.methods.map((method) => __spreadValues({}, method))
    });
  }
  static \u0275fac = function SeedContactsRepository_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SeedContactsRepository)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SeedContactsRepository, factory: _SeedContactsRepository.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SeedContactsRepository, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/local/seed/repositories/event-feedback-seed.repository.ts
var SeedEventFeedbackRepository = class _SeedEventFeedbackRepository {
  static EVENT_FEEDBACK_UNLOCK_DELAY_MS = 2 * 60 * 60 * 1e3;
  static ORGANIZER_FEEDBACK_SHOWCASE_TARGET_COUNT = 3;
  memoryDb = inject(LocalMemoryDb);
  seedDefaults(seedUsers, eventItemsByUserId, itemsByUserId) {
    const users = [...seedUsers];
    if (users.length === 0) {
      return false;
    }
    const currentTable = this.memoryDb.read()[EVENT_FEEDBACK_TABLE_NAME];
    const nextById = __spreadValues({}, currentTable.byId);
    const nextIds = [...currentTable.ids];
    let changed = false;
    for (const activeUser of users) {
      const eventRecords = [...eventItemsByUserId.get(activeUser.id) ?? []];
      if (eventRecords.length === 0) {
        continue;
      }
      const seededRecords = SeedEventFeedbackBuilder.buildSeededPersistedStates({
        eventRecords,
        users,
        activeUser,
        eventFeedbackUnlockDelayMs: _SeedEventFeedbackRepository.EVENT_FEEDBACK_UNLOCK_DELAY_MS,
        eventOverallOptions: APP_STATIC_DATA.eventFeedbackEventOverallOptions,
        hostImproveOptions: APP_STATIC_DATA.eventFeedbackHostImproveOptions,
        attendeeCollabOptions: APP_STATIC_DATA.eventFeedbackAttendeeCollabOptions,
        attendeeRejoinOptions: APP_STATIC_DATA.eventFeedbackAttendeeRejoinOptions,
        personalityTraitOptions: APP_STATIC_DATA.eventFeedbackPersonalityTraitOptions
      });
      for (const record of seededRecords) {
        if (nextById[record.id]) {
          continue;
        }
        nextById[record.id] = __spreadProps(__spreadValues({}, record), {
          answersByCardId: __spreadValues({}, record.answersByCardId ?? {})
        });
        nextIds.push(record.id);
        changed = true;
      }
    }
    if (this.seedOrganizerFeedbackShowcaseRecords(users, nextById, nextIds, itemsByUserId)) {
      changed = true;
    }
    if (!changed) {
      return false;
    }
    this.memoryDb.write((state) => __spreadProps(__spreadValues({}, state), {
      [EVENT_FEEDBACK_TABLE_NAME]: {
        byId: nextById,
        ids: nextIds
      }
    }));
    return true;
  }
  seedOrganizerFeedbackShowcaseRecords(users, nextById, nextIds, itemsByUserId) {
    const usersById = new Map(users.map((user) => [user.id, user]));
    const hostedEventById = /* @__PURE__ */ new Map();
    let changed = false;
    for (const user of users) {
      for (const record of itemsByUserId.get(user.id) ?? []) {
        const eventId = record.id?.trim() ?? "";
        if (!eventId || !this.isEventAdminRecord(record, user.id) || record.status === "T") {
          continue;
        }
        const current = hostedEventById.get(eventId);
        if (!current || !this.isPublishedEventStatus(current.status) && this.isPublishedEventStatus(record.status)) {
          hostedEventById.set(eventId, record);
        }
      }
    }
    for (const record of hostedEventById.values()) {
      const hostUserId = record.creatorUserId?.trim() || record.userId?.trim();
      const hostUser = hostUserId ? usersById.get(hostUserId) : null;
      if (!hostUser) {
        continue;
      }
      const viewerUserIds = this.organizerFeedbackShowcaseViewerUserIds(record, users, hostUser.id, usersById);
      if (viewerUserIds.length === 0) {
        continue;
      }
      let visibleEntryCount = viewerUserIds.filter((userId) => this.hasOrganizerVisibleFeedback(nextById[`${userId}::${record.id}`])).length;
      if (visibleEntryCount >= _SeedEventFeedbackRepository.ORGANIZER_FEEDBACK_SHOWCASE_TARGET_COUNT) {
        continue;
      }
      const feedbackEventSnapshot = this.toFeedbackEventSnapshotForViewers(record, viewerUserIds);
      for (const viewerUserId of viewerUserIds) {
        if (visibleEntryCount >= _SeedEventFeedbackRepository.ORGANIZER_FEEDBACK_SHOWCASE_TARGET_COUNT) {
          break;
        }
        const existingRecord = nextById[`${viewerUserId}::${record.id}`];
        if (this.hasOrganizerVisibleFeedback(existingRecord)) {
          continue;
        }
        const viewer = usersById.get(viewerUserId);
        if (!viewer) {
          continue;
        }
        const seededRecord = SeedEventFeedbackBuilder.buildSeededSubmittedState({
          eventRecord: feedbackEventSnapshot,
          users,
          activeUser: viewer,
          eventFeedbackUnlockDelayMs: _SeedEventFeedbackRepository.EVENT_FEEDBACK_UNLOCK_DELAY_MS,
          eventOverallOptions: APP_STATIC_DATA.eventFeedbackEventOverallOptions,
          hostImproveOptions: APP_STATIC_DATA.eventFeedbackHostImproveOptions,
          attendeeCollabOptions: APP_STATIC_DATA.eventFeedbackAttendeeCollabOptions,
          attendeeRejoinOptions: APP_STATIC_DATA.eventFeedbackAttendeeRejoinOptions,
          personalityTraitOptions: APP_STATIC_DATA.eventFeedbackPersonalityTraitOptions,
          seedKey: `organizer-showcase:${record.id}:${viewerUserId}`
        });
        if (!seededRecord) {
          continue;
        }
        nextById[seededRecord.id] = __spreadProps(__spreadValues({}, seededRecord), {
          answersByCardId: __spreadValues({}, seededRecord.answersByCardId ?? {})
        });
        if (!nextIds.includes(seededRecord.id)) {
          nextIds.push(seededRecord.id);
        }
        visibleEntryCount += 1;
        changed = true;
      }
    }
    return changed;
  }
  hasOrganizerVisibleFeedback(record) {
    if (!record) {
      return false;
    }
    return Boolean(record.organizerNote?.trim()) || Object.keys(record.answersByCardId ?? {}).length > 0;
  }
  organizerFeedbackShowcaseViewerUserIds(record, users, hostUserId, usersById) {
    const summary = this.activityMemberSummaryByOwner("event", record.id);
    const memberUserIds = [...new Set([
      ...summary.acceptedMemberUserIds ?? [],
      ...summary.pendingMemberUserIds ?? []
    ].map((userId) => `${userId}`.trim()).filter(Boolean))].filter((userId) => userId !== hostUserId && usersById.has(userId));
    if (memberUserIds.length > 0) {
      return memberUserIds;
    }
    const candidates = users.map((user) => user.id.trim()).filter((userId) => userId && userId !== hostUserId);
    if (candidates.length === 0) {
      return [];
    }
    const seed = this.hashText(`organizer-feedback-viewers:${record.id}`);
    const selected = [];
    for (let index = 0; index < candidates.length && selected.length < _SeedEventFeedbackRepository.ORGANIZER_FEEDBACK_SHOWCASE_TARGET_COUNT; index += 1) {
      const candidate = candidates[(seed + index * 5) % candidates.length];
      if (!candidate || selected.includes(candidate)) {
        continue;
      }
      selected.push(candidate);
    }
    return selected;
  }
  toFeedbackEventSnapshotForViewers(record, viewerUserIds = []) {
    const summary = this.activityMemberSummaryByOwner("event", record.id);
    const acceptedMemberUserIds = [...new Set([
      ...summary.acceptedMemberUserIds ?? [],
      ...viewerUserIds
    ].map((userId) => `${userId}`.trim()).filter(Boolean))];
    const pendingMemberUserIds = (summary.pendingMemberUserIds ?? []).filter((userId) => !acceptedMemberUserIds.includes(userId));
    return __spreadProps(__spreadValues({}, record), {
      activity: 0,
      acceptedMembers: Math.max(record.acceptedMembers, acceptedMemberUserIds.length),
      capacityTotal: Math.max(record.capacityTotal, acceptedMemberUserIds.length),
      acceptedMemberUserIds,
      pendingMemberUserIds
    });
  }
  activityMemberSummaryByOwner(ownerType, ownerId) {
    const ownerKey = `${ownerType}:${ownerId.trim()}`;
    const table = this.memoryDb.read()[ACTIVITY_MEMBERS_TABLE_NAME];
    const records = (table.idsByOwnerKey[ownerKey] ?? []).map((id) => table.byId[id]).filter((record) => Boolean(record));
    return {
      acceptedMemberUserIds: records.filter((record) => record.status === "accepted").map((record) => record.userId),
      pendingMemberUserIds: records.filter((record) => record.status === "pending").map((record) => record.userId)
    };
  }
  hashText(value) {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
      hash = (hash << 5) - hash + value.charCodeAt(index);
      hash |= 0;
    }
    return Math.abs(hash);
  }
  isPublishedEventStatus(status) {
    return `${status ?? "A"}`.trim() === "A";
  }
  isEventAdminRecord(record, userId) {
    const normalizedUserId = `${userId ?? ""}`.trim();
    if (!normalizedUserId) {
      return false;
    }
    return this.normalizeUserIds([record.creatorUserId, ...record.adminIds ?? []]).includes(normalizedUserId);
  }
  normalizeUserIds(userIds) {
    return Array.from(new Set((userIds ?? []).map((userId) => `${userId ?? ""}`.trim()).filter((userId) => userId.length > 0)));
  }
  static \u0275fac = function SeedEventFeedbackRepository_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SeedEventFeedbackRepository)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SeedEventFeedbackRepository, factory: _SeedEventFeedbackRepository.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SeedEventFeedbackRepository, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/local/seed/repositories/events-seed.repository.ts
var SeedEventsRepository = class _SeedEventsRepository {
  memoryDb = inject(LocalMemoryDb);
  initialized = false;
  seedDefaults() {
    const state = this.memoryDb.read();
    const seededRecords = this.buildSeededRecords();
    const currentTable = state[EVENTS_TABLE_NAME];
    if (this.initialized && currentTable.ids.length > 0) {
      return false;
    }
    if (currentTable.ids.length === 0) {
      this.memoryDb.write((currentState) => __spreadProps(__spreadValues({}, currentState), {
        [EVENTS_TABLE_NAME]: seededRecords
      }));
      this.initialized = true;
      return true;
    }
    const migration = this.mergeSeededRecords(currentTable, seededRecords);
    if (migration.changed) {
      this.memoryDb.write((currentState) => __spreadProps(__spreadValues({}, currentState), {
        [EVENTS_TABLE_NAME]: migration.table
      }));
    }
    this.initialized = true;
    return migration.changed;
  }
  queryItemsByUser(userId) {
    const normalizedUserId = `${userId ?? ""}`.trim();
    if (!normalizedUserId) {
      return [];
    }
    const table = this.memoryDb.read()[EVENTS_TABLE_NAME];
    return table.ids.map((id) => table.byId[id]).filter((record) => Boolean(record)).filter((record) => record.userId === normalizedUserId).map((record) => SeedEventsBuilder.cloneRecord(record));
  }
  queryItemsByUsers(userIds) {
    const normalizedUserIds = [...new Set(userIds.map((userId) => `${userId ?? ""}`.trim()).filter((userId) => userId.length > 0))];
    const result = new Map(normalizedUserIds.map((userId) => [userId, []]));
    if (normalizedUserIds.length === 0) {
      return result;
    }
    const userIdSet = new Set(normalizedUserIds);
    const table = this.memoryDb.read()[EVENTS_TABLE_NAME];
    for (const id of table.ids) {
      const record = table.byId[id];
      if (!record || !userIdSet.has(record.userId)) {
        continue;
      }
      result.get(record.userId)?.push(SeedEventsBuilder.cloneRecord(record));
    }
    return result;
  }
  queryEventItemsByUsers(userIds) {
    const recordsByUserId = this.queryItemsByUsers(userIds);
    return new Map([...recordsByUserId.entries()].map(([userId, records]) => [
      userId,
      records.filter((record) => record.type === "events")
    ]));
  }
  buildSeededRecords() {
    return SeedEventsBuilder.buildRecordCollection({
      invitationsByUser: SeedEventsBuilder.buildSeedInvitationItemsByUser(),
      eventsByUser: SeedEventsBuilder.buildSeedEventItemsByUser(),
      hostingByUser: SeedEventsBuilder.buildSeedHostingItemsByUser(),
      statusById: SeedEventsBuilder.buildSeedStatusById()
    });
  }
  mergeSeededRecords(current, seeded) {
    const nextById = __spreadValues({}, current.byId);
    const nextIds = [...current.ids];
    const existingIds = new Set(nextIds);
    let changed = false;
    for (const recordKey of seeded.ids) {
      const seededRecord = seeded.byId[recordKey];
      if (!seededRecord || existingIds.has(recordKey)) {
        if (seededRecord) {
          const currentRecord = current.byId[recordKey];
          const nextRecord = SeedEventsBuilder.cloneRecord(seededRecord);
          if (!currentRecord || !this.sameRecord(currentRecord, nextRecord)) {
            nextById[recordKey] = nextRecord;
            changed = true;
          }
        }
        continue;
      }
      nextById[recordKey] = SeedEventsBuilder.cloneRecord(seededRecord);
      nextIds.push(recordKey);
      existingIds.add(recordKey);
      changed = true;
    }
    return {
      table: {
        byId: nextById,
        ids: nextIds
      },
      changed
    };
  }
  sameRecord(left, right) {
    return JSON.stringify(SeedEventsBuilder.cloneRecord(left)) === JSON.stringify(SeedEventsBuilder.cloneRecord(right));
  }
  static \u0275fac = function SeedEventsRepository_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SeedEventsRepository)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SeedEventsRepository, factory: _SeedEventsRepository.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SeedEventsRepository, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/local/seed/repositories/event-tickets-seed.repository.ts
var SeedEventTicketsRepository = class _SeedEventTicketsRepository {
  memoryDb = inject(LocalMemoryDb);
  initialized = false;
  seedDefaults() {
    const state = this.memoryDb.read();
    const currentTable = state[EVENT_TICKETS_TABLE_NAME];
    if (this.initialized || currentTable.ids.length > 0) {
      this.initialized = true;
      return false;
    }
    const events = state[EVENTS_TABLE_NAME].ids.map((id) => state[EVENTS_TABLE_NAME].byId[id]).filter((record) => Boolean(record));
    const seeded = SeedEventTicketsBuilder.buildRecordCollection(events);
    this.memoryDb.write((currentState) => __spreadProps(__spreadValues({}, currentState), {
      [EVENT_TICKETS_TABLE_NAME]: seeded
    }));
    this.initialized = true;
    return seeded.ids.length > 0;
  }
  static \u0275fac = function SeedEventTicketsRepository_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SeedEventTicketsRepository)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SeedEventTicketsRepository, factory: _SeedEventTicketsRepository.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SeedEventTicketsRepository, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/local/seed/repositories/notifications-seed.repository.ts
var SeedNotificationsRepository = class _SeedNotificationsRepository {
  static SEED_VERSION = "notification-center-v4";
  memoryDb = inject(LocalMemoryDb);
  seedForUser(userId) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return false;
    }
    const snapshot = this.memoryDb.read();
    if (!snapshot[USERS_TABLE_NAME].byId[normalizedUserId]) {
      return false;
    }
    const seedMarker = `${_SeedNotificationsRepository.SEED_VERSION}:${normalizedUserId}`;
    if (snapshot[NOTIFICATIONS_TABLE_NAME].seededUserIds.includes(seedMarker)) {
      return false;
    }
    const users = snapshot[USERS_TABLE_NAME].ids.map((id) => snapshot[USERS_TABLE_NAME].byId[id]).filter((user) => Boolean(user));
    const seedRecords = SeedNotificationsBuilder.buildForUser(normalizedUserId, users);
    if (seedRecords.length === 0) {
      return false;
    }
    this.memoryDb.write((state) => {
      const table = state[NOTIFICATIONS_TABLE_NAME];
      const byId = __spreadValues({}, table.byId);
      const ids = [...table.ids];
      const recipientIds = [...table.idsByRecipientUserId[normalizedUserId] ?? []];
      for (const record of seedRecords) {
        if (byId[record.id]) {
          continue;
        }
        byId[record.id] = this.cloneRecord(record);
        ids.push(record.id);
        recipientIds.push(record.id);
      }
      const normalizedRecipientIds = [...new Set(recipientIds)];
      const unreadCount = normalizedRecipientIds.map((id) => byId[id]).filter((record) => record && !record.readAtIso).length;
      const user = state[USERS_TABLE_NAME].byId[normalizedUserId];
      return __spreadProps(__spreadValues({}, state), {
        [NOTIFICATIONS_TABLE_NAME]: __spreadProps(__spreadValues({}, table), {
          byId,
          ids: [...new Set(ids)],
          idsByRecipientUserId: __spreadProps(__spreadValues({}, table.idsByRecipientUserId), {
            [normalizedUserId]: normalizedRecipientIds
          }),
          mutedByUserId: __spreadProps(__spreadValues({}, table.mutedByUserId), {
            [normalizedUserId]: table.mutedByUserId[normalizedUserId] === true
          }),
          seededUserIds: [.../* @__PURE__ */ new Set([...table.seededUserIds, seedMarker])]
        }),
        [USERS_TABLE_NAME]: __spreadProps(__spreadValues({}, state[USERS_TABLE_NAME]), {
          byId: __spreadProps(__spreadValues({}, state[USERS_TABLE_NAME].byId), {
            [normalizedUserId]: __spreadProps(__spreadValues({}, user), {
              notificationPreferences: __spreadProps(__spreadValues({}, user.notificationPreferences), {
                muted: table.mutedByUserId[normalizedUserId] === true
              }),
              activities: __spreadProps(__spreadValues({}, user.activities), {
                notifications: unreadCount
              })
            })
          })
        })
      });
    });
    return true;
  }
  cloneRecord(record) {
    return __spreadProps(__spreadValues({}, record), {
      payload: record.payload ? __spreadValues({}, record.payload) : null
    });
  }
  static \u0275fac = function SeedNotificationsRepository_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SeedNotificationsRepository)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SeedNotificationsRepository, factory: _SeedNotificationsRepository.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SeedNotificationsRepository, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/local/seed/repositories/profile-experiences-seed.repository.ts
var SeedProfileExperiencesRepository = class _SeedProfileExperiencesRepository {
  memoryDb = inject(LocalMemoryDb);
  initialized = false;
  seedDefaults() {
    if (this.initialized) {
      return;
    }
    const seededByUserId = SeedProfileExperienceBuilder.buildSeededExperiencesByUserId();
    const table = this.memoryDb.read()[PROFILE_EXPERIENCES_TABLE_NAME];
    const nextByUserId = __spreadValues({}, table.byUserId);
    const nextUserIds = [...table.userIds];
    let changed = false;
    for (const [userId, entries] of Object.entries(seededByUserId)) {
      const normalizedUserId = userId.trim();
      if (!normalizedUserId || Object.prototype.hasOwnProperty.call(nextByUserId, normalizedUserId)) {
        continue;
      }
      nextByUserId[normalizedUserId] = this.cloneEntries(entries);
      nextUserIds.push(normalizedUserId);
      changed = true;
    }
    if (changed) {
      this.memoryDb.write((state) => __spreadProps(__spreadValues({}, state), {
        [PROFILE_EXPERIENCES_TABLE_NAME]: {
          byUserId: nextByUserId,
          userIds: [...new Set(nextUserIds)]
        }
      }));
    }
    this.initialized = true;
  }
  cloneEntries(entries) {
    return entries.map((entry) => __spreadValues({}, entry));
  }
  static \u0275fac = function SeedProfileExperiencesRepository_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SeedProfileExperiencesRepository)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SeedProfileExperiencesRepository, factory: _SeedProfileExperiencesRepository.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SeedProfileExperiencesRepository, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/local/seed/repositories/operator-registry-seed.repository.ts
var SeedOperatorRegistryRepository = class _SeedOperatorRegistryRepository {
  memoryDb = inject(LocalMemoryDb);
  registryRepository = inject(LocalOperatorRegistryRepository);
  async whenReady() {
    await this.registryRepository.whenReady();
  }
  async prepareBootstrap() {
    await this.whenReady();
    const memory = {
      appState: this.memoryDb.read(),
      registryRecord: await this.registryRepository.read()
    };
    return {
      memory,
      result: SeedOperatorRegistryBuilder.buildBootstrapMemory(memory)
    };
  }
  async seedUsers(context) {
    const usersTable = context.result.appState[USERS_TABLE_NAME];
    if (context.result.usersChanged) {
      this.memoryDb.write((current) => __spreadProps(__spreadValues({}, current), {
        [USERS_TABLE_NAME]: usersTable
      }));
    }
    await this.memoryDb.writeIndexedDbTableEntry(USERS_TABLE_NAME, usersTable);
  }
  async seedRegistry(context) {
    await this.registryRepository.write(context.result.registryRecord);
  }
  static \u0275fac = function SeedOperatorRegistryRepository_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SeedOperatorRegistryRepository)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SeedOperatorRegistryRepository, factory: _SeedOperatorRegistryRepository.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SeedOperatorRegistryRepository, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/local/seed/services/bootstrap-registry.service.ts
var SeedBootstrapRegistryService = class _SeedBootstrapRegistryService {
  users = [];
  userIds = [];
  eventsByUserId = /* @__PURE__ */ new Map();
  assetsByUserId = /* @__PURE__ */ new Map();
  clear() {
    this.users = [];
    this.userIds = [];
    this.eventsByUserId.clear();
    this.assetsByUserId.clear();
  }
  registerUsers(users) {
    this.users = users.map((user) => __spreadProps(__spreadValues({}, user), { images: [...user.images ?? []] }));
    this.userIds = this.users.map((user) => user.id.trim()).filter((userId) => userId.length > 0);
  }
  getUsers() {
    return this.users;
  }
  getUserIds() {
    return this.userIds;
  }
  registerEventsByUserId(eventsByUserId) {
    this.eventsByUserId = new Map(eventsByUserId);
  }
  getEventsByUserId() {
    return this.eventsByUserId;
  }
  registerAssetsByUserId(assetsByUserId) {
    this.assetsByUserId = new Map(assetsByUserId);
  }
  getAssetsByUserId() {
    return this.assetsByUserId;
  }
  static \u0275fac = function SeedBootstrapRegistryService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SeedBootstrapRegistryService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SeedBootstrapRegistryService, factory: _SeedBootstrapRegistryService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SeedBootstrapRegistryService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/local/seed/services/demo-bootstrap.service.ts
var SeedDemoBootstrapService = class _SeedDemoBootstrapService {
  process = inject(BootstrapProcessService);
  registry = inject(SeedBootstrapRegistryService);
  memoryDb = inject(LocalMemoryDb);
  adminSeed = inject(SeedAdminBootstrapRepository);
  chatsSeed = inject(SeedChatsRepository);
  eventsSeed = inject(SeedEventsRepository);
  eventTicketsSeed = inject(SeedEventTicketsRepository);
  assetsSeed = inject(SeedAssetsRepository);
  eventFeedbackSeed = inject(SeedEventFeedbackRepository);
  usersRatingsSeed = inject(SeedUsersRatingsRepository);
  usersSeed = inject(SeedUsersRepository);
  notificationsSeed = inject(SeedNotificationsRepository);
  activityMembersSeed = inject(SeedActivityMembersRepository);
  activityResourcesSeed = inject(SeedActivityResourcesRepository);
  profileExperiencesSeed = inject(SeedProfileExperiencesRepository);
  contactsSeed = inject(SeedContactsRepository);
  operatorSeed = inject(SeedOperatorRegistryRepository);
  selectorPromise = null;
  selectorReady = false;
  adminSelectorPromise = null;
  adminSelectorReady = false;
  operatorSelectorPromise = null;
  operatorSelectorReady = false;
  operatorSeedPromise = null;
  unionSelectorPromise = null;
  unionSelectorReady = false;
  adminWorkspacePromise = null;
  adminWorkspaceReady = false;
  commonCollectionsPromise = null;
  commonCollectionsReady = false;
  readyUserIds = /* @__PURE__ */ new Set();
  lastProcessState = {
    percent: 0,
    label: "Preparing demo selector",
    stage: "selector"
  };
  listeners = /* @__PURE__ */ new Set();
  async ensureDemoSelectorReady(mode, onProgress) {
    if (mode === "union") {
      await this.ensureUnionSelectorReady(onProgress);
      return;
    }
    if (mode === "admin") {
      await this.ensureAdminSelectorReady(onProgress);
      return;
    }
    if (mode === "operator") {
      await this.ensureOperatorSelectorReady(onProgress);
      return;
    }
    if (onProgress) {
      this.listeners.add(onProgress);
      onProgress(this.lastProcessState);
    }
    if (this.selectorReady) {
      this.emitProgress(bootstrapProcessStep("ready"));
      if (onProgress) {
        this.listeners.delete(onProgress);
      }
      return;
    }
    if (!this.selectorPromise) {
      this.selectorPromise = this.runMemberBootstrap().finally(() => {
        this.selectorPromise = null;
      });
    }
    try {
      await this.selectorPromise;
    } finally {
      if (onProgress) {
        this.listeners.delete(onProgress);
      }
    }
  }
  async ensureUserReady(userId, mode, onProgress) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      this.emitSessionReady(onProgress);
      return;
    }
    if (mode === "admin") {
      await this.ensureAdminWorkspaceReady(normalizedUserId, onProgress);
      return;
    }
    if (mode === "operator") {
      await this.ensureOperatorSelectorReady(onProgress);
      this.emitSessionReady(onProgress, normalizedUserId);
      return;
    }
    await this.ensureDemoSelectorReady(mode, onProgress);
    await this.ensureUserSessionReady(normalizedUserId, onProgress);
  }
  async ensureUserSessionReady(userId, onProgress) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      this.emitSessionReady(onProgress);
      return;
    }
    const filterPreferencesChanged = this.usersSeed.seedDefaultUserFilterPreferencesForUser(normalizedUserId);
    const notificationsChanged = this.notificationsSeed.seedForUser(normalizedUserId);
    const alreadyReady = this.readyUserIds.has(normalizedUserId);
    let contextualChatsChanged = false;
    let eventFeedbackChanged = false;
    if (!alreadyReady) {
      onProgress?.(bootstrapProcessStep("session"));
      await this.process.waitForUiYield();
      onProgress?.(bootstrapProcessStep("sessionChats"));
      await this.process.waitForUiYield();
      contextualChatsChanged = this.chatsSeed.seedContextualRecordsForUser(normalizedUserId, this.eventsSeed.queryItemsByUser(normalizedUserId));
      onProgress?.(bootstrapProcessStep("sessionFeedback"));
      await this.process.waitForUiYield();
      eventFeedbackChanged = this.seedEventFeedbackState();
    }
    const activityCountersChanged = this.usersSeed.stampSeededActivityCountsForUser(normalizedUserId);
    const impressionsChanged = this.usersSeed.stampSeededImpressionsForUser(normalizedUserId);
    await this.flushSessionTablesIfChanged(onProgress, {
      filterPreferencesChanged,
      notificationsChanged,
      activityCountersChanged,
      impressionsChanged,
      contextualChatsChanged,
      eventFeedbackChanged
    });
    this.emitSessionReady(onProgress, alreadyReady ? void 0 : normalizedUserId);
  }
  async runMemberBootstrap() {
    if (this.selectorReady) {
      this.emitProgress(bootstrapProcessStep("ready"));
      return;
    }
    await this.usersSeed.whenReady();
    await this.runBootstrapStep("selector");
    await this.ensureCommonDemoCollectionsReady();
    await this.runBootstrapStep("indexedDb");
    this.selectorReady = true;
    if (this.adminSelectorReady && this.operatorSelectorReady) {
      this.unionSelectorReady = true;
    }
    this.emitProgress(bootstrapProcessStep("ready"));
  }
  async ensureAdminSelectorReady(onProgress) {
    if (onProgress) {
      this.listeners.add(onProgress);
      onProgress(this.lastProcessState);
    }
    if (this.adminSelectorReady) {
      this.emitProgress(bootstrapProcessStep("ready"));
      if (onProgress) {
        this.listeners.delete(onProgress);
      }
      return;
    }
    if (!this.adminSelectorPromise) {
      this.adminSelectorPromise = this.runAdminSelectorBootstrap().finally(() => {
        this.adminSelectorPromise = null;
      });
    }
    try {
      await this.adminSelectorPromise;
    } finally {
      if (onProgress) {
        this.listeners.delete(onProgress);
      }
    }
  }
  async runAdminSelectorBootstrap() {
    if (this.adminSelectorReady) {
      this.emitProgress(bootstrapProcessStep("ready"));
      return;
    }
    await this.adminSeed.whenUsersReady();
    await this.runBootstrapStep("selector");
    await this.ensureCommonDemoCollectionsReady();
    await this.seedDemoAdminUsers();
    await this.runBootstrapStep("indexedDb");
    this.selectorReady = true;
    this.adminSelectorReady = true;
    this.unionSelectorReady = this.operatorSelectorReady;
    this.emitProgress(bootstrapProcessStep("ready"));
  }
  async ensureOperatorSelectorReady(onProgress) {
    if (onProgress) {
      this.listeners.add(onProgress);
      onProgress(this.lastProcessState);
    }
    if (this.operatorSelectorReady) {
      this.emitProgress(bootstrapProcessStep("ready"));
      if (onProgress) {
        this.listeners.delete(onProgress);
      }
      return;
    }
    if (!this.operatorSelectorPromise) {
      this.operatorSelectorPromise = this.runOperatorSelectorBootstrap().finally(() => {
        this.operatorSelectorPromise = null;
      });
    }
    try {
      await this.operatorSelectorPromise;
    } finally {
      if (onProgress) {
        this.listeners.delete(onProgress);
      }
    }
  }
  async runOperatorSelectorBootstrap() {
    if (this.operatorSelectorReady) {
      this.emitProgress(bootstrapProcessStep("ready"));
      return;
    }
    await this.operatorSeed.whenReady();
    await this.runBootstrapStep("selector");
    await this.ensureDemoOperatorSeedReady();
    this.emitProgress(bootstrapProcessStep("ready"));
  }
  async ensureUnionSelectorReady(onProgress) {
    if (onProgress) {
      this.listeners.add(onProgress);
      onProgress(this.lastProcessState);
    }
    if (this.unionSelectorReady) {
      this.emitProgress(bootstrapProcessStep("ready"));
      if (onProgress) {
        this.listeners.delete(onProgress);
      }
      return;
    }
    if (!this.unionSelectorPromise) {
      this.unionSelectorPromise = this.runUnionSelectorBootstrap().finally(() => {
        this.unionSelectorPromise = null;
      });
    }
    try {
      await this.unionSelectorPromise;
    } finally {
      if (onProgress) {
        this.listeners.delete(onProgress);
      }
    }
  }
  async runUnionSelectorBootstrap() {
    if (this.unionSelectorReady) {
      this.emitProgress(bootstrapProcessStep("ready"));
      return;
    }
    await Promise.all([
      this.usersSeed.whenReady(),
      this.operatorSeed.whenReady()
    ]);
    await this.runBootstrapStep("selector");
    await this.ensureCommonDemoCollectionsReady();
    await this.seedDemoAdminUsers();
    await this.ensureDemoOperatorSeedReady();
    this.selectorReady = true;
    this.adminSelectorReady = true;
    this.operatorSelectorReady = true;
    this.unionSelectorReady = true;
    this.emitProgress(bootstrapProcessStep("ready"));
  }
  async ensureAdminWorkspaceReady(adminUserId, onProgress) {
    await this.ensureDemoSelectorReady("admin");
    if (onProgress) {
      this.listeners.add(onProgress);
    }
    if (!this.adminWorkspaceReady && !this.adminWorkspacePromise) {
      this.adminWorkspacePromise = this.runAdminWorkspaceBootstrap().finally(() => {
        this.adminWorkspacePromise = null;
      });
    }
    try {
      if (this.adminWorkspacePromise) {
        await this.adminWorkspacePromise;
      }
      this.emitSessionReady(onProgress, adminUserId);
    } finally {
      if (onProgress) {
        this.listeners.delete(onProgress);
      }
    }
  }
  async runAdminWorkspaceBootstrap() {
    if (this.adminWorkspaceReady) {
      this.emitProgress(bootstrapProcessStep("ready"));
      return;
    }
    await this.runBootstrapStep("helpCenter", async () => {
      await this.adminSeed.seedHelpCenter();
      await this.flushBootstrapTables([HELP_CENTER_TABLE_NAME]);
    });
    await this.runBootstrapStep("ideaPosts", async () => {
      await this.adminSeed.seedIdeaPosts();
      await this.flushBootstrapTables([IDEA_POSTS_TABLE_NAME]);
    });
    await this.seedAdminSpecificCollections();
    await this.runBootstrapStep("affinityGraph", () => this.adminSeed.buildAndWriteAffinityGraphSnapshot());
    await this.runBootstrapStep("indexedDb");
    this.adminWorkspaceReady = true;
    this.emitProgress(bootstrapProcessStep("ready"));
  }
  async seedDemoAdminUsers() {
    await this.runBootstrapStep("adminUsers", async () => {
      await this.adminSeed.seedDemoAdminUsers();
      await this.flushBootstrapTables([USERS_TABLE_NAME]);
    });
  }
  async ensureDemoOperatorSeedReady() {
    if (this.operatorSelectorReady) {
      return;
    }
    if (!this.operatorSeedPromise) {
      this.operatorSeedPromise = this.seedDemoOperatorTransaction().then(() => {
        this.operatorSelectorReady = true;
        if (this.selectorReady && this.adminSelectorReady) {
          this.unionSelectorReady = true;
        }
      }).finally(() => {
        this.operatorSeedPromise = null;
      });
    }
    await this.operatorSeedPromise;
  }
  async seedDemoOperatorTransaction() {
    const context = await this.operatorSeed.prepareBootstrap();
    await this.runBootstrapStep("users", () => this.operatorSeed.seedUsers(context));
    await this.runBootstrapStep("indexedDb", () => this.operatorSeed.seedRegistry(context));
  }
  async ensureCommonDemoCollectionsReady() {
    if (this.commonCollectionsReady) {
      return;
    }
    if (!this.commonCollectionsPromise) {
      this.commonCollectionsPromise = this.seedCommonDemoCollections().then(() => {
        this.commonCollectionsReady = true;
      }).finally(() => {
        this.commonCollectionsPromise = null;
      });
    }
    await this.commonCollectionsPromise;
  }
  async seedCommonDemoCollections() {
    this.registry.clear();
    try {
      let seededUsers = [];
      let seededUserIds = [];
      let assetsByUserId = /* @__PURE__ */ new Map();
      const ownerUserIds = () => seededUserIds.length > 0 ? seededUserIds : void 0;
      await this.runBootstrapStep("chats", async () => {
        this.chatsSeed.seedDefaults();
        await this.flushBootstrapTables([CHATS_TABLE_NAME, CHAT_MESSAGES_TABLE_NAME]);
      });
      await this.runBootstrapStep("events", async () => {
        const eventsChanged = this.eventsSeed.seedDefaults();
        const eventTicketsChanged = this.eventTicketsSeed.seedDefaults();
        if (eventsChanged || eventTicketsChanged) {
          await this.flushBootstrapTables([EVENTS_TABLE_NAME, EVENT_TICKETS_TABLE_NAME]);
        }
      });
      await this.runBootstrapStep("users", async () => {
        seededUsers = this.usersSeed.seedDefaults();
        seededUserIds = seededUsers.map((user) => user.id.trim()).filter((userId) => userId.length > 0);
        this.registry.registerUsers(seededUsers);
        await this.flushBootstrapTables([USERS_TABLE_NAME]);
      });
      await this.runBootstrapStep("contacts", async () => {
        this.contactsSeed.seedDefaultContacts(seededUsers);
        await this.flushBootstrapTables([CONTACTS_TABLE_NAME]);
      });
      await this.runBootstrapStep("profileExperiences", async () => {
        this.profileExperiencesSeed.seedDefaults();
        await this.flushBootstrapTables([PROFILE_EXPERIENCES_TABLE_NAME]);
      });
      await this.runBootstrapStep("ratings", async () => {
        this.usersRatingsSeed.seedDefaults(seededUsers);
        await this.flushBootstrapTables([USER_RATES_TABLE_NAME]);
      });
      await this.runBootstrapStep("assets", () => {
        assetsByUserId = this.assetsSeed.seedDefaults(ownerUserIds(), seededUsers);
        this.registry.registerAssetsByUserId(assetsByUserId);
      });
      await this.runBootstrapStep("activityMembers", async () => {
        this.activityMembersSeed.seedDefaults(ownerUserIds(), assetsByUserId, seededUsers);
        await this.flushBootstrapTables([ACTIVITY_MEMBERS_TABLE_NAME, EVENTS_TABLE_NAME]);
      });
      await this.runBootstrapStep("activityResources", async () => {
        const sourceRecordsByUserId = this.registry.getEventsByUserId().size > 0 ? new Map(this.registry.getEventsByUserId()) : this.eventsSeed.queryItemsByUsers(seededUserIds);
        this.activityResourcesSeed.seedDefaults(ownerUserIds(), sourceRecordsByUserId, assetsByUserId);
        await this.flushBootstrapTables([ACTIVITY_RESOURCES_TABLE_NAME, ASSETS_TABLE_NAME]);
      });
    } finally {
      this.registry.clear();
    }
  }
  async seedAdminSpecificCollections() {
    await this.runBootstrapStep("adminWorkspaceData", async () => {
      const seedState = await this.adminSeed.seedDemoAdminStores();
      await this.adminSeed.seedDemoAdminMenuCounters(seedState);
      await this.flushBootstrapTables([USERS_TABLE_NAME]);
    });
    await this.runBootstrapStep("adminHelpLinks", async () => {
      await this.adminSeed.seedDemoAdminSupport("admin-demo-ava");
      await this.adminSeed.seedDemoAdminSupport("admin-demo-noel");
      await this.flushBootstrapTables([CHATS_TABLE_NAME, CHAT_MESSAGES_TABLE_NAME, SHARE_TOKENS_TABLE_NAME]);
    });
  }
  async runBootstrapStep(stage, work) {
    return await this.process.runStep(bootstrapProcessStep(stage), (state) => this.emitProgress(state), work);
  }
  async flushBootstrapTables(tableNames) {
    const uniqueTableNames = [...new Set(tableNames.map((tableName) => tableName.trim()).filter(Boolean))];
    if (uniqueTableNames.length === 0) {
      return;
    }
    const state = this.memoryDb.read();
    for (const tableName of uniqueTableNames) {
      await this.memoryDb.writeIndexedDbTableEntry(tableName, state[tableName]);
    }
    await this.process.waitForUiYield();
  }
  async flushSessionTablesIfChanged(onProgress, options) {
    const tableNames = this.sessionFlushTables(options);
    if (tableNames.length === 0) {
      return;
    }
    onProgress?.(bootstrapProcessStep("sessionIndexedDb"));
    await this.flushBootstrapTables(tableNames);
  }
  emitSessionReady(onProgress, readyUserId) {
    const normalizedReadyUserId = `${readyUserId ?? ""}`.trim();
    if (normalizedReadyUserId) {
      this.readyUserIds.add(normalizedReadyUserId);
    }
    onProgress?.(bootstrapProcessStep("sessionReady"));
  }
  sessionFlushTables(options) {
    const tableNames = [];
    if (options.filterPreferencesChanged) {
      tableNames.push(USER_FILTER_PREFERENCES_TABLE_NAME);
    }
    if (options.notificationsChanged) {
      tableNames.push(NOTIFICATIONS_TABLE_NAME);
    }
    if (options.notificationsChanged || options.activityCountersChanged || options.impressionsChanged) {
      tableNames.push(USERS_TABLE_NAME);
    }
    if (options.contextualChatsChanged) {
      tableNames.push(CHATS_TABLE_NAME);
      tableNames.push(CHAT_MESSAGES_TABLE_NAME);
    }
    if (options.eventFeedbackChanged) {
      tableNames.push(EVENT_FEEDBACK_TABLE_NAME);
    }
    return tableNames;
  }
  seedEventFeedbackState() {
    const seededUsers = this.usersSeed.seedDefaults();
    const seededUserIds = seededUsers.map((user) => user.id.trim()).filter((userId) => userId.length > 0);
    if (seededUsers.length === 0 || seededUserIds.length === 0) {
      return false;
    }
    const eventItemsByUserId = this.eventsSeed.queryEventItemsByUsers(seededUserIds);
    const itemsByUserId = this.eventsSeed.queryItemsByUsers(seededUserIds);
    return this.eventFeedbackSeed.seedDefaults(seededUsers, eventItemsByUserId, itemsByUserId);
  }
  emitProgress(state) {
    this.lastProcessState = this.process.normalize(state, "Preparing demo data");
    for (const listener of this.listeners) {
      listener(this.lastProcessState);
    }
  }
  static \u0275fac = function SeedDemoBootstrapService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SeedDemoBootstrapService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SeedDemoBootstrapService, factory: _SeedDemoBootstrapService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SeedDemoBootstrapService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
export {
  SeedDemoBootstrapService
};
//# sourceMappingURL=demo-bootstrap.service-TZU7VZHD.js.map
