import {
  ASSET_TYPE_ACCOMMODATION,
  ASSET_TYPE_SUPPLIES,
  ASSET_TYPE_TRANSPORT,
  EventFeedbackDetailDto
} from "./chunk-27OFLLFL.js";
import {
  Injectable,
  __objRest,
  __restKey,
  __spreadProps,
  __spreadValues,
  computed,
  environment,
  inject,
  setClassMetadata,
  signal,
  untracked,
  ɵɵdefineInjectable
} from "./chunk-FMXFYYCS.js";

// src/app/shared/core/common/user-role.ts
function hasOperatorRole(user) {
  return user?.operator === true;
}

// src/app/shared/ui/context/stores/app-context-store.utils.ts
function normalizeCounterValue(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.trunc(Number(value)));
}
function normalizeFilterPreferences(preferences) {
  const normalizeNumber = (value) => {
    if (!Number.isFinite(value)) {
      return void 0;
    }
    return Math.max(0, Math.trunc(Number(value)));
  };
  const normalizeStringArray = (values2) => {
    if (!Array.isArray(values2)) {
      return void 0;
    }
    const normalized2 = values2.map((value) => String(value).trim()).filter((value) => value.length > 0);
    return normalized2.length > 0 ? normalized2 : [];
  };
  const normalizeGenderArray = (values2) => {
    if (!Array.isArray(values2)) {
      return void 0;
    }
    const normalized2 = values2.map((value) => String(value).trim().toLowerCase()).filter((value) => value === "woman" || value === "man");
    return normalized2.length > 0 ? normalized2 : [];
  };
  const normalized = {};
  const ageMin = normalizeNumber(preferences.ageMin);
  const ageMax = normalizeNumber(preferences.ageMax);
  const heightMinCm = normalizeNumber(preferences.heightMinCm);
  const heightMaxCm = normalizeNumber(preferences.heightMaxCm);
  if (ageMin !== void 0) {
    normalized.ageMin = ageMin;
  }
  if (ageMax !== void 0) {
    normalized.ageMax = ageMax;
  }
  if (heightMinCm !== void 0) {
    normalized.heightMinCm = heightMinCm;
  }
  if (heightMaxCm !== void 0) {
    normalized.heightMaxCm = heightMaxCm;
  }
  const interests = normalizeStringArray(preferences.interests);
  const values = normalizeStringArray(preferences.values);
  const physiques = normalizeStringArray(preferences.physiques);
  const languages = normalizeStringArray(preferences.languages);
  const genders = normalizeGenderArray(preferences.genders);
  const horoscopes = normalizeStringArray(preferences.horoscopes);
  const traitLabels = normalizeStringArray(preferences.traitLabels);
  const smoking = normalizeStringArray(preferences.smoking);
  const drinking = normalizeStringArray(preferences.drinking);
  const workout = normalizeStringArray(preferences.workout);
  const pets = normalizeStringArray(preferences.pets);
  const familyPlans = normalizeStringArray(preferences.familyPlans);
  const children = normalizeStringArray(preferences.children);
  const loveStyles = normalizeStringArray(preferences.loveStyles);
  const communicationStyles = normalizeStringArray(preferences.communicationStyles);
  const sexualOrientations = normalizeStringArray(preferences.sexualOrientations);
  const religions = normalizeStringArray(preferences.religions);
  if (interests) {
    normalized.interests = interests;
  }
  if (values) {
    normalized.values = values;
  }
  if (physiques) {
    normalized.physiques = physiques;
  }
  if (languages) {
    normalized.languages = languages;
  }
  if (genders) {
    normalized.genders = genders;
  }
  if (horoscopes) {
    normalized.horoscopes = horoscopes;
  }
  if (traitLabels) {
    normalized.traitLabels = traitLabels;
  }
  if (smoking) {
    normalized.smoking = smoking;
  }
  if (drinking) {
    normalized.drinking = drinking;
  }
  if (workout) {
    normalized.workout = workout;
  }
  if (pets) {
    normalized.pets = pets;
  }
  if (familyPlans) {
    normalized.familyPlans = familyPlans;
  }
  if (children) {
    normalized.children = children;
  }
  if (loveStyles) {
    normalized.loveStyles = loveStyles;
  }
  if (communicationStyles) {
    normalized.communicationStyles = communicationStyles;
  }
  if (sexualOrientations) {
    normalized.sexualOrientations = sexualOrientations;
  }
  if (religions) {
    normalized.religions = religions;
  }
  return normalized;
}
function cloneImpressions(impressions) {
  return {
    host: cloneImpressionsSection(impressions.host),
    member: cloneImpressionsSection(impressions.member)
  };
}
function cloneChatCounters(counters) {
  return {
    all: normalizeCounterValue(counters?.all),
    event: normalizeCounterValue(counters?.event),
    subEvent: normalizeCounterValue(counters?.subEvent),
    group: normalizeCounterValue(counters?.group),
    service: normalizeCounterValue(counters?.service),
    appSupport: normalizeCounterValue(counters?.appSupport),
    supportCases: cloneSupportCaseCounters(counters?.supportCases)
  };
}
function cloneSupportCaseCounters(counters) {
  return {
    pending: normalizeCounterValue(counters?.pending),
    warned: normalizeCounterValue(counters?.warned),
    picked: normalizeCounterValue(counters?.picked),
    solved: normalizeCounterValue(counters?.solved),
    blocked: normalizeCounterValue(counters?.blocked),
    all: normalizeCounterValue(counters?.all)
  };
}
function cloneProfileExt(profileExt) {
  return {
    profile: cloneUserProfile(profileExt.profile),
    experienceEntries: (profileExt.experienceEntries ?? []).map((entry) => __spreadValues({}, entry))
  };
}
function cloneUserProfile(user) {
  return __spreadProps(__spreadValues({}, user), {
    notificationDevices: user.notificationDevices?.map((device) => __spreadValues({}, device)),
    languages: [...user.languages ?? []],
    images: [...user.images ?? []],
    profileDetails: cloneProfileDetails(user.profileDetails),
    notificationPreferences: user.notificationPreferences ? {
      muted: user.notificationPreferences.muted === true
    } : void 0,
    paymentTotals: user.paymentTotals ? {
      outgoing: __spreadValues({}, user.paymentTotals.outgoing ?? {}),
      incoming: __spreadValues({}, user.paymentTotals.incoming ?? {}),
      all: __spreadValues({}, user.paymentTotals.all ?? {})
    } : void 0,
    activities: {
      game: user.activities?.game ?? 0,
      chats: user.activities?.chats ?? 0,
      invitations: user.activities?.invitations ?? 0,
      events: user.activities?.events ?? 0,
      hosting: user.activities?.hosting ?? 0,
      cars: user.activities?.cars ?? 0,
      accommodation: user.activities?.accommodation ?? 0,
      supplies: user.activities?.supplies ?? 0,
      tickets: user.activities?.tickets ?? 0,
      contacts: user.activities?.contacts ?? 0,
      feedback: user.activities?.feedback ?? 0,
      notifications: user.activities?.notifications ?? 0,
      paymentRefundsPending: user.activities?.paymentRefundsPending ?? 0,
      chat: cloneChatCounters(user.activities?.chat),
      event: cloneEventCounters(user.activities?.event),
      asset: cloneAssetCounters(user.activities?.asset),
      eventFeedback: cloneEventFeedbackCounters(user.activities?.eventFeedback),
      adminJobs: user.activities?.adminJobs ?? 0,
      adminMetrics: user.activities?.adminMetrics ?? 0
    },
    impressions: user.impressions ? cloneImpressions(user.impressions) : void 0
  });
}
function adminUserFromProfile(profile) {
  const id = `${profile?.id ?? ""}`.trim();
  if (!id || !profile) {
    return null;
  }
  const name = `${profile.name ?? ""}`.trim() || "Admin";
  return {
    id,
    name,
    initials: `${profile.initials ?? ""}`.trim() || "AD",
    email: `${id}@myscoutee.local`,
    headline: profile.headline ?? null,
    about: profile.about ?? null,
    images: [...profile.images ?? []]
  };
}
function cloneEventCounters(counters) {
  return {
    all: normalizeCounterValue(Number(counters?.all) || 0),
    active: normalizeCounterValue(Number(counters?.active) || 0),
    pending: normalizeCounterValue(Number(counters?.pending) || 0),
    invitations: normalizeCounterValue(Number(counters?.invitations) || 0),
    hosting: normalizeCounterValue(Number(counters?.hosting) || 0),
    drafts: normalizeCounterValue(Number(counters?.drafts) || 0),
    watchlist: normalizeCounterValue(Number(counters?.watchlist) || 0),
    trash: normalizeCounterValue(Number(counters?.trash) || 0)
  };
}
function cloneAssetCounters(counters) {
  return {
    cars: normalizeCounterValue(Number(counters?.cars) || 0),
    accommodation: normalizeCounterValue(Number(counters?.accommodation) || 0),
    supplies: normalizeCounterValue(Number(counters?.supplies) || 0),
    tickets: normalizeCounterValue(Number(counters?.tickets) || 0),
    carsPending: normalizeCounterValue(Number(counters?.carsPending) || 0),
    accommodationPending: normalizeCounterValue(Number(counters?.accommodationPending) || 0),
    suppliesPending: normalizeCounterValue(Number(counters?.suppliesPending) || 0)
  };
}
function cloneEventFeedbackCounters(counters) {
  return {
    ownEvents: normalizeCounterValue(Number(counters?.ownEvents) || 0),
    pending: normalizeCounterValue(Number(counters?.pending) || 0),
    feedbacked: normalizeCounterValue(Number(counters?.feedbacked) || 0),
    removed: normalizeCounterValue(Number(counters?.removed) || 0)
  };
}
function cloneHelpCenterState(state) {
  return {
    activeRevision: state.activeRevision ? cloneHelpCenterRevision(state.activeRevision) : null,
    revisions: state.revisions.map((revision) => cloneHelpCenterRevision(revision)),
    auditTrail: state.auditTrail.map((entry) => __spreadValues({}, entry)),
    availableLanguages: state.availableLanguages.map((language) => __spreadValues({}, language))
  };
}
function cloneHelpCenterRevision(revision) {
  return __spreadProps(__spreadValues({}, revision), {
    sections: revision.sections.map((section) => __spreadProps(__spreadValues({}, section), {
      imageUrls: [...section.imageUrls ?? []],
      details: [...section.details ?? []],
      points: [...section.points ?? []]
    }))
  });
}
function cloneImpressionsSection(section) {
  if (!section) {
    return void 0;
  }
  return __spreadProps(__spreadValues({}, section), {
    vibeBadges: [...section.vibeBadges ?? []],
    personalityBadges: [...section.personalityBadges ?? []],
    personalityTraits: (section.personalityTraits ?? []).map((trait) => __spreadValues({}, trait)),
    categoryBadges: [...section.categoryBadges ?? []]
  });
}
function cloneProfileDetails(groups) {
  if (!groups) {
    return void 0;
  }
  return groups.map((group) => ({
    title: `${group.title ?? ""}`,
    rows: (group.rows ?? []).map((row) => ({
      labelKey: `${row.labelKey ?? ""}`,
      value: `${row.value ?? ""}`,
      privacy: row.privacy,
      options: [...row.options ?? []]
    }))
  }));
}

