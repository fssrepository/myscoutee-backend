import "./chunk-GNEKNDCW.js";
import "./chunk-WYVDSPFZ.js";
import "./chunk-7OVYX4QT.js";
import "./chunk-SYKOEE4K.js";
import "./chunk-IJVUZ62I.js";
import "./chunk-D742Q5CX.js";
import "./chunk-2K5TOPNO.js";
import "./chunk-4YDRPLS7.js";
import "./chunk-H3IGIWEC.js";
import "./chunk-WFNQJ567.js";
import "./chunk-VNTNCRGK.js";
import "./chunk-RJSPRCFL.js";
import "./chunk-BEAS7CFC.js";
import "./chunk-EGWJQCT5.js";
import "./chunk-YTMD6HU4.js";
import "./chunk-4VYYFWRA.js";
import {
  LazyBgImageDirective
} from "./chunk-QEZI4ZBE.js";
import "./chunk-LTMPUKCR.js";
import "./chunk-5EHS4ACX.js";
import {
  PopupComponent
} from "./chunk-3VXLUVWM.js";
import "./chunk-VEYRCVMX.js";
import "./chunk-MVR37RGJ.js";
import {
  IndicatorComponent
} from "./chunk-FOAFZS65.js";
import "./chunk-OAYWPJGG.js";
import "./chunk-6TR3Z2F3.js";
import "./chunk-U46O4F4Y.js";
import "./chunk-EDHGCWPF.js";
import {
  DomSanitizer
} from "./chunk-CUDLB52K.js";
import {
  AdminMenuStore
} from "./chunk-ZJ74HL3J.js";
import {
  AdminAffinityGraphService
} from "./chunk-FJQMGJUW.js";
import "./chunk-HUL5TV72.js";
import "./chunk-PK4DOAMC.js";
import {
  AppRuntimeStore
} from "./chunk-GEAUBJJD.js";
import "./chunk-5PHTFUHA.js";
import "./chunk-F4WY6ECV.js";
import "./chunk-Q3344WPR.js";
import "./chunk-XQ4NDAVX.js";
import "./chunk-4FWVIYNI.js";
import "./chunk-7MTG4XZU.js";
import {
  CommonModule
} from "./chunk-J7IJFFQ2.js";
import "./chunk-XQACYBVS.js";
import "./chunk-YKC4KBEC.js";
import "./chunk-B2DKYQGD.js";
import {
  UserProfileStore
} from "./chunk-KLUOB5SD.js";
import "./chunk-6POEHVT7.js";
import "./chunk-2ENBQWLU.js";
import "./chunk-LERGHE7K.js";
import "./chunk-D6ZHKNYF.js";
import "./chunk-SKAK727J.js";
import {
  Component,
  DOCUMENT,
  __spreadProps,
  __spreadValues,
  computed,
  effect,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeResourceUrl,
  ɵɵtext
} from "./chunk-XJL7SWH7.js";

