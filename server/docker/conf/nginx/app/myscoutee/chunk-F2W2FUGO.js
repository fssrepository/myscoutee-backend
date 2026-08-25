import {
  LinkInputComponent
} from "./chunk-JEQIAF2O.js";
import {
  ImageCarouselComponent
} from "./chunk-ZDU2SHFL.js";
import {
  EventPolicySingleRowConverter,
  formFlowCompletionPercent,
  formFlowIsControlMissingRequired,
  formFlowMissingRequiredControls
} from "./chunk-LMI5U4C3.js";
import {
  ImageCardComponent,
  SingleRowComponent
} from "./chunk-XXLX3JOX.js";
import {
  InfoCardComponent,
  UiTaskScheduler
} from "./chunk-LXXIK2TC.js";
import {
  PricingEditorInputComponent
} from "./chunk-4Y2QOH73.js";
import {
  FormFlowPopupStore
} from "./chunk-JZX2N7XM.js";
import {
  DateInputComponent,
  PopupComponent
} from "./chunk-GBRBIJ5J.js";
import {
  AppMenuComponent,
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormsModule,
  I18nPipe,
  IndicatorComponent,
  NG_VALUE_ACCESSOR,
  NgControlStatus,
  NgModel
} from "./chunk-QD6QQNQX.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-EDHGCWPF.js";
import {
  I18nService
} from "./chunk-B7YPVC5F.js";
import {
  CommonModule,
  NgClass,
  NgComponentOutlet,
  NgTemplateOutlet
} from "./chunk-J7IJFFQ2.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
  __spreadProps,
  __spreadValues,
  computed,
  effect,
  forwardRef,
  inject,
  setClassMetadata,
  untracked,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵcomponentInstance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdeclareLet,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinterpolate1,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵreadContextLet,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵresolveDocument,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstoreLet,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵviewQuery
} from "./chunk-XJL7SWH7.js";

// src/app/shared/ui/components/core/form/inputs/location-input/location-input.component.ts
function LocationInputComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 2);
    \u0275\u0275text(1, "*");
    \u0275\u0275elementEnd();
  }
}
var LocationInputComponent = class _LocationInputComponent {
  config = {};
  readOnly = false;
  disabled = false;
  value = "";
  controlDisabled = false;
  onValueChange = () => void 0;
  onTouched = () => void 0;
  writeValue(value) {
    this.value = this.toText(value);
  }
  registerOnChange(fn) {
    this.onValueChange = fn;
  }
  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled) {
    this.controlDisabled = isDisabled;
  }
  label() {
    return this.toText(this.resolveConfigValue(this.config.label)) || "Location";
  }
  placeholder() {
    return this.toText(this.resolveConfigValue(this.config.placeholder));
  }
  required() {
    return this.resolveConfigValue(this.config.required) === true;
  }
  inputDisabled() {
    return this.readOnly || this.disabled || this.controlDisabled;
  }
  actionDisabled() {
    return this.disabled || this.controlDisabled;
  }
  updateValue(value) {
    if (this.inputDisabled()) {
      return;
    }
    const nextValue = this.toText(value);
    this.value = nextValue;
    this.onValueChange(nextValue);
  }
  markTouched() {
    this.onTouched();
  }
  mapMenuItems() {
    const href = this.mapsUrl();
    return [{
      id: "location-map",
      icon: this.mapIcon(),
      layout: "action",
      palette: "orange",
      ariaLabel: this.mapAriaLabel(),
      href: href || void 0,
      target: "_blank",
      rel: "noopener,noreferrer",
      disabled: this.actionDisabled() || !href
    }];
  }
  mapIcon() {
    return this.mapStops().length > 1 ? "route" : "location_on";
  }
  mapAriaLabel() {
    return this.toText(this.resolveConfigValue(this.config.mapAriaLabel)) || "Open location on map";
  }
  mapsUrl() {
    const stops = this.mapStops();
    if (stops.length === 0) {
      return "";
    }
    const requestedMode = this.resolveMapMode();
    const mode = requestedMode === "auto" ? stops.length > 1 ? "directions" : "search" : requestedMode;
    if (mode === "directions" && stops.length > 1) {
      const [origin, ...rest] = stops;
      const destination = rest[rest.length - 1] ?? origin;
      const waypoints = rest.slice(0, -1);
      let url = `https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
      if (waypoints.length > 0) {
        url += `&waypoints=${encodeURIComponent(waypoints.join("|"))}`;
      }
      return url;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stops[0])}`;
  }
  mapStops() {
    const configuredStops = this.normalizeStops(this.resolveConfigValue(this.config.routeStops));
    const stops = configuredStops.length > 0 ? configuredStops : [this.value];
    return Array.from(new Set(this.normalizeStops(stops)));
  }
  normalizeStops(value) {
    if (!Array.isArray(value)) {
      return [];
    }
    return value.map((item) => this.toText(item).trim()).filter((item) => item.length > 0);
  }
  resolveMapMode() {
    const mode = this.resolveConfigValue(this.config.mapMode);
    return mode === "search" || mode === "directions" ? mode : "auto";
  }
  resolveConfigValue(value) {
    return typeof value === "function" ? value() : value;
  }
  toText(value) {
    return `${value ?? ""}`;
  }
  static \u0275fac = function LocationInputComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LocationInputComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LocationInputComponent, selectors: [["app-location-input"]], inputs: { config: "config", readOnly: "readOnly", disabled: "disabled" }, features: [\u0275\u0275ProvidersFeature([
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => _LocationInputComponent),
      multi: true
    }
  ])], decls: 8, vars: 11, consts: [[1, "location-input"], [1, "location-input__label"], [1, "location-input__required"], [1, "location-input__row"], ["type", "text", 3, "ngModelChange", "blur", "ngModel", "readonly", "disabled", "placeholder"], ["kind", "inline", 1, "location-input__map-menu", 3, "itemSelect", "items"]], template: function LocationInputComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "label", 0)(1, "span", 1)(2, "span");
      \u0275\u0275text(3);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(4, LocationInputComponent_Conditional_4_Template, 2, 0, "span", 2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "span", 3)(6, "input", 4);
      \u0275\u0275listener("ngModelChange", function LocationInputComponent_Template_input_ngModelChange_6_listener($event) {
        return ctx.updateValue($event);
      })("blur", function LocationInputComponent_Template_input_blur_6_listener() {
        return ctx.markTouched();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "app-menu", 5);
      \u0275\u0275listener("itemSelect", function LocationInputComponent_Template_app_menu_itemSelect_7_listener() {
        return ctx.markTouched();
      });
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275classProp("location-input--readonly", ctx.readOnly)("location-input--disabled", ctx.actionDisabled());
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.label());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.required() ? 4 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngModel", ctx.value)("readonly", ctx.readOnly)("disabled", ctx.inputDisabled())("placeholder", ctx.placeholder());
      \u0275\u0275advance();
      \u0275\u0275property("items", ctx.mapMenuItems());
    }
  }, dependencies: [CommonModule, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, AppMenuComponent], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n.location-input[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.38rem;\n  min-width: 0;\n}\n.location-input__label[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: baseline;\n  gap: 0.18rem;\n  color: #223550;\n  font-size: 0.86rem;\n  font-weight: 800;\n}\n.location-input__required[_ngcontent-%COMP%] {\n  color: #b93243;\n}\n.location-input__row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.62rem;\n  min-width: 0;\n}\n.location-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  width: 100%;\n  min-width: 0;\n  min-height: 40px;\n  border: 1px solid rgba(136, 156, 186, 0.5);\n  border-radius: 10px;\n  background: #fff;\n  color: #1d3556;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  transition: border-color 0.15s ease, box-shadow 0.15s ease;\n}\n.location-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n  outline: 0;\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n}\n.form-flow__control.is-required-missing[_nghost-%COMP%]   .location-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], .form-flow__control.is-required-missing   [_nghost-%COMP%]   .location-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  border-color: #ef9a9a;\n  background: #fff1f1;\n}\n.location-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:read-only, \n.location-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:disabled {\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9fc 0%,\n      #edf2f7 100%);\n  border-color: rgba(122, 140, 168, 0.42);\n  color: rgba(58, 76, 103, 0.9);\n  -webkit-text-fill-color: rgba(58, 76, 103, 0.9);\n}\n.location-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:read-only:focus, \n.location-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:disabled:focus {\n  border-color: rgba(122, 140, 168, 0.42);\n  box-shadow: none;\n}\n.form-flow__control.is-required-missing[_nghost-%COMP%]   .location-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:read-only, .form-flow__control.is-required-missing   [_nghost-%COMP%]   .location-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:read-only, \n.form-flow__control.is-required-missing[_nghost-%COMP%]   .location-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:disabled, .form-flow__control.is-required-missing   [_nghost-%COMP%]   .location-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:disabled {\n  border-color: #ef9a9a;\n  background: #fff1f1;\n}\n.location-input__map-menu[_ngcontent-%COMP%] {\n  width: 32px;\n  min-width: 32px;\n}\n.location-input--disabled[_ngcontent-%COMP%] {\n  opacity: 0.72;\n}\n/*# sourceMappingURL=location-input.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LocationInputComponent, [{
    type: Component,
    args: [{ selector: "app-location-input", standalone: true, imports: [CommonModule, FormsModule, AppMenuComponent], providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => LocationInputComponent),
        multi: true
      }
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: '<label class="location-input" [class.location-input--readonly]="readOnly" [class.location-input--disabled]="actionDisabled()">\n  <span class="location-input__label">\n    <span>{{ label() }}</span>\n    @if (required()) {\n      <span class="location-input__required">*</span>\n    }\n  </span>\n  <span class="location-input__row">\n    <input\n      type="text"\n      [ngModel]="value"\n      (ngModelChange)="updateValue($event)"\n      (blur)="markTouched()"\n      [readonly]="readOnly"\n      [disabled]="inputDisabled()"\n      [placeholder]="placeholder()"\n      />\n    <app-menu\n      class="location-input__map-menu"\n      kind="inline"\n      [items]="mapMenuItems()"\n      (itemSelect)="markTouched()"\n    ></app-menu>\n  </span>\n</label>\n', styles: ["/* src/app/shared/ui/components/core/form/inputs/location-input/location-input.component.scss */\n:host {\n  display: block;\n  min-width: 0;\n}\n.location-input {\n  display: grid;\n  gap: 0.38rem;\n  min-width: 0;\n}\n.location-input__label {\n  display: inline-flex;\n  align-items: baseline;\n  gap: 0.18rem;\n  color: #223550;\n  font-size: 0.86rem;\n  font-weight: 800;\n}\n.location-input__required {\n  color: #b93243;\n}\n.location-input__row {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.62rem;\n  min-width: 0;\n}\n.location-input input {\n  box-sizing: border-box;\n  width: 100%;\n  min-width: 0;\n  min-height: 40px;\n  border: 1px solid rgba(136, 156, 186, 0.5);\n  border-radius: 10px;\n  background: #fff;\n  color: #1d3556;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  transition: border-color 0.15s ease, box-shadow 0.15s ease;\n}\n.location-input input:focus {\n  outline: 0;\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n}\n:host-context(.form-flow__control.is-required-missing) .location-input input {\n  border-color: #ef9a9a;\n  background: #fff1f1;\n}\n.location-input input:read-only,\n.location-input input:disabled {\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9fc 0%,\n      #edf2f7 100%);\n  border-color: rgba(122, 140, 168, 0.42);\n  color: rgba(58, 76, 103, 0.9);\n  -webkit-text-fill-color: rgba(58, 76, 103, 0.9);\n}\n.location-input input:read-only:focus,\n.location-input input:disabled:focus {\n  border-color: rgba(122, 140, 168, 0.42);\n  box-shadow: none;\n}\n:host-context(.form-flow__control.is-required-missing) .location-input input:read-only,\n:host-context(.form-flow__control.is-required-missing) .location-input input:disabled {\n  border-color: #ef9a9a;\n  background: #fff1f1;\n}\n.location-input__map-menu {\n  width: 32px;\n  min-width: 32px;\n}\n.location-input--disabled {\n  opacity: 0.72;\n}\n/*# sourceMappingURL=location-input.component.css.map */\n"] }]
  }], null, { config: [{
    type: Input
  }], readOnly: [{
    type: Input
  }], disabled: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LocationInputComponent, { className: "LocationInputComponent", filePath: "app/shared/ui/components/core/form/inputs/location-input/location-input.component.ts", lineNumber: 35 });
})();