// src/app/shared/ui/context/stores/activity.store.ts
var ACTIVITY_COUNTER_KEYS = [
  "game",
  "chats",
  "invitations",
  "events",
  "hosting",
  "cars",
  "accommodation",
  "supplies",
  "tickets",
  "contacts",
  "feedback",
  "notifications",
  "paymentRefundsPending",
  "adminJobs",
  "adminMetrics"
];
var ActivityStore = class _ActivityStore {
  _counterOverridesByUserId = signal({}, ...ngDevMode ? [{ debugName: "_counterOverridesByUserId" }] : (
    /* istanbul ignore next */
    []
  ));
  counterRevisionByUserId = {};
  _activityMembersSync = signal(null, ...ngDevMode ? [{ debugName: "_activityMembersSync" }] : (
    /* istanbul ignore next */
    []
  ));
  _activityMembersSyncByOwnerId = signal({}, ...ngDevMode ? [{ debugName: "_activityMembersSyncByOwnerId" }] : (
    /* istanbul ignore next */
    []
  ));
  _activityResourceSync = signal(null, ...ngDevMode ? [{ debugName: "_activityResourceSync" }] : (
    /* istanbul ignore next */
    []
  ));
  _activityResourceMemberDeltaSync = signal(null, ...ngDevMode ? [{ debugName: "_activityResourceMemberDeltaSync" }] : (
    /* istanbul ignore next */
    []
  ));
  _activityEventRuntimeSync = signal(null, ...ngDevMode ? [{ debugName: "_activityEventRuntimeSync" }] : (
    /* istanbul ignore next */
    []
  ));
  _activityChatMetricBucketPatch = signal(null, ...ngDevMode ? [{ debugName: "_activityChatMetricBucketPatch" }] : (
    /* istanbul ignore next */
    []
  ));
  _activityEventFeedbackSubmitSync = signal(null, ...ngDevMode ? [{ debugName: "_activityEventFeedbackSubmitSync" }] : (
    /* istanbul ignore next */
    []
  ));
  counterOverridesByUserId = this._counterOverridesByUserId.asReadonly();
  activityMembersSync = this._activityMembersSync.asReadonly();
  activityMembersSyncByOwnerId = this._activityMembersSyncByOwnerId.asReadonly();
  activityResourceSync = this._activityResourceSync.asReadonly();
  activityResourceMemberDeltaSync = this._activityResourceMemberDeltaSync.asReadonly();
  activityEventRuntimeSync = this._activityEventRuntimeSync.asReadonly();
  activityChatMetricBucketPatch = this._activityChatMetricBucketPatch.asReadonly();
  activityEventFeedbackSubmitSync = this._activityEventFeedbackSubmitSync.asReadonly();
  getUserCounterOverride(userId, key) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return null;
    }
    const value = this._counterOverridesByUserId()[normalizedUserId]?.[key];
    if (!Number.isFinite(value)) {
      return null;
    }
    return normalizeCounterValue(value);
  }
  getUserCounterOverrides(userId) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return {};
    }
    const overrides = this._counterOverridesByUserId()[normalizedUserId];
    if (!overrides) {
      return {};
    }
    return __spreadValues({}, overrides);
  }
  setUserCounterOverride(userId, key, value) {
    this.patchUserCounterOverrides(userId, { [key]: value });
  }
  patchUserCounterOverrides(userId, patch) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return;
    }
    const normalizedPatch = this.normalizeCounterPatch(patch);
    if (Object.keys(normalizedPatch).length === 0) {
      return;
    }
    this.bumpCounterRevision(normalizedUserId);
    this.writeCounterOverrides(normalizedUserId, normalizedPatch);
  }
  captureUserCounterSyncToken(userId) {
    const normalizedUserId = userId.trim();
    return {
      userId: normalizedUserId,
      revision: this.counterRevisionByUserId[normalizedUserId] ?? 0
    };
  }
  applyRealtimeCounterOverrides(token, patch) {
    const normalizedUserId = token.userId.trim();
    if (!normalizedUserId || token.revision !== (this.counterRevisionByUserId[normalizedUserId] ?? 0)) {
      return false;
    }
    const normalizedPatch = this.normalizeCounterPatch(patch);
    if (Object.keys(normalizedPatch).length === 0) {
      return false;
    }
    this.writeCounterOverrides(normalizedUserId, normalizedPatch);
    return true;
  }
  applyCanonicalCounterOverrides(token, counters) {
    return this.applyRealtimeCounterOverrides(token, {
      game: normalizeCounterValue(counters.game),
      chats: normalizeCounterValue(counters.chats),
      invitations: normalizeCounterValue(counters.invitations),
      events: normalizeCounterValue(counters.events),
      hosting: normalizeCounterValue(counters.hosting),
      cars: normalizeCounterValue(counters.cars),
      accommodation: normalizeCounterValue(counters.accommodation),
      supplies: normalizeCounterValue(counters.supplies),
      tickets: normalizeCounterValue(counters.tickets),
      contacts: normalizeCounterValue(counters.contacts),
      feedback: normalizeCounterValue(counters.feedback),
      notifications: normalizeCounterValue(counters.notifications),
      chat: cloneChatCounters(counters.chat),
      event: cloneEventCounters(counters.event),
      asset: cloneAssetCounters(counters.asset),
      eventFeedback: cloneEventFeedbackCounters(counters.eventFeedback),
      adminJobs: normalizeCounterValue(counters.adminJobs),
      adminMetrics: normalizeCounterValue(counters.adminMetrics)
    });
  }
  normalizeCounterPatch(patch) {
    const normalizedPatch = {};
    for (const key of ACTIVITY_COUNTER_KEYS) {
      if (!Object.prototype.hasOwnProperty.call(patch, key)) {
        continue;
      }
      const value = patch[key];
      if (!Number.isFinite(value)) {
        continue;
      }
      normalizedPatch[key] = normalizeCounterValue(value);
    }
    if (patch.event) {
      normalizedPatch.event = cloneEventCounters(patch.event);
    }
    if (patch.chat) {
      normalizedPatch.chat = cloneChatCounters(patch.chat);
    }
    if (patch.asset) {
      normalizedPatch.asset = cloneAssetCounters(patch.asset);
    }
    if (patch.eventFeedback) {
      normalizedPatch.eventFeedback = cloneEventFeedbackCounters(patch.eventFeedback);
    }
    return normalizedPatch;
  }
  writeCounterOverrides(userId, patch) {
    this._counterOverridesByUserId.update((state) => __spreadProps(__spreadValues({}, state), {
      [userId]: __spreadValues(__spreadValues({}, state[userId] ?? {}), patch)
    }));
  }
  bumpCounterRevision(userId) {
    this.counterRevisionByUserId[userId] = (this.counterRevisionByUserId[userId] ?? 0) + 1;
  }
  signalUserEventBucketCount(userId, scope, count, baseCounters = null) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return;
    }
    const normalizedCount = normalizeCounterValue(count);
    const currentOverrides = this._counterOverridesByUserId()[normalizedUserId] ?? {};
    const event = cloneEventCounters(currentOverrides.event ?? baseCounters?.event);
    const patch = { event };
    switch (scope) {
      case "all":
        event.all = normalizedCount;
        break;
      case "active-events":
        event.active = normalizedCount;
        patch.events = normalizedCount;
        break;
      case "pending":
        event.pending = normalizedCount;
        break;
      case "invitations":
        event.invitations = normalizedCount;
        patch.invitations = normalizedCount;
        break;
      case "my-events":
        event.hosting = normalizedCount;
        patch.hosting = normalizedCount;
        break;
      case "drafts":
        event.drafts = normalizedCount;
        break;
      case "watchlist":
        event.watchlist = normalizedCount;
        break;
      case "trash":
        event.trash = normalizedCount;
        break;
    }
    this.patchUserCounterOverrides(normalizedUserId, patch);
  }
  signalUserEventCounterSnapshot(userId, counters) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId || !counters) {
      return;
    }
    const event = cloneEventCounters(counters);
    this.patchUserCounterOverrides(normalizedUserId, {
      events: event.active,
      invitations: event.invitations,
      hosting: event.hosting,
      event
    });
  }
  signalUserChatCounterSnapshot(userId, chats, counters) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId || !Number.isFinite(chats) || !counters) {
      return;
    }
    this.patchUserCounterOverrides(normalizedUserId, {
      chats: normalizeCounterValue(chats),
      chat: cloneChatCounters(counters)
    });
  }
  signalUserSupportCaseStatusTransition(userId, previousStatus, nextStatus, baseCounters = null) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId || !previousStatus || !nextStatus || previousStatus === nextStatus) {
      return;
    }
    const current = cloneChatCounters(this._counterOverridesByUserId()[normalizedUserId]?.chat ?? baseCounters);
    current.supportCases[previousStatus] = Math.max(0, current.supportCases[previousStatus] - 1);
    current.supportCases[nextStatus] += 1;
    this.patchUserCounterOverrides(normalizedUserId, { chat: current });
  }
  signalUserRateCounterSnapshot(userId, game) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId || !Number.isFinite(game)) {
      return;
    }
    this.patchUserCounterOverrides(normalizedUserId, {
      game: normalizeCounterValue(game)
    });
  }
  applyInactiveActivitiesCounterSnapshot(token, counters, activePrimaryFilter) {
    const patch = {};
    if (activePrimaryFilter !== "rates") {
      patch.game = normalizeCounterValue(counters.game);
    }
    if (activePrimaryFilter !== "chats") {
      patch.chats = normalizeCounterValue(counters.chats);
      patch.chat = cloneChatCounters(counters.chat);
    }
    if (activePrimaryFilter !== "events" && activePrimaryFilter !== "hosting" && activePrimaryFilter !== "invitations") {
      patch.events = normalizeCounterValue(counters.events);
      patch.invitations = normalizeCounterValue(counters.invitations);
      patch.hosting = normalizeCounterValue(counters.hosting);
      patch.event = cloneEventCounters(counters.event);
    }
    return this.applyRealtimeCounterOverrides(token, patch);
  }
  signalUserTicketBucketCount(userId, count, baseCounters = null) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return;
    }
    const normalizedCount = normalizeCounterValue(count);
    const currentOverrides = this._counterOverridesByUserId()[normalizedUserId] ?? {};
    const asset = cloneAssetCounters(currentOverrides.asset ?? baseCounters?.asset);
    asset.tickets = normalizedCount;
    this.patchUserCounterOverrides(normalizedUserId, {
      tickets: normalizedCount,
      asset
    });
  }
  signalUserAssetBucketCount(userId, type, count, baseCounters = null) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return;
    }
    const normalizedCount = normalizeCounterValue(count);
    const currentOverrides = this._counterOverridesByUserId()[normalizedUserId] ?? {};
    const asset = cloneAssetCounters(currentOverrides.asset ?? baseCounters?.asset);
    const patch = { asset };
    switch (type) {
      case ASSET_TYPE_TRANSPORT:
        asset.cars = normalizedCount;
        patch.cars = normalizedCount;
        break;
      case ASSET_TYPE_ACCOMMODATION:
        asset.accommodation = normalizedCount;
        patch.accommodation = normalizedCount;
        break;
      case ASSET_TYPE_SUPPLIES:
        asset.supplies = normalizedCount;
        patch.supplies = normalizedCount;
        break;
    }
    this.patchUserCounterOverrides(normalizedUserId, patch);
  }
  patchUserCounterDeltas(userId, delta, baseCounters = null) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId || !delta) {
      return;
    }
    const currentOverrides = this._counterOverridesByUserId()[normalizedUserId] ?? {};
    const normalizedPatch = {};
    const normalizedPatchRecord = normalizedPatch;
    const overrideRecord = currentOverrides;
    const baseRecord = baseCounters ?? {};
    const deltaRecord = delta;
    for (const key of ACTIVITY_COUNTER_KEYS) {
      const value = deltaRecord[key];
      if (!Number.isFinite(value)) {
        continue;
      }
      const baseValue = Number.isFinite(overrideRecord[key]) ? overrideRecord[key] : baseRecord[key];
      normalizedPatchRecord[key] = normalizeCounterValue(normalizeCounterValue(baseValue) + Number(value));
    }
    const event = this.applyNestedCounterDeltas(delta.event, currentOverrides.event, baseCounters?.event, ["all", "active", "pending", "invitations", "hosting", "drafts", "watchlist", "trash"]);
    if (event) {
      normalizedPatch.event = event;
    }
    const asset = this.applyNestedCounterDeltas(delta.asset, currentOverrides.asset, baseCounters?.asset, ["cars", "accommodation", "supplies", "tickets", "carsPending", "accommodationPending", "suppliesPending"]);
    if (asset) {
      normalizedPatch.asset = asset;
    }
    const eventFeedback = this.applyNestedCounterDeltas(delta.eventFeedback, currentOverrides.eventFeedback, baseCounters?.eventFeedback, ["ownEvents", "pending", "feedbacked", "removed"]);
    if (eventFeedback) {
      normalizedPatch.eventFeedback = eventFeedback;
    }
    if (Object.keys(normalizedPatch).length === 0) {
      return;
    }
    this.patchUserCounterOverrides(normalizedUserId, normalizedPatch);
  }
  applyNestedCounterDeltas(delta, current, base, keys) {
    if (!delta) {
      return null;
    }
    const deltaRecord = delta;
    const currentRecord = current ?? {};
    const baseRecord = base ?? {};
    const next = {};
    let changed = false;
    for (const key of keys) {
      const keyName = String(key);
      const baseValue = Number.isFinite(currentRecord[keyName]) ? currentRecord[keyName] : baseRecord[keyName];
      next[keyName] = normalizeCounterValue(baseValue);
      const value = deltaRecord[keyName];
      if (!Object.prototype.hasOwnProperty.call(deltaRecord, keyName) || !Number.isFinite(value)) {
        continue;
      }
      next[keyName] = normalizeCounterValue(next[keyName] + Number(value));
      changed = true;
    }
    return changed ? next : null;
  }
  clearUserCounterOverrides(userId, keys) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return;
    }
    const current = this._counterOverridesByUserId()[normalizedUserId];
    if (!current) {
      return;
    }
    const clearedKeys = !keys || keys.length === 0 ? Object.keys(current) : keys.filter((key) => Object.prototype.hasOwnProperty.call(current, key));
    if (clearedKeys.length === 0) {
      return;
    }
    this.bumpCounterRevision(normalizedUserId);
    this._counterOverridesByUserId.update((state) => {
      const current2 = state[normalizedUserId];
      if (!current2) {
        return state;
      }
      if (!keys || keys.length === 0) {
        const _a = state, { [normalizedUserId]: _removed } = _a, rest = __objRest(_a, [__restKey(normalizedUserId)]);
        return rest;
      }
      const next = __spreadValues({}, current2);
      for (const key of keys) {
        delete next[key];
      }
      if (Object.keys(next).length === 0) {
        const _b = state, { [normalizedUserId]: _removed } = _b, rest = __objRest(_b, [__restKey(normalizedUserId)]);
        return rest;
      }
      return __spreadProps(__spreadValues({}, state), {
        [normalizedUserId]: next
      });
    });
  }
  resolveUserCounter(userId, key, fallbackValue) {
    const override = this.getUserCounterOverride(userId, key);
    if (override !== null) {
      return override;
    }
    return normalizeCounterValue(fallbackValue);
  }
  emitActivityMembersSync(payload) {
    const normalizedId = payload.id.trim();
    if (!normalizedId) {
      return;
    }
    const updatedMs = Math.max(Date.now(), (this._activityMembersSync()?.updatedMs ?? 0) + 1);
    const acceptedMemberDelta = Number.isFinite(Number(payload.acceptedMemberDelta)) ? Math.trunc(Number(payload.acceptedMemberDelta)) : null;
    const pendingMemberDelta = Number.isFinite(Number(payload.pendingMemberDelta)) ? Math.trunc(Number(payload.pendingMemberDelta)) : null;
    const sync = __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadProps(__spreadValues(__spreadValues({
      updatedMs,
      id: normalizedId
    }, `${payload.eventId ?? ""}`.trim() ? { eventId: `${payload.eventId ?? ""}`.trim() } : {}), `${payload.subEventId ?? ""}`.trim() ? { subEventId: `${payload.subEventId ?? ""}`.trim() } : {}), {
      acceptedMembers: normalizeCounterValue(payload.acceptedMembers),
      pendingMembers: normalizeCounterValue(payload.pendingMembers),
      capacityTotal: Math.max(normalizeCounterValue(payload.acceptedMembers), normalizeCounterValue(payload.capacityTotal))
    }), acceptedMemberDelta !== null ? { acceptedMemberDelta } : {}), pendingMemberDelta !== null ? { pendingMemberDelta } : {}), payload.full === true ? { full: true } : {}), payload.checkoutResultState ? { checkoutResultState: payload.checkoutResultState } : {}), payload.viewerMembershipRemoved === true ? { viewerMembershipRemoved: true } : {}), payload.resourceAssignmentRemoved === true ? { resourceAssignmentRemoved: true } : {}), payload.currentUserMembershipStatus ? { currentUserMembershipStatus: payload.currentUserMembershipStatus } : {}), payload.memberStatusChange ? {
      memberStatusChange: __spreadProps(__spreadValues({}, payload.memberStatusChange), {
        acceptedMemberDelta: Math.trunc(Number(payload.memberStatusChange.acceptedMemberDelta) || 0),
        pendingMemberDelta: Math.trunc(Number(payload.memberStatusChange.pendingMemberDelta) || 0)
      })
    } : {});
    this._activityMembersSync.set(sync);
    this._activityMembersSyncByOwnerId.update((current) => __spreadProps(__spreadValues({}, current), {
      [normalizedId]: sync
    }));
  }
  cacheActivityMemberStatusChange(change, fallback) {
    const assetId = change.assetId.trim();
    const eventId = change.eventId.trim();
    const subEventId = change.subEventId.trim();
    const userId = change.userId.trim();
    if (!assetId || !eventId || !subEventId || !userId) {
      return null;
    }
    const previous = this._activityMembersSyncByOwnerId()[assetId];
    const previousChange = previous?.memberStatusChange;
    const sameScope = previousChange?.assetId === assetId && previousChange.eventId === eventId && previousChange.subEventId === subEventId && previousChange.userId === userId;
    const acceptedMemberDelta = Math.trunc(Number(change.acceptedMemberDelta) || 0);
    const pendingMemberDelta = Math.trunc(Number(change.pendingMemberDelta) || 0);
    const duplicateTransition = sameScope && `${previousChange.requestId ?? ""}`.trim() === `${change.requestId ?? ""}`.trim() && previousChange.previousStatus === change.previousStatus && previousChange.status === change.status && previousChange.acceptedMemberDelta === acceptedMemberDelta && previousChange.pendingMemberDelta === pendingMemberDelta;
    if (duplicateTransition) {
      return null;
    }
    const acceptedMembers = Math.max(0, (sameScope ? previous?.acceptedMembers ?? normalizeCounterValue(fallback.acceptedMembers) : normalizeCounterValue(fallback.acceptedMembers)) + acceptedMemberDelta);
    const pendingMembers = Math.max(0, (sameScope ? previous?.pendingMembers ?? normalizeCounterValue(fallback.pendingMembers) : normalizeCounterValue(fallback.pendingMembers)) + pendingMemberDelta);
    const sync = __spreadProps(__spreadValues({
      updatedMs: Math.max(Date.now(), (previous?.updatedMs ?? 0) + 1),
      id: assetId,
      eventId,
      subEventId,
      acceptedMembers,
      pendingMembers,
      capacityTotal: Math.max(acceptedMembers, sameScope ? previous?.capacityTotal ?? normalizeCounterValue(fallback.capacityTotal) : normalizeCounterValue(fallback.capacityTotal)),
      acceptedMemberDelta,
      pendingMemberDelta
    }, change.resourceAssignmentRemoved === true ? { resourceAssignmentRemoved: true } : {}), {
      memberStatusChange: __spreadProps(__spreadValues({}, change), {
        assetId,
        eventId,
        subEventId,
        userId,
        acceptedMemberDelta,
        pendingMemberDelta
      })
    });
    this._activityMembersSyncByOwnerId.update((current) => __spreadProps(__spreadValues({}, current), {
      [assetId]: sync
    }));
    return sync;
  }
  emitActivityResourceSync(payload) {
    const ownerId = payload.ownerId.trim();
    const subEventId = payload.subEventId.trim();
    const assetOwnerUserId = payload.assetOwnerUserId.trim();
    if (!ownerId || !subEventId || !assetOwnerUserId) {
      return;
    }
    const updatedMs = Math.max(Date.now(), (this._activityResourceSync()?.updatedMs ?? 0) + 1);
    this._activityResourceSync.set({
      updatedMs,
      ownerId,
      subEventId,
      assetOwnerUserId,
      resourceType: payload.resourceType,
      readAtIso: payload.readAtIso
    });
  }
  emitActivityResourceMemberDeltaSync(payload) {
    const ownerId = payload.ownerId.trim();
    const subEventId = payload.subEventId.trim();
    const assetId = payload.assetId.trim();
    const acceptedMemberDelta = Math.trunc(Number(payload.acceptedMemberDelta) || 0);
    const pendingMemberDelta = Math.trunc(Number(payload.pendingMemberDelta) || 0);
    const capacityMinDelta = Math.trunc(Number(payload.capacityMinDelta) || 0);
    const capacityMaxDelta = Math.trunc(Number(payload.capacityMaxDelta) || 0);
    const resourceAssignmentRemoved = payload.resourceAssignmentRemoved === true;
    if (!ownerId || !subEventId || !assetId || acceptedMemberDelta === 0 && pendingMemberDelta === 0 && capacityMinDelta === 0 && capacityMaxDelta === 0 && !resourceAssignmentRemoved) {
      return;
    }
    const updatedMs = Math.max(Date.now(), (untracked(() => this._activityResourceMemberDeltaSync())?.updatedMs ?? 0) + 1);
    this._activityResourceMemberDeltaSync.set(__spreadValues({
      updatedMs,
      ownerId,
      subEventId,
      assetId,
      resourceType: payload.resourceType,
      acceptedMemberDelta,
      pendingMemberDelta,
      capacityMinDelta,
      capacityMaxDelta
    }, resourceAssignmentRemoved ? { resourceAssignmentRemoved: true } : {}));
  }
  emitActivityEventRuntimeSync(payload) {
    const eventId = payload.eventId.trim();
    const subEventId = payload.subEventId.trim();
    if (!eventId || !subEventId) {
      return;
    }
    const updatedMs = Math.max(Date.now(), (untracked(() => this._activityEventRuntimeSync())?.updatedMs ?? 0) + 1);
    this._activityEventRuntimeSync.set({
      updatedMs,
      eventId,
      subEventId,
      activityDelta: Number.isFinite(Number(payload.activityDelta)) ? Math.trunc(Number(payload.activityDelta)) : 0,
      currentStage: payload.currentStage ? __spreadValues({}, payload.currentStage) : payload.currentStage,
      source: payload.source
    });
  }
  emitActivityChatMetricBucketPatch(payload) {
    const identity = payload.identity.trim();
    if (!identity) {
      return;
    }
    this._activityChatMetricBucketPatch.set({
      updatedMs: Date.now(),
      identity,
      bucketType: payload.bucketType,
      bucket: {
        accepted: normalizeCounterValue(payload.bucket.accepted),
        pending: normalizeCounterValue(payload.bucket.pending),
        capacityMin: normalizeCounterValue(payload.bucket.capacityMin),
        capacityMax: Math.max(normalizeCounterValue(payload.bucket.capacityMin), normalizeCounterValue(payload.bucket.capacityMax))
      }
    });
  }
  emitActivityEventFeedbackSubmit(dto) {
    const eventId = dto.eventId.trim();
    if (!eventId) {
      return;
    }
    this._activityEventFeedbackSubmitSync.set({
      updatedMs: Date.now(),
      dto: new EventFeedbackDetailDto(__spreadProps(__spreadValues({}, dto), {
        eventId
      }))
    });
  }
  static \u0275fac = function ActivityStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ActivityStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ActivityStore, factory: _ActivityStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ActivityStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/ui/converters/user-realtime-ui.converter.ts
