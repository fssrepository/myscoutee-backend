import {
  Injectable,
  __spreadProps,
  __spreadValues,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-FMXFYYCS.js";

// src/app/activity/components/event-checkout-popup/event-promo-code-popup/event-promo-code-popup.store.ts
var EventPromoCodePopupStore = class _EventPromoCodePopupStore {
  addPopupRef = signal(null, ...ngDevMode ? [{ debugName: "addPopupRef" }] : (
    /* istanbul ignore next */
    []
  ));
  addPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "addPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  addPopupLoadingRef = signal(false, ...ngDevMode ? [{ debugName: "addPopupLoadingRef" }] : (
    /* istanbul ignore next */
    []
  ));
  addPopupActionRequestRef = signal(null, ...ngDevMode ? [{ debugName: "addPopupActionRequestRef" }] : (
    /* istanbul ignore next */
    []
  ));
  addPopupActionSequence = 0;
  addPopupLoadPromise = null;
  addPopup = this.addPopupRef.asReadonly();
  addPopupComponent = this.addPopupComponentRef.asReadonly();
  addPopupLoading = this.addPopupLoadingRef.asReadonly();
  addPopupActionRequest = this.addPopupActionRequestRef.asReadonly();
  openAddPopup(popup) {
    this.addPopupRef.set(this.clonePopup(popup));
  }
  updateAddPopup(popup) {
    const current = this.addPopupRef();
    if (current && current.ownerId !== popup.ownerId) {
      return;
    }
    this.addPopupRef.set(this.clonePopup(popup));
  }
  closeAddPopup(ownerId) {
    const current = this.addPopupRef();
    if (ownerId && current?.ownerId !== ownerId) {
      return;
    }
    this.addPopupRef.set(null);
  }
  requestAddPopupClose(ownerId, event) {
    this.requestAddPopupAction({ ownerId, kind: "close", event });
  }
  requestAddPopupVerification(ownerId, code, event) {
    this.requestAddPopupAction({ ownerId, kind: "verify", code, event });
  }
  async ensureAddPopupLoaded() {
    if (this.addPopupComponentRef()) {
      return;
    }
    if (this.addPopupLoadPromise) {
      return this.addPopupLoadPromise;
    }
    this.addPopupLoadingRef.set(true);
    const loadPromise = import("./event-promo-code-add-popup.component-T5G46DNN.js").then((module) => {
      this.addPopupComponentRef.set(module.EventPromoCodeAddPopupComponent);
    }).finally(() => {
      this.addPopupLoadingRef.set(false);
      this.addPopupLoadPromise = null;
    });
    this.addPopupLoadPromise = loadPromise;
    return loadPromise;
  }
  requestAddPopupAction(request) {
    this.addPopupActionSequence += 1;
    this.addPopupActionRequestRef.set(__spreadProps(__spreadValues({}, request), {
      requestId: this.addPopupActionSequence
    }));
  }
  clonePopup(popup) {
    return __spreadProps(__spreadValues({}, popup), {
      appliedPromoCodes: [...popup.appliedPromoCodes]
    });
  }
  static \u0275fac = function EventPromoCodePopupStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EventPromoCodePopupStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _EventPromoCodePopupStore, factory: _EventPromoCodePopupStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EventPromoCodePopupStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  EventPromoCodePopupStore
};
//# sourceMappingURL=chunk-SCP4YCCD.js.map
