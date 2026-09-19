import {
  PopupPresenceStore
} from "./chunk-ADBOYRJ7.js";
import {
  AppMenuComponent
} from "./chunk-53UGBDSO.js";
import {
  FormsModule,
  I18nPipe,
  MatIcon,
  MatIconModule,
  NgControlStatus,
  NgModel
} from "./chunk-L6HJFJOR.js";
import {
  CommonModule,
  NgClass
} from "./chunk-SCHUURLR.js";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  inject,
  setClassMetadata,
  setClassMetadataAsync,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefer,
  ɵɵdeferOnImmediate,
  ɵɵdefineComponent,
  ɵɵdomTemplate,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction2,
  ɵɵpureFunction4,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-EV3I3YNV.js";

// src/app/shared/ui/components/core/popup/popup.component.ts
var _c0 = ["*"];
var PopupComponent_Conditional_3_Conditional_6_For_2_Conditional_1_Defer_1_DepsFn = () => [NgControlStatus, NgModel, import("./date-input.component-ZFH6PSJF.js").then((m) => m.DateInputComponent)];
var _c1 = (a0, a1) => [a0, a1];
var _c2 = (a0, a1, a2, a3) => [a0, a1, a2, a3];
var _c3 = () => [];
var _forTrack0 = ($index, $item) => $item.id;
function PopupComponent_Conditional_3_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.popupModel.headerLabelIcon);
  }
}
function PopupComponent_Conditional_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 8);
    \u0275\u0275conditionalCreate(1, PopupComponent_Conditional_3_Conditional_2_Conditional_1_Template, 2, 1, "mat-icon");
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("data-i18n-ignore", ctx_r0.popupModel.translateHeaderLabel === false ? "" : null);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.popupModel.headerLabelIcon ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.popupModel.translateHeaderLabel === false ? ctx_r0.popupModel.headerLabel : \u0275\u0275pipeBind1(4, 3, ctx_r0.popupModel.headerLabel));
  }
}
function PopupComponent_Conditional_3_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h2");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275attribute("data-i18n-ignore", ctx_r0.popupModel.translateTitle === false ? "" : null);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.popupModel.translateTitle === false ? ctx_r0.popupModel.title : \u0275\u0275pipeBind1(2, 2, ctx_r0.popupModel.title), " ");
  }
}
function PopupComponent_Conditional_3_Conditional_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 17);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275attribute("data-tone", ctx_r0.popupModel.headerTitleBadgeTone ?? "neutral")("data-i18n-ignore", ctx_r0.popupModel.translateHeaderTitleBadge === false ? "" : null);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.popupModel.translateHeaderTitleBadge === false ? ctx_r0.popupModel.headerTitleBadge : \u0275\u0275pipeBind1(2, 3, ctx_r0.popupModel.headerTitleBadge), " ");
  }
}
function PopupComponent_Conditional_3_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 9);
    \u0275\u0275conditionalCreate(1, PopupComponent_Conditional_3_Conditional_3_Conditional_1_Template, 3, 4, "h2");
    \u0275\u0275conditionalCreate(2, PopupComponent_Conditional_3_Conditional_3_Conditional_2_Template, 3, 5, "span", 17);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.popupModel.title ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.popupModel.headerTitleBadge ? 2 : -1);
  }
}
function PopupComponent_Conditional_3_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 10);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("data-i18n-ignore", ctx_r0.popupModel.translateSubtitle === false ? "" : null);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.popupModel.translateSubtitle === false ? ctx_r0.popupModel.subtitle : \u0275\u0275pipeBind1(2, 2, ctx_r0.popupModel.subtitle), " ");
  }
}
function PopupComponent_Conditional_3_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 11);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("data-i18n-ignore", ctx_r0.popupModel.translateSecondarySubtitle === false ? "" : null);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.popupModel.translateSecondarySubtitle === false ? ctx_r0.popupModel.secondarySubtitle : \u0275\u0275pipeBind1(2, 2, ctx_r0.popupModel.secondarySubtitle), " ");
  }
}
function PopupComponent_Conditional_3_Conditional_6_For_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-menu", 19);
    \u0275\u0275listener("itemSelect", function PopupComponent_Conditional_3_Conditional_6_For_2_Conditional_0_Template_app_menu_itemSelect_0_listener($event) {
      \u0275\u0275restoreView(_r2);
      const control_r3 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.selectMenuItem(control_r3, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("kind", control_r3.menuKind ?? "select")("title", control_r3.title ?? null)("trigger", control_r3.trigger ?? null)("items", control_r3.items ?? \u0275\u0275pureFunction0(10, _c3))("groups", control_r3.groups ?? \u0275\u0275pureFunction0(11, _c3))("model", control_r3.model ?? null)("panelAlign", control_r3.panelAlign ?? "auto")("panelMode", control_r3.panelMode ?? "auto")("mobileBreakpointPx", control_r3.mobileBreakpointPx ?? 760)("closeOnSelect", control_r3.closeOnSelect ?? true);
  }
}
function PopupComponent_Conditional_3_Conditional_6_For_2_Conditional_1_Defer_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-date-input", 20);
    \u0275\u0275listener("ngModelChange", function PopupComponent_Conditional_3_Conditional_6_For_2_Conditional_1_Defer_0_Template_app_date_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r4);
      const control_r3 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.changeDateInput(control_r3, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r3 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275property("model", control_r3.model)("ngModel", control_r3.value);
  }
}
function PopupComponent_Conditional_3_Conditional_6_For_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domTemplate(0, PopupComponent_Conditional_3_Conditional_6_For_2_Conditional_1_Defer_0_Template, 1, 2);
    \u0275\u0275defer(1, 0, PopupComponent_Conditional_3_Conditional_6_For_2_Conditional_1_Defer_1_DepsFn);
    \u0275\u0275deferOnImmediate();
  }
}
function PopupComponent_Conditional_3_Conditional_6_For_2_Conditional_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 22);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r3 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, control_r3.label));
  }
}
function PopupComponent_Conditional_3_Conditional_6_For_2_Conditional_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r3 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.actionCounterValue(control_r3));
  }
}
function PopupComponent_Conditional_3_Conditional_6_For_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 21);
    \u0275\u0275listener("click", function PopupComponent_Conditional_3_Conditional_6_For_2_Conditional_2_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r5);
      const control_r3 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.selectAction(control_r3, $event));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, PopupComponent_Conditional_3_Conditional_6_For_2_Conditional_2_Conditional_3_Template, 3, 3, "span", 22);
    \u0275\u0275conditionalCreate(4, PopupComponent_Conditional_3_Conditional_6_For_2_Conditional_2_Conditional_4_Template, 2, 1, "span", 23);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r3 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("ui-popup__action--active", control_r3.active)("ui-popup__action--icon-only", !control_r3.label)("ui-popup__action--compact-mobile", control_r3.compactOnMobile);
    \u0275\u0275property("ngClass", ctx_r0.actionPaletteClass(control_r3))("disabled", control_r3.disabled);
    \u0275\u0275attribute("aria-label", control_r3.ariaLabel || control_r3.label || control_r3.id);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(control_r3.icon);
    \u0275\u0275advance();
    \u0275\u0275conditional(control_r3.label ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.actionCounterValue(control_r3) ? 4 : -1);
  }
}
function PopupComponent_Conditional_3_Conditional_6_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, PopupComponent_Conditional_3_Conditional_6_For_2_Conditional_0_Template, 1, 12, "app-menu", 18)(1, PopupComponent_Conditional_3_Conditional_6_For_2_Conditional_1_Template, 3, 0)(2, PopupComponent_Conditional_3_Conditional_6_For_2_Conditional_2_Template, 5, 12, "button", 15);
  }
  if (rf & 2) {
    const control_r3 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional(ctx_r0.isMenuControl(control_r3) ? 0 : ctx_r0.isDateInputControl(control_r3) ? 1 : 2);
  }
}
function PopupComponent_Conditional_3_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275repeaterCreate(1, PopupComponent_Conditional_3_Conditional_6_For_2_Template, 3, 1, null, null, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.headerControls);
  }
}
function PopupComponent_Conditional_3_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 14);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("data-i18n-ignore", ctx_r0.popupModel.translateHeaderBadge === false ? "" : null);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.popupModel.translateHeaderBadge === false ? ctx_r0.popupModel.headerBadge : \u0275\u0275pipeBind1(2, 2, ctx_r0.popupModel.headerBadge), " ");
  }
}
function PopupComponent_Conditional_3_For_10_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 22);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const headerAction_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, headerAction_r7.label));
  }
}
function PopupComponent_Conditional_3_For_10_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const headerAction_r7 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.actionCounterValue(headerAction_r7));
  }
}
function PopupComponent_Conditional_3_For_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 21);
    \u0275\u0275listener("click", function PopupComponent_Conditional_3_For_10_Template_button_click_0_listener($event) {
      const headerAction_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.selectAction(headerAction_r7, $event));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, PopupComponent_Conditional_3_For_10_Conditional_3_Template, 3, 3, "span", 22);
    \u0275\u0275conditionalCreate(4, PopupComponent_Conditional_3_For_10_Conditional_4_Template, 2, 1, "span", 23);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const headerAction_r7 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("ui-popup__action--active", headerAction_r7.active)("ui-popup__action--icon-only", !headerAction_r7.label)("ui-popup__action--compact-mobile", headerAction_r7.compactOnMobile);
    \u0275\u0275property("ngClass", ctx_r0.actionPaletteClass(headerAction_r7))("disabled", headerAction_r7.disabled);
    \u0275\u0275attribute("aria-label", headerAction_r7.ariaLabel || headerAction_r7.label || headerAction_r7.id);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(headerAction_r7.icon);
    \u0275\u0275advance();
    \u0275\u0275conditional(headerAction_r7.label ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.actionCounterValue(headerAction_r7) ? 4 : -1);
  }
}
function PopupComponent_Conditional_3_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 24);
    \u0275\u0275pipe(1, "i18n");
    \u0275\u0275listener("click", function PopupComponent_Conditional_3_Conditional_11_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.emitClose($event));
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "close");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(1, 1, ctx_r0.closeAriaLabel));
  }
}
function PopupComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "header", 3)(1, "div", 7);
    \u0275\u0275conditionalCreate(2, PopupComponent_Conditional_3_Conditional_2_Template, 5, 5, "span", 8);
    \u0275\u0275conditionalCreate(3, PopupComponent_Conditional_3_Conditional_3_Template, 3, 2, "span", 9);
    \u0275\u0275conditionalCreate(4, PopupComponent_Conditional_3_Conditional_4_Template, 3, 4, "p", 10);
    \u0275\u0275conditionalCreate(5, PopupComponent_Conditional_3_Conditional_5_Template, 3, 4, "p", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, PopupComponent_Conditional_3_Conditional_6_Template, 3, 0, "div", 12);
    \u0275\u0275elementStart(7, "div", 13);
    \u0275\u0275conditionalCreate(8, PopupComponent_Conditional_3_Conditional_8_Template, 3, 4, "span", 14);
    \u0275\u0275repeaterCreate(9, PopupComponent_Conditional_3_For_10_Template, 5, 12, "button", 15, _forTrack0);
    \u0275\u0275conditionalCreate(11, PopupComponent_Conditional_3_Conditional_11_Template, 4, 3, "button", 16);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction4(10, _c2, ctx_r0.headerToneClass(), ctx_r0.headerLayoutClass(), ctx_r0.headerPaletteClass(), ctx_r0.headerTitleToneClass()));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.popupModel.headerLabel ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.popupModel.title || ctx_r0.popupModel.headerTitleBadge ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.popupModel.subtitle ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.popupModel.secondarySubtitle ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.hasHeaderControls ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275classProp("ui-popup__header-actions--empty", !ctx_r0.hasHeaderBadge && !ctx_r0.hasHeaderActions && !ctx_r0.showClose);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.popupModel.headerBadge ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.headerActions);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.showClose ? 11 : -1);
  }
}
function PopupComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 25);
    \u0275\u0275pipe(1, "i18n");
    \u0275\u0275listener("click", function PopupComponent_Conditional_4_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.emitClose($event));
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "close");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(1, 1, ctx_r0.closeAriaLabel));
  }
}
function PopupComponent_Conditional_5_Conditional_1_For_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-menu", 19);
    \u0275\u0275listener("itemSelect", function PopupComponent_Conditional_5_Conditional_1_For_2_Conditional_0_Template_app_menu_itemSelect_0_listener($event) {
      \u0275\u0275restoreView(_r10);
      const control_r11 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.selectMenuItem(control_r11, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r11 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("kind", control_r11.menuKind ?? "select")("title", control_r11.title ?? null)("trigger", control_r11.trigger ?? null)("items", control_r11.items ?? \u0275\u0275pureFunction0(10, _c3))("groups", control_r11.groups ?? \u0275\u0275pureFunction0(11, _c3))("model", control_r11.model ?? null)("panelAlign", control_r11.panelAlign ?? "auto")("panelMode", control_r11.panelMode ?? "auto")("mobileBreakpointPx", control_r11.mobileBreakpointPx ?? 760)("closeOnSelect", control_r11.closeOnSelect ?? true);
  }
}
function PopupComponent_Conditional_5_Conditional_1_For_2_Conditional_1_Defer_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-date-input", 20);
    \u0275\u0275listener("ngModelChange", function PopupComponent_Conditional_5_Conditional_1_For_2_Conditional_1_Defer_0_Template_app_date_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r12);
      const control_r11 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.changeDateInput(control_r11, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r11 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275property("model", control_r11.model)("ngModel", control_r11.value);
  }
}
function PopupComponent_Conditional_5_Conditional_1_For_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domTemplate(0, PopupComponent_Conditional_5_Conditional_1_For_2_Conditional_1_Defer_0_Template, 1, 2);
    \u0275\u0275defer(1, 0, PopupComponent_Conditional_3_Conditional_6_For_2_Conditional_1_Defer_1_DepsFn);
    \u0275\u0275deferOnImmediate();
  }
}
function PopupComponent_Conditional_5_Conditional_1_For_2_Conditional_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 22);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r11 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, control_r11.label));
  }
}
function PopupComponent_Conditional_5_Conditional_1_For_2_Conditional_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r11 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.actionCounterValue(control_r11));
  }
}
function PopupComponent_Conditional_5_Conditional_1_For_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 21);
    \u0275\u0275listener("click", function PopupComponent_Conditional_5_Conditional_1_For_2_Conditional_2_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r13);
      const control_r11 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.selectAction(control_r11, $event));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, PopupComponent_Conditional_5_Conditional_1_For_2_Conditional_2_Conditional_3_Template, 3, 3, "span", 22);
    \u0275\u0275conditionalCreate(4, PopupComponent_Conditional_5_Conditional_1_For_2_Conditional_2_Conditional_4_Template, 2, 1, "span", 23);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r11 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("ui-popup__action--active", control_r11.active)("ui-popup__action--icon-only", !control_r11.label)("ui-popup__action--compact-mobile", control_r11.compactOnMobile);
    \u0275\u0275property("ngClass", ctx_r0.actionPaletteClass(control_r11))("disabled", control_r11.disabled);
    \u0275\u0275attribute("aria-label", control_r11.ariaLabel || control_r11.label || control_r11.id);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(control_r11.icon);
    \u0275\u0275advance();
    \u0275\u0275conditional(control_r11.label ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.actionCounterValue(control_r11) ? 4 : -1);
  }
}
function PopupComponent_Conditional_5_Conditional_1_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, PopupComponent_Conditional_5_Conditional_1_For_2_Conditional_0_Template, 1, 12, "app-menu", 18)(1, PopupComponent_Conditional_5_Conditional_1_For_2_Conditional_1_Template, 3, 0)(2, PopupComponent_Conditional_5_Conditional_1_For_2_Conditional_2_Template, 5, 12, "button", 15);
  }
  if (rf & 2) {
    const control_r11 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional(ctx_r0.isMenuControl(control_r11) ? 0 : ctx_r0.isDateInputControl(control_r11) ? 1 : 2);
  }
}
function PopupComponent_Conditional_5_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 27);
    \u0275\u0275repeaterCreate(1, PopupComponent_Conditional_5_Conditional_1_For_2_Template, 3, 1, null, null, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.toolbarStartControls);
  }
}
function PopupComponent_Conditional_5_Conditional_2_For_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-menu", 19);
    \u0275\u0275listener("itemSelect", function PopupComponent_Conditional_5_Conditional_2_For_2_Conditional_0_Template_app_menu_itemSelect_0_listener($event) {
      \u0275\u0275restoreView(_r14);
      const control_r15 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.selectMenuItem(control_r15, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r15 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("kind", control_r15.menuKind ?? "select")("title", control_r15.title ?? null)("trigger", control_r15.trigger ?? null)("items", control_r15.items ?? \u0275\u0275pureFunction0(10, _c3))("groups", control_r15.groups ?? \u0275\u0275pureFunction0(11, _c3))("model", control_r15.model ?? null)("panelAlign", control_r15.panelAlign ?? "auto")("panelMode", control_r15.panelMode ?? "auto")("mobileBreakpointPx", control_r15.mobileBreakpointPx ?? 760)("closeOnSelect", control_r15.closeOnSelect ?? true);
  }
}
function PopupComponent_Conditional_5_Conditional_2_For_2_Conditional_1_Defer_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-date-input", 20);
    \u0275\u0275listener("ngModelChange", function PopupComponent_Conditional_5_Conditional_2_For_2_Conditional_1_Defer_0_Template_app_date_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r16);
      const control_r15 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.changeDateInput(control_r15, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r15 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275property("model", control_r15.model)("ngModel", control_r15.value);
  }
}
function PopupComponent_Conditional_5_Conditional_2_For_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domTemplate(0, PopupComponent_Conditional_5_Conditional_2_For_2_Conditional_1_Defer_0_Template, 1, 2);
    \u0275\u0275defer(1, 0, PopupComponent_Conditional_3_Conditional_6_For_2_Conditional_1_Defer_1_DepsFn);
    \u0275\u0275deferOnImmediate();
  }
}
function PopupComponent_Conditional_5_Conditional_2_For_2_Conditional_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 22);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r15 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, control_r15.label));
  }
}
function PopupComponent_Conditional_5_Conditional_2_For_2_Conditional_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r15 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.actionCounterValue(control_r15));
  }
}
function PopupComponent_Conditional_5_Conditional_2_For_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 21);
    \u0275\u0275listener("click", function PopupComponent_Conditional_5_Conditional_2_For_2_Conditional_2_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r17);
      const control_r15 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.selectAction(control_r15, $event));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, PopupComponent_Conditional_5_Conditional_2_For_2_Conditional_2_Conditional_3_Template, 3, 3, "span", 22);
    \u0275\u0275conditionalCreate(4, PopupComponent_Conditional_5_Conditional_2_For_2_Conditional_2_Conditional_4_Template, 2, 1, "span", 23);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const control_r15 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("ui-popup__action--active", control_r15.active)("ui-popup__action--icon-only", !control_r15.label)("ui-popup__action--compact-mobile", control_r15.compactOnMobile);
    \u0275\u0275property("ngClass", ctx_r0.actionPaletteClass(control_r15))("disabled", control_r15.disabled);
    \u0275\u0275attribute("aria-label", control_r15.ariaLabel || control_r15.label || control_r15.id);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(control_r15.icon);
    \u0275\u0275advance();
    \u0275\u0275conditional(control_r15.label ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.actionCounterValue(control_r15) ? 4 : -1);
  }
}
function PopupComponent_Conditional_5_Conditional_2_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, PopupComponent_Conditional_5_Conditional_2_For_2_Conditional_0_Template, 1, 12, "app-menu", 18)(1, PopupComponent_Conditional_5_Conditional_2_For_2_Conditional_1_Template, 3, 0)(2, PopupComponent_Conditional_5_Conditional_2_For_2_Conditional_2_Template, 5, 12, "button", 15);
  }
  if (rf & 2) {
    const control_r15 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional(ctx_r0.isMenuControl(control_r15) ? 0 : ctx_r0.isDateInputControl(control_r15) ? 1 : 2);
  }
}
function PopupComponent_Conditional_5_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 28);
    \u0275\u0275repeaterCreate(1, PopupComponent_Conditional_5_Conditional_2_For_2_Template, 3, 1, null, null, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.toolbarEndControls);
  }
}
function PopupComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26);
    \u0275\u0275conditionalCreate(1, PopupComponent_Conditional_5_Conditional_1_Template, 3, 0, "div", 27);
    \u0275\u0275conditionalCreate(2, PopupComponent_Conditional_5_Conditional_2_Template, 3, 0, "div", 28);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classProp("ui-popup__toolbar--mobile-start", ctx_r0.popupModel.toolbarMobileAlign === "start")("ui-popup__toolbar--mobile-center", ctx_r0.popupModel.toolbarMobileAlign === "center")("ui-popup__toolbar--mobile-end", ctx_r0.popupModel.toolbarMobileAlign === "end");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.hasToolbarStartControls ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.hasToolbarEndControls ? 2 : -1);
  }
}
var PopupComponent = class _PopupComponent {
  popupPresenceStore = inject(PopupPresenceStore);
  presenceToken = null;
  registeredZIndex = 2300;
  model = null;
  zIndex = null;
  /** Keep expensive content mounted without retaining an invisible modal layer. */
  active = true;
  close = new EventEmitter();
  menuSelect = new EventEmitter();
  action = new EventEmitter();
  dateInputChange = new EventEmitter();
  ngOnInit() {
    this.syncPresence();
  }
  ngOnChanges() {
    this.syncPresence();
  }
  syncPresence() {
    if (this.active && !this.presenceToken) {
      this.presenceToken = this.popupPresenceStore.register(this.zIndex);
      this.registeredZIndex = this.popupPresenceStore.layer(this.presenceToken) ?? this.registeredZIndex;
    } else if (!this.active) {
      this.clearPresence();
    }
  }
  ngOnDestroy() {
    this.clearPresence();
  }
  clearPresence() {
    if (this.presenceToken) {
      this.popupPresenceStore.unregister(this.presenceToken);
      this.presenceToken = null;
    }
  }
  get popupModel() {
    return this.model ?? {};
  }
  get effectiveZIndex() {
    const configuredZIndex = Number(this.zIndex);
    return Number.isFinite(configuredZIndex) && configuredZIndex > 0 ? Math.max(Math.trunc(configuredZIndex), this.registeredZIndex) : this.registeredZIndex;
  }
  get ariaLabel() {
    return this.popupModel.ariaLabel?.trim() || this.popupModel.title?.trim() || "Popup";
  }
  get closeAriaLabel() {
    return this.popupModel.closeAriaLabel?.trim() || "Close";
  }
  get closeOnBackdrop() {
    return this.popupModel.closeOnBackdrop !== false;
  }
  get showClose() {
    return this.popupModel.showClose !== false;
  }
  get showHeader() {
    return this.popupModel.showHeader !== false;
  }
  get hasHeader() {
    return this.showHeader && (Boolean(this.popupModel.title?.trim()) || Boolean(this.popupModel.subtitle?.trim()) || Boolean(this.popupModel.secondarySubtitle?.trim()) || Boolean(this.popupModel.headerLabel?.trim()) || Boolean(this.popupModel.headerBadge?.trim()) || Boolean(this.popupModel.headerTitleBadge?.trim()) || this.hasHeaderControls || this.hasHeaderActions || this.showClose);
  }
  get headerControls() {
    return this.popupModel.headerControls ?? [];
  }
  get headerActions() {
    return this.popupModel.headerActions ?? [];
  }
  get toolbarControls() {
    return this.popupModel.toolbarControls ?? [];
  }
  get toolbarStartControls() {
    return this.toolbarControls.filter((control) => control.align !== "end");
  }
  get toolbarEndControls() {
    return this.toolbarControls.filter((control) => control.align === "end");
  }
  get hasToolbar() {
    return this.toolbarControls.length > 0;
  }
  get hasToolbarStartControls() {
    return this.toolbarStartControls.length > 0;
  }
  get hasToolbarEndControls() {
    return this.toolbarEndControls.length > 0;
  }
  get hasHeaderControls() {
    return this.headerControls.length > 0;
  }
  get hasHeaderActions() {
    return this.headerActions.length > 0;
  }
  get hasHeaderBadge() {
    return Boolean(this.popupModel.headerBadge?.trim());
  }
  onBackdropClick(event) {
    if (!this.closeOnBackdrop) {
      return;
    }
    this.emitClose(event);
  }
  onPanelClick(event) {
    event.stopPropagation();
  }
  isMenuControl(control) {
    return "kind" in control && control.kind === "menu";
  }
  isDateInputControl(control) {
    return "kind" in control && control.kind === "date-input";
  }
  actionPaletteClass(action) {
    return `ui-popup__action--${action.palette ?? "default"}`;
  }
  actionCounterValue(action) {
    const source = action.counter;
    if (source === null || source === void 0) {
      return "";
    }
    const value = typeof source === "object" && "value" in source ? source.value : source;
    const resolved = typeof value === "function" ? value() : value;
    const normalized = `${resolved ?? ""}`.trim();
    return normalized === "0" ? "" : normalized;
  }
  panelSizeClass() {
    return `ui-popup__panel--${this.popupModel.size ?? "default"}`;
  }
  panelHeightClass() {
    return `ui-popup__panel--height-${this.popupModel.height ?? "auto"}`;
  }
  headerToneClass() {
    return `ui-popup__header--${this.popupModel.headerTone ?? "default"}`;
  }
  headerLayoutClass() {
    return `ui-popup__header--layout-${this.popupModel.headerLayout ?? "default"}`;
  }
  headerPaletteClass() {
    return `ui-popup__header--palette-${this.popupModel.headerPalette ?? "default"}`;
  }
  headerTitleToneClass() {
    return `ui-popup__header--title-${this.popupModel.headerTitleTone ?? "palette"}`;
  }
  bodyLayoutClass() {
    return `ui-popup__body--${this.popupModel.bodyLayout ?? "default"}`;
  }
  backdropToneClass() {
    return `ui-popup__backdrop--${this.popupModel.backdropTone ?? "default"}`;
  }
  emitClose(event) {
    this.popupModel.onClose?.(event);
    this.close.emit(event);
  }
  selectMenuItem(control, itemSelect) {
    const event = { control, itemSelect };
    this.popupModel.onMenuSelect?.(event);
    this.menuSelect.emit(event);
  }
  changeDateInput(control, value) {
    const event = { control, value };
    this.popupModel.onDateInputChange?.(event);
    this.dateInputChange.emit(event);
  }
  selectAction(action, sourceEvent) {
    if (action.disabled) {
      return;
    }
    const event = { action, sourceEvent };
    this.popupModel.onAction?.(event);
    this.action.emit(event);
  }
  static \u0275fac = function PopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PopupComponent, selectors: [["app-popup"]], inputs: { model: "model", zIndex: "zIndex", active: "active" }, outputs: { close: "close", menuSelect: "menuSelect", action: "action", dateInputChange: "dateInputChange" }, features: [\u0275\u0275NgOnChangesFeature], ngContentSelectors: _c0, decls: 8, vars: 24, consts: [[1, "ui-popup"], [1, "ui-popup__backdrop", 3, "click", "ngClass"], ["role", "dialog", "aria-modal", "true", 1, "ui-popup__panel", 3, "click", "ngClass"], [1, "ui-popup__header", 3, "ngClass"], ["type", "button", 1, "ui-popup__close", "ui-popup__close--floating"], [1, "ui-popup__toolbar", 3, "ui-popup__toolbar--mobile-start", "ui-popup__toolbar--mobile-center", "ui-popup__toolbar--mobile-end"], [1, "ui-popup__body", 3, "ngClass"], [1, "ui-popup__title"], [1, "ui-popup__label"], [1, "ui-popup__title-line"], [1, "ui-popup__subtitle"], [1, "ui-popup__subtitle", "ui-popup__subtitle--secondary"], [1, "ui-popup__header-controls"], [1, "ui-popup__header-actions"], [1, "ui-popup__badge"], ["type", "button", 1, "ui-popup__action", 3, "ngClass", "ui-popup__action--active", "ui-popup__action--icon-only", "ui-popup__action--compact-mobile", "disabled"], ["type", "button", 1, "ui-popup__close"], [1, "ui-popup__badge", "ui-popup__badge--title"], [1, "ui-popup__control", 3, "kind", "title", "trigger", "items", "groups", "model", "panelAlign", "panelMode", "mobileBreakpointPx", "closeOnSelect"], [1, "ui-popup__control", 3, "itemSelect", "kind", "title", "trigger", "items", "groups", "model", "panelAlign", "panelMode", "mobileBreakpointPx", "closeOnSelect"], [1, "ui-popup__date-input", 3, "ngModelChange", "model", "ngModel"], ["type", "button", 1, "ui-popup__action", 3, "click", "ngClass", "disabled"], [1, "ui-popup__action-label"], [1, "ui-popup__action-counter"], ["type", "button", 1, "ui-popup__close", 3, "click"], ["type", "button", 1, "ui-popup__close", "ui-popup__close--floating", 3, "click"], [1, "ui-popup__toolbar"], [1, "ui-popup__toolbar-group", "ui-popup__toolbar-group--start"], [1, "ui-popup__toolbar-group", "ui-popup__toolbar-group--end"]], template: function PopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
      \u0275\u0275listener("click", function PopupComponent_Template_div_click_1_listener($event) {
        return ctx.onBackdropClick($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(2, "section", 2);
      \u0275\u0275listener("click", function PopupComponent_Template_section_click_2_listener($event) {
        return ctx.onPanelClick($event);
      });
      \u0275\u0275conditionalCreate(3, PopupComponent_Conditional_3_Template, 12, 15, "header", 3);
      \u0275\u0275conditionalCreate(4, PopupComponent_Conditional_4_Template, 4, 3, "button", 4);
      \u0275\u0275conditionalCreate(5, PopupComponent_Conditional_5_Template, 3, 8, "div", 5);
      \u0275\u0275elementStart(6, "div", 6);
      \u0275\u0275projection(7);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275styleProp("display", ctx.active ? null : "none")("z-index", ctx.effectiveZIndex);
      \u0275\u0275classProp("ui-popup", ctx.active)("ui-popup--fullscreen", ctx.popupModel.size === "fullscreen")("ui-popup--auto-height", ctx.popupModel.height !== "full" && ctx.popupModel.size !== "fullscreen")("ui-popup--mobile-compact", ctx.popupModel.mobilePresentation === "compact");
      \u0275\u0275advance();
      \u0275\u0275property("ngClass", ctx.backdropToneClass());
      \u0275\u0275advance();
      \u0275\u0275classProp("ui-popup__panel--overflow-visible", ctx.popupModel.bodyLayout === "overflow");
      \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(21, _c1, ctx.panelSizeClass(), ctx.panelHeightClass()));
      \u0275\u0275attribute("aria-label", ctx.ariaLabel);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.hasHeader ? 3 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.hasHeader && ctx.showClose ? 4 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.hasToolbar ? 5 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("ngClass", ctx.bodyLayoutClass());
    }
  }, dependencies: [CommonModule, NgClass, FormsModule, MatIconModule, MatIcon, AppMenuComponent, I18nPipe], styles: ['/* src/app/shared/ui/components/core/popup/popup.component.scss */\napp-popup {\n  display: contents;\n  --line: rgba(23, 33, 54, 0.12);\n  --line-strong: rgba(23, 33, 54, 0.2);\n  --text-main: #22324a;\n  --text-muted: rgba(23, 41, 66, 0.72);\n}\n.ui-popup {\n  position: fixed;\n  inset: 0;\n  z-index: 2300;\n  display: flex;\n  align-items: flex-start;\n  justify-content: center;\n  padding: 1rem;\n}\n.ui-popup--fullscreen {\n  align-items: stretch;\n  justify-content: stretch;\n  padding: 0;\n}\n@media (min-width: 761px) {\n  .ui-popup--auto-height {\n    align-items: center;\n  }\n}\n.ui-popup__backdrop {\n  position: absolute;\n  inset: 0;\n  background: #e9edf5;\n}\n.ui-popup__backdrop--dim {\n  background: rgba(8, 16, 30, 0.56);\n  -webkit-backdrop-filter: blur(3px);\n  backdrop-filter: blur(3px);\n}\n.ui-popup__panel {\n  position: relative;\n  z-index: 1;\n  width: min(760px, 100vw - 1.2rem);\n  max-height: calc(100vh - 1.2rem);\n  max-height: calc(100dvh - 1.2rem);\n  border-radius: 14px;\n  background: #fff;\n  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.26);\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n}\n.ui-popup__panel--small {\n  width: min(var(--app-popup-small-width, 380px), 100vw - 1.2rem);\n}\n.ui-popup__panel--wide {\n  width: min(1080px, 100vw - 1.2rem);\n}\n.ui-popup__panel--fullscreen {\n  width: 100vw;\n  max-width: 100vw;\n  min-width: 100vw;\n  height: 100vh;\n  height: 100dvh;\n  max-height: 100vh;\n  max-height: 100dvh;\n  min-height: 100vh;\n  min-height: 100dvh;\n  border-radius: 0;\n  background: #111317;\n  box-shadow: none;\n}\n.ui-popup__panel--height-full {\n  height: calc(100vh - 1.2rem);\n  height: calc(100dvh - 1.2rem);\n  max-height: calc(100vh - 1.2rem);\n  max-height: calc(100dvh - 1.2rem);\n}\n.ui-popup__header {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto auto;\n  grid-template-areas: "title controls actions";\n  align-items: center;\n  gap: 0.42rem;\n  padding: 0.58rem 0.4rem;\n  border-bottom: 1px solid var(--line);\n  position: relative;\n  flex: 0 0 auto;\n}\n.ui-popup__header--accent {\n  border-bottom-color: rgba(46, 114, 184, 0.2);\n}\n.ui-popup__header--layout-article {\n  align-items: flex-start;\n  gap: 0.72rem;\n  padding: clamp(0.84rem, 2vw, 1.35rem) clamp(0.84rem, 2vw, 1.35rem) 0;\n  border-bottom: 0;\n}\n.ui-popup__header--layout-document {\n  --ui-popup-document-header-bg:\n    linear-gradient(\n      180deg,\n      #eef3f8 0%,\n      #f8fafc 100%);\n  --ui-popup-document-header-border: rgba(72, 92, 118, 0.24);\n  --ui-popup-document-header-title: #304157;\n  --ui-popup-document-header-text: rgba(48, 65, 87, 0.78);\n  --ui-popup-document-header-badge-bg: #40566f;\n  align-items: flex-start;\n  gap: 0.62rem;\n  padding: 0.9rem 0.72rem 0.82rem;\n  border-bottom-color: var(--ui-popup-document-header-border);\n  background: var(--ui-popup-document-header-bg);\n}\n.ui-popup__header--palette-amber {\n  --ui-popup-document-header-bg:\n    linear-gradient(\n      180deg,\n      #fbf4e8 0%,\n      #fffaf0 100%);\n  --ui-popup-document-header-border: rgba(157, 118, 41, 0.24);\n  --ui-popup-document-header-title: #7c5618;\n  --ui-popup-document-header-text: rgba(108, 74, 19, 0.84);\n  --ui-popup-document-header-badge-bg: #b66a15;\n}\n.ui-popup__header--palette-blue {\n  --ui-popup-document-header-bg:\n    linear-gradient(\n      180deg,\n      #eef6ff 0%,\n      #f8fbff 100%);\n  --ui-popup-document-header-border: rgba(53, 96, 162, 0.24);\n  --ui-popup-document-header-title: #1f3f6f;\n  --ui-popup-document-header-text: rgba(46, 78, 119, 0.84);\n  --ui-popup-document-header-badge-bg: #2f6fae;\n}\n.ui-popup__header--palette-green {\n  --ui-popup-document-header-bg:\n    linear-gradient(\n      180deg,\n      #f0fbf3 0%,\n      #e4f7ea 100%);\n  --ui-popup-document-header-border: rgba(58, 143, 91, 0.3);\n  --ui-popup-document-header-title: #246b42;\n  --ui-popup-document-header-text: rgba(35, 94, 58, 0.84);\n  --ui-popup-document-header-badge-bg: #1f7a49;\n}\n.ui-popup__header--palette-teal {\n  --ui-popup-document-header-bg:\n    linear-gradient(\n      180deg,\n      #eefafa 0%,\n      #f7fdfd 100%);\n  --ui-popup-document-header-border: rgba(33, 126, 132, 0.24);\n  --ui-popup-document-header-title: #17646d;\n  --ui-popup-document-header-text: rgba(28, 91, 99, 0.84);\n  --ui-popup-document-header-badge-bg: #197987;\n}\n.ui-popup__header--palette-rose {\n  --ui-popup-document-header-bg:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #fff8fa 100%);\n  --ui-popup-document-header-border: rgba(178, 69, 98, 0.26);\n  --ui-popup-document-header-title: #8c2e49;\n  --ui-popup-document-header-text: rgba(122, 45, 70, 0.84);\n  --ui-popup-document-header-badge-bg: #b94462;\n}\n.ui-popup__header--palette-violet {\n  --ui-popup-document-header-bg:\n    linear-gradient(\n      180deg,\n      #f5f0ff 0%,\n      #fbf8ff 100%);\n  --ui-popup-document-header-border: rgba(107, 80, 175, 0.26);\n  --ui-popup-document-header-title: #50398e;\n  --ui-popup-document-header-text: rgba(75, 52, 128, 0.84);\n  --ui-popup-document-header-badge-bg: #6b50af;\n}\n.ui-popup__header--palette-slate {\n  --ui-popup-document-header-bg:\n    linear-gradient(\n      180deg,\n      #eef3f8 0%,\n      #f8fafc 100%);\n  --ui-popup-document-header-border: rgba(72, 92, 118, 0.24);\n  --ui-popup-document-header-title: #304157;\n  --ui-popup-document-header-text: rgba(48, 65, 87, 0.78);\n  --ui-popup-document-header-badge-bg: #40566f;\n}\n.ui-popup__header--title-neutral {\n  --ui-popup-document-header-title: #172234;\n  --ui-popup-document-header-text: #172234;\n}\n.ui-popup__title {\n  grid-area: title;\n  min-width: 0;\n}\n.ui-popup__title-line {\n  min-width: 0;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.4rem;\n  max-width: 100%;\n}\n.ui-popup__title-line h2 {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.ui-popup__label {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  color: rgba(39, 66, 101, 0.76);\n  font-size: 0.74rem;\n  font-weight: 800;\n}\n.ui-popup__label .mat-icon {\n  width: 14px;\n  height: 14px;\n  font-size: 14px;\n  line-height: 14px;\n}\n.ui-popup__header--layout-document .ui-popup__label {\n  color: var(--ui-popup-document-header-text);\n  font-size: 0.78rem;\n  font-weight: 900;\n}\n.ui-popup__title h2 {\n  margin: 0;\n  font-size: 1.05rem;\n  color: var(--text-main);\n  font-weight: 700;\n  letter-spacing: 0;\n}\n.ui-popup__header--layout-article .ui-popup__title {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  gap: 0.3rem;\n}\n.ui-popup__header--layout-article .ui-popup__title-line {\n  order: -1;\n}\n.ui-popup__header--layout-article .ui-popup__title h2 {\n  margin: 0;\n  max-width: 820px;\n  color: #173456;\n  font-size: clamp(1.2rem, 2.2vw, 1.65rem);\n  line-height: 1.2;\n  font-weight: 950;\n  white-space: normal;\n  overflow-wrap: anywhere;\n}\n.ui-popup__header--layout-document .ui-popup__title h2 {\n  color: var(--ui-popup-document-header-title);\n  font-size: clamp(1.22rem, 2.4vw, 1.52rem);\n  line-height: 1.12;\n  font-weight: 950;\n}\n.ui-popup__subtitle {\n  margin: 0.14rem 0 0;\n  font-size: 0.74rem;\n  font-weight: 700;\n  color: rgba(21, 39, 62, 0.72);\n}\n.ui-popup__header--layout-article .ui-popup__subtitle {\n  max-width: 72ch;\n  margin: 0.54rem 0 0;\n  color: rgba(31, 54, 88, 0.76);\n  font-size: 0.94rem;\n  font-weight: 800;\n  line-height: 1.42;\n}\n.ui-popup__header--layout-document .ui-popup__subtitle {\n  margin-top: 0.34rem;\n  color: var(--ui-popup-document-header-text);\n  font-size: 0.88rem;\n  font-weight: 400;\n  line-height: 1.45;\n}\n.ui-popup__subtitle--secondary {\n  margin-top: 0.04rem;\n  font-size: 0.68rem;\n  font-weight: 800;\n  letter-spacing: 0.01em;\n  color: rgba(21, 39, 62, 0.58);\n}\n.ui-popup__header-controls {\n  grid-area: controls;\n  min-width: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.34rem;\n}\n.ui-popup__header-controls:empty {\n  display: none;\n}\n.ui-popup__header-actions {\n  grid-area: actions;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.34rem;\n}\n.ui-popup__header--layout-document .ui-popup__header-actions {\n  align-items: flex-start;\n}\n.ui-popup__header-actions--empty {\n  display: none;\n}\n.ui-popup__badge {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 0;\n  min-height: 1.86rem;\n  border-radius: 999px;\n  background: #e8eef6;\n  color: #28476d;\n  padding: 0 0.72rem;\n  font-size: 0.74rem;\n  font-weight: 900;\n  line-height: 1;\n  white-space: nowrap;\n}\n.ui-popup__badge--title {\n  min-height: 1.42rem;\n  padding: 0 0.52rem;\n  font-size: 0.68rem;\n  flex: 0 0 auto;\n}\n.ui-popup__badge--title[data-tone=warning] {\n  border: 1px solid rgba(190, 129, 38, 0.28);\n  background: #fff1d9;\n  color: #8c5a16;\n}\n.ui-popup__badge--title[data-tone=danger] {\n  border: 1px solid rgba(190, 60, 76, 0.28);\n  background: #ffe7ea;\n  color: #9c3040;\n}\n.ui-popup__header--layout-document .ui-popup__badge {\n  min-height: 1.88rem;\n  background: var(--ui-popup-document-header-badge-bg);\n  color: #fff;\n  font-size: 0.78rem;\n  box-shadow: none;\n}\n.ui-popup__toolbar {\n  flex: 0 0 auto;\n  padding: 0.4rem 0.4rem 0;\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: start;\n  gap: 0.36rem 0.5rem;\n}\n.ui-popup__toolbar-group {\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.ui-popup__toolbar-group--start {\n  grid-column: 1;\n  justify-content: flex-start;\n  flex-wrap: wrap;\n}\n.ui-popup__toolbar-group--end {\n  grid-column: 2;\n  justify-content: flex-end;\n  flex-wrap: nowrap;\n  white-space: nowrap;\n}\n.ui-popup__toolbar-group--end .ui-popup__action,\n.ui-popup__toolbar-group--end .ui-popup__control,\n.ui-popup__toolbar-group--end .ui-popup__date-input {\n  flex: 0 0 auto;\n}\n.ui-popup__date-input {\n  flex: 0 0 auto;\n  min-width: 0;\n}\n.ui-popup__body {\n  padding: 0.4rem;\n  overflow-y: auto;\n  overflow-x: hidden;\n  display: flex;\n  flex-direction: column;\n  gap: 0.72rem;\n  flex: 1 1 auto;\n  min-height: 0;\n}\n.ui-popup__body--fill {\n  overflow: hidden;\n}\n.ui-popup__body--flush {\n  padding: 0;\n  gap: 0;\n  overflow: hidden;\n}\n@media (min-width: 761px) {\n  .ui-popup__panel--overflow-visible,\n  .ui-popup__body--overflow {\n    overflow: visible;\n  }\n}\n.ui-popup__action {\n  position: relative;\n  min-width: 2.25rem;\n  min-height: 2.25rem;\n  height: 2.25rem;\n  border: 1px solid rgba(30, 88, 152, 0.46);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #e2f0ff 0%,\n      #c5dbf8 100%);\n  color: #15457c;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.34rem;\n  cursor: pointer;\n  box-shadow: 0 2px 8px rgba(31, 79, 132, 0.18);\n  padding: 0 0.58rem;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 800;\n  line-height: 1;\n  white-space: nowrap;\n}\n.ui-popup__action-counter {\n  position: absolute;\n  top: -0.28rem;\n  right: -0.28rem;\n  min-width: 1rem;\n  height: 1rem;\n  padding: 0 0.24rem;\n  border-radius: 999px;\n  border: 1px solid rgba(255, 255, 255, 0.86);\n  color: #ffffff;\n  background: #d63838;\n  box-shadow: 0 2px 6px rgba(98, 32, 32, 0.22);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  font-size: 0.62rem;\n  line-height: 1;\n  font-weight: 900;\n  pointer-events: none;\n}\n.ui-popup__action--icon-only {\n  width: 2.25rem;\n  padding: 0;\n  border-radius: 50%;\n}\n.ui-popup__action .mat-icon {\n  width: 1.14rem;\n  height: 1.14rem;\n  font-size: 1.14rem;\n  line-height: 1.14rem;\n  pointer-events: none;\n}\n.ui-popup__action:hover {\n  background:\n    linear-gradient(\n      180deg,\n      #d4e8ff 0%,\n      #b5d1f3 100%);\n  border-color: rgba(27, 74, 130, 0.6);\n  color: #103966;\n  box-shadow: 0 4px 10px rgba(28, 69, 114, 0.24);\n}\n.ui-popup__action:active:not(:disabled) {\n  box-shadow: 0 1px 4px rgba(36, 74, 121, 0.2);\n}\n.ui-popup__action:disabled {\n  opacity: 0.54;\n  cursor: not-allowed;\n  box-shadow: 0 2px 8px rgba(31, 79, 132, 0.12);\n}\n.ui-popup__action--neutral,\n.ui-popup__action--muted {\n  border-color: rgba(90, 108, 130, 0.28);\n  background:\n    linear-gradient(\n      180deg,\n      #f8fafc 0%,\n      #edf1f6 100%);\n  color: #4c617a;\n  box-shadow: 0 2px 7px rgba(55, 75, 101, 0.12);\n}\n.ui-popup__action--neutral:hover,\n.ui-popup__action--muted:hover {\n  border-color: rgba(78, 98, 124, 0.4);\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #e7edf4 100%);\n  color: #3f5570;\n  box-shadow: 0 4px 10px rgba(55, 75, 101, 0.16);\n}\n.ui-popup__action--gold,\n.ui-popup__action--amber {\n  border-color: rgba(188, 138, 24, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #fff7df 0%,\n      #ffefc6 100%);\n  color: #8d5d10;\n  box-shadow: 0 5px 13px rgba(180, 127, 23, 0.2);\n}\n.ui-popup__action--gold:hover,\n.ui-popup__action--amber:hover {\n  border-color: rgba(188, 138, 24, 0.62);\n  background:\n    linear-gradient(\n      180deg,\n      #fff2c9 0%,\n      #ffe3a3 100%);\n  color: #7d4f0a;\n  box-shadow: 0 4px 10px rgba(180, 127, 23, 0.22);\n}\n.ui-popup__action--blue,\n.ui-popup__action--sky {\n  border-color: rgba(48, 85, 138, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #f7fbff 0%,\n      #edf4ff 100%);\n  color: #2c5f9b;\n}\n.ui-popup__action--green,\n.ui-popup__action--success {\n  border-color: rgba(47, 142, 95, 0.38);\n  background:\n    linear-gradient(\n      180deg,\n      #effbf4 0%,\n      #dbf2e5 100%);\n  color: #23734a;\n}\n.ui-popup__action--violet,\n.ui-popup__action--purple {\n  border-color: rgba(102, 79, 174, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #f0ecff 0%,\n      #e3dbff 100%);\n  color: #5a43a9;\n}\n.ui-popup__action--rose,\n.ui-popup__action--pink {\n  border-color: rgba(183, 88, 104, 0.42);\n  background:\n    linear-gradient(\n      180deg,\n      #fff4f5 0%,\n      #ffe8eb 100%);\n  color: #9b3345;\n  box-shadow: 0 2px 7px rgba(134, 51, 68, 0.12);\n}\n.ui-popup__action--rose:hover,\n.ui-popup__action--pink:hover {\n  border-color: rgba(167, 45, 66, 0.52);\n  background:\n    linear-gradient(\n      180deg,\n      #ffecef 0%,\n      #fbd8de 100%);\n  color: #8b1f32;\n  box-shadow: 0 4px 10px rgba(134, 51, 68, 0.18);\n}\n.ui-popup__action--danger,\n.ui-popup__action--red {\n  border-color: rgba(147, 31, 31, 0.64);\n  background:\n    linear-gradient(\n      180deg,\n      #ffe8e8 0%,\n      #ffcfcf 100%);\n  color: #9a2626;\n}\n.ui-popup__action--active {\n  border-color: rgba(26, 68, 124, 0.68);\n  background:\n    linear-gradient(\n      180deg,\n      #d3e4ff 0%,\n      #bfd7ff 100%);\n  color: #123d73;\n}\n.ui-popup__action--rose.ui-popup__action--active,\n.ui-popup__action--pink.ui-popup__action--active {\n  border-color: rgba(167, 45, 66, 0.56);\n  background:\n    linear-gradient(\n      180deg,\n      #f7dde1 0%,\n      #f2c8ce 100%);\n  color: #8b1f32;\n  box-shadow: 0 4px 12px rgba(186, 65, 86, 0.2);\n}\n.ui-popup__close {\n  flex: 0 0 auto;\n  width: 34px;\n  height: 34px;\n  min-width: 34px;\n  min-height: 34px;\n  border: 1px solid rgba(47, 86, 139, 0.2);\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.92);\n  color: rgba(38, 67, 105, 0.92);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  padding: 0;\n  line-height: 0;\n  box-sizing: border-box;\n  box-shadow: 0 8px 18px rgba(37, 62, 95, 0.12);\n  --mdc-icon-button-state-layer-size: 34px;\n}\n.ui-popup__close .mat-icon {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 21px;\n  height: 21px;\n  font-size: 21px;\n  line-height: 21px;\n  margin: 0;\n}\n.ui-popup__close:not(:disabled):not([aria-disabled=true]):hover {\n  border-color: rgba(47, 86, 139, 0.32);\n  background: #fff;\n  color: rgba(24, 50, 84, 0.98);\n}\n.ui-popup__close:not(:disabled):not([aria-disabled=true]):active {\n  background: rgba(239, 245, 252, 0.96);\n}\n.ui-popup__close:focus-visible {\n  outline: 2px solid rgba(61, 108, 186, 0.35);\n  outline-offset: 1px;\n}\n.ui-popup__close--floating {\n  position: absolute;\n  top: 1rem;\n  right: 1rem;\n  z-index: 20;\n}\n.ui-popup__close:disabled,\n.ui-popup__close[aria-disabled=true] {\n  opacity: 0.56;\n  cursor: default;\n}\n@media (max-width: 760px) {\n  .ui-popup {\n    padding: 0;\n    align-items: stretch;\n  }\n  .ui-popup__panel {\n    width: 100vw !important;\n    max-width: 100vw !important;\n    height: 100vh !important;\n    height: 100dvh !important;\n    max-height: 100vh !important;\n    max-height: 100dvh !important;\n    min-height: 100dvh;\n    margin: 0 !important;\n    border-radius: 0;\n    box-shadow: none;\n  }\n  .ui-popup.ui-popup--mobile-compact {\n    padding: 0.6rem;\n    align-items: center;\n  }\n  .ui-popup--mobile-compact .ui-popup__panel {\n    width: min(380px, 100vw - 1.2rem) !important;\n    max-width: min(380px, 100vw - 1.2rem) !important;\n    height: auto !important;\n    max-height: calc(100vh - 1.2rem) !important;\n    max-height: calc(100dvh - 1.2rem) !important;\n    min-height: 0;\n    margin: 0 !important;\n    border-radius: 14px;\n    box-shadow: 0 18px 42px rgba(0, 0, 0, 0.26);\n  }\n  .ui-popup__body--overflow {\n    overflow-y: auto;\n    overflow-x: hidden;\n  }\n  .ui-popup__header {\n    align-items: start;\n    gap: 0.36rem 0.44rem;\n    padding: 0.52rem 0.48rem 0.44rem;\n  }\n  .ui-popup__header--layout-article {\n    padding: 0.78rem 0.78rem 0;\n  }\n  .ui-popup__header--layout-document {\n    padding: 0.72rem 0.64rem;\n  }\n  .ui-popup__header--layout-article .ui-popup__title h2 {\n    font-size: clamp(1.15rem, 5vw, 1.4rem);\n  }\n  .ui-popup__header--layout-document .ui-popup__title h2 {\n    font-size: clamp(1.18rem, 5.4vw, 1.42rem);\n  }\n  .ui-popup__header-controls {\n    width: auto;\n    min-width: 0;\n    flex-wrap: nowrap;\n  }\n  .ui-popup__header-controls app-menu {\n    max-width: 100%;\n  }\n  .ui-popup__toolbar {\n    padding: 0.36rem 0.48rem 0;\n    display: flex;\n    align-items: center;\n    flex-wrap: nowrap;\n    gap: 0.24rem;\n    overflow: visible;\n  }\n  .ui-popup__toolbar-group {\n    gap: 0.24rem;\n    flex-wrap: nowrap;\n  }\n  .ui-popup__toolbar-group--start {\n    flex: 1 1 auto;\n    min-width: 0;\n  }\n  .ui-popup__toolbar-group--start .ui-popup__control {\n    flex: 0 1 auto;\n    min-width: 0;\n  }\n  .ui-popup__toolbar-group--start app-menu.ui-popup__control.app-menu-host--inline-row-labelled-action {\n    flex: 1 1 auto;\n    width: 100%;\n    min-width: 0;\n  }\n  .ui-popup__toolbar-group--end {\n    flex: 0 0 auto;\n    gap: 0.24rem;\n    margin-left: auto;\n  }\n  .ui-popup__toolbar-group--end:has(app-menu.ui-popup__control.app-menu-host--inline-row-labelled-action) {\n    flex: 1 1 auto;\n    width: 100%;\n    min-width: 0;\n    margin-left: 0;\n  }\n  .ui-popup__toolbar-group--end app-menu.ui-popup__control.app-menu-host--inline-row-labelled-action {\n    flex: 1 1 auto;\n    width: 100%;\n    min-width: 0;\n  }\n  .ui-popup__toolbar--mobile-start .ui-popup__toolbar-group--end,\n  .ui-popup__toolbar--mobile-center .ui-popup__toolbar-group--end,\n  .ui-popup__toolbar--mobile-end .ui-popup__toolbar-group--end {\n    margin-left: 0;\n  }\n  .ui-popup__toolbar--mobile-start {\n    justify-content: flex-start;\n  }\n  .ui-popup__toolbar--mobile-center {\n    justify-content: center;\n  }\n  .ui-popup__toolbar--mobile-center .ui-popup__toolbar-group {\n    flex: 1 1 auto;\n    width: 100%;\n    min-width: 0;\n    justify-content: center;\n  }\n  .ui-popup__toolbar--mobile-center .ui-popup__toolbar-group app-menu.ui-popup__control.app-menu-host--kind-select {\n    flex: 1 1 auto;\n    width: auto;\n    min-width: 0;\n  }\n  .ui-popup__toolbar--mobile-end {\n    justify-content: flex-end;\n  }\n  .ui-popup__toolbar .app-menu__trigger {\n    gap: 0.22rem;\n    min-width: 0;\n    padding-inline: 0.42rem;\n    font-size: 0.74rem;\n  }\n  .ui-popup__toolbar .app-menu__trigger-label {\n    text-overflow: clip;\n  }\n  .ui-popup__toolbar .app-menu__trigger .mat-icon,\n  .ui-popup__toolbar .app-menu__trigger-caret {\n    width: 1rem;\n    height: 1rem;\n    font-size: 1rem;\n    line-height: 1rem;\n  }\n  .ui-popup__action--compact-mobile {\n    width: 2.25rem;\n    padding: 0;\n    border-radius: 50%;\n  }\n  .ui-popup__action--compact-mobile .ui-popup__action-label {\n    display: none;\n  }\n}\n/*# sourceMappingURL=popup.component.css.map */\n'], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadataAsync(PopupComponent, () => [import("./date-input.component-ZFH6PSJF.js").then((m) => m.DateInputComponent)], (DateInputComponent) => {
    setClassMetadata(PopupComponent, [{
      type: Component,
      args: [{ selector: "app-popup", standalone: true, imports: [CommonModule, FormsModule, MatIconModule, AppMenuComponent, DateInputComponent, I18nPipe], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: `<div
  class="ui-popup"
  [class.ui-popup]="active"
  [style.display]="active ? null : 'none'"
  [class.ui-popup--fullscreen]="popupModel.size === 'fullscreen'"
  [class.ui-popup--auto-height]="popupModel.height !== 'full' && popupModel.size !== 'fullscreen'"
  [class.ui-popup--mobile-compact]="popupModel.mobilePresentation === 'compact'"
  [style.z-index]="effectiveZIndex"
>
  <div class="ui-popup__backdrop" [ngClass]="backdropToneClass()" (click)="onBackdropClick($event)"></div>
  <section
    class="ui-popup__panel"
    [ngClass]="[panelSizeClass(), panelHeightClass()]"
    [class.ui-popup__panel--overflow-visible]="popupModel.bodyLayout === 'overflow'"
    role="dialog"
    aria-modal="true"
    [attr.aria-label]="ariaLabel"
    (click)="onPanelClick($event)"
  >
    @if (hasHeader) {
      <header class="ui-popup__header" [ngClass]="[headerToneClass(), headerLayoutClass(), headerPaletteClass(), headerTitleToneClass()]">
        <div class="ui-popup__title">
          @if (popupModel.headerLabel) {
            <span class="ui-popup__label" [attr.data-i18n-ignore]="popupModel.translateHeaderLabel === false ? '' : null">
              @if (popupModel.headerLabelIcon) {
                <mat-icon>{{ popupModel.headerLabelIcon }}</mat-icon>
              }
              <span>{{ popupModel.translateHeaderLabel === false ? popupModel.headerLabel : (popupModel.headerLabel | i18n) }}</span>
            </span>
          }
          @if (popupModel.title || popupModel.headerTitleBadge) {
            <span class="ui-popup__title-line">
              @if (popupModel.title) {
                <h2 [attr.data-i18n-ignore]="popupModel.translateTitle === false ? '' : null">
                  {{ popupModel.translateTitle === false ? popupModel.title : (popupModel.title | i18n) }}
                </h2>
              }
              @if (popupModel.headerTitleBadge) {
                <span
                  class="ui-popup__badge ui-popup__badge--title"
                  [attr.data-tone]="popupModel.headerTitleBadgeTone ?? 'neutral'"
                  [attr.data-i18n-ignore]="popupModel.translateHeaderTitleBadge === false ? '' : null"
                >
                  {{ popupModel.translateHeaderTitleBadge === false ? popupModel.headerTitleBadge : (popupModel.headerTitleBadge | i18n) }}
                </span>
              }
            </span>
          }
          @if (popupModel.subtitle) {
            <p class="ui-popup__subtitle" [attr.data-i18n-ignore]="popupModel.translateSubtitle === false ? '' : null">
              {{ popupModel.translateSubtitle === false ? popupModel.subtitle : (popupModel.subtitle | i18n) }}
            </p>
          }
          @if (popupModel.secondarySubtitle) {
            <p class="ui-popup__subtitle ui-popup__subtitle--secondary" [attr.data-i18n-ignore]="popupModel.translateSecondarySubtitle === false ? '' : null">
              {{ popupModel.translateSecondarySubtitle === false ? popupModel.secondarySubtitle : (popupModel.secondarySubtitle | i18n) }}
            </p>
          }
        </div>
        @if (hasHeaderControls) {
          <div class="ui-popup__header-controls">
            @for (control of headerControls; track control.id) {
              @if (isMenuControl(control)) {
                <app-menu
                  class="ui-popup__control"
                  [kind]="control.menuKind ?? 'select'"
                  [title]="control.title ?? null"
                  [trigger]="control.trigger ?? null"
                  [items]="control.items ?? []"
                  [groups]="control.groups ?? []"
                  [model]="control.model ?? null"
                  [panelAlign]="control.panelAlign ?? 'auto'"
                  [panelMode]="control.panelMode ?? 'auto'"
                  [mobileBreakpointPx]="control.mobileBreakpointPx ?? 760"
                  [closeOnSelect]="control.closeOnSelect ?? true"
                  (itemSelect)="selectMenuItem(control, $event)"
                ></app-menu>
              } @else if (isDateInputControl(control)) {
                @defer (on immediate) {
                  <app-date-input
                    class="ui-popup__date-input"
                    [model]="control.model"
                    [ngModel]="control.value"
                    (ngModelChange)="changeDateInput(control, $event)"
                  ></app-date-input>
                }
              } @else {
                <button
                  type="button"
                  class="ui-popup__action"
                  [ngClass]="actionPaletteClass(control)"
                  [class.ui-popup__action--active]="control.active"
                  [class.ui-popup__action--icon-only]="!control.label"
                  [class.ui-popup__action--compact-mobile]="control.compactOnMobile"
                  [disabled]="control.disabled"
                  [attr.aria-label]="control.ariaLabel || control.label || control.id"
                  (click)="selectAction(control, $event)"
                >
                  <mat-icon>{{ control.icon }}</mat-icon>
                  @if (control.label) {
                    <span class="ui-popup__action-label">{{ control.label | i18n }}</span>
                  }
                  @if (actionCounterValue(control)) {
                    <span class="ui-popup__action-counter">{{ actionCounterValue(control) }}</span>
                  }
                </button>
              }
            }
          </div>
        }
        <div class="ui-popup__header-actions" [class.ui-popup__header-actions--empty]="!hasHeaderBadge && !hasHeaderActions && !showClose">
          @if (popupModel.headerBadge) {
            <span class="ui-popup__badge" [attr.data-i18n-ignore]="popupModel.translateHeaderBadge === false ? '' : null">
              {{ popupModel.translateHeaderBadge === false ? popupModel.headerBadge : (popupModel.headerBadge | i18n) }}
            </span>
          }
          @for (headerAction of headerActions; track headerAction.id) {
            <button
              type="button"
              class="ui-popup__action"
              [ngClass]="actionPaletteClass(headerAction)"
              [class.ui-popup__action--active]="headerAction.active"
              [class.ui-popup__action--icon-only]="!headerAction.label"
              [class.ui-popup__action--compact-mobile]="headerAction.compactOnMobile"
              [disabled]="headerAction.disabled"
              [attr.aria-label]="headerAction.ariaLabel || headerAction.label || headerAction.id"
              (click)="selectAction(headerAction, $event)"
            >
              <mat-icon>{{ headerAction.icon }}</mat-icon>
              @if (headerAction.label) {
                <span class="ui-popup__action-label">{{ headerAction.label | i18n }}</span>
              }
              @if (actionCounterValue(headerAction)) {
                <span class="ui-popup__action-counter">{{ actionCounterValue(headerAction) }}</span>
              }
            </button>
          }
          @if (showClose) {
            <button type="button" class="ui-popup__close" (click)="emitClose($event)" [attr.aria-label]="closeAriaLabel | i18n">
              <mat-icon>close</mat-icon>
            </button>
          }
        </div>
      </header>
    }

    @if (!hasHeader && showClose) {
      <button type="button" class="ui-popup__close ui-popup__close--floating" (click)="emitClose($event)" [attr.aria-label]="closeAriaLabel | i18n">
        <mat-icon>close</mat-icon>
      </button>
    }

    @if (hasToolbar) {
      <div
        class="ui-popup__toolbar"
        [class.ui-popup__toolbar--mobile-start]="popupModel.toolbarMobileAlign === 'start'"
        [class.ui-popup__toolbar--mobile-center]="popupModel.toolbarMobileAlign === 'center'"
        [class.ui-popup__toolbar--mobile-end]="popupModel.toolbarMobileAlign === 'end'"
      >
        @if (hasToolbarStartControls) {
          <div class="ui-popup__toolbar-group ui-popup__toolbar-group--start">
            @for (control of toolbarStartControls; track control.id) {
              @if (isMenuControl(control)) {
                <app-menu
                  class="ui-popup__control"
                  [kind]="control.menuKind ?? 'select'"
                  [title]="control.title ?? null"
                  [trigger]="control.trigger ?? null"
                  [items]="control.items ?? []"
                  [groups]="control.groups ?? []"
                  [model]="control.model ?? null"
                  [panelAlign]="control.panelAlign ?? 'auto'"
                  [panelMode]="control.panelMode ?? 'auto'"
                  [mobileBreakpointPx]="control.mobileBreakpointPx ?? 760"
                  [closeOnSelect]="control.closeOnSelect ?? true"
                  (itemSelect)="selectMenuItem(control, $event)"
                ></app-menu>
              } @else if (isDateInputControl(control)) {
                @defer (on immediate) {
                  <app-date-input
                    class="ui-popup__date-input"
                    [model]="control.model"
                    [ngModel]="control.value"
                    (ngModelChange)="changeDateInput(control, $event)"
                  ></app-date-input>
                }
              } @else {
                <button
                  type="button"
                  class="ui-popup__action"
                  [ngClass]="actionPaletteClass(control)"
                  [class.ui-popup__action--active]="control.active"
                  [class.ui-popup__action--icon-only]="!control.label"
                  [class.ui-popup__action--compact-mobile]="control.compactOnMobile"
                  [disabled]="control.disabled"
                  [attr.aria-label]="control.ariaLabel || control.label || control.id"
                  (click)="selectAction(control, $event)"
                >
                  <mat-icon>{{ control.icon }}</mat-icon>
                  @if (control.label) {
                    <span class="ui-popup__action-label">{{ control.label | i18n }}</span>
                  }
                  @if (actionCounterValue(control)) {
                    <span class="ui-popup__action-counter">{{ actionCounterValue(control) }}</span>
                  }
                </button>
              }
            }
          </div>
        }
        @if (hasToolbarEndControls) {
          <div class="ui-popup__toolbar-group ui-popup__toolbar-group--end">
            @for (control of toolbarEndControls; track control.id) {
              @if (isMenuControl(control)) {
                <app-menu
                  class="ui-popup__control"
                  [kind]="control.menuKind ?? 'select'"
                  [title]="control.title ?? null"
                  [trigger]="control.trigger ?? null"
                  [items]="control.items ?? []"
                  [groups]="control.groups ?? []"
                  [model]="control.model ?? null"
                  [panelAlign]="control.panelAlign ?? 'auto'"
                  [panelMode]="control.panelMode ?? 'auto'"
                  [mobileBreakpointPx]="control.mobileBreakpointPx ?? 760"
                  [closeOnSelect]="control.closeOnSelect ?? true"
                  (itemSelect)="selectMenuItem(control, $event)"
                ></app-menu>
              } @else if (isDateInputControl(control)) {
                @defer (on immediate) {
                  <app-date-input
                    class="ui-popup__date-input"
                    [model]="control.model"
                    [ngModel]="control.value"
                    (ngModelChange)="changeDateInput(control, $event)"
                  ></app-date-input>
                }
              } @else {
                <button
                  type="button"
                  class="ui-popup__action"
                  [ngClass]="actionPaletteClass(control)"
                  [class.ui-popup__action--active]="control.active"
                  [class.ui-popup__action--icon-only]="!control.label"
                  [class.ui-popup__action--compact-mobile]="control.compactOnMobile"
                  [disabled]="control.disabled"
                  [attr.aria-label]="control.ariaLabel || control.label || control.id"
                  (click)="selectAction(control, $event)"
                >
                  <mat-icon>{{ control.icon }}</mat-icon>
                  @if (control.label) {
                    <span class="ui-popup__action-label">{{ control.label | i18n }}</span>
                  }
                  @if (actionCounterValue(control)) {
                    <span class="ui-popup__action-counter">{{ actionCounterValue(control) }}</span>
                  }
                </button>
              }
            }
          </div>
        }
      </div>
    }

    <div class="ui-popup__body" [ngClass]="bodyLayoutClass()">
      <ng-content></ng-content>
    </div>
  </section>
</div>
`, styles: ['/* src/app/shared/ui/components/core/popup/popup.component.scss */\napp-popup {\n  display: contents;\n  --line: rgba(23, 33, 54, 0.12);\n  --line-strong: rgba(23, 33, 54, 0.2);\n  --text-main: #22324a;\n  --text-muted: rgba(23, 41, 66, 0.72);\n}\n.ui-popup {\n  position: fixed;\n  inset: 0;\n  z-index: 2300;\n  display: flex;\n  align-items: flex-start;\n  justify-content: center;\n  padding: 1rem;\n}\n.ui-popup--fullscreen {\n  align-items: stretch;\n  justify-content: stretch;\n  padding: 0;\n}\n@media (min-width: 761px) {\n  .ui-popup--auto-height {\n    align-items: center;\n  }\n}\n.ui-popup__backdrop {\n  position: absolute;\n  inset: 0;\n  background: #e9edf5;\n}\n.ui-popup__backdrop--dim {\n  background: rgba(8, 16, 30, 0.56);\n  -webkit-backdrop-filter: blur(3px);\n  backdrop-filter: blur(3px);\n}\n.ui-popup__panel {\n  position: relative;\n  z-index: 1;\n  width: min(760px, 100vw - 1.2rem);\n  max-height: calc(100vh - 1.2rem);\n  max-height: calc(100dvh - 1.2rem);\n  border-radius: 14px;\n  background: #fff;\n  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.26);\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n}\n.ui-popup__panel--small {\n  width: min(var(--app-popup-small-width, 380px), 100vw - 1.2rem);\n}\n.ui-popup__panel--wide {\n  width: min(1080px, 100vw - 1.2rem);\n}\n.ui-popup__panel--fullscreen {\n  width: 100vw;\n  max-width: 100vw;\n  min-width: 100vw;\n  height: 100vh;\n  height: 100dvh;\n  max-height: 100vh;\n  max-height: 100dvh;\n  min-height: 100vh;\n  min-height: 100dvh;\n  border-radius: 0;\n  background: #111317;\n  box-shadow: none;\n}\n.ui-popup__panel--height-full {\n  height: calc(100vh - 1.2rem);\n  height: calc(100dvh - 1.2rem);\n  max-height: calc(100vh - 1.2rem);\n  max-height: calc(100dvh - 1.2rem);\n}\n.ui-popup__header {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto auto;\n  grid-template-areas: "title controls actions";\n  align-items: center;\n  gap: 0.42rem;\n  padding: 0.58rem 0.4rem;\n  border-bottom: 1px solid var(--line);\n  position: relative;\n  flex: 0 0 auto;\n}\n.ui-popup__header--accent {\n  border-bottom-color: rgba(46, 114, 184, 0.2);\n}\n.ui-popup__header--layout-article {\n  align-items: flex-start;\n  gap: 0.72rem;\n  padding: clamp(0.84rem, 2vw, 1.35rem) clamp(0.84rem, 2vw, 1.35rem) 0;\n  border-bottom: 0;\n}\n.ui-popup__header--layout-document {\n  --ui-popup-document-header-bg:\n    linear-gradient(\n      180deg,\n      #eef3f8 0%,\n      #f8fafc 100%);\n  --ui-popup-document-header-border: rgba(72, 92, 118, 0.24);\n  --ui-popup-document-header-title: #304157;\n  --ui-popup-document-header-text: rgba(48, 65, 87, 0.78);\n  --ui-popup-document-header-badge-bg: #40566f;\n  align-items: flex-start;\n  gap: 0.62rem;\n  padding: 0.9rem 0.72rem 0.82rem;\n  border-bottom-color: var(--ui-popup-document-header-border);\n  background: var(--ui-popup-document-header-bg);\n}\n.ui-popup__header--palette-amber {\n  --ui-popup-document-header-bg:\n    linear-gradient(\n      180deg,\n      #fbf4e8 0%,\n      #fffaf0 100%);\n  --ui-popup-document-header-border: rgba(157, 118, 41, 0.24);\n  --ui-popup-document-header-title: #7c5618;\n  --ui-popup-document-header-text: rgba(108, 74, 19, 0.84);\n  --ui-popup-document-header-badge-bg: #b66a15;\n}\n.ui-popup__header--palette-blue {\n  --ui-popup-document-header-bg:\n    linear-gradient(\n      180deg,\n      #eef6ff 0%,\n      #f8fbff 100%);\n  --ui-popup-document-header-border: rgba(53, 96, 162, 0.24);\n  --ui-popup-document-header-title: #1f3f6f;\n  --ui-popup-document-header-text: rgba(46, 78, 119, 0.84);\n  --ui-popup-document-header-badge-bg: #2f6fae;\n}\n.ui-popup__header--palette-green {\n  --ui-popup-document-header-bg:\n    linear-gradient(\n      180deg,\n      #f0fbf3 0%,\n      #e4f7ea 100%);\n  --ui-popup-document-header-border: rgba(58, 143, 91, 0.3);\n  --ui-popup-document-header-title: #246b42;\n  --ui-popup-document-header-text: rgba(35, 94, 58, 0.84);\n  --ui-popup-document-header-badge-bg: #1f7a49;\n}\n.ui-popup__header--palette-teal {\n  --ui-popup-document-header-bg:\n    linear-gradient(\n      180deg,\n      #eefafa 0%,\n      #f7fdfd 100%);\n  --ui-popup-document-header-border: rgba(33, 126, 132, 0.24);\n  --ui-popup-document-header-title: #17646d;\n  --ui-popup-document-header-text: rgba(28, 91, 99, 0.84);\n  --ui-popup-document-header-badge-bg: #197987;\n}\n.ui-popup__header--palette-rose {\n  --ui-popup-document-header-bg:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #fff8fa 100%);\n  --ui-popup-document-header-border: rgba(178, 69, 98, 0.26);\n  --ui-popup-document-header-title: #8c2e49;\n  --ui-popup-document-header-text: rgba(122, 45, 70, 0.84);\n  --ui-popup-document-header-badge-bg: #b94462;\n}\n.ui-popup__header--palette-violet {\n  --ui-popup-document-header-bg:\n    linear-gradient(\n      180deg,\n      #f5f0ff 0%,\n      #fbf8ff 100%);\n  --ui-popup-document-header-border: rgba(107, 80, 175, 0.26);\n  --ui-popup-document-header-title: #50398e;\n  --ui-popup-document-header-text: rgba(75, 52, 128, 0.84);\n  --ui-popup-document-header-badge-bg: #6b50af;\n}\n.ui-popup__header--palette-slate {\n  --ui-popup-document-header-bg:\n    linear-gradient(\n      180deg,\n      #eef3f8 0%,\n      #f8fafc 100%);\n  --ui-popup-document-header-border: rgba(72, 92, 118, 0.24);\n  --ui-popup-document-header-title: #304157;\n  --ui-popup-document-header-text: rgba(48, 65, 87, 0.78);\n  --ui-popup-document-header-badge-bg: #40566f;\n}\n.ui-popup__header--title-neutral {\n  --ui-popup-document-header-title: #172234;\n  --ui-popup-document-header-text: #172234;\n}\n.ui-popup__title {\n  grid-area: title;\n  min-width: 0;\n}\n.ui-popup__title-line {\n  min-width: 0;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.4rem;\n  max-width: 100%;\n}\n.ui-popup__title-line h2 {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.ui-popup__label {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  color: rgba(39, 66, 101, 0.76);\n  font-size: 0.74rem;\n  font-weight: 800;\n}\n.ui-popup__label .mat-icon {\n  width: 14px;\n  height: 14px;\n  font-size: 14px;\n  line-height: 14px;\n}\n.ui-popup__header--layout-document .ui-popup__label {\n  color: var(--ui-popup-document-header-text);\n  font-size: 0.78rem;\n  font-weight: 900;\n}\n.ui-popup__title h2 {\n  margin: 0;\n  font-size: 1.05rem;\n  color: var(--text-main);\n  font-weight: 700;\n  letter-spacing: 0;\n}\n.ui-popup__header--layout-article .ui-popup__title {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  gap: 0.3rem;\n}\n.ui-popup__header--layout-article .ui-popup__title-line {\n  order: -1;\n}\n.ui-popup__header--layout-article .ui-popup__title h2 {\n  margin: 0;\n  max-width: 820px;\n  color: #173456;\n  font-size: clamp(1.2rem, 2.2vw, 1.65rem);\n  line-height: 1.2;\n  font-weight: 950;\n  white-space: normal;\n  overflow-wrap: anywhere;\n}\n.ui-popup__header--layout-document .ui-popup__title h2 {\n  color: var(--ui-popup-document-header-title);\n  font-size: clamp(1.22rem, 2.4vw, 1.52rem);\n  line-height: 1.12;\n  font-weight: 950;\n}\n.ui-popup__subtitle {\n  margin: 0.14rem 0 0;\n  font-size: 0.74rem;\n  font-weight: 700;\n  color: rgba(21, 39, 62, 0.72);\n}\n.ui-popup__header--layout-article .ui-popup__subtitle {\n  max-width: 72ch;\n  margin: 0.54rem 0 0;\n  color: rgba(31, 54, 88, 0.76);\n  font-size: 0.94rem;\n  font-weight: 800;\n  line-height: 1.42;\n}\n.ui-popup__header--layout-document .ui-popup__subtitle {\n  margin-top: 0.34rem;\n  color: var(--ui-popup-document-header-text);\n  font-size: 0.88rem;\n  font-weight: 400;\n  line-height: 1.45;\n}\n.ui-popup__subtitle--secondary {\n  margin-top: 0.04rem;\n  font-size: 0.68rem;\n  font-weight: 800;\n  letter-spacing: 0.01em;\n  color: rgba(21, 39, 62, 0.58);\n}\n.ui-popup__header-controls {\n  grid-area: controls;\n  min-width: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.34rem;\n}\n.ui-popup__header-controls:empty {\n  display: none;\n}\n.ui-popup__header-actions {\n  grid-area: actions;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.34rem;\n}\n.ui-popup__header--layout-document .ui-popup__header-actions {\n  align-items: flex-start;\n}\n.ui-popup__header-actions--empty {\n  display: none;\n}\n.ui-popup__badge {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 0;\n  min-height: 1.86rem;\n  border-radius: 999px;\n  background: #e8eef6;\n  color: #28476d;\n  padding: 0 0.72rem;\n  font-size: 0.74rem;\n  font-weight: 900;\n  line-height: 1;\n  white-space: nowrap;\n}\n.ui-popup__badge--title {\n  min-height: 1.42rem;\n  padding: 0 0.52rem;\n  font-size: 0.68rem;\n  flex: 0 0 auto;\n}\n.ui-popup__badge--title[data-tone=warning] {\n  border: 1px solid rgba(190, 129, 38, 0.28);\n  background: #fff1d9;\n  color: #8c5a16;\n}\n.ui-popup__badge--title[data-tone=danger] {\n  border: 1px solid rgba(190, 60, 76, 0.28);\n  background: #ffe7ea;\n  color: #9c3040;\n}\n.ui-popup__header--layout-document .ui-popup__badge {\n  min-height: 1.88rem;\n  background: var(--ui-popup-document-header-badge-bg);\n  color: #fff;\n  font-size: 0.78rem;\n  box-shadow: none;\n}\n.ui-popup__toolbar {\n  flex: 0 0 auto;\n  padding: 0.4rem 0.4rem 0;\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: start;\n  gap: 0.36rem 0.5rem;\n}\n.ui-popup__toolbar-group {\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.ui-popup__toolbar-group--start {\n  grid-column: 1;\n  justify-content: flex-start;\n  flex-wrap: wrap;\n}\n.ui-popup__toolbar-group--end {\n  grid-column: 2;\n  justify-content: flex-end;\n  flex-wrap: nowrap;\n  white-space: nowrap;\n}\n.ui-popup__toolbar-group--end .ui-popup__action,\n.ui-popup__toolbar-group--end .ui-popup__control,\n.ui-popup__toolbar-group--end .ui-popup__date-input {\n  flex: 0 0 auto;\n}\n.ui-popup__date-input {\n  flex: 0 0 auto;\n  min-width: 0;\n}\n.ui-popup__body {\n  padding: 0.4rem;\n  overflow-y: auto;\n  overflow-x: hidden;\n  display: flex;\n  flex-direction: column;\n  gap: 0.72rem;\n  flex: 1 1 auto;\n  min-height: 0;\n}\n.ui-popup__body--fill {\n  overflow: hidden;\n}\n.ui-popup__body--flush {\n  padding: 0;\n  gap: 0;\n  overflow: hidden;\n}\n@media (min-width: 761px) {\n  .ui-popup__panel--overflow-visible,\n  .ui-popup__body--overflow {\n    overflow: visible;\n  }\n}\n.ui-popup__action {\n  position: relative;\n  min-width: 2.25rem;\n  min-height: 2.25rem;\n  height: 2.25rem;\n  border: 1px solid rgba(30, 88, 152, 0.46);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #e2f0ff 0%,\n      #c5dbf8 100%);\n  color: #15457c;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.34rem;\n  cursor: pointer;\n  box-shadow: 0 2px 8px rgba(31, 79, 132, 0.18);\n  padding: 0 0.58rem;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 800;\n  line-height: 1;\n  white-space: nowrap;\n}\n.ui-popup__action-counter {\n  position: absolute;\n  top: -0.28rem;\n  right: -0.28rem;\n  min-width: 1rem;\n  height: 1rem;\n  padding: 0 0.24rem;\n  border-radius: 999px;\n  border: 1px solid rgba(255, 255, 255, 0.86);\n  color: #ffffff;\n  background: #d63838;\n  box-shadow: 0 2px 6px rgba(98, 32, 32, 0.22);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  font-size: 0.62rem;\n  line-height: 1;\n  font-weight: 900;\n  pointer-events: none;\n}\n.ui-popup__action--icon-only {\n  width: 2.25rem;\n  padding: 0;\n  border-radius: 50%;\n}\n.ui-popup__action .mat-icon {\n  width: 1.14rem;\n  height: 1.14rem;\n  font-size: 1.14rem;\n  line-height: 1.14rem;\n  pointer-events: none;\n}\n.ui-popup__action:hover {\n  background:\n    linear-gradient(\n      180deg,\n      #d4e8ff 0%,\n      #b5d1f3 100%);\n  border-color: rgba(27, 74, 130, 0.6);\n  color: #103966;\n  box-shadow: 0 4px 10px rgba(28, 69, 114, 0.24);\n}\n.ui-popup__action:active:not(:disabled) {\n  box-shadow: 0 1px 4px rgba(36, 74, 121, 0.2);\n}\n.ui-popup__action:disabled {\n  opacity: 0.54;\n  cursor: not-allowed;\n  box-shadow: 0 2px 8px rgba(31, 79, 132, 0.12);\n}\n.ui-popup__action--neutral,\n.ui-popup__action--muted {\n  border-color: rgba(90, 108, 130, 0.28);\n  background:\n    linear-gradient(\n      180deg,\n      #f8fafc 0%,\n      #edf1f6 100%);\n  color: #4c617a;\n  box-shadow: 0 2px 7px rgba(55, 75, 101, 0.12);\n}\n.ui-popup__action--neutral:hover,\n.ui-popup__action--muted:hover {\n  border-color: rgba(78, 98, 124, 0.4);\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #e7edf4 100%);\n  color: #3f5570;\n  box-shadow: 0 4px 10px rgba(55, 75, 101, 0.16);\n}\n.ui-popup__action--gold,\n.ui-popup__action--amber {\n  border-color: rgba(188, 138, 24, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #fff7df 0%,\n      #ffefc6 100%);\n  color: #8d5d10;\n  box-shadow: 0 5px 13px rgba(180, 127, 23, 0.2);\n}\n.ui-popup__action--gold:hover,\n.ui-popup__action--amber:hover {\n  border-color: rgba(188, 138, 24, 0.62);\n  background:\n    linear-gradient(\n      180deg,\n      #fff2c9 0%,\n      #ffe3a3 100%);\n  color: #7d4f0a;\n  box-shadow: 0 4px 10px rgba(180, 127, 23, 0.22);\n}\n.ui-popup__action--blue,\n.ui-popup__action--sky {\n  border-color: rgba(48, 85, 138, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #f7fbff 0%,\n      #edf4ff 100%);\n  color: #2c5f9b;\n}\n.ui-popup__action--green,\n.ui-popup__action--success {\n  border-color: rgba(47, 142, 95, 0.38);\n  background:\n    linear-gradient(\n      180deg,\n      #effbf4 0%,\n      #dbf2e5 100%);\n  color: #23734a;\n}\n.ui-popup__action--violet,\n.ui-popup__action--purple {\n  border-color: rgba(102, 79, 174, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #f0ecff 0%,\n      #e3dbff 100%);\n  color: #5a43a9;\n}\n.ui-popup__action--rose,\n.ui-popup__action--pink {\n  border-color: rgba(183, 88, 104, 0.42);\n  background:\n    linear-gradient(\n      180deg,\n      #fff4f5 0%,\n      #ffe8eb 100%);\n  color: #9b3345;\n  box-shadow: 0 2px 7px rgba(134, 51, 68, 0.12);\n}\n.ui-popup__action--rose:hover,\n.ui-popup__action--pink:hover {\n  border-color: rgba(167, 45, 66, 0.52);\n  background:\n    linear-gradient(\n      180deg,\n      #ffecef 0%,\n      #fbd8de 100%);\n  color: #8b1f32;\n  box-shadow: 0 4px 10px rgba(134, 51, 68, 0.18);\n}\n.ui-popup__action--danger,\n.ui-popup__action--red {\n  border-color: rgba(147, 31, 31, 0.64);\n  background:\n    linear-gradient(\n      180deg,\n      #ffe8e8 0%,\n      #ffcfcf 100%);\n  color: #9a2626;\n}\n.ui-popup__action--active {\n  border-color: rgba(26, 68, 124, 0.68);\n  background:\n    linear-gradient(\n      180deg,\n      #d3e4ff 0%,\n      #bfd7ff 100%);\n  color: #123d73;\n}\n.ui-popup__action--rose.ui-popup__action--active,\n.ui-popup__action--pink.ui-popup__action--active {\n  border-color: rgba(167, 45, 66, 0.56);\n  background:\n    linear-gradient(\n      180deg,\n      #f7dde1 0%,\n      #f2c8ce 100%);\n  color: #8b1f32;\n  box-shadow: 0 4px 12px rgba(186, 65, 86, 0.2);\n}\n.ui-popup__close {\n  flex: 0 0 auto;\n  width: 34px;\n  height: 34px;\n  min-width: 34px;\n  min-height: 34px;\n  border: 1px solid rgba(47, 86, 139, 0.2);\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.92);\n  color: rgba(38, 67, 105, 0.92);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  padding: 0;\n  line-height: 0;\n  box-sizing: border-box;\n  box-shadow: 0 8px 18px rgba(37, 62, 95, 0.12);\n  --mdc-icon-button-state-layer-size: 34px;\n}\n.ui-popup__close .mat-icon {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 21px;\n  height: 21px;\n  font-size: 21px;\n  line-height: 21px;\n  margin: 0;\n}\n.ui-popup__close:not(:disabled):not([aria-disabled=true]):hover {\n  border-color: rgba(47, 86, 139, 0.32);\n  background: #fff;\n  color: rgba(24, 50, 84, 0.98);\n}\n.ui-popup__close:not(:disabled):not([aria-disabled=true]):active {\n  background: rgba(239, 245, 252, 0.96);\n}\n.ui-popup__close:focus-visible {\n  outline: 2px solid rgba(61, 108, 186, 0.35);\n  outline-offset: 1px;\n}\n.ui-popup__close--floating {\n  position: absolute;\n  top: 1rem;\n  right: 1rem;\n  z-index: 20;\n}\n.ui-popup__close:disabled,\n.ui-popup__close[aria-disabled=true] {\n  opacity: 0.56;\n  cursor: default;\n}\n@media (max-width: 760px) {\n  .ui-popup {\n    padding: 0;\n    align-items: stretch;\n  }\n  .ui-popup__panel {\n    width: 100vw !important;\n    max-width: 100vw !important;\n    height: 100vh !important;\n    height: 100dvh !important;\n    max-height: 100vh !important;\n    max-height: 100dvh !important;\n    min-height: 100dvh;\n    margin: 0 !important;\n    border-radius: 0;\n    box-shadow: none;\n  }\n  .ui-popup.ui-popup--mobile-compact {\n    padding: 0.6rem;\n    align-items: center;\n  }\n  .ui-popup--mobile-compact .ui-popup__panel {\n    width: min(380px, 100vw - 1.2rem) !important;\n    max-width: min(380px, 100vw - 1.2rem) !important;\n    height: auto !important;\n    max-height: calc(100vh - 1.2rem) !important;\n    max-height: calc(100dvh - 1.2rem) !important;\n    min-height: 0;\n    margin: 0 !important;\n    border-radius: 14px;\n    box-shadow: 0 18px 42px rgba(0, 0, 0, 0.26);\n  }\n  .ui-popup__body--overflow {\n    overflow-y: auto;\n    overflow-x: hidden;\n  }\n  .ui-popup__header {\n    align-items: start;\n    gap: 0.36rem 0.44rem;\n    padding: 0.52rem 0.48rem 0.44rem;\n  }\n  .ui-popup__header--layout-article {\n    padding: 0.78rem 0.78rem 0;\n  }\n  .ui-popup__header--layout-document {\n    padding: 0.72rem 0.64rem;\n  }\n  .ui-popup__header--layout-article .ui-popup__title h2 {\n    font-size: clamp(1.15rem, 5vw, 1.4rem);\n  }\n  .ui-popup__header--layout-document .ui-popup__title h2 {\n    font-size: clamp(1.18rem, 5.4vw, 1.42rem);\n  }\n  .ui-popup__header-controls {\n    width: auto;\n    min-width: 0;\n    flex-wrap: nowrap;\n  }\n  .ui-popup__header-controls app-menu {\n    max-width: 100%;\n  }\n  .ui-popup__toolbar {\n    padding: 0.36rem 0.48rem 0;\n    display: flex;\n    align-items: center;\n    flex-wrap: nowrap;\n    gap: 0.24rem;\n    overflow: visible;\n  }\n  .ui-popup__toolbar-group {\n    gap: 0.24rem;\n    flex-wrap: nowrap;\n  }\n  .ui-popup__toolbar-group--start {\n    flex: 1 1 auto;\n    min-width: 0;\n  }\n  .ui-popup__toolbar-group--start .ui-popup__control {\n    flex: 0 1 auto;\n    min-width: 0;\n  }\n  .ui-popup__toolbar-group--start app-menu.ui-popup__control.app-menu-host--inline-row-labelled-action {\n    flex: 1 1 auto;\n    width: 100%;\n    min-width: 0;\n  }\n  .ui-popup__toolbar-group--end {\n    flex: 0 0 auto;\n    gap: 0.24rem;\n    margin-left: auto;\n  }\n  .ui-popup__toolbar-group--end:has(app-menu.ui-popup__control.app-menu-host--inline-row-labelled-action) {\n    flex: 1 1 auto;\n    width: 100%;\n    min-width: 0;\n    margin-left: 0;\n  }\n  .ui-popup__toolbar-group--end app-menu.ui-popup__control.app-menu-host--inline-row-labelled-action {\n    flex: 1 1 auto;\n    width: 100%;\n    min-width: 0;\n  }\n  .ui-popup__toolbar--mobile-start .ui-popup__toolbar-group--end,\n  .ui-popup__toolbar--mobile-center .ui-popup__toolbar-group--end,\n  .ui-popup__toolbar--mobile-end .ui-popup__toolbar-group--end {\n    margin-left: 0;\n  }\n  .ui-popup__toolbar--mobile-start {\n    justify-content: flex-start;\n  }\n  .ui-popup__toolbar--mobile-center {\n    justify-content: center;\n  }\n  .ui-popup__toolbar--mobile-center .ui-popup__toolbar-group {\n    flex: 1 1 auto;\n    width: 100%;\n    min-width: 0;\n    justify-content: center;\n  }\n  .ui-popup__toolbar--mobile-center .ui-popup__toolbar-group app-menu.ui-popup__control.app-menu-host--kind-select {\n    flex: 1 1 auto;\n    width: auto;\n    min-width: 0;\n  }\n  .ui-popup__toolbar--mobile-end {\n    justify-content: flex-end;\n  }\n  .ui-popup__toolbar .app-menu__trigger {\n    gap: 0.22rem;\n    min-width: 0;\n    padding-inline: 0.42rem;\n    font-size: 0.74rem;\n  }\n  .ui-popup__toolbar .app-menu__trigger-label {\n    text-overflow: clip;\n  }\n  .ui-popup__toolbar .app-menu__trigger .mat-icon,\n  .ui-popup__toolbar .app-menu__trigger-caret {\n    width: 1rem;\n    height: 1rem;\n    font-size: 1rem;\n    line-height: 1rem;\n  }\n  .ui-popup__action--compact-mobile {\n    width: 2.25rem;\n    padding: 0;\n    border-radius: 50%;\n  }\n  .ui-popup__action--compact-mobile .ui-popup__action-label {\n    display: none;\n  }\n}\n/*# sourceMappingURL=popup.component.css.map */\n'] }]
    }], null, { model: [{
      type: Input
    }], zIndex: [{
      type: Input
    }], active: [{
      type: Input
    }], close: [{
      type: Output
    }], menuSelect: [{
      type: Output
    }], action: [{
      type: Output
    }], dateInputChange: [{
      type: Output
    }] });
  });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PopupComponent, { className: "PopupComponent", filePath: "app/shared/ui/components/core/popup/popup.component.ts", lineNumber: 40 });
})();

export {
  PopupComponent
};
//# sourceMappingURL=chunk-ERGA5DCY.js.map
