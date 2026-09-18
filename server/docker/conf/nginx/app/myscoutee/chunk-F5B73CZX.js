import {
  NotificationsService
} from "./chunk-XCPZRRU5.js";
import {
  ActivityStore,
  UserProfileStore
} from "./chunk-52XNNRXY.js";
import {
  APP_STORAGE_KEYS
} from "./chunk-YO3STUCM.js";
import {
  Injectable,
  Subject,
  __spreadProps,
  __spreadValues,
  computed,
  inject,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-FMXFYYCS.js";

// src/app/shared/ui/context/stores/event-checkout-draft.store.ts
var EventCheckoutDraftStore = class _EventCheckoutDraftStore {
  static STORAGE_KEY = APP_STORAGE_KEYS.eventCheckoutDrafts;
  draftsRef = signal(this.readInitialDrafts(), ...ngDevMode ? [{ debugName: "draftsRef" }] : (
    /* istanbul ignore next */
    []
  ));
  drafts = this.draftsRef.asReadonly();
  read(userId, sourceId) {
    return this.draftsRef()[this.buildKey(userId, sourceId)] ?? null;
  }
  listByUser(userId) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return [];
    }
    return Object.values(this.draftsRef()).filter((item) => item.userId === normalizedUserId).sort((left, right) => right.updatedAtMs - left.updatedAtMs);
  }
  reconcileExpiredEventDrafts(userId, records, nowMs = Date.now()) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId || records.length === 0) {
      return;
    }
    const recordsById = new Map(records.map((record) => [record.id, record]));
    for (const draft of this.listByUser(normalizedUserId)) {
      const expiresAtMs = Date.parse(draft.expiresAtIso ?? "");
      const record = recordsById.get(draft.sourceId);
      if (record && (record.checkoutResultState === null || record.checkoutResultState === "succeeded" || record.checkoutResultState === "deleted" && Number.isFinite(expiresAtMs) && expiresAtMs <= nowMs)) {
        this.clear(normalizedUserId, draft.sourceId);
      }
    }
  }
  save(draft) {
    const normalized = this.normalizeDraft(draft);
    if (!normalized) {
      return;
    }
    const key = this.buildKey(normalized.userId, normalized.sourceId);
    const next = __spreadProps(__spreadValues({}, this.draftsRef()), {
      [key]: normalized
    });
    this.draftsRef.set(next);
    this.persist(next);
  }
  clear(userId, sourceId) {
    const key = this.buildKey(userId, sourceId);
    const current = this.draftsRef();
    if (!current[key]) {
      return;
    }
    const next = __spreadValues({}, current);
    delete next[key];
    this.draftsRef.set(next);
    this.persist(next);
  }
  buildKey(userId, sourceId) {
    return `${userId.trim()}::${sourceId.trim()}`;
  }
  normalizeDraft(draft) {
    const userId = draft?.userId?.trim() ?? "";
    const sourceId = draft?.sourceId?.trim() ?? "";
    if (!userId || !sourceId) {
      return null;
    }
    return {
      userId,
      sourceId,
      eventTitle: draft?.eventTitle?.trim() || "Checkout draft",
      eventTimeframe: draft?.eventTimeframe?.trim() || "",
      slotSourceId: draft?.slotSourceId?.trim() || null,
      selectedDateKey: draft?.selectedDateKey?.trim() || null,
      optionalSubEventIds: [...new Set(draft?.optionalSubEventIds ?? [])].map((item) => item.trim()).filter(Boolean),
      acceptedPolicyIds: [...new Set(draft?.acceptedPolicyIds ?? [])].map((item) => item.trim()).filter(Boolean),
      appliedPromoCodes: [...new Set((draft?.appliedPromoCodes ?? []).map((item) => item.trim().toUpperCase()).filter(Boolean))],
      basketItems: (draft?.basketItems ?? []).map((item) => this.normalizeBasketItem(item)).filter(Boolean),
      pricingSummaryRows: this.normalizePricingSummaryRows((draft?.pricingSummaryRows ?? []).length > 0 ? draft?.pricingSummaryRows : (draft?.basketItems ?? []).flatMap((item) => item.pricingSummaryRows ?? []), draft?.currency),
      checkoutState: this.normalizeCheckoutState(draft?.checkoutState),
      lineItems: (draft?.lineItems ?? []).map((item) => ({
        id: item.id?.trim() ?? "",
        kind: item.kind,
        label: item.label?.trim() ?? "",
        detail: item.detail?.trim() ?? "",
        amount: Number(item.amount) || 0,
        currency: item.currency?.trim() || "USD"
      })).filter((item) => item.id && item.label),
      totalAmount: Math.max(0, Number(draft?.totalAmount) || 0),
      currency: draft?.currency?.trim() || "USD",
      checkoutSessionId: draft?.checkoutSessionId?.trim() || null,
      expiresAtIso: draft?.expiresAtIso?.trim() || null,
      pendingReason: draft?.pendingReason === "waitlist" ? "waitlist" : draft?.pendingReason === "approval" ? "approval" : null,
      basketChanged: draft?.basketChanged === true,
      updatedAtMs: Math.max(0, Math.trunc(Number(draft?.updatedAtMs) || Date.now()))
    };
  }
  normalizeBasketItem(item) {
    const id = item?.id?.trim() ?? "";
    const sourceId = item?.sourceId?.trim() ?? "";
    const label = item?.label?.trim() ?? "";
    if (!id || !sourceId || !label) {
      return null;
    }
    const currency = item?.currency?.trim() || "USD";
    return {
      id,
      kind: item?.kind === "sub_event" || item?.kind === "resource" ? item.kind : "event",
      sourceId,
      slotSourceId: item?.slotSourceId?.trim() || null,
      slotTemplateId: item?.slotTemplateId?.trim() || null,
      selectedDateKey: item?.selectedDateKey?.trim() || null,
      subEventId: item?.subEventId?.trim() || null,
      resourceType: item?.resourceType ?? null,
      label,
      detail: item?.detail?.trim() || "",
      amount: Number(item?.amount) || 0,
      currency,
      quantity: Math.max(1, Math.trunc(Number(item?.quantity) || 1)),
      status: this.normalizeCheckoutState(item?.status),
      resultState: this.normalizeCheckoutResultState(item?.resultState),
      pricingSummaryRows: (item?.pricingSummaryRows ?? []).map((row) => ({
        key: row.key?.trim() || row.label?.trim() || "pricing",
        label: row.label?.trim() || "Pricing",
        detail: row.detail?.trim() || null,
        amount: Number.isFinite(row.amount) ? Number(row.amount) : null,
        currency: row.currency?.trim() || currency,
        multiplier: Number.isFinite(row.multiplier) ? Math.max(1, Math.trunc(Number(row.multiplier))) : null
      })).filter((row) => row.label),
      checkoutSessionId: item?.checkoutSessionId?.trim() || null,
      createdAtIso: item?.createdAtIso?.trim() || null,
      updatedAtIso: item?.updatedAtIso?.trim() || null,
      expiresAtIso: item?.expiresAtIso?.trim() || null
    };
  }
  normalizePricingSummaryRows(rows, fallbackCurrency) {
    const currency = fallbackCurrency?.trim() || "USD";
    return (rows ?? []).map((row) => ({
      key: row.key?.trim() || row.label?.trim() || "pricing",
      label: row.label?.trim() || "Pricing",
      detail: row.detail?.trim() || null,
      amount: Number.isFinite(row.amount) ? Number(row.amount) : null,
      currency: row.currency?.trim() || currency,
      multiplier: Number.isFinite(row.multiplier) ? Math.max(1, Math.trunc(Number(row.multiplier))) : null
    })).filter((row) => row.label);
  }
  normalizeCheckoutState(value) {
    return value === "confirmed" || value === "waiting" || value === "approval-pending" || value === "approved" || value === "pay" || value === "cancelled" || value === "rejected" ? value : "draft";
  }
  normalizeCheckoutResultState(value) {
    return value === "deleted" || value === "succeeded" || value === "failed" ? value : "pending";
  }
  readInitialDrafts() {
    if (typeof window === "undefined" || !window.localStorage) {
      return {};
    }
    try {
      const raw = window.localStorage.getItem(_EventCheckoutDraftStore.STORAGE_KEY);
      if (!raw) {
        return {};
      }
      const parsed = JSON.parse(raw);
      const next = {};
      for (const [key, value] of Object.entries(parsed ?? {})) {
        const normalized = this.normalizeDraft(value);
        if (normalized) {
          next[key] = normalized;
        }
      }
      return next;
    } catch {
      return {};
    }
  }
  persist(drafts) {
    if (typeof window === "undefined" || !window.localStorage) {
      return;
    }
    try {
      window.localStorage.setItem(_EventCheckoutDraftStore.STORAGE_KEY, JSON.stringify(drafts));
    } catch {
    }
  }
  static \u0275fac = function EventCheckoutDraftStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EventCheckoutDraftStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _EventCheckoutDraftStore, factory: _EventCheckoutDraftStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EventCheckoutDraftStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/ui/context/stores/activity-invite-popup.store.ts
