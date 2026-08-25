import {
  Injectable,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-XJL7SWH7.js";

// src/app/shared/ui/context/stores/member-menu.store.ts
var MemberMenuStore = class _MemberMenuStore {
  navigatorActivitiesRequestRef = signal(null, ...ngDevMode ? [{ debugName: "navigatorActivitiesRequestRef" }] : (
    /* istanbul ignore next */
    []
  ));
  navigatorAssetRequestRef = signal(null, ...ngDevMode ? [{ debugName: "navigatorAssetRequestRef" }] : (
    /* istanbul ignore next */
    []
  ));
  navigatorEventFeedbackRequestRef = signal(null, ...ngDevMode ? [{ debugName: "navigatorEventFeedbackRequestRef" }] : (
    /* istanbul ignore next */
    []
  ));
  activitiesNavigationRequestRef = signal(null, ...ngDevMode ? [{ debugName: "activitiesNavigationRequestRef" }] : (
    /* istanbul ignore next */
    []
  ));
  navigatorActivitiesRequest = this.navigatorActivitiesRequestRef.asReadonly();
  navigatorAssetRequest = this.navigatorAssetRequestRef.asReadonly();
  navigatorEventFeedbackRequest = this.navigatorEventFeedbackRequestRef.asReadonly();
  activitiesNavigationRequest = this.activitiesNavigationRequestRef.asReadonly();
  openNavigatorActivitiesRequest(primaryFilter, eventScope, options = {}) {
    this.navigatorActivitiesRequestRef.set({
      updatedMs: Date.now(),
      primaryFilter,
      eventScope,
      adminServiceOnly: options.adminServiceOnly === true
    });
  }
  clearNavigatorActivitiesRequest() {
    this.navigatorActivitiesRequestRef.set(null);
  }
  openNavigatorAssetRequest(assetFilter) {
    this.navigatorAssetRequestRef.set({
      updatedMs: Date.now(),
      assetFilter
    });
  }
  clearNavigatorAssetRequest() {
    this.navigatorAssetRequestRef.set(null);
  }
  openNavigatorEventFeedbackRequest() {
    this.navigatorEventFeedbackRequestRef.set({
      updatedMs: Date.now()
    });
  }
  clearNavigatorEventFeedbackRequest() {
    this.navigatorEventFeedbackRequestRef.set(null);
  }
  requestActivitiesNavigation(request) {
    this.activitiesNavigationRequestRef.set(request);
  }
  clearActivitiesNavigationRequest() {
    this.activitiesNavigationRequestRef.set(null);
  }
  static \u0275fac = function MemberMenuStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MemberMenuStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _MemberMenuStore, factory: _MemberMenuStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MemberMenuStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  MemberMenuStore
};
//# sourceMappingURL=chunk-KQF6FQ63.js.map
