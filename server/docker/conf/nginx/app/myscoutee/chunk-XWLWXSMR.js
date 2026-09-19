import {
  MAT_FORM_FIELD,
  MAT_INPUT_VALUE_ACCESSOR,
  MatDateRangeInput,
  MatDateRangePicker,
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatEndDate,
  MatFormField,
  MatFormFieldModule,
  MatInput,
  MatInputModule,
  MatStartDate,
  MatSuffix,
  TemplatePortal,
  createFlexibleConnectedPositionStrategy,
  createOverlayRef,
  createRepositionScrollStrategy
} from "./chunk-DYRCSW2W.js";
import {
  MatIconButton
} from "./chunk-LFSBDD6U.js";
import {
  ActiveDescendantKeyManager,
  DOWN_ARROW,
  DateAdapter,
  ENTER,
  ESCAPE,
  MAT_DATE_FORMATS,
  MAT_OPTION_PARENT_COMPONENT,
  MatNativeDateModule,
  MatOption,
  TAB,
  UP_ARROW,
  _animationsDisabled,
  hasModifierKey
} from "./chunk-WKZNFPJU.js";
import {
  CdkScrollableModule
} from "./chunk-QPFHBVSW.js";
import {
  _IdGenerator,
  _getEventTarget,
  _getFocusedElementPierceShadowDom
} from "./chunk-A3L6CHD4.js";
import {
  DefaultValueAccessor,
  Directionality,
  FormsModule,
  I18nPipe,
  MatIcon,
  MatIconModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControlStatus,
  NgModel,
  Validators
} from "./chunk-L6HJFJOR.js";
import {
  CommonModule,
  NgClass
} from "./chunk-SCHUURLR.js";
import {
  AppUtils
} from "./chunk-CYVMX3LD.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  HostAttributeToken,
  HostBinding,
  InjectionToken,
  Injector,
  Input,
  NgModule,
  Output,
  Renderer2,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation,
  __spreadProps,
  __spreadValues,
  afterNextRender,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  output,
  setClassMetadata,
  signal,
  untracked,
  viewChild,
  viewChildren,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵdomProperty,
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
  ɵɵpureFunction1,
  ɵɵqueryAdvance,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵviewQuerySignal
} from "./chunk-EV3I3YNV.js";

