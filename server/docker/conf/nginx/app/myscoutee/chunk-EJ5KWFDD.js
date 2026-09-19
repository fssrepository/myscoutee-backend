import {
  Injectable,
  __spreadProps,
  __spreadValues,
  computed,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-EV3I3YNV.js";

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
    const module = await import("./payment-methods-popup.component-WVB6J3RB.js");
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
  PaymentMethodsPopupStore
};
//# sourceMappingURL=chunk-EJ5KWFDD.js.map
