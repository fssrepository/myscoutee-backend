import {
  Injectable,
  __spreadProps,
  __spreadValues,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-FMXFYYCS.js";

// src/app/shared/ui/components/core/form/flow/form-flow-popup.store.ts
var FormFlowPopupStore = class _FormFlowPopupStore {
  routeInputEditorRef = signal(null, ...ngDevMode ? [{ debugName: "routeInputEditorRef" }] : (
    /* istanbul ignore next */
    []
  ));
  pricingEditorPopupRef = signal(null, ...ngDevMode ? [{ debugName: "pricingEditorPopupRef" }] : (
    /* istanbul ignore next */
    []
  ));
  policyEditorPopupRef = signal(null, ...ngDevMode ? [{ debugName: "policyEditorPopupRef" }] : (
    /* istanbul ignore next */
    []
  ));
  routeInputEditorComponentRef = signal(null, ...ngDevMode ? [{ debugName: "routeInputEditorComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  routeInputEditorActionRequestRef = signal(null, ...ngDevMode ? [{ debugName: "routeInputEditorActionRequestRef" }] : (
    /* istanbul ignore next */
    []
  ));
  pricingEditorPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "pricingEditorPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  pricingEditorPopupActionRequestRef = signal(null, ...ngDevMode ? [{ debugName: "pricingEditorPopupActionRequestRef" }] : (
    /* istanbul ignore next */
    []
  ));
  policyEditorPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "policyEditorPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  policyEditorPopupActionRequestRef = signal(null, ...ngDevMode ? [{ debugName: "policyEditorPopupActionRequestRef" }] : (
    /* istanbul ignore next */
    []
  ));
  routeInputEditorActionSequence = 0;
  pricingEditorPopupActionSequence = 0;
  policyEditorPopupActionSequence = 0;
  routeInputEditorComponent = this.routeInputEditorComponentRef.asReadonly();
  routeInputEditorActionRequest = this.routeInputEditorActionRequestRef.asReadonly();
  pricingEditorPopupComponent = this.pricingEditorPopupComponentRef.asReadonly();
  pricingEditorPopupActionRequest = this.pricingEditorPopupActionRequestRef.asReadonly();
  policyEditorPopupComponent = this.policyEditorPopupComponentRef.asReadonly();
  policyEditorPopupActionRequest = this.policyEditorPopupActionRequestRef.asReadonly();
  openRouteInputEditor(editor) {
    this.routeInputEditorRef.set(this.cloneRouteInputEditor(editor));
  }
  updateRouteInputEditor(editor) {
    const current = this.routeInputEditorRef();
    if (current && current.ownerId !== editor.ownerId) {
      return;
    }
    this.routeInputEditorRef.set(this.cloneRouteInputEditor(editor));
  }
  closeRouteInputEditor(ownerId) {
    const current = this.routeInputEditorRef();
    if (ownerId && current?.ownerId !== ownerId) {
      return;
    }
    this.routeInputEditorRef.set(null);
  }
  openPricingEditorPopup(popup) {
    this.pricingEditorPopupRef.set(__spreadValues({}, popup));
  }
  updatePricingEditorPopup(popup) {
    const current = this.pricingEditorPopupRef();
    if (current && current.ownerId !== popup.ownerId) {
      return;
    }
    this.pricingEditorPopupRef.set(__spreadValues({}, popup));
  }
  closePricingEditorPopup(ownerId) {
    const current = this.pricingEditorPopupRef();
    if (ownerId && current?.ownerId !== ownerId) {
      return;
    }
    this.pricingEditorPopupRef.set(null);
  }
  openPolicyEditorPopup(popup) {
    this.policyEditorPopupRef.set(__spreadValues({}, popup));
  }
  updatePolicyEditorPopup(popup) {
    const current = this.policyEditorPopupRef();
    if (current && current.ownerId !== popup.ownerId) {
      return;
    }
    this.policyEditorPopupRef.set(__spreadValues({}, popup));
  }
  closePolicyEditorPopup(ownerId) {
    const current = this.policyEditorPopupRef();
    if (ownerId && current?.ownerId !== ownerId) {
      return;
    }
    this.policyEditorPopupRef.set(null);
  }
  requestRouteInputEditorClose(ownerId, event) {
    this.requestRouteInputEditorAction({ ownerId, kind: "close", event });
  }
  requestRouteInputEditorSave(ownerId, routes, routeRowIds, event) {
    this.requestRouteInputEditorAction({
      ownerId,
      kind: "save",
      routes: [...routes],
      routeRowIds: [...routeRowIds],
      event
    });
  }
  requestPricingEditorPopupClose(ownerId, event) {
    this.requestPricingEditorPopupAction({ ownerId, kind: "close", event });
  }
  requestPricingEditorPopupSave(ownerId, value, event) {
    this.requestPricingEditorPopupAction({ ownerId, kind: "save", value, event });
  }
  requestPolicyEditorPopupClose(ownerId, event) {
    this.requestPolicyEditorPopupAction({ ownerId, kind: "close", event });
  }
  requestPolicyEditorPopupSave(ownerId, value, event) {
    this.requestPolicyEditorPopupAction({ ownerId, kind: "save", value, event });
  }
  async ensureRouteInputEditorLoaded() {
    if (this.routeInputEditorComponentRef()) {
      return;
    }
    const module = await import("./route-input-popup.component-CYYKNETB.js");
    this.routeInputEditorComponentRef.set(module.RouteInputPopupComponent);
  }
  async ensurePricingEditorPopupLoaded() {
    if (this.pricingEditorPopupComponentRef()) {
      return;
    }
    const module = await import("./pricing-editor-popup.component-PPS2J7M2.js");
    this.pricingEditorPopupComponentRef.set(module.PricingEditorPopupComponent);
  }
  async ensurePolicyEditorPopupLoaded() {
    if (this.policyEditorPopupComponentRef()) {
      return;
    }
    const module = await import("./policies-input-popup.component-2VZ6E63I.js");
    this.policyEditorPopupComponentRef.set(module.PoliciesInputPopupComponent);
  }
  requestRouteInputEditorAction(request) {
    this.routeInputEditorActionSequence += 1;
    this.routeInputEditorActionRequestRef.set(__spreadProps(__spreadValues({}, request), {
      requestId: this.routeInputEditorActionSequence
    }));
  }
  requestPricingEditorPopupAction(request) {
    this.pricingEditorPopupActionSequence += 1;
    this.pricingEditorPopupActionRequestRef.set(__spreadProps(__spreadValues({}, request), {
      requestId: this.pricingEditorPopupActionSequence
    }));
  }
  requestPolicyEditorPopupAction(request) {
    this.policyEditorPopupActionSequence += 1;
    this.policyEditorPopupActionRequestRef.set(__spreadProps(__spreadValues({}, request), {
      requestId: this.policyEditorPopupActionSequence
    }));
  }
  cloneRouteInputEditor(editor) {
    return __spreadProps(__spreadValues({}, editor), {
      routes: [...editor.routes],
      routeRowIds: [...editor.routeRowIds]
    });
  }
  static \u0275fac = function FormFlowPopupStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FormFlowPopupStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _FormFlowPopupStore, factory: _FormFlowPopupStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormFlowPopupStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  FormFlowPopupStore
};
//# sourceMappingURL=chunk-QM6YAR3P.js.map
