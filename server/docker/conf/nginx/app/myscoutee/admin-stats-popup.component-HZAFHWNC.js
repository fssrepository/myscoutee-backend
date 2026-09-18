import "./chunk-F5B73CZX.js";
import "./chunk-BRGZDNX3.js";
import "./chunk-XA4QEJLP.js";
import "./chunk-7UZYVY3Z.js";
import "./chunk-VBRGMXSL.js";
import "./chunk-2VFJ327H.js";
import {
  AdminMenuStore
} from "./chunk-4TXXTGDV.js";
import "./chunk-FS6LNZZ4.js";
import "./chunk-NX6X6SL6.js";
import "./chunk-SYKOEE4K.js";
import "./chunk-IMU76WCC.js";
import "./chunk-IRJFXW7R.js";
import "./chunk-EFQHKYZD.js";
import "./chunk-HDRPEKFL.js";
import "./chunk-JWRKXGRX.js";
import "./chunk-LWXWCSPP.js";
import "./chunk-T6NM4FOV.js";
import "./chunk-2FA72P6F.js";
import "./chunk-A6AM4Z6L.js";
import "./chunk-DR3RAUWL.js";
import "./chunk-DDIPOAA4.js";
import "./chunk-MDKC4NXB.js";
import "./chunk-JJACTKXS.js";
import "./chunk-AQO6U4VN.js";
import "./chunk-V477GJDH.js";
import "./chunk-3KSYFEWX.js";
import "./chunk-QM6YAR3P.js";
import "./chunk-4DIW3NKM.js";
import "./chunk-GQZWVH6M.js";
import "./chunk-TGJIGH66.js";
import "./chunk-4VYYFWRA.js";
import "./chunk-FNZUUWCJ.js";
import {
  PopupComponent
} from "./chunk-LN2XQVUC.js";
import "./chunk-E63MLHVM.js";
import "./chunk-T5TB7V7K.js";
import {
  I18nPipe,
  IndicatorComponent,
  MatIcon,
  MatIconModule
} from "./chunk-J4QS2YUJ.js";
import {
  AdminStatsService
} from "./chunk-XCPZRRU5.js";
import "./chunk-LGGVU5AE.js";
import "./chunk-6RAUJLMB.js";
import "./chunk-JQCFZPHN.js";
import "./chunk-J5KOSTYM.js";
import "./chunk-MC3W6CB7.js";
import "./chunk-FAW3YKWN.js";
import "./chunk-QZPIQIRC.js";
import "./chunk-LCSKRGZO.js";
import {
  I18nService
} from "./chunk-I52TUHFM.js";
import "./chunk-WWXJW2FL.js";
import "./chunk-NB6L6NLP.js";
import "./chunk-U4O3FETT.js";
import {
  CommonModule,
  NgClass,
  NgStyle
} from "./chunk-JMCIB2VE.js";
import "./chunk-DP7O5TZ4.js";
import "./chunk-OJADXSXP.js";
import {
  UserProfileStore
} from "./chunk-52XNNRXY.js";
import "./chunk-27OFLLFL.js";
import "./chunk-SXVGSFEZ.js";
import "./chunk-YO3STUCM.js";
import "./chunk-ZBAABSP3.js";
import "./chunk-ON23DQAQ.js";
import {
  Component,
  computed,
  effect,
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
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-FMXFYYCS.js";

// src/app/admin/components/stats-popup/admin-stats-popup.component.ts
var _c0 = (a0) => ({ tone: a0 });
var _forTrack0 = ($index, $item) => $item.key;
var _forTrack1 = ($index, $item) => $item.dateKey;
function AdminStatsPopupComponent_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275element(1, "div", 6);
    \u0275\u0275elementStart(2, "div", 7);
    \u0275\u0275element(3, "app-indicator", 8);
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "i18n");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(6, 1, "loading.stats"));
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3);
    \u0275\u0275element(1, "app-indicator", 8);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 1, "loading.stats"));
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_4_For_14_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 40);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const metric_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", metric_r2.captionKey ? \u0275\u0275pipeBind1(2, 1, metric_r2.captionKey) : metric_r2.caption, " ");
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_4_For_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 13)(1, "span", 39)(2, "mat-icon");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "small");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(9, AdminStatsPopupComponent_Conditional_0_Conditional_4_For_14_Conditional_9_Template, 3, 3, "small", 40);
    \u0275\u0275elementStart(10, "span", 41);
    \u0275\u0275element(11, "span");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const metric_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275property("ngClass", ctx_r2.toneClass(metric_r2));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(metric_r2.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(metric_r2.valueLabel || metric_r2.value);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 7, metric_r2.labelKey));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(metric_r2.captionKey || metric_r2.caption ? 9 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", ctx_r2.metricPercent(metric_r2), "%");
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "line", 63)(1, "line", 63);
  }
  if (rf & 2) {
    const \u0275$index_104_r5 = ctx.$index;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275attribute("x1", ctx_r2.graphBridgeX(\u0275$index_104_r5, ctx_r2.graphBridgeUsers().length))("y1", ctx_r2.graphBridgeY(\u0275$index_104_r5, ctx_r2.graphBridgeUsers().length))("x2", ctx_r2.graphCommunityX(ctx_r2.graphBridgeCommunityIndex(\u0275$index_104_r5, ctx_r2.graphCommunities().length, 0), ctx_r2.graphCommunities().length))("y2", ctx_r2.graphCommunityY(ctx_r2.graphBridgeCommunityIndex(\u0275$index_104_r5, ctx_r2.graphCommunities().length, 0), ctx_r2.graphCommunities().length));
    \u0275\u0275advance();
    \u0275\u0275attribute("x1", ctx_r2.graphBridgeX(\u0275$index_104_r5, ctx_r2.graphBridgeUsers().length))("y1", ctx_r2.graphBridgeY(\u0275$index_104_r5, ctx_r2.graphBridgeUsers().length))("x2", ctx_r2.graphCommunityX(ctx_r2.graphBridgeCommunityIndex(\u0275$index_104_r5, ctx_r2.graphCommunities().length, 1), ctx_r2.graphCommunities().length))("y2", ctx_r2.graphCommunityY(ctx_r2.graphBridgeCommunityIndex(\u0275$index_104_r5, ctx_r2.graphCommunities().length, 1), ctx_r2.graphCommunities().length));
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_For_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "g", 64);
    \u0275\u0275listener("click", function AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_For_21_Template_g_click_0_listener() {
      const community_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.selectGraphFocus(ctx_r2.itemLabel(community_r7), community_r7.value));
    })("focus", function AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_For_21_Template_g_focus_0_listener() {
      const community_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.selectGraphFocus(ctx_r2.itemLabel(community_r7), community_r7.value));
    });
    \u0275\u0275element(1, "circle");
    \u0275\u0275elementStart(2, "text", 65);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "text", 66);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const community_r7 = ctx.$implicit;
    const \u0275$index_109_r8 = ctx.$index;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275property("ngClass", ctx_r2.toneClass(community_r7));
    \u0275\u0275advance();
    \u0275\u0275attribute("cx", ctx_r2.graphCommunityX(\u0275$index_109_r8, ctx_r2.graphCommunities().length))("cy", ctx_r2.graphCommunityY(\u0275$index_109_r8, ctx_r2.graphCommunities().length))("r", ctx_r2.graphCommunityRadius(community_r7));
    \u0275\u0275advance();
    \u0275\u0275attribute("x", ctx_r2.graphCommunityX(\u0275$index_109_r8, ctx_r2.graphCommunities().length))("y", ctx_r2.graphCommunityY(\u0275$index_109_r8, ctx_r2.graphCommunities().length) - 1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.compactGraphValue(community_r7.value), " ");
    \u0275\u0275advance();
    \u0275\u0275attribute("x", ctx_r2.graphCommunityX(\u0275$index_109_r8, ctx_r2.graphCommunities().length))("y", ctx_r2.graphCommunityY(\u0275$index_109_r8, ctx_r2.graphCommunities().length) + 5.4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(6, 10, "stats.graph.map.people.short"), " ");
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_For_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "g", 67);
    \u0275\u0275listener("click", function AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_For_23_Template_g_click_0_listener() {
      const bridge_r10 = \u0275\u0275restoreView(_r9).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.selectGraphFocus(ctx_r2.itemLabel(bridge_r10), bridge_r10.value));
    })("focus", function AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_For_23_Template_g_focus_0_listener() {
      const bridge_r10 = \u0275\u0275restoreView(_r9).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.selectGraphFocus(ctx_r2.itemLabel(bridge_r10), bridge_r10.value));
    });
    \u0275\u0275element(1, "circle");
    \u0275\u0275elementStart(2, "text", 68);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const bridge_r10 = ctx.$implicit;
    const \u0275$index_121_r11 = ctx.$index;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275property("ngClass", ctx_r2.toneClass(bridge_r10));
    \u0275\u0275advance();
    \u0275\u0275attribute("cx", ctx_r2.graphBridgeX(\u0275$index_121_r11, ctx_r2.graphBridgeUsers().length))("cy", ctx_r2.graphBridgeY(\u0275$index_121_r11, ctx_r2.graphBridgeUsers().length))("r", ctx_r2.graphBridgeRadius(bridge_r10));
    \u0275\u0275advance();
    \u0275\u0275attribute("x", ctx_r2.graphBridgeX(\u0275$index_121_r11, ctx_r2.graphBridgeUsers().length))("y", ctx_r2.graphBridgeY(\u0275$index_121_r11, ctx_r2.graphBridgeUsers().length));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.compactGraphValue(bridge_r10.value), " ");
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_For_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 26)(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const action_r12 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275property("ngClass", ctx_r2.toneClass(action_r12));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(action_r12.icon);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(4, 3, action_r12.labelKey), " ");
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_Conditional_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 55)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const focus_r13 = ctx;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(focus_r13.labelKey ? \u0275\u0275pipeBind1(3, 2, focus_r13.labelKey) : focus_r13.label);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(focus_r13.value);
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_For_53_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 26)(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "b");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const metric_r14 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275property("ngClass", ctx_r2.toneClass(metric_r14));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(metric_r14.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(metric_r14.valueLabel || metric_r14.value);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(6, 4, metric_r14.labelKey), " ");
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_For_56_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 58)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275element(6, "i");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const signal_r15 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275property("ngClass", ctx_r2.toneClass(signal_r15));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 5, signal_r15.labelKey));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", signal_r15.value, "%");
    \u0275\u0275advance();
    \u0275\u0275styleProp("width", ctx_r2.itemPercent(signal_r15), "%");
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_For_63_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32)(1, "span")(2, "mat-icon");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275element(7, "i");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const bridge_r16 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275property("ngClass", ctx_r2.toneClass(bridge_r16));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(bridge_r16.icon || "conversion_path");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.itemLabel(bridge_r16));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(bridge_r16.value);
    \u0275\u0275advance();
    \u0275\u0275styleProp("width", ctx_r2.itemPercent(bridge_r16), "%");
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_For_69_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32)(1, "span")(2, "mat-icon");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275element(7, "i");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const community_r17 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275property("ngClass", ctx_r2.toneClass(community_r17));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(community_r17.icon || "bubble_chart");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.itemLabel(community_r17));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(community_r17.value);
    \u0275\u0275advance();
    \u0275\u0275styleProp("width", ctx_r2.itemPercent(community_r17), "%");
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_Conditional_74_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17)(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275element(4, "i", 69);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span");
    \u0275\u0275element(8, "i", 70);
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span");
    \u0275\u0275element(12, "i", 71);
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "span");
    \u0275\u0275element(16, "i", 72);
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span");
    \u0275\u0275element(20, "i", 73);
    \u0275\u0275text(21);
    \u0275\u0275pipe(22, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "span");
    \u0275\u0275element(24, "i", 74);
    \u0275\u0275text(25);
    \u0275\u0275pipe(26, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const point_r18 = ctx;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(point_r18.label || point_r18.dateKey);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind1(6, 13, "stats.graph.timeline.active.edges"), " ", point_r18.activeEdges);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind1(10, 15, "stats.graph.timeline.new.edges"), " ", point_r18.newEdges);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind1(14, 17, "stats.graph.timeline.recurring.edges"), " ", point_r18.recurringEdges);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind1(18, 19, "stats.graph.timeline.weak.ties"), " ", point_r18.weakTies);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind1(22, 21, "stats.graph.timeline.network.quality"), " ", point_r18.networkQuality, "%");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind1(26, 23, "stats.graph.timeline.cluster.quality"), " ", point_r18.clusterQuality, "%");
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_For_82_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "polyline", 23);
  }
  if (rf & 2) {
    const metric_r20 = ctx.$implicit;
    const socialGraph_r19 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275property("ngClass", ctx_r2.toneClass(\u0275\u0275pureFunction1(2, _c0, metric_r20.tone)));
    \u0275\u0275attribute("points", ctx_r2.graphTimelineChartPoints(socialGraph_r19.timeline, metric_r20.key));
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_Conditional_83_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "line", 75)(1, "circle", 76)(2, "circle", 77);
  }
  if (rf & 2) {
    const socialGraph_r19 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275attribute("x1", ctx_r2.selectedGraphTimelineX(socialGraph_r19))("x2", ctx_r2.selectedGraphTimelineX(socialGraph_r19));
    \u0275\u0275advance();
    \u0275\u0275attribute("cx", ctx_r2.selectedGraphTimelineX(socialGraph_r19))("cy", ctx_r2.selectedGraphTimelineY(socialGraph_r19));
    \u0275\u0275advance();
    \u0275\u0275attribute("cx", ctx_r2.selectedGraphTimelineX(socialGraph_r19))("cy", ctx_r2.selectedGraphTimelineY(socialGraph_r19));
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_For_85_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = \u0275\u0275getCurrentView();
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "rect", 78);
    \u0275\u0275listener("focus", function AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_For_85_Template_rect_focus_0_listener() {
      const point_r22 = \u0275\u0275restoreView(_r21).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.selectGraphTimelinePoint(point_r22));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const \u0275$index_321_r23 = ctx.$index;
    const socialGraph_r19 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275attribute("x", ctx_r2.timelineX(\u0275$index_321_r23, socialGraph_r19.timeline.length) - 8);
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 14)(1, "header")(2, "div")(3, "h3");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 42)(10, "button", 43);
    \u0275\u0275pipe(11, "i18n");
    \u0275\u0275listener("click", function AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.openGraphHelp());
    });
    \u0275\u0275elementStart(12, "mat-icon");
    \u0275\u0275text(13, "help_outline");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(14, "div", 44)(15, "div", 45);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(16, "svg", 46);
    \u0275\u0275pipe(17, "i18n");
    \u0275\u0275repeaterCreate(18, AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_For_19_Template, 2, 8, null, null, _forTrack0);
    \u0275\u0275repeaterCreate(20, AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_For_21_Template, 7, 12, ":svg:g", 47, _forTrack0);
    \u0275\u0275repeaterCreate(22, AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_For_23_Template, 4, 7, ":svg:g", 48, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(24, "div", 49)(25, "span");
    \u0275\u0275element(26, "i", 50);
    \u0275\u0275text(27);
    \u0275\u0275pipe(28, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "span");
    \u0275\u0275element(30, "i", 51);
    \u0275\u0275text(31);
    \u0275\u0275pipe(32, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "span");
    \u0275\u0275element(34, "i", 52);
    \u0275\u0275text(35);
    \u0275\u0275pipe(36, "i18n");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(37, "div", 53)(38, "strong");
    \u0275\u0275text(39);
    \u0275\u0275pipe(40, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "p");
    \u0275\u0275text(42);
    \u0275\u0275pipe(43, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "div", 54)(45, "strong");
    \u0275\u0275text(46);
    \u0275\u0275pipe(47, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(48, AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_For_49_Template, 5, 5, "span", 26, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(50, AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_Conditional_50_Template, 6, 4, "div", 55);
    \u0275\u0275elementStart(51, "div", 56);
    \u0275\u0275repeaterCreate(52, AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_For_53_Template, 7, 6, "span", 26, _forTrack0);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(54, "div", 57);
    \u0275\u0275repeaterCreate(55, AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_For_56_Template, 7, 7, "div", 58, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "div", 59)(58, "div", 60)(59, "h4");
    \u0275\u0275text(60);
    \u0275\u0275pipe(61, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(62, AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_For_63_Template, 8, 6, "div", 32, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(64, "div", 60)(65, "h4");
    \u0275\u0275text(66);
    \u0275\u0275pipe(67, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(68, AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_For_69_Template, 8, 6, "div", 32, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(70, "div", 61)(71, "h4");
    \u0275\u0275text(72);
    \u0275\u0275pipe(73, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(74, AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_Conditional_74_Template, 27, 25, "div", 17);
    \u0275\u0275elementStart(75, "div", 62);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(76, "svg", 19);
    \u0275\u0275pipe(77, "i18n");
    \u0275\u0275listener("pointerdown", function AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_Template_svg_pointerdown_76_listener($event) {
      const socialGraph_r19 = \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.startGraphTimelineDrag($event, socialGraph_r19.timeline));
    })("pointermove", function AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_Template_svg_pointermove_76_listener($event) {
      const socialGraph_r19 = \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.moveGraphTimelineDrag($event, socialGraph_r19.timeline));
    })("pointerup", function AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_Template_svg_pointerup_76_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.endGraphTimelineDrag($event));
    })("pointercancel", function AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_Template_svg_pointercancel_76_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.endGraphTimelineDrag($event));
    })("lostpointercapture", function AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_Template_svg_lostpointercapture_76_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.endGraphTimelineDrag());
    });
    \u0275\u0275element(78, "line", 20)(79, "line", 21)(80, "line", 22);
    \u0275\u0275repeaterCreate(81, AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_For_82_Template, 1, 4, ":svg:polyline", 23, _forTrack0);
    \u0275\u0275conditionalCreate(83, AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_Conditional_83_Template, 3, 6);
    \u0275\u0275repeaterCreate(84, AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_For_85_Template, 1, 1, ":svg:rect", 24, _forTrack1);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    let tmp_19_0;
    let tmp_27_0;
    const socialGraph_r19 = ctx;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 19, "stats.graph.title"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 21, "stats.graph.subtitle"));
    \u0275\u0275advance(3);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(11, 23, "stats.graph.help.open"));
    \u0275\u0275advance(6);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(17, 25, "stats.graph.title"));
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.graphBridgeUsers());
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.graphCommunities());
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.graphBridgeUsers());
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(28, 27, "stats.graph.map.community.legend"));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(32, 29, "stats.graph.map.bridge.legend"));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(36, 31, "stats.graph.map.link.legend"));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(40, 33, "stats.graph.suggests"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(43, 35, socialGraph_r19.insightKey));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(47, 37, "stats.graph.actions.title"));
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.graphAdminActions(socialGraph_r19));
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_19_0 = ctx_r2.selectedGraphFocus()) ? 50 : -1, tmp_19_0);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(socialGraph_r19.metrics);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(socialGraph_r19.signals);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(61, 39, "stats.graph.bridges"));
    \u0275\u0275advance(2);
    \u0275\u0275repeater(socialGraph_r19.bridgeUsers);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(67, 41, "stats.graph.communities"));
    \u0275\u0275advance(2);
    \u0275\u0275repeater(socialGraph_r19.communities);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(73, 43, "stats.graph.timeline.title"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_27_0 = ctx_r2.selectedGraphTimelinePoint(socialGraph_r19)) ? 74 : -1, tmp_27_0);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("is-dragging", ctx_r2.graphTimelineDragging());
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(77, 45, "stats.graph.timeline.title"));
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r2.graphTimelineMetrics);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.selectedGraphTimelinePoint(socialGraph_r19) ? 83 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(socialGraph_r19.timeline);
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17)(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275element(4, "i", 69);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span");
    \u0275\u0275element(8, "i", 70);
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span");
    \u0275\u0275element(12, "i", 72);
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "span");
    \u0275\u0275element(16, "i", 71);
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span");
    \u0275\u0275element(20, "i", 73);
    \u0275\u0275text(21);
    \u0275\u0275pipe(22, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "span");
    \u0275\u0275element(24, "i", 74);
    \u0275\u0275text(25);
    \u0275\u0275pipe(26, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const point_r24 = ctx;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(point_r24.label || point_r24.dateKey);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind1(6, 13, "stats.timeline.active.users"), " ", point_r24.activeUsers);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind1(10, 15, "stats.timeline.registrations"), " ", point_r24.registrations);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind1(14, 17, "stats.timeline.ratings"), " ", point_r24.ratings);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind1(18, 19, "stats.timeline.activity"), " ", point_r24.events + point_r24.assets);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind1(22, 21, "stats.timeline.messages"), " ", point_r24.messages);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind1(26, 23, "stats.timeline.moderation"), " ", point_r24.moderation);
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_4_For_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "polyline", 23);
  }
  if (rf & 2) {
    const metric_r26 = ctx.$implicit;
    const dashboard_r25 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngClass", ctx_r2.toneClass(\u0275\u0275pureFunction1(2, _c0, metric_r26.tone)));
    \u0275\u0275attribute("points", ctx_r2.timelineChartPoints(dashboard_r25.timeline, metric_r26.key));
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "line", 75)(1, "circle", 76)(2, "circle", 77);
  }
  if (rf & 2) {
    const dashboard_r25 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("x1", ctx_r2.selectedTimelineX(dashboard_r25))("x2", ctx_r2.selectedTimelineX(dashboard_r25));
    \u0275\u0275advance();
    \u0275\u0275attribute("cx", ctx_r2.selectedTimelineX(dashboard_r25))("cy", ctx_r2.selectedTimelineY(dashboard_r25));
    \u0275\u0275advance();
    \u0275\u0275attribute("cx", ctx_r2.selectedTimelineX(dashboard_r25))("cy", ctx_r2.selectedTimelineY(dashboard_r25));
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_4_For_36_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = \u0275\u0275getCurrentView();
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "rect", 78);
    \u0275\u0275listener("focus", function AdminStatsPopupComponent_Conditional_0_Conditional_4_For_36_Template_rect_focus_0_listener() {
      const point_r28 = \u0275\u0275restoreView(_r27).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.selectTimelinePoint(point_r28));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const \u0275$index_401_r29 = ctx.$index;
    const dashboard_r25 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("x", ctx_r2.timelineX(\u0275$index_401_r29, dashboard_r25.timeline.length) - 8);
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_4_For_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 26);
    \u0275\u0275element(1, "i");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const metric_r30 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275property("ngClass", ctx_r2.toneClass(\u0275\u0275pureFunction1(4, _c0, metric_r30.tone)));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind1(3, 2, metric_r30.labelKey), " ");
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_4_For_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 26);
  }
  if (rf & 2) {
    const item_r31 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275styleProp("flex-grow", item_r31.value);
    \u0275\u0275property("ngClass", ctx_r2.toneClass(item_r31));
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_4_For_53_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32)(1, "span")(2, "mat-icon");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275element(7, "i");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r32 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275property("ngClass", ctx_r2.toneClass(item_r32));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r32.icon || "category");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.itemLabel(item_r32));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r32.value);
    \u0275\u0275advance();
    \u0275\u0275styleProp("width", ctx_r2.itemPercent(item_r32), "%");
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_4_For_62_For_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 83)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r33 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275property("ngClass", ctx_r2.toneClass(item_r33));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r33.labelKey ? \u0275\u0275pipeBind1(3, 3, item_r33.labelKey) : ctx_r2.itemLabel(item_r33));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r33.value);
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_4_For_62_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 36)(1, "div", 79)(2, "span", 80)(3, "mat-icon");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "small");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "span", 81);
    \u0275\u0275element(11, "span");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 82);
    \u0275\u0275repeaterCreate(13, AdminStatsPopupComponent_Conditional_0_Conditional_4_For_62_For_14_Template, 6, 5, "div", 83, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const segment_r34 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(segment_r34.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(7, 5, segment_r34.labelKey));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(segment_r34.total);
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", ctx_r2.segmentPercent(segment_r34), "%");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(segment_r34.items);
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_4_For_72_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32)(1, "span")(2, "mat-icon");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275element(7, "i");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r35 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275property("ngClass", ctx_r2.toneClass(item_r35));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r35.icon || "location_on");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.itemLabel(item_r35));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r35.value);
    \u0275\u0275advance();
    \u0275\u0275styleProp("width", ctx_r2.itemPercent(item_r35), "%");
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_4_For_82_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32)(1, "span")(2, "mat-icon");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275element(7, "i");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r36 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275property("ngClass", ctx_r2.toneClass(item_r36));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r36.icon || "local_offer");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.itemLabel(item_r36));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r36.value);
    \u0275\u0275advance();
    \u0275\u0275styleProp("width", ctx_r2.itemPercent(item_r36), "%");
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 9)(1, "div", 10)(2, "span", 11)(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div")(6, "h3");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p");
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "i18n");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "div", 12);
    \u0275\u0275repeaterCreate(13, AdminStatsPopupComponent_Conditional_0_Conditional_4_For_14_Template, 12, 9, "article", 13, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(15, AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_15_Template, 86, 47, "section", 14);
    \u0275\u0275elementStart(16, "section", 15)(17, "article", 16)(18, "header")(19, "h3");
    \u0275\u0275text(20);
    \u0275\u0275pipe(21, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "span");
    \u0275\u0275text(23);
    \u0275\u0275pipe(24, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(25, AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_25_Template, 27, 25, "div", 17);
    \u0275\u0275elementStart(26, "div", 18);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(27, "svg", 19);
    \u0275\u0275pipe(28, "i18n");
    \u0275\u0275listener("pointerdown", function AdminStatsPopupComponent_Conditional_0_Conditional_4_Template_svg_pointerdown_27_listener($event) {
      const dashboard_r25 = \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.startTimelineDrag($event, dashboard_r25.timeline));
    })("pointermove", function AdminStatsPopupComponent_Conditional_0_Conditional_4_Template_svg_pointermove_27_listener($event) {
      const dashboard_r25 = \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.moveTimelineDrag($event, dashboard_r25.timeline));
    })("pointerup", function AdminStatsPopupComponent_Conditional_0_Conditional_4_Template_svg_pointerup_27_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.endTimelineDrag($event));
    })("pointercancel", function AdminStatsPopupComponent_Conditional_0_Conditional_4_Template_svg_pointercancel_27_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.endTimelineDrag($event));
    })("lostpointercapture", function AdminStatsPopupComponent_Conditional_0_Conditional_4_Template_svg_lostpointercapture_27_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.endTimelineDrag());
    });
    \u0275\u0275element(29, "line", 20)(30, "line", 21)(31, "line", 22);
    \u0275\u0275repeaterCreate(32, AdminStatsPopupComponent_Conditional_0_Conditional_4_For_33_Template, 1, 4, ":svg:polyline", 23, _forTrack0);
    \u0275\u0275conditionalCreate(34, AdminStatsPopupComponent_Conditional_0_Conditional_4_Conditional_34_Template, 3, 6);
    \u0275\u0275repeaterCreate(35, AdminStatsPopupComponent_Conditional_0_Conditional_4_For_36_Template, 1, 1, ":svg:rect", 24, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(37, "div", 25);
    \u0275\u0275repeaterCreate(38, AdminStatsPopupComponent_Conditional_0_Conditional_4_For_39_Template, 4, 6, "span", 26, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(40, "article", 27)(41, "header")(42, "h3");
    \u0275\u0275text(43);
    \u0275\u0275pipe(44, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "mat-icon");
    \u0275\u0275text(46, "category");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(47, "div", 28)(48, "div", 29);
    \u0275\u0275repeaterCreate(49, AdminStatsPopupComponent_Conditional_0_Conditional_4_For_50_Template, 1, 3, "span", 30, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(51, "div", 31);
    \u0275\u0275repeaterCreate(52, AdminStatsPopupComponent_Conditional_0_Conditional_4_For_53_Template, 8, 6, "div", 32, _forTrack0);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(54, "section", 33)(55, "article", 34)(56, "header")(57, "h3");
    \u0275\u0275text(58);
    \u0275\u0275pipe(59, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(60, "div", 35);
    \u0275\u0275repeaterCreate(61, AdminStatsPopupComponent_Conditional_0_Conditional_4_For_62_Template, 15, 7, "section", 36, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(63, "article", 37)(64, "header")(65, "h3");
    \u0275\u0275text(66);
    \u0275\u0275pipe(67, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(68, "mat-icon");
    \u0275\u0275text(69, "location_on");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(70, "div", 38);
    \u0275\u0275repeaterCreate(71, AdminStatsPopupComponent_Conditional_0_Conditional_4_For_72_Template, 8, 6, "div", 32, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(73, "article", 37)(74, "header")(75, "h3");
    \u0275\u0275text(76);
    \u0275\u0275pipe(77, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(78, "mat-icon");
    \u0275\u0275text(79, "local_offer");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(80, "div", 38);
    \u0275\u0275repeaterCreate(81, AdminStatsPopupComponent_Conditional_0_Conditional_4_For_82_Template, 8, 6, "div", 32, _forTrack0);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_8_0;
    let tmp_11_0;
    const dashboard_r25 = ctx;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngStyle", ctx_r2.healthRingStyle(dashboard_r25.healthScore));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(dashboard_r25.healthScore);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 16, dashboard_r25.healthLabelKey));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(11, 18, dashboard_r25.healthSummaryKey));
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r2.primaryKpis());
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_8_0 = ctx_r2.graph()) ? 15 : -1, tmp_8_0);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(21, 20, "stats.timeline.title"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(24, 22, "stats.timeline.window"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_11_0 = ctx_r2.selectedTimelinePoint(dashboard_r25)) ? 25 : -1, tmp_11_0);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("is-dragging", ctx_r2.timelineDragging());
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(28, 24, "stats.timeline.title"));
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r2.timelineMetrics);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.selectedTimelinePoint(dashboard_r25) ? 34 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(dashboard_r25.timeline);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r2.timelineMetrics);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(44, 26, "stats.event.types"));
    \u0275\u0275advance(6);
    \u0275\u0275repeater(dashboard_r25.eventTypes);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(dashboard_r25.eventTypes);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(59, 28, "stats.segment.overview"));
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r2.topSegments());
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(67, 30, "stats.top.cities"));
    \u0275\u0275advance(5);
    \u0275\u0275repeater(dashboard_r25.topCities);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(77, 32, "stats.top.topics"));
    \u0275\u0275advance(5);
    \u0275\u0275repeater(dashboard_r25.topTopics);
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "mat-icon");
    \u0275\u0275text(2, "warning");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r2.error());
  }
}
function AdminStatsPopupComponent_Conditional_0_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-popup", 5)(1, "div", 84)(2, "div", 85)(3, "article")(4, "mat-icon");
    \u0275\u0275text(5, "monitoring");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "strong");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p");
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "article")(13, "mat-icon");
    \u0275\u0275text(14, "hub");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "strong");
    \u0275\u0275text(16);
    \u0275\u0275pipe(17, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "p");
    \u0275\u0275text(19);
    \u0275\u0275pipe(20, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "article")(22, "mat-icon");
    \u0275\u0275text(23, "conversion_path");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "strong");
    \u0275\u0275text(25);
    \u0275\u0275pipe(26, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "p");
    \u0275\u0275text(28);
    \u0275\u0275pipe(29, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "article")(31, "mat-icon");
    \u0275\u0275text(32, "share");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "strong");
    \u0275\u0275text(34);
    \u0275\u0275pipe(35, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "p");
    \u0275\u0275text(37);
    \u0275\u0275pipe(38, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(39, "article")(40, "mat-icon");
    \u0275\u0275text(41, "travel_explore");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "strong");
    \u0275\u0275text(43);
    \u0275\u0275pipe(44, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "p");
    \u0275\u0275text(46);
    \u0275\u0275pipe(47, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(48, "article")(49, "mat-icon");
    \u0275\u0275text(50, "bubble_chart");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(51, "strong");
    \u0275\u0275text(52);
    \u0275\u0275pipe(53, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "p");
    \u0275\u0275text(55);
    \u0275\u0275pipe(56, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(57, "article")(58, "mat-icon");
    \u0275\u0275text(59, "repeat");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(60, "strong");
    \u0275\u0275text(61);
    \u0275\u0275pipe(62, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(63, "p");
    \u0275\u0275text(64);
    \u0275\u0275pipe(65, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(66, "article")(67, "mat-icon");
    \u0275\u0275text(68, "timeline");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(69, "strong");
    \u0275\u0275text(70);
    \u0275\u0275pipe(71, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(72, "p");
    \u0275\u0275text(73);
    \u0275\u0275pipe(74, "i18n");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(75, "div", 86)(76, "strong");
    \u0275\u0275text(77);
    \u0275\u0275pipe(78, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(79, "p");
    \u0275\u0275text(80);
    \u0275\u0275pipe(81, "i18n");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("model", ctx_r2.graphHelpPopupModel())("zIndex", 2400);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 20, "stats.graph.help.health.title"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(11, 22, "stats.graph.help.health.body"));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(17, 24, "stats.graph.help.edges.title"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(20, 26, "stats.graph.help.edges.body"));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(26, 28, "stats.graph.help.bridges.title"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(29, 30, "stats.graph.help.bridges.body"));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(35, 32, "stats.graph.help.reach.title"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(38, 34, "stats.graph.help.reach.body"));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(44, 36, "stats.graph.help.weak.title"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(47, 38, "stats.graph.help.weak.body"));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(53, 40, "stats.graph.help.clustering.title"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(56, 42, "stats.graph.help.clustering.body"));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(62, 44, "stats.graph.help.recurring.title"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(65, 46, "stats.graph.help.recurring.body"));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(71, 48, "stats.graph.help.evolution.title"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(74, 50, "stats.graph.help.evolution.body"));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(78, 52, "stats.graph.help.actions.title"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(81, 54, "stats.graph.help.actions.body"));
  }
}
function AdminStatsPopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-popup", 0)(1, "div", 1);
    \u0275\u0275conditionalCreate(2, AdminStatsPopupComponent_Conditional_0_Conditional_2_Template, 7, 3, "div", 2);
    \u0275\u0275conditionalCreate(3, AdminStatsPopupComponent_Conditional_0_Conditional_3_Template, 5, 3, "div", 3)(4, AdminStatsPopupComponent_Conditional_0_Conditional_4_Template, 83, 34);
    \u0275\u0275conditionalCreate(5, AdminStatsPopupComponent_Conditional_0_Conditional_5_Template, 5, 1, "div", 4);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, AdminStatsPopupComponent_Conditional_0_Conditional_6_Template, 82, 56, "app-popup", 5);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r2.statsPopupModel());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.loading() && ctx_r2.stats() ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.loading() && !ctx_r2.stats() ? 3 : (tmp_3_0 = ctx_r2.stats()) ? 4 : -1, tmp_3_0);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.error() ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.graphHelpOpen() ? 6 : -1);
  }
}
var AdminStatsPopupComponent = class _AdminStatsPopupComponent {
  admin = inject(AdminMenuStore);
  statsService = inject(AdminStatsService);
  i18n = inject(I18nService);
  userProfileStore = inject(UserProfileStore);
  loading = signal(false, ...ngDevMode ? [{ debugName: "loading" }] : (
    /* istanbul ignore next */
    []
  ));
  error = signal("", ...ngDevMode ? [{ debugName: "error" }] : (
    /* istanbul ignore next */
    []
  ));
  stats = signal(null, ...ngDevMode ? [{ debugName: "stats" }] : (
    /* istanbul ignore next */
    []
  ));
  selectedTimeline = signal(null, ...ngDevMode ? [{ debugName: "selectedTimeline" }] : (
    /* istanbul ignore next */
    []
  ));
  selectedGraphTimeline = signal(null, ...ngDevMode ? [{ debugName: "selectedGraphTimeline" }] : (
    /* istanbul ignore next */
    []
  ));
  selectedGraphFocus = signal(null, ...ngDevMode ? [{ debugName: "selectedGraphFocus" }] : (
    /* istanbul ignore next */
    []
  ));
  graphHelpOpen = signal(false, ...ngDevMode ? [{ debugName: "graphHelpOpen" }] : (
    /* istanbul ignore next */
    []
  ));
  timelineDragging = signal(false, ...ngDevMode ? [{ debugName: "timelineDragging" }] : (
    /* istanbul ignore next */
    []
  ));
  graphTimelineDragging = signal(false, ...ngDevMode ? [{ debugName: "graphTimelineDragging" }] : (
    /* istanbul ignore next */
    []
  ));
  topSegments = computed(() => this.stats()?.segments ?? [], ...ngDevMode ? [{ debugName: "topSegments" }] : (
    /* istanbul ignore next */
    []
  ));
  primaryKpis = computed(() => this.stats()?.kpis ?? [], ...ngDevMode ? [{ debugName: "primaryKpis" }] : (
    /* istanbul ignore next */
    []
  ));
  graph = computed(() => this.stats()?.graph ?? null, ...ngDevMode ? [{ debugName: "graph" }] : (
    /* istanbul ignore next */
    []
  ));
  graphBridgeUsers = computed(() => this.graph()?.bridgeUsers.slice(0, 5) ?? [], ...ngDevMode ? [{ debugName: "graphBridgeUsers" }] : (
    /* istanbul ignore next */
    []
  ));
  graphCommunities = computed(() => this.graph()?.communities.slice(0, 5) ?? [], ...ngDevMode ? [{ debugName: "graphCommunities" }] : (
    /* istanbul ignore next */
    []
  ));
  loadGeneration = 0;
  popupOpen = false;
  timelineMetrics = [
    { key: "activeUsers", labelKey: "stats.timeline.active.users", tone: "blue" },
    { key: "registrations", labelKey: "stats.timeline.registrations", tone: "green" },
    { key: "ratings", labelKey: "stats.timeline.ratings", tone: "purple" },
    { key: "activity", labelKey: "stats.timeline.activity", tone: "gold" },
    { key: "messages", labelKey: "stats.timeline.messages", tone: "slate" },
    { key: "moderation", labelKey: "stats.timeline.moderation", tone: "red" }
  ];
  graphTimelineMetrics = [
    { key: "activeEdges", labelKey: "stats.graph.timeline.active.edges", tone: "blue" },
    { key: "newEdges", labelKey: "stats.graph.timeline.new.edges", tone: "green" },
    { key: "recurringEdges", labelKey: "stats.graph.timeline.recurring.edges", tone: "gold" },
    { key: "weakTies", labelKey: "stats.graph.timeline.weak.ties", tone: "purple" },
    { key: "networkQuality", labelKey: "stats.graph.timeline.network.quality", tone: "slate" },
    { key: "clusterQuality", labelKey: "stats.graph.timeline.cluster.quality", tone: "red" }
  ];
  constructor() {
    effect(() => {
      const isOpen = this.admin.activePopup() === "stats";
      if (isOpen && !this.popupOpen) {
        this.popupOpen = true;
        this.resetForOpen();
        queueMicrotask(() => void this.load());
        return;
      }
      if (!isOpen && this.popupOpen) {
        this.popupOpen = false;
        this.cancelActiveLoad();
      }
    });
  }
  close() {
    this.admin.closePopup();
  }
  statsPopupModel() {
    return {
      title: "stats",
      subtitle: this.statsSubtitle(),
      ariaLabel: "stats",
      closeAriaLabel: "close",
      size: "wide",
      height: "full",
      headerTone: "accent",
      bodyLayout: "fill",
      headerActions: [
        {
          id: "stats-refresh",
          icon: "refresh",
          ariaLabel: "refresh.stats",
          palette: "blue",
          disabled: this.loading(),
          compactOnMobile: true
        }
      ],
      onClose: () => this.close(),
      onAction: (event) => this.onStatsPopupAction(event)
    };
  }
  graphHelpPopupModel() {
    return {
      title: "stats.graph.help.title",
      subtitle: "stats.graph.help.intro",
      ariaLabel: "stats.graph.help.title",
      closeAriaLabel: "close",
      size: "default",
      height: "auto",
      headerTone: "accent",
      backdropTone: "dim",
      onClose: () => this.closeGraphHelp()
    };
  }
  onStatsPopupAction(event) {
    if (event.action.id === "stats-refresh") {
      void this.refresh();
    }
  }
  statsSubtitle() {
    const label = this.i18n.translate("stats.snapshot.subtitle");
    const date = this.formatDate(this.stats()?.generatedAtIso);
    return date ? `${label}: ${date}` : label;
  }
  openGraphHelp() {
    this.graphHelpOpen.set(true);
  }
  closeGraphHelp() {
    this.graphHelpOpen.set(false);
  }
  async refresh() {
    await this.load();
  }
  healthRingStyle(score) {
    const value = this.clamp(score ?? 0, 0, 100);
    return {
      background: `conic-gradient(#2f8f5b ${value * 3.6}deg, rgba(42, 81, 129, 0.14) 0deg)`
    };
  }
  itemPercent(item) {
    const total = Math.max(1, Math.trunc(Number(item.total) || 0));
    return this.clamp(Math.round(Math.trunc(Number(item.value) || 0) * 100 / total), 0, 100);
  }
  metricPercent(metric) {
    return this.clamp(Math.trunc(Number(metric.percent) || 0), 0, 100);
  }
  segmentPercent(segment) {
    return this.clamp(Math.trunc(Number(segment.healthPercent) || 0), 0, 100);
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
  moveTimelineDrag(event, points) {
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
  selectGraphTimelinePoint(point) {
    this.selectedGraphTimeline.set(point);
  }
  startGraphTimelineDrag(event, points) {
    if (!points.length) {
      return;
    }
    this.graphTimelineDragging.set(true);
    this.updateGraphTimelineFromPointer(event, points);
    const target = event.currentTarget;
    target?.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }
  moveGraphTimelineDrag(event, points) {
    this.updateGraphTimelineFromPointer(event, points);
    if (this.graphTimelineDragging()) {
      event.preventDefault();
    }
  }
  endGraphTimelineDrag(event) {
    if (!this.graphTimelineDragging()) {
      return;
    }
    this.graphTimelineDragging.set(false);
    const target = event?.currentTarget;
    if (event && target?.hasPointerCapture?.(event.pointerId)) {
      target.releasePointerCapture(event.pointerId);
    }
  }
  selectGraphFocus(label, value, labelKey = "") {
    this.selectedGraphFocus.set({
      label: `${label ?? ""}`.trim(),
      labelKey: `${labelKey ?? ""}`.trim(),
      value: `${value ?? ""}`.trim()
    });
  }
  selectedTimelinePoint(dashboard) {
    const selected = this.selectedTimeline();
    if (selected && dashboard.timeline.some((point) => point.dateKey === selected.dateKey)) {
      return selected;
    }
    return dashboard.timeline.at(-1) ?? null;
  }
  selectedTimelineIndex(dashboard) {
    const point = this.selectedTimelinePoint(dashboard);
    if (!point) {
      return -1;
    }
    return dashboard.timeline.findIndex((item) => item.dateKey === point.dateKey);
  }
  selectedTimelineX(dashboard) {
    const index = this.selectedTimelineIndex(dashboard);
    return index < 0 ? this.timelineX(Math.max(0, dashboard.timeline.length - 1), dashboard.timeline.length) : this.timelineX(index, dashboard.timeline.length);
  }
  selectedTimelineY(dashboard) {
    const point = this.selectedTimelinePoint(dashboard);
    if (!point) {
      return this.timelineY(0, 1);
    }
    return this.timelineY(point.activeUsers, this.timelineMetricMax(dashboard.timeline, "activeUsers"));
  }
  selectedGraphTimelinePoint(graph) {
    const selected = this.selectedGraphTimeline();
    if (selected && graph.timeline.some((point) => point.dateKey === selected.dateKey)) {
      return selected;
    }
    return graph.timeline.at(-1) ?? null;
  }
  selectedGraphTimelineIndex(graph) {
    const point = this.selectedGraphTimelinePoint(graph);
    if (!point) {
      return -1;
    }
    return graph.timeline.findIndex((item) => item.dateKey === point.dateKey);
  }
  selectedGraphTimelineX(graph) {
    const index = this.selectedGraphTimelineIndex(graph);
    return index < 0 ? this.timelineX(Math.max(0, graph.timeline.length - 1), graph.timeline.length) : this.timelineX(index, graph.timeline.length);
  }
  selectedGraphTimelineY(graph) {
    const point = this.selectedGraphTimelinePoint(graph);
    if (!point) {
      return this.timelineY(0, 1);
    }
    return this.timelineY(point.activeEdges, this.graphTimelineMetricMax(graph.timeline, "activeEdges"));
  }
  timelineChartPoints(points, metric) {
    if (!points.length) {
      return "";
    }
    const max = this.timelineMetricMax(points, metric);
    return points.map((point, index) => `${this.timelineX(index, points.length)},${this.timelineY(this.timelineMetricValue(point, metric), max)}`).join(" ");
  }
  graphTimelineChartPoints(points, metric) {
    if (!points.length) {
      return "";
    }
    const max = this.graphTimelineMetricMax(points, metric);
    return points.map((point, index) => `${this.timelineX(index, points.length)},${this.timelineY(this.graphTimelineMetricValue(point, metric), max)}`).join(" ");
  }
  timelineX(index, total) {
    return Math.round(12 + Math.max(0, index) * 276 / Math.max(1, total - 1));
  }
  timelineY(value, max) {
    return Math.round(94 - this.clamp(value, 0, max) * 72 / Math.max(1, max));
  }
  timelineMetricValue(point, metric) {
    switch (metric) {
      case "activity":
        return Math.max(0, Number(point.events) || 0) + Math.max(0, Number(point.assets) || 0);
      case "activeUsers":
        return Math.max(0, Number(point.activeUsers) || 0);
      case "registrations":
        return Math.max(0, Number(point.registrations) || 0);
      case "ratings":
        return Math.max(0, Number(point.ratings) || 0);
      case "messages":
        return Math.max(0, Number(point.messages) || 0);
      case "moderation":
        return Math.max(0, Number(point.moderation) || 0);
      default:
        return 0;
    }
  }
  graphTimelineMetricValue(point, metric) {
    switch (metric) {
      case "activeEdges":
        return Math.max(0, Number(point.activeEdges) || 0);
      case "newEdges":
        return Math.max(0, Number(point.newEdges) || 0);
      case "recurringEdges":
        return Math.max(0, Number(point.recurringEdges) || 0);
      case "weakTies":
        return Math.max(0, Number(point.weakTies) || 0);
      case "networkQuality":
        return Math.max(0, Number(point.networkQuality) || 0);
      case "clusterQuality":
        return Math.max(0, Number(point.clusterQuality) || 0);
      default:
        return 0;
    }
  }
  timelineMetricMax(points, metric) {
    return Math.max(1, ...points.map((point) => this.timelineMetricValue(point, metric)));
  }
  graphTimelineMetricMax(points, metric) {
    return Math.max(1, ...points.map((point) => this.graphTimelineMetricValue(point, metric)));
  }
  graphNodeX(index, total, radius = 34) {
    const angle = this.graphNodeAngle(index, total);
    return Math.round(50 + Math.cos(angle) * radius);
  }
  graphNodeY(index, total, radius = 34) {
    const angle = this.graphNodeAngle(index, total);
    return Math.round(50 + Math.sin(angle) * radius);
  }
  graphNodeRadius(item) {
    return this.clamp(5 + this.itemPercent(item) / 10, 6, 14);
  }
  graphCommunityX(index, total) {
    return this.graphFixedPoint(index, total, [
      [26, 28],
      [70, 30],
      [30, 72],
      [72, 70],
      [50, 18]
    ], 0);
  }
  graphCommunityY(index, total) {
    return this.graphFixedPoint(index, total, [
      [26, 28],
      [70, 30],
      [30, 72],
      [72, 70],
      [50, 18]
    ], 1);
  }
  graphBridgeX(index, total) {
    return this.graphFixedPoint(index, total, [
      [50, 50],
      [49, 32],
      [50, 68],
      [39, 51],
      [62, 52]
    ], 0);
  }
  graphBridgeY(index, total) {
    return this.graphFixedPoint(index, total, [
      [50, 50],
      [49, 32],
      [50, 68],
      [39, 51],
      [62, 52]
    ], 1);
  }
  graphCommunityRadius(item) {
    return this.clamp(9 + this.itemPercent(item) / 7, 10, 16);
  }
  graphBridgeRadius(item) {
    return this.clamp(5 + this.itemPercent(item) / 18, 6, 10);
  }
  graphBridgeCommunityIndex(index, total, offset) {
    if (total <= 0) {
      return 0;
    }
    return (Math.max(0, index) + Math.max(0, offset)) % total;
  }
  compactGraphValue(value) {
    const numericValue = Math.max(0, Math.trunc(Number(value) || 0));
    if (numericValue >= 1e3) {
      return `${Math.round(numericValue / 100) / 10}k`;
    }
    return `${numericValue}`;
  }
  graphFixedPoint(index, total, points, axis) {
    if (index >= 0 && index < points.length) {
      return points[index][axis] ?? 50;
    }
    const angle = this.graphNodeAngle(index, Math.max(1, total));
    const radius = axis === 0 ? 32 : 30;
    const center = axis === 0 ? 50 : 50;
    const trig = axis === 0 ? Math.cos(angle) : Math.sin(angle);
    return Math.round(center + trig * radius);
  }
  graphAdminActions(graph) {
    const signalValue = (key) => {
      const signal2 = graph.signals.find((item) => item.key === key);
      return Math.trunc(Number(signal2?.value) || 0);
    };
    const metricValue = (key) => {
      const metric = graph.metrics.find((item) => item.key === key);
      return Math.trunc(Number(metric?.value) || 0);
    };
    const actions = [];
    const add = (key, labelKey, icon, tone) => {
      if (actions.some((action) => action.key === key)) {
        return;
      }
      actions.push({ key, labelKey, icon, tone });
    };
    if (graph.healthScore < 42 || metricValue("graph-edges") < 24) {
      add("collect-evidence", "stats.graph.action.collect.evidence", "add_chart", "blue");
    }
    if (signalValue("reachability-2-hop") < 58) {
      add("increase-reach", "stats.graph.action.increase.reach", "share", "blue");
    }
    if (signalValue("bridge-coverage") < 22 || metricValue("graph-bridges") < 3) {
      add("activate-bridges", "stats.graph.action.activate.bridges", "conversion_path", "red");
    }
    if (signalValue("weak-tie-ratio") < 30) {
      add("open-discovery", "stats.graph.action.open.discovery", "travel_explore", "purple");
    }
    if (signalValue("clustering") > 68 || signalValue("largest-community") > 52) {
      add("break-cliques", "stats.graph.action.break.cliques", "hub", "gold");
    }
    if (signalValue("recurring-edge-ratio") < 28) {
      add("grow-recurring", "stats.graph.action.grow.recurring", "repeat", "green");
    }
    if (signalValue("network-quality") < 48) {
      add("improve-quality", "stats.graph.action.improve.quality", "ssid_chart", "slate");
    }
    if (signalValue("cluster-quality") < 48) {
      add("balance-clusters", "stats.graph.action.balance.clusters", "bubble_chart", "green");
    }
    return actions.length > 0 ? actions.slice(0, 4) : [{ key: "keep-balance", labelKey: "stats.graph.action.keep.balance", icon: "check_circle", tone: "green" }];
  }
  toneClass(value) {
    const tone = `${value?.tone ?? ""}`.trim();
    return ["blue", "green", "gold", "red", "purple", "slate"].includes(tone) ? `is-${tone}` : "is-slate";
  }
  itemLabel(item) {
    return `${item.label ?? ""}`.trim() || `${item.key ?? ""}`.trim();
  }
  formatDate(value) {
    const date = /* @__PURE__ */ new Date(`${value ?? ""}`);
    if (Number.isNaN(date.getTime())) {
      return `${value ?? ""}`.trim();
    }
    return date.toLocaleString(void 0, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  }
  async load() {
    const generation = ++this.loadGeneration;
    this.loading.set(true);
    this.error.set("");
    try {
      const dashboard = await this.statsService.loadStatsDashboard(this.activeAdminId());
      if (generation !== this.loadGeneration) {
        return;
      }
      this.stats.set(dashboard);
      this.selectedTimeline.set(dashboard.timeline.at(-1) ?? null);
      this.selectedGraphTimeline.set(dashboard.graph.timeline.at(-1) ?? null);
      this.selectedGraphFocus.set({
        labelKey: "stats.graph.metric.health",
        value: `${dashboard.graph.healthScore}`
      });
    } catch (error) {
      if (generation === this.loadGeneration) {
        this.error.set(error instanceof Error ? error.message : "Unable to load stats.");
      }
    } finally {
      if (generation === this.loadGeneration) {
        this.loading.set(false);
      }
    }
  }
  resetForOpen() {
    this.loadGeneration += 1;
    this.error.set("");
    this.stats.set(null);
    this.selectedTimeline.set(null);
    this.selectedGraphTimeline.set(null);
    this.selectedGraphFocus.set(null);
    this.graphHelpOpen.set(false);
    this.timelineDragging.set(false);
    this.graphTimelineDragging.set(false);
    this.loading.set(true);
  }
  cancelActiveLoad() {
    this.loadGeneration += 1;
    this.loading.set(false);
    this.graphHelpOpen.set(false);
    this.timelineDragging.set(false);
    this.graphTimelineDragging.set(false);
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
  updateGraphTimelineFromPointer(event, points) {
    const target = event.currentTarget;
    if (!target || !points.length) {
      return;
    }
    const bounds = target.getBoundingClientRect();
    const width = Math.max(1, bounds.width);
    const viewBoxX = (event.clientX - bounds.left) / width * 300;
    const ratio = this.clamp((viewBoxX - 12) / 276, 0, 1);
    const index = Math.round(ratio * Math.max(0, points.length - 1));
    this.selectedGraphTimeline.set(points[this.clamp(index, 0, points.length - 1)] ?? points.at(-1) ?? null);
  }
  graphNodeAngle(index, total) {
    return -Math.PI / 2 + Math.max(0, index) * Math.PI * 2 / Math.max(1, total);
  }
  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
  activeAdminId() {
    return this.userProfileStore.activeUserId().trim();
  }
  static \u0275fac = function AdminStatsPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminStatsPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminStatsPopupComponent, selectors: [["app-admin-stats-popup"]], decls: 1, vars: 1, consts: [[3, "model"], [1, "stats-body"], ["aria-busy", "true", 1, "stats-loading-overlay"], ["aria-busy", "true", 1, "stats-loading-state"], [1, "stats-error"], [3, "model", "zIndex"], [1, "stats-loading-scrim"], [1, "stats-loading-card"], ["kind", "load-ring", "state", "loading"], [1, "stats-hero"], [1, "stats-health-card"], [1, "stats-health-ring", 3, "ngStyle"], [1, "stats-kpi-grid"], [1, "stats-kpi-card", 3, "ngClass"], [1, "stats-panel", "stats-graph-panel"], [1, "stats-grid", "stats-grid-charts"], [1, "stats-panel", "stats-timeline-panel"], [1, "stats-timeline-readout"], [1, "stats-timeline-chart"], ["viewBox", "0 0 300 108", "role", "img", 1, "motion-static", 3, "pointerdown", "pointermove", "pointerup", "pointercancel", "lostpointercapture"], ["x1", "12", "y1", "94", "x2", "288", "y2", "94", 1, "stats-timeline-axis"], ["x1", "12", "y1", "58", "x2", "288", "y2", "58", 1, "stats-timeline-gridline"], ["x1", "12", "y1", "22", "x2", "288", "y2", "22", 1, "stats-timeline-gridline"], [1, "stats-timeline-line", 3, "ngClass"], ["y", "8", "width", "16", "height", "92", "tabindex", "0", 1, "stats-timeline-hit", "motion-static"], [1, "stats-chart-legend"], [3, "ngClass"], [1, "stats-panel", "stats-event-types-panel"], [1, "stats-donut-card"], [1, "stats-donut"], [3, "ngClass", "flex-grow"], [1, "stats-breakdown-list", "stats-breakdown-compact"], [1, "stats-breakdown-row", 3, "ngClass"], [1, "stats-grid"], [1, "stats-panel", "stats-panel-wide"], [1, "stats-segments"], [1, "stats-segment-row"], [1, "stats-panel"], [1, "stats-breakdown-list"], [1, "stats-kpi-icon"], [1, "stats-kpi-caption"], [1, "stats-kpi-bar"], [1, "stats-graph-header-actions"], ["type", "button", 1, "stats-graph-help-btn", 3, "click"], [1, "stats-graph-layout"], [1, "stats-graph-map"], ["viewBox", "0 0 100 100", "role", "img"], ["tabindex", "0", "role", "button", 1, "stats-graph-community", 3, "ngClass"], ["tabindex", "0", "role", "button", 1, "stats-graph-node", 3, "ngClass"], [1, "stats-graph-map-legend"], [1, "is-community"], [1, "is-bridge"], [1, "is-link"], [1, "stats-graph-copy"], [1, "stats-graph-actions"], [1, "stats-graph-focus"], [1, "stats-graph-metrics"], [1, "stats-graph-signals"], [1, "stats-graph-signal", 3, "ngClass"], [1, "stats-graph-bottom"], [1, "stats-graph-rank"], [1, "stats-graph-timeline"], [1, "stats-timeline-chart", "stats-graph-timeline-chart"], [1, "stats-graph-link"], ["tabindex", "0", "role", "button", 1, "stats-graph-community", 3, "click", "focus", "ngClass"], [1, "stats-graph-community-count"], [1, "stats-graph-community-caption"], ["tabindex", "0", "role", "button", 1, "stats-graph-node", 3, "click", "focus", "ngClass"], [1, "stats-graph-node-count"], [1, "is-blue"], [1, "is-green"], [1, "is-gold"], [1, "is-purple"], [1, "is-slate"], [1, "is-red"], ["y1", "12", "y2", "96", 1, "stats-timeline-scrub-guide"], ["r", "10", 1, "stats-timeline-scrub-halo"], ["r", "5", 1, "stats-timeline-scrub-knob"], ["y", "8", "width", "16", "height", "92", "tabindex", "0", 1, "stats-timeline-hit", "motion-static", 3, "focus"], [1, "stats-segment-title"], [1, "stats-segment-icon"], [1, "stats-segment-bar"], [1, "stats-segment-items"], [1, "stats-mini-row", 3, "ngClass"], [1, "stats-graph-help-content"], [1, "stats-graph-help-grid"], [1, "stats-graph-help-actions"]], template: function AdminStatsPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, AdminStatsPopupComponent_Conditional_0_Template, 7, 5, "app-popup", 0);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.admin.activePopup() === "stats" ? 0 : -1);
    }
  }, dependencies: [CommonModule, NgClass, NgStyle, MatIconModule, MatIcon, IndicatorComponent, PopupComponent, I18nPipe], styles: ['\n[_nghost-%COMP%] {\n  --interactive-motion-duration: 160ms;\n  --interactive-motion-ease: cubic-bezier(0.22, 1, 0.36, 1);\n  --interactive-hover-lift: -1px;\n  --interactive-hover-scale: 1.01;\n  --interactive-hover-brightness: 1.01;\n  --interactive-press-scale: 0.97;\n  --interactive-press-brightness: 0.97;\n}\n[_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]) {\n  -webkit-tap-highlight-color: transparent;\n  transition:\n    transform var(--interactive-motion-duration) var(--interactive-motion-ease),\n    filter var(--interactive-motion-duration) var(--interactive-motion-ease),\n    box-shadow var(--interactive-motion-duration) var(--interactive-motion-ease),\n    background-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    border-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    color var(--interactive-motion-duration) var(--interactive-motion-ease);\n  transform-origin: center;\n}\n[_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):focus-visible {\n  outline: 2px solid rgba(66, 110, 182, 0.44);\n  outline-offset: 2px;\n}\n@media (hover: hover) and (pointer: fine) {\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):hover {\n    transform: translateY(var(--interactive-hover-lift)) scale(var(--interactive-hover-scale));\n    filter: brightness(var(--interactive-hover-brightness));\n  }\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  [_ngcontent-%COMP%]:where(.motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):hover {\n    box-shadow: 0 3px 10px rgba(16, 29, 48, 0.14);\n  }\n}\n@keyframes _ngcontent-%COMP%_shared-mobile-touch-feedback {\n  0% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n  45% {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  100% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n}\n@media (hover: none), (pointer: coarse) {\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    animation: _ngcontent-%COMP%_shared-mobile-touch-feedback 0.2s ease;\n  }\n}\n.app-popup[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%] {\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.app-popup[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%] {\n  font-family: inherit;\n}\n.popup-filter-picker[_ngcontent-%COMP%], \n.activities-view-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 60;\n  margin-left: auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-filter-picker-secondary[_ngcontent-%COMP%], \n.activities-secondary-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 61;\n}\n.selector-like[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%] {\n  width: fit-content !important;\n  min-width: 0 !important;\n  max-width: 100%;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: auto !important;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%] {\n  width: auto !important;\n  flex: 0 1 auto;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: auto !important;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%] {\n  margin-left: 0.28rem;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%] {\n  min-width: 174px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  border: 1px solid #c8d3e2;\n  border-radius: 999px;\n  box-shadow: 0 2px 6px rgba(38, 60, 92, 0.08);\n  padding: 0.12rem 0.5rem 0.12rem 0.84rem;\n  background: #f8f9fb;\n}\n.profile-status-select-wrap.selector-like[_ngcontent-%COMP%] {\n  min-height: 36px;\n}\n.status-option-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.2rem;\n  text-transform: lowercase;\n  width: 100%;\n  min-width: 0;\n}\n.status-option-content[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child {\n  white-space: nowrap;\n}\n.status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  flex: 0 0 16px;\n}\n.rate-filter-count-badge[_ngcontent-%COMP%] {\n  margin-left: auto;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  border: 1px solid #fff;\n  background: #d84d4d;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  font-size: 0.68rem;\n  font-weight: 800;\n  line-height: 1;\n  box-shadow: 0 2px 8px rgba(120, 24, 24, 0.22);\n}\n.rate-filter-trigger-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  margin-left: 0;\n  z-index: 2;\n}\n.popup-filter-control[_ngcontent-%COMP%], \n.activities-rate-filter-select[_ngcontent-%COMP%], \n.activities-primary-filter-select[_ngcontent-%COMP%], \n.activities-event-scope-filter-select[_ngcontent-%COMP%], \n.activities-chat-context-filter-select[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: visible;\n}\n.popup-filter-panel[_ngcontent-%COMP%], \n.activities-view-picker-panel[_ngcontent-%COMP%] {\n  position: absolute;\n  top: calc(100% + 0.32rem);\n  right: 0;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 10px;\n  background: #fff;\n  box-shadow: 0 10px 24px rgba(17, 29, 48, 0.22);\n  padding: 0.24rem;\n  min-width: 128px;\n  z-index: 40;\n  display: grid;\n  gap: 0.16rem;\n}\n.popup-filter-option[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%] {\n  border: 0;\n  background: #fff;\n  border-radius: 8px;\n  min-height: 32px;\n  padding: 0.34rem 0.44rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.34rem;\n  color: #1e3658;\n  cursor: pointer;\n  text-align: left;\n}\n.popup-filter-option[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-filter-option[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.popup-filter-option[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:not(.rate-filter-count-badge), \n.activities-view-option[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:not(.rate-filter-count-badge) {\n  flex: 1 1 auto;\n  min-width: 0;\n  text-align: left;\n}\n.popup-mobile-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-primary-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-event-scope-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-chat-context-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-rate-filter-picker[_ngcontent-%COMP%] {\n  position: relative;\n}\n.popup-mobile-filter-panel[_ngcontent-%COMP%], \n.activities-mobile-filter-panel[_ngcontent-%COMP%], \n.activities-mobile-rate-filter-panel[_ngcontent-%COMP%] {\n  top: calc(100% + 0.24rem);\n  right: 0;\n  min-width: 210px;\n  z-index: 65;\n}\n.popup-mobile-sheet-title[_ngcontent-%COMP%], \n.activities-mobile-sheet-title[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  padding: 0 0.14rem;\n  color: #1c3354;\n  font-size: 0.94rem;\n  font-weight: 800;\n}\n.popup-mobile-sheet-title[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.activities-mobile-sheet-title[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n:is(.popup-filter-bar[_ngcontent-%COMP%], .experience-toolbar[_ngcontent-%COMP%], .assets-toolbar[_ngcontent-%COMP%])   .popup-view-fab[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child, \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%] {\n  font-weight: 400 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option .status-option-content {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  width: 100%;\n  min-width: 0;\n  column-gap: 0.34rem;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option .rate-filter-count-badge {\n  margin-left: 0;\n  justify-self: end;\n}\n[_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.selector-options-panel), \n[_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.status-options-panel) {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n@media (max-width: 760px) {\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%] {\n    width: 100%;\n    min-width: 0;\n    box-sizing: border-box;\n    border: 1px solid rgba(58, 81, 114, 0.24);\n    border-radius: 12px;\n    background: #f7f9fd;\n    min-height: 42px;\n    padding: 0.46rem 0.62rem;\n    justify-content: flex-start;\n    gap: 0.36rem;\n  }\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%] {\n    box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.24);\n    filter: brightness(0.95);\n  }\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%] {\n    margin-left: auto;\n    flex: 0 0 auto;\n  }\n  [_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.profile-bottom-sheet-panel) {\n    position: fixed !important;\n    left: 0 !important;\n    right: 0 !important;\n    bottom: 0 !important;\n    top: auto !important;\n    width: 100vw !important;\n    max-width: 100vw !important;\n    transform: none !important;\n  }\n  [_nghost-%COMP%]     .mat-mdc-select-panel.profile-bottom-sheet-panel {\n    width: 100vw !important;\n    max-width: 100vw !important;\n    max-height: min(54vh, 420px) !important;\n    margin: 0 !important;\n    border-radius: 16px 16px 0 0 !important;\n    border: 1px solid #d6deea;\n    border-bottom: 0;\n    box-shadow: 0 -14px 28px rgba(15, 29, 52, 0.24);\n    padding-top: 0.38rem;\n    padding-bottom: max(0.55rem, env(safe-area-inset-bottom));\n  }\n}\n.popup-view-fab[_ngcontent-%COMP%] {\n  height: 34px;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 999px;\n  background: #f3f7ff;\n  color: #2c4c74;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0 0.62rem;\n  cursor: pointer;\n}\n.popup-view-fab[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-view-fab[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.74rem;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.event-visibility-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 22;\n  margin-left: auto;\n  flex: 0 0 auto;\n}\n.event-visibility-trigger[_ngcontent-%COMP%] {\n  flex-wrap: nowrap;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-public[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-public[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e6f6ef);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-friends[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-friends[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e8f1fd);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-host[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-host[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6efe2);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-inactive[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-inactive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f2f3f5);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-public[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-public[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-friends[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-friends[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-host[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-host[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-inactive[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-inactive[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.48rem 0.56rem;\n  font: inherit;\n  color: var(--text-main);\n  background: #fff;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  resize: vertical;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n  outline: 0;\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n}\n.popup-surface-form-grid[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  max-width: none;\n  width: 100%;\n  margin: 0;\n  justify-content: stretch;\n  align-content: start;\n  align-items: start;\n  column-gap: 1rem;\n  row-gap: 0.9rem;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-rows: min-content;\n  gap: 0;\n  font-weight: 600;\n  color: rgba(26, 44, 69, 0.88);\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  min-height: 40px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  min-height: 96px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   .profile-status-select-wrap.selector-like[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   .profile-status-select-wrap.selector-like[_ngcontent-%COMP%] {\n  min-height: 40px;\n  height: 40px;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  min-height: 32px;\n}\n.popup-surface-description-field[_ngcontent-%COMP%], \n.experience-description-field[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.popup-surface-actions[_ngcontent-%COMP%], \n.experience-form-actions[_ngcontent-%COMP%] {\n  justify-content: center;\n  padding-top: 0.2rem;\n}\n.popup-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.link-btn[_ngcontent-%COMP%] {\n  border: 1px solid var(--line-strong);\n  border-radius: 999px;\n  background: #fff;\n  color: #1f3350;\n  font: inherit;\n  font-size: 0.83rem;\n  padding: 0.38rem 0.76rem;\n  cursor: pointer;\n}\n.neutral-btn[_ngcontent-%COMP%] {\n  background: #f2f4fa;\n  border-color: rgba(23, 33, 54, 0.12);\n}\n.primary-btn[_ngcontent-%COMP%] {\n  background: #4776b7;\n  border-color: #4776b7;\n  color: #fff;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.date-picker-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: #566b86;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  min-width: 80px;\n  width: 100%;\n  font-size: 0.8rem;\n  font-weight: 700;\n  text-transform: lowercase;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-content: flex-start;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%] {\n  margin-left: auto;\n}\n.status-public[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.status-friends[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.status-host[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.status-inactive[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-public[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-friends[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-host[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-inactive[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.profile-status-select-wrap.status-public[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.profile-status-select-wrap.status-friends[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.profile-status-select-wrap.status-host[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.profile-status-select-wrap.status-inactive[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.profile-details-values-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: rgba(44, 67, 100, 0.72);\n}\n.profile-details-values-btn[_ngcontent-%COMP%] {\n  min-height: 36px;\n  height: 36px;\n  box-sizing: border-box;\n  padding-top: 0;\n  padding-bottom: 0;\n}\n.profile-details-values-btn[_ngcontent-%COMP%]   .status-option-content.profile-details-selected-badges[_ngcontent-%COMP%] {\n  display: inline-grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  column-gap: 0.26rem;\n  min-width: 0;\n  width: 100%;\n}\n.profile-details-values-btn.profile-details-values-tone-values[_ngcontent-%COMP%]   .profile-details-inline-chip[_ngcontent-%COMP%] {\n  max-width: calc(100% - 2.6rem);\n}\n.profile-details-values-btn.profile-details-values-tone-interest[_ngcontent-%COMP%]   .profile-details-inline-chip[_ngcontent-%COMP%] {\n  max-width: calc((100% - 3.2rem) / 2);\n}\n.profile-details-values-btn.profile-details-values-tone-values[_ngcontent-%COMP%]   .profile-details-inline-overflow[_ngcontent-%COMP%] {\n  color: #1e6b5a;\n}\n.profile-details-values-btn.profile-details-values-tone-interest[_ngcontent-%COMP%]   .profile-details-inline-overflow[_ngcontent-%COMP%] {\n  color: #2e5a90;\n}\n.values-header-chips[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.28rem;\n  flex: 0 0 100%;\n  margin-left: 0;\n  margin-top: 0.34rem;\n  max-width: 100%;\n  overflow: visible;\n  white-space: normal;\n  padding-bottom: 0;\n}\n.popup-title-values[_ngcontent-%COMP%] {\n  margin-right: 0.38rem;\n}\n.values-selected-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(76, 99, 136, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9ff 0%,\n      #eef3ff 100%);\n  color: #24416a;\n  border-radius: 999px;\n  min-height: 26px;\n  padding: 0.18rem 0.46rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-size: 0.7rem;\n  font-weight: 700;\n  cursor: pointer;\n  flex: 0 0 auto;\n}\n.values-selected-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.values-selected-chip.section-family[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1ea 0%,\n      #ffe6dd 100%);\n  border-color: rgba(160, 90, 51, 0.32);\n  color: #8b4d2b;\n}\n.values-selected-chip.section-ambition[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff7e8 0%,\n      #ffefd7 100%);\n  border-color: rgba(160, 106, 20, 0.32);\n  color: #9a6614;\n}\n.values-selected-chip.section-lifestyle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f5 0%,\n      #e0f2ee 100%);\n  border-color: rgba(45, 125, 120, 0.32);\n  color: #2a6e6a;\n}\n.values-selected-chip.section-beliefs[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f0ecff 0%,\n      #e8e1fa 100%);\n  border-color: rgba(95, 78, 160, 0.32);\n  color: #564793;\n}\n.values-selected-chip.section-social[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n  color: #2d5ea8;\n}\n.values-selected-chip.section-arts[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2edfb 0%,\n      #e9e2f9 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n  color: #654ca1;\n}\n.values-selected-chip.section-food[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4e8 0%,\n      #fee9d6 100%);\n  border-color: rgba(170, 97, 28, 0.32);\n  color: #9d611c;\n}\n.values-selected-chip.section-active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.values-selected-chip.section-mind[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f6 0%,\n      #def1ee 100%);\n  border-color: rgba(37, 124, 118, 0.32);\n  color: #2d7d78;\n}\n.values-selected-chip.section-identity[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n  border-color: rgba(88, 78, 159, 0.32);\n  color: #5a4ea0;\n}\n.readonly-select[_ngcontent-%COMP%] {\n  width: fit-content;\n  min-width: 0;\n  max-width: 130px;\n  justify-content: center;\n  margin-top: 2px;\n  padding-left: 0.44rem;\n  padding-right: 0.44rem;\n}\n.readonly-field[_ngcontent-%COMP%] {\n  min-height: 34px;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.4rem 0.56rem;\n  background: #f7fafe;\n  color: #23476f;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-weight: 700;\n}\n.readonly-field[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.zodiac-symbol[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  font-weight: 800;\n  line-height: 1;\n}\n.zodiac-label[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  font-weight: 700;\n  min-width: 0;\n  text-align: center;\n}\n.readonly-select.zodiac-aries[_ngcontent-%COMP%] {\n  background: #fdf1f1;\n  color: #9f2f2f;\n}\n.readonly-select.zodiac-taurus[_ngcontent-%COMP%] {\n  background: #f7f3eb;\n  color: #6e4b2b;\n}\n.readonly-select.zodiac-gemini[_ngcontent-%COMP%] {\n  background: #fdf8e9;\n  color: #7d5a12;\n}\n.readonly-select.zodiac-cancer[_ngcontent-%COMP%] {\n  background: #eef4ff;\n  color: #2d5b8e;\n}\n.readonly-select.zodiac-leo[_ngcontent-%COMP%] {\n  background: #fff3e8;\n  color: #8f4b0d;\n}\n.readonly-select.zodiac-virgo[_ngcontent-%COMP%] {\n  background: #edf8ef;\n  color: #2b6b3d;\n}\n.readonly-select.zodiac-libra[_ngcontent-%COMP%] {\n  background: #f2eefc;\n  color: #60439d;\n}\n.readonly-select.zodiac-scorpio[_ngcontent-%COMP%] {\n  background: #f9edf2;\n  color: #7b3150;\n}\n.readonly-select.zodiac-sagittarius[_ngcontent-%COMP%] {\n  background: #eef1ff;\n  color: #2f4a9a;\n}\n.readonly-select.zodiac-capricorn[_ngcontent-%COMP%] {\n  background: #eff2f5;\n  color: #364653;\n}\n.readonly-select.zodiac-aquarius[_ngcontent-%COMP%] {\n  background: #ebf7fb;\n  color: #1d5f7a;\n}\n.readonly-select.zodiac-pisces[_ngcontent-%COMP%] {\n  background: #eef2ff;\n  color: #294b8f;\n}\n.physique-slim[_ngcontent-%COMP%] {\n  color: #3f7ab3;\n}\n.physique-lean[_ngcontent-%COMP%] {\n  color: #3f8f5f;\n}\n.physique-athletic[_ngcontent-%COMP%] {\n  color: #2f7e4d;\n}\n.physique-fit[_ngcontent-%COMP%] {\n  color: #465fbb;\n}\n.physique-curvy[_ngcontent-%COMP%] {\n  color: #a14875;\n}\n.physique-muscular[_ngcontent-%COMP%] {\n  color: #7d4f24;\n}\n.physique-average[_ngcontent-%COMP%] {\n  color: #4d667f;\n}\n.physique-select-wrap.physique-slim[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf3fb 0%,\n      #dfebf8 100%);\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.physique-select-wrap.physique-lean[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf6ee 0%,\n      #def0e5 100%);\n  border-color: rgba(63, 143, 95, 0.34);\n}\n.physique-select-wrap.physique-athletic[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f5ec 0%,\n      #dff0e6 100%);\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.physique-select-wrap.physique-fit[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ebf0ff 0%,\n      #e1e8fc 100%);\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.physique-select-wrap.physique-curvy[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f7edf3 0%,\n      #f0e3ec 100%);\n  border-color: rgba(161, 72, 117, 0.36);\n}\n.physique-select-wrap.physique-muscular[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe9 0%,\n      #ede3d8 100%);\n  border-color: rgba(125, 79, 36, 0.36);\n}\n.physique-select-wrap.physique-average[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef2f6 0%,\n      #e5ebf1 100%);\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.physique-select-wrap.physique-slim[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #3f7ab3;\n}\n.physique-select-wrap.physique-lean[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #3f8f5f;\n}\n.physique-select-wrap.physique-athletic[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f7e4d;\n}\n.physique-select-wrap.physique-fit[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #465fbb;\n}\n.physique-select-wrap.physique-curvy[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #a14875;\n}\n.physique-select-wrap.physique-muscular[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #7d4f24;\n}\n.physique-select-wrap.physique-average[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #4d667f;\n}\n.experience-filter-all[_ngcontent-%COMP%] {\n  color: #694ea6;\n}\n.experience-filter-workspace[_ngcontent-%COMP%] {\n  color: #a1485a;\n}\n.experience-filter-school[_ngcontent-%COMP%] {\n  color: #2d5ea8;\n}\n.experience-filter-online[_ngcontent-%COMP%] {\n  color: #2d7d47;\n}\n.experience-filter-project[_ngcontent-%COMP%] {\n  color: #6550a0;\n}\n.experience-filter-select.experience-filter-all[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-project[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #efe8ff 0%,\n      #e8defc 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n}\n.experience-filter-select.experience-filter-workspace[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-workspace[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f3 0%,\n      #ffe6ea 100%);\n  border-color: rgba(169, 72, 90, 0.32);\n}\n.experience-filter-select.experience-filter-school[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-school[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n}\n.experience-type-select.experience-filter-online[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n}\n.experience-type-select.experience-filter-project[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n}\n.experience-type-select[_ngcontent-%COMP%] {\n  min-width: 0;\n  max-width: 100%;\n  min-height: 40px;\n}\n.experience-type-field[_ngcontent-%COMP%], \n.experience-title-field[_ngcontent-%COMP%], \n.experience-city-field[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-org-field[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-type-select[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.experience-date-range-field[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: none;\n  margin: 0;\n  background: transparent;\n}\n.experience-date-range-label[_ngcontent-%COMP%] {\n  grid-column: 1/2;\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-text-field-wrapper[_ngcontent-%COMP%] {\n  min-height: 42px;\n  border-radius: 10px;\n  background: #fff;\n  border: 1px solid rgba(136, 156, 186, 0.5);\n  box-shadow: none;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-subscript-wrapper[_ngcontent-%COMP%] {\n  margin-top: 0.24rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  border: 0 !important;\n  box-shadow: none !important;\n  border-radius: 0 !important;\n  background: transparent !important;\n  min-width: 0;\n  width: 100%;\n  padding: 0 !important;\n  min-height: 0 !important;\n  height: auto !important;\n  line-height: 1.25;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-datepicker-toggle[_ngcontent-%COMP%] {\n  margin-right: 0.2rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-hint-wrapper[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-hint[_ngcontent-%COMP%] {\n  color: rgba(30, 49, 74, 0.65);\n  font-size: 0.72rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-container[_ngcontent-%COMP%] {\n  width: 100%;\n  display: grid;\n  grid-template-columns: minmax(96px, 1fr) auto minmax(96px, 1fr);\n  align-items: center;\n  column-gap: 0.34rem;\n  min-width: 0;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-separator[_ngcontent-%COMP%] {\n  margin: 0 0.28rem;\n  flex: 0 0 auto;\n  white-space: nowrap;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-start-wrapper[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-end-wrapper[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  overflow: visible;\n  min-width: 0;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-inner[_ngcontent-%COMP%] {\n  font-size: 0.96rem;\n  min-width: 0 !important;\n  width: 100% !important;\n  text-overflow: clip;\n  white-space: nowrap;\n  line-height: 1.25;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-flex[_ngcontent-%COMP%] {\n  min-width: 0;\n  border-bottom: 0 !important;\n  box-shadow: none !important;\n  align-items: center !important;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-infix[_ngcontent-%COMP%] {\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  min-height: 34px !important;\n  height: 34px;\n  display: flex;\n  align-items: center;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-line-ripple[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple--deactivating[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple--active[_ngcontent-%COMP%] {\n  display: none !important;\n  opacity: 0 !important;\n  transform: scaleX(0) !important;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-all {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efe8ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-workspace {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1f3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-school {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf4ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-online {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf8ee);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-project {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f4f0ff);\n}\n.mobile-profile-language-chip.language-tone-1[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-1[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-1 {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n  color: #2f6090;\n}\n.mobile-profile-language-chip.language-tone-2[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-2[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-2 {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n  color: #2f695b;\n}\n.mobile-profile-language-chip.language-tone-3[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-3[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-3 {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n  color: #394f9c;\n}\n.mobile-profile-language-chip.language-tone-4[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-4[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-4 {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n  color: #8d3f66;\n}\n.mobile-profile-language-chip.language-tone-5[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-5[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-5 {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n  color: #704822;\n}\n.mobile-profile-language-chip.language-tone-6[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-6[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-6 {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n  color: #415872;\n}\n.mobile-profile-language-chip.language-tone-7[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-7[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-7 {\n  background: #f7f5ea;\n  border-color: rgba(128, 109, 66, 0.34);\n  color: #746237;\n}\n.mobile-profile-language-chip.language-tone-8[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-8[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-8 {\n  background: #edf5ff;\n  border-color: rgba(45, 122, 160, 0.34);\n  color: #2f6782;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf2ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #ebf7ef);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1e3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efecfc);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3f8e9);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fceef3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf7ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6f2e9);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-1 .status-option-content {\n  color: #2d63a9;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-2 .status-option-content {\n  color: #2a7a49;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-3 .status-option-content {\n  color: #9b6018;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-4 .status-option-content {\n  color: #6153a2;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-5 .status-option-content {\n  color: #61812a;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-6 .status-option-content {\n  color: #9f446d;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-7 .status-option-content {\n  color: #2e7898;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-8 .status-option-content {\n  color: #806c3f;\n}\n.mobile-profile-selector-option.detail-tone-1[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef5ff 0%,\n      #e3eefc 100%);\n  border-color: rgba(46, 102, 181, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-2[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef9f3 0%,\n      #e3f4ea 100%);\n  border-color: rgba(40, 125, 72, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-3[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ea 0%,\n      #ffecdd 100%);\n  border-color: rgba(165, 94, 24, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-4[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f1ff 0%,\n      #e8e5fb 100%);\n  border-color: rgba(97, 82, 164, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-5[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f9ef 0%,\n      #edf3e1 100%);\n  border-color: rgba(95, 128, 36, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-6[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #f9e6ed 100%);\n  border-color: rgba(160, 70, 111, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-7[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ff 0%,\n      #e2f0fb 100%);\n  border-color: rgba(45, 122, 160, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-8[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f3ea 0%,\n      #eee9dc 100%);\n  border-color: rgba(128, 109, 66, 0.32);\n}\n.mobile-profile-selector-option.status-public[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e6f6ef 0%,\n      #d9f0e6 100%);\n  border-color: rgba(47, 143, 102, 0.34);\n}\n.mobile-profile-selector-option.status-friends[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f1fd 0%,\n      #dfeaf9 100%);\n  border-color: rgba(27, 87, 161, 0.34);\n}\n.mobile-profile-selector-option.status-host[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe2 0%,\n      #eee4d2 100%);\n  border-color: rgba(135, 88, 15, 0.36);\n}\n.mobile-profile-selector-option.status-inactive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3f5 0%,\n      #e8ebef 100%);\n  border-color: rgba(91, 101, 115, 0.32);\n}\n.mobile-profile-selector-option.physique-slim[_ngcontent-%COMP%] {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.mobile-profile-selector-option.physique-lean[_ngcontent-%COMP%] {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n}\n.mobile-profile-selector-option.physique-athletic[_ngcontent-%COMP%] {\n  background: #e8f5ec;\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.mobile-profile-selector-option.physique-fit[_ngcontent-%COMP%] {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.mobile-profile-selector-option.physique-curvy[_ngcontent-%COMP%] {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n}\n.mobile-profile-selector-option.physique-muscular[_ngcontent-%COMP%] {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n}\n.mobile-profile-selector-option.physique-average[_ngcontent-%COMP%] {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .values-selector-popup.profile-selector-popup[_ngcontent-%COMP%] {\n  gap: 0.56rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.44rem;\n  padding-bottom: 0.22rem;\n  border-bottom: 1px solid rgba(74, 102, 139, 0.22);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-head-label[_ngcontent-%COMP%] {\n  color: #203c64;\n  font-size: 0.82rem;\n  font-weight: 800;\n  line-height: 1.2;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-clear[_ngcontent-%COMP%] {\n  border: 1px solid rgba(41, 73, 110, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.82);\n  color: #284970;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.3rem 0.52rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-clear.is-hidden[_ngcontent-%COMP%] {\n  visibility: hidden;\n  pointer-events: none;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-selected[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(35, 68, 107, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.92);\n  color: #234368;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.26rem 0.48rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.16rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-empty[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.74rem;\n  color: rgba(31, 54, 86, 0.62);\n  font-style: italic;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.34rem;\n  border: 1px solid transparent;\n  border-radius: 12px;\n  padding: 0.4rem 0.42rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-head[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag[_ngcontent-%COMP%] {\n  border-radius: 999px;\n  border: 1px solid rgba(52, 86, 128, 0.28);\n  background: rgba(255, 255, 255, 0.74);\n  color: #2f527d;\n  font-size: 0.67rem;\n  font-weight: 800;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.2rem 0.52rem;\n  text-transform: uppercase;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 1px;\n  background: rgba(84, 111, 147, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip-grid[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.36rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(41, 70, 106, 0.22);\n  border-radius: 999px;\n  background: #f4f8ff;\n  color: #234066;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 700;\n  padding: 0.3rem 0.58rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  cursor: pointer;\n  transition:\n    background-color 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip.active[_ngcontent-%COMP%] {\n  border-color: rgba(27, 85, 158, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #dcebff 0%,\n      #cfe3ff 100%);\n  color: #123e70;\n  box-shadow: inset 0 0 0 1px rgba(30, 73, 127, 0.24), 0 1px 2px rgba(24, 53, 86, 0.16);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-family[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 232, 219, 0.52) 0%,\n      rgba(255, 232, 219, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-ambition[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 242, 216, 0.52) 0%,\n      rgba(255, 242, 216, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-lifestyle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(221, 241, 239, 0.56) 0%,\n      rgba(221, 241, 239, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-beliefs[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-social[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(223, 236, 255, 0.5) 0%,\n      rgba(223, 236, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-arts[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(235, 227, 255, 0.5) 0%,\n      rgba(235, 227, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-food[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 236, 221, 0.52) 0%,\n      rgba(255, 236, 221, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(222, 243, 231, 0.56) 0%,\n      rgba(222, 243, 231, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-mind[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(219, 242, 238, 0.56) 0%,\n      rgba(219, 242, 238, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-identity[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-family[_ngcontent-%COMP%] {\n  border-color: rgba(156, 94, 51, 0.34);\n  color: #9c5e33;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-ambition[_ngcontent-%COMP%] {\n  border-color: rgba(160, 106, 20, 0.34);\n  color: #9b6717;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-lifestyle[_ngcontent-%COMP%] {\n  border-color: rgba(47, 123, 119, 0.34);\n  color: #2f7b77;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-beliefs[_ngcontent-%COMP%] {\n  border-color: rgba(95, 78, 160, 0.34);\n  color: #5f4ea0;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-social[_ngcontent-%COMP%] {\n  border-color: rgba(47, 106, 175, 0.36);\n  color: #2f6aaf;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-arts[_ngcontent-%COMP%] {\n  border-color: rgba(106, 87, 168, 0.36);\n  color: #6a57a8;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-food[_ngcontent-%COMP%] {\n  border-color: rgba(170, 97, 28, 0.34);\n  color: #a55e18;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-active[_ngcontent-%COMP%] {\n  border-color: rgba(49, 124, 82, 0.36);\n  color: #317c52;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-mind[_ngcontent-%COMP%] {\n  border-color: rgba(37, 124, 118, 0.34);\n  color: #2b7c76;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-identity[_ngcontent-%COMP%] {\n  border-color: rgba(98, 84, 163, 0.34);\n  color: #6254a3;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-family[_ngcontent-%COMP%] {\n  background: rgba(156, 94, 51, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-ambition[_ngcontent-%COMP%] {\n  background: rgba(160, 106, 20, 0.32);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-lifestyle[_ngcontent-%COMP%] {\n  background: rgba(47, 123, 119, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-beliefs[_ngcontent-%COMP%] {\n  background: rgba(95, 78, 160, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-social[_ngcontent-%COMP%] {\n  background: rgba(47, 106, 175, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-arts[_ngcontent-%COMP%] {\n  background: rgba(106, 87, 168, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-food[_ngcontent-%COMP%] {\n  background: rgba(170, 97, 28, 0.32);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-active[_ngcontent-%COMP%] {\n  background: rgba(49, 124, 82, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-mind[_ngcontent-%COMP%] {\n  background: rgba(37, 124, 118, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-identity[_ngcontent-%COMP%] {\n  background: rgba(98, 84, 163, 0.3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.status-option) {\n  background: #f0f5fc;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.mdc-list-item--selected:not(.mdc-list-item--disabled) {\n  filter: brightness(0.95);\n  box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.2);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option {\n  background: #fff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option:not(:last-child) {\n  border-bottom: 1px solid #e6edf7;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.hide-selected-option, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.hide-selected-option {\n  min-height: 0 !important;\n  height: 0 !important;\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  border: 0 !important;\n  margin: 0 !important;\n  opacity: 0 !important;\n  pointer-events: none !important;\n  overflow: hidden !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option {\n  background: #fff;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel {\n  margin-top: 8px !important;\n  margin-bottom: 8px !important;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .cdk-overlay-pane .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .cdk-overlay-pane .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above {\n  margin-top: 0 !important;\n  margin-bottom: 18px !important;\n  transform: translateY(-10px) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public {\n  --mdc-list-list-item-container-color: #def3e9;\n  --mat-mdc-option-selected-container-color: #def3e9;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #def3e9) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends {\n  --mdc-list-list-item-container-color: #e3eefb;\n  --mat-mdc-option-selected-container-color: #e3eefb;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e3eefb) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host {\n  --mdc-list-list-item-container-color: #f3ead8;\n  --mat-mdc-option-selected-container-color: #f3ead8;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3ead8) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive {\n  --mdc-list-list-item-container-color: #eceff3;\n  --mat-mdc-option-selected-container-color: #eceff3;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eceff3) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon {\n  color: #2f8f66 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon {\n  color: #1b57a1 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon {\n  color: #87580f !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon {\n  color: #5b6573 !important;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-slim {\n  background: #eaf4ff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-lean {\n  background: #edf8f4;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-athletic {\n  background: #e8f5ec;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-fit {\n  background: #f1f2ff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-curvy {\n  background: #fff2f8;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-muscular {\n  background: #fbf4ea;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-average {\n  background: #eff4f9;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-slim .status-option-content {\n  color: #3f7ab3;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-lean .status-option-content {\n  color: #3f8f5f;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-athletic .status-option-content {\n  color: #2f7e4d;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-fit .status-option-content {\n  color: #465fbb;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-curvy .status-option-content {\n  color: #a14875;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-muscular .status-option-content {\n  color: #7d4f24;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-average .status-option-content {\n  color: #4d667f;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.physique-options-panel {\n  width: auto !important;\n  max-width: 220px !important;\n  min-width: 0 !important;\n}\n[_nghost-%COMP%]     .physique-options-panel .mat-mdc-option {\n  padding-right: 8px;\n}\n[_nghost-%COMP%]     .physique-options-panel .mat-mdc-option .mat-pseudo-checkbox {\n  margin-left: 4px;\n}\n@media (max-width: 760px) {\n  .experience-form-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    max-width: none;\n    justify-content: stretch;\n    row-gap: 0.72rem;\n  }\n  .experience-date-range-label[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n  }\n  .experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-container[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);\n  }\n  .profile-details-privacy-fab[_ngcontent-%COMP%]   .privacy-fab-actions[_ngcontent-%COMP%] {\n    position: fixed;\n    left: 0.5rem;\n    right: 0.5rem;\n    bottom: max(0.5rem, env(safe-area-inset-bottom));\n    top: auto;\n    transform: translateY(12px) scale(0.98);\n    transform-origin: bottom center;\n    justify-content: center;\n    gap: 0.46rem;\n    padding: 0.46rem 0.56rem;\n    border: 1px solid rgba(42, 68, 102, 0.2);\n    border-radius: 14px;\n    background: #fff;\n    box-shadow: 0 -12px 24px rgba(18, 31, 51, 0.22);\n  }\n  .profile-details-privacy-fab.open[_ngcontent-%COMP%]   .privacy-fab-actions[_ngcontent-%COMP%] {\n    transform: translateY(0) scale(1);\n  }\n}\n[_nghost-%COMP%] {\n  display: contents;\n}\n.stats-body[_ngcontent-%COMP%] {\n  position: relative;\n  min-height: 0;\n  height: 100%;\n  overflow: auto;\n  display: flex;\n  flex-direction: column;\n  gap: 0.72rem;\n}\n.stats-loading-overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 4.1rem 0 0;\n  z-index: 30;\n  display: grid;\n  place-items: center;\n  pointer-events: auto;\n}\n.stats-loading-scrim[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  background: rgba(244, 248, 255, 0.72);\n  -webkit-backdrop-filter: blur(2px);\n  backdrop-filter: blur(2px);\n}\n.stats-loading-card[_ngcontent-%COMP%] {\n  position: relative;\n  min-width: 188px;\n  border: 1px solid rgba(42, 81, 129, 0.18);\n  border-radius: 8px;\n  background: rgba(255, 255, 255, 0.94);\n  box-shadow: 0 18px 42px rgba(30, 58, 92, 0.18);\n  padding: 1rem 1.2rem;\n  display: grid;\n  place-items: center;\n  gap: 0.42rem;\n  color: rgba(34, 55, 84, 0.78);\n  font-weight: 900;\n}\n.stats-loading-state[_ngcontent-%COMP%], \n.stats-error[_ngcontent-%COMP%] {\n  min-height: 180px;\n  border: 1px solid rgba(42, 81, 129, 0.14);\n  border-radius: 8px;\n  background: #f7faff;\n  color: rgba(34, 55, 84, 0.78);\n  display: grid;\n  place-items: center;\n  align-content: center;\n  gap: 0.42rem;\n  font-weight: 900;\n}\n.stats-loading-state[_ngcontent-%COMP%] {\n  min-height: 280px;\n  text-align: center;\n}\n.stats-error[_ngcontent-%COMP%] {\n  min-height: 62px;\n  color: #9a2f3d;\n  background: #fff5f6;\n  border-color: rgba(190, 63, 82, 0.26);\n  grid-auto-flow: column;\n}\n.stats-hero[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(260px, 0.82fr) minmax(0, 1.8fr);\n  gap: 0.72rem;\n}\n.stats-health-card[_ngcontent-%COMP%], \n.stats-kpi-card[_ngcontent-%COMP%], \n.stats-panel[_ngcontent-%COMP%] {\n  border: 1px solid rgba(42, 81, 129, 0.14);\n  border-radius: 8px;\n  background: #f8fbff;\n  box-shadow: 0 14px 28px rgba(36, 69, 109, 0.08);\n}\n.stats-health-card[_ngcontent-%COMP%] {\n  min-height: 158px;\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  padding: 1rem;\n}\n.stats-health-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%], \n.stats-panel[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.96rem;\n  color: #15375f;\n}\n.stats-health-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.35rem 0 0;\n  color: rgba(28, 53, 84, 0.72);\n  font-size: 0.82rem;\n  line-height: 1.35;\n}\n.stats-health-ring[_ngcontent-%COMP%] {\n  width: 94px;\n  height: 94px;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex: 0 0 auto;\n  box-shadow: inset 0 0 0 1px rgba(43, 95, 139, 0.12);\n}\n.stats-health-ring[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  width: 70px;\n  height: 70px;\n  border-radius: 50%;\n  background: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: #1f7649;\n  font-size: 1.28rem;\n  font-weight: 1000;\n}\n.stats-kpi-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(5, minmax(0, 1fr));\n  gap: 0.52rem;\n}\n.stats-kpi-card[_ngcontent-%COMP%] {\n  min-width: 0;\n  min-height: 172px;\n  padding: 0.72rem;\n  display: grid;\n  grid-template-rows: auto auto minmax(2.15rem, auto) minmax(2.2rem, auto) auto;\n  align-content: stretch;\n  gap: 0.42rem;\n}\n.stats-kpi-card[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 1.18rem;\n  color: #13355d;\n}\n.stats-kpi-card[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n  min-width: 0;\n  color: rgba(29, 55, 88, 0.74);\n  font-weight: 900;\n  line-height: 1.2;\n  overflow-wrap: anywhere;\n}\n.stats-kpi-caption[_ngcontent-%COMP%] {\n  color: rgba(29, 55, 88, 0.58);\n  font-size: 0.64rem;\n  font-weight: 800;\n  white-space: normal;\n}\n.stats-kpi-icon[_ngcontent-%COMP%], \n.stats-segment-icon[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  background: #eaf3ff;\n  color: #2f67a8;\n}\n.stats-kpi-bar[_ngcontent-%COMP%], \n.stats-segment-bar[_ngcontent-%COMP%] {\n  height: 7px;\n  border-radius: 999px;\n  background: rgba(42, 81, 129, 0.12);\n  overflow: hidden;\n}\n.stats-kpi-bar[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.stats-segment-bar[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  height: 100%;\n  display: block;\n  border-radius: inherit;\n  background: #2f67a8;\n}\n.stats-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1.35fr 1fr;\n  gap: 0.72rem;\n}\n.stats-graph-panel[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.72rem;\n}\n.stats-graph-panel[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.stats-graph-panel[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.18rem 0 0;\n  color: rgba(29, 55, 88, 0.68);\n  font-size: 0.78rem;\n  font-weight: 850;\n}\n.stats-graph-header-actions[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n}\n.stats-graph-help-btn[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  border: 1px solid rgba(25, 82, 148, 0.62);\n  border-radius: 50%;\n  background:\n    linear-gradient(\n      180deg,\n      #2f78bf,\n      #1f5f9c);\n  color: #ffffff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  cursor: pointer;\n  box-shadow: 0 10px 20px rgba(23, 78, 136, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.35);\n}\n.stats-graph-help-btn[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 1.92rem;\n  width: 1.92rem;\n  height: 1.92rem;\n}\n.stats-graph-layout[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(220px, 0.72fr) minmax(0, 1.28fr);\n  gap: 0.72rem;\n  align-items: stretch;\n}\n.stats-graph-map[_ngcontent-%COMP%] {\n  min-height: 252px;\n  border: 1px solid rgba(42, 81, 129, 0.1);\n  border-radius: 8px;\n  background:\n    radial-gradient(\n      circle at 30% 26%,\n      rgba(47, 103, 168, 0.1),\n      transparent 24%),\n    radial-gradient(\n      circle at 72% 70%,\n      rgba(47, 143, 91, 0.1),\n      transparent 22%),\n    #ffffff;\n  padding: 0.48rem;\n  display: grid;\n  grid-template-rows: minmax(0, 1fr) auto;\n  gap: 0.42rem;\n}\n.stats-graph-map[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  min-height: 232px;\n  display: block;\n}\n.stats-graph-ring[_ngcontent-%COMP%] {\n  fill: none;\n  stroke: rgba(42, 81, 129, 0.13);\n  stroke-width: 1.2;\n  stroke-dasharray: 3 3;\n}\n.stats-graph-ring-inner[_ngcontent-%COMP%] {\n  stroke-dasharray: none;\n}\n.stats-graph-link[_ngcontent-%COMP%] {\n  stroke: rgba(46, 86, 135, 0.28);\n  stroke-width: 1.4;\n  stroke-linecap: round;\n}\n.stats-graph-community[_ngcontent-%COMP%], \n.stats-graph-node[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n.stats-graph-community[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%] {\n  fill: rgba(47, 143, 91, 0.1);\n  stroke: rgba(47, 143, 91, 0.22);\n  stroke-width: 1.4;\n  filter: drop-shadow(0 8px 14px rgba(33, 72, 112, 0.12));\n}\n.stats-graph-node[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%] {\n  fill: #2f67a8;\n  stroke: #ffffff;\n  stroke-width: 2.5;\n  filter: drop-shadow(0 5px 8px rgba(28, 56, 90, 0.22));\n}\n.stats-graph-map[_ngcontent-%COMP%]   text[_ngcontent-%COMP%] {\n  fill: #ffffff;\n  font-size: 7px;\n  font-weight: 1000;\n  dominant-baseline: middle;\n  text-anchor: middle;\n  pointer-events: none;\n}\n.stats-graph-map[_ngcontent-%COMP%]   text.stats-graph-community-count[_ngcontent-%COMP%] {\n  fill: #15375f;\n  font-size: 5.2px;\n  stroke: rgba(255, 255, 255, 0.86);\n  stroke-width: 0.9px;\n  paint-order: stroke;\n}\n.stats-graph-map[_ngcontent-%COMP%]   text.stats-graph-community-caption[_ngcontent-%COMP%] {\n  fill: rgba(21, 55, 95, 0.74);\n  font-size: 2.8px;\n  font-weight: 900;\n  stroke: rgba(255, 255, 255, 0.8);\n  stroke-width: 0.45px;\n  paint-order: stroke;\n}\n.stats-graph-map[_ngcontent-%COMP%]   text.stats-graph-node-count[_ngcontent-%COMP%] {\n  fill: #ffffff;\n  font-size: 3.9px;\n  stroke: rgba(20, 48, 82, 0.2);\n  stroke-width: 0.5px;\n  paint-order: stroke;\n}\n.stats-graph-map-legend[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.26rem;\n  border-top: 1px solid rgba(42, 81, 129, 0.1);\n  padding-top: 0.4rem;\n}\n.stats-graph-map-legend[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.34rem;\n  color: rgba(29, 55, 88, 0.74);\n  font-size: 0.7rem;\n  font-weight: 900;\n  line-height: 1.25;\n}\n.stats-graph-map-legend[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  width: 0.72rem;\n  height: 0.72rem;\n  border-radius: 50%;\n  display: inline-block;\n}\n.stats-graph-map-legend[_ngcontent-%COMP%]   .is-community[_ngcontent-%COMP%] {\n  border: 2px solid rgba(47, 143, 91, 0.32);\n  background: rgba(47, 143, 91, 0.12);\n}\n.stats-graph-map-legend[_ngcontent-%COMP%]   .is-bridge[_ngcontent-%COMP%] {\n  border: 2px solid #ffffff;\n  background: #2f67a8;\n  box-shadow: 0 0 0 1px rgba(42, 81, 129, 0.22);\n}\n.stats-graph-map-legend[_ngcontent-%COMP%]   .is-link[_ngcontent-%COMP%] {\n  width: 0.9rem;\n  height: 0.18rem;\n  border-radius: 999px;\n  background: rgba(46, 86, 135, 0.42);\n}\n.stats-graph-copy[_ngcontent-%COMP%] {\n  min-width: 0;\n  border: 1px solid rgba(42, 81, 129, 0.1);\n  border-radius: 8px;\n  background: #ffffff;\n  padding: 0.82rem;\n  display: grid;\n  align-content: start;\n  gap: 0.64rem;\n}\n.stats-graph-copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.stats-graph-rank[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%], \n.stats-graph-timeline[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #15375f;\n  font-size: 0.86rem;\n}\n.stats-graph-copy[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: rgba(28, 53, 84, 0.78);\n  font-size: 0.84rem;\n  line-height: 1.42;\n  font-weight: 850;\n}\n.stats-graph-focus[_ngcontent-%COMP%] {\n  min-height: 42px;\n  border: 1px solid rgba(47, 103, 168, 0.14);\n  border-radius: 8px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(247, 250, 255, 0.96),\n      rgba(255, 255, 255, 0.98));\n  padding: 0.46rem 0.56rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.6rem;\n}\n.stats-graph-focus[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  min-width: 0;\n  color: rgba(29, 55, 88, 0.74);\n  font-size: 0.76rem;\n  font-weight: 900;\n}\n.stats-graph-focus[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #15375f;\n  font-size: 1rem;\n  font-weight: 1000;\n}\n.stats-graph-actions[_ngcontent-%COMP%] {\n  border: 1px solid rgba(221, 137, 41, 0.26);\n  border-radius: 8px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 246, 232, 0.96),\n      rgba(255, 253, 249, 0.98));\n  padding: 0.58rem;\n  display: grid;\n  gap: 0.34rem;\n}\n.stats-graph-actions[_ngcontent-%COMP%]    > strong[_ngcontent-%COMP%] {\n  color: #8b4f12;\n  font-size: 0.8rem;\n}\n.stats-graph-actions[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  min-width: 0;\n  border-radius: 8px;\n  border: 1px solid rgba(221, 137, 41, 0.14);\n  background: rgba(255, 255, 255, 0.72);\n  color: #654018;\n  padding: 0.34rem 0.44rem;\n  display: flex;\n  align-items: center;\n  gap: 0.3rem;\n  font-size: 0.7rem;\n  font-weight: 900;\n  line-height: 1.25;\n}\n.stats-graph-actions[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  font-size: 1rem;\n  width: 1rem;\n  height: 1rem;\n  color: #c8761f;\n}\n.stats-graph-metrics[_ngcontent-%COMP%], \n.stats-graph-signals[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.42rem;\n}\n.stats-graph-metrics[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  min-width: 0;\n  border: 1px solid rgba(42, 81, 129, 0.1);\n  border-radius: 8px;\n  background: #f8fbff;\n  padding: 0.48rem;\n  display: grid;\n  gap: 0.16rem;\n  color: rgba(29, 55, 88, 0.72);\n  font-size: 0.7rem;\n  font-weight: 900;\n}\n.stats-graph-metrics[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #2f67a8;\n}\n.stats-graph-metrics[_ngcontent-%COMP%]   b[_ngcontent-%COMP%] {\n  color: #15375f;\n  font-size: 1rem;\n}\n.stats-graph-signal[_ngcontent-%COMP%] {\n  position: relative;\n  min-height: 38px;\n  overflow: hidden;\n  border: 1px solid rgba(42, 81, 129, 0.1);\n  border-radius: 8px;\n  background: #ffffff;\n  padding: 0.5rem 0.58rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n}\n.stats-graph-signal[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  min-width: 0;\n  color: #24466f;\n  font-size: 0.74rem;\n  font-weight: 900;\n}\n.stats-graph-signal[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #15375f;\n  font-weight: 1000;\n}\n.stats-graph-signal[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: auto auto 0 0;\n  height: 3px;\n  border-radius: 999px;\n  background: #2f67a8;\n}\n.stats-graph-bottom[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(180px, 0.7fr) minmax(180px, 0.7fr) minmax(0, 1.3fr);\n  gap: 0.72rem;\n}\n.stats-graph-rank[_ngcontent-%COMP%], \n.stats-graph-timeline[_ngcontent-%COMP%] {\n  min-width: 0;\n  border: 1px solid rgba(42, 81, 129, 0.1);\n  border-radius: 8px;\n  background: #ffffff;\n  padding: 0.68rem;\n  display: grid;\n  gap: 0.42rem;\n  align-content: start;\n}\n.stats-graph-timeline-chart[_ngcontent-%COMP%] {\n  height: 118px;\n}\n.stats-grid-charts[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 1.45fr) minmax(270px, 0.75fr);\n}\n.stats-panel[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding: 0.82rem;\n}\n.stats-panel-wide[_ngcontent-%COMP%] {\n  grid-row: span 3;\n}\n.stats-panel[_ngcontent-%COMP%]   header[_ngcontent-%COMP%] {\n  min-height: 30px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.72rem;\n  color: #46658d;\n}\n.stats-panel[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  border: 1px solid rgba(47, 86, 139, 0.16);\n  border-radius: 999px;\n  padding: 0.18rem 0.5rem;\n  font-size: 0.68rem;\n  font-weight: 1000;\n  text-transform: uppercase;\n}\n.stats-segments[_ngcontent-%COMP%], \n.stats-breakdown-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.56rem;\n}\n.stats-segment-row[_ngcontent-%COMP%] {\n  border-top: 1px solid rgba(42, 81, 129, 0.1);\n  padding-top: 0.58rem;\n  display: grid;\n  gap: 0.44rem;\n}\n.stats-segment-title[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  color: #173c68;\n}\n.stats-segment-title[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  margin-left: auto;\n  color: rgba(29, 55, 88, 0.72);\n  font-weight: 1000;\n}\n.stats-segment-items[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.36rem;\n}\n.stats-mini-row[_ngcontent-%COMP%], \n.stats-breakdown-row[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: hidden;\n  border: 1px solid rgba(42, 81, 129, 0.1);\n  border-radius: 8px;\n  background: #fff;\n}\n.stats-mini-row[_ngcontent-%COMP%] {\n  min-height: 32px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n  padding: 0.36rem 0.48rem;\n  color: #24466f;\n  font-size: 0.75rem;\n  font-weight: 850;\n}\n.stats-breakdown-row[_ngcontent-%COMP%] {\n  min-height: 42px;\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.58rem;\n  padding: 0.48rem 0.58rem;\n}\n.stats-breakdown-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.42rem;\n  color: #24466f;\n  font-size: 0.8rem;\n  font-weight: 900;\n}\n.stats-breakdown-row[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #173c68;\n  font-weight: 1000;\n}\n.stats-breakdown-row[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: auto auto 0 0;\n  height: 3px;\n  border-radius: 999px;\n  background: #2f67a8;\n}\n.stats-empty[_ngcontent-%COMP%] {\n  margin: 0;\n  color: rgba(29, 55, 88, 0.65);\n  font-size: 0.82rem;\n  font-weight: 850;\n}\n.stats-timeline-panel[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.54rem;\n}\n.stats-timeline-readout[_ngcontent-%COMP%] {\n  min-height: 34px;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  flex-wrap: wrap;\n  color: rgba(27, 55, 88, 0.74);\n  font-size: 0.74rem;\n  font-weight: 850;\n}\n.stats-timeline-readout[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #15375f;\n  font-size: 0.82rem;\n}\n.stats-timeline-readout[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.stats-chart-legend[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.stats-timeline-readout[_ngcontent-%COMP%]   i[_ngcontent-%COMP%], \n.stats-chart-legend[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  background: #2f67a8;\n}\n.stats-timeline-chart[_ngcontent-%COMP%] {\n  height: 148px;\n  border: 1px solid rgba(42, 81, 129, 0.1);\n  border-radius: 8px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(247, 250, 255, 0.9),\n      rgba(255, 255, 255, 0.98));\n  padding: 0.24rem;\n}\n.stats-timeline-chart[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  display: block;\n  cursor: crosshair;\n  touch-action: none;\n  -webkit-user-select: none;\n  user-select: none;\n  transform: none;\n}\n.stats-timeline-axis[_ngcontent-%COMP%], \n.stats-timeline-gridline[_ngcontent-%COMP%], \n.stats-timeline-line[_ngcontent-%COMP%], \n.stats-timeline-scrub-guide[_ngcontent-%COMP%], \n.stats-timeline-scrub-halo[_ngcontent-%COMP%], \n.stats-timeline-scrub-knob[_ngcontent-%COMP%] {\n  pointer-events: none;\n  transform: none;\n  transition: none;\n  vector-effect: non-scaling-stroke;\n}\n.stats-timeline-axis[_ngcontent-%COMP%], \n.stats-timeline-gridline[_ngcontent-%COMP%] {\n  stroke: rgba(42, 81, 129, 0.18);\n  stroke-width: 1;\n}\n.stats-timeline-gridline[_ngcontent-%COMP%] {\n  stroke-dasharray: 3 4;\n}\n.stats-timeline-line[_ngcontent-%COMP%] {\n  fill: none;\n  stroke: #2f67a8;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n  stroke-width: 2.5;\n}\n.stats-timeline-hit[_ngcontent-%COMP%] {\n  fill: transparent;\n  cursor: inherit;\n  outline: none;\n  transform: none;\n  transition: none;\n}\n.stats-timeline-hit[_ngcontent-%COMP%]:hover, \n.stats-timeline-hit[_ngcontent-%COMP%]:focus, \n.stats-timeline-hit[_ngcontent-%COMP%]:focus-visible {\n  stroke-width: 0;\n  transform: none;\n}\n.stats-timeline-scrub-guide[_ngcontent-%COMP%] {\n  stroke: rgba(23, 60, 104, 0.38);\n  stroke-dasharray: 4 4;\n  stroke-width: 1.4;\n}\n.stats-timeline-scrub-halo[_ngcontent-%COMP%] {\n  fill: rgba(47, 103, 168, 0.14);\n  stroke: rgba(47, 103, 168, 0.26);\n  stroke-width: 1;\n}\n.stats-timeline-scrub-knob[_ngcontent-%COMP%] {\n  fill: #ffffff;\n  stroke: #2f67a8;\n  stroke-width: 3;\n  filter: drop-shadow(0 4px 8px rgba(28, 56, 90, 0.24));\n}\n.stats-chart-legend[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.48rem;\n  flex-wrap: wrap;\n  color: rgba(29, 55, 88, 0.72);\n  font-size: 0.72rem;\n  font-weight: 900;\n}\n.stats-donut-card[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.58rem;\n}\n.stats-donut[_ngcontent-%COMP%] {\n  height: 16px;\n  border-radius: 999px;\n  background: rgba(42, 81, 129, 0.1);\n  overflow: hidden;\n  display: flex;\n}\n.stats-donut[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  min-width: 4px;\n  background: #2f67a8;\n}\n.stats-breakdown-compact[_ngcontent-%COMP%] {\n  gap: 0.42rem;\n}\n.stats-breakdown-compact[_ngcontent-%COMP%]   .stats-breakdown-row[_ngcontent-%COMP%] {\n  min-height: 36px;\n  padding-block: 0.38rem;\n}\n.is-green[_ngcontent-%COMP%]   .stats-kpi-bar[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.stats-breakdown-row.is-green[_ngcontent-%COMP%]   i[_ngcontent-%COMP%], \n.stats-kpi-card.is-green[_ngcontent-%COMP%]   .stats-kpi-bar[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.stats-segment-bar[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.stats-timeline-line.is-green[_ngcontent-%COMP%], \n.stats-donut[_ngcontent-%COMP%]   span.is-green[_ngcontent-%COMP%], \n.stats-timeline-readout[_ngcontent-%COMP%]   i.is-green[_ngcontent-%COMP%], \n.stats-chart-legend[_ngcontent-%COMP%]   .is-green[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  background: #2f8f5b;\n  stroke: #2f8f5b;\n}\n.is-gold[_ngcontent-%COMP%]   .stats-kpi-bar[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.stats-breakdown-row.is-gold[_ngcontent-%COMP%]   i[_ngcontent-%COMP%], \n.stats-kpi-card.is-gold[_ngcontent-%COMP%]   .stats-kpi-bar[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.stats-timeline-line.is-gold[_ngcontent-%COMP%], \n.stats-donut[_ngcontent-%COMP%]   span.is-gold[_ngcontent-%COMP%], \n.stats-timeline-readout[_ngcontent-%COMP%]   i.is-gold[_ngcontent-%COMP%], \n.stats-chart-legend[_ngcontent-%COMP%]   .is-gold[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  background: #d58a24;\n  stroke: #d58a24;\n}\n.is-purple[_ngcontent-%COMP%]   .stats-kpi-bar[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.stats-breakdown-row.is-purple[_ngcontent-%COMP%]   i[_ngcontent-%COMP%], \n.stats-kpi-card.is-purple[_ngcontent-%COMP%]   .stats-kpi-bar[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.stats-timeline-line.is-purple[_ngcontent-%COMP%], \n.stats-donut[_ngcontent-%COMP%]   span.is-purple[_ngcontent-%COMP%], \n.stats-timeline-readout[_ngcontent-%COMP%]   i.is-purple[_ngcontent-%COMP%], \n.stats-chart-legend[_ngcontent-%COMP%]   .is-purple[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  background: #7562b6;\n  stroke: #7562b6;\n}\n.is-red[_ngcontent-%COMP%]   .stats-kpi-bar[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.stats-breakdown-row.is-red[_ngcontent-%COMP%]   i[_ngcontent-%COMP%], \n.stats-kpi-card.is-red[_ngcontent-%COMP%]   .stats-kpi-bar[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.stats-timeline-line.is-red[_ngcontent-%COMP%], \n.stats-donut[_ngcontent-%COMP%]   span.is-red[_ngcontent-%COMP%], \n.stats-timeline-readout[_ngcontent-%COMP%]   i.is-red[_ngcontent-%COMP%], \n.stats-chart-legend[_ngcontent-%COMP%]   .is-red[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  background: #c4515f;\n  stroke: #c4515f;\n}\n.is-slate[_ngcontent-%COMP%]   .stats-kpi-bar[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.stats-breakdown-row.is-slate[_ngcontent-%COMP%]   i[_ngcontent-%COMP%], \n.stats-kpi-card.is-slate[_ngcontent-%COMP%]   .stats-kpi-bar[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.stats-timeline-line.is-slate[_ngcontent-%COMP%], \n.stats-donut[_ngcontent-%COMP%]   span.is-slate[_ngcontent-%COMP%], \n.stats-timeline-readout[_ngcontent-%COMP%]   i.is-slate[_ngcontent-%COMP%], \n.stats-chart-legend[_ngcontent-%COMP%]   .is-slate[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  background: #5a6b82;\n  stroke: #5a6b82;\n}\n.stats-timeline-line.is-blue[_ngcontent-%COMP%], \n.stats-donut[_ngcontent-%COMP%]   span.is-blue[_ngcontent-%COMP%], \n.stats-graph-signal.is-blue[_ngcontent-%COMP%]   i[_ngcontent-%COMP%], \n.stats-timeline-readout[_ngcontent-%COMP%]   i.is-blue[_ngcontent-%COMP%], \n.stats-chart-legend[_ngcontent-%COMP%]   .is-blue[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  background: #2f67a8;\n  stroke: #2f67a8;\n}\n.stats-graph-node.is-blue[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%] {\n  fill: #2f67a8;\n  stroke: #ffffff;\n}\n.stats-graph-community.is-blue[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%] {\n  fill: rgba(47, 103, 168, 0.18);\n  stroke: #2f67a8;\n}\n.stats-graph-node.is-green[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%] {\n  fill: #2f8f5b;\n  stroke: #ffffff;\n}\n.stats-graph-community.is-green[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%] {\n  fill: rgba(47, 143, 91, 0.18);\n  stroke: #2f8f5b;\n}\n.stats-graph-node.is-green[_ngcontent-%COMP%], \n.stats-graph-community.is-green[_ngcontent-%COMP%] {\n  fill: #2f8f5b;\n  stroke: #ffffff;\n}\n.stats-graph-signal.is-green[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  background: #2f8f5b;\n}\n.stats-graph-node.is-gold[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%] {\n  fill: #d58a24;\n  stroke: #ffffff;\n}\n.stats-graph-community.is-gold[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%] {\n  fill: rgba(213, 138, 36, 0.2);\n  stroke: #d58a24;\n}\n.stats-graph-signal.is-gold[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  background: #d58a24;\n}\n.stats-graph-node.is-purple[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%] {\n  fill: #7562b6;\n  stroke: #ffffff;\n}\n.stats-graph-community.is-purple[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%] {\n  fill: rgba(117, 98, 182, 0.2);\n  stroke: #7562b6;\n}\n.stats-graph-signal.is-purple[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  background: #7562b6;\n}\n.stats-graph-node.is-red[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%] {\n  fill: #c4515f;\n  stroke: #ffffff;\n}\n.stats-graph-community.is-red[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%] {\n  fill: rgba(196, 81, 95, 0.2);\n  stroke: #c4515f;\n}\n.stats-graph-signal.is-red[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  background: #c4515f;\n}\n.stats-graph-node.is-slate[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%] {\n  fill: #5a6b82;\n  stroke: #ffffff;\n}\n.stats-graph-community.is-slate[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%] {\n  fill: rgba(90, 107, 130, 0.18);\n  stroke: #5a6b82;\n}\n.stats-graph-signal.is-slate[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  background: #5a6b82;\n}\n.stats-graph-help-content[_ngcontent-%COMP%] {\n  min-height: 0;\n  max-height: min(680px, 100vh - 8rem);\n  overflow-y: auto;\n  overflow-x: hidden;\n  display: grid;\n  gap: 0.72rem;\n}\n.stats-graph-help-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.56rem;\n}\n.stats-graph-help-grid[_ngcontent-%COMP%]   article[_ngcontent-%COMP%], \n.stats-graph-help-actions[_ngcontent-%COMP%] {\n  min-width: 0;\n  border: 1px solid rgba(42, 81, 129, 0.12);\n  border-radius: 8px;\n  background: #ffffff;\n  padding: 0.68rem;\n  display: grid;\n  gap: 0.28rem;\n}\n.stats-graph-help-grid[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #2f67a8;\n}\n.stats-graph-help-grid[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.stats-graph-help-actions[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #15375f;\n  font-size: 0.82rem;\n}\n.stats-graph-help-grid[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n.stats-graph-help-actions[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: rgba(28, 53, 84, 0.72);\n  font-size: 0.76rem;\n  line-height: 1.38;\n  font-weight: 820;\n}\n.stats-graph-help-actions[_ngcontent-%COMP%] {\n  border-color: rgba(47, 143, 91, 0.2);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(239, 250, 245, 0.94),\n      #ffffff);\n}\n@media (max-width: 760px) {\n  .stats-hero[_ngcontent-%COMP%], \n   .stats-grid[_ngcontent-%COMP%], \n   .stats-grid-charts[_ngcontent-%COMP%], \n   .stats-graph-layout[_ngcontent-%COMP%], \n   .stats-graph-bottom[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .stats-kpi-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n  .stats-graph-metrics[_ngcontent-%COMP%], \n   .stats-graph-signals[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n  .stats-panel-wide[_ngcontent-%COMP%] {\n    grid-row: auto;\n  }\n  .stats-segment-items[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .stats-graph-help-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=admin-stats-popup.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminStatsPopupComponent, [{
    type: Component,
    args: [{ selector: "app-admin-stats-popup", standalone: true, imports: [CommonModule, MatIconModule, IndicatorComponent, I18nPipe, PopupComponent], template: `@if (admin.activePopup() === 'stats') {
  <app-popup [model]="statsPopupModel()">
      <div class="stats-body">
        @if (loading() && stats()) {
          <div class="stats-loading-overlay" aria-busy="true">
            <div class="stats-loading-scrim"></div>
            <div class="stats-loading-card">
              <app-indicator
                kind="load-ring"
                state="loading"
              ></app-indicator>
              <span>{{ 'loading.stats' | i18n }}</span>
            </div>
          </div>
        }

        @if (loading() && !stats()) {
          <div class="stats-loading-state" aria-busy="true">
            <app-indicator
              kind="load-ring"
              state="loading"
            ></app-indicator>
            <span>{{ 'loading.stats' | i18n }}</span>
          </div>
        } @else if (stats(); as dashboard) {
          <section class="stats-hero">
            <div class="stats-health-card">
              <span class="stats-health-ring" [ngStyle]="healthRingStyle(dashboard.healthScore)">
                <span>{{ dashboard.healthScore }}</span>
              </span>
              <div>
                <h3>{{ dashboard.healthLabelKey | i18n }}</h3>
                <p>{{ dashboard.healthSummaryKey | i18n }}</p>
              </div>
            </div>
            <div class="stats-kpi-grid">
              @for (metric of primaryKpis(); track metric.key) {
                <article class="stats-kpi-card" [ngClass]="toneClass(metric)">
                  <span class="stats-kpi-icon"><mat-icon>{{ metric.icon }}</mat-icon></span>
                  <strong>{{ metric.valueLabel || metric.value }}</strong>
                  <small>{{ metric.labelKey | i18n }}</small>
                  @if (metric.captionKey || metric.caption) {
                    <small class="stats-kpi-caption">
                      {{ metric.captionKey ? (metric.captionKey | i18n) : metric.caption }}
                    </small>
                  }
                  <span class="stats-kpi-bar"><span [style.width.%]="metricPercent(metric)"></span></span>
                </article>
              }
            </div>
          </section>

          @if (graph(); as socialGraph) {
            <section class="stats-panel stats-graph-panel">
              <header>
                <div>
                  <h3>{{ 'stats.graph.title' | i18n }}</h3>
                  <p>{{ 'stats.graph.subtitle' | i18n }}</p>
                </div>
                <div class="stats-graph-header-actions">
                  <button
                    type="button"
                    class="stats-graph-help-btn"
                    (click)="openGraphHelp()"
                    [attr.aria-label]="'stats.graph.help.open' | i18n">
                    <mat-icon>help_outline</mat-icon>
                  </button>
                </div>
              </header>

              <div class="stats-graph-layout">
                <div class="stats-graph-map">
                  <svg viewBox="0 0 100 100" role="img" [attr.aria-label]="'stats.graph.title' | i18n">
                    @for (bridge of graphBridgeUsers(); track bridge.key; let index = $index) {
                      <line
                        class="stats-graph-link"
                        [attr.x1]="graphBridgeX(index, graphBridgeUsers().length)"
                        [attr.y1]="graphBridgeY(index, graphBridgeUsers().length)"
                        [attr.x2]="graphCommunityX(graphBridgeCommunityIndex(index, graphCommunities().length, 0), graphCommunities().length)"
                        [attr.y2]="graphCommunityY(graphBridgeCommunityIndex(index, graphCommunities().length, 0), graphCommunities().length)">
                      </line>
                      <line
                        class="stats-graph-link"
                        [attr.x1]="graphBridgeX(index, graphBridgeUsers().length)"
                        [attr.y1]="graphBridgeY(index, graphBridgeUsers().length)"
                        [attr.x2]="graphCommunityX(graphBridgeCommunityIndex(index, graphCommunities().length, 1), graphCommunities().length)"
                        [attr.y2]="graphCommunityY(graphBridgeCommunityIndex(index, graphCommunities().length, 1), graphCommunities().length)">
                      </line>
                    }
                    @for (community of graphCommunities(); track community.key; let index = $index) {
                      <g
                        class="stats-graph-community"
                        [ngClass]="toneClass(community)"
                        tabindex="0"
                        role="button"
                        (click)="selectGraphFocus(itemLabel(community), community.value)"
                        (focus)="selectGraphFocus(itemLabel(community), community.value)">
                        <circle
                          [attr.cx]="graphCommunityX(index, graphCommunities().length)"
                          [attr.cy]="graphCommunityY(index, graphCommunities().length)"
                          [attr.r]="graphCommunityRadius(community)">
                        </circle>
                        <text
                          class="stats-graph-community-count"
                          [attr.x]="graphCommunityX(index, graphCommunities().length)"
                          [attr.y]="graphCommunityY(index, graphCommunities().length) - 1">
                          {{ compactGraphValue(community.value) }}
                        </text>
                        <text
                          class="stats-graph-community-caption"
                          [attr.x]="graphCommunityX(index, graphCommunities().length)"
                          [attr.y]="graphCommunityY(index, graphCommunities().length) + 5.4">
                          {{ 'stats.graph.map.people.short' | i18n }}
                        </text>
                      </g>
                    }
                    @for (bridge of graphBridgeUsers(); track bridge.key; let index = $index) {
                      <g
                        class="stats-graph-node"
                        [ngClass]="toneClass(bridge)"
                        tabindex="0"
                        role="button"
                        (click)="selectGraphFocus(itemLabel(bridge), bridge.value)"
                        (focus)="selectGraphFocus(itemLabel(bridge), bridge.value)">
                      <circle
                          [attr.cx]="graphBridgeX(index, graphBridgeUsers().length)"
                          [attr.cy]="graphBridgeY(index, graphBridgeUsers().length)"
                          [attr.r]="graphBridgeRadius(bridge)">
                      </circle>
                      <text
                          class="stats-graph-node-count"
                          [attr.x]="graphBridgeX(index, graphBridgeUsers().length)"
                          [attr.y]="graphBridgeY(index, graphBridgeUsers().length)">
                        {{ compactGraphValue(bridge.value) }}
                      </text>
                      </g>
                    }
                  </svg>
                  <div class="stats-graph-map-legend">
                    <span><i class="is-community"></i>{{ 'stats.graph.map.community.legend' | i18n }}</span>
                    <span><i class="is-bridge"></i>{{ 'stats.graph.map.bridge.legend' | i18n }}</span>
                    <span><i class="is-link"></i>{{ 'stats.graph.map.link.legend' | i18n }}</span>
                  </div>
                </div>

                <div class="stats-graph-copy">
                  <strong>{{ 'stats.graph.suggests' | i18n }}</strong>
                  <p>{{ socialGraph.insightKey | i18n }}</p>
                  <div class="stats-graph-actions">
                    <strong>{{ 'stats.graph.actions.title' | i18n }}</strong>
                    @for (action of graphAdminActions(socialGraph); track action.key) {
                      <span [ngClass]="toneClass(action)">
                        <mat-icon>{{ action.icon }}</mat-icon>
                        {{ action.labelKey | i18n }}
                      </span>
                    }
                  </div>
                  @if (selectedGraphFocus(); as focus) {
                    <div class="stats-graph-focus">
                      <span>{{ focus.labelKey ? (focus.labelKey | i18n) : focus.label }}</span>
                      <strong>{{ focus.value }}</strong>
                    </div>
                  }
                  <div class="stats-graph-metrics">
                    @for (metric of socialGraph.metrics; track metric.key) {
                      <span [ngClass]="toneClass(metric)">
                        <mat-icon>{{ metric.icon }}</mat-icon>
                        <b>{{ metric.valueLabel || metric.value }}</b>
                        {{ metric.labelKey | i18n }}
                      </span>
                    }
                  </div>
                </div>
              </div>

              <div class="stats-graph-signals">
                @for (signal of socialGraph.signals; track signal.key) {
                  <div class="stats-graph-signal" [ngClass]="toneClass(signal)">
                    <span>{{ signal.labelKey | i18n }}</span>
                    <strong>{{ signal.value }}%</strong>
                    <i [style.width.%]="itemPercent(signal)"></i>
                  </div>
                }
              </div>

              <div class="stats-graph-bottom">
                <div class="stats-graph-rank">
                  <h4>{{ 'stats.graph.bridges' | i18n }}</h4>
                  @for (bridge of socialGraph.bridgeUsers; track bridge.key) {
                    <div class="stats-breakdown-row" [ngClass]="toneClass(bridge)">
                      <span><mat-icon>{{ bridge.icon || 'conversion_path' }}</mat-icon>{{ itemLabel(bridge) }}</span>
                      <strong>{{ bridge.value }}</strong>
                      <i [style.width.%]="itemPercent(bridge)"></i>
                    </div>
                  }
                </div>

                <div class="stats-graph-rank">
                  <h4>{{ 'stats.graph.communities' | i18n }}</h4>
                  @for (community of socialGraph.communities; track community.key) {
                    <div class="stats-breakdown-row" [ngClass]="toneClass(community)">
                      <span><mat-icon>{{ community.icon || 'bubble_chart' }}</mat-icon>{{ itemLabel(community) }}</span>
                      <strong>{{ community.value }}</strong>
                      <i [style.width.%]="itemPercent(community)"></i>
                    </div>
                  }
                </div>

                <div class="stats-graph-timeline">
                  <h4>{{ 'stats.graph.timeline.title' | i18n }}</h4>
                  @if (selectedGraphTimelinePoint(socialGraph); as point) {
                    <div class="stats-timeline-readout">
                      <strong>{{ point.label || point.dateKey }}</strong>
                      <span><i class="is-blue"></i>{{ 'stats.graph.timeline.active.edges' | i18n }} {{ point.activeEdges }}</span>
                      <span><i class="is-green"></i>{{ 'stats.graph.timeline.new.edges' | i18n }} {{ point.newEdges }}</span>
                      <span><i class="is-gold"></i>{{ 'stats.graph.timeline.recurring.edges' | i18n }} {{ point.recurringEdges }}</span>
                      <span><i class="is-purple"></i>{{ 'stats.graph.timeline.weak.ties' | i18n }} {{ point.weakTies }}</span>
                      <span><i class="is-slate"></i>{{ 'stats.graph.timeline.network.quality' | i18n }} {{ point.networkQuality }}%</span>
                      <span><i class="is-red"></i>{{ 'stats.graph.timeline.cluster.quality' | i18n }} {{ point.clusterQuality }}%</span>
                    </div>
                  }
                  <div class="stats-timeline-chart stats-graph-timeline-chart">
                    <svg
                      class="motion-static"
                      viewBox="0 0 300 108"
                      role="img"
                      [class.is-dragging]="graphTimelineDragging()"
                      [attr.aria-label]="'stats.graph.timeline.title' | i18n"
                      (pointerdown)="startGraphTimelineDrag($event, socialGraph.timeline)"
                      (pointermove)="moveGraphTimelineDrag($event, socialGraph.timeline)"
                      (pointerup)="endGraphTimelineDrag($event)"
                      (pointercancel)="endGraphTimelineDrag($event)"
                      (lostpointercapture)="endGraphTimelineDrag()">
                      <line x1="12" y1="94" x2="288" y2="94" class="stats-timeline-axis"></line>
                      <line x1="12" y1="58" x2="288" y2="58" class="stats-timeline-gridline"></line>
                      <line x1="12" y1="22" x2="288" y2="22" class="stats-timeline-gridline"></line>
                      @for (metric of graphTimelineMetrics; track metric.key) {
                        <polyline
                          class="stats-timeline-line"
                          [ngClass]="toneClass({ tone: metric.tone })"
                          [attr.points]="graphTimelineChartPoints(socialGraph.timeline, metric.key)">
                        </polyline>
                      }
                      @if (selectedGraphTimelinePoint(socialGraph)) {
                        <line
                          class="stats-timeline-scrub-guide"
                          [attr.x1]="selectedGraphTimelineX(socialGraph)"
                          y1="12"
                          [attr.x2]="selectedGraphTimelineX(socialGraph)"
                          y2="96">
                        </line>
                        <circle
                          class="stats-timeline-scrub-halo"
                          [attr.cx]="selectedGraphTimelineX(socialGraph)"
                          [attr.cy]="selectedGraphTimelineY(socialGraph)"
                          r="10">
                        </circle>
                        <circle
                          class="stats-timeline-scrub-knob"
                          [attr.cx]="selectedGraphTimelineX(socialGraph)"
                          [attr.cy]="selectedGraphTimelineY(socialGraph)"
                          r="5">
                        </circle>
                      }
                      @for (point of socialGraph.timeline; track point.dateKey; let index = $index) {
                        <rect
                          class="stats-timeline-hit motion-static"
                          [attr.x]="timelineX(index, socialGraph.timeline.length) - 8"
                          y="8"
                          width="16"
                          height="92"
                          tabindex="0"
                          (focus)="selectGraphTimelinePoint(point)">
                        </rect>
                      }
                    </svg>
                  </div>
                </div>
              </div>
            </section>
          }

          <section class="stats-grid stats-grid-charts">
            <article class="stats-panel stats-timeline-panel">
              <header>
                <h3>{{ 'stats.timeline.title' | i18n }}</h3>
                <span>{{ 'stats.timeline.window' | i18n }}</span>
              </header>
              @if (selectedTimelinePoint(dashboard); as point) {
                <div class="stats-timeline-readout">
                  <strong>{{ point.label || point.dateKey }}</strong>
                  <span><i class="is-blue"></i>{{ 'stats.timeline.active.users' | i18n }} {{ point.activeUsers }}</span>
                  <span><i class="is-green"></i>{{ 'stats.timeline.registrations' | i18n }} {{ point.registrations }}</span>
                  <span><i class="is-purple"></i>{{ 'stats.timeline.ratings' | i18n }} {{ point.ratings }}</span>
                  <span><i class="is-gold"></i>{{ 'stats.timeline.activity' | i18n }} {{ point.events + point.assets }}</span>
                  <span><i class="is-slate"></i>{{ 'stats.timeline.messages' | i18n }} {{ point.messages }}</span>
                  <span><i class="is-red"></i>{{ 'stats.timeline.moderation' | i18n }} {{ point.moderation }}</span>
                </div>
              }
              <div class="stats-timeline-chart">
                <svg
                  class="motion-static"
                  viewBox="0 0 300 108"
                  role="img"
                  [class.is-dragging]="timelineDragging()"
                  [attr.aria-label]="'stats.timeline.title' | i18n"
                  (pointerdown)="startTimelineDrag($event, dashboard.timeline)"
                  (pointermove)="moveTimelineDrag($event, dashboard.timeline)"
                  (pointerup)="endTimelineDrag($event)"
                  (pointercancel)="endTimelineDrag($event)"
                  (lostpointercapture)="endTimelineDrag()">
                  <line x1="12" y1="94" x2="288" y2="94" class="stats-timeline-axis"></line>
                  <line x1="12" y1="58" x2="288" y2="58" class="stats-timeline-gridline"></line>
                  <line x1="12" y1="22" x2="288" y2="22" class="stats-timeline-gridline"></line>
                  @for (metric of timelineMetrics; track metric.key) {
                    <polyline
                      class="stats-timeline-line"
                      [ngClass]="toneClass({ tone: metric.tone })"
                      [attr.points]="timelineChartPoints(dashboard.timeline, metric.key)">
                    </polyline>
                  }
                  @if (selectedTimelinePoint(dashboard)) {
                    <line
                      class="stats-timeline-scrub-guide"
                      [attr.x1]="selectedTimelineX(dashboard)"
                      y1="12"
                      [attr.x2]="selectedTimelineX(dashboard)"
                      y2="96">
                    </line>
                    <circle
                      class="stats-timeline-scrub-halo"
                      [attr.cx]="selectedTimelineX(dashboard)"
                      [attr.cy]="selectedTimelineY(dashboard)"
                      r="10">
                    </circle>
                    <circle
                      class="stats-timeline-scrub-knob"
                      [attr.cx]="selectedTimelineX(dashboard)"
                      [attr.cy]="selectedTimelineY(dashboard)"
                      r="5">
                    </circle>
                  }
                  @for (point of dashboard.timeline; track point.dateKey; let index = $index) {
                    <rect
                      class="stats-timeline-hit motion-static"
                      [attr.x]="timelineX(index, dashboard.timeline.length) - 8"
                      y="8"
                      width="16"
                      height="92"
                      tabindex="0"
                      (focus)="selectTimelinePoint(point)">
                    </rect>
                  }
                </svg>
              </div>
              <div class="stats-chart-legend">
                @for (metric of timelineMetrics; track metric.key) {
                  <span [ngClass]="toneClass({ tone: metric.tone })">
                    <i></i>{{ metric.labelKey | i18n }}
                  </span>
                }
              </div>
            </article>

            <article class="stats-panel stats-event-types-panel">
              <header>
                <h3>{{ 'stats.event.types' | i18n }}</h3>
                <mat-icon>category</mat-icon>
              </header>
              <div class="stats-donut-card">
                <div class="stats-donut">
                  @for (item of dashboard.eventTypes; track item.key) {
                    <span [ngClass]="toneClass(item)" [style.flex-grow]="item.value"></span>
                  }
                </div>
                <div class="stats-breakdown-list stats-breakdown-compact">
                  @for (item of dashboard.eventTypes; track item.key) {
                    <div class="stats-breakdown-row" [ngClass]="toneClass(item)">
                      <span><mat-icon>{{ item.icon || 'category' }}</mat-icon>{{ itemLabel(item) }}</span>
                      <strong>{{ item.value }}</strong>
                      <i [style.width.%]="itemPercent(item)"></i>
                    </div>
                  }
                </div>
              </div>
            </article>
          </section>

          <section class="stats-grid">
            <article class="stats-panel stats-panel-wide">
              <header>
                <h3>{{ 'stats.segment.overview' | i18n }}</h3>
              </header>
              <div class="stats-segments">
                @for (segment of topSegments(); track segment.key) {
                  <section class="stats-segment-row">
                    <div class="stats-segment-title">
                      <span class="stats-segment-icon"><mat-icon>{{ segment.icon }}</mat-icon></span>
                      <strong>{{ segment.labelKey | i18n }}</strong>
                      <small>{{ segment.total }}</small>
                    </div>
                    <span class="stats-segment-bar"><span [style.width.%]="segmentPercent(segment)"></span></span>
                    <div class="stats-segment-items">
                      @for (item of segment.items; track item.key) {
                        <div class="stats-mini-row" [ngClass]="toneClass(item)">
                          <span>{{ item.labelKey ? (item.labelKey | i18n) : itemLabel(item) }}</span>
                          <strong>{{ item.value }}</strong>
                        </div>
                      }
                    </div>
                  </section>
                }
              </div>
            </article>

            <article class="stats-panel">
              <header>
                <h3>{{ 'stats.top.cities' | i18n }}</h3>
                <mat-icon>location_on</mat-icon>
              </header>
              <div class="stats-breakdown-list">
                @for (item of dashboard.topCities; track item.key) {
                  <div class="stats-breakdown-row" [ngClass]="toneClass(item)">
                    <span><mat-icon>{{ item.icon || 'location_on' }}</mat-icon>{{ itemLabel(item) }}</span>
                    <strong>{{ item.value }}</strong>
                    <i [style.width.%]="itemPercent(item)"></i>
                  </div>
                }
              </div>
            </article>

            <article class="stats-panel">
              <header>
                <h3>{{ 'stats.top.topics' | i18n }}</h3>
                <mat-icon>local_offer</mat-icon>
              </header>
              <div class="stats-breakdown-list">
                @for (item of dashboard.topTopics; track item.key) {
                  <div class="stats-breakdown-row" [ngClass]="toneClass(item)">
                    <span><mat-icon>{{ item.icon || 'local_offer' }}</mat-icon>{{ itemLabel(item) }}</span>
                    <strong>{{ item.value }}</strong>
                    <i [style.width.%]="itemPercent(item)"></i>
                  </div>
                }
              </div>
            </article>
          </section>
        }

        @if (error()) {
          <div class="stats-error">
            <mat-icon>warning</mat-icon>
            <span>{{ error() }}</span>
          </div>
        }
      </div>

      @if (graphHelpOpen()) {
        <app-popup [model]="graphHelpPopupModel()" [zIndex]="2400">
          <div class="stats-graph-help-content">
            <div class="stats-graph-help-grid">
              <article>
                <mat-icon>monitoring</mat-icon>
                <strong>{{ 'stats.graph.help.health.title' | i18n }}</strong>
                <p>{{ 'stats.graph.help.health.body' | i18n }}</p>
              </article>
              <article>
                <mat-icon>hub</mat-icon>
                <strong>{{ 'stats.graph.help.edges.title' | i18n }}</strong>
                <p>{{ 'stats.graph.help.edges.body' | i18n }}</p>
              </article>
              <article>
                <mat-icon>conversion_path</mat-icon>
                <strong>{{ 'stats.graph.help.bridges.title' | i18n }}</strong>
                <p>{{ 'stats.graph.help.bridges.body' | i18n }}</p>
              </article>
              <article>
                <mat-icon>share</mat-icon>
                <strong>{{ 'stats.graph.help.reach.title' | i18n }}</strong>
                <p>{{ 'stats.graph.help.reach.body' | i18n }}</p>
              </article>
              <article>
                <mat-icon>travel_explore</mat-icon>
                <strong>{{ 'stats.graph.help.weak.title' | i18n }}</strong>
                <p>{{ 'stats.graph.help.weak.body' | i18n }}</p>
              </article>
              <article>
                <mat-icon>bubble_chart</mat-icon>
                <strong>{{ 'stats.graph.help.clustering.title' | i18n }}</strong>
                <p>{{ 'stats.graph.help.clustering.body' | i18n }}</p>
              </article>
              <article>
                <mat-icon>repeat</mat-icon>
                <strong>{{ 'stats.graph.help.recurring.title' | i18n }}</strong>
                <p>{{ 'stats.graph.help.recurring.body' | i18n }}</p>
              </article>
              <article>
                <mat-icon>timeline</mat-icon>
                <strong>{{ 'stats.graph.help.evolution.title' | i18n }}</strong>
                <p>{{ 'stats.graph.help.evolution.body' | i18n }}</p>
              </article>
            </div>

            <div class="stats-graph-help-actions">
              <strong>{{ 'stats.graph.help.actions.title' | i18n }}</strong>
              <p>{{ 'stats.graph.help.actions.body' | i18n }}</p>
            </div>
          </div>
        </app-popup>
      }
  </app-popup>
}
`, styles: ['/* src/app/admin/components/stats-popup/admin-stats-popup.component.scss */\n:host {\n  --interactive-motion-duration: 160ms;\n  --interactive-motion-ease: cubic-bezier(0.22, 1, 0.36, 1);\n  --interactive-hover-lift: -1px;\n  --interactive-hover-scale: 1.01;\n  --interactive-hover-brightness: 1.01;\n  --interactive-press-scale: 0.97;\n  --interactive-press-brightness: 0.97;\n}\n:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]) {\n  -webkit-tap-highlight-color: transparent;\n  transition:\n    transform var(--interactive-motion-duration) var(--interactive-motion-ease),\n    filter var(--interactive-motion-duration) var(--interactive-motion-ease),\n    box-shadow var(--interactive-motion-duration) var(--interactive-motion-ease),\n    background-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    border-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    color var(--interactive-motion-duration) var(--interactive-motion-ease);\n  transform-origin: center;\n}\n:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):focus-visible {\n  outline: 2px solid rgba(66, 110, 182, 0.44);\n  outline-offset: 2px;\n}\n@media (hover: hover) and (pointer: fine) {\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):hover {\n    transform: translateY(var(--interactive-hover-lift)) scale(var(--interactive-hover-scale));\n    filter: brightness(var(--interactive-hover-brightness));\n  }\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  :where(.motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):hover {\n    box-shadow: 0 3px 10px rgba(16, 29, 48, 0.14);\n  }\n}\n@keyframes shared-mobile-touch-feedback {\n  0% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n  45% {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  100% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n}\n@media (hover: none), (pointer: coarse) {\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    animation: shared-mobile-touch-feedback 0.2s ease;\n  }\n}\n.app-popup,\n.mobile-profile-selector-sheet-wrap,\n.popup-surface,\n.experience-form-popup {\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.app-popup button,\n.app-popup input,\n.app-popup textarea,\n.app-popup select,\n.app-popup .mat-mdc-select,\n.app-popup .mat-mdc-select-value-text,\n.app-popup .mat-mdc-option,\n.popup-surface button,\n.popup-surface input,\n.popup-surface textarea,\n.popup-surface select,\n.popup-surface .mat-mdc-select,\n.popup-surface .mat-mdc-select-value-text,\n.popup-surface .mat-mdc-option,\n.experience-form-popup button,\n.experience-form-popup input,\n.experience-form-popup textarea,\n.experience-form-popup select,\n.experience-form-popup .mat-mdc-select,\n.experience-form-popup .mat-mdc-select-value-text,\n.experience-form-popup .mat-mdc-option,\n.mobile-profile-selector-sheet-wrap button,\n.mobile-profile-selector-sheet-wrap input,\n.mobile-profile-selector-sheet-wrap .mat-mdc-option {\n  font-family: inherit;\n}\n.popup-filter-picker,\n.activities-view-picker {\n  position: relative;\n  z-index: 60;\n  margin-left: auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-filter-picker-secondary,\n.activities-secondary-picker {\n  position: relative;\n  z-index: 61;\n}\n.selector-like {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n}\n.profile-status-select-wrap.popup-compact-select,\n.profile-status-select-wrap.activities-compact-select,\n.profile-status-select-wrap.assets-compact-select {\n  width: fit-content !important;\n  min-width: 0 !important;\n  max-width: 100%;\n}\n.profile-status-select-wrap.popup-compact-select .mat-mdc-select,\n.profile-status-select-wrap.activities-compact-select .mat-mdc-select,\n.profile-status-select-wrap.assets-compact-select .mat-mdc-select {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select .mat-mdc-select-trigger,\n.profile-status-select-wrap.activities-compact-select .mat-mdc-select-trigger,\n.profile-status-select-wrap.assets-compact-select .mat-mdc-select-trigger {\n  width: auto !important;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select .status-option-content,\n.profile-status-select-wrap.activities-compact-select .status-option-content,\n.profile-status-select-wrap.assets-compact-select .status-option-content {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge,\n.profile-status-select-wrap.activities-filter-no-badge {\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge .status-option-content,\n.profile-status-select-wrap.activities-filter-no-badge .status-option-content {\n  width: auto !important;\n  flex: 0 1 auto;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select-trigger,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select-trigger {\n  width: auto !important;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select-arrow-wrapper,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select-arrow-wrapper {\n  margin-left: 0.28rem;\n}\n.profile-status-select-wrap {\n  min-width: 174px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  border: 1px solid #c8d3e2;\n  border-radius: 999px;\n  box-shadow: 0 2px 6px rgba(38, 60, 92, 0.08);\n  padding: 0.12rem 0.5rem 0.12rem 0.84rem;\n  background: #f8f9fb;\n}\n.profile-status-select-wrap.selector-like {\n  min-height: 36px;\n}\n.status-option-content {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.2rem;\n  text-transform: lowercase;\n  width: 100%;\n  min-width: 0;\n}\n.status-option-content span:last-child {\n  white-space: nowrap;\n}\n.status-option-content .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  flex: 0 0 16px;\n}\n.rate-filter-count-badge {\n  margin-left: auto;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  border: 1px solid #fff;\n  background: #d84d4d;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  font-size: 0.68rem;\n  font-weight: 800;\n  line-height: 1;\n  box-shadow: 0 2px 8px rgba(120, 24, 24, 0.22);\n}\n.rate-filter-trigger-badge {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  margin-left: 0;\n  z-index: 2;\n}\n.popup-filter-control,\n.activities-rate-filter-select,\n.activities-primary-filter-select,\n.activities-event-scope-filter-select,\n.activities-chat-context-filter-select {\n  position: relative;\n  overflow: visible;\n}\n.popup-filter-panel,\n.activities-view-picker-panel {\n  position: absolute;\n  top: calc(100% + 0.32rem);\n  right: 0;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 10px;\n  background: #fff;\n  box-shadow: 0 10px 24px rgba(17, 29, 48, 0.22);\n  padding: 0.24rem;\n  min-width: 128px;\n  z-index: 40;\n  display: grid;\n  gap: 0.16rem;\n}\n.popup-filter-option,\n.activities-view-option {\n  border: 0;\n  background: #fff;\n  border-radius: 8px;\n  min-height: 32px;\n  padding: 0.34rem 0.44rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.34rem;\n  color: #1e3658;\n  cursor: pointer;\n  text-align: left;\n}\n.popup-filter-option .mat-icon,\n.activities-view-option .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-filter-option span,\n.activities-view-option span {\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.popup-filter-option > span:not(.rate-filter-count-badge),\n.activities-view-option > span:not(.rate-filter-count-badge) {\n  flex: 1 1 auto;\n  min-width: 0;\n  text-align: left;\n}\n.popup-mobile-filter-picker,\n.activities-mobile-primary-filter-picker,\n.activities-mobile-event-scope-filter-picker,\n.activities-mobile-chat-context-filter-picker,\n.activities-mobile-rate-filter-picker {\n  position: relative;\n}\n.popup-mobile-filter-panel,\n.activities-mobile-filter-panel,\n.activities-mobile-rate-filter-panel {\n  top: calc(100% + 0.24rem);\n  right: 0;\n  min-width: 210px;\n  z-index: 65;\n}\n.popup-mobile-sheet-title,\n.activities-mobile-sheet-title {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  padding: 0 0.14rem;\n  color: #1c3354;\n  font-size: 0.94rem;\n  font-weight: 800;\n}\n.popup-mobile-sheet-title .mat-icon,\n.activities-mobile-sheet-title .mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .popup-view-fab span,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .mat-mdc-select,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .status-option-content span:last-child,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .mat-mdc-select-value-text {\n  font-weight: 400 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option .status-option-content {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  width: 100%;\n  min-width: 0;\n  column-gap: 0.34rem;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option .rate-filter-count-badge {\n  margin-left: 0;\n  justify-self: end;\n}\n:host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.selector-options-panel),\n:host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.status-options-panel) {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n@media (max-width: 760px) {\n  .popup-mobile-filter-panel .popup-filter-option,\n  .popup-mobile-filter-panel .activities-view-option,\n  .activities-mobile-filter-panel .popup-filter-option,\n  .activities-mobile-filter-panel .activities-view-option,\n  .activities-mobile-rate-filter-panel .popup-filter-option,\n  .activities-mobile-rate-filter-panel .activities-view-option {\n    width: 100%;\n    min-width: 0;\n    box-sizing: border-box;\n    border: 1px solid rgba(58, 81, 114, 0.24);\n    border-radius: 12px;\n    background: #f7f9fd;\n    min-height: 42px;\n    padding: 0.46rem 0.62rem;\n    justify-content: flex-start;\n    gap: 0.36rem;\n  }\n  .popup-mobile-filter-panel .popup-filter-option.active,\n  .popup-mobile-filter-panel .activities-view-option.active,\n  .activities-mobile-filter-panel .popup-filter-option.active,\n  .activities-mobile-filter-panel .activities-view-option.active,\n  .activities-mobile-rate-filter-panel .popup-filter-option.active,\n  .activities-mobile-rate-filter-panel .activities-view-option.active {\n    box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.24);\n    filter: brightness(0.95);\n  }\n  .popup-mobile-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .popup-mobile-filter-panel .activities-view-option .rate-filter-count-badge,\n  .activities-mobile-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .activities-mobile-filter-panel .activities-view-option .rate-filter-count-badge,\n  .activities-mobile-rate-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .activities-mobile-rate-filter-panel .activities-view-option .rate-filter-count-badge {\n    margin-left: auto;\n    flex: 0 0 auto;\n  }\n  :host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.profile-bottom-sheet-panel) {\n    position: fixed !important;\n    left: 0 !important;\n    right: 0 !important;\n    bottom: 0 !important;\n    top: auto !important;\n    width: 100vw !important;\n    max-width: 100vw !important;\n    transform: none !important;\n  }\n  :host ::ng-deep .mat-mdc-select-panel.profile-bottom-sheet-panel {\n    width: 100vw !important;\n    max-width: 100vw !important;\n    max-height: min(54vh, 420px) !important;\n    margin: 0 !important;\n    border-radius: 16px 16px 0 0 !important;\n    border: 1px solid #d6deea;\n    border-bottom: 0;\n    box-shadow: 0 -14px 28px rgba(15, 29, 52, 0.24);\n    padding-top: 0.38rem;\n    padding-bottom: max(0.55rem, env(safe-area-inset-bottom));\n  }\n}\n.popup-view-fab {\n  height: 34px;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 999px;\n  background: #f3f7ff;\n  color: #2c4c74;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0 0.62rem;\n  cursor: pointer;\n}\n.popup-view-fab .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-view-fab span {\n  font-size: 0.74rem;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.event-visibility-picker {\n  position: relative;\n  z-index: 22;\n  margin-left: auto;\n  flex: 0 0 auto;\n}\n.event-visibility-trigger {\n  flex-wrap: nowrap;\n}\n.profile-status-header-picker .event-visibility-trigger.status-public,\n.profile-status-header-picker .activities-view-option.status-public {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e6f6ef);\n}\n.profile-status-header-picker .event-visibility-trigger.status-friends,\n.profile-status-header-picker .activities-view-option.status-friends {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e8f1fd);\n}\n.profile-status-header-picker .event-visibility-trigger.status-host,\n.profile-status-header-picker .activities-view-option.status-host {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6efe2);\n}\n.profile-status-header-picker .event-visibility-trigger.status-inactive,\n.profile-status-header-picker .activities-view-option.status-inactive {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f2f3f5);\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-public,\n.profile-status-header-picker .activities-view-option.status-public .mat-icon {\n  color: #2f8f66;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-friends,\n.profile-status-header-picker .activities-view-option.status-friends .mat-icon {\n  color: #1b57a1;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-host,\n.profile-status-header-picker .activities-view-option.status-host .mat-icon {\n  color: #87580f;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-inactive,\n.profile-status-header-picker .activities-view-option.status-inactive .mat-icon {\n  color: #5b6573;\n}\n.app-popup textarea,\n.app-popup input,\n.app-popup select,\n.popup-surface textarea,\n.popup-surface input,\n.popup-surface select,\n.experience-form-popup textarea,\n.experience-form-popup input,\n.experience-form-popup select,\n.mobile-profile-selector-sheet-wrap input {\n  width: 100%;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.48rem 0.56rem;\n  font: inherit;\n  color: var(--text-main);\n  background: #fff;\n}\n.app-popup textarea,\n.popup-surface textarea,\n.experience-form-popup textarea {\n  resize: vertical;\n}\n.app-popup textarea:focus,\n.app-popup input:focus,\n.app-popup select:focus,\n.popup-surface textarea:focus,\n.popup-surface input:focus,\n.popup-surface select:focus,\n.experience-form-popup textarea:focus,\n.experience-form-popup input:focus,\n.experience-form-popup select:focus,\n.mobile-profile-selector-sheet-wrap input:focus {\n  outline: 0;\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n}\n.popup-surface-form-grid,\n.experience-form-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  max-width: none;\n  width: 100%;\n  margin: 0;\n  justify-content: stretch;\n  align-content: start;\n  align-items: start;\n  column-gap: 1rem;\n  row-gap: 0.9rem;\n}\n.popup-surface-form-grid label,\n.experience-form-grid label {\n  display: grid;\n  grid-template-rows: min-content;\n  gap: 0;\n  font-weight: 600;\n  color: rgba(26, 44, 69, 0.88);\n}\n.popup-surface-form-grid input,\n.experience-form-grid input {\n  min-height: 40px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid textarea,\n.experience-form-grid textarea {\n  min-height: 96px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid .profile-status-select-wrap.selector-like,\n.experience-form-grid .profile-status-select-wrap.selector-like {\n  min-height: 40px;\n  height: 40px;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid .mat-mdc-select-trigger,\n.experience-form-grid .mat-mdc-select-trigger {\n  min-height: 32px;\n}\n.popup-surface-description-field,\n.experience-description-field {\n  grid-column: 1/-1;\n}\n.popup-surface-actions,\n.experience-form-actions {\n  justify-content: center;\n  padding-top: 0.2rem;\n}\n.popup-actions {\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.link-btn {\n  border: 1px solid var(--line-strong);\n  border-radius: 999px;\n  background: #fff;\n  color: #1f3350;\n  font: inherit;\n  font-size: 0.83rem;\n  padding: 0.38rem 0.76rem;\n  cursor: pointer;\n}\n.neutral-btn {\n  background: #f2f4fa;\n  border-color: rgba(23, 33, 54, 0.12);\n}\n.primary-btn {\n  background: #4776b7;\n  border-color: #4776b7;\n  color: #fff;\n}\n.profile-status-select-wrap .mat-icon,\n.date-picker-btn .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: #566b86;\n}\n.profile-status-select-wrap .mat-mdc-select {\n  min-width: 80px;\n  width: 100%;\n  font-size: 0.8rem;\n  font-weight: 700;\n  text-transform: lowercase;\n}\n.profile-status-select-wrap .mat-mdc-select-trigger {\n  width: 100%;\n  justify-content: flex-start;\n}\n.profile-status-select-wrap .mat-mdc-select-arrow-wrapper {\n  margin-left: auto;\n}\n.status-public {\n  color: #2f8f66;\n}\n.status-friends {\n  color: #1b57a1;\n}\n.status-host {\n  color: #87580f;\n}\n.status-inactive {\n  color: #5b6573;\n}\n.status-option-content .status-public {\n  color: #2f8f66;\n}\n.status-option-content .status-friends {\n  color: #1b57a1;\n}\n.status-option-content .status-host {\n  color: #87580f;\n}\n.status-option-content .status-inactive {\n  color: #5b6573;\n}\n.profile-status-select-wrap.status-public .status-option-content .mat-icon {\n  color: #2f8f66;\n}\n.profile-status-select-wrap.status-friends .status-option-content .mat-icon {\n  color: #1b57a1;\n}\n.profile-status-select-wrap.status-host .status-option-content .mat-icon {\n  color: #87580f;\n}\n.profile-status-select-wrap.status-inactive .status-option-content .mat-icon {\n  color: #5b6573;\n}\n.profile-details-values-btn .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: rgba(44, 67, 100, 0.72);\n}\n.profile-details-values-btn {\n  min-height: 36px;\n  height: 36px;\n  box-sizing: border-box;\n  padding-top: 0;\n  padding-bottom: 0;\n}\n.profile-details-values-btn .status-option-content.profile-details-selected-badges {\n  display: inline-grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  column-gap: 0.26rem;\n  min-width: 0;\n  width: 100%;\n}\n.profile-details-values-btn.profile-details-values-tone-values .profile-details-inline-chip {\n  max-width: calc(100% - 2.6rem);\n}\n.profile-details-values-btn.profile-details-values-tone-interest .profile-details-inline-chip {\n  max-width: calc((100% - 3.2rem) / 2);\n}\n.profile-details-values-btn.profile-details-values-tone-values .profile-details-inline-overflow {\n  color: #1e6b5a;\n}\n.profile-details-values-btn.profile-details-values-tone-interest .profile-details-inline-overflow {\n  color: #2e5a90;\n}\n.values-header-chips {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.28rem;\n  flex: 0 0 100%;\n  margin-left: 0;\n  margin-top: 0.34rem;\n  max-width: 100%;\n  overflow: visible;\n  white-space: normal;\n  padding-bottom: 0;\n}\n.popup-title-values {\n  margin-right: 0.38rem;\n}\n.values-selected-chip {\n  border: 1px solid rgba(76, 99, 136, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9ff 0%,\n      #eef3ff 100%);\n  color: #24416a;\n  border-radius: 999px;\n  min-height: 26px;\n  padding: 0.18rem 0.46rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-size: 0.7rem;\n  font-weight: 700;\n  cursor: pointer;\n  flex: 0 0 auto;\n}\n.values-selected-chip .mat-icon {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.values-selected-chip.section-family {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1ea 0%,\n      #ffe6dd 100%);\n  border-color: rgba(160, 90, 51, 0.32);\n  color: #8b4d2b;\n}\n.values-selected-chip.section-ambition {\n  background:\n    linear-gradient(\n      180deg,\n      #fff7e8 0%,\n      #ffefd7 100%);\n  border-color: rgba(160, 106, 20, 0.32);\n  color: #9a6614;\n}\n.values-selected-chip.section-lifestyle {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f5 0%,\n      #e0f2ee 100%);\n  border-color: rgba(45, 125, 120, 0.32);\n  color: #2a6e6a;\n}\n.values-selected-chip.section-beliefs {\n  background:\n    linear-gradient(\n      180deg,\n      #f0ecff 0%,\n      #e8e1fa 100%);\n  border-color: rgba(95, 78, 160, 0.32);\n  color: #564793;\n}\n.values-selected-chip.section-social {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n  color: #2d5ea8;\n}\n.values-selected-chip.section-arts {\n  background:\n    linear-gradient(\n      180deg,\n      #f2edfb 0%,\n      #e9e2f9 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n  color: #654ca1;\n}\n.values-selected-chip.section-food {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4e8 0%,\n      #fee9d6 100%);\n  border-color: rgba(170, 97, 28, 0.32);\n  color: #9d611c;\n}\n.values-selected-chip.section-active {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.values-selected-chip.section-mind {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f6 0%,\n      #def1ee 100%);\n  border-color: rgba(37, 124, 118, 0.32);\n  color: #2d7d78;\n}\n.values-selected-chip.section-identity {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n  border-color: rgba(88, 78, 159, 0.32);\n  color: #5a4ea0;\n}\n.readonly-select {\n  width: fit-content;\n  min-width: 0;\n  max-width: 130px;\n  justify-content: center;\n  margin-top: 2px;\n  padding-left: 0.44rem;\n  padding-right: 0.44rem;\n}\n.readonly-field {\n  min-height: 34px;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.4rem 0.56rem;\n  background: #f7fafe;\n  color: #23476f;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-weight: 700;\n}\n.readonly-field .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.zodiac-symbol {\n  font-size: 1.1rem;\n  font-weight: 800;\n  line-height: 1;\n}\n.zodiac-label {\n  font-size: 0.9rem;\n  font-weight: 700;\n  min-width: 0;\n  text-align: center;\n}\n.readonly-select.zodiac-aries {\n  background: #fdf1f1;\n  color: #9f2f2f;\n}\n.readonly-select.zodiac-taurus {\n  background: #f7f3eb;\n  color: #6e4b2b;\n}\n.readonly-select.zodiac-gemini {\n  background: #fdf8e9;\n  color: #7d5a12;\n}\n.readonly-select.zodiac-cancer {\n  background: #eef4ff;\n  color: #2d5b8e;\n}\n.readonly-select.zodiac-leo {\n  background: #fff3e8;\n  color: #8f4b0d;\n}\n.readonly-select.zodiac-virgo {\n  background: #edf8ef;\n  color: #2b6b3d;\n}\n.readonly-select.zodiac-libra {\n  background: #f2eefc;\n  color: #60439d;\n}\n.readonly-select.zodiac-scorpio {\n  background: #f9edf2;\n  color: #7b3150;\n}\n.readonly-select.zodiac-sagittarius {\n  background: #eef1ff;\n  color: #2f4a9a;\n}\n.readonly-select.zodiac-capricorn {\n  background: #eff2f5;\n  color: #364653;\n}\n.readonly-select.zodiac-aquarius {\n  background: #ebf7fb;\n  color: #1d5f7a;\n}\n.readonly-select.zodiac-pisces {\n  background: #eef2ff;\n  color: #294b8f;\n}\n.physique-slim {\n  color: #3f7ab3;\n}\n.physique-lean {\n  color: #3f8f5f;\n}\n.physique-athletic {\n  color: #2f7e4d;\n}\n.physique-fit {\n  color: #465fbb;\n}\n.physique-curvy {\n  color: #a14875;\n}\n.physique-muscular {\n  color: #7d4f24;\n}\n.physique-average {\n  color: #4d667f;\n}\n.physique-select-wrap.physique-slim {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf3fb 0%,\n      #dfebf8 100%);\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.physique-select-wrap.physique-lean {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf6ee 0%,\n      #def0e5 100%);\n  border-color: rgba(63, 143, 95, 0.34);\n}\n.physique-select-wrap.physique-athletic {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f5ec 0%,\n      #dff0e6 100%);\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.physique-select-wrap.physique-fit {\n  background:\n    linear-gradient(\n      180deg,\n      #ebf0ff 0%,\n      #e1e8fc 100%);\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.physique-select-wrap.physique-curvy {\n  background:\n    linear-gradient(\n      180deg,\n      #f7edf3 0%,\n      #f0e3ec 100%);\n  border-color: rgba(161, 72, 117, 0.36);\n}\n.physique-select-wrap.physique-muscular {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe9 0%,\n      #ede3d8 100%);\n  border-color: rgba(125, 79, 36, 0.36);\n}\n.physique-select-wrap.physique-average {\n  background:\n    linear-gradient(\n      180deg,\n      #eef2f6 0%,\n      #e5ebf1 100%);\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.physique-select-wrap.physique-slim .status-option-content .mat-icon {\n  color: #3f7ab3;\n}\n.physique-select-wrap.physique-lean .status-option-content .mat-icon {\n  color: #3f8f5f;\n}\n.physique-select-wrap.physique-athletic .status-option-content .mat-icon {\n  color: #2f7e4d;\n}\n.physique-select-wrap.physique-fit .status-option-content .mat-icon {\n  color: #465fbb;\n}\n.physique-select-wrap.physique-curvy .status-option-content .mat-icon {\n  color: #a14875;\n}\n.physique-select-wrap.physique-muscular .status-option-content .mat-icon {\n  color: #7d4f24;\n}\n.physique-select-wrap.physique-average .status-option-content .mat-icon {\n  color: #4d667f;\n}\n.experience-filter-all {\n  color: #694ea6;\n}\n.experience-filter-workspace {\n  color: #a1485a;\n}\n.experience-filter-school {\n  color: #2d5ea8;\n}\n.experience-filter-online {\n  color: #2d7d47;\n}\n.experience-filter-project {\n  color: #6550a0;\n}\n.experience-filter-select.experience-filter-all,\n.experience-type-select.experience-filter-project {\n  background:\n    linear-gradient(\n      180deg,\n      #efe8ff 0%,\n      #e8defc 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n}\n.experience-filter-select.experience-filter-workspace,\n.experience-type-select.experience-filter-workspace {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f3 0%,\n      #ffe6ea 100%);\n  border-color: rgba(169, 72, 90, 0.32);\n}\n.experience-filter-select.experience-filter-school,\n.experience-type-select.experience-filter-school {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n}\n.experience-type-select.experience-filter-online {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n}\n.experience-type-select.experience-filter-project {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n}\n.experience-type-select {\n  min-width: 0;\n  max-width: 100%;\n  min-height: 40px;\n}\n.experience-type-field,\n.experience-title-field,\n.experience-city-field {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-org-field {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-type-select {\n  width: 100%;\n}\n.experience-date-range-field {\n  width: 100%;\n  max-width: none;\n  margin: 0;\n  background: transparent;\n}\n.experience-date-range-label {\n  grid-column: 1/2;\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-date-range-field .mat-mdc-text-field-wrapper {\n  min-height: 42px;\n  border-radius: 10px;\n  background: #fff;\n  border: 1px solid rgba(136, 156, 186, 0.5);\n  box-shadow: none;\n}\n.experience-date-range-field .mat-mdc-form-field-subscript-wrapper {\n  margin-top: 0.24rem;\n}\n.experience-date-range-field input {\n  border: 0 !important;\n  box-shadow: none !important;\n  border-radius: 0 !important;\n  background: transparent !important;\n  min-width: 0;\n  width: 100%;\n  padding: 0 !important;\n  min-height: 0 !important;\n  height: auto !important;\n  line-height: 1.25;\n}\n.experience-date-range-field .mat-datepicker-toggle {\n  margin-right: 0.2rem;\n}\n.experience-date-range-field .mat-mdc-form-field-hint-wrapper,\n.experience-date-range-field .mat-mdc-form-field-hint {\n  color: rgba(30, 49, 74, 0.65);\n  font-size: 0.72rem;\n}\n.experience-date-range-field .mat-date-range-input-container {\n  width: 100%;\n  display: grid;\n  grid-template-columns: minmax(96px, 1fr) auto minmax(96px, 1fr);\n  align-items: center;\n  column-gap: 0.34rem;\n  min-width: 0;\n}\n.experience-date-range-field .mat-date-range-input-separator {\n  margin: 0 0.28rem;\n  flex: 0 0 auto;\n  white-space: nowrap;\n}\n.experience-date-range-field .mat-date-range-input-start-wrapper,\n.experience-date-range-field .mat-date-range-input-end-wrapper {\n  width: 100%;\n  max-width: 100%;\n  overflow: visible;\n  min-width: 0;\n}\n.experience-date-range-field .mat-date-range-input-inner {\n  font-size: 0.96rem;\n  min-width: 0 !important;\n  width: 100% !important;\n  text-overflow: clip;\n  white-space: nowrap;\n  line-height: 1.25;\n}\n.experience-date-range-field .mat-mdc-form-field-flex {\n  min-width: 0;\n  border-bottom: 0 !important;\n  box-shadow: none !important;\n  align-items: center !important;\n}\n.experience-date-range-field .mat-mdc-form-field-infix {\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  min-height: 34px !important;\n  height: 34px;\n  display: flex;\n  align-items: center;\n}\n.experience-date-range-field .mdc-line-ripple,\n.experience-date-range-field .mat-mdc-form-field-line-ripple,\n.experience-date-range-field .mdc-line-ripple--deactivating,\n.experience-date-range-field .mdc-line-ripple--active {\n  display: none !important;\n  opacity: 0 !important;\n  transform: scaleX(0) !important;\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-all {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efe8ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-workspace {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1f3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-school {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf4ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-online {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf8ee);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-project {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f4f0ff);\n}\n.mobile-profile-language-chip.language-tone-1,\n.mobile-profile-selector-option.language-tone-1,\n:host ::ng-deep .mat-mdc-option.language-tone-1 {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n  color: #2f6090;\n}\n.mobile-profile-language-chip.language-tone-2,\n.mobile-profile-selector-option.language-tone-2,\n:host ::ng-deep .mat-mdc-option.language-tone-2 {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n  color: #2f695b;\n}\n.mobile-profile-language-chip.language-tone-3,\n.mobile-profile-selector-option.language-tone-3,\n:host ::ng-deep .mat-mdc-option.language-tone-3 {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n  color: #394f9c;\n}\n.mobile-profile-language-chip.language-tone-4,\n.mobile-profile-selector-option.language-tone-4,\n:host ::ng-deep .mat-mdc-option.language-tone-4 {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n  color: #8d3f66;\n}\n.mobile-profile-language-chip.language-tone-5,\n.mobile-profile-selector-option.language-tone-5,\n:host ::ng-deep .mat-mdc-option.language-tone-5 {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n  color: #704822;\n}\n.mobile-profile-language-chip.language-tone-6,\n.mobile-profile-selector-option.language-tone-6,\n:host ::ng-deep .mat-mdc-option.language-tone-6 {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n  color: #415872;\n}\n.mobile-profile-language-chip.language-tone-7,\n.mobile-profile-selector-option.language-tone-7,\n:host ::ng-deep .mat-mdc-option.language-tone-7 {\n  background: #f7f5ea;\n  border-color: rgba(128, 109, 66, 0.34);\n  color: #746237;\n}\n.mobile-profile-language-chip.language-tone-8,\n.mobile-profile-selector-option.language-tone-8,\n:host ::ng-deep .mat-mdc-option.language-tone-8 {\n  background: #edf5ff;\n  border-color: rgba(45, 122, 160, 0.34);\n  color: #2f6782;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf2ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #ebf7ef);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1e3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efecfc);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3f8e9);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fceef3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf7ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6f2e9);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-1 .status-option-content {\n  color: #2d63a9;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-2 .status-option-content {\n  color: #2a7a49;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-3 .status-option-content {\n  color: #9b6018;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-4 .status-option-content {\n  color: #6153a2;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-5 .status-option-content {\n  color: #61812a;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-6 .status-option-content {\n  color: #9f446d;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-7 .status-option-content {\n  color: #2e7898;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-8 .status-option-content {\n  color: #806c3f;\n}\n.mobile-profile-selector-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      180deg,\n      #eef5ff 0%,\n      #e3eefc 100%);\n  border-color: rgba(46, 102, 181, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      180deg,\n      #eef9f3 0%,\n      #e3f4ea 100%);\n  border-color: rgba(40, 125, 72, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ea 0%,\n      #ffecdd 100%);\n  border-color: rgba(165, 94, 24, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f1ff 0%,\n      #e8e5fb 100%);\n  border-color: rgba(97, 82, 164, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f9ef 0%,\n      #edf3e1 100%);\n  border-color: rgba(95, 128, 36, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #f9e6ed 100%);\n  border-color: rgba(160, 70, 111, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ff 0%,\n      #e2f0fb 100%);\n  border-color: rgba(45, 122, 160, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f3ea 0%,\n      #eee9dc 100%);\n  border-color: rgba(128, 109, 66, 0.32);\n}\n.mobile-profile-selector-option.status-public {\n  background:\n    linear-gradient(\n      180deg,\n      #e6f6ef 0%,\n      #d9f0e6 100%);\n  border-color: rgba(47, 143, 102, 0.34);\n}\n.mobile-profile-selector-option.status-friends {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f1fd 0%,\n      #dfeaf9 100%);\n  border-color: rgba(27, 87, 161, 0.34);\n}\n.mobile-profile-selector-option.status-host {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe2 0%,\n      #eee4d2 100%);\n  border-color: rgba(135, 88, 15, 0.36);\n}\n.mobile-profile-selector-option.status-inactive {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3f5 0%,\n      #e8ebef 100%);\n  border-color: rgba(91, 101, 115, 0.32);\n}\n.mobile-profile-selector-option.physique-slim {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.mobile-profile-selector-option.physique-lean {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n}\n.mobile-profile-selector-option.physique-athletic {\n  background: #e8f5ec;\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.mobile-profile-selector-option.physique-fit {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.mobile-profile-selector-option.physique-curvy {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n}\n.mobile-profile-selector-option.physique-muscular {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n}\n.mobile-profile-selector-option.physique-average {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.popup-panel-profile-selector .values-selector-popup.profile-selector-popup {\n  gap: 0.56rem;\n}\n.popup-panel-profile-selector .profile-filter-selector-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.44rem;\n  padding-bottom: 0.22rem;\n  border-bottom: 1px solid rgba(74, 102, 139, 0.22);\n}\n.popup-panel-profile-selector .profile-filter-selector-head-label {\n  color: #203c64;\n  font-size: 0.82rem;\n  font-weight: 800;\n  line-height: 1.2;\n}\n.popup-panel-profile-selector .profile-filter-selector-clear {\n  border: 1px solid rgba(41, 73, 110, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.82);\n  color: #284970;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.3rem 0.52rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector .profile-filter-selector-clear.is-hidden {\n  visibility: hidden;\n  pointer-events: none;\n}\n.popup-panel-profile-selector .profile-filter-selector-selected {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector .profile-filter-selector-chip {\n  border: 1px solid rgba(35, 68, 107, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.92);\n  color: #234368;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.26rem 0.48rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.16rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector .profile-filter-selector-chip .mat-icon {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n}\n.popup-panel-profile-selector .profile-filter-selector-empty {\n  margin: 0;\n  font-size: 0.74rem;\n  color: rgba(31, 54, 86, 0.62);\n  font-style: italic;\n}\n.popup-panel-profile-selector .profile-selector-option-group {\n  display: grid;\n  gap: 0.34rem;\n  border: 1px solid transparent;\n  border-radius: 12px;\n  padding: 0.4rem 0.42rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-head {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag {\n  border-radius: 999px;\n  border: 1px solid rgba(52, 86, 128, 0.28);\n  background: rgba(255, 255, 255, 0.74);\n  color: #2f527d;\n  font-size: 0.67rem;\n  font-weight: 800;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.2rem 0.52rem;\n  text-transform: uppercase;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag-icon {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.popup-panel-profile-selector .profile-selector-option-group-line {\n  display: block;\n  width: 100%;\n  height: 1px;\n  background: rgba(84, 111, 147, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-chip-grid {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.36rem;\n}\n.popup-panel-profile-selector .profile-selector-chip {\n  border: 1px solid rgba(41, 70, 106, 0.22);\n  border-radius: 999px;\n  background: #f4f8ff;\n  color: #234066;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 700;\n  padding: 0.3rem 0.58rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  cursor: pointer;\n  transition:\n    background-color 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.popup-panel-profile-selector .profile-selector-chip.active {\n  border-color: rgba(27, 85, 158, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #dcebff 0%,\n      #cfe3ff 100%);\n  color: #123e70;\n  box-shadow: inset 0 0 0 1px rgba(30, 73, 127, 0.24), 0 1px 2px rgba(24, 53, 86, 0.16);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-family {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 232, 219, 0.52) 0%,\n      rgba(255, 232, 219, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-ambition {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 242, 216, 0.52) 0%,\n      rgba(255, 242, 216, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-lifestyle {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(221, 241, 239, 0.56) 0%,\n      rgba(221, 241, 239, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-beliefs {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-social {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(223, 236, 255, 0.5) 0%,\n      rgba(223, 236, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-arts {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(235, 227, 255, 0.5) 0%,\n      rgba(235, 227, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-food {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 236, 221, 0.52) 0%,\n      rgba(255, 236, 221, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-active {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(222, 243, 231, 0.56) 0%,\n      rgba(222, 243, 231, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-mind {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(219, 242, 238, 0.56) 0%,\n      rgba(219, 242, 238, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-identity {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-family {\n  border-color: rgba(156, 94, 51, 0.34);\n  color: #9c5e33;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-ambition {\n  border-color: rgba(160, 106, 20, 0.34);\n  color: #9b6717;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-lifestyle {\n  border-color: rgba(47, 123, 119, 0.34);\n  color: #2f7b77;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-beliefs {\n  border-color: rgba(95, 78, 160, 0.34);\n  color: #5f4ea0;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-social {\n  border-color: rgba(47, 106, 175, 0.36);\n  color: #2f6aaf;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-arts {\n  border-color: rgba(106, 87, 168, 0.36);\n  color: #6a57a8;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-food {\n  border-color: rgba(170, 97, 28, 0.34);\n  color: #a55e18;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-active {\n  border-color: rgba(49, 124, 82, 0.36);\n  color: #317c52;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-mind {\n  border-color: rgba(37, 124, 118, 0.34);\n  color: #2b7c76;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-identity {\n  border-color: rgba(98, 84, 163, 0.34);\n  color: #6254a3;\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-family {\n  background: rgba(156, 94, 51, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-ambition {\n  background: rgba(160, 106, 20, 0.32);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-lifestyle {\n  background: rgba(47, 123, 119, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-beliefs {\n  background: rgba(95, 78, 160, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-social {\n  background: rgba(47, 106, 175, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-arts {\n  background: rgba(106, 87, 168, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-food {\n  background: rgba(170, 97, 28, 0.32);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-active {\n  background: rgba(49, 124, 82, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-mind {\n  background: rgba(37, 124, 118, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-identity {\n  background: rgba(98, 84, 163, 0.3);\n}\n:host ::ng-deep .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.status-option) {\n  background: #f0f5fc;\n}\n:host ::ng-deep .mat-mdc-option.status-option.mdc-list-item--selected:not(.mdc-list-item--disabled) {\n  filter: brightness(0.95);\n  box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.2);\n}\n:host ::ng-deep .mat-mdc-option.status-option {\n  background: #fff;\n}\n:host ::ng-deep .mat-mdc-option.status-option:not(:last-child) {\n  border-bottom: 1px solid #e6edf7;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.hide-selected-option,\n:host ::ng-deep .status-options-panel .mat-mdc-option.hide-selected-option {\n  min-height: 0 !important;\n  height: 0 !important;\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  border: 0 !important;\n  margin: 0 !important;\n  opacity: 0 !important;\n  pointer-events: none !important;\n  overflow: hidden !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option {\n  background: #fff;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel {\n  margin-top: 8px !important;\n  margin-bottom: 8px !important;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .cdk-overlay-pane .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .cdk-overlay-pane .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above {\n  margin-top: 0 !important;\n  margin-bottom: 18px !important;\n  transform: translateY(-10px) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public {\n  --mdc-list-list-item-container-color: #def3e9;\n  --mat-mdc-option-selected-container-color: #def3e9;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #def3e9) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends {\n  --mdc-list-list-item-container-color: #e3eefb;\n  --mat-mdc-option-selected-container-color: #e3eefb;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e3eefb) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host {\n  --mdc-list-list-item-container-color: #f3ead8;\n  --mat-mdc-option-selected-container-color: #f3ead8;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3ead8) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive {\n  --mdc-list-list-item-container-color: #eceff3;\n  --mat-mdc-option-selected-container-color: #eceff3;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eceff3) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon {\n  color: #2f8f66 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon {\n  color: #1b57a1 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon {\n  color: #87580f !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon {\n  color: #5b6573 !important;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-slim {\n  background: #eaf4ff;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-lean {\n  background: #edf8f4;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-athletic {\n  background: #e8f5ec;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-fit {\n  background: #f1f2ff;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-curvy {\n  background: #fff2f8;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-muscular {\n  background: #fbf4ea;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-average {\n  background: #eff4f9;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-slim .status-option-content {\n  color: #3f7ab3;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-lean .status-option-content {\n  color: #3f8f5f;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-athletic .status-option-content {\n  color: #2f7e4d;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-fit .status-option-content {\n  color: #465fbb;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-curvy .status-option-content {\n  color: #a14875;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-muscular .status-option-content {\n  color: #7d4f24;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-average .status-option-content {\n  color: #4d667f;\n}\n:host ::ng-deep .mat-mdc-select-panel.physique-options-panel {\n  width: auto !important;\n  max-width: 220px !important;\n  min-width: 0 !important;\n}\n:host ::ng-deep .physique-options-panel .mat-mdc-option {\n  padding-right: 8px;\n}\n:host ::ng-deep .physique-options-panel .mat-mdc-option .mat-pseudo-checkbox {\n  margin-left: 4px;\n}\n@media (max-width: 760px) {\n  .experience-form-grid {\n    grid-template-columns: 1fr;\n    max-width: none;\n    justify-content: stretch;\n    row-gap: 0.72rem;\n  }\n  .experience-date-range-label {\n    grid-column: 1/-1;\n  }\n  .experience-date-range-field .mat-date-range-input-container {\n    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);\n  }\n  .profile-details-privacy-fab .privacy-fab-actions {\n    position: fixed;\n    left: 0.5rem;\n    right: 0.5rem;\n    bottom: max(0.5rem, env(safe-area-inset-bottom));\n    top: auto;\n    transform: translateY(12px) scale(0.98);\n    transform-origin: bottom center;\n    justify-content: center;\n    gap: 0.46rem;\n    padding: 0.46rem 0.56rem;\n    border: 1px solid rgba(42, 68, 102, 0.2);\n    border-radius: 14px;\n    background: #fff;\n    box-shadow: 0 -12px 24px rgba(18, 31, 51, 0.22);\n  }\n  .profile-details-privacy-fab.open .privacy-fab-actions {\n    transform: translateY(0) scale(1);\n  }\n}\n:host {\n  display: contents;\n}\n.stats-body {\n  position: relative;\n  min-height: 0;\n  height: 100%;\n  overflow: auto;\n  display: flex;\n  flex-direction: column;\n  gap: 0.72rem;\n}\n.stats-loading-overlay {\n  position: absolute;\n  inset: 4.1rem 0 0;\n  z-index: 30;\n  display: grid;\n  place-items: center;\n  pointer-events: auto;\n}\n.stats-loading-scrim {\n  position: absolute;\n  inset: 0;\n  background: rgba(244, 248, 255, 0.72);\n  -webkit-backdrop-filter: blur(2px);\n  backdrop-filter: blur(2px);\n}\n.stats-loading-card {\n  position: relative;\n  min-width: 188px;\n  border: 1px solid rgba(42, 81, 129, 0.18);\n  border-radius: 8px;\n  background: rgba(255, 255, 255, 0.94);\n  box-shadow: 0 18px 42px rgba(30, 58, 92, 0.18);\n  padding: 1rem 1.2rem;\n  display: grid;\n  place-items: center;\n  gap: 0.42rem;\n  color: rgba(34, 55, 84, 0.78);\n  font-weight: 900;\n}\n.stats-loading-state,\n.stats-error {\n  min-height: 180px;\n  border: 1px solid rgba(42, 81, 129, 0.14);\n  border-radius: 8px;\n  background: #f7faff;\n  color: rgba(34, 55, 84, 0.78);\n  display: grid;\n  place-items: center;\n  align-content: center;\n  gap: 0.42rem;\n  font-weight: 900;\n}\n.stats-loading-state {\n  min-height: 280px;\n  text-align: center;\n}\n.stats-error {\n  min-height: 62px;\n  color: #9a2f3d;\n  background: #fff5f6;\n  border-color: rgba(190, 63, 82, 0.26);\n  grid-auto-flow: column;\n}\n.stats-hero {\n  display: grid;\n  grid-template-columns: minmax(260px, 0.82fr) minmax(0, 1.8fr);\n  gap: 0.72rem;\n}\n.stats-health-card,\n.stats-kpi-card,\n.stats-panel {\n  border: 1px solid rgba(42, 81, 129, 0.14);\n  border-radius: 8px;\n  background: #f8fbff;\n  box-shadow: 0 14px 28px rgba(36, 69, 109, 0.08);\n}\n.stats-health-card {\n  min-height: 158px;\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  padding: 1rem;\n}\n.stats-health-card h3,\n.stats-panel h3 {\n  margin: 0;\n  font-size: 0.96rem;\n  color: #15375f;\n}\n.stats-health-card p {\n  margin: 0.35rem 0 0;\n  color: rgba(28, 53, 84, 0.72);\n  font-size: 0.82rem;\n  line-height: 1.35;\n}\n.stats-health-ring {\n  width: 94px;\n  height: 94px;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex: 0 0 auto;\n  box-shadow: inset 0 0 0 1px rgba(43, 95, 139, 0.12);\n}\n.stats-health-ring span {\n  width: 70px;\n  height: 70px;\n  border-radius: 50%;\n  background: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: #1f7649;\n  font-size: 1.28rem;\n  font-weight: 1000;\n}\n.stats-kpi-grid {\n  display: grid;\n  grid-template-columns: repeat(5, minmax(0, 1fr));\n  gap: 0.52rem;\n}\n.stats-kpi-card {\n  min-width: 0;\n  min-height: 172px;\n  padding: 0.72rem;\n  display: grid;\n  grid-template-rows: auto auto minmax(2.15rem, auto) minmax(2.2rem, auto) auto;\n  align-content: stretch;\n  gap: 0.42rem;\n}\n.stats-kpi-card strong {\n  font-size: 1.18rem;\n  color: #13355d;\n}\n.stats-kpi-card small {\n  display: block;\n  min-width: 0;\n  color: rgba(29, 55, 88, 0.74);\n  font-weight: 900;\n  line-height: 1.2;\n  overflow-wrap: anywhere;\n}\n.stats-kpi-caption {\n  color: rgba(29, 55, 88, 0.58);\n  font-size: 0.64rem;\n  font-weight: 800;\n  white-space: normal;\n}\n.stats-kpi-icon,\n.stats-segment-icon {\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  background: #eaf3ff;\n  color: #2f67a8;\n}\n.stats-kpi-bar,\n.stats-segment-bar {\n  height: 7px;\n  border-radius: 999px;\n  background: rgba(42, 81, 129, 0.12);\n  overflow: hidden;\n}\n.stats-kpi-bar span,\n.stats-segment-bar span {\n  height: 100%;\n  display: block;\n  border-radius: inherit;\n  background: #2f67a8;\n}\n.stats-grid {\n  display: grid;\n  grid-template-columns: 1.35fr 1fr;\n  gap: 0.72rem;\n}\n.stats-graph-panel {\n  display: grid;\n  gap: 0.72rem;\n}\n.stats-graph-panel header div {\n  min-width: 0;\n}\n.stats-graph-panel header p {\n  margin: 0.18rem 0 0;\n  color: rgba(29, 55, 88, 0.68);\n  font-size: 0.78rem;\n  font-weight: 850;\n}\n.stats-graph-header-actions {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n}\n.stats-graph-help-btn {\n  width: 36px;\n  height: 36px;\n  border: 1px solid rgba(25, 82, 148, 0.62);\n  border-radius: 50%;\n  background:\n    linear-gradient(\n      180deg,\n      #2f78bf,\n      #1f5f9c);\n  color: #ffffff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  cursor: pointer;\n  box-shadow: 0 10px 20px rgba(23, 78, 136, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.35);\n}\n.stats-graph-help-btn mat-icon {\n  font-size: 1.92rem;\n  width: 1.92rem;\n  height: 1.92rem;\n}\n.stats-graph-layout {\n  display: grid;\n  grid-template-columns: minmax(220px, 0.72fr) minmax(0, 1.28fr);\n  gap: 0.72rem;\n  align-items: stretch;\n}\n.stats-graph-map {\n  min-height: 252px;\n  border: 1px solid rgba(42, 81, 129, 0.1);\n  border-radius: 8px;\n  background:\n    radial-gradient(\n      circle at 30% 26%,\n      rgba(47, 103, 168, 0.1),\n      transparent 24%),\n    radial-gradient(\n      circle at 72% 70%,\n      rgba(47, 143, 91, 0.1),\n      transparent 22%),\n    #ffffff;\n  padding: 0.48rem;\n  display: grid;\n  grid-template-rows: minmax(0, 1fr) auto;\n  gap: 0.42rem;\n}\n.stats-graph-map svg {\n  width: 100%;\n  height: 100%;\n  min-height: 232px;\n  display: block;\n}\n.stats-graph-ring {\n  fill: none;\n  stroke: rgba(42, 81, 129, 0.13);\n  stroke-width: 1.2;\n  stroke-dasharray: 3 3;\n}\n.stats-graph-ring-inner {\n  stroke-dasharray: none;\n}\n.stats-graph-link {\n  stroke: rgba(46, 86, 135, 0.28);\n  stroke-width: 1.4;\n  stroke-linecap: round;\n}\n.stats-graph-community,\n.stats-graph-node {\n  cursor: pointer;\n}\n.stats-graph-community circle {\n  fill: rgba(47, 143, 91, 0.1);\n  stroke: rgba(47, 143, 91, 0.22);\n  stroke-width: 1.4;\n  filter: drop-shadow(0 8px 14px rgba(33, 72, 112, 0.12));\n}\n.stats-graph-node circle {\n  fill: #2f67a8;\n  stroke: #ffffff;\n  stroke-width: 2.5;\n  filter: drop-shadow(0 5px 8px rgba(28, 56, 90, 0.22));\n}\n.stats-graph-map text {\n  fill: #ffffff;\n  font-size: 7px;\n  font-weight: 1000;\n  dominant-baseline: middle;\n  text-anchor: middle;\n  pointer-events: none;\n}\n.stats-graph-map text.stats-graph-community-count {\n  fill: #15375f;\n  font-size: 5.2px;\n  stroke: rgba(255, 255, 255, 0.86);\n  stroke-width: 0.9px;\n  paint-order: stroke;\n}\n.stats-graph-map text.stats-graph-community-caption {\n  fill: rgba(21, 55, 95, 0.74);\n  font-size: 2.8px;\n  font-weight: 900;\n  stroke: rgba(255, 255, 255, 0.8);\n  stroke-width: 0.45px;\n  paint-order: stroke;\n}\n.stats-graph-map text.stats-graph-node-count {\n  fill: #ffffff;\n  font-size: 3.9px;\n  stroke: rgba(20, 48, 82, 0.2);\n  stroke-width: 0.5px;\n  paint-order: stroke;\n}\n.stats-graph-map-legend {\n  display: grid;\n  gap: 0.26rem;\n  border-top: 1px solid rgba(42, 81, 129, 0.1);\n  padding-top: 0.4rem;\n}\n.stats-graph-map-legend span {\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.34rem;\n  color: rgba(29, 55, 88, 0.74);\n  font-size: 0.7rem;\n  font-weight: 900;\n  line-height: 1.25;\n}\n.stats-graph-map-legend i {\n  flex: 0 0 auto;\n  width: 0.72rem;\n  height: 0.72rem;\n  border-radius: 50%;\n  display: inline-block;\n}\n.stats-graph-map-legend .is-community {\n  border: 2px solid rgba(47, 143, 91, 0.32);\n  background: rgba(47, 143, 91, 0.12);\n}\n.stats-graph-map-legend .is-bridge {\n  border: 2px solid #ffffff;\n  background: #2f67a8;\n  box-shadow: 0 0 0 1px rgba(42, 81, 129, 0.22);\n}\n.stats-graph-map-legend .is-link {\n  width: 0.9rem;\n  height: 0.18rem;\n  border-radius: 999px;\n  background: rgba(46, 86, 135, 0.42);\n}\n.stats-graph-copy {\n  min-width: 0;\n  border: 1px solid rgba(42, 81, 129, 0.1);\n  border-radius: 8px;\n  background: #ffffff;\n  padding: 0.82rem;\n  display: grid;\n  align-content: start;\n  gap: 0.64rem;\n}\n.stats-graph-copy strong,\n.stats-graph-rank h4,\n.stats-graph-timeline h4 {\n  margin: 0;\n  color: #15375f;\n  font-size: 0.86rem;\n}\n.stats-graph-copy p {\n  margin: 0;\n  color: rgba(28, 53, 84, 0.78);\n  font-size: 0.84rem;\n  line-height: 1.42;\n  font-weight: 850;\n}\n.stats-graph-focus {\n  min-height: 42px;\n  border: 1px solid rgba(47, 103, 168, 0.14);\n  border-radius: 8px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(247, 250, 255, 0.96),\n      rgba(255, 255, 255, 0.98));\n  padding: 0.46rem 0.56rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.6rem;\n}\n.stats-graph-focus span {\n  min-width: 0;\n  color: rgba(29, 55, 88, 0.74);\n  font-size: 0.76rem;\n  font-weight: 900;\n}\n.stats-graph-focus strong {\n  color: #15375f;\n  font-size: 1rem;\n  font-weight: 1000;\n}\n.stats-graph-actions {\n  border: 1px solid rgba(221, 137, 41, 0.26);\n  border-radius: 8px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 246, 232, 0.96),\n      rgba(255, 253, 249, 0.98));\n  padding: 0.58rem;\n  display: grid;\n  gap: 0.34rem;\n}\n.stats-graph-actions > strong {\n  color: #8b4f12;\n  font-size: 0.8rem;\n}\n.stats-graph-actions span {\n  min-width: 0;\n  border-radius: 8px;\n  border: 1px solid rgba(221, 137, 41, 0.14);\n  background: rgba(255, 255, 255, 0.72);\n  color: #654018;\n  padding: 0.34rem 0.44rem;\n  display: flex;\n  align-items: center;\n  gap: 0.3rem;\n  font-size: 0.7rem;\n  font-weight: 900;\n  line-height: 1.25;\n}\n.stats-graph-actions mat-icon {\n  flex: 0 0 auto;\n  font-size: 1rem;\n  width: 1rem;\n  height: 1rem;\n  color: #c8761f;\n}\n.stats-graph-metrics,\n.stats-graph-signals {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.42rem;\n}\n.stats-graph-metrics span {\n  min-width: 0;\n  border: 1px solid rgba(42, 81, 129, 0.1);\n  border-radius: 8px;\n  background: #f8fbff;\n  padding: 0.48rem;\n  display: grid;\n  gap: 0.16rem;\n  color: rgba(29, 55, 88, 0.72);\n  font-size: 0.7rem;\n  font-weight: 900;\n}\n.stats-graph-metrics mat-icon {\n  color: #2f67a8;\n}\n.stats-graph-metrics b {\n  color: #15375f;\n  font-size: 1rem;\n}\n.stats-graph-signal {\n  position: relative;\n  min-height: 38px;\n  overflow: hidden;\n  border: 1px solid rgba(42, 81, 129, 0.1);\n  border-radius: 8px;\n  background: #ffffff;\n  padding: 0.5rem 0.58rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n}\n.stats-graph-signal span {\n  min-width: 0;\n  color: #24466f;\n  font-size: 0.74rem;\n  font-weight: 900;\n}\n.stats-graph-signal strong {\n  color: #15375f;\n  font-weight: 1000;\n}\n.stats-graph-signal i {\n  position: absolute;\n  inset: auto auto 0 0;\n  height: 3px;\n  border-radius: 999px;\n  background: #2f67a8;\n}\n.stats-graph-bottom {\n  display: grid;\n  grid-template-columns: minmax(180px, 0.7fr) minmax(180px, 0.7fr) minmax(0, 1.3fr);\n  gap: 0.72rem;\n}\n.stats-graph-rank,\n.stats-graph-timeline {\n  min-width: 0;\n  border: 1px solid rgba(42, 81, 129, 0.1);\n  border-radius: 8px;\n  background: #ffffff;\n  padding: 0.68rem;\n  display: grid;\n  gap: 0.42rem;\n  align-content: start;\n}\n.stats-graph-timeline-chart {\n  height: 118px;\n}\n.stats-grid-charts {\n  grid-template-columns: minmax(0, 1.45fr) minmax(270px, 0.75fr);\n}\n.stats-panel {\n  min-width: 0;\n  padding: 0.82rem;\n}\n.stats-panel-wide {\n  grid-row: span 3;\n}\n.stats-panel header {\n  min-height: 30px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.72rem;\n  color: #46658d;\n}\n.stats-panel header span {\n  border: 1px solid rgba(47, 86, 139, 0.16);\n  border-radius: 999px;\n  padding: 0.18rem 0.5rem;\n  font-size: 0.68rem;\n  font-weight: 1000;\n  text-transform: uppercase;\n}\n.stats-segments,\n.stats-breakdown-list {\n  display: flex;\n  flex-direction: column;\n  gap: 0.56rem;\n}\n.stats-segment-row {\n  border-top: 1px solid rgba(42, 81, 129, 0.1);\n  padding-top: 0.58rem;\n  display: grid;\n  gap: 0.44rem;\n}\n.stats-segment-title {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  color: #173c68;\n}\n.stats-segment-title small {\n  margin-left: auto;\n  color: rgba(29, 55, 88, 0.72);\n  font-weight: 1000;\n}\n.stats-segment-items {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.36rem;\n}\n.stats-mini-row,\n.stats-breakdown-row {\n  position: relative;\n  overflow: hidden;\n  border: 1px solid rgba(42, 81, 129, 0.1);\n  border-radius: 8px;\n  background: #fff;\n}\n.stats-mini-row {\n  min-height: 32px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n  padding: 0.36rem 0.48rem;\n  color: #24466f;\n  font-size: 0.75rem;\n  font-weight: 850;\n}\n.stats-breakdown-row {\n  min-height: 42px;\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.58rem;\n  padding: 0.48rem 0.58rem;\n}\n.stats-breakdown-row span {\n  min-width: 0;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.42rem;\n  color: #24466f;\n  font-size: 0.8rem;\n  font-weight: 900;\n}\n.stats-breakdown-row strong {\n  color: #173c68;\n  font-weight: 1000;\n}\n.stats-breakdown-row i {\n  position: absolute;\n  inset: auto auto 0 0;\n  height: 3px;\n  border-radius: 999px;\n  background: #2f67a8;\n}\n.stats-empty {\n  margin: 0;\n  color: rgba(29, 55, 88, 0.65);\n  font-size: 0.82rem;\n  font-weight: 850;\n}\n.stats-timeline-panel {\n  display: grid;\n  gap: 0.54rem;\n}\n.stats-timeline-readout {\n  min-height: 34px;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  flex-wrap: wrap;\n  color: rgba(27, 55, 88, 0.74);\n  font-size: 0.74rem;\n  font-weight: 850;\n}\n.stats-timeline-readout strong {\n  color: #15375f;\n  font-size: 0.82rem;\n}\n.stats-timeline-readout span,\n.stats-chart-legend span {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.stats-timeline-readout i,\n.stats-chart-legend i {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  background: #2f67a8;\n}\n.stats-timeline-chart {\n  height: 148px;\n  border: 1px solid rgba(42, 81, 129, 0.1);\n  border-radius: 8px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(247, 250, 255, 0.9),\n      rgba(255, 255, 255, 0.98));\n  padding: 0.24rem;\n}\n.stats-timeline-chart svg {\n  width: 100%;\n  height: 100%;\n  display: block;\n  cursor: crosshair;\n  touch-action: none;\n  -webkit-user-select: none;\n  user-select: none;\n  transform: none;\n}\n.stats-timeline-axis,\n.stats-timeline-gridline,\n.stats-timeline-line,\n.stats-timeline-scrub-guide,\n.stats-timeline-scrub-halo,\n.stats-timeline-scrub-knob {\n  pointer-events: none;\n  transform: none;\n  transition: none;\n  vector-effect: non-scaling-stroke;\n}\n.stats-timeline-axis,\n.stats-timeline-gridline {\n  stroke: rgba(42, 81, 129, 0.18);\n  stroke-width: 1;\n}\n.stats-timeline-gridline {\n  stroke-dasharray: 3 4;\n}\n.stats-timeline-line {\n  fill: none;\n  stroke: #2f67a8;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n  stroke-width: 2.5;\n}\n.stats-timeline-hit {\n  fill: transparent;\n  cursor: inherit;\n  outline: none;\n  transform: none;\n  transition: none;\n}\n.stats-timeline-hit:hover,\n.stats-timeline-hit:focus,\n.stats-timeline-hit:focus-visible {\n  stroke-width: 0;\n  transform: none;\n}\n.stats-timeline-scrub-guide {\n  stroke: rgba(23, 60, 104, 0.38);\n  stroke-dasharray: 4 4;\n  stroke-width: 1.4;\n}\n.stats-timeline-scrub-halo {\n  fill: rgba(47, 103, 168, 0.14);\n  stroke: rgba(47, 103, 168, 0.26);\n  stroke-width: 1;\n}\n.stats-timeline-scrub-knob {\n  fill: #ffffff;\n  stroke: #2f67a8;\n  stroke-width: 3;\n  filter: drop-shadow(0 4px 8px rgba(28, 56, 90, 0.24));\n}\n.stats-chart-legend {\n  display: flex;\n  gap: 0.48rem;\n  flex-wrap: wrap;\n  color: rgba(29, 55, 88, 0.72);\n  font-size: 0.72rem;\n  font-weight: 900;\n}\n.stats-donut-card {\n  display: grid;\n  gap: 0.58rem;\n}\n.stats-donut {\n  height: 16px;\n  border-radius: 999px;\n  background: rgba(42, 81, 129, 0.1);\n  overflow: hidden;\n  display: flex;\n}\n.stats-donut span {\n  min-width: 4px;\n  background: #2f67a8;\n}\n.stats-breakdown-compact {\n  gap: 0.42rem;\n}\n.stats-breakdown-compact .stats-breakdown-row {\n  min-height: 36px;\n  padding-block: 0.38rem;\n}\n.is-green .stats-kpi-bar span,\n.stats-breakdown-row.is-green i,\n.stats-kpi-card.is-green .stats-kpi-bar span,\n.stats-segment-bar span,\n.stats-timeline-line.is-green,\n.stats-donut span.is-green,\n.stats-timeline-readout i.is-green,\n.stats-chart-legend .is-green i {\n  background: #2f8f5b;\n  stroke: #2f8f5b;\n}\n.is-gold .stats-kpi-bar span,\n.stats-breakdown-row.is-gold i,\n.stats-kpi-card.is-gold .stats-kpi-bar span,\n.stats-timeline-line.is-gold,\n.stats-donut span.is-gold,\n.stats-timeline-readout i.is-gold,\n.stats-chart-legend .is-gold i {\n  background: #d58a24;\n  stroke: #d58a24;\n}\n.is-purple .stats-kpi-bar span,\n.stats-breakdown-row.is-purple i,\n.stats-kpi-card.is-purple .stats-kpi-bar span,\n.stats-timeline-line.is-purple,\n.stats-donut span.is-purple,\n.stats-timeline-readout i.is-purple,\n.stats-chart-legend .is-purple i {\n  background: #7562b6;\n  stroke: #7562b6;\n}\n.is-red .stats-kpi-bar span,\n.stats-breakdown-row.is-red i,\n.stats-kpi-card.is-red .stats-kpi-bar span,\n.stats-timeline-line.is-red,\n.stats-donut span.is-red,\n.stats-timeline-readout i.is-red,\n.stats-chart-legend .is-red i {\n  background: #c4515f;\n  stroke: #c4515f;\n}\n.is-slate .stats-kpi-bar span,\n.stats-breakdown-row.is-slate i,\n.stats-kpi-card.is-slate .stats-kpi-bar span,\n.stats-timeline-line.is-slate,\n.stats-donut span.is-slate,\n.stats-timeline-readout i.is-slate,\n.stats-chart-legend .is-slate i {\n  background: #5a6b82;\n  stroke: #5a6b82;\n}\n.stats-timeline-line.is-blue,\n.stats-donut span.is-blue,\n.stats-graph-signal.is-blue i,\n.stats-timeline-readout i.is-blue,\n.stats-chart-legend .is-blue i {\n  background: #2f67a8;\n  stroke: #2f67a8;\n}\n.stats-graph-node.is-blue circle {\n  fill: #2f67a8;\n  stroke: #ffffff;\n}\n.stats-graph-community.is-blue circle {\n  fill: rgba(47, 103, 168, 0.18);\n  stroke: #2f67a8;\n}\n.stats-graph-node.is-green circle {\n  fill: #2f8f5b;\n  stroke: #ffffff;\n}\n.stats-graph-community.is-green circle {\n  fill: rgba(47, 143, 91, 0.18);\n  stroke: #2f8f5b;\n}\n.stats-graph-node.is-green,\n.stats-graph-community.is-green {\n  fill: #2f8f5b;\n  stroke: #ffffff;\n}\n.stats-graph-signal.is-green i {\n  background: #2f8f5b;\n}\n.stats-graph-node.is-gold circle {\n  fill: #d58a24;\n  stroke: #ffffff;\n}\n.stats-graph-community.is-gold circle {\n  fill: rgba(213, 138, 36, 0.2);\n  stroke: #d58a24;\n}\n.stats-graph-signal.is-gold i {\n  background: #d58a24;\n}\n.stats-graph-node.is-purple circle {\n  fill: #7562b6;\n  stroke: #ffffff;\n}\n.stats-graph-community.is-purple circle {\n  fill: rgba(117, 98, 182, 0.2);\n  stroke: #7562b6;\n}\n.stats-graph-signal.is-purple i {\n  background: #7562b6;\n}\n.stats-graph-node.is-red circle {\n  fill: #c4515f;\n  stroke: #ffffff;\n}\n.stats-graph-community.is-red circle {\n  fill: rgba(196, 81, 95, 0.2);\n  stroke: #c4515f;\n}\n.stats-graph-signal.is-red i {\n  background: #c4515f;\n}\n.stats-graph-node.is-slate circle {\n  fill: #5a6b82;\n  stroke: #ffffff;\n}\n.stats-graph-community.is-slate circle {\n  fill: rgba(90, 107, 130, 0.18);\n  stroke: #5a6b82;\n}\n.stats-graph-signal.is-slate i {\n  background: #5a6b82;\n}\n.stats-graph-help-content {\n  min-height: 0;\n  max-height: min(680px, 100vh - 8rem);\n  overflow-y: auto;\n  overflow-x: hidden;\n  display: grid;\n  gap: 0.72rem;\n}\n.stats-graph-help-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.56rem;\n}\n.stats-graph-help-grid article,\n.stats-graph-help-actions {\n  min-width: 0;\n  border: 1px solid rgba(42, 81, 129, 0.12);\n  border-radius: 8px;\n  background: #ffffff;\n  padding: 0.68rem;\n  display: grid;\n  gap: 0.28rem;\n}\n.stats-graph-help-grid mat-icon {\n  color: #2f67a8;\n}\n.stats-graph-help-grid strong,\n.stats-graph-help-actions strong {\n  color: #15375f;\n  font-size: 0.82rem;\n}\n.stats-graph-help-grid p,\n.stats-graph-help-actions p {\n  margin: 0;\n  color: rgba(28, 53, 84, 0.72);\n  font-size: 0.76rem;\n  line-height: 1.38;\n  font-weight: 820;\n}\n.stats-graph-help-actions {\n  border-color: rgba(47, 143, 91, 0.2);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(239, 250, 245, 0.94),\n      #ffffff);\n}\n@media (max-width: 760px) {\n  .stats-hero,\n  .stats-grid,\n  .stats-grid-charts,\n  .stats-graph-layout,\n  .stats-graph-bottom {\n    grid-template-columns: 1fr;\n  }\n  .stats-kpi-grid {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n  .stats-graph-metrics,\n  .stats-graph-signals {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n  .stats-panel-wide {\n    grid-row: auto;\n  }\n  .stats-segment-items {\n    grid-template-columns: 1fr;\n  }\n  .stats-graph-help-grid {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=admin-stats-popup.component.css.map */\n'] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminStatsPopupComponent, { className: "AdminStatsPopupComponent", filePath: "app/admin/components/stats-popup/admin-stats-popup.component.ts", lineNumber: 54 });
})();
export {
  AdminStatsPopupComponent
};
//# sourceMappingURL=admin-stats-popup.component-HZAFHWNC.js.map