var UserRealtimeUiConverter = class {
  static convert(input) {
    const counterPatch = this.toCounterPatch(input.snapshot);
    const impressions = input.suppressImpressionBadges ? this.toSeenImpressions(input.snapshot.impressions) : input.snapshot.impressions;
    return {
      counterPatch,
      impressions,
      changeFlags: input.suppressImpressionBadges ? null : this.toImpressionChangeFlags(input.snapshot, input.currentChangeFlags),
      clearChangeFlags: input.suppressImpressionBadges,
      paymentTotals: input.snapshot.paymentTotals ? {
        outgoing: __spreadValues({}, input.snapshot.paymentTotals.outgoing ?? {}),
        incoming: __spreadValues({}, input.snapshot.paymentTotals.incoming ?? {}),
        all: __spreadValues({}, input.snapshot.paymentTotals.all ?? {})
      } : null
    };
  }
  static toCounterPatch(snapshot) {
    const _a = snapshot.counters, { impressionsHostChanged: _hostChanged, impressionsMemberChanged: _memberChanged } = _a, counters = __objRest(_a, ["impressionsHostChanged", "impressionsMemberChanged"]);
    return __spreadValues({}, counters);
  }
  static toSeenImpressions(impressions) {
    return {
      host: impressions.host ? __spreadProps(__spreadValues({}, impressions.host), {
        unreadCount: 0
      }) : void 0,
      member: impressions.member ? __spreadProps(__spreadValues({}, impressions.member), {
        unreadCount: 0
      }) : void 0
    };
  }
  static toImpressionChangeFlags(snapshot, currentFlags) {
    return {
      host: currentFlags.host || snapshot.counters.impressionsHostChanged === true,
      member: currentFlags.member || snapshot.counters.impressionsMemberChanged === true
    };
  }
};

