import "./chunk-RKNUQ7BV.js";
import "./chunk-GNEKNDCW.js";
import "./chunk-EFOSAJ7V.js";
import "./chunk-K46F5X52.js";
import "./chunk-DCIHJJ5Y.js";
import "./chunk-PA3YBM43.js";
import "./chunk-FJ66QUKQ.js";
import "./chunk-SYKOEE4K.js";
import "./chunk-KQF6FQ63.js";
import "./chunk-PM3I2T2H.js";
import {
  SmartListComponent
} from "./chunk-QGX3AOF4.js";
import "./chunk-7YBTTPXY.js";
import "./chunk-ECWKXWGH.js";
import "./chunk-QNXIGSHX.js";
import {
  FormFlowComponent
} from "./chunk-UNJZCHXH.js";
import "./chunk-JEQIAF2O.js";
import "./chunk-U7SHZOGZ.js";
import "./chunk-52WP4I47.js";
import "./chunk-RJSPRCFL.js";
import "./chunk-XXLX3JOX.js";
import "./chunk-BN6P7BIB.js";
import "./chunk-LXXIK2TC.js";
import "./chunk-4VYYFWRA.js";
import "./chunk-RB7FL7JP.js";
import "./chunk-L4DRPM6F.js";
import "./chunk-YAY5TUPV.js";
import {
  PopupComponent
} from "./chunk-GBRBIJ5J.js";
import "./chunk-VEYRCVMX.js";
import "./chunk-MVR37RGJ.js";
import {
  DefaultValueAccessor,
  FormsModule,
  I18nPipe,
  IndicatorComponent,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-QD6QQNQX.js";
import "./chunk-OAYWPJGG.js";
import "./chunk-6TR3Z2F3.js";
import "./chunk-U46O4F4Y.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-EDHGCWPF.js";
import "./chunk-CUDLB52K.js";
import "./chunk-NJTJOLRZ.js";
import {
  AdminMenuStore
} from "./chunk-ZJ74HL3J.js";
import {
  AdminNotificationsService
} from "./chunk-C2QYRRDX.js";
import "./chunk-Y3NEBFNQ.js";
import "./chunk-PB4YNHSN.js";
import "./chunk-VUN7WUNQ.js";
import "./chunk-5PHTFUHA.js";
import "./chunk-Y2Y4ZDHH.js";
import {
  I18nService
} from "./chunk-B7YPVC5F.js";
import "./chunk-XQ4NDAVX.js";
import "./chunk-4FWVIYNI.js";
import "./chunk-MS7VTGLY.js";
import {
  CommonModule,
  NgClass,
  NgTemplateOutlet
} from "./chunk-J7IJFFQ2.js";
import "./chunk-XQACYBVS.js";
import "./chunk-2IE5VYAT.js";
import "./chunk-B2DKYQGD.js";
import {
  UserProfileStore
} from "./chunk-INZQPXQM.js";
import "./chunk-IECLTXM5.js";
import "./chunk-333NTD7D.js";
import "./chunk-LERGHE7K.js";
import "./chunk-D6ZHKNYF.js";
import "./chunk-SKAK727J.js";
import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  __spreadProps,
  __spreadValues,
  computed,
  effect,
  from,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵviewQuery
} from "./chunk-XJL7SWH7.js";

