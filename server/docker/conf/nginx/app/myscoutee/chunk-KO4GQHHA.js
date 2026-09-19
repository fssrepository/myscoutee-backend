import {
  LazyBgImageDirective
} from "./chunk-5VDIJXBA.js";
import {
  IndicatorComponent
} from "./chunk-53UGBDSO.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-L6HJFJOR.js";
import {
  CommonModule,
  NgClass,
  NgTemplateOutlet
} from "./chunk-SCHUURLR.js";
import {
  AppUtils
} from "./chunk-CYVMX3LD.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewChild,
  __spreadProps,
  __spreadValues,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
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
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuery
} from "./chunk-EV3I3YNV.js";

// src/app/shared/ui/components/core/smart-list/card/single-card/single-card.component.ts
var _c0 = ["fullscreenShell"];
function SingleCardComponent_Conditional_0_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function SingleCardComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2, 1)(2, "article", 4);
    \u0275\u0275template(3, SingleCardComponent_Conditional_0_ng_container_3_Template, 1, 0, "ng-container", 5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    const cardBody_r2 = \u0275\u0275reference(3);
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", ctx_r0.fullscreenCardWidth)("height", ctx_r0.fullscreenCardHeight);
    \u0275\u0275classProp("activities-rates-fullscreen-card-active", ctx_r0.resolvedState() === "active")("activities-rates-fullscreen-card-leaving", ctx_r0.resolvedState() === "leaving");
    \u0275\u0275attribute("data-activity-rate-row-id", ctx_r0.card == null ? null : ctx_r0.card.rowId);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", cardBody_r2);
  }
}
function SingleCardComponent_Conditional_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function SingleCardComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 3);
    \u0275\u0275template(1, SingleCardComponent_Conditional_1_ng_container_1_Template, 1, 0, "ng-container", 5);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    const cardBody_r2 = \u0275\u0275reference(3);
    \u0275\u0275attribute("data-activity-rate-row-id", ctx_r0.card == null ? null : ctx_r0.card.rowId)("data-group-label", ctx_r0.card == null ? null : ctx_r0.card.groupLabel);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", cardBody_r2);
  }
}
function SingleCardComponent_ng_template_2_Conditional_1_Conditional_1_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 15);
    \u0275\u0275listener("click", function SingleCardComponent_ng_template_2_Conditional_1_Conditional_1_For_1_Template_button_click_0_listener($event) {
      const \u0275$index_25_r4 = \u0275\u0275restoreView(_r3).$index;
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.onSlideSelect(\u0275$index_25_r4, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const \u0275$index_25_r4 = ctx.$index;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("active", \u0275$index_25_r4 === ctx_r0.clampedActiveIndex());
  }
}
function SingleCardComponent_ng_template_2_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, SingleCardComponent_ng_template_2_Conditional_1_Conditional_1_For_1_Template, 1, 2, "button", 14, \u0275\u0275componentInstance().trackBySlide, true);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275repeater(ctx_r0.resolvedSlides());
  }
}
function SingleCardComponent_ng_template_2_Conditional_1_Conditional_2_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 17);
  }
  if (rf & 2) {
    const \u0275$index_29_r5 = ctx.$index;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("active", \u0275$index_29_r5 === ctx_r0.clampedActiveIndex());
  }
}
function SingleCardComponent_ng_template_2_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, SingleCardComponent_ng_template_2_Conditional_1_Conditional_2_For_1_Template, 1, 2, "span", 16, \u0275\u0275componentInstance().trackBySlide, true);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275repeater(ctx_r0.resolvedSlides());
  }
}
function SingleCardComponent_ng_template_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275conditionalCreate(1, SingleCardComponent_ng_template_2_Conditional_1_Conditional_1_Template, 2, 0)(2, SingleCardComponent_ng_template_2_Conditional_1_Conditional_2_Template, 2, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.isInteractive() ? 1 : 2);
  }
}
function SingleCardComponent_ng_template_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 9);
    \u0275\u0275element(1, "app-indicator", 18);
    \u0275\u0275elementEnd();
  }
}
function SingleCardComponent_ng_template_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10)(1, "p", 19);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 20);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((tmp_3_0 = ctx_r0.currentSlide()) == null ? null : tmp_3_0.primaryLine);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((tmp_4_0 = ctx_r0.currentSlide()) == null ? null : tmp_4_0.secondaryLine);
  }
}
function SingleCardComponent_ng_template_2_Conditional_5_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 22);
    \u0275\u0275listener("click", function SingleCardComponent_ng_template_2_Conditional_5_For_2_Template_button_click_0_listener($event) {
      const \u0275$index_51_r7 = \u0275\u0275restoreView(_r6).$index;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.onSlideSelect(\u0275$index_51_r7, $event));
    });
    \u0275\u0275elementEnd();
  }
}
function SingleCardComponent_ng_template_2_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11);
    \u0275\u0275repeaterCreate(1, SingleCardComponent_ng_template_2_Conditional_5_For_2_Template, 1, 0, "button", 21, \u0275\u0275componentInstance().trackBySlide, true);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.resolvedSlides());
  }
}
function SingleCardComponent_ng_template_2_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx, " ");
  }
}
function SingleCardComponent_ng_template_2_Conditional_7_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 26);
  }
  if (rf & 2) {
    const contextBadge_r9 = \u0275\u0275nextContext(2);
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("src", ctx_r0.contextBadgeImageUrl(contextBadge_r9), \u0275\u0275sanitizeUrl);
  }
}
function SingleCardComponent_ng_template_2_Conditional_7_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const contextBadge_r9 = \u0275\u0275nextContext(2);
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.contextBadgeLabel(contextBadge_r9));
  }
}
function SingleCardComponent_ng_template_2_Conditional_7_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "em");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const contextBadge_r9 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(contextBadge_r9.counterLabel);
  }
}
function SingleCardComponent_ng_template_2_Conditional_7_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 25);
    \u0275\u0275listener("click", function SingleCardComponent_ng_template_2_Conditional_7_Conditional_0_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r8);
      const contextBadge_r9 = \u0275\u0275nextContext();
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.onContextBadgeClick(contextBadge_r9, $event));
    });
    \u0275\u0275conditionalCreate(1, SingleCardComponent_ng_template_2_Conditional_7_Conditional_0_Conditional_1_Template, 1, 1, "img", 26)(2, SingleCardComponent_ng_template_2_Conditional_7_Conditional_0_Conditional_2_Template, 2, 1, "span");
    \u0275\u0275conditionalCreate(3, SingleCardComponent_ng_template_2_Conditional_7_Conditional_0_Conditional_3_Template, 2, 1, "em");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const contextBadge_r9 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("aria-label", contextBadge_r9.ariaLabel || contextBadge_r9.title || "View related profile")("title", contextBadge_r9.title || contextBadge_r9.ariaLabel || null);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.contextBadgeImageUrl(contextBadge_r9) ? 1 : 2);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(contextBadge_r9.counterLabel ? 3 : -1);
  }
}
function SingleCardComponent_ng_template_2_Conditional_7_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 26);
  }
  if (rf & 2) {
    const contextBadge_r9 = \u0275\u0275nextContext(2);
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("src", ctx_r0.contextBadgeImageUrl(contextBadge_r9), \u0275\u0275sanitizeUrl);
  }
}
function SingleCardComponent_ng_template_2_Conditional_7_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const contextBadge_r9 = \u0275\u0275nextContext(2);
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.contextBadgeLabel(contextBadge_r9));
  }
}
function SingleCardComponent_ng_template_2_Conditional_7_Conditional_1_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "em");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const contextBadge_r9 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(contextBadge_r9.counterLabel);
  }
}
function SingleCardComponent_ng_template_2_Conditional_7_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 24);
    \u0275\u0275conditionalCreate(1, SingleCardComponent_ng_template_2_Conditional_7_Conditional_1_Conditional_1_Template, 1, 1, "img", 26)(2, SingleCardComponent_ng_template_2_Conditional_7_Conditional_1_Conditional_2_Template, 2, 1, "span");
    \u0275\u0275conditionalCreate(3, SingleCardComponent_ng_template_2_Conditional_7_Conditional_1_Conditional_3_Template, 2, 1, "em");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const contextBadge_r9 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("aria-label", contextBadge_r9.ariaLabel || contextBadge_r9.title || "Related profile")("title", contextBadge_r9.title || contextBadge_r9.ariaLabel || null);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.contextBadgeImageUrl(contextBadge_r9) ? 1 : 2);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(contextBadge_r9.counterLabel ? 3 : -1);
  }
}
function SingleCardComponent_ng_template_2_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, SingleCardComponent_ng_template_2_Conditional_7_Conditional_0_Template, 4, 4, "button", 23)(1, SingleCardComponent_ng_template_2_Conditional_7_Conditional_1_Template, 4, 4, "span", 24);
  }
  if (rf & 2) {
    \u0275\u0275conditional(ctx.profileView ? 0 : 1);
  }
}
function SingleCardComponent_ng_template_2_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 27);
    \u0275\u0275listener("click", function SingleCardComponent_ng_template_2_Conditional_8_Template_button_click_0_listener($event) {
      const profileView_r11 = \u0275\u0275restoreView(_r10);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.onProfileClick(profileView_r11, $event));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "visibility");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275attribute("aria-label", "View " + (ctx.label || "profile"));
  }
}
function SingleCardComponent_ng_template_2_Conditional_9_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 30);
    \u0275\u0275listener("pointerdown", function SingleCardComponent_ng_template_2_Conditional_9_Conditional_0_Template_button_pointerdown_0_listener($event) {
      \u0275\u0275restoreView(_r12);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.onBadgePointerDown($event));
    })("mousedown", function SingleCardComponent_ng_template_2_Conditional_9_Conditional_0_Template_button_mousedown_0_listener($event) {
      \u0275\u0275restoreView(_r12);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.onBadgePointerDown($event));
    })("touchstart", function SingleCardComponent_ng_template_2_Conditional_9_Conditional_0_Template_button_touchstart_0_listener($event) {
      \u0275\u0275restoreView(_r12);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.onBadgePointerDown($event));
    })("click", function SingleCardComponent_ng_template_2_Conditional_9_Conditional_0_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r12);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.onBadgeClick($event));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "star");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const cardBadge_r13 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("activities-rate-score-badge-floating", ctx_r0.usesFloatingBadge())("activities-rate-score-badge-between", ctx_r0.usesBetweenBadge())("activities-rate-score-badge-floating-pair-overlap", ctx_r0.usesPairOverlapBadge())("is-active", cardBadge_r13.active || ctx_r0.badgeMenuOpen)("is-pending", cardBadge_r13.pending)("is-disabled", cardBadge_r13.disabled)("is-blink", ctx_r0.isBadgeBlinking());
    \u0275\u0275property("disabled", cardBadge_r13.disabled);
    \u0275\u0275attribute("aria-label", cardBadge_r13.ariaLabel);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(cardBadge_r13.label);
  }
}
function SingleCardComponent_ng_template_2_Conditional_9_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 31)(1, "mat-icon");
    \u0275\u0275text(2, "star");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const cardBadge_r13 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("activities-rate-score-badge-floating", ctx_r0.usesFloatingBadge())("activities-rate-score-badge-between", ctx_r0.usesBetweenBadge())("activities-rate-score-badge-floating-pair-overlap", ctx_r0.usesPairOverlapBadge())("is-active", cardBadge_r13.active)("is-pending", cardBadge_r13.pending)("is-disabled", cardBadge_r13.disabled)("is-blink", ctx_r0.isBadgeBlinking());
    \u0275\u0275attribute("aria-label", cardBadge_r13.ariaLabel);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(cardBadge_r13.label);
  }
}
function SingleCardComponent_ng_template_2_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, SingleCardComponent_ng_template_2_Conditional_9_Conditional_0_Template, 5, 17, "button", 28)(1, SingleCardComponent_ng_template_2_Conditional_9_Conditional_1_Template, 5, 16, "span", 29);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(ctx_r0.isBadgeInteractive() ? 0 : 1);
  }
}
function SingleCardComponent_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275conditionalCreate(1, SingleCardComponent_ng_template_2_Conditional_1_Template, 3, 1, "div", 7);
    \u0275\u0275elementStart(2, "div", 8);
    \u0275\u0275conditionalCreate(3, SingleCardComponent_ng_template_2_Conditional_3_Template, 2, 0, "span", 9);
    \u0275\u0275conditionalCreate(4, SingleCardComponent_ng_template_2_Conditional_4_Template, 5, 2, "div", 10);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, SingleCardComponent_ng_template_2_Conditional_5_Template, 3, 0, "div", 11);
    \u0275\u0275conditionalCreate(6, SingleCardComponent_ng_template_2_Conditional_6_Template, 2, 1, "span", 12);
    \u0275\u0275conditionalCreate(7, SingleCardComponent_ng_template_2_Conditional_7_Template, 2, 1);
    \u0275\u0275conditionalCreate(8, SingleCardComponent_ng_template_2_Conditional_8_Template, 3, 1, "button", 13);
    \u0275\u0275conditionalCreate(9, SingleCardComponent_ng_template_2_Conditional_9_Template, 2, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_11_0;
    let tmp_12_0;
    let tmp_13_0;
    let tmp_14_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classProp("is-pane-loading", ctx_r0.loading)("has-card-score-badge", !!(ctx_r0.card == null ? null : ctx_r0.card.badge))("has-card-context-badge", !!(ctx_r0.card == null ? null : ctx_r0.card.contextBadge));
    \u0275\u0275property("ngClass", ctx_r0.resolvedStackClasses());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.resolvedSlides().length > 1 ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("appLazyBgImage", ctx_r0.currentSlideImageUrl());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.currentSlideImageUrl() ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.hasOverlay(ctx_r0.currentSlide()) ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.isInteractive() && ctx_r0.resolvedSlides().length > 1 ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_11_0 = ctx_r0.card == null ? null : ctx_r0.card.statusBadgeLabel) ? 6 : -1, tmp_11_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_12_0 = ctx_r0.card == null ? null : ctx_r0.card.contextBadge) ? 7 : -1, tmp_12_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_13_0 = ctx_r0.card == null ? null : ctx_r0.card.profileView) ? 8 : -1, tmp_13_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_14_0 = ctx_r0.card == null ? null : ctx_r0.card.badge) ? 9 : -1, tmp_14_0);
  }
}
var SingleCardComponent = class _SingleCardComponent {
  static IMAGE_PULSE_DURATION_MS = 500;
  static BADGE_BLINK_DURATION_MS = 420;
  static MOBILE_VIEWPORT_MAX_WIDTH_PX = 760;
  static MOBILE_FULLSCREEN_ASPECT_RATIO = 9 / 16;
  static DESKTOP_FULLSCREEN_ASPECT_RATIO = 3 / 4;
  static activeIndexByRowId = {};
  cdr = inject(ChangeDetectorRef);
  loadingTimer = null;
  badgeBlinkTimer = null;
  fullscreenResizeObserver = null;
  previousRowId = "";
  previousBadgeLabel = "";
  fullscreenShellElementRef;
  card = null;
  badgeClick = new EventEmitter();
  menuRequest = new EventEmitter();
  detailClick = new EventEmitter();
  activeIndex = 0;
  loading = false;
  transientBadgeBlink = false;
  badgeMenuOpen = false;
  fullscreenCardWidth = null;
  fullscreenCardHeight = null;
  set fullscreenShellRef(value) {
    this.fullscreenShellElementRef = value;
    this.bindFullscreenObserver();
    this.scheduleFullscreenLayoutSync();
  }
  get hostPresentationAttr() {
    return this.resolvedPresentation();
  }
  get hostHeight() {
    return this.resolvedPresentation() === "fullscreen" ? "100%" : null;
  }
  ngAfterViewInit() {
    this.bindFullscreenObserver();
    this.scheduleFullscreenLayoutSync();
  }
  ngOnChanges(changes) {
    if (!changes["card"]) {
      return;
    }
    const rowId = this.card?.rowId ?? "";
    const badgeLabel = this.card?.badge?.label ?? "";
    if (rowId !== this.previousRowId) {
      this.syncStateFromCard();
    }
    if (rowId === this.previousRowId && badgeLabel !== this.previousBadgeLabel && this.card?.badge?.blink !== true) {
      this.startTransientBadgeBlink();
    }
    this.previousRowId = rowId;
    this.previousBadgeLabel = badgeLabel;
    this.scheduleFullscreenLayoutSync();
  }
  ngOnDestroy() {
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer);
      this.loadingTimer = null;
    }
    if (this.badgeBlinkTimer) {
      clearTimeout(this.badgeBlinkTimer);
      this.badgeBlinkTimer = null;
    }
    this.disconnectFullscreenObserver();
  }
  trackBySlide(index, slide) {
    return `${index}:${slide.imageUrl}`;
  }
  resolvedPresentation() {
    return this.card?.presentation ?? "list";
  }
  resolvedState() {
    return this.card?.state ?? "default";
  }
  resolvedSlides() {
    return this.card?.slides ?? [];
  }
  resolvedStackClasses() {
    return this.card?.stackClasses ?? [];
  }
  contextBadgeLabel(badge) {
    return badge.label.trim().slice(0, 3).toUpperCase();
  }
  currentSlide() {
    const slides = this.resolvedSlides();
    if (slides.length === 0) {
      return null;
    }
    return slides[this.clampedActiveIndex()] ?? slides[0] ?? null;
  }
  currentSlideImageUrl() {
    return AppUtils.mediaImageVariantUrl(this.currentSlide()?.imageUrl, this.resolvedPresentation() === "fullscreen" ? "large" : "medium");
  }
  contextBadgeImageUrl(badge) {
    return AppUtils.mediaImageVariantUrl(badge.imageUrl, "small");
  }
  clampedActiveIndex() {
    const slides = this.resolvedSlides();
    if (slides.length <= 1) {
      return 0;
    }
    return Math.max(0, Math.min(this.activeIndex, slides.length - 1));
  }
  hasOverlay(slide) {
    return !!slide?.primaryLine && !!slide?.secondaryLine;
  }
  isInteractive() {
    return this.resolvedPresentation() === "list" || this.resolvedState() === "active";
  }
  isBadgeInteractive() {
    return this.card?.badge?.interactive !== false;
  }
  usesFloatingBadge() {
    const layout = this.card?.badge?.layout ?? "floating";
    return layout === "floating" || layout === "pair-overlap";
  }
  usesBetweenBadge() {
    const layout = this.card?.badge?.layout ?? "floating";
    return layout === "between" || layout === "pair-overlap";
  }
  usesPairOverlapBadge() {
    return (this.card?.badge?.layout ?? "floating") === "pair-overlap";
  }
  isBadgeBlinking() {
    return !!this.card?.badge?.blink || this.transientBadgeBlink;
  }
  onSlideSelect(index, event) {
    event.stopPropagation();
    if (!this.isInteractive()) {
      return;
    }
    this.activeIndex = this.clampIndex(index);
    if (this.card?.rowId) {
      _SingleCardComponent.activeIndexByRowId[this.card.rowId] = this.activeIndex;
    }
    this.startLoadingPulse();
  }
  onBadgePointerDown(event) {
    event.stopPropagation();
  }
  onBadgeClick(event) {
    event.preventDefault();
    event.stopPropagation();
    const card = this.card;
    const badge = card?.badge;
    if (!this.isBadgeInteractive() || badge?.disabled || !card?.rowId || !badge) {
      return;
    }
    if (badge.menuRequest === true) {
      const trigger = event.currentTarget;
      this.badgeMenuOpen = true;
      this.cdr.markForCheck();
      this.menuRequest.emit({
        id: card.rowId,
        card,
        actions: [],
        badge,
        triggerRect: this.resolveBadgeTriggerRect(trigger),
        openUp: this.shouldOpenBadgeMenuUp(trigger),
        closeTrigger: () => this.closeBadgeMenu()
      });
      return;
    }
    this.badgeClick.emit(card.rowId);
  }
  onProfileClick(profileView, event) {
    event.stopPropagation();
    const userId = `${profileView?.userId ?? ""}`.trim();
    if (!userId) {
      return;
    }
    this.emitDetailClick(__spreadProps(__spreadValues({}, profileView), {
      userId
    }));
  }
  onContextBadgeClick(badge, event) {
    event.stopPropagation();
    const profileView = badge.profileView;
    const userId = `${profileView?.userId ?? ""}`.trim();
    if (!profileView || !userId) {
      return;
    }
    this.emitDetailClick(__spreadProps(__spreadValues({}, profileView), {
      userId
    }));
  }
  emitDetailClick(event) {
    this.detailClick.emit(event);
  }
  syncStateFromCard() {
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer);
      this.loadingTimer = null;
    }
    if (this.badgeBlinkTimer) {
      clearTimeout(this.badgeBlinkTimer);
      this.badgeBlinkTimer = null;
    }
    const rowId = this.card?.rowId ?? "";
    const storedIndex = rowId ? _SingleCardComponent.activeIndexByRowId[rowId] : void 0;
    const initialIndex = storedIndex ?? this.card?.initialActiveIndex ?? 0;
    this.activeIndex = this.clampIndex(initialIndex);
    this.loading = false;
    this.transientBadgeBlink = false;
    this.badgeMenuOpen = false;
    this.cdr.markForCheck();
  }
  closeBadgeMenu() {
    if (!this.badgeMenuOpen) {
      return;
    }
    this.badgeMenuOpen = false;
    this.cdr.markForCheck();
  }
  shouldOpenBadgeMenuUp(trigger) {
    if (typeof window === "undefined" || !trigger) {
      return false;
    }
    const rect = trigger.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const estimatedMenuHeight = 128;
    return viewportHeight - rect.bottom < estimatedMenuHeight && rect.top > viewportHeight - rect.bottom;
  }
  resolveBadgeTriggerRect(trigger) {
    if (typeof window === "undefined" || !trigger) {
      return null;
    }
    const rect = trigger.getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height
    };
  }
  clampIndex(index) {
    const slides = this.resolvedSlides();
    if (slides.length <= 1) {
      return 0;
    }
    return Math.max(0, Math.min(index, slides.length - 1));
  }
  startLoadingPulse() {
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer);
      this.loadingTimer = null;
    }
    this.loading = true;
    this.cdr.markForCheck();
    this.loadingTimer = setTimeout(() => {
      this.loading = false;
      this.loadingTimer = null;
      this.cdr.markForCheck();
    }, _SingleCardComponent.IMAGE_PULSE_DURATION_MS);
  }
  startTransientBadgeBlink() {
    if (this.badgeBlinkTimer) {
      clearTimeout(this.badgeBlinkTimer);
      this.badgeBlinkTimer = null;
    }
    this.transientBadgeBlink = false;
    this.cdr.detectChanges();
    const startBlink = () => {
      this.transientBadgeBlink = true;
      this.cdr.detectChanges();
      this.badgeBlinkTimer = setTimeout(() => {
        this.badgeBlinkTimer = null;
        this.transientBadgeBlink = false;
        this.cdr.detectChanges();
      }, _SingleCardComponent.BADGE_BLINK_DURATION_MS);
    };
    if (typeof globalThis.requestAnimationFrame === "function") {
      globalThis.requestAnimationFrame(() => startBlink());
      return;
    }
    setTimeout(() => startBlink(), 0);
  }
  bindFullscreenObserver() {
    if (typeof ResizeObserver === "undefined") {
      return;
    }
    const shell = this.fullscreenShellElementRef?.nativeElement;
    if (!shell) {
      this.disconnectFullscreenObserver();
      return;
    }
    if (!this.fullscreenResizeObserver) {
      this.fullscreenResizeObserver = new ResizeObserver(() => this.updateFullscreenCardSize());
    }
    this.fullscreenResizeObserver.disconnect();
    this.fullscreenResizeObserver.observe(shell);
  }
  disconnectFullscreenObserver() {
    if (!this.fullscreenResizeObserver) {
      return;
    }
    this.fullscreenResizeObserver.disconnect();
    this.fullscreenResizeObserver = null;
  }
  scheduleFullscreenLayoutSync() {
    if (this.resolvedPresentation() !== "fullscreen") {
      this.setFullscreenCardSize(null, null);
      return;
    }
    const sync = () => this.updateFullscreenCardSize();
    if (typeof globalThis.requestAnimationFrame === "function") {
      globalThis.requestAnimationFrame(() => sync());
      return;
    }
    setTimeout(sync, 0);
  }
  updateFullscreenCardSize() {
    if (this.resolvedPresentation() !== "fullscreen") {
      this.setFullscreenCardSize(null, null);
      return;
    }
    const shell = this.fullscreenShellElementRef?.nativeElement;
    if (!shell) {
      return;
    }
    const availableWidth = shell.clientWidth;
    const availableHeight = shell.clientHeight;
    if (availableWidth <= 0 || availableHeight <= 0) {
      return;
    }
    if (this.isCompactViewport()) {
      const nextWidth2 = availableWidth;
      const nextHeight2 = nextWidth2 / _SingleCardComponent.MOBILE_FULLSCREEN_ASPECT_RATIO;
      this.setFullscreenCardSize(`${nextWidth2}px`, `${nextHeight2}px`);
      return;
    }
    const nextWidth = Math.min(availableWidth, availableHeight * _SingleCardComponent.DESKTOP_FULLSCREEN_ASPECT_RATIO);
    const nextHeight = nextWidth / _SingleCardComponent.DESKTOP_FULLSCREEN_ASPECT_RATIO;
    this.setFullscreenCardSize(`${nextWidth}px`, `${nextHeight}px`);
  }
  isCompactViewport() {
    return typeof globalThis.innerWidth === "number" && globalThis.innerWidth <= _SingleCardComponent.MOBILE_VIEWPORT_MAX_WIDTH_PX;
  }
  setFullscreenCardSize(width, height) {
    if (this.fullscreenCardWidth === width && this.fullscreenCardHeight === height) {
      return;
    }
    this.fullscreenCardWidth = width;
    this.fullscreenCardHeight = height;
    this.cdr.markForCheck();
  }
  static \u0275fac = function SingleCardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SingleCardComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SingleCardComponent, selectors: [["app-single-card"]], viewQuery: function SingleCardComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5, ElementRef);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.fullscreenShellRef = _t.first);
    }
  }, hostVars: 3, hostBindings: function SingleCardComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275attribute("data-card-presentation", ctx.hostPresentationAttr);
      \u0275\u0275styleProp("height", ctx.hostHeight);
    }
  }, inputs: { card: "card" }, outputs: { badgeClick: "badgeClick", menuRequest: "menuRequest", detailClick: "detailClick" }, features: [\u0275\u0275NgOnChangesFeature], decls: 4, vars: 1, consts: [["cardBody", ""], ["fullscreenShell", ""], [1, "activities-rates-fullscreen"], [1, "activities-rate-profile-card", "activities-row-item"], [1, "activities-rate-profile-card", "activities-row-item", "activities-rates-fullscreen-card"], [4, "ngTemplateOutlet"], [1, "activities-rate-profile-stack", 3, "ngClass"], [1, "image-stack-indicators", "activities-rate-profile-indicators"], [1, "activities-rate-profile-layer", "activities-rate-profile-layer-active", 3, "appLazyBgImage"], ["aria-hidden", "true", 1, "activities-rate-image-loader"], [1, "activities-rate-profile-overlay"], [1, "image-stack-hit-area", "activities-rate-profile-hit-area"], [1, "shared-card-status-badge"], ["type", "button", 1, "shared-card-profile-view-btn"], ["type", "button", "aria-label", "Select profile image", 1, "image-stack-line", 3, "active"], ["type", "button", "aria-label", "Select profile image", 1, "image-stack-line", 3, "click"], [1, "image-stack-line", 3, "active"], [1, "image-stack-line"], ["kind", "spinner-ring"], [1, "activities-rate-profile-line", "activities-rate-profile-line-primary"], [1, "activities-rate-profile-line", "activities-rate-profile-line-secondary"], ["type", "button", "aria-label", "Select profile image", 1, "image-stack-hit-segment"], ["type", "button", "aria-label", "Select profile image", 1, "image-stack-hit-segment", 3, "click"], ["type", "button", 1, "shared-card-context-avatar-badge"], [1, "shared-card-context-avatar-badge"], ["type", "button", 1, "shared-card-context-avatar-badge", 3, "click"], ["alt", "", 3, "src"], ["type", "button", 1, "shared-card-profile-view-btn", 3, "click"], ["type", "button", 1, "activities-rate-score-badge", 3, "activities-rate-score-badge-floating", "activities-rate-score-badge-between", "activities-rate-score-badge-floating-pair-overlap", "is-active", "is-pending", "is-disabled", "is-blink", "disabled"], [1, "activities-rate-score-badge", 3, "activities-rate-score-badge-floating", "activities-rate-score-badge-between", "activities-rate-score-badge-floating-pair-overlap", "is-active", "is-pending", "is-disabled", "is-blink"], ["type", "button", 1, "activities-rate-score-badge", 3, "pointerdown", "mousedown", "touchstart", "click", "disabled"], [1, "activities-rate-score-badge"]], template: function SingleCardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, SingleCardComponent_Conditional_0_Template, 4, 10, "div", 2)(1, SingleCardComponent_Conditional_1_Template, 2, 3, "article", 3);
      \u0275\u0275template(2, SingleCardComponent_ng_template_2_Template, 10, 16, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.resolvedPresentation() === "fullscreen" ? 0 : 1);
    }
  }, dependencies: [CommonModule, NgClass, NgTemplateOutlet, MatIconModule, MatIcon, LazyBgImageDirective, IndicatorComponent], styles: ['\n[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n  min-height: 0;\n}\n[data-card-presentation=fullscreen][_nghost-%COMP%] {\n  height: 100%;\n}\n.activities-rate-profile-card[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  min-height: 264px;\n  border: 1px solid rgba(34, 54, 84, 0.24);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      #1b2c45 0%,\n      #132238 100%);\n  overflow: hidden;\n  box-sizing: border-box;\n  touch-action: pan-y;\n}\n.activities-rate-profile-card.activities-row-item[_ngcontent-%COMP%] {\n  cursor: default;\n  transform: none;\n  transition: none;\n  animation: none;\n  -webkit-tap-highlight-color: transparent;\n}\n.activities-rate-profile-card.activities-row-item[_ngcontent-%COMP%]:hover, \n.activities-rate-profile-card.activities-row-item[_ngcontent-%COMP%]:active {\n  transform: none;\n  filter: none;\n}\n.activities-rate-profile-stack[_ngcontent-%COMP%] {\n  position: relative;\n  min-height: 264px;\n  height: 100%;\n}\n.activities-rate-profile-stack.activities-rate-profile-stack-pair-inline[_ngcontent-%COMP%] {\n  min-height: 264px;\n}\n.activities-rate-profile-stack.activities-rate-profile-stack-pair-fullscreen[_ngcontent-%COMP%] {\n  min-height: 100%;\n  height: 100%;\n}\n.activities-rate-pair-inline-grid[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: clamp(0.28rem, 0.8vw, 0.52rem);\n  padding: 0.42rem;\n}\n.activities-rate-pair-inline-grid[_ngcontent-%COMP%]:not(.activities-rate-pair-fullscreen-grid) {\n  gap: clamp(0.08rem, 0.32vw, 0.16rem);\n}\n.activities-rate-pair-inline-card[_ngcontent-%COMP%] {\n  position: relative;\n  min-width: 0;\n  border-radius: 12px;\n  overflow: hidden;\n  border: 1px solid rgba(255, 255, 255, 0.28);\n  box-shadow: 0 10px 22px rgba(6, 18, 36, 0.3);\n}\n.activities-rate-pair-inline-layer[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  min-height: 0;\n  background-size: var(--rate-card-image-fit, cover);\n  background-position: center;\n  background-repeat: no-repeat;\n}\n.activities-rate-image-loader[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  z-index: 2;\n  display: grid;\n  place-items: center;\n  pointer-events: none;\n  opacity: 0;\n  transition: opacity 120ms ease;\n}\n.activities-rate-image-loader[_ngcontent-%COMP%]   app-indicator[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n}\n.activities-rate-pair-inline-layer.lazy-bg-loading[_ngcontent-%COMP%]   .activities-rate-image-loader[_ngcontent-%COMP%], \n.activities-rate-profile-layer.lazy-bg-loading[_ngcontent-%COMP%]   .activities-rate-image-loader[_ngcontent-%COMP%] {\n  opacity: 1;\n}\n.activities-rate-pair-inline-layer.lazy-bg-loaded[_ngcontent-%COMP%]   .activities-rate-image-loader[_ngcontent-%COMP%], \n.activities-rate-profile-layer.lazy-bg-loaded[_ngcontent-%COMP%]   .activities-rate-image-loader[_ngcontent-%COMP%], \n.activities-rate-pair-inline-layer.lazy-bg-error[_ngcontent-%COMP%]   .activities-rate-image-loader[_ngcontent-%COMP%], \n.activities-rate-profile-layer.lazy-bg-error[_ngcontent-%COMP%]   .activities-rate-image-loader[_ngcontent-%COMP%] {\n  opacity: 0;\n}\n.activities-rate-pair-inline-layer[_ngcontent-%COMP%]::after, \n.activities-rate-profile-layer[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  z-index: 0;\n  pointer-events: none;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(12, 22, 36, 0.04) 0%,\n      rgba(7, 16, 28, 0.62) 66%,\n      rgba(7, 16, 28, 0.84) 100%);\n}\n.activities-rate-pair-inline-layer[_ngcontent-%COMP%]   .card-image-placeholder[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 4;\n}\n.activities-rate-pair-inline-card.is-pane-loading[_ngcontent-%COMP%]   .activities-rate-profile-indicators[_ngcontent-%COMP%]   .image-stack-line.active[_ngcontent-%COMP%], \n.activities-rate-profile-stack.is-pane-loading[_ngcontent-%COMP%]   .activities-rate-profile-indicators[_ngcontent-%COMP%]   .image-stack-line.active[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_activities-rate-pane-loading-pulse 500ms ease;\n}\n@keyframes _ngcontent-%COMP%_activities-rate-pane-loading-pulse {\n  0% {\n    transform: scaleX(0.84);\n    opacity: 0.58;\n  }\n  100% {\n    transform: scaleX(1);\n    opacity: 1;\n  }\n}\n.activities-rate-pair-inline-label[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.64rem;\n  left: 0.52rem;\n  z-index: 5;\n  border-radius: 999px;\n  border: 1px solid rgba(212, 229, 249, 0.42);\n  color: #f5f9ff;\n  font-size: 0.66rem;\n  font-weight: 700;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.16rem 0.42rem;\n  background: rgba(8, 18, 35, 0.62);\n}\n.activities-rate-pair-inline-card-woman[_ngcontent-%COMP%]   .activities-rate-pair-inline-label[_ngcontent-%COMP%] {\n  background: rgba(109, 42, 118, 0.64);\n}\n.activities-rate-pair-inline-card-man[_ngcontent-%COMP%]   .activities-rate-pair-inline-label[_ngcontent-%COMP%] {\n  background: rgba(36, 74, 127, 0.66);\n}\n.shared-card-status-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.64rem;\n  right: 0.56rem;\n  z-index: 80;\n  max-width: calc(100% - 1.24rem);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  border-radius: 999px;\n  border: 1px solid rgba(148, 225, 182, 0.56);\n  background: rgba(8, 34, 18, 0.74);\n  color: #e9ffef;\n  font-size: 0.68rem;\n  font-weight: 700;\n  letter-spacing: 0.01em;\n  line-height: 1;\n  padding: 0.17rem 0.5rem;\n  pointer-events: none;\n}\n.shared-card-context-avatar-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.68rem;\n  left: 0.62rem;\n  z-index: 30;\n  width: 2.08rem;\n  height: 2.08rem;\n  display: inline-grid;\n  place-items: center;\n  border: 2px solid rgba(255, 255, 255, 0.84);\n  border-radius: 999px;\n  background: rgba(8, 18, 35, 0.74);\n  color: #f7fbff;\n  box-shadow: 0 7px 16px rgba(4, 12, 26, 0.36), inset 0 0 0 1px rgba(15, 35, 58, 0.26);\n  overflow: visible;\n  pointer-events: auto;\n  touch-action: manipulation;\n}\nbutton.shared-card-context-avatar-badge[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n.shared-card-context-avatar-badge[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  border-radius: inherit;\n}\n.shared-card-context-avatar-badge[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  font-size: 0.68rem;\n  font-weight: 900;\n  line-height: 1;\n}\n.shared-card-context-avatar-badge[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -0.74rem;\n  right: -0.72rem;\n  z-index: 2;\n  min-width: 1rem;\n  height: 1rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border: 1px solid rgba(255, 255, 255, 0.88);\n  border-radius: 999px;\n  background: #d94c4c;\n  color: #fff;\n  font-size: 0.54rem;\n  font-style: normal;\n  font-weight: 900;\n  line-height: 1;\n  padding: 0 0.16rem;\n  box-shadow: 0 4px 10px rgba(77, 12, 24, 0.32);\n}\n.activities-rate-pair-inline-overlay[_ngcontent-%COMP%], \n.activities-rate-profile-overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 3;\n  display: grid;\n  gap: 0.14rem;\n}\n.activities-rate-pair-inline-overlay[_ngcontent-%COMP%] {\n  padding: 0.7rem 0.72rem 0.68rem;\n}\n.activities-rate-pair-inline-card[_ngcontent-%COMP%]   .activities-rate-profile-indicators.activities-rate-pair-inline-indicators[_ngcontent-%COMP%] {\n  top: 0.28rem;\n  left: 0.34rem;\n  right: 0.34rem;\n  padding: 0.12rem 0.24rem;\n  border-radius: 7px;\n}\n.activities-rate-pair-inline-hit-area[_ngcontent-%COMP%] {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 4;\n}\n.activities-rate-profile-layer[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  z-index: 1;\n  border-radius: 14px;\n  overflow: hidden;\n  background-size: var(--rate-card-image-fit, cover);\n  background-position: center;\n  background-repeat: no-repeat;\n  border: 1px solid rgba(255, 255, 255, 0.26);\n  box-shadow: 0 12px 24px rgba(6, 18, 36, 0.34);\n}\n[data-card-presentation=list][_nghost-%COMP%]   .activities-rate-pair-inline-layer[_ngcontent-%COMP%], \n[data-card-presentation=list][_nghost-%COMP%]   .activities-rate-profile-layer[_ngcontent-%COMP%] {\n  background-size: contain;\n}\n.activities-rate-profile-layer-active[_ngcontent-%COMP%] {\n  pointer-events: none;\n}\n.activities-rate-profile-indicators[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.36rem;\n  left: 0.52rem;\n  right: 0.52rem;\n  z-index: 10;\n  padding: 0.16rem 0.34rem;\n  border-radius: 8px;\n  background: rgba(10, 18, 31, 0.38);\n  gap: 5px;\n}\n.activities-rate-profile-indicators[_ngcontent-%COMP%]   .image-stack-line[_ngcontent-%COMP%] {\n  height: 4px;\n  border: 1px solid rgba(28, 42, 64, 0.36);\n  background: rgba(167, 177, 192, 0.9);\n  opacity: 1;\n}\n.activities-rate-profile-indicators[_ngcontent-%COMP%]   .image-stack-line.active[_ngcontent-%COMP%] {\n  border-color: rgba(248, 252, 255, 0.86);\n  background: rgba(250, 252, 255, 0.98);\n  box-shadow: 0 0 0 1px rgba(10, 20, 34, 0.12);\n}\n.activities-rate-profile-hit-area[_ngcontent-%COMP%] {\n  top: 0.2rem;\n  left: 0.2rem;\n  right: 0.2rem;\n  bottom: 0.2rem;\n  z-index: 4;\n}\n.shared-card-profile-view-btn[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 0.56rem;\n  bottom: 0.56rem;\n  z-index: 18;\n  width: 2.22rem;\n  height: 2.22rem;\n  border: 1px solid rgba(41, 99, 143, 0.28);\n  border-radius: 999px;\n  background: rgba(232, 246, 251, 0.94);\n  color: #226d83;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  box-shadow: 0 8px 18px rgba(6, 24, 44, 0.2);\n  cursor: pointer;\n  pointer-events: auto;\n  transition:\n    background 0.16s ease,\n    border-color 0.16s ease,\n    transform 0.16s ease;\n  -webkit-tap-highlight-color: transparent;\n}\n.shared-card-profile-view-btn[_ngcontent-%COMP%]:hover, \n.shared-card-profile-view-btn[_ngcontent-%COMP%]:focus-visible {\n  background: rgba(218, 241, 249, 0.98);\n  border-color: rgba(31, 124, 153, 0.44);\n  transform: translateY(-1px);\n  outline: none;\n}\n.shared-card-profile-view-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 1.34rem;\n  height: 1.34rem;\n  font-size: 1.34rem;\n  line-height: 1.34rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.activities-rate-pair-inline-card[_ngcontent-%COMP%]   .shared-card-profile-view-btn[_ngcontent-%COMP%] {\n  right: 0.44rem;\n  bottom: 0.44rem;\n  width: 2rem;\n  height: 2rem;\n}\n.activities-rate-profile-overlay[_ngcontent-%COMP%] {\n  padding: 0.74rem 0.8rem 0.72rem;\n}\n.activities-rate-profile-line[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #f5f9ff !important;\n  text-shadow: 0 2px 9px rgba(2, 8, 16, 0.96);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.activities-rate-profile-line-primary[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  font-weight: 800;\n}\n.activities-rate-profile-line-secondary[_ngcontent-%COMP%] {\n  font-size: 0.76rem;\n  font-weight: 700;\n  color: rgba(237, 245, 255, 0.98) !important;\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-given[_ngcontent-%COMP%]   .activities-rate-profile-layer[_ngcontent-%COMP%] {\n  border-color: rgba(63, 136, 208, 0.52);\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-received[_ngcontent-%COMP%]   .activities-rate-profile-layer[_ngcontent-%COMP%] {\n  border-color: rgba(53, 160, 114, 0.52);\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-mutual[_ngcontent-%COMP%]   .activities-rate-profile-layer[_ngcontent-%COMP%] {\n  border-color: rgba(176, 121, 48, 0.52);\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-met[_ngcontent-%COMP%]   .activities-rate-profile-layer[_ngcontent-%COMP%] {\n  border-color: rgba(104, 118, 139, 0.52);\n}\n.activities-rate-score-badge[_ngcontent-%COMP%] {\n  min-height: 26px;\n  border: 2px solid rgba(187, 136, 22, 0.58);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #fff9e9 0%,\n      #fff1cb 100%);\n  color: #9f6915;\n  font-size: 0.76rem;\n  font-weight: 800;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n  padding: 0.16rem 0.56rem;\n  cursor: pointer;\n  transform: translateY(0) scale(1);\n  box-shadow: inset 0 0 0 1px rgba(255, 245, 215, 0.72), 0 0 0 rgba(226, 171, 47, 0);\n  transition:\n    transform 0.16s ease,\n    box-shadow 0.2s ease,\n    border-color 0.2s ease,\n    filter 0.2s ease;\n}\n.activities-rate-score-badge[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n  font-size: 14px;\n  line-height: 14px;\n}\n.activities-rate-score-badge-floating[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.6rem;\n  right: 0.3rem;\n  z-index: 24;\n  min-width: 68px;\n  justify-content: center;\n}\n.activities-rate-score-badge-between[_ngcontent-%COMP%] {\n  --activities-rate-badge-between-y: -50%;\n  position: absolute;\n  left: 50%;\n  right: auto;\n  top: 50%;\n  z-index: 24;\n  min-width: 68px;\n  width: max-content;\n  max-width: calc(100% - 0.8rem);\n  justify-content: center;\n  white-space: nowrap;\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n  transition:\n    box-shadow 0.2s ease,\n    border-color 0.2s ease,\n    filter 0.2s ease;\n}\n.activities-rate-profile-stack-pair-inline[_ngcontent-%COMP%]   .activities-rate-score-badge-between[_ngcontent-%COMP%] {\n  --activities-rate-badge-between-y: 0;\n  top: auto;\n  bottom: clamp(3.2rem, 18%, 4.2rem);\n  left: 50% !important;\n  right: auto !important;\n  transform: translate(-50%, var(--activities-rate-badge-between-y)) !important;\n}\n.activities-rate-profile-stack-pair-inline[_ngcontent-%COMP%]   .activities-rate-score-badge-between[_ngcontent-%COMP%]:not(.is-disabled):hover, \n.activities-rate-profile-stack-pair-inline[_ngcontent-%COMP%]   .activities-rate-score-badge-between[_ngcontent-%COMP%]:not(.is-disabled):active, \n.activities-rate-profile-stack-pair-inline[_ngcontent-%COMP%]   .activities-rate-score-badge-between.is-active[_ngcontent-%COMP%]:not(.is-disabled), \n.activities-rate-profile-stack-pair-inline[_ngcontent-%COMP%]   .activities-rate-score-badge-between.is-active.is-pending[_ngcontent-%COMP%]:not(.is-disabled), \n.activities-rate-profile-stack-pair-inline[_ngcontent-%COMP%]   .activities-rate-score-badge-between.is-disabled[_ngcontent-%COMP%] {\n  left: 50% !important;\n  right: auto !important;\n  transform: translate(-50%, 0) !important;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-score-badge-floating.activities-rate-score-badge-floating-pair-overlap[_ngcontent-%COMP%] {\n  --activities-rate-badge-between-y: 0;\n  top: auto;\n  bottom: clamp(3.2rem, 11%, 4.6rem);\n  left: var(--activities-pair-split, 50%);\n  right: auto;\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n  min-width: 68px;\n  width: max-content;\n  max-width: calc(100% - 0.8rem);\n  justify-content: center;\n  white-space: nowrap;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-score-badge-floating.activities-rate-score-badge-floating-pair-overlap.is-active[_ngcontent-%COMP%]:not(.is-disabled), \n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-score-badge-floating.activities-rate-score-badge-floating-pair-overlap[_ngcontent-%COMP%]:not(.is-disabled):active {\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n@media (hover: hover) and (pointer: fine) {\n  button.activities-rate-score-badge[_ngcontent-%COMP%]:not(.is-disabled):hover {\n    transform: translateY(-1px) scale(1.03);\n    box-shadow: 0 6px 14px rgba(203, 150, 34, 0.28);\n    filter: saturate(1.05);\n  }\n}\nbutton.activities-rate-score-badge[_ngcontent-%COMP%]:not(.is-disabled):active {\n  transform: translateY(0) scale(0.96);\n  box-shadow: 0 2px 8px rgba(146, 105, 16, 0.22);\n}\nbutton.activities-rate-score-badge-between[_ngcontent-%COMP%]:not(.is-disabled):hover, \nbutton.activities-rate-score-badge-between[_ngcontent-%COMP%]:not(.is-disabled):active {\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n.activities-rate-score-badge.is-pending[_ngcontent-%COMP%] {\n  border-color: rgba(187, 56, 71, 0.62);\n  background:\n    linear-gradient(\n      180deg,\n      #ffe9ed 0%,\n      #ffd9df 100%);\n  color: #b63545;\n}\n.activities-rate-score-badge.is-active[_ngcontent-%COMP%]:not(.is-disabled) {\n  border-color: rgba(206, 148, 25, 0);\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ca 0%,\n      #ffe7a8 100%);\n  color: #8b560f;\n  box-shadow: none;\n  transform: translateY(0) scale(1);\n}\n.activities-rate-score-badge-between.is-active[_ngcontent-%COMP%]:not(.is-disabled), \n.activities-rate-score-badge-between.is-active.is-pending[_ngcontent-%COMP%]:not(.is-disabled) {\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n.activities-rate-score-badge.is-active.is-pending[_ngcontent-%COMP%]:not(.is-disabled) {\n  border-color: rgba(188, 53, 72, 0);\n  background:\n    linear-gradient(\n      180deg,\n      #ffdce4 0%,\n      #ffc8d3 100%);\n  color: #9d2232;\n  box-shadow: none;\n}\n@media (hover: hover) and (pointer: fine) {\n  button.activities-rate-score-badge.is-active[_ngcontent-%COMP%]:not(.is-disabled):hover {\n    border-color: rgba(206, 148, 25, 0.76);\n    box-shadow: 0 0 0 2px rgba(255, 244, 201, 0.68), 0 9px 16px rgba(170, 117, 20, 0.26);\n  }\n  button.activities-rate-score-badge.is-active.is-pending[_ngcontent-%COMP%]:not(.is-disabled):hover {\n    border-color: rgba(188, 53, 72, 0.72);\n    box-shadow: 0 0 0 2px rgba(255, 230, 236, 0.72), 0 9px 16px rgba(170, 48, 68, 0.24);\n  }\n}\n.activities-rate-score-badge.is-blink[_ngcontent-%COMP%]:not(.is-disabled) {\n  animation: _ngcontent-%COMP%_game-rating-stars-blink 0.42s ease-in-out 1;\n}\n@keyframes _ngcontent-%COMP%_game-rating-stars-blink {\n  0%, 100% {\n    filter: brightness(1);\n  }\n  50% {\n    filter: brightness(1.12) saturate(1.1);\n  }\n}\n.activities-rate-score-badge.is-disabled[_ngcontent-%COMP%] {\n  border-color: rgba(111, 123, 140, 0.52);\n  background:\n    linear-gradient(\n      180deg,\n      #f4f6f9 0%,\n      #e8edf3 100%);\n  color: #617085;\n  cursor: default;\n  transform: none;\n  box-shadow: none;\n  transition: none;\n}\n.activities-rate-score-badge-between.is-disabled[_ngcontent-%COMP%] {\n  right: auto;\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n.activities-rate-score-badge[disabled][_ngcontent-%COMP%], \nspan.activities-rate-score-badge[_ngcontent-%COMP%] {\n  pointer-events: none;\n}\nspan.activities-rate-score-badge[_ngcontent-%COMP%] {\n  cursor: default;\n  transition: none;\n}\n.image-stack-indicators[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -0.1rem;\n  left: 0.25rem;\n  right: 0.25rem;\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));\n  gap: 4px;\n  width: auto !important;\n}\n.image-stack-hit-area[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 10px;\n  left: 10px;\n  right: 10px;\n  bottom: 10px;\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));\n  gap: 4px;\n  z-index: 2;\n}\n.image-stack-hit-segment[_ngcontent-%COMP%] {\n  border: 0;\n  background: transparent;\n  padding: 0;\n  cursor: pointer;\n  width: 100%;\n  height: 100%;\n}\n.card-image-placeholder[_ngcontent-%COMP%] {\n  width: 84px;\n  height: 84px;\n  border-radius: 50%;\n  background:\n    linear-gradient(\n      145deg,\n      #4f7cff,\n      #7a3eff 60%,\n      #f04eab);\n  color: #fff;\n  font-weight: 800;\n  font-size: 1.72rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  letter-spacing: 0.03em;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  justify-content: center;\n  align-items: flex-start;\n  width: 100%;\n  height: 100%;\n  min-width: 0;\n  min-height: 0;\n}\n.activities-rates-fullscreen-card[_ngcontent-%COMP%] {\n  margin: 0;\n  flex: 0 0 auto;\n  touch-action: pan-y;\n  width: 100%;\n  height: 100%;\n  max-width: 100%;\n  max-height: 100%;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .image-stack-line[_ngcontent-%COMP%], \n.activities-rates-fullscreen[_ngcontent-%COMP%]   .image-stack-hit-segment[_ngcontent-%COMP%] {\n  pointer-events: auto;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-profile-card[_ngcontent-%COMP%] {\n  min-height: 0;\n  background: #e6edf7;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-profile-stack[_ngcontent-%COMP%] {\n  min-height: 0;\n  height: 100%;\n  background: #d7e1ef;\n}\n.activities-rates-fullscreen-card-active[_ngcontent-%COMP%]   .activities-rate-profile-layer[_ngcontent-%COMP%] {\n  background-color: #d3ddea;\n}\n/*# sourceMappingURL=single-card.component.css.map */'], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SingleCardComponent, [{
    type: Component,
    args: [{ selector: "app-single-card", standalone: true, imports: [CommonModule, MatIconModule, LazyBgImageDirective, IndicatorComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: `@if (resolvedPresentation() === 'fullscreen') {
  <div #fullscreenShell class="activities-rates-fullscreen">
    <article
      class="activities-rate-profile-card activities-row-item activities-rates-fullscreen-card"
      [class.activities-rates-fullscreen-card-active]="resolvedState() === 'active'"
      [class.activities-rates-fullscreen-card-leaving]="resolvedState() === 'leaving'"
      [attr.data-activity-rate-row-id]="card?.rowId"
      [style.width]="fullscreenCardWidth"
      [style.height]="fullscreenCardHeight"
      >
      <ng-container *ngTemplateOutlet="cardBody"></ng-container>
    </article>
  </div>
} @else {
  <article
    class="activities-rate-profile-card activities-row-item"
    [attr.data-activity-rate-row-id]="card?.rowId"
    [attr.data-group-label]="card?.groupLabel"
    >
    <ng-container *ngTemplateOutlet="cardBody"></ng-container>
  </article>
}


<ng-template #cardBody>
  <div
    class="activities-rate-profile-stack"
    [ngClass]="resolvedStackClasses()"
    [class.is-pane-loading]="loading"
    [class.has-card-score-badge]="!!card?.badge"
    [class.has-card-context-badge]="!!card?.contextBadge"
    >
    @if (resolvedSlides().length > 1) {
      <div class="image-stack-indicators activities-rate-profile-indicators">
        @if (isInteractive()) {
          @for (slide of resolvedSlides(); track trackBySlide($index, slide); let imageIndex = $index) {
            <button
              type="button"
              class="image-stack-line"
              [class.active]="imageIndex === clampedActiveIndex()"
              (click)="onSlideSelect(imageIndex, $event)"
              aria-label="Select profile image"
            ></button>
          }
        } @else {
          @for (slide of resolvedSlides(); track trackBySlide($index, slide); let imageIndex = $index) {
            <span
              class="image-stack-line"
              [class.active]="imageIndex === clampedActiveIndex()"
            ></span>
          }
        }
      </div>
    }

    <div
      class="activities-rate-profile-layer activities-rate-profile-layer-active"
      [appLazyBgImage]="currentSlideImageUrl()"
      >
      @if (currentSlideImageUrl()) {
        <span class="activities-rate-image-loader" aria-hidden="true">
          <app-indicator kind="spinner-ring"></app-indicator>
        </span>
      }
      @if (hasOverlay(currentSlide())) {
        <div class="activities-rate-profile-overlay">
          <p class="activities-rate-profile-line activities-rate-profile-line-primary">{{ currentSlide()?.primaryLine }}</p>
          <p class="activities-rate-profile-line activities-rate-profile-line-secondary">{{ currentSlide()?.secondaryLine }}</p>
        </div>
      }
    </div>

    @if (isInteractive() && resolvedSlides().length > 1) {
      <div class="image-stack-hit-area activities-rate-profile-hit-area">
        @for (slide of resolvedSlides(); track trackBySlide($index, slide); let imageIndex = $index) {
          <button
            type="button"
            class="image-stack-hit-segment"
            (click)="onSlideSelect(imageIndex, $event)"
            aria-label="Select profile image"
          ></button>
        }
      </div>
    }

    @if (card?.statusBadgeLabel; as statusBadge) {
      <span class="shared-card-status-badge">
        {{ statusBadge }}
      </span>
    }

    @if (card?.contextBadge; as contextBadge) {
      @if (contextBadge.profileView) {
        <button
          type="button"
          class="shared-card-context-avatar-badge"
          [attr.aria-label]="contextBadge.ariaLabel || contextBadge.title || 'View related profile'"
          [attr.title]="contextBadge.title || contextBadge.ariaLabel || null"
          (click)="onContextBadgeClick(contextBadge, $event)"
          >
          @if (contextBadgeImageUrl(contextBadge)) {
            <img [src]="contextBadgeImageUrl(contextBadge)" alt="" />
          } @else {
            <span>{{ contextBadgeLabel(contextBadge) }}</span>
          }
          @if (contextBadge.counterLabel) {
            <em>{{ contextBadge.counterLabel }}</em>
          }
        </button>
      } @else {
        <span
          class="shared-card-context-avatar-badge"
          [attr.aria-label]="contextBadge.ariaLabel || contextBadge.title || 'Related profile'"
          [attr.title]="contextBadge.title || contextBadge.ariaLabel || null"
          >
          @if (contextBadgeImageUrl(contextBadge)) {
            <img [src]="contextBadgeImageUrl(contextBadge)" alt="" />
          } @else {
            <span>{{ contextBadgeLabel(contextBadge) }}</span>
          }
          @if (contextBadge.counterLabel) {
            <em>{{ contextBadge.counterLabel }}</em>
          }
        </span>
      }
    }

    @if (card?.profileView; as profileView) {
      <button
        type="button"
        class="shared-card-profile-view-btn"
        (click)="onProfileClick(profileView, $event)"
        [attr.aria-label]="'View ' + (profileView.label || 'profile')"
        >
        <mat-icon>visibility</mat-icon>
      </button>
    }

    @if (card?.badge; as cardBadge) {
      @if (isBadgeInteractive()) {
        <button
          type="button"
          class="activities-rate-score-badge"
          [class.activities-rate-score-badge-floating]="usesFloatingBadge()"
          [class.activities-rate-score-badge-between]="usesBetweenBadge()"
          [class.activities-rate-score-badge-floating-pair-overlap]="usesPairOverlapBadge()"
          [class.is-active]="cardBadge.active || badgeMenuOpen"
          [class.is-pending]="cardBadge.pending"
          [class.is-disabled]="cardBadge.disabled"
          [class.is-blink]="isBadgeBlinking()"
          [disabled]="cardBadge.disabled"
          [attr.aria-label]="cardBadge.ariaLabel"
          (pointerdown)="onBadgePointerDown($event)"
          (mousedown)="onBadgePointerDown($event)"
          (touchstart)="onBadgePointerDown($event)"
          (click)="onBadgeClick($event)"
          >
          <mat-icon>star</mat-icon>
          <span>{{ cardBadge.label }}</span>
        </button>
      } @else {
        <span
          class="activities-rate-score-badge"
          [class.activities-rate-score-badge-floating]="usesFloatingBadge()"
          [class.activities-rate-score-badge-between]="usesBetweenBadge()"
          [class.activities-rate-score-badge-floating-pair-overlap]="usesPairOverlapBadge()"
          [class.is-active]="cardBadge.active"
          [class.is-pending]="cardBadge.pending"
          [class.is-disabled]="cardBadge.disabled"
          [class.is-blink]="isBadgeBlinking()"
          [attr.aria-label]="cardBadge.ariaLabel"
          >
          <mat-icon>star</mat-icon>
          <span>{{ cardBadge.label }}</span>
        </span>
      }
    }
  </div>
</ng-template>
`, styles: ['/* src/app/shared/ui/components/core/smart-list/card/single-card/single-card.component.scss */\n:host {\n  display: block;\n  width: 100%;\n  min-height: 0;\n}\n:host([data-card-presentation=fullscreen]) {\n  height: 100%;\n}\n.activities-rate-profile-card {\n  position: relative;\n  width: 100%;\n  min-height: 264px;\n  border: 1px solid rgba(34, 54, 84, 0.24);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      #1b2c45 0%,\n      #132238 100%);\n  overflow: hidden;\n  box-sizing: border-box;\n  touch-action: pan-y;\n}\n.activities-rate-profile-card.activities-row-item {\n  cursor: default;\n  transform: none;\n  transition: none;\n  animation: none;\n  -webkit-tap-highlight-color: transparent;\n}\n.activities-rate-profile-card.activities-row-item:hover,\n.activities-rate-profile-card.activities-row-item:active {\n  transform: none;\n  filter: none;\n}\n.activities-rate-profile-stack {\n  position: relative;\n  min-height: 264px;\n  height: 100%;\n}\n.activities-rate-profile-stack.activities-rate-profile-stack-pair-inline {\n  min-height: 264px;\n}\n.activities-rate-profile-stack.activities-rate-profile-stack-pair-fullscreen {\n  min-height: 100%;\n  height: 100%;\n}\n.activities-rate-pair-inline-grid {\n  position: absolute;\n  inset: 0;\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: clamp(0.28rem, 0.8vw, 0.52rem);\n  padding: 0.42rem;\n}\n.activities-rate-pair-inline-grid:not(.activities-rate-pair-fullscreen-grid) {\n  gap: clamp(0.08rem, 0.32vw, 0.16rem);\n}\n.activities-rate-pair-inline-card {\n  position: relative;\n  min-width: 0;\n  border-radius: 12px;\n  overflow: hidden;\n  border: 1px solid rgba(255, 255, 255, 0.28);\n  box-shadow: 0 10px 22px rgba(6, 18, 36, 0.3);\n}\n.activities-rate-pair-inline-layer {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  min-height: 0;\n  background-size: var(--rate-card-image-fit, cover);\n  background-position: center;\n  background-repeat: no-repeat;\n}\n.activities-rate-image-loader {\n  position: absolute;\n  inset: 0;\n  z-index: 2;\n  display: grid;\n  place-items: center;\n  pointer-events: none;\n  opacity: 0;\n  transition: opacity 120ms ease;\n}\n.activities-rate-image-loader app-indicator {\n  position: relative;\n  z-index: 1;\n}\n.activities-rate-pair-inline-layer.lazy-bg-loading .activities-rate-image-loader,\n.activities-rate-profile-layer.lazy-bg-loading .activities-rate-image-loader {\n  opacity: 1;\n}\n.activities-rate-pair-inline-layer.lazy-bg-loaded .activities-rate-image-loader,\n.activities-rate-profile-layer.lazy-bg-loaded .activities-rate-image-loader,\n.activities-rate-pair-inline-layer.lazy-bg-error .activities-rate-image-loader,\n.activities-rate-profile-layer.lazy-bg-error .activities-rate-image-loader {\n  opacity: 0;\n}\n.activities-rate-pair-inline-layer::after,\n.activities-rate-profile-layer::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  z-index: 0;\n  pointer-events: none;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(12, 22, 36, 0.04) 0%,\n      rgba(7, 16, 28, 0.62) 66%,\n      rgba(7, 16, 28, 0.84) 100%);\n}\n.activities-rate-pair-inline-layer .card-image-placeholder {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 4;\n}\n.activities-rate-pair-inline-card.is-pane-loading .activities-rate-profile-indicators .image-stack-line.active,\n.activities-rate-profile-stack.is-pane-loading .activities-rate-profile-indicators .image-stack-line.active {\n  animation: activities-rate-pane-loading-pulse 500ms ease;\n}\n@keyframes activities-rate-pane-loading-pulse {\n  0% {\n    transform: scaleX(0.84);\n    opacity: 0.58;\n  }\n  100% {\n    transform: scaleX(1);\n    opacity: 1;\n  }\n}\n.activities-rate-pair-inline-label {\n  position: absolute;\n  top: 0.64rem;\n  left: 0.52rem;\n  z-index: 5;\n  border-radius: 999px;\n  border: 1px solid rgba(212, 229, 249, 0.42);\n  color: #f5f9ff;\n  font-size: 0.66rem;\n  font-weight: 700;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.16rem 0.42rem;\n  background: rgba(8, 18, 35, 0.62);\n}\n.activities-rate-pair-inline-card-woman .activities-rate-pair-inline-label {\n  background: rgba(109, 42, 118, 0.64);\n}\n.activities-rate-pair-inline-card-man .activities-rate-pair-inline-label {\n  background: rgba(36, 74, 127, 0.66);\n}\n.shared-card-status-badge {\n  position: absolute;\n  top: 0.64rem;\n  right: 0.56rem;\n  z-index: 80;\n  max-width: calc(100% - 1.24rem);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  border-radius: 999px;\n  border: 1px solid rgba(148, 225, 182, 0.56);\n  background: rgba(8, 34, 18, 0.74);\n  color: #e9ffef;\n  font-size: 0.68rem;\n  font-weight: 700;\n  letter-spacing: 0.01em;\n  line-height: 1;\n  padding: 0.17rem 0.5rem;\n  pointer-events: none;\n}\n.shared-card-context-avatar-badge {\n  position: absolute;\n  top: 0.68rem;\n  left: 0.62rem;\n  z-index: 30;\n  width: 2.08rem;\n  height: 2.08rem;\n  display: inline-grid;\n  place-items: center;\n  border: 2px solid rgba(255, 255, 255, 0.84);\n  border-radius: 999px;\n  background: rgba(8, 18, 35, 0.74);\n  color: #f7fbff;\n  box-shadow: 0 7px 16px rgba(4, 12, 26, 0.36), inset 0 0 0 1px rgba(15, 35, 58, 0.26);\n  overflow: visible;\n  pointer-events: auto;\n  touch-action: manipulation;\n}\nbutton.shared-card-context-avatar-badge {\n  cursor: pointer;\n}\n.shared-card-context-avatar-badge img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  border-radius: inherit;\n}\n.shared-card-context-avatar-badge > span {\n  font-size: 0.68rem;\n  font-weight: 900;\n  line-height: 1;\n}\n.shared-card-context-avatar-badge em {\n  position: absolute;\n  top: -0.74rem;\n  right: -0.72rem;\n  z-index: 2;\n  min-width: 1rem;\n  height: 1rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border: 1px solid rgba(255, 255, 255, 0.88);\n  border-radius: 999px;\n  background: #d94c4c;\n  color: #fff;\n  font-size: 0.54rem;\n  font-style: normal;\n  font-weight: 900;\n  line-height: 1;\n  padding: 0 0.16rem;\n  box-shadow: 0 4px 10px rgba(77, 12, 24, 0.32);\n}\n.activities-rate-pair-inline-overlay,\n.activities-rate-profile-overlay {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 3;\n  display: grid;\n  gap: 0.14rem;\n}\n.activities-rate-pair-inline-overlay {\n  padding: 0.7rem 0.72rem 0.68rem;\n}\n.activities-rate-pair-inline-card .activities-rate-profile-indicators.activities-rate-pair-inline-indicators {\n  top: 0.28rem;\n  left: 0.34rem;\n  right: 0.34rem;\n  padding: 0.12rem 0.24rem;\n  border-radius: 7px;\n}\n.activities-rate-pair-inline-hit-area {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 4;\n}\n.activities-rate-profile-layer {\n  position: absolute;\n  inset: 0;\n  z-index: 1;\n  border-radius: 14px;\n  overflow: hidden;\n  background-size: var(--rate-card-image-fit, cover);\n  background-position: center;\n  background-repeat: no-repeat;\n  border: 1px solid rgba(255, 255, 255, 0.26);\n  box-shadow: 0 12px 24px rgba(6, 18, 36, 0.34);\n}\n:host([data-card-presentation=list]) .activities-rate-pair-inline-layer,\n:host([data-card-presentation=list]) .activities-rate-profile-layer {\n  background-size: contain;\n}\n.activities-rate-profile-layer-active {\n  pointer-events: none;\n}\n.activities-rate-profile-indicators {\n  position: absolute;\n  top: 0.36rem;\n  left: 0.52rem;\n  right: 0.52rem;\n  z-index: 10;\n  padding: 0.16rem 0.34rem;\n  border-radius: 8px;\n  background: rgba(10, 18, 31, 0.38);\n  gap: 5px;\n}\n.activities-rate-profile-indicators .image-stack-line {\n  height: 4px;\n  border: 1px solid rgba(28, 42, 64, 0.36);\n  background: rgba(167, 177, 192, 0.9);\n  opacity: 1;\n}\n.activities-rate-profile-indicators .image-stack-line.active {\n  border-color: rgba(248, 252, 255, 0.86);\n  background: rgba(250, 252, 255, 0.98);\n  box-shadow: 0 0 0 1px rgba(10, 20, 34, 0.12);\n}\n.activities-rate-profile-hit-area {\n  top: 0.2rem;\n  left: 0.2rem;\n  right: 0.2rem;\n  bottom: 0.2rem;\n  z-index: 4;\n}\n.shared-card-profile-view-btn {\n  position: absolute;\n  right: 0.56rem;\n  bottom: 0.56rem;\n  z-index: 18;\n  width: 2.22rem;\n  height: 2.22rem;\n  border: 1px solid rgba(41, 99, 143, 0.28);\n  border-radius: 999px;\n  background: rgba(232, 246, 251, 0.94);\n  color: #226d83;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  box-shadow: 0 8px 18px rgba(6, 24, 44, 0.2);\n  cursor: pointer;\n  pointer-events: auto;\n  transition:\n    background 0.16s ease,\n    border-color 0.16s ease,\n    transform 0.16s ease;\n  -webkit-tap-highlight-color: transparent;\n}\n.shared-card-profile-view-btn:hover,\n.shared-card-profile-view-btn:focus-visible {\n  background: rgba(218, 241, 249, 0.98);\n  border-color: rgba(31, 124, 153, 0.44);\n  transform: translateY(-1px);\n  outline: none;\n}\n.shared-card-profile-view-btn .mat-icon {\n  width: 1.34rem;\n  height: 1.34rem;\n  font-size: 1.34rem;\n  line-height: 1.34rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.activities-rate-pair-inline-card .shared-card-profile-view-btn {\n  right: 0.44rem;\n  bottom: 0.44rem;\n  width: 2rem;\n  height: 2rem;\n}\n.activities-rate-profile-overlay {\n  padding: 0.74rem 0.8rem 0.72rem;\n}\n.activities-rate-profile-line {\n  margin: 0;\n  color: #f5f9ff !important;\n  text-shadow: 0 2px 9px rgba(2, 8, 16, 0.96);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.activities-rate-profile-line-primary {\n  font-size: 0.9rem;\n  font-weight: 800;\n}\n.activities-rate-profile-line-secondary {\n  font-size: 0.76rem;\n  font-weight: 700;\n  color: rgba(237, 245, 255, 0.98) !important;\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-given .activities-rate-profile-layer {\n  border-color: rgba(63, 136, 208, 0.52);\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-received .activities-rate-profile-layer {\n  border-color: rgba(53, 160, 114, 0.52);\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-mutual .activities-rate-profile-layer {\n  border-color: rgba(176, 121, 48, 0.52);\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-met .activities-rate-profile-layer {\n  border-color: rgba(104, 118, 139, 0.52);\n}\n.activities-rate-score-badge {\n  min-height: 26px;\n  border: 2px solid rgba(187, 136, 22, 0.58);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #fff9e9 0%,\n      #fff1cb 100%);\n  color: #9f6915;\n  font-size: 0.76rem;\n  font-weight: 800;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n  padding: 0.16rem 0.56rem;\n  cursor: pointer;\n  transform: translateY(0) scale(1);\n  box-shadow: inset 0 0 0 1px rgba(255, 245, 215, 0.72), 0 0 0 rgba(226, 171, 47, 0);\n  transition:\n    transform 0.16s ease,\n    box-shadow 0.2s ease,\n    border-color 0.2s ease,\n    filter 0.2s ease;\n}\n.activities-rate-score-badge .mat-icon {\n  width: 14px;\n  height: 14px;\n  font-size: 14px;\n  line-height: 14px;\n}\n.activities-rate-score-badge-floating {\n  position: absolute;\n  top: 0.6rem;\n  right: 0.3rem;\n  z-index: 24;\n  min-width: 68px;\n  justify-content: center;\n}\n.activities-rate-score-badge-between {\n  --activities-rate-badge-between-y: -50%;\n  position: absolute;\n  left: 50%;\n  right: auto;\n  top: 50%;\n  z-index: 24;\n  min-width: 68px;\n  width: max-content;\n  max-width: calc(100% - 0.8rem);\n  justify-content: center;\n  white-space: nowrap;\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n  transition:\n    box-shadow 0.2s ease,\n    border-color 0.2s ease,\n    filter 0.2s ease;\n}\n.activities-rate-profile-stack-pair-inline .activities-rate-score-badge-between {\n  --activities-rate-badge-between-y: 0;\n  top: auto;\n  bottom: clamp(3.2rem, 18%, 4.2rem);\n  left: 50% !important;\n  right: auto !important;\n  transform: translate(-50%, var(--activities-rate-badge-between-y)) !important;\n}\n.activities-rate-profile-stack-pair-inline .activities-rate-score-badge-between:not(.is-disabled):hover,\n.activities-rate-profile-stack-pair-inline .activities-rate-score-badge-between:not(.is-disabled):active,\n.activities-rate-profile-stack-pair-inline .activities-rate-score-badge-between.is-active:not(.is-disabled),\n.activities-rate-profile-stack-pair-inline .activities-rate-score-badge-between.is-active.is-pending:not(.is-disabled),\n.activities-rate-profile-stack-pair-inline .activities-rate-score-badge-between.is-disabled {\n  left: 50% !important;\n  right: auto !important;\n  transform: translate(-50%, 0) !important;\n}\n.activities-rates-fullscreen .activities-rate-score-badge-floating.activities-rate-score-badge-floating-pair-overlap {\n  --activities-rate-badge-between-y: 0;\n  top: auto;\n  bottom: clamp(3.2rem, 11%, 4.6rem);\n  left: var(--activities-pair-split, 50%);\n  right: auto;\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n  min-width: 68px;\n  width: max-content;\n  max-width: calc(100% - 0.8rem);\n  justify-content: center;\n  white-space: nowrap;\n}\n.activities-rates-fullscreen .activities-rate-score-badge-floating.activities-rate-score-badge-floating-pair-overlap.is-active:not(.is-disabled),\n.activities-rates-fullscreen .activities-rate-score-badge-floating.activities-rate-score-badge-floating-pair-overlap:not(.is-disabled):active {\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n@media (hover: hover) and (pointer: fine) {\n  button.activities-rate-score-badge:not(.is-disabled):hover {\n    transform: translateY(-1px) scale(1.03);\n    box-shadow: 0 6px 14px rgba(203, 150, 34, 0.28);\n    filter: saturate(1.05);\n  }\n}\nbutton.activities-rate-score-badge:not(.is-disabled):active {\n  transform: translateY(0) scale(0.96);\n  box-shadow: 0 2px 8px rgba(146, 105, 16, 0.22);\n}\nbutton.activities-rate-score-badge-between:not(.is-disabled):hover,\nbutton.activities-rate-score-badge-between:not(.is-disabled):active {\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n.activities-rate-score-badge.is-pending {\n  border-color: rgba(187, 56, 71, 0.62);\n  background:\n    linear-gradient(\n      180deg,\n      #ffe9ed 0%,\n      #ffd9df 100%);\n  color: #b63545;\n}\n.activities-rate-score-badge.is-active:not(.is-disabled) {\n  border-color: rgba(206, 148, 25, 0);\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ca 0%,\n      #ffe7a8 100%);\n  color: #8b560f;\n  box-shadow: none;\n  transform: translateY(0) scale(1);\n}\n.activities-rate-score-badge-between.is-active:not(.is-disabled),\n.activities-rate-score-badge-between.is-active.is-pending:not(.is-disabled) {\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n.activities-rate-score-badge.is-active.is-pending:not(.is-disabled) {\n  border-color: rgba(188, 53, 72, 0);\n  background:\n    linear-gradient(\n      180deg,\n      #ffdce4 0%,\n      #ffc8d3 100%);\n  color: #9d2232;\n  box-shadow: none;\n}\n@media (hover: hover) and (pointer: fine) {\n  button.activities-rate-score-badge.is-active:not(.is-disabled):hover {\n    border-color: rgba(206, 148, 25, 0.76);\n    box-shadow: 0 0 0 2px rgba(255, 244, 201, 0.68), 0 9px 16px rgba(170, 117, 20, 0.26);\n  }\n  button.activities-rate-score-badge.is-active.is-pending:not(.is-disabled):hover {\n    border-color: rgba(188, 53, 72, 0.72);\n    box-shadow: 0 0 0 2px rgba(255, 230, 236, 0.72), 0 9px 16px rgba(170, 48, 68, 0.24);\n  }\n}\n.activities-rate-score-badge.is-blink:not(.is-disabled) {\n  animation: game-rating-stars-blink 0.42s ease-in-out 1;\n}\n@keyframes game-rating-stars-blink {\n  0%, 100% {\n    filter: brightness(1);\n  }\n  50% {\n    filter: brightness(1.12) saturate(1.1);\n  }\n}\n.activities-rate-score-badge.is-disabled {\n  border-color: rgba(111, 123, 140, 0.52);\n  background:\n    linear-gradient(\n      180deg,\n      #f4f6f9 0%,\n      #e8edf3 100%);\n  color: #617085;\n  cursor: default;\n  transform: none;\n  box-shadow: none;\n  transition: none;\n}\n.activities-rate-score-badge-between.is-disabled {\n  right: auto;\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n.activities-rate-score-badge[disabled],\nspan.activities-rate-score-badge {\n  pointer-events: none;\n}\nspan.activities-rate-score-badge {\n  cursor: default;\n  transition: none;\n}\n.image-stack-indicators {\n  position: absolute;\n  top: -0.1rem;\n  left: 0.25rem;\n  right: 0.25rem;\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));\n  gap: 4px;\n  width: auto !important;\n}\n.image-stack-hit-area {\n  position: absolute;\n  top: 10px;\n  left: 10px;\n  right: 10px;\n  bottom: 10px;\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));\n  gap: 4px;\n  z-index: 2;\n}\n.image-stack-hit-segment {\n  border: 0;\n  background: transparent;\n  padding: 0;\n  cursor: pointer;\n  width: 100%;\n  height: 100%;\n}\n.card-image-placeholder {\n  width: 84px;\n  height: 84px;\n  border-radius: 50%;\n  background:\n    linear-gradient(\n      145deg,\n      #4f7cff,\n      #7a3eff 60%,\n      #f04eab);\n  color: #fff;\n  font-weight: 800;\n  font-size: 1.72rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  letter-spacing: 0.03em;\n}\n.activities-rates-fullscreen {\n  position: relative;\n  display: flex;\n  justify-content: center;\n  align-items: flex-start;\n  width: 100%;\n  height: 100%;\n  min-width: 0;\n  min-height: 0;\n}\n.activities-rates-fullscreen-card {\n  margin: 0;\n  flex: 0 0 auto;\n  touch-action: pan-y;\n  width: 100%;\n  height: 100%;\n  max-width: 100%;\n  max-height: 100%;\n}\n.activities-rates-fullscreen .image-stack-line,\n.activities-rates-fullscreen .image-stack-hit-segment {\n  pointer-events: auto;\n}\n.activities-rates-fullscreen .activities-rate-profile-card {\n  min-height: 0;\n  background: #e6edf7;\n}\n.activities-rates-fullscreen .activities-rate-profile-stack {\n  min-height: 0;\n  height: 100%;\n  background: #d7e1ef;\n}\n.activities-rates-fullscreen-card-active .activities-rate-profile-layer {\n  background-color: #d3ddea;\n}\n/*# sourceMappingURL=single-card.component.css.map */\n'] }]
  }], null, { card: [{
    type: Input
  }], badgeClick: [{
    type: Output
  }], menuRequest: [{
    type: Output
  }], detailClick: [{
    type: Output
  }], fullscreenShellRef: [{
    type: ViewChild,
    args: ["fullscreenShell", { read: ElementRef }]
  }], hostPresentationAttr: [{
    type: HostBinding,
    args: ["attr.data-card-presentation"]
  }], hostHeight: [{
    type: HostBinding,
    args: ["style.height"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SingleCardComponent, { className: "SingleCardComponent", filePath: "app/shared/ui/components/core/smart-list/card/single-card/single-card.component.ts", lineNumber: 40 });
})();

// src/app/shared/ui/components/core/smart-list/card/pair-card/pair-card.component.ts
var _c02 = ["fullscreenShell"];
function PairCardComponent_Conditional_0_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function PairCardComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3, 1)(2, "article", 5);
    \u0275\u0275template(3, PairCardComponent_Conditional_0_ng_container_3_Template, 1, 0, "ng-container", 6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    const cardBody_r2 = \u0275\u0275reference(3);
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", ctx_r0.fullscreenCardWidth)("height", ctx_r0.fullscreenCardHeight);
    \u0275\u0275classProp("activities-rates-fullscreen-card-active", ctx_r0.resolvedState() === "active")("activities-rates-fullscreen-card-leaving", ctx_r0.resolvedState() === "leaving");
    \u0275\u0275attribute("data-activity-rate-row-id", ctx_r0.card == null ? null : ctx_r0.card.rowId);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", cardBody_r2);
  }
}
function PairCardComponent_Conditional_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function PairCardComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 4);
    \u0275\u0275template(1, PairCardComponent_Conditional_1_ng_container_1_Template, 1, 0, "ng-container", 6);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    const cardBody_r2 = \u0275\u0275reference(3);
    \u0275\u0275attribute("data-activity-rate-row-id", ctx_r0.card == null ? null : ctx_r0.card.rowId)("data-group-label", ctx_r0.card == null ? null : ctx_r0.card.groupLabel);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", cardBody_r2);
  }
}
function PairCardComponent_ng_template_2_For_4_Conditional_1_Conditional_1_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 23);
    \u0275\u0275listener("click", function PairCardComponent_ng_template_2_For_4_Conditional_1_Conditional_1_For_1_Template_button_click_0_listener($event) {
      const \u0275$index_30_r4 = \u0275\u0275restoreView(_r3).$index;
      const slot_r5 = \u0275\u0275nextContext(3).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.onSlotSelect(slot_r5, \u0275$index_30_r4, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const \u0275$index_30_r4 = ctx.$index;
    const slot_r5 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("active", \u0275$index_30_r4 === ctx_r0.activeIndex(slot_r5));
    \u0275\u0275attribute("aria-label", "Select " + slot_r5.label.toLowerCase() + " profile image");
  }
}
function PairCardComponent_ng_template_2_For_4_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, PairCardComponent_ng_template_2_For_4_Conditional_1_Conditional_1_For_1_Template, 1, 3, "button", 22, \u0275\u0275componentInstance().trackBySlide, true);
  }
  if (rf & 2) {
    const slot_r5 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275repeater(slot_r5.slides);
  }
}
function PairCardComponent_ng_template_2_For_4_Conditional_1_Conditional_2_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 25);
  }
  if (rf & 2) {
    const \u0275$index_34_r6 = ctx.$index;
    const slot_r5 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("active", \u0275$index_34_r6 === ctx_r0.activeIndex(slot_r5));
  }
}
function PairCardComponent_ng_template_2_For_4_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, PairCardComponent_ng_template_2_For_4_Conditional_1_Conditional_2_For_1_Template, 1, 2, "span", 24, \u0275\u0275componentInstance().trackBySlide, true);
  }
  if (rf & 2) {
    const slot_r5 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275repeater(slot_r5.slides);
  }
}
function PairCardComponent_ng_template_2_For_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275conditionalCreate(1, PairCardComponent_ng_template_2_For_4_Conditional_1_Conditional_1_Template, 2, 0)(2, PairCardComponent_ng_template_2_For_4_Conditional_1_Conditional_2_Template, 2, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.isInteractive() ? 1 : 2);
  }
}
function PairCardComponent_ng_template_2_For_4_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 14);
    \u0275\u0275element(1, "app-indicator", 26);
    \u0275\u0275elementEnd();
  }
}
function PairCardComponent_ng_template_2_For_4_Conditional_9_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 28);
    \u0275\u0275listener("click", function PairCardComponent_ng_template_2_For_4_Conditional_9_For_2_Template_button_click_0_listener($event) {
      const \u0275$index_55_r8 = \u0275\u0275restoreView(_r7).$index;
      const slot_r5 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.onSlotSelect(slot_r5, \u0275$index_55_r8, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const slot_r5 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275attribute("aria-label", "Select " + slot_r5.label.toLowerCase() + " profile image");
  }
}
function PairCardComponent_ng_template_2_For_4_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18);
    \u0275\u0275repeaterCreate(1, PairCardComponent_ng_template_2_For_4_Conditional_9_For_2_Template, 1, 1, "button", 27, \u0275\u0275componentInstance().trackBySlide, true);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const slot_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275repeater(slot_r5.slides);
  }
}
function PairCardComponent_ng_template_2_For_4_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx, " ");
  }
}
function PairCardComponent_ng_template_2_For_4_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 20);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_15_0;
    const slot_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", (tmp_15_0 = ctx_r0.currentSlide(slot_r5)) == null ? null : tmp_15_0.placeholderLabel, " ");
  }
}
function PairCardComponent_ng_template_2_For_4_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 29);
    \u0275\u0275listener("click", function PairCardComponent_ng_template_2_For_4_Conditional_12_Template_button_click_0_listener($event) {
      const profileView_r10 = \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.onProfileClick(profileView_r10, $event));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "visibility");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const slot_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275attribute("aria-label", "View " + (ctx.label || slot_r5.label + " profile"));
  }
}
function PairCardComponent_ng_template_2_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11);
    \u0275\u0275conditionalCreate(1, PairCardComponent_ng_template_2_For_4_Conditional_1_Template, 3, 1, "div", 12);
    \u0275\u0275elementStart(2, "div", 13);
    \u0275\u0275conditionalCreate(3, PairCardComponent_ng_template_2_For_4_Conditional_3_Template, 2, 0, "span", 14);
    \u0275\u0275elementStart(4, "div", 15)(5, "p", 16);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 17);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(9, PairCardComponent_ng_template_2_For_4_Conditional_9_Template, 3, 0, "div", 18);
    \u0275\u0275conditionalCreate(10, PairCardComponent_ng_template_2_For_4_Conditional_10_Template, 2, 1, "span", 19);
    \u0275\u0275conditionalCreate(11, PairCardComponent_ng_template_2_For_4_Conditional_11_Template, 2, 1, "span", 20);
    \u0275\u0275conditionalCreate(12, PairCardComponent_ng_template_2_For_4_Conditional_12_Template, 3, 1, "button", 21);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_23_0;
    let tmp_24_0;
    let tmp_26_0;
    let tmp_27_0;
    let tmp_28_0;
    const slot_r5 = ctx.$implicit;
    const \u0275$index_23_r11 = ctx.$index;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("activities-rate-pair-inline-card-start", \u0275$index_23_r11 === 0)("activities-rate-pair-inline-card-end", \u0275$index_23_r11 === 1)("activities-rate-pair-inline-card-woman", slot_r5.tone === "woman")("activities-rate-pair-inline-card-man", slot_r5.tone === "man")("is-pane-loading", ctx_r0.isLoading(slot_r5))("is-collapsed", ctx_r0.isSlotCollapsed(slot_r5, \u0275$index_23_r11));
    \u0275\u0275advance();
    \u0275\u0275conditional(slot_r5.slides.length > 1 ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("appLazyBgImage", ctx_r0.currentSlideImageUrl(slot_r5));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.currentSlideImageUrl(slot_r5) ? 3 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((tmp_23_0 = ctx_r0.currentSlide(slot_r5)) == null ? null : tmp_23_0.primaryLine);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((tmp_24_0 = ctx_r0.currentSlide(slot_r5)) == null ? null : tmp_24_0.secondaryLine);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.isInteractive() && slot_r5.slides.length > 1 ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_26_0 = slot_r5.statusBadgeLabel) ? 10 : -1, tmp_26_0);
    \u0275\u0275advance();
    \u0275\u0275conditional(!((tmp_27_0 = ctx_r0.currentSlide(slot_r5)) == null ? null : tmp_27_0.imageUrl) ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_28_0 = slot_r5.profileView) ? 12 : -1, tmp_28_0);
  }
}
function PairCardComponent_ng_template_2_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 30);
    \u0275\u0275listener("pointerdown", function PairCardComponent_ng_template_2_Conditional_5_Template_button_pointerdown_0_listener($event) {
      \u0275\u0275restoreView(_r12);
      \u0275\u0275nextContext();
      const splitContainer_r13 = \u0275\u0275reference(2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onSplitHandlePointerDown($event, splitContainer_r13));
    })("touchstart", function PairCardComponent_ng_template_2_Conditional_5_Template_button_touchstart_0_listener($event) {
      \u0275\u0275restoreView(_r12);
      \u0275\u0275nextContext();
      const splitContainer_r13 = \u0275\u0275reference(2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onSplitHandleTouchStart($event, splitContainer_r13));
    })("click", function PairCardComponent_ng_template_2_Conditional_5_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r12);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.consumeClick($event));
    });
    \u0275\u0275element(1, "span", 31);
    \u0275\u0275elementEnd();
  }
}
function PairCardComponent_ng_template_2_Conditional_6_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 34);
    \u0275\u0275listener("pointerdown", function PairCardComponent_ng_template_2_Conditional_6_Conditional_0_Template_button_pointerdown_0_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.onBadgePointerDown($event));
    })("mousedown", function PairCardComponent_ng_template_2_Conditional_6_Conditional_0_Template_button_mousedown_0_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.onBadgePointerDown($event));
    })("touchstart", function PairCardComponent_ng_template_2_Conditional_6_Conditional_0_Template_button_touchstart_0_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.onBadgePointerDown($event));
    })("click", function PairCardComponent_ng_template_2_Conditional_6_Conditional_0_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.onBadgeClick($event));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "star");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const cardBadge_r15 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("activities-rate-score-badge-floating", ctx_r0.usesFloatingBadge())("activities-rate-score-badge-between", ctx_r0.usesBetweenBadge())("activities-rate-score-badge-floating-pair-overlap", ctx_r0.usesPairOverlapBadge())("is-active", cardBadge_r15.active || ctx_r0.badgeMenuOpen)("is-pending", cardBadge_r15.pending)("is-disabled", cardBadge_r15.disabled)("is-blink", ctx_r0.isBadgeBlinking());
    \u0275\u0275property("disabled", cardBadge_r15.disabled);
    \u0275\u0275attribute("aria-label", cardBadge_r15.ariaLabel);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(cardBadge_r15.label);
  }
}
function PairCardComponent_ng_template_2_Conditional_6_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 35)(1, "mat-icon");
    \u0275\u0275text(2, "star");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const cardBadge_r15 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("activities-rate-score-badge-floating", ctx_r0.usesFloatingBadge())("activities-rate-score-badge-between", ctx_r0.usesBetweenBadge())("activities-rate-score-badge-floating-pair-overlap", ctx_r0.usesPairOverlapBadge())("is-active", cardBadge_r15.active)("is-pending", cardBadge_r15.pending)("is-disabled", cardBadge_r15.disabled)("is-blink", ctx_r0.isBadgeBlinking());
    \u0275\u0275attribute("aria-label", cardBadge_r15.ariaLabel);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(cardBadge_r15.label);
  }
}
function PairCardComponent_ng_template_2_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, PairCardComponent_ng_template_2_Conditional_6_Conditional_0_Template, 5, 17, "button", 32)(1, PairCardComponent_ng_template_2_Conditional_6_Conditional_1_Template, 5, 16, "span", 33);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(ctx_r0.isBadgeInteractive() ? 0 : 1);
  }
}
function PairCardComponent_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7)(1, "div", 8, 2);
    \u0275\u0275repeaterCreate(3, PairCardComponent_ng_template_2_For_4_Template, 13, 21, "div", 9, \u0275\u0275componentInstance().trackBySlot, true);
    \u0275\u0275conditionalCreate(5, PairCardComponent_ng_template_2_Conditional_5_Template, 2, 0, "button", 10);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, PairCardComponent_ng_template_2_Conditional_6_Template, 2, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_11_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("--activities-pair-split", ctx_r0.resolvedSplitCssValue());
    \u0275\u0275classProp("activities-rate-profile-stack-pair-inline", ctx_r0.resolvedPresentation() === "list")("activities-rate-profile-stack-pair-fullscreen", ctx_r0.resolvedPresentation() === "fullscreen")("is-resizing", ctx_r0.isResizing);
    \u0275\u0275property("ngClass", ctx_r0.resolvedStackClasses());
    \u0275\u0275advance();
    \u0275\u0275classProp("activities-rate-pair-fullscreen-grid", ctx_r0.resolvedPresentation() === "fullscreen");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.resolvedSlots());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.isSplitHandleVisible() ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_11_0 = ctx_r0.card == null ? null : ctx_r0.card.badge) ? 6 : -1, tmp_11_0);
  }
}
var PairCardComponent = class _PairCardComponent {
  static IMAGE_PULSE_DURATION_MS = 500;
  static BADGE_BLINK_DURATION_MS = 420;
  static FULLSCREEN_ASPECT_RATIO = 4 / 3;
  static SPLIT_DEFAULT_PERCENT = 50;
  static SPLIT_MIN_PERCENT = 0;
  static SPLIT_MAX_PERCENT = 100;
  static activeIndexByRowSlotKey = {};
  static lastCompactSplitPercent = _PairCardComponent.SPLIT_DEFAULT_PERCENT;
  cdr = inject(ChangeDetectorRef);
  loadingTimersByKey = {};
  badgeBlinkTimer = null;
  fullscreenResizeObserver = null;
  previousRowId = "";
  previousBadgeLabel = "";
  splitPointerId = null;
  splitBounds = null;
  splitDragStartClientX = null;
  splitDragStartPercent = null;
  dragListenersBound = false;
  fullscreenShellElementRef;
  onWindowPointerMove = (event) => {
    if (!this.isResizing || this.splitPointerId !== event.pointerId) {
      return;
    }
    if (event.cancelable) {
      event.preventDefault();
    }
    this.updateSplitFromDragDelta(event.clientX);
  };
  onWindowPointerUp = (event) => {
    if (this.splitPointerId !== event.pointerId) {
      return;
    }
    this.stopSplitDrag();
  };
  onWindowPointerCancel = (event) => {
    if (this.splitPointerId !== event.pointerId) {
      return;
    }
    this.stopSplitDrag();
  };
  onWindowTouchMove = (event) => {
    if (!this.isResizing || this.splitPointerId !== -1) {
      return;
    }
    const touch = event.touches?.[0] ?? event.changedTouches?.[0];
    if (!touch) {
      return;
    }
    if (event.cancelable) {
      event.preventDefault();
    }
    this.updateSplitFromDragDelta(touch.clientX);
  };
  onWindowTouchEnd = (event) => {
    if (this.splitPointerId !== -1 || !event.changedTouches?.length) {
      return;
    }
    this.stopSplitDrag();
  };
  onWindowTouchCancel = (event) => {
    if (this.splitPointerId !== -1 || !event.changedTouches?.length) {
      return;
    }
    this.stopSplitDrag();
  };
  card = null;
  showSplitHandle = true;
  badgeClick = new EventEmitter();
  menuRequest = new EventEmitter();
  detailClick = new EventEmitter();
  activeIndexByKey = {};
  loadingByKey = {};
  splitPercent = _PairCardComponent.SPLIT_DEFAULT_PERCENT;
  isResizing = false;
  transientBadgeBlink = false;
  badgeMenuOpen = false;
  fullscreenCardWidth = null;
  fullscreenCardHeight = null;
  set fullscreenShellRef(value) {
    this.fullscreenShellElementRef = value;
    this.bindFullscreenObserver();
    this.scheduleFullscreenLayoutSync();
  }
  get hostPresentationAttr() {
    return this.resolvedPresentation();
  }
  get hostHeight() {
    return this.resolvedPresentation() === "fullscreen" ? "100%" : null;
  }
  ngAfterViewInit() {
    this.bindFullscreenObserver();
    this.scheduleFullscreenLayoutSync();
  }
  ngOnChanges(changes) {
    if (changes["showSplitHandle"] && !this.showSplitHandle) {
      this.stopSplitDrag();
    }
    if (!changes["card"]) {
      return;
    }
    const rowId = this.card?.rowId ?? "";
    const badgeLabel = this.card?.badge?.label ?? "";
    if (rowId !== this.previousRowId) {
      this.syncStateFromCard();
    }
    if (rowId === this.previousRowId && badgeLabel !== this.previousBadgeLabel && this.card?.badge?.blink !== true) {
      this.startTransientBadgeBlink();
    }
    this.previousRowId = rowId;
    this.previousBadgeLabel = badgeLabel;
    this.scheduleFullscreenLayoutSync();
  }
  ngOnDestroy() {
    Object.values(this.loadingTimersByKey).forEach((timer) => clearTimeout(timer));
    if (this.badgeBlinkTimer) {
      clearTimeout(this.badgeBlinkTimer);
      this.badgeBlinkTimer = null;
    }
    this.disconnectFullscreenObserver();
    this.stopSplitDrag();
  }
  trackBySlot(_index, slot) {
    return slot.key;
  }
  trackBySlide(index, slide) {
    return `${index}:${slide.imageUrl}`;
  }
  resolvedPresentation() {
    return this.card?.presentation ?? "list";
  }
  resolvedState() {
    return this.card?.state ?? "default";
  }
  resolvedSlots() {
    return this.card?.slots ?? [];
  }
  resolvedStackClasses() {
    return this.card?.stackClasses ?? [];
  }
  currentSlide(slot) {
    if (slot.slides.length === 0) {
      return null;
    }
    return slot.slides[this.activeIndex(slot)] ?? slot.slides[0] ?? null;
  }
  currentSlideImageUrl(slot) {
    return AppUtils.mediaImageVariantUrl(this.currentSlide(slot)?.imageUrl, this.resolvedPresentation() === "fullscreen" ? "large" : "medium");
  }
  activeIndex(slot) {
    const rawIndex = this.activeIndexByKey[slot.key] ?? 0;
    if (slot.slides.length <= 1) {
      return 0;
    }
    return Math.max(0, Math.min(rawIndex, slot.slides.length - 1));
  }
  isLoading(slot) {
    return this.loadingByKey[slot.key] ?? false;
  }
  isInteractive() {
    return this.resolvedPresentation() === "list" || this.resolvedState() === "active";
  }
  isBadgeInteractive() {
    return this.card?.badge?.interactive !== false;
  }
  usesFloatingBadge() {
    const layout = this.card?.badge?.layout ?? "between";
    return layout === "floating" || layout === "pair-overlap";
  }
  usesBetweenBadge() {
    const layout = this.card?.badge?.layout ?? "between";
    return layout === "between" || layout === "pair-overlap";
  }
  usesPairOverlapBadge() {
    return (this.card?.badge?.layout ?? "between") === "pair-overlap";
  }
  isBadgeBlinking() {
    return !!this.card?.badge?.blink || this.transientBadgeBlink;
  }
  resolvedSplitCssValue() {
    if (!this.isCompactViewport()) {
      return `${_PairCardComponent.SPLIT_DEFAULT_PERCENT}%`;
    }
    return `${this.splitPercent}%`;
  }
  isSplitEnabled() {
    return this.resolvedPresentation() === "fullscreen" && this.resolvedState() === "active" && this.isCompactViewport();
  }
  isSplitHandleVisible() {
    return this.isSplitEnabled() && this.showSplitHandle;
  }
  isSlotCollapsed(slot, slotIndex) {
    if (!this.isSplitEnabled()) {
      return false;
    }
    if (slotIndex === 0) {
      return this.splitPercent <= 0.1;
    }
    if (slotIndex === 1) {
      return this.splitPercent >= 99.9;
    }
    return !!slot.collapsed;
  }
  onSlotSelect(slot, index, event) {
    event.stopPropagation();
    if (!this.isInteractive()) {
      return;
    }
    const nextIndex = this.clampIndex(index, slot.slides.length);
    this.activeIndexByKey[slot.key] = nextIndex;
    if (this.card?.rowId) {
      _PairCardComponent.activeIndexByRowSlotKey[this.rowSlotKey(this.card.rowId, slot.key)] = nextIndex;
    }
    this.startLoadingPulse(slot.key);
  }
  onBadgePointerDown(event) {
    event.stopPropagation();
  }
  onBadgeClick(event) {
    event.preventDefault();
    event.stopPropagation();
    const card = this.card;
    const badge = card?.badge;
    if (!this.isBadgeInteractive() || badge?.disabled || !card?.rowId || !badge) {
      return;
    }
    if (badge.menuRequest === true) {
      const trigger = event.currentTarget;
      this.badgeMenuOpen = true;
      this.cdr.markForCheck();
      this.menuRequest.emit({
        id: card.rowId,
        card,
        actions: [],
        badge,
        triggerRect: this.resolveBadgeTriggerRect(trigger),
        openUp: this.shouldOpenBadgeMenuUp(trigger),
        closeTrigger: () => this.closeBadgeMenu()
      });
      return;
    }
    this.badgeClick.emit(card.rowId);
  }
  onProfileClick(profileView, event) {
    event.stopPropagation();
    const userId = `${profileView?.userId ?? ""}`.trim();
    if (!userId) {
      return;
    }
    this.emitDetailClick(__spreadProps(__spreadValues({}, profileView), {
      userId
    }));
  }
  emitDetailClick(event) {
    this.detailClick.emit(event);
  }
  consumeClick(event) {
    event.preventDefault();
    event.stopPropagation();
  }
  onSplitHandlePointerDown(event, splitContainerElement) {
    if (!this.isSplitEnabled() || !splitContainerElement) {
      return;
    }
    const bounds = splitContainerElement.getBoundingClientRect();
    if (bounds.width <= 0) {
      return;
    }
    this.splitBounds = { left: bounds.left, width: bounds.width };
    this.splitPointerId = event.pointerId;
    this.splitDragStartClientX = event.clientX;
    this.splitDragStartPercent = this.splitPercent;
    this.isResizing = true;
    this.bindDragListeners();
    if (event.cancelable) {
      event.preventDefault();
    }
    event.stopPropagation();
    const target = event.currentTarget;
    if (target?.setPointerCapture) {
      target.setPointerCapture(event.pointerId);
    }
    this.cdr.markForCheck();
  }
  onSplitHandleTouchStart(event, splitContainerElement) {
    if (!this.isSplitEnabled() || !splitContainerElement) {
      return;
    }
    const touch = event.touches?.[0] ?? event.changedTouches?.[0];
    if (!touch) {
      return;
    }
    const bounds = splitContainerElement.getBoundingClientRect();
    if (bounds.width <= 0) {
      return;
    }
    this.splitBounds = { left: bounds.left, width: bounds.width };
    this.splitPointerId = -1;
    this.splitDragStartClientX = touch.clientX;
    this.splitDragStartPercent = this.splitPercent;
    this.isResizing = true;
    this.bindDragListeners();
    if (event.cancelable) {
      event.preventDefault();
    }
    event.stopPropagation();
    this.cdr.markForCheck();
  }
  syncStateFromCard() {
    const rowId = this.card?.rowId ?? "";
    Object.values(this.loadingTimersByKey).forEach((timer) => clearTimeout(timer));
    Object.keys(this.loadingTimersByKey).forEach((key) => delete this.loadingTimersByKey[key]);
    Object.keys(this.activeIndexByKey).forEach((key) => delete this.activeIndexByKey[key]);
    Object.keys(this.loadingByKey).forEach((key) => delete this.loadingByKey[key]);
    if (this.badgeBlinkTimer) {
      clearTimeout(this.badgeBlinkTimer);
      this.badgeBlinkTimer = null;
    }
    this.resolvedSlots().forEach((slot) => {
      const storedIndex = rowId ? _PairCardComponent.activeIndexByRowSlotKey[this.rowSlotKey(rowId, slot.key)] : void 0;
      const initialIndex = storedIndex ?? this.card?.initialActiveIndexByKey?.[slot.key] ?? 0;
      this.activeIndexByKey[slot.key] = this.clampIndex(initialIndex, slot.slides.length);
    });
    this.splitPercent = this.card?.split?.initialPercent ?? _PairCardComponent.lastCompactSplitPercent;
    this.isResizing = false;
    this.transientBadgeBlink = false;
    this.badgeMenuOpen = false;
    this.stopSplitDrag();
    this.cdr.markForCheck();
  }
  closeBadgeMenu() {
    if (!this.badgeMenuOpen) {
      return;
    }
    this.badgeMenuOpen = false;
    this.cdr.markForCheck();
  }
  shouldOpenBadgeMenuUp(trigger) {
    if (typeof window === "undefined" || !trigger) {
      return false;
    }
    const rect = trigger.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const estimatedMenuHeight = 128;
    return viewportHeight - rect.bottom < estimatedMenuHeight && rect.top > viewportHeight - rect.bottom;
  }
  resolveBadgeTriggerRect(trigger) {
    if (typeof window === "undefined" || !trigger) {
      return null;
    }
    const rect = trigger.getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height
    };
  }
  startLoadingPulse(slotKey) {
    const timer = this.loadingTimersByKey[slotKey];
    if (timer) {
      clearTimeout(timer);
    }
    this.loadingByKey[slotKey] = true;
    this.cdr.markForCheck();
    this.loadingTimersByKey[slotKey] = setTimeout(() => {
      this.loadingByKey[slotKey] = false;
      delete this.loadingTimersByKey[slotKey];
      this.cdr.markForCheck();
    }, _PairCardComponent.IMAGE_PULSE_DURATION_MS);
  }
  startTransientBadgeBlink() {
    if (this.badgeBlinkTimer) {
      clearTimeout(this.badgeBlinkTimer);
      this.badgeBlinkTimer = null;
    }
    this.transientBadgeBlink = false;
    this.cdr.detectChanges();
    const startBlink = () => {
      this.transientBadgeBlink = true;
      this.cdr.detectChanges();
      this.badgeBlinkTimer = setTimeout(() => {
        this.badgeBlinkTimer = null;
        this.transientBadgeBlink = false;
        this.cdr.detectChanges();
      }, _PairCardComponent.BADGE_BLINK_DURATION_MS);
    };
    if (typeof globalThis.requestAnimationFrame === "function") {
      globalThis.requestAnimationFrame(() => startBlink());
      return;
    }
    setTimeout(() => startBlink(), 0);
  }
  clampIndex(index, slideCount) {
    if (slideCount <= 1) {
      return 0;
    }
    return Math.max(0, Math.min(index, slideCount - 1));
  }
  rowSlotKey(rowId, slotKey) {
    return `${rowId}:${slotKey}`;
  }
  isCompactViewport() {
    return typeof globalThis.innerWidth === "number" && globalThis.innerWidth <= 760;
  }
  updateSplitFromDragDelta(clientX) {
    if (!this.splitBounds || this.splitBounds.width <= 0) {
      return;
    }
    const startX = this.splitDragStartClientX;
    const startPercent = this.splitDragStartPercent;
    if (startX === null || startPercent === null) {
      return;
    }
    const deltaPercent = (clientX - startX) / this.splitBounds.width * 100;
    this.splitPercent = Math.max(_PairCardComponent.SPLIT_MIN_PERCENT, Math.min(startPercent + deltaPercent, _PairCardComponent.SPLIT_MAX_PERCENT));
    _PairCardComponent.lastCompactSplitPercent = this.splitPercent;
    this.cdr.detectChanges();
  }
  stopSplitDrag() {
    this.unbindDragListeners();
    this.isResizing = false;
    this.splitPointerId = null;
    this.splitBounds = null;
    this.splitDragStartClientX = null;
    this.splitDragStartPercent = null;
    this.cdr.detectChanges();
  }
  bindDragListeners() {
    if (this.dragListenersBound || typeof globalThis.addEventListener !== "function") {
      return;
    }
    globalThis.addEventListener("pointermove", this.onWindowPointerMove);
    globalThis.addEventListener("pointerup", this.onWindowPointerUp);
    globalThis.addEventListener("pointercancel", this.onWindowPointerCancel);
    globalThis.addEventListener("touchmove", this.onWindowTouchMove, { passive: false });
    globalThis.addEventListener("touchend", this.onWindowTouchEnd);
    globalThis.addEventListener("touchcancel", this.onWindowTouchCancel);
    this.dragListenersBound = true;
  }
  unbindDragListeners() {
    if (!this.dragListenersBound || typeof globalThis.removeEventListener !== "function") {
      return;
    }
    globalThis.removeEventListener("pointermove", this.onWindowPointerMove);
    globalThis.removeEventListener("pointerup", this.onWindowPointerUp);
    globalThis.removeEventListener("pointercancel", this.onWindowPointerCancel);
    globalThis.removeEventListener("touchmove", this.onWindowTouchMove);
    globalThis.removeEventListener("touchend", this.onWindowTouchEnd);
    globalThis.removeEventListener("touchcancel", this.onWindowTouchCancel);
    this.dragListenersBound = false;
  }
  bindFullscreenObserver() {
    if (typeof ResizeObserver === "undefined") {
      return;
    }
    const shell = this.fullscreenShellElementRef?.nativeElement;
    if (!shell) {
      this.disconnectFullscreenObserver();
      return;
    }
    if (!this.fullscreenResizeObserver) {
      this.fullscreenResizeObserver = new ResizeObserver(() => this.updateFullscreenCardSize());
    }
    this.fullscreenResizeObserver.disconnect();
    this.fullscreenResizeObserver.observe(shell);
  }
  disconnectFullscreenObserver() {
    if (!this.fullscreenResizeObserver) {
      return;
    }
    this.fullscreenResizeObserver.disconnect();
    this.fullscreenResizeObserver = null;
  }
  scheduleFullscreenLayoutSync() {
    if (this.resolvedPresentation() !== "fullscreen") {
      this.setFullscreenCardSize(null, null);
      return;
    }
    const sync = () => this.updateFullscreenCardSize();
    if (typeof globalThis.requestAnimationFrame === "function") {
      globalThis.requestAnimationFrame(() => sync());
      return;
    }
    setTimeout(sync, 0);
  }
  updateFullscreenCardSize() {
    if (this.resolvedPresentation() !== "fullscreen") {
      this.setFullscreenCardSize(null, null);
      return;
    }
    const shell = this.fullscreenShellElementRef?.nativeElement;
    if (!shell) {
      return;
    }
    const availableWidth = shell.clientWidth;
    const availableHeight = shell.clientHeight;
    if (availableWidth <= 0 || availableHeight <= 0) {
      return;
    }
    if (this.isCompactViewport()) {
      this.setFullscreenCardSize(`${availableWidth}px`, `${availableHeight}px`);
      return;
    }
    const aspectRatio = _PairCardComponent.FULLSCREEN_ASPECT_RATIO;
    const nextWidth = Math.min(availableWidth, availableHeight * aspectRatio);
    const nextHeight = nextWidth / aspectRatio;
    this.setFullscreenCardSize(`${nextWidth}px`, `${nextHeight}px`);
  }
  setFullscreenCardSize(width, height) {
    if (this.fullscreenCardWidth === width && this.fullscreenCardHeight === height) {
      return;
    }
    this.fullscreenCardWidth = width;
    this.fullscreenCardHeight = height;
    this.cdr.markForCheck();
  }
  static \u0275fac = function PairCardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PairCardComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PairCardComponent, selectors: [["app-pair-card"]], viewQuery: function PairCardComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c02, 5, ElementRef);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.fullscreenShellRef = _t.first);
    }
  }, hostVars: 3, hostBindings: function PairCardComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275attribute("data-card-presentation", ctx.hostPresentationAttr);
      \u0275\u0275styleProp("height", ctx.hostHeight);
    }
  }, inputs: { card: "card", showSplitHandle: "showSplitHandle" }, outputs: { badgeClick: "badgeClick", menuRequest: "menuRequest", detailClick: "detailClick" }, features: [\u0275\u0275NgOnChangesFeature], decls: 4, vars: 1, consts: [["cardBody", ""], ["fullscreenShell", ""], ["splitContainer", ""], [1, "activities-rates-fullscreen"], [1, "activities-rate-profile-card", "activities-row-item"], [1, "activities-rate-profile-card", "activities-row-item", "activities-rates-fullscreen-card"], [4, "ngTemplateOutlet"], [1, "activities-rate-profile-stack", 3, "ngClass"], [1, "activities-rate-pair-inline-grid"], [1, "activities-rate-pair-inline-card", 3, "activities-rate-pair-inline-card-start", "activities-rate-pair-inline-card-end", "activities-rate-pair-inline-card-woman", "activities-rate-pair-inline-card-man", "is-pane-loading", "is-collapsed"], ["type", "button", "aria-label", "Resize pair cards", 1, "activities-rates-pair-fullscreen-resize-handle"], [1, "activities-rate-pair-inline-card"], [1, "image-stack-indicators", "activities-rate-profile-indicators", "activities-rate-pair-inline-indicators"], [1, "activities-rate-pair-inline-layer", 3, "appLazyBgImage"], ["aria-hidden", "true", 1, "activities-rate-image-loader"], [1, "activities-rate-pair-inline-overlay"], [1, "activities-rate-profile-line", "activities-rate-profile-line-primary"], [1, "activities-rate-profile-line", "activities-rate-profile-line-secondary"], [1, "image-stack-hit-area", "activities-rate-profile-hit-area", "activities-rate-pair-inline-hit-area"], [1, "shared-card-status-badge"], [1, "card-image-placeholder"], ["type", "button", 1, "shared-card-profile-view-btn"], ["type", "button", 1, "image-stack-line", 3, "active"], ["type", "button", 1, "image-stack-line", 3, "click"], [1, "image-stack-line", 3, "active"], [1, "image-stack-line"], ["kind", "spinner-ring"], ["type", "button", 1, "image-stack-hit-segment"], ["type", "button", 1, "image-stack-hit-segment", 3, "click"], ["type", "button", 1, "shared-card-profile-view-btn", 3, "click"], ["type", "button", "aria-label", "Resize pair cards", 1, "activities-rates-pair-fullscreen-resize-handle", 3, "pointerdown", "touchstart", "click"], ["aria-hidden", "true", 1, "activities-rates-pair-fullscreen-resize-handle-grip"], ["type", "button", 1, "activities-rate-score-badge", 3, "activities-rate-score-badge-floating", "activities-rate-score-badge-between", "activities-rate-score-badge-floating-pair-overlap", "is-active", "is-pending", "is-disabled", "is-blink", "disabled"], [1, "activities-rate-score-badge", 3, "activities-rate-score-badge-floating", "activities-rate-score-badge-between", "activities-rate-score-badge-floating-pair-overlap", "is-active", "is-pending", "is-disabled", "is-blink"], ["type", "button", 1, "activities-rate-score-badge", 3, "pointerdown", "mousedown", "touchstart", "click", "disabled"], [1, "activities-rate-score-badge"]], template: function PairCardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, PairCardComponent_Conditional_0_Template, 4, 10, "div", 3)(1, PairCardComponent_Conditional_1_Template, 2, 3, "article", 4);
      \u0275\u0275template(2, PairCardComponent_ng_template_2_Template, 7, 13, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.resolvedPresentation() === "fullscreen" ? 0 : 1);
    }
  }, dependencies: [CommonModule, NgClass, NgTemplateOutlet, MatIconModule, MatIcon, LazyBgImageDirective, IndicatorComponent], styles: ['\n[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n  min-height: 0;\n}\n[data-card-presentation=fullscreen][_nghost-%COMP%] {\n  height: 100%;\n}\n.activities-rate-profile-card[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  min-height: 264px;\n  border: 1px solid rgba(34, 54, 84, 0.24);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      #1b2c45 0%,\n      #132238 100%);\n  overflow: hidden;\n  box-sizing: border-box;\n  touch-action: pan-y;\n}\n.activities-rate-profile-card.activities-row-item[_ngcontent-%COMP%] {\n  cursor: default;\n  transform: none;\n  transition: none;\n  animation: none;\n  -webkit-tap-highlight-color: transparent;\n}\n.activities-rate-profile-card.activities-row-item[_ngcontent-%COMP%]:hover, \n.activities-rate-profile-card.activities-row-item[_ngcontent-%COMP%]:active {\n  transform: none;\n  filter: none;\n}\n.activities-rate-profile-stack[_ngcontent-%COMP%] {\n  position: relative;\n  min-height: 264px;\n  height: 100%;\n}\n.activities-rate-profile-stack.activities-rate-profile-stack-pair-inline[_ngcontent-%COMP%] {\n  min-height: 264px;\n}\n.activities-rate-profile-stack.activities-rate-profile-stack-pair-fullscreen[_ngcontent-%COMP%] {\n  min-height: 100%;\n  height: 100%;\n}\n.activities-rate-pair-inline-grid[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: clamp(0.28rem, 0.8vw, 0.52rem);\n  padding: 0.42rem;\n}\n.activities-rate-pair-inline-grid[_ngcontent-%COMP%]:not(.activities-rate-pair-fullscreen-grid) {\n  gap: clamp(0.08rem, 0.32vw, 0.16rem);\n}\n.activities-rate-pair-inline-card[_ngcontent-%COMP%] {\n  position: relative;\n  min-width: 0;\n  border-radius: 12px;\n  overflow: hidden;\n  border: 1px solid rgba(255, 255, 255, 0.28);\n  box-shadow: 0 10px 22px rgba(6, 18, 36, 0.3);\n}\n.activities-rate-pair-inline-layer[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  min-height: 0;\n  background-size: var(--rate-card-image-fit, cover);\n  background-position: center;\n  background-repeat: no-repeat;\n}\n.activities-rate-image-loader[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  z-index: 2;\n  display: grid;\n  place-items: center;\n  pointer-events: none;\n  opacity: 0;\n  transition: opacity 120ms ease;\n}\n.activities-rate-image-loader[_ngcontent-%COMP%]   app-indicator[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n}\n.activities-rate-pair-inline-layer.lazy-bg-loading[_ngcontent-%COMP%]   .activities-rate-image-loader[_ngcontent-%COMP%], \n.activities-rate-profile-layer.lazy-bg-loading[_ngcontent-%COMP%]   .activities-rate-image-loader[_ngcontent-%COMP%] {\n  opacity: 1;\n}\n.activities-rate-pair-inline-layer.lazy-bg-loaded[_ngcontent-%COMP%]   .activities-rate-image-loader[_ngcontent-%COMP%], \n.activities-rate-profile-layer.lazy-bg-loaded[_ngcontent-%COMP%]   .activities-rate-image-loader[_ngcontent-%COMP%], \n.activities-rate-pair-inline-layer.lazy-bg-error[_ngcontent-%COMP%]   .activities-rate-image-loader[_ngcontent-%COMP%], \n.activities-rate-profile-layer.lazy-bg-error[_ngcontent-%COMP%]   .activities-rate-image-loader[_ngcontent-%COMP%] {\n  opacity: 0;\n}\n.activities-rate-pair-inline-layer[_ngcontent-%COMP%]::after, \n.activities-rate-profile-layer[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  z-index: 0;\n  pointer-events: none;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(12, 22, 36, 0.04) 0%,\n      rgba(7, 16, 28, 0.62) 66%,\n      rgba(7, 16, 28, 0.84) 100%);\n}\n.activities-rate-pair-inline-layer[_ngcontent-%COMP%]   .card-image-placeholder[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 4;\n}\n.activities-rate-pair-inline-card.is-pane-loading[_ngcontent-%COMP%]   .activities-rate-profile-indicators[_ngcontent-%COMP%]   .image-stack-line.active[_ngcontent-%COMP%], \n.activities-rate-profile-stack.is-pane-loading[_ngcontent-%COMP%]   .activities-rate-profile-indicators[_ngcontent-%COMP%]   .image-stack-line.active[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_activities-rate-pane-loading-pulse 500ms ease;\n}\n@keyframes _ngcontent-%COMP%_activities-rate-pane-loading-pulse {\n  0% {\n    transform: scaleX(0.84);\n    opacity: 0.58;\n  }\n  100% {\n    transform: scaleX(1);\n    opacity: 1;\n  }\n}\n.activities-rate-pair-inline-label[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.64rem;\n  left: 0.52rem;\n  z-index: 5;\n  border-radius: 999px;\n  border: 1px solid rgba(212, 229, 249, 0.42);\n  color: #f5f9ff;\n  font-size: 0.66rem;\n  font-weight: 700;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.16rem 0.42rem;\n  background: rgba(8, 18, 35, 0.62);\n}\n.activities-rate-pair-inline-card-woman[_ngcontent-%COMP%]   .activities-rate-pair-inline-label[_ngcontent-%COMP%] {\n  background: rgba(109, 42, 118, 0.64);\n}\n.activities-rate-pair-inline-card-man[_ngcontent-%COMP%]   .activities-rate-pair-inline-label[_ngcontent-%COMP%] {\n  background: rgba(36, 74, 127, 0.66);\n}\n.shared-card-status-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.64rem;\n  right: 0.56rem;\n  z-index: 80;\n  max-width: calc(100% - 1.24rem);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  border-radius: 999px;\n  border: 1px solid rgba(148, 225, 182, 0.56);\n  background: rgba(8, 34, 18, 0.74);\n  color: #e9ffef;\n  font-size: 0.68rem;\n  font-weight: 700;\n  letter-spacing: 0.01em;\n  line-height: 1;\n  padding: 0.17rem 0.5rem;\n  pointer-events: none;\n}\n.shared-card-context-avatar-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.68rem;\n  left: 0.62rem;\n  z-index: 30;\n  width: 2.08rem;\n  height: 2.08rem;\n  display: inline-grid;\n  place-items: center;\n  border: 2px solid rgba(255, 255, 255, 0.84);\n  border-radius: 999px;\n  background: rgba(8, 18, 35, 0.74);\n  color: #f7fbff;\n  box-shadow: 0 7px 16px rgba(4, 12, 26, 0.36), inset 0 0 0 1px rgba(15, 35, 58, 0.26);\n  overflow: visible;\n  pointer-events: auto;\n  touch-action: manipulation;\n}\nbutton.shared-card-context-avatar-badge[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n.shared-card-context-avatar-badge[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  border-radius: inherit;\n}\n.shared-card-context-avatar-badge[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  font-size: 0.68rem;\n  font-weight: 900;\n  line-height: 1;\n}\n.shared-card-context-avatar-badge[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -0.74rem;\n  right: -0.72rem;\n  z-index: 2;\n  min-width: 1rem;\n  height: 1rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border: 1px solid rgba(255, 255, 255, 0.88);\n  border-radius: 999px;\n  background: #d94c4c;\n  color: #fff;\n  font-size: 0.54rem;\n  font-style: normal;\n  font-weight: 900;\n  line-height: 1;\n  padding: 0 0.16rem;\n  box-shadow: 0 4px 10px rgba(77, 12, 24, 0.32);\n}\n.activities-rate-pair-inline-overlay[_ngcontent-%COMP%], \n.activities-rate-profile-overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 3;\n  display: grid;\n  gap: 0.14rem;\n}\n.activities-rate-pair-inline-overlay[_ngcontent-%COMP%] {\n  padding: 0.7rem 0.72rem 0.68rem;\n}\n.activities-rate-pair-inline-card[_ngcontent-%COMP%]   .activities-rate-profile-indicators.activities-rate-pair-inline-indicators[_ngcontent-%COMP%] {\n  top: 0.28rem;\n  left: 0.34rem;\n  right: 0.34rem;\n  padding: 0.12rem 0.24rem;\n  border-radius: 7px;\n}\n.activities-rate-pair-inline-hit-area[_ngcontent-%COMP%] {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 4;\n}\n.activities-rate-profile-layer[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  z-index: 1;\n  border-radius: 14px;\n  overflow: hidden;\n  background-size: var(--rate-card-image-fit, cover);\n  background-position: center;\n  background-repeat: no-repeat;\n  border: 1px solid rgba(255, 255, 255, 0.26);\n  box-shadow: 0 12px 24px rgba(6, 18, 36, 0.34);\n}\n[data-card-presentation=list][_nghost-%COMP%]   .activities-rate-pair-inline-layer[_ngcontent-%COMP%], \n[data-card-presentation=list][_nghost-%COMP%]   .activities-rate-profile-layer[_ngcontent-%COMP%] {\n  background-size: contain;\n}\n.activities-rate-profile-layer-active[_ngcontent-%COMP%] {\n  pointer-events: none;\n}\n.activities-rate-profile-indicators[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.36rem;\n  left: 0.52rem;\n  right: 0.52rem;\n  z-index: 10;\n  padding: 0.16rem 0.34rem;\n  border-radius: 8px;\n  background: rgba(10, 18, 31, 0.38);\n  gap: 5px;\n}\n.activities-rate-profile-indicators[_ngcontent-%COMP%]   .image-stack-line[_ngcontent-%COMP%] {\n  height: 4px;\n  border: 1px solid rgba(28, 42, 64, 0.36);\n  background: rgba(167, 177, 192, 0.9);\n  opacity: 1;\n}\n.activities-rate-profile-indicators[_ngcontent-%COMP%]   .image-stack-line.active[_ngcontent-%COMP%] {\n  border-color: rgba(248, 252, 255, 0.86);\n  background: rgba(250, 252, 255, 0.98);\n  box-shadow: 0 0 0 1px rgba(10, 20, 34, 0.12);\n}\n.activities-rate-profile-hit-area[_ngcontent-%COMP%] {\n  top: 0.2rem;\n  left: 0.2rem;\n  right: 0.2rem;\n  bottom: 0.2rem;\n  z-index: 4;\n}\n.shared-card-profile-view-btn[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 0.56rem;\n  bottom: 0.56rem;\n  z-index: 18;\n  width: 2.22rem;\n  height: 2.22rem;\n  border: 1px solid rgba(41, 99, 143, 0.28);\n  border-radius: 999px;\n  background: rgba(232, 246, 251, 0.94);\n  color: #226d83;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  box-shadow: 0 8px 18px rgba(6, 24, 44, 0.2);\n  cursor: pointer;\n  pointer-events: auto;\n  transition:\n    background 0.16s ease,\n    border-color 0.16s ease,\n    transform 0.16s ease;\n  -webkit-tap-highlight-color: transparent;\n}\n.shared-card-profile-view-btn[_ngcontent-%COMP%]:hover, \n.shared-card-profile-view-btn[_ngcontent-%COMP%]:focus-visible {\n  background: rgba(218, 241, 249, 0.98);\n  border-color: rgba(31, 124, 153, 0.44);\n  transform: translateY(-1px);\n  outline: none;\n}\n.shared-card-profile-view-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 1.34rem;\n  height: 1.34rem;\n  font-size: 1.34rem;\n  line-height: 1.34rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.activities-rate-pair-inline-card[_ngcontent-%COMP%]   .shared-card-profile-view-btn[_ngcontent-%COMP%] {\n  right: 0.44rem;\n  bottom: 0.44rem;\n  width: 2rem;\n  height: 2rem;\n}\n.activities-rate-profile-overlay[_ngcontent-%COMP%] {\n  padding: 0.74rem 0.8rem 0.72rem;\n}\n.activities-rate-profile-line[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #f5f9ff !important;\n  text-shadow: 0 2px 9px rgba(2, 8, 16, 0.96);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.activities-rate-profile-line-primary[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  font-weight: 800;\n}\n.activities-rate-profile-line-secondary[_ngcontent-%COMP%] {\n  font-size: 0.76rem;\n  font-weight: 700;\n  color: rgba(237, 245, 255, 0.98) !important;\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-given[_ngcontent-%COMP%]   .activities-rate-profile-layer[_ngcontent-%COMP%] {\n  border-color: rgba(63, 136, 208, 0.52);\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-received[_ngcontent-%COMP%]   .activities-rate-profile-layer[_ngcontent-%COMP%] {\n  border-color: rgba(53, 160, 114, 0.52);\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-mutual[_ngcontent-%COMP%]   .activities-rate-profile-layer[_ngcontent-%COMP%] {\n  border-color: rgba(176, 121, 48, 0.52);\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-met[_ngcontent-%COMP%]   .activities-rate-profile-layer[_ngcontent-%COMP%] {\n  border-color: rgba(104, 118, 139, 0.52);\n}\n.activities-rate-score-badge[_ngcontent-%COMP%] {\n  min-height: 26px;\n  border: 2px solid rgba(187, 136, 22, 0.58);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #fff9e9 0%,\n      #fff1cb 100%);\n  color: #9f6915;\n  font-size: 0.76rem;\n  font-weight: 800;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n  padding: 0.16rem 0.56rem;\n  cursor: pointer;\n  transform: translateY(0) scale(1);\n  box-shadow: inset 0 0 0 1px rgba(255, 245, 215, 0.72), 0 0 0 rgba(226, 171, 47, 0);\n  transition:\n    transform 0.16s ease,\n    box-shadow 0.2s ease,\n    border-color 0.2s ease,\n    filter 0.2s ease;\n}\n.activities-rate-score-badge[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n  font-size: 14px;\n  line-height: 14px;\n}\n.activities-rate-score-badge-floating[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.6rem;\n  right: 0.3rem;\n  z-index: 24;\n  min-width: 68px;\n  justify-content: center;\n}\n.activities-rate-score-badge-between[_ngcontent-%COMP%] {\n  --activities-rate-badge-between-y: -50%;\n  position: absolute;\n  left: 50%;\n  right: auto;\n  top: 50%;\n  z-index: 24;\n  min-width: 68px;\n  width: max-content;\n  max-width: calc(100% - 0.8rem);\n  justify-content: center;\n  white-space: nowrap;\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n  transition:\n    box-shadow 0.2s ease,\n    border-color 0.2s ease,\n    filter 0.2s ease;\n}\n.activities-rate-profile-stack-pair-inline[_ngcontent-%COMP%]   .activities-rate-score-badge-between[_ngcontent-%COMP%] {\n  --activities-rate-badge-between-y: 0;\n  top: auto;\n  bottom: clamp(3.2rem, 18%, 4.2rem);\n  left: 50% !important;\n  right: auto !important;\n  transform: translate(-50%, var(--activities-rate-badge-between-y)) !important;\n}\n.activities-rate-profile-stack-pair-inline[_ngcontent-%COMP%]   .activities-rate-score-badge-between[_ngcontent-%COMP%]:not(.is-disabled):hover, \n.activities-rate-profile-stack-pair-inline[_ngcontent-%COMP%]   .activities-rate-score-badge-between[_ngcontent-%COMP%]:not(.is-disabled):active, \n.activities-rate-profile-stack-pair-inline[_ngcontent-%COMP%]   .activities-rate-score-badge-between.is-active[_ngcontent-%COMP%]:not(.is-disabled), \n.activities-rate-profile-stack-pair-inline[_ngcontent-%COMP%]   .activities-rate-score-badge-between.is-active.is-pending[_ngcontent-%COMP%]:not(.is-disabled), \n.activities-rate-profile-stack-pair-inline[_ngcontent-%COMP%]   .activities-rate-score-badge-between.is-disabled[_ngcontent-%COMP%] {\n  left: 50% !important;\n  right: auto !important;\n  transform: translate(-50%, 0) !important;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-score-badge-floating.activities-rate-score-badge-floating-pair-overlap[_ngcontent-%COMP%] {\n  --activities-rate-badge-between-y: 0;\n  top: auto;\n  bottom: clamp(3.2rem, 11%, 4.6rem);\n  left: var(--activities-pair-split, 50%);\n  right: auto;\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n  min-width: 68px;\n  width: max-content;\n  max-width: calc(100% - 0.8rem);\n  justify-content: center;\n  white-space: nowrap;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-score-badge-floating.activities-rate-score-badge-floating-pair-overlap.is-active[_ngcontent-%COMP%]:not(.is-disabled), \n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-score-badge-floating.activities-rate-score-badge-floating-pair-overlap[_ngcontent-%COMP%]:not(.is-disabled):active {\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n@media (hover: hover) and (pointer: fine) {\n  button.activities-rate-score-badge[_ngcontent-%COMP%]:not(.is-disabled):hover {\n    transform: translateY(-1px) scale(1.03);\n    box-shadow: 0 6px 14px rgba(203, 150, 34, 0.28);\n    filter: saturate(1.05);\n  }\n}\nbutton.activities-rate-score-badge[_ngcontent-%COMP%]:not(.is-disabled):active {\n  transform: translateY(0) scale(0.96);\n  box-shadow: 0 2px 8px rgba(146, 105, 16, 0.22);\n}\nbutton.activities-rate-score-badge-between[_ngcontent-%COMP%]:not(.is-disabled):hover, \nbutton.activities-rate-score-badge-between[_ngcontent-%COMP%]:not(.is-disabled):active {\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n.activities-rate-score-badge.is-pending[_ngcontent-%COMP%] {\n  border-color: rgba(187, 56, 71, 0.62);\n  background:\n    linear-gradient(\n      180deg,\n      #ffe9ed 0%,\n      #ffd9df 100%);\n  color: #b63545;\n}\n.activities-rate-score-badge.is-active[_ngcontent-%COMP%]:not(.is-disabled) {\n  border-color: rgba(206, 148, 25, 0);\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ca 0%,\n      #ffe7a8 100%);\n  color: #8b560f;\n  box-shadow: none;\n  transform: translateY(0) scale(1);\n}\n.activities-rate-score-badge-between.is-active[_ngcontent-%COMP%]:not(.is-disabled), \n.activities-rate-score-badge-between.is-active.is-pending[_ngcontent-%COMP%]:not(.is-disabled) {\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n.activities-rate-score-badge.is-active.is-pending[_ngcontent-%COMP%]:not(.is-disabled) {\n  border-color: rgba(188, 53, 72, 0);\n  background:\n    linear-gradient(\n      180deg,\n      #ffdce4 0%,\n      #ffc8d3 100%);\n  color: #9d2232;\n  box-shadow: none;\n}\n@media (hover: hover) and (pointer: fine) {\n  button.activities-rate-score-badge.is-active[_ngcontent-%COMP%]:not(.is-disabled):hover {\n    border-color: rgba(206, 148, 25, 0.76);\n    box-shadow: 0 0 0 2px rgba(255, 244, 201, 0.68), 0 9px 16px rgba(170, 117, 20, 0.26);\n  }\n  button.activities-rate-score-badge.is-active.is-pending[_ngcontent-%COMP%]:not(.is-disabled):hover {\n    border-color: rgba(188, 53, 72, 0.72);\n    box-shadow: 0 0 0 2px rgba(255, 230, 236, 0.72), 0 9px 16px rgba(170, 48, 68, 0.24);\n  }\n}\n.activities-rate-score-badge.is-blink[_ngcontent-%COMP%]:not(.is-disabled) {\n  animation: _ngcontent-%COMP%_game-rating-stars-blink 0.42s ease-in-out 1;\n}\n@keyframes _ngcontent-%COMP%_game-rating-stars-blink {\n  0%, 100% {\n    filter: brightness(1);\n  }\n  50% {\n    filter: brightness(1.12) saturate(1.1);\n  }\n}\n.activities-rate-score-badge.is-disabled[_ngcontent-%COMP%] {\n  border-color: rgba(111, 123, 140, 0.52);\n  background:\n    linear-gradient(\n      180deg,\n      #f4f6f9 0%,\n      #e8edf3 100%);\n  color: #617085;\n  cursor: default;\n  transform: none;\n  box-shadow: none;\n  transition: none;\n}\n.activities-rate-score-badge-between.is-disabled[_ngcontent-%COMP%] {\n  right: auto;\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n.activities-rate-score-badge[disabled][_ngcontent-%COMP%], \nspan.activities-rate-score-badge[_ngcontent-%COMP%] {\n  pointer-events: none;\n}\nspan.activities-rate-score-badge[_ngcontent-%COMP%] {\n  cursor: default;\n  transition: none;\n}\n.image-stack-indicators[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -0.1rem;\n  left: 0.25rem;\n  right: 0.25rem;\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));\n  gap: 4px;\n  width: auto !important;\n}\n.image-stack-hit-area[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 10px;\n  left: 10px;\n  right: 10px;\n  bottom: 10px;\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));\n  gap: 4px;\n  z-index: 2;\n}\n.image-stack-hit-segment[_ngcontent-%COMP%] {\n  border: 0;\n  background: transparent;\n  padding: 0;\n  cursor: pointer;\n  width: 100%;\n  height: 100%;\n}\n.card-image-placeholder[_ngcontent-%COMP%] {\n  width: 84px;\n  height: 84px;\n  border-radius: 50%;\n  background:\n    linear-gradient(\n      145deg,\n      #4f7cff,\n      #7a3eff 60%,\n      #f04eab);\n  color: #fff;\n  font-weight: 800;\n  font-size: 1.72rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  letter-spacing: 0.03em;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  justify-content: center;\n  align-items: flex-start;\n  width: 100%;\n  height: 100%;\n  min-width: 0;\n  min-height: 0;\n}\n.activities-rates-fullscreen-card[_ngcontent-%COMP%] {\n  margin: 0;\n  flex: 0 0 auto;\n  touch-action: pan-y;\n  width: 100%;\n  height: 100%;\n  max-width: 100%;\n  max-height: 100%;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .image-stack-line[_ngcontent-%COMP%], \n.activities-rates-fullscreen[_ngcontent-%COMP%]   .image-stack-hit-segment[_ngcontent-%COMP%] {\n  pointer-events: auto;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-profile-card[_ngcontent-%COMP%] {\n  min-height: 0;\n  background: #e6edf7;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-profile-stack[_ngcontent-%COMP%] {\n  min-height: 0;\n  height: 100%;\n  background: #d7e1ef;\n}\n.activities-rates-fullscreen-card-active[_ngcontent-%COMP%]   .activities-rate-profile-layer[_ngcontent-%COMP%] {\n  background-color: #d3ddea;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-profile-stack.activities-rate-profile-stack-pair-fullscreen[_ngcontent-%COMP%] {\n  width: 100%;\n  margin-inline: 0;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-profile-stack.activities-rate-profile-stack-pair-fullscreen.activities-rate-profile-stack-pair[_ngcontent-%COMP%] {\n  border-radius: 14px;\n  border: 1px solid rgba(34, 54, 84, 0.24);\n  background:\n    linear-gradient(\n      180deg,\n      #1b2c45 0%,\n      #132238 100%);\n  overflow: hidden;\n}\n@media (min-width: 761px) {\n  .activities-rates-fullscreen-card[_ngcontent-%COMP%] {\n    width: calc(100% - var(--smart-list-pagination-arrow-size, 2.2rem)) !important;\n  }\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-pair-fullscreen-grid[_ngcontent-%COMP%] {\n  --activities-pair-gap: clamp(0.28rem, 0.8vw, 0.52rem);\n  --activities-pair-pad: 0.42rem;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  grid-template-rows: minmax(0, 1fr);\n  gap: var(--activities-pair-gap);\n  padding: var(--activities-pair-pad);\n  box-sizing: border-box;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-pair-fullscreen-grid[_ngcontent-%COMP%]   .activities-rate-pair-inline-card[_ngcontent-%COMP%] {\n  min-height: 0;\n  box-sizing: border-box;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-pair-fullscreen-grid[_ngcontent-%COMP%]   .activities-rate-pair-inline-card.is-collapsed[_ngcontent-%COMP%] {\n  border-color: transparent;\n  box-shadow: none;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-pair-fullscreen-grid[_ngcontent-%COMP%]   .activities-rate-pair-inline-card.is-collapsed[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%] {\n  opacity: 0;\n  pointer-events: none;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-pair-fullscreen-grid[_ngcontent-%COMP%]   .activities-rate-pair-inline-indicators[_ngcontent-%COMP%] {\n  top: 0.28rem;\n  left: 0.38rem;\n  right: 0.38rem;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-pair-fullscreen-grid[_ngcontent-%COMP%]   .activities-rate-pair-inline-overlay[_ngcontent-%COMP%] {\n  padding: 0.74rem 0.8rem 0.72rem;\n}\n.activities-rates-pair-fullscreen-resize-handle[_ngcontent-%COMP%] {\n  display: none;\n}\n.activities-rates-pair-fullscreen-resize-handle-grip[_ngcontent-%COMP%] {\n  display: block;\n  pointer-events: none;\n}\n@media (max-width: 760px) {\n  .activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-pair-fullscreen-grid[_ngcontent-%COMP%] {\n    --activities-pair-gap: 0 !important;\n    --activities-pair-pad: 0.3rem !important;\n    display: flex;\n    gap: 0 !important;\n    padding: var(--activities-pair-pad) !important;\n    overflow: hidden;\n  }\n  .activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-pair-fullscreen-grid[_ngcontent-%COMP%]::after {\n    content: "";\n    position: absolute;\n    top: var(--activities-pair-pad);\n    bottom: var(--activities-pair-pad);\n    left: var(--activities-pair-split);\n    width: 1px;\n    transform: translateX(-0.5px);\n    background: rgba(34, 54, 84, 0.58);\n    pointer-events: none;\n    z-index: 22;\n  }\n  .activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-pair-fullscreen-grid[_ngcontent-%COMP%]   .activities-rate-pair-inline-card[_ngcontent-%COMP%] {\n    min-width: 0;\n    max-width: 100%;\n  }\n  .activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-pair-fullscreen-grid[_ngcontent-%COMP%]   .activities-rate-pair-inline-card-start[_ngcontent-%COMP%] {\n    flex: 0 0 var(--activities-pair-split);\n    width: auto;\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n    border-right-width: 0;\n  }\n  .activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-pair-fullscreen-grid[_ngcontent-%COMP%]   .activities-rate-pair-inline-card-end[_ngcontent-%COMP%] {\n    flex: 0 0 calc(100% - var(--activities-pair-split));\n    width: auto;\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n    border-left-width: 0;\n  }\n  .activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-score-badge-floating.activities-rate-score-badge-floating-pair-overlap[_ngcontent-%COMP%] {\n    left: 50%;\n    bottom: 4rem;\n    z-index: 28;\n    pointer-events: none;\n  }\n  .activities-rates-pair-fullscreen-resize-handle[_ngcontent-%COMP%] {\n    position: absolute;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    pointer-events: auto;\n    left: var(--activities-pair-split);\n    top: var(--activities-pair-pad);\n    bottom: var(--activities-pair-pad);\n    width: 36px;\n    transform: translateX(-50%);\n    border: 0;\n    padding: 0;\n    margin: 0;\n    background: transparent;\n    z-index: 40;\n    touch-action: none;\n    cursor: ew-resize;\n    -webkit-tap-highlight-color: transparent;\n  }\n  .activities-rates-pair-fullscreen-resize-handle[_ngcontent-%COMP%]::before {\n    content: "";\n    position: absolute;\n    inset: -12px -8px;\n  }\n  .activities-rates-pair-fullscreen-resize-handle-grip[_ngcontent-%COMP%] {\n    width: 4px;\n    height: 36%;\n    min-height: 52px;\n    border-radius: 999px;\n    border: 1px solid rgba(166, 196, 232, 0.74);\n    background:\n      linear-gradient(\n        180deg,\n        rgba(241, 247, 255, 0.94) 0%,\n        rgba(218, 232, 249, 0.9) 100%);\n    box-shadow: 0 0 0 1px rgba(9, 22, 40, 0.14), 0 8px 14px rgba(6, 18, 36, 0.34);\n    pointer-events: none;\n  }\n  .activities-rate-profile-stack.activities-rate-profile-stack-pair-fullscreen.is-resizing[_ngcontent-%COMP%]   .activities-rates-pair-fullscreen-resize-handle-grip[_ngcontent-%COMP%] {\n    background:\n      linear-gradient(\n        180deg,\n        rgba(255, 247, 227, 0.96) 0%,\n        rgba(255, 229, 165, 0.9) 100%);\n    border-color: rgba(218, 168, 51, 0.86);\n  }\n}\n/*# sourceMappingURL=pair-card.component.css.map */'], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PairCardComponent, [{
    type: Component,
    args: [{ selector: "app-pair-card", standalone: true, imports: [CommonModule, MatIconModule, LazyBgImageDirective, IndicatorComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: `@if (resolvedPresentation() === 'fullscreen') {
  <div #fullscreenShell class="activities-rates-fullscreen">
    <article
      class="activities-rate-profile-card activities-row-item activities-rates-fullscreen-card"
      [class.activities-rates-fullscreen-card-active]="resolvedState() === 'active'"
      [class.activities-rates-fullscreen-card-leaving]="resolvedState() === 'leaving'"
      [attr.data-activity-rate-row-id]="card?.rowId"
      [style.width]="fullscreenCardWidth"
      [style.height]="fullscreenCardHeight"
      >
      <ng-container *ngTemplateOutlet="cardBody"></ng-container>
    </article>
  </div>
} @else {
  <article
    class="activities-rate-profile-card activities-row-item"
    [attr.data-activity-rate-row-id]="card?.rowId"
    [attr.data-group-label]="card?.groupLabel"
    >
    <ng-container *ngTemplateOutlet="cardBody"></ng-container>
  </article>
}


<ng-template #cardBody>
  <div
    class="activities-rate-profile-stack"
    [class.activities-rate-profile-stack-pair-inline]="resolvedPresentation() === 'list'"
    [class.activities-rate-profile-stack-pair-fullscreen]="resolvedPresentation() === 'fullscreen'"
    [class.is-resizing]="isResizing"
    [ngClass]="resolvedStackClasses()"
    [style.--activities-pair-split]="resolvedSplitCssValue()"
    >
    <div
      #splitContainer
      class="activities-rate-pair-inline-grid"
      [class.activities-rate-pair-fullscreen-grid]="resolvedPresentation() === 'fullscreen'"
      >
      @for (slot of resolvedSlots(); track trackBySlot($index, slot); let slotIndex = $index) {
        <div
          class="activities-rate-pair-inline-card"
          [class.activities-rate-pair-inline-card-start]="slotIndex === 0"
          [class.activities-rate-pair-inline-card-end]="slotIndex === 1"
          [class.activities-rate-pair-inline-card-woman]="slot.tone === 'woman'"
          [class.activities-rate-pair-inline-card-man]="slot.tone === 'man'"
          [class.is-pane-loading]="isLoading(slot)"
          [class.is-collapsed]="isSlotCollapsed(slot, slotIndex)"
          >
          @if (slot.slides.length > 1) {
            <div class="image-stack-indicators activities-rate-profile-indicators activities-rate-pair-inline-indicators">
              @if (isInteractive()) {
                @for (slide of slot.slides; track trackBySlide($index, slide); let imageIndex = $index) {
                  <button
                    type="button"
                    class="image-stack-line"
                    [class.active]="imageIndex === activeIndex(slot)"
                    (click)="onSlotSelect(slot, imageIndex, $event)"
                    [attr.aria-label]="'Select ' + slot.label.toLowerCase() + ' profile image'"
                  ></button>
                }
              } @else {
                @for (slide of slot.slides; track trackBySlide($index, slide); let imageIndex = $index) {
                  <span
                    class="image-stack-line"
                    [class.active]="imageIndex === activeIndex(slot)"
                  ></span>
                }
              }
            </div>
          }
          <div class="activities-rate-pair-inline-layer" [appLazyBgImage]="currentSlideImageUrl(slot)">
            @if (currentSlideImageUrl(slot)) {
              <span class="activities-rate-image-loader" aria-hidden="true">
                <app-indicator kind="spinner-ring"></app-indicator>
              </span>
            }
            <div class="activities-rate-pair-inline-overlay">
              <p class="activities-rate-profile-line activities-rate-profile-line-primary">{{ currentSlide(slot)?.primaryLine }}</p>
              <p class="activities-rate-profile-line activities-rate-profile-line-secondary">{{ currentSlide(slot)?.secondaryLine }}</p>
            </div>
          </div>
          @if (isInteractive() && slot.slides.length > 1) {
            <div class="image-stack-hit-area activities-rate-profile-hit-area activities-rate-pair-inline-hit-area">
              @for (slide of slot.slides; track trackBySlide($index, slide); let imageIndex = $index) {
                <button
                  type="button"
                  class="image-stack-hit-segment"
                  (click)="onSlotSelect(slot, imageIndex, $event)"
                  [attr.aria-label]="'Select ' + slot.label.toLowerCase() + ' profile image'"
                ></button>
              }
            </div>
          }
          @if (slot.statusBadgeLabel; as statusBadge) {
            <span class="shared-card-status-badge">
              {{ statusBadge }}
            </span>
          }
          @if (!currentSlide(slot)?.imageUrl) {
            <span class="card-image-placeholder">
              {{ currentSlide(slot)?.placeholderLabel }}
            </span>
          }
          @if (slot.profileView; as profileView) {
            <button
              type="button"
              class="shared-card-profile-view-btn"
              (click)="onProfileClick(profileView, $event)"
              [attr.aria-label]="'View ' + (profileView.label || slot.label + ' profile')"
              >
              <mat-icon>visibility</mat-icon>
            </button>
          }
        </div>
      }

      @if (isSplitHandleVisible()) {
        <button
          type="button"
          class="activities-rates-pair-fullscreen-resize-handle"
          aria-label="Resize pair cards"
          (pointerdown)="onSplitHandlePointerDown($event, splitContainer)"
          (touchstart)="onSplitHandleTouchStart($event, splitContainer)"
          (click)="consumeClick($event)"
          >
          <span class="activities-rates-pair-fullscreen-resize-handle-grip" aria-hidden="true"></span>
        </button>
      }
    </div>

    @if (card?.badge; as cardBadge) {
      @if (isBadgeInteractive()) {
        <button
          type="button"
          class="activities-rate-score-badge"
          [class.activities-rate-score-badge-floating]="usesFloatingBadge()"
          [class.activities-rate-score-badge-between]="usesBetweenBadge()"
          [class.activities-rate-score-badge-floating-pair-overlap]="usesPairOverlapBadge()"
          [class.is-active]="cardBadge.active || badgeMenuOpen"
          [class.is-pending]="cardBadge.pending"
          [class.is-disabled]="cardBadge.disabled"
          [class.is-blink]="isBadgeBlinking()"
          [disabled]="cardBadge.disabled"
          [attr.aria-label]="cardBadge.ariaLabel"
          (pointerdown)="onBadgePointerDown($event)"
          (mousedown)="onBadgePointerDown($event)"
          (touchstart)="onBadgePointerDown($event)"
          (click)="onBadgeClick($event)"
          >
          <mat-icon>star</mat-icon>
          <span>{{ cardBadge.label }}</span>
        </button>
      } @else {
        <span
          class="activities-rate-score-badge"
          [class.activities-rate-score-badge-floating]="usesFloatingBadge()"
          [class.activities-rate-score-badge-between]="usesBetweenBadge()"
          [class.activities-rate-score-badge-floating-pair-overlap]="usesPairOverlapBadge()"
          [class.is-active]="cardBadge.active"
          [class.is-pending]="cardBadge.pending"
          [class.is-disabled]="cardBadge.disabled"
          [class.is-blink]="isBadgeBlinking()"
          [attr.aria-label]="cardBadge.ariaLabel"
          >
          <mat-icon>star</mat-icon>
          <span>{{ cardBadge.label }}</span>
        </span>
      }
    }
  </div>
</ng-template>
`, styles: ['/* src/app/shared/ui/components/core/smart-list/card/pair-card/pair-card.component.scss */\n:host {\n  display: block;\n  width: 100%;\n  min-height: 0;\n}\n:host([data-card-presentation=fullscreen]) {\n  height: 100%;\n}\n.activities-rate-profile-card {\n  position: relative;\n  width: 100%;\n  min-height: 264px;\n  border: 1px solid rgba(34, 54, 84, 0.24);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      #1b2c45 0%,\n      #132238 100%);\n  overflow: hidden;\n  box-sizing: border-box;\n  touch-action: pan-y;\n}\n.activities-rate-profile-card.activities-row-item {\n  cursor: default;\n  transform: none;\n  transition: none;\n  animation: none;\n  -webkit-tap-highlight-color: transparent;\n}\n.activities-rate-profile-card.activities-row-item:hover,\n.activities-rate-profile-card.activities-row-item:active {\n  transform: none;\n  filter: none;\n}\n.activities-rate-profile-stack {\n  position: relative;\n  min-height: 264px;\n  height: 100%;\n}\n.activities-rate-profile-stack.activities-rate-profile-stack-pair-inline {\n  min-height: 264px;\n}\n.activities-rate-profile-stack.activities-rate-profile-stack-pair-fullscreen {\n  min-height: 100%;\n  height: 100%;\n}\n.activities-rate-pair-inline-grid {\n  position: absolute;\n  inset: 0;\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: clamp(0.28rem, 0.8vw, 0.52rem);\n  padding: 0.42rem;\n}\n.activities-rate-pair-inline-grid:not(.activities-rate-pair-fullscreen-grid) {\n  gap: clamp(0.08rem, 0.32vw, 0.16rem);\n}\n.activities-rate-pair-inline-card {\n  position: relative;\n  min-width: 0;\n  border-radius: 12px;\n  overflow: hidden;\n  border: 1px solid rgba(255, 255, 255, 0.28);\n  box-shadow: 0 10px 22px rgba(6, 18, 36, 0.3);\n}\n.activities-rate-pair-inline-layer {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  min-height: 0;\n  background-size: var(--rate-card-image-fit, cover);\n  background-position: center;\n  background-repeat: no-repeat;\n}\n.activities-rate-image-loader {\n  position: absolute;\n  inset: 0;\n  z-index: 2;\n  display: grid;\n  place-items: center;\n  pointer-events: none;\n  opacity: 0;\n  transition: opacity 120ms ease;\n}\n.activities-rate-image-loader app-indicator {\n  position: relative;\n  z-index: 1;\n}\n.activities-rate-pair-inline-layer.lazy-bg-loading .activities-rate-image-loader,\n.activities-rate-profile-layer.lazy-bg-loading .activities-rate-image-loader {\n  opacity: 1;\n}\n.activities-rate-pair-inline-layer.lazy-bg-loaded .activities-rate-image-loader,\n.activities-rate-profile-layer.lazy-bg-loaded .activities-rate-image-loader,\n.activities-rate-pair-inline-layer.lazy-bg-error .activities-rate-image-loader,\n.activities-rate-profile-layer.lazy-bg-error .activities-rate-image-loader {\n  opacity: 0;\n}\n.activities-rate-pair-inline-layer::after,\n.activities-rate-profile-layer::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  z-index: 0;\n  pointer-events: none;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(12, 22, 36, 0.04) 0%,\n      rgba(7, 16, 28, 0.62) 66%,\n      rgba(7, 16, 28, 0.84) 100%);\n}\n.activities-rate-pair-inline-layer .card-image-placeholder {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 4;\n}\n.activities-rate-pair-inline-card.is-pane-loading .activities-rate-profile-indicators .image-stack-line.active,\n.activities-rate-profile-stack.is-pane-loading .activities-rate-profile-indicators .image-stack-line.active {\n  animation: activities-rate-pane-loading-pulse 500ms ease;\n}\n@keyframes activities-rate-pane-loading-pulse {\n  0% {\n    transform: scaleX(0.84);\n    opacity: 0.58;\n  }\n  100% {\n    transform: scaleX(1);\n    opacity: 1;\n  }\n}\n.activities-rate-pair-inline-label {\n  position: absolute;\n  top: 0.64rem;\n  left: 0.52rem;\n  z-index: 5;\n  border-radius: 999px;\n  border: 1px solid rgba(212, 229, 249, 0.42);\n  color: #f5f9ff;\n  font-size: 0.66rem;\n  font-weight: 700;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.16rem 0.42rem;\n  background: rgba(8, 18, 35, 0.62);\n}\n.activities-rate-pair-inline-card-woman .activities-rate-pair-inline-label {\n  background: rgba(109, 42, 118, 0.64);\n}\n.activities-rate-pair-inline-card-man .activities-rate-pair-inline-label {\n  background: rgba(36, 74, 127, 0.66);\n}\n.shared-card-status-badge {\n  position: absolute;\n  top: 0.64rem;\n  right: 0.56rem;\n  z-index: 80;\n  max-width: calc(100% - 1.24rem);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  border-radius: 999px;\n  border: 1px solid rgba(148, 225, 182, 0.56);\n  background: rgba(8, 34, 18, 0.74);\n  color: #e9ffef;\n  font-size: 0.68rem;\n  font-weight: 700;\n  letter-spacing: 0.01em;\n  line-height: 1;\n  padding: 0.17rem 0.5rem;\n  pointer-events: none;\n}\n.shared-card-context-avatar-badge {\n  position: absolute;\n  top: 0.68rem;\n  left: 0.62rem;\n  z-index: 30;\n  width: 2.08rem;\n  height: 2.08rem;\n  display: inline-grid;\n  place-items: center;\n  border: 2px solid rgba(255, 255, 255, 0.84);\n  border-radius: 999px;\n  background: rgba(8, 18, 35, 0.74);\n  color: #f7fbff;\n  box-shadow: 0 7px 16px rgba(4, 12, 26, 0.36), inset 0 0 0 1px rgba(15, 35, 58, 0.26);\n  overflow: visible;\n  pointer-events: auto;\n  touch-action: manipulation;\n}\nbutton.shared-card-context-avatar-badge {\n  cursor: pointer;\n}\n.shared-card-context-avatar-badge img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  border-radius: inherit;\n}\n.shared-card-context-avatar-badge > span {\n  font-size: 0.68rem;\n  font-weight: 900;\n  line-height: 1;\n}\n.shared-card-context-avatar-badge em {\n  position: absolute;\n  top: -0.74rem;\n  right: -0.72rem;\n  z-index: 2;\n  min-width: 1rem;\n  height: 1rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border: 1px solid rgba(255, 255, 255, 0.88);\n  border-radius: 999px;\n  background: #d94c4c;\n  color: #fff;\n  font-size: 0.54rem;\n  font-style: normal;\n  font-weight: 900;\n  line-height: 1;\n  padding: 0 0.16rem;\n  box-shadow: 0 4px 10px rgba(77, 12, 24, 0.32);\n}\n.activities-rate-pair-inline-overlay,\n.activities-rate-profile-overlay {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 3;\n  display: grid;\n  gap: 0.14rem;\n}\n.activities-rate-pair-inline-overlay {\n  padding: 0.7rem 0.72rem 0.68rem;\n}\n.activities-rate-pair-inline-card .activities-rate-profile-indicators.activities-rate-pair-inline-indicators {\n  top: 0.28rem;\n  left: 0.34rem;\n  right: 0.34rem;\n  padding: 0.12rem 0.24rem;\n  border-radius: 7px;\n}\n.activities-rate-pair-inline-hit-area {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 4;\n}\n.activities-rate-profile-layer {\n  position: absolute;\n  inset: 0;\n  z-index: 1;\n  border-radius: 14px;\n  overflow: hidden;\n  background-size: var(--rate-card-image-fit, cover);\n  background-position: center;\n  background-repeat: no-repeat;\n  border: 1px solid rgba(255, 255, 255, 0.26);\n  box-shadow: 0 12px 24px rgba(6, 18, 36, 0.34);\n}\n:host([data-card-presentation=list]) .activities-rate-pair-inline-layer,\n:host([data-card-presentation=list]) .activities-rate-profile-layer {\n  background-size: contain;\n}\n.activities-rate-profile-layer-active {\n  pointer-events: none;\n}\n.activities-rate-profile-indicators {\n  position: absolute;\n  top: 0.36rem;\n  left: 0.52rem;\n  right: 0.52rem;\n  z-index: 10;\n  padding: 0.16rem 0.34rem;\n  border-radius: 8px;\n  background: rgba(10, 18, 31, 0.38);\n  gap: 5px;\n}\n.activities-rate-profile-indicators .image-stack-line {\n  height: 4px;\n  border: 1px solid rgba(28, 42, 64, 0.36);\n  background: rgba(167, 177, 192, 0.9);\n  opacity: 1;\n}\n.activities-rate-profile-indicators .image-stack-line.active {\n  border-color: rgba(248, 252, 255, 0.86);\n  background: rgba(250, 252, 255, 0.98);\n  box-shadow: 0 0 0 1px rgba(10, 20, 34, 0.12);\n}\n.activities-rate-profile-hit-area {\n  top: 0.2rem;\n  left: 0.2rem;\n  right: 0.2rem;\n  bottom: 0.2rem;\n  z-index: 4;\n}\n.shared-card-profile-view-btn {\n  position: absolute;\n  right: 0.56rem;\n  bottom: 0.56rem;\n  z-index: 18;\n  width: 2.22rem;\n  height: 2.22rem;\n  border: 1px solid rgba(41, 99, 143, 0.28);\n  border-radius: 999px;\n  background: rgba(232, 246, 251, 0.94);\n  color: #226d83;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  box-shadow: 0 8px 18px rgba(6, 24, 44, 0.2);\n  cursor: pointer;\n  pointer-events: auto;\n  transition:\n    background 0.16s ease,\n    border-color 0.16s ease,\n    transform 0.16s ease;\n  -webkit-tap-highlight-color: transparent;\n}\n.shared-card-profile-view-btn:hover,\n.shared-card-profile-view-btn:focus-visible {\n  background: rgba(218, 241, 249, 0.98);\n  border-color: rgba(31, 124, 153, 0.44);\n  transform: translateY(-1px);\n  outline: none;\n}\n.shared-card-profile-view-btn .mat-icon {\n  width: 1.34rem;\n  height: 1.34rem;\n  font-size: 1.34rem;\n  line-height: 1.34rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.activities-rate-pair-inline-card .shared-card-profile-view-btn {\n  right: 0.44rem;\n  bottom: 0.44rem;\n  width: 2rem;\n  height: 2rem;\n}\n.activities-rate-profile-overlay {\n  padding: 0.74rem 0.8rem 0.72rem;\n}\n.activities-rate-profile-line {\n  margin: 0;\n  color: #f5f9ff !important;\n  text-shadow: 0 2px 9px rgba(2, 8, 16, 0.96);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.activities-rate-profile-line-primary {\n  font-size: 0.9rem;\n  font-weight: 800;\n}\n.activities-rate-profile-line-secondary {\n  font-size: 0.76rem;\n  font-weight: 700;\n  color: rgba(237, 245, 255, 0.98) !important;\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-given .activities-rate-profile-layer {\n  border-color: rgba(63, 136, 208, 0.52);\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-received .activities-rate-profile-layer {\n  border-color: rgba(53, 160, 114, 0.52);\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-mutual .activities-rate-profile-layer {\n  border-color: rgba(176, 121, 48, 0.52);\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-met .activities-rate-profile-layer {\n  border-color: rgba(104, 118, 139, 0.52);\n}\n.activities-rate-score-badge {\n  min-height: 26px;\n  border: 2px solid rgba(187, 136, 22, 0.58);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #fff9e9 0%,\n      #fff1cb 100%);\n  color: #9f6915;\n  font-size: 0.76rem;\n  font-weight: 800;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n  padding: 0.16rem 0.56rem;\n  cursor: pointer;\n  transform: translateY(0) scale(1);\n  box-shadow: inset 0 0 0 1px rgba(255, 245, 215, 0.72), 0 0 0 rgba(226, 171, 47, 0);\n  transition:\n    transform 0.16s ease,\n    box-shadow 0.2s ease,\n    border-color 0.2s ease,\n    filter 0.2s ease;\n}\n.activities-rate-score-badge .mat-icon {\n  width: 14px;\n  height: 14px;\n  font-size: 14px;\n  line-height: 14px;\n}\n.activities-rate-score-badge-floating {\n  position: absolute;\n  top: 0.6rem;\n  right: 0.3rem;\n  z-index: 24;\n  min-width: 68px;\n  justify-content: center;\n}\n.activities-rate-score-badge-between {\n  --activities-rate-badge-between-y: -50%;\n  position: absolute;\n  left: 50%;\n  right: auto;\n  top: 50%;\n  z-index: 24;\n  min-width: 68px;\n  width: max-content;\n  max-width: calc(100% - 0.8rem);\n  justify-content: center;\n  white-space: nowrap;\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n  transition:\n    box-shadow 0.2s ease,\n    border-color 0.2s ease,\n    filter 0.2s ease;\n}\n.activities-rate-profile-stack-pair-inline .activities-rate-score-badge-between {\n  --activities-rate-badge-between-y: 0;\n  top: auto;\n  bottom: clamp(3.2rem, 18%, 4.2rem);\n  left: 50% !important;\n  right: auto !important;\n  transform: translate(-50%, var(--activities-rate-badge-between-y)) !important;\n}\n.activities-rate-profile-stack-pair-inline .activities-rate-score-badge-between:not(.is-disabled):hover,\n.activities-rate-profile-stack-pair-inline .activities-rate-score-badge-between:not(.is-disabled):active,\n.activities-rate-profile-stack-pair-inline .activities-rate-score-badge-between.is-active:not(.is-disabled),\n.activities-rate-profile-stack-pair-inline .activities-rate-score-badge-between.is-active.is-pending:not(.is-disabled),\n.activities-rate-profile-stack-pair-inline .activities-rate-score-badge-between.is-disabled {\n  left: 50% !important;\n  right: auto !important;\n  transform: translate(-50%, 0) !important;\n}\n.activities-rates-fullscreen .activities-rate-score-badge-floating.activities-rate-score-badge-floating-pair-overlap {\n  --activities-rate-badge-between-y: 0;\n  top: auto;\n  bottom: clamp(3.2rem, 11%, 4.6rem);\n  left: var(--activities-pair-split, 50%);\n  right: auto;\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n  min-width: 68px;\n  width: max-content;\n  max-width: calc(100% - 0.8rem);\n  justify-content: center;\n  white-space: nowrap;\n}\n.activities-rates-fullscreen .activities-rate-score-badge-floating.activities-rate-score-badge-floating-pair-overlap.is-active:not(.is-disabled),\n.activities-rates-fullscreen .activities-rate-score-badge-floating.activities-rate-score-badge-floating-pair-overlap:not(.is-disabled):active {\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n@media (hover: hover) and (pointer: fine) {\n  button.activities-rate-score-badge:not(.is-disabled):hover {\n    transform: translateY(-1px) scale(1.03);\n    box-shadow: 0 6px 14px rgba(203, 150, 34, 0.28);\n    filter: saturate(1.05);\n  }\n}\nbutton.activities-rate-score-badge:not(.is-disabled):active {\n  transform: translateY(0) scale(0.96);\n  box-shadow: 0 2px 8px rgba(146, 105, 16, 0.22);\n}\nbutton.activities-rate-score-badge-between:not(.is-disabled):hover,\nbutton.activities-rate-score-badge-between:not(.is-disabled):active {\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n.activities-rate-score-badge.is-pending {\n  border-color: rgba(187, 56, 71, 0.62);\n  background:\n    linear-gradient(\n      180deg,\n      #ffe9ed 0%,\n      #ffd9df 100%);\n  color: #b63545;\n}\n.activities-rate-score-badge.is-active:not(.is-disabled) {\n  border-color: rgba(206, 148, 25, 0);\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ca 0%,\n      #ffe7a8 100%);\n  color: #8b560f;\n  box-shadow: none;\n  transform: translateY(0) scale(1);\n}\n.activities-rate-score-badge-between.is-active:not(.is-disabled),\n.activities-rate-score-badge-between.is-active.is-pending:not(.is-disabled) {\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n.activities-rate-score-badge.is-active.is-pending:not(.is-disabled) {\n  border-color: rgba(188, 53, 72, 0);\n  background:\n    linear-gradient(\n      180deg,\n      #ffdce4 0%,\n      #ffc8d3 100%);\n  color: #9d2232;\n  box-shadow: none;\n}\n@media (hover: hover) and (pointer: fine) {\n  button.activities-rate-score-badge.is-active:not(.is-disabled):hover {\n    border-color: rgba(206, 148, 25, 0.76);\n    box-shadow: 0 0 0 2px rgba(255, 244, 201, 0.68), 0 9px 16px rgba(170, 117, 20, 0.26);\n  }\n  button.activities-rate-score-badge.is-active.is-pending:not(.is-disabled):hover {\n    border-color: rgba(188, 53, 72, 0.72);\n    box-shadow: 0 0 0 2px rgba(255, 230, 236, 0.72), 0 9px 16px rgba(170, 48, 68, 0.24);\n  }\n}\n.activities-rate-score-badge.is-blink:not(.is-disabled) {\n  animation: game-rating-stars-blink 0.42s ease-in-out 1;\n}\n@keyframes game-rating-stars-blink {\n  0%, 100% {\n    filter: brightness(1);\n  }\n  50% {\n    filter: brightness(1.12) saturate(1.1);\n  }\n}\n.activities-rate-score-badge.is-disabled {\n  border-color: rgba(111, 123, 140, 0.52);\n  background:\n    linear-gradient(\n      180deg,\n      #f4f6f9 0%,\n      #e8edf3 100%);\n  color: #617085;\n  cursor: default;\n  transform: none;\n  box-shadow: none;\n  transition: none;\n}\n.activities-rate-score-badge-between.is-disabled {\n  right: auto;\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n.activities-rate-score-badge[disabled],\nspan.activities-rate-score-badge {\n  pointer-events: none;\n}\nspan.activities-rate-score-badge {\n  cursor: default;\n  transition: none;\n}\n.image-stack-indicators {\n  position: absolute;\n  top: -0.1rem;\n  left: 0.25rem;\n  right: 0.25rem;\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));\n  gap: 4px;\n  width: auto !important;\n}\n.image-stack-hit-area {\n  position: absolute;\n  top: 10px;\n  left: 10px;\n  right: 10px;\n  bottom: 10px;\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));\n  gap: 4px;\n  z-index: 2;\n}\n.image-stack-hit-segment {\n  border: 0;\n  background: transparent;\n  padding: 0;\n  cursor: pointer;\n  width: 100%;\n  height: 100%;\n}\n.card-image-placeholder {\n  width: 84px;\n  height: 84px;\n  border-radius: 50%;\n  background:\n    linear-gradient(\n      145deg,\n      #4f7cff,\n      #7a3eff 60%,\n      #f04eab);\n  color: #fff;\n  font-weight: 800;\n  font-size: 1.72rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  letter-spacing: 0.03em;\n}\n.activities-rates-fullscreen {\n  position: relative;\n  display: flex;\n  justify-content: center;\n  align-items: flex-start;\n  width: 100%;\n  height: 100%;\n  min-width: 0;\n  min-height: 0;\n}\n.activities-rates-fullscreen-card {\n  margin: 0;\n  flex: 0 0 auto;\n  touch-action: pan-y;\n  width: 100%;\n  height: 100%;\n  max-width: 100%;\n  max-height: 100%;\n}\n.activities-rates-fullscreen .image-stack-line,\n.activities-rates-fullscreen .image-stack-hit-segment {\n  pointer-events: auto;\n}\n.activities-rates-fullscreen .activities-rate-profile-card {\n  min-height: 0;\n  background: #e6edf7;\n}\n.activities-rates-fullscreen .activities-rate-profile-stack {\n  min-height: 0;\n  height: 100%;\n  background: #d7e1ef;\n}\n.activities-rates-fullscreen-card-active .activities-rate-profile-layer {\n  background-color: #d3ddea;\n}\n.activities-rates-fullscreen .activities-rate-profile-stack.activities-rate-profile-stack-pair-fullscreen {\n  width: 100%;\n  margin-inline: 0;\n}\n.activities-rates-fullscreen .activities-rate-profile-stack.activities-rate-profile-stack-pair-fullscreen.activities-rate-profile-stack-pair {\n  border-radius: 14px;\n  border: 1px solid rgba(34, 54, 84, 0.24);\n  background:\n    linear-gradient(\n      180deg,\n      #1b2c45 0%,\n      #132238 100%);\n  overflow: hidden;\n}\n@media (min-width: 761px) {\n  .activities-rates-fullscreen-card {\n    width: calc(100% - var(--smart-list-pagination-arrow-size, 2.2rem)) !important;\n  }\n}\n.activities-rates-fullscreen .activities-rate-pair-fullscreen-grid {\n  --activities-pair-gap: clamp(0.28rem, 0.8vw, 0.52rem);\n  --activities-pair-pad: 0.42rem;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  grid-template-rows: minmax(0, 1fr);\n  gap: var(--activities-pair-gap);\n  padding: var(--activities-pair-pad);\n  box-sizing: border-box;\n}\n.activities-rates-fullscreen .activities-rate-pair-fullscreen-grid .activities-rate-pair-inline-card {\n  min-height: 0;\n  box-sizing: border-box;\n}\n.activities-rates-fullscreen .activities-rate-pair-fullscreen-grid .activities-rate-pair-inline-card.is-collapsed {\n  border-color: transparent;\n  box-shadow: none;\n}\n.activities-rates-fullscreen .activities-rate-pair-fullscreen-grid .activities-rate-pair-inline-card.is-collapsed > * {\n  opacity: 0;\n  pointer-events: none;\n}\n.activities-rates-fullscreen .activities-rate-pair-fullscreen-grid .activities-rate-pair-inline-indicators {\n  top: 0.28rem;\n  left: 0.38rem;\n  right: 0.38rem;\n}\n.activities-rates-fullscreen .activities-rate-pair-fullscreen-grid .activities-rate-pair-inline-overlay {\n  padding: 0.74rem 0.8rem 0.72rem;\n}\n.activities-rates-pair-fullscreen-resize-handle {\n  display: none;\n}\n.activities-rates-pair-fullscreen-resize-handle-grip {\n  display: block;\n  pointer-events: none;\n}\n@media (max-width: 760px) {\n  .activities-rates-fullscreen .activities-rate-pair-fullscreen-grid {\n    --activities-pair-gap: 0 !important;\n    --activities-pair-pad: 0.3rem !important;\n    display: flex;\n    gap: 0 !important;\n    padding: var(--activities-pair-pad) !important;\n    overflow: hidden;\n  }\n  .activities-rates-fullscreen .activities-rate-pair-fullscreen-grid::after {\n    content: "";\n    position: absolute;\n    top: var(--activities-pair-pad);\n    bottom: var(--activities-pair-pad);\n    left: var(--activities-pair-split);\n    width: 1px;\n    transform: translateX(-0.5px);\n    background: rgba(34, 54, 84, 0.58);\n    pointer-events: none;\n    z-index: 22;\n  }\n  .activities-rates-fullscreen .activities-rate-pair-fullscreen-grid .activities-rate-pair-inline-card {\n    min-width: 0;\n    max-width: 100%;\n  }\n  .activities-rates-fullscreen .activities-rate-pair-fullscreen-grid .activities-rate-pair-inline-card-start {\n    flex: 0 0 var(--activities-pair-split);\n    width: auto;\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n    border-right-width: 0;\n  }\n  .activities-rates-fullscreen .activities-rate-pair-fullscreen-grid .activities-rate-pair-inline-card-end {\n    flex: 0 0 calc(100% - var(--activities-pair-split));\n    width: auto;\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n    border-left-width: 0;\n  }\n  .activities-rates-fullscreen .activities-rate-score-badge-floating.activities-rate-score-badge-floating-pair-overlap {\n    left: 50%;\n    bottom: 4rem;\n    z-index: 28;\n    pointer-events: none;\n  }\n  .activities-rates-pair-fullscreen-resize-handle {\n    position: absolute;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    pointer-events: auto;\n    left: var(--activities-pair-split);\n    top: var(--activities-pair-pad);\n    bottom: var(--activities-pair-pad);\n    width: 36px;\n    transform: translateX(-50%);\n    border: 0;\n    padding: 0;\n    margin: 0;\n    background: transparent;\n    z-index: 40;\n    touch-action: none;\n    cursor: ew-resize;\n    -webkit-tap-highlight-color: transparent;\n  }\n  .activities-rates-pair-fullscreen-resize-handle::before {\n    content: "";\n    position: absolute;\n    inset: -12px -8px;\n  }\n  .activities-rates-pair-fullscreen-resize-handle-grip {\n    width: 4px;\n    height: 36%;\n    min-height: 52px;\n    border-radius: 999px;\n    border: 1px solid rgba(166, 196, 232, 0.74);\n    background:\n      linear-gradient(\n        180deg,\n        rgba(241, 247, 255, 0.94) 0%,\n        rgba(218, 232, 249, 0.9) 100%);\n    box-shadow: 0 0 0 1px rgba(9, 22, 40, 0.14), 0 8px 14px rgba(6, 18, 36, 0.34);\n    pointer-events: none;\n  }\n  .activities-rate-profile-stack.activities-rate-profile-stack-pair-fullscreen.is-resizing .activities-rates-pair-fullscreen-resize-handle-grip {\n    background:\n      linear-gradient(\n        180deg,\n        rgba(255, 247, 227, 0.96) 0%,\n        rgba(255, 229, 165, 0.9) 100%);\n    border-color: rgba(218, 168, 51, 0.86);\n  }\n}\n/*# sourceMappingURL=pair-card.component.css.map */\n'] }]
  }], null, { card: [{
    type: Input
  }], showSplitHandle: [{
    type: Input
  }], badgeClick: [{
    type: Output
  }], menuRequest: [{
    type: Output
  }], detailClick: [{
    type: Output
  }], fullscreenShellRef: [{
    type: ViewChild,
    args: ["fullscreenShell", { read: ElementRef }]
  }], hostPresentationAttr: [{
    type: HostBinding,
    args: ["attr.data-card-presentation"]
  }], hostHeight: [{
    type: HostBinding,
    args: ["style.height"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PairCardComponent, { className: "PairCardComponent", filePath: "app/shared/ui/components/core/smart-list/card/pair-card/pair-card.component.ts", lineNumber: 40 });
})();

export {
  SingleCardComponent,
  PairCardComponent
};
//# sourceMappingURL=chunk-KO4GQHHA.js.map
