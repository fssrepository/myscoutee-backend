import {
  OperatorWorkspaceStore
} from "./chunk-XOYWMQRU.js";
import "./chunk-64GWAN6R.js";
import {
  OperatorLeaderboardStore,
  OperatorMenuStore,
  OperatorRegistryStore
} from "./chunk-ZIP4R74W.js";
import "./chunk-SYKOEE4K.js";
import {
  SmartListComponent
} from "./chunk-IJVUZ62I.js";
import {
  FormFlowComponent
} from "./chunk-654Z7UJY.js";
import {
  LinkInputComponent
} from "./chunk-H3IGIWEC.js";
import {
  ImageCarouselComponent
} from "./chunk-RRRWUAB3.js";
import "./chunk-EWJPTHFE.js";
import "./chunk-RJSPRCFL.js";
import {
  SingleRowComponent
} from "./chunk-BEAS7CFC.js";
import "./chunk-EGWJQCT5.js";
import "./chunk-YTMD6HU4.js";
import "./chunk-4VYYFWRA.js";
import "./chunk-QEZI4ZBE.js";
import "./chunk-MEY2M2U3.js";
import "./chunk-ZBJCMF52.js";
import {
  PopupComponent
} from "./chunk-3VXLUVWM.js";
import "./chunk-VEYRCVMX.js";
import "./chunk-MVR37RGJ.js";
import {
  AppMenuComponent,
  DefaultValueAccessor,
  FormsModule,
  I18nPipe,
  IndicatorComponent,
  MaxLengthValidator,
  MinValidator,
  NgControlStatus,
  NgModel,
  NumberValueAccessor
} from "./chunk-FOAFZS65.js";
import {
  DialogStore
} from "./chunk-6TR3Z2F3.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-EDHGCWPF.js";
import "./chunk-CUDLB52K.js";
import "./chunk-3E7FCXD6.js";
import "./chunk-AKR4UUHK.js";
import "./chunk-QE3AUXWT.js";
import "./chunk-2LVO4Z3J.js";
import "./chunk-PK4DOAMC.js";
import "./chunk-4M7S3PHB.js";
import "./chunk-5PHTFUHA.js";
import "./chunk-F4WY6ECV.js";
import {
  I18nService
} from "./chunk-Q3344WPR.js";
import "./chunk-XQ4NDAVX.js";
import "./chunk-4FWVIYNI.js";
import "./chunk-7MTG4XZU.js";
import {
  CommonModule,
  NgClass
} from "./chunk-J7IJFFQ2.js";
import {
  DEPLOYMENT_THEME_PRESETS
} from "./chunk-XQACYBVS.js";
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
  DestroyRef,
  Input,
  ViewChild,
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
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵviewQuery
} from "./chunk-XJL7SWH7.js";

// src/app/operator/components/operator-revenue-view/operator-revenue-view.component.ts
var _forTrack0 = ($index, $item) => $item.key;
var _forTrack1 = ($index, $item) => $item.dateKey;
function OperatorRevenueViewComponent_Conditional_0_Conditional_0_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 5)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "app-menu", 25);
    \u0275\u0275listener("itemSelect", function OperatorRevenueViewComponent_Conditional_0_Conditional_0_Conditional_16_Template_app_menu_itemSelect_4_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.onCurrencySelect($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 3, "operator.revenue.currency"));
    \u0275\u0275advance(2);
    \u0275\u0275property("trigger", ctx_r2.currencyTrigger())("items", ctx_r2.currencyItems());
  }
}
function OperatorRevenueViewComponent_Conditional_0_Conditional_0_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 6);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const currency_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(currency_r4.currencyCode);
  }
}
function OperatorRevenueViewComponent_Conditional_0_Conditional_0_For_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 8)(1, "span", 26)(2, "mat-icon");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "small");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "strong");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 27);
    \u0275\u0275element(10, "span");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const metric_r5 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275property("ngClass", ctx_r2.toneClass(metric_r5));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(metric_r5.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(6, 6, metric_r5.labelKey));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(metric_r5.valueLabel);
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", metric_r5.percent, "%");
  }
}
function OperatorRevenueViewComponent_Conditional_0_Conditional_0_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11)(1, "strong", 28);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 29);
    \u0275\u0275element(4, "i", 30);
    \u0275\u0275elementStart(5, "span", 31);
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "b");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "span", 29);
    \u0275\u0275element(11, "i", 32);
    \u0275\u0275elementStart(12, "span", 31);
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "b");
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "span", 29);
    \u0275\u0275element(18, "i", 33);
    \u0275\u0275elementStart(19, "span", 31);
    \u0275\u0275text(20);
    \u0275\u0275pipe(21, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "b");
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "span", 29);
    \u0275\u0275element(25, "i", 34);
    \u0275\u0275elementStart(26, "span", 31);
    \u0275\u0275text(27);
    \u0275\u0275pipe(28, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "b");
    \u0275\u0275text(30);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const point_r6 = ctx;
    const currency_r4 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(point_r6.label);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(7, 9, "operator.revenue.timeline.projected.events"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r2.formatMinor(point_r6.projectedEventMinor, currency_r4));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(14, 11, "operator.revenue.timeline.projected.assets"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r2.formatMinor(point_r6.projectedAssetMinor, currency_r4));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(21, 13, "operator.revenue.timeline.net.payments"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r2.formatMinor(point_r6.netPaymentMinor, currency_r4));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(28, 15, "operator.revenue.timeline.estimated.commission"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r2.formatMinor(point_r6.estimatedCommissionMinor, currency_r4));
  }
}
function OperatorRevenueViewComponent_Conditional_0_Conditional_0_For_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "polyline", 17);
  }
  if (rf & 2) {
    const metric_r7 = ctx.$implicit;
    const currency_r4 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngClass", "is-" + metric_r7.tone);
    \u0275\u0275attribute("points", ctx_r2.timelineChartPoints(currency_r4.timeline, metric_r7.key));
  }
}
function OperatorRevenueViewComponent_Conditional_0_Conditional_0_Conditional_43_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "circle", 18);
  }
  if (rf & 2) {
    const currency_r4 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("cx", ctx_r2.selectedTimelineX(currency_r4))("cy", ctx_r2.selectedTimelineY(currency_r4));
  }
}
function OperatorRevenueViewComponent_Conditional_0_Conditional_0_For_45_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "circle", 35);
    \u0275\u0275listener("focus", function OperatorRevenueViewComponent_Conditional_0_Conditional_0_For_45_Template_circle_focus_0_listener() {
      const point_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.selectTimelinePoint(point_r9));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const \u0275$index_148_r10 = ctx.$index;
    const currency_r4 = \u0275\u0275nextContext();
    \u0275\u0275attribute("cx", 12 + \u0275$index_148_r10 * 276 / (currency_r4.timeline.length > 1 ? currency_r4.timeline.length - 1 : 1));
  }
}
function OperatorRevenueViewComponent_Conditional_0_Conditional_0_For_59_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 36);
  }
  if (rf & 2) {
    const category_r11 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275styleProp("flex-grow", category_r11.projectedMinor);
    \u0275\u0275property("ngClass", ctx_r2.toneClass(category_r11));
  }
}
function OperatorRevenueViewComponent_Conditional_0_Conditional_0_For_62_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24)(1, "span");
    \u0275\u0275element(2, "i");
    \u0275\u0275elementStart(3, "mat-icon");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "small");
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "strong");
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span", 37);
    \u0275\u0275element(13, "span");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const category_r12 = ctx.$implicit;
    const currency_r4 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngClass", ctx_r2.toneClass(category_r12));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(category_r12.icon || "category");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(6, 8, ctx_r2.itemLabel(category_r12)), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", category_r12.payableAssets, " ", \u0275\u0275pipeBind1(9, 10, "operator.revenue.asset.items"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r2.formatMinor(category_r12.projectedMinor, currency_r4));
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", ctx_r2.categoryPercent(category_r12, currency_r4), "%");
  }
}
function OperatorRevenueViewComponent_Conditional_0_Conditional_0_ForEmpty_63_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 1);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 1, "operator.revenue.assets.empty"), " ");
  }
}
function OperatorRevenueViewComponent_Conditional_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 0);
    \u0275\u0275pipe(1, "i18n");
    \u0275\u0275elementStart(2, "header", 2)(3, "span", 3)(4, "small");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "strong");
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "span", 4)(11, "small");
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "strong");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(16, OperatorRevenueViewComponent_Conditional_0_Conditional_0_Conditional_16_Template, 5, 5, "div", 5)(17, OperatorRevenueViewComponent_Conditional_0_Conditional_0_Conditional_17_Template, 2, 1, "span", 6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "div", 7);
    \u0275\u0275repeaterCreate(19, OperatorRevenueViewComponent_Conditional_0_Conditional_0_For_20_Template, 11, 8, "article", 8, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "div", 9)(22, "article", 10)(23, "header")(24, "span")(25, "small");
    \u0275\u0275text(26);
    \u0275\u0275pipe(27, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "strong");
    \u0275\u0275text(29);
    \u0275\u0275pipe(30, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "em");
    \u0275\u0275text(32);
    \u0275\u0275pipe(33, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(34, OperatorRevenueViewComponent_Conditional_0_Conditional_0_Conditional_34_Template, 31, 17, "div", 11);
    \u0275\u0275elementStart(35, "div", 12);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(36, "svg", 13);
    \u0275\u0275pipe(37, "i18n");
    \u0275\u0275listener("pointerdown", function OperatorRevenueViewComponent_Conditional_0_Conditional_0_Template_svg_pointerdown_36_listener($event) {
      const currency_r4 = \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.startTimelineDrag($event, currency_r4.timeline));
    })("pointermove", function OperatorRevenueViewComponent_Conditional_0_Conditional_0_Template_svg_pointermove_36_listener($event) {
      const currency_r4 = \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.moveTimelinePointer($event, currency_r4.timeline));
    })("pointerup", function OperatorRevenueViewComponent_Conditional_0_Conditional_0_Template_svg_pointerup_36_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.endTimelineDrag($event));
    })("pointercancel", function OperatorRevenueViewComponent_Conditional_0_Conditional_0_Template_svg_pointercancel_36_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.endTimelineDrag($event));
    })("lostpointercapture", function OperatorRevenueViewComponent_Conditional_0_Conditional_0_Template_svg_lostpointercapture_36_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.endTimelineDrag());
    });
    \u0275\u0275element(38, "line", 14)(39, "line", 15)(40, "line", 16);
    \u0275\u0275repeaterCreate(41, OperatorRevenueViewComponent_Conditional_0_Conditional_0_For_42_Template, 1, 2, ":svg:polyline", 17, _forTrack0);
    \u0275\u0275conditionalCreate(43, OperatorRevenueViewComponent_Conditional_0_Conditional_0_Conditional_43_Template, 1, 2, ":svg:circle", 18);
    \u0275\u0275repeaterCreate(44, OperatorRevenueViewComponent_Conditional_0_Conditional_0_For_45_Template, 1, 1, ":svg:circle", 19, _forTrack1);
    \u0275\u0275elementEnd()()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(46, "article", 20)(47, "header")(48, "span")(49, "small");
    \u0275\u0275text(50);
    \u0275\u0275pipe(51, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(52, "strong");
    \u0275\u0275text(53);
    \u0275\u0275pipe(54, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(55, "mat-icon");
    \u0275\u0275text(56, "donut_large");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(57, "div", 21);
    \u0275\u0275repeaterCreate(58, OperatorRevenueViewComponent_Conditional_0_Conditional_0_For_59_Template, 1, 3, "span", 22, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(60, "div", 23);
    \u0275\u0275repeaterCreate(61, OperatorRevenueViewComponent_Conditional_0_Conditional_0_For_62_Template, 14, 12, "div", 24, _forTrack0, false, OperatorRevenueViewComponent_Conditional_0_Conditional_0_ForEmpty_63_Template, 3, 3, "p", 1);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_15_0;
    const currency_r4 = ctx;
    const revenue_r13 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(1, 18, "operator.action.revenue"));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(6, 20, "operator.revenue.ruleset"));
    \u0275\u0275advance(2);
    \u0275\u0275attribute("title", revenue_r13.rulesetVersion);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(9, 22, ctx_r2.rulesetLabelKey(revenue_r13.rulesetVersion), revenue_r13.rulesetVersion), " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(13, 25, "operator.revenue.commission.rate"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r2.commissionRateLabel(revenue_r13.commissionRateBasisPoints));
    \u0275\u0275advance();
    \u0275\u0275conditional(revenue_r13.currencies.length > 1 ? 16 : 17);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r2.metrics(currency_r4));
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(27, 27, "operator.revenue.timeline.eyebrow"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(30, 29, "operator.revenue.timeline.title"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(33, 31, "operator.revenue.window"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_15_0 = ctx_r2.selectedTimelinePoint(currency_r4)) ? 34 : -1, tmp_15_0);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("is-dragging", ctx_r2.timelineDragging());
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(37, 33, "operator.revenue.timeline.title"));
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r2.timelineMetrics);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.selectedTimelinePoint(currency_r4) ? 43 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(currency_r4.timeline);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(51, 35, "operator.revenue.assets.eyebrow"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(54, 37, "operator.revenue.asset.categories"));
    \u0275\u0275advance(5);
    \u0275\u0275repeater(currency_r4.assetCategories);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(currency_r4.assetCategories);
  }
}
function OperatorRevenueViewComponent_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 1);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "operator.revenue.empty"));
  }
}
function OperatorRevenueViewComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, OperatorRevenueViewComponent_Conditional_0_Conditional_0_Template, 64, 39, "section", 0)(1, OperatorRevenueViewComponent_Conditional_0_Conditional_1_Template, 3, 3, "p", 1);
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_2_0 = ctx_r2.selectedCurrency()) ? 0 : 1, tmp_2_0);
  }
}
var OperatorRevenueViewComponent = class _OperatorRevenueViewComponent {
  i18n = inject(I18nService);
  revenueRef = null;
  selectedCurrencyCode = signal("", ...ngDevMode ? [{ debugName: "selectedCurrencyCode" }] : (
    /* istanbul ignore next */
    []
  ));
  selectedTimeline = signal(null, ...ngDevMode ? [{ debugName: "selectedTimeline" }] : (
    /* istanbul ignore next */
    []
  ));
  timelineDragging = signal(false, ...ngDevMode ? [{ debugName: "timelineDragging" }] : (
    /* istanbul ignore next */
    []
  ));
  timelineMetrics = [
    {
      key: "projectedEventMinor",
      labelKey: "operator.revenue.timeline.projected.events",
      tone: "green"
    },
    {
      key: "projectedAssetMinor",
      labelKey: "operator.revenue.timeline.projected.assets",
      tone: "blue"
    },
    {
      key: "netPaymentMinor",
      labelKey: "operator.revenue.timeline.net.payments",
      tone: "gold"
    },
    {
      key: "estimatedCommissionMinor",
      labelKey: "operator.revenue.timeline.estimated.commission",
      tone: "purple"
    }
  ];
  set revenue(value) {
    this.revenueRef = value ?? null;
    const selected = this.selectedCurrency();
    this.selectedCurrencyCode.set(selected?.currencyCode ?? value?.currencies[0]?.currencyCode ?? "");
    this.selectedTimeline.set(this.selectedCurrency()?.timeline.at(-1) ?? null);
    this.timelineDragging.set(false);
  }
  revenueModel() {
    return this.revenueRef;
  }
  selectedCurrency() {
    const currencies = this.revenueRef?.currencies ?? [];
    const selectedCode = this.selectedCurrencyCode().trim().toUpperCase();
    return currencies.find((currency) => currency.currencyCode.trim().toUpperCase() === selectedCode) ?? currencies[0] ?? null;
  }
  rulesetLabelKey(value) {
    const rulesetVersion = `${value ?? ""}`.trim();
    return rulesetVersion ? `operator.revenue.ruleset.${rulesetVersion}` : "";
  }
  currencyTrigger() {
    const currency = this.selectedCurrency();
    return {
      label: currency?.currencyCode || "operator.revenue.currency.select",
      icon: "currency_exchange",
      palette: "green",
      layout: "field",
      ariaLabel: "operator.revenue.currency.select"
    };
  }
  currencyItems() {
    const selectedCode = this.selectedCurrency()?.currencyCode ?? "";
    const palettes = ["green", "blue", "gold", "violet", "teal"];
    return (this.revenueRef?.currencies ?? []).map((currency, index) => ({
      id: `operator-revenue-currency-${currency.currencyCode.toLowerCase()}`,
      label: currency.currencyCode,
      detail: this.formatMinor(currency.netPaymentMinor, currency),
      icon: "payments",
      kind: "radio",
      palette: palettes[index % palettes.length],
      active: currency.currencyCode === selectedCode,
      checked: currency.currencyCode === selectedCode,
      context: {
        currencyCode: currency.currencyCode
      }
    }));
  }
  onCurrencySelect(event) {
    const currencyCode = event.context?.currencyCode?.trim() ?? "";
    if (!currencyCode) {
      return;
    }
    this.selectedCurrencyCode.set(currencyCode);
    this.selectedTimeline.set(this.selectedCurrency()?.timeline.at(-1) ?? null);
    this.timelineDragging.set(false);
  }
  metrics(currency) {
    const amountMax = Math.max(1, currency.projectedEventMinor, currency.projectedAssetMinor, currency.capturedPaymentMinor, currency.refundedPaymentMinor, currency.netPaymentMinor, currency.commissionBasisMinor, currency.estimatedCommissionMinor);
    const countMax = Math.max(1, currency.payableEvents, currency.payableAssets, currency.paymentCount, currency.payingUsers, currency.eventBuyers, currency.assetBorrowers);
    const amount = (key, labelKey, value, icon, tone) => ({
      key,
      labelKey,
      valueLabel: this.formatMinor(value, currency),
      icon,
      tone,
      percent: this.percent(value, amountMax)
    });
    const count = (key, labelKey, value, icon, tone) => ({
      key,
      labelKey,
      valueLabel: this.formatNumber(value),
      icon,
      tone,
      percent: this.percent(value, countMax)
    });
    return [
      count("payable-events", "operator.revenue.metric.payable.events", currency.payableEvents, "confirmation_number", "green"),
      amount("projected-events", "operator.revenue.metric.projected.events", currency.projectedEventMinor, "event_available", "green"),
      count("payable-assets", "operator.revenue.metric.payable.assets", currency.payableAssets, "inventory_2", "purple"),
      amount("projected-assets", "operator.revenue.metric.projected.assets", currency.projectedAssetMinor, "category", "blue"),
      amount("captured-payments", "operator.revenue.metric.captured.payments", currency.capturedPaymentMinor, "paid", "blue"),
      amount("refunded-payments", "operator.revenue.metric.refunded.payments", currency.refundedPaymentMinor, "currency_exchange", "red"),
      amount("net-payments", "operator.revenue.metric.net.payments", currency.netPaymentMinor, "account_balance_wallet", "gold"),
      amount("commission-basis", "operator.revenue.metric.commission.basis", currency.commissionBasisMinor, "calculate", "slate"),
      amount("estimated-commission", "operator.revenue.metric.estimated.commission", currency.estimatedCommissionMinor, "savings", "purple"),
      count("payments", "operator.revenue.metric.payment.count", currency.paymentCount, "receipt_long", "slate"),
      count("paying-users", "operator.revenue.metric.paying.users", currency.payingUsers, "group", "red"),
      count("event-buyers", "operator.revenue.metric.event.buyers", currency.eventBuyers, "local_activity", "green"),
      count("asset-borrowers", "operator.revenue.metric.asset.borrowers", currency.assetBorrowers, "assignment_returned", "gold")
    ];
  }
  selectedTimelinePoint(currency) {
    const selected = this.selectedTimeline();
    if (selected && currency.timeline.some((point) => point.dateKey === selected.dateKey)) {
      return selected;
    }
    return currency.timeline.at(-1) ?? null;
  }
  selectedTimelineX(currency) {
    const selected = this.selectedTimelinePoint(currency);
    const index = selected ? currency.timeline.findIndex((point) => point.dateKey === selected.dateKey) : -1;
    return this.timelineX(index < 0 ? Math.max(0, currency.timeline.length - 1) : index, currency.timeline.length);
  }
  selectedTimelineY(currency) {
    const selected = this.selectedTimelinePoint(currency);
    return this.timelineY(selected?.netPaymentMinor ?? 0, this.timelineDomainMax(currency.timeline));
  }
  selectTimelinePoint(point) {
    this.selectedTimeline.set(point);
  }
  startTimelineDrag(event, points) {
    if (!points.length) {
      return;
    }
    this.timelineDragging.set(true);
    this.updateTimelineFromPointer(event, points);
    const target = event.currentTarget;
    target?.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }
  moveTimelinePointer(event, points) {
    this.updateTimelineFromPointer(event, points);
    if (this.timelineDragging()) {
      event.preventDefault();
    }
  }
  endTimelineDrag(event) {
    if (!this.timelineDragging()) {
      return;
    }
    this.timelineDragging.set(false);
    const target = event?.currentTarget;
    if (event && target?.hasPointerCapture?.(event.pointerId)) {
      target.releasePointerCapture(event.pointerId);
    }
  }
  timelineChartPoints(points, metric) {
    if (!points.length) {
      return "";
    }
    const domainMax = this.timelineDomainMax(points);
    return points.map((point, index) => `${this.timelineX(index, points.length)},${this.timelineY(this.timelineMetricValue(point, metric), domainMax)}`).join(" ");
  }
  formatMinor(value, currency) {
    const fractionDigits = this.clamp(Math.trunc(Number(currency.fractionDigits) || 0), 0, 6);
    const minor = Math.trunc(Number(value) || 0);
    const major = minor / 10 ** fractionDigits;
    const currencyCode = currency.currencyCode.trim().toUpperCase();
    try {
      return new Intl.NumberFormat(this.i18n.currentLanguage(), {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
      }).format(major);
    } catch {
      return `${currencyCode} ${major.toFixed(fractionDigits)}`.trim();
    }
  }
  commissionRateLabel(value) {
    return new Intl.NumberFormat(this.i18n.currentLanguage(), {
      style: "percent",
      minimumFractionDigits: value % 100 === 0 ? 0 : 2,
      maximumFractionDigits: 2
    }).format(Math.max(0, Number(value) || 0) / 1e4);
  }
  categoryPercent(category, currency) {
    return this.percent(category.projectedMinor, currency.projectedAssetMinor);
  }
  itemLabel(category) {
    return category.label?.trim() || category.labelKey.trim() || category.key.trim();
  }
  toneClass(value) {
    const tone = `${value?.tone ?? ""}`.trim();
    return ["blue", "green", "gold", "red", "purple", "slate"].includes(tone) ? `is-${tone}` : "is-slate";
  }
  timelineMetricValue(point, metric) {
    return Math.max(0, Number(point[metric]) || 0);
  }
  timelineDomainMax(points) {
    return Math.max(1, ...points.flatMap((point) => this.timelineMetrics.map((metric) => this.timelineMetricValue(point, metric.key))));
  }
  timelineX(index, total) {
    return Math.round(12 + Math.max(0, index) * 276 / Math.max(1, total - 1));
  }
  timelineY(value, max) {
    return Math.round(94 - this.clamp(value, 0, max) * 72 / Math.max(1, max));
  }
  updateTimelineFromPointer(event, points) {
    const target = event.currentTarget;
    if (!target || !points.length) {
      return;
    }
    const bounds = target.getBoundingClientRect();
    const width = Math.max(1, bounds.width);
    const viewBoxX = (event.clientX - bounds.left) / width * 300;
    const ratio = this.clamp((viewBoxX - 12) / 276, 0, 1);
    const index = Math.round(ratio * Math.max(0, points.length - 1));
    this.selectedTimeline.set(points[this.clamp(index, 0, points.length - 1)] ?? points.at(-1) ?? null);
  }
  formatNumber(value) {
    return new Intl.NumberFormat(this.i18n.currentLanguage(), {
      maximumFractionDigits: 0
    }).format(Math.max(0, Math.trunc(Number(value) || 0)));
  }
  percent(value, total) {
    return this.clamp(Math.round(Math.max(0, Number(value) || 0) * 100 / Math.max(1, total)), 0, 100);
  }
  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
  static \u0275fac = function OperatorRevenueViewComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OperatorRevenueViewComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _OperatorRevenueViewComponent, selectors: [["app-operator-revenue-view"]], inputs: { revenue: "revenue" }, decls: 1, vars: 1, consts: [[1, "operator-revenue"], [1, "operator-revenue__empty"], [1, "operator-revenue__toolbar"], [1, "operator-revenue__rules"], [1, "operator-revenue__commission"], [1, "operator-revenue__currency"], [1, "operator-revenue__currency-code"], [1, "operator-revenue__metric-grid"], [1, "operator-revenue__metric", 3, "ngClass"], [1, "operator-revenue__layout"], [1, "operator-revenue__timeline"], [1, "operator-revenue__timeline-readout"], [1, "operator-revenue__chart"], ["viewBox", "0 0 300 108", "role", "img", "tabindex", "0", 1, "motion-static", 3, "pointerdown", "pointermove", "pointerup", "pointercancel", "lostpointercapture"], ["x1", "12", "y1", "94", "x2", "288", "y2", "94", 1, "operator-revenue__axis"], ["x1", "12", "y1", "58", "x2", "288", "y2", "58", 1, "operator-revenue__gridline"], ["x1", "12", "y1", "22", "x2", "288", "y2", "22", 1, "operator-revenue__gridline"], [1, "operator-revenue__line", 3, "ngClass"], ["r", "4", 1, "operator-revenue__scrub-knob"], ["cy", "58", "r", "8", "tabindex", "0", 1, "operator-revenue__hit"], [1, "operator-revenue__assets"], ["aria-hidden", "true", 1, "operator-revenue__donut"], [3, "ngClass", "flex-grow"], [1, "operator-revenue__breakdown"], [1, "operator-revenue__breakdown-row", 3, "ngClass"], ["kind", "select", 3, "itemSelect", "trigger", "items"], [1, "operator-revenue__metric-icon"], [1, "operator-revenue__metric-bar"], [1, "operator-revenue__timeline-date"], [1, "operator-revenue__timeline-legend"], [1, "is-green"], [1, "operator-revenue__timeline-legend-label"], [1, "is-blue"], [1, "is-gold"], [1, "is-purple"], ["cy", "58", "r", "8", "tabindex", "0", 1, "operator-revenue__hit", 3, "focus"], [3, "ngClass"], [1, "operator-revenue__breakdown-bar"]], template: function OperatorRevenueViewComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, OperatorRevenueViewComponent_Conditional_0_Template, 2, 1);
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275conditional((tmp_0_0 = ctx.revenueModel()) ? 0 : -1, tmp_0_0);
    }
  }, dependencies: [
    AppMenuComponent,
    CommonModule,
    NgClass,
    MatIconModule,
    MatIcon,
    I18nPipe
  ], styles: ["\n[_nghost-%COMP%] {\n  min-width: 0;\n  display: block;\n  color: #243853;\n}\n*[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n}\n.operator-revenue[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.72rem;\n}\n.operator-revenue__toolbar[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding: 0.62rem 0.68rem;\n  border: 1px solid rgba(31, 126, 91, 0.14);\n  border-radius: 12px;\n  background: #f0f9f5;\n  display: flex;\n  align-items: center;\n  gap: 0.7rem;\n}\n.operator-revenue__toolbar[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%], \n.operator-revenue__currency[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.08rem;\n}\n.operator-revenue__toolbar[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.operator-revenue__currency[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  color: rgba(36, 56, 83, 0.58);\n  font-size: 0.72rem;\n  font-weight: 850;\n}\n.operator-revenue__toolbar[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #176b51;\n  font-size: 0.82rem;\n  overflow-wrap: anywhere;\n}\n.operator-revenue__commission[_ngcontent-%COMP%] {\n  margin-right: auto;\n}\n.operator-revenue__currency[_ngcontent-%COMP%] {\n  width: min(220px, 42%);\n}\n.operator-revenue__currency[_ngcontent-%COMP%]   app-menu[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.operator-revenue__currency-code[_ngcontent-%COMP%] {\n  min-width: 58px !important;\n  min-height: 34px;\n  padding: 0 0.65rem;\n  border-radius: 999px;\n  background: #daf1e7;\n  color: #176b51;\n  display: grid !important;\n  place-items: center;\n  font-size: 0.74rem;\n  font-weight: 950;\n  letter-spacing: 0.06em;\n}\n.operator-revenue__metric-grid[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 0.5rem;\n}\n.operator-revenue__metric[_ngcontent-%COMP%] {\n  --revenue-tone: #64748b;\n  --revenue-tone-soft: #edf1f5;\n  min-width: 0;\n  min-height: 82px;\n  padding: 0.58rem;\n  border: 1px solid color-mix(in srgb, var(--revenue-tone) 16%, transparent);\n  border-radius: 12px;\n  background: color-mix(in srgb, var(--revenue-tone-soft) 74%, white);\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr);\n  grid-template-rows: auto auto auto;\n  align-items: center;\n  gap: 0.12rem 0.42rem;\n}\n.operator-revenue__metric-icon[_ngcontent-%COMP%] {\n  grid-row: 1/span 2;\n  width: 28px;\n  height: 28px;\n  border-radius: 9px;\n  background: var(--revenue-tone-soft);\n  color: var(--revenue-tone);\n  display: grid;\n  place-items: center;\n}\n.operator-revenue__metric-icon[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n}\n.operator-revenue__metric[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  min-width: 0;\n  color: rgba(36, 56, 83, 0.62);\n  font-size: 0.72rem;\n  font-weight: 850;\n  line-height: 1.25;\n  overflow-wrap: anywhere;\n}\n.operator-revenue__metric[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  min-width: 0;\n  color: var(--revenue-tone);\n  font-size: 0.84rem;\n  line-height: 1.2;\n  overflow-wrap: anywhere;\n}\n.operator-revenue__metric-bar[_ngcontent-%COMP%], \n.operator-revenue__breakdown-bar[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n  height: 4px;\n  overflow: hidden;\n  border-radius: 999px;\n  background: rgba(39, 62, 94, 0.09);\n}\n.operator-revenue__metric-bar[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%], \n.operator-revenue__breakdown-bar[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  height: 100%;\n  border-radius: inherit;\n  background: var(--revenue-tone);\n  display: block;\n}\n.operator-revenue__layout[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: minmax(0, 1.65fr) minmax(230px, 0.85fr);\n  gap: 0.6rem;\n}\n.operator-revenue__timeline[_ngcontent-%COMP%], \n.operator-revenue__assets[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding: 0.68rem;\n  border: 1px solid rgba(45, 66, 98, 0.11);\n  border-radius: 13px;\n  background: #fbfcfe;\n  display: grid;\n  gap: 0.55rem;\n}\n.operator-revenue__timeline[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%], \n.operator-revenue__assets[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n}\n.operator-revenue__timeline[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%], \n.operator-revenue__assets[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.04rem;\n}\n.operator-revenue__timeline[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.operator-revenue__assets[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: rgba(36, 56, 83, 0.54);\n  font-size: 0.72rem;\n  font-weight: 850;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n}\n.operator-revenue__timeline[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.operator-revenue__assets[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #263d59;\n  font-size: 0.82rem;\n}\n.operator-revenue__timeline[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  padding: 0.22rem 0.48rem;\n  border-radius: 999px;\n  background: #e8f5ef;\n  color: #187258;\n  font-size: 0.72rem;\n  font-style: normal;\n  font-weight: 900;\n}\n.operator-revenue__assets[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #6650c9;\n}\n.operator-revenue__timeline-readout[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  align-items: start;\n  gap: 0.42rem 0.7rem;\n}\n.operator-revenue__timeline-date[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n  color: #273e5a;\n  font-size: 0.78rem;\n}\n.operator-revenue__timeline-legend[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr);\n  grid-template-rows: auto auto;\n  align-items: start;\n  gap: 0.08rem 0.28rem;\n  color: rgba(36, 56, 83, 0.7);\n  font-size: 0.72rem;\n  font-weight: 800;\n  line-height: 1.3;\n}\n.operator-revenue__timeline-legend[_ngcontent-%COMP%]    > i[_ngcontent-%COMP%] {\n  grid-row: 1/span 2;\n  margin-top: 0.22rem;\n}\n.operator-revenue__timeline-legend-label[_ngcontent-%COMP%] {\n  min-width: 0;\n  overflow-wrap: anywhere;\n}\n.operator-revenue__timeline-legend[_ngcontent-%COMP%]    > b[_ngcontent-%COMP%] {\n  min-width: 0;\n  color: #273e5a;\n  font-size: 0.74rem;\n  font-variant-numeric: tabular-nums;\n  line-height: 1.2;\n  white-space: nowrap;\n}\n.operator-revenue__timeline-legend[_ngcontent-%COMP%]    > i[_ngcontent-%COMP%], \n.operator-revenue__breakdown-row[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  width: 7px;\n  height: 7px;\n  border-radius: 50%;\n  background: var(--revenue-tone);\n}\n.operator-revenue__chart[_ngcontent-%COMP%] {\n  min-width: 0;\n  min-height: 126px;\n  padding: 0.2rem;\n  border-radius: 10px;\n  background:\n    linear-gradient(\n      180deg,\n      #f7fafc,\n      #fff);\n}\n.operator-revenue__chart[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 126px;\n  display: block;\n  cursor: crosshair;\n  touch-action: none;\n  transform: none;\n}\n.operator-revenue__chart[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid rgba(35, 135, 94, 0.34);\n  outline-offset: 2px;\n}\n.operator-revenue__axis[_ngcontent-%COMP%], \n.operator-revenue__gridline[_ngcontent-%COMP%], \n.operator-revenue__line[_ngcontent-%COMP%], \n.operator-revenue__scrub-knob[_ngcontent-%COMP%] {\n  pointer-events: none;\n  transform: none;\n  transition: none;\n  vector-effect: non-scaling-stroke;\n}\n.operator-revenue__axis[_ngcontent-%COMP%], \n.operator-revenue__gridline[_ngcontent-%COMP%] {\n  stroke: rgba(63, 83, 112, 0.18);\n  stroke-width: 1;\n}\n.operator-revenue__gridline[_ngcontent-%COMP%] {\n  stroke-dasharray: 3 4;\n}\n.operator-revenue__line[_ngcontent-%COMP%] {\n  fill: none;\n  stroke: var(--revenue-tone);\n  stroke-linecap: round;\n  stroke-linejoin: round;\n  stroke-width: 2.25;\n}\n.operator-revenue__hit[_ngcontent-%COMP%] {\n  fill: transparent;\n  cursor: inherit;\n  outline: none;\n  transform: none;\n  transition: none;\n}\n.operator-revenue__hit[_ngcontent-%COMP%]:hover, \n.operator-revenue__hit[_ngcontent-%COMP%]:focus, \n.operator-revenue__hit[_ngcontent-%COMP%]:focus-visible {\n  r: 8px;\n  stroke-width: 0;\n  transform: none;\n}\n.operator-revenue__scrub-knob[_ngcontent-%COMP%] {\n  fill: #d09b25;\n  stroke: rgba(255, 255, 255, 0.94);\n  stroke-width: 1.5;\n}\n.operator-revenue__donut[_ngcontent-%COMP%] {\n  min-width: 0;\n  height: 12px;\n  overflow: hidden;\n  border-radius: 999px;\n  background: #edf1f5;\n  display: flex;\n}\n.operator-revenue__donut[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  min-width: 2px;\n  background: var(--revenue-tone);\n}\n.operator-revenue__breakdown[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.44rem;\n}\n.operator-revenue__breakdown-row[_ngcontent-%COMP%] {\n  --revenue-tone: #64748b;\n  min-width: 0;\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.18rem 0.45rem;\n}\n.operator-revenue__breakdown-row[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:first-child {\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.25rem;\n  color: #334b67;\n  font-size: 0.74rem;\n  font-weight: 850;\n  line-height: 1.25;\n}\n.operator-revenue__breakdown-row[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:first-child   .mat-icon[_ngcontent-%COMP%] {\n  width: 15px;\n  height: 15px;\n  color: var(--revenue-tone);\n  font-size: 15px;\n}\n.operator-revenue__breakdown-row[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  grid-column: 1;\n  color: rgba(36, 56, 83, 0.56);\n  font-size: 0.72rem;\n  font-weight: 750;\n  line-height: 1.25;\n}\n.operator-revenue__breakdown-row[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  grid-column: 2;\n  grid-row: 1/span 2;\n  color: var(--revenue-tone);\n  font-size: 0.8rem;\n  overflow-wrap: anywhere;\n}\n.operator-revenue__breakdown-bar[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n  height: 3px;\n}\n.operator-revenue__empty[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 1rem;\n  border-radius: 12px;\n  background: #f3f5f8;\n  color: rgba(36, 56, 83, 0.66);\n  font-size: 0.74rem;\n  font-weight: 800;\n  text-align: center;\n}\n.is-green[_ngcontent-%COMP%] {\n  --revenue-tone: #23875e;\n  --revenue-tone-soft: #def3e9;\n}\n.is-blue[_ngcontent-%COMP%] {\n  --revenue-tone: #3474bd;\n  --revenue-tone-soft: #e4eefb;\n}\n.is-gold[_ngcontent-%COMP%] {\n  --revenue-tone: #b67b16;\n  --revenue-tone-soft: #fff0cd;\n}\n.is-red[_ngcontent-%COMP%] {\n  --revenue-tone: #bd4a60;\n  --revenue-tone-soft: #ffe7ec;\n}\n.is-purple[_ngcontent-%COMP%] {\n  --revenue-tone: #6d55be;\n  --revenue-tone-soft: #ece7fb;\n}\n.is-slate[_ngcontent-%COMP%] {\n  --revenue-tone: #617186;\n  --revenue-tone-soft: #e9edf2;\n}\n@media (max-width: 820px) {\n  .operator-revenue__metric-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n  }\n  .operator-revenue__layout[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n}\n@media (max-width: 560px) {\n  .operator-revenue__toolbar[_ngcontent-%COMP%] {\n    align-items: stretch;\n    flex-wrap: wrap;\n  }\n  .operator-revenue__commission[_ngcontent-%COMP%] {\n    margin-right: 0;\n  }\n  .operator-revenue__currency[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  .operator-revenue__currency-code[_ngcontent-%COMP%] {\n    margin-left: auto;\n  }\n  .operator-revenue__metric-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n/*# sourceMappingURL=operator-revenue-view.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OperatorRevenueViewComponent, [{
    type: Component,
    args: [{ selector: "app-operator-revenue-view", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, imports: [
      AppMenuComponent,
      CommonModule,
      I18nPipe,
      MatIconModule
    ], template: `@if (revenueModel(); as revenue) {
  @if (selectedCurrency(); as currency) {
    <section class="operator-revenue" [attr.aria-label]="'operator.action.revenue' | i18n">
      <header class="operator-revenue__toolbar">
        <span class="operator-revenue__rules">
          <small>{{ 'operator.revenue.ruleset' | i18n }}</small>
          <strong [attr.title]="revenue.rulesetVersion">
            {{
              rulesetLabelKey(revenue.rulesetVersion)
                | i18n: revenue.rulesetVersion
            }}
          </strong>
        </span>
        <span class="operator-revenue__commission">
          <small>{{ 'operator.revenue.commission.rate' | i18n }}</small>
          <strong>{{ commissionRateLabel(revenue.commissionRateBasisPoints) }}</strong>
        </span>
        @if (revenue.currencies.length > 1) {
          <div class="operator-revenue__currency">
            <span>{{ 'operator.revenue.currency' | i18n }}</span>
            <app-menu
              kind="select"
              [trigger]="currencyTrigger()"
              [items]="currencyItems()"
              (itemSelect)="onCurrencySelect($event)"
            ></app-menu>
          </div>
        } @else {
          <span class="operator-revenue__currency-code">{{ currency.currencyCode }}</span>
        }
      </header>

      <div class="operator-revenue__metric-grid">
        @for (metric of metrics(currency); track metric.key) {
          <article class="operator-revenue__metric" [ngClass]="toneClass(metric)">
            <span class="operator-revenue__metric-icon">
              <mat-icon>{{ metric.icon }}</mat-icon>
            </span>
            <small>{{ metric.labelKey | i18n }}</small>
            <strong>{{ metric.valueLabel }}</strong>
            <span class="operator-revenue__metric-bar">
              <span [style.width.%]="metric.percent"></span>
            </span>
          </article>
        }
      </div>

      <div class="operator-revenue__layout">
        <article class="operator-revenue__timeline">
          <header>
            <span>
              <small>{{ 'operator.revenue.timeline.eyebrow' | i18n }}</small>
              <strong>{{ 'operator.revenue.timeline.title' | i18n }}</strong>
            </span>
            <em>{{ 'operator.revenue.window' | i18n }}</em>
          </header>

          @if (selectedTimelinePoint(currency); as point) {
            <div class="operator-revenue__timeline-readout">
              <strong class="operator-revenue__timeline-date">{{ point.label }}</strong>
              <span class="operator-revenue__timeline-legend">
                <i class="is-green"></i>
                <span class="operator-revenue__timeline-legend-label">
                  {{ 'operator.revenue.timeline.projected.events' | i18n }}
                </span>
                <b>{{ formatMinor(point.projectedEventMinor, currency) }}</b>
              </span>
              <span class="operator-revenue__timeline-legend">
                <i class="is-blue"></i>
                <span class="operator-revenue__timeline-legend-label">
                  {{ 'operator.revenue.timeline.projected.assets' | i18n }}
                </span>
                <b>{{ formatMinor(point.projectedAssetMinor, currency) }}</b>
              </span>
              <span class="operator-revenue__timeline-legend">
                <i class="is-gold"></i>
                <span class="operator-revenue__timeline-legend-label">
                  {{ 'operator.revenue.timeline.net.payments' | i18n }}
                </span>
                <b>{{ formatMinor(point.netPaymentMinor, currency) }}</b>
              </span>
              <span class="operator-revenue__timeline-legend">
                <i class="is-purple"></i>
                <span class="operator-revenue__timeline-legend-label">
                  {{ 'operator.revenue.timeline.estimated.commission' | i18n }}
                </span>
                <b>{{ formatMinor(point.estimatedCommissionMinor, currency) }}</b>
              </span>
            </div>
          }

          <div class="operator-revenue__chart">
            <svg
              class="motion-static"
              viewBox="0 0 300 108"
              role="img"
              tabindex="0"
              [attr.aria-label]="'operator.revenue.timeline.title' | i18n"
              [class.is-dragging]="timelineDragging()"
              (pointerdown)="startTimelineDrag($event, currency.timeline)"
              (pointermove)="moveTimelinePointer($event, currency.timeline)"
              (pointerup)="endTimelineDrag($event)"
              (pointercancel)="endTimelineDrag($event)"
              (lostpointercapture)="endTimelineDrag()"
            >
              <line x1="12" y1="94" x2="288" y2="94" class="operator-revenue__axis"></line>
              <line x1="12" y1="58" x2="288" y2="58" class="operator-revenue__gridline"></line>
              <line x1="12" y1="22" x2="288" y2="22" class="operator-revenue__gridline"></line>
              @for (metric of timelineMetrics; track metric.key) {
                <polyline
                  class="operator-revenue__line"
                  [ngClass]="'is-' + metric.tone"
                  [attr.points]="timelineChartPoints(currency.timeline, metric.key)"
                ></polyline>
              }
              @if (selectedTimelinePoint(currency)) {
                <circle
                  class="operator-revenue__scrub-knob"
                  [attr.cx]="selectedTimelineX(currency)"
                  [attr.cy]="selectedTimelineY(currency)"
                  r="4"
                ></circle>
              }
              @for (point of currency.timeline; track point.dateKey; let index = $index) {
                <circle
                  class="operator-revenue__hit"
                  [attr.cx]="12 + (index * 276) / (currency.timeline.length > 1 ? currency.timeline.length - 1 : 1)"
                  cy="58"
                  r="8"
                  tabindex="0"
                  (focus)="selectTimelinePoint(point)"
                ></circle>
              }
            </svg>
          </div>
        </article>

        <article class="operator-revenue__assets">
          <header>
            <span>
              <small>{{ 'operator.revenue.assets.eyebrow' | i18n }}</small>
              <strong>{{ 'operator.revenue.asset.categories' | i18n }}</strong>
            </span>
            <mat-icon>donut_large</mat-icon>
          </header>
          <div class="operator-revenue__donut" aria-hidden="true">
            @for (category of currency.assetCategories; track category.key) {
              <span
                [ngClass]="toneClass(category)"
                [style.flex-grow]="category.projectedMinor"
              ></span>
            }
          </div>
          <div class="operator-revenue__breakdown">
            @for (category of currency.assetCategories; track category.key) {
              <div class="operator-revenue__breakdown-row" [ngClass]="toneClass(category)">
                <span>
                  <i></i>
                  <mat-icon>{{ category.icon || 'category' }}</mat-icon>
                  {{ itemLabel(category) | i18n }}
                </span>
                <small>
                  {{ category.payableAssets }}
                  {{ 'operator.revenue.asset.items' | i18n }}
                </small>
                <strong>{{ formatMinor(category.projectedMinor, currency) }}</strong>
                <span class="operator-revenue__breakdown-bar">
                  <span [style.width.%]="categoryPercent(category, currency)"></span>
                </span>
              </div>
            } @empty {
              <p class="operator-revenue__empty">
                {{ 'operator.revenue.assets.empty' | i18n }}
              </p>
            }
          </div>
        </article>
      </div>
    </section>
  } @else {
    <p class="operator-revenue__empty">{{ 'operator.revenue.empty' | i18n }}</p>
  }
}
`, styles: ["/* src/app/operator/components/operator-revenue-view/operator-revenue-view.component.scss */\n:host {\n  min-width: 0;\n  display: block;\n  color: #243853;\n}\n* {\n  box-sizing: border-box;\n}\n.operator-revenue {\n  min-width: 0;\n  display: grid;\n  gap: 0.72rem;\n}\n.operator-revenue__toolbar {\n  min-width: 0;\n  padding: 0.62rem 0.68rem;\n  border: 1px solid rgba(31, 126, 91, 0.14);\n  border-radius: 12px;\n  background: #f0f9f5;\n  display: flex;\n  align-items: center;\n  gap: 0.7rem;\n}\n.operator-revenue__toolbar > span,\n.operator-revenue__currency {\n  min-width: 0;\n  display: grid;\n  gap: 0.08rem;\n}\n.operator-revenue__toolbar small,\n.operator-revenue__currency > span {\n  color: rgba(36, 56, 83, 0.58);\n  font-size: 0.72rem;\n  font-weight: 850;\n}\n.operator-revenue__toolbar strong {\n  color: #176b51;\n  font-size: 0.82rem;\n  overflow-wrap: anywhere;\n}\n.operator-revenue__commission {\n  margin-right: auto;\n}\n.operator-revenue__currency {\n  width: min(220px, 42%);\n}\n.operator-revenue__currency app-menu {\n  width: 100%;\n}\n.operator-revenue__currency-code {\n  min-width: 58px !important;\n  min-height: 34px;\n  padding: 0 0.65rem;\n  border-radius: 999px;\n  background: #daf1e7;\n  color: #176b51;\n  display: grid !important;\n  place-items: center;\n  font-size: 0.74rem;\n  font-weight: 950;\n  letter-spacing: 0.06em;\n}\n.operator-revenue__metric-grid {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 0.5rem;\n}\n.operator-revenue__metric {\n  --revenue-tone: #64748b;\n  --revenue-tone-soft: #edf1f5;\n  min-width: 0;\n  min-height: 82px;\n  padding: 0.58rem;\n  border: 1px solid color-mix(in srgb, var(--revenue-tone) 16%, transparent);\n  border-radius: 12px;\n  background: color-mix(in srgb, var(--revenue-tone-soft) 74%, white);\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr);\n  grid-template-rows: auto auto auto;\n  align-items: center;\n  gap: 0.12rem 0.42rem;\n}\n.operator-revenue__metric-icon {\n  grid-row: 1/span 2;\n  width: 28px;\n  height: 28px;\n  border-radius: 9px;\n  background: var(--revenue-tone-soft);\n  color: var(--revenue-tone);\n  display: grid;\n  place-items: center;\n}\n.operator-revenue__metric-icon .mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n}\n.operator-revenue__metric small {\n  min-width: 0;\n  color: rgba(36, 56, 83, 0.62);\n  font-size: 0.72rem;\n  font-weight: 850;\n  line-height: 1.25;\n  overflow-wrap: anywhere;\n}\n.operator-revenue__metric strong {\n  min-width: 0;\n  color: var(--revenue-tone);\n  font-size: 0.84rem;\n  line-height: 1.2;\n  overflow-wrap: anywhere;\n}\n.operator-revenue__metric-bar,\n.operator-revenue__breakdown-bar {\n  grid-column: 1/-1;\n  height: 4px;\n  overflow: hidden;\n  border-radius: 999px;\n  background: rgba(39, 62, 94, 0.09);\n}\n.operator-revenue__metric-bar > span,\n.operator-revenue__breakdown-bar > span {\n  height: 100%;\n  border-radius: inherit;\n  background: var(--revenue-tone);\n  display: block;\n}\n.operator-revenue__layout {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: minmax(0, 1.65fr) minmax(230px, 0.85fr);\n  gap: 0.6rem;\n}\n.operator-revenue__timeline,\n.operator-revenue__assets {\n  min-width: 0;\n  padding: 0.68rem;\n  border: 1px solid rgba(45, 66, 98, 0.11);\n  border-radius: 13px;\n  background: #fbfcfe;\n  display: grid;\n  gap: 0.55rem;\n}\n.operator-revenue__timeline > header,\n.operator-revenue__assets > header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n}\n.operator-revenue__timeline > header > span,\n.operator-revenue__assets > header > span {\n  display: grid;\n  gap: 0.04rem;\n}\n.operator-revenue__timeline header small,\n.operator-revenue__assets header small {\n  color: rgba(36, 56, 83, 0.54);\n  font-size: 0.72rem;\n  font-weight: 850;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n}\n.operator-revenue__timeline header strong,\n.operator-revenue__assets header strong {\n  color: #263d59;\n  font-size: 0.82rem;\n}\n.operator-revenue__timeline header em {\n  padding: 0.22rem 0.48rem;\n  border-radius: 999px;\n  background: #e8f5ef;\n  color: #187258;\n  font-size: 0.72rem;\n  font-style: normal;\n  font-weight: 900;\n}\n.operator-revenue__assets header .mat-icon {\n  color: #6650c9;\n}\n.operator-revenue__timeline-readout {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  align-items: start;\n  gap: 0.42rem 0.7rem;\n}\n.operator-revenue__timeline-date {\n  grid-column: 1/-1;\n  color: #273e5a;\n  font-size: 0.78rem;\n}\n.operator-revenue__timeline-legend {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr);\n  grid-template-rows: auto auto;\n  align-items: start;\n  gap: 0.08rem 0.28rem;\n  color: rgba(36, 56, 83, 0.7);\n  font-size: 0.72rem;\n  font-weight: 800;\n  line-height: 1.3;\n}\n.operator-revenue__timeline-legend > i {\n  grid-row: 1/span 2;\n  margin-top: 0.22rem;\n}\n.operator-revenue__timeline-legend-label {\n  min-width: 0;\n  overflow-wrap: anywhere;\n}\n.operator-revenue__timeline-legend > b {\n  min-width: 0;\n  color: #273e5a;\n  font-size: 0.74rem;\n  font-variant-numeric: tabular-nums;\n  line-height: 1.2;\n  white-space: nowrap;\n}\n.operator-revenue__timeline-legend > i,\n.operator-revenue__breakdown-row i {\n  width: 7px;\n  height: 7px;\n  border-radius: 50%;\n  background: var(--revenue-tone);\n}\n.operator-revenue__chart {\n  min-width: 0;\n  min-height: 126px;\n  padding: 0.2rem;\n  border-radius: 10px;\n  background:\n    linear-gradient(\n      180deg,\n      #f7fafc,\n      #fff);\n}\n.operator-revenue__chart svg {\n  width: 100%;\n  min-height: 126px;\n  display: block;\n  cursor: crosshair;\n  touch-action: none;\n  transform: none;\n}\n.operator-revenue__chart svg:focus-visible {\n  outline: 2px solid rgba(35, 135, 94, 0.34);\n  outline-offset: 2px;\n}\n.operator-revenue__axis,\n.operator-revenue__gridline,\n.operator-revenue__line,\n.operator-revenue__scrub-knob {\n  pointer-events: none;\n  transform: none;\n  transition: none;\n  vector-effect: non-scaling-stroke;\n}\n.operator-revenue__axis,\n.operator-revenue__gridline {\n  stroke: rgba(63, 83, 112, 0.18);\n  stroke-width: 1;\n}\n.operator-revenue__gridline {\n  stroke-dasharray: 3 4;\n}\n.operator-revenue__line {\n  fill: none;\n  stroke: var(--revenue-tone);\n  stroke-linecap: round;\n  stroke-linejoin: round;\n  stroke-width: 2.25;\n}\n.operator-revenue__hit {\n  fill: transparent;\n  cursor: inherit;\n  outline: none;\n  transform: none;\n  transition: none;\n}\n.operator-revenue__hit:hover,\n.operator-revenue__hit:focus,\n.operator-revenue__hit:focus-visible {\n  r: 8px;\n  stroke-width: 0;\n  transform: none;\n}\n.operator-revenue__scrub-knob {\n  fill: #d09b25;\n  stroke: rgba(255, 255, 255, 0.94);\n  stroke-width: 1.5;\n}\n.operator-revenue__donut {\n  min-width: 0;\n  height: 12px;\n  overflow: hidden;\n  border-radius: 999px;\n  background: #edf1f5;\n  display: flex;\n}\n.operator-revenue__donut span {\n  min-width: 2px;\n  background: var(--revenue-tone);\n}\n.operator-revenue__breakdown {\n  min-width: 0;\n  display: grid;\n  gap: 0.44rem;\n}\n.operator-revenue__breakdown-row {\n  --revenue-tone: #64748b;\n  min-width: 0;\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.18rem 0.45rem;\n}\n.operator-revenue__breakdown-row > span:first-child {\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.25rem;\n  color: #334b67;\n  font-size: 0.74rem;\n  font-weight: 850;\n  line-height: 1.25;\n}\n.operator-revenue__breakdown-row > span:first-child .mat-icon {\n  width: 15px;\n  height: 15px;\n  color: var(--revenue-tone);\n  font-size: 15px;\n}\n.operator-revenue__breakdown-row small {\n  grid-column: 1;\n  color: rgba(36, 56, 83, 0.56);\n  font-size: 0.72rem;\n  font-weight: 750;\n  line-height: 1.25;\n}\n.operator-revenue__breakdown-row strong {\n  grid-column: 2;\n  grid-row: 1/span 2;\n  color: var(--revenue-tone);\n  font-size: 0.8rem;\n  overflow-wrap: anywhere;\n}\n.operator-revenue__breakdown-bar {\n  grid-column: 1/-1;\n  height: 3px;\n}\n.operator-revenue__empty {\n  margin: 0;\n  padding: 1rem;\n  border-radius: 12px;\n  background: #f3f5f8;\n  color: rgba(36, 56, 83, 0.66);\n  font-size: 0.74rem;\n  font-weight: 800;\n  text-align: center;\n}\n.is-green {\n  --revenue-tone: #23875e;\n  --revenue-tone-soft: #def3e9;\n}\n.is-blue {\n  --revenue-tone: #3474bd;\n  --revenue-tone-soft: #e4eefb;\n}\n.is-gold {\n  --revenue-tone: #b67b16;\n  --revenue-tone-soft: #fff0cd;\n}\n.is-red {\n  --revenue-tone: #bd4a60;\n  --revenue-tone-soft: #ffe7ec;\n}\n.is-purple {\n  --revenue-tone: #6d55be;\n  --revenue-tone-soft: #ece7fb;\n}\n.is-slate {\n  --revenue-tone: #617186;\n  --revenue-tone-soft: #e9edf2;\n}\n@media (max-width: 820px) {\n  .operator-revenue__metric-grid {\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n  }\n  .operator-revenue__layout {\n    grid-template-columns: minmax(0, 1fr);\n  }\n}\n@media (max-width: 560px) {\n  .operator-revenue__toolbar {\n    align-items: stretch;\n    flex-wrap: wrap;\n  }\n  .operator-revenue__commission {\n    margin-right: 0;\n  }\n  .operator-revenue__currency {\n    width: 100%;\n  }\n  .operator-revenue__currency-code {\n    margin-left: auto;\n  }\n  .operator-revenue__metric-grid {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n/*# sourceMappingURL=operator-revenue-view.component.css.map */\n"] }]
  }], null, { revenue: [{
    type: Input,
    args: [{ required: true }]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(OperatorRevenueViewComponent, { className: "OperatorRevenueViewComponent", filePath: "app/operator/components/operator-revenue-view/operator-revenue-view.component.ts", lineNumber: 59 });
})();

// src/app/operator/components/operator-action-popup/operator-action-popup.component.ts
var _c0 = ["revenueReportsSmartList"];
var _c1 = (a0) => [a0];
var _c2 = () => [];
var _forTrack02 = ($index, $item) => $item.id;
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275element(1, "app-indicator", 7);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 1, "operator.loading"));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_0_Conditional_0_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 10);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const update_r1 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", \u0275\u0275pipeBind1(2, 2, "operator.update.last.updated"), ": ", ctx_r1.formatDate(update_r1.lastUpdatedAt), " ");
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_0_Conditional_0_Conditional_16_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const update_r1 = \u0275\u0275nextContext(2);
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", ctx_r1.formatBytes(update_r1.progress.bytesDownloaded), " / ", ctx_r1.formatBytes(update_r1.progress.bytesTotal), " ");
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_0_Conditional_0_Conditional_16_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const update_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, update_r1.progress.message));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_0_Conditional_0_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11)(1, "span", 12)(2, "mat-icon");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "b");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(9, "progress", 13);
    \u0275\u0275pipe(10, "i18n");
    \u0275\u0275conditionalCreate(11, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_0_Conditional_0_Conditional_16_Conditional_11_Template, 2, 2, "small");
    \u0275\u0275conditionalCreate(12, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_0_Conditional_0_Conditional_16_Conditional_12_Template, 3, 3, "span");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const update_r1 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275attribute("data-phase", update_r1.progress.phase);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", update_r1.progress.phase === "FAILED" ? "error_outline" : update_r1.progress.phase === "COMPLETED" ? "check_circle" : "sync", " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(6, 8, ctx_r1.updatePhaseLabel(update_r1.progress.phase)));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", update_r1.progress.percent, "%");
    \u0275\u0275advance();
    \u0275\u0275property("value", update_r1.progress.percent);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(10, 10, ctx_r1.updatePhaseLabel(update_r1.progress.phase)));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(update_r1.progress.bytesTotal > 0 ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(update_r1.progress.message ? 12 : -1);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "mat-icon");
    \u0275\u0275text(2, "deployed_code");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span")(4, "small");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "strong");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "span")(10, "small");
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "strong");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(15, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_0_Conditional_0_Conditional_15_Template, 3, 4, "p", 10);
    \u0275\u0275conditionalCreate(16, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_0_Conditional_0_Conditional_16_Template, 13, 12, "div", 11);
  }
  if (rf & 2) {
    const update_r1 = ctx;
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(6, 6, "operator.update.current.version"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(update_r1.currentVersion);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(12, 8, "operator.update.available.version"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(update_r1.availableVersion);
    \u0275\u0275advance();
    \u0275\u0275conditional(update_r1.lastUpdatedAt ? 15 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(update_r1.progress.phase !== "IDLE" ? 16 : -1);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_0_Conditional_0_Template, 17, 10);
  }
  if (rf & 2) {
    let tmp_5_0;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275conditional((tmp_5_0 = ctx_r1.workspace.deploymentUpdate()) ? 0 : -1, tmp_5_0);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_1_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 15)(1, "mat-icon");
    \u0275\u0275text(2, "cloud_off");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const claim_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(5, 1, claim_r4.verificationUnavailableReason || "operator.claim.verification.backend.unavailable"), " ");
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_1_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 15)(1, "mat-icon");
    \u0275\u0275text(2, "app_registration");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 1, "operator.claim.error.registration.required"));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_1_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16)(1, "p", 17)(2, "mat-icon");
    \u0275\u0275text(3, "pending_actions");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 18)(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "small");
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "i18n");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "span", 19);
    \u0275\u0275pipe(12, "i18n");
    \u0275\u0275elementStart(13, "mat-icon");
    \u0275\u0275text(14, "pie_chart");
    \u0275\u0275elementEnd();
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const claim_r4 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(7, 4, "operator.claim.verification.pending"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(10, 6, "operator.claim.verification.pending.instructions"), " ");
    \u0275\u0275advance(2);
    \u0275\u0275attribute("title", \u0275\u0275pipeBind1(12, 8, "operator.leaderboard.share"));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatShare(claim_r4.sharePercent), "% ");
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_1_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16)(1, "p", 20)(2, "mat-icon");
    \u0275\u0275text(3, "block");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 18)(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "small");
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "i18n");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "span", 19);
    \u0275\u0275pipe(12, "i18n");
    \u0275\u0275elementStart(13, "mat-icon");
    \u0275\u0275text(14, "pie_chart");
    \u0275\u0275elementEnd();
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const claim_r4 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(7, 4, "operator.claim.verification.rejected"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(10, 6, "operator.claim.verification.rejected.instructions"), " ");
    \u0275\u0275advance(2);
    \u0275\u0275attribute("title", \u0275\u0275pipeBind1(12, 8, "operator.leaderboard.share"));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatShare(claim_r4.sharePercent), "% ");
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_1_Conditional_0_Conditional_5_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 21)(1, "mat-icon");
    \u0275\u0275text(2, "verified_user");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 1, "operator.claim.verification.approved"));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_1_Conditional_0_Conditional_5_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 20)(1, "mat-icon");
    \u0275\u0275text(2, "pause_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 18)(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "small");
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "i18n");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(6, 2, "operator.claim.eligibility.suspended"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(9, 4, "operator.claim.eligibility.suspended.instructions"), " ");
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_1_Conditional_0_Conditional_5_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 17)(1, "mat-icon");
    \u0275\u0275text(2, "gpp_maybe");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(5, 1, "operator.claim.eligibility.inactive"), " ");
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_1_Conditional_0_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_1_Conditional_0_Conditional_5_Conditional_0_Template, 6, 3, "p", 21)(1, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_1_Conditional_0_Conditional_5_Conditional_1_Template, 10, 6, "p", 20)(2, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_1_Conditional_0_Conditional_5_Conditional_2_Template, 6, 3, "p", 17);
  }
  if (rf & 2) {
    const claim_r4 = \u0275\u0275nextContext();
    \u0275\u0275conditional(claim_r4.eligibilityStatus === "ACTIVE" ? 0 : claim_r4.eligibilityStatus === "SUSPENDED" ? 1 : 2);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_1_Conditional_0_Conditional_6_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 10);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 1, "operator.claim.verification.instructions"), " ");
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_1_Conditional_0_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275conditionalCreate(0, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_1_Conditional_0_Conditional_6_Conditional_0_Template, 3, 3, "p", 10);
    \u0275\u0275elementStart(1, "app-form-flow", 22);
    \u0275\u0275listener("ngModelChange", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_1_Conditional_0_Conditional_6_Template_app_form_flow_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.onClaimDraftChange($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const claim_r4 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275conditional(!claim_r4.claimed ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("model", ctx_r1.claimCompanyFormModel())("ngModel", ctx_r1.workspace.claimDraft())("disabled", ctx_r1.busy() || !ctx_r1.registeredForClaim() || claim_r4.verificationCapability !== "AVAILABLE" || claim_r4.claimed || claim_r4.verificationStatus === "PENDING_REVIEW" || claim_r4.verificationStatus === "REJECTED");
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_1_Conditional_0_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 10);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "app-form-flow", 22);
    \u0275\u0275listener("ngModelChange", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_1_Conditional_0_Conditional_7_Template_app_form_flow_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.onClaimClientCodeChange($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(6);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 4, "operator.claim.client.code.instructions"), " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("model", ctx_r1.claimClientCodeFormModel())("ngModel", ctx_r1.claimClientCodeValue())("disabled", ctx_r1.busy() || !ctx_r1.registeredForClaim());
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-menu", 14);
    \u0275\u0275listener("itemSelect", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_1_Conditional_0_Template_app_menu_itemSelect_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r1.onAction($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(1, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_1_Conditional_0_Conditional_1_Template, 6, 3, "p", 15);
    \u0275\u0275conditionalCreate(2, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_1_Conditional_0_Conditional_2_Template, 6, 3, "p", 15);
    \u0275\u0275conditionalCreate(3, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_1_Conditional_0_Conditional_3_Template, 16, 10, "div", 16)(4, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_1_Conditional_0_Conditional_4_Template, 16, 10, "div", 16)(5, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_1_Conditional_0_Conditional_5_Template, 3, 1);
    \u0275\u0275conditionalCreate(6, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_1_Conditional_0_Conditional_6_Template, 2, 4)(7, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_1_Conditional_0_Conditional_7_Template, 4, 6);
  }
  if (rf & 2) {
    const claim_r4 = ctx;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275property("items", ctx_r1.claimPathItems());
    \u0275\u0275advance();
    \u0275\u0275conditional(claim_r4.verificationCapability !== "AVAILABLE" ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r1.registeredForClaim() ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(claim_r4.verificationStatus === "PENDING_REVIEW" ? 3 : claim_r4.verificationStatus === "REJECTED" ? 4 : claim_r4.verificationStatus === "APPROVED" || claim_r4.verificationStatus === "VERIFIED" ? 5 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.claimPath() === "company" ? 6 : 7);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_1_Conditional_0_Template, 8, 5);
  }
  if (rf & 2) {
    let tmp_5_0;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275conditional((tmp_5_0 = ctx_r1.workspace.claimStatus()) ? 0 : -1, tmp_5_0);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 15)(1, "mat-icon");
    \u0275\u0275text(2, "cloud_off");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const configuration_r8 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(5, 1, configuration_r8.unavailableReason || "operator.configuration.backend.unavailable"), " ");
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-menu", 66);
    \u0275\u0275listener("itemSelect", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_17_Template_app_menu_itemSelect_0_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext(9);
      return \u0275\u0275resetView(ctx_r1.onAction($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(9);
    \u0275\u0275property("items", ctx_r1.configurationTlsTestActionItems());
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 15)(1, "mat-icon");
    \u0275\u0275text(2, "cloud_off");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const tlsConfiguration_r11 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(5, 1, tlsConfiguration_r11.unavailableReason || "operator.configuration.tls.backend.unavailable"), " ");
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_19_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-menu", 72);
    \u0275\u0275listener("itemSelect", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_19_Conditional_12_Template_app_menu_itemSelect_0_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext(10);
      return \u0275\u0275resetView(ctx_r1.onAction($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(10);
    \u0275\u0275property("items", ctx_r1.configurationTlsAutoRenewItems());
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_19_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 71)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "input", 73);
    \u0275\u0275listener("ngModelChange", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_19_Conditional_13_Template_input_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext(10);
      return \u0275\u0275resetView(ctx_r1.workspace.setTlsConfiguration({ contactEmail: $event }));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const tlsDraft_r15 = \u0275\u0275nextContext(2);
    const ctx_r1 = \u0275\u0275nextContext(8);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 3, "operator.configuration.tls.contact.email"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", tlsDraft_r15.contactEmail)("disabled", ctx_r1.configurationTlsDisabled());
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_19_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 71)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "textarea", 74);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275pipe(6, "i18n");
    \u0275\u0275listener("ngModelChange", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_19_Conditional_14_Template_textarea_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r16);
      const ctx_r1 = \u0275\u0275nextContext(10);
      return \u0275\u0275resetView(ctx_r1.workspace.setTlsConfiguration({ certificate: $event }));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "label", 71)(8, "span");
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "textarea", 75);
    \u0275\u0275pipe(12, "i18n");
    \u0275\u0275pipe(13, "i18n");
    \u0275\u0275listener("ngModelChange", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_19_Conditional_14_Template_textarea_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r16);
      const ctx_r1 = \u0275\u0275nextContext(10);
      return \u0275\u0275resetView(ctx_r1.workspace.setTlsConfiguration({ privateKey: $event }));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const tlsDraft_r15 = \u0275\u0275nextContext(2);
    const tlsConfiguration_r11 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext(7);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 8, "operator.configuration.tls.certificate"));
    \u0275\u0275advance(2);
    \u0275\u0275property("placeholder", tlsConfiguration_r11.certificateConfigured && tlsConfiguration_r11.mode === "MANUAL" && tlsConfiguration_r11.domain === tlsDraft_r15.domain.trim().toLowerCase() ? \u0275\u0275pipeBind1(5, 10, "operator.configuration.tls.credential.configured") : \u0275\u0275pipeBind1(6, 12, "operator.configuration.tls.certificate.placeholder"))("ngModel", tlsDraft_r15.certificate)("disabled", ctx_r1.configurationTlsDisabled());
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(10, 14, "operator.configuration.tls.private.key"));
    \u0275\u0275advance(2);
    \u0275\u0275property("placeholder", tlsConfiguration_r11.certificateConfigured && tlsConfiguration_r11.mode === "MANUAL" && tlsConfiguration_r11.domain === tlsDraft_r15.domain.trim().toLowerCase() ? \u0275\u0275pipeBind1(12, 16, "operator.configuration.tls.credential.configured") : \u0275\u0275pipeBind1(13, 18, "operator.configuration.tls.private.key.placeholder"))("ngModel", tlsDraft_r15.privateKey)("disabled", ctx_r1.configurationTlsDisabled());
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_19_Conditional_15_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const tlsConfiguration_r11 = \u0275\u0275nextContext(4);
    const ctx_r1 = \u0275\u0275nextContext(7);
    \u0275\u0275textInterpolate1(" \xB7 ", ctx_r1.formatDate(tlsConfiguration_r11.updatedAt), " ");
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_19_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 10);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275conditionalCreate(3, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_19_Conditional_15_Conditional_3_Template, 1, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tlsConfiguration_r11 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 2, "operator.configuration.tls.certificate.configured"), " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(tlsConfiguration_r11.updatedAt ? 3 : -1);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 67)(1, "label", 29)(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "input", 68);
    \u0275\u0275listener("ngModelChange", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_19_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(9);
      return \u0275\u0275resetView(ctx_r1.workspace.setTlsConfiguration({ domain: $event }));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 44)(7, "span");
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 69)(11, "app-menu", 33);
    \u0275\u0275listener("itemSelect", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_19_Template_app_menu_itemSelect_11_listener($event) {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(9);
      return \u0275\u0275resetView(ctx_r1.onAction($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(12, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_19_Conditional_12_Template, 1, 1, "app-menu", 70);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(13, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_19_Conditional_13_Template, 5, 5, "label", 71)(14, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_19_Conditional_14_Template, 14, 20);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(15, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_19_Conditional_15_Template, 4, 4, "p", 10);
  }
  if (rf & 2) {
    const tlsDraft_r15 = \u0275\u0275nextContext();
    const tlsConfiguration_r11 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext(7);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 9, "operator.configuration.tls.domain"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", tlsDraft_r15.domain)("disabled", ctx_r1.configurationTlsDisabled());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(9, 11, "operator.configuration.tls.mode"));
    \u0275\u0275advance(3);
    \u0275\u0275property("trigger", ctx_r1.configurationTlsModeTrigger())("items", ctx_r1.configurationTlsModeItems());
    \u0275\u0275advance();
    \u0275\u0275conditional(tlsDraft_r15.mode === "AUTOMATIC" ? 12 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(tlsDraft_r15.mode === "AUTOMATIC" ? 13 : 14);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(tlsConfiguration_r11.certificateConfigured ? 15 : -1);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-menu", 36);
    \u0275\u0275listener("itemSelect", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_20_Template_app_menu_itemSelect_0_listener($event) {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext(9);
      return \u0275\u0275resetView(ctx_r1.onAction($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(9);
    \u0275\u0275property("items", ctx_r1.configurationTlsSaveActionItems());
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_21_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 15)(1, "mat-icon");
    \u0275\u0275text(2, "error_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(10);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 1, ctx_r1.workspace.error()));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_21_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 21)(1, "mat-icon");
    \u0275\u0275text(2, "check_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(10);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 1, ctx_r1.workspace.notice()));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_21_Conditional_0_Template, 6, 3, "p", 15)(1, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_21_Conditional_1_Template, 6, 3, "p", 21);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(9);
    \u0275\u0275conditional(ctx_r1.workspace.error() ? 0 : ctx_r1.workspace.notice() && ctx_r1.workspace.feedbackAction() !== "save-tls" ? 1 : -1);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 38)(1, "header", 60)(2, "span", 61)(3, "small");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "strong");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 62)(10, "button", 63);
    \u0275\u0275pipe(11, "i18n");
    \u0275\u0275listener("click", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Template_button_click_10_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(8);
      return \u0275\u0275resetView(ctx_r1.toggleTlsEnabled($event));
    });
    \u0275\u0275elementStart(12, "mat-icon");
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span");
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "i18n");
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(17, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_17_Template, 1, 1, "app-menu", 64);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(18, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_18_Template, 6, 3, "p", 15);
    \u0275\u0275conditionalCreate(19, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_19_Template, 16, 13);
    \u0275\u0275conditionalCreate(20, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_20_Template, 1, 1, "app-menu", 65);
    \u0275\u0275conditionalCreate(21, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Conditional_21_Template, 2, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tlsDraft_r15 = ctx;
    const tlsConfiguration_r11 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext(7);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 13, "operator.configuration.tls.eyebrow"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 15, "operator.configuration.tls"));
    \u0275\u0275advance(3);
    \u0275\u0275classProp("is-on", tlsDraft_r15.enabled);
    \u0275\u0275property("disabled", ctx_r1.configurationTlsDisabled());
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(11, 17, "operator.configuration.tls.enabled"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(tlsDraft_r15.enabled ? "toggle_on" : "toggle_off");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(16, 19, tlsDraft_r15.enabled ? "on" : "off"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(tlsDraft_r15.enabled ? 17 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(tlsConfiguration_r11.capability !== "AVAILABLE" ? 18 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(tlsDraft_r15.enabled ? 19 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.showTlsSaveAction() ? 20 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.workspace.feedbackAction() === "save-tls" || ctx_r1.workspace.feedbackAction() === "test-tls-domain" || ctx_r1.workspace.feedbackAction() === "test-tls-certificate" ? 21 : -1);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Conditional_0_Template, 22, 21, "section", 38);
  }
  if (rf & 2) {
    let tmp_11_0;
    const ctx_r1 = \u0275\u0275nextContext(7);
    \u0275\u0275conditional((tmp_11_0 = ctx_r1.workspace.tlsConfigurationDraft()) ? 0 : -1, tmp_11_0);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_40_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 15)(1, "mat-icon");
    \u0275\u0275text(2, "error_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(8);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 1, ctx_r1.workspace.error()));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_40_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 21)(1, "mat-icon");
    \u0275\u0275text(2, "check_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(8);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 1, ctx_r1.workspace.notice()));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_40_Conditional_0_Template, 6, 3, "p", 15)(1, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_40_Conditional_1_Template, 6, 3, "p", 21);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(7);
    \u0275\u0275conditional(ctx_r1.workspace.error() ? 0 : ctx_r1.workspace.notice() ? 1 : -1);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_57_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 15)(1, "mat-icon");
    \u0275\u0275text(2, "error_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(8);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 1, ctx_r1.workspace.error()));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_57_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 21)(1, "mat-icon");
    \u0275\u0275text(2, "check_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(8);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 1, ctx_r1.workspace.notice()));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_57_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_57_Conditional_0_Template, 6, 3, "p", 15)(1, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_57_Conditional_1_Template, 6, 3, "p", 21);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(7);
    \u0275\u0275conditional(ctx_r1.workspace.error() ? 0 : ctx_r1.workspace.notice() ? 1 : -1);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_71_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 15)(1, "mat-icon");
    \u0275\u0275text(2, "error_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(8);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 1, ctx_r1.workspace.error()));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_71_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 21)(1, "mat-icon");
    \u0275\u0275text(2, "check_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(8);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 1, ctx_r1.workspace.notice()));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_71_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_71_Conditional_0_Template, 6, 3, "p", 15)(1, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_71_Conditional_1_Template, 6, 3, "p", 21);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(7);
    \u0275\u0275conditional(ctx_r1.workspace.error() ? 0 : ctx_r1.workspace.notice() ? 1 : -1);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_For_88_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 40)(1, "div", 76)(2, "label", 29)(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "input", 77);
    \u0275\u0275listener("ngModelChange", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_For_88_Template_input_ngModelChange_6_listener($event) {
      const \u0275$index_531_r19 = \u0275\u0275restoreView(_r18).$index;
      const ctx_r1 = \u0275\u0275nextContext(7);
      return \u0275\u0275resetView(ctx_r1.setConfigurationSocialLink(\u0275$index_531_r19, { provider: $event }));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "label", 29)(8, "span");
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "input", 78);
    \u0275\u0275listener("ngModelChange", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_For_88_Template_input_ngModelChange_11_listener($event) {
      const \u0275$index_531_r19 = \u0275\u0275restoreView(_r18).$index;
      const ctx_r1 = \u0275\u0275nextContext(7);
      return \u0275\u0275resetView(ctx_r1.setConfigurationSocialLink(\u0275$index_531_r19, { label: $event }));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "label", 29)(13, "span");
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "input", 79);
    \u0275\u0275pipe(17, "i18n");
    \u0275\u0275listener("ngModelChange", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_For_88_Template_input_ngModelChange_16_listener($event) {
      const \u0275$index_531_r19 = \u0275\u0275restoreView(_r18).$index;
      const ctx_r1 = \u0275\u0275nextContext(7);
      return \u0275\u0275resetView(ctx_r1.setConfigurationSocialLink(\u0275$index_531_r19, { icon: $event || null }));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "label", 29)(19, "span");
    \u0275\u0275text(20);
    \u0275\u0275pipe(21, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "input", 80);
    \u0275\u0275pipe(23, "i18n");
    \u0275\u0275listener("ngModelChange", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_For_88_Template_input_ngModelChange_22_listener($event) {
      const \u0275$index_531_r19 = \u0275\u0275restoreView(_r18).$index;
      const ctx_r1 = \u0275\u0275nextContext(7);
      return \u0275\u0275resetView(ctx_r1.setConfigurationSocialLink(\u0275$index_531_r19, { handle: $event || null }));
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(24, "app-link-input", 81);
    \u0275\u0275listener("ngModelChange", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_For_88_Template_app_link_input_ngModelChange_24_listener($event) {
      const \u0275$index_531_r19 = \u0275\u0275restoreView(_r18).$index;
      const ctx_r1 = \u0275\u0275nextContext(7);
      return \u0275\u0275resetView(ctx_r1.setConfigurationSocialLink(\u0275$index_531_r19, { url: $event }));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "app-menu", 82);
    \u0275\u0275listener("itemSelect", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_For_88_Template_app_menu_itemSelect_25_listener($event) {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext(7);
      return \u0275\u0275resetView(ctx_r1.onAction($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const link_r20 = ctx.$implicit;
    const \u0275$index_531_r19 = ctx.$index;
    const ctx_r1 = \u0275\u0275nextContext(7);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 18, "operator.configuration.social.provider"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", link_r20.provider)("disabled", ctx_r1.configurationDisabled());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(10, 20, "operator.configuration.social.label"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", link_r20.label)("disabled", ctx_r1.configurationDisabled());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(15, 22, "operator.configuration.social.icon"));
    \u0275\u0275advance(2);
    \u0275\u0275property("placeholder", \u0275\u0275pipeBind1(17, 24, "operator.configuration.social.icon.placeholder"))("ngModel", link_r20.icon ?? "")("disabled", ctx_r1.configurationDisabled());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(21, 26, "operator.configuration.social.handle"));
    \u0275\u0275advance(2);
    \u0275\u0275property("placeholder", \u0275\u0275pipeBind1(23, 28, "operator.configuration.social.handle.placeholder"))("ngModel", link_r20.handle ?? "")("disabled", ctx_r1.configurationDisabled());
    \u0275\u0275advance(2);
    \u0275\u0275property("config", ctx_r1.socialLinkUrlConfig())("ngModel", link_r20.url)("disabled", ctx_r1.configurationDisabled());
    \u0275\u0275advance();
    \u0275\u0275property("items", ctx_r1.configurationSocialLinkRemoveItems(\u0275$index_531_r19));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_ForEmpty_89_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 41);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 1, "operator.configuration.social.empty"), " ");
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_90_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 15)(1, "mat-icon");
    \u0275\u0275text(2, "error_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 1, ctx));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_92_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 15)(1, "mat-icon");
    \u0275\u0275text(2, "error_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(8);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 1, ctx_r1.workspace.error()));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_92_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 21)(1, "mat-icon");
    \u0275\u0275text(2, "check_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(8);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 1, ctx_r1.workspace.notice()));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_92_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_92_Conditional_0_Template, 6, 3, "p", 15)(1, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_92_Conditional_1_Template, 6, 3, "p", 21);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(7);
    \u0275\u0275conditional(ctx_r1.workspace.error() ? 0 : ctx_r1.workspace.notice() ? 1 : -1);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_109_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 29)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "input", 84);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275listener("ngModelChange", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_109_Conditional_2_Template_input_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r22);
      const ctx_r1 = \u0275\u0275nextContext(8);
      return \u0275\u0275resetView(ctx_r1.workspace.setConfigurationPayment({ merchantAccount: $event }));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const draft_r23 = \u0275\u0275nextContext(2);
    const ctx_r1 = \u0275\u0275nextContext(6);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(3, 4, "operator.configuration.payment.merchant.account"), " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("placeholder", \u0275\u0275pipeBind1(5, 6, "operator.configuration.payment.merchant.account.placeholder"))("ngModel", draft_r23.payment.merchantAccount)("disabled", ctx_r1.configurationDisabled());
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_109_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 83)(1, "app-link-input", 81);
    \u0275\u0275listener("ngModelChange", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_109_Template_app_link_input_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r21);
      const ctx_r1 = \u0275\u0275nextContext(7);
      return \u0275\u0275resetView(ctx_r1.workspace.setConfigurationPayment({ publicBaseUrl: $event }));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(2, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_109_Conditional_2_Template, 6, 8, "label", 29);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const draft_r23 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext(6);
    \u0275\u0275classProp("is-barion", ctx_r1.configurationPaymentIsBarion());
    \u0275\u0275advance();
    \u0275\u0275property("config", ctx_r1.configurationPaymentPublicBaseUrlConfig())("ngModel", draft_r23.payment.publicBaseUrl)("disabled", ctx_r1.configurationDisabled());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.configurationPaymentIsBarion() ? 2 : -1);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_117_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 15)(1, "mat-icon");
    \u0275\u0275text(2, "error_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(8);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 1, ctx_r1.workspace.error()));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_117_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 21)(1, "mat-icon");
    \u0275\u0275text(2, "check_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(8);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 1, ctx_r1.workspace.notice()));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_117_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_117_Conditional_0_Template, 6, 3, "p", 15)(1, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_117_Conditional_1_Template, 6, 3, "p", 21);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(7);
    \u0275\u0275conditional(ctx_r1.workspace.error() ? 0 : ctx_r1.workspace.notice() ? 1 : -1);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_129_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 48);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", \u0275\u0275pipeBind1(2, 2, "operator.configuration.test.authentication"), ": ", \u0275\u0275pipeBind1(3, 4, ctx.message), " ");
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_130_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 48);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", \u0275\u0275pipeBind1(2, 2, "operator.configuration.test.messaging"), ": ", \u0275\u0275pipeBind1(3, 4, ctx.message), " ");
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_199_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 15)(1, "mat-icon");
    \u0275\u0275text(2, "error_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(8);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 1, ctx_r1.workspace.error()));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_199_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 21)(1, "mat-icon");
    \u0275\u0275text(2, "check_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(8);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 1, ctx_r1.workspace.notice()));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_199_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_199_Conditional_0_Template, 6, 3, "p", 15)(1, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_199_Conditional_1_Template, 6, 3, "p", 21);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(7);
    \u0275\u0275conditional(ctx_r1.workspace.error() ? 0 : ctx_r1.workspace.notice() ? 1 : -1);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275conditionalCreate(0, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_0_Template, 6, 3, "p", 15);
    \u0275\u0275conditionalCreate(1, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_1_Template, 1, 1);
    \u0275\u0275elementStart(2, "section", 23)(3, "header")(4, "span")(5, "small");
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "strong");
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "mat-icon");
    \u0275\u0275text(12, "palette");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 24)(14, "div", 25)(15, "span");
    \u0275\u0275text(16);
    \u0275\u0275pipe(17, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "app-image-carousel", 26);
    \u0275\u0275pipe(19, "i18n");
    \u0275\u0275listener("ngModelChange", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Template_app_image_carousel_ngModelChange_18_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.onBrandingLogoChange($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "small", 27);
    \u0275\u0275text(21);
    \u0275\u0275pipe(22, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div", 28)(24, "label", 29)(25, "span");
    \u0275\u0275text(26);
    \u0275\u0275pipe(27, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "input", 30);
    \u0275\u0275listener("ngModelChange", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Template_input_ngModelChange_28_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.workspace.setConfigurationBranding({ productName: $event }));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "label", 29)(30, "span");
    \u0275\u0275text(31);
    \u0275\u0275pipe(32, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "input", 31);
    \u0275\u0275listener("ngModelChange", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Template_input_ngModelChange_33_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.onBrandingLogoCharacterIndexChange($event));
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(34, "div", 32)(35, "span");
    \u0275\u0275text(36);
    \u0275\u0275pipe(37, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "app-menu", 33);
    \u0275\u0275listener("itemSelect", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Template_app_menu_itemSelect_38_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.onAction($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(39, "app-menu", 34);
    \u0275\u0275listener("itemSelect", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Template_app_menu_itemSelect_39_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.onAction($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(40, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_40_Template, 2, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "section", 35)(42, "header")(43, "span")(44, "small");
    \u0275\u0275text(45);
    \u0275\u0275pipe(46, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "strong");
    \u0275\u0275text(48);
    \u0275\u0275pipe(49, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(50, "mat-icon");
    \u0275\u0275text(51, "privacy_tip");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(52, "p", 10);
    \u0275\u0275text(53);
    \u0275\u0275pipe(54, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "app-form-flow", 22);
    \u0275\u0275listener("ngModelChange", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Template_app_form_flow_ngModelChange_55_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.onConfigurationPrivacyContactChange($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(56, "app-menu", 36);
    \u0275\u0275listener("itemSelect", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Template_app_menu_itemSelect_56_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.onAction($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(57, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_57_Template, 2, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "section", 37)(59, "header")(60, "span")(61, "small");
    \u0275\u0275text(62);
    \u0275\u0275pipe(63, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(64, "strong");
    \u0275\u0275text(65);
    \u0275\u0275pipe(66, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(67, "mat-icon");
    \u0275\u0275text(68, "admin_panel_settings");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(69, "app-form-flow", 22);
    \u0275\u0275listener("ngModelChange", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Template_app_form_flow_ngModelChange_69_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.onConfigurationAdminEmailsChange($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(70, "app-menu", 36);
    \u0275\u0275listener("itemSelect", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Template_app_menu_itemSelect_70_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.onAction($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(71, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_71_Template, 2, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(72, "section", 38)(73, "header")(74, "span")(75, "small");
    \u0275\u0275text(76);
    \u0275\u0275pipe(77, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(78, "strong");
    \u0275\u0275text(79);
    \u0275\u0275pipe(80, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(81, "mat-icon");
    \u0275\u0275text(82, "share");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(83, "p", 10);
    \u0275\u0275text(84);
    \u0275\u0275pipe(85, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(86, "div", 39);
    \u0275\u0275repeaterCreate(87, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_For_88_Template, 26, 30, "article", 40, \u0275\u0275repeaterTrackByIndex, false, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_ForEmpty_89_Template, 3, 3, "p", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(90, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_90_Template, 6, 3, "p", 15);
    \u0275\u0275elementStart(91, "app-menu", 42);
    \u0275\u0275listener("itemSelect", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Template_app_menu_itemSelect_91_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.onAction($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(92, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_92_Template, 2, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(93, "section", 43)(94, "header")(95, "span")(96, "small");
    \u0275\u0275text(97);
    \u0275\u0275pipe(98, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(99, "strong");
    \u0275\u0275text(100);
    \u0275\u0275pipe(101, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(102, "mat-icon");
    \u0275\u0275text(103, "payments");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(104, "div", 44)(105, "span");
    \u0275\u0275text(106);
    \u0275\u0275pipe(107, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(108, "app-menu", 33);
    \u0275\u0275listener("itemSelect", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Template_app_menu_itemSelect_108_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.onAction($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(109, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_109_Template, 3, 6, "div", 45);
    \u0275\u0275elementStart(110, "label", 29)(111, "span");
    \u0275\u0275text(112);
    \u0275\u0275pipe(113, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(114, "input", 46);
    \u0275\u0275pipe(115, "i18n");
    \u0275\u0275listener("ngModelChange", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Template_input_ngModelChange_114_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.workspace.setConfigurationPayment({ credential: $event }));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(116, "app-menu", 36);
    \u0275\u0275listener("itemSelect", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Template_app_menu_itemSelect_116_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.onAction($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(117, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_117_Template, 2, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(118, "section", 35)(119, "header")(120, "span")(121, "small");
    \u0275\u0275text(122);
    \u0275\u0275pipe(123, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(124, "strong");
    \u0275\u0275text(125, "Firebase");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(126, "app-menu", 47);
    \u0275\u0275listener("itemSelect", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Template_app_menu_itemSelect_126_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.onAction($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(127, "mat-icon");
    \u0275\u0275text(128, "cloud");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(129, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_129_Template, 4, 6, "span", 48);
    \u0275\u0275conditionalCreate(130, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_130_Template, 4, 6, "span", 48);
    \u0275\u0275elementStart(131, "div", 49)(132, "label", 29)(133, "span");
    \u0275\u0275text(134);
    \u0275\u0275pipe(135, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(136, "input", 50);
    \u0275\u0275listener("ngModelChange", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Template_input_ngModelChange_136_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.workspace.setConfigurationFirebase({ projectId: $event }));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(137, "label", 29)(138, "span");
    \u0275\u0275text(139);
    \u0275\u0275pipe(140, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(141, "input", 51);
    \u0275\u0275listener("ngModelChange", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Template_input_ngModelChange_141_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.workspace.setConfigurationFirebase({ authDomain: $event }));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(142, "label", 29)(143, "span");
    \u0275\u0275text(144);
    \u0275\u0275pipe(145, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(146, "input", 52);
    \u0275\u0275listener("ngModelChange", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Template_input_ngModelChange_146_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.workspace.setConfigurationFirebase({ storageBucket: $event }));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(147, "label", 29)(148, "span");
    \u0275\u0275text(149);
    \u0275\u0275pipe(150, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(151, "input", 53);
    \u0275\u0275listener("ngModelChange", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Template_input_ngModelChange_151_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.workspace.setConfigurationFirebase({ messagingSenderId: $event }));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(152, "label", 29)(153, "span");
    \u0275\u0275text(154);
    \u0275\u0275pipe(155, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(156, "input", 54);
    \u0275\u0275listener("ngModelChange", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Template_input_ngModelChange_156_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.workspace.setConfigurationFirebase({ appId: $event }));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(157, "label", 29)(158, "span");
    \u0275\u0275text(159);
    \u0275\u0275pipe(160, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(161, "input", 55);
    \u0275\u0275listener("ngModelChange", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Template_input_ngModelChange_161_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.workspace.setConfigurationFirebase({ measurementId: $event }));
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(162, "label", 29)(163, "span");
    \u0275\u0275text(164);
    \u0275\u0275pipe(165, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(166, "input", 54);
    \u0275\u0275listener("ngModelChange", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Template_input_ngModelChange_166_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.workspace.setConfigurationFirebase({ apiKey: $event }));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(167, "label", 29)(168, "span");
    \u0275\u0275text(169);
    \u0275\u0275pipe(170, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(171, "textarea", 56);
    \u0275\u0275listener("ngModelChange", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Template_textarea_ngModelChange_171_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.workspace.setConfigurationFirebase({ vapidKey: $event }));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(172, "small");
    \u0275\u0275text(173);
    \u0275\u0275pipe(174, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(175, "label", 29)(176, "span");
    \u0275\u0275text(177);
    \u0275\u0275pipe(178, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(179, "textarea", 57);
    \u0275\u0275pipe(180, "i18n");
    \u0275\u0275pipe(181, "i18n");
    \u0275\u0275listener("ngModelChange", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Template_textarea_ngModelChange_179_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.workspace.setConfigurationFirebase({ authenticationCredential: $event }));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(182, "label", 29)(183, "span");
    \u0275\u0275text(184);
    \u0275\u0275pipe(185, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(186, "textarea", 57);
    \u0275\u0275pipe(187, "i18n");
    \u0275\u0275pipe(188, "i18n");
    \u0275\u0275listener("ngModelChange", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Template_textarea_ngModelChange_186_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.workspace.setConfigurationFirebase({ messagingCredential: $event }));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(189, "label", 29)(190, "span");
    \u0275\u0275text(191);
    \u0275\u0275pipe(192, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(193, "textarea", 58);
    \u0275\u0275pipe(194, "i18n");
    \u0275\u0275listener("ngModelChange", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Template_textarea_ngModelChange_193_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.workspace.setConfigurationMessagingDestinationToken($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(195, "small");
    \u0275\u0275text(196);
    \u0275\u0275pipe(197, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(198, "app-menu", 59);
    \u0275\u0275listener("itemSelect", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Template_app_menu_itemSelect_198_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.onAction($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(199, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Conditional_199_Template, 2, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_10_0;
    let tmp_52_0;
    let tmp_53_0;
    let tmp_70_0;
    let tmp_71_0;
    const draft_r23 = ctx;
    const configuration_r8 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275conditional(configuration_r8.capability !== "AVAILABLE" ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_10_0 = ctx_r1.workspace.tlsConfiguration()) ? 1 : -1, tmp_10_0);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(7, 104, "operator.configuration.branding.eyebrow"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(10, 106, "operator.configuration.branding"));
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(17, 108, "operator.configuration.branding.logo"));
    \u0275\u0275advance(2);
    \u0275\u0275property("slotCount", 1)("compact", true)("autoSize", true)("ngModel", draft_r23.branding.logoUrl ? \u0275\u0275pureFunction1(184, _c1, draft_r23.branding.logoUrl) : \u0275\u0275pureFunction0(186, _c2))("disabled", ctx_r1.configurationDisabled())("uploadOwnerId", ctx_r1.workspace.configurationUploadOwnerId())("ariaLabel", \u0275\u0275pipeBind1(19, 110, "operator.configuration.branding.logo"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(22, 112, "operator.configuration.branding.logo.guidance"), " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(27, 114, "operator.configuration.branding.product.name"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", draft_r23.branding.productName)("disabled", ctx_r1.configurationDisabled());
    \u0275\u0275advance();
    \u0275\u0275classProp("is-invalid", ctx_r1.brandingLogoCharacterIndexInvalid());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(32, 116, "operator.configuration.branding.logo.character.index"), " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", draft_r23.branding.logoCharacterIndex)("disabled", ctx_r1.configurationDisabled());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(37, 118, "operator.configuration.branding.theme"));
    \u0275\u0275advance(2);
    \u0275\u0275property("trigger", ctx_r1.configurationThemeTrigger())("items", ctx_r1.configurationThemeItems());
    \u0275\u0275advance();
    \u0275\u0275property("items", ctx_r1.configurationBrandingActionItems());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.workspace.feedbackAction() === "save-branding" ? 40 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(46, 120, "operator.configuration.privacy.contact.eyebrow"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(49, 122, "operator.configuration.privacy.contact"), " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(54, 124, "operator.configuration.privacy.contact.guidance"), " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("model", ctx_r1.configurationPrivacyContactFormModel())("ngModel", ctx_r1.configurationPrivacyContactFormValue())("disabled", ctx_r1.configurationDisabled());
    \u0275\u0275advance();
    \u0275\u0275property("items", ctx_r1.configurationPrivacyContactActionItems());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.workspace.feedbackAction() === "save-privacy-contact" ? 57 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(63, 126, "operator.configuration.admin.eyebrow"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(66, 128, "operator.configuration.admin"));
    \u0275\u0275advance(4);
    \u0275\u0275property("model", ctx_r1.configurationAdminEmailsFormModel())("ngModel", ctx_r1.configurationAdminEmailsFormValue())("disabled", ctx_r1.configurationDisabled());
    \u0275\u0275advance();
    \u0275\u0275property("items", ctx_r1.configurationAdminEmailActionItems());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.workspace.feedbackAction() === "save-admin-emails" ? 71 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(77, 130, "operator.configuration.social.eyebrow"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(80, 132, "operator.configuration.social"));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(85, 134, "operator.configuration.social.guidance"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275repeater(((tmp_52_0 = ctx_r1.workspace.configurationDraft()) == null ? null : tmp_52_0.socialLinks) ?? \u0275\u0275pureFunction0(187, _c2));
    \u0275\u0275advance(3);
    \u0275\u0275conditional((tmp_53_0 = ctx_r1.workspace.configurationSocialLinksValidationKey()) ? 90 : -1, tmp_53_0);
    \u0275\u0275advance();
    \u0275\u0275property("items", ctx_r1.configurationSocialLinkActionItems());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.workspace.feedbackAction() === "save-social-links" ? 92 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(98, 136, "operator.configuration.payment.eyebrow"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(101, 138, "operator.configuration.payment"));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(107, 140, "operator.configuration.payment.provider"));
    \u0275\u0275advance(2);
    \u0275\u0275property("trigger", ctx_r1.configurationPaymentProviderTrigger())("items", ctx_r1.configurationPaymentProviderItems());
    \u0275\u0275advance();
    \u0275\u0275conditional(draft_r23.payment.providerId ? 109 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(113, 142, "operator.configuration.payment.credential"));
    \u0275\u0275advance(2);
    \u0275\u0275property("placeholder", configuration_r8.payment.credentialMask || \u0275\u0275pipeBind1(115, 144, "operator.configuration.credential.placeholder"))("ngModel", draft_r23.payment.credential)("disabled", ctx_r1.configurationDisabled() || !draft_r23.payment.providerId);
    \u0275\u0275advance(2);
    \u0275\u0275property("items", ctx_r1.configurationPaymentActionItems());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.workspace.feedbackAction() === "register-payment" ? 117 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(123, 146, "operator.configuration.firebase.eyebrow"));
    \u0275\u0275advance(4);
    \u0275\u0275property("items", ctx_r1.configurationFirebaseTestActionItems());
    \u0275\u0275advance(3);
    \u0275\u0275conditional((tmp_70_0 = ctx_r1.workspace.configurationAuthenticationTest()) ? 129 : -1, tmp_70_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_71_0 = ctx_r1.workspace.configurationMessagingTest()) ? 130 : -1, tmp_71_0);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(135, 148, "operator.configuration.firebase.project.id"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", draft_r23.firebase.projectId)("disabled", ctx_r1.configurationDisabled());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(140, 150, "operator.configuration.firebase.auth.domain"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", draft_r23.firebase.authDomain)("disabled", ctx_r1.configurationDisabled());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(145, 152, "operator.configuration.firebase.storage.bucket"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", draft_r23.firebase.storageBucket)("disabled", ctx_r1.configurationDisabled());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(150, 154, "operator.configuration.firebase.messaging.sender.id"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", draft_r23.firebase.messagingSenderId)("disabled", ctx_r1.configurationDisabled());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(155, 156, "operator.configuration.firebase.app.id"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", draft_r23.firebase.appId)("disabled", ctx_r1.configurationDisabled());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(160, 158, "operator.configuration.firebase.measurement.id"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", draft_r23.firebase.measurementId)("disabled", ctx_r1.configurationDisabled());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(165, 160, "operator.configuration.firebase.api.key"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", draft_r23.firebase.apiKey)("disabled", ctx_r1.configurationDisabled());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(170, 162, "operator.configuration.firebase.vapid.key"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", draft_r23.firebase.vapidKey)("disabled", ctx_r1.configurationDisabled());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(174, 164, "operator.configuration.firebase.public.guidance"), " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(178, 166, "operator.configuration.firebase.authentication.credential"));
    \u0275\u0275advance(2);
    \u0275\u0275property("placeholder", configuration_r8.firebase.authenticationCredentialConfigured ? \u0275\u0275pipeBind1(180, 168, "operator.configuration.credential.registered") : \u0275\u0275pipeBind1(181, 170, "operator.configuration.credential.placeholder"))("ngModel", draft_r23.firebase.authenticationCredential)("disabled", ctx_r1.configurationDisabled());
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(185, 172, "operator.configuration.firebase.messaging.credential"));
    \u0275\u0275advance(2);
    \u0275\u0275property("placeholder", configuration_r8.firebase.messagingCredentialConfigured ? \u0275\u0275pipeBind1(187, 174, "operator.configuration.credential.registered") : \u0275\u0275pipeBind1(188, 176, "operator.configuration.credential.placeholder"))("ngModel", draft_r23.firebase.messagingCredential)("disabled", ctx_r1.configurationDisabled());
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(192, 178, "operator.configuration.test.messaging.destination"), " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("placeholder", \u0275\u0275pipeBind1(194, 180, "operator.configuration.test.messaging.destination.placeholder"))("ngModel", ctx_r1.workspace.configurationMessagingDestinationToken())("disabled", ctx_r1.configurationDisabled());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(197, 182, "operator.configuration.test.messaging.destination.guidance"), " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("items", ctx_r1.configurationFirebaseSaveActionItems());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.workspace.feedbackAction() === "register-firebase" || ctx_r1.workspace.feedbackAction() === "activate-firebase" ? 199 : -1);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Conditional_0_Template, 200, 188);
  }
  if (rf & 2) {
    let tmp_7_0;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275conditional((tmp_7_0 = ctx_r1.workspace.configurationDraft()) ? 0 : -1, tmp_7_0);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Conditional_0_Template, 1, 1);
  }
  if (rf & 2) {
    let tmp_5_0;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275conditional((tmp_5_0 = ctx_r1.workspace.configuration()) ? 0 : -1, tmp_5_0);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_3_Conditional_0_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const delivery_r24 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 1, delivery_r24.code === "EXPLORE_MODE" ? "operator.revenue.delivery.not.sent" : delivery_r24.message), " ");
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_3_Conditional_0_Conditional_45_ng_template_14_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 95);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const report_r26 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", report_r26.failureCode, " ");
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_3_Conditional_0_Conditional_45_ng_template_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 93)(1, "header")(2, "span", 94)(3, "mat-icon");
    \u0275\u0275text(4, "receipt_long");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "span")(6, "small");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "strong");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "em");
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "p");
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(17, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_3_Conditional_0_Conditional_45_ng_template_14_Conditional_17_Template, 2, 1, "small", 95);
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
    \u0275\u0275elementStart(37, "app-menu", 96);
    \u0275\u0275listener("itemSelect", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_3_Conditional_0_Conditional_45_ng_template_14_Template_app_menu_itemSelect_37_listener($event) {
      \u0275\u0275restoreView(_r25);
      const ctx_r1 = \u0275\u0275nextContext(7);
      return \u0275\u0275resetView(ctx_r1.onAction($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const report_r26 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(7);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(8, 13, "operator.revenue.delivery.report.period"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatRevenueReportPeriod(report_r26.period), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" ", \u0275\u0275pipeBind1(13, 15, "operator.revenue.delivery.report.revision"), " ", report_r26.revision, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(16, 17, report_r26.failureMessage || "operator.revenue.delivery.report.failure.unknown"), " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(report_r26.failureCode ? 17 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(22, 19, "operator.revenue.delivery.report.attempts"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(report_r26.attemptCount);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(28, 21, "operator.revenue.delivery.report.currencies"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.revenueReportCurrencies(report_r26));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(34, 23, "operator.revenue.delivery.report.failed.at"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.formatDate(report_r26.failedAt || report_r26.updatedAt));
    \u0275\u0275advance();
    \u0275\u0275property("items", ctx_r1.revenueReportActionItems(report_r26));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_3_Conditional_0_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 91);
    \u0275\u0275pipe(1, "i18n");
    \u0275\u0275elementStart(2, "header")(3, "span")(4, "small");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "strong");
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "b");
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(12, "app-smart-list", 92, 0);
    \u0275\u0275template(14, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_3_Conditional_0_Conditional_45_ng_template_14_Template, 38, 25, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const revenueReportTemplate_r27 = \u0275\u0275reference(15);
    const delivery_r24 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(1, 8, "operator.revenue.delivery.reports.blocked"));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(6, 10, "operator.revenue.delivery.reports"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(9, 12, "operator.revenue.delivery.reports.blocked"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(delivery_r24.blocked);
    \u0275\u0275advance();
    \u0275\u0275property("config", ctx_r1.revenueReportConfig)("loadPage", ctx_r1.loadRevenueReportPage)("query", ctx_r1.revenueReportQuery())("itemTemplate", revenueReportTemplate_r27);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 90)(1, "header")(2, "mat-icon");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span")(5, "small");
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "strong");
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "time");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(13, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_3_Conditional_0_Conditional_13_Template, 3, 3, "p");
    \u0275\u0275elementStart(14, "dl")(15, "div")(16, "dt");
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "dd");
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div")(22, "dt");
    \u0275\u0275text(23);
    \u0275\u0275pipe(24, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "dd");
    \u0275\u0275text(26);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "div")(28, "dt");
    \u0275\u0275text(29);
    \u0275\u0275pipe(30, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "dd");
    \u0275\u0275text(32);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(33, "div")(34, "dt");
    \u0275\u0275text(35);
    \u0275\u0275pipe(36, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "dd");
    \u0275\u0275text(38);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(39, "div")(40, "dt");
    \u0275\u0275text(41);
    \u0275\u0275pipe(42, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "dd");
    \u0275\u0275text(44);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275conditionalCreate(45, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_3_Conditional_0_Conditional_45_Template, 16, 14, "section", 91);
  }
  if (rf & 2) {
    const delivery_r24 = ctx;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275attribute("data-state", delivery_r24.state)("role", delivery_r24.state === "BLOCKED" || delivery_r24.state === "ERROR" ? "alert" : "status");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.revenueSyncStateIcon(delivery_r24.state));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(7, 19, "operator.revenue.delivery"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(10, 21, ctx_r1.revenueSyncStateLabel(delivery_r24.state)));
    \u0275\u0275advance(2);
    \u0275\u0275attribute("datetime", delivery_r24.synchronizedAtIso);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatDate(delivery_r24.synchronizedAtIso), " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(delivery_r24.message ? 13 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(18, 23, "operator.revenue.delivery.materialized"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(delivery_r24.materialized);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(24, 25, "operator.revenue.delivery.submitted"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(delivery_r24.submitted);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(30, 27, "operator.revenue.delivery.accepted"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(delivery_r24.accepted);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(36, 29, "operator.revenue.delivery.pending"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(delivery_r24.pending);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(42, 31, "operator.revenue.delivery.blocked"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(delivery_r24.blocked);
    \u0275\u0275advance();
    \u0275\u0275conditional(delivery_r24.blocked > 0 ? 45 : -1);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 10);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 1, "operator.revenue.delivery.manual.description"), " ");
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_3_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 88)(1, "mat-icon");
    \u0275\u0275text(2, "cloud_off");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 1, "operator.revenue.settlement.unavailable"));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_3_Conditional_24_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 97)(1, "header")(2, "span", 98)(3, "small");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "strong");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "span", 99);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span", 100);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "dl", 101)(14, "div")(15, "dt");
    \u0275\u0275text(16);
    \u0275\u0275pipe(17, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "dd");
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "div")(21, "dt");
    \u0275\u0275text(22);
    \u0275\u0275pipe(23, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "dd");
    \u0275\u0275text(25);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "div")(27, "dt");
    \u0275\u0275text(28);
    \u0275\u0275pipe(29, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "dd");
    \u0275\u0275text(31);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(32, "dl", 102)(33, "div")(34, "dt");
    \u0275\u0275text(35);
    \u0275\u0275pipe(36, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "dd");
    \u0275\u0275text(38);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(39, "div")(40, "dt");
    \u0275\u0275text(41);
    \u0275\u0275pipe(42, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "dd");
    \u0275\u0275text(44);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(45, "div")(46, "dt");
    \u0275\u0275text(47);
    \u0275\u0275pipe(48, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "dd");
    \u0275\u0275text(50);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(51, "div")(52, "dt");
    \u0275\u0275text(53);
    \u0275\u0275pipe(54, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "dd");
    \u0275\u0275text(56);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(57, "dl", 103)(58, "div")(59, "dt");
    \u0275\u0275text(60);
    \u0275\u0275pipe(61, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(62, "dd");
    \u0275\u0275text(63);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(64, "div")(65, "dt");
    \u0275\u0275text(66);
    \u0275\u0275pipe(67, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(68, "dd");
    \u0275\u0275text(69);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(70, "div")(71, "dt");
    \u0275\u0275text(72);
    \u0275\u0275pipe(73, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(74, "dd");
    \u0275\u0275text(75);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(76, "div")(77, "dt");
    \u0275\u0275text(78);
    \u0275\u0275pipe(79, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(80, "dd");
    \u0275\u0275text(81);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(82, "div")(83, "dt");
    \u0275\u0275text(84);
    \u0275\u0275pipe(85, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(86, "dd");
    \u0275\u0275text(87);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(88, "div")(89, "dt");
    \u0275\u0275text(90);
    \u0275\u0275pipe(91, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(92, "dd");
    \u0275\u0275text(93);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(94, "div")(95, "dt");
    \u0275\u0275text(96);
    \u0275\u0275pipe(97, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(98, "dd");
    \u0275\u0275text(99);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(100, "div")(101, "dt");
    \u0275\u0275text(102);
    \u0275\u0275pipe(103, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(104, "dd");
    \u0275\u0275text(105);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(106, "footer")(107, "span");
    \u0275\u0275text(108);
    \u0275\u0275pipe(109, "i18n");
    \u0275\u0275elementStart(110, "strong");
    \u0275\u0275text(111);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(112, "span");
    \u0275\u0275text(113);
    \u0275\u0275pipe(114, "i18n");
    \u0275\u0275elementStart(115, "strong");
    \u0275\u0275text(116);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const settlement_r28 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(6);
    \u0275\u0275attribute("data-trend", ctx_r1.settlementTrend(settlement_r28));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(5, 40, "operator.revenue.settlement.period"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatSettlementPeriod(settlement_r28.period), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", settlement_r28.currencyCode, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" ", \u0275\u0275pipeBind1(12, 42, "operator.revenue.settlement.revision"), " ", settlement_r28.revision, " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(17, 44, "operator.revenue.settlement.monthly.pool"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatSettlementMinor(settlement_r28.networkPoolMinor, settlement_r28), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(23, 46, "operator.revenue.settlement.monthly.group.allocation"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatSettlementMinor(settlement_r28.networkPoolAllocationMinor, settlement_r28), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(29, 48, "operator.revenue.settlement.share"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.formatSettlementShare(settlement_r28));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(36, 50, "operator.revenue.settlement.ttm.basis"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatSettlementMinor(settlement_r28.ttmCommissionBasisMinor, settlement_r28), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(42, 52, "operator.revenue.settlement.ttm.pool"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatSettlementMinor(settlement_r28.ttmNetworkCommissionPoolMinor, settlement_r28), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(48, 54, "operator.revenue.settlement.indicative.network.value"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatSettlementMinor(settlement_r28.indicativeNetworkValueMinor, settlement_r28), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(54, 56, "operator.revenue.settlement.indicative.group.allocation"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatSettlementMinor(settlement_r28.indicativeValueAllocationMinor, settlement_r28), " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(61, 58, "operator.revenue.settlement.average.earlier"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatSettlementMinor(settlement_r28.earlierThreeMonthAverageMinor, settlement_r28), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(67, 60, "operator.revenue.settlement.average.prior"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatSettlementMinor(settlement_r28.priorThreeMonthAverageMinor, settlement_r28), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(73, 62, "operator.revenue.settlement.average.recent"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatSettlementMinor(settlement_r28.recentThreeMonthAverageMinor, settlement_r28), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(79, 64, "operator.revenue.settlement.growth.prior"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatSettlementBasisPoints(settlement_r28.priorGrowthBasisPoints, true), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(85, 66, "operator.revenue.settlement.growth.recent"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatSettlementBasisPoints(settlement_r28.recentGrowthBasisPoints, true), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(91, 68, "operator.revenue.settlement.acceleration"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatSettlementBasisPoints(settlement_r28.accelerationBasisPoints, true), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(97, 70, "operator.revenue.settlement.adjustment"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatSettlementBasisPoints(settlement_r28.valuationAdjustmentBasisPoints, true), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(103, 72, "operator.revenue.settlement.multiplier"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatSettlementMultiplier(settlement_r28.effectiveValuationMultiplierBasisPoints), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(109, 74, "operator.revenue.settlement.ruleset"), ": ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(settlement_r28.valuationRulesetVersion);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(114, 76, "operator.revenue.settlement.accepted"), ": ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.formatDate(settlement_r28.acceptedAtIso));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_3_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-smart-list", 92);
    \u0275\u0275template(1, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_3_Conditional_24_ng_template_1_Template, 117, 78, "ng-template", null, 2, \u0275\u0275templateRefExtractor);
  }
  if (rf & 2) {
    const settlementTemplate_r29 = \u0275\u0275reference(2);
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275property("config", ctx_r1.settlementConfig)("loadPage", ctx_r1.loadSettlementPage)("query", ctx_r1.settlementQuery())("itemTemplate", settlementTemplate_r29);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_3_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-operator-revenue-view", 89);
  }
  if (rf & 2) {
    \u0275\u0275property("revenue", ctx);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_3_Conditional_0_Template, 46, 33)(1, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_3_Conditional_1_Template, 3, 3, "p", 10);
    \u0275\u0275elementStart(2, "section", 85);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementStart(4, "header", 86)(5, "span", 87)(6, "mat-icon");
    \u0275\u0275text(7, "account_balance");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "span")(9, "small");
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "strong");
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "em");
    \u0275\u0275text(16);
    \u0275\u0275pipe(17, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "b")(19, "mat-icon");
    \u0275\u0275text(20, "info");
    \u0275\u0275elementEnd();
    \u0275\u0275text(21);
    \u0275\u0275pipe(22, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(23, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_3_Conditional_23_Template, 6, 3, "p", 88)(24, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_3_Conditional_24_Template, 3, 4);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(25, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_3_Conditional_25_Template, 1, 1, "app-operator-revenue-view", 89);
  }
  if (rf & 2) {
    let tmp_5_0;
    let tmp_12_0;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275conditional((tmp_5_0 = ctx_r1.workspace.revenueSync()) ? 0 : 1, tmp_5_0);
    \u0275\u0275advance(2);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(3, 8, "operator.revenue.settlement.title"));
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(11, 10, "operator.revenue.settlement.eyebrow"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(14, 12, "operator.revenue.settlement.title"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(17, 14, "operator.revenue.settlement.currency.notice"));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(22, 16, "operator.revenue.settlement.nonbinding"), " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.workspace.revenueSettlementAvailable() === false ? 23 : ctx_r1.workspace.revenueSettlementAvailable() === true ? 24 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_12_0 = ctx_r1.workspace.revenue()) ? 25 : -1, tmp_12_0);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_4_Conditional_0_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 107)(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const entry_r30 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275attribute("data-status", entry_r30.eligibilityStatus);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", entry_r30.eligibilityStatus === "SUSPENDED" ? "pause_circle" : entry_r30.eligibilityStatus === "PARTIALLY_SUSPENDED" ? "warning" : "gpp_maybe", " ");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.claimEligibilityLabel(entry_r30.eligibilityStatus), " ");
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_4_Conditional_0_ng_template_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "single-row", 109);
  }
  if (rf & 2) {
    const deployment_r31 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(6);
    \u0275\u0275property("row", ctx_r1.leaderboardDeploymentRow(deployment_r31));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_4_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 104);
    \u0275\u0275pipe(1, "i18n");
    \u0275\u0275elementStart(2, "header", 105)(3, "span", 106)(4, "mat-icon");
    \u0275\u0275text(5, "hub");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "span")(7, "small");
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "strong");
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(13, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_4_Conditional_0_Conditional_13_Template, 4, 3, "span", 107);
    \u0275\u0275elementStart(14, "b");
    \u0275\u0275pipe(15, "i18n");
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(17, "app-smart-list", 108);
    \u0275\u0275template(18, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_4_Conditional_0_ng_template_18_Template, 1, 1, "ng-template", null, 3, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const entry_r30 = ctx;
    const leaderboardDeploymentTemplate_r32 = \u0275\u0275reference(19);
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(1, 11, "operator.leaderboard.deployments.title"));
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(9, 13, "operator.leaderboard.network"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", entry_r30.deploymentCount || 0, " ", \u0275\u0275pipeBind1(12, 15, (entry_r30.deploymentCount || 0) === 1 ? "operator.leaderboard.deployment" : "operator.leaderboard.deployments"), " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(entry_r30.eligibilityStatus !== "ACTIVE" ? 13 : -1);
    \u0275\u0275advance();
    \u0275\u0275attribute("title", \u0275\u0275pipeBind1(15, 17, "operator.leaderboard.share"));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatShare(entry_r30.sharePercent), "% ");
    \u0275\u0275advance();
    \u0275\u0275property("config", ctx_r1.leaderboardDeploymentConfig)("loadPage", ctx_r1.loadLeaderboardDeploymentPage)("query", ctx_r1.leaderboardDeploymentQuery())("itemTemplate", leaderboardDeploymentTemplate_r32);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_4_Conditional_0_Template, 20, 19, "section", 104);
  }
  if (rf & 2) {
    let tmp_5_0;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275conditional((tmp_5_0 = ctx_r1.menu.selectedLeaderboardEntry()) ? 0 : -1, tmp_5_0);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_9_For_2_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 117);
    \u0275\u0275pipe(1, "i18n");
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "mat-icon");
    \u0275\u0275text(6, "open_in_new");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const provider_r33 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("href", ctx, \u0275\u0275sanitizeUrl);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(1, 3, "operator.community.provider.open") + " " + provider_r33.name);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 5, "operator.community.provider.join"));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_9_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 114)(1, "span", 115)(2, "mat-icon");
    \u0275\u0275text(3, "forum");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "span", 116)(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "small");
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(10, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_9_For_2_Conditional_10_Template, 7, 7, "a", 117);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_20_0;
    const provider_r33 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(7);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(provider_r33.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(9, 3, provider_r33.purpose));
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_20_0 = provider_r33.available && ctx_r1.safeExternalUrl(provider_r33.url)) ? 10 : -1, tmp_20_0);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 112);
    \u0275\u0275repeaterCreate(1, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_9_For_2_Template, 11, 5, "article", 114, _forTrack02);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const community_r34 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(community_r34.providers);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 10);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 1, "operator.community.providers.empty"), " ");
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_11_For_5_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i");
    \u0275\u0275pipe(1, "i18n");
    \u0275\u0275pipe(2, "i18n");
  }
  if (rf & 2) {
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(1, 2, "operator.community.announcement.unread"))("title", \u0275\u0275pipeBind1(2, 4, "operator.community.announcement.unread"));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_11_For_5_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
    \u0275\u0275pipe(1, "i18n");
  }
  if (rf & 2) {
    const announcement_r35 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(7);
    \u0275\u0275textInterpolate2(" \xB7 ", \u0275\u0275pipeBind1(1, 2, "operator.community.announcement.expires"), " ", ctx_r1.formatDate(announcement_r35.expiresAt), " ");
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_11_For_5_Conditional_24_Conditional_8_For_2_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1, "verified");
    \u0275\u0275elementEnd();
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_11_For_5_Conditional_24_Conditional_8_For_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 125);
    \u0275\u0275conditionalCreate(1, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_11_For_5_Conditional_24_Conditional_8_For_2_Conditional_0_Conditional_1_Template, 2, 0, "mat-icon");
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "mat-icon");
    \u0275\u0275text(6, "open_in_new");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const link_r36 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("href", ctx, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance();
    \u0275\u0275conditional(link_r36.verified ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 3, link_r36.label));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_11_For_5_Conditional_24_Conditional_8_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_11_For_5_Conditional_24_Conditional_8_For_2_Conditional_0_Template, 7, 5, "a", 125);
  }
  if (rf & 2) {
    let tmp_30_0;
    const link_r36 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(10);
    \u0275\u0275conditional((tmp_30_0 = ctx_r1.safeExternalUrl(link_r36.url)) ? 0 : -1, tmp_30_0);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_11_For_5_Conditional_24_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "nav", 123);
    \u0275\u0275repeaterCreate(1, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_11_For_5_Conditional_24_Conditional_8_For_2_Template, 1, 1, null, null, _forTrack02);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const announcement_r35 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275repeater(announcement_r35.links);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_11_For_5_Conditional_24_Conditional_9_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const note_r37 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, note_r37));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_11_For_5_Conditional_24_Conditional_9_Conditional_65_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 125);
    \u0275\u0275pipe(1, "i18n");
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "verified");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "mat-icon");
    \u0275\u0275text(8, "open_in_new");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const downloadUrl_r38 = \u0275\u0275nextContext();
    \u0275\u0275property("href", downloadUrl_r38, \u0275\u0275sanitizeUrl);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(1, 3, "operator.community.announcement.download.open"));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(6, 5, "operator.community.announcement.download.verified"));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_11_For_5_Conditional_24_Conditional_9_Conditional_65_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 128)(1, "mat-icon");
    \u0275\u0275text(2, "gpp_maybe");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(4, 1, "operator.community.announcement.download.unverified"), " ");
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_11_For_5_Conditional_24_Conditional_9_Conditional_65_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_11_For_5_Conditional_24_Conditional_9_Conditional_65_Conditional_0_Template, 9, 7, "a", 125)(1, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_11_For_5_Conditional_24_Conditional_9_Conditional_65_Conditional_1_Template, 5, 3, "span", 128);
  }
  if (rf & 2) {
    const release_r39 = \u0275\u0275nextContext();
    \u0275\u0275conditional(release_r39.artifact.downloadUrlVerified ? 0 : 1);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_11_For_5_Conditional_24_Conditional_9_Conditional_66_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 128)(1, "mat-icon");
    \u0275\u0275text(2, "gpp_maybe");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(4, 1, "operator.community.announcement.download.unverified"), " ");
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_11_For_5_Conditional_24_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 124)(1, "header")(2, "span")(3, "small");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "strong");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "p");
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "ul");
    \u0275\u0275repeaterCreate(12, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_11_For_5_Conditional_24_Conditional_9_For_13_Template, 3, 3, "li", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "dl")(15, "div")(16, "dt");
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "dd");
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div")(22, "dt");
    \u0275\u0275text(23);
    \u0275\u0275pipe(24, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "dd");
    \u0275\u0275text(26);
    \u0275\u0275pipe(27, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "div")(29, "dt");
    \u0275\u0275text(30, "SHA-256");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "dd")(32, "code");
    \u0275\u0275text(33);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(34, "div")(35, "dt");
    \u0275\u0275text(36);
    \u0275\u0275pipe(37, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "dd")(39, "code");
    \u0275\u0275text(40);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(41, "div")(42, "dt");
    \u0275\u0275text(43);
    \u0275\u0275pipe(44, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "dd")(46, "code");
    \u0275\u0275text(47);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(48, "div")(49, "dt");
    \u0275\u0275text(50);
    \u0275\u0275pipe(51, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(52, "dd", 126)(53, "mat-icon");
    \u0275\u0275text(54);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "span");
    \u0275\u0275text(56);
    \u0275\u0275pipe(57, "i18n");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(58, "div", 127)(59, "span")(60, "small");
    \u0275\u0275text(61);
    \u0275\u0275pipe(62, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(63, "code");
    \u0275\u0275text(64);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(65, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_11_For_5_Conditional_24_Conditional_9_Conditional_65_Template, 2, 1)(66, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_11_For_5_Conditional_24_Conditional_9_Conditional_66_Template, 5, 3, "span", 128);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_40_0;
    const release_r39 = ctx;
    const ctx_r1 = \u0275\u0275nextContext(9);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 19, "operator.community.announcement.version"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("v", release_r39.version);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(10, 21, release_r39.purpose));
    \u0275\u0275advance(3);
    \u0275\u0275repeater(release_r39.releaseNotes);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(18, 23, "operator.community.announcement.artifact.size"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.formatBytes(release_r39.artifact.sizeBytes));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(24, 25, "operator.community.announcement.artifact.compatibility"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(27, 27, release_r39.artifact.compatibility));
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(release_r39.artifact.sha256Digest);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(37, 29, "operator.community.announcement.artifact.signing.key"));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(release_r39.artifact.packageSigningKeyId);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(44, 31, "operator.community.announcement.artifact.signature"));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(release_r39.artifact.signature);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(51, 33, "operator.community.announcement.artifact.signature.status"));
    \u0275\u0275advance(2);
    \u0275\u0275attribute("data-verified", release_r39.artifact.signatureVerified);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", release_r39.artifact.signatureVerified ? "verified_user" : "gpp_maybe", " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(57, 35, release_r39.artifact.signatureVerified ? "operator.community.announcement.artifact.signature.verified" : "operator.community.announcement.artifact.signature.unverified"), " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(62, 37, "operator.community.announcement.download"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(release_r39.artifact.downloadUrl);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_40_0 = ctx_r1.safeExternalUrl(release_r39.artifact.downloadUrl)) ? 65 : 66, tmp_40_0);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_11_For_5_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "details", 121)(1, "summary")(2, "mat-icon");
    \u0275\u0275text(3, "expand_more");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 122);
    \u0275\u0275conditionalCreate(8, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_11_For_5_Conditional_24_Conditional_8_Template, 3, 0, "nav", 123);
    \u0275\u0275conditionalCreate(9, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_11_For_5_Conditional_24_Conditional_9_Template, 67, 39, "section", 124);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_21_0;
    const announcement_r35 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(6, 3, "operator.community.announcement.details"));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(announcement_r35.links.length > 0 ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_21_0 = announcement_r35.update) ? 9 : -1, tmp_21_0);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_11_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 118)(1, "header")(2, "span")(3, "small");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "strong");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "span", 119);
    \u0275\u0275conditionalCreate(10, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_11_For_5_Conditional_10_Template, 3, 6, "i");
    \u0275\u0275elementStart(11, "em");
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "b");
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "i18n");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(17, "p");
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "small", 120);
    \u0275\u0275text(21);
    \u0275\u0275pipe(22, "i18n");
    \u0275\u0275conditionalCreate(23, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_11_For_5_Conditional_23_Template, 2, 4);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(24, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_11_For_5_Conditional_24_Template, 10, 5, "details", 121);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const announcement_r35 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(7);
    \u0275\u0275attribute("data-severity", announcement_r35.severity);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(5, 13, "operator.community.announcement.kind." + announcement_r35.kind.toLowerCase()), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 15, announcement_r35.title));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(announcement_r35.unread ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275attribute("data-severity", announcement_r35.severity);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(13, 17, "operator.community.announcement.severity." + announcement_r35.severity.toLowerCase()), " ");
    \u0275\u0275advance(2);
    \u0275\u0275attribute("data-status", announcement_r35.status);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(16, 19, "operator.community.announcement.status." + announcement_r35.status.toLowerCase()), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(19, 21, announcement_r35.body));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", \u0275\u0275pipeBind1(22, 23, "operator.community.announcement.published"), " ", ctx_r1.formatDate(announcement_r35.publishedAt), " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(announcement_r35.expiresAt ? 23 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(announcement_r35.links.length > 0 || announcement_r35.update ? 24 : -1);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 113)(1, "h3");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(4, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_11_For_5_Template, 25, 25, "article", 118, _forTrack02);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const community_r34 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 1, "operator.community.announcements"));
    \u0275\u0275advance(2);
    \u0275\u0275repeater(community_r34.announcements);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 110);
    \u0275\u0275element(1, "span", 111);
    \u0275\u0275elementStart(2, "span")(3, "small");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "strong");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "i18n");
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(9, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_9_Template, 3, 0, "div", 112)(10, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_10_Template, 3, 3, "p", 10);
    \u0275\u0275conditionalCreate(11, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Conditional_11_Template, 6, 3, "section", 113);
  }
  if (rf & 2) {
    const community_r34 = ctx;
    \u0275\u0275advance();
    \u0275\u0275attribute("data-state", community_r34.availability);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 5, "operator.community.current"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(8, 7, "operator.community." + community_r34.availability.toLowerCase()), " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(community_r34.providers.length > 0 ? 9 : 10);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(community_r34.announcements.length > 0 ? 11 : -1);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Conditional_0_Template, 12, 9);
  }
  if (rf & 2) {
    let tmp_5_0;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275conditional((tmp_5_0 = ctx_r1.workspace.community()) ? 0 : -1, tmp_5_0);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Conditional_6_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 15)(1, "mat-icon");
    \u0275\u0275text(2, "error_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 1, ctx_r1.workspace.error()));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Conditional_6_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 21)(1, "mat-icon");
    \u0275\u0275text(2, "check_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 1, ctx_r1.workspace.notice()));
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Conditional_6_Conditional_0_Template, 6, 3, "p", 15);
    \u0275\u0275conditionalCreate(1, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Conditional_6_Conditional_1_Template, 6, 3, "p", 21);
  }
  if (rf & 2) {
    let tmp_6_0;
    const activeKind_r40 = \u0275\u0275nextContext(3);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r1.workspace.error() ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.workspace.notice() && !(activeKind_r40 === "claim" && (((tmp_6_0 = ctx_r1.workspace.claimStatus()) == null ? null : tmp_6_0.verificationStatus) === "PENDING_REVIEW" || ((tmp_6_0 = ctx_r1.workspace.claimStatus()) == null ? null : tmp_6_0.verificationStatus) === "REJECTED")) ? 1 : -1);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r41 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-menu", 129);
    \u0275\u0275listener("itemSelect", function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Conditional_7_Template_app_menu_itemSelect_0_listener($event) {
      \u0275\u0275restoreView(_r41);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.onAction($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275property("items", ctx_r1.actionItems());
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_0_Template, 1, 1)(1, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_1_Template, 1, 1)(2, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_2_Template, 1, 1)(3, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_3_Template, 26, 18)(4, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_4_Template, 1, 1)(5, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Case_5_Template, 1, 1);
    \u0275\u0275conditionalCreate(6, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Conditional_6_Template, 2, 2);
    \u0275\u0275conditionalCreate(7, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Conditional_7_Template, 1, 1, "app-menu", 8);
  }
  if (rf & 2) {
    let tmp_4_0;
    const activeKind_r40 = \u0275\u0275nextContext(2);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_4_0 = activeKind_r40) === "updates" ? 0 : tmp_4_0 === "claim" ? 1 : tmp_4_0 === "configuration" ? 2 : tmp_4_0 === "revenue" ? 3 : tmp_4_0 === "deployments" ? 4 : tmp_4_0 === "community" ? 5 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(activeKind_r40 !== "configuration" && activeKind_r40 !== "deployments" ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.actionItems().length > 0 ? 7 : -1);
  }
}
function OperatorActionPopupComponent_Conditional_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-popup", 4)(1, "section", 5);
    \u0275\u0275conditionalCreate(2, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_2_Template, 5, 3, "div", 6)(3, OperatorActionPopupComponent_Conditional_0_Conditional_0_Conditional_3_Template, 8, 3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const activeKind_r40 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.popupModel());
    \u0275\u0275advance();
    \u0275\u0275classProp("operator-action-popup--loading", ctx_r1.loading())("operator-action-popup--deployments", activeKind_r40 === "deployments");
    \u0275\u0275attribute("aria-busy", ctx_r1.busy());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.loading() ? 2 : 3);
  }
}
function OperatorActionPopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, OperatorActionPopupComponent_Conditional_0_Conditional_0_Template, 4, 7, "app-popup", 4);
  }
  if (rf & 2) {
    \u0275\u0275conditional(ctx !== "registration" ? 0 : -1);
  }
}
var OperatorActionPopupComponent = class _OperatorActionPopupComponent {
  menu = inject(OperatorMenuStore);
  registry = inject(OperatorRegistryStore);
  workspace = inject(OperatorWorkspaceStore);
  leaderboard = inject(OperatorLeaderboardStore);
  dialog = inject(DialogStore);
  i18n = inject(I18nService);
  destroyRef = inject(DestroyRef);
  claimPath = signal("company", ...ngDevMode ? [{ debugName: "claimPath" }] : (
    /* istanbul ignore next */
    []
  ));
  requeueingReportId = signal(null, ...ngDevMode ? [{ debugName: "requeueingReportId" }] : (
    /* istanbul ignore next */
    []
  ));
  revenueReportsSmartListRef = signal(null, ...ngDevMode ? [{ debugName: "revenueReportsSmartListRef" }] : (
    /* istanbul ignore next */
    []
  ));
  set revenueReportsSmartList(value) {
    this.revenueReportsSmartListRef.set(value ?? null);
  }
  kind = computed(() => this.menu.activePopup(), ...ngDevMode ? [{ debugName: "kind" }] : (
    /* istanbul ignore next */
    []
  ));
  busyAction = this.workspace.busyAction;
  busy = computed(() => this.busyAction() !== null, ...ngDevMode ? [{ debugName: "busy" }] : (
    /* istanbul ignore next */
    []
  ));
  loading = computed(() => {
    switch (this.kind()) {
      case "updates":
        return this.busyAction() === "load-update" && !this.workspace.deploymentUpdate();
      case "claim":
        return this.busyAction() === "load-claim";
      case "configuration":
        return this.busyAction() === "load-configuration";
      case "revenue":
        return this.busyAction() === "load-revenue";
      case "community":
        return this.busyAction() === "load-community" && !this.workspace.community();
      default:
        return false;
    }
  }, ...ngDevMode ? [{ debugName: "loading" }] : (
    /* istanbul ignore next */
    []
  ));
  actionItems = computed(() => this.buildActionItems(this.kind()), ...ngDevMode ? [{ debugName: "actionItems" }] : (
    /* istanbul ignore next */
    []
  ));
  revenueReportQuery = computed(() => ({
    page: 0,
    pageSize: 5,
    sort: "period",
    direction: "desc",
    filters: {
      status: "BLOCKED",
      revision: this.workspace.revenueSync()?.synchronizedAtIso ?? ""
    }
  }), ...ngDevMode ? [{ debugName: "revenueReportQuery" }] : (
    /* istanbul ignore next */
    []
  ));
  revenueReportConfig = {
    pageSize: 5,
    initialPageSize: 5,
    defaultView: "list",
    emptyLabel: "operator.revenue.delivery.reports.empty",
    emptyDescription: "operator.revenue.delivery.reports.empty.description",
    showStickyHeader: false,
    showFirstGroupMarker: false,
    listLayout: "stack",
    snapMode: "none",
    preloadOffsetPx: 120,
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
  loadRevenueReportPage = (query, context) => from(this.workspace.revenueReportPage(query, context?.signal));
  settlementQuery = computed(() => ({
    page: 0,
    pageSize: 6,
    sort: "period",
    direction: "desc",
    filters: {
      includeSuperseded: false
    }
  }), ...ngDevMode ? [{ debugName: "settlementQuery" }] : (
    /* istanbul ignore next */
    []
  ));
  settlementConfig = {
    pageSize: 6,
    initialPageSize: 6,
    defaultView: "list",
    emptyLabel: "operator.revenue.settlement.empty",
    emptyDescription: "operator.revenue.settlement.empty.description",
    showStickyHeader: false,
    showFirstGroupMarker: false,
    listLayout: "stack",
    snapMode: "none",
    preloadOffsetPx: 160,
    headerProgress: {
      enabled: true,
      placement: "inline",
      tone: "accent"
    },
    cacheable: {
      identity: (settlement) => settlement.settlementId
    },
    containerClass: {
      "operator-settlement-smart-list": true
    },
    trackBy: (_index, settlement) => settlement.settlementId
  };
  loadSettlementPage = (query, context) => from(this.workspace.settlementPage(query, context?.signal));
  leaderboardDeploymentQuery = computed(() => ({
    page: 0,
    pageSize: 8,
    filters: {
      groupId: this.menu.selectedLeaderboardEntry()?.operatorGroupId?.trim() ?? ""
    }
  }), ...ngDevMode ? [{ debugName: "leaderboardDeploymentQuery" }] : (
    /* istanbul ignore next */
    []
  ));
  leaderboardDeploymentConfig = {
    pageSize: 8,
    initialPageSize: 8,
    defaultView: "list",
    emptyLabel: "operator.leaderboard.deployments.empty",
    emptyDescription: "operator.leaderboard.deployments.empty.description",
    showStickyHeader: false,
    showFirstGroupMarker: false,
    listLayout: "stack",
    snapMode: "none",
    preloadOffsetPx: 160,
    headerProgress: {
      enabled: true,
      placement: "inline",
      tone: "accent"
    },
    cacheable: {
      identity: (deployment) => deployment.deploymentId
    },
    containerClass: {
      "operator-leaderboard-deployment-smart-list": true
    },
    trackBy: (_index, deployment) => deployment.deploymentId
  };
  loadLeaderboardDeploymentPage = (query, context) => from(this.leaderboard.queryDeploymentPage(query, context?.signal));
  claimPathItems = computed(() => [
    {
      id: "operator-claim-path-company",
      label: "operator.claim.path.company",
      description: "operator.claim.path.company.description",
      icon: "business",
      kind: "radio",
      layout: "pill",
      palette: "blue",
      active: this.claimPath() === "company",
      checked: this.claimPath() === "company",
      disabled: this.busy(),
      context: {
        action: "set-claim-path",
        claimPath: "company"
      }
    },
    {
      id: "operator-claim-path-client-code",
      label: "operator.claim.path.client.code",
      description: "operator.claim.path.client.code.description",
      icon: "key",
      kind: "radio",
      layout: "pill",
      palette: "teal",
      active: this.claimPath() === "client-code",
      checked: this.claimPath() === "client-code",
      disabled: this.busy() || !this.registeredForClaim(),
      context: {
        action: "set-claim-path",
        claimPath: "client-code"
      }
    }
  ], ...ngDevMode ? [{ debugName: "claimPathItems" }] : (
    /* istanbul ignore next */
    []
  ));
  claimCompanyFormModel = computed(() => {
    this.i18n.revision();
    const translate = (key) => this.i18n.translate(key);
    return {
      title: translate("operator.claim.path.company"),
      layout: "grouped",
      header: false,
      save: null,
      completion: { controls: "required" },
      steps: [
        {
          id: "operator-claim-company",
          title: translate("operator.claim.verification.company"),
          icon: "business",
          palette: "purple",
          controls: [
            {
              id: "operator-claim-legal-name",
              bind: "legalName",
              kind: "text",
              layout: "half",
              label: translate("operator.claim.verification.legal.name"),
              required: true,
              maxLength: 160
            },
            {
              id: "operator-claim-registration-number",
              bind: "registrationNumber",
              kind: "text",
              layout: "half",
              label: translate("operator.claim.verification.registration.number"),
              required: true,
              maxLength: 80
            },
            {
              id: "operator-claim-jurisdiction",
              bind: "jurisdiction",
              kind: "text",
              layout: "half",
              label: translate("operator.claim.verification.jurisdiction"),
              required: true,
              maxLength: 80
            },
            {
              id: "operator-claim-website",
              bind: "website",
              kind: "link",
              layout: "half",
              label: translate("operator.claim.verification.website"),
              placeholder: "https://",
              required: true,
              maxLength: 2048,
              validationError: (value) => {
                const website = `${value ?? ""}`.trim();
                return website && !this.validClaimWebsite(website) ? translate("operator.claim.verification.error.website") : null;
              }
            },
            {
              id: "operator-claim-registered-address",
              bind: "registeredAddress",
              kind: "textarea",
              layout: "wide",
              label: translate("operator.claim.verification.registered.address"),
              required: true,
              rows: 3,
              maxLength: 500
            }
          ]
        },
        {
          id: "operator-claim-authority",
          title: translate("operator.claim.verification.authority"),
          icon: "verified_user",
          palette: "blue",
          controls: [
            {
              id: "operator-claim-contact-name",
              bind: "verificationContactName",
              kind: "text",
              layout: "half",
              label: translate("operator.claim.verification.contact.name"),
              required: true,
              maxLength: 120
            },
            {
              id: "operator-claim-contact-role",
              bind: "verificationContactRole",
              kind: "text",
              layout: "half",
              label: translate("operator.claim.verification.contact.role"),
              required: true,
              maxLength: 120
            },
            {
              id: "operator-claim-contact-email",
              bind: "verificationContactEmail",
              kind: "text",
              layout: "wide",
              label: translate("operator.claim.verification.contact.email"),
              required: true,
              maxLength: 254,
              validationError: (value) => {
                const contactEmail = `${value ?? ""}`.trim();
                return contactEmail && !this.validClaimEmail(contactEmail) ? translate("operator.claim.verification.error.email") : null;
              }
            },
            {
              id: "operator-claim-attestation",
              bind: "authorityAttested",
              kind: "checkbox",
              layout: "wide",
              label: translate("operator.claim.verification.attestation"),
              required: true
            }
          ]
        }
      ]
    };
  }, ...ngDevMode ? [{ debugName: "claimCompanyFormModel" }] : (
    /* istanbul ignore next */
    []
  ));
  claimClientCodeFormModel = computed(() => {
    this.i18n.revision();
    const translate = (key) => this.i18n.translate(key);
    return {
      title: translate("operator.claim.path.client.code"),
      layout: "grouped",
      header: false,
      save: null,
      completion: { controls: "required" },
      steps: [{
        id: "operator-claim-client-code",
        title: translate("operator.claim.client.code"),
        subtitle: translate("operator.claim.client.code.instructions"),
        icon: "key",
        palette: "teal",
        controls: [{
          id: "operator-claim-client-code-value",
          bind: "clientToken",
          kind: "text",
          layout: "wide",
          label: translate("operator.claim.client.code"),
          placeholder: translate("operator.claim.client.code.placeholder"),
          required: true,
          maxLength: 500
        }]
      }]
    };
  }, ...ngDevMode ? [{ debugName: "claimClientCodeFormModel" }] : (
    /* istanbul ignore next */
    []
  ));
  claimClientCodeValue = computed(() => ({
    clientToken: this.workspace.groupTokenInput()
  }), ...ngDevMode ? [{ debugName: "claimClientCodeValue" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationAdminEmailsFormModel = computed(() => {
    this.i18n.revision();
    const translate = (key) => this.i18n.translate(key);
    return {
      title: translate("operator.configuration.admin"),
      layout: "grouped",
      header: false,
      save: null,
      completion: { controls: "none" },
      steps: [{
        id: "operator-configuration-admin-emails",
        title: "",
        chrome: "none",
        controls: [{
          id: "operator-configuration-admin-email-list",
          bind: "adminEmailsText",
          kind: "textarea",
          layout: "wide",
          label: translate("operator.configuration.admin.emails"),
          placeholder: translate("operator.configuration.admin.emails.placeholder"),
          rows: 4,
          maxLength: 8192,
          validationError: () => this.workspace.configurationAdminEmailsValidationKey()
        }]
      }]
    };
  }, ...ngDevMode ? [{ debugName: "configurationAdminEmailsFormModel" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationAdminEmailsFormValue = computed(() => ({
    adminEmailsText: this.workspace.configurationAdminEmailsInput()
  }), ...ngDevMode ? [{ debugName: "configurationAdminEmailsFormValue" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationPrivacyContactFormModel = computed(() => {
    this.i18n.revision();
    const translate = (key) => this.i18n.translate(key);
    return {
      title: translate("operator.configuration.privacy.contact"),
      layout: "grouped",
      header: false,
      save: null,
      completion: { controls: "none" },
      steps: [{
        id: "operator-configuration-privacy-contact",
        title: "",
        chrome: "none",
        controls: [
          {
            id: "operator-configuration-data-controller-name",
            bind: "dataControllerName",
            kind: "text",
            layout: "half",
            label: translate("operator.configuration.privacy.controller.name"),
            placeholder: translate("operator.configuration.privacy.controller.name.placeholder"),
            maxLength: 160,
            validationError: () => this.workspace.configurationPrivacyContactValidationKey()
          },
          {
            id: "operator-configuration-privacy-contact-email",
            bind: "privacyContactEmail",
            kind: "text",
            layout: "half",
            label: translate("operator.configuration.privacy.contact.email"),
            placeholder: translate("operator.configuration.privacy.contact.email.placeholder"),
            maxLength: 254,
            validationError: () => this.workspace.configurationPrivacyContactValidationKey()
          }
        ]
      }]
    };
  }, ...ngDevMode ? [{ debugName: "configurationPrivacyContactFormModel" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationPrivacyContactFormValue = computed(() => ({
    dataControllerName: this.workspace.configurationDraft()?.privacyContact.dataControllerName ?? "",
    privacyContactEmail: this.workspace.configurationDraft()?.privacyContact.privacyContactEmail ?? ""
  }), ...ngDevMode ? [{ debugName: "configurationPrivacyContactFormValue" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationThemeItems = computed(() => {
    const selected = this.workspace.configurationDraft()?.branding.themePreset;
    return DEPLOYMENT_THEME_PRESETS.map((themePreset) => ({
      id: `operator-theme-${themePreset.toLowerCase()}`,
      label: `operator.configuration.branding.theme.${themePreset.toLowerCase()}`,
      icon: "palette",
      kind: "radio",
      palette: this.themePalette(themePreset),
      active: selected === themePreset,
      checked: selected === themePreset,
      context: {
        action: "set-theme",
        themePreset
      }
    }));
  }, ...ngDevMode ? [{ debugName: "configurationThemeItems" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationTlsModeItems = computed(() => ["AUTOMATIC", "MANUAL"].map((tlsMode) => ({
    id: `operator-configuration-tls-mode-${tlsMode.toLowerCase()}`,
    label: `operator.configuration.tls.mode.${tlsMode.toLowerCase()}`,
    icon: tlsMode === "AUTOMATIC" ? "workspace_premium" : "key",
    kind: "radio",
    active: this.workspace.tlsConfigurationDraft()?.mode === tlsMode,
    checked: this.workspace.tlsConfigurationDraft()?.mode === tlsMode,
    context: { action: "set-tls-mode", tlsMode }
  })), ...ngDevMode ? [{ debugName: "configurationTlsModeItems" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationTlsAutoRenewItems = computed(() => {
    const draft = this.workspace.tlsConfigurationDraft();
    const enabled = draft?.autoRenew === true;
    return [{
      id: "operator-toggle-tls-auto-renew",
      label: "operator.configuration.tls.auto.renew",
      kind: "toggle",
      layout: "pill",
      showToggleIndicator: true,
      palette: "teal",
      active: enabled,
      checked: enabled,
      disabled: this.configurationTlsDisabled() || draft?.enabled !== true || draft?.mode !== "AUTOMATIC",
      closeOnSelect: false,
      ariaLabel: "operator.configuration.tls.auto.renew",
      context: { action: "toggle-tls-auto-renew" }
    }];
  }, ...ngDevMode ? [{ debugName: "configurationTlsAutoRenewItems" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationTlsTestActionItems = computed(() => {
    const domainFeedback = this.workspace.tlsDomainFeedback();
    const certificateFeedback = this.workspace.tlsCertificateFeedback();
    return [
      {
        id: "operator-test-tls-domain",
        label: "operator.configuration.tls.test.domain",
        icon: domainFeedback === "success" ? "check_circle" : domainFeedback === "error" ? "error_outline" : "dns",
        palette: domainFeedback === "success" ? "green" : domainFeedback === "error" ? "red" : "blue",
        layout: "action",
        disabled: this.configurationTlsDisabled() || !this.workspace.tlsConfigurationDraft()?.enabled || !this.workspace.tlsConfigurationReady() || domainFeedback !== null,
        progress: this.busyAction() === "test-tls-domain" ? { state: "loading", durationMs: 3e3 } : domainFeedback ? { state: domainFeedback, durationMs: 1e3 } : null,
        context: { action: "test-tls-domain" }
      },
      {
        id: "operator-test-tls-certificate",
        label: "operator.configuration.tls.test.certificate",
        icon: certificateFeedback === "success" ? "check_circle" : certificateFeedback === "error" ? "error_outline" : "verified_user",
        palette: certificateFeedback === "success" ? "green" : certificateFeedback === "error" ? "red" : "orange",
        layout: "action",
        disabled: this.configurationTlsDisabled() || !this.workspace.tlsConfigurationDraft()?.enabled || !this.workspace.tlsConfigurationReady() || certificateFeedback !== null,
        progress: this.busyAction() === "test-tls-certificate" ? { state: "loading", durationMs: 3e3 } : certificateFeedback ? { state: certificateFeedback, durationMs: 1e3 } : null,
        context: { action: "test-tls-certificate" }
      }
    ];
  }, ...ngDevMode ? [{ debugName: "configurationTlsTestActionItems" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationTlsSaveActionItems = computed(() => {
    const saveFeedback = this.workspace.tlsSaveFeedback();
    return [{
      id: "operator-save-tls",
      label: this.workspace.tlsConfigurationDraft()?.enabled ? "operator.configuration.tls.save" : "operator.configuration.tls.disable",
      icon: saveFeedback === "success" ? "check_circle" : saveFeedback === "error" ? "error_outline" : "save",
      palette: saveFeedback === "success" ? "green" : saveFeedback === "error" ? "red" : "violet",
      layout: "action",
      disabled: this.configurationTlsDisabled() || !this.workspace.tlsConfigurationReady() || saveFeedback !== null,
      progress: this.busyAction() === "save-tls" ? { state: "loading", durationMs: 3e3 } : saveFeedback ? { state: saveFeedback, durationMs: 1e3 } : null,
      context: { action: "save-tls" }
    }];
  }, ...ngDevMode ? [{ debugName: "configurationTlsSaveActionItems" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationPaymentProviderItems = computed(() => {
    const configuration = this.workspace.configuration();
    const selected = this.workspace.configurationDraft()?.payment.providerId ?? null;
    return [
      {
        id: "operator-payment-provider-none",
        label: "operator.configuration.payment.provider.none",
        icon: "money_off",
        kind: "radio",
        palette: "slate",
        active: selected === null,
        checked: selected === null,
        context: {
          action: "set-payment-provider",
          providerId: null
        }
      },
      ...(configuration?.payment.availableProviders ?? []).map((provider) => ({
        id: `operator-payment-provider-${provider.id}`,
        label: provider.label,
        icon: provider.logoUrl ? void 0 : "payments",
        imageUrl: provider.logoUrl,
        imageAlt: provider.logoAlt,
        kind: "radio",
        palette: provider.palette ?? void 0,
        surface: "tinted",
        active: selected === provider.id,
        checked: selected === provider.id,
        context: {
          action: "set-payment-provider",
          providerId: provider.id
        }
      }))
    ];
  }, ...ngDevMode ? [{ debugName: "configurationPaymentProviderItems" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationBrandingActionItems = computed(() => {
    const draft = this.workspace.configurationDraft();
    return [{
      id: "operator-save-branding",
      label: "operator.configuration.branding.save",
      icon: "save",
      palette: "blue",
      layout: "action",
      disabled: this.configurationDisabled() || !draft || !this.workspace.configurationBrandingReady(),
      progress: this.busyAction() === "save-branding" ? { state: "loading", durationMs: 3e3 } : null,
      context: { action: "save-branding" }
    }];
  }, ...ngDevMode ? [{ debugName: "configurationBrandingActionItems" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationAdminEmailActionItems = computed(() => [{
    id: "operator-save-admin-emails",
    label: "operator.configuration.admin.save",
    icon: "save",
    palette: "orange",
    layout: "action",
    disabled: this.configurationDisabled() || !this.workspace.configurationAdminEmailsReady(),
    progress: this.busyAction() === "save-admin-emails" ? { state: "loading", durationMs: 3e3 } : null,
    context: { action: "save-admin-emails" }
  }], ...ngDevMode ? [{ debugName: "configurationAdminEmailActionItems" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationPrivacyContactActionItems = computed(() => [{
    id: "operator-save-privacy-contact",
    label: "operator.configuration.privacy.contact.save",
    icon: "save",
    palette: "blue",
    layout: "action",
    disabled: this.configurationDisabled() || !this.workspace.configurationPrivacyContactReady(),
    progress: this.busyAction() === "save-privacy-contact" ? { state: "loading", durationMs: 3e3 } : null,
    context: { action: "save-privacy-contact" }
  }], ...ngDevMode ? [{ debugName: "configurationPrivacyContactActionItems" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationSocialLinkActionItems = computed(() => {
    const count = this.workspace.configurationDraft()?.socialLinks.length ?? 0;
    return [
      {
        id: "operator-add-social-link",
        label: "operator.configuration.social.add",
        icon: "add_link",
        palette: "teal",
        layout: "action",
        disabled: this.configurationDisabled() || count >= 12,
        context: { action: "add-social-link" }
      },
      {
        id: "operator-save-social-links",
        label: "operator.configuration.social.save",
        icon: "save",
        palette: "green",
        layout: "action",
        disabled: this.configurationDisabled() || !this.workspace.configurationSocialLinksReady(),
        progress: this.busyAction() === "save-social-links" ? { state: "loading", durationMs: 3e3 } : null,
        context: { action: "save-social-links" }
      }
    ];
  }, ...ngDevMode ? [{ debugName: "configurationSocialLinkActionItems" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationPaymentActionItems = computed(() => {
    const configuration = this.workspace.configuration();
    const draft = this.workspace.configurationDraft();
    const mode = this.paymentActionMode();
    const hasCredential = Boolean(draft?.payment.credential.trim());
    const removing = mode === "remove";
    const credentialReady = hasCredential || mode === "update" && configuration?.payment.credentialConfigured === true;
    return [{
      id: `operator-${mode}-payment`,
      label: `operator.configuration.payment.${mode}`,
      detail: configuration?.payment.credentialConfigured ? configuration.payment.credentialMask || "operator.configuration.configured" : "operator.configuration.not.configured",
      icon: removing ? "delete_outline" : "payments",
      palette: removing ? "red" : "green",
      layout: "action",
      disabled: this.configurationDisabled() || !removing && (!this.workspace.configurationPaymentReady() || !credentialReady),
      progress: this.busyAction() === "register-payment" ? { state: "loading", durationMs: 3e3 } : null,
      context: { action: "register-payment" }
    }];
  }, ...ngDevMode ? [{ debugName: "configurationPaymentActionItems" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationFirebaseSaveActionItems = computed(() => {
    const draft = this.workspace.configurationDraft();
    const configuration = this.workspace.configuration();
    const locallyTested = Boolean(this.workspace.configurationAuthenticationTest()?.success && this.workspace.configurationMessagingTest()?.success);
    const publicClientReady = Boolean(draft?.firebase.apiKey.trim() && draft.firebase.authDomain.trim() && draft.firebase.projectId.trim() && draft.firebase.messagingSenderId.trim() && draft.firebase.appId.trim() && draft.firebase.vapidKey.trim());
    return [
      {
        id: "operator-save-firebase",
        label: "operator.configuration.firebase.save",
        icon: "save",
        palette: "orange",
        layout: "action",
        disabled: this.configurationDisabled() || !draft?.firebase.projectId.trim(),
        progress: this.busyAction() === "register-firebase" ? { state: "loading", durationMs: 3e3 } : null,
        context: { action: "register-firebase" }
      },
      {
        id: "operator-activate-firebase",
        label: configuration?.firebase.active ? "operator.configuration.firebase.active" : "operator.configuration.firebase.activate",
        icon: configuration?.firebase.active ? "verified" : "published_with_changes",
        palette: "green",
        layout: "action",
        disabled: this.configurationDisabled() || Boolean(configuration?.firebase.active) || this.workspace.configurationFirebaseDirty() || !publicClientReady || !(configuration?.firebase.readyToActivate || locallyTested),
        progress: this.busyAction() === "activate-firebase" ? { state: "loading", durationMs: 3e3 } : null,
        context: { action: "activate-firebase" }
      }
    ];
  }, ...ngDevMode ? [{ debugName: "configurationFirebaseSaveActionItems" }] : (
    /* istanbul ignore next */
    []
  ));
  configurationFirebaseTestActionItems = computed(() => {
    const configuration = this.workspace.configuration();
    const authenticationFeedback = this.workspace.configurationAuthenticationFeedback();
    const messagingFeedback = this.workspace.configurationMessagingFeedback();
    return [
      {
        id: "operator-test-authentication",
        label: "operator.configuration.test.authentication.short",
        icon: authenticationFeedback === "success" ? "check_circle" : authenticationFeedback === "error" ? "error_outline" : "verified_user",
        palette: authenticationFeedback === "success" ? "green" : authenticationFeedback === "error" ? "red" : "blue",
        layout: "action",
        disabled: this.configurationDisabled() || this.workspace.configurationFirebaseDirty() || !configuration?.firebase.authenticationCredentialConfigured || authenticationFeedback !== null,
        progress: this.busyAction() === "test-authentication" ? { state: "loading", durationMs: 3e3 } : authenticationFeedback ? { state: authenticationFeedback, durationMs: 1e3 } : null,
        context: { action: "test-authentication" }
      },
      {
        id: "operator-test-messaging",
        label: "operator.configuration.test.messaging.short",
        icon: messagingFeedback === "success" ? "check_circle" : messagingFeedback === "error" ? "error_outline" : "notifications_active",
        palette: messagingFeedback === "success" ? "green" : messagingFeedback === "error" ? "red" : "orange",
        layout: "action",
        disabled: this.configurationDisabled() || this.workspace.configurationFirebaseDirty() || !configuration?.firebase.messagingCredentialConfigured || messagingFeedback !== null,
        progress: this.busyAction() === "test-messaging" ? { state: "loading", durationMs: 3e3 } : messagingFeedback ? { state: messagingFeedback, durationMs: 1e3 } : null,
        context: { action: "test-messaging" }
      }
    ];
  }, ...ngDevMode ? [{ debugName: "configurationFirebaseTestActionItems" }] : (
    /* istanbul ignore next */
    []
  ));
  loadedKind = null;
  configurationCredentialsActive = false;
  constructor() {
    this.configurationCredentialsActive = this.kind() === "configuration";
    this.destroyRef.onDestroy(() => {
      if (this.configurationCredentialsActive) {
        this.scrubConfigurationCredentialDrafts();
        this.configurationCredentialsActive = false;
      }
    });
    effect(() => {
      const configurationActive = this.kind() === "configuration";
      if (this.configurationCredentialsActive && !configurationActive) {
        this.scrubConfigurationCredentialDrafts();
      }
      this.configurationCredentialsActive = configurationActive;
    });
    effect(() => {
      const kind = this.kind();
      if (!kind || kind === "registration") {
        this.loadedKind = null;
        return;
      }
      if (kind === this.loadedKind) {
        return;
      }
      this.loadedKind = kind;
      if (kind === "claim") {
        this.claimPath.set("company");
      }
      this.workspace.clearFeedback();
      void this.load(kind);
    });
  }
  popupModel() {
    const kind = this.kind();
    const deploymentEntry = kind === "deployments" ? this.menu.selectedLeaderboardEntry() : null;
    const deploymentTitle = deploymentEntry ? this.i18n.translate(deploymentEntry.label) : this.i18n.translate("operator.leaderboard.deployments.title");
    const wide = kind === "claim" || kind === "configuration" || kind === "revenue" || kind === "community" || kind === "deployments";
    return {
      headerLabel: kind === "deployments" ? "operator.leaderboard.deployments.title" : null,
      headerLabelIcon: kind === "deployments" ? "hub" : null,
      title: kind === "deployments" ? deploymentTitle : this.titleKey(kind),
      subtitle: this.subtitleKey(kind),
      ariaLabel: kind === "deployments" ? [
        this.i18n.translate("operator.leaderboard.deployments.title"),
        deploymentTitle
      ].join(": ") : this.titleKey(kind),
      translateTitle: kind !== "deployments",
      closeAriaLabel: "operator.popup.close",
      size: wide ? "wide" : "small",
      height: wide ? "full" : "auto",
      mobilePresentation: wide ? "fullscreen" : "compact",
      headerTone: "accent",
      headerPalette: this.headerPalette(kind),
      bodyLayout: kind === "deployments" ? "fill" : "default",
      headerActions: kind === "claim" && this.canIssueClientCode() ? [{
        id: "operator-claim-client-code",
        icon: "key",
        label: "operator.claim.client.code",
        palette: "teal",
        disabled: this.busy()
      }] : [],
      onAction: (event) => {
        void this.onPopupHeaderAction(event);
      },
      onClose: () => this.close()
    };
  }
  async onAction(event) {
    const context = event.context;
    switch (context?.action) {
      case "refresh-update":
        await this.workspace.refreshDeploymentUpdate();
        return;
      case "apply-update":
        await this.workspace.applyDeploymentUpdate();
        return;
      case "claim-share":
        await this.workspace.claimShare();
        return;
      case "redeem-token":
        await this.workspace.linkOperatorGroup();
        return;
      case "set-claim-path":
        if (context.claimPath) {
          this.claimPath.set(context.claimPath);
          this.workspace.clearFeedback();
        }
        return;
      case "save-branding":
        await this.workspace.saveConfiguration("save-branding", "operator.configuration.branding.saved");
        return;
      case "save-admin-emails":
        await this.workspace.saveConfiguration("save-admin-emails", "operator.configuration.admin.saved");
        return;
      case "save-privacy-contact":
        await this.workspace.saveConfiguration("save-privacy-contact", "operator.configuration.privacy.contact.saved");
        return;
      case "add-social-link":
        this.workspace.addConfigurationSocialLink();
        return;
      case "remove-social-link":
        if (context.socialLinkIndex !== void 0) {
          this.workspace.removeConfigurationSocialLink(context.socialLinkIndex);
        }
        return;
      case "save-social-links":
        await this.workspace.saveConfiguration("save-social-links", "operator.configuration.social.saved");
        return;
      case "register-payment":
        await this.workspace.saveConfiguration("register-payment", `operator.configuration.payment.${this.paymentActionMode()}.completed`);
        return;
      case "register-firebase":
        await this.workspace.saveConfiguration("register-firebase", "operator.configuration.firebase.saved");
        return;
      case "activate-firebase":
        await this.workspace.activateFirebase();
        return;
      case "test-authentication":
        await this.workspace.testConfiguration("FIREBASE_AUTHENTICATION");
        return;
      case "test-messaging":
        await this.workspace.testConfiguration("FIREBASE_MESSAGING");
        return;
      case "toggle-tls-auto-renew": {
        const draft = this.workspace.tlsConfigurationDraft();
        if (draft?.enabled && draft.mode === "AUTOMATIC") {
          this.workspace.setTlsConfiguration({ autoRenew: !draft.autoRenew });
        }
        return;
      }
      case "set-tls-mode":
        if (context.tlsMode) {
          this.workspace.setTlsConfiguration({ mode: context.tlsMode });
        }
        return;
      case "test-tls-domain":
        await this.workspace.testTlsConfiguration("DOMAIN");
        return;
      case "test-tls-certificate":
        await this.workspace.testTlsConfiguration("CERTIFICATE");
        return;
      case "save-tls":
        await this.workspace.saveTlsConfiguration();
        return;
      case "synchronize-revenue":
        await this.workspace.synchronizeRevenue();
        return;
      case "requeue-revenue-report": {
        const reportId = context.reportId?.trim() ?? "";
        if (!reportId) {
          return;
        }
        this.requeueingReportId.set(reportId);
        try {
          const result = await this.workspace.requeueRevenueReport(reportId);
          if (result?.status === "PENDING") {
            this.revenueReportsSmartListRef()?.removeVisibleItemByIdentity(reportId, { totalDelta: -1 });
          }
        } finally {
          this.requeueingReportId.set(null);
        }
        return;
      }
      case "set-theme":
        if (context.themePreset) {
          this.workspace.setConfigurationBranding({
            themePreset: context.themePreset
          });
        }
        return;
      case "set-payment-provider":
        this.workspace.setConfigurationPayment({
          providerId: context.providerId ?? null,
          credential: ""
        });
        return;
      default:
        return;
    }
  }
  close() {
    if (this.configurationCredentialsActive) {
      this.scrubConfigurationCredentialDrafts();
      this.configurationCredentialsActive = false;
    }
    this.workspace.clearFeedback();
    this.menu.closePopup();
  }
  scrubConfigurationCredentialDrafts() {
    this.workspace.clearConfigurationCredentialDrafts();
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
  formatShare(value) {
    return new Intl.NumberFormat(this.i18n.currentLanguage(), {
      minimumFractionDigits: value > 0 && value < 1 ? 2 : 1,
      maximumFractionDigits: 2
    }).format(Math.max(0, value));
  }
  leaderboardDeploymentRow(deployment) {
    const locale = this.i18n.currentLanguage();
    const units = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0
    }).format(Math.max(0, deployment.verifiedWeight));
    const share = this.formatShare(deployment.sharePercent);
    const membershipLabel = this.i18n.translate(`operator.leaderboard.deployments.membership.${deployment.membershipState}`);
    const claimLabel = this.i18n.translate(`operator.leaderboard.deployments.claim.${deployment.claimState}`);
    const pendingReview = deployment.claimState === "pending-review";
    const rejectedReview = deployment.claimState === "rejected";
    const suspended = deployment.eligibilityStatus === "SUSPENDED";
    const inactive = deployment.eligibilityStatus === "INACTIVE";
    const eligibilityLabel = this.claimEligibilityLabel(deployment.eligibilityStatus);
    const shareLabel = [
      `${share}%`,
      this.i18n.translate("operator.leaderboard.share")
    ].join(" ");
    const shareBadge = {
      label: `${share}%`,
      icon: "pie_chart",
      ariaLabel: shareLabel,
      title: shareLabel,
      tone: deployment.sharePercent > 0 ? "accent" : "muted",
      position: "top-right"
    };
    const eligibilityBadge = {
      label: eligibilityLabel,
      icon: suspended ? "pause_circle" : "gpp_maybe",
      ariaLabel: eligibilityLabel,
      title: eligibilityLabel,
      tone: suspended ? "danger" : "muted",
      position: "top-right"
    };
    return {
      id: deployment.deploymentId,
      title: deployment.deploymentId,
      subtitle: membershipLabel,
      detail: [
        units,
        this.i18n.translate("operator.leaderboard.contribution.units")
      ].join(" "),
      metaRows: pendingReview || rejectedReview || suspended || inactive ? [] : [claimLabel],
      icon: deployment.membershipState === "owner" ? "verified_user" : "link",
      surfaceTone: rejectedReview ? "danger" : pendingReview ? "warning" : suspended ? "danger" : inactive ? "muted" : deployment.membershipState === "owner" ? "accent" : "success",
      toneClass: [
        "operator-leaderboard-deployment-row",
        `operator-leaderboard-deployment-row--${deployment.membershipState}`,
        pendingReview ? "operator-leaderboard-deployment-row--pending-review" : "",
        rejectedReview ? "operator-leaderboard-deployment-row--rejected" : "",
        suspended ? "operator-leaderboard-deployment-row--suspended" : "",
        inactive ? "operator-leaderboard-deployment-row--inactive" : ""
      ].filter(Boolean).join(" "),
      badges: rejectedReview ? [{
        label: claimLabel,
        icon: "block",
        ariaLabel: claimLabel,
        title: claimLabel,
        tone: "danger",
        position: "top-right"
      }] : pendingReview ? [{
        label: claimLabel,
        icon: "pending_actions",
        ariaLabel: claimLabel,
        title: claimLabel,
        tone: "warning",
        position: "top-right"
      }, shareBadge] : suspended ? [eligibilityBadge, shareBadge] : inactive ? [eligibilityBadge] : [shareBadge],
      eagerDetail: structuredClone(deployment)
    };
  }
  claimEligibilityLabel(status) {
    const key = status === "PARTIALLY_SUSPENDED" ? "operator.claim.eligibility.partially.suspended" : `operator.claim.eligibility.${status.toLowerCase()}`;
    return this.i18n.translate(key);
  }
  formatBytes(value) {
    const bytes = Math.max(0, Number(value) || 0);
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    const units = ["KB", "MB", "GB", "TB"];
    let size = bytes / 1024;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex += 1;
    }
    return `${new Intl.NumberFormat(this.i18n.currentLanguage(), {
      maximumFractionDigits: size < 10 ? 1 : 0
    }).format(size)} ${units[unitIndex]}`;
  }
  updatePhaseLabel(phase) {
    return `operator.update.phase.${phase.toLowerCase()}`;
  }
  revenueSyncStateLabel(state) {
    return `operator.revenue.delivery.state.${state.toLowerCase()}`;
  }
  revenueSyncStateIcon(state) {
    switch (state) {
      case "SYNCHRONIZED":
        return "check_circle";
      case "PENDING":
      case "BUSY":
        return "schedule";
      case "BLOCKED":
        return "report_problem";
      case "ERROR":
        return "error_outline";
      case "DORMANT":
      default:
        return "pause_circle";
    }
  }
  revenueReportActionItems(report) {
    const requeueing = this.requeueingReportId() === report.id;
    return [{
      id: `operator-requeue-revenue-report-${report.id}`,
      label: "operator.revenue.delivery.report.requeue",
      detail: "operator.revenue.delivery.report.requeue.detail",
      icon: "replay",
      palette: "orange",
      layout: "action",
      disabled: this.busy() || report.status !== "BLOCKED",
      progress: requeueing ? { state: "loading", durationMs: 3e3 } : null,
      context: {
        action: "requeue-revenue-report",
        reportId: report.id
      }
    }];
  }
  formatRevenueReportPeriod(value) {
    const source = `${value ?? ""}`.trim();
    const timestamp = Date.parse(/^\d{4}-\d{2}-\d{2}$/.test(source) ? `${source}T00:00:00.000Z` : source);
    if (!Number.isFinite(timestamp)) {
      return source || "\u2014";
    }
    return new Intl.DateTimeFormat(this.i18n.currentLanguage(), {
      dateStyle: "medium",
      timeZone: "UTC"
    }).format(new Date(timestamp));
  }
  revenueReportCurrencies(report) {
    return [...new Set(report.currencies.map((currency) => currency.currencyCode.trim().toUpperCase()).filter(Boolean))].join(", ") || "\u2014";
  }
  formatSettlementPeriod(value) {
    const source = `${value ?? ""}`.trim();
    const timestamp = Date.parse(`${source}-01T00:00:00.000Z`);
    if (!/^\d{4}-\d{2}$/.test(source) || !Number.isFinite(timestamp)) {
      return source || "\u2014";
    }
    return new Intl.DateTimeFormat(this.i18n.currentLanguage(), {
      month: "long",
      year: "numeric",
      timeZone: "UTC"
    }).format(new Date(timestamp));
  }
  formatSettlementMinor(minor, settlement) {
    const fractionDigits = Math.max(0, Math.min(6, Math.trunc(settlement.fractionDigits)));
    return new Intl.NumberFormat(this.i18n.currentLanguage(), {
      style: "currency",
      currency: settlement.currencyCode,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits
    }).format(minor / 10 ** fractionDigits);
  }
  formatSettlementBasisPoints(basisPoints, signed = false) {
    return new Intl.NumberFormat(this.i18n.currentLanguage(), {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      signDisplay: signed ? "exceptZero" : "auto"
    }).format(basisPoints / 1e4);
  }
  formatSettlementMultiplier(basisPoints) {
    return `${new Intl.NumberFormat(this.i18n.currentLanguage(), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(basisPoints / 1e4)}\xD7`;
  }
  formatSettlementShare(settlement) {
    let ratio;
    try {
      const numerator = BigInt(settlement.shareNumerator);
      const denominator = BigInt(settlement.shareDenominator);
      if (numerator < 0n || denominator <= 0n) {
        return "\u2014";
      }
      const fixedPoint = numerator * 1000000n / denominator;
      ratio = Number(fixedPoint) / 1e6;
    } catch {
      return "\u2014";
    }
    return new Intl.NumberFormat(this.i18n.currentLanguage(), {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(ratio);
  }
  settlementTrend(settlement) {
    if (settlement.accelerationBasisPoints > 0) {
      return "positive";
    }
    if (settlement.accelerationBasisPoints < 0) {
      return "negative";
    }
    return "stable";
  }
  configurationThemeTrigger() {
    const themePreset = this.workspace.configurationDraft()?.branding.themePreset ?? "VIOLET";
    return {
      label: `operator.configuration.branding.theme.${themePreset.toLowerCase()}`,
      icon: "palette",
      palette: this.themePalette(themePreset),
      layout: "field",
      disabled: this.configurationDisabled(),
      ariaLabel: "operator.configuration.branding.theme"
    };
  }
  configurationPaymentProviderTrigger() {
    const configuration = this.workspace.configuration();
    const selected = this.workspace.configurationDraft()?.payment.providerId ?? null;
    const provider = configuration?.payment.availableProviders.find((item) => item.id === selected);
    return {
      label: provider?.label ?? "operator.configuration.payment.provider.none",
      icon: provider ? provider.logoUrl ? void 0 : "payments" : "money_off",
      imageUrl: provider?.logoUrl,
      imageAlt: provider?.logoAlt,
      palette: provider?.palette ?? (provider ? void 0 : "slate"),
      layout: "field",
      disabled: this.configurationDisabled(),
      ariaLabel: "operator.configuration.payment.provider"
    };
  }
  configurationTlsModeTrigger() {
    const mode = this.workspace.tlsConfigurationDraft()?.mode ?? "AUTOMATIC";
    return {
      label: `operator.configuration.tls.mode.${mode.toLowerCase()}`,
      icon: mode === "AUTOMATIC" ? "workspace_premium" : "key",
      palette: mode === "AUTOMATIC" ? "green" : "amber",
      layout: "field",
      disabled: this.configurationTlsDisabled(),
      ariaLabel: "operator.configuration.tls.mode"
    };
  }
  configurationTlsDisabled() {
    return this.busy() || this.workspace.tlsConfiguration()?.capability !== "AVAILABLE";
  }
  toggleTlsEnabled(event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.configurationTlsDisabled()) {
      return;
    }
    this.workspace.setTlsConfiguration({
      enabled: !this.workspace.tlsConfigurationDraft()?.enabled
    });
  }
  showTlsSaveAction() {
    const configuration = this.workspace.tlsConfiguration();
    const draft = this.workspace.tlsConfigurationDraft();
    return draft?.enabled === true || Boolean(configuration?.enabled && draft && !draft.enabled);
  }
  configurationDisabled() {
    return this.busy() || this.workspace.configuration()?.capability !== "AVAILABLE";
  }
  onBrandingLogoChange(imageUrls) {
    this.workspace.setConfigurationBranding({
      logoUrl: imageUrls[0] ?? ""
    });
  }
  onBrandingLogoCharacterIndexChange(value) {
    if (value === null || `${value}`.trim() === "") {
      this.workspace.setConfigurationBranding({ logoCharacterIndex: 0 });
      return;
    }
    this.workspace.setConfigurationBranding({
      logoCharacterIndex: Number(value)
    });
  }
  onConfigurationAdminEmailsChange(value) {
    if (!value || typeof value !== "object") {
      this.workspace.setConfigurationAdminEmailsInput("");
      return;
    }
    const adminEmailsText = value.adminEmailsText;
    this.workspace.setConfigurationAdminEmailsInput(`${adminEmailsText ?? ""}`);
  }
  onConfigurationPrivacyContactChange(value) {
    if (!value || typeof value !== "object") {
      this.workspace.setConfigurationPrivacyContact({
        dataControllerName: "",
        privacyContactEmail: ""
      });
      return;
    }
    const source = value;
    this.workspace.setConfigurationPrivacyContact({
      dataControllerName: `${source.dataControllerName ?? ""}`,
      privacyContactEmail: `${source.privacyContactEmail ?? ""}`
    });
  }
  socialLinkUrlConfig() {
    return {
      label: this.i18n.translate("operator.configuration.social.url"),
      placeholder: "https://",
      required: true,
      maxLength: 2048,
      panelMode: "anchored",
      pasteAriaLabel: this.i18n.translate("operator.configuration.social.url.paste.aria"),
      openAriaLabel: this.i18n.translate("operator.configuration.social.url.open.aria"),
      deleteAriaLabel: this.i18n.translate("operator.configuration.social.url.clear.aria")
    };
  }
  configurationPaymentPublicBaseUrlConfig() {
    return {
      label: this.i18n.translate("operator.configuration.payment.public.url"),
      placeholder: this.i18n.translate("operator.configuration.payment.public.url.placeholder"),
      required: true,
      maxLength: 2048,
      panelMode: "anchored",
      pasteAriaLabel: this.i18n.translate("operator.configuration.payment.public.url.paste.aria"),
      openAriaLabel: this.i18n.translate("operator.configuration.payment.public.url.open.aria"),
      deleteAriaLabel: this.i18n.translate("operator.configuration.payment.public.url.clear.aria")
    };
  }
  configurationPaymentIsBarion() {
    return this.workspace.configurationDraft()?.payment.providerId?.trim().toLowerCase() === "barion";
  }
  setConfigurationSocialLink(index, patch) {
    this.workspace.setConfigurationSocialLink(index, patch);
  }
  configurationSocialLinkRemoveItems(index) {
    return [{
      id: `operator-remove-social-link-${index}`,
      label: "operator.configuration.social.remove",
      icon: "delete_outline",
      palette: "red",
      layout: "action",
      disabled: this.configurationDisabled(),
      context: {
        action: "remove-social-link",
        socialLinkIndex: index
      }
    }];
  }
  brandingLogoCharacterIndexInvalid() {
    const branding = this.workspace.configurationDraft()?.branding;
    if (!branding || branding.logoCharacterIndex === null) {
      return false;
    }
    const index = branding.logoCharacterIndex;
    return !Number.isInteger(index) || index < -1 || index >= Array.from(branding.productName.trim()).length;
  }
  onClaimDraftChange(value) {
    this.workspace.setClaimDraft(value);
  }
  onClaimClientCodeChange(value) {
    if (!value || typeof value !== "object") {
      this.workspace.setGroupTokenInput("");
      return;
    }
    const clientToken = value.clientToken;
    this.workspace.setGroupTokenInput(`${clientToken ?? ""}`);
  }
  safeExternalUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" && !url.username && !url.password ? url.toString() : null;
    } catch {
      return null;
    }
  }
  validClaimEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }
  validClaimWebsite(value) {
    try {
      const url = new URL(value.trim());
      return (url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password;
    } catch {
      return false;
    }
  }
  busyLabel() {
    switch (this.busyAction()) {
      case "issue-grouping-token":
        return "operator.claim.client.code.issuing";
      case "claim-share":
        return "operator.claim.applying";
      case "link-operator-group":
        return "operator.claim.client.code.redeeming";
      case "apply-update":
        return "operator.update.applying";
      case "synchronize-revenue":
        return "operator.revenue.delivery.synchronizing";
      case "requeue-revenue-report":
        return "operator.revenue.delivery.report.requeue.progress";
      case "test-authentication":
      case "test-messaging":
      case "test-tls-domain":
      case "test-tls-certificate":
        return "operator.configuration.testing";
      case "save-branding":
      case "save-admin-emails":
      case "save-privacy-contact":
      case "save-social-links":
      case "register-payment":
      case "register-firebase":
      case "activate-firebase":
      case "save-tls":
        return "operator.configuration.saving";
      case "set-community":
        return "operator.community.updating";
      default:
        return "operator.loading";
    }
  }
  registeredForClaim() {
    const status = this.registry.status();
    return Boolean(status?.enabled && status.lifecycle === "REGISTERED");
  }
  canIssueClientCode() {
    const claim = this.workspace.claimStatus();
    return this.registeredForClaim() && Boolean(claim?.claimed && claim.operatorGroupId?.trim()) && claim?.eligibilityStatus === "ACTIVE" && (claim?.verificationStatus === "APPROVED" || claim?.verificationStatus === "VERIFIED");
  }
  async onPopupHeaderAction(event) {
    if (event.action.id !== "operator-claim-client-code" || !this.canIssueClientCode()) {
      return;
    }
    const token = await this.workspace.issueGroupingToken();
    if (!token?.clientToken.trim()) {
      return;
    }
    const clientToken = token.clientToken.trim();
    this.dialog.open({
      title: this.i18n.translate("operator.claim.client.code.dialog.title"),
      message: clientToken,
      warningMessage: [
        this.i18n.translate("operator.group.expires"),
        this.formatDate(token.expiresAt)
      ].join(": "),
      confirmLabel: this.i18n.translate("operator.claim.client.code.copy"),
      cancelLabel: this.i18n.translate("close"),
      busyConfirmLabel: this.i18n.translate("operator.claim.client.code.copying"),
      confirmTone: "accent",
      confirmPalette: "teal",
      failureMessage: this.i18n.translate("operator.claim.client.code.copy.unavailable"),
      onConfirm: async () => {
        const clipboard = globalThis.navigator?.clipboard;
        if (!clipboard?.writeText) {
          throw new Error(this.i18n.translate("operator.claim.client.code.copy.unavailable"));
        }
        await clipboard.writeText(clientToken);
      }
    });
  }
  async load(kind) {
    switch (kind) {
      case "updates":
        return;
      case "claim":
        await this.workspace.loadClaimStatus(true);
        return;
      case "configuration":
        await this.workspace.loadConfiguration();
        return;
      case "revenue":
        await this.workspace.loadRevenue();
        return;
      case "community":
        await this.workspace.loadCommunityStatus();
        return;
      case "deployments":
        return;
    }
  }
  buildActionItems(kind) {
    switch (kind) {
      case "updates": {
        const update = this.workspace.deploymentUpdate();
        return [
          {
            id: "operator-refresh-update",
            label: "operator.update.refresh",
            icon: "refresh",
            palette: "blue",
            layout: "action",
            disabled: this.busy(),
            progress: this.busyAction() === "load-update" ? { state: "loading", durationMs: 3e3 } : null,
            context: { action: "refresh-update" }
          },
          {
            id: "operator-apply-update",
            label: update?.updateAvailable ? "operator.update.apply" : "operator.update.current",
            icon: update?.updateAvailable ? "system_update_alt" : "check_circle",
            palette: "teal",
            layout: "action",
            disabled: this.busy() || !update?.updateAvailable,
            progress: this.busyAction() === "apply-update" ? { state: "loading", durationMs: 3e3 } : null,
            context: { action: "apply-update" }
          }
        ];
      }
      case "claim": {
        const claim = this.workspace.claimStatus();
        if (!claim) {
          return [];
        }
        if (this.claimPath() === "company") {
          if (claim.verificationStatus === "REJECTED") {
            return [{
              id: "operator-claim-rejected",
              label: "operator.claim.verification.rejected.action",
              icon: "block",
              palette: "red",
              layout: "action",
              disabled: true,
              context: { action: "claim-share" }
            }];
          }
          if (claim.verificationStatus === "PENDING_REVIEW") {
            return [{
              id: "operator-claim-pending-review",
              label: "operator.claim.verification.pending.action",
              icon: "pending_actions",
              palette: "orange",
              layout: "action",
              disabled: true,
              context: { action: "claim-share" }
            }];
          }
          if (claim.claimed) {
            return [];
          }
          return [{
            id: "operator-claim-share",
            label: "operator.claim.apply",
            icon: "verified",
            palette: "purple",
            layout: "action",
            disabled: this.busy() || !this.registeredForClaim() || !this.workspace.claimCompanyReady(),
            progress: this.busyAction() === "claim-share" ? { state: "loading", durationMs: 3e3 } : null,
            context: { action: "claim-share" }
          }];
        }
        return [{
          id: "operator-redeem-token",
          label: "operator.claim.apply",
          icon: "verified",
          palette: "purple",
          layout: "action",
          disabled: this.busy() || !this.registeredForClaim() || !this.workspace.claimClientCodeReady(),
          progress: this.busyAction() === "link-operator-group" ? { state: "loading", durationMs: 3e3 } : null,
          context: { action: "redeem-token" }
        }];
      }
      case "revenue": {
        const sync = this.workspace.revenueSync();
        return [{
          id: "operator-synchronize-revenue",
          label: "operator.revenue.delivery.synchronize",
          detail: sync ? this.revenueSyncStateLabel(sync.state) : "operator.revenue.delivery.synchronize.detail",
          icon: sync ? this.revenueSyncStateIcon(sync.state) : "sync",
          palette: this.revenueSyncPalette(sync?.state),
          layout: "action",
          disabled: this.busy(),
          progress: this.busyAction() === "synchronize-revenue" ? { state: "loading", durationMs: 3e3 } : null,
          context: { action: "synchronize-revenue" }
        }];
      }
      case "configuration":
      case "community":
      default:
        return [];
    }
  }
  paymentActionMode() {
    const configuration = this.workspace.configuration();
    const selectedProvider = this.workspace.configurationDraft()?.payment.providerId ?? null;
    const registeredProvider = configuration?.payment.providerId ?? null;
    if (!selectedProvider && registeredProvider) {
      return "remove";
    }
    if (selectedProvider && selectedProvider === registeredProvider && configuration?.payment.credentialConfigured) {
      return "update";
    }
    return "register";
  }
  revenueSyncPalette(state) {
    switch (state) {
      case "SYNCHRONIZED":
        return "green";
      case "PENDING":
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
  titleKey(kind) {
    switch (kind) {
      case "updates":
        return "operator.action.updates";
      case "claim":
        return "operator.action.claim.share";
      case "configuration":
        return "operator.action.configuration";
      case "revenue":
        return "operator.action.revenue";
      case "community":
        return "operator.community";
      case "deployments":
        return "operator.leaderboard.deployments.title";
      default:
        return "operator";
    }
  }
  subtitleKey(kind) {
    switch (kind) {
      case "updates":
        return "operator.update.subtitle";
      case "claim":
        return "operator.claim.subtitle";
      case "configuration":
        return "operator.configuration.subtitle";
      case "revenue":
        return "operator.revenue.subtitle";
      case "community":
        return "operator.community.subtitle";
      case "deployments":
        return "operator.leaderboard.deployments.subtitle";
      default:
        return "";
    }
  }
  headerPalette(kind) {
    switch (kind) {
      case "updates":
        return "teal";
      case "claim":
        return "violet";
      case "configuration":
        return "blue";
      case "revenue":
        return "green";
      case "deployments":
        return "teal";
      case "community":
      default:
        return "slate";
    }
  }
  themePalette(themePreset) {
    switch (themePreset) {
      case "OCEAN":
        return "blue";
      case "FOREST":
        return "green";
      case "SUNSET":
        return "orange";
      case "VIOLET":
        return "violet";
      case "ROSE":
        return "rose";
      case "AMBER":
        return "amber";
      case "SLATE":
      case "MONOCHROME":
        return "slate";
      case "AQUARIUS":
        return "teal";
      case "AURORA":
      default:
        return "violet";
    }
  }
  static \u0275fac = function OperatorActionPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OperatorActionPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _OperatorActionPopupComponent, selectors: [["app-operator-action-popup"]], viewQuery: function OperatorActionPopupComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.revenueReportsSmartList = _t.first);
    }
  }, decls: 1, vars: 1, consts: [["revenueReportsSmartList", ""], ["revenueReportTemplate", ""], ["settlementTemplate", ""], ["leaderboardDeploymentTemplate", ""], [3, "model"], [1, "operator-action-popup"], ["role", "status", 1, "operator-action-popup__loading"], ["kind", "load-ring", "state", "loading"], ["kind", "inline", "layout", "row", 1, "operator-action-popup__actions", 3, "items"], [1, "operator-action-popup__summary"], [1, "operator-action-popup__hint"], ["role", "status", 1, "operator-action-popup__update-progress"], [1, "operator-action-popup__update-progress-header"], ["max", "100", 3, "value"], ["kind", "inline", "layout", "row", 1, "operator-action-popup__claim-paths", 3, "itemSelect", "items"], ["role", "alert", 1, "operator-action-popup__result", "is-error"], [1, "operator-action-popup__claim-review"], ["role", "status", 1, "operator-action-popup__result", "is-pending"], [1, "operator-action-popup__result-copy"], [1, "operator-action-popup__claim-share"], ["role", "status", 1, "operator-action-popup__result", "is-error"], ["role", "status", 1, "operator-action-popup__result", "is-success"], [3, "ngModelChange", "model", "ngModel", "disabled"], ["data-palette", "violet", 1, "operator-action-popup__configuration-group"], [1, "operator-action-popup__branding-editor"], [1, "operator-action-popup__logo-field"], ["mediaFit", "contain", "imagePosition", "center", "uploadEntityId", "deployment-branding-logo", 3, "ngModelChange", "slotCount", "compact", "autoSize", "ngModel", "disabled", "uploadOwnerId", "ariaLabel"], [1, "operator-action-popup__media-guidance"], [1, "operator-action-popup__branding-identity"], [1, "operator-action-popup__field"], ["type", "text", "maxlength", "80", "autocomplete", "organization", 3, "ngModelChange", "ngModel", "disabled"], ["type", "number", "min", "-1", "step", "1", 3, "ngModelChange", "ngModel", "disabled"], [1, "operator-action-popup__select-field", "operator-action-popup__branding-theme"], ["kind", "select", 3, "itemSelect", "trigger", "items"], ["kind", "inline", "layout", "row", "panelMode", "anchored", 1, "operator-action-popup__section-actions", "operator-action-popup__branding-actions", "operator-action-popup__single-action-menu", 3, "itemSelect", "items"], ["data-palette", "blue", 1, "operator-action-popup__configuration-group"], ["kind", "inline", "layout", "row", "panelMode", "anchored", 1, "operator-action-popup__section-actions", "operator-action-popup__single-action-menu", 3, "itemSelect", "items"], ["data-palette", "amber", 1, "operator-action-popup__configuration-group"], ["data-palette", "mint", 1, "operator-action-popup__configuration-group"], [1, "operator-action-popup__social-links"], [1, "operator-action-popup__social-link"], [1, "operator-action-popup__empty"], ["kind", "inline", "layout", "row", 1, "operator-action-popup__section-actions", "operator-action-popup__section-actions--social", 3, "itemSelect", "items"], ["data-palette", "teal", 1, "operator-action-popup__configuration-group"], [1, "operator-action-popup__select-field"], [1, "operator-action-popup__payment-routing", 3, "is-barion"], ["type", "password", "autocomplete", "new-password", 3, "ngModelChange", "placeholder", "ngModel", "disabled"], ["kind", "inline", "layout", "row", 1, "operator-action-popup__header-actions", 3, "itemSelect", "items"], ["role", "status", "aria-live", "polite", 1, "operator-action-popup__sr-only"], [1, "operator-action-popup__firebase-public-grid"], ["type", "text", "maxlength", "160", "autocomplete", "off", 3, "ngModelChange", "ngModel", "disabled"], ["type", "text", "maxlength", "253", "autocomplete", "off", "autocapitalize", "off", "spellcheck", "false", "placeholder", "project-id.firebaseapp.com", 3, "ngModelChange", "ngModel", "disabled"], ["type", "text", "maxlength", "512", "autocomplete", "off", "autocapitalize", "off", "spellcheck", "false", 3, "ngModelChange", "ngModel", "disabled"], ["type", "text", "maxlength", "64", "autocomplete", "off", "inputmode", "numeric", 3, "ngModelChange", "ngModel", "disabled"], ["type", "text", "maxlength", "256", "autocomplete", "off", "autocapitalize", "off", "spellcheck", "false", 3, "ngModelChange", "ngModel", "disabled"], ["type", "text", "maxlength", "64", "autocomplete", "off", "autocapitalize", "off", "spellcheck", "false", 3, "ngModelChange", "ngModel", "disabled"], ["rows", "2", "maxlength", "512", "autocomplete", "off", "autocapitalize", "off", "spellcheck", "false", 3, "ngModelChange", "ngModel", "disabled"], ["rows", "3", "autocomplete", "new-password", 3, "ngModelChange", "placeholder", "ngModel", "disabled"], ["rows", "2", "maxlength", "4096", "autocomplete", "off", "autocapitalize", "off", "spellcheck", "false", 3, "ngModelChange", "placeholder", "ngModel", "disabled"], ["kind", "inline", "layout", "row", 1, "operator-action-popup__section-actions", 3, "itemSelect", "items"], [1, "operator-action-popup__tls-header"], [1, "operator-action-popup__tls-title"], [1, "operator-action-popup__tls-toggle-wrap"], ["type", "button", 1, "operator-action-popup__on-off-toggle", 3, "click", "disabled"], ["kind", "inline", "layout", "row", 1, "operator-action-popup__header-actions", "operator-action-popup__tls-test-actions", 3, "items"], ["kind", "inline", "layout", "row", "panelMode", "anchored", 1, "operator-action-popup__section-actions", "operator-action-popup__single-action-menu", 3, "items"], ["kind", "inline", "layout", "row", 1, "operator-action-popup__header-actions", "operator-action-popup__tls-test-actions", 3, "itemSelect", "items"], [1, "operator-action-popup__tls-grid"], ["type", "text", "maxlength", "253", "autocomplete", "url", "autocapitalize", "off", "spellcheck", "false", "placeholder", "app.example.com", 3, "ngModelChange", "ngModel", "disabled"], [1, "operator-action-popup__tls-source-controls"], ["kind", "inline", "layout", "row", 1, "operator-action-popup__tls-renewal-toggle", 3, "items"], [1, "operator-action-popup__field", "is-wide"], ["kind", "inline", "layout", "row", 1, "operator-action-popup__tls-renewal-toggle", 3, "itemSelect", "items"], ["type", "email", "maxlength", "254", "autocomplete", "email", 3, "ngModelChange", "ngModel", "disabled"], ["rows", "5", "maxlength", "131072", "autocomplete", "off", "spellcheck", "false", 3, "ngModelChange", "placeholder", "ngModel", "disabled"], ["rows", "5", "maxlength", "131072", "autocomplete", "new-password", "spellcheck", "false", 3, "ngModelChange", "placeholder", "ngModel", "disabled"], [1, "operator-action-popup__social-link-fields"], ["type", "text", "maxlength", "32", "autocomplete", "off", 3, "ngModelChange", "ngModel", "disabled"], ["type", "text", "maxlength", "80", "autocomplete", "off", 3, "ngModelChange", "ngModel", "disabled"], ["type", "text", "maxlength", "64", "autocomplete", "off", 3, "ngModelChange", "placeholder", "ngModel", "disabled"], ["type", "text", "maxlength", "80", "autocomplete", "off", 3, "ngModelChange", "placeholder", "ngModel", "disabled"], [3, "ngModelChange", "config", "ngModel", "disabled"], ["kind", "inline", "layout", "row", "panelMode", "anchored", 1, "operator-action-popup__single-action-menu", 3, "itemSelect", "items"], [1, "operator-action-popup__payment-routing"], ["type", "email", "maxlength", "254", "autocomplete", "email", 3, "ngModelChange", "placeholder", "ngModel", "disabled"], [1, "operator-action-popup__settlements"], [1, "operator-action-popup__settlements-header"], [1, "operator-action-popup__settlements-icon"], ["role", "status", 1, "operator-action-popup__settlements-unavailable"], [3, "revenue"], [1, "operator-action-popup__revenue-delivery"], [1, "operator-action-popup__revenue-reports"], [3, "config", "loadPage", "query", "itemTemplate"], [1, "operator-action-popup__revenue-report"], [1, "operator-action-popup__revenue-report-icon"], [1, "operator-action-popup__revenue-report-code"], ["kind", "inline", "layout", "row", 3, "itemSelect", "items"], [1, "operator-action-popup__settlement"], [1, "operator-action-popup__settlement-period"], [1, "operator-action-popup__settlement-currency"], [1, "operator-action-popup__settlement-revision"], [1, "operator-action-popup__settlement-month"], [1, "operator-action-popup__settlement-valuation"], [1, "operator-action-popup__settlement-trend"], [1, "operator-action-popup__deployments"], [1, "operator-action-popup__deployment-summary"], [1, "operator-action-popup__deployment-summary-icon"], [1, "operator-action-popup__deployment-eligibility"], [1, "operator-action-popup__deployment-list", 3, "config", "loadPage", "query", "itemTemplate"], [3, "row"], [1, "operator-action-popup__community"], [1, "operator-action-popup__presence"], [1, "operator-action-popup__providers"], [1, "operator-action-popup__announcements"], [1, "operator-action-popup__provider"], [1, "operator-action-popup__provider-icon"], [1, "operator-action-popup__provider-copy"], ["target", "_blank", "rel", "noopener noreferrer", 1, "operator-action-popup__provider-link", 3, "href"], [1, "operator-action-popup__announcement"], [1, "operator-action-popup__announcement-badges"], [1, "operator-action-popup__announcement-date"], [1, "operator-action-popup__announcement-details"], [1, "operator-action-popup__announcement-detail-body"], [1, "operator-action-popup__announcement-links"], [1, "operator-action-popup__release"], ["target", "_blank", "rel", "noopener noreferrer", 3, "href"], [1, "operator-action-popup__signature-state"], [1, "operator-action-popup__download"], [1, "operator-action-popup__download-unverified"], ["kind", "inline", "layout", "row", 1, "operator-action-popup__actions", 3, "itemSelect", "items"]], template: function OperatorActionPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, OperatorActionPopupComponent_Conditional_0_Template, 1, 1);
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275conditional((tmp_0_0 = ctx.kind()) ? 0 : -1, tmp_0_0);
    }
  }, dependencies: [
    AppMenuComponent,
    FormFlowComponent,
    FormsModule,
    DefaultValueAccessor,
    NumberValueAccessor,
    NgControlStatus,
    MaxLengthValidator,
    MinValidator,
    NgModel,
    ImageCarouselComponent,
    IndicatorComponent,
    LinkInputComponent,
    MatIconModule,
    MatIcon,
    OperatorRevenueViewComponent,
    PopupComponent,
    SingleRowComponent,
    SmartListComponent,
    I18nPipe
  ], styles: ['\n[_nghost-%COMP%] {\n  display: contents;\n}\n.operator-action-popup[_ngcontent-%COMP%] {\n  position: relative;\n  min-height: 150px;\n  display: grid;\n  gap: 0.85rem;\n  color: #243853;\n}\n.operator-action-popup--loading[_ngcontent-%COMP%] {\n  min-height: 100%;\n  flex: 1 1 auto;\n}\n.operator-action-popup--deployments[_ngcontent-%COMP%] {\n  height: 100%;\n  min-height: 0;\n  grid-template-rows: minmax(0, 1fr);\n}\n.operator-action-popup__loading[_ngcontent-%COMP%] {\n  min-height: 180px;\n  display: grid;\n  place-items: center;\n  align-content: center;\n  gap: 0.55rem;\n  color: rgba(36, 56, 83, 0.7);\n  font-size: 0.78rem;\n  font-weight: 900;\n  text-align: center;\n}\n.operator-action-popup--loading[_ngcontent-%COMP%]   .operator-action-popup__loading[_ngcontent-%COMP%] {\n  min-height: 100%;\n}\n.operator-action-popup__summary[_ngcontent-%COMP%] {\n  padding: 0.75rem;\n  border-radius: 14px;\n  background: #f1f8f7;\n  display: grid;\n  grid-template-columns: auto 1fr 1fr;\n  align-items: center;\n  gap: 0.7rem;\n}\n.operator-action-popup__summary[_ngcontent-%COMP%]    > .mat-icon[_ngcontent-%COMP%] {\n  color: #168071;\n}\n.operator-action-popup__summary[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.08rem;\n}\n.operator-action-popup__summary[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: rgba(36, 56, 83, 0.58);\n  font-size: 0.66rem;\n  font-weight: 800;\n}\n.operator-action-popup__summary[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.86rem;\n}\n.operator-action-popup__hint[_ngcontent-%COMP%] {\n  margin: 0;\n  color: rgba(36, 56, 83, 0.72);\n  font-size: 0.76rem;\n  font-weight: 700;\n  line-height: 1.45;\n}\n.operator-action-popup__configuration-group[_ngcontent-%COMP%] {\n  --operator-configuration-accent: #396da9;\n  --operator-configuration-border: rgba(58, 108, 168, 0.28);\n  --operator-configuration-surface:\n    linear-gradient(\n      180deg,\n      #f2f7ff 0%,\n      #e8f0fb 100%);\n  --operator-configuration-label-size: 0.84rem;\n  --form-flow-label-font-size: var(--operator-configuration-label-size);\n  --link-input-label-font-size: var(--operator-configuration-label-size);\n  min-width: 0;\n  padding: 0.68rem;\n  border: 1px solid var(--operator-configuration-border);\n  border-radius: 12px;\n  background: var(--operator-configuration-surface);\n  display: grid;\n  gap: 0.58rem;\n}\n.operator-action-popup__configuration-group[data-palette=violet][_ngcontent-%COMP%] {\n  --operator-configuration-accent: #6743a4;\n  --operator-configuration-border: rgba(128, 83, 209, 0.3);\n  --operator-configuration-surface:\n    linear-gradient(\n      \n      180deg,\n      rgba(249, 246, 255, 0.96) 0%,\n      rgba(239, 232, 255, 0.98) 100% );\n}\n.operator-action-popup__configuration-group[data-palette=teal][_ngcontent-%COMP%] {\n  --operator-configuration-accent: #14717d;\n  --operator-configuration-border: rgba(40, 148, 164, 0.3);\n  --operator-configuration-surface:\n    linear-gradient(\n      \n      180deg,\n      rgba(237, 251, 253, 0.96) 0%,\n      rgba(218, 246, 249, 0.98) 100% );\n}\n.operator-action-popup__configuration-group[data-palette=blue][_ngcontent-%COMP%] {\n  --operator-configuration-accent: #396da9;\n  --operator-configuration-border: rgba(58, 108, 168, 0.28);\n  --operator-configuration-surface:\n    linear-gradient(\n      180deg,\n      #f2f7ff 0%,\n      #e8f0fb 100%);\n}\n.operator-action-popup__configuration-group[data-palette=amber][_ngcontent-%COMP%] {\n  --operator-configuration-accent: #966015;\n  --operator-configuration-border: rgba(194, 126, 30, 0.3);\n  --operator-configuration-surface:\n    linear-gradient(\n      \n      180deg,\n      rgba(255, 250, 237, 0.98) 0%,\n      rgba(255, 240, 207, 0.98) 100% );\n}\n.operator-action-popup__configuration-group[data-palette=mint][_ngcontent-%COMP%] {\n  --operator-configuration-accent: #1a765d;\n  --operator-configuration-border: rgba(36, 147, 114, 0.3);\n  --operator-configuration-surface:\n    linear-gradient(\n      \n      180deg,\n      rgba(239, 252, 247, 0.98) 0%,\n      rgba(220, 247, 237, 0.98) 100% );\n}\n.operator-action-popup__configuration-group[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n}\n.operator-action-popup__configuration-group[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.04rem;\n}\n.operator-action-popup__configuration-group[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:first-child {\n  margin-right: auto;\n}\n.operator-action-popup__field[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%], \n.operator-action-popup__select-field[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%], \n.operator-action-popup__logo-field[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  color: rgba(36, 56, 83, 0.82);\n  font-size: var(--operator-configuration-label-size);\n  font-weight: 850;\n  line-height: 1;\n}\n.operator-action-popup__configuration-group[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: color-mix(in srgb, var(--operator-configuration-accent), #243853 25%);\n  font-size: 0.64rem;\n  font-weight: 850;\n}\n.operator-action-popup__configuration-group[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--operator-configuration-accent);\n  font-size: 0.82rem;\n}\n.operator-action-popup__configuration-group[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 19px;\n  height: 19px;\n  color: var(--operator-configuration-accent);\n  font-size: 19px;\n}\n.operator-action-popup__branding-editor[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.58rem;\n}\n.operator-action-popup__branding-editor[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(260px, 360px) minmax(0, 1fr);\n  grid-template-rows: auto auto minmax(40px, 1fr);\n  align-items: start;\n}\n.operator-action-popup__branding-identity[_ngcontent-%COMP%] {\n  grid-column: 2;\n  grid-row: 1;\n  min-width: 0;\n  display: grid;\n  grid-template-columns: minmax(0, 1.65fr) minmax(140px, 0.85fr);\n  gap: 0.58rem;\n}\n.operator-action-popup__branding-theme[_ngcontent-%COMP%] {\n  grid-column: 2;\n  grid-row: 2;\n}\n.operator-action-popup__branding-actions[_ngcontent-%COMP%] {\n  grid-column: 2;\n  grid-row: 3;\n  align-self: end;\n}\n.operator-action-popup__field[_ngcontent-%COMP%], \n.operator-action-popup__select-field[_ngcontent-%COMP%], \n.operator-action-popup__logo-field[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.2rem;\n}\n.operator-action-popup__field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.operator-action-popup__field[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  width: 100%;\n  min-height: 38px;\n  border: 1px solid rgba(62, 83, 119, 0.22);\n  border-radius: 9px;\n  padding: 0.55rem 0.58rem;\n  background: #fff;\n  color: #243853;\n  font: inherit;\n  font-size: 0.72rem;\n  line-height: 1.4;\n  resize: vertical;\n}\n.operator-action-popup__field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:disabled, \n.operator-action-popup__field[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:disabled {\n  background: #f0f3f7;\n  color: rgba(36, 56, 83, 0.58);\n}\n.operator-action-popup__field[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: baseline;\n  justify-content: space-between;\n  gap: 0.4rem;\n}\n.operator-action-popup__field[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 0.58rem;\n  font-weight: 750;\n}\n.operator-action-popup__field[_ngcontent-%COMP%]    > small[_ngcontent-%COMP%] {\n  color: rgba(36, 56, 83, 0.58);\n  font-size: 0.6rem;\n  font-weight: 750;\n  line-height: 1.3;\n}\n.operator-action-popup__field.is-invalid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  border-color: rgba(180, 52, 72, 0.56);\n  background: #fff4f5;\n}\n.operator-action-popup__field.is-invalid[_ngcontent-%COMP%]    > small[_ngcontent-%COMP%] {\n  color: #9b3447;\n}\n.operator-action-popup__field.is-wide[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.operator-action-popup__select-field[_ngcontent-%COMP%]   app-menu[_ngcontent-%COMP%] {\n  min-width: 0;\n  width: 100%;\n}\n.operator-action-popup__section-actions[_ngcontent-%COMP%] {\n  min-width: 0;\n  width: max-content;\n  max-width: 100%;\n  margin-top: 0.08rem;\n  justify-self: start;\n  --app-menu-action-flex: 0 1 auto;\n  --app-menu-action-min-width: 0;\n}\n.operator-action-popup__section-actions--social[_ngcontent-%COMP%] {\n  width: max-content;\n  max-width: 100%;\n}\n.operator-action-popup__tls-grid[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  align-items: end;\n  gap: 0.58rem;\n}\n.operator-action-popup__tls-header[_ngcontent-%COMP%] {\n  display: grid !important;\n  grid-template-columns: minmax(0, 1fr) auto auto;\n  grid-template-areas: "title tests toggle";\n  align-items: center !important;\n  gap: 0.45rem 0.7rem !important;\n}\n.operator-action-popup__tls-title[_ngcontent-%COMP%] {\n  grid-area: title;\n}\n.operator-action-popup__tls-toggle-wrap[_ngcontent-%COMP%] {\n  grid-area: toggle;\n  display: inline-flex;\n  justify-self: end;\n  min-width: 0;\n}\n.operator-action-popup__on-off-toggle[_ngcontent-%COMP%] {\n  min-width: 82px;\n  min-height: 38px;\n  padding: 0.3rem 0.62rem;\n  border-radius: 999px;\n  border: 1px solid rgba(128, 149, 176, 0.24);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.4rem;\n  color: #5b6e8e;\n  background:\n    linear-gradient(\n      180deg,\n      #f4f7fb 0%,\n      #e9eff7 100%);\n  font-size: 0.76rem;\n  font-weight: 800;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n  box-shadow: 0 2px 7px rgba(29, 53, 86, 0.08);\n  cursor: pointer;\n}\n.operator-action-popup__on-off-toggle.is-on[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf8ee 0%,\n      #ddf1e2 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.operator-action-popup__on-off-toggle[_ngcontent-%COMP%]:disabled {\n  cursor: default;\n  opacity: 0.58;\n  pointer-events: none;\n  filter: grayscale(0.35);\n  box-shadow: none;\n}\n.operator-action-popup__on-off-toggle[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.operator-action-popup__tls-test-actions[_ngcontent-%COMP%] {\n  grid-area: tests;\n  justify-self: end;\n  width: 340px !important;\n  max-width: 100%;\n  --app-menu-row-width: 100%;\n  --app-menu-action-flex: 1 1 0;\n  --app-menu-action-min-width: 0;\n}\n.operator-action-popup__tls-source-controls[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.42rem;\n}\n.operator-action-popup__tls-renewal-toggle[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  justify-self: end;\n}\n.operator-action-popup__firebase-public-grid[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.58rem;\n}\n.operator-action-popup__social-links[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.55rem;\n}\n.operator-action-popup__social-link[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding: 0.58rem;\n  border: 1px solid color-mix(in srgb, var(--operator-configuration-accent) 24%, transparent);\n  border-radius: 10px;\n  background: rgba(255, 255, 255, 0.72);\n  display: grid;\n  gap: 0.5rem;\n}\n.operator-action-popup__social-link-fields[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 0.5rem;\n}\n.operator-action-popup__social-link[_ngcontent-%COMP%]   app-link-input[_ngcontent-%COMP%] {\n  min-width: 0;\n  width: 100%;\n}\n.operator-action-popup__payment-routing[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: minmax(0, 1fr);\n  gap: 0.5rem;\n}\n.operator-action-popup__payment-routing.is-barion[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n.operator-action-popup__payment-routing[_ngcontent-%COMP%]   app-link-input[_ngcontent-%COMP%] {\n  min-width: 0;\n  width: 100%;\n}\n.operator-action-popup__social-link[_ngcontent-%COMP%]   app-menu[_ngcontent-%COMP%] {\n  justify-self: start;\n}\n.operator-action-popup__empty[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 0.72rem;\n  border: 1px dashed var(--operator-configuration-border);\n  border-radius: 10px;\n  color: rgba(36, 56, 83, 0.68);\n  background: rgba(255, 255, 255, 0.48);\n  font-size: 0.72rem;\n  font-weight: 750;\n}\n.operator-action-popup__logo-field[_ngcontent-%COMP%]   app-image-carousel[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: none;\n}\n.operator-action-popup__branding-editor[_ngcontent-%COMP%]   .operator-action-popup__logo-field[_ngcontent-%COMP%] {\n  grid-column: 1;\n  grid-row: 1/span 3;\n  align-self: stretch;\n  min-height: 0;\n  grid-template-rows: auto minmax(148px, 1fr) auto;\n}\n.operator-action-popup__branding-editor[_ngcontent-%COMP%]   .operator-action-popup__logo-field[_ngcontent-%COMP%]   app-image-carousel[_ngcontent-%COMP%] {\n  height: 100%;\n  min-height: 148px;\n  --image-single-slot-height: 100%;\n  --image-single-slot-content-flex: 1 1 auto;\n  --image-single-slot-content-width: 100%;\n  --image-single-slot-aspect-ratio: auto;\n}\n.operator-action-popup__media-guidance[_ngcontent-%COMP%] {\n  color: rgba(36, 56, 83, 0.68);\n  font-size: 0.74rem;\n  font-weight: 700;\n  line-height: 1.25;\n}\n.operator-action-popup__header-actions[_ngcontent-%COMP%] {\n  min-width: 0;\n  width: min(100%, 280px);\n}\n.operator-action-popup__sr-only[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  margin: -1px;\n  padding: 0;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}\n.operator-action-popup__update-progress[_ngcontent-%COMP%] {\n  padding: 0.7rem;\n  border: 1px solid rgba(22, 128, 113, 0.18);\n  border-radius: 12px;\n  background: #f1f8f7;\n  display: grid;\n  gap: 0.42rem;\n}\n.operator-action-popup__update-progress[data-phase=FAILED][_ngcontent-%COMP%] {\n  border-color: rgba(185, 49, 71, 0.22);\n  background: #fff0f3;\n  color: #9b3447;\n}\n.operator-action-popup__update-progress[data-phase=COMPLETED][_ngcontent-%COMP%] {\n  background: #eaf8f2;\n  color: #146b54;\n}\n.operator-action-popup__update-progress-header[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: auto 1fr auto;\n  align-items: center;\n  gap: 0.42rem;\n  font-size: 0.72rem;\n}\n.operator-action-popup__update-progress-header[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.operator-action-popup__update-progress[_ngcontent-%COMP%]   progress[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 7px;\n  overflow: hidden;\n  border: 0;\n  border-radius: 999px;\n  accent-color: #168071;\n}\n.operator-action-popup__update-progress[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.operator-action-popup__update-progress[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:last-child {\n  color: rgba(36, 56, 83, 0.62);\n  font-size: 0.65rem;\n  font-weight: 750;\n}\n.operator-action-popup__claim-paths[_ngcontent-%COMP%], \n.operator-action-popup[_ngcontent-%COMP%]   app-form-flow[_ngcontent-%COMP%] {\n  min-width: 0;\n  width: 100%;\n}\n.operator-action-popup__claim-review[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: start;\n  gap: 0.55rem;\n}\n.operator-action-popup__claim-review[_ngcontent-%COMP%]   .operator-action-popup__result[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.operator-action-popup__claim-share[_ngcontent-%COMP%] {\n  min-height: 28px;\n  padding: 0.25rem 0.52rem;\n  border: 1px solid rgba(183, 95, 47, 0.3);\n  border-radius: 999px;\n  background: #fff7e7;\n  color: #946114;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n  font-size: 0.72rem;\n  font-weight: 900;\n  white-space: nowrap;\n}\n.operator-action-popup__claim-share[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.operator-action-popup__revenue-delivery[_ngcontent-%COMP%] {\n  --operator-delivery-accent: #52657b;\n  --operator-delivery-surface: #f2f5f8;\n  min-width: 0;\n  padding: 0.68rem;\n  border: 1px solid color-mix(in srgb, var(--operator-delivery-accent) 22%, transparent);\n  border-radius: 12px;\n  background: var(--operator-delivery-surface);\n  display: grid;\n  gap: 0.48rem;\n}\n.operator-action-popup__revenue-delivery[data-state=SYNCHRONIZED][_ngcontent-%COMP%] {\n  --operator-delivery-accent: #187258;\n  --operator-delivery-surface: #edf8f3;\n}\n.operator-action-popup__revenue-delivery[data-state=PENDING][_ngcontent-%COMP%], \n.operator-action-popup__revenue-delivery[data-state=BUSY][_ngcontent-%COMP%] {\n  --operator-delivery-accent: #946114;\n  --operator-delivery-surface: #fff8e9;\n}\n.operator-action-popup__revenue-delivery[data-state=BLOCKED][_ngcontent-%COMP%], \n.operator-action-popup__revenue-delivery[data-state=ERROR][_ngcontent-%COMP%] {\n  --operator-delivery-accent: #9b3447;\n  --operator-delivery-surface: #fff1f4;\n}\n.operator-action-popup__revenue-delivery[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.45rem;\n  color: var(--operator-delivery-accent);\n}\n.operator-action-popup__revenue-delivery[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]    > .mat-icon[_ngcontent-%COMP%] {\n  width: 19px;\n  height: 19px;\n  font-size: 19px;\n}\n.operator-action-popup__revenue-delivery[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.04rem;\n}\n.operator-action-popup__revenue-delivery[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.operator-action-popup__revenue-delivery[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]   time[_ngcontent-%COMP%] {\n  color: rgba(36, 56, 83, 0.58);\n  font-size: 0.64rem;\n  font-weight: 800;\n}\n.operator-action-popup__revenue-delivery[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n}\n.operator-action-popup__revenue-delivery[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]   time[_ngcontent-%COMP%] {\n  white-space: nowrap;\n}\n.operator-action-popup__revenue-delivery[_ngcontent-%COMP%]    > p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: rgba(36, 56, 83, 0.76);\n  font-size: 0.7rem;\n  font-weight: 720;\n  line-height: 1.4;\n  overflow-wrap: anywhere;\n}\n.operator-action-popup__revenue-delivery[_ngcontent-%COMP%]   dl[_ngcontent-%COMP%] {\n  margin: 0;\n  display: grid;\n  grid-template-columns: repeat(5, minmax(0, 1fr));\n  gap: 0.34rem;\n}\n.operator-action-popup__revenue-delivery[_ngcontent-%COMP%]   dl[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding: 0.38rem 0.42rem;\n  border-radius: 9px;\n  background: rgba(255, 255, 255, 0.72);\n  display: grid;\n  gap: 0.06rem;\n}\n.operator-action-popup__revenue-delivery[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%] {\n  color: rgba(36, 56, 83, 0.56);\n  font-size: 0.6rem;\n  font-weight: 800;\n  overflow-wrap: anywhere;\n}\n.operator-action-popup__revenue-delivery[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--operator-delivery-accent);\n  font-size: 0.8rem;\n  font-weight: 950;\n  font-variant-numeric: tabular-nums;\n}\n.operator-action-popup__revenue-reports[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding: 0.62rem;\n  border: 1px solid rgba(155, 52, 71, 0.18);\n  border-radius: 12px;\n  background: #fff8fa;\n  display: grid;\n  gap: 0.5rem;\n}\n.operator-action-popup__revenue-reports[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n}\n.operator-action-popup__revenue-reports[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.04rem;\n}\n.operator-action-popup__revenue-reports[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: rgba(36, 56, 83, 0.56);\n  font-size: 0.62rem;\n  font-weight: 800;\n}\n.operator-action-popup__revenue-reports[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #9b3447;\n  font-size: 0.8rem;\n}\n.operator-action-popup__revenue-reports[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]   b[_ngcontent-%COMP%] {\n  min-width: 28px;\n  min-height: 28px;\n  padding: 0 0.42rem;\n  border-radius: 999px;\n  background: #ffe5eb;\n  color: #9b3447;\n  display: grid;\n  place-items: center;\n  font-size: 0.72rem;\n  font-variant-numeric: tabular-nums;\n}\n.operator-action-popup__revenue-reports[_ngcontent-%COMP%]   app-smart-list[_ngcontent-%COMP%] {\n  min-width: 0;\n  width: 100%;\n}\n.operator-action-popup__revenue-report[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding: 0.56rem;\n  border: 1px solid rgba(155, 52, 71, 0.14);\n  border-radius: 10px;\n  background: #fff;\n  display: grid;\n  gap: 0.38rem;\n}\n.operator-action-popup__revenue-report[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.42rem;\n}\n.operator-action-popup__revenue-report-icon[_ngcontent-%COMP%] {\n  width: 30px;\n  height: 30px;\n  border-radius: 9px;\n  background: #ffe8ed;\n  color: #9b3447;\n  display: grid;\n  place-items: center;\n}\n.operator-action-popup__revenue-report-icon[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n}\n.operator-action-popup__revenue-report[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:nth-child(2) {\n  min-width: 0;\n  display: grid;\n  gap: 0.03rem;\n}\n.operator-action-popup__revenue-report[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.operator-action-popup__revenue-report[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%] {\n  color: rgba(36, 56, 83, 0.55);\n  font-size: 0.6rem;\n  font-weight: 800;\n}\n.operator-action-popup__revenue-report[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #314762;\n  font-size: 0.76rem;\n}\n.operator-action-popup__revenue-report[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  padding: 0.2rem 0.4rem;\n  border-radius: 999px;\n  background: #fff0f3;\n  color: #9b3447;\n  font-size: 0.62rem;\n  font-style: normal;\n  font-weight: 900;\n  white-space: nowrap;\n}\n.operator-action-popup__revenue-report[_ngcontent-%COMP%]    > p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: rgba(36, 56, 83, 0.76);\n  font-size: 0.68rem;\n  font-weight: 720;\n  line-height: 1.4;\n}\n.operator-action-popup__revenue-report-code[_ngcontent-%COMP%] {\n  color: #9b3447;\n  font-family: monospace;\n  font-size: 0.62rem;\n  font-weight: 800;\n  overflow-wrap: anywhere;\n}\n.operator-action-popup__revenue-report[_ngcontent-%COMP%]   dl[_ngcontent-%COMP%] {\n  margin: 0;\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.3rem;\n}\n.operator-action-popup__revenue-report[_ngcontent-%COMP%]   dl[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.04rem;\n}\n.operator-action-popup__revenue-report[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  min-width: 0;\n  margin: 0;\n  color: #314762;\n  font-size: 0.66rem;\n  font-weight: 850;\n  overflow-wrap: anywhere;\n}\n.operator-action-popup__revenue-report[_ngcontent-%COMP%]   app-menu[_ngcontent-%COMP%] {\n  width: min(100%, 220px);\n}\n.operator-action-popup__settlements[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding: 0.7rem;\n  border: 1px solid rgba(39, 128, 105, 0.22);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      155deg,\n      #f3fbf8 0%,\n      #eef6fb 100%);\n  display: grid;\n  gap: 0.62rem;\n}\n.operator-action-popup__settlements-header[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.55rem;\n}\n.operator-action-popup__settlements-icon[_ngcontent-%COMP%] {\n  width: 38px;\n  height: 38px;\n  border-radius: 12px;\n  background: #dff3ec;\n  color: #19795e;\n  display: grid;\n  place-items: center;\n}\n.operator-action-popup__settlements-icon[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 20px;\n  height: 20px;\n  font-size: 20px;\n}\n.operator-action-popup__settlements-header[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:nth-child(2) {\n  min-width: 0;\n  display: grid;\n  gap: 0.04rem;\n}\n.operator-action-popup__settlements-header[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: rgba(36, 56, 83, 0.65);\n  font-size: 0.78rem;\n  font-weight: 850;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n}\n.operator-action-popup__settlements-header[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #1d6756;\n  font-size: 0.92rem;\n}\n.operator-action-popup__settlements-header[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  color: rgba(36, 56, 83, 0.72);\n  font-size: 0.8rem;\n  font-style: normal;\n  font-weight: 700;\n  line-height: 1.35;\n}\n.operator-action-popup__settlements-header[_ngcontent-%COMP%]    > b[_ngcontent-%COMP%] {\n  padding: 0.34rem 0.52rem;\n  border-radius: 999px;\n  background: #fff4d9;\n  color: #8c5c0f;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  font-size: 0.78rem;\n  white-space: nowrap;\n}\n.operator-action-popup__settlements-header[_ngcontent-%COMP%]    > b[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.operator-action-popup__settlements-unavailable[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 0.62rem;\n  border-radius: 11px;\n  background: #fff7e7;\n  color: #8b5a0f;\n  display: flex;\n  align-items: center;\n  gap: 0.42rem;\n  font-size: 0.8rem;\n  font-weight: 800;\n  line-height: 1.4;\n}\n.operator-action-popup__settlements-unavailable[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n}\n.operator-action-popup__settlements[_ngcontent-%COMP%]   app-smart-list[_ngcontent-%COMP%] {\n  min-width: 0;\n  width: 100%;\n}\n.operator-action-popup__settlement[_ngcontent-%COMP%] {\n  --operator-settlement-accent: #53687e;\n  min-width: 0;\n  padding: 0.68rem;\n  border: 1px solid color-mix(in srgb, var(--operator-settlement-accent) 20%, transparent);\n  border-radius: 12px;\n  background: rgba(255, 255, 255, 0.9);\n  display: grid;\n  gap: 0.52rem;\n}\n.operator-action-popup__settlement[data-trend=positive][_ngcontent-%COMP%] {\n  --operator-settlement-accent: #158164;\n}\n.operator-action-popup__settlement[data-trend=negative][_ngcontent-%COMP%] {\n  --operator-settlement-accent: #b14b5d;\n}\n.operator-action-popup__settlement[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto auto;\n  align-items: center;\n  gap: 0.42rem;\n}\n.operator-action-popup__settlement-period[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.04rem;\n}\n.operator-action-popup__settlement-period[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.operator-action-popup__settlement[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%] {\n  color: rgba(36, 56, 83, 0.64);\n  font-size: 0.78rem;\n  font-weight: 800;\n  line-height: 1.25;\n}\n.operator-action-popup__settlement-period[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #263f5d;\n  font-size: 0.86rem;\n}\n.operator-action-popup__settlement-currency[_ngcontent-%COMP%], \n.operator-action-popup__settlement-revision[_ngcontent-%COMP%] {\n  min-height: 26px;\n  padding: 0 0.48rem;\n  border-radius: 999px;\n  display: inline-flex;\n  align-items: center;\n  font-size: 0.78rem;\n  font-weight: 900;\n  white-space: nowrap;\n}\n.operator-action-popup__settlement-currency[_ngcontent-%COMP%] {\n  background: #dff3ec;\n  color: #146c55;\n}\n.operator-action-popup__settlement-revision[_ngcontent-%COMP%] {\n  background: #edf1f6;\n  color: #52657c;\n}\n.operator-action-popup__settlement[_ngcontent-%COMP%]   dl[_ngcontent-%COMP%] {\n  margin: 0;\n  display: grid;\n  gap: 0.36rem;\n}\n.operator-action-popup__settlement[_ngcontent-%COMP%]   dl[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding: 0.46rem 0.5rem;\n  border-radius: 9px;\n  background: rgba(238, 244, 249, 0.86);\n  display: grid;\n  gap: 0.08rem;\n}\n.operator-action-popup__settlement-month[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n}\n.operator-action-popup__settlement-month[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  background: #e9f7f1 !important;\n}\n.operator-action-popup__settlement-valuation[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n}\n.operator-action-popup__settlement-valuation[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  background: #eef3ff !important;\n}\n.operator-action-popup__settlement-trend[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n}\n.operator-action-popup__settlement[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  min-width: 0;\n  margin: 0;\n  color: var(--operator-settlement-accent);\n  font-size: 0.84rem;\n  font-weight: 900;\n  font-variant-numeric: tabular-nums;\n  overflow-wrap: anywhere;\n}\n.operator-action-popup__settlement[_ngcontent-%COMP%]    > footer[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding-top: 0.42rem;\n  border-top: 1px solid rgba(50, 78, 105, 0.12);\n  color: rgba(36, 56, 83, 0.66);\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-between;\n  gap: 0.35rem 0.7rem;\n  font-size: 0.78rem;\n  line-height: 1.35;\n}\n.operator-action-popup__settlement[_ngcontent-%COMP%]    > footer[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #405873;\n  overflow-wrap: anywhere;\n}\n.operator-action-popup__deployments[_ngcontent-%COMP%] {\n  min-width: 0;\n  min-height: 0;\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  gap: 0.58rem;\n}\n.operator-action-popup__deployment-summary[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding: 0.68rem;\n  border: 1px solid rgba(23, 121, 135, 0.18);\n  border-radius: 12px;\n  background:\n    linear-gradient(\n      180deg,\n      #f0fbfb 0%,\n      #e8f6f7 100%);\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto auto;\n  align-items: center;\n  gap: 0.58rem;\n  flex: 0 0 auto;\n}\n.operator-action-popup__deployment-summary-icon[_ngcontent-%COMP%] {\n  width: 34px;\n  height: 34px;\n  border-radius: 10px;\n  background: #d8f0f1;\n  color: #176b74;\n  display: grid;\n  place-items: center;\n}\n.operator-action-popup__deployment-summary-icon[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 19px;\n  height: 19px;\n  font-size: 19px;\n}\n.operator-action-popup__deployment-summary[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:nth-child(2) {\n  min-width: 0;\n  display: grid;\n  gap: 0.04rem;\n}\n.operator-action-popup__deployment-summary[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: rgba(36, 56, 83, 0.58);\n  font-size: 0.64rem;\n  font-weight: 800;\n}\n.operator-action-popup__deployment-summary[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #285b65;\n  font-size: 0.8rem;\n}\n.operator-action-popup__deployment-summary[_ngcontent-%COMP%]   b[_ngcontent-%COMP%] {\n  padding: 0.28rem 0.48rem;\n  border-radius: 999px;\n  background: #d8f0f1;\n  color: #176b74;\n  font-size: 0.7rem;\n  font-variant-numeric: tabular-nums;\n}\n.operator-action-popup__deployment-eligibility[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding: 0.28rem 0.48rem;\n  border-radius: 999px;\n  background: #fff0d5;\n  color: #985e08;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n  font-size: 0.68rem;\n  font-weight: 850;\n  white-space: nowrap;\n}\n.operator-action-popup__deployment-eligibility[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n}\n.operator-action-popup__deployment-eligibility[data-status=SUSPENDED][_ngcontent-%COMP%] {\n  background: #ffe5e8;\n  color: #a8293e;\n}\n.operator-action-popup__deployment-eligibility[data-status=INACTIVE][_ngcontent-%COMP%] {\n  background: #edf1f6;\n  color: #53677e;\n}\n.operator-action-popup__deployment-list[_ngcontent-%COMP%] {\n  min-width: 0;\n  min-height: 0;\n  display: flex;\n  flex: 1 1 auto;\n}\n.operator-action-popup__community[_ngcontent-%COMP%] {\n  padding: 0.75rem;\n  border-radius: 14px;\n  background: #f4f6fa;\n  display: flex;\n  align-items: center;\n  gap: 0.65rem;\n}\n.operator-action-popup__community[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:last-child {\n  display: grid;\n  gap: 0.08rem;\n}\n.operator-action-popup__community[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: rgba(36, 56, 83, 0.64);\n  font-size: 0.72rem;\n  font-weight: 800;\n}\n.operator-action-popup__community[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.84rem;\n}\n.operator-action-popup__presence[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n  border: 3px solid #fff;\n  border-radius: 50%;\n  background: #8994a6;\n  box-shadow: 0 0 0 1px rgba(31, 49, 76, 0.1);\n}\n.operator-action-popup__presence[data-state=ONLINE][_ngcontent-%COMP%], \n.operator-action-popup__presence[data-state=AVAILABLE][_ngcontent-%COMP%] {\n  background: #24a77b;\n}\n.operator-action-popup__presence[data-state=BUSY][_ngcontent-%COMP%] {\n  background: #d85362;\n}\n.operator-action-popup__providers[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.5rem;\n}\n.operator-action-popup__provider[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding: 0.62rem;\n  border: 1px solid rgba(45, 66, 98, 0.11);\n  border-radius: 12px;\n  background: #fafbfe;\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.55rem;\n}\n.operator-action-popup__provider-icon[_ngcontent-%COMP%] {\n  width: 34px;\n  height: 34px;\n  border-radius: 11px;\n  background: #ece9fa;\n  color: #6650c9;\n  display: grid;\n  place-items: center;\n}\n.operator-action-popup__provider-copy[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.08rem;\n}\n.operator-action-popup__provider-copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.82rem;\n}\n.operator-action-popup__provider-copy[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: rgba(36, 56, 83, 0.68);\n  font-size: 0.74rem;\n  line-height: 1.35;\n}\n.operator-action-popup__provider-link[_ngcontent-%COMP%] {\n  min-height: 34px;\n  padding: 0 0.62rem;\n  border-radius: 999px;\n  background: #e7f3f1;\n  color: #19796d;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  font-size: 0.72rem;\n  font-weight: 900;\n  text-decoration: none;\n}\n.operator-action-popup__provider-link[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.operator-action-popup__announcements[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.5rem;\n}\n.operator-action-popup__announcements[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0.15rem 0 0;\n  color: rgba(36, 56, 83, 0.68);\n  font-size: 0.76rem;\n  font-weight: 900;\n}\n.operator-action-popup__announcement[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding: 0.72rem;\n  border: 1px solid rgba(102, 80, 201, 0.16);\n  border-radius: 12px;\n  background: #f8f6ff;\n  display: grid;\n  gap: 0.48rem;\n}\n.operator-action-popup__announcement[data-severity=WARNING][_ngcontent-%COMP%] {\n  border-color: rgba(194, 126, 25, 0.24);\n  background: #fff9ed;\n}\n.operator-action-popup__announcement[data-severity=CRITICAL][_ngcontent-%COMP%] {\n  border-color: rgba(185, 49, 71, 0.22);\n  background: #fff1f4;\n}\n.operator-action-popup__announcement[_ngcontent-%COMP%]   header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n}\n.operator-action-popup__announcement[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  display: grid;\n}\n.operator-action-popup__announcement[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: rgba(36, 56, 83, 0.58);\n  font-size: 0.72rem;\n  font-weight: 800;\n}\n.operator-action-popup__announcement[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.82rem;\n}\n.operator-action-popup__announcement-badges[_ngcontent-%COMP%] {\n  display: inline-flex !important;\n  align-items: center;\n  gap: 0.34rem;\n}\n.operator-action-popup__announcement-badges[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  background: #d93d51;\n  box-shadow: 0 0 0 3px rgba(217, 61, 81, 0.12);\n}\n.operator-action-popup__announcement-badges[_ngcontent-%COMP%]   b[_ngcontent-%COMP%] {\n  padding: 0.2rem 0.42rem;\n  border-radius: 999px;\n  background: #e9f7f1;\n  color: #137157;\n  font-size: 0.72rem;\n  text-transform: uppercase;\n}\n.operator-action-popup__announcement-badges[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  padding: 0.2rem 0.42rem;\n  border-radius: 999px;\n  background: #edf2f8;\n  color: #586a81;\n  font-size: 0.72rem;\n  font-style: normal;\n  font-weight: 900;\n  text-transform: uppercase;\n}\n.operator-action-popup__announcement-badges[_ngcontent-%COMP%]   em[data-severity=SUCCESS][_ngcontent-%COMP%] {\n  background: #e9f7f1;\n  color: #137157;\n}\n.operator-action-popup__announcement-badges[_ngcontent-%COMP%]   em[data-severity=WARNING][_ngcontent-%COMP%] {\n  background: #fff2d8;\n  color: #946114;\n}\n.operator-action-popup__announcement-badges[_ngcontent-%COMP%]   em[data-severity=CRITICAL][_ngcontent-%COMP%] {\n  background: #ffe6eb;\n  color: #9b3447;\n}\n.operator-action-popup__announcement-badges[_ngcontent-%COMP%]   b[data-status=WITHDRAWN][_ngcontent-%COMP%] {\n  background: #fff0f3;\n  color: #9b3447;\n}\n.operator-action-popup__announcement[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n.operator-action-popup__announcement[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  margin: 0;\n  color: rgba(36, 56, 83, 0.75);\n  font-size: 0.74rem;\n  font-weight: 700;\n  line-height: 1.42;\n}\n.operator-action-popup__announcement[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  padding-left: 1.05rem;\n}\n.operator-action-popup__announcement-date[_ngcontent-%COMP%] {\n  color: rgba(36, 56, 83, 0.52);\n  font-size: 0.72rem;\n  font-weight: 750;\n}\n.operator-action-popup__announcement-details[_ngcontent-%COMP%] {\n  min-width: 0;\n  border-top: 1px solid rgba(102, 80, 201, 0.12);\n  padding-top: 0.35rem;\n}\n.operator-action-popup__announcement-details[_ngcontent-%COMP%]   summary[_ngcontent-%COMP%] {\n  width: fit-content;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.22rem;\n  color: #513da7;\n  cursor: pointer;\n  font-size: 0.74rem;\n  font-weight: 900;\n  list-style: none;\n}\n.operator-action-popup__announcement-details[_ngcontent-%COMP%]   summary[_ngcontent-%COMP%]::-webkit-details-marker {\n  display: none;\n}\n.operator-action-popup__announcement-details[_ngcontent-%COMP%]   summary[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  transition: transform 0.16s ease;\n}\n.operator-action-popup__announcement-details[open][_ngcontent-%COMP%]   summary[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  transform: rotate(180deg);\n}\n.operator-action-popup__announcement-detail-body[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding-top: 0.48rem;\n  display: grid;\n  gap: 0.46rem;\n}\n.operator-action-popup__announcement-links[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.4rem;\n}\n.operator-action-popup__announcement-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n  color: #513da7;\n  font-size: 0.72rem;\n  font-weight: 850;\n  text-decoration: none;\n}\n.operator-action-popup__announcement-links[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n  font-size: 14px;\n}\n.operator-action-popup__release[_ngcontent-%COMP%] {\n  padding: 0.6rem;\n  border: 1px solid rgba(102, 80, 201, 0.12);\n  border-radius: 10px;\n  background: rgba(255, 255, 255, 0.72);\n  display: grid;\n  gap: 0.42rem;\n}\n.operator-action-popup__release[_ngcontent-%COMP%]   dl[_ngcontent-%COMP%] {\n  margin: 0;\n  display: grid;\n  gap: 0.32rem;\n}\n.operator-action-popup__release[_ngcontent-%COMP%]   dl[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.06rem;\n}\n.operator-action-popup__release[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%] {\n  color: rgba(36, 56, 83, 0.54);\n  font-size: 0.72rem;\n  font-weight: 850;\n}\n.operator-action-popup__release[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  min-width: 0;\n  margin: 0;\n  color: rgba(36, 56, 83, 0.8);\n  font-size: 0.74rem;\n  font-weight: 750;\n  overflow-wrap: anywhere;\n}\n.operator-action-popup__release[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n  color: #513da7;\n  font-size: 0.72rem;\n}\n.operator-action-popup__release[_ngcontent-%COMP%]   dd.operator-action-popup__signature-state[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  color: #a36a17;\n}\n.operator-action-popup__release[_ngcontent-%COMP%]   dd.operator-action-popup__signature-state[data-verified=true][_ngcontent-%COMP%] {\n  color: #137157;\n}\n.operator-action-popup__signature-state[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n}\n.operator-action-popup__download[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding-top: 0.42rem;\n  border-top: 1px solid rgba(102, 80, 201, 0.12);\n  display: grid;\n  gap: 0.38rem;\n}\n.operator-action-popup__download[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:first-child {\n  min-width: 0;\n  display: grid;\n  gap: 0.12rem;\n}\n.operator-action-popup__download[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: rgba(36, 56, 83, 0.58);\n  font-size: 0.72rem;\n  font-weight: 800;\n}\n.operator-action-popup__download[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n  color: #513da7;\n  font-size: 0.72rem;\n  font-weight: 750;\n}\n.operator-action-popup__download[_ngcontent-%COMP%]   a[_ngcontent-%COMP%], \n.operator-action-popup__download-unverified[_ngcontent-%COMP%] {\n  width: fit-content;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  color: #137157;\n  font-size: 0.72rem;\n  font-weight: 850;\n  text-decoration: none;\n}\n.operator-action-popup__download[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.operator-action-popup__download-unverified[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n}\n.operator-action-popup__download-unverified[_ngcontent-%COMP%] {\n  color: #a36a17;\n}\n.operator-action-popup__result[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 0.58rem 0.68rem;\n  border-radius: 11px;\n  display: flex;\n  align-items: center;\n  gap: 0.42rem;\n  font-size: 0.74rem;\n  font-weight: 800;\n}\n.operator-action-popup__result[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.operator-action-popup__result-copy[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.08rem;\n}\n.operator-action-popup__result-copy[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 0.65rem;\n  font-weight: 700;\n  line-height: 1.35;\n}\n.operator-action-popup__result.is-success[_ngcontent-%COMP%] {\n  background: #eaf8f2;\n  color: #146b54;\n}\n.operator-action-popup__result.is-error[_ngcontent-%COMP%] {\n  background: #fff0f3;\n  color: #9b3447;\n}\n.operator-action-popup__result.is-pending[_ngcontent-%COMP%] {\n  background: #fff7e7;\n  color: #946114;\n}\n.operator-action-popup__actions[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n@media (max-width: 820px) {\n  .operator-action-popup__firebase-public-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n@media (max-width: 560px) {\n  .operator-action-popup__summary[_ngcontent-%COMP%] {\n    grid-template-columns: auto 1fr;\n  }\n  .operator-action-popup__branding-editor[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .operator-action-popup__branding-editor[_ngcontent-%COMP%] {\n    grid-template-rows: auto;\n  }\n  .operator-action-popup__branding-editor[_ngcontent-%COMP%]   .operator-action-popup__logo-field[_ngcontent-%COMP%], \n   .operator-action-popup__branding-identity[_ngcontent-%COMP%], \n   .operator-action-popup__branding-theme[_ngcontent-%COMP%], \n   .operator-action-popup__branding-actions[_ngcontent-%COMP%] {\n    grid-column: 1;\n    grid-row: auto;\n  }\n  .operator-action-popup__branding-identity[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .operator-action-popup__social-link-fields[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .operator-action-popup__tls-grid[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .operator-action-popup__payment-routing.is-barion[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .operator-action-popup__firebase-public-grid[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .operator-action-popup__configuration-group[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%] {\n    flex-wrap: wrap;\n  }\n  .operator-action-popup__header-actions[_ngcontent-%COMP%] {\n    order: 3;\n    width: 100%;\n  }\n  .operator-action-popup__tls-test-actions[_ngcontent-%COMP%] {\n    justify-self: stretch;\n    width: 100% !important;\n  }\n  .operator-action-popup__tls-header[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr) auto;\n    grid-template-areas: "title toggle" "tests tests";\n  }\n  .operator-action-popup__revenue-delivery[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%] {\n    grid-template-columns: auto minmax(0, 1fr);\n  }\n  .operator-action-popup__revenue-delivery[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]   time[_ngcontent-%COMP%] {\n    grid-column: 2;\n  }\n  .operator-action-popup__revenue-delivery[_ngcontent-%COMP%]   dl[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n  .operator-action-popup__revenue-report[_ngcontent-%COMP%]   dl[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .operator-action-popup__settlements-header[_ngcontent-%COMP%] {\n    grid-template-columns: auto minmax(0, 1fr);\n  }\n  .operator-action-popup__settlements-header[_ngcontent-%COMP%]    > b[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n    width: fit-content;\n  }\n  .operator-action-popup__settlement[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr) auto;\n  }\n  .operator-action-popup__settlement-revision[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n    width: fit-content;\n  }\n  .operator-action-popup__settlement-month[_ngcontent-%COMP%], \n   .operator-action-popup__settlement-valuation[_ngcontent-%COMP%], \n   .operator-action-popup__settlement-trend[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n/*# sourceMappingURL=operator-action-popup.component.css.map */'], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OperatorActionPopupComponent, [{
    type: Component,
    args: [{ selector: "app-operator-action-popup", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, imports: [
      AppMenuComponent,
      FormFlowComponent,
      FormsModule,
      ImageCarouselComponent,
      IndicatorComponent,
      LinkInputComponent,
      I18nPipe,
      MatIconModule,
      OperatorRevenueViewComponent,
      PopupComponent,
      SingleRowComponent,
      SmartListComponent
    ], template: `@if (kind(); as activeKind) {
  @if (activeKind !== 'registration') {
    <app-popup [model]="popupModel()">
      <section
        class="operator-action-popup"
        [class.operator-action-popup--loading]="loading()"
        [class.operator-action-popup--deployments]="activeKind === 'deployments'"
        [attr.aria-busy]="busy()"
      >
        @if (loading()) {
          <div class="operator-action-popup__loading" role="status">
            <app-indicator kind="load-ring" state="loading"></app-indicator>
            <span>{{ 'operator.loading' | i18n }}</span>
          </div>
        } @else {
          @switch (activeKind) {
            @case ('updates') {
              @if (workspace.deploymentUpdate(); as update) {
                <div class="operator-action-popup__summary">
                  <mat-icon>deployed_code</mat-icon>
                  <span>
                    <small>{{ 'operator.update.current.version' | i18n }}</small>
                    <strong>{{ update.currentVersion }}</strong>
                  </span>
                  <span>
                    <small>{{ 'operator.update.available.version' | i18n }}</small>
                    <strong>{{ update.availableVersion }}</strong>
                  </span>
                </div>
                @if (update.lastUpdatedAt) {
                  <p class="operator-action-popup__hint">
                    {{ 'operator.update.last.updated' | i18n }}:
                    {{ formatDate(update.lastUpdatedAt) }}
                  </p>
                }
                @if (update.progress.phase !== 'IDLE') {
                  <div
                    class="operator-action-popup__update-progress"
                    [attr.data-phase]="update.progress.phase"
                    role="status"
                  >
                    <span class="operator-action-popup__update-progress-header">
                      <mat-icon>
                        {{ update.progress.phase === 'FAILED'
                          ? 'error_outline'
                          : update.progress.phase === 'COMPLETED'
                            ? 'check_circle'
                            : 'sync' }}
                      </mat-icon>
                      <strong>{{ updatePhaseLabel(update.progress.phase) | i18n }}</strong>
                      <b>{{ update.progress.percent }}%</b>
                    </span>
                    <progress
                      max="100"
                      [value]="update.progress.percent"
                      [attr.aria-label]="updatePhaseLabel(update.progress.phase) | i18n"
                    ></progress>
                    @if (update.progress.bytesTotal > 0) {
                      <small>
                        {{ formatBytes(update.progress.bytesDownloaded) }}
                        /
                        {{ formatBytes(update.progress.bytesTotal) }}
                      </small>
                    }
                    @if (update.progress.message) {
                      <span>{{ update.progress.message | i18n }}</span>
                    }
                  </div>
                }
              }
            }
            @case ('claim') {
              @if (workspace.claimStatus(); as claim) {
                <app-menu
                  class="operator-action-popup__claim-paths"
                  kind="inline"
                  layout="row"
                  [items]="claimPathItems()"
                  (itemSelect)="onAction($event)"
                ></app-menu>
                @if (claim.verificationCapability !== 'AVAILABLE') {
                  <p class="operator-action-popup__result is-error" role="alert">
                    <mat-icon>cloud_off</mat-icon>
                    <span>
                      {{ (claim.verificationUnavailableReason
                        || 'operator.claim.verification.backend.unavailable') | i18n }}
                    </span>
                  </p>
                }
                @if (!registeredForClaim()) {
                  <p class="operator-action-popup__result is-error" role="alert">
                    <mat-icon>app_registration</mat-icon>
                    <span>{{ 'operator.claim.error.registration.required' | i18n }}</span>
                  </p>
                }
                @if (claim.verificationStatus === 'PENDING_REVIEW') {
                  <div class="operator-action-popup__claim-review">
                    <p class="operator-action-popup__result is-pending" role="status">
                      <mat-icon>pending_actions</mat-icon>
                      <span class="operator-action-popup__result-copy">
                        <strong>{{ 'operator.claim.verification.pending' | i18n }}</strong>
                        <small>
                          {{ 'operator.claim.verification.pending.instructions' | i18n }}
                        </small>
                      </span>
                    </p>
                    <span
                      class="operator-action-popup__claim-share"
                      [attr.title]="'operator.leaderboard.share' | i18n"
                    >
                      <mat-icon>pie_chart</mat-icon>
                      {{ formatShare(claim.sharePercent) }}%
                    </span>
                  </div>
                } @else if (claim.verificationStatus === 'REJECTED') {
                  <div class="operator-action-popup__claim-review">
                    <p class="operator-action-popup__result is-error" role="status">
                      <mat-icon>block</mat-icon>
                      <span class="operator-action-popup__result-copy">
                        <strong>{{ 'operator.claim.verification.rejected' | i18n }}</strong>
                        <small>
                          {{ 'operator.claim.verification.rejected.instructions' | i18n }}
                        </small>
                      </span>
                    </p>
                    <span
                      class="operator-action-popup__claim-share"
                      [attr.title]="'operator.leaderboard.share' | i18n"
                    >
                      <mat-icon>pie_chart</mat-icon>
                      {{ formatShare(claim.sharePercent) }}%
                    </span>
                  </div>
                } @else if (
                  claim.verificationStatus === 'APPROVED'
                  || claim.verificationStatus === 'VERIFIED'
                ) {
                  @if (claim.eligibilityStatus === 'ACTIVE') {
                    <p class="operator-action-popup__result is-success" role="status">
                      <mat-icon>verified_user</mat-icon>
                      <span>{{ 'operator.claim.verification.approved' | i18n }}</span>
                    </p>
                  } @else if (claim.eligibilityStatus === 'SUSPENDED') {
                    <p class="operator-action-popup__result is-error" role="status">
                      <mat-icon>pause_circle</mat-icon>
                      <span class="operator-action-popup__result-copy">
                        <strong>
                          {{ 'operator.claim.eligibility.suspended' | i18n }}
                        </strong>
                        <small>
                          {{ 'operator.claim.eligibility.suspended.instructions' | i18n }}
                        </small>
                      </span>
                    </p>
                  } @else {
                    <p class="operator-action-popup__result is-pending" role="status">
                      <mat-icon>gpp_maybe</mat-icon>
                      <span>
                        {{ 'operator.claim.eligibility.inactive' | i18n }}
                      </span>
                    </p>
                  }
                }
                @if (claimPath() === 'company') {
                  @if (!claim.claimed) {
                    <p class="operator-action-popup__hint">
                      {{ 'operator.claim.verification.instructions' | i18n }}
                    </p>
                  }
                  <app-form-flow
                    [model]="claimCompanyFormModel()"
                    [ngModel]="workspace.claimDraft()"
                    (ngModelChange)="onClaimDraftChange($event)"
                    [disabled]="busy()
                      || !registeredForClaim()
                      || claim.verificationCapability !== 'AVAILABLE'
                      || claim.claimed
                      || claim.verificationStatus === 'PENDING_REVIEW'
                      || claim.verificationStatus === 'REJECTED'"
                  ></app-form-flow>
                } @else {
                  <p class="operator-action-popup__hint">
                    {{ 'operator.claim.client.code.instructions' | i18n }}
                  </p>
                  <app-form-flow
                    [model]="claimClientCodeFormModel()"
                    [ngModel]="claimClientCodeValue()"
                    (ngModelChange)="onClaimClientCodeChange($event)"
                    [disabled]="busy() || !registeredForClaim()"
                  ></app-form-flow>
                }
              }
            }
            @case ('configuration') {
              @if (workspace.configuration(); as configuration) {
                @if (workspace.configurationDraft(); as draft) {
                  @if (configuration.capability !== 'AVAILABLE') {
                    <p class="operator-action-popup__result is-error" role="alert">
                      <mat-icon>cloud_off</mat-icon>
                      <span>
                        {{ (configuration.unavailableReason
                          || 'operator.configuration.backend.unavailable') | i18n }}
                      </span>
                    </p>
                  }

                  @if (workspace.tlsConfiguration(); as tlsConfiguration) {
                    @if (workspace.tlsConfigurationDraft(); as tlsDraft) {
                      <section
                        class="operator-action-popup__configuration-group"
                        data-palette="mint"
                      >
                        <header class="operator-action-popup__tls-header">
                          <span class="operator-action-popup__tls-title">
                            <small>{{ 'operator.configuration.tls.eyebrow' | i18n }}</small>
                            <strong>{{ 'operator.configuration.tls' | i18n }}</strong>
                          </span>
                          <div class="operator-action-popup__tls-toggle-wrap">
                            <button
                              type="button"
                              class="operator-action-popup__on-off-toggle"
                              [class.is-on]="tlsDraft.enabled"
                              [disabled]="configurationTlsDisabled()"
                              (click)="toggleTlsEnabled($event)"
                              [attr.aria-label]="'operator.configuration.tls.enabled' | i18n"
                            >
                              <mat-icon>{{ tlsDraft.enabled ? 'toggle_on' : 'toggle_off' }}</mat-icon>
                              <span>{{ (tlsDraft.enabled ? 'on' : 'off') | i18n }}</span>
                            </button>
                          </div>
                          @if (tlsDraft.enabled) {
                            <app-menu
                              class="operator-action-popup__header-actions operator-action-popup__tls-test-actions"
                              kind="inline"
                              layout="row"
                              [items]="configurationTlsTestActionItems()"
                              (itemSelect)="onAction($event)"
                            ></app-menu>
                          }
                        </header>

                        @if (tlsConfiguration.capability !== 'AVAILABLE') {
                          <p class="operator-action-popup__result is-error" role="alert">
                            <mat-icon>cloud_off</mat-icon>
                            <span>
                              {{ (tlsConfiguration.unavailableReason
                                || 'operator.configuration.tls.backend.unavailable') | i18n }}
                            </span>
                          </p>
                        }

                        @if (tlsDraft.enabled) {
                          <div class="operator-action-popup__tls-grid">
                            <label class="operator-action-popup__field">
                              <span>{{ 'operator.configuration.tls.domain' | i18n }}</span>
                              <input
                                type="text"
                                maxlength="253"
                                autocomplete="url"
                                autocapitalize="off"
                                spellcheck="false"
                                placeholder="app.example.com"
                                [ngModel]="tlsDraft.domain"
                                (ngModelChange)="workspace.setTlsConfiguration({ domain: $event })"
                                [disabled]="configurationTlsDisabled()"
                              />
                            </label>

                            <div class="operator-action-popup__select-field">
                              <span>{{ 'operator.configuration.tls.mode' | i18n }}</span>
                              <div class="operator-action-popup__tls-source-controls">
                                <app-menu
                                  kind="select"
                                  [trigger]="configurationTlsModeTrigger()"
                                  [items]="configurationTlsModeItems()"
                                  (itemSelect)="onAction($event)"
                                ></app-menu>
                                @if (tlsDraft.mode === 'AUTOMATIC') {
                                  <app-menu
                                    class="operator-action-popup__tls-renewal-toggle"
                                    kind="inline"
                                    layout="row"
                                    [items]="configurationTlsAutoRenewItems()"
                                    (itemSelect)="onAction($event)"
                                  ></app-menu>
                                }
                              </div>
                            </div>

                            @if (tlsDraft.mode === 'AUTOMATIC') {
                              <label class="operator-action-popup__field is-wide">
                                <span>{{ 'operator.configuration.tls.contact.email' | i18n }}</span>
                                <input
                                  type="email"
                                  maxlength="254"
                                  autocomplete="email"
                                  [ngModel]="tlsDraft.contactEmail"
                                  (ngModelChange)="workspace.setTlsConfiguration({ contactEmail: $event })"
                                  [disabled]="configurationTlsDisabled()"
                                />
                              </label>
                            } @else {
                              <label class="operator-action-popup__field is-wide">
                                <span>{{ 'operator.configuration.tls.certificate' | i18n }}</span>
                                <textarea
                                  rows="5"
                                  maxlength="131072"
                                  autocomplete="off"
                                  spellcheck="false"
                                  [placeholder]="tlsConfiguration.certificateConfigured
                                    && tlsConfiguration.mode === 'MANUAL'
                                    && tlsConfiguration.domain === tlsDraft.domain.trim().toLowerCase()
                                    ? ('operator.configuration.tls.credential.configured' | i18n)
                                    : ('operator.configuration.tls.certificate.placeholder' | i18n)"
                                  [ngModel]="tlsDraft.certificate"
                                  (ngModelChange)="workspace.setTlsConfiguration({ certificate: $event })"
                                  [disabled]="configurationTlsDisabled()"
                                ></textarea>
                              </label>
                              <label class="operator-action-popup__field is-wide">
                                <span>{{ 'operator.configuration.tls.private.key' | i18n }}</span>
                                <textarea
                                  rows="5"
                                  maxlength="131072"
                                  autocomplete="new-password"
                                  spellcheck="false"
                                  [placeholder]="tlsConfiguration.certificateConfigured
                                    && tlsConfiguration.mode === 'MANUAL'
                                    && tlsConfiguration.domain === tlsDraft.domain.trim().toLowerCase()
                                    ? ('operator.configuration.tls.credential.configured' | i18n)
                                    : ('operator.configuration.tls.private.key.placeholder' | i18n)"
                                  [ngModel]="tlsDraft.privateKey"
                                  (ngModelChange)="workspace.setTlsConfiguration({ privateKey: $event })"
                                  [disabled]="configurationTlsDisabled()"
                                ></textarea>
                              </label>
                            }
                          </div>

                          @if (tlsConfiguration.certificateConfigured) {
                            <p class="operator-action-popup__hint">
                              {{ 'operator.configuration.tls.certificate.configured' | i18n }}
                              @if (tlsConfiguration.updatedAt) {
                                \xB7 {{ formatDate(tlsConfiguration.updatedAt) }}
                              }
                            </p>
                          }

                        }

                        @if (showTlsSaveAction()) {
                          <app-menu
                            class="operator-action-popup__section-actions operator-action-popup__single-action-menu"
                            kind="inline"
                            layout="row"
                            panelMode="anchored"
                            [items]="configurationTlsSaveActionItems()"
                            (itemSelect)="onAction($event)"
                          ></app-menu>
                        }

                        @if (
                          workspace.feedbackAction() === 'save-tls'
                          || workspace.feedbackAction() === 'test-tls-domain'
                          || workspace.feedbackAction() === 'test-tls-certificate'
                        ) {
                          @if (workspace.error()) {
                            <p class="operator-action-popup__result is-error" role="alert">
                              <mat-icon>error_outline</mat-icon>
                              <span>{{ workspace.error() | i18n }}</span>
                            </p>
                          } @else if (
                            workspace.notice()
                            && workspace.feedbackAction() !== 'save-tls'
                          ) {
                            <p class="operator-action-popup__result is-success" role="status">
                              <mat-icon>check_circle</mat-icon>
                              <span>{{ workspace.notice() | i18n }}</span>
                            </p>
                          }
                        }
                      </section>
                    }
                  }

                  <section
                    class="operator-action-popup__configuration-group"
                    data-palette="violet"
                  >
                    <header>
                      <span>
                        <small>{{ 'operator.configuration.branding.eyebrow' | i18n }}</small>
                        <strong>{{ 'operator.configuration.branding' | i18n }}</strong>
                      </span>
                      <mat-icon>palette</mat-icon>
                    </header>

                    <div class="operator-action-popup__branding-editor">
                      <div class="operator-action-popup__logo-field">
                        <span>{{ 'operator.configuration.branding.logo' | i18n }}</span>
                        <app-image-carousel
                          [slotCount]="1"
                          [compact]="true"
                          [autoSize]="true"
                          mediaFit="contain"
                          imagePosition="center"
                          [ngModel]="draft.branding.logoUrl ? [draft.branding.logoUrl] : []"
                          (ngModelChange)="onBrandingLogoChange($event)"
                          [disabled]="configurationDisabled()"
                          [uploadOwnerId]="workspace.configurationUploadOwnerId()"
                          uploadEntityId="deployment-branding-logo"
                          [ariaLabel]="'operator.configuration.branding.logo' | i18n"
                        ></app-image-carousel>
                        <small class="operator-action-popup__media-guidance">
                          {{ 'operator.configuration.branding.logo.guidance' | i18n }}
                        </small>
                      </div>

                      <div class="operator-action-popup__branding-identity">
                        <label class="operator-action-popup__field">
                          <span>{{ 'operator.configuration.branding.product.name' | i18n }}</span>
                          <input
                            type="text"
                            maxlength="80"
                            autocomplete="organization"
                            [ngModel]="draft.branding.productName"
                            (ngModelChange)="workspace.setConfigurationBranding({ productName: $event })"
                            [disabled]="configurationDisabled()"
                          />
                        </label>
                        <label
                          class="operator-action-popup__field"
                          [class.is-invalid]="brandingLogoCharacterIndexInvalid()"
                        >
                          <span>
                            {{ 'operator.configuration.branding.logo.character.index' | i18n }}
                          </span>
                          <input
                            type="number"
                            min="-1"
                            step="1"
                            [ngModel]="draft.branding.logoCharacterIndex"
                            (ngModelChange)="onBrandingLogoCharacterIndexChange($event)"
                            [disabled]="configurationDisabled()"
                          />
                        </label>
                      </div>

                      <div class="operator-action-popup__select-field operator-action-popup__branding-theme">
                        <span>{{ 'operator.configuration.branding.theme' | i18n }}</span>
                        <app-menu
                          kind="select"
                          [trigger]="configurationThemeTrigger()"
                          [items]="configurationThemeItems()"
                          (itemSelect)="onAction($event)"
                        ></app-menu>
                      </div>

                      <app-menu
                        class="operator-action-popup__section-actions operator-action-popup__branding-actions operator-action-popup__single-action-menu"
                        kind="inline"
                        layout="row"
                        panelMode="anchored"
                        [items]="configurationBrandingActionItems()"
                        (itemSelect)="onAction($event)"
                      ></app-menu>
                    </div>
                    @if (workspace.feedbackAction() === 'save-branding') {
                      @if (workspace.error()) {
                        <p class="operator-action-popup__result is-error" role="alert">
                          <mat-icon>error_outline</mat-icon>
                          <span>{{ workspace.error() | i18n }}</span>
                        </p>
                      } @else if (workspace.notice()) {
                        <p class="operator-action-popup__result is-success" role="status">
                          <mat-icon>check_circle</mat-icon>
                          <span>{{ workspace.notice() | i18n }}</span>
                        </p>
                      }
                    }
                  </section>

                  <section
                    class="operator-action-popup__configuration-group"
                    data-palette="blue"
                  >
                    <header>
                      <span>
                        <small>
                          {{ 'operator.configuration.privacy.contact.eyebrow' | i18n }}
                        </small>
                        <strong>
                          {{ 'operator.configuration.privacy.contact' | i18n }}
                        </strong>
                      </span>
                      <mat-icon>privacy_tip</mat-icon>
                    </header>

                    <p class="operator-action-popup__hint">
                      {{ 'operator.configuration.privacy.contact.guidance' | i18n }}
                    </p>

                    <app-form-flow
                      [model]="configurationPrivacyContactFormModel()"
                      [ngModel]="configurationPrivacyContactFormValue()"
                      (ngModelChange)="onConfigurationPrivacyContactChange($event)"
                      [disabled]="configurationDisabled()"
                    ></app-form-flow>

                    <app-menu
                      class="operator-action-popup__section-actions operator-action-popup__single-action-menu"
                      kind="inline"
                      layout="row"
                      panelMode="anchored"
                      [items]="configurationPrivacyContactActionItems()"
                      (itemSelect)="onAction($event)"
                    ></app-menu>
                    @if (workspace.feedbackAction() === 'save-privacy-contact') {
                      @if (workspace.error()) {
                        <p class="operator-action-popup__result is-error" role="alert">
                          <mat-icon>error_outline</mat-icon>
                          <span>{{ workspace.error() | i18n }}</span>
                        </p>
                      } @else if (workspace.notice()) {
                        <p class="operator-action-popup__result is-success" role="status">
                          <mat-icon>check_circle</mat-icon>
                          <span>{{ workspace.notice() | i18n }}</span>
                        </p>
                      }
                    }
                  </section>

                  <section
                    class="operator-action-popup__configuration-group"
                    data-palette="amber"
                  >
                    <header>
                      <span>
                        <small>{{ 'operator.configuration.admin.eyebrow' | i18n }}</small>
                        <strong>{{ 'operator.configuration.admin' | i18n }}</strong>
                      </span>
                      <mat-icon>admin_panel_settings</mat-icon>
                    </header>

                    <app-form-flow
                      [model]="configurationAdminEmailsFormModel()"
                      [ngModel]="configurationAdminEmailsFormValue()"
                      (ngModelChange)="onConfigurationAdminEmailsChange($event)"
                      [disabled]="configurationDisabled()"
                    ></app-form-flow>

                    <app-menu
                      class="operator-action-popup__section-actions operator-action-popup__single-action-menu"
                      kind="inline"
                      layout="row"
                      panelMode="anchored"
                      [items]="configurationAdminEmailActionItems()"
                      (itemSelect)="onAction($event)"
                    ></app-menu>
                    @if (workspace.feedbackAction() === 'save-admin-emails') {
                      @if (workspace.error()) {
                        <p class="operator-action-popup__result is-error" role="alert">
                          <mat-icon>error_outline</mat-icon>
                          <span>{{ workspace.error() | i18n }}</span>
                        </p>
                      } @else if (workspace.notice()) {
                        <p class="operator-action-popup__result is-success" role="status">
                          <mat-icon>check_circle</mat-icon>
                          <span>{{ workspace.notice() | i18n }}</span>
                        </p>
                      }
                    }
                  </section>

                  <section
                    class="operator-action-popup__configuration-group"
                    data-palette="mint"
                  >
                    <header>
                      <span>
                        <small>{{ 'operator.configuration.social.eyebrow' | i18n }}</small>
                        <strong>{{ 'operator.configuration.social' | i18n }}</strong>
                      </span>
                      <mat-icon>share</mat-icon>
                    </header>

                    <p class="operator-action-popup__hint">
                      {{ 'operator.configuration.social.guidance' | i18n }}
                    </p>

                    <div class="operator-action-popup__social-links">
                      @for (
                        link of workspace.configurationDraft()?.socialLinks ?? [];
                        track $index;
                        let linkIndex = $index
                      ) {
                        <article class="operator-action-popup__social-link">
                          <div class="operator-action-popup__social-link-fields">
                            <label class="operator-action-popup__field">
                              <span>{{ 'operator.configuration.social.provider' | i18n }}</span>
                              <input
                                type="text"
                                maxlength="32"
                                autocomplete="off"
                                [ngModel]="link.provider"
                                (ngModelChange)="setConfigurationSocialLink(
                                  linkIndex,
                                  { provider: $event }
                                )"
                                [disabled]="configurationDisabled()"
                              />
                            </label>

                            <label class="operator-action-popup__field">
                              <span>{{ 'operator.configuration.social.label' | i18n }}</span>
                              <input
                                type="text"
                                maxlength="80"
                                autocomplete="off"
                                [ngModel]="link.label"
                                (ngModelChange)="setConfigurationSocialLink(
                                  linkIndex,
                                  { label: $event }
                                )"
                                [disabled]="configurationDisabled()"
                              />
                            </label>

                            <label class="operator-action-popup__field">
                              <span>{{ 'operator.configuration.social.icon' | i18n }}</span>
                              <input
                                type="text"
                                maxlength="64"
                                autocomplete="off"
                                [placeholder]="'operator.configuration.social.icon.placeholder' | i18n"
                                [ngModel]="link.icon ?? ''"
                                (ngModelChange)="setConfigurationSocialLink(
                                  linkIndex,
                                  { icon: $event || null }
                                )"
                                [disabled]="configurationDisabled()"
                              />
                            </label>

                            <label class="operator-action-popup__field">
                              <span>{{ 'operator.configuration.social.handle' | i18n }}</span>
                              <input
                                type="text"
                                maxlength="80"
                                autocomplete="off"
                                [placeholder]="'operator.configuration.social.handle.placeholder' | i18n"
                                [ngModel]="link.handle ?? ''"
                                (ngModelChange)="setConfigurationSocialLink(
                                  linkIndex,
                                  { handle: $event || null }
                                )"
                                [disabled]="configurationDisabled()"
                              />
                            </label>
                          </div>

                          <app-link-input
                            [config]="socialLinkUrlConfig()"
                            [ngModel]="link.url"
                            (ngModelChange)="setConfigurationSocialLink(
                              linkIndex,
                              { url: $event }
                            )"
                            [disabled]="configurationDisabled()"
                          ></app-link-input>

                          <app-menu
                            class="operator-action-popup__single-action-menu"
                            kind="inline"
                            layout="row"
                            panelMode="anchored"
                            [items]="configurationSocialLinkRemoveItems(linkIndex)"
                            (itemSelect)="onAction($event)"
                          ></app-menu>
                        </article>
                      } @empty {
                        <p class="operator-action-popup__empty">
                          {{ 'operator.configuration.social.empty' | i18n }}
                        </p>
                      }
                    </div>

                    @if (workspace.configurationSocialLinksValidationKey(); as errorKey) {
                      <p class="operator-action-popup__result is-error" role="alert">
                        <mat-icon>error_outline</mat-icon>
                        <span>{{ errorKey | i18n }}</span>
                      </p>
                    }

                    <app-menu
                      class="operator-action-popup__section-actions operator-action-popup__section-actions--social"
                      kind="inline"
                      layout="row"
                      [items]="configurationSocialLinkActionItems()"
                      (itemSelect)="onAction($event)"
                    ></app-menu>
                    @if (workspace.feedbackAction() === 'save-social-links') {
                      @if (workspace.error()) {
                        <p class="operator-action-popup__result is-error" role="alert">
                          <mat-icon>error_outline</mat-icon>
                          <span>{{ workspace.error() | i18n }}</span>
                        </p>
                      } @else if (workspace.notice()) {
                        <p class="operator-action-popup__result is-success" role="status">
                          <mat-icon>check_circle</mat-icon>
                          <span>{{ workspace.notice() | i18n }}</span>
                        </p>
                      }
                    }
                  </section>

                  <section
                    class="operator-action-popup__configuration-group"
                    data-palette="teal"
                  >
                    <header>
                      <span>
                        <small>{{ 'operator.configuration.payment.eyebrow' | i18n }}</small>
                        <strong>{{ 'operator.configuration.payment' | i18n }}</strong>
                      </span>
                      <mat-icon>payments</mat-icon>
                    </header>

                    <div class="operator-action-popup__select-field">
                      <span>{{ 'operator.configuration.payment.provider' | i18n }}</span>
                      <app-menu
                        kind="select"
                        [trigger]="configurationPaymentProviderTrigger()"
                        [items]="configurationPaymentProviderItems()"
                        (itemSelect)="onAction($event)"
                      ></app-menu>
                    </div>

                    @if (draft.payment.providerId) {
                      <div
                        class="operator-action-popup__payment-routing"
                        [class.is-barion]="configurationPaymentIsBarion()"
                      >
                        <app-link-input
                          [config]="configurationPaymentPublicBaseUrlConfig()"
                          [ngModel]="draft.payment.publicBaseUrl"
                          (ngModelChange)="workspace.setConfigurationPayment({
                            publicBaseUrl: $event
                          })"
                          [disabled]="configurationDisabled()"
                        ></app-link-input>

                        @if (configurationPaymentIsBarion()) {
                          <label class="operator-action-popup__field">
                            <span>
                              {{ 'operator.configuration.payment.merchant.account' | i18n }}
                            </span>
                            <input
                              type="email"
                              maxlength="254"
                              autocomplete="email"
                              [placeholder]="
                                'operator.configuration.payment.merchant.account.placeholder'
                                  | i18n
                              "
                              [ngModel]="draft.payment.merchantAccount"
                              (ngModelChange)="workspace.setConfigurationPayment({
                                merchantAccount: $event
                              })"
                              [disabled]="configurationDisabled()"
                            />
                          </label>
                        }
                      </div>
                    }

                    <label class="operator-action-popup__field">
                      <span>{{ 'operator.configuration.payment.credential' | i18n }}</span>
                      <input
                        type="password"
                        autocomplete="new-password"
                        [placeholder]="configuration.payment.credentialMask
                          || ('operator.configuration.credential.placeholder' | i18n)"
                        [ngModel]="draft.payment.credential"
                        (ngModelChange)="workspace.setConfigurationPayment({ credential: $event })"
                        [disabled]="configurationDisabled() || !draft.payment.providerId"
                      />
                    </label>

                    <app-menu
                      class="operator-action-popup__section-actions operator-action-popup__single-action-menu"
                      kind="inline"
                      layout="row"
                      panelMode="anchored"
                      [items]="configurationPaymentActionItems()"
                      (itemSelect)="onAction($event)"
                    ></app-menu>
                    @if (workspace.feedbackAction() === 'register-payment') {
                      @if (workspace.error()) {
                        <p class="operator-action-popup__result is-error" role="alert">
                          <mat-icon>error_outline</mat-icon>
                          <span>{{ workspace.error() | i18n }}</span>
                        </p>
                      } @else if (workspace.notice()) {
                        <p class="operator-action-popup__result is-success" role="status">
                          <mat-icon>check_circle</mat-icon>
                          <span>{{ workspace.notice() | i18n }}</span>
                        </p>
                      }
                    }
                  </section>

                  <section
                    class="operator-action-popup__configuration-group"
                    data-palette="blue"
                  >
                    <header>
                      <span>
                        <small>{{ 'operator.configuration.firebase.eyebrow' | i18n }}</small>
                          <strong>Firebase</strong>
                        </span>
                        <app-menu
                          class="operator-action-popup__header-actions"
                          kind="inline"
                          layout="row"
                          [items]="configurationFirebaseTestActionItems()"
                          (itemSelect)="onAction($event)"
                        ></app-menu>
                      <mat-icon>cloud</mat-icon>
                    </header>

                    @if (workspace.configurationAuthenticationTest(); as result) {
                      <span
                        class="operator-action-popup__sr-only"
                        role="status"
                        aria-live="polite"
                      >
                        {{ 'operator.configuration.test.authentication' | i18n }}:
                        {{ result.message | i18n }}
                      </span>
                    }
                    @if (workspace.configurationMessagingTest(); as result) {
                      <span
                        class="operator-action-popup__sr-only"
                        role="status"
                        aria-live="polite"
                      >
                        {{ 'operator.configuration.test.messaging' | i18n }}:
                        {{ result.message | i18n }}
                      </span>
                    }

                    <div class="operator-action-popup__firebase-public-grid">
                      <label class="operator-action-popup__field">
                        <span>{{ 'operator.configuration.firebase.project.id' | i18n }}</span>
                        <input
                          type="text"
                          maxlength="160"
                          autocomplete="off"
                          [ngModel]="draft.firebase.projectId"
                          (ngModelChange)="workspace.setConfigurationFirebase({ projectId: $event })"
                          [disabled]="configurationDisabled()"
                        />
                      </label>

                      <label class="operator-action-popup__field">
                        <span>{{ 'operator.configuration.firebase.auth.domain' | i18n }}</span>
                        <input
                          type="text"
                          maxlength="253"
                          autocomplete="off"
                          autocapitalize="off"
                          spellcheck="false"
                          placeholder="project-id.firebaseapp.com"
                          [ngModel]="draft.firebase.authDomain"
                          (ngModelChange)="workspace.setConfigurationFirebase({ authDomain: $event })"
                          [disabled]="configurationDisabled()"
                        />
                      </label>

                      <label class="operator-action-popup__field">
                        <span>{{ 'operator.configuration.firebase.storage.bucket' | i18n }}</span>
                        <input
                          type="text"
                          maxlength="512"
                          autocomplete="off"
                          autocapitalize="off"
                          spellcheck="false"
                          [ngModel]="draft.firebase.storageBucket"
                          (ngModelChange)="workspace.setConfigurationFirebase({ storageBucket: $event })"
                          [disabled]="configurationDisabled()"
                        />
                      </label>

                      <label class="operator-action-popup__field">
                        <span>{{ 'operator.configuration.firebase.messaging.sender.id' | i18n }}</span>
                        <input
                          type="text"
                          maxlength="64"
                          autocomplete="off"
                          inputmode="numeric"
                          [ngModel]="draft.firebase.messagingSenderId"
                          (ngModelChange)="workspace.setConfigurationFirebase({ messagingSenderId: $event })"
                          [disabled]="configurationDisabled()"
                        />
                      </label>

                      <label class="operator-action-popup__field">
                        <span>{{ 'operator.configuration.firebase.app.id' | i18n }}</span>
                        <input
                          type="text"
                          maxlength="256"
                          autocomplete="off"
                          autocapitalize="off"
                          spellcheck="false"
                          [ngModel]="draft.firebase.appId"
                          (ngModelChange)="workspace.setConfigurationFirebase({ appId: $event })"
                          [disabled]="configurationDisabled()"
                        />
                      </label>

                      <label class="operator-action-popup__field">
                        <span>{{ 'operator.configuration.firebase.measurement.id' | i18n }}</span>
                        <input
                          type="text"
                          maxlength="64"
                          autocomplete="off"
                          autocapitalize="off"
                          spellcheck="false"
                          [ngModel]="draft.firebase.measurementId"
                          (ngModelChange)="workspace.setConfigurationFirebase({ measurementId: $event })"
                          [disabled]="configurationDisabled()"
                        />
                      </label>
                    </div>

                    <label class="operator-action-popup__field">
                      <span>{{ 'operator.configuration.firebase.api.key' | i18n }}</span>
                      <input
                        type="text"
                        maxlength="256"
                        autocomplete="off"
                        autocapitalize="off"
                        spellcheck="false"
                        [ngModel]="draft.firebase.apiKey"
                        (ngModelChange)="workspace.setConfigurationFirebase({ apiKey: $event })"
                        [disabled]="configurationDisabled()"
                      />
                    </label>

                    <label class="operator-action-popup__field">
                      <span>{{ 'operator.configuration.firebase.vapid.key' | i18n }}</span>
                      <textarea
                        rows="2"
                        maxlength="512"
                        autocomplete="off"
                        autocapitalize="off"
                        spellcheck="false"
                        [ngModel]="draft.firebase.vapidKey"
                        (ngModelChange)="workspace.setConfigurationFirebase({ vapidKey: $event })"
                        [disabled]="configurationDisabled()"
                      ></textarea>
                      <small>
                        {{ 'operator.configuration.firebase.public.guidance' | i18n }}
                      </small>
                    </label>

                    <label class="operator-action-popup__field">
                      <span>{{ 'operator.configuration.firebase.authentication.credential' | i18n }}</span>
                      <textarea
                        rows="3"
                        autocomplete="new-password"
                        [placeholder]="configuration.firebase.authenticationCredentialConfigured
                          ? ('operator.configuration.credential.registered' | i18n)
                          : ('operator.configuration.credential.placeholder' | i18n)"
                        [ngModel]="draft.firebase.authenticationCredential"
                        (ngModelChange)="workspace.setConfigurationFirebase({ authenticationCredential: $event })"
                        [disabled]="configurationDisabled()"
                      ></textarea>
                    </label>

                    <label class="operator-action-popup__field">
                      <span>{{ 'operator.configuration.firebase.messaging.credential' | i18n }}</span>
                      <textarea
                        rows="3"
                        autocomplete="new-password"
                        [placeholder]="configuration.firebase.messagingCredentialConfigured
                          ? ('operator.configuration.credential.registered' | i18n)
                          : ('operator.configuration.credential.placeholder' | i18n)"
                        [ngModel]="draft.firebase.messagingCredential"
                        (ngModelChange)="workspace.setConfigurationFirebase({ messagingCredential: $event })"
                        [disabled]="configurationDisabled()"
                      ></textarea>
                    </label>

                    <label class="operator-action-popup__field">
                      <span>
                        {{ 'operator.configuration.test.messaging.destination' | i18n }}
                      </span>
                      <textarea
                        rows="2"
                        maxlength="4096"
                        autocomplete="off"
                        autocapitalize="off"
                        spellcheck="false"
                        [placeholder]="'operator.configuration.test.messaging.destination.placeholder' | i18n"
                        [ngModel]="workspace.configurationMessagingDestinationToken()"
                        (ngModelChange)="workspace.setConfigurationMessagingDestinationToken($event)"
                        [disabled]="configurationDisabled()"
                      ></textarea>
                      <small>
                        {{ 'operator.configuration.test.messaging.destination.guidance' | i18n }}
                      </small>
                    </label>

                    <app-menu
                      class="operator-action-popup__section-actions"
                      kind="inline"
                      layout="row"
                      [items]="configurationFirebaseSaveActionItems()"
                      (itemSelect)="onAction($event)"
                    ></app-menu>
                    @if (
                      workspace.feedbackAction() === 'register-firebase'
                      || workspace.feedbackAction() === 'activate-firebase'
                    ) {
                      @if (workspace.error()) {
                        <p class="operator-action-popup__result is-error" role="alert">
                          <mat-icon>error_outline</mat-icon>
                          <span>{{ workspace.error() | i18n }}</span>
                        </p>
                      } @else if (workspace.notice()) {
                        <p class="operator-action-popup__result is-success" role="status">
                          <mat-icon>check_circle</mat-icon>
                          <span>{{ workspace.notice() | i18n }}</span>
                        </p>
                      }
                    }
                  </section>
                }
              }
            }
            @case ('revenue') {
              @if (workspace.revenueSync(); as delivery) {
                <article
                  class="operator-action-popup__revenue-delivery"
                  [attr.data-state]="delivery.state"
                  [attr.role]="delivery.state === 'BLOCKED' || delivery.state === 'ERROR'
                    ? 'alert'
                    : 'status'"
                >
                  <header>
                    <mat-icon>{{ revenueSyncStateIcon(delivery.state) }}</mat-icon>
                    <span>
                      <small>{{ 'operator.revenue.delivery' | i18n }}</small>
                      <strong>{{ revenueSyncStateLabel(delivery.state) | i18n }}</strong>
                    </span>
                    <time [attr.datetime]="delivery.synchronizedAtIso">
                      {{ formatDate(delivery.synchronizedAtIso) }}
                    </time>
                  </header>
                  @if (delivery.message) {
                    <p>
                      {{ (delivery.code === 'EXPLORE_MODE'
                        ? 'operator.revenue.delivery.not.sent'
                        : delivery.message) | i18n }}
                    </p>
                  }
                  <dl>
                    <div>
                      <dt>{{ 'operator.revenue.delivery.materialized' | i18n }}</dt>
                      <dd>{{ delivery.materialized }}</dd>
                    </div>
                    <div>
                      <dt>{{ 'operator.revenue.delivery.submitted' | i18n }}</dt>
                      <dd>{{ delivery.submitted }}</dd>
                    </div>
                    <div>
                      <dt>{{ 'operator.revenue.delivery.accepted' | i18n }}</dt>
                      <dd>{{ delivery.accepted }}</dd>
                    </div>
                    <div>
                      <dt>{{ 'operator.revenue.delivery.pending' | i18n }}</dt>
                      <dd>{{ delivery.pending }}</dd>
                    </div>
                    <div>
                      <dt>{{ 'operator.revenue.delivery.blocked' | i18n }}</dt>
                      <dd>{{ delivery.blocked }}</dd>
                    </div>
                  </dl>
                </article>
                @if (delivery.blocked > 0) {
                  <section
                    class="operator-action-popup__revenue-reports"
                    [attr.aria-label]="'operator.revenue.delivery.reports.blocked' | i18n"
                  >
                    <header>
                      <span>
                        <small>{{ 'operator.revenue.delivery.reports' | i18n }}</small>
                        <strong>
                          {{ 'operator.revenue.delivery.reports.blocked' | i18n }}
                        </strong>
                      </span>
                      <b>{{ delivery.blocked }}</b>
                    </header>
                    <app-smart-list
                      #revenueReportsSmartList
                      [config]="revenueReportConfig"
                      [loadPage]="loadRevenueReportPage"
                      [query]="revenueReportQuery()"
                      [itemTemplate]="revenueReportTemplate"
                    ></app-smart-list>

                    <ng-template #revenueReportTemplate let-report>
                      <article class="operator-action-popup__revenue-report">
                        <header>
                          <span class="operator-action-popup__revenue-report-icon">
                            <mat-icon>receipt_long</mat-icon>
                          </span>
                          <span>
                            <small>
                              {{ 'operator.revenue.delivery.report.period' | i18n }}
                            </small>
                            <strong>
                              {{ formatRevenueReportPeriod(report.period) }}
                            </strong>
                          </span>
                          <em>
                            {{ 'operator.revenue.delivery.report.revision' | i18n }}
                            {{ report.revision }}
                          </em>
                        </header>
                        <p>
                          {{ (report.failureMessage
                            || 'operator.revenue.delivery.report.failure.unknown') | i18n }}
                        </p>
                        @if (report.failureCode) {
                          <small class="operator-action-popup__revenue-report-code">
                            {{ report.failureCode }}
                          </small>
                        }
                        <dl>
                          <div>
                            <dt>
                              {{ 'operator.revenue.delivery.report.attempts' | i18n }}
                            </dt>
                            <dd>{{ report.attemptCount }}</dd>
                          </div>
                          <div>
                            <dt>
                              {{ 'operator.revenue.delivery.report.currencies' | i18n }}
                            </dt>
                            <dd>{{ revenueReportCurrencies(report) }}</dd>
                          </div>
                          <div>
                            <dt>
                              {{ 'operator.revenue.delivery.report.failed.at' | i18n }}
                            </dt>
                            <dd>{{ formatDate(report.failedAt || report.updatedAt) }}</dd>
                          </div>
                        </dl>
                        <app-menu
                          kind="inline"
                          layout="row"
                          [items]="revenueReportActionItems(report)"
                          (itemSelect)="onAction($event)"
                        ></app-menu>
                      </article>
                    </ng-template>
                  </section>
                }
              } @else {
                <p class="operator-action-popup__hint">
                  {{ 'operator.revenue.delivery.manual.description' | i18n }}
                </p>
              }
              <section
                class="operator-action-popup__settlements"
                [attr.aria-label]="'operator.revenue.settlement.title' | i18n"
              >
                <header class="operator-action-popup__settlements-header">
                  <span class="operator-action-popup__settlements-icon">
                    <mat-icon>account_balance</mat-icon>
                  </span>
                  <span>
                    <small>{{ 'operator.revenue.settlement.eyebrow' | i18n }}</small>
                    <strong>{{ 'operator.revenue.settlement.title' | i18n }}</strong>
                    <em>{{ 'operator.revenue.settlement.currency.notice' | i18n }}</em>
                  </span>
                  <b>
                    <mat-icon>info</mat-icon>
                    {{ 'operator.revenue.settlement.nonbinding' | i18n }}
                  </b>
                </header>

                @if (workspace.revenueSettlementAvailable() === false) {
                  <p class="operator-action-popup__settlements-unavailable" role="status">
                    <mat-icon>cloud_off</mat-icon>
                    <span>{{ 'operator.revenue.settlement.unavailable' | i18n }}</span>
                  </p>
                } @else if (workspace.revenueSettlementAvailable() === true) {
                  <app-smart-list
                    [config]="settlementConfig"
                    [loadPage]="loadSettlementPage"
                    [query]="settlementQuery()"
                    [itemTemplate]="settlementTemplate"
                  ></app-smart-list>

                  <ng-template #settlementTemplate let-settlement>
                    <article
                      class="operator-action-popup__settlement"
                      [attr.data-trend]="settlementTrend(settlement)"
                    >
                      <header>
                        <span class="operator-action-popup__settlement-period">
                          <small>
                            {{ 'operator.revenue.settlement.period' | i18n }}
                          </small>
                          <strong>
                            {{ formatSettlementPeriod(settlement.period) }}
                          </strong>
                        </span>
                        <span class="operator-action-popup__settlement-currency">
                          {{ settlement.currencyCode }}
                        </span>
                        <span class="operator-action-popup__settlement-revision">
                          {{ 'operator.revenue.settlement.revision' | i18n }}
                          {{ settlement.revision }}
                        </span>
                      </header>

                      <dl class="operator-action-popup__settlement-month">
                        <div>
                          <dt>{{ 'operator.revenue.settlement.monthly.pool' | i18n }}</dt>
                          <dd>
                            {{ formatSettlementMinor(
                              settlement.networkPoolMinor,
                              settlement
                            ) }}
                          </dd>
                        </div>
                        <div>
                          <dt>
                            {{ 'operator.revenue.settlement.monthly.group.allocation' | i18n }}
                          </dt>
                          <dd>
                            {{ formatSettlementMinor(
                              settlement.networkPoolAllocationMinor,
                              settlement
                            ) }}
                          </dd>
                        </div>
                        <div>
                          <dt>{{ 'operator.revenue.settlement.share' | i18n }}</dt>
                          <dd>{{ formatSettlementShare(settlement) }}</dd>
                        </div>
                      </dl>

                      <dl class="operator-action-popup__settlement-valuation">
                        <div>
                          <dt>{{ 'operator.revenue.settlement.ttm.basis' | i18n }}</dt>
                          <dd>
                            {{ formatSettlementMinor(
                              settlement.ttmCommissionBasisMinor,
                              settlement
                            ) }}
                          </dd>
                        </div>
                        <div>
                          <dt>{{ 'operator.revenue.settlement.ttm.pool' | i18n }}</dt>
                          <dd>
                            {{ formatSettlementMinor(
                              settlement.ttmNetworkCommissionPoolMinor,
                              settlement
                            ) }}
                          </dd>
                        </div>
                        <div>
                          <dt>
                            {{ 'operator.revenue.settlement.indicative.network.value' | i18n }}
                          </dt>
                          <dd>
                            {{ formatSettlementMinor(
                              settlement.indicativeNetworkValueMinor,
                              settlement
                            ) }}
                          </dd>
                        </div>
                        <div>
                          <dt>
                            {{ 'operator.revenue.settlement.indicative.group.allocation' | i18n }}
                          </dt>
                          <dd>
                            {{ formatSettlementMinor(
                              settlement.indicativeValueAllocationMinor,
                              settlement
                            ) }}
                          </dd>
                        </div>
                      </dl>

                      <dl class="operator-action-popup__settlement-trend">
                        <div>
                          <dt>{{ 'operator.revenue.settlement.average.earlier' | i18n }}</dt>
                          <dd>
                            {{ formatSettlementMinor(
                              settlement.earlierThreeMonthAverageMinor,
                              settlement
                            ) }}
                          </dd>
                        </div>
                        <div>
                          <dt>{{ 'operator.revenue.settlement.average.prior' | i18n }}</dt>
                          <dd>
                            {{ formatSettlementMinor(
                              settlement.priorThreeMonthAverageMinor,
                              settlement
                            ) }}
                          </dd>
                        </div>
                        <div>
                          <dt>{{ 'operator.revenue.settlement.average.recent' | i18n }}</dt>
                          <dd>
                            {{ formatSettlementMinor(
                              settlement.recentThreeMonthAverageMinor,
                              settlement
                            ) }}
                          </dd>
                        </div>
                        <div>
                          <dt>{{ 'operator.revenue.settlement.growth.prior' | i18n }}</dt>
                          <dd>
                            {{ formatSettlementBasisPoints(
                              settlement.priorGrowthBasisPoints,
                              true
                            ) }}
                          </dd>
                        </div>
                        <div>
                          <dt>{{ 'operator.revenue.settlement.growth.recent' | i18n }}</dt>
                          <dd>
                            {{ formatSettlementBasisPoints(
                              settlement.recentGrowthBasisPoints,
                              true
                            ) }}
                          </dd>
                        </div>
                        <div>
                          <dt>{{ 'operator.revenue.settlement.acceleration' | i18n }}</dt>
                          <dd>
                            {{ formatSettlementBasisPoints(
                              settlement.accelerationBasisPoints,
                              true
                            ) }}
                          </dd>
                        </div>
                        <div>
                          <dt>{{ 'operator.revenue.settlement.adjustment' | i18n }}</dt>
                          <dd>
                            {{ formatSettlementBasisPoints(
                              settlement.valuationAdjustmentBasisPoints,
                              true
                            ) }}
                          </dd>
                        </div>
                        <div>
                          <dt>{{ 'operator.revenue.settlement.multiplier' | i18n }}</dt>
                          <dd>
                            {{ formatSettlementMultiplier(
                              settlement.effectiveValuationMultiplierBasisPoints
                            ) }}
                          </dd>
                        </div>
                      </dl>

                      <footer>
                        <span>
                          {{ 'operator.revenue.settlement.ruleset' | i18n }}:
                          <strong>{{ settlement.valuationRulesetVersion }}</strong>
                        </span>
                        <span>
                          {{ 'operator.revenue.settlement.accepted' | i18n }}:
                          <strong>{{ formatDate(settlement.acceptedAtIso) }}</strong>
                        </span>
                      </footer>
                    </article>
                  </ng-template>
                }
              </section>
              @if (workspace.revenue(); as revenue) {
                <app-operator-revenue-view [revenue]="revenue"></app-operator-revenue-view>
              }
            }
            @case ('deployments') {
              @if (menu.selectedLeaderboardEntry(); as entry) {
                <section
                  class="operator-action-popup__deployments"
                  [attr.aria-label]="'operator.leaderboard.deployments.title' | i18n"
                >
                  <header class="operator-action-popup__deployment-summary">
                    <span class="operator-action-popup__deployment-summary-icon">
                      <mat-icon>hub</mat-icon>
                    </span>
                    <span>
                      <small>
                        {{ 'operator.leaderboard.network' | i18n }}
                      </small>
                      <strong>
                        {{ entry.deploymentCount || 0 }}
                        {{ ((entry.deploymentCount || 0) === 1
                          ? 'operator.leaderboard.deployment'
                          : 'operator.leaderboard.deployments') | i18n }}
                      </strong>
                    </span>
                    @if (entry.eligibilityStatus !== 'ACTIVE') {
                      <span
                        class="operator-action-popup__deployment-eligibility"
                        [attr.data-status]="entry.eligibilityStatus"
                      >
                        <mat-icon>
                          {{ entry.eligibilityStatus === 'SUSPENDED'
                            ? 'pause_circle'
                            : entry.eligibilityStatus === 'PARTIALLY_SUSPENDED'
                              ? 'warning'
                              : 'gpp_maybe' }}
                        </mat-icon>
                        {{ claimEligibilityLabel(entry.eligibilityStatus) }}
                      </span>
                    }
                    <b
                      [attr.title]="'operator.leaderboard.share' | i18n"
                    >
                      {{ formatShare(entry.sharePercent) }}%
                    </b>
                  </header>

                  <app-smart-list
                    class="operator-action-popup__deployment-list"
                    [config]="leaderboardDeploymentConfig"
                    [loadPage]="loadLeaderboardDeploymentPage"
                    [query]="leaderboardDeploymentQuery()"
                    [itemTemplate]="leaderboardDeploymentTemplate"
                  ></app-smart-list>

                  <ng-template
                    #leaderboardDeploymentTemplate
                    let-deployment
                  >
                    <single-row
                      [row]="leaderboardDeploymentRow(deployment)"
                    ></single-row>
                  </ng-template>
                </section>
              }
            }
            @case ('community') {
              @if (workspace.community(); as community) {
                <div class="operator-action-popup__community">
                  <span class="operator-action-popup__presence" [attr.data-state]="community.availability"></span>
                  <span>
                    <small>{{ 'operator.community.current' | i18n }}</small>
                    <strong>
                      {{ ('operator.community.' + community.availability.toLowerCase()) | i18n }}
                    </strong>
                  </span>
                </div>
                @if (community.providers.length > 0) {
                  <div class="operator-action-popup__providers">
                    @for (provider of community.providers; track provider.id) {
                      <article class="operator-action-popup__provider">
                        <span class="operator-action-popup__provider-icon">
                          <mat-icon>forum</mat-icon>
                        </span>
                        <span class="operator-action-popup__provider-copy">
                          <strong>{{ provider.name }}</strong>
                          <small>{{ provider.purpose | i18n }}</small>
                        </span>
                        @if (provider.available && safeExternalUrl(provider.url); as providerUrl) {
                          <a
                            class="operator-action-popup__provider-link"
                            [href]="providerUrl"
                            target="_blank"
                            rel="noopener noreferrer"
                            [attr.aria-label]="('operator.community.provider.open' | i18n) + ' ' + provider.name"
                          >
                            <span>{{ 'operator.community.provider.join' | i18n }}</span>
                            <mat-icon>open_in_new</mat-icon>
                          </a>
                        }
                      </article>
                    }
                  </div>
                } @else {
                  <p class="operator-action-popup__hint">
                    {{ 'operator.community.providers.empty' | i18n }}
                  </p>
                }
                @if (community.announcements.length > 0) {
                  <section class="operator-action-popup__announcements">
                    <h3>{{ 'operator.community.announcements' | i18n }}</h3>
                    @for (announcement of community.announcements; track announcement.id) {
                      <article
                        class="operator-action-popup__announcement"
                        [attr.data-severity]="announcement.severity"
                      >
                        <header>
                          <span>
                            <small>
                              {{ ('operator.community.announcement.kind.'
                                + announcement.kind.toLowerCase()) | i18n }}
                            </small>
                            <strong>{{ announcement.title | i18n }}</strong>
                          </span>
                          <span class="operator-action-popup__announcement-badges">
                            @if (announcement.unread) {
                              <i
                                [attr.aria-label]="'operator.community.announcement.unread' | i18n"
                                [attr.title]="'operator.community.announcement.unread' | i18n"
                              ></i>
                            }
                            <em [attr.data-severity]="announcement.severity">
                              {{ ('operator.community.announcement.severity.'
                                + announcement.severity.toLowerCase()) | i18n }}
                            </em>
                            <b [attr.data-status]="announcement.status">
                              {{ ('operator.community.announcement.status.'
                                + announcement.status.toLowerCase()) | i18n }}
                            </b>
                          </span>
                        </header>
                        <p>{{ announcement.body | i18n }}</p>
                        <small class="operator-action-popup__announcement-date">
                          {{ 'operator.community.announcement.published' | i18n }}
                          {{ formatDate(announcement.publishedAt) }}
                          @if (announcement.expiresAt) {
                            \xB7
                            {{ 'operator.community.announcement.expires' | i18n }}
                            {{ formatDate(announcement.expiresAt) }}
                          }
                        </small>
                        @if (announcement.links.length > 0 || announcement.update) {
                          <details class="operator-action-popup__announcement-details">
                            <summary>
                              <mat-icon>expand_more</mat-icon>
                              <span>{{ 'operator.community.announcement.details' | i18n }}</span>
                            </summary>
                            <div class="operator-action-popup__announcement-detail-body">
                        @if (announcement.links.length > 0) {
                              <nav class="operator-action-popup__announcement-links">
                            @for (link of announcement.links; track link.id) {
                              @if (safeExternalUrl(link.url); as linkUrl) {
                                <a
                                  [href]="linkUrl"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  @if (link.verified) {
                                    <mat-icon>verified</mat-icon>
                                  }
                                  <span>{{ link.label | i18n }}</span>
                                  <mat-icon>open_in_new</mat-icon>
                                </a>
                              }
                            }
                              </nav>
                        }
                        @if (announcement.update; as release) {
                          <section class="operator-action-popup__release">
                            <header>
                              <span>
                                <small>{{ 'operator.community.announcement.version' | i18n }}</small>
                                <strong>v{{ release.version }}</strong>
                              </span>
                            </header>
                            <p>{{ release.purpose | i18n }}</p>
                            <ul>
                              @for (note of release.releaseNotes; track note) {
                                <li>{{ note | i18n }}</li>
                              }
                            </ul>
                            <dl>
                              <div>
                                <dt>{{ 'operator.community.announcement.artifact.size' | i18n }}</dt>
                                <dd>{{ formatBytes(release.artifact.sizeBytes) }}</dd>
                              </div>
                              <div>
                                <dt>{{ 'operator.community.announcement.artifact.compatibility' | i18n }}</dt>
                                <dd>{{ release.artifact.compatibility | i18n }}</dd>
                              </div>
                              <div>
                                <dt>SHA-256</dt>
                                <dd><code>{{ release.artifact.sha256Digest }}</code></dd>
                              </div>
                              <div>
                                <dt>{{ 'operator.community.announcement.artifact.signing.key' | i18n }}</dt>
                                <dd><code>{{ release.artifact.packageSigningKeyId }}</code></dd>
                              </div>
                              <div>
                                <dt>{{ 'operator.community.announcement.artifact.signature' | i18n }}</dt>
                                <dd><code>{{ release.artifact.signature }}</code></dd>
                              </div>
                              <div>
                                <dt>{{ 'operator.community.announcement.artifact.signature.status' | i18n }}</dt>
                                <dd
                                  class="operator-action-popup__signature-state"
                                  [attr.data-verified]="release.artifact.signatureVerified"
                                >
                                  <mat-icon>
                                    {{ release.artifact.signatureVerified ? 'verified_user' : 'gpp_maybe' }}
                                  </mat-icon>
                                  <span>
                                    {{ (release.artifact.signatureVerified
                                      ? 'operator.community.announcement.artifact.signature.verified'
                                      : 'operator.community.announcement.artifact.signature.unverified') | i18n }}
                                  </span>
                                </dd>
                              </div>
                            </dl>
                            <div class="operator-action-popup__download">
                              <span>
                                <small>{{ 'operator.community.announcement.download' | i18n }}</small>
                                <code>{{ release.artifact.downloadUrl }}</code>
                              </span>
                              @if (safeExternalUrl(release.artifact.downloadUrl); as downloadUrl) {
                                @if (release.artifact.downloadUrlVerified) {
                                  <a
                                    [href]="downloadUrl"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    [attr.aria-label]="'operator.community.announcement.download.open' | i18n"
                                  >
                                    <mat-icon>verified</mat-icon>
                                    <span>{{ 'operator.community.announcement.download.verified' | i18n }}</span>
                                    <mat-icon>open_in_new</mat-icon>
                                  </a>
                                } @else {
                                  <span class="operator-action-popup__download-unverified">
                                    <mat-icon>gpp_maybe</mat-icon>
                                    {{ 'operator.community.announcement.download.unverified' | i18n }}
                                  </span>
                                }
                              } @else {
                                <span class="operator-action-popup__download-unverified">
                                  <mat-icon>gpp_maybe</mat-icon>
                                  {{ 'operator.community.announcement.download.unverified' | i18n }}
                                </span>
                              }
                            </div>
                          </section>
                        }
                            </div>
                          </details>
                        }
                      </article>
                    }
                  </section>
                }
              }
            }
          }

          @if (
            activeKind !== 'configuration'
            && activeKind !== 'deployments'
          ) {
            @if (workspace.error()) {
              <p class="operator-action-popup__result is-error" role="alert">
                <mat-icon>error_outline</mat-icon>
                <span>{{ workspace.error() | i18n }}</span>
              </p>
            }
            @if (
              workspace.notice()
              && !(
                activeKind === 'claim'
                && (
                  workspace.claimStatus()?.verificationStatus === 'PENDING_REVIEW'
                  || workspace.claimStatus()?.verificationStatus === 'REJECTED'
                )
              )
            ) {
              <p class="operator-action-popup__result is-success" role="status">
                <mat-icon>check_circle</mat-icon>
                <span>{{ workspace.notice() | i18n }}</span>
              </p>
            }
          }

          @if (actionItems().length > 0) {
            <app-menu
              class="operator-action-popup__actions"
              kind="inline"
              layout="row"
              [items]="actionItems()"
              (itemSelect)="onAction($event)"
            ></app-menu>
          }

        }
      </section>
    </app-popup>
  }
}
`, styles: ['/* src/app/operator/components/operator-action-popup/operator-action-popup.component.scss */\n:host {\n  display: contents;\n}\n.operator-action-popup {\n  position: relative;\n  min-height: 150px;\n  display: grid;\n  gap: 0.85rem;\n  color: #243853;\n}\n.operator-action-popup--loading {\n  min-height: 100%;\n  flex: 1 1 auto;\n}\n.operator-action-popup--deployments {\n  height: 100%;\n  min-height: 0;\n  grid-template-rows: minmax(0, 1fr);\n}\n.operator-action-popup__loading {\n  min-height: 180px;\n  display: grid;\n  place-items: center;\n  align-content: center;\n  gap: 0.55rem;\n  color: rgba(36, 56, 83, 0.7);\n  font-size: 0.78rem;\n  font-weight: 900;\n  text-align: center;\n}\n.operator-action-popup--loading .operator-action-popup__loading {\n  min-height: 100%;\n}\n.operator-action-popup__summary {\n  padding: 0.75rem;\n  border-radius: 14px;\n  background: #f1f8f7;\n  display: grid;\n  grid-template-columns: auto 1fr 1fr;\n  align-items: center;\n  gap: 0.7rem;\n}\n.operator-action-popup__summary > .mat-icon {\n  color: #168071;\n}\n.operator-action-popup__summary span {\n  min-width: 0;\n  display: grid;\n  gap: 0.08rem;\n}\n.operator-action-popup__summary small {\n  color: rgba(36, 56, 83, 0.58);\n  font-size: 0.66rem;\n  font-weight: 800;\n}\n.operator-action-popup__summary strong {\n  font-size: 0.86rem;\n}\n.operator-action-popup__hint {\n  margin: 0;\n  color: rgba(36, 56, 83, 0.72);\n  font-size: 0.76rem;\n  font-weight: 700;\n  line-height: 1.45;\n}\n.operator-action-popup__configuration-group {\n  --operator-configuration-accent: #396da9;\n  --operator-configuration-border: rgba(58, 108, 168, 0.28);\n  --operator-configuration-surface:\n    linear-gradient(\n      180deg,\n      #f2f7ff 0%,\n      #e8f0fb 100%);\n  --operator-configuration-label-size: 0.84rem;\n  --form-flow-label-font-size: var(--operator-configuration-label-size);\n  --link-input-label-font-size: var(--operator-configuration-label-size);\n  min-width: 0;\n  padding: 0.68rem;\n  border: 1px solid var(--operator-configuration-border);\n  border-radius: 12px;\n  background: var(--operator-configuration-surface);\n  display: grid;\n  gap: 0.58rem;\n}\n.operator-action-popup__configuration-group[data-palette=violet] {\n  --operator-configuration-accent: #6743a4;\n  --operator-configuration-border: rgba(128, 83, 209, 0.3);\n  --operator-configuration-surface:\n    linear-gradient(\n      \n      180deg,\n      rgba(249, 246, 255, 0.96) 0%,\n      rgba(239, 232, 255, 0.98) 100% );\n}\n.operator-action-popup__configuration-group[data-palette=teal] {\n  --operator-configuration-accent: #14717d;\n  --operator-configuration-border: rgba(40, 148, 164, 0.3);\n  --operator-configuration-surface:\n    linear-gradient(\n      \n      180deg,\n      rgba(237, 251, 253, 0.96) 0%,\n      rgba(218, 246, 249, 0.98) 100% );\n}\n.operator-action-popup__configuration-group[data-palette=blue] {\n  --operator-configuration-accent: #396da9;\n  --operator-configuration-border: rgba(58, 108, 168, 0.28);\n  --operator-configuration-surface:\n    linear-gradient(\n      180deg,\n      #f2f7ff 0%,\n      #e8f0fb 100%);\n}\n.operator-action-popup__configuration-group[data-palette=amber] {\n  --operator-configuration-accent: #966015;\n  --operator-configuration-border: rgba(194, 126, 30, 0.3);\n  --operator-configuration-surface:\n    linear-gradient(\n      \n      180deg,\n      rgba(255, 250, 237, 0.98) 0%,\n      rgba(255, 240, 207, 0.98) 100% );\n}\n.operator-action-popup__configuration-group[data-palette=mint] {\n  --operator-configuration-accent: #1a765d;\n  --operator-configuration-border: rgba(36, 147, 114, 0.3);\n  --operator-configuration-surface:\n    linear-gradient(\n      \n      180deg,\n      rgba(239, 252, 247, 0.98) 0%,\n      rgba(220, 247, 237, 0.98) 100% );\n}\n.operator-action-popup__configuration-group > header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n}\n.operator-action-popup__configuration-group > header > span {\n  display: grid;\n  gap: 0.04rem;\n}\n.operator-action-popup__configuration-group > header > span:first-child {\n  margin-right: auto;\n}\n.operator-action-popup__field > span,\n.operator-action-popup__select-field > span,\n.operator-action-popup__logo-field > span {\n  color: rgba(36, 56, 83, 0.82);\n  font-size: var(--operator-configuration-label-size);\n  font-weight: 850;\n  line-height: 1;\n}\n.operator-action-popup__configuration-group > header small {\n  color: color-mix(in srgb, var(--operator-configuration-accent), #243853 25%);\n  font-size: 0.64rem;\n  font-weight: 850;\n}\n.operator-action-popup__configuration-group > header strong {\n  color: var(--operator-configuration-accent);\n  font-size: 0.82rem;\n}\n.operator-action-popup__configuration-group > header .mat-icon {\n  width: 19px;\n  height: 19px;\n  color: var(--operator-configuration-accent);\n  font-size: 19px;\n}\n.operator-action-popup__branding-editor {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.58rem;\n}\n.operator-action-popup__branding-editor {\n  grid-template-columns: minmax(260px, 360px) minmax(0, 1fr);\n  grid-template-rows: auto auto minmax(40px, 1fr);\n  align-items: start;\n}\n.operator-action-popup__branding-identity {\n  grid-column: 2;\n  grid-row: 1;\n  min-width: 0;\n  display: grid;\n  grid-template-columns: minmax(0, 1.65fr) minmax(140px, 0.85fr);\n  gap: 0.58rem;\n}\n.operator-action-popup__branding-theme {\n  grid-column: 2;\n  grid-row: 2;\n}\n.operator-action-popup__branding-actions {\n  grid-column: 2;\n  grid-row: 3;\n  align-self: end;\n}\n.operator-action-popup__field,\n.operator-action-popup__select-field,\n.operator-action-popup__logo-field {\n  min-width: 0;\n  display: grid;\n  gap: 0.2rem;\n}\n.operator-action-popup__field input,\n.operator-action-popup__field textarea {\n  box-sizing: border-box;\n  width: 100%;\n  min-height: 38px;\n  border: 1px solid rgba(62, 83, 119, 0.22);\n  border-radius: 9px;\n  padding: 0.55rem 0.58rem;\n  background: #fff;\n  color: #243853;\n  font: inherit;\n  font-size: 0.72rem;\n  line-height: 1.4;\n  resize: vertical;\n}\n.operator-action-popup__field input:disabled,\n.operator-action-popup__field textarea:disabled {\n  background: #f0f3f7;\n  color: rgba(36, 56, 83, 0.58);\n}\n.operator-action-popup__field > span {\n  display: flex;\n  align-items: baseline;\n  justify-content: space-between;\n  gap: 0.4rem;\n}\n.operator-action-popup__field > span small {\n  font-size: 0.58rem;\n  font-weight: 750;\n}\n.operator-action-popup__field > small {\n  color: rgba(36, 56, 83, 0.58);\n  font-size: 0.6rem;\n  font-weight: 750;\n  line-height: 1.3;\n}\n.operator-action-popup__field.is-invalid input {\n  border-color: rgba(180, 52, 72, 0.56);\n  background: #fff4f5;\n}\n.operator-action-popup__field.is-invalid > small {\n  color: #9b3447;\n}\n.operator-action-popup__field.is-wide {\n  grid-column: 1/-1;\n}\n.operator-action-popup__select-field app-menu {\n  min-width: 0;\n  width: 100%;\n}\n.operator-action-popup__section-actions {\n  min-width: 0;\n  width: max-content;\n  max-width: 100%;\n  margin-top: 0.08rem;\n  justify-self: start;\n  --app-menu-action-flex: 0 1 auto;\n  --app-menu-action-min-width: 0;\n}\n.operator-action-popup__section-actions--social {\n  width: max-content;\n  max-width: 100%;\n}\n.operator-action-popup__tls-grid {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  align-items: end;\n  gap: 0.58rem;\n}\n.operator-action-popup__tls-header {\n  display: grid !important;\n  grid-template-columns: minmax(0, 1fr) auto auto;\n  grid-template-areas: "title tests toggle";\n  align-items: center !important;\n  gap: 0.45rem 0.7rem !important;\n}\n.operator-action-popup__tls-title {\n  grid-area: title;\n}\n.operator-action-popup__tls-toggle-wrap {\n  grid-area: toggle;\n  display: inline-flex;\n  justify-self: end;\n  min-width: 0;\n}\n.operator-action-popup__on-off-toggle {\n  min-width: 82px;\n  min-height: 38px;\n  padding: 0.3rem 0.62rem;\n  border-radius: 999px;\n  border: 1px solid rgba(128, 149, 176, 0.24);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.4rem;\n  color: #5b6e8e;\n  background:\n    linear-gradient(\n      180deg,\n      #f4f7fb 0%,\n      #e9eff7 100%);\n  font-size: 0.76rem;\n  font-weight: 800;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n  box-shadow: 0 2px 7px rgba(29, 53, 86, 0.08);\n  cursor: pointer;\n}\n.operator-action-popup__on-off-toggle.is-on {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf8ee 0%,\n      #ddf1e2 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.operator-action-popup__on-off-toggle:disabled {\n  cursor: default;\n  opacity: 0.58;\n  pointer-events: none;\n  filter: grayscale(0.35);\n  box-shadow: none;\n}\n.operator-action-popup__on-off-toggle mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.operator-action-popup__tls-test-actions {\n  grid-area: tests;\n  justify-self: end;\n  width: 340px !important;\n  max-width: 100%;\n  --app-menu-row-width: 100%;\n  --app-menu-action-flex: 1 1 0;\n  --app-menu-action-min-width: 0;\n}\n.operator-action-popup__tls-source-controls {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.42rem;\n}\n.operator-action-popup__tls-renewal-toggle {\n  flex: 0 0 auto;\n  justify-self: end;\n}\n.operator-action-popup__firebase-public-grid {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.58rem;\n}\n.operator-action-popup__social-links {\n  min-width: 0;\n  display: grid;\n  gap: 0.55rem;\n}\n.operator-action-popup__social-link {\n  min-width: 0;\n  padding: 0.58rem;\n  border: 1px solid color-mix(in srgb, var(--operator-configuration-accent) 24%, transparent);\n  border-radius: 10px;\n  background: rgba(255, 255, 255, 0.72);\n  display: grid;\n  gap: 0.5rem;\n}\n.operator-action-popup__social-link-fields {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 0.5rem;\n}\n.operator-action-popup__social-link app-link-input {\n  min-width: 0;\n  width: 100%;\n}\n.operator-action-popup__payment-routing {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: minmax(0, 1fr);\n  gap: 0.5rem;\n}\n.operator-action-popup__payment-routing.is-barion {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n.operator-action-popup__payment-routing app-link-input {\n  min-width: 0;\n  width: 100%;\n}\n.operator-action-popup__social-link app-menu {\n  justify-self: start;\n}\n.operator-action-popup__empty {\n  margin: 0;\n  padding: 0.72rem;\n  border: 1px dashed var(--operator-configuration-border);\n  border-radius: 10px;\n  color: rgba(36, 56, 83, 0.68);\n  background: rgba(255, 255, 255, 0.48);\n  font-size: 0.72rem;\n  font-weight: 750;\n}\n.operator-action-popup__logo-field app-image-carousel {\n  width: 100%;\n  max-width: none;\n}\n.operator-action-popup__branding-editor .operator-action-popup__logo-field {\n  grid-column: 1;\n  grid-row: 1/span 3;\n  align-self: stretch;\n  min-height: 0;\n  grid-template-rows: auto minmax(148px, 1fr) auto;\n}\n.operator-action-popup__branding-editor .operator-action-popup__logo-field app-image-carousel {\n  height: 100%;\n  min-height: 148px;\n  --image-single-slot-height: 100%;\n  --image-single-slot-content-flex: 1 1 auto;\n  --image-single-slot-content-width: 100%;\n  --image-single-slot-aspect-ratio: auto;\n}\n.operator-action-popup__media-guidance {\n  color: rgba(36, 56, 83, 0.68);\n  font-size: 0.74rem;\n  font-weight: 700;\n  line-height: 1.25;\n}\n.operator-action-popup__header-actions {\n  min-width: 0;\n  width: min(100%, 280px);\n}\n.operator-action-popup__sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  margin: -1px;\n  padding: 0;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}\n.operator-action-popup__update-progress {\n  padding: 0.7rem;\n  border: 1px solid rgba(22, 128, 113, 0.18);\n  border-radius: 12px;\n  background: #f1f8f7;\n  display: grid;\n  gap: 0.42rem;\n}\n.operator-action-popup__update-progress[data-phase=FAILED] {\n  border-color: rgba(185, 49, 71, 0.22);\n  background: #fff0f3;\n  color: #9b3447;\n}\n.operator-action-popup__update-progress[data-phase=COMPLETED] {\n  background: #eaf8f2;\n  color: #146b54;\n}\n.operator-action-popup__update-progress-header {\n  display: grid;\n  grid-template-columns: auto 1fr auto;\n  align-items: center;\n  gap: 0.42rem;\n  font-size: 0.72rem;\n}\n.operator-action-popup__update-progress-header .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.operator-action-popup__update-progress progress {\n  width: 100%;\n  height: 7px;\n  overflow: hidden;\n  border: 0;\n  border-radius: 999px;\n  accent-color: #168071;\n}\n.operator-action-popup__update-progress small,\n.operator-action-popup__update-progress > span:last-child {\n  color: rgba(36, 56, 83, 0.62);\n  font-size: 0.65rem;\n  font-weight: 750;\n}\n.operator-action-popup__claim-paths,\n.operator-action-popup app-form-flow {\n  min-width: 0;\n  width: 100%;\n}\n.operator-action-popup__claim-review {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: start;\n  gap: 0.55rem;\n}\n.operator-action-popup__claim-review .operator-action-popup__result {\n  min-width: 0;\n}\n.operator-action-popup__claim-share {\n  min-height: 28px;\n  padding: 0.25rem 0.52rem;\n  border: 1px solid rgba(183, 95, 47, 0.3);\n  border-radius: 999px;\n  background: #fff7e7;\n  color: #946114;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n  font-size: 0.72rem;\n  font-weight: 900;\n  white-space: nowrap;\n}\n.operator-action-popup__claim-share .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.operator-action-popup__revenue-delivery {\n  --operator-delivery-accent: #52657b;\n  --operator-delivery-surface: #f2f5f8;\n  min-width: 0;\n  padding: 0.68rem;\n  border: 1px solid color-mix(in srgb, var(--operator-delivery-accent) 22%, transparent);\n  border-radius: 12px;\n  background: var(--operator-delivery-surface);\n  display: grid;\n  gap: 0.48rem;\n}\n.operator-action-popup__revenue-delivery[data-state=SYNCHRONIZED] {\n  --operator-delivery-accent: #187258;\n  --operator-delivery-surface: #edf8f3;\n}\n.operator-action-popup__revenue-delivery[data-state=PENDING],\n.operator-action-popup__revenue-delivery[data-state=BUSY] {\n  --operator-delivery-accent: #946114;\n  --operator-delivery-surface: #fff8e9;\n}\n.operator-action-popup__revenue-delivery[data-state=BLOCKED],\n.operator-action-popup__revenue-delivery[data-state=ERROR] {\n  --operator-delivery-accent: #9b3447;\n  --operator-delivery-surface: #fff1f4;\n}\n.operator-action-popup__revenue-delivery > header {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.45rem;\n  color: var(--operator-delivery-accent);\n}\n.operator-action-popup__revenue-delivery > header > .mat-icon {\n  width: 19px;\n  height: 19px;\n  font-size: 19px;\n}\n.operator-action-popup__revenue-delivery > header > span {\n  min-width: 0;\n  display: grid;\n  gap: 0.04rem;\n}\n.operator-action-popup__revenue-delivery > header small,\n.operator-action-popup__revenue-delivery > header time {\n  color: rgba(36, 56, 83, 0.58);\n  font-size: 0.64rem;\n  font-weight: 800;\n}\n.operator-action-popup__revenue-delivery > header strong {\n  font-size: 0.8rem;\n}\n.operator-action-popup__revenue-delivery > header time {\n  white-space: nowrap;\n}\n.operator-action-popup__revenue-delivery > p {\n  margin: 0;\n  color: rgba(36, 56, 83, 0.76);\n  font-size: 0.7rem;\n  font-weight: 720;\n  line-height: 1.4;\n  overflow-wrap: anywhere;\n}\n.operator-action-popup__revenue-delivery dl {\n  margin: 0;\n  display: grid;\n  grid-template-columns: repeat(5, minmax(0, 1fr));\n  gap: 0.34rem;\n}\n.operator-action-popup__revenue-delivery dl > div {\n  min-width: 0;\n  padding: 0.38rem 0.42rem;\n  border-radius: 9px;\n  background: rgba(255, 255, 255, 0.72);\n  display: grid;\n  gap: 0.06rem;\n}\n.operator-action-popup__revenue-delivery dt {\n  color: rgba(36, 56, 83, 0.56);\n  font-size: 0.6rem;\n  font-weight: 800;\n  overflow-wrap: anywhere;\n}\n.operator-action-popup__revenue-delivery dd {\n  margin: 0;\n  color: var(--operator-delivery-accent);\n  font-size: 0.8rem;\n  font-weight: 950;\n  font-variant-numeric: tabular-nums;\n}\n.operator-action-popup__revenue-reports {\n  min-width: 0;\n  padding: 0.62rem;\n  border: 1px solid rgba(155, 52, 71, 0.18);\n  border-radius: 12px;\n  background: #fff8fa;\n  display: grid;\n  gap: 0.5rem;\n}\n.operator-action-popup__revenue-reports > header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n}\n.operator-action-popup__revenue-reports > header > span {\n  min-width: 0;\n  display: grid;\n  gap: 0.04rem;\n}\n.operator-action-popup__revenue-reports > header small {\n  color: rgba(36, 56, 83, 0.56);\n  font-size: 0.62rem;\n  font-weight: 800;\n}\n.operator-action-popup__revenue-reports > header strong {\n  color: #9b3447;\n  font-size: 0.8rem;\n}\n.operator-action-popup__revenue-reports > header b {\n  min-width: 28px;\n  min-height: 28px;\n  padding: 0 0.42rem;\n  border-radius: 999px;\n  background: #ffe5eb;\n  color: #9b3447;\n  display: grid;\n  place-items: center;\n  font-size: 0.72rem;\n  font-variant-numeric: tabular-nums;\n}\n.operator-action-popup__revenue-reports app-smart-list {\n  min-width: 0;\n  width: 100%;\n}\n.operator-action-popup__revenue-report {\n  min-width: 0;\n  padding: 0.56rem;\n  border: 1px solid rgba(155, 52, 71, 0.14);\n  border-radius: 10px;\n  background: #fff;\n  display: grid;\n  gap: 0.38rem;\n}\n.operator-action-popup__revenue-report > header {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.42rem;\n}\n.operator-action-popup__revenue-report-icon {\n  width: 30px;\n  height: 30px;\n  border-radius: 9px;\n  background: #ffe8ed;\n  color: #9b3447;\n  display: grid;\n  place-items: center;\n}\n.operator-action-popup__revenue-report-icon .mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n}\n.operator-action-popup__revenue-report > header > span:nth-child(2) {\n  min-width: 0;\n  display: grid;\n  gap: 0.03rem;\n}\n.operator-action-popup__revenue-report > header small,\n.operator-action-popup__revenue-report dt {\n  color: rgba(36, 56, 83, 0.55);\n  font-size: 0.6rem;\n  font-weight: 800;\n}\n.operator-action-popup__revenue-report > header strong {\n  color: #314762;\n  font-size: 0.76rem;\n}\n.operator-action-popup__revenue-report > header em {\n  padding: 0.2rem 0.4rem;\n  border-radius: 999px;\n  background: #fff0f3;\n  color: #9b3447;\n  font-size: 0.62rem;\n  font-style: normal;\n  font-weight: 900;\n  white-space: nowrap;\n}\n.operator-action-popup__revenue-report > p {\n  margin: 0;\n  color: rgba(36, 56, 83, 0.76);\n  font-size: 0.68rem;\n  font-weight: 720;\n  line-height: 1.4;\n}\n.operator-action-popup__revenue-report-code {\n  color: #9b3447;\n  font-family: monospace;\n  font-size: 0.62rem;\n  font-weight: 800;\n  overflow-wrap: anywhere;\n}\n.operator-action-popup__revenue-report dl {\n  margin: 0;\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.3rem;\n}\n.operator-action-popup__revenue-report dl > div {\n  min-width: 0;\n  display: grid;\n  gap: 0.04rem;\n}\n.operator-action-popup__revenue-report dd {\n  min-width: 0;\n  margin: 0;\n  color: #314762;\n  font-size: 0.66rem;\n  font-weight: 850;\n  overflow-wrap: anywhere;\n}\n.operator-action-popup__revenue-report app-menu {\n  width: min(100%, 220px);\n}\n.operator-action-popup__settlements {\n  min-width: 0;\n  padding: 0.7rem;\n  border: 1px solid rgba(39, 128, 105, 0.22);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      155deg,\n      #f3fbf8 0%,\n      #eef6fb 100%);\n  display: grid;\n  gap: 0.62rem;\n}\n.operator-action-popup__settlements-header {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.55rem;\n}\n.operator-action-popup__settlements-icon {\n  width: 38px;\n  height: 38px;\n  border-radius: 12px;\n  background: #dff3ec;\n  color: #19795e;\n  display: grid;\n  place-items: center;\n}\n.operator-action-popup__settlements-icon .mat-icon {\n  width: 20px;\n  height: 20px;\n  font-size: 20px;\n}\n.operator-action-popup__settlements-header > span:nth-child(2) {\n  min-width: 0;\n  display: grid;\n  gap: 0.04rem;\n}\n.operator-action-popup__settlements-header small {\n  color: rgba(36, 56, 83, 0.65);\n  font-size: 0.78rem;\n  font-weight: 850;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n}\n.operator-action-popup__settlements-header strong {\n  color: #1d6756;\n  font-size: 0.92rem;\n}\n.operator-action-popup__settlements-header em {\n  color: rgba(36, 56, 83, 0.72);\n  font-size: 0.8rem;\n  font-style: normal;\n  font-weight: 700;\n  line-height: 1.35;\n}\n.operator-action-popup__settlements-header > b {\n  padding: 0.34rem 0.52rem;\n  border-radius: 999px;\n  background: #fff4d9;\n  color: #8c5c0f;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  font-size: 0.78rem;\n  white-space: nowrap;\n}\n.operator-action-popup__settlements-header > b .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.operator-action-popup__settlements-unavailable {\n  margin: 0;\n  padding: 0.62rem;\n  border-radius: 11px;\n  background: #fff7e7;\n  color: #8b5a0f;\n  display: flex;\n  align-items: center;\n  gap: 0.42rem;\n  font-size: 0.8rem;\n  font-weight: 800;\n  line-height: 1.4;\n}\n.operator-action-popup__settlements-unavailable .mat-icon {\n  flex: 0 0 auto;\n}\n.operator-action-popup__settlements app-smart-list {\n  min-width: 0;\n  width: 100%;\n}\n.operator-action-popup__settlement {\n  --operator-settlement-accent: #53687e;\n  min-width: 0;\n  padding: 0.68rem;\n  border: 1px solid color-mix(in srgb, var(--operator-settlement-accent) 20%, transparent);\n  border-radius: 12px;\n  background: rgba(255, 255, 255, 0.9);\n  display: grid;\n  gap: 0.52rem;\n}\n.operator-action-popup__settlement[data-trend=positive] {\n  --operator-settlement-accent: #158164;\n}\n.operator-action-popup__settlement[data-trend=negative] {\n  --operator-settlement-accent: #b14b5d;\n}\n.operator-action-popup__settlement > header {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto auto;\n  align-items: center;\n  gap: 0.42rem;\n}\n.operator-action-popup__settlement-period {\n  min-width: 0;\n  display: grid;\n  gap: 0.04rem;\n}\n.operator-action-popup__settlement-period small,\n.operator-action-popup__settlement dt {\n  color: rgba(36, 56, 83, 0.64);\n  font-size: 0.78rem;\n  font-weight: 800;\n  line-height: 1.25;\n}\n.operator-action-popup__settlement-period strong {\n  color: #263f5d;\n  font-size: 0.86rem;\n}\n.operator-action-popup__settlement-currency,\n.operator-action-popup__settlement-revision {\n  min-height: 26px;\n  padding: 0 0.48rem;\n  border-radius: 999px;\n  display: inline-flex;\n  align-items: center;\n  font-size: 0.78rem;\n  font-weight: 900;\n  white-space: nowrap;\n}\n.operator-action-popup__settlement-currency {\n  background: #dff3ec;\n  color: #146c55;\n}\n.operator-action-popup__settlement-revision {\n  background: #edf1f6;\n  color: #52657c;\n}\n.operator-action-popup__settlement dl {\n  margin: 0;\n  display: grid;\n  gap: 0.36rem;\n}\n.operator-action-popup__settlement dl > div {\n  min-width: 0;\n  padding: 0.46rem 0.5rem;\n  border-radius: 9px;\n  background: rgba(238, 244, 249, 0.86);\n  display: grid;\n  gap: 0.08rem;\n}\n.operator-action-popup__settlement-month {\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n}\n.operator-action-popup__settlement-month > div {\n  background: #e9f7f1 !important;\n}\n.operator-action-popup__settlement-valuation {\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n}\n.operator-action-popup__settlement-valuation > div {\n  background: #eef3ff !important;\n}\n.operator-action-popup__settlement-trend {\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n}\n.operator-action-popup__settlement dd {\n  min-width: 0;\n  margin: 0;\n  color: var(--operator-settlement-accent);\n  font-size: 0.84rem;\n  font-weight: 900;\n  font-variant-numeric: tabular-nums;\n  overflow-wrap: anywhere;\n}\n.operator-action-popup__settlement > footer {\n  min-width: 0;\n  padding-top: 0.42rem;\n  border-top: 1px solid rgba(50, 78, 105, 0.12);\n  color: rgba(36, 56, 83, 0.66);\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-between;\n  gap: 0.35rem 0.7rem;\n  font-size: 0.78rem;\n  line-height: 1.35;\n}\n.operator-action-popup__settlement > footer strong {\n  color: #405873;\n  overflow-wrap: anywhere;\n}\n.operator-action-popup__deployments {\n  min-width: 0;\n  min-height: 0;\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  gap: 0.58rem;\n}\n.operator-action-popup__deployment-summary {\n  min-width: 0;\n  padding: 0.68rem;\n  border: 1px solid rgba(23, 121, 135, 0.18);\n  border-radius: 12px;\n  background:\n    linear-gradient(\n      180deg,\n      #f0fbfb 0%,\n      #e8f6f7 100%);\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto auto;\n  align-items: center;\n  gap: 0.58rem;\n  flex: 0 0 auto;\n}\n.operator-action-popup__deployment-summary-icon {\n  width: 34px;\n  height: 34px;\n  border-radius: 10px;\n  background: #d8f0f1;\n  color: #176b74;\n  display: grid;\n  place-items: center;\n}\n.operator-action-popup__deployment-summary-icon .mat-icon {\n  width: 19px;\n  height: 19px;\n  font-size: 19px;\n}\n.operator-action-popup__deployment-summary > span:nth-child(2) {\n  min-width: 0;\n  display: grid;\n  gap: 0.04rem;\n}\n.operator-action-popup__deployment-summary small {\n  color: rgba(36, 56, 83, 0.58);\n  font-size: 0.64rem;\n  font-weight: 800;\n}\n.operator-action-popup__deployment-summary strong {\n  color: #285b65;\n  font-size: 0.8rem;\n}\n.operator-action-popup__deployment-summary b {\n  padding: 0.28rem 0.48rem;\n  border-radius: 999px;\n  background: #d8f0f1;\n  color: #176b74;\n  font-size: 0.7rem;\n  font-variant-numeric: tabular-nums;\n}\n.operator-action-popup__deployment-eligibility {\n  min-width: 0;\n  padding: 0.28rem 0.48rem;\n  border-radius: 999px;\n  background: #fff0d5;\n  color: #985e08;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n  font-size: 0.68rem;\n  font-weight: 850;\n  white-space: nowrap;\n}\n.operator-action-popup__deployment-eligibility .mat-icon {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n}\n.operator-action-popup__deployment-eligibility[data-status=SUSPENDED] {\n  background: #ffe5e8;\n  color: #a8293e;\n}\n.operator-action-popup__deployment-eligibility[data-status=INACTIVE] {\n  background: #edf1f6;\n  color: #53677e;\n}\n.operator-action-popup__deployment-list {\n  min-width: 0;\n  min-height: 0;\n  display: flex;\n  flex: 1 1 auto;\n}\n.operator-action-popup__community {\n  padding: 0.75rem;\n  border-radius: 14px;\n  background: #f4f6fa;\n  display: flex;\n  align-items: center;\n  gap: 0.65rem;\n}\n.operator-action-popup__community > span:last-child {\n  display: grid;\n  gap: 0.08rem;\n}\n.operator-action-popup__community small {\n  color: rgba(36, 56, 83, 0.64);\n  font-size: 0.72rem;\n  font-weight: 800;\n}\n.operator-action-popup__community strong {\n  font-size: 0.84rem;\n}\n.operator-action-popup__presence {\n  width: 14px;\n  height: 14px;\n  border: 3px solid #fff;\n  border-radius: 50%;\n  background: #8994a6;\n  box-shadow: 0 0 0 1px rgba(31, 49, 76, 0.1);\n}\n.operator-action-popup__presence[data-state=ONLINE],\n.operator-action-popup__presence[data-state=AVAILABLE] {\n  background: #24a77b;\n}\n.operator-action-popup__presence[data-state=BUSY] {\n  background: #d85362;\n}\n.operator-action-popup__providers {\n  display: grid;\n  gap: 0.5rem;\n}\n.operator-action-popup__provider {\n  min-width: 0;\n  padding: 0.62rem;\n  border: 1px solid rgba(45, 66, 98, 0.11);\n  border-radius: 12px;\n  background: #fafbfe;\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.55rem;\n}\n.operator-action-popup__provider-icon {\n  width: 34px;\n  height: 34px;\n  border-radius: 11px;\n  background: #ece9fa;\n  color: #6650c9;\n  display: grid;\n  place-items: center;\n}\n.operator-action-popup__provider-copy {\n  min-width: 0;\n  display: grid;\n  gap: 0.08rem;\n}\n.operator-action-popup__provider-copy strong {\n  font-size: 0.82rem;\n}\n.operator-action-popup__provider-copy small {\n  color: rgba(36, 56, 83, 0.68);\n  font-size: 0.74rem;\n  line-height: 1.35;\n}\n.operator-action-popup__provider-link {\n  min-height: 34px;\n  padding: 0 0.62rem;\n  border-radius: 999px;\n  background: #e7f3f1;\n  color: #19796d;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  font-size: 0.72rem;\n  font-weight: 900;\n  text-decoration: none;\n}\n.operator-action-popup__provider-link .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.operator-action-popup__announcements {\n  display: grid;\n  gap: 0.5rem;\n}\n.operator-action-popup__announcements h3 {\n  margin: 0.15rem 0 0;\n  color: rgba(36, 56, 83, 0.68);\n  font-size: 0.76rem;\n  font-weight: 900;\n}\n.operator-action-popup__announcement {\n  min-width: 0;\n  padding: 0.72rem;\n  border: 1px solid rgba(102, 80, 201, 0.16);\n  border-radius: 12px;\n  background: #f8f6ff;\n  display: grid;\n  gap: 0.48rem;\n}\n.operator-action-popup__announcement[data-severity=WARNING] {\n  border-color: rgba(194, 126, 25, 0.24);\n  background: #fff9ed;\n}\n.operator-action-popup__announcement[data-severity=CRITICAL] {\n  border-color: rgba(185, 49, 71, 0.22);\n  background: #fff1f4;\n}\n.operator-action-popup__announcement header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n}\n.operator-action-popup__announcement header > span {\n  display: grid;\n}\n.operator-action-popup__announcement header small {\n  color: rgba(36, 56, 83, 0.58);\n  font-size: 0.72rem;\n  font-weight: 800;\n}\n.operator-action-popup__announcement header strong {\n  font-size: 0.82rem;\n}\n.operator-action-popup__announcement-badges {\n  display: inline-flex !important;\n  align-items: center;\n  gap: 0.34rem;\n}\n.operator-action-popup__announcement-badges i {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  background: #d93d51;\n  box-shadow: 0 0 0 3px rgba(217, 61, 81, 0.12);\n}\n.operator-action-popup__announcement-badges b {\n  padding: 0.2rem 0.42rem;\n  border-radius: 999px;\n  background: #e9f7f1;\n  color: #137157;\n  font-size: 0.72rem;\n  text-transform: uppercase;\n}\n.operator-action-popup__announcement-badges em {\n  padding: 0.2rem 0.42rem;\n  border-radius: 999px;\n  background: #edf2f8;\n  color: #586a81;\n  font-size: 0.72rem;\n  font-style: normal;\n  font-weight: 900;\n  text-transform: uppercase;\n}\n.operator-action-popup__announcement-badges em[data-severity=SUCCESS] {\n  background: #e9f7f1;\n  color: #137157;\n}\n.operator-action-popup__announcement-badges em[data-severity=WARNING] {\n  background: #fff2d8;\n  color: #946114;\n}\n.operator-action-popup__announcement-badges em[data-severity=CRITICAL] {\n  background: #ffe6eb;\n  color: #9b3447;\n}\n.operator-action-popup__announcement-badges b[data-status=WITHDRAWN] {\n  background: #fff0f3;\n  color: #9b3447;\n}\n.operator-action-popup__announcement p,\n.operator-action-popup__announcement ul {\n  margin: 0;\n  color: rgba(36, 56, 83, 0.75);\n  font-size: 0.74rem;\n  font-weight: 700;\n  line-height: 1.42;\n}\n.operator-action-popup__announcement ul {\n  padding-left: 1.05rem;\n}\n.operator-action-popup__announcement-date {\n  color: rgba(36, 56, 83, 0.52);\n  font-size: 0.72rem;\n  font-weight: 750;\n}\n.operator-action-popup__announcement-details {\n  min-width: 0;\n  border-top: 1px solid rgba(102, 80, 201, 0.12);\n  padding-top: 0.35rem;\n}\n.operator-action-popup__announcement-details summary {\n  width: fit-content;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.22rem;\n  color: #513da7;\n  cursor: pointer;\n  font-size: 0.74rem;\n  font-weight: 900;\n  list-style: none;\n}\n.operator-action-popup__announcement-details summary::-webkit-details-marker {\n  display: none;\n}\n.operator-action-popup__announcement-details summary .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  transition: transform 0.16s ease;\n}\n.operator-action-popup__announcement-details[open] summary .mat-icon {\n  transform: rotate(180deg);\n}\n.operator-action-popup__announcement-detail-body {\n  min-width: 0;\n  padding-top: 0.48rem;\n  display: grid;\n  gap: 0.46rem;\n}\n.operator-action-popup__announcement-links {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.4rem;\n}\n.operator-action-popup__announcement-links a {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n  color: #513da7;\n  font-size: 0.72rem;\n  font-weight: 850;\n  text-decoration: none;\n}\n.operator-action-popup__announcement-links .mat-icon {\n  width: 14px;\n  height: 14px;\n  font-size: 14px;\n}\n.operator-action-popup__release {\n  padding: 0.6rem;\n  border: 1px solid rgba(102, 80, 201, 0.12);\n  border-radius: 10px;\n  background: rgba(255, 255, 255, 0.72);\n  display: grid;\n  gap: 0.42rem;\n}\n.operator-action-popup__release dl {\n  margin: 0;\n  display: grid;\n  gap: 0.32rem;\n}\n.operator-action-popup__release dl > div {\n  min-width: 0;\n  display: grid;\n  gap: 0.06rem;\n}\n.operator-action-popup__release dt {\n  color: rgba(36, 56, 83, 0.54);\n  font-size: 0.72rem;\n  font-weight: 850;\n}\n.operator-action-popup__release dd {\n  min-width: 0;\n  margin: 0;\n  color: rgba(36, 56, 83, 0.8);\n  font-size: 0.74rem;\n  font-weight: 750;\n  overflow-wrap: anywhere;\n}\n.operator-action-popup__release dd code {\n  color: #513da7;\n  font-size: 0.72rem;\n}\n.operator-action-popup__release dd.operator-action-popup__signature-state {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  color: #a36a17;\n}\n.operator-action-popup__release dd.operator-action-popup__signature-state[data-verified=true] {\n  color: #137157;\n}\n.operator-action-popup__signature-state .mat-icon {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n}\n.operator-action-popup__download {\n  min-width: 0;\n  padding-top: 0.42rem;\n  border-top: 1px solid rgba(102, 80, 201, 0.12);\n  display: grid;\n  gap: 0.38rem;\n}\n.operator-action-popup__download > span:first-child {\n  min-width: 0;\n  display: grid;\n  gap: 0.12rem;\n}\n.operator-action-popup__download small {\n  color: rgba(36, 56, 83, 0.58);\n  font-size: 0.72rem;\n  font-weight: 800;\n}\n.operator-action-popup__download code {\n  overflow-wrap: anywhere;\n  color: #513da7;\n  font-size: 0.72rem;\n  font-weight: 750;\n}\n.operator-action-popup__download a,\n.operator-action-popup__download-unverified {\n  width: fit-content;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  color: #137157;\n  font-size: 0.72rem;\n  font-weight: 850;\n  text-decoration: none;\n}\n.operator-action-popup__download a .mat-icon,\n.operator-action-popup__download-unverified .mat-icon {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n}\n.operator-action-popup__download-unverified {\n  color: #a36a17;\n}\n.operator-action-popup__result {\n  margin: 0;\n  padding: 0.58rem 0.68rem;\n  border-radius: 11px;\n  display: flex;\n  align-items: center;\n  gap: 0.42rem;\n  font-size: 0.74rem;\n  font-weight: 800;\n}\n.operator-action-popup__result .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.operator-action-popup__result-copy {\n  display: grid;\n  gap: 0.08rem;\n}\n.operator-action-popup__result-copy small {\n  font-size: 0.65rem;\n  font-weight: 700;\n  line-height: 1.35;\n}\n.operator-action-popup__result.is-success {\n  background: #eaf8f2;\n  color: #146b54;\n}\n.operator-action-popup__result.is-error {\n  background: #fff0f3;\n  color: #9b3447;\n}\n.operator-action-popup__result.is-pending {\n  background: #fff7e7;\n  color: #946114;\n}\n.operator-action-popup__actions {\n  min-width: 0;\n}\n@media (max-width: 820px) {\n  .operator-action-popup__firebase-public-grid {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n@media (max-width: 560px) {\n  .operator-action-popup__summary {\n    grid-template-columns: auto 1fr;\n  }\n  .operator-action-popup__branding-editor {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .operator-action-popup__branding-editor {\n    grid-template-rows: auto;\n  }\n  .operator-action-popup__branding-editor .operator-action-popup__logo-field,\n  .operator-action-popup__branding-identity,\n  .operator-action-popup__branding-theme,\n  .operator-action-popup__branding-actions {\n    grid-column: 1;\n    grid-row: auto;\n  }\n  .operator-action-popup__branding-identity {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .operator-action-popup__social-link-fields {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .operator-action-popup__tls-grid {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .operator-action-popup__payment-routing.is-barion {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .operator-action-popup__firebase-public-grid {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .operator-action-popup__configuration-group > header {\n    flex-wrap: wrap;\n  }\n  .operator-action-popup__header-actions {\n    order: 3;\n    width: 100%;\n  }\n  .operator-action-popup__tls-test-actions {\n    justify-self: stretch;\n    width: 100% !important;\n  }\n  .operator-action-popup__tls-header {\n    grid-template-columns: minmax(0, 1fr) auto;\n    grid-template-areas: "title toggle" "tests tests";\n  }\n  .operator-action-popup__revenue-delivery > header {\n    grid-template-columns: auto minmax(0, 1fr);\n  }\n  .operator-action-popup__revenue-delivery > header time {\n    grid-column: 2;\n  }\n  .operator-action-popup__revenue-delivery dl {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n  .operator-action-popup__revenue-report dl {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .operator-action-popup__settlements-header {\n    grid-template-columns: auto minmax(0, 1fr);\n  }\n  .operator-action-popup__settlements-header > b {\n    grid-column: 1/-1;\n    width: fit-content;\n  }\n  .operator-action-popup__settlement > header {\n    grid-template-columns: minmax(0, 1fr) auto;\n  }\n  .operator-action-popup__settlement-revision {\n    grid-column: 1/-1;\n    width: fit-content;\n  }\n  .operator-action-popup__settlement-month,\n  .operator-action-popup__settlement-valuation,\n  .operator-action-popup__settlement-trend {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n/*# sourceMappingURL=operator-action-popup.component.css.map */\n'] }]
  }], () => [], { revenueReportsSmartList: [{
    type: ViewChild,
    args: ["revenueReportsSmartList"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(OperatorActionPopupComponent, { className: "OperatorActionPopupComponent", filePath: "app/operator/components/operator-action-popup/operator-action-popup.component.ts", lineNumber: 137 });
})();
export {
  OperatorActionPopupComponent
};
//# sourceMappingURL=operator-action-popup.component-5RFFQUK3.js.map
