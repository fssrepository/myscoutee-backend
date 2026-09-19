import {
  FormFlowPopupStore
} from "./chunk-RCCI52V4.js";
import {
  AppMenuTriggerComponent
} from "./chunk-EAXEH725.js";
import {
  AppMenuDispatcher,
  AppMenuOutletComponent
} from "./chunk-53UGBDSO.js";
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  MAT_FORM_FIELD,
  MatDateRangeInput,
  MatDateRangePicker,
  MatDatepickerModule,
  MatDatepickerToggle,
  MatEndDate,
  MatFormField,
  MatFormFieldControl,
  MatFormFieldModule,
  MatInputModule,
  MatStartDate,
  MatSuffix,
  OVERLAY_DEFAULT_CONFIG,
  OverlayModule,
  createRepositionScrollStrategy
} from "./chunk-DYRCSW2W.js";
import {
  A,
  ActiveDescendantKeyManager,
  DOWN_ARROW,
  ENTER,
  ESCAPE,
  ErrorStateMatcher,
  LEFT_ARROW,
  LiveAnnouncer,
  MAT_OPTGROUP,
  MAT_OPTION_PARENT_COMPONENT,
  MatNativeDateModule,
  MatOption,
  MatOptionModule,
  RIGHT_ARROW,
  SPACE,
  UP_ARROW,
  _ErrorStateTracker,
  _animationsDisabled,
  _countGroupLabelsBeforeOption,
  _getOptionScrollPosition,
  addAriaReferencedId,
  hasModifierKey,
  removeAriaReferencedId
} from "./chunk-WKZNFPJU.js";
import {
  CdkScrollableModule,
  ViewportRuler
} from "./chunk-QPFHBVSW.js";
import {
  _IdGenerator,
  _getEventTarget
} from "./chunk-A3L6CHD4.js";
import {
  BidiModule,
  DefaultValueAccessor,
  Directionality,
  FormGroupDirective,
  FormsModule,
  I18nPipe,
  MatIcon,
  MatIconModule,
  MaxValidator,
  MinValidator,
  NG_VALUE_ACCESSOR,
  NgControl,
  NgControlStatus,
  NgForm,
  NgModel,
  NumberValueAccessor,
  Validators
} from "./chunk-L6HJFJOR.js";
import {
  PricingBuilder
} from "./chunk-LM6UNLJK.js";
import {
  I18nService
} from "./chunk-AOUY6FNC.js";
import {
  CommonModule,
  DecimalPipe,
  NgComponentOutlet,
  NgTemplateOutlet
} from "./chunk-SCHUURLR.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  HostAttributeToken,
  HostListener,
  InjectionToken,
  Injector,
  Input,
  NgModule,
  Output,
  Renderer2,
  Subject,
  ViewChild,
  ViewEncapsulation,
  __spreadProps,
  __spreadValues,
  booleanAttribute,
  computed,
  defer,
  effect,
  filter,
  forwardRef,
  inject,
  map,
  merge,
  numberAttribute,
  setClassMetadata,
  signal,
  startWith,
  switchMap,
  take,
  takeUntil,
  untracked,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵcomponentInstance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵresolveDocument,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuery
} from "./chunk-EV3I3YNV.js";

// node_modules/@angular/cdk/fesm2022/_selection-model-chunk.mjs
var SelectionModel = class {
  _multiple;
  _emitChanges;
  compareWith;
  _selection = /* @__PURE__ */ new Set();
  _deselectedToEmit = [];
  _selectedToEmit = [];
  _selected = null;
  get selected() {
    if (!this._selected) {
      this._selected = Array.from(this._selection.values());
    }
    return this._selected;
  }
  changed = new Subject();
  constructor(_multiple = false, initiallySelectedValues, _emitChanges = true, compareWith) {
    this._multiple = _multiple;
    this._emitChanges = _emitChanges;
    this.compareWith = compareWith;
    if (initiallySelectedValues && initiallySelectedValues.length) {
      if (_multiple) {
        initiallySelectedValues.forEach((value) => this._markSelected(value));
      } else {
        this._markSelected(initiallySelectedValues[0]);
      }
      this._selectedToEmit.length = 0;
    }
  }
  select(...values) {
    this._verifyValueAssignment(values);
    values.forEach((value) => this._markSelected(value));
    const changed = this._hasQueuedChanges();
    this._emitChangeEvent();
    return changed;
  }
  deselect(...values) {
    this._verifyValueAssignment(values);
    values.forEach((value) => this._unmarkSelected(value));
    const changed = this._hasQueuedChanges();
    this._emitChangeEvent();
    return changed;
  }
  setSelection(...values) {
    this._verifyValueAssignment(values);
    const oldValues = this.selected;
    const newSelectedSet = new Set(values.map((value) => this._getConcreteValue(value)));
    values.forEach((value) => this._markSelected(value));
    oldValues.filter((value) => !newSelectedSet.has(this._getConcreteValue(value, newSelectedSet))).forEach((value) => this._unmarkSelected(value));
    const changed = this._hasQueuedChanges();
    this._emitChangeEvent();
    return changed;
  }
  toggle(value) {
    return this.isSelected(value) ? this.deselect(value) : this.select(value);
  }
  clear(flushEvent = true) {
    this._unmarkAll();
    const changed = this._hasQueuedChanges();
    if (flushEvent) {
      this._emitChangeEvent();
    }
    return changed;
  }
  isSelected(value) {
    return this._selection.has(this._getConcreteValue(value));
  }
  isEmpty() {
    return this._selection.size === 0;
  }
  hasValue() {
    return !this.isEmpty();
  }
  sort(predicate) {
    if (this._multiple && this.selected) {
      this._selected.sort(predicate);
    }
  }
  isMultipleSelection() {
    return this._multiple;
  }
  _emitChangeEvent() {
    this._selected = null;
    if (this._selectedToEmit.length || this._deselectedToEmit.length) {
      this.changed.next({
        source: this,
        added: this._selectedToEmit,
        removed: this._deselectedToEmit
      });
      this._deselectedToEmit = [];
      this._selectedToEmit = [];
    }
  }
  _markSelected(value) {
    value = this._getConcreteValue(value);
    if (!this.isSelected(value)) {
      if (!this._multiple) {
        this._unmarkAll();
      }
      if (!this.isSelected(value)) {
        this._selection.add(value);
      }
      if (this._emitChanges) {
        this._selectedToEmit.push(value);
      }
    }
  }
  _unmarkSelected(value) {
    value = this._getConcreteValue(value);
    if (this.isSelected(value)) {
      this._selection.delete(value);
      if (this._emitChanges) {
        this._deselectedToEmit.push(value);
      }
    }
  }
  _unmarkAll() {
    if (!this.isEmpty()) {
      this._selection.forEach((value) => this._unmarkSelected(value));
    }
  }
  _verifyValueAssignment(values) {
    if (values.length > 1 && !this._multiple && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw getMultipleValuesInSingleSelectionError();
    }
  }
  _hasQueuedChanges() {
    return !!(this._deselectedToEmit.length || this._selectedToEmit.length);
  }
  _getConcreteValue(inputValue, selection) {
    if (!this.compareWith) {
      return inputValue;
    } else {
      selection = selection ?? this._selection;
      for (let selectedValue of selection) {
        if (this.compareWith(inputValue, selectedValue)) {
          return selectedValue;
        }
      }
      return inputValue;
    }
  }
};
function getMultipleValuesInSingleSelectionError() {
  return Error("Cannot pass multiple values into SelectionModel with single-value mode.");
}

// node_modules/@angular/material/fesm2022/select.mjs
var _c0 = ["trigger"];
var _c1 = ["panel"];
var _c2 = [[["mat-select-trigger"]], "*"];
var _c3 = ["mat-select-trigger", "*"];
function MatSelect_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.placeholder);
  }
}
function MatSelect_Conditional_5_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275projection(0);
  }
}
function MatSelect_Conditional_5_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.triggerValue);
  }
}
function MatSelect_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 5);
    \u0275\u0275conditionalCreate(1, MatSelect_Conditional_5_Conditional_1_Template, 1, 0)(2, MatSelect_Conditional_5_Conditional_2_Template, 2, 1, "span", 11);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.customTrigger ? 1 : 2);
  }
}
function MatSelect_ng_template_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 12, 1);
    \u0275\u0275listener("keydown", function MatSelect_ng_template_10_Template_div_keydown_0_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0._handleKeydown($event));
    });
    \u0275\u0275projection(2, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r0.panelClass);
    \u0275\u0275classProp("mat-select-panel-animations-enabled", !ctx_r0._animationsDisabled)("mat-primary", (ctx_r0._parentFormField == null ? null : ctx_r0._parentFormField.color) === "primary")("mat-accent", (ctx_r0._parentFormField == null ? null : ctx_r0._parentFormField.color) === "accent")("mat-warn", (ctx_r0._parentFormField == null ? null : ctx_r0._parentFormField.color) === "warn")("mat-undefined", !(ctx_r0._parentFormField == null ? null : ctx_r0._parentFormField.color));
    \u0275\u0275attribute("id", ctx_r0.id + "-panel")("aria-multiselectable", ctx_r0.multiple)("aria-label", ctx_r0.ariaLabel || null)("aria-labelledby", ctx_r0._getPanelAriaLabelledby());
  }
}
function getMatSelectDynamicMultipleError() {
  return Error("Cannot change `multiple` mode of select after initialization.");
}
function getMatSelectNonArrayValueError() {
  return Error("Value must be an array in multiple-selection mode.");
}
function getMatSelectNonFunctionValueError() {
  return Error("`compareWith` must be a function.");
}
var MAT_SELECT_SCROLL_STRATEGY = new InjectionToken("mat-select-scroll-strategy", {
  providedIn: "root",
  factory: () => {
    const injector = inject(Injector);
    return () => createRepositionScrollStrategy(injector);
  }
});
var MAT_SELECT_CONFIG = new InjectionToken("MAT_SELECT_CONFIG");
var MAT_SELECT_TRIGGER = new InjectionToken("MatSelectTrigger");
var MatSelectChange = class {
  source;
  value;
  constructor(source, value) {
    this.source = source;
    this.value = value;
  }
};
var MatSelect = class _MatSelect {
  _viewportRuler = inject(ViewportRuler);
  _changeDetectorRef = inject(ChangeDetectorRef);
  _elementRef = inject(ElementRef);
  _dir = inject(Directionality, {
    optional: true
  });
  _idGenerator = inject(_IdGenerator);
  _renderer = inject(Renderer2);
  _parentFormField = inject(MAT_FORM_FIELD, {
    optional: true
  });
  ngControl = inject(NgControl, {
    self: true,
    optional: true
  });
  _liveAnnouncer = inject(LiveAnnouncer);
  _defaultOptions = inject(MAT_SELECT_CONFIG, {
    optional: true
  });
  _animationsDisabled = _animationsDisabled();
  _popoverLocation;
  _initialized = new Subject();
  _cleanupDetach;
  options;
  optionGroups;
  customTrigger;
  _positions = [{
    originX: "start",
    originY: "bottom",
    overlayX: "start",
    overlayY: "top"
  }, {
    originX: "end",
    originY: "bottom",
    overlayX: "end",
    overlayY: "top"
  }, {
    originX: "start",
    originY: "top",
    overlayX: "start",
    overlayY: "bottom",
    panelClass: "mat-mdc-select-panel-above"
  }, {
    originX: "end",
    originY: "top",
    overlayX: "end",
    overlayY: "bottom",
    panelClass: "mat-mdc-select-panel-above"
  }];
  _scrollOptionIntoView(index) {
    const option = this.options.toArray()[index];
    if (option) {
      const panel = this.panel.nativeElement;
      const labelCount = _countGroupLabelsBeforeOption(index, this.options, this.optionGroups);
      const element = option._getHostElement();
      if (index === 0 && labelCount === 1) {
        panel.scrollTop = 0;
      } else {
        panel.scrollTop = _getOptionScrollPosition(element.offsetTop, element.offsetHeight, panel.scrollTop, panel.offsetHeight);
      }
    }
  }
  _positioningSettled() {
    this._scrollOptionIntoView(this._keyManager.activeItemIndex || 0);
  }
  _getChangeEvent(value) {
    return new MatSelectChange(this, value);
  }
  _scrollStrategyFactory = inject(MAT_SELECT_SCROLL_STRATEGY);
  _panelOpen = false;
  _compareWith = (o1, o2) => o1 === o2;
  _uid = this._idGenerator.getId("mat-select-");
  _triggerAriaLabelledBy = null;
  _previousControl;
  _destroy = new Subject();
  _errorStateTracker;
  stateChanges = new Subject();
  disableAutomaticLabeling = true;
  userAriaDescribedBy;
  _selectionModel;
  _keyManager;
  _preferredOverlayOrigin;
  _overlayWidth;
  _onChange = () => {
  };
  _onTouched = () => {
  };
  _valueId = this._idGenerator.getId("mat-select-value-");
  _scrollStrategy;
  _overlayPanelClass = this._defaultOptions?.overlayPanelClass || "";
  get focused() {
    return this._focused || this._panelOpen;
  }
  _focused = false;
  controlType = "mat-select";
  trigger;
  panel;
  _overlayDir;
  panelClass;
  disabled = false;
  get disableRipple() {
    return this._disableRipple();
  }
  set disableRipple(value) {
    this._disableRipple.set(value);
  }
  _disableRipple = signal(false, ...ngDevMode ? [{
    debugName: "_disableRipple"
  }] : []);
  tabIndex = 0;
  get hideSingleSelectionIndicator() {
    return this._hideSingleSelectionIndicator;
  }
  set hideSingleSelectionIndicator(value) {
    this._hideSingleSelectionIndicator = value;
    this._syncParentProperties();
  }
  _hideSingleSelectionIndicator = this._defaultOptions?.hideSingleSelectionIndicator ?? false;
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(value) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  _placeholder;
  get required() {
    return this._required ?? this.ngControl?.control?.hasValidator(Validators.required) ?? false;
  }
  set required(value) {
    this._required = value;
    this.stateChanges.next();
  }
  _required;
  get multiple() {
    return this._multiple;
  }
  set multiple(value) {
    if (this._selectionModel && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw getMatSelectDynamicMultipleError();
    }
    this._multiple = value;
  }
  _multiple = false;
  disableOptionCentering = this._defaultOptions?.disableOptionCentering ?? false;
  get compareWith() {
    return this._compareWith;
  }
  set compareWith(fn) {
    if (typeof fn !== "function" && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw getMatSelectNonFunctionValueError();
    }
    this._compareWith = fn;
    if (this._selectionModel) {
      this._initializeSelection();
    }
  }
  get value() {
    return this._value;
  }
  set value(newValue) {
    const hasAssigned = this._assignValue(newValue);
    if (hasAssigned) {
      this._onChange(newValue);
    }
  }
  _value;
  ariaLabel = "";
  ariaLabelledby;
  get errorStateMatcher() {
    return this._errorStateTracker.matcher;
  }
  set errorStateMatcher(value) {
    this._errorStateTracker.matcher = value;
  }
  typeaheadDebounceInterval;
  sortComparator;
  get id() {
    return this._id;
  }
  set id(value) {
    this._id = value || this._uid;
    this.stateChanges.next();
  }
  _id;
  get errorState() {
    return this._errorStateTracker.errorState;
  }
  set errorState(value) {
    this._errorStateTracker.errorState = value;
  }
  panelWidth = this._defaultOptions && typeof this._defaultOptions.panelWidth !== "undefined" ? this._defaultOptions.panelWidth : "auto";
  canSelectNullableOptions = this._defaultOptions?.canSelectNullableOptions ?? false;
  optionSelectionChanges = defer(() => {
    const options = this.options;
    if (options) {
      return options.changes.pipe(startWith(options), switchMap(() => merge(...options.map((option) => option.onSelectionChange))));
    }
    return this._initialized.pipe(switchMap(() => this.optionSelectionChanges));
  });
  openedChange = new EventEmitter();
  _openedStream = this.openedChange.pipe(filter((o) => o), map(() => {
  }));
  _closedStream = this.openedChange.pipe(filter((o) => !o), map(() => {
  }));
  selectionChange = new EventEmitter();
  valueChange = new EventEmitter();
  constructor() {
    const defaultErrorStateMatcher = inject(ErrorStateMatcher);
    const parentForm = inject(NgForm, {
      optional: true
    });
    const parentFormGroup = inject(FormGroupDirective, {
      optional: true
    });
    const tabIndex = inject(new HostAttributeToken("tabindex"), {
      optional: true
    });
    const defaultPopoverConfig = inject(OVERLAY_DEFAULT_CONFIG, {
      optional: true
    });
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    if (this._defaultOptions?.typeaheadDebounceInterval != null) {
      this.typeaheadDebounceInterval = this._defaultOptions.typeaheadDebounceInterval;
    }
    this._errorStateTracker = new _ErrorStateTracker(defaultErrorStateMatcher, this.ngControl, parentFormGroup, parentForm, this.stateChanges);
    this._scrollStrategy = this._scrollStrategyFactory();
    this.tabIndex = tabIndex == null ? 0 : parseInt(tabIndex) || 0;
    this._popoverLocation = defaultPopoverConfig?.usePopover === false ? null : "inline";
    this.id = this.id;
  }
  ngOnInit() {
    this._selectionModel = new SelectionModel(this.multiple);
    this.stateChanges.next();
    this._viewportRuler.change().pipe(takeUntil(this._destroy)).subscribe(() => {
      if (this.panelOpen) {
        this._overlayWidth = this._getOverlayWidth(this._preferredOverlayOrigin);
        this._changeDetectorRef.detectChanges();
      }
    });
  }
  ngAfterContentInit() {
    this._initialized.next();
    this._initialized.complete();
    this._initKeyManager();
    this._selectionModel.changed.pipe(takeUntil(this._destroy)).subscribe((event) => {
      event.added.forEach((option) => option.select());
      event.removed.forEach((option) => option.deselect());
    });
    this.options.changes.pipe(startWith(null), takeUntil(this._destroy)).subscribe(() => {
      this._resetOptions();
      this._initializeSelection();
    });
  }
  ngDoCheck() {
    const newAriaLabelledby = this._getTriggerAriaLabelledby();
    const ngControl = this.ngControl;
    if (newAriaLabelledby !== this._triggerAriaLabelledBy) {
      const element = this._elementRef.nativeElement;
      this._triggerAriaLabelledBy = newAriaLabelledby;
      if (newAriaLabelledby) {
        element.setAttribute("aria-labelledby", newAriaLabelledby);
      } else {
        element.removeAttribute("aria-labelledby");
      }
    }
    if (ngControl) {
      if (this._previousControl !== ngControl.control) {
        if (this._previousControl !== void 0 && ngControl.disabled !== null && ngControl.disabled !== this.disabled) {
          this.disabled = ngControl.disabled;
        }
        this._previousControl = ngControl.control;
      }
      this.updateErrorState();
    }
  }
  ngOnChanges(changes) {
    if (changes["disabled"] || changes["userAriaDescribedBy"]) {
      this.stateChanges.next();
    }
    if (changes["typeaheadDebounceInterval"] && this._keyManager) {
      this._keyManager.withTypeAhead(this.typeaheadDebounceInterval);
    }
    if (changes["panelClass"] && this.panelClass instanceof Set) {
      this.panelClass = Array.from(this.panelClass);
    }
  }
  ngOnDestroy() {
    this._cleanupDetach?.();
    this._keyManager?.destroy();
    this._destroy.next();
    this._destroy.complete();
    this.stateChanges.complete();
    this._clearFromModal();
  }
  toggle() {
    this.panelOpen ? this.close() : this.open();
  }
  open() {
    if (!this._canOpen()) {
      return;
    }
    if (this._parentFormField) {
      this._preferredOverlayOrigin = this._parentFormField.getConnectedOverlayOrigin();
    }
    this._cleanupDetach?.();
    this._overlayWidth = this._getOverlayWidth(this._preferredOverlayOrigin);
    this._applyModalPanelOwnership();
    this._panelOpen = true;
    this._overlayDir.positionChange.pipe(take(1)).subscribe(() => {
      this._changeDetectorRef.detectChanges();
      this._positioningSettled();
    });
    this._overlayDir.attachOverlay();
    this._keyManager.withHorizontalOrientation(null);
    this._highlightCorrectOption();
    this._changeDetectorRef.markForCheck();
    this.stateChanges.next();
    Promise.resolve().then(() => this.openedChange.emit(true));
  }
  _trackedModal = null;
  _applyModalPanelOwnership() {
    const modal = this._elementRef.nativeElement.closest('body > .cdk-overlay-container [aria-modal="true"]');
    if (!modal) {
      return;
    }
    const panelId = `${this.id}-panel`;
    if (this._trackedModal) {
      removeAriaReferencedId(this._trackedModal, "aria-owns", panelId);
    }
    addAriaReferencedId(modal, "aria-owns", panelId);
    this._trackedModal = modal;
  }
  _clearFromModal() {
    if (!this._trackedModal) {
      return;
    }
    const panelId = `${this.id}-panel`;
    removeAriaReferencedId(this._trackedModal, "aria-owns", panelId);
    this._trackedModal = null;
  }
  close() {
    if (this._panelOpen) {
      this._panelOpen = false;
      this._exitAndDetach();
      this._keyManager.withHorizontalOrientation(this._isRtl() ? "rtl" : "ltr");
      this._changeDetectorRef.markForCheck();
      this._onTouched();
      this.stateChanges.next();
      Promise.resolve().then(() => this.openedChange.emit(false));
    }
  }
  _exitAndDetach() {
    if (this._animationsDisabled || !this.panel) {
      this._detachOverlay();
      return;
    }
    this._cleanupDetach?.();
    this._cleanupDetach = () => {
      cleanupEvent();
      clearTimeout(exitFallbackTimer);
      this._cleanupDetach = void 0;
    };
    const panel = this.panel.nativeElement;
    const cleanupEvent = this._renderer.listen(panel, "animationend", (event) => {
      if (event.animationName === "_mat-select-exit") {
        this._cleanupDetach?.();
        this._detachOverlay();
      }
    });
    const exitFallbackTimer = setTimeout(() => {
      this._cleanupDetach?.();
      this._detachOverlay();
    }, 200);
    panel.classList.add("mat-select-panel-exit");
  }
  _detachOverlay() {
    this._overlayDir.detachOverlay();
    this._changeDetectorRef.markForCheck();
  }
  writeValue(value) {
    this._assignValue(value);
  }
  registerOnChange(fn) {
    this._onChange = fn;
  }
  registerOnTouched(fn) {
    this._onTouched = fn;
  }
  setDisabledState(isDisabled) {
    this.disabled = isDisabled;
    this._changeDetectorRef.markForCheck();
    this.stateChanges.next();
  }
  get panelOpen() {
    return this._panelOpen;
  }
  get selected() {
    return this.multiple ? this._selectionModel?.selected || [] : this._selectionModel?.selected[0];
  }
  get triggerValue() {
    if (this.empty) {
      return "";
    }
    if (this._multiple) {
      const selectedOptions = this._selectionModel.selected.map((option) => option.viewValue);
      if (this._isRtl()) {
        selectedOptions.reverse();
      }
      return selectedOptions.join(", ");
    }
    return this._selectionModel.selected[0].viewValue;
  }
  updateErrorState() {
    this._errorStateTracker.updateErrorState();
  }
  _isRtl() {
    return this._dir ? this._dir.value === "rtl" : false;
  }
  _handleKeydown(event) {
    if (!this.disabled) {
      this.panelOpen ? this._handleOpenKeydown(event) : this._handleClosedKeydown(event);
    }
  }
  _handleClosedKeydown(event) {
    const keyCode = event.keyCode;
    const isArrowKey = keyCode === DOWN_ARROW || keyCode === UP_ARROW || keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW;
    const isOpenKey = keyCode === ENTER || keyCode === SPACE;
    const manager = this._keyManager;
    if (!manager.isTyping() && isOpenKey && !hasModifierKey(event) || (this.multiple || event.altKey) && isArrowKey) {
      event.preventDefault();
      this.open();
    } else if (!this.multiple) {
      const previouslySelectedOption = this.selected;
      manager.onKeydown(event);
      const selectedOption = this.selected;
      if (selectedOption && previouslySelectedOption !== selectedOption) {
        this._liveAnnouncer.announce(selectedOption.viewValue, 1e4);
      }
    }
  }
  _handleOpenKeydown(event) {
    const manager = this._keyManager;
    const keyCode = event.keyCode;
    const isArrowKey = keyCode === DOWN_ARROW || keyCode === UP_ARROW;
    const isTyping = manager.isTyping();
    if (isArrowKey && event.altKey) {
      event.preventDefault();
      this.close();
    } else if (!isTyping && (keyCode === ENTER || keyCode === SPACE) && manager.activeItem && !hasModifierKey(event)) {
      event.preventDefault();
      manager.activeItem._selectViaInteraction();
    } else if (!isTyping && this._multiple && keyCode === A && event.ctrlKey) {
      event.preventDefault();
      const hasDeselectedOptions = this.options.some((opt) => !opt.disabled && !opt.selected);
      this.options.forEach((option) => {
        if (!option.disabled) {
          hasDeselectedOptions ? option.select() : option.deselect();
        }
      });
    } else {
      const previouslyFocusedIndex = manager.activeItemIndex;
      manager.onKeydown(event);
      if (this._multiple && isArrowKey && event.shiftKey && manager.activeItem && manager.activeItemIndex !== previouslyFocusedIndex) {
        manager.activeItem._selectViaInteraction();
      }
    }
  }
  _handleOverlayKeydown(event) {
    if (event.keyCode === ESCAPE && !hasModifierKey(event)) {
      event.preventDefault();
      this.close();
    }
  }
  _onFocus() {
    if (!this.disabled) {
      this._focused = true;
      this.stateChanges.next();
    }
  }
  _onBlur() {
    this._focused = false;
    this._keyManager?.cancelTypeahead();
    if (!this.disabled && !this.panelOpen) {
      this._onTouched();
      this._changeDetectorRef.markForCheck();
      this.stateChanges.next();
    }
  }
  get empty() {
    return !this._selectionModel || this._selectionModel.isEmpty();
  }
  _initializeSelection() {
    Promise.resolve().then(() => {
      if (this.ngControl) {
        this._value = this.ngControl.value;
      }
      this._setSelectionByValue(this._value);
      this.stateChanges.next();
    });
  }
  _setSelectionByValue(value) {
    this.options.forEach((option) => option.setInactiveStyles());
    this._selectionModel.clear();
    if (this.multiple && value) {
      if (!Array.isArray(value) && (typeof ngDevMode === "undefined" || ngDevMode)) {
        throw getMatSelectNonArrayValueError();
      }
      value.forEach((currentValue) => this._selectOptionByValue(currentValue));
      this._sortValues();
    } else {
      const correspondingOption = this._selectOptionByValue(value);
      if (correspondingOption) {
        this._keyManager.updateActiveItem(correspondingOption);
      } else if (!this.panelOpen) {
        this._keyManager.updateActiveItem(-1);
      }
    }
    this._changeDetectorRef.markForCheck();
  }
  _selectOptionByValue(value) {
    const correspondingOption = this.options.find((option) => {
      if (this._selectionModel.isSelected(option)) {
        return false;
      }
      try {
        return (option.value != null || this.canSelectNullableOptions) && this._compareWith(option.value, value);
      } catch (error) {
        if (typeof ngDevMode === "undefined" || ngDevMode) {
          console.warn(error);
        }
        return false;
      }
    });
    if (correspondingOption) {
      this._selectionModel.select(correspondingOption);
    }
    return correspondingOption;
  }
  _assignValue(newValue) {
    if (newValue !== this._value || this._multiple && Array.isArray(newValue)) {
      if (this.options) {
        this._setSelectionByValue(newValue);
      }
      this._value = newValue;
      return true;
    }
    return false;
  }
  _skipPredicate = (option) => {
    if (this.panelOpen) {
      return false;
    }
    return option.disabled;
  };
  _getOverlayWidth(preferredOrigin) {
    if (this.panelWidth === "auto") {
      const refToMeasure = preferredOrigin instanceof CdkOverlayOrigin ? preferredOrigin.elementRef : preferredOrigin || this._elementRef;
      return refToMeasure.nativeElement.getBoundingClientRect().width;
    }
    return this.panelWidth === null ? "" : this.panelWidth;
  }
  _syncParentProperties() {
    if (this.options) {
      for (const option of this.options) {
        option._changeDetectorRef.markForCheck();
      }
    }
  }
  _initKeyManager() {
    this._keyManager = new ActiveDescendantKeyManager(this.options).withTypeAhead(this.typeaheadDebounceInterval).withVerticalOrientation().withHorizontalOrientation(this._isRtl() ? "rtl" : "ltr").withHomeAndEnd().withPageUpDown().withAllowedModifierKeys(["shiftKey"]).skipPredicate(this._skipPredicate);
    this._keyManager.tabOut.subscribe(() => {
      if (this.panelOpen) {
        if (!this.multiple && this._keyManager.activeItem) {
          this._keyManager.activeItem._selectViaInteraction();
        }
        this.focus();
        this.close();
      }
    });
    this._keyManager.change.subscribe(() => {
      if (this._panelOpen && this.panel) {
        this._scrollOptionIntoView(this._keyManager.activeItemIndex || 0);
      } else if (!this._panelOpen && !this.multiple && this._keyManager.activeItem) {
        this._keyManager.activeItem._selectViaInteraction();
      }
    });
  }
  _resetOptions() {
    const changedOrDestroyed = merge(this.options.changes, this._destroy);
    this.optionSelectionChanges.pipe(takeUntil(changedOrDestroyed)).subscribe((event) => {
      this._onSelect(event.source, event.isUserInput);
      if (event.isUserInput && !this.multiple && this._panelOpen) {
        this.close();
        this.focus();
      }
    });
    merge(...this.options.map((option) => option._stateChanges)).pipe(takeUntil(changedOrDestroyed)).subscribe(() => {
      this._changeDetectorRef.detectChanges();
      this.stateChanges.next();
    });
  }
  _onSelect(option, isUserInput) {
    const wasSelected = this._selectionModel.isSelected(option);
    if (!this.canSelectNullableOptions && option.value == null && !this._multiple) {
      option.deselect();
      this._selectionModel.clear();
      if (this.value != null) {
        this._propagateChanges(option.value);
      }
    } else {
      if (wasSelected !== option.selected) {
        option.selected ? this._selectionModel.select(option) : this._selectionModel.deselect(option);
      }
      if (isUserInput) {
        this._keyManager.setActiveItem(option);
      }
      if (this.multiple) {
        this._sortValues();
        if (isUserInput) {
          this.focus();
        }
      }
    }
    if (wasSelected !== this._selectionModel.isSelected(option)) {
      this._propagateChanges();
    }
    this.stateChanges.next();
  }
  _sortValues() {
    if (this.multiple) {
      const options = this.options.toArray();
      this._selectionModel.sort((a, b) => {
        return this.sortComparator ? this.sortComparator(a, b, options) : options.indexOf(a) - options.indexOf(b);
      });
      this.stateChanges.next();
    }
  }
  _propagateChanges(fallbackValue) {
    let valueToEmit;
    if (this.multiple) {
      valueToEmit = this.selected.map((option) => option.value);
    } else {
      valueToEmit = this.selected ? this.selected.value : fallbackValue;
    }
    this._value = valueToEmit;
    this.valueChange.emit(valueToEmit);
    this._onChange(valueToEmit);
    this.selectionChange.emit(this._getChangeEvent(valueToEmit));
    this._changeDetectorRef.markForCheck();
  }
  _highlightCorrectOption() {
    if (this._keyManager) {
      if (this.empty) {
        let firstEnabledOptionIndex = -1;
        for (let index = 0; index < this.options.length; index++) {
          const option = this.options.get(index);
          if (!option.disabled) {
            firstEnabledOptionIndex = index;
            break;
          }
        }
        this._keyManager.setActiveItem(firstEnabledOptionIndex);
      } else {
        this._keyManager.setActiveItem(this._selectionModel.selected[0]);
      }
    }
  }
  _canOpen() {
    return !this._panelOpen && !this.disabled && this.options?.length > 0 && !!this._overlayDir;
  }
  focus(options) {
    this._elementRef.nativeElement.focus(options);
  }
  _getPanelAriaLabelledby() {
    if (this.ariaLabel) {
      return null;
    }
    const labelId = this._parentFormField?.getLabelId() || null;
    const labelExpression = labelId ? labelId + " " : "";
    return this.ariaLabelledby ? labelExpression + this.ariaLabelledby : labelId;
  }
  _getAriaActiveDescendant() {
    if (this.panelOpen && this._keyManager && this._keyManager.activeItem) {
      return this._keyManager.activeItem.id;
    }
    return null;
  }
  _getTriggerAriaLabelledby() {
    if (this.ariaLabel) {
      return null;
    }
    let value = this._parentFormField?.getLabelId() || "";
    if (this.ariaLabelledby) {
      value += " " + this.ariaLabelledby;
    }
    if (!value) {
      value = this._valueId;
    }
    return value;
  }
  get describedByIds() {
    const element = this._elementRef.nativeElement;
    const existingDescribedBy = element.getAttribute("aria-describedby");
    return existingDescribedBy?.split(" ") || [];
  }
  setDescribedByIds(ids) {
    const element = this._elementRef.nativeElement;
    if (ids.length) {
      element.setAttribute("aria-describedby", ids.join(" "));
    } else {
      element.removeAttribute("aria-describedby");
    }
  }
  onContainerClick(event) {
    const target = _getEventTarget(event);
    if (target && (target.tagName === "MAT-OPTION" || target.classList.contains("cdk-overlay-backdrop") || target.closest(".mat-mdc-select-panel"))) {
      return;
    }
    this.focus();
    this.open();
  }
  get shouldLabelFloat() {
    return this.panelOpen || !this.empty || this.focused && !!this.placeholder;
  }
  static \u0275fac = function MatSelect_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatSelect)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatSelect,
    selectors: [["mat-select"]],
    contentQueries: function MatSelect_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        \u0275\u0275contentQuery(dirIndex, MAT_SELECT_TRIGGER, 5)(dirIndex, MatOption, 5)(dirIndex, MAT_OPTGROUP, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.customTrigger = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.options = _t);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.optionGroups = _t);
      }
    },
    viewQuery: function MatSelect_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c0, 5)(_c1, 5)(CdkConnectedOverlay, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.trigger = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.panel = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._overlayDir = _t.first);
      }
    },
    hostAttrs: ["role", "combobox", "aria-haspopup", "listbox", 1, "mat-mdc-select"],
    hostVars: 21,
    hostBindings: function MatSelect_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("keydown", function MatSelect_keydown_HostBindingHandler($event) {
          return ctx._handleKeydown($event);
        })("focus", function MatSelect_focus_HostBindingHandler() {
          return ctx._onFocus();
        })("blur", function MatSelect_blur_HostBindingHandler() {
          return ctx._onBlur();
        });
      }
      if (rf & 2) {
        \u0275\u0275attribute("id", ctx.id)("tabindex", ctx.disabled ? -1 : ctx.tabIndex)("aria-controls", ctx.panelOpen ? ctx.id + "-panel" : null)("aria-expanded", ctx.panelOpen)("aria-label", ctx.ariaLabel || null)("aria-required", ctx.required.toString())("aria-disabled", ctx.disabled.toString())("aria-invalid", ctx.errorState)("aria-activedescendant", ctx._getAriaActiveDescendant());
        \u0275\u0275classProp("mat-mdc-select-disabled", ctx.disabled)("mat-mdc-select-invalid", ctx.errorState)("mat-mdc-select-required", ctx.required)("mat-mdc-select-empty", ctx.empty)("mat-mdc-select-multiple", ctx.multiple)("mat-select-open", ctx.panelOpen);
      }
    },
    inputs: {
      userAriaDescribedBy: [0, "aria-describedby", "userAriaDescribedBy"],
      panelClass: "panelClass",
      disabled: [2, "disabled", "disabled", booleanAttribute],
      disableRipple: [2, "disableRipple", "disableRipple", booleanAttribute],
      tabIndex: [2, "tabIndex", "tabIndex", (value) => value == null ? 0 : numberAttribute(value)],
      hideSingleSelectionIndicator: [2, "hideSingleSelectionIndicator", "hideSingleSelectionIndicator", booleanAttribute],
      placeholder: "placeholder",
      required: [2, "required", "required", booleanAttribute],
      multiple: [2, "multiple", "multiple", booleanAttribute],
      disableOptionCentering: [2, "disableOptionCentering", "disableOptionCentering", booleanAttribute],
      compareWith: "compareWith",
      value: "value",
      ariaLabel: [0, "aria-label", "ariaLabel"],
      ariaLabelledby: [0, "aria-labelledby", "ariaLabelledby"],
      errorStateMatcher: "errorStateMatcher",
      typeaheadDebounceInterval: [2, "typeaheadDebounceInterval", "typeaheadDebounceInterval", numberAttribute],
      sortComparator: "sortComparator",
      id: "id",
      panelWidth: "panelWidth",
      canSelectNullableOptions: [2, "canSelectNullableOptions", "canSelectNullableOptions", booleanAttribute]
    },
    outputs: {
      openedChange: "openedChange",
      _openedStream: "opened",
      _closedStream: "closed",
      selectionChange: "selectionChange",
      valueChange: "valueChange"
    },
    exportAs: ["matSelect"],
    features: [\u0275\u0275ProvidersFeature([{
      provide: MatFormFieldControl,
      useExisting: _MatSelect
    }, {
      provide: MAT_OPTION_PARENT_COMPONENT,
      useExisting: _MatSelect
    }]), \u0275\u0275NgOnChangesFeature],
    ngContentSelectors: _c3,
    decls: 11,
    vars: 10,
    consts: [["fallbackOverlayOrigin", "cdkOverlayOrigin", "trigger", ""], ["panel", ""], ["cdk-overlay-origin", "", 1, "mat-mdc-select-trigger", 3, "click"], [1, "mat-mdc-select-value"], [1, "mat-mdc-select-placeholder", "mat-mdc-select-min-line"], [1, "mat-mdc-select-value-text"], [1, "mat-mdc-select-arrow-wrapper"], [1, "mat-mdc-select-arrow"], ["viewBox", "0 0 24 24", "width", "24px", "height", "24px", "focusable", "false", "aria-hidden", "true"], ["d", "M7 10l5 5 5-5z"], ["cdk-connected-overlay", "", "cdkConnectedOverlayHasBackdrop", "", "cdkConnectedOverlayBackdropClass", "cdk-overlay-transparent-backdrop", 3, "detach", "backdropClick", "overlayKeydown", "cdkConnectedOverlayDisableClose", "cdkConnectedOverlayPanelClass", "cdkConnectedOverlayScrollStrategy", "cdkConnectedOverlayOrigin", "cdkConnectedOverlayPositions", "cdkConnectedOverlayWidth", "cdkConnectedOverlayFlexibleDimensions", "cdkConnectedOverlayUsePopover"], [1, "mat-mdc-select-min-line"], ["role", "listbox", "tabindex", "-1", 1, "mat-mdc-select-panel", "mdc-menu-surface", "mdc-menu-surface--open", 3, "keydown"]],
    template: function MatSelect_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef(_c2);
        \u0275\u0275elementStart(0, "div", 2, 0);
        \u0275\u0275listener("click", function MatSelect_Template_div_click_0_listener() {
          return ctx.open();
        });
        \u0275\u0275elementStart(3, "div", 3);
        \u0275\u0275conditionalCreate(4, MatSelect_Conditional_4_Template, 2, 1, "span", 4)(5, MatSelect_Conditional_5_Template, 3, 1, "span", 5);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "div", 6)(7, "div", 7);
        \u0275\u0275namespaceSVG();
        \u0275\u0275elementStart(8, "svg", 8);
        \u0275\u0275element(9, "path", 9);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275template(10, MatSelect_ng_template_10_Template, 3, 16, "ng-template", 10);
        \u0275\u0275listener("detach", function MatSelect_Template_ng_template_detach_10_listener() {
          return ctx.close();
        })("backdropClick", function MatSelect_Template_ng_template_backdropClick_10_listener() {
          return ctx.close();
        })("overlayKeydown", function MatSelect_Template_ng_template_overlayKeydown_10_listener($event) {
          return ctx._handleOverlayKeydown($event);
        });
      }
      if (rf & 2) {
        const fallbackOverlayOrigin_r3 = \u0275\u0275reference(1);
        \u0275\u0275advance(3);
        \u0275\u0275attribute("id", ctx._valueId);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.empty ? 4 : 5);
        \u0275\u0275advance(6);
        \u0275\u0275property("cdkConnectedOverlayDisableClose", true)("cdkConnectedOverlayPanelClass", ctx._overlayPanelClass)("cdkConnectedOverlayScrollStrategy", ctx._scrollStrategy)("cdkConnectedOverlayOrigin", ctx._preferredOverlayOrigin || fallbackOverlayOrigin_r3)("cdkConnectedOverlayPositions", ctx._positions)("cdkConnectedOverlayWidth", ctx._overlayWidth)("cdkConnectedOverlayFlexibleDimensions", true)("cdkConnectedOverlayUsePopover", ctx._popoverLocation);
      }
    },
    dependencies: [CdkOverlayOrigin, CdkConnectedOverlay],
    styles: ['@keyframes _mat-select-enter {\n  from {\n    opacity: 0;\n    transform: scaleY(0.8);\n  }\n  to {\n    opacity: 1;\n    transform: none;\n  }\n}\n@keyframes _mat-select-exit {\n  from {\n    opacity: 1;\n  }\n  to {\n    opacity: 0;\n  }\n}\n.mat-mdc-select {\n  display: inline-block;\n  width: 100%;\n  outline: none;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  color: var(--mat-select-enabled-trigger-text-color, var(--mat-sys-on-surface));\n  font-family: var(--mat-select-trigger-text-font, var(--mat-sys-body-large-font));\n  line-height: var(--mat-select-trigger-text-line-height, var(--mat-sys-body-large-line-height));\n  font-size: var(--mat-select-trigger-text-size, var(--mat-sys-body-large-size));\n  font-weight: var(--mat-select-trigger-text-weight, var(--mat-sys-body-large-weight));\n  letter-spacing: var(--mat-select-trigger-text-tracking, var(--mat-sys-body-large-tracking));\n}\n\ndiv.mat-mdc-select-panel {\n  box-shadow: var(--mat-select-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));\n}\n\n.mat-mdc-select-disabled {\n  color: var(--mat-select-disabled-trigger-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mat-mdc-select-disabled .mat-mdc-select-placeholder {\n  color: var(--mat-select-disabled-trigger-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n\n.mat-mdc-select-trigger {\n  display: inline-flex;\n  align-items: center;\n  cursor: pointer;\n  position: relative;\n  box-sizing: border-box;\n  width: 100%;\n}\n.mat-mdc-select-disabled .mat-mdc-select-trigger {\n  -webkit-user-select: none;\n  user-select: none;\n  cursor: default;\n}\n\n.mat-mdc-select-value {\n  width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.mat-mdc-select-value-text {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.mat-mdc-select-arrow-wrapper {\n  height: 24px;\n  flex-shrink: 0;\n  display: inline-flex;\n  align-items: center;\n}\n.mat-form-field-appearance-fill .mdc-text-field--no-label .mat-mdc-select-arrow-wrapper {\n  transform: none;\n}\n\n.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-invalid .mat-mdc-select-arrow,\n.mat-form-field-invalid:not(.mat-form-field-disabled) .mat-mdc-form-field-infix::after {\n  color: var(--mat-select-invalid-arrow-color, var(--mat-sys-error));\n}\n\n.mat-mdc-select-arrow {\n  width: 10px;\n  height: 5px;\n  position: relative;\n  color: var(--mat-select-enabled-arrow-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-form-field.mat-focused .mat-mdc-select-arrow {\n  color: var(--mat-select-focused-arrow-color, var(--mat-sys-primary));\n}\n.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-disabled .mat-mdc-select-arrow {\n  color: var(--mat-select-disabled-arrow-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mat-select-open .mat-mdc-select-arrow {\n  transform: rotate(180deg);\n}\n.mat-form-field-animations-enabled .mat-mdc-select-arrow {\n  transition: transform 80ms linear;\n}\n.mat-mdc-select-arrow svg {\n  fill: currentColor;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n@media (forced-colors: active) {\n  .mat-mdc-select-arrow svg {\n    fill: CanvasText;\n  }\n  .mat-mdc-select-disabled .mat-mdc-select-arrow svg {\n    fill: GrayText;\n  }\n}\n\ndiv.mat-mdc-select-panel {\n  width: 100%;\n  max-height: 275px;\n  outline: 0;\n  overflow: auto;\n  padding: 8px 0;\n  box-sizing: border-box;\n  transform-origin: top center;\n  border-radius: 0 0 4px 4px;\n  position: relative;\n  background-color: var(--mat-select-panel-background-color, var(--mat-sys-surface-container));\n}\n.mat-mdc-select-panel-above div.mat-mdc-select-panel {\n  border-radius: 4px 4px 0 0;\n  transform-origin: bottom center;\n}\n@media (forced-colors: active) {\n  div.mat-mdc-select-panel {\n    outline: solid 1px;\n  }\n}\n\n.mat-select-panel-animations-enabled {\n  animation: _mat-select-enter 120ms cubic-bezier(0, 0, 0.2, 1);\n}\n.mat-select-panel-animations-enabled.mat-select-panel-exit {\n  animation: _mat-select-exit 100ms linear;\n}\n\n.mat-mdc-select-placeholder {\n  transition: color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1);\n  color: var(--mat-select-placeholder-text-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-form-field:not(.mat-form-field-animations-enabled) .mat-mdc-select-placeholder, ._mat-animation-noopable .mat-mdc-select-placeholder {\n  transition: none;\n}\n.mat-form-field-hide-placeholder .mat-mdc-select-placeholder {\n  color: transparent;\n  -webkit-text-fill-color: transparent;\n  transition: none;\n  display: block;\n}\n\n.mat-mdc-form-field-type-mat-select:not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper {\n  cursor: pointer;\n}\n.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mat-mdc-floating-label {\n  max-width: calc(100% - 18px);\n}\n.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mdc-floating-label--float-above {\n  max-width: calc(100% / 0.75 - 24px);\n}\n.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-notched-outline__notch {\n  max-width: calc(100% - 60px);\n}\n.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-text-field--label-floating .mdc-notched-outline__notch {\n  max-width: calc(100% - 24px);\n}\n\n.mat-mdc-select-min-line:empty::before {\n  content: " ";\n  white-space: pre;\n  width: 1px;\n  display: inline-block;\n  visibility: hidden;\n}\n\n.mat-form-field-appearance-fill .mat-mdc-select-arrow-wrapper {\n  transform: var(--mat-select-arrow-transform, translateY(-8px));\n}\n'],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatSelect, [{
    type: Component,
    args: [{
      selector: "mat-select",
      exportAs: "matSelect",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        "role": "combobox",
        "aria-haspopup": "listbox",
        "class": "mat-mdc-select",
        "[attr.id]": "id",
        "[attr.tabindex]": "disabled ? -1 : tabIndex",
        "[attr.aria-controls]": 'panelOpen ? id + "-panel" : null',
        "[attr.aria-expanded]": "panelOpen",
        "[attr.aria-label]": "ariaLabel || null",
        "[attr.aria-required]": "required.toString()",
        "[attr.aria-disabled]": "disabled.toString()",
        "[attr.aria-invalid]": "errorState",
        "[attr.aria-activedescendant]": "_getAriaActiveDescendant()",
        "[class.mat-mdc-select-disabled]": "disabled",
        "[class.mat-mdc-select-invalid]": "errorState",
        "[class.mat-mdc-select-required]": "required",
        "[class.mat-mdc-select-empty]": "empty",
        "[class.mat-mdc-select-multiple]": "multiple",
        "[class.mat-select-open]": "panelOpen",
        "(keydown)": "_handleKeydown($event)",
        "(focus)": "_onFocus()",
        "(blur)": "_onBlur()"
      },
      providers: [{
        provide: MatFormFieldControl,
        useExisting: MatSelect
      }, {
        provide: MAT_OPTION_PARENT_COMPONENT,
        useExisting: MatSelect
      }],
      imports: [CdkOverlayOrigin, CdkConnectedOverlay],
      template: `<div
  cdk-overlay-origin
  class="mat-mdc-select-trigger"
  (click)="open()"
  #fallbackOverlayOrigin="cdkOverlayOrigin"
  #trigger
>
  <div class="mat-mdc-select-value" [attr.id]="_valueId">
    @if (empty) {
      <span class="mat-mdc-select-placeholder mat-mdc-select-min-line">{{placeholder}}</span>
    } @else {
      <span class="mat-mdc-select-value-text">
        @if (customTrigger) {
          <ng-content select="mat-select-trigger"></ng-content>
        } @else {
          <span class="mat-mdc-select-min-line">{{triggerValue}}</span>
        }
      </span>
    }
  </div>

  <div class="mat-mdc-select-arrow-wrapper">
    <div class="mat-mdc-select-arrow">
      <!-- Use an inline SVG, because it works better than a CSS triangle in high contrast mode. -->
      <svg viewBox="0 0 24 24" width="24px" height="24px" focusable="false" aria-hidden="true">
        <path d="M7 10l5 5 5-5z" />
      </svg>
    </div>
  </div>
</div>

<ng-template
  cdk-connected-overlay
  cdkConnectedOverlayHasBackdrop
  cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
  [cdkConnectedOverlayDisableClose]="true"
  [cdkConnectedOverlayPanelClass]="_overlayPanelClass"
  [cdkConnectedOverlayScrollStrategy]="_scrollStrategy"
  [cdkConnectedOverlayOrigin]="_preferredOverlayOrigin || fallbackOverlayOrigin"
  [cdkConnectedOverlayPositions]="_positions"
  [cdkConnectedOverlayWidth]="_overlayWidth"
  [cdkConnectedOverlayFlexibleDimensions]="true"
  [cdkConnectedOverlayUsePopover]="_popoverLocation"
  (detach)="close()"
  (backdropClick)="close()"
  (overlayKeydown)="_handleOverlayKeydown($event)">
  <!-- \`mat-undefined\` is weird, but we were using it internally -->
  <div
    #panel
    role="listbox"
    tabindex="-1"
    class="mat-mdc-select-panel mdc-menu-surface mdc-menu-surface--open"
    [class]="panelClass"
    [class.mat-select-panel-animations-enabled]="!_animationsDisabled"
    [class.mat-primary]="_parentFormField?.color === 'primary'"
    [class.mat-accent]="_parentFormField?.color === 'accent'"
    [class.mat-warn]="_parentFormField?.color === 'warn'"
    [class.mat-undefined]="!_parentFormField?.color"
    [attr.id]="id + '-panel'"
    [attr.aria-multiselectable]="multiple"
    [attr.aria-label]="ariaLabel || null"
    [attr.aria-labelledby]="_getPanelAriaLabelledby()"
    (keydown)="_handleKeydown($event)">
    <ng-content></ng-content>
  </div>
</ng-template>
`,
      styles: ['@keyframes _mat-select-enter {\n  from {\n    opacity: 0;\n    transform: scaleY(0.8);\n  }\n  to {\n    opacity: 1;\n    transform: none;\n  }\n}\n@keyframes _mat-select-exit {\n  from {\n    opacity: 1;\n  }\n  to {\n    opacity: 0;\n  }\n}\n.mat-mdc-select {\n  display: inline-block;\n  width: 100%;\n  outline: none;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  color: var(--mat-select-enabled-trigger-text-color, var(--mat-sys-on-surface));\n  font-family: var(--mat-select-trigger-text-font, var(--mat-sys-body-large-font));\n  line-height: var(--mat-select-trigger-text-line-height, var(--mat-sys-body-large-line-height));\n  font-size: var(--mat-select-trigger-text-size, var(--mat-sys-body-large-size));\n  font-weight: var(--mat-select-trigger-text-weight, var(--mat-sys-body-large-weight));\n  letter-spacing: var(--mat-select-trigger-text-tracking, var(--mat-sys-body-large-tracking));\n}\n\ndiv.mat-mdc-select-panel {\n  box-shadow: var(--mat-select-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));\n}\n\n.mat-mdc-select-disabled {\n  color: var(--mat-select-disabled-trigger-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mat-mdc-select-disabled .mat-mdc-select-placeholder {\n  color: var(--mat-select-disabled-trigger-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n\n.mat-mdc-select-trigger {\n  display: inline-flex;\n  align-items: center;\n  cursor: pointer;\n  position: relative;\n  box-sizing: border-box;\n  width: 100%;\n}\n.mat-mdc-select-disabled .mat-mdc-select-trigger {\n  -webkit-user-select: none;\n  user-select: none;\n  cursor: default;\n}\n\n.mat-mdc-select-value {\n  width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.mat-mdc-select-value-text {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.mat-mdc-select-arrow-wrapper {\n  height: 24px;\n  flex-shrink: 0;\n  display: inline-flex;\n  align-items: center;\n}\n.mat-form-field-appearance-fill .mdc-text-field--no-label .mat-mdc-select-arrow-wrapper {\n  transform: none;\n}\n\n.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-invalid .mat-mdc-select-arrow,\n.mat-form-field-invalid:not(.mat-form-field-disabled) .mat-mdc-form-field-infix::after {\n  color: var(--mat-select-invalid-arrow-color, var(--mat-sys-error));\n}\n\n.mat-mdc-select-arrow {\n  width: 10px;\n  height: 5px;\n  position: relative;\n  color: var(--mat-select-enabled-arrow-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-form-field.mat-focused .mat-mdc-select-arrow {\n  color: var(--mat-select-focused-arrow-color, var(--mat-sys-primary));\n}\n.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-disabled .mat-mdc-select-arrow {\n  color: var(--mat-select-disabled-arrow-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mat-select-open .mat-mdc-select-arrow {\n  transform: rotate(180deg);\n}\n.mat-form-field-animations-enabled .mat-mdc-select-arrow {\n  transition: transform 80ms linear;\n}\n.mat-mdc-select-arrow svg {\n  fill: currentColor;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n@media (forced-colors: active) {\n  .mat-mdc-select-arrow svg {\n    fill: CanvasText;\n  }\n  .mat-mdc-select-disabled .mat-mdc-select-arrow svg {\n    fill: GrayText;\n  }\n}\n\ndiv.mat-mdc-select-panel {\n  width: 100%;\n  max-height: 275px;\n  outline: 0;\n  overflow: auto;\n  padding: 8px 0;\n  box-sizing: border-box;\n  transform-origin: top center;\n  border-radius: 0 0 4px 4px;\n  position: relative;\n  background-color: var(--mat-select-panel-background-color, var(--mat-sys-surface-container));\n}\n.mat-mdc-select-panel-above div.mat-mdc-select-panel {\n  border-radius: 4px 4px 0 0;\n  transform-origin: bottom center;\n}\n@media (forced-colors: active) {\n  div.mat-mdc-select-panel {\n    outline: solid 1px;\n  }\n}\n\n.mat-select-panel-animations-enabled {\n  animation: _mat-select-enter 120ms cubic-bezier(0, 0, 0.2, 1);\n}\n.mat-select-panel-animations-enabled.mat-select-panel-exit {\n  animation: _mat-select-exit 100ms linear;\n}\n\n.mat-mdc-select-placeholder {\n  transition: color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1);\n  color: var(--mat-select-placeholder-text-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-form-field:not(.mat-form-field-animations-enabled) .mat-mdc-select-placeholder, ._mat-animation-noopable .mat-mdc-select-placeholder {\n  transition: none;\n}\n.mat-form-field-hide-placeholder .mat-mdc-select-placeholder {\n  color: transparent;\n  -webkit-text-fill-color: transparent;\n  transition: none;\n  display: block;\n}\n\n.mat-mdc-form-field-type-mat-select:not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper {\n  cursor: pointer;\n}\n.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mat-mdc-floating-label {\n  max-width: calc(100% - 18px);\n}\n.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mdc-floating-label--float-above {\n  max-width: calc(100% / 0.75 - 24px);\n}\n.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-notched-outline__notch {\n  max-width: calc(100% - 60px);\n}\n.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-text-field--label-floating .mdc-notched-outline__notch {\n  max-width: calc(100% - 24px);\n}\n\n.mat-mdc-select-min-line:empty::before {\n  content: " ";\n  white-space: pre;\n  width: 1px;\n  display: inline-block;\n  visibility: hidden;\n}\n\n.mat-form-field-appearance-fill .mat-mdc-select-arrow-wrapper {\n  transform: var(--mat-select-arrow-transform, translateY(-8px));\n}\n']
    }]
  }], () => [], {
    options: [{
      type: ContentChildren,
      args: [MatOption, {
        descendants: true
      }]
    }],
    optionGroups: [{
      type: ContentChildren,
      args: [MAT_OPTGROUP, {
        descendants: true
      }]
    }],
    customTrigger: [{
      type: ContentChild,
      args: [MAT_SELECT_TRIGGER]
    }],
    userAriaDescribedBy: [{
      type: Input,
      args: ["aria-describedby"]
    }],
    trigger: [{
      type: ViewChild,
      args: ["trigger"]
    }],
    panel: [{
      type: ViewChild,
      args: ["panel"]
    }],
    _overlayDir: [{
      type: ViewChild,
      args: [CdkConnectedOverlay]
    }],
    panelClass: [{
      type: Input
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    disableRipple: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    tabIndex: [{
      type: Input,
      args: [{
        transform: (value) => value == null ? 0 : numberAttribute(value)
      }]
    }],
    hideSingleSelectionIndicator: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    placeholder: [{
      type: Input
    }],
    required: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    multiple: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    disableOptionCentering: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    compareWith: [{
      type: Input
    }],
    value: [{
      type: Input
    }],
    ariaLabel: [{
      type: Input,
      args: ["aria-label"]
    }],
    ariaLabelledby: [{
      type: Input,
      args: ["aria-labelledby"]
    }],
    errorStateMatcher: [{
      type: Input
    }],
    typeaheadDebounceInterval: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    sortComparator: [{
      type: Input
    }],
    id: [{
      type: Input
    }],
    panelWidth: [{
      type: Input
    }],
    canSelectNullableOptions: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    openedChange: [{
      type: Output
    }],
    _openedStream: [{
      type: Output,
      args: ["opened"]
    }],
    _closedStream: [{
      type: Output,
      args: ["closed"]
    }],
    selectionChange: [{
      type: Output
    }],
    valueChange: [{
      type: Output
    }]
  });
})();
var MatSelectTrigger = class _MatSelectTrigger {
  static \u0275fac = function MatSelectTrigger_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatSelectTrigger)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatSelectTrigger,
    selectors: [["mat-select-trigger"]],
    features: [\u0275\u0275ProvidersFeature([{
      provide: MAT_SELECT_TRIGGER,
      useExisting: _MatSelectTrigger
    }])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatSelectTrigger, [{
    type: Directive,
    args: [{
      selector: "mat-select-trigger",
      providers: [{
        provide: MAT_SELECT_TRIGGER,
        useExisting: MatSelectTrigger
      }]
    }]
  }], null, null);
})();
var MatSelectModule = class _MatSelectModule {
  static \u0275fac = function MatSelectModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatSelectModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _MatSelectModule,
    imports: [OverlayModule, MatOptionModule, MatSelect, MatSelectTrigger],
    exports: [BidiModule, CdkScrollableModule, MatFormFieldModule, MatSelect, MatSelectTrigger, MatOptionModule]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [OverlayModule, MatOptionModule, BidiModule, CdkScrollableModule, MatFormFieldModule, MatOptionModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatSelectModule, [{
    type: NgModule,
    args: [{
      imports: [OverlayModule, MatOptionModule, MatSelect, MatSelectTrigger],
      exports: [BidiModule, CdkScrollableModule, MatFormFieldModule, MatSelect, MatSelectTrigger, MatOptionModule]
    }]
  }], null, null);
})();