// node_modules/@angular/material/fesm2022/timepicker.mjs
var _c0 = ["panelTemplate"];
var _forTrack0 = ($index, $item) => $item.value;
function MatTimepicker_ng_template_0_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-option", 3);
    \u0275\u0275listener("onSelectionChange", function MatTimepicker_ng_template_0_For_2_Template_mat_option_onSelectionChange_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1._selectValue($event.source));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r4 = ctx.$implicit;
    \u0275\u0275property("value", option_r4.value);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(option_r4.label);
  }
}
function MatTimepicker_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275listener("animationend", function MatTimepicker_ng_template_0_Template_div_animationend_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1._handleAnimationEnd($event));
    });
    \u0275\u0275repeaterCreate(1, MatTimepicker_ng_template_0_For_2_Template, 2, 2, "mat-option", 2, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("mat-timepicker-panel-animations-enabled", !ctx_r1._animationsDisabled)("mat-timepicker-panel-exit", !ctx_r1.isOpen());
    \u0275\u0275property("id", ctx_r1.panelId);
    \u0275\u0275attribute("aria-label", ctx_r1.ariaLabel() || null)("aria-labelledby", ctx_r1._getAriaLabelledby());
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1._timeOptions);
  }
}
var _c1 = [[["", "matTimepickerToggleIcon", ""]]];
var _c2 = ["[matTimepickerToggleIcon]"];
function MatTimepickerToggle_ProjectionFallback_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 1);
    \u0275\u0275element(1, "path", 2);
    \u0275\u0275elementEnd();
  }
}
var INTERVAL_PATTERN = /^(\d*\.?\d+)\s*(h|hour|hours|m|min|minute|minutes|s|second|seconds)?$/i;
var MAT_TIMEPICKER_CONFIG = new InjectionToken("MAT_TIMEPICKER_CONFIG");
function parseInterval(value) {
  let result;
  if (value === null) {
    return null;
  } else if (typeof value === "number") {
    result = value;
  } else {
    if (value.trim().length === 0) {
      return null;
    }
    const parsed = value.match(INTERVAL_PATTERN);
    const amount = parsed ? parseFloat(parsed[1]) : null;
    const unit = parsed?.[2]?.toLowerCase() || null;
    if (!parsed || amount === null || isNaN(amount)) {
      return null;
    }
    if (unit === "h" || unit === "hour" || unit === "hours") {
      result = amount * 3600;
    } else if (unit === "m" || unit === "min" || unit === "minute" || unit === "minutes") {
      result = amount * 60;
    } else {
      result = amount;
    }
  }
  return result;
}
function generateOptions(adapter, formats, min, max, interval) {
  const options = [];
  let current = adapter.compareTime(min, max) < 1 ? min : max;
  while (adapter.sameDate(current, min) && adapter.compareTime(current, max) < 1 && adapter.isValid(current)) {
    options.push({
      value: current,
      label: adapter.format(current, formats.display.timeOptionLabel)
    });
    current = adapter.addSeconds(current, interval);
  }
  return options;
}
function validateAdapter(adapter, formats) {
  function missingAdapterError(provider) {
    return Error(`MatTimepicker: No provider found for ${provider}. You must add one of the following to your app config: provideNativeDateAdapter, provideDateFnsAdapter, provideLuxonDateAdapter, provideMomentDateAdapter, or provide a custom implementation.`);
  }
  if (!adapter) {
    throw missingAdapterError("DateAdapter");
  }
  if (!formats) {
    throw missingAdapterError("MAT_DATE_FORMATS");
  }
  if (formats.display.timeInput === void 0 || formats.display.timeOptionLabel === void 0 || formats.parse.timeInput === void 0) {
    throw new Error("MatTimepicker: Incomplete `MAT_DATE_FORMATS` has been provided. `MAT_DATE_FORMATS` must provide `display.timeInput`, `display.timeOptionLabel` and `parse.timeInput` formats in order to be compatible with MatTimepicker.");
  }
}
var MAT_TIMEPICKER_SCROLL_STRATEGY = new InjectionToken("MAT_TIMEPICKER_SCROLL_STRATEGY", {
  providedIn: "root",
  factory: () => {
    const injector = inject(Injector);
    return () => createRepositionScrollStrategy(injector);
  }
});
var MatTimepicker = class _MatTimepicker {
  _dir = inject(Directionality, {
    optional: true
  });
  _viewContainerRef = inject(ViewContainerRef);
  _injector = inject(Injector);
  _defaultConfig = inject(MAT_TIMEPICKER_CONFIG, {
    optional: true
  });
  _dateAdapter = inject(DateAdapter, {
    optional: true
  });
  _dateFormats = inject(MAT_DATE_FORMATS, {
    optional: true
  });
  _scrollStrategyFactory = inject(MAT_TIMEPICKER_SCROLL_STRATEGY);
  _animationsDisabled = _animationsDisabled();
  _isOpen = signal(false, ...ngDevMode ? [{
    debugName: "_isOpen"
  }] : []);
  _activeDescendant = signal(null, ...ngDevMode ? [{
    debugName: "_activeDescendant"
  }] : []);
  _input = signal(null, ...ngDevMode ? [{
    debugName: "_input"
  }] : []);
  _overlayRef = null;
  _portal = null;
  _optionsCacheKey = null;
  _localeChanges;
  _onOpenRender = null;
  _panelTemplate = viewChild.required("panelTemplate");
  _timeOptions = [];
  _options = viewChildren(MatOption, ...ngDevMode ? [{
    debugName: "_options"
  }] : []);
  _keyManager = new ActiveDescendantKeyManager(this._options, this._injector).withHomeAndEnd(true).withPageUpDown(true).withVerticalOrientation(true);
  interval = input(parseInterval(this._defaultConfig?.interval || null), __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "interval"
  } : {}), {
    transform: parseInterval
  }));
  options = input(null, ...ngDevMode ? [{
    debugName: "options"
  }] : []);
  isOpen = this._isOpen.asReadonly();
  selected = output();
  opened = output();
  closed = output();
  activeDescendant = this._activeDescendant.asReadonly();
  panelId = inject(_IdGenerator).getId("mat-timepicker-panel-");
  disableRipple = input(this._defaultConfig?.disableRipple ?? false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "disableRipple"
  } : {}), {
    transform: booleanAttribute
  }));
  ariaLabel = input(null, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "ariaLabel"
  } : {}), {
    alias: "aria-label"
  }));
  ariaLabelledby = input(null, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "ariaLabelledby"
  } : {}), {
    alias: "aria-labelledby"
  }));
  disabled = computed(() => !!this._input()?.disabled(), ...ngDevMode ? [{
    debugName: "disabled"
  }] : []);
  panelClass = input(...ngDevMode ? [void 0, {
    debugName: "panelClass"
  }] : []);
  constructor() {
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      validateAdapter(this._dateAdapter, this._dateFormats);
      effect(() => {
        const options = this.options();
        const interval = this.interval();
        if (options !== null && interval !== null) {
          throw new Error("Cannot specify both the `options` and `interval` inputs at the same time");
        } else if (options?.length === 0) {
          throw new Error("Value of `options` input cannot be an empty array");
        }
      });
    }
    const element = inject(ElementRef);
    element.nativeElement.setAttribute("mat-timepicker-panel-id", this.panelId);
    this._handleLocaleChanges();
    this._handleInputStateChanges();
    this._keyManager.change.subscribe(() => this._activeDescendant.set(this._keyManager.activeItem?.id || null));
  }
  open() {
    const input2 = this._input();
    if (!input2) {
      return;
    }
    input2.focus();
    if (this._isOpen()) {
      return;
    }
    this._isOpen.set(true);
    this._generateOptions();
    const overlayRef = this._getOverlayRef();
    overlayRef.updateSize({
      width: input2.getOverlayOrigin().nativeElement.offsetWidth
    });
    this._portal ??= new TemplatePortal(this._panelTemplate(), this._viewContainerRef);
    if (!overlayRef.hasAttached()) {
      overlayRef.attach(this._portal);
    }
    this._onOpenRender?.destroy();
    this._onOpenRender = afterNextRender(() => {
      const options = this._options();
      this._syncSelectedState(input2.value(), options, options[0]);
      this._onOpenRender = null;
    }, {
      injector: this._injector
    });
    this.opened.emit();
  }
  close() {
    if (this._isOpen()) {
      this._isOpen.set(false);
      this.closed.emit();
      if (this._animationsDisabled) {
        this._overlayRef?.detach();
      }
    }
  }
  registerInput(input2) {
    const currentInput = this._input();
    if (currentInput && input2 !== currentInput && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw new Error("MatTimepicker can only be registered with one input at a time");
    }
    this._input.set(input2);
  }
  ngOnDestroy() {
    this._keyManager.destroy();
    this._localeChanges?.unsubscribe();
    this._onOpenRender?.destroy();
    this._overlayRef?.dispose();
  }
  _getOverlayHost() {
    return this._overlayRef?.hostElement;
  }
  _selectValue(option) {
    this.close();
    this._keyManager.setActiveItem(option);
    this._options().forEach((current) => {
      if (current !== option) {
        current.deselect(false);
      }
    });
    this._input()?.timepickerValueAssigned(option.value);
    this.selected.emit({
      value: option.value,
      source: this
    });
    this._input()?.focus();
  }
  _getAriaLabelledby() {
    if (this.ariaLabel()) {
      return null;
    }
    return this.ariaLabelledby() || this._input()?.getLabelId() || null;
  }
  _handleAnimationEnd(event) {
    if (event.animationName === "_mat-timepicker-exit") {
      this._overlayRef?.detach();
    }
  }
  _getOverlayRef() {
    if (this._overlayRef) {
      return this._overlayRef;
    }
    const positionStrategy = createFlexibleConnectedPositionStrategy(this._injector, this._input().getOverlayOrigin()).withFlexibleDimensions(false).withPush(false).withTransformOriginOn(".mat-timepicker-panel").withPopoverLocation("inline").withPositions([{
      originX: "start",
      originY: "bottom",
      overlayX: "start",
      overlayY: "top"
    }, {
      originX: "start",
      originY: "top",
      overlayX: "start",
      overlayY: "bottom",
      panelClass: "mat-timepicker-above"
    }]);
    this._overlayRef = createOverlayRef(this._injector, {
      positionStrategy,
      scrollStrategy: this._scrollStrategyFactory(),
      direction: this._dir || "ltr",
      hasBackdrop: false,
      disableAnimations: this._animationsDisabled,
      panelClass: this.panelClass()
    });
    this._overlayRef.detachments().subscribe(() => this.close());
    this._overlayRef.keydownEvents().subscribe((event) => this._handleKeydown(event));
    this._overlayRef.outsidePointerEvents().subscribe((event) => {
      const target = _getEventTarget(event);
      const origin = this._input()?.getOverlayOrigin().nativeElement;
      if (target && origin && target !== origin && !origin.contains(target)) {
        this.close();
      }
    });
    return this._overlayRef;
  }
  _generateOptions() {
    const interval = this.interval() ?? 30 * 60;
    const options = this.options();
    if (options !== null) {
      this._timeOptions = options;
    } else {
      const input2 = this._input();
      const adapter = this._dateAdapter;
      const timeFormat = this._dateFormats.display.timeInput;
      const min = input2?.min() || adapter.setTime(adapter.today(), 0, 0, 0);
      const max = input2?.max() || adapter.setTime(adapter.today(), 23, 59, 0);
      const cacheKey = interval + "/" + adapter.format(min, timeFormat) + "/" + adapter.format(max, timeFormat);
      if (cacheKey !== this._optionsCacheKey) {
        this._optionsCacheKey = cacheKey;
        this._timeOptions = generateOptions(adapter, this._dateFormats, min, max, interval);
      }
    }
  }
  _syncSelectedState(value, options, fallback) {
    let hasSelected = false;
    for (const option of options) {
      if (value && this._dateAdapter.sameTime(option.value, value)) {
        option.select(false);
        scrollOptionIntoView(option, "center");
        untracked(() => this._keyManager.setActiveItem(option));
        hasSelected = true;
      } else {
        option.deselect(false);
      }
    }
    if (!hasSelected) {
      if (fallback) {
        untracked(() => this._keyManager.setActiveItem(fallback));
        scrollOptionIntoView(fallback, "center");
      } else {
        untracked(() => this._keyManager.setActiveItem(-1));
      }
    }
  }
  _handleKeydown(event) {
    const keyCode = event.keyCode;
    if (keyCode === TAB) {
      this.close();
    } else if (keyCode === ESCAPE && !hasModifierKey(event)) {
      event.preventDefault();
      this.close();
    } else if (keyCode === ENTER) {
      event.preventDefault();
      if (this._keyManager.activeItem) {
        this._selectValue(this._keyManager.activeItem);
      } else {
        this.close();
      }
    } else {
      const previousActive = this._keyManager.activeItem;
      this._keyManager.onKeydown(event);
      const currentActive = this._keyManager.activeItem;
      if (currentActive && currentActive !== previousActive) {
        scrollOptionIntoView(currentActive, "nearest");
      }
    }
  }
  _handleLocaleChanges() {
    this._localeChanges = this._dateAdapter.localeChanges.subscribe(() => {
      this._optionsCacheKey = null;
      if (this.isOpen()) {
        this._generateOptions();
      }
    });
  }
  _handleInputStateChanges() {
    effect(() => {
      const input2 = this._input();
      const options = this._options();
      if (this._isOpen() && input2) {
        this._syncSelectedState(input2.value(), options, null);
      }
    });
  }
  static \u0275fac = function MatTimepicker_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatTimepicker)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatTimepicker,
    selectors: [["mat-timepicker"]],
    viewQuery: function MatTimepicker_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuerySignal(ctx._panelTemplate, _c0, 5)(ctx._options, MatOption, 5);
      }
      if (rf & 2) {
        \u0275\u0275queryAdvance(2);
      }
    },
    inputs: {
      interval: [1, "interval"],
      options: [1, "options"],
      disableRipple: [1, "disableRipple"],
      ariaLabel: [1, "aria-label", "ariaLabel"],
      ariaLabelledby: [1, "aria-labelledby", "ariaLabelledby"],
      panelClass: [1, "panelClass"]
    },
    outputs: {
      selected: "selected",
      opened: "opened",
      closed: "closed"
    },
    exportAs: ["matTimepicker"],
    features: [\u0275\u0275ProvidersFeature([{
      provide: MAT_OPTION_PARENT_COMPONENT,
      useExisting: _MatTimepicker
    }])],
    decls: 2,
    vars: 0,
    consts: [["panelTemplate", ""], ["role", "listbox", 1, "mat-timepicker-panel", 3, "animationend", "id"], [3, "value"], [3, "onSelectionChange", "value"]],
    template: function MatTimepicker_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275template(0, MatTimepicker_ng_template_0_Template, 3, 7, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
      }
    },
    dependencies: [MatOption],
    styles: ["@keyframes _mat-timepicker-enter {\n  from {\n    opacity: 0;\n    transform: scaleY(0.8);\n  }\n  to {\n    opacity: 1;\n    transform: none;\n  }\n}\n@keyframes _mat-timepicker-exit {\n  from {\n    opacity: 1;\n  }\n  to {\n    opacity: 0;\n  }\n}\nmat-timepicker {\n  display: none;\n}\n\n.mat-timepicker-panel {\n  width: 100%;\n  max-height: 256px;\n  transform-origin: center top;\n  overflow: auto;\n  padding: 8px 0;\n  box-sizing: border-box;\n  position: relative;\n  border-bottom-left-radius: var(--mat-timepicker-container-shape, var(--mat-sys-corner-extra-small));\n  border-bottom-right-radius: var(--mat-timepicker-container-shape, var(--mat-sys-corner-extra-small));\n  box-shadow: var(--mat-timepicker-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));\n  background-color: var(--mat-timepicker-container-background-color, var(--mat-sys-surface-container));\n}\n@media (forced-colors: active) {\n  .mat-timepicker-panel {\n    outline: solid 1px;\n  }\n}\n.mat-timepicker-above .mat-timepicker-panel {\n  border-bottom-left-radius: 0;\n  border-bottom-right-radius: 0;\n  border-top-left-radius: var(--mat-timepicker-container-shape, var(--mat-sys-corner-extra-small));\n  border-top-right-radius: var(--mat-timepicker-container-shape, var(--mat-sys-corner-extra-small));\n}\n\n.mat-timepicker-panel-animations-enabled {\n  animation: _mat-timepicker-enter 120ms cubic-bezier(0, 0, 0.2, 1);\n}\n.mat-timepicker-panel-animations-enabled.mat-timepicker-panel-exit {\n  animation: _mat-timepicker-exit 100ms linear;\n}\n\n.mat-timepicker-input[readonly] {\n  cursor: pointer;\n}\n\n@media (forced-colors: active) {\n  .mat-timepicker-toggle-default-icon {\n    color: CanvasText;\n  }\n}\n"],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatTimepicker, [{
    type: Component,
    args: [{
      selector: "mat-timepicker",
      exportAs: "matTimepicker",
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      imports: [MatOption],
      providers: [{
        provide: MAT_OPTION_PARENT_COMPONENT,
        useExisting: MatTimepicker
      }],
      template: '<ng-template #panelTemplate>\n  <div\n    role="listbox"\n    class="mat-timepicker-panel"\n    [class.mat-timepicker-panel-animations-enabled]="!_animationsDisabled"\n    [class.mat-timepicker-panel-exit]="!isOpen()"\n    [attr.aria-label]="ariaLabel() || null"\n    [attr.aria-labelledby]="_getAriaLabelledby()"\n    [id]="panelId"\n    (animationend)="_handleAnimationEnd($event)">\n    @for (option of _timeOptions; track option.value) {\n      <mat-option\n        [value]="option.value"\n        (onSelectionChange)="_selectValue($event.source)">{{option.label}}</mat-option>\n    }\n  </div>\n</ng-template>\n',
      styles: ["@keyframes _mat-timepicker-enter {\n  from {\n    opacity: 0;\n    transform: scaleY(0.8);\n  }\n  to {\n    opacity: 1;\n    transform: none;\n  }\n}\n@keyframes _mat-timepicker-exit {\n  from {\n    opacity: 1;\n  }\n  to {\n    opacity: 0;\n  }\n}\nmat-timepicker {\n  display: none;\n}\n\n.mat-timepicker-panel {\n  width: 100%;\n  max-height: 256px;\n  transform-origin: center top;\n  overflow: auto;\n  padding: 8px 0;\n  box-sizing: border-box;\n  position: relative;\n  border-bottom-left-radius: var(--mat-timepicker-container-shape, var(--mat-sys-corner-extra-small));\n  border-bottom-right-radius: var(--mat-timepicker-container-shape, var(--mat-sys-corner-extra-small));\n  box-shadow: var(--mat-timepicker-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));\n  background-color: var(--mat-timepicker-container-background-color, var(--mat-sys-surface-container));\n}\n@media (forced-colors: active) {\n  .mat-timepicker-panel {\n    outline: solid 1px;\n  }\n}\n.mat-timepicker-above .mat-timepicker-panel {\n  border-bottom-left-radius: 0;\n  border-bottom-right-radius: 0;\n  border-top-left-radius: var(--mat-timepicker-container-shape, var(--mat-sys-corner-extra-small));\n  border-top-right-radius: var(--mat-timepicker-container-shape, var(--mat-sys-corner-extra-small));\n}\n\n.mat-timepicker-panel-animations-enabled {\n  animation: _mat-timepicker-enter 120ms cubic-bezier(0, 0, 0.2, 1);\n}\n.mat-timepicker-panel-animations-enabled.mat-timepicker-panel-exit {\n  animation: _mat-timepicker-exit 100ms linear;\n}\n\n.mat-timepicker-input[readonly] {\n  cursor: pointer;\n}\n\n@media (forced-colors: active) {\n  .mat-timepicker-toggle-default-icon {\n    color: CanvasText;\n  }\n}\n"]
    }]
  }], () => [], {
    _panelTemplate: [{
      type: ViewChild,
      args: ["panelTemplate", {
        isSignal: true
      }]
    }],
    _options: [{
      type: ViewChildren,
      args: [forwardRef(() => MatOption), {
        isSignal: true
      }]
    }],
    interval: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "interval",
        required: false
      }]
    }],
    options: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "options",
        required: false
      }]
    }],
    selected: [{
      type: Output,
      args: ["selected"]
    }],
    opened: [{
      type: Output,
      args: ["opened"]
    }],
    closed: [{
      type: Output,
      args: ["closed"]
    }],
    disableRipple: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "disableRipple",
        required: false
      }]
    }],
    ariaLabel: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "aria-label",
        required: false
      }]
    }],
    ariaLabelledby: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "aria-labelledby",
        required: false
      }]
    }],
    panelClass: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "panelClass",
        required: false
      }]
    }]
  });
})();
function scrollOptionIntoView(option, position) {
  option._getHostElement().scrollIntoView({
    block: position,
    inline: position
  });
}
var MatTimepickerInput = class _MatTimepickerInput {
  _elementRef = inject(ElementRef);
  _dateAdapter = inject(DateAdapter, {
    optional: true
  });
  _dateFormats = inject(MAT_DATE_FORMATS, {
    optional: true
  });
  _formField = inject(MAT_FORM_FIELD, {
    optional: true
  });
  _onChange;
  _onTouched;
  _validatorOnChange;
  _cleanupClick;
  _accessorDisabled = signal(false, ...ngDevMode ? [{
    debugName: "_accessorDisabled"
  }] : []);
  _localeSubscription;
  _timepickerSubscription;
  _validator;
  _lastValueValid = true;
  _minValid = true;
  _maxValid = true;
  _lastValidDate = null;
  _ariaActiveDescendant = computed(() => {
    const timepicker = this.timepicker();
    const isOpen = timepicker.isOpen();
    const activeDescendant = timepicker.activeDescendant();
    return isOpen && activeDescendant ? activeDescendant : null;
  }, ...ngDevMode ? [{
    debugName: "_ariaActiveDescendant"
  }] : []);
  _ariaExpanded = computed(() => this.timepicker().isOpen() + "", ...ngDevMode ? [{
    debugName: "_ariaExpanded"
  }] : []);
  _ariaControls = computed(() => {
    const timepicker = this.timepicker();
    return timepicker.isOpen() ? timepicker.panelId : null;
  }, ...ngDevMode ? [{
    debugName: "_ariaControls"
  }] : []);
  value = model(null, ...ngDevMode ? [{
    debugName: "value"
  }] : []);
  timepicker = input.required(__spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "timepicker"
  } : {}), {
    alias: "matTimepicker"
  }));
  min = input(null, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "min"
  } : {}), {
    alias: "matTimepickerMin",
    transform: (value) => this._transformDateInput(value)
  }));
  max = input(null, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "max"
  } : {}), {
    alias: "matTimepickerMax",
    transform: (value) => this._transformDateInput(value)
  }));
  openOnClick = input(true, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "openOnClick"
  } : {}), {
    alias: "matTimepickerOpenOnClick",
    transform: booleanAttribute
  }));
  disabled = computed(() => this.disabledInput() || this._accessorDisabled(), ...ngDevMode ? [{
    debugName: "disabled"
  }] : []);
  disabledInput = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "disabledInput"
  } : {}), {
    transform: booleanAttribute,
    alias: "disabled"
  }));
  constructor() {
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      validateAdapter(this._dateAdapter, this._dateFormats);
    }
    const renderer = inject(Renderer2);
    this._validator = this._getValidator();
    this._updateFormsState();
    this._registerTimepicker();
    this._localeSubscription = this._dateAdapter.localeChanges.subscribe(() => {
      if (!this._hasFocus()) {
        this._formatValue(this.value());
      }
    });
    this._cleanupClick = renderer.listen(this.getOverlayOrigin().nativeElement, "click", this._handleClick);
  }
  writeValue(value) {
    const deserialized = this._dateAdapter.deserialize(value);
    this.value.set(this._dateAdapter.getValidDateOrNull(deserialized));
  }
  registerOnChange(fn) {
    this._onChange = fn;
  }
  registerOnTouched(fn) {
    this._onTouched = fn;
  }
  setDisabledState(isDisabled) {
    this._accessorDisabled.set(isDisabled);
  }
  validate(control) {
    return this._validator(control);
  }
  registerOnValidatorChange(fn) {
    this._validatorOnChange = fn;
  }
  getOverlayOrigin() {
    return this._formField?.getConnectedOverlayOrigin() || this._elementRef;
  }
  focus() {
    this._elementRef.nativeElement.focus();
  }
  ngOnDestroy() {
    this._cleanupClick();
    this._timepickerSubscription?.unsubscribe();
    this._localeSubscription.unsubscribe();
  }
  getLabelId() {
    return this._formField?.getLabelId() || null;
  }
  _handleClick = (event) => {
    if (this.disabled() || !this.openOnClick()) {
      return;
    }
    const target = _getEventTarget(event);
    const overlayHost = this.timepicker()._getOverlayHost();
    if (!target || !overlayHost || !overlayHost.contains(target)) {
      this.timepicker().open();
    }
  };
  _handleInput(event) {
    const value = event.target.value;
    const currentValue = this.value();
    const date = this._dateAdapter.parseTime(value, this._dateFormats.parse.timeInput);
    const hasChanged = !this._dateAdapter.sameTime(date, currentValue);
    if (!date || hasChanged || !!(value && !currentValue)) {
      this._assignUserSelection(date, true);
    } else {
      this._validatorOnChange?.();
    }
  }
  _handleBlur() {
    const value = this.value();
    if (value && this._isValid(value)) {
      this._formatValue(value);
    }
    if (!this.timepicker().isOpen()) {
      this._onTouched?.();
    }
  }
  _handleKeydown(event) {
    if (this.timepicker().isOpen() || this.disabled()) {
      return;
    }
    if (event.keyCode === ESCAPE && !hasModifierKey(event) && this.value() !== null) {
      event.preventDefault();
      this.value.set(null);
      this._formatValue(null);
    } else if (event.keyCode === DOWN_ARROW || event.keyCode === UP_ARROW) {
      event.preventDefault();
      this.timepicker().open();
    }
  }
  timepickerValueAssigned(value) {
    if (!this._dateAdapter.sameTime(value, this.value())) {
      this._assignUserSelection(value, true);
      this._formatValue(value);
    }
  }
  _updateFormsState() {
    effect(() => {
      const {
        _dateAdapter: adapter,
        _lastValueValid: prevValueValid,
        _minValid: prevMinValid,
        _maxValid: prevMaxValid
      } = this;
      const value = adapter.deserialize(this.value());
      const min = this.min();
      const max = this.max();
      const valueValid = this._lastValueValid = this._isValid(value);
      this._minValid = !min || !value || !valueValid || adapter.compareTime(min, value) <= 0;
      this._maxValid = !max || !value || !valueValid || adapter.compareTime(max, value) >= 0;
      const stateChanged = prevValueValid !== valueValid || prevMinValid !== this._minValid || prevMaxValid !== this._maxValid;
      if (!this._hasFocus()) {
        this._formatValue(value);
      }
      if (value && valueValid) {
        this._lastValidDate = value;
      }
      if (stateChanged) {
        this._validatorOnChange?.();
      }
    });
  }
  _registerTimepicker() {
    effect(() => {
      const timepicker = this.timepicker();
      timepicker.registerInput(this);
      timepicker.closed.subscribe(() => this._onTouched?.());
    });
  }
  _assignUserSelection(selection, propagateToAccessor) {
    let toAssign;
    if (selection == null || !this._isValid(selection)) {
      toAssign = selection;
    } else {
      const adapter = this._dateAdapter;
      const target = adapter.getValidDateOrNull(this._lastValidDate || this.value());
      const hours = adapter.getHours(selection);
      const minutes = adapter.getMinutes(selection);
      const seconds = adapter.getSeconds(selection);
      toAssign = target ? adapter.setTime(target, hours, minutes, seconds) : selection;
    }
    if (propagateToAccessor) {
      this._onChange?.(toAssign);
    }
    this.value.set(toAssign);
  }
  _formatValue(value) {
    value = this._dateAdapter.getValidDateOrNull(value);
    this._elementRef.nativeElement.value = value == null ? "" : this._dateAdapter.format(value, this._dateFormats.display.timeInput);
  }
  _isValid(value) {
    return !value || this._dateAdapter.isValid(value);
  }
  _transformDateInput(value) {
    const date = typeof value === "string" ? this._dateAdapter.parseTime(value, this._dateFormats.parse.timeInput) : this._dateAdapter.deserialize(value);
    return date && this._dateAdapter.isValid(date) ? date : null;
  }
  _hasFocus() {
    return _getFocusedElementPierceShadowDom() === this._elementRef.nativeElement;
  }
  _getValidator() {
    return Validators.compose([() => this._lastValueValid ? null : {
      "matTimepickerParse": {
        "text": this._elementRef.nativeElement.value
      }
    }, (control) => this._minValid ? null : {
      "matTimepickerMin": {
        "min": this.min(),
        "actual": this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value))
      }
    }, (control) => this._maxValid ? null : {
      "matTimepickerMax": {
        "max": this.max(),
        "actual": this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value))
      }
    }]);
  }
  static \u0275fac = function MatTimepickerInput_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatTimepickerInput)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatTimepickerInput,
    selectors: [["input", "matTimepicker", ""]],
    hostAttrs: ["role", "combobox", "type", "text", "aria-haspopup", "listbox", 1, "mat-timepicker-input"],
    hostVars: 5,
    hostBindings: function MatTimepickerInput_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("blur", function MatTimepickerInput_blur_HostBindingHandler() {
          return ctx._handleBlur();
        })("input", function MatTimepickerInput_input_HostBindingHandler($event) {
          return ctx._handleInput($event);
        })("keydown", function MatTimepickerInput_keydown_HostBindingHandler($event) {
          return ctx._handleKeydown($event);
        });
      }
      if (rf & 2) {
        let tmp_4_0;
        \u0275\u0275domProperty("disabled", ctx.disabled());
        \u0275\u0275attribute("aria-activedescendant", ctx._ariaActiveDescendant())("aria-expanded", ctx._ariaExpanded())("aria-controls", ctx._ariaControls())("mat-timepicker-id", (tmp_4_0 = ctx.timepicker()) == null ? null : tmp_4_0.panelId);
      }
    },
    inputs: {
      value: [1, "value"],
      timepicker: [1, "matTimepicker", "timepicker"],
      min: [1, "matTimepickerMin", "min"],
      max: [1, "matTimepickerMax", "max"],
      openOnClick: [1, "matTimepickerOpenOnClick", "openOnClick"],
      disabledInput: [1, "disabled", "disabledInput"]
    },
    outputs: {
      value: "valueChange"
    },
    exportAs: ["matTimepickerInput"],
    features: [\u0275\u0275ProvidersFeature([{
      provide: NG_VALUE_ACCESSOR,
      useExisting: _MatTimepickerInput,
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: _MatTimepickerInput,
      multi: true
    }, {
      provide: MAT_INPUT_VALUE_ACCESSOR,
      useExisting: _MatTimepickerInput
    }])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatTimepickerInput, [{
    type: Directive,
    args: [{
      selector: "input[matTimepicker]",
      exportAs: "matTimepickerInput",
      host: {
        "class": "mat-timepicker-input",
        "role": "combobox",
        "type": "text",
        "aria-haspopup": "listbox",
        "[attr.aria-activedescendant]": "_ariaActiveDescendant()",
        "[attr.aria-expanded]": "_ariaExpanded()",
        "[attr.aria-controls]": "_ariaControls()",
        "[attr.mat-timepicker-id]": "timepicker()?.panelId",
        "[disabled]": "disabled()",
        "(blur)": "_handleBlur()",
        "(input)": "_handleInput($event)",
        "(keydown)": "_handleKeydown($event)"
      },
      providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: MatTimepickerInput,
        multi: true
      }, {
        provide: NG_VALIDATORS,
        useExisting: MatTimepickerInput,
        multi: true
      }, {
        provide: MAT_INPUT_VALUE_ACCESSOR,
        useExisting: MatTimepickerInput
      }]
    }]
  }], () => [], {
    value: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "value",
        required: false
      }]
    }, {
      type: Output,
      args: ["valueChange"]
    }],
    timepicker: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "matTimepicker",
        required: true
      }]
    }],
    min: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "matTimepickerMin",
        required: false
      }]
    }],
    max: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "matTimepickerMax",
        required: false
      }]
    }],
    openOnClick: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "matTimepickerOpenOnClick",
        required: false
      }]
    }],
    disabledInput: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "disabled",
        required: false
      }]
    }]
  });
})();
var MatTimepickerToggle = class _MatTimepickerToggle {
  _defaultConfig = inject(MAT_TIMEPICKER_CONFIG, {
    optional: true
  });
  _defaultTabIndex = (() => {
    const value = inject(new HostAttributeToken("tabindex"), {
      optional: true
    });
    const parsed = Number(value);
    return isNaN(parsed) ? null : parsed;
  })();
  _isDisabled = computed(() => {
    const timepicker = this.timepicker();
    return this.disabled() || timepicker.disabled();
  }, ...ngDevMode ? [{
    debugName: "_isDisabled"
  }] : []);
  timepicker = input.required(__spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "timepicker"
  } : {}), {
    alias: "for"
  }));
  ariaLabel = input(void 0, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "ariaLabel"
  } : {}), {
    alias: "aria-label"
  }));
  ariaLabelledby = input(void 0, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "ariaLabelledby"
  } : {}), {
    alias: "aria-labelledby"
  }));
  _defaultAriaLabel = "Open timepicker options";
  disabled = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "disabled"
  } : {}), {
    transform: booleanAttribute,
    alias: "disabled"
  }));
  tabIndex = input(this._defaultTabIndex, ...ngDevMode ? [{
    debugName: "tabIndex"
  }] : []);
  disableRipple = input(this._defaultConfig?.disableRipple ?? false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "disableRipple"
  } : {}), {
    transform: booleanAttribute
  }));
  _open(event) {
    if (this.timepicker() && !this._isDisabled()) {
      this.timepicker().open();
      event.stopPropagation();
    }
  }
  getAriaLabel() {
    return this.ariaLabelledby() ? null : this.ariaLabel() || this._defaultAriaLabel;
  }
  static \u0275fac = function MatTimepickerToggle_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatTimepickerToggle)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatTimepickerToggle,
    selectors: [["mat-timepicker-toggle"]],
    hostAttrs: [1, "mat-timepicker-toggle"],
    hostVars: 1,
    hostBindings: function MatTimepickerToggle_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("click", function MatTimepickerToggle_click_HostBindingHandler($event) {
          return ctx._open($event);
        });
      }
      if (rf & 2) {
        \u0275\u0275attribute("tabindex", null);
      }
    },
    inputs: {
      timepicker: [1, "for", "timepicker"],
      ariaLabel: [1, "aria-label", "ariaLabel"],
      ariaLabelledby: [1, "aria-labelledby", "ariaLabelledby"],
      disabled: [1, "disabled"],
      tabIndex: [1, "tabIndex"],
      disableRipple: [1, "disableRipple"]
    },
    exportAs: ["matTimepickerToggle"],
    ngContentSelectors: _c2,
    decls: 3,
    vars: 6,
    consts: [["matIconButton", "", "type", "button", "aria-haspopup", "listbox", 3, "tabIndex", "disabled", "disableRipple"], ["height", "24px", "width", "24px", "viewBox", "0 -960 960 960", "fill", "currentColor", "focusable", "false", "aria-hidden", "true", 1, "mat-timepicker-toggle-default-icon"], ["d", "m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"]],
    template: function MatTimepickerToggle_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef(_c1);
        \u0275\u0275elementStart(0, "button", 0);
        \u0275\u0275projection(1, 0, null, MatTimepickerToggle_ProjectionFallback_1_Template, 2, 0);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275property("tabIndex", ctx._isDisabled() ? -1 : ctx.tabIndex())("disabled", ctx._isDisabled())("disableRipple", ctx.disableRipple());
        \u0275\u0275attribute("aria-label", ctx.getAriaLabel())("aria-labelledby", ctx.ariaLabelledby())("aria-expanded", ctx.timepicker().isOpen());
      }
    },
    dependencies: [MatIconButton],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatTimepickerToggle, [{
    type: Component,
    args: [{
      selector: "mat-timepicker-toggle",
      host: {
        "class": "mat-timepicker-toggle",
        "[attr.tabindex]": "null",
        "(click)": "_open($event)"
      },
      exportAs: "matTimepickerToggle",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [MatIconButton],
      template: '<button\n  matIconButton\n  type="button"\n  aria-haspopup="listbox"\n  [attr.aria-label]="getAriaLabel()"\n  [attr.aria-labelledby]="ariaLabelledby()"\n  [attr.aria-expanded]="timepicker().isOpen()"\n  [tabIndex]="_isDisabled() ? -1 : tabIndex()"\n  [disabled]="_isDisabled()"\n  [disableRipple]="disableRipple()">\n\n  <ng-content select="[matTimepickerToggleIcon]">\n    <svg\n      class="mat-timepicker-toggle-default-icon"\n      height="24px"\n      width="24px"\n      viewBox="0 -960 960 960"\n      fill="currentColor"\n      focusable="false"\n      aria-hidden="true">\n      <path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/>\n    </svg>\n  </ng-content>\n</button>\n'
    }]
  }], null, {
    timepicker: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "for",
        required: true
      }]
    }],
    ariaLabel: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "aria-label",
        required: false
      }]
    }],
    ariaLabelledby: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "aria-labelledby",
        required: false
      }]
    }],
    disabled: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "disabled",
        required: false
      }]
    }],
    tabIndex: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "tabIndex",
        required: false
      }]
    }],
    disableRipple: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "disableRipple",
        required: false
      }]
    }]
  });
})();
var MatTimepickerModule = class _MatTimepickerModule {
  static \u0275fac = function MatTimepickerModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatTimepickerModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _MatTimepickerModule,
    imports: [MatTimepicker, MatTimepickerInput, MatTimepickerToggle],
    exports: [CdkScrollableModule, MatTimepicker, MatTimepickerInput, MatTimepickerToggle]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [MatTimepicker, MatTimepickerToggle, CdkScrollableModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatTimepickerModule, [{
    type: NgModule,
    args: [{
      imports: [MatTimepicker, MatTimepickerInput, MatTimepickerToggle],
      exports: [CdkScrollableModule, MatTimepicker, MatTimepickerInput, MatTimepickerToggle]
    }]
  }], null, null);
})();

