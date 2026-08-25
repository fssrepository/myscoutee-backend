import {
  OperatorWorkspaceStore
} from "./chunk-SXRJM5Q3.js";
import {
  OperatorMenuStore,
  OperatorRegistryStore
} from "./chunk-HJS66YQ3.js";
import "./chunk-SYKOEE4K.js";
import {
  SmartListComponent
} from "./chunk-IJVUZ62I.js";
import {
  LinkInputComponent
} from "./chunk-H3IGIWEC.js";
import "./chunk-BEAS7CFC.js";
import "./chunk-YTMD6HU4.js";
import "./chunk-QEZI4ZBE.js";
import {
  PopupComponent
} from "./chunk-3VXLUVWM.js";
import "./chunk-VEYRCVMX.js";
import "./chunk-MVR37RGJ.js";
import {
  AppMenuComponent,
  FormsModule,
  I18nPipe,
  IndicatorComponent,
  NgControlStatus,
  NgModel
} from "./chunk-FOAFZS65.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-EDHGCWPF.js";
import "./chunk-CUDLB52K.js";
import "./chunk-3E7FCXD6.js";
import "./chunk-AKR4UUHK.js";
import "./chunk-FJQMGJUW.js";
import "./chunk-HUL5TV72.js";
import "./chunk-PK4DOAMC.js";
import {
  normalizeOperatorRegistryBaseUrl,
  validateOperatorRegistryBaseUrl
} from "./chunk-GEAUBJJD.js";
import "./chunk-5PHTFUHA.js";
import "./chunk-F4WY6ECV.js";
import {
  I18nService
} from "./chunk-Q3344WPR.js";
import "./chunk-XQ4NDAVX.js";
import "./chunk-4FWVIYNI.js";
import "./chunk-7MTG4XZU.js";
import "./chunk-J7IJFFQ2.js";
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
  Component,
  ViewChild,
  computed,
  from,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate4,
  ɵɵviewQuery
} from "./chunk-XJL7SWH7.js";