var ActivityInvitePopupStore = class _ActivityInvitePopupStore {
  activityInvitePopupRef = signal(null, ...ngDevMode ? [{ debugName: "activityInvitePopupRef" }] : (
    /* istanbul ignore next */
    []
  ));
  assetMemberPickerPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "assetMemberPickerPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  activityInvitePopup = this.activityInvitePopupRef.asReadonly();
  assetMemberPickerPopupComponent = this.assetMemberPickerPopupComponentRef.asReadonly();
  openActivityInvitePopup(payload) {
    const normalizedOwnerId = payload.ownerId.trim();
    if (!normalizedOwnerId) {
      return;
    }
    this.activityInvitePopupRef.set({
      updatedMs: Date.now(),
      ownerId: normalizedOwnerId,
      ownerType: payload.ownerType === "asset" || payload.ownerType === "group" || payload.ownerType === "subEvent" ? payload.ownerType : "event",
      parentOwner: payload.parentOwner?.ownerId?.trim() ? {
        ownerId: payload.parentOwner.ownerId.trim(),
        ownerType: payload.parentOwner.ownerType
      } : null,
      title: payload.title?.trim() || void 0,
      initialCandidates: Array.isArray(payload.initialCandidates) ? payload.initialCandidates.map((candidate) => __spreadValues({}, candidate)) : void 0,
      initialSelection: Array.isArray(payload.initialSelection) ? payload.initialSelection.map((candidate) => __spreadValues({}, candidate)) : void 0,
      onApply: payload.onApply,
      closeOwnerPopupOnClose: payload.closeOwnerPopupOnClose === true
    });
  }
  closeActivityInvitePopup() {
    this.activityInvitePopupRef.set(null);
  }
  async ensureAssetMemberPickerPopupLoaded() {
    if (this.assetMemberPickerPopupComponentRef()) {
      return;
    }
    const module = await import("./asset-member-picker-popup.component-W3XJJTKU.js");
    this.assetMemberPickerPopupComponentRef.set(module.AssetMemberPickerPopupComponent);
  }
  static \u0275fac = function ActivityInvitePopupStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ActivityInvitePopupStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ActivityInvitePopupStore, factory: _ActivityInvitePopupStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ActivityInvitePopupStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/ui/context/stores/asset-availability-popup.store.ts
var AssetAvailabilityPopupStore = class _AssetAvailabilityPopupStore {
  availabilityPopupRef = signal(null, ...ngDevMode ? [{ debugName: "availabilityPopupRef" }] : (
    /* istanbul ignore next */
    []
  ));
  dayListPopupRef = signal(null, ...ngDevMode ? [{ debugName: "dayListPopupRef" }] : (
    /* istanbul ignore next */
    []
  ));
  availabilityHeaderRef = signal(null, ...ngDevMode ? [{ debugName: "availabilityHeaderRef" }] : (
    /* istanbul ignore next */
    []
  ));
  dayListHeaderRef = signal(null, ...ngDevMode ? [{ debugName: "dayListHeaderRef" }] : (
    /* istanbul ignore next */
    []
  ));
  assetAvailabilityPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "assetAvailabilityPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  availabilityPopup = this.availabilityPopupRef.asReadonly();
  dayListPopup = this.dayListPopupRef.asReadonly();
  availabilityHeader = this.availabilityHeaderRef.asReadonly();
  dayListHeader = this.dayListHeaderRef.asReadonly();
  assetAvailabilityPopupComponent = this.assetAvailabilityPopupComponentRef.asReadonly();
  openAvailabilityPopup(request, header) {
    const normalized = this.normalizeRequest(request, "asset-availability", "day");
    if (!normalized) {
      return;
    }
    this.availabilityPopupRef.set(normalized);
    this.availabilityHeaderRef.set(this.normalizeHeader(header, normalized));
  }
  openDayListPopup(request, header) {
    const normalized = this.normalizeRequest(request, "asset-availability-day-list", "day");
    if (!normalized) {
      return;
    }
    this.dayListPopupRef.set(__spreadProps(__spreadValues({}, normalized), {
      view: "day"
    }));
    this.dayListHeaderRef.set(this.normalizeHeader(header, normalized) ?? this.availabilityHeaderRef());
  }
  closeAvailabilityPopup() {
    this.availabilityPopupRef.set(null);
    this.availabilityHeaderRef.set(null);
  }
  closeDayListPopup() {
    this.dayListPopupRef.set(null);
    this.dayListHeaderRef.set(null);
  }
  patchRequestMetrics(delta) {
    const patchHeader = (header) => {
      if (!header?.metrics) {
        return header;
      }
      const metrics = __spreadValues({}, header.metrics);
      for (const [key, value] of Object.entries(delta)) {
        metrics[key] = this.normalizeCount(metrics[key] + (Number(value) || 0));
      }
      return __spreadProps(__spreadValues({}, header), { metrics });
    };
    this.availabilityHeaderRef.update(patchHeader);
    this.dayListHeaderRef.update(patchHeader);
  }
  updateDayListRange(rangeStart, rangeEnd, filter) {
    const request = this.dayListPopupRef();
    if (!request) {
      return;
    }
    const normalizedStart = `${rangeStart ?? ""}`.trim() || null;
    const normalizedEnd = `${rangeEnd ?? ""}`.trim() || null;
    this.dayListPopupRef.set(__spreadProps(__spreadValues({}, request), {
      updatedMs: Date.now(),
      initialDateIso: normalizedStart ?? request.initialDateIso ?? null,
      rangeStart: normalizedStart,
      rangeEnd: normalizedEnd,
      filter: this.normalizeFilter(filter ?? request.filter)
    }));
  }
  async ensureAssetAvailabilityPopupLoaded() {
    if (this.assetAvailabilityPopupComponentRef()) {
      return;
    }
    const module = await import("./asset-availability-popup.component-UPNKDEU5.js");
    this.assetAvailabilityPopupComponentRef.set(module.AssetAvailabilityPopupComponent);
  }
  normalizeRequest(request, fallbackInstanceId, fallbackView) {
    const assetId = `${request.assetId ?? ""}`.trim();
    const ownerUserId = `${request.ownerUserId ?? ""}`.trim();
    if (!assetId || !ownerUserId) {
      return null;
    }
    const view = this.normalizeView(request.view, fallbackView);
    return {
      updatedMs: Date.now(),
      instanceId: `${request.instanceId ?? ""}`.trim() || `${fallbackInstanceId}:${assetId}`,
      assetId,
      ownerUserId,
      initialDateIso: `${request.initialDateIso ?? ""}`.trim() || null,
      rangeStart: `${request.rangeStart ?? ""}`.trim() || null,
      rangeEnd: `${request.rangeEnd ?? ""}`.trim() || null,
      filter: this.normalizeFilter(request.filter),
      view,
      source: request.source ?? null
    };
  }
  normalizeHeader(header, request) {
    const assetId = `${header?.assetId ?? request.assetId}`.trim();
    const ownerUserId = `${header?.ownerUserId ?? request.ownerUserId}`.trim();
    const title = `${header?.title ?? ""}`.trim();
    if (!assetId || !ownerUserId || !title) {
      return null;
    }
    return {
      assetId,
      ownerUserId,
      title,
      subtitle: `${header?.subtitle ?? ""}`.trim() || null,
      type: `${header?.type ?? ""}`.trim() || null,
      capacity: Math.max(0, Math.trunc(Number(header?.capacity) || 0)),
      metrics: this.normalizeMetrics(header?.metrics)
    };
  }
  normalizeMetrics(metrics) {
    if (!metrics) {
      return null;
    }
    return {
      allItems: this.normalizeCount(metrics.allItems),
      activeItems: this.normalizeCount(metrics.activeItems),
      assignedItems: this.normalizeCount(metrics.assignedItems),
      borrowedItems: this.normalizeCount(metrics.borrowedItems),
      pendingItems: this.normalizeCount(metrics.pendingItems)
    };
  }
  normalizeCount(value) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? Math.max(0, Math.trunc(numeric)) : 0;
  }
  normalizeFilter(filter) {
    if (filter === "active-items" || filter === "pending-requests" || filter === "borrowed-items") {
      return filter;
    }
    return "all";
  }
  normalizeView(view, fallback) {
    return view === "day" || view === "week" || view === "month" ? view : fallback;
  }
  static \u0275fac = function AssetAvailabilityPopupStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AssetAvailabilityPopupStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AssetAvailabilityPopupStore, factory: _AssetAvailabilityPopupStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AssetAvailabilityPopupStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/ui/context/stores/event-subevents-popup.store.ts
var EventSubeventsPopupStore = class _EventSubeventsPopupStore {
  eventSubeventsListPopupRef = signal(null, ...ngDevMode ? [{ debugName: "eventSubeventsListPopupRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventTournamentGroupsPopupRef = signal(null, ...ngDevMode ? [{ debugName: "eventTournamentGroupsPopupRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventTournamentGroupsUpdateRef = signal(null, ...ngDevMode ? [{ debugName: "eventTournamentGroupsUpdateRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventSubeventsDefinitionDraftUpdateRef = signal(null, ...ngDevMode ? [{ debugName: "eventSubeventsDefinitionDraftUpdateRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventSubeventsReloadRequestRef = signal(null, ...ngDevMode ? [{ debugName: "eventSubeventsReloadRequestRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventSubeventsListPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "eventSubeventsListPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventTournamentGroupsPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "eventTournamentGroupsPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  eventSubeventsListPopup = this.eventSubeventsListPopupRef.asReadonly();
  eventTournamentGroupsPopup = this.eventTournamentGroupsPopupRef.asReadonly();
  eventTournamentGroupsUpdate = this.eventTournamentGroupsUpdateRef.asReadonly();
  eventSubeventsDefinitionDraftUpdate = this.eventSubeventsDefinitionDraftUpdateRef.asReadonly();
  eventSubeventsReloadRequest = this.eventSubeventsReloadRequestRef.asReadonly();
  eventSubeventsListPopupComponent = this.eventSubeventsListPopupComponentRef.asReadonly();
  eventTournamentGroupsPopupComponent = this.eventTournamentGroupsPopupComponentRef.asReadonly();
  openEventSubeventsListPopup(payload) {
    const eventId = `${payload.eventId ?? ""}`.trim();
    if (!eventId) {
      return;
    }
    const editorAction = payload.editorAction === "manage" || payload.editorAction === "edit" || payload.editorAction === "view" ? payload.editorAction : payload.canEdit === true ? "edit" : "view";
    this.eventSubeventsListPopupRef.set({
      updatedMs: Date.now(),
      host: payload.host ?? "activities",
      eventId,
      target: payload.target ?? "events",
      title: `${payload.title ?? ""}`.trim() || null,
      timeframe: `${payload.timeframe ?? ""}`.trim() || null,
      startAtIso: `${payload.startAtIso ?? ""}`.trim() || null,
      endAtIso: `${payload.endAtIso ?? ""}`.trim() || null,
      mode: payload.mode === "Tournament" ? "Tournament" : payload.mode === "Casual" ? "Casual" : null,
      acceptedMembers: this.nonNegativeInteger(payload.acceptedMembers),
      pendingMembers: this.nonNegativeInteger(payload.pendingMembers),
      capacityTotal: this.nonNegativeInteger(payload.capacityTotal),
      resourceOwnerUserId: `${payload.resourceOwnerUserId ?? ""}`.trim() || null,
      editorAction,
      canEdit: editorAction !== "view"
    });
  }
  closeEventSubeventsListPopup() {
    this.eventSubeventsListPopupRef.set(null);
  }
  updateEventSubeventsEditorAction(eventId, editorAction) {
    const normalizedEventId = eventId.trim();
    this.eventSubeventsListPopupRef.update((request) => {
      if (!request || request.eventId !== normalizedEventId || request.editorAction === editorAction) {
        return request;
      }
      return __spreadProps(__spreadValues({}, request), {
        updatedMs: Date.now(),
        editorAction,
        canEdit: editorAction !== "view"
      });
    });
  }
  openEventTournamentGroupsPopup(payload) {
    const eventId = `${payload.eventId ?? ""}`.trim();
    if (!eventId) {
      return;
    }
    this.eventTournamentGroupsPopupRef.set({
      updatedMs: Date.now(),
      eventId,
      slotId: `${payload.slotId ?? ""}`.trim() || null,
      title: `${payload.title ?? ""}`.trim() || null,
      canManage: payload.canManage === true,
      stages: (payload.stages ?? []).map((stage) => __spreadProps(__spreadValues({}, stage), {
        groups: []
      })),
      selectedStageId: `${payload.selectedStageId ?? ""}`.trim() || null,
      selectedGroupId: `${payload.selectedGroupId ?? ""}`.trim() || null
    });
  }
  closeEventTournamentGroupsPopup() {
    this.eventTournamentGroupsPopupRef.set(null);
  }
  emitEventTournamentGroupsUpdate(payload) {
    const eventId = `${payload.eventId ?? ""}`.trim();
    const stageId = `${payload.stageId ?? ""}`.trim();
    if (!eventId || !stageId) {
      return;
    }
    const updatedMs = Math.max(Date.now(), (this.eventTournamentGroupsUpdateRef()?.updatedMs ?? 0) + 1);
    this.eventTournamentGroupsUpdateRef.set({
      updatedMs,
      eventId,
      slotId: `${payload.slotId ?? ""}`.trim() || null,
      stageId,
      groupsCount: Math.max(0, Math.trunc(Number(payload.groupsCount) || 0)),
      groupsPending: Math.max(0, Math.trunc(Number(payload.groupsPending) || 0)),
      groupsPendingDelta: Number.isFinite(Number(payload.groupsPendingDelta)) ? Math.trunc(Number(payload.groupsPendingDelta)) : 0
    });
  }
  emitEventSubeventsDefinitionDraftPreview(payload) {
    const eventId = `${payload.eventId ?? ""}`.trim();
    if (!eventId) {
      return;
    }
    this.eventSubeventsDefinitionDraftUpdateRef.set({
      updatedMs: this.nextDefinitionDraftUpdatedMs(),
      action: "preview",
      eventId,
      mode: payload.mode === "Tournament" ? "Tournament" : "Casual",
      startAtIso: `${payload.startAtIso ?? ""}`.trim() || null,
      endAtIso: `${payload.endAtIso ?? ""}`.trim() || null,
      slotsEnabled: payload.slotsEnabled === true,
      definitions: (payload.definitions ?? []).map((definition) => __spreadValues({}, definition))
    });
  }
  discardEventSubeventsDefinitionDraft(eventId) {
    const normalizedEventId = `${eventId ?? ""}`.trim();
    if (!normalizedEventId) {
      return;
    }
    this.eventSubeventsDefinitionDraftUpdateRef.set({
      updatedMs: this.nextDefinitionDraftUpdatedMs(),
      action: "discard",
      eventId: normalizedEventId,
      mode: null,
      startAtIso: null,
      endAtIso: null,
      slotsEnabled: false,
      definitions: []
    });
  }
  clearEventSubeventsDefinitionDraft(eventId) {
    const normalizedEventId = `${eventId ?? ""}`.trim();
    if (this.eventSubeventsDefinitionDraftUpdateRef()?.eventId === normalizedEventId) {
      this.eventSubeventsDefinitionDraftUpdateRef.set(null);
    }
  }
  requestEventSubeventsReload(eventId) {
    const normalizedEventId = `${eventId ?? ""}`.trim();
    if (!normalizedEventId) {
      return;
    }
    this.eventSubeventsReloadRequestRef.set({
      revision: (this.eventSubeventsReloadRequestRef()?.revision ?? 0) + 1,
      eventId: normalizedEventId,
      source: "event-save"
    });
  }
  nextDefinitionDraftUpdatedMs() {
    return Math.max(Date.now(), (this.eventSubeventsDefinitionDraftUpdateRef()?.updatedMs ?? 0) + 1);
  }
  nonNegativeInteger(value) {
    const count = Number(value);
    return Number.isFinite(count) ? Math.max(0, Math.trunc(count)) : 0;
  }
  async ensureEventSubeventsListPopupLoaded() {
    if (this.eventSubeventsListPopupComponentRef()) {
      return;
    }
    const module = await import("./event-subevents-list-popup.component-WLD63C6V.js");
    this.eventSubeventsListPopupComponentRef.set(module.EventSubeventsListPopupComponent);
  }
  async ensureEventTournamentGroupsPopupLoaded() {
    if (this.eventTournamentGroupsPopupComponentRef()) {
      return;
    }
    const module = await import("./event-tournament-groups-popup.component-IFPAOCNP.js");
    this.eventTournamentGroupsPopupComponentRef.set(module.EventTournamentGroupsPopupComponent);
  }
  static \u0275fac = function EventSubeventsPopupStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EventSubeventsPopupStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _EventSubeventsPopupStore, factory: _EventSubeventsPopupStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EventSubeventsPopupStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/ui/context/stores/event-editor-popup.store.ts
var EventEditorPopupStore = class _EventEditorPopupStore {
  _isOpen = signal(false, ...ngDevMode ? [{ debugName: "_isOpen" }] : (
    /* istanbul ignore next */
    []
  ));
  _mode = signal("create", ...ngDevMode ? [{ debugName: "_mode" }] : (
    /* istanbul ignore next */
    []
  ));
  _sourceEvent = signal(null, ...ngDevMode ? [{ debugName: "_sourceEvent" }] : (
    /* istanbul ignore next */
    []
  ));
  _readOnly = signal(false, ...ngDevMode ? [{ debugName: "_readOnly" }] : (
    /* istanbul ignore next */
    []
  ));
  _presentation = signal({ mode: "default" }, ...ngDevMode ? [{ debugName: "_presentation" }] : (
    /* istanbul ignore next */
    []
  ));
  eventEditorPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "eventEditorPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  _onOpen = new Subject();
  _onClose = new Subject();
  isOpen = this._isOpen.asReadonly();
  mode = this._mode.asReadonly();
  sourceEvent = this._sourceEvent.asReadonly();
  readOnly = this._readOnly.asReadonly();
  presentation = this._presentation.asReadonly();
  eventEditorPopupComponent = this.eventEditorPopupComponentRef.asReadonly();
  isOpenBoolean = computed(() => this._isOpen(), ...ngDevMode ? [{ debugName: "isOpenBoolean" }] : (
    /* istanbul ignore next */
    []
  ));
  onOpen$ = this._onOpen.asObservable();
  onClose$ = this._onClose.asObservable();
  open(mode = "create", sourceEvent, readOnly, presentation) {
    this._mode.set(mode);
    this._sourceEvent.set(sourceEvent ?? null);
    this._readOnly.set(Boolean(readOnly));
    this._presentation.set(this.normalizePresentation(presentation));
    this._isOpen.set(true);
    this._onOpen.next();
  }
  openView(sourceEvent) {
    this.open("edit", sourceEvent, true);
  }
  openEdit(sourceEvent) {
    this.open("edit", sourceEvent, false);
  }
  openCheckoutReview(sourceEvent, presentation) {
    this.open("edit", sourceEvent, true, __spreadProps(__spreadValues({}, presentation), {
      mode: "checkout-review",
      hideSubEventsPanel: presentation?.hideSubEventsPanel === true,
      hideSlotsPanel: presentation?.hideSlotsPanel === true
    }));
  }
  updateCheckoutReviewPresentation(presentation) {
    if (!this._isOpen() || this._presentation().mode !== "checkout-review") {
      return;
    }
    this._presentation.set(this.normalizePresentation(__spreadProps(__spreadValues({}, presentation), {
      mode: "checkout-review",
      hideSubEventsPanel: presentation?.hideSubEventsPanel === true,
      hideSlotsPanel: presentation?.hideSlotsPanel === true
    })));
  }
  updateCheckoutReviewPhase(checkoutPhase, footerItems) {
    const current = this._presentation();
    if (!this._isOpen() || current.mode !== "checkout-review") {
      return;
    }
    this._presentation.set(__spreadProps(__spreadValues({}, current), {
      checkoutPhase,
      footerItems: [...footerItems]
    }));
  }
  openCreate() {
    this.open("create");
  }
  close() {
    this._isOpen.set(false);
    this._sourceEvent.set(null);
    this._readOnly.set(false);
    this._presentation.set({ mode: "default" });
    this._onClose.next();
  }
  toggle(mode = "create", sourceEvent, readOnly, presentation) {
    if (this._isOpen()) {
      this.close();
      return;
    }
    this.open(mode, sourceEvent, readOnly, presentation);
  }
  get isCurrentlyOpen() {
    return this._isOpen();
  }
  get currentMode() {
    return this._mode();
  }
  get currentSourceEvent() {
    return this._sourceEvent();
  }
  get isReadOnly() {
    return this._readOnly();
  }
  async ensureEventEditorPopupLoaded() {
    if (this.eventEditorPopupComponentRef()) {
      return;
    }
    const module = await import("./event-editor-popup.component-HAAUXT7J.js");
    this.eventEditorPopupComponentRef.set(module.EventEditorPopupComponent);
  }
  normalizePresentation(presentation) {
    const mode = presentation?.mode === "checkout-review" ? "checkout-review" : "default";
    return {
      mode,
      checkoutPhase: mode === "checkout-review" && presentation?.checkoutPhase === "payment" ? "payment" : "review",
      title: `${presentation?.title ?? ""}`.trim() || null,
      subtitle: `${presentation?.subtitle ?? ""}`.trim() || null,
      loading: presentation?.loading ?? null,
      hideSubEventsPanel: presentation?.hideSubEventsPanel === true,
      hideSlotsPanel: presentation?.hideSlotsPanel === true,
      hidePaymentPanel: presentation?.hidePaymentPanel === true,
      showBasketPanel: presentation?.showBasketPanel ?? null,
      showPricingPanel: presentation?.showPricingPanel ?? null,
      basketTone: presentation?.basketTone ?? null,
      paymentTone: presentation?.paymentTone ?? null,
      paymentMethod: presentation?.paymentMethod ?? null,
      paymentMethodReadOnly: presentation?.paymentMethodReadOnly ?? null,
      paymentProvider: presentation?.paymentProvider ?? null,
      paymentStatusLabel: presentation?.paymentStatusLabel ?? null,
      paymentStatusTone: presentation?.paymentStatusTone ?? null,
      paymentNote: presentation?.paymentNote ?? null,
      basketItems: typeof presentation?.basketItems === "function" ? presentation.basketItems : [...presentation?.basketItems ?? []],
      basketPricingSummaryRows: typeof presentation?.basketPricingSummaryRows === "function" ? presentation.basketPricingSummaryRows : [...presentation?.basketPricingSummaryRows ?? []],
      basketTotalAmount: presentation?.basketTotalAmount ?? null,
      basketCurrency: presentation?.basketCurrency ?? null,
      basketAddDisabled: presentation?.basketAddDisabled ?? null,
      showPromoCodeAction: presentation?.showPromoCodeAction ?? null,
      appliedPromoCodeCount: presentation?.appliedPromoCodeCount ?? null,
      acceptedPolicyIds: typeof presentation?.acceptedPolicyIds === "function" ? presentation.acceptedPolicyIds : [...presentation?.acceptedPolicyIds ?? []],
      policyApprovalDisabled: presentation?.policyApprovalDisabled ?? null,
      onBasketAdd: presentation?.onBasketAdd,
      onPromoCodeAction: presentation?.onPromoCodeAction,
      onPolicyToggle: presentation?.onPolicyToggle,
      onPaymentMethodChange: presentation?.onPaymentMethodChange,
      onBasketItemMenuSelect: presentation?.onBasketItemMenuSelect,
      footerItems: [...presentation?.footerItems ?? []],
      footerMessage: presentation?.footerMessage ?? null,
      onFooterItemSelect: presentation?.onFooterItemSelect,
      onClose: presentation?.onClose
    };
  }
  static \u0275fac = function EventEditorPopupStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EventEditorPopupStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _EventEditorPopupStore, factory: _EventEditorPopupStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EventEditorPopupStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/ui/context/stores/event-checkout-slot-picker.store.ts
var EventCheckoutSlotPickerStore = class _EventCheckoutSlotPickerStore {
  stateRef = signal(null, ...ngDevMode ? [{ debugName: "stateRef" }] : (
    /* istanbul ignore next */
    []
  ));
  slotPickerPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "slotPickerPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  nextId = 0;
  popup = this.stateRef.asReadonly();
  slotPickerPopupComponent = this.slotPickerPopupComponentRef.asReadonly();
  open(request) {
    const userId = request.userId?.trim();
    if (!userId || !request.record?.id?.trim()) {
      return null;
    }
    const state = __spreadProps(__spreadValues({}, request), {
      id: ++this.nextId,
      userId
    });
    this.stateRef.set(state);
    void this.ensureSlotPickerPopupLoaded();
    return state;
  }
  close() {
    this.stateRef.set(null);
  }
  async ensureSlotPickerPopupLoaded() {
    if (this.slotPickerPopupComponentRef()) {
      return;
    }
    const module = await import("./event-checkout-slot-picker-popup.component-POKFWO6T.js");
    this.slotPickerPopupComponentRef.set(module.EventCheckoutSlotPickerPopupComponent);
  }
  static \u0275fac = function EventCheckoutSlotPickerStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EventCheckoutSlotPickerStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _EventCheckoutSlotPickerStore, factory: _EventCheckoutSlotPickerStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EventCheckoutSlotPickerStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/ui/context/stores/notification-center.store.ts
var NotificationCenterStore = class _NotificationCenterStore {
  notificationsService = inject(NotificationsService);
  permissionBusy = signal(false, ...ngDevMode ? [{ debugName: "permissionBusy" }] : (
    /* istanbul ignore next */
    []
  ));
  permissionActionPending = this.permissionBusy.asReadonly();
  activityStore = inject(ActivityStore);
  userProfileStore = inject(UserProfileStore);
  activeUserIdRef = signal("", ...ngDevMode ? [{ debugName: "activeUserIdRef" }] : (
    /* istanbul ignore next */
    []
  ));
  openRef = signal(false, ...ngDevMode ? [{ debugName: "openRef" }] : (
    /* istanbul ignore next */
    []
  ));
  unreadCountRef = signal(0, ...ngDevMode ? [{ debugName: "unreadCountRef" }] : (
    /* istanbul ignore next */
    []
  ));
  mutedRef = signal(false, ...ngDevMode ? [{ debugName: "mutedRef" }] : (
    /* istanbul ignore next */
    []
  ));
  markReadPendingIdsRef = signal(/* @__PURE__ */ new Set(), ...ngDevMode ? [{ debugName: "markReadPendingIdsRef" }] : (
    /* istanbul ignore next */
    []
  ));
  attentionRequestedRef = signal(false, ...ngDevMode ? [{ debugName: "attentionRequestedRef" }] : (
    /* istanbul ignore next */
    []
  ));
  dragPositionRef = signal({ x: 0, y: 0 }, ...ngDevMode ? [{ debugName: "dragPositionRef" }] : (
    /* istanbul ignore next */
    []
  ));
  bucketRef = signal("new", ...ngDevMode ? [{ debugName: "bucketRef" }] : (
    /* istanbul ignore next */
    []
  ));
  activeUserId = this.activeUserIdRef.asReadonly();
  isOpen = this.openRef.asReadonly();
  visible = this.isOpen;
  unreadCount = this.unreadCountRef.asReadonly();
  muted = this.mutedRef.asReadonly();
  dragPosition = this.dragPositionRef.asReadonly();
  bucket = this.bucketRef.asReadonly();
  attentionVisible = computed(() => this.attentionRequestedRef() && this.unreadCountRef() > 0 && !this.muted() && !this.openRef(), ...ngDevMode ? [{ debugName: "attentionVisible" }] : (
    /* istanbul ignore next */
    []
  ));
  generation = 0;
  pageContextRevision = 0;
  pageContextRequestSequence = 0;
  initialize(userId, initialUnreadCount = 0, initialMuted = false) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      this.reset();
      return;
    }
    if (this.activeUserIdRef() === normalizedUserId) {
      this.syncUnreadCount(initialUnreadCount);
      this.syncMuted(initialMuted);
      return;
    }
    this.resetState();
    this.activeUserIdRef.set(normalizedUserId);
    this.syncUnreadCount(initialUnreadCount);
    this.syncMuted(initialMuted);
    this.requestAttention();
  }
  reset() {
    this.resetState();
  }
  open() {
    if (!this.activeUserIdRef() || this.openRef()) {
      return;
    }
    this.attentionRequestedRef.set(false);
    this.openRef.set(true);
  }
  close() {
    this.openRef.set(false);
  }
  dismissAttention() {
    this.attentionRequestedRef.set(false);
  }
  requestAttention() {
    if (this.unreadCountRef() > 0 && !this.muted() && !this.openRef()) {
      this.attentionRequestedRef.set(true);
    }
  }
  setDragPosition(position) {
    this.dragPositionRef.set({
      x: this.finiteCoordinate(position?.x),
      y: this.finiteCoordinate(position?.y)
    });
  }
  setBucket(bucket) {
    this.bucketRef.set(bucket === "new" ? "new" : "all");
  }
  isMarkReadPending(notificationId) {
    const normalizedNotificationId = notificationId.trim();
    return Boolean(normalizedNotificationId) && this.markReadPendingIdsRef().has(normalizedNotificationId);
  }
  syncUnreadCount(count, options = {}) {
    const nextCount = this.nonNegativeInteger(count);
    const previousCount = this.unreadCountRef();
    if (nextCount !== previousCount) {
      this.pageContextRevision += 1;
      this.unreadCountRef.set(nextCount);
      this.syncUserModelCounter(nextCount);
    }
    if (nextCount === 0) {
      this.attentionRequestedRef.set(false);
      return;
    }
    if (options.announce === true && nextCount > previousCount && !this.muted() && !this.openRef()) {
      this.attentionRequestedRef.set(true);
    }
  }
  captureUnreadSyncToken() {
    return {
      userId: this.activeUserIdRef(),
      generation: this.generation,
      revision: this.pageContextRevision,
      unreadCount: this.unreadCountRef()
    };
  }
  applyRealtimeUnreadCount(token, count) {
    const nextCount = this.nonNegativeInteger(count);
    if (!token.userId || token.userId !== this.activeUserIdRef() || token.generation !== this.generation || token.revision !== this.pageContextRevision) {
      return false;
    }
    this.syncUnreadCount(nextCount, {
      announce: nextCount > token.unreadCount
    });
    return true;
  }
  async queryPage(query, signal2) {
    const userId = this.activeUserIdRef();
    if (!userId) {
      return {
        items: [],
        total: 0,
        nextCursor: null,
        context: { unreadCount: 0, muted: false }
      };
    }
    const generation = this.generation;
    const contextRevision = this.pageContextRevision;
    const contextRequestSequence = ++this.pageContextRequestSequence;
    const page = await this.notificationsService.queryPage(userId, query, signal2);
    if (generation === this.generation && userId === this.activeUserIdRef() && contextRevision === this.pageContextRevision && contextRequestSequence === this.pageContextRequestSequence) {
      this.applyPageContext(page);
    }
    return page;
  }
  async markRead(notificationId, signal2) {
    const userId = this.activeUserIdRef();
    const normalizedNotificationId = notificationId.trim();
    if (!userId || !normalizedNotificationId) {
      throw new Error("Notification could not be marked as read.");
    }
    if (this.isMarkReadPending(normalizedNotificationId)) {
      throw new Error("Notification is already being marked as read.");
    }
    this.setMarkReadPending(normalizedNotificationId, true);
    try {
      this.pageContextRevision += 1;
      const generation = this.generation;
      const result = await this.notificationsService.markRead(userId, normalizedNotificationId, signal2);
      if (generation === this.generation && userId === this.activeUserIdRef()) {
        this.syncUnreadCount(result.unreadCount);
      }
      return result.notification;
    } finally {
      this.setMarkReadPending(normalizedNotificationId, false);
    }
  }
  async sync(request, signal2) {
    const userId = this.activeUserIdRef();
    if (!userId) {
      return {
        upserts: [],
        removedIds: [],
        total: 0,
        unreadCount: 0,
        muted: false
      };
    }
    const generation = this.generation;
    const contextRevision = this.pageContextRevision;
    const contextRequestSequence = ++this.pageContextRequestSequence;
    const result = await this.notificationsService.sync(userId, request, signal2);
    if (generation === this.generation && userId === this.activeUserIdRef() && contextRevision === this.pageContextRevision && contextRequestSequence === this.pageContextRequestSequence) {
      this.applySyncContext(result);
    }
    return result;
  }
  async setMuted(muted, signal2) {
    const userId = this.activeUserIdRef();
    if (!userId)
      throw new Error("Notification preferences could not be updated.");
    if (this.permissionActionPending())
      return this.muted();
    const generation = this.generation;
    try {
      this.permissionBusy.set(true);
      this.pageContextRevision += 1;
      const result = await this.notificationsService.setMuted(userId, muted === true, signal2);
      if (generation === this.generation && userId === this.activeUserIdRef()) {
        this.syncMuted(result.muted === true);
        this.attentionRequestedRef.set(false);
      }
      return result.muted === true;
    } finally {
      this.permissionBusy.set(false);
    }
  }
  pollIntervalMs() {
    return this.notificationsService.pollIntervalMs();
  }
  applyPageContext(page) {
    this.syncUnreadCount(page.context?.unreadCount ?? this.unreadCountRef());
    this.syncMuted(page.context?.muted === true);
  }
  applySyncContext(result) {
    this.syncUnreadCount(result.unreadCount);
    this.syncMuted(result.muted === true);
  }
  syncMuted(muted) {
    const nextMuted = muted === true;
    if (nextMuted !== this.mutedRef()) {
      this.pageContextRevision += 1;
      this.mutedRef.set(nextMuted);
      const userId = this.activeUserIdRef();
      if (userId) {
        this.userProfileStore.patchUserNotificationPreferences(userId, nextMuted);
      }
    }
    if (nextMuted) {
      this.attentionRequestedRef.set(false);
    }
  }
  syncUserModelCounter(count) {
    const userId = this.activeUserIdRef();
    if (!userId) {
      return;
    }
    this.activityStore.setUserCounterOverride(userId, "notifications", count);
    this.userProfileStore.patchUserActivityCounters(userId, { notifications: count });
  }
  setMarkReadPending(notificationId, pending) {
    const current = this.markReadPendingIdsRef();
    if (current.has(notificationId) === pending) {
      return;
    }
    const next = new Set(current);
    if (pending) {
      next.add(notificationId);
    } else {
      next.delete(notificationId);
    }
    this.markReadPendingIdsRef.set(next);
  }
  resetState() {
    this.generation += 1;
    this.pageContextRevision = 0;
    this.pageContextRequestSequence = 0;
    this.activeUserIdRef.set("");
    this.openRef.set(false);
    this.unreadCountRef.set(0);
    this.mutedRef.set(false);
    this.markReadPendingIdsRef.set(/* @__PURE__ */ new Set());
    this.attentionRequestedRef.set(false);
    this.dragPositionRef.set({ x: 0, y: 0 });
    this.bucketRef.set("new");
  }
  nonNegativeInteger(value) {
    return Math.max(0, Math.trunc(Number(value) || 0));
  }
  finiteCoordinate(value) {
    return Number.isFinite(Number(value)) ? Number(value) : 0;
  }
  static \u0275fac = function NotificationCenterStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NotificationCenterStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _NotificationCenterStore, factory: _NotificationCenterStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NotificationCenterStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  EventCheckoutDraftStore,
  ActivityInvitePopupStore,
  AssetAvailabilityPopupStore,
  EventSubeventsPopupStore,
  EventEditorPopupStore,
  EventCheckoutSlotPickerStore,
  NotificationCenterStore
};
//# sourceMappingURL=chunk-F5B73CZX.js.map
