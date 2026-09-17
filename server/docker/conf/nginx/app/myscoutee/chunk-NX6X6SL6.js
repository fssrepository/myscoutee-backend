import {
  Injectable,
  __spreadProps,
  __spreadValues,
  computed,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-FMXFYYCS.js";

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

// src/app/shared/ui/context/stores/payment-methods-popup.store.ts
var PaymentMethodsPopupStore = class _PaymentMethodsPopupStore {
  openRef = signal(false, ...ngDevMode ? [{ debugName: "openRef" }] : (
    /* istanbul ignore next */
    []
  ));
  pickerRef = signal(null, ...ngDevMode ? [{ debugName: "pickerRef" }] : (
    /* istanbul ignore next */
    []
  ));
  componentRef = signal(null, ...ngDevMode ? [{ debugName: "componentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  isOpen = this.openRef.asReadonly();
  picker = this.pickerRef.asReadonly();
  selectedPaymentMethodId = computed(() => this.pickerRef()?.selectedPaymentMethodId ?? null, ...ngDevMode ? [{ debugName: "selectedPaymentMethodId" }] : (
    /* istanbul ignore next */
    []
  ));
  component = this.componentRef.asReadonly();
  async openHistory() {
    await this.ensureLoaded();
    this.pickerRef.set(null);
    this.openRef.set(true);
  }
  async openManage() {
    return this.openHistory();
  }
  async openPicker(request) {
    await this.ensureLoaded();
    this.pickerRef.set({
      selectedPaymentMethodId: `${request.selectedPaymentMethodId ?? ""}`.trim() || null,
      onSelect: request.onSelect
    });
    this.openRef.set(true);
  }
  close() {
    this.openRef.set(false);
    this.pickerRef.set(null);
  }
  togglePickerSelection(paymentMethodId) {
    const picker = this.pickerRef();
    const normalizedId = paymentMethodId.trim();
    if (!picker || !normalizedId)
      return;
    this.pickerRef.set(__spreadProps(__spreadValues({}, picker), {
      selectedPaymentMethodId: picker.selectedPaymentMethodId === normalizedId ? null : normalizedId
    }));
  }
  selectPickerPaymentMethod(paymentMethodId) {
    const picker = this.pickerRef();
    const normalizedId = paymentMethodId.trim();
    if (!picker || !normalizedId)
      return;
    this.pickerRef.set(__spreadProps(__spreadValues({}, picker), { selectedPaymentMethodId: normalizedId }));
  }
  confirm(paymentMethod) {
    const picker = this.pickerRef();
    if (!picker)
      return;
    picker.onSelect(__spreadValues({}, paymentMethod));
    this.close();
  }
  async ensureLoaded() {
    if (this.componentRef())
      return;
    const module = await import("./payment-methods-popup.component-AKW6Y6VX.js");
    this.componentRef.set(module.PaymentMethodsPopupComponent);
  }
  static \u0275fac = function PaymentMethodsPopupStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PaymentMethodsPopupStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PaymentMethodsPopupStore, factory: _PaymentMethodsPopupStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PaymentMethodsPopupStore, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  EventCheckoutDialogStore,
  PaymentMethodsPopupStore
};
//# sourceMappingURL=chunk-NX6X6SL6.js.map
