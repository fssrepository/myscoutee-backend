import {
  APP_STORAGE_KEYS
} from "./chunk-LDZENZ35.js";
import {
  Injectable,
  __spreadProps,
  __spreadValues,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-EV3I3YNV.js";

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
    const module = await import("./event-checkout-slot-picker-popup.component-D2Z7LJM4.js");
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
    const module = await import("./asset-availability-popup.component-FRGZBJJP.js");
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

export {
  EventCheckoutDraftStore,
  EventCheckoutSlotPickerStore,
  AssetAvailabilityPopupStore
};
//# sourceMappingURL=chunk-ANPH33ME.js.map