// src/app/admin/components/notifications-popup/admin-notifications-popup.component.ts
var _c0 = ["processSmartList"];
var _c1 = (a0) => ({ $implicit: a0 });
var _forTrack0 = ($index, $item) => $item.id;
var _forTrack1 = ($index, $item) => $item.group;
var _forTrack2 = ($index, $item) => $item.key;
var _forTrack3 = ($index, $item) => $item.value;
function AdminNotificationsPopupComponent_Conditional_0_ng_template_1_For_4_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span");
  }
}
function AdminNotificationsPopupComponent_Conditional_0_ng_template_1_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, AdminNotificationsPopupComponent_Conditional_0_ng_template_1_For_4_Conditional_3_Template, 1, 0, "span");
  }
  if (rf & 2) {
    const part_r1 = ctx.$implicit;
    const \u0275$index_10_r2 = ctx.$index;
    const \u0275$count_10_r3 = ctx.$count;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", part_r1.value, " ", \u0275\u0275pipeBind1(2, 3, part_r1.unitKey));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!(\u0275$index_10_r2 === \u0275$count_10_r3 - 1) ? 3 : -1);
  }
}
function AdminNotificationsPopupComponent_Conditional_0_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, AdminNotificationsPopupComponent_Conditional_0_ng_template_1_For_4_Template, 4, 5, null, null, \u0275\u0275repeaterTrackByIndex);
  }
  if (rf & 2) {
    const rule_r4 = ctx.$implicit;
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind1(2, 1, ctx_r4.jobI18n.interval.every), " ");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r4.intervalParts(rule_r4));
  }
}
function AdminNotificationsPopupComponent_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275element(1, "app-indicator", 7);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("durationMs", ctx_r4.notificationsService.notificationCenterLoadProgressWindowMs());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 2, "admin.jobs.loading"));
  }
}
function AdminNotificationsPopupComponent_Conditional_0_Conditional_5_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "mat-icon");
    \u0275\u0275text(2, "warning");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 1, ctx_r4.error()));
  }
}
function AdminNotificationsPopupComponent_Conditional_0_Conditional_5_ng_template_20_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-indicator", 22);
  }
}
function AdminNotificationsPopupComponent_Conditional_0_Conditional_5_ng_template_20_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-indicator", 22);
  }
}
function AdminNotificationsPopupComponent_Conditional_0_Conditional_5_ng_template_20_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 25);
    \u0275\u0275pipe(1, "i18n");
    \u0275\u0275element(2, "span");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const rule_r8 = \u0275\u0275nextContext().$implicit;
    const ctx_r4 = \u0275\u0275nextContext(3);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(1, 3, "admin.jobs.runtime.progress") + " " + ctx_r4.progressValue(rule_r8) + "%");
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", ctx_r4.progressValue(rule_r8), "%");
  }
}
function AdminNotificationsPopupComponent_Conditional_0_Conditional_5_ng_template_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 12)(1, "span", 13)(2, "span", 14)(3, "mat-icon");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "span")(6, "strong");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "small");
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "i18n");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "span")(13, "span", 15);
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "span");
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span", 16);
    \u0275\u0275elementContainer(20, 17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "span", 18)(22, "span", 19)(23, "button", 20);
    \u0275\u0275pipe(24, "i18n");
    \u0275\u0275listener("click", function AdminNotificationsPopupComponent_Conditional_0_Conditional_5_ng_template_20_Template_button_click_23_listener() {
      const rule_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r4 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r4.openDetail(rule_r8));
    });
    \u0275\u0275elementStart(25, "mat-icon");
    \u0275\u0275text(26);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "span", 21);
    \u0275\u0275conditionalCreate(28, AdminNotificationsPopupComponent_Conditional_0_Conditional_5_ng_template_20_Conditional_28_Template, 1, 0, "app-indicator", 22);
    \u0275\u0275elementStart(29, "button", 23);
    \u0275\u0275pipe(30, "i18n");
    \u0275\u0275listener("click", function AdminNotificationsPopupComponent_Conditional_0_Conditional_5_ng_template_20_Template_button_click_29_listener() {
      const rule_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r4 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r4.toggleSuspended(rule_r8));
    });
    \u0275\u0275elementStart(31, "mat-icon");
    \u0275\u0275text(32);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(33, "span", 21);
    \u0275\u0275conditionalCreate(34, AdminNotificationsPopupComponent_Conditional_0_Conditional_5_ng_template_20_Conditional_34_Template, 1, 0, "app-indicator", 22);
    \u0275\u0275elementStart(35, "button", 24);
    \u0275\u0275pipe(36, "i18n");
    \u0275\u0275listener("click", function AdminNotificationsPopupComponent_Conditional_0_Conditional_5_ng_template_20_Template_button_click_35_listener() {
      const rule_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r4 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r4.run(rule_r8));
    });
    \u0275\u0275elementStart(37, "mat-icon");
    \u0275\u0275text(38);
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275conditionalCreate(39, AdminNotificationsPopupComponent_Conditional_0_Conditional_5_ng_template_20_Conditional_39_Template, 3, 5, "span", 25);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const rule_r8 = ctx.$implicit;
    \u0275\u0275nextContext(2);
    const intervalText_r9 = \u0275\u0275reference(2);
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", ctx_r4.statusClass(rule_r8));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r4.statusClass(rule_r8));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r4.processIcon(rule_r8));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 31, ctx_r4.processTitle(rule_r8)));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(11, 33, ctx_r4.actionLabel(rule_r8.actionKey)));
    \u0275\u0275advance(3);
    \u0275\u0275property("ngClass", ctx_r4.statusClass(rule_r8));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(15, 35, ctx_r4.rowStatusLabel(rule_r8)));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(18, 37, ctx_r4.shortDate(rule_r8.runState.lastRunAtIso)));
    \u0275\u0275advance(3);
    \u0275\u0275property("ngTemplateOutlet", intervalText_r9)("ngTemplateOutletContext", \u0275\u0275pureFunction1(45, _c1, rule_r8));
    \u0275\u0275advance(3);
    \u0275\u0275classProp("has-dirty", ctx_r4.isTimingDirty(rule_r8) || ctx_r4.isParameterDirty(rule_r8));
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(24, 39, "admin.jobs.view.process"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r4.canManageProcess(rule_r8) ? "tune" : "visibility");
    \u0275\u0275advance();
    \u0275\u0275classProp("is-loading", ctx_r4.isRowActionPending(rule_r8, ctx_r4.processRowAction.suspend));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r4.isRowActionPending(rule_r8, ctx_r4.processRowAction.suspend) ? 28 : -1);
    \u0275\u0275advance();
    \u0275\u0275classProp("is-suspended", !rule_r8.enabled);
    \u0275\u0275property("disabled", !ctx_r4.canManageProcess(rule_r8) || ctx_r4.saving() || !!ctx_r4.rowActionKey());
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(30, 41, rule_r8.enabled ? "admin.jobs.suspend.process" : "admin.jobs.unsuspend.process"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(rule_r8.enabled ? "pause" : "lock_open");
    \u0275\u0275advance();
    \u0275\u0275classProp("is-loading", ctx_r4.isRowActionPending(rule_r8, ctx_r4.processRowAction.run));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r4.isRowActionPending(rule_r8, ctx_r4.processRowAction.run) ? 34 : -1);
    \u0275\u0275advance();
    \u0275\u0275classProp("is-running", ctx_r4.isProcessRunning(rule_r8));
    \u0275\u0275property("disabled", !rule_r8.manualRunEnabled || !rule_r8.enabled || ctx_r4.isProcessRunning(rule_r8) || !!ctx_r4.runningRuleKey() || !!ctx_r4.rowActionKey());
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(36, 43, "admin.jobs.run.process"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r4.isProcessRunning(rule_r8) ? "sync" : "play_arrow");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r4.isProcessRunning(rule_r8) ? 39 : -1);
  }
}
function AdminNotificationsPopupComponent_Conditional_0_Conditional_5_Conditional_22_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 32);
    \u0275\u0275listener("click", function AdminNotificationsPopupComponent_Conditional_0_Conditional_5_Conditional_22_Conditional_17_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r11);
      const rule_r12 = \u0275\u0275nextContext();
      const ctx_r4 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r4.openParameterEditor(rule_r12));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "tune");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const rule_r12 = \u0275\u0275nextContext();
    const ctx_r4 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("has-dirty", ctx_r4.isParameterDirty(rule_r12));
    \u0275\u0275property("disabled", !ctx_r4.canManageProcess(rule_r12) || ctx_r4.saving());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 4, "admin.jobs.parameters"));
  }
}
function AdminNotificationsPopupComponent_Conditional_0_Conditional_5_Conditional_22_For_117_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 47)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span");
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span");
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const entry_r13 = ctx.$implicit;
    const ctx_r4 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 5, ctx_r4.shortDate(entry_r13.finishedAtIso || entry_r13.startedAtIso)));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r4.durationLabel(entry_r13.durationMillis));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(entry_r13.processedCount);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(10, 7, entry_r13.status));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(13, 9, entry_r13.detail));
  }
}
function AdminNotificationsPopupComponent_Conditional_0_Conditional_5_Conditional_22_ForEmpty_118_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 48);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "admin.jobs.no.runs"));
  }
}
function AdminNotificationsPopupComponent_Conditional_0_Conditional_5_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 6)(1, "div", 26)(2, "div", 27)(3, "div", 28)(4, "span", 29)(5, "mat-icon");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span");
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "h3");
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "p");
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 30);
    \u0275\u0275conditionalCreate(17, AdminNotificationsPopupComponent_Conditional_0_Conditional_5_Conditional_22_Conditional_17_Template, 6, 6, "button", 31);
    \u0275\u0275elementStart(18, "button", 32);
    \u0275\u0275listener("click", function AdminNotificationsPopupComponent_Conditional_0_Conditional_5_Conditional_22_Template_button_click_18_listener() {
      const rule_r12 = \u0275\u0275restoreView(_r10);
      const ctx_r4 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r4.toggleSuspended(rule_r12));
    });
    \u0275\u0275elementStart(19, "mat-icon");
    \u0275\u0275text(20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "span");
    \u0275\u0275text(22);
    \u0275\u0275pipe(23, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "button", 33);
    \u0275\u0275listener("click", function AdminNotificationsPopupComponent_Conditional_0_Conditional_5_Conditional_22_Template_button_click_24_listener() {
      const rule_r12 = \u0275\u0275restoreView(_r10);
      const ctx_r4 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r4.run(rule_r12));
    });
    \u0275\u0275elementStart(25, "mat-icon");
    \u0275\u0275text(26);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "span");
    \u0275\u0275text(28);
    \u0275\u0275pipe(29, "i18n");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(30, "div", 34)(31, "section", 35)(32, "div", 36)(33, "h3");
    \u0275\u0275text(34);
    \u0275\u0275pipe(35, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "p");
    \u0275\u0275text(37);
    \u0275\u0275pipe(38, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "div", 37)(40, "span");
    \u0275\u0275text(41);
    \u0275\u0275pipe(42, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "span");
    \u0275\u0275text(44);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(45, "div", 38);
    \u0275\u0275element(46, "span");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(47, "section", 39)(48, "div", 36)(49, "h3");
    \u0275\u0275text(50);
    \u0275\u0275pipe(51, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(52, "button", 40);
    \u0275\u0275listener("click", function AdminNotificationsPopupComponent_Conditional_0_Conditional_5_Conditional_22_Template_button_click_52_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r4 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r4.openScheduleEditor());
    });
    \u0275\u0275elementStart(53, "mat-icon");
    \u0275\u0275text(54, "schedule");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "span");
    \u0275\u0275text(56);
    \u0275\u0275pipe(57, "i18n");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(58, "div", 41)(59, "code");
    \u0275\u0275elementContainer(60, 17);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(61, "section", 39)(62, "div", 36)(63, "h3");
    \u0275\u0275text(64);
    \u0275\u0275pipe(65, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(66, "div", 42)(67, "strong");
    \u0275\u0275text(68);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(69, "span");
    \u0275\u0275text(70);
    \u0275\u0275pipe(71, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(72, "div", 43)(73, "span");
    \u0275\u0275text(74);
    \u0275\u0275pipe(75, "i18n");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(76, "section", 39)(77, "div", 36)(78, "h3");
    \u0275\u0275text(79);
    \u0275\u0275pipe(80, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(81, "div", 42)(82, "strong");
    \u0275\u0275text(83);
    \u0275\u0275pipe(84, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(85, "span");
    \u0275\u0275text(86);
    \u0275\u0275pipe(87, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(88, "div", 43)(89, "span");
    \u0275\u0275text(90);
    \u0275\u0275pipe(91, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(92, "span");
    \u0275\u0275text(93);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(94, "section", 44)(95, "div", 36)(96, "h3");
    \u0275\u0275text(97);
    \u0275\u0275pipe(98, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(99, "div", 45)(100, "div", 46)(101, "span");
    \u0275\u0275text(102);
    \u0275\u0275pipe(103, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(104, "span");
    \u0275\u0275text(105);
    \u0275\u0275pipe(106, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(107, "span");
    \u0275\u0275text(108);
    \u0275\u0275pipe(109, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(110, "span");
    \u0275\u0275text(111);
    \u0275\u0275pipe(112, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(113, "span");
    \u0275\u0275text(114);
    \u0275\u0275pipe(115, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275repeaterCreate(116, AdminNotificationsPopupComponent_Conditional_0_Conditional_5_Conditional_22_For_117_Template, 14, 11, "div", 47, _forTrack0, false, AdminNotificationsPopupComponent_Conditional_0_Conditional_5_Conditional_22_ForEmpty_118_Template, 3, 3, "div", 48);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const rule_r12 = ctx;
    \u0275\u0275nextContext(2);
    const intervalText_r9 = \u0275\u0275reference(2);
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r4.processDetailPopupModel(rule_r12))("zIndex", 2400);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r4.statusClass(rule_r12));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r4.processIcon(rule_r12));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(9, 46, "admin.jobs.scheduled.process"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(12, 48, ctx_r4.processTitle(rule_r12)));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(15, 50, ctx_r4.processDescription(rule_r12)));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r4.hasJobParameters(rule_r12) ? 17 : -1);
    \u0275\u0275advance();
    \u0275\u0275classProp("is-suspended", !rule_r12.enabled);
    \u0275\u0275property("disabled", !ctx_r4.canManageProcess(rule_r12) || ctx_r4.saving() || !!ctx_r4.rowActionKey());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(rule_r12.enabled ? "pause" : "lock_open");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(23, 52, rule_r12.enabled ? "admin.jobs.suspend" : "admin.jobs.unsuspend"));
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !rule_r12.manualRunEnabled || !rule_r12.enabled || ctx_r4.isProcessRunning(rule_r12) || !!ctx_r4.runningRuleKey());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r4.isProcessRunning(rule_r12) ? "sync" : "play_arrow");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(29, 54, ctx_r4.isProcessRunning(rule_r12) ? ctx_r4.processStatusLabelKeys[ctx_r4.statusKind(rule_r12)] : ctx_r4.jobI18n.action.run));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(35, 56, "admin.jobs.what.it.does"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(38, 58, ctx_r4.processDescription(rule_r12)));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(42, 60, rule_r12.runState.progressDetail || ctx_r4.processStatusLabelKeys[ctx_r4.statusKind(rule_r12)]));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", ctx_r4.progressValue(rule_r12), "%");
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", ctx_r4.progressValue(rule_r12), "%");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(51, 62, "admin.jobs.timing"));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("has-dirty", ctx_r4.isTimingDirty(rule_r12));
    \u0275\u0275property("disabled", !ctx_r4.hasEditableTiming(rule_r12));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(57, 64, "edit"));
    \u0275\u0275advance(4);
    \u0275\u0275property("ngTemplateOutlet", intervalText_r9)("ngTemplateOutletContext", \u0275\u0275pureFunction1(92, _c1, rule_r12));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(65, 66, ctx_r4.jobI18n.pending.title));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(rule_r12.runState.pendingCountUpdatedAtIso ? rule_r12.runState.pendingCount : "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(71, 68, rule_r12.runState.pendingCountUnit || ctx_r4.jobI18n.lastRun.affected));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", rule_r12.runState.pendingCountUpdatedAtIso ? ctx_r4.shortDate(rule_r12.runState.pendingCountUpdatedAtIso) : \u0275\u0275pipeBind1(75, 70, ctx_r4.jobI18n.pending.notCalculated), " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(80, 72, "admin.jobs.last.run"));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(84, 74, ctx_r4.shortDate(rule_r12.runState.lastRunAtIso)));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(87, 76, rule_r12.runState.lastRunDetail || ctx_r4.jobI18n.lastRun.notRunYet));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", rule_r12.runState.lastRunCount || 0, " ", \u0275\u0275pipeBind1(91, 78, ctx_r4.jobI18n.lastRun.affected));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r4.durationLabel(rule_r12.runState.durationMillis));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(98, 80, "admin.jobs.runner.history"));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(103, 82, "admin.jobs.history.when"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(106, 84, "admin.jobs.table.duration"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(109, 86, "admin.jobs.table.affected"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(112, 88, "admin.jobs.table.status"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(115, 90, "admin.jobs.history.detail"));
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r4.history(rule_r12));
  }
}
function AdminNotificationsPopupComponent_Conditional_0_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275conditionalCreate(0, AdminNotificationsPopupComponent_Conditional_0_Conditional_5_Conditional_0_Template, 6, 3, "div", 8);
    \u0275\u0275elementStart(1, "section", 9)(2, "div", 10)(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span");
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span");
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "span");
    \u0275\u0275text(16);
    \u0275\u0275pipe(17, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "app-smart-list", 11, 1);
    \u0275\u0275listener("stateChange", function AdminNotificationsPopupComponent_Conditional_0_Conditional_5_Template_app_smart_list_stateChange_18_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.onProcessListStateChange($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(20, AdminNotificationsPopupComponent_Conditional_0_Conditional_5_ng_template_20_Template, 40, 47, "ng-template", null, 2, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(22, AdminNotificationsPopupComponent_Conditional_0_Conditional_5_Conditional_22_Template, 119, 94, "app-popup", 6);
  }
  if (rf & 2) {
    let tmp_15_0;
    const processRowTemplate_r14 = \u0275\u0275reference(21);
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(ctx_r4.error() ? 0 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 11, "admin.jobs.table.process"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 13, "admin.jobs.table.status"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(11, 15, "admin.jobs.table.last.run"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(14, 17, "admin.jobs.table.run.windows"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(17, 19, "admin.jobs.table.actions"));
    \u0275\u0275advance(2);
    \u0275\u0275property("config", ctx_r4.processListConfig)("loadPage", ctx_r4.processListLoadPage)("query", ctx_r4.processListQuery())("itemTemplate", processRowTemplate_r14);
    \u0275\u0275advance(4);
    \u0275\u0275conditional((tmp_15_0 = ctx_r4.detailOpen() && ctx_r4.selectedRule()) ? 22 : -1, tmp_15_0);
  }
}
function AdminNotificationsPopupComponent_Conditional_0_Conditional_6_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 49)(1, "article", 50)(2, "div", 51)(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 52)(7, "code");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "app-form-flow", 53);
    \u0275\u0275listener("ngModelChange", function AdminNotificationsPopupComponent_Conditional_0_Conditional_6_Conditional_1_Template_app_form_flow_ngModelChange_9_listener($event) {
      \u0275\u0275restoreView(_r15);
      const scheduleRule_r16 = \u0275\u0275nextContext();
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.updateScheduleEditorDraft(scheduleRule_r16, $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 54);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "i18n");
    \u0275\u0275elementContainer(13, 17);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const scheduleRule_r16 = \u0275\u0275nextContext();
    \u0275\u0275nextContext();
    const intervalText_r9 = \u0275\u0275reference(2);
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 9, "admin.jobs.timing.rule"));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r4.intervalCron(scheduleRule_r16));
    \u0275\u0275advance();
    \u0275\u0275property("model", ctx_r4.scheduleEditorFlowModel)("disabled", ctx_r4.saving())("ngModel", ctx);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" ", \u0275\u0275pipeBind1(12, 11, "admin.jobs.start.at"), " ", ctx_r4.startTime(scheduleRule_r16), " \xB7 ");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngTemplateOutlet", intervalText_r9)("ngTemplateOutletContext", \u0275\u0275pureFunction1(13, _c1, scheduleRule_r16));
  }
}
function AdminNotificationsPopupComponent_Conditional_0_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-popup", 6);
    \u0275\u0275conditionalCreate(1, AdminNotificationsPopupComponent_Conditional_0_Conditional_6_Conditional_1_Template, 14, 15, "div", 49);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_6_0;
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275property("model", ctx_r4.scheduleEditorPopupModel(ctx))("zIndex", 2500);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_6_0 = ctx_r4.scheduleEditorDraft()) ? 1 : -1, tmp_6_0);
  }
}
function AdminNotificationsPopupComponent_Conditional_0_Conditional_7_For_3_For_7_Conditional_4_Conditional_0_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 62);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r19 = ctx.$implicit;
    \u0275\u0275property("value", option_r19.value);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(2, 2, option_r19.labelKey || option_r19.label, option_r19.label));
  }
}
function AdminNotificationsPopupComponent_Conditional_0_Conditional_7_For_3_For_7_Conditional_4_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "select", 61);
    \u0275\u0275listener("ngModelChange", function AdminNotificationsPopupComponent_Conditional_0_Conditional_7_For_3_For_7_Conditional_4_Conditional_0_Template_select_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r17);
      const field_r18 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r4 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r4.updateParameterText(field_r18, $event));
    });
    \u0275\u0275repeaterCreate(1, AdminNotificationsPopupComponent_Conditional_0_Conditional_7_For_3_For_7_Conditional_4_Conditional_0_For_2_Template, 3, 5, "option", 62, _forTrack3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r18 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r4 = \u0275\u0275nextContext(4);
    \u0275\u0275property("ngModel", field_r18.textValue)("disabled", ctx_r4.saving() || field_r18.readOnly === true);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r4.parameterOptions(field_r18));
  }
}
function AdminNotificationsPopupComponent_Conditional_0_Conditional_7_For_3_For_7_Conditional_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 63);
    \u0275\u0275listener("ngModelChange", function AdminNotificationsPopupComponent_Conditional_0_Conditional_7_For_3_For_7_Conditional_4_Conditional_1_Template_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r20);
      const field_r18 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r4 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r4.updateParameterText(field_r18, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r18 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r4 = \u0275\u0275nextContext(4);
    \u0275\u0275property("ngModel", field_r18.textValue)("disabled", ctx_r4.saving() || field_r18.readOnly === true);
  }
}
function AdminNotificationsPopupComponent_Conditional_0_Conditional_7_For_3_For_7_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AdminNotificationsPopupComponent_Conditional_0_Conditional_7_For_3_For_7_Conditional_4_Conditional_0_Template, 3, 2, "select", 59)(1, AdminNotificationsPopupComponent_Conditional_0_Conditional_7_For_3_For_7_Conditional_4_Conditional_1_Template, 1, 2, "input", 60);
  }
  if (rf & 2) {
    const field_r18 = \u0275\u0275nextContext().$implicit;
    const ctx_r4 = \u0275\u0275nextContext(4);
    \u0275\u0275conditional(ctx_r4.parameterOptions(field_r18).length ? 0 : 1);
  }
}
function AdminNotificationsPopupComponent_Conditional_0_Conditional_7_For_3_For_7_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 64);
    \u0275\u0275listener("ngModelChange", function AdminNotificationsPopupComponent_Conditional_0_Conditional_7_For_3_For_7_Conditional_5_Template_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r21);
      const field_r18 = \u0275\u0275nextContext().$implicit;
      const ctx_r4 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r4.updateParameterNumber(field_r18, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r18 = \u0275\u0275nextContext().$implicit;
    const ctx_r4 = \u0275\u0275nextContext(4);
    \u0275\u0275property("ngModel", field_r18.numberValue)("disabled", ctx_r4.saving() || field_r18.readOnly === true);
  }
}
function AdminNotificationsPopupComponent_Conditional_0_Conditional_7_For_3_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label")(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, AdminNotificationsPopupComponent_Conditional_0_Conditional_7_For_3_For_7_Conditional_4_Template, 2, 1)(5, AdminNotificationsPopupComponent_Conditional_0_Conditional_7_For_3_For_7_Conditional_5_Template, 1, 2, "input", 58);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r18 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(3, 2, field_r18.labelKey || field_r18.label, field_r18.label));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(field_r18.valueType === "text" ? 4 : 5);
  }
}
function AdminNotificationsPopupComponent_Conditional_0_Conditional_7_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 56)(1, "div", 51)(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 57);
    \u0275\u0275repeaterCreate(6, AdminNotificationsPopupComponent_Conditional_0_Conditional_7_For_3_For_7_Template, 6, 5, "label", null, _forTrack2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const group_r22 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(4, 1, group_r22.groupKey || group_r22.group, group_r22.group));
    \u0275\u0275advance(3);
    \u0275\u0275repeater(group_r22.fields);
  }
}
function AdminNotificationsPopupComponent_Conditional_0_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-popup", 6)(1, "div", 55);
    \u0275\u0275repeaterCreate(2, AdminNotificationsPopupComponent_Conditional_0_Conditional_7_For_3_Template, 8, 4, "article", 56, _forTrack1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275property("model", ctx_r4.parameterEditorPopupModel())("zIndex", 2500);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r4.parameterFieldsByGroup(ctx.fields));
  }
}
function AdminNotificationsPopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-popup", 3);
    \u0275\u0275template(1, AdminNotificationsPopupComponent_Conditional_0_ng_template_1_Template, 5, 3, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementStart(3, "div", 4);
    \u0275\u0275conditionalCreate(4, AdminNotificationsPopupComponent_Conditional_0_Conditional_4_Template, 5, 4, "div", 5)(5, AdminNotificationsPopupComponent_Conditional_0_Conditional_5_Template, 23, 21);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, AdminNotificationsPopupComponent_Conditional_0_Conditional_6_Template, 2, 3, "app-popup", 6);
    \u0275\u0275conditionalCreate(7, AdminNotificationsPopupComponent_Conditional_0_Conditional_7_Template, 4, 2, "app-popup", 6);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r4.notificationsPopupModel());
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r4.loading() ? 4 : 5);
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_4_0 = ctx_r4.scheduleEditorOpen() && ctx_r4.selectedRule()) ? 6 : -1, tmp_4_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_5_0 = ctx_r4.parameterDraft()) ? 7 : -1, tmp_5_0);
  }
}
var PROCESS_LIST_FILTER = {
  all: "all",
  active: "active",
  suspended: "suspended",
  running: "running",
  failed: "failed"
};
var PROCESS_STATUS_KIND = {
  running: "running",
  failed: "failed",
  missed: "missed",
  suspended: "suspended",
  ready: "ready"
};
var PROCESS_TOGGLE_KIND = {
  enabled: "enabled",
  suspended: "suspended"
};
var PROCESS_RUNTIME_STATUS = {
  idle: "idle",
  running: "running",
  suspended: "suspended",
  completed: "completed",
  failed: "failed",
  error: "error",
  missed: "missed",
  skipped: "skipped"
};
var PROCESS_TRIGGER_KIND = {
  scheduledProcess: "scheduled_process"
};
var ADMIN_POPUP_KEY = "notifications";
var TIMING_MODE = {
  interval: "interval"
};
var PROCESS_RUN_TRIGGER = {
  manual: "manual"
};
var PROCESS_ROW_ACTION = {
  suspend: "suspend",
  run: "run"
};
var OBSOLETE_NOTIFICATION_RULE_PARAMETER_KEYS = /* @__PURE__ */ new Set([
  "jobs.process.randomGroups.historyPenalty"
]);
var SCHEDULE_FREQUENCY = {
  daily: "daily",
  weekly: "weekly",
  biWeekly: "bi-weekly",
  monthly: "monthly",
  yearly: "yearly",
  oneTime: "one-time"
};
var INTERVAL_UNIT = {
  seconds: "seconds",
  minutes: "minutes",
  hours: "hours",
  days: "days",
  weeks: "weeks",
  months: "months",
  years: "years"
};
var INTERVAL_UNIT_SECONDS = {
  [INTERVAL_UNIT.seconds]: 1,
  [INTERVAL_UNIT.minutes]: 60,
  [INTERVAL_UNIT.hours]: 3600,
  [INTERVAL_UNIT.days]: 86400,
  [INTERVAL_UNIT.weeks]: 604800,
  [INTERVAL_UNIT.months]: 2592e3,
  [INTERVAL_UNIT.years]: 31536e3
};
var INTERVAL_UNIT_OPTIONS = [
  { value: INTERVAL_UNIT.seconds, labelKey: "admin.jobs.interval.seconds" },
  { value: INTERVAL_UNIT.minutes, labelKey: "admin.jobs.interval.minutes" },
  { value: INTERVAL_UNIT.hours, labelKey: "admin.jobs.interval.hours" },
  { value: INTERVAL_UNIT.days, labelKey: "admin.jobs.interval.days" },
  { value: INTERVAL_UNIT.weeks, labelKey: "admin.jobs.interval.weeks" },
  { value: INTERVAL_UNIT.months, labelKey: "admin.jobs.interval.months" },
  { value: INTERVAL_UNIT.years, labelKey: "admin.jobs.interval.years" }
];
var SCHEDULE_INTERVAL_UNIT_ITEMS = INTERVAL_UNIT_OPTIONS.map((option) => {
  const presentationByUnit = {
    [INTERVAL_UNIT.seconds]: { icon: "timer", palette: "orange" },
    [INTERVAL_UNIT.minutes]: { icon: "schedule", palette: "blue" },
    [INTERVAL_UNIT.hours]: { icon: "access_time", palette: "teal" },
    [INTERVAL_UNIT.days]: { icon: "today", palette: "green" },
    [INTERVAL_UNIT.weeks]: { icon: "calendar_view_week", palette: "cyan" },
    [INTERVAL_UNIT.months]: { icon: "calendar_month", palette: "amber" },
    [INTERVAL_UNIT.years]: { icon: "event_available", palette: "gold" }
  };
  return __spreadProps(__spreadValues({
    id: `schedule-interval-unit:${option.value}`,
    value: option.value,
    kind: "radio",
    label: option.labelKey
  }, presentationByUnit[option.value]), {
    surface: "tinted"
  });
});
var SCHEDULE_EDITOR_FLOW_MODEL = {
  title: "admin.jobs.timing",
  layout: "grouped",
  tone: "blue",
  header: false,
  allowMenuOverflow: true,
  summary: { enabled: false },
  completion: { controls: "none" },
  steps: [{
    id: "job-timing",
    title: "admin.jobs.timing.rule",
    chrome: "none",
    controls: [
      {
        id: "start-time",
        bind: "startTime",
        kind: "date",
        layout: "wide",
        label: "admin.jobs.start.at",
        required: true,
        config: {
          model: {
            mode: "time",
            time: {
              enabled: true,
              openOnClick: true
            },
            field: {
              label: "admin.jobs.start.at",
              required: true
            }
          }
        }
      },
      {
        id: "interval-amount",
        bind: "intervalAmount",
        kind: "number",
        layout: "half",
        label: "admin.jobs.interval.every",
        required: true,
        min: 1,
        step: 1
      },
      {
        id: "interval-unit",
        bind: "intervalUnit",
        kind: "menu",
        layout: "half",
        label: "admin.jobs.interval.unit",
        required: true,
        config: {
          kind: "select",
          layout: "row",
          panelMode: "auto",
          closeOnSelect: true,
          trigger: {
            id: "schedule-interval-unit",
            label: "admin.jobs.interval.unit",
            icon: "event_repeat",
            trailingIcon: "expand_more",
            layout: "field"
          },
          items: SCHEDULE_INTERVAL_UNIT_ITEMS
        }
      }
    ]
  }]
};
var JOB_I18N = {
  filter: {
    all: "admin.jobs.filter.all",
    active: "admin.jobs.filter.active",
    suspended: "admin.jobs.filter.suspended",
    running: "admin.jobs.filter.running",
    failed: "admin.jobs.filter.failed"
  },
  status: {
    running: "admin.jobs.status.running",
    failed: "admin.jobs.status.failed",
    missed: "admin.jobs.status.missed",
    suspended: "admin.jobs.status.suspended",
    ready: "admin.jobs.status.ready"
  },
  progress: {
    ready: "admin.jobs.progress.ready",
    suspendedByAdmin: "admin.jobs.progress.suspended.by.admin",
    manualRunStarted: "admin.jobs.progress.manual.run.started"
  },
  interval: {
    title: "admin.jobs.interval",
    description: "admin.jobs.interval.description",
    every: "admin.jobs.interval.every",
    second: "admin.jobs.interval.second",
    seconds: "admin.jobs.interval.seconds",
    minute: "admin.jobs.interval.minute",
    hour: "admin.jobs.interval.hour",
    hours: "admin.jobs.interval.hours",
    day: "admin.jobs.interval.day",
    days: "admin.jobs.interval.days",
    minutes: "admin.jobs.interval.minutes",
    week: "admin.jobs.interval.week",
    weeks: "admin.jobs.interval.weeks",
    month: "admin.jobs.interval.month",
    months: "admin.jobs.interval.months",
    year: "admin.jobs.interval.year",
    years: "admin.jobs.interval.years"
  },
  error: {
    load: "admin.jobs.error.load",
    save: "admin.jobs.error.save",
    run: "admin.jobs.error.run"
  },
  process: {
    titleDefault: "admin.jobs.process",
    descriptionDefault: "admin.jobs.process.description.default"
  },
  action: {
    run: "admin.jobs.run",
    none: "admin.jobs.action.none",
    noneDescription: "admin.jobs.action.none.description"
  },
  lastRun: {
    notRunYet: "admin.jobs.not.run.yet",
    affected: "admin.jobs.affected"
  },
  pending: {
    title: "admin.jobs.pending.impact",
    notCalculated: "admin.jobs.pending.not.calculated"
  },
  runWindow: {
    none: "admin.jobs.run.window.none",
    oneTimeDate: "admin.jobs.run.window.one.time.date",
    at: "admin.jobs.run.window.at",
    onDay: "admin.jobs.run.window.on.day"
  },
  never: "admin.jobs.never"
};
var PROCESS_FILTER_OPTIONS = [
  { key: PROCESS_LIST_FILTER.all, labelKey: JOB_I18N.filter.all, icon: "list" },
  { key: PROCESS_LIST_FILTER.active, labelKey: JOB_I18N.filter.active, icon: "play_circle" },
  { key: PROCESS_LIST_FILTER.suspended, labelKey: JOB_I18N.filter.suspended, icon: "pause_circle" },
  { key: PROCESS_LIST_FILTER.running, labelKey: JOB_I18N.filter.running, icon: "sync" },
  { key: PROCESS_LIST_FILTER.failed, labelKey: JOB_I18N.filter.failed, icon: "error_outline" }
];
var PROCESS_STATUS_LABEL_KEYS = {
  [PROCESS_STATUS_KIND.running]: JOB_I18N.status.running,
  [PROCESS_STATUS_KIND.failed]: JOB_I18N.status.failed,
  [PROCESS_STATUS_KIND.missed]: JOB_I18N.status.missed,
  [PROCESS_STATUS_KIND.suspended]: JOB_I18N.status.suspended,
  [PROCESS_STATUS_KIND.ready]: JOB_I18N.status.ready
};
var PROCESS_STATUS_KIND_BY_RUNTIME_STATUS = {
  [PROCESS_RUNTIME_STATUS.failed]: PROCESS_STATUS_KIND.failed,
  [PROCESS_RUNTIME_STATUS.error]: PROCESS_STATUS_KIND.failed,
  [PROCESS_RUNTIME_STATUS.missed]: PROCESS_STATUS_KIND.missed,
  [PROCESS_RUNTIME_STATUS.skipped]: PROCESS_STATUS_KIND.missed
};
var PROCESS_TOGGLE_STATES = {
  [PROCESS_TOGGLE_KIND.enabled]: {
    currentStatus: PROCESS_RUNTIME_STATUS.idle,
    progressDetailKey: JOB_I18N.progress.ready
  },
  [PROCESS_TOGGLE_KIND.suspended]: {
    currentStatus: PROCESS_RUNTIME_STATUS.suspended,
    progressDetailKey: JOB_I18N.progress.suspendedByAdmin
  }
};
var PROCESS_ICON = {
  running: "sync",
  suspended: "pause_circle",
  manual: "play_circle",
  manageable: "tune",
  default: "settings_suggest",
  filterFallback: "list"
};
var PROCESS_RULE_ICONS = {
  "event-random-groups": "hub",
  "event-auto-inviter": "person_add",
  "event-tournament-review": "emoji_events",
  "event-counter-expiry": "event_available",
  "event-checkout-basket-purge": "shopping_basket",
  "notification-outbox": "notifications_active",
  "affinity-recompute": "sync_alt",
  "affinity-graph-layout": "account_tree",
  "scheduled-messages": "schedule_send",
  "account-purge": "delete_sweep"
};
var PROCESS_NEXT_RUN_SORT_FILTERS = /* @__PURE__ */ new Set([
  PROCESS_LIST_FILTER.active,
  PROCESS_LIST_FILTER.running
]);
var PROCESS_LIST_POLL_INTERVAL_MS = 5e3;
var PROCESS_FAILED_SORT_FILTERS = /* @__PURE__ */ new Set([
  PROCESS_LIST_FILTER.failed
]);
var PROCESS_PROBLEM_RUNTIME_STATUSES = /* @__PURE__ */ new Set([
  PROCESS_RUNTIME_STATUS.failed,
  PROCESS_RUNTIME_STATUS.error,
  PROCESS_RUNTIME_STATUS.missed,
  PROCESS_RUNTIME_STATUS.skipped
]);
var PROCESS_FINISHED_RUNTIME_STATUSES = /* @__PURE__ */ new Set([
  PROCESS_RUNTIME_STATUS.completed,
  PROCESS_RUNTIME_STATUS.failed,
  PROCESS_RUNTIME_STATUS.error,
  PROCESS_RUNTIME_STATUS.missed,
  PROCESS_RUNTIME_STATUS.skipped
]);
var WEEKLY_SCHEDULE_FREQUENCIES = /* @__PURE__ */ new Set([
  SCHEDULE_FREQUENCY.weekly,
  SCHEDULE_FREQUENCY.biWeekly
]);
var ROLLING_DATE_SCHEDULE_FREQUENCIES = /* @__PURE__ */ new Set([
  SCHEDULE_FREQUENCY.monthly,
  SCHEDULE_FREQUENCY.yearly
]);
var DEFAULT_RUN_WINDOW = {
  frequency: SCHEDULE_FREQUENCY.daily,
  dayOfWeek: 1,
  time: "09:00",
  timezone: "UTC",
  actionKey: "",
  enabled: true
};
var DEFAULT_PRIMARY_TIMING = {
  mode: TIMING_MODE.interval,
  intervalMinutes: 1440
};
var STATUS_CLASS_PREFIX = "is-";
var AdminNotificationsPopupComponent = class _AdminNotificationsPopupComponent {
  processSmartList;
  admin = inject(AdminMenuStore);
  notificationsService = inject(AdminNotificationsService);
  i18n = inject(I18nService);
  userProfileStore = inject(UserProfileStore);
  popupKey = ADMIN_POPUP_KEY;
  jobI18n = JOB_I18N;
  processRowAction = PROCESS_ROW_ACTION;
  defaultRunWindow = DEFAULT_RUN_WINDOW;
  loading = signal(false, ...ngDevMode ? [{ debugName: "loading" }] : (
    /* istanbul ignore next */
    []
  ));
  saving = signal(false, ...ngDevMode ? [{ debugName: "saving" }] : (
    /* istanbul ignore next */
    []
  ));
  runningRuleKey = signal("", ...ngDevMode ? [{ debugName: "runningRuleKey" }] : (
    /* istanbul ignore next */
    []
  ));
  rowActionKey = signal("", ...ngDevMode ? [{ debugName: "rowActionKey" }] : (
    /* istanbul ignore next */
    []
  ));
  error = signal("", ...ngDevMode ? [{ debugName: "error" }] : (
    /* istanbul ignore next */
    []
  ));
  state = signal(null, ...ngDevMode ? [{ debugName: "state" }] : (
    /* istanbul ignore next */
    []
  ));
  selectedRuleKey = signal("", ...ngDevMode ? [{ debugName: "selectedRuleKey" }] : (
    /* istanbul ignore next */
    []
  ));
  detailOpen = signal(false, ...ngDevMode ? [{ debugName: "detailOpen" }] : (
    /* istanbul ignore next */
    []
  ));
  detailRule = signal(null, ...ngDevMode ? [{ debugName: "detailRule" }] : (
    /* istanbul ignore next */
    []
  ));
  scheduleEditorOpen = signal(false, ...ngDevMode ? [{ debugName: "scheduleEditorOpen" }] : (
    /* istanbul ignore next */
    []
  ));
  scheduleEditorDraft = signal(null, ...ngDevMode ? [{ debugName: "scheduleEditorDraft" }] : (
    /* istanbul ignore next */
    []
  ));
  parameterDraft = signal(null, ...ngDevMode ? [{ debugName: "parameterDraft" }] : (
    /* istanbul ignore next */
    []
  ));
  timingDirtyKeys = signal(/* @__PURE__ */ new Set(), ...ngDevMode ? [{ debugName: "timingDirtyKeys" }] : (
    /* istanbul ignore next */
    []
  ));
  parameterDirtyKeys = signal(/* @__PURE__ */ new Set(), ...ngDevMode ? [{ debugName: "parameterDirtyKeys" }] : (
    /* istanbul ignore next */
    []
  ));
  processFilter = signal(PROCESS_LIST_FILTER.all, ...ngDevMode ? [{ debugName: "processFilter" }] : (
    /* istanbul ignore next */
    []
  ));
  processListLoadedOnce = false;
  processBaselinesCaptured = false;
  latestProcessCenterState = null;
  unsubscribeRuntimeUpdates = null;
  timingBaselineSignatures = /* @__PURE__ */ new Map();
  parameterBaselineSignatures = /* @__PURE__ */ new Map();
  processListQuery = computed(() => ({
    page: 0,
    pageSize: 100,
    sort: "runtime",
    direction: "asc",
    filters: { filter: this.processFilter() }
  }), ...ngDevMode ? [{ debugName: "processListQuery" }] : (
    /* istanbul ignore next */
    []
  ));
  processListConfig = {
    pageSize: 100,
    initialPageSize: 100,
    initialPageCount: 1,
    defaultView: "list",
    defaultSort: "runtime",
    defaultDirection: "asc",
    defaultFilters: { filter: PROCESS_LIST_FILTER.all },
    emptyLabel: () => this.uiText("admin.jobs.empty.filter"),
    showStickyHeader: false,
    listLayout: "stack",
    snapMode: "none",
    showBackgroundLoadingProgress: false,
    pollIntervalMs: PROCESS_LIST_POLL_INTERVAL_MS,
    cacheable: {
      identity: (rule) => rule.ruleKey,
      equals: (current, next) => this.sameProcessRule(current, next)
    },
    sortable: {
      sortKey: (rule, _index, query) => this.processListSortKey(rule, query.filters?.filter ?? PROCESS_LIST_FILTER.all)
    },
    headerProgress: {
      enabled: true,
      placement: "inline",
      tone: "accent"
    },
    containerClass: {
      "admin-job-process-list": true
    },
    trackBy: (_index, rule) => rule.ruleKey
  };
  processListLoadPage = (query, context) => from(this.loadProcessListPage(query, context?.signal));
  processFilterOptions = PROCESS_FILTER_OPTIONS;
  processStatusLabelKeys = PROCESS_STATUS_LABEL_KEYS;
  scheduleEditorFlowModel = SCHEDULE_EDITOR_FLOW_MODEL;
  constructor() {
    effect(() => {
      if (this.admin.activePopup() !== ADMIN_POPUP_KEY) {
        this.error.set("");
        this.detailOpen.set(false);
        this.detailRule.set(null);
        this.scheduleEditorOpen.set(false);
        this.scheduleEditorDraft.set(null);
        this.timingDirtyKeys.set(/* @__PURE__ */ new Set());
        this.parameterDirtyKeys.set(/* @__PURE__ */ new Set());
        this.processListLoadedOnce = false;
        this.processBaselinesCaptured = false;
        this.latestProcessCenterState = null;
        this.stopRuntimeUpdates();
        return;
      }
      this.startRuntimeUpdates();
    });
  }
  ngOnDestroy() {
    this.stopRuntimeUpdates();
  }
  onProcessListStateChange(change) {
    const centerState = this.latestProcessCenterState;
    if (!centerState || change.initialLoading) {
      return;
    }
    this.reconcileProcessListState(change.items, centerState);
  }
  async loadProcessListPage(query, signal2) {
    try {
      const centerState = await this.notificationsService.loadNotificationCenter(this.activeAdminId(), {
        skipDemoDelay: this.processListLoadedOnce,
        filter: query.filters?.filter ?? PROCESS_LIST_FILTER.all
      });
      if (signal2?.aborted) {
        return { items: [], total: 0, nextCursor: null };
      }
      const normalizedState = this.ensureProcessRules(centerState);
      this.processListLoadedOnce = true;
      this.latestProcessCenterState = normalizedState;
      this.reconcileProcessListMetadata(normalizedState);
      this.error.set("");
      return {
        items: normalizedState.rules,
        total: normalizedState.rules.length,
        nextCursor: null
      };
    } catch (error) {
      if (!signal2?.aborted) {
        this.error.set(JOB_I18N.error.load);
      }
      throw error;
    }
  }
  async save(rulesToSave = this.processRules()) {
    const state = this.state();
    if (!state || this.saving()) {
      return false;
    }
    this.saving.set(true);
    this.error.set("");
    try {
      const savedState = await this.notificationsService.saveNotificationCenter(rulesToSave, this.activeAdminId(), {
        filter: this.processFilter()
      });
      const normalizedState = this.ensureProcessRules(savedState);
      this.applyProcessCenterState(normalizedState);
      this.captureTimingBaselines(normalizedState.rules);
      this.captureParameterBaselines(normalizedState.rules);
      this.timingDirtyKeys.set(/* @__PURE__ */ new Set());
      this.parameterDirtyKeys.set(/* @__PURE__ */ new Set());
      return true;
    } catch {
      this.error.set(JOB_I18N.error.save);
      return false;
    } finally {
      this.saving.set(false);
    }
  }
  async saveAndCloseDetail() {
    const rule = this.selectedRule();
    if (rule && !this.canManageProcess(rule)) {
      this.closeDetail();
      return;
    }
    const saved = await this.save();
    if (saved) {
      this.closeDetail();
    }
  }
  async toggleSuspended(rule) {
    if (!this.canManageProcess(rule) || this.rowActionKey()) {
      return;
    }
    this.rowActionKey.set(`${rule.ruleKey}:suspend`);
    try {
      const nextEnabled = !rule.enabled;
      const nextToggleState = PROCESS_TOGGLE_STATES[nextEnabled ? PROCESS_TOGGLE_KIND.enabled : PROCESS_TOGGLE_KIND.suspended];
      const rulesToSave = this.processRules().map((current) => current.ruleKey === rule.ruleKey ? __spreadProps(__spreadValues({}, current), {
        enabled: nextEnabled,
        runState: __spreadProps(__spreadValues({}, current.runState), {
          currentStatus: nextToggleState.currentStatus,
          progressDetail: nextToggleState.progressDetailKey
        }),
        updatedDate: (/* @__PURE__ */ new Date()).toISOString(),
        updatedUser: this.activeAdminId(current.updatedUser)
      }) : current);
      const saved = await this.save(rulesToSave);
      if (saved) {
        this.patchRule(rule.ruleKey, (current) => __spreadProps(__spreadValues({}, current), {
          enabled: nextEnabled,
          runState: __spreadProps(__spreadValues({}, current.runState), {
            currentStatus: nextToggleState.currentStatus,
            progressPercent: 0,
            progressDetail: nextToggleState.progressDetailKey,
            finishedAtIso: nextEnabled ? current.runState.finishedAtIso : "",
            durationMillis: nextEnabled ? current.runState.durationMillis : 0
          })
        }));
      }
    } finally {
      this.rowActionKey.set("");
    }
  }
  async run(rule) {
    if (!rule.manualRunEnabled || this.runningRuleKey() || this.rowActionKey()) {
      return;
    }
    this.runningRuleKey.set(rule.ruleKey);
    this.rowActionKey.set(`${rule.ruleKey}:run`);
    this.error.set("");
    const requestStartedAtIso = (/* @__PURE__ */ new Date()).toISOString();
    this.patchRule(rule.ruleKey, (current) => __spreadProps(__spreadValues({}, current), {
      runState: __spreadProps(__spreadValues({}, current.runState), {
        currentStatus: PROCESS_RUNTIME_STATUS.running,
        progressPercent: 0,
        progressDetail: JOB_I18N.progress.manualRunStarted,
        startedAtIso: requestStartedAtIso,
        finishedAtIso: "",
        durationMillis: 0
      })
    }));
    try {
      const result = await this.notificationsService.runNotificationRule(rule.ruleKey, this.activeAdminId());
      const finishedAtIso = result.ranAtIso || (/* @__PURE__ */ new Date()).toISOString();
      this.patchRule(rule.ruleKey, (current) => {
        const isRunningResponse = this.isRuntimeStatus(result.status, PROCESS_RUNTIME_STATUS.running);
        const startedAtIso = isRunningResponse ? current.runState.startedAtIso || result.ranAtIso || requestStartedAtIso : current.runState.startedAtIso || finishedAtIso;
        const durationMillis = this.durationBetween(startedAtIso, finishedAtIso);
        if (isRunningResponse && this.hasNewerFinishedRun(current, requestStartedAtIso)) {
          return current;
        }
        const runningProgressPercent = Math.max(0, Math.min(99, current.runState.progressPercent || 0));
        const entry = isRunningResponse ? null : {
          id: `run-${Date.now()}`,
          trigger: PROCESS_RUN_TRIGGER.manual,
          runnerUser: this.activeAdminId(current.runState.lastRunUser),
          startedAtIso,
          finishedAtIso,
          durationMillis,
          processedCount: result.affectedCount,
          status: result.status,
          detail: result.detail
        };
        return __spreadProps(__spreadValues({}, current), {
          runState: __spreadProps(__spreadValues({}, current.runState), {
            currentStatus: result.status,
            progressPercent: isRunningResponse ? runningProgressPercent : 100,
            progressDetail: isRunningResponse ? current.runState.progressDetail || result.detail : result.detail,
            startedAtIso,
            finishedAtIso: isRunningResponse ? current.runState.finishedAtIso || "" : finishedAtIso,
            durationMillis: isRunningResponse ? Math.max(0, current.runState.durationMillis || 0) : durationMillis,
            lastRunAtIso: isRunningResponse ? current.runState.lastRunAtIso : finishedAtIso,
            lastRunStatus: isRunningResponse ? current.runState.lastRunStatus : result.status,
            lastRunDetail: isRunningResponse ? current.runState.lastRunDetail : result.detail,
            lastRunCount: isRunningResponse ? current.runState.lastRunCount : result.affectedCount,
            lastRunUser: this.activeAdminId(current.runState.lastRunUser)
          }),
          runHistory: entry ? [entry, ...current.runHistory ?? []].slice(0, 12) : current.runHistory,
          updatedDate: finishedAtIso,
          updatedUser: this.activeAdminId(current.updatedUser)
        });
      });
    } catch {
      this.error.set(JOB_I18N.error.run);
    } finally {
      this.runningRuleKey.set("");
      this.rowActionKey.set("");
    }
  }
  close() {
    this.admin.closePopup();
  }
  notificationsPopupModel() {
    return {
      title: this.uiText("jobs"),
      subtitle: `${this.processRules().length} ${this.uiText("admin.jobs.background.processes")}`,
      ariaLabel: this.uiText("jobs"),
      closeAriaLabel: this.uiText("close"),
      size: "wide",
      height: "full",
      headerTone: "accent",
      bodyLayout: "fill",
      headerControls: this.loading() || this.detailOpen() ? [] : [
        {
          kind: "menu",
          id: "process-filter",
          menuKind: "inline",
          model: this.processFilterMenuModel(),
          panelAlign: "end"
        }
      ],
      onClose: () => this.close(),
      onMenuSelect: (event) => this.onNotificationsPopupMenuSelect(event)
    };
  }
  processDetailPopupModel(rule) {
    const dirty = this.isTimingDirty(rule) || this.isParameterDirty(rule);
    return {
      title: this.processTitle(rule),
      subtitle: this.processDetailSubtitle(rule),
      ariaLabel: this.uiText(this.processTitle(rule)),
      closeAriaLabel: this.uiText("admin.jobs.close.detail"),
      size: "wide",
      height: "full",
      headerTone: "accent",
      bodyLayout: "fill",
      backdropTone: "dim",
      showClose: false,
      headerActions: [
        {
          id: "process-detail-save",
          icon: "check",
          ariaLabel: this.uiText("admin.jobs.save.process"),
          palette: dirty ? "danger" : "success",
          active: dirty,
          disabled: this.loading() || this.saving() || !this.state() || !this.canManageProcess(rule)
        },
        {
          id: "process-detail-close",
          icon: "close",
          ariaLabel: this.uiText("admin.jobs.close.detail"),
          palette: "neutral"
        }
      ],
      onClose: () => this.closeDetail(),
      onAction: (event) => void this.onProcessDetailPopupAction(event)
    };
  }
  scheduleEditorPopupModel(rule) {
    return {
      title: "admin.jobs.timing",
      subtitle: "admin.jobs.timing.description",
      secondarySubtitle: this.intervalCron(rule),
      ariaLabel: this.uiText("admin.jobs.timing"),
      closeAriaLabel: this.uiText("admin.jobs.close.run.window.editor"),
      size: "default",
      height: "auto",
      headerTone: "accent",
      bodyLayout: "overflow",
      backdropTone: "dim",
      showClose: false,
      headerActions: [
        {
          id: "schedule-save",
          icon: "check",
          ariaLabel: this.uiText("done"),
          palette: "success",
          disabled: this.saving()
        },
        {
          id: "schedule-close",
          icon: "close",
          ariaLabel: this.uiText("admin.jobs.close.run.window.editor"),
          palette: "neutral",
          disabled: this.saving()
        }
      ],
      onClose: () => this.closeScheduleEditor(),
      onAction: (event) => void this.onScheduleEditorPopupAction(event)
    };
  }
  parameterEditorPopupModel() {
    return {
      title: "admin.jobs.parameters",
      subtitle: "admin.jobs.parameters.description",
      ariaLabel: this.uiText("admin.jobs.parameters"),
      closeAriaLabel: this.uiText("cancel"),
      size: "default",
      height: "auto",
      headerTone: "accent",
      backdropTone: "dim",
      showClose: false,
      headerActions: [
        {
          id: "parameter-save",
          icon: "check",
          ariaLabel: this.uiText("done"),
          palette: "success",
          disabled: this.saving()
        },
        {
          id: "parameter-close",
          icon: "close",
          ariaLabel: this.uiText("cancel"),
          palette: "neutral",
          disabled: this.saving()
        }
      ],
      onClose: () => this.closeParameterEditor(),
      onAction: (event) => void this.onParameterEditorPopupAction(event)
    };
  }
  openDetail(rule) {
    this.selectedRuleKey.set(rule.ruleKey);
    this.detailRule.set(rule);
    this.detailOpen.set(true);
  }
  closeDetail() {
    this.detailOpen.set(false);
    this.detailRule.set(null);
    this.scheduleEditorOpen.set(false);
    this.scheduleEditorDraft.set(null);
    this.parameterDraft.set(null);
  }
  selectRule(ruleKey) {
    this.selectedRuleKey.set(ruleKey);
    this.scheduleEditorOpen.set(false);
    this.scheduleEditorDraft.set(null);
    this.parameterDraft.set(null);
  }
  selectedRule() {
    const detailRule = this.detailRule();
    if (this.detailOpen() && detailRule?.ruleKey === this.selectedRuleKey()) {
      return detailRule;
    }
    return this.processRules().find((rule) => rule.ruleKey === this.selectedRuleKey()) ?? this.processRules()[0] ?? null;
  }
  processRules() {
    const rules = this.state()?.rules ?? [];
    return this.sortProcessRules(rules.filter((rule) => this.isScheduledProcess(rule)));
  }
  processFilterLabel(filter = this.processFilter()) {
    return this.processFilterOptions.find((option) => option.key === filter)?.labelKey ?? JOB_I18N.filter.all;
  }
  processFilterIcon(filter = this.processFilter()) {
    return this.processFilterOptions.find((option) => option.key === filter)?.icon ?? PROCESS_ICON.filterFallback;
  }
  processFilterCount(filter = this.processFilter()) {
    const count = Number(this.state()?.filterCounts?.[filter]);
    if (Number.isFinite(count)) {
      return Math.max(0, Math.trunc(count));
    }
    return filter === this.processFilter() || filter === PROCESS_LIST_FILTER.all ? this.processRules().length : 0;
  }
  processFilterMenuModel() {
    return {
      nodes: [
        {
          id: "process-filter-root",
          items: [
            {
              id: "process-filter-menu",
              kind: "select-trigger",
              label: this.processFilterLabel(),
              icon: this.processFilterIcon(),
              counter: this.processFilterCount(),
              ariaLabel: "admin.jobs.filter.aria",
              items: this.processFilterOptions.map((option) => ({
                id: `process-filter:${option.key}`,
                kind: "radio",
                label: option.labelKey,
                icon: option.icon,
                checked: this.processFilter() === option.key,
                counter: this.processFilterCount(option.key),
                context: { filter: option.key }
              }))
            }
          ]
        }
      ]
    };
  }
  onProcessFilterMenuSelect(event) {
    const nextFilter = event.context?.filter;
    if (!nextFilter) {
      return;
    }
    this.selectProcessFilter(nextFilter, event.sourceEvent);
  }
  onNotificationsPopupMenuSelect(event) {
    this.onProcessFilterMenuSelect(event.itemSelect);
  }
  async onProcessDetailPopupAction(event) {
    event.sourceEvent.preventDefault();
    event.sourceEvent.stopPropagation();
    if (event.action.id === "process-detail-save") {
      await this.saveAndCloseDetail();
      return;
    }
    if (event.action.id === "process-detail-close") {
      this.closeDetail();
    }
  }
  async onScheduleEditorPopupAction(event) {
    event.sourceEvent.preventDefault();
    event.sourceEvent.stopPropagation();
    if (event.action.id === "schedule-save") {
      await this.saveScheduleEditor();
      return;
    }
    if (event.action.id === "schedule-close") {
      this.closeScheduleEditor();
    }
  }
  async onParameterEditorPopupAction(event) {
    event.sourceEvent.preventDefault();
    event.sourceEvent.stopPropagation();
    if (event.action.id === "parameter-save") {
      await this.saveParameterEditor();
      return;
    }
    if (event.action.id === "parameter-close") {
      this.closeParameterEditor();
    }
  }
  processDetailSubtitle(rule) {
    return `${this.uiText("admin.jobs.scheduled.process")} \xB7 ${this.uiText(this.processStatusLabelKeys[this.statusKind(rule)])} \xB7 ${this.uiText("admin.jobs.last.changed")} ${this.uiText(this.shortDate(rule.updatedDate || ""))}`;
  }
  uiText(value, fallback = "") {
    return this.i18n.translate(value, fallback);
  }
  selectProcessFilter(filter, event) {
    event?.preventDefault();
    event?.stopPropagation();
    if (filter === this.processFilter()) {
      return;
    }
    this.processFilter.set(filter);
    this.latestProcessCenterState = null;
  }
  processIcon(rule) {
    if (this.isProcessRunning(rule)) {
      return PROCESS_ICON.running;
    }
    if (!rule.enabled || this.isRuntimeStatus(rule.runState.currentStatus, PROCESS_RUNTIME_STATUS.suspended)) {
      return PROCESS_ICON.suspended;
    }
    return PROCESS_RULE_ICONS[rule.ruleKey] ?? (rule.manualRunEnabled ? PROCESS_ICON.manual : PROCESS_ICON.default);
  }
  processTitle(rule) {
    return rule.label || rule.ruleKey || JOB_I18N.process.titleDefault;
  }
  processDescription(rule) {
    return rule.description || JOB_I18N.process.descriptionDefault;
  }
  canManageProcess(rule) {
    return rule.adminManageable === true;
  }
  isTimingDirty(rule) {
    return this.timingDirtyKeys().has(rule.ruleKey);
  }
  isParameterDirty(rule) {
    return this.parameterDirtyKeys().has(rule.ruleKey);
  }
  refreshTimingDirty(rule) {
    const baseline = this.timingBaselineSignatures.get(rule.ruleKey);
    const current = this.timingSignature(rule);
    const next = new Set(this.timingDirtyKeys());
    if (baseline && baseline !== current) {
      next.add(rule.ruleKey);
    } else {
      next.delete(rule.ruleKey);
    }
    this.timingDirtyKeys.set(next);
  }
  refreshParameterDirty(ruleKey, signature) {
    const baseline = this.parameterBaselineSignatures.get(ruleKey);
    const next = new Set(this.parameterDirtyKeys());
    if (baseline && baseline !== signature) {
      next.add(ruleKey);
    } else {
      next.delete(ruleKey);
    }
    this.parameterDirtyKeys.set(next);
  }
  hasJobParameters(rule) {
    return (rule.parameters ?? []).some((field) => `${field.key ?? ""}`.trim());
  }
  statusKind(rule) {
    const lastStatus = `${rule.runState.lastRunStatus || rule.runState.currentStatus || ""}`.trim().toLowerCase();
    if (this.isProcessRunning(rule)) {
      return PROCESS_STATUS_KIND.running;
    }
    const mappedStatus = PROCESS_STATUS_KIND_BY_RUNTIME_STATUS[lastStatus];
    if (mappedStatus) {
      return mappedStatus;
    }
    if (!rule.enabled || this.isRuntimeStatus(rule.runState.currentStatus, PROCESS_RUNTIME_STATUS.suspended)) {
      return PROCESS_STATUS_KIND.suspended;
    }
    return PROCESS_STATUS_KIND.ready;
  }
  rowStatusLabel(rule) {
    if (this.isProcessRunning(rule)) {
      return JOB_I18N.status.running;
    }
    if (!rule.enabled || this.isRuntimeStatus(rule.runState.currentStatus, PROCESS_RUNTIME_STATUS.suspended)) {
      return JOB_I18N.status.suspended;
    }
    const lastStatus = `${rule.runState.lastRunStatus || ""}`.trim().toLowerCase();
    if (!lastStatus) {
      return JOB_I18N.lastRun.notRunYet;
    }
    return PROCESS_STATUS_LABEL_KEYS[PROCESS_STATUS_KIND_BY_RUNTIME_STATUS[lastStatus] ?? PROCESS_STATUS_KIND.ready];
  }
  statusClass(rule) {
    return `${STATUS_CLASS_PREFIX}${this.statusKind(rule)}`;
  }
  isRowActionPending(rule, action) {
    return this.rowActionKey() === `${rule.ruleKey}:${action}`;
  }
  isProcessRunning(rule) {
    const currentStatus = `${rule.runState.currentStatus || ""}`.trim().toLowerCase();
    const localRunPending = this.runningRuleKey() === rule.ruleKey && !this.hasFinishedCurrentRun(rule);
    return localRunPending || currentStatus === PROCESS_RUNTIME_STATUS.running && !this.hasFinishedCurrentRun(rule);
  }
  progressValue(rule) {
    if (this.isProcessRunning(rule)) {
      return Math.max(0, Math.min(99, rule.runState.progressPercent || 0));
    }
    return Math.max(0, Math.min(100, rule.runState.progressPercent || 0));
  }
  runWindows(rule) {
    return rule.scheduleSlots ?? [];
  }
  hasEditableRunWindows(rule) {
    return this.canManageProcess(rule) && this.runWindows(rule).length > 0;
  }
  hasEditableTiming(rule) {
    return this.canManageProcess(rule);
  }
  intervalMinutes(rule) {
    return Math.max(1, Math.ceil(this.intervalSeconds(rule) / 60));
  }
  intervalSeconds(rule) {
    const amount = this.intervalAmount(rule);
    const unit = this.intervalUnit(rule);
    const unitSeconds = INTERVAL_UNIT_SECONDS[unit] || INTERVAL_UNIT_SECONDS.minutes;
    return Math.max(1, amount * unitSeconds);
  }
  startTime(rule) {
    return this.normalizeTime(this.runWindows(rule)[0]?.time || rule.timing?.time || DEFAULT_RUN_WINDOW.time);
  }
  intervalAmount(rule) {
    const explicitAmount = Math.trunc(Number(rule.timing?.intervalAmount) || 0);
    if (explicitAmount > 0 && this.isIntervalUnit(rule.timing?.intervalUnit)) {
      return explicitAmount;
    }
    const slotAmount = this.runWindowIntervalAmount(rule);
    if (slotAmount > 0) {
      return slotAmount;
    }
    const explicitSeconds = Math.trunc(Number(rule.timing?.intervalSeconds) || 0);
    if (explicitSeconds > 0) {
      const unit2 = this.fixedIntervalUnitForSeconds(explicitSeconds);
      return Math.max(1, Math.trunc(explicitSeconds / INTERVAL_UNIT_SECONDS[unit2]));
    }
    const minutes = Math.max(1, Math.trunc(Number(rule.timing?.intervalMinutes) || 1));
    const unit = this.fixedIntervalUnitForSeconds(minutes * INTERVAL_UNIT_SECONDS.minutes);
    return Math.max(1, Math.trunc(minutes * INTERVAL_UNIT_SECONDS.minutes / INTERVAL_UNIT_SECONDS[unit]));
  }
  intervalUnit(rule) {
    if (this.isIntervalUnit(rule.timing?.intervalUnit)) {
      return rule.timing.intervalUnit;
    }
    const slotUnit = this.runWindowIntervalUnit(rule);
    if (slotUnit) {
      return slotUnit;
    }
    const explicitSeconds = Math.trunc(Number(rule.timing?.intervalSeconds) || 0);
    if (explicitSeconds > 0) {
      return this.fixedIntervalUnitForSeconds(explicitSeconds);
    }
    return this.fixedIntervalUnitForSeconds(Math.max(1, Math.trunc(Number(rule.timing?.intervalMinutes) || 1)) * INTERVAL_UNIT_SECONDS.minutes);
  }
  intervalParts(rule) {
    const value = this.intervalAmount(rule);
    return [{ value, unitKey: this.intervalUnitLabelKey(this.intervalUnit(rule), value) }];
  }
  intervalCron(rule) {
    return this.intervalExpression(rule);
  }
  isIntervalUnit(value) {
    return Object.values(INTERVAL_UNIT).includes(value);
  }
  runWindowIntervalAmount(rule) {
    const first = this.runWindows(rule)[0];
    if (!first) {
      return 0;
    }
    if (first.frequency === SCHEDULE_FREQUENCY.biWeekly) {
      return 2;
    }
    return 1;
  }
  runWindowIntervalUnit(rule) {
    const first = this.runWindows(rule)[0];
    if (!first) {
      return null;
    }
    if (first.frequency === SCHEDULE_FREQUENCY.weekly || first.frequency === SCHEDULE_FREQUENCY.biWeekly) {
      return INTERVAL_UNIT.weeks;
    }
    if (first.frequency === SCHEDULE_FREQUENCY.monthly) {
      return INTERVAL_UNIT.months;
    }
    if (first.frequency === SCHEDULE_FREQUENCY.yearly) {
      return INTERVAL_UNIT.years;
    }
    return INTERVAL_UNIT.days;
  }
  fixedIntervalUnitForSeconds(seconds) {
    const value = Math.max(1, Math.trunc(Number(seconds) || 1));
    if (value % INTERVAL_UNIT_SECONDS.years === 0) {
      return INTERVAL_UNIT.years;
    }
    if (value % INTERVAL_UNIT_SECONDS.months === 0) {
      return INTERVAL_UNIT.months;
    }
    if (value % INTERVAL_UNIT_SECONDS.weeks === 0) {
      return INTERVAL_UNIT.weeks;
    }
    if (value % INTERVAL_UNIT_SECONDS.days === 0) {
      return INTERVAL_UNIT.days;
    }
    if (value % INTERVAL_UNIT_SECONDS.hours === 0) {
      return INTERVAL_UNIT.hours;
    }
    if (value % INTERVAL_UNIT_SECONDS.minutes === 0) {
      return INTERVAL_UNIT.minutes;
    }
    return INTERVAL_UNIT.seconds;
  }
  intervalUnitLabelKey(unit, amount) {
    const plural = Math.max(1, Math.trunc(Number(amount) || 1)) !== 1;
    switch (unit) {
      case INTERVAL_UNIT.seconds:
        return plural ? JOB_I18N.interval.seconds : JOB_I18N.interval.second;
      case INTERVAL_UNIT.minutes:
        return plural ? JOB_I18N.interval.minutes : JOB_I18N.interval.minute;
      case INTERVAL_UNIT.hours:
        return plural ? JOB_I18N.interval.hours : JOB_I18N.interval.hour;
      case INTERVAL_UNIT.days:
        return plural ? JOB_I18N.interval.days : JOB_I18N.interval.day;
      case INTERVAL_UNIT.weeks:
        return plural ? JOB_I18N.interval.weeks : JOB_I18N.interval.week;
      case INTERVAL_UNIT.months:
        return plural ? JOB_I18N.interval.months : JOB_I18N.interval.month;
      case INTERVAL_UNIT.years:
        return plural ? JOB_I18N.interval.years : JOB_I18N.interval.year;
      default:
        return JOB_I18N.interval.minutes;
    }
  }
  openScheduleEditor() {
    const rule = this.selectedRule();
    if (!rule || !this.hasEditableTiming(rule)) {
      return;
    }
    this.parameterDraft.set(null);
    this.scheduleEditorDraft.set({
      startTime: this.startTime(rule),
      intervalAmount: this.intervalAmount(rule),
      intervalUnit: this.intervalUnit(rule)
    });
    this.scheduleEditorOpen.set(true);
  }
  closeScheduleEditor() {
    this.scheduleEditorOpen.set(false);
    this.scheduleEditorDraft.set(null);
  }
  openParameterEditor(rule) {
    if (!this.canManageProcess(rule) || !this.hasJobParameters(rule) || this.saving()) {
      return;
    }
    this.selectedRuleKey.set(rule.ruleKey);
    this.scheduleEditorOpen.set(false);
    this.scheduleEditorDraft.set(null);
    this.parameterDraft.set({
      ruleKey: rule.ruleKey,
      fields: (rule.parameters ?? []).map((field) => __spreadProps(__spreadValues({}, field), { options: [...field.options ?? []] }))
    });
  }
  closeParameterEditor() {
    if (this.saving()) {
      return;
    }
    this.parameterDraft.set(null);
  }
  async saveParameterEditor() {
    const draft = this.parameterDraft();
    if (!draft || this.saving()) {
      return;
    }
    const nextFields = draft.fields.map((field) => __spreadProps(__spreadValues({}, field), { options: [...field.options ?? []] }));
    const nextSignature = this.parameterSignatureFromFields(nextFields);
    const currentRule = this.processRules().find((rule) => rule.ruleKey === draft.ruleKey);
    if (!currentRule || nextSignature !== this.parameterSignature(currentRule)) {
      this.patchRule(draft.ruleKey, (rule) => __spreadProps(__spreadValues({}, rule), {
        parameters: nextFields,
        updatedDate: (/* @__PURE__ */ new Date()).toISOString(),
        updatedUser: this.activeAdminId(rule.updatedUser)
      }));
    }
    this.refreshParameterDirty(draft.ruleKey, nextSignature);
    const saved = await this.save();
    if (saved) {
      this.parameterDraft.set(null);
    }
  }
  async saveScheduleEditor() {
    const rule = this.selectedRule();
    if (!rule) {
      return;
    }
    this.syncPrimaryTiming(rule);
    this.refreshTimingDirty(rule);
    const saved = await this.save();
    if (saved) {
      this.closeScheduleEditor();
    }
  }
  updateScheduleEditorDraft(rule, value) {
    const input = value && typeof value === "object" ? value : {};
    const next = {
      startTime: this.normalizeTime(`${input.startTime ?? this.startTime(rule)}`),
      intervalAmount: Math.max(1, Math.trunc(Number(input.intervalAmount) || 1)),
      intervalUnit: this.isIntervalUnit(input.intervalUnit) ? input.intervalUnit : this.intervalUnit(rule)
    };
    this.scheduleEditorDraft.set(next);
    rule.timing.time = next.startTime;
    this.updateIntervalRule(rule, next.intervalAmount, next.intervalUnit);
  }
  updateIntervalRule(rule, amount, unit) {
    const intervalAmount = Math.max(1, Math.trunc(Number(amount) || 1));
    const intervalUnit = this.isIntervalUnit(unit) ? unit : INTERVAL_UNIT.minutes;
    const intervalSeconds = intervalAmount * INTERVAL_UNIT_SECONDS[intervalUnit];
    const minutes = Math.max(1, Math.ceil(intervalSeconds / 60));
    rule.timing.mode = DEFAULT_PRIMARY_TIMING.mode;
    rule.timing.intervalMinutes = minutes;
    rule.timing.intervalSeconds = intervalSeconds;
    rule.timing.intervalAmount = intervalAmount;
    rule.timing.intervalUnit = intervalUnit;
    rule.timing.time = this.normalizeTime(rule.timing.time);
    rule.timing.timezone = rule.timing.timezone || DEFAULT_RUN_WINDOW.timezone;
    rule.timing.cronExpression = this.intervalExpression(rule);
    rule.scheduleSlots = [];
    this.refreshTimingDirty(rule);
  }
  activeRunWindows(rule) {
    return this.runWindows(rule).filter((slot) => slot.enabled !== false);
  }
  cronForSlot(slot) {
    const [hour, minute] = this.normalizeTime(slot.time).split(":").map((value) => Math.max(0, Math.trunc(Number(value) || 0)));
    if (slot.frequency === SCHEDULE_FREQUENCY.weekly) {
      const quartzDay = Math.max(1, Math.min(7, Math.trunc(Number(slot.dayOfWeek) || 1))) % 7 + 1;
      return `0 ${minute} ${hour} ? * ${quartzDay}`;
    }
    if (slot.frequency === SCHEDULE_FREQUENCY.biWeekly) {
      const quartzDay = Math.max(1, Math.min(7, Math.trunc(Number(slot.dayOfWeek) || 1))) % 7 + 1;
      return `0 ${minute} ${hour} ? * ${quartzDay}`;
    }
    if (slot.frequency === SCHEDULE_FREQUENCY.monthly) {
      return `0 ${minute} ${hour} ${this.dayOfMonth(slot.date)} * ?`;
    }
    if (slot.frequency === SCHEDULE_FREQUENCY.yearly) {
      const parsed = this.monthDayParts(slot.date);
      return `0 ${minute} ${hour} ${parsed.day} ${parsed.month} ?`;
    }
    if (slot.frequency === SCHEDULE_FREQUENCY.oneTime && /^\d{4}-\d{2}-\d{2}$/.test(slot.date || "")) {
      const [, month, day] = slot.date.split("-").map((value) => Math.max(1, Math.trunc(Number(value) || 1)));
      return `0 ${minute} ${hour} ${day} ${month} ?`;
    }
    return `0 ${minute} ${hour} * * ?`;
  }
  intervalExpression(rule) {
    const amount = this.intervalAmount(rule);
    const unit = this.intervalUnit(rule);
    const [hour, minute] = this.startTime(rule).split(":").map((value) => Math.max(0, Math.trunc(Number(value) || 0)));
    if (unit === INTERVAL_UNIT.seconds) {
      return `0/${amount} * * * * ?`;
    }
    if (unit === INTERVAL_UNIT.minutes) {
      return `0 0/${amount} * * * ?`;
    }
    if (unit === INTERVAL_UNIT.hours) {
      return `0 ${minute} 0/${amount} * * ?`;
    }
    if (unit === INTERVAL_UNIT.days) {
      return `0 ${minute} ${hour} 1/${amount} * ?`;
    }
    return `@every ${amount} ${unit} @ ${this.startTime(rule)}`;
  }
  history(rule) {
    return [...rule.runHistory ?? []].sort((left, right) => Date.parse(right.finishedAtIso || right.startedAtIso) - Date.parse(left.finishedAtIso || left.startedAtIso));
  }
  shortDate(value) {
    const parsed = Date.parse(value || "");
    if (!Number.isFinite(parsed)) {
      return value || JOB_I18N.never;
    }
    return new Date(parsed).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  }
  durationLabel(ms) {
    const value = Math.max(0, Math.trunc(Number(ms) || 0));
    if (value < 1e3) {
      return `${value}ms`;
    }
    return `${(value / 1e3).toFixed(value < 1e4 ? 1 : 0)}s`;
  }
  actionLabel(actionKey) {
    const normalized = `${actionKey || ""}`.trim();
    return normalized || JOB_I18N.action.none;
  }
  actionDescription(actionKey) {
    const normalized = `${actionKey || ""}`.trim();
    return normalized ? `${normalized}.description` : JOB_I18N.action.noneDescription;
  }
  parameterFieldsByGroup(fields) {
    const groups = /* @__PURE__ */ new Map();
    const groupKeys = /* @__PURE__ */ new Map();
    for (const field of fields) {
      const group = `${field.group ?? ""}`.trim() || "General";
      if (!groupKeys.has(group)) {
        groupKeys.set(group, `${field.groupKey ?? ""}`.trim());
      }
      groups.set(group, [...groups.get(group) ?? [], field]);
    }
    return [...groups.entries()].map(([group, groupFields]) => ({
      group,
      groupKey: groupKeys.get(group) ?? "",
      fields: groupFields
    }));
  }
  parameterValueLabel(field) {
    if (field.valueType === "text") {
      const value2 = `${field.textValue ?? ""}`.trim();
      return (field.options ?? []).find((option) => option.value === value2)?.label ?? value2;
    }
    const value = Number(field.numberValue);
    const formatted = Number.isInteger(value) ? `${value}` : value.toFixed(2).replace(/\.?0+$/, "");
    return [formatted, `${field.unit ?? ""}`.trim()].filter(Boolean).join(" ");
  }
  parameterOptions(field) {
    return field.options ?? [];
  }
  updateParameterNumber(field, value) {
    field.numberValue = Number.isFinite(Number(value)) ? Number(value) : 0;
  }
  updateParameterText(field, value) {
    field.textValue = `${value ?? ""}`.trim();
  }
  startRuntimeUpdates() {
    if (this.unsubscribeRuntimeUpdates) {
      return;
    }
    this.unsubscribeRuntimeUpdates = this.notificationsService.subscribeNotificationRuleUpdates(this.activeAdminId(), (event) => this.applyRuntimeEvent(event));
  }
  stopRuntimeUpdates() {
    if (!this.unsubscribeRuntimeUpdates) {
      return;
    }
    this.unsubscribeRuntimeUpdates();
    this.unsubscribeRuntimeUpdates = null;
  }
  applyRuntimeEvent(event) {
    const ruleKey = `${event.ruleKey ?? ""}`.trim();
    if (!ruleKey) {
      return;
    }
    this.patchRule(ruleKey, (current) => this.mergeRuleRuntime(current, event));
  }
  ensureProcessRules(state) {
    const existing = state.rules ?? [];
    const processRules = this.processRulesFrom(existing);
    return __spreadProps(__spreadValues({}, state), {
      rules: processRules,
      updatedDate: state.updatedDate || (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  captureTimingBaselines(rules) {
    this.timingBaselineSignatures.clear();
    for (const rule of rules) {
      this.timingBaselineSignatures.set(rule.ruleKey, this.timingSignature(rule));
    }
  }
  timingSignature(rule) {
    return [
      this.startTime(rule),
      this.intervalAmount(rule),
      this.intervalUnit(rule)
    ].join("|");
  }
  captureParameterBaselines(rules) {
    this.parameterBaselineSignatures.clear();
    for (const rule of rules) {
      this.parameterBaselineSignatures.set(rule.ruleKey, this.parameterSignature(rule));
    }
  }
  parameterSignature(rule) {
    return this.parameterSignatureFromFields(rule.parameters ?? []);
  }
  parameterSignatureFromFields(fields) {
    return fields.filter((field) => `${field.key ?? ""}`.trim()).filter((field) => !OBSOLETE_NOTIFICATION_RULE_PARAMETER_KEYS.has(`${field.key ?? ""}`.trim())).map((field) => {
      const key = `${field.key ?? ""}`.trim();
      const valueType = field.valueType === "text" ? "text" : "number";
      const value = valueType === "text" ? `${field.textValue ?? ""}`.trim() : `${Number.isFinite(Number(field.numberValue)) ? Number(field.numberValue) : 0}`;
      return `${key}:${valueType}:${value}`;
    }).sort().join("|");
  }
  processRulesFrom(rules) {
    return this.sortProcessRules(rules.filter((rule) => this.isScheduledProcess(rule)));
  }
  sortProcessRules(rules) {
    return rules.sort((left, right) => (left.priority || 1e3) - (right.priority || 1e3) || left.label.localeCompare(right.label) || left.ruleKey.localeCompare(right.ruleKey));
  }
  processListSortKey(rule, filter) {
    const stableKey = [
      rule.priority || 1e3,
      rule.label,
      rule.ruleKey
    ];
    if (PROCESS_NEXT_RUN_SORT_FILTERS.has(filter)) {
      return [this.nextRunSortValue(rule), ...stableKey];
    }
    if (PROCESS_FAILED_SORT_FILTERS.has(filter)) {
      return [-this.lastFailedSortValue(rule), ...stableKey];
    }
    return [-this.lastUpdatedSortValue(rule), ...stableKey];
  }
  sameProcessRule(current, next) {
    return current === next || JSON.stringify(current) === JSON.stringify(next);
  }
  lastUpdatedSortValue(rule) {
    return this.parseDateSortValue(rule.updatedDate) || this.parseDateSortValue(rule.runState.lastRunAtIso) || 0;
  }
  lastFailedSortValue(rule) {
    const historyValue = Math.max(0, ...this.history(rule).filter((entry) => PROCESS_PROBLEM_RUNTIME_STATUSES.has(`${entry.status || ""}`.trim().toLowerCase())).map((entry) => this.parseDateSortValue(entry.finishedAtIso || entry.startedAtIso)));
    if (historyValue > 0) {
      return historyValue;
    }
    const lastStatus = `${rule.runState.lastRunStatus || rule.runState.currentStatus || ""}`.trim().toLowerCase();
    return PROCESS_PROBLEM_RUNTIME_STATUSES.has(lastStatus) ? this.parseDateSortValue(rule.runState.lastRunAtIso || rule.runState.finishedAtIso) : 0;
  }
  parseDateSortValue(value) {
    const parsed = Date.parse(`${value || ""}`);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  nextRunSortValue(rule) {
    const values = this.runWindows(rule).filter((slot) => slot.enabled !== false).map((slot) => this.slotSortValue(slot)).filter((value) => Number.isFinite(value));
    if (values.length > 0) {
      return Math.min(...values);
    }
    return Date.now() + this.intervalSeconds(rule) * 1e3;
  }
  slotSortValue(slot) {
    const [hour, minute] = this.normalizeTime(slot.time).split(":").map((value2) => Math.max(0, Math.trunc(Number(value2) || 0)));
    const dateTime = (date) => {
      date.setHours(hour, minute, 0, 0);
      return date.getTime();
    };
    if (slot.frequency === SCHEDULE_FREQUENCY.oneTime && /^\d{4}-\d{2}-\d{2}$/.test(slot.date || "")) {
      return dateTime(/* @__PURE__ */ new Date(`${slot.date}T00:00:00`));
    }
    const today = /* @__PURE__ */ new Date();
    if (WEEKLY_SCHEDULE_FREQUENCIES.has(slot.frequency)) {
      const targetDay = Math.max(1, Math.min(7, Math.trunc(Number(slot.dayOfWeek) || 1)));
      const currentDay = today.getDay() === 0 ? 7 : today.getDay();
      const offsetDays = (targetDay - currentDay + 7) % 7;
      const next2 = new Date(today);
      next2.setDate(today.getDate() + offsetDays);
      const value2 = dateTime(next2);
      return value2 >= Date.now() ? value2 : value2 + 7 * 24 * 60 * 60 * 1e3;
    }
    if (ROLLING_DATE_SCHEDULE_FREQUENCIES.has(slot.frequency)) {
      const { month, day } = this.monthDayParts(slot.date);
      const next2 = new Date(today);
      next2.setDate(Math.min(day, 28));
      if (slot.frequency === SCHEDULE_FREQUENCY.yearly) {
        next2.setMonth(month - 1, Math.min(day, 28));
      }
      let value2 = dateTime(next2);
      if (value2 < Date.now()) {
        if (slot.frequency === SCHEDULE_FREQUENCY.yearly) {
          next2.setFullYear(next2.getFullYear() + 1);
        } else {
          next2.setMonth(next2.getMonth() + 1);
        }
        value2 = dateTime(next2);
      }
      return value2;
    }
    const next = /* @__PURE__ */ new Date();
    let value = dateTime(next);
    if (value < Date.now()) {
      next.setDate(next.getDate() + 1);
      value = dateTime(next);
    }
    return value;
  }
  applyProcessCenterState(centerState) {
    const normalizedState = this.ensureProcessRules(centerState);
    this.latestProcessCenterState = normalizedState;
    const smartList = this.processSmartList;
    if (!smartList) {
      this.reconcileProcessListState(normalizedState.rules, normalizedState);
      return;
    }
    const changed = smartList.syncVisibleItems(normalizedState.rules, {
      total: normalizedState.rules.length,
      hasMore: false,
      nextCursor: null,
      equals: (current, next) => this.sameProcessRule(current, next),
      trackBy: (_index, rule) => rule.ruleKey
    });
    if (!changed) {
      this.reconcileProcessListState(this.state()?.rules ?? normalizedState.rules, normalizedState);
    }
  }
  reconcileProcessListMetadata(centerState) {
    const currentState = this.state();
    if (!currentState) {
      return;
    }
    const filterCounts = centerState.filterCounts ?? currentState.filterCounts;
    const emailTemplates = centerState.emailTemplates ?? currentState.emailTemplates;
    if (this.sameFlatRecord(currentState.filterCounts ?? {}, filterCounts ?? {}) && this.sameFlatRecordArray(currentState.emailTemplates ?? [], emailTemplates ?? [])) {
      return;
    }
    this.state.set(__spreadProps(__spreadValues({}, currentState), {
      filterCounts,
      emailTemplates,
      updatedDate: centerState.updatedDate || currentState.updatedDate
    }));
  }
  reconcileProcessListState(visibleRules, centerState) {
    const rules = [...visibleRules];
    const currentState = this.state();
    const rulesChanged = !currentState || currentState.rules.length !== rules.length || currentState.rules.some((rule, index) => rule !== rules[index]);
    const filterCounts = centerState.filterCounts ?? currentState?.filterCounts ?? {};
    const emailTemplates = centerState.emailTemplates ?? currentState?.emailTemplates ?? [];
    const metadataChanged = !currentState || !this.sameFlatRecord(currentState.filterCounts ?? {}, filterCounts) || !this.sameFlatRecordArray(currentState.emailTemplates ?? [], emailTemplates);
    if (rulesChanged || metadataChanged) {
      this.state.set(__spreadProps(__spreadValues({}, centerState), {
        rules,
        filterCounts,
        emailTemplates
      }));
    }
    if (!this.processBaselinesCaptured) {
      this.captureTimingBaselines(rules);
      this.captureParameterBaselines(rules);
      this.timingDirtyKeys.set(/* @__PURE__ */ new Set());
      this.parameterDirtyKeys.set(/* @__PURE__ */ new Set());
      this.processBaselinesCaptured = true;
    }
    const selectedKey = this.selectedRuleKey();
    const selectedRule = rules.find((rule) => rule.ruleKey === selectedKey);
    if (this.detailOpen()) {
      if (selectedRule && this.detailRule() !== selectedRule) {
        this.detailRule.set(selectedRule);
      }
      return;
    }
    if (!selectedRule) {
      this.selectedRuleKey.set(rules[0]?.ruleKey ?? "");
    }
  }
  mergeRuleRuntime(current, incoming) {
    if (!this.shouldApplyRuntimeState(current, incoming.runState)) {
      return current;
    }
    const runHistory = incoming.runHistory ?? [];
    const updatedDate = incoming.updatedDate || current.updatedDate;
    const updatedUser = incoming.updatedUser || current.updatedUser;
    if (this.sameFlatRecord(current.runState, incoming.runState) && this.sameFlatRecordArray(current.runHistory ?? [], runHistory) && current.updatedDate === updatedDate && current.updatedUser === updatedUser) {
      return current;
    }
    return __spreadProps(__spreadValues({}, current), {
      runState: incoming.runState,
      runHistory,
      updatedDate,
      updatedUser
    });
  }
  sameFlatRecord(left, right) {
    if (left === right) {
      return true;
    }
    const leftRecord = left;
    const rightRecord = right;
    const leftKeys = Object.keys(leftRecord);
    return leftKeys.length === Object.keys(rightRecord).length && leftKeys.every((key) => Object.is(leftRecord[key], rightRecord[key]));
  }
  sameFlatRecordArray(left, right) {
    return left === right || left.length === right.length && left.every((item, index) => this.sameFlatRecord(item, right[index]));
  }
  shouldApplyRuntimeState(current, incoming) {
    const currentStartedAt = this.parseDateSortValue(current.runState.startedAtIso);
    const incomingStartedAt = this.parseDateSortValue(incoming.startedAtIso);
    if (currentStartedAt > 0 && incomingStartedAt > 0 && incomingStartedAt < currentStartedAt) {
      return false;
    }
    if (this.isRuntimeStatus(incoming.currentStatus, PROCESS_RUNTIME_STATUS.running) && this.hasNewerFinishedRun(current, incoming.startedAtIso)) {
      return false;
    }
    const currentFinishedAt = this.parseDateSortValue(current.runState.finishedAtIso || current.runState.lastRunAtIso);
    const incomingFinishedAt = this.parseDateSortValue(incoming.finishedAtIso || incoming.lastRunAtIso);
    return incomingFinishedAt <= 0 || currentFinishedAt <= incomingFinishedAt;
  }
  patchRule(ruleKey, update) {
    const state = this.state();
    const detailRule = this.detailRule();
    const currentRule = state?.rules.find((rule) => rule.ruleKey === ruleKey) ?? (detailRule?.ruleKey === ruleKey ? detailRule : null);
    if (!currentRule) {
      return;
    }
    const updatedRule = update(currentRule);
    if (updatedRule === currentRule) {
      return;
    }
    const centerState = this.latestProcessCenterState ?? state;
    if (centerState) {
      this.latestProcessCenterState = __spreadProps(__spreadValues({}, centerState), {
        rules: centerState.rules.map((rule) => rule.ruleKey === ruleKey ? updatedRule : rule),
        updatedDate: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    if (this.processSmartList?.patchVisibleItem((rule) => rule.ruleKey === ruleKey, () => updatedRule)) {
      return;
    }
    if (state?.rules.some((rule) => rule.ruleKey === ruleKey)) {
      this.state.set(__spreadProps(__spreadValues({}, state), {
        rules: state.rules.map((rule) => rule.ruleKey === ruleKey ? updatedRule : rule),
        updatedDate: (/* @__PURE__ */ new Date()).toISOString()
      }));
    }
    if (this.detailOpen() && this.selectedRuleKey() === ruleKey && this.detailRule() !== updatedRule) {
      this.detailRule.set(updatedRule);
    }
  }
  isScheduledProcess(rule) {
    return rule.triggerKind === PROCESS_TRIGGER_KIND.scheduledProcess;
  }
  durationBetween(startedAtIso, finishedAtIso) {
    const started = Date.parse(startedAtIso || "");
    const finished = Date.parse(finishedAtIso || "");
    return Number.isFinite(started) && Number.isFinite(finished) ? Math.max(0, finished - started) : 0;
  }
  isRuntimeStatus(value, expected) {
    return `${value || ""}`.trim().toLowerCase() === expected;
  }
  hasNewerFinishedRun(rule, requestStartedAtIso) {
    const lastRunAt = Date.parse(rule.runState.lastRunAtIso || rule.runState.finishedAtIso || "");
    const requestStartedAt = Date.parse(requestStartedAtIso || "");
    const status = `${rule.runState.lastRunStatus || rule.runState.currentStatus || ""}`.trim().toLowerCase();
    return Number.isFinite(lastRunAt) && Number.isFinite(requestStartedAt) && lastRunAt >= requestStartedAt && status !== PROCESS_RUNTIME_STATUS.running;
  }
  activeAdminId(fallback) {
    return this.userProfileStore.activeUserId().trim() || `${fallback ?? ""}`.trim();
  }
  hasFinishedCurrentRun(rule) {
    const startedAt = Date.parse(rule.runState.startedAtIso || "");
    const finishedAt = Date.parse(rule.runState.finishedAtIso || rule.runState.lastRunAtIso || "");
    const lastStatus = `${rule.runState.lastRunStatus || ""}`.trim().toLowerCase();
    return Number.isFinite(finishedAt) && (!Number.isFinite(startedAt) || finishedAt >= startedAt) && PROCESS_FINISHED_RUNTIME_STATUSES.has(lastStatus);
  }
  syncPrimaryTiming(rule) {
    const intervalAmount = this.intervalAmount(rule);
    const intervalUnit = this.intervalUnit(rule);
    const intervalSeconds = intervalAmount * INTERVAL_UNIT_SECONDS[intervalUnit];
    const intervalMinutes = Math.max(1, Math.ceil(intervalSeconds / 60));
    rule.timing.mode = DEFAULT_PRIMARY_TIMING.mode;
    rule.timing.time = this.startTime(rule);
    rule.timing.timezone = rule.timing.timezone || DEFAULT_RUN_WINDOW.timezone;
    rule.timing.cronExpression = this.intervalExpression(rule);
    rule.timing.intervalMinutes = intervalMinutes;
    rule.timing.intervalSeconds = intervalSeconds;
    rule.timing.intervalAmount = intervalAmount;
    rule.timing.intervalUnit = intervalUnit;
    rule.scheduleSlots = [];
  }
  dayOfMonth(value) {
    return this.monthDayParts(value).day;
  }
  monthDayLabel(value) {
    const { month, day } = this.monthDayParts(value);
    return new Date(Date.UTC(2026, month - 1, day)).toLocaleString([], { month: "short", day: "numeric", timeZone: "UTC" });
  }
  monthDayParts(value) {
    const match = `${value || ""}`.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const month = match ? Math.max(1, Math.min(12, Math.trunc(Number(match[2]) || 1))) : 1;
    const day = match ? Math.max(1, Math.min(31, Math.trunc(Number(match[3]) || 1))) : 1;
    return { month, day };
  }
  normalizeTime(value) {
    const normalized = `${value || ""}`.trim();
    return /^\d{2}:\d{2}$/.test(normalized) ? normalized : DEFAULT_RUN_WINDOW.time;
  }
  static \u0275fac = function AdminNotificationsPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminNotificationsPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminNotificationsPopupComponent, selectors: [["app-admin-notifications-popup"]], viewQuery: function AdminNotificationsPopupComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.processSmartList = _t.first);
    }
  }, decls: 1, vars: 1, consts: [["intervalText", ""], ["processSmartList", ""], ["processRowTemplate", ""], [3, "model"], [1, "notifications-body"], ["aria-busy", "true", 1, "notifications-state", "notifications-loading-state"], [3, "model", "zIndex"], ["kind", "load-ring", "state", "loading", 3, "durationMs"], [1, "notifications-error"], [1, "process-list-card"], [1, "process-list-row", "process-list-head"], [1, "process-list-smart-list", 3, "stateChange", "config", "loadPage", "query", "itemTemplate"], [1, "process-list-row", 3, "ngClass"], [1, "process-list-name"], [1, "process-list-icon", 3, "ngClass"], [1, "process-status-pill", 3, "ngClass"], [1, "process-list-windows"], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "process-list-actions"], [1, "process-list-action-buttons"], ["type", "button", 1, "process-icon-btn", 3, "click"], [1, "process-icon-ring-shell"], ["kind", "action-ring", "shape", "circle", "state", "loading"], ["type", "button", 1, "process-icon-btn", 3, "click", "disabled"], ["type", "button", 1, "process-icon-btn", "process-icon-btn-primary", 3, "click", "disabled"], [1, "process-list-live-progress"], [1, "process-detail-scroll", "process-console", 3, "ngClass"], [1, "process-hero"], [1, "process-hero-main"], [1, "notification-detail-kicker"], [1, "process-actions"], ["type", "button", 1, "process-soft-btn", 3, "has-dirty", "disabled"], ["type", "button", 1, "process-soft-btn", 3, "click", "disabled"], ["type", "button", 1, "notification-primary-btn", "process-start-btn", 3, "click", "disabled"], [1, "process-grid"], [1, "process-card", "process-card-wide"], [1, "process-card-head"], [1, "process-progress"], ["aria-hidden", "true", 1, "process-progress-bar"], [1, "process-card"], ["type", "button", 1, "process-frequency", 3, "click", "disabled"], [1, "process-cron"], [1, "process-last-run"], [1, "process-last-run-stats"], [1, "process-card", "process-history-card"], [1, "process-history-table"], [1, "process-history-row", "process-history-head"], [1, "process-history-row"], [1, "process-history-empty"], [1, "job-timing-editor"], [1, "run-window-row"], [1, "run-window-row-head"], [1, "run-window-row-tools"], [1, "job-timing-form-flow", 3, "ngModelChange", "model", "disabled", "ngModel"], [1, "run-window-readable"], [1, "run-window-list"], [1, "run-window-row", "job-parameters-group"], [1, "run-window-grid", "job-parameters-grid"], ["type", "number", 3, "ngModel", "disabled"], [3, "ngModel", "disabled"], ["type", "text", 3, "ngModel", "disabled"], [3, "ngModelChange", "ngModel", "disabled"], [3, "value"], ["type", "text", 3, "ngModelChange", "ngModel", "disabled"], ["type", "number", 3, "ngModelChange", "ngModel", "disabled"]], template: function AdminNotificationsPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, AdminNotificationsPopupComponent_Conditional_0_Template, 8, 4, "app-popup", 3);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.admin.activePopup() === ctx.popupKey ? 0 : -1);
    }
  }, dependencies: [
    CommonModule,
    NgClass,
    NgTemplateOutlet,
    FormsModule,
    NgSelectOption,
    \u0275NgSelectMultipleOption,
    DefaultValueAccessor,
    NumberValueAccessor,
    SelectControlValueAccessor,
    NgControlStatus,
    NgModel,
    MatIconModule,
    MatIcon,
    IndicatorComponent,
    FormFlowComponent,
    PopupComponent,
    SmartListComponent,
    I18nPipe
  ], styles: ['\n[_nghost-%COMP%] {\n  --interactive-motion-duration: 160ms;\n  --interactive-motion-ease: cubic-bezier(0.22, 1, 0.36, 1);\n  --interactive-hover-lift: -1px;\n  --interactive-hover-scale: 1.01;\n  --interactive-hover-brightness: 1.01;\n  --interactive-press-scale: 0.97;\n  --interactive-press-brightness: 0.97;\n}\n[_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]) {\n  -webkit-tap-highlight-color: transparent;\n  transition:\n    transform var(--interactive-motion-duration) var(--interactive-motion-ease),\n    filter var(--interactive-motion-duration) var(--interactive-motion-ease),\n    box-shadow var(--interactive-motion-duration) var(--interactive-motion-ease),\n    background-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    border-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    color var(--interactive-motion-duration) var(--interactive-motion-ease);\n  transform-origin: center;\n}\n[_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):focus-visible {\n  outline: 2px solid rgba(66, 110, 182, 0.44);\n  outline-offset: 2px;\n}\n@media (hover: hover) and (pointer: fine) {\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):hover {\n    transform: translateY(var(--interactive-hover-lift)) scale(var(--interactive-hover-scale));\n    filter: brightness(var(--interactive-hover-brightness));\n  }\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  [_ngcontent-%COMP%]:where(.motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):hover {\n    box-shadow: 0 3px 10px rgba(16, 29, 48, 0.14);\n  }\n}\n@keyframes _ngcontent-%COMP%_shared-mobile-touch-feedback {\n  0% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n  45% {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  100% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n}\n@media (hover: none), (pointer: coarse) {\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    animation: _ngcontent-%COMP%_shared-mobile-touch-feedback 0.2s ease;\n  }\n}\n.app-popup[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%] {\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.app-popup[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%] {\n  font-family: inherit;\n}\n.popup-filter-picker[_ngcontent-%COMP%], \n.activities-view-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 60;\n  margin-left: auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-filter-picker-secondary[_ngcontent-%COMP%], \n.activities-secondary-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 61;\n}\n.selector-like[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%] {\n  width: fit-content !important;\n  min-width: 0 !important;\n  max-width: 100%;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: auto !important;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%] {\n  width: auto !important;\n  flex: 0 1 auto;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: auto !important;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%] {\n  margin-left: 0.28rem;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%] {\n  min-width: 174px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  border: 1px solid #c8d3e2;\n  border-radius: 999px;\n  box-shadow: 0 2px 6px rgba(38, 60, 92, 0.08);\n  padding: 0.12rem 0.5rem 0.12rem 0.84rem;\n  background: #f8f9fb;\n}\n.profile-status-select-wrap.selector-like[_ngcontent-%COMP%] {\n  min-height: 36px;\n}\n.status-option-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.2rem;\n  text-transform: lowercase;\n  width: 100%;\n  min-width: 0;\n}\n.status-option-content[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child {\n  white-space: nowrap;\n}\n.status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  flex: 0 0 16px;\n}\n.rate-filter-count-badge[_ngcontent-%COMP%] {\n  margin-left: auto;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  border: 1px solid #fff;\n  background: #d84d4d;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  font-size: 0.68rem;\n  font-weight: 800;\n  line-height: 1;\n  box-shadow: 0 2px 8px rgba(120, 24, 24, 0.22);\n}\n.rate-filter-trigger-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  margin-left: 0;\n  z-index: 2;\n}\n.popup-filter-control[_ngcontent-%COMP%], \n.activities-rate-filter-select[_ngcontent-%COMP%], \n.activities-primary-filter-select[_ngcontent-%COMP%], \n.activities-event-scope-filter-select[_ngcontent-%COMP%], \n.activities-chat-context-filter-select[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: visible;\n}\n.popup-filter-panel[_ngcontent-%COMP%], \n.activities-view-picker-panel[_ngcontent-%COMP%] {\n  position: absolute;\n  top: calc(100% + 0.32rem);\n  right: 0;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 10px;\n  background: #fff;\n  box-shadow: 0 10px 24px rgba(17, 29, 48, 0.22);\n  padding: 0.24rem;\n  min-width: 128px;\n  z-index: 40;\n  display: grid;\n  gap: 0.16rem;\n}\n.popup-filter-option[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%] {\n  border: 0;\n  background: #fff;\n  border-radius: 8px;\n  min-height: 32px;\n  padding: 0.34rem 0.44rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.34rem;\n  color: #1e3658;\n  cursor: pointer;\n  text-align: left;\n}\n.popup-filter-option[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-filter-option[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.popup-filter-option[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:not(.rate-filter-count-badge), \n.activities-view-option[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:not(.rate-filter-count-badge) {\n  flex: 1 1 auto;\n  min-width: 0;\n  text-align: left;\n}\n.popup-mobile-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-primary-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-event-scope-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-chat-context-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-rate-filter-picker[_ngcontent-%COMP%] {\n  position: relative;\n}\n.popup-mobile-filter-panel[_ngcontent-%COMP%], \n.activities-mobile-filter-panel[_ngcontent-%COMP%], \n.activities-mobile-rate-filter-panel[_ngcontent-%COMP%] {\n  top: calc(100% + 0.24rem);\n  right: 0;\n  min-width: 210px;\n  z-index: 65;\n}\n.popup-mobile-sheet-title[_ngcontent-%COMP%], \n.activities-mobile-sheet-title[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  padding: 0 0.14rem;\n  color: #1c3354;\n  font-size: 0.94rem;\n  font-weight: 800;\n}\n.popup-mobile-sheet-title[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.activities-mobile-sheet-title[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n:is(.popup-filter-bar[_ngcontent-%COMP%], .experience-toolbar[_ngcontent-%COMP%], .assets-toolbar[_ngcontent-%COMP%])   .popup-view-fab[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child, \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%] {\n  font-weight: 400 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option .status-option-content {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  width: 100%;\n  min-width: 0;\n  column-gap: 0.34rem;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option .rate-filter-count-badge {\n  margin-left: 0;\n  justify-self: end;\n}\n[_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.selector-options-panel), \n[_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.status-options-panel) {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n@media (max-width: 760px) {\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%] {\n    width: 100%;\n    min-width: 0;\n    box-sizing: border-box;\n    border: 1px solid rgba(58, 81, 114, 0.24);\n    border-radius: 12px;\n    background: #f7f9fd;\n    min-height: 42px;\n    padding: 0.46rem 0.62rem;\n    justify-content: flex-start;\n    gap: 0.36rem;\n  }\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%] {\n    box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.24);\n    filter: brightness(0.95);\n  }\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%] {\n    margin-left: auto;\n    flex: 0 0 auto;\n  }\n  [_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.profile-bottom-sheet-panel) {\n    position: fixed !important;\n    left: 0 !important;\n    right: 0 !important;\n    bottom: 0 !important;\n    top: auto !important;\n    width: 100vw !important;\n    max-width: 100vw !important;\n    transform: none !important;\n  }\n  [_nghost-%COMP%]     .mat-mdc-select-panel.profile-bottom-sheet-panel {\n    width: 100vw !important;\n    max-width: 100vw !important;\n    max-height: min(54vh, 420px) !important;\n    margin: 0 !important;\n    border-radius: 16px 16px 0 0 !important;\n    border: 1px solid #d6deea;\n    border-bottom: 0;\n    box-shadow: 0 -14px 28px rgba(15, 29, 52, 0.24);\n    padding-top: 0.38rem;\n    padding-bottom: max(0.55rem, env(safe-area-inset-bottom));\n  }\n}\n.popup-view-fab[_ngcontent-%COMP%] {\n  height: 34px;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 999px;\n  background: #f3f7ff;\n  color: #2c4c74;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0 0.62rem;\n  cursor: pointer;\n}\n.popup-view-fab[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-view-fab[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.74rem;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.event-visibility-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 22;\n  margin-left: auto;\n  flex: 0 0 auto;\n}\n.event-visibility-trigger[_ngcontent-%COMP%] {\n  flex-wrap: nowrap;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-public[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-public[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e6f6ef);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-friends[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-friends[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e8f1fd);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-host[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-host[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6efe2);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-inactive[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-inactive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f2f3f5);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-public[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-public[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-friends[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-friends[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-host[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-host[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-inactive[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-inactive[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.48rem 0.56rem;\n  font: inherit;\n  color: var(--text-main);\n  background: #fff;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  resize: vertical;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n  outline: 0;\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n}\n.popup-surface-form-grid[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  max-width: none;\n  width: 100%;\n  margin: 0;\n  justify-content: stretch;\n  align-content: start;\n  align-items: start;\n  column-gap: 1rem;\n  row-gap: 0.9rem;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-rows: min-content;\n  gap: 0;\n  font-weight: 600;\n  color: rgba(26, 44, 69, 0.88);\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  min-height: 40px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  min-height: 96px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   .profile-status-select-wrap.selector-like[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   .profile-status-select-wrap.selector-like[_ngcontent-%COMP%] {\n  min-height: 40px;\n  height: 40px;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  min-height: 32px;\n}\n.popup-surface-description-field[_ngcontent-%COMP%], \n.experience-description-field[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.popup-surface-actions[_ngcontent-%COMP%], \n.experience-form-actions[_ngcontent-%COMP%] {\n  justify-content: center;\n  padding-top: 0.2rem;\n}\n.popup-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.link-btn[_ngcontent-%COMP%] {\n  border: 1px solid var(--line-strong);\n  border-radius: 999px;\n  background: #fff;\n  color: #1f3350;\n  font: inherit;\n  font-size: 0.83rem;\n  padding: 0.38rem 0.76rem;\n  cursor: pointer;\n}\n.neutral-btn[_ngcontent-%COMP%] {\n  background: #f2f4fa;\n  border-color: rgba(23, 33, 54, 0.12);\n}\n.primary-btn[_ngcontent-%COMP%] {\n  background: #4776b7;\n  border-color: #4776b7;\n  color: #fff;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.date-picker-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: #566b86;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  min-width: 80px;\n  width: 100%;\n  font-size: 0.8rem;\n  font-weight: 700;\n  text-transform: lowercase;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-content: flex-start;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%] {\n  margin-left: auto;\n}\n.status-public[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.status-friends[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.status-host[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.status-inactive[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-public[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-friends[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-host[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-inactive[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.profile-status-select-wrap.status-public[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.profile-status-select-wrap.status-friends[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.profile-status-select-wrap.status-host[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.profile-status-select-wrap.status-inactive[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.profile-details-values-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: rgba(44, 67, 100, 0.72);\n}\n.profile-details-values-btn[_ngcontent-%COMP%] {\n  min-height: 36px;\n  height: 36px;\n  box-sizing: border-box;\n  padding-top: 0;\n  padding-bottom: 0;\n}\n.profile-details-values-btn[_ngcontent-%COMP%]   .status-option-content.profile-details-selected-badges[_ngcontent-%COMP%] {\n  display: inline-grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  column-gap: 0.26rem;\n  min-width: 0;\n  width: 100%;\n}\n.profile-details-values-btn.profile-details-values-tone-values[_ngcontent-%COMP%]   .profile-details-inline-chip[_ngcontent-%COMP%] {\n  max-width: calc(100% - 2.6rem);\n}\n.profile-details-values-btn.profile-details-values-tone-interest[_ngcontent-%COMP%]   .profile-details-inline-chip[_ngcontent-%COMP%] {\n  max-width: calc((100% - 3.2rem) / 2);\n}\n.profile-details-values-btn.profile-details-values-tone-values[_ngcontent-%COMP%]   .profile-details-inline-overflow[_ngcontent-%COMP%] {\n  color: #1e6b5a;\n}\n.profile-details-values-btn.profile-details-values-tone-interest[_ngcontent-%COMP%]   .profile-details-inline-overflow[_ngcontent-%COMP%] {\n  color: #2e5a90;\n}\n.values-header-chips[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.28rem;\n  flex: 0 0 100%;\n  margin-left: 0;\n  margin-top: 0.34rem;\n  max-width: 100%;\n  overflow: visible;\n  white-space: normal;\n  padding-bottom: 0;\n}\n.popup-title-values[_ngcontent-%COMP%] {\n  margin-right: 0.38rem;\n}\n.values-selected-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(76, 99, 136, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9ff 0%,\n      #eef3ff 100%);\n  color: #24416a;\n  border-radius: 999px;\n  min-height: 26px;\n  padding: 0.18rem 0.46rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-size: 0.7rem;\n  font-weight: 700;\n  cursor: pointer;\n  flex: 0 0 auto;\n}\n.values-selected-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.values-selected-chip.section-family[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1ea 0%,\n      #ffe6dd 100%);\n  border-color: rgba(160, 90, 51, 0.32);\n  color: #8b4d2b;\n}\n.values-selected-chip.section-ambition[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff7e8 0%,\n      #ffefd7 100%);\n  border-color: rgba(160, 106, 20, 0.32);\n  color: #9a6614;\n}\n.values-selected-chip.section-lifestyle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f5 0%,\n      #e0f2ee 100%);\n  border-color: rgba(45, 125, 120, 0.32);\n  color: #2a6e6a;\n}\n.values-selected-chip.section-beliefs[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f0ecff 0%,\n      #e8e1fa 100%);\n  border-color: rgba(95, 78, 160, 0.32);\n  color: #564793;\n}\n.values-selected-chip.section-social[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n  color: #2d5ea8;\n}\n.values-selected-chip.section-arts[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2edfb 0%,\n      #e9e2f9 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n  color: #654ca1;\n}\n.values-selected-chip.section-food[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4e8 0%,\n      #fee9d6 100%);\n  border-color: rgba(170, 97, 28, 0.32);\n  color: #9d611c;\n}\n.values-selected-chip.section-active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.values-selected-chip.section-mind[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f6 0%,\n      #def1ee 100%);\n  border-color: rgba(37, 124, 118, 0.32);\n  color: #2d7d78;\n}\n.values-selected-chip.section-identity[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n  border-color: rgba(88, 78, 159, 0.32);\n  color: #5a4ea0;\n}\n.readonly-select[_ngcontent-%COMP%] {\n  width: fit-content;\n  min-width: 0;\n  max-width: 130px;\n  justify-content: center;\n  margin-top: 2px;\n  padding-left: 0.44rem;\n  padding-right: 0.44rem;\n}\n.readonly-field[_ngcontent-%COMP%] {\n  min-height: 34px;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.4rem 0.56rem;\n  background: #f7fafe;\n  color: #23476f;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-weight: 700;\n}\n.readonly-field[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.zodiac-symbol[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  font-weight: 800;\n  line-height: 1;\n}\n.zodiac-label[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  font-weight: 700;\n  min-width: 0;\n  text-align: center;\n}\n.readonly-select.zodiac-aries[_ngcontent-%COMP%] {\n  background: #fdf1f1;\n  color: #9f2f2f;\n}\n.readonly-select.zodiac-taurus[_ngcontent-%COMP%] {\n  background: #f7f3eb;\n  color: #6e4b2b;\n}\n.readonly-select.zodiac-gemini[_ngcontent-%COMP%] {\n  background: #fdf8e9;\n  color: #7d5a12;\n}\n.readonly-select.zodiac-cancer[_ngcontent-%COMP%] {\n  background: #eef4ff;\n  color: #2d5b8e;\n}\n.readonly-select.zodiac-leo[_ngcontent-%COMP%] {\n  background: #fff3e8;\n  color: #8f4b0d;\n}\n.readonly-select.zodiac-virgo[_ngcontent-%COMP%] {\n  background: #edf8ef;\n  color: #2b6b3d;\n}\n.readonly-select.zodiac-libra[_ngcontent-%COMP%] {\n  background: #f2eefc;\n  color: #60439d;\n}\n.readonly-select.zodiac-scorpio[_ngcontent-%COMP%] {\n  background: #f9edf2;\n  color: #7b3150;\n}\n.readonly-select.zodiac-sagittarius[_ngcontent-%COMP%] {\n  background: #eef1ff;\n  color: #2f4a9a;\n}\n.readonly-select.zodiac-capricorn[_ngcontent-%COMP%] {\n  background: #eff2f5;\n  color: #364653;\n}\n.readonly-select.zodiac-aquarius[_ngcontent-%COMP%] {\n  background: #ebf7fb;\n  color: #1d5f7a;\n}\n.readonly-select.zodiac-pisces[_ngcontent-%COMP%] {\n  background: #eef2ff;\n  color: #294b8f;\n}\n.physique-slim[_ngcontent-%COMP%] {\n  color: #3f7ab3;\n}\n.physique-lean[_ngcontent-%COMP%] {\n  color: #3f8f5f;\n}\n.physique-athletic[_ngcontent-%COMP%] {\n  color: #2f7e4d;\n}\n.physique-fit[_ngcontent-%COMP%] {\n  color: #465fbb;\n}\n.physique-curvy[_ngcontent-%COMP%] {\n  color: #a14875;\n}\n.physique-muscular[_ngcontent-%COMP%] {\n  color: #7d4f24;\n}\n.physique-average[_ngcontent-%COMP%] {\n  color: #4d667f;\n}\n.physique-select-wrap.physique-slim[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf3fb 0%,\n      #dfebf8 100%);\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.physique-select-wrap.physique-lean[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf6ee 0%,\n      #def0e5 100%);\n  border-color: rgba(63, 143, 95, 0.34);\n}\n.physique-select-wrap.physique-athletic[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f5ec 0%,\n      #dff0e6 100%);\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.physique-select-wrap.physique-fit[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ebf0ff 0%,\n      #e1e8fc 100%);\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.physique-select-wrap.physique-curvy[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f7edf3 0%,\n      #f0e3ec 100%);\n  border-color: rgba(161, 72, 117, 0.36);\n}\n.physique-select-wrap.physique-muscular[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe9 0%,\n      #ede3d8 100%);\n  border-color: rgba(125, 79, 36, 0.36);\n}\n.physique-select-wrap.physique-average[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef2f6 0%,\n      #e5ebf1 100%);\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.physique-select-wrap.physique-slim[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #3f7ab3;\n}\n.physique-select-wrap.physique-lean[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #3f8f5f;\n}\n.physique-select-wrap.physique-athletic[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f7e4d;\n}\n.physique-select-wrap.physique-fit[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #465fbb;\n}\n.physique-select-wrap.physique-curvy[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #a14875;\n}\n.physique-select-wrap.physique-muscular[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #7d4f24;\n}\n.physique-select-wrap.physique-average[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #4d667f;\n}\n.experience-filter-all[_ngcontent-%COMP%] {\n  color: #694ea6;\n}\n.experience-filter-workspace[_ngcontent-%COMP%] {\n  color: #a1485a;\n}\n.experience-filter-school[_ngcontent-%COMP%] {\n  color: #2d5ea8;\n}\n.experience-filter-online[_ngcontent-%COMP%] {\n  color: #2d7d47;\n}\n.experience-filter-project[_ngcontent-%COMP%] {\n  color: #6550a0;\n}\n.experience-filter-select.experience-filter-all[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-project[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #efe8ff 0%,\n      #e8defc 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n}\n.experience-filter-select.experience-filter-workspace[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-workspace[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f3 0%,\n      #ffe6ea 100%);\n  border-color: rgba(169, 72, 90, 0.32);\n}\n.experience-filter-select.experience-filter-school[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-school[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n}\n.experience-type-select.experience-filter-online[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n}\n.experience-type-select.experience-filter-project[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n}\n.experience-type-select[_ngcontent-%COMP%] {\n  min-width: 0;\n  max-width: 100%;\n  min-height: 40px;\n}\n.experience-type-field[_ngcontent-%COMP%], \n.experience-title-field[_ngcontent-%COMP%], \n.experience-city-field[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-org-field[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-type-select[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.experience-date-range-field[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: none;\n  margin: 0;\n  background: transparent;\n}\n.experience-date-range-label[_ngcontent-%COMP%] {\n  grid-column: 1/2;\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-text-field-wrapper[_ngcontent-%COMP%] {\n  min-height: 42px;\n  border-radius: 10px;\n  background: #fff;\n  border: 1px solid rgba(136, 156, 186, 0.5);\n  box-shadow: none;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-subscript-wrapper[_ngcontent-%COMP%] {\n  margin-top: 0.24rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  border: 0 !important;\n  box-shadow: none !important;\n  border-radius: 0 !important;\n  background: transparent !important;\n  min-width: 0;\n  width: 100%;\n  padding: 0 !important;\n  min-height: 0 !important;\n  height: auto !important;\n  line-height: 1.25;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-datepicker-toggle[_ngcontent-%COMP%] {\n  margin-right: 0.2rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-hint-wrapper[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-hint[_ngcontent-%COMP%] {\n  color: rgba(30, 49, 74, 0.65);\n  font-size: 0.72rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-container[_ngcontent-%COMP%] {\n  width: 100%;\n  display: grid;\n  grid-template-columns: minmax(96px, 1fr) auto minmax(96px, 1fr);\n  align-items: center;\n  column-gap: 0.34rem;\n  min-width: 0;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-separator[_ngcontent-%COMP%] {\n  margin: 0 0.28rem;\n  flex: 0 0 auto;\n  white-space: nowrap;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-start-wrapper[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-end-wrapper[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  overflow: visible;\n  min-width: 0;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-inner[_ngcontent-%COMP%] {\n  font-size: 0.96rem;\n  min-width: 0 !important;\n  width: 100% !important;\n  text-overflow: clip;\n  white-space: nowrap;\n  line-height: 1.25;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-flex[_ngcontent-%COMP%] {\n  min-width: 0;\n  border-bottom: 0 !important;\n  box-shadow: none !important;\n  align-items: center !important;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-infix[_ngcontent-%COMP%] {\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  min-height: 34px !important;\n  height: 34px;\n  display: flex;\n  align-items: center;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-line-ripple[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple--deactivating[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple--active[_ngcontent-%COMP%] {\n  display: none !important;\n  opacity: 0 !important;\n  transform: scaleX(0) !important;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-all {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efe8ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-workspace {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1f3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-school {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf4ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-online {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf8ee);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-project {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f4f0ff);\n}\n.mobile-profile-language-chip.language-tone-1[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-1[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-1 {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n  color: #2f6090;\n}\n.mobile-profile-language-chip.language-tone-2[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-2[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-2 {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n  color: #2f695b;\n}\n.mobile-profile-language-chip.language-tone-3[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-3[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-3 {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n  color: #394f9c;\n}\n.mobile-profile-language-chip.language-tone-4[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-4[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-4 {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n  color: #8d3f66;\n}\n.mobile-profile-language-chip.language-tone-5[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-5[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-5 {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n  color: #704822;\n}\n.mobile-profile-language-chip.language-tone-6[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-6[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-6 {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n  color: #415872;\n}\n.mobile-profile-language-chip.language-tone-7[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-7[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-7 {\n  background: #f7f5ea;\n  border-color: rgba(128, 109, 66, 0.34);\n  color: #746237;\n}\n.mobile-profile-language-chip.language-tone-8[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-8[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-8 {\n  background: #edf5ff;\n  border-color: rgba(45, 122, 160, 0.34);\n  color: #2f6782;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf2ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #ebf7ef);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1e3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efecfc);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3f8e9);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fceef3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf7ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6f2e9);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-1 .status-option-content {\n  color: #2d63a9;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-2 .status-option-content {\n  color: #2a7a49;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-3 .status-option-content {\n  color: #9b6018;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-4 .status-option-content {\n  color: #6153a2;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-5 .status-option-content {\n  color: #61812a;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-6 .status-option-content {\n  color: #9f446d;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-7 .status-option-content {\n  color: #2e7898;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-8 .status-option-content {\n  color: #806c3f;\n}\n.mobile-profile-selector-option.detail-tone-1[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef5ff 0%,\n      #e3eefc 100%);\n  border-color: rgba(46, 102, 181, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-2[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef9f3 0%,\n      #e3f4ea 100%);\n  border-color: rgba(40, 125, 72, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-3[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ea 0%,\n      #ffecdd 100%);\n  border-color: rgba(165, 94, 24, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-4[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f1ff 0%,\n      #e8e5fb 100%);\n  border-color: rgba(97, 82, 164, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-5[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f9ef 0%,\n      #edf3e1 100%);\n  border-color: rgba(95, 128, 36, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-6[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #f9e6ed 100%);\n  border-color: rgba(160, 70, 111, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-7[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ff 0%,\n      #e2f0fb 100%);\n  border-color: rgba(45, 122, 160, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-8[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f3ea 0%,\n      #eee9dc 100%);\n  border-color: rgba(128, 109, 66, 0.32);\n}\n.mobile-profile-selector-option.status-public[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e6f6ef 0%,\n      #d9f0e6 100%);\n  border-color: rgba(47, 143, 102, 0.34);\n}\n.mobile-profile-selector-option.status-friends[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f1fd 0%,\n      #dfeaf9 100%);\n  border-color: rgba(27, 87, 161, 0.34);\n}\n.mobile-profile-selector-option.status-host[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe2 0%,\n      #eee4d2 100%);\n  border-color: rgba(135, 88, 15, 0.36);\n}\n.mobile-profile-selector-option.status-inactive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3f5 0%,\n      #e8ebef 100%);\n  border-color: rgba(91, 101, 115, 0.32);\n}\n.mobile-profile-selector-option.physique-slim[_ngcontent-%COMP%] {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.mobile-profile-selector-option.physique-lean[_ngcontent-%COMP%] {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n}\n.mobile-profile-selector-option.physique-athletic[_ngcontent-%COMP%] {\n  background: #e8f5ec;\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.mobile-profile-selector-option.physique-fit[_ngcontent-%COMP%] {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.mobile-profile-selector-option.physique-curvy[_ngcontent-%COMP%] {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n}\n.mobile-profile-selector-option.physique-muscular[_ngcontent-%COMP%] {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n}\n.mobile-profile-selector-option.physique-average[_ngcontent-%COMP%] {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .values-selector-popup.profile-selector-popup[_ngcontent-%COMP%] {\n  gap: 0.56rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.44rem;\n  padding-bottom: 0.22rem;\n  border-bottom: 1px solid rgba(74, 102, 139, 0.22);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-head-label[_ngcontent-%COMP%] {\n  color: #203c64;\n  font-size: 0.82rem;\n  font-weight: 800;\n  line-height: 1.2;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-clear[_ngcontent-%COMP%] {\n  border: 1px solid rgba(41, 73, 110, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.82);\n  color: #284970;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.3rem 0.52rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-clear.is-hidden[_ngcontent-%COMP%] {\n  visibility: hidden;\n  pointer-events: none;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-selected[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(35, 68, 107, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.92);\n  color: #234368;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.26rem 0.48rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.16rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-empty[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.74rem;\n  color: rgba(31, 54, 86, 0.62);\n  font-style: italic;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.34rem;\n  border: 1px solid transparent;\n  border-radius: 12px;\n  padding: 0.4rem 0.42rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-head[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag[_ngcontent-%COMP%] {\n  border-radius: 999px;\n  border: 1px solid rgba(52, 86, 128, 0.28);\n  background: rgba(255, 255, 255, 0.74);\n  color: #2f527d;\n  font-size: 0.67rem;\n  font-weight: 800;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.2rem 0.52rem;\n  text-transform: uppercase;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 1px;\n  background: rgba(84, 111, 147, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip-grid[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.36rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(41, 70, 106, 0.22);\n  border-radius: 999px;\n  background: #f4f8ff;\n  color: #234066;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 700;\n  padding: 0.3rem 0.58rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  cursor: pointer;\n  transition:\n    background-color 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip.active[_ngcontent-%COMP%] {\n  border-color: rgba(27, 85, 158, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #dcebff 0%,\n      #cfe3ff 100%);\n  color: #123e70;\n  box-shadow: inset 0 0 0 1px rgba(30, 73, 127, 0.24), 0 1px 2px rgba(24, 53, 86, 0.16);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-family[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 232, 219, 0.52) 0%,\n      rgba(255, 232, 219, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-ambition[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 242, 216, 0.52) 0%,\n      rgba(255, 242, 216, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-lifestyle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(221, 241, 239, 0.56) 0%,\n      rgba(221, 241, 239, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-beliefs[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-social[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(223, 236, 255, 0.5) 0%,\n      rgba(223, 236, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-arts[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(235, 227, 255, 0.5) 0%,\n      rgba(235, 227, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-food[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 236, 221, 0.52) 0%,\n      rgba(255, 236, 221, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(222, 243, 231, 0.56) 0%,\n      rgba(222, 243, 231, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-mind[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(219, 242, 238, 0.56) 0%,\n      rgba(219, 242, 238, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-identity[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-family[_ngcontent-%COMP%] {\n  border-color: rgba(156, 94, 51, 0.34);\n  color: #9c5e33;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-ambition[_ngcontent-%COMP%] {\n  border-color: rgba(160, 106, 20, 0.34);\n  color: #9b6717;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-lifestyle[_ngcontent-%COMP%] {\n  border-color: rgba(47, 123, 119, 0.34);\n  color: #2f7b77;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-beliefs[_ngcontent-%COMP%] {\n  border-color: rgba(95, 78, 160, 0.34);\n  color: #5f4ea0;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-social[_ngcontent-%COMP%] {\n  border-color: rgba(47, 106, 175, 0.36);\n  color: #2f6aaf;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-arts[_ngcontent-%COMP%] {\n  border-color: rgba(106, 87, 168, 0.36);\n  color: #6a57a8;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-food[_ngcontent-%COMP%] {\n  border-color: rgba(170, 97, 28, 0.34);\n  color: #a55e18;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-active[_ngcontent-%COMP%] {\n  border-color: rgba(49, 124, 82, 0.36);\n  color: #317c52;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-mind[_ngcontent-%COMP%] {\n  border-color: rgba(37, 124, 118, 0.34);\n  color: #2b7c76;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-identity[_ngcontent-%COMP%] {\n  border-color: rgba(98, 84, 163, 0.34);\n  color: #6254a3;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-family[_ngcontent-%COMP%] {\n  background: rgba(156, 94, 51, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-ambition[_ngcontent-%COMP%] {\n  background: rgba(160, 106, 20, 0.32);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-lifestyle[_ngcontent-%COMP%] {\n  background: rgba(47, 123, 119, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-beliefs[_ngcontent-%COMP%] {\n  background: rgba(95, 78, 160, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-social[_ngcontent-%COMP%] {\n  background: rgba(47, 106, 175, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-arts[_ngcontent-%COMP%] {\n  background: rgba(106, 87, 168, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-food[_ngcontent-%COMP%] {\n  background: rgba(170, 97, 28, 0.32);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-active[_ngcontent-%COMP%] {\n  background: rgba(49, 124, 82, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-mind[_ngcontent-%COMP%] {\n  background: rgba(37, 124, 118, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-identity[_ngcontent-%COMP%] {\n  background: rgba(98, 84, 163, 0.3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.status-option) {\n  background: #f0f5fc;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.mdc-list-item--selected:not(.mdc-list-item--disabled) {\n  filter: brightness(0.95);\n  box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.2);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option {\n  background: #fff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option:not(:last-child) {\n  border-bottom: 1px solid #e6edf7;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.hide-selected-option, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.hide-selected-option {\n  min-height: 0 !important;\n  height: 0 !important;\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  border: 0 !important;\n  margin: 0 !important;\n  opacity: 0 !important;\n  pointer-events: none !important;\n  overflow: hidden !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option {\n  background: #fff;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel {\n  margin-top: 8px !important;\n  margin-bottom: 8px !important;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .cdk-overlay-pane .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .cdk-overlay-pane .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above {\n  margin-top: 0 !important;\n  margin-bottom: 18px !important;\n  transform: translateY(-10px) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public {\n  --mdc-list-list-item-container-color: #def3e9;\n  --mat-mdc-option-selected-container-color: #def3e9;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #def3e9) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends {\n  --mdc-list-list-item-container-color: #e3eefb;\n  --mat-mdc-option-selected-container-color: #e3eefb;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e3eefb) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host {\n  --mdc-list-list-item-container-color: #f3ead8;\n  --mat-mdc-option-selected-container-color: #f3ead8;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3ead8) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive {\n  --mdc-list-list-item-container-color: #eceff3;\n  --mat-mdc-option-selected-container-color: #eceff3;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eceff3) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon {\n  color: #2f8f66 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon {\n  color: #1b57a1 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon {\n  color: #87580f !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon {\n  color: #5b6573 !important;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-slim {\n  background: #eaf4ff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-lean {\n  background: #edf8f4;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-athletic {\n  background: #e8f5ec;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-fit {\n  background: #f1f2ff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-curvy {\n  background: #fff2f8;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-muscular {\n  background: #fbf4ea;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-average {\n  background: #eff4f9;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-slim .status-option-content {\n  color: #3f7ab3;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-lean .status-option-content {\n  color: #3f8f5f;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-athletic .status-option-content {\n  color: #2f7e4d;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-fit .status-option-content {\n  color: #465fbb;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-curvy .status-option-content {\n  color: #a14875;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-muscular .status-option-content {\n  color: #7d4f24;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-average .status-option-content {\n  color: #4d667f;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.physique-options-panel {\n  width: auto !important;\n  max-width: 220px !important;\n  min-width: 0 !important;\n}\n[_nghost-%COMP%]     .physique-options-panel .mat-mdc-option {\n  padding-right: 8px;\n}\n[_nghost-%COMP%]     .physique-options-panel .mat-mdc-option .mat-pseudo-checkbox {\n  margin-left: 4px;\n}\n@media (max-width: 760px) {\n  .experience-form-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    max-width: none;\n    justify-content: stretch;\n    row-gap: 0.72rem;\n  }\n  .experience-date-range-label[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n  }\n  .experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-container[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);\n  }\n  .profile-details-privacy-fab[_ngcontent-%COMP%]   .privacy-fab-actions[_ngcontent-%COMP%] {\n    position: fixed;\n    left: 0.5rem;\n    right: 0.5rem;\n    bottom: max(0.5rem, env(safe-area-inset-bottom));\n    top: auto;\n    transform: translateY(12px) scale(0.98);\n    transform-origin: bottom center;\n    justify-content: center;\n    gap: 0.46rem;\n    padding: 0.46rem 0.56rem;\n    border: 1px solid rgba(42, 68, 102, 0.2);\n    border-radius: 14px;\n    background: #fff;\n    box-shadow: 0 -12px 24px rgba(18, 31, 51, 0.22);\n  }\n  .profile-details-privacy-fab.open[_ngcontent-%COMP%]   .privacy-fab-actions[_ngcontent-%COMP%] {\n    transform: translateY(0) scale(1);\n  }\n}\n[_nghost-%COMP%] {\n  display: contents;\n}\n.notifications-tabs[_ngcontent-%COMP%], \n.notification-channel-grid[_ngcontent-%COMP%], \n.notification-rule-side[_ngcontent-%COMP%], \n.notification-detail-kicker[_ngcontent-%COMP%], \n.notification-run-card[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n}\n.notification-primary-btn[_ngcontent-%COMP%] {\n  min-height: 34px;\n  border: 1px solid rgba(35, 96, 160, 0.42);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #e5f2ff 0%,\n      #c9dff8 100%);\n  color: #174d86;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.34rem;\n  padding: 0 0.78rem;\n  font: inherit;\n  font-size: 0.76rem;\n  font-weight: 900;\n  cursor: pointer;\n}\n.notification-primary-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.5;\n  cursor: default;\n}\n.notification-primary-btn.is-saved[_ngcontent-%COMP%] {\n  border-color: rgba(45, 135, 83, 0.42);\n  background:\n    linear-gradient(\n      180deg,\n      #e6f8ed 0%,\n      #c8efd8 100%);\n  color: #287345;\n}\n.notification-primary-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n.notifications-body[_ngcontent-%COMP%] {\n  min-height: 0;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  gap: 0.58rem;\n}\n.notifications-state[_ngcontent-%COMP%], \n.notifications-error[_ngcontent-%COMP%] {\n  min-height: 88px;\n  border: 1px solid rgba(42, 81, 129, 0.14);\n  border-radius: 8px;\n  background: #f7faff;\n  color: rgba(34, 55, 84, 0.78);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.42rem;\n  font-size: 0.84rem;\n  font-weight: 900;\n}\n.notifications-state-small[_ngcontent-%COMP%] {\n  min-height: 64px;\n}\n.notifications-loading-state[_ngcontent-%COMP%] {\n  min-height: 280px;\n  display: grid;\n  place-items: center;\n  align-content: center;\n  gap: 0.42rem;\n  text-align: center;\n}\n.notifications-error[_ngcontent-%COMP%] {\n  min-height: 42px;\n  justify-content: flex-start;\n  padding: 0 0.72rem;\n  background: #fff4f5;\n  border-color: rgba(184, 70, 88, 0.22);\n  color: #9b3345;\n}\n.notifications-tabs[_ngcontent-%COMP%] {\n  gap: 0.34rem;\n  flex-wrap: wrap;\n}\n.notifications-tab[_ngcontent-%COMP%] {\n  min-height: 34px;\n  border: 1px solid rgba(42, 81, 129, 0.16);\n  border-radius: 999px;\n  background: #fff;\n  color: #315170;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.32rem;\n  padding: 0 0.68rem;\n  font: inherit;\n  font-size: 0.76rem;\n  font-weight: 900;\n  cursor: pointer;\n}\n.notifications-tab.is-active[_ngcontent-%COMP%] {\n  background: #e8f2ff;\n  border-color: rgba(45, 105, 169, 0.34);\n  color: #174d86;\n}\n.notifications-tab[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n.process-tabs[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.42rem;\n  flex-wrap: wrap;\n}\n.process-list-card[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  min-height: 0;\n  border: 1px solid rgba(23, 33, 54, 0.12);\n  border-radius: 8px;\n  background: #fbfdff;\n  padding: 0.58rem;\n  display: flex;\n  flex-direction: column;\n  gap: 0.28rem;\n  overflow: hidden;\n}\n.process-list-toolbar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  margin-bottom: 0.46rem;\n}\n.process-list-smart-list[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  min-width: 0;\n  min-height: 0;\n}\n[_nghost-%COMP%]     .process-list-smart-list .smart-list__stage {\n  top: 0;\n}\n[_nghost-%COMP%]     .process-list-smart-list .smart-list.admin-job-process-list {\n  gap: 0.28rem;\n  padding-right: 0.1rem;\n}\n[_nghost-%COMP%]     .process-list-smart-list .smart-list__item-shell {\n  min-width: 0;\n}\n.process-list-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(220px, 1fr) minmax(92px, 0.38fr) minmax(104px, 0.42fr) minmax(72px, 0.28fr) minmax(124px, auto);\n  gap: 0.38rem;\n  align-items: center;\n  min-height: 48px;\n  border-radius: 8px;\n  padding: 0.38rem 0.52rem;\n  color: #213a5d;\n  font-size: 0.76rem;\n  font-weight: 850;\n}\n.process-list-row[_ngcontent-%COMP%]:not(.process-list-head) {\n  border: 1px solid rgba(42, 81, 129, 0.1);\n  background: #fff;\n}\n.process-list-row.is-suspended[_ngcontent-%COMP%]:not(.process-list-head) {\n  border-color: rgba(197, 79, 30, 0.22);\n  background: #fff8f5;\n}\n.process-list-row.is-failed[_ngcontent-%COMP%]:not(.process-list-head), \n.process-list-row.is-missed[_ngcontent-%COMP%]:not(.process-list-head) {\n  border-color: rgba(190, 52, 72, 0.24);\n  background: #fff6f7;\n}\n.process-list-head[_ngcontent-%COMP%] {\n  min-height: 34px;\n  color: rgba(31, 55, 86, 0.62);\n  font-size: 0.68rem;\n  font-weight: 900;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n}\n.process-list-name[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.52rem;\n}\n.process-list-name[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:last-child {\n  min-width: 0;\n  display: grid;\n  gap: 0.12rem;\n}\n.process-list-name[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.process-list-name[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.process-list-windows[_ngcontent-%COMP%] {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.process-list-name[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #1f3658;\n  font-size: 0.82rem;\n  font-weight: 900;\n}\n.process-list-name[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.process-list-windows[_ngcontent-%COMP%] {\n  color: rgba(31, 55, 86, 0.62);\n  font-size: 0.7rem;\n  font-weight: 850;\n}\n.process-list-icon[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  background: #eef8f7;\n  color: #23756f;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex: 0 0 auto;\n}\n.process-list-icon.is-suspended[_ngcontent-%COMP%] {\n  background: #fff1e9;\n  color: #a13d18;\n}\n.process-list-icon.is-failed[_ngcontent-%COMP%], \n.process-list-icon.is-missed[_ngcontent-%COMP%] {\n  background: #ffe1e5;\n  color: #a5293a;\n}\n.process-list-icon[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n}\n.process-list-actions[_ngcontent-%COMP%] {\n  display: grid;\n  justify-items: end;\n  align-items: center;\n  gap: 0.2rem;\n}\n.process-list-action-buttons[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.3rem;\n}\n.process-list-live-progress[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n  width: 100%;\n  height: 5px;\n  border-radius: 999px;\n  background: rgba(45, 81, 125, 0.14);\n  overflow: hidden;\n}\n.process-list-live-progress[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  height: 100%;\n  border-radius: inherit;\n  background:\n    linear-gradient(\n      90deg,\n      #2f75bc 0%,\n      #75c893 100%);\n  display: block;\n  transition: width 180ms ease;\n}\n.process-icon-btn[_ngcontent-%COMP%] {\n  position: relative;\n  width: 30px;\n  height: 30px;\n  border: 1px solid rgba(42, 81, 129, 0.16);\n  border-radius: 50%;\n  background: #f7faff;\n  color: #315170;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  cursor: pointer;\n}\n.process-icon-ring-shell[_ngcontent-%COMP%] {\n  position: relative;\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.process-icon-ring-shell.is-loading[_ngcontent-%COMP%]   .process-icon-btn[_ngcontent-%COMP%], \n.process-icon-ring-shell.is-loading[_ngcontent-%COMP%]   .process-icon-btn[_ngcontent-%COMP%]:disabled {\n  border-color: rgba(181, 117, 23, 0.72);\n  background:\n    linear-gradient(\n      180deg,\n      #ffe7bf 0%,\n      #ffd085 100%);\n  color: #8e4f0d;\n  opacity: 1;\n  cursor: wait;\n}\n.process-icon-btn.is-suspended[_ngcontent-%COMP%] {\n  border-color: rgba(45, 135, 83, 0.72);\n  background: #2f8b5b;\n  color: #fff;\n}\n.process-icon-btn-primary[_ngcontent-%COMP%] {\n  border-color: rgba(35, 96, 160, 0.46);\n  background: #e8f2ff;\n  color: #174d86;\n}\n.process-icon-btn-parameters[_ngcontent-%COMP%] {\n  border-color: rgba(27, 134, 109, 0.34);\n  background: #edf9f5;\n  color: #18745e;\n}\n.process-icon-btn-primary.is-running[_ngcontent-%COMP%], \n.process-icon-btn-primary.is-running[_ngcontent-%COMP%]:disabled {\n  border-color: rgba(32, 136, 130, 0.62);\n  background:\n    linear-gradient(\n      180deg,\n      #d7f5ef 0%,\n      #a9dfd3 100%);\n  color: #12645e;\n  opacity: 1;\n  cursor: wait;\n}\n.process-icon-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.48;\n  cursor: default;\n}\n.process-icon-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.process-list-empty[_ngcontent-%COMP%] {\n  min-height: 84px;\n  border-radius: 8px;\n  background: #f8fbff;\n  color: rgba(31, 55, 86, 0.62);\n  display: grid;\n  place-items: center;\n  font-size: 0.82rem;\n  font-weight: 900;\n}\n.process-tab[_ngcontent-%COMP%] {\n  min-height: 38px;\n  border: 1px solid rgba(42, 81, 129, 0.16);\n  border-radius: 999px;\n  background: #fff;\n  color: #315170;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n  padding: 0 0.58rem 0 0.72rem;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 900;\n  cursor: pointer;\n}\n.process-tab.is-active[_ngcontent-%COMP%] {\n  background: #e8f2ff;\n  border-color: rgba(45, 105, 169, 0.34);\n  color: #174d86;\n}\n.process-tab.is-active.is-suspended[_ngcontent-%COMP%] {\n  background: #fff1e9;\n  border-color: rgba(197, 79, 30, 0.48);\n  color: #a13d18;\n  box-shadow: inset 0 0 0 1px rgba(197, 79, 30, 0.12);\n}\n.process-tab.is-active.is-issue[_ngcontent-%COMP%] {\n  background: #fff0f2;\n  border-color: rgba(190, 52, 72, 0.52);\n  color: #a5293a;\n  box-shadow: inset 0 0 0 1px rgba(190, 52, 72, 0.14);\n}\n.process-tab.is-active.is-failed[_ngcontent-%COMP%], \n.process-tab.is-active.is-missed[_ngcontent-%COMP%] {\n  background: #fff0f2;\n  border-color: rgba(190, 52, 72, 0.58);\n  color: #9f1f33;\n  box-shadow: inset 0 0 0 1px rgba(190, 52, 72, 0.16);\n}\n.process-tab.is-suspended[_ngcontent-%COMP%]:not(.is-active) {\n  border-color: rgba(197, 79, 30, 0.34);\n  background: #fff6f0;\n  color: #a13d18;\n}\n.process-tab.is-issue[_ngcontent-%COMP%]:not(.is-active) {\n  border-color: rgba(190, 52, 72, 0.36);\n  background: #fff5f6;\n  color: #a5293a;\n}\n.process-tab.is-failed[_ngcontent-%COMP%]:not(.is-active), \n.process-tab.is-missed[_ngcontent-%COMP%]:not(.is-active) {\n  border-color: rgba(190, 52, 72, 0.42);\n  background: #fff5f6;\n  color: #9f1f33;\n}\n.process-tab[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n.process-tab-badge[_ngcontent-%COMP%], \n.process-status-pill[_ngcontent-%COMP%] {\n  min-height: 22px;\n  border-radius: 999px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0 0.52rem;\n  font-size: 0.66rem;\n  font-weight: 900;\n}\n.process-tab-badge[_ngcontent-%COMP%] {\n  background: #eef1f5;\n  color: #657084;\n}\n.process-status-pill[_ngcontent-%COMP%] {\n  border: 1px solid rgba(101, 112, 132, 0.18);\n  background: #eef1f5;\n  color: #657084;\n}\n.process-status-pill.is-ready[_ngcontent-%COMP%], \n.process-tab.is-ready[_ngcontent-%COMP%]   .process-tab-badge[_ngcontent-%COMP%] {\n  background: #e6f8ed;\n  color: #287345;\n}\n.process-status-pill.is-running[_ngcontent-%COMP%], \n.process-tab.is-running[_ngcontent-%COMP%]   .process-tab-badge[_ngcontent-%COMP%] {\n  background: #e8f2ff;\n  color: #174d86;\n}\n.process-status-pill.is-suspended[_ngcontent-%COMP%], \n.process-tab.is-suspended[_ngcontent-%COMP%]   .process-tab-badge[_ngcontent-%COMP%] {\n  border: 1px solid rgba(166, 61, 20, 0.38);\n  background: #c7501f;\n  color: #fff;\n}\n.process-status-pill.is-issue[_ngcontent-%COMP%], \n.process-status-pill.is-failed[_ngcontent-%COMP%], \n.process-status-pill.is-missed[_ngcontent-%COMP%], \n.process-tab.is-issue[_ngcontent-%COMP%]   .process-tab-badge[_ngcontent-%COMP%], \n.process-tab.is-failed[_ngcontent-%COMP%]   .process-tab-badge[_ngcontent-%COMP%], \n.process-tab.is-missed[_ngcontent-%COMP%]   .process-tab-badge[_ngcontent-%COMP%] {\n  border: 1px solid rgba(165, 41, 58, 0.34);\n  background: #bf3148;\n  color: #fff;\n}\n.process-console[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  min-height: 0;\n  border: 1px solid rgba(23, 33, 54, 0.12);\n  border-radius: 8px;\n  background: #fbfdff;\n  padding: 0.72rem;\n  overflow: hidden;\n}\n.process-detail-scroll[_ngcontent-%COMP%] {\n  min-height: 0;\n  height: 100%;\n  overflow-y: auto;\n  overflow-x: hidden;\n  margin: 0;\n  padding: 0.72rem;\n}\n.process-console.is-suspended[_ngcontent-%COMP%] {\n  border-color: rgba(197, 79, 30, 0.24);\n  background: #fff8f5;\n}\n.process-console.is-issue[_ngcontent-%COMP%] {\n  border-color: rgba(190, 52, 72, 0.28);\n  background: #fff6f7;\n}\n.process-console.is-failed[_ngcontent-%COMP%], \n.process-console.is-missed[_ngcontent-%COMP%] {\n  border-color: rgba(190, 52, 72, 0.3);\n  background: #fff6f7;\n}\n.process-hero[_ngcontent-%COMP%] {\n  border: 1px solid rgba(42, 81, 129, 0.14);\n  border-radius: 8px;\n  background:\n    linear-gradient(\n      180deg,\n      #f7fbff 0%,\n      #edf6ff 100%);\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  gap: 0.82rem;\n  padding: 0.82rem;\n}\n.process-console.is-suspended[_ngcontent-%COMP%]   .process-hero[_ngcontent-%COMP%] {\n  border-color: rgba(197, 79, 30, 0.2);\n  background:\n    linear-gradient(\n      180deg,\n      #fff6ef 0%,\n      #ffeadf 100%);\n}\n.process-console.is-issue[_ngcontent-%COMP%]   .process-hero[_ngcontent-%COMP%] {\n  border-color: rgba(190, 52, 72, 0.24);\n  background:\n    linear-gradient(\n      180deg,\n      #fff5f6 0%,\n      #ffe2e7 100%);\n}\n.process-console.is-failed[_ngcontent-%COMP%]   .process-hero[_ngcontent-%COMP%], \n.process-console.is-missed[_ngcontent-%COMP%]   .process-hero[_ngcontent-%COMP%] {\n  border-color: rgba(190, 52, 72, 0.28);\n  background:\n    linear-gradient(\n      180deg,\n      #fff4f6 0%,\n      #ffdde4 100%);\n}\n.process-hero[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0.22rem 0 0;\n  color: #1f3658;\n  font-size: 1.25rem;\n  font-weight: 900;\n}\n.process-hero[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n.process-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.32rem 0 0;\n  color: rgba(31, 55, 86, 0.72);\n  font-size: 0.84rem;\n  font-weight: 800;\n  line-height: 1.42;\n}\n.process-actions[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.42rem;\n  flex-wrap: wrap;\n}\n.process-soft-btn[_ngcontent-%COMP%] {\n  position: relative;\n  min-height: 34px;\n  border: 1px solid rgba(42, 81, 129, 0.16);\n  border-radius: 999px;\n  background: #fff;\n  color: #315170;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.34rem;\n  padding: 0 0.72rem;\n  font: inherit;\n  font-size: 0.76rem;\n  font-weight: 900;\n  cursor: pointer;\n}\n.process-soft-btn.is-suspended[_ngcontent-%COMP%] {\n  border-color: rgba(45, 135, 83, 0.3);\n  background: #f1fbf5;\n  color: #287345;\n}\n.process-soft-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.process-start-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n.process-grid[_ngcontent-%COMP%] {\n  margin-top: 0.72rem;\n  display: grid;\n  grid-template-columns: minmax(0, 1.1fr) minmax(220px, 0.58fr);\n  gap: 0.62rem;\n}\n.process-card[_ngcontent-%COMP%] {\n  min-width: 0;\n  border: 1px solid rgba(42, 81, 129, 0.14);\n  border-radius: 8px;\n  background: #fff;\n  padding: 0.72rem;\n  display: grid;\n  gap: 0.5rem;\n}\n.process-card-wide[_ngcontent-%COMP%] {\n  grid-row: span 2;\n}\n.process-card-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.52rem;\n}\n.process-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  color: rgba(31, 55, 86, 0.72);\n  font-size: 0.72rem;\n  font-weight: 900;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n}\n.process-frequency[_ngcontent-%COMP%] {\n  position: relative;\n  min-height: 32px;\n  border: 1px solid rgba(196, 144, 38, 0.32);\n  border-radius: 999px;\n  background: #fff7df;\n  color: #835d14;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n  padding: 0 0.4rem;\n  font: inherit;\n  font-size: 0.74rem;\n  font-weight: 900;\n  cursor: pointer;\n}\n.process-icon-btn.has-dirty[_ngcontent-%COMP%]::after, \n.process-soft-btn.has-dirty[_ngcontent-%COMP%]::after, \n.process-frequency.has-dirty[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  top: -2px;\n  right: -2px;\n  width: 7px;\n  height: 7px;\n  border: 2px solid #fff;\n  border-radius: 50%;\n  background: #d42e3d;\n}\n.process-frequency[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n  line-height: 15px;\n}\n.process-cron[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.3rem;\n  overflow: hidden;\n}\n.process-cron[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.process-progress[_ngcontent-%COMP%], \n.process-last-run-stats[_ngcontent-%COMP%] {\n  color: rgba(31, 55, 86, 0.62);\n  font-size: 0.72rem;\n  font-weight: 900;\n}\n.process-cron[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n  min-width: 0;\n  border-radius: 8px;\n  background: #f1f6ff;\n  color: #2e5d94;\n  padding: 0.42rem 0.52rem;\n  font-size: 0.78rem;\n  font-weight: 900;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.process-progress[_ngcontent-%COMP%], \n.process-last-run-stats[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.52rem;\n}\n.process-progress-bar[_ngcontent-%COMP%] {\n  height: 8px;\n  border-radius: 999px;\n  background: #e5edf7;\n  overflow: hidden;\n}\n.process-progress-bar[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  height: 100%;\n  border-radius: inherit;\n  background:\n    linear-gradient(\n      90deg,\n      #2f75bc 0%,\n      #75c893 100%);\n  display: block;\n  transition: width 180ms ease;\n}\n.process-console.is-suspended[_ngcontent-%COMP%]   .process-progress-bar[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      90deg,\n      #c85a2a 0%,\n      #f0a444 100%);\n}\n.process-console.is-issue[_ngcontent-%COMP%]   .process-progress-bar[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      90deg,\n      #c63d54 0%,\n      #ef7b8b 100%);\n}\n.process-console.is-failed[_ngcontent-%COMP%]   .process-progress-bar[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.process-console.is-missed[_ngcontent-%COMP%]   .process-progress-bar[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      90deg,\n      #b92d43 0%,\n      #ef6f82 100%);\n}\n.process-last-run[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.16rem;\n}\n.process-last-run[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #1f3658;\n  font-size: 0.92rem;\n  font-weight: 900;\n}\n.process-last-run[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: rgba(31, 55, 86, 0.68);\n  font-size: 0.78rem;\n  font-weight: 800;\n}\n.process-history-card[_ngcontent-%COMP%] {\n  margin-top: 0.72rem;\n}\n.process-history-table[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.24rem;\n}\n.process-history-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1.1fr 0.58fr 0.52fr 0.58fr minmax(0, 1.4fr);\n  gap: 0.46rem;\n  align-items: center;\n  min-height: 34px;\n  border-radius: 8px;\n  padding: 0 0.42rem;\n  color: #233a5b;\n  font-size: 0.74rem;\n  font-weight: 800;\n}\n.process-history-row[_ngcontent-%COMP%]:not(.process-history-head) {\n  background: #f8fbff;\n}\n.process-history-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.process-history-head[_ngcontent-%COMP%] {\n  color: rgba(31, 55, 86, 0.62);\n  font-size: 0.68rem;\n  font-weight: 900;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n}\n.process-history-empty[_ngcontent-%COMP%] {\n  min-height: 48px;\n  border-radius: 8px;\n  background: #f8fbff;\n  color: rgba(31, 55, 86, 0.62);\n  display: grid;\n  place-items: center;\n  font-size: 0.78rem;\n  font-weight: 900;\n}\n.notifications-layout[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  min-height: 0;\n  display: grid;\n  grid-template-columns: minmax(280px, 0.78fr) minmax(0, 1fr);\n  gap: 0.58rem;\n}\n.notifications-list[_ngcontent-%COMP%], \n.notification-detail[_ngcontent-%COMP%] {\n  min-height: 0;\n  border: 1px solid rgba(23, 33, 54, 0.12);\n  border-radius: 8px;\n  background: #fbfdff;\n  overflow: hidden;\n}\n.run-window-row-head[_ngcontent-%COMP%], \n.run-window-actions[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.6rem;\n}\n.run-window-readable[_ngcontent-%COMP%] {\n  margin: 0.16rem 0 0;\n  color: rgba(31, 55, 86, 0.66);\n  font-size: 0.76rem;\n  font-weight: 800;\n}\n.run-window-list[_ngcontent-%COMP%] {\n  min-height: 0;\n  max-height: min(540px, 100vh - 8rem);\n  overflow-y: auto;\n  overflow-x: hidden;\n  display: grid;\n  gap: 0.56rem;\n}\n.run-window-row[_ngcontent-%COMP%] {\n  min-width: 0;\n  border: 1px solid rgba(42, 81, 129, 0.14);\n  border-radius: 8px;\n  background: #fbfdff;\n  padding: 0.66rem;\n  display: grid;\n  gap: 0.52rem;\n}\n.run-window-row[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  min-width: 0;\n  color: #1f3658;\n  font-size: 0.82rem;\n  font-weight: 900;\n}\n.job-timing-form-flow[_ngcontent-%COMP%] {\n  display: block;\n  min-width: 0;\n  --form-flow-input-height: 38px;\n}\n.job-timing-editor[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  overflow: visible;\n}\n[_nghost-%COMP%]     .job-timing-form-flow .form-flow--grouped .form-flow__body {\n  padding: 0;\n}\n[_nghost-%COMP%]     .job-timing-form-flow .form-flow__control {\n  min-width: 0;\n}\n.run-window-row-tools[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.42rem;\n}\n.run-window-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.5rem;\n}\n.run-window-grid-timing[_ngcontent-%COMP%] {\n  grid-template-columns: 1fr;\n}\n.run-window-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.22rem;\n}\n.run-window-grid[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: rgba(31, 55, 86, 0.62);\n  font-size: 0.68rem;\n  font-weight: 900;\n  text-transform: uppercase;\n}\n.run-window-grid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.run-window-grid[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n  min-height: 34px;\n  border: 1px solid rgba(42, 81, 129, 0.16);\n  border-radius: 8px;\n  background: #fff;\n  color: #213a5d;\n  font: inherit;\n  font-size: 0.8rem;\n  font-weight: 800;\n  padding: 0 0.48rem;\n}\n.run-window-interval-input[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(126px, 0.6fr);\n  align-items: center;\n  gap: 0.44rem;\n}\n.run-window-interval-input[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: rgba(31, 55, 86, 0.66);\n  text-transform: none;\n}\n.run-window-actions-interval[_ngcontent-%COMP%] {\n  justify-content: flex-end;\n}\n.job-parameters-grid[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n.run-window-row-tools[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n  min-width: 0;\n  max-width: min(260px, 42vw);\n  border-radius: 8px;\n  background: #f1f6ff;\n  color: #2e5d94;\n  padding: 0.34rem 0.46rem;\n  font-size: 0.72rem;\n  font-weight: 900;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.notifications-list[_ngcontent-%COMP%] {\n  padding: 0.54rem;\n  display: grid;\n  align-content: start;\n  gap: 0.42rem;\n  overflow-y: auto;\n}\n.notification-rule-row[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid rgba(33, 51, 78, 0.14);\n  border-radius: 8px;\n  background: #fff;\n  padding: 0.56rem;\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  gap: 0.52rem;\n  align-items: center;\n  color: #22324a;\n  font: inherit;\n  text-align: left;\n  cursor: pointer;\n}\n.notification-rule-row.is-selected[_ngcontent-%COMP%] {\n  border-color: rgba(45, 105, 169, 0.38);\n  background: #eef6ff;\n}\n.notification-rule-row.is-disabled-rule[_ngcontent-%COMP%] {\n  opacity: 0.72;\n}\n.notification-rule-icon[_ngcontent-%COMP%] {\n  width: 34px;\n  height: 34px;\n  border-radius: 50%;\n  background: #edf7f5;\n  color: #25756f;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.notification-rule-icon[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.notification-rule-main[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.12rem;\n}\n.notification-rule-title[_ngcontent-%COMP%], \n.notification-rule-meta[_ngcontent-%COMP%], \n.notification-run-main[_ngcontent-%COMP%], \n.notification-run-sub[_ngcontent-%COMP%] {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.notification-rule-title[_ngcontent-%COMP%] {\n  color: #1f3658;\n  font-size: 0.84rem;\n  font-weight: 900;\n}\n.notification-rule-meta[_ngcontent-%COMP%] {\n  color: rgba(20, 36, 58, 0.62);\n  font-size: 0.72rem;\n  font-weight: 800;\n}\n.notification-rule-side[_ngcontent-%COMP%] {\n  gap: 0.3rem;\n  justify-content: flex-end;\n}\n.notification-status-pill[_ngcontent-%COMP%] {\n  min-width: 44px;\n  height: 22px;\n  border-radius: 999px;\n  background: #eef1f5;\n  color: #657084;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0 0.46rem;\n  font-size: 0.66rem;\n  font-weight: 900;\n}\n.notification-status-pill.is-on[_ngcontent-%COMP%] {\n  background: #e6f8ed;\n  color: #287345;\n}\n.notification-run-mini[_ngcontent-%COMP%] {\n  width: 28px;\n  height: 28px;\n  border: 1px solid rgba(35, 96, 160, 0.22);\n  border-radius: 50%;\n  background: #f7faff;\n  color: #2f5f98;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  cursor: pointer;\n}\n.notification-run-mini[_ngcontent-%COMP%]:disabled {\n  opacity: 0.52;\n  cursor: default;\n}\n.notification-run-mini[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n.notification-detail[_ngcontent-%COMP%] {\n  padding: 0.72rem;\n  overflow-y: auto;\n}\n.notification-detail.is-disabled-rule[_ngcontent-%COMP%] {\n  background: #f9fbfe;\n}\n.notification-detail-head[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  gap: 0.62rem;\n  align-items: start;\n}\n.notification-detail-kicker[_ngcontent-%COMP%] {\n  gap: 0.28rem;\n  color: rgba(33, 62, 98, 0.68);\n  font-size: 0.72rem;\n  font-weight: 900;\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n}\n.notification-detail-kicker[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n  line-height: 15px;\n}\n.notification-title-input[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  margin-top: 0.22rem;\n  border: 0;\n  border-bottom: 1px solid rgba(32, 59, 94, 0.16);\n  background: transparent;\n  color: #1f3658;\n  font: inherit;\n  font-size: 1.18rem;\n  font-weight: 900;\n  outline: 0;\n}\n.notification-switch[_ngcontent-%COMP%] {\n  position: relative;\n  width: 48px;\n  height: 28px;\n  border-radius: 999px;\n  background: #dce2eb;\n  cursor: pointer;\n}\n.notification-switch[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  position: absolute;\n  opacity: 0;\n  inset: 0;\n}\n.notification-switch[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 4px;\n  left: 4px;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  background: #fff;\n  box-shadow: 0 2px 8px rgba(14, 30, 52, 0.22);\n  transition: transform 0.16s ease;\n}\n.notification-switch.is-on[_ngcontent-%COMP%] {\n  background: #76c893;\n}\n.notification-switch.is-on[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  transform: translateX(20px);\n}\n.notification-detail-grid[_ngcontent-%COMP%], \n.notification-timing-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.52rem;\n}\n.notification-timing-grid[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n}\n.notification-field[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.24rem;\n}\n.notification-field-wide[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.notification-field[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.notification-section[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: rgba(31, 55, 86, 0.7);\n  font-size: 0.7rem;\n  font-weight: 900;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n}\n.notification-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.notification-field[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.notification-field[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n  border: 1px solid rgba(42, 81, 129, 0.14);\n  border-radius: 8px;\n  background: #fff;\n  color: #22324a;\n  padding: 0.58rem 0.62rem;\n  font: inherit;\n  font-size: 0.82rem;\n  font-weight: 800;\n  outline: 0;\n}\n.notification-field[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  resize: vertical;\n}\n.notification-section[_ngcontent-%COMP%] {\n  margin-top: 0.82rem;\n  display: grid;\n  gap: 0.48rem;\n}\n.notification-section[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.notification-channel-grid[_ngcontent-%COMP%] {\n  gap: 0.42rem;\n  flex-wrap: wrap;\n}\n.notification-channel[_ngcontent-%COMP%] {\n  min-height: 38px;\n  border: 1px solid rgba(42, 81, 129, 0.14);\n  border-radius: 8px;\n  background: #fff;\n  color: #425a76;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.32rem;\n  padding: 0 0.62rem;\n  font-size: 0.78rem;\n  font-weight: 900;\n  cursor: pointer;\n}\n.notification-channel[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  position: absolute;\n  opacity: 0;\n  pointer-events: none;\n}\n.notification-channel.is-on[_ngcontent-%COMP%] {\n  border-color: rgba(45, 135, 113, 0.34);\n  background: #ecfaf6;\n  color: #1f7467;\n}\n.notification-channel[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n.notification-run-card[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  justify-content: space-between;\n  gap: 0.58rem;\n  border: 1px solid rgba(42, 81, 129, 0.14);\n  border-radius: 8px;\n  background: #fff;\n  padding: 0.62rem;\n  box-sizing: border-box;\n}\n.notification-run-card[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.12rem;\n}\n.notification-run-main[_ngcontent-%COMP%] {\n  color: #1f3658;\n  font-size: 0.84rem;\n  font-weight: 900;\n}\n.notification-run-sub[_ngcontent-%COMP%] {\n  color: rgba(31, 55, 86, 0.62);\n  font-size: 0.72rem;\n  font-weight: 800;\n}\n.notification-run-count[_ngcontent-%COMP%] {\n  min-width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  background: #f1f6ff;\n  color: #2e5d94;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.8rem;\n  font-weight: 900;\n}\n.notification-run-btn[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n}\n@media (max-width: 760px) {\n  .process-list-card[_ngcontent-%COMP%] {\n    overflow-x: hidden;\n  }\n  .process-list-head[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .process-list-row[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr) auto;\n    column-gap: 0.42rem;\n    row-gap: 0;\n    align-items: start;\n    padding: 0.64rem;\n  }\n  .process-list-row[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:nth-child(3), \n   .process-list-row[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:nth-child(4) {\n    display: none;\n  }\n  .process-list-row[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:nth-child(2) {\n    justify-self: end;\n  }\n  .process-list-actions[_ngcontent-%COMP%] {\n    grid-column: 2;\n    justify-content: flex-end;\n    justify-items: end;\n    gap: 0.12rem;\n    margin-top: -0.22rem;\n  }\n  .process-list-action-buttons[_ngcontent-%COMP%] {\n    gap: 0.24rem;\n  }\n  .process-list-live-progress[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n    width: 100%;\n  }\n  .notifications-layout[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .notifications-list[_ngcontent-%COMP%] {\n    max-height: 30vh;\n  }\n  .notification-detail-grid[_ngcontent-%COMP%], \n   .notification-timing-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .process-hero[_ngcontent-%COMP%], \n   .process-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .process-actions[_ngcontent-%COMP%] {\n    justify-content: flex-start;\n  }\n  .run-window-grid[_ngcontent-%COMP%], \n   .job-parameters-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .process-card-wide[_ngcontent-%COMP%] {\n    grid-row: auto;\n  }\n  .process-history-row[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr 0.5fr 0.45fr;\n  }\n  .process-history-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-child(4), \n   .process-history-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-child(5) {\n    display: none;\n  }\n  .notification-run-card[_ngcontent-%COMP%] {\n    display: grid;\n    grid-template-columns: minmax(0, 1fr) auto;\n  }\n  .notification-run-btn[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=admin-notifications-popup.component.css.map */'], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminNotificationsPopupComponent, [{
    type: Component,
    args: [{ selector: "app-admin-notifications-popup", standalone: true, imports: [
      CommonModule,
      FormsModule,
      MatIconModule,
      IndicatorComponent,
      I18nPipe,
      FormFlowComponent,
      PopupComponent,
      SmartListComponent
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `@if (admin.activePopup() === popupKey) {
  <app-popup [model]="notificationsPopupModel()">
      <ng-template #intervalText let-rule>
        <span>{{ jobI18n.interval.every | i18n }} </span>
        @for (part of intervalParts(rule); track $index; let last = $last) {
          <span>{{ part.value }} {{ part.unitKey | i18n }}</span>
          @if (!last) {
            <span> </span>
          }
        }
      </ng-template>

      <div class="notifications-body">
        @if (loading()) {
          <div class="notifications-state notifications-loading-state" aria-busy="true">
            <app-indicator
              kind="load-ring"
              state="loading"
              [durationMs]="notificationsService.notificationCenterLoadProgressWindowMs()"
            ></app-indicator>
            <span>{{ 'admin.jobs.loading' | i18n }}</span>
          </div>
        } @else {
          @if (error()) {
            <div class="notifications-error">
              <mat-icon>warning</mat-icon>
              <span>{{ error() | i18n }}</span>
            </div>
          }

          <section class="process-list-card">
            <div class="process-list-row process-list-head">
              <span>{{ 'admin.jobs.table.process' | i18n }}</span>
              <span>{{ 'admin.jobs.table.status' | i18n }}</span>
              <span>{{ 'admin.jobs.table.last.run' | i18n }}</span>
              <span>{{ 'admin.jobs.table.run.windows' | i18n }}</span>
              <span>{{ 'admin.jobs.table.actions' | i18n }}</span>
            </div>
            <app-smart-list
              #processSmartList
              class="process-list-smart-list"
              [config]="processListConfig"
              [loadPage]="processListLoadPage"
              [query]="processListQuery()"
              [itemTemplate]="processRowTemplate"
              (stateChange)="onProcessListStateChange($event)"
            ></app-smart-list>
            <ng-template #processRowTemplate let-rule>
              <div class="process-list-row" [ngClass]="statusClass(rule)">
                <span class="process-list-name">
                  <span class="process-list-icon" [ngClass]="statusClass(rule)">
                    <mat-icon>{{ processIcon(rule) }}</mat-icon>
                  </span>
                  <span>
                    <strong>{{ processTitle(rule) | i18n }}</strong>
                    <small>{{ actionLabel(rule.actionKey) | i18n }}</small>
                  </span>
                </span>
                <span>
                  <span class="process-status-pill" [ngClass]="statusClass(rule)">{{ rowStatusLabel(rule) | i18n }}</span>
                </span>
                <span>{{ shortDate(rule.runState.lastRunAtIso) | i18n }}</span>
                <span class="process-list-windows">
                  <ng-container [ngTemplateOutlet]="intervalText" [ngTemplateOutletContext]="{ $implicit: rule }"></ng-container>
                </span>
                <span class="process-list-actions">
                  <span class="process-list-action-buttons">
                    <button
                      type="button"
                      class="process-icon-btn"
                      [class.has-dirty]="isTimingDirty(rule) || isParameterDirty(rule)"
                      (click)="openDetail(rule)"
                      [attr.aria-label]="'admin.jobs.view.process' | i18n"
                    >
                      <mat-icon>{{ canManageProcess(rule) ? 'tune' : 'visibility' }}</mat-icon>
                    </button>
                    <span class="process-icon-ring-shell" [class.is-loading]="isRowActionPending(rule, processRowAction.suspend)">
                      @if (isRowActionPending(rule, processRowAction.suspend)) {
                        <app-indicator kind="action-ring" shape="circle" state="loading"></app-indicator>
                      }
                      <button
                        type="button"
                        class="process-icon-btn"
                        [class.is-suspended]="!rule.enabled"
                        [disabled]="!canManageProcess(rule) || saving() || !!rowActionKey()"
                        (click)="toggleSuspended(rule)"
                        [attr.aria-label]="(rule.enabled ? 'admin.jobs.suspend.process' : 'admin.jobs.unsuspend.process') | i18n"
                      >
                        <mat-icon>{{ rule.enabled ? 'pause' : 'lock_open' }}</mat-icon>
                      </button>
                    </span>
                    <span class="process-icon-ring-shell" [class.is-loading]="isRowActionPending(rule, processRowAction.run)">
                      @if (isRowActionPending(rule, processRowAction.run)) {
                        <app-indicator kind="action-ring" shape="circle" state="loading"></app-indicator>
                      }
                      <button
                        type="button"
                        class="process-icon-btn process-icon-btn-primary"
                        [class.is-running]="isProcessRunning(rule)"
                        [disabled]="!rule.manualRunEnabled || !rule.enabled || isProcessRunning(rule) || !!runningRuleKey() || !!rowActionKey()"
                        (click)="run(rule)"
                        [attr.aria-label]="'admin.jobs.run.process' | i18n"
                      >
                        <mat-icon>{{ isProcessRunning(rule) ? 'sync' : 'play_arrow' }}</mat-icon>
                      </button>
                    </span>
                  </span>
                </span>
                @if (isProcessRunning(rule)) {
                  <span class="process-list-live-progress" [attr.aria-label]="('admin.jobs.runtime.progress' | i18n) + ' ' + progressValue(rule) + '%'">
                    <span [style.width.%]="progressValue(rule)"></span>
                  </span>
                }
              </div>
            </ng-template>
          </section>

          @if (detailOpen() && selectedRule(); as rule) {
              <app-popup [model]="processDetailPopupModel(rule)" [zIndex]="2400">
                <div class="process-detail-scroll process-console" [ngClass]="statusClass(rule)">
                  <div class="process-hero">
                    <div class="process-hero-main">
                      <span class="notification-detail-kicker">
                        <mat-icon>{{ processIcon(rule) }}</mat-icon>
                        <span>{{ 'admin.jobs.scheduled.process' | i18n }}</span>
                      </span>
                      <h3>{{ processTitle(rule) | i18n }}</h3>
                      <p>{{ processDescription(rule) | i18n }}</p>
                    </div>
                    <div class="process-actions">
                      @if (hasJobParameters(rule)) {
                        <button
                          type="button"
                          class="process-soft-btn"
                          [class.has-dirty]="isParameterDirty(rule)"
                          [disabled]="!canManageProcess(rule) || saving()"
                          (click)="openParameterEditor(rule)"
                        >
                          <mat-icon>tune</mat-icon>
                          <span>{{ 'admin.jobs.parameters' | i18n }}</span>
                        </button>
                      }
                      <button
                        type="button"
                        class="process-soft-btn"
                        [class.is-suspended]="!rule.enabled"
                        [disabled]="!canManageProcess(rule) || saving() || !!rowActionKey()"
                        (click)="toggleSuspended(rule)"
                      >
                        <mat-icon>{{ rule.enabled ? 'pause' : 'lock_open' }}</mat-icon>
                        <span>{{ (rule.enabled ? 'admin.jobs.suspend' : 'admin.jobs.unsuspend') | i18n }}</span>
                      </button>
                      <button
                        type="button"
                        class="notification-primary-btn process-start-btn"
                        [disabled]="!rule.manualRunEnabled || !rule.enabled || isProcessRunning(rule) || !!runningRuleKey()"
                        (click)="run(rule)"
                      >
                        <mat-icon>{{ isProcessRunning(rule) ? 'sync' : 'play_arrow' }}</mat-icon>
                        <span>{{ (isProcessRunning(rule) ? processStatusLabelKeys[statusKind(rule)] : jobI18n.action.run) | i18n }}</span>
                      </button>
                    </div>
                  </div>

                  <div class="process-grid">
                    <section class="process-card process-card-wide">
                    <div class="process-card-head">
                      <h3>{{ 'admin.jobs.what.it.does' | i18n }}</h3>
                    </div>
                    <p>{{ processDescription(rule) | i18n }}</p>
                    <div class="process-progress">
                      <span>{{ (rule.runState.progressDetail || processStatusLabelKeys[statusKind(rule)]) | i18n }}</span>
                      <span>{{ progressValue(rule) }}%</span>
                    </div>
                    <div class="process-progress-bar" aria-hidden="true">
                      <span [style.width.%]="progressValue(rule)"></span>
                    </div>
                  </section>

                  <section class="process-card">
                    <div class="process-card-head">
                      <h3>{{ 'admin.jobs.timing' | i18n }}</h3>
                      <button type="button" class="process-frequency" [class.has-dirty]="isTimingDirty(rule)" [disabled]="!hasEditableTiming(rule)" (click)="openScheduleEditor()">
                        <mat-icon>schedule</mat-icon>
                        <span>{{ 'edit' | i18n }}</span>
                      </button>
                    </div>
                    <div class="process-cron">
                      <code>
                        <ng-container [ngTemplateOutlet]="intervalText" [ngTemplateOutletContext]="{ $implicit: rule }"></ng-container>
                      </code>
                    </div>
                  </section>

                  <section class="process-card">
                    <div class="process-card-head">
                      <h3>{{ jobI18n.pending.title | i18n }}</h3>
                    </div>
                    <div class="process-last-run">
                      <strong>{{ rule.runState.pendingCountUpdatedAtIso ? rule.runState.pendingCount : '\u2014' }}</strong>
                      <span>{{ (rule.runState.pendingCountUnit || jobI18n.lastRun.affected) | i18n }}</span>
                    </div>
                    <div class="process-last-run-stats">
                      <span>
                        {{ rule.runState.pendingCountUpdatedAtIso
                          ? shortDate(rule.runState.pendingCountUpdatedAtIso)
                          : (jobI18n.pending.notCalculated | i18n) }}
                      </span>
                    </div>
                  </section>

                  <section class="process-card">
                    <div class="process-card-head">
                      <h3>{{ 'admin.jobs.last.run' | i18n }}</h3>
                    </div>
                    <div class="process-last-run">
                      <strong>{{ shortDate(rule.runState.lastRunAtIso) | i18n }}</strong>
                      <span>{{ (rule.runState.lastRunDetail || jobI18n.lastRun.notRunYet) | i18n }}</span>
                    </div>
                    <div class="process-last-run-stats">
                      <span>{{ rule.runState.lastRunCount || 0 }} {{ jobI18n.lastRun.affected | i18n }}</span>
                      <span>{{ durationLabel(rule.runState.durationMillis) }}</span>
                    </div>
                  </section>
                  </div>

                  <section class="process-card process-history-card">
                  <div class="process-card-head">
                    <h3>{{ 'admin.jobs.runner.history' | i18n }}</h3>
                  </div>
                  <div class="process-history-table">
                    <div class="process-history-row process-history-head">
                      <span>{{ 'admin.jobs.history.when' | i18n }}</span>
                      <span>{{ 'admin.jobs.table.duration' | i18n }}</span>
                      <span>{{ 'admin.jobs.table.affected' | i18n }}</span>
                      <span>{{ 'admin.jobs.table.status' | i18n }}</span>
                      <span>{{ 'admin.jobs.history.detail' | i18n }}</span>
                    </div>
                    @for (entry of history(rule); track entry.id) {
                      <div class="process-history-row">
                        <span>{{ shortDate(entry.finishedAtIso || entry.startedAtIso) | i18n }}</span>
                        <span>{{ durationLabel(entry.durationMillis) }}</span>
                        <span>{{ entry.processedCount }}</span>
                        <span>{{ entry.status | i18n }}</span>
                        <span>{{ entry.detail | i18n }}</span>
                      </div>
                    } @empty {
                      <div class="process-history-empty">{{ 'admin.jobs.no.runs' | i18n }}</div>
                    }
                  </div>
                  </section>
                </div>
              </app-popup>
          }
        }
      </div>

      @if (scheduleEditorOpen() && selectedRule(); as scheduleRule) {
        <app-popup [model]="scheduleEditorPopupModel(scheduleRule)" [zIndex]="2500">
          @if (scheduleEditorDraft(); as timingDraft) {
            <div class="job-timing-editor">
              <article class="run-window-row">
                <div class="run-window-row-head">
                  <strong>{{ 'admin.jobs.timing.rule' | i18n }}</strong>
                  <div class="run-window-row-tools">
                    <code>{{ intervalCron(scheduleRule) }}</code>
                  </div>
                </div>
                <app-form-flow
                  class="job-timing-form-flow"
                  [model]="scheduleEditorFlowModel"
                  [disabled]="saving()"
                  [ngModel]="timingDraft"
                  (ngModelChange)="updateScheduleEditorDraft(scheduleRule, $event)"
                ></app-form-flow>
                <p class="run-window-readable">
                  {{ 'admin.jobs.start.at' | i18n }} {{ startTime(scheduleRule) }} \xB7
                  <ng-container [ngTemplateOutlet]="intervalText" [ngTemplateOutletContext]="{ $implicit: scheduleRule }"></ng-container>
                </p>
              </article>
            </div>
          }
        </app-popup>
      }

      @if (parameterDraft(); as draft) {
        <app-popup [model]="parameterEditorPopupModel()" [zIndex]="2500">
          <div class="run-window-list">
            @for (group of parameterFieldsByGroup(draft.fields); track group.group) {
              <article class="run-window-row job-parameters-group">
                <div class="run-window-row-head">
                  <strong>{{ (group.groupKey || group.group) | i18n: group.group }}</strong>
                </div>
                <div class="run-window-grid job-parameters-grid">
                  @for (field of group.fields; track field.key) {
                    <label>
                      <span>{{ (field.labelKey || field.label) | i18n: field.label }}</span>
                      @if (field.valueType === 'text') {
                        @if (parameterOptions(field).length) {
                          <select [ngModel]="field.textValue" (ngModelChange)="updateParameterText(field, $event)" [disabled]="saving() || field.readOnly === true">
                            @for (option of parameterOptions(field); track option.value) {
                              <option [value]="option.value">{{ (option.labelKey || option.label) | i18n: option.label }}</option>
                            }
                          </select>
                        } @else {
                          <input type="text" [ngModel]="field.textValue" (ngModelChange)="updateParameterText(field, $event)" [disabled]="saving() || field.readOnly === true" />
                        }
                      } @else {
                        <input type="number" [ngModel]="field.numberValue" (ngModelChange)="updateParameterNumber(field, $event)" [disabled]="saving() || field.readOnly === true" />
                      }
                    </label>
                  }
                </div>
              </article>
            }
          </div>
        </app-popup>
      }

  </app-popup>
}
`, styles: ['/* src/app/admin/components/notifications-popup/admin-notifications-popup.component.scss */\n:host {\n  --interactive-motion-duration: 160ms;\n  --interactive-motion-ease: cubic-bezier(0.22, 1, 0.36, 1);\n  --interactive-hover-lift: -1px;\n  --interactive-hover-scale: 1.01;\n  --interactive-hover-brightness: 1.01;\n  --interactive-press-scale: 0.97;\n  --interactive-press-brightness: 0.97;\n}\n:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]) {\n  -webkit-tap-highlight-color: transparent;\n  transition:\n    transform var(--interactive-motion-duration) var(--interactive-motion-ease),\n    filter var(--interactive-motion-duration) var(--interactive-motion-ease),\n    box-shadow var(--interactive-motion-duration) var(--interactive-motion-ease),\n    background-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    border-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    color var(--interactive-motion-duration) var(--interactive-motion-ease);\n  transform-origin: center;\n}\n:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):focus-visible {\n  outline: 2px solid rgba(66, 110, 182, 0.44);\n  outline-offset: 2px;\n}\n@media (hover: hover) and (pointer: fine) {\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):hover {\n    transform: translateY(var(--interactive-hover-lift)) scale(var(--interactive-hover-scale));\n    filter: brightness(var(--interactive-hover-brightness));\n  }\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  :where(.motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):hover {\n    box-shadow: 0 3px 10px rgba(16, 29, 48, 0.14);\n  }\n}\n@keyframes shared-mobile-touch-feedback {\n  0% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n  45% {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  100% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n}\n@media (hover: none), (pointer: coarse) {\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    animation: shared-mobile-touch-feedback 0.2s ease;\n  }\n}\n.app-popup,\n.mobile-profile-selector-sheet-wrap,\n.popup-surface,\n.experience-form-popup {\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.app-popup button,\n.app-popup input,\n.app-popup textarea,\n.app-popup select,\n.app-popup .mat-mdc-select,\n.app-popup .mat-mdc-select-value-text,\n.app-popup .mat-mdc-option,\n.popup-surface button,\n.popup-surface input,\n.popup-surface textarea,\n.popup-surface select,\n.popup-surface .mat-mdc-select,\n.popup-surface .mat-mdc-select-value-text,\n.popup-surface .mat-mdc-option,\n.experience-form-popup button,\n.experience-form-popup input,\n.experience-form-popup textarea,\n.experience-form-popup select,\n.experience-form-popup .mat-mdc-select,\n.experience-form-popup .mat-mdc-select-value-text,\n.experience-form-popup .mat-mdc-option,\n.mobile-profile-selector-sheet-wrap button,\n.mobile-profile-selector-sheet-wrap input,\n.mobile-profile-selector-sheet-wrap .mat-mdc-option {\n  font-family: inherit;\n}\n.popup-filter-picker,\n.activities-view-picker {\n  position: relative;\n  z-index: 60;\n  margin-left: auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-filter-picker-secondary,\n.activities-secondary-picker {\n  position: relative;\n  z-index: 61;\n}\n.selector-like {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n}\n.profile-status-select-wrap.popup-compact-select,\n.profile-status-select-wrap.activities-compact-select,\n.profile-status-select-wrap.assets-compact-select {\n  width: fit-content !important;\n  min-width: 0 !important;\n  max-width: 100%;\n}\n.profile-status-select-wrap.popup-compact-select .mat-mdc-select,\n.profile-status-select-wrap.activities-compact-select .mat-mdc-select,\n.profile-status-select-wrap.assets-compact-select .mat-mdc-select {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select .mat-mdc-select-trigger,\n.profile-status-select-wrap.activities-compact-select .mat-mdc-select-trigger,\n.profile-status-select-wrap.assets-compact-select .mat-mdc-select-trigger {\n  width: auto !important;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select .status-option-content,\n.profile-status-select-wrap.activities-compact-select .status-option-content,\n.profile-status-select-wrap.assets-compact-select .status-option-content {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge,\n.profile-status-select-wrap.activities-filter-no-badge {\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge .status-option-content,\n.profile-status-select-wrap.activities-filter-no-badge .status-option-content {\n  width: auto !important;\n  flex: 0 1 auto;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select-trigger,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select-trigger {\n  width: auto !important;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select-arrow-wrapper,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select-arrow-wrapper {\n  margin-left: 0.28rem;\n}\n.profile-status-select-wrap {\n  min-width: 174px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  border: 1px solid #c8d3e2;\n  border-radius: 999px;\n  box-shadow: 0 2px 6px rgba(38, 60, 92, 0.08);\n  padding: 0.12rem 0.5rem 0.12rem 0.84rem;\n  background: #f8f9fb;\n}\n.profile-status-select-wrap.selector-like {\n  min-height: 36px;\n}\n.status-option-content {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.2rem;\n  text-transform: lowercase;\n  width: 100%;\n  min-width: 0;\n}\n.status-option-content span:last-child {\n  white-space: nowrap;\n}\n.status-option-content .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  flex: 0 0 16px;\n}\n.rate-filter-count-badge {\n  margin-left: auto;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  border: 1px solid #fff;\n  background: #d84d4d;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  font-size: 0.68rem;\n  font-weight: 800;\n  line-height: 1;\n  box-shadow: 0 2px 8px rgba(120, 24, 24, 0.22);\n}\n.rate-filter-trigger-badge {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  margin-left: 0;\n  z-index: 2;\n}\n.popup-filter-control,\n.activities-rate-filter-select,\n.activities-primary-filter-select,\n.activities-event-scope-filter-select,\n.activities-chat-context-filter-select {\n  position: relative;\n  overflow: visible;\n}\n.popup-filter-panel,\n.activities-view-picker-panel {\n  position: absolute;\n  top: calc(100% + 0.32rem);\n  right: 0;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 10px;\n  background: #fff;\n  box-shadow: 0 10px 24px rgba(17, 29, 48, 0.22);\n  padding: 0.24rem;\n  min-width: 128px;\n  z-index: 40;\n  display: grid;\n  gap: 0.16rem;\n}\n.popup-filter-option,\n.activities-view-option {\n  border: 0;\n  background: #fff;\n  border-radius: 8px;\n  min-height: 32px;\n  padding: 0.34rem 0.44rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.34rem;\n  color: #1e3658;\n  cursor: pointer;\n  text-align: left;\n}\n.popup-filter-option .mat-icon,\n.activities-view-option .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-filter-option span,\n.activities-view-option span {\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.popup-filter-option > span:not(.rate-filter-count-badge),\n.activities-view-option > span:not(.rate-filter-count-badge) {\n  flex: 1 1 auto;\n  min-width: 0;\n  text-align: left;\n}\n.popup-mobile-filter-picker,\n.activities-mobile-primary-filter-picker,\n.activities-mobile-event-scope-filter-picker,\n.activities-mobile-chat-context-filter-picker,\n.activities-mobile-rate-filter-picker {\n  position: relative;\n}\n.popup-mobile-filter-panel,\n.activities-mobile-filter-panel,\n.activities-mobile-rate-filter-panel {\n  top: calc(100% + 0.24rem);\n  right: 0;\n  min-width: 210px;\n  z-index: 65;\n}\n.popup-mobile-sheet-title,\n.activities-mobile-sheet-title {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  padding: 0 0.14rem;\n  color: #1c3354;\n  font-size: 0.94rem;\n  font-weight: 800;\n}\n.popup-mobile-sheet-title .mat-icon,\n.activities-mobile-sheet-title .mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .popup-view-fab span,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .mat-mdc-select,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .status-option-content span:last-child,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .mat-mdc-select-value-text {\n  font-weight: 400 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option .status-option-content {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  width: 100%;\n  min-width: 0;\n  column-gap: 0.34rem;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option .rate-filter-count-badge {\n  margin-left: 0;\n  justify-self: end;\n}\n:host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.selector-options-panel),\n:host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.status-options-panel) {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n@media (max-width: 760px) {\n  .popup-mobile-filter-panel .popup-filter-option,\n  .popup-mobile-filter-panel .activities-view-option,\n  .activities-mobile-filter-panel .popup-filter-option,\n  .activities-mobile-filter-panel .activities-view-option,\n  .activities-mobile-rate-filter-panel .popup-filter-option,\n  .activities-mobile-rate-filter-panel .activities-view-option {\n    width: 100%;\n    min-width: 0;\n    box-sizing: border-box;\n    border: 1px solid rgba(58, 81, 114, 0.24);\n    border-radius: 12px;\n    background: #f7f9fd;\n    min-height: 42px;\n    padding: 0.46rem 0.62rem;\n    justify-content: flex-start;\n    gap: 0.36rem;\n  }\n  .popup-mobile-filter-panel .popup-filter-option.active,\n  .popup-mobile-filter-panel .activities-view-option.active,\n  .activities-mobile-filter-panel .popup-filter-option.active,\n  .activities-mobile-filter-panel .activities-view-option.active,\n  .activities-mobile-rate-filter-panel .popup-filter-option.active,\n  .activities-mobile-rate-filter-panel .activities-view-option.active {\n    box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.24);\n    filter: brightness(0.95);\n  }\n  .popup-mobile-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .popup-mobile-filter-panel .activities-view-option .rate-filter-count-badge,\n  .activities-mobile-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .activities-mobile-filter-panel .activities-view-option .rate-filter-count-badge,\n  .activities-mobile-rate-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .activities-mobile-rate-filter-panel .activities-view-option .rate-filter-count-badge {\n    margin-left: auto;\n    flex: 0 0 auto;\n  }\n  :host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.profile-bottom-sheet-panel) {\n    position: fixed !important;\n    left: 0 !important;\n    right: 0 !important;\n    bottom: 0 !important;\n    top: auto !important;\n    width: 100vw !important;\n    max-width: 100vw !important;\n    transform: none !important;\n  }\n  :host ::ng-deep .mat-mdc-select-panel.profile-bottom-sheet-panel {\n    width: 100vw !important;\n    max-width: 100vw !important;\n    max-height: min(54vh, 420px) !important;\n    margin: 0 !important;\n    border-radius: 16px 16px 0 0 !important;\n    border: 1px solid #d6deea;\n    border-bottom: 0;\n    box-shadow: 0 -14px 28px rgba(15, 29, 52, 0.24);\n    padding-top: 0.38rem;\n    padding-bottom: max(0.55rem, env(safe-area-inset-bottom));\n  }\n}\n.popup-view-fab {\n  height: 34px;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 999px;\n  background: #f3f7ff;\n  color: #2c4c74;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0 0.62rem;\n  cursor: pointer;\n}\n.popup-view-fab .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-view-fab span {\n  font-size: 0.74rem;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.event-visibility-picker {\n  position: relative;\n  z-index: 22;\n  margin-left: auto;\n  flex: 0 0 auto;\n}\n.event-visibility-trigger {\n  flex-wrap: nowrap;\n}\n.profile-status-header-picker .event-visibility-trigger.status-public,\n.profile-status-header-picker .activities-view-option.status-public {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e6f6ef);\n}\n.profile-status-header-picker .event-visibility-trigger.status-friends,\n.profile-status-header-picker .activities-view-option.status-friends {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e8f1fd);\n}\n.profile-status-header-picker .event-visibility-trigger.status-host,\n.profile-status-header-picker .activities-view-option.status-host {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6efe2);\n}\n.profile-status-header-picker .event-visibility-trigger.status-inactive,\n.profile-status-header-picker .activities-view-option.status-inactive {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f2f3f5);\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-public,\n.profile-status-header-picker .activities-view-option.status-public .mat-icon {\n  color: #2f8f66;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-friends,\n.profile-status-header-picker .activities-view-option.status-friends .mat-icon {\n  color: #1b57a1;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-host,\n.profile-status-header-picker .activities-view-option.status-host .mat-icon {\n  color: #87580f;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-inactive,\n.profile-status-header-picker .activities-view-option.status-inactive .mat-icon {\n  color: #5b6573;\n}\n.app-popup textarea,\n.app-popup input,\n.app-popup select,\n.popup-surface textarea,\n.popup-surface input,\n.popup-surface select,\n.experience-form-popup textarea,\n.experience-form-popup input,\n.experience-form-popup select,\n.mobile-profile-selector-sheet-wrap input {\n  width: 100%;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.48rem 0.56rem;\n  font: inherit;\n  color: var(--text-main);\n  background: #fff;\n}\n.app-popup textarea,\n.popup-surface textarea,\n.experience-form-popup textarea {\n  resize: vertical;\n}\n.app-popup textarea:focus,\n.app-popup input:focus,\n.app-popup select:focus,\n.popup-surface textarea:focus,\n.popup-surface input:focus,\n.popup-surface select:focus,\n.experience-form-popup textarea:focus,\n.experience-form-popup input:focus,\n.experience-form-popup select:focus,\n.mobile-profile-selector-sheet-wrap input:focus {\n  outline: 0;\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n}\n.popup-surface-form-grid,\n.experience-form-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  max-width: none;\n  width: 100%;\n  margin: 0;\n  justify-content: stretch;\n  align-content: start;\n  align-items: start;\n  column-gap: 1rem;\n  row-gap: 0.9rem;\n}\n.popup-surface-form-grid label,\n.experience-form-grid label {\n  display: grid;\n  grid-template-rows: min-content;\n  gap: 0;\n  font-weight: 600;\n  color: rgba(26, 44, 69, 0.88);\n}\n.popup-surface-form-grid input,\n.experience-form-grid input {\n  min-height: 40px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid textarea,\n.experience-form-grid textarea {\n  min-height: 96px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid .profile-status-select-wrap.selector-like,\n.experience-form-grid .profile-status-select-wrap.selector-like {\n  min-height: 40px;\n  height: 40px;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid .mat-mdc-select-trigger,\n.experience-form-grid .mat-mdc-select-trigger {\n  min-height: 32px;\n}\n.popup-surface-description-field,\n.experience-description-field {\n  grid-column: 1/-1;\n}\n.popup-surface-actions,\n.experience-form-actions {\n  justify-content: center;\n  padding-top: 0.2rem;\n}\n.popup-actions {\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.link-btn {\n  border: 1px solid var(--line-strong);\n  border-radius: 999px;\n  background: #fff;\n  color: #1f3350;\n  font: inherit;\n  font-size: 0.83rem;\n  padding: 0.38rem 0.76rem;\n  cursor: pointer;\n}\n.neutral-btn {\n  background: #f2f4fa;\n  border-color: rgba(23, 33, 54, 0.12);\n}\n.primary-btn {\n  background: #4776b7;\n  border-color: #4776b7;\n  color: #fff;\n}\n.profile-status-select-wrap .mat-icon,\n.date-picker-btn .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: #566b86;\n}\n.profile-status-select-wrap .mat-mdc-select {\n  min-width: 80px;\n  width: 100%;\n  font-size: 0.8rem;\n  font-weight: 700;\n  text-transform: lowercase;\n}\n.profile-status-select-wrap .mat-mdc-select-trigger {\n  width: 100%;\n  justify-content: flex-start;\n}\n.profile-status-select-wrap .mat-mdc-select-arrow-wrapper {\n  margin-left: auto;\n}\n.status-public {\n  color: #2f8f66;\n}\n.status-friends {\n  color: #1b57a1;\n}\n.status-host {\n  color: #87580f;\n}\n.status-inactive {\n  color: #5b6573;\n}\n.status-option-content .status-public {\n  color: #2f8f66;\n}\n.status-option-content .status-friends {\n  color: #1b57a1;\n}\n.status-option-content .status-host {\n  color: #87580f;\n}\n.status-option-content .status-inactive {\n  color: #5b6573;\n}\n.profile-status-select-wrap.status-public .status-option-content .mat-icon {\n  color: #2f8f66;\n}\n.profile-status-select-wrap.status-friends .status-option-content .mat-icon {\n  color: #1b57a1;\n}\n.profile-status-select-wrap.status-host .status-option-content .mat-icon {\n  color: #87580f;\n}\n.profile-status-select-wrap.status-inactive .status-option-content .mat-icon {\n  color: #5b6573;\n}\n.profile-details-values-btn .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: rgba(44, 67, 100, 0.72);\n}\n.profile-details-values-btn {\n  min-height: 36px;\n  height: 36px;\n  box-sizing: border-box;\n  padding-top: 0;\n  padding-bottom: 0;\n}\n.profile-details-values-btn .status-option-content.profile-details-selected-badges {\n  display: inline-grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  column-gap: 0.26rem;\n  min-width: 0;\n  width: 100%;\n}\n.profile-details-values-btn.profile-details-values-tone-values .profile-details-inline-chip {\n  max-width: calc(100% - 2.6rem);\n}\n.profile-details-values-btn.profile-details-values-tone-interest .profile-details-inline-chip {\n  max-width: calc((100% - 3.2rem) / 2);\n}\n.profile-details-values-btn.profile-details-values-tone-values .profile-details-inline-overflow {\n  color: #1e6b5a;\n}\n.profile-details-values-btn.profile-details-values-tone-interest .profile-details-inline-overflow {\n  color: #2e5a90;\n}\n.values-header-chips {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.28rem;\n  flex: 0 0 100%;\n  margin-left: 0;\n  margin-top: 0.34rem;\n  max-width: 100%;\n  overflow: visible;\n  white-space: normal;\n  padding-bottom: 0;\n}\n.popup-title-values {\n  margin-right: 0.38rem;\n}\n.values-selected-chip {\n  border: 1px solid rgba(76, 99, 136, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9ff 0%,\n      #eef3ff 100%);\n  color: #24416a;\n  border-radius: 999px;\n  min-height: 26px;\n  padding: 0.18rem 0.46rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-size: 0.7rem;\n  font-weight: 700;\n  cursor: pointer;\n  flex: 0 0 auto;\n}\n.values-selected-chip .mat-icon {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.values-selected-chip.section-family {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1ea 0%,\n      #ffe6dd 100%);\n  border-color: rgba(160, 90, 51, 0.32);\n  color: #8b4d2b;\n}\n.values-selected-chip.section-ambition {\n  background:\n    linear-gradient(\n      180deg,\n      #fff7e8 0%,\n      #ffefd7 100%);\n  border-color: rgba(160, 106, 20, 0.32);\n  color: #9a6614;\n}\n.values-selected-chip.section-lifestyle {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f5 0%,\n      #e0f2ee 100%);\n  border-color: rgba(45, 125, 120, 0.32);\n  color: #2a6e6a;\n}\n.values-selected-chip.section-beliefs {\n  background:\n    linear-gradient(\n      180deg,\n      #f0ecff 0%,\n      #e8e1fa 100%);\n  border-color: rgba(95, 78, 160, 0.32);\n  color: #564793;\n}\n.values-selected-chip.section-social {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n  color: #2d5ea8;\n}\n.values-selected-chip.section-arts {\n  background:\n    linear-gradient(\n      180deg,\n      #f2edfb 0%,\n      #e9e2f9 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n  color: #654ca1;\n}\n.values-selected-chip.section-food {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4e8 0%,\n      #fee9d6 100%);\n  border-color: rgba(170, 97, 28, 0.32);\n  color: #9d611c;\n}\n.values-selected-chip.section-active {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.values-selected-chip.section-mind {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f6 0%,\n      #def1ee 100%);\n  border-color: rgba(37, 124, 118, 0.32);\n  color: #2d7d78;\n}\n.values-selected-chip.section-identity {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n  border-color: rgba(88, 78, 159, 0.32);\n  color: #5a4ea0;\n}\n.readonly-select {\n  width: fit-content;\n  min-width: 0;\n  max-width: 130px;\n  justify-content: center;\n  margin-top: 2px;\n  padding-left: 0.44rem;\n  padding-right: 0.44rem;\n}\n.readonly-field {\n  min-height: 34px;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.4rem 0.56rem;\n  background: #f7fafe;\n  color: #23476f;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-weight: 700;\n}\n.readonly-field .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.zodiac-symbol {\n  font-size: 1.1rem;\n  font-weight: 800;\n  line-height: 1;\n}\n.zodiac-label {\n  font-size: 0.9rem;\n  font-weight: 700;\n  min-width: 0;\n  text-align: center;\n}\n.readonly-select.zodiac-aries {\n  background: #fdf1f1;\n  color: #9f2f2f;\n}\n.readonly-select.zodiac-taurus {\n  background: #f7f3eb;\n  color: #6e4b2b;\n}\n.readonly-select.zodiac-gemini {\n  background: #fdf8e9;\n  color: #7d5a12;\n}\n.readonly-select.zodiac-cancer {\n  background: #eef4ff;\n  color: #2d5b8e;\n}\n.readonly-select.zodiac-leo {\n  background: #fff3e8;\n  color: #8f4b0d;\n}\n.readonly-select.zodiac-virgo {\n  background: #edf8ef;\n  color: #2b6b3d;\n}\n.readonly-select.zodiac-libra {\n  background: #f2eefc;\n  color: #60439d;\n}\n.readonly-select.zodiac-scorpio {\n  background: #f9edf2;\n  color: #7b3150;\n}\n.readonly-select.zodiac-sagittarius {\n  background: #eef1ff;\n  color: #2f4a9a;\n}\n.readonly-select.zodiac-capricorn {\n  background: #eff2f5;\n  color: #364653;\n}\n.readonly-select.zodiac-aquarius {\n  background: #ebf7fb;\n  color: #1d5f7a;\n}\n.readonly-select.zodiac-pisces {\n  background: #eef2ff;\n  color: #294b8f;\n}\n.physique-slim {\n  color: #3f7ab3;\n}\n.physique-lean {\n  color: #3f8f5f;\n}\n.physique-athletic {\n  color: #2f7e4d;\n}\n.physique-fit {\n  color: #465fbb;\n}\n.physique-curvy {\n  color: #a14875;\n}\n.physique-muscular {\n  color: #7d4f24;\n}\n.physique-average {\n  color: #4d667f;\n}\n.physique-select-wrap.physique-slim {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf3fb 0%,\n      #dfebf8 100%);\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.physique-select-wrap.physique-lean {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf6ee 0%,\n      #def0e5 100%);\n  border-color: rgba(63, 143, 95, 0.34);\n}\n.physique-select-wrap.physique-athletic {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f5ec 0%,\n      #dff0e6 100%);\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.physique-select-wrap.physique-fit {\n  background:\n    linear-gradient(\n      180deg,\n      #ebf0ff 0%,\n      #e1e8fc 100%);\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.physique-select-wrap.physique-curvy {\n  background:\n    linear-gradient(\n      180deg,\n      #f7edf3 0%,\n      #f0e3ec 100%);\n  border-color: rgba(161, 72, 117, 0.36);\n}\n.physique-select-wrap.physique-muscular {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe9 0%,\n      #ede3d8 100%);\n  border-color: rgba(125, 79, 36, 0.36);\n}\n.physique-select-wrap.physique-average {\n  background:\n    linear-gradient(\n      180deg,\n      #eef2f6 0%,\n      #e5ebf1 100%);\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.physique-select-wrap.physique-slim .status-option-content .mat-icon {\n  color: #3f7ab3;\n}\n.physique-select-wrap.physique-lean .status-option-content .mat-icon {\n  color: #3f8f5f;\n}\n.physique-select-wrap.physique-athletic .status-option-content .mat-icon {\n  color: #2f7e4d;\n}\n.physique-select-wrap.physique-fit .status-option-content .mat-icon {\n  color: #465fbb;\n}\n.physique-select-wrap.physique-curvy .status-option-content .mat-icon {\n  color: #a14875;\n}\n.physique-select-wrap.physique-muscular .status-option-content .mat-icon {\n  color: #7d4f24;\n}\n.physique-select-wrap.physique-average .status-option-content .mat-icon {\n  color: #4d667f;\n}\n.experience-filter-all {\n  color: #694ea6;\n}\n.experience-filter-workspace {\n  color: #a1485a;\n}\n.experience-filter-school {\n  color: #2d5ea8;\n}\n.experience-filter-online {\n  color: #2d7d47;\n}\n.experience-filter-project {\n  color: #6550a0;\n}\n.experience-filter-select.experience-filter-all,\n.experience-type-select.experience-filter-project {\n  background:\n    linear-gradient(\n      180deg,\n      #efe8ff 0%,\n      #e8defc 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n}\n.experience-filter-select.experience-filter-workspace,\n.experience-type-select.experience-filter-workspace {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f3 0%,\n      #ffe6ea 100%);\n  border-color: rgba(169, 72, 90, 0.32);\n}\n.experience-filter-select.experience-filter-school,\n.experience-type-select.experience-filter-school {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n}\n.experience-type-select.experience-filter-online {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n}\n.experience-type-select.experience-filter-project {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n}\n.experience-type-select {\n  min-width: 0;\n  max-width: 100%;\n  min-height: 40px;\n}\n.experience-type-field,\n.experience-title-field,\n.experience-city-field {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-org-field {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-type-select {\n  width: 100%;\n}\n.experience-date-range-field {\n  width: 100%;\n  max-width: none;\n  margin: 0;\n  background: transparent;\n}\n.experience-date-range-label {\n  grid-column: 1/2;\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-date-range-field .mat-mdc-text-field-wrapper {\n  min-height: 42px;\n  border-radius: 10px;\n  background: #fff;\n  border: 1px solid rgba(136, 156, 186, 0.5);\n  box-shadow: none;\n}\n.experience-date-range-field .mat-mdc-form-field-subscript-wrapper {\n  margin-top: 0.24rem;\n}\n.experience-date-range-field input {\n  border: 0 !important;\n  box-shadow: none !important;\n  border-radius: 0 !important;\n  background: transparent !important;\n  min-width: 0;\n  width: 100%;\n  padding: 0 !important;\n  min-height: 0 !important;\n  height: auto !important;\n  line-height: 1.25;\n}\n.experience-date-range-field .mat-datepicker-toggle {\n  margin-right: 0.2rem;\n}\n.experience-date-range-field .mat-mdc-form-field-hint-wrapper,\n.experience-date-range-field .mat-mdc-form-field-hint {\n  color: rgba(30, 49, 74, 0.65);\n  font-size: 0.72rem;\n}\n.experience-date-range-field .mat-date-range-input-container {\n  width: 100%;\n  display: grid;\n  grid-template-columns: minmax(96px, 1fr) auto minmax(96px, 1fr);\n  align-items: center;\n  column-gap: 0.34rem;\n  min-width: 0;\n}\n.experience-date-range-field .mat-date-range-input-separator {\n  margin: 0 0.28rem;\n  flex: 0 0 auto;\n  white-space: nowrap;\n}\n.experience-date-range-field .mat-date-range-input-start-wrapper,\n.experience-date-range-field .mat-date-range-input-end-wrapper {\n  width: 100%;\n  max-width: 100%;\n  overflow: visible;\n  min-width: 0;\n}\n.experience-date-range-field .mat-date-range-input-inner {\n  font-size: 0.96rem;\n  min-width: 0 !important;\n  width: 100% !important;\n  text-overflow: clip;\n  white-space: nowrap;\n  line-height: 1.25;\n}\n.experience-date-range-field .mat-mdc-form-field-flex {\n  min-width: 0;\n  border-bottom: 0 !important;\n  box-shadow: none !important;\n  align-items: center !important;\n}\n.experience-date-range-field .mat-mdc-form-field-infix {\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  min-height: 34px !important;\n  height: 34px;\n  display: flex;\n  align-items: center;\n}\n.experience-date-range-field .mdc-line-ripple,\n.experience-date-range-field .mat-mdc-form-field-line-ripple,\n.experience-date-range-field .mdc-line-ripple--deactivating,\n.experience-date-range-field .mdc-line-ripple--active {\n  display: none !important;\n  opacity: 0 !important;\n  transform: scaleX(0) !important;\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-all {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efe8ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-workspace {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1f3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-school {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf4ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-online {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf8ee);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-project {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f4f0ff);\n}\n.mobile-profile-language-chip.language-tone-1,\n.mobile-profile-selector-option.language-tone-1,\n:host ::ng-deep .mat-mdc-option.language-tone-1 {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n  color: #2f6090;\n}\n.mobile-profile-language-chip.language-tone-2,\n.mobile-profile-selector-option.language-tone-2,\n:host ::ng-deep .mat-mdc-option.language-tone-2 {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n  color: #2f695b;\n}\n.mobile-profile-language-chip.language-tone-3,\n.mobile-profile-selector-option.language-tone-3,\n:host ::ng-deep .mat-mdc-option.language-tone-3 {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n  color: #394f9c;\n}\n.mobile-profile-language-chip.language-tone-4,\n.mobile-profile-selector-option.language-tone-4,\n:host ::ng-deep .mat-mdc-option.language-tone-4 {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n  color: #8d3f66;\n}\n.mobile-profile-language-chip.language-tone-5,\n.mobile-profile-selector-option.language-tone-5,\n:host ::ng-deep .mat-mdc-option.language-tone-5 {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n  color: #704822;\n}\n.mobile-profile-language-chip.language-tone-6,\n.mobile-profile-selector-option.language-tone-6,\n:host ::ng-deep .mat-mdc-option.language-tone-6 {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n  color: #415872;\n}\n.mobile-profile-language-chip.language-tone-7,\n.mobile-profile-selector-option.language-tone-7,\n:host ::ng-deep .mat-mdc-option.language-tone-7 {\n  background: #f7f5ea;\n  border-color: rgba(128, 109, 66, 0.34);\n  color: #746237;\n}\n.mobile-profile-language-chip.language-tone-8,\n.mobile-profile-selector-option.language-tone-8,\n:host ::ng-deep .mat-mdc-option.language-tone-8 {\n  background: #edf5ff;\n  border-color: rgba(45, 122, 160, 0.34);\n  color: #2f6782;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf2ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #ebf7ef);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1e3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efecfc);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3f8e9);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fceef3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf7ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6f2e9);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-1 .status-option-content {\n  color: #2d63a9;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-2 .status-option-content {\n  color: #2a7a49;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-3 .status-option-content {\n  color: #9b6018;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-4 .status-option-content {\n  color: #6153a2;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-5 .status-option-content {\n  color: #61812a;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-6 .status-option-content {\n  color: #9f446d;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-7 .status-option-content {\n  color: #2e7898;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-8 .status-option-content {\n  color: #806c3f;\n}\n.mobile-profile-selector-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      180deg,\n      #eef5ff 0%,\n      #e3eefc 100%);\n  border-color: rgba(46, 102, 181, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      180deg,\n      #eef9f3 0%,\n      #e3f4ea 100%);\n  border-color: rgba(40, 125, 72, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ea 0%,\n      #ffecdd 100%);\n  border-color: rgba(165, 94, 24, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f1ff 0%,\n      #e8e5fb 100%);\n  border-color: rgba(97, 82, 164, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f9ef 0%,\n      #edf3e1 100%);\n  border-color: rgba(95, 128, 36, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #f9e6ed 100%);\n  border-color: rgba(160, 70, 111, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ff 0%,\n      #e2f0fb 100%);\n  border-color: rgba(45, 122, 160, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f3ea 0%,\n      #eee9dc 100%);\n  border-color: rgba(128, 109, 66, 0.32);\n}\n.mobile-profile-selector-option.status-public {\n  background:\n    linear-gradient(\n      180deg,\n      #e6f6ef 0%,\n      #d9f0e6 100%);\n  border-color: rgba(47, 143, 102, 0.34);\n}\n.mobile-profile-selector-option.status-friends {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f1fd 0%,\n      #dfeaf9 100%);\n  border-color: rgba(27, 87, 161, 0.34);\n}\n.mobile-profile-selector-option.status-host {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe2 0%,\n      #eee4d2 100%);\n  border-color: rgba(135, 88, 15, 0.36);\n}\n.mobile-profile-selector-option.status-inactive {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3f5 0%,\n      #e8ebef 100%);\n  border-color: rgba(91, 101, 115, 0.32);\n}\n.mobile-profile-selector-option.physique-slim {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.mobile-profile-selector-option.physique-lean {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n}\n.mobile-profile-selector-option.physique-athletic {\n  background: #e8f5ec;\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.mobile-profile-selector-option.physique-fit {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.mobile-profile-selector-option.physique-curvy {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n}\n.mobile-profile-selector-option.physique-muscular {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n}\n.mobile-profile-selector-option.physique-average {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.popup-panel-profile-selector .values-selector-popup.profile-selector-popup {\n  gap: 0.56rem;\n}\n.popup-panel-profile-selector .profile-filter-selector-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.44rem;\n  padding-bottom: 0.22rem;\n  border-bottom: 1px solid rgba(74, 102, 139, 0.22);\n}\n.popup-panel-profile-selector .profile-filter-selector-head-label {\n  color: #203c64;\n  font-size: 0.82rem;\n  font-weight: 800;\n  line-height: 1.2;\n}\n.popup-panel-profile-selector .profile-filter-selector-clear {\n  border: 1px solid rgba(41, 73, 110, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.82);\n  color: #284970;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.3rem 0.52rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector .profile-filter-selector-clear.is-hidden {\n  visibility: hidden;\n  pointer-events: none;\n}\n.popup-panel-profile-selector .profile-filter-selector-selected {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector .profile-filter-selector-chip {\n  border: 1px solid rgba(35, 68, 107, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.92);\n  color: #234368;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.26rem 0.48rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.16rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector .profile-filter-selector-chip .mat-icon {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n}\n.popup-panel-profile-selector .profile-filter-selector-empty {\n  margin: 0;\n  font-size: 0.74rem;\n  color: rgba(31, 54, 86, 0.62);\n  font-style: italic;\n}\n.popup-panel-profile-selector .profile-selector-option-group {\n  display: grid;\n  gap: 0.34rem;\n  border: 1px solid transparent;\n  border-radius: 12px;\n  padding: 0.4rem 0.42rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-head {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag {\n  border-radius: 999px;\n  border: 1px solid rgba(52, 86, 128, 0.28);\n  background: rgba(255, 255, 255, 0.74);\n  color: #2f527d;\n  font-size: 0.67rem;\n  font-weight: 800;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.2rem 0.52rem;\n  text-transform: uppercase;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag-icon {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.popup-panel-profile-selector .profile-selector-option-group-line {\n  display: block;\n  width: 100%;\n  height: 1px;\n  background: rgba(84, 111, 147, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-chip-grid {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.36rem;\n}\n.popup-panel-profile-selector .profile-selector-chip {\n  border: 1px solid rgba(41, 70, 106, 0.22);\n  border-radius: 999px;\n  background: #f4f8ff;\n  color: #234066;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 700;\n  padding: 0.3rem 0.58rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  cursor: pointer;\n  transition:\n    background-color 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.popup-panel-profile-selector .profile-selector-chip.active {\n  border-color: rgba(27, 85, 158, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #dcebff 0%,\n      #cfe3ff 100%);\n  color: #123e70;\n  box-shadow: inset 0 0 0 1px rgba(30, 73, 127, 0.24), 0 1px 2px rgba(24, 53, 86, 0.16);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-family {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 232, 219, 0.52) 0%,\n      rgba(255, 232, 219, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-ambition {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 242, 216, 0.52) 0%,\n      rgba(255, 242, 216, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-lifestyle {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(221, 241, 239, 0.56) 0%,\n      rgba(221, 241, 239, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-beliefs {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-social {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(223, 236, 255, 0.5) 0%,\n      rgba(223, 236, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-arts {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(235, 227, 255, 0.5) 0%,\n      rgba(235, 227, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-food {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 236, 221, 0.52) 0%,\n      rgba(255, 236, 221, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-active {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(222, 243, 231, 0.56) 0%,\n      rgba(222, 243, 231, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-mind {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(219, 242, 238, 0.56) 0%,\n      rgba(219, 242, 238, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-identity {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-family {\n  border-color: rgba(156, 94, 51, 0.34);\n  color: #9c5e33;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-ambition {\n  border-color: rgba(160, 106, 20, 0.34);\n  color: #9b6717;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-lifestyle {\n  border-color: rgba(47, 123, 119, 0.34);\n  color: #2f7b77;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-beliefs {\n  border-color: rgba(95, 78, 160, 0.34);\n  color: #5f4ea0;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-social {\n  border-color: rgba(47, 106, 175, 0.36);\n  color: #2f6aaf;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-arts {\n  border-color: rgba(106, 87, 168, 0.36);\n  color: #6a57a8;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-food {\n  border-color: rgba(170, 97, 28, 0.34);\n  color: #a55e18;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-active {\n  border-color: rgba(49, 124, 82, 0.36);\n  color: #317c52;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-mind {\n  border-color: rgba(37, 124, 118, 0.34);\n  color: #2b7c76;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-identity {\n  border-color: rgba(98, 84, 163, 0.34);\n  color: #6254a3;\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-family {\n  background: rgba(156, 94, 51, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-ambition {\n  background: rgba(160, 106, 20, 0.32);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-lifestyle {\n  background: rgba(47, 123, 119, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-beliefs {\n  background: rgba(95, 78, 160, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-social {\n  background: rgba(47, 106, 175, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-arts {\n  background: rgba(106, 87, 168, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-food {\n  background: rgba(170, 97, 28, 0.32);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-active {\n  background: rgba(49, 124, 82, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-mind {\n  background: rgba(37, 124, 118, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-identity {\n  background: rgba(98, 84, 163, 0.3);\n}\n:host ::ng-deep .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.status-option) {\n  background: #f0f5fc;\n}\n:host ::ng-deep .mat-mdc-option.status-option.mdc-list-item--selected:not(.mdc-list-item--disabled) {\n  filter: brightness(0.95);\n  box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.2);\n}\n:host ::ng-deep .mat-mdc-option.status-option {\n  background: #fff;\n}\n:host ::ng-deep .mat-mdc-option.status-option:not(:last-child) {\n  border-bottom: 1px solid #e6edf7;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.hide-selected-option,\n:host ::ng-deep .status-options-panel .mat-mdc-option.hide-selected-option {\n  min-height: 0 !important;\n  height: 0 !important;\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  border: 0 !important;\n  margin: 0 !important;\n  opacity: 0 !important;\n  pointer-events: none !important;\n  overflow: hidden !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option {\n  background: #fff;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel {\n  margin-top: 8px !important;\n  margin-bottom: 8px !important;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .cdk-overlay-pane .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .cdk-overlay-pane .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above {\n  margin-top: 0 !important;\n  margin-bottom: 18px !important;\n  transform: translateY(-10px) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public {\n  --mdc-list-list-item-container-color: #def3e9;\n  --mat-mdc-option-selected-container-color: #def3e9;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #def3e9) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends {\n  --mdc-list-list-item-container-color: #e3eefb;\n  --mat-mdc-option-selected-container-color: #e3eefb;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e3eefb) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host {\n  --mdc-list-list-item-container-color: #f3ead8;\n  --mat-mdc-option-selected-container-color: #f3ead8;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3ead8) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive {\n  --mdc-list-list-item-container-color: #eceff3;\n  --mat-mdc-option-selected-container-color: #eceff3;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eceff3) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon {\n  color: #2f8f66 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon {\n  color: #1b57a1 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon {\n  color: #87580f !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon {\n  color: #5b6573 !important;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-slim {\n  background: #eaf4ff;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-lean {\n  background: #edf8f4;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-athletic {\n  background: #e8f5ec;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-fit {\n  background: #f1f2ff;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-curvy {\n  background: #fff2f8;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-muscular {\n  background: #fbf4ea;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-average {\n  background: #eff4f9;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-slim .status-option-content {\n  color: #3f7ab3;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-lean .status-option-content {\n  color: #3f8f5f;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-athletic .status-option-content {\n  color: #2f7e4d;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-fit .status-option-content {\n  color: #465fbb;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-curvy .status-option-content {\n  color: #a14875;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-muscular .status-option-content {\n  color: #7d4f24;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-average .status-option-content {\n  color: #4d667f;\n}\n:host ::ng-deep .mat-mdc-select-panel.physique-options-panel {\n  width: auto !important;\n  max-width: 220px !important;\n  min-width: 0 !important;\n}\n:host ::ng-deep .physique-options-panel .mat-mdc-option {\n  padding-right: 8px;\n}\n:host ::ng-deep .physique-options-panel .mat-mdc-option .mat-pseudo-checkbox {\n  margin-left: 4px;\n}\n@media (max-width: 760px) {\n  .experience-form-grid {\n    grid-template-columns: 1fr;\n    max-width: none;\n    justify-content: stretch;\n    row-gap: 0.72rem;\n  }\n  .experience-date-range-label {\n    grid-column: 1/-1;\n  }\n  .experience-date-range-field .mat-date-range-input-container {\n    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);\n  }\n  .profile-details-privacy-fab .privacy-fab-actions {\n    position: fixed;\n    left: 0.5rem;\n    right: 0.5rem;\n    bottom: max(0.5rem, env(safe-area-inset-bottom));\n    top: auto;\n    transform: translateY(12px) scale(0.98);\n    transform-origin: bottom center;\n    justify-content: center;\n    gap: 0.46rem;\n    padding: 0.46rem 0.56rem;\n    border: 1px solid rgba(42, 68, 102, 0.2);\n    border-radius: 14px;\n    background: #fff;\n    box-shadow: 0 -12px 24px rgba(18, 31, 51, 0.22);\n  }\n  .profile-details-privacy-fab.open .privacy-fab-actions {\n    transform: translateY(0) scale(1);\n  }\n}\n:host {\n  display: contents;\n}\n.notifications-tabs,\n.notification-channel-grid,\n.notification-rule-side,\n.notification-detail-kicker,\n.notification-run-card {\n  display: inline-flex;\n  align-items: center;\n}\n.notification-primary-btn {\n  min-height: 34px;\n  border: 1px solid rgba(35, 96, 160, 0.42);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #e5f2ff 0%,\n      #c9dff8 100%);\n  color: #174d86;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.34rem;\n  padding: 0 0.78rem;\n  font: inherit;\n  font-size: 0.76rem;\n  font-weight: 900;\n  cursor: pointer;\n}\n.notification-primary-btn:disabled {\n  opacity: 0.5;\n  cursor: default;\n}\n.notification-primary-btn.is-saved {\n  border-color: rgba(45, 135, 83, 0.42);\n  background:\n    linear-gradient(\n      180deg,\n      #e6f8ed 0%,\n      #c8efd8 100%);\n  color: #287345;\n}\n.notification-primary-btn .mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n.notifications-body {\n  min-height: 0;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  gap: 0.58rem;\n}\n.notifications-state,\n.notifications-error {\n  min-height: 88px;\n  border: 1px solid rgba(42, 81, 129, 0.14);\n  border-radius: 8px;\n  background: #f7faff;\n  color: rgba(34, 55, 84, 0.78);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.42rem;\n  font-size: 0.84rem;\n  font-weight: 900;\n}\n.notifications-state-small {\n  min-height: 64px;\n}\n.notifications-loading-state {\n  min-height: 280px;\n  display: grid;\n  place-items: center;\n  align-content: center;\n  gap: 0.42rem;\n  text-align: center;\n}\n.notifications-error {\n  min-height: 42px;\n  justify-content: flex-start;\n  padding: 0 0.72rem;\n  background: #fff4f5;\n  border-color: rgba(184, 70, 88, 0.22);\n  color: #9b3345;\n}\n.notifications-tabs {\n  gap: 0.34rem;\n  flex-wrap: wrap;\n}\n.notifications-tab {\n  min-height: 34px;\n  border: 1px solid rgba(42, 81, 129, 0.16);\n  border-radius: 999px;\n  background: #fff;\n  color: #315170;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.32rem;\n  padding: 0 0.68rem;\n  font: inherit;\n  font-size: 0.76rem;\n  font-weight: 900;\n  cursor: pointer;\n}\n.notifications-tab.is-active {\n  background: #e8f2ff;\n  border-color: rgba(45, 105, 169, 0.34);\n  color: #174d86;\n}\n.notifications-tab .mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n.process-tabs {\n  display: flex;\n  align-items: center;\n  gap: 0.42rem;\n  flex-wrap: wrap;\n}\n.process-list-card {\n  flex: 1 1 auto;\n  min-height: 0;\n  border: 1px solid rgba(23, 33, 54, 0.12);\n  border-radius: 8px;\n  background: #fbfdff;\n  padding: 0.58rem;\n  display: flex;\n  flex-direction: column;\n  gap: 0.28rem;\n  overflow: hidden;\n}\n.process-list-toolbar {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  margin-bottom: 0.46rem;\n}\n.process-list-smart-list {\n  flex: 1 1 auto;\n  min-width: 0;\n  min-height: 0;\n}\n:host ::ng-deep .process-list-smart-list .smart-list__stage {\n  top: 0;\n}\n:host ::ng-deep .process-list-smart-list .smart-list.admin-job-process-list {\n  gap: 0.28rem;\n  padding-right: 0.1rem;\n}\n:host ::ng-deep .process-list-smart-list .smart-list__item-shell {\n  min-width: 0;\n}\n.process-list-row {\n  display: grid;\n  grid-template-columns: minmax(220px, 1fr) minmax(92px, 0.38fr) minmax(104px, 0.42fr) minmax(72px, 0.28fr) minmax(124px, auto);\n  gap: 0.38rem;\n  align-items: center;\n  min-height: 48px;\n  border-radius: 8px;\n  padding: 0.38rem 0.52rem;\n  color: #213a5d;\n  font-size: 0.76rem;\n  font-weight: 850;\n}\n.process-list-row:not(.process-list-head) {\n  border: 1px solid rgba(42, 81, 129, 0.1);\n  background: #fff;\n}\n.process-list-row.is-suspended:not(.process-list-head) {\n  border-color: rgba(197, 79, 30, 0.22);\n  background: #fff8f5;\n}\n.process-list-row.is-failed:not(.process-list-head),\n.process-list-row.is-missed:not(.process-list-head) {\n  border-color: rgba(190, 52, 72, 0.24);\n  background: #fff6f7;\n}\n.process-list-head {\n  min-height: 34px;\n  color: rgba(31, 55, 86, 0.62);\n  font-size: 0.68rem;\n  font-weight: 900;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n}\n.process-list-name {\n  min-width: 0;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.52rem;\n}\n.process-list-name > span:last-child {\n  min-width: 0;\n  display: grid;\n  gap: 0.12rem;\n}\n.process-list-name strong,\n.process-list-name small,\n.process-list-windows {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.process-list-name strong {\n  color: #1f3658;\n  font-size: 0.82rem;\n  font-weight: 900;\n}\n.process-list-name small,\n.process-list-windows {\n  color: rgba(31, 55, 86, 0.62);\n  font-size: 0.7rem;\n  font-weight: 850;\n}\n.process-list-icon {\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  background: #eef8f7;\n  color: #23756f;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex: 0 0 auto;\n}\n.process-list-icon.is-suspended {\n  background: #fff1e9;\n  color: #a13d18;\n}\n.process-list-icon.is-failed,\n.process-list-icon.is-missed {\n  background: #ffe1e5;\n  color: #a5293a;\n}\n.process-list-icon .mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n}\n.process-list-actions {\n  display: grid;\n  justify-items: end;\n  align-items: center;\n  gap: 0.2rem;\n}\n.process-list-action-buttons {\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.3rem;\n}\n.process-list-live-progress {\n  grid-column: 1/-1;\n  width: 100%;\n  height: 5px;\n  border-radius: 999px;\n  background: rgba(45, 81, 125, 0.14);\n  overflow: hidden;\n}\n.process-list-live-progress span {\n  height: 100%;\n  border-radius: inherit;\n  background:\n    linear-gradient(\n      90deg,\n      #2f75bc 0%,\n      #75c893 100%);\n  display: block;\n  transition: width 180ms ease;\n}\n.process-icon-btn {\n  position: relative;\n  width: 30px;\n  height: 30px;\n  border: 1px solid rgba(42, 81, 129, 0.16);\n  border-radius: 50%;\n  background: #f7faff;\n  color: #315170;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  cursor: pointer;\n}\n.process-icon-ring-shell {\n  position: relative;\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.process-icon-ring-shell.is-loading .process-icon-btn,\n.process-icon-ring-shell.is-loading .process-icon-btn:disabled {\n  border-color: rgba(181, 117, 23, 0.72);\n  background:\n    linear-gradient(\n      180deg,\n      #ffe7bf 0%,\n      #ffd085 100%);\n  color: #8e4f0d;\n  opacity: 1;\n  cursor: wait;\n}\n.process-icon-btn.is-suspended {\n  border-color: rgba(45, 135, 83, 0.72);\n  background: #2f8b5b;\n  color: #fff;\n}\n.process-icon-btn-primary {\n  border-color: rgba(35, 96, 160, 0.46);\n  background: #e8f2ff;\n  color: #174d86;\n}\n.process-icon-btn-parameters {\n  border-color: rgba(27, 134, 109, 0.34);\n  background: #edf9f5;\n  color: #18745e;\n}\n.process-icon-btn-primary.is-running,\n.process-icon-btn-primary.is-running:disabled {\n  border-color: rgba(32, 136, 130, 0.62);\n  background:\n    linear-gradient(\n      180deg,\n      #d7f5ef 0%,\n      #a9dfd3 100%);\n  color: #12645e;\n  opacity: 1;\n  cursor: wait;\n}\n.process-icon-btn:disabled {\n  opacity: 0.48;\n  cursor: default;\n}\n.process-icon-btn .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.process-list-empty {\n  min-height: 84px;\n  border-radius: 8px;\n  background: #f8fbff;\n  color: rgba(31, 55, 86, 0.62);\n  display: grid;\n  place-items: center;\n  font-size: 0.82rem;\n  font-weight: 900;\n}\n.process-tab {\n  min-height: 38px;\n  border: 1px solid rgba(42, 81, 129, 0.16);\n  border-radius: 999px;\n  background: #fff;\n  color: #315170;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n  padding: 0 0.58rem 0 0.72rem;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 900;\n  cursor: pointer;\n}\n.process-tab.is-active {\n  background: #e8f2ff;\n  border-color: rgba(45, 105, 169, 0.34);\n  color: #174d86;\n}\n.process-tab.is-active.is-suspended {\n  background: #fff1e9;\n  border-color: rgba(197, 79, 30, 0.48);\n  color: #a13d18;\n  box-shadow: inset 0 0 0 1px rgba(197, 79, 30, 0.12);\n}\n.process-tab.is-active.is-issue {\n  background: #fff0f2;\n  border-color: rgba(190, 52, 72, 0.52);\n  color: #a5293a;\n  box-shadow: inset 0 0 0 1px rgba(190, 52, 72, 0.14);\n}\n.process-tab.is-active.is-failed,\n.process-tab.is-active.is-missed {\n  background: #fff0f2;\n  border-color: rgba(190, 52, 72, 0.58);\n  color: #9f1f33;\n  box-shadow: inset 0 0 0 1px rgba(190, 52, 72, 0.16);\n}\n.process-tab.is-suspended:not(.is-active) {\n  border-color: rgba(197, 79, 30, 0.34);\n  background: #fff6f0;\n  color: #a13d18;\n}\n.process-tab.is-issue:not(.is-active) {\n  border-color: rgba(190, 52, 72, 0.36);\n  background: #fff5f6;\n  color: #a5293a;\n}\n.process-tab.is-failed:not(.is-active),\n.process-tab.is-missed:not(.is-active) {\n  border-color: rgba(190, 52, 72, 0.42);\n  background: #fff5f6;\n  color: #9f1f33;\n}\n.process-tab .mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n.process-tab-badge,\n.process-status-pill {\n  min-height: 22px;\n  border-radius: 999px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0 0.52rem;\n  font-size: 0.66rem;\n  font-weight: 900;\n}\n.process-tab-badge {\n  background: #eef1f5;\n  color: #657084;\n}\n.process-status-pill {\n  border: 1px solid rgba(101, 112, 132, 0.18);\n  background: #eef1f5;\n  color: #657084;\n}\n.process-status-pill.is-ready,\n.process-tab.is-ready .process-tab-badge {\n  background: #e6f8ed;\n  color: #287345;\n}\n.process-status-pill.is-running,\n.process-tab.is-running .process-tab-badge {\n  background: #e8f2ff;\n  color: #174d86;\n}\n.process-status-pill.is-suspended,\n.process-tab.is-suspended .process-tab-badge {\n  border: 1px solid rgba(166, 61, 20, 0.38);\n  background: #c7501f;\n  color: #fff;\n}\n.process-status-pill.is-issue,\n.process-status-pill.is-failed,\n.process-status-pill.is-missed,\n.process-tab.is-issue .process-tab-badge,\n.process-tab.is-failed .process-tab-badge,\n.process-tab.is-missed .process-tab-badge {\n  border: 1px solid rgba(165, 41, 58, 0.34);\n  background: #bf3148;\n  color: #fff;\n}\n.process-console {\n  flex: 1 1 auto;\n  min-height: 0;\n  border: 1px solid rgba(23, 33, 54, 0.12);\n  border-radius: 8px;\n  background: #fbfdff;\n  padding: 0.72rem;\n  overflow: hidden;\n}\n.process-detail-scroll {\n  min-height: 0;\n  height: 100%;\n  overflow-y: auto;\n  overflow-x: hidden;\n  margin: 0;\n  padding: 0.72rem;\n}\n.process-console.is-suspended {\n  border-color: rgba(197, 79, 30, 0.24);\n  background: #fff8f5;\n}\n.process-console.is-issue {\n  border-color: rgba(190, 52, 72, 0.28);\n  background: #fff6f7;\n}\n.process-console.is-failed,\n.process-console.is-missed {\n  border-color: rgba(190, 52, 72, 0.3);\n  background: #fff6f7;\n}\n.process-hero {\n  border: 1px solid rgba(42, 81, 129, 0.14);\n  border-radius: 8px;\n  background:\n    linear-gradient(\n      180deg,\n      #f7fbff 0%,\n      #edf6ff 100%);\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  gap: 0.82rem;\n  padding: 0.82rem;\n}\n.process-console.is-suspended .process-hero {\n  border-color: rgba(197, 79, 30, 0.2);\n  background:\n    linear-gradient(\n      180deg,\n      #fff6ef 0%,\n      #ffeadf 100%);\n}\n.process-console.is-issue .process-hero {\n  border-color: rgba(190, 52, 72, 0.24);\n  background:\n    linear-gradient(\n      180deg,\n      #fff5f6 0%,\n      #ffe2e7 100%);\n}\n.process-console.is-failed .process-hero,\n.process-console.is-missed .process-hero {\n  border-color: rgba(190, 52, 72, 0.28);\n  background:\n    linear-gradient(\n      180deg,\n      #fff4f6 0%,\n      #ffdde4 100%);\n}\n.process-hero h3 {\n  margin: 0.22rem 0 0;\n  color: #1f3658;\n  font-size: 1.25rem;\n  font-weight: 900;\n}\n.process-hero p,\n.process-card p {\n  margin: 0.32rem 0 0;\n  color: rgba(31, 55, 86, 0.72);\n  font-size: 0.84rem;\n  font-weight: 800;\n  line-height: 1.42;\n}\n.process-actions {\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.42rem;\n  flex-wrap: wrap;\n}\n.process-soft-btn {\n  position: relative;\n  min-height: 34px;\n  border: 1px solid rgba(42, 81, 129, 0.16);\n  border-radius: 999px;\n  background: #fff;\n  color: #315170;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.34rem;\n  padding: 0 0.72rem;\n  font: inherit;\n  font-size: 0.76rem;\n  font-weight: 900;\n  cursor: pointer;\n}\n.process-soft-btn.is-suspended {\n  border-color: rgba(45, 135, 83, 0.3);\n  background: #f1fbf5;\n  color: #287345;\n}\n.process-soft-btn .mat-icon,\n.process-start-btn .mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n.process-grid {\n  margin-top: 0.72rem;\n  display: grid;\n  grid-template-columns: minmax(0, 1.1fr) minmax(220px, 0.58fr);\n  gap: 0.62rem;\n}\n.process-card {\n  min-width: 0;\n  border: 1px solid rgba(42, 81, 129, 0.14);\n  border-radius: 8px;\n  background: #fff;\n  padding: 0.72rem;\n  display: grid;\n  gap: 0.5rem;\n}\n.process-card-wide {\n  grid-row: span 2;\n}\n.process-card-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.52rem;\n}\n.process-card h3 {\n  margin: 0;\n  color: rgba(31, 55, 86, 0.72);\n  font-size: 0.72rem;\n  font-weight: 900;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n}\n.process-frequency {\n  position: relative;\n  min-height: 32px;\n  border: 1px solid rgba(196, 144, 38, 0.32);\n  border-radius: 999px;\n  background: #fff7df;\n  color: #835d14;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n  padding: 0 0.4rem;\n  font: inherit;\n  font-size: 0.74rem;\n  font-weight: 900;\n  cursor: pointer;\n}\n.process-icon-btn.has-dirty::after,\n.process-soft-btn.has-dirty::after,\n.process-frequency.has-dirty::after {\n  content: "";\n  position: absolute;\n  top: -2px;\n  right: -2px;\n  width: 7px;\n  height: 7px;\n  border: 2px solid #fff;\n  border-radius: 50%;\n  background: #d42e3d;\n}\n.process-frequency .mat-icon {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n  line-height: 15px;\n}\n.process-cron {\n  display: grid;\n  gap: 0.3rem;\n  overflow: hidden;\n}\n.process-cron span,\n.process-progress,\n.process-last-run-stats {\n  color: rgba(31, 55, 86, 0.62);\n  font-size: 0.72rem;\n  font-weight: 900;\n}\n.process-cron code {\n  min-width: 0;\n  border-radius: 8px;\n  background: #f1f6ff;\n  color: #2e5d94;\n  padding: 0.42rem 0.52rem;\n  font-size: 0.78rem;\n  font-weight: 900;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.process-progress,\n.process-last-run-stats {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.52rem;\n}\n.process-progress-bar {\n  height: 8px;\n  border-radius: 999px;\n  background: #e5edf7;\n  overflow: hidden;\n}\n.process-progress-bar span {\n  height: 100%;\n  border-radius: inherit;\n  background:\n    linear-gradient(\n      90deg,\n      #2f75bc 0%,\n      #75c893 100%);\n  display: block;\n  transition: width 180ms ease;\n}\n.process-console.is-suspended .process-progress-bar span {\n  background:\n    linear-gradient(\n      90deg,\n      #c85a2a 0%,\n      #f0a444 100%);\n}\n.process-console.is-issue .process-progress-bar span {\n  background:\n    linear-gradient(\n      90deg,\n      #c63d54 0%,\n      #ef7b8b 100%);\n}\n.process-console.is-failed .process-progress-bar span,\n.process-console.is-missed .process-progress-bar span {\n  background:\n    linear-gradient(\n      90deg,\n      #b92d43 0%,\n      #ef6f82 100%);\n}\n.process-last-run {\n  display: grid;\n  gap: 0.16rem;\n}\n.process-last-run strong {\n  color: #1f3658;\n  font-size: 0.92rem;\n  font-weight: 900;\n}\n.process-last-run span {\n  color: rgba(31, 55, 86, 0.68);\n  font-size: 0.78rem;\n  font-weight: 800;\n}\n.process-history-card {\n  margin-top: 0.72rem;\n}\n.process-history-table {\n  display: grid;\n  gap: 0.24rem;\n}\n.process-history-row {\n  display: grid;\n  grid-template-columns: 1.1fr 0.58fr 0.52fr 0.58fr minmax(0, 1.4fr);\n  gap: 0.46rem;\n  align-items: center;\n  min-height: 34px;\n  border-radius: 8px;\n  padding: 0 0.42rem;\n  color: #233a5b;\n  font-size: 0.74rem;\n  font-weight: 800;\n}\n.process-history-row:not(.process-history-head) {\n  background: #f8fbff;\n}\n.process-history-row span {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.process-history-head {\n  color: rgba(31, 55, 86, 0.62);\n  font-size: 0.68rem;\n  font-weight: 900;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n}\n.process-history-empty {\n  min-height: 48px;\n  border-radius: 8px;\n  background: #f8fbff;\n  color: rgba(31, 55, 86, 0.62);\n  display: grid;\n  place-items: center;\n  font-size: 0.78rem;\n  font-weight: 900;\n}\n.notifications-layout {\n  flex: 1 1 auto;\n  min-height: 0;\n  display: grid;\n  grid-template-columns: minmax(280px, 0.78fr) minmax(0, 1fr);\n  gap: 0.58rem;\n}\n.notifications-list,\n.notification-detail {\n  min-height: 0;\n  border: 1px solid rgba(23, 33, 54, 0.12);\n  border-radius: 8px;\n  background: #fbfdff;\n  overflow: hidden;\n}\n.run-window-row-head,\n.run-window-actions {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.6rem;\n}\n.run-window-readable {\n  margin: 0.16rem 0 0;\n  color: rgba(31, 55, 86, 0.66);\n  font-size: 0.76rem;\n  font-weight: 800;\n}\n.run-window-list {\n  min-height: 0;\n  max-height: min(540px, 100vh - 8rem);\n  overflow-y: auto;\n  overflow-x: hidden;\n  display: grid;\n  gap: 0.56rem;\n}\n.run-window-row {\n  min-width: 0;\n  border: 1px solid rgba(42, 81, 129, 0.14);\n  border-radius: 8px;\n  background: #fbfdff;\n  padding: 0.66rem;\n  display: grid;\n  gap: 0.52rem;\n}\n.run-window-row strong {\n  min-width: 0;\n  color: #1f3658;\n  font-size: 0.82rem;\n  font-weight: 900;\n}\n.job-timing-form-flow {\n  display: block;\n  min-width: 0;\n  --form-flow-input-height: 38px;\n}\n.job-timing-editor {\n  min-width: 0;\n  display: grid;\n  overflow: visible;\n}\n:host ::ng-deep .job-timing-form-flow .form-flow--grouped .form-flow__body {\n  padding: 0;\n}\n:host ::ng-deep .job-timing-form-flow .form-flow__control {\n  min-width: 0;\n}\n.run-window-row-tools {\n  min-width: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.42rem;\n}\n.run-window-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.5rem;\n}\n.run-window-grid-timing {\n  grid-template-columns: 1fr;\n}\n.run-window-grid label {\n  min-width: 0;\n  display: grid;\n  gap: 0.22rem;\n}\n.run-window-grid span {\n  color: rgba(31, 55, 86, 0.62);\n  font-size: 0.68rem;\n  font-weight: 900;\n  text-transform: uppercase;\n}\n.run-window-grid input,\n.run-window-grid select {\n  width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n  min-height: 34px;\n  border: 1px solid rgba(42, 81, 129, 0.16);\n  border-radius: 8px;\n  background: #fff;\n  color: #213a5d;\n  font: inherit;\n  font-size: 0.8rem;\n  font-weight: 800;\n  padding: 0 0.48rem;\n}\n.run-window-interval-input {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(126px, 0.6fr);\n  align-items: center;\n  gap: 0.44rem;\n}\n.run-window-interval-input span {\n  color: rgba(31, 55, 86, 0.66);\n  text-transform: none;\n}\n.run-window-actions-interval {\n  justify-content: flex-end;\n}\n.job-parameters-grid {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n.run-window-row-tools code {\n  min-width: 0;\n  max-width: min(260px, 42vw);\n  border-radius: 8px;\n  background: #f1f6ff;\n  color: #2e5d94;\n  padding: 0.34rem 0.46rem;\n  font-size: 0.72rem;\n  font-weight: 900;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.notifications-list {\n  padding: 0.54rem;\n  display: grid;\n  align-content: start;\n  gap: 0.42rem;\n  overflow-y: auto;\n}\n.notification-rule-row {\n  width: 100%;\n  border: 1px solid rgba(33, 51, 78, 0.14);\n  border-radius: 8px;\n  background: #fff;\n  padding: 0.56rem;\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  gap: 0.52rem;\n  align-items: center;\n  color: #22324a;\n  font: inherit;\n  text-align: left;\n  cursor: pointer;\n}\n.notification-rule-row.is-selected {\n  border-color: rgba(45, 105, 169, 0.38);\n  background: #eef6ff;\n}\n.notification-rule-row.is-disabled-rule {\n  opacity: 0.72;\n}\n.notification-rule-icon {\n  width: 34px;\n  height: 34px;\n  border-radius: 50%;\n  background: #edf7f5;\n  color: #25756f;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.notification-rule-icon .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.notification-rule-main {\n  min-width: 0;\n  display: grid;\n  gap: 0.12rem;\n}\n.notification-rule-title,\n.notification-rule-meta,\n.notification-run-main,\n.notification-run-sub {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.notification-rule-title {\n  color: #1f3658;\n  font-size: 0.84rem;\n  font-weight: 900;\n}\n.notification-rule-meta {\n  color: rgba(20, 36, 58, 0.62);\n  font-size: 0.72rem;\n  font-weight: 800;\n}\n.notification-rule-side {\n  gap: 0.3rem;\n  justify-content: flex-end;\n}\n.notification-status-pill {\n  min-width: 44px;\n  height: 22px;\n  border-radius: 999px;\n  background: #eef1f5;\n  color: #657084;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0 0.46rem;\n  font-size: 0.66rem;\n  font-weight: 900;\n}\n.notification-status-pill.is-on {\n  background: #e6f8ed;\n  color: #287345;\n}\n.notification-run-mini {\n  width: 28px;\n  height: 28px;\n  border: 1px solid rgba(35, 96, 160, 0.22);\n  border-radius: 50%;\n  background: #f7faff;\n  color: #2f5f98;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  cursor: pointer;\n}\n.notification-run-mini:disabled {\n  opacity: 0.52;\n  cursor: default;\n}\n.notification-run-mini .mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n.notification-detail {\n  padding: 0.72rem;\n  overflow-y: auto;\n}\n.notification-detail.is-disabled-rule {\n  background: #f9fbfe;\n}\n.notification-detail-head {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  gap: 0.62rem;\n  align-items: start;\n}\n.notification-detail-kicker {\n  gap: 0.28rem;\n  color: rgba(33, 62, 98, 0.68);\n  font-size: 0.72rem;\n  font-weight: 900;\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n}\n.notification-detail-kicker .mat-icon {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n  line-height: 15px;\n}\n.notification-title-input {\n  width: 100%;\n  min-width: 0;\n  margin-top: 0.22rem;\n  border: 0;\n  border-bottom: 1px solid rgba(32, 59, 94, 0.16);\n  background: transparent;\n  color: #1f3658;\n  font: inherit;\n  font-size: 1.18rem;\n  font-weight: 900;\n  outline: 0;\n}\n.notification-switch {\n  position: relative;\n  width: 48px;\n  height: 28px;\n  border-radius: 999px;\n  background: #dce2eb;\n  cursor: pointer;\n}\n.notification-switch input {\n  position: absolute;\n  opacity: 0;\n  inset: 0;\n}\n.notification-switch span {\n  position: absolute;\n  top: 4px;\n  left: 4px;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  background: #fff;\n  box-shadow: 0 2px 8px rgba(14, 30, 52, 0.22);\n  transition: transform 0.16s ease;\n}\n.notification-switch.is-on {\n  background: #76c893;\n}\n.notification-switch.is-on span {\n  transform: translateX(20px);\n}\n.notification-detail-grid,\n.notification-timing-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.52rem;\n}\n.notification-timing-grid {\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n}\n.notification-field {\n  min-width: 0;\n  display: grid;\n  gap: 0.24rem;\n}\n.notification-field-wide {\n  grid-column: 1/-1;\n}\n.notification-field span,\n.notification-section h3 {\n  color: rgba(31, 55, 86, 0.7);\n  font-size: 0.7rem;\n  font-weight: 900;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n}\n.notification-field input,\n.notification-field textarea,\n.notification-field select {\n  width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n  border: 1px solid rgba(42, 81, 129, 0.14);\n  border-radius: 8px;\n  background: #fff;\n  color: #22324a;\n  padding: 0.58rem 0.62rem;\n  font: inherit;\n  font-size: 0.82rem;\n  font-weight: 800;\n  outline: 0;\n}\n.notification-field textarea {\n  resize: vertical;\n}\n.notification-section {\n  margin-top: 0.82rem;\n  display: grid;\n  gap: 0.48rem;\n}\n.notification-section h3 {\n  margin: 0;\n}\n.notification-channel-grid {\n  gap: 0.42rem;\n  flex-wrap: wrap;\n}\n.notification-channel {\n  min-height: 38px;\n  border: 1px solid rgba(42, 81, 129, 0.14);\n  border-radius: 8px;\n  background: #fff;\n  color: #425a76;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.32rem;\n  padding: 0 0.62rem;\n  font-size: 0.78rem;\n  font-weight: 900;\n  cursor: pointer;\n}\n.notification-channel input {\n  position: absolute;\n  opacity: 0;\n  pointer-events: none;\n}\n.notification-channel.is-on {\n  border-color: rgba(45, 135, 113, 0.34);\n  background: #ecfaf6;\n  color: #1f7467;\n}\n.notification-channel .mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n.notification-run-card {\n  width: 100%;\n  min-width: 0;\n  justify-content: space-between;\n  gap: 0.58rem;\n  border: 1px solid rgba(42, 81, 129, 0.14);\n  border-radius: 8px;\n  background: #fff;\n  padding: 0.62rem;\n  box-sizing: border-box;\n}\n.notification-run-card > div {\n  min-width: 0;\n  display: grid;\n  gap: 0.12rem;\n}\n.notification-run-main {\n  color: #1f3658;\n  font-size: 0.84rem;\n  font-weight: 900;\n}\n.notification-run-sub {\n  color: rgba(31, 55, 86, 0.62);\n  font-size: 0.72rem;\n  font-weight: 800;\n}\n.notification-run-count {\n  min-width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  background: #f1f6ff;\n  color: #2e5d94;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.8rem;\n  font-weight: 900;\n}\n.notification-run-btn {\n  flex: 0 0 auto;\n}\n@media (max-width: 760px) {\n  .process-list-card {\n    overflow-x: hidden;\n  }\n  .process-list-head {\n    display: none;\n  }\n  .process-list-row {\n    grid-template-columns: minmax(0, 1fr) auto;\n    column-gap: 0.42rem;\n    row-gap: 0;\n    align-items: start;\n    padding: 0.64rem;\n  }\n  .process-list-row > span:nth-child(3),\n  .process-list-row > span:nth-child(4) {\n    display: none;\n  }\n  .process-list-row > span:nth-child(2) {\n    justify-self: end;\n  }\n  .process-list-actions {\n    grid-column: 2;\n    justify-content: flex-end;\n    justify-items: end;\n    gap: 0.12rem;\n    margin-top: -0.22rem;\n  }\n  .process-list-action-buttons {\n    gap: 0.24rem;\n  }\n  .process-list-live-progress {\n    grid-column: 1/-1;\n    width: 100%;\n  }\n  .notifications-layout {\n    grid-template-columns: 1fr;\n  }\n  .notifications-list {\n    max-height: 30vh;\n  }\n  .notification-detail-grid,\n  .notification-timing-grid {\n    grid-template-columns: 1fr;\n  }\n  .process-hero,\n  .process-grid {\n    grid-template-columns: 1fr;\n  }\n  .process-actions {\n    justify-content: flex-start;\n  }\n  .run-window-grid,\n  .job-parameters-grid {\n    grid-template-columns: 1fr;\n  }\n  .process-card-wide {\n    grid-row: auto;\n  }\n  .process-history-row {\n    grid-template-columns: 1fr 0.5fr 0.45fr;\n  }\n  .process-history-row span:nth-child(4),\n  .process-history-row span:nth-child(5) {\n    display: none;\n  }\n  .notification-run-card {\n    display: grid;\n    grid-template-columns: minmax(0, 1fr) auto;\n  }\n  .notification-run-btn {\n    grid-column: 1/-1;\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=admin-notifications-popup.component.css.map */\n'] }]
  }], () => [], { processSmartList: [{
    type: ViewChild,
    args: ["processSmartList"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminNotificationsPopupComponent, { className: "AdminNotificationsPopupComponent", filePath: "app/admin/components/notifications-popup/admin-notifications-popup.component.ts", lineNumber: 465 });
})();
export {
  AdminNotificationsPopupComponent
};
//# sourceMappingURL=admin-notifications-popup.component-HIERHJ74.js.map
