import {
  Injectable,
  Subject,
  __spreadProps,
  __spreadValues,
  computed,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-EV3I3YNV.js";

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
    const module = await import("./asset-member-picker-popup.component-ERMH6GOA.js");
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
    const module = await import("./event-editor-popup.component-FOJU3UXZ.js");
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

export {
  ActivityInvitePopupStore,
  EventEditorPopupStore
};
//# sourceMappingURL=chunk-SO4H7EEV.js.map
