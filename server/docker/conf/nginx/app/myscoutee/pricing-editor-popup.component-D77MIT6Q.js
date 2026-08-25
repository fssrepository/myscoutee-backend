import {
  MatSelect,
  MatSelectModule,
  PricingEditorInputComponent,
  PricingSlotPanelComponent
} from "./chunk-LTMPUKCR.js";
import {
  FormFlowPopupStore
} from "./chunk-5EHS4ACX.js";
import {
  MatDateRangeInput,
  MatDateRangePicker,
  MatDatepickerModule,
  MatDatepickerToggle,
  MatEndDate,
  MatFormField,
  MatFormFieldModule,
  MatInputModule,
  MatStartDate,
  MatSuffix,
  PopupComponent
} from "./chunk-3VXLUVWM.js";
import {
  MatNativeDateModule,
  MatOption
} from "./chunk-VEYRCVMX.js";
import "./chunk-MVR37RGJ.js";
import {
  AppMenuDispatcher,
  AppMenuOutletComponent,
  AppMenuTriggerComponent,
  DefaultValueAccessor,
  FormsModule,
  I18nPipe,
  MaxValidator,
  MinValidator,
  NgControlStatus,
  NgModel,
  NumberValueAccessor
} from "./chunk-FOAFZS65.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-EDHGCWPF.js";
import "./chunk-CUDLB52K.js";
import "./chunk-FJQMGJUW.js";
import "./chunk-HUL5TV72.js";
import "./chunk-PK4DOAMC.js";
import "./chunk-GEAUBJJD.js";
import "./chunk-5PHTFUHA.js";
import {
  PricingBuilder
} from "./chunk-F4WY6ECV.js";
import "./chunk-Q3344WPR.js";
import "./chunk-XQ4NDAVX.js";
import "./chunk-4FWVIYNI.js";
import "./chunk-7MTG4XZU.js";
import {
  CommonModule,
  DecimalPipe,
  NgTemplateOutlet
} from "./chunk-J7IJFFQ2.js";
import "./chunk-XQACYBVS.js";
import "./chunk-YKC4KBEC.js";
import "./chunk-B2DKYQGD.js";
import "./chunk-KLUOB5SD.js";
import "./chunk-6POEHVT7.js";
import "./chunk-2ENBQWLU.js";
import "./chunk-LERGHE7K.js";
import "./chunk-D6ZHKNYF.js";
import "./chunk-SKAK727J.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵInheritDefinitionFeature,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵcomponentInstance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-XJL7SWH7.js";