// src/app/shared/ui/components/core/form/inputs/policies-input/policies-input.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function PoliciesInputComponent_Conditional_0_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 5);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.panelSubtitle());
  }
}
function PoliciesInputComponent_Conditional_0_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 8);
    \u0275\u0275listener("click", function PoliciesInputComponent_Conditional_0_Conditional_9_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.togglePoliciesEnabled($event));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("is-on", ctx_r0.effectivePanelEnabled());
    \u0275\u0275property("disabled", ctx_r0.locked());
    \u0275\u0275attribute("aria-pressed", ctx_r0.effectivePanelEnabled());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.effectivePanelEnabled() ? "toggle_on" : "toggle_off");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.effectivePanelEnabled() ? "On" : "Off");
  }
}
function PoliciesInputComponent_Conditional_0_Conditional_10_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 15);
    \u0275\u0275listener("click", function PoliciesInputComponent_Conditional_0_Conditional_10_Conditional_1_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.openPoliciesPopup($event));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "gavel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.openPoliciesLabel());
  }
}
function PoliciesInputComponent_Conditional_0_Conditional_10_Conditional_7_For_2_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 23);
    \u0275\u0275listener("click", function PoliciesInputComponent_Conditional_0_Conditional_10_Conditional_7_For_2_Conditional_7_Template_label_click_0_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275elementStart(1, "input", 24);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275listener("change", function PoliciesInputComponent_Conditional_0_Conditional_10_Conditional_7_For_2_Conditional_7_Template_input_change_1_listener($event) {
      \u0275\u0275restoreView(_r4);
      const policy_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.togglePolicyApproval(policy_r5, $event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const policy_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275property("checked", ctx_r0.policyApprovalAccepted(policy_r5))("disabled", ctx_r0.policyApprovalDisabled());
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(2, 3, "accept") + ": " + policy_r5.title);
  }
}
function PoliciesInputComponent_Conditional_0_Conditional_10_Conditional_7_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 17)(1, "div", 18)(2, "span", 19);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 20)(5, "span", 21);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, PoliciesInputComponent_Conditional_0_Conditional_10_Conditional_7_For_2_Conditional_7_Template, 3, 5, "label", 22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 14);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const policy_r5 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("event-policy-summary-card--mandatory", ctx_r0.policyRequired(policy_r5))("event-policy-summary-card--optional", !ctx_r0.policyRequired(policy_r5));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(policy_r5.title);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("event-policy-summary-badge--mandatory", ctx_r0.policyRequired(policy_r5))("event-policy-summary-badge--optional", !ctx_r0.policyRequired(policy_r5));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.policyRequirementLabel(policy_r5), " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.policyApprovalEnabled() && !ctx_r0.policyRequired(policy_r5) ? 7 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.policySummaryDescription(policy_r5));
  }
}
function PoliciesInputComponent_Conditional_0_Conditional_10_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13);
    \u0275\u0275repeaterCreate(1, PoliciesInputComponent_Conditional_0_Conditional_10_Conditional_7_For_2_Template, 10, 12, "article", 16, \u0275\u0275componentInstance().trackPolicy, true);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.policies);
  }
}
function PoliciesInputComponent_Conditional_0_Conditional_10_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.emptyPoliciesLabel(), " ");
  }
}
function PoliciesInputComponent_Conditional_0_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275conditionalCreate(1, PoliciesInputComponent_Conditional_0_Conditional_10_Conditional_1_Template, 5, 1, "button", 9);
    \u0275\u0275elementStart(2, "div", 10)(3, "section", 11)(4, "span", 12);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, PoliciesInputComponent_Conditional_0_Conditional_10_Conditional_7_Template, 3, 0, "div", 13)(8, PoliciesInputComponent_Conditional_0_Conditional_10_Conditional_8_Template, 2, 1, "p", 14);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.locked() ? 1 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(6, 3, "summary"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.policies.length > 0 ? 7 : 8);
  }
}
function PoliciesInputComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 1)(1, "div", 2)(2, "div", 3)(3, "span", 4)(4, "mat-icon");
    \u0275\u0275text(5, "policy");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(8, PoliciesInputComponent_Conditional_0_Conditional_8_Template, 2, 1, "p", 5);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(9, PoliciesInputComponent_Conditional_0_Conditional_9_Template, 5, 6, "button", 6);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(10, PoliciesInputComponent_Conditional_0_Conditional_10_Template, 9, 5, "div", 7);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classProp("is-on", ctx_r0.effectivePanelEnabled())("is-off", !ctx_r0.effectivePanelEnabled());
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r0.panelTitle());
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.locked() ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.policiesToggleable() && !ctx_r0.locked() ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.effectivePanelEnabled() ? 10 : -1);
  }
}
function PoliciesInputComponent_Conditional_1_For_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "single-row", 30);
    \u0275\u0275listener("rowClick", function PoliciesInputComponent_Conditional_1_For_4_Template_single_row_rowClick_0_listener($event) {
      const \u0275$index_85_r7 = \u0275\u0275restoreView(_r6).$index;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.openPolicyEditor(\u0275$index_85_r7, $event));
    })("menuAction", function PoliciesInputComponent_Conditional_1_For_4_Template_single_row_menuAction_0_listener($event) {
      const \u0275$index_85_r7 = \u0275\u0275restoreView(_r6).$index;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.onPolicyRowMenuAction(\u0275$index_85_r7, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const policy_r8 = ctx.$implicit;
    const \u0275$index_85_r7 = ctx.$index;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("row", ctx_r0.policySingleRow(policy_r8, \u0275$index_85_r7));
  }
}
function PoliciesInputComponent_Conditional_1_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 29)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 1, "event.editor.policies.empty.short"));
  }
}
function PoliciesInputComponent_Conditional_1_Conditional_6_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function PoliciesInputComponent_Conditional_1_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, PoliciesInputComponent_Conditional_1_Conditional_6_ng_container_0_Template, 1, 0, "ng-container", 31);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngComponentOutlet", ctx)("ngComponentOutletInputs", ctx_r0.policyEditorPopupOutletInputs());
  }
}
function PoliciesInputComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-popup", 25)(1, "div", 26)(2, "div", 27);
    \u0275\u0275repeaterCreate(3, PoliciesInputComponent_Conditional_1_For_4_Template, 1, 1, "single-row", 28, _forTrack0);
    \u0275\u0275conditionalCreate(5, PoliciesInputComponent_Conditional_1_Conditional_5_Template, 4, 3, "div", 29);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(6, PoliciesInputComponent_Conditional_1_Conditional_6_Template, 1, 2, "ng-container");
  }
  if (rf & 2) {
    let tmp_5_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r0.policySetupPopupModel())("zIndex", ctx_r0.policySetupPopupZIndex());
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.workingPolicies);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.workingPolicies.length === 0 ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_5_0 = ctx_r0.policyEditorPopupComponent()) ? 6 : -1, tmp_5_0);
  }
}
var PoliciesInputComponent = class _PoliciesInputComponent {
  cdr;
  static ownerSequence = 0;
  readOnly = false;
  disabled = false;
  config = {};
  enabled = false;
  enabledChange = new EventEmitter();
  policies = [];
  workingPolicies = [];
  workingPolicyDraft = this.createEmptyPolicyDraft();
  editingPolicyDraftIndex = null;
  showPoliciesPopup = false;
  formFlowPopupStore = inject(FormFlowPopupStore);
  ownerId = this.nextOwnerId();
  policyEditorPopupOutletInputs = computed(() => {
    const popup = this.formFlowPopupStore.policyEditorPopupRef();
    return {
      popup: popup?.ownerId === this.ownerId ? popup : null
    };
  }, ...ngDevMode ? [{ debugName: "policyEditorPopupOutletInputs" }] : (
    /* istanbul ignore next */
    []
  ));
  idSequence = 0;
  onModelChange = () => {
  };
  onModelTouched = () => {
  };
  lastPolicyEditorActionRequestId = 0;
  destroyEffects = [];
  constructor(cdr) {
    this.cdr = cdr;
    this.destroyEffects.push(effect(() => {
      if (this.policyEditorIsOpen()) {
        void this.formFlowPopupStore.ensurePolicyEditorPopupLoaded();
      }
    }), effect(() => {
      const request = this.formFlowPopupStore.policyEditorPopupActionRequest();
      if (!request || request.requestId <= this.lastPolicyEditorActionRequestId) {
        return;
      }
      this.lastPolicyEditorActionRequestId = request.requestId;
      untracked(() => this.handlePolicyEditorActionRequest(request));
    }));
  }
  ngOnDestroy() {
    this.destroyEffects.forEach((item) => item.destroy());
    if (this.policyEditorIsOpen()) {
      this.formFlowPopupStore.closePolicyEditorPopup(this.ownerId);
    }
  }
  writeValue(value) {
    this.policies = this.normalizePolicies(value ?? []);
    if (this.showPoliciesPopup) {
      this.workingPolicies = this.clonePolicies(this.policies);
    }
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
  handleEscape(event) {
    const keyboardEvent = event;
    if (this.policyEditorIsOpen()) {
      keyboardEvent.preventDefault();
      this.closePolicyEditor();
      return;
    }
    if (this.showPoliciesPopup) {
      keyboardEvent.preventDefault();
      this.closePoliciesPopup();
    }
  }
  shouldShowPanel() {
    return !this.locked() || this.effectivePanelEnabled();
  }
  locked() {
    return this.readOnly || this.disabled;
  }
  panelTitle() {
    return this.resolveConfigValue(this.config.title, "event.editor.policies.title");
  }
  panelSubtitle() {
    const enabled = this.effectivePanelEnabled();
    return this.resolveConfigValue(this.config.subtitle, enabled ? "event.editor.policies.enabled.description" : "event.editor.policies.disabled.description");
  }
  effectivePanelEnabled() {
    if (!this.policiesToggleable()) {
      return true;
    }
    return this.locked() ? this.enabled && this.policies.length > 0 : this.enabled;
  }
  togglePoliciesEnabled(event) {
    event?.preventDefault();
    if (this.locked() || !this.policiesToggleable()) {
      return;
    }
    const nextEnabled = !this.enabled;
    this.enabled = nextEnabled;
    this.enabledChange.emit(nextEnabled);
    this.onModelTouched();
    if (!nextEnabled) {
      this.showPoliciesPopup = false;
      this.formFlowPopupStore.closePolicyEditorPopup(this.ownerId);
      this.workingPolicies = [];
      this.workingPolicyDraft = this.createEmptyPolicyDraft();
      this.editingPolicyDraftIndex = null;
    }
    this.cdr.markForCheck();
  }
  openPoliciesPopup(event) {
    event?.preventDefault();
    this.workingPolicies = this.clonePolicies(this.policies);
    this.showPoliciesPopup = true;
    this.formFlowPopupStore.closePolicyEditorPopup(this.ownerId);
    this.onModelTouched();
    this.cdr.markForCheck();
  }
  closePoliciesPopup() {
    if (this.showPoliciesPopup || this.policyEditorIsOpen()) {
      this.syncPoliciesFromWorkingPolicies();
    }
    this.showPoliciesPopup = false;
    this.formFlowPopupStore.closePolicyEditorPopup(this.ownerId);
    this.workingPolicies = [];
    this.workingPolicyDraft = this.createEmptyPolicyDraft();
    this.editingPolicyDraftIndex = null;
    this.cdr.markForCheck();
  }
  openPolicyEditor(index, event) {
    event?.preventDefault();
    event?.stopPropagation();
    if (!this.showPoliciesPopup) {
      return;
    }
    const existing = Number.isInteger(index) && index !== void 0 ? this.workingPolicies[index] ?? null : null;
    this.editingPolicyDraftIndex = existing ? index ?? null : null;
    this.workingPolicyDraft = existing ? __spreadValues({}, existing) : this.createEmptyPolicyDraft();
    this.formFlowPopupStore.openPolicyEditorPopup(this.buildPolicyEditorPopupState());
    this.cdr.markForCheck();
  }
  closePolicyEditor(event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.formFlowPopupStore.closePolicyEditorPopup(this.ownerId);
    this.workingPolicyDraft = this.createEmptyPolicyDraft();
    this.editingPolicyDraftIndex = null;
    this.cdr.markForCheck();
  }
  removePolicyDraft(index, event) {
    event?.preventDefault();
    event?.stopPropagation();
    if (this.locked() || index < 0 || index >= this.workingPolicies.length) {
      return;
    }
    this.workingPolicies = this.workingPolicies.filter((_, itemIndex) => itemIndex !== index);
    if (this.editingPolicyDraftIndex === index) {
      this.closePolicyEditor();
    }
    this.syncPoliciesFromWorkingPolicies();
  }
  savePolicyDraft(value, event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.workingPolicyDraft = this.policyDraftFromValue(value);
    if (this.locked() || !this.canSavePolicyDraft()) {
      return;
    }
    const nextItem = this.normalizedWorkingPolicyDraft();
    if (this.editingPolicyDraftIndex !== null && this.editingPolicyDraftIndex >= 0 && this.editingPolicyDraftIndex < this.workingPolicies.length) {
      this.workingPolicies = this.workingPolicies.map((item, index) => index === this.editingPolicyDraftIndex ? nextItem : item);
    } else {
      this.workingPolicies = [...this.workingPolicies, nextItem];
    }
    this.syncPoliciesFromWorkingPolicies();
    this.closePolicyEditor();
  }
  policyPopupTitle() {
    return this.editingPolicyDraftIndex === null ? "event.editor.policy.create" : "event.editor.policy.edit";
  }
  policySetupPopupModel() {
    return {
      title: "event.editor.policies.setup.title",
      subtitle: this.popupSubtitle(),
      ariaLabel: "event.editor.policies.setup.aria",
      closeAriaLabel: "event.editor.policies.setup.close.aria",
      size: "wide",
      height: "full",
      headerTone: "accent",
      bodyLayout: "fill",
      backdropTone: "dim",
      headerControls: this.policySetupHeaderControls(),
      onClose: () => this.closePoliciesPopup(),
      onMenuSelect: (event) => this.onPolicyPopupMenuSelect(event)
    };
  }
  policySetupPopupZIndex() {
    return 12600;
  }
  policyEditorPopupZIndex() {
    return 12700;
  }
  buildPolicyEditorPopupState() {
    return {
      ownerId: this.ownerId,
      title: this.policyPopupTitle(),
      subtitle: this.editorSubtitle(),
      zIndex: this.policyEditorPopupZIndex(),
      value: __spreadValues({}, this.workingPolicyDraft),
      requiredCheckboxLabel: this.requiredCheckboxLabel(),
      readOnly: this.locked()
    };
  }
  policyEditorPopupComponent() {
    return this.policyEditorIsOpen() ? this.formFlowPopupStore.policyEditorPopupComponent() : null;
  }
  policyEditorIsOpen() {
    return this.formFlowPopupStore.policyEditorPopupRef()?.ownerId === this.ownerId;
  }
  policySingleRow(policy, index) {
    return EventPolicySingleRowConverter.convert(policy, {
      index,
      locked: this.locked(),
      requiredApprovalLabel: this.resolveConfigValue(this.config.requiredApprovalLabel, "event.editor.policy.required"),
      optionalPolicyLabel: this.resolveConfigValue(this.config.optionalPolicyLabel, "event.editor.policy.optional"),
      requiredPreview: this.resolveConfigValue(this.config.requiredPreview, "event.editor.policy.required.description"),
      optionalPreview: this.resolveConfigValue(this.config.optionalPreview, "event.editor.policy.optional.description")
    });
  }
  policySetupHeaderControls() {
    if (this.locked()) {
      return [];
    }
    return [{
      kind: "menu",
      id: "policy-setup-actions",
      menuKind: "inline",
      items: [{
        id: "policy-add",
        icon: "add",
        kind: "action",
        palette: "blue",
        ariaLabel: "event.editor.policy.add.aria",
        context: {
          menu: "policy-setup",
          action: "add"
        }
      }],
      panelAlign: "end",
      mobileBreakpointPx: 900
    }];
  }
  onPolicyPopupMenuSelect(event) {
    const context = event.itemSelect.context;
    if (context?.menu === "policy-setup" && context.action === "add") {
      this.openPolicyEditor(void 0, event.itemSelect.sourceEvent);
    }
  }
  onPolicyRowMenuAction(index, event) {
    if (event.actionId !== "delete") {
      return;
    }
    this.removePolicyDraft(index);
  }
  policiesToggleable() {
    return this.resolveConfigValue(this.config.toggleable, true);
  }
  openPoliciesLabel() {
    return this.locked() ? this.resolveConfigValue(this.config.viewLabel, "event.editor.policies.view") : this.resolveConfigValue(this.config.openLabel, "event.editor.policies.setup.open");
  }
  emptyPoliciesLabel() {
    return this.locked() ? this.resolveConfigValue(this.config.readOnlyEmptyLabel, "event.editor.policies.empty.readonly") : this.resolveConfigValue(this.config.emptyLabel, "event.editor.policies.empty.description");
  }
  popupSubtitle() {
    return this.resolveConfigValue(this.config.popupSubtitle, "event.editor.policies.popup.subtitle");
  }
  editorSubtitle() {
    return this.resolveConfigValue(this.config.editorSubtitle, "event.editor.policy.editor.subtitle");
  }
  requiredCheckboxLabel() {
    return this.resolveConfigValue(this.config.requiredCheckboxLabel, "event.editor.policy.required.checkbox");
  }
  canSavePolicyDraft() {
    return `${this.workingPolicyDraft.title ?? ""}`.trim().length > 0 && `${this.workingPolicyDraft.description ?? ""}`.trim().length > 0;
  }
  policiesCountLabel() {
    const count = this.policies.length;
    return count === 1 ? "1 policy" : `${count} policies`;
  }
  requiredPoliciesCount() {
    return this.policies.filter((item) => item.required !== false).length;
  }
  trackPolicy(index, policy) {
    return `${policy.id ?? ""}`.trim() || `policy-${index}`;
  }
  policyRequirementLabel(policy) {
    return this.policyRequired(policy) ? this.resolveConfigValue(this.config.requiredApprovalLabel, "event.editor.policy.required") : this.resolveConfigValue(this.config.optionalPolicyLabel, "event.editor.policy.optional");
  }
  policySummaryDescription(policy) {
    const description = `${policy.description ?? ""}`.trim();
    if (description) {
      return description;
    }
    return policy.required !== false ? this.resolveConfigValue(this.config.requiredPreview, "event.editor.policy.required.description") : this.resolveConfigValue(this.config.optionalPreview, "event.editor.policy.optional.description");
  }
  policyRequired(policy) {
    return policy.required !== false;
  }
  policyApprovalEnabled() {
    return this.resolveConfigValue(this.config.approval?.enabled, false);
  }
  policyApprovalDisabled() {
    return this.disabled || this.resolveConfigValue(this.config.approval?.disabled, false);
  }
  policyApprovalAccepted(policy) {
    const policyId = `${policy.id ?? ""}`.trim();
    return policyId.length > 0 && this.resolveConfigValue(this.config.approval?.acceptedPolicyIds, []).includes(policyId);
  }
  togglePolicyApproval(policy, event) {
    event.stopPropagation();
    if (this.policyApprovalDisabled()) {
      return;
    }
    const policyId = `${policy.id ?? ""}`.trim();
    if (!policyId) {
      return;
    }
    this.config.approval?.onToggle?.(policyId);
    this.cdr.markForCheck();
  }
  syncPoliciesFromWorkingPolicies() {
    this.policies = this.normalizePolicies(this.workingPolicies);
    this.emitPolicies();
  }
  emitPolicies() {
    const nextPolicies = this.clonePolicies(this.policies);
    this.onModelChange(nextPolicies);
    this.onModelTouched();
    this.cdr.markForCheck();
  }
  normalizedWorkingPolicyDraft() {
    return {
      id: `${this.workingPolicyDraft.id ?? ""}`.trim() || this.createPolicyId(),
      title: `${this.workingPolicyDraft.title ?? ""}`.trim(),
      description: `${this.workingPolicyDraft.description ?? ""}`.trim(),
      required: this.workingPolicyDraft.required !== false
    };
  }
  normalizePolicies(items) {
    return items.map((item, index) => ({
      id: `${item.id ?? `policy-${index + 1}`}`.trim() || `policy-${index + 1}`,
      title: `${item.title ?? ""}`.trim() || `Policy ${index + 1}`,
      description: `${item.description ?? ""}`.trim(),
      required: item.required !== false
    })).filter((item) => item.id || item.title || item.description);
  }
  clonePolicies(items) {
    return items.map((item) => __spreadValues({}, item));
  }
  createEmptyPolicyDraft() {
    return {
      id: this.createPolicyId(),
      title: "",
      description: "",
      required: true
    };
  }
  createPolicyId() {
    this.idSequence += 1;
    return `policy-${Date.now()}-${this.idSequence}`;
  }
  policyDraftFromValue(value) {
    const record = value && typeof value === "object" ? value : {};
    return {
      id: `${record["id"] ?? this.workingPolicyDraft.id ?? ""}`.trim() || this.createPolicyId(),
      title: `${record["title"] ?? ""}`,
      description: `${record["description"] ?? ""}`,
      required: record["required"] !== false
    };
  }
  handlePolicyEditorActionRequest(request) {
    if (request.ownerId !== this.ownerId) {
      return;
    }
    switch (request.kind) {
      case "close":
        this.closePolicyEditor(request.event);
        return;
      case "save":
        this.savePolicyDraft(request.value, request.event);
        return;
    }
  }
  nextOwnerId() {
    _PoliciesInputComponent.ownerSequence += 1;
    return `policies-input-${Date.now()}-${_PoliciesInputComponent.ownerSequence}`;
  }
  resolveConfigValue(value, fallback) {
    if (typeof value === "function") {
      return value() ?? fallback;
    }
    return value ?? fallback;
  }
  static \u0275fac = function PoliciesInputComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PoliciesInputComponent)(\u0275\u0275directiveInject(ChangeDetectorRef));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PoliciesInputComponent, selectors: [["app-policies-input"]], hostBindings: function PoliciesInputComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("keydown.escape", function PoliciesInputComponent_keydown_escape_HostBindingHandler($event) {
        return ctx.handleEscape($event);
      }, \u0275\u0275resolveDocument);
    }
  }, inputs: { readOnly: "readOnly", disabled: "disabled", config: "config", enabled: "enabled" }, outputs: { enabledChange: "enabledChange" }, features: [\u0275\u0275ProvidersFeature([
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => _PoliciesInputComponent),
      multi: true
    }
  ])], decls: 2, vars: 2, consts: [[1, "event-policies-panel", 3, "is-on", "is-off"], [1, "event-policies-panel"], [1, "event-policies-panel-head"], [1, "event-policies-panel-title-wrap"], [1, "event-policies-panel-title"], [1, "event-policies-panel-subtitle"], ["type", "button", 1, "event-policies-toggle", 3, "is-on", "disabled"], [1, "event-policies-panel-body"], ["type", "button", 1, "event-policies-toggle", 3, "click", "disabled"], ["type", "button", 1, "event-slots-open-btn", "event-slots-open-btn-inline"], [1, "event-slots-summary"], [1, "event-slots-summary-block"], [1, "event-slots-summary-label"], [1, "event-slots-summary-list"], [1, "event-slots-summary-note"], ["type", "button", 1, "event-slots-open-btn", "event-slots-open-btn-inline", 3, "click"], [1, "event-policy-summary-card", 3, "event-policy-summary-card--mandatory", "event-policy-summary-card--optional"], [1, "event-policy-summary-card"], [1, "event-policy-summary-card-head"], [1, "event-slots-summary-title"], [1, "event-policy-summary-actions"], [1, "event-policy-summary-badge"], [1, "event-policy-summary-approval"], [1, "event-policy-summary-approval", 3, "click"], ["type", "checkbox", 3, "change", "checked", "disabled"], [3, "model", "zIndex"], [1, "event-policies-popup-body"], [1, "event-policies-list", "event-policies-list-compact"], [3, "row"], [1, "event-slot-empty-state", "event-policy-empty-state"], [3, "rowClick", "menuAction", "row"], [4, "ngComponentOutlet", "ngComponentOutletInputs"]], template: function PoliciesInputComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, PoliciesInputComponent_Conditional_0_Template, 11, 8, "section", 0);
      \u0275\u0275conditionalCreate(1, PoliciesInputComponent_Conditional_1_Template, 7, 4);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.shouldShowPanel() ? 0 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showPoliciesPopup ? 1 : -1);
    }
  }, dependencies: [
    CommonModule,
    NgComponentOutlet,
    MatIconModule,
    MatIcon,
    PopupComponent,
    SingleRowComponent,
    I18nPipe
  ], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n  min-width: 0;\n  grid-column: 1/-1;\n}\n.event-policies-panel[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n  border: 1px solid rgba(121, 115, 150, 0.22);\n  border-radius: 18px;\n  background:\n    linear-gradient(\n      180deg,\n      #f7f4ff 0%,\n      #f1edff 100%);\n  box-shadow: 0 4px 12px rgba(47, 40, 93, 0.08);\n  padding: 0.72rem 0.84rem;\n  display: grid;\n  gap: 0.7rem;\n}\n.event-policies-panel.is-off[_ngcontent-%COMP%] {\n  border-color: rgba(128, 147, 175, 0.22);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(247, 250, 254, 0.97) 0%,\n      rgba(237, 243, 249, 0.94) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(146, 165, 194, 0.1),\n      transparent 36%);\n}\n.popup-panel-event-editor-readonly[_nghost-%COMP%]   .event-policies-panel[_ngcontent-%COMP%]   .event-slots-open-btn[_ngcontent-%COMP%], .popup-panel-event-editor-readonly   [_nghost-%COMP%]   .event-policies-panel[_ngcontent-%COMP%]   .event-slots-open-btn[_ngcontent-%COMP%] {\n  display: none;\n}\n.event-policies-panel-head[_ngcontent-%COMP%], \n.event-policies-panel-title-wrap[_ngcontent-%COMP%], \n.event-policies-panel-body[_ngcontent-%COMP%], \n.event-slots-summary[_ngcontent-%COMP%], \n.event-slots-summary-list[_ngcontent-%COMP%], \n.event-slots-summary-item[_ngcontent-%COMP%], \n.event-policies-list[_ngcontent-%COMP%] {\n  display: grid;\n}\n.event-policies-panel-head[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: start;\n  gap: 0.3rem;\n}\n.event-policies-panel-title-wrap[_ngcontent-%COMP%] {\n  gap: 0.18rem;\n}\n.event-policies-panel-title[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n  font-size: 1rem;\n  font-weight: 800;\n  color: #5f4f8a;\n}\n.event-policies-panel-title[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  color: #5f4f8a;\n}\n.event-policies-panel-subtitle[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.82rem;\n  line-height: 1.45;\n  color: rgba(63, 56, 97, 0.78);\n}\n.event-policies-toggle[_ngcontent-%COMP%] {\n  min-width: 82px;\n  min-height: 38px;\n  padding: 0.3rem 0.62rem;\n  border-radius: 999px;\n  border: 1px solid rgba(86, 108, 145, 0.22);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.4rem;\n  justify-self: end;\n  cursor: pointer;\n  color: #5b6e8e;\n  background:\n    linear-gradient(\n      180deg,\n      #f4f7fb 0%,\n      #e9eff7 100%);\n  box-shadow: 0 2px 7px rgba(29, 53, 86, 0.08);\n  font-size: 0.76rem;\n  font-weight: 800;\n  letter-spacing: 0.04em;\n  text-transform: uppercase;\n  transition:\n    transform 0.18s ease,\n    box-shadow 0.18s ease,\n    background-color 0.18s ease,\n    opacity 0.18s ease;\n}\n.event-policies-toggle.is-on[_ngcontent-%COMP%] {\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n  background:\n    linear-gradient(\n      180deg,\n      #ecf8ee 0%,\n      #ddf1e2 100%);\n}\n.event-policies-toggle[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.event-policies-toggle[_ngcontent-%COMP%]:disabled {\n  cursor: default;\n  opacity: 0.66;\n  pointer-events: none;\n  filter: saturate(0.66);\n  box-shadow: none;\n}\n.event-policies-panel-body[_ngcontent-%COMP%] {\n  gap: 0.62rem;\n}\n.event-slots-open-btn[_ngcontent-%COMP%] {\n  min-width: 138px;\n  min-height: 38px;\n  padding: 0.42rem 0.82rem;\n  border-radius: 999px;\n  border: 1px solid rgba(86, 108, 145, 0.22);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.34rem;\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #eff6ff 100%);\n  color: #2f5f92;\n  font-size: 0.8rem;\n  font-weight: 800;\n  cursor: pointer;\n  box-shadow: 0 2px 7px rgba(29, 53, 86, 0.08);\n}\n.event-slots-open-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.event-slots-open-btn-inline[_ngcontent-%COMP%] {\n  justify-self: start;\n}\n.event-slots-summary[_ngcontent-%COMP%] {\n  gap: 0.72rem;\n}\n.event-slots-summary-block[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.48rem;\n  padding: 0.88rem;\n  border-radius: 14px;\n  border: 1px solid rgba(78, 112, 150, 0.18);\n  background: rgba(255, 255, 255, 0.74);\n}\n.event-slots-summary-label[_ngcontent-%COMP%] {\n  color: rgba(29, 48, 75, 0.74);\n  font-size: 0.74rem;\n  font-weight: 800;\n  letter-spacing: 0.01em;\n  text-transform: uppercase;\n}\n.event-slots-summary-list[_ngcontent-%COMP%] {\n  gap: 0.42rem;\n}\n.event-slots-summary-item[_ngcontent-%COMP%] {\n  gap: 0.12rem;\n}\n.event-policy-summary-card[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  grid-template-rows: auto auto;\n  gap: 0.2rem 0.58rem;\n  padding: 0.56rem 0.68rem;\n  border-radius: 12px;\n  border: 1px solid rgba(120, 104, 166, 0.22);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.92) 0%,\n      rgba(250, 248, 255, 0.88) 100%);\n}\n.event-policy-summary-card--mandatory[_ngcontent-%COMP%] {\n  border-color: rgba(176, 70, 70, 0.28);\n  background:\n    linear-gradient(\n      180deg,\n      #fff7f7 0%,\n      #fff0f0 100%);\n}\n.event-policy-summary-card--optional[_ngcontent-%COMP%] {\n  border-color: rgba(53, 113, 185, 0.26);\n  background:\n    linear-gradient(\n      180deg,\n      #f6fbff 0%,\n      #eef6ff 100%);\n}\n.event-policy-summary-card-head[_ngcontent-%COMP%] {\n  display: contents;\n}\n.event-policy-summary-card-head[_ngcontent-%COMP%]   .event-slots-summary-title[_ngcontent-%COMP%] {\n  grid-column: 1;\n  grid-row: 1;\n  align-self: center;\n  min-width: 0;\n}\n.event-policy-summary-actions[_ngcontent-%COMP%] {\n  display: contents;\n}\n.event-policy-summary-badge[_ngcontent-%COMP%] {\n  grid-column: 2;\n  grid-row: 1;\n  align-self: center;\n  justify-self: end;\n  flex: 0 0 auto;\n  min-height: 24px;\n  padding: 0.22rem 0.48rem;\n  border-radius: 999px;\n  font-size: 0.72rem;\n  font-weight: 800;\n}\n.event-policy-summary-badge--mandatory[_ngcontent-%COMP%] {\n  border: 1px solid rgba(176, 70, 70, 0.34);\n  color: #a23d3d;\n  background:\n    linear-gradient(\n      180deg,\n      #fff0f0 0%,\n      #ffe4e4 100%);\n}\n.event-policy-summary-badge--optional[_ngcontent-%COMP%] {\n  border: 1px solid rgba(53, 113, 185, 0.34);\n  color: #2d5ea8;\n  background:\n    linear-gradient(\n      180deg,\n      #eef6ff 0%,\n      #e3efff 100%);\n}\n.event-policy-summary-approval[_ngcontent-%COMP%] {\n  grid-column: 2;\n  grid-row: 2;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  justify-self: center;\n  width: 24px;\n  height: 20px;\n  cursor: pointer;\n}\n.event-policy-summary-approval[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  margin: 0;\n  accent-color: #2b76bd;\n  cursor: pointer;\n}\n.event-policy-summary-approval[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:disabled {\n  cursor: default;\n}\n.event-slots-summary-title[_ngcontent-%COMP%] {\n  font-size: 0.88rem;\n  font-weight: 800;\n  color: #294f83;\n}\n.event-slots-summary-meta[_ngcontent-%COMP%], \n.event-slots-summary-note[_ngcontent-%COMP%] {\n  color: rgba(37, 58, 88, 0.72);\n  font-size: 0.82rem;\n  line-height: 1.45;\n}\n.event-slots-summary-note[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.event-policy-summary-card-head[_ngcontent-%COMP%]   .event-slots-summary-note[_ngcontent-%COMP%] {\n  grid-column: 1;\n  grid-row: 2;\n}\n.event-policies-popup-body[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  min-height: 0;\n  display: grid;\n  align-content: start;\n  gap: 0.72rem;\n  overflow: auto;\n  padding: 0.12rem 0.12rem 0.72rem 0.04rem;\n}\n.event-policies-list[_ngcontent-%COMP%] {\n  gap: 0.72rem;\n}\n.event-policies-list-compact[_ngcontent-%COMP%] {\n  align-content: start;\n}\n.event-slot-empty-state[_ngcontent-%COMP%] {\n  border: 1px dashed rgba(97, 124, 158, 0.28);\n  border-radius: 14px;\n  background: rgba(255, 255, 255, 0.64);\n  color: rgba(37, 58, 88, 0.68);\n  padding: 1rem;\n  display: grid;\n  place-items: center;\n  min-height: 96px;\n}\n.event-policy-empty-state[_ngcontent-%COMP%] {\n  gap: 0.8rem;\n}\n@media (max-width: 760px) {\n  .event-slots-open-btn-inline[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=policies-input.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PoliciesInputComponent, [{
    type: Component,
    args: [{ selector: "app-policies-input", standalone: true, imports: [
      CommonModule,
      MatIconModule,
      PopupComponent,
      SingleRowComponent,
      I18nPipe
    ], changeDetection: ChangeDetectionStrategy.OnPush, providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => PoliciesInputComponent),
        multi: true
      }
    ], template: `@if (shouldShowPanel()) {
<section class="event-policies-panel" [class.is-on]="effectivePanelEnabled()" [class.is-off]="!effectivePanelEnabled()">
  <div class="event-policies-panel-head">
    <div class="event-policies-panel-title-wrap">
      <span class="event-policies-panel-title">
        <mat-icon>policy</mat-icon>
        <span>{{ panelTitle() }}</span>
      </span>
      @if (!locked()) {
      <p class="event-policies-panel-subtitle">{{ panelSubtitle() }}</p>
      }
    </div>
    @if (policiesToggleable() && !locked()) {
    <button
      type="button"
      class="event-policies-toggle"
      [class.is-on]="effectivePanelEnabled()"
      [disabled]="locked()"
      [attr.aria-pressed]="effectivePanelEnabled()"
      (click)="togglePoliciesEnabled($event)"
    >
      <mat-icon>{{ effectivePanelEnabled() ? 'toggle_on' : 'toggle_off' }}</mat-icon>
      <span>{{ effectivePanelEnabled() ? 'On' : 'Off' }}</span>
    </button>
    }
  </div>
  @if (effectivePanelEnabled()) {
  <div class="event-policies-panel-body">
    @if (!locked()) {
    <button type="button" class="event-slots-open-btn event-slots-open-btn-inline" (click)="openPoliciesPopup($event)">
      <mat-icon>gavel</mat-icon>
      <span>{{ openPoliciesLabel() }}</span>
    </button>
    }
    <div class="event-slots-summary">
      <section class="event-slots-summary-block">
        <span class="event-slots-summary-label">{{ 'summary' | i18n }}</span>
        @if (policies.length > 0) {
        <div class="event-slots-summary-list">
          @for (policy of policies; track trackPolicy($index, policy)) {
            <article
              class="event-policy-summary-card"
              [class.event-policy-summary-card--mandatory]="policyRequired(policy)"
              [class.event-policy-summary-card--optional]="!policyRequired(policy)"
              >
              <div class="event-policy-summary-card-head">
                <span class="event-slots-summary-title">{{ policy.title }}</span>
                <div class="event-policy-summary-actions">
                  <span
                    class="event-policy-summary-badge"
                    [class.event-policy-summary-badge--mandatory]="policyRequired(policy)"
                    [class.event-policy-summary-badge--optional]="!policyRequired(policy)"
                  >
                    {{ policyRequirementLabel(policy) }}
                  </span>
                  @if (policyApprovalEnabled() && !policyRequired(policy)) {
                    <label
                      class="event-policy-summary-approval"
                      (click)="$event.stopPropagation()"
                    >
                      <input
                        type="checkbox"
                        [checked]="policyApprovalAccepted(policy)"
                        [disabled]="policyApprovalDisabled()"
                        [attr.aria-label]="('accept' | i18n) + ': ' + policy.title"
                        (change)="togglePolicyApproval(policy, $event)"
                      />
                    </label>
                  }
                </div>
                <p class="event-slots-summary-note">{{ policySummaryDescription(policy) }}</p>
              </div>
            </article>
          }
        </div>
        } @else {
        <p class="event-slots-summary-note">
          {{ emptyPoliciesLabel() }}
        </p>
        }
      </section>
    </div>
  </div>
  }
</section>
}

@if (showPoliciesPopup) {
<app-popup [model]="policySetupPopupModel()" [zIndex]="policySetupPopupZIndex()">
  <div class="event-policies-popup-body">
    <div class="event-policies-list event-policies-list-compact">
      @for (policy of workingPolicies; track policy.id; let i = $index) {
      <single-row
        [row]="policySingleRow(policy, i)"
        (rowClick)="openPolicyEditor(i, $event)"
        (menuAction)="onPolicyRowMenuAction(i, $event)"
      ></single-row>
      }
      @if (workingPolicies.length === 0) {
      <div class="event-slot-empty-state event-policy-empty-state">
        <span>{{ 'event.editor.policies.empty.short' | i18n }}</span>
      </div>
      }
    </div>
  </div>
</app-popup>

@if (policyEditorPopupComponent(); as popupComponent) {
  <ng-container *ngComponentOutlet="popupComponent; inputs: policyEditorPopupOutletInputs()"></ng-container>
}
}
`, styles: ["/* src/app/shared/ui/components/core/form/inputs/policies-input/policies-input.component.scss */\n:host {\n  display: block;\n  width: 100%;\n  min-width: 0;\n  grid-column: 1/-1;\n}\n.event-policies-panel {\n  grid-column: 1/-1;\n  border: 1px solid rgba(121, 115, 150, 0.22);\n  border-radius: 18px;\n  background:\n    linear-gradient(\n      180deg,\n      #f7f4ff 0%,\n      #f1edff 100%);\n  box-shadow: 0 4px 12px rgba(47, 40, 93, 0.08);\n  padding: 0.72rem 0.84rem;\n  display: grid;\n  gap: 0.7rem;\n}\n.event-policies-panel.is-off {\n  border-color: rgba(128, 147, 175, 0.22);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(247, 250, 254, 0.97) 0%,\n      rgba(237, 243, 249, 0.94) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(146, 165, 194, 0.1),\n      transparent 36%);\n}\n:host-context(.popup-panel-event-editor-readonly) .event-policies-panel .event-slots-open-btn {\n  display: none;\n}\n.event-policies-panel-head,\n.event-policies-panel-title-wrap,\n.event-policies-panel-body,\n.event-slots-summary,\n.event-slots-summary-list,\n.event-slots-summary-item,\n.event-policies-list {\n  display: grid;\n}\n.event-policies-panel-head {\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: start;\n  gap: 0.3rem;\n}\n.event-policies-panel-title-wrap {\n  gap: 0.18rem;\n}\n.event-policies-panel-title {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n  font-size: 1rem;\n  font-weight: 800;\n  color: #5f4f8a;\n}\n.event-policies-panel-title .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  color: #5f4f8a;\n}\n.event-policies-panel-subtitle {\n  margin: 0;\n  font-size: 0.82rem;\n  line-height: 1.45;\n  color: rgba(63, 56, 97, 0.78);\n}\n.event-policies-toggle {\n  min-width: 82px;\n  min-height: 38px;\n  padding: 0.3rem 0.62rem;\n  border-radius: 999px;\n  border: 1px solid rgba(86, 108, 145, 0.22);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.4rem;\n  justify-self: end;\n  cursor: pointer;\n  color: #5b6e8e;\n  background:\n    linear-gradient(\n      180deg,\n      #f4f7fb 0%,\n      #e9eff7 100%);\n  box-shadow: 0 2px 7px rgba(29, 53, 86, 0.08);\n  font-size: 0.76rem;\n  font-weight: 800;\n  letter-spacing: 0.04em;\n  text-transform: uppercase;\n  transition:\n    transform 0.18s ease,\n    box-shadow 0.18s ease,\n    background-color 0.18s ease,\n    opacity 0.18s ease;\n}\n.event-policies-toggle.is-on {\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n  background:\n    linear-gradient(\n      180deg,\n      #ecf8ee 0%,\n      #ddf1e2 100%);\n}\n.event-policies-toggle .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.event-policies-toggle:disabled {\n  cursor: default;\n  opacity: 0.66;\n  pointer-events: none;\n  filter: saturate(0.66);\n  box-shadow: none;\n}\n.event-policies-panel-body {\n  gap: 0.62rem;\n}\n.event-slots-open-btn {\n  min-width: 138px;\n  min-height: 38px;\n  padding: 0.42rem 0.82rem;\n  border-radius: 999px;\n  border: 1px solid rgba(86, 108, 145, 0.22);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.34rem;\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #eff6ff 100%);\n  color: #2f5f92;\n  font-size: 0.8rem;\n  font-weight: 800;\n  cursor: pointer;\n  box-shadow: 0 2px 7px rgba(29, 53, 86, 0.08);\n}\n.event-slots-open-btn .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.event-slots-open-btn-inline {\n  justify-self: start;\n}\n.event-slots-summary {\n  gap: 0.72rem;\n}\n.event-slots-summary-block {\n  display: grid;\n  gap: 0.48rem;\n  padding: 0.88rem;\n  border-radius: 14px;\n  border: 1px solid rgba(78, 112, 150, 0.18);\n  background: rgba(255, 255, 255, 0.74);\n}\n.event-slots-summary-label {\n  color: rgba(29, 48, 75, 0.74);\n  font-size: 0.74rem;\n  font-weight: 800;\n  letter-spacing: 0.01em;\n  text-transform: uppercase;\n}\n.event-slots-summary-list {\n  gap: 0.42rem;\n}\n.event-slots-summary-item {\n  gap: 0.12rem;\n}\n.event-policy-summary-card {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  grid-template-rows: auto auto;\n  gap: 0.2rem 0.58rem;\n  padding: 0.56rem 0.68rem;\n  border-radius: 12px;\n  border: 1px solid rgba(120, 104, 166, 0.22);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.92) 0%,\n      rgba(250, 248, 255, 0.88) 100%);\n}\n.event-policy-summary-card--mandatory {\n  border-color: rgba(176, 70, 70, 0.28);\n  background:\n    linear-gradient(\n      180deg,\n      #fff7f7 0%,\n      #fff0f0 100%);\n}\n.event-policy-summary-card--optional {\n  border-color: rgba(53, 113, 185, 0.26);\n  background:\n    linear-gradient(\n      180deg,\n      #f6fbff 0%,\n      #eef6ff 100%);\n}\n.event-policy-summary-card-head {\n  display: contents;\n}\n.event-policy-summary-card-head .event-slots-summary-title {\n  grid-column: 1;\n  grid-row: 1;\n  align-self: center;\n  min-width: 0;\n}\n.event-policy-summary-actions {\n  display: contents;\n}\n.event-policy-summary-badge {\n  grid-column: 2;\n  grid-row: 1;\n  align-self: center;\n  justify-self: end;\n  flex: 0 0 auto;\n  min-height: 24px;\n  padding: 0.22rem 0.48rem;\n  border-radius: 999px;\n  font-size: 0.72rem;\n  font-weight: 800;\n}\n.event-policy-summary-badge--mandatory {\n  border: 1px solid rgba(176, 70, 70, 0.34);\n  color: #a23d3d;\n  background:\n    linear-gradient(\n      180deg,\n      #fff0f0 0%,\n      #ffe4e4 100%);\n}\n.event-policy-summary-badge--optional {\n  border: 1px solid rgba(53, 113, 185, 0.34);\n  color: #2d5ea8;\n  background:\n    linear-gradient(\n      180deg,\n      #eef6ff 0%,\n      #e3efff 100%);\n}\n.event-policy-summary-approval {\n  grid-column: 2;\n  grid-row: 2;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  justify-self: center;\n  width: 24px;\n  height: 20px;\n  cursor: pointer;\n}\n.event-policy-summary-approval input {\n  width: 17px;\n  height: 17px;\n  margin: 0;\n  accent-color: #2b76bd;\n  cursor: pointer;\n}\n.event-policy-summary-approval input:disabled {\n  cursor: default;\n}\n.event-slots-summary-title {\n  font-size: 0.88rem;\n  font-weight: 800;\n  color: #294f83;\n}\n.event-slots-summary-meta,\n.event-slots-summary-note {\n  color: rgba(37, 58, 88, 0.72);\n  font-size: 0.82rem;\n  line-height: 1.45;\n}\n.event-slots-summary-note {\n  margin: 0;\n}\n.event-policy-summary-card-head .event-slots-summary-note {\n  grid-column: 1;\n  grid-row: 2;\n}\n.event-policies-popup-body {\n  flex: 1 1 auto;\n  min-height: 0;\n  display: grid;\n  align-content: start;\n  gap: 0.72rem;\n  overflow: auto;\n  padding: 0.12rem 0.12rem 0.72rem 0.04rem;\n}\n.event-policies-list {\n  gap: 0.72rem;\n}\n.event-policies-list-compact {\n  align-content: start;\n}\n.event-slot-empty-state {\n  border: 1px dashed rgba(97, 124, 158, 0.28);\n  border-radius: 14px;\n  background: rgba(255, 255, 255, 0.64);\n  color: rgba(37, 58, 88, 0.68);\n  padding: 1rem;\n  display: grid;\n  place-items: center;\n  min-height: 96px;\n}\n.event-policy-empty-state {\n  gap: 0.8rem;\n}\n@media (max-width: 760px) {\n  .event-slots-open-btn-inline {\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=policies-input.component.css.map */\n"] }]
  }], () => [{ type: ChangeDetectorRef }], { readOnly: [{
    type: Input
  }], disabled: [{
    type: Input
  }], config: [{
    type: Input
  }], enabled: [{
    type: Input
  }], enabledChange: [{
    type: Output
  }], handleEscape: [{
    type: HostListener,
    args: ["document:keydown.escape", ["$event"]]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PoliciesInputComponent, { className: "PoliciesInputComponent", filePath: "app/shared/ui/components/core/form/inputs/policies-input/policies-input.component.ts", lineNumber: 96 });
})();

