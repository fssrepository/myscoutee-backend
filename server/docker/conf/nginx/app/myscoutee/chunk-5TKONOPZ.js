import {
  Injectable,
  __spreadValues,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-EV3I3YNV.js";

// src/app/shared/ui/context/stores/demo-bootstrap-selector.store.ts
var DemoBootstrapSelectorStore = class _DemoBootstrapSelectorStore {
  demoBootstrapSelectorRef = signal(null, ...ngDevMode ? [{ debugName: "demoBootstrapSelectorRef" }] : (
    /* istanbul ignore next */
    []
  ));
  demoBootstrapSelectorComponentRef = signal(null, ...ngDevMode ? [{ debugName: "demoBootstrapSelectorComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  demoBootstrapSelector = this.demoBootstrapSelectorRef.asReadonly();
  demoBootstrapSelectorComponent = this.demoBootstrapSelectorComponentRef.asReadonly();
  openDemoBootstrapSelector(payload) {
    void this.ensureDemoBootstrapSelectorLoaded();
    const mode = this.normalizeMode(payload.mode);
    const selectableModes = this.normalizeSelectableModes(payload.selectableModes, mode);
    this.demoBootstrapSelectorRef.set({
      updatedMs: Date.now(),
      mode,
      selectableModes,
      title: payload.title?.trim() || void 0,
      subtitle: payload.subtitle?.trim() || void 0,
      autoSelectUserId: payload.autoSelectUserId?.trim() || void 0,
      users: payload.users?.map((user) => __spreadValues({}, user)),
      onSelect: async (userId, selectedMode) => {
        const result = await payload.onSelect(userId, selectedMode);
        if (result !== false && typeof result !== "string") {
          this.closeDemoBootstrapSelector();
        }
        return result;
      },
      onNewProfile: payload.onNewProfile ? async () => {
        const accepted = await payload.onNewProfile?.();
        if (accepted !== false) {
          this.closeDemoBootstrapSelector();
        }
        return accepted !== false;
      } : void 0,
      onClose: () => {
        try {
          payload.onClose?.();
        } finally {
          this.closeDemoBootstrapSelector();
        }
      }
    });
  }
  closeDemoBootstrapSelector() {
    this.demoBootstrapSelectorRef.set(null);
  }
  normalizeSelectableModes(selectableModes, fallbackMode) {
    const modes = (selectableModes ?? [fallbackMode]).map((mode) => this.normalizeMode(mode));
    const uniqueModes = [...new Set(modes)];
    return uniqueModes.includes(fallbackMode) ? uniqueModes : [fallbackMode, ...uniqueModes];
  }
  normalizeMode(mode) {
    return mode === "admin" || mode === "operator" ? mode : "member";
  }
  async ensureDemoBootstrapSelectorLoaded() {
    if (this.demoBootstrapSelectorComponentRef()) {
      return;
    }
    const module = await import("./demo-bootstrap-selector.component-UCF6T2N2.js");
    this.demoBootstrapSelectorComponentRef.set(module.DemoBootstrapSelectorComponent);
  }
  static \u0275fac = function DemoBootstrapSelectorStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DemoBootstrapSelectorStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _DemoBootstrapSelectorStore, factory: _DemoBootstrapSelectorStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DemoBootstrapSelectorStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  DemoBootstrapSelectorStore
};
//# sourceMappingURL=chunk-5TKONOPZ.js.map