// src/app/shared/ui/context/stores/user-profile.store.ts
var DEFAULT_USER_IMPRESSION_CHANGE_FLAGS = {
  host: false,
  member: false
};
var UserProfileStore = class _UserProfileStore {
  activityStore = inject(ActivityStore);
  _userProfilesByUserId = signal({}, ...ngDevMode ? [{ debugName: "_userProfilesByUserId" }] : (
    /* istanbul ignore next */
    []
  ));
  _profileExtByUserId = signal({}, ...ngDevMode ? [{ debugName: "_profileExtByUserId" }] : (
    /* istanbul ignore next */
    []
  ));
  _filterCountByUserId = signal({}, ...ngDevMode ? [{ debugName: "_filterCountByUserId" }] : (
    /* istanbul ignore next */
    []
  ));
  _filterPreferencesByUserId = signal({}, ...ngDevMode ? [{ debugName: "_filterPreferencesByUserId" }] : (
    /* istanbul ignore next */
    []
  ));
  _impressionsByUserId = signal({}, ...ngDevMode ? [{ debugName: "_impressionsByUserId" }] : (
    /* istanbul ignore next */
    []
  ));
  _impressionChangeFlagsByUserId = signal({}, ...ngDevMode ? [{ debugName: "_impressionChangeFlagsByUserId" }] : (
    /* istanbul ignore next */
    []
  ));
  _activeUserId = signal("", ...ngDevMode ? [{ debugName: "_activeUserId" }] : (
    /* istanbul ignore next */
    []
  ));
  _profileSaved = signal(null, ...ngDevMode ? [{ debugName: "_profileSaved" }] : (
    /* istanbul ignore next */
    []
  ));
  realtimeCursorByUserId = {};
  realtimeSeenImpressionsCursorByUserId = {};
  realtimeIgnoreNextImpressionsSnapshotByUserId = {};
  profileSavedRevision = 0;
  realtimePollInFlight = false;
  userProfilesByUserId = this._userProfilesByUserId.asReadonly();
  profileExtByUserId = this._profileExtByUserId.asReadonly();
  filterCountByUserId = this._filterCountByUserId.asReadonly();
  filterPreferencesByUserId = this._filterPreferencesByUserId.asReadonly();
  impressionsByUserId = this._impressionsByUserId.asReadonly();
  impressionChangeFlagsByUserId = this._impressionChangeFlagsByUserId.asReadonly();
  activeUserId = this._activeUserId.asReadonly();
  profileSaved = this._profileSaved.asReadonly();
  activeUserProfile = computed(() => {
    const normalizedUserId = this._activeUserId().trim();
    if (!normalizedUserId) {
      return null;
    }
    const user = this._userProfilesByUserId()[normalizedUserId];
    return user ? cloneUserProfile(user) : null;
  }, ...ngDevMode ? [{ debugName: "activeUserProfile" }] : (
    /* istanbul ignore next */
    []
  ));
  activeNotificationDevices = computed(() => this.activeUserProfile()?.notificationDevices ?? [], ...ngDevMode ? [{ debugName: "activeNotificationDevices" }] : (
    /* istanbul ignore next */
    []
  ));
  applyUserRealtimeNotificationDevices(userId, devices) {
    if (!devices)
      return;
    const current = this._userProfilesByUserId()[userId];
    if (!current)
      return;
    if (JSON.stringify(current.notificationDevices) === JSON.stringify(devices))
      return;
    this._userProfilesByUserId.update((state) => __spreadProps(__spreadValues({}, state), { [userId]: __spreadProps(__spreadValues({}, current), {
      notificationDevices: devices.map((device) => __spreadValues({}, device))
    }) }));
  }
  activeUserProfileExt = computed(() => {
    const normalizedUserId = this._activeUserId().trim();
    if (!normalizedUserId) {
      return null;
    }
    return this._profileExtByUserId()[normalizedUserId] ?? null;
  }, ...ngDevMode ? [{ debugName: "activeUserProfileExt" }] : (
    /* istanbul ignore next */
    []
  ));
  activeUserIsAdmin = computed(() => this.isAdminUserProfile(this.activeUserProfile(), this._activeUserId()), ...ngDevMode ? [{ debugName: "activeUserIsAdmin" }] : (
    /* istanbul ignore next */
    []
  ));
  activeUserIsOperator = computed(() => hasOperatorRole(this.activeUserProfile()), ...ngDevMode ? [{ debugName: "activeUserIsOperator" }] : (
    /* istanbul ignore next */
    []
  ));
  activeAdminUser = computed(() => this.activeUserIsAdmin() ? adminUserFromProfile(this.activeUserProfile()) : null, ...ngDevMode ? [{ debugName: "activeAdminUser" }] : (
    /* istanbul ignore next */
    []
  ));
  getActiveUserId() {
    return this._activeUserId();
  }
  setActiveUserId(userId) {
    const normalizedUserId = userId.trim();
    this._activeUserId.set(normalizedUserId);
  }
  getUserProfile(userId) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return null;
    }
    const user = this._userProfilesByUserId()[normalizedUserId];
    return user ? cloneUserProfile(user) : null;
  }
  setUserProfile(user) {
    const normalizedUserId = user.id.trim();
    if (!normalizedUserId) {
      return;
    }
    this._userProfilesByUserId.update((state) => __spreadProps(__spreadValues({}, state), {
      [normalizedUserId]: cloneUserProfile(__spreadProps(__spreadValues({}, user), {
        id: normalizedUserId
      }))
    }));
  }
  setActiveUserProfile(user) {
    const normalizedUserId = user.id.trim();
    if (!normalizedUserId) {
      return;
    }
    const normalizedUser = cloneUserProfile(__spreadProps(__spreadValues({}, user), {
      id: normalizedUserId
    }));
    this._userProfilesByUserId.update((state) => __spreadProps(__spreadValues({}, state), {
      [normalizedUserId]: normalizedUser
    }));
    this._activeUserId.set(normalizedUserId);
    this._impressionsByUserId.update((state) => {
      if (normalizedUser.impressions) {
        return __spreadProps(__spreadValues({}, state), {
          [normalizedUserId]: cloneImpressions(normalizedUser.impressions)
        });
      }
      if (!Object.prototype.hasOwnProperty.call(state, normalizedUserId)) {
        return state;
      }
      const _a = state, { [normalizedUserId]: _removed } = _a, rest = __objRest(_a, [__restKey(normalizedUserId)]);
      return rest;
    });
  }
  getProfileExt(userId) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return null;
    }
    const profileExt = this._profileExtByUserId()[normalizedUserId];
    return profileExt ? cloneProfileExt(profileExt) : null;
  }
  setProfileExt(profileExt) {
    const normalizedUserId = profileExt.profile.id.trim();
    if (!normalizedUserId) {
      return;
    }
    const normalizedProfileExt = cloneProfileExt(__spreadProps(__spreadValues({}, profileExt), {
      profile: __spreadProps(__spreadValues({}, profileExt.profile), {
        id: normalizedUserId
      })
    }));
    this._profileExtByUserId.update((state) => __spreadProps(__spreadValues({}, state), {
      [normalizedUserId]: normalizedProfileExt
    }));
    this.setUserProfile(normalizedProfileExt.profile);
  }
  emitProfileSaved(profile, previousProfile = null) {
    const normalizedUserId = profile.id.trim();
    if (!normalizedUserId) {
      return;
    }
    this._profileSaved.set({
      revision: ++this.profileSavedRevision,
      userId: normalizedUserId,
      profile: cloneUserProfile(__spreadProps(__spreadValues({}, profile), {
        id: normalizedUserId
      })),
      previousProfile: previousProfile ? cloneUserProfile(previousProfile) : null
    });
  }
  patchActiveUserProfile(patch) {
    const current = this.activeUserProfile();
    if (!current) {
      return null;
    }
    const resolvedPatch = typeof patch === "function" ? patch(current) : patch;
    const nextUser = __spreadProps(__spreadValues(__spreadValues({}, current), resolvedPatch), {
      id: current.id
    });
    this.setUserProfile(nextUser);
    return this.getUserProfile(current.id);
  }
  patchUserActivityCounters(userId, patch) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return null;
    }
    const currentUser = this._userProfilesByUserId()[normalizedUserId] ?? null;
    if (!currentUser) {
      return null;
    }
    const nextUser = cloneUserProfile(__spreadProps(__spreadValues({}, currentUser), {
      activities: this.applyActivityCounterPatch(currentUser.activities, patch)
    }));
    this._userProfilesByUserId.update((state) => __spreadProps(__spreadValues({}, state), {
      [normalizedUserId]: nextUser
    }));
    this._profileExtByUserId.update((state) => {
      const currentExt = state[normalizedUserId];
      if (!currentExt) {
        return state;
      }
      return __spreadProps(__spreadValues({}, state), {
        [normalizedUserId]: __spreadProps(__spreadValues({}, currentExt), {
          profile: nextUser
        })
      });
    });
    return cloneUserProfile(nextUser);
  }
  patchUserNotificationPreferences(userId, muted) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return null;
    }
    const currentUser = this._userProfilesByUserId()[normalizedUserId] ?? null;
    if (!currentUser) {
      return null;
    }
    const nextUser = cloneUserProfile(__spreadProps(__spreadValues({}, currentUser), {
      notificationPreferences: __spreadProps(__spreadValues({}, currentUser.notificationPreferences), {
        muted: muted === true
      })
    }));
    this._userProfilesByUserId.update((state) => __spreadProps(__spreadValues({}, state), {
      [normalizedUserId]: nextUser
    }));
    this._profileExtByUserId.update((state) => {
      const currentExt = state[normalizedUserId];
      if (!currentExt) {
        return state;
      }
      return __spreadProps(__spreadValues({}, state), {
        [normalizedUserId]: __spreadProps(__spreadValues({}, currentExt), {
          profile: nextUser
        })
      });
    });
    return cloneUserProfile(nextUser);
  }
  getActiveAdminUser() {
    return this.activeAdminUser();
  }
  isAdminUserProfile(user, fallbackUserId = "") {
    const normalizedUserId = `${user?.id ?? fallbackUserId ?? ""}`.trim();
    return user?.admin === true || user?.hostTier === "Admin" || user?.statusText === "Admin workspace" || normalizedUserId === "admin" || normalizedUserId.startsWith("admin-");
  }
  clearUserProfile(userId) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return;
    }
    this._userProfilesByUserId.update((state) => {
      if (!Object.prototype.hasOwnProperty.call(state, normalizedUserId)) {
        return state;
      }
      const _a = state, { [normalizedUserId]: _removed } = _a, rest = __objRest(_a, [__restKey(normalizedUserId)]);
      return rest;
    });
  }
  getUserFilterCountOverride(userId) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return null;
    }
    const value = this._filterCountByUserId()[normalizedUserId];
    if (!Number.isFinite(value)) {
      return null;
    }
    return normalizeCounterValue(value);
  }
  setUserFilterCountOverride(userId, value) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return;
    }
    const normalizedValue = normalizeCounterValue(value);
    this._filterCountByUserId.update((state) => __spreadProps(__spreadValues({}, state), {
      [normalizedUserId]: normalizedValue
    }));
  }
  clearUserFilterCountOverride(userId) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return;
    }
    this._filterCountByUserId.update((state) => {
      if (!Object.prototype.hasOwnProperty.call(state, normalizedUserId)) {
        return state;
      }
      const _a = state, { [normalizedUserId]: _removed } = _a, rest = __objRest(_a, [__restKey(normalizedUserId)]);
      return rest;
    });
  }
  resolveUserFilterCount(userId, fallbackValue) {
    const override = this.getUserFilterCountOverride(userId);
    if (override !== null) {
      return override;
    }
    return normalizeCounterValue(fallbackValue);
  }
  getUserFilterPreferences(userId) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return null;
    }
    const preferences = this._filterPreferencesByUserId()[normalizedUserId];
    if (!preferences) {
      return null;
    }
    return __spreadValues({}, preferences);
  }
  resolveUserFilterPreferences(userId, fallback) {
    const normalizedFallback = normalizeFilterPreferences(fallback);
    const preferences = this.getUserFilterPreferences(userId);
    if (!preferences) {
      return __spreadValues({}, normalizedFallback);
    }
    return normalizeFilterPreferences(__spreadValues(__spreadValues({}, normalizedFallback), preferences));
  }
  setUserFilterPreferences(userId, preferences) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return;
    }
    this._filterPreferencesByUserId.update((state) => __spreadProps(__spreadValues({}, state), {
      [normalizedUserId]: normalizeFilterPreferences(preferences)
    }));
  }
  clearUserFilterPreferences(userId) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return;
    }
    this._filterPreferencesByUserId.update((state) => {
      if (!Object.prototype.hasOwnProperty.call(state, normalizedUserId)) {
        return state;
      }
      const _a = state, { [normalizedUserId]: _removed } = _a, rest = __objRest(_a, [__restKey(normalizedUserId)]);
      return rest;
    });
  }
  getUserImpressions(userId) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return null;
    }
    const impressions = this._impressionsByUserId()[normalizedUserId];
    if (!impressions) {
      return null;
    }
    return cloneImpressions(impressions);
  }
  setUserImpressions(userId, impressions) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return;
    }
    this._impressionsByUserId.update((state) => __spreadProps(__spreadValues({}, state), {
      [normalizedUserId]: cloneImpressions(impressions)
    }));
  }
  clearUserImpressions(userId) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return;
    }
    this._impressionsByUserId.update((state) => {
      if (!Object.prototype.hasOwnProperty.call(state, normalizedUserId)) {
        return state;
      }
      const _a = state, { [normalizedUserId]: _removed } = _a, rest = __objRest(_a, [__restKey(normalizedUserId)]);
      return rest;
    });
  }
  getUserImpressionChangeFlags(userId) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return __spreadValues({}, DEFAULT_USER_IMPRESSION_CHANGE_FLAGS);
    }
    const flags = this._impressionChangeFlagsByUserId()[normalizedUserId];
    if (!flags) {
      return __spreadValues({}, DEFAULT_USER_IMPRESSION_CHANGE_FLAGS);
    }
    return {
      host: flags.host === true,
      member: flags.member === true
    };
  }
  setUserImpressionChangeFlags(userId, flags) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return;
    }
    const normalizedFlags = {
      host: flags.host === true,
      member: flags.member === true
    };
    this._impressionChangeFlagsByUserId.update((state) => __spreadProps(__spreadValues({}, state), {
      [normalizedUserId]: normalizedFlags
    }));
  }
  clearUserImpressionChangeFlags(userId) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return;
    }
    this._impressionChangeFlagsByUserId.update((state) => {
      if (!Object.prototype.hasOwnProperty.call(state, normalizedUserId)) {
        return state;
      }
      const _a = state, { [normalizedUserId]: _removed } = _a, rest = __objRest(_a, [__restKey(normalizedUserId)]);
      return rest;
    });
  }
  getUserRealtimeCursor(userId) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return null;
    }
    return this.realtimeCursorByUserId[normalizedUserId] ?? null;
  }
  setUserRealtimePollInFlight(inFlight) {
    this.realtimePollInFlight = inFlight;
  }
  markUserRealtimeImpressionsClosed(userId) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return;
    }
    const cursor = this.realtimeCursorByUserId[normalizedUserId] ?? "";
    if (cursor) {
      this.realtimeSeenImpressionsCursorByUserId[normalizedUserId] = cursor;
    }
    if (this.realtimePollInFlight) {
      this.realtimeIgnoreNextImpressionsSnapshotByUserId[normalizedUserId] = true;
    }
  }
  applyUserRealtimeCounters(userId, snapshot, counterSyncToken) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId || counterSyncToken.userId !== normalizedUserId) {
      return false;
    }
    return this.activityStore.applyRealtimeCounterOverrides(counterSyncToken, UserRealtimeUiConverter.toCounterPatch(snapshot));
  }
  applyUserRealtimeSnapshot(userId, snapshot, counterSyncToken) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return;
    }
    const nextCursor = typeof snapshot.cursor === "string" ? snapshot.cursor.trim() : "";
    const shouldIgnoreNextImpressionsSnapshot = this.realtimeIgnoreNextImpressionsSnapshotByUserId[normalizedUserId] === true;
    const isSeenCursor = nextCursor.length > 0 && this.realtimeSeenImpressionsCursorByUserId[normalizedUserId] === nextCursor;
    const uiPatch = UserRealtimeUiConverter.convert({
      snapshot,
      currentChangeFlags: this.getUserImpressionChangeFlags(normalizedUserId),
      suppressImpressionBadges: shouldIgnoreNextImpressionsSnapshot || isSeenCursor
    });
    const countersApplied = counterSyncToken ? this.activityStore.applyRealtimeCounterOverrides(counterSyncToken, uiPatch.counterPatch) : (this.activityStore.patchUserCounterOverrides(normalizedUserId, uiPatch.counterPatch), true);
    this.applyUserRealtimePatch(normalizedUserId, __spreadProps(__spreadValues({}, uiPatch), {
      counterPatch: countersApplied ? uiPatch.counterPatch : {}
    }));
    if (nextCursor.length > 0) {
      this.realtimeCursorByUserId[normalizedUserId] = nextCursor;
      if (shouldIgnoreNextImpressionsSnapshot) {
        this.realtimeSeenImpressionsCursorByUserId[normalizedUserId] = nextCursor;
      }
    }
    delete this.realtimeIgnoreNextImpressionsSnapshotByUserId[normalizedUserId];
  }
  applyUserRealtimeProfileStatus(userId, profileStatus) {
    const normalizedUserId = userId.trim();
    const normalizedStatus = `${profileStatus ?? ""}`.trim();
    if (!normalizedUserId || !normalizedStatus) {
      return;
    }
    const currentUser = this._userProfilesByUserId()[normalizedUserId];
    if (!currentUser || currentUser.profileStatus === normalizedStatus) {
      return;
    }
    this._userProfilesByUserId.update((state) => __spreadProps(__spreadValues({}, state), {
      [normalizedUserId]: cloneUserProfile(__spreadProps(__spreadValues({}, currentUser), {
        profileStatus: normalizedStatus
      }))
    }));
  }
  applyUserRealtimePatch(userId, patch) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return null;
    }
    const impressions = cloneImpressions(patch.impressions);
    const currentUser = this._userProfilesByUserId()[normalizedUserId] ?? null;
    let nextUser = null;
    if (currentUser) {
      nextUser = cloneUserProfile(__spreadProps(__spreadValues({}, currentUser), {
        activities: this.applyActivityCounterPatch(currentUser.activities, patch.counterPatch),
        impressions,
        paymentTotals: patch.paymentTotals ?? currentUser.paymentTotals
      }));
      this._userProfilesByUserId.update((state) => __spreadProps(__spreadValues({}, state), {
        [normalizedUserId]: nextUser
      }));
    }
    this._impressionsByUserId.update((state) => {
      return __spreadProps(__spreadValues({}, state), {
        [normalizedUserId]: impressions
      });
    });
    this._impressionChangeFlagsByUserId.update((state) => {
      if (patch.clearChangeFlags) {
        if (!Object.prototype.hasOwnProperty.call(state, normalizedUserId)) {
          return state;
        }
        const _a = state, { [normalizedUserId]: _removed } = _a, rest = __objRest(_a, [__restKey(normalizedUserId)]);
        return rest;
      }
      if (!patch.changeFlags) {
        return state;
      }
      return __spreadProps(__spreadValues({}, state), {
        [normalizedUserId]: {
          host: patch.changeFlags.host === true,
          member: patch.changeFlags.member === true
        }
      });
    });
    return nextUser ? cloneUserProfile(nextUser) : null;
  }
  applyActivityCounterPatch(current, patch) {
    const next = __spreadValues({}, current);
    for (const key of ACTIVITY_COUNTER_KEYS) {
      if (!Object.prototype.hasOwnProperty.call(patch, key)) {
        continue;
      }
      const value = patch[key];
      if (!Number.isFinite(value)) {
        continue;
      }
      next[key] = normalizeCounterValue(value);
    }
    if (patch.event) {
      next.event = cloneEventCounters(patch.event);
    }
    if (patch.asset) {
      next.asset = cloneAssetCounters(patch.asset);
    }
    if (patch.eventFeedback) {
      next.eventFeedback = cloneEventFeedbackCounters(patch.eventFeedback);
    }
    return next;
  }
  static \u0275fac = function UserProfileStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UserProfileStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _UserProfileStore, factory: _UserProfileStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UserProfileStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/base/config.ts