// src/app/operator/components/operator-registry-popup/operator-registry-popup.component.ts
var _c0 = ["measurementReportsSmartList"];
function OperatorRegistryPopupComponent_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4);
    \u0275\u0275element(1, "app-indicator", 6);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 1, "operator.registration.loading"));
  }
}
function OperatorRegistryPopupComponent_Conditional_0_Conditional_3_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "code");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.currentRegistryUrl());
  }
}
function OperatorRegistryPopupComponent_Conditional_0_Conditional_3_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 10)(1, "mat-icon");
    \u0275\u0275text(2, "error_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 1, ctx_r1.errorMessage()));
  }
}
function OperatorRegistryPopupComponent_Conditional_0_Conditional_3_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 11)(1, "mat-icon");
    \u0275\u0275text(2, "check_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 1, ctx_r1.noticeMessage()));
  }
}
function OperatorRegistryPopupComponent_Conditional_0_Conditional_3_Conditional_16_Conditional_13_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const delivery_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 1, delivery_r4.code === "EXPLORE_MODE" ? "operator.measurements.delivery.not.sent" : delivery_r4.message), " ");
  }
}
function OperatorRegistryPopupComponent_Conditional_0_Conditional_3_Conditional_16_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 15)(1, "header")(2, "mat-icon");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "time");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(9, OperatorRegistryPopupComponent_Conditional_0_Conditional_3_Conditional_16_Conditional_13_Conditional_9_Template, 3, 3, "p");
    \u0275\u0275elementStart(10, "dl")(11, "div")(12, "dt");
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "dd");
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div")(18, "dt");
    \u0275\u0275text(19);
    \u0275\u0275pipe(20, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "dd");
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div")(24, "dt");
    \u0275\u0275text(25);
    \u0275\u0275pipe(26, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "dd");
    \u0275\u0275text(28);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "div")(30, "dt");
    \u0275\u0275text(31);
    \u0275\u0275pipe(32, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "dd");
    \u0275\u0275text(34);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "div")(36, "dt");
    \u0275\u0275text(37);
    \u0275\u0275pipe(38, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "dd");
    \u0275\u0275text(40);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const delivery_r4 = ctx;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275attribute("data-state", delivery_r4.state)("role", delivery_r4.state === "BLOCKED" || delivery_r4.state === "ERROR" ? "alert" : "status");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.measurementStateIcon(delivery_r4.state));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(6, 17, ctx_r1.measurementStateLabel(delivery_r4.state)));
    \u0275\u0275advance(2);
    \u0275\u0275attribute("datetime", delivery_r4.synchronizedAt);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatDate(delivery_r4.synchronizedAt), " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(delivery_r4.message ? 9 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(14, 19, "operator.measurements.delivery.materialized"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(delivery_r4.materialized);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(20, 21, "operator.measurements.delivery.submitted"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(delivery_r4.submitted);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(26, 23, "operator.measurements.delivery.accepted"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(delivery_r4.accepted);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(32, 25, "operator.measurements.delivery.pending"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(delivery_r4.pending);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(38, 27, "operator.measurements.delivery.blocked"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(delivery_r4.blocked);
  }
}
function OperatorRegistryPopupComponent_Conditional_0_Conditional_3_Conditional_16_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 16);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 1, "operator.measurements.delivery.description"), " ");
  }
}
function OperatorRegistryPopupComponent_Conditional_0_Conditional_3_Conditional_16_Conditional_16_Conditional_0_ng_template_13_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "code");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const report_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(report_r6.failureCode);
  }
}
function OperatorRegistryPopupComponent_Conditional_0_Conditional_3_Conditional_16_Conditional_16_Conditional_0_ng_template_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 20)(1, "header")(2, "span")(3, "small");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "strong");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "em");
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "small", 21);
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "p");
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(17, OperatorRegistryPopupComponent_Conditional_0_Conditional_3_Conditional_16_Conditional_16_Conditional_0_ng_template_13_Conditional_17_Template, 2, 1, "code");
    \u0275\u0275elementStart(18, "dl")(19, "div")(20, "dt");
    \u0275\u0275text(21);
    \u0275\u0275pipe(22, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "dd");
    \u0275\u0275text(24);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "div")(26, "dt");
    \u0275\u0275text(27);
    \u0275\u0275pipe(28, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "dd");
    \u0275\u0275text(30);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "div")(32, "dt");
    \u0275\u0275text(33);
    \u0275\u0275pipe(34, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "dd");
    \u0275\u0275text(36);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(37, "app-menu", 22);
    \u0275\u0275listener("itemSelect", function OperatorRegistryPopupComponent_Conditional_0_Conditional_3_Conditional_16_Conditional_16_Conditional_0_ng_template_13_Template_app_menu_itemSelect_37_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.onMeasurementReportActionSelect($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const report_r6 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(6);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 17, "operator.measurements.report.period"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.formatMeasurementPeriod(report_r6.period));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" ", report_r6.qualifiedMauCount, " ", \u0275\u0275pipeBind1(10, 19, "operator.measurements.report.qmau.short"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate4(" ", ctx_r1.formatMeasurementPeriod(report_r6.windowStart), " \u2013 ", ctx_r1.formatMeasurementPeriod(report_r6.windowEnd), " \xB7 ", \u0275\u0275pipeBind1(13, 21, "operator.measurements.report.revision"), " ", report_r6.revision, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(16, 23, report_r6.failureMessage || "operator.measurements.report.failure.unknown"), " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(report_r6.failureCode ? 17 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(22, 25, "operator.measurements.report.actions"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(report_r6.actionCount);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(28, 27, "operator.measurements.report.attempts"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(report_r6.attemptCount);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(34, 29, "operator.measurements.report.updated"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.formatDate(report_r6.updatedAt));
    \u0275\u0275advance();
    \u0275\u0275property("items", ctx_r1.measurementReportActionItems(report_r6));
  }
}
function OperatorRegistryPopupComponent_Conditional_0_Conditional_3_Conditional_16_Conditional_16_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18)(1, "header")(2, "span")(3, "small");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "strong");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "b");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(11, "app-smart-list", 19, 0);
    \u0275\u0275template(13, OperatorRegistryPopupComponent_Conditional_0_Conditional_3_Conditional_16_Conditional_16_Conditional_0_ng_template_13_Template, 38, 31, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const measurementReportTemplate_r7 = \u0275\u0275reference(14);
    const delivery_r8 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 7, "operator.measurements.reports"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 9, "operator.measurements.reports.blocked"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(delivery_r8.blocked);
    \u0275\u0275advance();
    \u0275\u0275property("config", ctx_r1.measurementReportConfig)("loadPage", ctx_r1.loadMeasurementReportPage)("query", ctx_r1.measurementReportQuery())("itemTemplate", measurementReportTemplate_r7);
  }
}
function OperatorRegistryPopupComponent_Conditional_0_Conditional_3_Conditional_16_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, OperatorRegistryPopupComponent_Conditional_0_Conditional_3_Conditional_16_Conditional_16_Conditional_0_Template, 15, 11, "div", 18);
  }
  if (rf & 2) {
    \u0275\u0275conditional(ctx.blocked > 0 ? 0 : -1);
  }
}
function OperatorRegistryPopupComponent_Conditional_0_Conditional_3_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 13);
    \u0275\u0275pipe(1, "i18n");
    \u0275\u0275elementStart(2, "header")(3, "span", 14)(4, "mat-icon");
    \u0275\u0275text(5, "monitoring");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "span")(7, "small");
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "strong");
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "i18n");
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(13, OperatorRegistryPopupComponent_Conditional_0_Conditional_3_Conditional_16_Conditional_13_Template, 41, 29, "article", 15)(14, OperatorRegistryPopupComponent_Conditional_0_Conditional_3_Conditional_16_Conditional_14_Template, 3, 3, "p", 16);
    \u0275\u0275elementStart(15, "app-menu", 17);
    \u0275\u0275listener("itemSelect", function OperatorRegistryPopupComponent_Conditional_0_Conditional_3_Conditional_16_Template_app_menu_itemSelect_15_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onMeasurementSyncActionSelect($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(16, OperatorRegistryPopupComponent_Conditional_0_Conditional_3_Conditional_16_Conditional_16_Template, 1, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_7_0;
    let tmp_9_0;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(1, 6, "operator.measurements.delivery"));
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(9, 8, "operator.measurements.delivery"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(12, 10, "operator.measurements.delivery.title"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_7_0 = ctx_r1.registry.measurementSync()) ? 13 : 14, tmp_7_0);
    \u0275\u0275advance(2);
    \u0275\u0275property("items", ctx_r1.measurementSyncActionItems());
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_9_0 = ctx_r1.registry.measurementSync()) ? 16 : -1, tmp_9_0);
  }
}
function OperatorRegistryPopupComponent_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 7)(1, "span", 8)(2, "mat-icon");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "span")(5, "small");
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "strong");
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(11, OperatorRegistryPopupComponent_Conditional_0_Conditional_3_Conditional_11_Template, 2, 1, "code");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "app-link-input", 9);
    \u0275\u0275listener("ngModelChange", function OperatorRegistryPopupComponent_Conditional_0_Conditional_3_Template_app_link_input_ngModelChange_12_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.updateRegistryBaseUrl($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(13, OperatorRegistryPopupComponent_Conditional_0_Conditional_3_Conditional_13_Template, 6, 3, "p", 10);
    \u0275\u0275conditionalCreate(14, OperatorRegistryPopupComponent_Conditional_0_Conditional_3_Conditional_14_Template, 6, 3, "p", 11);
    \u0275\u0275elementStart(15, "app-menu", 12);
    \u0275\u0275listener("itemSelect", function OperatorRegistryPopupComponent_Conditional_0_Conditional_3_Template_app_menu_itemSelect_15_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onRegistryActionSelect($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(16, OperatorRegistryPopupComponent_Conditional_0_Conditional_3_Conditional_16_Template, 17, 12, "section", 13);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.registered() ? "verified" : "dns");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(7, 12, "operator.registration.current.status"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(10, 14, ctx_r1.lifecycleLabel()));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.currentRegistryUrl() ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("config", ctx_r1.registryUrlConfig())("ngModel", ctx_r1.registryBaseUrl())("disabled", ctx_r1.busy())("textReadOnly", true);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.errorMessage() ? 13 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.noticeMessage() ? 14 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("items", ctx_r1.registryActionItems());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.registered() ? 16 : -1);
  }
}
function OperatorRegistryPopupComponent_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 5)(1, "mat-icon");
    \u0275\u0275text(2, "cloud_off");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 23);
    \u0275\u0275listener("click", function OperatorRegistryPopupComponent_Conditional_0_Conditional_4_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.registry.loadStatus());
    });
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 2, ctx_r1.errorMessage() || "operator.registration.unavailable"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(8, 4, "try.again"), " ");
  }
}
function OperatorRegistryPopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-popup", 2)(1, "section", 3);
    \u0275\u0275conditionalCreate(2, OperatorRegistryPopupComponent_Conditional_0_Conditional_2_Template, 5, 3, "div", 4)(3, OperatorRegistryPopupComponent_Conditional_0_Conditional_3_Template, 17, 16)(4, OperatorRegistryPopupComponent_Conditional_0_Conditional_4_Template, 9, 6, "div", 5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.popupModel());
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-busy", ctx_r1.busy());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.loading() ? 2 : (tmp_3_0 = ctx_r1.status()) ? 3 : 4, tmp_3_0);
  }
}
var OperatorRegistryPopupComponent = class _OperatorRegistryPopupComponent {
  registry = inject(OperatorRegistryStore);
  operatorMenu = inject(OperatorMenuStore);
  workspace = inject(OperatorWorkspaceStore);
  i18n = inject(I18nService);
  status = this.registry.status;
  busyAction = this.registry.busyAction;
  errorMessage = this.registry.error;
  noticeMessage = this.registry.notice;
  registryBaseUrl = this.registry.registryBaseUrl;
  busy = computed(() => this.busyAction() !== null, ...ngDevMode ? [{ debugName: "busy" }] : (
    /* istanbul ignore next */
    []
  ));
  loading = computed(() => this.busyAction() === "load", ...ngDevMode ? [{ debugName: "loading" }] : (
    /* istanbul ignore next */
    []
  ));
  canRegister = this.registry.canRegister;
  requeueingMeasurementReportId = signal(null, ...ngDevMode ? [{ debugName: "requeueingMeasurementReportId" }] : (
    /* istanbul ignore next */
    []
  ));
  measurementReportsSmartListRef = signal(null, ...ngDevMode ? [{ debugName: "measurementReportsSmartListRef" }] : (
    /* istanbul ignore next */
    []
  ));
  set measurementReportsSmartList(value) {
    this.measurementReportsSmartListRef.set(value ?? null);
  }
  currentRegistryUrl = computed(() => this.status()?.selection?.baseUrl?.trim() ?? "", ...ngDevMode ? [{ debugName: "currentRegistryUrl" }] : (
    /* istanbul ignore next */
    []
  ));
  registered = computed(() => this.status()?.enabled === true && this.status()?.lifecycle === "REGISTERED", ...ngDevMode ? [{ debugName: "registered" }] : (
    /* istanbul ignore next */
    []
  ));
  registryUrlConfig = computed(() => {
    const currentUrl = this.currentRegistryUrl();
    return {
      label: this.i18n.translate("operator.registration.registry.url"),
      placeholder: "https://registry.example.com",
      required: true,
      panelMode: "auto",
      availableUrls: this.registry.registryOptions().map((option) => ({
        url: option.baseUrl,
        label: this.i18n.translate(option.label),
        description: option.description ? this.i18n.translate(option.description) : option.registryScope || option.baseUrl,
        disabled: option.selected === true || this.sameUrl(option.baseUrl, currentUrl)
      })),
      availableUrlsAriaLabel: this.i18n.translate("operator.registration.registry.options"),
      pasteAriaLabel: this.i18n.translate("operator.registration.url.paste"),
      openAriaLabel: this.i18n.translate("operator.registration.url.open"),
      deleteAriaLabel: this.i18n.translate("operator.registration.url.clear")
    };
  }, ...ngDevMode ? [{ debugName: "registryUrlConfig" }] : (
    /* istanbul ignore next */
    []
  ));
  registryActionItems = computed(() => [
    {
      id: "disconnect",
      label: "operator.registration.disable",
      icon: "link_off",
      layout: "action",
      palette: "danger",
      disabled: this.busy() || !this.registered(),
      progress: this.busyAction() === "disconnect" ? { state: "loading", shape: "button", durationMs: 3e3 } : null
    },
    {
      id: "register",
      label: "operator.registration.register",
      icon: "app_registration",
      layout: "action",
      palette: "violet",
      disabled: !this.canRegister(),
      progress: this.busyAction() === "register" ? { state: "loading", shape: "button", durationMs: 3e3 } : null
    }
  ], ...ngDevMode ? [{ debugName: "registryActionItems" }] : (
    /* istanbul ignore next */
    []
  ));
  measurementSyncActionItems = computed(() => {
    const synchronization = this.registry.measurementSync();
    return [{
      id: "synchronize-measurements",
      label: "operator.measurements.delivery.synchronize",
      detail: synchronization ? this.measurementStateLabel(synchronization.state) : "operator.measurements.delivery.synchronize.detail",
      icon: synchronization ? this.measurementStateIcon(synchronization.state) : "sync",
      layout: "action",
      palette: this.measurementStatePalette(synchronization?.state),
      disabled: this.busy() || !this.registered(),
      progress: this.busyAction() === "synchronize-measurements" ? { state: "loading", shape: "button", durationMs: 3e3 } : null
    }];
  }, ...ngDevMode ? [{ debugName: "measurementSyncActionItems" }] : (
    /* istanbul ignore next */
    []
  ));
  measurementReportQuery = computed(() => ({
    page: 0,
    pageSize: 4,
    sort: "period",
    direction: "desc",
    filters: {
      status: "BLOCKED",
      revision: this.registry.measurementSync()?.synchronizedAt ?? ""
    }
  }), ...ngDevMode ? [{ debugName: "measurementReportQuery" }] : (
    /* istanbul ignore next */
    []
  ));
  measurementReportConfig = {
    pageSize: 4,
    initialPageSize: 4,
    defaultView: "list",
    emptyLabel: "operator.measurements.reports.empty",
    emptyDescription: "operator.measurements.reports.empty.description",
    showStickyHeader: false,
    showFirstGroupMarker: false,
    listLayout: "stack",
    snapMode: "none",
    preloadOffsetPx: 100,
    headerProgress: {
      enabled: true,
      placement: "inline",
      tone: "accent"
    },
    cacheable: {
      identity: (report) => report.id
    },
    trackBy: (_index, report) => report.id
  };
  loadMeasurementReportPage = (query, context) => from(this.registry.measurementReportPage(query, context?.signal));
  ngOnInit() {
    void this.registry.loadStatus();
  }
  popupModel() {
    return {
      title: "operator.action.node.registration",
      subtitle: "operator.registration.subtitle",
      ariaLabel: "operator.action.node.registration",
      closeAriaLabel: "operator.popup.close",
      size: "small",
      height: "auto",
      mobilePresentation: "compact",
      headerTone: "accent",
      headerPalette: "violet",
      bodyLayout: "overflow",
      headerActions: [
        {
          id: "refresh",
          icon: "refresh",
          ariaLabel: "operator.registration.refresh",
          palette: "violet",
          disabled: this.busy()
        }
      ],
      onAction: (event) => this.onPopupAction(event),
      onClose: () => this.close()
    };
  }
  updateRegistryBaseUrl(value) {
    this.registry.setRegistryBaseUrl(value);
    const selectedOption = this.registry.registryOptions().find((option) => this.sameUrl(option.baseUrl, value));
    this.registry.setExpectedRegistryScope(selectedOption?.registryScope?.trim() ?? "");
  }
  async registerNode() {
    const currentRegistryScope = (this.status()?.selection?.registryScope ?? this.status()?.selection?.registryIdentity?.registryScope ?? "").trim();
    const targetRegistryScope = this.registry.expectedRegistryScope().trim();
    const replacingActiveBinding = this.registered() && Boolean(this.currentRegistryUrl()) && (!this.sameUrl(this.currentRegistryUrl(), this.registryBaseUrl()) || Boolean(currentRegistryScope && targetRegistryScope && currentRegistryScope !== targetRegistryScope));
    const requireHttps = this.status()?.mode === "REAL";
    const baseUrlError = validateOperatorRegistryBaseUrl(this.registryBaseUrl(), requireHttps);
    if (baseUrlError) {
      this.registry.setError(baseUrlError);
      return;
    }
    this.registry.setRegistryBaseUrl(normalizeOperatorRegistryBaseUrl(this.registryBaseUrl(), requireHttps));
    this.registry.clearFeedback();
    const status = await this.registry.register();
    if (replacingActiveBinding && (Boolean(status) || !this.registered())) {
      this.workspace.applyRegistryDeactivation();
    }
    if (status) {
      this.registry.setNotice("operator.registration.completed");
    }
  }
  async disconnect() {
    this.registry.clearFeedback();
    const status = await this.registry.disconnect();
    if (status) {
      this.workspace.applyRegistryDeactivation();
      this.registry.setNotice("operator.registration.disabled");
    }
  }
  close() {
    this.registry.clearFeedback();
    this.operatorMenu.closePopup();
  }
  lifecycleLabel() {
    switch (this.status()?.lifecycle) {
      case "REGISTERED":
        return "operator.registration.status.registered";
      case "REGISTERING":
      case "PENDING":
        return "operator.registration.status.registering";
      case "CONFIGURED":
      case "INSPECTED":
        return "operator.registration.status.configured";
      case "ERROR":
        return "operator.registration.status.error";
      case "DISABLED":
        return "operator.registration.status.disabled";
      case "UNCONFIGURED":
      default:
        return "operator.registration.status.not.registered";
    }
  }
  onRegistryActionSelect(event) {
    if (event.id === "disconnect") {
      void this.disconnect();
    } else if (event.id === "register") {
      void this.registerNode();
    }
  }
  onMeasurementSyncActionSelect(event) {
    if (event.id === "synchronize-measurements") {
      void this.registry.synchronizeMeasurements();
    }
  }
  measurementReportActionItems(report) {
    const requeueing = this.requeueingMeasurementReportId() === report.id;
    return [{
      id: `operator-requeue-measurement-report-${report.id}`,
      label: "operator.measurements.report.requeue",
      detail: "operator.measurements.report.requeue.detail",
      icon: "replay",
      palette: "orange",
      layout: "action",
      disabled: this.busy() || report.status !== "BLOCKED",
      progress: requeueing ? { state: "loading", shape: "button", durationMs: 3e3 } : null,
      context: { reportId: report.id }
    }];
  }
  async onMeasurementReportActionSelect(event) {
    const reportId = event.context?.reportId?.trim() ?? "";
    if (!reportId) {
      return;
    }
    this.requeueingMeasurementReportId.set(reportId);
    try {
      const result = await this.registry.requeueMeasurementReport(reportId);
      if (result?.status === "PENDING") {
        this.measurementReportsSmartListRef()?.removeVisibleItemByIdentity(reportId, { totalDelta: -1 });
      }
    } finally {
      this.requeueingMeasurementReportId.set(null);
    }
  }
  measurementStateLabel(state) {
    return `operator.measurements.delivery.state.${state.toLowerCase()}`;
  }
  measurementStateIcon(state) {
    switch (state) {
      case "READY":
        return "check_circle";
      case "BLOCKED":
        return "report_problem";
      case "BUSY":
        return "schedule";
      case "ERROR":
        return "error_outline";
      case "DORMANT":
      default:
        return "pause_circle";
    }
  }
  formatMeasurementPeriod(value) {
    const source = `${value ?? ""}`.trim();
    const monthOnly = /^\d{4}-\d{2}$/.test(source);
    const timestamp = Date.parse(/^\d{4}-\d{2}-\d{2}$/.test(source) || monthOnly ? `${source}${monthOnly ? "-01" : ""}T00:00:00.000Z` : source);
    if (!Number.isFinite(timestamp)) {
      return source || "\u2014";
    }
    return new Intl.DateTimeFormat(this.i18n.currentLanguage(), monthOnly ? {
      year: "numeric",
      month: "short",
      timeZone: "UTC"
    } : {
      dateStyle: "medium",
      timeZone: "UTC"
    }).format(new Date(timestamp));
  }
  formatDate(value) {
    const timestamp = Date.parse(`${value ?? ""}`);
    if (!Number.isFinite(timestamp)) {
      return "\u2014";
    }
    return new Intl.DateTimeFormat(this.i18n.currentLanguage(), {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(timestamp));
  }
  onPopupAction(event) {
    if (event.action.id === "refresh") {
      void this.registry.loadStatus();
    }
  }
  sameUrl(left, right) {
    if (!left.trim() || !right.trim()) {
      return false;
    }
    try {
      return normalizeOperatorRegistryBaseUrl(left, false) === normalizeOperatorRegistryBaseUrl(right, false);
    } catch {
      return left.trim().replace(/\/+$/, "") === right.trim().replace(/\/+$/, "");
    }
  }
  measurementStatePalette(state) {
    switch (state) {
      case "READY":
        return "green";
      case "BUSY":
        return "orange";
      case "BLOCKED":
      case "ERROR":
        return "red";
      case "DORMANT":
      default:
        return "slate";
    }
  }
  static \u0275fac = function OperatorRegistryPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OperatorRegistryPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _OperatorRegistryPopupComponent, selectors: [["app-operator-registry-popup"]], viewQuery: function OperatorRegistryPopupComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.measurementReportsSmartList = _t.first);
    }
  }, decls: 1, vars: 1, consts: [["measurementReportsSmartList", ""], ["measurementReportTemplate", ""], [3, "model"], [1, "operator-registration"], ["role", "status", 1, "operator-registration__loading"], ["role", "alert", 1, "operator-registration__loading", "is-error"], ["kind", "load-ring", "state", "loading"], [1, "operator-registration__status"], [1, "operator-registration__status-icon"], ["name", "registryBaseUrl", 3, "ngModelChange", "config", "ngModel", "disabled", "textReadOnly"], ["role", "alert", 1, "operator-registration__message", "is-error"], ["role", "status", 1, "operator-registration__message", "is-success"], ["kind", "inline", "layout", "row", 1, "operator-registration__actions", 3, "itemSelect", "items"], [1, "operator-registration__measurements"], [1, "operator-registration__measurement-icon"], [1, "operator-registration__measurement-delivery"], [1, "operator-registration__measurement-hint"], ["kind", "inline", "layout", "row", 1, "operator-registration__measurement-actions", 3, "itemSelect", "items"], [1, "operator-registration__measurement-reports"], [3, "config", "loadPage", "query", "itemTemplate"], [1, "operator-registration__measurement-report"], [1, "operator-registration__measurement-window"], ["kind", "inline", "layout", "row", 3, "itemSelect", "items"], ["type", "button", 3, "click"]], template: function OperatorRegistryPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, OperatorRegistryPopupComponent_Conditional_0_Template, 5, 3, "app-popup", 2);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.operatorMenu.activePopup() === "registration" ? 0 : -1);
    }
  }, dependencies: [
    FormsModule,
    NgControlStatus,
    NgModel,
    AppMenuComponent,
    IndicatorComponent,
    LinkInputComponent,
    MatIconModule,
    MatIcon,
    PopupComponent,
    SmartListComponent,
    I18nPipe
  ], styles: ["\n[_nghost-%COMP%] {\n  display: contents;\n}\n.operator-registration[_ngcontent-%COMP%] {\n  position: relative;\n  min-height: 260px;\n  display: grid;\n  gap: 0.9rem;\n  color: #243853;\n}\n.operator-registration__loading[_ngcontent-%COMP%] {\n  min-height: 240px;\n  display: grid;\n  place-items: center;\n  align-content: center;\n  gap: 0.65rem;\n  color: rgba(36, 56, 83, 0.72);\n  font-size: 0.82rem;\n  font-weight: 800;\n  text-align: center;\n}\n.operator-registration__loading.is-error[_ngcontent-%COMP%] {\n  color: #9b3447;\n}\n.operator-registration__loading[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  min-height: 36px;\n  padding: 0 0.9rem;\n  border: 0;\n  border-radius: 999px;\n  background: #7058df;\n  color: #fff;\n  font: inherit;\n}\n.operator-registration__status[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding: 0.7rem;\n  border: 1px solid rgba(77, 91, 135, 0.14);\n  border-radius: 14px;\n  background: #f7f7fc;\n  display: flex;\n  align-items: center;\n  gap: 0.65rem;\n}\n.operator-registration__status-icon[_ngcontent-%COMP%] {\n  width: 38px;\n  height: 38px;\n  flex: 0 0 38px;\n  border-radius: 12px;\n  background: #e9e5ff;\n  color: #6650c9;\n  display: grid;\n  place-items: center;\n}\n.operator-registration__status[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:last-child {\n  min-width: 0;\n  display: grid;\n  gap: 0.08rem;\n}\n.operator-registration__status[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: rgba(36, 56, 83, 0.58);\n  font-size: 0.68rem;\n  font-weight: 800;\n}\n.operator-registration__status[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.88rem;\n}\n.operator-registration__status[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n  max-width: 100%;\n  overflow: hidden;\n  color: #4e6180;\n  font-size: 0.7rem;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.operator-registration__message[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 0.58rem 0.68rem;\n  border-radius: 11px;\n  display: flex;\n  align-items: center;\n  gap: 0.45rem;\n  font-size: 0.75rem;\n  font-weight: 800;\n}\n.operator-registration__message[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.operator-registration__message.is-error[_ngcontent-%COMP%] {\n  background: #fff0f3;\n  color: #9b3447;\n}\n.operator-registration__message.is-success[_ngcontent-%COMP%] {\n  background: #ebf8f3;\n  color: #16735b;\n}\n.operator-registration__actions[_ngcontent-%COMP%] {\n  min-width: 0;\n  justify-self: end;\n}\n.operator-registration__measurements[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding: 0.65rem;\n  border: 1px solid rgba(74, 105, 137, 0.14);\n  border-radius: 13px;\n  background: #f8fafc;\n  display: grid;\n  gap: 0.52rem;\n}\n.operator-registration__measurements[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.48rem;\n}\n.operator-registration__measurement-icon[_ngcontent-%COMP%] {\n  width: 30px;\n  height: 30px;\n  flex: 0 0 30px;\n  border-radius: 9px;\n  background: #e5f0f7;\n  color: #356986;\n  display: grid;\n  place-items: center;\n}\n.operator-registration__measurement-icon[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n}\n.operator-registration__measurements[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:last-child, \n.operator-registration__measurement-reports[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.03rem;\n}\n.operator-registration__measurements[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.operator-registration__measurement-reports[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: rgba(36, 56, 83, 0.55);\n  font-size: 0.6rem;\n  font-weight: 800;\n}\n.operator-registration__measurements[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.operator-registration__measurement-reports[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #314762;\n  font-size: 0.78rem;\n}\n.operator-registration__measurement-hint[_ngcontent-%COMP%] {\n  margin: 0;\n  color: rgba(36, 56, 83, 0.7);\n  font-size: 0.68rem;\n  font-weight: 720;\n  line-height: 1.4;\n}\n.operator-registration__measurement-delivery[_ngcontent-%COMP%] {\n  --measurement-accent: #52657b;\n  --measurement-surface: #eef2f6;\n  min-width: 0;\n  padding: 0.52rem;\n  border-radius: 10px;\n  background: var(--measurement-surface);\n  display: grid;\n  gap: 0.38rem;\n}\n.operator-registration__measurement-delivery[data-state=READY][_ngcontent-%COMP%] {\n  --measurement-accent: #187258;\n  --measurement-surface: #eaf7f2;\n}\n.operator-registration__measurement-delivery[data-state=BUSY][_ngcontent-%COMP%] {\n  --measurement-accent: #946114;\n  --measurement-surface: #fff6df;\n}\n.operator-registration__measurement-delivery[data-state=BLOCKED][_ngcontent-%COMP%], \n.operator-registration__measurement-delivery[data-state=ERROR][_ngcontent-%COMP%] {\n  --measurement-accent: #9b3447;\n  --measurement-surface: #fff0f3;\n}\n.operator-registration__measurement-delivery[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.36rem;\n  color: var(--measurement-accent);\n}\n.operator-registration__measurement-delivery[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n}\n.operator-registration__measurement-delivery[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.72rem;\n}\n.operator-registration__measurement-delivery[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]   time[_ngcontent-%COMP%] {\n  color: rgba(36, 56, 83, 0.55);\n  font-size: 0.58rem;\n  font-weight: 800;\n  white-space: nowrap;\n}\n.operator-registration__measurement-delivery[_ngcontent-%COMP%]    > p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: rgba(36, 56, 83, 0.72);\n  font-size: 0.64rem;\n  font-weight: 720;\n  line-height: 1.35;\n  overflow-wrap: anywhere;\n}\n.operator-registration__measurement-delivery[_ngcontent-%COMP%]   dl[_ngcontent-%COMP%] {\n  margin: 0;\n  display: grid;\n  grid-template-columns: repeat(5, minmax(0, 1fr));\n  gap: 0.25rem;\n}\n.operator-registration__measurement-delivery[_ngcontent-%COMP%]   dl[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding: 0.28rem;\n  border-radius: 7px;\n  background: rgba(255, 255, 255, 0.7);\n  display: grid;\n  gap: 0.02rem;\n}\n.operator-registration__measurement-delivery[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%], \n.operator-registration__measurement-report[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%] {\n  color: rgba(36, 56, 83, 0.52);\n  font-size: 0.54rem;\n  font-weight: 800;\n  overflow-wrap: anywhere;\n}\n.operator-registration__measurement-delivery[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--measurement-accent);\n  font-size: 0.72rem;\n  font-weight: 950;\n  font-variant-numeric: tabular-nums;\n}\n.operator-registration__measurement-actions[_ngcontent-%COMP%] {\n  justify-self: end;\n}\n.operator-registration__measurement-reports[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding-top: 0.48rem;\n  border-top: 1px solid rgba(155, 52, 71, 0.14);\n  display: grid;\n  gap: 0.42rem;\n}\n.operator-registration__measurement-reports[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.4rem;\n}\n.operator-registration__measurement-reports[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #9b3447;\n}\n.operator-registration__measurement-reports[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]   b[_ngcontent-%COMP%] {\n  min-width: 24px;\n  height: 24px;\n  padding: 0 0.35rem;\n  border-radius: 999px;\n  background: #ffe2e8;\n  color: #9b3447;\n  display: grid;\n  place-items: center;\n  font-size: 0.65rem;\n  font-variant-numeric: tabular-nums;\n}\n.operator-registration__measurement-reports[_ngcontent-%COMP%]   app-smart-list[_ngcontent-%COMP%] {\n  min-width: 0;\n  width: 100%;\n}\n.operator-registration__measurement-report[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding: 0.5rem;\n  border: 1px solid rgba(155, 52, 71, 0.13);\n  border-radius: 9px;\n  background: #fff;\n  display: grid;\n  gap: 0.3rem;\n}\n.operator-registration__measurement-report[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.4rem;\n}\n.operator-registration__measurement-report[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.02rem;\n}\n.operator-registration__measurement-report[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: rgba(36, 56, 83, 0.52);\n  font-size: 0.56rem;\n  font-weight: 800;\n}\n.operator-registration__measurement-report[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #314762;\n  font-size: 0.72rem;\n}\n.operator-registration__measurement-report[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  padding: 0.18rem 0.38rem;\n  border-radius: 999px;\n  background: #fff0f3;\n  color: #9b3447;\n  font-size: 0.58rem;\n  font-style: normal;\n  font-weight: 900;\n  white-space: nowrap;\n}\n.operator-registration__measurement-window[_ngcontent-%COMP%] {\n  color: rgba(36, 56, 83, 0.56);\n  font-size: 0.57rem;\n  font-weight: 750;\n}\n.operator-registration__measurement-report[_ngcontent-%COMP%]    > p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: rgba(36, 56, 83, 0.72);\n  font-size: 0.63rem;\n  font-weight: 720;\n  line-height: 1.35;\n}\n.operator-registration__measurement-report[_ngcontent-%COMP%]    > code[_ngcontent-%COMP%] {\n  color: #9b3447;\n  font-size: 0.56rem;\n  font-weight: 800;\n  overflow-wrap: anywhere;\n}\n.operator-registration__measurement-report[_ngcontent-%COMP%]   dl[_ngcontent-%COMP%] {\n  margin: 0;\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.28rem;\n}\n.operator-registration__measurement-report[_ngcontent-%COMP%]   dl[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.02rem;\n}\n.operator-registration__measurement-report[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  min-width: 0;\n  margin: 0;\n  color: #314762;\n  font-size: 0.61rem;\n  font-weight: 850;\n  overflow-wrap: anywhere;\n}\n.operator-registration__measurement-report[_ngcontent-%COMP%]   app-menu[_ngcontent-%COMP%] {\n  width: min(100%, 210px);\n}\n@media (max-width: 560px) {\n  .operator-registration__actions[_ngcontent-%COMP%] {\n    justify-self: stretch;\n    width: 100%;\n  }\n  .operator-registration__measurement-delivery[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%] {\n    grid-template-columns: auto minmax(0, 1fr);\n  }\n  .operator-registration__measurement-delivery[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]   time[_ngcontent-%COMP%] {\n    grid-column: 2;\n  }\n  .operator-registration__measurement-delivery[_ngcontent-%COMP%]   dl[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n  .operator-registration__measurement-actions[_ngcontent-%COMP%] {\n    justify-self: stretch;\n    width: 100%;\n  }\n  .operator-registration__measurement-report[_ngcontent-%COMP%]   dl[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n}\n/*# sourceMappingURL=operator-registry-popup.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OperatorRegistryPopupComponent, [{
    type: Component,
    args: [{ selector: "app-operator-registry-popup", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, imports: [
      FormsModule,
      AppMenuComponent,
      IndicatorComponent,
      I18nPipe,
      LinkInputComponent,
      MatIconModule,
      PopupComponent,
      SmartListComponent
    ], template: `@if (operatorMenu.activePopup() === 'registration') {
  <app-popup [model]="popupModel()">
    <section class="operator-registration" [attr.aria-busy]="busy()">
      @if (loading()) {
        <div class="operator-registration__loading" role="status">
          <app-indicator kind="load-ring" state="loading"></app-indicator>
          <span>{{ 'operator.registration.loading' | i18n }}</span>
        </div>
      } @else if (status(); as registryStatus) {
        <div class="operator-registration__status">
          <span class="operator-registration__status-icon">
            <mat-icon>{{ registered() ? 'verified' : 'dns' }}</mat-icon>
          </span>
          <span>
            <small>{{ 'operator.registration.current.status' | i18n }}</small>
            <strong>{{ lifecycleLabel() | i18n }}</strong>
            @if (currentRegistryUrl()) {
              <code>{{ currentRegistryUrl() }}</code>
            }
          </span>
        </div>

        <app-link-input
          name="registryBaseUrl"
          [config]="registryUrlConfig()"
          [ngModel]="registryBaseUrl()"
          (ngModelChange)="updateRegistryBaseUrl($event)"
          [disabled]="busy()"
          [textReadOnly]="true"
        ></app-link-input>

        @if (errorMessage()) {
          <p class="operator-registration__message is-error" role="alert">
            <mat-icon>error_outline</mat-icon>
            <span>{{ errorMessage() | i18n }}</span>
          </p>
        }
        @if (noticeMessage()) {
          <p class="operator-registration__message is-success" role="status">
            <mat-icon>check_circle</mat-icon>
            <span>{{ noticeMessage() | i18n }}</span>
          </p>
        }

        <app-menu
          class="operator-registration__actions"
          kind="inline"
          layout="row"
          [items]="registryActionItems()"
          (itemSelect)="onRegistryActionSelect($event)"
        ></app-menu>

        @if (registered()) {
          <section
            class="operator-registration__measurements"
            [attr.aria-label]="'operator.measurements.delivery' | i18n"
          >
            <header>
              <span class="operator-registration__measurement-icon">
                <mat-icon>monitoring</mat-icon>
              </span>
              <span>
                <small>{{ 'operator.measurements.delivery' | i18n }}</small>
                <strong>{{ 'operator.measurements.delivery.title' | i18n }}</strong>
              </span>
            </header>

            @if (registry.measurementSync(); as delivery) {
              <article
                class="operator-registration__measurement-delivery"
                [attr.data-state]="delivery.state"
                [attr.role]="delivery.state === 'BLOCKED' || delivery.state === 'ERROR'
                  ? 'alert'
                  : 'status'"
              >
                <header>
                  <mat-icon>{{ measurementStateIcon(delivery.state) }}</mat-icon>
                  <strong>{{ measurementStateLabel(delivery.state) | i18n }}</strong>
                  <time [attr.datetime]="delivery.synchronizedAt">
                    {{ formatDate(delivery.synchronizedAt) }}
                  </time>
                </header>
                @if (delivery.message) {
                  <p>
                    {{ (delivery.code === 'EXPLORE_MODE'
                      ? 'operator.measurements.delivery.not.sent'
                      : delivery.message) | i18n }}
                  </p>
                }
                <dl>
                  <div>
                    <dt>{{ 'operator.measurements.delivery.materialized' | i18n }}</dt>
                    <dd>{{ delivery.materialized }}</dd>
                  </div>
                  <div>
                    <dt>{{ 'operator.measurements.delivery.submitted' | i18n }}</dt>
                    <dd>{{ delivery.submitted }}</dd>
                  </div>
                  <div>
                    <dt>{{ 'operator.measurements.delivery.accepted' | i18n }}</dt>
                    <dd>{{ delivery.accepted }}</dd>
                  </div>
                  <div>
                    <dt>{{ 'operator.measurements.delivery.pending' | i18n }}</dt>
                    <dd>{{ delivery.pending }}</dd>
                  </div>
                  <div>
                    <dt>{{ 'operator.measurements.delivery.blocked' | i18n }}</dt>
                    <dd>{{ delivery.blocked }}</dd>
                  </div>
                </dl>
              </article>
            } @else {
              <p class="operator-registration__measurement-hint">
                {{ 'operator.measurements.delivery.description' | i18n }}
              </p>
            }

            <app-menu
              class="operator-registration__measurement-actions"
              kind="inline"
              layout="row"
              [items]="measurementSyncActionItems()"
              (itemSelect)="onMeasurementSyncActionSelect($event)"
            ></app-menu>

            @if (registry.measurementSync(); as delivery) {
              @if (delivery.blocked > 0) {
                <div class="operator-registration__measurement-reports">
                  <header>
                    <span>
                      <small>{{ 'operator.measurements.reports' | i18n }}</small>
                      <strong>{{ 'operator.measurements.reports.blocked' | i18n }}</strong>
                    </span>
                  <b>{{ delivery.blocked }}</b>
                  </header>

                  <app-smart-list
                    #measurementReportsSmartList
                    [config]="measurementReportConfig"
                    [loadPage]="loadMeasurementReportPage"
                    [query]="measurementReportQuery()"
                    [itemTemplate]="measurementReportTemplate"
                  ></app-smart-list>

                  <ng-template #measurementReportTemplate let-report>
                    <article class="operator-registration__measurement-report">
                      <header>
                        <span>
                          <small>{{ 'operator.measurements.report.period' | i18n }}</small>
                          <strong>{{ formatMeasurementPeriod(report.period) }}</strong>
                        </span>
                        <em>
                          {{ report.qualifiedMauCount }}
                          {{ 'operator.measurements.report.qmau.short' | i18n }}
                        </em>
                      </header>
                      <small class="operator-registration__measurement-window">
                        {{ formatMeasurementPeriod(report.windowStart) }}
                        \u2013
                        {{ formatMeasurementPeriod(report.windowEnd) }}
                        \xB7
                        {{ 'operator.measurements.report.revision' | i18n }}
                        {{ report.revision }}
                      </small>
                      <p>
                        {{ (report.failureMessage
                          || 'operator.measurements.report.failure.unknown') | i18n }}
                      </p>
                      @if (report.failureCode) {
                        <code>{{ report.failureCode }}</code>
                      }
                      <dl>
                        <div>
                          <dt>{{ 'operator.measurements.report.actions' | i18n }}</dt>
                          <dd>{{ report.actionCount }}</dd>
                        </div>
                        <div>
                          <dt>{{ 'operator.measurements.report.attempts' | i18n }}</dt>
                          <dd>{{ report.attemptCount }}</dd>
                        </div>
                        <div>
                          <dt>{{ 'operator.measurements.report.updated' | i18n }}</dt>
                          <dd>{{ formatDate(report.updatedAt) }}</dd>
                        </div>
                      </dl>
                      <app-menu
                        kind="inline"
                        layout="row"
                        [items]="measurementReportActionItems(report)"
                        (itemSelect)="onMeasurementReportActionSelect($event)"
                      ></app-menu>
                    </article>
                  </ng-template>
                </div>
              }
            }
          </section>
        }
      } @else {
        <div class="operator-registration__loading is-error" role="alert">
          <mat-icon>cloud_off</mat-icon>
          <span>{{ (errorMessage() || 'operator.registration.unavailable') | i18n }}</span>
          <button type="button" (click)="registry.loadStatus()">
            {{ 'try.again' | i18n }}
          </button>
        </div>
      }
    </section>
  </app-popup>
}
`, styles: ["/* src/app/operator/components/operator-registry-popup/operator-registry-popup.component.scss */\n:host {\n  display: contents;\n}\n.operator-registration {\n  position: relative;\n  min-height: 260px;\n  display: grid;\n  gap: 0.9rem;\n  color: #243853;\n}\n.operator-registration__loading {\n  min-height: 240px;\n  display: grid;\n  place-items: center;\n  align-content: center;\n  gap: 0.65rem;\n  color: rgba(36, 56, 83, 0.72);\n  font-size: 0.82rem;\n  font-weight: 800;\n  text-align: center;\n}\n.operator-registration__loading.is-error {\n  color: #9b3447;\n}\n.operator-registration__loading button {\n  min-height: 36px;\n  padding: 0 0.9rem;\n  border: 0;\n  border-radius: 999px;\n  background: #7058df;\n  color: #fff;\n  font: inherit;\n}\n.operator-registration__status {\n  min-width: 0;\n  padding: 0.7rem;\n  border: 1px solid rgba(77, 91, 135, 0.14);\n  border-radius: 14px;\n  background: #f7f7fc;\n  display: flex;\n  align-items: center;\n  gap: 0.65rem;\n}\n.operator-registration__status-icon {\n  width: 38px;\n  height: 38px;\n  flex: 0 0 38px;\n  border-radius: 12px;\n  background: #e9e5ff;\n  color: #6650c9;\n  display: grid;\n  place-items: center;\n}\n.operator-registration__status > span:last-child {\n  min-width: 0;\n  display: grid;\n  gap: 0.08rem;\n}\n.operator-registration__status small {\n  color: rgba(36, 56, 83, 0.58);\n  font-size: 0.68rem;\n  font-weight: 800;\n}\n.operator-registration__status strong {\n  font-size: 0.88rem;\n}\n.operator-registration__status code {\n  max-width: 100%;\n  overflow: hidden;\n  color: #4e6180;\n  font-size: 0.7rem;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.operator-registration__message {\n  margin: 0;\n  padding: 0.58rem 0.68rem;\n  border-radius: 11px;\n  display: flex;\n  align-items: center;\n  gap: 0.45rem;\n  font-size: 0.75rem;\n  font-weight: 800;\n}\n.operator-registration__message .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.operator-registration__message.is-error {\n  background: #fff0f3;\n  color: #9b3447;\n}\n.operator-registration__message.is-success {\n  background: #ebf8f3;\n  color: #16735b;\n}\n.operator-registration__actions {\n  min-width: 0;\n  justify-self: end;\n}\n.operator-registration__measurements {\n  min-width: 0;\n  padding: 0.65rem;\n  border: 1px solid rgba(74, 105, 137, 0.14);\n  border-radius: 13px;\n  background: #f8fafc;\n  display: grid;\n  gap: 0.52rem;\n}\n.operator-registration__measurements > header {\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.48rem;\n}\n.operator-registration__measurement-icon {\n  width: 30px;\n  height: 30px;\n  flex: 0 0 30px;\n  border-radius: 9px;\n  background: #e5f0f7;\n  color: #356986;\n  display: grid;\n  place-items: center;\n}\n.operator-registration__measurement-icon .mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n}\n.operator-registration__measurements > header > span:last-child,\n.operator-registration__measurement-reports > header > span {\n  min-width: 0;\n  display: grid;\n  gap: 0.03rem;\n}\n.operator-registration__measurements > header small,\n.operator-registration__measurement-reports > header small {\n  color: rgba(36, 56, 83, 0.55);\n  font-size: 0.6rem;\n  font-weight: 800;\n}\n.operator-registration__measurements > header strong,\n.operator-registration__measurement-reports > header strong {\n  color: #314762;\n  font-size: 0.78rem;\n}\n.operator-registration__measurement-hint {\n  margin: 0;\n  color: rgba(36, 56, 83, 0.7);\n  font-size: 0.68rem;\n  font-weight: 720;\n  line-height: 1.4;\n}\n.operator-registration__measurement-delivery {\n  --measurement-accent: #52657b;\n  --measurement-surface: #eef2f6;\n  min-width: 0;\n  padding: 0.52rem;\n  border-radius: 10px;\n  background: var(--measurement-surface);\n  display: grid;\n  gap: 0.38rem;\n}\n.operator-registration__measurement-delivery[data-state=READY] {\n  --measurement-accent: #187258;\n  --measurement-surface: #eaf7f2;\n}\n.operator-registration__measurement-delivery[data-state=BUSY] {\n  --measurement-accent: #946114;\n  --measurement-surface: #fff6df;\n}\n.operator-registration__measurement-delivery[data-state=BLOCKED],\n.operator-registration__measurement-delivery[data-state=ERROR] {\n  --measurement-accent: #9b3447;\n  --measurement-surface: #fff0f3;\n}\n.operator-registration__measurement-delivery > header {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.36rem;\n  color: var(--measurement-accent);\n}\n.operator-registration__measurement-delivery > header .mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n}\n.operator-registration__measurement-delivery > header strong {\n  font-size: 0.72rem;\n}\n.operator-registration__measurement-delivery > header time {\n  color: rgba(36, 56, 83, 0.55);\n  font-size: 0.58rem;\n  font-weight: 800;\n  white-space: nowrap;\n}\n.operator-registration__measurement-delivery > p {\n  margin: 0;\n  color: rgba(36, 56, 83, 0.72);\n  font-size: 0.64rem;\n  font-weight: 720;\n  line-height: 1.35;\n  overflow-wrap: anywhere;\n}\n.operator-registration__measurement-delivery dl {\n  margin: 0;\n  display: grid;\n  grid-template-columns: repeat(5, minmax(0, 1fr));\n  gap: 0.25rem;\n}\n.operator-registration__measurement-delivery dl > div {\n  min-width: 0;\n  padding: 0.28rem;\n  border-radius: 7px;\n  background: rgba(255, 255, 255, 0.7);\n  display: grid;\n  gap: 0.02rem;\n}\n.operator-registration__measurement-delivery dt,\n.operator-registration__measurement-report dt {\n  color: rgba(36, 56, 83, 0.52);\n  font-size: 0.54rem;\n  font-weight: 800;\n  overflow-wrap: anywhere;\n}\n.operator-registration__measurement-delivery dd {\n  margin: 0;\n  color: var(--measurement-accent);\n  font-size: 0.72rem;\n  font-weight: 950;\n  font-variant-numeric: tabular-nums;\n}\n.operator-registration__measurement-actions {\n  justify-self: end;\n}\n.operator-registration__measurement-reports {\n  min-width: 0;\n  padding-top: 0.48rem;\n  border-top: 1px solid rgba(155, 52, 71, 0.14);\n  display: grid;\n  gap: 0.42rem;\n}\n.operator-registration__measurement-reports > header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.4rem;\n}\n.operator-registration__measurement-reports > header strong {\n  color: #9b3447;\n}\n.operator-registration__measurement-reports > header b {\n  min-width: 24px;\n  height: 24px;\n  padding: 0 0.35rem;\n  border-radius: 999px;\n  background: #ffe2e8;\n  color: #9b3447;\n  display: grid;\n  place-items: center;\n  font-size: 0.65rem;\n  font-variant-numeric: tabular-nums;\n}\n.operator-registration__measurement-reports app-smart-list {\n  min-width: 0;\n  width: 100%;\n}\n.operator-registration__measurement-report {\n  min-width: 0;\n  padding: 0.5rem;\n  border: 1px solid rgba(155, 52, 71, 0.13);\n  border-radius: 9px;\n  background: #fff;\n  display: grid;\n  gap: 0.3rem;\n}\n.operator-registration__measurement-report > header {\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.4rem;\n}\n.operator-registration__measurement-report > header > span {\n  min-width: 0;\n  display: grid;\n  gap: 0.02rem;\n}\n.operator-registration__measurement-report > header small {\n  color: rgba(36, 56, 83, 0.52);\n  font-size: 0.56rem;\n  font-weight: 800;\n}\n.operator-registration__measurement-report > header strong {\n  color: #314762;\n  font-size: 0.72rem;\n}\n.operator-registration__measurement-report > header em {\n  padding: 0.18rem 0.38rem;\n  border-radius: 999px;\n  background: #fff0f3;\n  color: #9b3447;\n  font-size: 0.58rem;\n  font-style: normal;\n  font-weight: 900;\n  white-space: nowrap;\n}\n.operator-registration__measurement-window {\n  color: rgba(36, 56, 83, 0.56);\n  font-size: 0.57rem;\n  font-weight: 750;\n}\n.operator-registration__measurement-report > p {\n  margin: 0;\n  color: rgba(36, 56, 83, 0.72);\n  font-size: 0.63rem;\n  font-weight: 720;\n  line-height: 1.35;\n}\n.operator-registration__measurement-report > code {\n  color: #9b3447;\n  font-size: 0.56rem;\n  font-weight: 800;\n  overflow-wrap: anywhere;\n}\n.operator-registration__measurement-report dl {\n  margin: 0;\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.28rem;\n}\n.operator-registration__measurement-report dl > div {\n  min-width: 0;\n  display: grid;\n  gap: 0.02rem;\n}\n.operator-registration__measurement-report dd {\n  min-width: 0;\n  margin: 0;\n  color: #314762;\n  font-size: 0.61rem;\n  font-weight: 850;\n  overflow-wrap: anywhere;\n}\n.operator-registration__measurement-report app-menu {\n  width: min(100%, 210px);\n}\n@media (max-width: 560px) {\n  .operator-registration__actions {\n    justify-self: stretch;\n    width: 100%;\n  }\n  .operator-registration__measurement-delivery > header {\n    grid-template-columns: auto minmax(0, 1fr);\n  }\n  .operator-registration__measurement-delivery > header time {\n    grid-column: 2;\n  }\n  .operator-registration__measurement-delivery dl {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n  .operator-registration__measurement-actions {\n    justify-self: stretch;\n    width: 100%;\n  }\n  .operator-registration__measurement-report dl {\n    grid-template-columns: minmax(0, 1fr);\n  }\n}\n/*# sourceMappingURL=operator-registry-popup.component.css.map */\n"] }]
  }], null, { measurementReportsSmartList: [{
    type: ViewChild,
    args: ["measurementReportsSmartList"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(OperatorRegistryPopupComponent, { className: "OperatorRegistryPopupComponent", filePath: "app/operator/components/operator-registry-popup/operator-registry-popup.component.ts", lineNumber: 67 });
})();
export {
  OperatorRegistryPopupComponent
};
//# sourceMappingURL=operator-registry-popup.component-5B5VMXOF.js.map
