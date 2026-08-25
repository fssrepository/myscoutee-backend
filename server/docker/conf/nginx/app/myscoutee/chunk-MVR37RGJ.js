import {
  Injectable,
  computed,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-XJL7SWH7.js";

// src/app/shared/ui/context/stores/popup-presence.store.ts
var PopupPresenceStore = class _PopupPresenceStore {
  activeTokensRef = signal(/* @__PURE__ */ new Set(), ...ngDevMode ? [{ debugName: "activeTokensRef" }] : (
    /* istanbul ignore next */
    []
  ));
  visible = computed(() => this.activeTokensRef().size > 0, ...ngDevMode ? [{ debugName: "visible" }] : (
    /* istanbul ignore next */
    []
  ));
  register() {
    const token = /* @__PURE__ */ Symbol("app-popup");
    this.activeTokensRef.update((current) => {
      const next = new Set(current);
      next.add(token);
      return next;
    });
    return token;
  }
  unregister(token) {
    this.activeTokensRef.update((current) => {
      if (!current.has(token)) {
        return current;
      }
      const next = new Set(current);
      next.delete(token);
      return next;
    });
  }
  static \u0275fac = function PopupPresenceStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PopupPresenceStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PopupPresenceStore, factory: _PopupPresenceStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PopupPresenceStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  PopupPresenceStore
};
//# sourceMappingURL=chunk-MVR37RGJ.js.map