// src/app/shared/ui/components/core/form/inputs/route-input/route-input.component.ts
function RouteInputComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.panelSubtitle());
  }
}
function RouteInputComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 7)(1, "button", 15);
    \u0275\u0275listener("click", function RouteInputComponent_Conditional_15_Template_button_click_1_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.openRoutePopup($event));
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "tune");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.openRouteLabel());
  }
}
function RouteInputComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 16);
    \u0275\u0275listener("click", function RouteInputComponent_Conditional_21_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.openRouteMap($event));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "map");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", ctx_r0.mapAriaLabel());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.mapLabel());
  }
}
function RouteInputComponent_Conditional_22_For_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 18);
    \u0275\u0275text(1, "arrow_forward");
    \u0275\u0275elementEnd();
  }
}
function RouteInputComponent_Conditional_22_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(2, RouteInputComponent_Conditional_22_For_2_Conditional_2_Template, 2, 0, "mat-icon", 18);
  }
  if (rf & 2) {
    const stop_r4 = ctx.$implicit;
    const \u0275$index_61_r5 = ctx.$index;
    const \u0275$count_61_r6 = ctx.$count;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(stop_r4);
    \u0275\u0275advance();
    \u0275\u0275conditional(!(\u0275$index_61_r5 === \u0275$count_61_r6 - 1) ? 2 : -1);
  }
}
function RouteInputComponent_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13);
    \u0275\u0275repeaterCreate(1, RouteInputComponent_Conditional_22_For_2_Template, 3, 2, null, null, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", ctx_r0.routeCountLabel());
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.visibleRoutes());
  }
}
function RouteInputComponent_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.emptyRouteLabel());
  }
}
function RouteInputComponent_Conditional_24_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function RouteInputComponent_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, RouteInputComponent_Conditional_24_ng_container_0_Template, 1, 0, "ng-container", 19);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngComponentOutlet", ctx)("ngComponentOutletInputs", ctx_r0.routeEditorOutletInputs());
  }
}
var RouteInputComponent = class _RouteInputComponent {
  static ownerSequence = 0;
  readOnly = false;
  disabled = false;
  config = {};
  routes = [];
  saving = false;
  error = "";
  cdr = inject(ChangeDetectorRef);
  i18n = inject(I18nService);
  formFlowPopupStore = inject(FormFlowPopupStore);
  ownerId = this.nextOwnerId();
  routeEditorOutletInputs = computed(() => {
    const editor = this.formFlowPopupStore.routeInputEditorRef();
    return {
      editor: editor?.ownerId === this.ownerId ? editor : null
    };
  }, ...ngDevMode ? [{ debugName: "routeEditorOutletInputs" }] : (
    /* istanbul ignore next */
    []
  ));
  rowIdSequence = 0;
  controlDisabled = false;
  workingRoutes = [];
  routeRowIds = [];
  onModelChange = () => {
  };
  onModelTouched = () => {
  };
  lastRouteEditorActionRequestId = 0;
  destroyEffects = [];
  constructor() {
    this.destroyEffects.push(effect(() => {
      if (this.routeEditorIsOpen()) {
        void this.formFlowPopupStore.ensureRouteInputEditorLoaded();
      }
    }), effect(() => {
      const request = this.formFlowPopupStore.routeInputEditorActionRequest();
      if (!request || request.requestId <= this.lastRouteEditorActionRequestId) {
        return;
      }
      this.lastRouteEditorActionRequestId = request.requestId;
      untracked(() => this.handleRouteEditorActionRequest(request));
    }));
  }
  ngOnDestroy() {
    this.destroyEffects.forEach((item) => item.destroy());
    if (this.routeEditorIsOpen()) {
      this.formFlowPopupStore.closeRouteInputEditor(this.ownerId);
    }
  }
  writeValue(value) {
    this.routes = this.normalizeRoutes(value);
    if (this.routeEditorIsOpen() && !this.saving) {
      this.resetWorkingRoutes();
      this.updateEditorState();
    }
    this.cdr.markForCheck();
  }
  registerOnChange(fn) {
    this.onModelChange = fn;
  }
  registerOnTouched(fn) {
    this.onModelTouched = fn;
  }
  setDisabledState(isDisabled) {
    this.controlDisabled = isDisabled;
    this.cdr.markForCheck();
  }
  locked() {
    return this.readOnly || this.disabled || this.controlDisabled || this.editable() === false;
  }
  panelTitle() {
    return this.i18n.translate(this.resolveConfigValue(this.config.title, "route"));
  }
  panelSubtitle() {
    return this.i18n.translate(this.resolveConfigValue(this.config.subtitle, "asset.assignment.route.subtitle"));
  }
  openRouteLabel() {
    return this.i18n.translate(this.resolveConfigValue(this.config.openLabel, "asset.assignment.route.open"));
  }
  emptyRouteLabel() {
    return this.i18n.translate(this.locked() ? this.resolveConfigValue(this.config.readOnlyEmptyLabel, "asset.assignment.route.empty") : this.resolveConfigValue(this.config.emptyLabel, "asset.assignment.route.empty"));
  }
  routeCountLabel() {
    const count = this.visibleRoutes().length;
    return this.i18n.translateParams(count === 1 ? "asset.assignment.route.stop.one" : "asset.assignment.route.stop.many", { count });
  }
  toggleLabel() {
    return this.i18n.translate(this.routeEnabled() ? "on" : "off");
  }
  summaryLabel() {
    return this.i18n.translate("summary");
  }
  mapLabel() {
    return this.i18n.translate("map");
  }
  mapAriaLabel() {
    return this.i18n.translate("asset.assignment.route.map.aria");
  }
  visibleRoutes() {
    return this.normalizeRoutes(this.routes);
  }
  hasRoute() {
    return this.visibleRoutes().length > 0;
  }
  routeEnabled() {
    return this.resolveConfigValue(this.config.enabled, this.hasRoute()) === true;
  }
  toggleRouteEnabled(event) {
    event?.preventDefault();
    event?.stopPropagation();
    if (this.locked() || this.saving) {
      return;
    }
    this.config.onEnabledChange?.(!this.routeEnabled());
    this.onModelTouched();
    this.cdr.markForCheck();
  }
  openRoutePopup(event) {
    event?.preventDefault();
    event?.stopPropagation();
    if (this.locked()) {
      return;
    }
    this.resetWorkingRoutes();
    this.error = "";
    this.formFlowPopupStore.openRouteInputEditor(this.buildEditorState());
    this.onModelTouched();
    this.cdr.markForCheck();
  }
  closeRoutePopup(event) {
    event?.preventDefault();
    event?.stopPropagation();
    if (this.saving) {
      return;
    }
    this.formFlowPopupStore.closeRouteInputEditor(this.ownerId);
    this.error = "";
    this.cdr.markForCheck();
  }
  replaceRouteDraft(routes, routeRowIds, event) {
    event?.preventDefault();
    event?.stopPropagation();
    if (this.locked() || this.saving) {
      return;
    }
    const nextRoutes = routes.length > 0 ? [...routes] : [""];
    const nextRowIds = nextRoutes.map((_route, index) => routeRowIds[index] ?? this.nextRouteRowId());
    this.workingRoutes = nextRoutes;
    this.routeRowIds = nextRowIds;
    if (this.workingRoutes.length === 0) {
      this.workingRoutes = [""];
      this.routeRowIds = [this.nextRouteRowId()];
    }
    this.error = "";
    this.updateEditorState();
    this.cdr.markForCheck();
  }
  canSaveRoute() {
    if (this.locked() || this.saving) {
      return false;
    }
    return !this.routesEqual(this.normalizeRoutes(this.workingRoutes), this.routes);
  }
  saveRoute(routes, routeRowIds, event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.replaceRouteDraft(routes, routeRowIds);
    if (!this.canSaveRoute()) {
      return;
    }
    const normalized = this.normalizeRoutes(this.workingRoutes);
    this.routes = normalized;
    this.formFlowPopupStore.closeRouteInputEditor(this.ownerId);
    this.emitRoutes();
    this.cdr.markForCheck();
  }
  openRouteMap(event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.openGoogleMapsDirections(this.routes);
  }
  resetWorkingRoutes() {
    const routes = this.routes.length > 0 ? [...this.routes] : [""];
    this.workingRoutes = routes;
    this.routeRowIds = routes.map(() => this.nextRouteRowId());
  }
  emitRoutes() {
    const nextRoutes = [...this.routes];
    this.onModelChange(nextRoutes);
    this.onModelTouched();
  }
  normalizeRoutes(routes) {
    return (routes ?? []).map((stop) => `${stop ?? ""}`.trim()).filter((stop) => stop.length > 0);
  }
  routesEqual(left, right) {
    if (left.length !== right.length) {
      return false;
    }
    return left.every((stop, index) => stop === right[index]);
  }
  editable() {
    return this.resolveConfigValue(this.config.editable, true) !== false;
  }
  nextOwnerId() {
    _RouteInputComponent.ownerSequence += 1;
    return `route-input-${Date.now()}-${_RouteInputComponent.ownerSequence}`;
  }
  nextRouteRowId() {
    this.rowIdSequence += 1;
    return `route-input-stop-${Date.now()}-${this.rowIdSequence}`;
  }
  routeEditorIsOpen() {
    return this.formFlowPopupStore.routeInputEditorRef()?.ownerId === this.ownerId;
  }
  buildEditorState() {
    return {
      ownerId: this.ownerId,
      title: this.resolveConfigValue(this.config.popupTitle, "Route Setup"),
      subtitle: this.resolveConfigValue(this.config.popupSubtitle, "Set the runtime route for this event asset."),
      zIndex: this.routePopupZIndex(),
      routes: [...this.workingRoutes],
      routeRowIds: [...this.routeRowIds],
      saving: this.saving,
      error: this.error || null,
      canSave: this.canSaveRoute(),
      readOnly: this.locked()
    };
  }
  updateEditorState() {
    if (!this.routeEditorIsOpen()) {
      return;
    }
    this.formFlowPopupStore.updateRouteInputEditor(this.buildEditorState());
  }
  routePopupZIndex() {
    const parentZIndex = Number(this.resolveConfigValue(this.config.parentZIndex, null));
    return Number.isFinite(parentZIndex) && parentZIndex > 0 ? Math.trunc(parentZIndex) + 100 : 12600;
  }
  routeEditorComponent() {
    return this.routeEditorIsOpen() ? this.formFlowPopupStore.routeInputEditorComponent() : null;
  }
  handleRouteEditorActionRequest(request) {
    if (request.ownerId !== this.ownerId) {
      return;
    }
    switch (request.kind) {
      case "close":
        this.closeRoutePopup(request.event);
        return;
      case "save":
        this.saveRoute(request.routes, request.routeRowIds, request.event);
        return;
    }
  }
  resolveConfigValue(value, fallback) {
    if (typeof value === "function") {
      return value();
    }
    return value ?? fallback;
  }
  openGoogleMapsSearch(query) {
    const trimmed = query.trim();
    if (!trimmed || typeof window === "undefined") {
      return;
    }
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`, "_blank", "noopener,noreferrer");
  }
  openGoogleMapsDirections(stops) {
    const normalized = this.normalizeRoutes(stops);
    if (normalized.length === 0 || typeof window === "undefined") {
      return;
    }
    if (normalized.length === 1) {
      this.openGoogleMapsSearch(normalized[0]);
      return;
    }
    const origin = normalized[0];
    const destination = normalized[normalized.length - 1];
    const waypoints = normalized.slice(1, -1);
    let url = `https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
    if (waypoints.length > 0) {
      url += `&waypoints=${encodeURIComponent(waypoints.join("|"))}`;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }
  static \u0275fac = function RouteInputComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RouteInputComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RouteInputComponent, selectors: [["app-route-input"]], inputs: { readOnly: "readOnly", disabled: "disabled", config: "config" }, features: [\u0275\u0275ProvidersFeature([
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => _RouteInputComponent),
      multi: true
    }
  ])], decls: 25, vars: 17, consts: [[1, "route-input"], [1, "route-input__head"], [1, "route-input__title"], [1, "route-input__title-text"], [1, "route-input__subtitle"], ["type", "button", 1, "route-input__toggle", 3, "click", "disabled"], [1, "route-input__body"], [1, "route-input__summary-actions"], [1, "route-input__summary"], [1, "route-input__summary-block"], [1, "route-input__summary-head"], [1, "route-input__summary-label"], ["type", "button", 1, "route-input__map-btn"], [1, "route-input__route-strip"], [1, "route-input__summary-note"], ["type", "button", 1, "route-input__open-btn", 3, "click"], ["type", "button", 1, "route-input__map-btn", 3, "click"], [1, "route-input__route-stop"], [1, "route-input__route-arrow"], [4, "ngComponentOutlet", "ngComponentOutletInputs"]], template: function RouteInputComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0)(1, "header", 1)(2, "div", 2)(3, "span", 3)(4, "mat-icon");
      \u0275\u0275text(5, "route");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "span");
      \u0275\u0275text(7);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(8, RouteInputComponent_Conditional_8_Template, 2, 1, "span", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "button", 5);
      \u0275\u0275listener("click", function RouteInputComponent_Template_button_click_9_listener($event) {
        return ctx.toggleRouteEnabled($event);
      });
      \u0275\u0275elementStart(10, "mat-icon");
      \u0275\u0275text(11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "span");
      \u0275\u0275text(13);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(14, "div", 6);
      \u0275\u0275conditionalCreate(15, RouteInputComponent_Conditional_15_Template, 6, 1, "div", 7);
      \u0275\u0275elementStart(16, "div", 8)(17, "section", 9)(18, "div", 10)(19, "span", 11);
      \u0275\u0275text(20);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(21, RouteInputComponent_Conditional_21_Template, 5, 2, "button", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(22, RouteInputComponent_Conditional_22_Template, 3, 1, "div", 13)(23, RouteInputComponent_Conditional_23_Template, 2, 1, "p", 14);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275conditionalCreate(24, RouteInputComponent_Conditional_24_Template, 1, 2, "ng-container");
    }
    if (rf & 2) {
      let tmp_13_0;
      \u0275\u0275classProp("route-input--readonly", ctx.locked())("route-input--has-route", ctx.hasRoute());
      \u0275\u0275advance(7);
      \u0275\u0275textInterpolate(ctx.panelTitle());
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.locked() ? 8 : -1);
      \u0275\u0275advance();
      \u0275\u0275classProp("is-on", ctx.routeEnabled());
      \u0275\u0275property("disabled", ctx.locked() || ctx.saving);
      \u0275\u0275attribute("aria-pressed", ctx.routeEnabled());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.routeEnabled() ? "toggle_on" : "toggle_off");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.toggleLabel());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(!ctx.locked() ? 15 : -1);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.summaryLabel());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.routeEnabled() && ctx.hasRoute() ? 21 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.routeEnabled() && ctx.hasRoute() ? 22 : 23);
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_13_0 = ctx.routeEditorComponent()) ? 24 : -1, tmp_13_0);
    }
  }, dependencies: [CommonModule, NgComponentOutlet, MatIconModule, MatIcon], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n  min-width: 0;\n}\n.route-input[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.62rem;\n  min-width: 0;\n  padding: 0.62rem 0.72rem;\n  border-radius: 16px;\n  border: 1px solid rgba(82, 137, 193, 0.26);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(243, 249, 255, 0.98) 0%,\n      rgba(232, 242, 254, 0.94) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(111, 165, 222, 0.16),\n      transparent 36%),\n    radial-gradient(\n      circle at bottom left,\n      rgba(86, 168, 177, 0.12),\n      transparent 44%);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.86), 0 12px 30px rgba(31, 58, 97, 0.07);\n}\n.route-input__head[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: start;\n  gap: 0.62rem;\n}\n.route-input__title[_ngcontent-%COMP%] {\n  display: grid;\n  min-width: 0;\n}\n.route-input__title-text[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n  color: #1f5790;\n  font-size: 1rem;\n  font-weight: 800;\n}\n.route-input__title-text[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.route-input__subtitle[_ngcontent-%COMP%] {\n  color: rgba(35, 57, 88, 0.74);\n  font-size: 0.8rem;\n  line-height: 1.4;\n}\n.route-input__body[_ngcontent-%COMP%], \n.route-input__summary[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.62rem;\n  min-width: 0;\n}\n.route-input__summary-actions[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n}\n.route-input__open-btn[_ngcontent-%COMP%], \n.route-input__map-btn[_ngcontent-%COMP%], \n.route-input__toggle[_ngcontent-%COMP%] {\n  border: 0;\n  transition:\n    transform 0.18s ease,\n    box-shadow 0.18s ease,\n    background-color 0.18s ease,\n    opacity 0.18s ease;\n}\n.route-input__toggle[_ngcontent-%COMP%] {\n  justify-self: end;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.4rem;\n  min-width: 82px;\n  min-height: 38px;\n  padding: 0.3rem 0.62rem;\n  border-radius: 999px;\n  color: #5b6e8e;\n  background:\n    linear-gradient(\n      180deg,\n      #f4f7fb 0%,\n      #e9eff7 100%);\n  border: 1px solid rgba(86, 108, 145, 0.22);\n  box-shadow: 0 2px 7px rgba(29, 53, 86, 0.08);\n  cursor: pointer;\n  font-size: 0.76rem;\n  font-weight: 800;\n  text-transform: uppercase;\n}\n.route-input__toggle.is-on[_ngcontent-%COMP%] {\n  color: #2d7d47;\n  background:\n    linear-gradient(\n      180deg,\n      #ecf8ee 0%,\n      #ddf1e2 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n}\n.route-input__toggle[_ngcontent-%COMP%]:disabled {\n  opacity: 0.66;\n  cursor: default;\n  pointer-events: none;\n  filter: saturate(0.66);\n  box-shadow: none;\n}\n.route-input__toggle[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.route-input__open-btn[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.5rem;\n  min-height: 40px;\n  padding: 0.62rem 0.9rem;\n  border-radius: 14px;\n  color: #214863;\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #eff6ff 100%);\n  box-shadow: inset 0 0 0 1px rgba(99, 137, 184, 0.26), 0 10px 22px rgba(31, 58, 97, 0.08);\n  cursor: pointer;\n  font-size: 0.86rem;\n  font-weight: 800;\n}\n.route-input__open-btn[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.route-input__summary-block[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.68rem;\n  min-width: 0;\n  padding: 0.86rem 0.95rem;\n  border-radius: 14px;\n  border: 1px solid rgba(102, 132, 174, 0.24);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.94) 0%,\n      rgba(247, 251, 255, 0.9) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(90, 149, 211, 0.1),\n      transparent 44%);\n}\n.route-input__summary-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.58rem;\n  min-width: 0;\n}\n.route-input__summary-label[_ngcontent-%COMP%] {\n  color: rgba(43, 64, 96, 0.72);\n  font-size: 0.72rem;\n  font-weight: 900;\n  letter-spacing: 0.04em;\n  text-transform: uppercase;\n}\n.route-input__summary-note[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #566987;\n  font-size: 0.84rem;\n  line-height: 1.45;\n}\n.route-input__route-strip[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n  min-width: 0;\n  padding: 0.4rem;\n  border-radius: 12px;\n  background: #eef6ff;\n  box-shadow: inset 0 0 0 1px rgba(91, 131, 181, 0.2);\n}\n.route-input__route-stop[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  min-height: 24px;\n  min-width: 44px;\n  max-width: 100%;\n  justify-content: center;\n  padding: 0.22rem 0.58rem;\n  border-radius: 999px;\n  color: #8a4f13;\n  background: #fff0dc;\n  box-shadow: inset 0 0 0 1px rgba(179, 111, 34, 0.26);\n  font-size: 0.82rem;\n  font-weight: 800;\n  line-height: 1.15;\n  overflow-wrap: anywhere;\n}\n.route-input__route-stop[_ngcontent-%COMP%]:nth-of-type(4n+2) {\n  color: #7e426c;\n  background: #ffe8f5;\n  box-shadow: inset 0 0 0 1px rgba(166, 72, 133, 0.24);\n}\n.route-input__route-stop[_ngcontent-%COMP%]:nth-of-type(4n+3) {\n  color: #286a4f;\n  background: #e5f7ec;\n  box-shadow: inset 0 0 0 1px rgba(53, 139, 96, 0.24);\n}\n.route-input__route-stop[_ngcontent-%COMP%]:nth-of-type(4n+4) {\n  color: #614fa0;\n  background: #efe9ff;\n  box-shadow: inset 0 0 0 1px rgba(103, 82, 173, 0.24);\n}\n.route-input__route-arrow[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: rgba(42, 76, 120, 0.62);\n}\n.route-input__map-btn[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n  min-height: 32px;\n  padding: 0.36rem 0.72rem;\n  border-radius: 999px;\n  color: #1f5790;\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #ecf5ff 100%);\n  box-shadow: inset 0 0 0 1px rgba(88, 129, 180, 0.24), 0 6px 15px rgba(31, 58, 97, 0.08);\n  cursor: pointer;\n  font-size: 0.78rem;\n  font-weight: 800;\n}\n.route-input__map-btn[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n@media (max-width: 720px) {\n  .route-input[_ngcontent-%COMP%] {\n    padding: 0.58rem;\n  }\n  .route-input__head[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .route-input__toggle[_ngcontent-%COMP%] {\n    justify-self: start;\n  }\n  .route-input__summary-head[_ngcontent-%COMP%] {\n    align-items: flex-start;\n  }\n}\n@media (max-width: 560px) {\n  .route-input__route-strip[_ngcontent-%COMP%] {\n    display: grid;\n    justify-items: stretch;\n  }\n  .route-input__route-stop[_ngcontent-%COMP%] {\n    justify-content: center;\n    width: 100%;\n    box-sizing: border-box;\n  }\n  .route-input__route-arrow[_ngcontent-%COMP%] {\n    justify-self: center;\n    transform: rotate(90deg);\n  }\n}\n/*# sourceMappingURL=route-input.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RouteInputComponent, [{
    type: Component,
    args: [{ selector: "app-route-input", standalone: true, imports: [
      CommonModule,
      MatIconModule
    ], changeDetection: ChangeDetectionStrategy.OnPush, providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => RouteInputComponent),
        multi: true
      }
    ], template: `<section class="route-input" [class.route-input--readonly]="locked()" [class.route-input--has-route]="hasRoute()">
  <header class="route-input__head">
    <div class="route-input__title">
      <span class="route-input__title-text">
        <mat-icon>route</mat-icon>
        <span>{{ panelTitle() }}</span>
      </span>
      @if (!locked()) {
        <span class="route-input__subtitle">{{ panelSubtitle() }}</span>
      }
    </div>
    <button
      type="button"
      class="route-input__toggle"
      [class.is-on]="routeEnabled()"
      [disabled]="locked() || saving"
      [attr.aria-pressed]="routeEnabled()"
      (click)="toggleRouteEnabled($event)"
    >
      <mat-icon>{{ routeEnabled() ? 'toggle_on' : 'toggle_off' }}</mat-icon>
      <span>{{ toggleLabel() }}</span>
    </button>
  </header>

  <div class="route-input__body">
    @if (!locked()) {
      <div class="route-input__summary-actions">
        <button type="button" class="route-input__open-btn" (click)="openRoutePopup($event)">
          <mat-icon>tune</mat-icon>
          <span>{{ openRouteLabel() }}</span>
        </button>
      </div>
    }

    <div class="route-input__summary">
      <section class="route-input__summary-block">
        <div class="route-input__summary-head">
          <span class="route-input__summary-label">{{ summaryLabel() }}</span>
          @if (routeEnabled() && hasRoute()) {
            <button
              type="button"
              class="route-input__map-btn"
              (click)="openRouteMap($event)"
              [attr.aria-label]="mapAriaLabel()"
            >
              <mat-icon>map</mat-icon>
              <span>{{ mapLabel() }}</span>
            </button>
          }
        </div>
        @if (routeEnabled() && hasRoute()) {
          <div class="route-input__route-strip" [attr.aria-label]="routeCountLabel()">
            @for (stop of visibleRoutes(); track $index; let last = $last) {
              <span class="route-input__route-stop">{{ stop }}</span>
              @if (!last) {
                <mat-icon class="route-input__route-arrow">arrow_forward</mat-icon>
              }
            }
          </div>
        } @else {
          <p class="route-input__summary-note">{{ emptyRouteLabel() }}</p>
        }
      </section>
    </div>
  </div>
</section>

@if (routeEditorComponent(); as editorComponent) {
  <ng-container *ngComponentOutlet="editorComponent; inputs: routeEditorOutletInputs()"></ng-container>
}
`, styles: ["/* src/app/shared/ui/components/core/form/inputs/route-input/route-input.component.scss */\n:host {\n  display: block;\n  width: 100%;\n  min-width: 0;\n}\n.route-input {\n  display: grid;\n  gap: 0.62rem;\n  min-width: 0;\n  padding: 0.62rem 0.72rem;\n  border-radius: 16px;\n  border: 1px solid rgba(82, 137, 193, 0.26);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(243, 249, 255, 0.98) 0%,\n      rgba(232, 242, 254, 0.94) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(111, 165, 222, 0.16),\n      transparent 36%),\n    radial-gradient(\n      circle at bottom left,\n      rgba(86, 168, 177, 0.12),\n      transparent 44%);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.86), 0 12px 30px rgba(31, 58, 97, 0.07);\n}\n.route-input__head {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: start;\n  gap: 0.62rem;\n}\n.route-input__title {\n  display: grid;\n  min-width: 0;\n}\n.route-input__title-text {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n  color: #1f5790;\n  font-size: 1rem;\n  font-weight: 800;\n}\n.route-input__title-text mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.route-input__subtitle {\n  color: rgba(35, 57, 88, 0.74);\n  font-size: 0.8rem;\n  line-height: 1.4;\n}\n.route-input__body,\n.route-input__summary {\n  display: grid;\n  gap: 0.62rem;\n  min-width: 0;\n}\n.route-input__summary-actions {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n}\n.route-input__open-btn,\n.route-input__map-btn,\n.route-input__toggle {\n  border: 0;\n  transition:\n    transform 0.18s ease,\n    box-shadow 0.18s ease,\n    background-color 0.18s ease,\n    opacity 0.18s ease;\n}\n.route-input__toggle {\n  justify-self: end;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.4rem;\n  min-width: 82px;\n  min-height: 38px;\n  padding: 0.3rem 0.62rem;\n  border-radius: 999px;\n  color: #5b6e8e;\n  background:\n    linear-gradient(\n      180deg,\n      #f4f7fb 0%,\n      #e9eff7 100%);\n  border: 1px solid rgba(86, 108, 145, 0.22);\n  box-shadow: 0 2px 7px rgba(29, 53, 86, 0.08);\n  cursor: pointer;\n  font-size: 0.76rem;\n  font-weight: 800;\n  text-transform: uppercase;\n}\n.route-input__toggle.is-on {\n  color: #2d7d47;\n  background:\n    linear-gradient(\n      180deg,\n      #ecf8ee 0%,\n      #ddf1e2 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n}\n.route-input__toggle:disabled {\n  opacity: 0.66;\n  cursor: default;\n  pointer-events: none;\n  filter: saturate(0.66);\n  box-shadow: none;\n}\n.route-input__toggle mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.route-input__open-btn {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.5rem;\n  min-height: 40px;\n  padding: 0.62rem 0.9rem;\n  border-radius: 14px;\n  color: #214863;\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #eff6ff 100%);\n  box-shadow: inset 0 0 0 1px rgba(99, 137, 184, 0.26), 0 10px 22px rgba(31, 58, 97, 0.08);\n  cursor: pointer;\n  font-size: 0.86rem;\n  font-weight: 800;\n}\n.route-input__open-btn mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.route-input__summary-block {\n  display: grid;\n  gap: 0.68rem;\n  min-width: 0;\n  padding: 0.86rem 0.95rem;\n  border-radius: 14px;\n  border: 1px solid rgba(102, 132, 174, 0.24);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.94) 0%,\n      rgba(247, 251, 255, 0.9) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(90, 149, 211, 0.1),\n      transparent 44%);\n}\n.route-input__summary-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.58rem;\n  min-width: 0;\n}\n.route-input__summary-label {\n  color: rgba(43, 64, 96, 0.72);\n  font-size: 0.72rem;\n  font-weight: 900;\n  letter-spacing: 0.04em;\n  text-transform: uppercase;\n}\n.route-input__summary-note {\n  margin: 0;\n  color: #566987;\n  font-size: 0.84rem;\n  line-height: 1.45;\n}\n.route-input__route-strip {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n  min-width: 0;\n  padding: 0.4rem;\n  border-radius: 12px;\n  background: #eef6ff;\n  box-shadow: inset 0 0 0 1px rgba(91, 131, 181, 0.2);\n}\n.route-input__route-stop {\n  display: inline-flex;\n  align-items: center;\n  min-height: 24px;\n  min-width: 44px;\n  max-width: 100%;\n  justify-content: center;\n  padding: 0.22rem 0.58rem;\n  border-radius: 999px;\n  color: #8a4f13;\n  background: #fff0dc;\n  box-shadow: inset 0 0 0 1px rgba(179, 111, 34, 0.26);\n  font-size: 0.82rem;\n  font-weight: 800;\n  line-height: 1.15;\n  overflow-wrap: anywhere;\n}\n.route-input__route-stop:nth-of-type(4n+2) {\n  color: #7e426c;\n  background: #ffe8f5;\n  box-shadow: inset 0 0 0 1px rgba(166, 72, 133, 0.24);\n}\n.route-input__route-stop:nth-of-type(4n+3) {\n  color: #286a4f;\n  background: #e5f7ec;\n  box-shadow: inset 0 0 0 1px rgba(53, 139, 96, 0.24);\n}\n.route-input__route-stop:nth-of-type(4n+4) {\n  color: #614fa0;\n  background: #efe9ff;\n  box-shadow: inset 0 0 0 1px rgba(103, 82, 173, 0.24);\n}\n.route-input__route-arrow {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: rgba(42, 76, 120, 0.62);\n}\n.route-input__map-btn {\n  flex: 0 0 auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n  min-height: 32px;\n  padding: 0.36rem 0.72rem;\n  border-radius: 999px;\n  color: #1f5790;\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #ecf5ff 100%);\n  box-shadow: inset 0 0 0 1px rgba(88, 129, 180, 0.24), 0 6px 15px rgba(31, 58, 97, 0.08);\n  cursor: pointer;\n  font-size: 0.78rem;\n  font-weight: 800;\n}\n.route-input__map-btn mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n@media (max-width: 720px) {\n  .route-input {\n    padding: 0.58rem;\n  }\n  .route-input__head {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .route-input__toggle {\n    justify-self: start;\n  }\n  .route-input__summary-head {\n    align-items: flex-start;\n  }\n}\n@media (max-width: 560px) {\n  .route-input__route-strip {\n    display: grid;\n    justify-items: stretch;\n  }\n  .route-input__route-stop {\n    justify-content: center;\n    width: 100%;\n    box-sizing: border-box;\n  }\n  .route-input__route-arrow {\n    justify-self: center;\n    transform: rotate(90deg);\n  }\n}\n/*# sourceMappingURL=route-input.component.css.map */\n"] }]
  }], () => [], { readOnly: [{
    type: Input
  }], disabled: [{
    type: Input
  }], config: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RouteInputComponent, { className: "RouteInputComponent", filePath: "app/shared/ui/components/core/form/inputs/route-input/route-input.component.ts", lineNumber: 59 });
})();

