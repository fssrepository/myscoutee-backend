import {
  Injectable,
  __spreadProps,
  __spreadValues,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-FMXFYYCS.js";

// src/app/shared/ui/context/stores/dialog.store.ts
var DialogStore = class _DialogStore {
  stateRef = signal(null, ...ngDevMode ? [{ debugName: "stateRef" }] : (
    /* istanbul ignore next */
    []
  ));
  nextId = 0;
  dialog = this.stateRef.asReadonly();
  open(config) {
    this.stateRef.set({
      id: ++this.nextId,
      title: config.title.trim() || "Confirmation",
      message: config.message?.trim() ?? "",
      warningMessage: config.warningMessage?.trim() ?? "",
      cancelLabel: config.cancelLabel === void 0 ? "Cancel" : config.cancelLabel,
      confirmLabel: config.confirmLabel?.trim() || "OK",
      busyConfirmLabel: config.busyConfirmLabel?.trim() || "Working...",
      confirmTone: config.confirmTone ?? "accent",
      confirmPalette: config.confirmPalette ?? null,
      allowBackdropClose: config.allowBackdropClose !== false,
      allowEscapeClose: config.allowEscapeClose !== false,
      showActions: config.showActions !== false,
      showClose: config.showClose === true,
      busy: false,
      errorMessage: "",
      failureMessage: config.failureMessage?.trim() || "Unable to complete this action.",
      ringPerimeter: Number.isFinite(Number(config.ringPerimeter)) ? Math.max(0, Number(config.ringPerimeter)) : 100,
      onConfirm: config.onConfirm ?? null,
      onCancel: config.onCancel ?? null
    });
  }
  openInfo(message, options = { title: "Notice" }) {
    this.open(__spreadProps(__spreadValues({}, options), {
      message,
      cancelLabel: null,
      confirmLabel: options.confirmLabel?.trim() || "OK"
    }));
  }
  openNotice(message, options = { title: "Notice" }) {
    this.open(__spreadProps(__spreadValues({}, options), {
      message,
      cancelLabel: null,
      showActions: false,
      showClose: true,
      onConfirm: null
    }));
  }
  cancel() {
    const state = this.stateRef();
    if (!state) {
      return;
    }
    this.stateRef.set(null);
    void state.onCancel?.();
  }
  async confirm() {
    const state = this.stateRef();
    if (!state || state.busy) {
      return;
    }
    if (!state.onConfirm) {
      this.stateRef.set(null);
      return;
    }
    const dialogId = state.id;
    this.stateRef.update((current) => current && current.id === dialogId ? __spreadProps(__spreadValues({}, current), { busy: true, errorMessage: "" }) : current);
    try {
      await Promise.resolve(state.onConfirm());
      if (this.stateRef()?.id === dialogId) {
        this.stateRef.set(null);
      }
    } catch (error) {
      if (this.stateRef()?.id !== dialogId) {
        return;
      }
      this.stateRef.update((current) => current && current.id === dialogId ? __spreadProps(__spreadValues({}, current), {
        busy: false,
        errorMessage: this.resolveErrorMessage(error, current.failureMessage)
      }) : current);
    }
  }
  close() {
    this.stateRef.set(null);
  }
  clearWarningMessage() {
    this.stateRef.update((current) => current ? __spreadProps(__spreadValues({}, current), { warningMessage: "" }) : current);
  }
  resolveErrorMessage(error, fallback) {
    if (typeof error === "string" && error.trim().length > 0) {
      return error.trim();
    }
    if (error instanceof Error && error.message.trim().length > 0) {
      return error.message.trim();
    }
    return fallback;
  }
  static \u0275fac = function DialogStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DialogStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _DialogStore, factory: _DialogStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DialogStore, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  DialogStore
};
//# sourceMappingURL=chunk-LWXWCSPP.js.map