// src/app/shared/ui/components/core/form/inputs/pricing-editor/pricing-slot-panel/pricing-slot-panel.component.ts
function PricingSlotPanelComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 6);
    \u0275\u0275listener("click", function PricingSlotPanelComponent_Conditional_7_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleEnabled());
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("is-on", ctx_r1.enabled)("is-off", !ctx_r1.enabled);
    \u0275\u0275property("disabled", ctx_r1.readOnly);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.enabled ? "toggle_on" : "toggle_off");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 7, ctx_r1.enabled ? "on" : "off"));
  }
}
function PricingSlotPanelComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "mat-icon");
    \u0275\u0275text(2, "schedule");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "Add slots to unlock slot-specific pricing.");
    \u0275\u0275elementEnd()();
  }
}
function PricingSlotPanelComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5)(1, "mat-icon");
    \u0275\u0275text(2, "grid_view");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "Global pricing will apply to every slot until overrides are enabled.");
    \u0275\u0275elementEnd()();
  }
}
function PricingSlotPanelComponent_Conditional_10_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 8)(1, "div", 10)(2, "span", 11);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 12);
    \u0275\u0275listener("click", function PricingSlotPanelComponent_Conditional_10_For_2_Template_button_click_4_listener() {
      const $index_r5 = \u0275\u0275restoreView(_r4).$index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.removeOverride($index_r5));
    });
    \u0275\u0275elementStart(5, "mat-icon");
    \u0275\u0275text(6, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(7, "div", 13)(8, "label", 14)(9, "span");
    \u0275\u0275text(10, "Slot");
    \u0275\u0275elementEnd();
    \u0275\u0275element(11, "app-menu-trigger", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "label", 14)(13, "span");
    \u0275\u0275text(14, "Price");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 16)(16, "span", 17);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "input", 18);
    \u0275\u0275listener("ngModelChange", function PricingSlotPanelComponent_Conditional_10_For_2_Template_input_ngModelChange_18_listener($event) {
      const $index_r5 = \u0275\u0275restoreView(_r4).$index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onPriceChange($index_r5, $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span", 19);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(21, "p", 20);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const override_r6 = ctx.$implicit;
    const $index_r5 = ctx.$index;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(override_r6.label || "Slot " + ($index_r5 + 1));
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.readOnly);
    \u0275\u0275advance(7);
    \u0275\u0275property("menuId", ctx_r1.slotMenuId(override_r6))("trigger", ctx_r1.slotMenuTrigger(override_r6))("items", ctx_r1.slotMenuItems(override_r6, $index_r5));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.currencySymbol(ctx_r1.currency));
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", override_r6.price ?? "")("disabled", ctx_r1.readOnly);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.currency);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.slotWindowLabel(override_r6));
  }
}
function PricingSlotPanelComponent_Conditional_10_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "mat-icon");
    \u0275\u0275text(2, "event_available");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "No slot overrides yet. Add the first one below.");
    \u0275\u0275elementEnd()();
  }
}
function PricingSlotPanelComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275repeaterCreate(1, PricingSlotPanelComponent_Conditional_10_For_2_Template, 23, 10, "article", 8, \u0275\u0275componentInstance().trackByOverride, true);
    \u0275\u0275conditionalCreate(3, PricingSlotPanelComponent_Conditional_10_Conditional_3_Template, 5, 0, "div", 4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 9);
    \u0275\u0275listener("click", function PricingSlotPanelComponent_Conditional_10_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.addOverride());
    });
    \u0275\u0275elementStart(5, "mat-icon");
    \u0275\u0275text(6, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.workingOverrides);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.workingOverrides.length === 0 ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.readOnly || !ctx_r1.hasRemainingSlots());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.hasRemainingSlots() ? "Add Slot Price Override" : "All Slots Already Customized");
  }
}
var PricingSlotPanelComponent = class _PricingSlotPanelComponent {
  cdr;
  enabled = false;
  enabledChange = new EventEmitter();
  overrides = [];
  overridesChange = new EventEmitter();
  slotCatalog = [];
  currency = "USD";
  readOnly = false;
  title = "pricing.slot.customize.title";
  description = "pricing.slot.customize.subtitle";
  workingOverrides = [];
  constructor(cdr) {
    this.cdr = cdr;
  }
  ngOnChanges(changes) {
    if (changes["overrides"] || changes["slotCatalog"] || changes["currency"]) {
      this.syncWorkingOverrides();
      this.cdr.markForCheck();
    }
  }
  toggleEnabled() {
    if (this.readOnly) {
      return;
    }
    const nextValue = !this.enabled;
    this.enabled = nextValue;
    this.enabledChange.emit(nextValue);
    if (nextValue && this.workingOverrides.length === 0) {
      this.addOverride();
    }
  }
  addOverride() {
    if (this.readOnly) {
      return;
    }
    const availableSlot = this.remainingSlots()[0] ?? null;
    if (!availableSlot) {
      return;
    }
    this.workingOverrides = [
      ...this.workingOverrides,
      PricingBuilder.slotOverrideFromReference(availableSlot, null, this.currency)
    ];
    this.emitOverrides();
  }
  removeOverride(index) {
    if (this.readOnly || index < 0 || index >= this.workingOverrides.length) {
      return;
    }
    this.workingOverrides = this.workingOverrides.filter((_, itemIndex) => itemIndex !== index);
    this.emitOverrides();
  }
  onSlotIdChange(index, slotId) {
    if (this.readOnly) {
      return;
    }
    const normalizedSlotId = `${slotId ?? ""}`.trim();
    const slot = this.slotCatalog.find((item) => item.id === normalizedSlotId) ?? null;
    if (!slot || index < 0 || index >= this.workingOverrides.length) {
      return;
    }
    this.workingOverrides = this.workingOverrides.map((override, itemIndex) => itemIndex === index ? __spreadProps(__spreadValues({}, override), {
      id: `slot-override-${slot.id}`,
      slotId: slot.id,
      label: slot.label,
      startAt: slot.startAt ?? null,
      endAt: slot.endAt ?? null,
      currency: this.currency
    }) : override);
    this.emitOverrides();
  }
  slotMenuId(override) {
    return `pricing-slot-override-${override.id}`;
  }
  slotMenuTrigger(override) {
    return {
      id: this.slotMenuId(override),
      label: override.label || "pricing.slot.select",
      icon: "calendar_month",
      trailingIcon: "expand_more",
      openTrailingIcon: "expand_less",
      palette: "blue",
      layout: "field",
      disabled: this.readOnly
    };
  }
  slotMenuItems(override, overrideIndex) {
    return this.availableSlotsFor(override).map((slot) => ({
      id: `${this.slotMenuId(override)}-${slot.id}`,
      label: slot.label,
      description: this.slotReferenceWindowLabel(slot),
      icon: "event",
      kind: "radio",
      palette: "blue",
      surface: "tinted",
      checked: slot.id === override.slotId,
      context: {
        select: () => this.onSlotIdChange(overrideIndex, slot.id)
      }
    }));
  }
  onPriceChange(index, value) {
    if (this.readOnly || index < 0 || index >= this.workingOverrides.length) {
      return;
    }
    this.workingOverrides = this.workingOverrides.map((override, itemIndex) => itemIndex === index ? __spreadProps(__spreadValues({}, override), {
      currency: this.currency,
      price: this.parseNullableMoney(value)
    }) : override);
    this.emitOverrides();
  }
  availableSlotsFor(override) {
    const selectedSlotIds = new Set(this.workingOverrides.map((item) => item.slotId?.trim() || "").filter((slotId) => slotId.length > 0));
    if (override.slotId?.trim()) {
      selectedSlotIds.delete(override.slotId.trim());
    }
    return this.slotCatalog.filter((slot) => !selectedSlotIds.has(slot.id));
  }
  hasRemainingSlots() {
    return this.remainingSlots().length > 0;
  }
  trackByOverride(_, override) {
    return override.id;
  }
  slotWindowLabel(override) {
    const start = this.formatDateTime(override.startAt);
    const end = this.formatDateTime(override.endAt);
    if (!start && !end) {
      return "pricing.slot.time.window.follows";
    }
    if (!start) {
      return `Ends ${end}`;
    }
    if (!end) {
      return `Starts ${start}`;
    }
    return `${start} - ${end}`;
  }
  slotReferenceWindowLabel(slot) {
    const start = this.formatDateTime(slot.startAt);
    const end = this.formatDateTime(slot.endAt);
    if (!start && !end) {
      return "pricing.slot.time.follows";
    }
    if (!start) {
      return `Ends ${end}`;
    }
    if (!end) {
      return `Starts ${start}`;
    }
    return `${start} - ${end}`;
  }
  currencySymbol(currency) {
    switch (`${currency ?? ""}`.trim().toUpperCase()) {
      case "EUR":
        return "EUR";
      case "GBP":
        return "GBP";
      case "CZK":
        return "CZK";
      default:
        return "$";
    }
  }
  syncWorkingOverrides() {
    const normalized = PricingBuilder.syncSlotOverrides(__spreadProps(__spreadValues({}, PricingBuilder.createDefaultPricingConfig("event")), {
      currency: this.currency,
      slotOverrides: (this.overrides ?? []).map((item) => __spreadValues({}, item))
    }), this.slotCatalog);
    this.workingOverrides = normalized.slotOverrides.map((item) => __spreadValues({}, item));
  }
  emitOverrides() {
    const normalized = PricingBuilder.syncSlotOverrides(__spreadProps(__spreadValues({}, PricingBuilder.createDefaultPricingConfig("event")), {
      currency: this.currency,
      slotOverrides: this.workingOverrides.map((item) => __spreadValues({}, item))
    }), this.slotCatalog);
    this.workingOverrides = normalized.slotOverrides.map((item) => __spreadValues({}, item));
    this.overridesChange.emit(this.workingOverrides.map((item) => __spreadValues({}, item)));
    this.cdr.markForCheck();
  }
  remainingSlots() {
    const selectedSlotIds = new Set(this.workingOverrides.map((item) => item.slotId?.trim() || "").filter((slotId) => slotId.length > 0));
    return this.slotCatalog.filter((slot) => !selectedSlotIds.has(slot.id));
  }
  parseNullableMoney(value) {
    if (value === "" || value === null || value === void 0) {
      return null;
    }
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return null;
    }
    return Math.max(0, Math.round(parsed * 100) / 100);
  }
  formatDateTime(value) {
    const raw = `${value ?? ""}`.trim();
    if (!raw) {
      return "";
    }
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) {
      return raw;
    }
    return parsed.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  }
  static \u0275fac = function PricingSlotPanelComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PricingSlotPanelComponent)(\u0275\u0275directiveInject(ChangeDetectorRef));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PricingSlotPanelComponent, selectors: [["app-pricing-slot-panel"]], inputs: { enabled: "enabled", overrides: "overrides", slotCatalog: "slotCatalog", currency: "currency", readOnly: "readOnly", title: "title", description: "description" }, outputs: { enabledChange: "enabledChange", overridesChange: "overridesChange" }, features: [\u0275\u0275NgOnChangesFeature], decls: 11, vars: 4, consts: [[1, "pricing-slot-panel"], [1, "pricing-slot-panel__head"], [1, "pricing-slot-panel__copy"], ["type", "button", 1, "pricing-slot-panel__toggle", 3, "is-on", "is-off", "disabled"], [1, "pricing-slot-panel__empty"], [1, "pricing-slot-panel__empty", "pricing-slot-panel__empty--muted"], ["type", "button", 1, "pricing-slot-panel__toggle", 3, "click", "disabled"], [1, "pricing-slot-panel__cards"], [1, "pricing-slot-panel__card"], ["type", "button", 1, "pricing-slot-panel__add", 3, "click", "disabled"], [1, "pricing-slot-panel__card-head"], [1, "pricing-slot-panel__card-title"], ["type", "button", "aria-label", "Remove slot price override", 1, "pricing-slot-panel__remove", 3, "click", "disabled"], [1, "pricing-slot-panel__card-grid"], [1, "pricing-slot-panel__field"], ["kind", "select", "title", "Slot", 3, "menuId", "trigger", "items"], [1, "pricing-slot-panel__money-field"], [1, "pricing-slot-panel__money-prefix"], ["type", "number", "min", "0", "step", "0.01", "placeholder", "0", 3, "ngModelChange", "ngModel", "disabled"], [1, "pricing-slot-panel__money-code"], [1, "pricing-slot-panel__meta"]], template: function PricingSlotPanelComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "h4");
      \u0275\u0275text(4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p");
      \u0275\u0275text(6);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(7, PricingSlotPanelComponent_Conditional_7_Template, 6, 9, "button", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(8, PricingSlotPanelComponent_Conditional_8_Template, 5, 0, "div", 4)(9, PricingSlotPanelComponent_Conditional_9_Template, 5, 0, "div", 5)(10, PricingSlotPanelComponent_Conditional_10_Template, 9, 3);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.title);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.description);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.readOnly ? 7 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.slotCatalog.length === 0 ? 8 : !ctx.enabled ? 9 : 10);
    }
  }, dependencies: [
    CommonModule,
    FormsModule,
    DefaultValueAccessor,
    NumberValueAccessor,
    NgControlStatus,
    MinValidator,
    NgModel,
    AppMenuTriggerComponent,
    MatIconModule,
    MatIcon,
    I18nPipe
  ], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n}\n.pricing-slot-panel[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.82rem;\n  padding: 1rem;\n  border: 1px solid rgba(132, 162, 199, 0.3);\n  border-radius: 20px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.96) 0%,\n      rgba(244, 248, 255, 0.92) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(105, 189, 176, 0.16),\n      transparent 48%);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.88);\n  contain: layout paint;\n  transform: translateZ(0);\n  backface-visibility: hidden;\n}\n.pricing-slot-panel__head[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: flex-start;\n  gap: 1rem;\n}\n.pricing-slot-panel__copy[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.pricing-slot-panel__copy[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #213a5b;\n  font-size: 1rem;\n  font-weight: 800;\n}\n.pricing-slot-panel__copy[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.28rem 0 0;\n  color: rgba(57, 82, 115, 0.8);\n  font-size: 0.82rem;\n  line-height: 1.45;\n}\n.pricing-slot-panel__toggle[_ngcontent-%COMP%], \n.pricing-slot-panel__add[_ngcontent-%COMP%], \n.pricing-slot-panel__remove[_ngcontent-%COMP%] {\n  border: 0;\n  cursor: pointer;\n  transition:\n    transform 0.18s ease,\n    box-shadow 0.18s ease,\n    background-color 0.18s ease;\n}\n.pricing-slot-panel__toggle[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  padding: 0.34rem 0.56rem;\n  border-radius: 999px;\n  color: #245f58;\n  background: rgba(229, 247, 241, 0.92);\n  box-shadow: inset 0 0 0 1px rgba(81, 174, 147, 0.3);\n  font-weight: 700;\n  justify-self: end;\n}\n.pricing-slot-panel__toggle.is-off[_ngcontent-%COMP%] {\n  color: #60748e;\n  background: rgba(239, 244, 251, 0.96);\n  box-shadow: inset 0 0 0 1px rgba(129, 150, 177, 0.24);\n}\n.pricing-slot-panel__toggle[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 24px;\n  height: 24px;\n  font-size: 24px;\n}\n.pricing-slot-panel__toggle[_ngcontent-%COMP%]:disabled, \n.pricing-slot-panel__add[_ngcontent-%COMP%]:disabled, \n.pricing-slot-panel__remove[_ngcontent-%COMP%]:disabled {\n  cursor: default;\n  opacity: 0.55;\n  transform: none;\n}\n.pricing-slot-panel__cards[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.78rem;\n}\n.pricing-slot-panel__card[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.7rem;\n  padding: 0.88rem;\n  border-radius: 16px;\n  border: 1px solid rgba(111, 143, 183, 0.22);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.96) 0%,\n      rgba(250, 252, 255, 0.9) 100%),\n    radial-gradient(\n      circle at top left,\n      rgba(114, 165, 217, 0.12),\n      transparent 58%);\n  transform: translateZ(0);\n  backface-visibility: hidden;\n  contain: layout paint;\n}\n.pricing-slot-panel__card-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.75rem;\n}\n.pricing-slot-panel__card-title[_ngcontent-%COMP%] {\n  color: #21405f;\n  font-size: 0.93rem;\n  font-weight: 800;\n}\n.pricing-slot-panel__remove[_ngcontent-%COMP%] {\n  width: 28px;\n  height: 28px;\n  padding: 0;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: #6d829a;\n  background: rgba(240, 245, 251, 0.96);\n  box-shadow: inset 0 0 0 1px rgba(125, 146, 173, 0.22);\n}\n.pricing-slot-panel__remove[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  display: block;\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  margin: 0;\n}\n.pricing-slot-panel__card-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.95fr);\n  gap: 0.78rem;\n}\n.pricing-slot-panel__field[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.34rem;\n}\n.pricing-slot-panel__field[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  color: rgba(31, 57, 88, 0.88);\n  font-size: 0.74rem;\n  font-weight: 800;\n  letter-spacing: 0.01em;\n  text-transform: uppercase;\n}\n.pricing-slot-panel__money-field[_ngcontent-%COMP%] {\n  min-height: 46px;\n  border-radius: 14px;\n  border: 1px solid rgba(126, 149, 180, 0.28);\n  background: rgba(255, 255, 255, 0.96);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92);\n}\n.pricing-slot-panel__money-field[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.48rem;\n  padding: 0 0.7rem;\n}\n.pricing-slot-panel__money-prefix[_ngcontent-%COMP%], \n.pricing-slot-panel__money-code[_ngcontent-%COMP%] {\n  color: rgba(66, 87, 115, 0.78);\n  font-weight: 800;\n  font-size: 0.85rem;\n}\n.pricing-slot-panel__money-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  min-width: 0;\n  width: 100%;\n  border: 0;\n  outline: none;\n  background: transparent;\n  color: #203d5d;\n  font: inherit;\n  font-size: 1rem;\n  font-weight: 700;\n}\n.pricing-slot-panel__meta[_ngcontent-%COMP%] {\n  margin: 0;\n  color: rgba(58, 82, 114, 0.8);\n  font-size: 0.79rem;\n}\n.pricing-slot-panel__empty[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.55rem;\n  min-height: 48px;\n  padding: 0.8rem 0.9rem;\n  border-radius: 16px;\n  border: 1px dashed rgba(115, 145, 184, 0.35);\n  color: rgba(46, 72, 108, 0.86);\n  background: rgba(247, 250, 255, 0.78);\n}\n.pricing-slot-panel__empty--muted[_ngcontent-%COMP%] {\n  color: rgba(84, 103, 128, 0.78);\n}\n.pricing-slot-panel__add[_ngcontent-%COMP%] {\n  justify-self: start;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.46rem;\n  padding: 0.66rem 0.92rem;\n  border-radius: 14px;\n  color: #214763;\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #eff6ff 100%);\n  box-shadow: inset 0 0 0 1px rgba(99, 137, 184, 0.26), 0 10px 22px rgba(31, 58, 97, 0.08);\n  font-size: 0.88rem;\n  font-weight: 800;\n}\n.pricing-slot-panel__add[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n@media (max-width: 760px) {\n  .pricing-slot-panel__card-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .pricing-slot-panel__add[_ngcontent-%COMP%] {\n    width: 100%;\n    justify-content: center;\n  }\n}\n/*# sourceMappingURL=pricing-slot-panel.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PricingSlotPanelComponent, [{
    type: Component,
    args: [{ selector: "app-pricing-slot-panel", standalone: true, imports: [
      CommonModule,
      FormsModule,
      AppMenuTriggerComponent,
      MatIconModule,
      I18nPipe
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `<section class="pricing-slot-panel">
  <div class="pricing-slot-panel__head">
    <div class="pricing-slot-panel__copy">
      <h4>{{ title }}</h4>
      <p>{{ description }}</p>
    </div>
    @if (!readOnly) {
    <button
      type="button"
      class="pricing-slot-panel__toggle"
      [class.is-on]="enabled"
      [class.is-off]="!enabled"
      [disabled]="readOnly"
      (click)="toggleEnabled()"
      >
      <mat-icon>{{ enabled ? 'toggle_on' : 'toggle_off' }}</mat-icon>
      <span>{{ (enabled ? 'on' : 'off') | i18n }}</span>
    </button>
    }
  </div>

  @if (slotCatalog.length === 0) {
    <div class="pricing-slot-panel__empty">
      <mat-icon>schedule</mat-icon>
      <span>Add slots to unlock slot-specific pricing.</span>
    </div>
  } @else if (!enabled) {
    <div class="pricing-slot-panel__empty pricing-slot-panel__empty--muted">
      <mat-icon>grid_view</mat-icon>
      <span>Global pricing will apply to every slot until overrides are enabled.</span>
    </div>
  } @else {
    <div class="pricing-slot-panel__cards">
      @for (override of workingOverrides; track trackByOverride($index, override)) {
        <article class="pricing-slot-panel__card">
          <div class="pricing-slot-panel__card-head">
            <span class="pricing-slot-panel__card-title">{{ override.label || ('Slot ' + ($index + 1)) }}</span>
            <button
              type="button"
              class="pricing-slot-panel__remove"
              [disabled]="readOnly"
              (click)="removeOverride($index)"
              aria-label="Remove slot price override"
              >
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="pricing-slot-panel__card-grid">
            <label class="pricing-slot-panel__field">
              <span>Slot</span>
              <app-menu-trigger
                [menuId]="slotMenuId(override)"
                kind="select"
                title="Slot"
                [trigger]="slotMenuTrigger(override)"
                [items]="slotMenuItems(override, $index)"
              ></app-menu-trigger>
            </label>
            <label class="pricing-slot-panel__field">
              <span>Price</span>
              <div class="pricing-slot-panel__money-field">
                <span class="pricing-slot-panel__money-prefix">{{ currencySymbol(currency) }}</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  [ngModel]="override.price ?? ''"
                  (ngModelChange)="onPriceChange($index, $event)"
                  [disabled]="readOnly"
                  placeholder="0"
                  />
                <span class="pricing-slot-panel__money-code">{{ currency }}</span>
              </div>
            </label>
          </div>
          <p class="pricing-slot-panel__meta">{{ slotWindowLabel(override) }}</p>
        </article>
      }
      @if (workingOverrides.length === 0) {
        <div class="pricing-slot-panel__empty">
          <mat-icon>event_available</mat-icon>
          <span>No slot overrides yet. Add the first one below.</span>
        </div>
      }
    </div>
    <button
      type="button"
      class="pricing-slot-panel__add"
      [disabled]="readOnly || !hasRemainingSlots()"
      (click)="addOverride()"
      >
      <mat-icon>add</mat-icon>
      <span>{{ hasRemainingSlots() ? 'Add Slot Price Override' : 'All Slots Already Customized' }}</span>
    </button>
  }
</section>
`, styles: ["/* src/app/shared/ui/components/core/form/inputs/pricing-editor/pricing-slot-panel/pricing-slot-panel.component.scss */\n:host {\n  display: block;\n}\n.pricing-slot-panel {\n  display: grid;\n  gap: 0.82rem;\n  padding: 1rem;\n  border: 1px solid rgba(132, 162, 199, 0.3);\n  border-radius: 20px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.96) 0%,\n      rgba(244, 248, 255, 0.92) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(105, 189, 176, 0.16),\n      transparent 48%);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.88);\n  contain: layout paint;\n  transform: translateZ(0);\n  backface-visibility: hidden;\n}\n.pricing-slot-panel__head {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: flex-start;\n  gap: 1rem;\n}\n.pricing-slot-panel__copy {\n  min-width: 0;\n}\n.pricing-slot-panel__copy h4 {\n  margin: 0;\n  color: #213a5b;\n  font-size: 1rem;\n  font-weight: 800;\n}\n.pricing-slot-panel__copy p {\n  margin: 0.28rem 0 0;\n  color: rgba(57, 82, 115, 0.8);\n  font-size: 0.82rem;\n  line-height: 1.45;\n}\n.pricing-slot-panel__toggle,\n.pricing-slot-panel__add,\n.pricing-slot-panel__remove {\n  border: 0;\n  cursor: pointer;\n  transition:\n    transform 0.18s ease,\n    box-shadow 0.18s ease,\n    background-color 0.18s ease;\n}\n.pricing-slot-panel__toggle {\n  flex: 0 0 auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  padding: 0.34rem 0.56rem;\n  border-radius: 999px;\n  color: #245f58;\n  background: rgba(229, 247, 241, 0.92);\n  box-shadow: inset 0 0 0 1px rgba(81, 174, 147, 0.3);\n  font-weight: 700;\n  justify-self: end;\n}\n.pricing-slot-panel__toggle.is-off {\n  color: #60748e;\n  background: rgba(239, 244, 251, 0.96);\n  box-shadow: inset 0 0 0 1px rgba(129, 150, 177, 0.24);\n}\n.pricing-slot-panel__toggle mat-icon {\n  width: 24px;\n  height: 24px;\n  font-size: 24px;\n}\n.pricing-slot-panel__toggle:disabled,\n.pricing-slot-panel__add:disabled,\n.pricing-slot-panel__remove:disabled {\n  cursor: default;\n  opacity: 0.55;\n  transform: none;\n}\n.pricing-slot-panel__cards {\n  display: grid;\n  gap: 0.78rem;\n}\n.pricing-slot-panel__card {\n  display: grid;\n  gap: 0.7rem;\n  padding: 0.88rem;\n  border-radius: 16px;\n  border: 1px solid rgba(111, 143, 183, 0.22);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.96) 0%,\n      rgba(250, 252, 255, 0.9) 100%),\n    radial-gradient(\n      circle at top left,\n      rgba(114, 165, 217, 0.12),\n      transparent 58%);\n  transform: translateZ(0);\n  backface-visibility: hidden;\n  contain: layout paint;\n}\n.pricing-slot-panel__card-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.75rem;\n}\n.pricing-slot-panel__card-title {\n  color: #21405f;\n  font-size: 0.93rem;\n  font-weight: 800;\n}\n.pricing-slot-panel__remove {\n  width: 28px;\n  height: 28px;\n  padding: 0;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: #6d829a;\n  background: rgba(240, 245, 251, 0.96);\n  box-shadow: inset 0 0 0 1px rgba(125, 146, 173, 0.22);\n}\n.pricing-slot-panel__remove mat-icon {\n  display: block;\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  margin: 0;\n}\n.pricing-slot-panel__card-grid {\n  display: grid;\n  grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.95fr);\n  gap: 0.78rem;\n}\n.pricing-slot-panel__field {\n  display: grid;\n  gap: 0.34rem;\n}\n.pricing-slot-panel__field > span {\n  color: rgba(31, 57, 88, 0.88);\n  font-size: 0.74rem;\n  font-weight: 800;\n  letter-spacing: 0.01em;\n  text-transform: uppercase;\n}\n.pricing-slot-panel__money-field {\n  min-height: 46px;\n  border-radius: 14px;\n  border: 1px solid rgba(126, 149, 180, 0.28);\n  background: rgba(255, 255, 255, 0.96);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92);\n}\n.pricing-slot-panel__money-field {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.48rem;\n  padding: 0 0.7rem;\n}\n.pricing-slot-panel__money-prefix,\n.pricing-slot-panel__money-code {\n  color: rgba(66, 87, 115, 0.78);\n  font-weight: 800;\n  font-size: 0.85rem;\n}\n.pricing-slot-panel__money-field input {\n  min-width: 0;\n  width: 100%;\n  border: 0;\n  outline: none;\n  background: transparent;\n  color: #203d5d;\n  font: inherit;\n  font-size: 1rem;\n  font-weight: 700;\n}\n.pricing-slot-panel__meta {\n  margin: 0;\n  color: rgba(58, 82, 114, 0.8);\n  font-size: 0.79rem;\n}\n.pricing-slot-panel__empty {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.55rem;\n  min-height: 48px;\n  padding: 0.8rem 0.9rem;\n  border-radius: 16px;\n  border: 1px dashed rgba(115, 145, 184, 0.35);\n  color: rgba(46, 72, 108, 0.86);\n  background: rgba(247, 250, 255, 0.78);\n}\n.pricing-slot-panel__empty--muted {\n  color: rgba(84, 103, 128, 0.78);\n}\n.pricing-slot-panel__add {\n  justify-self: start;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.46rem;\n  padding: 0.66rem 0.92rem;\n  border-radius: 14px;\n  color: #214763;\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #eff6ff 100%);\n  box-shadow: inset 0 0 0 1px rgba(99, 137, 184, 0.26), 0 10px 22px rgba(31, 58, 97, 0.08);\n  font-size: 0.88rem;\n  font-weight: 800;\n}\n.pricing-slot-panel__add mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n@media (max-width: 760px) {\n  .pricing-slot-panel__card-grid {\n    grid-template-columns: 1fr;\n  }\n  .pricing-slot-panel__add {\n    width: 100%;\n    justify-content: center;\n  }\n}\n/*# sourceMappingURL=pricing-slot-panel.component.css.map */\n"] }]
  }], () => [{ type: ChangeDetectorRef }], { enabled: [{
    type: Input
  }], enabledChange: [{
    type: Output
  }], overrides: [{
    type: Input
  }], overridesChange: [{
    type: Output
  }], slotCatalog: [{
    type: Input
  }], currency: [{
    type: Input
  }], readOnly: [{
    type: Input
  }], title: [{
    type: Input
  }], description: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PricingSlotPanelComponent, { className: "PricingSlotPanelComponent", filePath: "app/shared/ui/components/core/form/inputs/pricing-editor/pricing-slot-panel/pricing-slot-panel.component.ts", lineNumber: 33 });
})();