// src/app/shared/ui/components/core/form/flow/form-flow.component.ts
var _c0 = ["flowViewport"];
var _forTrack02 = ($index, $item) => $item.id;
function FormFlowComponent_ng_template_1_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 12);
    \u0275\u0275element(1, "app-indicator", 13);
    \u0275\u0275elementEnd();
  }
}
function FormFlowComponent_ng_template_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 11);
    \u0275\u0275listener("click", function FormFlowComponent_ng_template_1_Conditional_1_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.emitSave($event));
    });
    \u0275\u0275conditionalCreate(1, FormFlowComponent_ng_template_1_Conditional_1_Conditional_1_Template, 2, 0, "span", 12);
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("is-missing", ctx_r1.totalMissingRequiredCount() > 0)("is-saving", ctx_r1.saving);
    \u0275\u0275property("disabled", !ctx_r1.canSave());
    \u0275\u0275attribute("aria-label", ctx_r1.saveAriaLabel())("title", ctx_r1.totalMissingRequiredCount() > 0 ? ctx_r1.totalMissingRequiredCount() + " required field missing" : ctx_r1.saveAriaLabel());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.saving ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.saveIcon());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.saveLabel());
  }
}
function FormFlowComponent_ng_template_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("is-missing", ctx_r1.currentPageMissingRequired());
    \u0275\u0275attribute("title", ctx_r1.currentPageMissingRequired() ? ctx_r1.currentMissingRequiredCount() + " required field missing" : ctx_r1.pageCounterLabel());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.pageCounterLabel(), " ");
  }
}
function FormFlowComponent_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275conditionalCreate(1, FormFlowComponent_ng_template_1_Conditional_1_Template, 6, 10, "button", 8)(2, FormFlowComponent_ng_template_1_Conditional_2_Template, 2, 4, "span", 9);
    \u0275\u0275elementStart(3, "div", 10);
    \u0275\u0275element(4, "span");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", ctx_r1.pageCounterLabel());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.showSaveAction() ? 1 : 2);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("is-missing", ctx_r1.currentPageMissingRequired());
    \u0275\u0275advance();
    \u0275\u0275styleProp("width", ctx_r1.progressPercent(), "%");
  }
}
function FormFlowComponent_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 15)(1, "button", 16);
    \u0275\u0275listener("click", function FormFlowComponent_ng_template_3_Template_button_click_1_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.goPrevious($event));
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "chevron_left");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "button", 17);
    \u0275\u0275listener("click", function FormFlowComponent_ng_template_3_Template_button_click_4_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.goNext($event));
    });
    \u0275\u0275elementStart(5, "mat-icon");
    \u0275\u0275text(6, "chevron_right");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.isDisabled() || ctx_r1.visiblePageIndex() <= 0);
    \u0275\u0275advance(3);
    \u0275\u0275classProp("is-blocked", ctx_r1.nextStepBlocked());
    \u0275\u0275property("disabled", ctx_r1.isDisabled() || ctx_r1.visiblePageIndex() >= ctx_r1.totalPageCount() - 1 || ctx_r1.nextStepBlocked());
    \u0275\u0275attribute("aria-label", ctx_r1.nextStepBlocked() ? "Complete required fields before continuing" : "Next step")("title", ctx_r1.nextStepBlocked() ? ctx_r1.currentMissingRequiredCount() + " required field missing" : "Next step");
  }
}
function FormFlowComponent_Conditional_5_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.activeSubtitle());
  }
}
function FormFlowComponent_Conditional_5_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0, 20);
  }
  if (rf & 2) {
    \u0275\u0275nextContext(2);
    const progressControls_r4 = \u0275\u0275reference(2);
    \u0275\u0275property("ngTemplateOutlet", progressControls_r4);
  }
}
function FormFlowComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "header", 4)(1, "div", 18)(2, "span", 19);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h2");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, FormFlowComponent_Conditional_5_Conditional_6_Template, 2, 1, "p");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, FormFlowComponent_Conditional_5_Conditional_7_Template, 1, 1, "ng-container", 20);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.model == null ? null : ctx_r1.model.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.activeTitle());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.activeSubtitle() ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r1.isGroupedLayout() ? 7 : -1);
  }
}
function FormFlowComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 5);
    \u0275\u0275element(1, "app-indicator", 21);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((ctx_r1.model == null ? null : ctx_r1.model.loadingLabel) || "Loading form");
  }
}
function FormFlowComponent_Conditional_7_Conditional_1_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1, "priority_high");
    \u0275\u0275elementEnd();
  }
}
function FormFlowComponent_Conditional_7_Conditional_1_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1, "check");
    \u0275\u0275elementEnd();
  }
}
function FormFlowComponent_Conditional_7_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23)(1, "span", 29)(2, "mat-icon");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, FormFlowComponent_Conditional_7_Conditional_1_Conditional_6_Template, 2, 0, "mat-icon")(7, FormFlowComponent_Conditional_7_Conditional_1_Conditional_7_Template, 2, 0, "mat-icon");
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainer(8, 20);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    const progressControls_r4 = \u0275\u0275reference(2);
    \u0275\u0275advance();
    \u0275\u0275classProp("is-missing", ctx_r1.currentPageMissingRequired())("is-complete", ctx_r1.currentPageRequiredComplete());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.activeStepIcon());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.activeTitle());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.currentPageMissingRequired() ? 6 : ctx_r1.currentPageRequiredComplete() ? 7 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngTemplateOutlet", progressControls_r4);
  }
}
function FormFlowComponent_Conditional_7_For_6_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const step_r6 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(step_r6.icon);
  }
}
function FormFlowComponent_Conditional_7_For_6_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32);
    \u0275\u0275conditionalCreate(1, FormFlowComponent_Conditional_7_For_6_Conditional_2_Conditional_1_Template, 2, 1, "mat-icon");
    \u0275\u0275elementStart(2, "h3", 36);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const step_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275conditional(step_r6.icon ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("id", \u0275\u0275interpolate1("form-flow-step-", step_r6.id));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(step_r6.title);
  }
}
function FormFlowComponent_Conditional_7_For_6_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h3", 38);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275element(2, "app-image-card", 39);
  }
  if (rf & 2) {
    const step_r6 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275property("id", \u0275\u0275interpolate1("form-flow-step-", step_r6.id));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", step_r6.header.title || step_r6.title, " ");
    \u0275\u0275advance();
    \u0275\u0275property("card", step_r6.header.imageCard);
  }
}
function FormFlowComponent_Conditional_7_For_6_Conditional_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h3", 38);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275element(2, "app-info-card", 40);
  }
  if (rf & 2) {
    const step_r6 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275property("id", \u0275\u0275interpolate1("form-flow-step-", step_r6.id));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", step_r6.header.title || step_r6.title, " ");
    \u0275\u0275advance();
    \u0275\u0275property("card", step_r6.header.infoCard);
  }
}
function FormFlowComponent_Conditional_7_For_6_Conditional_3_Conditional_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 41);
  }
  if (rf & 2) {
    const step_r6 = \u0275\u0275nextContext(3).$implicit;
    \u0275\u0275property("src", step_r6.header.imageUrl, \u0275\u0275sanitizeUrl);
  }
}
function FormFlowComponent_Conditional_7_For_6_Conditional_3_Conditional_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const step_r6 = \u0275\u0275nextContext(3).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(step_r6.header.icon);
  }
}
function FormFlowComponent_Conditional_7_For_6_Conditional_3_Conditional_3_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const step_r6 = \u0275\u0275nextContext(3).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(step_r6.header.subtitle);
  }
}
function FormFlowComponent_Conditional_7_For_6_Conditional_3_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, FormFlowComponent_Conditional_7_For_6_Conditional_3_Conditional_3_Conditional_0_Template, 1, 1, "img", 41);
    \u0275\u0275elementStart(1, "div");
    \u0275\u0275conditionalCreate(2, FormFlowComponent_Conditional_7_For_6_Conditional_3_Conditional_3_Conditional_2_Template, 2, 1, "mat-icon");
    \u0275\u0275elementStart(3, "h3", 36);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, FormFlowComponent_Conditional_7_For_6_Conditional_3_Conditional_3_Conditional_5_Template, 2, 1, "p");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const step_r6 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275conditional(step_r6.header.imageUrl ? 0 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(step_r6.header.icon ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("id", \u0275\u0275interpolate1("form-flow-step-", step_r6.id));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(step_r6.header.title || step_r6.title);
    \u0275\u0275advance();
    \u0275\u0275conditional(step_r6.header.subtitle ? 5 : -1);
  }
}
function FormFlowComponent_Conditional_7_For_6_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 37);
    \u0275\u0275conditionalCreate(1, FormFlowComponent_Conditional_7_For_6_Conditional_3_Conditional_1_Template, 3, 4)(2, FormFlowComponent_Conditional_7_For_6_Conditional_3_Conditional_2_Template, 3, 4)(3, FormFlowComponent_Conditional_7_For_6_Conditional_3_Conditional_3_Template, 6, 6);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const step_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275classProp("form-flow__step-header--card", !!(step_r6.header.imageCard || step_r6.header.infoCard))("form-flow__step-header--image-card", !!step_r6.header.imageCard)("form-flow__step-header--info-card", !!step_r6.header.infoCard);
    \u0275\u0275advance();
    \u0275\u0275conditional(step_r6.header.imageCard ? 1 : step_r6.header.infoCard ? 2 : 3);
  }
}
function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r7 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(control_r7.description);
  }
}
function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 43)(1, "h4");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, FormFlowComponent_Conditional_7_For_6_For_6_Conditional_2_Conditional_3_Template, 2, 1, "p");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(control_r7.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(control_r7.description ? 3 : -1);
  }
}
function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_3_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1, "*");
    \u0275\u0275elementEnd();
  }
}
function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 55)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275conditionalCreate(3, FormFlowComponent_Conditional_7_For_6_For_6_Conditional_3_Conditional_0_Conditional_3_Template, 2, 0, "strong");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const control_r7 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(control_r7.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(control_r7.required ? 3 : -1);
  }
}
function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275conditionalCreate(0, FormFlowComponent_Conditional_7_For_6_For_6_Conditional_3_Conditional_0_Template, 4, 2, "label", 55);
    \u0275\u0275elementStart(1, "app-menu", 56);
    \u0275\u0275listener("ngModelChange", function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_3_Template_app_menu_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r8);
      const control_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.updateControlValue(control_r7, $event));
    })("itemSelect", function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_3_Template_app_menu_itemSelect_1_listener($event) {
      \u0275\u0275restoreView(_r8);
      const control_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.emitControlAction(control_r7, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r7 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional(control_r7.label ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("kind", ctx_r1.menuKind(control_r7))("layout", ctx_r1.menuLayout(control_r7))("title", ctx_r1.menuTitle(control_r7))("filterable", ctx_r1.menuFilterable(control_r7))("trigger", ctx_r1.menuTrigger(control_r7))("model", ctx_r1.menuModel(control_r7))("items", ctx_r1.menuItems(control_r7))("panelMode", ctx_r1.menuPanelMode(control_r7))("ngModel", ctx_r1.controlValue(control_r7))("closeOnSelect", ctx_r1.menuCloseOnSelect(control_r7));
  }
}
function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_4_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1, "*");
    \u0275\u0275elementEnd();
  }
}
function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_4_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 55)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275conditionalCreate(3, FormFlowComponent_Conditional_7_For_6_For_6_Conditional_4_Conditional_0_Conditional_3_Template, 2, 0, "strong");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const control_r7 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(control_r7.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(control_r7.required ? 3 : -1);
  }
}
function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275conditionalCreate(0, FormFlowComponent_Conditional_7_For_6_For_6_Conditional_4_Conditional_0_Template, 4, 2, "label", 55);
    \u0275\u0275elementStart(1, "app-image-carousel", 57);
    \u0275\u0275listener("ngModelChange", function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_4_Template_app_image_carousel_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r9);
      const control_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.updateControlValue(control_r7, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r7 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional(control_r7.label ? 0 : -1);
    const image_r10 = ctx_r1.imageConfig(control_r7);
    \u0275\u0275advance();
    \u0275\u0275property("slotCount", image_r10.slotCount ?? 8)("compact", image_r10.compact === true)("autoSize", image_r10.autoSize === true)("previewMode", image_r10.previewMode === true && !ctx_r1.isMobileViewport)("ariaLabel", image_r10.ariaLabel || control_r7.label || "Images")("uploadOwnerId", image_r10.uploadOwnerId || "")("uploadEntityId", image_r10.uploadEntityId || "image")("disabled", ctx_r1.isControlDisabled(control_r7))("ngModel", ctx_r1.controlStringArrayValue(control_r7));
  }
}
function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_5_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1, "*");
    \u0275\u0275elementEnd();
  }
}
function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 44)(1, "input", 58);
    \u0275\u0275listener("ngModelChange", function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_5_Template_input_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r11);
      const control_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.updateControlValue(control_r7, $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275conditionalCreate(4, FormFlowComponent_Conditional_7_For_6_For_6_Conditional_5_Conditional_4_Template, 2, 0, "strong");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const control_r7 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.isControlDisabled(control_r7) || control_r7.readOnly === true)("ngModel", ctx_r1.controlBooleanValue(control_r7));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(control_r7.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(control_r7.required ? 4 : -1);
  }
}
function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_6_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1, "*");
    \u0275\u0275elementEnd();
  }
}
function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_6_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r7 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", ctx_r1.controlTextValue(control_r7).length, "/", control_r7.maxLength ?? control_r7.minLength);
  }
}
function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 55)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275conditionalCreate(3, FormFlowComponent_Conditional_7_For_6_For_6_Conditional_6_Conditional_3_Template, 2, 0, "strong");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, FormFlowComponent_Conditional_7_For_6_For_6_Conditional_6_Conditional_4_Template, 2, 2, "small");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "textarea", 59);
    \u0275\u0275listener("ngModelChange", function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_6_Template_textarea_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r12);
      const control_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.updateControlValue(control_r7, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r7 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(control_r7.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(control_r7.required ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(control_r7.maxLength || control_r7.minLength ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("rows", control_r7.rows ?? 3)("placeholder", control_r7.placeholder || "")("disabled", ctx_r1.isControlDisabled(control_r7))("readOnly", control_r7.readOnly === true)("ngModel", ctx_r1.controlTextValue(control_r7));
    \u0275\u0275attribute("minlength", control_r7.minLength ?? null)("maxlength", control_r7.maxLength ?? null);
  }
}
function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_7_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h4");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r7 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(control_r7.label);
  }
}
function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 45);
    \u0275\u0275conditionalCreate(1, FormFlowComponent_Conditional_7_For_6_For_6_Conditional_7_Conditional_1_Template, 2, 1, "h4");
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const control_r7 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275conditional(control_r7.label ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.summaryValue(control_r7));
  }
}
function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-date-input", 60);
    \u0275\u0275listener("ngModelChange", function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_8_Template_app_date_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r13);
      const control_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.updateDateControlValue(control_r7, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r7 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("model", ctx_r1.dateInputModel(control_r7))("ngModel", ctx_r1.dateControlValue(control_r7));
  }
}
function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-location-input", 61);
    \u0275\u0275listener("ngModelChange", function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_9_Template_app_location_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r14);
      const control_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.updateControlValue(control_r7, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r7 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("config", ctx_r1.locationConfig(control_r7))("readOnly", ctx_r1.isControlDisabled(control_r7))("ngModel", ctx_r1.controlTextValue(control_r7));
  }
}
function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-link-input", 62);
    \u0275\u0275listener("ngModelChange", function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_10_Template_app_link_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r15);
      const control_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.updateControlValue(control_r7, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r7 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("config", ctx_r1.linkConfig(control_r7))("readOnly", ctx_r1.isControlDisabled(control_r7))("ngModel", ctx_r1.controlTextValue(control_r7));
  }
}
function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-pricing-editor-input", 63);
    \u0275\u0275listener("ngModelChange", function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_11_Template_app_pricing_editor_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r16);
      const control_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.updateControlValue(control_r7, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r7 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("config", ctx_r1.pricingConfig(control_r7))("readOnly", ctx_r1.isControlDisabled(control_r7))("ngModel", ctx_r1.controlValue(control_r7));
  }
}
function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-route-input", 64);
    \u0275\u0275listener("ngModelChange", function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_12_Template_app_route_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r17);
      const control_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.updateControlValue(control_r7, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r7 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("config", ctx_r1.routeConfig(control_r7))("readOnly", ctx_r1.isControlDisabled(control_r7))("ngModel", ctx_r1.controlStringArrayValue(control_r7));
  }
}
function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-policies-input", 65);
    \u0275\u0275listener("enabledChange", function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_13_Template_app_policies_input_enabledChange_0_listener($event) {
      \u0275\u0275restoreView(_r18);
      const control_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.updatePoliciesEnabled(control_r7, $event));
    })("ngModelChange", function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_13_Template_app_policies_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r18);
      const control_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.updateControlValue(control_r7, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r7 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("config", ctx_r1.policiesInputConfig(control_r7))("enabled", ctx_r1.policiesEnabled(control_r7))("readOnly", ctx_r1.isControlDisabled(control_r7))("ngModel", ctx_r1.controlValue(control_r7));
  }
}
function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_14_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1, "*");
    \u0275\u0275elementEnd();
  }
}
function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 55)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275conditionalCreate(3, FormFlowComponent_Conditional_7_For_6_For_6_Conditional_14_Conditional_3_Template, 2, 0, "strong");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "input", 66);
    \u0275\u0275listener("ngModelChange", function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_14_Template_input_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r19);
      const control_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.updateControlValue(control_r7, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r7 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(control_r7.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(control_r7.required ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("type", ctx_r1.inputType(control_r7))("placeholder", control_r7.placeholder || "")("disabled", ctx_r1.isControlDisabled(control_r7))("readOnly", control_r7.readOnly === true)("ngModel", control_r7.kind === "number" ? ctx_r1.controlNumberValue(control_r7) : ctx_r1.controlTextValue(control_r7));
    \u0275\u0275attribute("min", control_r7.min ?? null)("max", control_r7.max ?? null)("minlength", control_r7.minLength ?? null)("step", control_r7.step ?? null)("maxlength", control_r7.maxLength ?? null);
  }
}
function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-menu", 67);
    \u0275\u0275listener("itemSelect", function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_15_Template_app_menu_itemSelect_0_listener($event) {
      \u0275\u0275restoreView(_r20);
      const control_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.emitControlAction(control_r7, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r7 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("kind", ctx_r1.accessoryMenuKind(control_r7))("layout", ctx_r1.accessoryMenuLayout(control_r7))("title", ctx_r1.accessoryMenuTitle(control_r7))("trigger", ctx_r1.accessoryMenuTrigger(control_r7))("model", ctx_r1.accessoryMenuModel(control_r7))("items", ctx_r1.accessoryMenuItems(control_r7))("panelMode", ctx_r1.accessoryMenuPanelMode(control_r7))("closeOnSelect", ctx_r1.accessoryMenuCloseOnSelect(control_r7));
  }
}
function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 53);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const validationError_r21 = \u0275\u0275readContextLet(0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", validationError_r21, " ");
  }
}
function FormFlowComponent_Conditional_7_For_6_For_6_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 54);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(control_r7.description);
  }
}
function FormFlowComponent_Conditional_7_For_6_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275declareLet(0);
    \u0275\u0275elementStart(1, "div", 42);
    \u0275\u0275conditionalCreate(2, FormFlowComponent_Conditional_7_For_6_For_6_Conditional_2_Template, 4, 2, "div", 43)(3, FormFlowComponent_Conditional_7_For_6_For_6_Conditional_3_Template, 2, 11)(4, FormFlowComponent_Conditional_7_For_6_For_6_Conditional_4_Template, 2, 10)(5, FormFlowComponent_Conditional_7_For_6_For_6_Conditional_5_Template, 5, 4, "label", 44)(6, FormFlowComponent_Conditional_7_For_6_For_6_Conditional_6_Template, 6, 10)(7, FormFlowComponent_Conditional_7_For_6_For_6_Conditional_7_Template, 4, 2, "article", 45)(8, FormFlowComponent_Conditional_7_For_6_For_6_Conditional_8_Template, 1, 2, "app-date-input", 46)(9, FormFlowComponent_Conditional_7_For_6_For_6_Conditional_9_Template, 1, 3, "app-location-input", 47)(10, FormFlowComponent_Conditional_7_For_6_For_6_Conditional_10_Template, 1, 3, "app-link-input", 48)(11, FormFlowComponent_Conditional_7_For_6_For_6_Conditional_11_Template, 1, 3, "app-pricing-editor-input", 49)(12, FormFlowComponent_Conditional_7_For_6_For_6_Conditional_12_Template, 1, 3, "app-route-input", 50)(13, FormFlowComponent_Conditional_7_For_6_For_6_Conditional_13_Template, 1, 4, "app-policies-input", 51)(14, FormFlowComponent_Conditional_7_For_6_For_6_Conditional_14_Template, 5, 12);
    \u0275\u0275conditionalCreate(15, FormFlowComponent_Conditional_7_For_6_For_6_Conditional_15_Template, 1, 8, "app-menu", 52);
    \u0275\u0275conditionalCreate(16, FormFlowComponent_Conditional_7_For_6_For_6_Conditional_16_Template, 2, 1, "small", 53)(17, FormFlowComponent_Conditional_7_For_6_For_6_Conditional_17_Template, 2, 1, "small", 54);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r7 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    const validationError_r22 = \u0275\u0275storeLet(ctx_r1.controlValidationError(control_r7));
    \u0275\u0275advance();
    \u0275\u0275styleProp("--form-flow-control-row-span", control_r7.rowSpan ?? null);
    \u0275\u0275classProp("form-flow__control--wide", control_r7.layout === "wide" || control_r7.layout !== "half" && (control_r7.kind === "textarea" || control_r7.kind === "image-carousel" || control_r7.kind === "review" || control_r7.kind === "section"))("form-flow__control--half", control_r7.layout === "half")("form-flow__control--with-accessory", ctx_r1.accessoryMenuConfig(control_r7))("form-flow__control--image", control_r7.kind === "image-carousel")("is-required-missing", ctx_r1.isRequiredControlMissing(control_r7))("is-invalid", !!validationError_r22);
    \u0275\u0275attribute("data-control-id", control_r7.id);
    \u0275\u0275advance();
    \u0275\u0275conditional(control_r7.kind === "section" ? 2 : control_r7.kind === "menu" ? 3 : control_r7.kind === "image-carousel" ? 4 : control_r7.kind === "checkbox" ? 5 : control_r7.kind === "textarea" ? 6 : control_r7.kind === "static" || control_r7.kind === "review" ? 7 : control_r7.kind === "date" ? 8 : control_r7.kind === "location" ? 9 : control_r7.kind === "link" ? 10 : control_r7.kind === "pricing" ? 11 : control_r7.kind === "route" ? 12 : control_r7.kind === "policies" ? 13 : 14);
    \u0275\u0275advance(13);
    \u0275\u0275conditional(ctx_r1.accessoryMenuConfig(control_r7) ? 15 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(validationError_r22 ? 16 : control_r7.description && control_r7.kind !== "section" ? 17 : -1);
  }
}
function FormFlowComponent_Conditional_7_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 30)(1, "div", 31);
    \u0275\u0275conditionalCreate(2, FormFlowComponent_Conditional_7_For_6_Conditional_2_Template, 4, 4, "div", 32);
    \u0275\u0275conditionalCreate(3, FormFlowComponent_Conditional_7_For_6_Conditional_3_Template, 4, 7, "div", 33);
    \u0275\u0275elementStart(4, "div", 34);
    \u0275\u0275repeaterCreate(5, FormFlowComponent_Conditional_7_For_6_For_6_Template, 18, 19, "div", 35, _forTrack02);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const step_r6 = ctx.$implicit;
    const \u0275$index_97_r23 = ctx.$index;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("is-active", ctx_r1.isPageActive(\u0275$index_97_r23))("is-missing", ctx_r1.isStepMissingRequired(step_r6))("form-flow__slide--plain", step_r6.chrome === "none")("form-flow__slide--media", step_r6.presentation === "media");
    \u0275\u0275attribute("data-step-id", step_r6.id)("aria-hidden", ctx_r1.isPageActive(\u0275$index_97_r23) ? null : "true")("inert", ctx_r1.isPageActive(\u0275$index_97_r23) ? null : "")("aria-labelledby", step_r6.title || step_r6.header ? "form-flow-step-" + step_r6.id : null);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.isGroupedLayout() && step_r6.chrome !== "none" && (step_r6.title || step_r6.icon) ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(step_r6.header ? 3 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(step_r6.controls);
  }
}
function FormFlowComponent_Conditional_7_Conditional_7_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.model.summary == null ? null : ctx_r1.model.summary.subtitle);
  }
}
function FormFlowComponent_Conditional_7_Conditional_7_For_11_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const step_r24 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(step_r24.icon);
  }
}
function FormFlowComponent_Conditional_7_Conditional_7_For_11_Conditional_6_For_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "required"));
  }
}
function FormFlowComponent_Conditional_7_Conditional_7_For_11_Conditional_6_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "dt")(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, FormFlowComponent_Conditional_7_Conditional_7_For_11_Conditional_6_For_2_Conditional_4_Template, 3, 3, "small");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "dd");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const control_r25 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275classProp("is-empty", ctx_r1.isSummaryValueEmpty(control_r25));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.summaryLabel(control_r25));
    \u0275\u0275advance();
    \u0275\u0275conditional(control_r25.required ? 4 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.summaryValue(control_r25));
  }
}
function FormFlowComponent_Conditional_7_Conditional_7_For_11_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dl");
    \u0275\u0275repeaterCreate(1, FormFlowComponent_Conditional_7_Conditional_7_For_11_Conditional_6_For_2_Template, 7, 5, "div", 74, _forTrack02);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const controls_r26 = \u0275\u0275readContextLet(5);
    \u0275\u0275advance();
    \u0275\u0275repeater(controls_r26);
  }
}
function FormFlowComponent_Conditional_7_Conditional_7_For_11_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 73);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.summaryEmptyLabel());
  }
}
function FormFlowComponent_Conditional_7_Conditional_7_For_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 72)(1, "header");
    \u0275\u0275conditionalCreate(2, FormFlowComponent_Conditional_7_Conditional_7_For_11_Conditional_2_Template, 2, 1, "mat-icon");
    \u0275\u0275elementStart(3, "h4");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275declareLet(5);
    \u0275\u0275conditionalCreate(6, FormFlowComponent_Conditional_7_Conditional_7_For_11_Conditional_6_Template, 3, 0, "dl")(7, FormFlowComponent_Conditional_7_Conditional_7_For_11_Conditional_7_Template, 2, 1, "p", 73);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const step_r24 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("is-missing", ctx_r1.isStepMissingRequired(step_r24));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(step_r24.icon ? 2 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(step_r24.title);
    \u0275\u0275advance();
    const controls_r27 = \u0275\u0275storeLet(ctx_r1.summaryControls(step_r24));
    \u0275\u0275advance();
    \u0275\u0275conditional(controls_r27.length > 0 ? 6 : 7);
  }
}
function FormFlowComponent_Conditional_7_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 68)(1, "div", 31)(2, "div", 69)(3, "mat-icon");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div")(6, "h3");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(8, FormFlowComponent_Conditional_7_Conditional_7_Conditional_8_Template, 2, 1, "p");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 70);
    \u0275\u0275repeaterCreate(10, FormFlowComponent_Conditional_7_Conditional_7_For_11_Template, 8, 6, "article", 71, _forTrack02);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("is-active", ctx_r1.isSummaryPage())("is-missing", ctx_r1.totalMissingRequiredCount() > 0);
    \u0275\u0275attribute("aria-hidden", ctx_r1.isSummaryPage() ? null : "true")("inert", ctx_r1.isSummaryPage() ? null : "")("aria-label", ctx_r1.summaryTitle());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate((ctx_r1.model.summary == null ? null : ctx_r1.model.summary.icon) || "fact_check");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.summaryTitle());
    \u0275\u0275advance();
    \u0275\u0275conditional((ctx_r1.model.summary == null ? null : ctx_r1.model.summary.subtitle) ? 8 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.pages());
  }
}
function FormFlowComponent_Conditional_7_Conditional_8_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 75);
    \u0275\u0275elementContainer(1, 20);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext(3);
    const progressControls_r4 = \u0275\u0275reference(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", progressControls_r4);
  }
}
function FormFlowComponent_Conditional_7_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, FormFlowComponent_Conditional_7_Conditional_8_Conditional_0_Template, 2, 1, "div", 75);
    \u0275\u0275elementContainer(1, 20);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    const stepNavControls_r28 = \u0275\u0275reference(4);
    \u0275\u0275conditional(ctx_r1.activeStepHasCardHeader() ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", stepNavControls_r28);
  }
}
function FormFlowComponent_Conditional_7_Conditional_9_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r29 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 16);
    \u0275\u0275listener("click", function FormFlowComponent_Conditional_7_Conditional_9_Conditional_1_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r29);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.goPrevious($event));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "chevron_left");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("disabled", ctx_r1.isDisabled() || ctx_r1.visiblePageIndex() <= 0);
  }
}
function FormFlowComponent_Conditional_7_Conditional_9_For_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r30 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 81);
    \u0275\u0275listener("click", function FormFlowComponent_Conditional_7_Conditional_9_For_4_Template_button_click_0_listener($event) {
      const \u0275$index_342_r31 = \u0275\u0275restoreView(_r30).$index;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.goToPage(\u0275$index_342_r31, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const step_r32 = ctx.$implicit;
    const \u0275$index_342_r31 = ctx.$index;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("is-active", ctx_r1.isPageActive(\u0275$index_342_r31))("is-missing", ctx_r1.isStepMissingRequired(step_r32));
    \u0275\u0275property("disabled", ctx_r1.isDisabled() || ctx_r1.isForwardNavigationBlocked(\u0275$index_342_r31));
    \u0275\u0275attribute("aria-current", ctx_r1.isPageActive(\u0275$index_342_r31) ? "step" : null)("aria-label", step_r32.title);
  }
}
function FormFlowComponent_Conditional_7_Conditional_9_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r33 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 81);
    \u0275\u0275listener("click", function FormFlowComponent_Conditional_7_Conditional_9_Conditional_5_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r33);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.goToPage(ctx_r1.pages().length, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("is-active", ctx_r1.isSummaryPage())("is-missing", ctx_r1.totalMissingRequiredCount() > 0);
    \u0275\u0275property("disabled", ctx_r1.isDisabled() || ctx_r1.isForwardNavigationBlocked(ctx_r1.pages().length));
    \u0275\u0275attribute("aria-current", ctx_r1.isSummaryPage() ? "step" : null)("aria-label", ctx_r1.summaryTitle());
  }
}
function FormFlowComponent_Conditional_7_Conditional_9_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r34 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 17);
    \u0275\u0275listener("click", function FormFlowComponent_Conditional_7_Conditional_9_Conditional_6_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r34);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.goNext($event));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "chevron_right");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("is-blocked", ctx_r1.nextStepBlocked());
    \u0275\u0275property("disabled", ctx_r1.isDisabled() || ctx_r1.visiblePageIndex() >= ctx_r1.totalPageCount() - 1 || ctx_r1.nextStepBlocked());
    \u0275\u0275attribute("aria-label", ctx_r1.nextStepBlocked() ? "Complete required fields before continuing" : "Next step")("title", ctx_r1.nextStepBlocked() ? ctx_r1.currentMissingRequiredCount() + " required field missing" : "Next step");
  }
}
function FormFlowComponent_Conditional_7_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "footer", 76);
    \u0275\u0275conditionalCreate(1, FormFlowComponent_Conditional_7_Conditional_9_Conditional_1_Template, 3, 1, "button", 77);
    \u0275\u0275elementStart(2, "div", 78);
    \u0275\u0275repeaterCreate(3, FormFlowComponent_Conditional_7_Conditional_9_For_4_Template, 1, 7, "button", 79, _forTrack02);
    \u0275\u0275conditionalCreate(5, FormFlowComponent_Conditional_7_Conditional_9_Conditional_5_Template, 1, 7, "button", 79);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, FormFlowComponent_Conditional_7_Conditional_9_Conditional_6_Template, 3, 5, "button", 80);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("form-flow__footer--carousel", ctx_r1.isCarouselLayout());
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r1.isCarouselLayout() ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.pages());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.hasSummaryPage() ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r1.isCarouselLayout() ? 6 : -1);
  }
}
function FormFlowComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 22);
    \u0275\u0275conditionalCreate(1, FormFlowComponent_Conditional_7_Conditional_1_Template, 9, 8, "div", 23);
    \u0275\u0275elementStart(2, "main", 24, 2);
    \u0275\u0275listener("scroll", function FormFlowComponent_Conditional_7_Template_main_scroll_2_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onFlowViewportScroll());
    })("touchstart", function FormFlowComponent_Conditional_7_Template_main_touchstart_2_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onFlowViewportTouchStart($event));
    })("touchmove", function FormFlowComponent_Conditional_7_Template_main_touchmove_2_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onFlowViewportTouchMove($event));
    })("touchend", function FormFlowComponent_Conditional_7_Template_main_touchend_2_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onFlowViewportTouchEnd());
    })("touchcancel", function FormFlowComponent_Conditional_7_Template_main_touchcancel_2_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onFlowViewportTouchEnd());
    })("wheel", function FormFlowComponent_Conditional_7_Template_main_wheel_2_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onFlowViewportWheel($event));
    });
    \u0275\u0275elementStart(4, "div", 25);
    \u0275\u0275repeaterCreate(5, FormFlowComponent_Conditional_7_For_6_Template, 7, 14, "section", 26, _forTrack02);
    \u0275\u0275conditionalCreate(7, FormFlowComponent_Conditional_7_Conditional_7_Template, 12, 10, "section", 27);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(8, FormFlowComponent_Conditional_7_Conditional_8_Template, 2, 2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(9, FormFlowComponent_Conditional_7_Conditional_9_Template, 7, 5, "footer", 28);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("form-flow__stage--carousel", ctx_r1.isCarouselLayout())("form-flow__stage--grouped", ctx_r1.isGroupedLayout())("form-flow__stage--compact-head", ctx_r1.isCarouselLayout() && !ctx_r1.activeStepHasCardHeader());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isCarouselLayout() && !ctx_r1.activeStepHasCardHeader() ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275classProp("form-flow__body--mobile", ctx_r1.isMobileViewport && !ctx_r1.isGroupedLayout())("is-swipe-blocked", ctx_r1.allHorizontalSwipeBlocked());
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("transform", ctx_r1.pageTrackTransform());
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.pages());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.hasSummaryPage() ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isCarouselLayout() ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r1.isGroupedLayout() ? 9 : -1);
  }
}
function FormFlowComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 6)(1, "mat-icon");
    \u0275\u0275text(2, "dynamic_form");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3");
    \u0275\u0275text(4, "No form available");
    \u0275\u0275elementEnd()();
  }
}
var FormFlowComponent = class _FormFlowComponent {
  static MOBILE_BREAKPOINT_PX = 720;
  static HORIZONTAL_SWIPE_THRESHOLD_PX = 8;
  flowViewportRef;
  cdr = inject(ChangeDetectorRef);
  model = null;
  loading = false;
  saving = false;
  disabled = false;
  save = new EventEmitter();
  action = new EventEmitter();
  percent = new EventEmitter();
  pageIndex = 0;
  isMobileViewport = this.readViewportWidth() <= _FormFlowComponent.MOBILE_BREAKPOINT_PX;
  pendingPageIndex = null;
  controlDisabled = false;
  formValue = {};
  emptyStringArray = [];
  stringArrayValueCache = /* @__PURE__ */ new WeakMap();
  csvStringArrayValueCache = /* @__PURE__ */ new Map();
  menuTriggerCache = /* @__PURE__ */ new WeakMap();
  onControlChange = () => void 0;
  onControlTouched = () => void 0;
  viewportScrollLockTargetIndex = null;
  viewportScrollLockTimer = null;
  touchStartX = null;
  touchStartY = null;
  lastEmittedPercent = null;
  pendingPercent = null;
  percentEmitQueued = false;
  pushScheduler = new UiTaskScheduler({
    intervalMs: () => this.resolvedPushIntervalMs(),
    state: () => this.currentPushState(),
    task: ({ state, signal }) => this.runPushTask(state, signal)
  });
  ngOnChanges(changes) {
    if (changes["model"]) {
      this.pageIndex = this.clampPageIndex(this.pageIndex);
      this.pendingPageIndex = null;
      this.queueViewportSync("auto");
      this.queuePercentEmit();
      this.pushScheduler.restart();
    }
  }
  ngOnDestroy() {
    this.pushScheduler.destroy();
    this.clearViewportScrollLock();
  }
  onViewportResize() {
    const wasMobile = this.isMobileViewport;
    this.isMobileViewport = this.readViewportWidth() <= _FormFlowComponent.MOBILE_BREAKPOINT_PX;
    if (wasMobile !== this.isMobileViewport) {
      this.clearViewportScrollLock();
      this.resetViewportScroll();
    }
    this.queueViewportSync("auto");
    this.cdr.markForCheck();
  }
  writeValue(value) {
    this.formValue = value ?? {};
    this.pageIndex = this.clampPageIndex(this.pageIndex);
    this.queueViewportSync("auto");
    this.queuePercentEmit();
    this.cdr.markForCheck();
  }
  registerOnChange(fn) {
    this.onControlChange = fn;
  }
  registerOnTouched(fn) {
    this.onControlTouched = fn;
  }
  setDisabledState(isDisabled) {
    this.controlDisabled = isDisabled;
    this.cdr.markForCheck();
  }
  isDisabled() {
    return this.disabled || this.controlDisabled;
  }
  pages() {
    return this.model?.steps ?? [];
  }
  hasSummaryPage() {
    if (this.isGroupedLayout()) {
      return false;
    }
    const model = this.model;
    if (!model || model.steps.length === 0) {
      return false;
    }
    return model.summary?.enabled !== false;
  }
  isCarouselLayout() {
    return this.model?.layout === "carousel";
  }
  isGroupedLayout() {
    return this.model?.layout === "grouped";
  }
  toneClass() {
    return `form-flow--tone-${this.modelTone()}`;
  }
  modelTone() {
    return this.model?.tone ?? "default";
  }
  totalPageCount() {
    if (this.isGroupedLayout()) {
      return this.pages().length > 0 ? 1 : 0;
    }
    return this.pages().length + (this.hasSummaryPage() ? 1 : 0);
  }
  isSummaryPage() {
    return this.hasSummaryPage() && this.visiblePageIndex() >= this.pages().length;
  }
  activeStep() {
    if (this.isGroupedLayout()) {
      return null;
    }
    if (this.isSummaryPage()) {
      return null;
    }
    return this.pages()[this.visiblePageIndex()] ?? null;
  }
  activeTitle() {
    if (this.isGroupedLayout()) {
      return this.model?.title ?? "";
    }
    if (this.isSummaryPage()) {
      return this.model?.summary?.title?.trim() || "Overview";
    }
    return this.activeStep()?.title ?? this.model?.title ?? "";
  }
  activeSubtitle() {
    if (this.isGroupedLayout()) {
      return this.model?.subtitle?.trim() || "";
    }
    if (this.isSummaryPage()) {
      return this.model?.summary?.subtitle?.trim() || "";
    }
    return this.activeStep()?.subtitle?.trim() || this.model?.subtitle?.trim() || "";
  }
  activeStepIcon() {
    if (this.isSummaryPage()) {
      return this.model?.summary?.icon?.trim() || "fact_check";
    }
    return this.activeStep()?.icon?.trim() || "dynamic_form";
  }
  activeStepHasCardHeader() {
    const header = this.activeStep()?.header ?? null;
    return !!(header?.imageCard || header?.infoCard);
  }
  pageCounterLabel() {
    const total = this.totalPageCount();
    return total > 0 ? `${this.visiblePageIndex() + 1} / ${total}` : "0 / 0";
  }
  progressPercent() {
    const total = this.totalPageCount();
    if (total <= 1) {
      return 100;
    }
    return Math.round((this.visiblePageIndex() + 1) / total * 100);
  }
  showSaveAction() {
    if (!this.model?.save) {
      return false;
    }
    if (this.isGroupedLayout()) {
      return this.totalPageCount() > 0;
    }
    return this.totalPageCount() > 0 && this.visiblePageIndex() === this.totalPageCount() - 1;
  }
  saveLabel() {
    return this.model?.save?.label?.trim() || "Save";
  }
  saveIcon() {
    return this.model?.save?.icon?.trim() || "check";
  }
  saveAriaLabel() {
    return this.model?.save?.ariaLabel?.trim() || this.saveLabel();
  }
  canSave() {
    return !this.isDisabled() && !this.saving && this.model?.save?.disabled !== true && this.showSaveAction() && this.totalMissingRequiredCount() === 0;
  }
  goToPage(index, sourceEvent) {
    sourceEvent?.stopPropagation();
    if (this.isGroupedLayout()) {
      return;
    }
    const nextIndex = this.clampPageIndex(index);
    if (this.isForwardNavigationBlocked(nextIndex) || nextIndex === this.visiblePageIndex()) {
      return;
    }
    if (this.isCarouselLayout()) {
      this.queueViewportSync("smooth", nextIndex);
      return;
    }
    this.setPageIndex(nextIndex);
  }
  goPrevious(sourceEvent) {
    this.goToPage(this.pageIndex - 1, sourceEvent);
  }
  goNext(sourceEvent) {
    this.goToPage(this.visiblePageIndex() + 1, sourceEvent);
  }
  emitSave(sourceEvent) {
    sourceEvent?.stopPropagation();
    if (!this.canSave()) {
      return;
    }
    this.onControlTouched();
    this.save.emit({
      value: this.formValue,
      stepId: this.activeStep()?.id ?? "summary",
      stepIndex: this.visiblePageIndex(),
      sourceEvent
    });
  }
  controlValue(control) {
    const value = this.readPath(this.formValue, control.bind);
    return control.valueFormat === "csv" ? this.csvStringArrayValue(value) : value;
  }
  controlTextValue(control) {
    const value = this.controlValue(control);
    return typeof value === "string" ? value : `${value ?? ""}`;
  }
  controlNumberValue(control) {
    const value = this.controlValue(control);
    if (value === null || value === void 0 || typeof value === "string" && value.trim().length === 0) {
      return null;
    }
    const numberValue = typeof value === "number" ? value : Number(value);
    return Number.isFinite(numberValue) ? numberValue : null;
  }
  controlBooleanValue(control) {
    return this.controlValue(control) === true;
  }
  controlValidationError(control) {
    const validationError = control.validationError;
    const resolved = typeof validationError === "function" ? validationError(this.controlValue(control), this.formValue) : validationError;
    return `${resolved ?? ""}`.trim();
  }
  controlStringArrayValue(control) {
    const value = this.controlValue(control);
    if (!Array.isArray(value)) {
      return this.emptyStringArray;
    }
    if (value.every((item) => typeof item === "string")) {
      return value;
    }
    const cached = this.stringArrayValueCache.get(value);
    if (cached) {
      return cached;
    }
    const normalized = value.map((item) => `${item ?? ""}`).filter((item) => item.trim().length > 0);
    this.stringArrayValueCache.set(value, normalized);
    return normalized;
  }
  updateControlValue(control, value) {
    if (this.isControlDisabled(control)) {
      return;
    }
    const formattedValue = control.valueFormat === "csv" ? this.csvStringValue(value) : value;
    const nextValue = control.kind === "number" ? this.normalizeNumberControlValue(formattedValue) : formattedValue;
    this.formValue = this.writePath(this.formValue, control.bind, nextValue);
    this.onControlChange(this.formValue);
    this.onControlTouched();
    this.queuePercentEmit();
    this.cdr.markForCheck();
  }
  normalizeNumberControlValue(value) {
    if (value === null || value === void 0 || typeof value === "string" && value.trim().length === 0) {
      return "";
    }
    const numberValue = typeof value === "number" ? value : Number(value);
    return Number.isFinite(numberValue) ? numberValue : value;
  }
  updateDateControlValue(control, value) {
    this.updateControlValue(control, value);
  }
  isControlDisabled(control) {
    return this.isDisabled() || control.disabled === true;
  }
  inputType(control) {
    return control.kind === "date" ? "date" : control.kind === "number" ? "number" : "text";
  }
  menuConfig(control) {
    return this.isMenuControlConfig(control.config) ? control.config : {};
  }
  menuKind(control) {
    return this.menuConfig(control).kind ?? "inline";
  }
  menuLayout(control) {
    return this.menuConfig(control).layout ?? "row";
  }
  menuPanelMode(control) {
    return this.menuConfig(control).panelMode ?? "auto";
  }
  menuTitle(control) {
    return this.menuConfig(control).title ?? null;
  }
  menuFilterable(control) {
    return this.menuConfig(control).filterable === true;
  }
  menuCloseOnSelect(control) {
    return this.menuConfig(control).closeOnSelect !== false;
  }
  menuTrigger(control) {
    return this.menuTriggerForControl(control, this.menuConfig(control).trigger ?? null);
  }
  menuModel(control) {
    return this.menuConfig(control).model ?? null;
  }
  menuItems(control) {
    return this.menuConfig(control).items ?? [];
  }
  accessoryMenuConfig(control) {
    return this.isMenuControlConfig(control.accessory?.menu) ? control.accessory.menu : null;
  }
  accessoryMenuKind(control) {
    return this.accessoryMenuConfig(control)?.kind ?? "inline";
  }
  accessoryMenuLayout(control) {
    return this.accessoryMenuConfig(control)?.layout ?? "row";
  }
  accessoryMenuPanelMode(control) {
    return this.accessoryMenuConfig(control)?.panelMode ?? "auto";
  }
  accessoryMenuTitle(control) {
    return this.accessoryMenuConfig(control)?.title ?? null;
  }
  accessoryMenuTrigger(control) {
    return this.accessoryMenuConfig(control)?.trigger ?? null;
  }
  accessoryMenuModel(control) {
    return this.accessoryMenuConfig(control)?.model ?? null;
  }
  accessoryMenuItems(control) {
    return this.accessoryMenuConfig(control)?.items ?? [];
  }
  accessoryMenuCloseOnSelect(control) {
    return this.accessoryMenuConfig(control)?.closeOnSelect !== false;
  }
  emitControlAction(control, selectEvent) {
    this.action.emit({
      control,
      value: this.controlValue(control),
      context: selectEvent.context,
      sourceEvent: selectEvent
    });
  }
  queuePercentEmit() {
    const nextPercent = formFlowCompletionPercent(this.model, this.formValue);
    if (nextPercent === this.lastEmittedPercent && this.pendingPercent === null) {
      return;
    }
    this.pendingPercent = nextPercent;
    if (this.percentEmitQueued) {
      return;
    }
    this.percentEmitQueued = true;
    queueMicrotask(() => {
      this.percentEmitQueued = false;
      const percent = this.pendingPercent;
      this.pendingPercent = null;
      if (percent === null || percent === this.lastEmittedPercent) {
        return;
      }
      this.lastEmittedPercent = percent;
      this.percent.emit(percent);
    });
  }
  imageConfig(control) {
    return this.isImageCarouselControlConfig(control.config) ? control.config : {};
  }
  dateConfig(control) {
    return this.isDateControlConfig(control.config) ? control.config : {};
  }
  dateControlValue(control) {
    const value = this.controlValue(control);
    return typeof value === "string" || this.isDateRangeValue(value) ? value : null;
  }
  dateInputModel(control) {
    const config = this.dateConfig(control);
    const model = config.model ?? {};
    return __spreadProps(__spreadValues({}, model), {
      mode: model.mode ?? "single",
      precision: model.precision ?? "date",
      valueFormat: model.valueFormat ?? "iso-date",
      field: __spreadProps(__spreadValues({}, model.field ?? {}), {
        label: model.field?.label ?? control.label ?? "",
        placeholder: model.field?.placeholder ?? control.placeholder ?? "dd/mm/yyyy",
        required: model.field?.required ?? control.required === true
      }),
      meta: model.meta ?? config.meta ?? null,
      disabled: this.isControlDisabled(control) || model.disabled === true
    });
  }
  locationConfig(control) {
    return this.isLocationControlConfig(control.config) ? control.config.model ?? {} : {};
  }
  linkConfig(control) {
    const model = this.isLinkControlConfig(control.config) ? control.config.model ?? {} : {};
    return __spreadProps(__spreadValues({}, model), {
      label: model.label ?? control.label ?? null,
      placeholder: model.placeholder ?? control.placeholder ?? null,
      required: model.required ?? control.required === true,
      maxLength: model.maxLength ?? control.maxLength ?? null
    });
  }
  pricingConfig(control) {
    return this.isPricingControlConfig(control.config) ? control.config.model ?? {} : {};
  }
  routeConfig(control) {
    return this.isRouteControlConfig(control.config) ? control.config.model ?? {} : {};
  }
  policiesConfig(control) {
    return this.isPoliciesControlConfig(control.config) ? control.config : {};
  }
  policiesInputConfig(control) {
    return this.policiesConfig(control).model ?? {};
  }
  policiesEnabled(control) {
    return control.enabledBind ? this.readPath(this.formValue, control.enabledBind) === true : true;
  }
  updatePoliciesEnabled(control, enabled) {
    if (this.isControlDisabled(control)) {
      return;
    }
    const enabledBind = control.enabledBind;
    if (!enabledBind) {
      return;
    }
    this.formValue = this.writePath(this.formValue, enabledBind, enabled === true);
    this.onControlChange(this.formValue);
    this.onControlTouched();
    this.queuePercentEmit();
    this.cdr.markForCheck();
  }
  summaryTitle() {
    return this.model?.summary?.title?.trim() || "Overview";
  }
  summaryEmptyLabel() {
    return this.model?.summary?.emptyLabel?.trim() || "Not set";
  }
  summaryControls(step) {
    return step.controls.filter((control) => {
      if (control.summary?.hidden === true || control.kind === "section") {
        return false;
      }
      if (this.model?.summary?.includeEmpty === true) {
        return true;
      }
      return this.summaryValue(control).length > 0;
    });
  }
  summaryLabel(control) {
    return control.summary?.label?.trim() || control.label?.trim() || control.id;
  }
  summaryValue(control) {
    const explicitValue = control.summary?.value?.(this.formValue, control);
    const value = explicitValue === void 0 ? this.controlValue(control) : explicitValue;
    const labels = control.kind === "menu" ? this.menuSelectionLabels(control, value) : [];
    if (labels.length > 0) {
      return labels.join(", ");
    }
    if (Array.isArray(value)) {
      const arrayLabel = value.map((item) => `${item ?? ""}`.trim()).filter(Boolean).join(", ");
      return arrayLabel || control.summary?.emptyLabel?.trim() || this.summaryEmptyLabel();
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    if (value === null || value === void 0 || typeof value === "string" && value.trim().length === 0) {
      return control.summary?.emptyLabel?.trim() || this.summaryEmptyLabel();
    }
    return `${value}`;
  }
  isSummaryValueEmpty(control) {
    const value = this.summaryValue(control);
    return value.length === 0 || value === this.summaryEmptyLabel() || value === control.summary?.emptyLabel;
  }
  visiblePageIndex() {
    return this.clampPageIndex(this.pendingPageIndex ?? this.pageIndex);
  }
  isPageActive(index) {
    if (this.isGroupedLayout()) {
      return true;
    }
    return this.visiblePageIndex() === index;
  }
  isStepMissingRequired(step) {
    return this.stepMissingRequiredCount(step) > 0;
  }
  currentPageMissingRequired() {
    if (this.isGroupedLayout()) {
      return this.totalMissingRequiredCount() > 0;
    }
    const step = this.activeStep();
    return step ? this.isStepMissingRequired(step) : this.totalMissingRequiredCount() > 0;
  }
  currentMissingRequiredCount() {
    if (this.isGroupedLayout()) {
      return this.totalMissingRequiredCount();
    }
    const step = this.activeStep();
    return step ? this.stepMissingRequiredCount(step) : this.totalMissingRequiredCount();
  }
  currentPageRequiredComplete() {
    if (this.isGroupedLayout()) {
      return this.totalRequiredControlCount() > 0 && this.totalMissingRequiredCount() === 0;
    }
    const step = this.activeStep();
    if (step) {
      return this.stepRequiredControlCount(step) > 0 && this.stepMissingRequiredCount(step) === 0;
    }
    return this.totalRequiredControlCount() > 0 && this.totalMissingRequiredCount() === 0;
  }
  isRequiredControlMissing(control) {
    return this.isControlMissingRequired(control);
  }
  totalMissingRequiredCount() {
    return this.pages().reduce((total, step) => total + this.stepMissingRequiredCount(step), 0);
  }
  nextStepBlocked() {
    if (this.isGroupedLayout()) {
      return false;
    }
    const currentIndex = this.visiblePageIndex();
    return currentIndex < this.totalPageCount() - 1 && this.isForwardNavigationBlocked(currentIndex + 1);
  }
  forwardSwipeBlocked() {
    return (this.isCarouselLayout() || this.isMobileViewport) && this.nextStepBlocked();
  }
  allHorizontalSwipeBlocked() {
    return this.forwardSwipeBlocked() && this.visiblePageIndex() <= 0;
  }
  pageTrackTransform() {
    if (this.isGroupedLayout()) {
      return null;
    }
    return this.isCarouselLayout() || this.isMobileViewport ? null : `translate3d(-${this.pageIndex * 100}%, 0, 0)`;
  }
  onFlowViewportScroll() {
    if (this.isGroupedLayout()) {
      return;
    }
    if (!this.isCarouselLayout() && !this.isMobileViewport) {
      return;
    }
    const viewport = this.flowViewportRef?.nativeElement;
    if (!viewport) {
      return;
    }
    if (this.viewportScrollLockTargetIndex !== null) {
      this.scheduleViewportScrollLockRelease();
      return;
    }
    const nextIndex = this.currentMobilePageIndex(viewport);
    if (nextIndex === this.pageIndex) {
      return;
    }
    this.pendingPageIndex = null;
    this.setPageIndex(nextIndex);
  }
  onFlowViewportTouchStart(event) {
    if (!this.forwardSwipeBlocked()) {
      this.clearTouchState();
      return;
    }
    const touch = event.touches.item(0);
    if (!touch) {
      this.clearTouchState();
      return;
    }
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
  }
  onFlowViewportTouchMove(event) {
    if (!this.forwardSwipeBlocked()) {
      this.clearTouchState();
      return;
    }
    const touch = event.touches.item(0);
    if (!touch || this.touchStartX === null || this.touchStartY === null) {
      return;
    }
    const deltaX = touch.clientX - this.touchStartX;
    const deltaY = touch.clientY - this.touchStartY;
    if (!this.isForwardTouchGesture(deltaX, deltaY)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
  }
  onFlowViewportTouchEnd() {
    this.clearTouchState();
  }
  onFlowViewportWheel(event) {
    if (!this.forwardSwipeBlocked() || !this.isForwardWheelGesture(event.deltaX, event.deltaY)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
  }
  trackByStepId(_index, step) {
    return step.id;
  }
  trackByControlId(_index, control) {
    return control.id;
  }
  clampPageIndex(index) {
    const total = this.totalPageCount();
    if (total <= 0) {
      return 0;
    }
    return Math.max(0, Math.min(total - 1, Math.trunc(index)));
  }
  setPageIndex(index) {
    const nextIndex = this.clampPageIndex(index);
    if (nextIndex === this.pageIndex && this.pendingPageIndex === null) {
      return;
    }
    this.pageIndex = nextIndex;
    this.pendingPageIndex = null;
    this.onControlTouched();
    this.cdr.markForCheck();
  }
  isForwardNavigationBlocked(targetIndex) {
    if (this.isGroupedLayout()) {
      return false;
    }
    return targetIndex > this.visiblePageIndex() && this.currentPageMissingRequired();
  }
  stepMissingRequiredCount(step) {
    return formFlowMissingRequiredControls({
      title: "",
      steps: [step]
    }, this.formValue).length;
  }
  stepRequiredControlCount(step) {
    return step.controls.filter((control) => control.required === true && this.normalizePath(control.bind).length > 0).length;
  }
  totalRequiredControlCount() {
    return this.pages().reduce((total, step) => total + this.stepRequiredControlCount(step), 0);
  }
  isControlMissingRequired(control) {
    return formFlowIsControlMissingRequired(control, this.formValue);
  }
  currentPushState() {
    return {
      value: this.formValue,
      stepId: this.activeStep()?.id ?? "summary",
      stepIndex: this.visiblePageIndex()
    };
  }
  async runPushTask(state, signal) {
    const push = this.model?.onPush;
    if (!push || this.resolvedPushIntervalMs() <= 0 || this.loading || this.saving || signal?.aborted) {
      return;
    }
    await push(__spreadProps(__spreadValues({}, state), { signal }));
  }
  resolvedPushIntervalMs() {
    return Math.max(0, Math.trunc(Number(this.model?.pushIntervalMs) || 0));
  }
  readPath(source, path) {
    const segments = this.normalizePath(path);
    if (segments.length === 0) {
      return source;
    }
    let current = source;
    for (const segment of segments) {
      if (current === null || current === void 0) {
        return void 0;
      }
      if (Array.isArray(current) && typeof segment === "number") {
        current = current[segment];
        continue;
      }
      if (this.isRecord(current)) {
        current = current[String(segment)];
        continue;
      }
      return void 0;
    }
    return current;
  }
  writePath(source, path, value) {
    const segments = this.normalizePath(path);
    if (segments.length === 0) {
      return value;
    }
    return this.writePathAt(source, segments, value, 0);
  }
  writePathAt(source, segments, value, index) {
    const segment = segments[index];
    const isLast = index === segments.length - 1;
    const clone = Array.isArray(source) ? [...source] : this.isRecord(source) ? __spreadValues({}, source) : typeof segment === "number" ? [] : {};
    if (isLast) {
      if (Array.isArray(clone) && typeof segment === "number") {
        clone[segment] = value;
      } else {
        clone[String(segment)] = value;
      }
      return clone;
    }
    const currentChild = Array.isArray(clone) && typeof segment === "number" ? clone[segment] : clone[String(segment)];
    const nextChild = this.writePathAt(currentChild, segments, value, index + 1);
    if (Array.isArray(clone) && typeof segment === "number") {
      clone[segment] = nextChild;
    } else {
      clone[String(segment)] = nextChild;
    }
    return clone;
  }
  normalizePath(path) {
    if (!path) {
      return [];
    }
    if (typeof path !== "string") {
      return path.map((segment) => typeof segment === "number" ? segment : `${segment}`.trim()).filter((segment) => segment !== "");
    }
    return path.replace(/\[(\d+)]/g, ".$1").split(".").map((segment) => segment.trim()).filter(Boolean).map((segment) => /^\d+$/.test(segment) ? Number(segment) : segment);
  }
  csvStringArrayValue(value) {
    if (Array.isArray(value)) {
      return value.map((item) => `${item ?? ""}`.trim()).filter(Boolean);
    }
    const textValue = `${value ?? ""}`;
    const cached = this.csvStringArrayValueCache.get(textValue);
    if (cached) {
      return cached;
    }
    const normalized = textValue.split(",").map((item) => item.trim()).filter(Boolean);
    this.csvStringArrayValueCache.set(textValue, normalized);
    return normalized;
  }
  csvStringValue(value) {
    return this.csvStringArrayValue(value).join(", ");
  }
  menuTriggerForControl(control, trigger) {
    if (!trigger || trigger.action === "custom") {
      return trigger;
    }
    const selectedItems = this.selectedMenuItems(control);
    const baseLabel = this.resolveMenuText(trigger.label);
    const selectedLabels = selectedItems.map((selected) => this.resolveMenuText(selected.item.label)).filter(Boolean);
    const selectedIcon = selectedItems.length === 1 ? this.resolveMenuText(selectedItems[0].item.icon) : "";
    const selectedPalette = selectedItems[0]?.item.palette ?? selectedItems[0]?.groupPalette ?? null;
    const baseLabelIsItemLabel = baseLabel ? this.menuItemLabels(control).has(this.normalizeMenuText(baseLabel)) : false;
    const signature = [
      this.controlValueSignature(this.controlValue(control)),
      baseLabel,
      selectedLabels.join("|"),
      selectedIcon,
      selectedPalette ?? "",
      baseLabelIsItemLabel ? "item-label" : "base-label"
    ].join("");
    const cached = this.menuTriggerCache.get(control);
    if (cached?.signature === signature) {
      return cached.trigger;
    }
    const nextTrigger = __spreadValues({}, trigger);
    if (selectedLabels.length > 0 && baseLabel) {
      nextTrigger.label = selectedLabels.join(", ");
    } else if (selectedLabels.length === 0 && baseLabelIsItemLabel) {
      nextTrigger.label = void 0;
    }
    if (selectedIcon) {
      nextTrigger.icon = selectedIcon;
    }
    if (selectedPalette) {
      nextTrigger.palette = selectedPalette;
    }
    this.menuTriggerCache.set(control, {
      signature,
      trigger: nextTrigger
    });
    return nextTrigger;
  }
  selectedMenuItems(control) {
    const value = this.controlValue(control);
    const valueKey = this.menuModel(control)?.valueKey ?? null;
    return this.flattenMenuItemsWithGroupPalette(control).filter((selected) => this.isMenuItemSelectedByValue(selected.item, value, valueKey));
  }
  menuItemLabels(control) {
    return new Set(this.flattenMenuItemsWithGroupPalette(control).map((selected) => this.normalizeMenuText(this.resolveMenuText(selected.item.label))).filter(Boolean));
  }
  flattenMenuItemsWithGroupPalette(control) {
    const config = this.menuConfig(control);
    const items = [];
    const visit = (item, groupPalette) => {
      items.push({ item, groupPalette });
      for (const child of item.items ?? []) {
        visit(child, groupPalette);
      }
      for (const group of item.model?.groups ?? []) {
        for (const child of group.items ?? []) {
          visit(child, group.palette);
        }
      }
      for (const group of item.model?.nodes ?? []) {
        for (const child of group.items ?? []) {
          visit(child, group.palette);
        }
      }
    };
    for (const item of config.items ?? []) {
      visit(item);
    }
    for (const group of config.model?.groups ?? []) {
      for (const item of group.items ?? []) {
        visit(item, group.palette);
      }
    }
    for (const group of config.model?.nodes ?? []) {
      for (const item of group.items ?? []) {
        visit(item, group.palette);
      }
    }
    return items.filter((selected) => {
      const kind = selected.item.kind ?? "action";
      return kind !== "divider" && kind !== "section";
    });
  }
  isMenuItemSelectedByValue(item, selectedValue, valueKey) {
    const itemValue = item.value !== void 0 ? item.value : item.id;
    if (Array.isArray(selectedValue)) {
      return selectedValue.some((value) => this.menuValuesEqual(value, itemValue, valueKey));
    }
    return this.menuValuesEqual(selectedValue, itemValue, valueKey);
  }
  menuValuesEqual(first, second, valueKey) {
    if (!valueKey) {
      return Object.is(first, second);
    }
    return Object.is(this.menuValueIdentity(first, valueKey), this.menuValueIdentity(second, valueKey));
  }
  menuValueIdentity(value, valueKey) {
    if (typeof valueKey === "function") {
      return valueKey(value);
    }
    if (value && typeof value === "object" && valueKey in value) {
      return value[valueKey];
    }
    return value;
  }
  resolveMenuText(value) {
    const resolved = typeof value === "function" ? value() : value;
    return `${resolved ?? ""}`.trim();
  }
  normalizeMenuText(value) {
    return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  controlValueSignature(value) {
    if (Array.isArray(value)) {
      return value.map((item) => this.controlValueSignature(item)).join("|");
    }
    if (value && typeof value === "object") {
      return JSON.stringify(value);
    }
    return `${value ?? ""}`;
  }
  menuSelectionLabels(control, value) {
    const selectedValues = Array.isArray(value) ? value.map((item) => `${item}`) : [`${value ?? ""}`];
    const selectedSet = new Set(selectedValues.filter((item) => item.trim().length > 0));
    if (selectedSet.size === 0) {
      return [];
    }
    return this.flattenMenuItems(control).filter((item) => {
      const itemValue = item.value === void 0 ? item.id : item.value;
      return selectedSet.has(`${itemValue}`);
    }).map((item) => this.resolveMenuLabel(item)).filter((label) => label.length > 0);
  }
  flattenMenuItems(control) {
    const config = this.menuConfig(control);
    const items = [...config.items ?? []];
    for (const group of config.model?.groups ?? []) {
      items.push(...group.items ?? []);
    }
    for (const group of config.model?.nodes ?? []) {
      items.push(...group.items ?? []);
    }
    const flattened = [];
    const visit = (item) => {
      flattened.push(item);
      for (const child of item.items ?? []) {
        visit(child);
      }
      for (const group of item.model?.groups ?? []) {
        for (const child of group.items ?? []) {
          visit(child);
        }
      }
      for (const group of item.model?.nodes ?? []) {
        for (const child of group.items ?? []) {
          visit(child);
        }
      }
    };
    for (const item of items) {
      visit(item);
    }
    return flattened;
  }
  resolveMenuLabel(item) {
    const label = item.label;
    if (typeof label === "function") {
      return `${label() ?? ""}`;
    }
    if (label && typeof label === "object" && "asReadonly" in label) {
      return "";
    }
    return `${label ?? item.id}`;
  }
  isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }
  isMenuControlConfig(config) {
    return this.isRecord(config) && ("model" in config || "items" in config || "trigger" in config || "filterable" in config);
  }
  isImageCarouselControlConfig(config) {
    return this.isRecord(config) && ("slotCount" in config || "previewMode" in config || "uploadOwnerId" in config);
  }
  isDateControlConfig(config) {
    return this.isRecord(config) && ("meta" in config || "model" in config);
  }
  isLocationControlConfig(config) {
    return this.isRecord(config) && this.isRecord(config["model"]);
  }
  isLinkControlConfig(config) {
    return this.isRecord(config) && this.isRecord(config["model"]);
  }
  isPricingControlConfig(config) {
    return this.isRecord(config) && this.isRecord(config["model"]);
  }
  isRouteControlConfig(config) {
    return this.isRecord(config) && this.isRecord(config["model"]);
  }
  isPoliciesControlConfig(config) {
    return this.isRecord(config) && this.isRecord(config["model"]);
  }
  isDateRangeValue(value) {
    return this.isRecord(value) && ("startAt" in value || "endAt" in value);
  }
  queueViewportSync(behavior, targetIndex = this.visiblePageIndex()) {
    if (this.isGroupedLayout()) {
      this.clearViewportScrollLock();
      this.resetViewportScroll();
      return;
    }
    if (!this.isCarouselLayout() && !this.isMobileViewport) {
      this.clearViewportScrollLock();
      this.resetViewportScroll();
      return;
    }
    const normalizedTargetIndex = this.clampPageIndex(targetIndex);
    if (behavior === "smooth" && normalizedTargetIndex !== this.pageIndex) {
      this.pendingPageIndex = normalizedTargetIndex;
      this.viewportScrollLockTargetIndex = normalizedTargetIndex;
      this.scheduleViewportScrollLockRelease();
    } else {
      this.pendingPageIndex = null;
      this.clearViewportScrollLock();
    }
    const sync = () => {
      const viewport = this.flowViewportRef?.nativeElement;
      if (!viewport) {
        return;
      }
      const targetLeft = this.mobilePageOffsetLeft(viewport, normalizedTargetIndex);
      if (targetLeft < 0) {
        return;
      }
      const previousScrollBehavior = viewport.style.scrollBehavior;
      viewport.style.scrollBehavior = behavior;
      viewport.scrollLeft = targetLeft;
      const restore = () => {
        viewport.style.scrollBehavior = previousScrollBehavior;
      };
      if (typeof globalThis.requestAnimationFrame === "function") {
        globalThis.requestAnimationFrame(() => restore());
      } else {
        setTimeout(restore, 0);
      }
    };
    if (typeof globalThis.requestAnimationFrame === "function") {
      globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(sync));
      return;
    }
    setTimeout(sync, 0);
  }
  scheduleViewportScrollLockRelease() {
    if (this.viewportScrollLockTimer) {
      clearTimeout(this.viewportScrollLockTimer);
    }
    this.viewportScrollLockTimer = setTimeout(() => {
      this.viewportScrollLockTimer = null;
      const viewport = this.flowViewportRef?.nativeElement;
      const finalIndex = viewport ? this.currentMobilePageIndex(viewport) : this.viewportScrollLockTargetIndex;
      this.viewportScrollLockTargetIndex = null;
      if (finalIndex === null) {
        this.pendingPageIndex = null;
        this.cdr.markForCheck();
        return;
      }
      this.setPageIndex(finalIndex);
    }, 96);
  }
  clearViewportScrollLock() {
    if (this.viewportScrollLockTimer) {
      clearTimeout(this.viewportScrollLockTimer);
      this.viewportScrollLockTimer = null;
    }
    this.viewportScrollLockTargetIndex = null;
    this.pendingPageIndex = null;
  }
  clearTouchState() {
    this.touchStartX = null;
    this.touchStartY = null;
  }
  isHorizontalGesture(deltaX, deltaY) {
    const absoluteX = Math.abs(deltaX);
    return absoluteX > _FormFlowComponent.HORIZONTAL_SWIPE_THRESHOLD_PX && absoluteX > Math.abs(deltaY);
  }
  isForwardTouchGesture(deltaX, deltaY) {
    return deltaX < 0 && this.isHorizontalGesture(deltaX, deltaY);
  }
  isForwardWheelGesture(deltaX, deltaY) {
    return deltaX > 0 && this.isHorizontalGesture(deltaX, deltaY);
  }
  resetViewportScroll() {
    const viewport = this.flowViewportRef?.nativeElement;
    if (viewport) {
      viewport.scrollLeft = 0;
    }
  }
  currentMobilePageIndex(viewport) {
    const slides = Array.from(viewport.querySelectorAll(".form-flow__slide"));
    if (slides.length === 0) {
      return 0;
    }
    const currentLeft = viewport.scrollLeft;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    slides.forEach((slide, index) => {
      const distance = Math.abs(slide.offsetLeft - currentLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    return Math.max(0, Math.min(closestIndex, this.totalPageCount() - 1));
  }
  mobilePageOffsetLeft(viewport, index) {
    const slides = Array.from(viewport.querySelectorAll(".form-flow__slide"));
    return slides[index]?.offsetLeft ?? -1;
  }
  readViewportWidth() {
    return typeof globalThis.window === "undefined" ? 1024 : globalThis.window.innerWidth;
  }
  static \u0275fac = function FormFlowComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FormFlowComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FormFlowComponent, selectors: [["app-form-flow"]], viewQuery: function FormFlowComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.flowViewportRef = _t.first);
    }
  }, hostBindings: function FormFlowComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("resize", function FormFlowComponent_resize_HostBindingHandler() {
        return ctx.onViewportResize();
      }, \u0275\u0275resolveWindow);
    }
  }, inputs: { model: "model", loading: "loading", saving: "saving", disabled: "disabled" }, outputs: { save: "save", action: "action", percent: "percent" }, features: [\u0275\u0275ProvidersFeature([
    FormFlowPopupStore,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => _FormFlowComponent),
      multi: true
    }
  ]), \u0275\u0275NgOnChangesFeature], decls: 9, vars: 12, consts: [["progressControls", ""], ["stepNavControls", ""], ["flowViewport", ""], [1, "form-flow", 3, "ngClass"], [1, "form-flow__header"], [1, "form-flow__loading"], [1, "form-flow__empty"], [1, "form-flow__progress"], ["type", "button", 1, "form-flow__save", 3, "is-missing", "is-saving", "disabled"], [1, "form-flow__counter", 3, "is-missing"], [1, "form-flow__progress-track"], ["type", "button", 1, "form-flow__save", 3, "click", "disabled"], ["aria-hidden", "true", 1, "form-flow__save-ring"], ["kind", "action-ring", "shape", "button", "state", "loading"], [1, "form-flow__counter"], ["aria-label", "Form step navigation", 1, "form-flow__slide-nav"], ["type", "button", "data-motion", "none", "aria-label", "Previous step", 1, "form-flow__nav", "form-flow__nav--prev", 3, "click", "disabled"], ["type", "button", "data-motion", "none", 1, "form-flow__nav", "form-flow__nav--next", 3, "click", "disabled"], [1, "form-flow__title-block"], [1, "form-flow__kicker"], [3, "ngTemplateOutlet"], ["kind", "load-ring", "state", "loading"], [1, "form-flow__stage"], [1, "form-flow__carousel-head"], [1, "form-flow__body", 3, "scroll", "touchstart", "touchmove", "touchend", "touchcancel", "wheel"], [1, "form-flow__track"], [1, "form-flow__slide", 3, "is-active", "is-missing", "form-flow__slide--plain", "form-flow__slide--media"], [1, "form-flow__slide", "form-flow__slide--summary", 3, "is-active", "is-missing"], [1, "form-flow__footer", 3, "form-flow__footer--carousel"], [1, "form-flow__step-badge"], [1, "form-flow__slide"], [1, "form-flow__slide-inner"], [1, "form-flow__group-header"], [1, "form-flow__step-header", 3, "form-flow__step-header--card", "form-flow__step-header--image-card", "form-flow__step-header--info-card"], [1, "form-flow__controls"], [1, "form-flow__control", 3, "form-flow__control--wide", "form-flow__control--half", "form-flow__control--with-accessory", "form-flow__control--image", "is-required-missing", "is-invalid", "--form-flow-control-row-span"], [3, "id"], [1, "form-flow__step-header"], [1, "form-flow__step-title-sr", 3, "id"], [1, "form-flow__step-image-card", 3, "card"], [1, "form-flow__step-info-card", 3, "card"], ["alt", "", 3, "src"], [1, "form-flow__control"], [1, "form-flow__section-title"], [1, "form-flow__checkbox"], [1, "form-flow__static"], [1, "form-flow__date-input", 3, "model", "ngModel"], [1, "form-flow__location-input", 3, "config", "readOnly", "ngModel"], [1, "form-flow__link-input", 3, "config", "readOnly", "ngModel"], [1, "form-flow__pricing-input", 3, "config", "readOnly", "ngModel"], [1, "form-flow__route-input", 3, "config", "readOnly", "ngModel"], [1, "form-flow__policies-input", 3, "config", "enabled", "readOnly", "ngModel"], [1, "form-flow__control-accessory", 3, "kind", "layout", "title", "trigger", "model", "items", "panelMode", "closeOnSelect"], ["role", "alert", 1, "form-flow__control-error"], [1, "form-flow__control-description"], [1, "form-flow__label"], [1, "form-flow__menu", 3, "ngModelChange", "itemSelect", "kind", "layout", "title", "filterable", "trigger", "model", "items", "panelMode", "ngModel", "closeOnSelect"], [3, "ngModelChange", "slotCount", "compact", "autoSize", "previewMode", "ariaLabel", "uploadOwnerId", "uploadEntityId", "disabled", "ngModel"], ["type", "checkbox", 3, "ngModelChange", "disabled", "ngModel"], [3, "ngModelChange", "rows", "placeholder", "disabled", "readOnly", "ngModel"], [1, "form-flow__date-input", 3, "ngModelChange", "model", "ngModel"], [1, "form-flow__location-input", 3, "ngModelChange", "config", "readOnly", "ngModel"], [1, "form-flow__link-input", 3, "ngModelChange", "config", "readOnly", "ngModel"], [1, "form-flow__pricing-input", 3, "ngModelChange", "config", "readOnly", "ngModel"], [1, "form-flow__route-input", 3, "ngModelChange", "config", "readOnly", "ngModel"], [1, "form-flow__policies-input", 3, "enabledChange", "ngModelChange", "config", "enabled", "readOnly", "ngModel"], [3, "ngModelChange", "type", "placeholder", "disabled", "readOnly", "ngModel"], [1, "form-flow__control-accessory", 3, "itemSelect", "kind", "layout", "title", "trigger", "model", "items", "panelMode", "closeOnSelect"], [1, "form-flow__slide", "form-flow__slide--summary"], [1, "form-flow__summary-head"], [1, "form-flow__summary-panels"], [1, "form-flow__summary-panel", 3, "is-missing"], [1, "form-flow__summary-panel"], [1, "form-flow__summary-empty"], [3, "is-empty"], [1, "form-flow__carousel-progress-slot"], [1, "form-flow__footer"], ["type", "button", "data-motion", "none", "aria-label", "Previous step", 1, "form-flow__nav", "form-flow__nav--prev", 3, "disabled"], ["aria-label", "Form steps", 1, "form-flow__dots"], ["type", "button", 3, "is-active", "is-missing", "disabled"], ["type", "button", "data-motion", "none", 1, "form-flow__nav", "form-flow__nav--next", 3, "is-blocked", "disabled"], ["type", "button", 3, "click", "disabled"]], template: function FormFlowComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 3);
      \u0275\u0275template(1, FormFlowComponent_ng_template_1_Template, 5, 6, "ng-template", null, 0, \u0275\u0275templateRefExtractor)(3, FormFlowComponent_ng_template_3_Template, 7, 6, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
      \u0275\u0275conditionalCreate(5, FormFlowComponent_Conditional_5_Template, 8, 4, "header", 4);
      \u0275\u0275conditionalCreate(6, FormFlowComponent_Conditional_6_Template, 4, 1, "article", 5)(7, FormFlowComponent_Conditional_7_Template, 10, 16)(8, FormFlowComponent_Conditional_8_Template, 5, 0, "article", 6);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275classProp("is-loading", ctx.loading)("form-flow--carousel", ctx.isCarouselLayout())("form-flow--grouped", ctx.isGroupedLayout())("form-flow--menu-overflow", (ctx.model == null ? null : ctx.model.allowMenuOverflow) === true);
      \u0275\u0275property("ngClass", ctx.toneClass());
      \u0275\u0275attribute("aria-busy", ctx.loading);
      \u0275\u0275advance(5);
      \u0275\u0275conditional(!ctx.isCarouselLayout() && (ctx.model == null ? null : ctx.model.header) !== false ? 5 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading ? 6 : ctx.model && ctx.totalPageCount() > 0 ? 7 : 8);
    }
  }, dependencies: [
    CommonModule,
    NgClass,
    NgTemplateOutlet,
    FormsModule,
    DefaultValueAccessor,
    CheckboxControlValueAccessor,
    NgControlStatus,
    NgModel,
    MatIconModule,
    MatIcon,
    AppMenuComponent,
    DateInputComponent,
    LinkInputComponent,
    LocationInputComponent,
    PoliciesInputComponent,
    PricingEditorInputComponent,
    RouteInputComponent,
    ImageCarouselComponent,
    IndicatorComponent,
    ImageCardComponent,
    InfoCardComponent,
    I18nPipe
  ], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n.form-flow[_ngcontent-%COMP%] {\n  --form-flow-base-bg: #f8fbff;\n  --form-flow-panel-bg: rgba(253, 254, 255, 0.92);\n  --form-flow-panel-border: rgba(21, 38, 62, 0.14);\n  --form-flow-primary-panel-bg:\n    linear-gradient(\n      180deg,\n      #f2f7ff 0%,\n      #e8f0fb 100%);\n  --form-flow-primary-panel-border: rgba(58, 108, 168, 0.28);\n  --form-flow-group-icon-color: #396da9;\n  position: relative;\n  display: grid;\n  grid-template-rows: auto minmax(0, 1fr) auto;\n  min-height: 100%;\n  background: var(--form-flow-base-bg);\n  color: #183456;\n  border: 1px solid #c6d9f1;\n  border-radius: 10px;\n  overflow: hidden;\n}\n.form-flow--tone-green[_ngcontent-%COMP%] {\n  --form-flow-base-bg:\n    linear-gradient(\n      180deg,\n      #f4faf2 0%,\n      #edf7eb 100%);\n  --form-flow-panel-bg:\n    linear-gradient(\n      180deg,\n      #f8fcf6 0%,\n      #eef8ed 100%);\n  --form-flow-panel-border: rgba(54, 129, 72, 0.22);\n  --form-flow-primary-panel-bg:\n    linear-gradient(\n      180deg,\n      #f1faf0 0%,\n      #e5f4e3 100%);\n  --form-flow-primary-panel-border: rgba(54, 129, 72, 0.3);\n  --form-flow-group-icon-color: #2f8546;\n}\n.form-flow--tone-blue[_ngcontent-%COMP%] {\n  --form-flow-base-bg:\n    linear-gradient(\n      180deg,\n      #f3f8ff 0%,\n      #ecf4ff 100%);\n  --form-flow-panel-bg:\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #eef5ff 100%);\n  --form-flow-panel-border: rgba(46, 111, 178, 0.22);\n  --form-flow-primary-panel-bg:\n    linear-gradient(\n      180deg,\n      #f2f7ff 0%,\n      #e8f0fb 100%);\n  --form-flow-primary-panel-border: rgba(58, 108, 168, 0.28);\n  --form-flow-group-icon-color: #396da9;\n}\n.form-flow--tone-orange[_ngcontent-%COMP%] {\n  --form-flow-base-bg:\n    linear-gradient(\n      180deg,\n      #fff5f2 0%,\n      #ffefea 100%);\n  --form-flow-panel-bg:\n    linear-gradient(\n      180deg,\n      #fffaf7 0%,\n      #fff0e9 100%);\n  --form-flow-panel-border: rgba(176, 86, 66, 0.24);\n  --form-flow-primary-panel-bg:\n    linear-gradient(\n      180deg,\n      #fff7f0 0%,\n      #ffecdf 100%);\n  --form-flow-primary-panel-border: rgba(176, 86, 66, 0.3);\n  --form-flow-group-icon-color: #b9712d;\n}\n.form-flow--carousel[_ngcontent-%COMP%] {\n  --form-flow-carousel-card-height: 270px;\n  grid-template-rows: minmax(0, 1fr) auto;\n  height: 100%;\n  min-height: 0;\n  border: 0;\n  border-radius: 0;\n  background: transparent;\n  overflow: visible;\n}\n.form-flow--grouped[_ngcontent-%COMP%] {\n  grid-template-rows: auto minmax(0, 1fr);\n  height: 100%;\n  min-height: 0;\n  border: 0;\n  border-radius: 0;\n  background: #ffffff;\n  overflow: hidden;\n}\n.form-flow__header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 16px;\n  padding: 18px 20px 14px;\n  border-bottom: 1px solid #d7e3f2;\n  background: #ffffff;\n}\n.form-flow__title-block[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.form-flow__title-block[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 2px 0 0;\n  font-size: 20px;\n  line-height: 1.15;\n  font-weight: 700;\n}\n.form-flow__title-block[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 6px 0 0;\n  color: #4b607c;\n  font-size: 13px;\n  line-height: 1.35;\n}\n.form-flow__kicker[_ngcontent-%COMP%] {\n  display: block;\n  color: #4b607c;\n  font-size: 11px;\n  font-weight: 700;\n  text-transform: uppercase;\n}\n.form-flow__progress[_ngcontent-%COMP%] {\n  display: grid;\n  justify-items: end;\n  gap: 8px;\n  min-width: 150px;\n}\n.form-flow__counter[_ngcontent-%COMP%] {\n  display: inline-flex;\n  width: 90px;\n  box-sizing: border-box;\n  justify-content: center;\n  padding: 5px 12px;\n  border-radius: 999px;\n  border: 1px solid #bfd4ee;\n  background: #f2f7ff;\n  color: #294e80;\n  font-size: 12px;\n  font-weight: 700;\n}\n.form-flow__counter.is-missing[_ngcontent-%COMP%] {\n  border-color: #ef9a9a;\n  background: #fff0f0;\n  color: #b42328;\n}\n.form-flow__save[_ngcontent-%COMP%] {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 7px;\n  min-height: 34px;\n  padding: 0 16px;\n  border: 0;\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      135deg,\n      #4f83d1,\n      #7556d8);\n  color: #ffffff;\n  font: inherit;\n  font-size: 12px;\n  font-weight: 700;\n  box-shadow: 0 12px 28px rgba(60, 93, 154, 0.22);\n  cursor: pointer;\n}\n.form-flow__save[_ngcontent-%COMP%]:disabled {\n  cursor: default;\n  opacity: 0.55;\n  box-shadow: none;\n}\n.form-flow__save.is-saving[_ngcontent-%COMP%], \n.form-flow__save.is-saving[_ngcontent-%COMP%]:disabled {\n  opacity: 1;\n  cursor: wait;\n  box-shadow: none;\n}\n.form-flow__save.is-missing[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #d84a4a,\n      #b42328);\n}\n.form-flow__save[_ngcontent-%COMP%]   .form-flow__save-ring[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: -1px;\n  z-index: 1;\n  border-radius: inherit;\n  pointer-events: none;\n}\n.form-flow__save[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 2;\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n}\n.form-flow__save[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:not(.form-flow__save-ring) {\n  position: relative;\n  z-index: 2;\n}\n.form-flow__progress-track[_ngcontent-%COMP%] {\n  width: 150px;\n  height: 7px;\n  border-radius: 999px;\n  background: #e2e9f1;\n  overflow: hidden;\n}\n.form-flow__progress-track[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: block;\n  height: 100%;\n  border-radius: inherit;\n  background:\n    linear-gradient(\n      90deg,\n      #2f8792,\n      #c28128);\n}\n.form-flow__progress-track.is-missing[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      90deg,\n      #d84a4a,\n      #f0a15f);\n}\n.form-flow__stage[_ngcontent-%COMP%] {\n  position: relative;\n  height: 100%;\n  min-height: 0;\n  overflow: visible;\n}\n.form-flow__stage--compact-head[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-rows: auto minmax(0, 1fr);\n}\n.form-flow__stage[_ngcontent-%COMP%]    > .form-flow__body[_ngcontent-%COMP%] {\n  height: 100%;\n  min-height: 0;\n}\n.form-flow__stage--compact-head[_ngcontent-%COMP%]    > .form-flow__body[_ngcontent-%COMP%] {\n  height: auto;\n}\n.form-flow__body[_ngcontent-%COMP%] {\n  position: relative;\n  min-height: 0;\n  overflow: hidden;\n  padding: 0;\n}\n.form-flow__body.is-swipe-blocked[_ngcontent-%COMP%] {\n  touch-action: pan-y;\n  overscroll-behavior-x: none;\n}\n.form-flow__track[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: nowrap;\n  width: 100%;\n  height: 100%;\n  min-height: 100%;\n  transition: transform 0.34s cubic-bezier(0.2, 0.72, 0.22, 1);\n  will-change: transform;\n  backface-visibility: hidden;\n}\n.form-flow--grouped[_ngcontent-%COMP%]   .form-flow__body[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  overflow-y: auto;\n  overflow-x: hidden;\n  padding: 14px 12px 20px;\n  scrollbar-width: thin;\n  scrollbar-color: #8aa0b8 #eaf1fa;\n  scrollbar-gutter: stable;\n}\n.form-flow--grouped.form-flow--menu-overflow[_ngcontent-%COMP%], \n.form-flow--grouped.form-flow--menu-overflow[_ngcontent-%COMP%]   .form-flow__body[_ngcontent-%COMP%] {\n  overflow: visible;\n}\n.form-flow--grouped[_ngcontent-%COMP%]   .form-flow__track[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 12px;\n  height: auto;\n  min-height: 0;\n  padding: 0;\n  transition: none;\n  will-change: auto;\n}\n.form-flow--grouped[_ngcontent-%COMP%]   .form-flow__slide[_ngcontent-%COMP%] {\n  min-width: 0;\n  min-height: 0;\n  overflow: visible;\n  contain: none;\n  border: 1px solid var(--form-flow-panel-border);\n  border-radius: 12px;\n  background: var(--form-flow-panel-bg);\n}\n.form-flow--grouped[_ngcontent-%COMP%]   .form-flow__slide--plain[_ngcontent-%COMP%] {\n  border: 0;\n  border-radius: 0;\n  background: transparent;\n}\n.form-flow--grouped[_ngcontent-%COMP%]   .form-flow__slide[data-step-id=basics][_ngcontent-%COMP%] {\n  border-color: var(--form-flow-primary-panel-border);\n  background: var(--form-flow-primary-panel-bg);\n}\n.form-flow--grouped[_ngcontent-%COMP%]   .form-flow__slide[data-step-id=lifestyle][_ngcontent-%COMP%] {\n  border-color: rgba(49, 124, 82, 0.28);\n  background:\n    linear-gradient(\n      180deg,\n      #eef8f3 0%,\n      #e4f2ea 100%);\n}\n.form-flow--grouped[_ngcontent-%COMP%]   .form-flow__slide-inner[_ngcontent-%COMP%] {\n  height: auto;\n  min-height: 0;\n  overflow: visible;\n  padding: 12px;\n}\n.form-flow--grouped[_ngcontent-%COMP%]   .form-flow__slide--plain[_ngcontent-%COMP%]    > .form-flow__slide-inner[_ngcontent-%COMP%] {\n  padding: 0;\n}\n.form-flow__group-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin: 0 0 10px;\n  padding: 0;\n  border-bottom: 0;\n  background: transparent;\n  color: #17395f;\n}\n.form-flow__group-header[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 19px;\n  height: 19px;\n  font-size: 19px;\n  line-height: 19px;\n  color: var(--form-flow-group-icon-color);\n}\n.form-flow__group-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 14px;\n  font-weight: 900;\n}\n.form-flow__slide[_ngcontent-%COMP%] {\n  flex: 0 0 100%;\n  min-width: 100%;\n  min-height: 0;\n  overflow: hidden;\n  contain: layout paint style;\n  backface-visibility: hidden;\n}\n.form-flow__slide-inner[_ngcontent-%COMP%] {\n  position: relative;\n  box-sizing: border-box;\n  height: 100%;\n  min-height: 100%;\n  overflow: auto;\n  padding: 16px;\n  scrollbar-width: thin;\n}\n.form-flow__carousel-progress-slot[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 18px;\n  right: 20px;\n  z-index: 6;\n}\n.form-flow__carousel-progress-slot[_ngcontent-%COMP%]   .form-flow__progress[_ngcontent-%COMP%] {\n  min-width: 150px;\n}\n.form-flow__carousel-head[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 7;\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 18px;\n  min-height: 50px;\n  padding: 8px 12px 7px;\n  background: #ffffff;\n}\n.form-flow__step-badge[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  max-width: min(360px, 60%);\n  min-height: 34px;\n  padding: 0 14px;\n  border: 1px solid #b8d1f0;\n  border-radius: 999px;\n  background: #eef6ff;\n  color: #244f83;\n  font-size: 12px;\n  font-weight: 800;\n  line-height: 1.25;\n  overflow: visible;\n}\n.form-flow__step-badge.is-missing[_ngcontent-%COMP%] {\n  border-color: #ff9b9b;\n  background: #fff1f1;\n  color: #c1262e;\n}\n.form-flow__step-badge.is-complete[_ngcontent-%COMP%] {\n  border-color: #8dcc9b;\n  background: #edf9f0;\n  color: #27733d;\n}\n.form-flow__step-badge[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n  flex: 0 0 auto;\n}\n.form-flow__step-badge[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: inline-block;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  line-height: 1.45;\n  padding-block: 2px;\n}\n.form-flow__slide.is-missing[_ngcontent-%COMP%]   .form-flow__step-header[_ngcontent-%COMP%] {\n  border-color: #ef9a9a;\n}\n.form-flow__step-header[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 280px) minmax(0, 1fr);\n  gap: 16px;\n  margin-bottom: 14px;\n  padding: 10px;\n  border: 1px solid #c7d8ef;\n  border-radius: 10px;\n  background: #eef6ff;\n}\n.form-flow__step-header[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  aspect-ratio: 16/7;\n  object-fit: cover;\n  border-radius: 8px;\n}\n.form-flow__step-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 15px;\n}\n.form-flow__step-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 6px 0 0;\n  color: #506885;\n  font-size: 13px;\n}\n.form-flow__step-title-sr[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}\n.form-flow__step-header--card[_ngcontent-%COMP%] {\n  display: block;\n  width: min(320px, 100%);\n  max-width: 100%;\n  padding: 0;\n  border: 0;\n  background: transparent;\n}\n.form-flow__step-header--image-card[_ngcontent-%COMP%] {\n  width: min(320px, 100%);\n}\n.form-flow__step-image-card[_ngcontent-%COMP%], \n.form-flow__step-info-card[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n}\n.form-flow__controls[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  grid-auto-rows: max-content;\n  align-content: start;\n  align-items: start;\n  gap: 12px;\n}\n.form-flow__control[_ngcontent-%COMP%] {\n  position: relative;\n  min-width: 0;\n}\n.form-flow__control[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.form-flow__control[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  width: 100%;\n  box-sizing: border-box;\n  border: 1px solid #b9cce5;\n  border-radius: 8px;\n  background: #ffffff;\n  color: #173357;\n  font: inherit;\n  font-size: 14px;\n  outline: none;\n}\n.form-flow__control[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.form-flow__control[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus {\n  border-color: #4f83d1;\n  box-shadow: 0 0 0 3px rgba(79, 131, 209, 0.14);\n}\n.form-flow__control[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:disabled, \n.form-flow__control[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:disabled {\n  background: #edf2f8;\n  color: #7b8da5;\n}\n.form-flow__control[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  height: var(--form-flow-input-height, 34px);\n  min-height: var(--form-flow-input-height, 34px);\n  padding: var(--form-flow-input-padding, 0 12px);\n  line-height: 1.2;\n}\n.form-flow__control[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  min-height: var(--form-flow-control-min-height, 42px);\n  padding: var(--form-flow-control-padding, 9px 12px);\n  line-height: 1.35;\n  resize: vertical;\n}\n.form-flow__control--with-accessory[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) 34px;\n  column-gap: 12px;\n  align-items: end;\n}\n.form-flow__control--with-accessory[_ngcontent-%COMP%]:has(.app-menu-host--open) {\n  z-index: 20;\n}\n.form-flow__control-accessory[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 2;\n  align-self: end;\n  justify-self: end;\n}\n.form-flow__control-accessory[_ngcontent-%COMP%]:has(.app-menu-host--open) {\n  z-index: 60;\n}\n.form-flow__control--with-accessory[_ngcontent-%COMP%]    > .form-flow__label[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.form-flow__control--with-accessory[_ngcontent-%COMP%]    > [_ngcontent-%COMP%]:not(.form-flow__label):not(.form-flow__control-accessory) {\n  grid-column: 1;\n  min-width: 0;\n}\n.form-flow__control--with-accessory[_ngcontent-%COMP%]    > .form-flow__control-accessory[_ngcontent-%COMP%] {\n  grid-column: 2;\n  grid-row: 2;\n}\n.form-flow__control-description[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 0.28rem;\n  color: #506885;\n  font-size: 0.76rem;\n  font-weight: 700;\n  line-height: 1.35;\n}\n.form-flow__control-error[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 0.28rem;\n  color: #9b3447;\n  font-size: 0.76rem;\n  font-weight: 800;\n  line-height: 1.35;\n}\n.form-flow__control--with-accessory[_ngcontent-%COMP%]    > .form-flow__control-description[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.form-flow__control--with-accessory[_ngcontent-%COMP%]    > .form-flow__control-error[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.form-flow__checkbox[_ngcontent-%COMP%] {\n  min-height: var(--form-flow-input-height, 34px);\n  display: inline-flex;\n  align-items: center;\n  gap: 0.58rem;\n  color: #233e61;\n  font-size: 0.8rem;\n  font-weight: 700;\n  cursor: pointer;\n}\n.form-flow__checkbox[_ngcontent-%COMP%]   input[type=checkbox][_ngcontent-%COMP%] {\n  flex: 0 0 17px;\n  width: 17px;\n  height: 17px;\n  min-height: 17px;\n  margin: 0;\n  padding: 0;\n  border: 0;\n  border-radius: 3px;\n  accent-color: #3477d4;\n  box-shadow: none;\n  cursor: inherit;\n}\n.form-flow__checkbox[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #c63838;\n  margin-left: 3px;\n}\n.form-flow__checkbox[_ngcontent-%COMP%]:has(input:disabled) {\n  cursor: default;\n  opacity: 0.64;\n}\n.form-flow--grouped[_ngcontent-%COMP%]   .form-flow__controls[_ngcontent-%COMP%] {\n  gap: 12px 14px;\n}\n.form-flow--grouped[_ngcontent-%COMP%]   .form-flow__control--wide[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.form-flow--grouped[_ngcontent-%COMP%]   .form-flow__slide--media[_ngcontent-%COMP%]   .form-flow__controls[_ngcontent-%COMP%] {\n  --form-flow-media-image-height: var(--form-flow-grouped-media-image-height, 186px);\n  grid-template-columns: minmax(320px, 400px) repeat(2, minmax(0, 1fr));\n}\n.form-flow--grouped[_ngcontent-%COMP%]   .form-flow__slide--media[_ngcontent-%COMP%]   .form-flow__control--image[_ngcontent-%COMP%] {\n  display: flex;\n  grid-column: 1;\n  grid-row: 1/span var(--form-flow-control-row-span, 3);\n  align-self: start;\n  min-height: 0;\n}\n.form-flow--grouped[_ngcontent-%COMP%]   .form-flow__slide--media[_ngcontent-%COMP%]   .form-flow__control--image.form-flow__control--wide[_ngcontent-%COMP%] {\n  grid-column: 1;\n}\n.form-flow--grouped[_ngcontent-%COMP%]   .form-flow__slide--media[_ngcontent-%COMP%]   .form-flow__control--image[_ngcontent-%COMP%]   app-image-carousel[_ngcontent-%COMP%] {\n  --image-single-slot-height: var(--form-flow-media-image-height);\n  flex: 0 0 auto;\n  height: var(--form-flow-media-image-height);\n  min-height: 0;\n  max-width: 100%;\n}\n.form-flow--grouped[_ngcontent-%COMP%]   .form-flow__slide--media[_ngcontent-%COMP%]   .form-flow__control--image[_ngcontent-%COMP%]    ~ .form-flow__control[_ngcontent-%COMP%]:not(.form-flow__control--half) {\n  grid-column: 2/-1;\n}\n.form-flow--grouped[_ngcontent-%COMP%]   .form-flow__control[_ngcontent-%COMP%]:not(.form-flow__control--half):not(.form-flow__control--wide):last-child:nth-child(odd) {\n  grid-column: auto;\n}\n.form-flow--grouped[_ngcontent-%COMP%]   .form-flow__control--with-accessory[_ngcontent-%COMP%]:not(.form-flow__control--half) {\n  grid-column: auto;\n}\n.form-flow--grouped[_ngcontent-%COMP%]   .form-flow__control--with-accessory.form-flow__control--wide[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.form-flow__date-input[_ngcontent-%COMP%], \n.form-flow__link-input[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n}\n.form-flow__link-input[_ngcontent-%COMP%] {\n  --link-input-label-font-size: var(--form-flow-label-font-size, 12px);\n}\n.form-flow__control--wide[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.form-flow__control[_ngcontent-%COMP%]:not(.form-flow__control--half):last-child:nth-child(odd) {\n  grid-column: 1/-1;\n}\n.form-flow__label[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n  margin-bottom: 6px;\n  color: #233e61;\n  font-size: var(--form-flow-label-font-size, 12px);\n  font-weight: 700;\n  line-height: 1;\n}\n.form-flow__label[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #c63838;\n  margin-left: 3px;\n}\n.form-flow__label[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: #71839b;\n  font-size: inherit;\n  font-weight: 700;\n  line-height: 1;\n  font-variant-numeric: tabular-nums;\n}\n.form-flow__control.is-required-missing[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.form-flow__control.is-required-missing[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.form-flow__control.is-invalid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.form-flow__control.is-invalid[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  border-color: #ef9a9a;\n  background: #fff1f1;\n}\n.form-flow__section-title[_ngcontent-%COMP%], \n.form-flow__static[_ngcontent-%COMP%] {\n  border: 1px solid #cfdbeb;\n  border-radius: 8px;\n  background: #ffffff;\n  padding: 12px;\n}\n.form-flow__section-title[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%], \n.form-flow__static[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 14px;\n}\n.form-flow__section-title[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n.form-flow__static[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 6px 0 0;\n  color: #506885;\n  font-size: 13px;\n  line-height: 1.4;\n}\n.form-flow__summary-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-bottom: 12px;\n}\n.form-flow__summary-head[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #396da9;\n}\n.form-flow__summary-head[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 16px;\n}\n.form-flow__summary-head[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 4px 0 0;\n  color: #5b6f88;\n  font-size: 13px;\n}\n.form-flow__summary-panels[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  grid-auto-rows: max-content;\n  align-content: start;\n  align-items: start;\n  gap: 12px;\n}\n.form-flow__summary-panel[_ngcontent-%COMP%] {\n  min-width: 0;\n  border: 1px solid #c7d8ef;\n  border-radius: 10px;\n  background: #ffffff;\n  overflow: hidden;\n}\n.form-flow__summary-panel[_ngcontent-%COMP%]   header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 11px 12px;\n  background: #f1f6fd;\n  border-bottom: 1px solid #d8e4f3;\n}\n.form-flow__summary-panel[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 13px;\n}\n.form-flow__summary-panel[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #396da9;\n  font-size: 19px;\n  width: 19px;\n  height: 19px;\n}\n.form-flow__summary-panel[_ngcontent-%COMP%]   dl[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0;\n  margin: 0;\n  padding: 2px 12px 12px;\n}\n.form-flow__summary-panel[_ngcontent-%COMP%]   dl[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(150px, 0.42fr) minmax(0, 0.58fr);\n  gap: 20px;\n  padding: 9px 0;\n  border-bottom: 1px solid #ecf1f7;\n}\n.form-flow__summary-panel[_ngcontent-%COMP%]   dl[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]:last-child {\n  border-bottom: 0;\n}\n.form-flow__summary-panel[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 3px;\n  color: #60748d;\n  font-size: 12px;\n  font-weight: 900;\n  line-height: 1.3;\n}\n.form-flow__summary-panel[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  width: fit-content;\n  padding: 1px 6px;\n  border-radius: 999px;\n  background: #fff2f2;\n  color: #b42328;\n  font-size: 10px;\n  font-weight: 900;\n}\n.form-flow__summary-panel[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  min-width: 0;\n  margin: 0;\n  color: #203b5d;\n  font-size: 13px;\n  overflow-wrap: anywhere;\n}\n.form-flow__summary-panel[_ngcontent-%COMP%]   .is-empty[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  color: #8a9ab0;\n}\n.form-flow__summary-panel.is-missing[_ngcontent-%COMP%] {\n  border-color: #ef9a9a;\n}\n.form-flow__summary-panel.is-missing[_ngcontent-%COMP%]   header[_ngcontent-%COMP%] {\n  background: #fff3f3;\n  border-bottom-color: #f3c4c4;\n  color: #a73434;\n}\n.form-flow__summary-panel.is-missing[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #b42328;\n}\n.form-flow__summary-empty[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 12px;\n  color: #75869d;\n  font-size: 13px;\n}\n.form-flow__footer[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 12px;\n  padding: 12px 16px;\n  border-top: 1px solid #d7e3f2;\n  background: #ffffff;\n}\n.form-flow__footer--carousel[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 1fr);\n  padding: 8px 16px 12px;\n  border-top: 0;\n}\n.form-flow__nav[_ngcontent-%COMP%] {\n  width: 40px;\n  height: 40px;\n  border: 1px solid #c7d8ef;\n  border-radius: 999px;\n  background: #ffffff;\n  color: #2f649f;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  transform: none;\n}\n.form-flow__nav[_ngcontent-%COMP%]:disabled {\n  cursor: default;\n  opacity: 0.45;\n}\n.form-flow__nav[_ngcontent-%COMP%]:not(:disabled):hover {\n  border-color: rgba(44, 78, 121, 0.32);\n  background: rgba(235, 246, 255, 0.98);\n  color: #204d82;\n  box-shadow: 0 10px 22px rgba(14, 34, 61, 0.28);\n}\n.form-flow__nav[_ngcontent-%COMP%]:not(:disabled):active {\n  transform: none;\n}\n.form-flow__nav.is-blocked[_ngcontent-%COMP%], \n.form-flow__nav.is-blocked[_ngcontent-%COMP%]:disabled {\n  border-color: #ef9a9a;\n  background: #fff0f0;\n  color: #b42328;\n  opacity: 1;\n}\n.form-flow__slide-nav[_ngcontent-%COMP%] {\n  position: absolute;\n  z-index: 8;\n  top: calc(var(--form-flow-carousel-card-height) + 4px);\n  left: -6px;\n  right: -6px;\n  height: 40px;\n  min-height: 40px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  pointer-events: none;\n}\n.form-flow__slide-nav[_ngcontent-%COMP%]   .form-flow__nav[_ngcontent-%COMP%] {\n  pointer-events: auto;\n  box-shadow: 0 12px 28px rgba(25, 45, 73, 0.16);\n}\n.form-flow__stage--compact-head[_ngcontent-%COMP%]   .form-flow__slide-nav[_ngcontent-%COMP%] {\n  top: 66px;\n}\n.form-flow__step-nav-spacer[_ngcontent-%COMP%] {\n  height: 40px;\n}\n.form-flow__dots[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 6px;\n}\n.form-flow__dots[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  width: 9px;\n  height: 9px;\n  border: 0;\n  border-radius: 999px;\n  background: #c4d0df;\n  padding: 0;\n  cursor: pointer;\n}\n.form-flow__dots[_ngcontent-%COMP%]   button.is-active[_ngcontent-%COMP%] {\n  width: 18px;\n  background: #3974b2;\n}\n.form-flow__dots[_ngcontent-%COMP%]   button.is-missing[_ngcontent-%COMP%] {\n  background: #df5a5a;\n}\n.form-flow__dots[_ngcontent-%COMP%]   button.is-active.is-missing[_ngcontent-%COMP%] {\n  background: #b42328;\n}\n.form-flow__dots[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:disabled {\n  cursor: default;\n}\n.form-flow--carousel[_ngcontent-%COMP%]   .form-flow__body[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: stretch;\n  background: #ffffff;\n  overflow-x: auto;\n  overflow-y: hidden;\n  scroll-snap-type: x mandatory;\n  scroll-behavior: smooth;\n  scrollbar-width: none;\n  -ms-overflow-style: none;\n  -webkit-overflow-scrolling: touch;\n  overscroll-behavior-x: contain;\n}\n.form-flow--carousel[_ngcontent-%COMP%]   .form-flow__body[_ngcontent-%COMP%]::-webkit-scrollbar {\n  display: none;\n}\n.form-flow--carousel[_ngcontent-%COMP%]   .form-flow__track[_ngcontent-%COMP%] {\n  display: contents;\n  transform: none !important;\n  transition: none;\n}\n.form-flow--carousel[_ngcontent-%COMP%]   .form-flow__slide[_ngcontent-%COMP%] {\n  flex: 0 0 100%;\n  width: 100%;\n  min-width: 100%;\n  max-width: 100%;\n  height: 100%;\n  min-height: 0;\n  box-sizing: border-box;\n  overflow: hidden;\n  scroll-snap-align: start;\n  scroll-snap-stop: always;\n}\n.form-flow--carousel[_ngcontent-%COMP%]   .form-flow__slide-inner[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-rows: auto minmax(0, 1fr);\n  align-content: stretch;\n  height: 100%;\n  min-height: 0;\n  overflow: hidden;\n  padding: 0;\n}\n.form-flow--carousel[_ngcontent-%COMP%]   .form-flow__slide--summary[_ngcontent-%COMP%]   .form-flow__slide-inner[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-rows: minmax(0, 1fr);\n  overflow: hidden;\n  padding: 0;\n}\n.form-flow__stage--compact-head[_ngcontent-%COMP%]   .form-flow__slide-inner[_ngcontent-%COMP%] {\n  grid-template-rows: minmax(0, 1fr);\n}\n.form-flow--carousel[_ngcontent-%COMP%]   .form-flow__step-header[_ngcontent-%COMP%] {\n  margin-bottom: 0;\n}\n.form-flow--carousel[_ngcontent-%COMP%]   .form-flow__step-header--card[_ngcontent-%COMP%] {\n  height: var(--form-flow-carousel-card-height);\n}\n.form-flow--carousel[_ngcontent-%COMP%]   .form-flow__step-image-card[_ngcontent-%COMP%], \n.form-flow--carousel[_ngcontent-%COMP%]   .form-flow__step-info-card[_ngcontent-%COMP%] {\n  height: 100%;\n}\n.form-flow--carousel[_ngcontent-%COMP%]   .form-flow__controls[_ngcontent-%COMP%] {\n  align-self: stretch;\n  min-height: 0;\n  margin-top: 48px;\n  padding: 10px;\n  border: 1px solid #c7d8ef;\n  border-radius: 10px;\n  background: #eaf4ff;\n  overflow-x: hidden;\n  overflow-y: auto;\n  scrollbar-width: thin;\n  scrollbar-color: #8aa0b8 #eaf1fa;\n  scrollbar-gutter: stable;\n  -webkit-overflow-scrolling: touch;\n  overscroll-behavior-y: contain;\n}\n.form-flow--carousel.form-flow--menu-overflow[_ngcontent-%COMP%]   .form-flow__controls[_ngcontent-%COMP%]:has(.app-menu-host--open) {\n  position: relative;\n  z-index: 10;\n}\n.form-flow--carousel.form-flow--menu-overflow[_ngcontent-%COMP%]   .form-flow__slide[_ngcontent-%COMP%]:has(.app-menu-host--open) {\n  position: relative;\n  z-index: 9;\n  contain: none;\n}\n.form-flow__stage--compact-head[_ngcontent-%COMP%]   .form-flow__controls[_ngcontent-%COMP%] {\n  margin-top: 60px;\n}\n.form-flow--carousel[_ngcontent-%COMP%]   .form-flow__summary-head[_ngcontent-%COMP%] {\n  display: none;\n}\n.form-flow--carousel[_ngcontent-%COMP%]   .form-flow__summary-panels[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  height: calc(100% - 60px);\n  min-height: 0;\n  margin-top: 60px;\n  padding: 0 10px 12px;\n  overflow-x: hidden;\n  overflow-y: auto;\n  scrollbar-width: auto;\n  scrollbar-color: #8aa0b8 #eaf1fa;\n  scrollbar-gutter: stable;\n  -webkit-overflow-scrolling: touch;\n  overscroll-behavior-y: contain;\n}\n.form-flow--carousel[_ngcontent-%COMP%]   .form-flow__summary-panels[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 8px;\n}\n.form-flow--carousel[_ngcontent-%COMP%]   .form-flow__summary-panels[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: #eaf1fa;\n  border-radius: 999px;\n}\n.form-flow--carousel[_ngcontent-%COMP%]   .form-flow__summary-panels[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: #8aa0b8;\n  border-radius: 999px;\n}\n.form-flow__body.form-flow__body--mobile[_ngcontent-%COMP%] {\n  --form-flow-mobile-slide-edge-reserve: 1px;\n  display: block;\n  align-items: stretch;\n  overflow-x: auto;\n  overflow-y: hidden;\n  scroll-snap-type: x mandatory;\n  scroll-behavior: smooth;\n  scrollbar-width: none;\n  -ms-overflow-style: none;\n  -webkit-overflow-scrolling: touch;\n  overscroll-behavior-x: contain;\n}\n.form-flow__body.form-flow__body--mobile[_ngcontent-%COMP%]::-webkit-scrollbar {\n  display: none;\n}\n.form-flow__body--mobile[_ngcontent-%COMP%]   .form-flow__track[_ngcontent-%COMP%] {\n  display: grid;\n  grid-auto-flow: column;\n  grid-auto-columns: calc(100% + var(--form-flow-mobile-slide-edge-reserve));\n  width: auto;\n  min-width: 100%;\n  align-items: stretch;\n  height: 100%;\n  min-height: 100%;\n  transform: none !important;\n  transition: none;\n  will-change: auto;\n  backface-visibility: visible;\n}\n.form-flow__body--mobile[_ngcontent-%COMP%]   .form-flow__slide[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  height: 100%;\n  min-height: 0;\n  overflow: hidden;\n  contain: layout paint style;\n  scroll-snap-align: start;\n  scroll-snap-stop: always;\n}\n.form-flow__body--mobile[_ngcontent-%COMP%]   .form-flow__slide-inner[_ngcontent-%COMP%] {\n  width: calc(100% - var(--form-flow-mobile-slide-edge-reserve));\n}\n.form-flow__loading[_ngcontent-%COMP%], \n.form-flow__empty[_ngcontent-%COMP%] {\n  min-height: 240px;\n  display: grid;\n  place-items: center;\n  align-content: center;\n  gap: 10px;\n  color: #536a84;\n  text-align: center;\n}\n@media (max-width: 720px) {\n  .form-flow[_ngcontent-%COMP%] {\n    border-radius: 0;\n  }\n  .form-flow--carousel[_ngcontent-%COMP%] {\n    --form-flow-carousel-card-height: 250px;\n  }\n  .form-flow__header[_ngcontent-%COMP%] {\n    align-items: stretch;\n    flex-direction: column;\n  }\n  .form-flow__progress[_ngcontent-%COMP%] {\n    justify-items: stretch;\n  }\n  .form-flow__progress-track[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  .form-flow--carousel[_ngcontent-%COMP%]   .form-flow__carousel-head[_ngcontent-%COMP%]   .form-flow__progress[_ngcontent-%COMP%] {\n    justify-items: end;\n    margin-left: auto;\n    min-width: 150px;\n  }\n  .form-flow--carousel[_ngcontent-%COMP%]   .form-flow__carousel-head[_ngcontent-%COMP%]   .form-flow__progress-track[_ngcontent-%COMP%] {\n    width: 150px;\n  }\n  .form-flow--carousel[_ngcontent-%COMP%]   .form-flow__carousel-head[_ngcontent-%COMP%] {\n    padding-right: 8px;\n    padding-left: 8px;\n  }\n  .form-flow--carousel[_ngcontent-%COMP%]   .form-flow__slide-inner[_ngcontent-%COMP%] {\n    height: 100%;\n    min-height: 100%;\n    overflow-x: hidden;\n    overflow-y: hidden;\n    padding: 0;\n    -webkit-overflow-scrolling: touch;\n    overscroll-behavior-x: auto;\n    overscroll-behavior-y: auto;\n  }\n  .form-flow--carousel[_ngcontent-%COMP%]   .form-flow__slide--summary[_ngcontent-%COMP%]   .form-flow__slide-inner[_ngcontent-%COMP%] {\n    overflow: hidden;\n    padding: 0;\n  }\n  .form-flow--carousel[_ngcontent-%COMP%]   .form-flow__summary-panels[_ngcontent-%COMP%] {\n    height: calc(100% - 60px);\n    margin-top: 60px;\n    padding: 0 8px 12px;\n  }\n  .form-flow--carousel[_ngcontent-%COMP%]   .form-flow__step-header--card[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  .form-flow--carousel[_ngcontent-%COMP%]   .form-flow__carousel-progress-slot[_ngcontent-%COMP%] {\n    top: 18px;\n    right: 18px;\n  }\n  .form-flow--carousel[_ngcontent-%COMP%]   .form-flow__carousel-progress-slot[_ngcontent-%COMP%]   .form-flow__progress[_ngcontent-%COMP%] {\n    min-width: 0;\n  }\n  .form-flow--carousel[_ngcontent-%COMP%]   .form-flow__carousel-progress-slot[_ngcontent-%COMP%]   .form-flow__progress-track[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .form-flow--carousel[_ngcontent-%COMP%]   .form-flow__controls[_ngcontent-%COMP%] {\n    margin-top: 48px;\n    padding: 8px;\n  }\n  .form-flow--grouped[_ngcontent-%COMP%]   .form-flow__body[_ngcontent-%COMP%] {\n    padding: 12px 8px 18px;\n  }\n  .form-flow--grouped[_ngcontent-%COMP%]   .form-flow__track[_ngcontent-%COMP%] {\n    padding: 0;\n  }\n  .form-flow--grouped[_ngcontent-%COMP%]   .form-flow__slide--media[_ngcontent-%COMP%]   .form-flow__controls[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .form-flow--grouped[_ngcontent-%COMP%]   .form-flow__slide--media[_ngcontent-%COMP%]   .form-flow__control--image[_ngcontent-%COMP%], \n   .form-flow--grouped[_ngcontent-%COMP%]   .form-flow__slide--media[_ngcontent-%COMP%]   .form-flow__control--image.form-flow__control--wide[_ngcontent-%COMP%], \n   .form-flow--grouped[_ngcontent-%COMP%]   .form-flow__slide--media[_ngcontent-%COMP%]   .form-flow__control--image[_ngcontent-%COMP%]    ~ .form-flow__control[_ngcontent-%COMP%]:not(.form-flow__control--half) {\n    grid-column: 1;\n    grid-row: auto;\n  }\n  .form-flow--grouped[_ngcontent-%COMP%]   .form-flow__slide[_ngcontent-%COMP%] {\n    border-radius: 10px;\n  }\n  .form-flow__controls[_ngcontent-%COMP%], \n   .form-flow__summary-panels[_ngcontent-%COMP%], \n   .form-flow__step-header[_ngcontent-%COMP%]:not(.form-flow__step-header--card) {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .form-flow__save[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  .form-flow__summary-panel[_ngcontent-%COMP%]   dl[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(118px, 0.46fr) minmax(0, 0.54fr);\n    gap: 10px;\n  }\n}\n/*# sourceMappingURL=form-flow.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormFlowComponent, [{
    type: Component,
    args: [{ selector: "app-form-flow", standalone: true, imports: [
      CommonModule,
      FormsModule,
      MatIconModule,
      AppMenuComponent,
      DateInputComponent,
      LinkInputComponent,
      LocationInputComponent,
      PoliciesInputComponent,
      PricingEditorInputComponent,
      RouteInputComponent,
      ImageCarouselComponent,
      IndicatorComponent,
      ImageCardComponent,
      InfoCardComponent,
      I18nPipe
    ], providers: [
      FormFlowPopupStore,
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => FormFlowComponent),
        multi: true
      }
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `<section
  class="form-flow"
  [class.is-loading]="loading"
  [class.form-flow--carousel]="isCarouselLayout()"
  [class.form-flow--grouped]="isGroupedLayout()"
  [class.form-flow--menu-overflow]="model?.allowMenuOverflow === true"
  [ngClass]="toneClass()"
  [attr.aria-busy]="loading"
>
  <ng-template #progressControls>
    <div class="form-flow__progress" [attr.aria-label]="pageCounterLabel()">
      @if (showSaveAction()) {
        <button
          type="button"
          class="form-flow__save"
          [class.is-missing]="totalMissingRequiredCount() > 0"
          [class.is-saving]="saving"
          [disabled]="!canSave()"
          (click)="emitSave($event)"
          [attr.aria-label]="saveAriaLabel()"
          [attr.title]="totalMissingRequiredCount() > 0 ? totalMissingRequiredCount() + ' required field missing' : saveAriaLabel()"
        >
          @if (saving) {
            <span class="form-flow__save-ring" aria-hidden="true">
              <app-indicator kind="action-ring" shape="button" state="loading"></app-indicator>
            </span>
          }
          <mat-icon>{{ saveIcon() }}</mat-icon>
          <span>{{ saveLabel() }}</span>
        </button>
      } @else {
        <span
          class="form-flow__counter"
          [class.is-missing]="currentPageMissingRequired()"
          [attr.title]="currentPageMissingRequired() ? currentMissingRequiredCount() + ' required field missing' : pageCounterLabel()"
        >
          {{ pageCounterLabel() }}
        </span>
      }
      <div class="form-flow__progress-track" [class.is-missing]="currentPageMissingRequired()">
        <span [style.width.%]="progressPercent()"></span>
      </div>
    </div>
  </ng-template>

  <ng-template #stepNavControls>
    <div class="form-flow__slide-nav" aria-label="Form step navigation">
      <button
        type="button"
        class="form-flow__nav form-flow__nav--prev"
        data-motion="none"
        [disabled]="isDisabled() || visiblePageIndex() <= 0"
        (click)="goPrevious($event)"
        aria-label="Previous step"
      >
        <mat-icon>chevron_left</mat-icon>
      </button>
      <button
        type="button"
        class="form-flow__nav form-flow__nav--next"
        data-motion="none"
        [class.is-blocked]="nextStepBlocked()"
        [disabled]="isDisabled() || visiblePageIndex() >= totalPageCount() - 1 || nextStepBlocked()"
        (click)="goNext($event)"
        [attr.aria-label]="nextStepBlocked() ? 'Complete required fields before continuing' : 'Next step'"
        [attr.title]="nextStepBlocked() ? currentMissingRequiredCount() + ' required field missing' : 'Next step'"
      >
        <mat-icon>chevron_right</mat-icon>
      </button>
    </div>
  </ng-template>

  @if (!isCarouselLayout() && model?.header !== false) {
    <header class="form-flow__header">
      <div class="form-flow__title-block">
        <span class="form-flow__kicker">{{ model?.title }}</span>
        <h2>{{ activeTitle() }}</h2>
        @if (activeSubtitle()) {
          <p>{{ activeSubtitle() }}</p>
        }
      </div>

      @if (!isGroupedLayout()) {
        <ng-container [ngTemplateOutlet]="progressControls"></ng-container>
      }
    </header>
  }

  @if (loading) {
    <article class="form-flow__loading">
      <app-indicator kind="load-ring" state="loading"></app-indicator>
      <span>{{ model?.loadingLabel || 'Loading form' }}</span>
    </article>
  } @else if (model && totalPageCount() > 0) {
    <div
      class="form-flow__stage"
      [class.form-flow__stage--carousel]="isCarouselLayout()"
      [class.form-flow__stage--grouped]="isGroupedLayout()"
      [class.form-flow__stage--compact-head]="isCarouselLayout() && !activeStepHasCardHeader()"
    >
      @if (isCarouselLayout() && !activeStepHasCardHeader()) {
        <div class="form-flow__carousel-head">
          <span
            class="form-flow__step-badge"
            [class.is-missing]="currentPageMissingRequired()"
            [class.is-complete]="currentPageRequiredComplete()"
          >
            <mat-icon>{{ activeStepIcon() }}</mat-icon>
            <span>{{ activeTitle() }}</span>
            @if (currentPageMissingRequired()) {
              <mat-icon>priority_high</mat-icon>
            } @else if (currentPageRequiredComplete()) {
              <mat-icon>check</mat-icon>
            }
          </span>
          <ng-container [ngTemplateOutlet]="progressControls"></ng-container>
        </div>
      }
      <main
        #flowViewport
        class="form-flow__body"
        [class.form-flow__body--mobile]="isMobileViewport && !isGroupedLayout()"
        [class.is-swipe-blocked]="allHorizontalSwipeBlocked()"
        (scroll)="onFlowViewportScroll()"
        (touchstart)="onFlowViewportTouchStart($event)"
        (touchmove)="onFlowViewportTouchMove($event)"
        (touchend)="onFlowViewportTouchEnd()"
        (touchcancel)="onFlowViewportTouchEnd()"
        (wheel)="onFlowViewportWheel($event)"
      >
        <div class="form-flow__track" [style.transform]="pageTrackTransform()">
          @for (step of pages(); track step.id; let stepIndex = $index) {
            <section
              class="form-flow__slide"
              [class.is-active]="isPageActive(stepIndex)"
              [class.is-missing]="isStepMissingRequired(step)"
              [class.form-flow__slide--plain]="step.chrome === 'none'"
              [class.form-flow__slide--media]="step.presentation === 'media'"
              [attr.data-step-id]="step.id"
              [attr.aria-hidden]="isPageActive(stepIndex) ? null : 'true'"
              [attr.inert]="isPageActive(stepIndex) ? null : ''"
              [attr.aria-labelledby]="(step.title || step.header) ? 'form-flow-step-' + step.id : null"
            >
              <div class="form-flow__slide-inner">
              @if (isGroupedLayout() && step.chrome !== 'none' && (step.title || step.icon)) {
                <div class="form-flow__group-header">
                  @if (step.icon) {
                    <mat-icon>{{ step.icon }}</mat-icon>
                  }
                  <h3 id="form-flow-step-{{ step.id }}">{{ step.title }}</h3>
                </div>
              }
              @if (step.header) {
                <div
                  class="form-flow__step-header"
                  [class.form-flow__step-header--card]="!!(step.header.imageCard || step.header.infoCard)"
                  [class.form-flow__step-header--image-card]="!!step.header.imageCard"
                  [class.form-flow__step-header--info-card]="!!step.header.infoCard"
                >
                  @if (step.header.imageCard) {
                    <h3 class="form-flow__step-title-sr" id="form-flow-step-{{ step.id }}">
                      {{ step.header.title || step.title }}
                    </h3>
                    <app-image-card
                      class="form-flow__step-image-card"
                      [card]="step.header.imageCard"
                    ></app-image-card>
                  } @else if (step.header.infoCard) {
                    <h3 class="form-flow__step-title-sr" id="form-flow-step-{{ step.id }}">
                      {{ step.header.title || step.title }}
                    </h3>
                    <app-info-card
                      class="form-flow__step-info-card"
                      [card]="step.header.infoCard"
                    ></app-info-card>
                  } @else {
                    @if (step.header.imageUrl) {
                      <img [src]="step.header.imageUrl" alt="" />
                    }
                    <div>
                      @if (step.header.icon) {
                        <mat-icon>{{ step.header.icon }}</mat-icon>
                      }
                      <h3 id="form-flow-step-{{ step.id }}">{{ step.header.title || step.title }}</h3>
                      @if (step.header.subtitle) {
                        <p>{{ step.header.subtitle }}</p>
                      }
                    </div>
                  }
                </div>
              }

                <div class="form-flow__controls">
                @for (control of step.controls; track control.id) {
                  @let validationError = controlValidationError(control);
                  <div
                    class="form-flow__control"
                    [attr.data-control-id]="control.id"
                    [class.form-flow__control--wide]="control.layout === 'wide' || (control.layout !== 'half' && (control.kind === 'textarea' || control.kind === 'image-carousel' || control.kind === 'review' || control.kind === 'section'))"
                    [class.form-flow__control--half]="control.layout === 'half'"
                    [class.form-flow__control--with-accessory]="accessoryMenuConfig(control)"
                    [class.form-flow__control--image]="control.kind === 'image-carousel'"
                    [class.is-required-missing]="isRequiredControlMissing(control)"
                    [class.is-invalid]="!!validationError"
                    [style.--form-flow-control-row-span]="control.rowSpan ?? null"
                  >
                    @if (control.kind === 'section') {
                      <div class="form-flow__section-title">
                        <h4>{{ control.label }}</h4>
                        @if (control.description) {
                          <p>{{ control.description }}</p>
                        }
                      </div>
                    } @else if (control.kind === 'menu') {
                      @if (control.label) {
                        <label class="form-flow__label">
                          <span>{{ control.label }}@if (control.required) { <strong>*</strong> }</span>
                        </label>
                      }
                      <app-menu
                        class="form-flow__menu"
                        [kind]="menuKind(control)"
                        [layout]="menuLayout(control)"
                        [title]="menuTitle(control)"
                        [filterable]="menuFilterable(control)"
                        [trigger]="menuTrigger(control)"
                        [model]="menuModel(control)"
                        [items]="menuItems(control)"
                        [panelMode]="menuPanelMode(control)"
                        [ngModel]="controlValue(control)"
                        (ngModelChange)="updateControlValue(control, $event)"
                        (itemSelect)="emitControlAction(control, $event)"
                        [closeOnSelect]="menuCloseOnSelect(control)"
                      ></app-menu>
                    } @else if (control.kind === 'image-carousel') {
                      @if (control.label) {
                        <label class="form-flow__label">
                          <span>{{ control.label }}@if (control.required) { <strong>*</strong> }</span>
                        </label>
                      }
                      @let image = imageConfig(control);
                      <app-image-carousel
                        [slotCount]="image.slotCount ?? 8"
                        [compact]="image.compact === true"
                        [autoSize]="image.autoSize === true"
                        [previewMode]="image.previewMode === true && !isMobileViewport"
                        [ariaLabel]="image.ariaLabel || control.label || 'Images'"
                        [uploadOwnerId]="image.uploadOwnerId || ''"
                        [uploadEntityId]="image.uploadEntityId || 'image'"
                        [disabled]="isControlDisabled(control)"
                        [ngModel]="controlStringArrayValue(control)"
                        (ngModelChange)="updateControlValue(control, $event)"
                      ></app-image-carousel>
                    } @else if (control.kind === 'checkbox') {
                      <label class="form-flow__checkbox">
                        <input
                          type="checkbox"
                          [disabled]="isControlDisabled(control) || control.readOnly === true"
                          [ngModel]="controlBooleanValue(control)"
                          (ngModelChange)="updateControlValue(control, $event)"
                        />
                        <span>{{ control.label }}@if (control.required) { <strong>*</strong> }</span>
                      </label>
                    } @else if (control.kind === 'textarea') {
                      <label class="form-flow__label">
                        <span>{{ control.label }}@if (control.required) { <strong>*</strong> }</span>
                        @if (control.maxLength || control.minLength) {
                          <small>{{ controlTextValue(control).length }}/{{ control.maxLength ?? control.minLength }}</small>
                        }
                      </label>
                      <textarea
                        [rows]="control.rows ?? 3"
                        [attr.minlength]="control.minLength ?? null"
                        [attr.maxlength]="control.maxLength ?? null"
                        [placeholder]="control.placeholder || ''"
                        [disabled]="isControlDisabled(control)"
                        [readOnly]="control.readOnly === true"
                        [ngModel]="controlTextValue(control)"
                        (ngModelChange)="updateControlValue(control, $event)"
                      ></textarea>
                    } @else if (control.kind === 'static' || control.kind === 'review') {
                      <article class="form-flow__static">
                        @if (control.label) {
                          <h4>{{ control.label }}</h4>
                        }
                        <p>{{ summaryValue(control) }}</p>
                      </article>
                    } @else if (control.kind === 'date') {
                      <app-date-input
                        class="form-flow__date-input"
                        [model]="dateInputModel(control)"
                        [ngModel]="dateControlValue(control)"
                        (ngModelChange)="updateDateControlValue(control, $event)"
                      ></app-date-input>
                    } @else if (control.kind === 'location') {
                      <app-location-input
                        class="form-flow__location-input"
                        [config]="locationConfig(control)"
                        [readOnly]="isControlDisabled(control)"
                        [ngModel]="controlTextValue(control)"
                        (ngModelChange)="updateControlValue(control, $event)"
                      ></app-location-input>
                    } @else if (control.kind === 'link') {
                      <app-link-input
                        class="form-flow__link-input"
                        [config]="linkConfig(control)"
                        [readOnly]="isControlDisabled(control)"
                        [ngModel]="controlTextValue(control)"
                        (ngModelChange)="updateControlValue(control, $event)"
                      ></app-link-input>
                    } @else if (control.kind === 'pricing') {
                      <app-pricing-editor-input
                        class="form-flow__pricing-input"
                        [config]="pricingConfig(control)"
                        [readOnly]="isControlDisabled(control)"
                        [ngModel]="controlValue(control)"
                        (ngModelChange)="updateControlValue(control, $event)"
                      ></app-pricing-editor-input>
                    } @else if (control.kind === 'route') {
                      <app-route-input
                        class="form-flow__route-input"
                        [config]="routeConfig(control)"
                        [readOnly]="isControlDisabled(control)"
                        [ngModel]="controlStringArrayValue(control)"
                        (ngModelChange)="updateControlValue(control, $event)"
                      ></app-route-input>
                    } @else if (control.kind === 'policies') {
                      <app-policies-input
                        class="form-flow__policies-input"
                        [config]="policiesInputConfig(control)"
                        [enabled]="policiesEnabled(control)"
                        (enabledChange)="updatePoliciesEnabled(control, $event)"
                        [readOnly]="isControlDisabled(control)"
                        [ngModel]="controlValue(control)"
                        (ngModelChange)="updateControlValue(control, $event)"
                      ></app-policies-input>
                    } @else {
                      <label class="form-flow__label">
                        <span>{{ control.label }}@if (control.required) { <strong>*</strong> }</span>
                      </label>
                      <input
                        [type]="inputType(control)"
                        [attr.min]="control.min ?? null"
                        [attr.max]="control.max ?? null"
                        [attr.minlength]="control.minLength ?? null"
                        [attr.step]="control.step ?? null"
                        [attr.maxlength]="control.maxLength ?? null"
                        [placeholder]="control.placeholder || ''"
                        [disabled]="isControlDisabled(control)"
                        [readOnly]="control.readOnly === true"
                        [ngModel]="control.kind === 'number' ? controlNumberValue(control) : controlTextValue(control)"
                        (ngModelChange)="updateControlValue(control, $event)"
                      />
                    }
                    @if (accessoryMenuConfig(control)) {
                      <app-menu
                        class="form-flow__control-accessory"
                        [kind]="accessoryMenuKind(control)"
                        [layout]="accessoryMenuLayout(control)"
                        [title]="accessoryMenuTitle(control)"
                        [trigger]="accessoryMenuTrigger(control)"
                        [model]="accessoryMenuModel(control)"
                        [items]="accessoryMenuItems(control)"
                        [panelMode]="accessoryMenuPanelMode(control)"
                        (itemSelect)="emitControlAction(control, $event)"
                        [closeOnSelect]="accessoryMenuCloseOnSelect(control)"
                      ></app-menu>
                    }
                    @if (validationError) {
                      <small class="form-flow__control-error" role="alert">
                        {{ validationError }}
                      </small>
                    } @else if (control.description && control.kind !== 'section') {
                      <small class="form-flow__control-description">{{ control.description }}</small>
                    }
                  </div>
                }
                </div>
              </div>
            </section>
          }

          @if (hasSummaryPage()) {
            <section
              class="form-flow__slide form-flow__slide--summary"
              [class.is-active]="isSummaryPage()"
              [class.is-missing]="totalMissingRequiredCount() > 0"
              [attr.aria-hidden]="isSummaryPage() ? null : 'true'"
              [attr.inert]="isSummaryPage() ? null : ''"
              [attr.aria-label]="summaryTitle()"
            >
              <div class="form-flow__slide-inner">
              <div class="form-flow__summary-head">
                <mat-icon>{{ model.summary?.icon || 'fact_check' }}</mat-icon>
                <div>
                  <h3>{{ summaryTitle() }}</h3>
                  @if (model.summary?.subtitle) {
                    <p>{{ model.summary?.subtitle }}</p>
                  }
                </div>
              </div>

              <div class="form-flow__summary-panels">
                @for (step of pages(); track step.id) {
                  <article class="form-flow__summary-panel" [class.is-missing]="isStepMissingRequired(step)">
                    <header>
                      @if (step.icon) {
                        <mat-icon>{{ step.icon }}</mat-icon>
                      }
                      <h4>{{ step.title }}</h4>
                    </header>
                    @let controls = summaryControls(step);
                    @if (controls.length > 0) {
                      <dl>
                        @for (control of controls; track control.id) {
                          <div [class.is-empty]="isSummaryValueEmpty(control)">
                            <dt>
                              <span>{{ summaryLabel(control) }}</span>
                              @if (control.required) {
                                <small>{{ 'required' | i18n }}</small>
                              }
                            </dt>
                            <dd>{{ summaryValue(control) }}</dd>
                          </div>
                        }
                      </dl>
                    } @else {
                      <p class="form-flow__summary-empty">{{ summaryEmptyLabel() }}</p>
                    }
                  </article>
                }
              </div>
              </div>
            </section>
          }
        </div>
      </main>

      @if (isCarouselLayout()) {
        @if (activeStepHasCardHeader()) {
          <div class="form-flow__carousel-progress-slot">
            <ng-container [ngTemplateOutlet]="progressControls"></ng-container>
          </div>
        }
        <ng-container [ngTemplateOutlet]="stepNavControls"></ng-container>
      }
    </div>

    @if (!isGroupedLayout()) {
    <footer class="form-flow__footer" [class.form-flow__footer--carousel]="isCarouselLayout()">
      @if (!isCarouselLayout()) {
        <button
          type="button"
          class="form-flow__nav form-flow__nav--prev"
          data-motion="none"
          [disabled]="isDisabled() || visiblePageIndex() <= 0"
          (click)="goPrevious($event)"
          aria-label="Previous step"
        >
          <mat-icon>chevron_left</mat-icon>
        </button>
      }
      <div class="form-flow__dots" aria-label="Form steps">
        @for (step of pages(); track step.id; let index = $index) {
          <button
            type="button"
            [class.is-active]="isPageActive(index)"
            [class.is-missing]="isStepMissingRequired(step)"
            [attr.aria-current]="isPageActive(index) ? 'step' : null"
            [attr.aria-label]="step.title"
            [disabled]="isDisabled() || isForwardNavigationBlocked(index)"
            (click)="goToPage(index, $event)"
          ></button>
        }
        @if (hasSummaryPage()) {
          <button
            type="button"
            [class.is-active]="isSummaryPage()"
            [class.is-missing]="totalMissingRequiredCount() > 0"
            [attr.aria-current]="isSummaryPage() ? 'step' : null"
            [attr.aria-label]="summaryTitle()"
            [disabled]="isDisabled() || isForwardNavigationBlocked(pages().length)"
            (click)="goToPage(pages().length, $event)"
          ></button>
        }
      </div>
      @if (!isCarouselLayout()) {
        <button
          type="button"
          class="form-flow__nav form-flow__nav--next"
          data-motion="none"
          [class.is-blocked]="nextStepBlocked()"
          [disabled]="isDisabled() || visiblePageIndex() >= totalPageCount() - 1 || nextStepBlocked()"
          (click)="goNext($event)"
          [attr.aria-label]="nextStepBlocked() ? 'Complete required fields before continuing' : 'Next step'"
          [attr.title]="nextStepBlocked() ? currentMissingRequiredCount() + ' required field missing' : 'Next step'"
        >
          <mat-icon>chevron_right</mat-icon>
        </button>
      }
    </footer>
    }
  } @else {
    <article class="form-flow__empty">
      <mat-icon>dynamic_form</mat-icon>
      <h3>No form available</h3>
    </article>
  }
</section>
`, styles: ["/* src/app/shared/ui/components/core/form/flow/form-flow.component.scss */\n:host {\n  display: block;\n  min-width: 0;\n}\n.form-flow {\n  --form-flow-base-bg: #f8fbff;\n  --form-flow-panel-bg: rgba(253, 254, 255, 0.92);\n  --form-flow-panel-border: rgba(21, 38, 62, 0.14);\n  --form-flow-primary-panel-bg:\n    linear-gradient(\n      180deg,\n      #f2f7ff 0%,\n      #e8f0fb 100%);\n  --form-flow-primary-panel-border: rgba(58, 108, 168, 0.28);\n  --form-flow-group-icon-color: #396da9;\n  position: relative;\n  display: grid;\n  grid-template-rows: auto minmax(0, 1fr) auto;\n  min-height: 100%;\n  background: var(--form-flow-base-bg);\n  color: #183456;\n  border: 1px solid #c6d9f1;\n  border-radius: 10px;\n  overflow: hidden;\n}\n.form-flow--tone-green {\n  --form-flow-base-bg:\n    linear-gradient(\n      180deg,\n      #f4faf2 0%,\n      #edf7eb 100%);\n  --form-flow-panel-bg:\n    linear-gradient(\n      180deg,\n      #f8fcf6 0%,\n      #eef8ed 100%);\n  --form-flow-panel-border: rgba(54, 129, 72, 0.22);\n  --form-flow-primary-panel-bg:\n    linear-gradient(\n      180deg,\n      #f1faf0 0%,\n      #e5f4e3 100%);\n  --form-flow-primary-panel-border: rgba(54, 129, 72, 0.3);\n  --form-flow-group-icon-color: #2f8546;\n}\n.form-flow--tone-blue {\n  --form-flow-base-bg:\n    linear-gradient(\n      180deg,\n      #f3f8ff 0%,\n      #ecf4ff 100%);\n  --form-flow-panel-bg:\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #eef5ff 100%);\n  --form-flow-panel-border: rgba(46, 111, 178, 0.22);\n  --form-flow-primary-panel-bg:\n    linear-gradient(\n      180deg,\n      #f2f7ff 0%,\n      #e8f0fb 100%);\n  --form-flow-primary-panel-border: rgba(58, 108, 168, 0.28);\n  --form-flow-group-icon-color: #396da9;\n}\n.form-flow--tone-orange {\n  --form-flow-base-bg:\n    linear-gradient(\n      180deg,\n      #fff5f2 0%,\n      #ffefea 100%);\n  --form-flow-panel-bg:\n    linear-gradient(\n      180deg,\n      #fffaf7 0%,\n      #fff0e9 100%);\n  --form-flow-panel-border: rgba(176, 86, 66, 0.24);\n  --form-flow-primary-panel-bg:\n    linear-gradient(\n      180deg,\n      #fff7f0 0%,\n      #ffecdf 100%);\n  --form-flow-primary-panel-border: rgba(176, 86, 66, 0.3);\n  --form-flow-group-icon-color: #b9712d;\n}\n.form-flow--carousel {\n  --form-flow-carousel-card-height: 270px;\n  grid-template-rows: minmax(0, 1fr) auto;\n  height: 100%;\n  min-height: 0;\n  border: 0;\n  border-radius: 0;\n  background: transparent;\n  overflow: visible;\n}\n.form-flow--grouped {\n  grid-template-rows: auto minmax(0, 1fr);\n  height: 100%;\n  min-height: 0;\n  border: 0;\n  border-radius: 0;\n  background: #ffffff;\n  overflow: hidden;\n}\n.form-flow__header {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 16px;\n  padding: 18px 20px 14px;\n  border-bottom: 1px solid #d7e3f2;\n  background: #ffffff;\n}\n.form-flow__title-block {\n  min-width: 0;\n}\n.form-flow__title-block h2 {\n  margin: 2px 0 0;\n  font-size: 20px;\n  line-height: 1.15;\n  font-weight: 700;\n}\n.form-flow__title-block p {\n  margin: 6px 0 0;\n  color: #4b607c;\n  font-size: 13px;\n  line-height: 1.35;\n}\n.form-flow__kicker {\n  display: block;\n  color: #4b607c;\n  font-size: 11px;\n  font-weight: 700;\n  text-transform: uppercase;\n}\n.form-flow__progress {\n  display: grid;\n  justify-items: end;\n  gap: 8px;\n  min-width: 150px;\n}\n.form-flow__counter {\n  display: inline-flex;\n  width: 90px;\n  box-sizing: border-box;\n  justify-content: center;\n  padding: 5px 12px;\n  border-radius: 999px;\n  border: 1px solid #bfd4ee;\n  background: #f2f7ff;\n  color: #294e80;\n  font-size: 12px;\n  font-weight: 700;\n}\n.form-flow__counter.is-missing {\n  border-color: #ef9a9a;\n  background: #fff0f0;\n  color: #b42328;\n}\n.form-flow__save {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 7px;\n  min-height: 34px;\n  padding: 0 16px;\n  border: 0;\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      135deg,\n      #4f83d1,\n      #7556d8);\n  color: #ffffff;\n  font: inherit;\n  font-size: 12px;\n  font-weight: 700;\n  box-shadow: 0 12px 28px rgba(60, 93, 154, 0.22);\n  cursor: pointer;\n}\n.form-flow__save:disabled {\n  cursor: default;\n  opacity: 0.55;\n  box-shadow: none;\n}\n.form-flow__save.is-saving,\n.form-flow__save.is-saving:disabled {\n  opacity: 1;\n  cursor: wait;\n  box-shadow: none;\n}\n.form-flow__save.is-missing {\n  background:\n    linear-gradient(\n      135deg,\n      #d84a4a,\n      #b42328);\n}\n.form-flow__save .form-flow__save-ring {\n  position: absolute;\n  inset: -1px;\n  z-index: 1;\n  border-radius: inherit;\n  pointer-events: none;\n}\n.form-flow__save mat-icon {\n  position: relative;\n  z-index: 2;\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n}\n.form-flow__save span:not(.form-flow__save-ring) {\n  position: relative;\n  z-index: 2;\n}\n.form-flow__progress-track {\n  width: 150px;\n  height: 7px;\n  border-radius: 999px;\n  background: #e2e9f1;\n  overflow: hidden;\n}\n.form-flow__progress-track span {\n  display: block;\n  height: 100%;\n  border-radius: inherit;\n  background:\n    linear-gradient(\n      90deg,\n      #2f8792,\n      #c28128);\n}\n.form-flow__progress-track.is-missing span {\n  background:\n    linear-gradient(\n      90deg,\n      #d84a4a,\n      #f0a15f);\n}\n.form-flow__stage {\n  position: relative;\n  height: 100%;\n  min-height: 0;\n  overflow: visible;\n}\n.form-flow__stage--compact-head {\n  display: grid;\n  grid-template-rows: auto minmax(0, 1fr);\n}\n.form-flow__stage > .form-flow__body {\n  height: 100%;\n  min-height: 0;\n}\n.form-flow__stage--compact-head > .form-flow__body {\n  height: auto;\n}\n.form-flow__body {\n  position: relative;\n  min-height: 0;\n  overflow: hidden;\n  padding: 0;\n}\n.form-flow__body.is-swipe-blocked {\n  touch-action: pan-y;\n  overscroll-behavior-x: none;\n}\n.form-flow__track {\n  display: flex;\n  flex-wrap: nowrap;\n  width: 100%;\n  height: 100%;\n  min-height: 100%;\n  transition: transform 0.34s cubic-bezier(0.2, 0.72, 0.22, 1);\n  will-change: transform;\n  backface-visibility: hidden;\n}\n.form-flow--grouped .form-flow__body {\n  box-sizing: border-box;\n  overflow-y: auto;\n  overflow-x: hidden;\n  padding: 14px 12px 20px;\n  scrollbar-width: thin;\n  scrollbar-color: #8aa0b8 #eaf1fa;\n  scrollbar-gutter: stable;\n}\n.form-flow--grouped.form-flow--menu-overflow,\n.form-flow--grouped.form-flow--menu-overflow .form-flow__body {\n  overflow: visible;\n}\n.form-flow--grouped .form-flow__track {\n  display: grid;\n  gap: 12px;\n  height: auto;\n  min-height: 0;\n  padding: 0;\n  transition: none;\n  will-change: auto;\n}\n.form-flow--grouped .form-flow__slide {\n  min-width: 0;\n  min-height: 0;\n  overflow: visible;\n  contain: none;\n  border: 1px solid var(--form-flow-panel-border);\n  border-radius: 12px;\n  background: var(--form-flow-panel-bg);\n}\n.form-flow--grouped .form-flow__slide--plain {\n  border: 0;\n  border-radius: 0;\n  background: transparent;\n}\n.form-flow--grouped .form-flow__slide[data-step-id=basics] {\n  border-color: var(--form-flow-primary-panel-border);\n  background: var(--form-flow-primary-panel-bg);\n}\n.form-flow--grouped .form-flow__slide[data-step-id=lifestyle] {\n  border-color: rgba(49, 124, 82, 0.28);\n  background:\n    linear-gradient(\n      180deg,\n      #eef8f3 0%,\n      #e4f2ea 100%);\n}\n.form-flow--grouped .form-flow__slide-inner {\n  height: auto;\n  min-height: 0;\n  overflow: visible;\n  padding: 12px;\n}\n.form-flow--grouped .form-flow__slide--plain > .form-flow__slide-inner {\n  padding: 0;\n}\n.form-flow__group-header {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin: 0 0 10px;\n  padding: 0;\n  border-bottom: 0;\n  background: transparent;\n  color: #17395f;\n}\n.form-flow__group-header mat-icon {\n  width: 19px;\n  height: 19px;\n  font-size: 19px;\n  line-height: 19px;\n  color: var(--form-flow-group-icon-color);\n}\n.form-flow__group-header h3 {\n  margin: 0;\n  font-size: 14px;\n  font-weight: 900;\n}\n.form-flow__slide {\n  flex: 0 0 100%;\n  min-width: 100%;\n  min-height: 0;\n  overflow: hidden;\n  contain: layout paint style;\n  backface-visibility: hidden;\n}\n.form-flow__slide-inner {\n  position: relative;\n  box-sizing: border-box;\n  height: 100%;\n  min-height: 100%;\n  overflow: auto;\n  padding: 16px;\n  scrollbar-width: thin;\n}\n.form-flow__carousel-progress-slot {\n  position: absolute;\n  top: 18px;\n  right: 20px;\n  z-index: 6;\n}\n.form-flow__carousel-progress-slot .form-flow__progress {\n  min-width: 150px;\n}\n.form-flow__carousel-head {\n  position: relative;\n  z-index: 7;\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 18px;\n  min-height: 50px;\n  padding: 8px 12px 7px;\n  background: #ffffff;\n}\n.form-flow__step-badge {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  max-width: min(360px, 60%);\n  min-height: 34px;\n  padding: 0 14px;\n  border: 1px solid #b8d1f0;\n  border-radius: 999px;\n  background: #eef6ff;\n  color: #244f83;\n  font-size: 12px;\n  font-weight: 800;\n  line-height: 1.25;\n  overflow: visible;\n}\n.form-flow__step-badge.is-missing {\n  border-color: #ff9b9b;\n  background: #fff1f1;\n  color: #c1262e;\n}\n.form-flow__step-badge.is-complete {\n  border-color: #8dcc9b;\n  background: #edf9f0;\n  color: #27733d;\n}\n.form-flow__step-badge mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n  flex: 0 0 auto;\n}\n.form-flow__step-badge span {\n  display: inline-block;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  line-height: 1.45;\n  padding-block: 2px;\n}\n.form-flow__slide.is-missing .form-flow__step-header {\n  border-color: #ef9a9a;\n}\n.form-flow__step-header {\n  display: grid;\n  grid-template-columns: minmax(0, 280px) minmax(0, 1fr);\n  gap: 16px;\n  margin-bottom: 14px;\n  padding: 10px;\n  border: 1px solid #c7d8ef;\n  border-radius: 10px;\n  background: #eef6ff;\n}\n.form-flow__step-header img {\n  width: 100%;\n  aspect-ratio: 16/7;\n  object-fit: cover;\n  border-radius: 8px;\n}\n.form-flow__step-header h3 {\n  margin: 0;\n  font-size: 15px;\n}\n.form-flow__step-header p {\n  margin: 6px 0 0;\n  color: #506885;\n  font-size: 13px;\n}\n.form-flow__step-title-sr {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}\n.form-flow__step-header--card {\n  display: block;\n  width: min(320px, 100%);\n  max-width: 100%;\n  padding: 0;\n  border: 0;\n  background: transparent;\n}\n.form-flow__step-header--image-card {\n  width: min(320px, 100%);\n}\n.form-flow__step-image-card,\n.form-flow__step-info-card {\n  display: block;\n  width: 100%;\n}\n.form-flow__controls {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  grid-auto-rows: max-content;\n  align-content: start;\n  align-items: start;\n  gap: 12px;\n}\n.form-flow__control {\n  position: relative;\n  min-width: 0;\n}\n.form-flow__control input,\n.form-flow__control textarea {\n  width: 100%;\n  box-sizing: border-box;\n  border: 1px solid #b9cce5;\n  border-radius: 8px;\n  background: #ffffff;\n  color: #173357;\n  font: inherit;\n  font-size: 14px;\n  outline: none;\n}\n.form-flow__control input:focus,\n.form-flow__control textarea:focus {\n  border-color: #4f83d1;\n  box-shadow: 0 0 0 3px rgba(79, 131, 209, 0.14);\n}\n.form-flow__control input:disabled,\n.form-flow__control textarea:disabled {\n  background: #edf2f8;\n  color: #7b8da5;\n}\n.form-flow__control input {\n  height: var(--form-flow-input-height, 34px);\n  min-height: var(--form-flow-input-height, 34px);\n  padding: var(--form-flow-input-padding, 0 12px);\n  line-height: 1.2;\n}\n.form-flow__control textarea {\n  min-height: var(--form-flow-control-min-height, 42px);\n  padding: var(--form-flow-control-padding, 9px 12px);\n  line-height: 1.35;\n  resize: vertical;\n}\n.form-flow__control--with-accessory {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) 34px;\n  column-gap: 12px;\n  align-items: end;\n}\n.form-flow__control--with-accessory:has(.app-menu-host--open) {\n  z-index: 20;\n}\n.form-flow__control-accessory {\n  position: relative;\n  z-index: 2;\n  align-self: end;\n  justify-self: end;\n}\n.form-flow__control-accessory:has(.app-menu-host--open) {\n  z-index: 60;\n}\n.form-flow__control--with-accessory > .form-flow__label {\n  grid-column: 1/-1;\n}\n.form-flow__control--with-accessory > :not(.form-flow__label):not(.form-flow__control-accessory) {\n  grid-column: 1;\n  min-width: 0;\n}\n.form-flow__control--with-accessory > .form-flow__control-accessory {\n  grid-column: 2;\n  grid-row: 2;\n}\n.form-flow__control-description {\n  display: block;\n  margin-top: 0.28rem;\n  color: #506885;\n  font-size: 0.76rem;\n  font-weight: 700;\n  line-height: 1.35;\n}\n.form-flow__control-error {\n  display: block;\n  margin-top: 0.28rem;\n  color: #9b3447;\n  font-size: 0.76rem;\n  font-weight: 800;\n  line-height: 1.35;\n}\n.form-flow__control--with-accessory > .form-flow__control-description {\n  grid-column: 1/-1;\n}\n.form-flow__control--with-accessory > .form-flow__control-error {\n  grid-column: 1/-1;\n}\n.form-flow__checkbox {\n  min-height: var(--form-flow-input-height, 34px);\n  display: inline-flex;\n  align-items: center;\n  gap: 0.58rem;\n  color: #233e61;\n  font-size: 0.8rem;\n  font-weight: 700;\n  cursor: pointer;\n}\n.form-flow__checkbox input[type=checkbox] {\n  flex: 0 0 17px;\n  width: 17px;\n  height: 17px;\n  min-height: 17px;\n  margin: 0;\n  padding: 0;\n  border: 0;\n  border-radius: 3px;\n  accent-color: #3477d4;\n  box-shadow: none;\n  cursor: inherit;\n}\n.form-flow__checkbox strong {\n  color: #c63838;\n  margin-left: 3px;\n}\n.form-flow__checkbox:has(input:disabled) {\n  cursor: default;\n  opacity: 0.64;\n}\n.form-flow--grouped .form-flow__controls {\n  gap: 12px 14px;\n}\n.form-flow--grouped .form-flow__control--wide {\n  grid-column: 1/-1;\n}\n.form-flow--grouped .form-flow__slide--media .form-flow__controls {\n  --form-flow-media-image-height: var(--form-flow-grouped-media-image-height, 186px);\n  grid-template-columns: minmax(320px, 400px) repeat(2, minmax(0, 1fr));\n}\n.form-flow--grouped .form-flow__slide--media .form-flow__control--image {\n  display: flex;\n  grid-column: 1;\n  grid-row: 1/span var(--form-flow-control-row-span, 3);\n  align-self: start;\n  min-height: 0;\n}\n.form-flow--grouped .form-flow__slide--media .form-flow__control--image.form-flow__control--wide {\n  grid-column: 1;\n}\n.form-flow--grouped .form-flow__slide--media .form-flow__control--image app-image-carousel {\n  --image-single-slot-height: var(--form-flow-media-image-height);\n  flex: 0 0 auto;\n  height: var(--form-flow-media-image-height);\n  min-height: 0;\n  max-width: 100%;\n}\n.form-flow--grouped .form-flow__slide--media .form-flow__control--image ~ .form-flow__control:not(.form-flow__control--half) {\n  grid-column: 2/-1;\n}\n.form-flow--grouped .form-flow__control:not(.form-flow__control--half):not(.form-flow__control--wide):last-child:nth-child(odd) {\n  grid-column: auto;\n}\n.form-flow--grouped .form-flow__control--with-accessory:not(.form-flow__control--half) {\n  grid-column: auto;\n}\n.form-flow--grouped .form-flow__control--with-accessory.form-flow__control--wide {\n  grid-column: 1/-1;\n}\n.form-flow__date-input,\n.form-flow__link-input {\n  width: 100%;\n  min-width: 0;\n}\n.form-flow__link-input {\n  --link-input-label-font-size: var(--form-flow-label-font-size, 12px);\n}\n.form-flow__control--wide {\n  grid-column: 1/-1;\n}\n.form-flow__control:not(.form-flow__control--half):last-child:nth-child(odd) {\n  grid-column: 1/-1;\n}\n.form-flow__label {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n  margin-bottom: 6px;\n  color: #233e61;\n  font-size: var(--form-flow-label-font-size, 12px);\n  font-weight: 700;\n  line-height: 1;\n}\n.form-flow__label strong {\n  color: #c63838;\n  margin-left: 3px;\n}\n.form-flow__label small {\n  color: #71839b;\n  font-size: inherit;\n  font-weight: 700;\n  line-height: 1;\n  font-variant-numeric: tabular-nums;\n}\n.form-flow__control.is-required-missing input,\n.form-flow__control.is-required-missing textarea,\n.form-flow__control.is-invalid input,\n.form-flow__control.is-invalid textarea {\n  border-color: #ef9a9a;\n  background: #fff1f1;\n}\n.form-flow__section-title,\n.form-flow__static {\n  border: 1px solid #cfdbeb;\n  border-radius: 8px;\n  background: #ffffff;\n  padding: 12px;\n}\n.form-flow__section-title h4,\n.form-flow__static h4 {\n  margin: 0;\n  font-size: 14px;\n}\n.form-flow__section-title p,\n.form-flow__static p {\n  margin: 6px 0 0;\n  color: #506885;\n  font-size: 13px;\n  line-height: 1.4;\n}\n.form-flow__summary-head {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-bottom: 12px;\n}\n.form-flow__summary-head mat-icon {\n  color: #396da9;\n}\n.form-flow__summary-head h3 {\n  margin: 0;\n  font-size: 16px;\n}\n.form-flow__summary-head p {\n  margin: 4px 0 0;\n  color: #5b6f88;\n  font-size: 13px;\n}\n.form-flow__summary-panels {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  grid-auto-rows: max-content;\n  align-content: start;\n  align-items: start;\n  gap: 12px;\n}\n.form-flow__summary-panel {\n  min-width: 0;\n  border: 1px solid #c7d8ef;\n  border-radius: 10px;\n  background: #ffffff;\n  overflow: hidden;\n}\n.form-flow__summary-panel header {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 11px 12px;\n  background: #f1f6fd;\n  border-bottom: 1px solid #d8e4f3;\n}\n.form-flow__summary-panel h4 {\n  margin: 0;\n  font-size: 13px;\n}\n.form-flow__summary-panel mat-icon {\n  color: #396da9;\n  font-size: 19px;\n  width: 19px;\n  height: 19px;\n}\n.form-flow__summary-panel dl {\n  display: grid;\n  gap: 0;\n  margin: 0;\n  padding: 2px 12px 12px;\n}\n.form-flow__summary-panel dl > div {\n  display: grid;\n  grid-template-columns: minmax(150px, 0.42fr) minmax(0, 0.58fr);\n  gap: 20px;\n  padding: 9px 0;\n  border-bottom: 1px solid #ecf1f7;\n}\n.form-flow__summary-panel dl > div:last-child {\n  border-bottom: 0;\n}\n.form-flow__summary-panel dt {\n  display: grid;\n  gap: 3px;\n  color: #60748d;\n  font-size: 12px;\n  font-weight: 900;\n  line-height: 1.3;\n}\n.form-flow__summary-panel dt small {\n  width: fit-content;\n  padding: 1px 6px;\n  border-radius: 999px;\n  background: #fff2f2;\n  color: #b42328;\n  font-size: 10px;\n  font-weight: 900;\n}\n.form-flow__summary-panel dd {\n  min-width: 0;\n  margin: 0;\n  color: #203b5d;\n  font-size: 13px;\n  overflow-wrap: anywhere;\n}\n.form-flow__summary-panel .is-empty dd {\n  color: #8a9ab0;\n}\n.form-flow__summary-panel.is-missing {\n  border-color: #ef9a9a;\n}\n.form-flow__summary-panel.is-missing header {\n  background: #fff3f3;\n  border-bottom-color: #f3c4c4;\n  color: #a73434;\n}\n.form-flow__summary-panel.is-missing mat-icon {\n  color: #b42328;\n}\n.form-flow__summary-empty {\n  margin: 0;\n  padding: 12px;\n  color: #75869d;\n  font-size: 13px;\n}\n.form-flow__footer {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 12px;\n  padding: 12px 16px;\n  border-top: 1px solid #d7e3f2;\n  background: #ffffff;\n}\n.form-flow__footer--carousel {\n  grid-template-columns: minmax(0, 1fr);\n  padding: 8px 16px 12px;\n  border-top: 0;\n}\n.form-flow__nav {\n  width: 40px;\n  height: 40px;\n  border: 1px solid #c7d8ef;\n  border-radius: 999px;\n  background: #ffffff;\n  color: #2f649f;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  transform: none;\n}\n.form-flow__nav:disabled {\n  cursor: default;\n  opacity: 0.45;\n}\n.form-flow__nav:not(:disabled):hover {\n  border-color: rgba(44, 78, 121, 0.32);\n  background: rgba(235, 246, 255, 0.98);\n  color: #204d82;\n  box-shadow: 0 10px 22px rgba(14, 34, 61, 0.28);\n}\n.form-flow__nav:not(:disabled):active {\n  transform: none;\n}\n.form-flow__nav.is-blocked,\n.form-flow__nav.is-blocked:disabled {\n  border-color: #ef9a9a;\n  background: #fff0f0;\n  color: #b42328;\n  opacity: 1;\n}\n.form-flow__slide-nav {\n  position: absolute;\n  z-index: 8;\n  top: calc(var(--form-flow-carousel-card-height) + 4px);\n  left: -6px;\n  right: -6px;\n  height: 40px;\n  min-height: 40px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  pointer-events: none;\n}\n.form-flow__slide-nav .form-flow__nav {\n  pointer-events: auto;\n  box-shadow: 0 12px 28px rgba(25, 45, 73, 0.16);\n}\n.form-flow__stage--compact-head .form-flow__slide-nav {\n  top: 66px;\n}\n.form-flow__step-nav-spacer {\n  height: 40px;\n}\n.form-flow__dots {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 6px;\n}\n.form-flow__dots button {\n  width: 9px;\n  height: 9px;\n  border: 0;\n  border-radius: 999px;\n  background: #c4d0df;\n  padding: 0;\n  cursor: pointer;\n}\n.form-flow__dots button.is-active {\n  width: 18px;\n  background: #3974b2;\n}\n.form-flow__dots button.is-missing {\n  background: #df5a5a;\n}\n.form-flow__dots button.is-active.is-missing {\n  background: #b42328;\n}\n.form-flow__dots button:disabled {\n  cursor: default;\n}\n.form-flow--carousel .form-flow__body {\n  display: flex;\n  align-items: stretch;\n  background: #ffffff;\n  overflow-x: auto;\n  overflow-y: hidden;\n  scroll-snap-type: x mandatory;\n  scroll-behavior: smooth;\n  scrollbar-width: none;\n  -ms-overflow-style: none;\n  -webkit-overflow-scrolling: touch;\n  overscroll-behavior-x: contain;\n}\n.form-flow--carousel .form-flow__body::-webkit-scrollbar {\n  display: none;\n}\n.form-flow--carousel .form-flow__track {\n  display: contents;\n  transform: none !important;\n  transition: none;\n}\n.form-flow--carousel .form-flow__slide {\n  flex: 0 0 100%;\n  width: 100%;\n  min-width: 100%;\n  max-width: 100%;\n  height: 100%;\n  min-height: 0;\n  box-sizing: border-box;\n  overflow: hidden;\n  scroll-snap-align: start;\n  scroll-snap-stop: always;\n}\n.form-flow--carousel .form-flow__slide-inner {\n  display: grid;\n  grid-template-rows: auto minmax(0, 1fr);\n  align-content: stretch;\n  height: 100%;\n  min-height: 0;\n  overflow: hidden;\n  padding: 0;\n}\n.form-flow--carousel .form-flow__slide--summary .form-flow__slide-inner {\n  display: grid;\n  grid-template-rows: minmax(0, 1fr);\n  overflow: hidden;\n  padding: 0;\n}\n.form-flow__stage--compact-head .form-flow__slide-inner {\n  grid-template-rows: minmax(0, 1fr);\n}\n.form-flow--carousel .form-flow__step-header {\n  margin-bottom: 0;\n}\n.form-flow--carousel .form-flow__step-header--card {\n  height: var(--form-flow-carousel-card-height);\n}\n.form-flow--carousel .form-flow__step-image-card,\n.form-flow--carousel .form-flow__step-info-card {\n  height: 100%;\n}\n.form-flow--carousel .form-flow__controls {\n  align-self: stretch;\n  min-height: 0;\n  margin-top: 48px;\n  padding: 10px;\n  border: 1px solid #c7d8ef;\n  border-radius: 10px;\n  background: #eaf4ff;\n  overflow-x: hidden;\n  overflow-y: auto;\n  scrollbar-width: thin;\n  scrollbar-color: #8aa0b8 #eaf1fa;\n  scrollbar-gutter: stable;\n  -webkit-overflow-scrolling: touch;\n  overscroll-behavior-y: contain;\n}\n.form-flow--carousel.form-flow--menu-overflow .form-flow__controls:has(.app-menu-host--open) {\n  position: relative;\n  z-index: 10;\n}\n.form-flow--carousel.form-flow--menu-overflow .form-flow__slide:has(.app-menu-host--open) {\n  position: relative;\n  z-index: 9;\n  contain: none;\n}\n.form-flow__stage--compact-head .form-flow__controls {\n  margin-top: 60px;\n}\n.form-flow--carousel .form-flow__summary-head {\n  display: none;\n}\n.form-flow--carousel .form-flow__summary-panels {\n  box-sizing: border-box;\n  height: calc(100% - 60px);\n  min-height: 0;\n  margin-top: 60px;\n  padding: 0 10px 12px;\n  overflow-x: hidden;\n  overflow-y: auto;\n  scrollbar-width: auto;\n  scrollbar-color: #8aa0b8 #eaf1fa;\n  scrollbar-gutter: stable;\n  -webkit-overflow-scrolling: touch;\n  overscroll-behavior-y: contain;\n}\n.form-flow--carousel .form-flow__summary-panels::-webkit-scrollbar {\n  width: 8px;\n}\n.form-flow--carousel .form-flow__summary-panels::-webkit-scrollbar-track {\n  background: #eaf1fa;\n  border-radius: 999px;\n}\n.form-flow--carousel .form-flow__summary-panels::-webkit-scrollbar-thumb {\n  background: #8aa0b8;\n  border-radius: 999px;\n}\n.form-flow__body.form-flow__body--mobile {\n  --form-flow-mobile-slide-edge-reserve: 1px;\n  display: block;\n  align-items: stretch;\n  overflow-x: auto;\n  overflow-y: hidden;\n  scroll-snap-type: x mandatory;\n  scroll-behavior: smooth;\n  scrollbar-width: none;\n  -ms-overflow-style: none;\n  -webkit-overflow-scrolling: touch;\n  overscroll-behavior-x: contain;\n}\n.form-flow__body.form-flow__body--mobile::-webkit-scrollbar {\n  display: none;\n}\n.form-flow__body--mobile .form-flow__track {\n  display: grid;\n  grid-auto-flow: column;\n  grid-auto-columns: calc(100% + var(--form-flow-mobile-slide-edge-reserve));\n  width: auto;\n  min-width: 100%;\n  align-items: stretch;\n  height: 100%;\n  min-height: 100%;\n  transform: none !important;\n  transition: none;\n  will-change: auto;\n  backface-visibility: visible;\n}\n.form-flow__body--mobile .form-flow__slide {\n  width: 100%;\n  min-width: 0;\n  height: 100%;\n  min-height: 0;\n  overflow: hidden;\n  contain: layout paint style;\n  scroll-snap-align: start;\n  scroll-snap-stop: always;\n}\n.form-flow__body--mobile .form-flow__slide-inner {\n  width: calc(100% - var(--form-flow-mobile-slide-edge-reserve));\n}\n.form-flow__loading,\n.form-flow__empty {\n  min-height: 240px;\n  display: grid;\n  place-items: center;\n  align-content: center;\n  gap: 10px;\n  color: #536a84;\n  text-align: center;\n}\n@media (max-width: 720px) {\n  .form-flow {\n    border-radius: 0;\n  }\n  .form-flow--carousel {\n    --form-flow-carousel-card-height: 250px;\n  }\n  .form-flow__header {\n    align-items: stretch;\n    flex-direction: column;\n  }\n  .form-flow__progress {\n    justify-items: stretch;\n  }\n  .form-flow__progress-track {\n    width: 100%;\n  }\n  .form-flow--carousel .form-flow__carousel-head .form-flow__progress {\n    justify-items: end;\n    margin-left: auto;\n    min-width: 150px;\n  }\n  .form-flow--carousel .form-flow__carousel-head .form-flow__progress-track {\n    width: 150px;\n  }\n  .form-flow--carousel .form-flow__carousel-head {\n    padding-right: 8px;\n    padding-left: 8px;\n  }\n  .form-flow--carousel .form-flow__slide-inner {\n    height: 100%;\n    min-height: 100%;\n    overflow-x: hidden;\n    overflow-y: hidden;\n    padding: 0;\n    -webkit-overflow-scrolling: touch;\n    overscroll-behavior-x: auto;\n    overscroll-behavior-y: auto;\n  }\n  .form-flow--carousel .form-flow__slide--summary .form-flow__slide-inner {\n    overflow: hidden;\n    padding: 0;\n  }\n  .form-flow--carousel .form-flow__summary-panels {\n    height: calc(100% - 60px);\n    margin-top: 60px;\n    padding: 0 8px 12px;\n  }\n  .form-flow--carousel .form-flow__step-header--card {\n    width: 100%;\n  }\n  .form-flow--carousel .form-flow__carousel-progress-slot {\n    top: 18px;\n    right: 18px;\n  }\n  .form-flow--carousel .form-flow__carousel-progress-slot .form-flow__progress {\n    min-width: 0;\n  }\n  .form-flow--carousel .form-flow__carousel-progress-slot .form-flow__progress-track {\n    display: none;\n  }\n  .form-flow--carousel .form-flow__controls {\n    margin-top: 48px;\n    padding: 8px;\n  }\n  .form-flow--grouped .form-flow__body {\n    padding: 12px 8px 18px;\n  }\n  .form-flow--grouped .form-flow__track {\n    padding: 0;\n  }\n  .form-flow--grouped .form-flow__slide--media .form-flow__controls {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .form-flow--grouped .form-flow__slide--media .form-flow__control--image,\n  .form-flow--grouped .form-flow__slide--media .form-flow__control--image.form-flow__control--wide,\n  .form-flow--grouped .form-flow__slide--media .form-flow__control--image ~ .form-flow__control:not(.form-flow__control--half) {\n    grid-column: 1;\n    grid-row: auto;\n  }\n  .form-flow--grouped .form-flow__slide {\n    border-radius: 10px;\n  }\n  .form-flow__controls,\n  .form-flow__summary-panels,\n  .form-flow__step-header:not(.form-flow__step-header--card) {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .form-flow__save {\n    width: 100%;\n  }\n  .form-flow__summary-panel dl > div {\n    grid-template-columns: minmax(118px, 0.46fr) minmax(0, 0.54fr);\n    gap: 10px;\n  }\n}\n/*# sourceMappingURL=form-flow.component.css.map */\n"] }]
  }], null, { flowViewportRef: [{
    type: ViewChild,
    args: ["flowViewport"]
  }], model: [{
    type: Input
  }], loading: [{
    type: Input
  }], saving: [{
    type: Input
  }], disabled: [{
    type: Input
  }], save: [{
    type: Output
  }], action: [{
    type: Output
  }], percent: [{
    type: Output
  }], onViewportResize: [{
    type: HostListener,
    args: ["window:resize"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FormFlowComponent, { className: "FormFlowComponent", filePath: "app/shared/ui/components/core/form/flow/form-flow.component.ts", lineNumber: 104 });
})();

export {
  LocationInputComponent,
  PoliciesInputComponent,
  FormFlowComponent
};
//# sourceMappingURL=chunk-F2W2FUGO.js.map