// src/app/shared/ui/components/core/form/inputs/pricing-editor/pricing-editor-popup/pricing-editor-popup.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function PricingEditorPopupComponent_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "aside", 6);
    \u0275\u0275elementContainer(1, 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const pricingWizardPreviewCard_r2 = \u0275\u0275reference(9);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", pricingWizardPreviewCard_r2);
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 20);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r5 = ctx.$implicit;
    \u0275\u0275property("value", option_r5);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(option_r5);
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_For_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 20);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r6 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275property("value", option_r6);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, ctx_r2.taxModeLabel(option_r6)));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_For_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 20);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r7 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275property("value", option_r7);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, ctx_r2.chargeTypeLabel(option_r7)));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_For_65_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 20);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r8 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275property("value", option_r8);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, ctx_r2.roundingLabel(option_r8)));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_66_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 26);
    \u0275\u0275listener("click", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_66_Conditional_5_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.toggleQuantityRulesEnabled());
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
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("is-on", ctx_r2.workingPricing.quantityRulesEnabled);
    \u0275\u0275property("disabled", ctx_r2.readOnly);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.workingPricing.quantityRulesEnabled ? "toggle_on" : "toggle_off");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 5, ctx_r2.workingPricing.quantityRulesEnabled ? "on" : "off"));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_66_Conditional_6_For_2_For_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 20);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r13 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(6);
    \u0275\u0275property("value", option_r13);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, ctx_r2.actionLabel(option_r13)));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_66_Conditional_6_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 28)(1, "div", 30)(2, "label", 17)(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 31)(7, "span");
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "i18n");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "label", 17)(11, "span");
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "input", 32);
    \u0275\u0275listener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_66_Conditional_6_For_2_Template_input_ngModelChange_14_listener($event) {
      const rule_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.onQuantityRuleMinChange(rule_r12, $event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "label", 17)(16, "span");
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div", 18)(20, "mat-select", 19);
    \u0275\u0275twoWayListener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_66_Conditional_6_For_2_Template_mat_select_ngModelChange_20_listener($event) {
      const rule_r12 = \u0275\u0275restoreView(_r11).$implicit;
      \u0275\u0275twoWayBindingSet(rule_r12.action.kind, $event) || (rule_r12.action.kind = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_66_Conditional_6_For_2_Template_mat_select_ngModelChange_20_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.emitPricing());
    });
    \u0275\u0275repeaterCreate(21, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_66_Conditional_6_For_2_For_22_Template, 3, 4, "mat-option", 20, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(23, "label", 17)(24, "span");
    \u0275\u0275text(25);
    \u0275\u0275pipe(26, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "input", 15);
    \u0275\u0275listener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_66_Conditional_6_For_2_Template_input_ngModelChange_27_listener($event) {
      const rule_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.onQuantityRuleActionValueChange(rule_r12, $event));
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(28, "button", 33);
    \u0275\u0275pipe(29, "i18n");
    \u0275\u0275listener("click", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_66_Conditional_6_For_2_Template_button_click_28_listener() {
      const $index_r14 = \u0275\u0275restoreView(_r11).$index;
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.removeQuantityRule($index_r14));
    });
    \u0275\u0275elementStart(30, "mat-icon");
    \u0275\u0275text(31, "delete");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const rule_r12 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 14, "if"));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(9, 16, ctx_r2.quantityThresholdLabel()));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(13, 18, "quantity"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", rule_r12.minQuantity)("disabled", ctx_r2.readOnly);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(18, 20, "then"));
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", rule_r12.action.kind);
    \u0275\u0275property("disabled", ctx_r2.readOnly)("panelWidth", null);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.actionKindOptions);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(26, 22, "value"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", rule_r12.action.value)("disabled", ctx_r2.readOnly);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r2.readOnly);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(29, 24, "pricing.quantity.rule.remove.aria"));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_66_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 27);
    \u0275\u0275repeaterCreate(1, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_66_Conditional_6_For_2_Template, 32, 26, "article", 28, \u0275\u0275componentInstance().trackByRule, true);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 29);
    \u0275\u0275listener("click", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_66_Conditional_6_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.addQuantityRule());
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
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.workingPricing.quantityRules);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.readOnly);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 2, "pricing.quantity.rule.add"));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_66_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 25);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r2.quantityDisabledHint()));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_66_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 10)(1, "div", 23)(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_66_Conditional_5_Template, 6, 7, "button", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_66_Conditional_6_Template, 9, 4)(7, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_66_Conditional_7_Template, 3, 3, "p", 25);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 3, "pricing.quantity.rules"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.showToggleControl() ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.workingPricing.quantityRulesEnabled ? 6 : 7);
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_67_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 26);
    \u0275\u0275listener("click", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_67_Conditional_5_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.toggleDemandRulesEnabled());
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
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("is-on", ctx_r2.workingPricing.demandRulesEnabled);
    \u0275\u0275property("disabled", ctx_r2.readOnly);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.workingPricing.demandRulesEnabled ? "toggle_on" : "toggle_off");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 5, ctx_r2.workingPricing.demandRulesEnabled ? "on" : "off"));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_67_Conditional_6_For_2_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 20);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r19 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(6);
    \u0275\u0275property("value", option_r19);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind1(2, 3, "pricing.capacity.filled"), " ", ctx_r2.operatorLabel(option_r19));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_67_Conditional_6_For_2_For_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 20);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r20 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(6);
    \u0275\u0275property("value", option_r20);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, ctx_r2.actionLabel(option_r20)));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_67_Conditional_6_For_2_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 17)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "app-menu-trigger", 35);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const rule_r18 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 6, "pricing.applies.to"));
    \u0275\u0275advance(2);
    \u0275\u0275property("menuId", ctx_r2.ruleScopeMenuId("demand", rule_r18))("title", ctx_r2.ruleScopeMenuTitle("demand"))("trigger", ctx_r2.ruleScopeMenuTrigger("demand", rule_r18))("items", ctx_r2.ruleScopeMenuItems("demand", rule_r18))("closeOnSelect", false);
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_67_Conditional_6_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 28)(1, "div", 30)(2, "label", 17)(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 18)(7, "mat-select", 19);
    \u0275\u0275twoWayListener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_67_Conditional_6_For_2_Template_mat_select_ngModelChange_7_listener($event) {
      const rule_r18 = \u0275\u0275restoreView(_r17).$implicit;
      \u0275\u0275twoWayBindingSet(rule_r18.operator, $event) || (rule_r18.operator = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_67_Conditional_6_For_2_Template_mat_select_ngModelChange_7_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.emitPricing());
    });
    \u0275\u0275repeaterCreate(8, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_67_Conditional_6_For_2_For_9_Template, 3, 5, "mat-option", 20, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "label", 17)(11, "span");
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "input", 34);
    \u0275\u0275listener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_67_Conditional_6_For_2_Template_input_ngModelChange_14_listener($event) {
      const rule_r18 = \u0275\u0275restoreView(_r17).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.onDemandRuleThresholdChange(rule_r18, $event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "label", 17)(16, "span");
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div", 18)(20, "mat-select", 19);
    \u0275\u0275twoWayListener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_67_Conditional_6_For_2_Template_mat_select_ngModelChange_20_listener($event) {
      const rule_r18 = \u0275\u0275restoreView(_r17).$implicit;
      \u0275\u0275twoWayBindingSet(rule_r18.action.kind, $event) || (rule_r18.action.kind = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_67_Conditional_6_For_2_Template_mat_select_ngModelChange_20_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.emitPricing());
    });
    \u0275\u0275repeaterCreate(21, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_67_Conditional_6_For_2_For_22_Template, 3, 4, "mat-option", 20, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(23, "label", 17)(24, "span");
    \u0275\u0275text(25);
    \u0275\u0275pipe(26, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "input", 15);
    \u0275\u0275listener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_67_Conditional_6_For_2_Template_input_ngModelChange_27_listener($event) {
      const rule_r18 = \u0275\u0275restoreView(_r17).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.onDemandRuleActionValueChange(rule_r18, $event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(28, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_67_Conditional_6_For_2_Conditional_28_Template, 5, 8, "label", 17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "button", 33);
    \u0275\u0275pipe(30, "i18n");
    \u0275\u0275listener("click", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_67_Conditional_6_For_2_Template_button_click_29_listener() {
      const $index_r21 = \u0275\u0275restoreView(_r17).$index;
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.removeDemandRule($index_r21));
    });
    \u0275\u0275elementStart(31, "mat-icon");
    \u0275\u0275text(32, "delete");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const rule_r18 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275classProp("pricing-editor__rule-grid--slots", ctx_r2.resolvedConfig.allowSlotFeatures);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 19, "if"));
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", rule_r18.operator);
    \u0275\u0275property("disabled", ctx_r2.readOnly)("panelWidth", null);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.demandOperatorOptions);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(13, 21, "pricing.capacity.percent"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", rule_r18.capacityFilledPercent)("disabled", ctx_r2.readOnly);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(18, 23, "then"));
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", rule_r18.action.kind);
    \u0275\u0275property("disabled", ctx_r2.readOnly)("panelWidth", null);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.actionKindOptions);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(26, 25, "value"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", rule_r18.action.value)("disabled", ctx_r2.readOnly);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.resolvedConfig.allowSlotFeatures ? 28 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r2.readOnly);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(30, 27, "pricing.demand.rule.remove.aria"));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_67_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 27);
    \u0275\u0275repeaterCreate(1, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_67_Conditional_6_For_2_Template, 33, 29, "article", 28, \u0275\u0275componentInstance().trackByRule, true);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 29);
    \u0275\u0275listener("click", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_67_Conditional_6_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.addDemandRule());
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
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.workingPricing.demandRules);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.readOnly);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 2, "pricing.demand.rule.add"));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_67_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 25);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "pricing.demand.disabled.hint"));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_67_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 10)(1, "div", 23)(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_67_Conditional_5_Template, 6, 7, "button", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_67_Conditional_6_Template, 9, 4)(7, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_67_Conditional_7_Template, 3, 3, "p", 25);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 3, "pricing.demand.rules"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.showToggleControl() ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.workingPricing.demandRulesEnabled ? 6 : 7);
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 26);
    \u0275\u0275listener("click", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Conditional_5_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r22);
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.toggleTimeRulesEnabled());
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
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("is-on", ctx_r2.workingPricing.timeRulesEnabled);
    \u0275\u0275property("disabled", ctx_r2.readOnly);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.workingPricing.timeRulesEnabled ? "toggle_on" : "toggle_off");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 5, ctx_r2.workingPricing.timeRulesEnabled ? "on" : "off"));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Conditional_6_For_2_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 20);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r26 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(6);
    \u0275\u0275property("value", option_r26);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, ctx_r2.timeTriggerLabel(option_r26)));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Conditional_6_For_2_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 37)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "mat-form-field", 41)(5, "mat-date-range-input", 42)(6, "input", 43);
    \u0275\u0275pipe(7, "i18n");
    \u0275\u0275listener("dateChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Conditional_6_For_2_Conditional_10_Template_input_dateChange_6_listener($event) {
      \u0275\u0275restoreView(_r27);
      const rule_r25 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.onTimeRuleRangeStartChange(rule_r25, $event.value));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "input", 44);
    \u0275\u0275pipe(9, "i18n");
    \u0275\u0275listener("dateChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Conditional_6_For_2_Conditional_10_Template_input_dateChange_8_listener($event) {
      \u0275\u0275restoreView(_r27);
      const rule_r25 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.onTimeRuleRangeEndChange(rule_r25, $event.value));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275element(10, "mat-datepicker-toggle", 45)(11, "mat-date-range-picker", null, 3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const timeRuleRangePicker_r28 = \u0275\u0275reference(12);
    const rule_r25 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 9, "date.range"));
    \u0275\u0275advance(3);
    \u0275\u0275property("rangePicker", timeRuleRangePicker_r28);
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r2.timeRuleRangeStartDate(rule_r25))("disabled", ctx_r2.readOnly)("placeholder", \u0275\u0275pipeBind1(7, 11, "start.date"));
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r2.timeRuleRangeEndDate(rule_r25))("disabled", ctx_r2.readOnly)("placeholder", \u0275\u0275pipeBind1(9, 13, "end.date"));
    \u0275\u0275advance(2);
    \u0275\u0275property("for", timeRuleRangePicker_r28);
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Conditional_6_For_2_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r29 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 38)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "input", 46);
    \u0275\u0275listener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Conditional_6_For_2_Conditional_11_Template_input_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r29);
      const rule_r25 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.onTimeRuleOffsetChange(rule_r25, $event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const rule_r25 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 3, "offset"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", rule_r25.offsetValue ?? "")("disabled", ctx_r2.readOnly);
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Conditional_6_For_2_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 20);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r30 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(6);
    \u0275\u0275property("value", option_r30);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, ctx_r2.actionLabel(option_r30)));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Conditional_6_For_2_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 17)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "app-menu-trigger", 35);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const rule_r25 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 6, "pricing.applies.to"));
    \u0275\u0275advance(2);
    \u0275\u0275property("menuId", ctx_r2.ruleScopeMenuId("time", rule_r25))("title", ctx_r2.ruleScopeMenuTitle("time"))("trigger", ctx_r2.ruleScopeMenuTrigger("time", rule_r25))("items", ctx_r2.ruleScopeMenuItems("time", rule_r25))("closeOnSelect", false);
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Conditional_6_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r24 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 28)(1, "div", 30)(2, "label", 36)(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 18)(7, "mat-select", 19);
    \u0275\u0275twoWayListener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Conditional_6_For_2_Template_mat_select_ngModelChange_7_listener($event) {
      const rule_r25 = \u0275\u0275restoreView(_r24).$implicit;
      \u0275\u0275twoWayBindingSet(rule_r25.trigger, $event) || (rule_r25.trigger = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Conditional_6_For_2_Template_mat_select_ngModelChange_7_listener() {
      \u0275\u0275restoreView(_r24);
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.emitPricing());
    });
    \u0275\u0275repeaterCreate(8, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Conditional_6_For_2_For_9_Template, 3, 4, "mat-option", 20, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(10, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Conditional_6_For_2_Conditional_10_Template, 13, 15, "label", 37)(11, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Conditional_6_For_2_Conditional_11_Template, 5, 5, "label", 38);
    \u0275\u0275elementStart(12, "label", 39)(13, "span");
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "div", 18)(17, "mat-select", 19);
    \u0275\u0275twoWayListener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Conditional_6_For_2_Template_mat_select_ngModelChange_17_listener($event) {
      const rule_r25 = \u0275\u0275restoreView(_r24).$implicit;
      \u0275\u0275twoWayBindingSet(rule_r25.action.kind, $event) || (rule_r25.action.kind = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Conditional_6_For_2_Template_mat_select_ngModelChange_17_listener() {
      \u0275\u0275restoreView(_r24);
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.emitPricing());
    });
    \u0275\u0275repeaterCreate(18, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Conditional_6_For_2_For_19_Template, 3, 4, "mat-option", 20, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "label", 40)(21, "span");
    \u0275\u0275text(22);
    \u0275\u0275pipe(23, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "input", 15);
    \u0275\u0275listener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Conditional_6_For_2_Template_input_ngModelChange_24_listener($event) {
      const rule_r25 = \u0275\u0275restoreView(_r24).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.onTimeRuleActionValueChange(rule_r25, $event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(25, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Conditional_6_For_2_Conditional_25_Template, 5, 8, "label", 17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "button", 33);
    \u0275\u0275pipe(27, "i18n");
    \u0275\u0275listener("click", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Conditional_6_For_2_Template_button_click_26_listener() {
      const $index_r31 = \u0275\u0275restoreView(_r24).$index;
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.removeTimeRule($index_r31));
    });
    \u0275\u0275elementStart(28, "mat-icon");
    \u0275\u0275text(29, "delete");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const rule_r25 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275classProp("pricing-editor__rule-grid--time", rule_r25.trigger !== "specific_date")("pricing-editor__rule-grid--slots", ctx_r2.resolvedConfig.allowSlotFeatures)("pricing-editor__rule-grid--time-date-desktop", rule_r25.trigger === "specific_date");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 21, "if"));
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", rule_r25.trigger);
    \u0275\u0275property("disabled", ctx_r2.readOnly)("panelWidth", null);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.timeTriggerOptions);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(rule_r25.trigger === "specific_date" ? 10 : 11);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(15, 23, "then"));
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", rule_r25.action.kind);
    \u0275\u0275property("disabled", ctx_r2.readOnly)("panelWidth", null);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.actionKindOptions);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(23, 25, "value"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", rule_r25.action.value)("disabled", ctx_r2.readOnly);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.resolvedConfig.allowSlotFeatures ? 25 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r2.readOnly);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(27, 27, "pricing.time.rule.remove.aria"));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 27);
    \u0275\u0275repeaterCreate(1, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Conditional_6_For_2_Template, 30, 29, "article", 28, \u0275\u0275componentInstance().trackByRule, true);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 29);
    \u0275\u0275listener("click", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Conditional_6_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r23);
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.addTimeRule());
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
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.workingPricing.timeRules);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.readOnly);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 2, "pricing.time.rule.add"));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 25);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "pricing.time.disabled.hint"));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 10)(1, "div", 23)(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Conditional_5_Template, 6, 7, "button", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Conditional_6_Template, 9, 4)(7, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Conditional_7_Template, 3, 3, "p", 25);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 3, "pricing.time.rules"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.showToggleControl() ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.workingPricing.timeRulesEnabled ? 6 : 7);
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_69_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r32 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 26);
    \u0275\u0275listener("click", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_69_Conditional_5_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r32);
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.toggleCancellationPolicyEnabled());
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
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("is-on", ctx_r2.workingPricing.cancellationPolicy.enabled);
    \u0275\u0275property("disabled", ctx_r2.readOnly);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.workingPricing.cancellationPolicy.enabled ? "toggle_on" : "toggle_off");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 5, ctx_r2.workingPricing.cancellationPolicy.enabled ? "on" : "off"));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_69_Conditional_6_For_2_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 20);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r36 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(6);
    \u0275\u0275property("value", option_r36);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, ctx_r2.cancellationUnitLabel(option_r36)));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_69_Conditional_6_For_2_For_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 20);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r37 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(6);
    \u0275\u0275property("value", option_r37);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, ctx_r2.cancellationRefundKindLabel(option_r37)));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_69_Conditional_6_For_2_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r38 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 50);
    \u0275\u0275listener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_69_Conditional_6_For_2_Conditional_27_Template_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r38);
      const rule_r35 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.onCancellationRuleRefundValueChange(rule_r35, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const rule_r35 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275property("step", rule_r35.refundKind === "percent" ? "1" : "0.01")("ngModel", rule_r35.refundValue ?? "")("disabled", ctx_r2.readOnly);
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_69_Conditional_6_For_2_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "input", 49);
    \u0275\u0275pipe(1, "i18n");
  }
  if (rf & 2) {
    const rule_r35 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275property("value", \u0275\u0275pipeBind1(1, 1, ctx_r2.cancellationRuleValueSuffix(rule_r35)));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_69_Conditional_6_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r34 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 28)(1, "div", 47)(2, "label", 17)(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 18)(7, "mat-select", 19);
    \u0275\u0275twoWayListener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_69_Conditional_6_For_2_Template_mat_select_ngModelChange_7_listener($event) {
      const rule_r35 = \u0275\u0275restoreView(_r34).$implicit;
      \u0275\u0275twoWayBindingSet(rule_r35.offsetUnit, $event) || (rule_r35.offsetUnit = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_69_Conditional_6_For_2_Template_mat_select_ngModelChange_7_listener() {
      \u0275\u0275restoreView(_r34);
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.emitPricing());
    });
    \u0275\u0275repeaterCreate(8, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_69_Conditional_6_For_2_For_9_Template, 3, 4, "mat-option", 20, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "label", 17)(11, "span");
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "input", 46);
    \u0275\u0275listener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_69_Conditional_6_For_2_Template_input_ngModelChange_14_listener($event) {
      const rule_r35 = \u0275\u0275restoreView(_r34).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.onCancellationRuleOffsetChange(rule_r35, $event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "label", 17)(16, "span");
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div", 18)(20, "mat-select", 19);
    \u0275\u0275listener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_69_Conditional_6_For_2_Template_mat_select_ngModelChange_20_listener($event) {
      const rule_r35 = \u0275\u0275restoreView(_r34).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.onCancellationRuleRefundKindChange(rule_r35, $event));
    });
    \u0275\u0275repeaterCreate(21, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_69_Conditional_6_For_2_For_22_Template, 3, 4, "mat-option", 20, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(23, "label", 17)(24, "span");
    \u0275\u0275text(25);
    \u0275\u0275pipe(26, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(27, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_69_Conditional_6_For_2_Conditional_27_Template, 1, 3, "input", 48)(28, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_69_Conditional_6_For_2_Conditional_28_Template, 2, 3, "input", 49);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "button", 33);
    \u0275\u0275pipe(30, "i18n");
    \u0275\u0275listener("click", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_69_Conditional_6_For_2_Template_button_click_29_listener() {
      const $index_r39 = \u0275\u0275restoreView(_r34).$index;
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.removeCancellationRule($index_r39));
    });
    \u0275\u0275elementStart(31, "mat-icon");
    \u0275\u0275text(32, "delete");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const rule_r35 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 15, "pricing.notice.window"));
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", rule_r35.offsetUnit);
    \u0275\u0275property("disabled", ctx_r2.readOnly)("panelWidth", null);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.cancellationUnitOptions);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(13, 17, "value"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", rule_r35.offsetValue ?? "")("disabled", ctx_r2.readOnly);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(18, 19, "refund"));
    \u0275\u0275advance(3);
    \u0275\u0275property("ngModel", rule_r35.refundKind)("disabled", ctx_r2.readOnly)("panelWidth", null);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.cancellationRefundKindOptions);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(26, 21, "pricing.refund.value"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.cancellationRuleNeedsValue(rule_r35) ? 27 : 28);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.readOnly);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(30, 23, "pricing.cancellation.rule.remove.aria"));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_69_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r33 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 27);
    \u0275\u0275repeaterCreate(1, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_69_Conditional_6_For_2_Template, 33, 25, "article", 28, \u0275\u0275componentInstance().trackByRule, true);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 29);
    \u0275\u0275listener("click", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_69_Conditional_6_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r33);
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.addCancellationRule());
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
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.workingPricing.cancellationPolicy.rules);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.readOnly);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 2, "pricing.cancellation.rule.add"));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_69_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 25);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "pricing.cancellation.disabled.hint"));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_69_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 10)(1, "div", 23)(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_69_Conditional_5_Template, 6, 7, "button", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_69_Conditional_6_Template, 9, 4)(7, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_69_Conditional_7_Template, 3, 3, "p", 25);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 3, "pricing.cancellation.title"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.showToggleControl() ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.workingPricing.cancellationPolicy.enabled ? 6 : 7);
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_70_Template(rf, ctx) {
  if (rf & 1) {
    const _r40 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-pricing-slot-panel", 51);
    \u0275\u0275listener("enabledChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_70_Template_app_pricing_slot_panel_enabledChange_0_listener($event) {
      \u0275\u0275restoreView(_r40);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.onSlotPricingEnabledChange($event));
    })("overridesChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_70_Template_app_pricing_slot_panel_overridesChange_0_listener($event) {
      \u0275\u0275restoreView(_r40);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.onSlotOverridesChange($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275property("enabled", ctx_r2.workingPricing.slotPricingEnabled)("overrides", ctx_r2.workingPricing.slotOverrides)("slotCatalog", ctx_r2.resolvedConfig.slotCatalog)("currency", ctx_r2.workingPricing.currency)("readOnly", ctx_r2.readOnly);
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_71_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r41 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 26);
    \u0275\u0275listener("click", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_71_Conditional_5_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r41);
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.toggleAudienceEnabled());
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
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("is-on", ctx_r2.workingPricing.audience.enabled);
    \u0275\u0275property("disabled", ctx_r2.readOnly);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.workingPricing.audience.enabled ? "toggle_on" : "toggle_off");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 5, ctx_r2.workingPricing.audience.enabled ? "on" : "off"));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_71_Conditional_6_For_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 20);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r43 = ctx.$implicit;
    \u0275\u0275property("value", option_r43);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(option_r43);
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_71_Conditional_6_For_36_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 20);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r46 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(6);
    \u0275\u0275property("value", option_r46);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, ctx_r2.actionLabel(option_r46)));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_71_Conditional_6_For_36_Template(rf, ctx) {
  if (rf & 1) {
    const _r44 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 53)(1, "label", 17)(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "input", 54);
    \u0275\u0275listener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_71_Conditional_6_For_36_Template_input_ngModelChange_5_listener($event) {
      const promo_r45 = \u0275\u0275restoreView(_r44).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.onPromoCodeTextChange(promo_r45, $event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "label", 17)(7, "span");
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 18)(11, "mat-select", 19);
    \u0275\u0275twoWayListener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_71_Conditional_6_For_36_Template_mat_select_ngModelChange_11_listener($event) {
      const promo_r45 = \u0275\u0275restoreView(_r44).$implicit;
      \u0275\u0275twoWayBindingSet(promo_r45.action.kind, $event) || (promo_r45.action.kind = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_71_Conditional_6_For_36_Template_mat_select_ngModelChange_11_listener() {
      \u0275\u0275restoreView(_r44);
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.emitPricing());
    });
    \u0275\u0275repeaterCreate(12, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_71_Conditional_6_For_36_For_13_Template, 3, 4, "mat-option", 20, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "label", 17)(15, "span");
    \u0275\u0275text(16);
    \u0275\u0275pipe(17, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "input", 15);
    \u0275\u0275listener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_71_Conditional_6_For_36_Template_input_ngModelChange_18_listener($event) {
      const promo_r45 = \u0275\u0275restoreView(_r44).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.onPromoCodeActionValueChange(promo_r45, $event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "button", 33);
    \u0275\u0275pipe(20, "i18n");
    \u0275\u0275listener("click", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_71_Conditional_6_For_36_Template_button_click_19_listener() {
      const $index_r47 = \u0275\u0275restoreView(_r44).$index;
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.removePromoCode($index_r47));
    });
    \u0275\u0275elementStart(21, "mat-icon");
    \u0275\u0275text(22, "delete");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const promo_r45 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 12, "pricing.promo.code"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", promo_r45.code)("disabled", ctx_r2.readOnly);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(9, 14, "pricing.effect"));
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", promo_r45.action.kind);
    \u0275\u0275property("disabled", ctx_r2.readOnly)("panelWidth", null);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.actionKindOptions);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(17, 16, "value"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", promo_r45.action.value)("disabled", ctx_r2.readOnly);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r2.readOnly);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(20, 18, "pricing.promo.remove.aria"));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_71_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r42 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 47)(1, "label", 12)(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 13)(6, "span", 14);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "input", 15);
    \u0275\u0275listener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_71_Conditional_6_Template_input_ngModelChange_8_listener($event) {
      \u0275\u0275restoreView(_r42);
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.onAudienceMoneyFieldChange("memberPrice", $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 16);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "label", 12)(12, "span");
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 13)(16, "span", 14);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "input", 15);
    \u0275\u0275listener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_71_Conditional_6_Template_input_ngModelChange_18_listener($event) {
      \u0275\u0275restoreView(_r42);
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.onAudienceMoneyFieldChange("vipPrice", $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span", 16);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "label", 17)(22, "span");
    \u0275\u0275text(23);
    \u0275\u0275pipe(24, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "input", 34);
    \u0275\u0275listener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_71_Conditional_6_Template_input_ngModelChange_25_listener($event) {
      \u0275\u0275restoreView(_r42);
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.onAudienceDiscountChange($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "label", 17)(27, "span");
    \u0275\u0275text(28);
    \u0275\u0275pipe(29, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "div", 18)(31, "mat-select", 19);
    \u0275\u0275twoWayListener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_71_Conditional_6_Template_mat_select_ngModelChange_31_listener($event) {
      \u0275\u0275restoreView(_r42);
      const ctx_r2 = \u0275\u0275nextContext(4);
      \u0275\u0275twoWayBindingSet(ctx_r2.workingPricing.audience.soldOutLabel, $event) || (ctx_r2.workingPricing.audience.soldOutLabel = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_71_Conditional_6_Template_mat_select_ngModelChange_31_listener() {
      \u0275\u0275restoreView(_r42);
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.onStringFieldChange());
    });
    \u0275\u0275repeaterCreate(32, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_71_Conditional_6_For_33_Template, 2, 2, "mat-option", 20, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(34, "div", 52);
    \u0275\u0275repeaterCreate(35, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_71_Conditional_6_For_36_Template, 23, 20, "article", 53, \u0275\u0275componentInstance().trackByRule, true);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "button", 29);
    \u0275\u0275listener("click", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_71_Conditional_6_Template_button_click_37_listener() {
      \u0275\u0275restoreView(_r42);
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.addPromoCode());
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
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 19, "pricing.member.price"));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r2.currencySymbol(ctx_r2.workingPricing.currency));
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r2.workingPricing.audience.memberPrice ?? "")("disabled", ctx_r2.readOnly);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.workingPricing.currency);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(14, 21, "pricing.vip.price"));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r2.currencySymbol(ctx_r2.workingPricing.currency));
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r2.workingPricing.audience.vipPrice ?? "")("disabled", ctx_r2.readOnly);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.workingPricing.currency);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(24, 23, "pricing.invite.discount.percent"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", ctx_r2.workingPricing.audience.inviteOnlyDiscountPercent ?? "")("disabled", ctx_r2.readOnly);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(29, 25, "pricing.sold.out.label"));
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.workingPricing.audience.soldOutLabel);
    \u0275\u0275property("disabled", ctx_r2.readOnly)("panelWidth", null);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.soldOutLabelOptions);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r2.workingPricing.audience.promoCodes);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.readOnly);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(42, 27, "pricing.promo.add"));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_71_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 25);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "pricing.audience.disabled.hint"));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_71_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 10)(1, "div", 23)(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_71_Conditional_5_Template, 6, 7, "button", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_71_Conditional_6_Template, 43, 29)(7, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_71_Conditional_7_Template, 3, 3, "p", 25);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 3, "pricing.audience.title"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.showToggleControl() ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.workingPricing.audience.enabled ? 6 : 7);
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 10)(1, "div", 11)(2, "label", 12)(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 13)(7, "span", 14);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "input", 15);
    \u0275\u0275listener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Template_input_ngModelChange_9_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onBasePriceChange($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span", 16);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "label", 17)(13, "span");
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "div", 18)(17, "mat-select", 19);
    \u0275\u0275twoWayListener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Template_mat_select_ngModelChange_17_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.workingPricing.currency, $event) || (ctx_r2.workingPricing.currency = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Template_mat_select_ngModelChange_17_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onStringFieldChange());
    });
    \u0275\u0275repeaterCreate(18, PricingEditorPopupComponent_Conditional_0_ng_template_6_For_19_Template, 2, 2, "mat-option", 20, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "label", 17)(21, "span");
    \u0275\u0275text(22);
    \u0275\u0275pipe(23, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div", 18)(25, "mat-select", 19);
    \u0275\u0275twoWayListener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Template_mat_select_ngModelChange_25_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.workingPricing.taxMode, $event) || (ctx_r2.workingPricing.taxMode = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Template_mat_select_ngModelChange_25_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onStringFieldChange());
    });
    \u0275\u0275repeaterCreate(26, PricingEditorPopupComponent_Conditional_0_ng_template_6_For_27_Template, 3, 4, "mat-option", 20, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(28, "label", 17)(29, "span");
    \u0275\u0275text(30);
    \u0275\u0275pipe(31, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "div", 18)(33, "mat-select", 19);
    \u0275\u0275twoWayListener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Template_mat_select_ngModelChange_33_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.workingPricing.chargeType, $event) || (ctx_r2.workingPricing.chargeType = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Template_mat_select_ngModelChange_33_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onStringFieldChange());
    });
    \u0275\u0275repeaterCreate(34, PricingEditorPopupComponent_Conditional_0_ng_template_6_For_35_Template, 3, 4, "mat-option", 20, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(36, "label", 12)(37, "span");
    \u0275\u0275text(38);
    \u0275\u0275pipe(39, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "div", 13)(41, "span", 14);
    \u0275\u0275text(42);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "input", 21);
    \u0275\u0275pipe(44, "i18n");
    \u0275\u0275listener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Template_input_ngModelChange_43_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onNullableMoneyFieldChange("minPrice", $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "span", 16);
    \u0275\u0275text(46);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(47, "label", 12)(48, "span");
    \u0275\u0275text(49);
    \u0275\u0275pipe(50, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(51, "div", 13)(52, "span", 14);
    \u0275\u0275text(53);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "input", 21);
    \u0275\u0275pipe(55, "i18n");
    \u0275\u0275listener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Template_input_ngModelChange_54_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onNullableMoneyFieldChange("maxPrice", $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(56, "span", 16);
    \u0275\u0275text(57);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(58, "label", 17)(59, "span");
    \u0275\u0275text(60);
    \u0275\u0275pipe(61, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(62, "div", 18)(63, "mat-select", 19);
    \u0275\u0275twoWayListener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Template_mat_select_ngModelChange_63_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.workingPricing.rounding, $event) || (ctx_r2.workingPricing.rounding = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function PricingEditorPopupComponent_Conditional_0_ng_template_6_Template_mat_select_ngModelChange_63_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onStringFieldChange());
    });
    \u0275\u0275repeaterCreate(64, PricingEditorPopupComponent_Conditional_0_ng_template_6_For_65_Template, 3, 4, "mat-option", 20, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275conditionalCreate(66, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_66_Template, 8, 5, "section", 10);
    \u0275\u0275conditionalCreate(67, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_67_Template, 8, 5, "section", 10);
    \u0275\u0275conditionalCreate(68, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_68_Template, 8, 5, "section", 10);
    \u0275\u0275conditionalCreate(69, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_69_Template, 8, 5, "section", 10);
    \u0275\u0275conditionalCreate(70, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_70_Template, 1, 5, "app-pricing-slot-panel", 22);
    \u0275\u0275conditionalCreate(71, PricingEditorPopupComponent_Conditional_0_ng_template_6_Conditional_71_Template, 8, 5, "section", 10);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 39, ctx_r2.basePriceFieldLabel()));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r2.currencySymbol(ctx_r2.workingPricing.currency));
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r2.workingPricing.basePrice)("disabled", ctx_r2.readOnly);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.workingPricing.currency);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(15, 41, "currency"));
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.workingPricing.currency);
    \u0275\u0275property("disabled", ctx_r2.readOnly)("panelWidth", null);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.currencyOptions);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(23, 43, "tax"));
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.workingPricing.taxMode);
    \u0275\u0275property("disabled", ctx_r2.readOnly)("panelWidth", null);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.taxModeOptions);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(31, 45, ctx_r2.chargeTypeFieldLabel()));
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.workingPricing.chargeType);
    \u0275\u0275property("disabled", ctx_r2.readOnly)("panelWidth", null);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.resolvedConfig.chargeTypeOptions);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(39, 47, ctx_r2.minimumPriceFieldLabel()));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r2.currencySymbol(ctx_r2.workingPricing.currency));
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r2.workingPricing.minPrice ?? "")("disabled", ctx_r2.readOnly)("placeholder", \u0275\u0275pipeBind1(44, 49, "pricing.no.minimum"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r2.workingPricing.currency);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(50, 51, ctx_r2.maximumPriceFieldLabel()));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r2.currencySymbol(ctx_r2.workingPricing.currency));
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r2.workingPricing.maxPrice ?? "")("disabled", ctx_r2.readOnly)("placeholder", \u0275\u0275pipeBind1(55, 53, "pricing.no.maximum"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r2.workingPricing.currency);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(61, 55, "pricing.rounding"));
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.workingPricing.rounding);
    \u0275\u0275property("disabled", ctx_r2.readOnly)("panelWidth", null);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.roundingOptions);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.showQuantitySection() ? 66 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.showDemandSection() ? 67 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.showTimeSection() ? 68 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.showCancellationSection() ? 69 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.showSlotSection() ? 70 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.showAudienceSection() ? 71 : -1);
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_8_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 57)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "number");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.currentPreview.quantityLabel || "Quantity pricing");
    \u0275\u0275advance();
    \u0275\u0275classProp("positive", ctx_r2.currentPreview.quantityDelta > 0)("negative", ctx_r2.currentPreview.quantityDelta < 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3(" ", ctx_r2.currentPreview.quantityDelta > 0 ? "+" : "", "", ctx_r2.currencySymbol(ctx_r2.workingPricing.currency), "", \u0275\u0275pipeBind2(5, 8, ctx_r2.currentPreview.quantityDelta, "1.0-2"), " ");
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_8_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 57)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "number");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 8, "pricing.demand.adjustment"));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("positive", ctx_r2.currentPreview.demandDelta > 0)("negative", ctx_r2.currentPreview.demandDelta < 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3(" ", ctx_r2.currentPreview.demandDelta > 0 ? "+" : "", "", ctx_r2.currencySymbol(ctx_r2.workingPricing.currency), "", \u0275\u0275pipeBind2(6, 10, ctx_r2.currentPreview.demandDelta, "1.0-2"), " ");
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_8_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 57)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "number");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 8, "pricing.time.adjustment"));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("positive", ctx_r2.currentPreview.timeDelta > 0)("negative", ctx_r2.currentPreview.timeDelta < 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3(" ", ctx_r2.currentPreview.timeDelta > 0 ? "+" : "", "", ctx_r2.currencySymbol(ctx_r2.workingPricing.currency), "", \u0275\u0275pipeBind2(6, 10, ctx_r2.currentPreview.timeDelta, "1.0-2"), " ");
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_8_For_19_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "em");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r48 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, item_r48.detail));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_8_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 59)(1, "span")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, PricingEditorPopupComponent_Conditional_0_ng_template_8_For_19_Conditional_5_Template, 3, 3, "em");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "strong");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r48 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 3, item_r48.label));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(item_r48.detail ? 5 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 5, item_r48.value));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 55)(1, "div", 56)(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "mat-icon");
    \u0275\u0275text(6, "query_stats");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 57)(8, "span");
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "strong");
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(14, PricingEditorPopupComponent_Conditional_0_ng_template_8_Conditional_14_Template, 6, 11, "div", 57);
    \u0275\u0275conditionalCreate(15, PricingEditorPopupComponent_Conditional_0_ng_template_8_Conditional_15_Template, 7, 13, "div", 57);
    \u0275\u0275conditionalCreate(16, PricingEditorPopupComponent_Conditional_0_ng_template_8_Conditional_16_Template, 7, 13, "div", 57);
    \u0275\u0275elementStart(17, "div", 58);
    \u0275\u0275repeaterCreate(18, PricingEditorPopupComponent_Conditional_0_ng_template_8_For_19_Template, 9, 7, "article", 59, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "div", 60)(21, "span");
    \u0275\u0275text(22);
    \u0275\u0275pipe(23, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "strong");
    \u0275\u0275text(25);
    \u0275\u0275pipe(26, "number");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 10, "event.editor.pricing.current.review"));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(10, 12, "pricing.base"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", ctx_r2.currencySymbol(ctx_r2.workingPricing.currency), "", \u0275\u0275pipeBind2(13, 14, ctx_r2.currentPreview.basePrice, "1.0-2"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.currentPreview.quantityDelta !== 0 ? 14 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.currentPreview.demandDelta !== 0 ? 15 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.currentPreview.timeDelta !== 0 ? 16 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.pricingSummaryItems());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(23, 17, "event.editor.pricing.final.price"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", ctx_r2.currencySymbol(ctx_r2.workingPricing.currency), "", \u0275\u0275pipeBind2(26, 19, ctx_r2.currentPreview.finalPrice, "1.0-2"));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_10_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 57)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "number");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.currentPreview.quantityLabel || "Quantity pricing");
    \u0275\u0275advance();
    \u0275\u0275classProp("positive", ctx_r2.currentPreview.quantityDelta > 0)("negative", ctx_r2.currentPreview.quantityDelta < 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3(" ", ctx_r2.currentPreview.quantityDelta > 0 ? "+" : "", "", ctx_r2.currencySymbol(ctx_r2.workingPricing.currency), "", \u0275\u0275pipeBind2(5, 8, ctx_r2.currentPreview.quantityDelta, "1.0-2"), " ");
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_10_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 57)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "number");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 8, "pricing.demand.adjustment"));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("positive", ctx_r2.currentPreview.demandDelta > 0)("negative", ctx_r2.currentPreview.demandDelta < 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3(" ", ctx_r2.currentPreview.demandDelta > 0 ? "+" : "", "", ctx_r2.currencySymbol(ctx_r2.workingPricing.currency), "", \u0275\u0275pipeBind2(6, 10, ctx_r2.currentPreview.demandDelta, "1.0-2"), " ");
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_10_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 57)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "number");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 8, "pricing.time.adjustment"));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("positive", ctx_r2.currentPreview.timeDelta > 0)("negative", ctx_r2.currentPreview.timeDelta < 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3(" ", ctx_r2.currentPreview.timeDelta > 0 ? "+" : "", "", ctx_r2.currencySymbol(ctx_r2.workingPricing.currency), "", \u0275\u0275pipeBind2(6, 10, ctx_r2.currentPreview.timeDelta, "1.0-2"), " ");
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_10_For_19_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "em");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r49 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, item_r49.detail));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_10_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 59)(1, "span")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, PricingEditorPopupComponent_Conditional_0_ng_template_10_For_19_Conditional_5_Template, 3, 3, "em");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "strong");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r49 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 3, item_r49.label));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(item_r49.detail ? 5 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 5, item_r49.value));
  }
}
function PricingEditorPopupComponent_Conditional_0_ng_template_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 55)(1, "div", 56)(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "mat-icon");
    \u0275\u0275text(6, "query_stats");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 57)(8, "span");
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "strong");
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(14, PricingEditorPopupComponent_Conditional_0_ng_template_10_Conditional_14_Template, 6, 11, "div", 57);
    \u0275\u0275conditionalCreate(15, PricingEditorPopupComponent_Conditional_0_ng_template_10_Conditional_15_Template, 7, 13, "div", 57);
    \u0275\u0275conditionalCreate(16, PricingEditorPopupComponent_Conditional_0_ng_template_10_Conditional_16_Template, 7, 13, "div", 57);
    \u0275\u0275elementStart(17, "div", 58);
    \u0275\u0275repeaterCreate(18, PricingEditorPopupComponent_Conditional_0_ng_template_10_For_19_Template, 9, 7, "article", 59, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "div", 60)(21, "span");
    \u0275\u0275text(22);
    \u0275\u0275pipe(23, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "strong");
    \u0275\u0275text(25);
    \u0275\u0275pipe(26, "number");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 10, "event.editor.pricing.current.review"));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(10, 12, "pricing.base"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", ctx_r2.currencySymbol(ctx_r2.workingPricing.currency), "", \u0275\u0275pipeBind2(13, 14, ctx_r2.currentPreview.basePrice, "1.0-2"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.currentPreview.quantityDelta !== 0 ? 14 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.currentPreview.demandDelta !== 0 ? 15 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.currentPreview.timeDelta !== 0 ? 16 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.pricingSummaryItems());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(23, 17, "event.editor.pricing.final.price"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", ctx_r2.currencySymbol(ctx_r2.workingPricing.currency), "", \u0275\u0275pipeBind2(26, 19, ctx_r2.currentPreview.finalPrice, "1.0-2"));
  }
}
function PricingEditorPopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 4)(1, "div", 5);
    \u0275\u0275conditionalCreate(2, PricingEditorPopupComponent_Conditional_0_Conditional_2_Template, 2, 1, "aside", 6);
    \u0275\u0275elementStart(3, "div", 7);
    \u0275\u0275elementContainer(4, 8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "app-menu-outlet", 9);
    \u0275\u0275listener("itemSelect", function PricingEditorPopupComponent_Conditional_0_Template_app_menu_outlet_itemSelect_5_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onRuleScopeMenuSelect($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, PricingEditorPopupComponent_Conditional_0_ng_template_6_Template, 72, 57, "ng-template", null, 0, \u0275\u0275templateRefExtractor)(8, PricingEditorPopupComponent_Conditional_0_ng_template_8_Template, 27, 22, "ng-template", null, 1, \u0275\u0275templateRefExtractor)(10, PricingEditorPopupComponent_Conditional_0_ng_template_10_Template, 27, 22, "ng-template", null, 2, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const popup_r50 = ctx;
    const pricingEditorSurfaces_r51 = \u0275\u0275reference(7);
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r2.pricingPopupModel(popup_r50))("zIndex", popup_r50.zIndex);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.resolvedConfig.showPreview && ctx_r2.showPricingInfoPanel ? 2 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngTemplateOutlet", pricingEditorSurfaces_r51);
    \u0275\u0275advance();
    \u0275\u0275property("items", ctx_r2.activeRuleScopeMenuItems());
  }
}
var PricingEditorPopupComponent = class _PricingEditorPopupComponent extends PricingEditorInputComponent {
  popup = null;
  draftValue = PricingBuilder.createDefaultPricingConfig("event");
  showPricingInfoPanel = true;
  locallyDirty = false;
  originalValue = PricingBuilder.createDefaultPricingConfig("event");
  popupStore = inject(FormFlowPopupStore);
  constructor() {
    super(inject(ChangeDetectorRef));
  }
  ngOnChanges(changes) {
    if (!changes["popup"] || !this.popup) {
      super.ngOnChanges(changes);
      return;
    }
    this.config = this.popupEditorConfig(this.popup);
    this.readOnly = this.popup.readOnly;
    this.disabled = this.popup.readOnly;
    super.ngOnChanges({ config: changes["popup"] });
    this.writeValue(PricingBuilder.clonePricingConfig(this.popup.value));
    this.originalValue = PricingBuilder.clonePricingConfig(this.workingPricing);
    this.draftValue = PricingBuilder.clonePricingConfig(this.workingPricing);
    this.locallyDirty = false;
  }
  afterPricingChange(nextPricing) {
    this.draftValue = PricingBuilder.clonePricingConfig(nextPricing);
    this.locallyDirty = this.hasDraftChanges();
  }
  pricingPopupModel(popup) {
    return {
      title: popup.title,
      subtitle: popup.subtitle,
      ariaLabel: "pricing.setup.wizard.aria",
      closeAriaLabel: "pricing.setup.close.aria",
      size: "wide",
      height: "full",
      headerTone: "accent",
      bodyLayout: "fill",
      backdropTone: "dim",
      headerActions: this.pricingPopupHeaderActions(popup),
      onClose: (event) => this.close(popup, event),
      onAction: (event) => this.onPricingPopupAction(popup, event)
    };
  }
  close(popup, event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.popupStore.requestPricingEditorPopupClose(popup.ownerId, event);
  }
  onPricingPopupAction(popup, event) {
    if (event.action.id === "pricing-info-toggle") {
      event.sourceEvent.preventDefault();
      event.sourceEvent.stopPropagation();
      this.showPricingInfoPanel = !this.showPricingInfoPanel;
      return;
    }
    if (event.action.id !== "pricing-save") {
      return;
    }
    this.popupStore.requestPricingEditorPopupSave(popup.ownerId, this.draftValue, event.sourceEvent);
  }
  pricingPopupHeaderActions(popup) {
    const actions = [{
      id: "pricing-info-toggle",
      icon: "query_stats",
      ariaLabel: this.showPricingInfoPanel ? "pricing.summary.hide.aria" : "pricing.summary.show.aria",
      palette: "blue",
      active: this.showPricingInfoPanel,
      compactOnMobile: true
    }];
    if (popup.readOnly) {
      return actions;
    }
    const canSave = this.canSubmit(popup);
    actions.push({
      id: "pricing-save",
      icon: "done",
      ariaLabel: "pricing.draft.apply.aria",
      palette: canSave ? "success" : "danger",
      disabled: !canSave
    });
    return actions;
  }
  canSubmit(popup) {
    return !popup.readOnly && (popup.canSave || this.locallyDirty || this.hasDraftChanges());
  }
  hasDraftChanges() {
    return JSON.stringify(this.draftValue) !== JSON.stringify(this.originalValue);
  }
  popupEditorConfig(popup) {
    return popup.config;
  }
  static \u0275fac = function PricingEditorPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PricingEditorPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PricingEditorPopupComponent, selectors: [["app-pricing-editor-popup"]], inputs: { popup: "popup" }, features: [\u0275\u0275ProvidersFeature([AppMenuDispatcher]), \u0275\u0275InheritDefinitionFeature, \u0275\u0275NgOnChangesFeature], decls: 1, vars: 1, consts: [["pricingEditorSurfaces", ""], ["pricingWizardPreviewCard", ""], ["pricingPreviewCards", ""], ["timeRuleRangePicker", ""], [3, "model", "zIndex"], [1, "pricing-editor__wizard-body"], [1, "pricing-editor__preview", "pricing-editor__preview--wizard-sticky"], [1, "pricing-editor__main"], [3, "ngTemplateOutlet"], [3, "itemSelect", "items"], [1, "pricing-editor__surface"], [1, "pricing-editor__grid"], [1, "pricing-editor__field", "pricing-editor__field--money"], [1, "pricing-editor__money-field"], [1, "pricing-editor__money-prefix"], ["type", "number", "min", "0", "step", "0.01", 3, "ngModelChange", "ngModel", "disabled"], [1, "pricing-editor__money-code"], [1, "pricing-editor__field"], [1, "pricing-editor__select-shell"], ["disableOptionCentering", "", "panelClass", "selector-options-panel profile-bottom-sheet-panel", 3, "ngModelChange", "ngModel", "disabled", "panelWidth"], [3, "value"], ["type", "number", "min", "0", "step", "0.01", 3, "ngModelChange", "ngModel", "disabled", "placeholder"], [3, "enabled", "overrides", "slotCatalog", "currency", "readOnly"], [1, "pricing-editor__section-head"], ["type", "button", 1, "pricing-editor__toggle", 3, "is-on", "disabled"], [1, "pricing-editor__hint"], ["type", "button", 1, "pricing-editor__toggle", 3, "click", "disabled"], [1, "pricing-editor__rules"], [1, "pricing-editor__rule-card"], ["type", "button", 1, "pricing-editor__add-btn", 3, "click", "disabled"], [1, "pricing-editor__rule-grid"], [1, "pricing-editor__select-shell", "pricing-editor__select-shell--static"], ["type", "number", "min", "1", "step", "1", 3, "ngModelChange", "ngModel", "disabled"], ["type", "button", 1, "pricing-editor__rule-remove", 3, "click", "disabled"], ["type", "number", "min", "0", "max", "100", "step", "1", 3, "ngModelChange", "ngModel", "disabled"], ["kind", "select", 3, "menuId", "title", "trigger", "items", "closeOnSelect"], [1, "pricing-editor__field", "pricing-editor__field--time-trigger"], [1, "pricing-editor__field", "pricing-editor__field--span-full"], [1, "pricing-editor__field", "pricing-editor__field--time-offset"], [1, "pricing-editor__field", "pricing-editor__field--time-action"], [1, "pricing-editor__field", "pricing-editor__field--time-value"], ["appearance", "outline", "subscriptSizing", "dynamic", 1, "pricing-editor__date-range-field"], [3, "rangePicker"], ["matStartDate", "", 3, "dateChange", "value", "disabled", "placeholder"], ["matEndDate", "", 3, "dateChange", "value", "disabled", "placeholder"], ["matSuffix", "", 3, "for"], ["type", "number", "min", "0", "step", "1", 3, "ngModelChange", "ngModel", "disabled"], [1, "pricing-editor__grid", "pricing-editor__grid--compact"], ["type", "number", "min", "0", 3, "step", "ngModel", "disabled"], ["type", "text", "disabled", "", 3, "value"], ["type", "number", "min", "0", 3, "ngModelChange", "step", "ngModel", "disabled"], [3, "enabledChange", "overridesChange", "enabled", "overrides", "slotCatalog", "currency", "readOnly"], [1, "pricing-editor__promo-list"], [1, "pricing-editor__promo-card"], ["type", "text", "placeholder", "EARLY", 3, "ngModelChange", "ngModel", "disabled"], [1, "pricing-editor__preview-card"], [1, "pricing-editor__preview-head"], [1, "pricing-editor__preview-line"], [1, "pricing-editor__preview-details"], [1, "pricing-editor__preview-detail"], [1, "pricing-editor__preview-total"]], template: function PricingEditorPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, PricingEditorPopupComponent_Conditional_0_Template, 12, 5, "app-popup", 4);
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275conditional((tmp_0_0 = ctx.popup) ? 0 : -1, tmp_0_0);
    }
  }, dependencies: [
    CommonModule,
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
    PopupComponent,
    PricingSlotPanelComponent,
    DecimalPipe,
    I18nPipe
  ], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n  container-type: inline-size;\n  min-width: 0;\n}\n.pricing-editor[_ngcontent-%COMP%] {\n  display: grid;\n  min-width: 0;\n  gap: 1rem;\n  padding: 1rem;\n  border-radius: 24px;\n  border: 1px solid rgba(143, 168, 201, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.97) 0%,\n      rgba(245, 249, 255, 0.94) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(113, 193, 177, 0.12),\n      transparent 34%),\n    radial-gradient(\n      circle at bottom left,\n      rgba(135, 175, 226, 0.12),\n      transparent 42%);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 18px 42px rgba(32, 57, 92, 0.08);\n}\n.pricing-editor--summary-popup[_ngcontent-%COMP%] {\n  gap: 0.62rem;\n  padding: 0.62rem 0.72rem;\n  border-radius: 16px;\n  border-color: rgba(109, 149, 143, 0.24);\n}\n.pricing-editor--summary-popup.pricing-editor--enabled[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(241, 250, 247, 0.97) 0%,\n      rgba(231, 243, 239, 0.94) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(117, 194, 169, 0.18),\n      transparent 34%),\n    radial-gradient(\n      circle at bottom left,\n      rgba(125, 170, 221, 0.14),\n      transparent 42%);\n}\n.pricing-editor--summary-popup[_ngcontent-%COMP%]:not(.pricing-editor--enabled) {\n  border-color: rgba(128, 147, 175, 0.22);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(247, 250, 254, 0.97) 0%,\n      rgba(237, 243, 249, 0.94) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(146, 165, 194, 0.1),\n      transparent 36%);\n}\n.pricing-editor--embedded[_ngcontent-%COMP%] {\n  height: 100%;\n  min-height: 0;\n  padding: 0;\n  border: 0;\n  border-radius: 0;\n  background: transparent;\n  box-shadow: none;\n  overflow: hidden;\n}\n.pricing-editor--summary-popup.pricing-editor--enabled[_ngcontent-%COMP%]   .pricing-editor__title-text[_ngcontent-%COMP%], \n.pricing-editor--summary-popup.pricing-editor--enabled[_ngcontent-%COMP%]   .pricing-editor__title-text[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #235d53;\n}\n.pricing-editor--summary-popup.pricing-editor--enabled[_ngcontent-%COMP%]   .pricing-editor__preview-card[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.94) 0%,\n      rgba(245, 251, 248, 0.9) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(118, 198, 175, 0.14),\n      transparent 44%);\n}\n.pricing-editor--summary-popup.pricing-editor--enabled[_ngcontent-%COMP%]   .pricing-editor__preview-card--light[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.94) 0%,\n      rgba(247, 251, 250, 0.9) 100%),\n    radial-gradient(\n      circle at bottom left,\n      rgba(133, 176, 227, 0.1),\n      transparent 48%);\n}\n.pricing-editor__head[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: start;\n  gap: 0.75rem;\n}\n.pricing-editor--summary-popup[_ngcontent-%COMP%]   .pricing-editor__head[_ngcontent-%COMP%] {\n  gap: 0.62rem;\n}\n.pricing-editor__head-actions[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.7rem;\n  flex-wrap: wrap;\n  justify-self: end;\n  align-self: start;\n}\n.pricing-editor--summary-popup[_ngcontent-%COMP%]   .pricing-editor__head-actions[_ngcontent-%COMP%] {\n  gap: 0.5rem;\n}\n.pricing-editor__title[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.pricing-editor__title-copy[_ngcontent-%COMP%] {\n  display: grid;\n  min-width: 0;\n}\n.pricing-editor__title-text[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n  color: #213a5b;\n  font-size: 1rem;\n  font-weight: 800;\n}\n.pricing-editor__title-text[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.pricing-editor__subtitle[_ngcontent-%COMP%] {\n  color: rgba(37, 58, 88, 0.74);\n  font-size: 0.8rem;\n  line-height: 1.4;\n}\n.pricing-editor__status[_ngcontent-%COMP%], \n.pricing-editor__toggle[_ngcontent-%COMP%], \n.pricing-editor__add-btn[_ngcontent-%COMP%], \n.pricing-editor__rule-remove[_ngcontent-%COMP%], \n.pricing-editor__open-btn[_ngcontent-%COMP%] {\n  border: 0;\n  transition:\n    transform 0.18s ease,\n    box-shadow 0.18s ease,\n    background-color 0.18s ease,\n    opacity 0.18s ease;\n}\n.pricing-editor__status[_ngcontent-%COMP%], \n.pricing-editor__toggle[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.4rem;\n  padding: 0.36rem 0.64rem;\n  border-radius: 999px;\n  font-size: 0.84rem;\n  font-weight: 800;\n}\n.pricing-editor__status[_ngcontent-%COMP%] {\n  color: #61748d;\n  background: rgba(239, 244, 251, 0.95);\n  box-shadow: inset 0 0 0 1px rgba(128, 149, 176, 0.24);\n}\n.pricing-editor__status.is-dynamic[_ngcontent-%COMP%], \n.pricing-editor__toggle.is-on[_ngcontent-%COMP%] {\n  color: #23695f;\n  background: rgba(230, 247, 241, 0.95);\n  box-shadow: inset 0 0 0 1px rgba(85, 175, 147, 0.24);\n}\n.pricing-editor__toggle[_ngcontent-%COMP%] {\n  cursor: pointer;\n  color: #61748d;\n  background: rgba(239, 244, 251, 0.95);\n  border: 1px solid rgba(128, 149, 176, 0.24);\n  box-shadow: inset 0 0 0 0 rgba(0, 0, 0, 0);\n}\n.pricing-editor__toggle--header[_ngcontent-%COMP%] {\n  min-width: 82px;\n  min-height: 38px;\n  padding: 0.3rem 0.62rem;\n  border-radius: 999px;\n  font-size: 0.76rem;\n  font-weight: 800;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n  box-shadow: 0 2px 7px rgba(29, 53, 86, 0.08);\n}\n.pricing-editor__toggle--header.is-on[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf8ee 0%,\n      #ddf1e2 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.pricing-editor__toggle--header[_ngcontent-%COMP%]:not(.is-on) {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f7fb 0%,\n      #e9eff7 100%);\n  border-color: rgba(86, 108, 145, 0.22);\n  color: #5b6e8e;\n}\n.pricing-editor__toggle[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%], \n.pricing-editor__status[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 24px;\n  height: 24px;\n  font-size: 24px;\n}\n.pricing-editor__toggle--header[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.pricing-editor__open-btn[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.5rem;\n  min-height: 40px;\n  padding: 0.62rem 0.9rem;\n  border-radius: 14px;\n  color: #214863;\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #eff6ff 100%);\n  box-shadow: inset 0 0 0 1px rgba(99, 137, 184, 0.26), 0 10px 22px rgba(31, 58, 97, 0.08);\n  cursor: pointer;\n  font-size: 0.86rem;\n  font-weight: 800;\n}\n.pricing-editor__open-btn[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.pricing-editor__summary-copy[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.35rem;\n}\n.pricing-editor__summary-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-start;\n}\n.pricing-editor__open-btn--summary[_ngcontent-%COMP%] {\n  min-width: 138px;\n  min-height: 38px;\n  padding: 0.42rem 0.82rem;\n  border-radius: 999px;\n  font-size: 0.8rem;\n  box-shadow: 0 2px 7px rgba(29, 53, 86, 0.08);\n}\n.pricing-editor__layout[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(240px, 300px);\n  gap: 1rem;\n  align-items: start;\n}\n.pricing-editor--embedded[_ngcontent-%COMP%]   .pricing-editor__layout[_ngcontent-%COMP%] {\n  height: 100%;\n  min-height: 0;\n  overflow-y: auto;\n  overflow-x: hidden;\n  padding: 0.12rem 0 0.8rem;\n  box-sizing: border-box;\n  scrollbar-width: thin;\n  scrollbar-color: #8aa0b8 #eaf1fa;\n}\n.pricing-editor__main[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.92rem;\n}\n.pricing-editor__surface[_ngcontent-%COMP%] {\n  display: grid;\n  position: relative;\n  z-index: 0;\n  gap: 0.86rem;\n  padding: 1rem;\n  border-radius: 20px;\n  border: 1px solid rgba(136, 161, 195, 0.28);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.98) 0%,\n      rgba(250, 252, 255, 0.94) 100%),\n    radial-gradient(\n      circle at top left,\n      rgba(127, 174, 227, 0.1),\n      transparent 46%);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);\n  contain: layout;\n  transform: translateZ(0);\n  backface-visibility: hidden;\n}\n.pricing-editor__section-head[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.8rem;\n  color: #1f3b5a;\n  font-size: 0.95rem;\n  font-weight: 900;\n}\n.pricing-editor__section-head[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.pricing-editor__section-head[_ngcontent-%COMP%]   .pricing-editor__toggle[_ngcontent-%COMP%] {\n  justify-self: end;\n}\n.pricing-editor__toggle[_ngcontent-%COMP%]:disabled {\n  cursor: default;\n  opacity: 0.66;\n  pointer-events: none;\n  filter: saturate(0.66);\n  box-shadow: none;\n}\n.pricing-editor__add-btn[_ngcontent-%COMP%]:disabled, \n.pricing-editor__rule-remove[_ngcontent-%COMP%]:disabled, \n.pricing-editor__open-btn[_ngcontent-%COMP%]:disabled {\n  cursor: default;\n  opacity: 0.58;\n  pointer-events: none;\n  filter: grayscale(0.35);\n  box-shadow: none;\n}\n.pricing-editor--readonly[_ngcontent-%COMP%]   .pricing-editor__summary-actions[_ngcontent-%COMP%] {\n  display: none;\n}\n.popup-panel-event-editor-readonly[_nghost-%COMP%]   .pricing-editor__summary-actions[_ngcontent-%COMP%], .popup-panel-event-editor-readonly   [_nghost-%COMP%]   .pricing-editor__summary-actions[_ngcontent-%COMP%] {\n  display: none;\n}\n.popup-panel-event-editor-readonly[_nghost-%COMP%]   .pricing-editor__toggle[_ngcontent-%COMP%], .popup-panel-event-editor-readonly   [_nghost-%COMP%]   .pricing-editor__toggle[_ngcontent-%COMP%], \n.popup-panel-event-editor-readonly[_nghost-%COMP%]   .pricing-editor__add-btn[_ngcontent-%COMP%], .popup-panel-event-editor-readonly   [_nghost-%COMP%]   .pricing-editor__add-btn[_ngcontent-%COMP%], \n.popup-panel-event-editor-readonly[_nghost-%COMP%]   .pricing-editor__rule-remove[_ngcontent-%COMP%], .popup-panel-event-editor-readonly   [_nghost-%COMP%]   .pricing-editor__rule-remove[_ngcontent-%COMP%], \n.popup-panel-event-editor-readonly[_nghost-%COMP%]   .pricing-editor__open-btn[_ngcontent-%COMP%], .popup-panel-event-editor-readonly   [_nghost-%COMP%]   .pricing-editor__open-btn[_ngcontent-%COMP%] {\n  cursor: default;\n  opacity: 0.58;\n  pointer-events: none;\n  filter: grayscale(0.35);\n  box-shadow: none;\n}\n.popup-panel-event-editor-readonly[_nghost-%COMP%]   .pricing-editor__toggle[_ngcontent-%COMP%], .popup-panel-event-editor-readonly   [_nghost-%COMP%]   .pricing-editor__toggle[_ngcontent-%COMP%] {\n  opacity: 0.66;\n  filter: saturate(0.66);\n}\n.pricing-editor__grid[_ngcontent-%COMP%], \n.pricing-editor__rule-grid[_ngcontent-%COMP%], \n.pricing-editor__promo-card[_ngcontent-%COMP%] {\n  display: grid;\n  column-gap: 1rem;\n  row-gap: 1rem;\n}\n.pricing-editor__grid[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));\n}\n.pricing-editor__rule-grid[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));\n}\n.pricing-editor__rule-grid.pricing-editor__rule-grid--slots[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 190px), 1fr));\n}\n.pricing-editor__rule-grid--time[_ngcontent-%COMP%]:not(.pricing-editor__rule-grid--slots) {\n  grid-template-columns: minmax(260px, 1.55fr) minmax(82px, 0.48fr) minmax(210px, 1.2fr) minmax(92px, 0.52fr);\n}\n.pricing-editor__rule-grid--time.pricing-editor__rule-grid--slots[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(230px, 1.5fr) minmax(78px, 0.46fr) minmax(195px, 1.18fr) minmax(88px, 0.5fr) minmax(150px, 0.9fr);\n}\n.pricing-editor__rule-grid--time[_ngcontent-%COMP%]   .pricing-editor__field--time-trigger[_ngcontent-%COMP%], \n.pricing-editor__rule-grid--time[_ngcontent-%COMP%]   .pricing-editor__field--time-action[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.pricing-editor__rule-grid--time[_ngcontent-%COMP%]   .pricing-editor__field--time-offset[_ngcontent-%COMP%], \n.pricing-editor__rule-grid--time[_ngcontent-%COMP%]   .pricing-editor__field--time-value[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.pricing-editor__promo-card[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));\n}\n.pricing-editor__grid--compact[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));\n}\n.pricing-editor__field[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.34rem;\n  min-width: 0;\n}\n.pricing-editor__field--span-full[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.pricing-editor__field[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  color: rgba(31, 57, 88, 0.9);\n  font-size: 0.74rem;\n  font-weight: 800;\n  letter-spacing: 0.01em;\n  text-transform: uppercase;\n}\n.pricing-editor__field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.pricing-editor__select-shell[_ngcontent-%COMP%], \n.pricing-editor__money-field[_ngcontent-%COMP%], \n.pricing-editor__date-range-field[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  width: 100%;\n  min-height: 46px;\n  border-radius: 14px;\n  border: 1px solid rgba(126, 149, 180, 0.28);\n  background: rgba(255, 255, 255, 0.98);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92);\n}\n.pricing-editor__field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  width: 100%;\n  min-width: 0;\n  text-align: center;\n  color: #213d5d;\n  font: inherit;\n  font-size: 0.96rem;\n  font-weight: 700;\n}\n.pricing-editor__field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: rgba(72, 125, 194, 0.66);\n  box-shadow: 0 0 0 3px rgba(89, 136, 204, 0.12);\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  min-height: 0;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  box-shadow: none;\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-mdc-text-field-wrapper {\n  display: flex;\n  align-items: center;\n  min-height: 46px;\n  height: 46px;\n  padding: 0 0.08rem 0 0.42rem;\n  border-radius: 14px;\n  background: rgba(255, 255, 255, 0.98);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92);\n  overflow: visible;\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-mdc-form-field-flex, \n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-date-range-input-container {\n  min-height: 46px;\n  height: 46px;\n  align-items: center;\n  min-width: 0;\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-date-range-input-container {\n  width: 100%;\n  display: flex;\n  align-items: center;\n  gap: 0.08rem;\n  overflow: visible;\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-mdc-form-field-infix {\n  width: auto !important;\n  min-width: 0;\n  min-height: 0;\n  height: 46px;\n  padding: 0;\n  flex: 1 1 auto;\n  display: flex;\n  align-items: center;\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-date-range-input-separator {\n  color: rgba(64, 87, 117, 0.72);\n  padding: 0 0.02rem;\n  margin: 0;\n  white-space: nowrap;\n  flex: 0 0 auto;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  line-height: 46px;\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mdc-notched-outline__leading, \n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mdc-notched-outline__notch, \n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mdc-notched-outline__trailing {\n  border-color: rgba(126, 149, 180, 0.28);\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-mdc-form-field-subscript-wrapper {\n  display: none;\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-date-range-input-wrapper, \n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-date-range-input-start-wrapper, \n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-date-range-input-end-wrapper {\n  display: flex;\n  align-items: center;\n  flex: 1 1 0;\n  min-width: 0;\n  width: 100%;\n  max-width: none;\n  min-height: 46px;\n  height: 46px;\n  overflow: visible;\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-date-range-input-start-wrapper {\n  justify-content: flex-end;\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-date-range-input-end-wrapper {\n  justify-content: flex-start;\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-date-range-input-mirror {\n  min-height: 46px;\n  height: 46px;\n  display: inline-flex;\n  align-items: center;\n  line-height: 46px;\n}\n.pricing-editor__date-range-field.mat-focused[_ngcontent-%COMP%]     .mdc-notched-outline__leading, \n.pricing-editor__date-range-field.mat-focused[_ngcontent-%COMP%]     .mdc-notched-outline__notch, \n.pricing-editor__date-range-field.mat-focused[_ngcontent-%COMP%]     .mdc-notched-outline__trailing {\n  border-color: rgba(72, 125, 194, 0.66);\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-date-range-input-inner, \n.pricing-editor__date-range-field[_ngcontent-%COMP%]     input {\n  min-width: 0;\n  width: 100%;\n  min-height: 0;\n  height: 100% !important;\n  padding: 0 0.04rem;\n  color: #213d5d;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 700;\n  line-height: 46px;\n  box-sizing: border-box;\n  background: transparent !important;\n  border: 0 !important;\n  border-radius: 0 !important;\n  box-shadow: none !important;\n  align-self: stretch;\n  display: block;\n  white-space: nowrap;\n  text-overflow: clip;\n  overflow: hidden;\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-date-range-input-start-wrapper .mat-date-range-input-inner, \n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-date-range-input-start-wrapper input {\n  text-align: center;\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-date-range-input-end-wrapper .mat-date-range-input-inner, \n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-date-range-input-end-wrapper input {\n  text-align: center;\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-mdc-form-field-flex {\n  min-height: 46px;\n  height: 46px;\n  display: flex;\n  align-items: center !important;\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-mdc-form-field-icon-suffix, \n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-datepicker-toggle {\n  align-self: center;\n  flex: 0 0 32px;\n  width: 32px;\n  min-width: 32px;\n}\n.pricing-editor__date-range-field[_ngcontent-%COMP%]     .mat-mdc-icon-button {\n  width: 32px;\n  height: 32px;\n  padding: 4px;\n}\n.pricing-editor__select-shell[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  padding: 0 0.7rem;\n}\n.pricing-editor__select-shell--static[_ngcontent-%COMP%] {\n  justify-content: center;\n  color: #213d5d;\n  font-weight: 700;\n}\n.pricing-editor__select-shell[_ngcontent-%COMP%]     .mat-mdc-select-trigger {\n  min-height: 44px;\n}\n.pricing-editor__money-field[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.48rem;\n  padding: 0 0.72rem;\n}\n.pricing-editor__money-prefix[_ngcontent-%COMP%], \n.pricing-editor__money-code[_ngcontent-%COMP%] {\n  color: rgba(65, 86, 115, 0.78);\n  font-size: 0.84rem;\n  font-weight: 800;\n}\n.pricing-editor__money-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  padding: 0;\n  border: 0;\n  background: transparent;\n  box-shadow: none;\n}\n.pricing-editor__rules[_ngcontent-%COMP%], \n.pricing-editor__promo-list[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 1.08rem;\n}\n.pricing-editor__promo-list[_ngcontent-%COMP%] {\n  margin-top: 0.28rem;\n}\n.pricing-editor__rule-card[_ngcontent-%COMP%], \n.pricing-editor__promo-card[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  position: relative;\n  z-index: 0;\n  align-items: end;\n  padding: 0.86rem;\n  border-radius: 18px;\n  border: 1px solid rgba(125, 151, 185, 0.24);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.98) 0%,\n      rgba(246, 250, 255, 0.92) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(110, 183, 172, 0.12),\n      transparent 36%);\n  transform: translateZ(0);\n  backface-visibility: hidden;\n  contain: layout;\n}\n.pricing-editor__rule-card[_ngcontent-%COMP%] {\n  padding-right: 3.2rem;\n}\n.pricing-editor__promo-card[_ngcontent-%COMP%] {\n  padding-right: 3.2rem;\n}\n.pricing-editor__rule-remove[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.75rem;\n  right: 0.75rem;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  cursor: pointer;\n  color: #b4233a;\n  background: rgba(255, 235, 238, 0.96);\n  box-shadow: inset 0 0 0 1px rgba(214, 64, 88, 0.26);\n}\n.pricing-editor__rule-remove[_ngcontent-%COMP%]:hover {\n  color: #9f1830;\n  background: rgba(255, 224, 229, 0.98);\n  box-shadow: inset 0 0 0 1px rgba(214, 64, 88, 0.34), 0 10px 20px rgba(173, 38, 60, 0.16);\n}\n.pricing-editor__rule-remove[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.pricing-editor__add-btn[_ngcontent-%COMP%] {\n  justify-self: start;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.45rem;\n  padding: 0.68rem 0.94rem;\n  border-radius: 14px;\n  cursor: pointer;\n  color: #214863;\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #eff6ff 100%);\n  box-shadow: inset 0 0 0 1px rgba(99, 137, 184, 0.26), 0 10px 22px rgba(31, 58, 97, 0.08);\n  font-size: 0.88rem;\n  font-weight: 800;\n}\n.pricing-editor__add-btn[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.pricing-editor__hint[_ngcontent-%COMP%] {\n  margin: 0;\n  color: rgba(69, 88, 113, 0.8);\n  font-size: 0.86rem;\n  line-height: 1.55;\n}\n.pricing-editor__preview-note--billing[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 0.62rem 0.72rem;\n  border-radius: 10px;\n  background: rgba(30, 132, 111, 0.08);\n  color: rgba(33, 92, 80, 0.92);\n  font-size: 0.8rem;\n  line-height: 1.45;\n}\n.pricing-editor__preview[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.82rem;\n  min-width: 0;\n  transform: translateZ(0);\n  backface-visibility: hidden;\n}\n.pricing-editor__preview--summary[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 1fr);\n  margin-block-start: var(--pricing-summary-preview-offset, 0);\n}\n.pricing-editor__preview-card[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.72rem;\n  min-width: 0;\n  padding: 1rem;\n  border-radius: 20px;\n  border: 1px solid rgba(126, 152, 188, 0.28);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.98) 0%,\n      rgba(247, 251, 255, 0.94) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(118, 198, 175, 0.15),\n      transparent 44%);\n}\n.pricing-editor__preview-card--light[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.98) 0%,\n      rgba(250, 252, 255, 0.95) 100%),\n    radial-gradient(\n      circle at bottom left,\n      rgba(133, 176, 227, 0.12),\n      transparent 48%);\n}\n.pricing-editor__preview-head[_ngcontent-%COMP%], \n.pricing-editor__preview-line[_ngcontent-%COMP%], \n.pricing-editor__preview-total[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.7rem;\n}\n.pricing-editor__preview-head[_ngcontent-%COMP%] {\n  color: #233d5d;\n  font-size: 0.9rem;\n  font-weight: 900;\n}\n.pricing-editor__preview-line[_ngcontent-%COMP%] {\n  color: rgba(56, 78, 108, 0.86);\n  font-size: 0.9rem;\n}\n.pricing-editor__preview-total[_ngcontent-%COMP%] {\n  padding-top: 0.72rem;\n  border-top: 1px solid rgba(136, 157, 186, 0.22);\n  color: #21425f;\n  font-size: 1rem;\n  font-weight: 900;\n}\n.pricing-editor__preview-total[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #20806d;\n  font-size: 1.55rem;\n  line-height: 1;\n}\n.pricing-editor__preview-line[_ngcontent-%COMP%]   strong.positive[_ngcontent-%COMP%] {\n  color: #22856f;\n}\n.pricing-editor__preview-line[_ngcontent-%COMP%]   strong.negative[_ngcontent-%COMP%] {\n  color: #b04d4d;\n}\n.pricing-editor__preview-note[_ngcontent-%COMP%] {\n  margin: 0;\n  color: rgba(57, 82, 113, 0.8);\n  font-size: 0.84rem;\n  line-height: 1.55;\n}\n.pricing-editor__preview-details[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.42rem;\n  padding-top: 0.72rem;\n  border-top: 1px solid rgba(136, 157, 186, 0.18);\n}\n.pricing-editor__preview-detail[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.8rem;\n  min-width: 0;\n  color: rgba(57, 82, 113, 0.82);\n  font-size: 0.84rem;\n}\n.pricing-editor__preview-detail[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.12rem;\n  min-width: 0;\n}\n.pricing-editor__preview-detail[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #233d5d;\n  font-weight: 900;\n}\n.pricing-editor__preview-detail[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  overflow: hidden;\n  color: rgba(65, 87, 116, 0.76);\n  font-style: normal;\n  line-height: 1.35;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.pricing-editor__wizard-body[_ngcontent-%COMP%], \n.pricing-editor__wizard-body[_ngcontent-%COMP%]   .pricing-editor__main[_ngcontent-%COMP%], \n.pricing-editor__wizard-body[_ngcontent-%COMP%]   .pricing-editor__preview[_ngcontent-%COMP%] {\n  min-width: 0;\n  will-change: transform, scroll-position;\n  transform: translateZ(0);\n  -webkit-transform: translate3d(0, 0, 0);\n  backface-visibility: hidden;\n}\n.pricing-editor__wizard-body[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  width: 100%;\n  max-width: 100%;\n  height: 100%;\n  min-height: 0;\n  display: grid;\n  align-content: start;\n  gap: 0.92rem;\n  overflow-x: hidden;\n  overflow-y: auto;\n  padding: 0.12rem 0 0.8rem;\n  scrollbar-width: thin;\n  scrollbar-color: #8aa0b8 #eaf1fa;\n  scrollbar-gutter: stable;\n}\n.pricing-editor__wizard-body[_ngcontent-%COMP%]   .pricing-editor__main[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.pricing-editor__preview--wizard-sticky[_ngcontent-%COMP%] {\n  position: sticky;\n  top: -0.12rem;\n  z-index: 2;\n  align-self: start;\n  margin-top: -0.12rem;\n  padding-top: 0.12rem;\n  padding-bottom: 0.18rem;\n  will-change: transform;\n  transform: translateZ(0);\n  backface-visibility: hidden;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(249, 252, 255, 0.98) 0%,\n      rgba(249, 252, 255, 0.88) 100%);\n}\n@container (max-width: 760px) {\n  .pricing-editor__layout[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .pricing-editor--summary-popup[_ngcontent-%COMP%]   .pricing-editor__head[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr) auto;\n    align-items: start;\n  }\n  .pricing-editor--summary-popup[_ngcontent-%COMP%]   .pricing-editor__head-actions[_ngcontent-%COMP%] {\n    justify-self: end;\n  }\n  .pricing-editor__grid[_ngcontent-%COMP%], \n   .pricing-editor__grid--compact[_ngcontent-%COMP%], \n   .pricing-editor__rule-grid[_ngcontent-%COMP%], \n   .pricing-editor__rule-grid--time[_ngcontent-%COMP%], \n   .pricing-editor__rule-grid--time.pricing-editor__rule-grid--slots[_ngcontent-%COMP%], \n   .pricing-editor__promo-card[_ngcontent-%COMP%], \n   .pricing-editor__preview[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .pricing-editor__surface[_ngcontent-%COMP%] {\n    padding: 0.82rem;\n    gap: 0.72rem;\n  }\n  .pricing-editor__mode-switch[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    gap: 0.24rem;\n    padding: 0.22rem;\n  }\n  .pricing-editor__mode-btn[_ngcontent-%COMP%] {\n    min-height: 38px;\n    padding: 0 0.2rem;\n    font-size: 0.76rem;\n    line-height: 1.1;\n  }\n  .pricing-editor__field[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n    font-size: 0.68rem;\n  }\n  .pricing-editor__field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n   .pricing-editor__select-shell[_ngcontent-%COMP%], \n   .pricing-editor__money-field[_ngcontent-%COMP%] {\n    min-height: 42px;\n  }\n  .pricing-editor__select-shell[_ngcontent-%COMP%]     .mat-mdc-select-trigger {\n    min-height: 40px;\n  }\n  .pricing-editor__open-btn--summary[_ngcontent-%COMP%] {\n    width: 100%;\n    justify-content: center;\n  }\n}\n@media (max-width: 760px) {\n  .pricing-editor__preview--summary[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .pricing-editor__wizard-body[_ngcontent-%COMP%] {\n    padding: 0.08rem 0.2rem 0.72rem 0.08rem;\n  }\n  .pricing-editor__preview--wizard-sticky[_ngcontent-%COMP%] {\n    top: -0.08rem;\n    margin-top: -0.08rem;\n    padding-top: 0.08rem;\n  }\n}\n/*# sourceMappingURL=pricing-editor.component.css.map */", "\n[_nghost-%COMP%] {\n  display: contents;\n}\n/*# sourceMappingURL=pricing-editor-popup.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PricingEditorPopupComponent, [{
    type: Component,
    args: [{ selector: "app-pricing-editor-popup", standalone: true, imports: [
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
      PopupComponent,
      PricingSlotPanelComponent,
      I18nPipe
    ], changeDetection: ChangeDetectionStrategy.OnPush, providers: [AppMenuDispatcher], template: `@if (popup; as popup) {
  <app-popup [model]="pricingPopupModel(popup)" [zIndex]="popup.zIndex">
    <div class="pricing-editor__wizard-body">
      @if (resolvedConfig.showPreview && showPricingInfoPanel) {
        <aside class="pricing-editor__preview pricing-editor__preview--wizard-sticky">
          <ng-container [ngTemplateOutlet]="pricingWizardPreviewCard"></ng-container>
        </aside>
      }
      <div class="pricing-editor__main">
        <ng-container [ngTemplateOutlet]="pricingEditorSurfaces"></ng-container>
      </div>
    </div>

    <app-menu-outlet
      [items]="activeRuleScopeMenuItems()"
      (itemSelect)="onRuleScopeMenuSelect($event)"
    ></app-menu-outlet>
    
    <ng-template #pricingEditorSurfaces>
      <section class="pricing-editor__surface">
        <div class="pricing-editor__grid">
          <label class="pricing-editor__field pricing-editor__field--money">
            <span>{{ basePriceFieldLabel() | i18n }}</span>
            <div class="pricing-editor__money-field">
              <span class="pricing-editor__money-prefix">{{ currencySymbol(workingPricing.currency) }}</span>
              <input
                type="number"
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
                min="0"
                step="0.01"
                [ngModel]="workingPricing.minPrice ?? ''"
                (ngModelChange)="onNullableMoneyFieldChange('minPrice', $event)"
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
                min="0"
                step="0.01"
                [ngModel]="workingPricing.maxPrice ?? ''"
                (ngModelChange)="onNullableMoneyFieldChange('maxPrice', $event)"
                [disabled]="readOnly"
                [placeholder]="'pricing.no.maximum' | i18n"
                />
              <span class="pricing-editor__money-code">{{ workingPricing.currency }}</span>
            </div>
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

    <ng-template #pricingWizardPreviewCard>
      <div class="pricing-editor__preview-card">
        <div class="pricing-editor__preview-head">
          <span>{{ 'event.editor.pricing.current.review' | i18n }}</span>
          <mat-icon>query_stats</mat-icon>
        </div>
        <div class="pricing-editor__preview-line">
          <span>{{ 'pricing.base' | i18n }}</span>
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
      </div>
    </ng-template>
    
    <ng-template #pricingPreviewCards>
      <div class="pricing-editor__preview-card">
        <div class="pricing-editor__preview-head">
          <span>{{ 'event.editor.pricing.current.review' | i18n }}</span>
          <mat-icon>query_stats</mat-icon>
        </div>
        <div class="pricing-editor__preview-line">
          <span>{{ 'pricing.base' | i18n }}</span>
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
      </div>
    </ng-template>
  </app-popup>
}
`, styles: ["/* src/app/shared/ui/components/core/form/inputs/pricing-editor/pricing-editor.component.scss */\n:host {\n  display: block;\n  width: 100%;\n  container-type: inline-size;\n  min-width: 0;\n}\n.pricing-editor {\n  display: grid;\n  min-width: 0;\n  gap: 1rem;\n  padding: 1rem;\n  border-radius: 24px;\n  border: 1px solid rgba(143, 168, 201, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.97) 0%,\n      rgba(245, 249, 255, 0.94) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(113, 193, 177, 0.12),\n      transparent 34%),\n    radial-gradient(\n      circle at bottom left,\n      rgba(135, 175, 226, 0.12),\n      transparent 42%);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 18px 42px rgba(32, 57, 92, 0.08);\n}\n.pricing-editor--summary-popup {\n  gap: 0.62rem;\n  padding: 0.62rem 0.72rem;\n  border-radius: 16px;\n  border-color: rgba(109, 149, 143, 0.24);\n}\n.pricing-editor--summary-popup.pricing-editor--enabled {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(241, 250, 247, 0.97) 0%,\n      rgba(231, 243, 239, 0.94) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(117, 194, 169, 0.18),\n      transparent 34%),\n    radial-gradient(\n      circle at bottom left,\n      rgba(125, 170, 221, 0.14),\n      transparent 42%);\n}\n.pricing-editor--summary-popup:not(.pricing-editor--enabled) {\n  border-color: rgba(128, 147, 175, 0.22);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(247, 250, 254, 0.97) 0%,\n      rgba(237, 243, 249, 0.94) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(146, 165, 194, 0.1),\n      transparent 36%);\n}\n.pricing-editor--embedded {\n  height: 100%;\n  min-height: 0;\n  padding: 0;\n  border: 0;\n  border-radius: 0;\n  background: transparent;\n  box-shadow: none;\n  overflow: hidden;\n}\n.pricing-editor--summary-popup.pricing-editor--enabled .pricing-editor__title-text,\n.pricing-editor--summary-popup.pricing-editor--enabled .pricing-editor__title-text mat-icon {\n  color: #235d53;\n}\n.pricing-editor--summary-popup.pricing-editor--enabled .pricing-editor__preview-card {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.94) 0%,\n      rgba(245, 251, 248, 0.9) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(118, 198, 175, 0.14),\n      transparent 44%);\n}\n.pricing-editor--summary-popup.pricing-editor--enabled .pricing-editor__preview-card--light {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.94) 0%,\n      rgba(247, 251, 250, 0.9) 100%),\n    radial-gradient(\n      circle at bottom left,\n      rgba(133, 176, 227, 0.1),\n      transparent 48%);\n}\n.pricing-editor__head {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: start;\n  gap: 0.75rem;\n}\n.pricing-editor--summary-popup .pricing-editor__head {\n  gap: 0.62rem;\n}\n.pricing-editor__head-actions {\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.7rem;\n  flex-wrap: wrap;\n  justify-self: end;\n  align-self: start;\n}\n.pricing-editor--summary-popup .pricing-editor__head-actions {\n  gap: 0.5rem;\n}\n.pricing-editor__title {\n  min-width: 0;\n}\n.pricing-editor__title-copy {\n  display: grid;\n  min-width: 0;\n}\n.pricing-editor__title-text {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n  color: #213a5b;\n  font-size: 1rem;\n  font-weight: 800;\n}\n.pricing-editor__title-text mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.pricing-editor__subtitle {\n  color: rgba(37, 58, 88, 0.74);\n  font-size: 0.8rem;\n  line-height: 1.4;\n}\n.pricing-editor__status,\n.pricing-editor__toggle,\n.pricing-editor__add-btn,\n.pricing-editor__rule-remove,\n.pricing-editor__open-btn {\n  border: 0;\n  transition:\n    transform 0.18s ease,\n    box-shadow 0.18s ease,\n    background-color 0.18s ease,\n    opacity 0.18s ease;\n}\n.pricing-editor__status,\n.pricing-editor__toggle {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.4rem;\n  padding: 0.36rem 0.64rem;\n  border-radius: 999px;\n  font-size: 0.84rem;\n  font-weight: 800;\n}\n.pricing-editor__status {\n  color: #61748d;\n  background: rgba(239, 244, 251, 0.95);\n  box-shadow: inset 0 0 0 1px rgba(128, 149, 176, 0.24);\n}\n.pricing-editor__status.is-dynamic,\n.pricing-editor__toggle.is-on {\n  color: #23695f;\n  background: rgba(230, 247, 241, 0.95);\n  box-shadow: inset 0 0 0 1px rgba(85, 175, 147, 0.24);\n}\n.pricing-editor__toggle {\n  cursor: pointer;\n  color: #61748d;\n  background: rgba(239, 244, 251, 0.95);\n  border: 1px solid rgba(128, 149, 176, 0.24);\n  box-shadow: inset 0 0 0 0 rgba(0, 0, 0, 0);\n}\n.pricing-editor__toggle--header {\n  min-width: 82px;\n  min-height: 38px;\n  padding: 0.3rem 0.62rem;\n  border-radius: 999px;\n  font-size: 0.76rem;\n  font-weight: 800;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n  box-shadow: 0 2px 7px rgba(29, 53, 86, 0.08);\n}\n.pricing-editor__toggle--header.is-on {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf8ee 0%,\n      #ddf1e2 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.pricing-editor__toggle--header:not(.is-on) {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f7fb 0%,\n      #e9eff7 100%);\n  border-color: rgba(86, 108, 145, 0.22);\n  color: #5b6e8e;\n}\n.pricing-editor__toggle mat-icon,\n.pricing-editor__status mat-icon {\n  width: 24px;\n  height: 24px;\n  font-size: 24px;\n}\n.pricing-editor__toggle--header mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.pricing-editor__open-btn {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.5rem;\n  min-height: 40px;\n  padding: 0.62rem 0.9rem;\n  border-radius: 14px;\n  color: #214863;\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #eff6ff 100%);\n  box-shadow: inset 0 0 0 1px rgba(99, 137, 184, 0.26), 0 10px 22px rgba(31, 58, 97, 0.08);\n  cursor: pointer;\n  font-size: 0.86rem;\n  font-weight: 800;\n}\n.pricing-editor__open-btn mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.pricing-editor__summary-copy {\n  display: grid;\n  gap: 0.35rem;\n}\n.pricing-editor__summary-actions {\n  display: flex;\n  justify-content: flex-start;\n}\n.pricing-editor__open-btn--summary {\n  min-width: 138px;\n  min-height: 38px;\n  padding: 0.42rem 0.82rem;\n  border-radius: 999px;\n  font-size: 0.8rem;\n  box-shadow: 0 2px 7px rgba(29, 53, 86, 0.08);\n}\n.pricing-editor__layout {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(240px, 300px);\n  gap: 1rem;\n  align-items: start;\n}\n.pricing-editor--embedded .pricing-editor__layout {\n  height: 100%;\n  min-height: 0;\n  overflow-y: auto;\n  overflow-x: hidden;\n  padding: 0.12rem 0 0.8rem;\n  box-sizing: border-box;\n  scrollbar-width: thin;\n  scrollbar-color: #8aa0b8 #eaf1fa;\n}\n.pricing-editor__main {\n  display: grid;\n  gap: 0.92rem;\n}\n.pricing-editor__surface {\n  display: grid;\n  position: relative;\n  z-index: 0;\n  gap: 0.86rem;\n  padding: 1rem;\n  border-radius: 20px;\n  border: 1px solid rgba(136, 161, 195, 0.28);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.98) 0%,\n      rgba(250, 252, 255, 0.94) 100%),\n    radial-gradient(\n      circle at top left,\n      rgba(127, 174, 227, 0.1),\n      transparent 46%);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);\n  contain: layout;\n  transform: translateZ(0);\n  backface-visibility: hidden;\n}\n.pricing-editor__section-head {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.8rem;\n  color: #1f3b5a;\n  font-size: 0.95rem;\n  font-weight: 900;\n}\n.pricing-editor__section-head > span {\n  min-width: 0;\n}\n.pricing-editor__section-head .pricing-editor__toggle {\n  justify-self: end;\n}\n.pricing-editor__toggle:disabled {\n  cursor: default;\n  opacity: 0.66;\n  pointer-events: none;\n  filter: saturate(0.66);\n  box-shadow: none;\n}\n.pricing-editor__add-btn:disabled,\n.pricing-editor__rule-remove:disabled,\n.pricing-editor__open-btn:disabled {\n  cursor: default;\n  opacity: 0.58;\n  pointer-events: none;\n  filter: grayscale(0.35);\n  box-shadow: none;\n}\n.pricing-editor--readonly .pricing-editor__summary-actions {\n  display: none;\n}\n:host-context(.popup-panel-event-editor-readonly) .pricing-editor__summary-actions {\n  display: none;\n}\n:host-context(.popup-panel-event-editor-readonly) .pricing-editor__toggle,\n:host-context(.popup-panel-event-editor-readonly) .pricing-editor__add-btn,\n:host-context(.popup-panel-event-editor-readonly) .pricing-editor__rule-remove,\n:host-context(.popup-panel-event-editor-readonly) .pricing-editor__open-btn {\n  cursor: default;\n  opacity: 0.58;\n  pointer-events: none;\n  filter: grayscale(0.35);\n  box-shadow: none;\n}\n:host-context(.popup-panel-event-editor-readonly) .pricing-editor__toggle {\n  opacity: 0.66;\n  filter: saturate(0.66);\n}\n.pricing-editor__grid,\n.pricing-editor__rule-grid,\n.pricing-editor__promo-card {\n  display: grid;\n  column-gap: 1rem;\n  row-gap: 1rem;\n}\n.pricing-editor__grid {\n  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));\n}\n.pricing-editor__rule-grid {\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));\n}\n.pricing-editor__rule-grid.pricing-editor__rule-grid--slots {\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 190px), 1fr));\n}\n.pricing-editor__rule-grid--time:not(.pricing-editor__rule-grid--slots) {\n  grid-template-columns: minmax(260px, 1.55fr) minmax(82px, 0.48fr) minmax(210px, 1.2fr) minmax(92px, 0.52fr);\n}\n.pricing-editor__rule-grid--time.pricing-editor__rule-grid--slots {\n  grid-template-columns: minmax(230px, 1.5fr) minmax(78px, 0.46fr) minmax(195px, 1.18fr) minmax(88px, 0.5fr) minmax(150px, 0.9fr);\n}\n.pricing-editor__rule-grid--time .pricing-editor__field--time-trigger,\n.pricing-editor__rule-grid--time .pricing-editor__field--time-action {\n  min-width: 0;\n}\n.pricing-editor__rule-grid--time .pricing-editor__field--time-offset,\n.pricing-editor__rule-grid--time .pricing-editor__field--time-value {\n  min-width: 0;\n}\n.pricing-editor__promo-card {\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));\n}\n.pricing-editor__grid--compact {\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));\n}\n.pricing-editor__field {\n  display: grid;\n  gap: 0.34rem;\n  min-width: 0;\n}\n.pricing-editor__field--span-full {\n  grid-column: 1/-1;\n}\n.pricing-editor__field > span {\n  color: rgba(31, 57, 88, 0.9);\n  font-size: 0.74rem;\n  font-weight: 800;\n  letter-spacing: 0.01em;\n  text-transform: uppercase;\n}\n.pricing-editor__field input,\n.pricing-editor__select-shell,\n.pricing-editor__money-field,\n.pricing-editor__date-range-field {\n  box-sizing: border-box;\n  width: 100%;\n  min-height: 46px;\n  border-radius: 14px;\n  border: 1px solid rgba(126, 149, 180, 0.28);\n  background: rgba(255, 255, 255, 0.98);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92);\n}\n.pricing-editor__field input {\n  box-sizing: border-box;\n  width: 100%;\n  min-width: 0;\n  text-align: center;\n  color: #213d5d;\n  font: inherit;\n  font-size: 0.96rem;\n  font-weight: 700;\n}\n.pricing-editor__field input:focus {\n  outline: none;\n  border-color: rgba(72, 125, 194, 0.66);\n  box-shadow: 0 0 0 3px rgba(89, 136, 204, 0.12);\n}\n.pricing-editor__date-range-field {\n  width: 100%;\n  min-width: 0;\n  min-height: 0;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  box-shadow: none;\n}\n.pricing-editor__date-range-field ::ng-deep .mat-mdc-text-field-wrapper {\n  display: flex;\n  align-items: center;\n  min-height: 46px;\n  height: 46px;\n  padding: 0 0.08rem 0 0.42rem;\n  border-radius: 14px;\n  background: rgba(255, 255, 255, 0.98);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92);\n  overflow: visible;\n}\n.pricing-editor__date-range-field ::ng-deep .mat-mdc-form-field-flex,\n.pricing-editor__date-range-field ::ng-deep .mat-date-range-input-container {\n  min-height: 46px;\n  height: 46px;\n  align-items: center;\n  min-width: 0;\n}\n.pricing-editor__date-range-field ::ng-deep .mat-date-range-input-container {\n  width: 100%;\n  display: flex;\n  align-items: center;\n  gap: 0.08rem;\n  overflow: visible;\n}\n.pricing-editor__date-range-field ::ng-deep .mat-mdc-form-field-infix {\n  width: auto !important;\n  min-width: 0;\n  min-height: 0;\n  height: 46px;\n  padding: 0;\n  flex: 1 1 auto;\n  display: flex;\n  align-items: center;\n}\n.pricing-editor__date-range-field ::ng-deep .mat-date-range-input-separator {\n  color: rgba(64, 87, 117, 0.72);\n  padding: 0 0.02rem;\n  margin: 0;\n  white-space: nowrap;\n  flex: 0 0 auto;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  line-height: 46px;\n}\n.pricing-editor__date-range-field ::ng-deep .mdc-notched-outline__leading,\n.pricing-editor__date-range-field ::ng-deep .mdc-notched-outline__notch,\n.pricing-editor__date-range-field ::ng-deep .mdc-notched-outline__trailing {\n  border-color: rgba(126, 149, 180, 0.28);\n}\n.pricing-editor__date-range-field ::ng-deep .mat-mdc-form-field-subscript-wrapper {\n  display: none;\n}\n.pricing-editor__date-range-field ::ng-deep .mat-date-range-input-wrapper,\n.pricing-editor__date-range-field ::ng-deep .mat-date-range-input-start-wrapper,\n.pricing-editor__date-range-field ::ng-deep .mat-date-range-input-end-wrapper {\n  display: flex;\n  align-items: center;\n  flex: 1 1 0;\n  min-width: 0;\n  width: 100%;\n  max-width: none;\n  min-height: 46px;\n  height: 46px;\n  overflow: visible;\n}\n.pricing-editor__date-range-field ::ng-deep .mat-date-range-input-start-wrapper {\n  justify-content: flex-end;\n}\n.pricing-editor__date-range-field ::ng-deep .mat-date-range-input-end-wrapper {\n  justify-content: flex-start;\n}\n.pricing-editor__date-range-field ::ng-deep .mat-date-range-input-mirror {\n  min-height: 46px;\n  height: 46px;\n  display: inline-flex;\n  align-items: center;\n  line-height: 46px;\n}\n.pricing-editor__date-range-field.mat-focused ::ng-deep .mdc-notched-outline__leading,\n.pricing-editor__date-range-field.mat-focused ::ng-deep .mdc-notched-outline__notch,\n.pricing-editor__date-range-field.mat-focused ::ng-deep .mdc-notched-outline__trailing {\n  border-color: rgba(72, 125, 194, 0.66);\n}\n.pricing-editor__date-range-field ::ng-deep .mat-date-range-input-inner,\n.pricing-editor__date-range-field ::ng-deep input {\n  min-width: 0;\n  width: 100%;\n  min-height: 0;\n  height: 100% !important;\n  padding: 0 0.04rem;\n  color: #213d5d;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 700;\n  line-height: 46px;\n  box-sizing: border-box;\n  background: transparent !important;\n  border: 0 !important;\n  border-radius: 0 !important;\n  box-shadow: none !important;\n  align-self: stretch;\n  display: block;\n  white-space: nowrap;\n  text-overflow: clip;\n  overflow: hidden;\n}\n.pricing-editor__date-range-field ::ng-deep .mat-date-range-input-start-wrapper .mat-date-range-input-inner,\n.pricing-editor__date-range-field ::ng-deep .mat-date-range-input-start-wrapper input {\n  text-align: center;\n}\n.pricing-editor__date-range-field ::ng-deep .mat-date-range-input-end-wrapper .mat-date-range-input-inner,\n.pricing-editor__date-range-field ::ng-deep .mat-date-range-input-end-wrapper input {\n  text-align: center;\n}\n.pricing-editor__date-range-field ::ng-deep .mat-mdc-form-field-flex {\n  min-height: 46px;\n  height: 46px;\n  display: flex;\n  align-items: center !important;\n}\n.pricing-editor__date-range-field ::ng-deep .mat-mdc-form-field-icon-suffix,\n.pricing-editor__date-range-field ::ng-deep .mat-datepicker-toggle {\n  align-self: center;\n  flex: 0 0 32px;\n  width: 32px;\n  min-width: 32px;\n}\n.pricing-editor__date-range-field ::ng-deep .mat-mdc-icon-button {\n  width: 32px;\n  height: 32px;\n  padding: 4px;\n}\n.pricing-editor__select-shell {\n  display: flex;\n  align-items: center;\n  padding: 0 0.7rem;\n}\n.pricing-editor__select-shell--static {\n  justify-content: center;\n  color: #213d5d;\n  font-weight: 700;\n}\n.pricing-editor__select-shell ::ng-deep .mat-mdc-select-trigger {\n  min-height: 44px;\n}\n.pricing-editor__money-field {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.48rem;\n  padding: 0 0.72rem;\n}\n.pricing-editor__money-prefix,\n.pricing-editor__money-code {\n  color: rgba(65, 86, 115, 0.78);\n  font-size: 0.84rem;\n  font-weight: 800;\n}\n.pricing-editor__money-field input {\n  padding: 0;\n  border: 0;\n  background: transparent;\n  box-shadow: none;\n}\n.pricing-editor__rules,\n.pricing-editor__promo-list {\n  display: grid;\n  gap: 1.08rem;\n}\n.pricing-editor__promo-list {\n  margin-top: 0.28rem;\n}\n.pricing-editor__rule-card,\n.pricing-editor__promo-card {\n  box-sizing: border-box;\n  position: relative;\n  z-index: 0;\n  align-items: end;\n  padding: 0.86rem;\n  border-radius: 18px;\n  border: 1px solid rgba(125, 151, 185, 0.24);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.98) 0%,\n      rgba(246, 250, 255, 0.92) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(110, 183, 172, 0.12),\n      transparent 36%);\n  transform: translateZ(0);\n  backface-visibility: hidden;\n  contain: layout;\n}\n.pricing-editor__rule-card {\n  padding-right: 3.2rem;\n}\n.pricing-editor__promo-card {\n  padding-right: 3.2rem;\n}\n.pricing-editor__rule-remove {\n  position: absolute;\n  top: 0.75rem;\n  right: 0.75rem;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  cursor: pointer;\n  color: #b4233a;\n  background: rgba(255, 235, 238, 0.96);\n  box-shadow: inset 0 0 0 1px rgba(214, 64, 88, 0.26);\n}\n.pricing-editor__rule-remove:hover {\n  color: #9f1830;\n  background: rgba(255, 224, 229, 0.98);\n  box-shadow: inset 0 0 0 1px rgba(214, 64, 88, 0.34), 0 10px 20px rgba(173, 38, 60, 0.16);\n}\n.pricing-editor__rule-remove mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.pricing-editor__add-btn {\n  justify-self: start;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.45rem;\n  padding: 0.68rem 0.94rem;\n  border-radius: 14px;\n  cursor: pointer;\n  color: #214863;\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #eff6ff 100%);\n  box-shadow: inset 0 0 0 1px rgba(99, 137, 184, 0.26), 0 10px 22px rgba(31, 58, 97, 0.08);\n  font-size: 0.88rem;\n  font-weight: 800;\n}\n.pricing-editor__add-btn mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.pricing-editor__hint {\n  margin: 0;\n  color: rgba(69, 88, 113, 0.8);\n  font-size: 0.86rem;\n  line-height: 1.55;\n}\n.pricing-editor__preview-note--billing {\n  margin: 0;\n  padding: 0.62rem 0.72rem;\n  border-radius: 10px;\n  background: rgba(30, 132, 111, 0.08);\n  color: rgba(33, 92, 80, 0.92);\n  font-size: 0.8rem;\n  line-height: 1.45;\n}\n.pricing-editor__preview {\n  display: grid;\n  gap: 0.82rem;\n  min-width: 0;\n  transform: translateZ(0);\n  backface-visibility: hidden;\n}\n.pricing-editor__preview--summary {\n  grid-template-columns: minmax(0, 1fr);\n  margin-block-start: var(--pricing-summary-preview-offset, 0);\n}\n.pricing-editor__preview-card {\n  display: grid;\n  gap: 0.72rem;\n  min-width: 0;\n  padding: 1rem;\n  border-radius: 20px;\n  border: 1px solid rgba(126, 152, 188, 0.28);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.98) 0%,\n      rgba(247, 251, 255, 0.94) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(118, 198, 175, 0.15),\n      transparent 44%);\n}\n.pricing-editor__preview-card--light {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.98) 0%,\n      rgba(250, 252, 255, 0.95) 100%),\n    radial-gradient(\n      circle at bottom left,\n      rgba(133, 176, 227, 0.12),\n      transparent 48%);\n}\n.pricing-editor__preview-head,\n.pricing-editor__preview-line,\n.pricing-editor__preview-total {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.7rem;\n}\n.pricing-editor__preview-head {\n  color: #233d5d;\n  font-size: 0.9rem;\n  font-weight: 900;\n}\n.pricing-editor__preview-line {\n  color: rgba(56, 78, 108, 0.86);\n  font-size: 0.9rem;\n}\n.pricing-editor__preview-total {\n  padding-top: 0.72rem;\n  border-top: 1px solid rgba(136, 157, 186, 0.22);\n  color: #21425f;\n  font-size: 1rem;\n  font-weight: 900;\n}\n.pricing-editor__preview-total strong {\n  color: #20806d;\n  font-size: 1.55rem;\n  line-height: 1;\n}\n.pricing-editor__preview-line strong.positive {\n  color: #22856f;\n}\n.pricing-editor__preview-line strong.negative {\n  color: #b04d4d;\n}\n.pricing-editor__preview-note {\n  margin: 0;\n  color: rgba(57, 82, 113, 0.8);\n  font-size: 0.84rem;\n  line-height: 1.55;\n}\n.pricing-editor__preview-details {\n  display: grid;\n  gap: 0.42rem;\n  padding-top: 0.72rem;\n  border-top: 1px solid rgba(136, 157, 186, 0.18);\n}\n.pricing-editor__preview-detail {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.8rem;\n  min-width: 0;\n  color: rgba(57, 82, 113, 0.82);\n  font-size: 0.84rem;\n}\n.pricing-editor__preview-detail > span {\n  display: grid;\n  gap: 0.12rem;\n  min-width: 0;\n}\n.pricing-editor__preview-detail strong {\n  color: #233d5d;\n  font-weight: 900;\n}\n.pricing-editor__preview-detail em {\n  overflow: hidden;\n  color: rgba(65, 87, 116, 0.76);\n  font-style: normal;\n  line-height: 1.35;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.pricing-editor__wizard-body,\n.pricing-editor__wizard-body .pricing-editor__main,\n.pricing-editor__wizard-body .pricing-editor__preview {\n  min-width: 0;\n  will-change: transform, scroll-position;\n  transform: translateZ(0);\n  -webkit-transform: translate3d(0, 0, 0);\n  backface-visibility: hidden;\n}\n.pricing-editor__wizard-body {\n  box-sizing: border-box;\n  width: 100%;\n  max-width: 100%;\n  height: 100%;\n  min-height: 0;\n  display: grid;\n  align-content: start;\n  gap: 0.92rem;\n  overflow-x: hidden;\n  overflow-y: auto;\n  padding: 0.12rem 0 0.8rem;\n  scrollbar-width: thin;\n  scrollbar-color: #8aa0b8 #eaf1fa;\n  scrollbar-gutter: stable;\n}\n.pricing-editor__wizard-body .pricing-editor__main {\n  width: 100%;\n}\n.pricing-editor__preview--wizard-sticky {\n  position: sticky;\n  top: -0.12rem;\n  z-index: 2;\n  align-self: start;\n  margin-top: -0.12rem;\n  padding-top: 0.12rem;\n  padding-bottom: 0.18rem;\n  will-change: transform;\n  transform: translateZ(0);\n  backface-visibility: hidden;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(249, 252, 255, 0.98) 0%,\n      rgba(249, 252, 255, 0.88) 100%);\n}\n@container (max-width: 760px) {\n  .pricing-editor__layout {\n    grid-template-columns: 1fr;\n  }\n  .pricing-editor--summary-popup .pricing-editor__head {\n    grid-template-columns: minmax(0, 1fr) auto;\n    align-items: start;\n  }\n  .pricing-editor--summary-popup .pricing-editor__head-actions {\n    justify-self: end;\n  }\n  .pricing-editor__grid,\n  .pricing-editor__grid--compact,\n  .pricing-editor__rule-grid,\n  .pricing-editor__rule-grid--time,\n  .pricing-editor__rule-grid--time.pricing-editor__rule-grid--slots,\n  .pricing-editor__promo-card,\n  .pricing-editor__preview {\n    grid-template-columns: 1fr;\n  }\n  .pricing-editor__surface {\n    padding: 0.82rem;\n    gap: 0.72rem;\n  }\n  .pricing-editor__mode-switch {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    gap: 0.24rem;\n    padding: 0.22rem;\n  }\n  .pricing-editor__mode-btn {\n    min-height: 38px;\n    padding: 0 0.2rem;\n    font-size: 0.76rem;\n    line-height: 1.1;\n  }\n  .pricing-editor__field > span {\n    font-size: 0.68rem;\n  }\n  .pricing-editor__field input,\n  .pricing-editor__select-shell,\n  .pricing-editor__money-field {\n    min-height: 42px;\n  }\n  .pricing-editor__select-shell ::ng-deep .mat-mdc-select-trigger {\n    min-height: 40px;\n  }\n  .pricing-editor__open-btn--summary {\n    width: 100%;\n    justify-content: center;\n  }\n}\n@media (max-width: 760px) {\n  .pricing-editor__preview--summary {\n    grid-template-columns: 1fr;\n  }\n  .pricing-editor__wizard-body {\n    padding: 0.08rem 0.2rem 0.72rem 0.08rem;\n  }\n  .pricing-editor__preview--wizard-sticky {\n    top: -0.08rem;\n    margin-top: -0.08rem;\n    padding-top: 0.08rem;\n  }\n}\n/*# sourceMappingURL=pricing-editor.component.css.map */\n", "/* src/app/shared/ui/components/core/form/inputs/pricing-editor/pricing-editor-popup/pricing-editor-popup.component.scss */\n:host {\n  display: contents;\n}\n/*# sourceMappingURL=pricing-editor-popup.component.css.map */\n"] }]
  }], () => [], { popup: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PricingEditorPopupComponent, { className: "PricingEditorPopupComponent", filePath: "app/shared/ui/components/core/form/inputs/pricing-editor/pricing-editor-popup/pricing-editor-popup.component.ts", lineNumber: 61 });
})();
export {
  PricingEditorPopupComponent
};
//# sourceMappingURL=pricing-editor-popup.component-D77MIT6Q.js.map
