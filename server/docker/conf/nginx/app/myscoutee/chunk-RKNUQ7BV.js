import {
  APP_STORAGE_KEYS
} from "./chunk-LERGHE7K.js";
import {
  Injectable,
  Subject,
  __spreadProps,
  __spreadValues,
  computed,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-XJL7SWH7.js";

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
    const module = await import("./event-editor-popup.component-CH7ERANP.js");
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

// src/app/shared/ui/context/stores/event-checkout-dialog.store.ts
var EventCheckoutDialogStore = class _EventCheckoutDialogStore {
  stateRef = signal(null, ...ngDevMode ? [{ debugName: "stateRef" }] : (
    /* istanbul ignore next */
    []
  ));
  nextId = 0;
  dialog = this.stateRef.asReadonly();
  open(config) {
    const trimmedUserId = config.userId.trim();
    if (!trimmedUserId) {
      return null;
    }
    const state = this.buildState(++this.nextId, config, trimmedUserId);
    this.stateRef.set(state);
    return state;
  }
  update(id, config) {
    const current = this.stateRef();
    const trimmedUserId = config.userId.trim();
    if (id == null || current?.id !== id || !trimmedUserId) {
      return null;
    }
    const state = this.buildState(current.id, config, trimmedUserId);
    this.stateRef.set(state);
    return state;
  }
  buildState(id, config, trimmedUserId) {
    return {
      id,
      mode: config.mode,
      userId: trimmedUserId,
      record: config.record,
      loading: config.loading === true,
      requiresApprovalBeforePayment: config.requiresApprovalBeforePayment === true,
      approvalGranted: config.approvalGranted === true,
      pendingReason: config.pendingReason === "waitlist" ? "waitlist" : config.pendingReason === "approval" ? "approval" : null,
      title: config.title?.trim() || (config.mode === "invitation" ? "Accept Invitation" : "Join Event"),
      subtitle: config.subtitle?.trim() || config.record.title,
      confirmLabel: config.confirmLabel?.trim() || "Confirm",
      busyConfirmLabel: config.busyConfirmLabel?.trim() || "Working...",
      allowBackdropClose: config.allowBackdropClose !== false,
      allowEscapeClose: config.allowEscapeClose !== false,
      readOnlySummary: config.readOnlySummary === true,
      hasPreloadedCheckoutBasket: Object.prototype.hasOwnProperty.call(config, "preloadedCheckoutBasket"),
      preloadedCheckoutBasket: config.preloadedCheckoutBasket ?? null,
      failureMessage: config.failureMessage?.trim() || "Unable to complete checkout.",
      onSubmit: config.onSubmit
    };
  }
  isCurrent(id) {
    return id != null && this.stateRef()?.id === id;
  }
  close() {
    this.stateRef.set(null);
  }
  static \u0275fac = function EventCheckoutDialogStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EventCheckoutDialogStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _EventCheckoutDialogStore, factory: _EventCheckoutDialogStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EventCheckoutDialogStore, [{
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
    const module = await import("./asset-availability-popup.component-3OGC2QSC.js");
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
    const module = await import("./asset-member-picker-popup.component-4QHM752O.js");
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
    const module = await import("./event-checkout-slot-picker-popup.component-UO745MVH.js");
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
  nonNegativeInteger(value) {
    const count = Number(value);
    return Number.isFinite(count) ? Math.max(0, Math.trunc(count)) : 0;
  }
  async ensureEventSubeventsListPopupLoaded() {
    if (this.eventSubeventsListPopupComponentRef()) {
      return;
    }
    const module = await import("./event-subevents-list-popup.component-WCIKP5VV.js");
    this.eventSubeventsListPopupComponentRef.set(module.EventSubeventsListPopupComponent);
  }
  async ensureEventTournamentGroupsPopupLoaded() {
    if (this.eventTournamentGroupsPopupComponentRef()) {
      return;
    }
    const module = await import("./event-tournament-groups-popup.component-KUW54PON.js");
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

export {
  EventCheckoutDraftStore,
  EventEditorPopupStore,
  EventCheckoutDialogStore,
  AssetAvailabilityPopupStore,
  ActivityInvitePopupStore,
  EventCheckoutSlotPickerStore,
  EventSubeventsPopupStore
};
//# sourceMappingURL=chunk-RKNUQ7BV.js.map