var ROUTE_CONFIG = {
  defaultDemoDelayMs: 1500,
  defaultRequestTimeoutMs: 3e3,
  defaultIntervalMs: 0,
  entries: [
    {
      routePrefix: "/payment-methods",
      demoDelayMs: 1500,
      requestTimeoutMs: 3e3
    },
    {
      routePrefix: "/auth/demo-users",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/auth/me",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/auth/me/onboarding-draft-autosave",
      intervalMs: 3e4
    },
    {
      routePrefix: "/auth/me/feedback",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/auth/me/experiences",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/auth/me/preferences",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/auth/me/report-user",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/auth/me/realtime/long-poll",
      demoDelayMs: 0,
      intervalMs: 3e4,
      demoIntervalMs: 1e4
    },
    {
      routePrefix: "/local/users/realtime/long-poll",
      demoDelayMs: 0,
      intervalMs: 3e4,
      demoIntervalMs: 1e4
    },
    {
      routePrefix: "/auth/me/logout",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/auth/me/delete",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/help",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/help/active",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/privacy",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/privacy/active",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/privacy/consents",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/terms",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/terms/active",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/explanation",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/explanation/active",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/landing/content",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/landing/articles",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/help",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/help/revisions",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/privacy",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/privacy/revisions",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/explanation",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/explanation/revisions",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/ideas",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/reports",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/reports/blocked-users",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/reports/warn",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/reports/block",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/reports/unblock",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/feedback",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/notifications",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/notifications/save",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/notifications/run",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/params",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/params/save",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/params/history",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/params/revert",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/stats",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/affinity-graph",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/admin/monitoring",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/operator/registry",
      demoDelayMs: 1500,
      requestTimeoutMs: 3e4
    },
    {
      routePrefix: "/operator",
      demoDelayMs: 1500,
      requestTimeoutMs: 3e4
    },
    {
      routePrefix: "/game-cards/query",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/activities/chats",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/activities/events",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/activities/events/explore",
      demoDelayMs: 1500,
      intervalMs: 3e4,
      demoIntervalMs: 1e4
    },
    {
      routePrefix: "/activities/events/checkout/authorize",
      demoDelayMs: 1500,
      requestTimeoutMs: 12e4
    },
    {
      routePrefix: "/activities/events/checkout/pay",
      demoDelayMs: 1500,
      requestTimeoutMs: 12e4
    },
    {
      routePrefix: "/activities/events/checkout",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/activities/events/feedback",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/activities/events/subevent-resources",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/activities/events/members",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/activities/events/invite-candidates",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/activities/rates",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/notifications",
      demoDelayMs: 1500,
      intervalMs: 3e4,
      demoIntervalMs: 1e4
    },
    {
      routePrefix: "/assets",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/assets/availability",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/assets/tickets",
      demoDelayMs: 1500
    },
    {
      routePrefix: "/media/images/import",
      demoDelayMs: 1500,
      requestTimeoutMs: 15e3
    },
    {
      routePrefix: "/media/images",
      demoDelayMs: 1500,
      requestTimeoutMs: 15e3
    },
    {
      routePrefix: "/media/audio",
      demoDelayMs: 1500,
      requestTimeoutMs: 2e4
    },
    {
      routePrefix: "/navigator/contacts",
      demoDelayMs: 1500
    }
  ]
};
function resolveRouteConfigEntry(url) {
  const normalizedUrl = normalizeRouteUrl(url);
  let bestMatchLength = -1;
  let selectedEntry = null;
  for (const entry of ROUTE_CONFIG.entries) {
    const normalizedPrefix = normalizeRouteUrl(entry.routePrefix);
    if (!isRoutePrefixMatch(normalizedUrl, normalizedPrefix)) {
      continue;
    }
    if (normalizedPrefix.length <= bestMatchLength) {
      continue;
    }
    bestMatchLength = normalizedPrefix.length;
    selectedEntry = entry;
  }
  return selectedEntry;
}
function resolveRouteConfig(url) {
  const normalizedUrl = normalizeRouteUrl(url);
  const entry = resolveRouteConfigEntry(normalizedUrl);
  const configuredMode = normalizeRouteMode(entry?.mode ?? null);
  return {
    routePrefix: entry?.routePrefix ?? normalizedUrl,
    demoDelayMs: normalizeDelayMs(entry?.demoDelayMs ?? ROUTE_CONFIG.defaultDemoDelayMs),
    requestTimeoutMs: normalizeDelayMs(entry?.requestTimeoutMs ?? ROUTE_CONFIG.defaultRequestTimeoutMs),
    intervalMs: normalizeDelayMs(entry?.intervalMs ?? ROUTE_CONFIG.defaultIntervalMs),
    demoIntervalMs: normalizeDelayMs(entry?.demoIntervalMs ?? ROUTE_CONFIG.defaultIntervalMs),
    mode: configuredMode,
    http: entry?.http === true || configuredMode === "http"
  };
}
function normalizeRouteUrl(url) {
  const [pathOnly] = url.split("?");
  const [withoutHash] = (pathOnly || "").split("#");
  const trimmed = withoutHash.trim();
  if (!trimmed || trimmed === "/") {
    return "/";
  }
  return trimmed.startsWith("/") ? trimmed.replace(/\/+$/, "") : `/${trimmed}`.replace(/\/+$/, "");
}
function isRoutePrefixMatch(url, prefix) {
  if (prefix === "/") {
    return true;
  }
  return url === prefix || url.startsWith(`${prefix}/`);
}
function normalizeDelayMs(value) {
  return Math.max(0, Math.trunc(value));
}
function normalizeRouteMode(value) {
  return value === "local" || value === "http" ? value : null;
}

