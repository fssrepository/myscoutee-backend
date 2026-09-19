import {
  Injectable,
  __spreadValues,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-EV3I3YNV.js";

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
      paymentMethod: config.paymentMethod ? __spreadValues({}, config.paymentMethod) : null,
      paymentProvider: config.paymentProvider?.trim().toLowerCase() || "",
      paymentStatusLabel: config.paymentStatusLabel?.trim() || "",
      paymentStatusTone: config.paymentStatusTone === "success" || config.paymentStatusTone === "danger" || config.paymentStatusTone === "refund" ? config.paymentStatusTone : "neutral",
      paymentNote: config.paymentNote?.trim() || "",
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

export {
  EventCheckoutDialogStore
};
//# sourceMappingURL=chunk-4KZT4WAB.js.map
