import {
  ActivityStore,
  UserProfileStore,
  cloneSupportCaseCounters
} from "./chunk-IEWB22H3.js";
import {
  Injectable,
  __spreadProps,
  __spreadValues,
  computed,
  inject,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-EV3I3YNV.js";

// src/app/shared/ui/context/stores/activities-popup.store.ts
function eventChatPopupRequestFromChat(chat) {
  return {
    chatId: chat.id,
    ownerId: chat.ownerId ?? null,
    channelType: chat.channelType ?? null
  };
}
function eventChatHeaderStateFromChat(chat) {
  return __spreadProps(__spreadValues({}, eventChatPopupRequestFromChat(chat)), {
    avatar: chat.avatar,
    title: chat.title,
    memberIds: [...chat.memberIds ?? []],
    members: (chat.members ?? []).map((member) => __spreadValues({}, member)),
    unread: chat.unread,
    dateIso: chat.dateIso ?? null,
    contextStartAtIso: chat.contextStartAtIso ?? null,
    contextEndAtIso: chat.contextEndAtIso ?? null,
    lastMessage: chat.lastMessage,
    lastSenderId: chat.lastSenderId,
    ownerUserId: chat.ownerUserId ?? null,
    serviceContext: chat.serviceContext ?? null,
    assetId: chat.assetId ?? null,
    eventId: chat.eventId ?? null,
    subEventId: chat.subEventId ?? null,
    groupId: chat.groupId ?? null,
    ownerStatus: chat.ownerStatus ?? null,
    revision: Math.max(1, Math.trunc(Number(chat.revision) || 1)),
    supportCase: chat.supportCase ? __spreadProps(__spreadValues({}, chat.supportCase), {
      assignee: chat.supportCase.assignee ? __spreadValues({}, chat.supportCase.assignee) : chat.supportCase.assignee
    }) : chat.supportCase,
    metrics: chat.metrics ? {
      members: chat.metrics.members ? __spreadValues({}, chat.metrics.members) : null,
      transport: chat.metrics.transport ? __spreadValues({}, chat.metrics.transport) : null,
      accommodation: chat.metrics.accommodation ? __spreadValues({}, chat.metrics.accommodation) : null,
      supplies: chat.metrics.supplies ? __spreadValues({}, chat.metrics.supplies) : null,
      groupsCount: chat.metrics.groupsCount ?? null,
      pendingTotal: Math.max(0, Math.trunc(Number(chat.metrics.pendingTotal) || 0))
    } : chat.metrics,
    navigationContext: chat.navigationContext ? __spreadProps(__spreadValues({}, chat.navigationContext), {
      subEvent: chat.navigationContext.subEvent ? __spreadValues({}, chat.navigationContext.subEvent) : chat.navigationContext.subEvent,
      group: chat.navigationContext.group ? __spreadValues({}, chat.navigationContext.group) : chat.navigationContext.group
    }) : chat.navigationContext
  });
}
var DEFAULT_ACTIVITIES_UI_STATE = {
  open: false,
  openRevision: 0,
  primaryFilter: "chats",
  eventScope: "all",
  secondaryFilter: "recent",
  chatContextFilter: "all",
  supportCaseFilter: "all",
  hostingPublicationFilter: "all",
  rateFilter: "individual-given",
  rateSocialBadgeEnabled: false,
  rateIndividualSocialBadgeEnabled: false,
  ratePairSocialBadgeEnabled: false,
  view: "day",
  showViewPicker: false,
  showSecondaryPicker: false,
  stickyValue: "",
  ratesFullscreenMode: false,
  selectedRateId: null,
  adminServiceOnly: false
};
var ActivitiesPopupStore = class _ActivitiesPopupStore {
  activityStore = inject(ActivityStore);
  userProfileStore = inject(UserProfileStore);
  _uiState = signal(DEFAULT_ACTIVITIES_UI_STATE, ...ngDevMode ? [{ debugName: "_uiState" }] : (
    /* istanbul ignore next */
    []
  ));
  _activityEventSync = signal(null, ...ngDevMode ? [{ debugName: "_activityEventSync" }] : (
    /* istanbul ignore next */
    []
  ));
  _eventChatSession = signal(null, ...ngDevMode ? [{ debugName: "_eventChatSession" }] : (
    /* istanbul ignore next */
    []
  ));
  _eventChatHeader = signal(null, ...ngDevMode ? [{ debugName: "_eventChatHeader" }] : (
    /* istanbul ignore next */
    []
  ));
  _stackedEventChatSession = signal(null, ...ngDevMode ? [{ debugName: "_stackedEventChatSession" }] : (
    /* istanbul ignore next */
    []
  ));
  _stackedEventChatHeader = signal(null, ...ngDevMode ? [{ debugName: "_stackedEventChatHeader" }] : (
    /* istanbul ignore next */
    []
  ));
  _eventChatRowPatch = signal(null, ...ngDevMode ? [{ debugName: "_eventChatRowPatch" }] : (
    /* istanbul ignore next */
    []
  ));
  _eventFeedbackRatedDetailSession = signal(null, ...ngDevMode ? [{ debugName: "_eventFeedbackRatedDetailSession" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "activitiesPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventChatPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "eventChatPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventExplorePopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "eventExplorePopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventMembersPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "eventMembersPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventFeedbackPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "eventFeedbackPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventFeedbackRatedDetailPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "eventFeedbackRatedDetailPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesUiState = this._uiState.asReadonly();
  activitiesOpen = computed(() => this._uiState().open, ...ngDevMode ? [{ debugName: "activitiesOpen" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesOpenRevision = computed(() => this._uiState().openRevision, ...ngDevMode ? [{ debugName: "activitiesOpenRevision" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesPrimaryFilter = computed(() => this._uiState().primaryFilter, ...ngDevMode ? [{ debugName: "activitiesPrimaryFilter" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesEventScope = computed(() => this._uiState().eventScope, ...ngDevMode ? [{ debugName: "activitiesEventScope" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesSecondaryFilter = computed(() => this._uiState().secondaryFilter, ...ngDevMode ? [{ debugName: "activitiesSecondaryFilter" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesChatContextFilter = computed(() => this._uiState().chatContextFilter, ...ngDevMode ? [{ debugName: "activitiesChatContextFilter" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesSupportCaseFilter = computed(() => this._uiState().supportCaseFilter, ...ngDevMode ? [{ debugName: "activitiesSupportCaseFilter" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesHostingPublicationFilter = computed(() => this._uiState().hostingPublicationFilter, ...ngDevMode ? [{ debugName: "activitiesHostingPublicationFilter" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesRateFilter = computed(() => this._uiState().rateFilter, ...ngDevMode ? [{ debugName: "activitiesRateFilter" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesRateSocialBadgeEnabled = computed(() => this.resolveRateSocialBadgeEnabled(this._uiState()), ...ngDevMode ? [{ debugName: "activitiesRateSocialBadgeEnabled" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesIndividualRateSocialBadgeEnabled = computed(() => this._uiState().rateIndividualSocialBadgeEnabled, ...ngDevMode ? [{ debugName: "activitiesIndividualRateSocialBadgeEnabled" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesPairRateSocialBadgeEnabled = computed(() => this._uiState().ratePairSocialBadgeEnabled, ...ngDevMode ? [{ debugName: "activitiesPairRateSocialBadgeEnabled" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesView = computed(() => this._uiState().view, ...ngDevMode ? [{ debugName: "activitiesView" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesShowViewPicker = computed(() => this._uiState().showViewPicker, ...ngDevMode ? [{ debugName: "activitiesShowViewPicker" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesShowSecondaryPicker = computed(() => this._uiState().showSecondaryPicker, ...ngDevMode ? [{ debugName: "activitiesShowSecondaryPicker" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesStickyValue = computed(() => this._uiState().stickyValue, ...ngDevMode ? [{ debugName: "activitiesStickyValue" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesRatesFullscreenMode = computed(() => this._uiState().ratesFullscreenMode, ...ngDevMode ? [{ debugName: "activitiesRatesFullscreenMode" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesSelectedRateId = computed(() => this._uiState().selectedRateId, ...ngDevMode ? [{ debugName: "activitiesSelectedRateId" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesAdminServiceOnly = computed(() => this._uiState().adminServiceOnly, ...ngDevMode ? [{ debugName: "activitiesAdminServiceOnly" }] : (
    /* istanbul ignore next */
    []
  ));
  activityEventSync = this._activityEventSync.asReadonly();
  activityEventSave = computed(() => {
    const message = this._activityEventSync();
    return message?.kind === "upsert" ? message.event : null;
  }, ...ngDevMode ? [{ debugName: "activityEventSave" }] : (
    /* istanbul ignore next */
    []
  ));
  eventChatSession = this._eventChatSession.asReadonly();
  eventChatHeader = this._eventChatHeader.asReadonly();
  stackedEventChatSession = this._stackedEventChatSession.asReadonly();
  stackedEventChatHeader = this._stackedEventChatHeader.asReadonly();
  eventChatRowPatch = this._eventChatRowPatch.asReadonly();
  eventFeedbackRatedDetailSession = this._eventFeedbackRatedDetailSession.asReadonly();
  activitiesPopupComponent = this.activitiesPopupComponentRef.asReadonly();
  eventChatPopupComponent = this.eventChatPopupComponentRef.asReadonly();
  eventExplorePopupComponent = this.eventExplorePopupComponentRef.asReadonly();
  eventMembersPopupComponent = this.eventMembersPopupComponentRef.asReadonly();
  eventFeedbackPopupComponent = this.eventFeedbackPopupComponentRef.asReadonly();
  eventFeedbackRatedDetailPopupComponent = this.eventFeedbackRatedDetailPopupComponentRef.asReadonly();
  activitiesOpenBoolean = computed(() => this._uiState().open, ...ngDevMode ? [{ debugName: "activitiesOpenBoolean" }] : (
    /* istanbul ignore next */
    []
  ));
  eventChatOpen = computed(() => this._eventChatSession() !== null, ...ngDevMode ? [{ debugName: "eventChatOpen" }] : (
    /* istanbul ignore next */
    []
  ));
  stackedEventChatOpen = computed(() => this._stackedEventChatSession() !== null, ...ngDevMode ? [{ debugName: "stackedEventChatOpen" }] : (
    /* istanbul ignore next */
    []
  ));
  eventChatRowPatchRevision = 0;
  openActivities(primaryFilter = "chats", eventScope, initialRateFilter, initialRateSocialBadgeEnabled = false, options = {}) {
    const adminServiceOnly = options.adminServiceOnly === true;
    const normalizedPrimaryFilter = adminServiceOnly ? "chats" : this.normalizeActivitiesPrimaryFilter(primaryFilter);
    const resolvedScope = this.resolveActivitiesEventScope(primaryFilter, eventScope);
    const resolvedRateFilter = initialRateFilter ?? "individual-given";
    this._uiState.update((state) => __spreadValues(__spreadProps(__spreadValues({}, state), {
      open: true,
      openRevision: state.openRevision + 1,
      primaryFilter: normalizedPrimaryFilter,
      eventScope: resolvedScope,
      secondaryFilter: "recent",
      hostingPublicationFilter: resolvedScope === "drafts" ? "drafts" : "all",
      chatContextFilter: adminServiceOnly ? "service" : "all",
      supportCaseFilter: "all",
      showViewPicker: false,
      showSecondaryPicker: false,
      view: normalizedPrimaryFilter === "rates" ? "distance" : "day",
      stickyValue: "",
      ratesFullscreenMode: false,
      selectedRateId: null,
      adminServiceOnly
    }), normalizedPrimaryFilter === "rates" ? {
      rateFilter: resolvedRateFilter,
      rateSocialBadgeEnabled: initialRateSocialBadgeEnabled,
      rateIndividualSocialBadgeEnabled: resolvedRateFilter.startsWith("individual") ? initialRateSocialBadgeEnabled : false,
      ratePairSocialBadgeEnabled: resolvedRateFilter.startsWith("pair") ? initialRateSocialBadgeEnabled : false
    } : {
      rateSocialBadgeEnabled: false,
      rateIndividualSocialBadgeEnabled: false,
      ratePairSocialBadgeEnabled: false
    }));
  }
  closeActivities() {
    this.patchUiState({ open: false, adminServiceOnly: false, supportCaseFilter: "all" });
    this._eventChatSession.set(null);
    this._eventChatHeader.set(null);
    this._stackedEventChatSession.set(null);
    this._stackedEventChatHeader.set(null);
  }
  get isActivitiesOpen() {
    return this._uiState().open;
  }
  setActivitiesPrimaryFilter(filter) {
    if (this._uiState().adminServiceOnly) {
      this.patchUiState({
        primaryFilter: "chats",
        chatContextFilter: "service",
        supportCaseFilter: "all",
        showViewPicker: false,
        showSecondaryPicker: false
      });
      return;
    }
    const normalizedFilter = this.normalizeActivitiesPrimaryFilter(filter);
    this._uiState.update((state) => __spreadProps(__spreadValues({}, state), {
      primaryFilter: normalizedFilter,
      eventScope: normalizedFilter === "events" ? "all" : state.eventScope,
      hostingPublicationFilter: "all",
      showViewPicker: false,
      showSecondaryPicker: false,
      chatContextFilter: "all",
      supportCaseFilter: "all",
      ratesFullscreenMode: normalizedFilter !== "rates" ? false : state.ratesFullscreenMode,
      rateFilter: normalizedFilter === "rates" ? "individual-given" : state.rateFilter,
      rateSocialBadgeEnabled: normalizedFilter === "rates" ? this.resolveRateSocialBadgeEnabled(state) : false,
      rateIndividualSocialBadgeEnabled: normalizedFilter === "rates" ? state.rateIndividualSocialBadgeEnabled : false,
      ratePairSocialBadgeEnabled: normalizedFilter === "rates" ? state.ratePairSocialBadgeEnabled : false,
      view: normalizedFilter === "rates" ? "distance" : normalizedFilter === "chats" ? "day" : state.view,
      selectedRateId: null
    }));
  }
  setActivitiesEventScope(scope) {
    this.patchUiState({
      eventScope: scope,
      hostingPublicationFilter: scope === "drafts" ? "drafts" : "all"
    });
  }
  setActivitiesSecondaryFilter(filter) {
    this.patchUiState({
      secondaryFilter: filter,
      showSecondaryPicker: false
    });
  }
  setActivitiesChatContextFilter(filter) {
    this.patchUiState({ chatContextFilter: this._uiState().adminServiceOnly ? "service" : filter });
  }
  setActivitiesSupportCaseFilter(filter) {
    const normalized = filter === "pending" || filter === "warned" || filter === "picked" || filter === "solved" || filter === "blocked" ? filter : "all";
    this.patchUiState({
      supportCaseFilter: normalized,
      chatContextFilter: this._uiState().adminServiceOnly ? "service" : this._uiState().chatContextFilter
    });
  }
  setActivitiesHostingPublicationFilter(filter) {
    this.patchUiState({ hostingPublicationFilter: filter });
  }
  setActivitiesRateFilter(filter) {
    this._uiState.update((state) => {
      const nextState = __spreadProps(__spreadValues({}, state), {
        rateFilter: filter
      });
      return __spreadProps(__spreadValues({}, nextState), {
        rateSocialBadgeEnabled: this.resolveRateSocialBadgeEnabled(nextState)
      });
    });
  }
  setActivitiesRateSocialBadgeEnabled(enabled) {
    this._uiState.update((state) => __spreadValues(__spreadProps(__spreadValues({}, state), {
      rateSocialBadgeEnabled: enabled
    }), state.rateFilter.startsWith("pair") ? { ratePairSocialBadgeEnabled: enabled } : { rateIndividualSocialBadgeEnabled: enabled }));
  }
  setActivitiesRateSocialBadgeEnabledForGroup(group, enabled) {
    this._uiState.update((state) => {
      const nextState = __spreadValues(__spreadValues({}, state), group === "pair" ? { ratePairSocialBadgeEnabled: enabled } : { rateIndividualSocialBadgeEnabled: enabled });
      return __spreadProps(__spreadValues({}, nextState), {
        rateSocialBadgeEnabled: this.resolveRateSocialBadgeEnabled(nextState)
      });
    });
  }
  setActivitiesView(view) {
    this.patchUiState(__spreadValues({
      view,
      showViewPicker: false
    }, view !== "distance" ? { stickyValue: "" } : {}));
  }
  toggleActivitiesViewPicker() {
    this._uiState.update((state) => __spreadProps(__spreadValues({}, state), {
      showViewPicker: !state.showViewPicker,
      showSecondaryPicker: false
    }));
  }
  toggleActivitiesSecondaryPicker() {
    this._uiState.update((state) => __spreadProps(__spreadValues({}, state), {
      showSecondaryPicker: !state.showSecondaryPicker,
      showViewPicker: false
    }));
  }
  setActivitiesStickyValue(value) {
    this.patchUiState({ stickyValue: value });
  }
  setActivitiesRatesFullscreenMode(enabled) {
    this.patchUiState(__spreadValues({
      ratesFullscreenMode: enabled
    }, enabled ? {} : { selectedRateId: null }));
  }
  setActivitiesSelectedRateId(rateId) {
    this.patchUiState({ selectedRateId: rateId });
  }
  emitActivityEventSync(sync) {
    this._activityEventSync.set({
      kind: "upsert",
      event: sync
    });
  }
  emitActivityEventRemoval(sourceId) {
    const normalizedSourceId = sourceId.trim();
    if (!normalizedSourceId) {
      return;
    }
    this._activityEventSync.set({
      kind: "remove",
      sourceId: normalizedSourceId
    });
  }
  emitActivityEventSaveResult(sync) {
    this.emitActivityEventSync(sync);
  }
  clearActivityEventSync() {
    this._activityEventSync.set(null);
  }
  clearActivityEventSave() {
    this.clearActivityEventSync();
  }
  openEventChat(request, header) {
    const normalizedRequest = this.normalizeEventChatRequest(request);
    if (!normalizedRequest) {
      return;
    }
    this._eventChatSession.set({
      request: normalizedRequest,
      openedAtIso: (/* @__PURE__ */ new Date()).toISOString()
    });
    this._eventChatHeader.set(this.cloneEventChatHeader(__spreadValues(__spreadValues({}, header), normalizedRequest)));
    this._stackedEventChatSession.set(null);
    this._stackedEventChatHeader.set(null);
  }
  closeEventChat() {
    this._eventChatSession.set(null);
    this._eventChatHeader.set(null);
    this._stackedEventChatSession.set(null);
    this._stackedEventChatHeader.set(null);
  }
  patchEventChatHeader(headerUpdater) {
    const header = this._eventChatHeader();
    if (!header) {
      return;
    }
    this._eventChatHeader.set(this.cloneEventChatHeader(headerUpdater(this.cloneEventChatHeader(header))));
  }
  openStackedEventChat(request, header) {
    const normalizedRequest = this.normalizeEventChatRequest(request);
    if (!normalizedRequest) {
      return;
    }
    this._stackedEventChatSession.set({
      request: normalizedRequest,
      openedAtIso: (/* @__PURE__ */ new Date()).toISOString()
    });
    this._stackedEventChatHeader.set(this.cloneEventChatHeader(__spreadValues(__spreadValues({}, header), normalizedRequest)));
  }
  closeStackedEventChat() {
    this._stackedEventChatSession.set(null);
    this._stackedEventChatHeader.set(null);
  }
  openEventFeedbackRatedDetail(request) {
    const userId = request.userId.trim();
    const eventId = request.eventId.trim();
    if (!userId || !eventId) {
      return;
    }
    this._eventFeedbackRatedDetailSession.set({
      userId,
      eventId,
      eventTitle: request.eventTitle.trim() || "Event",
      openedAtIso: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  closeEventFeedbackRatedDetail() {
    this._eventFeedbackRatedDetailSession.set(null);
  }
  patchStackedEventChatHeader(headerUpdater) {
    const header = this._stackedEventChatHeader();
    if (!header) {
      return;
    }
    this._stackedEventChatHeader.set(this.cloneEventChatHeader(headerUpdater(this.cloneEventChatHeader(header))));
  }
  emitEventChatRowPatch(patch) {
    const chatId = `${patch.chatId ?? ""}`.trim();
    const ownerId = `${patch.ownerId ?? ""}`.trim();
    const channelType = patch.channelType ?? null;
    if (!chatId && !ownerId) {
      return;
    }
    this.patchActiveChatCounterFromRowPatch(patch);
    this._eventChatRowPatch.set(__spreadProps(__spreadValues({}, patch), {
      chatId,
      ownerId: ownerId || null,
      channelType,
      revision: ++this.eventChatRowPatchRevision
    }));
  }
  patchActiveChatCounterFromRowPatch(patch) {
    if (patch.unreadDelta === void 0 || patch.unreadDelta === null) {
      return;
    }
    const unreadDelta = Number(patch.unreadDelta);
    if (!Number.isFinite(unreadDelta) || unreadDelta === 0) {
      return;
    }
    const activeUser = this.userProfileStore.activeUserProfile();
    const activeUserId = `${activeUser?.id ?? ""}`.trim();
    if (!activeUserId) {
      return;
    }
    const overrides = this.activityStore.getUserCounterOverrides(activeUserId);
    const currentChatCounter = this.normalizeEventChatCounter(overrides.chats ?? activeUser?.activities?.chats);
    const nextChatCounter = this.normalizeEventChatCounter(currentChatCounter + unreadDelta);
    const currentContexts = overrides.chat ?? activeUser?.activities?.chat ?? {};
    const contextKey = this.chatContextCounterKey(patch.channelType);
    const nextContexts = {
      all: this.normalizeEventChatCounter((currentContexts.all ?? currentChatCounter) + unreadDelta),
      event: this.normalizeEventChatCounter((currentContexts.event ?? 0) + (contextKey === "event" ? unreadDelta : 0)),
      subEvent: this.normalizeEventChatCounter((currentContexts.subEvent ?? 0) + (contextKey === "subEvent" ? unreadDelta : 0)),
      group: this.normalizeEventChatCounter((currentContexts.group ?? 0) + (contextKey === "group" ? unreadDelta : 0)),
      service: this.normalizeEventChatCounter((currentContexts.service ?? 0) + (contextKey === "service" ? unreadDelta : 0)),
      appSupport: this.normalizeEventChatCounter((currentContexts.appSupport ?? 0) + (contextKey === "appSupport" ? unreadDelta : 0)),
      supportCases: cloneSupportCaseCounters(currentContexts.supportCases)
    };
    const counterPatch = { chats: nextChatCounter, chat: nextContexts };
    this.activityStore.patchUserCounterOverrides(activeUserId, counterPatch);
    this.userProfileStore.patchUserActivityCounters(activeUserId, counterPatch);
  }
  chatContextCounterKey(channelType) {
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
  normalizeEventChatCounter(value) {
    const count = Number(value);
    return Number.isFinite(count) ? Math.max(0, Math.trunc(count)) : 0;
  }
  async ensureActivitiesPopupLoaded() {
    if (this.activitiesPopupComponentRef()) {
      return;
    }
    const module = await import("./activities-popup.component-NC6IQL3N.js");
    this.activitiesPopupComponentRef.set(module.ActivitiesPopupComponent);
  }
  async ensureEventChatPopupLoaded() {
    if (this.eventChatPopupComponentRef()) {
      return;
    }
    const module = await import("./event-chat-popup.component-XV3FCW3Q.js");
    this.eventChatPopupComponentRef.set(module.EventChatPopupComponent);
  }
  async ensureEventExplorePopupLoaded() {
    if (this.eventExplorePopupComponentRef()) {
      return;
    }
    const module = await import("./event-explore-popup.component-JSTIIPWE.js");
    this.eventExplorePopupComponentRef.set(module.EventExplorePopupComponent);
  }
  async ensureEventMembersPopupLoaded() {
    if (this.eventMembersPopupComponentRef()) {
      return;
    }
    const module = await import("./event-members-popup.component-EIZCHDF6.js");
    this.eventMembersPopupComponentRef.set(module.EventMembersPopupComponent);
  }
  async ensureEventFeedbackPopupLoaded() {
    if (this.eventFeedbackPopupComponentRef()) {
      return;
    }
    const module = await import("./event-feedback-popup.component-ZAU4TU7Z.js");
    this.eventFeedbackPopupComponentRef.set(module.EventFeedbackPopupComponent);
  }
  async ensureEventFeedbackRatedDetailPopupLoaded() {
    if (this.eventFeedbackRatedDetailPopupComponentRef()) {
      return;
    }
    const module = await import("./event-feedback-rated-detail-popup.component-5EZ7II36.js");
    this.eventFeedbackRatedDetailPopupComponentRef.set(module.EventFeedbackRatedDetailPopupComponent);
  }
  patchUiState(patch) {
    this._uiState.update((state) => __spreadValues(__spreadValues({}, state), patch));
  }
  resolveRateSocialBadgeEnabled(state) {
    return state.rateFilter.startsWith("pair") ? state.ratePairSocialBadgeEnabled : state.rateIndividualSocialBadgeEnabled;
  }
  normalizeActivitiesPrimaryFilter(filter) {
    if (filter === "hosting" || filter === "invitations") {
      return "events";
    }
    return filter;
  }
  resolveActivitiesEventScope(primaryFilter, explicitScope) {
    if (explicitScope) {
      return explicitScope;
    }
    if (primaryFilter === "invitations") {
      return "invitations";
    }
    if (primaryFilter === "hosting") {
      return "my-events";
    }
    return "all";
  }
  normalizeEventChatRequest(request) {
    const chatId = `${request.chatId ?? ""}`.trim();
    const ownerId = `${request.ownerId ?? ""}`.trim();
    const channelType = request.channelType ?? null;
    const parentZIndex = Number(request.parentZIndex);
    if (!chatId && !ownerId) {
      return null;
    }
    return {
      chatId,
      targetMessageId: `${request.targetMessageId ?? ""}`.trim() || null,
      ownerId: ownerId || null,
      channelType,
      parentZIndex: Number.isFinite(parentZIndex) ? Math.max(0, Math.trunc(parentZIndex)) : null
    };
  }
  cloneEventChatHeader(header) {
    return __spreadProps(__spreadValues({}, header), {
      chatId: `${header.chatId ?? ""}`.trim(),
      ownerId: `${header.ownerId ?? ""}`.trim() || null,
      parentZIndex: Number.isFinite(Number(header.parentZIndex)) ? Math.max(0, Math.trunc(Number(header.parentZIndex))) : null,
      memberIds: [...header.memberIds ?? []],
      members: (header.members ?? []).map((member) => __spreadValues({}, member)),
      supportCase: header.supportCase ? __spreadProps(__spreadValues({}, header.supportCase), {
        assignee: header.supportCase.assignee ? __spreadValues({}, header.supportCase.assignee) : header.supportCase.assignee
      }) : header.supportCase,
      metrics: header.metrics ? {
        members: header.metrics.members ? __spreadValues({}, header.metrics.members) : null,
        transport: header.metrics.transport ? __spreadValues({}, header.metrics.transport) : null,
        accommodation: header.metrics.accommodation ? __spreadValues({}, header.metrics.accommodation) : null,
        supplies: header.metrics.supplies ? __spreadValues({}, header.metrics.supplies) : null,
        groupsCount: header.metrics.groupsCount ?? null,
        pendingTotal: Math.max(0, Math.trunc(Number(header.metrics.pendingTotal) || 0))
      } : header.metrics,
      navigationContext: header.navigationContext ? __spreadProps(__spreadValues({}, header.navigationContext), {
        subEvent: header.navigationContext.subEvent ? __spreadValues({}, header.navigationContext.subEvent) : header.navigationContext.subEvent,
        group: header.navigationContext.group ? __spreadValues({}, header.navigationContext.group) : header.navigationContext.group
      }) : header.navigationContext
    });
  }
  static \u0275fac = function ActivitiesPopupStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ActivitiesPopupStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ActivitiesPopupStore, factory: _ActivitiesPopupStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ActivitiesPopupStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  eventChatPopupRequestFromChat,
  eventChatHeaderStateFromChat,
  ActivitiesPopupStore
};
//# sourceMappingURL=chunk-5GUOJYST.js.map
