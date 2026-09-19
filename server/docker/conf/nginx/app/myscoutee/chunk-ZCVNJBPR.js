import {
  Injectable,
  __spreadProps,
  __spreadValues,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-EV3I3YNV.js";

// src/app/shared/ui/context/stores/operator-menu.store.ts
var OperatorMenuStore = class _OperatorMenuStore {
  activePopupRef = signal(null, ...ngDevMode ? [{ debugName: "activePopupRef" }] : (
    /* istanbul ignore next */
    []
  ));
  selectedLeaderboardEntryRef = signal(null, ...ngDevMode ? [{ debugName: "selectedLeaderboardEntryRef" }] : (
    /* istanbul ignore next */
    []
  ));
  activePopup = this.activePopupRef.asReadonly();
  selectedLeaderboardEntry = this.selectedLeaderboardEntryRef.asReadonly();
  open(kind) {
    this.activePopupRef.set(kind);
  }
  openLeaderboardDeployments(entry) {
    const groupId = entry.operatorGroupId?.trim() ?? "";
    if (entry.group !== "CLAIMED" || !groupId) {
      return;
    }
    this.selectedLeaderboardEntryRef.set(structuredClone(__spreadProps(__spreadValues({}, entry), {
      operatorGroupId: groupId
    })));
    this.activePopupRef.set("deployments");
  }
  closePopup() {
    this.activePopupRef.set(null);
  }
  static \u0275fac = function OperatorMenuStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OperatorMenuStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _OperatorMenuStore, factory: _OperatorMenuStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OperatorMenuStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  OperatorMenuStore
};
//# sourceMappingURL=chunk-ZCVNJBPR.js.map