// src/app/shared/ui/components/core/form/inputs/date-input/date-input.component.ts
var _c02 = (a0) => ({ updateOn: a0 });
function DateInputComponent_Conditional_0_Conditional_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1, "*");
    \u0275\u0275elementEnd();
  }
}
function DateInputComponent_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 13);
    \u0275\u0275text(1);
    \u0275\u0275conditionalCreate(2, DateInputComponent_Conditional_0_Conditional_2_Conditional_2_Template, 2, 0, "strong");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.required ? 2 : -1);
  }
}
function DateInputComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8)(1, "label", 12);
    \u0275\u0275conditionalCreate(2, DateInputComponent_Conditional_0_Conditional_2_Template, 3, 2, "span", 13);
    \u0275\u0275elementStart(3, "div", 14)(4, "mat-form-field", 15)(5, "input", 16);
    \u0275\u0275listener("ngModelChange", function DateInputComponent_Conditional_0_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onTimeOnlyChange($event));
    })("blur", function DateInputComponent_Conditional_0_Template_input_blur_5_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.markTouched());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 17);
    \u0275\u0275pipe(7, "i18n");
    \u0275\u0275listener("mousedown", function DateInputComponent_Conditional_0_Template_button_mousedown_6_listener($event) {
      return $event.preventDefault();
    })("click", function DateInputComponent_Conditional_0_Template_button_click_6_listener($event) {
      \u0275\u0275restoreView(_r1);
      const timeOnlyPicker_r3 = \u0275\u0275reference(11);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleTimePicker(timeOnlyPicker_r3, "time", $event));
    });
    \u0275\u0275elementStart(8, "mat-icon");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "mat-timepicker", 18, 0);
    \u0275\u0275listener("opened", function DateInputComponent_Conditional_0_Template_mat_timepicker_opened_10_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.setPickerOpen("time", true));
    })("closed", function DateInputComponent_Conditional_0_Template_mat_timepicker_closed_10_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.setPickerOpen("time", false));
    });
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const timeOnlyPicker_r3 = \u0275\u0275reference(11);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.label ? 2 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275property("matTimepicker", timeOnlyPicker_r3)("matTimepickerOpenOnClick", ctx_r1.timeOpenOnClick())("ngModel", ctx_r1.singleTimeValue)("disabled", ctx_r1.inputDisabled());
    \u0275\u0275advance();
    \u0275\u0275classProp("date-input__toggle--open", ctx_r1.isPickerOpen("time"));
    \u0275\u0275property("disabled", ctx_r1.inputDisabled());
    \u0275\u0275attribute("aria-pressed", ctx_r1.isPickerOpen("time"))("aria-label", \u0275\u0275pipeBind1(7, 11, "date.input.toggle.time.aria"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.pickerIcon("time", "schedule"));
  }
}
function DateInputComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 9)(1, "label", 12)(2, "div", 14)(3, "mat-form-field", 19)(4, "mat-date-range-input", 20)(5, "input", 21);
    \u0275\u0275listener("ngModelChange", function DateInputComponent_Conditional_1_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onStartDateChange($event));
    })("blur", function DateInputComponent_Conditional_1_Template_input_blur_5_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.markTouched());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "input", 22);
    \u0275\u0275listener("ngModelChange", function DateInputComponent_Conditional_1_Template_input_ngModelChange_6_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onEndDateChange($event));
    })("blur", function DateInputComponent_Conditional_1_Template_input_blur_6_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.markTouched());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "button", 17);
    \u0275\u0275pipe(8, "i18n");
    \u0275\u0275listener("mousedown", function DateInputComponent_Conditional_1_Template_button_mousedown_7_listener($event) {
      return $event.preventDefault();
    })("click", function DateInputComponent_Conditional_1_Template_button_click_7_listener($event) {
      \u0275\u0275restoreView(_r4);
      const rangePicker_r5 = \u0275\u0275reference(12);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleDateRangePicker(rangePicker_r5, "range-date", $event));
    });
    \u0275\u0275elementStart(9, "mat-icon");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "mat-date-range-picker", 18, 1);
    \u0275\u0275listener("opened", function DateInputComponent_Conditional_1_Template_mat_date_range_picker_opened_11_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.setPickerOpen("range-date", true));
    })("closed", function DateInputComponent_Conditional_1_Template_mat_date_range_picker_closed_11_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.setPickerOpen("range-date", false));
    });
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const rangePicker_r5 = \u0275\u0275reference(12);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("rangePicker", rangePicker_r5)("min", ctx_r1.resolvedStartMin())("max", ctx_r1.resolvedEndMax());
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r1.startDateValue)("min", ctx_r1.resolvedStartMin())("max", ctx_r1.resolvedStartMax())("disabled", ctx_r1.inputDisabled())("placeholder", ctx_r1.startPlaceholder);
    \u0275\u0275attribute("aria-label", ctx_r1.startLabel);
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r1.endDateValue)("min", ctx_r1.resolvedEndMin())("max", ctx_r1.resolvedEndMax())("disabled", ctx_r1.inputDisabled())("placeholder", ctx_r1.endPlaceholder);
    \u0275\u0275attribute("aria-label", ctx_r1.endLabel);
    \u0275\u0275advance();
    \u0275\u0275classProp("date-input__toggle--open", ctx_r1.isPickerOpen("range-date"));
    \u0275\u0275property("disabled", ctx_r1.inputDisabled());
    \u0275\u0275attribute("aria-pressed", ctx_r1.isPickerOpen("range-date"))("aria-label", \u0275\u0275pipeBind1(8, 21, "date.input.toggle.range.aria"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.pickerIcon("range-date", "calendar_month"));
  }
}
function DateInputComponent_Conditional_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1, "*");
    \u0275\u0275elementEnd();
  }
}
function DateInputComponent_Conditional_2_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-form-field", 15)(1, "input", 16);
    \u0275\u0275listener("ngModelChange", function DateInputComponent_Conditional_2_Conditional_14_Template_input_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onStartTimeChange($event));
    })("blur", function DateInputComponent_Conditional_2_Conditional_14_Template_input_blur_1_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.markTouched());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 17);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275listener("mousedown", function DateInputComponent_Conditional_2_Conditional_14_Template_button_mousedown_2_listener($event) {
      return $event.preventDefault();
    })("click", function DateInputComponent_Conditional_2_Conditional_14_Template_button_click_2_listener($event) {
      \u0275\u0275restoreView(_r8);
      const startTimePicker_r9 = \u0275\u0275reference(7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleTimePicker(startTimePicker_r9, "start-time", $event));
    });
    \u0275\u0275elementStart(4, "mat-icon");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "mat-timepicker", 18, 4);
    \u0275\u0275listener("opened", function DateInputComponent_Conditional_2_Conditional_14_Template_mat_timepicker_opened_6_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.setPickerOpen("start-time", true));
    })("closed", function DateInputComponent_Conditional_2_Conditional_14_Template_mat_timepicker_closed_6_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.setPickerOpen("start-time", false));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const startTimePicker_r9 = \u0275\u0275reference(7);
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("matTimepicker", startTimePicker_r9)("matTimepickerOpenOnClick", ctx_r1.timeOpenOnClick())("ngModel", ctx_r1.startTimeValue)("disabled", ctx_r1.inputDisabled());
    \u0275\u0275advance();
    \u0275\u0275classProp("date-input__toggle--open", ctx_r1.isPickerOpen("start-time"));
    \u0275\u0275property("disabled", ctx_r1.inputDisabled());
    \u0275\u0275attribute("aria-pressed", ctx_r1.isPickerOpen("start-time"))("aria-label", \u0275\u0275pipeBind1(3, 10, "date.input.toggle.start.time.aria"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.pickerIcon("start-time", "schedule"));
  }
}
function DateInputComponent_Conditional_2_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1, "*");
    \u0275\u0275elementEnd();
  }
}
function DateInputComponent_Conditional_2_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-form-field", 15)(1, "input", 16);
    \u0275\u0275listener("ngModelChange", function DateInputComponent_Conditional_2_Conditional_28_Template_input_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onEndTimeChange($event));
    })("blur", function DateInputComponent_Conditional_2_Conditional_28_Template_input_blur_1_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.markTouched());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 17);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275listener("mousedown", function DateInputComponent_Conditional_2_Conditional_28_Template_button_mousedown_2_listener($event) {
      return $event.preventDefault();
    })("click", function DateInputComponent_Conditional_2_Conditional_28_Template_button_click_2_listener($event) {
      \u0275\u0275restoreView(_r11);
      const endTimePicker_r12 = \u0275\u0275reference(7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleTimePicker(endTimePicker_r12, "end-time", $event));
    });
    \u0275\u0275elementStart(4, "mat-icon");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "mat-timepicker", 18, 5);
    \u0275\u0275listener("opened", function DateInputComponent_Conditional_2_Conditional_28_Template_mat_timepicker_opened_6_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.setPickerOpen("end-time", true));
    })("closed", function DateInputComponent_Conditional_2_Conditional_28_Template_mat_timepicker_closed_6_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.setPickerOpen("end-time", false));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const endTimePicker_r12 = \u0275\u0275reference(7);
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("matTimepicker", endTimePicker_r12)("matTimepickerOpenOnClick", ctx_r1.timeOpenOnClick())("ngModel", ctx_r1.endTimeValue)("disabled", ctx_r1.inputDisabled());
    \u0275\u0275advance();
    \u0275\u0275classProp("date-input__toggle--open", ctx_r1.isPickerOpen("end-time"));
    \u0275\u0275property("disabled", ctx_r1.inputDisabled());
    \u0275\u0275attribute("aria-pressed", ctx_r1.isPickerOpen("end-time"))("aria-label", \u0275\u0275pipeBind1(3, 10, "date.input.toggle.end.time.aria"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.pickerIcon("end-time", "schedule"));
  }
}
function DateInputComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 23)(1, "label", 12)(2, "span", 13);
    \u0275\u0275text(3);
    \u0275\u0275conditionalCreate(4, DateInputComponent_Conditional_2_Conditional_4_Template, 2, 0, "strong");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 14)(6, "mat-form-field", 24)(7, "input", 25);
    \u0275\u0275listener("ngModelChange", function DateInputComponent_Conditional_2_Template_input_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onStartDateChange($event));
    })("blur", function DateInputComponent_Conditional_2_Template_input_blur_7_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.markTouched());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 17);
    \u0275\u0275pipe(9, "i18n");
    \u0275\u0275listener("mousedown", function DateInputComponent_Conditional_2_Template_button_mousedown_8_listener($event) {
      return $event.preventDefault();
    })("click", function DateInputComponent_Conditional_2_Template_button_click_8_listener($event) {
      \u0275\u0275restoreView(_r6);
      const startPicker_r7 = \u0275\u0275reference(13);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleDatePicker(startPicker_r7, "start-date", $event));
    });
    \u0275\u0275elementStart(10, "mat-icon");
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "mat-datepicker", 18, 2);
    \u0275\u0275listener("opened", function DateInputComponent_Conditional_2_Template_mat_datepicker_opened_12_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.setPickerOpen("start-date", true));
    })("closed", function DateInputComponent_Conditional_2_Template_mat_datepicker_closed_12_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.setPickerOpen("start-date", false));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(14, DateInputComponent_Conditional_2_Conditional_14_Template, 8, 12, "mat-form-field", 15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "label", 12)(16, "span", 13);
    \u0275\u0275text(17);
    \u0275\u0275conditionalCreate(18, DateInputComponent_Conditional_2_Conditional_18_Template, 2, 0, "strong");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div", 14)(20, "mat-form-field", 24)(21, "input", 25);
    \u0275\u0275listener("ngModelChange", function DateInputComponent_Conditional_2_Template_input_ngModelChange_21_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onEndDateChange($event));
    })("blur", function DateInputComponent_Conditional_2_Template_input_blur_21_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.markTouched());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "button", 17);
    \u0275\u0275pipe(23, "i18n");
    \u0275\u0275listener("mousedown", function DateInputComponent_Conditional_2_Template_button_mousedown_22_listener($event) {
      return $event.preventDefault();
    })("click", function DateInputComponent_Conditional_2_Template_button_click_22_listener($event) {
      \u0275\u0275restoreView(_r6);
      const endPicker_r10 = \u0275\u0275reference(27);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleDatePicker(endPicker_r10, "end-date", $event));
    });
    \u0275\u0275elementStart(24, "mat-icon");
    \u0275\u0275text(25);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "mat-datepicker", 18, 3);
    \u0275\u0275listener("opened", function DateInputComponent_Conditional_2_Template_mat_datepicker_opened_26_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.setPickerOpen("end-date", true));
    })("closed", function DateInputComponent_Conditional_2_Template_mat_datepicker_closed_26_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.setPickerOpen("end-date", false));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(28, DateInputComponent_Conditional_2_Conditional_28_Template, 8, 12, "mat-form-field", 15);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const startPicker_r7 = \u0275\u0275reference(13);
    const endPicker_r10 = \u0275\u0275reference(27);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("date-input--with-time", ctx_r1.hasTime());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.startLabel);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.startRequired ? 4 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275property("matDatepicker", startPicker_r7)("ngModel", ctx_r1.startDateValue)("min", ctx_r1.resolvedStartMin())("max", ctx_r1.resolvedStartMax())("disabled", ctx_r1.inputDisabled())("placeholder", ctx_r1.startPlaceholder);
    \u0275\u0275advance();
    \u0275\u0275classProp("date-input__toggle--open", ctx_r1.isPickerOpen("start-date"));
    \u0275\u0275property("disabled", ctx_r1.inputDisabled());
    \u0275\u0275attribute("aria-pressed", ctx_r1.isPickerOpen("start-date"))("aria-label", \u0275\u0275pipeBind1(9, 32, "date.input.toggle.start.date.aria"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.pickerIcon("start-date", "calendar_month"));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.hasTime() ? 14 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.endLabel);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.endRequired ? 18 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275property("matDatepicker", endPicker_r10)("ngModel", ctx_r1.endDateValue)("min", ctx_r1.resolvedEndMin())("max", ctx_r1.resolvedEndMax())("disabled", ctx_r1.inputDisabled())("placeholder", ctx_r1.endPlaceholder);
    \u0275\u0275advance();
    \u0275\u0275classProp("date-input__toggle--open", ctx_r1.isPickerOpen("end-date"));
    \u0275\u0275property("disabled", ctx_r1.inputDisabled());
    \u0275\u0275attribute("aria-pressed", ctx_r1.isPickerOpen("end-date"))("aria-label", \u0275\u0275pipeBind1(23, 34, "date.input.toggle.end.date.aria"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.pickerIcon("end-date", "calendar_month"));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.hasTime() ? 28 : -1);
  }
}
function DateInputComponent_Conditional_3_Conditional_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1, "*");
    \u0275\u0275elementEnd();
  }
}
function DateInputComponent_Conditional_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 13);
    \u0275\u0275text(1);
    \u0275\u0275conditionalCreate(2, DateInputComponent_Conditional_3_Conditional_2_Conditional_2_Template, 2, 0, "strong");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.required ? 2 : -1);
  }
}
function DateInputComponent_Conditional_3_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-form-field", 15)(1, "input", 16);
    \u0275\u0275listener("ngModelChange", function DateInputComponent_Conditional_3_Conditional_12_Template_input_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r15);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onSingleTimeChange($event));
    })("blur", function DateInputComponent_Conditional_3_Conditional_12_Template_input_blur_1_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.markTouched());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 17);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275listener("mousedown", function DateInputComponent_Conditional_3_Conditional_12_Template_button_mousedown_2_listener($event) {
      return $event.preventDefault();
    })("click", function DateInputComponent_Conditional_3_Conditional_12_Template_button_click_2_listener($event) {
      \u0275\u0275restoreView(_r15);
      const singleTimePicker_r16 = \u0275\u0275reference(7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleTimePicker(singleTimePicker_r16, "single-time", $event));
    });
    \u0275\u0275elementStart(4, "mat-icon");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "mat-timepicker", 18, 7);
    \u0275\u0275listener("opened", function DateInputComponent_Conditional_3_Conditional_12_Template_mat_timepicker_opened_6_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.setPickerOpen("single-time", true));
    })("closed", function DateInputComponent_Conditional_3_Conditional_12_Template_mat_timepicker_closed_6_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.setPickerOpen("single-time", false));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const singleTimePicker_r16 = \u0275\u0275reference(7);
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("matTimepicker", singleTimePicker_r16)("matTimepickerOpenOnClick", ctx_r1.timeOpenOnClick())("ngModel", ctx_r1.singleTimeValue)("disabled", ctx_r1.inputDisabled());
    \u0275\u0275advance();
    \u0275\u0275classProp("date-input__toggle--open", ctx_r1.isPickerOpen("single-time"));
    \u0275\u0275property("disabled", ctx_r1.inputDisabled());
    \u0275\u0275attribute("aria-pressed", ctx_r1.isPickerOpen("single-time"))("aria-label", \u0275\u0275pipeBind1(3, 10, "date.input.toggle.time.aria"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.pickerIcon("single-time", "schedule"));
  }
}
function DateInputComponent_Conditional_3_Conditional_13_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 29);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.metaLabel());
  }
}
function DateInputComponent_Conditional_3_Conditional_13_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 31);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.metaIcon());
  }
}
function DateInputComponent_Conditional_3_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 28);
    \u0275\u0275conditionalCreate(1, DateInputComponent_Conditional_3_Conditional_13_Conditional_1_Template, 2, 1, "span", 29);
    \u0275\u0275elementStart(2, "span", 30);
    \u0275\u0275conditionalCreate(3, DateInputComponent_Conditional_3_Conditional_13_Conditional_3_Template, 2, 1, "span", 31);
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.metaLabel() ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", "date-input__meta-badge--" + ctx_r1.metaPalette());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.metaIcon() ? 3 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.metaValue());
  }
}
function DateInputComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 26)(1, "label", 12);
    \u0275\u0275conditionalCreate(2, DateInputComponent_Conditional_3_Conditional_2_Template, 3, 2, "span", 13);
    \u0275\u0275elementStart(3, "div", 14)(4, "mat-form-field", 24)(5, "input", 27);
    \u0275\u0275listener("ngModelChange", function DateInputComponent_Conditional_3_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSingleDateChange($event));
    })("blur", function DateInputComponent_Conditional_3_Template_input_blur_5_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.markTouched());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 17);
    \u0275\u0275pipe(7, "i18n");
    \u0275\u0275listener("mousedown", function DateInputComponent_Conditional_3_Template_button_mousedown_6_listener($event) {
      return $event.preventDefault();
    })("click", function DateInputComponent_Conditional_3_Template_button_click_6_listener($event) {
      \u0275\u0275restoreView(_r13);
      const singlePicker_r14 = \u0275\u0275reference(11);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleDatePicker(singlePicker_r14, "single-date", $event));
    });
    \u0275\u0275elementStart(8, "mat-icon");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "mat-datepicker", 18, 6);
    \u0275\u0275listener("opened", function DateInputComponent_Conditional_3_Template_mat_datepicker_opened_10_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.setPickerOpen("single-date", true));
    })("closed", function DateInputComponent_Conditional_3_Template_mat_datepicker_closed_10_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.setPickerOpen("single-date", false));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(12, DateInputComponent_Conditional_3_Conditional_12_Template, 8, 12, "mat-form-field", 15);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(13, DateInputComponent_Conditional_3_Conditional_13_Template, 6, 4, "div", 28);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const singlePicker_r14 = \u0275\u0275reference(11);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("date-input--with-time", ctx_r1.hasTime())("date-input--with-meta", ctx_r1.hasMeta());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.label ? 2 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275property("matDatepicker", singlePicker_r14)("ngModel", ctx_r1.singleDateValue)("ngModelOptions", \u0275\u0275pureFunction1(22, _c02, (ctx_r1.model == null ? null : ctx_r1.model.updateOn) ?? "change"))("min", ctx_r1.resolvedSingleMin())("max", ctx_r1.resolvedSingleMax())("disabled", ctx_r1.inputDisabled())("placeholder", ctx_r1.placeholder);
    \u0275\u0275advance();
    \u0275\u0275classProp("date-input__toggle--open", ctx_r1.isPickerOpen("single-date"));
    \u0275\u0275property("disabled", ctx_r1.inputDisabled());
    \u0275\u0275attribute("aria-pressed", ctx_r1.isPickerOpen("single-date"))("aria-label", \u0275\u0275pipeBind1(7, 20, "date.input.toggle.date.aria"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.pickerIcon("single-date", "calendar_month"));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.hasTime() ? 12 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.hasMeta() ? 13 : -1);
  }
}
var DateInputComponent = class _DateInputComponent {
  cdr;
  model = null;
  get compactRangeHost() {
    return this.isCompactRange();
  }
  static horoscopeMetaBySign = {
    Aries: { label: "aries", icon: "\u2648", palette: "aries" },
    Taurus: { label: "taurus", icon: "\u2649", palette: "taurus" },
    Gemini: { label: "gemini", icon: "\u264A", palette: "gemini" },
    Cancer: { label: "cancer", icon: "\u264B", palette: "cancer" },
    Leo: { label: "leo", icon: "\u264C", palette: "leo" },
    Virgo: { label: "virgo", icon: "\u264D", palette: "virgo" },
    Libra: { label: "libra", icon: "\u264E", palette: "libra" },
    Scorpio: { label: "scorpio", icon: "\u264F", palette: "scorpio" },
    Sagittarius: { label: "sagittarius", icon: "\u2650", palette: "sagittarius" },
    Capricorn: { label: "capricorn", icon: "\u2651", palette: "capricorn" },
    Aquarius: { label: "aquarius", icon: "\u2652", palette: "aquarius" },
    Pisces: { label: "pisces", icon: "\u2653", palette: "pisces" }
  };
  singleDateValue = null;
  singleTimeValue = null;
  startDateValue = null;
  startTimeValue = null;
  endDateValue = null;
  endTimeValue = null;
  openPickers = /* @__PURE__ */ new Set();
  controlDisabled = false;
  currentValue = null;
  onValueChange = () => void 0;
  onTouched = () => void 0;
  constructor(cdr) {
    this.cdr = cdr;
  }
  writeValue(value) {
    this.currentValue = value ?? null;
    this.syncControlsFromValue();
    this.cdr.markForCheck();
  }
  registerOnChange(fn) {
    this.onValueChange = fn;
  }
  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled) {
    this.controlDisabled = isDisabled;
    this.cdr.markForCheck();
  }
  isRange() {
    return this.mode === "range";
  }
  isCompactRange() {
    return this.isRange() && this.rangeLayout === "compact" && !this.hasTime();
  }
  isTimeOnly() {
    return this.mode === "time";
  }
  hasTime() {
    const option = this.model?.time;
    if (typeof option === "boolean") {
      return option;
    }
    if (option) {
      return option.enabled !== false;
    }
    return this.precision === "minute";
  }
  timeOpenOnClick() {
    const option = this.model?.time;
    return typeof option !== "object" || option === null || option.openOnClick !== false;
  }
  inputDisabled() {
    return this.disabled || this.readOnly || this.controlDisabled;
  }
  get label() {
    return `${this.singleField.label ?? ""}`;
  }
  get startLabel() {
    return `${this.startField.label ?? "Start"}`;
  }
  get endLabel() {
    return `${this.endField.label ?? "End"}`;
  }
  get placeholder() {
    return `${this.singleField.placeholder ?? "YYYY/MM/DD"}`;
  }
  get startPlaceholder() {
    return `${this.startField.placeholder ?? "YYYY/MM/DD"}`;
  }
  get endPlaceholder() {
    return `${this.endField.placeholder ?? "YYYY/MM/DD"}`;
  }
  get required() {
    return this.singleField.required === true;
  }
  get startRequired() {
    return this.startField.required === true;
  }
  get endRequired() {
    return this.endField.required === true;
  }
  get mode() {
    return this.model?.mode ?? "single";
  }
  get precision() {
    return this.model?.precision ?? "date";
  }
  get valuePrecision() {
    return this.model?.time === void 0 || this.model?.time === null ? this.precision : this.hasTime() ? "minute" : "date";
  }
  get valueFormat() {
    return this.model?.valueFormat ?? "iso-date-time";
  }
  get readOnly() {
    return this.model?.readOnly === true;
  }
  get disabled() {
    return this.model?.disabled === true;
  }
  get singleField() {
    return this.model?.field ?? {};
  }
  get range() {
    return this.model?.range ?? {};
  }
  get rangeLayout() {
    return this.range.layout ?? "split";
  }
  get startField() {
    return this.range.start ?? {};
  }
  get endField() {
    return this.range.end ?? {};
  }
  get bounds() {
    return this.range.bounds;
  }
  get allowEndBeforeStart() {
    return this.range.allowEndBeforeStart === true;
  }
  get meta() {
    return this.model?.meta;
  }
  resolvedSingleMin() {
    return this.toDatePickerBoundary(this.singleField.min);
  }
  resolvedSingleMax() {
    return this.toDatePickerBoundary(this.singleField.max);
  }
  resolvedStartMin() {
    return this.toDatePickerBoundary(this.bounds?.start ?? this.startField.min);
  }
  resolvedStartMax() {
    return this.toDatePickerBoundary(this.bounds?.end ?? this.startField.max);
  }
  resolvedEndMin() {
    return this.toDatePickerBoundary(this.allowEndBeforeStart ? this.bounds?.start ?? this.endField.min : this.startDateValue ?? this.bounds?.start ?? this.endField.min);
  }
  resolvedEndMax() {
    return this.toDatePickerBoundary(this.bounds?.end ?? this.endField.max);
  }
  onSingleDateChange(value) {
    let date = value;
    if (date && this.model?.updateOn === "blur") {
      const min = this.resolvedSingleMin();
      const max = this.resolvedSingleMax();
      if (min && date < min) {
        date = new Date(min);
      }
      if (max && date > max) {
        date = new Date(max);
      }
    }
    this.singleDateValue = date;
    this.emitSingleValue();
  }
  onSingleTimeChange(value) {
    this.singleTimeValue = value;
    this.emitSingleValue();
  }
  onTimeOnlyChange(value) {
    this.singleTimeValue = value;
    this.emitTimeOnlyValue();
  }
  onStartDateChange(value) {
    this.startDateValue = value;
    if (this.isCompactRange()) {
      return;
    }
    this.emitRangeValue();
  }
  onStartTimeChange(value) {
    this.startTimeValue = value;
    this.emitRangeValue();
  }
  onEndDateChange(value) {
    this.endDateValue = value;
    if (this.isCompactRange() && (!this.startDateValue || !this.endDateValue)) {
      return;
    }
    this.emitRangeValue();
  }
  onEndTimeChange(value) {
    this.endTimeValue = value;
    this.emitRangeValue();
  }
  markTouched() {
    this.onTouched();
  }
  isPickerOpen(key) {
    return this.openPickers.has(key);
  }
  pickerIcon(key, closedIcon) {
    return this.isPickerOpen(key) ? "close" : closedIcon;
  }
  hasMeta() {
    return this.meta !== null && this.meta !== void 0;
  }
  metaLabel() {
    return `${this.meta?.label ?? ""}`.trim();
  }
  metaIcon() {
    return this.resolvedMetaValue()?.icon?.trim() || `${this.meta?.icon ?? ""}`.trim();
  }
  metaValue() {
    const value = this.resolvedMetaValue();
    return `${value?.label ?? ""}`.trim() || `${this.meta?.emptyLabel ?? ""}`.trim();
  }
  metaPalette() {
    return this.resolvedMetaValue()?.palette?.trim() || `${this.meta?.palette ?? "blue"}`.trim() || "blue";
  }
  setPickerOpen(key, open) {
    if (open) {
      this.openPickers.add(key);
    } else {
      this.openPickers.delete(key);
    }
    this.cdr.markForCheck();
  }
  toggleDatePicker(picker, key, event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.inputDisabled()) {
      return;
    }
    if (picker.opened || this.isPickerOpen(key)) {
      picker.close();
      return;
    }
    picker.open();
  }
  toggleDateRangePicker(picker, key, event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.inputDisabled()) {
      return;
    }
    if (picker.opened || this.isPickerOpen(key)) {
      picker.close();
      return;
    }
    picker.open();
  }
  toggleTimePicker(picker, key, event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.inputDisabled()) {
      return;
    }
    if (this.isPickerOpen(key)) {
      picker.close();
      return;
    }
    picker.open();
  }
  emitSingleValue() {
    if (this.inputDisabled()) {
      return;
    }
    const value = this.datePartsToValue(this.singleDateValue, this.singleTimeValue);
    this.currentValue = value;
    this.onValueChange(value);
    this.onTouched();
  }
  emitTimeOnlyValue() {
    if (this.inputDisabled()) {
      return;
    }
    const value = this.timeToValue(this.singleTimeValue);
    this.currentValue = value;
    this.onValueChange(value);
    this.onTouched();
  }
  emitRangeValue() {
    if (this.inputDisabled()) {
      return;
    }
    const value = {
      startAt: this.datePartsToValue(this.startDateValue, this.startTimeValue),
      endAt: this.datePartsToValue(this.endDateValue, this.endTimeValue),
      precision: this.valuePrecision
    };
    const normalized = this.normalizedRange(value);
    this.currentValue = normalized;
    this.syncControlsFromValue();
    this.onValueChange(normalized);
    this.onTouched();
  }
  syncControlsFromValue() {
    if (this.mode === "time") {
      const time = typeof this.currentValue === "string" ? this.toTimeDate(this.currentValue) : null;
      this.singleDateValue = null;
      this.singleTimeValue = time;
      return;
    }
    if (this.mode === "range") {
      const range = this.isRangeValue(this.currentValue) ? this.currentValue : { startAt: "", endAt: "", precision: this.valuePrecision };
      const start = this.toDate(range.startAt);
      const end = this.toDate(range.endAt);
      this.startDateValue = start;
      this.startTimeValue = start;
      this.endDateValue = end;
      this.endTimeValue = end;
      return;
    }
    const date = typeof this.currentValue === "string" ? this.toDate(this.currentValue) : null;
    this.singleDateValue = date;
    this.singleTimeValue = date;
  }
  timeToValue(value) {
    if (!value) {
      return "";
    }
    return `${value.getHours()}`.padStart(2, "0") + ":" + `${value.getMinutes()}`.padStart(2, "0");
  }
  toTimeDate(value) {
    if (value instanceof Date) {
      return Number.isFinite(value.getTime()) ? new Date(value) : null;
    }
    const normalized = `${value ?? ""}`.trim();
    const match = normalized.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) {
      return null;
    }
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (!Number.isInteger(hours) || !Number.isInteger(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return null;
    }
    const date = /* @__PURE__ */ new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
  datePartsToValue(dateValue, timeValue) {
    if (!dateValue) {
      return "";
    }
    const next = new Date(dateValue);
    if (this.valuePrecision === "minute") {
      const time = timeValue ?? dateValue;
      next.setHours(time.getHours(), time.getMinutes(), 0, 0);
      return AppUtils.toIsoDateTimeLocal(next);
    }
    next.setHours(0, 0, 0, 0);
    return this.valueFormat === "iso-date" ? AppUtils.toIsoDate(next) : AppUtils.toIsoDateTimeLocal(next);
  }
  toDate(value) {
    if (value instanceof Date) {
      return Number.isFinite(value.getTime()) ? new Date(value) : null;
    }
    const normalized = `${value ?? ""}`.trim();
    if (!normalized) {
      return null;
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
      const [year, month, day] = normalized.split("-").map((item) => Number.parseInt(item, 10));
      const parsed = new Date(year, month - 1, day, 0, 0, 0, 0);
      return Number.isFinite(parsed.getTime()) ? parsed : null;
    }
    return AppUtils.isoLocalDateTimeToDate(normalized);
  }
  toDatePickerBoundary(value) {
    const date = this.toDate(value);
    if (!date) {
      return null;
    }
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  }
  normalizedRange(value) {
    const start = this.toDate(value.startAt);
    let end = this.toDate(value.endAt);
    const min = this.toDate(this.bounds?.start ?? this.startField.min);
    const max = this.toDate(this.bounds?.end ?? this.endField.max);
    if (!start) {
      return {
        startAt: "",
        endAt: "",
        precision: this.valuePrecision
      };
    }
    let safeStart = new Date(start);
    if (min && safeStart.getTime() < min.getTime()) {
      safeStart = new Date(min);
    }
    if (max && safeStart.getTime() > max.getTime()) {
      safeStart = new Date(max);
    }
    const minDurationMs = 60 * 60 * 1e3;
    if (!end || !this.allowEndBeforeStart && end.getTime() <= safeStart.getTime()) {
      end = new Date(safeStart.getTime() + minDurationMs);
    }
    if (max && end.getTime() > max.getTime()) {
      end = new Date(max);
    }
    if (!this.allowEndBeforeStart && end.getTime() <= safeStart.getTime()) {
      safeStart = min && max && max.getTime() > min.getTime() ? new Date(Math.max(min.getTime(), max.getTime() - minDurationMs)) : safeStart;
      end = max && max.getTime() > safeStart.getTime() ? new Date(max) : new Date(safeStart.getTime() + minDurationMs);
    }
    return {
      startAt: this.dateToValue(safeStart),
      endAt: this.dateToValue(end),
      precision: this.valuePrecision
    };
  }
  dateToValue(value) {
    if (this.valuePrecision === "minute") {
      return AppUtils.toIsoDateTimeLocal(value);
    }
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return this.valueFormat === "iso-date" ? AppUtils.toIsoDate(date) : AppUtils.toIsoDateTimeLocal(date);
  }
  isRangeValue(value) {
    return !!value && typeof value === "object" && "startAt" in value && "endAt" in value;
  }
  resolvedMetaValue() {
    if (!this.meta) {
      return null;
    }
    if (this.meta.kind === "horoscope") {
      return this.horoscopeMetaValue();
    }
    return {
      label: this.meta.emptyLabel ?? "",
      icon: this.meta.icon ?? "",
      palette: this.meta.palette ?? "blue"
    };
  }
  horoscopeMetaValue() {
    const date = this.singleDateValue ?? (typeof this.currentValue === "string" ? this.toDate(this.currentValue) : null);
    if (!date) {
      return null;
    }
    const horoscope = AppUtils.horoscopeByDate(date);
    return _DateInputComponent.horoscopeMetaBySign[horoscope] ?? _DateInputComponent.horoscopeMetaBySign["Pisces"];
  }
  static \u0275fac = function DateInputComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DateInputComponent)(\u0275\u0275directiveInject(ChangeDetectorRef));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DateInputComponent, selectors: [["app-date-input"]], hostVars: 2, hostBindings: function DateInputComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275classProp("date-input-host--range-compact", ctx.compactRangeHost);
    }
  }, inputs: { model: "model" }, features: [\u0275\u0275ProvidersFeature([
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => _DateInputComponent),
      multi: true
    }
  ])], decls: 4, vars: 1, consts: [["timeOnlyPicker", ""], ["rangePicker", ""], ["startPicker", ""], ["endPicker", ""], ["startTimePicker", ""], ["endTimePicker", ""], ["singlePicker", ""], ["singleTimePicker", ""], [1, "date-input", "date-input--time"], [1, "date-input", "date-input--range-compact"], [1, "date-input", "date-input--range", 3, "date-input--with-time"], [1, "date-input", "date-input--single", 3, "date-input--with-time", "date-input--with-meta"], [1, "date-input__field"], [1, "date-input__label"], [1, "date-input__row"], ["appearance", "outline", "subscriptSizing", "dynamic", 1, "date-input__material", "date-input__material--time"], ["matInput", "", 3, "ngModelChange", "blur", "matTimepicker", "matTimepickerOpenOnClick", "ngModel", "disabled"], ["matSuffix", "", "type", "button", 1, "date-input__toggle", 3, "mousedown", "click", "disabled"], [3, "opened", "closed"], ["appearance", "outline", "subscriptSizing", "dynamic", 1, "date-input__material", "date-input__material--range"], [3, "rangePicker", "min", "max"], ["matStartDate", "", 3, "ngModelChange", "blur", "ngModel", "min", "max", "disabled", "placeholder"], ["matEndDate", "", 3, "ngModelChange", "blur", "ngModel", "min", "max", "disabled", "placeholder"], [1, "date-input", "date-input--range"], ["appearance", "outline", "subscriptSizing", "dynamic", 1, "date-input__material", "date-input__material--date"], ["matInput", "", 3, "ngModelChange", "blur", "matDatepicker", "ngModel", "min", "max", "disabled", "placeholder"], [1, "date-input", "date-input--single"], ["matInput", "", 3, "ngModelChange", "blur", "matDatepicker", "ngModel", "ngModelOptions", "min", "max", "disabled", "placeholder"], [1, "date-input__meta"], [1, "date-input__meta-label"], [1, "date-input__meta-badge", 3, "ngClass"], [1, "date-input__meta-icon"]], template: function DateInputComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, DateInputComponent_Conditional_0_Template, 12, 13, "div", 8)(1, DateInputComponent_Conditional_1_Template, 13, 23, "div", 9)(2, DateInputComponent_Conditional_2_Template, 29, 36, "div", 10)(3, DateInputComponent_Conditional_3_Template, 14, 24, "div", 11);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.isTimeOnly() ? 0 : ctx.isCompactRange() ? 1 : ctx.isRange() ? 2 : 3);
    }
  }, dependencies: [
    CommonModule,
    NgClass,
    FormsModule,
    DefaultValueAccessor,
    NgControlStatus,
    NgModel,
    MatDatepickerModule,
    MatDatepicker,
    MatDatepickerInput,
    MatDateRangeInput,
    MatStartDate,
    MatEndDate,
    MatDateRangePicker,
    MatFormFieldModule,
    MatFormField,
    MatSuffix,
    MatIconModule,
    MatIcon,
    MatInputModule,
    MatInput,
    MatNativeDateModule,
    MatTimepickerModule,
    MatTimepicker,
    MatTimepickerInput,
    I18nPipe
  ], styles: ['\n[_nghost-%COMP%] {\n  display: block;\n  grid-column: 1/-1;\n  width: 100%;\n  min-width: 0;\n}\n.date-input-host--range-compact[_nghost-%COMP%] {\n  --date-input-compact-control-width: 236px;\n  --date-input-compact-shell-height: 34px;\n  --date-input-compact-chip-height: 26px;\n  --date-input-compact-chip-width: 10ch;\n  grid-column: auto;\n  width: var(--date-input-compact-control-width);\n  min-width: var(--date-input-compact-control-width);\n  max-width: var(--date-input-compact-control-width);\n  flex: 0 0 var(--date-input-compact-control-width);\n  overflow: visible;\n}\n.date-input[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.62rem;\n  width: 100%;\n}\n.date-input--range[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);\n  align-items: start;\n  gap: 0.72rem;\n}\n.date-input--range-compact[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 1fr);\n  gap: 0;\n}\n.date-input--range-compact[_ngcontent-%COMP%]   .date-input__field[_ngcontent-%COMP%], \n.date-input--range-compact[_ngcontent-%COMP%]   .date-input__row[_ngcontent-%COMP%] {\n  gap: 0;\n}\n.date-input--single.date-input--with-meta[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 1fr) max-content;\n  align-items: end;\n}\n.date-input--time[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 1fr);\n}\n.date-input__field[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.34rem;\n  min-width: 0;\n}\n.date-input__label[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.18rem;\n  color: #203a5d;\n  font-weight: 700;\n  font-size: 0.84rem;\n  line-height: 1.2;\n}\n.date-input__label[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #cf283f;\n  font-weight: 800;\n}\n.date-input__row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr);\n  align-items: center;\n  gap: 0.5rem;\n  min-width: 0;\n}\n.date-input--with-time[_ngcontent-%COMP%]   .date-input__row[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 1fr) minmax(132px, 148px);\n}\n.date-input__material[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n}\n[_nghost-%COMP%]     .date-input__material .mat-mdc-text-field-wrapper {\n  min-height: 38px;\n  height: 38px;\n  padding: 0 0.48rem 0 0.72rem;\n  border: 1px solid rgba(112, 143, 184, 0.56);\n  border-radius: 10px;\n  background: #fff !important;\n  box-shadow: none;\n}\n[_nghost-%COMP%]     .date-input__material .mat-mdc-text-field-wrapper.mdc-text-field {\n  background-color: #fff !important;\n}\n[_nghost-%COMP%]     .date-input__material.mat-focused .mat-mdc-text-field-wrapper {\n  border-color: rgba(56, 114, 190, 0.82);\n  box-shadow: 0 0 0 3px rgba(56, 114, 190, 0.1);\n}\n[_nghost-%COMP%]     .date-input__material .mdc-text-field, \n[_nghost-%COMP%]     .date-input__material .mdc-text-field--filled {\n  background: transparent;\n}\n[_nghost-%COMP%]     .date-input__material .mdc-notched-outline__leading, \n[_nghost-%COMP%]     .date-input__material .mdc-notched-outline__notch, \n[_nghost-%COMP%]     .date-input__material .mdc-notched-outline__trailing {\n  border: 0;\n}\n[_nghost-%COMP%]     .date-input__material .mat-mdc-form-field-flex {\n  min-height: 36px;\n  align-items: center;\n}\n[_nghost-%COMP%]     .date-input__material .mat-mdc-form-field-infix {\n  width: auto;\n  min-height: 0;\n  padding: 0;\n}\n[_nghost-%COMP%]     .date-input__material .mat-mdc-input-element {\n  color: #183358;\n  font-size: 0.92rem;\n  line-height: 1.2;\n  min-width: 0;\n}\n[_nghost-%COMP%]     .date-input__material .mat-mdc-input-element:focus, \n[_nghost-%COMP%]     .date-input__material .mat-mdc-input-element:focus-visible {\n  outline: none;\n  box-shadow: none;\n}\n[_nghost-%COMP%]     .date-input__material .mat-mdc-input-element::placeholder {\n  color: rgba(45, 68, 97, 0.52);\n}\n[_nghost-%COMP%]     .date-input__material .mat-mdc-form-field-subscript-wrapper, \n[_nghost-%COMP%]     .date-input__material .mat-mdc-form-field-bottom-align, \n[_nghost-%COMP%]     .date-input__material .mdc-line-ripple, \n[_nghost-%COMP%]     .date-input__material .mat-mdc-form-field-line-ripple, \n[_nghost-%COMP%]     .date-input__material .mdc-line-ripple--deactivating, \n[_nghost-%COMP%]     .date-input__material .mdc-line-ripple--active {\n  display: none;\n}\n[_nghost-%COMP%]     .date-input__material .mat-mdc-form-field-icon-suffix {\n  align-self: stretch;\n  display: inline-flex;\n  align-items: center;\n  padding: 0;\n}\n[_nghost-%COMP%]     .date-input__material--range .mat-date-range-input-container {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);\n  min-height: 36px;\n  height: 36px;\n  align-items: center;\n  color: #183358;\n}\n[_nghost-%COMP%]     .date-input__material--range .mat-date-range-input-wrapper, \n[_nghost-%COMP%]     .date-input__material--range .mat-date-range-input-start-wrapper, \n[_nghost-%COMP%]     .date-input__material--range .mat-date-range-input-end-wrapper {\n  display: flex;\n  align-items: center;\n  min-width: 0;\n  min-height: 36px;\n  height: 36px;\n  overflow: hidden;\n}\n[_nghost-%COMP%]     .date-input__material--range .mat-date-range-input-inner {\n  color: #183358;\n  font-size: 0.92rem;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  margin: 0;\n  padding: 0;\n  line-height: normal;\n  min-width: 0;\n}\n[_nghost-%COMP%]     .date-input__material--range .mat-date-range-input-inner::placeholder {\n  color: rgba(45, 68, 97, 0.52);\n}\n[_nghost-%COMP%]     .date-input__material--range .mat-date-range-input-separator {\n  margin: 0 0.22rem;\n  color: rgba(45, 68, 97, 0.62);\n}\n[_nghost-%COMP%]     .date-input--range-compact .date-input__material .mat-mdc-text-field-wrapper {\n  min-height: var(--date-input-compact-shell-height);\n  height: var(--date-input-compact-shell-height);\n  padding: 0 0.22rem 0 0.46rem;\n  border-color: rgba(42, 83, 141, 0.26);\n  border-radius: 999px;\n  background: #f7fbff !important;\n  overflow: visible;\n}\n[_nghost-%COMP%]     .date-input--range-compact .date-input__material.mat-focused .mat-mdc-text-field-wrapper {\n  border-color: rgba(56, 114, 190, 0.74);\n  box-shadow: 0 0 0 3px rgba(56, 114, 190, 0.1);\n}\n[_nghost-%COMP%]     .date-input--range-compact .date-input__material .mat-mdc-form-field-flex, \n[_nghost-%COMP%]     .date-input--range-compact .date-input__material .mat-mdc-form-field-infix, \n[_nghost-%COMP%]     .date-input--range-compact .date-input__material .mat-date-range-input-wrapper, \n[_nghost-%COMP%]     .date-input--range-compact .date-input__material .mat-date-range-input-start-wrapper, \n[_nghost-%COMP%]     .date-input--range-compact .date-input__material .mat-date-range-input-end-wrapper {\n  min-width: 0;\n  min-height: var(--date-input-compact-shell-height);\n  height: var(--date-input-compact-shell-height);\n  overflow: hidden;\n  border-bottom: 0 !important;\n  box-shadow: none !important;\n}\n[_nghost-%COMP%]     .date-input--range-compact .date-input__material .mat-mdc-form-field-flex, \n[_nghost-%COMP%]     .date-input--range-compact .date-input__material .mat-date-range-input-wrapper, \n[_nghost-%COMP%]     .date-input--range-compact .date-input__material .mat-date-range-input-start-wrapper, \n[_nghost-%COMP%]     .date-input--range-compact .date-input__material .mat-date-range-input-end-wrapper, \n[_nghost-%COMP%]     .date-input--range-compact .date-input__material .mat-date-range-input-mirror {\n  display: flex;\n  align-items: center;\n}\n[_nghost-%COMP%]     .date-input--range-compact .date-input__material .mat-mdc-form-field-infix {\n  width: auto !important;\n  flex: 1 1 auto;\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n}\n[_nghost-%COMP%]     .date-input--range-compact .date-input__material .mat-mdc-form-field-focus-overlay {\n  background: transparent !important;\n  opacity: 0 !important;\n}\n[_nghost-%COMP%]     .date-input--range-compact .date-input__material .mat-mdc-form-field-icon-suffix {\n  align-self: stretch;\n  flex: 0 0 auto;\n  min-width: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding-right: 0.14rem;\n}\n[_nghost-%COMP%]     .date-input--range-compact .date-input__material--range .mat-date-range-input-container {\n  grid-template-columns: var(--date-input-compact-chip-width) 12px var(--date-input-compact-chip-width);\n  column-gap: 0.12rem;\n  width: 100%;\n  min-height: var(--date-input-compact-shell-height);\n  height: var(--date-input-compact-shell-height);\n  align-items: center;\n  justify-content: center;\n  overflow: hidden;\n}\n[_nghost-%COMP%]     .date-input--range-compact .date-input__material--range .mat-date-range-input-wrapper, \n[_nghost-%COMP%]     .date-input--range-compact .date-input__material--range .mat-date-range-input-start-wrapper, \n[_nghost-%COMP%]     .date-input--range-compact .date-input__material--range .mat-date-range-input-end-wrapper {\n  flex: 0 0 var(--date-input-compact-chip-width) !important;\n  width: var(--date-input-compact-chip-width);\n  max-width: var(--date-input-compact-chip-width);\n  min-height: var(--date-input-compact-chip-height);\n  height: var(--date-input-compact-chip-height);\n  justify-content: center;\n  border-radius: 999px;\n  background: #fff;\n  box-shadow: inset 0 0 0 1px rgba(42, 83, 141, 0.16) !important;\n}\n[_nghost-%COMP%]     .date-input--range-compact .date-input__material--range .mat-date-range-input-end-wrapper {\n  flex-grow: 0 !important;\n}\n[_nghost-%COMP%]     .date-input--range-compact .date-input__material--range .mat-date-range-input-separator {\n  min-height: var(--date-input-compact-shell-height);\n  height: var(--date-input-compact-shell-height);\n  margin: 0;\n  color: #5f7899;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  line-height: var(--date-input-compact-shell-height);\n}\n[_nghost-%COMP%]     .date-input--range-compact .date-input__material--range .mat-date-range-input-inner, \n[_nghost-%COMP%]     .date-input--range-compact .date-input__material--range input, \n[_nghost-%COMP%]     .date-input--range-compact .date-input__material--range .mat-date-range-input-mirror {\n  height: var(--date-input-compact-chip-height);\n  min-height: var(--date-input-compact-chip-height);\n  font-size: 0.76rem;\n  font-weight: 700;\n  color: #2c4c74;\n  line-height: var(--date-input-compact-chip-height);\n  text-align: center;\n  align-self: center;\n}\n[_nghost-%COMP%]     .date-input--range-compact .date-input__material--range .mat-date-range-input-inner::placeholder {\n  color: rgba(44, 76, 116, 0.48);\n}\n.date-input__toggle[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 28px;\n  height: 28px;\n  min-width: 28px;\n  min-height: 28px;\n  padding: 0;\n  border: 0;\n  border-radius: 999px;\n  background: transparent;\n  color: #315a86;\n  cursor: pointer;\n  transform-origin: center;\n  transition:\n    background-color 0.14s ease,\n    color 0.14s ease,\n    transform 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.date-input__toggle[_ngcontent-%COMP%]:hover {\n  background: rgba(59, 104, 164, 0.1);\n  color: #224a74;\n}\n.date-input__toggle[_ngcontent-%COMP%]:active {\n  transform: scale(0.94);\n}\n.date-input__toggle--open[_ngcontent-%COMP%] {\n  background: rgba(49, 90, 134, 0.14);\n  color: #1f4d7d;\n  box-shadow: inset 0 0 0 1px rgba(49, 90, 134, 0.14);\n}\n.date-input__toggle--open[_ngcontent-%COMP%]:hover {\n  background: rgba(49, 90, 134, 0.18);\n}\n.date-input--range-compact[_ngcontent-%COMP%]   .date-input__toggle[_ngcontent-%COMP%] {\n  color: #365677;\n  align-self: center;\n}\n.date-input--range-compact[_ngcontent-%COMP%]   .date-input__toggle[_ngcontent-%COMP%]:hover {\n  background: rgba(61, 104, 167, 0.1);\n  color: #24486e;\n}\n.date-input__toggle[_ngcontent-%COMP%]:disabled {\n  cursor: default;\n  opacity: 0.58;\n  transform: none;\n  pointer-events: none;\n}\n.date-input__toggle[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  transform-origin: center;\n  transition:\n    transform 0.18s cubic-bezier(0.22, 0.61, 0.36, 1),\n    opacity 0.14s ease,\n    filter 0.14s ease;\n}\n.date-input__toggle--open[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  transform: rotate(90deg);\n}\n.date-input__meta[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.34rem;\n  justify-items: start;\n  min-width: 0;\n}\n.date-input__meta-label[_ngcontent-%COMP%] {\n  color: #203a5d;\n  font-size: 0.84rem;\n  font-weight: 700;\n  line-height: 1.2;\n}\n.date-input__meta-badge[_ngcontent-%COMP%] {\n  min-height: 38px;\n  box-sizing: border-box;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  width: fit-content;\n  max-width: 100%;\n  padding: 0 14px;\n  border: 1px solid #b9cce5;\n  border-radius: 999px;\n  background: #f3f8ff;\n  color: #27568e;\n  box-shadow: 0 8px 18px rgba(41, 84, 135, 0.08);\n  font-size: 0.88rem;\n  font-weight: 900;\n  line-height: 1.1;\n  white-space: nowrap;\n}\n.date-input__meta-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-family:\n    "Noto Sans Symbols 2",\n    "Noto Sans Symbols",\n    "Segoe UI Symbol",\n    sans-serif;\n  font-size: 18px;\n  line-height: 18px;\n}\n.date-input__meta-badge--purple[_ngcontent-%COMP%] {\n  border-color: #c8b7f2;\n  background: #f5efff;\n  color: #6941a6;\n  box-shadow: 0 8px 18px rgba(105, 65, 166, 0.1);\n}\n.date-input__meta-badge--blue[_ngcontent-%COMP%] {\n  border-color: #b9cce5;\n  background: #f3f8ff;\n  color: #27568e;\n  box-shadow: 0 8px 18px rgba(41, 84, 135, 0.08);\n}\n.date-input__meta-badge--green[_ngcontent-%COMP%] {\n  border-color: #a8dcb8;\n  background: #f0fbf3;\n  color: #2f7b47;\n  box-shadow: 0 8px 18px rgba(47, 123, 71, 0.1);\n}\n.date-input__meta-badge--violet[_ngcontent-%COMP%] {\n  border-color: #c9b7e8;\n  background: #f7f1ff;\n  color: #65409b;\n  box-shadow: 0 8px 18px rgba(101, 64, 155, 0.1);\n}\n.date-input__meta-badge--pink[_ngcontent-%COMP%] {\n  border-color: #efb7d3;\n  background: #fff0f7;\n  color: #9a3f70;\n  box-shadow: 0 8px 18px rgba(154, 63, 112, 0.1);\n}\n.date-input__meta-badge--orange[_ngcontent-%COMP%] {\n  border-color: #efc19d;\n  background: #fff5ec;\n  color: #93551e;\n  box-shadow: 0 8px 18px rgba(147, 85, 30, 0.1);\n}\n.date-input__meta-badge--brown[_ngcontent-%COMP%] {\n  border-color: #d7bd9c;\n  background: #fbf4ec;\n  color: #77502b;\n  box-shadow: 0 8px 18px rgba(119, 80, 43, 0.1);\n}\n.date-input__meta-badge--teal[_ngcontent-%COMP%] {\n  border-color: #a8d7d5;\n  background: #effafa;\n  color: #286f72;\n  box-shadow: 0 8px 18px rgba(40, 111, 114, 0.1);\n}\n.date-input__meta-badge--muted[_ngcontent-%COMP%] {\n  border-color: #c7d0dc;\n  background: #f5f7fa;\n  color: #536274;\n  box-shadow: 0 8px 18px rgba(83, 98, 116, 0.08);\n}\n.date-input__meta-badge--aries[_ngcontent-%COMP%] {\n  border-color: #efb2a5;\n  background: #fff1ed;\n  color: #9b3f2c;\n  box-shadow: 0 8px 18px rgba(155, 63, 44, 0.1);\n}\n.date-input__meta-badge--taurus[_ngcontent-%COMP%] {\n  border-color: #a7d69f;\n  background: #f0faee;\n  color: #3d7a31;\n  box-shadow: 0 8px 18px rgba(61, 122, 49, 0.1);\n}\n.date-input__meta-badge--gemini[_ngcontent-%COMP%] {\n  border-color: #e6ce77;\n  background: #fff9dc;\n  color: #806219;\n  box-shadow: 0 8px 18px rgba(128, 98, 25, 0.1);\n}\n.date-input__meta-badge--cancer[_ngcontent-%COMP%] {\n  border-color: #9fd8e6;\n  background: #effbff;\n  color: #237083;\n  box-shadow: 0 8px 18px rgba(35, 112, 131, 0.1);\n}\n.date-input__meta-badge--leo[_ngcontent-%COMP%] {\n  border-color: #efc061;\n  background: #fff5d9;\n  color: #975d12;\n  box-shadow: 0 8px 18px rgba(151, 93, 18, 0.1);\n}\n.date-input__meta-badge--virgo[_ngcontent-%COMP%] {\n  border-color: #bfd28d;\n  background: #f8fbe9;\n  color: #62752b;\n  box-shadow: 0 8px 18px rgba(98, 117, 43, 0.1);\n}\n.date-input__meta-badge--libra[_ngcontent-%COMP%] {\n  border-color: #efb7d3;\n  background: #fff0f7;\n  color: #9a3f70;\n  box-shadow: 0 8px 18px rgba(154, 63, 112, 0.1);\n}\n.date-input__meta-badge--scorpio[_ngcontent-%COMP%] {\n  border-color: #c0a3d9;\n  background: #f7effc;\n  color: #663285;\n  box-shadow: 0 8px 18px rgba(102, 50, 133, 0.1);\n}\n.date-input__meta-badge--sagittarius[_ngcontent-%COMP%] {\n  border-color: #b9a8ee;\n  background: #f4f0ff;\n  color: #553ca0;\n  box-shadow: 0 8px 18px rgba(85, 60, 160, 0.1);\n}\n.date-input__meta-badge--capricorn[_ngcontent-%COMP%] {\n  border-color: #cdb497;\n  background: #fbf2e9;\n  color: #705032;\n  box-shadow: 0 8px 18px rgba(112, 80, 50, 0.1);\n}\n.date-input__meta-badge--aquarius[_ngcontent-%COMP%] {\n  border-color: #a8c8ef;\n  background: #f0f7ff;\n  color: #2c5f9f;\n  box-shadow: 0 8px 18px rgba(44, 95, 159, 0.1);\n}\n.date-input__meta-badge--pisces[_ngcontent-%COMP%] {\n  border-color: #9cd5cf;\n  background: #effaf8;\n  color: #277268;\n  box-shadow: 0 8px 18px rgba(39, 114, 104, 0.1);\n}\n[_nghost-%COMP%]     .date-input__material.mat-mdc-form-field-disabled .mat-mdc-text-field-wrapper {\n  background:\n    linear-gradient(\n      180deg,\n      #f3f6fa 0%,\n      #e8edf5 100%) !important;\n  border-color: rgba(122, 140, 168, 0.42);\n  box-shadow: none;\n  cursor: not-allowed;\n}\n[_nghost-%COMP%]     .date-input__material.mat-mdc-form-field-disabled .mat-mdc-input-element, \n[_nghost-%COMP%]     .date-input__material.mat-mdc-form-field-disabled .mat-icon {\n  color: rgba(58, 76, 103, 0.7) !important;\n  -webkit-text-fill-color: rgba(58, 76, 103, 0.7);\n}\n@media (max-width: 760px) {\n  .date-input--range[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .date-input--single.date-input--with-meta[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr) max-content;\n    column-gap: 0.5rem;\n  }\n  .date-input--with-time[_ngcontent-%COMP%]   .date-input__row[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr) minmax(108px, 122px);\n  }\n  [_nghost-%COMP%]     .date-input--range-compact .date-input__material--range .mat-date-range-input-container {\n    grid-template-columns: 10ch 12px 10ch;\n    column-gap: 0.08rem;\n  }\n  [_nghost-%COMP%]     .date-input--range-compact .date-input__material--range .mat-date-range-input-inner, \n   [_nghost-%COMP%]     .date-input--range-compact .date-input__material--range input {\n    font-size: 0.74rem;\n  }\n  [_nghost-%COMP%]     .date-input--range-compact .date-input__material .mat-mdc-form-field-icon-suffix {\n    padding-right: 0.06rem;\n  }\n}\n@media (max-width: 520px) {\n  .date-input--single.date-input--with-meta[_ngcontent-%COMP%] {\n    column-gap: 0.42rem;\n  }\n  .date-input__meta-badge[_ngcontent-%COMP%] {\n    min-height: 36px;\n    padding: 0 10px;\n    gap: 6px;\n    font-size: 0.84rem;\n  }\n  .date-input__meta-icon[_ngcontent-%COMP%] {\n    width: 16px;\n    height: 16px;\n    font-size: 16px;\n    line-height: 16px;\n  }\n  .date-input--with-time[_ngcontent-%COMP%]   .date-input__row[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr) minmax(86px, 104px);\n    gap: 0.42rem;\n  }\n}\n/*# sourceMappingURL=date-input.component.css.map */'], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DateInputComponent, [{
    type: Component,
    args: [{ selector: "app-date-input", standalone: true, imports: [
      CommonModule,
      FormsModule,
      MatDatepickerModule,
      MatFormFieldModule,
      MatIconModule,
      MatInputModule,
      MatNativeDateModule,
      MatTimepickerModule,
      I18nPipe
    ], changeDetection: ChangeDetectionStrategy.OnPush, providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => DateInputComponent),
        multi: true
      }
    ], template: `@if (isTimeOnly()) {
  <div class="date-input date-input--time">
    <label class="date-input__field">
      @if (label) {
        <span class="date-input__label">{{ label }}@if (required) { <strong>*</strong> }</span>
      }
      <div class="date-input__row">
        <mat-form-field appearance="outline" class="date-input__material date-input__material--time" subscriptSizing="dynamic">
          <input
            matInput
            [matTimepicker]="timeOnlyPicker"
            [matTimepickerOpenOnClick]="timeOpenOnClick()"
            [ngModel]="singleTimeValue"
            (ngModelChange)="onTimeOnlyChange($event)"
            (blur)="markTouched()"
            [disabled]="inputDisabled()"
          />
          <button
            matSuffix
            type="button"
            class="date-input__toggle"
            [class.date-input__toggle--open]="isPickerOpen('time')"
            [attr.aria-pressed]="isPickerOpen('time')"
            [disabled]="inputDisabled()"
            (mousedown)="$event.preventDefault()"
            (click)="toggleTimePicker(timeOnlyPicker, 'time', $event)"
            [attr.aria-label]="'date.input.toggle.time.aria' | i18n"
          >
            <mat-icon>{{ pickerIcon('time', 'schedule') }}</mat-icon>
          </button>
          <mat-timepicker
            #timeOnlyPicker
            (opened)="setPickerOpen('time', true)"
            (closed)="setPickerOpen('time', false)"
          ></mat-timepicker>
        </mat-form-field>
      </div>
    </label>
  </div>
} @else if (isCompactRange()) {
  <div class="date-input date-input--range-compact">
    <label class="date-input__field">
      <div class="date-input__row">
        <mat-form-field appearance="outline" class="date-input__material date-input__material--range" subscriptSizing="dynamic">
          <mat-date-range-input
            [rangePicker]="rangePicker"
            [min]="resolvedStartMin()"
            [max]="resolvedEndMax()"
          >
            <input
              matStartDate
              [ngModel]="startDateValue"
              (ngModelChange)="onStartDateChange($event)"
              (blur)="markTouched()"
              [min]="resolvedStartMin()"
              [max]="resolvedStartMax()"
              [disabled]="inputDisabled()"
              [placeholder]="startPlaceholder"
              [attr.aria-label]="startLabel"
            />
            <input
              matEndDate
              [ngModel]="endDateValue"
              (ngModelChange)="onEndDateChange($event)"
              (blur)="markTouched()"
              [min]="resolvedEndMin()"
              [max]="resolvedEndMax()"
              [disabled]="inputDisabled()"
              [placeholder]="endPlaceholder"
              [attr.aria-label]="endLabel"
            />
          </mat-date-range-input>
          <button
            matSuffix
            type="button"
            class="date-input__toggle"
            [class.date-input__toggle--open]="isPickerOpen('range-date')"
            [attr.aria-pressed]="isPickerOpen('range-date')"
            [disabled]="inputDisabled()"
            (mousedown)="$event.preventDefault()"
            (click)="toggleDateRangePicker(rangePicker, 'range-date', $event)"
            [attr.aria-label]="'date.input.toggle.range.aria' | i18n"
          >
            <mat-icon>{{ pickerIcon('range-date', 'calendar_month') }}</mat-icon>
          </button>
          <mat-date-range-picker
            #rangePicker
            (opened)="setPickerOpen('range-date', true)"
            (closed)="setPickerOpen('range-date', false)"
          ></mat-date-range-picker>
        </mat-form-field>
      </div>
    </label>
  </div>
} @else if (isRange()) {
  <div class="date-input date-input--range" [class.date-input--with-time]="hasTime()">
    <label class="date-input__field">
      <span class="date-input__label">{{ startLabel }}@if (startRequired) { <strong>*</strong> }</span>
      <div class="date-input__row">
        <mat-form-field appearance="outline" class="date-input__material date-input__material--date" subscriptSizing="dynamic">
          <input
            matInput
            [matDatepicker]="startPicker"
            [ngModel]="startDateValue"
            (ngModelChange)="onStartDateChange($event)"
            (blur)="markTouched()"
            [min]="resolvedStartMin()"
            [max]="resolvedStartMax()"
            [disabled]="inputDisabled()"
            [placeholder]="startPlaceholder"
          />
          <button
            matSuffix
            type="button"
            class="date-input__toggle"
            [class.date-input__toggle--open]="isPickerOpen('start-date')"
            [attr.aria-pressed]="isPickerOpen('start-date')"
            [disabled]="inputDisabled()"
            (mousedown)="$event.preventDefault()"
            (click)="toggleDatePicker(startPicker, 'start-date', $event)"
            [attr.aria-label]="'date.input.toggle.start.date.aria' | i18n"
          >
            <mat-icon>{{ pickerIcon('start-date', 'calendar_month') }}</mat-icon>
          </button>
          <mat-datepicker
            #startPicker
            (opened)="setPickerOpen('start-date', true)"
            (closed)="setPickerOpen('start-date', false)"
          ></mat-datepicker>
        </mat-form-field>
        @if (hasTime()) {
          <mat-form-field appearance="outline" class="date-input__material date-input__material--time" subscriptSizing="dynamic">
            <input
              matInput
              [matTimepicker]="startTimePicker"
              [matTimepickerOpenOnClick]="timeOpenOnClick()"
              [ngModel]="startTimeValue"
              (ngModelChange)="onStartTimeChange($event)"
              (blur)="markTouched()"
              [disabled]="inputDisabled()"
            />
            <button
              matSuffix
              type="button"
              class="date-input__toggle"
              [class.date-input__toggle--open]="isPickerOpen('start-time')"
              [attr.aria-pressed]="isPickerOpen('start-time')"
              [disabled]="inputDisabled()"
              (mousedown)="$event.preventDefault()"
              (click)="toggleTimePicker(startTimePicker, 'start-time', $event)"
              [attr.aria-label]="'date.input.toggle.start.time.aria' | i18n"
            >
              <mat-icon>{{ pickerIcon('start-time', 'schedule') }}</mat-icon>
            </button>
            <mat-timepicker
              #startTimePicker
              (opened)="setPickerOpen('start-time', true)"
              (closed)="setPickerOpen('start-time', false)"
            ></mat-timepicker>
          </mat-form-field>
        }
      </div>
    </label>

    <label class="date-input__field">
      <span class="date-input__label">{{ endLabel }}@if (endRequired) { <strong>*</strong> }</span>
      <div class="date-input__row">
        <mat-form-field appearance="outline" class="date-input__material date-input__material--date" subscriptSizing="dynamic">
          <input
            matInput
            [matDatepicker]="endPicker"
            [ngModel]="endDateValue"
            (ngModelChange)="onEndDateChange($event)"
            (blur)="markTouched()"
            [min]="resolvedEndMin()"
            [max]="resolvedEndMax()"
            [disabled]="inputDisabled()"
            [placeholder]="endPlaceholder"
          />
          <button
            matSuffix
            type="button"
            class="date-input__toggle"
            [class.date-input__toggle--open]="isPickerOpen('end-date')"
            [attr.aria-pressed]="isPickerOpen('end-date')"
            [disabled]="inputDisabled()"
            (mousedown)="$event.preventDefault()"
            (click)="toggleDatePicker(endPicker, 'end-date', $event)"
            [attr.aria-label]="'date.input.toggle.end.date.aria' | i18n"
          >
            <mat-icon>{{ pickerIcon('end-date', 'calendar_month') }}</mat-icon>
          </button>
          <mat-datepicker
            #endPicker
            (opened)="setPickerOpen('end-date', true)"
            (closed)="setPickerOpen('end-date', false)"
          ></mat-datepicker>
        </mat-form-field>
        @if (hasTime()) {
          <mat-form-field appearance="outline" class="date-input__material date-input__material--time" subscriptSizing="dynamic">
            <input
              matInput
              [matTimepicker]="endTimePicker"
              [matTimepickerOpenOnClick]="timeOpenOnClick()"
              [ngModel]="endTimeValue"
              (ngModelChange)="onEndTimeChange($event)"
              (blur)="markTouched()"
              [disabled]="inputDisabled()"
            />
            <button
              matSuffix
              type="button"
              class="date-input__toggle"
              [class.date-input__toggle--open]="isPickerOpen('end-time')"
              [attr.aria-pressed]="isPickerOpen('end-time')"
              [disabled]="inputDisabled()"
              (mousedown)="$event.preventDefault()"
              (click)="toggleTimePicker(endTimePicker, 'end-time', $event)"
              [attr.aria-label]="'date.input.toggle.end.time.aria' | i18n"
            >
              <mat-icon>{{ pickerIcon('end-time', 'schedule') }}</mat-icon>
            </button>
            <mat-timepicker
              #endTimePicker
              (opened)="setPickerOpen('end-time', true)"
              (closed)="setPickerOpen('end-time', false)"
            ></mat-timepicker>
          </mat-form-field>
        }
      </div>
    </label>
  </div>
} @else {
  <div class="date-input date-input--single" [class.date-input--with-time]="hasTime()" [class.date-input--with-meta]="hasMeta()">
    <label class="date-input__field">
      @if (label) {
        <span class="date-input__label">{{ label }}@if (required) { <strong>*</strong> }</span>
      }
      <div class="date-input__row">
        <mat-form-field appearance="outline" class="date-input__material date-input__material--date" subscriptSizing="dynamic">
          <input
            matInput
            [matDatepicker]="singlePicker"
            [ngModel]="singleDateValue"
            [ngModelOptions]="{ updateOn: model?.updateOn ?? 'change' }"
            (ngModelChange)="onSingleDateChange($event)"
            (blur)="markTouched()"
            [min]="resolvedSingleMin()"
            [max]="resolvedSingleMax()"
            [disabled]="inputDisabled()"
            [placeholder]="placeholder"
          />
          <button
            matSuffix
            type="button"
            class="date-input__toggle"
            [class.date-input__toggle--open]="isPickerOpen('single-date')"
            [attr.aria-pressed]="isPickerOpen('single-date')"
            [disabled]="inputDisabled()"
            (mousedown)="$event.preventDefault()"
            (click)="toggleDatePicker(singlePicker, 'single-date', $event)"
            [attr.aria-label]="'date.input.toggle.date.aria' | i18n"
          >
            <mat-icon>{{ pickerIcon('single-date', 'calendar_month') }}</mat-icon>
          </button>
          <mat-datepicker
            #singlePicker
            (opened)="setPickerOpen('single-date', true)"
            (closed)="setPickerOpen('single-date', false)"
          ></mat-datepicker>
        </mat-form-field>
        @if (hasTime()) {
          <mat-form-field appearance="outline" class="date-input__material date-input__material--time" subscriptSizing="dynamic">
            <input
              matInput
              [matTimepicker]="singleTimePicker"
              [matTimepickerOpenOnClick]="timeOpenOnClick()"
              [ngModel]="singleTimeValue"
              (ngModelChange)="onSingleTimeChange($event)"
              (blur)="markTouched()"
              [disabled]="inputDisabled()"
            />
            <button
              matSuffix
              type="button"
              class="date-input__toggle"
              [class.date-input__toggle--open]="isPickerOpen('single-time')"
              [attr.aria-pressed]="isPickerOpen('single-time')"
              [disabled]="inputDisabled()"
              (mousedown)="$event.preventDefault()"
              (click)="toggleTimePicker(singleTimePicker, 'single-time', $event)"
              [attr.aria-label]="'date.input.toggle.time.aria' | i18n"
            >
              <mat-icon>{{ pickerIcon('single-time', 'schedule') }}</mat-icon>
            </button>
            <mat-timepicker
              #singleTimePicker
              (opened)="setPickerOpen('single-time', true)"
              (closed)="setPickerOpen('single-time', false)"
            ></mat-timepicker>
          </mat-form-field>
        }
      </div>
    </label>
    @if (hasMeta()) {
      <div class="date-input__meta">
        @if (metaLabel()) {
          <span class="date-input__meta-label">{{ metaLabel() }}</span>
        }
        <span class="date-input__meta-badge" [ngClass]="'date-input__meta-badge--' + metaPalette()">
          @if (metaIcon()) {
            <span class="date-input__meta-icon">{{ metaIcon() }}</span>
          }
          <span>{{ metaValue() }}</span>
        </span>
      </div>
    }
  </div>
}
`, styles: ['/* src/app/shared/ui/components/core/form/inputs/date-input/date-input.component.scss */\n:host {\n  display: block;\n  grid-column: 1/-1;\n  width: 100%;\n  min-width: 0;\n}\n:host(.date-input-host--range-compact) {\n  --date-input-compact-control-width: 236px;\n  --date-input-compact-shell-height: 34px;\n  --date-input-compact-chip-height: 26px;\n  --date-input-compact-chip-width: 10ch;\n  grid-column: auto;\n  width: var(--date-input-compact-control-width);\n  min-width: var(--date-input-compact-control-width);\n  max-width: var(--date-input-compact-control-width);\n  flex: 0 0 var(--date-input-compact-control-width);\n  overflow: visible;\n}\n.date-input {\n  display: grid;\n  gap: 0.62rem;\n  width: 100%;\n}\n.date-input--range {\n  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);\n  align-items: start;\n  gap: 0.72rem;\n}\n.date-input--range-compact {\n  grid-template-columns: minmax(0, 1fr);\n  gap: 0;\n}\n.date-input--range-compact .date-input__field,\n.date-input--range-compact .date-input__row {\n  gap: 0;\n}\n.date-input--single.date-input--with-meta {\n  grid-template-columns: minmax(0, 1fr) max-content;\n  align-items: end;\n}\n.date-input--time {\n  grid-template-columns: minmax(0, 1fr);\n}\n.date-input__field {\n  display: grid;\n  gap: 0.34rem;\n  min-width: 0;\n}\n.date-input__label {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.18rem;\n  color: #203a5d;\n  font-weight: 700;\n  font-size: 0.84rem;\n  line-height: 1.2;\n}\n.date-input__label strong {\n  color: #cf283f;\n  font-weight: 800;\n}\n.date-input__row {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr);\n  align-items: center;\n  gap: 0.5rem;\n  min-width: 0;\n}\n.date-input--with-time .date-input__row {\n  grid-template-columns: minmax(0, 1fr) minmax(132px, 148px);\n}\n.date-input__material {\n  width: 100%;\n  min-width: 0;\n}\n:host ::ng-deep .date-input__material .mat-mdc-text-field-wrapper {\n  min-height: 38px;\n  height: 38px;\n  padding: 0 0.48rem 0 0.72rem;\n  border: 1px solid rgba(112, 143, 184, 0.56);\n  border-radius: 10px;\n  background: #fff !important;\n  box-shadow: none;\n}\n:host ::ng-deep .date-input__material .mat-mdc-text-field-wrapper.mdc-text-field {\n  background-color: #fff !important;\n}\n:host ::ng-deep .date-input__material.mat-focused .mat-mdc-text-field-wrapper {\n  border-color: rgba(56, 114, 190, 0.82);\n  box-shadow: 0 0 0 3px rgba(56, 114, 190, 0.1);\n}\n:host ::ng-deep .date-input__material .mdc-text-field,\n:host ::ng-deep .date-input__material .mdc-text-field--filled {\n  background: transparent;\n}\n:host ::ng-deep .date-input__material .mdc-notched-outline__leading,\n:host ::ng-deep .date-input__material .mdc-notched-outline__notch,\n:host ::ng-deep .date-input__material .mdc-notched-outline__trailing {\n  border: 0;\n}\n:host ::ng-deep .date-input__material .mat-mdc-form-field-flex {\n  min-height: 36px;\n  align-items: center;\n}\n:host ::ng-deep .date-input__material .mat-mdc-form-field-infix {\n  width: auto;\n  min-height: 0;\n  padding: 0;\n}\n:host ::ng-deep .date-input__material .mat-mdc-input-element {\n  color: #183358;\n  font-size: 0.92rem;\n  line-height: 1.2;\n  min-width: 0;\n}\n:host ::ng-deep .date-input__material .mat-mdc-input-element:focus,\n:host ::ng-deep .date-input__material .mat-mdc-input-element:focus-visible {\n  outline: none;\n  box-shadow: none;\n}\n:host ::ng-deep .date-input__material .mat-mdc-input-element::placeholder {\n  color: rgba(45, 68, 97, 0.52);\n}\n:host ::ng-deep .date-input__material .mat-mdc-form-field-subscript-wrapper,\n:host ::ng-deep .date-input__material .mat-mdc-form-field-bottom-align,\n:host ::ng-deep .date-input__material .mdc-line-ripple,\n:host ::ng-deep .date-input__material .mat-mdc-form-field-line-ripple,\n:host ::ng-deep .date-input__material .mdc-line-ripple--deactivating,\n:host ::ng-deep .date-input__material .mdc-line-ripple--active {\n  display: none;\n}\n:host ::ng-deep .date-input__material .mat-mdc-form-field-icon-suffix {\n  align-self: stretch;\n  display: inline-flex;\n  align-items: center;\n  padding: 0;\n}\n:host ::ng-deep .date-input__material--range .mat-date-range-input-container {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);\n  min-height: 36px;\n  height: 36px;\n  align-items: center;\n  color: #183358;\n}\n:host ::ng-deep .date-input__material--range .mat-date-range-input-wrapper,\n:host ::ng-deep .date-input__material--range .mat-date-range-input-start-wrapper,\n:host ::ng-deep .date-input__material--range .mat-date-range-input-end-wrapper {\n  display: flex;\n  align-items: center;\n  min-width: 0;\n  min-height: 36px;\n  height: 36px;\n  overflow: hidden;\n}\n:host ::ng-deep .date-input__material--range .mat-date-range-input-inner {\n  color: #183358;\n  font-size: 0.92rem;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  margin: 0;\n  padding: 0;\n  line-height: normal;\n  min-width: 0;\n}\n:host ::ng-deep .date-input__material--range .mat-date-range-input-inner::placeholder {\n  color: rgba(45, 68, 97, 0.52);\n}\n:host ::ng-deep .date-input__material--range .mat-date-range-input-separator {\n  margin: 0 0.22rem;\n  color: rgba(45, 68, 97, 0.62);\n}\n:host ::ng-deep .date-input--range-compact .date-input__material .mat-mdc-text-field-wrapper {\n  min-height: var(--date-input-compact-shell-height);\n  height: var(--date-input-compact-shell-height);\n  padding: 0 0.22rem 0 0.46rem;\n  border-color: rgba(42, 83, 141, 0.26);\n  border-radius: 999px;\n  background: #f7fbff !important;\n  overflow: visible;\n}\n:host ::ng-deep .date-input--range-compact .date-input__material.mat-focused .mat-mdc-text-field-wrapper {\n  border-color: rgba(56, 114, 190, 0.74);\n  box-shadow: 0 0 0 3px rgba(56, 114, 190, 0.1);\n}\n:host ::ng-deep .date-input--range-compact .date-input__material .mat-mdc-form-field-flex,\n:host ::ng-deep .date-input--range-compact .date-input__material .mat-mdc-form-field-infix,\n:host ::ng-deep .date-input--range-compact .date-input__material .mat-date-range-input-wrapper,\n:host ::ng-deep .date-input--range-compact .date-input__material .mat-date-range-input-start-wrapper,\n:host ::ng-deep .date-input--range-compact .date-input__material .mat-date-range-input-end-wrapper {\n  min-width: 0;\n  min-height: var(--date-input-compact-shell-height);\n  height: var(--date-input-compact-shell-height);\n  overflow: hidden;\n  border-bottom: 0 !important;\n  box-shadow: none !important;\n}\n:host ::ng-deep .date-input--range-compact .date-input__material .mat-mdc-form-field-flex,\n:host ::ng-deep .date-input--range-compact .date-input__material .mat-date-range-input-wrapper,\n:host ::ng-deep .date-input--range-compact .date-input__material .mat-date-range-input-start-wrapper,\n:host ::ng-deep .date-input--range-compact .date-input__material .mat-date-range-input-end-wrapper,\n:host ::ng-deep .date-input--range-compact .date-input__material .mat-date-range-input-mirror {\n  display: flex;\n  align-items: center;\n}\n:host ::ng-deep .date-input--range-compact .date-input__material .mat-mdc-form-field-infix {\n  width: auto !important;\n  flex: 1 1 auto;\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n}\n:host ::ng-deep .date-input--range-compact .date-input__material .mat-mdc-form-field-focus-overlay {\n  background: transparent !important;\n  opacity: 0 !important;\n}\n:host ::ng-deep .date-input--range-compact .date-input__material .mat-mdc-form-field-icon-suffix {\n  align-self: stretch;\n  flex: 0 0 auto;\n  min-width: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding-right: 0.14rem;\n}\n:host ::ng-deep .date-input--range-compact .date-input__material--range .mat-date-range-input-container {\n  grid-template-columns: var(--date-input-compact-chip-width) 12px var(--date-input-compact-chip-width);\n  column-gap: 0.12rem;\n  width: 100%;\n  min-height: var(--date-input-compact-shell-height);\n  height: var(--date-input-compact-shell-height);\n  align-items: center;\n  justify-content: center;\n  overflow: hidden;\n}\n:host ::ng-deep .date-input--range-compact .date-input__material--range .mat-date-range-input-wrapper,\n:host ::ng-deep .date-input--range-compact .date-input__material--range .mat-date-range-input-start-wrapper,\n:host ::ng-deep .date-input--range-compact .date-input__material--range .mat-date-range-input-end-wrapper {\n  flex: 0 0 var(--date-input-compact-chip-width) !important;\n  width: var(--date-input-compact-chip-width);\n  max-width: var(--date-input-compact-chip-width);\n  min-height: var(--date-input-compact-chip-height);\n  height: var(--date-input-compact-chip-height);\n  justify-content: center;\n  border-radius: 999px;\n  background: #fff;\n  box-shadow: inset 0 0 0 1px rgba(42, 83, 141, 0.16) !important;\n}\n:host ::ng-deep .date-input--range-compact .date-input__material--range .mat-date-range-input-end-wrapper {\n  flex-grow: 0 !important;\n}\n:host ::ng-deep .date-input--range-compact .date-input__material--range .mat-date-range-input-separator {\n  min-height: var(--date-input-compact-shell-height);\n  height: var(--date-input-compact-shell-height);\n  margin: 0;\n  color: #5f7899;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  line-height: var(--date-input-compact-shell-height);\n}\n:host ::ng-deep .date-input--range-compact .date-input__material--range .mat-date-range-input-inner,\n:host ::ng-deep .date-input--range-compact .date-input__material--range input,\n:host ::ng-deep .date-input--range-compact .date-input__material--range .mat-date-range-input-mirror {\n  height: var(--date-input-compact-chip-height);\n  min-height: var(--date-input-compact-chip-height);\n  font-size: 0.76rem;\n  font-weight: 700;\n  color: #2c4c74;\n  line-height: var(--date-input-compact-chip-height);\n  text-align: center;\n  align-self: center;\n}\n:host ::ng-deep .date-input--range-compact .date-input__material--range .mat-date-range-input-inner::placeholder {\n  color: rgba(44, 76, 116, 0.48);\n}\n.date-input__toggle {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 28px;\n  height: 28px;\n  min-width: 28px;\n  min-height: 28px;\n  padding: 0;\n  border: 0;\n  border-radius: 999px;\n  background: transparent;\n  color: #315a86;\n  cursor: pointer;\n  transform-origin: center;\n  transition:\n    background-color 0.14s ease,\n    color 0.14s ease,\n    transform 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.date-input__toggle:hover {\n  background: rgba(59, 104, 164, 0.1);\n  color: #224a74;\n}\n.date-input__toggle:active {\n  transform: scale(0.94);\n}\n.date-input__toggle--open {\n  background: rgba(49, 90, 134, 0.14);\n  color: #1f4d7d;\n  box-shadow: inset 0 0 0 1px rgba(49, 90, 134, 0.14);\n}\n.date-input__toggle--open:hover {\n  background: rgba(49, 90, 134, 0.18);\n}\n.date-input--range-compact .date-input__toggle {\n  color: #365677;\n  align-self: center;\n}\n.date-input--range-compact .date-input__toggle:hover {\n  background: rgba(61, 104, 167, 0.1);\n  color: #24486e;\n}\n.date-input__toggle:disabled {\n  cursor: default;\n  opacity: 0.58;\n  transform: none;\n  pointer-events: none;\n}\n.date-input__toggle .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  transform-origin: center;\n  transition:\n    transform 0.18s cubic-bezier(0.22, 0.61, 0.36, 1),\n    opacity 0.14s ease,\n    filter 0.14s ease;\n}\n.date-input__toggle--open .mat-icon {\n  transform: rotate(90deg);\n}\n.date-input__meta {\n  display: grid;\n  gap: 0.34rem;\n  justify-items: start;\n  min-width: 0;\n}\n.date-input__meta-label {\n  color: #203a5d;\n  font-size: 0.84rem;\n  font-weight: 700;\n  line-height: 1.2;\n}\n.date-input__meta-badge {\n  min-height: 38px;\n  box-sizing: border-box;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  width: fit-content;\n  max-width: 100%;\n  padding: 0 14px;\n  border: 1px solid #b9cce5;\n  border-radius: 999px;\n  background: #f3f8ff;\n  color: #27568e;\n  box-shadow: 0 8px 18px rgba(41, 84, 135, 0.08);\n  font-size: 0.88rem;\n  font-weight: 900;\n  line-height: 1.1;\n  white-space: nowrap;\n}\n.date-input__meta-icon {\n  width: 18px;\n  height: 18px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-family:\n    "Noto Sans Symbols 2",\n    "Noto Sans Symbols",\n    "Segoe UI Symbol",\n    sans-serif;\n  font-size: 18px;\n  line-height: 18px;\n}\n.date-input__meta-badge--purple {\n  border-color: #c8b7f2;\n  background: #f5efff;\n  color: #6941a6;\n  box-shadow: 0 8px 18px rgba(105, 65, 166, 0.1);\n}\n.date-input__meta-badge--blue {\n  border-color: #b9cce5;\n  background: #f3f8ff;\n  color: #27568e;\n  box-shadow: 0 8px 18px rgba(41, 84, 135, 0.08);\n}\n.date-input__meta-badge--green {\n  border-color: #a8dcb8;\n  background: #f0fbf3;\n  color: #2f7b47;\n  box-shadow: 0 8px 18px rgba(47, 123, 71, 0.1);\n}\n.date-input__meta-badge--violet {\n  border-color: #c9b7e8;\n  background: #f7f1ff;\n  color: #65409b;\n  box-shadow: 0 8px 18px rgba(101, 64, 155, 0.1);\n}\n.date-input__meta-badge--pink {\n  border-color: #efb7d3;\n  background: #fff0f7;\n  color: #9a3f70;\n  box-shadow: 0 8px 18px rgba(154, 63, 112, 0.1);\n}\n.date-input__meta-badge--orange {\n  border-color: #efc19d;\n  background: #fff5ec;\n  color: #93551e;\n  box-shadow: 0 8px 18px rgba(147, 85, 30, 0.1);\n}\n.date-input__meta-badge--brown {\n  border-color: #d7bd9c;\n  background: #fbf4ec;\n  color: #77502b;\n  box-shadow: 0 8px 18px rgba(119, 80, 43, 0.1);\n}\n.date-input__meta-badge--teal {\n  border-color: #a8d7d5;\n  background: #effafa;\n  color: #286f72;\n  box-shadow: 0 8px 18px rgba(40, 111, 114, 0.1);\n}\n.date-input__meta-badge--muted {\n  border-color: #c7d0dc;\n  background: #f5f7fa;\n  color: #536274;\n  box-shadow: 0 8px 18px rgba(83, 98, 116, 0.08);\n}\n.date-input__meta-badge--aries {\n  border-color: #efb2a5;\n  background: #fff1ed;\n  color: #9b3f2c;\n  box-shadow: 0 8px 18px rgba(155, 63, 44, 0.1);\n}\n.date-input__meta-badge--taurus {\n  border-color: #a7d69f;\n  background: #f0faee;\n  color: #3d7a31;\n  box-shadow: 0 8px 18px rgba(61, 122, 49, 0.1);\n}\n.date-input__meta-badge--gemini {\n  border-color: #e6ce77;\n  background: #fff9dc;\n  color: #806219;\n  box-shadow: 0 8px 18px rgba(128, 98, 25, 0.1);\n}\n.date-input__meta-badge--cancer {\n  border-color: #9fd8e6;\n  background: #effbff;\n  color: #237083;\n  box-shadow: 0 8px 18px rgba(35, 112, 131, 0.1);\n}\n.date-input__meta-badge--leo {\n  border-color: #efc061;\n  background: #fff5d9;\n  color: #975d12;\n  box-shadow: 0 8px 18px rgba(151, 93, 18, 0.1);\n}\n.date-input__meta-badge--virgo {\n  border-color: #bfd28d;\n  background: #f8fbe9;\n  color: #62752b;\n  box-shadow: 0 8px 18px rgba(98, 117, 43, 0.1);\n}\n.date-input__meta-badge--libra {\n  border-color: #efb7d3;\n  background: #fff0f7;\n  color: #9a3f70;\n  box-shadow: 0 8px 18px rgba(154, 63, 112, 0.1);\n}\n.date-input__meta-badge--scorpio {\n  border-color: #c0a3d9;\n  background: #f7effc;\n  color: #663285;\n  box-shadow: 0 8px 18px rgba(102, 50, 133, 0.1);\n}\n.date-input__meta-badge--sagittarius {\n  border-color: #b9a8ee;\n  background: #f4f0ff;\n  color: #553ca0;\n  box-shadow: 0 8px 18px rgba(85, 60, 160, 0.1);\n}\n.date-input__meta-badge--capricorn {\n  border-color: #cdb497;\n  background: #fbf2e9;\n  color: #705032;\n  box-shadow: 0 8px 18px rgba(112, 80, 50, 0.1);\n}\n.date-input__meta-badge--aquarius {\n  border-color: #a8c8ef;\n  background: #f0f7ff;\n  color: #2c5f9f;\n  box-shadow: 0 8px 18px rgba(44, 95, 159, 0.1);\n}\n.date-input__meta-badge--pisces {\n  border-color: #9cd5cf;\n  background: #effaf8;\n  color: #277268;\n  box-shadow: 0 8px 18px rgba(39, 114, 104, 0.1);\n}\n:host ::ng-deep .date-input__material.mat-mdc-form-field-disabled .mat-mdc-text-field-wrapper {\n  background:\n    linear-gradient(\n      180deg,\n      #f3f6fa 0%,\n      #e8edf5 100%) !important;\n  border-color: rgba(122, 140, 168, 0.42);\n  box-shadow: none;\n  cursor: not-allowed;\n}\n:host ::ng-deep .date-input__material.mat-mdc-form-field-disabled .mat-mdc-input-element,\n:host ::ng-deep .date-input__material.mat-mdc-form-field-disabled .mat-icon {\n  color: rgba(58, 76, 103, 0.7) !important;\n  -webkit-text-fill-color: rgba(58, 76, 103, 0.7);\n}\n@media (max-width: 760px) {\n  .date-input--range {\n    grid-template-columns: 1fr;\n  }\n  .date-input--single.date-input--with-meta {\n    grid-template-columns: minmax(0, 1fr) max-content;\n    column-gap: 0.5rem;\n  }\n  .date-input--with-time .date-input__row {\n    grid-template-columns: minmax(0, 1fr) minmax(108px, 122px);\n  }\n  :host ::ng-deep .date-input--range-compact .date-input__material--range .mat-date-range-input-container {\n    grid-template-columns: 10ch 12px 10ch;\n    column-gap: 0.08rem;\n  }\n  :host ::ng-deep .date-input--range-compact .date-input__material--range .mat-date-range-input-inner,\n  :host ::ng-deep .date-input--range-compact .date-input__material--range input {\n    font-size: 0.74rem;\n  }\n  :host ::ng-deep .date-input--range-compact .date-input__material .mat-mdc-form-field-icon-suffix {\n    padding-right: 0.06rem;\n  }\n}\n@media (max-width: 520px) {\n  .date-input--single.date-input--with-meta {\n    column-gap: 0.42rem;\n  }\n  .date-input__meta-badge {\n    min-height: 36px;\n    padding: 0 10px;\n    gap: 6px;\n    font-size: 0.84rem;\n  }\n  .date-input__meta-icon {\n    width: 16px;\n    height: 16px;\n    font-size: 16px;\n    line-height: 16px;\n  }\n  .date-input--with-time .date-input__row {\n    grid-template-columns: minmax(0, 1fr) minmax(86px, 104px);\n    gap: 0.42rem;\n  }\n}\n/*# sourceMappingURL=date-input.component.css.map */\n'] }]
  }], () => [{ type: ChangeDetectorRef }], { model: [{
    type: Input
  }], compactRangeHost: [{
    type: HostBinding,
    args: ["class.date-input-host--range-compact"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DateInputComponent, { className: "DateInputComponent", filePath: "app/shared/ui/components/core/form/inputs/date-input/date-input.component.ts", lineNumber: 135 });
})();

export {
  DateInputComponent
};
//# sourceMappingURL=chunk-XWLWXSMR.js.map