// src/app/shared/core/base/services/route-delay.service.ts
function resolveCurrentRouteRequestTimeoutMs(route, fallbackTimeoutMs = 3e3) {
  const routeConfig = resolveRouteConfig(route);
  if (routeConfig.requestTimeoutMs > 0) {
    return routeConfig.requestTimeoutMs;
  }
  return normalizeDelayMs2(fallbackTimeoutMs);
}
var RouteDelayService = class _RouteDelayService {
  resolveDelayMs(route, fallbackDelayMs = 0) {
    const routeConfig = resolveRouteConfig(route);
    if (routeConfig.http || environment.activitiesDataSource === "http") {
      return 0;
    }
    return routeConfig.demoDelayMs > 0 ? routeConfig.demoDelayMs : normalizeDelayMs2(fallbackDelayMs);
  }
  resolveRequestTimeoutMs(route, fallbackTimeoutMs = 3e3) {
    return resolveCurrentRouteRequestTimeoutMs(route, fallbackTimeoutMs);
  }
  resolveIntervalMs(route, fallbackIntervalMs = 0) {
    const routeConfig = resolveRouteConfig(route);
    const demoRouteMode = environment.activitiesDataSource !== "http" && !routeConfig.http;
    const configuredIntervalMs = demoRouteMode && routeConfig.demoIntervalMs > 0 ? routeConfig.demoIntervalMs : routeConfig.intervalMs;
    if (configuredIntervalMs > 0) {
      return configuredIntervalMs;
    }
    return normalizeDelayMs2(fallbackIntervalMs);
  }
  withRequestTimeout(route, task, timeoutMessage = "Request timed out.", fallbackTimeoutMs = 3e3) {
    return new Promise((resolve, reject) => {
      let finished = false;
      let timeoutId = null;
      const finish = (callback) => {
        if (finished) {
          return;
        }
        finished = true;
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        callback();
      };
      timeoutId = setTimeout(() => finish(() => reject(new Error(timeoutMessage))), this.resolveRequestTimeoutMs(route, fallbackTimeoutMs));
      task.then((value) => finish(() => resolve(value))).catch((error) => finish(() => reject(error)));
    });
  }
  async waitForRouteDelay(route, signal2, abortMessage = "Request aborted.", fallbackDelayMs = 0) {
    const delayMs = this.resolveDelayMs(route, fallbackDelayMs);
    if (delayMs <= 0) {
      return;
    }
    await this.waitForDelay(delayMs, signal2, abortMessage);
  }
  waitForDelay(delayMs, signal2, abortMessage = "Request aborted.") {
    const normalizedDelayMs = this.normalizeDelayMs(delayMs);
    if (normalizedDelayMs <= 0) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      if (signal2?.aborted) {
        reject(this.createAbortError(abortMessage));
        return;
      }
      const timer = setTimeout(() => {
        cleanup();
        resolve();
      }, normalizedDelayMs);
      const onAbort = () => {
        cleanup();
        reject(this.createAbortError(abortMessage));
      };
      const cleanup = () => {
        clearTimeout(timer);
        signal2?.removeEventListener("abort", onAbort);
      };
      signal2?.addEventListener("abort", onAbort, { once: true });
    });
  }
  createAbortError(message = "Request aborted.") {
    const error = new Error(message);
    error.name = "AbortError";
    return error;
  }
  normalizeDelayMs(value) {
    return normalizeDelayMs2(value);
  }
  static \u0275fac = function RouteDelayService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RouteDelayService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _RouteDelayService, factory: _RouteDelayService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RouteDelayService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
function normalizeDelayMs2(value) {
  return Math.max(0, Math.trunc(Number(value) || 0));
}

export {
  ROUTE_CONFIG,
  resolveRouteConfig,
  hasOperatorRole,
  cloneSupportCaseCounters,
  cloneEventCounters,
  cloneHelpCenterState,
  cloneHelpCenterRevision,
  ActivityStore,
  UserProfileStore,
  RouteDelayService
};
//# sourceMappingURL=chunk-52XNNRXY.js.map