// src/app/admin/components/affinity-graph-popup/admin-affinity-graph-popup.component.ts
function AdminAffinityGraphPopupComponent_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "iframe", 4);
    \u0275\u0275listener("load", function AdminAffinityGraphPopupComponent_Conditional_0_Conditional_1_Template_iframe_load_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onGraphFrameLoad());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("src", ctx, \u0275\u0275sanitizeResourceUrl);
  }
}
function AdminAffinityGraphPopupComponent_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5)(1, "section", 6)(2, "header", 7)(3, "h1");
    \u0275\u0275text(4, "Affinity graph");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 8);
    \u0275\u0275text(6, "Reset");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(7, "aside", 9)(8, "div", 10)(9, "span");
    \u0275\u0275element(10, "i", 11);
    \u0275\u0275text(11, "Women");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span");
    \u0275\u0275element(13, "i", 12);
    \u0275\u0275text(14, "Men");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div", 13)(16, "div", 14)(17, "div", 15)(18, "span", 16);
    \u0275\u0275element(19, "i");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "strong");
    \u0275\u0275text(21, "Mouse");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "p")(23, "b");
    \u0275\u0275text(24, "Pan");
    \u0275\u0275elementEnd();
    \u0275\u0275text(25, " left ");
    \u0275\u0275elementStart(26, "b");
    \u0275\u0275text(27, "Rotate");
    \u0275\u0275elementEnd();
    \u0275\u0275text(28, " right ");
    \u0275\u0275elementStart(29, "b");
    \u0275\u0275text(30, "Zoom");
    \u0275\u0275elementEnd();
    \u0275\u0275text(31, " wheel");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(32, "div", 14)(33, "div", 15)(34, "span", 17)(35, "i");
    \u0275\u0275text(36, "\u2191");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "i");
    \u0275\u0275text(38, "\u2190");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "i");
    \u0275\u0275text(40, "\u2193");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "i");
    \u0275\u0275text(42, "\u2192");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(43, "strong");
    \u0275\u0275text(44, "Arrow pad");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(45, "p")(46, "b");
    \u0275\u0275text(47, "Pan");
    \u0275\u0275elementEnd();
    \u0275\u0275text(48, " step");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("affinity-graph-static-stack--leaving", ctx_r1.graphFrameLoaded());
  }
}
function AdminAffinityGraphPopupComponent_Conditional_0_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-indicator", 18);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("state", ctx_r1.graphProgressState(true));
  }
}
function AdminAffinityGraphPopupComponent_Conditional_0_Conditional_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-indicator", 19);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("state", ctx_r1.graphProgressState(false))("position", ctx_r1.graphZoomProgress());
  }
}
function AdminAffinityGraphPopupComponent_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3);
    \u0275\u0275conditionalCreate(1, AdminAffinityGraphPopupComponent_Conditional_0_Conditional_3_Conditional_1_Template, 1, 1, "app-indicator", 18)(2, AdminAffinityGraphPopupComponent_Conditional_0_Conditional_3_Conditional_2_Template, 1, 2, "app-indicator", 19);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.graphDataLoading() ? 1 : 2);
  }
}
function AdminAffinityGraphPopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-popup", 0);
    \u0275\u0275conditionalCreate(1, AdminAffinityGraphPopupComponent_Conditional_0_Conditional_1_Template, 1, 1, "iframe", 1);
    \u0275\u0275conditionalCreate(2, AdminAffinityGraphPopupComponent_Conditional_0_Conditional_2_Template, 49, 2, "div", 2);
    \u0275\u0275conditionalCreate(3, AdminAffinityGraphPopupComponent_Conditional_0_Conditional_3_Template, 3, 1, "div", 3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.affinityGraphPopupModel());
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_2_0 = ctx_r1.graphUrl()) ? 1 : -1, tmp_2_0);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.graphStaticChromeVisible() ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.graphProgressVisible() ? 3 : -1);
  }
}
var AdminAffinityGraphPopupComponent = class _AdminAffinityGraphPopupComponent {
  admin = inject(AdminMenuStore);
  userProfileStore = inject(UserProfileStore);
  runtimeStore = inject(AppRuntimeStore);
  graphUrl = signal(null, ...ngDevMode ? [{ debugName: "graphUrl" }] : (
    /* istanbul ignore next */
    []
  ));
  popupKey = "affinity-graph";
  document = inject(DOCUMENT);
  affinityGraph = inject(AdminAffinityGraphService);
  sanitizer = inject(DomSanitizer);
  originalBodyOverflow = this.document.body.style.overflow;
  originalHtmlOverflow = this.document.documentElement.style.overflow;
  graphMessageHandler = (event) => this.handleGraphMessage(event);
  graphZoomProgress = signal(0, ...ngDevMode ? [{ debugName: "graphZoomProgress" }] : (
    /* istanbul ignore next */
    []
  ));
  graphFrameLoaded = signal(false, ...ngDevMode ? [{ debugName: "graphFrameLoaded" }] : (
    /* istanbul ignore next */
    []
  ));
  graphStaticShellVisible = signal(false, ...ngDevMode ? [{ debugName: "graphStaticShellVisible" }] : (
    /* istanbul ignore next */
    []
  ));
  graphStaticChromeVisible = computed(() => this.admin.activePopup() === this.popupKey && this.graphStaticShellVisible(), ...ngDevMode ? [{ debugName: "graphStaticChromeVisible" }] : (
    /* istanbul ignore next */
    []
  ));
  graphProgressVisible = computed(() => this.admin.activePopup() === this.popupKey, ...ngDevMode ? [{ debugName: "graphProgressVisible" }] : (
    /* istanbul ignore next */
    []
  ));
  graphDataLoading = signal(false, ...ngDevMode ? [{ debugName: "graphDataLoading" }] : (
    /* istanbul ignore next */
    []
  ));
  graphStaticShellHideTimer = null;
  graphOpenRequestId = 0;
  graphLoadingCounter = 0;
  graphRequestControllers = /* @__PURE__ */ new Map();
  constructor() {
    this.document.defaultView?.addEventListener("message", this.graphMessageHandler);
    effect(() => {
      const shouldLockScroll = this.admin.activePopup() === this.popupKey;
      this.document.body.style.overflow = shouldLockScroll ? "hidden" : this.originalBodyOverflow;
      this.document.documentElement.style.overflow = shouldLockScroll ? "hidden" : this.originalHtmlOverflow;
      if (shouldLockScroll) {
        queueMicrotask(() => this.prepareGraphFrame());
      } else {
        this.graphOpenRequestId += 1;
        this.abortGraphRequests();
        this.graphZoomProgress.set(0);
        this.graphFrameLoaded.set(false);
        this.graphStaticShellVisible.set(false);
        this.clearGraphStaticShellHideTimer();
        queueMicrotask(() => this.graphUrl.set(null));
      }
    });
  }
  ngOnDestroy() {
    this.clearGraphStaticShellHideTimer();
    this.abortGraphRequests();
    this.document.defaultView?.removeEventListener("message", this.graphMessageHandler);
    this.document.body.style.overflow = this.originalBodyOverflow;
    this.document.documentElement.style.overflow = this.originalHtmlOverflow;
  }
  close() {
    this.admin.closePopup();
  }
  affinityGraphPopupModel() {
    return {
      ariaLabel: "Affinity graph view",
      closeAriaLabel: "Close affinity graph",
      showHeader: false,
      showClose: true,
      size: "fullscreen",
      bodyLayout: "flush",
      backdropTone: "dim",
      onClose: () => this.close()
    };
  }
  onGraphFrameLoad() {
    this.graphFrameLoaded.set(true);
    this.clearGraphStaticShellHideTimer();
    this.graphStaticShellHideTimer = setTimeout(() => {
      this.graphStaticShellVisible.set(false);
      this.graphStaticShellHideTimer = null;
    }, 220);
  }
  prepareGraphFrame() {
    if (this.admin.activePopup() !== this.popupKey) {
      return;
    }
    this.graphOpenRequestId += 1;
    this.clearGraphStaticShellHideTimer();
    this.graphFrameLoaded.set(false);
    this.graphStaticShellVisible.set(true);
    this.graphUrl.set(null);
    const params = new URLSearchParams({
      v: Date.now().toString()
    });
    this.graphUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(`assets/admin/affinity-graph/index.html?${params.toString()}`));
  }
  handleGraphMessage(event) {
    const win = this.document.defaultView;
    if (!win || event.origin !== win.location.origin || this.admin.activePopup() !== this.popupKey) {
      return;
    }
    const data = event.data;
    if (data?.source !== "admin-affinity-graph") {
      return;
    }
    if (data.type === "state") {
      this.graphZoomProgress.set(this.clampUnit(data.zoomProgress));
      return;
    }
    if (data.type === "cancel" && data.requestId) {
      this.cancelGraphRequest(data.requestId);
      return;
    }
    if (data.type !== "request" || !data.requestId || !data.method) {
      return;
    }
    const target = event.source;
    if (!target) {
      return;
    }
    const requestId = data.requestId;
    const controller = new AbortController();
    this.graphRequestControllers.set(requestId, controller);
    void this.resolveGraphRequest(data.method, data.params ?? {}, controller.signal).then((result) => {
      if (controller.signal.aborted) {
        return;
      }
      target.postMessage({
        source: "admin-affinity-graph",
        type: "response",
        requestId,
        ok: true,
        result
      }, win.location.origin);
    }).catch((error) => {
      if (controller.signal.aborted || this.isAbortError(error)) {
        return;
      }
      target.postMessage({
        source: "admin-affinity-graph",
        type: "response",
        requestId,
        ok: false,
        error: error instanceof Error ? error.message : "Affinity graph request failed."
      }, win.location.origin);
    }).finally(() => this.graphRequestControllers.delete(requestId));
  }
  resolveGraphRequest(method, params, signal2) {
    const adminUserId = this.userProfileStore.activeUserId().trim();
    switch (method) {
      case "initialGraph":
        return this.withGraphDataLoading(() => this.affinityGraph.loadInitialGraph(adminUserId, signal2));
      case "meta":
        return this.withGraphDataLoading(() => this.affinityGraph.loadMeta(adminUserId, this.rangeParams(params), signal2));
      case "forests":
        return this.withGraphDataLoading(() => this.affinityGraph.loadForests(adminUserId, this.forestParams(params), signal2));
      case "tile":
        return this.withGraphDataLoading(() => this.affinityGraph.loadTile(adminUserId, __spreadProps(__spreadValues({}, this.rangeParams(params)), {
          layoutVersion: this.optionalString(params["layoutVersion"]),
          componentId: this.optionalString(params["componentId"]),
          z: this.optionalNumber(params["z"]),
          x: this.optionalNumber(params["x"]),
          y: this.optionalNumber(params["y"])
        }), signal2));
      case "neighborhood":
        return this.withGraphDataLoading(() => this.affinityGraph.loadNeighborhood(this.optionalString(params["userId"]) ?? "", this.optionalNumber(params["depth"]), adminUserId, this.rangeParams(params), signal2));
      case "lazyImage":
        return this.loadLazyImage(params, signal2);
      default:
        return Promise.reject(new Error(`Unsupported affinity graph request: ${method}`));
    }
  }
  async loadLazyImage(params, signal2) {
    this.throwIfAborted(signal2);
    const imageUrl = this.optionalString(params["imageUrl"]) ?? "";
    const loaded = await LazyBgImageDirective.preloadImageUrl(imageUrl);
    this.throwIfAborted(signal2);
    return {
      imageUrl,
      loaded
    };
  }
  async withGraphDataLoading(work) {
    this.beginGraphDataLoading();
    try {
      return await work();
    } finally {
      this.endGraphDataLoading();
    }
  }
  graphProgressState(loading) {
    if (!this.runtimeStore.isOnline()) {
      return "inactive";
    }
    return loading ? "loading" : "scrolling";
  }
  beginGraphDataLoading() {
    this.graphLoadingCounter += 1;
    this.graphDataLoading.set(true);
  }
  endGraphDataLoading() {
    this.graphLoadingCounter = Math.max(0, this.graphLoadingCounter - 1);
    if (this.graphLoadingCounter === 0) {
      this.graphDataLoading.set(false);
    }
  }
  cancelGraphRequest(requestId) {
    const controller = this.graphRequestControllers.get(requestId);
    if (!controller) {
      return;
    }
    controller.abort();
    this.graphRequestControllers.delete(requestId);
  }
  abortGraphRequests() {
    for (const controller of this.graphRequestControllers.values()) {
      controller.abort();
    }
    this.graphRequestControllers.clear();
  }
  throwIfAborted(signal2) {
    if (signal2?.aborted) {
      const error = new Error("Affinity graph request aborted.");
      error.name = "AbortError";
      throw error;
    }
  }
  isAbortError(error) {
    return error instanceof Error && error.name === "AbortError";
  }
  rangeParams(params) {
    return {
      minWeight: this.optionalNumber(params["minWeight"]),
      maxWeight: this.optionalNumber(params["maxWeight"])
    };
  }
  forestParams(params) {
    return __spreadProps(__spreadValues({}, this.rangeParams(params)), {
      forestLevel: this.optionalNumber(params["forestLevel"]),
      limit: this.optionalNumber(params["limit"]),
      offset: this.optionalNumber(params["offset"])
    });
  }
  optionalString(value) {
    const normalized = `${value ?? ""}`.trim();
    return normalized || void 0;
  }
  optionalNumber(value) {
    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : void 0;
  }
  clampUnit(value) {
    const numberValue = Number(value);
    if (!Number.isFinite(numberValue)) {
      return 0;
    }
    return Math.max(0, Math.min(1, numberValue));
  }
  clearGraphStaticShellHideTimer() {
    if (!this.graphStaticShellHideTimer) {
      return;
    }
    clearTimeout(this.graphStaticShellHideTimer);
    this.graphStaticShellHideTimer = null;
  }
  static \u0275fac = function AdminAffinityGraphPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminAffinityGraphPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminAffinityGraphPopupComponent, selectors: [["app-admin-affinity-graph-popup"]], decls: 1, vars: 1, consts: [[1, "affinity-graph-popup", 3, "model"], ["title", "Affinity graph view", 1, "affinity-graph-frame", 3, "src"], [1, "affinity-graph-static-stack", 3, "affinity-graph-static-stack--leaving"], [1, "affinity-graph-progress-shell"], ["title", "Affinity graph view", 1, "affinity-graph-frame", 3, "load", "src"], [1, "affinity-graph-static-stack"], ["aria-label", "Graph controls", 1, "affinity-graph-static-panel"], [1, "affinity-graph-static-header"], ["type", "button", "tabindex", "-1", 1, "affinity-graph-static-reset"], ["aria-label", "Graph legend", 1, "affinity-graph-static-help"], [1, "affinity-graph-static-legend"], [1, "affinity-graph-static-dot", "affinity-graph-static-dot--woman"], [1, "affinity-graph-static-dot", "affinity-graph-static-dot--man"], [1, "affinity-graph-static-actions"], [1, "affinity-graph-static-card"], [1, "affinity-graph-static-card-title"], ["aria-hidden", "true", 1, "affinity-graph-static-mouse"], ["aria-hidden", "true", 1, "affinity-graph-static-arrows"], ["kind", "bar", "placement", "inline", 3, "state"], ["kind", "bar", "placement", "inline", 3, "state", "position"]], template: function AdminAffinityGraphPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, AdminAffinityGraphPopupComponent_Conditional_0_Template, 4, 4, "app-popup", 0);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.admin.activePopup() === ctx.popupKey ? 0 : -1);
    }
  }, dependencies: [CommonModule, IndicatorComponent, PopupComponent], styles: ['\n[_nghost-%COMP%] {\n  display: contents;\n}\n.affinity-graph-frame[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 100%;\n  min-height: 100%;\n  border: 0;\n  background: #111317;\n}\n.affinity-graph-static-stack[_ngcontent-%COMP%] {\n  position: absolute;\n  z-index: 6;\n  top: 10px;\n  right: 10px;\n  bottom: 10px;\n  width: min(390px, 100vw - 20px);\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  opacity: 1;\n  pointer-events: none;\n  transition: opacity 180ms ease;\n}\n.affinity-graph-static-stack[_ngcontent-%COMP%], \n.affinity-graph-static-stack[_ngcontent-%COMP%]   *[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n}\n.affinity-graph-static-stack--leaving[_ngcontent-%COMP%] {\n  opacity: 0;\n}\n.affinity-graph-static-panel[_ngcontent-%COMP%] {\n  min-width: 0;\n  width: 100%;\n  padding: 15px;\n  border: 1px solid rgba(255, 255, 255, 0.52);\n  border-radius: 8px;\n  color: #15191f;\n  background: rgba(250, 249, 243, 0.92);\n  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.22);\n  -webkit-backdrop-filter: blur(18px) saturate(1.12);\n  backdrop-filter: blur(18px) saturate(1.12);\n}\n.affinity-graph-static-header[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 12px;\n  padding-bottom: 9px;\n}\n.affinity-graph-static-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  min-width: 0;\n  margin: 0;\n  font-size: 1.1rem;\n  line-height: 1.1;\n  font-weight: 850;\n  letter-spacing: 0;\n}\n.affinity-graph-static-reset[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  min-height: 30px;\n  margin: 0;\n  padding: 0 12px;\n  border: 1px solid rgba(21, 25, 31, 0.18);\n  border-radius: 8px;\n  color: #111317;\n  background: #ffffff;\n  font-size: 0.78rem;\n  font-weight: 850;\n}\n.affinity-graph-static-help[_ngcontent-%COMP%] {\n  min-width: 0;\n  width: 100%;\n  margin-top: auto;\n  padding: 15px;\n  border: 1px solid rgba(255, 255, 255, 0.34);\n  border-radius: 8px;\n  color: rgba(245, 248, 250, 0.9);\n  background: rgba(17, 19, 23, 0.52);\n  box-shadow: 0 16px 42px rgba(0, 0, 0, 0.24);\n  -webkit-backdrop-filter: blur(14px) saturate(1.08);\n  backdrop-filter: blur(14px) saturate(1.08);\n}\n.affinity-graph-static-legend[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 18px;\n}\n.affinity-graph-static-legend[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 7px;\n  min-height: 18px;\n  color: rgba(245, 248, 250, 0.82);\n  font-size: 0.8rem;\n  font-weight: 780;\n}\n.affinity-graph-static-dot[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  width: 12px;\n  height: 12px;\n  border: 2px solid rgba(255, 255, 255, 0.72);\n  border-radius: 50%;\n  box-shadow: 0 0 12px rgba(255, 255, 255, 0.16);\n}\n.affinity-graph-static-dot--woman[_ngcontent-%COMP%] {\n  background: #ff4f6f;\n}\n.affinity-graph-static-dot--man[_ngcontent-%COMP%] {\n  background: #4aa8ff;\n}\n.affinity-graph-static-actions[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 10px;\n  margin-top: 12px;\n  padding-top: 12px;\n  border-top: 1px solid rgba(255, 255, 255, 0.12);\n}\n.affinity-graph-static-card[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding: 11px 12px;\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 8px;\n  background: rgba(255, 255, 255, 0.045);\n  text-align: center;\n}\n.affinity-graph-static-card-title[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 12px;\n  color: rgba(245, 248, 250, 0.86);\n  font-size: 0.84rem;\n  font-weight: 820;\n  white-space: nowrap;\n}\n.affinity-graph-static-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 8px 0 0;\n  color: rgba(245, 248, 250, 0.58);\n  font-size: 0.76rem;\n  line-height: 1.15;\n}\n.affinity-graph-static-card[_ngcontent-%COMP%]   b[_ngcontent-%COMP%] {\n  color: rgba(245, 248, 250, 0.82);\n  font-weight: 820;\n}\n.affinity-graph-static-mouse[_ngcontent-%COMP%] {\n  position: relative;\n  flex: 0 0 auto;\n  width: 26px;\n  height: 38px;\n  display: block;\n  border: 2px solid rgba(245, 248, 250, 0.78);\n  border-radius: 16px 16px 18px 18px;\n  background: linear-gradient(rgba(245, 248, 250, 0.28), rgba(245, 248, 250, 0.28)) center 22px/20px 1px no-repeat;\n}\n.affinity-graph-static-mouse[_ngcontent-%COMP%]::before, \n.affinity-graph-static-mouse[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  top: 5px;\n  width: 7px;\n  height: 10px;\n  background: rgba(245, 248, 250, 0.86);\n  z-index: 1;\n}\n.affinity-graph-static-mouse[_ngcontent-%COMP%]::before {\n  left: 5px;\n  border-radius: 10px 2px 2px 2px;\n}\n.affinity-graph-static-mouse[_ngcontent-%COMP%]::after {\n  right: 5px;\n  border-radius: 2px 10px 2px 2px;\n}\n.affinity-graph-static-mouse[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 50%;\n  top: 8px;\n  width: 6px;\n  height: 12px;\n  border: 1.5px solid rgba(255, 255, 255, 0.92);\n  border-radius: 3px;\n  background: #ff374d;\n  transform: translateX(-50%);\n  z-index: 2;\n}\n.affinity-graph-static-arrows[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  width: 42px;\n  height: 33px;\n  display: grid;\n  grid-template-columns: repeat(3, 12px);\n  grid-template-rows: repeat(2, 12px);\n  gap: 3px;\n}\n.affinity-graph-static-arrows[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 12px;\n  height: 12px;\n  border: 1.5px solid rgba(245, 248, 250, 0.62);\n  border-radius: 3px;\n  color: rgba(245, 248, 250, 0.82);\n  font-style: normal;\n  font-size: 0.56rem;\n  line-height: 1;\n}\n.affinity-graph-static-arrows[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]:nth-child(1) {\n  grid-column: 2;\n  grid-row: 1;\n}\n.affinity-graph-static-arrows[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]:nth-child(2) {\n  grid-column: 1;\n  grid-row: 2;\n}\n.affinity-graph-static-arrows[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]:nth-child(3) {\n  grid-column: 2;\n  grid-row: 2;\n}\n.affinity-graph-static-arrows[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]:nth-child(4) {\n  grid-column: 3;\n  grid-row: 2;\n}\n.affinity-graph-progress-shell[_ngcontent-%COMP%] {\n  position: absolute;\n  z-index: 7;\n  top: 9dvh;\n  right: 25px;\n  width: min(360px, 100vw - 50px);\n  pointer-events: none;\n}\n.affinity-graph-progress-shell[_ngcontent-%COMP%]   app-indicator[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n}\n@media (max-width: 760px) {\n  .affinity-graph-static-stack[_ngcontent-%COMP%] {\n    right: 10px;\n    left: 10px;\n    bottom: 10px;\n    width: auto;\n  }\n  .affinity-graph-static-panel[_ngcontent-%COMP%] {\n    padding: 12px;\n  }\n}\n/*# sourceMappingURL=admin-affinity-graph-popup.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminAffinityGraphPopupComponent, [{
    type: Component,
    args: [{ selector: "app-admin-affinity-graph-popup", standalone: true, imports: [CommonModule, IndicatorComponent, PopupComponent], template: '@if (admin.activePopup() === popupKey) {\n  <app-popup class="affinity-graph-popup" [model]="affinityGraphPopupModel()">\n    @if (graphUrl(); as sourceUrl) {\n      <iframe\n        class="affinity-graph-frame"\n        [src]="sourceUrl"\n        title="Affinity graph view"\n        (load)="onGraphFrameLoad()"\n      ></iframe>\n    }\n    @if (graphStaticChromeVisible()) {\n      <div\n        class="affinity-graph-static-stack"\n        [class.affinity-graph-static-stack--leaving]="graphFrameLoaded()"\n      >\n        <section class="affinity-graph-static-panel" aria-label="Graph controls">\n          <header class="affinity-graph-static-header">\n            <h1>Affinity graph</h1>\n            <button class="affinity-graph-static-reset" type="button" tabindex="-1">Reset</button>\n          </header>\n        </section>\n\n        <aside class="affinity-graph-static-help" aria-label="Graph legend">\n          <div class="affinity-graph-static-legend">\n            <span><i class="affinity-graph-static-dot affinity-graph-static-dot--woman"></i>Women</span>\n            <span><i class="affinity-graph-static-dot affinity-graph-static-dot--man"></i>Men</span>\n          </div>\n          <div class="affinity-graph-static-actions">\n            <div class="affinity-graph-static-card">\n              <div class="affinity-graph-static-card-title">\n                <span class="affinity-graph-static-mouse" aria-hidden="true"><i></i></span>\n                <strong>Mouse</strong>\n              </div>\n              <p><b>Pan</b> left <b>Rotate</b> right <b>Zoom</b> wheel</p>\n            </div>\n            <div class="affinity-graph-static-card">\n              <div class="affinity-graph-static-card-title">\n                <span class="affinity-graph-static-arrows" aria-hidden="true"><i>\u2191</i><i>\u2190</i><i>\u2193</i><i>\u2192</i></span>\n                <strong>Arrow pad</strong>\n              </div>\n              <p><b>Pan</b> step</p>\n            </div>\n          </div>\n        </aside>\n      </div>\n    }\n    @if (graphProgressVisible()) {\n      <div class="affinity-graph-progress-shell">\n        @if (graphDataLoading()) {\n          <app-indicator\n            kind="bar"\n            placement="inline"\n            [state]="graphProgressState(true)"\n          ></app-indicator>\n        } @else {\n          <app-indicator\n            kind="bar"\n            placement="inline"\n            [state]="graphProgressState(false)"\n            [position]="graphZoomProgress()"\n          ></app-indicator>\n        }\n      </div>\n    }\n  </app-popup>\n}\n', styles: ['/* src/app/admin/components/affinity-graph-popup/admin-affinity-graph-popup.component.scss */\n:host {\n  display: contents;\n}\n.affinity-graph-frame {\n  display: block;\n  width: 100%;\n  height: 100%;\n  min-height: 100%;\n  border: 0;\n  background: #111317;\n}\n.affinity-graph-static-stack {\n  position: absolute;\n  z-index: 6;\n  top: 10px;\n  right: 10px;\n  bottom: 10px;\n  width: min(390px, 100vw - 20px);\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  opacity: 1;\n  pointer-events: none;\n  transition: opacity 180ms ease;\n}\n.affinity-graph-static-stack,\n.affinity-graph-static-stack * {\n  box-sizing: border-box;\n}\n.affinity-graph-static-stack--leaving {\n  opacity: 0;\n}\n.affinity-graph-static-panel {\n  min-width: 0;\n  width: 100%;\n  padding: 15px;\n  border: 1px solid rgba(255, 255, 255, 0.52);\n  border-radius: 8px;\n  color: #15191f;\n  background: rgba(250, 249, 243, 0.92);\n  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.22);\n  -webkit-backdrop-filter: blur(18px) saturate(1.12);\n  backdrop-filter: blur(18px) saturate(1.12);\n}\n.affinity-graph-static-header {\n  min-width: 0;\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 12px;\n  padding-bottom: 9px;\n}\n.affinity-graph-static-header h1 {\n  min-width: 0;\n  margin: 0;\n  font-size: 1.1rem;\n  line-height: 1.1;\n  font-weight: 850;\n  letter-spacing: 0;\n}\n.affinity-graph-static-reset {\n  flex: 0 0 auto;\n  min-height: 30px;\n  margin: 0;\n  padding: 0 12px;\n  border: 1px solid rgba(21, 25, 31, 0.18);\n  border-radius: 8px;\n  color: #111317;\n  background: #ffffff;\n  font-size: 0.78rem;\n  font-weight: 850;\n}\n.affinity-graph-static-help {\n  min-width: 0;\n  width: 100%;\n  margin-top: auto;\n  padding: 15px;\n  border: 1px solid rgba(255, 255, 255, 0.34);\n  border-radius: 8px;\n  color: rgba(245, 248, 250, 0.9);\n  background: rgba(17, 19, 23, 0.52);\n  box-shadow: 0 16px 42px rgba(0, 0, 0, 0.24);\n  -webkit-backdrop-filter: blur(14px) saturate(1.08);\n  backdrop-filter: blur(14px) saturate(1.08);\n}\n.affinity-graph-static-legend {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 18px;\n}\n.affinity-graph-static-legend span {\n  display: flex;\n  align-items: center;\n  gap: 7px;\n  min-height: 18px;\n  color: rgba(245, 248, 250, 0.82);\n  font-size: 0.8rem;\n  font-weight: 780;\n}\n.affinity-graph-static-dot {\n  flex: 0 0 auto;\n  width: 12px;\n  height: 12px;\n  border: 2px solid rgba(255, 255, 255, 0.72);\n  border-radius: 50%;\n  box-shadow: 0 0 12px rgba(255, 255, 255, 0.16);\n}\n.affinity-graph-static-dot--woman {\n  background: #ff4f6f;\n}\n.affinity-graph-static-dot--man {\n  background: #4aa8ff;\n}\n.affinity-graph-static-actions {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 10px;\n  margin-top: 12px;\n  padding-top: 12px;\n  border-top: 1px solid rgba(255, 255, 255, 0.12);\n}\n.affinity-graph-static-card {\n  min-width: 0;\n  padding: 11px 12px;\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 8px;\n  background: rgba(255, 255, 255, 0.045);\n  text-align: center;\n}\n.affinity-graph-static-card-title {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 12px;\n  color: rgba(245, 248, 250, 0.86);\n  font-size: 0.84rem;\n  font-weight: 820;\n  white-space: nowrap;\n}\n.affinity-graph-static-card p {\n  margin: 8px 0 0;\n  color: rgba(245, 248, 250, 0.58);\n  font-size: 0.76rem;\n  line-height: 1.15;\n}\n.affinity-graph-static-card b {\n  color: rgba(245, 248, 250, 0.82);\n  font-weight: 820;\n}\n.affinity-graph-static-mouse {\n  position: relative;\n  flex: 0 0 auto;\n  width: 26px;\n  height: 38px;\n  display: block;\n  border: 2px solid rgba(245, 248, 250, 0.78);\n  border-radius: 16px 16px 18px 18px;\n  background: linear-gradient(rgba(245, 248, 250, 0.28), rgba(245, 248, 250, 0.28)) center 22px/20px 1px no-repeat;\n}\n.affinity-graph-static-mouse::before,\n.affinity-graph-static-mouse::after {\n  content: "";\n  position: absolute;\n  top: 5px;\n  width: 7px;\n  height: 10px;\n  background: rgba(245, 248, 250, 0.86);\n  z-index: 1;\n}\n.affinity-graph-static-mouse::before {\n  left: 5px;\n  border-radius: 10px 2px 2px 2px;\n}\n.affinity-graph-static-mouse::after {\n  right: 5px;\n  border-radius: 2px 10px 2px 2px;\n}\n.affinity-graph-static-mouse i {\n  position: absolute;\n  left: 50%;\n  top: 8px;\n  width: 6px;\n  height: 12px;\n  border: 1.5px solid rgba(255, 255, 255, 0.92);\n  border-radius: 3px;\n  background: #ff374d;\n  transform: translateX(-50%);\n  z-index: 2;\n}\n.affinity-graph-static-arrows {\n  flex: 0 0 auto;\n  width: 42px;\n  height: 33px;\n  display: grid;\n  grid-template-columns: repeat(3, 12px);\n  grid-template-rows: repeat(2, 12px);\n  gap: 3px;\n}\n.affinity-graph-static-arrows i {\n  display: grid;\n  place-items: center;\n  width: 12px;\n  height: 12px;\n  border: 1.5px solid rgba(245, 248, 250, 0.62);\n  border-radius: 3px;\n  color: rgba(245, 248, 250, 0.82);\n  font-style: normal;\n  font-size: 0.56rem;\n  line-height: 1;\n}\n.affinity-graph-static-arrows i:nth-child(1) {\n  grid-column: 2;\n  grid-row: 1;\n}\n.affinity-graph-static-arrows i:nth-child(2) {\n  grid-column: 1;\n  grid-row: 2;\n}\n.affinity-graph-static-arrows i:nth-child(3) {\n  grid-column: 2;\n  grid-row: 2;\n}\n.affinity-graph-static-arrows i:nth-child(4) {\n  grid-column: 3;\n  grid-row: 2;\n}\n.affinity-graph-progress-shell {\n  position: absolute;\n  z-index: 7;\n  top: 9dvh;\n  right: 25px;\n  width: min(360px, 100vw - 50px);\n  pointer-events: none;\n}\n.affinity-graph-progress-shell app-indicator {\n  display: block;\n  width: 100%;\n}\n@media (max-width: 760px) {\n  .affinity-graph-static-stack {\n    right: 10px;\n    left: 10px;\n    bottom: 10px;\n    width: auto;\n  }\n  .affinity-graph-static-panel {\n    padding: 12px;\n  }\n}\n/*# sourceMappingURL=admin-affinity-graph-popup.component.css.map */\n'] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminAffinityGraphPopupComponent, { className: "AdminAffinityGraphPopupComponent", filePath: "app/admin/components/affinity-graph-popup/admin-affinity-graph-popup.component.ts", lineNumber: 42 });
})();
export {
  AdminAffinityGraphPopupComponent
};
//# sourceMappingURL=admin-affinity-graph-popup.component-3EYBHV4R.js.map
