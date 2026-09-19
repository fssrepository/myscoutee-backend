import {
  I18nPipe,
  MatIcon,
  MatIconModule,
  NG_VALUE_ACCESSOR
} from "./chunk-L6HJFJOR.js";
import {
  I18nService
} from "./chunk-AOUY6FNC.js";
import {
  CommonModule,
  NgClass
} from "./chunk-SCHUURLR.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Injectable,
  Input,
  Output,
  __spreadProps,
  __spreadValues,
  forwardRef,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵcomponentInstance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵresolveDocument,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-EV3I3YNV.js";

// src/app/shared/ui/components/core/indicator/indicator.component.ts
function IndicatorComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 5);
    \u0275\u0275domElement(1, "span", 6)(2, "span", 7);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classProp("is-state-scrolling", ctx_r0.isScrollingState)("is-state-loading", ctx_r0.isLoadingState)("is-state-loading-overdue", ctx_r0.isLoadingOverdueState)("is-state-inactive", ctx_r0.isInactiveState);
    \u0275\u0275advance();
    \u0275\u0275styleProp("transform", ctx_r0.progressTransform());
    \u0275\u0275advance();
    \u0275\u0275styleProp("transform", ctx_r0.progressTransform());
  }
}
function IndicatorComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 1);
    \u0275\u0275domElement(1, "span", 8)(2, "span", 9)(3, "span", 10);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275styleProp("transform", ctx_r0.progressTransform());
  }
}
function IndicatorComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "span", 11);
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(1, "svg", 12);
    \u0275\u0275domElement(2, "circle", 13)(3, "circle", 14);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classProp("is-state-loading", ctx_r0.isLoadingState)("is-state-success", ctx_r0.isSuccessState);
    \u0275\u0275advance(3);
    \u0275\u0275attribute("stroke-dasharray", ctx_r0.resolvedPerimeter)("stroke-dashoffset", ctx_r0.loadRingDashOffset());
  }
}
function IndicatorComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "span", 3);
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(1, "svg", 15);
    \u0275\u0275domElement(2, "circle", 16)(3, "circle", 17);
    \u0275\u0275domElementEnd()();
  }
}
function IndicatorComponent_Conditional_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(0, "svg", 18)(1, "defs")(2, "linearGradient", 20);
    \u0275\u0275domElement(3, "stop", 21)(4, "stop", 22);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(5, "linearGradient", 20);
    \u0275\u0275domElement(6, "stop", 23)(7, "stop", 24);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(8, "linearGradient", 20);
    \u0275\u0275domElement(9, "stop", 25)(10, "stop", 26);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElement(11, "path", 27)(12, "path", 28);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("viewBox", ctx_r0.actionButtonViewBox());
    \u0275\u0275advance(2);
    \u0275\u0275attribute("id", ctx_r0.actionGradientId);
    \u0275\u0275advance(3);
    \u0275\u0275attribute("id", ctx_r0.actionErrorGradientId);
    \u0275\u0275advance(3);
    \u0275\u0275attribute("id", ctx_r0.actionAccentGradientId);
    \u0275\u0275advance(3);
    \u0275\u0275attribute("d", ctx_r0.actionButtonPath());
    \u0275\u0275advance();
    \u0275\u0275classProp("is-loading", ctx_r0.isLoadingState);
    \u0275\u0275attribute("d", ctx_r0.actionButtonPath())("stroke", ctx_r0.actionProgressStroke())("stroke-dasharray", ctx_r0.resolvedPerimeter)("stroke-dashoffset", ctx_r0.actionRingDashOffset());
  }
}
function IndicatorComponent_Conditional_4_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(0, "svg", 19)(1, "defs")(2, "linearGradient", 20);
    \u0275\u0275domElement(3, "stop", 21)(4, "stop", 22);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(5, "linearGradient", 20);
    \u0275\u0275domElement(6, "stop", 23)(7, "stop", 24);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(8, "linearGradient", 20);
    \u0275\u0275domElement(9, "stop", 25)(10, "stop", 26);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElement(11, "circle", 29)(12, "circle", 30);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275attribute("id", ctx_r0.actionGradientId);
    \u0275\u0275advance(3);
    \u0275\u0275attribute("id", ctx_r0.actionErrorGradientId);
    \u0275\u0275advance(3);
    \u0275\u0275attribute("id", ctx_r0.actionAccentGradientId);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("is-loading", ctx_r0.isLoadingState);
    \u0275\u0275attribute("stroke", ctx_r0.actionProgressStroke())("stroke-dasharray", ctx_r0.resolvedPerimeter)("stroke-dashoffset", ctx_r0.actionRingDashOffset());
  }
}
function IndicatorComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "span", 4);
    \u0275\u0275conditionalCreate(1, IndicatorComponent_Conditional_4_Conditional_1_Template, 13, 11, ":svg:svg", 18)(2, IndicatorComponent_Conditional_4_Conditional_2_Template, 13, 8, ":svg:svg", 19);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.isActionPathShape ? 1 : 2);
  }
}
var indicatorId = 0;
var IndicatorComponent = class _IndicatorComponent {
  host = inject(ElementRef);
  kind = "bar";
  placement = "edge";
  shape = "circle";
  size = "md";
  state = "scrolling";
  tone = "default";
  position = 0;
  perimeter = 100;
  durationMs = 3e3;
  autoProgress = true;
  surfaceRadiusPx = 8;
  actionGradientId = `app-indicator-action-gradient-${++indicatorId}`;
  actionErrorGradientId = `app-indicator-action-error-gradient-${indicatorId}`;
  actionAccentGradientId = `app-indicator-action-accent-gradient-${indicatorId}`;
  timedLoadPosition = signal(0, ...ngDevMode ? [{ debugName: "timedLoadPosition" }] : (
    /* istanbul ignore next */
    []
  ));
  actionButtonSize = signal({ width: 104, height: 48 }, ...ngDevMode ? [{ debugName: "actionButtonSize" }] : (
    /* istanbul ignore next */
    []
  ));
  timedLoadStartedAtMs = 0;
  timedLoadFrameId = null;
  timedLoadTimerId = null;
  actionButtonResizeObserver = null;
  actionButtonMeasureFrameId = null;
  manualPositionInput = false;
  hostClass = true;
  get hostBarKindClass() {
    return this.kind === "bar";
  }
  get hostPillBarKindClass() {
    return this.kind === "pill-bar";
  }
  get hostLoadRingKindClass() {
    return this.kind === "load-ring";
  }
  get hostActionRingKindClass() {
    return this.kind === "action-ring";
  }
  get hostSpinnerRingKindClass() {
    return this.kind === "spinner-ring";
  }
  get hostEdgePlacementClass() {
    return this.placement === "edge";
  }
  get hostInlinePlacementClass() {
    return this.placement === "inline";
  }
  get hostButtonShapeClass() {
    return this.shape === "button";
  }
  get hostCircleShapeClass() {
    return this.shape === "circle";
  }
  get hostSurfaceShapeClass() {
    return this.shape === "surface";
  }
  get hostSmallSizeClass() {
    return this.size === "sm";
  }
  get hostMediumSizeClass() {
    return this.size === "md";
  }
  get hostChatToneClass() {
    return this.tone === "chat";
  }
  get durationStyle() {
    return `${Math.max(0, Math.trunc(Number(this.durationMs) || 0))}ms`;
  }
  ariaHidden = "true";
  ngAfterViewInit() {
    this.syncActionButtonSizeObserver();
  }
  ngOnChanges(changes) {
    if (changes["position"]) {
      this.manualPositionInput = true;
    }
    this.syncTimedLoadProgress();
    this.syncActionButtonSizeObserver();
  }
  ngOnDestroy() {
    this.clearTimedLoadProgress();
    this.clearActionButtonSizeObserver();
  }
  get isBarKind() {
    return this.kind === "bar";
  }
  get isPillBarKind() {
    return this.kind === "pill-bar";
  }
  get isLoadRingKind() {
    return this.kind === "load-ring";
  }
  get isActionRingKind() {
    return this.kind === "action-ring";
  }
  get isSpinnerRingKind() {
    return this.kind === "spinner-ring";
  }
  get isActionButtonShape() {
    return this.shape === "button";
  }
  get isActionSurfaceShape() {
    return this.shape === "surface";
  }
  get isActionPathShape() {
    return this.isActionButtonShape || this.isActionSurfaceShape;
  }
  get isLoadingState() {
    return this.resolvedState === "loading";
  }
  get isLoadingOverdueState() {
    return this.resolvedState === "loading-overdue";
  }
  get isErrorState() {
    return this.resolvedState === "error";
  }
  get isSuccessState() {
    return this.resolvedState === "success";
  }
  get isInactiveState() {
    return this.resolvedState === "inactive";
  }
  get isScrollingState() {
    return this.resolvedState === "scrolling";
  }
  get resolvedState() {
    return this.state;
  }
  progressTransform() {
    if (this.isInactiveState) {
      return "scaleX(1)";
    }
    const position = this.usesTimedLoadProgress() ? this.timedLoadPosition() : this.position;
    return `scaleX(${this.clampUnit(position)})`;
  }
  loadRingDashOffset() {
    if (this.isSuccessState) {
      return 0;
    }
    const position = this.usesTimedLoadProgress() ? this.timedLoadPosition() : this.position;
    return this.resolvedPerimeter * (1 - this.clampUnit(position));
  }
  actionRingDashOffset() {
    return this.isErrorState || this.isSuccessState ? 0 : this.resolvedPerimeter;
  }
  actionProgressStroke() {
    if (this.isErrorState) {
      return `url(#${this.actionErrorGradientId})`;
    }
    if (this.isSuccessState || this.tone === "success") {
      return "#2f8f5b";
    }
    if (this.tone === "accent") {
      return `url(#${this.actionAccentGradientId})`;
    }
    if (this.tone === "danger") {
      return `url(#${this.actionErrorGradientId})`;
    }
    return `url(#${this.actionGradientId})`;
  }
  get resolvedPerimeter() {
    const value = Number(this.perimeter);
    return Number.isFinite(value) && value > 0 ? value : 100;
  }
  actionButtonViewBox() {
    const { width, height } = this.actionButtonSize();
    return `0 0 ${width} ${height}`;
  }
  actionButtonPath() {
    const { width, height } = this.actionButtonSize();
    const inset = 2;
    const left = inset;
    const right = Math.max(left + 1, width - inset);
    const top = inset;
    const bottom = Math.max(top + 1, height - inset);
    const maxRadius = Math.max(0, Math.min(right - left, bottom - top) / 2);
    const radius = this.isActionSurfaceShape ? Math.min(Math.max(0, Number(this.surfaceRadiusPx) || 0), maxRadius) : maxRadius;
    const startX = width / 2;
    const rightArcX = Math.max(left, right - radius);
    const leftArcX = Math.min(right, left + radius);
    const topArcY = Math.min(bottom, top + radius);
    const bottomArcY = Math.max(top, bottom - radius);
    return [
      `M${startX} ${top}`,
      `H${rightArcX}`,
      `A${radius} ${radius} 0 0 1 ${right} ${topArcY}`,
      `V${bottomArcY}`,
      `A${radius} ${radius} 0 0 1 ${rightArcX} ${bottom}`,
      `H${leftArcX}`,
      `A${radius} ${radius} 0 0 1 ${left} ${bottomArcY}`,
      `V${topArcY}`,
      `A${radius} ${radius} 0 0 1 ${leftArcX} ${top}`,
      `H${startX}`
    ].join(" ");
  }
  clampUnit(value) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
      return 0;
    }
    return Math.max(0, Math.min(1, numericValue));
  }
  syncTimedLoadProgress() {
    if (!this.usesTimedLoadProgress()) {
      this.clearTimedLoadProgress();
      return;
    }
    if (this.timedLoadStartedAtMs > 0) {
      return;
    }
    this.timedLoadStartedAtMs = this.nowMs();
    this.timedLoadPosition.set(0.02);
    this.scheduleTimedLoadProgress();
  }
  updateTimedLoadProgress() {
    this.timedLoadFrameId = null;
    this.timedLoadTimerId = null;
    if (!this.usesTimedLoadProgress() || this.timedLoadStartedAtMs <= 0) {
      this.clearTimedLoadProgress();
      return;
    }
    const elapsedMs = Math.max(0, this.nowMs() - this.timedLoadStartedAtMs);
    const durationMs = Math.max(1, Math.trunc(Number(this.durationMs) || 0));
    this.timedLoadPosition.set(Math.min(0.92, elapsedMs / durationMs));
    this.scheduleTimedLoadProgress();
  }
  scheduleTimedLoadProgress() {
    this.clearTimedLoadProgressHandle();
    if (typeof globalThis.requestAnimationFrame === "function") {
      this.timedLoadFrameId = globalThis.requestAnimationFrame(() => this.updateTimedLoadProgress());
      return;
    }
    this.timedLoadTimerId = setTimeout(() => this.updateTimedLoadProgress(), 80);
  }
  clearTimedLoadProgress() {
    this.clearTimedLoadProgressHandle();
    this.timedLoadStartedAtMs = 0;
    this.timedLoadPosition.set(0);
  }
  syncActionButtonSizeObserver() {
    if (!this.isActionRingKind || !this.isActionPathShape) {
      this.clearActionButtonSizeObserver();
      return;
    }
    this.measureActionButtonSize();
    if (this.actionButtonResizeObserver || typeof ResizeObserver !== "function") {
      return;
    }
    this.actionButtonResizeObserver = new ResizeObserver((entries) => this.measureActionButtonSize(entries[0]?.contentRect));
    this.actionButtonResizeObserver.observe(this.host.nativeElement);
  }
  measureActionButtonSize(size) {
    this.clearActionButtonMeasureFrame();
    const measure = () => {
      this.actionButtonMeasureFrameId = null;
      const style = size ? null : getComputedStyle(this.host.nativeElement);
      const width = size?.width ?? Number.parseFloat(style?.width ?? "0");
      const height = size?.height ?? Number.parseFloat(style?.height ?? "0");
      if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
        return;
      }
      const current = this.actionButtonSize();
      if (current.width === width && current.height === height) {
        return;
      }
      this.actionButtonSize.set({ width, height });
    };
    if (typeof requestAnimationFrame === "function") {
      this.actionButtonMeasureFrameId = requestAnimationFrame(measure);
      return;
    }
    measure();
  }
  clearActionButtonSizeObserver() {
    this.actionButtonResizeObserver?.disconnect();
    this.actionButtonResizeObserver = null;
    this.clearActionButtonMeasureFrame();
  }
  clearActionButtonMeasureFrame() {
    if (this.actionButtonMeasureFrameId === null) {
      return;
    }
    if (typeof cancelAnimationFrame === "function") {
      cancelAnimationFrame(this.actionButtonMeasureFrameId);
    }
    this.actionButtonMeasureFrameId = null;
  }
  clearTimedLoadProgressHandle() {
    if (this.timedLoadFrameId !== null && typeof globalThis.cancelAnimationFrame === "function") {
      globalThis.cancelAnimationFrame(this.timedLoadFrameId);
    }
    if (this.timedLoadTimerId !== null) {
      clearTimeout(this.timedLoadTimerId);
    }
    this.timedLoadFrameId = null;
    this.timedLoadTimerId = null;
  }
  usesTimedLoadProgress() {
    return this.autoProgress && !this.manualPositionInput && this.isLoadingState && (this.isLoadRingKind || this.isBarKind);
  }
  nowMs() {
    return typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now();
  }
  static \u0275fac = function IndicatorComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _IndicatorComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _IndicatorComponent, selectors: [["app-indicator"]], hostVars: 31, hostBindings: function IndicatorComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275attribute("aria-hidden", ctx.ariaHidden);
      \u0275\u0275styleProp("--app-indicator-duration", ctx.durationStyle);
      \u0275\u0275classProp("app-indicator-host", ctx.hostClass)("app-indicator-host--kind-bar", ctx.hostBarKindClass)("app-indicator-host--kind-pill-bar", ctx.hostPillBarKindClass)("app-indicator-host--kind-load-ring", ctx.hostLoadRingKindClass)("app-indicator-host--kind-action-ring", ctx.hostActionRingKindClass)("app-indicator-host--kind-spinner-ring", ctx.hostSpinnerRingKindClass)("app-indicator-host--placement-edge", ctx.hostEdgePlacementClass)("app-indicator-host--placement-inline", ctx.hostInlinePlacementClass)("app-indicator-host--shape-button", ctx.hostButtonShapeClass)("app-indicator-host--shape-circle", ctx.hostCircleShapeClass)("app-indicator-host--shape-surface", ctx.hostSurfaceShapeClass)("app-indicator-host--size-sm", ctx.hostSmallSizeClass)("app-indicator-host--size-md", ctx.hostMediumSizeClass)("app-indicator-host--tone-chat", ctx.hostChatToneClass);
    }
  }, inputs: { kind: "kind", placement: "placement", shape: "shape", size: "size", state: "state", tone: "tone", position: "position", perimeter: "perimeter", durationMs: "durationMs", autoProgress: "autoProgress", surfaceRadiusPx: "surfaceRadiusPx" }, features: [\u0275\u0275NgOnChangesFeature], decls: 5, vars: 1, consts: [[1, "app-indicator", "app-indicator--bar", 3, "is-state-scrolling", "is-state-loading", "is-state-loading-overdue", "is-state-inactive"], [1, "app-indicator", "app-indicator--pill-bar"], [1, "app-indicator", "app-indicator--load-ring", 3, "is-state-loading", "is-state-success"], [1, "app-indicator", "app-indicator--spinner-ring"], [1, "app-indicator", "app-indicator--action-ring"], [1, "app-indicator", "app-indicator--bar"], [1, "app-indicator__bar-fill"], [1, "app-indicator__bar-loading"], ["aria-hidden", "true", 1, "app-indicator__pill-bar-track"], ["aria-hidden", "true", 1, "app-indicator__pill-bar-segments"], [1, "app-indicator__pill-bar-fill"], [1, "app-indicator", "app-indicator--load-ring"], ["viewBox", "0 0 58 58", 1, "app-indicator__load-ring-svg"], ["cx", "29", "cy", "29", "r", "25", 1, "app-indicator__load-ring-track"], ["cx", "29", "cy", "29", "r", "25", "pathLength", "100", 1, "app-indicator__load-ring-progress"], ["viewBox", "0 0 44 44", 1, "app-indicator__spinner-ring-svg"], ["cx", "22", "cy", "22", "r", "17", 1, "app-indicator__spinner-ring-track"], ["cx", "22", "cy", "22", "r", "17", 1, "app-indicator__spinner-ring-progress"], ["preserveAspectRatio", "none", 1, "app-indicator__action-ring-svg"], ["viewBox", "0 0 34 34", "preserveAspectRatio", "none", 1, "app-indicator__action-ring-svg"], ["x1", "0%", "y1", "0%", "x2", "100%", "y2", "100%"], ["offset", "0%", "stop-color", "rgb(235, 147, 33)"], ["offset", "100%", "stop-color", "rgb(247, 190, 52)"], ["offset", "0%", "stop-color", "rgb(213, 54, 68)"], ["offset", "100%", "stop-color", "rgb(196, 29, 42)"], ["offset", "0%", "stop-color", "rgb(91, 140, 247)"], ["offset", "100%", "stop-color", "rgb(47, 111, 214)"], [1, "app-indicator__action-ring-track"], ["pathLength", "100", 1, "app-indicator__action-ring-progress"], ["cx", "17", "cy", "17", "r", "15", 1, "app-indicator__action-ring-track"], ["cx", "17", "cy", "17", "r", "15", "pathLength", "100", 1, "app-indicator__action-ring-progress", "app-indicator__action-ring-progress--circle"]], template: function IndicatorComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, IndicatorComponent_Conditional_0_Template, 3, 12, "div", 0)(1, IndicatorComponent_Conditional_1_Template, 4, 2, "div", 1)(2, IndicatorComponent_Conditional_2_Template, 4, 6, "span", 2)(3, IndicatorComponent_Conditional_3_Template, 4, 0, "span", 3)(4, IndicatorComponent_Conditional_4_Template, 3, 1, "span", 4);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.isBarKind ? 0 : ctx.isPillBarKind ? 1 : ctx.isLoadRingKind ? 2 : ctx.isSpinnerRingKind ? 3 : ctx.isActionRingKind ? 4 : -1);
    }
  }, styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n  pointer-events: none;\n}\n.app-indicator-host--kind-bar.app-indicator-host--placement-edge[_nghost-%COMP%] {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: -1px;\n}\n.app-indicator-host--kind-bar.app-indicator-host--placement-inline[_nghost-%COMP%] {\n  position: relative;\n  width: 100%;\n}\n.app-indicator-host--kind-pill-bar[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n}\n.app-indicator-host--kind-load-ring[_nghost-%COMP%] {\n  display: inline-flex;\n  width: 58px;\n  height: 58px;\n  align-items: center;\n  justify-content: center;\n}\n.app-indicator-host--kind-action-ring[_nghost-%COMP%] {\n  position: absolute;\n  inset: 0;\n  z-index: 2;\n}\n.app-indicator-host--kind-spinner-ring[_nghost-%COMP%] {\n  display: inline-flex;\n  width: 46px;\n  height: 46px;\n  align-items: center;\n  justify-content: center;\n}\n.app-indicator-host--kind-spinner-ring.app-indicator-host--size-sm[_nghost-%COMP%] {\n  width: 34px;\n  height: 34px;\n}\n.app-indicator[_ngcontent-%COMP%] {\n  display: block;\n}\n.app-indicator--bar[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  height: 2px;\n  overflow: hidden;\n  background: rgba(46, 114, 184, 0.12);\n}\n.app-indicator-host--placement-inline[_nghost-%COMP%]   .app-indicator--bar[_ngcontent-%COMP%] {\n  border-radius: 999px;\n}\n.app-indicator__bar-fill[_ngcontent-%COMP%], \n.app-indicator__bar-loading[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n}\n.app-indicator__bar-fill[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      90deg,\n      rgba(67, 96, 205, 0.98) 0%,\n      rgba(52, 88, 206, 0.98) 100%);\n  transform-origin: left center;\n  transform: scaleX(0);\n  transition: transform 120ms ease-out, opacity 100ms ease-out;\n}\n.app-indicator__bar-loading[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      270deg,\n      rgba(235, 147, 33, 0.98) 0%,\n      rgba(247, 190, 52, 0.98) 100%);\n  opacity: 0;\n  transform-origin: right center;\n  transform: scaleX(0);\n  transition: transform 140ms linear, opacity 90ms ease-out;\n}\n.app-indicator--bar.is-state-loading[_ngcontent-%COMP%]   .app-indicator__bar-fill[_ngcontent-%COMP%], \n.app-indicator--bar.is-state-loading-overdue[_ngcontent-%COMP%]   .app-indicator__bar-fill[_ngcontent-%COMP%], \n.app-indicator--bar.is-state-inactive[_ngcontent-%COMP%]   .app-indicator__bar-fill[_ngcontent-%COMP%] {\n  opacity: 0;\n}\n.app-indicator--bar.is-state-loading[_ngcontent-%COMP%]   .app-indicator__bar-loading[_ngcontent-%COMP%], \n.app-indicator--bar.is-state-loading-overdue[_ngcontent-%COMP%]   .app-indicator__bar-loading[_ngcontent-%COMP%], \n.app-indicator--bar.is-state-inactive[_ngcontent-%COMP%]   .app-indicator__bar-loading[_ngcontent-%COMP%] {\n  opacity: 1;\n}\n.app-indicator--bar.is-state-loading-overdue[_ngcontent-%COMP%]   .app-indicator__bar-loading[_ngcontent-%COMP%] {\n  transform: scaleX(1) !important;\n  background:\n    linear-gradient(\n      270deg,\n      rgba(213, 54, 68, 0.98) 0%,\n      rgba(196, 29, 42, 0.98) 100%);\n}\n.app-indicator--bar.is-state-inactive[_ngcontent-%COMP%]   .app-indicator__bar-loading[_ngcontent-%COMP%] {\n  transform: scaleX(1) !important;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(165, 173, 184, 0.92) 0%,\n      rgba(145, 154, 167, 0.96) 100%);\n}\n.app-indicator-host--tone-chat[_nghost-%COMP%]   .app-indicator--bar[_ngcontent-%COMP%] {\n  background: rgba(64, 110, 180, 0.12);\n}\n.app-indicator-host--tone-chat[_nghost-%COMP%]   .app-indicator__bar-fill[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      90deg,\n      rgba(70, 121, 201, 0.98) 0%,\n      rgba(52, 94, 173, 0.98) 100%);\n}\n.app-indicator-host--tone-chat[_nghost-%COMP%]   .app-indicator__bar-loading[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      270deg,\n      rgba(243, 166, 54, 0.98) 0%,\n      rgba(233, 133, 37, 0.98) 100%);\n}\n.app-indicator--pill-bar[_ngcontent-%COMP%] {\n  --app-indicator-pill-fill:\n    linear-gradient(\n      90deg,\n      #57ba7c 0%,\n      #3f8fe1 52%,\n      #7d6be8 100%);\n  --app-indicator-pill-glow: rgba(73, 132, 213, 0.18);\n  --app-indicator-pill-track-stripe-strong: rgba(97, 126, 178, 0.12);\n  --app-indicator-pill-track-stripe-soft: rgba(97, 126, 178, 0.04);\n  position: relative;\n  width: 100%;\n  height: 0.9rem;\n  overflow: hidden;\n  border-radius: 999px;\n  border: 1px solid rgba(58, 91, 144, 0.18);\n  background: rgba(227, 237, 249, 0.78);\n  box-shadow: inset 0 1px 2px rgba(31, 52, 86, 0.08);\n}\n.app-indicator__pill-bar-track[_ngcontent-%COMP%], \n.app-indicator__pill-bar-segments[_ngcontent-%COMP%], \n.app-indicator__pill-bar-fill[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  height: 100%;\n}\n.app-indicator__pill-bar-track[_ngcontent-%COMP%] {\n  z-index: 0;\n  background:\n    linear-gradient(\n      90deg,\n      rgba(255, 255, 255, 0.28),\n      rgba(255, 255, 255, 0)),\n    repeating-linear-gradient(\n      -55deg,\n      var(--app-indicator-pill-track-stripe-strong) 0,\n      var(--app-indicator-pill-track-stripe-strong) 12px,\n      var(--app-indicator-pill-track-stripe-soft) 12px,\n      var(--app-indicator-pill-track-stripe-soft) 24px);\n  background-size: auto, 24px 24px;\n  animation: _ngcontent-%COMP%_app-indicator-pill-track-shift 1.4s linear infinite;\n}\n.app-indicator__pill-bar-segments[_ngcontent-%COMP%] {\n  top: 0.12rem;\n  bottom: 0.12rem;\n  height: auto;\n  z-index: 1;\n  border-radius: 999px;\n  opacity: 0.48;\n  pointer-events: none;\n  background:\n    repeating-linear-gradient(\n      90deg,\n      transparent 0,\n      transparent calc(12.5% - 1px),\n      rgba(25, 44, 74, 0.14) calc(12.5% - 1px),\n      rgba(25, 44, 74, 0.14) 12.5%),\n    linear-gradient(\n      90deg,\n      rgba(85, 194, 136, 0.18) 0%,\n      rgba(85, 194, 136, 0.18) 12.5%,\n      rgba(76, 196, 214, 0.18) 12.5%,\n      rgba(76, 196, 214, 0.18) 25%,\n      rgba(63, 178, 232, 0.18) 25%,\n      rgba(63, 178, 232, 0.18) 37.5%,\n      rgba(87, 163, 255, 0.16) 37.5%,\n      rgba(87, 163, 255, 0.16) 50%,\n      rgba(240, 191, 86, 0.18) 50%,\n      rgba(240, 191, 86, 0.18) 62.5%,\n      rgba(255, 169, 95, 0.24) 62.5%,\n      rgba(255, 169, 95, 0.24) 75%,\n      rgba(126, 113, 244, 0.24) 75%,\n      rgba(126, 113, 244, 0.24) 87.5%,\n      rgba(99, 123, 160, 0.2) 87.5%,\n      rgba(99, 123, 160, 0.2) 100%);\n}\n.app-indicator__pill-bar-fill[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  z-index: 2;\n  border-radius: inherit;\n  background: var(--app-indicator-pill-fill);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.28), 0 0 14px var(--app-indicator-pill-glow);\n  transition: transform 0.28s ease;\n  transform: scaleX(0);\n  transform-origin: left center;\n  will-change: transform;\n}\n.app-indicator--load-ring[_ngcontent-%COMP%], \n.app-indicator__load-ring-svg[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n}\n.app-indicator__load-ring-svg[_ngcontent-%COMP%] {\n  display: block;\n  filter: drop-shadow(0 8px 18px rgba(29, 81, 139, 0.16));\n}\n.app-indicator__load-ring-track[_ngcontent-%COMP%], \n.app-indicator__load-ring-progress[_ngcontent-%COMP%] {\n  fill: none;\n  stroke-width: 5;\n}\n.app-indicator__load-ring-track[_ngcontent-%COMP%] {\n  stroke: rgba(42, 81, 129, 0.16);\n}\n.app-indicator__load-ring-progress[_ngcontent-%COMP%] {\n  stroke: #2f75bc;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n  transform: rotate(-90deg);\n  transform-origin: 50% 50%;\n  transition: stroke-dashoffset 120ms linear;\n}\n.app-indicator--load-ring.is-state-success[_ngcontent-%COMP%]   .app-indicator__load-ring-progress[_ngcontent-%COMP%] {\n  stroke-dashoffset: 0;\n}\n.app-indicator--spinner-ring[_ngcontent-%COMP%], \n.app-indicator__spinner-ring-svg[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n}\n.app-indicator__spinner-ring-svg[_ngcontent-%COMP%] {\n  display: block;\n  filter: drop-shadow(0 8px 18px rgba(31, 61, 96, 0.18));\n  animation: _ngcontent-%COMP%_app-indicator-spinner-ring-spin 1.05s linear infinite;\n}\n.app-indicator__spinner-ring-track[_ngcontent-%COMP%], \n.app-indicator__spinner-ring-progress[_ngcontent-%COMP%] {\n  fill: none;\n  stroke-width: 4;\n}\n.app-indicator__spinner-ring-track[_ngcontent-%COMP%] {\n  stroke: rgba(47, 86, 139, 0.16);\n}\n.app-indicator__spinner-ring-progress[_ngcontent-%COMP%] {\n  stroke: #2f75c2;\n  stroke-linecap: round;\n  stroke-dasharray: 70 38;\n}\n.app-indicator--action-ring[_ngcontent-%COMP%], \n.app-indicator__action-ring-svg[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n}\n.app-indicator__action-ring-svg[_ngcontent-%COMP%] {\n  display: block;\n  overflow: visible;\n  filter: drop-shadow(0 4px 12px rgba(22, 94, 51, 0.12));\n}\n.app-indicator-host--shape-button[_nghost-%COMP%]   .app-indicator__action-ring-svg[_ngcontent-%COMP%], \n.app-indicator-host--shape-surface[_nghost-%COMP%]   .app-indicator__action-ring-svg[_ngcontent-%COMP%] {\n  filter: drop-shadow(0 8px 20px rgba(68, 18, 18, 0.16));\n}\n.app-indicator__action-ring-track[_ngcontent-%COMP%], \n.app-indicator__action-ring-progress[_ngcontent-%COMP%] {\n  fill: none;\n  stroke-width: 3;\n}\n.app-indicator-host--shape-button[_nghost-%COMP%]   .app-indicator__action-ring-track[_ngcontent-%COMP%], \n.app-indicator-host--shape-button[_nghost-%COMP%]   .app-indicator__action-ring-progress[_ngcontent-%COMP%], \n.app-indicator-host--shape-surface[_nghost-%COMP%]   .app-indicator__action-ring-track[_ngcontent-%COMP%], \n.app-indicator-host--shape-surface[_nghost-%COMP%]   .app-indicator__action-ring-progress[_ngcontent-%COMP%] {\n  stroke-width: 4;\n}\n.app-indicator__action-ring-track[_ngcontent-%COMP%] {\n  stroke: rgba(133, 100, 42, 0.18);\n}\n.app-indicator__action-ring-progress[_ngcontent-%COMP%] {\n  stroke-linecap: round;\n  stroke-linejoin: round;\n}\n.app-indicator__action-ring-progress--circle[_ngcontent-%COMP%] {\n  transform: rotate(-90deg);\n  transform-origin: 50% 50%;\n}\n.app-indicator__action-ring-progress.is-loading[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_app-indicator-action-progress var(--app-indicator-duration) linear forwards;\n}\n.app-indicator-host--shape-surface[_nghost-%COMP%]   .app-indicator__action-ring-progress.is-loading[_ngcontent-%COMP%] {\n  stroke-dasharray: 0 100;\n  stroke-dashoffset: 0;\n  stroke-linecap: butt;\n  animation-name: _ngcontent-%COMP%_app-indicator-surface-action-progress;\n}\n@keyframes _ngcontent-%COMP%_app-indicator-action-progress {\n  from {\n    stroke-dashoffset: 100;\n  }\n  to {\n    stroke-dashoffset: 0;\n  }\n}\n@keyframes _ngcontent-%COMP%_app-indicator-surface-action-progress {\n  from {\n    stroke-dasharray: 0 100;\n  }\n  to {\n    stroke-dasharray: 100 100;\n  }\n}\n@keyframes _ngcontent-%COMP%_app-indicator-pill-track-shift {\n  from {\n    transform: translateX(0);\n  }\n  to {\n    transform: translateX(24px);\n  }\n}\n@keyframes _ngcontent-%COMP%_app-indicator-spinner-ring-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n/*# sourceMappingURL=indicator.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(IndicatorComponent, [{
    type: Component,
    args: [{ selector: "app-indicator", standalone: true, imports: [], changeDetection: ChangeDetectionStrategy.OnPush, template: '@if (isBarKind) {\n  <div\n    class="app-indicator app-indicator--bar"\n    [class.is-state-scrolling]="isScrollingState"\n    [class.is-state-loading]="isLoadingState"\n    [class.is-state-loading-overdue]="isLoadingOverdueState"\n    [class.is-state-inactive]="isInactiveState"\n  >\n    <span class="app-indicator__bar-fill" [style.transform]="progressTransform()"></span>\n    <span class="app-indicator__bar-loading" [style.transform]="progressTransform()"></span>\n  </div>\n} @else if (isPillBarKind) {\n  <div class="app-indicator app-indicator--pill-bar">\n    <span class="app-indicator__pill-bar-track" aria-hidden="true"></span>\n    <span class="app-indicator__pill-bar-segments" aria-hidden="true"></span>\n    <span class="app-indicator__pill-bar-fill" [style.transform]="progressTransform()"></span>\n  </div>\n} @else if (isLoadRingKind) {\n  <span\n    class="app-indicator app-indicator--load-ring"\n    [class.is-state-loading]="isLoadingState"\n    [class.is-state-success]="isSuccessState"\n  >\n    <svg viewBox="0 0 58 58" class="app-indicator__load-ring-svg">\n      <circle class="app-indicator__load-ring-track" cx="29" cy="29" r="25"></circle>\n      <circle\n        class="app-indicator__load-ring-progress"\n        cx="29"\n        cy="29"\n        r="25"\n        pathLength="100"\n        [attr.stroke-dasharray]="resolvedPerimeter"\n        [attr.stroke-dashoffset]="loadRingDashOffset()"\n      ></circle>\n    </svg>\n  </span>\n} @else if (isSpinnerRingKind) {\n  <span class="app-indicator app-indicator--spinner-ring">\n    <svg viewBox="0 0 44 44" class="app-indicator__spinner-ring-svg">\n      <circle class="app-indicator__spinner-ring-track" cx="22" cy="22" r="17"></circle>\n      <circle class="app-indicator__spinner-ring-progress" cx="22" cy="22" r="17"></circle>\n    </svg>\n  </span>\n} @else if (isActionRingKind) {\n  <span class="app-indicator app-indicator--action-ring">\n    @if (isActionPathShape) {\n      <svg [attr.viewBox]="actionButtonViewBox()" preserveAspectRatio="none" class="app-indicator__action-ring-svg">\n        <defs>\n          <linearGradient [attr.id]="actionGradientId" x1="0%" y1="0%" x2="100%" y2="100%">\n            <stop offset="0%" stop-color="rgb(235, 147, 33)"></stop>\n            <stop offset="100%" stop-color="rgb(247, 190, 52)"></stop>\n          </linearGradient>\n          <linearGradient [attr.id]="actionErrorGradientId" x1="0%" y1="0%" x2="100%" y2="100%">\n            <stop offset="0%" stop-color="rgb(213, 54, 68)"></stop>\n            <stop offset="100%" stop-color="rgb(196, 29, 42)"></stop>\n          </linearGradient>\n          <linearGradient [attr.id]="actionAccentGradientId" x1="0%" y1="0%" x2="100%" y2="100%">\n            <stop offset="0%" stop-color="rgb(91, 140, 247)"></stop>\n            <stop offset="100%" stop-color="rgb(47, 111, 214)"></stop>\n          </linearGradient>\n        </defs>\n        <path\n          class="app-indicator__action-ring-track"\n          [attr.d]="actionButtonPath()"\n        ></path>\n        <path\n          class="app-indicator__action-ring-progress"\n          [class.is-loading]="isLoadingState"\n          [attr.d]="actionButtonPath()"\n          pathLength="100"\n          [attr.stroke]="actionProgressStroke()"\n          [attr.stroke-dasharray]="resolvedPerimeter"\n          [attr.stroke-dashoffset]="actionRingDashOffset()"\n        ></path>\n      </svg>\n    } @else {\n      <svg viewBox="0 0 34 34" preserveAspectRatio="none" class="app-indicator__action-ring-svg">\n        <defs>\n          <linearGradient [attr.id]="actionGradientId" x1="0%" y1="0%" x2="100%" y2="100%">\n            <stop offset="0%" stop-color="rgb(235, 147, 33)"></stop>\n            <stop offset="100%" stop-color="rgb(247, 190, 52)"></stop>\n          </linearGradient>\n          <linearGradient [attr.id]="actionErrorGradientId" x1="0%" y1="0%" x2="100%" y2="100%">\n            <stop offset="0%" stop-color="rgb(213, 54, 68)"></stop>\n            <stop offset="100%" stop-color="rgb(196, 29, 42)"></stop>\n          </linearGradient>\n          <linearGradient [attr.id]="actionAccentGradientId" x1="0%" y1="0%" x2="100%" y2="100%">\n            <stop offset="0%" stop-color="rgb(91, 140, 247)"></stop>\n            <stop offset="100%" stop-color="rgb(47, 111, 214)"></stop>\n          </linearGradient>\n        </defs>\n        <circle class="app-indicator__action-ring-track" cx="17" cy="17" r="15"></circle>\n        <circle\n          class="app-indicator__action-ring-progress app-indicator__action-ring-progress--circle"\n          [class.is-loading]="isLoadingState"\n          cx="17"\n          cy="17"\n          r="15"\n          pathLength="100"\n          [attr.stroke]="actionProgressStroke()"\n          [attr.stroke-dasharray]="resolvedPerimeter"\n          [attr.stroke-dashoffset]="actionRingDashOffset()"\n        ></circle>\n      </svg>\n    }\n  </span>\n}\n', styles: ["/* src/app/shared/ui/components/core/indicator/indicator.component.scss */\n:host {\n  display: block;\n  min-width: 0;\n  pointer-events: none;\n}\n:host(.app-indicator-host--kind-bar.app-indicator-host--placement-edge) {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: -1px;\n}\n:host(.app-indicator-host--kind-bar.app-indicator-host--placement-inline) {\n  position: relative;\n  width: 100%;\n}\n:host(.app-indicator-host--kind-pill-bar) {\n  display: block;\n  width: 100%;\n}\n:host(.app-indicator-host--kind-load-ring) {\n  display: inline-flex;\n  width: 58px;\n  height: 58px;\n  align-items: center;\n  justify-content: center;\n}\n:host(.app-indicator-host--kind-action-ring) {\n  position: absolute;\n  inset: 0;\n  z-index: 2;\n}\n:host(.app-indicator-host--kind-spinner-ring) {\n  display: inline-flex;\n  width: 46px;\n  height: 46px;\n  align-items: center;\n  justify-content: center;\n}\n:host(.app-indicator-host--kind-spinner-ring.app-indicator-host--size-sm) {\n  width: 34px;\n  height: 34px;\n}\n.app-indicator {\n  display: block;\n}\n.app-indicator--bar {\n  position: relative;\n  width: 100%;\n  height: 2px;\n  overflow: hidden;\n  background: rgba(46, 114, 184, 0.12);\n}\n:host(.app-indicator-host--placement-inline) .app-indicator--bar {\n  border-radius: 999px;\n}\n.app-indicator__bar-fill,\n.app-indicator__bar-loading {\n  position: absolute;\n  inset: 0;\n}\n.app-indicator__bar-fill {\n  background:\n    linear-gradient(\n      90deg,\n      rgba(67, 96, 205, 0.98) 0%,\n      rgba(52, 88, 206, 0.98) 100%);\n  transform-origin: left center;\n  transform: scaleX(0);\n  transition: transform 120ms ease-out, opacity 100ms ease-out;\n}\n.app-indicator__bar-loading {\n  background:\n    linear-gradient(\n      270deg,\n      rgba(235, 147, 33, 0.98) 0%,\n      rgba(247, 190, 52, 0.98) 100%);\n  opacity: 0;\n  transform-origin: right center;\n  transform: scaleX(0);\n  transition: transform 140ms linear, opacity 90ms ease-out;\n}\n.app-indicator--bar.is-state-loading .app-indicator__bar-fill,\n.app-indicator--bar.is-state-loading-overdue .app-indicator__bar-fill,\n.app-indicator--bar.is-state-inactive .app-indicator__bar-fill {\n  opacity: 0;\n}\n.app-indicator--bar.is-state-loading .app-indicator__bar-loading,\n.app-indicator--bar.is-state-loading-overdue .app-indicator__bar-loading,\n.app-indicator--bar.is-state-inactive .app-indicator__bar-loading {\n  opacity: 1;\n}\n.app-indicator--bar.is-state-loading-overdue .app-indicator__bar-loading {\n  transform: scaleX(1) !important;\n  background:\n    linear-gradient(\n      270deg,\n      rgba(213, 54, 68, 0.98) 0%,\n      rgba(196, 29, 42, 0.98) 100%);\n}\n.app-indicator--bar.is-state-inactive .app-indicator__bar-loading {\n  transform: scaleX(1) !important;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(165, 173, 184, 0.92) 0%,\n      rgba(145, 154, 167, 0.96) 100%);\n}\n:host(.app-indicator-host--tone-chat) .app-indicator--bar {\n  background: rgba(64, 110, 180, 0.12);\n}\n:host(.app-indicator-host--tone-chat) .app-indicator__bar-fill {\n  background:\n    linear-gradient(\n      90deg,\n      rgba(70, 121, 201, 0.98) 0%,\n      rgba(52, 94, 173, 0.98) 100%);\n}\n:host(.app-indicator-host--tone-chat) .app-indicator__bar-loading {\n  background:\n    linear-gradient(\n      270deg,\n      rgba(243, 166, 54, 0.98) 0%,\n      rgba(233, 133, 37, 0.98) 100%);\n}\n.app-indicator--pill-bar {\n  --app-indicator-pill-fill:\n    linear-gradient(\n      90deg,\n      #57ba7c 0%,\n      #3f8fe1 52%,\n      #7d6be8 100%);\n  --app-indicator-pill-glow: rgba(73, 132, 213, 0.18);\n  --app-indicator-pill-track-stripe-strong: rgba(97, 126, 178, 0.12);\n  --app-indicator-pill-track-stripe-soft: rgba(97, 126, 178, 0.04);\n  position: relative;\n  width: 100%;\n  height: 0.9rem;\n  overflow: hidden;\n  border-radius: 999px;\n  border: 1px solid rgba(58, 91, 144, 0.18);\n  background: rgba(227, 237, 249, 0.78);\n  box-shadow: inset 0 1px 2px rgba(31, 52, 86, 0.08);\n}\n.app-indicator__pill-bar-track,\n.app-indicator__pill-bar-segments,\n.app-indicator__pill-bar-fill {\n  position: absolute;\n  inset: 0;\n  height: 100%;\n}\n.app-indicator__pill-bar-track {\n  z-index: 0;\n  background:\n    linear-gradient(\n      90deg,\n      rgba(255, 255, 255, 0.28),\n      rgba(255, 255, 255, 0)),\n    repeating-linear-gradient(\n      -55deg,\n      var(--app-indicator-pill-track-stripe-strong) 0,\n      var(--app-indicator-pill-track-stripe-strong) 12px,\n      var(--app-indicator-pill-track-stripe-soft) 12px,\n      var(--app-indicator-pill-track-stripe-soft) 24px);\n  background-size: auto, 24px 24px;\n  animation: app-indicator-pill-track-shift 1.4s linear infinite;\n}\n.app-indicator__pill-bar-segments {\n  top: 0.12rem;\n  bottom: 0.12rem;\n  height: auto;\n  z-index: 1;\n  border-radius: 999px;\n  opacity: 0.48;\n  pointer-events: none;\n  background:\n    repeating-linear-gradient(\n      90deg,\n      transparent 0,\n      transparent calc(12.5% - 1px),\n      rgba(25, 44, 74, 0.14) calc(12.5% - 1px),\n      rgba(25, 44, 74, 0.14) 12.5%),\n    linear-gradient(\n      90deg,\n      rgba(85, 194, 136, 0.18) 0%,\n      rgba(85, 194, 136, 0.18) 12.5%,\n      rgba(76, 196, 214, 0.18) 12.5%,\n      rgba(76, 196, 214, 0.18) 25%,\n      rgba(63, 178, 232, 0.18) 25%,\n      rgba(63, 178, 232, 0.18) 37.5%,\n      rgba(87, 163, 255, 0.16) 37.5%,\n      rgba(87, 163, 255, 0.16) 50%,\n      rgba(240, 191, 86, 0.18) 50%,\n      rgba(240, 191, 86, 0.18) 62.5%,\n      rgba(255, 169, 95, 0.24) 62.5%,\n      rgba(255, 169, 95, 0.24) 75%,\n      rgba(126, 113, 244, 0.24) 75%,\n      rgba(126, 113, 244, 0.24) 87.5%,\n      rgba(99, 123, 160, 0.2) 87.5%,\n      rgba(99, 123, 160, 0.2) 100%);\n}\n.app-indicator__pill-bar-fill {\n  display: block;\n  width: 100%;\n  z-index: 2;\n  border-radius: inherit;\n  background: var(--app-indicator-pill-fill);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.28), 0 0 14px var(--app-indicator-pill-glow);\n  transition: transform 0.28s ease;\n  transform: scaleX(0);\n  transform-origin: left center;\n  will-change: transform;\n}\n.app-indicator--load-ring,\n.app-indicator__load-ring-svg {\n  width: 100%;\n  height: 100%;\n}\n.app-indicator__load-ring-svg {\n  display: block;\n  filter: drop-shadow(0 8px 18px rgba(29, 81, 139, 0.16));\n}\n.app-indicator__load-ring-track,\n.app-indicator__load-ring-progress {\n  fill: none;\n  stroke-width: 5;\n}\n.app-indicator__load-ring-track {\n  stroke: rgba(42, 81, 129, 0.16);\n}\n.app-indicator__load-ring-progress {\n  stroke: #2f75bc;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n  transform: rotate(-90deg);\n  transform-origin: 50% 50%;\n  transition: stroke-dashoffset 120ms linear;\n}\n.app-indicator--load-ring.is-state-success .app-indicator__load-ring-progress {\n  stroke-dashoffset: 0;\n}\n.app-indicator--spinner-ring,\n.app-indicator__spinner-ring-svg {\n  width: 100%;\n  height: 100%;\n}\n.app-indicator__spinner-ring-svg {\n  display: block;\n  filter: drop-shadow(0 8px 18px rgba(31, 61, 96, 0.18));\n  animation: app-indicator-spinner-ring-spin 1.05s linear infinite;\n}\n.app-indicator__spinner-ring-track,\n.app-indicator__spinner-ring-progress {\n  fill: none;\n  stroke-width: 4;\n}\n.app-indicator__spinner-ring-track {\n  stroke: rgba(47, 86, 139, 0.16);\n}\n.app-indicator__spinner-ring-progress {\n  stroke: #2f75c2;\n  stroke-linecap: round;\n  stroke-dasharray: 70 38;\n}\n.app-indicator--action-ring,\n.app-indicator__action-ring-svg {\n  width: 100%;\n  height: 100%;\n}\n.app-indicator__action-ring-svg {\n  display: block;\n  overflow: visible;\n  filter: drop-shadow(0 4px 12px rgba(22, 94, 51, 0.12));\n}\n:host(.app-indicator-host--shape-button) .app-indicator__action-ring-svg,\n:host(.app-indicator-host--shape-surface) .app-indicator__action-ring-svg {\n  filter: drop-shadow(0 8px 20px rgba(68, 18, 18, 0.16));\n}\n.app-indicator__action-ring-track,\n.app-indicator__action-ring-progress {\n  fill: none;\n  stroke-width: 3;\n}\n:host(.app-indicator-host--shape-button) .app-indicator__action-ring-track,\n:host(.app-indicator-host--shape-button) .app-indicator__action-ring-progress,\n:host(.app-indicator-host--shape-surface) .app-indicator__action-ring-track,\n:host(.app-indicator-host--shape-surface) .app-indicator__action-ring-progress {\n  stroke-width: 4;\n}\n.app-indicator__action-ring-track {\n  stroke: rgba(133, 100, 42, 0.18);\n}\n.app-indicator__action-ring-progress {\n  stroke-linecap: round;\n  stroke-linejoin: round;\n}\n.app-indicator__action-ring-progress--circle {\n  transform: rotate(-90deg);\n  transform-origin: 50% 50%;\n}\n.app-indicator__action-ring-progress.is-loading {\n  animation: app-indicator-action-progress var(--app-indicator-duration) linear forwards;\n}\n:host(.app-indicator-host--shape-surface) .app-indicator__action-ring-progress.is-loading {\n  stroke-dasharray: 0 100;\n  stroke-dashoffset: 0;\n  stroke-linecap: butt;\n  animation-name: app-indicator-surface-action-progress;\n}\n@keyframes app-indicator-action-progress {\n  from {\n    stroke-dashoffset: 100;\n  }\n  to {\n    stroke-dashoffset: 0;\n  }\n}\n@keyframes app-indicator-surface-action-progress {\n  from {\n    stroke-dasharray: 0 100;\n  }\n  to {\n    stroke-dasharray: 100 100;\n  }\n}\n@keyframes app-indicator-pill-track-shift {\n  from {\n    transform: translateX(0);\n  }\n  to {\n    transform: translateX(24px);\n  }\n}\n@keyframes app-indicator-spinner-ring-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n/*# sourceMappingURL=indicator.component.css.map */\n"] }]
  }], null, { kind: [{
    type: Input
  }], placement: [{
    type: Input
  }], shape: [{
    type: Input
  }], size: [{
    type: Input
  }], state: [{
    type: Input
  }], tone: [{
    type: Input
  }], position: [{
    type: Input
  }], perimeter: [{
    type: Input
  }], durationMs: [{
    type: Input
  }], autoProgress: [{
    type: Input
  }], surfaceRadiusPx: [{
    type: Input
  }], hostClass: [{
    type: HostBinding,
    args: ["class.app-indicator-host"]
  }], hostBarKindClass: [{
    type: HostBinding,
    args: ["class.app-indicator-host--kind-bar"]
  }], hostPillBarKindClass: [{
    type: HostBinding,
    args: ["class.app-indicator-host--kind-pill-bar"]
  }], hostLoadRingKindClass: [{
    type: HostBinding,
    args: ["class.app-indicator-host--kind-load-ring"]
  }], hostActionRingKindClass: [{
    type: HostBinding,
    args: ["class.app-indicator-host--kind-action-ring"]
  }], hostSpinnerRingKindClass: [{
    type: HostBinding,
    args: ["class.app-indicator-host--kind-spinner-ring"]
  }], hostEdgePlacementClass: [{
    type: HostBinding,
    args: ["class.app-indicator-host--placement-edge"]
  }], hostInlinePlacementClass: [{
    type: HostBinding,
    args: ["class.app-indicator-host--placement-inline"]
  }], hostButtonShapeClass: [{
    type: HostBinding,
    args: ["class.app-indicator-host--shape-button"]
  }], hostCircleShapeClass: [{
    type: HostBinding,
    args: ["class.app-indicator-host--shape-circle"]
  }], hostSurfaceShapeClass: [{
    type: HostBinding,
    args: ["class.app-indicator-host--shape-surface"]
  }], hostSmallSizeClass: [{
    type: HostBinding,
    args: ["class.app-indicator-host--size-sm"]
  }], hostMediumSizeClass: [{
    type: HostBinding,
    args: ["class.app-indicator-host--size-md"]
  }], hostChatToneClass: [{
    type: HostBinding,
    args: ["class.app-indicator-host--tone-chat"]
  }], durationStyle: [{
    type: HostBinding,
    args: ["style.--app-indicator-duration"]
  }], ariaHidden: [{
    type: HostBinding,
    args: ["attr.aria-hidden"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(IndicatorComponent, { className: "IndicatorComponent", filePath: "app/shared/ui/components/core/indicator/indicator.component.ts", lineNumber: 27 });
})();

// src/app/shared/ui/components/core/menu/items/rate/rate.component.ts
function RateComponent_Conditional_1_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 10);
    \u0275\u0275pipe(1, "i18n");
    \u0275\u0275listener("click", function RateComponent_Conditional_1_Conditional_9_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.commitScore($event));
    });
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "mat-icon");
    \u0275\u0275text(6, "arrow_forward");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(1, 2, ctx_r1.resolvedActionLabel));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 4, ctx_r1.resolvedActionLabel));
  }
}
function RateComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "span", 6)(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 7);
    \u0275\u0275text(6, ":");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 8);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(9, RateComponent_Conditional_1_Conditional_9_Template, 7, 6, "button", 9);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 3, ctx_r1.resolvedLabel));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.displayValue);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.shouldShowCommitButton ? 9 : -1);
  }
}
var RateComponent = class _RateComponent {
  cdr = inject(ChangeDetectorRef);
  blinkTimer = null;
  transientBlink = false;
  stagedValue = 0;
  dirty = false;
  hostClass = true;
  get hostDockableClass() {
    return this.dockEnabled;
  }
  get hostDockOpenClass() {
    return this.dockEnabled && this.dockState === "open";
  }
  get hostDockClosingClass() {
    return this.dockEnabled && this.dockState === "closing";
  }
  get hostDockPermanentClass() {
    return this.dockEnabled && this.dockState === "permanent";
  }
  get hostDockAttr() {
    return this.dockEnabled ? "true" : null;
  }
  config = null;
  value = 0;
  valueChange = new EventEmitter();
  scoreSelect = new EventEmitter();
  get resolvedScale() {
    return this.config?.scale ?? [];
  }
  get resolvedReadonly() {
    return this.config?.readonly ?? false;
  }
  get resolvedLabel() {
    return this.config?.label ?? "Affinity";
  }
  get resolvedActionLabel() {
    return this.config?.actionLabel?.trim() || "Go";
  }
  get resolvedPresentation() {
    return this.config?.presentation ?? "list";
  }
  get resolvedAnimation() {
    if (this.transientBlink) {
      return "blink";
    }
    return this.config?.animation ?? "default";
  }
  get dockEnabled() {
    return this.config?.dock?.enabled ?? false;
  }
  get dockState() {
    return this.dockEnabled ? this.config?.dock?.state ?? "hidden" : "hidden";
  }
  get minimumScore() {
    return this.resolvedScale.length > 0 ? Math.min(...this.resolvedScale) : 1;
  }
  get maximumScore() {
    return this.resolvedScale.length > 0 ? Math.max(...this.resolvedScale) : 10;
  }
  get displayValue() {
    if (this.dirty) {
      return this.stagedValue;
    }
    const configuredValue = this.config?.value;
    const normalizedValue = this.normalizeScore(Number.isFinite(Number(configuredValue)) ? Number(configuredValue) : this.value);
    return normalizedValue > 0 ? normalizedValue : this.defaultScore();
  }
  get valuePercent() {
    const range = Math.max(1, this.maximumScore - this.minimumScore);
    return (this.displayValue - this.minimumScore) / range * 100;
  }
  get sliderAccentColor() {
    const hue = Math.round(210 - this.valuePercent / 100 * 230);
    return `hsl(${hue} 82% 48%)`;
  }
  get sliderAccentShadow() {
    const hue = Math.round(210 - this.valuePercent / 100 * 230);
    return `hsla(${hue}, 82%, 42%, 0.28)`;
  }
  get sliderAccentTextColor() {
    return this.valuePercent >= 38 && this.valuePercent <= 82 ? "#172033" : "#ffffff";
  }
  get sliderAccentTextShadow() {
    return this.sliderAccentTextColor === "#ffffff" ? "0 1px 1px rgba(0, 0, 0, 0.34)" : "0 1px 1px rgba(255, 255, 255, 0.42)";
  }
  get shouldShowCommitButton() {
    return !this.resolvedReadonly;
  }
  onSliderInput(event) {
    event.stopPropagation();
    if (this.resolvedReadonly) {
      return;
    }
    const input = event.target instanceof HTMLInputElement ? inputValue(event.target) : this.defaultScore();
    this.stagedValue = this.normalizeScore(input) || this.defaultScore();
    this.dirty = true;
    this.valueChange.emit(this.stagedValue);
    this.cdr.markForCheck();
  }
  commitScore(event) {
    event.stopPropagation();
    if (this.resolvedReadonly) {
      return;
    }
    const score = this.normalizeScore(this.dirty ? this.stagedValue : this.displayValue) || this.defaultScore();
    if (this.config?.blinkOnSelect !== false) {
      this.triggerTransientBlink();
    }
    this.dirty = false;
    this.scoreSelect.emit(score);
  }
  isFilled(score) {
    return score <= this.displayValue;
  }
  ngOnDestroy() {
    if (!this.blinkTimer) {
      return;
    }
    clearTimeout(this.blinkTimer);
    this.blinkTimer = null;
  }
  triggerTransientBlink() {
    if (this.config?.animation === "none") {
      return;
    }
    if (this.blinkTimer) {
      clearTimeout(this.blinkTimer);
      this.blinkTimer = null;
    }
    this.transientBlink = false;
    this.cdr.markForCheck();
    const startBlink = () => {
      this.transientBlink = true;
      this.cdr.markForCheck();
      this.blinkTimer = setTimeout(() => {
        this.blinkTimer = null;
        this.transientBlink = false;
        this.cdr.markForCheck();
      }, 420);
    };
    if (typeof globalThis.requestAnimationFrame === "function") {
      globalThis.requestAnimationFrame(() => startBlink());
      return;
    }
    setTimeout(() => startBlink(), 0);
  }
  normalizeScore(value) {
    const numeric = Math.round(Number(value) || 0);
    if (!Number.isFinite(numeric)) {
      return 0;
    }
    const scale = this.resolvedScale.length > 0 ? this.resolvedScale : Array.from({ length: 10 }, (_, index) => index + 1);
    return scale.includes(numeric) ? numeric : Math.min(this.maximumScore, Math.max(this.minimumScore, numeric));
  }
  defaultScore() {
    return Math.round((this.minimumScore + this.maximumScore) / 2);
  }
  static \u0275fac = function RateComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RateComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RateComponent, selectors: [["app-menu-rate"]], hostVars: 11, hostBindings: function RateComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275attribute("data-rate-dock", ctx.hostDockAttr);
      \u0275\u0275classProp("rate-host", ctx.hostClass)("rate-host--dockable", ctx.hostDockableClass)("rate-host--dock-open", ctx.hostDockOpenClass)("rate-host--dock-closing", ctx.hostDockClosingClass)("rate-host--dock-permanent", ctx.hostDockPermanentClass);
    }
  }, inputs: { config: "config", value: "value" }, outputs: { valueChange: "valueChange", scoreSelect: "scoreSelect" }, decls: 6, vars: 24, consts: [[1, "rate"], [1, "rate__head"], [1, "rate__slider-shell"], ["aria-hidden", "true", 1, "rate__track"], [1, "rate__track-fill"], ["type", "range", "step", "1", 1, "rate__slider", 3, "input", "click", "min", "max", "value", "disabled"], [1, "rate__label"], ["aria-hidden", "true"], ["aria-live", "polite", 1, "rate__value"], ["type", "button", 1, "rate__commit"], ["type", "button", 1, "rate__commit", 3, "click"]], template: function RateComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275conditionalCreate(1, RateComponent_Conditional_1_Template, 10, 5, "div", 1);
      \u0275\u0275elementStart(2, "div", 2)(3, "div", 3);
      \u0275\u0275element(4, "span", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "input", 5);
      \u0275\u0275listener("input", function RateComponent_Template_input_input_5_listener($event) {
        return ctx.onSliderInput($event);
      })("click", function RateComponent_Template_input_click_5_listener($event) {
        return $event.stopPropagation();
      });
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275styleProp("--rate-slider-accent", ctx.sliderAccentColor)("--rate-slider-accent-shadow", ctx.sliderAccentShadow)("--rate-slider-accent-text", ctx.sliderAccentTextColor)("--rate-slider-accent-text-shadow", ctx.sliderAccentTextShadow);
      \u0275\u0275classProp("rate--list", ctx.resolvedPresentation === "list")("rate--fullscreen", ctx.resolvedPresentation === "fullscreen")("rate--blink", ctx.resolvedAnimation === "blink")("rate--readonly", ctx.resolvedReadonly);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.resolvedLabel ? 1 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275styleProp("width", ctx.valuePercent, "%");
      \u0275\u0275advance();
      \u0275\u0275property("min", ctx.minimumScore)("max", ctx.maximumScore)("value", ctx.displayValue)("disabled", ctx.resolvedReadonly);
      \u0275\u0275attribute("aria-label", ctx.resolvedLabel || "Affinity rating");
    }
  }, dependencies: [MatIconModule, MatIcon, I18nPipe], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n.rate-host--dockable[_nghost-%COMP%] {\n  --rate-dock-hidden-offset: calc(100% + 0.8rem + env(safe-area-inset-bottom));\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 26;\n  border: 1px solid rgba(22, 40, 64, 0.2);\n  border-radius: 12px;\n  background: #fff;\n  box-shadow: 0 -8px 22px rgba(13, 24, 40, 0.14);\n  padding: 0.52rem 0.62rem 0.62rem;\n  margin-top: 0;\n  transform-origin: bottom center;\n  overflow: hidden;\n  will-change: transform, opacity;\n  opacity: 0;\n  transform: translateY(var(--rate-dock-hidden-offset));\n  pointer-events: none;\n  transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms cubic-bezier(0.22, 1, 0.36, 1);\n}\n.rate-host--dockable.rate-host--dock-open[_nghost-%COMP%], \n.rate-host--dockable.rate-host--dock-permanent[_nghost-%COMP%] {\n  opacity: 1;\n  transform: translateY(0);\n  pointer-events: auto;\n}\n.rate-host--dockable.rate-host--dock-closing[_nghost-%COMP%] {\n  pointer-events: none;\n}\n.rate-host--dockable.rate-host--dock-permanent[_nghost-%COMP%] {\n  padding-top: 0.38rem;\n  padding-bottom: 0.46rem;\n}\n.rate-host--dockable[_nghost-%COMP%] {\n  bottom: -0.92rem;\n}\n.rate[_ngcontent-%COMP%] {\n  --rate-slider-value-left: 50%;\n  --rate-slider-accent: #172033;\n  --rate-slider-accent-shadow: rgba(13, 24, 40, 0.24);\n  --rate-slider-accent-text: #fff;\n  --rate-slider-accent-text-shadow: 0 1px 1px rgba(0, 0, 0, 0.34);\n  display: grid;\n  gap: 0.26rem;\n  width: 100%;\n  min-width: 0;\n}\n.rate__head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.42rem;\n  min-width: 0;\n  min-height: 31px;\n}\n.rate__label[_ngcontent-%COMP%] {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n  font-size: 0.86rem;\n  font-weight: 950;\n  color: #1f3658;\n}\n.rate__label[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:first-child {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.rate__value[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  min-width: 29px;\n  height: 29px;\n  border: 2px solid #fff;\n  border-radius: 50%;\n  background: var(--rate-slider-accent);\n  color: var(--rate-slider-accent-text);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.82rem;\n  font-weight: 950;\n  text-shadow: var(--rate-slider-accent-text-shadow);\n  box-shadow: 0 0 0 1px rgba(15, 28, 46, 0.12), 0 2px 8px var(--rate-slider-accent-shadow);\n}\n.rate__slider-shell[_ngcontent-%COMP%] {\n  position: relative;\n  min-height: 27px;\n  display: flex;\n  align-items: center;\n}\n.rate__track[_ngcontent-%COMP%], \n.rate__track-fill[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 0;\n  right: 0;\n  height: 11px;\n  border-radius: 999px;\n  pointer-events: none;\n}\n.rate__track[_ngcontent-%COMP%] {\n  background: rgba(124, 139, 160, 0.18);\n  box-shadow: inset 0 1px 2px rgba(12, 24, 40, 0.18);\n  overflow: hidden;\n}\n.rate__track-fill[_ngcontent-%COMP%] {\n  right: auto;\n  width: 50%;\n  background:\n    linear-gradient(\n      90deg,\n      #238be6 0%,\n      #48c3bd 32%,\n      #f1dc5a 58%,\n      #f3973d 78%,\n      #ef3d5e 100%);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.42);\n}\n.rate__slider[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  width: 100%;\n  height: 27px;\n  margin: 0;\n  border: 0;\n  background: transparent;\n  color: transparent;\n  cursor: pointer;\n  appearance: none;\n  outline: 0;\n}\n.rate__slider[_ngcontent-%COMP%]:disabled {\n  cursor: default;\n}\n.rate__slider[_ngcontent-%COMP%]:focus, \n.rate__slider[_ngcontent-%COMP%]:focus-visible {\n  outline: 0;\n}\n.rate__slider[_ngcontent-%COMP%]:focus-visible    + *[_ngcontent-%COMP%], \n.rate__slider-shell[_ngcontent-%COMP%]:focus-within   .rate__track[_ngcontent-%COMP%] {\n  box-shadow: inset 0 1px 2px rgba(12, 24, 40, 0.18), 0 0 0 2px rgba(74, 126, 196, 0.16);\n}\n.rate__slider[_ngcontent-%COMP%]::-webkit-slider-runnable-track {\n  height: 11px;\n  border-radius: 999px;\n  background: transparent;\n  border: 0;\n  box-shadow: none;\n  color: transparent;\n}\n.rate__slider[_ngcontent-%COMP%]::-moz-range-track {\n  height: 11px;\n  border-radius: 999px;\n  background: transparent;\n  border: 0;\n  box-shadow: none;\n  color: transparent;\n}\n.rate__slider[_ngcontent-%COMP%]::-moz-range-progress {\n  background: transparent;\n  border: 0;\n  box-shadow: none;\n}\n.rate__slider[_ngcontent-%COMP%]::-moz-focus-outer {\n  border: 0;\n}\n.rate__slider[_ngcontent-%COMP%]::-webkit-slider-thumb {\n  width: 29px;\n  height: 29px;\n  margin-top: -9px;\n  border: 3px solid #fff;\n  border-radius: 50%;\n  background: var(--rate-slider-accent);\n  box-shadow: 0 0 0 1px rgba(17, 30, 50, 0.18), 0 4px 14px var(--rate-slider-accent-shadow);\n  appearance: none;\n}\n.rate__slider[_ngcontent-%COMP%]::-moz-range-thumb {\n  width: 25px;\n  height: 25px;\n  border: 3px solid #fff;\n  border-radius: 50%;\n  background: var(--rate-slider-accent);\n  box-shadow: 0 0 0 1px rgba(17, 30, 50, 0.18), 0 4px 14px var(--rate-slider-accent-shadow);\n}\n.rate__commit[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  min-width: 82px;\n  min-height: 31px;\n  border: 1px solid rgba(79, 55, 155, 0.38);\n  border-radius: 11px;\n  background:\n    linear-gradient(\n      180deg,\n      #7c61dc 0%,\n      #5c3dc2 100%);\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.28rem;\n  padding: 0 0.72rem;\n  font: inherit;\n  font-size: 0.8rem;\n  font-weight: 950;\n  cursor: pointer;\n  box-shadow: 0 6px 16px rgba(69, 47, 148, 0.22);\n}\n.rate__commit[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n.rate--blink[_ngcontent-%COMP%]   .rate__track-fill[_ngcontent-%COMP%], \n.rate--blink[_ngcontent-%COMP%]   .rate__value[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_rate-blink 0.42s ease-in-out 1;\n}\n.rate--readonly[_ngcontent-%COMP%] {\n  opacity: 0.72;\n}\n.rate--fullscreen[_ngcontent-%COMP%]   .rate__slider-shell[_ngcontent-%COMP%] {\n  min-height: 28px;\n}\n@keyframes _ngcontent-%COMP%_rate-blink {\n  0%, 100% {\n    filter: brightness(1);\n  }\n  50% {\n    filter: brightness(1.14) saturate(1.14);\n  }\n}\n@media (max-width: 760px) {\n  .rate-host--dockable[_nghost-%COMP%] {\n    position: fixed;\n    bottom: 0;\n    padding: 0.44rem 0.48rem calc(0.48rem + env(safe-area-inset-bottom));\n  }\n  .rate[_ngcontent-%COMP%] {\n    gap: 0.24rem;\n  }\n  .rate__commit[_ngcontent-%COMP%] {\n    min-width: 78px;\n    min-height: 30px;\n    border-radius: 10px;\n  }\n}\n/*# sourceMappingURL=rate.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RateComponent, [{
    type: Component,
    args: [{ selector: "app-menu-rate", standalone: true, imports: [MatIconModule, I18nPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `<div
  class="rate"
  [class.rate--list]="resolvedPresentation === 'list'"
  [class.rate--fullscreen]="resolvedPresentation === 'fullscreen'"
  [class.rate--blink]="resolvedAnimation === 'blink'"
  [class.rate--readonly]="resolvedReadonly"
  [style.--rate-slider-accent]="sliderAccentColor"
  [style.--rate-slider-accent-shadow]="sliderAccentShadow"
  [style.--rate-slider-accent-text]="sliderAccentTextColor"
  [style.--rate-slider-accent-text-shadow]="sliderAccentTextShadow"
  >
  @if (resolvedLabel) {
    <div class="rate__head">
      <span class="rate__label">
        <span>{{ resolvedLabel | i18n }}</span>
        <span aria-hidden="true">:</span>
        <span class="rate__value" aria-live="polite">{{ displayValue }}</span>
      </span>
      @if (shouldShowCommitButton) {
        <button
          type="button"
          class="rate__commit"
          (click)="commitScore($event)"
          [attr.aria-label]="resolvedActionLabel | i18n"
          >
          <span>{{ resolvedActionLabel | i18n }}</span>
          <mat-icon>arrow_forward</mat-icon>
        </button>
      }
    </div>
  }

  <div class="rate__slider-shell">
    <div class="rate__track" aria-hidden="true">
      <span class="rate__track-fill" [style.width.%]="valuePercent"></span>
    </div>
    <input
      type="range"
      class="rate__slider"
      [min]="minimumScore"
      [max]="maximumScore"
      step="1"
      [value]="displayValue"
      [disabled]="resolvedReadonly"
      (input)="onSliderInput($event)"
      (click)="$event.stopPropagation()"
      [attr.aria-label]="resolvedLabel || 'Affinity rating'"
    />
  </div>
</div>
`, styles: ["/* src/app/shared/ui/components/core/menu/items/rate/rate.component.scss */\n:host {\n  display: block;\n  min-width: 0;\n}\n:host(.rate-host--dockable) {\n  --rate-dock-hidden-offset: calc(100% + 0.8rem + env(safe-area-inset-bottom));\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 26;\n  border: 1px solid rgba(22, 40, 64, 0.2);\n  border-radius: 12px;\n  background: #fff;\n  box-shadow: 0 -8px 22px rgba(13, 24, 40, 0.14);\n  padding: 0.52rem 0.62rem 0.62rem;\n  margin-top: 0;\n  transform-origin: bottom center;\n  overflow: hidden;\n  will-change: transform, opacity;\n  opacity: 0;\n  transform: translateY(var(--rate-dock-hidden-offset));\n  pointer-events: none;\n  transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms cubic-bezier(0.22, 1, 0.36, 1);\n}\n:host(.rate-host--dockable.rate-host--dock-open),\n:host(.rate-host--dockable.rate-host--dock-permanent) {\n  opacity: 1;\n  transform: translateY(0);\n  pointer-events: auto;\n}\n:host(.rate-host--dockable.rate-host--dock-closing) {\n  pointer-events: none;\n}\n:host(.rate-host--dockable.rate-host--dock-permanent) {\n  padding-top: 0.38rem;\n  padding-bottom: 0.46rem;\n}\n:host(.rate-host--dockable) {\n  bottom: -0.92rem;\n}\n.rate {\n  --rate-slider-value-left: 50%;\n  --rate-slider-accent: #172033;\n  --rate-slider-accent-shadow: rgba(13, 24, 40, 0.24);\n  --rate-slider-accent-text: #fff;\n  --rate-slider-accent-text-shadow: 0 1px 1px rgba(0, 0, 0, 0.34);\n  display: grid;\n  gap: 0.26rem;\n  width: 100%;\n  min-width: 0;\n}\n.rate__head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.42rem;\n  min-width: 0;\n  min-height: 31px;\n}\n.rate__label {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n  font-size: 0.86rem;\n  font-weight: 950;\n  color: #1f3658;\n}\n.rate__label > span:first-child {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.rate__value {\n  flex: 0 0 auto;\n  min-width: 29px;\n  height: 29px;\n  border: 2px solid #fff;\n  border-radius: 50%;\n  background: var(--rate-slider-accent);\n  color: var(--rate-slider-accent-text);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.82rem;\n  font-weight: 950;\n  text-shadow: var(--rate-slider-accent-text-shadow);\n  box-shadow: 0 0 0 1px rgba(15, 28, 46, 0.12), 0 2px 8px var(--rate-slider-accent-shadow);\n}\n.rate__slider-shell {\n  position: relative;\n  min-height: 27px;\n  display: flex;\n  align-items: center;\n}\n.rate__track,\n.rate__track-fill {\n  position: absolute;\n  left: 0;\n  right: 0;\n  height: 11px;\n  border-radius: 999px;\n  pointer-events: none;\n}\n.rate__track {\n  background: rgba(124, 139, 160, 0.18);\n  box-shadow: inset 0 1px 2px rgba(12, 24, 40, 0.18);\n  overflow: hidden;\n}\n.rate__track-fill {\n  right: auto;\n  width: 50%;\n  background:\n    linear-gradient(\n      90deg,\n      #238be6 0%,\n      #48c3bd 32%,\n      #f1dc5a 58%,\n      #f3973d 78%,\n      #ef3d5e 100%);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.42);\n}\n.rate__slider {\n  position: relative;\n  z-index: 1;\n  width: 100%;\n  height: 27px;\n  margin: 0;\n  border: 0;\n  background: transparent;\n  color: transparent;\n  cursor: pointer;\n  appearance: none;\n  outline: 0;\n}\n.rate__slider:disabled {\n  cursor: default;\n}\n.rate__slider:focus,\n.rate__slider:focus-visible {\n  outline: 0;\n}\n.rate__slider:focus-visible + *,\n.rate__slider-shell:focus-within .rate__track {\n  box-shadow: inset 0 1px 2px rgba(12, 24, 40, 0.18), 0 0 0 2px rgba(74, 126, 196, 0.16);\n}\n.rate__slider::-webkit-slider-runnable-track {\n  height: 11px;\n  border-radius: 999px;\n  background: transparent;\n  border: 0;\n  box-shadow: none;\n  color: transparent;\n}\n.rate__slider::-moz-range-track {\n  height: 11px;\n  border-radius: 999px;\n  background: transparent;\n  border: 0;\n  box-shadow: none;\n  color: transparent;\n}\n.rate__slider::-moz-range-progress {\n  background: transparent;\n  border: 0;\n  box-shadow: none;\n}\n.rate__slider::-moz-focus-outer {\n  border: 0;\n}\n.rate__slider::-webkit-slider-thumb {\n  width: 29px;\n  height: 29px;\n  margin-top: -9px;\n  border: 3px solid #fff;\n  border-radius: 50%;\n  background: var(--rate-slider-accent);\n  box-shadow: 0 0 0 1px rgba(17, 30, 50, 0.18), 0 4px 14px var(--rate-slider-accent-shadow);\n  appearance: none;\n}\n.rate__slider::-moz-range-thumb {\n  width: 25px;\n  height: 25px;\n  border: 3px solid #fff;\n  border-radius: 50%;\n  background: var(--rate-slider-accent);\n  box-shadow: 0 0 0 1px rgba(17, 30, 50, 0.18), 0 4px 14px var(--rate-slider-accent-shadow);\n}\n.rate__commit {\n  flex: 0 0 auto;\n  min-width: 82px;\n  min-height: 31px;\n  border: 1px solid rgba(79, 55, 155, 0.38);\n  border-radius: 11px;\n  background:\n    linear-gradient(\n      180deg,\n      #7c61dc 0%,\n      #5c3dc2 100%);\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.28rem;\n  padding: 0 0.72rem;\n  font: inherit;\n  font-size: 0.8rem;\n  font-weight: 950;\n  cursor: pointer;\n  box-shadow: 0 6px 16px rgba(69, 47, 148, 0.22);\n}\n.rate__commit .mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n.rate--blink .rate__track-fill,\n.rate--blink .rate__value {\n  animation: rate-blink 0.42s ease-in-out 1;\n}\n.rate--readonly {\n  opacity: 0.72;\n}\n.rate--fullscreen .rate__slider-shell {\n  min-height: 28px;\n}\n@keyframes rate-blink {\n  0%, 100% {\n    filter: brightness(1);\n  }\n  50% {\n    filter: brightness(1.14) saturate(1.14);\n  }\n}\n@media (max-width: 760px) {\n  :host(.rate-host--dockable) {\n    position: fixed;\n    bottom: 0;\n    padding: 0.44rem 0.48rem calc(0.48rem + env(safe-area-inset-bottom));\n  }\n  .rate {\n    gap: 0.24rem;\n  }\n  .rate__commit {\n    min-width: 78px;\n    min-height: 30px;\n    border-radius: 10px;\n  }\n}\n/*# sourceMappingURL=rate.component.css.map */\n"] }]
  }], null, { hostClass: [{
    type: HostBinding,
    args: ["class.rate-host"]
  }], hostDockableClass: [{
    type: HostBinding,
    args: ["class.rate-host--dockable"]
  }], hostDockOpenClass: [{
    type: HostBinding,
    args: ["class.rate-host--dock-open"]
  }], hostDockClosingClass: [{
    type: HostBinding,
    args: ["class.rate-host--dock-closing"]
  }], hostDockPermanentClass: [{
    type: HostBinding,
    args: ["class.rate-host--dock-permanent"]
  }], hostDockAttr: [{
    type: HostBinding,
    args: ["attr.data-rate-dock"]
  }], config: [{
    type: Input
  }], value: [{
    type: Input
  }], valueChange: [{
    type: Output
  }], scoreSelect: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RateComponent, { className: "RateComponent", filePath: "app/shared/ui/components/core/menu/items/rate/rate.component.ts", lineNumber: 21 });
})();
function inputValue(input) {
  return Number(input.value);
}

// src/app/shared/ui/components/core/menu/menu-summary.ts
function appMenuModelGroups(model, fallback = []) {
  return model?.groups ?? model?.nodes ?? fallback;
}
function appMenuModelSummary(model, fallbackGroups = [], selection = null) {
  const summary = model?.summary ?? null;
  if (!summary) {
    return {
      label: "",
      counter: null,
      selectedCount: 0
    };
  }
  const labels = appMenuSelectedLabels(appMenuModelGroups(model, fallbackGroups), selection);
  const maxLabels = Math.max(1, Math.trunc(Number(summary.maxLabels) || 1));
  const visibleLabels = labels.slice(0, maxLabels);
  const label = visibleLabels.length > 0 ? visibleLabels.join(", ") : `${appMenuResolveLiveValue(summary.emptyLabel) ?? ""}`.trim();
  const counter = appMenuSummaryCounter(labels.length, maxLabels, summary.counter ?? "overflow");
  return {
    label,
    counter,
    selectedCount: labels.length
  };
}
function appMenuResolveLiveValue(value) {
  if (typeof value === "function") {
    return value();
  }
  return value;
}
function appMenuAlertCounter(items = [], model = null, fallbackGroups = []) {
  const visited = /* @__PURE__ */ new Set();
  let numericTotal = 0;
  let fallbackLabel = "";
  const collect = (item) => {
    if (visited.has(item)) {
      return;
    }
    visited.add(item);
    if (item.counterTone === "alert") {
      const value = appMenuCounterValue(item.counter);
      if (typeof value === "number" && Number.isFinite(value) && value > 0) {
        numericTotal += Math.trunc(value);
      } else if (!fallbackLabel) {
        fallbackLabel = `${value ?? ""}`.trim();
      }
    }
    for (const child of item.items ?? []) {
      collect(child);
    }
    for (const group of appMenuModelGroups(item.model, item.groups ?? [])) {
      for (const child of group.items ?? []) {
        collect(child);
      }
    }
  };
  for (const item of items) {
    collect(item);
  }
  for (const group of appMenuModelGroups(model, fallbackGroups)) {
    for (const item of group.items ?? []) {
      collect(item);
    }
  }
  if (numericTotal > 0) {
    return { value: numericTotal, max: 99 };
  }
  return fallbackLabel || null;
}
function appMenuCounterValue(counter) {
  if (counter === null || counter === void 0) {
    return null;
  }
  if (typeof counter === "object" && "value" in counter) {
    return appMenuResolveLiveValue(counter.value);
  }
  return appMenuResolveLiveValue(counter);
}
function appMenuSelectedLabels(groups, selection) {
  const selectedLabels = [];
  const seenLabels = /* @__PURE__ */ new Set();
  for (const group of groups) {
    for (const item of group.items ?? []) {
      collectSelectedItemLabels(item, selectedLabels, seenLabels, selection);
    }
  }
  return selectedLabels;
}
function collectSelectedItemLabels(item, selectedLabels, seenLabels, selection) {
  const kind = item.kind ?? "action";
  if (kind !== "divider" && kind !== "section" && isActiveItem(item, selection)) {
    const label = `${appMenuResolveLiveValue(item.label) ?? ""}`.trim();
    const key = label.toLowerCase();
    if (label && !seenLabels.has(key)) {
      selectedLabels.push(label);
      seenLabels.add(key);
    }
  }
  for (const child of item.items ?? []) {
    collectSelectedItemLabels(child, selectedLabels, seenLabels, selection);
  }
  for (const group of appMenuModelGroups(item.model, item.groups ?? [])) {
    for (const child of group.items ?? []) {
      collectSelectedItemLabels(child, selectedLabels, seenLabels, selection);
    }
  }
}
function isActiveItem(item, selection) {
  return appMenuResolveLiveValue(item.active) === true || appMenuResolveLiveValue(item.checked) === true || isSelectedByValue(item, selection);
}
function isSelectedByValue(item, selection) {
  if (!selection?.active) {
    return false;
  }
  const itemValue = item.value !== void 0 ? item.value : item.id;
  const selectedValue = selection.value;
  if (Array.isArray(selectedValue)) {
    return selectedValue.some((value) => appMenuValuesEqual(value, itemValue, selection.valueKey));
  }
  return appMenuValuesEqual(selectedValue, itemValue, selection.valueKey);
}
function appMenuValuesEqual(first, second, valueKey) {
  if (!valueKey) {
    return Object.is(first, second);
  }
  return Object.is(appMenuValueIdentity(first, valueKey), appMenuValueIdentity(second, valueKey));
}
function appMenuValueIdentity(value, valueKey) {
  if (typeof valueKey === "function") {
    return valueKey(value);
  }
  if (value && typeof value === "object" && valueKey in value) {
    return value[valueKey];
  }
  return value;
}
function appMenuSummaryCounter(selectedCount, maxLabels, mode) {
  if (selectedCount <= 0 || mode === "none") {
    return null;
  }
  if (mode === "count") {
    return selectedCount;
  }
  const overflow = selectedCount - maxLabels;
  return overflow > 0 ? `+${overflow}` : null;
}

// src/app/shared/ui/components/core/menu/menu.component.ts
var _c0 = [[["", "appMenuOverlay", ""]]];
var _c1 = ["[appMenuOverlay]"];
var _forTrack0 = ($index, $item) => $item.id;
function AppMenuComponent_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 3);
  }
}
function AppMenuComponent_Conditional_1_Conditional_2_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function AppMenuComponent_Conditional_1_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "img", 9);
    \u0275\u0275listener("error", function AppMenuComponent_Conditional_1_Conditional_2_Conditional_1_Template_img_error_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.revealImageFallback($event));
    })("load", function AppMenuComponent_Conditional_1_Conditional_2_Conditional_1_Template_img_load_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.hideImageFallback($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_1_Conditional_2_Conditional_1_Conditional_1_Template, 2, 1, "span", 10);
  }
  if (rf & 2) {
    let tmp_6_0;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("src", ctx, \u0275\u0275sanitizeUrl)("alt", ctx_r1.triggerImageAlt());
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_6_0 = ctx_r1.triggerImageFallback()) ? 1 : -1, tmp_6_0);
  }
}
function AppMenuComponent_Conditional_1_Conditional_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.triggerImageFallback());
  }
}
function AppMenuComponent_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 4);
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_1_Conditional_2_Conditional_1_Template, 2, 3)(2, AppMenuComponent_Conditional_1_Conditional_2_Conditional_2_Template, 2, 1, "span");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_2_0 = ctx_r1.triggerImageUrl()) ? 1 : 2, tmp_2_0);
  }
}
function AppMenuComponent_Conditional_1_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("app-menu__trigger-icon--symbol", ctx_r1.isSymbolIcon(ctx_r1.triggerIcon()));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.triggerIcon());
  }
}
function AppMenuComponent_Conditional_1_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 6);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r1.triggerLabel()));
  }
}
function AppMenuComponent_Conditional_1_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("app-menu__trigger-caret--static", !ctx_r1.triggerCaretRotates());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.triggerTrailingIcon(), " ");
  }
}
function AppMenuComponent_Conditional_1_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("app-menu__counter--pulse", ctx_r1.isCounterPulsing(ctx_r1.triggerCounterKey()));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.triggerCounterLabel(), " ");
  }
}
function AppMenuComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 2);
    \u0275\u0275listener("pointerdown", function AppMenuComponent_Conditional_1_Template_button_pointerdown_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.startTriggerDrag($event));
    })("contextmenu", function AppMenuComponent_Conditional_1_Template_button_contextmenu_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.preventTriggerContextMenu($event));
    })("click", function AppMenuComponent_Conditional_1_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleMenu($event));
    });
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_1_Conditional_1_Template, 1, 0, "span", 3);
    \u0275\u0275conditionalCreate(2, AppMenuComponent_Conditional_1_Conditional_2_Template, 3, 1, "span", 4)(3, AppMenuComponent_Conditional_1_Conditional_3_Template, 2, 3, "mat-icon", 5);
    \u0275\u0275conditionalCreate(4, AppMenuComponent_Conditional_1_Conditional_4_Template, 3, 3, "span", 6);
    \u0275\u0275conditionalCreate(5, AppMenuComponent_Conditional_1_Conditional_5_Template, 2, 3, "mat-icon", 7);
    \u0275\u0275conditionalCreate(6, AppMenuComponent_Conditional_1_Conditional_6_Template, 2, 3, "span", 8);
    \u0275\u0275elementEnd();
    \u0275\u0275projection(7);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("app-menu__trigger--open", ctx_r1.open)("app-menu__trigger--label-hidden", ctx_r1.trigger == null ? null : ctx_r1.trigger.hideLabel)("app-menu__trigger--collapsible", ctx_r1.trigger == null ? null : ctx_r1.trigger.collapsible)("app-menu__trigger--placeholder", ctx_r1.usesDefaultSelectTriggerLabel())("app-menu__trigger--layout-field", ctx_r1.triggerLayout() === "field")("app-menu__trigger--layout-pill", ctx_r1.triggerLayout() === "pill")("app-menu__trigger--layout-icon", ctx_r1.triggerLayout() === "icon");
    \u0275\u0275property("ngClass", ctx_r1.triggerPaletteClass())("disabled", ctx_r1.triggerDisabled());
    \u0275\u0275attribute("aria-expanded", ctx_r1.open)("aria-haspopup", ctx_r1.triggerAriaHasPopup())("aria-label", ctx_r1.triggerAriaLabel())("data-action-wave", ctx_r1.isFabKind ? "true" : null);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isFabKind ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.triggerImageUrl() || ctx_r1.triggerImageFallback() ? 2 : ctx_r1.triggerIcon() ? 3 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!(ctx_r1.trigger == null ? null : ctx_r1.trigger.hideLabel) && ctx_r1.triggerLabel() ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.triggerTrailingIcon() ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.hasTriggerCounter() ? 6 : -1);
  }
}
function AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 15);
    \u0275\u0275element(1, "app-indicator", 18);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r5 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("shape", ctx_r1.itemProgressShape(item_r5))("state", ctx)("tone", ctx_r1.itemProgressTone(item_r5))("perimeter", ctx_r1.itemProgressPerimeter(item_r5))("durationMs", ctx_r1.itemProgressDurationMs(item_r5));
  }
}
function AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_2_For_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 20);
  }
  if (rf & 2) {
    const image_r6 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275property("src", ctx, \u0275\u0275sanitizeUrl)("alt", ctx_r1.actionRowStackImageAlt(image_r6));
  }
}
function AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_2_For_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const image_r6 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.actionRowStackImageFallback(image_r6));
  }
}
function AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_2_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 19);
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_2_For_2_Conditional_1_Template, 1, 2, "img", 20)(2, AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_2_For_2_Conditional_2_Template, 2, 1, "span");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_23_0;
    const image_r6 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_23_0 = ctx_r1.actionRowStackImageUrl(image_r6)) ? 1 : ctx_r1.actionRowStackImageFallback(image_r6) ? 2 : -1, tmp_23_0);
  }
}
function AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 16);
    \u0275\u0275repeaterCreate(1, AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_2_For_2_Template, 3, 1, "span", 19, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r5 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.actionRowItemImageStack(item_r5));
  }
}
function AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_3_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "img", 9);
    \u0275\u0275listener("error", function AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_3_Conditional_1_Template_img_error_0_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r1.revealImageFallback($event));
    })("load", function AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_3_Conditional_1_Template_img_load_0_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r1.hideImageFallback($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_3_Conditional_1_Conditional_1_Template, 2, 1, "span", 10);
  }
  if (rf & 2) {
    let tmp_17_0;
    const item_r5 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("src", ctx, \u0275\u0275sanitizeUrl)("alt", ctx_r1.actionRowItemImageAlt(item_r5));
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_17_0 = ctx_r1.actionRowItemImageFallback(item_r5)) ? 1 : -1, tmp_17_0);
  }
}
function AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r5 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.actionRowItemImageFallback(item_r5));
  }
}
function AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_3_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r5 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.actionRowItemIcon(item_r5));
  }
}
function AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 17);
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_3_Conditional_1_Template, 2, 3)(2, AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_3_Conditional_2_Template, 2, 1, "span")(3, AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_3_Conditional_3_Template, 2, 1, "mat-icon");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_13_0;
    const item_r5 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_13_0 = ctx_r1.actionRowItemImageUrl(item_r5)) ? 1 : ctx_r1.actionRowItemImageFallback(item_r5) ? 2 : ctx_r1.actionRowItemIcon(item_r5) ? 3 : -1, tmp_13_0);
  }
}
function AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r5 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.actionRowItemIcon(item_r5));
  }
}
function AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_5_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 22);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r5 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r1.actionRowItemLabel(item_r5)));
  }
}
function AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_5_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 23)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 1, ctx));
  }
}
function AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_5_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 24)(1, "mat-icon", 27);
    \u0275\u0275text(2, "chevron_right");
    \u0275\u0275elementEnd()();
  }
}
function AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_5_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 28);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r5 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("app-menu__counter--pulse", ctx_r1.isCounterPulsing(ctx_r1.actionRowItemSummaryCounterKey(item_r5)));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.actionRowItemSummaryCounterLabel(item_r5), " ");
  }
}
function AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_5_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r5 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("app-menu__counter--alert", item_r5.counterTone === "alert")("app-menu__counter--success", item_r5.counterTone === "success")("app-menu__counter--pulse", ctx_r1.isCounterPulsing(ctx_r1.itemCounterKey(item_r5)));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.itemCounterLabel(item_r5), " ");
  }
}
function AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 21);
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_5_Conditional_1_Template, 3, 3, "span", 22);
    \u0275\u0275conditionalCreate(2, AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_5_Conditional_2_Template, 4, 3, "span", 23);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_5_Conditional_3_Template, 3, 0, "span", 24);
    \u0275\u0275conditionalCreate(4, AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_5_Conditional_4_Template, 2, 3, "span", 25);
    \u0275\u0275conditionalCreate(5, AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_5_Conditional_5_Template, 2, 7, "span", 26);
  }
  if (rf & 2) {
    let tmp_14_0;
    const item_r5 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.actionRowItemLabel(item_r5) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_14_0 = ctx_r1.actionRowItemDetail(item_r5)) ? 2 : -1, tmp_14_0);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.hasNestedItems(item_r5) ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.hasActionRowItemSummaryCounter(item_r5) ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.hasItemCounter(item_r5) ? 5 : -1);
  }
}
function AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_6_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r5 = \u0275\u0275nextContext(4).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.actionRowItemIcon(item_r5));
  }
}
function AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_6_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 29);
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_6_Conditional_0_Conditional_1_Template, 2, 1, "mat-icon");
    \u0275\u0275elementStart(2, "span", 22);
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r5 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.actionRowItemIcon(item_r5) ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 2, ctx_r1.actionRowItemLabel(item_r5)));
  }
}
function AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_6_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 31);
    \u0275\u0275element(1, "span");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r5 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("app-menu__tabs-toggle--active", ctx_r1.isItemActive(item_r5));
    \u0275\u0275property("ngClass", ctx_r1.togglePaletteClass(item_r5));
    \u0275\u0275attribute("data-toggle-palette", item_r5.togglePalette ?? null);
  }
}
function AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_6_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r5 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("app-menu__counter--alert", item_r5.counterTone === "alert")("app-menu__counter--success", item_r5.counterTone === "success")("app-menu__counter--pulse", ctx_r1.isCounterPulsing(ctx_r1.itemCounterKey(item_r5)));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.itemCounterLabel(item_r5), " ");
  }
}
function AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_6_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 27);
    \u0275\u0275text(1, "expand_more");
    \u0275\u0275elementEnd();
  }
}
function AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_6_Conditional_0_Template, 5, 4, "span", 29);
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_6_Conditional_1_Template, 2, 4, "span", 30);
    \u0275\u0275conditionalCreate(2, AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_6_Conditional_2_Template, 2, 7, "span", 26);
    \u0275\u0275conditionalCreate(3, AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_6_Conditional_3_Template, 2, 0, "mat-icon", 27);
  }
  if (rf & 2) {
    const item_r5 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(ctx_r1.isLabeledActionRowItem(item_r5) && ctx_r1.actionRowItemLabel(item_r5) ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isLabeledActionRowItem(item_r5) && ctx_r1.showActionRowToggleIndicator(item_r5) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.hasItemCounter(item_r5) ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isLabeledActionRowItem(item_r5) && ctx_r1.hasNestedItems(item_r5) ? 3 : -1);
  }
}
function AppMenuComponent_Conditional_2_For_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 14);
    \u0275\u0275listener("click", function AppMenuComponent_Conditional_2_For_2_Conditional_0_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r4);
      const item_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.selectActionRowItem(item_r5, $event));
    });
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_1_Template, 2, 5, "span", 15);
    \u0275\u0275conditionalCreate(2, AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_2_Template, 3, 0, "span", 16)(3, AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_3_Template, 4, 1, "span", 17)(4, AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_4_Template, 2, 1, "mat-icon");
    \u0275\u0275conditionalCreate(5, AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_5_Template, 6, 5)(6, AppMenuComponent_Conditional_2_For_2_Conditional_0_Conditional_6_Template, 4, 4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_32_0;
    const item_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("app-menu__button-row-item--active", ctx_r1.isItemActive(item_r5))("app-menu__button-row-item--open", ctx_r1.isActionRowItemOpen(item_r5))("app-menu__button-row-item--toggle", ctx_r1.isToggleItem(item_r5))("app-menu__button-row-item--labelled", ctx_r1.isLabeledActionRowItem(item_r5))("app-menu__button-row-item--action", ctx_r1.isActionLayoutItem(item_r5))("app-menu__button-row-item--image", ctx_r1.isImageLayoutItem(item_r5))("app-menu__button-row-item--image-stack", ctx_r1.isImageStackLayoutItem(item_r5))("app-menu__button-row-item--selected-value", ctx_r1.isSelectTriggerItem(item_r5) && ctx_r1.isItemActive(item_r5))("app-menu__button-row-item--progress", ctx_r1.itemProgressState(item_r5) !== null)("app-menu__button-row-item--progress-loading", ctx_r1.itemProgressState(item_r5) === "loading")("app-menu__button-row-item--progress-error", ctx_r1.itemProgressState(item_r5) === "error")("app-menu__button-row-item--progress-success", ctx_r1.itemProgressState(item_r5) === "success");
    \u0275\u0275property("ngClass", ctx_r1.itemPaletteClass(item_r5))("disabled", ctx_r1.isItemDisabled(item_r5))("title", ctx_r1.isItemDisabled(item_r5) ? null : ctx_r1.actionRowItemAriaLabel(item_r5) || ctx_r1.actionRowItemLabel(item_r5));
    \u0275\u0275attribute("data-toggle-palette", item_r5.togglePalette ?? null)("aria-expanded", ctx_r1.hasNestedItems(item_r5) ? ctx_r1.isActionRowItemOpen(item_r5) : null)("aria-haspopup", ctx_r1.hasNestedItems(item_r5) ? "menu" : null)("aria-pressed", ctx_r1.isToggleItem(item_r5) ? ctx_r1.isItemActive(item_r5) : null)("aria-label", ctx_r1.actionRowItemAriaLabel(item_r5));
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_32_0 = ctx_r1.itemProgressState(item_r5)) ? 1 : -1, tmp_32_0);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isImageStackLayoutItem(item_r5) ? 2 : ctx_r1.isImageLayoutItem(item_r5) ? 3 : ctx_r1.actionRowItemIcon(item_r5) && (ctx_r1.isInlineRowBig || !ctx_r1.isLabeledActionRowItem(item_r5) || !ctx_r1.actionRowItemLabel(item_r5)) ? 4 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.isInlineRowBig ? 5 : 6);
  }
}
function AppMenuComponent_Conditional_2_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AppMenuComponent_Conditional_2_For_2_Conditional_0_Template, 7, 35, "button", 13);
  }
  if (rf & 2) {
    const item_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(!ctx_r1.isDivider(item_r5) && !ctx_r1.isSection(item_r5) ? 0 : -1);
  }
}
function AppMenuComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275repeaterCreate(1, AppMenuComponent_Conditional_2_For_2_Template, 1, 1, null, null, \u0275\u0275componentInstance().trackByItemId, true);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.actionRowItems);
  }
}
function AppMenuComponent_Conditional_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 37);
    \u0275\u0275listener("click", function AppMenuComponent_Conditional_3_Conditional_0_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.closeFromBackdrop($event));
    });
    \u0275\u0275elementEnd();
  }
}
function AppMenuComponent_Conditional_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 34);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r1.resolvedTitle));
  }
}
function AppMenuComponent_Conditional_3_Conditional_3_For_2_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const group_r9 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.groupIcon(group_r9));
  }
}
function AppMenuComponent_Conditional_3_Conditional_3_For_2_Conditional_1_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const group_r9 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r1.groupLabel(group_r9)));
  }
}
function AppMenuComponent_Conditional_3_Conditional_3_For_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 39)(1, "span", 41);
    \u0275\u0275conditionalCreate(2, AppMenuComponent_Conditional_3_Conditional_3_For_2_Conditional_1_Conditional_2_Template, 2, 1, "mat-icon");
    \u0275\u0275conditionalCreate(3, AppMenuComponent_Conditional_3_Conditional_3_For_2_Conditional_1_Conditional_3_Template, 3, 3, "span");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "span", 42);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const group_r9 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("ngClass", ctx_r1.groupPaletteClass(group_r9));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.groupIcon(group_r9) ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.groupLabel(group_r9) ? 3 : -1);
  }
}
function AppMenuComponent_Conditional_3_Conditional_3_For_2_For_4_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 43);
  }
}
function AppMenuComponent_Conditional_3_Conditional_3_For_2_For_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 44);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r10 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r1.itemLabel(item_r10)));
  }
}
function AppMenuComponent_Conditional_3_Conditional_3_For_2_For_4_Conditional_2_Conditional_1_For_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const segment_r12 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(7);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.segmentIcon(segment_r12));
  }
}
function AppMenuComponent_Conditional_3_Conditional_3_For_2_For_4_Conditional_2_Conditional_1_For_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 51);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const segment_r12 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(7);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r1.segmentLabel(segment_r12)));
  }
}
function AppMenuComponent_Conditional_3_Conditional_3_For_2_For_4_Conditional_2_Conditional_1_For_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 52);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const segment_r12 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(7);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r1.segmentDescription(segment_r12)));
  }
}
function AppMenuComponent_Conditional_3_Conditional_3_For_2_For_4_Conditional_2_Conditional_1_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 49);
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_3_Conditional_3_For_2_For_4_Conditional_2_Conditional_1_For_2_Conditional_1_Template, 2, 1, "mat-icon");
    \u0275\u0275elementStart(2, "span", 50);
    \u0275\u0275conditionalCreate(3, AppMenuComponent_Conditional_3_Conditional_3_For_2_For_4_Conditional_2_Conditional_1_For_2_Conditional_3_Template, 3, 3, "span", 51);
    \u0275\u0275conditionalCreate(4, AppMenuComponent_Conditional_3_Conditional_3_For_2_For_4_Conditional_2_Conditional_1_For_2_Conditional_4_Template, 3, 3, "span", 52);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const segment_r12 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(7);
    \u0275\u0275property("ngClass", ctx_r1.segmentPaletteClass(segment_r12));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.segmentIcon(segment_r12) ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.segmentLabel(segment_r12) ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.segmentDescription(segment_r12) ? 4 : -1);
  }
}
function AppMenuComponent_Conditional_3_Conditional_3_For_2_For_4_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 47);
    \u0275\u0275repeaterCreate(1, AppMenuComponent_Conditional_3_Conditional_3_For_2_For_4_Conditional_2_Conditional_1_For_2_Template, 5, 4, "span", 49, \u0275\u0275componentInstance().trackBySegmentId, true);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r10 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.itemSegments(item_r10));
  }
}
function AppMenuComponent_Conditional_3_Conditional_3_For_2_For_4_Conditional_2_Conditional_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 53);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r10 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.itemIcon(item_r10));
  }
}
function AppMenuComponent_Conditional_3_Conditional_3_For_2_For_4_Conditional_2_Conditional_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 55);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r10 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r1.itemDescription(item_r10)));
  }
}
function AppMenuComponent_Conditional_3_Conditional_3_For_2_For_4_Conditional_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AppMenuComponent_Conditional_3_Conditional_3_For_2_For_4_Conditional_2_Conditional_2_Conditional_0_Template, 2, 1, "mat-icon", 53);
    \u0275\u0275elementStart(1, "span", 54);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, AppMenuComponent_Conditional_3_Conditional_3_For_2_For_4_Conditional_2_Conditional_2_Conditional_4_Template, 3, 3, "span", 55);
  }
  if (rf & 2) {
    const item_r10 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275conditional(ctx_r1.itemIcon(item_r10) ? 0 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 3, ctx_r1.itemLabel(item_r10)));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.itemDescription(item_r10) ? 4 : -1);
  }
}
function AppMenuComponent_Conditional_3_Conditional_3_For_2_For_4_Conditional_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 56);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r10 = \u0275\u0275nextContext(2).$implicit;
    const group_r9 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("app-menu__counter--alert", item_r10.counterTone === "alert")("app-menu__counter--success", item_r10.counterTone === "success")("app-menu__counter--pulse", ctx_r1.isCounterPulsing(ctx_r1.itemCounterKey(item_r10, group_r9)));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.itemCounterLabel(item_r10), " ");
  }
}
function AppMenuComponent_Conditional_3_Conditional_3_For_2_For_4_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 46);
    \u0275\u0275listener("click", function AppMenuComponent_Conditional_3_Conditional_3_For_2_For_4_Conditional_2_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r11);
      const item_r10 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.selectItem(item_r10, $event));
    });
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_3_Conditional_3_For_2_For_4_Conditional_2_Conditional_1_Template, 3, 0, "span", 47)(2, AppMenuComponent_Conditional_3_Conditional_3_For_2_For_4_Conditional_2_Conditional_2_Template, 5, 5);
    \u0275\u0275conditionalCreate(3, AppMenuComponent_Conditional_3_Conditional_3_For_2_For_4_Conditional_2_Conditional_3_Template, 2, 7, "span", 48);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r10 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275styleProp("grid-column", ctx_r1.itemGridColumn(item_r10));
    \u0275\u0275classProp("app-menu__tile-item--active", ctx_r1.isItemActive(item_r10))("app-menu__tile-item--disabled", ctx_r1.isItemDisabled(item_r10))("app-menu__tile-item--segmented", ctx_r1.hasItemSegments(item_r10));
    \u0275\u0275property("ngClass", ctx_r1.itemPaletteClass(item_r10))("disabled", ctx_r1.isItemDisabled(item_r10))("title", ctx_r1.itemAriaLabel(item_r10) || ctx_r1.itemLabel(item_r10));
    \u0275\u0275attribute("role", ctx_r1.itemRole(item_r10))("aria-checked", ctx_r1.isItemChecked(item_r10))("aria-label", ctx_r1.itemAriaLabel(item_r10));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.hasItemSegments(item_r10) ? 1 : 2);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.hasItemCounter(item_r10) ? 3 : -1);
  }
}
function AppMenuComponent_Conditional_3_Conditional_3_For_2_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AppMenuComponent_Conditional_3_Conditional_3_For_2_For_4_Conditional_0_Template, 1, 0, "div", 43)(1, AppMenuComponent_Conditional_3_Conditional_3_For_2_For_4_Conditional_1_Template, 3, 3, "div", 44)(2, AppMenuComponent_Conditional_3_Conditional_3_For_2_For_4_Conditional_2_Template, 4, 16, "button", 45);
  }
  if (rf & 2) {
    const item_r10 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275conditional(ctx_r1.isDivider(item_r10) ? 0 : ctx_r1.isSection(item_r10) ? 1 : 2);
  }
}
function AppMenuComponent_Conditional_3_Conditional_3_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 38);
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_3_Conditional_3_For_2_Conditional_1_Template, 5, 3, "div", 39);
    \u0275\u0275elementStart(2, "div", 40);
    \u0275\u0275repeaterCreate(3, AppMenuComponent_Conditional_3_Conditional_3_For_2_For_4_Template, 3, 1, null, null, \u0275\u0275componentInstance().trackByItemId, true);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const group_r9 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275attribute("aria-label", ctx_r1.groupAriaLabel(group_r9));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.groupLabel(group_r9) || ctx_r1.groupIcon(group_r9) ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.groupItems(group_r9));
  }
}
function AppMenuComponent_Conditional_3_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35);
    \u0275\u0275repeaterCreate(1, AppMenuComponent_Conditional_3_Conditional_3_For_2_Template, 5, 2, "section", 38, \u0275\u0275componentInstance().trackByGroupId, true);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.menuNodes);
  }
}
function AppMenuComponent_Conditional_3_Conditional_4_Conditional_1_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 64);
    \u0275\u0275listener("click", function AppMenuComponent_Conditional_3_Conditional_4_Conditional_1_Conditional_5_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.clearTabsFilter($event));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "close");
    \u0275\u0275elementEnd()();
  }
}
function AppMenuComponent_Conditional_3_Conditional_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 57)(1, "div", 61);
    \u0275\u0275listener("click", function AppMenuComponent_Conditional_3_Conditional_4_Conditional_1_Template_div_click_1_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "search");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "input", 62);
    \u0275\u0275listener("input", function AppMenuComponent_Conditional_3_Conditional_4_Conditional_1_Template_input_input_4_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.updateTabsFilter($event));
    })("keydown", function AppMenuComponent_Conditional_3_Conditional_4_Conditional_1_Template_input_keydown_4_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, AppMenuComponent_Conditional_3_Conditional_4_Conditional_1_Conditional_5_Template, 3, 0, "button", 63);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275property("value", ctx_r1.tabsFilterText);
    \u0275\u0275attribute("placeholder", ctx_r1.resolvedTitle || "Search");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.tabsFilterText ? 5 : -1);
  }
}
function AppMenuComponent_Conditional_3_Conditional_4_Conditional_2_For_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const group_r16 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.groupIcon(group_r16));
  }
}
function AppMenuComponent_Conditional_3_Conditional_4_Conditional_2_For_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const group_r16 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r1.groupLabel(group_r16)));
  }
}
function AppMenuComponent_Conditional_3_Conditional_4_Conditional_2_For_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 67);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const group_r16 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.tabsGroupSelectedCount(group_r16));
  }
}
function AppMenuComponent_Conditional_3_Conditional_4_Conditional_2_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 66);
    \u0275\u0275listener("click", function AppMenuComponent_Conditional_3_Conditional_4_Conditional_2_For_2_Template_button_click_0_listener($event) {
      const group_r16 = \u0275\u0275restoreView(_r15).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.selectTabsGroup(group_r16, $event));
    });
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_3_Conditional_4_Conditional_2_For_2_Conditional_1_Template, 2, 1, "mat-icon");
    \u0275\u0275conditionalCreate(2, AppMenuComponent_Conditional_3_Conditional_4_Conditional_2_For_2_Conditional_2_Template, 3, 3, "span");
    \u0275\u0275conditionalCreate(3, AppMenuComponent_Conditional_3_Conditional_4_Conditional_2_For_2_Conditional_3_Template, 2, 1, "span", 67);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const group_r16 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("app-menu__tabs-tab--active", ctx_r1.isTabsGroupActive(group_r16));
    \u0275\u0275property("ngClass", ctx_r1.groupPaletteClass(group_r16));
    \u0275\u0275attribute("id", ctx_r1.tabsId(group_r16))("aria-selected", ctx_r1.isTabsGroupActive(group_r16))("aria-controls", ctx_r1.tabsPanelId(group_r16));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.groupIcon(group_r16) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.groupLabel(group_r16) ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.tabsGroupSelectedCount(group_r16) > 0 ? 3 : -1);
  }
}
function AppMenuComponent_Conditional_3_Conditional_4_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 58);
    \u0275\u0275repeaterCreate(1, AppMenuComponent_Conditional_3_Conditional_4_Conditional_2_For_2_Template, 4, 9, "button", 65, \u0275\u0275componentInstance().trackByGroupId, true);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275attribute("aria-label", ctx_r1.resolvedTitle || "Menu tabs");
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.visibleTabsGroups);
  }
}
function AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 69);
  }
}
function AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r17 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.itemIcon(item_r17));
  }
}
function AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 70);
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_1_Conditional_1_Template, 2, 1, "mat-icon");
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r17 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275property("ngClass", ctx_r1.itemPaletteClass(item_r17));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.itemIcon(item_r17) ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 3, ctx_r1.itemLabel(item_r17)));
  }
}
function AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_2_Conditional_1_Conditional_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 73);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r17 = \u0275\u0275nextContext(4).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.itemIcon(item_r17));
  }
}
function AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_2_Conditional_1_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 74);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r17 = \u0275\u0275nextContext(4).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.itemIcon(item_r17));
  }
}
function AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_2_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_2_Conditional_1_Conditional_0_Conditional_0_Template, 2, 1, "span", 73)(1, AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_2_Conditional_1_Conditional_0_Conditional_1_Template, 2, 1, "mat-icon", 74);
  }
  if (rf & 2) {
    const item_r17 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275conditional(ctx_r1.itemIconKind(item_r17) === "text" ? 0 : 1);
  }
}
function AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_2_Conditional_1_Conditional_0_Template, 2, 1);
  }
  if (rf & 2) {
    const item_r17 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275conditional(ctx_r1.itemIcon(item_r17) ? 0 : -1);
  }
}
function AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_2_Conditional_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 74);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r17 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.itemIcon(item_r17));
  }
}
function AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_2_Conditional_2_For_4_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong", 80);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const part_r19 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(part_r19.text);
  }
}
function AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_2_Conditional_2_For_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const part_r19 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(part_r19.text);
  }
}
function AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_2_Conditional_2_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_2_Conditional_2_For_4_Conditional_0_Template, 2, 1, "strong", 80)(1, AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_2_Conditional_2_For_4_Conditional_1_Template, 2, 1, "span");
  }
  if (rf & 2) {
    const part_r19 = ctx.$implicit;
    \u0275\u0275conditional(part_r19.match ? 0 : 1);
  }
}
function AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_2_Conditional_2_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 77);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r17 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r1.itemDescription(item_r17)));
  }
}
function AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_2_Conditional_2_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 81);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r17 = \u0275\u0275nextContext(3).$implicit;
    const group_r20 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("app-menu__counter--alert", item_r17.counterTone === "alert")("app-menu__counter--success", item_r17.counterTone === "success")("app-menu__counter--pulse", ctx_r1.isCounterPulsing(ctx_r1.itemCounterKey(item_r17, group_r20)));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.itemCounterLabel(item_r17), " ");
  }
}
function AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_2_Conditional_2_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 82);
    \u0275\u0275element(1, "span");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r17 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("app-menu__tabs-toggle--active", ctx_r1.isItemActive(item_r17));
  }
}
function AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_2_Conditional_2_Conditional_0_Template, 2, 1, "mat-icon", 74);
    \u0275\u0275elementStart(1, "span", 75)(2, "span", 76);
    \u0275\u0275repeaterCreate(3, AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_2_Conditional_2_For_4_Template, 2, 1, null, null, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_2_Conditional_2_Conditional_5_Template, 3, 3, "span", 77);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_2_Conditional_2_Conditional_6_Template, 2, 7, "span", 78);
    \u0275\u0275conditionalCreate(7, AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_2_Conditional_2_Conditional_7_Template, 2, 2, "span", 79);
  }
  if (rf & 2) {
    const item_r17 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275conditional(ctx_r1.itemIcon(item_r17) ? 0 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.itemLabelFilterParts(item_r17));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.itemDescription(item_r17) ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.hasItemCounter(item_r17) ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.showTabsItemToggle(item_r17) ? 7 : -1);
  }
}
function AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 72);
    \u0275\u0275listener("click", function AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_2_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r18);
      const item_r17 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.selectItem(item_r17, $event));
    });
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_2_Conditional_1_Template, 1, 1)(2, AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_2_Conditional_2_Template, 8, 4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r17 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("app-menu__tabs-item--active", ctx_r1.isItemActive(item_r17))("app-menu__tabs-item--disabled", ctx_r1.isItemDisabled(item_r17))("app-menu__tabs-item--with-description", ctx_r1.itemDescription(item_r17))("app-menu__tabs-item--layout-icon", ctx_r1.isIconLayoutItem(item_r17));
    \u0275\u0275property("ngClass", ctx_r1.itemPaletteClass(item_r17))("disabled", ctx_r1.isItemDisabled(item_r17))("title", ctx_r1.itemAriaLabel(item_r17) || ctx_r1.itemLabel(item_r17));
    \u0275\u0275attribute("role", ctx_r1.itemRole(item_r17))("aria-checked", ctx_r1.isItemChecked(item_r17))("aria-label", ctx_r1.itemAriaLabel(item_r17));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isIconLayoutItem(item_r17) ? 1 : 2);
  }
}
function AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_0_Template, 1, 0, "div", 69)(1, AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_1_Template, 5, 5, "div", 70)(2, AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Conditional_2_Template, 3, 15, "button", 71);
  }
  if (rf & 2) {
    const item_r17 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275conditional(ctx_r1.isDivider(item_r17) ? 0 : ctx_r1.isSection(item_r17) ? 1 : 2);
  }
}
function AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 60);
    \u0275\u0275text(1, "No matches");
    \u0275\u0275elementEnd();
  }
}
function AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 59)(1, "div", 68);
    \u0275\u0275repeaterCreate(2, AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_For_3_Template, 3, 1, null, null, \u0275\u0275componentInstance().trackByItemId, true);
    \u0275\u0275conditionalCreate(4, AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_Conditional_4_Template, 2, 0, "div", 60);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const group_r20 = ctx;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275attribute("id", ctx_r1.tabsPanelId(group_r20))("aria-labelledby", ctx_r1.showTabsBar() ? ctx_r1.tabsId(group_r20) : null);
    \u0275\u0275advance();
    \u0275\u0275styleProp("--app-menu-tabs-columns", ctx_r1.tabsColumnCount());
    \u0275\u0275classProp("app-menu__tabs-items--fixed-columns", ctx_r1.tabsColumnCount() !== null)("app-menu__tabs-items--icon-list", ctx_r1.isTabsIconList(group_r20));
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.tabsGroupItems(group_r20));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r1.hasVisibleTabsItems(group_r20) ? 4 : -1);
  }
}
function AppMenuComponent_Conditional_3_Conditional_4_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 60);
    \u0275\u0275text(1, "No matches");
    \u0275\u0275elementEnd();
  }
}
function AppMenuComponent_Conditional_3_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 36);
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_3_Conditional_4_Conditional_1_Template, 6, 3, "div", 57);
    \u0275\u0275conditionalCreate(2, AppMenuComponent_Conditional_3_Conditional_4_Conditional_2_Template, 3, 1, "div", 58);
    \u0275\u0275conditionalCreate(3, AppMenuComponent_Conditional_3_Conditional_4_Conditional_3_Template, 5, 9, "div", 59)(4, AppMenuComponent_Conditional_3_Conditional_4_Conditional_4_Template, 2, 0, "div", 60);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isTabsFilterable() ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.showTabsBar() ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_4_0 = ctx_r1.activeTabsGroup()) ? 3 : 4, tmp_4_0);
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_Conditional_0_Conditional_0_For_8_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const action_r23 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.itemIcon(action_r23));
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_Conditional_0_Conditional_0_For_8_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const action_r23 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r1.itemLabel(action_r23)));
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_Conditional_0_Conditional_0_For_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 88);
    \u0275\u0275listener("click", function AppMenuComponent_Conditional_3_Conditional_5_Conditional_0_Conditional_0_For_8_Template_button_click_0_listener($event) {
      const action_r23 = \u0275\u0275restoreView(_r22).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r1.selectBranchHeaderAction(action_r23, $event));
    });
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_3_Conditional_5_Conditional_0_Conditional_0_For_8_Conditional_1_Template, 2, 1, "mat-icon");
    \u0275\u0275conditionalCreate(2, AppMenuComponent_Conditional_3_Conditional_5_Conditional_0_Conditional_0_For_8_Conditional_2_Template, 3, 3, "span");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const action_r23 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275classProp("app-menu__branch-action--icon-only", !ctx_r1.itemLabel(action_r23));
    \u0275\u0275property("ngClass", ctx_r1.itemPaletteClass(action_r23))("disabled", ctx_r1.isItemDisabled(action_r23))("title", ctx_r1.itemAriaLabel(action_r23) || ctx_r1.itemLabel(action_r23));
    \u0275\u0275attribute("aria-label", ctx_r1.itemAriaLabel(action_r23));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.itemIcon(action_r23) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.itemLabel(action_r23) ? 2 : -1);
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_Conditional_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 84)(1, "button", 85);
    \u0275\u0275listener("click", function AppMenuComponent_Conditional_3_Conditional_5_Conditional_0_Conditional_0_Template_button_click_1_listener($event) {
      \u0275\u0275restoreView(_r21);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.closeActiveBranch($event));
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "arrow_back");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "span", 86);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(7, AppMenuComponent_Conditional_3_Conditional_5_Conditional_0_Conditional_0_For_8_Template, 3, 8, "button", 87, \u0275\u0275componentInstance().trackByItemId, true);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const branch_r24 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(6, 1, ctx_r1.itemLabel(branch_r24)));
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.branchHeaderActions(branch_r24));
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AppMenuComponent_Conditional_3_Conditional_5_Conditional_0_Conditional_0_Template, 9, 3, "div", 84);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional(ctx_r1.showBranchBack ? 0 : -1);
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 89);
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.itemIcon(item_r25));
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_1_For_6_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const action_r27 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.itemIcon(action_r27));
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_1_For_6_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const action_r27 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r1.itemLabel(action_r27)));
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_1_For_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r26 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 94);
    \u0275\u0275listener("click", function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_1_For_6_Template_button_click_0_listener($event) {
      const action_r27 = \u0275\u0275restoreView(_r26).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r1.selectBranchHeaderAction(action_r27, $event));
    });
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_1_For_6_Conditional_1_Template, 2, 1, "mat-icon");
    \u0275\u0275conditionalCreate(2, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_1_For_6_Conditional_2_Template, 3, 3, "span");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const action_r27 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275classProp("app-menu__section-action--active", ctx_r1.isItemActive(action_r27));
    \u0275\u0275property("ngClass", ctx_r1.itemPaletteClass(action_r27))("disabled", ctx_r1.isItemDisabled(action_r27))("title", ctx_r1.itemAriaLabel(action_r27) || ctx_r1.itemLabel(action_r27));
    \u0275\u0275attribute("aria-pressed", ctx_r1.isToggleItem(action_r27) ? ctx_r1.isItemActive(action_r27) : null)("aria-label", ctx_r1.itemAriaLabel(action_r27));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.itemIcon(action_r27) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.itemLabel(action_r27) ? 2 : -1);
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 90);
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_1_Conditional_1_Template, 2, 1, "mat-icon");
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(5, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_1_For_6_Template, 3, 9, "button", 93, \u0275\u0275componentInstance().trackByItemId, true);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("ngClass", ctx_r1.itemPaletteClass(item_r25));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.itemIcon(item_r25) ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 3, ctx_r1.itemLabel(item_r25)));
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.itemHeaderActions(item_r25));
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r28 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 95);
    \u0275\u0275listener("click", function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_2_Template_div_click_0_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275elementStart(1, "app-menu-rate", 96);
    \u0275\u0275listener("valueChange", function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_2_Template_app_menu_rate_valueChange_1_listener($event) {
      \u0275\u0275restoreView(_r28);
      const item_r25 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.updateRateItemValue(item_r25, $event));
    })("scoreSelect", function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_2_Template_app_menu_rate_scoreSelect_1_listener($event) {
      \u0275\u0275restoreView(_r28);
      const item_r25 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.selectRateItem(item_r25, $event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("app-menu__rate-item--disabled", ctx_r1.isItemDisabled(item_r25));
    \u0275\u0275advance();
    \u0275\u0275property("config", ctx_r1.itemRateConfig(item_r25));
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Conditional_1_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r30 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "img", 9);
    \u0275\u0275listener("error", function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Conditional_1_Conditional_1_Template_img_error_0_listener($event) {
      \u0275\u0275restoreView(_r30);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.revealImageFallback($event));
    })("load", function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Conditional_1_Conditional_1_Template_img_load_0_listener($event) {
      \u0275\u0275restoreView(_r30);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.hideImageFallback($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Conditional_1_Conditional_1_Conditional_1_Template, 2, 1, "span", 10);
  }
  if (rf & 2) {
    let tmp_18_0;
    const item_r25 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("src", ctx, \u0275\u0275sanitizeUrl)("alt", ctx_r1.itemImageAlt(item_r25));
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_18_0 = ctx_r1.itemImageFallback(item_r25)) ? 1 : -1, tmp_18_0);
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.itemImageFallback(item_r25));
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 98);
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Conditional_1_Conditional_1_Template, 2, 3)(2, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Conditional_1_Conditional_2_Template, 2, 1, "span");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_14_0;
    const item_r25 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_14_0 = ctx_r1.itemImageUrl(item_r25)) ? 1 : 2, tmp_14_0);
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 108);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("app-menu__item-icon--symbol", ctx_r1.isSymbolIcon(ctx_r1.itemIcon(item_r25)));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.itemIcon(item_r25));
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 109);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("app-menu__counter--pulse", ctx_r1.isCounterPulsing(ctx_r1.itemHeaderBadgeKey(item_r25)));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.itemHeaderBadgeLabel(item_r25), " ");
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 81);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("app-menu__counter--alert", item_r25.counterTone === "alert")("app-menu__counter--success", item_r25.counterTone === "success")("app-menu__counter--pulse", ctx_r1.isCounterPulsing(ctx_r1.itemCounterKey(item_r25)));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.itemCounterLabel(item_r25), " ");
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Conditional_10_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 110);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r1.itemDescription(item_r25)));
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Conditional_10_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 111);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r1.itemDetail(item_r25)));
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 104);
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Conditional_10_Conditional_1_Template, 3, 3, "span", 110);
    \u0275\u0275conditionalCreate(2, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Conditional_10_Conditional_2_Template, 3, 3, "span", 111);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.itemDescription(item_r25) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.itemDetail(item_r25) && ctx_r1.itemVisualLayout(item_r25) === "pill" ? 2 : -1);
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 105);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r1.itemDetail(item_r25)));
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 106);
    \u0275\u0275text(1, "done");
    \u0275\u0275elementEnd();
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 107);
    \u0275\u0275text(1, "chevron_right");
    \u0275\u0275elementEnd();
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r29 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "a", 97);
    \u0275\u0275listener("click", function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Template_a_click_0_listener($event) {
      \u0275\u0275restoreView(_r29);
      const item_r25 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.selectLinkItem(item_r25, $event));
    });
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Conditional_1_Template, 3, 1, "span", 98)(2, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Conditional_2_Template, 2, 3, "mat-icon", 99);
    \u0275\u0275elementStart(3, "span", 100)(4, "span", 101)(5, "span", 102);
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(8, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Conditional_8_Template, 2, 3, "span", 103);
    \u0275\u0275conditionalCreate(9, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Conditional_9_Template, 2, 7, "span", 78);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(10, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Conditional_10_Template, 3, 2, "span", 104);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(11, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Conditional_11_Template, 3, 3, "span", 105);
    \u0275\u0275conditionalCreate(12, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Conditional_12_Template, 2, 0, "mat-icon", 106);
    \u0275\u0275conditionalCreate(13, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Conditional_13_Template, 2, 0, "mat-icon", 107);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("app-menu__item--surface-tinted", ctx_r1.itemSurface(item_r25) === "tinted")("app-menu__item--layout-pill", ctx_r1.itemVisualLayout(item_r25) === "pill")("app-menu__item--active", ctx_r1.isItemActive(item_r25))("app-menu__item--disabled", ctx_r1.isItemDisabled(item_r25))("app-menu__item--with-description", ctx_r1.itemDescription(item_r25));
    \u0275\u0275property("ngClass", ctx_r1.itemPaletteClass(item_r25));
    \u0275\u0275attribute("href", ctx_r1.isItemDisabled(item_r25) ? null : ctx_r1.itemHref(item_r25), \u0275\u0275sanitizeUrl)("target", ctx_r1.itemTarget(item_r25))("rel", ctx_r1.itemRel(item_r25))("role", ctx_r1.itemRole(item_r25))("aria-disabled", ctx_r1.isItemDisabled(item_r25) ? "true" : null)("aria-checked", ctx_r1.isItemChecked(item_r25))("aria-label", ctx_r1.itemAriaLabel(item_r25));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.itemImageUrl(item_r25) || ctx_r1.itemImageFallback(item_r25) ? 1 : ctx_r1.itemIcon(item_r25) ? 2 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("app-menu__item-main--with-body", ctx_r1.hasItemBody(item_r25));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(7, 28, ctx_r1.itemLabel(item_r25)));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.hasItemHeaderBadge(item_r25) ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.hasItemCounter(item_r25) ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.hasItemBody(item_r25) ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.itemDetail(item_r25) && ctx_r1.itemVisualLayout(item_r25) !== "pill" ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.showItemCheck(item_r25) ? 12 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.hasNestedItems(item_r25) ? 13 : -1);
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Conditional_2_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r32 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "img", 9);
    \u0275\u0275listener("error", function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Conditional_2_Conditional_1_Template_img_error_0_listener($event) {
      \u0275\u0275restoreView(_r32);
      const ctx_r1 = \u0275\u0275nextContext(7);
      return \u0275\u0275resetView(ctx_r1.revealImageFallback($event));
    })("load", function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Conditional_2_Conditional_1_Template_img_load_0_listener($event) {
      \u0275\u0275restoreView(_r32);
      const ctx_r1 = \u0275\u0275nextContext(7);
      return \u0275\u0275resetView(ctx_r1.hideImageFallback($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Conditional_2_Conditional_1_Conditional_1_Template, 2, 1, "span", 10);
  }
  if (rf & 2) {
    let tmp_19_0;
    const item_r25 = \u0275\u0275nextContext(4).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("src", ctx, \u0275\u0275sanitizeUrl)("alt", ctx_r1.itemImageAlt(item_r25));
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_19_0 = ctx_r1.itemImageFallback(item_r25)) ? 1 : -1, tmp_19_0);
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Conditional_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext(4).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.itemImageFallback(item_r25));
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 98);
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Conditional_2_Conditional_1_Template, 2, 3)(2, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Conditional_2_Conditional_2_Template, 2, 1, "span");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_15_0;
    const item_r25 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_15_0 = ctx_r1.itemImageUrl(item_r25)) ? 1 : 2, tmp_15_0);
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 108);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("app-menu__item-icon--symbol", ctx_r1.isSymbolIcon(ctx_r1.itemIcon(item_r25)));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.itemIcon(item_r25));
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 109);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("app-menu__counter--pulse", ctx_r1.isCounterPulsing(ctx_r1.itemHeaderBadgeKey(item_r25)));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.itemHeaderBadgeLabel(item_r25), " ");
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 81);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("app-menu__counter--alert", item_r25.counterTone === "alert")("app-menu__counter--success", item_r25.counterTone === "success")("app-menu__counter--pulse", ctx_r1.isCounterPulsing(ctx_r1.itemCounterKey(item_r25)));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.itemCounterLabel(item_r25), " ");
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Conditional_11_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 110);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext(4).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r1.itemDescription(item_r25)));
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Conditional_11_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 111);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext(4).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r1.itemDetail(item_r25)));
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 104);
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Conditional_11_Conditional_1_Template, 3, 3, "span", 110);
    \u0275\u0275conditionalCreate(2, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Conditional_11_Conditional_2_Template, 3, 3, "span", 111);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.itemDescription(item_r25) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.itemDetail(item_r25) && ctx_r1.itemVisualLayout(item_r25) === "pill" ? 2 : -1);
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 105);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r1.itemDetail(item_r25)));
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 106);
    \u0275\u0275text(1, "done");
    \u0275\u0275elementEnd();
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 107);
    \u0275\u0275text(1, "chevron_right");
    \u0275\u0275elementEnd();
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r31 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 114)(1, "button", 115);
    \u0275\u0275listener("click", function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Template_button_click_1_listener($event) {
      \u0275\u0275restoreView(_r31);
      const item_r25 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.selectItem(item_r25, $event));
    });
    \u0275\u0275conditionalCreate(2, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Conditional_2_Template, 3, 1, "span", 98)(3, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Conditional_3_Template, 2, 3, "mat-icon", 99);
    \u0275\u0275elementStart(4, "span", 100)(5, "span", 101)(6, "span", 102);
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(9, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Conditional_9_Template, 2, 3, "span", 103);
    \u0275\u0275conditionalCreate(10, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Conditional_10_Template, 2, 7, "span", 78);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(11, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Conditional_11_Template, 3, 2, "span", 104);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(12, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Conditional_12_Template, 3, 3, "span", 105);
    \u0275\u0275conditionalCreate(13, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Conditional_13_Template, 2, 0, "mat-icon", 106);
    \u0275\u0275conditionalCreate(14, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Conditional_14_Template, 2, 0, "mat-icon", 107);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "button", 116);
    \u0275\u0275listener("click", function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Template_button_click_15_listener($event) {
      \u0275\u0275restoreView(_r31);
      const item_r25 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.removeItem(item_r25, $event));
    });
    \u0275\u0275elementStart(16, "mat-icon");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("app-menu__item-row--pill", ctx_r1.itemVisualLayout(item_r25) === "pill");
    \u0275\u0275property("ngClass", ctx_r1.itemPaletteClass(item_r25));
    \u0275\u0275advance();
    \u0275\u0275classProp("app-menu__item--surface-tinted", ctx_r1.itemSurface(item_r25) === "tinted")("app-menu__item--layout-pill", ctx_r1.itemVisualLayout(item_r25) === "pill")("app-menu__item--active", ctx_r1.isItemActive(item_r25))("app-menu__item--disabled", ctx_r1.isItemDisabled(item_r25))("app-menu__item--with-description", ctx_r1.itemDescription(item_r25));
    \u0275\u0275property("disabled", ctx_r1.isItemDisabled(item_r25));
    \u0275\u0275attribute("role", ctx_r1.itemRole(item_r25))("aria-checked", ctx_r1.isItemChecked(item_r25))("aria-label", ctx_r1.itemAriaLabel(item_r25));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.itemImageUrl(item_r25) || ctx_r1.itemImageFallback(item_r25) ? 2 : ctx_r1.itemIcon(item_r25) ? 3 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("app-menu__item-main--with-body", ctx_r1.hasItemBody(item_r25));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 30, ctx_r1.itemLabel(item_r25)));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.hasItemHeaderBadge(item_r25) ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.hasItemCounter(item_r25) ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.hasItemBody(item_r25) ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.itemDetail(item_r25) && ctx_r1.itemVisualLayout(item_r25) !== "pill" ? 12 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.showItemCheck(item_r25) ? 13 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.hasNestedItems(item_r25) ? 14 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.isItemDisabled(item_r25));
    \u0275\u0275attribute("aria-label", ctx_r1.itemRemoveAriaLabel(item_r25));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.itemRemoveIcon(item_r25));
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r34 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "img", 9);
    \u0275\u0275listener("error", function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Conditional_1_Conditional_1_Template_img_error_0_listener($event) {
      \u0275\u0275restoreView(_r34);
      const ctx_r1 = \u0275\u0275nextContext(7);
      return \u0275\u0275resetView(ctx_r1.revealImageFallback($event));
    })("load", function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Conditional_1_Conditional_1_Template_img_load_0_listener($event) {
      \u0275\u0275restoreView(_r34);
      const ctx_r1 = \u0275\u0275nextContext(7);
      return \u0275\u0275resetView(ctx_r1.hideImageFallback($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Template, 2, 1, "span", 10);
  }
  if (rf & 2) {
    let tmp_19_0;
    const item_r25 = \u0275\u0275nextContext(4).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("src", ctx, \u0275\u0275sanitizeUrl)("alt", ctx_r1.itemImageAlt(item_r25));
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_19_0 = ctx_r1.itemImageFallback(item_r25)) ? 1 : -1, tmp_19_0);
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext(4).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.itemImageFallback(item_r25));
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 98);
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Conditional_1_Conditional_1_Template, 2, 3)(2, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Conditional_1_Conditional_2_Template, 2, 1, "span");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_15_0;
    const item_r25 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_15_0 = ctx_r1.itemImageUrl(item_r25)) ? 1 : 2, tmp_15_0);
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 108);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("app-menu__item-icon--symbol", ctx_r1.isSymbolIcon(ctx_r1.itemIcon(item_r25)));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.itemIcon(item_r25));
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 109);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("app-menu__counter--pulse", ctx_r1.isCounterPulsing(ctx_r1.itemHeaderBadgeKey(item_r25)));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.itemHeaderBadgeLabel(item_r25), " ");
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 81);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("app-menu__counter--alert", item_r25.counterTone === "alert")("app-menu__counter--success", item_r25.counterTone === "success")("app-menu__counter--pulse", ctx_r1.isCounterPulsing(ctx_r1.itemCounterKey(item_r25)));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.itemCounterLabel(item_r25), " ");
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Conditional_10_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 110);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext(4).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r1.itemDescription(item_r25)));
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Conditional_10_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 111);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext(4).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r1.itemDetail(item_r25)));
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 104);
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Conditional_10_Conditional_1_Template, 3, 3, "span", 110);
    \u0275\u0275conditionalCreate(2, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Conditional_10_Conditional_2_Template, 3, 3, "span", 111);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.itemDescription(item_r25) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.itemDetail(item_r25) && ctx_r1.itemVisualLayout(item_r25) === "pill" ? 2 : -1);
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 105);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r1.itemDetail(item_r25)));
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 106);
    \u0275\u0275text(1, "done");
    \u0275\u0275elementEnd();
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 107);
    \u0275\u0275text(1, "chevron_right");
    \u0275\u0275elementEnd();
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r33 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 117);
    \u0275\u0275listener("click", function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r33);
      const item_r25 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.selectItem(item_r25, $event));
    });
    \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Conditional_1_Template, 3, 1, "span", 98)(2, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Conditional_2_Template, 2, 3, "mat-icon", 99);
    \u0275\u0275elementStart(3, "span", 100)(4, "span", 101)(5, "span", 102);
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(8, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Conditional_8_Template, 2, 3, "span", 103);
    \u0275\u0275conditionalCreate(9, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Conditional_9_Template, 2, 7, "span", 78);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(10, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Conditional_10_Template, 3, 2, "span", 104);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(11, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Conditional_11_Template, 3, 3, "span", 105);
    \u0275\u0275conditionalCreate(12, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Conditional_12_Template, 2, 0, "mat-icon", 106);
    \u0275\u0275conditionalCreate(13, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Conditional_13_Template, 2, 0, "mat-icon", 107);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("app-menu__item--surface-tinted", ctx_r1.itemSurface(item_r25) === "tinted")("app-menu__item--layout-pill", ctx_r1.itemVisualLayout(item_r25) === "pill")("app-menu__item--active", ctx_r1.isItemActive(item_r25))("app-menu__item--disabled", ctx_r1.isItemDisabled(item_r25))("app-menu__item--with-description", ctx_r1.itemDescription(item_r25));
    \u0275\u0275property("ngClass", ctx_r1.itemPaletteClass(item_r25))("disabled", ctx_r1.isItemDisabled(item_r25));
    \u0275\u0275attribute("role", ctx_r1.itemRole(item_r25))("aria-checked", ctx_r1.isItemChecked(item_r25))("aria-label", ctx_r1.itemAriaLabel(item_r25));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.itemImageUrl(item_r25) || ctx_r1.itemImageFallback(item_r25) ? 1 : ctx_r1.itemIcon(item_r25) ? 2 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("app-menu__item-main--with-body", ctx_r1.hasItemBody(item_r25));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(7, 25, ctx_r1.itemLabel(item_r25)));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.hasItemHeaderBadge(item_r25) ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.hasItemCounter(item_r25) ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.hasItemBody(item_r25) ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.itemDetail(item_r25) && ctx_r1.itemVisualLayout(item_r25) !== "pill" ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.showItemCheck(item_r25) ? 12 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.hasNestedItems(item_r25) ? 13 : -1);
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_0_Template, 18, 32, "div", 112)(1, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Conditional_1_Template, 14, 27, "button", 113);
  }
  if (rf & 2) {
    const item_r25 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional(ctx_r1.isItemRemovable(item_r25) ? 0 : 1);
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_0_Template, 1, 0, "div", 89)(1, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_1_Template, 7, 5, "div", 90)(2, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_2_Template, 2, 3, "div", 91)(3, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_3_Template, 14, 30, "a", 92)(4, AppMenuComponent_Conditional_3_Conditional_5_For_3_Conditional_4_Template, 2, 1);
  }
  if (rf & 2) {
    const item_r25 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional(ctx_r1.isDivider(item_r25) ? 0 : ctx_r1.isSection(item_r25) ? 1 : ctx_r1.isRateItem(item_r25) ? 2 : ctx_r1.itemHref(item_r25) ? 3 : 4);
  }
}
function AppMenuComponent_Conditional_3_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AppMenuComponent_Conditional_3_Conditional_5_Conditional_0_Template, 1, 1);
    \u0275\u0275elementStart(1, "div", 83);
    \u0275\u0275repeaterCreate(2, AppMenuComponent_Conditional_3_Conditional_5_For_3_Template, 5, 1, null, null, \u0275\u0275componentInstance().trackByItemId, true);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional((tmp_2_0 = ctx_r1.activeBranch) ? 0 : -1, tmp_2_0);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.visibleListItems);
  }
}
function AppMenuComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AppMenuComponent_Conditional_3_Conditional_0_Template, 1, 0, "button", 32);
    \u0275\u0275elementStart(1, "div", 33);
    \u0275\u0275listener("click", function AppMenuComponent_Conditional_3_Template_div_click_1_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275conditionalCreate(2, AppMenuComponent_Conditional_3_Conditional_2_Template, 3, 3, "div", 34);
    \u0275\u0275conditionalCreate(3, AppMenuComponent_Conditional_3_Conditional_3_Template, 3, 0, "div", 35)(4, AppMenuComponent_Conditional_3_Conditional_4_Template, 5, 3, "div", 36)(5, AppMenuComponent_Conditional_3_Conditional_5_Template, 4, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r1.showMobileBackdrop ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275classProp("app-menu__panel--inline", ctx_r1.usesInlinePanel)("app-menu__panel--dropdown-list", !ctx_r1.currentTabbedModelLayout && (ctx_r1.isDropdownListKind || ctx_r1.isInlineRowLayout || ctx_r1.activeBranch))("app-menu__panel--fab", ctx_r1.isFabKind)("app-menu__panel--tabs", ctx_r1.currentTabbedModelLayout)("app-menu__panel--has-branch-header", ctx_r1.showBranchBack)("app-menu__panel--open-up", ctx_r1.resolvedOpenUp)("app-menu__panel--align-start", ctx_r1.resolvedPanelAlign === "start")("app-menu__panel--dock-to-host", ctx_r1.panelDockToHost);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.resolvedTitle ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isInlineGridLayout && ctx_r1.hasMenuNodes ? 3 : ctx_r1.currentTabbedModelLayout && ctx_r1.hasTabsGroups ? 4 : 5);
  }
}
var AppMenuComponent = class _AppMenuComponent {
  static COUNTER_PULSE_DURATION_MS = 1600;
  static DESKTOP_MARGIN_PX = 8;
  static DESKTOP_MIN_PANEL_WIDTH_PX = 196;
  static DRAG_ACTIVATION_MOVE_TOLERANCE_PX = 6;
  hostRef = inject(ElementRef);
  changeDetectorRef = inject(ChangeDetectorRef);
  i18n = inject(I18nService);
  kind = "inline";
  layout = "row";
  title = null;
  filterable = false;
  items = [];
  model = null;
  groups = [];
  value = null;
  trigger = null;
  openUp = false;
  panelAlign = "auto";
  panelMode = "auto";
  panelGapPx = null;
  panelDockToHost = false;
  mobileBreakpointPx = 760;
  closeOnSelect = true;
  draggable = false;
  dragActivationDelayMs = 0;
  openChange = new EventEmitter();
  itemSelect = new EventEmitter();
  dragPositionChange = new EventEmitter();
  dragStateChange = new EventEmitter();
  internalOpen = false;
  activeBranchPath = [];
  activeTabsGroupId = null;
  tabsFilterText = "";
  counterValueByKey = /* @__PURE__ */ new Map();
  counterPulseTimerByKey = /* @__PURE__ */ new Map();
  pulsingCounterKeys = /* @__PURE__ */ new Set();
  controlAttached = false;
  controlDisabled = false;
  controlValue = null;
  onControlChange = () => void 0;
  onControlTouched = () => void 0;
  isMobileViewport = false;
  internalDragPosition = { x: 0, y: 0 };
  activeDrag = null;
  dragActivationTimer = null;
  suppressNextTriggerClick = false;
  suppressClickTimer = null;
  get open() {
    return this.internalOpen;
  }
  set open(value) {
    const nextOpen = value === true;
    const opened = nextOpen && !this.internalOpen;
    this.internalOpen = nextOpen;
    if (!this.internalOpen) {
      this.activeBranchPath = [];
      this.tabsFilterText = "";
    } else if (opened) {
      this.restoreSelectedBranchPath();
      this.syncActiveTabsGroup();
    }
  }
  get dragPosition() {
    return this.internalDragPosition;
  }
  set dragPosition(value) {
    this.internalDragPosition = this.normalizedDragPosition(value);
  }
  constructor() {
    this.syncMobileViewport();
  }
  ngDoCheck() {
    this.syncCounterPulseState();
    this.syncOpenPanelState();
  }
  ngOnDestroy() {
    for (const timerId of this.counterPulseTimerByKey.values()) {
      clearTimeout(timerId);
    }
    this.counterPulseTimerByKey.clear();
    if (this.suppressClickTimer) {
      clearTimeout(this.suppressClickTimer);
      this.suppressClickTimer = null;
    }
    this.clearDragActivationTimer();
  }
  writeValue(value) {
    this.controlAttached = true;
    if (this.controlValuesEqual(this.controlValue, value)) {
      return;
    }
    this.controlValue = value;
    this.changeDetectorRef.markForCheck();
  }
  registerOnChange(fn) {
    this.controlAttached = true;
    this.onControlChange = fn;
  }
  registerOnTouched(fn) {
    this.controlAttached = true;
    this.onControlTouched = fn;
  }
  setDisabledState(isDisabled) {
    this.controlAttached = true;
    if (this.controlDisabled === isDisabled) {
      return;
    }
    this.controlDisabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }
  hostClass = true;
  get hostInlineKindClass() {
    return this.isInlineMenuKind;
  }
  get hostRowLayoutClass() {
    return this.isInlineRowLayout;
  }
  get hostGridLayoutClass() {
    return this.isInlineGridLayout;
  }
  get hostInlineRowBigClass() {
    return this.isInlineRowBig;
  }
  get hostInlineRowLabelledActionClass() {
    return this.isInlineRowLayout && this.actionRowItems.some((item) => this.itemVisualLayout(item) === "action" && !!this.actionRowItemLabel(item));
  }
  get hostFabKindClass() {
    return this.isFabKind;
  }
  get hostDraggableClass() {
    return this.canDrag;
  }
  get hostDraggingClass() {
    return this.activeDrag?.activated === true;
  }
  get hostDragTransform() {
    if (!this.canDrag) {
      return null;
    }
    return `translate3d(${this.internalDragPosition.x}px, ${this.internalDragPosition.y}px, 0)`;
  }
  get hostSelectKindClass() {
    return this.kind === "select";
  }
  get hostTabbedModelLayoutClass() {
    return this.isTabbedModelLayout || this.activeBranchTabbedModelLayout;
  }
  get hostDesktopLayoutClass() {
    return this.resolvedLayout === "desktop";
  }
  get hostMobileLayoutClass() {
    return this.resolvedLayout === "mobile";
  }
  get hostOpenClass() {
    return this.panelVisible;
  }
  get hostContentActionsClass() {
    return this.model?.actionSizing === "content";
  }
  get hostCompactClass() {
    return this.hasCompactDensity(this.model) || this.hasCompactDensity(this.currentMenuModel());
  }
  get hostInlinePanelClass() {
    return this.usesInlinePanel;
  }
  get hostPanelDockedClass() {
    return this.panelDockToHost;
  }
  get hostPanelBottomDockedClass() {
    return this.isBottomPanelMode;
  }
  get hostPanelGapStyle() {
    if (this.panelGapPx === null || this.panelGapPx === void 0) {
      return null;
    }
    return `${Math.max(0, Number(this.panelGapPx) || 0)}px`;
  }
  get hostPanelAvailableHeightStyle() {
    if (this.resolvedLayout === "mobile" || !this.panelVisible || this.usesInlinePanel || this.panelDockToHost) {
      return null;
    }
    const rect = this.hostRect();
    if (!rect) {
      return null;
    }
    const bounds = this.layoutBounds();
    const availableHeight = this.resolvedOpenUp ? rect.top - bounds.top : bounds.bottom - rect.bottom;
    const configuredGap = Number(this.panelGapPx);
    const boundaryInset = Math.max(_AppMenuComponent.DESKTOP_MARGIN_PX, Number.isFinite(configuredGap) ? Math.max(0, configuredGap) : 0);
    return `${Math.max(0, Math.floor(availableHeight - boundaryInset))}px`;
  }
  get hostTriggerFieldClass() {
    return this.triggerLayout() === "field";
  }
  get hostTriggerPillClass() {
    return this.triggerLayout() === "pill";
  }
  get hostTriggerIconClass() {
    return this.triggerLayout() === "icon";
  }
  onViewportResize() {
    this.syncMobileViewport();
    this.clampDragPositionToViewport();
  }
  onWindowPointerMove(event) {
    const drag = this.activeDrag;
    if (!drag || event.pointerId !== drag.pointerId) {
      return;
    }
    const deltaX = event.clientX - drag.startClientX;
    const deltaY = event.clientY - drag.startClientY;
    if (!drag.moved && Math.hypot(deltaX, deltaY) >= _AppMenuComponent.DRAG_ACTIVATION_MOVE_TOLERANCE_PX) {
      drag.moved = true;
    }
    if (!drag.activated) {
      if (drag.moved) {
        drag.activationCancelled = true;
        this.clearDragActivationTimer();
      }
      return;
    }
    const nextPosition = this.clampDragPosition({
      x: drag.startPosition.x + deltaX,
      y: drag.startPosition.y + deltaY
    }, drag.baseRect);
    event.preventDefault();
    if (nextPosition.x !== this.internalDragPosition.x || nextPosition.y !== this.internalDragPosition.y) {
      this.internalDragPosition = nextPosition;
      this.dragPositionChange.emit(nextPosition);
    }
    this.emitDragState("move", event, drag, nextPosition);
    this.changeDetectorRef.markForCheck();
  }
  onWindowPointerEnd(event) {
    const drag = this.activeDrag;
    if (!drag || event.pointerId !== drag.pointerId) {
      return;
    }
    this.clearDragActivationTimer();
    this.activeDrag = null;
    if (drag.activated || drag.activationCancelled) {
      this.suppressNextTriggerAction();
    }
    if (drag.activated) {
      this.emitDragState(event.type === "pointercancel" ? "cancel" : "end", event, drag, this.internalDragPosition);
    }
    this.changeDetectorRef.markForCheck();
  }
  onEscapePressed(event) {
    if (!this.open || this.isFixedPanelMode) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.setOpen(false);
  }
  onDocumentPointerDown(event) {
    if (!this.open || this.usesInlinePanel || this.isFixedPanelMode || this.resolvedLayout === "mobile" && !this.isAnchoredOverlayKind) {
      return;
    }
    const target = event.target;
    if (target && this.hostRef.nativeElement.contains(target)) {
      return;
    }
    this.setOpen(false);
  }
  get resolvedLayout() {
    if (this.isBottomPanelMode) {
      return "desktop";
    }
    if (this.panelMode === "sheet") {
      return "mobile";
    }
    if (this.panelMode === "anchored") {
      return "desktop";
    }
    return this.isMobileViewport ? "mobile" : "desktop";
  }
  get usesInlinePanel() {
    return this.isInlineGridLayout || this.isTabbedModelLayout && !this.hasTrigger;
  }
  get isInlineMenuKind() {
    return this.kind === "inline";
  }
  get isInlineRowLayout() {
    return this.isInlineMenuKind && this.layout === "row";
  }
  get isInlineRowBig() {
    return this.isInlineRowLayout && this.actionRowItems.some((item) => this.itemVisualLayout(item) === "big");
  }
  get isInlineGridLayout() {
    return this.isInlineMenuKind && this.layout === "grid";
  }
  get isFabKind() {
    return this.kind === "fab";
  }
  get canDrag() {
    return this.draggable && this.isFabKind && !this.triggerDisabled();
  }
  get isSelectKind() {
    return this.kind === "select";
  }
  get isTabbedModelLayout() {
    return this.model?.layout === "tabs";
  }
  get activeBranchTabbedModelLayout() {
    return this.activeBranch !== null && this.currentTabbedModelLayout;
  }
  get currentTabbedModelLayout() {
    return this.currentMenuModel()?.layout === "tabs";
  }
  get isDropdownListKind() {
    return this.isSelectKind || this.isFabKind;
  }
  get isAnchoredOverlayKind() {
    return this.isDropdownListKind || this.isInlineRowLayout || this.isTabbedModelLayout;
  }
  get isBottomPanelMode() {
    return this.panelMode === "dock" || this.panelMode === "fixed";
  }
  get isFixedPanelMode() {
    return this.panelMode === "fixed";
  }
  get isCustomTriggerAction() {
    return this.trigger?.action === "custom";
  }
  get panelVisible() {
    if (this.isCustomTriggerAction) {
      return false;
    }
    return this.usesInlinePanel || this.open;
  }
  get showMobileBackdrop() {
    return this.open && !this.usesInlinePanel && !this.isAnchoredOverlayKind && this.resolvedLayout === "mobile";
  }
  get resolvedOpenUp() {
    if (this.resolvedLayout === "mobile" || !this.panelVisible || this.usesInlinePanel) {
      return this.openUp;
    }
    if (this.openUp) {
      return true;
    }
    const rect = this.hostRect();
    if (!rect) {
      return false;
    }
    const bounds = this.layoutBounds();
    const spaceAbove = Math.max(0, rect.top - bounds.top - _AppMenuComponent.DESKTOP_MARGIN_PX);
    const spaceBelow = Math.max(0, bounds.bottom - rect.bottom - _AppMenuComponent.DESKTOP_MARGIN_PX);
    const estimatedHeight = this.estimatedPanelHeight();
    return spaceBelow < estimatedHeight && spaceAbove > spaceBelow;
  }
  get resolvedPanelAlign() {
    if (this.panelAlign !== "auto" || this.resolvedLayout === "mobile" || !this.panelVisible || this.usesInlinePanel) {
      return this.panelAlign === "start" ? "start" : "end";
    }
    const rect = this.hostRect();
    if (!rect) {
      return "end";
    }
    const bounds = this.layoutBounds();
    const estimatedWidth = this.estimatedPanelWidth();
    const startOverflow = this.panelHorizontalOverflow("start", rect, bounds, estimatedWidth);
    const endOverflow = this.panelHorizontalOverflow("end", rect, bounds, estimatedWidth);
    if (startOverflow !== endOverflow) {
      return startOverflow < endOverflow ? "start" : "end";
    }
    const spaceRight = Math.max(0, bounds.right - rect.left - _AppMenuComponent.DESKTOP_MARGIN_PX);
    const spaceLeft = Math.max(0, rect.right - bounds.left - _AppMenuComponent.DESKTOP_MARGIN_PX);
    if (spaceRight >= estimatedWidth) {
      return "start";
    }
    if (spaceLeft >= estimatedWidth) {
      return "end";
    }
    return spaceRight >= spaceLeft ? "start" : "end";
  }
  get menuNodes() {
    return appMenuModelGroups(this.model, this.groups);
  }
  get hasMenuNodes() {
    return this.menuNodes.length > 0;
  }
  get tabsGroups() {
    const model = this.currentMenuModel();
    if (model?.layout === "tabs") {
      return appMenuModelGroups(model, this.currentMenuGroupFallback());
    }
    return this.menuNodes;
  }
  get hasTabsGroups() {
    return this.tabsGroups.length > 0;
  }
  get visibleTabsGroups() {
    const query = this.normalizedFilterText();
    if (!query) {
      return this.tabsGroups;
    }
    return this.tabsGroups.map((group) => __spreadProps(__spreadValues({}, group), {
      items: this.groupItems(group).filter((item) => this.itemMatchesFilter(item, query))
    })).filter((group) => this.groupItems(group).length > 0);
  }
  get actionRowItems() {
    if (this.items.length > 0) {
      return this.items;
    }
    const items = [];
    for (const node of this.menuNodes) {
      items.push(...this.groupItems(node));
    }
    return items;
  }
  get hasTrigger() {
    return this.trigger !== null;
  }
  get activeBranch() {
    const branch = this.activeBranchPath[this.activeBranchPath.length - 1] ?? null;
    return branch ? this.currentItemById(branch.id) : null;
  }
  get visibleListItems() {
    if (this.activeBranch) {
      return this.branchListItems(this.activeBranch);
    }
    if (this.items.length > 0) {
      return this.items;
    }
    return this.groupedDropdownItems();
  }
  get showBranchBack() {
    if (!this.activeBranch) {
      return false;
    }
    return this.isInlineRowLayout ? this.activeBranchPath.length > 1 : true;
  }
  get resolvedTitle() {
    return `${this.resolveLiveValue(this.title) ?? ""}`.trim();
  }
  triggerLabel() {
    const configuredLabel = `${this.resolveLiveValue(this.trigger?.label) ?? ""}`.trim();
    return configuredLabel || this.modelSummary().label || this.defaultSelectTriggerLabel();
  }
  usesDefaultSelectTriggerLabel() {
    const configuredLabel = `${this.resolveLiveValue(this.trigger?.label) ?? ""}`.trim();
    const summaryLabel = this.modelSummary().label;
    return !configuredLabel && !summaryLabel && Boolean(this.defaultSelectTriggerLabel());
  }
  triggerIcon() {
    if (this.open) {
      const configuredOpenIcon = this.resolveLiveValue(this.trigger?.closeIcon ?? this.trigger?.openIcon);
      if (configuredOpenIcon !== null && configuredOpenIcon !== void 0) {
        return `${configuredOpenIcon}`.trim();
      }
      const baseIcon = `${this.resolveLiveValue(this.trigger?.icon) ?? ""}`.trim();
      if (this.shouldResolveTriggerIconToClose(baseIcon)) {
        return "close";
      }
      if (!baseIcon && this.isSelectLikeTrigger()) {
        return "";
      }
      return `${baseIcon || "close"}`.trim();
    }
    const configuredIcon = this.resolveLiveValue(this.trigger?.icon);
    if (!configuredIcon && this.isFabKind) {
      return "add";
    }
    if (!configuredIcon && this.isSelectLikeTrigger()) {
      return "";
    }
    return `${configuredIcon ?? "more_vert"}`.trim();
  }
  triggerImageUrl() {
    return `${this.resolveLiveValue(this.trigger?.imageUrl) ?? ""}`.trim();
  }
  triggerImageAlt() {
    return `${this.resolveLiveValue(this.trigger?.imageAlt) ?? this.triggerLabel()}`.trim();
  }
  triggerImageFallback() {
    const configured = `${this.resolveLiveValue(this.trigger?.imageFallback) ?? ""}`.trim();
    return configured || (this.triggerImageUrl() ? this.imageLabelFallback(this.triggerLabel()) : "");
  }
  isSymbolIcon(icon) {
    return `${icon ?? ""}`.trim().length === 1;
  }
  shouldResolveTriggerIconToClose(icon) {
    if (this.triggerLayout() !== "icon" && this.trigger?.hideLabel !== true) {
      return false;
    }
    switch (icon) {
      case "add":
      case "add_box":
      case "add_circle":
      case "more_horiz":
      case "more_vert":
        return true;
      default:
        return false;
    }
  }
  triggerTrailingIcon() {
    const configuredIcon = this.resolveLiveValue(this.open ? this.trigger?.closeTrailingIcon ?? this.trigger?.openTrailingIcon ?? this.trigger?.trailingIcon : this.trigger?.trailingIcon);
    if (configuredIcon !== null && configuredIcon !== void 0) {
      return `${configuredIcon}`.trim();
    }
    if (this.trigger?.hideLabel === true) {
      return "";
    }
    if (this.isCustomTriggerAction) {
      return "";
    }
    if (this.isSelectKind && this.triggerLayout() !== "icon") {
      return "expand_more";
    }
    if (this.isTabbedModelLayout && this.triggerLayout() !== "icon") {
      return "expand_more";
    }
    return "";
  }
  triggerCaretRotates() {
    return !this.isCustomTriggerAction && this.isSelectLikeTrigger();
  }
  triggerAriaLabel() {
    const configured = `${this.resolveLiveValue(this.trigger?.ariaLabel) ?? ""}`.trim();
    if (configured) {
      return configured;
    }
    const label = this.triggerLabel();
    if (label) {
      return this.open ? `Close ${label}` : `Open ${label}`;
    }
    return this.open ? "Close menu" : "Open menu";
  }
  triggerAriaHasPopup() {
    return this.isCustomTriggerAction ? "dialog" : "menu";
  }
  triggerDisabled() {
    return this.controlDisabled || this.resolveBoolean(this.trigger?.disabled);
  }
  triggerPalette() {
    return this.trigger?.palette ?? "default";
  }
  triggerPaletteClass() {
    return this.paletteClass(this.triggerPalette());
  }
  triggerLayout() {
    if (this.trigger?.layout) {
      return this.trigger.layout;
    }
    if (!this.hasTrigger) {
      return "default";
    }
    if (this.isFabKind) {
      return "icon";
    }
    return this.isSelectLikeTrigger() ? "pill" : "default";
  }
  hasTriggerCounter() {
    return this.counterVisible(this.triggerCounter());
  }
  triggerCounterLabel() {
    return this.counterLabel(this.triggerCounter());
  }
  triggerCounterKey() {
    return "trigger";
  }
  isSelectLikeTrigger() {
    return this.isSelectKind || this.isTabbedModelLayout;
  }
  defaultSelectTriggerLabel() {
    return this.isSelectLikeTrigger() && this.triggerLayout() !== "icon" && this.trigger?.hideLabel !== true ? "select.option" : "";
  }
  triggerCounter() {
    const configuredCounter = this.trigger?.counter;
    if (configuredCounter !== null && configuredCounter !== void 0) {
      return configuredCounter;
    }
    return this.modelSummary().counter ?? appMenuAlertCounter(this.items, this.model, this.groups);
  }
  toggleMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.suppressNextTriggerClick) {
      this.suppressNextTriggerClick = false;
      return;
    }
    if (this.triggerDisabled()) {
      return;
    }
    if (this.isCustomTriggerAction) {
      const item = {
        id: `${this.trigger?.id ?? "trigger"}`,
        label: this.trigger?.label,
        icon: this.trigger?.icon,
        kind: "action",
        palette: this.trigger?.palette,
        context: this.trigger?.context
      };
      this.itemSelect.emit({
        id: item.id,
        item,
        context: item.context,
        sourceEvent: event,
        controlValue: this.currentControlEventValue(),
        action: "select"
      });
      return;
    }
    this.setOpen(!this.open);
  }
  startTriggerDrag(event) {
    if (!this.canDrag || !event.isPrimary || event.pointerType === "mouse" && event.button !== 0) {
      return;
    }
    this.clearDragActivationTimer();
    const currentPosition = this.internalDragPosition;
    const rect = this.hostRef.nativeElement.getBoundingClientRect();
    const drag = {
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startPosition: currentPosition,
      baseRect: new DOMRect(rect.left - currentPosition.x, rect.top - currentPosition.y, rect.width, rect.height),
      activated: false,
      activationCancelled: false,
      moved: false,
      sourceEvent: event
    };
    this.activeDrag = drag;
    const activationDelayMs = this.normalizedDragActivationDelayMs();
    if (activationDelayMs === 0) {
      this.activateDrag(drag);
    } else {
      this.dragActivationTimer = setTimeout(() => {
        this.dragActivationTimer = null;
        this.activateDrag(drag);
      }, activationDelayMs);
    }
    event.preventDefault();
    this.changeDetectorRef.markForCheck();
  }
  preventTriggerContextMenu(event) {
    if (!this.canDrag) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
  }
  activateDrag(drag) {
    if (this.activeDrag !== drag || drag.activationCancelled || drag.activated) {
      return;
    }
    drag.activated = true;
    this.emitDragState("start", drag.sourceEvent, drag, this.internalDragPosition);
    this.changeDetectorRef.markForCheck();
  }
  emitDragState(phase, event, drag, position) {
    this.dragStateChange.emit({
      phase,
      position,
      clientX: event.clientX,
      clientY: event.clientY,
      centerX: drag.baseRect.left + position.x + drag.baseRect.width / 2,
      centerY: drag.baseRect.top + position.y + drag.baseRect.height / 2,
      pointerId: drag.pointerId,
      pointerType: drag.pointerType,
      moved: drag.moved,
      sourceEvent: event
    });
  }
  normalizedDragActivationDelayMs() {
    const delayMs = Math.trunc(Number(this.dragActivationDelayMs));
    return Number.isFinite(delayMs) ? Math.max(0, delayMs) : 0;
  }
  clearDragActivationTimer() {
    if (!this.dragActivationTimer) {
      return;
    }
    clearTimeout(this.dragActivationTimer);
    this.dragActivationTimer = null;
  }
  suppressNextTriggerAction() {
    this.suppressNextTriggerClick = true;
    if (this.suppressClickTimer) {
      clearTimeout(this.suppressClickTimer);
    }
    this.suppressClickTimer = setTimeout(() => {
      this.suppressNextTriggerClick = false;
      this.suppressClickTimer = null;
    });
  }
  clampDragPositionToViewport() {
    if (!this.canDrag || typeof window === "undefined") {
      return;
    }
    const currentPosition = this.internalDragPosition;
    const rect = this.hostRef.nativeElement.getBoundingClientRect();
    const baseRect = new DOMRect(rect.left - currentPosition.x, rect.top - currentPosition.y, rect.width, rect.height);
    const nextPosition = this.clampDragPosition(currentPosition, baseRect);
    if (nextPosition.x === currentPosition.x && nextPosition.y === currentPosition.y) {
      return;
    }
    this.internalDragPosition = nextPosition;
    this.dragPositionChange.emit(nextPosition);
    this.changeDetectorRef.markForCheck();
  }
  clampDragPosition(position, baseRect) {
    if (typeof window === "undefined") {
      return position;
    }
    const margin = _AppMenuComponent.DESKTOP_MARGIN_PX;
    return {
      x: Math.round(Math.min(window.innerWidth - margin - baseRect.right, Math.max(margin - baseRect.left, position.x))),
      y: Math.round(Math.min(window.innerHeight - margin - baseRect.bottom, Math.max(margin - baseRect.top, position.y)))
    };
  }
  normalizedDragPosition(value) {
    const x = Number(value?.x);
    const y = Number(value?.y);
    return {
      x: Number.isFinite(x) ? Math.round(x) : 0,
      y: Number.isFinite(y) ? Math.round(y) : 0
    };
  }
  closeFromBackdrop(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setOpen(false);
  }
  selectActionRowItem(item, event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.isItemDisabled(item) || this.isPassiveItem(item)) {
      return;
    }
    if (this.hasNestedItems(item)) {
      if (this.open && this.activeBranchPath[0]?.id === item.id) {
        this.setOpen(false);
        return;
      }
      this.activeBranchPath = [item];
      this.syncActiveTabsGroup();
      this.setOpen(true);
      return;
    }
    if (this.openActionRowHref(item, event)) {
      return;
    }
    const controlValue = this.selectControlItem(item);
    this.itemSelect.emit({
      id: item.id,
      item,
      context: item.context,
      sourceEvent: event,
      value: item.value,
      controlValue,
      action: "select"
    });
    this.setOpen(false);
  }
  openActionRowHref(item, event) {
    const href = this.itemHref(item);
    if (!href) {
      return false;
    }
    this.itemSelect.emit({
      id: item.id,
      item,
      context: item.context,
      sourceEvent: event,
      value: item.value,
      controlValue: this.currentControlEventValue(),
      action: "select"
    });
    this.openHref(href, this.itemTarget(item), this.itemRel(item));
    if (this.shouldCloseOnSelect(item)) {
      this.setOpen(false);
    }
    return true;
  }
  openHref(href, target, rel) {
    if (typeof window === "undefined") {
      return;
    }
    if (!target || target === "_self") {
      window.location.href = href;
      return;
    }
    window.open(href, target, rel || "noopener,noreferrer");
  }
  selectBranchHeaderAction(item, event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.isItemDisabled(item) || this.isPassiveItem(item)) {
      return;
    }
    const controlValue = this.selectControlItem(item);
    this.itemSelect.emit({
      id: item.id,
      item,
      context: item.context,
      sourceEvent: event,
      value: item.value,
      controlValue,
      action: "select"
    });
    if (item.closeOnSelect ?? this.closeOnSelect) {
      this.setOpen(false);
    }
  }
  selectItem(item, event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.isItemDisabled(item) || this.isPassiveItem(item)) {
      return;
    }
    if (this.shouldOpenItemBranch(item)) {
      this.activeBranchPath = [...this.activeBranchPath, item];
      this.tabsFilterText = "";
      this.syncActiveTabsGroup();
      return;
    }
    const controlValue = this.selectControlItem(item);
    const selectEvent = {
      id: item.id,
      item,
      context: item.context,
      sourceEvent: event,
      value: item.value,
      controlValue,
      action: "select"
    };
    this.itemSelect.emit(selectEvent);
    if (this.shouldCloseOnSelect(item)) {
      this.setOpen(false);
    }
  }
  removeItem(item, event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.isItemDisabled(item) || this.isPassiveItem(item) || !this.isItemRemovable(item)) {
      return;
    }
    const closesEmptyBranch = this.activeBranchPath.length > 0 && this.visibleSelectableListItems().length <= 1;
    const controlValue = this.removeControlItem(item);
    this.itemSelect.emit({
      id: item.id,
      item,
      context: item.context,
      sourceEvent: event,
      value: item.value,
      controlValue,
      action: "remove"
    });
    if (closesEmptyBranch) {
      this.setOpen(false);
    }
  }
  updateRateItemValue(item, value) {
    if (!this.isRateItem(item)) {
      return;
    }
    item.value = value;
  }
  selectRateItem(item, score) {
    if (this.isItemDisabled(item) || this.isPassiveItem(item)) {
      return;
    }
    this.updateRateItemValue(item, score);
    const controlValue = this.selectControlItem(item);
    this.itemSelect.emit({
      id: item.id,
      item,
      context: item.context,
      sourceEvent: new Event("ratingScoreSelect"),
      value: item.value,
      controlValue,
      action: "select"
    });
    if (this.shouldCloseOnSelect(item)) {
      this.setOpen(false);
    }
  }
  selectLinkItem(item, event) {
    event.stopPropagation();
    if (this.isItemDisabled(item) || this.isPassiveItem(item) || this.shouldOpenItemBranch(item)) {
      event.preventDefault();
      return;
    }
    this.itemSelect.emit({
      id: item.id,
      item,
      context: item.context,
      sourceEvent: event,
      value: item.value,
      controlValue: this.currentControlEventValue(),
      action: "select"
    });
    if (this.shouldCloseOnSelect(item)) {
      this.setOpen(false);
    }
  }
  closeActiveBranch(event) {
    event.preventDefault();
    event.stopPropagation();
    this.activeBranchPath = this.activeBranchPath.slice(0, -1);
    this.tabsFilterText = "";
    this.syncActiveTabsGroup();
  }
  isActionRowItemOpen(item) {
    return this.open && this.activeBranchPath[0]?.id === item.id;
  }
  isSelectTriggerItem(item) {
    return item.kind === "select-trigger";
  }
  isLabeledActionRowItem(item) {
    return this.itemVisualLayout(item) === "big" || this.isSelectTriggerItem(item) || this.itemVisualLayout(item) === "pill" || this.itemVisualLayout(item) === "action" && !!this.actionRowItemLabel(item);
  }
  isActionLayoutItem(item) {
    return this.itemVisualLayout(item) === "action";
  }
  isImageLayoutItem(item) {
    return this.itemVisualLayout(item) === "image";
  }
  isImageStackLayoutItem(item) {
    return this.itemVisualLayout(item) === "image-stack";
  }
  isIconLayoutItem(item) {
    return this.itemVisualLayout(item) === "icon";
  }
  actionRowItemIcon(item) {
    if (this.isActionRowItemOpen(item)) {
      const openIcon = `${this.resolveLiveValue(item.closeIcon ?? item.openIcon) ?? ""}`.trim();
      if (openIcon) {
        return openIcon;
      }
      if (!this.isLabeledActionRowItem(item) && this.hasNestedItems(item)) {
        return "close";
      }
    }
    return this.itemIcon(item);
  }
  actionRowItemImageUrl(item) {
    return this.itemImageUrl(item);
  }
  actionRowItemImageAlt(item) {
    return this.itemImageAlt(item);
  }
  actionRowItemImageFallback(item) {
    return this.itemImageFallback(item);
  }
  actionRowItemImageStack(item) {
    const resolvedStack = this.resolveLiveValue(item.imageStack) ?? [];
    const stack = Array.isArray(resolvedStack) ? resolvedStack : [];
    const maxVisible = Math.max(1, Math.trunc(Number(this.resolveLiveValue(item.imageStackMaxVisible)) || stack.length || 1));
    return stack.slice(0, maxVisible);
  }
  actionRowStackImageUrl(image) {
    return `${this.resolveLiveValue(image.imageUrl) ?? ""}`.trim();
  }
  actionRowStackImageAlt(image) {
    return `${this.resolveLiveValue(image.imageAlt) ?? ""}`.trim();
  }
  actionRowStackImageFallback(image) {
    return `${this.resolveLiveValue(image.imageFallback) ?? ""}`.trim();
  }
  actionRowItemLabel(item) {
    return this.itemLabel(item);
  }
  actionRowItemDetail(item) {
    const summary = this.actionRowItemModelSummary(item);
    if (summary.label) {
      return summary.label;
    }
    return this.itemDetail(item) || this.itemDescription(item);
  }
  hasActionRowItemSummaryCounter(item) {
    return this.counterVisible(this.actionRowItemModelSummary(item).counter);
  }
  actionRowItemSummaryCounterLabel(item) {
    return this.counterLabel(this.actionRowItemModelSummary(item).counter);
  }
  actionRowItemSummaryCounterKey(item) {
    return `${this.itemCounterKey(item)}:summary`;
  }
  actionRowItemAriaLabel(item) {
    return this.itemAriaLabel(item) ?? (this.actionRowItemLabel(item) || null);
  }
  itemProgressState(item) {
    const state = this.resolveLiveValue(item.progress?.state) ?? null;
    return state === "idle" || state === "inactive" ? null : state;
  }
  itemProgressTone(item) {
    return this.resolveLiveValue(item.progress?.tone) ?? "default";
  }
  itemProgressShape(item) {
    return item.progress?.shape ?? (this.isLabeledActionRowItem(item) ? "button" : "circle");
  }
  itemProgressDurationMs(item) {
    const durationMs = Number(this.resolveLiveValue(item.progress?.durationMs));
    return Number.isFinite(durationMs) && durationMs > 0 ? durationMs : 3e3;
  }
  itemProgressPerimeter(item) {
    const perimeter = Number(this.resolveLiveValue(item.progress?.perimeter));
    return Number.isFinite(perimeter) && perimeter > 0 ? perimeter : 100;
  }
  branchHeaderActions(item) {
    return item.headerActions ?? [];
  }
  itemHeaderActions(item) {
    return item.headerActions ?? [];
  }
  itemRole(item) {
    switch (item.kind ?? "action") {
      case "radio":
        return "menuitemradio";
      case "checkbox":
      case "toggle":
        return "menuitemcheckbox";
      default:
        return "menuitem";
    }
  }
  groupPalette(group) {
    return group.palette ?? "default";
  }
  groupPaletteClass(group) {
    return this.paletteClass(this.groupPalette(group));
  }
  groupLabel(group) {
    return `${this.resolveLiveValue(group.label) ?? ""}`.trim();
  }
  groupIcon(group) {
    return `${this.resolveLiveValue(group.icon) ?? ""}`.trim();
  }
  groupAriaLabel(group) {
    const ariaLabel = `${this.resolveLiveValue(group.ariaLabel) ?? this.groupLabel(group)}`.trim();
    return ariaLabel || null;
  }
  groupItems(group) {
    return group.items ?? [];
  }
  isTabsFilterable() {
    if (this.activeBranch) {
      return this.activeBranch?.filterable === true;
    }
    return this.currentTabbedModelLayout && this.filterable === true;
  }
  showTabsBar() {
    return this.visibleTabsGroups.length > 1;
  }
  activeTabsGroup() {
    const groups = this.visibleTabsGroups;
    if (groups.length === 0) {
      return null;
    }
    return groups.find((group) => group.id === this.activeTabsGroupId) ?? this.defaultTabsGroup(groups);
  }
  isTabsGroupActive(group) {
    return this.activeTabsGroup()?.id === group.id;
  }
  selectTabsGroup(group, event) {
    event.preventDefault();
    event.stopPropagation();
    this.activeTabsGroupId = group.id;
  }
  updateTabsFilter(event) {
    const target = event.target;
    this.tabsFilterText = `${target?.value ?? ""}`;
    this.syncActiveTabsGroup();
  }
  clearTabsFilter(event) {
    event.preventDefault();
    event.stopPropagation();
    this.tabsFilterText = "";
    this.syncActiveTabsGroup();
  }
  tabsGroupItems(group) {
    return this.groupItems(group);
  }
  isTabsIconList(group) {
    if (!group) {
      return false;
    }
    const items = this.tabsGroupItems(group).filter((item) => !this.isDivider(item) && !this.isSection(item));
    return items.length > 0 && items.every((item) => this.isIconLayoutItem(item));
  }
  tabsColumnCount() {
    const columns = this.autoTabsColumnCount();
    return columns === null ? null : `${columns}`;
  }
  tabsGroupSelectedCount(group) {
    return this.groupItems(this.sourceTabsGroup(group)).filter((item) => this.isItemActive(item)).length;
  }
  itemLabelFilterParts(item) {
    return this.filterTextParts(this.itemLabel(item));
  }
  hasVisibleTabsItems(group) {
    return this.tabsGroupItems(group).length > 0;
  }
  tabsId(group) {
    return `app-menu-tab-${this.safeDomId(group.id)}`;
  }
  tabsPanelId(group) {
    return `app-menu-tab-panel-${this.safeDomId(group.id)}`;
  }
  groupedDropdownItems() {
    if (this.isInlineGridLayout || !this.hasMenuNodes) {
      return [];
    }
    return this.groupedMenuItems(this.menuNodes);
  }
  groupedMenuItems(groups) {
    const items = [];
    for (const group of groups) {
      const groupItems = this.groupItems(group);
      if (groupItems.length === 0) {
        continue;
      }
      if (items.length > 0) {
        items.push({
          id: `${group.id}__divider`,
          kind: "divider"
        });
      }
      if (this.groupLabel(group) || this.groupIcon(group)) {
        items.push({
          id: `${group.id}__section`,
          kind: "section",
          label: group.label,
          icon: group.icon,
          palette: group.palette,
          headerActions: group.headerActions,
          ariaLabel: group.ariaLabel
        });
      }
      items.push(...groupItems);
    }
    return items;
  }
  itemPalette(item) {
    return item.palette ?? "default";
  }
  togglePaletteClass(item) {
    return item.togglePalette ? this.paletteClass(item.togglePalette) : "";
  }
  itemPaletteClass(item) {
    return this.paletteClass(this.itemPalette(item));
  }
  itemSurface(item) {
    return item.surface ?? "plain";
  }
  itemVisualLayout(item) {
    return item.layout ?? "default";
  }
  itemLabel(item) {
    return `${this.resolveLiveValue(item.label) ?? ""}`.trim();
  }
  itemDescription(item) {
    return `${this.resolveLiveValue(item.description) ?? ""}`.trim();
  }
  itemDetail(item) {
    return `${this.resolveLiveValue(item.detail) ?? ""}`.trim();
  }
  itemIcon(item) {
    return `${this.resolveLiveValue(item.icon) ?? ""}`.trim();
  }
  itemImageUrl(item) {
    return `${this.resolveLiveValue(item.imageUrl) ?? ""}`.trim();
  }
  itemImageAlt(item) {
    return `${this.resolveLiveValue(item.imageAlt) ?? this.itemLabel(item)}`.trim();
  }
  itemImageFallback(item) {
    const configured = `${this.resolveLiveValue(item.imageFallback) ?? ""}`.trim();
    return configured || (this.itemImageUrl(item) ? this.imageLabelFallback(this.itemLabel(item)) : "");
  }
  revealImageFallback(event) {
    const image = event.currentTarget;
    if (!(image instanceof HTMLImageElement)) {
      return;
    }
    image.hidden = true;
    image.parentElement?.querySelector("[data-app-menu-image-fallback]")?.removeAttribute("hidden");
  }
  hideImageFallback(event) {
    const image = event.currentTarget;
    if (!(image instanceof HTMLImageElement)) {
      return;
    }
    image.hidden = false;
    image.parentElement?.querySelector("[data-app-menu-image-fallback]")?.setAttribute("hidden", "");
  }
  imageLabelFallback(label) {
    return Array.from(label.trim())[0]?.toLocaleUpperCase() ?? "";
  }
  itemIconKind(item) {
    return item.iconKind ?? "material";
  }
  itemGridColumn(item) {
    const span = Math.max(1, Math.min(5, Math.trunc(Number(this.resolveLiveValue(item.span)) || 1)));
    return span > 1 ? `span ${span}` : null;
  }
  itemAriaLabel(item) {
    const ariaLabel = `${this.resolveLiveValue(item.ariaLabel) ?? ""}`.trim();
    return ariaLabel ? this.translatedFilterText(ariaLabel) : null;
  }
  isItemActive(item) {
    return this.resolveBoolean(item.active) || this.resolveBoolean(item.checked) || this.isControlItemSelected(item);
  }
  showItemCheck(item) {
    const configured = this.resolveLiveValue(item.showCheck);
    if (configured !== null && configured !== void 0) {
      return configured === true && this.isItemActive(item) && !this.hasNestedItems(item);
    }
    if ((this.isDropdownListKind && !this.currentTabbedModelLayout || this.isInlineRowLayout && !this.currentTabbedModelLayout) && item.kind === "radio") {
      return false;
    }
    return this.isItemActive(item) && !this.hasNestedItems(item);
  }
  isItemChecked(item) {
    if ((item.kind ?? "action") !== "radio" && item.kind !== "checkbox" && item.kind !== "toggle") {
      return null;
    }
    return this.isItemActive(item);
  }
  isToggleItem(item) {
    return item.kind === "toggle";
  }
  showActionRowToggleIndicator(item) {
    return this.isToggleItem(item) && this.resolveBoolean(item.showToggleIndicator);
  }
  showTabsItemToggle(item) {
    return this.currentModelMaxSelected() !== 1 && (item.kind === "checkbox" || item.kind === "toggle");
  }
  isItemDisabled(item) {
    return this.controlDisabled || this.resolveBoolean(item.disabled) || this.isMaxSelectedLimitDisablingItem(item);
  }
  isItemRemovable(item) {
    return this.resolveBoolean(item.removable) && !this.isPassiveItem(item);
  }
  itemRemoveIcon(item) {
    return `${this.resolveLiveValue(item.removeIcon) ?? "close"}`.trim() || "close";
  }
  itemRemoveAriaLabel(item) {
    const configured = `${this.resolveLiveValue(item.removeAriaLabel) ?? ""}`.trim();
    if (configured) {
      return configured;
    }
    const label = this.itemLabel(item);
    return label ? `Remove ${label}` : "Remove item";
  }
  isPassiveItem(item) {
    const kind = item.kind ?? "action";
    return kind === "divider" || kind === "section";
  }
  isDivider(item) {
    return item.kind === "divider";
  }
  isSection(item) {
    return item.kind === "section";
  }
  isRateItem(item) {
    return item.kind === "rate";
  }
  itemRateConfig(item) {
    if (!this.isRateItem(item)) {
      return null;
    }
    return __spreadProps(__spreadValues({}, item.rateConfig ?? {}), {
      value: this.rateItemValue(item),
      readonly: this.isItemDisabled(item) || (item.rateConfig?.readonly ?? false),
      dock: null
    });
  }
  rateItemValue(item) {
    const itemValue = Number(item.value);
    if (Number.isFinite(itemValue)) {
      return itemValue;
    }
    const configuredValue = Number(item.rateConfig?.value);
    return Number.isFinite(configuredValue) ? configuredValue : null;
  }
  isBranch(item) {
    return item.kind === "branch";
  }
  hasNestedItems(item) {
    return this.itemChildItems(item).length > 0 || this.itemMenuGroups(item).length > 0;
  }
  shouldOpenItemBranch(item) {
    return !this.isInlineGridLayout && this.hasNestedItems(item);
  }
  shouldCloseOnSelect(item) {
    if (item.closeOnSelect !== null && item.closeOnSelect !== void 0) {
      return item.closeOnSelect;
    }
    if (this.currentTabbedModelLayout && this.isIconLayoutItem(item)) {
      return this.closeOnSelect;
    }
    return this.currentTabbedModelLayout ? false : this.closeOnSelect;
  }
  syncActiveTabsGroup() {
    if (!this.currentTabbedModelLayout || this.tabsGroups.length === 0) {
      return;
    }
    const groups = this.visibleTabsGroups;
    if (groups.length === 0) {
      this.activeTabsGroupId = null;
      return;
    }
    const currentGroup = groups.find((group) => group.id === this.activeTabsGroupId);
    const activeGroup = this.activeTabsSelectedGroup(groups);
    this.activeTabsGroupId = (currentGroup ?? activeGroup ?? groups[0] ?? null)?.id ?? null;
  }
  syncOpenPanelState() {
    if (!this.open || this.usesInlinePanel || this.isCustomTriggerAction) {
      return;
    }
    if (this.activeBranchPath.length > 0) {
      if (!this.activeBranch) {
        this.setOpen(false);
        return;
      }
      if (this.currentTabbedModelLayout) {
        if (this.tabsGroups.length === 0) {
          this.setOpen(false);
        }
        return;
      }
      if (this.visibleSelectableListItems().length === 0) {
        this.setOpen(false);
      }
      return;
    }
    if (this.isInlineRowLayout) {
      this.setOpen(false);
      return;
    }
    if (this.isDropdownListKind && !this.isTabbedModelLayout && this.visibleSelectableListItems().length === 0) {
      this.setOpen(false);
    }
  }
  visibleSelectableListItems() {
    return this.visibleListItems.filter((item) => !this.isPassiveItem(item));
  }
  defaultTabsGroup(groups = this.visibleTabsGroups) {
    return this.activeTabsSelectedGroup(groups) ?? groups[0] ?? null;
  }
  activeTabsSelectedGroup(groups = this.tabsGroups) {
    return groups.find((group) => this.groupItems(group).some((item) => this.isItemActive(item))) ?? null;
  }
  sourceTabsGroup(group) {
    return this.tabsGroups.find((candidate) => candidate.id === group.id) ?? group;
  }
  currentItemById(id) {
    return this.findItemById(this.actionRowItems, id);
  }
  findItemById(items, id) {
    for (const item of items) {
      if (item.id === id) {
        return item;
      }
      const childMatch = this.findItemById(this.itemChildItems(item), id);
      if (childMatch) {
        return childMatch;
      }
      for (const group of this.itemMenuGroups(item)) {
        const modelMatch = this.findItemById(this.groupItems(group), id);
        if (modelMatch) {
          return modelMatch;
        }
      }
    }
    return null;
  }
  itemMatchesFilter(item, query) {
    return [
      this.translatedFilterText(this.itemIcon(item)),
      this.translatedFilterText(this.itemLabel(item)),
      this.translatedFilterText(this.itemDescription(item)),
      this.translatedFilterText(this.itemDetail(item))
    ].some((value) => this.normalizedText(value).includes(query));
  }
  translatedFilterText(value) {
    this.i18n.revision();
    return this.i18n.translate(value);
  }
  filterTextParts(value) {
    const text = this.translatedFilterText(value);
    const query = this.normalizedFilterText();
    if (!query) {
      return [{ text, match: false }];
    }
    const normalizedText = this.normalizedText(text);
    const parts = [];
    let offset = 0;
    let index = normalizedText.indexOf(query, offset);
    while (index >= 0) {
      if (index > offset) {
        parts.push({ text: text.slice(offset, index), match: false });
      }
      const nextOffset = index + query.length;
      parts.push({ text: text.slice(index, nextOffset), match: true });
      offset = nextOffset;
      index = normalizedText.indexOf(query, offset);
    }
    if (offset < text.length) {
      parts.push({ text: text.slice(offset), match: false });
    }
    return parts.length > 0 ? parts : [{ text, match: false }];
  }
  normalizedFilterText() {
    return this.normalizedText(this.tabsFilterText);
  }
  normalizedText(value) {
    return `${value ?? ""}`.trim().toLowerCase();
  }
  itemHref(item) {
    return `${this.resolveLiveValue(item.href) ?? ""}`.trim();
  }
  itemTarget(item) {
    const target = `${this.resolveLiveValue(item.target) ?? ""}`.trim();
    return target || null;
  }
  itemRel(item) {
    const rel = `${this.resolveLiveValue(item.rel) ?? ""}`.trim();
    return rel || null;
  }
  hasItemSegments(item) {
    return (item.segments?.length ?? 0) > 0;
  }
  itemSegments(item) {
    return item.segments ?? [];
  }
  segmentPaletteClass(segment) {
    return this.paletteClass(segment.palette ?? "default");
  }
  segmentLabel(segment) {
    return `${this.resolveLiveValue(segment.label) ?? ""}`.trim();
  }
  segmentDescription(segment) {
    return `${this.resolveLiveValue(segment.description) ?? ""}`.trim();
  }
  segmentIcon(segment) {
    return `${this.resolveLiveValue(segment.icon) ?? ""}`.trim();
  }
  hasItemCounter(item) {
    return this.counterVisible(this.itemCounter(item));
  }
  hasItemHeaderBadge(item) {
    return this.counterVisible(item.headerBadge ?? null);
  }
  hasItemBody(item) {
    return !!this.itemDescription(item) || !!this.itemDetail(item) && this.itemVisualLayout(item) === "pill";
  }
  itemCounterLabel(item) {
    return this.counterLabel(this.itemCounter(item));
  }
  itemHeaderBadgeLabel(item) {
    return this.counterLabel(item.headerBadge ?? null);
  }
  itemCounterKey(item, group) {
    const itemKey = `${item.kind ?? "action"}:${item.id}`;
    return group ? `node:${group.id}:${itemKey}` : `item:${itemKey}`;
  }
  itemHeaderBadgeKey(item, group) {
    return `${this.itemCounterKey(item, group)}:header-badge`;
  }
  isCounterPulsing(key) {
    return this.pulsingCounterKeys.has(key);
  }
  trackByItemId(index, item) {
    return `${item.kind ?? "action"}:${item.id || index}`;
  }
  trackByGroupId(index, group) {
    return `${group.id || index}`;
  }
  trackBySegmentId(index, segment) {
    return `${segment.id || index}`;
  }
  setOpen(open) {
    if (this.internalOpen === open) {
      return;
    }
    const opened = open && !this.internalOpen;
    this.internalOpen = open;
    if (!open) {
      this.activeBranchPath = [];
      this.tabsFilterText = "";
    } else if (opened) {
      this.restoreSelectedBranchPath();
      this.syncActiveTabsGroup();
    }
    this.openChange.emit(open);
  }
  restoreSelectedBranchPath() {
    if (!this.isSelectKind || this.currentTabbedModelLayout) {
      return;
    }
    this.activeBranchPath = this.selectedBranchPath(this.actionRowItems);
  }
  selectedBranchPath(items) {
    for (const item of items) {
      const children = this.branchListItems(item);
      if (children.length === 0) {
        continue;
      }
      const nestedPath = this.selectedBranchPath(children);
      if (nestedPath.length > 0 || children.some((child) => this.isItemActive(child))) {
        return [item, ...nestedPath];
      }
    }
    return [];
  }
  safeDomId(value) {
    return `${value || "group"}`.replace(/[^a-zA-Z0-9_-]+/g, "-");
  }
  syncMobileViewport() {
    if (typeof window === "undefined") {
      this.isMobileViewport = false;
      return;
    }
    this.isMobileViewport = window.innerWidth <= Math.max(1, Number(this.mobileBreakpointPx) || 760);
  }
  hostRect() {
    if (typeof window === "undefined" || typeof this.hostRef.nativeElement.getBoundingClientRect !== "function") {
      return null;
    }
    return this.hostRef.nativeElement.getBoundingClientRect();
  }
  layoutBounds() {
    const viewport = {
      left: 0,
      top: 0,
      right: this.viewportWidth(),
      bottom: this.viewportHeight()
    };
    if (typeof window === "undefined") {
      return viewport;
    }
    let parent = this.hostRef.nativeElement.parentElement;
    while (parent && parent !== document.body && parent !== document.documentElement) {
      const style = window.getComputedStyle(parent);
      if (this.isMenuLayoutBoundary(parent, style)) {
        const rect = parent.getBoundingClientRect();
        return {
          left: Math.max(viewport.left, rect.left),
          top: Math.max(viewport.top, rect.top),
          right: Math.min(viewport.right, rect.right),
          bottom: Math.min(viewport.bottom, rect.bottom)
        };
      }
      parent = parent.parentElement;
    }
    return viewport;
  }
  isMenuLayoutBoundary(element, style) {
    const overflow = `${style.overflow} ${style.overflowX} ${style.overflowY}`;
    if (/(auto|scroll)/.test(overflow)) {
      return true;
    }
    if (element.classList.contains("ui-popup__panel--overflow-visible") || element.classList.contains("ui-popup__body--overflow")) {
      return false;
    }
    const className = element.className.toString();
    if (/(ui-popup__panel|ui-popup__body|popup-body|scroll-area|popup-panel|app-popup-panel)/.test(className)) {
      return true;
    }
    if (/(hidden|clip)/.test(overflow)) {
      return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
    }
    return false;
  }
  panelHorizontalOverflow(align, rect, bounds, width) {
    const left = align === "start" ? rect.left : rect.right - width;
    const right = left + width;
    return Math.max(0, bounds.left - left) + Math.max(0, right - bounds.right);
  }
  viewportWidth() {
    if (typeof window === "undefined") {
      return _AppMenuComponent.DESKTOP_MIN_PANEL_WIDTH_PX + _AppMenuComponent.DESKTOP_MARGIN_PX * 2;
    }
    return window.innerWidth || document.documentElement.clientWidth;
  }
  viewportHeight() {
    if (typeof window === "undefined") {
      return 720;
    }
    return window.innerHeight || document.documentElement.clientHeight;
  }
  estimatedPanelWidth() {
    if (this.currentTabbedModelLayout) {
      return this.tabsGroups.some((group) => this.isTabsIconList(group)) ? 360 : 480;
    }
    const labels = this.visibleListItems.map((item) => `${this.resolveLiveValue(item.label) ?? this.resolveLiveValue(item.description) ?? ""}`.trim());
    const longestLabel = labels.reduce((longest, label) => Math.max(longest, label.length), 0);
    const textWidth = longestLabel * 7.5 + 86;
    return Math.min(448, Math.max(_AppMenuComponent.DESKTOP_MIN_PANEL_WIDTH_PX, textWidth));
  }
  estimatedPanelHeight() {
    if (this.currentTabbedModelLayout) {
      const group = this.activeTabsGroup();
      const itemCount2 = group ? this.tabsGroupItems(group).filter((item) => !this.isDivider(item) && !this.isSection(item)).length : 0;
      const iconList = this.isTabsIconList(group);
      const filterHeight = this.isTabsFilterable() ? 46 : 0;
      const tabsHeight = this.showTabsBar() ? 42 : 0;
      const rows = iconList ? Math.max(1, Math.ceil(Math.max(1, itemCount2) / 8)) : Math.max(1, Math.ceil(Math.max(1, itemCount2) / 3));
      return Math.min(520, filterHeight + tabsHeight + rows * (iconList ? 42 : 46) + 36);
    }
    const titleHeight = this.resolvedTitle ? 34 : 0;
    const itemCount = Math.max(1, this.visibleListItems.length);
    const branchHeaderHeight = this.visibleListItems.some((item) => this.hasNestedItems(item)) ? 38 : 0;
    return Math.min(448, titleHeight + branchHeaderHeight + itemCount * 40 + 18);
  }
  syncCounterPulseState() {
    const visibleCounterKeys = /* @__PURE__ */ new Set();
    const triggerCounter = this.triggerCounter();
    this.observeCounterPulse(this.triggerCounterKey(), triggerCounter, this.isLiveCounter(triggerCounter), visibleCounterKeys);
    for (const item of this.items) {
      this.observeItemCounterPulse(item, visibleCounterKeys);
    }
    for (const group of this.menuNodes) {
      for (const action of group.headerActions ?? []) {
        this.observeItemCounterPulse(action, visibleCounterKeys, group);
      }
      for (const item of this.groupItems(group)) {
        this.observeItemCounterPulse(item, visibleCounterKeys, group);
      }
    }
    for (const key of this.counterValueByKey.keys()) {
      if (!visibleCounterKeys.has(key)) {
        this.counterValueByKey.delete(key);
        this.clearCounterPulse(key);
      }
    }
  }
  observeItemCounterPulse(item, visibleCounterKeys, group) {
    this.observeCounterPulse(this.itemCounterKey(item, group), this.itemCounter(item), this.hasValueCounter(item.id) || this.isLiveCounter(item.counter ?? null), visibleCounterKeys);
    this.observeCounterPulse(this.itemHeaderBadgeKey(item, group), item.headerBadge ?? null, this.isLiveCounter(item.headerBadge ?? null), visibleCounterKeys);
    for (const action of item.headerActions ?? []) {
      this.observeItemCounterPulse(action, visibleCounterKeys, group);
    }
    for (const child of this.itemChildItems(item)) {
      this.observeItemCounterPulse(child, visibleCounterKeys, group);
    }
    for (const childGroup of this.itemMenuGroups(item)) {
      for (const action of childGroup.headerActions ?? []) {
        this.observeItemCounterPulse(action, visibleCounterKeys, childGroup);
      }
      for (const child of this.groupItems(childGroup)) {
        this.observeItemCounterPulse(child, visibleCounterKeys, childGroup);
      }
    }
  }
  observeCounterPulse(key, counter, live, visibleCounterKeys) {
    const config = this.counterConfig(counter);
    if (!config) {
      return;
    }
    visibleCounterKeys.add(key);
    const nextSignature = this.counterSignature(counter);
    const previousSignature = this.counterValueByKey.get(key);
    this.counterValueByKey.set(key, nextSignature);
    if (previousSignature === void 0 || previousSignature === nextSignature) {
      return;
    }
    if (live) {
      this.pulseCounter(key);
    } else {
      this.clearCounterPulse(key);
    }
  }
  pulseCounter(key) {
    const existingTimer = this.counterPulseTimerByKey.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }
    this.pulsingCounterKeys.add(key);
    const timerId = setTimeout(() => {
      this.pulsingCounterKeys.delete(key);
      this.counterPulseTimerByKey.delete(key);
      this.changeDetectorRef.markForCheck();
    }, _AppMenuComponent.COUNTER_PULSE_DURATION_MS);
    this.counterPulseTimerByKey.set(key, timerId);
  }
  clearCounterPulse(key) {
    const timerId = this.counterPulseTimerByKey.get(key);
    if (timerId) {
      clearTimeout(timerId);
      this.counterPulseTimerByKey.delete(key);
    }
    this.pulsingCounterKeys.delete(key);
  }
  modelSummary() {
    return appMenuModelSummary(this.model, this.groups, this.controlSelection());
  }
  actionRowItemModelSummary(item) {
    return appMenuModelSummary(item.model, item.groups ?? []);
  }
  controlSelection() {
    if (!this.controlAttached) {
      return null;
    }
    return {
      active: true,
      value: this.controlValue,
      valueKey: this.model?.valueKey ?? null
    };
  }
  currentControlEventValue() {
    return this.controlAttached ? this.controlValue : void 0;
  }
  isMaxSelectedLimitDisablingItem(item) {
    const maxSelected = this.currentModelMaxSelected();
    if (maxSelected === null || maxSelected === 1 || !this.isMultiSelectItem(item) || this.isItemActive(item)) {
      return false;
    }
    return this.currentSelectedMultiSelectCount() >= maxSelected;
  }
  currentModelMaxSelected() {
    const rawMaxSelected = this.currentMenuModel()?.maxSelected;
    if (rawMaxSelected === null || rawMaxSelected === void 0) {
      return null;
    }
    return Math.max(0, Math.trunc(Number(rawMaxSelected)) || 0);
  }
  autoTabsColumnCount() {
    const group = this.activeTabsGroup();
    if (!group) {
      return null;
    }
    if (this.isTabsIconList(group)) {
      return null;
    }
    const items = this.tabsGroupItems(group).filter((item) => !this.isDivider(item) && !this.isSection(item));
    if (items.length <= 1) {
      return null;
    }
    const candidates = this.tabsColumnCandidates(items.length);
    if (candidates.length === 0) {
      return null;
    }
    const width = this.tabsItemsWidth();
    if (width <= 0) {
      return null;
    }
    if (items.length <= 4 && width >= 420) {
      return items.length;
    }
    const totalLabelChars = items.reduce((total, item) => total + this.itemLabel(item).length, 0);
    const averageLabelChars = totalLabelChars / items.length;
    const hasIcons = items.some((item) => this.itemIcon(item).length > 0);
    const hasToggles = items.some((item) => this.showTabsItemToggle(item));
    const estimatedItemWidth = 38 + averageLabelChars * 4.1 + (hasIcons ? 20 : 0) + (hasToggles ? 34 : 0);
    const gap = 6;
    for (const columns of candidates) {
      const availableItemWidth = (width - gap * Math.max(0, columns - 1)) / columns;
      if (availableItemWidth >= estimatedItemWidth) {
        return columns;
      }
    }
    return null;
  }
  tabsColumnCandidates(itemCount) {
    if (itemCount === 2) {
      return [2];
    }
    if (itemCount === 3) {
      return [3];
    }
    if (itemCount === 4) {
      return [4, 2];
    }
    if (itemCount === 6) {
      return [3, 2];
    }
    if (itemCount % 4 === 0) {
      return [4, 2];
    }
    if (itemCount % 3 === 0) {
      return [3];
    }
    return [];
  }
  tabsItemsWidth() {
    const host = this.hostRef.nativeElement;
    const panel = host.querySelector(".app-menu__tabs-panel");
    const width = panel?.getBoundingClientRect().width ?? host.getBoundingClientRect().width;
    return Number.isFinite(width) ? width : 0;
  }
  currentMenuModel() {
    if (this.activeBranch) {
      return this.activeBranch.model ?? null;
    }
    return this.model;
  }
  hasCompactDensity(model) {
    return model?.density === "compact";
  }
  currentSelectedMultiSelectCount() {
    if (this.controlAttached) {
      if (Array.isArray(this.controlValue)) {
        return this.controlValue.length;
      }
      return this.controlValue === null || this.controlValue === void 0 || this.controlValue === "" ? 0 : 1;
    }
    return this.currentRenderedItems().filter((item) => this.isMultiSelectItem(item) && this.isItemActive(item)).length;
  }
  currentRenderedItems() {
    if (this.currentTabbedModelLayout && this.tabsGroups.length > 0) {
      return this.tabsGroups.flatMap((group) => this.groupItems(group));
    }
    if (this.isInlineRowLayout) {
      return this.actionRowItems;
    }
    return this.visibleListItems;
  }
  isMultiSelectItem(item) {
    return item.kind === "checkbox" || item.kind === "toggle";
  }
  currentMenuGroupFallback() {
    return this.activeBranch?.groups ?? this.groups;
  }
  branchListItems(item) {
    const childItems = this.itemChildItems(item);
    if (childItems.length > 0) {
      return childItems;
    }
    return this.groupedMenuItems(this.itemMenuGroups(item));
  }
  itemChildItems(item) {
    return item.items ?? [];
  }
  itemMenuGroups(item) {
    return appMenuModelGroups(item.model, item.groups ?? []);
  }
  selectControlItem(item) {
    if (!this.controlAttached || this.controlDisabled || this.isPassiveItem(item)) {
      return void 0;
    }
    this.markControlTouched();
    const nextValue = this.nextControlValueForItem(item);
    this.setControlValue(nextValue);
    return this.controlValue;
  }
  removeControlItem(item) {
    if (!this.controlAttached || this.controlDisabled || this.isPassiveItem(item)) {
      return this.currentControlEventValue();
    }
    this.markControlTouched();
    const itemValue = this.itemControlValue(item);
    if (Array.isArray(this.controlValue)) {
      this.setControlValue(this.controlValue.filter((value) => !this.controlValuesEqual(value, itemValue)));
      return this.controlValue;
    }
    if (this.controlValuesEqual(this.controlValue, itemValue)) {
      this.setControlValue(null);
    }
    return this.controlValue;
  }
  nextControlValueForItem(item) {
    const itemValue = this.itemControlValue(item);
    switch (item.kind ?? "action") {
      case "checkbox":
      case "toggle":
        if (this.currentModelMaxSelected() === 1) {
          return this.isControlItemSelected(item) ? [] : [itemValue];
        }
        return this.toggleControlArrayValue(itemValue);
      default:
        return itemValue;
    }
  }
  itemControlValue(item) {
    return item.value !== void 0 ? item.value : item.id;
  }
  toggleControlArrayValue(itemValue) {
    const values = Array.isArray(this.controlValue) ? [...this.controlValue] : this.controlValue === null || this.controlValue === void 0 ? [] : [this.controlValue];
    const existingIndex = values.findIndex((value) => this.controlValuesEqual(value, itemValue));
    if (existingIndex >= 0) {
      values.splice(existingIndex, 1);
      return values;
    }
    return [...values, itemValue];
  }
  setControlValue(value) {
    if (this.controlValuesEqual(this.controlValue, value)) {
      return;
    }
    this.controlValue = value;
    this.onControlChange(value);
    this.changeDetectorRef.markForCheck();
  }
  markControlTouched() {
    this.onControlTouched();
  }
  isControlItemSelected(item) {
    if (!this.controlAttached || this.isPassiveItem(item)) {
      return false;
    }
    const itemValue = this.itemControlValue(item);
    if (Array.isArray(this.controlValue)) {
      return this.controlValue.some((value) => this.controlValuesEqual(value, itemValue));
    }
    return this.controlValuesEqual(this.controlValue, itemValue);
  }
  controlValuesEqual(first, second) {
    if (Array.isArray(first) && Array.isArray(second)) {
      return first.length === second.length && first.every((value, index) => this.controlValuesEqual(value, second[index]));
    }
    const valueKey = this.model?.valueKey ?? null;
    if (valueKey) {
      return Object.is(this.controlValueIdentity(first, valueKey), this.controlValueIdentity(second, valueKey));
    }
    return Object.is(first, second);
  }
  controlValueIdentity(value, valueKey) {
    if (typeof valueKey === "function") {
      return valueKey(value);
    }
    if (value && typeof value === "object" && valueKey in value) {
      return value[valueKey];
    }
    return value;
  }
  resolveBoolean(value) {
    return this.resolveLiveValue(value) === true;
  }
  resolveLiveValue(value) {
    if (typeof value === "function") {
      return value();
    }
    return value;
  }
  counterConfig(counter) {
    if (counter === null || counter === void 0) {
      return null;
    }
    if (typeof counter === "object" && "value" in counter) {
      return counter;
    }
    return { value: counter };
  }
  itemCounter(item) {
    if (this.hasValueCounter(item.id)) {
      return this.value?.[item.id];
    }
    return item.counter ?? null;
  }
  hasValueCounter(id) {
    return !!this.value && Object.prototype.hasOwnProperty.call(this.value, id);
  }
  isLiveCounter(counter) {
    const config = this.counterConfig(counter);
    return typeof config?.value === "function";
  }
  counterVisible(counter) {
    const value = this.resolveCounterValue(counter);
    if (typeof value === "number") {
      return Number.isFinite(value) && value > 0;
    }
    return `${value ?? ""}`.trim().length > 0;
  }
  counterLabel(counter) {
    const config = this.counterConfig(counter);
    const value = this.resolveCounterValue(counter);
    if (typeof value === "number") {
      const max = Math.max(1, Math.trunc(Number(config?.max) || 99));
      return value > max ? `${max}+` : `${Math.trunc(value)}`;
    }
    return `${value ?? ""}`.trim();
  }
  resolveCounterValue(counter) {
    const config = this.counterConfig(counter);
    return this.resolveLiveValue(config?.value ?? null);
  }
  counterSignature(counter) {
    const value = this.resolveCounterValue(counter);
    return typeof value === "number" ? `number:${value}` : `text:${value ?? ""}`;
  }
  paletteClass(palette) {
    return `app-menu__palette--${palette}`;
  }
  static \u0275fac = function AppMenuComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppMenuComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppMenuComponent, selectors: [["app-menu"]], hostVars: 50, hostBindings: function AppMenuComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("resize", function AppMenuComponent_resize_HostBindingHandler() {
        return ctx.onViewportResize();
      }, \u0275\u0275resolveWindow)("pointermove", function AppMenuComponent_pointermove_HostBindingHandler($event) {
        return ctx.onWindowPointerMove($event);
      }, \u0275\u0275resolveWindow)("pointerup", function AppMenuComponent_pointerup_HostBindingHandler($event) {
        return ctx.onWindowPointerEnd($event);
      }, \u0275\u0275resolveWindow)("pointercancel", function AppMenuComponent_pointercancel_HostBindingHandler($event) {
        return ctx.onWindowPointerEnd($event);
      }, \u0275\u0275resolveWindow)("keydown.escape", function AppMenuComponent_keydown_escape_HostBindingHandler($event) {
        return ctx.onEscapePressed($event);
      }, \u0275\u0275resolveWindow)("pointerdown", function AppMenuComponent_pointerdown_HostBindingHandler($event) {
        return ctx.onDocumentPointerDown($event);
      }, \u0275\u0275resolveDocument);
    }
    if (rf & 2) {
      \u0275\u0275styleProp("transform", ctx.hostDragTransform)("--app-menu-panel-gap", ctx.hostPanelGapStyle)("--app-menu-panel-available-height", ctx.hostPanelAvailableHeightStyle);
      \u0275\u0275classProp("app-menu-host", ctx.hostClass)("app-menu-host--kind-inline", ctx.hostInlineKindClass)("app-menu-host--layout-row", ctx.hostRowLayoutClass)("app-menu-host--layout-grid", ctx.hostGridLayoutClass)("app-menu-host--inline-row-big", ctx.hostInlineRowBigClass)("app-menu-host--inline-row-labelled-action", ctx.hostInlineRowLabelledActionClass)("app-menu-host--kind-fab", ctx.hostFabKindClass)("app-menu-host--draggable", ctx.hostDraggableClass)("app-menu-host--dragging", ctx.hostDraggingClass)("app-menu-host--kind-select", ctx.hostSelectKindClass)("app-menu-host--model-layout-tabs", ctx.hostTabbedModelLayoutClass)("app-menu-host--layout-desktop", ctx.hostDesktopLayoutClass)("app-menu-host--layout-mobile", ctx.hostMobileLayoutClass)("app-menu-host--open", ctx.hostOpenClass)("app-menu-host--content-actions", ctx.hostContentActionsClass)("app-menu-host--compact", ctx.hostCompactClass)("app-menu-host--inline-panel", ctx.hostInlinePanelClass)("app-menu-host--panel-docked", ctx.hostPanelDockedClass)("app-menu-host--panel-bottom-docked", ctx.hostPanelBottomDockedClass)("app-menu-host--trigger-field", ctx.hostTriggerFieldClass)("app-menu-host--trigger-pill", ctx.hostTriggerPillClass)("app-menu-host--trigger-icon", ctx.hostTriggerIconClass);
    }
  }, inputs: { kind: "kind", layout: "layout", title: "title", filterable: "filterable", items: "items", model: "model", groups: "groups", value: "value", trigger: "trigger", openUp: "openUp", panelAlign: "panelAlign", panelMode: "panelMode", panelGapPx: "panelGapPx", panelDockToHost: "panelDockToHost", mobileBreakpointPx: "mobileBreakpointPx", closeOnSelect: "closeOnSelect", draggable: "draggable", dragActivationDelayMs: "dragActivationDelayMs", open: "open", dragPosition: "dragPosition" }, outputs: { openChange: "openChange", itemSelect: "itemSelect", dragPositionChange: "dragPositionChange", dragStateChange: "dragStateChange" }, features: [\u0275\u0275ProvidersFeature([
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => _AppMenuComponent),
      multi: true
    }
  ])], ngContentSelectors: _c1, decls: 4, vars: 5, consts: [[1, "app-menu"], ["role", "toolbar", 1, "app-menu__button-row"], ["type", "button", 1, "app-menu__trigger", "motion-static", 3, "pointerdown", "contextmenu", "click", "ngClass", "disabled"], ["data-action-wave-surface", "true", "aria-hidden", "true", 1, "app-menu__trigger-wave-surface"], [1, "app-menu__trigger-image"], [3, "app-menu__trigger-icon--symbol"], [1, "app-menu__trigger-label"], [1, "app-menu__trigger-caret", 3, "app-menu__trigger-caret--static"], [1, "app-menu__counter", "app-menu__counter--trigger", 3, "app-menu__counter--pulse"], [3, "error", "load", "src", "alt"], ["data-app-menu-image-fallback", "", "hidden", ""], [1, "app-menu__trigger-caret"], [1, "app-menu__counter", "app-menu__counter--trigger"], ["type", "button", 1, "app-menu__button-row-item", 3, "ngClass", "app-menu__button-row-item--active", "app-menu__button-row-item--open", "app-menu__button-row-item--toggle", "app-menu__button-row-item--labelled", "app-menu__button-row-item--action", "app-menu__button-row-item--image", "app-menu__button-row-item--image-stack", "app-menu__button-row-item--selected-value", "app-menu__button-row-item--progress", "app-menu__button-row-item--progress-loading", "app-menu__button-row-item--progress-error", "app-menu__button-row-item--progress-success", "disabled", "title"], ["type", "button", 1, "app-menu__button-row-item", 3, "click", "ngClass", "disabled", "title"], ["aria-hidden", "true", 1, "app-menu__button-row-ring"], ["aria-hidden", "true", 1, "app-menu__button-row-image-stack"], [1, "app-menu__button-row-image"], ["kind", "action-ring", 3, "shape", "state", "tone", "perimeter", "durationMs"], [1, "app-menu__button-row-stack-image"], [3, "src", "alt"], [1, "app-menu__button-row-copy"], [1, "app-menu__button-row-label"], [1, "app-menu__button-row-detail"], [1, "app-menu__button-row-trailing"], [1, "app-menu__counter", "app-menu__counter--value-corner", 3, "app-menu__counter--pulse"], [1, "app-menu__counter", "app-menu__counter--trigger", 3, "app-menu__counter--alert", "app-menu__counter--success", "app-menu__counter--pulse"], [1, "app-menu__button-row-caret"], [1, "app-menu__counter", "app-menu__counter--value-corner"], [1, "app-menu__button-row-main"], ["aria-hidden", "true", 1, "app-menu__tabs-toggle", "app-menu__button-row-toggle", 3, "ngClass", "app-menu__tabs-toggle--active"], ["aria-hidden", "true", 1, "app-menu__tabs-toggle", "app-menu__button-row-toggle", 3, "ngClass"], ["type", "button", "aria-label", "Close menu", 1, "app-menu__backdrop"], ["role", "menu", 1, "app-menu__panel", 3, "click"], [1, "app-menu__title"], [1, "app-menu__groups"], [1, "app-menu__tabs"], ["type", "button", "aria-label", "Close menu", 1, "app-menu__backdrop", 3, "click"], ["role", "group", 1, "app-menu__group"], [1, "app-menu__group-header", 3, "ngClass"], [1, "app-menu__tile-grid"], [1, "app-menu__group-badge"], [1, "app-menu__group-line"], ["role", "separator", 1, "app-menu__divider", "app-menu__tile-divider"], [1, "app-menu__section-label", "app-menu__tile-section"], ["type", "button", 1, "app-menu__tile-item", 3, "ngClass", "app-menu__tile-item--active", "app-menu__tile-item--disabled", "app-menu__tile-item--segmented", "grid-column", "disabled", "title"], ["type", "button", 1, "app-menu__tile-item", 3, "click", "ngClass", "disabled", "title"], ["aria-hidden", "true", 1, "app-menu__segments"], [1, "app-menu__counter", "app-menu__counter--tile", 3, "app-menu__counter--alert", "app-menu__counter--success", "app-menu__counter--pulse"], [1, "app-menu__segment", 3, "ngClass"], [1, "app-menu__segment-text"], [1, "app-menu__segment-label"], [1, "app-menu__segment-description"], [1, "app-menu__tile-icon"], [1, "app-menu__tile-label"], [1, "app-menu__tile-description"], [1, "app-menu__counter", "app-menu__counter--tile"], [1, "app-menu__tabs-head"], ["role", "tablist", 1, "app-menu__tabs-tabs"], ["role", "tabpanel", 1, "app-menu__tabs-panel"], [1, "app-menu__tabs-empty"], [1, "app-menu__tabs-filter", 3, "click"], ["type", "text", 1, "app-menu__tabs-filter-input", 3, "input", "keydown", "value"], ["type", "button", "aria-label", "Clear search", "title", "Clear search", 1, "app-menu__tabs-filter-clear"], ["type", "button", "aria-label", "Clear search", "title", "Clear search", 1, "app-menu__tabs-filter-clear", 3, "click"], ["type", "button", "role", "tab", 1, "app-menu__tabs-tab", 3, "ngClass", "app-menu__tabs-tab--active"], ["type", "button", "role", "tab", 1, "app-menu__tabs-tab", 3, "click", "ngClass"], [1, "app-menu__counter", "app-menu__counter--tabs-tab"], [1, "app-menu__tabs-items"], ["role", "separator", 1, "app-menu__divider", "app-menu__tabs-divider"], [1, "app-menu__section-label", "app-menu__tabs-section", 3, "ngClass"], ["type", "button", 1, "app-menu__tabs-item", 3, "ngClass", "app-menu__tabs-item--active", "app-menu__tabs-item--disabled", "app-menu__tabs-item--with-description", "app-menu__tabs-item--layout-icon", "disabled", "title"], ["type", "button", 1, "app-menu__tabs-item", 3, "click", "ngClass", "disabled", "title"], [1, "app-menu__tabs-item-icon", "app-menu__tabs-item-icon--text"], [1, "app-menu__tabs-item-icon"], [1, "app-menu__tabs-item-main"], [1, "app-menu__tabs-item-label"], [1, "app-menu__tabs-item-description"], [1, "app-menu__counter", 3, "app-menu__counter--alert", "app-menu__counter--success", "app-menu__counter--pulse"], ["aria-hidden", "true", 1, "app-menu__tabs-toggle", 3, "app-menu__tabs-toggle--active"], [1, "app-menu__tabs-filter-match"], [1, "app-menu__counter"], ["aria-hidden", "true", 1, "app-menu__tabs-toggle"], [1, "app-menu__items"], [1, "app-menu__branch-header"], ["type", "button", "aria-label", "Back to menu", "title", "Back to menu", 1, "app-menu__branch-back", 3, "click"], [1, "app-menu__branch-title"], ["type", "button", 1, "app-menu__branch-action", 3, "app-menu__branch-action--icon-only", "ngClass", "disabled", "title"], ["type", "button", 1, "app-menu__branch-action", 3, "click", "ngClass", "disabled", "title"], ["role", "separator", 1, "app-menu__divider"], [1, "app-menu__section-label", 3, "ngClass"], ["role", "none", 1, "app-menu__rate-item", 3, "app-menu__rate-item--disabled"], [1, "app-menu__item", 3, "ngClass", "app-menu__item--surface-tinted", "app-menu__item--layout-pill", "app-menu__item--active", "app-menu__item--disabled", "app-menu__item--with-description"], ["type", "button", 1, "app-menu__section-action", 3, "app-menu__section-action--active", "ngClass", "disabled", "title"], ["type", "button", 1, "app-menu__section-action", 3, "click", "ngClass", "disabled", "title"], ["role", "none", 1, "app-menu__rate-item", 3, "click"], [3, "valueChange", "scoreSelect", "config"], [1, "app-menu__item", 3, "click", "ngClass"], [1, "app-menu__item-image"], [1, "app-menu__item-icon", 3, "app-menu__item-icon--symbol"], [1, "app-menu__item-main"], [1, "app-menu__item-header"], [1, "app-menu__item-label"], [1, "app-menu__counter", "app-menu__counter--header-badge", 3, "app-menu__counter--pulse"], [1, "app-menu__item-body"], [1, "app-menu__item-detail"], [1, "app-menu__item-check"], [1, "app-menu__item-branch"], [1, "app-menu__item-icon"], [1, "app-menu__counter", "app-menu__counter--header-badge"], [1, "app-menu__item-description"], [1, "app-menu__item-detail", "app-menu__item-detail--badge"], [1, "app-menu__item-row", 3, "ngClass", "app-menu__item-row--pill"], ["type", "button", 1, "app-menu__item", 3, "ngClass", "app-menu__item--surface-tinted", "app-menu__item--layout-pill", "app-menu__item--active", "app-menu__item--disabled", "app-menu__item--with-description", "disabled"], [1, "app-menu__item-row", 3, "ngClass"], ["type", "button", 1, "app-menu__item", "app-menu__item--row-primary", 3, "click", "disabled"], ["type", "button", 1, "app-menu__item-remove", 3, "click", "disabled"], ["type", "button", 1, "app-menu__item", 3, "click", "ngClass", "disabled"]], template: function AppMenuComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef(_c0);
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275conditionalCreate(1, AppMenuComponent_Conditional_1_Template, 8, 25);
      \u0275\u0275conditionalCreate(2, AppMenuComponent_Conditional_2_Template, 3, 0, "div", 1);
      \u0275\u0275conditionalCreate(3, AppMenuComponent_Conditional_3_Template, 6, 19);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275classProp("app-menu--open", ctx.panelVisible);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.hasTrigger ? 1 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isInlineRowLayout ? 2 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.panelVisible ? 3 : -1);
    }
  }, dependencies: [CommonModule, NgClass, MatIconModule, MatIcon, RateComponent, IndicatorComponent, I18nPipe], styles: ['\n[_nghost-%COMP%] {\n  display: inline-block;\n  min-width: 0;\n  position: relative;\n  box-sizing: border-box;\n  overflow: visible;\n  z-index: 1;\n  --app-menu-grid-columns: 5;\n  --app-menu-grid-gap: 0.46rem;\n  --app-menu-tile-height: 60px;\n  --app-menu-tile-label-white-space: normal;\n  --app-menu-tile-label-overflow-wrap: anywhere;\n  --app-menu-mobile-big-columns: 1;\n  --app-menu-tabs-items-gap: 0.34rem;\n  --app-menu-tabs-item-flex-basis: 9.5rem;\n  --app-menu-tabs-item-min-width: 9.5rem;\n  --app-menu-tabs-item-min-height: 38px;\n  --app-menu-tabs-item-padding: 0.38rem 0.46rem;\n  --app-menu-tabs-item-font-size: 0.78rem;\n  --app-menu-icon-list-item-size: 2.4rem;\n  --app-menu-icon-list-font-size: 1.28rem;\n  --app-menu-text: #243f62;\n  --app-menu-muted-text: rgba(32, 53, 82, 0.66);\n}\n.app-menu[_ngcontent-%COMP%], \n.app-menu[_ngcontent-%COMP%]   *[_ngcontent-%COMP%], \n.app-menu[_ngcontent-%COMP%]   *[_ngcontent-%COMP%]::before, \n.app-menu[_ngcontent-%COMP%]   *[_ngcontent-%COMP%]::after {\n  box-sizing: border-box;\n}\n.app-menu-host--open[_nghost-%COMP%] {\n  z-index: 40;\n}\n.app-menu-host--panel-docked[_nghost-%COMP%] {\n  display: block;\n  width: 0;\n  height: 0;\n  min-width: 0;\n  min-height: 0;\n}\n.app-menu-host--panel-docked[_nghost-%COMP%]   .app-menu[_ngcontent-%COMP%] {\n  display: block;\n  width: 0;\n  height: 0;\n  min-width: 0;\n  min-height: 0;\n}\n.app-menu-host--layout-grid[_nghost-%COMP%], \n.app-menu-host--inline-panel[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n  z-index: auto;\n}\n.app-menu-host--model-layout-tabs[_nghost-%COMP%], \n.app-menu-host--kind-select[_nghost-%COMP%] {\n  width: 100%;\n}\n.app-menu-host--model-layout-tabs.app-menu-host--trigger-pill[_nghost-%COMP%], \n.app-menu-host--model-layout-tabs.app-menu-host--trigger-icon[_nghost-%COMP%], \n.app-menu-host--kind-select.app-menu-host--trigger-pill[_nghost-%COMP%], \n.app-menu-host--kind-select.app-menu-host--trigger-icon[_nghost-%COMP%], \n.app-menu-host--kind-fab[_nghost-%COMP%], \n.app-menu-host--layout-row[_nghost-%COMP%] {\n  width: max-content;\n}\n.app-menu-host--inline-row-big[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n}\n.app-menu-host--layout-mobile[_nghost-%COMP%] {\n  --app-menu-grid-columns: 5;\n  --app-menu-tile-height: 60px;\n  --app-menu-mobile-dropdown-max-height: min(72vh, 520px);\n}\n.app-menu-host--compact[_nghost-%COMP%] {\n  --app-menu-compact-trigger-gap: 0.2rem;\n  --app-menu-compact-trigger-padding-inline: 0.42rem;\n  --app-menu-compact-trigger-font-size: 0.74rem;\n  --app-menu-compact-trigger-icon-size: 1rem;\n  --app-menu-compact-row-gap: 0.24rem;\n  --app-menu-compact-row-item-min-width: auto;\n  --app-menu-compact-row-item-gap: 0.22rem;\n  --app-menu-compact-row-item-padding-inline: 0.46rem;\n  --app-menu-compact-row-item-font-size: 0.74rem;\n  --app-menu-compact-row-item-icon-size: 1rem;\n}\n.app-menu[_ngcontent-%COMP%] {\n  position: relative;\n  display: inline-flex;\n  min-width: 0;\n  overflow: visible;\n}\n.app-menu-host--layout-grid[_nghost-%COMP%]   .app-menu[_ngcontent-%COMP%], \n.app-menu-host--inline-panel[_nghost-%COMP%]   .app-menu[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n}\n.app-menu-host--model-layout-tabs[_nghost-%COMP%]   .app-menu[_ngcontent-%COMP%], \n.app-menu-host--kind-select[_nghost-%COMP%]   .app-menu[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n}\n.app-menu-host--model-layout-tabs.app-menu-host--trigger-pill[_nghost-%COMP%]   .app-menu[_ngcontent-%COMP%], \n.app-menu-host--model-layout-tabs.app-menu-host--trigger-icon[_nghost-%COMP%]   .app-menu[_ngcontent-%COMP%], \n.app-menu-host--kind-select.app-menu-host--trigger-pill[_nghost-%COMP%]   .app-menu[_ngcontent-%COMP%], \n.app-menu-host--kind-select.app-menu-host--trigger-icon[_nghost-%COMP%]   .app-menu[_ngcontent-%COMP%], \n.app-menu-host--kind-fab[_nghost-%COMP%]   .app-menu[_ngcontent-%COMP%], \n.app-menu-host--layout-row[_nghost-%COMP%]   .app-menu[_ngcontent-%COMP%] {\n  display: inline-flex;\n  width: auto;\n}\n.app-menu-host--layout-row[_nghost-%COMP%]   .app-menu[_ngcontent-%COMP%] {\n  width: var(--app-menu-row-width, auto);\n  max-width: 100%;\n}\n.app-menu-host--panel-docked.app-menu-host--kind-select[_nghost-%COMP%]   .app-menu[_ngcontent-%COMP%], \n.app-menu-host--panel-docked.app-menu-host--model-layout-tabs[_nghost-%COMP%]   .app-menu[_ngcontent-%COMP%], \n.app-menu-host--panel-docked.app-menu-host--kind-fab[_nghost-%COMP%]   .app-menu[_ngcontent-%COMP%], \n.app-menu-host--panel-docked.app-menu-host--layout-row[_nghost-%COMP%]   .app-menu[_ngcontent-%COMP%] {\n  display: block;\n  width: 0;\n}\n.app-menu-host--panel-bottom-docked[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n  z-index: 40;\n}\n.app-menu-host--panel-bottom-docked[_nghost-%COMP%]   .app-menu[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n}\n.app-menu__palette--default[_ngcontent-%COMP%], \n.app-menu__palette--neutral[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #eef5ff 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #f4f9ff 0%,\n      #e6f1ff 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #5f82b5 0%,\n      #436a9f 100%);\n  --app-menu-action-bg: #eef3f8;\n  --app-menu-action-bg-hover: #e8eef6;\n  --app-menu-action-fg: #36547d;\n  --app-menu-action-border: transparent;\n  --app-menu-action-shadow: none;\n  --app-menu-border: rgba(51, 79, 114, 0.2);\n  --app-menu-fg: #27496f;\n  --app-menu-icon: #426a98;\n  --app-menu-line: rgba(113, 124, 150, 0.32);\n  --app-menu-shadow: rgba(18, 39, 68, 0.12);\n}\n.app-menu__palette--brand[_ngcontent-%COMP%] {\n  --app-menu-bg: var(--deployment-control-primary-background, #fff);\n  --app-menu-bg-hover: color-mix( in srgb, var(--deployment-control-primary-background, #fff) 92%, var(--deployment-control-primary-text, #6843d8) );\n  --app-menu-bg-strong: var(--deployment-control-primary-background, #fff);\n  --app-menu-action-bg: var(--deployment-control-primary-background, #fff);\n  --app-menu-action-bg-hover: color-mix( in srgb, var(--deployment-control-primary-background, #fff) 92%, var(--deployment-control-primary-text, #6843d8) );\n  --app-menu-action-fg: var(--deployment-control-primary-text, #6843d8);\n  --app-menu-action-border: transparent;\n  --app-menu-action-shadow: 0 10px 20px color-mix( in srgb, var(--deployment-brand-shadow, rgba(71, 38, 138, 0.26)) 76%, transparent );\n  --app-menu-border: transparent;\n  --app-menu-fg: var(--deployment-control-primary-text, #6843d8);\n  --app-menu-icon: var(--deployment-control-primary-text, #6843d8);\n  --app-menu-line: color-mix(in srgb, var(--deployment-control-primary-text, #6843d8) 28%, transparent);\n  --app-menu-shadow: var(--deployment-brand-shadow, rgba(71, 38, 138, 0.26));\n}\n.app-menu__palette--ink[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      135deg,\n      #242832 0%,\n      #0f1117 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      135deg,\n      #2d323e 0%,\n      #151820 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      135deg,\n      #171a21 0%,\n      #07080b 100%);\n  --app-menu-action-bg:\n    linear-gradient(\n      135deg,\n      #171a21 0%,\n      #07080b 100%);\n  --app-menu-action-bg-hover:\n    linear-gradient(\n      135deg,\n      #20242d 0%,\n      #0b0d12 100%);\n  --app-menu-action-fg: #fff;\n  --app-menu-action-border: transparent;\n  --app-menu-action-shadow: 0 9px 20px rgba(4, 6, 10, 0.34);\n  --app-menu-border: rgba(255, 255, 255, 0.12);\n  --app-menu-fg: #fff;\n  --app-menu-icon: #fff;\n  --app-menu-line: rgba(255, 255, 255, 0.2);\n  --app-menu-shadow: rgba(4, 6, 10, 0.34);\n}\n.app-menu__palette--offline[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #64748b 0%,\n      #475569 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #718198 0%,\n      #526175 100%);\n  --app-menu-bg-strong: var(--app-menu-bg);\n  --app-menu-action-bg: var(--app-menu-bg);\n  --app-menu-action-bg-hover: var(--app-menu-bg-hover);\n  --app-menu-action-fg: #fff;\n  --app-menu-action-border: #475569;\n  --app-menu-action-shadow: none;\n  --app-menu-border: #475569;\n  --app-menu-fg: #fff;\n  --app-menu-icon: #fff;\n  --app-menu-line: rgba(255, 255, 255, 0.3);\n  --app-menu-shadow: rgba(51, 65, 85, 0.24);\n}\n.app-menu__palette--slate[_ngcontent-%COMP%], \n.app-menu__palette--muted[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #f4f6f9 0%,\n      #e7edf4 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #f9fbfd 0%,\n      #edf2f7 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #7d8ba0 0%,\n      #5e6c80 100%);\n  --app-menu-action-bg: #eef3f8;\n  --app-menu-action-bg-hover: #e8eef6;\n  --app-menu-action-fg: #36547d;\n  --app-menu-action-border: transparent;\n  --app-menu-action-shadow: none;\n  --app-menu-border: rgba(82, 101, 126, 0.28);\n  --app-menu-fg: #536174;\n  --app-menu-icon: #64748a;\n  --app-menu-line: rgba(82, 101, 126, 0.3);\n  --app-menu-shadow: rgba(57, 70, 88, 0.2);\n}\n.app-menu__palette--blue[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #f2f7ff 0%,\n      #e3efff 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #f7fbff 0%,\n      #dcecff 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #4f87cf 0%,\n      #3169ae 100%);\n  --app-menu-action-bg:\n    linear-gradient(\n      135deg,\n      #3f7bc8 0%,\n      #7556d8 100%);\n  --app-menu-action-bg-hover:\n    linear-gradient(\n      135deg,\n      #4a87d5 0%,\n      #8061e2 100%);\n  --app-menu-action-fg: #fff;\n  --app-menu-action-border: transparent;\n  --app-menu-action-shadow: 0 12px 24px rgba(60, 92, 167, 0.24);\n  --app-menu-border: rgba(58, 115, 184, 0.32);\n  --app-menu-fg: #2b5d98;\n  --app-menu-icon: #3f74b2;\n  --app-menu-line: rgba(45, 94, 168, 0.34);\n  --app-menu-shadow: rgba(34, 91, 160, 0.2);\n}\n.app-menu__palette--sky[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #eef8ff 0%,\n      #ddf0fb 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #f5fbff 0%,\n      #d6ecfa 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #47a8d1 0%,\n      #2d82ad 100%);\n  --app-menu-border: rgba(55, 139, 183, 0.34);\n  --app-menu-fg: #276b91;\n  --app-menu-icon: #2f86b0;\n  --app-menu-line: rgba(55, 139, 183, 0.34);\n  --app-menu-shadow: rgba(37, 119, 161, 0.2);\n}\n.app-menu__palette--cyan[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #eefdff 0%,\n      #d9f4f9 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #f6feff 0%,\n      #d2f0f6 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #39aabb 0%,\n      #238493 100%);\n  --app-menu-border: rgba(45, 142, 154, 0.32);\n  --app-menu-fg: #1f7280;\n  --app-menu-icon: #2f8e9d;\n  --app-menu-line: rgba(45, 142, 154, 0.34);\n  --app-menu-shadow: rgba(28, 118, 130, 0.2);\n}\n.app-menu__palette--teal[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #edfafa 0%,\n      #ddf1f2 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #f4ffff 0%,\n      #d5eeee 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #3aa3a1 0%,\n      #247f7b 100%);\n  --app-menu-border: rgba(45, 120, 130, 0.28);\n  --app-menu-fg: #2b6a74;\n  --app-menu-icon: #2b7d84;\n  --app-menu-line: rgba(45, 120, 130, 0.32);\n  --app-menu-shadow: rgba(31, 105, 112, 0.2);\n}\n.app-menu__palette--green[_ngcontent-%COMP%], \n.app-menu__palette--success[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #edf9f4 0%,\n      #e1f3ea 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #f5fcf9 0%,\n      #d9efe4 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #3aa968 0%,\n      #2f8d57 100%);\n  --app-menu-action-bg:\n    linear-gradient(\n      180deg,\n      #edf9f4 0%,\n      #e1f3ea 100%);\n  --app-menu-action-bg-hover:\n    linear-gradient(\n      180deg,\n      #f5fcf9 0%,\n      #d9efe4 100%);\n  --app-menu-action-fg: #236d51;\n  --app-menu-action-border: rgba(37, 127, 95, 0.28);\n  --app-menu-action-shadow: 0 5px 14px rgba(35, 118, 72, 0.14);\n  --app-menu-border: rgba(37, 127, 95, 0.28);\n  --app-menu-fg: #236d51;\n  --app-menu-icon: #2f8a54;\n  --app-menu-line: rgba(47, 143, 102, 0.34);\n  --app-menu-shadow: rgba(35, 118, 72, 0.22);\n}\n.app-menu__palette--mint[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #effbf5 0%,\n      #dff2e8 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #f6fdf9 0%,\n      #d8efe2 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #51b883 0%,\n      #358f63 100%);\n  --app-menu-border: rgba(46, 142, 91, 0.32);\n  --app-menu-fg: #276348;\n  --app-menu-icon: #37865a;\n  --app-menu-line: rgba(46, 142, 91, 0.34);\n  --app-menu-shadow: rgba(46, 142, 91, 0.2);\n}\n.app-menu__palette--violet[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #f3ecff 0%,\n      #e9ddff 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #f9f5ff 0%,\n      #e4d5ff 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #8a66d2 0%,\n      #6948b1 100%);\n  --app-menu-border: rgba(122, 76, 196, 0.38);\n  --app-menu-fg: #65459b;\n  --app-menu-icon: #7a4cc4;\n  --app-menu-line: rgba(106, 69, 163, 0.34);\n  --app-menu-shadow: rgba(92, 62, 150, 0.2);\n}\n.app-menu__palette--purple[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #f6efff 0%,\n      #ede2ff 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fbf7ff 0%,\n      #e8daff 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #8061c8 0%,\n      #5f3d98 100%);\n  --app-menu-border: rgba(109, 74, 172, 0.34);\n  --app-menu-fg: #5f3d98;\n  --app-menu-icon: #7358b0;\n  --app-menu-line: rgba(109, 74, 172, 0.34);\n  --app-menu-shadow: rgba(88, 55, 146, 0.2);\n}\n.app-menu__palette--pink[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #fff0f4 0%,\n      #fde6ee 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fff7fa 0%,\n      #fbdde8 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #d76d8e 0%,\n      #b84f72 100%);\n  --app-menu-border: rgba(184, 92, 116, 0.4);\n  --app-menu-fg: #94415f;\n  --app-menu-icon: #b85072;\n  --app-menu-line: rgba(184, 92, 116, 0.34);\n  --app-menu-shadow: rgba(155, 58, 86, 0.2);\n}\n.app-menu__palette--rose[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #ffe4eb 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fff8fa 0%,\n      #ffdce7 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #cb5272 0%,\n      #a83a58 100%);\n  --app-menu-border: rgba(178, 69, 98, 0.38);\n  --app-menu-fg: #8c2e49;\n  --app-menu-icon: #b94462;\n  --app-menu-line: rgba(178, 69, 98, 0.32);\n  --app-menu-shadow: rgba(137, 45, 70, 0.22);\n}\n.app-menu__palette--red[_ngcontent-%COMP%], \n.app-menu__palette--danger[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #fff1f2 0%,\n      #ffe5e7 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fff8f9 0%,\n      #ffdde0 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #e24955 0%,\n      #c93240 100%);\n  --app-menu-border: rgba(188, 54, 67, 0.38);\n  --app-menu-fg: #a43c45;\n  --app-menu-icon: #c13f4b;\n  --app-menu-line: rgba(188, 54, 67, 0.34);\n  --app-menu-shadow: rgba(163, 36, 48, 0.24);\n}\n.app-menu__palette--orange[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #fff7f0 0%,\n      #fee9da 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fffaf6 0%,\n      #fee2cd 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #df8a42 0%,\n      #bd672b 100%);\n  --app-menu-border: rgba(183, 95, 47, 0.34);\n  --app-menu-fg: #87542a;\n  --app-menu-icon: #d07d33;\n  --app-menu-line: rgba(189, 101, 42, 0.34);\n  --app-menu-shadow: rgba(157, 95, 24, 0.24);\n}\n.app-menu__palette--amber[_ngcontent-%COMP%], \n.app-menu__palette--warning[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #fff7e8 0%,\n      #ffe9c6 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fffaf2 0%,\n      #ffe3b7 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #e6a63a 0%,\n      #c68124 100%);\n  --app-menu-border: rgba(190, 127, 37, 0.38);\n  --app-menu-fg: #865a1f;\n  --app-menu-icon: #c17b22;\n  --app-menu-line: rgba(190, 127, 37, 0.34);\n  --app-menu-shadow: rgba(157, 95, 24, 0.24);\n}\n.app-menu__palette--gold[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #fff7df 0%,\n      #ffedbb 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fffaf0 0%,\n      #ffe6a8 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #dfb13f 0%,\n      #bf8b22 100%);\n  --app-menu-border: rgba(189, 141, 51, 0.42);\n  --app-menu-fg: #835d14;\n  --app-menu-icon: #c8921e;\n  --app-menu-line: rgba(189, 141, 51, 0.34);\n  --app-menu-shadow: rgba(157, 111, 24, 0.22);\n}\n.app-menu__palette--brown[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #fff5ec 0%,\n      #feead9 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fffaf5 0%,\n      #fee2ca 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #ad7040 0%,\n      #8a5428 100%);\n  --app-menu-border: rgba(151, 92, 41, 0.3);\n  --app-menu-fg: #8a5428;\n  --app-menu-icon: #9a6229;\n  --app-menu-line: rgba(154, 98, 41, 0.34);\n  --app-menu-shadow: rgba(132, 78, 31, 0.22);\n}\n.app-menu__palette--filter[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #eefbf4 0%,\n      #dff2e8 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #f7fdf9 0%,\n      #d8efdf 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #43ad73 0%,\n      #2f8d57 100%);\n  --app-menu-border: rgba(50, 142, 91, 0.3);\n  --app-menu-fg: #236d51;\n  --app-menu-icon: #2f8a54;\n  --app-menu-line: rgba(48, 143, 93, 0.34);\n  --app-menu-shadow: rgba(34, 118, 72, 0.2);\n}\n.app-menu__palette--aries[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #fff5f2 0%,\n      #ffe9e4 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fff9f7 0%,\n      #ffdfd7 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #cf624c 0%,\n      #9b3f2c 100%);\n  --app-menu-border: rgba(155, 63, 44, 0.34);\n  --app-menu-fg: #9b3f2c;\n  --app-menu-icon: #b34f39;\n  --app-menu-line: rgba(155, 63, 44, 0.32);\n  --app-menu-shadow: rgba(155, 63, 44, 0.16);\n}\n.app-menu__palette--taurus[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #f5fbf2 0%,\n      #e6f5e1 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fbfef9 0%,\n      #ddefd7 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #64a857 0%,\n      #3d7a31 100%);\n  --app-menu-border: rgba(61, 122, 49, 0.32);\n  --app-menu-fg: #3d7a31;\n  --app-menu-icon: #4f8f42;\n  --app-menu-line: rgba(61, 122, 49, 0.3);\n  --app-menu-shadow: rgba(61, 122, 49, 0.16);\n}\n.app-menu__palette--gemini[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #fffbed 0%,\n      #fff3c4 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fffef6 0%,\n      #ffedb2 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #c9a733 0%,\n      #806219 100%);\n  --app-menu-border: rgba(128, 98, 25, 0.34);\n  --app-menu-fg: #806219;\n  --app-menu-icon: #9f7b20;\n  --app-menu-line: rgba(128, 98, 25, 0.32);\n  --app-menu-shadow: rgba(128, 98, 25, 0.16);\n}\n.app-menu__palette--cancer[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #f3fcff 0%,\n      #e1f6fb 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #f9feff 0%,\n      #d5f0f8 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #49a8bd 0%,\n      #237083 100%);\n  --app-menu-border: rgba(35, 112, 131, 0.32);\n  --app-menu-fg: #237083;\n  --app-menu-icon: #32899f;\n  --app-menu-line: rgba(35, 112, 131, 0.32);\n  --app-menu-shadow: rgba(35, 112, 131, 0.16);\n}\n.app-menu__palette--leo[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #fff9eb 0%,\n      #ffedbd 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fffdf5 0%,\n      #ffe6a7 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #d8942d 0%,\n      #975d12 100%);\n  --app-menu-border: rgba(151, 93, 18, 0.36);\n  --app-menu-fg: #975d12;\n  --app-menu-icon: #b47118;\n  --app-menu-line: rgba(151, 93, 18, 0.32);\n  --app-menu-shadow: rgba(151, 93, 18, 0.16);\n}\n.app-menu__palette--virgo[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #fbfdec 0%,\n      #eef5cf 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fefff6 0%,\n      #e7efc1 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #91a74a 0%,\n      #62752b 100%);\n  --app-menu-border: rgba(98, 117, 43, 0.32);\n  --app-menu-fg: #62752b;\n  --app-menu-icon: #778c37;\n  --app-menu-line: rgba(98, 117, 43, 0.32);\n  --app-menu-shadow: rgba(98, 117, 43, 0.16);\n}\n.app-menu__palette--libra[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #fff5fa 0%,\n      #fde4f0 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fffafd 0%,\n      #fad9ea 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #d76d9d 0%,\n      #9a3f70 100%);\n  --app-menu-border: rgba(154, 63, 112, 0.34);\n  --app-menu-fg: #9a3f70;\n  --app-menu-icon: #b55183;\n  --app-menu-line: rgba(154, 63, 112, 0.32);\n  --app-menu-shadow: rgba(154, 63, 112, 0.16);\n}\n.app-menu__palette--scorpio[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #fbf4ff 0%,\n      #f0e0fa 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fefaff 0%,\n      #ead5f7 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #9257b0 0%,\n      #663285 100%);\n  --app-menu-border: rgba(102, 50, 133, 0.34);\n  --app-menu-fg: #663285;\n  --app-menu-icon: #7b419d;\n  --app-menu-line: rgba(102, 50, 133, 0.32);\n  --app-menu-shadow: rgba(102, 50, 133, 0.16);\n}\n.app-menu__palette--sagittarius[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #f7f4ff 0%,\n      #ebe3ff 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fcfaff 0%,\n      #e4d8ff 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #7f63d4 0%,\n      #553ca0 100%);\n  --app-menu-border: rgba(85, 60, 160, 0.34);\n  --app-menu-fg: #553ca0;\n  --app-menu-icon: #674db8;\n  --app-menu-line: rgba(85, 60, 160, 0.32);\n  --app-menu-shadow: rgba(85, 60, 160, 0.16);\n}\n.app-menu__palette--capricorn[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #fcf6f0 0%,\n      #f3e6d8 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fffbf7 0%,\n      #eedcc9 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #9b7657 0%,\n      #705032 100%);\n  --app-menu-border: rgba(112, 80, 50, 0.34);\n  --app-menu-fg: #705032;\n  --app-menu-icon: #866340;\n  --app-menu-line: rgba(112, 80, 50, 0.32);\n  --app-menu-shadow: rgba(112, 80, 50, 0.16);\n}\n.app-menu__palette--aquarius[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #f4f9ff 0%,\n      #e3f0ff 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fbfdff 0%,\n      #d8eaff 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #4f86c8 0%,\n      #2c5f9f 100%);\n  --app-menu-border: rgba(44, 95, 159, 0.34);\n  --app-menu-fg: #2c5f9f;\n  --app-menu-icon: #3d74b3;\n  --app-menu-line: rgba(44, 95, 159, 0.32);\n  --app-menu-shadow: rgba(44, 95, 159, 0.16);\n}\n.app-menu__palette--pisces[_ngcontent-%COMP%] {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #f3fcfa 0%,\n      #def3ef 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #f9fffd 0%,\n      #d3eee9 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #45a99b 0%,\n      #277268 100%);\n  --app-menu-border: rgba(39, 114, 104, 0.34);\n  --app-menu-fg: #277268;\n  --app-menu-icon: #348a7f;\n  --app-menu-line: rgba(39, 114, 104, 0.32);\n  --app-menu-shadow: rgba(39, 114, 104, 0.16);\n}\n.app-menu__trigger[_ngcontent-%COMP%] {\n  appearance: none;\n  -webkit-appearance: none;\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.34rem;\n  min-width: 2.25rem;\n  min-height: 2.25rem;\n  border: 1px solid var(--app-menu-border);\n  border-radius: 999px;\n  padding: 0.42rem 0.58rem;\n  background: var(--app-menu-bg);\n  color: var(--app-menu-fg);\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 800;\n  line-height: 1.22;\n  cursor: pointer;\n  box-shadow: 0 8px 18px var(--app-menu-shadow);\n  overflow: visible;\n  isolation: isolate;\n  transition:\n    transform 0.14s ease,\n    box-shadow 0.14s ease,\n    border-color 0.14s ease,\n    background 0.14s ease,\n    color 0.14s ease,\n    filter 0.14s ease;\n}\n.app-menu__trigger-wave-surface[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  z-index: 0;\n  overflow: hidden;\n  border-radius: inherit;\n  pointer-events: none;\n}\n.app-menu__trigger[_ngcontent-%COMP%]    > .mat-icon[_ngcontent-%COMP%], \n.app-menu__trigger[_ngcontent-%COMP%]    > .app-menu__trigger-image[_ngcontent-%COMP%], \n.app-menu__trigger[_ngcontent-%COMP%]    > .app-menu__trigger-label[_ngcontent-%COMP%], \n.app-menu__trigger[_ngcontent-%COMP%]    > .app-menu__trigger-caret[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n}\n.app-menu-host--compact[_nghost-%COMP%]   .app-menu__trigger[_ngcontent-%COMP%] {\n  gap: var(--app-menu-compact-trigger-gap);\n  min-width: 0;\n  padding-inline: var(--app-menu-compact-trigger-padding-inline);\n  font-size: var(--app-menu-compact-trigger-font-size);\n}\n.app-menu-host--compact[_nghost-%COMP%]   .app-menu__trigger[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.app-menu-host--compact[_nghost-%COMP%]   .app-menu__trigger-caret[_ngcontent-%COMP%] {\n  width: var(--app-menu-compact-trigger-icon-size);\n  height: var(--app-menu-compact-trigger-icon-size);\n  font-size: var(--app-menu-compact-trigger-icon-size);\n  line-height: var(--app-menu-compact-trigger-icon-size);\n}\n.app-menu__trigger[_ngcontent-%COMP%]:hover {\n  background: var(--app-menu-bg-hover);\n  box-shadow: 0 10px 22px var(--app-menu-shadow);\n  filter: brightness(1.02);\n}\n.app-menu__trigger[_ngcontent-%COMP%]:active {\n  transform: translateY(1px);\n  box-shadow: 0 7px 16px var(--app-menu-shadow);\n}\n.app-menu__trigger[_ngcontent-%COMP%]:disabled {\n  cursor: default;\n  opacity: 0.58;\n  filter: grayscale(0.2);\n  box-shadow: none;\n}\n.app-menu__trigger--open[_ngcontent-%COMP%] {\n  filter: brightness(0.98);\n}\n.app-menu__trigger--label-hidden[_ngcontent-%COMP%] {\n  width: 2.25rem;\n  height: 2.25rem;\n  padding: 0;\n}\n@media (max-width: 760px) {\n  .app-menu__trigger--collapsible[_ngcontent-%COMP%] {\n    width: 2.25rem;\n    height: 2.25rem;\n    padding: 0;\n    gap: 0;\n  }\n  .app-menu__trigger--collapsible[_ngcontent-%COMP%]   .app-menu__trigger-label[_ngcontent-%COMP%], \n   .app-menu__trigger--collapsible[_ngcontent-%COMP%]   .app-menu__trigger-caret[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n.app-menu__trigger--layout-icon[_ngcontent-%COMP%] {\n  display: inline-grid;\n  place-items: center;\n  width: 34px;\n  height: 34px;\n  min-width: 34px;\n  min-height: 34px;\n  border: 1px solid var(--app-menu-border);\n  padding: 0;\n  background: var(--app-menu-bg);\n  box-shadow: none;\n  color: var(--app-menu-icon);\n}\n.app-menu__trigger--layout-icon[_ngcontent-%COMP%]:hover {\n  background: var(--app-menu-bg-hover);\n  box-shadow: 0 2px 8px rgba(26, 43, 69, 0.15);\n  color: var(--app-menu-icon);\n  filter: none;\n  transform: none;\n}\n.app-menu__trigger--layout-icon[_ngcontent-%COMP%]:active {\n  box-shadow: none;\n  transform: scale(0.95);\n}\n.app-menu__trigger--layout-icon.app-menu__trigger--open[_ngcontent-%COMP%] {\n  background: var(--app-menu-bg-hover);\n  color: var(--app-menu-icon);\n  filter: none;\n  box-shadow: 0 4px 10px rgba(21, 39, 68, 0.16);\n  transform: none;\n}\n.app-menu-host--kind-fab[_nghost-%COMP%]   .app-menu__trigger--layout-icon[_ngcontent-%COMP%] {\n  width: 42px;\n  height: 42px;\n  min-width: 42px;\n  min-height: 42px;\n  border-radius: 50%;\n  box-shadow: 0 8px 18px var(--app-menu-shadow);\n}\n.app-menu-host--draggable[_nghost-%COMP%] {\n  will-change: transform;\n}\n.app-menu-host--draggable[_nghost-%COMP%]   .app-menu__trigger--layout-icon[_ngcontent-%COMP%] {\n  cursor: var(--app-menu-draggable-cursor, grab);\n  touch-action: none;\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  user-select: none;\n}\n.app-menu-host--dragging[_nghost-%COMP%]   .app-menu__trigger--layout-icon[_ngcontent-%COMP%] {\n  cursor: grabbing;\n}\n.app-menu-host--dragging[_nghost-%COMP%]   .app-menu__trigger--layout-icon[_ngcontent-%COMP%]:active {\n  transform: none;\n}\n.app-menu-host--kind-fab[_nghost-%COMP%]   .app-menu__trigger--layout-icon[_ngcontent-%COMP%]:hover {\n  box-shadow: 0 10px 22px var(--app-menu-shadow);\n}\n.app-menu-host--kind-fab[_nghost-%COMP%]   .app-menu__trigger--layout-icon.app-menu__trigger--open[_ngcontent-%COMP%] {\n  box-shadow: 0 8px 18px var(--app-menu-shadow);\n}\n.app-menu-host--kind-fab[_nghost-%COMP%]   .app-menu__trigger--layout-icon[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 20px;\n  height: 20px;\n  font-size: 20px;\n  line-height: 20px;\n}\n.app-menu__trigger[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 1.14rem;\n  height: 1.14rem;\n  font-size: 1.14rem;\n  line-height: 1.14rem;\n  color: var(--app-menu-icon);\n}\n.app-menu__trigger-image[_ngcontent-%COMP%], \n.app-menu__item-image[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  display: inline-flex;\n  flex: 0 0 auto;\n  align-items: center;\n  justify-content: center;\n  overflow: hidden;\n  border: 1px solid rgba(255, 255, 255, 0.76);\n  border-radius: 7px;\n  background: rgba(255, 255, 255, 0.78);\n  color: var(--app-menu-fg);\n  font-weight: 900;\n  line-height: 1;\n}\n.app-menu__trigger-image[_ngcontent-%COMP%] {\n  width: 2.4rem;\n  height: 1.36rem;\n  padding: 0.12rem;\n}\n.app-menu__trigger-image[_ngcontent-%COMP%]   img[_ngcontent-%COMP%], \n.app-menu__item-image[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 100%;\n  object-fit: contain;\n  pointer-events: none;\n}\n.app-menu__trigger-image[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%], \n.app-menu__item-image[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n}\n.app-menu__trigger-image[_ngcontent-%COMP%]    > [hidden][_ngcontent-%COMP%], \n.app-menu__item-image[_ngcontent-%COMP%]    > [hidden][_ngcontent-%COMP%] {\n  display: none;\n}\n.app-menu-host--compact[_nghost-%COMP%]   .app-menu__trigger-image[_ngcontent-%COMP%] {\n  width: 2.1rem;\n  height: 1.18rem;\n}\n.app-menu__trigger-icon--symbol[_ngcontent-%COMP%], \n.app-menu__item-icon--symbol[_ngcontent-%COMP%] {\n  font-family:\n    "Noto Sans Symbols 2",\n    "Noto Sans Symbols",\n    "Segoe UI Symbol",\n    sans-serif;\n  font-weight: 700;\n}\n.app-menu__trigger--layout-icon[_ngcontent-%COMP%]    > .mat-icon[_ngcontent-%COMP%]:not(.app-menu__trigger-caret) {\n  grid-area: 1/1;\n  justify-self: center;\n  margin: 0;\n  position: relative;\n  z-index: 1;\n  transform-origin: center;\n  transition:\n    transform 0.18s cubic-bezier(0.22, 0.61, 0.36, 1),\n    opacity 0.14s ease,\n    filter 0.14s ease;\n}\n.app-menu__trigger--layout-icon.app-menu__trigger--open[_ngcontent-%COMP%]    > .mat-icon[_ngcontent-%COMP%]:not(.app-menu__trigger-caret) {\n  transform: rotate(90deg);\n}\n.app-menu__trigger--layout-icon[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  color: currentColor;\n}\n.app-menu__trigger-label[_ngcontent-%COMP%] {\n  min-width: 0;\n  line-height: 1.22;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.app-menu__trigger-caret[_ngcontent-%COMP%] {\n  transition: transform 0.16s ease;\n}\n.app-menu__trigger--open[_ngcontent-%COMP%]   .app-menu__trigger-caret[_ngcontent-%COMP%]:not(.app-menu__trigger-caret--static) {\n  transform: rotate(180deg);\n}\n.app-menu-host--kind-select.app-menu-host--trigger-field[_nghost-%COMP%]   .app-menu__trigger[_ngcontent-%COMP%], \n.app-menu-host--model-layout-tabs.app-menu-host--trigger-field[_nghost-%COMP%]   .app-menu__trigger[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  min-height: 34px;\n  border: 1px solid var(--app-menu-border);\n  border-radius: 8px;\n  padding: 0 0.52rem;\n  background: var(--app-menu-bg);\n  color: var(--app-menu-fg);\n  box-shadow: none;\n  justify-content: space-between;\n  font-size: 0.82rem;\n  font-weight: 800;\n}\n.app-menu-host--kind-select.app-menu-host--trigger-field[_nghost-%COMP%]   .app-menu__trigger[_ngcontent-%COMP%]:hover, \n.app-menu-host--kind-select.app-menu-host--trigger-field[_nghost-%COMP%]   .app-menu__trigger--open[_ngcontent-%COMP%], \n.app-menu-host--model-layout-tabs.app-menu-host--trigger-field[_nghost-%COMP%]   .app-menu__trigger[_ngcontent-%COMP%]:hover, \n.app-menu-host--model-layout-tabs.app-menu-host--trigger-field[_nghost-%COMP%]   .app-menu__trigger--open[_ngcontent-%COMP%] {\n  border-color: var(--app-menu-border);\n  background: var(--app-menu-bg-hover);\n  box-shadow: none;\n  filter: none;\n}\n.app-menu-host--kind-select.app-menu-host--trigger-field[_nghost-%COMP%]   .app-menu__trigger--placeholder[_ngcontent-%COMP%], \n.app-menu-host--model-layout-tabs.app-menu-host--trigger-field[_nghost-%COMP%]   .app-menu__trigger--placeholder[_ngcontent-%COMP%] {\n  border-color: rgba(211, 124, 36, 0.52);\n  background:\n    linear-gradient(\n      180deg,\n      #fff8ed 0%,\n      #fff0d8 100%);\n  color: #9b611e;\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.72), 0 0 0 1px rgba(235, 156, 55, 0.16);\n}\n.app-menu-host--kind-select.app-menu-host--trigger-field[_nghost-%COMP%]   .app-menu__trigger--placeholder[_ngcontent-%COMP%]:hover, \n.app-menu-host--kind-select.app-menu-host--trigger-field[_nghost-%COMP%]   .app-menu__trigger--placeholder.app-menu__trigger--open[_ngcontent-%COMP%], \n.app-menu-host--model-layout-tabs.app-menu-host--trigger-field[_nghost-%COMP%]   .app-menu__trigger--placeholder[_ngcontent-%COMP%]:hover, \n.app-menu-host--model-layout-tabs.app-menu-host--trigger-field[_nghost-%COMP%]   .app-menu__trigger--placeholder.app-menu__trigger--open[_ngcontent-%COMP%] {\n  border-color: rgba(205, 111, 22, 0.66);\n  background:\n    linear-gradient(\n      180deg,\n      #fff5e5 0%,\n      #ffe9c7 100%);\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.78), 0 0 0 3px rgba(240, 151, 35, 0.12);\n}\n.app-menu-host--kind-select.app-menu-host--trigger-field[_nghost-%COMP%]   .app-menu__trigger--placeholder[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.app-menu-host--model-layout-tabs.app-menu-host--trigger-field[_nghost-%COMP%]   .app-menu__trigger--placeholder[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.app-menu-host--kind-select.app-menu-host--trigger-field[_nghost-%COMP%]   .app-menu__trigger--placeholder[_ngcontent-%COMP%]   .app-menu__trigger-caret[_ngcontent-%COMP%], \n.app-menu-host--model-layout-tabs.app-menu-host--trigger-field[_nghost-%COMP%]   .app-menu__trigger--placeholder[_ngcontent-%COMP%]   .app-menu__trigger-caret[_ngcontent-%COMP%] {\n  color: #b46718;\n}\n.app-menu-host--kind-select.app-menu-host--trigger-field[_nghost-%COMP%]   .app-menu__trigger[_ngcontent-%COMP%]:active, \n.app-menu-host--model-layout-tabs.app-menu-host--trigger-field[_nghost-%COMP%]   .app-menu__trigger[_ngcontent-%COMP%]:active {\n  transform: none;\n  box-shadow: none;\n}\n.app-menu-host--kind-select.app-menu-host--trigger-field[_nghost-%COMP%]   .app-menu__trigger-label[_ngcontent-%COMP%], \n.app-menu-host--model-layout-tabs.app-menu-host--trigger-field[_nghost-%COMP%]   .app-menu__trigger-label[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  text-align: left;\n}\n.app-menu-host--kind-select[_nghost-%COMP%]   .app-menu__trigger-caret[_ngcontent-%COMP%], \n.app-menu-host--model-layout-tabs[_nghost-%COMP%]   .app-menu__trigger-caret[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  color: #426a98;\n}\n.app-menu-host--compact.app-menu-host--kind-select[_nghost-%COMP%]   .app-menu__trigger-caret[_ngcontent-%COMP%], \n.app-menu-host--compact.app-menu-host--model-layout-tabs[_nghost-%COMP%]   .app-menu__trigger-caret[_ngcontent-%COMP%] {\n  flex-basis: var(--app-menu-compact-trigger-icon-size);\n  width: var(--app-menu-compact-trigger-icon-size);\n  height: var(--app-menu-compact-trigger-icon-size);\n  font-size: var(--app-menu-compact-trigger-icon-size);\n  line-height: var(--app-menu-compact-trigger-icon-size);\n}\n.app-menu__button-row[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-wrap: var(--app-menu-row-wrap, nowrap);\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.34rem;\n  width: 100%;\n  min-width: 0;\n  overflow: visible;\n}\n.app-menu-host--compact[_nghost-%COMP%]   .app-menu__button-row[_ngcontent-%COMP%] {\n  gap: var(--app-menu-compact-row-gap);\n}\n.app-menu__button-row-item[_ngcontent-%COMP%] {\n  appearance: none;\n  -webkit-appearance: none;\n  position: relative;\n  width: 32px;\n  height: 32px;\n  min-width: 32px;\n  min-height: 32px;\n  border: 1px solid var(--app-menu-border);\n  border-radius: 50%;\n  padding: 0;\n  background: var(--app-menu-bg);\n  color: var(--app-menu-icon);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  transition:\n    transform 0.16s ease,\n    background-color 0.16s ease,\n    color 0.16s ease,\n    filter 0.16s ease,\n    box-shadow 0.16s ease;\n}\n.app-menu__button-row-item[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 3;\n  flex: 0 0 18px;\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  color: currentColor;\n}\n.app-menu__button-row-ring[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: -1px;\n  z-index: 2;\n  border-radius: inherit;\n  pointer-events: none;\n}\n.app-menu__button-row-item--progress[_ngcontent-%COMP%] {\n  overflow: visible;\n}\n.app-menu__button-row-item--labelled[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  width: var(--app-menu-row-item-width, auto);\n  justify-content: var(--app-menu-row-item-justify, center);\n  min-width: 118px;\n  height: 36px;\n  min-height: 36px;\n  border: 1px solid var(--app-menu-border);\n  border-radius: 999px;\n  gap: 0.34rem;\n  padding: 0 0.66rem;\n  background: var(--app-menu-bg);\n  color: var(--app-menu-fg);\n  font-size: 0.76rem;\n  font-weight: 900;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.76);\n}\n.app-menu-host--compact[_nghost-%COMP%]   .app-menu__button-row-item--labelled[_ngcontent-%COMP%] {\n  min-width: var(--app-menu-compact-row-item-min-width);\n  gap: var(--app-menu-compact-row-item-gap);\n  padding-inline: var(--app-menu-compact-row-item-padding-inline);\n  font-size: var(--app-menu-compact-row-item-font-size);\n}\n.app-menu-host--compact[_nghost-%COMP%]   .app-menu__button-row-item[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.app-menu-host--compact[_nghost-%COMP%]   .app-menu__button-row-caret[_ngcontent-%COMP%] {\n  flex-basis: var(--app-menu-compact-row-item-icon-size);\n  width: var(--app-menu-compact-row-item-icon-size);\n  height: var(--app-menu-compact-row-item-icon-size);\n  font-size: var(--app-menu-compact-row-item-icon-size);\n  line-height: var(--app-menu-compact-row-item-icon-size);\n}\n.app-menu__button-row-item--action[_ngcontent-%COMP%] {\n  border-color: rgba(31, 63, 105, 0.18);\n  background: var(--app-menu-bg-strong);\n  color: #fff;\n  box-shadow: 0 5px 14px rgba(12, 24, 40, 0.16);\n}\n.app-menu__button-row-item--image[_ngcontent-%COMP%] {\n  width: var(--app-menu-image-button-size, 42px);\n  height: var(--app-menu-image-button-size, 42px);\n  min-width: var(--app-menu-image-button-size, 42px);\n  min-height: var(--app-menu-image-button-size, 42px);\n  border: 0;\n  background: transparent;\n  color: #fff;\n  box-shadow: 0 6px 16px rgba(16, 30, 56, 0.2);\n  overflow: visible;\n}\n.app-menu__button-row-item--image-stack[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  width: auto;\n  min-width: var(--app-menu-image-stack-min-width, 0);\n  height: var(--app-menu-image-stack-height, 34px);\n  min-height: var(--app-menu-image-stack-height, 34px);\n  max-height: var(--app-menu-image-stack-height, 34px);\n  border-radius: 999px;\n  padding: var(--app-menu-image-stack-padding, 1px);\n  background: var(--app-menu-image-stack-bg, linear-gradient(180deg, #f7fbff 0%, #edf4ff 100%));\n  border-color: var(--app-menu-image-stack-border, rgba(48, 85, 138, 0.34));\n  color: var(--app-menu-image-stack-fg, #2c5f9b);\n  box-shadow: var(--app-menu-image-stack-shadow, 0 2px 8px rgba(31, 79, 132, 0.18));\n  overflow: visible;\n}\n.app-menu__button-row-item--image[_ngcontent-%COMP%]   .app-menu__button-row-ring[_ngcontent-%COMP%] {\n  inset: var(--app-menu-image-ring-inset, -4px);\n}\n.app-menu__button-row-image[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 3;\n  width: 100%;\n  height: 100%;\n  border-radius: inherit;\n  overflow: hidden;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  background: var(--app-menu-bg-strong);\n  color: #fff;\n  font-size: 0.78rem;\n  font-weight: 900;\n  line-height: 1;\n  text-transform: uppercase;\n}\n.app-menu__button-row-item--image[_ngcontent-%COMP%]   .app-menu__counter--trigger[_ngcontent-%COMP%] {\n  top: var(--app-menu-image-counter-top, -4px);\n  right: var(--app-menu-image-counter-right, -2px);\n  min-width: var(--app-menu-image-counter-size, 22px);\n  height: var(--app-menu-image-counter-size, 22px);\n  font-size: var(--app-menu-image-counter-font-size, 11px);\n  box-shadow: 0 0 0 2px #fff;\n}\n.app-menu__button-row-image[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n.app-menu__button-row-image[_ngcontent-%COMP%]    > [hidden][_ngcontent-%COMP%] {\n  display: none;\n}\n.app-menu__button-row-image-stack[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 3;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex: 0 0 auto;\n  min-width: 0;\n  padding-left: 0;\n}\n.app-menu__button-row-stack-image[_ngcontent-%COMP%] {\n  flex: 0 0 var(--app-menu-image-stack-avatar-size, 30px);\n  width: var(--app-menu-image-stack-avatar-size, 30px);\n  height: var(--app-menu-image-stack-avatar-size, 30px);\n  min-width: var(--app-menu-image-stack-avatar-size, 30px);\n  min-height: var(--app-menu-image-stack-avatar-size, 30px);\n  border-radius: 50%;\n  border: 2px solid #fff;\n  background: var(--app-menu-bg-strong);\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  overflow: hidden;\n  font-size: 0.62rem;\n  font-weight: 900;\n  line-height: 1;\n  text-transform: uppercase;\n  box-shadow: 0 2px 5px rgba(22, 42, 70, 0.18);\n}\n.app-menu__button-row-stack-image[_ngcontent-%COMP%]    + .app-menu__button-row-stack-image[_ngcontent-%COMP%] {\n  margin-left: var(--app-menu-image-stack-overlap, -0.58rem);\n}\n.app-menu__button-row-stack-image[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n.app-menu__button-row-item--image[_ngcontent-%COMP%]:not(:disabled):hover {\n  background: transparent;\n}\n.app-menu__button-row-item--image-stack[_ngcontent-%COMP%]:not(:disabled):hover {\n  background: var(--app-menu-image-stack-hover-bg, linear-gradient(180deg, #edf7ff 0%, #dcecff 100%));\n  border-color: var(--app-menu-image-stack-hover-border, rgba(48, 85, 138, 0.48));\n}\n.app-menu__button-row-item--action.app-menu__button-row-item--labelled[_ngcontent-%COMP%] {\n  flex: var(--app-menu-action-flex, 0 0 auto);\n  min-width: var(--app-menu-action-min-width, auto);\n  height: var(--app-menu-action-height, 36px);\n  min-height: var(--app-menu-action-height, 36px);\n  border-color: var(--app-menu-action-border, transparent);\n  border-radius: 999px;\n  padding: var(--app-menu-action-padding, 0 0.76rem);\n  background: var(--app-menu-action-bg, var(--app-menu-bg-strong));\n  color: var(--app-menu-action-fg, #fff);\n  font-size: 0.78rem;\n  font-weight: 800;\n  box-shadow: var(--app-menu-action-shadow, 0 10px 22px var(--app-menu-shadow));\n}\n.app-menu__button-row-item--action.app-menu__button-row-item--labelled[_ngcontent-%COMP%]   .app-menu__counter--trigger[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -0.55rem;\n  right: -0.5rem;\n  min-width: 1.25rem;\n  height: 1.25rem;\n  padding: 0 0.32rem;\n  border-radius: 999px;\n  border: 1px solid #fff;\n  background: #e14454;\n  color: #fff;\n  font-size: 0.62rem;\n  font-weight: 900;\n  line-height: 1;\n  box-shadow: 0 8px 16px rgba(170, 31, 52, 0.24);\n}\n.app-menu__button-row-item--selected-value[_ngcontent-%COMP%] {\n  max-width: 12rem;\n}\n.app-menu__button-row-item--labelled[_ngcontent-%COMP%]:hover {\n  background: var(--app-menu-bg);\n}\n.app-menu__button-row-item[_ngcontent-%COMP%]:not(:disabled):hover {\n  background: var(--app-menu-bg-hover);\n  color: var(--app-menu-icon);\n  transform: translateY(-1px) scale(1.04);\n}\n.app-menu__button-row-item--labelled[_ngcontent-%COMP%]:not(:disabled):hover {\n  background: var(--app-menu-bg-hover);\n  color: var(--app-menu-fg);\n}\n.app-menu__button-row-item--action[_ngcontent-%COMP%]:not(:disabled):hover, \n.app-menu__button-row-item--action.app-menu__button-row-item--labelled[_ngcontent-%COMP%]:not(:disabled):hover {\n  background: var(--app-menu-bg-strong);\n  color: #fff;\n  box-shadow: 0 18px 34px var(--app-menu-shadow);\n}\n.app-menu__button-row-item--action.app-menu__button-row-item--labelled[_ngcontent-%COMP%]:not(:disabled):hover {\n  background: var(--app-menu-action-bg-hover, var(--app-menu-action-bg, var(--app-menu-bg-strong)));\n  color: var(--app-menu-action-fg, #fff);\n  box-shadow: var(--app-menu-action-shadow, 0 10px 22px var(--app-menu-shadow));\n  filter: brightness(1.02);\n  transform: none;\n}\n.app-menu__button-row-item[_ngcontent-%COMP%]:not(:disabled):active {\n  transform: scale(0.92);\n}\n.app-menu__button-row-item--action.app-menu__button-row-item--labelled[_ngcontent-%COMP%]:not(:disabled):active {\n  transform: translateY(1px);\n}\n.app-menu__button-row-item--open[_ngcontent-%COMP%] {\n  background: var(--app-menu-bg-hover);\n  color: var(--app-menu-icon);\n  transform: translateY(-1px) scale(1.03);\n}\n.app-menu__button-row-item--active[_ngcontent-%COMP%] {\n  border: 1px solid rgba(31, 63, 105, 0.18);\n  background: var(--app-menu-bg-strong);\n  color: #fff;\n  box-shadow: 0 5px 14px rgba(12, 24, 40, 0.16);\n}\n.app-menu__button-row-item--action.app-menu__button-row-item--labelled.app-menu__button-row-item--active[_ngcontent-%COMP%] {\n  border-color: rgba(31, 63, 105, 0.18);\n  background: var(--app-menu-bg-strong);\n  color: #fff;\n}\n.app-menu__button-row-item--labelled.app-menu__button-row-item--open[_ngcontent-%COMP%] {\n  border-color: var(--app-menu-border);\n  background: var(--app-menu-bg-hover);\n  color: var(--app-menu-fg);\n}\n.app-menu__button-row-main[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 3;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.34rem;\n  max-width: 100%;\n  min-width: 0;\n}\n.app-menu-host--compact[_nghost-%COMP%]   .app-menu__button-row-main[_ngcontent-%COMP%] {\n  gap: var(--app-menu-compact-row-item-gap);\n}\n.app-menu__button-row-main[_ngcontent-%COMP%]   .app-menu__button-row-label[_ngcontent-%COMP%] {\n  flex: 0 1 auto;\n}\n.app-menu__button-row-toggle[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 3;\n  margin-left: 0.12rem;\n}\n.app-menu__button-row-label[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.app-menu__button-row-caret[_ngcontent-%COMP%] {\n  flex: 0 0 18px;\n  transition: transform 0.16s ease;\n}\n.app-menu-host--compact[_nghost-%COMP%]   .app-menu__button-row-caret[_ngcontent-%COMP%] {\n  flex: 0 0 var(--app-menu-compact-row-item-icon-size);\n}\n.app-menu__button-row-item--open[_ngcontent-%COMP%]   .app-menu__button-row-caret[_ngcontent-%COMP%] {\n  transform: rotate(180deg);\n}\n.app-menu__button-row-item--labelled[_ngcontent-%COMP%]   .app-menu__counter--trigger[_ngcontent-%COMP%] {\n  position: static;\n  min-width: 22px;\n  height: 22px;\n  border-radius: 999px;\n  padding: 0 5px;\n  background: #e7f1ff;\n  color: #2e5f98;\n  font-size: 0.72rem;\n  box-shadow: none;\n}\n.app-menu__button-row-item--labelled[_ngcontent-%COMP%]   .app-menu__counter--trigger[_ngcontent-%COMP%]:is(.app-menu__counter--alert, .app-menu__counter--success) {\n  position: absolute;\n  top: var(--app-menu-trigger-counter-top, -0.34rem);\n  right: var(--app-menu-trigger-counter-right, -0.28rem);\n  min-width: var(--app-menu-counter-min-width, 1.22rem);\n  height: var(--app-menu-counter-height, 1.22rem);\n  padding: var(--app-menu-counter-padding, 0 0.32rem);\n  color: #fff;\n}\n.app-menu__button-row-item--labelled[_ngcontent-%COMP%]   .app-menu__counter--trigger.app-menu__counter--alert[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e24955 0%,\n      #c93240 100%);\n  box-shadow: 0 5px 10px rgba(163, 36, 48, 0.24);\n}\n.app-menu__button-row-item--labelled[_ngcontent-%COMP%]   .app-menu__counter--trigger.app-menu__counter--success[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #2da66f 0%,\n      #208456 100%);\n  box-shadow: 0 5px 10px rgba(26, 119, 76, 0.24);\n}\n.app-menu__button-row-item--labelled[_ngcontent-%COMP%]:has(.app-menu__counter--alert, .app-menu__counter--success) {\n  overflow: visible;\n}\n.app-menu__button-row-item--active[_ngcontent-%COMP%]:not(:disabled):hover, \n.app-menu__button-row-item--labelled.app-menu__button-row-item--active[_ngcontent-%COMP%]:not(:disabled):hover, \n.app-menu__button-row-item--labelled.app-menu__button-row-item--active.app-menu__button-row-item--open[_ngcontent-%COMP%] {\n  border-color: rgba(31, 63, 105, 0.18);\n  background: var(--app-menu-bg-strong);\n  color: #fff;\n}\n.app-menu-host--inline-row-big[_nghost-%COMP%]   .app-menu[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.app-menu-host--inline-row-big[_nghost-%COMP%]   .app-menu__button-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(185px, 1fr));\n  align-items: stretch;\n  justify-content: stretch;\n  gap: 0.72rem;\n}\n.app-menu-host--inline-row-big[_nghost-%COMP%]   .app-menu__button-row-item[_ngcontent-%COMP%], \n.app-menu-host--inline-row-big[_nghost-%COMP%]   .app-menu__button-row-item--labelled[_ngcontent-%COMP%], \n.app-menu-host--inline-row-big[_nghost-%COMP%]   .app-menu__button-row-item--active[_ngcontent-%COMP%], \n.app-menu-host--inline-row-big[_nghost-%COMP%]   .app-menu__button-row-item--open[_ngcontent-%COMP%], \n.app-menu-host--inline-row-big[_nghost-%COMP%]   .app-menu__button-row-item--labelled.app-menu__button-row-item--open[_ngcontent-%COMP%], \n.app-menu-host--inline-row-big[_nghost-%COMP%]   .app-menu__button-row-item--labelled.app-menu__button-row-item--active.app-menu__button-row-item--open[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  max-width: none;\n  height: auto;\n  min-height: 78px;\n  border: 1px solid var(--app-menu-border);\n  border-radius: 16px;\n  padding: 0.64rem 0.72rem;\n  background: var(--app-menu-bg);\n  color: var(--app-menu-fg);\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: start;\n  justify-content: stretch;\n  gap: 0.42rem;\n  text-align: left;\n  font-size: 0.76rem;\n  font-weight: 800;\n  box-shadow: 0 4px 12px var(--app-menu-shadow);\n}\n.app-menu-host--inline-row-big[_nghost-%COMP%]   .app-menu__button-row-item[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 20px;\n  height: 20px;\n  font-size: 20px;\n  line-height: 20px;\n  color: var(--app-menu-icon);\n}\n.app-menu-host--inline-row-big[_nghost-%COMP%]   .app-menu__button-row-copy[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.28rem;\n}\n.app-menu-host--inline-row-big[_nghost-%COMP%]   .app-menu__button-row-label[_ngcontent-%COMP%] {\n  color: var(--app-menu-fg);\n  font-size: 1.02rem;\n  font-weight: 900;\n  line-height: 1.08;\n}\n.app-menu-host--inline-row-big[_nghost-%COMP%]   .app-menu__button-row-detail[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  color: rgba(34, 53, 80, 0.86);\n  font-size: 0.74rem;\n  font-weight: 650;\n  line-height: 1.28;\n}\n.app-menu-host--inline-row-big[_nghost-%COMP%]   .app-menu__button-row-detail[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:first-child {\n  min-width: 0;\n  overflow: hidden;\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n  line-clamp: 2;\n  white-space: normal;\n}\n.app-menu-host--inline-row-big[_nghost-%COMP%]   .app-menu__button-row-trailing[_ngcontent-%COMP%] {\n  min-width: 22px;\n  align-self: start;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  margin-top: 1.18rem;\n}\n.app-menu-host--inline-row-big[_nghost-%COMP%]   .app-menu__button-row-caret[_ngcontent-%COMP%] {\n  width: 20px;\n  height: 20px;\n  font-size: 20px;\n  line-height: 20px;\n  align-self: center;\n  color: var(--app-menu-icon);\n}\n.app-menu-host--inline-row-big[_nghost-%COMP%]   .app-menu__button-row-item--open[_ngcontent-%COMP%]   .app-menu__button-row-caret[_ngcontent-%COMP%] {\n  transform: rotate(0deg);\n}\n.app-menu-host--inline-row-big[_nghost-%COMP%]   .app-menu__counter--value-corner[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -0.34rem;\n  right: -0.28rem;\n  min-width: 22px;\n  height: 22px;\n  padding: 0 5px;\n  font-size: 0.72rem;\n}\n.app-menu-host--inline-row-big[_nghost-%COMP%]   .app-menu__button-row-item--labelled[_ngcontent-%COMP%]   .app-menu__counter--trigger[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -0.34rem;\n  right: -0.28rem;\n  background:\n    linear-gradient(\n      180deg,\n      #e24955 0%,\n      #c93240 100%);\n  color: #fff;\n  box-shadow: 0 5px 10px rgba(163, 36, 48, 0.24);\n}\n.app-menu-host--inline-row-big[_nghost-%COMP%]   .app-menu__button-row-item[_ngcontent-%COMP%]:not(:disabled):hover, \n.app-menu-host--inline-row-big[_nghost-%COMP%]   .app-menu__button-row-item--labelled[_ngcontent-%COMP%]:not(:disabled):hover, \n.app-menu-host--inline-row-big[_nghost-%COMP%]   .app-menu__button-row-item--active[_ngcontent-%COMP%]:not(:disabled):hover {\n  background: var(--app-menu-bg-hover);\n  color: var(--app-menu-fg);\n  box-shadow: 0 8px 18px var(--app-menu-shadow);\n  transform: translateY(-1px);\n}\n.app-menu-host--inline-row-big[_nghost-%COMP%]   .app-menu__button-row-item[_ngcontent-%COMP%]:not(:disabled):active {\n  transform: scale(0.99);\n}\n.app-menu__button-row-item[_ngcontent-%COMP%]:disabled {\n  cursor: default;\n  opacity: 0.52;\n  box-shadow: none;\n  transform: none;\n  pointer-events: none;\n}\n.app-menu__button-row-item--progress[_ngcontent-%COMP%]:disabled {\n  opacity: 1;\n}\n.app-menu__button-row-item--progress-loading[_ngcontent-%COMP%], \n.app-menu__button-row-item--progress-loading[_ngcontent-%COMP%]:hover, \n.app-menu__button-row-item--progress-loading[_ngcontent-%COMP%]:disabled {\n  border-color: rgba(181, 117, 23, 0.76);\n  background:\n    linear-gradient(\n      180deg,\n      #ffe7bf 0%,\n      #ffd085 100%);\n  color: #8e4f0d;\n  cursor: wait;\n  box-shadow: none;\n  transform: none;\n  filter: none;\n}\n.app-menu__button-row-item--progress-error[_ngcontent-%COMP%], \n.app-menu__button-row-item--progress-error[_ngcontent-%COMP%]:hover, \n.app-menu__button-row-item--progress-error[_ngcontent-%COMP%]:disabled {\n  border-color: rgba(176, 31, 46, 0.82);\n  background:\n    linear-gradient(\n      180deg,\n      #f36a79 0%,\n      #d4374a 100%);\n  color: #fff;\n  box-shadow: none;\n  transform: none;\n  filter: none;\n}\n.app-menu__button-row-item--progress-success[_ngcontent-%COMP%], \n.app-menu__button-row-item--progress-success[_ngcontent-%COMP%]:hover, \n.app-menu__button-row-item--progress-success[_ngcontent-%COMP%]:disabled {\n  border-color: rgba(37, 127, 95, 0.28);\n  background: var(--app-menu-bg-strong);\n  color: #fff;\n}\n.app-menu__panel[_ngcontent-%COMP%] {\n  position: absolute;\n  top: calc(100% + var(--app-menu-panel-gap, 0.44rem));\n  right: 0;\n  z-index: 42;\n  display: grid;\n  gap: 0.38rem;\n  width: max-content;\n  min-width: 13rem;\n  max-width: min(21rem, 100vw - 1.2rem);\n  max-height: min(28rem, 100vh - 5.5rem, var(--app-menu-panel-available-height, 28rem));\n  overflow-x: hidden;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n  border: 1px solid rgba(36, 64, 98, 0.18);\n  border-radius: 12px;\n  padding: 0.42rem;\n  background: rgba(255, 255, 255, 0.98);\n  box-shadow: 0 18px 44px rgba(13, 29, 52, 0.22);\n  animation: _ngcontent-%COMP%_app-menu-panel-in 0.14s ease-out;\n}\n.app-menu__panel--align-start[_ngcontent-%COMP%] {\n  right: auto;\n  left: 0;\n}\n.app-menu__panel--open-up[_ngcontent-%COMP%] {\n  top: auto;\n  bottom: calc(100% + var(--app-menu-panel-gap, 0.44rem));\n  animation-name: _ngcontent-%COMP%_app-menu-panel-up-in;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%] {\n  top: calc(100% + var(--app-menu-panel-gap, 0.26rem));\n  gap: 0.16rem;\n  width: max-content;\n  min-width: 100%;\n  max-width: min(28rem, 100vw - 1.2rem);\n  max-height: min(28rem, 100vh - 5.5rem, var(--app-menu-panel-available-height, 28rem));\n  overflow-x: hidden;\n  overflow-y: auto;\n  border-radius: 14px;\n  padding: 0.35rem;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.99) 0%,\n      rgba(244, 249, 255, 0.99) 100%);\n  box-shadow: 0 10px 26px rgba(16, 32, 58, 0.2);\n}\n.app-menu__panel--fab[_ngcontent-%COMP%] {\n  min-width: min(15rem, 100vw - 1.2rem);\n  max-width: min(24rem, 100vw - 1.2rem);\n}\n.app-menu__panel--dropdown-list.app-menu__panel--open-up[_ngcontent-%COMP%] {\n  top: auto;\n  bottom: calc(100% + var(--app-menu-panel-gap, 0.26rem));\n  animation-name: _ngcontent-%COMP%_app-menu-panel-up-in;\n}\n.app-menu__panel--dock-to-host[_ngcontent-%COMP%], \n.app-menu__panel--dropdown-list.app-menu__panel--dock-to-host[_ngcontent-%COMP%] {\n  top: 0;\n  bottom: auto;\n}\n.app-menu__panel--dock-to-host.app-menu__panel--open-up[_ngcontent-%COMP%], \n.app-menu__panel--dropdown-list.app-menu__panel--dock-to-host.app-menu__panel--open-up[_ngcontent-%COMP%] {\n  top: auto;\n  bottom: 0;\n}\n.app-menu-host--kind-select.app-menu-host--trigger-field[_nghost-%COMP%]   .app-menu__panel--dropdown-list[_ngcontent-%COMP%] {\n  left: 0;\n  right: 0;\n  width: 100%;\n  min-width: 100%;\n  max-width: none;\n  border-radius: 8px;\n}\n.app-menu__panel--tabs[_ngcontent-%COMP%] {\n  width: min(30rem, 100vw - 1.2rem);\n  min-width: min(18rem, 100vw - 1.2rem);\n  max-width: min(30rem, 100vw - 1.2rem);\n  max-height: min(34rem, 100vh - 5.5rem, var(--app-menu-panel-available-height, 34rem));\n  gap: 0.48rem;\n  border-radius: 14px;\n  padding: 0.48rem;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.99) 0%,\n      rgba(245, 249, 255, 0.99) 100%);\n}\n.app-menu-host--model-layout-tabs.app-menu-host--trigger-field[_nghost-%COMP%]   .app-menu__panel--tabs[_ngcontent-%COMP%] {\n  left: 0;\n  right: 0;\n  width: 100%;\n  min-width: 100%;\n  max-width: none;\n}\n.app-menu-host--layout-grid[_nghost-%COMP%]   .app-menu__panel[_ngcontent-%COMP%], \n.app-menu-host--inline-panel[_nghost-%COMP%]   .app-menu__panel[_ngcontent-%COMP%] {\n  position: static;\n  width: 100%;\n  min-width: 0;\n  max-width: none;\n  max-height: none;\n  overflow: visible;\n  animation: none;\n}\n.app-menu-host--layout-grid[_nghost-%COMP%]   .app-menu__panel[_ngcontent-%COMP%] {\n  border: 0;\n  border-radius: 0;\n  padding: 0;\n  background: transparent;\n  box-shadow: none;\n}\n.app-menu-host--model-layout-tabs.app-menu-host--inline-panel[_nghost-%COMP%]   .app-menu__panel--tabs[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  max-width: none;\n  max-height: none;\n  border-radius: 12px;\n  box-shadow: none;\n}\n.app-menu-host--panel-bottom-docked[_nghost-%COMP%]   .app-menu__panel[_ngcontent-%COMP%], \n.app-menu-host--panel-bottom-docked[_nghost-%COMP%]   .app-menu__panel--dropdown-list[_ngcontent-%COMP%] {\n  position: static;\n  width: 100%;\n  min-width: 0;\n  max-width: none;\n  max-height: none;\n  overflow: visible;\n  border-radius: 12px 12px 0 0;\n  box-shadow: 0 -8px 22px rgba(13, 24, 40, 0.14);\n}\n.app-menu-host--layout-mobile[_nghost-%COMP%]   .app-menu__panel--dropdown-list[_ngcontent-%COMP%]:not(.app-menu__panel--open-up)   .app-menu__items[_ngcontent-%COMP%], \n.app-menu-host--layout-mobile[_nghost-%COMP%]   .app-menu__panel--dropdown-list[_ngcontent-%COMP%]:not(.app-menu__panel--open-up)   .app-menu__item-row[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  max-width: none;\n}\n.app-menu-host--layout-mobile[_nghost-%COMP%]   .app-menu__panel--dropdown-list[_ngcontent-%COMP%]:not(.app-menu__panel--open-up)   .app-menu__item[_ngcontent-%COMP%], \n.app-menu-host--layout-mobile[_nghost-%COMP%]   .app-menu__panel--dropdown-list[_ngcontent-%COMP%]:not(.app-menu__panel--open-up)   .app-menu__branch-back[_ngcontent-%COMP%], \n.app-menu-host--layout-mobile[_nghost-%COMP%]   .app-menu__panel--dropdown-list[_ngcontent-%COMP%]:not(.app-menu__panel--open-up)   .app-menu__branch-action[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  max-width: none;\n}\n.app-menu__title[_ngcontent-%COMP%] {\n  padding: 0.34rem 0.42rem 0.18rem;\n  color: rgba(25, 45, 70, 0.7);\n  font-size: 0.74rem;\n  font-weight: 900;\n  text-transform: uppercase;\n}\n.app-menu__items[_ngcontent-%COMP%], \n.app-menu__groups[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.22rem;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__items[_ngcontent-%COMP%] {\n  gap: 0.16rem;\n  width: max-content;\n  min-width: 100%;\n  max-width: min(28rem, 100vw - 1.2rem);\n}\n.app-menu__rate-item[_ngcontent-%COMP%] {\n  display: block;\n  min-width: 0;\n  padding: 0.1rem;\n}\n.app-menu__rate-item--disabled[_ngcontent-%COMP%] {\n  opacity: 0.64;\n  pointer-events: none;\n}\n.app-menu__groups[_ngcontent-%COMP%] {\n  gap: 0.64rem;\n}\n.app-menu__group[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.52rem;\n  min-width: 0;\n}\n.app-menu__group-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.52rem;\n  min-width: 0;\n}\n.app-menu__group-badge[_ngcontent-%COMP%] {\n  min-height: 30px;\n  border-radius: 999px;\n  padding: 0.18rem 0.84rem;\n  border: 1px solid var(--app-menu-border);\n  background: var(--app-menu-bg);\n  color: var(--app-menu-fg);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.28rem;\n  font-size: 0.72rem;\n  font-weight: 900;\n  letter-spacing: 0;\n  text-transform: uppercase;\n  white-space: nowrap;\n}\n.app-menu__group-badge[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n  line-height: 15px;\n  color: var(--app-menu-icon);\n}\n.app-menu__group-line[_ngcontent-%COMP%] {\n  height: 1px;\n  flex: 1;\n  min-width: 1.5rem;\n  background: var(--app-menu-line);\n}\n.app-menu__tabs[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.48rem;\n  min-width: 0;\n}\n.app-menu__tabs-head[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 3;\n  display: flex;\n  align-items: flex-start;\n  gap: 0.42rem;\n  min-width: 0;\n}\n.app-menu__tabs-head[_ngcontent-%COMP%]   .app-menu__tabs-filter[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n}\n.app-menu__tabs-tabs[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.28rem;\n  min-width: 0;\n  max-width: 100%;\n  overflow-x: auto;\n  overflow-y: hidden;\n  scrollbar-width: thin;\n  padding: 0.42rem 0.46rem 0.34rem 0.02rem;\n  margin: -0.4rem -0.44rem -0.16rem 0;\n}\n.app-menu__tabs-filter[_ngcontent-%COMP%] {\n  min-width: 0;\n  min-height: 34px;\n  display: flex;\n  align-items: center;\n  gap: 0.34rem;\n  border: 1px solid var(--app-menu-border);\n  border-radius: 8px;\n  padding: 0 0.42rem;\n  background: var(--app-menu-bg);\n  color: var(--app-menu-fg);\n}\n.app-menu__tabs-filter[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n  color: var(--app-menu-icon);\n}\n.app-menu__tabs-filter-input[_ngcontent-%COMP%] {\n  min-width: 0;\n  flex: 1 1 auto;\n  border: 0;\n  outline: 0;\n  padding: 0.36rem 0;\n  background: transparent;\n  color: inherit;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 800;\n}\n.app-menu__tabs-filter-input[_ngcontent-%COMP%]::placeholder {\n  color: var(--app-menu-muted-text);\n}\n.app-menu__tabs-filter-clear[_ngcontent-%COMP%] {\n  appearance: none;\n  -webkit-appearance: none;\n  flex: 0 0 auto;\n  width: 24px;\n  height: 24px;\n  border: 0;\n  border-radius: 8px;\n  padding: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  background: transparent;\n  color: var(--app-menu-icon);\n  cursor: pointer;\n}\n.app-menu__tabs-filter-clear[_ngcontent-%COMP%]:hover {\n  background: var(--app-menu-bg-hover);\n}\n.app-menu__tabs-filter-clear[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n  line-height: 15px;\n}\n.app-menu__tabs-tab[_ngcontent-%COMP%] {\n  appearance: none;\n  -webkit-appearance: none;\n  position: relative;\n  flex: 0 0 auto;\n  min-width: 0;\n  min-height: 34px;\n  border: 1px solid var(--app-menu-border);\n  border-radius: 999px;\n  padding: 0.3rem 0.64rem;\n  background: var(--app-menu-bg);\n  color: var(--app-menu-fg);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.28rem;\n  font: inherit;\n  font-size: 0.74rem;\n  font-weight: 900;\n  letter-spacing: 0;\n  cursor: pointer;\n  white-space: nowrap;\n  transition:\n    background 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    transform 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.app-menu__tabs-tab[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: var(--app-menu-icon);\n}\n.app-menu__tabs-tab[_ngcontent-%COMP%]:not(:disabled):hover {\n  background: var(--app-menu-bg-hover);\n  color: var(--app-menu-fg);\n  transform: translateY(-1px);\n  box-shadow: 0 3px 10px var(--app-menu-shadow);\n}\n.app-menu__tabs-tab--active[_ngcontent-%COMP%], \n.app-menu__tabs-tab--active[_ngcontent-%COMP%]:not(:disabled):hover {\n  border-color: transparent;\n  background: var(--app-menu-bg-strong);\n  color: #fff;\n  transform: translateY(-1px);\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5), 0 3px 10px var(--app-menu-shadow);\n}\n.app-menu__tabs-tab--active[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: currentColor;\n}\n.app-menu__counter--tabs-tab[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -0.38rem;\n  right: -0.34rem;\n  min-width: 1.18rem;\n  height: 1.18rem;\n  font-size: 0.64rem;\n  box-shadow: 0 0 0 2px #fff, 0 5px 10px rgba(163, 36, 48, 0.24);\n}\n.app-menu__tabs-panel[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.app-menu__tabs-items[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: stretch;\n  gap: var(--app-menu-tabs-items-gap);\n  min-width: 0;\n}\n.app-menu__tabs-items--fixed-columns[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(var(--app-menu-tabs-columns), minmax(0, 1fr));\n}\n.app-menu__tabs-items--icon-list[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(var(--app-menu-icon-list-item-size), 1fr));\n  gap: 0.28rem;\n}\n.app-menu__tabs-item[_ngcontent-%COMP%] {\n  appearance: none;\n  -webkit-appearance: none;\n  flex: 1 1 var(--app-menu-tabs-item-flex-basis);\n  min-width: min(var(--app-menu-tabs-item-min-width), 100%);\n  min-height: var(--app-menu-tabs-item-min-height);\n  border: 1px solid var(--app-menu-border);\n  border-radius: 9px;\n  padding: var(--app-menu-tabs-item-padding);\n  background: var(--app-menu-bg);\n  color: var(--app-menu-fg);\n  display: flex;\n  align-items: center;\n  gap: 0.34rem;\n  font: inherit;\n  font-size: var(--app-menu-tabs-item-font-size);\n  font-weight: 800;\n  text-align: left;\n  cursor: pointer;\n  transition:\n    background 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    transform 0.14s ease,\n    box-shadow 0.14s ease,\n    filter 0.14s ease;\n}\n.app-menu__tabs-items--fixed-columns[_ngcontent-%COMP%]   .app-menu__tabs-item[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n}\n.app-menu__tabs-item--layout-icon[_ngcontent-%COMP%] {\n  flex: 0 0 var(--app-menu-icon-list-item-size);\n  width: 100%;\n  min-width: 0;\n  min-height: var(--app-menu-icon-list-item-size);\n  height: var(--app-menu-icon-list-item-size);\n  justify-content: center;\n  padding: 0;\n  text-align: center;\n}\n.app-menu-host--layout-mobile[_nghost-%COMP%]   .app-menu__tabs-items--fixed-columns[_ngcontent-%COMP%] {\n  display: flex;\n}\n.app-menu-host--layout-mobile[_nghost-%COMP%]   .app-menu__tabs-items--fixed-columns[_ngcontent-%COMP%]   .app-menu__tabs-item[_ngcontent-%COMP%] {\n  min-width: min(var(--app-menu-tabs-item-min-width), 100%);\n}\n.app-menu__tabs-item[_ngcontent-%COMP%]:not(:disabled):not(.app-menu__tabs-item--disabled):hover, \n.app-menu__tabs-item--active[_ngcontent-%COMP%] {\n  background: var(--app-menu-bg-hover);\n  color: var(--app-menu-fg);\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px var(--app-menu-shadow);\n}\n.app-menu__tabs-item--active[_ngcontent-%COMP%] {\n  border-color: var(--app-menu-border);\n  background: var(--app-menu-bg-strong);\n  color: #fff;\n  filter: none;\n  box-shadow: 0 6px 14px var(--app-menu-shadow);\n}\n.app-menu__tabs-item--active[_ngcontent-%COMP%]:not(:disabled):not(.app-menu__tabs-item--disabled):hover {\n  background: var(--app-menu-bg-strong);\n  color: #fff;\n  filter: none;\n}\n.app-menu__tabs-items--icon-list[_ngcontent-%COMP%]   .app-menu__tabs-item--layout-icon[_ngcontent-%COMP%] {\n  border-color: transparent;\n  background: transparent;\n  color: var(--app-menu-icon);\n  box-shadow: none;\n  filter: none;\n  transform: none;\n}\n.app-menu__tabs-items--icon-list[_ngcontent-%COMP%]   .app-menu__tabs-item--layout-icon[_ngcontent-%COMP%]:not(:disabled):not(.app-menu__tabs-item--disabled):hover {\n  border-color: transparent;\n  background: transparent;\n  color: var(--app-menu-icon);\n  box-shadow: none;\n  filter: none;\n  transform: none;\n}\n.app-menu__tabs-items--icon-list[_ngcontent-%COMP%]   .app-menu__tabs-item--layout-icon.app-menu__tabs-item--active[_ngcontent-%COMP%] {\n  border-color: transparent;\n  background: var(--app-menu-bg-strong);\n  color: #fff;\n  box-shadow: none;\n  filter: none;\n  transform: none;\n}\n.app-menu__tabs-items--icon-list[_ngcontent-%COMP%]   .app-menu__tabs-item--layout-icon.app-menu__tabs-item--active[_ngcontent-%COMP%]:not(:disabled):not(.app-menu__tabs-item--disabled):hover {\n  background: var(--app-menu-bg-strong);\n  color: #fff;\n}\n.app-menu__tabs-item--active[_ngcontent-%COMP%]   .app-menu__tabs-item-icon[_ngcontent-%COMP%], \n.app-menu__tabs-item--active[_ngcontent-%COMP%]   .app-menu__tabs-item-description[_ngcontent-%COMP%] {\n  color: currentColor;\n}\n.app-menu__tabs-toggle[_ngcontent-%COMP%] {\n  flex: 0 0 30px;\n  width: 30px;\n  height: 18px;\n  border: 1px solid rgba(56, 90, 132, 0.22);\n  border-radius: 999px;\n  background: rgba(75, 103, 138, 0.12);\n  display: inline-flex;\n  align-items: center;\n  padding: 2px;\n  transition: background 0.14s ease, border-color 0.14s ease;\n}\n.app-menu__tabs-toggle[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  border-radius: 999px;\n  background: #fff;\n  box-shadow: 0 1px 3px rgba(18, 34, 56, 0.2);\n  transform: translateX(0);\n  transition: transform 0.14s ease;\n}\n.app-menu__tabs-toggle--active[_ngcontent-%COMP%], \n.app-menu__tabs-item--active[_ngcontent-%COMP%]   .app-menu__tabs-toggle[_ngcontent-%COMP%] {\n  border-color: var(--app-menu-border);\n  background: var(--app-menu-bg-strong);\n}\n.app-menu__tabs-item--active[_ngcontent-%COMP%]   .app-menu__tabs-toggle[_ngcontent-%COMP%] {\n  border-color: rgba(255, 255, 255, 0.68);\n  background: rgba(255, 255, 255, 0.32);\n}\n.app-menu__tabs-toggle--active[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.app-menu__tabs-item--active[_ngcontent-%COMP%]   .app-menu__tabs-toggle[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  transform: translateX(12px);\n}\n.app-menu__tabs-item[_ngcontent-%COMP%]:disabled, \n.app-menu__tabs-item--disabled[_ngcontent-%COMP%] {\n  cursor: default;\n  opacity: 0.56;\n  transform: none;\n  box-shadow: none;\n}\n.app-menu__tabs-item--with-description[_ngcontent-%COMP%] {\n  align-items: flex-start;\n  min-height: 50px;\n}\n.app-menu__tabs-item-icon[_ngcontent-%COMP%], \n.app-menu__tabs-item-check[_ngcontent-%COMP%] {\n  flex: 0 0 18px;\n  min-width: 18px;\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  color: var(--app-menu-icon);\n}\n.app-menu__tabs-item--layout-icon[_ngcontent-%COMP%]   .app-menu__tabs-item-icon[_ngcontent-%COMP%] {\n  flex-basis: auto;\n  min-width: 0;\n  width: 1.35rem;\n  height: 1.35rem;\n  font-size: 1.35rem;\n  line-height: 1.35rem;\n  color: currentColor;\n}\n.app-menu__tabs-item-icon--text[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-family:\n    "Apple Color Emoji",\n    "Segoe UI Emoji",\n    "Noto Color Emoji",\n    sans-serif;\n  font-size: var(--app-menu-icon-list-font-size);\n  line-height: 1;\n}\n.app-menu__tabs-item-check[_ngcontent-%COMP%] {\n  color: var(--app-menu-fg);\n}\n.app-menu__tabs-item-main[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  min-width: 0;\n  overflow: hidden;\n  display: grid;\n  gap: 0.08rem;\n}\n.app-menu__tabs-item-label[_ngcontent-%COMP%], \n.app-menu__tabs-item-description[_ngcontent-%COMP%] {\n  display: block;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.app-menu__tabs-item-label[_ngcontent-%COMP%] {\n  white-space: nowrap;\n}\n.app-menu__tabs-filter-match[_ngcontent-%COMP%] {\n  font-weight: 1000;\n}\n.app-menu__tabs-item-description[_ngcontent-%COMP%] {\n  color: var(--app-menu-muted-text);\n  font-size: 0.7rem;\n  font-weight: 700;\n  line-height: 1.2;\n  overflow-wrap: anywhere;\n}\n.app-menu__tabs-divider[_ngcontent-%COMP%], \n.app-menu__tabs-section[_ngcontent-%COMP%] {\n  flex: 1 0 100%;\n}\n.app-menu__tabs-section[_ngcontent-%COMP%] {\n  min-height: 28px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n}\n.app-menu__tabs-section[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n  line-height: 15px;\n  color: var(--app-menu-icon);\n}\n.app-menu__tabs-empty[_ngcontent-%COMP%] {\n  flex: 1 0 100%;\n  min-height: 34px;\n  display: flex;\n  align-items: center;\n  padding: 0.35rem 0.46rem;\n  color: var(--app-menu-muted-text);\n  font-size: 0.74rem;\n  font-weight: 800;\n}\n.app-menu__tile-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(var(--app-menu-grid-columns), minmax(0, 1fr));\n  align-items: stretch;\n  gap: var(--app-menu-grid-gap);\n  width: 100%;\n}\n.app-menu__item[_ngcontent-%COMP%], \n.app-menu__tile-item[_ngcontent-%COMP%] {\n  appearance: none;\n  -webkit-appearance: none;\n  position: relative;\n  border: 1px solid var(--app-menu-border);\n  background: var(--app-menu-bg);\n  color: var(--app-menu-fg);\n  font: inherit;\n  cursor: pointer;\n  transition:\n    background 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    filter 0.14s ease,\n    transform 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.app-menu__item[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto auto auto;\n  gap: 0.42rem;\n  align-items: center;\n  width: 100%;\n  min-width: 0;\n  min-height: 2.42rem;\n  border-color: transparent;\n  border-radius: 9px;\n  padding: 0.42rem 0.52rem;\n  text-align: left;\n}\na.app-menu__item[_ngcontent-%COMP%] {\n  text-decoration: none;\n}\n.app-menu__item-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: stretch;\n  gap: 0.22rem;\n  width: 100%;\n  min-width: 0;\n}\n.app-menu__item-row[_ngcontent-%COMP%]   .app-menu__item[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  min-width: 0;\n}\n.app-menu__item-remove[_ngcontent-%COMP%] {\n  appearance: none;\n  -webkit-appearance: none;\n  flex: 0 0 34px;\n  min-width: 34px;\n  min-height: 2.42rem;\n  border: 1px solid var(--app-menu-border);\n  border-radius: 9px;\n  padding: 0;\n  background: var(--app-menu-bg);\n  color: var(--app-menu-icon);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font: inherit;\n  cursor: pointer;\n  transition:\n    background 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    filter 0.14s ease,\n    transform 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.app-menu__item-remove[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.app-menu__item-remove[_ngcontent-%COMP%]:not(:disabled):hover {\n  background: var(--app-menu-bg-hover);\n  color: var(--app-menu-fg);\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px var(--app-menu-shadow);\n}\n.app-menu__item-remove[_ngcontent-%COMP%]:disabled {\n  cursor: default;\n  opacity: 0.56;\n  transform: none;\n  box-shadow: none;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item[_ngcontent-%COMP%], \n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__branch-back[_ngcontent-%COMP%], \n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__branch-action[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  max-width: min(28rem, 100vw - 1.9rem);\n  min-height: 36px;\n  border: 0;\n  border-radius: 10px;\n  background: transparent;\n  box-shadow: none;\n  color: rgba(24, 42, 66, 0.92);\n  font-size: 0.78rem;\n  font-weight: 700;\n  gap: 0.45rem;\n  padding: 0.46rem 0.54rem;\n  white-space: nowrap;\n  transition:\n    transform 0.16s cubic-bezier(0.22, 0.61, 0.36, 1),\n    filter 0.16s cubic-bezier(0.22, 0.61, 0.36, 1),\n    background-color 0.16s cubic-bezier(0.22, 0.61, 0.36, 1),\n    color 0.16s cubic-bezier(0.22, 0.61, 0.36, 1);\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item[_ngcontent-%COMP%] {\n  width: max-content;\n  min-width: 100%;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item-remove[_ngcontent-%COMP%] {\n  min-height: 36px;\n  border: 0;\n  border-radius: 10px;\n  background: transparent;\n  box-shadow: none;\n  color: rgba(24, 42, 66, 0.62);\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item-remove[_ngcontent-%COMP%]:not(:disabled):hover {\n  background: rgba(212, 226, 247, 0.45);\n  box-shadow: none;\n  color: rgba(24, 42, 66, 0.92);\n  filter: brightness(1.02);\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item[_ngcontent-%COMP%]:not(:disabled):not(.app-menu__item--disabled):hover, \n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item--active[_ngcontent-%COMP%], \n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__branch-back[_ngcontent-%COMP%]:hover, \n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__branch-action[_ngcontent-%COMP%]:hover {\n  background: rgba(212, 226, 247, 0.45);\n  box-shadow: none;\n  filter: brightness(1.02);\n  transform: translateY(-1px);\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item--active[_ngcontent-%COMP%] {\n  border: 1px solid var(--app-menu-border);\n  background: var(--app-menu-bg);\n  color: var(--app-menu-fg);\n  transform: none;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item--active[_ngcontent-%COMP%]:not(:disabled):not(.app-menu__item--disabled):hover {\n  background: var(--app-menu-bg-hover);\n  color: var(--app-menu-fg);\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item--surface-tinted[_ngcontent-%COMP%] {\n  border: 1px solid var(--app-menu-border);\n  background: var(--app-menu-bg);\n  color: var(--app-menu-fg);\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item--surface-tinted[_ngcontent-%COMP%]:not(:disabled):not(.app-menu__item--disabled):hover, \n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item--surface-tinted.app-menu__item--active[_ngcontent-%COMP%] {\n  background: var(--app-menu-bg-hover);\n  color: var(--app-menu-fg);\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.42);\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item[_ngcontent-%COMP%]:not(:disabled):not(.app-menu__item--disabled):active, \n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__branch-back[_ngcontent-%COMP%]:active, \n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__branch-action[_ngcontent-%COMP%]:active {\n  transform: scale(0.98);\n  filter: brightness(0.96);\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item--disabled[_ngcontent-%COMP%] {\n  opacity: 0.52;\n  pointer-events: none;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item--with-description[_ngcontent-%COMP%] {\n  min-height: 48px;\n  align-items: flex-start;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item--with-description[_ngcontent-%COMP%]   .app-menu__item-icon[_ngcontent-%COMP%] {\n  margin-top: 0.08rem;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item--layout-pill[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  width: max-content;\n  min-width: min(220px, 100vw - 1.2rem);\n  min-height: 40px;\n  align-items: center;\n  column-gap: 0.38rem;\n  row-gap: 0;\n  border: 1px solid var(--app-menu-border);\n  border-radius: 10px;\n  padding: 0.36rem 0.42rem;\n  background: var(--app-menu-bg);\n  color: var(--app-menu-fg);\n  box-shadow: none;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item--layout-pill[_ngcontent-%COMP%]:not(:disabled):not(.app-menu__item--disabled):hover, \n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item--layout-pill.app-menu__item--active[_ngcontent-%COMP%] {\n  background: var(--app-menu-bg-hover);\n  color: var(--app-menu-fg);\n  filter: none;\n  transform: translateY(-1px);\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item--layout-pill[_ngcontent-%COMP%]   .app-menu__item-icon[_ngcontent-%COMP%] {\n  width: 20px;\n  height: 20px;\n  margin-top: 0;\n  font-size: 20px;\n  line-height: 20px;\n  color: var(--app-menu-icon);\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item.app-menu__palette--danger[_ngcontent-%COMP%], \n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item.app-menu__palette--red[_ngcontent-%COMP%] {\n  color: #aa2e2e;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.16rem;\n  min-width: min(15.5rem, 100vw - 1.2rem);\n  border: 1px solid var(--app-menu-border);\n  border-radius: 12px;\n  padding: 0.2rem;\n  background: var(--app-menu-bg);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.64), 0 6px 18px var(--app-menu-shadow);\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item-row[_ngcontent-%COMP%]   .app-menu__item[_ngcontent-%COMP%] {\n  min-width: 0;\n  min-height: 38px;\n  border: 0;\n  border-radius: 9px;\n  padding: 0.34rem 0.32rem;\n  background: transparent;\n  box-shadow: none;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item-row[_ngcontent-%COMP%]   .app-menu__item--surface-tinted[_ngcontent-%COMP%], \n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item-row[_ngcontent-%COMP%]   .app-menu__item--layout-pill[_ngcontent-%COMP%] {\n  border: 0;\n  background: transparent;\n  box-shadow: none;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item-row[_ngcontent-%COMP%]   .app-menu__item[_ngcontent-%COMP%]:not(:disabled):not(.app-menu__item--disabled):hover {\n  background: rgba(255, 255, 255, 0.42);\n  box-shadow: none;\n  filter: none;\n  transform: none;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item-row[_ngcontent-%COMP%]   .app-menu__item-remove[_ngcontent-%COMP%] {\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  min-height: 30px;\n  border: 1px solid rgba(47, 86, 139, 0.18);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.72);\n  color: var(--app-menu-icon);\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item-row[_ngcontent-%COMP%]   .app-menu__item-remove[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item-row[_ngcontent-%COMP%]   .app-menu__item-remove[_ngcontent-%COMP%]:not(:disabled):hover {\n  border-color: rgba(176, 31, 46, 0.26);\n  background: rgba(255, 241, 242, 0.94);\n  color: #a43c45;\n  box-shadow: 0 4px 10px rgba(163, 36, 48, 0.14);\n  filter: none;\n  transform: translateY(-1px);\n}\n.app-menu__branch-header[_ngcontent-%COMP%] {\n  min-height: 36px;\n  display: grid;\n  grid-template-columns: 30px minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.32rem;\n  padding: 0 0.18rem 0.22rem;\n  color: #25476e;\n  font-size: 0.76rem;\n  font-weight: 950;\n}\n.app-menu__branch-back[_ngcontent-%COMP%], \n.app-menu__branch-action[_ngcontent-%COMP%] {\n  appearance: none;\n  -webkit-appearance: none;\n  border: 0;\n  cursor: pointer;\n  font: inherit;\n  text-align: left;\n}\n.app-menu__branch-title[_ngcontent-%COMP%] {\n  min-width: 0;\n  overflow-wrap: anywhere;\n  line-height: 1.2;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__branch-back[_ngcontent-%COMP%] {\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  min-height: 30px;\n  border: 1px solid rgba(47, 86, 139, 0.18);\n  border-radius: 50%;\n  padding: 0;\n  justify-content: center;\n}\n.app-menu__branch-action[_ngcontent-%COMP%] {\n  justify-content: center;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__branch-action--icon-only[_ngcontent-%COMP%] {\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  min-height: 30px;\n  border: 1px solid rgba(47, 86, 139, 0.18);\n  border-radius: 50%;\n  padding: 0;\n}\n.app-menu__branch-action[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  min-width: 0;\n  overflow-wrap: anywhere;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__branch-action.app-menu__palette--success[_ngcontent-%COMP%], \n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__branch-action.app-menu__palette--green[_ngcontent-%COMP%] {\n  border: 1px solid rgba(40, 117, 78, 0.28);\n  background: #eefbf4;\n  color: #1f7649;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__branch-action.app-menu__palette--success[_ngcontent-%COMP%]:hover, \n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__branch-action.app-menu__palette--green[_ngcontent-%COMP%]:hover, \n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__branch-action.app-menu__palette--success[_ngcontent-%COMP%]:active, \n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__branch-action.app-menu__palette--green[_ngcontent-%COMP%]:active {\n  background: #eefbf4;\n  color: #1f7649;\n  filter: none;\n  transform: none;\n}\n.app-menu__branch-back[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.app-menu__branch-action[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 1.08rem;\n  height: 1.08rem;\n  font-size: 1.08rem;\n  line-height: 1.08rem;\n  color: var(--app-menu-icon);\n}\n.app-menu__tile-item[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  width: 100%;\n  min-width: 0;\n  min-height: 0;\n  height: var(--app-menu-tile-height);\n  border-radius: 12px;\n  display: inline-flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 0.18rem;\n  padding: 0.4rem 0.35rem 0.32rem;\n  overflow: visible;\n  text-align: center;\n}\n.app-menu__item[_ngcontent-%COMP%]:hover, \n.app-menu__tile-item[_ngcontent-%COMP%]:hover {\n  background: var(--app-menu-bg-hover);\n  box-shadow: 0 3px 10px rgba(16, 29, 48, 0.12);\n  filter: brightness(1.02);\n}\n.app-menu__item[_ngcontent-%COMP%]:active, \n.app-menu__tile-item[_ngcontent-%COMP%]:active {\n  transform: translateY(1px);\n  filter: brightness(0.98);\n}\n.app-menu__item[_ngcontent-%COMP%]:disabled, \n.app-menu__tile-item[_ngcontent-%COMP%]:disabled {\n  cursor: default;\n  opacity: 0.55;\n  filter: grayscale(0.18);\n  box-shadow: none;\n  transform: none;\n}\n.app-menu__item--active[_ngcontent-%COMP%], \n.app-menu__tile-item--active[_ngcontent-%COMP%] {\n  box-shadow: inset 0 0 0 1px var(--app-menu-border);\n}\n.app-menu__item-icon[_ngcontent-%COMP%], \n.app-menu__item-check[_ngcontent-%COMP%], \n.app-menu__item-branch[_ngcontent-%COMP%], \n.app-menu__tile-icon[_ngcontent-%COMP%] {\n  width: 1.12rem;\n  height: 1.12rem;\n  font-size: 1.12rem;\n  line-height: 1.12rem;\n}\n.app-menu__item-icon[_ngcontent-%COMP%], \n.app-menu__tile-icon[_ngcontent-%COMP%] {\n  color: var(--app-menu-icon);\n}\n.app-menu__item-image[_ngcontent-%COMP%] {\n  width: 2.55rem;\n  height: 1.42rem;\n  padding: 0.12rem;\n  font-size: 0.72rem;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item--with-description[_ngcontent-%COMP%]   .app-menu__item-image[_ngcontent-%COMP%] {\n  margin-top: 0.04rem;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item-icon[_ngcontent-%COMP%], \n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item-branch[_ngcontent-%COMP%], \n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item-check[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n  color: var(--app-menu-icon);\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item.app-menu__palette--danger[_ngcontent-%COMP%]   .app-menu__item-icon[_ngcontent-%COMP%], \n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item.app-menu__palette--red[_ngcontent-%COMP%]   .app-menu__item-icon[_ngcontent-%COMP%] {\n  color: #cf4747;\n}\n.app-menu__item-main[_ngcontent-%COMP%] {\n  display: grid;\n  min-width: 0;\n  gap: 0.08rem;\n}\n.app-menu__item-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.34rem;\n  width: 100%;\n  min-width: 0;\n}\n.app-menu__item-header[_ngcontent-%COMP%]    > .app-menu__counter[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  margin-left: auto;\n}\n.app-menu__item-header[_ngcontent-%COMP%]    > .app-menu__counter--header-badge[_ngcontent-%COMP%] {\n  margin-left: auto;\n  background: rgba(255, 255, 255, 0.72);\n  color: var(--app-menu-fg);\n}\n.app-menu__item-header[_ngcontent-%COMP%]    > .app-menu__counter--header-badge[_ngcontent-%COMP%]    + .app-menu__counter[_ngcontent-%COMP%] {\n  margin-left: 0;\n}\n.app-menu__item-body[_ngcontent-%COMP%] {\n  display: grid;\n  justify-items: start;\n  min-width: 0;\n  gap: 0.08rem;\n}\n.app-menu__item-label[_ngcontent-%COMP%], \n.app-menu__tile-label[_ngcontent-%COMP%] {\n  min-width: 0;\n  color: inherit;\n  font-weight: 850;\n}\n.app-menu__item-label[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n  font-size: 0.8rem;\n  line-height: 1.2;\n}\n.app-menu__item-header[_ngcontent-%COMP%]    > .app-menu__item-label[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item-main[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item-label[_ngcontent-%COMP%] {\n  overflow: hidden;\n  overflow-wrap: normal;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  word-break: keep-all;\n  font-weight: 700;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item-description[_ngcontent-%COMP%] {\n  color: rgba(42, 66, 96, 0.68);\n  font-size: 0.67rem;\n  font-weight: 800;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item--layout-pill[_ngcontent-%COMP%]   .app-menu__item-main[_ngcontent-%COMP%] {\n  gap: 0.08rem;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item--layout-pill[_ngcontent-%COMP%]   .app-menu__item-label[_ngcontent-%COMP%] {\n  font-size: 0.72rem;\n  font-weight: 850;\n  line-height: 1;\n  text-decoration: underline;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item--layout-pill[_ngcontent-%COMP%]   .app-menu__item-description[_ngcontent-%COMP%] {\n  color: currentColor;\n  font-size: 0.64rem;\n  font-weight: 800;\n  line-height: 1.1;\n}\n.app-menu__tile-label[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  overflow-wrap: var(--app-menu-tile-label-overflow-wrap);\n  font-size: 0.68rem;\n  line-height: 1.08;\n  white-space: var(--app-menu-tile-label-white-space);\n}\n.app-menu__item-description[_ngcontent-%COMP%], \n.app-menu__tile-description[_ngcontent-%COMP%] {\n  min-width: 0;\n  overflow-wrap: anywhere;\n  color: var(--app-menu-muted-text);\n  font-weight: 700;\n  line-height: 1.2;\n}\n.app-menu__item-description[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n  white-space: pre-line;\n}\n.app-menu__tile-description[_ngcontent-%COMP%] {\n  font-size: 0.62rem;\n}\n.app-menu__item-detail[_ngcontent-%COMP%] {\n  color: rgba(32, 53, 82, 0.68);\n  font-size: 0.72rem;\n  font-weight: 800;\n  white-space: nowrap;\n}\n.app-menu__item-detail--badge[_ngcontent-%COMP%] {\n  justify-self: start;\n  width: fit-content;\n  max-width: 100%;\n  border: 1px solid transparent;\n  border-radius: 999px;\n  padding: 0.12rem 0.42rem;\n  background: var(--app-menu-bg-strong);\n  color: #fff;\n  font-size: 0.62rem;\n  line-height: 1.1;\n  white-space: normal;\n  box-shadow: 0 3px 9px var(--app-menu-shadow);\n}\n.app-menu__item-check[_ngcontent-%COMP%] {\n  color: #2f7b51;\n}\n.app-menu__item-branch[_ngcontent-%COMP%] {\n  color: rgba(32, 53, 82, 0.55);\n}\n.app-menu__tile-item--segmented[_ngcontent-%COMP%] {\n  padding: 0;\n  border-color: var(--app-menu-border);\n  background: rgba(255, 255, 255, 0.72);\n  overflow: visible;\n}\n.app-menu__segments[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));\n  width: 100%;\n  height: 100%;\n  min-width: 0;\n  overflow: hidden;\n  border-radius: inherit;\n  pointer-events: none;\n}\n.app-menu__segment[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.42rem;\n  padding: 0 0.54rem;\n  background: var(--app-menu-bg);\n  color: var(--app-menu-fg);\n}\n.app-menu__segment[_ngcontent-%COMP%]    + .app-menu__segment[_ngcontent-%COMP%] {\n  border-left: 1px solid rgba(255, 255, 255, 0.74);\n}\n.app-menu__segment[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  color: var(--app-menu-icon);\n}\n.app-menu__segment-text[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-direction: column;\n  align-items: flex-start;\n  justify-content: center;\n  min-width: 0;\n  gap: 0.06rem;\n  line-height: 1;\n  text-align: left;\n}\n.app-menu__segment-label[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  font-weight: 850;\n  line-height: 1.05;\n}\n.app-menu__segment-description[_ngcontent-%COMP%] {\n  align-self: center;\n  font-size: 0.64rem;\n  font-weight: 750;\n  line-height: 1.08;\n  opacity: 0.86;\n  text-align: center;\n  text-transform: uppercase;\n}\n.app-menu__counter[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: var(--app-menu-counter-min-width, 1.22rem);\n  height: var(--app-menu-counter-height, 1.22rem);\n  box-sizing: border-box;\n  border-radius: 999px;\n  padding: var(--app-menu-counter-padding, 0 0.32rem);\n  background:\n    linear-gradient(\n      180deg,\n      #e24955 0%,\n      #c93240 100%);\n  color: #fff;\n  font-size: 0.68rem;\n  font-weight: 900;\n  line-height: 1;\n  box-shadow: 0 5px 10px rgba(163, 36, 48, 0.24);\n  white-space: nowrap;\n  pointer-events: none;\n  z-index: 3;\n}\n.app-menu__counter--success[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #2da66f 0%,\n      #208456 100%);\n  color: #fff;\n  box-shadow: 0 5px 10px rgba(26, 119, 76, 0.24);\n}\n.app-menu__counter--trigger[_ngcontent-%COMP%], \n.app-menu__counter--tile[_ngcontent-%COMP%] {\n  position: absolute;\n  top: var(--app-menu-trigger-counter-top, -0.34rem);\n  right: var(--app-menu-trigger-counter-right, -0.28rem);\n}\n.app-menu__trigger[_ngcontent-%COMP%]    > .app-menu__counter--trigger[_ngcontent-%COMP%] {\n  z-index: 10;\n}\n.app-menu__counter--tile[_ngcontent-%COMP%] {\n  top: -6px;\n  right: -6px;\n  min-width: 20px;\n  height: 20px;\n  font-size: 10px;\n  box-shadow: 0 0 0 2px #fff;\n}\n.app-menu__counter--pulse[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_app-menu-counter-pulse 1.6s ease-in 1;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__counter[_ngcontent-%COMP%] {\n  margin-left: auto;\n  min-width: 34px;\n  height: 20px;\n  border-radius: 999px;\n  padding: 0 0.38rem;\n  background: rgba(54, 101, 161, 0.12);\n  color: #315d94;\n  font-size: 0.68rem;\n  font-weight: 900;\n  box-shadow: none;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__counter--alert[_ngcontent-%COMP%] {\n  min-width: 20px;\n  width: auto;\n  height: 20px;\n  padding: 0 5px;\n  border: 1px solid #fff;\n  background:\n    linear-gradient(\n      180deg,\n      #e24955 0%,\n      #c93240 100%);\n  color: #fff;\n  box-shadow: 0 4px 9px rgba(163, 36, 48, 0.22);\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__counter--success[_ngcontent-%COMP%] {\n  min-width: 20px;\n  width: auto;\n  height: 20px;\n  padding: 0 5px;\n  border: 1px solid #fff;\n  background:\n    linear-gradient(\n      180deg,\n      #2da66f 0%,\n      #208456 100%);\n  color: #fff;\n  box-shadow: 0 4px 9px rgba(26, 119, 76, 0.22);\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item-header[_ngcontent-%COMP%]    > .app-menu__counter[_ngcontent-%COMP%] {\n  margin-left: 0.34rem;\n  min-width: auto;\n  height: 18px;\n  padding: 0 0.4rem;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item--disabled[_ngcontent-%COMP%]   .app-menu__item-header[_ngcontent-%COMP%]    > .app-menu__counter[_ngcontent-%COMP%] {\n  background: rgba(104, 116, 132, 0.16);\n  color: #697487;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item--layout-pill[_ngcontent-%COMP%]   .app-menu__counter[_ngcontent-%COMP%] {\n  min-width: 20px;\n  height: 20px;\n  margin-left: 0.16rem;\n  border: 1px solid #fff;\n  background:\n    linear-gradient(\n      180deg,\n      #e24955 0%,\n      #c93240 100%);\n  color: #fff;\n  font-size: 0.7rem;\n  box-shadow: 0 4px 9px rgba(163, 36, 48, 0.22);\n}\n.app-menu__divider[_ngcontent-%COMP%] {\n  height: 1px;\n  margin: 0.18rem 0.2rem;\n  background: rgba(44, 72, 108, 0.12);\n}\n.app-menu__section-label[_ngcontent-%COMP%] {\n  padding: 0.42rem 0.48rem 0.12rem;\n  color: rgba(37, 58, 86, 0.62);\n  font-size: 0.7rem;\n  font-weight: 900;\n  letter-spacing: 0;\n  text-transform: uppercase;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n}\n.app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__section-label[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 32px;\n  padding: 0.24rem 0.28rem;\n  color: var(--app-menu-fg);\n}\n.app-menu__section-label[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.app-menu__section-label[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n  line-height: 15px;\n  color: var(--app-menu-icon);\n}\n.app-menu__section-action[_ngcontent-%COMP%] {\n  appearance: none;\n  -webkit-appearance: none;\n  min-height: 24px;\n  border: 1px solid var(--app-menu-border);\n  border-radius: 999px;\n  padding: 0.12rem 0.42rem;\n  margin-left: auto;\n  background: var(--app-menu-bg);\n  color: var(--app-menu-fg);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.16rem;\n  font: inherit;\n  font-size: 0.62rem;\n  font-weight: 850;\n  line-height: 1;\n  white-space: nowrap;\n  cursor: pointer;\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.62);\n  transition:\n    border-color 0.14s ease,\n    background 0.14s ease,\n    color 0.14s ease,\n    filter 0.14s ease,\n    transform 0.14s ease;\n}\n.app-menu__section-action[_ngcontent-%COMP%]:not(:disabled):hover {\n  background: var(--app-menu-bg-hover);\n  transform: translateY(-1px);\n}\n.app-menu__section-action--active[_ngcontent-%COMP%] {\n  background: var(--app-menu-bg-hover);\n  color: var(--app-menu-fg);\n}\n.app-menu__section-action[_ngcontent-%COMP%]:disabled {\n  cursor: default;\n  opacity: 0.56;\n}\n.app-menu__section-action[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n  color: var(--app-menu-icon);\n}\n.app-menu__tile-divider[_ngcontent-%COMP%], \n.app-menu__tile-section[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.app-menu-host--layout-mobile[_nghost-%COMP%]:not(.app-menu-host--layout-grid):not(.app-menu-host--kind-select):not(.app-menu-host--kind-fab):not(.app-menu-host--layout-row)   .app-menu[_ngcontent-%COMP%] {\n  position: static;\n}\n.app-menu-host--layout-mobile[_nghost-%COMP%]:not(.app-menu-host--layout-grid):not(.app-menu-host--kind-select):not(.app-menu-host--kind-fab):not(.app-menu-host--layout-row)   .app-menu__backdrop[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 1000;\n  border: 0;\n  padding: 0;\n  background: rgba(12, 24, 40, 0.36);\n  cursor: default;\n}\n.app-menu-host--layout-mobile[_nghost-%COMP%]:not(.app-menu-host--layout-grid):not(.app-menu-host--kind-select):not(.app-menu-host--kind-fab):not(.app-menu-host--layout-row)   .app-menu__panel[_ngcontent-%COMP%] {\n  position: fixed;\n  left: 0.6rem;\n  right: 0.6rem;\n  top: auto;\n  bottom: 0.6rem;\n  z-index: 1001;\n  width: auto;\n  min-width: 0;\n  max-width: none;\n  max-height: min(76vh, 34rem);\n  border-radius: 16px;\n  padding: 0.52rem;\n  box-shadow: 0 24px 62px rgba(8, 18, 34, 0.32);\n  animation: _ngcontent-%COMP%_app-menu-sheet-in 0.18s ease-out;\n}\n.app-menu-host--layout-mobile[_nghost-%COMP%]:not(.app-menu-host--layout-grid):not(.app-menu-host--kind-select):not(.app-menu-host--kind-fab):not(.app-menu-host--layout-row)   .app-menu__panel[_ngcontent-%COMP%]::before {\n  content: "";\n  justify-self: center;\n  width: 2.25rem;\n  height: 0.24rem;\n  margin: 0.06rem 0 0.16rem;\n  border-radius: 999px;\n  background: rgba(38, 62, 92, 0.22);\n}\n.app-menu-host--layout-mobile.app-menu-host--model-layout-tabs[_nghost-%COMP%]   .app-menu[_ngcontent-%COMP%] {\n  position: static;\n}\n.app-menu-host--layout-mobile.app-menu-host--model-layout-tabs[_nghost-%COMP%]   .app-menu__panel--tabs[_ngcontent-%COMP%] {\n  position: fixed;\n  left: 0.6rem;\n  right: 0.6rem;\n  top: auto;\n  bottom: 0.6rem;\n  z-index: 1001;\n  width: auto;\n  min-width: 0;\n  max-width: none;\n  max-height: min(76vh, 34rem);\n  border-radius: 16px;\n  padding: 0.52rem;\n  box-shadow: 0 24px 62px rgba(8, 18, 34, 0.32);\n  animation: _ngcontent-%COMP%_app-menu-sheet-in 0.18s ease-out;\n}\n.app-menu-host--layout-mobile.app-menu-host--model-layout-tabs[_nghost-%COMP%]   .app-menu__panel--tabs[_ngcontent-%COMP%]::before {\n  content: "";\n  justify-self: center;\n  width: 2.25rem;\n  height: 0.24rem;\n  margin: 0.06rem 0 0.16rem;\n  border-radius: 999px;\n  background: rgba(38, 62, 92, 0.22);\n}\n.app-menu-host--layout-mobile.app-menu-host--layout-row[_nghost-%COMP%]   .app-menu__button-row-item--selected-value[_ngcontent-%COMP%] {\n  flex: 0 1 auto;\n  min-width: 0;\n  max-width: min(8.4rem, 31vw);\n}\n.app-menu-host--inline-row-labelled-action[_nghost-%COMP%]:not(.app-menu-host--content-actions) {\n  display: block;\n  width: 100%;\n}\n.app-menu-host--inline-row-labelled-action[_nghost-%COMP%]:not(.app-menu-host--content-actions)   .app-menu[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n}\n.app-menu-host--inline-row-labelled-action[_nghost-%COMP%]:not(.app-menu-host--content-actions)   .app-menu__button-row[_ngcontent-%COMP%] {\n  display: flex;\n  width: 100%;\n  justify-content: stretch;\n  gap: 0.78rem;\n}\n.app-menu-host--inline-row-labelled-action[_nghost-%COMP%]:not(.app-menu-host--content-actions)   .app-menu__button-row-item--action.app-menu__button-row-item--labelled[_ngcontent-%COMP%] {\n  flex: 1 1 0;\n  min-width: 0;\n  padding-inline: 16px;\n}\n.app-menu-host--layout-mobile.app-menu-host--inline-row-labelled-action.app-menu-host--compact[_nghost-%COMP%]   .app-menu__button-row-item--action.app-menu__button-row-item--labelled[_ngcontent-%COMP%] {\n  gap: 0;\n  padding-inline: 0.26rem;\n}\n.app-menu-host--layout-mobile.app-menu-host--inline-row-labelled-action.app-menu-host--compact[_nghost-%COMP%]   .app-menu__button-row-main[_ngcontent-%COMP%] {\n  gap: 0.06rem;\n}\n.app-menu-host--layout-mobile.app-menu-host--inline-row-labelled-action.app-menu-host--compact[_nghost-%COMP%]   .app-menu__button-row-main[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  flex: 0 0 0.92rem;\n  width: 0.92rem;\n  height: 0.92rem;\n  font-size: 0.92rem;\n  line-height: 0.92rem;\n}\n.app-menu-host--layout-mobile.app-menu-host--inline-row-big[_nghost-%COMP%]   .app-menu__button-row[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(var(--app-menu-mobile-big-columns), minmax(0, 1fr));\n}\n.app-menu-host--layout-mobile.app-menu-host--inline-row-big[_nghost-%COMP%]   .app-menu__button-row-item--selected-value[_ngcontent-%COMP%] {\n  flex: initial;\n  width: 100%;\n  max-width: none;\n}\n.app-menu-host--layout-mobile.app-menu-host--kind-select[_nghost-%COMP%]   .app-menu__panel--dropdown-list[_ngcontent-%COMP%], \n.app-menu-host--layout-mobile.app-menu-host--kind-fab[_nghost-%COMP%]   .app-menu__panel--dropdown-list[_ngcontent-%COMP%], \n.app-menu-host--layout-mobile.app-menu-host--layout-row[_nghost-%COMP%]   .app-menu__panel--dropdown-list[_ngcontent-%COMP%] {\n  position: fixed;\n  left: 0.4rem;\n  right: 0.4rem;\n  top: auto;\n  bottom: 0.4rem;\n  z-index: 1001;\n  width: auto;\n  min-width: 0;\n  max-width: none;\n  max-height: var(--app-menu-mobile-dropdown-max-height);\n  overflow: hidden;\n  border-radius: 14px;\n  box-shadow: 0 18px 34px rgba(26, 42, 68, 0.18);\n  animation: _ngcontent-%COMP%_app-menu-sheet-in 0.18s ease-out;\n}\n.app-menu-host--layout-mobile.app-menu-host--kind-select[_nghost-%COMP%]   .app-menu__panel--dropdown-list.app-menu__panel--open-up[_ngcontent-%COMP%], \n.app-menu-host--layout-mobile.app-menu-host--kind-fab[_nghost-%COMP%]   .app-menu__panel--dropdown-list.app-menu__panel--open-up[_ngcontent-%COMP%], \n.app-menu-host--layout-mobile.app-menu-host--layout-row[_nghost-%COMP%]   .app-menu__panel--dropdown-list.app-menu__panel--open-up[_ngcontent-%COMP%] {\n  position: absolute;\n  left: auto;\n  right: 0;\n  top: auto;\n  bottom: calc(100% + var(--app-menu-panel-gap, 0.26rem));\n  width: max-content;\n  min-width: 100%;\n  max-width: min(28rem, 100vw - 1.2rem);\n  animation-name: _ngcontent-%COMP%_app-menu-panel-up-in;\n}\n.app-menu-host--layout-mobile.app-menu-host--kind-select[_nghost-%COMP%]   .app-menu__panel--dropdown-list.app-menu__panel--open-up.app-menu__panel--align-start[_ngcontent-%COMP%], \n.app-menu-host--layout-mobile.app-menu-host--kind-fab[_nghost-%COMP%]   .app-menu__panel--dropdown-list.app-menu__panel--open-up.app-menu__panel--align-start[_ngcontent-%COMP%], \n.app-menu-host--layout-mobile.app-menu-host--layout-row[_nghost-%COMP%]   .app-menu__panel--dropdown-list.app-menu__panel--open-up.app-menu__panel--align-start[_ngcontent-%COMP%] {\n  left: 0;\n  right: auto;\n}\n.app-menu-host--layout-mobile.app-menu-host--kind-select[_nghost-%COMP%]   .app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__items[_ngcontent-%COMP%], \n.app-menu-host--layout-mobile.app-menu-host--kind-fab[_nghost-%COMP%]   .app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__items[_ngcontent-%COMP%], \n.app-menu-host--layout-mobile.app-menu-host--layout-row[_nghost-%COMP%]   .app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__items[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 0;\n  max-height: var(--app-menu-mobile-dropdown-max-height);\n  max-width: none;\n  overflow-x: hidden;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n  padding-right: 0.08rem;\n}\n.app-menu-host--layout-mobile.app-menu-host--kind-select[_nghost-%COMP%]   .app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item[_ngcontent-%COMP%], \n.app-menu-host--layout-mobile.app-menu-host--kind-fab[_nghost-%COMP%]   .app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item[_ngcontent-%COMP%], \n.app-menu-host--layout-mobile.app-menu-host--layout-row[_nghost-%COMP%]   .app-menu__panel--dropdown-list[_ngcontent-%COMP%]   .app-menu__item[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n}\n.app-menu-host--layout-mobile.app-menu-host--kind-select[_nghost-%COMP%]   .app-menu__panel--dropdown-list.app-menu__panel--has-branch-header[_ngcontent-%COMP%]   .app-menu__items[_ngcontent-%COMP%], \n.app-menu-host--layout-mobile.app-menu-host--kind-fab[_nghost-%COMP%]   .app-menu__panel--dropdown-list.app-menu__panel--has-branch-header[_ngcontent-%COMP%]   .app-menu__items[_ngcontent-%COMP%], \n.app-menu-host--layout-mobile.app-menu-host--layout-row[_nghost-%COMP%]   .app-menu__panel--dropdown-list.app-menu__panel--has-branch-header[_ngcontent-%COMP%]   .app-menu__items[_ngcontent-%COMP%] {\n  max-height: calc(var(--app-menu-mobile-dropdown-max-height) - 2.7rem);\n}\n.app-menu-host--layout-mobile[_nghost-%COMP%]   .app-menu__tile-label[_ngcontent-%COMP%] {\n  font-size: 0.66rem;\n}\n.app-menu-host--layout-mobile[_nghost-%COMP%]   .app-menu__segment[_ngcontent-%COMP%] {\n  gap: 0.34rem;\n  padding: 0 0.42rem;\n}\n@keyframes _ngcontent-%COMP%_app-menu-panel-in {\n  from {\n    opacity: 0;\n    transform: translateY(-4px) scale(0.98);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0) scale(1);\n  }\n}\n@keyframes _ngcontent-%COMP%_app-menu-panel-up-in {\n  from {\n    opacity: 0;\n    transform: translateY(4px) scale(0.98);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0) scale(1);\n  }\n}\n@keyframes _ngcontent-%COMP%_app-menu-sheet-in {\n  from {\n    opacity: 0;\n    transform: translateY(18px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes _ngcontent-%COMP%_app-menu-counter-pulse {\n  0%, 100% {\n    box-shadow: 0 5px 10px rgba(163, 36, 48, 0.2);\n  }\n  50% {\n    box-shadow: 0 0 0 4px rgba(226, 73, 85, 0.14), 0 5px 10px rgba(163, 36, 48, 0.24);\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .app-menu__panel[_ngcontent-%COMP%], \n   .app-menu__counter--pulse[_ngcontent-%COMP%] {\n    animation: none;\n  }\n  .app-menu__trigger[_ngcontent-%COMP%], \n   .app-menu__trigger--layout-icon[_ngcontent-%COMP%]    > .mat-icon[_ngcontent-%COMP%]:not(.app-menu__trigger-caret), \n   .app-menu__item[_ngcontent-%COMP%], \n   .app-menu__tile-item[_ngcontent-%COMP%] {\n    transition: none;\n  }\n}\n.app-menu__button-row-item--labelled[data-toggle-palette][_ngcontent-%COMP%], \n.app-menu__button-row-item--labelled[data-toggle-palette][_ngcontent-%COMP%]:hover {\n  background: var(--app-menu-bg);\n  color: var(--app-menu-fg);\n  border-color: var(--app-menu-border);\n  box-shadow: none;\n}\n.app-menu__tabs-toggle[data-toggle-palette][_ngcontent-%COMP%] {\n  background: var(--app-menu-bg-strong);\n  border-color: var(--app-menu-border);\n}\n/*# sourceMappingURL=menu.component.css.map */'], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppMenuComponent, [{
    type: Component,
    args: [{ selector: "app-menu", standalone: true, imports: [CommonModule, MatIconModule, I18nPipe, RateComponent, IndicatorComponent], providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => AppMenuComponent),
        multi: true
      }
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `<div class="app-menu" [class.app-menu--open]="panelVisible">
  @if (hasTrigger) {
    <button
      type="button"
      class="app-menu__trigger motion-static"
      [ngClass]="triggerPaletteClass()"
      [class.app-menu__trigger--open]="open"
      [class.app-menu__trigger--label-hidden]="trigger?.hideLabel"
      [class.app-menu__trigger--collapsible]="trigger?.collapsible"
      [class.app-menu__trigger--placeholder]="usesDefaultSelectTriggerLabel()"
      [class.app-menu__trigger--layout-field]="triggerLayout() === 'field'"
      [class.app-menu__trigger--layout-pill]="triggerLayout() === 'pill'"
      [class.app-menu__trigger--layout-icon]="triggerLayout() === 'icon'"
      [disabled]="triggerDisabled()"
      [attr.aria-expanded]="open"
      [attr.aria-haspopup]="triggerAriaHasPopup()"
      [attr.aria-label]="triggerAriaLabel()"
      [attr.data-action-wave]="isFabKind ? 'true' : null"
      (pointerdown)="startTriggerDrag($event)"
      (contextmenu)="preventTriggerContextMenu($event)"
      (click)="toggleMenu($event)"
      >
      @if (isFabKind) {
        <span
          class="app-menu__trigger-wave-surface"
          data-action-wave-surface="true"
          aria-hidden="true"
        ></span>
      }
      @if (triggerImageUrl() || triggerImageFallback()) {
        <span class="app-menu__trigger-image">
          @if (triggerImageUrl(); as imageUrl) {
            <img
              [src]="imageUrl"
              [alt]="triggerImageAlt()"
              (error)="revealImageFallback($event)"
              (load)="hideImageFallback($event)"
            />
            @if (triggerImageFallback(); as imageFallback) {
              <span data-app-menu-image-fallback hidden>{{ imageFallback }}</span>
            }
          } @else {
            <span>{{ triggerImageFallback() }}</span>
          }
        </span>
      } @else if (triggerIcon()) {
        <mat-icon [class.app-menu__trigger-icon--symbol]="isSymbolIcon(triggerIcon())">{{ triggerIcon() }}</mat-icon>
      }
      @if (!trigger?.hideLabel && triggerLabel()) {
        <span class="app-menu__trigger-label">{{ triggerLabel() | i18n }}</span>
      }
      @if (triggerTrailingIcon()) {
        <mat-icon
          class="app-menu__trigger-caret"
          [class.app-menu__trigger-caret--static]="!triggerCaretRotates()"
          >
          {{ triggerTrailingIcon() }}
        </mat-icon>
      }
      @if (hasTriggerCounter()) {
        <span
          class="app-menu__counter app-menu__counter--trigger"
          [class.app-menu__counter--pulse]="isCounterPulsing(triggerCounterKey())"
          >
          {{ triggerCounterLabel() }}
        </span>
      }
    </button>
    <ng-content select="[appMenuOverlay]"></ng-content>
  }

  @if (isInlineRowLayout) {
    <div class="app-menu__button-row" role="toolbar">
      @for (item of actionRowItems; track trackByItemId($index, item)) {
        @if (!isDivider(item) && !isSection(item)) {
          <button
            type="button"
            class="app-menu__button-row-item"
            [ngClass]="itemPaletteClass(item)"
            [class.app-menu__button-row-item--active]="isItemActive(item)"
            [class.app-menu__button-row-item--open]="isActionRowItemOpen(item)"
            [class.app-menu__button-row-item--toggle]="isToggleItem(item)"
            [attr.data-toggle-palette]="item.togglePalette ?? null"
            [class.app-menu__button-row-item--labelled]="isLabeledActionRowItem(item)"
            [class.app-menu__button-row-item--action]="isActionLayoutItem(item)"
            [class.app-menu__button-row-item--image]="isImageLayoutItem(item)"
            [class.app-menu__button-row-item--image-stack]="isImageStackLayoutItem(item)"
            [class.app-menu__button-row-item--selected-value]="isSelectTriggerItem(item) && isItemActive(item)"
            [class.app-menu__button-row-item--progress]="itemProgressState(item) !== null"
            [class.app-menu__button-row-item--progress-loading]="itemProgressState(item) === 'loading'"
            [class.app-menu__button-row-item--progress-error]="itemProgressState(item) === 'error'"
            [class.app-menu__button-row-item--progress-success]="itemProgressState(item) === 'success'"
            [disabled]="isItemDisabled(item)"
            [attr.aria-expanded]="hasNestedItems(item) ? isActionRowItemOpen(item) : null"
            [attr.aria-haspopup]="hasNestedItems(item) ? 'menu' : null"
            [attr.aria-pressed]="isToggleItem(item) ? isItemActive(item) : null"
            [attr.aria-label]="actionRowItemAriaLabel(item)"
            [title]="isItemDisabled(item) ? null : actionRowItemAriaLabel(item) || actionRowItemLabel(item)"
            (click)="selectActionRowItem(item, $event)"
            >
            @if (itemProgressState(item); as progressState) {
              <span class="app-menu__button-row-ring" aria-hidden="true">
                <app-indicator
                  kind="action-ring"
                  [shape]="itemProgressShape(item)"
                  [state]="progressState"
                  [tone]="itemProgressTone(item)"
                  [perimeter]="itemProgressPerimeter(item)"
                  [durationMs]="itemProgressDurationMs(item)"
                ></app-indicator>
              </span>
            }
            @if (isImageStackLayoutItem(item)) {
              <span class="app-menu__button-row-image-stack" aria-hidden="true">
                @for (image of actionRowItemImageStack(item); track image.id) {
                  <span class="app-menu__button-row-stack-image">
                    @if (actionRowStackImageUrl(image); as imageUrl) {
                      <img [src]="imageUrl" [alt]="actionRowStackImageAlt(image)" />
                    } @else if (actionRowStackImageFallback(image)) {
                      <span>{{ actionRowStackImageFallback(image) }}</span>
                    }
                  </span>
                }
              </span>
            } @else if (isImageLayoutItem(item)) {
              <span class="app-menu__button-row-image">
                @if (actionRowItemImageUrl(item); as imageUrl) {
                  <img
                    [src]="imageUrl"
                    [alt]="actionRowItemImageAlt(item)"
                    (error)="revealImageFallback($event)"
                    (load)="hideImageFallback($event)"
                  />
                  @if (actionRowItemImageFallback(item); as imageFallback) {
                    <span data-app-menu-image-fallback hidden>{{ imageFallback }}</span>
                  }
                } @else if (actionRowItemImageFallback(item)) {
                  <span>{{ actionRowItemImageFallback(item) }}</span>
                } @else if (actionRowItemIcon(item)) {
                  <mat-icon>{{ actionRowItemIcon(item) }}</mat-icon>
                }
              </span>
            } @else if (actionRowItemIcon(item) && (isInlineRowBig || !isLabeledActionRowItem(item) || !actionRowItemLabel(item))) {
              <mat-icon>{{ actionRowItemIcon(item) }}</mat-icon>
            }
            @if (isInlineRowBig) {
              <span class="app-menu__button-row-copy">
                @if (actionRowItemLabel(item)) {
                  <span class="app-menu__button-row-label">{{ actionRowItemLabel(item) | i18n }}</span>
                }
                @if (actionRowItemDetail(item); as detail) {
                  <span class="app-menu__button-row-detail">
                    <span>{{ detail | i18n }}</span>
                  </span>
                }
              </span>
              @if (hasNestedItems(item)) {
                <span class="app-menu__button-row-trailing">
                  <mat-icon class="app-menu__button-row-caret">chevron_right</mat-icon>
                </span>
              }
              @if (hasActionRowItemSummaryCounter(item)) {
                <span
                  class="app-menu__counter app-menu__counter--value-corner"
                  [class.app-menu__counter--pulse]="isCounterPulsing(actionRowItemSummaryCounterKey(item))"
                  >
                  {{ actionRowItemSummaryCounterLabel(item) }}
                </span>
              }
              @if (hasItemCounter(item)) {
                <span
                  class="app-menu__counter app-menu__counter--trigger"
                  [class.app-menu__counter--alert]="item.counterTone === 'alert'"
                  [class.app-menu__counter--success]="item.counterTone === 'success'"
                  [class.app-menu__counter--pulse]="isCounterPulsing(itemCounterKey(item))"
                  >
                  {{ itemCounterLabel(item) }}
                </span>
              }
            } @else {
              @if (isLabeledActionRowItem(item) && actionRowItemLabel(item)) {
                <span class="app-menu__button-row-main">
                  @if (actionRowItemIcon(item)) {
                    <mat-icon>{{ actionRowItemIcon(item) }}</mat-icon>
                  }
                  <span class="app-menu__button-row-label">{{ actionRowItemLabel(item) | i18n }}</span>
                </span>
              }
              @if (isLabeledActionRowItem(item) && showActionRowToggleIndicator(item)) {
                <span
                  class="app-menu__tabs-toggle app-menu__button-row-toggle"
                  [ngClass]="togglePaletteClass(item)"
                  [attr.data-toggle-palette]="item.togglePalette ?? null"
                  [class.app-menu__tabs-toggle--active]="isItemActive(item)"
                  aria-hidden="true"
                >
                  <span></span>
                </span>
              }
              @if (hasItemCounter(item)) {
                <span
                  class="app-menu__counter app-menu__counter--trigger"
                  [class.app-menu__counter--alert]="item.counterTone === 'alert'"
                  [class.app-menu__counter--success]="item.counterTone === 'success'"
                  [class.app-menu__counter--pulse]="isCounterPulsing(itemCounterKey(item))"
                  >
                  {{ itemCounterLabel(item) }}
                </span>
              }
              @if (isLabeledActionRowItem(item) && hasNestedItems(item)) {
                <mat-icon class="app-menu__button-row-caret">expand_more</mat-icon>
              }
            }
          </button>
        }
      }
    </div>
  }

  @if (panelVisible) {
    @if (showMobileBackdrop) {
      <button
        type="button"
        class="app-menu__backdrop"
        (click)="closeFromBackdrop($event)"
        aria-label="Close menu"
      ></button>
    }

    <div
      class="app-menu__panel"
      [class.app-menu__panel--inline]="usesInlinePanel"
      [class.app-menu__panel--dropdown-list]="!currentTabbedModelLayout && (isDropdownListKind || isInlineRowLayout || activeBranch)"
      [class.app-menu__panel--fab]="isFabKind"
      [class.app-menu__panel--tabs]="currentTabbedModelLayout"
      [class.app-menu__panel--has-branch-header]="showBranchBack"
      [class.app-menu__panel--open-up]="resolvedOpenUp"
      [class.app-menu__panel--align-start]="resolvedPanelAlign === 'start'"
      [class.app-menu__panel--dock-to-host]="panelDockToHost"
      role="menu"
      (click)="$event.stopPropagation()"
      >
      @if (resolvedTitle) {
        <div class="app-menu__title">{{ resolvedTitle | i18n }}</div>
      }

      @if (isInlineGridLayout && hasMenuNodes) {
        <div class="app-menu__groups">
          @for (group of menuNodes; track trackByGroupId($index, group)) {
            <section class="app-menu__group" role="group" [attr.aria-label]="groupAriaLabel(group)">
              @if (groupLabel(group) || groupIcon(group)) {
                <div class="app-menu__group-header" [ngClass]="groupPaletteClass(group)">
                  <span class="app-menu__group-badge">
                    @if (groupIcon(group)) {
                      <mat-icon>{{ groupIcon(group) }}</mat-icon>
                    }
                    @if (groupLabel(group)) {
                      <span>{{ groupLabel(group) | i18n }}</span>
                    }
                  </span>
                  <span class="app-menu__group-line"></span>
                </div>
              }
              <div class="app-menu__tile-grid">
                @for (item of groupItems(group); track trackByItemId($index, item)) {
                  @if (isDivider(item)) {
                    <div class="app-menu__divider app-menu__tile-divider" role="separator"></div>
                  } @else if (isSection(item)) {
                    <div class="app-menu__section-label app-menu__tile-section">{{ itemLabel(item) | i18n }}</div>
                  } @else {
                    <button
                      type="button"
                      class="app-menu__tile-item"
                      [ngClass]="itemPaletteClass(item)"
                      [class.app-menu__tile-item--active]="isItemActive(item)"
                      [class.app-menu__tile-item--disabled]="isItemDisabled(item)"
                      [class.app-menu__tile-item--segmented]="hasItemSegments(item)"
                      [style.grid-column]="itemGridColumn(item)"
                      [disabled]="isItemDisabled(item)"
                      [attr.role]="itemRole(item)"
                      [attr.aria-checked]="isItemChecked(item)"
                      [attr.aria-label]="itemAriaLabel(item)"
                      [title]="itemAriaLabel(item) || itemLabel(item)"
                      (click)="selectItem(item, $event)"
                      >
                      @if (hasItemSegments(item)) {
                        <span class="app-menu__segments" aria-hidden="true">
                          @for (segment of itemSegments(item); track trackBySegmentId($index, segment)) {
                            <span class="app-menu__segment" [ngClass]="segmentPaletteClass(segment)">
                              @if (segmentIcon(segment)) {
                                <mat-icon>{{ segmentIcon(segment) }}</mat-icon>
                              }
                              <span class="app-menu__segment-text">
                                @if (segmentLabel(segment)) {
                                  <span class="app-menu__segment-label">{{ segmentLabel(segment) | i18n }}</span>
                                }
                                @if (segmentDescription(segment)) {
                                  <span class="app-menu__segment-description">{{ segmentDescription(segment) | i18n }}</span>
                                }
                              </span>
                            </span>
                          }
                        </span>
                      } @else {
                        @if (itemIcon(item)) {
                          <mat-icon class="app-menu__tile-icon">{{ itemIcon(item) }}</mat-icon>
                        }
                        <span class="app-menu__tile-label">{{ itemLabel(item) | i18n }}</span>
                        @if (itemDescription(item)) {
                          <span class="app-menu__tile-description">{{ itemDescription(item) | i18n }}</span>
                        }
                      }
                      @if (hasItemCounter(item)) {
                        <span
                          class="app-menu__counter app-menu__counter--tile"
                          [class.app-menu__counter--alert]="item.counterTone === 'alert'"
                          [class.app-menu__counter--success]="item.counterTone === 'success'"
                          [class.app-menu__counter--pulse]="isCounterPulsing(itemCounterKey(item, group))"
                          >
                          {{ itemCounterLabel(item) }}
                        </span>
                      }
                    </button>
                  }
                }
              </div>
            </section>
          }
        </div>
      } @else if (currentTabbedModelLayout && hasTabsGroups) {
        <div class="app-menu__tabs">
          @if (isTabsFilterable()) {
            <div class="app-menu__tabs-head">
              <div class="app-menu__tabs-filter" (click)="$event.stopPropagation()">
                <mat-icon>search</mat-icon>
                <input
                  type="text"
                  class="app-menu__tabs-filter-input"
                  [value]="tabsFilterText"
                  [attr.placeholder]="resolvedTitle || 'Search'"
                  (input)="updateTabsFilter($event)"
                  (keydown)="$event.stopPropagation()"
                  />
                @if (tabsFilterText) {
                  <button
                    type="button"
                    class="app-menu__tabs-filter-clear"
                    aria-label="Clear search"
                    title="Clear search"
                    (click)="clearTabsFilter($event)"
                    >
                    <mat-icon>close</mat-icon>
                  </button>
                }
              </div>
            </div>
          }
          @if (showTabsBar()) {
            <div class="app-menu__tabs-tabs" role="tablist" [attr.aria-label]="resolvedTitle || 'Menu tabs'">
              @for (group of visibleTabsGroups; track trackByGroupId($index, group)) {
                <button
                  type="button"
                  class="app-menu__tabs-tab"
                  [ngClass]="groupPaletteClass(group)"
                  [class.app-menu__tabs-tab--active]="isTabsGroupActive(group)"
                  [attr.id]="tabsId(group)"
                  role="tab"
                  [attr.aria-selected]="isTabsGroupActive(group)"
                  [attr.aria-controls]="tabsPanelId(group)"
                  (click)="selectTabsGroup(group, $event)"
                  >
                  @if (groupIcon(group)) {
                    <mat-icon>{{ groupIcon(group) }}</mat-icon>
                  }
                  @if (groupLabel(group)) {
                    <span>{{ groupLabel(group) | i18n }}</span>
                  }
                  @if (tabsGroupSelectedCount(group) > 0) {
                    <span class="app-menu__counter app-menu__counter--tabs-tab">{{ tabsGroupSelectedCount(group) }}</span>
                  }
                </button>
              }
            </div>
          }
          @if (activeTabsGroup(); as group) {
            <div
              class="app-menu__tabs-panel"
              [attr.id]="tabsPanelId(group)"
              role="tabpanel"
              [attr.aria-labelledby]="showTabsBar() ? tabsId(group) : null"
              >
              <div
                class="app-menu__tabs-items"
                [class.app-menu__tabs-items--fixed-columns]="tabsColumnCount() !== null"
                [class.app-menu__tabs-items--icon-list]="isTabsIconList(group)"
                [style.--app-menu-tabs-columns]="tabsColumnCount()"
              >
                @for (item of tabsGroupItems(group); track trackByItemId($index, item)) {
                  @if (isDivider(item)) {
                    <div class="app-menu__divider app-menu__tabs-divider" role="separator"></div>
                  } @else if (isSection(item)) {
                    <div class="app-menu__section-label app-menu__tabs-section" [ngClass]="itemPaletteClass(item)">
                      @if (itemIcon(item)) {
                        <mat-icon>{{ itemIcon(item) }}</mat-icon>
                      }
                      <span>{{ itemLabel(item) | i18n }}</span>
                    </div>
                  } @else {
                    <button
                      type="button"
                      class="app-menu__tabs-item"
                      [ngClass]="itemPaletteClass(item)"
                      [class.app-menu__tabs-item--active]="isItemActive(item)"
                      [class.app-menu__tabs-item--disabled]="isItemDisabled(item)"
                      [class.app-menu__tabs-item--with-description]="itemDescription(item)"
                      [class.app-menu__tabs-item--layout-icon]="isIconLayoutItem(item)"
                      [disabled]="isItemDisabled(item)"
                      [attr.role]="itemRole(item)"
                      [attr.aria-checked]="isItemChecked(item)"
                      [attr.aria-label]="itemAriaLabel(item)"
                      [title]="itemAriaLabel(item) || itemLabel(item)"
                      (click)="selectItem(item, $event)"
                      >
                      @if (isIconLayoutItem(item)) {
                        @if (itemIcon(item)) {
                          @if (itemIconKind(item) === 'text') {
                            <span class="app-menu__tabs-item-icon app-menu__tabs-item-icon--text">{{ itemIcon(item) }}</span>
                          } @else {
                            <mat-icon class="app-menu__tabs-item-icon">{{ itemIcon(item) }}</mat-icon>
                          }
                        }
                      } @else {
                        @if (itemIcon(item)) {
                          <mat-icon class="app-menu__tabs-item-icon">{{ itemIcon(item) }}</mat-icon>
                        }
                        <span class="app-menu__tabs-item-main">
                          <span class="app-menu__tabs-item-label">
                            @for (part of itemLabelFilterParts(item); track $index) {
                              @if (part.match) {
                                <strong class="app-menu__tabs-filter-match">{{ part.text }}</strong>
                              } @else {
                                <span>{{ part.text }}</span>
                              }
                            }
                          </span>
                          @if (itemDescription(item)) {
                            <span class="app-menu__tabs-item-description">{{ itemDescription(item) | i18n }}</span>
                          }
                        </span>
                        @if (hasItemCounter(item)) {
                          <span
                            class="app-menu__counter"
                            [class.app-menu__counter--alert]="item.counterTone === 'alert'"
                            [class.app-menu__counter--success]="item.counterTone === 'success'"
                            [class.app-menu__counter--pulse]="isCounterPulsing(itemCounterKey(item, group))"
                            >
                            {{ itemCounterLabel(item) }}
                          </span>
                        }
                        @if (showTabsItemToggle(item)) {
                          <span class="app-menu__tabs-toggle" [class.app-menu__tabs-toggle--active]="isItemActive(item)" aria-hidden="true">
                            <span></span>
                          </span>
                        }
                      }
                    </button>
                  }
                }
                @if (!hasVisibleTabsItems(group)) {
                  <div class="app-menu__tabs-empty">No matches</div>
                }
              </div>
            </div>
          } @else {
            <div class="app-menu__tabs-empty">No matches</div>
          }
        </div>
      } @else {
        @if (activeBranch; as branch) {
          @if (showBranchBack) {
            <div class="app-menu__branch-header">
              <button
                type="button"
                class="app-menu__branch-back"
                aria-label="Back to menu"
                title="Back to menu"
                (click)="closeActiveBranch($event)"
                >
                <mat-icon>arrow_back</mat-icon>
              </button>
              <span class="app-menu__branch-title">{{ itemLabel(branch) | i18n }}</span>
              @for (action of branchHeaderActions(branch); track trackByItemId($index, action)) {
                <button
                  type="button"
                  class="app-menu__branch-action"
                  [class.app-menu__branch-action--icon-only]="!itemLabel(action)"
                  [ngClass]="itemPaletteClass(action)"
                  [disabled]="isItemDisabled(action)"
                  [attr.aria-label]="itemAriaLabel(action)"
                  [title]="itemAriaLabel(action) || itemLabel(action)"
                  (click)="selectBranchHeaderAction(action, $event)"
                  >
                  @if (itemIcon(action)) {
                    <mat-icon>{{ itemIcon(action) }}</mat-icon>
                  }
                  @if (itemLabel(action)) {
                    <span>{{ itemLabel(action) | i18n }}</span>
                  }
                </button>
              }
            </div>
          }
        }
        <div class="app-menu__items">
          @for (item of visibleListItems; track trackByItemId($index, item)) {
            @if (isDivider(item)) {
              <div class="app-menu__divider" role="separator"></div>
            } @else if (isSection(item)) {
              <div class="app-menu__section-label" [ngClass]="itemPaletteClass(item)">
                @if (itemIcon(item)) {
                  <mat-icon>{{ itemIcon(item) }}</mat-icon>
                }
                <span>{{ itemLabel(item) | i18n }}</span>
                @for (action of itemHeaderActions(item); track trackByItemId($index, action)) {
                  <button
                    type="button"
                    class="app-menu__section-action"
                    [class.app-menu__section-action--active]="isItemActive(action)"
                    [ngClass]="itemPaletteClass(action)"
                    [disabled]="isItemDisabled(action)"
                    [attr.aria-pressed]="isToggleItem(action) ? isItemActive(action) : null"
                    [attr.aria-label]="itemAriaLabel(action)"
                    [title]="itemAriaLabel(action) || itemLabel(action)"
                    (click)="selectBranchHeaderAction(action, $event)"
                    >
                    @if (itemIcon(action)) {
                      <mat-icon>{{ itemIcon(action) }}</mat-icon>
                    }
                    @if (itemLabel(action)) {
                      <span>{{ itemLabel(action) | i18n }}</span>
                    }
                  </button>
                }
              </div>
            } @else if (isRateItem(item)) {
              <div
                class="app-menu__rate-item"
                [class.app-menu__rate-item--disabled]="isItemDisabled(item)"
                role="none"
                (click)="$event.stopPropagation()"
                >
                <app-menu-rate
                  [config]="itemRateConfig(item)"
                  (valueChange)="updateRateItemValue(item, $event)"
                  (scoreSelect)="selectRateItem(item, $event)"
                ></app-menu-rate>
              </div>
            } @else if (itemHref(item)) {
              <a
                class="app-menu__item"
                [ngClass]="itemPaletteClass(item)"
                [class.app-menu__item--surface-tinted]="itemSurface(item) === 'tinted'"
                [class.app-menu__item--layout-pill]="itemVisualLayout(item) === 'pill'"
                [class.app-menu__item--active]="isItemActive(item)"
                [class.app-menu__item--disabled]="isItemDisabled(item)"
                [class.app-menu__item--with-description]="itemDescription(item)"
                [attr.href]="isItemDisabled(item) ? null : itemHref(item)"
                [attr.target]="itemTarget(item)"
                [attr.rel]="itemRel(item)"
                [attr.role]="itemRole(item)"
                [attr.aria-disabled]="isItemDisabled(item) ? 'true' : null"
                [attr.aria-checked]="isItemChecked(item)"
                [attr.aria-label]="itemAriaLabel(item)"
                (click)="selectLinkItem(item, $event)"
                >
                @if (itemImageUrl(item) || itemImageFallback(item)) {
                  <span class="app-menu__item-image">
                    @if (itemImageUrl(item); as imageUrl) {
                      <img
                        [src]="imageUrl"
                        [alt]="itemImageAlt(item)"
                        (error)="revealImageFallback($event)"
                        (load)="hideImageFallback($event)"
                      />
                      @if (itemImageFallback(item); as imageFallback) {
                        <span data-app-menu-image-fallback hidden>{{ imageFallback }}</span>
                      }
                    } @else {
                      <span>{{ itemImageFallback(item) }}</span>
                    }
                  </span>
                } @else if (itemIcon(item)) {
                  <mat-icon class="app-menu__item-icon" [class.app-menu__item-icon--symbol]="isSymbolIcon(itemIcon(item))">{{ itemIcon(item) }}</mat-icon>
                }
                <span class="app-menu__item-main" [class.app-menu__item-main--with-body]="hasItemBody(item)">
                  <span class="app-menu__item-header">
                    <span class="app-menu__item-label">{{ itemLabel(item) | i18n }}</span>
                    @if (hasItemHeaderBadge(item)) {
                      <span
                        class="app-menu__counter app-menu__counter--header-badge"
                        [class.app-menu__counter--pulse]="isCounterPulsing(itemHeaderBadgeKey(item))"
                        >
                        {{ itemHeaderBadgeLabel(item) }}
                      </span>
                    }
                    @if (hasItemCounter(item)) {
                      <span
                        class="app-menu__counter"
                        [class.app-menu__counter--alert]="item.counterTone === 'alert'"
                        [class.app-menu__counter--success]="item.counterTone === 'success'"
                        [class.app-menu__counter--pulse]="isCounterPulsing(itemCounterKey(item))"
                        >
                        {{ itemCounterLabel(item) }}
                      </span>
                    }
                  </span>
                  @if (hasItemBody(item)) {
                    <span class="app-menu__item-body">
                      @if (itemDescription(item)) {
                        <span class="app-menu__item-description">{{ itemDescription(item) | i18n }}</span>
                      }
                      @if (itemDetail(item) && itemVisualLayout(item) === 'pill') {
                        <span class="app-menu__item-detail app-menu__item-detail--badge">{{ itemDetail(item) | i18n }}</span>
                      }
                    </span>
                  }
                </span>
                @if (itemDetail(item) && itemVisualLayout(item) !== 'pill') {
                  <span class="app-menu__item-detail">{{ itemDetail(item) | i18n }}</span>
                }
                @if (showItemCheck(item)) {
                  <mat-icon class="app-menu__item-check">done</mat-icon>
                }
                @if (hasNestedItems(item)) {
                  <mat-icon class="app-menu__item-branch">chevron_right</mat-icon>
                }
              </a>
            } @else {
              @if (isItemRemovable(item)) {
                <div
                  class="app-menu__item-row"
                  [ngClass]="itemPaletteClass(item)"
                  [class.app-menu__item-row--pill]="itemVisualLayout(item) === 'pill'"
                  >
                  <button
                    type="button"
                    class="app-menu__item app-menu__item--row-primary"
                    [class.app-menu__item--surface-tinted]="itemSurface(item) === 'tinted'"
                    [class.app-menu__item--layout-pill]="itemVisualLayout(item) === 'pill'"
                    [class.app-menu__item--active]="isItemActive(item)"
                    [class.app-menu__item--disabled]="isItemDisabled(item)"
                    [class.app-menu__item--with-description]="itemDescription(item)"
                    [disabled]="isItemDisabled(item)"
                    [attr.role]="itemRole(item)"
                    [attr.aria-checked]="isItemChecked(item)"
                    [attr.aria-label]="itemAriaLabel(item)"
                    (click)="selectItem(item, $event)"
                    >
                    @if (itemImageUrl(item) || itemImageFallback(item)) {
                      <span class="app-menu__item-image">
                        @if (itemImageUrl(item); as imageUrl) {
                          <img
                            [src]="imageUrl"
                            [alt]="itemImageAlt(item)"
                            (error)="revealImageFallback($event)"
                            (load)="hideImageFallback($event)"
                          />
                          @if (itemImageFallback(item); as imageFallback) {
                            <span data-app-menu-image-fallback hidden>{{ imageFallback }}</span>
                          }
                        } @else {
                          <span>{{ itemImageFallback(item) }}</span>
                        }
                      </span>
                    } @else if (itemIcon(item)) {
                      <mat-icon class="app-menu__item-icon" [class.app-menu__item-icon--symbol]="isSymbolIcon(itemIcon(item))">{{ itemIcon(item) }}</mat-icon>
                    }
                    <span class="app-menu__item-main" [class.app-menu__item-main--with-body]="hasItemBody(item)">
                      <span class="app-menu__item-header">
                        <span class="app-menu__item-label">{{ itemLabel(item) | i18n }}</span>
                        @if (hasItemHeaderBadge(item)) {
                          <span
                            class="app-menu__counter app-menu__counter--header-badge"
                            [class.app-menu__counter--pulse]="isCounterPulsing(itemHeaderBadgeKey(item))"
                            >
                            {{ itemHeaderBadgeLabel(item) }}
                          </span>
                        }
                        @if (hasItemCounter(item)) {
                          <span
                            class="app-menu__counter"
                            [class.app-menu__counter--alert]="item.counterTone === 'alert'"
                            [class.app-menu__counter--success]="item.counterTone === 'success'"
                            [class.app-menu__counter--pulse]="isCounterPulsing(itemCounterKey(item))"
                            >
                            {{ itemCounterLabel(item) }}
                          </span>
                        }
                      </span>
                      @if (hasItemBody(item)) {
                        <span class="app-menu__item-body">
                          @if (itemDescription(item)) {
                            <span class="app-menu__item-description">{{ itemDescription(item) | i18n }}</span>
                          }
                          @if (itemDetail(item) && itemVisualLayout(item) === 'pill') {
                            <span class="app-menu__item-detail app-menu__item-detail--badge">{{ itemDetail(item) | i18n }}</span>
                          }
                        </span>
                      }
                    </span>
                    @if (itemDetail(item) && itemVisualLayout(item) !== 'pill') {
                      <span class="app-menu__item-detail">{{ itemDetail(item) | i18n }}</span>
                    }
                    @if (showItemCheck(item)) {
                      <mat-icon class="app-menu__item-check">done</mat-icon>
                    }
                    @if (hasNestedItems(item)) {
                      <mat-icon class="app-menu__item-branch">chevron_right</mat-icon>
                    }
                  </button>
                  <button
                    type="button"
                    class="app-menu__item-remove"
                    [disabled]="isItemDisabled(item)"
                    [attr.aria-label]="itemRemoveAriaLabel(item)"
                    (click)="removeItem(item, $event)"
                    >
                    <mat-icon>{{ itemRemoveIcon(item) }}</mat-icon>
                  </button>
                </div>
              } @else {
                <button
                  type="button"
                  class="app-menu__item"
                  [ngClass]="itemPaletteClass(item)"
                  [class.app-menu__item--surface-tinted]="itemSurface(item) === 'tinted'"
                  [class.app-menu__item--layout-pill]="itemVisualLayout(item) === 'pill'"
                  [class.app-menu__item--active]="isItemActive(item)"
                  [class.app-menu__item--disabled]="isItemDisabled(item)"
                  [class.app-menu__item--with-description]="itemDescription(item)"
                  [disabled]="isItemDisabled(item)"
                  [attr.role]="itemRole(item)"
                  [attr.aria-checked]="isItemChecked(item)"
                  [attr.aria-label]="itemAriaLabel(item)"
                  (click)="selectItem(item, $event)"
                >
                  @if (itemImageUrl(item) || itemImageFallback(item)) {
                    <span class="app-menu__item-image">
                      @if (itemImageUrl(item); as imageUrl) {
                        <img
                          [src]="imageUrl"
                          [alt]="itemImageAlt(item)"
                          (error)="revealImageFallback($event)"
                          (load)="hideImageFallback($event)"
                        />
                        @if (itemImageFallback(item); as imageFallback) {
                          <span data-app-menu-image-fallback hidden>{{ imageFallback }}</span>
                        }
                      } @else {
                        <span>{{ itemImageFallback(item) }}</span>
                      }
                    </span>
                  } @else if (itemIcon(item)) {
                    <mat-icon class="app-menu__item-icon" [class.app-menu__item-icon--symbol]="isSymbolIcon(itemIcon(item))">{{ itemIcon(item) }}</mat-icon>
                  }
                  <span class="app-menu__item-main" [class.app-menu__item-main--with-body]="hasItemBody(item)">
                    <span class="app-menu__item-header">
                      <span class="app-menu__item-label">{{ itemLabel(item) | i18n }}</span>
                      @if (hasItemHeaderBadge(item)) {
                        <span
                          class="app-menu__counter app-menu__counter--header-badge"
                          [class.app-menu__counter--pulse]="isCounterPulsing(itemHeaderBadgeKey(item))"
                          >
                          {{ itemHeaderBadgeLabel(item) }}
                        </span>
                      }
                      @if (hasItemCounter(item)) {
                        <span
                          class="app-menu__counter"
                          [class.app-menu__counter--alert]="item.counterTone === 'alert'"
                          [class.app-menu__counter--success]="item.counterTone === 'success'"
                          [class.app-menu__counter--pulse]="isCounterPulsing(itemCounterKey(item))"
                          >
                          {{ itemCounterLabel(item) }}
                        </span>
                      }
                    </span>
                    @if (hasItemBody(item)) {
                      <span class="app-menu__item-body">
                        @if (itemDescription(item)) {
                          <span class="app-menu__item-description">{{ itemDescription(item) | i18n }}</span>
                        }
                        @if (itemDetail(item) && itemVisualLayout(item) === 'pill') {
                          <span class="app-menu__item-detail app-menu__item-detail--badge">{{ itemDetail(item) | i18n }}</span>
                        }
                      </span>
                    }
                  </span>
                  @if (itemDetail(item) && itemVisualLayout(item) !== 'pill') {
                    <span class="app-menu__item-detail">{{ itemDetail(item) | i18n }}</span>
                  }
                  @if (showItemCheck(item)) {
                    <mat-icon class="app-menu__item-check">done</mat-icon>
                  }
                  @if (hasNestedItems(item)) {
                    <mat-icon class="app-menu__item-branch">chevron_right</mat-icon>
                  }
                </button>
              }
            }
          }
        </div>
      }
    </div>
  }
</div>
`, styles: ['/* src/app/shared/ui/components/core/menu/menu.component.scss */\n:host {\n  display: inline-block;\n  min-width: 0;\n  position: relative;\n  box-sizing: border-box;\n  overflow: visible;\n  z-index: 1;\n  --app-menu-grid-columns: 5;\n  --app-menu-grid-gap: 0.46rem;\n  --app-menu-tile-height: 60px;\n  --app-menu-tile-label-white-space: normal;\n  --app-menu-tile-label-overflow-wrap: anywhere;\n  --app-menu-mobile-big-columns: 1;\n  --app-menu-tabs-items-gap: 0.34rem;\n  --app-menu-tabs-item-flex-basis: 9.5rem;\n  --app-menu-tabs-item-min-width: 9.5rem;\n  --app-menu-tabs-item-min-height: 38px;\n  --app-menu-tabs-item-padding: 0.38rem 0.46rem;\n  --app-menu-tabs-item-font-size: 0.78rem;\n  --app-menu-icon-list-item-size: 2.4rem;\n  --app-menu-icon-list-font-size: 1.28rem;\n  --app-menu-text: #243f62;\n  --app-menu-muted-text: rgba(32, 53, 82, 0.66);\n}\n.app-menu,\n.app-menu *,\n.app-menu *::before,\n.app-menu *::after {\n  box-sizing: border-box;\n}\n:host(.app-menu-host--open) {\n  z-index: 40;\n}\n:host(.app-menu-host--panel-docked) {\n  display: block;\n  width: 0;\n  height: 0;\n  min-width: 0;\n  min-height: 0;\n}\n:host(.app-menu-host--panel-docked) .app-menu {\n  display: block;\n  width: 0;\n  height: 0;\n  min-width: 0;\n  min-height: 0;\n}\n:host(.app-menu-host--layout-grid),\n:host(.app-menu-host--inline-panel) {\n  display: block;\n  width: 100%;\n  z-index: auto;\n}\n:host(.app-menu-host--model-layout-tabs),\n:host(.app-menu-host--kind-select) {\n  width: 100%;\n}\n:host(.app-menu-host--model-layout-tabs.app-menu-host--trigger-pill),\n:host(.app-menu-host--model-layout-tabs.app-menu-host--trigger-icon),\n:host(.app-menu-host--kind-select.app-menu-host--trigger-pill),\n:host(.app-menu-host--kind-select.app-menu-host--trigger-icon),\n:host(.app-menu-host--kind-fab),\n:host(.app-menu-host--layout-row) {\n  width: max-content;\n}\n:host(.app-menu-host--inline-row-big) {\n  display: block;\n  width: 100%;\n}\n:host(.app-menu-host--layout-mobile) {\n  --app-menu-grid-columns: 5;\n  --app-menu-tile-height: 60px;\n  --app-menu-mobile-dropdown-max-height: min(72vh, 520px);\n}\n:host(.app-menu-host--compact) {\n  --app-menu-compact-trigger-gap: 0.2rem;\n  --app-menu-compact-trigger-padding-inline: 0.42rem;\n  --app-menu-compact-trigger-font-size: 0.74rem;\n  --app-menu-compact-trigger-icon-size: 1rem;\n  --app-menu-compact-row-gap: 0.24rem;\n  --app-menu-compact-row-item-min-width: auto;\n  --app-menu-compact-row-item-gap: 0.22rem;\n  --app-menu-compact-row-item-padding-inline: 0.46rem;\n  --app-menu-compact-row-item-font-size: 0.74rem;\n  --app-menu-compact-row-item-icon-size: 1rem;\n}\n.app-menu {\n  position: relative;\n  display: inline-flex;\n  min-width: 0;\n  overflow: visible;\n}\n:host(.app-menu-host--layout-grid) .app-menu,\n:host(.app-menu-host--inline-panel) .app-menu {\n  display: block;\n  width: 100%;\n}\n:host(.app-menu-host--model-layout-tabs) .app-menu,\n:host(.app-menu-host--kind-select) .app-menu {\n  display: block;\n  width: 100%;\n}\n:host(.app-menu-host--model-layout-tabs.app-menu-host--trigger-pill) .app-menu,\n:host(.app-menu-host--model-layout-tabs.app-menu-host--trigger-icon) .app-menu,\n:host(.app-menu-host--kind-select.app-menu-host--trigger-pill) .app-menu,\n:host(.app-menu-host--kind-select.app-menu-host--trigger-icon) .app-menu,\n:host(.app-menu-host--kind-fab) .app-menu,\n:host(.app-menu-host--layout-row) .app-menu {\n  display: inline-flex;\n  width: auto;\n}\n:host(.app-menu-host--layout-row) .app-menu {\n  width: var(--app-menu-row-width, auto);\n  max-width: 100%;\n}\n:host(.app-menu-host--panel-docked.app-menu-host--kind-select) .app-menu,\n:host(.app-menu-host--panel-docked.app-menu-host--model-layout-tabs) .app-menu,\n:host(.app-menu-host--panel-docked.app-menu-host--kind-fab) .app-menu,\n:host(.app-menu-host--panel-docked.app-menu-host--layout-row) .app-menu {\n  display: block;\n  width: 0;\n}\n:host(.app-menu-host--panel-bottom-docked) {\n  display: block;\n  width: 100%;\n  z-index: 40;\n}\n:host(.app-menu-host--panel-bottom-docked) .app-menu {\n  display: block;\n  width: 100%;\n}\n.app-menu__palette--default,\n.app-menu__palette--neutral {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #eef5ff 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #f4f9ff 0%,\n      #e6f1ff 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #5f82b5 0%,\n      #436a9f 100%);\n  --app-menu-action-bg: #eef3f8;\n  --app-menu-action-bg-hover: #e8eef6;\n  --app-menu-action-fg: #36547d;\n  --app-menu-action-border: transparent;\n  --app-menu-action-shadow: none;\n  --app-menu-border: rgba(51, 79, 114, 0.2);\n  --app-menu-fg: #27496f;\n  --app-menu-icon: #426a98;\n  --app-menu-line: rgba(113, 124, 150, 0.32);\n  --app-menu-shadow: rgba(18, 39, 68, 0.12);\n}\n.app-menu__palette--brand {\n  --app-menu-bg: var(--deployment-control-primary-background, #fff);\n  --app-menu-bg-hover: color-mix( in srgb, var(--deployment-control-primary-background, #fff) 92%, var(--deployment-control-primary-text, #6843d8) );\n  --app-menu-bg-strong: var(--deployment-control-primary-background, #fff);\n  --app-menu-action-bg: var(--deployment-control-primary-background, #fff);\n  --app-menu-action-bg-hover: color-mix( in srgb, var(--deployment-control-primary-background, #fff) 92%, var(--deployment-control-primary-text, #6843d8) );\n  --app-menu-action-fg: var(--deployment-control-primary-text, #6843d8);\n  --app-menu-action-border: transparent;\n  --app-menu-action-shadow: 0 10px 20px color-mix( in srgb, var(--deployment-brand-shadow, rgba(71, 38, 138, 0.26)) 76%, transparent );\n  --app-menu-border: transparent;\n  --app-menu-fg: var(--deployment-control-primary-text, #6843d8);\n  --app-menu-icon: var(--deployment-control-primary-text, #6843d8);\n  --app-menu-line: color-mix(in srgb, var(--deployment-control-primary-text, #6843d8) 28%, transparent);\n  --app-menu-shadow: var(--deployment-brand-shadow, rgba(71, 38, 138, 0.26));\n}\n.app-menu__palette--ink {\n  --app-menu-bg:\n    linear-gradient(\n      135deg,\n      #242832 0%,\n      #0f1117 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      135deg,\n      #2d323e 0%,\n      #151820 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      135deg,\n      #171a21 0%,\n      #07080b 100%);\n  --app-menu-action-bg:\n    linear-gradient(\n      135deg,\n      #171a21 0%,\n      #07080b 100%);\n  --app-menu-action-bg-hover:\n    linear-gradient(\n      135deg,\n      #20242d 0%,\n      #0b0d12 100%);\n  --app-menu-action-fg: #fff;\n  --app-menu-action-border: transparent;\n  --app-menu-action-shadow: 0 9px 20px rgba(4, 6, 10, 0.34);\n  --app-menu-border: rgba(255, 255, 255, 0.12);\n  --app-menu-fg: #fff;\n  --app-menu-icon: #fff;\n  --app-menu-line: rgba(255, 255, 255, 0.2);\n  --app-menu-shadow: rgba(4, 6, 10, 0.34);\n}\n.app-menu__palette--offline {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #64748b 0%,\n      #475569 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #718198 0%,\n      #526175 100%);\n  --app-menu-bg-strong: var(--app-menu-bg);\n  --app-menu-action-bg: var(--app-menu-bg);\n  --app-menu-action-bg-hover: var(--app-menu-bg-hover);\n  --app-menu-action-fg: #fff;\n  --app-menu-action-border: #475569;\n  --app-menu-action-shadow: none;\n  --app-menu-border: #475569;\n  --app-menu-fg: #fff;\n  --app-menu-icon: #fff;\n  --app-menu-line: rgba(255, 255, 255, 0.3);\n  --app-menu-shadow: rgba(51, 65, 85, 0.24);\n}\n.app-menu__palette--slate,\n.app-menu__palette--muted {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #f4f6f9 0%,\n      #e7edf4 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #f9fbfd 0%,\n      #edf2f7 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #7d8ba0 0%,\n      #5e6c80 100%);\n  --app-menu-action-bg: #eef3f8;\n  --app-menu-action-bg-hover: #e8eef6;\n  --app-menu-action-fg: #36547d;\n  --app-menu-action-border: transparent;\n  --app-menu-action-shadow: none;\n  --app-menu-border: rgba(82, 101, 126, 0.28);\n  --app-menu-fg: #536174;\n  --app-menu-icon: #64748a;\n  --app-menu-line: rgba(82, 101, 126, 0.3);\n  --app-menu-shadow: rgba(57, 70, 88, 0.2);\n}\n.app-menu__palette--blue {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #f2f7ff 0%,\n      #e3efff 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #f7fbff 0%,\n      #dcecff 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #4f87cf 0%,\n      #3169ae 100%);\n  --app-menu-action-bg:\n    linear-gradient(\n      135deg,\n      #3f7bc8 0%,\n      #7556d8 100%);\n  --app-menu-action-bg-hover:\n    linear-gradient(\n      135deg,\n      #4a87d5 0%,\n      #8061e2 100%);\n  --app-menu-action-fg: #fff;\n  --app-menu-action-border: transparent;\n  --app-menu-action-shadow: 0 12px 24px rgba(60, 92, 167, 0.24);\n  --app-menu-border: rgba(58, 115, 184, 0.32);\n  --app-menu-fg: #2b5d98;\n  --app-menu-icon: #3f74b2;\n  --app-menu-line: rgba(45, 94, 168, 0.34);\n  --app-menu-shadow: rgba(34, 91, 160, 0.2);\n}\n.app-menu__palette--sky {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #eef8ff 0%,\n      #ddf0fb 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #f5fbff 0%,\n      #d6ecfa 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #47a8d1 0%,\n      #2d82ad 100%);\n  --app-menu-border: rgba(55, 139, 183, 0.34);\n  --app-menu-fg: #276b91;\n  --app-menu-icon: #2f86b0;\n  --app-menu-line: rgba(55, 139, 183, 0.34);\n  --app-menu-shadow: rgba(37, 119, 161, 0.2);\n}\n.app-menu__palette--cyan {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #eefdff 0%,\n      #d9f4f9 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #f6feff 0%,\n      #d2f0f6 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #39aabb 0%,\n      #238493 100%);\n  --app-menu-border: rgba(45, 142, 154, 0.32);\n  --app-menu-fg: #1f7280;\n  --app-menu-icon: #2f8e9d;\n  --app-menu-line: rgba(45, 142, 154, 0.34);\n  --app-menu-shadow: rgba(28, 118, 130, 0.2);\n}\n.app-menu__palette--teal {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #edfafa 0%,\n      #ddf1f2 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #f4ffff 0%,\n      #d5eeee 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #3aa3a1 0%,\n      #247f7b 100%);\n  --app-menu-border: rgba(45, 120, 130, 0.28);\n  --app-menu-fg: #2b6a74;\n  --app-menu-icon: #2b7d84;\n  --app-menu-line: rgba(45, 120, 130, 0.32);\n  --app-menu-shadow: rgba(31, 105, 112, 0.2);\n}\n.app-menu__palette--green,\n.app-menu__palette--success {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #edf9f4 0%,\n      #e1f3ea 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #f5fcf9 0%,\n      #d9efe4 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #3aa968 0%,\n      #2f8d57 100%);\n  --app-menu-action-bg:\n    linear-gradient(\n      180deg,\n      #edf9f4 0%,\n      #e1f3ea 100%);\n  --app-menu-action-bg-hover:\n    linear-gradient(\n      180deg,\n      #f5fcf9 0%,\n      #d9efe4 100%);\n  --app-menu-action-fg: #236d51;\n  --app-menu-action-border: rgba(37, 127, 95, 0.28);\n  --app-menu-action-shadow: 0 5px 14px rgba(35, 118, 72, 0.14);\n  --app-menu-border: rgba(37, 127, 95, 0.28);\n  --app-menu-fg: #236d51;\n  --app-menu-icon: #2f8a54;\n  --app-menu-line: rgba(47, 143, 102, 0.34);\n  --app-menu-shadow: rgba(35, 118, 72, 0.22);\n}\n.app-menu__palette--mint {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #effbf5 0%,\n      #dff2e8 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #f6fdf9 0%,\n      #d8efe2 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #51b883 0%,\n      #358f63 100%);\n  --app-menu-border: rgba(46, 142, 91, 0.32);\n  --app-menu-fg: #276348;\n  --app-menu-icon: #37865a;\n  --app-menu-line: rgba(46, 142, 91, 0.34);\n  --app-menu-shadow: rgba(46, 142, 91, 0.2);\n}\n.app-menu__palette--violet {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #f3ecff 0%,\n      #e9ddff 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #f9f5ff 0%,\n      #e4d5ff 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #8a66d2 0%,\n      #6948b1 100%);\n  --app-menu-border: rgba(122, 76, 196, 0.38);\n  --app-menu-fg: #65459b;\n  --app-menu-icon: #7a4cc4;\n  --app-menu-line: rgba(106, 69, 163, 0.34);\n  --app-menu-shadow: rgba(92, 62, 150, 0.2);\n}\n.app-menu__palette--purple {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #f6efff 0%,\n      #ede2ff 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fbf7ff 0%,\n      #e8daff 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #8061c8 0%,\n      #5f3d98 100%);\n  --app-menu-border: rgba(109, 74, 172, 0.34);\n  --app-menu-fg: #5f3d98;\n  --app-menu-icon: #7358b0;\n  --app-menu-line: rgba(109, 74, 172, 0.34);\n  --app-menu-shadow: rgba(88, 55, 146, 0.2);\n}\n.app-menu__palette--pink {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #fff0f4 0%,\n      #fde6ee 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fff7fa 0%,\n      #fbdde8 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #d76d8e 0%,\n      #b84f72 100%);\n  --app-menu-border: rgba(184, 92, 116, 0.4);\n  --app-menu-fg: #94415f;\n  --app-menu-icon: #b85072;\n  --app-menu-line: rgba(184, 92, 116, 0.34);\n  --app-menu-shadow: rgba(155, 58, 86, 0.2);\n}\n.app-menu__palette--rose {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #ffe4eb 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fff8fa 0%,\n      #ffdce7 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #cb5272 0%,\n      #a83a58 100%);\n  --app-menu-border: rgba(178, 69, 98, 0.38);\n  --app-menu-fg: #8c2e49;\n  --app-menu-icon: #b94462;\n  --app-menu-line: rgba(178, 69, 98, 0.32);\n  --app-menu-shadow: rgba(137, 45, 70, 0.22);\n}\n.app-menu__palette--red,\n.app-menu__palette--danger {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #fff1f2 0%,\n      #ffe5e7 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fff8f9 0%,\n      #ffdde0 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #e24955 0%,\n      #c93240 100%);\n  --app-menu-border: rgba(188, 54, 67, 0.38);\n  --app-menu-fg: #a43c45;\n  --app-menu-icon: #c13f4b;\n  --app-menu-line: rgba(188, 54, 67, 0.34);\n  --app-menu-shadow: rgba(163, 36, 48, 0.24);\n}\n.app-menu__palette--orange {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #fff7f0 0%,\n      #fee9da 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fffaf6 0%,\n      #fee2cd 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #df8a42 0%,\n      #bd672b 100%);\n  --app-menu-border: rgba(183, 95, 47, 0.34);\n  --app-menu-fg: #87542a;\n  --app-menu-icon: #d07d33;\n  --app-menu-line: rgba(189, 101, 42, 0.34);\n  --app-menu-shadow: rgba(157, 95, 24, 0.24);\n}\n.app-menu__palette--amber,\n.app-menu__palette--warning {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #fff7e8 0%,\n      #ffe9c6 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fffaf2 0%,\n      #ffe3b7 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #e6a63a 0%,\n      #c68124 100%);\n  --app-menu-border: rgba(190, 127, 37, 0.38);\n  --app-menu-fg: #865a1f;\n  --app-menu-icon: #c17b22;\n  --app-menu-line: rgba(190, 127, 37, 0.34);\n  --app-menu-shadow: rgba(157, 95, 24, 0.24);\n}\n.app-menu__palette--gold {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #fff7df 0%,\n      #ffedbb 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fffaf0 0%,\n      #ffe6a8 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #dfb13f 0%,\n      #bf8b22 100%);\n  --app-menu-border: rgba(189, 141, 51, 0.42);\n  --app-menu-fg: #835d14;\n  --app-menu-icon: #c8921e;\n  --app-menu-line: rgba(189, 141, 51, 0.34);\n  --app-menu-shadow: rgba(157, 111, 24, 0.22);\n}\n.app-menu__palette--brown {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #fff5ec 0%,\n      #feead9 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fffaf5 0%,\n      #fee2ca 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #ad7040 0%,\n      #8a5428 100%);\n  --app-menu-border: rgba(151, 92, 41, 0.3);\n  --app-menu-fg: #8a5428;\n  --app-menu-icon: #9a6229;\n  --app-menu-line: rgba(154, 98, 41, 0.34);\n  --app-menu-shadow: rgba(132, 78, 31, 0.22);\n}\n.app-menu__palette--filter {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #eefbf4 0%,\n      #dff2e8 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #f7fdf9 0%,\n      #d8efdf 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #43ad73 0%,\n      #2f8d57 100%);\n  --app-menu-border: rgba(50, 142, 91, 0.3);\n  --app-menu-fg: #236d51;\n  --app-menu-icon: #2f8a54;\n  --app-menu-line: rgba(48, 143, 93, 0.34);\n  --app-menu-shadow: rgba(34, 118, 72, 0.2);\n}\n.app-menu__palette--aries {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #fff5f2 0%,\n      #ffe9e4 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fff9f7 0%,\n      #ffdfd7 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #cf624c 0%,\n      #9b3f2c 100%);\n  --app-menu-border: rgba(155, 63, 44, 0.34);\n  --app-menu-fg: #9b3f2c;\n  --app-menu-icon: #b34f39;\n  --app-menu-line: rgba(155, 63, 44, 0.32);\n  --app-menu-shadow: rgba(155, 63, 44, 0.16);\n}\n.app-menu__palette--taurus {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #f5fbf2 0%,\n      #e6f5e1 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fbfef9 0%,\n      #ddefd7 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #64a857 0%,\n      #3d7a31 100%);\n  --app-menu-border: rgba(61, 122, 49, 0.32);\n  --app-menu-fg: #3d7a31;\n  --app-menu-icon: #4f8f42;\n  --app-menu-line: rgba(61, 122, 49, 0.3);\n  --app-menu-shadow: rgba(61, 122, 49, 0.16);\n}\n.app-menu__palette--gemini {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #fffbed 0%,\n      #fff3c4 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fffef6 0%,\n      #ffedb2 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #c9a733 0%,\n      #806219 100%);\n  --app-menu-border: rgba(128, 98, 25, 0.34);\n  --app-menu-fg: #806219;\n  --app-menu-icon: #9f7b20;\n  --app-menu-line: rgba(128, 98, 25, 0.32);\n  --app-menu-shadow: rgba(128, 98, 25, 0.16);\n}\n.app-menu__palette--cancer {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #f3fcff 0%,\n      #e1f6fb 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #f9feff 0%,\n      #d5f0f8 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #49a8bd 0%,\n      #237083 100%);\n  --app-menu-border: rgba(35, 112, 131, 0.32);\n  --app-menu-fg: #237083;\n  --app-menu-icon: #32899f;\n  --app-menu-line: rgba(35, 112, 131, 0.32);\n  --app-menu-shadow: rgba(35, 112, 131, 0.16);\n}\n.app-menu__palette--leo {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #fff9eb 0%,\n      #ffedbd 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fffdf5 0%,\n      #ffe6a7 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #d8942d 0%,\n      #975d12 100%);\n  --app-menu-border: rgba(151, 93, 18, 0.36);\n  --app-menu-fg: #975d12;\n  --app-menu-icon: #b47118;\n  --app-menu-line: rgba(151, 93, 18, 0.32);\n  --app-menu-shadow: rgba(151, 93, 18, 0.16);\n}\n.app-menu__palette--virgo {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #fbfdec 0%,\n      #eef5cf 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fefff6 0%,\n      #e7efc1 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #91a74a 0%,\n      #62752b 100%);\n  --app-menu-border: rgba(98, 117, 43, 0.32);\n  --app-menu-fg: #62752b;\n  --app-menu-icon: #778c37;\n  --app-menu-line: rgba(98, 117, 43, 0.32);\n  --app-menu-shadow: rgba(98, 117, 43, 0.16);\n}\n.app-menu__palette--libra {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #fff5fa 0%,\n      #fde4f0 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fffafd 0%,\n      #fad9ea 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #d76d9d 0%,\n      #9a3f70 100%);\n  --app-menu-border: rgba(154, 63, 112, 0.34);\n  --app-menu-fg: #9a3f70;\n  --app-menu-icon: #b55183;\n  --app-menu-line: rgba(154, 63, 112, 0.32);\n  --app-menu-shadow: rgba(154, 63, 112, 0.16);\n}\n.app-menu__palette--scorpio {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #fbf4ff 0%,\n      #f0e0fa 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fefaff 0%,\n      #ead5f7 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #9257b0 0%,\n      #663285 100%);\n  --app-menu-border: rgba(102, 50, 133, 0.34);\n  --app-menu-fg: #663285;\n  --app-menu-icon: #7b419d;\n  --app-menu-line: rgba(102, 50, 133, 0.32);\n  --app-menu-shadow: rgba(102, 50, 133, 0.16);\n}\n.app-menu__palette--sagittarius {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #f7f4ff 0%,\n      #ebe3ff 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fcfaff 0%,\n      #e4d8ff 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #7f63d4 0%,\n      #553ca0 100%);\n  --app-menu-border: rgba(85, 60, 160, 0.34);\n  --app-menu-fg: #553ca0;\n  --app-menu-icon: #674db8;\n  --app-menu-line: rgba(85, 60, 160, 0.32);\n  --app-menu-shadow: rgba(85, 60, 160, 0.16);\n}\n.app-menu__palette--capricorn {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #fcf6f0 0%,\n      #f3e6d8 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fffbf7 0%,\n      #eedcc9 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #9b7657 0%,\n      #705032 100%);\n  --app-menu-border: rgba(112, 80, 50, 0.34);\n  --app-menu-fg: #705032;\n  --app-menu-icon: #866340;\n  --app-menu-line: rgba(112, 80, 50, 0.32);\n  --app-menu-shadow: rgba(112, 80, 50, 0.16);\n}\n.app-menu__palette--aquarius {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #f4f9ff 0%,\n      #e3f0ff 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #fbfdff 0%,\n      #d8eaff 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #4f86c8 0%,\n      #2c5f9f 100%);\n  --app-menu-border: rgba(44, 95, 159, 0.34);\n  --app-menu-fg: #2c5f9f;\n  --app-menu-icon: #3d74b3;\n  --app-menu-line: rgba(44, 95, 159, 0.32);\n  --app-menu-shadow: rgba(44, 95, 159, 0.16);\n}\n.app-menu__palette--pisces {\n  --app-menu-bg:\n    linear-gradient(\n      180deg,\n      #f3fcfa 0%,\n      #def3ef 100%);\n  --app-menu-bg-hover:\n    linear-gradient(\n      180deg,\n      #f9fffd 0%,\n      #d3eee9 100%);\n  --app-menu-bg-strong:\n    linear-gradient(\n      180deg,\n      #45a99b 0%,\n      #277268 100%);\n  --app-menu-border: rgba(39, 114, 104, 0.34);\n  --app-menu-fg: #277268;\n  --app-menu-icon: #348a7f;\n  --app-menu-line: rgba(39, 114, 104, 0.32);\n  --app-menu-shadow: rgba(39, 114, 104, 0.16);\n}\n.app-menu__trigger {\n  appearance: none;\n  -webkit-appearance: none;\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.34rem;\n  min-width: 2.25rem;\n  min-height: 2.25rem;\n  border: 1px solid var(--app-menu-border);\n  border-radius: 999px;\n  padding: 0.42rem 0.58rem;\n  background: var(--app-menu-bg);\n  color: var(--app-menu-fg);\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 800;\n  line-height: 1.22;\n  cursor: pointer;\n  box-shadow: 0 8px 18px var(--app-menu-shadow);\n  overflow: visible;\n  isolation: isolate;\n  transition:\n    transform 0.14s ease,\n    box-shadow 0.14s ease,\n    border-color 0.14s ease,\n    background 0.14s ease,\n    color 0.14s ease,\n    filter 0.14s ease;\n}\n.app-menu__trigger-wave-surface {\n  position: absolute;\n  inset: 0;\n  z-index: 0;\n  overflow: hidden;\n  border-radius: inherit;\n  pointer-events: none;\n}\n.app-menu__trigger > .mat-icon,\n.app-menu__trigger > .app-menu__trigger-image,\n.app-menu__trigger > .app-menu__trigger-label,\n.app-menu__trigger > .app-menu__trigger-caret {\n  position: relative;\n  z-index: 1;\n}\n:host(.app-menu-host--compact) .app-menu__trigger {\n  gap: var(--app-menu-compact-trigger-gap);\n  min-width: 0;\n  padding-inline: var(--app-menu-compact-trigger-padding-inline);\n  font-size: var(--app-menu-compact-trigger-font-size);\n}\n:host(.app-menu-host--compact) .app-menu__trigger .mat-icon,\n:host(.app-menu-host--compact) .app-menu__trigger-caret {\n  width: var(--app-menu-compact-trigger-icon-size);\n  height: var(--app-menu-compact-trigger-icon-size);\n  font-size: var(--app-menu-compact-trigger-icon-size);\n  line-height: var(--app-menu-compact-trigger-icon-size);\n}\n.app-menu__trigger:hover {\n  background: var(--app-menu-bg-hover);\n  box-shadow: 0 10px 22px var(--app-menu-shadow);\n  filter: brightness(1.02);\n}\n.app-menu__trigger:active {\n  transform: translateY(1px);\n  box-shadow: 0 7px 16px var(--app-menu-shadow);\n}\n.app-menu__trigger:disabled {\n  cursor: default;\n  opacity: 0.58;\n  filter: grayscale(0.2);\n  box-shadow: none;\n}\n.app-menu__trigger--open {\n  filter: brightness(0.98);\n}\n.app-menu__trigger--label-hidden {\n  width: 2.25rem;\n  height: 2.25rem;\n  padding: 0;\n}\n@media (max-width: 760px) {\n  .app-menu__trigger--collapsible {\n    width: 2.25rem;\n    height: 2.25rem;\n    padding: 0;\n    gap: 0;\n  }\n  .app-menu__trigger--collapsible .app-menu__trigger-label,\n  .app-menu__trigger--collapsible .app-menu__trigger-caret {\n    display: none;\n  }\n}\n.app-menu__trigger--layout-icon {\n  display: inline-grid;\n  place-items: center;\n  width: 34px;\n  height: 34px;\n  min-width: 34px;\n  min-height: 34px;\n  border: 1px solid var(--app-menu-border);\n  padding: 0;\n  background: var(--app-menu-bg);\n  box-shadow: none;\n  color: var(--app-menu-icon);\n}\n.app-menu__trigger--layout-icon:hover {\n  background: var(--app-menu-bg-hover);\n  box-shadow: 0 2px 8px rgba(26, 43, 69, 0.15);\n  color: var(--app-menu-icon);\n  filter: none;\n  transform: none;\n}\n.app-menu__trigger--layout-icon:active {\n  box-shadow: none;\n  transform: scale(0.95);\n}\n.app-menu__trigger--layout-icon.app-menu__trigger--open {\n  background: var(--app-menu-bg-hover);\n  color: var(--app-menu-icon);\n  filter: none;\n  box-shadow: 0 4px 10px rgba(21, 39, 68, 0.16);\n  transform: none;\n}\n:host(.app-menu-host--kind-fab) .app-menu__trigger--layout-icon {\n  width: 42px;\n  height: 42px;\n  min-width: 42px;\n  min-height: 42px;\n  border-radius: 50%;\n  box-shadow: 0 8px 18px var(--app-menu-shadow);\n}\n:host(.app-menu-host--draggable) {\n  will-change: transform;\n}\n:host(.app-menu-host--draggable) .app-menu__trigger--layout-icon {\n  cursor: var(--app-menu-draggable-cursor, grab);\n  touch-action: none;\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  user-select: none;\n}\n:host(.app-menu-host--dragging) .app-menu__trigger--layout-icon {\n  cursor: grabbing;\n}\n:host(.app-menu-host--dragging) .app-menu__trigger--layout-icon:active {\n  transform: none;\n}\n:host(.app-menu-host--kind-fab) .app-menu__trigger--layout-icon:hover {\n  box-shadow: 0 10px 22px var(--app-menu-shadow);\n}\n:host(.app-menu-host--kind-fab) .app-menu__trigger--layout-icon.app-menu__trigger--open {\n  box-shadow: 0 8px 18px var(--app-menu-shadow);\n}\n:host(.app-menu-host--kind-fab) .app-menu__trigger--layout-icon .mat-icon {\n  width: 20px;\n  height: 20px;\n  font-size: 20px;\n  line-height: 20px;\n}\n.app-menu__trigger .mat-icon {\n  width: 1.14rem;\n  height: 1.14rem;\n  font-size: 1.14rem;\n  line-height: 1.14rem;\n  color: var(--app-menu-icon);\n}\n.app-menu__trigger-image,\n.app-menu__item-image {\n  box-sizing: border-box;\n  display: inline-flex;\n  flex: 0 0 auto;\n  align-items: center;\n  justify-content: center;\n  overflow: hidden;\n  border: 1px solid rgba(255, 255, 255, 0.76);\n  border-radius: 7px;\n  background: rgba(255, 255, 255, 0.78);\n  color: var(--app-menu-fg);\n  font-weight: 900;\n  line-height: 1;\n}\n.app-menu__trigger-image {\n  width: 2.4rem;\n  height: 1.36rem;\n  padding: 0.12rem;\n}\n.app-menu__trigger-image img,\n.app-menu__item-image img {\n  display: block;\n  width: 100%;\n  height: 100%;\n  object-fit: contain;\n  pointer-events: none;\n}\n.app-menu__trigger-image > span,\n.app-menu__item-image > span {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n}\n.app-menu__trigger-image > [hidden],\n.app-menu__item-image > [hidden] {\n  display: none;\n}\n:host(.app-menu-host--compact) .app-menu__trigger-image {\n  width: 2.1rem;\n  height: 1.18rem;\n}\n.app-menu__trigger-icon--symbol,\n.app-menu__item-icon--symbol {\n  font-family:\n    "Noto Sans Symbols 2",\n    "Noto Sans Symbols",\n    "Segoe UI Symbol",\n    sans-serif;\n  font-weight: 700;\n}\n.app-menu__trigger--layout-icon > .mat-icon:not(.app-menu__trigger-caret) {\n  grid-area: 1/1;\n  justify-self: center;\n  margin: 0;\n  position: relative;\n  z-index: 1;\n  transform-origin: center;\n  transition:\n    transform 0.18s cubic-bezier(0.22, 0.61, 0.36, 1),\n    opacity 0.14s ease,\n    filter 0.14s ease;\n}\n.app-menu__trigger--layout-icon.app-menu__trigger--open > .mat-icon:not(.app-menu__trigger-caret) {\n  transform: rotate(90deg);\n}\n.app-menu__trigger--layout-icon .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  color: currentColor;\n}\n.app-menu__trigger-label {\n  min-width: 0;\n  line-height: 1.22;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.app-menu__trigger-caret {\n  transition: transform 0.16s ease;\n}\n.app-menu__trigger--open .app-menu__trigger-caret:not(.app-menu__trigger-caret--static) {\n  transform: rotate(180deg);\n}\n:host(.app-menu-host--kind-select.app-menu-host--trigger-field) .app-menu__trigger,\n:host(.app-menu-host--model-layout-tabs.app-menu-host--trigger-field) .app-menu__trigger {\n  width: 100%;\n  min-width: 0;\n  min-height: 34px;\n  border: 1px solid var(--app-menu-border);\n  border-radius: 8px;\n  padding: 0 0.52rem;\n  background: var(--app-menu-bg);\n  color: var(--app-menu-fg);\n  box-shadow: none;\n  justify-content: space-between;\n  font-size: 0.82rem;\n  font-weight: 800;\n}\n:host(.app-menu-host--kind-select.app-menu-host--trigger-field) .app-menu__trigger:hover,\n:host(.app-menu-host--kind-select.app-menu-host--trigger-field) .app-menu__trigger--open,\n:host(.app-menu-host--model-layout-tabs.app-menu-host--trigger-field) .app-menu__trigger:hover,\n:host(.app-menu-host--model-layout-tabs.app-menu-host--trigger-field) .app-menu__trigger--open {\n  border-color: var(--app-menu-border);\n  background: var(--app-menu-bg-hover);\n  box-shadow: none;\n  filter: none;\n}\n:host(.app-menu-host--kind-select.app-menu-host--trigger-field) .app-menu__trigger--placeholder,\n:host(.app-menu-host--model-layout-tabs.app-menu-host--trigger-field) .app-menu__trigger--placeholder {\n  border-color: rgba(211, 124, 36, 0.52);\n  background:\n    linear-gradient(\n      180deg,\n      #fff8ed 0%,\n      #fff0d8 100%);\n  color: #9b611e;\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.72), 0 0 0 1px rgba(235, 156, 55, 0.16);\n}\n:host(.app-menu-host--kind-select.app-menu-host--trigger-field) .app-menu__trigger--placeholder:hover,\n:host(.app-menu-host--kind-select.app-menu-host--trigger-field) .app-menu__trigger--placeholder.app-menu__trigger--open,\n:host(.app-menu-host--model-layout-tabs.app-menu-host--trigger-field) .app-menu__trigger--placeholder:hover,\n:host(.app-menu-host--model-layout-tabs.app-menu-host--trigger-field) .app-menu__trigger--placeholder.app-menu__trigger--open {\n  border-color: rgba(205, 111, 22, 0.66);\n  background:\n    linear-gradient(\n      180deg,\n      #fff5e5 0%,\n      #ffe9c7 100%);\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.78), 0 0 0 3px rgba(240, 151, 35, 0.12);\n}\n:host(.app-menu-host--kind-select.app-menu-host--trigger-field) .app-menu__trigger--placeholder .mat-icon,\n:host(.app-menu-host--model-layout-tabs.app-menu-host--trigger-field) .app-menu__trigger--placeholder .mat-icon,\n:host(.app-menu-host--kind-select.app-menu-host--trigger-field) .app-menu__trigger--placeholder .app-menu__trigger-caret,\n:host(.app-menu-host--model-layout-tabs.app-menu-host--trigger-field) .app-menu__trigger--placeholder .app-menu__trigger-caret {\n  color: #b46718;\n}\n:host(.app-menu-host--kind-select.app-menu-host--trigger-field) .app-menu__trigger:active,\n:host(.app-menu-host--model-layout-tabs.app-menu-host--trigger-field) .app-menu__trigger:active {\n  transform: none;\n  box-shadow: none;\n}\n:host(.app-menu-host--kind-select.app-menu-host--trigger-field) .app-menu__trigger-label,\n:host(.app-menu-host--model-layout-tabs.app-menu-host--trigger-field) .app-menu__trigger-label {\n  flex: 1 1 auto;\n  text-align: left;\n}\n:host(.app-menu-host--kind-select) .app-menu__trigger-caret,\n:host(.app-menu-host--model-layout-tabs) .app-menu__trigger-caret {\n  flex: 0 0 auto;\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  color: #426a98;\n}\n:host(.app-menu-host--compact.app-menu-host--kind-select) .app-menu__trigger-caret,\n:host(.app-menu-host--compact.app-menu-host--model-layout-tabs) .app-menu__trigger-caret {\n  flex-basis: var(--app-menu-compact-trigger-icon-size);\n  width: var(--app-menu-compact-trigger-icon-size);\n  height: var(--app-menu-compact-trigger-icon-size);\n  font-size: var(--app-menu-compact-trigger-icon-size);\n  line-height: var(--app-menu-compact-trigger-icon-size);\n}\n.app-menu__button-row {\n  display: inline-flex;\n  flex-wrap: var(--app-menu-row-wrap, nowrap);\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.34rem;\n  width: 100%;\n  min-width: 0;\n  overflow: visible;\n}\n:host(.app-menu-host--compact) .app-menu__button-row {\n  gap: var(--app-menu-compact-row-gap);\n}\n.app-menu__button-row-item {\n  appearance: none;\n  -webkit-appearance: none;\n  position: relative;\n  width: 32px;\n  height: 32px;\n  min-width: 32px;\n  min-height: 32px;\n  border: 1px solid var(--app-menu-border);\n  border-radius: 50%;\n  padding: 0;\n  background: var(--app-menu-bg);\n  color: var(--app-menu-icon);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  transition:\n    transform 0.16s ease,\n    background-color 0.16s ease,\n    color 0.16s ease,\n    filter 0.16s ease,\n    box-shadow 0.16s ease;\n}\n.app-menu__button-row-item .mat-icon {\n  position: relative;\n  z-index: 3;\n  flex: 0 0 18px;\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  color: currentColor;\n}\n.app-menu__button-row-ring {\n  position: absolute;\n  inset: -1px;\n  z-index: 2;\n  border-radius: inherit;\n  pointer-events: none;\n}\n.app-menu__button-row-item--progress {\n  overflow: visible;\n}\n.app-menu__button-row-item--labelled {\n  flex: 1 1 auto;\n  width: var(--app-menu-row-item-width, auto);\n  justify-content: var(--app-menu-row-item-justify, center);\n  min-width: 118px;\n  height: 36px;\n  min-height: 36px;\n  border: 1px solid var(--app-menu-border);\n  border-radius: 999px;\n  gap: 0.34rem;\n  padding: 0 0.66rem;\n  background: var(--app-menu-bg);\n  color: var(--app-menu-fg);\n  font-size: 0.76rem;\n  font-weight: 900;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.76);\n}\n:host(.app-menu-host--compact) .app-menu__button-row-item--labelled {\n  min-width: var(--app-menu-compact-row-item-min-width);\n  gap: var(--app-menu-compact-row-item-gap);\n  padding-inline: var(--app-menu-compact-row-item-padding-inline);\n  font-size: var(--app-menu-compact-row-item-font-size);\n}\n:host(.app-menu-host--compact) .app-menu__button-row-item .mat-icon,\n:host(.app-menu-host--compact) .app-menu__button-row-caret {\n  flex-basis: var(--app-menu-compact-row-item-icon-size);\n  width: var(--app-menu-compact-row-item-icon-size);\n  height: var(--app-menu-compact-row-item-icon-size);\n  font-size: var(--app-menu-compact-row-item-icon-size);\n  line-height: var(--app-menu-compact-row-item-icon-size);\n}\n.app-menu__button-row-item--action {\n  border-color: rgba(31, 63, 105, 0.18);\n  background: var(--app-menu-bg-strong);\n  color: #fff;\n  box-shadow: 0 5px 14px rgba(12, 24, 40, 0.16);\n}\n.app-menu__button-row-item--image {\n  width: var(--app-menu-image-button-size, 42px);\n  height: var(--app-menu-image-button-size, 42px);\n  min-width: var(--app-menu-image-button-size, 42px);\n  min-height: var(--app-menu-image-button-size, 42px);\n  border: 0;\n  background: transparent;\n  color: #fff;\n  box-shadow: 0 6px 16px rgba(16, 30, 56, 0.2);\n  overflow: visible;\n}\n.app-menu__button-row-item--image-stack {\n  flex: 0 0 auto;\n  width: auto;\n  min-width: var(--app-menu-image-stack-min-width, 0);\n  height: var(--app-menu-image-stack-height, 34px);\n  min-height: var(--app-menu-image-stack-height, 34px);\n  max-height: var(--app-menu-image-stack-height, 34px);\n  border-radius: 999px;\n  padding: var(--app-menu-image-stack-padding, 1px);\n  background: var(--app-menu-image-stack-bg, linear-gradient(180deg, #f7fbff 0%, #edf4ff 100%));\n  border-color: var(--app-menu-image-stack-border, rgba(48, 85, 138, 0.34));\n  color: var(--app-menu-image-stack-fg, #2c5f9b);\n  box-shadow: var(--app-menu-image-stack-shadow, 0 2px 8px rgba(31, 79, 132, 0.18));\n  overflow: visible;\n}\n.app-menu__button-row-item--image .app-menu__button-row-ring {\n  inset: var(--app-menu-image-ring-inset, -4px);\n}\n.app-menu__button-row-image {\n  position: relative;\n  z-index: 3;\n  width: 100%;\n  height: 100%;\n  border-radius: inherit;\n  overflow: hidden;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  background: var(--app-menu-bg-strong);\n  color: #fff;\n  font-size: 0.78rem;\n  font-weight: 900;\n  line-height: 1;\n  text-transform: uppercase;\n}\n.app-menu__button-row-item--image .app-menu__counter--trigger {\n  top: var(--app-menu-image-counter-top, -4px);\n  right: var(--app-menu-image-counter-right, -2px);\n  min-width: var(--app-menu-image-counter-size, 22px);\n  height: var(--app-menu-image-counter-size, 22px);\n  font-size: var(--app-menu-image-counter-font-size, 11px);\n  box-shadow: 0 0 0 2px #fff;\n}\n.app-menu__button-row-image img {\n  display: block;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n.app-menu__button-row-image > [hidden] {\n  display: none;\n}\n.app-menu__button-row-image-stack {\n  position: relative;\n  z-index: 3;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex: 0 0 auto;\n  min-width: 0;\n  padding-left: 0;\n}\n.app-menu__button-row-stack-image {\n  flex: 0 0 var(--app-menu-image-stack-avatar-size, 30px);\n  width: var(--app-menu-image-stack-avatar-size, 30px);\n  height: var(--app-menu-image-stack-avatar-size, 30px);\n  min-width: var(--app-menu-image-stack-avatar-size, 30px);\n  min-height: var(--app-menu-image-stack-avatar-size, 30px);\n  border-radius: 50%;\n  border: 2px solid #fff;\n  background: var(--app-menu-bg-strong);\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  overflow: hidden;\n  font-size: 0.62rem;\n  font-weight: 900;\n  line-height: 1;\n  text-transform: uppercase;\n  box-shadow: 0 2px 5px rgba(22, 42, 70, 0.18);\n}\n.app-menu__button-row-stack-image + .app-menu__button-row-stack-image {\n  margin-left: var(--app-menu-image-stack-overlap, -0.58rem);\n}\n.app-menu__button-row-stack-image img {\n  display: block;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n.app-menu__button-row-item--image:not(:disabled):hover {\n  background: transparent;\n}\n.app-menu__button-row-item--image-stack:not(:disabled):hover {\n  background: var(--app-menu-image-stack-hover-bg, linear-gradient(180deg, #edf7ff 0%, #dcecff 100%));\n  border-color: var(--app-menu-image-stack-hover-border, rgba(48, 85, 138, 0.48));\n}\n.app-menu__button-row-item--action.app-menu__button-row-item--labelled {\n  flex: var(--app-menu-action-flex, 0 0 auto);\n  min-width: var(--app-menu-action-min-width, auto);\n  height: var(--app-menu-action-height, 36px);\n  min-height: var(--app-menu-action-height, 36px);\n  border-color: var(--app-menu-action-border, transparent);\n  border-radius: 999px;\n  padding: var(--app-menu-action-padding, 0 0.76rem);\n  background: var(--app-menu-action-bg, var(--app-menu-bg-strong));\n  color: var(--app-menu-action-fg, #fff);\n  font-size: 0.78rem;\n  font-weight: 800;\n  box-shadow: var(--app-menu-action-shadow, 0 10px 22px var(--app-menu-shadow));\n}\n.app-menu__button-row-item--action.app-menu__button-row-item--labelled .app-menu__counter--trigger {\n  position: absolute;\n  top: -0.55rem;\n  right: -0.5rem;\n  min-width: 1.25rem;\n  height: 1.25rem;\n  padding: 0 0.32rem;\n  border-radius: 999px;\n  border: 1px solid #fff;\n  background: #e14454;\n  color: #fff;\n  font-size: 0.62rem;\n  font-weight: 900;\n  line-height: 1;\n  box-shadow: 0 8px 16px rgba(170, 31, 52, 0.24);\n}\n.app-menu__button-row-item--selected-value {\n  max-width: 12rem;\n}\n.app-menu__button-row-item--labelled:hover {\n  background: var(--app-menu-bg);\n}\n.app-menu__button-row-item:not(:disabled):hover {\n  background: var(--app-menu-bg-hover);\n  color: var(--app-menu-icon);\n  transform: translateY(-1px) scale(1.04);\n}\n.app-menu__button-row-item--labelled:not(:disabled):hover {\n  background: var(--app-menu-bg-hover);\n  color: var(--app-menu-fg);\n}\n.app-menu__button-row-item--action:not(:disabled):hover,\n.app-menu__button-row-item--action.app-menu__button-row-item--labelled:not(:disabled):hover {\n  background: var(--app-menu-bg-strong);\n  color: #fff;\n  box-shadow: 0 18px 34px var(--app-menu-shadow);\n}\n.app-menu__button-row-item--action.app-menu__button-row-item--labelled:not(:disabled):hover {\n  background: var(--app-menu-action-bg-hover, var(--app-menu-action-bg, var(--app-menu-bg-strong)));\n  color: var(--app-menu-action-fg, #fff);\n  box-shadow: var(--app-menu-action-shadow, 0 10px 22px var(--app-menu-shadow));\n  filter: brightness(1.02);\n  transform: none;\n}\n.app-menu__button-row-item:not(:disabled):active {\n  transform: scale(0.92);\n}\n.app-menu__button-row-item--action.app-menu__button-row-item--labelled:not(:disabled):active {\n  transform: translateY(1px);\n}\n.app-menu__button-row-item--open {\n  background: var(--app-menu-bg-hover);\n  color: var(--app-menu-icon);\n  transform: translateY(-1px) scale(1.03);\n}\n.app-menu__button-row-item--active {\n  border: 1px solid rgba(31, 63, 105, 0.18);\n  background: var(--app-menu-bg-strong);\n  color: #fff;\n  box-shadow: 0 5px 14px rgba(12, 24, 40, 0.16);\n}\n.app-menu__button-row-item--action.app-menu__button-row-item--labelled.app-menu__button-row-item--active {\n  border-color: rgba(31, 63, 105, 0.18);\n  background: var(--app-menu-bg-strong);\n  color: #fff;\n}\n.app-menu__button-row-item--labelled.app-menu__button-row-item--open {\n  border-color: var(--app-menu-border);\n  background: var(--app-menu-bg-hover);\n  color: var(--app-menu-fg);\n}\n.app-menu__button-row-main {\n  position: relative;\n  z-index: 3;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.34rem;\n  max-width: 100%;\n  min-width: 0;\n}\n:host(.app-menu-host--compact) .app-menu__button-row-main {\n  gap: var(--app-menu-compact-row-item-gap);\n}\n.app-menu__button-row-main .app-menu__button-row-label {\n  flex: 0 1 auto;\n}\n.app-menu__button-row-toggle {\n  position: relative;\n  z-index: 3;\n  margin-left: 0.12rem;\n}\n.app-menu__button-row-label {\n  flex: 1 1 auto;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.app-menu__button-row-caret {\n  flex: 0 0 18px;\n  transition: transform 0.16s ease;\n}\n:host(.app-menu-host--compact) .app-menu__button-row-caret {\n  flex: 0 0 var(--app-menu-compact-row-item-icon-size);\n}\n.app-menu__button-row-item--open .app-menu__button-row-caret {\n  transform: rotate(180deg);\n}\n.app-menu__button-row-item--labelled .app-menu__counter--trigger {\n  position: static;\n  min-width: 22px;\n  height: 22px;\n  border-radius: 999px;\n  padding: 0 5px;\n  background: #e7f1ff;\n  color: #2e5f98;\n  font-size: 0.72rem;\n  box-shadow: none;\n}\n.app-menu__button-row-item--labelled .app-menu__counter--trigger:is(.app-menu__counter--alert, .app-menu__counter--success) {\n  position: absolute;\n  top: var(--app-menu-trigger-counter-top, -0.34rem);\n  right: var(--app-menu-trigger-counter-right, -0.28rem);\n  min-width: var(--app-menu-counter-min-width, 1.22rem);\n  height: var(--app-menu-counter-height, 1.22rem);\n  padding: var(--app-menu-counter-padding, 0 0.32rem);\n  color: #fff;\n}\n.app-menu__button-row-item--labelled .app-menu__counter--trigger.app-menu__counter--alert {\n  background:\n    linear-gradient(\n      180deg,\n      #e24955 0%,\n      #c93240 100%);\n  box-shadow: 0 5px 10px rgba(163, 36, 48, 0.24);\n}\n.app-menu__button-row-item--labelled .app-menu__counter--trigger.app-menu__counter--success {\n  background:\n    linear-gradient(\n      180deg,\n      #2da66f 0%,\n      #208456 100%);\n  box-shadow: 0 5px 10px rgba(26, 119, 76, 0.24);\n}\n.app-menu__button-row-item--labelled:has(.app-menu__counter--alert, .app-menu__counter--success) {\n  overflow: visible;\n}\n.app-menu__button-row-item--active:not(:disabled):hover,\n.app-menu__button-row-item--labelled.app-menu__button-row-item--active:not(:disabled):hover,\n.app-menu__button-row-item--labelled.app-menu__button-row-item--active.app-menu__button-row-item--open {\n  border-color: rgba(31, 63, 105, 0.18);\n  background: var(--app-menu-bg-strong);\n  color: #fff;\n}\n:host(.app-menu-host--inline-row-big) .app-menu {\n  width: 100%;\n}\n:host(.app-menu-host--inline-row-big) .app-menu__button-row {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(185px, 1fr));\n  align-items: stretch;\n  justify-content: stretch;\n  gap: 0.72rem;\n}\n:host(.app-menu-host--inline-row-big) .app-menu__button-row-item,\n:host(.app-menu-host--inline-row-big) .app-menu__button-row-item--labelled,\n:host(.app-menu-host--inline-row-big) .app-menu__button-row-item--active,\n:host(.app-menu-host--inline-row-big) .app-menu__button-row-item--open,\n:host(.app-menu-host--inline-row-big) .app-menu__button-row-item--labelled.app-menu__button-row-item--open,\n:host(.app-menu-host--inline-row-big) .app-menu__button-row-item--labelled.app-menu__button-row-item--active.app-menu__button-row-item--open {\n  width: 100%;\n  min-width: 0;\n  max-width: none;\n  height: auto;\n  min-height: 78px;\n  border: 1px solid var(--app-menu-border);\n  border-radius: 16px;\n  padding: 0.64rem 0.72rem;\n  background: var(--app-menu-bg);\n  color: var(--app-menu-fg);\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: start;\n  justify-content: stretch;\n  gap: 0.42rem;\n  text-align: left;\n  font-size: 0.76rem;\n  font-weight: 800;\n  box-shadow: 0 4px 12px var(--app-menu-shadow);\n}\n:host(.app-menu-host--inline-row-big) .app-menu__button-row-item .mat-icon {\n  width: 20px;\n  height: 20px;\n  font-size: 20px;\n  line-height: 20px;\n  color: var(--app-menu-icon);\n}\n:host(.app-menu-host--inline-row-big) .app-menu__button-row-copy {\n  min-width: 0;\n  display: grid;\n  gap: 0.28rem;\n}\n:host(.app-menu-host--inline-row-big) .app-menu__button-row-label {\n  color: var(--app-menu-fg);\n  font-size: 1.02rem;\n  font-weight: 900;\n  line-height: 1.08;\n}\n:host(.app-menu-host--inline-row-big) .app-menu__button-row-detail {\n  min-width: 0;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  color: rgba(34, 53, 80, 0.86);\n  font-size: 0.74rem;\n  font-weight: 650;\n  line-height: 1.28;\n}\n:host(.app-menu-host--inline-row-big) .app-menu__button-row-detail > span:first-child {\n  min-width: 0;\n  overflow: hidden;\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n  line-clamp: 2;\n  white-space: normal;\n}\n:host(.app-menu-host--inline-row-big) .app-menu__button-row-trailing {\n  min-width: 22px;\n  align-self: start;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  margin-top: 1.18rem;\n}\n:host(.app-menu-host--inline-row-big) .app-menu__button-row-caret {\n  width: 20px;\n  height: 20px;\n  font-size: 20px;\n  line-height: 20px;\n  align-self: center;\n  color: var(--app-menu-icon);\n}\n:host(.app-menu-host--inline-row-big) .app-menu__button-row-item--open .app-menu__button-row-caret {\n  transform: rotate(0deg);\n}\n:host(.app-menu-host--inline-row-big) .app-menu__counter--value-corner {\n  position: absolute;\n  top: -0.34rem;\n  right: -0.28rem;\n  min-width: 22px;\n  height: 22px;\n  padding: 0 5px;\n  font-size: 0.72rem;\n}\n:host(.app-menu-host--inline-row-big) .app-menu__button-row-item--labelled .app-menu__counter--trigger {\n  position: absolute;\n  top: -0.34rem;\n  right: -0.28rem;\n  background:\n    linear-gradient(\n      180deg,\n      #e24955 0%,\n      #c93240 100%);\n  color: #fff;\n  box-shadow: 0 5px 10px rgba(163, 36, 48, 0.24);\n}\n:host(.app-menu-host--inline-row-big) .app-menu__button-row-item:not(:disabled):hover,\n:host(.app-menu-host--inline-row-big) .app-menu__button-row-item--labelled:not(:disabled):hover,\n:host(.app-menu-host--inline-row-big) .app-menu__button-row-item--active:not(:disabled):hover {\n  background: var(--app-menu-bg-hover);\n  color: var(--app-menu-fg);\n  box-shadow: 0 8px 18px var(--app-menu-shadow);\n  transform: translateY(-1px);\n}\n:host(.app-menu-host--inline-row-big) .app-menu__button-row-item:not(:disabled):active {\n  transform: scale(0.99);\n}\n.app-menu__button-row-item:disabled {\n  cursor: default;\n  opacity: 0.52;\n  box-shadow: none;\n  transform: none;\n  pointer-events: none;\n}\n.app-menu__button-row-item--progress:disabled {\n  opacity: 1;\n}\n.app-menu__button-row-item--progress-loading,\n.app-menu__button-row-item--progress-loading:hover,\n.app-menu__button-row-item--progress-loading:disabled {\n  border-color: rgba(181, 117, 23, 0.76);\n  background:\n    linear-gradient(\n      180deg,\n      #ffe7bf 0%,\n      #ffd085 100%);\n  color: #8e4f0d;\n  cursor: wait;\n  box-shadow: none;\n  transform: none;\n  filter: none;\n}\n.app-menu__button-row-item--progress-error,\n.app-menu__button-row-item--progress-error:hover,\n.app-menu__button-row-item--progress-error:disabled {\n  border-color: rgba(176, 31, 46, 0.82);\n  background:\n    linear-gradient(\n      180deg,\n      #f36a79 0%,\n      #d4374a 100%);\n  color: #fff;\n  box-shadow: none;\n  transform: none;\n  filter: none;\n}\n.app-menu__button-row-item--progress-success,\n.app-menu__button-row-item--progress-success:hover,\n.app-menu__button-row-item--progress-success:disabled {\n  border-color: rgba(37, 127, 95, 0.28);\n  background: var(--app-menu-bg-strong);\n  color: #fff;\n}\n.app-menu__panel {\n  position: absolute;\n  top: calc(100% + var(--app-menu-panel-gap, 0.44rem));\n  right: 0;\n  z-index: 42;\n  display: grid;\n  gap: 0.38rem;\n  width: max-content;\n  min-width: 13rem;\n  max-width: min(21rem, 100vw - 1.2rem);\n  max-height: min(28rem, 100vh - 5.5rem, var(--app-menu-panel-available-height, 28rem));\n  overflow-x: hidden;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n  border: 1px solid rgba(36, 64, 98, 0.18);\n  border-radius: 12px;\n  padding: 0.42rem;\n  background: rgba(255, 255, 255, 0.98);\n  box-shadow: 0 18px 44px rgba(13, 29, 52, 0.22);\n  animation: app-menu-panel-in 0.14s ease-out;\n}\n.app-menu__panel--align-start {\n  right: auto;\n  left: 0;\n}\n.app-menu__panel--open-up {\n  top: auto;\n  bottom: calc(100% + var(--app-menu-panel-gap, 0.44rem));\n  animation-name: app-menu-panel-up-in;\n}\n.app-menu__panel--dropdown-list {\n  top: calc(100% + var(--app-menu-panel-gap, 0.26rem));\n  gap: 0.16rem;\n  width: max-content;\n  min-width: 100%;\n  max-width: min(28rem, 100vw - 1.2rem);\n  max-height: min(28rem, 100vh - 5.5rem, var(--app-menu-panel-available-height, 28rem));\n  overflow-x: hidden;\n  overflow-y: auto;\n  border-radius: 14px;\n  padding: 0.35rem;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.99) 0%,\n      rgba(244, 249, 255, 0.99) 100%);\n  box-shadow: 0 10px 26px rgba(16, 32, 58, 0.2);\n}\n.app-menu__panel--fab {\n  min-width: min(15rem, 100vw - 1.2rem);\n  max-width: min(24rem, 100vw - 1.2rem);\n}\n.app-menu__panel--dropdown-list.app-menu__panel--open-up {\n  top: auto;\n  bottom: calc(100% + var(--app-menu-panel-gap, 0.26rem));\n  animation-name: app-menu-panel-up-in;\n}\n.app-menu__panel--dock-to-host,\n.app-menu__panel--dropdown-list.app-menu__panel--dock-to-host {\n  top: 0;\n  bottom: auto;\n}\n.app-menu__panel--dock-to-host.app-menu__panel--open-up,\n.app-menu__panel--dropdown-list.app-menu__panel--dock-to-host.app-menu__panel--open-up {\n  top: auto;\n  bottom: 0;\n}\n:host(.app-menu-host--kind-select.app-menu-host--trigger-field) .app-menu__panel--dropdown-list {\n  left: 0;\n  right: 0;\n  width: 100%;\n  min-width: 100%;\n  max-width: none;\n  border-radius: 8px;\n}\n.app-menu__panel--tabs {\n  width: min(30rem, 100vw - 1.2rem);\n  min-width: min(18rem, 100vw - 1.2rem);\n  max-width: min(30rem, 100vw - 1.2rem);\n  max-height: min(34rem, 100vh - 5.5rem, var(--app-menu-panel-available-height, 34rem));\n  gap: 0.48rem;\n  border-radius: 14px;\n  padding: 0.48rem;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.99) 0%,\n      rgba(245, 249, 255, 0.99) 100%);\n}\n:host(.app-menu-host--model-layout-tabs.app-menu-host--trigger-field) .app-menu__panel--tabs {\n  left: 0;\n  right: 0;\n  width: 100%;\n  min-width: 100%;\n  max-width: none;\n}\n:host(.app-menu-host--layout-grid) .app-menu__panel,\n:host(.app-menu-host--inline-panel) .app-menu__panel {\n  position: static;\n  width: 100%;\n  min-width: 0;\n  max-width: none;\n  max-height: none;\n  overflow: visible;\n  animation: none;\n}\n:host(.app-menu-host--layout-grid) .app-menu__panel {\n  border: 0;\n  border-radius: 0;\n  padding: 0;\n  background: transparent;\n  box-shadow: none;\n}\n:host(.app-menu-host--model-layout-tabs.app-menu-host--inline-panel) .app-menu__panel--tabs {\n  width: 100%;\n  min-width: 0;\n  max-width: none;\n  max-height: none;\n  border-radius: 12px;\n  box-shadow: none;\n}\n:host(.app-menu-host--panel-bottom-docked) .app-menu__panel,\n:host(.app-menu-host--panel-bottom-docked) .app-menu__panel--dropdown-list {\n  position: static;\n  width: 100%;\n  min-width: 0;\n  max-width: none;\n  max-height: none;\n  overflow: visible;\n  border-radius: 12px 12px 0 0;\n  box-shadow: 0 -8px 22px rgba(13, 24, 40, 0.14);\n}\n:host(.app-menu-host--layout-mobile) .app-menu__panel--dropdown-list:not(.app-menu__panel--open-up) .app-menu__items,\n:host(.app-menu-host--layout-mobile) .app-menu__panel--dropdown-list:not(.app-menu__panel--open-up) .app-menu__item-row {\n  width: 100%;\n  min-width: 0;\n  max-width: none;\n}\n:host(.app-menu-host--layout-mobile) .app-menu__panel--dropdown-list:not(.app-menu__panel--open-up) .app-menu__item,\n:host(.app-menu-host--layout-mobile) .app-menu__panel--dropdown-list:not(.app-menu__panel--open-up) .app-menu__branch-back,\n:host(.app-menu-host--layout-mobile) .app-menu__panel--dropdown-list:not(.app-menu__panel--open-up) .app-menu__branch-action {\n  width: 100%;\n  min-width: 0;\n  max-width: none;\n}\n.app-menu__title {\n  padding: 0.34rem 0.42rem 0.18rem;\n  color: rgba(25, 45, 70, 0.7);\n  font-size: 0.74rem;\n  font-weight: 900;\n  text-transform: uppercase;\n}\n.app-menu__items,\n.app-menu__groups {\n  display: grid;\n  gap: 0.22rem;\n}\n.app-menu__panel--dropdown-list .app-menu__items {\n  gap: 0.16rem;\n  width: max-content;\n  min-width: 100%;\n  max-width: min(28rem, 100vw - 1.2rem);\n}\n.app-menu__rate-item {\n  display: block;\n  min-width: 0;\n  padding: 0.1rem;\n}\n.app-menu__rate-item--disabled {\n  opacity: 0.64;\n  pointer-events: none;\n}\n.app-menu__groups {\n  gap: 0.64rem;\n}\n.app-menu__group {\n  display: grid;\n  gap: 0.52rem;\n  min-width: 0;\n}\n.app-menu__group-header {\n  display: flex;\n  align-items: center;\n  gap: 0.52rem;\n  min-width: 0;\n}\n.app-menu__group-badge {\n  min-height: 30px;\n  border-radius: 999px;\n  padding: 0.18rem 0.84rem;\n  border: 1px solid var(--app-menu-border);\n  background: var(--app-menu-bg);\n  color: var(--app-menu-fg);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.28rem;\n  font-size: 0.72rem;\n  font-weight: 900;\n  letter-spacing: 0;\n  text-transform: uppercase;\n  white-space: nowrap;\n}\n.app-menu__group-badge .mat-icon {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n  line-height: 15px;\n  color: var(--app-menu-icon);\n}\n.app-menu__group-line {\n  height: 1px;\n  flex: 1;\n  min-width: 1.5rem;\n  background: var(--app-menu-line);\n}\n.app-menu__tabs {\n  display: grid;\n  gap: 0.48rem;\n  min-width: 0;\n}\n.app-menu__tabs-head {\n  position: relative;\n  z-index: 3;\n  display: flex;\n  align-items: flex-start;\n  gap: 0.42rem;\n  min-width: 0;\n}\n.app-menu__tabs-head .app-menu__tabs-filter {\n  flex: 1 1 auto;\n}\n.app-menu__tabs-tabs {\n  display: flex;\n  gap: 0.28rem;\n  min-width: 0;\n  max-width: 100%;\n  overflow-x: auto;\n  overflow-y: hidden;\n  scrollbar-width: thin;\n  padding: 0.42rem 0.46rem 0.34rem 0.02rem;\n  margin: -0.4rem -0.44rem -0.16rem 0;\n}\n.app-menu__tabs-filter {\n  min-width: 0;\n  min-height: 34px;\n  display: flex;\n  align-items: center;\n  gap: 0.34rem;\n  border: 1px solid var(--app-menu-border);\n  border-radius: 8px;\n  padding: 0 0.42rem;\n  background: var(--app-menu-bg);\n  color: var(--app-menu-fg);\n}\n.app-menu__tabs-filter .mat-icon {\n  flex: 0 0 auto;\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n  color: var(--app-menu-icon);\n}\n.app-menu__tabs-filter-input {\n  min-width: 0;\n  flex: 1 1 auto;\n  border: 0;\n  outline: 0;\n  padding: 0.36rem 0;\n  background: transparent;\n  color: inherit;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 800;\n}\n.app-menu__tabs-filter-input::placeholder {\n  color: var(--app-menu-muted-text);\n}\n.app-menu__tabs-filter-clear {\n  appearance: none;\n  -webkit-appearance: none;\n  flex: 0 0 auto;\n  width: 24px;\n  height: 24px;\n  border: 0;\n  border-radius: 8px;\n  padding: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  background: transparent;\n  color: var(--app-menu-icon);\n  cursor: pointer;\n}\n.app-menu__tabs-filter-clear:hover {\n  background: var(--app-menu-bg-hover);\n}\n.app-menu__tabs-filter-clear .mat-icon {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n  line-height: 15px;\n}\n.app-menu__tabs-tab {\n  appearance: none;\n  -webkit-appearance: none;\n  position: relative;\n  flex: 0 0 auto;\n  min-width: 0;\n  min-height: 34px;\n  border: 1px solid var(--app-menu-border);\n  border-radius: 999px;\n  padding: 0.3rem 0.64rem;\n  background: var(--app-menu-bg);\n  color: var(--app-menu-fg);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.28rem;\n  font: inherit;\n  font-size: 0.74rem;\n  font-weight: 900;\n  letter-spacing: 0;\n  cursor: pointer;\n  white-space: nowrap;\n  transition:\n    background 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    transform 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.app-menu__tabs-tab .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: var(--app-menu-icon);\n}\n.app-menu__tabs-tab:not(:disabled):hover {\n  background: var(--app-menu-bg-hover);\n  color: var(--app-menu-fg);\n  transform: translateY(-1px);\n  box-shadow: 0 3px 10px var(--app-menu-shadow);\n}\n.app-menu__tabs-tab--active,\n.app-menu__tabs-tab--active:not(:disabled):hover {\n  border-color: transparent;\n  background: var(--app-menu-bg-strong);\n  color: #fff;\n  transform: translateY(-1px);\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5), 0 3px 10px var(--app-menu-shadow);\n}\n.app-menu__tabs-tab--active .mat-icon {\n  color: currentColor;\n}\n.app-menu__counter--tabs-tab {\n  position: absolute;\n  top: -0.38rem;\n  right: -0.34rem;\n  min-width: 1.18rem;\n  height: 1.18rem;\n  font-size: 0.64rem;\n  box-shadow: 0 0 0 2px #fff, 0 5px 10px rgba(163, 36, 48, 0.24);\n}\n.app-menu__tabs-panel {\n  min-width: 0;\n}\n.app-menu__tabs-items {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: stretch;\n  gap: var(--app-menu-tabs-items-gap);\n  min-width: 0;\n}\n.app-menu__tabs-items--fixed-columns {\n  display: grid;\n  grid-template-columns: repeat(var(--app-menu-tabs-columns), minmax(0, 1fr));\n}\n.app-menu__tabs-items--icon-list {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(var(--app-menu-icon-list-item-size), 1fr));\n  gap: 0.28rem;\n}\n.app-menu__tabs-item {\n  appearance: none;\n  -webkit-appearance: none;\n  flex: 1 1 var(--app-menu-tabs-item-flex-basis);\n  min-width: min(var(--app-menu-tabs-item-min-width), 100%);\n  min-height: var(--app-menu-tabs-item-min-height);\n  border: 1px solid var(--app-menu-border);\n  border-radius: 9px;\n  padding: var(--app-menu-tabs-item-padding);\n  background: var(--app-menu-bg);\n  color: var(--app-menu-fg);\n  display: flex;\n  align-items: center;\n  gap: 0.34rem;\n  font: inherit;\n  font-size: var(--app-menu-tabs-item-font-size);\n  font-weight: 800;\n  text-align: left;\n  cursor: pointer;\n  transition:\n    background 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    transform 0.14s ease,\n    box-shadow 0.14s ease,\n    filter 0.14s ease;\n}\n.app-menu__tabs-items--fixed-columns .app-menu__tabs-item {\n  width: 100%;\n  min-width: 0;\n}\n.app-menu__tabs-item--layout-icon {\n  flex: 0 0 var(--app-menu-icon-list-item-size);\n  width: 100%;\n  min-width: 0;\n  min-height: var(--app-menu-icon-list-item-size);\n  height: var(--app-menu-icon-list-item-size);\n  justify-content: center;\n  padding: 0;\n  text-align: center;\n}\n:host(.app-menu-host--layout-mobile) .app-menu__tabs-items--fixed-columns {\n  display: flex;\n}\n:host(.app-menu-host--layout-mobile) .app-menu__tabs-items--fixed-columns .app-menu__tabs-item {\n  min-width: min(var(--app-menu-tabs-item-min-width), 100%);\n}\n.app-menu__tabs-item:not(:disabled):not(.app-menu__tabs-item--disabled):hover,\n.app-menu__tabs-item--active {\n  background: var(--app-menu-bg-hover);\n  color: var(--app-menu-fg);\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px var(--app-menu-shadow);\n}\n.app-menu__tabs-item--active {\n  border-color: var(--app-menu-border);\n  background: var(--app-menu-bg-strong);\n  color: #fff;\n  filter: none;\n  box-shadow: 0 6px 14px var(--app-menu-shadow);\n}\n.app-menu__tabs-item--active:not(:disabled):not(.app-menu__tabs-item--disabled):hover {\n  background: var(--app-menu-bg-strong);\n  color: #fff;\n  filter: none;\n}\n.app-menu__tabs-items--icon-list .app-menu__tabs-item--layout-icon {\n  border-color: transparent;\n  background: transparent;\n  color: var(--app-menu-icon);\n  box-shadow: none;\n  filter: none;\n  transform: none;\n}\n.app-menu__tabs-items--icon-list .app-menu__tabs-item--layout-icon:not(:disabled):not(.app-menu__tabs-item--disabled):hover {\n  border-color: transparent;\n  background: transparent;\n  color: var(--app-menu-icon);\n  box-shadow: none;\n  filter: none;\n  transform: none;\n}\n.app-menu__tabs-items--icon-list .app-menu__tabs-item--layout-icon.app-menu__tabs-item--active {\n  border-color: transparent;\n  background: var(--app-menu-bg-strong);\n  color: #fff;\n  box-shadow: none;\n  filter: none;\n  transform: none;\n}\n.app-menu__tabs-items--icon-list .app-menu__tabs-item--layout-icon.app-menu__tabs-item--active:not(:disabled):not(.app-menu__tabs-item--disabled):hover {\n  background: var(--app-menu-bg-strong);\n  color: #fff;\n}\n.app-menu__tabs-item--active .app-menu__tabs-item-icon,\n.app-menu__tabs-item--active .app-menu__tabs-item-description {\n  color: currentColor;\n}\n.app-menu__tabs-toggle {\n  flex: 0 0 30px;\n  width: 30px;\n  height: 18px;\n  border: 1px solid rgba(56, 90, 132, 0.22);\n  border-radius: 999px;\n  background: rgba(75, 103, 138, 0.12);\n  display: inline-flex;\n  align-items: center;\n  padding: 2px;\n  transition: background 0.14s ease, border-color 0.14s ease;\n}\n.app-menu__tabs-toggle span {\n  width: 12px;\n  height: 12px;\n  border-radius: 999px;\n  background: #fff;\n  box-shadow: 0 1px 3px rgba(18, 34, 56, 0.2);\n  transform: translateX(0);\n  transition: transform 0.14s ease;\n}\n.app-menu__tabs-toggle--active,\n.app-menu__tabs-item--active .app-menu__tabs-toggle {\n  border-color: var(--app-menu-border);\n  background: var(--app-menu-bg-strong);\n}\n.app-menu__tabs-item--active .app-menu__tabs-toggle {\n  border-color: rgba(255, 255, 255, 0.68);\n  background: rgba(255, 255, 255, 0.32);\n}\n.app-menu__tabs-toggle--active span,\n.app-menu__tabs-item--active .app-menu__tabs-toggle span {\n  transform: translateX(12px);\n}\n.app-menu__tabs-item:disabled,\n.app-menu__tabs-item--disabled {\n  cursor: default;\n  opacity: 0.56;\n  transform: none;\n  box-shadow: none;\n}\n.app-menu__tabs-item--with-description {\n  align-items: flex-start;\n  min-height: 50px;\n}\n.app-menu__tabs-item-icon,\n.app-menu__tabs-item-check {\n  flex: 0 0 18px;\n  min-width: 18px;\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  color: var(--app-menu-icon);\n}\n.app-menu__tabs-item--layout-icon .app-menu__tabs-item-icon {\n  flex-basis: auto;\n  min-width: 0;\n  width: 1.35rem;\n  height: 1.35rem;\n  font-size: 1.35rem;\n  line-height: 1.35rem;\n  color: currentColor;\n}\n.app-menu__tabs-item-icon--text {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-family:\n    "Apple Color Emoji",\n    "Segoe UI Emoji",\n    "Noto Color Emoji",\n    sans-serif;\n  font-size: var(--app-menu-icon-list-font-size);\n  line-height: 1;\n}\n.app-menu__tabs-item-check {\n  color: var(--app-menu-fg);\n}\n.app-menu__tabs-item-main {\n  flex: 1 1 auto;\n  min-width: 0;\n  overflow: hidden;\n  display: grid;\n  gap: 0.08rem;\n}\n.app-menu__tabs-item-label,\n.app-menu__tabs-item-description {\n  display: block;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.app-menu__tabs-item-label {\n  white-space: nowrap;\n}\n.app-menu__tabs-filter-match {\n  font-weight: 1000;\n}\n.app-menu__tabs-item-description {\n  color: var(--app-menu-muted-text);\n  font-size: 0.7rem;\n  font-weight: 700;\n  line-height: 1.2;\n  overflow-wrap: anywhere;\n}\n.app-menu__tabs-divider,\n.app-menu__tabs-section {\n  flex: 1 0 100%;\n}\n.app-menu__tabs-section {\n  min-height: 28px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n}\n.app-menu__tabs-section .mat-icon {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n  line-height: 15px;\n  color: var(--app-menu-icon);\n}\n.app-menu__tabs-empty {\n  flex: 1 0 100%;\n  min-height: 34px;\n  display: flex;\n  align-items: center;\n  padding: 0.35rem 0.46rem;\n  color: var(--app-menu-muted-text);\n  font-size: 0.74rem;\n  font-weight: 800;\n}\n.app-menu__tile-grid {\n  display: grid;\n  grid-template-columns: repeat(var(--app-menu-grid-columns), minmax(0, 1fr));\n  align-items: stretch;\n  gap: var(--app-menu-grid-gap);\n  width: 100%;\n}\n.app-menu__item,\n.app-menu__tile-item {\n  appearance: none;\n  -webkit-appearance: none;\n  position: relative;\n  border: 1px solid var(--app-menu-border);\n  background: var(--app-menu-bg);\n  color: var(--app-menu-fg);\n  font: inherit;\n  cursor: pointer;\n  transition:\n    background 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    filter 0.14s ease,\n    transform 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.app-menu__item {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto auto auto;\n  gap: 0.42rem;\n  align-items: center;\n  width: 100%;\n  min-width: 0;\n  min-height: 2.42rem;\n  border-color: transparent;\n  border-radius: 9px;\n  padding: 0.42rem 0.52rem;\n  text-align: left;\n}\na.app-menu__item {\n  text-decoration: none;\n}\n.app-menu__item-row {\n  display: flex;\n  align-items: stretch;\n  gap: 0.22rem;\n  width: 100%;\n  min-width: 0;\n}\n.app-menu__item-row .app-menu__item {\n  flex: 1 1 auto;\n  min-width: 0;\n}\n.app-menu__item-remove {\n  appearance: none;\n  -webkit-appearance: none;\n  flex: 0 0 34px;\n  min-width: 34px;\n  min-height: 2.42rem;\n  border: 1px solid var(--app-menu-border);\n  border-radius: 9px;\n  padding: 0;\n  background: var(--app-menu-bg);\n  color: var(--app-menu-icon);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font: inherit;\n  cursor: pointer;\n  transition:\n    background 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    filter 0.14s ease,\n    transform 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.app-menu__item-remove .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.app-menu__item-remove:not(:disabled):hover {\n  background: var(--app-menu-bg-hover);\n  color: var(--app-menu-fg);\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px var(--app-menu-shadow);\n}\n.app-menu__item-remove:disabled {\n  cursor: default;\n  opacity: 0.56;\n  transform: none;\n  box-shadow: none;\n}\n.app-menu__panel--dropdown-list .app-menu__item,\n.app-menu__panel--dropdown-list .app-menu__branch-back,\n.app-menu__panel--dropdown-list .app-menu__branch-action {\n  display: inline-flex;\n  align-items: center;\n  max-width: min(28rem, 100vw - 1.9rem);\n  min-height: 36px;\n  border: 0;\n  border-radius: 10px;\n  background: transparent;\n  box-shadow: none;\n  color: rgba(24, 42, 66, 0.92);\n  font-size: 0.78rem;\n  font-weight: 700;\n  gap: 0.45rem;\n  padding: 0.46rem 0.54rem;\n  white-space: nowrap;\n  transition:\n    transform 0.16s cubic-bezier(0.22, 0.61, 0.36, 1),\n    filter 0.16s cubic-bezier(0.22, 0.61, 0.36, 1),\n    background-color 0.16s cubic-bezier(0.22, 0.61, 0.36, 1),\n    color 0.16s cubic-bezier(0.22, 0.61, 0.36, 1);\n}\n.app-menu__panel--dropdown-list .app-menu__item {\n  width: max-content;\n  min-width: 100%;\n}\n.app-menu__panel--dropdown-list .app-menu__item-remove {\n  min-height: 36px;\n  border: 0;\n  border-radius: 10px;\n  background: transparent;\n  box-shadow: none;\n  color: rgba(24, 42, 66, 0.62);\n}\n.app-menu__panel--dropdown-list .app-menu__item-remove:not(:disabled):hover {\n  background: rgba(212, 226, 247, 0.45);\n  box-shadow: none;\n  color: rgba(24, 42, 66, 0.92);\n  filter: brightness(1.02);\n}\n.app-menu__panel--dropdown-list .app-menu__item:not(:disabled):not(.app-menu__item--disabled):hover,\n.app-menu__panel--dropdown-list .app-menu__item--active,\n.app-menu__panel--dropdown-list .app-menu__branch-back:hover,\n.app-menu__panel--dropdown-list .app-menu__branch-action:hover {\n  background: rgba(212, 226, 247, 0.45);\n  box-shadow: none;\n  filter: brightness(1.02);\n  transform: translateY(-1px);\n}\n.app-menu__panel--dropdown-list .app-menu__item--active {\n  border: 1px solid var(--app-menu-border);\n  background: var(--app-menu-bg);\n  color: var(--app-menu-fg);\n  transform: none;\n}\n.app-menu__panel--dropdown-list .app-menu__item--active:not(:disabled):not(.app-menu__item--disabled):hover {\n  background: var(--app-menu-bg-hover);\n  color: var(--app-menu-fg);\n}\n.app-menu__panel--dropdown-list .app-menu__item--surface-tinted {\n  border: 1px solid var(--app-menu-border);\n  background: var(--app-menu-bg);\n  color: var(--app-menu-fg);\n}\n.app-menu__panel--dropdown-list .app-menu__item--surface-tinted:not(:disabled):not(.app-menu__item--disabled):hover,\n.app-menu__panel--dropdown-list .app-menu__item--surface-tinted.app-menu__item--active {\n  background: var(--app-menu-bg-hover);\n  color: var(--app-menu-fg);\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.42);\n}\n.app-menu__panel--dropdown-list .app-menu__item:not(:disabled):not(.app-menu__item--disabled):active,\n.app-menu__panel--dropdown-list .app-menu__branch-back:active,\n.app-menu__panel--dropdown-list .app-menu__branch-action:active {\n  transform: scale(0.98);\n  filter: brightness(0.96);\n}\n.app-menu__panel--dropdown-list .app-menu__item--disabled {\n  opacity: 0.52;\n  pointer-events: none;\n}\n.app-menu__panel--dropdown-list .app-menu__item--with-description {\n  min-height: 48px;\n  align-items: flex-start;\n}\n.app-menu__panel--dropdown-list .app-menu__item--with-description .app-menu__item-icon {\n  margin-top: 0.08rem;\n}\n.app-menu__panel--dropdown-list .app-menu__item--layout-pill {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  width: max-content;\n  min-width: min(220px, 100vw - 1.2rem);\n  min-height: 40px;\n  align-items: center;\n  column-gap: 0.38rem;\n  row-gap: 0;\n  border: 1px solid var(--app-menu-border);\n  border-radius: 10px;\n  padding: 0.36rem 0.42rem;\n  background: var(--app-menu-bg);\n  color: var(--app-menu-fg);\n  box-shadow: none;\n}\n.app-menu__panel--dropdown-list .app-menu__item--layout-pill:not(:disabled):not(.app-menu__item--disabled):hover,\n.app-menu__panel--dropdown-list .app-menu__item--layout-pill.app-menu__item--active {\n  background: var(--app-menu-bg-hover);\n  color: var(--app-menu-fg);\n  filter: none;\n  transform: translateY(-1px);\n}\n.app-menu__panel--dropdown-list .app-menu__item--layout-pill .app-menu__item-icon {\n  width: 20px;\n  height: 20px;\n  margin-top: 0;\n  font-size: 20px;\n  line-height: 20px;\n  color: var(--app-menu-icon);\n}\n.app-menu__panel--dropdown-list .app-menu__item.app-menu__palette--danger,\n.app-menu__panel--dropdown-list .app-menu__item.app-menu__palette--red {\n  color: #aa2e2e;\n}\n.app-menu__panel--dropdown-list .app-menu__item-row {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.16rem;\n  min-width: min(15.5rem, 100vw - 1.2rem);\n  border: 1px solid var(--app-menu-border);\n  border-radius: 12px;\n  padding: 0.2rem;\n  background: var(--app-menu-bg);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.64), 0 6px 18px var(--app-menu-shadow);\n}\n.app-menu__panel--dropdown-list .app-menu__item-row .app-menu__item {\n  min-width: 0;\n  min-height: 38px;\n  border: 0;\n  border-radius: 9px;\n  padding: 0.34rem 0.32rem;\n  background: transparent;\n  box-shadow: none;\n}\n.app-menu__panel--dropdown-list .app-menu__item-row .app-menu__item--surface-tinted,\n.app-menu__panel--dropdown-list .app-menu__item-row .app-menu__item--layout-pill {\n  border: 0;\n  background: transparent;\n  box-shadow: none;\n}\n.app-menu__panel--dropdown-list .app-menu__item-row .app-menu__item:not(:disabled):not(.app-menu__item--disabled):hover {\n  background: rgba(255, 255, 255, 0.42);\n  box-shadow: none;\n  filter: none;\n  transform: none;\n}\n.app-menu__panel--dropdown-list .app-menu__item-row .app-menu__item-remove {\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  min-height: 30px;\n  border: 1px solid rgba(47, 86, 139, 0.18);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.72);\n  color: var(--app-menu-icon);\n}\n.app-menu__panel--dropdown-list .app-menu__item-row .app-menu__item-remove .mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n.app-menu__panel--dropdown-list .app-menu__item-row .app-menu__item-remove:not(:disabled):hover {\n  border-color: rgba(176, 31, 46, 0.26);\n  background: rgba(255, 241, 242, 0.94);\n  color: #a43c45;\n  box-shadow: 0 4px 10px rgba(163, 36, 48, 0.14);\n  filter: none;\n  transform: translateY(-1px);\n}\n.app-menu__branch-header {\n  min-height: 36px;\n  display: grid;\n  grid-template-columns: 30px minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.32rem;\n  padding: 0 0.18rem 0.22rem;\n  color: #25476e;\n  font-size: 0.76rem;\n  font-weight: 950;\n}\n.app-menu__branch-back,\n.app-menu__branch-action {\n  appearance: none;\n  -webkit-appearance: none;\n  border: 0;\n  cursor: pointer;\n  font: inherit;\n  text-align: left;\n}\n.app-menu__branch-title {\n  min-width: 0;\n  overflow-wrap: anywhere;\n  line-height: 1.2;\n}\n.app-menu__panel--dropdown-list .app-menu__branch-back {\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  min-height: 30px;\n  border: 1px solid rgba(47, 86, 139, 0.18);\n  border-radius: 50%;\n  padding: 0;\n  justify-content: center;\n}\n.app-menu__branch-action {\n  justify-content: center;\n}\n.app-menu__panel--dropdown-list .app-menu__branch-action--icon-only {\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  min-height: 30px;\n  border: 1px solid rgba(47, 86, 139, 0.18);\n  border-radius: 50%;\n  padding: 0;\n}\n.app-menu__branch-action span {\n  min-width: 0;\n  overflow-wrap: anywhere;\n}\n.app-menu__panel--dropdown-list .app-menu__branch-action.app-menu__palette--success,\n.app-menu__panel--dropdown-list .app-menu__branch-action.app-menu__palette--green {\n  border: 1px solid rgba(40, 117, 78, 0.28);\n  background: #eefbf4;\n  color: #1f7649;\n}\n.app-menu__panel--dropdown-list .app-menu__branch-action.app-menu__palette--success:hover,\n.app-menu__panel--dropdown-list .app-menu__branch-action.app-menu__palette--green:hover,\n.app-menu__panel--dropdown-list .app-menu__branch-action.app-menu__palette--success:active,\n.app-menu__panel--dropdown-list .app-menu__branch-action.app-menu__palette--green:active {\n  background: #eefbf4;\n  color: #1f7649;\n  filter: none;\n  transform: none;\n}\n.app-menu__branch-back .mat-icon,\n.app-menu__branch-action .mat-icon {\n  width: 1.08rem;\n  height: 1.08rem;\n  font-size: 1.08rem;\n  line-height: 1.08rem;\n  color: var(--app-menu-icon);\n}\n.app-menu__tile-item {\n  box-sizing: border-box;\n  width: 100%;\n  min-width: 0;\n  min-height: 0;\n  height: var(--app-menu-tile-height);\n  border-radius: 12px;\n  display: inline-flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 0.18rem;\n  padding: 0.4rem 0.35rem 0.32rem;\n  overflow: visible;\n  text-align: center;\n}\n.app-menu__item:hover,\n.app-menu__tile-item:hover {\n  background: var(--app-menu-bg-hover);\n  box-shadow: 0 3px 10px rgba(16, 29, 48, 0.12);\n  filter: brightness(1.02);\n}\n.app-menu__item:active,\n.app-menu__tile-item:active {\n  transform: translateY(1px);\n  filter: brightness(0.98);\n}\n.app-menu__item:disabled,\n.app-menu__tile-item:disabled {\n  cursor: default;\n  opacity: 0.55;\n  filter: grayscale(0.18);\n  box-shadow: none;\n  transform: none;\n}\n.app-menu__item--active,\n.app-menu__tile-item--active {\n  box-shadow: inset 0 0 0 1px var(--app-menu-border);\n}\n.app-menu__item-icon,\n.app-menu__item-check,\n.app-menu__item-branch,\n.app-menu__tile-icon {\n  width: 1.12rem;\n  height: 1.12rem;\n  font-size: 1.12rem;\n  line-height: 1.12rem;\n}\n.app-menu__item-icon,\n.app-menu__tile-icon {\n  color: var(--app-menu-icon);\n}\n.app-menu__item-image {\n  width: 2.55rem;\n  height: 1.42rem;\n  padding: 0.12rem;\n  font-size: 0.72rem;\n}\n.app-menu__panel--dropdown-list .app-menu__item--with-description .app-menu__item-image {\n  margin-top: 0.04rem;\n}\n.app-menu__panel--dropdown-list .app-menu__item-icon,\n.app-menu__panel--dropdown-list .app-menu__item-branch,\n.app-menu__panel--dropdown-list .app-menu__item-check {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n  color: var(--app-menu-icon);\n}\n.app-menu__panel--dropdown-list .app-menu__item.app-menu__palette--danger .app-menu__item-icon,\n.app-menu__panel--dropdown-list .app-menu__item.app-menu__palette--red .app-menu__item-icon {\n  color: #cf4747;\n}\n.app-menu__item-main {\n  display: grid;\n  min-width: 0;\n  gap: 0.08rem;\n}\n.app-menu__item-header {\n  display: flex;\n  align-items: center;\n  gap: 0.34rem;\n  width: 100%;\n  min-width: 0;\n}\n.app-menu__item-header > .app-menu__counter {\n  flex: 0 0 auto;\n  margin-left: auto;\n}\n.app-menu__item-header > .app-menu__counter--header-badge {\n  margin-left: auto;\n  background: rgba(255, 255, 255, 0.72);\n  color: var(--app-menu-fg);\n}\n.app-menu__item-header > .app-menu__counter--header-badge + .app-menu__counter {\n  margin-left: 0;\n}\n.app-menu__item-body {\n  display: grid;\n  justify-items: start;\n  min-width: 0;\n  gap: 0.08rem;\n}\n.app-menu__item-label,\n.app-menu__tile-label {\n  min-width: 0;\n  color: inherit;\n  font-weight: 850;\n}\n.app-menu__item-label {\n  overflow-wrap: anywhere;\n  font-size: 0.8rem;\n  line-height: 1.2;\n}\n.app-menu__item-header > .app-menu__item-label {\n  flex: 1 1 auto;\n}\n.app-menu__panel--dropdown-list .app-menu__item-main {\n  flex: 1 1 auto;\n}\n.app-menu__panel--dropdown-list .app-menu__item-label {\n  overflow: hidden;\n  overflow-wrap: normal;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  word-break: keep-all;\n  font-weight: 700;\n}\n.app-menu__panel--dropdown-list .app-menu__item-description {\n  color: rgba(42, 66, 96, 0.68);\n  font-size: 0.67rem;\n  font-weight: 800;\n}\n.app-menu__panel--dropdown-list .app-menu__item--layout-pill .app-menu__item-main {\n  gap: 0.08rem;\n}\n.app-menu__panel--dropdown-list .app-menu__item--layout-pill .app-menu__item-label {\n  font-size: 0.72rem;\n  font-weight: 850;\n  line-height: 1;\n  text-decoration: underline;\n}\n.app-menu__panel--dropdown-list .app-menu__item--layout-pill .app-menu__item-description {\n  color: currentColor;\n  font-size: 0.64rem;\n  font-weight: 800;\n  line-height: 1.1;\n}\n.app-menu__tile-label {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  overflow-wrap: var(--app-menu-tile-label-overflow-wrap);\n  font-size: 0.68rem;\n  line-height: 1.08;\n  white-space: var(--app-menu-tile-label-white-space);\n}\n.app-menu__item-description,\n.app-menu__tile-description {\n  min-width: 0;\n  overflow-wrap: anywhere;\n  color: var(--app-menu-muted-text);\n  font-weight: 700;\n  line-height: 1.2;\n}\n.app-menu__item-description {\n  font-size: 0.7rem;\n  white-space: pre-line;\n}\n.app-menu__tile-description {\n  font-size: 0.62rem;\n}\n.app-menu__item-detail {\n  color: rgba(32, 53, 82, 0.68);\n  font-size: 0.72rem;\n  font-weight: 800;\n  white-space: nowrap;\n}\n.app-menu__item-detail--badge {\n  justify-self: start;\n  width: fit-content;\n  max-width: 100%;\n  border: 1px solid transparent;\n  border-radius: 999px;\n  padding: 0.12rem 0.42rem;\n  background: var(--app-menu-bg-strong);\n  color: #fff;\n  font-size: 0.62rem;\n  line-height: 1.1;\n  white-space: normal;\n  box-shadow: 0 3px 9px var(--app-menu-shadow);\n}\n.app-menu__item-check {\n  color: #2f7b51;\n}\n.app-menu__item-branch {\n  color: rgba(32, 53, 82, 0.55);\n}\n.app-menu__tile-item--segmented {\n  padding: 0;\n  border-color: var(--app-menu-border);\n  background: rgba(255, 255, 255, 0.72);\n  overflow: visible;\n}\n.app-menu__segments {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));\n  width: 100%;\n  height: 100%;\n  min-width: 0;\n  overflow: hidden;\n  border-radius: inherit;\n  pointer-events: none;\n}\n.app-menu__segment {\n  min-width: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.42rem;\n  padding: 0 0.54rem;\n  background: var(--app-menu-bg);\n  color: var(--app-menu-fg);\n}\n.app-menu__segment + .app-menu__segment {\n  border-left: 1px solid rgba(255, 255, 255, 0.74);\n}\n.app-menu__segment .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  color: var(--app-menu-icon);\n}\n.app-menu__segment-text {\n  display: inline-flex;\n  flex-direction: column;\n  align-items: flex-start;\n  justify-content: center;\n  min-width: 0;\n  gap: 0.06rem;\n  line-height: 1;\n  text-align: left;\n}\n.app-menu__segment-label {\n  font-size: 0.75rem;\n  font-weight: 850;\n  line-height: 1.05;\n}\n.app-menu__segment-description {\n  align-self: center;\n  font-size: 0.64rem;\n  font-weight: 750;\n  line-height: 1.08;\n  opacity: 0.86;\n  text-align: center;\n  text-transform: uppercase;\n}\n.app-menu__counter {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: var(--app-menu-counter-min-width, 1.22rem);\n  height: var(--app-menu-counter-height, 1.22rem);\n  box-sizing: border-box;\n  border-radius: 999px;\n  padding: var(--app-menu-counter-padding, 0 0.32rem);\n  background:\n    linear-gradient(\n      180deg,\n      #e24955 0%,\n      #c93240 100%);\n  color: #fff;\n  font-size: 0.68rem;\n  font-weight: 900;\n  line-height: 1;\n  box-shadow: 0 5px 10px rgba(163, 36, 48, 0.24);\n  white-space: nowrap;\n  pointer-events: none;\n  z-index: 3;\n}\n.app-menu__counter--success {\n  background:\n    linear-gradient(\n      180deg,\n      #2da66f 0%,\n      #208456 100%);\n  color: #fff;\n  box-shadow: 0 5px 10px rgba(26, 119, 76, 0.24);\n}\n.app-menu__counter--trigger,\n.app-menu__counter--tile {\n  position: absolute;\n  top: var(--app-menu-trigger-counter-top, -0.34rem);\n  right: var(--app-menu-trigger-counter-right, -0.28rem);\n}\n.app-menu__trigger > .app-menu__counter--trigger {\n  z-index: 10;\n}\n.app-menu__counter--tile {\n  top: -6px;\n  right: -6px;\n  min-width: 20px;\n  height: 20px;\n  font-size: 10px;\n  box-shadow: 0 0 0 2px #fff;\n}\n.app-menu__counter--pulse {\n  animation: app-menu-counter-pulse 1.6s ease-in 1;\n}\n.app-menu__panel--dropdown-list .app-menu__counter {\n  margin-left: auto;\n  min-width: 34px;\n  height: 20px;\n  border-radius: 999px;\n  padding: 0 0.38rem;\n  background: rgba(54, 101, 161, 0.12);\n  color: #315d94;\n  font-size: 0.68rem;\n  font-weight: 900;\n  box-shadow: none;\n}\n.app-menu__panel--dropdown-list .app-menu__counter--alert {\n  min-width: 20px;\n  width: auto;\n  height: 20px;\n  padding: 0 5px;\n  border: 1px solid #fff;\n  background:\n    linear-gradient(\n      180deg,\n      #e24955 0%,\n      #c93240 100%);\n  color: #fff;\n  box-shadow: 0 4px 9px rgba(163, 36, 48, 0.22);\n}\n.app-menu__panel--dropdown-list .app-menu__counter--success {\n  min-width: 20px;\n  width: auto;\n  height: 20px;\n  padding: 0 5px;\n  border: 1px solid #fff;\n  background:\n    linear-gradient(\n      180deg,\n      #2da66f 0%,\n      #208456 100%);\n  color: #fff;\n  box-shadow: 0 4px 9px rgba(26, 119, 76, 0.22);\n}\n.app-menu__panel--dropdown-list .app-menu__item-header > .app-menu__counter {\n  margin-left: 0.34rem;\n  min-width: auto;\n  height: 18px;\n  padding: 0 0.4rem;\n}\n.app-menu__panel--dropdown-list .app-menu__item--disabled .app-menu__item-header > .app-menu__counter {\n  background: rgba(104, 116, 132, 0.16);\n  color: #697487;\n}\n.app-menu__panel--dropdown-list .app-menu__item--layout-pill .app-menu__counter {\n  min-width: 20px;\n  height: 20px;\n  margin-left: 0.16rem;\n  border: 1px solid #fff;\n  background:\n    linear-gradient(\n      180deg,\n      #e24955 0%,\n      #c93240 100%);\n  color: #fff;\n  font-size: 0.7rem;\n  box-shadow: 0 4px 9px rgba(163, 36, 48, 0.22);\n}\n.app-menu__divider {\n  height: 1px;\n  margin: 0.18rem 0.2rem;\n  background: rgba(44, 72, 108, 0.12);\n}\n.app-menu__section-label {\n  padding: 0.42rem 0.48rem 0.12rem;\n  color: rgba(37, 58, 86, 0.62);\n  font-size: 0.7rem;\n  font-weight: 900;\n  letter-spacing: 0;\n  text-transform: uppercase;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n}\n.app-menu__panel--dropdown-list .app-menu__section-label {\n  width: 100%;\n  min-height: 32px;\n  padding: 0.24rem 0.28rem;\n  color: var(--app-menu-fg);\n}\n.app-menu__section-label > span {\n  min-width: 0;\n}\n.app-menu__section-label .mat-icon {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n  line-height: 15px;\n  color: var(--app-menu-icon);\n}\n.app-menu__section-action {\n  appearance: none;\n  -webkit-appearance: none;\n  min-height: 24px;\n  border: 1px solid var(--app-menu-border);\n  border-radius: 999px;\n  padding: 0.12rem 0.42rem;\n  margin-left: auto;\n  background: var(--app-menu-bg);\n  color: var(--app-menu-fg);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.16rem;\n  font: inherit;\n  font-size: 0.62rem;\n  font-weight: 850;\n  line-height: 1;\n  white-space: nowrap;\n  cursor: pointer;\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.62);\n  transition:\n    border-color 0.14s ease,\n    background 0.14s ease,\n    color 0.14s ease,\n    filter 0.14s ease,\n    transform 0.14s ease;\n}\n.app-menu__section-action:not(:disabled):hover {\n  background: var(--app-menu-bg-hover);\n  transform: translateY(-1px);\n}\n.app-menu__section-action--active {\n  background: var(--app-menu-bg-hover);\n  color: var(--app-menu-fg);\n}\n.app-menu__section-action:disabled {\n  cursor: default;\n  opacity: 0.56;\n}\n.app-menu__section-action .mat-icon {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n  color: var(--app-menu-icon);\n}\n.app-menu__tile-divider,\n.app-menu__tile-section {\n  grid-column: 1/-1;\n}\n:host(.app-menu-host--layout-mobile):not(.app-menu-host--layout-grid):not(.app-menu-host--kind-select):not(.app-menu-host--kind-fab):not(.app-menu-host--layout-row) .app-menu {\n  position: static;\n}\n:host(.app-menu-host--layout-mobile):not(.app-menu-host--layout-grid):not(.app-menu-host--kind-select):not(.app-menu-host--kind-fab):not(.app-menu-host--layout-row) .app-menu__backdrop {\n  position: fixed;\n  inset: 0;\n  z-index: 1000;\n  border: 0;\n  padding: 0;\n  background: rgba(12, 24, 40, 0.36);\n  cursor: default;\n}\n:host(.app-menu-host--layout-mobile):not(.app-menu-host--layout-grid):not(.app-menu-host--kind-select):not(.app-menu-host--kind-fab):not(.app-menu-host--layout-row) .app-menu__panel {\n  position: fixed;\n  left: 0.6rem;\n  right: 0.6rem;\n  top: auto;\n  bottom: 0.6rem;\n  z-index: 1001;\n  width: auto;\n  min-width: 0;\n  max-width: none;\n  max-height: min(76vh, 34rem);\n  border-radius: 16px;\n  padding: 0.52rem;\n  box-shadow: 0 24px 62px rgba(8, 18, 34, 0.32);\n  animation: app-menu-sheet-in 0.18s ease-out;\n}\n:host(.app-menu-host--layout-mobile):not(.app-menu-host--layout-grid):not(.app-menu-host--kind-select):not(.app-menu-host--kind-fab):not(.app-menu-host--layout-row) .app-menu__panel::before {\n  content: "";\n  justify-self: center;\n  width: 2.25rem;\n  height: 0.24rem;\n  margin: 0.06rem 0 0.16rem;\n  border-radius: 999px;\n  background: rgba(38, 62, 92, 0.22);\n}\n:host(.app-menu-host--layout-mobile.app-menu-host--model-layout-tabs) .app-menu {\n  position: static;\n}\n:host(.app-menu-host--layout-mobile.app-menu-host--model-layout-tabs) .app-menu__panel--tabs {\n  position: fixed;\n  left: 0.6rem;\n  right: 0.6rem;\n  top: auto;\n  bottom: 0.6rem;\n  z-index: 1001;\n  width: auto;\n  min-width: 0;\n  max-width: none;\n  max-height: min(76vh, 34rem);\n  border-radius: 16px;\n  padding: 0.52rem;\n  box-shadow: 0 24px 62px rgba(8, 18, 34, 0.32);\n  animation: app-menu-sheet-in 0.18s ease-out;\n}\n:host(.app-menu-host--layout-mobile.app-menu-host--model-layout-tabs) .app-menu__panel--tabs::before {\n  content: "";\n  justify-self: center;\n  width: 2.25rem;\n  height: 0.24rem;\n  margin: 0.06rem 0 0.16rem;\n  border-radius: 999px;\n  background: rgba(38, 62, 92, 0.22);\n}\n:host(.app-menu-host--layout-mobile.app-menu-host--layout-row) .app-menu__button-row-item--selected-value {\n  flex: 0 1 auto;\n  min-width: 0;\n  max-width: min(8.4rem, 31vw);\n}\n:host(.app-menu-host--inline-row-labelled-action:not(.app-menu-host--content-actions)) {\n  display: block;\n  width: 100%;\n}\n:host(.app-menu-host--inline-row-labelled-action:not(.app-menu-host--content-actions)) .app-menu {\n  display: block;\n  width: 100%;\n}\n:host(.app-menu-host--inline-row-labelled-action:not(.app-menu-host--content-actions)) .app-menu__button-row {\n  display: flex;\n  width: 100%;\n  justify-content: stretch;\n  gap: 0.78rem;\n}\n:host(.app-menu-host--inline-row-labelled-action:not(.app-menu-host--content-actions)) .app-menu__button-row-item--action.app-menu__button-row-item--labelled {\n  flex: 1 1 0;\n  min-width: 0;\n  padding-inline: 16px;\n}\n:host(.app-menu-host--layout-mobile.app-menu-host--inline-row-labelled-action.app-menu-host--compact) .app-menu__button-row-item--action.app-menu__button-row-item--labelled {\n  gap: 0;\n  padding-inline: 0.26rem;\n}\n:host(.app-menu-host--layout-mobile.app-menu-host--inline-row-labelled-action.app-menu-host--compact) .app-menu__button-row-main {\n  gap: 0.06rem;\n}\n:host(.app-menu-host--layout-mobile.app-menu-host--inline-row-labelled-action.app-menu-host--compact) .app-menu__button-row-main .mat-icon {\n  flex: 0 0 0.92rem;\n  width: 0.92rem;\n  height: 0.92rem;\n  font-size: 0.92rem;\n  line-height: 0.92rem;\n}\n:host(.app-menu-host--layout-mobile.app-menu-host--inline-row-big) .app-menu__button-row {\n  grid-template-columns: repeat(var(--app-menu-mobile-big-columns), minmax(0, 1fr));\n}\n:host(.app-menu-host--layout-mobile.app-menu-host--inline-row-big) .app-menu__button-row-item--selected-value {\n  flex: initial;\n  width: 100%;\n  max-width: none;\n}\n:host(.app-menu-host--layout-mobile.app-menu-host--kind-select) .app-menu__panel--dropdown-list,\n:host(.app-menu-host--layout-mobile.app-menu-host--kind-fab) .app-menu__panel--dropdown-list,\n:host(.app-menu-host--layout-mobile.app-menu-host--layout-row) .app-menu__panel--dropdown-list {\n  position: fixed;\n  left: 0.4rem;\n  right: 0.4rem;\n  top: auto;\n  bottom: 0.4rem;\n  z-index: 1001;\n  width: auto;\n  min-width: 0;\n  max-width: none;\n  max-height: var(--app-menu-mobile-dropdown-max-height);\n  overflow: hidden;\n  border-radius: 14px;\n  box-shadow: 0 18px 34px rgba(26, 42, 68, 0.18);\n  animation: app-menu-sheet-in 0.18s ease-out;\n}\n:host(.app-menu-host--layout-mobile.app-menu-host--kind-select) .app-menu__panel--dropdown-list.app-menu__panel--open-up,\n:host(.app-menu-host--layout-mobile.app-menu-host--kind-fab) .app-menu__panel--dropdown-list.app-menu__panel--open-up,\n:host(.app-menu-host--layout-mobile.app-menu-host--layout-row) .app-menu__panel--dropdown-list.app-menu__panel--open-up {\n  position: absolute;\n  left: auto;\n  right: 0;\n  top: auto;\n  bottom: calc(100% + var(--app-menu-panel-gap, 0.26rem));\n  width: max-content;\n  min-width: 100%;\n  max-width: min(28rem, 100vw - 1.2rem);\n  animation-name: app-menu-panel-up-in;\n}\n:host(.app-menu-host--layout-mobile.app-menu-host--kind-select) .app-menu__panel--dropdown-list.app-menu__panel--open-up.app-menu__panel--align-start,\n:host(.app-menu-host--layout-mobile.app-menu-host--kind-fab) .app-menu__panel--dropdown-list.app-menu__panel--open-up.app-menu__panel--align-start,\n:host(.app-menu-host--layout-mobile.app-menu-host--layout-row) .app-menu__panel--dropdown-list.app-menu__panel--open-up.app-menu__panel--align-start {\n  left: 0;\n  right: auto;\n}\n:host(.app-menu-host--layout-mobile.app-menu-host--kind-select) .app-menu__panel--dropdown-list .app-menu__items,\n:host(.app-menu-host--layout-mobile.app-menu-host--kind-fab) .app-menu__panel--dropdown-list .app-menu__items,\n:host(.app-menu-host--layout-mobile.app-menu-host--layout-row) .app-menu__panel--dropdown-list .app-menu__items {\n  width: 100%;\n  min-height: 0;\n  max-height: var(--app-menu-mobile-dropdown-max-height);\n  max-width: none;\n  overflow-x: hidden;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n  padding-right: 0.08rem;\n}\n:host(.app-menu-host--layout-mobile.app-menu-host--kind-select) .app-menu__panel--dropdown-list .app-menu__item,\n:host(.app-menu-host--layout-mobile.app-menu-host--kind-fab) .app-menu__panel--dropdown-list .app-menu__item,\n:host(.app-menu-host--layout-mobile.app-menu-host--layout-row) .app-menu__panel--dropdown-list .app-menu__item {\n  width: 100%;\n  min-width: 0;\n}\n:host(.app-menu-host--layout-mobile.app-menu-host--kind-select) .app-menu__panel--dropdown-list.app-menu__panel--has-branch-header .app-menu__items,\n:host(.app-menu-host--layout-mobile.app-menu-host--kind-fab) .app-menu__panel--dropdown-list.app-menu__panel--has-branch-header .app-menu__items,\n:host(.app-menu-host--layout-mobile.app-menu-host--layout-row) .app-menu__panel--dropdown-list.app-menu__panel--has-branch-header .app-menu__items {\n  max-height: calc(var(--app-menu-mobile-dropdown-max-height) - 2.7rem);\n}\n:host(.app-menu-host--layout-mobile) .app-menu__tile-label {\n  font-size: 0.66rem;\n}\n:host(.app-menu-host--layout-mobile) .app-menu__segment {\n  gap: 0.34rem;\n  padding: 0 0.42rem;\n}\n@keyframes app-menu-panel-in {\n  from {\n    opacity: 0;\n    transform: translateY(-4px) scale(0.98);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0) scale(1);\n  }\n}\n@keyframes app-menu-panel-up-in {\n  from {\n    opacity: 0;\n    transform: translateY(4px) scale(0.98);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0) scale(1);\n  }\n}\n@keyframes app-menu-sheet-in {\n  from {\n    opacity: 0;\n    transform: translateY(18px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes app-menu-counter-pulse {\n  0%, 100% {\n    box-shadow: 0 5px 10px rgba(163, 36, 48, 0.2);\n  }\n  50% {\n    box-shadow: 0 0 0 4px rgba(226, 73, 85, 0.14), 0 5px 10px rgba(163, 36, 48, 0.24);\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .app-menu__panel,\n  .app-menu__counter--pulse {\n    animation: none;\n  }\n  .app-menu__trigger,\n  .app-menu__trigger--layout-icon > .mat-icon:not(.app-menu__trigger-caret),\n  .app-menu__item,\n  .app-menu__tile-item {\n    transition: none;\n  }\n}\n.app-menu__button-row-item--labelled[data-toggle-palette],\n.app-menu__button-row-item--labelled[data-toggle-palette]:hover {\n  background: var(--app-menu-bg);\n  color: var(--app-menu-fg);\n  border-color: var(--app-menu-border);\n  box-shadow: none;\n}\n.app-menu__tabs-toggle[data-toggle-palette] {\n  background: var(--app-menu-bg-strong);\n  border-color: var(--app-menu-border);\n}\n/*# sourceMappingURL=menu.component.css.map */\n'] }]
  }], () => [], { kind: [{
    type: Input
  }], layout: [{
    type: Input
  }], title: [{
    type: Input
  }], filterable: [{
    type: Input
  }], items: [{
    type: Input
  }], model: [{
    type: Input
  }], groups: [{
    type: Input
  }], value: [{
    type: Input
  }], trigger: [{
    type: Input
  }], openUp: [{
    type: Input
  }], panelAlign: [{
    type: Input
  }], panelMode: [{
    type: Input
  }], panelGapPx: [{
    type: Input
  }], panelDockToHost: [{
    type: Input
  }], mobileBreakpointPx: [{
    type: Input
  }], closeOnSelect: [{
    type: Input
  }], draggable: [{
    type: Input
  }], dragActivationDelayMs: [{
    type: Input
  }], openChange: [{
    type: Output
  }], itemSelect: [{
    type: Output
  }], dragPositionChange: [{
    type: Output
  }], dragStateChange: [{
    type: Output
  }], open: [{
    type: Input
  }], dragPosition: [{
    type: Input
  }], hostClass: [{
    type: HostBinding,
    args: ["class.app-menu-host"]
  }], hostInlineKindClass: [{
    type: HostBinding,
    args: ["class.app-menu-host--kind-inline"]
  }], hostRowLayoutClass: [{
    type: HostBinding,
    args: ["class.app-menu-host--layout-row"]
  }], hostGridLayoutClass: [{
    type: HostBinding,
    args: ["class.app-menu-host--layout-grid"]
  }], hostInlineRowBigClass: [{
    type: HostBinding,
    args: ["class.app-menu-host--inline-row-big"]
  }], hostInlineRowLabelledActionClass: [{
    type: HostBinding,
    args: ["class.app-menu-host--inline-row-labelled-action"]
  }], hostFabKindClass: [{
    type: HostBinding,
    args: ["class.app-menu-host--kind-fab"]
  }], hostDraggableClass: [{
    type: HostBinding,
    args: ["class.app-menu-host--draggable"]
  }], hostDraggingClass: [{
    type: HostBinding,
    args: ["class.app-menu-host--dragging"]
  }], hostDragTransform: [{
    type: HostBinding,
    args: ["style.transform"]
  }], hostSelectKindClass: [{
    type: HostBinding,
    args: ["class.app-menu-host--kind-select"]
  }], hostTabbedModelLayoutClass: [{
    type: HostBinding,
    args: ["class.app-menu-host--model-layout-tabs"]
  }], hostDesktopLayoutClass: [{
    type: HostBinding,
    args: ["class.app-menu-host--layout-desktop"]
  }], hostMobileLayoutClass: [{
    type: HostBinding,
    args: ["class.app-menu-host--layout-mobile"]
  }], hostOpenClass: [{
    type: HostBinding,
    args: ["class.app-menu-host--open"]
  }], hostContentActionsClass: [{
    type: HostBinding,
    args: ["class.app-menu-host--content-actions"]
  }], hostCompactClass: [{
    type: HostBinding,
    args: ["class.app-menu-host--compact"]
  }], hostInlinePanelClass: [{
    type: HostBinding,
    args: ["class.app-menu-host--inline-panel"]
  }], hostPanelDockedClass: [{
    type: HostBinding,
    args: ["class.app-menu-host--panel-docked"]
  }], hostPanelBottomDockedClass: [{
    type: HostBinding,
    args: ["class.app-menu-host--panel-bottom-docked"]
  }], hostPanelGapStyle: [{
    type: HostBinding,
    args: ["style.--app-menu-panel-gap"]
  }], hostPanelAvailableHeightStyle: [{
    type: HostBinding,
    args: ["style.--app-menu-panel-available-height"]
  }], hostTriggerFieldClass: [{
    type: HostBinding,
    args: ["class.app-menu-host--trigger-field"]
  }], hostTriggerPillClass: [{
    type: HostBinding,
    args: ["class.app-menu-host--trigger-pill"]
  }], hostTriggerIconClass: [{
    type: HostBinding,
    args: ["class.app-menu-host--trigger-icon"]
  }], onViewportResize: [{
    type: HostListener,
    args: ["window:resize"]
  }], onWindowPointerMove: [{
    type: HostListener,
    args: ["window:pointermove", ["$event"]]
  }], onWindowPointerEnd: [{
    type: HostListener,
    args: ["window:pointerup", ["$event"]]
  }, {
    type: HostListener,
    args: ["window:pointercancel", ["$event"]]
  }], onEscapePressed: [{
    type: HostListener,
    args: ["window:keydown.escape", ["$event"]]
  }], onDocumentPointerDown: [{
    type: HostListener,
    args: ["document:pointerdown", ["$event"]]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppMenuComponent, { className: "AppMenuComponent", filePath: "app/shared/ui/components/core/menu/menu.component.ts", lineNumber: 84 });
})();

// src/app/shared/ui/components/core/menu/menu-dispatcher.service.ts
var AppMenuDispatcher = class _AppMenuDispatcher {
  activeMenuRef = signal(null, ...ngDevMode ? [{ debugName: "activeMenuRef" }] : (
    /* istanbul ignore next */
    []
  ));
  activeMenu = this.activeMenuRef.asReadonly();
  open(config, triggerElement) {
    const activeMenu = this.activeMenuRef();
    if (activeMenu && activeMenu.id !== config.id) {
      activeMenu.onClose?.();
    }
    this.activeMenuRef.set(this.createState(config, triggerElement));
  }
  toggle(config, triggerElement) {
    if (this.activeMenuRef()?.id === config.id) {
      this.close(config.id);
      return;
    }
    this.open(config, triggerElement);
  }
  close(id) {
    const activeMenu = this.activeMenuRef();
    if (!activeMenu || id && activeMenu.id !== id) {
      return;
    }
    activeMenu.onClose?.();
    this.activeMenuRef.set(null);
  }
  isOpen(id) {
    return this.activeMenuRef()?.id === id;
  }
  refreshActiveRect() {
    const activeMenu = this.activeMenuRef();
    if (!activeMenu) {
      return;
    }
    this.activeMenuRef.set(__spreadProps(__spreadValues({}, activeMenu), {
      triggerRect: activeMenu.triggerElement ? this.triggerRect(activeMenu.triggerElement) : activeMenu.triggerRect
    }));
  }
  createState(config, triggerElement) {
    return __spreadProps(__spreadValues({}, config), {
      kind: config.kind ?? "select",
      layout: config.layout ?? "row",
      filterable: config.filterable === true,
      items: config.items ?? [],
      model: config.model ?? null,
      groups: config.groups ?? [],
      value: config.value ?? null,
      trigger: config.trigger ?? null,
      openUp: config.openUp === true,
      panelAlign: config.panelAlign ?? "auto",
      panelMode: config.panelMode ?? "auto",
      mobileBreakpointPx: Math.max(1, Number(config.mobileBreakpointPx) || 760),
      closeOnSelect: config.closeOnSelect !== false,
      triggerElement,
      triggerRect: config.triggerRect ?? this.triggerRect(triggerElement),
      onClose: config.onClose ?? null
    });
  }
  triggerRect(triggerElement) {
    if (!triggerElement || typeof triggerElement.getBoundingClientRect !== "function") {
      return null;
    }
    const rect = triggerElement.getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height
    };
  }
  static \u0275fac = function AppMenuDispatcher_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppMenuDispatcher)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AppMenuDispatcher, factory: _AppMenuDispatcher.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppMenuDispatcher, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/shared/ui/components/core/menu/outlet/menu-outlet.component.ts
function AppMenuOutletComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-menu", 1);
    \u0275\u0275listener("openChange", function AppMenuOutletComponent_Conditional_0_Template_app_menu_openChange_0_listener($event) {
      const menu_r2 = \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onOpenChange($event, menu_r2));
    })("itemSelect", function AppMenuOutletComponent_Conditional_0_Template_app_menu_itemSelect_0_listener($event) {
      const menu_r2 = \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onItemSelect($event, menu_r2));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const menu_r2 = ctx;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("kind", menu_r2.kind)("layout", menu_r2.layout)("title", menu_r2.title)("filterable", menu_r2.filterable)("items", ctx_r2.resolvedItems(menu_r2))("model", menu_r2.model)("groups", menu_r2.groups)("value", menu_r2.value)("open", true)("openUp", ctx_r2.resolvedOpenUp(menu_r2))("panelAlign", ctx_r2.resolvedPanelAlign(menu_r2))("panelMode", menu_r2.panelMode)("panelDockToHost", ctx_r2.dockPanelToHost(menu_r2))("mobileBreakpointPx", menu_r2.mobileBreakpointPx)("closeOnSelect", menu_r2.closeOnSelect);
  }
}
var AppMenuOutletComponent = class _AppMenuOutletComponent {
  static DESKTOP_MARGIN_PX = 8;
  static DESKTOP_PANEL_GAP_PX = 4;
  static DESKTOP_MIN_PANEL_WIDTH_PX = 196;
  dispatcher = inject(AppMenuDispatcher);
  hostRef = inject(ElementRef);
  menu = null;
  items = null;
  itemSelect = new EventEmitter();
  get hostOpenClass() {
    return this.activeMenu() !== null;
  }
  get hostDockClass() {
    return this.activeMenu()?.panelMode === "dock";
  }
  get hostFixedClass() {
    return this.activeMenu()?.panelMode === "fixed";
  }
  get hostLeft() {
    const menu = this.activeMenu();
    if (!menu || this.isBottomMenu(menu) || this.isMobileMenu(menu)) {
      return null;
    }
    const rect = menu.triggerRect;
    if (!rect) {
      return _AppMenuOutletComponent.DESKTOP_MARGIN_PX;
    }
    const align = this.resolvedPanelAlign(menu);
    const bounds = this.layoutBounds(menu);
    const estimatedWidth = this.estimatedPanelWidth(menu);
    if (align === "start") {
      const minLeft = bounds.left + _AppMenuOutletComponent.DESKTOP_MARGIN_PX;
      const maxLeft = Math.max(minLeft, bounds.right - estimatedWidth - _AppMenuOutletComponent.DESKTOP_MARGIN_PX);
      return Math.min(Math.max(rect.left, minLeft), maxLeft);
    }
    const minRight = bounds.left + estimatedWidth + _AppMenuOutletComponent.DESKTOP_MARGIN_PX;
    const maxRight = Math.max(minRight, bounds.right - _AppMenuOutletComponent.DESKTOP_MARGIN_PX);
    return Math.min(Math.max(rect.right, minRight), maxRight);
  }
  get hostTop() {
    const menu = this.activeMenu();
    if (!menu || this.isBottomMenu(menu) || this.isMobileMenu(menu)) {
      return null;
    }
    const rect = menu.triggerRect;
    if (!rect) {
      return _AppMenuOutletComponent.DESKTOP_MARGIN_PX;
    }
    return this.resolvedOpenUp(menu) ? rect.top - _AppMenuOutletComponent.DESKTOP_PANEL_GAP_PX : rect.bottom + _AppMenuOutletComponent.DESKTOP_PANEL_GAP_PX;
  }
  onViewportResize() {
    this.dispatcher.refreshActiveRect();
  }
  onWindowScroll() {
    this.dispatcher.refreshActiveRect();
  }
  containsTarget(target) {
    return target instanceof Node && this.hostRef.nativeElement.contains(target);
  }
  heightPx() {
    const height = this.hostRef.nativeElement.getBoundingClientRect().height;
    return Number.isFinite(height) ? Math.max(0, Math.ceil(height)) : 0;
  }
  isDocked() {
    return this.activeMenu()?.panelMode === "dock";
  }
  onOpenChange(open, menu) {
    if (this.isControlledMenu(menu)) {
      return;
    }
    if (!open) {
      this.dispatcher.close(menu.id);
    }
  }
  onItemSelect(event, menu) {
    const selectEvent = __spreadProps(__spreadValues({}, event), {
      context: event.context ?? menu.context
    });
    if (!this.isControlledMenu(menu) && this.shouldCloseOnItemSelect(event, menu)) {
      this.dispatcher.close(menu.id);
    }
    this.itemSelect.emit(selectEvent);
  }
  resolvedOpenUp(menu) {
    if (this.isMobileMenu(menu)) {
      return false;
    }
    if (menu.openUp) {
      return true;
    }
    const rect = menu.triggerRect;
    if (!rect) {
      return false;
    }
    const bounds = this.layoutBounds(menu);
    const spaceAbove = Math.max(0, rect.top - bounds.top - _AppMenuOutletComponent.DESKTOP_MARGIN_PX);
    const spaceBelow = Math.max(0, bounds.bottom - rect.bottom - _AppMenuOutletComponent.DESKTOP_MARGIN_PX);
    const estimatedHeight = this.estimatedPanelHeight(menu);
    if (spaceBelow < estimatedHeight && spaceAbove > spaceBelow) {
      return true;
    }
    return menu.openUp && spaceAbove >= Math.min(estimatedHeight, 140);
  }
  resolvedPanelAlign(menu) {
    if (menu.panelAlign !== "auto" || this.isMobileMenu(menu)) {
      return menu.panelAlign === "auto" ? "end" : menu.panelAlign;
    }
    const rect = menu.triggerRect;
    if (!rect) {
      return "end";
    }
    const bounds = this.layoutBounds(menu);
    const estimatedWidth = this.estimatedPanelWidth(menu);
    const spaceRight = Math.max(0, bounds.right - rect.left - _AppMenuOutletComponent.DESKTOP_MARGIN_PX);
    const spaceLeft = Math.max(0, rect.right - bounds.left - _AppMenuOutletComponent.DESKTOP_MARGIN_PX);
    if (spaceRight >= estimatedWidth) {
      return "start";
    }
    if (spaceLeft >= estimatedWidth) {
      return "end";
    }
    return spaceRight >= spaceLeft ? "start" : "end";
  }
  dockPanelToHost(menu) {
    return !this.isBottomMenu(menu) && !this.isMobileMenu(menu);
  }
  resolvedItems(menu) {
    return this.items ?? menu.items;
  }
  activeMenu() {
    return this.menu ?? this.dispatcher.activeMenu();
  }
  isControlledMenu(menu) {
    return this.menu?.id === menu.id;
  }
  shouldCloseOnItemSelect(event, menu) {
    if (event.action === "remove") {
      return false;
    }
    return event.item.closeOnSelect ?? (menu.model?.layout === "tabs" ? false : menu.closeOnSelect);
  }
  isMobileMenu(menu) {
    if (this.isBottomMenu(menu)) {
      return false;
    }
    if (menu.panelMode === "sheet") {
      return true;
    }
    if (menu.panelMode === "anchored") {
      return false;
    }
    if (typeof window === "undefined") {
      return false;
    }
    return window.innerWidth <= Math.max(1, Number(menu.mobileBreakpointPx) || 760);
  }
  isDockMenu(menu) {
    return menu.panelMode === "dock";
  }
  isFixedMenu(menu) {
    return menu.panelMode === "fixed";
  }
  isBottomMenu(menu) {
    return this.isDockMenu(menu) || this.isFixedMenu(menu);
  }
  viewportWidth() {
    if (typeof window === "undefined") {
      return _AppMenuOutletComponent.DESKTOP_MIN_PANEL_WIDTH_PX + _AppMenuOutletComponent.DESKTOP_MARGIN_PX * 2;
    }
    return window.innerWidth || document.documentElement.clientWidth;
  }
  viewportHeight() {
    if (typeof window === "undefined") {
      return 720;
    }
    return window.innerHeight || document.documentElement.clientHeight;
  }
  layoutBounds(menu) {
    const viewport = {
      left: 0,
      top: 0,
      right: this.viewportWidth(),
      bottom: this.viewportHeight()
    };
    if (typeof window === "undefined") {
      return viewport;
    }
    const triggerElement = menu.triggerElement ?? this.hostRef.nativeElement;
    let parent = triggerElement.parentElement;
    while (parent && parent !== document.body && parent !== document.documentElement) {
      const style = window.getComputedStyle(parent);
      if (this.isMenuLayoutBoundary(parent, style)) {
        const rect = parent.getBoundingClientRect();
        return {
          left: Math.max(viewport.left, rect.left),
          top: Math.max(viewport.top, rect.top),
          right: Math.min(viewport.right, rect.right),
          bottom: Math.min(viewport.bottom, rect.bottom)
        };
      }
      parent = parent.parentElement;
    }
    return viewport;
  }
  isMenuLayoutBoundary(element, style) {
    const overflow = `${style.overflow} ${style.overflowX} ${style.overflowY}`;
    if (/(auto|scroll)/.test(overflow)) {
      return true;
    }
    const className = element.className.toString();
    if (/(popup-body|scroll-area|popup-panel|app-popup-panel)/.test(className)) {
      return true;
    }
    if (/(hidden|clip)/.test(overflow)) {
      return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
    }
    return false;
  }
  estimatedPanelWidth(menu) {
    const labels = this.visibleItems(menu).map((item) => `${this.resolveLiveValue(item.label) ?? this.resolveLiveValue(item.description) ?? ""}`.trim());
    const longestLabel = labels.reduce((longest, label) => Math.max(longest, label.length), 0);
    const textWidth = longestLabel * 7.5 + 86;
    return Math.min(448, Math.max(_AppMenuOutletComponent.DESKTOP_MIN_PANEL_WIDTH_PX, textWidth));
  }
  estimatedPanelHeight(menu) {
    const titleHeight = `${this.resolveLiveValue(menu.title) ?? ""}`.trim() ? 34 : 0;
    const itemCount = Math.max(1, this.visibleItems(menu).length);
    const branchHeaderHeight = this.visibleItems(menu).some((item) => this.hasNestedItems(item)) ? 38 : 0;
    return Math.min(448, titleHeight + branchHeaderHeight + itemCount * 40 + 18);
  }
  hasNestedItems(item) {
    return (item.items?.length ?? 0) > 0 || appMenuModelGroups(item.model, item.groups ?? []).length > 0;
  }
  visibleItems(menu) {
    const items = this.resolvedItems(menu);
    if (items.length > 0) {
      return items;
    }
    const fallbackItems = [];
    for (const group of appMenuModelGroups(menu.model, menu.groups)) {
      fallbackItems.push(...group.items ?? []);
    }
    return fallbackItems;
  }
  resolveLiveValue(value) {
    if (typeof value === "function") {
      return value();
    }
    return value;
  }
  static \u0275fac = function AppMenuOutletComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppMenuOutletComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppMenuOutletComponent, selectors: [["app-menu-outlet"]], hostVars: 10, hostBindings: function AppMenuOutletComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("resize", function AppMenuOutletComponent_resize_HostBindingHandler() {
        return ctx.onViewportResize();
      }, \u0275\u0275resolveWindow)("scroll", function AppMenuOutletComponent_scroll_HostBindingHandler() {
        return ctx.onWindowScroll();
      }, \u0275\u0275resolveWindow);
    }
    if (rf & 2) {
      \u0275\u0275styleProp("left", ctx.hostLeft, "px")("top", ctx.hostTop, "px");
      \u0275\u0275classProp("app-menu-outlet--open", ctx.hostOpenClass)("app-menu-outlet--dock", ctx.hostDockClass)("app-menu-outlet--fixed", ctx.hostFixedClass);
    }
  }, inputs: { menu: "menu", items: "items" }, outputs: { itemSelect: "itemSelect" }, decls: 1, vars: 1, consts: [[3, "kind", "layout", "title", "filterable", "items", "model", "groups", "value", "open", "openUp", "panelAlign", "panelMode", "panelDockToHost", "mobileBreakpointPx", "closeOnSelect"], [3, "openChange", "itemSelect", "kind", "layout", "title", "filterable", "items", "model", "groups", "value", "open", "openUp", "panelAlign", "panelMode", "panelDockToHost", "mobileBreakpointPx", "closeOnSelect"]], template: function AppMenuOutletComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, AppMenuOutletComponent_Conditional_0_Template, 1, 15, "app-menu", 0);
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275conditional((tmp_0_0 = ctx.activeMenu()) ? 0 : -1, tmp_0_0);
    }
  }, dependencies: [CommonModule, AppMenuComponent], styles: ["\n[_nghost-%COMP%] {\n  --app-menu-outlet-overlay-z-index: 23900;\n  --app-menu-outlet-contained-z-index: 35;\n  position: fixed;\n  z-index: var(--app-menu-outlet-overlay-z-index);\n  display: none;\n  width: 0;\n  height: 0;\n  overflow: visible;\n}\n.app-menu-outlet--open[_nghost-%COMP%] {\n  display: block;\n}\n.app-menu-outlet--dock[_nghost-%COMP%], \n.app-menu-outlet--fixed[_nghost-%COMP%] {\n  position: absolute;\n  z-index: var(--app-menu-outlet-contained-z-index);\n  left: 0;\n  right: 0;\n  bottom: 0;\n  display: block;\n  width: auto;\n  height: auto;\n}\n/*# sourceMappingURL=menu-outlet.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppMenuOutletComponent, [{
    type: Component,
    args: [{ selector: "app-menu-outlet", standalone: true, imports: [CommonModule, AppMenuComponent], template: `
    @if (activeMenu(); as menu) {
      <app-menu
        [kind]="menu.kind"
        [layout]="menu.layout"
        [title]="menu.title"
        [filterable]="menu.filterable"
        [items]="resolvedItems(menu)"
        [model]="menu.model"
        [groups]="menu.groups"
        [value]="menu.value"
        [open]="true"
        [openUp]="resolvedOpenUp(menu)"
        [panelAlign]="resolvedPanelAlign(menu)"
        [panelMode]="menu.panelMode"
        [panelDockToHost]="dockPanelToHost(menu)"
        [mobileBreakpointPx]="menu.mobileBreakpointPx"
        [closeOnSelect]="menu.closeOnSelect"
        (openChange)="onOpenChange($event, menu)"
        (itemSelect)="onItemSelect($event, menu)"
      ></app-menu>
    }
  `, changeDetection: ChangeDetectionStrategy.OnPush, styles: ["/* src/app/shared/ui/components/core/menu/outlet/menu-outlet.component.scss */\n:host {\n  --app-menu-outlet-overlay-z-index: 23900;\n  --app-menu-outlet-contained-z-index: 35;\n  position: fixed;\n  z-index: var(--app-menu-outlet-overlay-z-index);\n  display: none;\n  width: 0;\n  height: 0;\n  overflow: visible;\n}\n:host(.app-menu-outlet--open) {\n  display: block;\n}\n:host(.app-menu-outlet--dock),\n:host(.app-menu-outlet--fixed) {\n  position: absolute;\n  z-index: var(--app-menu-outlet-contained-z-index);\n  left: 0;\n  right: 0;\n  bottom: 0;\n  display: block;\n  width: auto;\n  height: auto;\n}\n/*# sourceMappingURL=menu-outlet.component.css.map */\n"] }]
  }], null, { menu: [{
    type: Input
  }], items: [{
    type: Input
  }], itemSelect: [{
    type: Output
  }], hostOpenClass: [{
    type: HostBinding,
    args: ["class.app-menu-outlet--open"]
  }], hostDockClass: [{
    type: HostBinding,
    args: ["class.app-menu-outlet--dock"]
  }], hostFixedClass: [{
    type: HostBinding,
    args: ["class.app-menu-outlet--fixed"]
  }], hostLeft: [{
    type: HostBinding,
    args: ["style.left.px"]
  }], hostTop: [{
    type: HostBinding,
    args: ["style.top.px"]
  }], onViewportResize: [{
    type: HostListener,
    args: ["window:resize"]
  }], onWindowScroll: [{
    type: HostListener,
    args: ["window:scroll"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppMenuOutletComponent, { className: "AppMenuOutletComponent", filePath: "app/shared/ui/components/core/menu/outlet/menu-outlet.component.ts", lineNumber: 54 });
})();

export {
  IndicatorComponent,
  appMenuModelSummary,
  appMenuAlertCounter,
  AppMenuComponent,
  AppMenuDispatcher,
  AppMenuOutletComponent
};
//# sourceMappingURL=chunk-53UGBDSO.js.map