// src/app/shared/ui/components/core/form/inputs/pricing-editor/pricing-editor.component.ts
var _c02 = ["pricingMaximumInput"];
var _forTrack0 = ($index, $item) => $item.id;
function PricingEditorInputComponent_Conditional_0_Conditional_1_Case_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "pricing.asset.title"));
  }
}
function PricingEditorInputComponent_Conditional_0_Conditional_1_Case_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "pricing.optional.title"));
  }
}
function PricingEditorInputComponent_Conditional_0_Conditional_1_Case_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "pricing"));
  }
}
function PricingEditorInputComponent_Conditional_0_Conditional_1_Case_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 12);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "pricing.event.subtitle.enabled"));
  }
}
function PricingEditorInputComponent_Conditional_0_Conditional_1_Case_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 12);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "pricing.event.subtitle.disabled"));
  }
}
function PricingEditorInputComponent_Conditional_0_Conditional_1_Case_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 12);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "pricing.asset.subtitle"));
  }
}
function PricingEditorInputComponent_Conditional_0_Conditional_1_Case_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 12);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "pricing.subevent.subtitle"));
  }
}
function PricingEditorInputComponent_Conditional_0_Conditional_1_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 13)(1, "button", 14);
    \u0275\u0275listener("click", function PricingEditorInputComponent_Conditional_0_Conditional_1_Conditional_13_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.togglePricingEnabled());
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "i18n");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275classProp("is-on", ctx_r1.isPricingEnabled());
    \u0275\u0275property("disabled", ctx_r1.editorLocked());
    \u0275\u0275attribute("aria-pressed", ctx_r1.isPricingEnabled());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.isPricingEnabled() ? "toggle_on" : "toggle_off");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(6, 6, ctx_r1.isPricingEnabled() ? "on" : "off"));
  }
}
function PricingEditorInputComponent_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "header", 7)(1, "div", 9)(2, "span", 10)(3, "span", 11)(4, "mat-icon");
    \u0275\u0275text(5, "paid");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, PricingEditorInputComponent_Conditional_0_Conditional_1_Case_6_Template, 3, 3, "span")(7, PricingEditorInputComponent_Conditional_0_Conditional_1_Case_7_Template, 3, 3, "span")(8, PricingEditorInputComponent_Conditional_0_Conditional_1_Case_8_Template, 3, 3, "span");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(9, PricingEditorInputComponent_Conditional_0_Conditional_1_Case_9_Template, 3, 3, "span", 12)(10, PricingEditorInputComponent_Conditional_0_Conditional_1_Case_10_Template, 3, 3, "span", 12)(11, PricingEditorInputComponent_Conditional_0_Conditional_1_Case_11_Template, 3, 3, "span", 12)(12, PricingEditorInputComponent_Conditional_0_Conditional_1_Case_12_Template, 3, 3, "span", 12);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(13, PricingEditorInputComponent_Conditional_0_Conditional_1_Conditional_13_Template, 7, 8, "div", 13);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(6);
    \u0275\u0275conditional((tmp_4_0 = ctx_r1.resolvedConfig.context) === "asset" ? 6 : tmp_4_0 === "subevent" ? 7 : 8);
    \u0275\u0275advance(3);
    \u0275\u0275conditional((tmp_5_0 = ctx_r1.subtitleKey()) === "event-enabled" ? 9 : tmp_5_0 === "event-disabled" ? 10 : tmp_5_0 === "asset" ? 11 : tmp_5_0 === "subevent" ? 12 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r1.showToggleControl() ? 13 : -1);
  }
}
function PricingEditorInputComponent_Conditional_0_Conditional_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 15)(1, "button", 17);
    \u0275\u0275listener("click", function PricingEditorInputComponent_Conditional_0_Conditional_2_Conditional_0_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.openWizard());
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "tune");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "i18n");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(6, 1, "pricing.setup.open"));
  }
}
function PricingEditorInputComponent_Conditional_0_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16);
    \u0275\u0275elementContainer(1, 18);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext(3);
    const pricingPreviewCards_r4 = \u0275\u0275reference(6);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", pricingPreviewCards_r4);
  }
}
function PricingEditorInputComponent_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, PricingEditorInputComponent_Conditional_0_Conditional_2_Conditional_0_Template, 7, 3, "div", 15);
    \u0275\u0275conditionalCreate(1, PricingEditorInputComponent_Conditional_0_Conditional_2_Conditional_1_Template, 2, 1, "div", 16);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(!ctx_r1.editorLocked() ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.resolvedConfig.showPreview ? 1 : -1);
  }
}
function PricingEditorInputComponent_Conditional_0_Conditional_3_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "aside", 20);
    \u0275\u0275elementContainer(1, 18);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext(3);
    const pricingPreviewCards_r4 = \u0275\u0275reference(6);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", pricingPreviewCards_r4);
  }
}
function PricingEditorInputComponent_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "div", 19);
    \u0275\u0275elementContainer(2, 18);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, PricingEditorInputComponent_Conditional_0_Conditional_3_Conditional_3_Template, 2, 1, "aside", 20);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    const pricingEditorSurfaces_r5 = \u0275\u0275reference(3);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngTemplateOutlet", pricingEditorSurfaces_r5);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.resolvedConfig.showPreview ? 3 : -1);
  }
}
function PricingEditorInputComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 6);
    \u0275\u0275conditionalCreate(1, PricingEditorInputComponent_Conditional_0_Conditional_1_Template, 14, 3, "header", 7);
    \u0275\u0275conditionalCreate(2, PricingEditorInputComponent_Conditional_0_Conditional_2_Template, 2, 2)(3, PricingEditorInputComponent_Conditional_0_Conditional_3_Template, 4, 2, "div", 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("pricing-editor--readonly", ctx_r1.editorLocked())("pricing-editor--summary-popup", ctx_r1.usesSummaryPopup())("pricing-editor--wizard-open", ctx_r1.wizardOpen)("pricing-editor--enabled", ctx_r1.showPricingContent())("pricing-editor--embedded", ctx_r1.resolvedConfig.embedded);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r1.resolvedConfig.embedded ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.usesSummaryPopup() && ctx_r1.showPricingContent() ? 2 : ctx_r1.showPricingContent() ? 3 : -1);
  }
}
function PricingEditorInputComponent_Conditional_1_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function PricingEditorInputComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, PricingEditorInputComponent_Conditional_1_ng_container_0_Template, 1, 0, "ng-container", 21);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("ngComponentOutlet", ctx)("ngComponentOutletInputs", ctx_r1.pricingEditorPopupOutletInputs());
  }
}
function PricingEditorInputComponent_ng_template_2_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 32);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r7 = ctx.$implicit;
    \u0275\u0275property("value", option_r7);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(option_r7);
  }
}
function PricingEditorInputComponent_ng_template_2_For_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 32);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r8 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("value", option_r8);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, ctx_r1.taxModeLabel(option_r8)));
  }
}
function PricingEditorInputComponent_ng_template_2_For_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 32);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r9 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("value", option_r9);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, ctx_r1.chargeTypeLabel(option_r9)));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_59_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 34);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "pricing.maximum.below.minimum"));
  }
}
function PricingEditorInputComponent_ng_template_2_For_67_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 32);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r10 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("value", option_r10);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, ctx_r1.roundingLabel(option_r10)));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_68_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 39);
    \u0275\u0275listener("click", function PricingEditorInputComponent_ng_template_2_Conditional_68_Conditional_5_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.toggleQuantityRulesEnabled());
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("is-on", ctx_r1.workingPricing.quantityRulesEnabled);
    \u0275\u0275property("disabled", ctx_r1.readOnly);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.workingPricing.quantityRulesEnabled ? "toggle_on" : "toggle_off");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 5, ctx_r1.workingPricing.quantityRulesEnabled ? "on" : "off"));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_68_Conditional_6_For_2_For_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 32);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r15 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275property("value", option_r15);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, ctx_r1.actionLabel(option_r15)));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_68_Conditional_6_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 41)(1, "div", 43)(2, "label", 29)(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 44)(7, "span");
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "i18n");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "label", 29)(11, "span");
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "input", 45);
    \u0275\u0275listener("input", function PricingEditorInputComponent_ng_template_2_Conditional_68_Conditional_6_For_2_Template_input_input_14_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.normalizeNumberInput($event));
    })("ngModelChange", function PricingEditorInputComponent_ng_template_2_Conditional_68_Conditional_6_For_2_Template_input_ngModelChange_14_listener($event) {
      const rule_r14 = \u0275\u0275restoreView(_r13).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.onQuantityRuleMinChange(rule_r14, $event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "label", 29)(16, "span");
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div", 30)(20, "mat-select", 31);
    \u0275\u0275twoWayListener("ngModelChange", function PricingEditorInputComponent_ng_template_2_Conditional_68_Conditional_6_For_2_Template_mat_select_ngModelChange_20_listener($event) {
      const rule_r14 = \u0275\u0275restoreView(_r13).$implicit;
      \u0275\u0275twoWayBindingSet(rule_r14.action.kind, $event) || (rule_r14.action.kind = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function PricingEditorInputComponent_ng_template_2_Conditional_68_Conditional_6_For_2_Template_mat_select_ngModelChange_20_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.emitPricing());
    });
    \u0275\u0275repeaterCreate(21, PricingEditorInputComponent_ng_template_2_Conditional_68_Conditional_6_For_2_For_22_Template, 3, 4, "mat-option", 32, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(23, "label", 29)(24, "span");
    \u0275\u0275text(25);
    \u0275\u0275pipe(26, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "input", 27);
    \u0275\u0275listener("input", function PricingEditorInputComponent_ng_template_2_Conditional_68_Conditional_6_For_2_Template_input_input_27_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.normalizeNumberInput($event));
    })("ngModelChange", function PricingEditorInputComponent_ng_template_2_Conditional_68_Conditional_6_For_2_Template_input_ngModelChange_27_listener($event) {
      const rule_r14 = \u0275\u0275restoreView(_r13).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.onQuantityRuleActionValueChange(rule_r14, $event));
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(28, "button", 46);
    \u0275\u0275pipe(29, "i18n");
    \u0275\u0275listener("click", function PricingEditorInputComponent_ng_template_2_Conditional_68_Conditional_6_For_2_Template_button_click_28_listener() {
      const $index_r16 = \u0275\u0275restoreView(_r13).$index;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.removeQuantityRule($index_r16));
    });
    \u0275\u0275elementStart(30, "mat-icon");
    \u0275\u0275text(31, "delete");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const rule_r14 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 14, "if"));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(9, 16, ctx_r1.quantityThresholdLabel()));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(13, 18, "quantity"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", rule_r14.minQuantity)("disabled", ctx_r1.readOnly);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(18, 20, "then"));
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", rule_r14.action.kind);
    \u0275\u0275property("disabled", ctx_r1.readOnly)("panelWidth", null);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.actionKindOptions);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(26, 22, "value"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", rule_r14.action.value)("disabled", ctx_r1.readOnly);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.readOnly);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(29, 24, "pricing.quantity.rule.remove.aria"));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_68_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 40);
    \u0275\u0275repeaterCreate(1, PricingEditorInputComponent_ng_template_2_Conditional_68_Conditional_6_For_2_Template, 32, 26, "article", 41, \u0275\u0275componentInstance().trackByRule, true);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 42);
    \u0275\u0275listener("click", function PricingEditorInputComponent_ng_template_2_Conditional_68_Conditional_6_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.addQuantityRule());
    });
    \u0275\u0275elementStart(4, "mat-icon");
    \u0275\u0275text(5, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.workingPricing.quantityRules);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.readOnly);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 2, "pricing.quantity.rule.add"));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_68_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 38);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r1.quantityDisabledHint()));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_68_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 22)(1, "div", 36)(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, PricingEditorInputComponent_ng_template_2_Conditional_68_Conditional_5_Template, 6, 7, "button", 37);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, PricingEditorInputComponent_ng_template_2_Conditional_68_Conditional_6_Template, 9, 4)(7, PricingEditorInputComponent_ng_template_2_Conditional_68_Conditional_7_Template, 3, 3, "p", 38);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 3, "pricing.quantity.rules"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.showToggleControl() ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.workingPricing.quantityRulesEnabled ? 6 : 7);
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_69_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 39);
    \u0275\u0275listener("click", function PricingEditorInputComponent_ng_template_2_Conditional_69_Conditional_5_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.toggleDemandRulesEnabled());
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("is-on", ctx_r1.workingPricing.demandRulesEnabled);
    \u0275\u0275property("disabled", ctx_r1.readOnly);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.workingPricing.demandRulesEnabled ? "toggle_on" : "toggle_off");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 5, ctx_r1.workingPricing.demandRulesEnabled ? "on" : "off"));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_69_Conditional_6_For_2_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 32);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r21 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275property("value", option_r21);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind1(2, 3, "pricing.capacity.filled"), " ", ctx_r1.operatorLabel(option_r21));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_69_Conditional_6_For_2_For_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 32);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r22 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275property("value", option_r22);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, ctx_r1.actionLabel(option_r22)));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_69_Conditional_6_For_2_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 29)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "app-menu-trigger", 48);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const rule_r20 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 6, "pricing.applies.to"));
    \u0275\u0275advance(2);
    \u0275\u0275property("menuId", ctx_r1.ruleScopeMenuId("demand", rule_r20))("title", ctx_r1.ruleScopeMenuTitle("demand"))("trigger", ctx_r1.ruleScopeMenuTrigger("demand", rule_r20))("items", ctx_r1.ruleScopeMenuItems("demand", rule_r20))("closeOnSelect", false);
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_69_Conditional_6_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 41)(1, "div", 43)(2, "label", 29)(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 30)(7, "mat-select", 31);
    \u0275\u0275twoWayListener("ngModelChange", function PricingEditorInputComponent_ng_template_2_Conditional_69_Conditional_6_For_2_Template_mat_select_ngModelChange_7_listener($event) {
      const rule_r20 = \u0275\u0275restoreView(_r19).$implicit;
      \u0275\u0275twoWayBindingSet(rule_r20.operator, $event) || (rule_r20.operator = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function PricingEditorInputComponent_ng_template_2_Conditional_69_Conditional_6_For_2_Template_mat_select_ngModelChange_7_listener() {
      \u0275\u0275restoreView(_r19);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.emitPricing());
    });
    \u0275\u0275repeaterCreate(8, PricingEditorInputComponent_ng_template_2_Conditional_69_Conditional_6_For_2_For_9_Template, 3, 5, "mat-option", 32, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "label", 29)(11, "span");
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "input", 47);
    \u0275\u0275listener("input", function PricingEditorInputComponent_ng_template_2_Conditional_69_Conditional_6_For_2_Template_input_input_14_listener($event) {
      \u0275\u0275restoreView(_r19);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.normalizeNumberInput($event));
    })("ngModelChange", function PricingEditorInputComponent_ng_template_2_Conditional_69_Conditional_6_For_2_Template_input_ngModelChange_14_listener($event) {
      const rule_r20 = \u0275\u0275restoreView(_r19).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.onDemandRuleThresholdChange(rule_r20, $event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "label", 29)(16, "span");
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div", 30)(20, "mat-select", 31);
    \u0275\u0275twoWayListener("ngModelChange", function PricingEditorInputComponent_ng_template_2_Conditional_69_Conditional_6_For_2_Template_mat_select_ngModelChange_20_listener($event) {
      const rule_r20 = \u0275\u0275restoreView(_r19).$implicit;
      \u0275\u0275twoWayBindingSet(rule_r20.action.kind, $event) || (rule_r20.action.kind = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function PricingEditorInputComponent_ng_template_2_Conditional_69_Conditional_6_For_2_Template_mat_select_ngModelChange_20_listener() {
      \u0275\u0275restoreView(_r19);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.emitPricing());
    });
    \u0275\u0275repeaterCreate(21, PricingEditorInputComponent_ng_template_2_Conditional_69_Conditional_6_For_2_For_22_Template, 3, 4, "mat-option", 32, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(23, "label", 29)(24, "span");
    \u0275\u0275text(25);
    \u0275\u0275pipe(26, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "input", 27);
    \u0275\u0275listener("input", function PricingEditorInputComponent_ng_template_2_Conditional_69_Conditional_6_For_2_Template_input_input_27_listener($event) {
      \u0275\u0275restoreView(_r19);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.normalizeNumberInput($event));
    })("ngModelChange", function PricingEditorInputComponent_ng_template_2_Conditional_69_Conditional_6_For_2_Template_input_ngModelChange_27_listener($event) {
      const rule_r20 = \u0275\u0275restoreView(_r19).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.onDemandRuleActionValueChange(rule_r20, $event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(28, PricingEditorInputComponent_ng_template_2_Conditional_69_Conditional_6_For_2_Conditional_28_Template, 5, 8, "label", 29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "button", 46);
    \u0275\u0275pipe(30, "i18n");
    \u0275\u0275listener("click", function PricingEditorInputComponent_ng_template_2_Conditional_69_Conditional_6_For_2_Template_button_click_29_listener() {
      const $index_r23 = \u0275\u0275restoreView(_r19).$index;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.removeDemandRule($index_r23));
    });
    \u0275\u0275elementStart(31, "mat-icon");
    \u0275\u0275text(32, "delete");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const rule_r20 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275classProp("pricing-editor__rule-grid--slots", ctx_r1.resolvedConfig.allowSlotFeatures);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 19, "if"));
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", rule_r20.operator);
    \u0275\u0275property("disabled", ctx_r1.readOnly)("panelWidth", null);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.demandOperatorOptions);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(13, 21, "pricing.capacity.percent"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", rule_r20.capacityFilledPercent)("disabled", ctx_r1.readOnly);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(18, 23, "then"));
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", rule_r20.action.kind);
    \u0275\u0275property("disabled", ctx_r1.readOnly)("panelWidth", null);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.actionKindOptions);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(26, 25, "value"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", rule_r20.action.value)("disabled", ctx_r1.readOnly);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.resolvedConfig.allowSlotFeatures ? 28 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.readOnly);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(30, 27, "pricing.demand.rule.remove.aria"));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_69_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 40);
    \u0275\u0275repeaterCreate(1, PricingEditorInputComponent_ng_template_2_Conditional_69_Conditional_6_For_2_Template, 33, 29, "article", 41, \u0275\u0275componentInstance().trackByRule, true);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 42);
    \u0275\u0275listener("click", function PricingEditorInputComponent_ng_template_2_Conditional_69_Conditional_6_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.addDemandRule());
    });
    \u0275\u0275elementStart(4, "mat-icon");
    \u0275\u0275text(5, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.workingPricing.demandRules);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.readOnly);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 2, "pricing.demand.rule.add"));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_69_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 38);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "pricing.demand.disabled.hint"));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_69_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 22)(1, "div", 36)(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, PricingEditorInputComponent_ng_template_2_Conditional_69_Conditional_5_Template, 6, 7, "button", 37);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, PricingEditorInputComponent_ng_template_2_Conditional_69_Conditional_6_Template, 9, 4)(7, PricingEditorInputComponent_ng_template_2_Conditional_69_Conditional_7_Template, 3, 3, "p", 38);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 3, "pricing.demand.rules"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.showToggleControl() ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.workingPricing.demandRulesEnabled ? 6 : 7);
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r24 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 39);
    \u0275\u0275listener("click", function PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_5_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r24);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.toggleTimeRulesEnabled());
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("is-on", ctx_r1.workingPricing.timeRulesEnabled);
    \u0275\u0275property("disabled", ctx_r1.readOnly);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.workingPricing.timeRulesEnabled ? "toggle_on" : "toggle_off");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 5, ctx_r1.workingPricing.timeRulesEnabled ? "on" : "off"));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_6_For_2_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 32);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r28 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275property("value", option_r28);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, ctx_r1.timeTriggerLabel(option_r28)));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_6_For_2_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r29 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 50)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "mat-form-field", 54)(5, "mat-date-range-input", 55)(6, "input", 56);
    \u0275\u0275pipe(7, "i18n");
    \u0275\u0275listener("dateChange", function PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_6_For_2_Conditional_10_Template_input_dateChange_6_listener($event) {
      \u0275\u0275restoreView(_r29);
      const rule_r27 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.onTimeRuleRangeStartChange(rule_r27, $event.value));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "input", 57);
    \u0275\u0275pipe(9, "i18n");
    \u0275\u0275listener("dateChange", function PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_6_For_2_Conditional_10_Template_input_dateChange_8_listener($event) {
      \u0275\u0275restoreView(_r29);
      const rule_r27 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.onTimeRuleRangeEndChange(rule_r27, $event.value));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275element(10, "mat-datepicker-toggle", 58)(11, "mat-date-range-picker", null, 3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const timeRuleRangePicker_r30 = \u0275\u0275reference(12);
    const rule_r27 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 9, "date.range"));
    \u0275\u0275advance(3);
    \u0275\u0275property("rangePicker", timeRuleRangePicker_r30);
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r1.timeRuleRangeStartDate(rule_r27))("disabled", ctx_r1.readOnly)("placeholder", \u0275\u0275pipeBind1(7, 11, "start.date"));
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r1.timeRuleRangeEndDate(rule_r27))("disabled", ctx_r1.readOnly)("placeholder", \u0275\u0275pipeBind1(9, 13, "end.date"));
    \u0275\u0275advance(2);
    \u0275\u0275property("for", timeRuleRangePicker_r30);
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_6_For_2_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r31 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 51)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "input", 59);
    \u0275\u0275listener("input", function PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_6_For_2_Conditional_11_Template_input_input_4_listener($event) {
      \u0275\u0275restoreView(_r31);
      const ctx_r1 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r1.normalizeNumberInput($event));
    })("ngModelChange", function PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_6_For_2_Conditional_11_Template_input_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r31);
      const rule_r27 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.onTimeRuleOffsetChange(rule_r27, $event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const rule_r27 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 3, "offset"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", rule_r27.offsetValue ?? "")("disabled", ctx_r1.readOnly);
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_6_For_2_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 32);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r32 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275property("value", option_r32);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, ctx_r1.actionLabel(option_r32)));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_6_For_2_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 29)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "app-menu-trigger", 48);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const rule_r27 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 6, "pricing.applies.to"));
    \u0275\u0275advance(2);
    \u0275\u0275property("menuId", ctx_r1.ruleScopeMenuId("time", rule_r27))("title", ctx_r1.ruleScopeMenuTitle("time"))("trigger", ctx_r1.ruleScopeMenuTrigger("time", rule_r27))("items", ctx_r1.ruleScopeMenuItems("time", rule_r27))("closeOnSelect", false);
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_6_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r26 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 41)(1, "div", 43)(2, "label", 49)(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 30)(7, "mat-select", 31);
    \u0275\u0275twoWayListener("ngModelChange", function PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_6_For_2_Template_mat_select_ngModelChange_7_listener($event) {
      const rule_r27 = \u0275\u0275restoreView(_r26).$implicit;
      \u0275\u0275twoWayBindingSet(rule_r27.trigger, $event) || (rule_r27.trigger = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_6_For_2_Template_mat_select_ngModelChange_7_listener() {
      \u0275\u0275restoreView(_r26);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.emitPricing());
    });
    \u0275\u0275repeaterCreate(8, PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_6_For_2_For_9_Template, 3, 4, "mat-option", 32, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(10, PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_6_For_2_Conditional_10_Template, 13, 15, "label", 50)(11, PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_6_For_2_Conditional_11_Template, 5, 5, "label", 51);
    \u0275\u0275elementStart(12, "label", 52)(13, "span");
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "div", 30)(17, "mat-select", 31);
    \u0275\u0275twoWayListener("ngModelChange", function PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_6_For_2_Template_mat_select_ngModelChange_17_listener($event) {
      const rule_r27 = \u0275\u0275restoreView(_r26).$implicit;
      \u0275\u0275twoWayBindingSet(rule_r27.action.kind, $event) || (rule_r27.action.kind = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_6_For_2_Template_mat_select_ngModelChange_17_listener() {
      \u0275\u0275restoreView(_r26);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.emitPricing());
    });
    \u0275\u0275repeaterCreate(18, PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_6_For_2_For_19_Template, 3, 4, "mat-option", 32, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "label", 53)(21, "span");
    \u0275\u0275text(22);
    \u0275\u0275pipe(23, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "input", 27);
    \u0275\u0275listener("input", function PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_6_For_2_Template_input_input_24_listener($event) {
      \u0275\u0275restoreView(_r26);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.normalizeNumberInput($event));
    })("ngModelChange", function PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_6_For_2_Template_input_ngModelChange_24_listener($event) {
      const rule_r27 = \u0275\u0275restoreView(_r26).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.onTimeRuleActionValueChange(rule_r27, $event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(25, PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_6_For_2_Conditional_25_Template, 5, 8, "label", 29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "button", 46);
    \u0275\u0275pipe(27, "i18n");
    \u0275\u0275listener("click", function PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_6_For_2_Template_button_click_26_listener() {
      const $index_r33 = \u0275\u0275restoreView(_r26).$index;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.removeTimeRule($index_r33));
    });
    \u0275\u0275elementStart(28, "mat-icon");
    \u0275\u0275text(29, "delete");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const rule_r27 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275classProp("pricing-editor__rule-grid--time", rule_r27.trigger !== "specific_date")("pricing-editor__rule-grid--slots", ctx_r1.resolvedConfig.allowSlotFeatures)("pricing-editor__rule-grid--time-date-desktop", rule_r27.trigger === "specific_date");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 21, "if"));
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", rule_r27.trigger);
    \u0275\u0275property("disabled", ctx_r1.readOnly)("panelWidth", null);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.timeTriggerOptions);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(rule_r27.trigger === "specific_date" ? 10 : 11);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(15, 23, "then"));
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", rule_r27.action.kind);
    \u0275\u0275property("disabled", ctx_r1.readOnly)("panelWidth", null);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.actionKindOptions);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(23, 25, "value"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", rule_r27.action.value)("disabled", ctx_r1.readOnly);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.resolvedConfig.allowSlotFeatures ? 25 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.readOnly);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(27, 27, "pricing.time.rule.remove.aria"));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 40);
    \u0275\u0275repeaterCreate(1, PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_6_For_2_Template, 30, 29, "article", 41, \u0275\u0275componentInstance().trackByRule, true);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 42);
    \u0275\u0275listener("click", function PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_6_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r25);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.addTimeRule());
    });
    \u0275\u0275elementStart(4, "mat-icon");
    \u0275\u0275text(5, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.workingPricing.timeRules);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.readOnly);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 2, "pricing.time.rule.add"));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 38);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "pricing.time.disabled.hint"));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_70_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 22)(1, "div", 36)(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_5_Template, 6, 7, "button", 37);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_6_Template, 9, 4)(7, PricingEditorInputComponent_ng_template_2_Conditional_70_Conditional_7_Template, 3, 3, "p", 38);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 3, "pricing.time.rules"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.showToggleControl() ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.workingPricing.timeRulesEnabled ? 6 : 7);
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_71_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r34 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 39);
    \u0275\u0275listener("click", function PricingEditorInputComponent_ng_template_2_Conditional_71_Conditional_5_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r34);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.toggleCancellationPolicyEnabled());
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("is-on", ctx_r1.workingPricing.cancellationPolicy.enabled);
    \u0275\u0275property("disabled", ctx_r1.readOnly);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.workingPricing.cancellationPolicy.enabled ? "toggle_on" : "toggle_off");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 5, ctx_r1.workingPricing.cancellationPolicy.enabled ? "on" : "off"));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_71_Conditional_6_For_2_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 32);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r38 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275property("value", option_r38);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, ctx_r1.cancellationUnitLabel(option_r38)));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_71_Conditional_6_For_2_For_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 32);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r39 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275property("value", option_r39);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, ctx_r1.cancellationRefundKindLabel(option_r39)));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_71_Conditional_6_For_2_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r40 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 63);
    \u0275\u0275listener("input", function PricingEditorInputComponent_ng_template_2_Conditional_71_Conditional_6_For_2_Conditional_27_Template_input_input_0_listener($event) {
      \u0275\u0275restoreView(_r40);
      const ctx_r1 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r1.normalizeNumberInput($event));
    })("ngModelChange", function PricingEditorInputComponent_ng_template_2_Conditional_71_Conditional_6_For_2_Conditional_27_Template_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r40);
      const rule_r37 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.onCancellationRuleRefundValueChange(rule_r37, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const rule_r37 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275property("step", rule_r37.refundKind === "percent" ? "1" : "0.01")("ngModel", rule_r37.refundValue ?? "")("disabled", ctx_r1.readOnly);
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_71_Conditional_6_For_2_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "input", 62);
    \u0275\u0275pipe(1, "i18n");
  }
  if (rf & 2) {
    const rule_r37 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275property("value", \u0275\u0275pipeBind1(1, 1, ctx_r1.cancellationRuleValueSuffix(rule_r37)));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_71_Conditional_6_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r36 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 41)(1, "div", 60)(2, "label", 29)(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 30)(7, "mat-select", 31);
    \u0275\u0275twoWayListener("ngModelChange", function PricingEditorInputComponent_ng_template_2_Conditional_71_Conditional_6_For_2_Template_mat_select_ngModelChange_7_listener($event) {
      const rule_r37 = \u0275\u0275restoreView(_r36).$implicit;
      \u0275\u0275twoWayBindingSet(rule_r37.offsetUnit, $event) || (rule_r37.offsetUnit = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function PricingEditorInputComponent_ng_template_2_Conditional_71_Conditional_6_For_2_Template_mat_select_ngModelChange_7_listener() {
      \u0275\u0275restoreView(_r36);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.emitPricing());
    });
    \u0275\u0275repeaterCreate(8, PricingEditorInputComponent_ng_template_2_Conditional_71_Conditional_6_For_2_For_9_Template, 3, 4, "mat-option", 32, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "label", 29)(11, "span");
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "input", 59);
    \u0275\u0275listener("input", function PricingEditorInputComponent_ng_template_2_Conditional_71_Conditional_6_For_2_Template_input_input_14_listener($event) {
      \u0275\u0275restoreView(_r36);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.normalizeNumberInput($event));
    })("ngModelChange", function PricingEditorInputComponent_ng_template_2_Conditional_71_Conditional_6_For_2_Template_input_ngModelChange_14_listener($event) {
      const rule_r37 = \u0275\u0275restoreView(_r36).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.onCancellationRuleOffsetChange(rule_r37, $event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "label", 29)(16, "span");
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div", 30)(20, "mat-select", 31);
    \u0275\u0275listener("ngModelChange", function PricingEditorInputComponent_ng_template_2_Conditional_71_Conditional_6_For_2_Template_mat_select_ngModelChange_20_listener($event) {
      const rule_r37 = \u0275\u0275restoreView(_r36).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.onCancellationRuleRefundKindChange(rule_r37, $event));
    });
    \u0275\u0275repeaterCreate(21, PricingEditorInputComponent_ng_template_2_Conditional_71_Conditional_6_For_2_For_22_Template, 3, 4, "mat-option", 32, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(23, "label", 29)(24, "span");
    \u0275\u0275text(25);
    \u0275\u0275pipe(26, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(27, PricingEditorInputComponent_ng_template_2_Conditional_71_Conditional_6_For_2_Conditional_27_Template, 1, 3, "input", 61)(28, PricingEditorInputComponent_ng_template_2_Conditional_71_Conditional_6_For_2_Conditional_28_Template, 2, 3, "input", 62);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "button", 46);
    \u0275\u0275pipe(30, "i18n");
    \u0275\u0275listener("click", function PricingEditorInputComponent_ng_template_2_Conditional_71_Conditional_6_For_2_Template_button_click_29_listener() {
      const $index_r41 = \u0275\u0275restoreView(_r36).$index;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.removeCancellationRule($index_r41));
    });
    \u0275\u0275elementStart(31, "mat-icon");
    \u0275\u0275text(32, "delete");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const rule_r37 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 15, "pricing.notice.window"));
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", rule_r37.offsetUnit);
    \u0275\u0275property("disabled", ctx_r1.readOnly)("panelWidth", null);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.cancellationUnitOptions);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(13, 17, "value"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", rule_r37.offsetValue ?? "")("disabled", ctx_r1.readOnly);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(18, 19, "refund"));
    \u0275\u0275advance(3);
    \u0275\u0275property("ngModel", rule_r37.refundKind)("disabled", ctx_r1.readOnly)("panelWidth", null);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.cancellationRefundKindOptions);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(26, 21, "pricing.refund.value"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.cancellationRuleNeedsValue(rule_r37) ? 27 : 28);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.readOnly);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(30, 23, "pricing.cancellation.rule.remove.aria"));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_71_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r35 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 40);
    \u0275\u0275repeaterCreate(1, PricingEditorInputComponent_ng_template_2_Conditional_71_Conditional_6_For_2_Template, 33, 25, "article", 41, \u0275\u0275componentInstance().trackByRule, true);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 42);
    \u0275\u0275listener("click", function PricingEditorInputComponent_ng_template_2_Conditional_71_Conditional_6_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r35);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.addCancellationRule());
    });
    \u0275\u0275elementStart(4, "mat-icon");
    \u0275\u0275text(5, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.workingPricing.cancellationPolicy.rules);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.readOnly);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 2, "pricing.cancellation.rule.add"));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_71_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 38);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "pricing.cancellation.disabled.hint"));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_71_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 22)(1, "div", 36)(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, PricingEditorInputComponent_ng_template_2_Conditional_71_Conditional_5_Template, 6, 7, "button", 37);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, PricingEditorInputComponent_ng_template_2_Conditional_71_Conditional_6_Template, 9, 4)(7, PricingEditorInputComponent_ng_template_2_Conditional_71_Conditional_7_Template, 3, 3, "p", 38);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 3, "pricing.cancellation.title"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.showToggleControl() ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.workingPricing.cancellationPolicy.enabled ? 6 : 7);
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_72_Template(rf, ctx) {
  if (rf & 1) {
    const _r42 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-pricing-slot-panel", 64);
    \u0275\u0275listener("enabledChange", function PricingEditorInputComponent_ng_template_2_Conditional_72_Template_app_pricing_slot_panel_enabledChange_0_listener($event) {
      \u0275\u0275restoreView(_r42);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onSlotPricingEnabledChange($event));
    })("overridesChange", function PricingEditorInputComponent_ng_template_2_Conditional_72_Template_app_pricing_slot_panel_overridesChange_0_listener($event) {
      \u0275\u0275restoreView(_r42);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onSlotOverridesChange($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("enabled", ctx_r1.workingPricing.slotPricingEnabled)("overrides", ctx_r1.workingPricing.slotOverrides)("slotCatalog", ctx_r1.resolvedConfig.slotCatalog)("currency", ctx_r1.workingPricing.currency)("readOnly", ctx_r1.readOnly);
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_73_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r43 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 39);
    \u0275\u0275listener("click", function PricingEditorInputComponent_ng_template_2_Conditional_73_Conditional_5_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r43);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.toggleAudienceEnabled());
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("is-on", ctx_r1.workingPricing.audience.enabled);
    \u0275\u0275property("disabled", ctx_r1.readOnly);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.workingPricing.audience.enabled ? "toggle_on" : "toggle_off");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 5, ctx_r1.workingPricing.audience.enabled ? "on" : "off"));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_73_Conditional_6_For_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 32);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r45 = ctx.$implicit;
    \u0275\u0275property("value", option_r45);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(option_r45);
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_73_Conditional_6_For_36_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 32);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r48 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275property("value", option_r48);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, ctx_r1.actionLabel(option_r48)));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_73_Conditional_6_For_36_Template(rf, ctx) {
  if (rf & 1) {
    const _r46 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 66)(1, "label", 29)(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "input", 67);
    \u0275\u0275listener("ngModelChange", function PricingEditorInputComponent_ng_template_2_Conditional_73_Conditional_6_For_36_Template_input_ngModelChange_5_listener($event) {
      const promo_r47 = \u0275\u0275restoreView(_r46).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.onPromoCodeTextChange(promo_r47, $event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "label", 29)(7, "span");
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 30)(11, "mat-select", 31);
    \u0275\u0275twoWayListener("ngModelChange", function PricingEditorInputComponent_ng_template_2_Conditional_73_Conditional_6_For_36_Template_mat_select_ngModelChange_11_listener($event) {
      const promo_r47 = \u0275\u0275restoreView(_r46).$implicit;
      \u0275\u0275twoWayBindingSet(promo_r47.action.kind, $event) || (promo_r47.action.kind = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function PricingEditorInputComponent_ng_template_2_Conditional_73_Conditional_6_For_36_Template_mat_select_ngModelChange_11_listener() {
      \u0275\u0275restoreView(_r46);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.emitPricing());
    });
    \u0275\u0275repeaterCreate(12, PricingEditorInputComponent_ng_template_2_Conditional_73_Conditional_6_For_36_For_13_Template, 3, 4, "mat-option", 32, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "label", 29)(15, "span");
    \u0275\u0275text(16);
    \u0275\u0275pipe(17, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "input", 27);
    \u0275\u0275listener("input", function PricingEditorInputComponent_ng_template_2_Conditional_73_Conditional_6_For_36_Template_input_input_18_listener($event) {
      \u0275\u0275restoreView(_r46);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.normalizeNumberInput($event));
    })("ngModelChange", function PricingEditorInputComponent_ng_template_2_Conditional_73_Conditional_6_For_36_Template_input_ngModelChange_18_listener($event) {
      const promo_r47 = \u0275\u0275restoreView(_r46).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.onPromoCodeActionValueChange(promo_r47, $event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "button", 46);
    \u0275\u0275pipe(20, "i18n");
    \u0275\u0275listener("click", function PricingEditorInputComponent_ng_template_2_Conditional_73_Conditional_6_For_36_Template_button_click_19_listener() {
      const $index_r49 = \u0275\u0275restoreView(_r46).$index;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.removePromoCode($index_r49));
    });
    \u0275\u0275elementStart(21, "mat-icon");
    \u0275\u0275text(22, "delete");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const promo_r47 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 12, "pricing.promo.code"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", promo_r47.code)("disabled", ctx_r1.readOnly);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(9, 14, "pricing.effect"));
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", promo_r47.action.kind);
    \u0275\u0275property("disabled", ctx_r1.readOnly)("panelWidth", null);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.actionKindOptions);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(17, 16, "value"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", promo_r47.action.value)("disabled", ctx_r1.readOnly);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.readOnly);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(20, 18, "pricing.promo.remove.aria"));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_73_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r44 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 60)(1, "label", 24)(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 25)(6, "span", 26);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "input", 27);
    \u0275\u0275listener("input", function PricingEditorInputComponent_ng_template_2_Conditional_73_Conditional_6_Template_input_input_8_listener($event) {
      \u0275\u0275restoreView(_r44);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.normalizeNumberInput($event));
    })("ngModelChange", function PricingEditorInputComponent_ng_template_2_Conditional_73_Conditional_6_Template_input_ngModelChange_8_listener($event) {
      \u0275\u0275restoreView(_r44);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onAudienceMoneyFieldChange("memberPrice", $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 28);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "label", 24)(12, "span");
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 25)(16, "span", 26);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "input", 27);
    \u0275\u0275listener("input", function PricingEditorInputComponent_ng_template_2_Conditional_73_Conditional_6_Template_input_input_18_listener($event) {
      \u0275\u0275restoreView(_r44);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.normalizeNumberInput($event));
    })("ngModelChange", function PricingEditorInputComponent_ng_template_2_Conditional_73_Conditional_6_Template_input_ngModelChange_18_listener($event) {
      \u0275\u0275restoreView(_r44);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onAudienceMoneyFieldChange("vipPrice", $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span", 28);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "label", 29)(22, "span");
    \u0275\u0275text(23);
    \u0275\u0275pipe(24, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "input", 47);
    \u0275\u0275listener("input", function PricingEditorInputComponent_ng_template_2_Conditional_73_Conditional_6_Template_input_input_25_listener($event) {
      \u0275\u0275restoreView(_r44);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.normalizeNumberInput($event));
    })("ngModelChange", function PricingEditorInputComponent_ng_template_2_Conditional_73_Conditional_6_Template_input_ngModelChange_25_listener($event) {
      \u0275\u0275restoreView(_r44);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onAudienceDiscountChange($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "label", 29)(27, "span");
    \u0275\u0275text(28);
    \u0275\u0275pipe(29, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "div", 30)(31, "mat-select", 31);
    \u0275\u0275twoWayListener("ngModelChange", function PricingEditorInputComponent_ng_template_2_Conditional_73_Conditional_6_Template_mat_select_ngModelChange_31_listener($event) {
      \u0275\u0275restoreView(_r44);
      const ctx_r1 = \u0275\u0275nextContext(3);
      \u0275\u0275twoWayBindingSet(ctx_r1.workingPricing.audience.soldOutLabel, $event) || (ctx_r1.workingPricing.audience.soldOutLabel = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function PricingEditorInputComponent_ng_template_2_Conditional_73_Conditional_6_Template_mat_select_ngModelChange_31_listener() {
      \u0275\u0275restoreView(_r44);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onStringFieldChange());
    });
    \u0275\u0275repeaterCreate(32, PricingEditorInputComponent_ng_template_2_Conditional_73_Conditional_6_For_33_Template, 2, 2, "mat-option", 32, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(34, "div", 65);
    \u0275\u0275repeaterCreate(35, PricingEditorInputComponent_ng_template_2_Conditional_73_Conditional_6_For_36_Template, 23, 20, "article", 66, \u0275\u0275componentInstance().trackByRule, true);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "button", 42);
    \u0275\u0275listener("click", function PricingEditorInputComponent_ng_template_2_Conditional_73_Conditional_6_Template_button_click_37_listener() {
      \u0275\u0275restoreView(_r44);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.addPromoCode());
    });
    \u0275\u0275elementStart(38, "mat-icon");
    \u0275\u0275text(39, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "span");
    \u0275\u0275text(41);
    \u0275\u0275pipe(42, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 19, "pricing.member.price"));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.currencySymbol(ctx_r1.workingPricing.currency));
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r1.workingPricing.audience.memberPrice ?? "")("disabled", ctx_r1.readOnly);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.workingPricing.currency);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(14, 21, "pricing.vip.price"));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.currencySymbol(ctx_r1.workingPricing.currency));
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r1.workingPricing.audience.vipPrice ?? "")("disabled", ctx_r1.readOnly);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.workingPricing.currency);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(24, 23, "pricing.invite.discount.percent"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", ctx_r1.workingPricing.audience.inviteOnlyDiscountPercent ?? "")("disabled", ctx_r1.readOnly);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(29, 25, "pricing.sold.out.label"));
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.workingPricing.audience.soldOutLabel);
    \u0275\u0275property("disabled", ctx_r1.readOnly)("panelWidth", null);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.soldOutLabelOptions);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.workingPricing.audience.promoCodes);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.readOnly);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(42, 27, "pricing.promo.add"));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_73_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 38);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "pricing.audience.disabled.hint"));
  }
}
function PricingEditorInputComponent_ng_template_2_Conditional_73_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 22)(1, "div", 36)(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, PricingEditorInputComponent_ng_template_2_Conditional_73_Conditional_5_Template, 6, 7, "button", 37);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, PricingEditorInputComponent_ng_template_2_Conditional_73_Conditional_6_Template, 43, 29)(7, PricingEditorInputComponent_ng_template_2_Conditional_73_Conditional_7_Template, 3, 3, "p", 38);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 3, "pricing.audience.title"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.showToggleControl() ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.workingPricing.audience.enabled ? 6 : 7);
  }
}
function PricingEditorInputComponent_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 22)(1, "div", 23)(2, "label", 24)(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 25)(7, "span", 26);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "input", 27);
    \u0275\u0275listener("input", function PricingEditorInputComponent_ng_template_2_Template_input_input_9_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.normalizeNumberInput($event));
    })("ngModelChange", function PricingEditorInputComponent_ng_template_2_Template_input_ngModelChange_9_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onBasePriceChange($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span", 28);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "label", 29)(13, "span");
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "div", 30)(17, "mat-select", 31);
    \u0275\u0275twoWayListener("ngModelChange", function PricingEditorInputComponent_ng_template_2_Template_mat_select_ngModelChange_17_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.workingPricing.currency, $event) || (ctx_r1.workingPricing.currency = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function PricingEditorInputComponent_ng_template_2_Template_mat_select_ngModelChange_17_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onStringFieldChange());
    });
    \u0275\u0275repeaterCreate(18, PricingEditorInputComponent_ng_template_2_For_19_Template, 2, 2, "mat-option", 32, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "label", 29)(21, "span");
    \u0275\u0275text(22);
    \u0275\u0275pipe(23, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div", 30)(25, "mat-select", 31);
    \u0275\u0275twoWayListener("ngModelChange", function PricingEditorInputComponent_ng_template_2_Template_mat_select_ngModelChange_25_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.workingPricing.taxMode, $event) || (ctx_r1.workingPricing.taxMode = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function PricingEditorInputComponent_ng_template_2_Template_mat_select_ngModelChange_25_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onStringFieldChange());
    });
    \u0275\u0275repeaterCreate(26, PricingEditorInputComponent_ng_template_2_For_27_Template, 3, 4, "mat-option", 32, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(28, "label", 29)(29, "span");
    \u0275\u0275text(30);
    \u0275\u0275pipe(31, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "div", 30)(33, "mat-select", 31);
    \u0275\u0275twoWayListener("ngModelChange", function PricingEditorInputComponent_ng_template_2_Template_mat_select_ngModelChange_33_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.workingPricing.chargeType, $event) || (ctx_r1.workingPricing.chargeType = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function PricingEditorInputComponent_ng_template_2_Template_mat_select_ngModelChange_33_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onStringFieldChange());
    });
    \u0275\u0275repeaterCreate(34, PricingEditorInputComponent_ng_template_2_For_35_Template, 3, 4, "mat-option", 32, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(36, "label", 24)(37, "span");
    \u0275\u0275text(38);
    \u0275\u0275pipe(39, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "div", 25)(41, "span", 26);
    \u0275\u0275text(42);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "input", 33);
    \u0275\u0275pipe(44, "i18n");
    \u0275\u0275listener("input", function PricingEditorInputComponent_ng_template_2_Template_input_input_43_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.normalizeNumberInput($event));
    })("ngModelChange", function PricingEditorInputComponent_ng_template_2_Template_input_ngModelChange_43_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onNullableMoneyFieldChange("minPrice", $event));
    })("blur", function PricingEditorInputComponent_ng_template_2_Template_input_blur_43_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onPriceBoundsBlur());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "span", 28);
    \u0275\u0275text(46);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(47, "label", 24)(48, "span");
    \u0275\u0275text(49);
    \u0275\u0275pipe(50, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(51, "div", 25)(52, "span", 26);
    \u0275\u0275text(53);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "input", 33, 2);
    \u0275\u0275pipe(56, "i18n");
    \u0275\u0275listener("input", function PricingEditorInputComponent_ng_template_2_Template_input_input_54_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.normalizeNumberInput($event));
    })("ngModelChange", function PricingEditorInputComponent_ng_template_2_Template_input_ngModelChange_54_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onNullableMoneyFieldChange("maxPrice", $event));
    })("blur", function PricingEditorInputComponent_ng_template_2_Template_input_blur_54_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onPriceBoundsBlur());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "span", 28);
    \u0275\u0275text(58);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(59, PricingEditorInputComponent_ng_template_2_Conditional_59_Template, 3, 3, "span", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(60, "label", 29)(61, "span");
    \u0275\u0275text(62);
    \u0275\u0275pipe(63, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(64, "div", 30)(65, "mat-select", 31);
    \u0275\u0275twoWayListener("ngModelChange", function PricingEditorInputComponent_ng_template_2_Template_mat_select_ngModelChange_65_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.workingPricing.rounding, $event) || (ctx_r1.workingPricing.rounding = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function PricingEditorInputComponent_ng_template_2_Template_mat_select_ngModelChange_65_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onStringFieldChange());
    });
    \u0275\u0275repeaterCreate(66, PricingEditorInputComponent_ng_template_2_For_67_Template, 3, 4, "mat-option", 32, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275conditionalCreate(68, PricingEditorInputComponent_ng_template_2_Conditional_68_Template, 8, 5, "section", 22);
    \u0275\u0275conditionalCreate(69, PricingEditorInputComponent_ng_template_2_Conditional_69_Template, 8, 5, "section", 22);
    \u0275\u0275conditionalCreate(70, PricingEditorInputComponent_ng_template_2_Conditional_70_Template, 8, 5, "section", 22);
    \u0275\u0275conditionalCreate(71, PricingEditorInputComponent_ng_template_2_Conditional_71_Template, 8, 5, "section", 22);
    \u0275\u0275conditionalCreate(72, PricingEditorInputComponent_ng_template_2_Conditional_72_Template, 1, 5, "app-pricing-slot-panel", 35);
    \u0275\u0275conditionalCreate(73, PricingEditorInputComponent_ng_template_2_Conditional_73_Template, 8, 5, "section", 22);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 41, ctx_r1.basePriceFieldLabel()));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.currencySymbol(ctx_r1.workingPricing.currency));
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r1.workingPricing.basePrice)("disabled", ctx_r1.readOnly);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.workingPricing.currency);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(15, 43, "currency"));
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.workingPricing.currency);
    \u0275\u0275property("disabled", ctx_r1.readOnly)("panelWidth", null);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.currencyOptions);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(23, 45, "tax"));
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.workingPricing.taxMode);
    \u0275\u0275property("disabled", ctx_r1.readOnly)("panelWidth", null);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.taxModeOptions);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(31, 47, ctx_r1.chargeTypeFieldLabel()));
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.workingPricing.chargeType);
    \u0275\u0275property("disabled", ctx_r1.readOnly)("panelWidth", null);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.resolvedConfig.chargeTypeOptions);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(39, 49, ctx_r1.minimumPriceFieldLabel()));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.currencySymbol(ctx_r1.workingPricing.currency));
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r1.workingPricing.minPrice ?? "")("disabled", ctx_r1.readOnly)("placeholder", \u0275\u0275pipeBind1(44, 51, "pricing.no.minimum"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.workingPricing.currency);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(50, 53, ctx_r1.maximumPriceFieldLabel()));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.currencySymbol(ctx_r1.workingPricing.currency));
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r1.workingPricing.maxPrice ?? "")("disabled", ctx_r1.readOnly)("placeholder", \u0275\u0275pipeBind1(56, 55, "pricing.no.maximum"));
    \u0275\u0275attribute("aria-invalid", ctx_r1.priceBoundsInvalid ? true : null);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.workingPricing.currency);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.priceBoundsInvalid ? 59 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(63, 57, "pricing.rounding"));
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.workingPricing.rounding);
    \u0275\u0275property("disabled", ctx_r1.readOnly)("panelWidth", null);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.roundingOptions);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.showQuantitySection() ? 68 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.showDemandSection() ? 69 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.showTimeSection() ? 70 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.showCancellationSection() ? 71 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.showSlotSection() ? 72 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.showAudienceSection() ? 73 : -1);
  }
}
function PricingEditorInputComponent_ng_template_5_Conditional_7_For_6_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r50 = \u0275\u0275nextContext().$implicit;
    const runtimePreview_r51 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("positive", (row_r50.amount ?? 0) > 0)("negative", (row_r50.amount ?? 0) < 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.runtimeRowAmount(row_r50, ctx_r1.runtimePreviewCurrency(runtimePreview_r51)), " ");
  }
}
function PricingEditorInputComponent_ng_template_5_Conditional_7_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 70)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, PricingEditorInputComponent_ng_template_5_Conditional_7_For_6_Conditional_3_Template, 2, 5, "strong", 74);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r50 = ctx.$implicit;
    const runtimePreview_r51 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.runtimeRowLabel(row_r50));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.runtimeRowAmount(row_r50, ctx_r1.runtimePreviewCurrency(runtimePreview_r51)) ? 3 : -1);
  }
}
function PricingEditorInputComponent_ng_template_5_Conditional_7_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 71);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const runtimePreview_r51 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(runtimePreview_r51.emptyLabel);
  }
}
function PricingEditorInputComponent_ng_template_5_Conditional_7_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 72);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx, " ");
  }
}
function PricingEditorInputComponent_ng_template_5_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 70)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275repeaterCreate(5, PricingEditorInputComponent_ng_template_5_Conditional_7_For_6_Template, 4, 2, "div", 70, \u0275\u0275componentInstance().runtimeRowTrackId, true);
    \u0275\u0275conditionalCreate(7, PricingEditorInputComponent_ng_template_5_Conditional_7_Conditional_7_Template, 2, 1, "p", 71);
    \u0275\u0275conditionalCreate(8, PricingEditorInputComponent_ng_template_5_Conditional_7_Conditional_8_Template, 2, 1, "p", 72);
    \u0275\u0275elementStart(9, "div", 73)(10, "span");
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "strong");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_9_0;
    const runtimePreview_r51 = ctx;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.runtimeBaseLabel(runtimePreview_r51));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.runtimeMoneyLabel(ctx_r1.runtimeBaseAmount(runtimePreview_r51), ctx_r1.runtimePreviewCurrency(runtimePreview_r51)));
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.runtimeAdjustmentRows(runtimePreview_r51));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(runtimePreview_r51.rows.length === 0 && runtimePreview_r51.emptyLabel ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_9_0 = ctx_r1.runtimeAssetBillingExplanation(runtimePreview_r51)) ? 8 : -1, tmp_9_0);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(12, 6, "event.editor.pricing.final.price"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.runtimeTotalLabel(runtimePreview_r51));
  }
}
function PricingEditorInputComponent_ng_template_5_Conditional_8_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 70)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "number");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.currentPreview.quantityLabel || "Quantity pricing");
    \u0275\u0275advance();
    \u0275\u0275classProp("positive", ctx_r1.currentPreview.quantityDelta > 0)("negative", ctx_r1.currentPreview.quantityDelta < 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3(" ", ctx_r1.currentPreview.quantityDelta > 0 ? "+" : "", "", ctx_r1.currencySymbol(ctx_r1.workingPricing.currency), "", \u0275\u0275pipeBind2(5, 8, ctx_r1.currentPreview.quantityDelta, "1.0-2"), " ");
  }
}
function PricingEditorInputComponent_ng_template_5_Conditional_8_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 70)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "number");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 8, "pricing.demand.adjustment"));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("positive", ctx_r1.currentPreview.demandDelta > 0)("negative", ctx_r1.currentPreview.demandDelta < 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3(" ", ctx_r1.currentPreview.demandDelta > 0 ? "+" : "", "", ctx_r1.currencySymbol(ctx_r1.workingPricing.currency), "", \u0275\u0275pipeBind2(6, 10, ctx_r1.currentPreview.demandDelta, "1.0-2"), " ");
  }
}
function PricingEditorInputComponent_ng_template_5_Conditional_8_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 70)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "number");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 8, "pricing.time.adjustment"));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("positive", ctx_r1.currentPreview.timeDelta > 0)("negative", ctx_r1.currentPreview.timeDelta < 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3(" ", ctx_r1.currentPreview.timeDelta > 0 ? "+" : "", "", ctx_r1.currencySymbol(ctx_r1.workingPricing.currency), "", \u0275\u0275pipeBind2(6, 10, ctx_r1.currentPreview.timeDelta, "1.0-2"), " ");
  }
}
function PricingEditorInputComponent_ng_template_5_Conditional_8_For_12_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "em");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r52 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, item_r52.detail));
  }
}
function PricingEditorInputComponent_ng_template_5_Conditional_8_For_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 76)(1, "span")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, PricingEditorInputComponent_ng_template_5_Conditional_8_For_12_Conditional_5_Template, 3, 3, "em");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "strong");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r52 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 3, item_r52.label));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(item_r52.detail ? 5 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 5, item_r52.value));
  }
}
function PricingEditorInputComponent_ng_template_5_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 70)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(7, PricingEditorInputComponent_ng_template_5_Conditional_8_Conditional_7_Template, 6, 11, "div", 70);
    \u0275\u0275conditionalCreate(8, PricingEditorInputComponent_ng_template_5_Conditional_8_Conditional_8_Template, 7, 13, "div", 70);
    \u0275\u0275conditionalCreate(9, PricingEditorInputComponent_ng_template_5_Conditional_8_Conditional_9_Template, 7, 13, "div", 70);
    \u0275\u0275elementStart(10, "div", 75);
    \u0275\u0275repeaterCreate(11, PricingEditorInputComponent_ng_template_5_Conditional_8_For_12_Template, 9, 7, "article", 76, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 73)(14, "span");
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "strong");
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "number");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 9, ctx_r1.pricingBaseSummaryLabel()));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", ctx_r1.currencySymbol(ctx_r1.workingPricing.currency), "", \u0275\u0275pipeBind2(6, 11, ctx_r1.currentPreview.basePrice, "1.0-2"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.currentPreview.quantityDelta !== 0 ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.currentPreview.demandDelta !== 0 ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.currentPreview.timeDelta !== 0 ? 9 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.pricingSummaryItems());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(16, 14, "event.editor.pricing.final.price"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", ctx_r1.currencySymbol(ctx_r1.workingPricing.currency), "", \u0275\u0275pipeBind2(19, 16, ctx_r1.currentPreview.finalPrice, "1.0-2"));
  }
}
function PricingEditorInputComponent_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 68)(1, "div", 69)(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "mat-icon");
    \u0275\u0275text(6, "query_stats");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(7, PricingEditorInputComponent_ng_template_5_Conditional_7_Template, 15, 8)(8, PricingEditorInputComponent_ng_template_5_Conditional_8_Template, 20, 19);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 2, "event.editor.pricing.current.review"));
    \u0275\u0275advance(4);
    \u0275\u0275conditional((tmp_4_0 = ctx_r1.runtimePreviewState()) ? 7 : 8, tmp_4_0);
  }
}
var PricingEditorInputComponent = class _PricingEditorInputComponent {
  cdr;
  static ownerSequence = 0;
  config = {};
  readOnly = false;
  disabled = false;
  workingPricing = PricingBuilder.createDefaultPricingConfig("event");
  priceBoundsInvalid = false;
  pricingMaximumInput;
  currencyOptions = ["USD", "EUR", "GBP", "CZK"];
  taxModeOptions = ["excluded", "included"];
  roundingOptions = ["none", "whole", "half"];
  demandOperatorOptions = ["gte", "lte"];
  actionKindOptions = [
    "increase_percent",
    "decrease_percent",
    "increase_amount",
    "decrease_amount",
    "set_exact_price"
  ];
  ruleScopeOptions = ["all_slots", "selected_slots"];
  timeTriggerOptions = ["days_before_start", "hours_before_start", "specific_date"];
  cancellationUnitOptions = ["hours", "days", "weeks", "months"];
  cancellationRefundKindOptions = ["percent", "fixed_amount", "full", "none"];
  soldOutLabelOptions = ['Show "Sold Out"', "Hide from list", 'Show "Waitlist"'];
  resolvedConfig = this.resolveConfig();
  wizardOpen = false;
  formFlowPopupStore = inject(FormFlowPopupStore);
  i18n = inject(I18nService);
  ownerId = this.nextOwnerId();
  pricingEditorPopupOutletInputs = computed(() => {
    const popup = this.formFlowPopupStore.pricingEditorPopupRef();
    return {
      popup: popup?.ownerId === this.ownerId ? popup : null
    };
  }, ...ngDevMode ? [{ debugName: "pricingEditorPopupOutletInputs" }] : (
    /* istanbul ignore next */
    []
  ));
  resolvedConfigSignature = this.buildResolvedConfigSignature(this.resolvedConfig);
  idSequence = 0;
  ruleScopePickerState = null;
  ruleScopeMenuSession = null;
  ruleScopeMenuDispatcher = inject(AppMenuDispatcher);
  pricingValue = null;
  pricingPopupDraft = null;
  onModelChange = () => {
  };
  onModelTouched = () => {
  };
  lastPricingEditorPopupActionRequestId = 0;
  destroyEffects = [];
  currentPreview;
  constructor(cdr) {
    this.cdr = cdr;
    this.destroyEffects.push(effect(() => {
      if (this.pricingEditorPopupIsOpen()) {
        void this.formFlowPopupStore.ensurePricingEditorPopupLoaded();
      }
    }), effect(() => {
      const request = this.formFlowPopupStore.pricingEditorPopupActionRequest();
      if (!request || request.requestId <= this.lastPricingEditorPopupActionRequestId) {
        return;
      }
      this.lastPricingEditorPopupActionRequestId = request.requestId;
      untracked(() => this.handlePricingEditorPopupActionRequest(request));
    }));
  }
  currentExplanationLines = [];
  currentFallbackLines = [];
  ngOnChanges(changes) {
    if (changes["config"]) {
      this.syncResolvedConfig();
      this.cdr.markForCheck();
    }
  }
  ngDoCheck() {
    this.syncResolvedConfig();
  }
  ngOnDestroy() {
    this.destroyEffects.forEach((item) => item.destroy());
    if (this.pricingEditorPopupIsOpen()) {
      this.formFlowPopupStore.closePricingEditorPopup(this.ownerId);
    }
  }
  writeValue(value) {
    this.pricingValue = value;
    this.syncWorkingPricing();
    this.cdr.markForCheck();
  }
  registerOnChange(fn) {
    this.onModelChange = fn;
  }
  registerOnTouched(fn) {
    this.onModelTouched = fn;
  }
  setDisabledState(isDisabled) {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }
  actionLabel(action) {
    switch (action) {
      case "decrease_percent":
        return "pricing.action.decrease.percent";
      case "increase_amount":
        return "pricing.action.increase.amount";
      case "decrease_amount":
        return "pricing.action.decrease.amount";
      case "set_exact_price":
        return "pricing.action.set.exact";
      default:
        return "pricing.action.increase.percent";
    }
  }
  chargeTypeLabel(chargeType) {
    switch (chargeType) {
      case "per_booking":
        return this.resolvedConfig.context === "asset" ? "pricing.charge.per.booking.day" : "pricing.charge.per.booking";
      case "per_slot":
        return "pricing.charge.per.slot";
      default:
        return this.resolvedConfig.context === "asset" ? "pricing.charge.per.item.day" : "pricing.charge.per.attendee";
    }
  }
  basePriceFieldLabel() {
    return this.resolvedConfig.context === "asset" ? "pricing.asset.base.daily.rate" : "pricing.base.price";
  }
  minimumPriceFieldLabel() {
    return this.resolvedConfig.context === "asset" ? "pricing.asset.minimum.daily.rate" : "pricing.minimum";
  }
  maximumPriceFieldLabel() {
    return this.resolvedConfig.context === "asset" ? "pricing.asset.maximum.daily.rate" : "pricing.maximum";
  }
  pricingBaseSummaryLabel() {
    return this.resolvedConfig.context === "asset" ? "pricing.asset.daily.rate" : "pricing.base";
  }
  chargeTypeFieldLabel() {
    return this.resolvedConfig.context === "asset" ? "pricing.charge.basis" : "pricing.charge.type";
  }
  quantityThresholdLabel() {
    return this.resolvedConfig.context === "asset" ? "pricing.asset.quantity.minimum" : "pricing.event.quantity.minimum";
  }
  quantityDisabledHint() {
    return this.resolvedConfig.context === "asset" ? "pricing.asset.quantity.disabled.hint" : "pricing.quantity.disabled.hint";
  }
  roundingLabel(rounding) {
    switch (rounding) {
      case "whole":
        return "pricing.rounding.whole";
      case "half":
        return "pricing.rounding.half";
      default:
        return "pricing.rounding.none";
    }
  }
  taxModeLabel(mode) {
    return mode === "included" ? "included" : "pricing.tax.excluded";
  }
  operatorLabel(operator) {
    return operator === "lte" ? "<=" : ">=";
  }
  ruleScopeLabel(scope) {
    return scope === "selected_slots" ? "pricing.slots.selected" : "pricing.slots.all";
  }
  timeTriggerLabel(trigger) {
    switch (trigger) {
      case "hours_before_start":
        return "pricing.time.before.start.hours";
      case "specific_date":
        return "pricing.time.during.range";
      default:
        return "pricing.time.before.start.days";
    }
  }
  currencySymbol(currency) {
    switch (`${currency ?? ""}`.trim().toUpperCase()) {
      case "EUR":
        return "EUR";
      case "GBP":
        return "GBP";
      case "CZK":
        return "CZK";
      default:
        return "$";
    }
  }
  showDemandSection() {
    return this.showToggleableSection(this.workingPricing.demandRulesEnabled);
  }
  showTimeSection() {
    return this.showToggleableSection(this.workingPricing.timeRulesEnabled);
  }
  showSlotSection() {
    return this.resolvedConfig.allowSlotFeatures && this.showToggleableSection(this.workingPricing.slotPricingEnabled);
  }
  showQuantitySection() {
    return (this.resolvedConfig.context === "event" || this.resolvedConfig.context === "asset") && this.showToggleableSection(this.workingPricing.quantityRulesEnabled);
  }
  showCancellationSection() {
    return (this.resolvedConfig.context === "event" || this.resolvedConfig.context === "asset") && this.showToggleableSection(this.workingPricing.cancellationPolicy.enabled);
  }
  showAudienceSection() {
    return this.resolvedConfig.showAudienceSection && this.showToggleableSection(this.workingPricing.audience.enabled);
  }
  showPricingPanel() {
    const configured = this.pricingPanelVisibility();
    if (configured !== null) {
      return configured;
    }
    return !this.editorLocked() || this.isPricingEnabled();
  }
  showPricingContent() {
    return this.pricingPanelVisibility() === true || this.isPricingEnabled();
  }
  showToggleControl() {
    return !this.editorLocked();
  }
  showToggleableSection(enabled) {
    return !this.editorLocked() || enabled;
  }
  pricingPanelVisibility() {
    return this.resolveConfigValue(this.config.visible, null);
  }
  isDynamicMode() {
    return this.workingPricing.mode !== "fixed";
  }
  isPricingEnabled() {
    return this.workingPricing.enabled === true;
  }
  usesSummaryPopup() {
    return this.resolvedConfig.presentation === "popup-summary";
  }
  editorLocked() {
    return this.readOnly || this.disabled;
  }
  subtitleKey() {
    if (this.editorLocked()) {
      return "none";
    }
    switch (this.resolvedConfig.context) {
      case "asset":
        return "asset";
      case "subevent":
        return "subevent";
      default:
        return this.isPricingEnabled() ? "event-enabled" : "event-disabled";
    }
  }
  openWizard() {
    if (this.editorLocked() || !this.usesSummaryPopup()) {
      return;
    }
    this.pricingPopupDraft = PricingBuilder.clonePricingConfig(this.workingPricing);
    this.wizardOpen = true;
    this.formFlowPopupStore.openPricingEditorPopup(this.buildPricingEditorPopupState());
    this.cdr.markForCheck();
  }
  closeWizard(event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.wizardOpen = false;
    this.pricingPopupDraft = null;
    this.formFlowPopupStore.closePricingEditorPopup(this.ownerId);
    this.closeRuleScopePicker();
    this.cdr.markForCheck();
  }
  pricingWizardPopupZIndex() {
    return 4600;
  }
  pricingWizardTitle() {
    switch (this.resolvedConfig.context) {
      case "asset":
        return "pricing.asset.setup.title";
      case "subevent":
        return "pricing.optional.setup.title";
      default:
        return "pricing.setup.title";
    }
  }
  pricingWizardSubtitle() {
    return "pricing.setup.subtitle";
  }
  buildPricingEditorPopupState() {
    return {
      ownerId: this.ownerId,
      title: this.pricingWizardTitle(),
      subtitle: this.pricingWizardSubtitle(),
      zIndex: this.pricingWizardPopupZIndex(),
      value: PricingBuilder.clonePricingConfig(this.pricingPopupDraft ?? this.workingPricing),
      config: this.pricingPopupEditorConfig(),
      readOnly: this.editorLocked(),
      canSave: this.canSavePricingPopupDraft()
    };
  }
  pricingPopupEditorConfig() {
    return __spreadProps(__spreadValues({}, this.config), {
      presentation: "inline",
      embedded: true
    });
  }
  updatePricingEditorPopupState() {
    if (!this.pricingEditorPopupIsOpen()) {
      return;
    }
    this.formFlowPopupStore.updatePricingEditorPopup(this.buildPricingEditorPopupState());
  }
  pricingEditorPopupComponent() {
    return this.pricingEditorPopupIsOpen() ? this.formFlowPopupStore.pricingEditorPopupComponent() : null;
  }
  pricingEditorPopupIsOpen() {
    return this.formFlowPopupStore.pricingEditorPopupRef()?.ownerId === this.ownerId;
  }
  commitPricingPopupDraft(value, event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.pricingPopupDraft = this.normalizePricingWithCapabilities(value);
    if (this.hasInvalidPriceBounds(this.pricingPopupDraft)) {
      return;
    }
    if (!this.canSavePricingPopupDraft()) {
      return;
    }
    this.workingPricing = this.normalizePricingWithCapabilities(this.pricingPopupDraft ?? this.workingPricing);
    this.emitPricing();
    this.closeWizard();
  }
  canSavePricingPopupDraft() {
    if (this.editorLocked()) {
      return false;
    }
    const draft = this.normalizePricingWithCapabilities(this.pricingPopupDraft ?? this.workingPricing);
    const current = this.normalizePricingWithCapabilities(this.pricingValue ?? this.workingPricing);
    return JSON.stringify(draft) !== JSON.stringify(current);
  }
  handlePricingEditorPopupActionRequest(request) {
    if (request.ownerId !== this.ownerId) {
      return;
    }
    switch (request.kind) {
      case "close":
        this.closeWizard(request.event);
        return;
      case "save":
        this.commitPricingPopupDraft(request.value, request.event);
        return;
    }
  }
  togglePricingEnabled() {
    if (this.editorLocked()) {
      return;
    }
    this.workingPricing.enabled = !this.workingPricing.enabled;
    if (!this.workingPricing.enabled) {
      this.closeWizard();
    }
    this.emitPricing();
  }
  onStringFieldChange() {
    this.emitPricing();
  }
  normalizeNumberInput(event) {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.type !== "number") {
      return;
    }
    const normalized = input.value.replace(/^(-?)0+(?=\d)/, "$1");
    if (normalized !== input.value) {
      input.value = normalized;
    }
  }
  onBasePriceChange(value) {
    this.workingPricing.basePrice = this.parseMoney(value) ?? 0;
    this.emitPricing();
  }
  onNullableMoneyFieldChange(field, value) {
    this.workingPricing[field] = this.parseMoney(value);
    this.priceBoundsInvalid = false;
    this.emitPricing();
  }
  validatePriceBounds(revealError = false) {
    this.priceBoundsInvalid = this.hasInvalidPriceBounds(this.workingPricing);
    if (this.priceBoundsInvalid && revealError) {
      this.pricingMaximumInput?.nativeElement.scrollIntoView({ block: "center" });
    }
    this.cdr.markForCheck();
    return !this.priceBoundsInvalid;
  }
  onPriceBoundsBlur() {
    if (this.hasInvalidPriceBounds(this.workingPricing)) {
      this.workingPricing.maxPrice = this.workingPricing.minPrice;
      this.priceBoundsInvalid = false;
      this.emitPricing();
    }
  }
  hasInvalidPriceBounds(pricing) {
    return pricing.minPrice !== null && pricing.maxPrice !== null && pricing.maxPrice < pricing.minPrice;
  }
  onAudienceMoneyFieldChange(field, value) {
    this.workingPricing.audience[field] = this.parseMoney(value);
    this.emitPricing();
  }
  onAudienceDiscountChange(value) {
    this.workingPricing.audience.inviteOnlyDiscountPercent = this.parsePercent(value);
    this.emitPricing();
  }
  toggleDemandRulesEnabled() {
    if (this.readOnly) {
      return;
    }
    this.workingPricing.demandRulesEnabled = !this.workingPricing.demandRulesEnabled;
    if (this.workingPricing.demandRulesEnabled && this.workingPricing.demandRules.length === 0) {
      this.workingPricing.demandRules = [this.createDefaultDemandRule()];
    }
    this.emitPricing();
  }
  toggleQuantityRulesEnabled() {
    if (this.readOnly) {
      return;
    }
    this.workingPricing.quantityRulesEnabled = !this.workingPricing.quantityRulesEnabled;
    if (this.workingPricing.quantityRulesEnabled && this.workingPricing.quantityRules.length === 0) {
      this.workingPricing.quantityRules = [this.createDefaultQuantityRule()];
    }
    this.emitPricing();
  }
  toggleTimeRulesEnabled() {
    if (this.readOnly) {
      return;
    }
    this.workingPricing.timeRulesEnabled = !this.workingPricing.timeRulesEnabled;
    if (this.workingPricing.timeRulesEnabled && this.workingPricing.timeRules.length === 0) {
      this.workingPricing.timeRules = [this.createDefaultTimeRule()];
    }
    this.emitPricing();
  }
  toggleAudienceEnabled() {
    if (this.readOnly) {
      return;
    }
    this.workingPricing.audience.enabled = !this.workingPricing.audience.enabled;
    this.emitPricing();
  }
  toggleCancellationPolicyEnabled() {
    if (this.readOnly) {
      return;
    }
    this.workingPricing.cancellationPolicy.enabled = !this.workingPricing.cancellationPolicy.enabled;
    if (this.workingPricing.cancellationPolicy.enabled && this.workingPricing.cancellationPolicy.rules.length === 0) {
      this.workingPricing.cancellationPolicy.rules = [this.createDefaultCancellationRule()];
    }
    this.emitPricing();
  }
  addDemandRule() {
    if (this.readOnly) {
      return;
    }
    this.workingPricing.demandRules = [
      ...this.workingPricing.demandRules,
      this.createDefaultDemandRule()
    ];
    this.workingPricing.demandRulesEnabled = true;
    this.emitPricing();
  }
  removeDemandRule(index) {
    if (this.readOnly || index < 0 || index >= this.workingPricing.demandRules.length) {
      return;
    }
    this.workingPricing.demandRules = this.workingPricing.demandRules.filter((_, itemIndex) => itemIndex !== index);
    this.emitPricing();
  }
  addQuantityRule() {
    if (this.readOnly) {
      return;
    }
    this.workingPricing.quantityRules = [
      ...this.workingPricing.quantityRules,
      this.createDefaultQuantityRule()
    ];
    this.workingPricing.quantityRulesEnabled = true;
    this.emitPricing();
  }
  removeQuantityRule(index) {
    if (this.readOnly || index < 0 || index >= this.workingPricing.quantityRules.length) {
      return;
    }
    this.workingPricing.quantityRules = this.workingPricing.quantityRules.filter((_, itemIndex) => itemIndex !== index);
    this.emitPricing();
  }
  addTimeRule() {
    if (this.readOnly) {
      return;
    }
    this.workingPricing.timeRules = [
      ...this.workingPricing.timeRules,
      this.createDefaultTimeRule()
    ];
    this.workingPricing.timeRulesEnabled = true;
    this.emitPricing();
  }
  removeTimeRule(index) {
    if (this.readOnly || index < 0 || index >= this.workingPricing.timeRules.length) {
      return;
    }
    this.workingPricing.timeRules = this.workingPricing.timeRules.filter((_, itemIndex) => itemIndex !== index);
    this.emitPricing();
  }
  addCancellationRule() {
    if (this.readOnly) {
      return;
    }
    this.workingPricing.cancellationPolicy.rules = [
      ...this.workingPricing.cancellationPolicy.rules,
      this.createDefaultCancellationRule()
    ];
    this.workingPricing.cancellationPolicy.enabled = true;
    this.emitPricing();
  }
  removeCancellationRule(index) {
    if (this.readOnly || index < 0 || index >= this.workingPricing.cancellationPolicy.rules.length) {
      return;
    }
    this.workingPricing.cancellationPolicy.rules = this.workingPricing.cancellationPolicy.rules.filter((_, itemIndex) => itemIndex !== index);
    this.emitPricing();
  }
  addPromoCode() {
    if (this.readOnly) {
      return;
    }
    this.workingPricing.audience.promoCodes = [
      ...this.workingPricing.audience.promoCodes,
      {
        id: this.nextId("promo"),
        code: "",
        action: {
          kind: "decrease_percent",
          value: 10
        }
      }
    ];
    this.workingPricing.audience.enabled = true;
    this.emitPricing();
  }
  removePromoCode(index) {
    if (this.readOnly || index < 0 || index >= this.workingPricing.audience.promoCodes.length) {
      return;
    }
    this.workingPricing.audience.promoCodes = this.workingPricing.audience.promoCodes.filter((_, itemIndex) => itemIndex !== index);
    this.emitPricing();
  }
  onDemandRuleThresholdChange(rule, value) {
    rule.capacityFilledPercent = this.parsePercent(value) ?? rule.capacityFilledPercent;
    this.emitPricing();
  }
  onDemandRuleActionValueChange(rule, value) {
    rule.action.value = this.parseMoney(value) ?? 0;
    this.emitPricing();
  }
  onQuantityRuleMinChange(rule, value) {
    rule.minQuantity = this.parseInteger(value) ?? rule.minQuantity;
    rule.minQuantity = Math.max(1, rule.minQuantity);
    this.emitPricing();
  }
  onQuantityRuleActionValueChange(rule, value) {
    rule.action.value = this.parseMoney(value) ?? 0;
    this.emitPricing();
  }
  onDemandRuleScopeChange(rule, scope) {
    rule.appliesTo = scope;
    if (scope === "all_slots") {
      rule.slotIds = [];
    }
    this.emitPricing();
  }
  onDemandRuleSlotIdsChange(rule, value) {
    rule.slotIds = Array.isArray(value) ? value.map((item) => `${item}`.trim()).filter((item) => item.length > 0) : [];
    this.emitPricing();
  }
  onTimeRuleOffsetChange(rule, value) {
    rule.offsetValue = this.parseInteger(value);
    this.emitPricing();
  }
  timeRuleRangeStartDate(rule) {
    return this.isoDateToDate(rule.specificDateStart);
  }
  timeRuleRangeEndDate(rule) {
    return this.isoDateToDate(rule.specificDateEnd);
  }
  onTimeRuleRangeStartChange(rule, value) {
    const normalized = this.dateToIsoDate(value);
    rule.specificDateStart = normalized;
    if (!normalized) {
      rule.specificDateEnd = null;
      this.emitPricing();
      return;
    }
    if (!rule.specificDateEnd || rule.specificDateEnd < normalized) {
      rule.specificDateEnd = normalized;
    }
    this.emitPricing();
  }
  onTimeRuleRangeEndChange(rule, value) {
    const normalized = this.dateToIsoDate(value);
    rule.specificDateEnd = normalized;
    if (!normalized) {
      rule.specificDateStart = null;
      this.emitPricing();
      return;
    }
    if (!rule.specificDateStart || rule.specificDateStart > normalized) {
      rule.specificDateStart = normalized;
    }
    this.emitPricing();
  }
  onTimeRuleActionValueChange(rule, value) {
    rule.action.value = this.parseMoney(value) ?? 0;
    this.emitPricing();
  }
  cancellationUnitLabel(unit) {
    switch (unit) {
      case "hours":
        return "pricing.hours.before.start";
      case "weeks":
        return "pricing.weeks.before.start";
      case "months":
        return "pricing.months.before.start";
      default:
        return "pricing.days.before.start";
    }
  }
  cancellationRefundKindLabel(kind) {
    switch (kind) {
      case "fixed_amount":
        return "pricing.refund.fixed";
      case "full":
        return "full.refund";
      case "none":
        return "no.refund";
      default:
        return "pricing.refund.percent";
    }
  }
  cancellationRuleNeedsValue(rule) {
    return rule.refundKind === "percent" || rule.refundKind === "fixed_amount";
  }
  cancellationRuleValueSuffix(rule) {
    if (rule.refundKind === "percent") {
      return "%";
    }
    if (rule.refundKind === "fixed_amount") {
      return this.workingPricing.currency;
    }
    return "Auto";
  }
  onCancellationRuleOffsetChange(rule, value) {
    rule.offsetValue = this.parseInteger(value);
    this.emitPricing();
  }
  onCancellationRuleRefundKindChange(rule, value) {
    rule.refundKind = value;
    if (value === "percent") {
      rule.refundValue = rule.refundValue ?? 100;
    } else if (value === "fixed_amount") {
      rule.refundValue = rule.refundValue ?? this.workingPricing.basePrice;
    } else {
      rule.refundValue = null;
    }
    this.emitPricing();
  }
  onCancellationRuleRefundValueChange(rule, value) {
    rule.refundValue = rule.refundKind === "percent" ? this.parsePercent(value) : this.parseMoney(value);
    this.emitPricing();
  }
  onTimeRuleScopeChange(rule, scope) {
    rule.appliesTo = scope;
    if (scope === "all_slots") {
      rule.slotIds = [];
    }
    this.emitPricing();
  }
  onTimeRuleSlotIdsChange(rule, value) {
    rule.slotIds = Array.isArray(value) ? value.map((item) => `${item}`.trim()).filter((item) => item.length > 0) : [];
    this.emitPricing();
  }
  onPromoCodeTextChange(code, value) {
    code.code = `${value ?? ""}`.trim().toUpperCase();
    this.emitPricing();
  }
  onPromoCodeActionValueChange(code, value) {
    code.action.value = this.parseMoney(value) ?? 0;
    this.emitPricing();
  }
  onSlotPricingEnabledChange(value) {
    this.workingPricing.slotPricingEnabled = value;
    this.emitPricing();
  }
  onSlotOverridesChange(overrides) {
    this.workingPricing.slotOverrides = overrides.map((item) => __spreadValues({}, item));
    this.emitPricing();
  }
  ruleScopeMenuTitle(kind) {
    return kind === "time" ? "pricing.time.rule.slots" : "pricing.demand.rule.slots";
  }
  ruleScopeMenuId(kind, rule) {
    return `pricing-${kind}-scope-${rule.id}`;
  }
  ruleScopeButtonLabel(rule) {
    if (rule.appliesTo !== "selected_slots") {
      return "pricing.slots.all";
    }
    if ((rule.slotIds?.length ?? 0) === 0) {
      return "pricing.slots.specific";
    }
    if (rule.slotIds.length === 1) {
      return this.slotLabelById(rule.slotIds[0]) || "pricing.slots.specific";
    }
    return `${rule.slotIds.length} slots selected`;
  }
  ruleScopeMenuTrigger(kind, rule) {
    return {
      id: `${kind}-${rule.id}-scope`,
      label: this.ruleScopeButtonLabel(rule),
      icon: "view_week",
      trailingIcon: "expand_more",
      openTrailingIcon: "expand_less",
      palette: "mint",
      layout: "field",
      disabled: this.readOnly
    };
  }
  ruleScopeMenuItems(kind, rule) {
    const activeMenu = this.ruleScopeMenuDispatcher.activeMenu();
    const useDraft = this.ruleScopeMenuSession === activeMenu && activeMenu?.id === this.ruleScopeMenuId(kind, rule) && this.ruleScopePickerState?.kind === kind && this.ruleScopePickerState.ruleId === rule.id;
    const state = useDraft ? this.ruleScopePickerState : {
      kind,
      ruleId: rule.id,
      appliesTo: rule.appliesTo,
      slotIds: [...rule.slotIds ?? []]
    };
    const selectedSlots = new Set(state?.slotIds ?? []);
    const items = [
      {
        id: `${kind}-${rule.id}-all-slots`,
        label: "pricing.slots.all",
        icon: "view_week",
        kind: "radio",
        palette: "mint",
        checked: state?.appliesTo === "all_slots",
        closeOnSelect: false,
        context: {
          action: "select-scope",
          kind,
          ruleId: rule.id,
          scope: "all_slots"
        }
      },
      {
        id: `${kind}-${rule.id}-specific-slots`,
        label: "pricing.slots.specific",
        icon: "view_list",
        kind: "radio",
        palette: "teal",
        checked: state?.appliesTo === "selected_slots",
        disabled: this.resolvedConfig.slotCatalog.length === 0,
        closeOnSelect: false,
        context: {
          action: "select-scope",
          kind,
          ruleId: rule.id,
          scope: "selected_slots"
        }
      }
    ];
    if (state?.appliesTo === "selected_slots") {
      items.push({
        id: `${kind}-${rule.id}-slot-section`,
        label: "event.editor.slots.title",
        kind: "section"
      });
      items.push(...this.resolvedConfig.slotCatalog.map((slot) => ({
        id: `${kind}-${rule.id}-slot-${slot.id}`,
        label: slot.label,
        description: this.slotScopeWindowLabel(slot),
        icon: "event",
        kind: "checkbox",
        palette: "blue",
        checked: selectedSlots.has(slot.id),
        closeOnSelect: false,
        context: {
          action: "toggle-slot",
          kind,
          ruleId: rule.id,
          slotId: slot.id
        }
      })));
    }
    items.push({
      id: `${kind}-${rule.id}-apply-divider`,
      kind: "divider"
    }, {
      id: `${kind}-${rule.id}-apply`,
      label: "apply",
      icon: "done",
      kind: "action",
      layout: "action",
      palette: "green",
      disabled: !state || state.appliesTo === "selected_slots" && state.slotIds.length === 0,
      closeOnSelect: false,
      context: {
        action: "apply",
        kind,
        ruleId: rule.id
      }
    });
    return items;
  }
  activeRuleScopeMenuItems() {
    const activeMenu = this.ruleScopeMenuDispatcher.activeMenu();
    const state = this.ruleScopePickerState;
    const rule = this.currentRuleScopeRule();
    return state && rule && activeMenu && this.ruleScopeMenuSession === activeMenu ? this.ruleScopeMenuItems(state.kind, rule) : null;
  }
  onRuleScopeMenuSelect(event) {
    const routedContext = event.context;
    if (typeof routedContext?.select === "function") {
      routedContext.select();
      return;
    }
    const context = event.context;
    if (!context || !this.prepareRuleScopeDraft(context)) {
      return;
    }
    if (context.action === "select-scope" && context.scope) {
      this.selectRuleScopeDraftMode(context.scope, event.sourceEvent);
      return;
    }
    if (context.action === "toggle-slot" && context.slotId) {
      this.toggleRuleScopeDraftSlot(context.slotId, event.sourceEvent);
      return;
    }
    if (context.action === "apply") {
      this.applyCurrentRuleScopeDraft(event.sourceEvent);
      this.ruleScopeMenuDispatcher.close();
    }
  }
  selectRuleScopeDraftMode(scope, event) {
    event?.stopPropagation();
    if (!this.ruleScopePickerState) {
      return;
    }
    this.ruleScopePickerState = __spreadProps(__spreadValues({}, this.ruleScopePickerState), {
      appliesTo: scope,
      slotIds: scope === "all_slots" ? [] : this.ruleScopePickerState.slotIds.length > 0 ? [...this.ruleScopePickerState.slotIds] : this.defaultDraftSlotIds()
    });
    this.cdr.markForCheck();
  }
  toggleRuleScopeDraftSlot(slotId, event) {
    event?.stopPropagation();
    if (!this.ruleScopePickerState || this.ruleScopePickerState.appliesTo !== "selected_slots") {
      return;
    }
    const normalizedSlotId = `${slotId}`.trim();
    if (!normalizedSlotId) {
      return;
    }
    const slotIds = new Set(this.ruleScopePickerState.slotIds);
    if (slotIds.has(normalizedSlotId)) {
      slotIds.delete(normalizedSlotId);
    } else {
      slotIds.add(normalizedSlotId);
    }
    this.ruleScopePickerState = __spreadProps(__spreadValues({}, this.ruleScopePickerState), {
      slotIds: [...slotIds]
    });
    this.cdr.markForCheck();
  }
  canApplyRuleScopeDraft() {
    if (!this.ruleScopePickerState) {
      return false;
    }
    return this.ruleScopePickerState.appliesTo === "all_slots" || this.ruleScopePickerState.slotIds.length > 0;
  }
  applyCurrentRuleScopeDraft(event) {
    event?.stopPropagation();
    const rule = this.currentRuleScopeRule();
    if (!rule || !this.ruleScopePickerState || !this.canApplyRuleScopeDraft()) {
      return;
    }
    rule.appliesTo = this.ruleScopePickerState.appliesTo;
    rule.slotIds = rule.appliesTo === "selected_slots" ? [...this.ruleScopePickerState.slotIds] : [];
    this.closeRuleScopePicker();
    this.emitPricing();
  }
  slotScopeWindowLabel(slot) {
    const start = this.formatSlotTime(slot.startAt);
    const end = this.formatSlotTime(slot.endAt);
    if (!start && !end) {
      return "Time follows this slot.";
    }
    if (!start) {
      return `Ends ${end}`;
    }
    if (!end) {
      return `Starts ${start}`;
    }
    return `${start} - ${end}`;
  }
  onEscape(event) {
    const keyboardEvent = event;
    if (!this.ruleScopePickerState && !this.wizardOpen) {
      return;
    }
    keyboardEvent.preventDefault();
    keyboardEvent.stopPropagation();
    if (this.ruleScopePickerState) {
      this.closeRuleScopePicker();
      return;
    }
    if (this.wizardOpen) {
      this.closeWizard();
    }
  }
  calculatePreviewState() {
    const normalized = this.normalizePricingWithCapabilities(this.workingPricing);
    const activeSlotOverride = normalized.slotPricingEnabled ? normalized.slotOverrides.find((item) => item.price !== null) ?? null : null;
    const previewSlotId = activeSlotOverride?.slotId ?? null;
    let runningPrice = activeSlotOverride?.price ?? normalized.basePrice;
    const basePrice = runningPrice;
    let quantityLabel = null;
    const quantityNotes = [];
    const demandNotes = [];
    const timeNotes = [];
    if (this.showQuantitySection() && normalized.quantityRulesEnabled && normalized.quantityRules.length > 0) {
      const previewQuantity = this.previewQuantityForRules(normalized.quantityRules);
      quantityLabel = `Quantity pricing (per ${previewQuantity} ${previewQuantity === 1 ? "item" : "items"})`;
      for (const rule of normalized.quantityRules) {
        if (!this.matchesQuantityRule(rule, previewQuantity)) {
          continue;
        }
        const nextPrice = this.applyRuleAction(runningPrice, rule.action);
        quantityNotes.push(this.describeQuantityRule(rule, previewQuantity));
        runningPrice = nextPrice;
      }
    }
    const priceAfterQuantity = runningPrice;
    if (this.showDemandSection() && normalized.demandRulesEnabled) {
      for (const rule of normalized.demandRules) {
        if (!this.matchesDemandRule(rule, 50, previewSlotId)) {
          continue;
        }
        const nextPrice = this.applyRuleAction(runningPrice, rule.action);
        demandNotes.push(this.describeDemandRule(rule));
        runningPrice = nextPrice;
      }
    }
    const priceAfterDemand = runningPrice;
    if (this.showTimeSection() && normalized.timeRulesEnabled) {
      for (const rule of normalized.timeRules) {
        if (!this.matchesTimeRule(rule, 72, previewSlotId)) {
          continue;
        }
        const nextPrice = this.applyRuleAction(runningPrice, rule.action);
        timeNotes.push(this.describeTimeRule(rule));
        runningPrice = nextPrice;
      }
    }
    const clamped = this.clampPrice(runningPrice);
    const finalPrice = this.applyRounding(clamped);
    return {
      basePrice,
      slotOverridePrice: activeSlotOverride?.price ?? null,
      quantityLabel,
      quantityDelta: priceAfterQuantity - basePrice,
      demandDelta: priceAfterDemand - priceAfterQuantity,
      timeDelta: clamped - priceAfterDemand,
      finalPrice,
      quantityNotes,
      demandNotes,
      timeNotes
    };
  }
  runtimePreviewState() {
    const preview = this.resolveConfigValue(this.config.runtimePreview, null);
    if (!preview) {
      return null;
    }
    const currency = `${preview.currency ?? this.workingPricing.currency ?? "USD"}`.trim() || "USD";
    const rows = (preview.rows ?? []).map((row) => ({
      key: `${row.key ?? row.label ?? "pricing"}`.trim() || "pricing",
      label: `${row.label ?? "Pricing"}`.trim() || "Pricing",
      detail: `${row.detail ?? ""}`.trim() || null,
      amount: Number.isFinite(row.amount) ? Number(row.amount) : null,
      currency: `${row.currency ?? currency}`.trim() || currency,
      multiplier: Number.isFinite(row.multiplier) ? Math.max(1, Math.trunc(Number(row.multiplier))) : null
    })).filter((row) => row.label);
    return {
      rows,
      totalAmount: Math.max(0, Number(preview.totalAmount) || 0),
      currency,
      emptyLabel: `${preview.emptyLabel ?? ""}`.trim() || null
    };
  }
  runtimeBaseAmount(preview) {
    return Math.max(0, Number(this.runtimeBaseRow(preview)?.amount) || 0);
  }
  runtimeBaseLabel(preview) {
    return this.i18n.translate(this.runtimeBaseRow(preview)?.label || this.pricingBaseSummaryLabel());
  }
  runtimeAdjustmentRows(preview) {
    const baseKey = this.runtimeBaseRow(preview)?.key ?? null;
    return preview.rows.filter((row) => row.key !== baseKey);
  }
  runtimePreviewCurrency(preview) {
    return `${preview.currency ?? this.workingPricing.currency ?? "USD"}`.trim() || "USD";
  }
  runtimeRowTrackId(index, row) {
    return `${row.key || row.label || "row"}-${index}`;
  }
  runtimeRowLabel(row) {
    const multiplier = Math.max(1, Math.trunc(Number(row.multiplier) || 1));
    const translatedLabel = this.i18n.translate(row.label);
    const label = row.detail ? `${translatedLabel} \xB7 ${row.detail}` : translatedLabel;
    return multiplier > 1 ? `${label} \xD7 ${multiplier}` : label;
  }
  runtimeRowAmount(row, fallbackCurrency) {
    if (!Number.isFinite(row.amount)) {
      return "";
    }
    const amount = Number(row.amount);
    return this.formatSignedMoneyForCurrency(amount, `${row.currency ?? fallbackCurrency}`.trim() || fallbackCurrency);
  }
  runtimeTotalLabel(preview) {
    return this.formatMoneyForCurrency(preview.totalAmount, this.runtimePreviewCurrency(preview));
  }
  runtimeMoneyLabel(amount, currency) {
    return this.formatMoneyForCurrency(amount, currency);
  }
  runtimeAssetBillingExplanation(preview) {
    if (this.resolvedConfig.context !== "asset" || preview.rows.length === 0) {
      return "";
    }
    const durationMultiplier = preview.rows.find((row) => row.key === "duration")?.multiplier ?? 1;
    const quantityMultiplier = preview.rows.find((row) => row.key === "quantity")?.multiplier ?? 1;
    const dailyRate = preview.rows.filter((row) => row.key !== "duration" && row.key !== "quantity").reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
    return this.i18n.translateParams("pricing.asset.billing.explanation", {
      rate: this.formatMoneyForCurrency(dailyRate, this.runtimePreviewCurrency(preview)),
      days: Math.max(1, durationMultiplier),
      quantity: Math.max(1, quantityMultiplier)
    });
  }
  previewExplanationLines() {
    const preview = this.calculatePreviewState();
    return [
      ...preview.slotOverridePrice !== null ? [`A slot override is active, so this preview starts from ${this.formatMoney(preview.slotOverridePrice)} instead of the global base price.`] : [],
      ...preview.quantityNotes,
      ...preview.demandNotes,
      ...preview.timeNotes
    ];
  }
  previewFallbackLines() {
    const lines = [];
    if (this.workingPricing.basePrice <= 0) {
      lines.push("The base price is still set to $0, so the current preview is showing a free entry.");
    } else {
      lines.push(`The preview is currently showing the base price of ${this.formatMoney(this.workingPricing.basePrice)}.`);
    }
    if (!this.isDynamicMode()) {
      lines.push("Pricing Mode is set to Fixed, so demand and time rules are not changing the amount yet.");
    } else {
      if (this.showDemandSection() && !this.workingPricing.demandRulesEnabled) {
        lines.push("Demand rules are available in this mode, but they are currently turned off.");
      }
      if (this.showTimeSection() && !this.workingPricing.timeRulesEnabled) {
        lines.push("Time rules are available in this mode, but they are currently turned off.");
      }
    }
    if (this.showQuantitySection() && !this.workingPricing.quantityRulesEnabled) {
      lines.push("Quantity rules are off, so buying multiple events uses the same base price per event.");
    }
    if (this.resolvedConfig.allowSlotFeatures) {
      if (this.resolvedConfig.slotCatalog.length === 0) {
        lines.push("Slot-specific pricing is unavailable until the event has at least one slot in the Slots section.");
      } else if (!this.workingPricing.slotPricingEnabled || this.workingPricing.slotOverrides.length === 0) {
        lines.push("Slot overrides are off, so every slot is still using the same main event price.");
      }
    }
    if (this.resolvedConfig.showAudienceSection && !this.workingPricing.audience.enabled) {
      lines.push("Audience pricing is off, so members, VIP guests, and promo codes are not changing the public price.");
    }
    if (this.showCancellationSection()) {
      if (!this.workingPricing.cancellationPolicy.enabled) {
        lines.push("Cancellation reimbursement is off, so leaving after booking will not follow a configured refund schedule yet.");
      } else if (this.workingPricing.cancellationPolicy.rules.length === 0) {
        lines.push("Cancellation reimbursement is on, but add at least one rule so the refund window is explicit.");
      }
    }
    return lines;
  }
  pricingSummaryItems() {
    const pricing = this.normalizePricingWithCapabilities(this.workingPricing);
    const items = [{
      id: "charge",
      label: "pricing.charge",
      value: this.chargeTypeLabel(pricing.chargeType),
      detail: this.priceBasisDetail(pricing)
    }];
    if (this.showQuantitySection() && pricing.quantityRulesEnabled && pricing.quantityRules.length > 0) {
      items.push({
        id: "quantity",
        label: "quantity",
        value: this.countLabel(pricing.quantityRules.length, "rule"),
        detail: pricing.quantityRules.map((rule) => this.quantityRuleSummary(rule)).join("; ")
      });
    }
    if (this.showDemandSection() && pricing.demandRulesEnabled && pricing.demandRules.length > 0) {
      pricing.demandRules.forEach((rule, index) => {
        items.push({
          id: `demand-${index}`,
          label: "pricing.demand.rules",
          value: this.compactActionLabel(rule.action),
          detail: this.demandRuleSummary(rule)
        });
      });
    }
    if (this.showTimeSection() && pricing.timeRulesEnabled && pricing.timeRules.length > 0) {
      pricing.timeRules.forEach((rule, index) => {
        items.push({
          id: `time-${index}`,
          label: "pricing.time.rules",
          value: this.compactActionLabel(rule.action),
          detail: this.timeRuleSummary(rule)
        });
      });
    }
    if (this.resolvedConfig.allowSlotFeatures && pricing.slotPricingEnabled) {
      const pricedOverrides = pricing.slotOverrides.filter((item) => item.price !== null);
      if (pricedOverrides.length > 0) {
        items.push({
          id: "slots",
          label: "event.editor.slots.title",
          value: this.countLabel(pricedOverrides.length, "override"),
          detail: pricedOverrides.slice(0, 2).map((item) => `${item.label}: ${this.formatMoney(item.price)}`).join("; ")
        });
      }
    }
    if (this.showCancellationSection()) {
      const policy = pricing.cancellationPolicy;
      if (policy.enabled && policy.rules.length > 0) {
        policy.rules.forEach((rule, index) => {
          items.push({
            id: `cancellation-${index}`,
            label: "pricing.cancellation",
            value: this.cancellationRefundLabel(rule),
            detail: this.cancellationWindowLabel(rule)
          });
        });
      } else {
        items.push({
          id: "cancellation",
          label: "pricing.cancellation",
          value: "off",
          detail: "pricing.no.reimbursement.schedule"
        });
      }
    }
    if (this.resolvedConfig.showAudienceSection && pricing.audience.enabled) {
      items.push({
        id: "audience",
        label: "pricing.audience",
        value: "active",
        detail: this.audienceSummary(pricing.audience)
      });
    }
    return items;
  }
  trackByRule(index, rule) {
    return rule.id || `rule-${index}`;
  }
  syncWorkingPricing() {
    this.priceBoundsInvalid = false;
    this.workingPricing = this.normalizePricingWithCapabilities(this.pricingValue);
    if (!this.editorLocked() && !this.currencyOptions.includes(this.workingPricing.currency)) {
      this.workingPricing.currency = PricingBuilder.createDefaultPricingConfig(this.resolvedConfig.context).currency;
    }
    this.currentPreview = this.calculatePreviewState();
    this.currentExplanationLines = this.previewExplanationLines();
    this.currentFallbackLines = this.previewFallbackLines();
  }
  emitPricing() {
    this.syncMode();
    this.workingPricing = this.normalizePricingWithCapabilities(this.workingPricing);
    this.currentPreview = this.calculatePreviewState();
    this.currentExplanationLines = this.previewExplanationLines();
    this.currentFallbackLines = this.previewFallbackLines();
    const nextPricing = PricingBuilder.clonePricingConfig(this.workingPricing);
    this.pricingValue = nextPricing;
    this.onModelChange(nextPricing);
    this.onModelTouched();
    this.afterPricingChange(nextPricing);
    this.cdr.markForCheck();
  }
  afterPricingChange(_nextPricing) {
  }
  syncMode() {
    const hasDemand = this.workingPricing.demandRulesEnabled;
    const hasTime = this.workingPricing.timeRulesEnabled;
    if (hasDemand && hasTime) {
      this.workingPricing.mode = "hybrid";
    } else if (hasDemand) {
      this.workingPricing.mode = "demand-based";
    } else if (hasTime) {
      this.workingPricing.mode = "time-based";
    } else {
      this.workingPricing.mode = "fixed";
    }
  }
  syncResolvedConfig() {
    const nextConfig = this.resolveConfig();
    const nextSignature = this.buildResolvedConfigSignature(nextConfig);
    if (nextSignature === this.resolvedConfigSignature) {
      return;
    }
    this.resolvedConfig = nextConfig;
    this.resolvedConfigSignature = nextSignature;
    if (!this.usesSummaryPopup()) {
      this.wizardOpen = false;
    }
    this.syncWorkingPricing();
  }
  resolveConfig() {
    const context = this.resolveConfigValue(this.config.context, "event");
    const allowSlotFeatures = this.resolveConfigValue(this.config.allowSlotFeatures, context === "event") ?? context === "event";
    return {
      context,
      presentation: this.resolveConfigValue(this.config.presentation, "inline"),
      slotCatalog: this.resolveConfigValue(this.config.slotCatalog, []),
      showAudienceSection: this.resolveConfigValue(this.config.showAudienceSection, context === "event") ?? context === "event",
      showPreview: this.resolveConfigValue(this.config.showPreview, true) ?? true,
      allowSlotFeatures,
      embedded: this.resolveConfigValue(this.config.embedded, false) === true,
      chargeTypeOptions: this.resolveChargeTypeOptions(context, allowSlotFeatures)
    };
  }
  resolveConfigValue(value, fallback) {
    if (typeof value === "function") {
      return value() ?? fallback;
    }
    return value ?? fallback;
  }
  buildResolvedConfigSignature(config) {
    return JSON.stringify({
      context: config.context,
      presentation: config.presentation,
      showAudienceSection: config.showAudienceSection,
      showPreview: config.showPreview,
      allowSlotFeatures: config.allowSlotFeatures,
      embedded: config.embedded,
      chargeTypeOptions: config.chargeTypeOptions,
      slotCatalog: config.slotCatalog.map((slot) => ({
        id: slot.id,
        label: slot.label,
        startAt: slot.startAt,
        endAt: slot.endAt
      }))
    });
  }
  resolveChargeTypeOptions(context, allowSlotFeatures) {
    const base = context === "asset" ? ["per_booking", "per_attendee"] : ["per_attendee", "per_booking"];
    if (allowSlotFeatures) {
      base.push("per_slot");
    }
    return base;
  }
  normalizePricingWithCapabilities(value) {
    return PricingBuilder.normalizePricingConfig(value, {
      context: this.resolvedConfig.context,
      slotCatalog: this.resolvedConfig.allowSlotFeatures ? this.resolvedConfig.slotCatalog : [],
      allowSlotFeatures: this.resolvedConfig.allowSlotFeatures,
      allowedChargeTypes: this.resolvedConfig.chargeTypeOptions,
      preserveEmptyPromoCodes: true,
      preservePriceBounds: true
    });
  }
  createDefaultDemandRule() {
    return {
      id: this.nextId("demand-rule"),
      operator: "gte",
      capacityFilledPercent: 50,
      action: {
        kind: "increase_percent",
        value: 10
      },
      appliesTo: "all_slots",
      slotIds: []
    };
  }
  createDefaultQuantityRule() {
    return {
      id: this.nextId("quantity-rule"),
      minQuantity: 5,
      action: {
        kind: "decrease_amount",
        value: 2
      }
    };
  }
  createDefaultTimeRule() {
    return {
      id: this.nextId("time-rule"),
      trigger: "days_before_start",
      offsetValue: 7,
      specificDateStart: null,
      specificDateEnd: null,
      action: {
        kind: "decrease_percent",
        value: 5
      },
      appliesTo: "all_slots",
      slotIds: []
    };
  }
  createDefaultCancellationRule() {
    return {
      id: this.nextId("cancellation-rule"),
      offsetUnit: "days",
      offsetValue: 7,
      refundKind: "percent",
      refundValue: 50
    };
  }
  nextId(prefix) {
    this.idSequence += 1;
    return `${prefix}-${Date.now()}-${this.idSequence}`;
  }
  nextOwnerId() {
    _PricingEditorInputComponent.ownerSequence += 1;
    return `pricing-editor-${Date.now()}-${_PricingEditorInputComponent.ownerSequence}`;
  }
  closeRuleScopePicker(event) {
    event?.stopPropagation();
    this.ruleScopePickerState = null;
    this.ruleScopeMenuSession = null;
    this.cdr.markForCheck();
  }
  prepareRuleScopeDraft(context) {
    const activeMenu = this.ruleScopeMenuDispatcher.activeMenu();
    const rule = this.ruleScopeRule(context.kind, context.ruleId);
    if (!activeMenu || !rule || activeMenu.id !== this.ruleScopeMenuId(context.kind, rule)) {
      return false;
    }
    if (this.ruleScopeMenuSession !== activeMenu || this.ruleScopePickerState?.kind !== context.kind || this.ruleScopePickerState.ruleId !== context.ruleId) {
      this.ruleScopePickerState = {
        kind: context.kind,
        ruleId: context.ruleId,
        appliesTo: rule.appliesTo,
        slotIds: [...rule.slotIds ?? []]
      };
      this.ruleScopeMenuSession = activeMenu;
    }
    return true;
  }
  currentRuleScopeRule() {
    const state = this.ruleScopePickerState;
    if (!state) {
      return null;
    }
    return this.ruleScopeRule(state.kind, state.ruleId);
  }
  ruleScopeRule(kind, ruleId) {
    const rules = kind === "demand" ? this.workingPricing.demandRules : this.workingPricing.timeRules;
    return rules.find((rule) => rule.id === ruleId) ?? null;
  }
  defaultDraftSlotIds() {
    const firstSlotId = `${this.resolvedConfig.slotCatalog[0]?.id ?? ""}`.trim();
    return firstSlotId ? [firstSlotId] : [];
  }
  slotLabelById(slotId) {
    const normalizedSlotId = `${slotId ?? ""}`.trim();
    if (!normalizedSlotId) {
      return "";
    }
    return this.resolvedConfig.slotCatalog.find((slot) => slot.id === normalizedSlotId)?.label ?? "";
  }
  formatSlotTime(value) {
    const raw = `${value ?? ""}`.trim();
    if (!raw) {
      return "";
    }
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) {
      return raw;
    }
    return parsed.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit"
    });
  }
  parseMoney(value) {
    if (value === "" || value === null || value === void 0) {
      return null;
    }
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return null;
    }
    return Math.max(0, Math.round(parsed * 100) / 100);
  }
  parsePercent(value) {
    const parsed = this.parseMoney(value);
    if (parsed === null) {
      return null;
    }
    return Math.max(0, Math.min(100, parsed));
  }
  parseInteger(value) {
    if (value === "" || value === null || value === void 0) {
      return null;
    }
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return null;
    }
    return Math.max(0, Math.trunc(parsed));
  }
  matchesDemandRule(rule, capacityFilledPercent, activeSlotId) {
    if (rule.appliesTo === "selected_slots") {
      if (!activeSlotId || !rule.slotIds.includes(activeSlotId)) {
        return false;
      }
    }
    if (rule.operator === "lte") {
      return capacityFilledPercent <= rule.capacityFilledPercent;
    }
    return capacityFilledPercent >= rule.capacityFilledPercent;
  }
  matchesQuantityRule(rule, quantity) {
    return Math.max(1, Math.trunc(Number(quantity) || 1)) >= Math.max(1, Math.trunc(Number(rule.minQuantity) || 1));
  }
  matchesTimeRule(rule, hoursUntilStart, activeSlotId) {
    if (rule.appliesTo === "selected_slots") {
      if (!activeSlotId || !rule.slotIds.includes(activeSlotId)) {
        return false;
      }
    }
    if (rule.trigger === "specific_date") {
      const start = `${rule.specificDateStart ?? ""}`.trim();
      const end = `${rule.specificDateEnd ?? ""}`.trim();
      if (!start || !end) {
        return false;
      }
      const today = /* @__PURE__ */ new Date();
      const normalizedToday = `${today.getFullYear()}-${`${today.getMonth() + 1}`.padStart(2, "0")}-${`${today.getDate()}`.padStart(2, "0")}`;
      return normalizedToday >= start && normalizedToday <= end;
    }
    const offset = Math.max(0, Math.trunc(Number(rule.offsetValue) || 0));
    if (rule.trigger === "hours_before_start") {
      return hoursUntilStart <= offset;
    }
    return hoursUntilStart <= offset * 24;
  }
  applyRuleAction(price, action) {
    const value = Math.max(0, Number(action.value) || 0);
    switch (action.kind) {
      case "decrease_percent":
        return Math.max(0, price - price * value / 100);
      case "increase_amount":
        return price + value;
      case "decrease_amount":
        return Math.max(0, price - value);
      case "set_exact_price":
        return value;
      default:
        return price + price * value / 100;
    }
  }
  clampPrice(price) {
    const min = this.workingPricing.minPrice;
    const max = this.workingPricing.maxPrice;
    let nextPrice = price;
    if (min !== null) {
      nextPrice = Math.max(min, nextPrice);
    }
    if (max !== null) {
      nextPrice = Math.min(max, nextPrice);
    }
    return Math.max(0, nextPrice);
  }
  applyRounding(price) {
    switch (this.workingPricing.rounding) {
      case "whole":
        return Math.round(price);
      case "half":
        return Math.round(price * 2) / 2;
      default:
        return Math.round(price * 100) / 100;
    }
  }
  describeDemandRule(rule) {
    return `Demand rule active: when capacity filled is ${rule.operator === "lte" ? "<=" : ">="} ${rule.capacityFilledPercent}%, ${this.describeAction(rule.action)}${this.describeRuleScope(rule)}.`;
  }
  describeQuantityRule(rule, previewQuantity) {
    const minQuantity = Math.max(1, Math.trunc(Number(rule.minQuantity) || 1));
    return `Quantity rule active: previewing ${previewQuantity} events, and quantity >= ${minQuantity}, ${this.describeAction(rule.action)}.`;
  }
  describeTimeRule(rule) {
    if (rule.trigger === "specific_date") {
      const start = `${rule.specificDateStart ?? ""}`.trim();
      const end = `${rule.specificDateEnd ?? ""}`.trim();
      const rangeLabel = start && end ? start === end ? start : `${start} - ${end}` : "the selected range";
      return `Time rule active: during ${rangeLabel}, ${this.describeAction(rule.action)}${this.describeRuleScope(rule)}.`;
    }
    const offset = Math.max(0, Math.trunc(Number(rule.offsetValue) || 0));
    const triggerText = rule.trigger === "hours_before_start" ? `${offset} hours before the event starts` : `${offset} days before the event starts`;
    return `Time rule active: ${triggerText}, ${this.describeAction(rule.action)}${this.describeRuleScope(rule)}.`;
  }
  formatMoney(value) {
    return this.formatMoneyForCurrency(Math.max(0, Number(value) || 0), this.workingPricing.currency || "USD");
  }
  formatSignedMoneyForCurrency(value, currency) {
    const sign = value > 0 ? "+" : value < 0 ? "-" : "";
    return `${sign}${this.formatMoneyForCurrency(Math.abs(value), currency)}`;
  }
  formatMoneyForCurrency(value, currency) {
    const amount = Math.max(0, Number(value) || 0);
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: currency === "CZK" ? 0 : 2
      }).format(amount);
    } catch {
      return `${this.currencySymbol(currency)}${amount.toFixed(2)}`;
    }
  }
  runtimeBaseRow(preview) {
    return preview.rows.find((row) => {
      const key = `${row.key ?? ""}`.trim().toLowerCase();
      const label = `${row.label ?? ""}`.trim().toLowerCase();
      return key.startsWith("base") || label.includes("base");
    }) ?? null;
  }
  describeAction(action) {
    const value = Math.max(0, Number(action.value) || 0);
    switch (action.kind) {
      case "decrease_percent":
        return `the price decreases by ${value}%`;
      case "increase_amount":
        return `the price increases by ${this.formatMoney(value)}`;
      case "decrease_amount":
        return `the price decreases by ${this.formatMoney(value)}`;
      case "set_exact_price":
        return `the price is set to ${this.formatMoney(value)}`;
      default:
        return `the price increases by ${value}%`;
    }
  }
  describeRuleScope(rule) {
    if (rule.appliesTo !== "selected_slots") {
      return " for all slots";
    }
    if ((rule.slotIds?.length ?? 0) === 0) {
      return " for the selected slots";
    }
    if (rule.slotIds.length === 1) {
      return ` for ${this.slotLabelById(rule.slotIds[0]) || "the selected slot"}`;
    }
    return ` for ${rule.slotIds.length} selected slots`;
  }
  previewQuantityForRules(rules) {
    const quantities = rules.map((rule) => Math.max(1, Math.trunc(Number(rule.minQuantity) || 1))).filter((quantity) => quantity > 1);
    return quantities.length > 0 ? Math.min(...quantities) : 5;
  }
  priceBasisDetail(pricing) {
    const parts = [
      this.i18n.translate(pricing.taxMode === "included" ? "pricing.tax.included.summary" : "pricing.tax.excluded.summary"),
      this.i18n.translate(this.roundingLabel(pricing.rounding))
    ];
    if (pricing.minPrice !== null || pricing.maxPrice !== null) {
      parts.push([
        pricing.minPrice !== null ? `min ${this.formatMoney(pricing.minPrice)}` : "",
        pricing.maxPrice !== null ? `max ${this.formatMoney(pricing.maxPrice)}` : ""
      ].filter(Boolean).join(" \xB7 "));
    }
    return parts.filter(Boolean).join(" \xB7 ");
  }
  quantityRuleSummary(rule) {
    const quantity = Math.max(1, Math.trunc(Number(rule.minQuantity) || 1));
    return `${quantity}+ items: ${this.compactActionLabel(rule.action)} each`;
  }
  demandRuleSummary(rule) {
    return this.i18n.translateParams("pricing.summary.demand.rule", {
      operator: this.operatorLabel(rule.operator),
      value: Math.max(0, Number(rule.capacityFilledPercent) || 0)
    });
  }
  timeRuleSummary(rule) {
    if (rule.trigger === "specific_date") {
      return this.i18n.translateParams("pricing.summary.time.date.rule", {
        start: rule.specificDateStart || "\u2014",
        end: rule.specificDateEnd || "\u2014"
      });
    }
    const value = Math.max(0, Math.trunc(Number(rule.offsetValue) || 0));
    return this.i18n.translateParams(rule.trigger === "hours_before_start" ? "pricing.summary.time.hours.rule" : "pricing.summary.time.days.rule", { value });
  }
  compactActionLabel(action) {
    const value = Math.max(0, Number(action.value) || 0);
    switch (action.kind) {
      case "decrease_percent":
        return `-${value}%`;
      case "increase_amount":
        return `+${this.formatMoney(value)}`;
      case "decrease_amount":
        return `-${this.formatMoney(value)}`;
      case "set_exact_price":
        return this.formatMoney(value);
      default:
        return `+${value}%`;
    }
  }
  cancellationWindowLabel(rule) {
    const value = Math.max(0, Math.trunc(Number(rule.offsetValue) || 0));
    const unitKey = rule.offsetUnit === "hours" ? value === 1 ? "asset.borrow.unit.hour" : "asset.borrow.unit.hours" : rule.offsetUnit === "weeks" ? value === 1 ? "asset.borrow.unit.week" : "asset.borrow.unit.weeks" : rule.offsetUnit === "months" ? value === 1 ? "asset.borrow.unit.month" : "asset.borrow.unit.months" : value === 1 ? "asset.borrow.unit.day" : "asset.borrow.unit.days";
    return this.i18n.translateParams("asset.borrow.cancellation.window", {
      value,
      unit: this.i18n.translate(unitKey)
    });
  }
  cancellationRefundLabel(rule) {
    if (rule.refundKind === "full") {
      return this.i18n.translate("full.refund");
    }
    if (rule.refundKind === "none") {
      return this.i18n.translate("no.refund");
    }
    if (rule.refundKind === "fixed_amount") {
      return this.i18n.translateParams("pricing.summary.refund.fixed", {
        amount: this.formatMoney(rule.refundValue)
      });
    }
    return this.i18n.translateParams("asset.borrow.refund.percent", {
      percent: Math.max(0, Number(rule.refundValue) || 0)
    });
  }
  audienceSummary(audience) {
    const parts = [
      audience.memberPrice !== null ? this.i18n.translateParams("pricing.audience.member.summary", { price: this.formatMoney(audience.memberPrice) }) : "",
      audience.vipPrice !== null ? this.i18n.translateParams("pricing.audience.vip.summary", { price: this.formatMoney(audience.vipPrice) }) : "",
      audience.inviteOnlyDiscountPercent !== null ? this.i18n.translateParams("pricing.audience.invite.summary", { percent: audience.inviteOnlyDiscountPercent }) : "",
      audience.promoCodes.length > 0 ? this.countLabel(audience.promoCodes.length, "promo") : ""
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(" \xB7 ") : audience.soldOutLabel;
  }
  countLabel(count, singular) {
    const normalized = Math.max(0, Math.trunc(Number(count) || 0));
    return this.i18n.translateParams(`pricing.summary.${singular}.${normalized === 1 ? "one" : "many"}`, { count: normalized });
  }
  isoDateToDate(value) {
    const normalized = `${value ?? ""}`.trim();
    if (!normalized) {
      return null;
    }
    const parsed = /* @__PURE__ */ new Date(`${normalized}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  dateToIsoDate(value) {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      return null;
    }
    const year = value.getFullYear();
    const month = `${value.getMonth() + 1}`.padStart(2, "0");
    const day = `${value.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  static \u0275fac = function PricingEditorInputComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PricingEditorInputComponent)(\u0275\u0275directiveInject(ChangeDetectorRef));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PricingEditorInputComponent, selectors: [["app-pricing-editor-input"]], viewQuery: function PricingEditorInputComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c02, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.pricingMaximumInput = _t.first);
    }
  }, hostBindings: function PricingEditorInputComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("keydown.escape", function PricingEditorInputComponent_keydown_escape_HostBindingHandler($event) {
        return ctx.onEscape($event);
      }, \u0275\u0275resolveDocument);
    }
  }, inputs: { config: "config", readOnly: "readOnly", disabled: "disabled" }, features: [\u0275\u0275ProvidersFeature([
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => _PricingEditorInputComponent),
      multi: true
    },
    AppMenuDispatcher
  ]), \u0275\u0275NgOnChangesFeature], decls: 7, vars: 3, consts: [["pricingEditorSurfaces", ""], ["pricingPreviewCards", ""], ["pricingMaximumInput", ""], ["timeRuleRangePicker", ""], [1, "pricing-editor", 3, "pricing-editor--readonly", "pricing-editor--summary-popup", "pricing-editor--wizard-open", "pricing-editor--enabled", "pricing-editor--embedded"], [3, "itemSelect", "items"], [1, "pricing-editor"], [1, "pricing-editor__head"], [1, "pricing-editor__layout"], [1, "pricing-editor__title"], [1, "pricing-editor__title-copy"], [1, "pricing-editor__title-text"], [1, "pricing-editor__subtitle"], [1, "pricing-editor__head-actions"], ["type", "button", 1, "pricing-editor__toggle", "pricing-editor__toggle--header", 3, "click", "disabled"], [1, "pricing-editor__summary-actions"], [1, "pricing-editor__preview", "pricing-editor__preview--summary"], ["type", "button", 1, "pricing-editor__open-btn", "pricing-editor__open-btn--summary", 3, "click"], [3, "ngTemplateOutlet"], [1, "pricing-editor__main"], [1, "pricing-editor__preview"], [4, "ngComponentOutlet", "ngComponentOutletInputs"], [1, "pricing-editor__surface"], [1, "pricing-editor__grid"], [1, "pricing-editor__field", "pricing-editor__field--money"], [1, "pricing-editor__money-field"], [1, "pricing-editor__money-prefix"], ["type", "number", "min", "0", "step", "0.01", 3, "input", "ngModelChange", "ngModel", "disabled"], [1, "pricing-editor__money-code"], [1, "pricing-editor__field"], [1, "pricing-editor__select-shell"], ["disableOptionCentering", "", "panelClass", "selector-options-panel profile-bottom-sheet-panel", 3, "ngModelChange", "ngModel", "disabled", "panelWidth"], [3, "value"], ["type", "number", "min", "0", "step", "0.01", 3, "input", "ngModelChange", "blur", "ngModel", "disabled", "placeholder"], ["role", "alert", 1, "pricing-editor__field-error"], [3, "enabled", "overrides", "slotCatalog", "currency", "readOnly"], [1, "pricing-editor__section-head"], ["type", "button", 1, "pricing-editor__toggle", 3, "is-on", "disabled"], [1, "pricing-editor__hint"], ["type", "button", 1, "pricing-editor__toggle", 3, "click", "disabled"], [1, "pricing-editor__rules"], [1, "pricing-editor__rule-card"], ["type", "button", 1, "pricing-editor__add-btn", 3, "click", "disabled"], [1, "pricing-editor__rule-grid"], [1, "pricing-editor__select-shell", "pricing-editor__select-shell--static"], ["type", "number", "min", "1", "step", "1", 3, "input", "ngModelChange", "ngModel", "disabled"], ["type", "button", 1, "pricing-editor__rule-remove", 3, "click", "disabled"], ["type", "number", "min", "0", "max", "100", "step", "1", 3, "input", "ngModelChange", "ngModel", "disabled"], ["kind", "select", 3, "menuId", "title", "trigger", "items", "closeOnSelect"], [1, "pricing-editor__field", "pricing-editor__field--time-trigger"], [1, "pricing-editor__field", "pricing-editor__field--span-full"], [1, "pricing-editor__field", "pricing-editor__field--time-offset"], [1, "pricing-editor__field", "pricing-editor__field--time-action"], [1, "pricing-editor__field", "pricing-editor__field--time-value"], ["appearance", "outline", "subscriptSizing", "dynamic", 1, "pricing-editor__date-range-field"], [3, "rangePicker"], ["matStartDate", "", 3, "dateChange", "value", "disabled", "placeholder"], ["matEndDate", "", 3, "dateChange", "value", "disabled", "placeholder"], ["matSuffix", "", 3, "for"], ["type", "number", "min", "0", "step", "1", 3, "input", "ngModelChange", "ngModel", "disabled"], [1, "pricing-editor__grid", "pricing-editor__grid--compact"], ["type", "number", "min", "0", 3, "step", "ngModel", "disabled"], ["type", "text", "disabled", "", 3, "value"], ["type", "number", "min", "0", 3, "input", "ngModelChange", "step", "ngModel", "disabled"], [3, "enabledChange", "overridesChange", "enabled", "overrides", "slotCatalog", "currency", "readOnly"], [1, "pricing-editor__promo-list"], [1, "pricing-editor__promo-card"], ["type", "text", "placeholder", "EARLY", 3, "ngModelChange", "ngModel", "disabled"], [1, "pricing-editor__preview-card"], [1, "pricing-editor__preview-head"], [1, "pricing-editor__preview-line"], [1, "pricing-editor__preview-note"], [1, "pricing-editor__preview-note", "pricing-editor__preview-note--billing"], [1, "pricing-editor__preview-total"], [3, "positive", "negative"], [1, "pricing-editor__preview-details"], [1, "pricing-editor__preview-detail"]], template: function PricingEditorInputComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, PricingEditorInputComponent_Conditional_0_Template, 4, 12, "section", 4);
      \u0275\u0275conditionalCreate(1, PricingEditorInputComponent_Conditional_1_Template, 1, 2, "ng-container");
      \u0275\u0275template(2, PricingEditorInputComponent_ng_template_2_Template, 74, 59, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementStart(4, "app-menu-outlet", 5);
      \u0275\u0275listener("itemSelect", function PricingEditorInputComponent_Template_app_menu_outlet_itemSelect_4_listener($event) {
        return ctx.onRuleScopeMenuSelect($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275template(5, PricingEditorInputComponent_ng_template_5_Template, 9, 4, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
    }
    if (rf & 2) {
      let tmp_3_0;
      \u0275\u0275conditional(ctx.showPricingPanel() ? 0 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_3_0 = ctx.pricingEditorPopupComponent()) ? 1 : -1, tmp_3_0);
      \u0275\u0275advance(3);
      \u0275\u0275property("items", ctx.activeRuleScopeMenuItems());
    }
  }, dependencies: [
    CommonModule,
    NgComponentOutlet,
    NgTemplateOutlet,
    FormsModule,
    DefaultValueAccessor,
    NumberValueAccessor,
    NgControlStatus,
    MinValidator,
    MaxValidator,
    NgModel,
    MatDatepickerModule,
    MatDatepickerToggle,
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
    MatNativeDateModule,
    MatSelectModule,
    MatSelect,
    MatOption,
    AppMenuOutletComponent,
    AppMenuTriggerComponent,
    PricingSlotPanelComponent,
    DecimalPipe,
    I18nPipe
  ], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n  container-type: inline-size;\n  min-width: 0;\n}\n.pricing-editor[_ngcontent-%COMP%] {\n  display: grid;\n  min-width: 0;\n  gap: 1rem;\n  padding: 1rem;\n  border-radius: 24px;\n  border: 1px solid rgba(143, 168, 201, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.97) 0%,\n      rgba(245, 249, 255, 0.94) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(113, 193, 177, 0.12),\n      transparent 34%),\n    radial-gradient(\n      circle at bottom left,\n      rgba(135, 175, 226, 0.12),\n      transparent 42%);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 18px 42px rgba(32, 57, 92, 0.08);\n}\n.pricing-editor--summary-popup[_ngcontent-%COMP%] {\n  gap: 0.62rem;\n  padding: 0.62rem 0.72rem;\n  border-radius: 16px;\n  border-color: rgba(109, 149, 143, 0.24);\n}\n.pricing-editor--summary-popup.pricing-editor--enabled[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(241, 250, 247, 0.97) 0%,\n      rgba(231, 243, 239, 0.94) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(117, 194, 169, 0.18),\n      transparent 34%),\n    radial-gradient(\n      circle at bottom left,\n      rgba(125, 170, 221, 0.14),\n      transparent 42%);\n}\n.pricing-editor--summary-popup[_ngcontent-%COMP%]:not(.pricing-editor--enabled) {\n  border-color: rgba(128, 147, 175, 0.22);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(247, 250, 254, 0.97) 0%,\n      rgba(237, 243, 249, 0.94) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(146, 165, 194, 0.1),\n      transparent 36%);\n}\n.pricing-editor--embedded[_ngcontent-%COMP%] {\n  height: 100%;\n  min-height: 0;\n  padding: 0;\n  border: 0;\n  border-radius: 0;\n  background: transparent;\n  box-shadow: none;\n  overflow: hidden;\n}\n.pricing-editor--summary-popup.pricing-editor--enabled[_ngcontent-%COMP%]   .pricing-editor__title-text[_ngcontent-%COMP%], \n.pricing-editor--summary-popup.pricing-editor--enabled[_ngcontent-%COMP%]   .pricing-editor__title-text[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #235d53;\n}\n.pricing-editor--summary-popup.pricing-editor--enabled[_ngcontent-%COMP%]   .pricing-editor__preview-card[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.94) 0%,\n      rgba(245, 251, 248, 0.9) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(118, 198, 175, 0.14),\n      transparent 44%);\n}\n.pricing-editor--summary-popup.pricing-editor--enabled[_ngcontent-%COMP%]   .pricing-editor__preview-card--light[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.94) 0%,\n      rgba(247, 251, 250, 0.9) 100%),\n    radial-gradient(\n      circle at bottom left,\n      rgba(133, 176, 227, 0.1),\n      transparent 48%);\n}\n.pricing-editor__head[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: start;\n  gap: 0.75rem;\n}\n.pricing-editor--summary-popup[_ngcontent-%COMP%]   .pricing-editor__head[_ngcontent-%COMP%] {\n  gap: 0.62rem;\n}\n.pricing-editor__head-actions[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.7rem;\n  flex-wrap: wrap;\n  justify-self: end;\n  align-self: start;\n}\n.pricing-editor--summary-popup[_ngcontent-%COMP%]   .pricing-editor__head-actions[_ngcontent-%COMP%] {\n  gap: 0.5rem;\n}\n.pricing-editor__title[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.pricing-editor__title-copy[_ngcontent-%COMP%] {\n  display: grid;\n  min-width: 0;\n}\n.pricing-editor__title-text[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n  color: #213a5b;\n  font-size: 1rem;\n  font-weight: 800;\n}\n.pricing-editor__title-text[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.pricing-editor__subtitle[_ngcontent-%COMP%] {\n  color: rgba(37, 58, 88, 0.74);\n  font-size: 0.8rem;\n  line-height: 1.4;\n}\n.pricing-editor__status[_ngcontent-%COMP%], \n.pricing-editor__toggle[_ngcontent-%COMP%], \n.pricing-editor__add-btn[_ngcontent-%COMP%], \n.pricing-editor__rule-remove[_ngcontent-%COMP%], \n.pricing-editor__open-btn[_ngcontent-%COMP%] {\n  border: 0;\n  transition:\n    transform 0.18s ease,\n    box-shadow 0.18s ease,\n    background-color 0.18s ease,\n    opacity 0.18s ease;\n}\n.pricing-editor__status[_ngcontent-%COMP%], \n.pricing-editor__toggle[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.4rem;\n  padding: 0.36rem 0.64rem;\n  border-radius: 999px;\n  font-size: 0.84rem;\n  font-weight: 800;\n}\n.pricing-editor__status[_ngcontent-%COMP%] {\n  color: #61748d;\n  background: rgba(239, 244, 251, 0.95);\n  box-shadow: inset 0 0 0 1px rgba(128, 149, 176, 0.24);\n}\n.pricing-editor__status.is-dynamic[_ngcontent-%COMP%], \n.pricing-editor__toggle.is-on[_ngcontent-%COMP%] {\n  color: #23695f;\n  background: rgba(230, 247, 241, 0.95);\n  box-shadow: inset 0 0 0 1px rgba(85, 175, 147, 0.24);\n}\n.pricing-editor__toggle[_ngcontent-%COMP%] {\n  cursor: pointer;\n  color: #61748d;\n  background: rgba(239, 244, 251, 0.95);\n  border: 1px solid rgba(128, 149, 176, 0.24);\n  box-shadow: inset 0 0 0 0 rgba(0, 0, 0, 0);\n}\n.pricing-editor__toggle--header[_ngcontent-%COMP%] {\n  min-width: 82px;\n  min-height: 38px;\n  padding: 0.3rem 0.62rem;\n  border-radius: 999px;\n  font-size: 0.76rem;\n  font-weight: 800;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n  box-shadow: 0 2px 7px rgba(29, 53, 86, 0.08);\n}\n.pricing-editor__toggle--header.is-on[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf8ee 0%,\n      #ddf1e2 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.pricing-editor__toggle--header[_ngcontent-%COMP%]:not(.is-on) {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f7fb 0%,\n      #e9eff7 100%);\n  border-color: rgba(86, 108, 145, 0.22);\n  color: #5b6e8e;\n}\n.pricing-editor__toggle[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%], \n.pricing-editor__status[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 24px;\n  height: 24px;\n  font-size: 24px;\n}\n.pricing-editor__toggle--header[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.pricing-editor__open-btn[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.5rem;\n  min-height: 40px;\n  padding: 0.62rem 0.9rem;\n  border-radius: 14px;\n  color: #214863;\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #eff6ff 100%);\n  box-shadow: inset 0 0 0 1px rgba(99, 137, 184, 0.26), 0 10px 22px rgba(31, 58, 97, 0.08);\n  cursor: pointer;\n  font-size: 0.86rem;\n  font-weight: 800;\n}\n.pricing-editor__open-btn[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.pricing-editor__summary-copy[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.35rem;\n}\n.pricing-editor__summary-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-start;\n}\n.pricing-editor__open-btn--summary[_ngcontent-%COMP%] {\n  min-width: 138px;\n  min-height: 38px;\n  padding: 0.42rem 0.82rem;\n  border-radius: 999px;\n  font-size: 0.8rem;\n  box-shadow: 0 2px 7px rgba(29, 53, 86, 0.08);\n}\n.pricing-editor__layout[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(240px, 300px);\n  gap: 1rem;\n  align-items: start;\n}\n.pricing-editor--embedded[_ngcontent-%COMP%]   .pricing-editor__layout[_ngcontent-%COMP%] {\n  height: 100%;\n  min-height: 0;\n  overflow-y: auto;\n  overflow-x: hidden;\n  padding: 0.12rem 0 0.8rem;\n  box-sizing: border-box;\n  scrollbar-width: thin;\n  scrollbar-color: #8aa0b8 #eaf1fa;\n}\n.pricing-editor__main[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.92rem;\n}\n.pricing-editor__surface[_ngcontent-%COMP%] {\n  display: grid;\n  position: relative;\n  z-index: 0;\n  gap: 0.86rem;\n  padding: 1rem;\n  border-radius: 20px;\n  border: 1px solid rgba(136, 161, 195, 0.28);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.98) 0%,\n      rgba(250, 252, 255, 0.94) 100%),\n    radial-gradient(\n      circle at top left,\n      rgba(127, 174, 227, 0.1),\n      transparent 46%);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);\n  contain: layout;\n  transform: translateZ(0);\n  backface-visibility: hidden;\n}\n.pricing-editor__section-head[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.8rem;\n  color: #1f3b5a;\n  font-size: 0.95rem;\n  font-weight: 900;\n}\n.pricing-editor__section-head[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.pricing-editor__section-head[_ngcontent-%COMP%]   .pricing-editor__toggle[_ngcontent-%COMP%] {\n  justify-self: end;\n}\n.pricing-editor__toggle[_ngcontent-%COMP%]:disabled {\n  cursor: default;\n  opacity: 0.66;\n  pointer-events: none;\n  filter: saturate(0.66);\n  box-shadow: none;\n}\n.pricing-editor__add-btn[_ngcontent-%COMP%]:disabled, \n.pricing-editor__rule-remove[_ngcontent-%COMP%]:disabled, \n.pricing-editor__open-btn[_ngcontent-%COMP%]:disabled {\n  cursor: default;\n  opacity: 0.58;\n  pointer-events: none;\n  filter: grayscale(0.35);\n  box-shadow: none;\n}\n.pricing-editor--readonly[_ngcontent-%COMP%]   .pricing-editor__summary-actions[_ngcontent-%COMP%] {\n  display: none;\n}\n.popup-panel-event-editor-readonly[_nghost-%COMP%]   .pricing-editor__summary-actions[_ngcontent-%COMP%], .popup-panel-event-editor-readonly   [_nghost-%COMP%]   .pricing-editor__summary-actions[_ngcontent-%COMP%] {\n  display: none;\n}\n.popup-panel-event-editor-readonly[_nghost-%COMP%]   .pricing-editor__toggle[_ngcontent-%COMP%], .popup-panel-event-editor-readonly   [_nghost-%COMP%]   .pricing-editor__toggle[_ngcontent-%COMP%], \n.popup-panel-event-editor-readonly[_nghost-%COMP%]   .pricing-editor__add-btn[_ngcontent-%COMP%], .popup-panel-event-editor-readonly   [_nghost-%COMP%]   .pricing-editor__add-btn[_ngcontent-%COMP%], \n.popup-panel-event-editor-readonly[_nghost-%COMP%]   .pricing-editor__rule-remove[_ngcontent-%COMP%], .popup-panel-event-editor-readonly   [_nghost-%COMP%]   .pricing-editor__rule-remove[_ngcontent-%COMP%], \n.popup-panel-event-editor-readonly[_nghost-%COMP%]   .pricing-editor__open-btn[_ngcontent-%COMP%], .popup-panel-event-editor-readonly   [_nghost-%COMP%]   .pricing-editor__open-btn[_ngcontent-%COMP%] {\n  cursor: default;\n  opacity: 0.58;\n  pointer-events: none;\n  filter: grayscale(0.35);\n  box-shadow: none;\n}\n.popup-panel-event-editor-readonly[_nghost-%COMP%]   .pricing-editor__toggle[_ngcontent-%COMP%], .popup-panel-event-editor-readonly   [_nghost-%COMP%]   .pricing-editor__toggle[_ngcontent-%COMP%] {\n  opacity: 0.66;\n  filter: saturate(0.66);\n}\n.pricing-editor__grid[_ngcontent-%COMP%], \n.pricing-editor__rule-grid[_ngcontent-%COMP%], \n.pricing-editor__promo-card[_ngcontent-%COMP%] {\n  display: grid;\n  column-gap: 1rem;\n  row-gap: 1rem;\n}\n.pricing-editor__grid[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));\n}\n.pricing-editor__rule-grid[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));\n}\n.pricing-editor__rule-grid.pricing-editor__rule-grid--slots[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 190px), 1fr));\n}\n.pricing-editor__rule-grid--time[_ngcontent-%COMP%]:not(.pricing-editor__rule-grid--slots) {\n  grid-template-columns: minmax(260px, 1.55fr) minmax(82px, 0.48fr) minmax(210px, 1.2fr) minmax(92px, 0.52fr);\n}\n.pricing-editor__rule-grid--time.pricing-editor__rule-grid--slots[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(230px, 1.5fr) minmax(78px, 0.46fr) minmax(195px, 1.18fr) minmax(88px, 0.5fr) minmax(150px, 0.9fr);\n}\n.pricing-editor__rule-grid--time[_ngcontent-%COMP%]   .pricing-editor__field--time-trigger[_ngcontent-%COMP%], \n.pricing-editor__rule-grid--time[_ngcontent-%COMP%]   .pricing-editor__field--time-action[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.pricing-editor__rule-grid--time[_ngcontent-%COMP%]   .pricing-editor__field--time-offset[_ngcontent-%COMP%], \n.pricing-editor__rule-grid--time[_ngcontent-%COMP%]   .pricing-editor__field--time-value[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.pricing-editor__promo-card[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));\n}\n.pricing-editor__grid--compact[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));\n}\n.pricing-editor__field[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.34rem;\n  min-width: 0;\n}\n.pricing-editor__field--span-full[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.pricing-editor__field[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  color: rgba(31, 57, 88, 0.9);\n  font-size: 0.74rem;\n  font-weight: 800;\n  letter-spacing: 0.01em;\n  text-transform: uppercase;\n}\n.pricing-editor__field[_ngcontent-%COMP%]    > .pricing-editor__field-error[_ngcontent-%COMP%] {\n  color: #9b3447;\n  text-transform: none;\n}\n.pricing-editor__field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.pricing-editor__select-shell[_ngcontent-%COMP%], \n.pricing-editor__money-field[_ngcontent-%COMP%], \n.pricing-editor__date-range-field[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  width: 100%;\n  min-height: 46px;\n  border-radius: 14px;\n  border: 1px solid rgba(126, 149, 180, 0.28);\n  background: rgba(255, 255, 255, 0.98);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92);\n}\n.pricing-editor__field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  width: 100%;\n  min-width: 0;\n  text-align: center;\n  color: #213d5d;\n  font: inherit;\n  font-size: 0.96rem;\n  font-weight: 700;\n}\n.pricing-editor__field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: rgba(72, 125, 194, 0.66);\n  box-shadow: 0 0 0 3px rgba(89, 136, 204, 0.12);\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  min-height: 0;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  box-shadow: none;\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-mdc-text-field-wrapper {\n  display: flex;\n  align-items: center;\n  min-height: 46px;\n  height: 46px;\n  padding: 0 0.08rem 0 0.42rem;\n  border-radius: 14px;\n  background: rgba(255, 255, 255, 0.98);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92);\n  overflow: visible;\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-mdc-form-field-flex, \n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-date-range-input-container {\n  min-height: 46px;\n  height: 46px;\n  align-items: center;\n  min-width: 0;\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-date-range-input-container {\n  width: 100%;\n  display: flex;\n  align-items: center;\n  gap: 0.08rem;\n  overflow: visible;\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-mdc-form-field-infix {\n  width: auto !important;\n  min-width: 0;\n  min-height: 0;\n  height: 46px;\n  padding: 0;\n  flex: 1 1 auto;\n  display: flex;\n  align-items: center;\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-date-range-input-separator {\n  color: rgba(64, 87, 117, 0.72);\n  padding: 0 0.02rem;\n  margin: 0;\n  white-space: nowrap;\n  flex: 0 0 auto;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  line-height: 46px;\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mdc-notched-outline__leading, \n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mdc-notched-outline__notch, \n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mdc-notched-outline__trailing {\n  border-color: rgba(126, 149, 180, 0.28);\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-mdc-form-field-subscript-wrapper {\n  display: none;\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-date-range-input-wrapper, \n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-date-range-input-start-wrapper, \n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-date-range-input-end-wrapper {\n  display: flex;\n  align-items: center;\n  flex: 1 1 0;\n  min-width: 0;\n  width: 100%;\n  max-width: none;\n  min-height: 46px;\n  height: 46px;\n  overflow: visible;\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-date-range-input-start-wrapper {\n  justify-content: flex-end;\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-date-range-input-end-wrapper {\n  justify-content: flex-start;\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-date-range-input-mirror {\n  min-height: 46px;\n  height: 46px;\n  display: inline-flex;\n  align-items: center;\n  line-height: 46px;\n}\n.pricing-editor__date-range-field.mat-focused[_ngcontent-%COMP%]     .mdc-notched-outline__leading, \n.pricing-editor__date-range-field.mat-focused[_ngcontent-%COMP%]     .mdc-notched-outline__notch, \n.pricing-editor__date-range-field.mat-focused[_ngcontent-%COMP%]     .mdc-notched-outline__trailing {\n  border-color: rgba(72, 125, 194, 0.66);\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-date-range-input-inner, \n.pricing-editor__date-range-field[_ngcontent-%COMP%]     input {\n  min-width: 0;\n  width: 100%;\n  min-height: 0;\n  height: 100% !important;\n  padding: 0 0.04rem;\n  color: #213d5d;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 700;\n  line-height: 46px;\n  box-sizing: border-box;\n  background: transparent !important;\n  border: 0 !important;\n  border-radius: 0 !important;\n  box-shadow: none !important;\n  align-self: stretch;\n  display: block;\n  white-space: nowrap;\n  text-overflow: clip;\n  overflow: hidden;\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-date-range-input-start-wrapper .mat-date-range-input-inner, \n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-date-range-input-start-wrapper input {\n  text-align: center;\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-date-range-input-end-wrapper .mat-date-range-input-inner, \n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-date-range-input-end-wrapper input {\n  text-align: center;\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-mdc-form-field-flex {\n  min-height: 46px;\n  height: 46px;\n  display: flex;\n  align-items: center !important;\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-mdc-form-field-icon-suffix, \n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-datepicker-toggle {\n  align-self: center;\n  flex: 0 0 32px;\n  width: 32px;\n  min-width: 32px;\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-mdc-icon-button {\n  width: 32px;\n  height: 32px;\n  padding: 4px;\n}\n.pricing-editor__select-shell[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  padding: 0 0.7rem;\n}\n.pricing-editor__select-shell--static[_ngcontent-%COMP%] {\n  justify-content: center;\n  color: #213d5d;\n  font-weight: 700;\n}\n.pricing-editor__select-shell[_ngcontent-%COMP%]     .mat-mdc-select-trigger {\n  min-height: 44px;\n}\n.pricing-editor__money-field[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.48rem;\n  padding: 0 0.72rem;\n}\n.pricing-editor__money-prefix[_ngcontent-%COMP%], \n.pricing-editor__money-code[_ngcontent-%COMP%] {\n  color: rgba(65, 86, 115, 0.78);\n  font-size: 0.84rem;\n  font-weight: 800;\n}\n.pricing-editor__money-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  padding: 0;\n  border: 0;\n  background: transparent;\n  box-shadow: none;\n}\n.pricing-editor__rules[_ngcontent-%COMP%], \n.pricing-editor__promo-list[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 1.08rem;\n}\n.pricing-editor__promo-list[_ngcontent-%COMP%] {\n  margin-top: 0.28rem;\n}\n.pricing-editor__rule-card[_ngcontent-%COMP%], \n.pricing-editor__promo-card[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  position: relative;\n  z-index: 0;\n  align-items: end;\n  padding: 0.86rem;\n  border-radius: 18px;\n  border: 1px solid rgba(125, 151, 185, 0.24);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.98) 0%,\n      rgba(246, 250, 255, 0.92) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(110, 183, 172, 0.12),\n      transparent 36%);\n  transform: translateZ(0);\n  backface-visibility: hidden;\n  contain: layout;\n}\n.pricing-editor__rule-card[_ngcontent-%COMP%] {\n  padding-right: 3.2rem;\n}\n.pricing-editor__promo-card[_ngcontent-%COMP%] {\n  padding-right: 3.2rem;\n}\n.pricing-editor__rule-remove[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.75rem;\n  right: 0.75rem;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  cursor: pointer;\n  color: #b4233a;\n  background: rgba(255, 235, 238, 0.96);\n  box-shadow: inset 0 0 0 1px rgba(214, 64, 88, 0.26);\n}\n.pricing-editor__rule-remove[_ngcontent-%COMP%]:hover {\n  color: #9f1830;\n  background: rgba(255, 224, 229, 0.98);\n  box-shadow: inset 0 0 0 1px rgba(214, 64, 88, 0.34), 0 10px 20px rgba(173, 38, 60, 0.16);\n}\n.pricing-editor__rule-remove[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.pricing-editor__add-btn[_ngcontent-%COMP%] {\n  justify-self: start;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.45rem;\n  padding: 0.68rem 0.94rem;\n  border-radius: 14px;\n  cursor: pointer;\n  color: #214863;\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #eff6ff 100%);\n  box-shadow: inset 0 0 0 1px rgba(99, 137, 184, 0.26), 0 10px 22px rgba(31, 58, 97, 0.08);\n  font-size: 0.88rem;\n  font-weight: 800;\n}\n.pricing-editor__add-btn[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.pricing-editor__hint[_ngcontent-%COMP%] {\n  margin: 0;\n  color: rgba(69, 88, 113, 0.8);\n  font-size: 0.86rem;\n  line-height: 1.55;\n}\n.pricing-editor__preview-note--billing[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 0.62rem 0.72rem;\n  border-radius: 10px;\n  background: rgba(30, 132, 111, 0.08);\n  color: rgba(33, 92, 80, 0.92);\n  font-size: 0.8rem;\n  line-height: 1.45;\n}\n.pricing-editor__preview[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.82rem;\n  min-width: 0;\n  transform: translateZ(0);\n  backface-visibility: hidden;\n}\n.pricing-editor__preview--summary[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 1fr);\n  margin-block-start: var(--pricing-summary-preview-offset, 0);\n}\n.pricing-editor__preview-card[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.72rem;\n  min-width: 0;\n  padding: 1rem;\n  border-radius: 20px;\n  border: 1px solid rgba(126, 152, 188, 0.28);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.98) 0%,\n      rgba(247, 251, 255, 0.94) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(118, 198, 175, 0.15),\n      transparent 44%);\n}\n.pricing-editor__preview-card--light[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.98) 0%,\n      rgba(250, 252, 255, 0.95) 100%),\n    radial-gradient(\n      circle at bottom left,\n      rgba(133, 176, 227, 0.12),\n      transparent 48%);\n}\n.pricing-editor__preview-head[_ngcontent-%COMP%], \n.pricing-editor__preview-line[_ngcontent-%COMP%], \n.pricing-editor__preview-total[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.7rem;\n}\n.pricing-editor__preview-head[_ngcontent-%COMP%] {\n  color: #233d5d;\n  font-size: 0.9rem;\n  font-weight: 900;\n}\n.pricing-editor__preview-line[_ngcontent-%COMP%] {\n  color: rgba(56, 78, 108, 0.86);\n  font-size: 0.9rem;\n}\n.pricing-editor__preview-total[_ngcontent-%COMP%] {\n  padding-top: 0.72rem;\n  border-top: 1px solid rgba(136, 157, 186, 0.22);\n  color: #21425f;\n  font-size: 1rem;\n  font-weight: 900;\n}\n.pricing-editor__preview-total[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #20806d;\n  font-size: 1.55rem;\n  line-height: 1;\n}\n.pricing-editor__preview-line[_ngcontent-%COMP%]   strong.positive[_ngcontent-%COMP%] {\n  color: #22856f;\n}\n.pricing-editor__preview-line[_ngcontent-%COMP%]   strong.negative[_ngcontent-%COMP%] {\n  color: #b04d4d;\n}\n.pricing-editor__preview-note[_ngcontent-%COMP%] {\n  margin: 0;\n  color: rgba(57, 82, 113, 0.8);\n  font-size: 0.84rem;\n  line-height: 1.55;\n}\n.pricing-editor__preview-details[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.42rem;\n  padding-top: 0.72rem;\n  border-top: 1px solid rgba(136, 157, 186, 0.18);\n}\n.pricing-editor__preview-detail[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.8rem;\n  min-width: 0;\n  color: rgba(57, 82, 113, 0.82);\n  font-size: 0.84rem;\n}\n.pricing-editor__preview-detail[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.12rem;\n  min-width: 0;\n}\n.pricing-editor__preview-detail[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #233d5d;\n  font-weight: 900;\n}\n.pricing-editor__preview-detail[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  overflow: hidden;\n  color: rgba(65, 87, 116, 0.76);\n  font-style: normal;\n  line-height: 1.35;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.pricing-editor__wizard-body[_ngcontent-%COMP%], \n.pricing-editor__wizard-body[_ngcontent-%COMP%]   .pricing-editor__main[_ngcontent-%COMP%], \n.pricing-editor__wizard-body[_ngcontent-%COMP%]   .pricing-editor__preview[_ngcontent-%COMP%] {\n  min-width: 0;\n  will-change: transform, scroll-position;\n  transform: translateZ(0);\n  -webkit-transform: translate3d(0, 0, 0);\n  backface-visibility: hidden;\n}\n.pricing-editor__wizard-body[_ngcontent-%COMP%] {\n  container-type: inline-size;\n  box-sizing: border-box;\n  width: 100%;\n  max-width: 100%;\n  height: 100%;\n  min-height: 0;\n  display: grid;\n  align-content: start;\n  gap: 0.92rem;\n  overflow-x: hidden;\n  overflow-y: auto;\n  padding: 0.12rem 0 0.8rem;\n  scrollbar-width: thin;\n  scrollbar-color: #8aa0b8 #eaf1fa;\n  scrollbar-gutter: stable;\n}\n.pricing-editor__wizard-body[_ngcontent-%COMP%]   .pricing-editor__main[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.pricing-editor__preview--wizard-sticky[_ngcontent-%COMP%] {\n  position: sticky;\n  top: -0.12rem;\n  z-index: 2;\n  align-self: start;\n  margin-top: -0.12rem;\n  padding-top: 0.12rem;\n  padding-bottom: 0.18rem;\n  will-change: transform;\n  transform: translateZ(0);\n  backface-visibility: hidden;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(249, 252, 255, 0.98) 0%,\n      rgba(249, 252, 255, 0.88) 100%);\n}\n@container (max-width: 760px) {\n  .pricing-editor__layout[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .pricing-editor--summary-popup[_ngcontent-%COMP%]   .pricing-editor__head[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr) auto;\n    align-items: start;\n  }\n  .pricing-editor--summary-popup[_ngcontent-%COMP%]   .pricing-editor__head-actions[_ngcontent-%COMP%] {\n    justify-self: end;\n  }\n  .pricing-editor__grid[_ngcontent-%COMP%], \n   .pricing-editor__grid--compact[_ngcontent-%COMP%], \n   .pricing-editor__rule-grid[_ngcontent-%COMP%], \n   .pricing-editor__rule-grid--time[_ngcontent-%COMP%]:not(.pricing-editor__rule-grid--slots), \n   .pricing-editor__rule-grid--time.pricing-editor__rule-grid--slots[_ngcontent-%COMP%], \n   .pricing-editor__promo-card[_ngcontent-%COMP%], \n   .pricing-editor__preview[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .pricing-editor__surface[_ngcontent-%COMP%] {\n    padding: 0.82rem;\n    gap: 0.72rem;\n  }\n  .pricing-editor__mode-switch[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    gap: 0.24rem;\n    padding: 0.22rem;\n  }\n  .pricing-editor__mode-btn[_ngcontent-%COMP%] {\n    min-height: 38px;\n    padding: 0 0.2rem;\n    font-size: 0.76rem;\n    line-height: 1.1;\n  }\n  .pricing-editor__field[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n    font-size: 0.68rem;\n  }\n  .pricing-editor__field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n   .pricing-editor__select-shell[_ngcontent-%COMP%], \n   .pricing-editor__money-field[_ngcontent-%COMP%] {\n    min-height: 42px;\n  }\n  .pricing-editor__select-shell[_ngcontent-%COMP%]     .mat-mdc-select-trigger {\n    min-height: 40px;\n  }\n  .pricing-editor__open-btn--summary[_ngcontent-%COMP%] {\n    width: 100%;\n    justify-content: center;\n  }\n}\n@media (max-width: 760px) {\n  .pricing-editor__preview--summary[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .pricing-editor__wizard-body[_ngcontent-%COMP%] {\n    padding: 0.08rem 0.2rem 0.72rem 0.08rem;\n  }\n  .pricing-editor__preview--wizard-sticky[_ngcontent-%COMP%] {\n    top: -0.08rem;\n    margin-top: -0.08rem;\n    padding-top: 0.08rem;\n  }\n}\n/*# sourceMappingURL=pricing-editor.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PricingEditorInputComponent, [{
    type: Component,
    args: [{ selector: "app-pricing-editor-input", standalone: true, imports: [
      CommonModule,
      FormsModule,
      MatDatepickerModule,
      MatFormFieldModule,
      MatIconModule,
      MatInputModule,
      MatNativeDateModule,
      MatSelectModule,
      AppMenuOutletComponent,
      AppMenuTriggerComponent,
      PricingSlotPanelComponent,
      I18nPipe
    ], changeDetection: ChangeDetectionStrategy.OnPush, providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => PricingEditorInputComponent),
        multi: true
      },
      AppMenuDispatcher
    ], template: `@if (showPricingPanel()) {
<section
  class="pricing-editor"
  [class.pricing-editor--readonly]="editorLocked()"
  [class.pricing-editor--summary-popup]="usesSummaryPopup()"
  [class.pricing-editor--wizard-open]="wizardOpen"
  [class.pricing-editor--enabled]="showPricingContent()"
  [class.pricing-editor--embedded]="resolvedConfig.embedded"
  >
  @if (!resolvedConfig.embedded) {
  <header class="pricing-editor__head">
    <div class="pricing-editor__title">
      <span class="pricing-editor__title-copy">
        <span class="pricing-editor__title-text">
          <mat-icon>paid</mat-icon>
          @switch (resolvedConfig.context) {
            @case ('asset') {
              <span>{{ 'pricing.asset.title' | i18n }}</span>
            }
            @case ('subevent') {
              <span>{{ 'pricing.optional.title' | i18n }}</span>
            }
            @default {
              <span>{{ 'pricing' | i18n }}</span>
            }
          }
        </span>
        @switch (subtitleKey()) {
          @case ('event-enabled') {
            <span class="pricing-editor__subtitle">{{ 'pricing.event.subtitle.enabled' | i18n }}</span>
          }
          @case ('event-disabled') {
            <span class="pricing-editor__subtitle">{{ 'pricing.event.subtitle.disabled' | i18n }}</span>
          }
          @case ('asset') {
            <span class="pricing-editor__subtitle">{{ 'pricing.asset.subtitle' | i18n }}</span>
          }
          @case ('subevent') {
            <span class="pricing-editor__subtitle">{{ 'pricing.subevent.subtitle' | i18n }}</span>
          }
        }
      </span>
    </div>
    @if (showToggleControl()) {
    <div class="pricing-editor__head-actions">
      <button
        type="button"
        class="pricing-editor__toggle pricing-editor__toggle--header"
        [class.is-on]="isPricingEnabled()"
        [disabled]="editorLocked()"
        [attr.aria-pressed]="isPricingEnabled()"
        (click)="togglePricingEnabled()"
        >
        <mat-icon>{{ isPricingEnabled() ? 'toggle_on' : 'toggle_off' }}</mat-icon>
        <span>{{ (isPricingEnabled() ? 'on' : 'off') | i18n }}</span>
      </button>
    </div>
    }
  </header>
  }

  @if (usesSummaryPopup() && showPricingContent()) {
    @if (!editorLocked()) {
      <div class="pricing-editor__summary-actions">
        <button type="button" class="pricing-editor__open-btn pricing-editor__open-btn--summary" (click)="openWizard()">
          <mat-icon>tune</mat-icon>
          <span>{{ 'pricing.setup.open' | i18n }}</span>
        </button>
      </div>
    }
    @if (resolvedConfig.showPreview) {
      <div class="pricing-editor__preview pricing-editor__preview--summary">
        <ng-container [ngTemplateOutlet]="pricingPreviewCards"></ng-container>
      </div>
    }
  } @else if (showPricingContent()) {
    <div class="pricing-editor__layout">
      <div class="pricing-editor__main">
        <ng-container [ngTemplateOutlet]="pricingEditorSurfaces"></ng-container>
      </div>

      @if (resolvedConfig.showPreview) {
        <aside class="pricing-editor__preview">
          <ng-container [ngTemplateOutlet]="pricingPreviewCards"></ng-container>
        </aside>
      }
    </div>
  }

</section>
}

@if (pricingEditorPopupComponent(); as popupComponent) {
  <ng-container *ngComponentOutlet="popupComponent; inputs: pricingEditorPopupOutletInputs()"></ng-container>
}

<ng-template #pricingEditorSurfaces>
  <section class="pricing-editor__surface">
    <div class="pricing-editor__grid">
      <label class="pricing-editor__field pricing-editor__field--money">
        <span>{{ basePriceFieldLabel() | i18n }}</span>
        <div class="pricing-editor__money-field">
          <span class="pricing-editor__money-prefix">{{ currencySymbol(workingPricing.currency) }}</span>
          <input
            type="number"
            (input)="normalizeNumberInput($event)"
            min="0"
            step="0.01"
            [ngModel]="workingPricing.basePrice"
            (ngModelChange)="onBasePriceChange($event)"
            [disabled]="readOnly"
            />
          <span class="pricing-editor__money-code">{{ workingPricing.currency }}</span>
        </div>
      </label>

      <label class="pricing-editor__field">
        <span>{{ 'currency' | i18n }}</span>
        <div class="pricing-editor__select-shell">
          <mat-select
            [(ngModel)]="workingPricing.currency"
            (ngModelChange)="onStringFieldChange()"
            [disabled]="readOnly"
            [panelWidth]="null"
            disableOptionCentering
            panelClass="selector-options-panel profile-bottom-sheet-panel"
            >
            @for (option of currencyOptions; track option) {
              <mat-option [value]="option">{{ option }}</mat-option>
            }
          </mat-select>
        </div>
      </label>

      <label class="pricing-editor__field">
        <span>{{ 'tax' | i18n }}</span>
        <div class="pricing-editor__select-shell">
          <mat-select
            [(ngModel)]="workingPricing.taxMode"
            (ngModelChange)="onStringFieldChange()"
            [disabled]="readOnly"
            [panelWidth]="null"
            disableOptionCentering
            panelClass="selector-options-panel profile-bottom-sheet-panel"
            >
            @for (option of taxModeOptions; track option) {
              <mat-option [value]="option">{{ taxModeLabel(option) | i18n }}</mat-option>
            }
          </mat-select>
        </div>
      </label>

      <label class="pricing-editor__field">
        <span>{{ chargeTypeFieldLabel() | i18n }}</span>
        <div class="pricing-editor__select-shell">
          <mat-select
            [(ngModel)]="workingPricing.chargeType"
            (ngModelChange)="onStringFieldChange()"
            [disabled]="readOnly"
            [panelWidth]="null"
            disableOptionCentering
            panelClass="selector-options-panel profile-bottom-sheet-panel"
            >
            @for (option of resolvedConfig.chargeTypeOptions; track option) {
              <mat-option [value]="option">{{ chargeTypeLabel(option) | i18n }}</mat-option>
            }
          </mat-select>
        </div>
      </label>

      <label class="pricing-editor__field pricing-editor__field--money">
        <span>{{ minimumPriceFieldLabel() | i18n }}</span>
        <div class="pricing-editor__money-field">
          <span class="pricing-editor__money-prefix">{{ currencySymbol(workingPricing.currency) }}</span>
          <input
            type="number"
            (input)="normalizeNumberInput($event)"
            min="0"
            step="0.01"
            [ngModel]="workingPricing.minPrice ?? ''"
            (ngModelChange)="onNullableMoneyFieldChange('minPrice', $event)"
            (blur)="onPriceBoundsBlur()"
            [disabled]="readOnly"
            [placeholder]="'pricing.no.minimum' | i18n"
            />
          <span class="pricing-editor__money-code">{{ workingPricing.currency }}</span>
        </div>
      </label>

      <label class="pricing-editor__field pricing-editor__field--money">
        <span>{{ maximumPriceFieldLabel() | i18n }}</span>
        <div class="pricing-editor__money-field">
          <span class="pricing-editor__money-prefix">{{ currencySymbol(workingPricing.currency) }}</span>
          <input
            type="number"
            (input)="normalizeNumberInput($event)"
            min="0"
            step="0.01"
            [ngModel]="workingPricing.maxPrice ?? ''"
            (ngModelChange)="onNullableMoneyFieldChange('maxPrice', $event)"
            (blur)="onPriceBoundsBlur()"
            #pricingMaximumInput
            [attr.aria-invalid]="priceBoundsInvalid ? true : null"
            [disabled]="readOnly"
            [placeholder]="'pricing.no.maximum' | i18n"
            />
          <span class="pricing-editor__money-code">{{ workingPricing.currency }}</span>
        </div>
      @if (priceBoundsInvalid) {
        <span class="pricing-editor__field-error" role="alert">{{ 'pricing.maximum.below.minimum' | i18n }}</span>
      }
      </label>

      <label class="pricing-editor__field">
        <span>{{ 'pricing.rounding' | i18n }}</span>
        <div class="pricing-editor__select-shell">
          <mat-select
            [(ngModel)]="workingPricing.rounding"
            (ngModelChange)="onStringFieldChange()"
            [disabled]="readOnly"
            [panelWidth]="null"
            disableOptionCentering
            panelClass="selector-options-panel profile-bottom-sheet-panel"
            >
            @for (option of roundingOptions; track option) {
              <mat-option [value]="option">{{ roundingLabel(option) | i18n }}</mat-option>
            }
          </mat-select>
        </div>
      </label>
    </div>
  </section>

  @if (showQuantitySection()) {
    <section class="pricing-editor__surface">
      <div class="pricing-editor__section-head">
        <span>{{ 'pricing.quantity.rules' | i18n }}</span>
        @if (showToggleControl()) {
        <button
          type="button"
          class="pricing-editor__toggle"
          [class.is-on]="workingPricing.quantityRulesEnabled"
          [disabled]="readOnly"
          (click)="toggleQuantityRulesEnabled()"
          >
          <mat-icon>{{ workingPricing.quantityRulesEnabled ? 'toggle_on' : 'toggle_off' }}</mat-icon>
          <span>{{ (workingPricing.quantityRulesEnabled ? 'on' : 'off') | i18n }}</span>
        </button>
        }
      </div>
      @if (workingPricing.quantityRulesEnabled) {
        <div class="pricing-editor__rules">
          @for (rule of workingPricing.quantityRules; track trackByRule($index, rule)) {
            <article class="pricing-editor__rule-card">
              <div class="pricing-editor__rule-grid">
                <label class="pricing-editor__field">
                  <span>{{ 'if' | i18n }}</span>
                  <div class="pricing-editor__select-shell pricing-editor__select-shell--static">
                    <span>{{ quantityThresholdLabel() | i18n }}</span>
                  </div>
                </label>
                <label class="pricing-editor__field">
                  <span>{{ 'quantity' | i18n }}</span>
                  <input
                    type="number"
                    (input)="normalizeNumberInput($event)"
                    min="1"
                    step="1"
                    [ngModel]="rule.minQuantity"
                    (ngModelChange)="onQuantityRuleMinChange(rule, $event)"
                    [disabled]="readOnly"
                    />
                </label>
                <label class="pricing-editor__field">
                  <span>{{ 'then' | i18n }}</span>
                  <div class="pricing-editor__select-shell">
                    <mat-select
                      [(ngModel)]="rule.action.kind"
                      (ngModelChange)="emitPricing()"
                      [disabled]="readOnly"
                      [panelWidth]="null"
                      disableOptionCentering
                      panelClass="selector-options-panel profile-bottom-sheet-panel"
                      >
                      @for (option of actionKindOptions; track option) {
                        <mat-option [value]="option">{{ actionLabel(option) | i18n }}</mat-option>
                      }
                    </mat-select>
                  </div>
                </label>
                <label class="pricing-editor__field">
                  <span>{{ 'value' | i18n }}</span>
                  <input
                    type="number"
                    (input)="normalizeNumberInput($event)"
                    min="0"
                    step="0.01"
                    [ngModel]="rule.action.value"
                    (ngModelChange)="onQuantityRuleActionValueChange(rule, $event)"
                    [disabled]="readOnly"
                    />
                </label>
              </div>
              <button
                type="button"
                class="pricing-editor__rule-remove"
                [disabled]="readOnly"
                (click)="removeQuantityRule($index)"
                [attr.aria-label]="'pricing.quantity.rule.remove.aria' | i18n"
                >
                <mat-icon>delete</mat-icon>
              </button>
            </article>
          }
        </div>
        <button type="button" class="pricing-editor__add-btn" [disabled]="readOnly" (click)="addQuantityRule()">
          <mat-icon>add</mat-icon>
          <span>{{ 'pricing.quantity.rule.add' | i18n }}</span>
        </button>
      } @else {
        <p class="pricing-editor__hint">{{ quantityDisabledHint() | i18n }}</p>
      }
    </section>
  }

  @if (showDemandSection()) {
    <section class="pricing-editor__surface">
      <div class="pricing-editor__section-head">
        <span>{{ 'pricing.demand.rules' | i18n }}</span>
        @if (showToggleControl()) {
        <button
          type="button"
          class="pricing-editor__toggle"
          [class.is-on]="workingPricing.demandRulesEnabled"
          [disabled]="readOnly"
          (click)="toggleDemandRulesEnabled()"
          >
          <mat-icon>{{ workingPricing.demandRulesEnabled ? 'toggle_on' : 'toggle_off' }}</mat-icon>
          <span>{{ (workingPricing.demandRulesEnabled ? 'on' : 'off') | i18n }}</span>
        </button>
        }
      </div>
      @if (workingPricing.demandRulesEnabled) {
        <div class="pricing-editor__rules">
          @for (rule of workingPricing.demandRules; track trackByRule($index, rule)) {
            <article class="pricing-editor__rule-card">
              <div
                class="pricing-editor__rule-grid"
                [class.pricing-editor__rule-grid--slots]="resolvedConfig.allowSlotFeatures"
              >
                <label class="pricing-editor__field">
                  <span>{{ 'if' | i18n }}</span>
                  <div class="pricing-editor__select-shell">
                    <mat-select
                      [(ngModel)]="rule.operator"
                      (ngModelChange)="emitPricing()"
                      [disabled]="readOnly"
                      [panelWidth]="null"
                      disableOptionCentering
                      panelClass="selector-options-panel profile-bottom-sheet-panel"
                      >
                      @for (option of demandOperatorOptions; track option) {
                        <mat-option [value]="option">{{ 'pricing.capacity.filled' | i18n }} {{ operatorLabel(option) }}</mat-option>
                      }
                    </mat-select>
                  </div>
                </label>
                <label class="pricing-editor__field">
                  <span>{{ 'pricing.capacity.percent' | i18n }}</span>
                  <input
                    type="number"
                    (input)="normalizeNumberInput($event)"
                    min="0"
                    max="100"
                    step="1"
                    [ngModel]="rule.capacityFilledPercent"
                    (ngModelChange)="onDemandRuleThresholdChange(rule, $event)"
                    [disabled]="readOnly"
                    />
                </label>
                <label class="pricing-editor__field">
                  <span>{{ 'then' | i18n }}</span>
                  <div class="pricing-editor__select-shell">
                    <mat-select
                      [(ngModel)]="rule.action.kind"
                      (ngModelChange)="emitPricing()"
                      [disabled]="readOnly"
                      [panelWidth]="null"
                      disableOptionCentering
                      panelClass="selector-options-panel profile-bottom-sheet-panel"
                      >
                      @for (option of actionKindOptions; track option) {
                        <mat-option [value]="option">{{ actionLabel(option) | i18n }}</mat-option>
                      }
                    </mat-select>
                  </div>
                </label>
                <label class="pricing-editor__field">
                  <span>{{ 'value' | i18n }}</span>
                  <input
                    type="number"
                    (input)="normalizeNumberInput($event)"
                    min="0"
                    step="0.01"
                    [ngModel]="rule.action.value"
                    (ngModelChange)="onDemandRuleActionValueChange(rule, $event)"
                    [disabled]="readOnly"
                    />
                </label>
                @if (resolvedConfig.allowSlotFeatures) {
                  <label class="pricing-editor__field">
                    <span>{{ 'pricing.applies.to' | i18n }}</span>
                    <app-menu-trigger
                      [menuId]="ruleScopeMenuId('demand', rule)"
                      kind="select"
                      [title]="ruleScopeMenuTitle('demand')"
                      [trigger]="ruleScopeMenuTrigger('demand', rule)"
                      [items]="ruleScopeMenuItems('demand', rule)"
                      [closeOnSelect]="false"
                    ></app-menu-trigger>
                  </label>
                }
              </div>
              <button
                type="button"
                class="pricing-editor__rule-remove"
                [disabled]="readOnly"
                (click)="removeDemandRule($index)"
                [attr.aria-label]="'pricing.demand.rule.remove.aria' | i18n"
                >
                <mat-icon>delete</mat-icon>
              </button>
            </article>
          }
        </div>
        <button type="button" class="pricing-editor__add-btn" [disabled]="readOnly" (click)="addDemandRule()">
          <mat-icon>add</mat-icon>
          <span>{{ 'pricing.demand.rule.add' | i18n }}</span>
        </button>
      } @else {
        <p class="pricing-editor__hint">{{ 'pricing.demand.disabled.hint' | i18n }}</p>
      }
    </section>
  }

  @if (showTimeSection()) {
    <section class="pricing-editor__surface">
      <div class="pricing-editor__section-head">
        <span>{{ 'pricing.time.rules' | i18n }}</span>
        @if (showToggleControl()) {
        <button
          type="button"
          class="pricing-editor__toggle"
          [class.is-on]="workingPricing.timeRulesEnabled"
          [disabled]="readOnly"
          (click)="toggleTimeRulesEnabled()"
          >
          <mat-icon>{{ workingPricing.timeRulesEnabled ? 'toggle_on' : 'toggle_off' }}</mat-icon>
          <span>{{ (workingPricing.timeRulesEnabled ? 'on' : 'off') | i18n }}</span>
        </button>
        }
      </div>
      @if (workingPricing.timeRulesEnabled) {
        <div class="pricing-editor__rules">
          @for (rule of workingPricing.timeRules; track trackByRule($index, rule)) {
            <article class="pricing-editor__rule-card">
              <div
                class="pricing-editor__rule-grid"
                [class.pricing-editor__rule-grid--time]="rule.trigger !== 'specific_date'"
                [class.pricing-editor__rule-grid--slots]="resolvedConfig.allowSlotFeatures"
                [class.pricing-editor__rule-grid--time-date-desktop]="rule.trigger === 'specific_date'"
              >
                <label class="pricing-editor__field pricing-editor__field--time-trigger">
                  <span>{{ 'if' | i18n }}</span>
                  <div class="pricing-editor__select-shell">
                    <mat-select
                      [(ngModel)]="rule.trigger"
                      (ngModelChange)="emitPricing()"
                      [disabled]="readOnly"
                      [panelWidth]="null"
                      disableOptionCentering
                      panelClass="selector-options-panel profile-bottom-sheet-panel"
                      >
                      @for (option of timeTriggerOptions; track option) {
                        <mat-option [value]="option">{{ timeTriggerLabel(option) | i18n }}</mat-option>
                      }
                    </mat-select>
                  </div>
                </label>
                @if (rule.trigger === 'specific_date') {
                  <label class="pricing-editor__field pricing-editor__field--span-full">
                    <span>{{ 'date.range' | i18n }}</span>
                    <mat-form-field appearance="outline" class="pricing-editor__date-range-field" subscriptSizing="dynamic">
                      <mat-date-range-input [rangePicker]="timeRuleRangePicker">
                        <input
                          matStartDate
                          [value]="timeRuleRangeStartDate(rule)"
                          (dateChange)="onTimeRuleRangeStartChange(rule, $event.value)"
                          [disabled]="readOnly"
                          [placeholder]="'start.date' | i18n"
                          />
                        <input
                          matEndDate
                          [value]="timeRuleRangeEndDate(rule)"
                          (dateChange)="onTimeRuleRangeEndChange(rule, $event.value)"
                          [disabled]="readOnly"
                          [placeholder]="'end.date' | i18n"
                          />
                      </mat-date-range-input>
                      <mat-datepicker-toggle matSuffix [for]="timeRuleRangePicker"></mat-datepicker-toggle>
                      <mat-date-range-picker #timeRuleRangePicker></mat-date-range-picker>
                    </mat-form-field>
                  </label>
                } @else {
                  <label class="pricing-editor__field pricing-editor__field--time-offset">
                    <span>{{ 'offset' | i18n }}</span>
                    <input
                      type="number"
                      (input)="normalizeNumberInput($event)"
                      min="0"
                      step="1"
                      [ngModel]="rule.offsetValue ?? ''"
                      (ngModelChange)="onTimeRuleOffsetChange(rule, $event)"
                      [disabled]="readOnly"
                      />
                  </label>
                }
                <label class="pricing-editor__field pricing-editor__field--time-action">
                  <span>{{ 'then' | i18n }}</span>
                  <div class="pricing-editor__select-shell">
                    <mat-select
                      [(ngModel)]="rule.action.kind"
                      (ngModelChange)="emitPricing()"
                      [disabled]="readOnly"
                      [panelWidth]="null"
                      disableOptionCentering
                      panelClass="selector-options-panel profile-bottom-sheet-panel"
                      >
                      @for (option of actionKindOptions; track option) {
                        <mat-option [value]="option">{{ actionLabel(option) | i18n }}</mat-option>
                      }
                    </mat-select>
                  </div>
                </label>
                <label class="pricing-editor__field pricing-editor__field--time-value">
                  <span>{{ 'value' | i18n }}</span>
                  <input
                    type="number"
                    (input)="normalizeNumberInput($event)"
                    min="0"
                    step="0.01"
                    [ngModel]="rule.action.value"
                    (ngModelChange)="onTimeRuleActionValueChange(rule, $event)"
                    [disabled]="readOnly"
                    />
                </label>
                  @if (resolvedConfig.allowSlotFeatures) {
                  <label class="pricing-editor__field">
                    <span>{{ 'pricing.applies.to' | i18n }}</span>
                    <app-menu-trigger
                      [menuId]="ruleScopeMenuId('time', rule)"
                      kind="select"
                      [title]="ruleScopeMenuTitle('time')"
                      [trigger]="ruleScopeMenuTrigger('time', rule)"
                      [items]="ruleScopeMenuItems('time', rule)"
                      [closeOnSelect]="false"
                    ></app-menu-trigger>
                  </label>
                }
              </div>
              <button
                type="button"
                class="pricing-editor__rule-remove"
                [disabled]="readOnly"
                (click)="removeTimeRule($index)"
                [attr.aria-label]="'pricing.time.rule.remove.aria' | i18n"
                >
                <mat-icon>delete</mat-icon>
              </button>
            </article>
          }
        </div>
        <button type="button" class="pricing-editor__add-btn" [disabled]="readOnly" (click)="addTimeRule()">
          <mat-icon>add</mat-icon>
          <span>{{ 'pricing.time.rule.add' | i18n }}</span>
        </button>
      } @else {
        <p class="pricing-editor__hint">{{ 'pricing.time.disabled.hint' | i18n }}</p>
      }
    </section>
  }

  @if (showCancellationSection()) {
    <section class="pricing-editor__surface">
      <div class="pricing-editor__section-head">
        <span>{{ 'pricing.cancellation.title' | i18n }}</span>
        @if (showToggleControl()) {
        <button
          type="button"
          class="pricing-editor__toggle"
          [class.is-on]="workingPricing.cancellationPolicy.enabled"
          [disabled]="readOnly"
          (click)="toggleCancellationPolicyEnabled()"
          >
          <mat-icon>{{ workingPricing.cancellationPolicy.enabled ? 'toggle_on' : 'toggle_off' }}</mat-icon>
          <span>{{ (workingPricing.cancellationPolicy.enabled ? 'on' : 'off') | i18n }}</span>
        </button>
        }
      </div>
      @if (workingPricing.cancellationPolicy.enabled) {
        <div class="pricing-editor__rules">
          @for (rule of workingPricing.cancellationPolicy.rules; track trackByRule($index, rule)) {
            <article class="pricing-editor__rule-card">
              <div class="pricing-editor__grid pricing-editor__grid--compact">
                <label class="pricing-editor__field">
                  <span>{{ 'pricing.notice.window' | i18n }}</span>
                  <div class="pricing-editor__select-shell">
                    <mat-select
                      [(ngModel)]="rule.offsetUnit"
                      (ngModelChange)="emitPricing()"
                      [disabled]="readOnly"
                      [panelWidth]="null"
                      disableOptionCentering
                      panelClass="selector-options-panel profile-bottom-sheet-panel"
                      >
                      @for (option of cancellationUnitOptions; track option) {
                        <mat-option [value]="option">{{ cancellationUnitLabel(option) | i18n }}</mat-option>
                      }
                    </mat-select>
                  </div>
                </label>
                <label class="pricing-editor__field">
                  <span>{{ 'value' | i18n }}</span>
                  <input
                    type="number"
                    (input)="normalizeNumberInput($event)"
                    min="0"
                    step="1"
                    [ngModel]="rule.offsetValue ?? ''"
                    (ngModelChange)="onCancellationRuleOffsetChange(rule, $event)"
                    [disabled]="readOnly"
                    />
                </label>
                <label class="pricing-editor__field">
                  <span>{{ 'refund' | i18n }}</span>
                  <div class="pricing-editor__select-shell">
                    <mat-select
                      [ngModel]="rule.refundKind"
                      (ngModelChange)="onCancellationRuleRefundKindChange(rule, $event)"
                      [disabled]="readOnly"
                      [panelWidth]="null"
                      disableOptionCentering
                      panelClass="selector-options-panel profile-bottom-sheet-panel"
                      >
                      @for (option of cancellationRefundKindOptions; track option) {
                        <mat-option [value]="option">{{ cancellationRefundKindLabel(option) | i18n }}</mat-option>
                      }
                    </mat-select>
                  </div>
                </label>
                <label class="pricing-editor__field">
                  <span>{{ 'pricing.refund.value' | i18n }}</span>
                  @if (cancellationRuleNeedsValue(rule)) {
                    <input
                      type="number"
                      (input)="normalizeNumberInput($event)"
                      min="0"
                      [step]="rule.refundKind === 'percent' ? '1' : '0.01'"
                      [ngModel]="rule.refundValue ?? ''"
                      (ngModelChange)="onCancellationRuleRefundValueChange(rule, $event)"
                      [disabled]="readOnly"
                      />
                  } @else {
                    <input
                      type="text"
                      [value]="cancellationRuleValueSuffix(rule) | i18n"
                      disabled
                      />
                  }
                </label>
              </div>
              <button
                type="button"
                class="pricing-editor__rule-remove"
                [disabled]="readOnly"
                (click)="removeCancellationRule($index)"
                [attr.aria-label]="'pricing.cancellation.rule.remove.aria' | i18n"
                >
                <mat-icon>delete</mat-icon>
              </button>
            </article>
          }
        </div>
        <button type="button" class="pricing-editor__add-btn" [disabled]="readOnly" (click)="addCancellationRule()">
          <mat-icon>add</mat-icon>
          <span>{{ 'pricing.cancellation.rule.add' | i18n }}</span>
        </button>
      } @else {
        <p class="pricing-editor__hint">{{ 'pricing.cancellation.disabled.hint' | i18n }}</p>
      }
    </section>
  }

  @if (showSlotSection()) {
    <app-pricing-slot-panel
      [enabled]="workingPricing.slotPricingEnabled"
      (enabledChange)="onSlotPricingEnabledChange($event)"
      [overrides]="workingPricing.slotOverrides"
      (overridesChange)="onSlotOverridesChange($event)"
      [slotCatalog]="resolvedConfig.slotCatalog"
      [currency]="workingPricing.currency"
      [readOnly]="readOnly"
    ></app-pricing-slot-panel>
  }

  @if (showAudienceSection()) {
    <section class="pricing-editor__surface">
      <div class="pricing-editor__section-head">
        <span>{{ 'pricing.audience.title' | i18n }}</span>
        @if (showToggleControl()) {
        <button
          type="button"
          class="pricing-editor__toggle"
          [class.is-on]="workingPricing.audience.enabled"
          [disabled]="readOnly"
          (click)="toggleAudienceEnabled()"
          >
          <mat-icon>{{ workingPricing.audience.enabled ? 'toggle_on' : 'toggle_off' }}</mat-icon>
          <span>{{ (workingPricing.audience.enabled ? 'on' : 'off') | i18n }}</span>
        </button>
        }
      </div>
      @if (workingPricing.audience.enabled) {
        <div class="pricing-editor__grid pricing-editor__grid--compact">
          <label class="pricing-editor__field pricing-editor__field--money">
            <span>{{ 'pricing.member.price' | i18n }}</span>
            <div class="pricing-editor__money-field">
              <span class="pricing-editor__money-prefix">{{ currencySymbol(workingPricing.currency) }}</span>
              <input
                type="number"
                (input)="normalizeNumberInput($event)"
                min="0"
                step="0.01"
                [ngModel]="workingPricing.audience.memberPrice ?? ''"
                (ngModelChange)="onAudienceMoneyFieldChange('memberPrice', $event)"
                [disabled]="readOnly"
                />
              <span class="pricing-editor__money-code">{{ workingPricing.currency }}</span>
            </div>
          </label>

          <label class="pricing-editor__field pricing-editor__field--money">
            <span>{{ 'pricing.vip.price' | i18n }}</span>
            <div class="pricing-editor__money-field">
              <span class="pricing-editor__money-prefix">{{ currencySymbol(workingPricing.currency) }}</span>
              <input
                type="number"
                (input)="normalizeNumberInput($event)"
                min="0"
                step="0.01"
                [ngModel]="workingPricing.audience.vipPrice ?? ''"
                (ngModelChange)="onAudienceMoneyFieldChange('vipPrice', $event)"
                [disabled]="readOnly"
                />
              <span class="pricing-editor__money-code">{{ workingPricing.currency }}</span>
            </div>
          </label>

          <label class="pricing-editor__field">
            <span>{{ 'pricing.invite.discount.percent' | i18n }}</span>
            <input
              type="number"
              (input)="normalizeNumberInput($event)"
              min="0"
              max="100"
              step="1"
              [ngModel]="workingPricing.audience.inviteOnlyDiscountPercent ?? ''"
              (ngModelChange)="onAudienceDiscountChange($event)"
              [disabled]="readOnly"
              />
          </label>

          <label class="pricing-editor__field">
            <span>{{ 'pricing.sold.out.label' | i18n }}</span>
            <div class="pricing-editor__select-shell">
              <mat-select
                [(ngModel)]="workingPricing.audience.soldOutLabel"
                (ngModelChange)="onStringFieldChange()"
                [disabled]="readOnly"
                [panelWidth]="null"
                disableOptionCentering
                panelClass="selector-options-panel profile-bottom-sheet-panel"
                >
                @for (option of soldOutLabelOptions; track option) {
                  <mat-option [value]="option">{{ option }}</mat-option>
                }
              </mat-select>
            </div>
          </label>
        </div>

        <div class="pricing-editor__promo-list">
          @for (promo of workingPricing.audience.promoCodes; track trackByRule($index, promo)) {
            <article class="pricing-editor__promo-card">
              <label class="pricing-editor__field">
                <span>{{ 'pricing.promo.code' | i18n }}</span>
                <input
                  type="text"
                  [ngModel]="promo.code"
                  (ngModelChange)="onPromoCodeTextChange(promo, $event)"
                  [disabled]="readOnly"
                  placeholder="EARLY"
                  />
              </label>
              <label class="pricing-editor__field">
                <span>{{ 'pricing.effect' | i18n }}</span>
                <div class="pricing-editor__select-shell">
                  <mat-select
                    [(ngModel)]="promo.action.kind"
                    (ngModelChange)="emitPricing()"
                    [disabled]="readOnly"
                    [panelWidth]="null"
                    disableOptionCentering
                    panelClass="selector-options-panel profile-bottom-sheet-panel"
                    >
                    @for (option of actionKindOptions; track option) {
                      <mat-option [value]="option">{{ actionLabel(option) | i18n }}</mat-option>
                    }
                  </mat-select>
                </div>
              </label>
              <label class="pricing-editor__field">
                <span>{{ 'value' | i18n }}</span>
                <input
                  type="number"
                  (input)="normalizeNumberInput($event)"
                  min="0"
                  step="0.01"
                  [ngModel]="promo.action.value"
                  (ngModelChange)="onPromoCodeActionValueChange(promo, $event)"
                  [disabled]="readOnly"
                  />
              </label>
              <button
                type="button"
                class="pricing-editor__rule-remove"
                [disabled]="readOnly"
                (click)="removePromoCode($index)"
                [attr.aria-label]="'pricing.promo.remove.aria' | i18n"
                >
                <mat-icon>delete</mat-icon>
              </button>
            </article>
          }
        </div>
        <button type="button" class="pricing-editor__add-btn" [disabled]="readOnly" (click)="addPromoCode()">
          <mat-icon>add</mat-icon>
          <span>{{ 'pricing.promo.add' | i18n }}</span>
        </button>
      } @else {
        <p class="pricing-editor__hint">{{ 'pricing.audience.disabled.hint' | i18n }}</p>
      }
    </section>
  }
</ng-template>

<app-menu-outlet
  [items]="activeRuleScopeMenuItems()"
  (itemSelect)="onRuleScopeMenuSelect($event)"
></app-menu-outlet>

<ng-template #pricingPreviewCards>
  <div class="pricing-editor__preview-card">
    <div class="pricing-editor__preview-head">
      <span>{{ 'event.editor.pricing.current.review' | i18n }}</span>
      <mat-icon>query_stats</mat-icon>
    </div>
    @if (runtimePreviewState(); as runtimePreview) {
      <div class="pricing-editor__preview-line">
        <span>{{ runtimeBaseLabel(runtimePreview) }}</span>
        <strong>{{ runtimeMoneyLabel(runtimeBaseAmount(runtimePreview), runtimePreviewCurrency(runtimePreview)) }}</strong>
      </div>
      @for (row of runtimeAdjustmentRows(runtimePreview); track runtimeRowTrackId($index, row)) {
        <div class="pricing-editor__preview-line">
          <span>{{ runtimeRowLabel(row) }}</span>
          @if (runtimeRowAmount(row, runtimePreviewCurrency(runtimePreview))) {
            <strong [class.positive]="(row.amount ?? 0) > 0" [class.negative]="(row.amount ?? 0) < 0">
              {{ runtimeRowAmount(row, runtimePreviewCurrency(runtimePreview)) }}
            </strong>
          }
        </div>
      }
      @if (runtimePreview.rows.length === 0 && runtimePreview.emptyLabel) {
        <p class="pricing-editor__preview-note">{{ runtimePreview.emptyLabel }}</p>
      }
      @if (runtimeAssetBillingExplanation(runtimePreview); as billingExplanation) {
        <p class="pricing-editor__preview-note pricing-editor__preview-note--billing">
          {{ billingExplanation }}
        </p>
      }
      <div class="pricing-editor__preview-total">
        <span>{{ 'event.editor.pricing.final.price' | i18n }}</span>
        <strong>{{ runtimeTotalLabel(runtimePreview) }}</strong>
      </div>
    } @else {
      <div class="pricing-editor__preview-line">
        <span>{{ pricingBaseSummaryLabel() | i18n }}</span>
        <strong>{{ currencySymbol(workingPricing.currency) }}{{ currentPreview.basePrice | number:'1.0-2' }}</strong>
      </div>
      @if (currentPreview.quantityDelta !== 0) {
        <div class="pricing-editor__preview-line">
          <span>{{ currentPreview.quantityLabel || 'Quantity pricing' }}</span>
          <strong [class.positive]="currentPreview.quantityDelta > 0" [class.negative]="currentPreview.quantityDelta < 0">
            {{ currentPreview.quantityDelta > 0 ? '+' : '' }}{{ currencySymbol(workingPricing.currency) }}{{ currentPreview.quantityDelta | number:'1.0-2' }}
          </strong>
        </div>
      }
      @if (currentPreview.demandDelta !== 0) {
        <div class="pricing-editor__preview-line">
          <span>{{ 'pricing.demand.adjustment' | i18n }}</span>
          <strong [class.positive]="currentPreview.demandDelta > 0" [class.negative]="currentPreview.demandDelta < 0">
            {{ currentPreview.demandDelta > 0 ? '+' : '' }}{{ currencySymbol(workingPricing.currency) }}{{ currentPreview.demandDelta | number:'1.0-2' }}
          </strong>
        </div>
      }
      @if (currentPreview.timeDelta !== 0) {
        <div class="pricing-editor__preview-line">
          <span>{{ 'pricing.time.adjustment' | i18n }}</span>
          <strong [class.positive]="currentPreview.timeDelta > 0" [class.negative]="currentPreview.timeDelta < 0">
            {{ currentPreview.timeDelta > 0 ? '+' : '' }}{{ currencySymbol(workingPricing.currency) }}{{ currentPreview.timeDelta | number:'1.0-2' }}
          </strong>
        </div>
      }
      <div class="pricing-editor__preview-details">
        @for (item of pricingSummaryItems(); track item.id) {
          <article class="pricing-editor__preview-detail">
            <span>
              <strong>{{ item.label | i18n }}</strong>
              @if (item.detail) {
                <em>{{ item.detail | i18n }}</em>
              }
            </span>
            <strong>{{ item.value | i18n }}</strong>
          </article>
        }
      </div>
      <div class="pricing-editor__preview-total">
        <span>{{ 'event.editor.pricing.final.price' | i18n }}</span>
        <strong>{{ currencySymbol(workingPricing.currency) }}{{ currentPreview.finalPrice | number:'1.0-2' }}</strong>
      </div>
    }
  </div>
</ng-template>
`, styles: ["/* src/app/shared/ui/components/core/form/inputs/pricing-editor/pricing-editor.component.scss */\n:host {\n  display: block;\n  width: 100%;\n  container-type: inline-size;\n  min-width: 0;\n}\n.pricing-editor {\n  display: grid;\n  min-width: 0;\n  gap: 1rem;\n  padding: 1rem;\n  border-radius: 24px;\n  border: 1px solid rgba(143, 168, 201, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.97) 0%,\n      rgba(245, 249, 255, 0.94) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(113, 193, 177, 0.12),\n      transparent 34%),\n    radial-gradient(\n      circle at bottom left,\n      rgba(135, 175, 226, 0.12),\n      transparent 42%);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 18px 42px rgba(32, 57, 92, 0.08);\n}\n.pricing-editor--summary-popup {\n  gap: 0.62rem;\n  padding: 0.62rem 0.72rem;\n  border-radius: 16px;\n  border-color: rgba(109, 149, 143, 0.24);\n}\n.pricing-editor--summary-popup.pricing-editor--enabled {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(241, 250, 247, 0.97) 0%,\n      rgba(231, 243, 239, 0.94) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(117, 194, 169, 0.18),\n      transparent 34%),\n    radial-gradient(\n      circle at bottom left,\n      rgba(125, 170, 221, 0.14),\n      transparent 42%);\n}\n.pricing-editor--summary-popup:not(.pricing-editor--enabled) {\n  border-color: rgba(128, 147, 175, 0.22);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(247, 250, 254, 0.97) 0%,\n      rgba(237, 243, 249, 0.94) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(146, 165, 194, 0.1),\n      transparent 36%);\n}\n.pricing-editor--embedded {\n  height: 100%;\n  min-height: 0;\n  padding: 0;\n  border: 0;\n  border-radius: 0;\n  background: transparent;\n  box-shadow: none;\n  overflow: hidden;\n}\n.pricing-editor--summary-popup.pricing-editor--enabled .pricing-editor__title-text,\n.pricing-editor--summary-popup.pricing-editor--enabled .pricing-editor__title-text mat-icon {\n  color: #235d53;\n}\n.pricing-editor--summary-popup.pricing-editor--enabled .pricing-editor__preview-card {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.94) 0%,\n      rgba(245, 251, 248, 0.9) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(118, 198, 175, 0.14),\n      transparent 44%);\n}\n.pricing-editor--summary-popup.pricing-editor--enabled .pricing-editor__preview-card--light {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.94) 0%,\n      rgba(247, 251, 250, 0.9) 100%),\n    radial-gradient(\n      circle at bottom left,\n      rgba(133, 176, 227, 0.1),\n      transparent 48%);\n}\n.pricing-editor__head {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: start;\n  gap: 0.75rem;\n}\n.pricing-editor--summary-popup .pricing-editor__head {\n  gap: 0.62rem;\n}\n.pricing-editor__head-actions {\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.7rem;\n  flex-wrap: wrap;\n  justify-self: end;\n  align-self: start;\n}\n.pricing-editor--summary-popup .pricing-editor__head-actions {\n  gap: 0.5rem;\n}\n.pricing-editor__title {\n  min-width: 0;\n}\n.pricing-editor__title-copy {\n  display: grid;\n  min-width: 0;\n}\n.pricing-editor__title-text {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n  color: #213a5b;\n  font-size: 1rem;\n  font-weight: 800;\n}\n.pricing-editor__title-text mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.pricing-editor__subtitle {\n  color: rgba(37, 58, 88, 0.74);\n  font-size: 0.8rem;\n  line-height: 1.4;\n}\n.pricing-editor__status,\n.pricing-editor__toggle,\n.pricing-editor__add-btn,\n.pricing-editor__rule-remove,\n.pricing-editor__open-btn {\n  border: 0;\n  transition:\n    transform 0.18s ease,\n    box-shadow 0.18s ease,\n    background-color 0.18s ease,\n    opacity 0.18s ease;\n}\n.pricing-editor__status,\n.pricing-editor__toggle {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.4rem;\n  padding: 0.36rem 0.64rem;\n  border-radius: 999px;\n  font-size: 0.84rem;\n  font-weight: 800;\n}\n.pricing-editor__status {\n  color: #61748d;\n  background: rgba(239, 244, 251, 0.95);\n  box-shadow: inset 0 0 0 1px rgba(128, 149, 176, 0.24);\n}\n.pricing-editor__status.is-dynamic,\n.pricing-editor__toggle.is-on {\n  color: #23695f;\n  background: rgba(230, 247, 241, 0.95);\n  box-shadow: inset 0 0 0 1px rgba(85, 175, 147, 0.24);\n}\n.pricing-editor__toggle {\n  cursor: pointer;\n  color: #61748d;\n  background: rgba(239, 244, 251, 0.95);\n  border: 1px solid rgba(128, 149, 176, 0.24);\n  box-shadow: inset 0 0 0 0 rgba(0, 0, 0, 0);\n}\n.pricing-editor__toggle--header {\n  min-width: 82px;\n  min-height: 38px;\n  padding: 0.3rem 0.62rem;\n  border-radius: 999px;\n  font-size: 0.76rem;\n  font-weight: 800;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n  box-shadow: 0 2px 7px rgba(29, 53, 86, 0.08);\n}\n.pricing-editor__toggle--header.is-on {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf8ee 0%,\n      #ddf1e2 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.pricing-editor__toggle--header:not(.is-on) {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f7fb 0%,\n      #e9eff7 100%);\n  border-color: rgba(86, 108, 145, 0.22);\n  color: #5b6e8e;\n}\n.pricing-editor__toggle mat-icon,\n.pricing-editor__status mat-icon {\n  width: 24px;\n  height: 24px;\n  font-size: 24px;\n}\n.pricing-editor__toggle--header mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.pricing-editor__open-btn {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.5rem;\n  min-height: 40px;\n  padding: 0.62rem 0.9rem;\n  border-radius: 14px;\n  color: #214863;\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #eff6ff 100%);\n  box-shadow: inset 0 0 0 1px rgba(99, 137, 184, 0.26), 0 10px 22px rgba(31, 58, 97, 0.08);\n  cursor: pointer;\n  font-size: 0.86rem;\n  font-weight: 800;\n}\n.pricing-editor__open-btn mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.pricing-editor__summary-copy {\n  display: grid;\n  gap: 0.35rem;\n}\n.pricing-editor__summary-actions {\n  display: flex;\n  justify-content: flex-start;\n}\n.pricing-editor__open-btn--summary {\n  min-width: 138px;\n  min-height: 38px;\n  padding: 0.42rem 0.82rem;\n  border-radius: 999px;\n  font-size: 0.8rem;\n  box-shadow: 0 2px 7px rgba(29, 53, 86, 0.08);\n}\n.pricing-editor__layout {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(240px, 300px);\n  gap: 1rem;\n  align-items: start;\n}\n.pricing-editor--embedded .pricing-editor__layout {\n  height: 100%;\n  min-height: 0;\n  overflow-y: auto;\n  overflow-x: hidden;\n  padding: 0.12rem 0 0.8rem;\n  box-sizing: border-box;\n  scrollbar-width: thin;\n  scrollbar-color: #8aa0b8 #eaf1fa;\n}\n.pricing-editor__main {\n  display: grid;\n  gap: 0.92rem;\n}\n.pricing-editor__surface {\n  display: grid;\n  position: relative;\n  z-index: 0;\n  gap: 0.86rem;\n  padding: 1rem;\n  border-radius: 20px;\n  border: 1px solid rgba(136, 161, 195, 0.28);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.98) 0%,\n      rgba(250, 252, 255, 0.94) 100%),\n    radial-gradient(\n      circle at top left,\n      rgba(127, 174, 227, 0.1),\n      transparent 46%);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);\n  contain: layout;\n  transform: translateZ(0);\n  backface-visibility: hidden;\n}\n.pricing-editor__section-head {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.8rem;\n  color: #1f3b5a;\n  font-size: 0.95rem;\n  font-weight: 900;\n}\n.pricing-editor__section-head > span {\n  min-width: 0;\n}\n.pricing-editor__section-head .pricing-editor__toggle {\n  justify-self: end;\n}\n.pricing-editor__toggle:disabled {\n  cursor: default;\n  opacity: 0.66;\n  pointer-events: none;\n  filter: saturate(0.66);\n  box-shadow: none;\n}\n.pricing-editor__add-btn:disabled,\n.pricing-editor__rule-remove:disabled,\n.pricing-editor__open-btn:disabled {\n  cursor: default;\n  opacity: 0.58;\n  pointer-events: none;\n  filter: grayscale(0.35);\n  box-shadow: none;\n}\n.pricing-editor--readonly .pricing-editor__summary-actions {\n  display: none;\n}\n:host-context(.popup-panel-event-editor-readonly) .pricing-editor__summary-actions {\n  display: none;\n}\n:host-context(.popup-panel-event-editor-readonly) .pricing-editor__toggle,\n:host-context(.popup-panel-event-editor-readonly) .pricing-editor__add-btn,\n:host-context(.popup-panel-event-editor-readonly) .pricing-editor__rule-remove,\n:host-context(.popup-panel-event-editor-readonly) .pricing-editor__open-btn {\n  cursor: default;\n  opacity: 0.58;\n  pointer-events: none;\n  filter: grayscale(0.35);\n  box-shadow: none;\n}\n:host-context(.popup-panel-event-editor-readonly) .pricing-editor__toggle {\n  opacity: 0.66;\n  filter: saturate(0.66);\n}\n.pricing-editor__grid,\n.pricing-editor__rule-grid,\n.pricing-editor__promo-card {\n  display: grid;\n  column-gap: 1rem;\n  row-gap: 1rem;\n}\n.pricing-editor__grid {\n  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));\n}\n.pricing-editor__rule-grid {\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));\n}\n.pricing-editor__rule-grid.pricing-editor__rule-grid--slots {\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 190px), 1fr));\n}\n.pricing-editor__rule-grid--time:not(.pricing-editor__rule-grid--slots) {\n  grid-template-columns: minmax(260px, 1.55fr) minmax(82px, 0.48fr) minmax(210px, 1.2fr) minmax(92px, 0.52fr);\n}\n.pricing-editor__rule-grid--time.pricing-editor__rule-grid--slots {\n  grid-template-columns: minmax(230px, 1.5fr) minmax(78px, 0.46fr) minmax(195px, 1.18fr) minmax(88px, 0.5fr) minmax(150px, 0.9fr);\n}\n.pricing-editor__rule-grid--time .pricing-editor__field--time-trigger,\n.pricing-editor__rule-grid--time .pricing-editor__field--time-action {\n  min-width: 0;\n}\n.pricing-editor__rule-grid--time .pricing-editor__field--time-offset,\n.pricing-editor__rule-grid--time .pricing-editor__field--time-value {\n  min-width: 0;\n}\n.pricing-editor__promo-card {\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));\n}\n.pricing-editor__grid--compact {\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));\n}\n.pricing-editor__field {\n  display: grid;\n  gap: 0.34rem;\n  min-width: 0;\n}\n.pricing-editor__field--span-full {\n  grid-column: 1/-1;\n}\n.pricing-editor__field > span {\n  color: rgba(31, 57, 88, 0.9);\n  font-size: 0.74rem;\n  font-weight: 800;\n  letter-spacing: 0.01em;\n  text-transform: uppercase;\n}\n.pricing-editor__field > .pricing-editor__field-error {\n  color: #9b3447;\n  text-transform: none;\n}\n.pricing-editor__field input,\n.pricing-editor__select-shell,\n.pricing-editor__money-field,\n.pricing-editor__date-range-field {\n  box-sizing: border-box;\n  width: 100%;\n  min-height: 46px;\n  border-radius: 14px;\n  border: 1px solid rgba(126, 149, 180, 0.28);\n  background: rgba(255, 255, 255, 0.98);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92);\n}\n.pricing-editor__field input {\n  box-sizing: border-box;\n  width: 100%;\n  min-width: 0;\n  text-align: center;\n  color: #213d5d;\n  font: inherit;\n  font-size: 0.96rem;\n  font-weight: 700;\n}\n.pricing-editor__field input:focus {\n  outline: none;\n  border-color: rgba(72, 125, 194, 0.66);\n  box-shadow: 0 0 0 3px rgba(89, 136, 204, 0.12);\n}\n.pricing-editor__date-range-field {\n  width: 100%;\n  min-width: 0;\n  min-height: 0;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  box-shadow: none;\n}\n.pricing-editor__date-range-field ::ng-deep .mat-mdc-text-field-wrapper {\n  display: flex;\n  align-items: center;\n  min-height: 46px;\n  height: 46px;\n  padding: 0 0.08rem 0 0.42rem;\n  border-radius: 14px;\n  background: rgba(255, 255, 255, 0.98);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92);\n  overflow: visible;\n}\n.pricing-editor__date-range-field ::ng-deep .mat-mdc-form-field-flex,\n.pricing-editor__date-range-field ::ng-deep .mat-date-range-input-container {\n  min-height: 46px;\n  height: 46px;\n  align-items: center;\n  min-width: 0;\n}\n.pricing-editor__date-range-field ::ng-deep .mat-date-range-input-container {\n  width: 100%;\n  display: flex;\n  align-items: center;\n  gap: 0.08rem;\n  overflow: visible;\n}\n.pricing-editor__date-range-field ::ng-deep .mat-mdc-form-field-infix {\n  width: auto !important;\n  min-width: 0;\n  min-height: 0;\n  height: 46px;\n  padding: 0;\n  flex: 1 1 auto;\n  display: flex;\n  align-items: center;\n}\n.pricing-editor__date-range-field ::ng-deep .mat-date-range-input-separator {\n  color: rgba(64, 87, 117, 0.72);\n  padding: 0 0.02rem;\n  margin: 0;\n  white-space: nowrap;\n  flex: 0 0 auto;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  line-height: 46px;\n}\n.pricing-editor__date-range-field ::ng-deep .mdc-notched-outline__leading,\n.pricing-editor__date-range-field ::ng-deep .mdc-notched-outline__notch,\n.pricing-editor__date-range-field ::ng-deep .mdc-notched-outline__trailing {\n  border-color: rgba(126, 149, 180, 0.28);\n}\n.pricing-editor__date-range-field ::ng-deep .mat-mdc-form-field-subscript-wrapper {\n  display: none;\n}\n.pricing-editor__date-range-field ::ng-deep .mat-date-range-input-wrapper,\n.pricing-editor__date-range-field ::ng-deep .mat-date-range-input-start-wrapper,\n.pricing-editor__date-range-field ::ng-deep .mat-date-range-input-end-wrapper {\n  display: flex;\n  align-items: center;\n  flex: 1 1 0;\n  min-width: 0;\n  width: 100%;\n  max-width: none;\n  min-height: 46px;\n  height: 46px;\n  overflow: visible;\n}\n.pricing-editor__date-range-field ::ng-deep .mat-date-range-input-start-wrapper {\n  justify-content: flex-end;\n}\n.pricing-editor__date-range-field ::ng-deep .mat-date-range-input-end-wrapper {\n  justify-content: flex-start;\n}\n.pricing-editor__date-range-field ::ng-deep .mat-date-range-input-mirror {\n  min-height: 46px;\n  height: 46px;\n  display: inline-flex;\n  align-items: center;\n  line-height: 46px;\n}\n.pricing-editor__date-range-field.mat-focused ::ng-deep .mdc-notched-outline__leading,\n.pricing-editor__date-range-field.mat-focused ::ng-deep .mdc-notched-outline__notch,\n.pricing-editor__date-range-field.mat-focused ::ng-deep .mdc-notched-outline__trailing {\n  border-color: rgba(72, 125, 194, 0.66);\n}\n.pricing-editor__date-range-field ::ng-deep .mat-date-range-input-inner,\n.pricing-editor__date-range-field ::ng-deep input {\n  min-width: 0;\n  width: 100%;\n  min-height: 0;\n  height: 100% !important;\n  padding: 0 0.04rem;\n  color: #213d5d;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 700;\n  line-height: 46px;\n  box-sizing: border-box;\n  background: transparent !important;\n  border: 0 !important;\n  border-radius: 0 !important;\n  box-shadow: none !important;\n  align-self: stretch;\n  display: block;\n  white-space: nowrap;\n  text-overflow: clip;\n  overflow: hidden;\n}\n.pricing-editor__date-range-field ::ng-deep .mat-date-range-input-start-wrapper .mat-date-range-input-inner,\n.pricing-editor__date-range-field ::ng-deep .mat-date-range-input-start-wrapper input {\n  text-align: center;\n}\n.pricing-editor__date-range-field ::ng-deep .mat-date-range-input-end-wrapper .mat-date-range-input-inner,\n.pricing-editor__date-range-field ::ng-deep .mat-date-range-input-end-wrapper input {\n  text-align: center;\n}\n.pricing-editor__date-range-field ::ng-deep .mat-mdc-form-field-flex {\n  min-height: 46px;\n  height: 46px;\n  display: flex;\n  align-items: center !important;\n}\n.pricing-editor__date-range-field ::ng-deep .mat-mdc-form-field-icon-suffix,\n.pricing-editor__date-range-field ::ng-deep .mat-datepicker-toggle {\n  align-self: center;\n  flex: 0 0 32px;\n  width: 32px;\n  min-width: 32px;\n}\n.pricing-editor__date-range-field ::ng-deep .mat-mdc-icon-button {\n  width: 32px;\n  height: 32px;\n  padding: 4px;\n}\n.pricing-editor__select-shell {\n  display: flex;\n  align-items: center;\n  padding: 0 0.7rem;\n}\n.pricing-editor__select-shell--static {\n  justify-content: center;\n  color: #213d5d;\n  font-weight: 700;\n}\n.pricing-editor__select-shell ::ng-deep .mat-mdc-select-trigger {\n  min-height: 44px;\n}\n.pricing-editor__money-field {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.48rem;\n  padding: 0 0.72rem;\n}\n.pricing-editor__money-prefix,\n.pricing-editor__money-code {\n  color: rgba(65, 86, 115, 0.78);\n  font-size: 0.84rem;\n  font-weight: 800;\n}\n.pricing-editor__money-field input {\n  padding: 0;\n  border: 0;\n  background: transparent;\n  box-shadow: none;\n}\n.pricing-editor__rules,\n.pricing-editor__promo-list {\n  display: grid;\n  gap: 1.08rem;\n}\n.pricing-editor__promo-list {\n  margin-top: 0.28rem;\n}\n.pricing-editor__rule-card,\n.pricing-editor__promo-card {\n  box-sizing: border-box;\n  position: relative;\n  z-index: 0;\n  align-items: end;\n  padding: 0.86rem;\n  border-radius: 18px;\n  border: 1px solid rgba(125, 151, 185, 0.24);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.98) 0%,\n      rgba(246, 250, 255, 0.92) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(110, 183, 172, 0.12),\n      transparent 36%);\n  transform: translateZ(0);\n  backface-visibility: hidden;\n  contain: layout;\n}\n.pricing-editor__rule-card {\n  padding-right: 3.2rem;\n}\n.pricing-editor__promo-card {\n  padding-right: 3.2rem;\n}\n.pricing-editor__rule-remove {\n  position: absolute;\n  top: 0.75rem;\n  right: 0.75rem;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  cursor: pointer;\n  color: #b4233a;\n  background: rgba(255, 235, 238, 0.96);\n  box-shadow: inset 0 0 0 1px rgba(214, 64, 88, 0.26);\n}\n.pricing-editor__rule-remove:hover {\n  color: #9f1830;\n  background: rgba(255, 224, 229, 0.98);\n  box-shadow: inset 0 0 0 1px rgba(214, 64, 88, 0.34), 0 10px 20px rgba(173, 38, 60, 0.16);\n}\n.pricing-editor__rule-remove mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.pricing-editor__add-btn {\n  justify-self: start;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.45rem;\n  padding: 0.68rem 0.94rem;\n  border-radius: 14px;\n  cursor: pointer;\n  color: #214863;\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #eff6ff 100%);\n  box-shadow: inset 0 0 0 1px rgba(99, 137, 184, 0.26), 0 10px 22px rgba(31, 58, 97, 0.08);\n  font-size: 0.88rem;\n  font-weight: 800;\n}\n.pricing-editor__add-btn mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.pricing-editor__hint {\n  margin: 0;\n  color: rgba(69, 88, 113, 0.8);\n  font-size: 0.86rem;\n  line-height: 1.55;\n}\n.pricing-editor__preview-note--billing {\n  margin: 0;\n  padding: 0.62rem 0.72rem;\n  border-radius: 10px;\n  background: rgba(30, 132, 111, 0.08);\n  color: rgba(33, 92, 80, 0.92);\n  font-size: 0.8rem;\n  line-height: 1.45;\n}\n.pricing-editor__preview {\n  display: grid;\n  gap: 0.82rem;\n  min-width: 0;\n  transform: translateZ(0);\n  backface-visibility: hidden;\n}\n.pricing-editor__preview--summary {\n  grid-template-columns: minmax(0, 1fr);\n  margin-block-start: var(--pricing-summary-preview-offset, 0);\n}\n.pricing-editor__preview-card {\n  display: grid;\n  gap: 0.72rem;\n  min-width: 0;\n  padding: 1rem;\n  border-radius: 20px;\n  border: 1px solid rgba(126, 152, 188, 0.28);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.98) 0%,\n      rgba(247, 251, 255, 0.94) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(118, 198, 175, 0.15),\n      transparent 44%);\n}\n.pricing-editor__preview-card--light {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.98) 0%,\n      rgba(250, 252, 255, 0.95) 100%),\n    radial-gradient(\n      circle at bottom left,\n      rgba(133, 176, 227, 0.12),\n      transparent 48%);\n}\n.pricing-editor__preview-head,\n.pricing-editor__preview-line,\n.pricing-editor__preview-total {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.7rem;\n}\n.pricing-editor__preview-head {\n  color: #233d5d;\n  font-size: 0.9rem;\n  font-weight: 900;\n}\n.pricing-editor__preview-line {\n  color: rgba(56, 78, 108, 0.86);\n  font-size: 0.9rem;\n}\n.pricing-editor__preview-total {\n  padding-top: 0.72rem;\n  border-top: 1px solid rgba(136, 157, 186, 0.22);\n  color: #21425f;\n  font-size: 1rem;\n  font-weight: 900;\n}\n.pricing-editor__preview-total strong {\n  color: #20806d;\n  font-size: 1.55rem;\n  line-height: 1;\n}\n.pricing-editor__preview-line strong.positive {\n  color: #22856f;\n}\n.pricing-editor__preview-line strong.negative {\n  color: #b04d4d;\n}\n.pricing-editor__preview-note {\n  margin: 0;\n  color: rgba(57, 82, 113, 0.8);\n  font-size: 0.84rem;\n  line-height: 1.55;\n}\n.pricing-editor__preview-details {\n  display: grid;\n  gap: 0.42rem;\n  padding-top: 0.72rem;\n  border-top: 1px solid rgba(136, 157, 186, 0.18);\n}\n.pricing-editor__preview-detail {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.8rem;\n  min-width: 0;\n  color: rgba(57, 82, 113, 0.82);\n  font-size: 0.84rem;\n}\n.pricing-editor__preview-detail > span {\n  display: grid;\n  gap: 0.12rem;\n  min-width: 0;\n}\n.pricing-editor__preview-detail strong {\n  color: #233d5d;\n  font-weight: 900;\n}\n.pricing-editor__preview-detail em {\n  overflow: hidden;\n  color: rgba(65, 87, 116, 0.76);\n  font-style: normal;\n  line-height: 1.35;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.pricing-editor__wizard-body,\n.pricing-editor__wizard-body .pricing-editor__main,\n.pricing-editor__wizard-body .pricing-editor__preview {\n  min-width: 0;\n  will-change: transform, scroll-position;\n  transform: translateZ(0);\n  -webkit-transform: translate3d(0, 0, 0);\n  backface-visibility: hidden;\n}\n.pricing-editor__wizard-body {\n  container-type: inline-size;\n  box-sizing: border-box;\n  width: 100%;\n  max-width: 100%;\n  height: 100%;\n  min-height: 0;\n  display: grid;\n  align-content: start;\n  gap: 0.92rem;\n  overflow-x: hidden;\n  overflow-y: auto;\n  padding: 0.12rem 0 0.8rem;\n  scrollbar-width: thin;\n  scrollbar-color: #8aa0b8 #eaf1fa;\n  scrollbar-gutter: stable;\n}\n.pricing-editor__wizard-body .pricing-editor__main {\n  width: 100%;\n}\n.pricing-editor__preview--wizard-sticky {\n  position: sticky;\n  top: -0.12rem;\n  z-index: 2;\n  align-self: start;\n  margin-top: -0.12rem;\n  padding-top: 0.12rem;\n  padding-bottom: 0.18rem;\n  will-change: transform;\n  transform: translateZ(0);\n  backface-visibility: hidden;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(249, 252, 255, 0.98) 0%,\n      rgba(249, 252, 255, 0.88) 100%);\n}\n@container (max-width: 760px) {\n  .pricing-editor__layout {\n    grid-template-columns: 1fr;\n  }\n  .pricing-editor--summary-popup .pricing-editor__head {\n    grid-template-columns: minmax(0, 1fr) auto;\n    align-items: start;\n  }\n  .pricing-editor--summary-popup .pricing-editor__head-actions {\n    justify-self: end;\n  }\n  .pricing-editor__grid,\n  .pricing-editor__grid--compact,\n  .pricing-editor__rule-grid,\n  .pricing-editor__rule-grid--time:not(.pricing-editor__rule-grid--slots),\n  .pricing-editor__rule-grid--time.pricing-editor__rule-grid--slots,\n  .pricing-editor__promo-card,\n  .pricing-editor__preview {\n    grid-template-columns: 1fr;\n  }\n  .pricing-editor__surface {\n    padding: 0.82rem;\n    gap: 0.72rem;\n  }\n  .pricing-editor__mode-switch {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    gap: 0.24rem;\n    padding: 0.22rem;\n  }\n  .pricing-editor__mode-btn {\n    min-height: 38px;\n    padding: 0 0.2rem;\n    font-size: 0.76rem;\n    line-height: 1.1;\n  }\n  .pricing-editor__field > span {\n    font-size: 0.68rem;\n  }\n  .pricing-editor__field input,\n  .pricing-editor__select-shell,\n  .pricing-editor__money-field {\n    min-height: 42px;\n  }\n  .pricing-editor__select-shell ::ng-deep .mat-mdc-select-trigger {\n    min-height: 40px;\n  }\n  .pricing-editor__open-btn--summary {\n    width: 100%;\n    justify-content: center;\n  }\n}\n@media (max-width: 760px) {\n  .pricing-editor__preview--summary {\n    grid-template-columns: 1fr;\n  }\n  .pricing-editor__wizard-body {\n    padding: 0.08rem 0.2rem 0.72rem 0.08rem;\n  }\n  .pricing-editor__preview--wizard-sticky {\n    top: -0.08rem;\n    margin-top: -0.08rem;\n    padding-top: 0.08rem;\n  }\n}\n/*# sourceMappingURL=pricing-editor.component.css.map */\n"] }]
  }], () => [{ type: ChangeDetectorRef }], { config: [{
    type: Input
  }], readOnly: [{
    type: Input
  }], disabled: [{
    type: Input
  }], pricingMaximumInput: [{
    type: ViewChild,
    args: ["pricingMaximumInput"]
  }], onEscape: [{
    type: HostListener,
    args: ["document:keydown.escape", ["$event"]]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PricingEditorInputComponent, { className: "PricingEditorInputComponent", filePath: "app/shared/ui/components/core/form/inputs/pricing-editor/pricing-editor.component.ts", lineNumber: 160 });
})();

export {
  MatSelect,
  MatSelectModule,
  PricingSlotPanelComponent,
  PricingEditorInputComponent
};
//# sourceMappingURL=chunk-PSPTYTHW.js.map
