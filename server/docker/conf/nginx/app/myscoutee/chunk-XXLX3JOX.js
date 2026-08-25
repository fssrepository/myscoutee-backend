import {
  CARD_MENU_ACTIONS
} from "./chunk-LXXIK2TC.js";
import {
  LazyBgImageDirective
} from "./chunk-RB7FL7JP.js";
import {
  AppMenuComponent,
  AppMenuTriggerComponent,
  CounterBadgePipe,
  I18nPipe,
  IndicatorComponent
} from "./chunk-QD6QQNQX.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-EDHGCWPF.js";
import {
  AppUtils
} from "./chunk-XQ4NDAVX.js";
import {
  CommonModule,
  NgClass,
  NgStyle,
  NgTemplateOutlet
} from "./chunk-J7IJFFQ2.js";
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
  ɵɵdeclareLet,
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
  ɵɵpureFunction0,
  ɵɵqueryRefresh,
  ɵɵreadContextLet,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstoreLet,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuery
} from "./chunk-XJL7SWH7.js";

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
  }, dependencies: [CommonModule, NgClass, NgTemplateOutlet, MatIconModule, MatIcon, LazyBgImageDirective, IndicatorComponent], styles: ['\n[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n  min-height: 0;\n}\n[data-card-presentation=fullscreen][_nghost-%COMP%] {\n  height: 100%;\n}\n.activities-rate-profile-card[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  min-height: 264px;\n  border: 1px solid rgba(34, 54, 84, 0.24);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      #1b2c45 0%,\n      #132238 100%);\n  overflow: hidden;\n  box-sizing: border-box;\n  touch-action: pan-y;\n}\n.activities-rate-profile-card.activities-row-item[_ngcontent-%COMP%] {\n  cursor: default;\n  transform: none;\n  transition: none;\n  animation: none;\n  -webkit-tap-highlight-color: transparent;\n}\n.activities-rate-profile-card.activities-row-item[_ngcontent-%COMP%]:hover, \n.activities-rate-profile-card.activities-row-item[_ngcontent-%COMP%]:active {\n  transform: none;\n  filter: none;\n}\n.activities-rate-profile-stack[_ngcontent-%COMP%] {\n  position: relative;\n  min-height: 264px;\n  height: 100%;\n}\n.activities-rate-profile-stack.activities-rate-profile-stack-pair-inline[_ngcontent-%COMP%] {\n  min-height: 264px;\n}\n.activities-rate-profile-stack.activities-rate-profile-stack-pair-fullscreen[_ngcontent-%COMP%] {\n  min-height: 100%;\n  height: 100%;\n}\n.activities-rate-pair-inline-grid[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: clamp(0.28rem, 0.8vw, 0.52rem);\n  padding: 0.42rem;\n}\n.activities-rate-pair-inline-grid[_ngcontent-%COMP%]:not(.activities-rate-pair-fullscreen-grid) {\n  gap: clamp(0.08rem, 0.32vw, 0.16rem);\n}\n.activities-rate-pair-inline-card[_ngcontent-%COMP%] {\n  position: relative;\n  min-width: 0;\n  border-radius: 12px;\n  overflow: hidden;\n  border: 1px solid rgba(255, 255, 255, 0.28);\n  box-shadow: 0 10px 22px rgba(6, 18, 36, 0.3);\n}\n.activities-rate-pair-inline-layer[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  min-height: 0;\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n}\n.activities-rate-image-loader[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  z-index: 2;\n  display: grid;\n  place-items: center;\n  pointer-events: none;\n  opacity: 0;\n  transition: opacity 120ms ease;\n}\n.activities-rate-image-loader[_ngcontent-%COMP%]   app-indicator[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n}\n.activities-rate-pair-inline-layer.lazy-bg-loading[_ngcontent-%COMP%]   .activities-rate-image-loader[_ngcontent-%COMP%], \n.activities-rate-profile-layer.lazy-bg-loading[_ngcontent-%COMP%]   .activities-rate-image-loader[_ngcontent-%COMP%] {\n  opacity: 1;\n}\n.activities-rate-pair-inline-layer.lazy-bg-loaded[_ngcontent-%COMP%]   .activities-rate-image-loader[_ngcontent-%COMP%], \n.activities-rate-profile-layer.lazy-bg-loaded[_ngcontent-%COMP%]   .activities-rate-image-loader[_ngcontent-%COMP%], \n.activities-rate-pair-inline-layer.lazy-bg-error[_ngcontent-%COMP%]   .activities-rate-image-loader[_ngcontent-%COMP%], \n.activities-rate-profile-layer.lazy-bg-error[_ngcontent-%COMP%]   .activities-rate-image-loader[_ngcontent-%COMP%] {\n  opacity: 0;\n}\n.activities-rate-pair-inline-layer[_ngcontent-%COMP%]::after, \n.activities-rate-profile-layer[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  z-index: 0;\n  pointer-events: none;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(12, 22, 36, 0.04) 0%,\n      rgba(7, 16, 28, 0.62) 66%,\n      rgba(7, 16, 28, 0.84) 100%);\n}\n.activities-rate-pair-inline-layer[_ngcontent-%COMP%]   .card-image-placeholder[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 4;\n}\n.activities-rate-pair-inline-card.is-pane-loading[_ngcontent-%COMP%]   .activities-rate-profile-indicators[_ngcontent-%COMP%]   .image-stack-line.active[_ngcontent-%COMP%], \n.activities-rate-profile-stack.is-pane-loading[_ngcontent-%COMP%]   .activities-rate-profile-indicators[_ngcontent-%COMP%]   .image-stack-line.active[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_activities-rate-pane-loading-pulse 500ms ease;\n}\n@keyframes _ngcontent-%COMP%_activities-rate-pane-loading-pulse {\n  0% {\n    transform: scaleX(0.84);\n    opacity: 0.58;\n  }\n  100% {\n    transform: scaleX(1);\n    opacity: 1;\n  }\n}\n.activities-rate-pair-inline-label[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.64rem;\n  left: 0.52rem;\n  z-index: 5;\n  border-radius: 999px;\n  border: 1px solid rgba(212, 229, 249, 0.42);\n  color: #f5f9ff;\n  font-size: 0.66rem;\n  font-weight: 700;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.16rem 0.42rem;\n  background: rgba(8, 18, 35, 0.62);\n}\n.activities-rate-pair-inline-card-woman[_ngcontent-%COMP%]   .activities-rate-pair-inline-label[_ngcontent-%COMP%] {\n  background: rgba(109, 42, 118, 0.64);\n}\n.activities-rate-pair-inline-card-man[_ngcontent-%COMP%]   .activities-rate-pair-inline-label[_ngcontent-%COMP%] {\n  background: rgba(36, 74, 127, 0.66);\n}\n.shared-card-status-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.64rem;\n  right: 0.56rem;\n  z-index: 80;\n  max-width: calc(100% - 1.24rem);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  border-radius: 999px;\n  border: 1px solid rgba(148, 225, 182, 0.56);\n  background: rgba(8, 34, 18, 0.74);\n  color: #e9ffef;\n  font-size: 0.68rem;\n  font-weight: 700;\n  letter-spacing: 0.01em;\n  line-height: 1;\n  padding: 0.17rem 0.5rem;\n  pointer-events: none;\n}\n.shared-card-context-avatar-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.68rem;\n  left: 0.62rem;\n  z-index: 30;\n  width: 2.08rem;\n  height: 2.08rem;\n  display: inline-grid;\n  place-items: center;\n  border: 2px solid rgba(255, 255, 255, 0.84);\n  border-radius: 999px;\n  background: rgba(8, 18, 35, 0.74);\n  color: #f7fbff;\n  box-shadow: 0 7px 16px rgba(4, 12, 26, 0.36), inset 0 0 0 1px rgba(15, 35, 58, 0.26);\n  overflow: visible;\n  pointer-events: auto;\n  touch-action: manipulation;\n}\nbutton.shared-card-context-avatar-badge[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n.shared-card-context-avatar-badge[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  border-radius: inherit;\n}\n.shared-card-context-avatar-badge[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  font-size: 0.68rem;\n  font-weight: 900;\n  line-height: 1;\n}\n.shared-card-context-avatar-badge[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -0.74rem;\n  right: -0.72rem;\n  z-index: 2;\n  min-width: 1rem;\n  height: 1rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border: 1px solid rgba(255, 255, 255, 0.88);\n  border-radius: 999px;\n  background: #d94c4c;\n  color: #fff;\n  font-size: 0.54rem;\n  font-style: normal;\n  font-weight: 900;\n  line-height: 1;\n  padding: 0 0.16rem;\n  box-shadow: 0 4px 10px rgba(77, 12, 24, 0.32);\n}\n.activities-rate-pair-inline-overlay[_ngcontent-%COMP%], \n.activities-rate-profile-overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 3;\n  display: grid;\n  gap: 0.14rem;\n}\n.activities-rate-pair-inline-overlay[_ngcontent-%COMP%] {\n  padding: 0.7rem 0.72rem 0.68rem;\n}\n.activities-rate-pair-inline-card[_ngcontent-%COMP%]   .activities-rate-profile-indicators.activities-rate-pair-inline-indicators[_ngcontent-%COMP%] {\n  top: 0.28rem;\n  left: 0.34rem;\n  right: 0.34rem;\n  padding: 0.12rem 0.24rem;\n  border-radius: 7px;\n}\n.activities-rate-pair-inline-hit-area[_ngcontent-%COMP%] {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 4;\n}\n.activities-rate-profile-layer[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  z-index: 1;\n  border-radius: 14px;\n  overflow: hidden;\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n  border: 1px solid rgba(255, 255, 255, 0.26);\n  box-shadow: 0 12px 24px rgba(6, 18, 36, 0.34);\n}\n[data-card-presentation=list][_nghost-%COMP%]   .activities-rate-pair-inline-layer[_ngcontent-%COMP%], \n[data-card-presentation=list][_nghost-%COMP%]   .activities-rate-profile-layer[_ngcontent-%COMP%] {\n  background-size: contain;\n}\n.activities-rate-profile-layer-active[_ngcontent-%COMP%] {\n  pointer-events: none;\n}\n.activities-rate-profile-indicators[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.36rem;\n  left: 0.52rem;\n  right: 0.52rem;\n  z-index: 10;\n  padding: 0.16rem 0.34rem;\n  border-radius: 8px;\n  background: rgba(10, 18, 31, 0.38);\n  gap: 5px;\n}\n.activities-rate-profile-indicators[_ngcontent-%COMP%]   .image-stack-line[_ngcontent-%COMP%] {\n  height: 4px;\n  border: 1px solid rgba(28, 42, 64, 0.36);\n  background: rgba(167, 177, 192, 0.9);\n  opacity: 1;\n}\n.activities-rate-profile-indicators[_ngcontent-%COMP%]   .image-stack-line.active[_ngcontent-%COMP%] {\n  border-color: rgba(248, 252, 255, 0.86);\n  background: rgba(250, 252, 255, 0.98);\n  box-shadow: 0 0 0 1px rgba(10, 20, 34, 0.12);\n}\n.activities-rate-profile-hit-area[_ngcontent-%COMP%] {\n  top: 0.2rem;\n  left: 0.2rem;\n  right: 0.2rem;\n  bottom: 0.2rem;\n  z-index: 4;\n}\n.shared-card-profile-view-btn[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 0.56rem;\n  bottom: 0.56rem;\n  z-index: 18;\n  width: 2.22rem;\n  height: 2.22rem;\n  border: 1px solid rgba(41, 99, 143, 0.28);\n  border-radius: 999px;\n  background: rgba(232, 246, 251, 0.94);\n  color: #226d83;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  box-shadow: 0 8px 18px rgba(6, 24, 44, 0.2);\n  cursor: pointer;\n  pointer-events: auto;\n  transition:\n    background 0.16s ease,\n    border-color 0.16s ease,\n    transform 0.16s ease;\n  -webkit-tap-highlight-color: transparent;\n}\n.shared-card-profile-view-btn[_ngcontent-%COMP%]:hover, \n.shared-card-profile-view-btn[_ngcontent-%COMP%]:focus-visible {\n  background: rgba(218, 241, 249, 0.98);\n  border-color: rgba(31, 124, 153, 0.44);\n  transform: translateY(-1px);\n  outline: none;\n}\n.shared-card-profile-view-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 1.34rem;\n  height: 1.34rem;\n  font-size: 1.34rem;\n  line-height: 1.34rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.activities-rate-pair-inline-card[_ngcontent-%COMP%]   .shared-card-profile-view-btn[_ngcontent-%COMP%] {\n  right: 0.44rem;\n  bottom: 0.44rem;\n  width: 2rem;\n  height: 2rem;\n}\n.activities-rate-profile-overlay[_ngcontent-%COMP%] {\n  padding: 0.74rem 0.8rem 0.72rem;\n}\n.activities-rate-profile-line[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #f5f9ff !important;\n  text-shadow: 0 2px 9px rgba(2, 8, 16, 0.96);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.activities-rate-profile-line-primary[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  font-weight: 800;\n}\n.activities-rate-profile-line-secondary[_ngcontent-%COMP%] {\n  font-size: 0.76rem;\n  font-weight: 700;\n  color: rgba(237, 245, 255, 0.98) !important;\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-given[_ngcontent-%COMP%]   .activities-rate-profile-layer[_ngcontent-%COMP%] {\n  border-color: rgba(63, 136, 208, 0.52);\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-received[_ngcontent-%COMP%]   .activities-rate-profile-layer[_ngcontent-%COMP%] {\n  border-color: rgba(53, 160, 114, 0.52);\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-mutual[_ngcontent-%COMP%]   .activities-rate-profile-layer[_ngcontent-%COMP%] {\n  border-color: rgba(176, 121, 48, 0.52);\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-met[_ngcontent-%COMP%]   .activities-rate-profile-layer[_ngcontent-%COMP%] {\n  border-color: rgba(104, 118, 139, 0.52);\n}\n.activities-rate-score-badge[_ngcontent-%COMP%] {\n  min-height: 26px;\n  border: 2px solid rgba(187, 136, 22, 0.58);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #fff9e9 0%,\n      #fff1cb 100%);\n  color: #9f6915;\n  font-size: 0.76rem;\n  font-weight: 800;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n  padding: 0.16rem 0.56rem;\n  cursor: pointer;\n  transform: translateY(0) scale(1);\n  box-shadow: inset 0 0 0 1px rgba(255, 245, 215, 0.72), 0 0 0 rgba(226, 171, 47, 0);\n  transition:\n    transform 0.16s ease,\n    box-shadow 0.2s ease,\n    border-color 0.2s ease,\n    filter 0.2s ease;\n}\n.activities-rate-score-badge[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n  font-size: 14px;\n  line-height: 14px;\n}\n.activities-rate-score-badge-floating[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.6rem;\n  right: 0.3rem;\n  z-index: 24;\n  min-width: 68px;\n  justify-content: center;\n}\n.activities-rate-score-badge-between[_ngcontent-%COMP%] {\n  --activities-rate-badge-between-y: -50%;\n  position: absolute;\n  left: 50%;\n  right: auto;\n  top: 50%;\n  z-index: 24;\n  min-width: 68px;\n  width: max-content;\n  max-width: calc(100% - 0.8rem);\n  justify-content: center;\n  white-space: nowrap;\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n  transition:\n    box-shadow 0.2s ease,\n    border-color 0.2s ease,\n    filter 0.2s ease;\n}\n.activities-rate-profile-stack-pair-inline[_ngcontent-%COMP%]   .activities-rate-score-badge-between[_ngcontent-%COMP%] {\n  --activities-rate-badge-between-y: 0;\n  top: auto;\n  bottom: clamp(3.2rem, 18%, 4.2rem);\n  left: 50% !important;\n  right: auto !important;\n  transform: translate(-50%, var(--activities-rate-badge-between-y)) !important;\n}\n.activities-rate-profile-stack-pair-inline[_ngcontent-%COMP%]   .activities-rate-score-badge-between[_ngcontent-%COMP%]:not(.is-disabled):hover, \n.activities-rate-profile-stack-pair-inline[_ngcontent-%COMP%]   .activities-rate-score-badge-between[_ngcontent-%COMP%]:not(.is-disabled):active, \n.activities-rate-profile-stack-pair-inline[_ngcontent-%COMP%]   .activities-rate-score-badge-between.is-active[_ngcontent-%COMP%]:not(.is-disabled), \n.activities-rate-profile-stack-pair-inline[_ngcontent-%COMP%]   .activities-rate-score-badge-between.is-active.is-pending[_ngcontent-%COMP%]:not(.is-disabled), \n.activities-rate-profile-stack-pair-inline[_ngcontent-%COMP%]   .activities-rate-score-badge-between.is-disabled[_ngcontent-%COMP%] {\n  left: 50% !important;\n  right: auto !important;\n  transform: translate(-50%, 0) !important;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-score-badge-floating.activities-rate-score-badge-floating-pair-overlap[_ngcontent-%COMP%] {\n  --activities-rate-badge-between-y: 0;\n  top: auto;\n  bottom: clamp(3.2rem, 11%, 4.6rem);\n  left: var(--activities-pair-split, 50%);\n  right: auto;\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n  min-width: 68px;\n  width: max-content;\n  max-width: calc(100% - 0.8rem);\n  justify-content: center;\n  white-space: nowrap;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-score-badge-floating.activities-rate-score-badge-floating-pair-overlap.is-active[_ngcontent-%COMP%]:not(.is-disabled), \n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-score-badge-floating.activities-rate-score-badge-floating-pair-overlap[_ngcontent-%COMP%]:not(.is-disabled):active {\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n@media (hover: hover) and (pointer: fine) {\n  button.activities-rate-score-badge[_ngcontent-%COMP%]:not(.is-disabled):hover {\n    transform: translateY(-1px) scale(1.03);\n    box-shadow: 0 6px 14px rgba(203, 150, 34, 0.28);\n    filter: saturate(1.05);\n  }\n}\nbutton.activities-rate-score-badge[_ngcontent-%COMP%]:not(.is-disabled):active {\n  transform: translateY(0) scale(0.96);\n  box-shadow: 0 2px 8px rgba(146, 105, 16, 0.22);\n}\nbutton.activities-rate-score-badge-between[_ngcontent-%COMP%]:not(.is-disabled):hover, \nbutton.activities-rate-score-badge-between[_ngcontent-%COMP%]:not(.is-disabled):active {\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n.activities-rate-score-badge.is-pending[_ngcontent-%COMP%] {\n  border-color: rgba(187, 56, 71, 0.62);\n  background:\n    linear-gradient(\n      180deg,\n      #ffe9ed 0%,\n      #ffd9df 100%);\n  color: #b63545;\n}\n.activities-rate-score-badge.is-active[_ngcontent-%COMP%]:not(.is-disabled) {\n  border-color: rgba(206, 148, 25, 0);\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ca 0%,\n      #ffe7a8 100%);\n  color: #8b560f;\n  box-shadow: none;\n  transform: translateY(0) scale(1);\n}\n.activities-rate-score-badge-between.is-active[_ngcontent-%COMP%]:not(.is-disabled), \n.activities-rate-score-badge-between.is-active.is-pending[_ngcontent-%COMP%]:not(.is-disabled) {\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n.activities-rate-score-badge.is-active.is-pending[_ngcontent-%COMP%]:not(.is-disabled) {\n  border-color: rgba(188, 53, 72, 0);\n  background:\n    linear-gradient(\n      180deg,\n      #ffdce4 0%,\n      #ffc8d3 100%);\n  color: #9d2232;\n  box-shadow: none;\n}\n@media (hover: hover) and (pointer: fine) {\n  button.activities-rate-score-badge.is-active[_ngcontent-%COMP%]:not(.is-disabled):hover {\n    border-color: rgba(206, 148, 25, 0.76);\n    box-shadow: 0 0 0 2px rgba(255, 244, 201, 0.68), 0 9px 16px rgba(170, 117, 20, 0.26);\n  }\n  button.activities-rate-score-badge.is-active.is-pending[_ngcontent-%COMP%]:not(.is-disabled):hover {\n    border-color: rgba(188, 53, 72, 0.72);\n    box-shadow: 0 0 0 2px rgba(255, 230, 236, 0.72), 0 9px 16px rgba(170, 48, 68, 0.24);\n  }\n}\n.activities-rate-score-badge.is-blink[_ngcontent-%COMP%]:not(.is-disabled) {\n  animation: _ngcontent-%COMP%_game-rating-stars-blink 0.42s ease-in-out 1;\n}\n@keyframes _ngcontent-%COMP%_game-rating-stars-blink {\n  0%, 100% {\n    filter: brightness(1);\n  }\n  50% {\n    filter: brightness(1.12) saturate(1.1);\n  }\n}\n.activities-rate-score-badge.is-disabled[_ngcontent-%COMP%] {\n  border-color: rgba(111, 123, 140, 0.52);\n  background:\n    linear-gradient(\n      180deg,\n      #f4f6f9 0%,\n      #e8edf3 100%);\n  color: #617085;\n  cursor: default;\n  transform: none;\n  box-shadow: none;\n  transition: none;\n}\n.activities-rate-score-badge-between.is-disabled[_ngcontent-%COMP%] {\n  right: auto;\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n.activities-rate-score-badge[disabled][_ngcontent-%COMP%], \nspan.activities-rate-score-badge[_ngcontent-%COMP%] {\n  pointer-events: none;\n}\nspan.activities-rate-score-badge[_ngcontent-%COMP%] {\n  cursor: default;\n  transition: none;\n}\n.image-stack-indicators[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -0.1rem;\n  left: 0.25rem;\n  right: 0.25rem;\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));\n  gap: 4px;\n  width: auto !important;\n}\n.image-stack-hit-area[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 10px;\n  left: 10px;\n  right: 10px;\n  bottom: 10px;\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));\n  gap: 4px;\n  z-index: 2;\n}\n.image-stack-hit-segment[_ngcontent-%COMP%] {\n  border: 0;\n  background: transparent;\n  padding: 0;\n  cursor: pointer;\n  width: 100%;\n  height: 100%;\n}\n.card-image-placeholder[_ngcontent-%COMP%] {\n  width: 84px;\n  height: 84px;\n  border-radius: 50%;\n  background:\n    linear-gradient(\n      145deg,\n      #4f7cff,\n      #7a3eff 60%,\n      #f04eab);\n  color: #fff;\n  font-weight: 800;\n  font-size: 1.72rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  letter-spacing: 0.03em;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  justify-content: center;\n  align-items: flex-start;\n  width: 100%;\n  height: 100%;\n  min-width: 0;\n  min-height: 0;\n}\n.activities-rates-fullscreen-card[_ngcontent-%COMP%] {\n  margin: 0;\n  flex: 0 0 auto;\n  touch-action: pan-y;\n  width: 100%;\n  height: 100%;\n  max-width: 100%;\n  max-height: 100%;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .image-stack-line[_ngcontent-%COMP%], \n.activities-rates-fullscreen[_ngcontent-%COMP%]   .image-stack-hit-segment[_ngcontent-%COMP%] {\n  pointer-events: auto;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-profile-card[_ngcontent-%COMP%] {\n  min-height: 0;\n  background: #e6edf7;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-profile-stack[_ngcontent-%COMP%] {\n  min-height: 0;\n  height: 100%;\n  background: #d7e1ef;\n}\n.activities-rates-fullscreen-card-active[_ngcontent-%COMP%]   .activities-rate-profile-layer[_ngcontent-%COMP%] {\n  background-color: #d3ddea;\n}\n/*# sourceMappingURL=single-card.component.css.map */'], changeDetection: 0 });
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
`, styles: ['/* src/app/shared/ui/components/core/smart-list/card/single-card/single-card.component.scss */\n:host {\n  display: block;\n  width: 100%;\n  min-height: 0;\n}\n:host([data-card-presentation=fullscreen]) {\n  height: 100%;\n}\n.activities-rate-profile-card {\n  position: relative;\n  width: 100%;\n  min-height: 264px;\n  border: 1px solid rgba(34, 54, 84, 0.24);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      #1b2c45 0%,\n      #132238 100%);\n  overflow: hidden;\n  box-sizing: border-box;\n  touch-action: pan-y;\n}\n.activities-rate-profile-card.activities-row-item {\n  cursor: default;\n  transform: none;\n  transition: none;\n  animation: none;\n  -webkit-tap-highlight-color: transparent;\n}\n.activities-rate-profile-card.activities-row-item:hover,\n.activities-rate-profile-card.activities-row-item:active {\n  transform: none;\n  filter: none;\n}\n.activities-rate-profile-stack {\n  position: relative;\n  min-height: 264px;\n  height: 100%;\n}\n.activities-rate-profile-stack.activities-rate-profile-stack-pair-inline {\n  min-height: 264px;\n}\n.activities-rate-profile-stack.activities-rate-profile-stack-pair-fullscreen {\n  min-height: 100%;\n  height: 100%;\n}\n.activities-rate-pair-inline-grid {\n  position: absolute;\n  inset: 0;\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: clamp(0.28rem, 0.8vw, 0.52rem);\n  padding: 0.42rem;\n}\n.activities-rate-pair-inline-grid:not(.activities-rate-pair-fullscreen-grid) {\n  gap: clamp(0.08rem, 0.32vw, 0.16rem);\n}\n.activities-rate-pair-inline-card {\n  position: relative;\n  min-width: 0;\n  border-radius: 12px;\n  overflow: hidden;\n  border: 1px solid rgba(255, 255, 255, 0.28);\n  box-shadow: 0 10px 22px rgba(6, 18, 36, 0.3);\n}\n.activities-rate-pair-inline-layer {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  min-height: 0;\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n}\n.activities-rate-image-loader {\n  position: absolute;\n  inset: 0;\n  z-index: 2;\n  display: grid;\n  place-items: center;\n  pointer-events: none;\n  opacity: 0;\n  transition: opacity 120ms ease;\n}\n.activities-rate-image-loader app-indicator {\n  position: relative;\n  z-index: 1;\n}\n.activities-rate-pair-inline-layer.lazy-bg-loading .activities-rate-image-loader,\n.activities-rate-profile-layer.lazy-bg-loading .activities-rate-image-loader {\n  opacity: 1;\n}\n.activities-rate-pair-inline-layer.lazy-bg-loaded .activities-rate-image-loader,\n.activities-rate-profile-layer.lazy-bg-loaded .activities-rate-image-loader,\n.activities-rate-pair-inline-layer.lazy-bg-error .activities-rate-image-loader,\n.activities-rate-profile-layer.lazy-bg-error .activities-rate-image-loader {\n  opacity: 0;\n}\n.activities-rate-pair-inline-layer::after,\n.activities-rate-profile-layer::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  z-index: 0;\n  pointer-events: none;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(12, 22, 36, 0.04) 0%,\n      rgba(7, 16, 28, 0.62) 66%,\n      rgba(7, 16, 28, 0.84) 100%);\n}\n.activities-rate-pair-inline-layer .card-image-placeholder {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 4;\n}\n.activities-rate-pair-inline-card.is-pane-loading .activities-rate-profile-indicators .image-stack-line.active,\n.activities-rate-profile-stack.is-pane-loading .activities-rate-profile-indicators .image-stack-line.active {\n  animation: activities-rate-pane-loading-pulse 500ms ease;\n}\n@keyframes activities-rate-pane-loading-pulse {\n  0% {\n    transform: scaleX(0.84);\n    opacity: 0.58;\n  }\n  100% {\n    transform: scaleX(1);\n    opacity: 1;\n  }\n}\n.activities-rate-pair-inline-label {\n  position: absolute;\n  top: 0.64rem;\n  left: 0.52rem;\n  z-index: 5;\n  border-radius: 999px;\n  border: 1px solid rgba(212, 229, 249, 0.42);\n  color: #f5f9ff;\n  font-size: 0.66rem;\n  font-weight: 700;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.16rem 0.42rem;\n  background: rgba(8, 18, 35, 0.62);\n}\n.activities-rate-pair-inline-card-woman .activities-rate-pair-inline-label {\n  background: rgba(109, 42, 118, 0.64);\n}\n.activities-rate-pair-inline-card-man .activities-rate-pair-inline-label {\n  background: rgba(36, 74, 127, 0.66);\n}\n.shared-card-status-badge {\n  position: absolute;\n  top: 0.64rem;\n  right: 0.56rem;\n  z-index: 80;\n  max-width: calc(100% - 1.24rem);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  border-radius: 999px;\n  border: 1px solid rgba(148, 225, 182, 0.56);\n  background: rgba(8, 34, 18, 0.74);\n  color: #e9ffef;\n  font-size: 0.68rem;\n  font-weight: 700;\n  letter-spacing: 0.01em;\n  line-height: 1;\n  padding: 0.17rem 0.5rem;\n  pointer-events: none;\n}\n.shared-card-context-avatar-badge {\n  position: absolute;\n  top: 0.68rem;\n  left: 0.62rem;\n  z-index: 30;\n  width: 2.08rem;\n  height: 2.08rem;\n  display: inline-grid;\n  place-items: center;\n  border: 2px solid rgba(255, 255, 255, 0.84);\n  border-radius: 999px;\n  background: rgba(8, 18, 35, 0.74);\n  color: #f7fbff;\n  box-shadow: 0 7px 16px rgba(4, 12, 26, 0.36), inset 0 0 0 1px rgba(15, 35, 58, 0.26);\n  overflow: visible;\n  pointer-events: auto;\n  touch-action: manipulation;\n}\nbutton.shared-card-context-avatar-badge {\n  cursor: pointer;\n}\n.shared-card-context-avatar-badge img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  border-radius: inherit;\n}\n.shared-card-context-avatar-badge > span {\n  font-size: 0.68rem;\n  font-weight: 900;\n  line-height: 1;\n}\n.shared-card-context-avatar-badge em {\n  position: absolute;\n  top: -0.74rem;\n  right: -0.72rem;\n  z-index: 2;\n  min-width: 1rem;\n  height: 1rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border: 1px solid rgba(255, 255, 255, 0.88);\n  border-radius: 999px;\n  background: #d94c4c;\n  color: #fff;\n  font-size: 0.54rem;\n  font-style: normal;\n  font-weight: 900;\n  line-height: 1;\n  padding: 0 0.16rem;\n  box-shadow: 0 4px 10px rgba(77, 12, 24, 0.32);\n}\n.activities-rate-pair-inline-overlay,\n.activities-rate-profile-overlay {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 3;\n  display: grid;\n  gap: 0.14rem;\n}\n.activities-rate-pair-inline-overlay {\n  padding: 0.7rem 0.72rem 0.68rem;\n}\n.activities-rate-pair-inline-card .activities-rate-profile-indicators.activities-rate-pair-inline-indicators {\n  top: 0.28rem;\n  left: 0.34rem;\n  right: 0.34rem;\n  padding: 0.12rem 0.24rem;\n  border-radius: 7px;\n}\n.activities-rate-pair-inline-hit-area {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 4;\n}\n.activities-rate-profile-layer {\n  position: absolute;\n  inset: 0;\n  z-index: 1;\n  border-radius: 14px;\n  overflow: hidden;\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n  border: 1px solid rgba(255, 255, 255, 0.26);\n  box-shadow: 0 12px 24px rgba(6, 18, 36, 0.34);\n}\n:host([data-card-presentation=list]) .activities-rate-pair-inline-layer,\n:host([data-card-presentation=list]) .activities-rate-profile-layer {\n  background-size: contain;\n}\n.activities-rate-profile-layer-active {\n  pointer-events: none;\n}\n.activities-rate-profile-indicators {\n  position: absolute;\n  top: 0.36rem;\n  left: 0.52rem;\n  right: 0.52rem;\n  z-index: 10;\n  padding: 0.16rem 0.34rem;\n  border-radius: 8px;\n  background: rgba(10, 18, 31, 0.38);\n  gap: 5px;\n}\n.activities-rate-profile-indicators .image-stack-line {\n  height: 4px;\n  border: 1px solid rgba(28, 42, 64, 0.36);\n  background: rgba(167, 177, 192, 0.9);\n  opacity: 1;\n}\n.activities-rate-profile-indicators .image-stack-line.active {\n  border-color: rgba(248, 252, 255, 0.86);\n  background: rgba(250, 252, 255, 0.98);\n  box-shadow: 0 0 0 1px rgba(10, 20, 34, 0.12);\n}\n.activities-rate-profile-hit-area {\n  top: 0.2rem;\n  left: 0.2rem;\n  right: 0.2rem;\n  bottom: 0.2rem;\n  z-index: 4;\n}\n.shared-card-profile-view-btn {\n  position: absolute;\n  right: 0.56rem;\n  bottom: 0.56rem;\n  z-index: 18;\n  width: 2.22rem;\n  height: 2.22rem;\n  border: 1px solid rgba(41, 99, 143, 0.28);\n  border-radius: 999px;\n  background: rgba(232, 246, 251, 0.94);\n  color: #226d83;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  box-shadow: 0 8px 18px rgba(6, 24, 44, 0.2);\n  cursor: pointer;\n  pointer-events: auto;\n  transition:\n    background 0.16s ease,\n    border-color 0.16s ease,\n    transform 0.16s ease;\n  -webkit-tap-highlight-color: transparent;\n}\n.shared-card-profile-view-btn:hover,\n.shared-card-profile-view-btn:focus-visible {\n  background: rgba(218, 241, 249, 0.98);\n  border-color: rgba(31, 124, 153, 0.44);\n  transform: translateY(-1px);\n  outline: none;\n}\n.shared-card-profile-view-btn .mat-icon {\n  width: 1.34rem;\n  height: 1.34rem;\n  font-size: 1.34rem;\n  line-height: 1.34rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.activities-rate-pair-inline-card .shared-card-profile-view-btn {\n  right: 0.44rem;\n  bottom: 0.44rem;\n  width: 2rem;\n  height: 2rem;\n}\n.activities-rate-profile-overlay {\n  padding: 0.74rem 0.8rem 0.72rem;\n}\n.activities-rate-profile-line {\n  margin: 0;\n  color: #f5f9ff !important;\n  text-shadow: 0 2px 9px rgba(2, 8, 16, 0.96);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.activities-rate-profile-line-primary {\n  font-size: 0.9rem;\n  font-weight: 800;\n}\n.activities-rate-profile-line-secondary {\n  font-size: 0.76rem;\n  font-weight: 700;\n  color: rgba(237, 245, 255, 0.98) !important;\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-given .activities-rate-profile-layer {\n  border-color: rgba(63, 136, 208, 0.52);\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-received .activities-rate-profile-layer {\n  border-color: rgba(53, 160, 114, 0.52);\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-mutual .activities-rate-profile-layer {\n  border-color: rgba(176, 121, 48, 0.52);\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-met .activities-rate-profile-layer {\n  border-color: rgba(104, 118, 139, 0.52);\n}\n.activities-rate-score-badge {\n  min-height: 26px;\n  border: 2px solid rgba(187, 136, 22, 0.58);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #fff9e9 0%,\n      #fff1cb 100%);\n  color: #9f6915;\n  font-size: 0.76rem;\n  font-weight: 800;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n  padding: 0.16rem 0.56rem;\n  cursor: pointer;\n  transform: translateY(0) scale(1);\n  box-shadow: inset 0 0 0 1px rgba(255, 245, 215, 0.72), 0 0 0 rgba(226, 171, 47, 0);\n  transition:\n    transform 0.16s ease,\n    box-shadow 0.2s ease,\n    border-color 0.2s ease,\n    filter 0.2s ease;\n}\n.activities-rate-score-badge .mat-icon {\n  width: 14px;\n  height: 14px;\n  font-size: 14px;\n  line-height: 14px;\n}\n.activities-rate-score-badge-floating {\n  position: absolute;\n  top: 0.6rem;\n  right: 0.3rem;\n  z-index: 24;\n  min-width: 68px;\n  justify-content: center;\n}\n.activities-rate-score-badge-between {\n  --activities-rate-badge-between-y: -50%;\n  position: absolute;\n  left: 50%;\n  right: auto;\n  top: 50%;\n  z-index: 24;\n  min-width: 68px;\n  width: max-content;\n  max-width: calc(100% - 0.8rem);\n  justify-content: center;\n  white-space: nowrap;\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n  transition:\n    box-shadow 0.2s ease,\n    border-color 0.2s ease,\n    filter 0.2s ease;\n}\n.activities-rate-profile-stack-pair-inline .activities-rate-score-badge-between {\n  --activities-rate-badge-between-y: 0;\n  top: auto;\n  bottom: clamp(3.2rem, 18%, 4.2rem);\n  left: 50% !important;\n  right: auto !important;\n  transform: translate(-50%, var(--activities-rate-badge-between-y)) !important;\n}\n.activities-rate-profile-stack-pair-inline .activities-rate-score-badge-between:not(.is-disabled):hover,\n.activities-rate-profile-stack-pair-inline .activities-rate-score-badge-between:not(.is-disabled):active,\n.activities-rate-profile-stack-pair-inline .activities-rate-score-badge-between.is-active:not(.is-disabled),\n.activities-rate-profile-stack-pair-inline .activities-rate-score-badge-between.is-active.is-pending:not(.is-disabled),\n.activities-rate-profile-stack-pair-inline .activities-rate-score-badge-between.is-disabled {\n  left: 50% !important;\n  right: auto !important;\n  transform: translate(-50%, 0) !important;\n}\n.activities-rates-fullscreen .activities-rate-score-badge-floating.activities-rate-score-badge-floating-pair-overlap {\n  --activities-rate-badge-between-y: 0;\n  top: auto;\n  bottom: clamp(3.2rem, 11%, 4.6rem);\n  left: var(--activities-pair-split, 50%);\n  right: auto;\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n  min-width: 68px;\n  width: max-content;\n  max-width: calc(100% - 0.8rem);\n  justify-content: center;\n  white-space: nowrap;\n}\n.activities-rates-fullscreen .activities-rate-score-badge-floating.activities-rate-score-badge-floating-pair-overlap.is-active:not(.is-disabled),\n.activities-rates-fullscreen .activities-rate-score-badge-floating.activities-rate-score-badge-floating-pair-overlap:not(.is-disabled):active {\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n@media (hover: hover) and (pointer: fine) {\n  button.activities-rate-score-badge:not(.is-disabled):hover {\n    transform: translateY(-1px) scale(1.03);\n    box-shadow: 0 6px 14px rgba(203, 150, 34, 0.28);\n    filter: saturate(1.05);\n  }\n}\nbutton.activities-rate-score-badge:not(.is-disabled):active {\n  transform: translateY(0) scale(0.96);\n  box-shadow: 0 2px 8px rgba(146, 105, 16, 0.22);\n}\nbutton.activities-rate-score-badge-between:not(.is-disabled):hover,\nbutton.activities-rate-score-badge-between:not(.is-disabled):active {\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n.activities-rate-score-badge.is-pending {\n  border-color: rgba(187, 56, 71, 0.62);\n  background:\n    linear-gradient(\n      180deg,\n      #ffe9ed 0%,\n      #ffd9df 100%);\n  color: #b63545;\n}\n.activities-rate-score-badge.is-active:not(.is-disabled) {\n  border-color: rgba(206, 148, 25, 0);\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ca 0%,\n      #ffe7a8 100%);\n  color: #8b560f;\n  box-shadow: none;\n  transform: translateY(0) scale(1);\n}\n.activities-rate-score-badge-between.is-active:not(.is-disabled),\n.activities-rate-score-badge-between.is-active.is-pending:not(.is-disabled) {\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n.activities-rate-score-badge.is-active.is-pending:not(.is-disabled) {\n  border-color: rgba(188, 53, 72, 0);\n  background:\n    linear-gradient(\n      180deg,\n      #ffdce4 0%,\n      #ffc8d3 100%);\n  color: #9d2232;\n  box-shadow: none;\n}\n@media (hover: hover) and (pointer: fine) {\n  button.activities-rate-score-badge.is-active:not(.is-disabled):hover {\n    border-color: rgba(206, 148, 25, 0.76);\n    box-shadow: 0 0 0 2px rgba(255, 244, 201, 0.68), 0 9px 16px rgba(170, 117, 20, 0.26);\n  }\n  button.activities-rate-score-badge.is-active.is-pending:not(.is-disabled):hover {\n    border-color: rgba(188, 53, 72, 0.72);\n    box-shadow: 0 0 0 2px rgba(255, 230, 236, 0.72), 0 9px 16px rgba(170, 48, 68, 0.24);\n  }\n}\n.activities-rate-score-badge.is-blink:not(.is-disabled) {\n  animation: game-rating-stars-blink 0.42s ease-in-out 1;\n}\n@keyframes game-rating-stars-blink {\n  0%, 100% {\n    filter: brightness(1);\n  }\n  50% {\n    filter: brightness(1.12) saturate(1.1);\n  }\n}\n.activities-rate-score-badge.is-disabled {\n  border-color: rgba(111, 123, 140, 0.52);\n  background:\n    linear-gradient(\n      180deg,\n      #f4f6f9 0%,\n      #e8edf3 100%);\n  color: #617085;\n  cursor: default;\n  transform: none;\n  box-shadow: none;\n  transition: none;\n}\n.activities-rate-score-badge-between.is-disabled {\n  right: auto;\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n.activities-rate-score-badge[disabled],\nspan.activities-rate-score-badge {\n  pointer-events: none;\n}\nspan.activities-rate-score-badge {\n  cursor: default;\n  transition: none;\n}\n.image-stack-indicators {\n  position: absolute;\n  top: -0.1rem;\n  left: 0.25rem;\n  right: 0.25rem;\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));\n  gap: 4px;\n  width: auto !important;\n}\n.image-stack-hit-area {\n  position: absolute;\n  top: 10px;\n  left: 10px;\n  right: 10px;\n  bottom: 10px;\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));\n  gap: 4px;\n  z-index: 2;\n}\n.image-stack-hit-segment {\n  border: 0;\n  background: transparent;\n  padding: 0;\n  cursor: pointer;\n  width: 100%;\n  height: 100%;\n}\n.card-image-placeholder {\n  width: 84px;\n  height: 84px;\n  border-radius: 50%;\n  background:\n    linear-gradient(\n      145deg,\n      #4f7cff,\n      #7a3eff 60%,\n      #f04eab);\n  color: #fff;\n  font-weight: 800;\n  font-size: 1.72rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  letter-spacing: 0.03em;\n}\n.activities-rates-fullscreen {\n  position: relative;\n  display: flex;\n  justify-content: center;\n  align-items: flex-start;\n  width: 100%;\n  height: 100%;\n  min-width: 0;\n  min-height: 0;\n}\n.activities-rates-fullscreen-card {\n  margin: 0;\n  flex: 0 0 auto;\n  touch-action: pan-y;\n  width: 100%;\n  height: 100%;\n  max-width: 100%;\n  max-height: 100%;\n}\n.activities-rates-fullscreen .image-stack-line,\n.activities-rates-fullscreen .image-stack-hit-segment {\n  pointer-events: auto;\n}\n.activities-rates-fullscreen .activities-rate-profile-card {\n  min-height: 0;\n  background: #e6edf7;\n}\n.activities-rates-fullscreen .activities-rate-profile-stack {\n  min-height: 0;\n  height: 100%;\n  background: #d7e1ef;\n}\n.activities-rates-fullscreen-card-active .activities-rate-profile-layer {\n  background-color: #d3ddea;\n}\n/*# sourceMappingURL=single-card.component.css.map */\n'] }]
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

// src/app/shared/ui/components/core/smart-list/card/single-row/single-row.component.ts
var _c02 = () => [];
function SingleRowComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-indicator", 1);
  }
}
function SingleRowComponent_Conditional_2_For_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const badge_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(badge_r1.icon);
  }
}
function SingleRowComponent_Conditional_2_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 3);
    \u0275\u0275conditionalCreate(1, SingleRowComponent_Conditional_2_For_2_Conditional_1_Template, 2, 1, "mat-icon");
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const badge_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngClass", ctx_r1.badgeClassList(badge_r1));
    \u0275\u0275attribute("aria-label", badge_r1.ariaLabel)("title", badge_r1.title || badge_r1.ariaLabel || null);
    \u0275\u0275advance();
    \u0275\u0275conditional(badge_r1.icon ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(badge_r1.label);
  }
}
function SingleRowComponent_Conditional_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 12);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "counterBadge");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r1.rowCounterValue()));
  }
}
function SingleRowComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 2);
    \u0275\u0275repeaterCreate(1, SingleRowComponent_Conditional_2_For_2_Template, 4, 5, "span", 3, \u0275\u0275componentInstance().trackByBadge, true);
    \u0275\u0275conditionalCreate(3, SingleRowComponent_Conditional_2_Conditional_3_Template, 3, 3, "span", 12);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.topRightBadges());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.rowCounterValue() > 0 ? 3 : -1);
  }
}
function SingleRowComponent_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 13);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("src", ctx_r1.avatarImageUrl(), \u0275\u0275sanitizeUrl);
  }
}
function SingleRowComponent_Conditional_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.row == null ? null : ctx_r1.row.icon);
  }
}
function SingleRowComponent_Conditional_3_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.row == null ? null : ctx_r1.row.avatarInitials, " ");
  }
}
function SingleRowComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 3);
    \u0275\u0275conditionalCreate(1, SingleRowComponent_Conditional_3_Conditional_1_Template, 1, 1, "img", 13)(2, SingleRowComponent_Conditional_3_Conditional_2_Template, 2, 1, "mat-icon")(3, SingleRowComponent_Conditional_3_Conditional_3_Template, 1, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", ctx_r1.avatarClassList());
    \u0275\u0275attribute("aria-label", ctx_r1.row == null ? null : ctx_r1.row.avatarAriaLabel);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.avatarImageUrl() ? 1 : (ctx_r1.row == null ? null : ctx_r1.row.icon) ? 2 : 3);
  }
}
function SingleRowComponent_Conditional_8_For_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const badge_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(badge_r3.icon);
  }
}
function SingleRowComponent_Conditional_8_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 3);
    \u0275\u0275conditionalCreate(1, SingleRowComponent_Conditional_8_For_2_Conditional_1_Template, 2, 1, "mat-icon");
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const badge_r3 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngClass", ctx_r1.badgeClassList(badge_r3));
    \u0275\u0275attribute("aria-label", badge_r3.ariaLabel)("title", badge_r3.title || badge_r3.ariaLabel || null);
    \u0275\u0275advance();
    \u0275\u0275conditional(badge_r3.icon ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(badge_r3.label);
  }
}
function SingleRowComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 7);
    \u0275\u0275repeaterCreate(1, SingleRowComponent_Conditional_8_For_2_Template, 4, 5, "span", 3, \u0275\u0275componentInstance().trackByBadge, true);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.inlineBadges());
  }
}
function SingleRowComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.row == null ? null : ctx_r1.row.subtitle);
  }
}
function SingleRowComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.row == null ? null : ctx_r1.row.detail);
  }
}
function SingleRowComponent_Conditional_11_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const meta_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(meta_r4);
  }
}
function SingleRowComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 10);
    \u0275\u0275repeaterCreate(1, SingleRowComponent_Conditional_11_For_2_Template, 2, 1, "span", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater((ctx_r1.row == null ? null : ctx_r1.row.metaRows) ?? \u0275\u0275pureFunction0(0, _c02));
  }
}
function SingleRowComponent_Conditional_12_Conditional_1_For_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const badge_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(badge_r5.icon);
  }
}
function SingleRowComponent_Conditional_12_Conditional_1_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 3);
    \u0275\u0275conditionalCreate(1, SingleRowComponent_Conditional_12_Conditional_1_For_2_Conditional_1_Template, 2, 1, "mat-icon");
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const badge_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("ngClass", ctx_r1.badgeClassList(badge_r5));
    \u0275\u0275attribute("aria-label", badge_r5.ariaLabel)("title", badge_r5.title || badge_r5.ariaLabel || null);
    \u0275\u0275advance();
    \u0275\u0275conditional(badge_r5.icon ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(badge_r5.label);
  }
}
function SingleRowComponent_Conditional_12_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 14);
    \u0275\u0275repeaterCreate(1, SingleRowComponent_Conditional_12_Conditional_1_For_2_Template, 4, 5, "span", 3, \u0275\u0275componentInstance().trackByBadge, true);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.sideBadges());
  }
}
function SingleRowComponent_Conditional_12_Conditional_2_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 18);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "counterBadge");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r1.menuBadgeValue()));
  }
}
function SingleRowComponent_Conditional_12_Conditional_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 17);
    \u0275\u0275listener("pointerdown", function SingleRowComponent_Conditional_12_Conditional_2_Conditional_0_Template_button_pointerdown_0_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onSharedMenuTriggerPointerDown($event));
    })("click", function SingleRowComponent_Conditional_12_Conditional_2_Conditional_0_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onSharedMenuTriggerClick($event));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, SingleRowComponent_Conditional_12_Conditional_2_Conditional_0_Conditional_3_Template, 3, 3, "span", 18);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("is-open", ctx_r1.menuOpen);
    \u0275\u0275property("disabled", (ctx_r1.row == null ? null : ctx_r1.row.progressRing) === true);
    \u0275\u0275attribute("aria-label", ctx_r1.menuOpen ? "Close menu" : "Open menu");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.menuOpen ? "close" : "more_vert");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.menuBadgeValue() > 0 ? 3 : -1);
  }
}
function SingleRowComponent_Conditional_12_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-menu", 19);
    \u0275\u0275listener("itemSelect", function SingleRowComponent_Conditional_12_Conditional_2_Conditional_1_Template_app_menu_itemSelect_0_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onMenuActionSelected($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("title", ctx_r1.rowMenuTitle())("trigger", ctx_r1.rowMenuTrigger())("items", ctx_r1.rowMenuItems())("panelAlign", "auto")("mobileBreakpointPx", 900);
  }
}
function SingleRowComponent_Conditional_12_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, SingleRowComponent_Conditional_12_Conditional_2_Conditional_0_Template, 4, 6, "button", 15)(1, SingleRowComponent_Conditional_12_Conditional_2_Conditional_1_Template, 1, 5, "app-menu", 16);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(ctx_r1.useSharedMenu ? 0 : 1);
  }
}
function SingleRowComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 11);
    \u0275\u0275conditionalCreate(1, SingleRowComponent_Conditional_12_Conditional_1_Template, 3, 0, "span", 14);
    \u0275\u0275conditionalCreate(2, SingleRowComponent_Conditional_12_Conditional_2_Template, 2, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.sideBadges().length > 0 ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.hasMenuActions() ? 2 : -1);
  }
}
var SingleRowComponent = class _SingleRowComponent {
  cdr = inject(ChangeDetectorRef);
  row = null;
  clickable = false;
  ariaLabel = null;
  useSharedMenu = false;
  sharedMenuContext = null;
  rowClick = new EventEmitter();
  menuAction = new EventEmitter();
  menuRequest = new EventEmitter();
  menuOpen = false;
  isClickable() {
    return this.clickable || this.row?.clickable === true;
  }
  rootClassList() {
    const classes = ["ui-single-row"];
    const toneClass = `${this.row?.toneClass ?? ""}`.trim();
    if (toneClass) {
      classes.push(toneClass);
    }
    const surfaceTone = this.row?.surfaceTone ?? "default";
    if (surfaceTone !== "default") {
      classes.push(`ui-single-row--tone-${surfaceTone}`);
    }
    if (this.isClickable()) {
      classes.push("ui-single-row--clickable");
    }
    if (this.row?.progressRing === true) {
      classes.push("ui-single-row--progress-ring");
    }
    if (!this.hasLeadingVisual()) {
      classes.push("ui-single-row--no-leading");
    }
    if (this.hasTopRightContent()) {
      classes.push("ui-single-row--with-top-right");
    }
    if (this.hasMenuActions()) {
      classes.push("ui-single-row--with-menu-actions");
    }
    return classes;
  }
  avatarClassList() {
    const classes = ["ui-single-row__avatar"];
    const avatarToneClass = `${this.row?.avatarToneClass ?? ""}`.trim();
    if (avatarToneClass) {
      classes.push(avatarToneClass);
    }
    classes.push(`ui-single-row__avatar--${this.row?.avatarShape ?? "circle"}`);
    return classes;
  }
  hasLeadingVisual() {
    return Boolean(this.row?.avatarUrl || this.row?.icon || this.row?.avatarInitials);
  }
  avatarImageUrl() {
    return AppUtils.mediaImageVariantUrl(this.row?.avatarUrl, "small");
  }
  rowAccentHue() {
    const hue = Math.trunc(Number(this.row?.accentHue));
    return Number.isFinite(hue) ? `${AppUtils.clampNumber(hue, 0, 360)}` : null;
  }
  inlineBadges() {
    return this.badgesFor("inline");
  }
  topRightBadges() {
    return this.badgesFor("top-right");
  }
  sideBadges() {
    const badges = this.badgesFor("side");
    const sideLabel = `${this.row?.sideLabel ?? ""}`.trim();
    if (!sideLabel) {
      return badges;
    }
    return [
      {
        label: sideLabel,
        icon: this.row?.sideLabelIcon ?? null,
        tone: this.row?.sideLabelTone ?? "inverse",
        position: "side"
      },
      ...badges
    ];
  }
  rowCounterValue() {
    return this.nonNegativeInteger(this.row?.unread);
  }
  hasTopRightContent() {
    return this.topRightBadges().length > 0 || this.rowCounterValue() > 0;
  }
  menuBadgeValue() {
    return this.rowCounterValue() > 0 ? 0 : this.nonNegativeInteger(this.row?.badgeCount);
  }
  hasSideContent() {
    return this.sideBadges().length > 0 || this.hasMenuActions();
  }
  hasMenuActions() {
    return (this.row?.menuActions?.length ?? 0) > 0;
  }
  badgeClassList(badge) {
    const classes = [
      "ui-single-row__badge-pill",
      `ui-single-row__badge-pill--${badge.tone ?? "default"}`
    ];
    const className = `${badge.className ?? ""}`.trim();
    if (className) {
      classes.push(className);
    }
    return classes;
  }
  rowMenuTitle() {
    const title = `${this.row?.title ?? ""}`.trim();
    return title || null;
  }
  rowMenuTrigger() {
    const menuBadgeCount = this.menuBadgeValue();
    return {
      icon: "more_vert",
      closeIcon: "close",
      hideLabel: true,
      layout: "icon",
      palette: "default",
      counter: menuBadgeCount > 0 ? { value: menuBadgeCount, max: 99 } : null,
      ariaLabel: "Open menu"
    };
  }
  rowMenuItems() {
    const row = this.row;
    if (!row?.menuActions?.length) {
      return [];
    }
    return row.menuActions.flatMap((actionId) => {
      const config = CARD_MENU_ACTIONS[actionId];
      if (!config) {
        return [];
      }
      const action = __spreadValues({
        id: actionId
      }, config);
      return [{
        id: actionId,
        label: config.label,
        icon: config.icon,
        palette: this.sharedMenuActionPalette(config.tone),
        surface: "tinted",
        context: __spreadProps(__spreadValues({}, this.sharedMenuContext ?? {}), {
          row,
          card: row,
          action
        })
      }];
    });
  }
  trackByBadge(index, badge) {
    return `${badge.position ?? "side"}:${badge.label}:${badge.icon ?? ""}:${badge.tone ?? ""}:${index}`;
  }
  onRowClick(event) {
    if (!this.isClickable()) {
      return;
    }
    this.rowClick.emit(event);
  }
  onRowKeydown(event) {
    if (!this.isClickable() || event.key !== "Enter" && event.key !== " ") {
      return;
    }
    event.preventDefault();
    this.rowClick.emit(event);
  }
  onSharedMenuTriggerPointerDown(event) {
    event.stopPropagation();
  }
  onSharedMenuTriggerClick(event) {
    event.preventDefault();
    event.stopPropagation();
    const row = this.row;
    if (!row || row.progressRing === true || !this.hasMenuActions()) {
      return;
    }
    const trigger = event.currentTarget;
    this.menuOpen = true;
    this.menuRequest.emit({
      id: row.id,
      card: row,
      actions: row.menuActions ?? [],
      kind: "select",
      title: this.rowMenuTitle(),
      items: this.rowMenuItems(),
      triggerRect: this.resolveMenuTriggerRect(trigger),
      openUp: false,
      panelAlign: "end",
      closeOnSelect: true,
      closeTrigger: () => {
        this.menuOpen = false;
        this.cdr.markForCheck();
      }
    });
    this.cdr.markForCheck();
  }
  onMenuActionSelected(event) {
    const action = event.context?.action;
    if (!this.row || !action) {
      return;
    }
    this.menuAction.emit({
      id: this.row.id,
      actionId: action.id,
      action,
      card: this.row
    });
  }
  sharedMenuActionPalette(tone) {
    switch (tone) {
      case "positive":
        return "teal";
      case "accent":
        return "brown";
      case "warning":
      case "review":
        return "orange";
      case "destructive":
        return "danger";
      default:
        return "default";
    }
  }
  badgesFor(position) {
    return (this.row?.badges ?? []).filter((badge) => (badge.position ?? "side") === position);
  }
  nonNegativeInteger(value) {
    return Math.max(0, Math.trunc(Number(value ?? 0) || 0));
  }
  resolveMenuTriggerRect(trigger) {
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
  static \u0275fac = function SingleRowComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SingleRowComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SingleRowComponent, selectors: [["single-row"]], inputs: { row: "row", clickable: "clickable", ariaLabel: "ariaLabel", useSharedMenu: "useSharedMenu", sharedMenuContext: "sharedMenuContext" }, outputs: { rowClick: "rowClick", menuAction: "menuAction", menuRequest: "menuRequest" }, decls: 13, vars: 18, consts: [[1, "motion-static", 3, "click", "keydown", "ngClass"], ["kind", "action-ring", "shape", "surface", "state", "loading", 1, "ui-single-row__progress-ring"], [1, "ui-single-row__top-right"], [3, "ngClass"], [1, "ui-single-row__main"], [1, "ui-single-row__headline"], [1, "ui-single-row__title"], [1, "ui-single-row__inline-badges"], [1, "ui-single-row__subtitle"], [1, "ui-single-row__detail"], [1, "ui-single-row__meta"], [1, "ui-single-row__side"], [1, "card-badge", "ui-single-row__corner-counter"], ["alt", "", 3, "src"], [1, "ui-single-row__side-badges"], ["type", "button", 1, "ui-single-row__menu-trigger", 3, "is-open", "disabled"], ["kind", "select", 1, "ui-single-row__menu", 3, "title", "trigger", "items", "panelAlign", "mobileBreakpointPx"], ["type", "button", 1, "ui-single-row__menu-trigger", 3, "pointerdown", "click", "disabled"], [1, "card-badge", "ui-single-row__menu-badge"], ["kind", "select", 1, "ui-single-row__menu", 3, "itemSelect", "title", "trigger", "items", "panelAlign", "mobileBreakpointPx"]], template: function SingleRowComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "article", 0);
      \u0275\u0275listener("click", function SingleRowComponent_Template_article_click_0_listener($event) {
        return ctx.onRowClick($event);
      })("keydown", function SingleRowComponent_Template_article_keydown_0_listener($event) {
        return ctx.onRowKeydown($event);
      });
      \u0275\u0275conditionalCreate(1, SingleRowComponent_Conditional_1_Template, 1, 0, "app-indicator", 1);
      \u0275\u0275conditionalCreate(2, SingleRowComponent_Conditional_2_Template, 4, 1, "span", 2);
      \u0275\u0275conditionalCreate(3, SingleRowComponent_Conditional_3_Template, 4, 3, "span", 3);
      \u0275\u0275elementStart(4, "span", 4)(5, "span", 5)(6, "span", 6);
      \u0275\u0275text(7);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(8, SingleRowComponent_Conditional_8_Template, 3, 0, "span", 7);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, SingleRowComponent_Conditional_9_Template, 2, 1, "span", 8);
      \u0275\u0275conditionalCreate(10, SingleRowComponent_Conditional_10_Template, 2, 1, "span", 9);
      \u0275\u0275conditionalCreate(11, SingleRowComponent_Conditional_11_Template, 3, 1, "span", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(12, SingleRowComponent_Conditional_12_Template, 3, 2, "span", 11);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275styleProp("--ui-single-row-accent-hue", ctx.rowAccentHue());
      \u0275\u0275property("ngClass", ctx.rootClassList());
      \u0275\u0275attribute("role", ctx.isClickable() ? "button" : null)("tabindex", ctx.isClickable() ? 0 : null)("aria-label", ctx.ariaLabel)("aria-busy", (ctx.row == null ? null : ctx.row.progressRing) === true ? "true" : null)("data-group-label", ctx.row == null ? null : ctx.row.groupLabel)("data-single-row-id", ctx.row == null ? null : ctx.row.id);
      \u0275\u0275advance();
      \u0275\u0275conditional((ctx.row == null ? null : ctx.row.progressRing) === true ? 1 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.hasTopRightContent() ? 2 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.hasLeadingVisual() ? 3 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.row == null ? null : ctx.row.title);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.inlineBadges().length > 0 ? 8 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((ctx.row == null ? null : ctx.row.subtitle) ? 9 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((ctx.row == null ? null : ctx.row.detail) ? 10 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(((ctx.row == null ? null : ctx.row.metaRows == null ? null : ctx.row.metaRows.length) ?? 0) > 0 ? 11 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.hasSideContent() ? 12 : -1);
    }
  }, dependencies: [
    CommonModule,
    NgClass,
    MatIconModule,
    MatIcon,
    AppMenuComponent,
    IndicatorComponent,
    CounterBadgePipe
  ], styles: ['\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n.ui-single-row[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  min-width: 0;\n  min-height: 80px;\n  box-sizing: border-box;\n  border: 1px solid rgba(33, 51, 78, 0.14);\n  border-radius: 8px;\n  background: #fff;\n  padding: 0.48rem 0.55rem;\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  gap: 0.5rem;\n  align-items: center;\n  isolation: isolate;\n  transition:\n    box-shadow 0.16s ease,\n    background-color 0.16s ease,\n    border-color 0.16s ease,\n    color 0.16s ease;\n}\n.ui-single-row--with-top-right[_ngcontent-%COMP%] {\n  padding-top: 0.48rem;\n  padding-bottom: 0.62rem;\n}\n.ui-single-row--no-leading[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 1fr) auto;\n}\n.ui-single-row--clickable[_ngcontent-%COMP%] {\n  cursor: pointer;\n  -webkit-tap-highlight-color: transparent;\n}\n.ui-single-row--clickable[_ngcontent-%COMP%]:hover {\n  box-shadow: 0 10px 22px rgba(30, 52, 84, 0.12);\n}\n.ui-single-row__progress-ring[_ngcontent-%COMP%] {\n  inset: -2px;\n  z-index: 4;\n}\n.ui-single-row--progress-ring[_ngcontent-%COMP%]    > [_ngcontent-%COMP%]:not(.ui-single-row__progress-ring) {\n  opacity: 0.9;\n}\n.ui-single-row--tone-neutral[_ngcontent-%COMP%], \n.ui-single-row--tone-muted[_ngcontent-%COMP%] {\n  border-color: rgba(74, 88, 108, 0.18);\n  background: #f7f9fc;\n}\n.ui-single-row--tone-info[_ngcontent-%COMP%] {\n  border-color: rgba(45, 111, 181, 0.26);\n  background: #f3f8ff;\n}\n.ui-single-row--tone-accent[_ngcontent-%COMP%] {\n  border-color: rgba(122, 86, 190, 0.24);\n  background: #f8f5ff;\n}\n.ui-single-row--tone-success[_ngcontent-%COMP%] {\n  border-color: rgba(40, 132, 89, 0.24);\n  background: #f2fbf6;\n}\n.ui-single-row--tone-warning[_ngcontent-%COMP%] {\n  border-color: rgba(190, 129, 38, 0.28);\n  background: #fff8ed;\n}\n.ui-single-row--tone-danger[_ngcontent-%COMP%] {\n  border-color: rgba(190, 60, 76, 0.28);\n  background: #fff4f5;\n}\n.ui-single-row__top-right[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.7rem;\n  right: 0.7rem;\n  z-index: 2;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.2rem;\n  max-width: min(58%, 18rem);\n}\n.ui-single-row--with-top-right.ui-single-row--with-menu-actions[_ngcontent-%COMP%]   .ui-single-row__top-right[_ngcontent-%COMP%] {\n  right: 0.7rem;\n  max-width: min(46%, 18rem);\n}\n.ui-single-row__top-right[_ngcontent-%COMP%]   .ui-single-row__badge-pill[_ngcontent-%COMP%] {\n  min-width: 0;\n  max-width: 100%;\n}\n.ui-single-row__avatar[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  color: #fff;\n  background:\n    linear-gradient(\n      180deg,\n      #6ca6ff 0%,\n      #3d78d8 100%);\n  font-size: 11px;\n  font-weight: 800;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  overflow: hidden;\n  flex: 0 0 auto;\n}\n.ui-single-row__avatar.notification-system-avatar[_ngcontent-%COMP%] {\n  color: #fff;\n  border: 1px solid rgba(116, 226, 255, 0.72);\n  background:\n    radial-gradient(\n      circle at 30% 20%,\n      rgba(103, 232, 255, 0.96),\n      transparent 42%),\n    linear-gradient(\n      145deg,\n      #3948c8 0%,\n      #8a3fc0 58%,\n      #e94791 100%);\n  box-shadow: 0 4px 12px rgba(67, 48, 163, 0.3);\n}\n.ui-single-row__avatar.notification-stage-avatar[_ngcontent-%COMP%] {\n  position: relative;\n  color: hsl(var(--ui-single-row-accent-hue, 210), 72%, 30%);\n  border: 1px solid hsl(var(--ui-single-row-accent-hue, 210), 54%, 58%, 0.58);\n  background:\n    radial-gradient(\n      circle at 28% 18%,\n      hsl(var(--ui-single-row-accent-hue, 210), 90%, 98%, 0.9),\n      transparent 42%),\n    linear-gradient(\n      180deg,\n      hsl(var(--ui-single-row-accent-hue, 210), 82%, 97%) 0%,\n      hsl(var(--ui-single-row-accent-hue, 210), 64%, 86%) 100%);\n  box-shadow: 0 4px 12px hsl(var(--ui-single-row-accent-hue, 210), 42%, 36%, 0.2);\n}\n.ui-single-row__avatar.notification-stage-avatar--positive[_ngcontent-%COMP%] {\n  box-shadow:\n    0 0 0 3px hsl(var(--ui-single-row-accent-hue, 210), 78%, 70%, 0.2),\n    0 0 17px hsl(var(--ui-single-row-accent-hue, 210), 86%, 54%, 0.46),\n    0 5px 13px hsl(var(--ui-single-row-accent-hue, 210), 42%, 34%, 0.25);\n}\n.ui-single-row__avatar.notification-stage-avatar--negative[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  width: 28px;\n  height: 2px;\n  border-radius: 999px;\n  background: hsl(var(--ui-single-row-accent-hue, 210), 74%, 28%, 0.82);\n  box-shadow: 0 0 0 1px hsl(var(--ui-single-row-accent-hue, 210), 88%, 96%, 0.72);\n  transform: rotate(-45deg);\n}\n.ui-single-row__avatar--circle[_ngcontent-%COMP%] {\n  border-radius: 50%;\n}\n.ui-single-row__avatar--rounded[_ngcontent-%COMP%] {\n  border-radius: 8px;\n}\n.ui-single-row__avatar--square[_ngcontent-%COMP%] {\n  border-radius: 4px;\n}\n.ui-single-row__avatar[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n.ui-single-row__avatar[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.ui-single-row__badge-pill[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.ui-single-row__menu-trigger[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.ui-single-row__main[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.08rem;\n}\n.ui-single-row__headline[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.36rem;\n  overflow: hidden;\n}\n.ui-single-row__title[_ngcontent-%COMP%], \n.ui-single-row__subtitle[_ngcontent-%COMP%], \n.ui-single-row__detail[_ngcontent-%COMP%], \n.ui-single-row__meta[_ngcontent-%COMP%] {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.ui-single-row__title[_ngcontent-%COMP%] {\n  font-size: 0.84rem;\n  font-weight: 850;\n  color: #1f3658;\n  flex: 0 1 auto;\n}\n.ui-single-row__corner-counter[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  min-width: 24px;\n  height: 24px;\n  padding: 0 0.46rem;\n  border-radius: 999px;\n  border: 1px solid rgba(255, 221, 170, 0.92);\n  background:\n    linear-gradient(\n      180deg,\n      #f2a33a 0%,\n      #cc7a19 100%);\n  color: #fff7e8;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.72rem;\n  font-weight: 850;\n  line-height: 1;\n  white-space: nowrap;\n  box-shadow: 0 5px 12px rgba(173, 101, 21, 0.22);\n}\n.ui-single-row__subtitle[_ngcontent-%COMP%] {\n  font-size: 0.76rem;\n  color: rgba(20, 36, 58, 0.75);\n}\n.ui-single-row__detail[_ngcontent-%COMP%], \n.ui-single-row__meta[_ngcontent-%COMP%] {\n  font-size: 0.73rem;\n  color: rgba(20, 36, 58, 0.64);\n}\n.ui-single-row__meta[_ngcontent-%COMP%] {\n  display: inline-flex;\n  gap: 0.32rem;\n}\n.ui-single-row__inline-badges[_ngcontent-%COMP%], \n.ui-single-row__side-badges[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n}\n.ui-single-row__inline-badges[_ngcontent-%COMP%] {\n  flex: 0 1 auto;\n  overflow: hidden;\n}\n.ui-single-row__side[_ngcontent-%COMP%] {\n  justify-self: end;\n  align-self: center;\n  min-width: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.34rem;\n}\n.ui-single-row--with-top-right[_ngcontent-%COMP%]   .ui-single-row__side[_ngcontent-%COMP%] {\n  align-self: center;\n  padding-top: 0;\n}\n.ui-single-row--with-top-right.ui-single-row--with-menu-actions[_ngcontent-%COMP%]   .ui-single-row__side[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 2.48rem;\n  right: 0.7rem;\n  z-index: 2;\n}\n.ui-single-row__badge-pill[_ngcontent-%COMP%] {\n  min-height: 26px;\n  border-radius: 999px;\n  border: 1px solid rgba(33, 51, 78, 0.12);\n  background: rgba(255, 255, 255, 0.88);\n  color: #233a5b;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.22rem;\n  font-size: 0.72rem;\n  font-weight: 800;\n  padding: 0 0.56rem;\n  white-space: nowrap;\n  box-shadow: 0 5px 12px rgba(30, 52, 84, 0.08);\n}\n.ui-single-row__badge-pill[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  min-width: 0;\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.ui-single-row__badge-pill--inverse[_ngcontent-%COMP%] {\n  border-color: rgba(255, 255, 255, 0.88);\n  background: rgba(26, 45, 71, 0.84);\n  color: #fff;\n}\n.ui-single-row__badge-pill--info[_ngcontent-%COMP%] {\n  border-color: rgba(45, 111, 181, 0.22);\n  background: #eaf3ff;\n  color: #24598f;\n}\n.ui-single-row__badge-pill--accent[_ngcontent-%COMP%] {\n  border-color: rgba(122, 86, 190, 0.22);\n  background: #f1ebff;\n  color: #6544a0;\n}\n.ui-single-row__badge-pill--success[_ngcontent-%COMP%] {\n  border-color: rgba(40, 132, 89, 0.22);\n  background: #e7f7ee;\n  color: #28774e;\n}\n.ui-single-row__badge-pill--warning[_ngcontent-%COMP%] {\n  border-color: rgba(190, 129, 38, 0.24);\n  background: #fff1d9;\n  color: #8c5a16;\n}\n.ui-single-row__badge-pill--danger[_ngcontent-%COMP%] {\n  border-color: rgba(190, 60, 76, 0.24);\n  background: #ffe7ea;\n  color: #9c3040;\n}\n.ui-single-row__menu-trigger[_ngcontent-%COMP%] {\n  position: relative;\n  width: 32px;\n  min-width: 32px;\n  height: 32px;\n  border: 1px solid rgba(33, 51, 78, 0.14);\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.94);\n  color: #2d4b73;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.24rem;\n  padding: 0;\n  cursor: pointer;\n  transition:\n    background-color 0.16s ease,\n    border-color 0.16s ease,\n    color 0.16s ease,\n    transform 0.16s ease;\n}\n.ui-single-row__menu-trigger[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n}\n.ui-single-row__menu-trigger[_ngcontent-%COMP%]:disabled {\n  cursor: wait;\n  transform: none;\n}\n.ui-single-row__menu-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -0.35rem;\n  right: -0.35rem;\n}\n.ui-single-row__menu[_ngcontent-%COMP%], \n.ui-single-row__menu-trigger[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex: 0 0 auto;\n}\n.ui-single-row--with-top-right[_ngcontent-%COMP%]   .ui-single-row__menu[_ngcontent-%COMP%], \n.ui-single-row--with-top-right[_ngcontent-%COMP%]   .ui-single-row__menu-trigger[_ngcontent-%COMP%] {\n  margin-top: 0;\n}\n@media (max-width: 760px) {\n  .ui-single-row[_ngcontent-%COMP%] {\n    grid-template-columns: auto minmax(0, 1fr);\n  }\n  .ui-single-row--no-leading[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .ui-single-row__side[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n    justify-self: stretch;\n    justify-content: flex-start;\n    flex-wrap: wrap;\n  }\n  .ui-single-row--with-top-right[_ngcontent-%COMP%]   .ui-single-row__side[_ngcontent-%COMP%] {\n    position: absolute;\n    top: 2.48rem;\n    right: 0.7rem;\n    grid-column: auto;\n    width: auto;\n    justify-self: end;\n    justify-content: flex-end;\n    flex-wrap: nowrap;\n    padding-top: 0;\n    z-index: 2;\n  }\n  .ui-single-row--with-top-right[_ngcontent-%COMP%]   .ui-single-row__menu[_ngcontent-%COMP%], \n   .ui-single-row--with-top-right[_ngcontent-%COMP%]   .ui-single-row__menu-trigger[_ngcontent-%COMP%] {\n    margin-top: 0;\n  }\n  .ui-single-row__top-right[_ngcontent-%COMP%] {\n    max-width: 80%;\n  }\n}\n/*# sourceMappingURL=single-row.component.css.map */'], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SingleRowComponent, [{
    type: Component,
    args: [{ selector: "single-row", standalone: true, imports: [
      CommonModule,
      MatIconModule,
      CounterBadgePipe,
      AppMenuComponent,
      IndicatorComponent
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `<article
  class="motion-static"
  [ngClass]="rootClassList()"
  [style.--ui-single-row-accent-hue]="rowAccentHue()"
  [attr.role]="isClickable() ? 'button' : null"
  [attr.tabindex]="isClickable() ? 0 : null"
  [attr.aria-label]="ariaLabel"
  [attr.aria-busy]="row?.progressRing === true ? 'true' : null"
  [attr.data-group-label]="row?.groupLabel"
  [attr.data-single-row-id]="row?.id"
  (click)="onRowClick($event)"
  (keydown)="onRowKeydown($event)"
  >
  @if (row?.progressRing === true) {
    <app-indicator
      class="ui-single-row__progress-ring"
      kind="action-ring"
      shape="surface"
      state="loading"
    ></app-indicator>
  }

  @if (hasTopRightContent()) {
    <span class="ui-single-row__top-right">
      @for (badge of topRightBadges(); track trackByBadge($index, badge)) {
        <span
          [ngClass]="badgeClassList(badge)"
          [attr.aria-label]="badge.ariaLabel"
          [attr.title]="badge.title || badge.ariaLabel || null"
          >
          @if (badge.icon) {
            <mat-icon>{{ badge.icon }}</mat-icon>
          }
          <span>{{ badge.label }}</span>
        </span>
      }
      @if (rowCounterValue() > 0) {
        <span class="card-badge ui-single-row__corner-counter">{{ rowCounterValue() | counterBadge }}</span>
      }
    </span>
  }

  @if (hasLeadingVisual()) {
    <span [ngClass]="avatarClassList()" [attr.aria-label]="row?.avatarAriaLabel">
      @if (avatarImageUrl()) {
        <img [src]="avatarImageUrl()" alt="" />
      } @else if (row?.icon) {
        <mat-icon>{{ row?.icon }}</mat-icon>
      } @else {
        {{ row?.avatarInitials }}
      }
    </span>
  }

  <span class="ui-single-row__main">
    <span class="ui-single-row__headline">
      <span class="ui-single-row__title">{{ row?.title }}</span>
      @if (inlineBadges().length > 0) {
        <span class="ui-single-row__inline-badges">
          @for (badge of inlineBadges(); track trackByBadge($index, badge)) {
            <span
              [ngClass]="badgeClassList(badge)"
              [attr.aria-label]="badge.ariaLabel"
              [attr.title]="badge.title || badge.ariaLabel || null"
              >
              @if (badge.icon) {
                <mat-icon>{{ badge.icon }}</mat-icon>
              }
              <span>{{ badge.label }}</span>
            </span>
          }
        </span>
      }
    </span>
    @if (row?.subtitle) {
      <span class="ui-single-row__subtitle">{{ row?.subtitle }}</span>
    }
    @if (row?.detail) {
      <span class="ui-single-row__detail">{{ row?.detail }}</span>
    }
    @if ((row?.metaRows?.length ?? 0) > 0) {
      <span class="ui-single-row__meta">
        @for (meta of row?.metaRows ?? []; track meta) {
          <span>{{ meta }}</span>
        }
      </span>
    }
  </span>

  @if (hasSideContent()) {
    <span class="ui-single-row__side">
      @if (sideBadges().length > 0) {
        <span class="ui-single-row__side-badges">
          @for (badge of sideBadges(); track trackByBadge($index, badge)) {
            <span
              [ngClass]="badgeClassList(badge)"
              [attr.aria-label]="badge.ariaLabel"
              [attr.title]="badge.title || badge.ariaLabel || null"
              >
              @if (badge.icon) {
                <mat-icon>{{ badge.icon }}</mat-icon>
              }
              <span>{{ badge.label }}</span>
            </span>
          }
        </span>
      }
      @if (hasMenuActions()) {
        @if (useSharedMenu) {
          <button
            type="button"
            class="ui-single-row__menu-trigger"
            [class.is-open]="menuOpen"
            [disabled]="row?.progressRing === true"
            [attr.aria-label]="menuOpen ? 'Close menu' : 'Open menu'"
            (pointerdown)="onSharedMenuTriggerPointerDown($event)"
            (click)="onSharedMenuTriggerClick($event)"
            >
            <mat-icon>{{ menuOpen ? 'close' : 'more_vert' }}</mat-icon>
            @if (menuBadgeValue() > 0) {
              <span class="card-badge ui-single-row__menu-badge">{{ menuBadgeValue() | counterBadge }}</span>
            }
          </button>
        } @else {
          <app-menu
            class="ui-single-row__menu"
            kind="select"
            [title]="rowMenuTitle()"
            [trigger]="rowMenuTrigger()"
            [items]="rowMenuItems()"
            [panelAlign]="'auto'"
            [mobileBreakpointPx]="900"
            (itemSelect)="onMenuActionSelected($event)"
          ></app-menu>
        }
      }
    </span>
  }
</article>
`, styles: ['/* src/app/shared/ui/components/core/smart-list/card/single-row/single-row.component.scss */\n:host {\n  display: block;\n  min-width: 0;\n}\n.ui-single-row {\n  position: relative;\n  width: 100%;\n  min-width: 0;\n  min-height: 80px;\n  box-sizing: border-box;\n  border: 1px solid rgba(33, 51, 78, 0.14);\n  border-radius: 8px;\n  background: #fff;\n  padding: 0.48rem 0.55rem;\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  gap: 0.5rem;\n  align-items: center;\n  isolation: isolate;\n  transition:\n    box-shadow 0.16s ease,\n    background-color 0.16s ease,\n    border-color 0.16s ease,\n    color 0.16s ease;\n}\n.ui-single-row--with-top-right {\n  padding-top: 0.48rem;\n  padding-bottom: 0.62rem;\n}\n.ui-single-row--no-leading {\n  grid-template-columns: minmax(0, 1fr) auto;\n}\n.ui-single-row--clickable {\n  cursor: pointer;\n  -webkit-tap-highlight-color: transparent;\n}\n.ui-single-row--clickable:hover {\n  box-shadow: 0 10px 22px rgba(30, 52, 84, 0.12);\n}\n.ui-single-row__progress-ring {\n  inset: -2px;\n  z-index: 4;\n}\n.ui-single-row--progress-ring > :not(.ui-single-row__progress-ring) {\n  opacity: 0.9;\n}\n.ui-single-row--tone-neutral,\n.ui-single-row--tone-muted {\n  border-color: rgba(74, 88, 108, 0.18);\n  background: #f7f9fc;\n}\n.ui-single-row--tone-info {\n  border-color: rgba(45, 111, 181, 0.26);\n  background: #f3f8ff;\n}\n.ui-single-row--tone-accent {\n  border-color: rgba(122, 86, 190, 0.24);\n  background: #f8f5ff;\n}\n.ui-single-row--tone-success {\n  border-color: rgba(40, 132, 89, 0.24);\n  background: #f2fbf6;\n}\n.ui-single-row--tone-warning {\n  border-color: rgba(190, 129, 38, 0.28);\n  background: #fff8ed;\n}\n.ui-single-row--tone-danger {\n  border-color: rgba(190, 60, 76, 0.28);\n  background: #fff4f5;\n}\n.ui-single-row__top-right {\n  position: absolute;\n  top: 0.7rem;\n  right: 0.7rem;\n  z-index: 2;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.2rem;\n  max-width: min(58%, 18rem);\n}\n.ui-single-row--with-top-right.ui-single-row--with-menu-actions .ui-single-row__top-right {\n  right: 0.7rem;\n  max-width: min(46%, 18rem);\n}\n.ui-single-row__top-right .ui-single-row__badge-pill {\n  min-width: 0;\n  max-width: 100%;\n}\n.ui-single-row__avatar {\n  width: 36px;\n  height: 36px;\n  color: #fff;\n  background:\n    linear-gradient(\n      180deg,\n      #6ca6ff 0%,\n      #3d78d8 100%);\n  font-size: 11px;\n  font-weight: 800;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  overflow: hidden;\n  flex: 0 0 auto;\n}\n.ui-single-row__avatar.notification-system-avatar {\n  color: #fff;\n  border: 1px solid rgba(116, 226, 255, 0.72);\n  background:\n    radial-gradient(\n      circle at 30% 20%,\n      rgba(103, 232, 255, 0.96),\n      transparent 42%),\n    linear-gradient(\n      145deg,\n      #3948c8 0%,\n      #8a3fc0 58%,\n      #e94791 100%);\n  box-shadow: 0 4px 12px rgba(67, 48, 163, 0.3);\n}\n.ui-single-row__avatar.notification-stage-avatar {\n  position: relative;\n  color: hsl(var(--ui-single-row-accent-hue, 210), 72%, 30%);\n  border: 1px solid hsl(var(--ui-single-row-accent-hue, 210), 54%, 58%, 0.58);\n  background:\n    radial-gradient(\n      circle at 28% 18%,\n      hsl(var(--ui-single-row-accent-hue, 210), 90%, 98%, 0.9),\n      transparent 42%),\n    linear-gradient(\n      180deg,\n      hsl(var(--ui-single-row-accent-hue, 210), 82%, 97%) 0%,\n      hsl(var(--ui-single-row-accent-hue, 210), 64%, 86%) 100%);\n  box-shadow: 0 4px 12px hsl(var(--ui-single-row-accent-hue, 210), 42%, 36%, 0.2);\n}\n.ui-single-row__avatar.notification-stage-avatar--positive {\n  box-shadow:\n    0 0 0 3px hsl(var(--ui-single-row-accent-hue, 210), 78%, 70%, 0.2),\n    0 0 17px hsl(var(--ui-single-row-accent-hue, 210), 86%, 54%, 0.46),\n    0 5px 13px hsl(var(--ui-single-row-accent-hue, 210), 42%, 34%, 0.25);\n}\n.ui-single-row__avatar.notification-stage-avatar--negative::after {\n  content: "";\n  position: absolute;\n  width: 28px;\n  height: 2px;\n  border-radius: 999px;\n  background: hsl(var(--ui-single-row-accent-hue, 210), 74%, 28%, 0.82);\n  box-shadow: 0 0 0 1px hsl(var(--ui-single-row-accent-hue, 210), 88%, 96%, 0.72);\n  transform: rotate(-45deg);\n}\n.ui-single-row__avatar--circle {\n  border-radius: 50%;\n}\n.ui-single-row__avatar--rounded {\n  border-radius: 8px;\n}\n.ui-single-row__avatar--square {\n  border-radius: 4px;\n}\n.ui-single-row__avatar img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n.ui-single-row__avatar .mat-icon,\n.ui-single-row__badge-pill .mat-icon,\n.ui-single-row__menu-trigger .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.ui-single-row__main {\n  min-width: 0;\n  display: grid;\n  gap: 0.08rem;\n}\n.ui-single-row__headline {\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.36rem;\n  overflow: hidden;\n}\n.ui-single-row__title,\n.ui-single-row__subtitle,\n.ui-single-row__detail,\n.ui-single-row__meta {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.ui-single-row__title {\n  font-size: 0.84rem;\n  font-weight: 850;\n  color: #1f3658;\n  flex: 0 1 auto;\n}\n.ui-single-row__corner-counter {\n  flex: 0 0 auto;\n  min-width: 24px;\n  height: 24px;\n  padding: 0 0.46rem;\n  border-radius: 999px;\n  border: 1px solid rgba(255, 221, 170, 0.92);\n  background:\n    linear-gradient(\n      180deg,\n      #f2a33a 0%,\n      #cc7a19 100%);\n  color: #fff7e8;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.72rem;\n  font-weight: 850;\n  line-height: 1;\n  white-space: nowrap;\n  box-shadow: 0 5px 12px rgba(173, 101, 21, 0.22);\n}\n.ui-single-row__subtitle {\n  font-size: 0.76rem;\n  color: rgba(20, 36, 58, 0.75);\n}\n.ui-single-row__detail,\n.ui-single-row__meta {\n  font-size: 0.73rem;\n  color: rgba(20, 36, 58, 0.64);\n}\n.ui-single-row__meta {\n  display: inline-flex;\n  gap: 0.32rem;\n}\n.ui-single-row__inline-badges,\n.ui-single-row__side-badges {\n  min-width: 0;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n}\n.ui-single-row__inline-badges {\n  flex: 0 1 auto;\n  overflow: hidden;\n}\n.ui-single-row__side {\n  justify-self: end;\n  align-self: center;\n  min-width: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.34rem;\n}\n.ui-single-row--with-top-right .ui-single-row__side {\n  align-self: center;\n  padding-top: 0;\n}\n.ui-single-row--with-top-right.ui-single-row--with-menu-actions .ui-single-row__side {\n  position: absolute;\n  top: 2.48rem;\n  right: 0.7rem;\n  z-index: 2;\n}\n.ui-single-row__badge-pill {\n  min-height: 26px;\n  border-radius: 999px;\n  border: 1px solid rgba(33, 51, 78, 0.12);\n  background: rgba(255, 255, 255, 0.88);\n  color: #233a5b;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.22rem;\n  font-size: 0.72rem;\n  font-weight: 800;\n  padding: 0 0.56rem;\n  white-space: nowrap;\n  box-shadow: 0 5px 12px rgba(30, 52, 84, 0.08);\n}\n.ui-single-row__badge-pill span {\n  min-width: 0;\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.ui-single-row__badge-pill--inverse {\n  border-color: rgba(255, 255, 255, 0.88);\n  background: rgba(26, 45, 71, 0.84);\n  color: #fff;\n}\n.ui-single-row__badge-pill--info {\n  border-color: rgba(45, 111, 181, 0.22);\n  background: #eaf3ff;\n  color: #24598f;\n}\n.ui-single-row__badge-pill--accent {\n  border-color: rgba(122, 86, 190, 0.22);\n  background: #f1ebff;\n  color: #6544a0;\n}\n.ui-single-row__badge-pill--success {\n  border-color: rgba(40, 132, 89, 0.22);\n  background: #e7f7ee;\n  color: #28774e;\n}\n.ui-single-row__badge-pill--warning {\n  border-color: rgba(190, 129, 38, 0.24);\n  background: #fff1d9;\n  color: #8c5a16;\n}\n.ui-single-row__badge-pill--danger {\n  border-color: rgba(190, 60, 76, 0.24);\n  background: #ffe7ea;\n  color: #9c3040;\n}\n.ui-single-row__menu-trigger {\n  position: relative;\n  width: 32px;\n  min-width: 32px;\n  height: 32px;\n  border: 1px solid rgba(33, 51, 78, 0.14);\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.94);\n  color: #2d4b73;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.24rem;\n  padding: 0;\n  cursor: pointer;\n  transition:\n    background-color 0.16s ease,\n    border-color 0.16s ease,\n    color 0.16s ease,\n    transform 0.16s ease;\n}\n.ui-single-row__menu-trigger:hover {\n  transform: translateY(-1px);\n}\n.ui-single-row__menu-trigger:disabled {\n  cursor: wait;\n  transform: none;\n}\n.ui-single-row__menu-badge {\n  position: absolute;\n  top: -0.35rem;\n  right: -0.35rem;\n}\n.ui-single-row__menu,\n.ui-single-row__menu-trigger {\n  display: inline-flex;\n  flex: 0 0 auto;\n}\n.ui-single-row--with-top-right .ui-single-row__menu,\n.ui-single-row--with-top-right .ui-single-row__menu-trigger {\n  margin-top: 0;\n}\n@media (max-width: 760px) {\n  .ui-single-row {\n    grid-template-columns: auto minmax(0, 1fr);\n  }\n  .ui-single-row--no-leading {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .ui-single-row__side {\n    grid-column: 1/-1;\n    justify-self: stretch;\n    justify-content: flex-start;\n    flex-wrap: wrap;\n  }\n  .ui-single-row--with-top-right .ui-single-row__side {\n    position: absolute;\n    top: 2.48rem;\n    right: 0.7rem;\n    grid-column: auto;\n    width: auto;\n    justify-self: end;\n    justify-content: flex-end;\n    flex-wrap: nowrap;\n    padding-top: 0;\n    z-index: 2;\n  }\n  .ui-single-row--with-top-right .ui-single-row__menu,\n  .ui-single-row--with-top-right .ui-single-row__menu-trigger {\n    margin-top: 0;\n  }\n  .ui-single-row__top-right {\n    max-width: 80%;\n  }\n}\n/*# sourceMappingURL=single-row.component.css.map */\n'] }]
  }], null, { row: [{
    type: Input
  }], clickable: [{
    type: Input
  }], ariaLabel: [{
    type: Input
  }], useSharedMenu: [{
    type: Input
  }], sharedMenuContext: [{
    type: Input
  }], rowClick: [{
    type: Output
  }], menuAction: [{
    type: Output
  }], menuRequest: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SingleRowComponent, { className: "SingleRowComponent", filePath: "app/shared/ui/components/core/smart-list/card/single-row/single-row.component.ts", lineNumber: 51 });
})();

// src/app/shared/ui/components/core/smart-list/card/pair-card/pair-card.component.ts
var _c03 = ["fullscreenShell"];
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
      \u0275\u0275viewQuery(_c03, 5, ElementRef);
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
  }, dependencies: [CommonModule, NgClass, NgTemplateOutlet, MatIconModule, MatIcon, LazyBgImageDirective, IndicatorComponent], styles: ['\n[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n  min-height: 0;\n}\n[data-card-presentation=fullscreen][_nghost-%COMP%] {\n  height: 100%;\n}\n.activities-rate-profile-card[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  min-height: 264px;\n  border: 1px solid rgba(34, 54, 84, 0.24);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      #1b2c45 0%,\n      #132238 100%);\n  overflow: hidden;\n  box-sizing: border-box;\n  touch-action: pan-y;\n}\n.activities-rate-profile-card.activities-row-item[_ngcontent-%COMP%] {\n  cursor: default;\n  transform: none;\n  transition: none;\n  animation: none;\n  -webkit-tap-highlight-color: transparent;\n}\n.activities-rate-profile-card.activities-row-item[_ngcontent-%COMP%]:hover, \n.activities-rate-profile-card.activities-row-item[_ngcontent-%COMP%]:active {\n  transform: none;\n  filter: none;\n}\n.activities-rate-profile-stack[_ngcontent-%COMP%] {\n  position: relative;\n  min-height: 264px;\n  height: 100%;\n}\n.activities-rate-profile-stack.activities-rate-profile-stack-pair-inline[_ngcontent-%COMP%] {\n  min-height: 264px;\n}\n.activities-rate-profile-stack.activities-rate-profile-stack-pair-fullscreen[_ngcontent-%COMP%] {\n  min-height: 100%;\n  height: 100%;\n}\n.activities-rate-pair-inline-grid[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: clamp(0.28rem, 0.8vw, 0.52rem);\n  padding: 0.42rem;\n}\n.activities-rate-pair-inline-grid[_ngcontent-%COMP%]:not(.activities-rate-pair-fullscreen-grid) {\n  gap: clamp(0.08rem, 0.32vw, 0.16rem);\n}\n.activities-rate-pair-inline-card[_ngcontent-%COMP%] {\n  position: relative;\n  min-width: 0;\n  border-radius: 12px;\n  overflow: hidden;\n  border: 1px solid rgba(255, 255, 255, 0.28);\n  box-shadow: 0 10px 22px rgba(6, 18, 36, 0.3);\n}\n.activities-rate-pair-inline-layer[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  min-height: 0;\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n}\n.activities-rate-image-loader[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  z-index: 2;\n  display: grid;\n  place-items: center;\n  pointer-events: none;\n  opacity: 0;\n  transition: opacity 120ms ease;\n}\n.activities-rate-image-loader[_ngcontent-%COMP%]   app-indicator[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n}\n.activities-rate-pair-inline-layer.lazy-bg-loading[_ngcontent-%COMP%]   .activities-rate-image-loader[_ngcontent-%COMP%], \n.activities-rate-profile-layer.lazy-bg-loading[_ngcontent-%COMP%]   .activities-rate-image-loader[_ngcontent-%COMP%] {\n  opacity: 1;\n}\n.activities-rate-pair-inline-layer.lazy-bg-loaded[_ngcontent-%COMP%]   .activities-rate-image-loader[_ngcontent-%COMP%], \n.activities-rate-profile-layer.lazy-bg-loaded[_ngcontent-%COMP%]   .activities-rate-image-loader[_ngcontent-%COMP%], \n.activities-rate-pair-inline-layer.lazy-bg-error[_ngcontent-%COMP%]   .activities-rate-image-loader[_ngcontent-%COMP%], \n.activities-rate-profile-layer.lazy-bg-error[_ngcontent-%COMP%]   .activities-rate-image-loader[_ngcontent-%COMP%] {\n  opacity: 0;\n}\n.activities-rate-pair-inline-layer[_ngcontent-%COMP%]::after, \n.activities-rate-profile-layer[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  z-index: 0;\n  pointer-events: none;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(12, 22, 36, 0.04) 0%,\n      rgba(7, 16, 28, 0.62) 66%,\n      rgba(7, 16, 28, 0.84) 100%);\n}\n.activities-rate-pair-inline-layer[_ngcontent-%COMP%]   .card-image-placeholder[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 4;\n}\n.activities-rate-pair-inline-card.is-pane-loading[_ngcontent-%COMP%]   .activities-rate-profile-indicators[_ngcontent-%COMP%]   .image-stack-line.active[_ngcontent-%COMP%], \n.activities-rate-profile-stack.is-pane-loading[_ngcontent-%COMP%]   .activities-rate-profile-indicators[_ngcontent-%COMP%]   .image-stack-line.active[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_activities-rate-pane-loading-pulse 500ms ease;\n}\n@keyframes _ngcontent-%COMP%_activities-rate-pane-loading-pulse {\n  0% {\n    transform: scaleX(0.84);\n    opacity: 0.58;\n  }\n  100% {\n    transform: scaleX(1);\n    opacity: 1;\n  }\n}\n.activities-rate-pair-inline-label[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.64rem;\n  left: 0.52rem;\n  z-index: 5;\n  border-radius: 999px;\n  border: 1px solid rgba(212, 229, 249, 0.42);\n  color: #f5f9ff;\n  font-size: 0.66rem;\n  font-weight: 700;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.16rem 0.42rem;\n  background: rgba(8, 18, 35, 0.62);\n}\n.activities-rate-pair-inline-card-woman[_ngcontent-%COMP%]   .activities-rate-pair-inline-label[_ngcontent-%COMP%] {\n  background: rgba(109, 42, 118, 0.64);\n}\n.activities-rate-pair-inline-card-man[_ngcontent-%COMP%]   .activities-rate-pair-inline-label[_ngcontent-%COMP%] {\n  background: rgba(36, 74, 127, 0.66);\n}\n.shared-card-status-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.64rem;\n  right: 0.56rem;\n  z-index: 80;\n  max-width: calc(100% - 1.24rem);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  border-radius: 999px;\n  border: 1px solid rgba(148, 225, 182, 0.56);\n  background: rgba(8, 34, 18, 0.74);\n  color: #e9ffef;\n  font-size: 0.68rem;\n  font-weight: 700;\n  letter-spacing: 0.01em;\n  line-height: 1;\n  padding: 0.17rem 0.5rem;\n  pointer-events: none;\n}\n.shared-card-context-avatar-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.68rem;\n  left: 0.62rem;\n  z-index: 30;\n  width: 2.08rem;\n  height: 2.08rem;\n  display: inline-grid;\n  place-items: center;\n  border: 2px solid rgba(255, 255, 255, 0.84);\n  border-radius: 999px;\n  background: rgba(8, 18, 35, 0.74);\n  color: #f7fbff;\n  box-shadow: 0 7px 16px rgba(4, 12, 26, 0.36), inset 0 0 0 1px rgba(15, 35, 58, 0.26);\n  overflow: visible;\n  pointer-events: auto;\n  touch-action: manipulation;\n}\nbutton.shared-card-context-avatar-badge[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n.shared-card-context-avatar-badge[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  border-radius: inherit;\n}\n.shared-card-context-avatar-badge[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  font-size: 0.68rem;\n  font-weight: 900;\n  line-height: 1;\n}\n.shared-card-context-avatar-badge[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -0.74rem;\n  right: -0.72rem;\n  z-index: 2;\n  min-width: 1rem;\n  height: 1rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border: 1px solid rgba(255, 255, 255, 0.88);\n  border-radius: 999px;\n  background: #d94c4c;\n  color: #fff;\n  font-size: 0.54rem;\n  font-style: normal;\n  font-weight: 900;\n  line-height: 1;\n  padding: 0 0.16rem;\n  box-shadow: 0 4px 10px rgba(77, 12, 24, 0.32);\n}\n.activities-rate-pair-inline-overlay[_ngcontent-%COMP%], \n.activities-rate-profile-overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 3;\n  display: grid;\n  gap: 0.14rem;\n}\n.activities-rate-pair-inline-overlay[_ngcontent-%COMP%] {\n  padding: 0.7rem 0.72rem 0.68rem;\n}\n.activities-rate-pair-inline-card[_ngcontent-%COMP%]   .activities-rate-profile-indicators.activities-rate-pair-inline-indicators[_ngcontent-%COMP%] {\n  top: 0.28rem;\n  left: 0.34rem;\n  right: 0.34rem;\n  padding: 0.12rem 0.24rem;\n  border-radius: 7px;\n}\n.activities-rate-pair-inline-hit-area[_ngcontent-%COMP%] {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 4;\n}\n.activities-rate-profile-layer[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  z-index: 1;\n  border-radius: 14px;\n  overflow: hidden;\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n  border: 1px solid rgba(255, 255, 255, 0.26);\n  box-shadow: 0 12px 24px rgba(6, 18, 36, 0.34);\n}\n[data-card-presentation=list][_nghost-%COMP%]   .activities-rate-pair-inline-layer[_ngcontent-%COMP%], \n[data-card-presentation=list][_nghost-%COMP%]   .activities-rate-profile-layer[_ngcontent-%COMP%] {\n  background-size: contain;\n}\n.activities-rate-profile-layer-active[_ngcontent-%COMP%] {\n  pointer-events: none;\n}\n.activities-rate-profile-indicators[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.36rem;\n  left: 0.52rem;\n  right: 0.52rem;\n  z-index: 10;\n  padding: 0.16rem 0.34rem;\n  border-radius: 8px;\n  background: rgba(10, 18, 31, 0.38);\n  gap: 5px;\n}\n.activities-rate-profile-indicators[_ngcontent-%COMP%]   .image-stack-line[_ngcontent-%COMP%] {\n  height: 4px;\n  border: 1px solid rgba(28, 42, 64, 0.36);\n  background: rgba(167, 177, 192, 0.9);\n  opacity: 1;\n}\n.activities-rate-profile-indicators[_ngcontent-%COMP%]   .image-stack-line.active[_ngcontent-%COMP%] {\n  border-color: rgba(248, 252, 255, 0.86);\n  background: rgba(250, 252, 255, 0.98);\n  box-shadow: 0 0 0 1px rgba(10, 20, 34, 0.12);\n}\n.activities-rate-profile-hit-area[_ngcontent-%COMP%] {\n  top: 0.2rem;\n  left: 0.2rem;\n  right: 0.2rem;\n  bottom: 0.2rem;\n  z-index: 4;\n}\n.shared-card-profile-view-btn[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 0.56rem;\n  bottom: 0.56rem;\n  z-index: 18;\n  width: 2.22rem;\n  height: 2.22rem;\n  border: 1px solid rgba(41, 99, 143, 0.28);\n  border-radius: 999px;\n  background: rgba(232, 246, 251, 0.94);\n  color: #226d83;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  box-shadow: 0 8px 18px rgba(6, 24, 44, 0.2);\n  cursor: pointer;\n  pointer-events: auto;\n  transition:\n    background 0.16s ease,\n    border-color 0.16s ease,\n    transform 0.16s ease;\n  -webkit-tap-highlight-color: transparent;\n}\n.shared-card-profile-view-btn[_ngcontent-%COMP%]:hover, \n.shared-card-profile-view-btn[_ngcontent-%COMP%]:focus-visible {\n  background: rgba(218, 241, 249, 0.98);\n  border-color: rgba(31, 124, 153, 0.44);\n  transform: translateY(-1px);\n  outline: none;\n}\n.shared-card-profile-view-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 1.34rem;\n  height: 1.34rem;\n  font-size: 1.34rem;\n  line-height: 1.34rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.activities-rate-pair-inline-card[_ngcontent-%COMP%]   .shared-card-profile-view-btn[_ngcontent-%COMP%] {\n  right: 0.44rem;\n  bottom: 0.44rem;\n  width: 2rem;\n  height: 2rem;\n}\n.activities-rate-profile-overlay[_ngcontent-%COMP%] {\n  padding: 0.74rem 0.8rem 0.72rem;\n}\n.activities-rate-profile-line[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #f5f9ff !important;\n  text-shadow: 0 2px 9px rgba(2, 8, 16, 0.96);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.activities-rate-profile-line-primary[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  font-weight: 800;\n}\n.activities-rate-profile-line-secondary[_ngcontent-%COMP%] {\n  font-size: 0.76rem;\n  font-weight: 700;\n  color: rgba(237, 245, 255, 0.98) !important;\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-given[_ngcontent-%COMP%]   .activities-rate-profile-layer[_ngcontent-%COMP%] {\n  border-color: rgba(63, 136, 208, 0.52);\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-received[_ngcontent-%COMP%]   .activities-rate-profile-layer[_ngcontent-%COMP%] {\n  border-color: rgba(53, 160, 114, 0.52);\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-mutual[_ngcontent-%COMP%]   .activities-rate-profile-layer[_ngcontent-%COMP%] {\n  border-color: rgba(176, 121, 48, 0.52);\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-met[_ngcontent-%COMP%]   .activities-rate-profile-layer[_ngcontent-%COMP%] {\n  border-color: rgba(104, 118, 139, 0.52);\n}\n.activities-rate-score-badge[_ngcontent-%COMP%] {\n  min-height: 26px;\n  border: 2px solid rgba(187, 136, 22, 0.58);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #fff9e9 0%,\n      #fff1cb 100%);\n  color: #9f6915;\n  font-size: 0.76rem;\n  font-weight: 800;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n  padding: 0.16rem 0.56rem;\n  cursor: pointer;\n  transform: translateY(0) scale(1);\n  box-shadow: inset 0 0 0 1px rgba(255, 245, 215, 0.72), 0 0 0 rgba(226, 171, 47, 0);\n  transition:\n    transform 0.16s ease,\n    box-shadow 0.2s ease,\n    border-color 0.2s ease,\n    filter 0.2s ease;\n}\n.activities-rate-score-badge[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n  font-size: 14px;\n  line-height: 14px;\n}\n.activities-rate-score-badge-floating[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.6rem;\n  right: 0.3rem;\n  z-index: 24;\n  min-width: 68px;\n  justify-content: center;\n}\n.activities-rate-score-badge-between[_ngcontent-%COMP%] {\n  --activities-rate-badge-between-y: -50%;\n  position: absolute;\n  left: 50%;\n  right: auto;\n  top: 50%;\n  z-index: 24;\n  min-width: 68px;\n  width: max-content;\n  max-width: calc(100% - 0.8rem);\n  justify-content: center;\n  white-space: nowrap;\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n  transition:\n    box-shadow 0.2s ease,\n    border-color 0.2s ease,\n    filter 0.2s ease;\n}\n.activities-rate-profile-stack-pair-inline[_ngcontent-%COMP%]   .activities-rate-score-badge-between[_ngcontent-%COMP%] {\n  --activities-rate-badge-between-y: 0;\n  top: auto;\n  bottom: clamp(3.2rem, 18%, 4.2rem);\n  left: 50% !important;\n  right: auto !important;\n  transform: translate(-50%, var(--activities-rate-badge-between-y)) !important;\n}\n.activities-rate-profile-stack-pair-inline[_ngcontent-%COMP%]   .activities-rate-score-badge-between[_ngcontent-%COMP%]:not(.is-disabled):hover, \n.activities-rate-profile-stack-pair-inline[_ngcontent-%COMP%]   .activities-rate-score-badge-between[_ngcontent-%COMP%]:not(.is-disabled):active, \n.activities-rate-profile-stack-pair-inline[_ngcontent-%COMP%]   .activities-rate-score-badge-between.is-active[_ngcontent-%COMP%]:not(.is-disabled), \n.activities-rate-profile-stack-pair-inline[_ngcontent-%COMP%]   .activities-rate-score-badge-between.is-active.is-pending[_ngcontent-%COMP%]:not(.is-disabled), \n.activities-rate-profile-stack-pair-inline[_ngcontent-%COMP%]   .activities-rate-score-badge-between.is-disabled[_ngcontent-%COMP%] {\n  left: 50% !important;\n  right: auto !important;\n  transform: translate(-50%, 0) !important;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-score-badge-floating.activities-rate-score-badge-floating-pair-overlap[_ngcontent-%COMP%] {\n  --activities-rate-badge-between-y: 0;\n  top: auto;\n  bottom: clamp(3.2rem, 11%, 4.6rem);\n  left: var(--activities-pair-split, 50%);\n  right: auto;\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n  min-width: 68px;\n  width: max-content;\n  max-width: calc(100% - 0.8rem);\n  justify-content: center;\n  white-space: nowrap;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-score-badge-floating.activities-rate-score-badge-floating-pair-overlap.is-active[_ngcontent-%COMP%]:not(.is-disabled), \n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-score-badge-floating.activities-rate-score-badge-floating-pair-overlap[_ngcontent-%COMP%]:not(.is-disabled):active {\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n@media (hover: hover) and (pointer: fine) {\n  button.activities-rate-score-badge[_ngcontent-%COMP%]:not(.is-disabled):hover {\n    transform: translateY(-1px) scale(1.03);\n    box-shadow: 0 6px 14px rgba(203, 150, 34, 0.28);\n    filter: saturate(1.05);\n  }\n}\nbutton.activities-rate-score-badge[_ngcontent-%COMP%]:not(.is-disabled):active {\n  transform: translateY(0) scale(0.96);\n  box-shadow: 0 2px 8px rgba(146, 105, 16, 0.22);\n}\nbutton.activities-rate-score-badge-between[_ngcontent-%COMP%]:not(.is-disabled):hover, \nbutton.activities-rate-score-badge-between[_ngcontent-%COMP%]:not(.is-disabled):active {\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n.activities-rate-score-badge.is-pending[_ngcontent-%COMP%] {\n  border-color: rgba(187, 56, 71, 0.62);\n  background:\n    linear-gradient(\n      180deg,\n      #ffe9ed 0%,\n      #ffd9df 100%);\n  color: #b63545;\n}\n.activities-rate-score-badge.is-active[_ngcontent-%COMP%]:not(.is-disabled) {\n  border-color: rgba(206, 148, 25, 0);\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ca 0%,\n      #ffe7a8 100%);\n  color: #8b560f;\n  box-shadow: none;\n  transform: translateY(0) scale(1);\n}\n.activities-rate-score-badge-between.is-active[_ngcontent-%COMP%]:not(.is-disabled), \n.activities-rate-score-badge-between.is-active.is-pending[_ngcontent-%COMP%]:not(.is-disabled) {\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n.activities-rate-score-badge.is-active.is-pending[_ngcontent-%COMP%]:not(.is-disabled) {\n  border-color: rgba(188, 53, 72, 0);\n  background:\n    linear-gradient(\n      180deg,\n      #ffdce4 0%,\n      #ffc8d3 100%);\n  color: #9d2232;\n  box-shadow: none;\n}\n@media (hover: hover) and (pointer: fine) {\n  button.activities-rate-score-badge.is-active[_ngcontent-%COMP%]:not(.is-disabled):hover {\n    border-color: rgba(206, 148, 25, 0.76);\n    box-shadow: 0 0 0 2px rgba(255, 244, 201, 0.68), 0 9px 16px rgba(170, 117, 20, 0.26);\n  }\n  button.activities-rate-score-badge.is-active.is-pending[_ngcontent-%COMP%]:not(.is-disabled):hover {\n    border-color: rgba(188, 53, 72, 0.72);\n    box-shadow: 0 0 0 2px rgba(255, 230, 236, 0.72), 0 9px 16px rgba(170, 48, 68, 0.24);\n  }\n}\n.activities-rate-score-badge.is-blink[_ngcontent-%COMP%]:not(.is-disabled) {\n  animation: _ngcontent-%COMP%_game-rating-stars-blink 0.42s ease-in-out 1;\n}\n@keyframes _ngcontent-%COMP%_game-rating-stars-blink {\n  0%, 100% {\n    filter: brightness(1);\n  }\n  50% {\n    filter: brightness(1.12) saturate(1.1);\n  }\n}\n.activities-rate-score-badge.is-disabled[_ngcontent-%COMP%] {\n  border-color: rgba(111, 123, 140, 0.52);\n  background:\n    linear-gradient(\n      180deg,\n      #f4f6f9 0%,\n      #e8edf3 100%);\n  color: #617085;\n  cursor: default;\n  transform: none;\n  box-shadow: none;\n  transition: none;\n}\n.activities-rate-score-badge-between.is-disabled[_ngcontent-%COMP%] {\n  right: auto;\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n.activities-rate-score-badge[disabled][_ngcontent-%COMP%], \nspan.activities-rate-score-badge[_ngcontent-%COMP%] {\n  pointer-events: none;\n}\nspan.activities-rate-score-badge[_ngcontent-%COMP%] {\n  cursor: default;\n  transition: none;\n}\n.image-stack-indicators[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -0.1rem;\n  left: 0.25rem;\n  right: 0.25rem;\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));\n  gap: 4px;\n  width: auto !important;\n}\n.image-stack-hit-area[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 10px;\n  left: 10px;\n  right: 10px;\n  bottom: 10px;\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));\n  gap: 4px;\n  z-index: 2;\n}\n.image-stack-hit-segment[_ngcontent-%COMP%] {\n  border: 0;\n  background: transparent;\n  padding: 0;\n  cursor: pointer;\n  width: 100%;\n  height: 100%;\n}\n.card-image-placeholder[_ngcontent-%COMP%] {\n  width: 84px;\n  height: 84px;\n  border-radius: 50%;\n  background:\n    linear-gradient(\n      145deg,\n      #4f7cff,\n      #7a3eff 60%,\n      #f04eab);\n  color: #fff;\n  font-weight: 800;\n  font-size: 1.72rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  letter-spacing: 0.03em;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  justify-content: center;\n  align-items: flex-start;\n  width: 100%;\n  height: 100%;\n  min-width: 0;\n  min-height: 0;\n}\n.activities-rates-fullscreen-card[_ngcontent-%COMP%] {\n  margin: 0;\n  flex: 0 0 auto;\n  touch-action: pan-y;\n  width: 100%;\n  height: 100%;\n  max-width: 100%;\n  max-height: 100%;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .image-stack-line[_ngcontent-%COMP%], \n.activities-rates-fullscreen[_ngcontent-%COMP%]   .image-stack-hit-segment[_ngcontent-%COMP%] {\n  pointer-events: auto;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-profile-card[_ngcontent-%COMP%] {\n  min-height: 0;\n  background: #e6edf7;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-profile-stack[_ngcontent-%COMP%] {\n  min-height: 0;\n  height: 100%;\n  background: #d7e1ef;\n}\n.activities-rates-fullscreen-card-active[_ngcontent-%COMP%]   .activities-rate-profile-layer[_ngcontent-%COMP%] {\n  background-color: #d3ddea;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-profile-stack.activities-rate-profile-stack-pair-fullscreen[_ngcontent-%COMP%] {\n  width: 100%;\n  margin-inline: 0;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-profile-stack.activities-rate-profile-stack-pair-fullscreen.activities-rate-profile-stack-pair[_ngcontent-%COMP%] {\n  border-radius: 14px;\n  border: 1px solid rgba(34, 54, 84, 0.24);\n  background:\n    linear-gradient(\n      180deg,\n      #1b2c45 0%,\n      #132238 100%);\n  overflow: hidden;\n}\n@media (min-width: 761px) {\n  .activities-rates-fullscreen-card[_ngcontent-%COMP%] {\n    width: calc(100% - var(--smart-list-pagination-arrow-size, 2.2rem)) !important;\n  }\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-pair-fullscreen-grid[_ngcontent-%COMP%] {\n  --activities-pair-gap: clamp(0.28rem, 0.8vw, 0.52rem);\n  --activities-pair-pad: 0.42rem;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  grid-template-rows: minmax(0, 1fr);\n  gap: var(--activities-pair-gap);\n  padding: var(--activities-pair-pad);\n  box-sizing: border-box;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-pair-fullscreen-grid[_ngcontent-%COMP%]   .activities-rate-pair-inline-card[_ngcontent-%COMP%] {\n  min-height: 0;\n  box-sizing: border-box;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-pair-fullscreen-grid[_ngcontent-%COMP%]   .activities-rate-pair-inline-card.is-collapsed[_ngcontent-%COMP%] {\n  border-color: transparent;\n  box-shadow: none;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-pair-fullscreen-grid[_ngcontent-%COMP%]   .activities-rate-pair-inline-card.is-collapsed[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%] {\n  opacity: 0;\n  pointer-events: none;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-pair-fullscreen-grid[_ngcontent-%COMP%]   .activities-rate-pair-inline-indicators[_ngcontent-%COMP%] {\n  top: 0.28rem;\n  left: 0.38rem;\n  right: 0.38rem;\n}\n.activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-pair-fullscreen-grid[_ngcontent-%COMP%]   .activities-rate-pair-inline-overlay[_ngcontent-%COMP%] {\n  padding: 0.74rem 0.8rem 0.72rem;\n}\n.activities-rates-pair-fullscreen-resize-handle[_ngcontent-%COMP%] {\n  display: none;\n}\n.activities-rates-pair-fullscreen-resize-handle-grip[_ngcontent-%COMP%] {\n  display: block;\n  pointer-events: none;\n}\n@media (max-width: 760px) {\n  .activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-pair-fullscreen-grid[_ngcontent-%COMP%] {\n    --activities-pair-gap: 0 !important;\n    --activities-pair-pad: 0.3rem !important;\n    display: flex;\n    gap: 0 !important;\n    padding: var(--activities-pair-pad) !important;\n    overflow: hidden;\n  }\n  .activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-pair-fullscreen-grid[_ngcontent-%COMP%]::after {\n    content: "";\n    position: absolute;\n    top: var(--activities-pair-pad);\n    bottom: var(--activities-pair-pad);\n    left: var(--activities-pair-split);\n    width: 1px;\n    transform: translateX(-0.5px);\n    background: rgba(34, 54, 84, 0.58);\n    pointer-events: none;\n    z-index: 22;\n  }\n  .activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-pair-fullscreen-grid[_ngcontent-%COMP%]   .activities-rate-pair-inline-card[_ngcontent-%COMP%] {\n    min-width: 0;\n    max-width: 100%;\n  }\n  .activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-pair-fullscreen-grid[_ngcontent-%COMP%]   .activities-rate-pair-inline-card-start[_ngcontent-%COMP%] {\n    flex: 0 0 var(--activities-pair-split);\n    width: auto;\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n    border-right-width: 0;\n  }\n  .activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-pair-fullscreen-grid[_ngcontent-%COMP%]   .activities-rate-pair-inline-card-end[_ngcontent-%COMP%] {\n    flex: 0 0 calc(100% - var(--activities-pair-split));\n    width: auto;\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n    border-left-width: 0;\n  }\n  .activities-rates-fullscreen[_ngcontent-%COMP%]   .activities-rate-score-badge-floating.activities-rate-score-badge-floating-pair-overlap[_ngcontent-%COMP%] {\n    left: 50%;\n    bottom: 4rem;\n    z-index: 28;\n    pointer-events: none;\n  }\n  .activities-rates-pair-fullscreen-resize-handle[_ngcontent-%COMP%] {\n    position: absolute;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    pointer-events: auto;\n    left: var(--activities-pair-split);\n    top: var(--activities-pair-pad);\n    bottom: var(--activities-pair-pad);\n    width: 36px;\n    transform: translateX(-50%);\n    border: 0;\n    padding: 0;\n    margin: 0;\n    background: transparent;\n    z-index: 40;\n    touch-action: none;\n    cursor: ew-resize;\n    -webkit-tap-highlight-color: transparent;\n  }\n  .activities-rates-pair-fullscreen-resize-handle[_ngcontent-%COMP%]::before {\n    content: "";\n    position: absolute;\n    inset: -12px -8px;\n  }\n  .activities-rates-pair-fullscreen-resize-handle-grip[_ngcontent-%COMP%] {\n    width: 4px;\n    height: 36%;\n    min-height: 52px;\n    border-radius: 999px;\n    border: 1px solid rgba(166, 196, 232, 0.74);\n    background:\n      linear-gradient(\n        180deg,\n        rgba(241, 247, 255, 0.94) 0%,\n        rgba(218, 232, 249, 0.9) 100%);\n    box-shadow: 0 0 0 1px rgba(9, 22, 40, 0.14), 0 8px 14px rgba(6, 18, 36, 0.34);\n    pointer-events: none;\n  }\n  .activities-rate-profile-stack.activities-rate-profile-stack-pair-fullscreen.is-resizing[_ngcontent-%COMP%]   .activities-rates-pair-fullscreen-resize-handle-grip[_ngcontent-%COMP%] {\n    background:\n      linear-gradient(\n        180deg,\n        rgba(255, 247, 227, 0.96) 0%,\n        rgba(255, 229, 165, 0.9) 100%);\n    border-color: rgba(218, 168, 51, 0.86);\n  }\n}\n/*# sourceMappingURL=pair-card.component.css.map */'], changeDetection: 0 });
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
`, styles: ['/* src/app/shared/ui/components/core/smart-list/card/pair-card/pair-card.component.scss */\n:host {\n  display: block;\n  width: 100%;\n  min-height: 0;\n}\n:host([data-card-presentation=fullscreen]) {\n  height: 100%;\n}\n.activities-rate-profile-card {\n  position: relative;\n  width: 100%;\n  min-height: 264px;\n  border: 1px solid rgba(34, 54, 84, 0.24);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      #1b2c45 0%,\n      #132238 100%);\n  overflow: hidden;\n  box-sizing: border-box;\n  touch-action: pan-y;\n}\n.activities-rate-profile-card.activities-row-item {\n  cursor: default;\n  transform: none;\n  transition: none;\n  animation: none;\n  -webkit-tap-highlight-color: transparent;\n}\n.activities-rate-profile-card.activities-row-item:hover,\n.activities-rate-profile-card.activities-row-item:active {\n  transform: none;\n  filter: none;\n}\n.activities-rate-profile-stack {\n  position: relative;\n  min-height: 264px;\n  height: 100%;\n}\n.activities-rate-profile-stack.activities-rate-profile-stack-pair-inline {\n  min-height: 264px;\n}\n.activities-rate-profile-stack.activities-rate-profile-stack-pair-fullscreen {\n  min-height: 100%;\n  height: 100%;\n}\n.activities-rate-pair-inline-grid {\n  position: absolute;\n  inset: 0;\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: clamp(0.28rem, 0.8vw, 0.52rem);\n  padding: 0.42rem;\n}\n.activities-rate-pair-inline-grid:not(.activities-rate-pair-fullscreen-grid) {\n  gap: clamp(0.08rem, 0.32vw, 0.16rem);\n}\n.activities-rate-pair-inline-card {\n  position: relative;\n  min-width: 0;\n  border-radius: 12px;\n  overflow: hidden;\n  border: 1px solid rgba(255, 255, 255, 0.28);\n  box-shadow: 0 10px 22px rgba(6, 18, 36, 0.3);\n}\n.activities-rate-pair-inline-layer {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  min-height: 0;\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n}\n.activities-rate-image-loader {\n  position: absolute;\n  inset: 0;\n  z-index: 2;\n  display: grid;\n  place-items: center;\n  pointer-events: none;\n  opacity: 0;\n  transition: opacity 120ms ease;\n}\n.activities-rate-image-loader app-indicator {\n  position: relative;\n  z-index: 1;\n}\n.activities-rate-pair-inline-layer.lazy-bg-loading .activities-rate-image-loader,\n.activities-rate-profile-layer.lazy-bg-loading .activities-rate-image-loader {\n  opacity: 1;\n}\n.activities-rate-pair-inline-layer.lazy-bg-loaded .activities-rate-image-loader,\n.activities-rate-profile-layer.lazy-bg-loaded .activities-rate-image-loader,\n.activities-rate-pair-inline-layer.lazy-bg-error .activities-rate-image-loader,\n.activities-rate-profile-layer.lazy-bg-error .activities-rate-image-loader {\n  opacity: 0;\n}\n.activities-rate-pair-inline-layer::after,\n.activities-rate-profile-layer::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  z-index: 0;\n  pointer-events: none;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(12, 22, 36, 0.04) 0%,\n      rgba(7, 16, 28, 0.62) 66%,\n      rgba(7, 16, 28, 0.84) 100%);\n}\n.activities-rate-pair-inline-layer .card-image-placeholder {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 4;\n}\n.activities-rate-pair-inline-card.is-pane-loading .activities-rate-profile-indicators .image-stack-line.active,\n.activities-rate-profile-stack.is-pane-loading .activities-rate-profile-indicators .image-stack-line.active {\n  animation: activities-rate-pane-loading-pulse 500ms ease;\n}\n@keyframes activities-rate-pane-loading-pulse {\n  0% {\n    transform: scaleX(0.84);\n    opacity: 0.58;\n  }\n  100% {\n    transform: scaleX(1);\n    opacity: 1;\n  }\n}\n.activities-rate-pair-inline-label {\n  position: absolute;\n  top: 0.64rem;\n  left: 0.52rem;\n  z-index: 5;\n  border-radius: 999px;\n  border: 1px solid rgba(212, 229, 249, 0.42);\n  color: #f5f9ff;\n  font-size: 0.66rem;\n  font-weight: 700;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.16rem 0.42rem;\n  background: rgba(8, 18, 35, 0.62);\n}\n.activities-rate-pair-inline-card-woman .activities-rate-pair-inline-label {\n  background: rgba(109, 42, 118, 0.64);\n}\n.activities-rate-pair-inline-card-man .activities-rate-pair-inline-label {\n  background: rgba(36, 74, 127, 0.66);\n}\n.shared-card-status-badge {\n  position: absolute;\n  top: 0.64rem;\n  right: 0.56rem;\n  z-index: 80;\n  max-width: calc(100% - 1.24rem);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  border-radius: 999px;\n  border: 1px solid rgba(148, 225, 182, 0.56);\n  background: rgba(8, 34, 18, 0.74);\n  color: #e9ffef;\n  font-size: 0.68rem;\n  font-weight: 700;\n  letter-spacing: 0.01em;\n  line-height: 1;\n  padding: 0.17rem 0.5rem;\n  pointer-events: none;\n}\n.shared-card-context-avatar-badge {\n  position: absolute;\n  top: 0.68rem;\n  left: 0.62rem;\n  z-index: 30;\n  width: 2.08rem;\n  height: 2.08rem;\n  display: inline-grid;\n  place-items: center;\n  border: 2px solid rgba(255, 255, 255, 0.84);\n  border-radius: 999px;\n  background: rgba(8, 18, 35, 0.74);\n  color: #f7fbff;\n  box-shadow: 0 7px 16px rgba(4, 12, 26, 0.36), inset 0 0 0 1px rgba(15, 35, 58, 0.26);\n  overflow: visible;\n  pointer-events: auto;\n  touch-action: manipulation;\n}\nbutton.shared-card-context-avatar-badge {\n  cursor: pointer;\n}\n.shared-card-context-avatar-badge img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  border-radius: inherit;\n}\n.shared-card-context-avatar-badge > span {\n  font-size: 0.68rem;\n  font-weight: 900;\n  line-height: 1;\n}\n.shared-card-context-avatar-badge em {\n  position: absolute;\n  top: -0.74rem;\n  right: -0.72rem;\n  z-index: 2;\n  min-width: 1rem;\n  height: 1rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border: 1px solid rgba(255, 255, 255, 0.88);\n  border-radius: 999px;\n  background: #d94c4c;\n  color: #fff;\n  font-size: 0.54rem;\n  font-style: normal;\n  font-weight: 900;\n  line-height: 1;\n  padding: 0 0.16rem;\n  box-shadow: 0 4px 10px rgba(77, 12, 24, 0.32);\n}\n.activities-rate-pair-inline-overlay,\n.activities-rate-profile-overlay {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 3;\n  display: grid;\n  gap: 0.14rem;\n}\n.activities-rate-pair-inline-overlay {\n  padding: 0.7rem 0.72rem 0.68rem;\n}\n.activities-rate-pair-inline-card .activities-rate-profile-indicators.activities-rate-pair-inline-indicators {\n  top: 0.28rem;\n  left: 0.34rem;\n  right: 0.34rem;\n  padding: 0.12rem 0.24rem;\n  border-radius: 7px;\n}\n.activities-rate-pair-inline-hit-area {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 4;\n}\n.activities-rate-profile-layer {\n  position: absolute;\n  inset: 0;\n  z-index: 1;\n  border-radius: 14px;\n  overflow: hidden;\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n  border: 1px solid rgba(255, 255, 255, 0.26);\n  box-shadow: 0 12px 24px rgba(6, 18, 36, 0.34);\n}\n:host([data-card-presentation=list]) .activities-rate-pair-inline-layer,\n:host([data-card-presentation=list]) .activities-rate-profile-layer {\n  background-size: contain;\n}\n.activities-rate-profile-layer-active {\n  pointer-events: none;\n}\n.activities-rate-profile-indicators {\n  position: absolute;\n  top: 0.36rem;\n  left: 0.52rem;\n  right: 0.52rem;\n  z-index: 10;\n  padding: 0.16rem 0.34rem;\n  border-radius: 8px;\n  background: rgba(10, 18, 31, 0.38);\n  gap: 5px;\n}\n.activities-rate-profile-indicators .image-stack-line {\n  height: 4px;\n  border: 1px solid rgba(28, 42, 64, 0.36);\n  background: rgba(167, 177, 192, 0.9);\n  opacity: 1;\n}\n.activities-rate-profile-indicators .image-stack-line.active {\n  border-color: rgba(248, 252, 255, 0.86);\n  background: rgba(250, 252, 255, 0.98);\n  box-shadow: 0 0 0 1px rgba(10, 20, 34, 0.12);\n}\n.activities-rate-profile-hit-area {\n  top: 0.2rem;\n  left: 0.2rem;\n  right: 0.2rem;\n  bottom: 0.2rem;\n  z-index: 4;\n}\n.shared-card-profile-view-btn {\n  position: absolute;\n  right: 0.56rem;\n  bottom: 0.56rem;\n  z-index: 18;\n  width: 2.22rem;\n  height: 2.22rem;\n  border: 1px solid rgba(41, 99, 143, 0.28);\n  border-radius: 999px;\n  background: rgba(232, 246, 251, 0.94);\n  color: #226d83;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  box-shadow: 0 8px 18px rgba(6, 24, 44, 0.2);\n  cursor: pointer;\n  pointer-events: auto;\n  transition:\n    background 0.16s ease,\n    border-color 0.16s ease,\n    transform 0.16s ease;\n  -webkit-tap-highlight-color: transparent;\n}\n.shared-card-profile-view-btn:hover,\n.shared-card-profile-view-btn:focus-visible {\n  background: rgba(218, 241, 249, 0.98);\n  border-color: rgba(31, 124, 153, 0.44);\n  transform: translateY(-1px);\n  outline: none;\n}\n.shared-card-profile-view-btn .mat-icon {\n  width: 1.34rem;\n  height: 1.34rem;\n  font-size: 1.34rem;\n  line-height: 1.34rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.activities-rate-pair-inline-card .shared-card-profile-view-btn {\n  right: 0.44rem;\n  bottom: 0.44rem;\n  width: 2rem;\n  height: 2rem;\n}\n.activities-rate-profile-overlay {\n  padding: 0.74rem 0.8rem 0.72rem;\n}\n.activities-rate-profile-line {\n  margin: 0;\n  color: #f5f9ff !important;\n  text-shadow: 0 2px 9px rgba(2, 8, 16, 0.96);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.activities-rate-profile-line-primary {\n  font-size: 0.9rem;\n  font-weight: 800;\n}\n.activities-rate-profile-line-secondary {\n  font-size: 0.76rem;\n  font-weight: 700;\n  color: rgba(237, 245, 255, 0.98) !important;\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-given .activities-rate-profile-layer {\n  border-color: rgba(63, 136, 208, 0.52);\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-received .activities-rate-profile-layer {\n  border-color: rgba(53, 160, 114, 0.52);\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-mutual .activities-rate-profile-layer {\n  border-color: rgba(176, 121, 48, 0.52);\n}\n.activities-rate-profile-stack-single.activities-rate-profile-stack-met .activities-rate-profile-layer {\n  border-color: rgba(104, 118, 139, 0.52);\n}\n.activities-rate-score-badge {\n  min-height: 26px;\n  border: 2px solid rgba(187, 136, 22, 0.58);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #fff9e9 0%,\n      #fff1cb 100%);\n  color: #9f6915;\n  font-size: 0.76rem;\n  font-weight: 800;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n  padding: 0.16rem 0.56rem;\n  cursor: pointer;\n  transform: translateY(0) scale(1);\n  box-shadow: inset 0 0 0 1px rgba(255, 245, 215, 0.72), 0 0 0 rgba(226, 171, 47, 0);\n  transition:\n    transform 0.16s ease,\n    box-shadow 0.2s ease,\n    border-color 0.2s ease,\n    filter 0.2s ease;\n}\n.activities-rate-score-badge .mat-icon {\n  width: 14px;\n  height: 14px;\n  font-size: 14px;\n  line-height: 14px;\n}\n.activities-rate-score-badge-floating {\n  position: absolute;\n  top: 0.6rem;\n  right: 0.3rem;\n  z-index: 24;\n  min-width: 68px;\n  justify-content: center;\n}\n.activities-rate-score-badge-between {\n  --activities-rate-badge-between-y: -50%;\n  position: absolute;\n  left: 50%;\n  right: auto;\n  top: 50%;\n  z-index: 24;\n  min-width: 68px;\n  width: max-content;\n  max-width: calc(100% - 0.8rem);\n  justify-content: center;\n  white-space: nowrap;\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n  transition:\n    box-shadow 0.2s ease,\n    border-color 0.2s ease,\n    filter 0.2s ease;\n}\n.activities-rate-profile-stack-pair-inline .activities-rate-score-badge-between {\n  --activities-rate-badge-between-y: 0;\n  top: auto;\n  bottom: clamp(3.2rem, 18%, 4.2rem);\n  left: 50% !important;\n  right: auto !important;\n  transform: translate(-50%, var(--activities-rate-badge-between-y)) !important;\n}\n.activities-rate-profile-stack-pair-inline .activities-rate-score-badge-between:not(.is-disabled):hover,\n.activities-rate-profile-stack-pair-inline .activities-rate-score-badge-between:not(.is-disabled):active,\n.activities-rate-profile-stack-pair-inline .activities-rate-score-badge-between.is-active:not(.is-disabled),\n.activities-rate-profile-stack-pair-inline .activities-rate-score-badge-between.is-active.is-pending:not(.is-disabled),\n.activities-rate-profile-stack-pair-inline .activities-rate-score-badge-between.is-disabled {\n  left: 50% !important;\n  right: auto !important;\n  transform: translate(-50%, 0) !important;\n}\n.activities-rates-fullscreen .activities-rate-score-badge-floating.activities-rate-score-badge-floating-pair-overlap {\n  --activities-rate-badge-between-y: 0;\n  top: auto;\n  bottom: clamp(3.2rem, 11%, 4.6rem);\n  left: var(--activities-pair-split, 50%);\n  right: auto;\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n  min-width: 68px;\n  width: max-content;\n  max-width: calc(100% - 0.8rem);\n  justify-content: center;\n  white-space: nowrap;\n}\n.activities-rates-fullscreen .activities-rate-score-badge-floating.activities-rate-score-badge-floating-pair-overlap.is-active:not(.is-disabled),\n.activities-rates-fullscreen .activities-rate-score-badge-floating.activities-rate-score-badge-floating-pair-overlap:not(.is-disabled):active {\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n@media (hover: hover) and (pointer: fine) {\n  button.activities-rate-score-badge:not(.is-disabled):hover {\n    transform: translateY(-1px) scale(1.03);\n    box-shadow: 0 6px 14px rgba(203, 150, 34, 0.28);\n    filter: saturate(1.05);\n  }\n}\nbutton.activities-rate-score-badge:not(.is-disabled):active {\n  transform: translateY(0) scale(0.96);\n  box-shadow: 0 2px 8px rgba(146, 105, 16, 0.22);\n}\nbutton.activities-rate-score-badge-between:not(.is-disabled):hover,\nbutton.activities-rate-score-badge-between:not(.is-disabled):active {\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n.activities-rate-score-badge.is-pending {\n  border-color: rgba(187, 56, 71, 0.62);\n  background:\n    linear-gradient(\n      180deg,\n      #ffe9ed 0%,\n      #ffd9df 100%);\n  color: #b63545;\n}\n.activities-rate-score-badge.is-active:not(.is-disabled) {\n  border-color: rgba(206, 148, 25, 0);\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ca 0%,\n      #ffe7a8 100%);\n  color: #8b560f;\n  box-shadow: none;\n  transform: translateY(0) scale(1);\n}\n.activities-rate-score-badge-between.is-active:not(.is-disabled),\n.activities-rate-score-badge-between.is-active.is-pending:not(.is-disabled) {\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n.activities-rate-score-badge.is-active.is-pending:not(.is-disabled) {\n  border-color: rgba(188, 53, 72, 0);\n  background:\n    linear-gradient(\n      180deg,\n      #ffdce4 0%,\n      #ffc8d3 100%);\n  color: #9d2232;\n  box-shadow: none;\n}\n@media (hover: hover) and (pointer: fine) {\n  button.activities-rate-score-badge.is-active:not(.is-disabled):hover {\n    border-color: rgba(206, 148, 25, 0.76);\n    box-shadow: 0 0 0 2px rgba(255, 244, 201, 0.68), 0 9px 16px rgba(170, 117, 20, 0.26);\n  }\n  button.activities-rate-score-badge.is-active.is-pending:not(.is-disabled):hover {\n    border-color: rgba(188, 53, 72, 0.72);\n    box-shadow: 0 0 0 2px rgba(255, 230, 236, 0.72), 0 9px 16px rgba(170, 48, 68, 0.24);\n  }\n}\n.activities-rate-score-badge.is-blink:not(.is-disabled) {\n  animation: game-rating-stars-blink 0.42s ease-in-out 1;\n}\n@keyframes game-rating-stars-blink {\n  0%, 100% {\n    filter: brightness(1);\n  }\n  50% {\n    filter: brightness(1.12) saturate(1.1);\n  }\n}\n.activities-rate-score-badge.is-disabled {\n  border-color: rgba(111, 123, 140, 0.52);\n  background:\n    linear-gradient(\n      180deg,\n      #f4f6f9 0%,\n      #e8edf3 100%);\n  color: #617085;\n  cursor: default;\n  transform: none;\n  box-shadow: none;\n  transition: none;\n}\n.activities-rate-score-badge-between.is-disabled {\n  right: auto;\n  transform: translate(-50%, var(--activities-rate-badge-between-y));\n}\n.activities-rate-score-badge[disabled],\nspan.activities-rate-score-badge {\n  pointer-events: none;\n}\nspan.activities-rate-score-badge {\n  cursor: default;\n  transition: none;\n}\n.image-stack-indicators {\n  position: absolute;\n  top: -0.1rem;\n  left: 0.25rem;\n  right: 0.25rem;\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));\n  gap: 4px;\n  width: auto !important;\n}\n.image-stack-hit-area {\n  position: absolute;\n  top: 10px;\n  left: 10px;\n  right: 10px;\n  bottom: 10px;\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));\n  gap: 4px;\n  z-index: 2;\n}\n.image-stack-hit-segment {\n  border: 0;\n  background: transparent;\n  padding: 0;\n  cursor: pointer;\n  width: 100%;\n  height: 100%;\n}\n.card-image-placeholder {\n  width: 84px;\n  height: 84px;\n  border-radius: 50%;\n  background:\n    linear-gradient(\n      145deg,\n      #4f7cff,\n      #7a3eff 60%,\n      #f04eab);\n  color: #fff;\n  font-weight: 800;\n  font-size: 1.72rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  letter-spacing: 0.03em;\n}\n.activities-rates-fullscreen {\n  position: relative;\n  display: flex;\n  justify-content: center;\n  align-items: flex-start;\n  width: 100%;\n  height: 100%;\n  min-width: 0;\n  min-height: 0;\n}\n.activities-rates-fullscreen-card {\n  margin: 0;\n  flex: 0 0 auto;\n  touch-action: pan-y;\n  width: 100%;\n  height: 100%;\n  max-width: 100%;\n  max-height: 100%;\n}\n.activities-rates-fullscreen .image-stack-line,\n.activities-rates-fullscreen .image-stack-hit-segment {\n  pointer-events: auto;\n}\n.activities-rates-fullscreen .activities-rate-profile-card {\n  min-height: 0;\n  background: #e6edf7;\n}\n.activities-rates-fullscreen .activities-rate-profile-stack {\n  min-height: 0;\n  height: 100%;\n  background: #d7e1ef;\n}\n.activities-rates-fullscreen-card-active .activities-rate-profile-layer {\n  background-color: #d3ddea;\n}\n.activities-rates-fullscreen .activities-rate-profile-stack.activities-rate-profile-stack-pair-fullscreen {\n  width: 100%;\n  margin-inline: 0;\n}\n.activities-rates-fullscreen .activities-rate-profile-stack.activities-rate-profile-stack-pair-fullscreen.activities-rate-profile-stack-pair {\n  border-radius: 14px;\n  border: 1px solid rgba(34, 54, 84, 0.24);\n  background:\n    linear-gradient(\n      180deg,\n      #1b2c45 0%,\n      #132238 100%);\n  overflow: hidden;\n}\n@media (min-width: 761px) {\n  .activities-rates-fullscreen-card {\n    width: calc(100% - var(--smart-list-pagination-arrow-size, 2.2rem)) !important;\n  }\n}\n.activities-rates-fullscreen .activities-rate-pair-fullscreen-grid {\n  --activities-pair-gap: clamp(0.28rem, 0.8vw, 0.52rem);\n  --activities-pair-pad: 0.42rem;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  grid-template-rows: minmax(0, 1fr);\n  gap: var(--activities-pair-gap);\n  padding: var(--activities-pair-pad);\n  box-sizing: border-box;\n}\n.activities-rates-fullscreen .activities-rate-pair-fullscreen-grid .activities-rate-pair-inline-card {\n  min-height: 0;\n  box-sizing: border-box;\n}\n.activities-rates-fullscreen .activities-rate-pair-fullscreen-grid .activities-rate-pair-inline-card.is-collapsed {\n  border-color: transparent;\n  box-shadow: none;\n}\n.activities-rates-fullscreen .activities-rate-pair-fullscreen-grid .activities-rate-pair-inline-card.is-collapsed > * {\n  opacity: 0;\n  pointer-events: none;\n}\n.activities-rates-fullscreen .activities-rate-pair-fullscreen-grid .activities-rate-pair-inline-indicators {\n  top: 0.28rem;\n  left: 0.38rem;\n  right: 0.38rem;\n}\n.activities-rates-fullscreen .activities-rate-pair-fullscreen-grid .activities-rate-pair-inline-overlay {\n  padding: 0.74rem 0.8rem 0.72rem;\n}\n.activities-rates-pair-fullscreen-resize-handle {\n  display: none;\n}\n.activities-rates-pair-fullscreen-resize-handle-grip {\n  display: block;\n  pointer-events: none;\n}\n@media (max-width: 760px) {\n  .activities-rates-fullscreen .activities-rate-pair-fullscreen-grid {\n    --activities-pair-gap: 0 !important;\n    --activities-pair-pad: 0.3rem !important;\n    display: flex;\n    gap: 0 !important;\n    padding: var(--activities-pair-pad) !important;\n    overflow: hidden;\n  }\n  .activities-rates-fullscreen .activities-rate-pair-fullscreen-grid::after {\n    content: "";\n    position: absolute;\n    top: var(--activities-pair-pad);\n    bottom: var(--activities-pair-pad);\n    left: var(--activities-pair-split);\n    width: 1px;\n    transform: translateX(-0.5px);\n    background: rgba(34, 54, 84, 0.58);\n    pointer-events: none;\n    z-index: 22;\n  }\n  .activities-rates-fullscreen .activities-rate-pair-fullscreen-grid .activities-rate-pair-inline-card {\n    min-width: 0;\n    max-width: 100%;\n  }\n  .activities-rates-fullscreen .activities-rate-pair-fullscreen-grid .activities-rate-pair-inline-card-start {\n    flex: 0 0 var(--activities-pair-split);\n    width: auto;\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n    border-right-width: 0;\n  }\n  .activities-rates-fullscreen .activities-rate-pair-fullscreen-grid .activities-rate-pair-inline-card-end {\n    flex: 0 0 calc(100% - var(--activities-pair-split));\n    width: auto;\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n    border-left-width: 0;\n  }\n  .activities-rates-fullscreen .activities-rate-score-badge-floating.activities-rate-score-badge-floating-pair-overlap {\n    left: 50%;\n    bottom: 4rem;\n    z-index: 28;\n    pointer-events: none;\n  }\n  .activities-rates-pair-fullscreen-resize-handle {\n    position: absolute;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    pointer-events: auto;\n    left: var(--activities-pair-split);\n    top: var(--activities-pair-pad);\n    bottom: var(--activities-pair-pad);\n    width: 36px;\n    transform: translateX(-50%);\n    border: 0;\n    padding: 0;\n    margin: 0;\n    background: transparent;\n    z-index: 40;\n    touch-action: none;\n    cursor: ew-resize;\n    -webkit-tap-highlight-color: transparent;\n  }\n  .activities-rates-pair-fullscreen-resize-handle::before {\n    content: "";\n    position: absolute;\n    inset: -12px -8px;\n  }\n  .activities-rates-pair-fullscreen-resize-handle-grip {\n    width: 4px;\n    height: 36%;\n    min-height: 52px;\n    border-radius: 999px;\n    border: 1px solid rgba(166, 196, 232, 0.74);\n    background:\n      linear-gradient(\n        180deg,\n        rgba(241, 247, 255, 0.94) 0%,\n        rgba(218, 232, 249, 0.9) 100%);\n    box-shadow: 0 0 0 1px rgba(9, 22, 40, 0.14), 0 8px 14px rgba(6, 18, 36, 0.34);\n    pointer-events: none;\n  }\n  .activities-rate-profile-stack.activities-rate-profile-stack-pair-fullscreen.is-resizing .activities-rates-pair-fullscreen-resize-handle-grip {\n    background:\n      linear-gradient(\n        180deg,\n        rgba(255, 247, 227, 0.96) 0%,\n        rgba(255, 229, 165, 0.9) 100%);\n    border-color: rgba(218, 168, 51, 0.86);\n  }\n}\n/*# sourceMappingURL=pair-card.component.css.map */\n'] }]
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

// src/app/shared/ui/components/core/smart-list/card/image-card/image-card.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function ImageCardComponent_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 2);
    \u0275\u0275element(1, "app-indicator", 9);
    \u0275\u0275elementEnd();
  }
}
function ImageCardComponent_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.resolvedPlaceholderLabel());
  }
}
function ImageCardComponent_Conditional_1_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.resolvedLabel());
  }
}
function ImageCardComponent_Conditional_1_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.resolvedSubtitle());
  }
}
function ImageCardComponent_Conditional_1_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.resolvedDetail());
  }
}
function ImageCardComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275conditionalCreate(1, ImageCardComponent_Conditional_1_Conditional_1_Template, 2, 0, "span", 2);
    \u0275\u0275conditionalCreate(2, ImageCardComponent_Conditional_1_Conditional_2_Template, 2, 1, "span", 3);
    \u0275\u0275conditionalCreate(3, ImageCardComponent_Conditional_1_Conditional_3_Template, 2, 1, "span", 4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 5)(5, "p", 6);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, ImageCardComponent_Conditional_1_Conditional_7_Template, 2, 1, "p", 7);
    \u0275\u0275conditionalCreate(8, ImageCardComponent_Conditional_1_Conditional_8_Template, 2, 1, "p", 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("appLazyBgImage", ctx_r0.resolvedImageUrl() || null);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.resolvedImageUrl() ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.resolvedImageUrl() ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.resolvedLabel() ? 3 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.resolvedTitle());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.resolvedSubtitle() ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.resolvedDetail() ? 8 : -1);
  }
}
function ImageCardComponent_Conditional_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 10);
    \u0275\u0275element(1, "app-indicator", 9);
    \u0275\u0275elementEnd();
  }
}
function ImageCardComponent_Conditional_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.resolvedPlaceholderLabel());
  }
}
function ImageCardComponent_Conditional_2_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.resolvedLabel());
  }
}
function ImageCardComponent_Conditional_2_Conditional_6_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const chip_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(chip_r2.icon);
  }
}
function ImageCardComponent_Conditional_2_Conditional_6_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const chip_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(chip_r2.label);
  }
}
function ImageCardComponent_Conditional_2_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 13);
    \u0275\u0275conditionalCreate(1, ImageCardComponent_Conditional_2_Conditional_6_Conditional_1_Template, 2, 1, "mat-icon");
    \u0275\u0275conditionalCreate(2, ImageCardComponent_Conditional_2_Conditional_6_Conditional_2_Template, 2, 1, "span");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const chip_r2 = ctx;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngClass", ctx_r0.statusChipClassList(chip_r2));
    \u0275\u0275attribute("aria-label", chip_r2.ariaLabel || null)("title", chip_r2.title || null);
    \u0275\u0275advance();
    \u0275\u0275conditional(chip_r2.icon ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(chip_r2.label ? 2 : -1);
  }
}
function ImageCardComponent_Conditional_2_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const badge_r3 = ctx;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngClass", ctx_r0.badgeClassList(badge_r3));
    \u0275\u0275attribute("aria-label", badge_r3.ariaLabel || null)("title", badge_r3.ariaLabel || null);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", badge_r3.label, " ");
  }
}
function ImageCardComponent_Conditional_2_For_9_Conditional_0_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 18);
    \u0275\u0275listener("click", function ImageCardComponent_Conditional_2_For_9_Conditional_0_For_2_Template_button_click_0_listener($event) {
      const action_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.onMediaAction(action_r5, $event));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const action_r5 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275property("ngClass", ctx_r0.mediaActionClassList(action_r5))("disabled", action_r5.disabled);
    \u0275\u0275attribute("aria-label", action_r5.ariaLabel || null)("title", action_r5.title || action_r5.ariaLabel || null);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.mediaActionIcon(action_r5));
  }
}
function ImageCardComponent_Conditional_2_For_9_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-menu-trigger", 17);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275property("menuId", ctx_r0.sharedMenuId())("title", ctx_r0.sharedMenuTitle())("trigger", ctx_r0.resolvedSharedMenuTrigger())("items", ctx_r0.resolvedSharedMenuItems())("context", ctx_r0.sharedMenuContext);
  }
}
function ImageCardComponent_Conditional_2_For_9_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15);
    \u0275\u0275repeaterCreate(1, ImageCardComponent_Conditional_2_For_9_Conditional_0_For_2_Template, 3, 5, "button", 16, _forTrack0);
    \u0275\u0275conditionalCreate(3, ImageCardComponent_Conditional_2_For_9_Conditional_0_Conditional_3_Template, 1, 5, "app-menu-trigger", 17);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const position_r6 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngClass", "ui-image-card__actions--" + position_r6);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.mediaActionsFor(position_r6));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.hasMenuAt(position_r6) ? 3 : -1);
  }
}
function ImageCardComponent_Conditional_2_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, ImageCardComponent_Conditional_2_For_9_Conditional_0_Template, 4, 2, "div", 15);
  }
  if (rf & 2) {
    const position_r6 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(ctx_r0.hasPositionControls(position_r6) ? 0 : -1);
  }
}
function ImageCardComponent_Conditional_2_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.resolvedSubtitle());
  }
}
function ImageCardComponent_Conditional_2_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.resolvedDetail());
  }
}
function ImageCardComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, ImageCardComponent_Conditional_2_Conditional_0_Template, 2, 0, "span", 10);
    \u0275\u0275elementStart(1, "span", 11)(2, "mat-icon");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, ImageCardComponent_Conditional_2_Conditional_4_Template, 2, 1, "span");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, ImageCardComponent_Conditional_2_Conditional_5_Template, 2, 1, "span", 12);
    \u0275\u0275conditionalCreate(6, ImageCardComponent_Conditional_2_Conditional_6_Template, 3, 5, "span", 13);
    \u0275\u0275conditionalCreate(7, ImageCardComponent_Conditional_2_Conditional_7_Template, 2, 4, "span", 13);
    \u0275\u0275repeaterCreate(8, ImageCardComponent_Conditional_2_For_9_Template, 1, 1, null, null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementStart(10, "div", 14)(11, "h4", 6);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(13, ImageCardComponent_Conditional_2_Conditional_13_Template, 2, 1, "p", 7);
    \u0275\u0275conditionalCreate(14, ImageCardComponent_Conditional_2_Conditional_14_Template, 2, 1, "p", 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_6_0;
    let tmp_7_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r0.resolvedImageUrl() ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275classProp("ui-image-card__overlay-placeholder--has-image", !!ctx_r0.resolvedImageUrl());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.resolvedPlaceholderIcon());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.resolvedPlaceholderLabel() ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.resolvedLabel() ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_6_0 = ctx_r0.resolvedStatusChip()) ? 6 : -1, tmp_6_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_7_0 = ctx_r0.resolvedBadge()) ? 7 : -1, tmp_7_0);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.mediaActionPositions);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.resolvedTitle());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.resolvedSubtitle() ? 13 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.resolvedDetail() ? 14 : -1);
  }
}
var ImageCardComponent = class _ImageCardComponent {
  mediaActionPositions = [
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right"
  ];
  card = null;
  imageUrl = "";
  title = "";
  subtitle = "";
  detail = "";
  label = null;
  placeholder = "";
  mediaActions = null;
  menuId = null;
  menuTitle = null;
  sharedMenuTrigger = null;
  sharedMenuItems = null;
  sharedMenuContext = null;
  mediaAction = new EventEmitter();
  rootClassList() {
    const classes = [
      "experience-item-card",
      "ui-image-card",
      `ui-image-card--layout-${this.resolvedLayout()}`
    ];
    const toneClass = `${this.card?.toneClass ?? ""}`.trim();
    if (toneClass) {
      classes.push(...toneClass.split(/\s+/));
    }
    if (this.hasBottomRightControls()) {
      classes.push("ui-image-card--with-bottom-right-controls");
    }
    if (this.hasPositionControls("top-right")) {
      classes.push("ui-image-card--with-top-right-controls");
    }
    return classes;
  }
  resolvedLayout() {
    return this.card?.layout ?? "stacked";
  }
  resolvedImageUrl() {
    return AppUtils.mediaImageVariantUrl(`${this.card?.imageUrl ?? this.card?.singleImageUrls?.[0] ?? this.imageUrl ?? ""}`.trim(), "medium");
  }
  resolvedTitle() {
    return `${this.card?.title ?? this.title ?? ""}`.trim();
  }
  resolvedSubtitle() {
    return `${this.card?.subtitle ?? this.subtitle ?? ""}`.trim();
  }
  resolvedDetail() {
    return `${this.card?.detail ?? this.detail ?? ""}`.trim();
  }
  resolvedLabel() {
    return `${this.label ?? ""}`.trim();
  }
  resolvedPlaceholderLabel() {
    return `${this.card?.placeholderLabel ?? this.placeholder ?? ""}`.trim();
  }
  resolvedPlaceholderIcon() {
    return `${this.card?.placeholderIcon ?? "image_not_supported"}`.trim();
  }
  resolvedStatusChip() {
    return this.card?.statusChip ?? null;
  }
  resolvedBadge() {
    return this.card?.badge ?? null;
  }
  resolvedMediaActions() {
    return this.mediaActions ?? this.card?.mediaActions ?? [];
  }
  mediaActionsFor(position) {
    return this.resolvedMediaActions().filter((action) => (action.position ?? "top-right") === position);
  }
  hasPositionControls(position) {
    return this.mediaActionsFor(position).length > 0 || this.hasMenuAt(position);
  }
  hasMenuAt(position) {
    return this.hasMenuActions() && position === "top-right";
  }
  hasBottomRightControls() {
    return this.hasPositionControls("bottom-right");
  }
  mediaActionIcon(action) {
    return `${action.selected && action.selectedIcon ? action.selectedIcon : action.icon}`.trim();
  }
  mediaActionClassList(action) {
    const classes = [
      "ui-image-card__action",
      `ui-image-card__action--${action.tone ?? "default"}`
    ];
    if (action.selected) {
      classes.push("is-selected");
    }
    const className = `${action.className ?? ""}`.trim();
    if (className) {
      classes.push(...className.split(/\s+/));
    }
    return classes;
  }
  statusChipClassList(chip) {
    const classes = [
      "ui-image-card__status-chip",
      `ui-image-card__status-chip--${chip.tone ?? "default"}`
    ];
    if (chip.label) {
      classes.push("ui-image-card__status-chip--with-label");
    }
    if (chip.palette) {
      classes.push(`ui-image-card__status-chip--palette-${chip.palette}`);
    }
    const className = `${chip.className ?? ""}`.trim();
    if (className) {
      classes.push(...className.split(/\s+/));
    }
    return classes;
  }
  badgeClassList(badge) {
    const classes = ["ui-image-card__badge"];
    if (badge.active) {
      classes.push("ui-image-card__badge--active");
    }
    if (badge.pending) {
      classes.push("ui-image-card__badge--pending");
    }
    if (badge.disabled) {
      classes.push("ui-image-card__badge--disabled");
    }
    const className = `${badge.className ?? ""}`.trim();
    if (className) {
      classes.push(...className.split(/\s+/));
    }
    return classes;
  }
  onMediaAction(action, event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.card || action.disabled) {
      return;
    }
    this.mediaAction.emit({
      id: this.card.id,
      action,
      card: this.card,
      sourceEvent: event
    });
  }
  sharedMenuId() {
    return `${this.menuId ?? `image-card-actions-${this.card?.id ?? "unknown"}`}`.trim();
  }
  sharedMenuTitle() {
    const title = `${this.menuTitle ?? this.card?.menuTitle ?? this.card?.title ?? ""}`.trim();
    return title || null;
  }
  resolvedSharedMenuTrigger() {
    const counter = Math.max(0, Math.trunc(Number(this.card?.menuBadgeCount) || 0));
    return this.sharedMenuTrigger ?? {
      icon: "more_vert",
      closeIcon: "close",
      hideLabel: true,
      layout: "icon",
      palette: "default",
      counter: counter > 0 ? { value: counter, max: 99 } : null,
      ariaLabel: "Open menu"
    };
  }
  resolvedSharedMenuItems() {
    if (this.sharedMenuItems?.length) {
      return this.sharedMenuItems;
    }
    const card = this.card;
    if (!card?.menuActions?.length) {
      return [];
    }
    return card.menuActions.flatMap((actionId) => {
      const config = CARD_MENU_ACTIONS[actionId];
      if (!config) {
        return [];
      }
      const action = __spreadValues({
        id: actionId
      }, config);
      return [{
        id: actionId,
        label: config.label,
        icon: config.icon,
        palette: this.sharedMenuActionPalette(config.tone),
        surface: "tinted",
        context: __spreadProps(__spreadValues({}, this.sharedMenuContext ?? {}), {
          card,
          action
        })
      }];
    });
  }
  hasMenuActions() {
    if (this.sharedMenuItems?.length) {
      return true;
    }
    return (this.card?.menuActions?.length ?? 0) > 0;
  }
  sharedMenuActionPalette(tone) {
    switch (tone) {
      case "positive":
        return "teal";
      case "accent":
        return "brown";
      case "warning":
      case "review":
        return "orange";
      case "destructive":
        return "danger";
      default:
        return "default";
    }
  }
  static \u0275fac = function ImageCardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ImageCardComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ImageCardComponent, selectors: [["app-image-card"]], inputs: { card: "card", imageUrl: "imageUrl", title: "title", subtitle: "subtitle", detail: "detail", label: "label", placeholder: "placeholder", mediaActions: "mediaActions", menuId: "menuId", menuTitle: "menuTitle", sharedMenuTrigger: "sharedMenuTrigger", sharedMenuItems: "sharedMenuItems", sharedMenuContext: "sharedMenuContext" }, outputs: { mediaAction: "mediaAction" }, decls: 3, vars: 3, consts: [[3, "ngClass", "appLazyBgImage"], [1, "ui-image-card__media", 3, "appLazyBgImage"], ["aria-hidden", "true", 1, "ui-image-card__image-loader"], [1, "ui-image-card__placeholder"], [1, "ui-image-card__label"], [1, "ui-image-card__body"], [1, "ui-image-card__title"], [1, "ui-image-card__subtitle"], [1, "ui-image-card__detail"], ["kind", "spinner-ring"], ["aria-hidden", "true", 1, "ui-image-card__image-loader", "ui-image-card__image-loader--overlay"], ["aria-hidden", "true", 1, "ui-image-card__overlay-placeholder"], [1, "ui-image-card__label", "ui-image-card__label--overlay"], [3, "ngClass"], [1, "ui-image-card__overlay-meta"], [1, "ui-image-card__actions", 3, "ngClass"], ["type", "button", 3, "ngClass", "disabled"], ["kind", "select", 1, "ui-image-card__menu-trigger", 3, "menuId", "title", "trigger", "items", "context"], ["type", "button", 3, "click", "ngClass", "disabled"]], template: function ImageCardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "article", 0);
      \u0275\u0275conditionalCreate(1, ImageCardComponent_Conditional_1_Template, 9, 7)(2, ImageCardComponent_Conditional_2_Template, 15, 11);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275property("ngClass", ctx.rootClassList())("appLazyBgImage", ctx.resolvedLayout() === "overlay" ? ctx.resolvedImageUrl() || null : null);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.resolvedLayout() === "stacked" ? 1 : 2);
    }
  }, dependencies: [CommonModule, NgClass, MatIconModule, MatIcon, LazyBgImageDirective, AppMenuTriggerComponent, IndicatorComponent], styles: ['\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n.form-flow__step-image-card[_nghost-%COMP%]   .ui-image-card[_ngcontent-%COMP%] {\n  height: 100%;\n  min-height: 100%;\n}\n.form-flow__step-image-card[_nghost-%COMP%]   .ui-image-card--layout-overlay[_ngcontent-%COMP%] {\n  min-height: 100%;\n}\n.ui-image-card[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: hidden;\n  box-sizing: border-box;\n  border: 1px solid rgba(34, 54, 84, 0.18);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      #f9fbff 0%,\n      #eef4ff 100%);\n  box-shadow: 0 8px 20px rgba(15, 33, 58, 0.08);\n}\n.ui-image-card--layout-overlay[_ngcontent-%COMP%] {\n  min-height: 250px;\n  border-radius: 13px;\n  background-color: #dfe8f7;\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n  isolation: isolate;\n}\n.ui-image-card--layout-overlay[_ngcontent-%COMP%]::before, \n.ui-image-card--layout-overlay[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n}\n.ui-image-card--layout-overlay[_ngcontent-%COMP%]::before {\n  z-index: 0;\n}\n.ui-image-card--layout-overlay[_ngcontent-%COMP%]::after {\n  z-index: 1;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(8, 16, 28, 0.14) 0%,\n      rgba(8, 15, 28, 0.82) 100%);\n}\n.ui-image-card--layout-overlay.ui-image-card--deleted[_ngcontent-%COMP%]::before {\n  -webkit-backdrop-filter: grayscale(0.86) saturate(0.48) contrast(0.9);\n  backdrop-filter: grayscale(0.86) saturate(0.48) contrast(0.9);\n  background: rgba(72, 78, 88, 0.16);\n}\n.ui-image-card__media[_ngcontent-%COMP%] {\n  position: relative;\n  min-height: 180px;\n  background-size: cover;\n  background-position: center;\n  background-color: #dfe8f7;\n}\n.ui-image-card__image-loader[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  z-index: 2;\n  display: grid;\n  place-items: center;\n  pointer-events: none;\n  opacity: 0;\n  transition: opacity 120ms ease;\n}\n.ui-image-card__image-loader[_ngcontent-%COMP%]   app-indicator[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n}\n.ui-image-card__media.lazy-bg-loading[_ngcontent-%COMP%]   .ui-image-card__image-loader[_ngcontent-%COMP%], \n.ui-image-card.lazy-bg-loading[_ngcontent-%COMP%]    > .ui-image-card__image-loader[_ngcontent-%COMP%] {\n  opacity: 1;\n}\n.ui-image-card__media.lazy-bg-loaded[_ngcontent-%COMP%]   .ui-image-card__image-loader[_ngcontent-%COMP%], \n.ui-image-card.lazy-bg-loaded[_ngcontent-%COMP%]    > .ui-image-card__image-loader[_ngcontent-%COMP%], \n.ui-image-card__media.lazy-bg-error[_ngcontent-%COMP%]   .ui-image-card__image-loader[_ngcontent-%COMP%], \n.ui-image-card.lazy-bg-error[_ngcontent-%COMP%]    > .ui-image-card__image-loader[_ngcontent-%COMP%] {\n  opacity: 0;\n}\n.ui-image-card__placeholder[_ngcontent-%COMP%], \n.ui-image-card__overlay-placeholder[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 50% auto auto 50%;\n  transform: translate(-50%, -50%);\n  width: 68px;\n  height: 68px;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  background:\n    linear-gradient(\n      145deg,\n      #4f7cff,\n      #7a3eff 60%,\n      #f04eab);\n  color: #fff;\n  font-size: 1.2rem;\n  font-weight: 800;\n}\n.ui-image-card__overlay-placeholder[_ngcontent-%COMP%] {\n  z-index: 2;\n  width: 58px;\n  height: 58px;\n  border: 1px solid rgba(255, 255, 255, 0.72);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.94) 0%,\n      rgba(226, 236, 250, 0.9) 100%);\n  color: #42618c;\n  box-shadow: 0 10px 24px rgba(10, 26, 48, 0.18);\n}\n.ui-image-card__overlay-placeholder[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 28px;\n  height: 28px;\n  font-size: 28px;\n  line-height: 28px;\n}\n.ui-image-card__overlay-placeholder[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: auto auto -1.15rem 50%;\n  transform: translateX(-50%);\n  color: rgba(255, 255, 255, 0.92);\n  font-size: 0.68rem;\n  white-space: nowrap;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);\n}\n.ui-image-card__overlay-placeholder--has-image[_ngcontent-%COMP%] {\n  display: none;\n}\n.ui-image-card--layout-overlay.lazy-bg-error[_ngcontent-%COMP%]   .ui-image-card__overlay-placeholder--has-image[_ngcontent-%COMP%] {\n  display: inline-flex;\n}\n.ui-image-card__label[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.65rem;\n  left: 0.65rem;\n  border-radius: 999px;\n  padding: 0.18rem 0.48rem;\n  background: rgba(9, 20, 39, 0.7);\n  color: #fff;\n  font-size: 0.68rem;\n  font-weight: 700;\n}\n.ui-image-card__label--overlay[_ngcontent-%COMP%] {\n  z-index: 3;\n}\n.ui-image-card__body[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.22rem;\n  padding: 0.78rem 0.82rem 0.88rem;\n}\n.ui-image-card__overlay-meta[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 0.58rem;\n  right: 0.58rem;\n  bottom: 0.52rem;\n  z-index: 2;\n  min-width: 0;\n}\n.ui-image-card--with-bottom-right-controls[_ngcontent-%COMP%]   .ui-image-card__overlay-meta[_ngcontent-%COMP%] {\n  right: 3.2rem;\n}\n.ui-image-card__title[_ngcontent-%COMP%], \n.ui-image-card__subtitle[_ngcontent-%COMP%], \n.ui-image-card__detail[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.ui-image-card__title[_ngcontent-%COMP%] {\n  color: #173356;\n  font-size: 0.95rem;\n  font-weight: 800;\n}\n.ui-image-card__subtitle[_ngcontent-%COMP%] {\n  color: #35577f;\n  font-size: 0.8rem;\n  font-weight: 700;\n}\n.ui-image-card__detail[_ngcontent-%COMP%] {\n  color: #5d7391;\n  font-size: 0.76rem;\n  line-height: 1.45;\n}\n.ui-image-card--layout-overlay[_ngcontent-%COMP%]   .ui-image-card__title[_ngcontent-%COMP%] {\n  color: #fff;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);\n}\n.ui-image-card--layout-overlay[_ngcontent-%COMP%]   .ui-image-card__subtitle[_ngcontent-%COMP%], \n.ui-image-card--layout-overlay[_ngcontent-%COMP%]   .ui-image-card__detail[_ngcontent-%COMP%] {\n  color: rgba(245, 249, 255, 0.96);\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.58);\n}\n.ui-image-card__actions[_ngcontent-%COMP%] {\n  position: absolute;\n  z-index: 4;\n  display: flex;\n  align-items: center;\n  gap: 0.42rem;\n}\n.ui-image-card__actions--top-left[_ngcontent-%COMP%] {\n  top: 0.48rem;\n  left: 0.48rem;\n}\n.ui-image-card__actions--top-right[_ngcontent-%COMP%] {\n  top: 0.48rem;\n  right: 0.48rem;\n}\n.ui-image-card__actions--bottom-left[_ngcontent-%COMP%] {\n  bottom: 0.48rem;\n  left: 0.48rem;\n}\n.ui-image-card__actions--bottom-right[_ngcontent-%COMP%] {\n  right: 0.48rem;\n  bottom: 0.48rem;\n}\n.ui-image-card__action[_ngcontent-%COMP%] {\n  appearance: none;\n  -webkit-appearance: none;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  border: 1px solid rgba(255, 255, 255, 0.86);\n  background: rgba(243, 249, 255, 0.92);\n  color: #275b98;\n  box-shadow: 0 6px 14px rgba(8, 18, 34, 0.2);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n}\n.ui-image-card__action[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.ui-image-card__action[_ngcontent-%COMP%]:disabled {\n  cursor: wait;\n  opacity: 0.82;\n}\n.ui-image-card__action--info[_ngcontent-%COMP%] {\n  border-color: rgba(41, 99, 143, 0.24);\n  background: rgba(232, 246, 251, 0.94);\n  color: #226d83;\n}\n.ui-image-card__action--success[_ngcontent-%COMP%], \n.ui-image-card__action--success.is-selected[_ngcontent-%COMP%] {\n  border-color: rgba(255, 255, 255, 0.92);\n  background:\n    linear-gradient(\n      180deg,\n      #2f9a59 0%,\n      #237846 100%);\n  color: #fff;\n  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.72), 0 6px 16px rgba(20, 84, 46, 0.3);\n}\n.ui-image-card__action--accent[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef7ff 0%,\n      #dcecff 100%);\n  color: #2c5d9e;\n}\n.ui-image-card__action--warning[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff5de 0%,\n      #ffe7b4 100%);\n  color: #9c6419;\n}\n.ui-image-card__action--destructive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff0f0 0%,\n      #ffe1e1 100%);\n  color: #bc3d45;\n}\n.ui-image-card__status-chip[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.48rem;\n  left: 0.48rem;\n  z-index: 3;\n  min-width: 28px;\n  height: 28px;\n  border-radius: 999px;\n  border: 1px solid rgba(255, 255, 255, 0.86);\n  background: rgba(26, 45, 71, 0.82);\n  color: #fff;\n  box-shadow: 0 6px 14px rgba(8, 18, 34, 0.22);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.26rem;\n  padding: 0 0.36rem;\n  font-size: 0.68rem;\n  font-weight: 800;\n}\n.ui-image-card__status-chip--with-label[_ngcontent-%COMP%] {\n  padding: 0 0.58rem;\n}\n.ui-image-card__status-chip[_ngcontent-%COMP%]:not(.ui-image-card__status-chip--with-label) {\n  width: 32px;\n  height: 32px;\n  padding: 0;\n  border-radius: 50%;\n}\n.ui-image-card__status-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.ui-image-card__status-chip--success[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #2f9a59 0%,\n      #237846 100%);\n}\n.ui-image-card__status-chip--warning[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #bd7a22 0%,\n      #9b5c17 100%);\n}\n.ui-image-card__status-chip--destructive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #bc4b55 0%,\n      #95343e 100%);\n}\n.ui-image-card__status-chip--palette-blue[_ngcontent-%COMP%], \n.ui-image-card__status-chip--palette-sky[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f0ff 0%,\n      #d9e7ff 100%);\n  color: #2b5d9d;\n}\n.ui-image-card__status-chip--palette-green[_ngcontent-%COMP%], \n.ui-image-card__status-chip--palette-success[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ecfaef 0%,\n      #dcf2e2 100%);\n  color: #2a7644;\n}\n.ui-image-card__status-chip--palette-gold[_ngcontent-%COMP%], \n.ui-image-card__status-chip--palette-amber[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff8e8 0%,\n      #fbeecf 100%);\n  color: #956215;\n}\n.ui-image-card__status-chip--palette-orange[_ngcontent-%COMP%], \n.ui-image-card__status-chip--palette-warning[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff6e8 0%,\n      #ffe8c9 100%);\n  color: #9c6121;\n}\n.ui-image-card__status-chip--palette-red[_ngcontent-%COMP%], \n.ui-image-card__status-chip--palette-danger[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff0f3 0%,\n      #ffdce3 100%);\n  color: #a93046;\n}\n.ui-image-card__status-chip--palette-muted[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4edf1 0%,\n      #e3d4dc 100%);\n  color: #6c3348;\n}\n.ui-image-card__badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.62rem;\n  right: 0.48rem;\n  z-index: 4;\n  min-height: 22px;\n  max-width: calc(100% - 0.96rem);\n  border-radius: 999px;\n  border: 1px solid rgba(255, 255, 255, 0.86);\n  padding: 0 0.52rem;\n  background:\n    linear-gradient(\n      180deg,\n      #eef2f7 0%,\n      #dbe2ec 100%);\n  color: #4e5d72;\n  box-shadow: 0 6px 14px rgba(28, 40, 58, 0.18);\n  font-size: 0.64rem;\n  font-weight: 800;\n  line-height: 1;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.ui-image-card--with-top-right-controls[_ngcontent-%COMP%]   .ui-image-card__badge[_ngcontent-%COMP%] {\n  right: 2.82rem;\n  max-width: calc(100% - 3.3rem);\n}\n.ui-image-card__badge--active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ecfaef 0%,\n      #dcf2e2 100%);\n  color: #2a7644;\n}\n.ui-image-card__badge--pending[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff6e8 0%,\n      #ffe8c9 100%);\n  color: #9c6121;\n}\n.ui-image-card__badge--disabled[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f6f9 0%,\n      #dfe5ec 100%);\n  color: #59677a;\n}\n.ui-image-card__badge--danger[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff0f3 0%,\n      #ffdce3 100%);\n  color: #a93046;\n  border-color: rgba(188, 76, 98, 0.36);\n  box-shadow: 0 6px 14px rgba(142, 40, 58, 0.18);\n}\n.ui-image-card__menu-trigger[_ngcontent-%COMP%] {\n  display: block;\n}\n@media (max-width: 760px) {\n  .ui-image-card--layout-overlay[_ngcontent-%COMP%] {\n    min-height: 190px;\n  }\n}\n/*# sourceMappingURL=image-card.component.css.map */'], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ImageCardComponent, [{
    type: Component,
    args: [{ selector: "app-image-card", standalone: true, imports: [CommonModule, MatIconModule, LazyBgImageDirective, AppMenuTriggerComponent, IndicatorComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: `<article
  [ngClass]="rootClassList()"
  [appLazyBgImage]="resolvedLayout() === 'overlay' ? (resolvedImageUrl() || null) : null"
  >
  @if (resolvedLayout() === 'stacked') {
    <div class="ui-image-card__media" [appLazyBgImage]="resolvedImageUrl() || null">
      @if (resolvedImageUrl()) {
        <span class="ui-image-card__image-loader" aria-hidden="true">
          <app-indicator kind="spinner-ring"></app-indicator>
        </span>
      }
      @if (!resolvedImageUrl()) {
        <span class="ui-image-card__placeholder">{{ resolvedPlaceholderLabel() }}</span>
      }
      @if (resolvedLabel()) {
        <span class="ui-image-card__label">{{ resolvedLabel() }}</span>
      }
    </div>
    <div class="ui-image-card__body">
      <p class="ui-image-card__title">{{ resolvedTitle() }}</p>
      @if (resolvedSubtitle()) {
        <p class="ui-image-card__subtitle">{{ resolvedSubtitle() }}</p>
      }
      @if (resolvedDetail()) {
        <p class="ui-image-card__detail">{{ resolvedDetail() }}</p>
      }
    </div>
  } @else {
    @if (resolvedImageUrl()) {
      <span class="ui-image-card__image-loader ui-image-card__image-loader--overlay" aria-hidden="true">
        <app-indicator kind="spinner-ring"></app-indicator>
      </span>
    }

    <span
      class="ui-image-card__overlay-placeholder"
      [class.ui-image-card__overlay-placeholder--has-image]="!!resolvedImageUrl()"
      aria-hidden="true"
      >
      <mat-icon>{{ resolvedPlaceholderIcon() }}</mat-icon>
      @if (resolvedPlaceholderLabel()) {
        <span>{{ resolvedPlaceholderLabel() }}</span>
      }
    </span>

    @if (resolvedLabel()) {
      <span class="ui-image-card__label ui-image-card__label--overlay">{{ resolvedLabel() }}</span>
    }

    @if (resolvedStatusChip(); as chip) {
      <span
        [ngClass]="statusChipClassList(chip)"
        [attr.aria-label]="chip.ariaLabel || null"
        [attr.title]="chip.title || null"
        >
        @if (chip.icon) {
          <mat-icon>{{ chip.icon }}</mat-icon>
        }
        @if (chip.label) {
          <span>{{ chip.label }}</span>
        }
      </span>
    }

    @if (resolvedBadge(); as badge) {
      <span
        [ngClass]="badgeClassList(badge)"
        [attr.aria-label]="badge.ariaLabel || null"
        [attr.title]="badge.ariaLabel || null"
        >
        {{ badge.label }}
      </span>
    }

    @for (position of mediaActionPositions; track position) {
      @if (hasPositionControls(position)) {
        <div
          class="ui-image-card__actions"
          [ngClass]="'ui-image-card__actions--' + position"
          >
          @for (action of mediaActionsFor(position); track action.id) {
            <button
              type="button"
              [ngClass]="mediaActionClassList(action)"
              [disabled]="action.disabled"
              [attr.aria-label]="action.ariaLabel || null"
              [attr.title]="action.title || action.ariaLabel || null"
              (click)="onMediaAction(action, $event)"
              >
              <mat-icon>{{ mediaActionIcon(action) }}</mat-icon>
            </button>
          }
          @if (hasMenuAt(position)) {
            <app-menu-trigger
              class="ui-image-card__menu-trigger"
              [menuId]="sharedMenuId()"
              kind="select"
              [title]="sharedMenuTitle()"
              [trigger]="resolvedSharedMenuTrigger()"
              [items]="resolvedSharedMenuItems()"
              [context]="sharedMenuContext"
            ></app-menu-trigger>
          }
        </div>
      }
    }

    <div class="ui-image-card__overlay-meta">
      <h4 class="ui-image-card__title">{{ resolvedTitle() }}</h4>
      @if (resolvedSubtitle()) {
        <p class="ui-image-card__subtitle">{{ resolvedSubtitle() }}</p>
      }
      @if (resolvedDetail()) {
        <p class="ui-image-card__detail">{{ resolvedDetail() }}</p>
      }
    </div>
  }
</article>
`, styles: ['/* src/app/shared/ui/components/core/smart-list/card/image-card/image-card.component.scss */\n:host {\n  display: block;\n  min-width: 0;\n}\n:host(.form-flow__step-image-card) .ui-image-card {\n  height: 100%;\n  min-height: 100%;\n}\n:host(.form-flow__step-image-card) .ui-image-card--layout-overlay {\n  min-height: 100%;\n}\n.ui-image-card {\n  position: relative;\n  overflow: hidden;\n  box-sizing: border-box;\n  border: 1px solid rgba(34, 54, 84, 0.18);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      #f9fbff 0%,\n      #eef4ff 100%);\n  box-shadow: 0 8px 20px rgba(15, 33, 58, 0.08);\n}\n.ui-image-card--layout-overlay {\n  min-height: 250px;\n  border-radius: 13px;\n  background-color: #dfe8f7;\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n  isolation: isolate;\n}\n.ui-image-card--layout-overlay::before,\n.ui-image-card--layout-overlay::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n}\n.ui-image-card--layout-overlay::before {\n  z-index: 0;\n}\n.ui-image-card--layout-overlay::after {\n  z-index: 1;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(8, 16, 28, 0.14) 0%,\n      rgba(8, 15, 28, 0.82) 100%);\n}\n.ui-image-card--layout-overlay.ui-image-card--deleted::before {\n  -webkit-backdrop-filter: grayscale(0.86) saturate(0.48) contrast(0.9);\n  backdrop-filter: grayscale(0.86) saturate(0.48) contrast(0.9);\n  background: rgba(72, 78, 88, 0.16);\n}\n.ui-image-card__media {\n  position: relative;\n  min-height: 180px;\n  background-size: cover;\n  background-position: center;\n  background-color: #dfe8f7;\n}\n.ui-image-card__image-loader {\n  position: absolute;\n  inset: 0;\n  z-index: 2;\n  display: grid;\n  place-items: center;\n  pointer-events: none;\n  opacity: 0;\n  transition: opacity 120ms ease;\n}\n.ui-image-card__image-loader app-indicator {\n  position: relative;\n  z-index: 1;\n}\n.ui-image-card__media.lazy-bg-loading .ui-image-card__image-loader,\n.ui-image-card.lazy-bg-loading > .ui-image-card__image-loader {\n  opacity: 1;\n}\n.ui-image-card__media.lazy-bg-loaded .ui-image-card__image-loader,\n.ui-image-card.lazy-bg-loaded > .ui-image-card__image-loader,\n.ui-image-card__media.lazy-bg-error .ui-image-card__image-loader,\n.ui-image-card.lazy-bg-error > .ui-image-card__image-loader {\n  opacity: 0;\n}\n.ui-image-card__placeholder,\n.ui-image-card__overlay-placeholder {\n  position: absolute;\n  inset: 50% auto auto 50%;\n  transform: translate(-50%, -50%);\n  width: 68px;\n  height: 68px;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  background:\n    linear-gradient(\n      145deg,\n      #4f7cff,\n      #7a3eff 60%,\n      #f04eab);\n  color: #fff;\n  font-size: 1.2rem;\n  font-weight: 800;\n}\n.ui-image-card__overlay-placeholder {\n  z-index: 2;\n  width: 58px;\n  height: 58px;\n  border: 1px solid rgba(255, 255, 255, 0.72);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.94) 0%,\n      rgba(226, 236, 250, 0.9) 100%);\n  color: #42618c;\n  box-shadow: 0 10px 24px rgba(10, 26, 48, 0.18);\n}\n.ui-image-card__overlay-placeholder .mat-icon {\n  width: 28px;\n  height: 28px;\n  font-size: 28px;\n  line-height: 28px;\n}\n.ui-image-card__overlay-placeholder span {\n  position: absolute;\n  inset: auto auto -1.15rem 50%;\n  transform: translateX(-50%);\n  color: rgba(255, 255, 255, 0.92);\n  font-size: 0.68rem;\n  white-space: nowrap;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);\n}\n.ui-image-card__overlay-placeholder--has-image {\n  display: none;\n}\n.ui-image-card--layout-overlay.lazy-bg-error .ui-image-card__overlay-placeholder--has-image {\n  display: inline-flex;\n}\n.ui-image-card__label {\n  position: absolute;\n  top: 0.65rem;\n  left: 0.65rem;\n  border-radius: 999px;\n  padding: 0.18rem 0.48rem;\n  background: rgba(9, 20, 39, 0.7);\n  color: #fff;\n  font-size: 0.68rem;\n  font-weight: 700;\n}\n.ui-image-card__label--overlay {\n  z-index: 3;\n}\n.ui-image-card__body {\n  display: grid;\n  gap: 0.22rem;\n  padding: 0.78rem 0.82rem 0.88rem;\n}\n.ui-image-card__overlay-meta {\n  position: absolute;\n  left: 0.58rem;\n  right: 0.58rem;\n  bottom: 0.52rem;\n  z-index: 2;\n  min-width: 0;\n}\n.ui-image-card--with-bottom-right-controls .ui-image-card__overlay-meta {\n  right: 3.2rem;\n}\n.ui-image-card__title,\n.ui-image-card__subtitle,\n.ui-image-card__detail {\n  margin: 0;\n}\n.ui-image-card__title {\n  color: #173356;\n  font-size: 0.95rem;\n  font-weight: 800;\n}\n.ui-image-card__subtitle {\n  color: #35577f;\n  font-size: 0.8rem;\n  font-weight: 700;\n}\n.ui-image-card__detail {\n  color: #5d7391;\n  font-size: 0.76rem;\n  line-height: 1.45;\n}\n.ui-image-card--layout-overlay .ui-image-card__title {\n  color: #fff;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);\n}\n.ui-image-card--layout-overlay .ui-image-card__subtitle,\n.ui-image-card--layout-overlay .ui-image-card__detail {\n  color: rgba(245, 249, 255, 0.96);\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.58);\n}\n.ui-image-card__actions {\n  position: absolute;\n  z-index: 4;\n  display: flex;\n  align-items: center;\n  gap: 0.42rem;\n}\n.ui-image-card__actions--top-left {\n  top: 0.48rem;\n  left: 0.48rem;\n}\n.ui-image-card__actions--top-right {\n  top: 0.48rem;\n  right: 0.48rem;\n}\n.ui-image-card__actions--bottom-left {\n  bottom: 0.48rem;\n  left: 0.48rem;\n}\n.ui-image-card__actions--bottom-right {\n  right: 0.48rem;\n  bottom: 0.48rem;\n}\n.ui-image-card__action {\n  appearance: none;\n  -webkit-appearance: none;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  border: 1px solid rgba(255, 255, 255, 0.86);\n  background: rgba(243, 249, 255, 0.92);\n  color: #275b98;\n  box-shadow: 0 6px 14px rgba(8, 18, 34, 0.2);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n}\n.ui-image-card__action .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.ui-image-card__action:disabled {\n  cursor: wait;\n  opacity: 0.82;\n}\n.ui-image-card__action--info {\n  border-color: rgba(41, 99, 143, 0.24);\n  background: rgba(232, 246, 251, 0.94);\n  color: #226d83;\n}\n.ui-image-card__action--success,\n.ui-image-card__action--success.is-selected {\n  border-color: rgba(255, 255, 255, 0.92);\n  background:\n    linear-gradient(\n      180deg,\n      #2f9a59 0%,\n      #237846 100%);\n  color: #fff;\n  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.72), 0 6px 16px rgba(20, 84, 46, 0.3);\n}\n.ui-image-card__action--accent {\n  background:\n    linear-gradient(\n      180deg,\n      #eef7ff 0%,\n      #dcecff 100%);\n  color: #2c5d9e;\n}\n.ui-image-card__action--warning {\n  background:\n    linear-gradient(\n      180deg,\n      #fff5de 0%,\n      #ffe7b4 100%);\n  color: #9c6419;\n}\n.ui-image-card__action--destructive {\n  background:\n    linear-gradient(\n      180deg,\n      #fff0f0 0%,\n      #ffe1e1 100%);\n  color: #bc3d45;\n}\n.ui-image-card__status-chip {\n  position: absolute;\n  top: 0.48rem;\n  left: 0.48rem;\n  z-index: 3;\n  min-width: 28px;\n  height: 28px;\n  border-radius: 999px;\n  border: 1px solid rgba(255, 255, 255, 0.86);\n  background: rgba(26, 45, 71, 0.82);\n  color: #fff;\n  box-shadow: 0 6px 14px rgba(8, 18, 34, 0.22);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.26rem;\n  padding: 0 0.36rem;\n  font-size: 0.68rem;\n  font-weight: 800;\n}\n.ui-image-card__status-chip--with-label {\n  padding: 0 0.58rem;\n}\n.ui-image-card__status-chip:not(.ui-image-card__status-chip--with-label) {\n  width: 32px;\n  height: 32px;\n  padding: 0;\n  border-radius: 50%;\n}\n.ui-image-card__status-chip .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.ui-image-card__status-chip--success {\n  background:\n    linear-gradient(\n      180deg,\n      #2f9a59 0%,\n      #237846 100%);\n}\n.ui-image-card__status-chip--warning {\n  background:\n    linear-gradient(\n      180deg,\n      #bd7a22 0%,\n      #9b5c17 100%);\n}\n.ui-image-card__status-chip--destructive {\n  background:\n    linear-gradient(\n      180deg,\n      #bc4b55 0%,\n      #95343e 100%);\n}\n.ui-image-card__status-chip--palette-blue,\n.ui-image-card__status-chip--palette-sky {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f0ff 0%,\n      #d9e7ff 100%);\n  color: #2b5d9d;\n}\n.ui-image-card__status-chip--palette-green,\n.ui-image-card__status-chip--palette-success {\n  background:\n    linear-gradient(\n      180deg,\n      #ecfaef 0%,\n      #dcf2e2 100%);\n  color: #2a7644;\n}\n.ui-image-card__status-chip--palette-gold,\n.ui-image-card__status-chip--palette-amber {\n  background:\n    linear-gradient(\n      180deg,\n      #fff8e8 0%,\n      #fbeecf 100%);\n  color: #956215;\n}\n.ui-image-card__status-chip--palette-orange,\n.ui-image-card__status-chip--palette-warning {\n  background:\n    linear-gradient(\n      180deg,\n      #fff6e8 0%,\n      #ffe8c9 100%);\n  color: #9c6121;\n}\n.ui-image-card__status-chip--palette-red,\n.ui-image-card__status-chip--palette-danger {\n  background:\n    linear-gradient(\n      180deg,\n      #fff0f3 0%,\n      #ffdce3 100%);\n  color: #a93046;\n}\n.ui-image-card__status-chip--palette-muted {\n  background:\n    linear-gradient(\n      180deg,\n      #f4edf1 0%,\n      #e3d4dc 100%);\n  color: #6c3348;\n}\n.ui-image-card__badge {\n  position: absolute;\n  top: 0.62rem;\n  right: 0.48rem;\n  z-index: 4;\n  min-height: 22px;\n  max-width: calc(100% - 0.96rem);\n  border-radius: 999px;\n  border: 1px solid rgba(255, 255, 255, 0.86);\n  padding: 0 0.52rem;\n  background:\n    linear-gradient(\n      180deg,\n      #eef2f7 0%,\n      #dbe2ec 100%);\n  color: #4e5d72;\n  box-shadow: 0 6px 14px rgba(28, 40, 58, 0.18);\n  font-size: 0.64rem;\n  font-weight: 800;\n  line-height: 1;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.ui-image-card--with-top-right-controls .ui-image-card__badge {\n  right: 2.82rem;\n  max-width: calc(100% - 3.3rem);\n}\n.ui-image-card__badge--active {\n  background:\n    linear-gradient(\n      180deg,\n      #ecfaef 0%,\n      #dcf2e2 100%);\n  color: #2a7644;\n}\n.ui-image-card__badge--pending {\n  background:\n    linear-gradient(\n      180deg,\n      #fff6e8 0%,\n      #ffe8c9 100%);\n  color: #9c6121;\n}\n.ui-image-card__badge--disabled {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f6f9 0%,\n      #dfe5ec 100%);\n  color: #59677a;\n}\n.ui-image-card__badge--danger {\n  background:\n    linear-gradient(\n      180deg,\n      #fff0f3 0%,\n      #ffdce3 100%);\n  color: #a93046;\n  border-color: rgba(188, 76, 98, 0.36);\n  box-shadow: 0 6px 14px rgba(142, 40, 58, 0.18);\n}\n.ui-image-card__menu-trigger {\n  display: block;\n}\n@media (max-width: 760px) {\n  .ui-image-card--layout-overlay {\n    min-height: 190px;\n  }\n}\n/*# sourceMappingURL=image-card.component.css.map */\n'] }]
  }], null, { card: [{
    type: Input
  }], imageUrl: [{
    type: Input
  }], title: [{
    type: Input
  }], subtitle: [{
    type: Input
  }], detail: [{
    type: Input
  }], label: [{
    type: Input
  }], placeholder: [{
    type: Input
  }], mediaActions: [{
    type: Input
  }], menuId: [{
    type: Input
  }], menuTitle: [{
    type: Input
  }], sharedMenuTrigger: [{
    type: Input
  }], sharedMenuItems: [{
    type: Input
  }], sharedMenuContext: [{
    type: Input
  }], mediaAction: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ImageCardComponent, { className: "ImageCardComponent", filePath: "app/shared/ui/components/core/smart-list/card/image-card/image-card.component.ts", lineNumber: 34 });
})();

// src/app/shared/ui/components/core/smart-list/card/header-card/header-card.component.ts
function HeaderCardComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 3);
    \u0275\u0275element(1, "app-indicator", 9);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const card_r1 = \u0275\u0275readContextLet(0);
    \u0275\u0275advance();
    \u0275\u0275property("state", (card_r1 == null ? null : card_r1.ringState) || "loading");
  }
}
function HeaderCardComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const card_r1 = \u0275\u0275readContextLet(0);
    \u0275\u0275textInterpolate1(" ", (card_r1 == null ? null : card_r1.initials) || "", " ");
  }
}
function HeaderCardComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 10);
    \u0275\u0275listener("click", function HeaderCardComponent_Conditional_7_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onEdit($event));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "edit");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const card_r1 = \u0275\u0275readContextLet(0);
    \u0275\u0275property("disabled", (card_r1 == null ? null : card_r1.editDisabled) === true);
    \u0275\u0275attribute("aria-label", (card_r1 == null ? null : card_r1.editAriaLabel) || "Edit");
  }
}
function HeaderCardComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 6)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const card_r1 = \u0275\u0275readContextLet(0);
    \u0275\u0275property("ngStyle", (card_r1 == null ? null : card_r1.badgeStyle) ?? null);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(card_r1 == null ? null : card_r1.badgeLabel);
  }
}
function HeaderCardComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 8)(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const card_r1 = \u0275\u0275readContextLet(0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((card_r1 == null ? null : card_r1.metaIcon) || "location_on");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(card_r1 == null ? null : card_r1.meta);
  }
}
var HeaderCardComponent = class _HeaderCardComponent {
  model = null;
  edit = new EventEmitter();
  onEdit(event) {
    event.stopPropagation();
    if (this.model?.editDisabled === true) {
      return;
    }
    this.edit.emit(event);
  }
  static \u0275fac = function HeaderCardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HeaderCardComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _HeaderCardComponent, selectors: [["app-header-card"]], inputs: { model: "model" }, outputs: { edit: "edit" }, decls: 13, vars: 16, consts: [[1, "header-card", 3, "ngClass"], [1, "header-card__main"], [1, "header-card__avatar-stack"], ["aria-hidden", "true", 1, "header-card__ring"], [1, "header-card__avatar", 3, "ngClass"], ["type", "button", 1, "header-card__edit", 3, "disabled"], [1, "header-card__badge", 3, "ngStyle"], [1, "header-card__text"], [1, "header-card__meta"], ["kind", "action-ring", "shape", "circle", 3, "state"], ["type", "button", 1, "header-card__edit", 3, "click", "disabled"]], template: function HeaderCardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275declareLet(0);
      \u0275\u0275elementStart(1, "section", 0)(2, "div", 1)(3, "div", 2);
      \u0275\u0275conditionalCreate(4, HeaderCardComponent_Conditional_4_Template, 2, 1, "span", 3);
      \u0275\u0275elementStart(5, "span", 4);
      \u0275\u0275conditionalCreate(6, HeaderCardComponent_Conditional_6_Template, 1, 1);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(7, HeaderCardComponent_Conditional_7_Template, 3, 2, "button", 5);
      \u0275\u0275conditionalCreate(8, HeaderCardComponent_Conditional_8_Template, 3, 2, "span", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "div", 7)(10, "h3");
      \u0275\u0275text(11);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(12, HeaderCardComponent_Conditional_12_Template, 5, 2, "span", 8);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      const card_r4 = \u0275\u0275storeLet(ctx.model);
      const imageUrl_r5 = (card_r4 == null ? null : card_r4.imageUrl) || null;
      const gender_r6 = (card_r4 == null ? null : card_r4.gender) || null;
      \u0275\u0275advance();
      \u0275\u0275classProp("header-card--admin", (card_r4 == null ? null : card_r4.admin) === true);
      \u0275\u0275property("ngClass", (card_r4 == null ? null : card_r4.statusClass) || "status-inactive");
      \u0275\u0275advance(2);
      \u0275\u0275attribute("title", (card_r4 == null ? null : card_r4.ringTitle) || null);
      \u0275\u0275advance();
      \u0275\u0275conditional((card_r4 == null ? null : card_r4.showRing) === true ? 4 : -1);
      \u0275\u0275advance();
      \u0275\u0275styleProp("background-image", imageUrl_r5 ? "url(" + imageUrl_r5 + ")" : null);
      \u0275\u0275classProp("has-photo", !!imageUrl_r5);
      \u0275\u0275property("ngClass", gender_r6 ? "user-color-" + gender_r6 : null);
      \u0275\u0275advance();
      \u0275\u0275conditional(!imageUrl_r5 ? 6 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((card_r4 == null ? null : card_r4.showEdit) === true ? 7 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((card_r4 == null ? null : card_r4.badgeLabel) ? 8 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate((card_r4 == null ? null : card_r4.title) || "");
      \u0275\u0275advance();
      \u0275\u0275conditional((card_r4 == null ? null : card_r4.meta) ? 12 : -1);
    }
  }, dependencies: [CommonModule, NgClass, NgStyle, MatIconModule, MatIcon, IndicatorComponent], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n}\n.header-card[_ngcontent-%COMP%] {\n  position: relative;\n  border: 1px solid rgba(23, 33, 54, 0.12);\n  border-radius: var(--app-header-card-radius, 12px);\n  background: #f9fcff;\n  padding: var(--app-header-card-padding, 0.66rem);\n  padding-top: var(--app-header-card-padding-top, var(--app-header-card-padding, 0.66rem));\n  min-width: 0;\n}\n.navigator-menu-header-card[_nghost-%COMP%]   .header-card[_ngcontent-%COMP%] {\n  border-radius: 0;\n}\n.header-card.status-public[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f5fbf7 0%,\n      #eef8f2 100%);\n  border-color: rgba(47, 143, 102, 0.24);\n}\n.header-card.status-friends[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f8ff 0%,\n      #edf4ff 100%);\n  border-color: rgba(44, 98, 170, 0.22);\n}\n.header-card.status-host[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff8f0 0%,\n      #fdf3e5 100%);\n  border-color: rgba(145, 96, 27, 0.24);\n}\n.header-card.status-inactive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9fc 0%,\n      #f1f4f8 100%);\n  border-color: rgba(88, 101, 121, 0.2);\n}\n.header-card.status-blocked[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f1 0%,\n      #f6d9d9 100%);\n  border-color: rgba(179, 52, 66, 0.38);\n}\n.header-card__main[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.82rem;\n  min-width: 0;\n}\n.header-card--admin[_ngcontent-%COMP%]   .header-card__main[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 96px minmax(0, 1fr);\n  column-gap: 0.95rem;\n}\n.header-card__avatar-stack[_ngcontent-%COMP%] {\n  --header-card-badge-overhang: var(--app-header-card-badge-overhang, 6px);\n  position: relative;\n  padding-bottom: var(--header-card-badge-overhang);\n  width: max-content;\n  max-width: 100%;\n}\n.header-card__ring[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: -8px;\n  pointer-events: none;\n}\n.header-card__avatar[_ngcontent-%COMP%] {\n  width: 96px;\n  height: 96px;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: #fff;\n  font-size: 30px;\n  font-weight: 700;\n  letter-spacing: 0.02em;\n  overflow: hidden;\n  box-shadow: 0 6px 16px rgba(16, 30, 56, 0.24);\n}\n.header-card__avatar.has-photo[_ngcontent-%COMP%] {\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n  color: transparent;\n  font-size: 0;\n}\n.user-color-woman[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #d3754c,\n      #ac4a24);\n}\n.user-color-man[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #3572a4,\n      #194364);\n}\n.header-card__edit[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -6px;\n  right: -6px;\n  width: 30px;\n  height: 30px;\n  border: 0;\n  border-radius: 50%;\n  background: #2f7cc3;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 0 0 2px #fff;\n  cursor: pointer;\n  transition:\n    transform 0.16s ease,\n    box-shadow 0.16s ease,\n    background-color 0.16s ease;\n}\n.header-card__edit[_ngcontent-%COMP%]:disabled {\n  cursor: default;\n  opacity: 0.52;\n}\n.header-card__edit[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.header-card__badge[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 50%;\n  bottom: 0;\n  transform: translateX(-50%);\n  min-width: 0;\n  width: fit-content;\n  height: 24px;\n  border-radius: 999px;\n  background: #d8effa;\n  border: 1px solid #8ac9e2;\n  color: #1f6780;\n  font-size: 13px;\n  font-weight: 700;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0 8px;\n}\n.header-card__text[_ngcontent-%COMP%] {\n  min-width: 0;\n  align-self: center;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.45rem;\n  text-align: center;\n  padding-top: var(--app-header-card-text-padding-top, 0);\n}\n.header-card--admin[_ngcontent-%COMP%]   .header-card__text[_ngcontent-%COMP%] {\n  align-items: flex-start;\n  align-self: stretch;\n  justify-content: center;\n  text-align: left;\n  gap: 0.24rem;\n  min-height: 96px;\n  padding: 2.05rem 0 0 0;\n}\n.header-card__text[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #102541;\n  font-size: clamp(1.3rem, 2.4vw, 2rem);\n  line-height: 1.12;\n  font-weight: 800;\n}\n.header-card--admin[_ngcontent-%COMP%]   .header-card__text[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  max-width: 100%;\n  font-size: 1.28rem;\n  overflow-wrap: anywhere;\n}\n.header-card__meta[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n  font-size: 1.02rem;\n  color: rgba(26, 45, 71, 0.78);\n  font-weight: 700;\n}\n.header-card--admin[_ngcontent-%COMP%]   .header-card__meta[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n  max-width: 100%;\n  line-height: 1.18;\n  padding-right: 2.45rem;\n}\n.header-card__meta[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n@media (hover: hover) and (pointer: fine) {\n  .header-card__edit[_ngcontent-%COMP%]:not(:disabled):hover {\n    transform: translateY(-1px) scale(1.03);\n    background: #256aa9;\n    box-shadow: 0 0 0 2px #fff, 0 4px 10px rgba(31, 73, 120, 0.22);\n  }\n}\n@media (max-width: 640px) {\n  .header-card__avatar[_ngcontent-%COMP%] {\n    width: 74px;\n    height: 74px;\n    font-size: 24px;\n  }\n  .header-card--admin[_ngcontent-%COMP%]   .header-card__main[_ngcontent-%COMP%] {\n    grid-template-columns: 74px minmax(0, 1fr);\n  }\n  .header-card__text[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n    font-size: 1.4rem;\n  }\n  .header-card__meta[_ngcontent-%COMP%] {\n    font-size: 0.92rem;\n  }\n}\n/*# sourceMappingURL=header-card.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HeaderCardComponent, [{
    type: Component,
    args: [{ selector: "app-header-card", standalone: true, imports: [CommonModule, MatIconModule, IndicatorComponent], template: `@let card = model;
@let imageUrl = card?.imageUrl || null;
@let gender = card?.gender || null;

<section
  class="header-card"
  [class.header-card--admin]="card?.admin === true"
  [ngClass]="card?.statusClass || 'status-inactive'"
>
  <div class="header-card__main">
    <div class="header-card__avatar-stack" [attr.title]="card?.ringTitle || null">
      @if (card?.showRing === true) {
        <span class="header-card__ring" aria-hidden="true">
          <app-indicator
            kind="action-ring"
            shape="circle"
            [state]="card?.ringState || 'loading'"
          ></app-indicator>
        </span>
      }
      <span
        class="header-card__avatar"
        [class.has-photo]="!!imageUrl"
        [ngClass]="gender ? 'user-color-' + gender : null"
        [style.backgroundImage]="imageUrl ? 'url(' + imageUrl + ')' : null"
      >
        @if (!imageUrl) {
          {{ card?.initials || '' }}
        }
      </span>
      @if (card?.showEdit === true) {
        <button
          type="button"
          class="header-card__edit"
          [disabled]="card?.editDisabled === true"
          [attr.aria-label]="card?.editAriaLabel || 'Edit'"
          (click)="onEdit($event)"
        >
          <mat-icon>edit</mat-icon>
        </button>
      }
      @if (card?.badgeLabel) {
        <span class="header-card__badge" [ngStyle]="card?.badgeStyle ?? null">
          <span>{{ card?.badgeLabel }}</span>
        </span>
      }
    </div>
    <div class="header-card__text">
      <h3>{{ card?.title || '' }}</h3>
      @if (card?.meta) {
        <span class="header-card__meta">
          <mat-icon>{{ card?.metaIcon || 'location_on' }}</mat-icon>
          <span>{{ card?.meta }}</span>
        </span>
      }
    </div>
  </div>
</section>
`, styles: ["/* src/app/shared/ui/components/core/smart-list/card/header-card/header-card.component.scss */\n:host {\n  display: block;\n}\n.header-card {\n  position: relative;\n  border: 1px solid rgba(23, 33, 54, 0.12);\n  border-radius: var(--app-header-card-radius, 12px);\n  background: #f9fcff;\n  padding: var(--app-header-card-padding, 0.66rem);\n  padding-top: var(--app-header-card-padding-top, var(--app-header-card-padding, 0.66rem));\n  min-width: 0;\n}\n:host(.navigator-menu-header-card) .header-card {\n  border-radius: 0;\n}\n.header-card.status-public {\n  background:\n    linear-gradient(\n      180deg,\n      #f5fbf7 0%,\n      #eef8f2 100%);\n  border-color: rgba(47, 143, 102, 0.24);\n}\n.header-card.status-friends {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f8ff 0%,\n      #edf4ff 100%);\n  border-color: rgba(44, 98, 170, 0.22);\n}\n.header-card.status-host {\n  background:\n    linear-gradient(\n      180deg,\n      #fff8f0 0%,\n      #fdf3e5 100%);\n  border-color: rgba(145, 96, 27, 0.24);\n}\n.header-card.status-inactive {\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9fc 0%,\n      #f1f4f8 100%);\n  border-color: rgba(88, 101, 121, 0.2);\n}\n.header-card.status-blocked {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f1 0%,\n      #f6d9d9 100%);\n  border-color: rgba(179, 52, 66, 0.38);\n}\n.header-card__main {\n  display: flex;\n  align-items: center;\n  gap: 0.82rem;\n  min-width: 0;\n}\n.header-card--admin .header-card__main {\n  display: grid;\n  grid-template-columns: 96px minmax(0, 1fr);\n  column-gap: 0.95rem;\n}\n.header-card__avatar-stack {\n  --header-card-badge-overhang: var(--app-header-card-badge-overhang, 6px);\n  position: relative;\n  padding-bottom: var(--header-card-badge-overhang);\n  width: max-content;\n  max-width: 100%;\n}\n.header-card__ring {\n  position: absolute;\n  inset: -8px;\n  pointer-events: none;\n}\n.header-card__avatar {\n  width: 96px;\n  height: 96px;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: #fff;\n  font-size: 30px;\n  font-weight: 700;\n  letter-spacing: 0.02em;\n  overflow: hidden;\n  box-shadow: 0 6px 16px rgba(16, 30, 56, 0.24);\n}\n.header-card__avatar.has-photo {\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n  color: transparent;\n  font-size: 0;\n}\n.user-color-woman {\n  background:\n    linear-gradient(\n      145deg,\n      #d3754c,\n      #ac4a24);\n}\n.user-color-man {\n  background:\n    linear-gradient(\n      145deg,\n      #3572a4,\n      #194364);\n}\n.header-card__edit {\n  position: absolute;\n  top: -6px;\n  right: -6px;\n  width: 30px;\n  height: 30px;\n  border: 0;\n  border-radius: 50%;\n  background: #2f7cc3;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 0 0 2px #fff;\n  cursor: pointer;\n  transition:\n    transform 0.16s ease,\n    box-shadow 0.16s ease,\n    background-color 0.16s ease;\n}\n.header-card__edit:disabled {\n  cursor: default;\n  opacity: 0.52;\n}\n.header-card__edit .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.header-card__badge {\n  position: absolute;\n  left: 50%;\n  bottom: 0;\n  transform: translateX(-50%);\n  min-width: 0;\n  width: fit-content;\n  height: 24px;\n  border-radius: 999px;\n  background: #d8effa;\n  border: 1px solid #8ac9e2;\n  color: #1f6780;\n  font-size: 13px;\n  font-weight: 700;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0 8px;\n}\n.header-card__text {\n  min-width: 0;\n  align-self: center;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.45rem;\n  text-align: center;\n  padding-top: var(--app-header-card-text-padding-top, 0);\n}\n.header-card--admin .header-card__text {\n  align-items: flex-start;\n  align-self: stretch;\n  justify-content: center;\n  text-align: left;\n  gap: 0.24rem;\n  min-height: 96px;\n  padding: 2.05rem 0 0 0;\n}\n.header-card__text h3 {\n  margin: 0;\n  color: #102541;\n  font-size: clamp(1.3rem, 2.4vw, 2rem);\n  line-height: 1.12;\n  font-weight: 800;\n}\n.header-card--admin .header-card__text h3 {\n  max-width: 100%;\n  font-size: 1.28rem;\n  overflow-wrap: anywhere;\n}\n.header-card__meta {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n  font-size: 1.02rem;\n  color: rgba(26, 45, 71, 0.78);\n  font-weight: 700;\n}\n.header-card--admin .header-card__meta {\n  justify-content: flex-start;\n  max-width: 100%;\n  line-height: 1.18;\n  padding-right: 2.45rem;\n}\n.header-card__meta .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n@media (hover: hover) and (pointer: fine) {\n  .header-card__edit:not(:disabled):hover {\n    transform: translateY(-1px) scale(1.03);\n    background: #256aa9;\n    box-shadow: 0 0 0 2px #fff, 0 4px 10px rgba(31, 73, 120, 0.22);\n  }\n}\n@media (max-width: 640px) {\n  .header-card__avatar {\n    width: 74px;\n    height: 74px;\n    font-size: 24px;\n  }\n  .header-card--admin .header-card__main {\n    grid-template-columns: 74px minmax(0, 1fr);\n  }\n  .header-card__text h3 {\n    font-size: 1.4rem;\n  }\n  .header-card__meta {\n    font-size: 0.92rem;\n  }\n}\n/*# sourceMappingURL=header-card.component.css.map */\n"] }]
  }], null, { model: [{
    type: Input
  }], edit: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(HeaderCardComponent, { className: "HeaderCardComponent", filePath: "app/shared/ui/components/core/smart-list/card/header-card/header-card.component.ts", lineNumber: 32 });
})();

// src/app/shared/ui/components/core/smart-list/card/text-card/text-card.component.ts
function TextCardComponent_Conditional_1_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.resolvedBadgeIcon());
  }
}
function TextCardComponent_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 12);
    \u0275\u0275listener("click", function TextCardComponent_Conditional_1_Conditional_0_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.emitBadgeClick($event));
    });
    \u0275\u0275conditionalCreate(1, TextCardComponent_Conditional_1_Conditional_0_Conditional_1_Template, 2, 1, "mat-icon", 13);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("aria-label", ctx_r1.resolvedBadgeAriaLabel());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.resolvedBadgeIcon() ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.resolvedBadge());
  }
}
function TextCardComponent_Conditional_1_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.resolvedBadgeIcon());
  }
}
function TextCardComponent_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 11);
    \u0275\u0275conditionalCreate(1, TextCardComponent_Conditional_1_Conditional_1_Conditional_1_Template, 2, 1, "mat-icon", 13);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("aria-label", ctx_r1.resolvedBadgeAriaLabel());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.resolvedBadgeIcon() ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.resolvedBadge());
  }
}
function TextCardComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, TextCardComponent_Conditional_1_Conditional_0_Template, 4, 3, "button", 10)(1, TextCardComponent_Conditional_1_Conditional_1_Template, 4, 3, "span", 11);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r1.badgeClickable ? 0 : 1);
  }
}
function TextCardComponent_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.resolvedStatusBadgeIcon());
  }
}
function TextCardComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 1);
    \u0275\u0275conditionalCreate(1, TextCardComponent_Conditional_2_Conditional_1_Template, 2, 1, "mat-icon", 13);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", ctx_r1.resolvedStatusBadgeAriaLabel());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.resolvedStatusBadgeIcon() ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.resolvedStatusBadge());
  }
}
function TextCardComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 3)(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.resolvedIcon());
  }
}
function TextCardComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 6);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.resolvedSubtitle());
  }
}
function TextCardComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.resolvedMeta());
  }
}
function TextCardComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.resolvedDetail());
  }
}
function TextCardComponent_Conditional_11_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 15);
    \u0275\u0275listener("click", function TextCardComponent_Conditional_11_Conditional_1_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleSelection($event));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngClass", ctx_r1.selectActionClassList())("disabled", ctx_r1.selectDisabled);
    \u0275\u0275attribute("aria-label", ctx_r1.resolvedSelectAriaLabel());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.selectActionIcon());
  }
}
function TextCardComponent_Conditional_11_Conditional_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-menu-trigger", 16);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("menuId", ctx_r1.resolvedSharedMenuId())("title", ctx_r1.resolvedMenuTitle())("trigger", ctx_r1.menuTrigger())("items", ctx_r1.menuItems)("context", ctx_r1.sharedMenuContext);
  }
}
function TextCardComponent_Conditional_11_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-menu", 18);
    \u0275\u0275listener("itemSelect", function TextCardComponent_Conditional_11_Conditional_2_Conditional_1_Template_app_menu_itemSelect_0_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.menuSelect.emit($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("title", ctx_r1.resolvedMenuTitle())("trigger", ctx_r1.menuTrigger())("items", ctx_r1.menuItems)("panelAlign", "auto")("mobileBreakpointPx", 900);
  }
}
function TextCardComponent_Conditional_11_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, TextCardComponent_Conditional_11_Conditional_2_Conditional_0_Template, 1, 5, "app-menu-trigger", 16)(1, TextCardComponent_Conditional_11_Conditional_2_Conditional_1_Template, 1, 5, "app-menu", 17);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(ctx_r1.useSharedMenuTrigger ? 0 : 1);
  }
}
function TextCardComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275conditionalCreate(1, TextCardComponent_Conditional_11_Conditional_1_Template, 3, 4, "button", 14);
    \u0275\u0275conditionalCreate(2, TextCardComponent_Conditional_11_Conditional_2_Template, 2, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.hasSelectAction() ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.hasMenu() ? 2 : -1);
  }
}
var TextCardComponent = class _TextCardComponent {
  title = "";
  subtitle = "";
  meta = "";
  detail = "";
  icon = "";
  tone = "neutral";
  accentHue = null;
  disabled = false;
  badge = "";
  badgeIcon = "";
  badgeAriaLabel = null;
  badgeTone = "default";
  badgeClickable = false;
  statusBadge = "";
  statusBadgeIcon = "";
  statusBadgeAriaLabel = null;
  statusBadgeTone = "default";
  menuTitle = null;
  menuPalette = "default";
  menuCounter = null;
  menuItems = [];
  useSharedMenuTrigger = false;
  sharedMenuId = null;
  sharedMenuContext = null;
  selectable = false;
  selected = false;
  selectDisabled = false;
  selectPalette = "default";
  selectIcon = "add";
  selectedIcon = "check";
  selectAriaLabel = null;
  menuSelect = new EventEmitter();
  selectionToggle = new EventEmitter();
  badgeClick = new EventEmitter();
  rootClassList() {
    return [
      "ui-text-card",
      `ui-text-card--tone-${this.tone || "neutral"}`,
      this.disabled ? "ui-text-card--disabled" : "",
      this.selected ? "ui-text-card--selected" : "",
      this.hasActions() ? "ui-text-card--with-actions" : "",
      this.resolvedBadge() ? "ui-text-card--with-badge" : "",
      this.resolvedBadge() ? `ui-text-card--badge-${this.badgeTone || "default"}` : "",
      this.resolvedStatusBadge() ? "ui-text-card--with-status-badge" : "",
      this.resolvedStatusBadge() ? `ui-text-card--status-${this.statusBadgeTone || "default"}` : ""
    ].filter(Boolean);
  }
  resolvedTitle() {
    return `${this.title ?? ""}`.trim();
  }
  resolvedSubtitle() {
    return `${this.subtitle ?? ""}`.trim();
  }
  resolvedMeta() {
    return `${this.meta ?? ""}`.trim();
  }
  resolvedDetail() {
    return `${this.detail ?? ""}`.trim();
  }
  resolvedIcon() {
    return `${this.icon ?? ""}`.trim();
  }
  resolvedAccentHue() {
    const hue = Math.trunc(Number(this.accentHue));
    return Number.isFinite(hue) ? `${Math.max(0, Math.min(360, hue))}` : null;
  }
  resolvedBadge() {
    return `${this.badge ?? ""}`.trim();
  }
  resolvedBadgeIcon() {
    return `${this.badgeIcon ?? ""}`.trim();
  }
  resolvedBadgeAriaLabel() {
    const label = `${this.badgeAriaLabel ?? ""}`.trim();
    return label || null;
  }
  resolvedStatusBadge() {
    return `${this.statusBadge ?? ""}`.trim();
  }
  resolvedStatusBadgeIcon() {
    return `${this.statusBadgeIcon ?? ""}`.trim();
  }
  resolvedStatusBadgeAriaLabel() {
    const label = `${this.statusBadgeAriaLabel ?? ""}`.trim();
    return label || null;
  }
  hasMenu() {
    return this.menuItems.length > 0;
  }
  hasActions() {
    return this.hasSelectAction() || this.hasMenu();
  }
  hasSelectAction() {
    return this.selectable === true;
  }
  selectActionIcon() {
    return this.selected ? this.selectedIcon : this.selectIcon;
  }
  resolvedSelectAriaLabel() {
    const label = `${this.selectAriaLabel ?? ""}`.trim();
    if (label) {
      return label;
    }
    return this.selected ? "Remove selection" : "Select";
  }
  selectActionClassList() {
    return [
      "ui-text-card__select-action",
      `ui-text-card__select-action--palette-${this.selectPalette || "default"}`,
      this.selected ? "ui-text-card__select-action--selected" : ""
    ].filter(Boolean);
  }
  toggleSelection(event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.selectDisabled) {
      return;
    }
    this.selectionToggle.emit(event);
  }
  emitBadgeClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.badgeClick.emit(event);
  }
  resolvedMenuTitle() {
    const title = `${this.menuTitle ?? this.resolvedTitle()}`.trim();
    return title || null;
  }
  resolvedSharedMenuId() {
    return `${this.sharedMenuId ?? ""}`.trim();
  }
  menuTrigger() {
    return {
      icon: "more_vert",
      closeIcon: "close",
      hideLabel: true,
      layout: "icon",
      palette: this.menuPalette,
      counter: this.menuCounter,
      ariaLabel: "Open card menu"
    };
  }
  static \u0275fac = function TextCardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TextCardComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TextCardComponent, selectors: [["app-text-card"]], inputs: { title: "title", subtitle: "subtitle", meta: "meta", detail: "detail", icon: "icon", tone: "tone", accentHue: "accentHue", disabled: "disabled", badge: "badge", badgeIcon: "badgeIcon", badgeAriaLabel: "badgeAriaLabel", badgeTone: "badgeTone", badgeClickable: "badgeClickable", statusBadge: "statusBadge", statusBadgeIcon: "statusBadgeIcon", statusBadgeAriaLabel: "statusBadgeAriaLabel", statusBadgeTone: "statusBadgeTone", menuTitle: "menuTitle", menuPalette: "menuPalette", menuCounter: "menuCounter", menuItems: "menuItems", useSharedMenuTrigger: "useSharedMenuTrigger", sharedMenuId: "sharedMenuId", sharedMenuContext: "sharedMenuContext", selectable: "selectable", selected: "selected", selectDisabled: "selectDisabled", selectPalette: "selectPalette", selectIcon: "selectIcon", selectedIcon: "selectedIcon", selectAriaLabel: "selectAriaLabel" }, outputs: { menuSelect: "menuSelect", selectionToggle: "selectionToggle", badgeClick: "badgeClick" }, decls: 12, vars: 11, consts: [[3, "ngClass"], [1, "ui-text-card__status-badge"], [1, "ui-text-card__main"], ["aria-hidden", "true", 1, "ui-text-card__icon"], [1, "ui-text-card__copy"], [1, "ui-text-card__title"], [1, "ui-text-card__subtitle"], [1, "ui-text-card__meta"], [1, "ui-text-card__detail"], [1, "ui-text-card__actions"], ["type", "button", 1, "ui-text-card__badge", "ui-text-card__badge--button"], [1, "ui-text-card__badge"], ["type", "button", 1, "ui-text-card__badge", "ui-text-card__badge--button", 3, "click"], ["aria-hidden", "true"], ["type", "button", 3, "ngClass", "disabled"], ["type", "button", 3, "click", "ngClass", "disabled"], ["kind", "select", 1, "ui-text-card__menu", 3, "menuId", "title", "trigger", "items", "context"], ["kind", "select", "layout", "list", 1, "ui-text-card__menu", 3, "title", "trigger", "items", "panelAlign", "mobileBreakpointPx"], ["kind", "select", "layout", "list", 1, "ui-text-card__menu", 3, "itemSelect", "title", "trigger", "items", "panelAlign", "mobileBreakpointPx"]], template: function TextCardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "article", 0);
      \u0275\u0275conditionalCreate(1, TextCardComponent_Conditional_1_Template, 2, 1);
      \u0275\u0275conditionalCreate(2, TextCardComponent_Conditional_2_Template, 4, 3, "span", 1);
      \u0275\u0275elementStart(3, "div", 2);
      \u0275\u0275conditionalCreate(4, TextCardComponent_Conditional_4_Template, 3, 1, "span", 3);
      \u0275\u0275elementStart(5, "span", 4)(6, "strong", 5);
      \u0275\u0275text(7);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(8, TextCardComponent_Conditional_8_Template, 2, 1, "span", 6);
      \u0275\u0275conditionalCreate(9, TextCardComponent_Conditional_9_Template, 2, 1, "span", 7);
      \u0275\u0275conditionalCreate(10, TextCardComponent_Conditional_10_Template, 2, 1, "span", 8);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(11, TextCardComponent_Conditional_11_Template, 3, 2, "div", 9);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275styleProp("--ui-text-card-accent-hue", ctx.resolvedAccentHue());
      \u0275\u0275property("ngClass", ctx.rootClassList());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.resolvedBadge() ? 1 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.resolvedStatusBadge() ? 2 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.resolvedIcon() ? 4 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.resolvedTitle());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.resolvedSubtitle() ? 8 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.resolvedMeta() ? 9 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.resolvedDetail() ? 10 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.hasActions() ? 11 : -1);
    }
  }, dependencies: [
    CommonModule,
    NgClass,
    MatIconModule,
    MatIcon,
    AppMenuComponent,
    AppMenuTriggerComponent
  ], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  height: 100%;\n  min-width: 0;\n}\n.ui-text-card[_ngcontent-%COMP%] {\n  --ui-text-card-accent-hue: 210;\n  container-type: inline-size;\n  position: relative;\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: start;\n  gap: 0.62rem;\n  min-width: 0;\n  height: 100%;\n  border: 1px solid rgba(74, 101, 136, 0.22);\n  border-radius: 12px;\n  padding: 0.62rem;\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #f6f9fd 100%);\n  box-shadow: 0 8px 18px rgba(26, 43, 66, 0.08);\n  overflow: visible;\n  box-sizing: border-box;\n}\n.ui-text-card--tone-blue[_ngcontent-%COMP%] {\n  border-color: rgba(57, 122, 198, 0.32);\n  background:\n    radial-gradient(\n      circle at 8% 0%,\n      rgba(255, 255, 255, 0.82),\n      transparent 35%),\n    linear-gradient(\n      180deg,\n      #f3f9ff 0%,\n      #e7f2ff 100%);\n}\n.ui-text-card--tone-draft[_ngcontent-%COMP%] {\n  border-color: rgba(96, 108, 136, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #fafbff 0%,\n      #f0f3fb 100%);\n  box-shadow: 0 8px 18px rgba(74, 88, 118, 0.08);\n}\n.ui-text-card--tone-stage[_ngcontent-%COMP%] {\n  border-color: hsl(var(--ui-text-card-accent-hue), 54%, 58%, 0.52);\n  background:\n    radial-gradient(\n      circle at 10% 4%,\n      hsl(var(--ui-text-card-accent-hue), 90%, 98%, 0.86),\n      transparent 36%),\n    linear-gradient(\n      180deg,\n      hsl(var(--ui-text-card-accent-hue), 82%, 97%) 0%,\n      hsl(var(--ui-text-card-accent-hue), 64%, 92%) 100%);\n  box-shadow: 0 8px 18px hsl(var(--ui-text-card-accent-hue), 42%, 36%, 0.12);\n}\n.ui-text-card--tone-subevent-light[_ngcontent-%COMP%] {\n  border-color: hsl(var(--ui-text-card-accent-hue), 44%, 66%, 0.38);\n  background:\n    radial-gradient(\n      circle at 10% 4%,\n      hsl(var(--ui-text-card-accent-hue), 92%, 99%, 0.9),\n      transparent 38%),\n    linear-gradient(\n      180deg,\n      hsl(var(--ui-text-card-accent-hue), 78%, 98%) 0%,\n      hsl(var(--ui-text-card-accent-hue), 54%, 94%) 100%);\n  box-shadow: 0 7px 16px hsl(var(--ui-text-card-accent-hue), 34%, 40%, 0.08);\n}\n.ui-text-card--tone-subevent-strong[_ngcontent-%COMP%] {\n  border-color: hsl(var(--ui-text-card-accent-hue), 56%, 54%, 0.52);\n  background:\n    radial-gradient(\n      circle at 10% 4%,\n      hsl(var(--ui-text-card-accent-hue), 88%, 97%, 0.82),\n      transparent 36%),\n    linear-gradient(\n      180deg,\n      hsl(var(--ui-text-card-accent-hue), 72%, 95%) 0%,\n      hsl(var(--ui-text-card-accent-hue), 54%, 87%) 100%);\n  box-shadow: 0 8px 18px hsl(var(--ui-text-card-accent-hue), 42%, 34%, 0.15);\n}\n.ui-text-card--tone-subevent-light[_ngcontent-%COMP%]   .ui-text-card__icon[_ngcontent-%COMP%], \n.ui-text-card--tone-subevent-strong[_ngcontent-%COMP%]   .ui-text-card__icon[_ngcontent-%COMP%] {\n  border: 1px solid hsl(var(--ui-text-card-accent-hue), 52%, 56%, 0.36);\n  background:\n    linear-gradient(\n      180deg,\n      hsl(var(--ui-text-card-accent-hue), 88%, 96%) 0%,\n      hsl(var(--ui-text-card-accent-hue), 72%, 90%) 100%);\n  color: hsl(var(--ui-text-card-accent-hue), 64%, 40%);\n  box-shadow: 0 4px 10px hsl(var(--ui-text-card-accent-hue), 38%, 34%, 0.12);\n}\n.ui-text-card--tone-stage[_ngcontent-%COMP%]   .ui-text-card__icon[_ngcontent-%COMP%] {\n  border: 1px solid hsl(var(--ui-text-card-accent-hue), 54%, 58%, 0.42);\n  background:\n    linear-gradient(\n      180deg,\n      hsl(var(--ui-text-card-accent-hue), 92%, 94%) 0%,\n      hsl(var(--ui-text-card-accent-hue), 84%, 88%) 100%);\n  color: hsl(var(--ui-text-card-accent-hue), 66%, 42%);\n  box-shadow: 0 5px 12px hsl(var(--ui-text-card-accent-hue), 42%, 34%, 0.16);\n}\n.ui-text-card--tone-slot[_ngcontent-%COMP%] {\n  border-color: rgba(42, 148, 96, 0.32);\n  background:\n    radial-gradient(\n      circle at 8% 0%,\n      rgba(255, 255, 255, 0.86),\n      transparent 35%),\n    linear-gradient(\n      180deg,\n      #f3fff8 0%,\n      #def4e8 100%);\n}\n.ui-text-card--tone-cyan[_ngcontent-%COMP%] {\n  border-color: rgba(38, 138, 158, 0.3);\n  background:\n    radial-gradient(\n      circle at 8% 0%,\n      rgba(255, 255, 255, 0.82),\n      transparent 35%),\n    linear-gradient(\n      180deg,\n      #f3fcff 0%,\n      #e1f5f8 100%);\n}\n.ui-text-card--tone-teal[_ngcontent-%COMP%] {\n  border-color: rgba(32, 137, 124, 0.3);\n  background:\n    radial-gradient(\n      circle at 8% 0%,\n      rgba(255, 255, 255, 0.82),\n      transparent 35%),\n    linear-gradient(\n      180deg,\n      #f2fffb 0%,\n      #dcf5ee 100%);\n}\n.ui-text-card--tone-green[_ngcontent-%COMP%] {\n  border-color: rgba(48, 142, 86, 0.28);\n  background:\n    linear-gradient(\n      180deg,\n      #f5fcf8 0%,\n      #e7f5ec 100%);\n}\n.ui-text-card--tone-violet[_ngcontent-%COMP%] {\n  border-color: rgba(125, 88, 196, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      #fbf7ff 0%,\n      #efe7ff 100%);\n}\n.ui-text-card--tone-pink[_ngcontent-%COMP%] {\n  border-color: rgba(190, 83, 142, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      #fff7fb 0%,\n      #f8e6f0 100%);\n}\n.ui-text-card--tone-orange[_ngcontent-%COMP%] {\n  border-color: rgba(203, 112, 42, 0.32);\n  background:\n    linear-gradient(\n      180deg,\n      #fff8f1 0%,\n      #fde8d4 100%);\n}\n.ui-text-card--tone-amber[_ngcontent-%COMP%] {\n  border-color: rgba(194, 137, 44, 0.32);\n  background:\n    linear-gradient(\n      180deg,\n      #fffaf0 0%,\n      #fff0d5 100%);\n}\n.ui-text-card--tone-gold[_ngcontent-%COMP%] {\n  border-color: rgba(196, 151, 35, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #fffcee 0%,\n      #faefbd 100%);\n}\n.ui-text-card--tone-danger[_ngcontent-%COMP%] {\n  border-color: rgba(188, 67, 78, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      #fff7f7 0%,\n      #fde8ea 100%);\n}\n.ui-text-card--tone-muted[_ngcontent-%COMP%] {\n  border-color: rgba(105, 119, 140, 0.26);\n  background:\n    linear-gradient(\n      180deg,\n      #f9fafc 0%,\n      #eef1f6 100%);\n}\n.ui-text-card--disabled[_ngcontent-%COMP%] {\n  border-color: rgba(118, 118, 118, 0.24);\n  background:\n    linear-gradient(\n      180deg,\n      #f8f8f8 0%,\n      #eeeeee 100%);\n}\n.ui-text-card--disabled[_ngcontent-%COMP%]   .ui-text-card__main[_ngcontent-%COMP%] {\n  filter: grayscale(0.72);\n  opacity: 0.76;\n}\n.ui-text-card--selected[_ngcontent-%COMP%] {\n  border-color: rgba(32, 137, 93, 0.46);\n  box-shadow: 0 9px 20px rgba(35, 116, 77, 0.12);\n}\n.ui-text-card--with-badge[_ngcontent-%COMP%] {\n  min-height: 128px;\n  padding-top: 2.45rem;\n}\n.ui-text-card__main[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr);\n  align-items: start;\n  gap: 0.52rem;\n  min-width: 0;\n}\n.ui-text-card__icon[_ngcontent-%COMP%] {\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: #285f91;\n  background: rgba(255, 255, 255, 0.76);\n  box-shadow: inset 0 0 0 1px rgba(69, 104, 143, 0.18);\n}\n.ui-text-card__icon[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n.ui-text-card__copy[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.08rem;\n  min-width: 0;\n}\n.ui-text-card__title[_ngcontent-%COMP%], \n.ui-text-card__subtitle[_ngcontent-%COMP%], \n.ui-text-card__meta[_ngcontent-%COMP%], \n.ui-text-card__detail[_ngcontent-%COMP%] {\n  min-width: 0;\n  overflow-wrap: anywhere;\n}\n.ui-text-card__title[_ngcontent-%COMP%] {\n  display: block;\n  color: #213e63;\n  font-size: 0.9rem;\n  line-height: 1.18;\n  font-weight: 900;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  overflow-wrap: normal;\n}\n.ui-text-card__subtitle[_ngcontent-%COMP%] {\n  color: rgba(34, 57, 88, 0.78);\n  font-size: 0.78rem;\n  line-height: 1.28;\n  font-weight: 800;\n}\n.ui-text-card__meta[_ngcontent-%COMP%] {\n  color: rgba(34, 57, 88, 0.76);\n  font-size: 0.8rem;\n  line-height: 1.35;\n}\n.ui-text-card__detail[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n  margin-top: 0.16rem;\n  color: rgba(34, 57, 88, 0.64);\n  font-size: 0.76rem;\n  line-height: 1.35;\n  white-space: normal;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.ui-text-card__badge[_ngcontent-%COMP%] {\n  appearance: none;\n  -webkit-appearance: none;\n  position: absolute;\n  z-index: 2;\n  top: 0.58rem;\n  left: 0.62rem;\n  max-width: calc(100% - 6.3rem);\n  border: 0;\n  padding: 0.22rem 0.48rem;\n  border-radius: 999px;\n  color: #102f4f;\n  background: rgba(255, 255, 255, 0.9);\n  box-shadow: inset 0 0 0 1px rgba(74, 101, 136, 0.2);\n  font-size: 0.72rem;\n  line-height: 1.2;\n  font-weight: 900;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  box-sizing: border-box;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.18rem;\n}\n.ui-text-card__badge[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.ui-text-card__status-badge[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 1;\n  flex: 0 0 auto;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  margin: 0;\n  text-align: center;\n}\n.ui-text-card__badge[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  font-weight: 900;\n  line-height: 1;\n}\n.ui-text-card--with-status-badge[_ngcontent-%COMP%]   .ui-text-card__badge[_ngcontent-%COMP%] {\n  max-width: calc(100% - 8.2rem);\n}\n.ui-text-card--badge-price[_ngcontent-%COMP%]   .ui-text-card__badge[_ngcontent-%COMP%] {\n  color: #7c4a05;\n  background:\n    linear-gradient(\n      180deg,\n      #fff7d7 0%,\n      #ffd978 100%);\n  box-shadow: 0 5px 12px rgba(132, 82, 8, 0.18), inset 0 0 0 1px rgba(181, 117, 20, 0.28);\n}\n.ui-text-card--badge-success[_ngcontent-%COMP%]   .ui-text-card__badge[_ngcontent-%COMP%] {\n  color: #17663f;\n  background: #e6f9ed;\n  box-shadow: inset 0 0 0 1px rgba(36, 150, 82, 0.24);\n}\n.ui-text-card--badge-warning[_ngcontent-%COMP%]   .ui-text-card__badge[_ngcontent-%COMP%] {\n  color: #865812;\n  background: #fff3d8;\n  box-shadow: inset 0 0 0 1px rgba(168, 117, 35, 0.24);\n}\n.ui-text-card--badge-danger[_ngcontent-%COMP%]   .ui-text-card__badge[_ngcontent-%COMP%] {\n  color: #8a2c38;\n  background: #ffe8eb;\n  box-shadow: inset 0 0 0 1px rgba(180, 72, 82, 0.24);\n}\n.ui-text-card--badge-muted[_ngcontent-%COMP%]   .ui-text-card__badge[_ngcontent-%COMP%] {\n  color: #667186;\n  background: #f1f3f7;\n  box-shadow: inset 0 0 0 1px rgba(105, 119, 140, 0.22);\n}\n.ui-text-card__badge--button[_ngcontent-%COMP%] {\n  cursor: pointer;\n  transition:\n    transform 0.14s ease,\n    box-shadow 0.14s ease,\n    filter 0.14s ease;\n}\n.ui-text-card__badge--button[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n  filter: saturate(1.06);\n}\n.ui-text-card__badge--button[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid rgba(48, 116, 186, 0.32);\n  outline-offset: 2px;\n}\n.ui-text-card__status-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  z-index: 2;\n  top: 0.58rem;\n  right: 0.62rem;\n  max-width: 5.9rem;\n  padding: 0.22rem 0.48rem;\n  border-radius: 999px;\n  border: 1px solid rgba(74, 101, 136, 0.2);\n  color: #2d415d;\n  background: rgba(255, 255, 255, 0.9);\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.54);\n  font-size: 0.72rem;\n  line-height: 1.2;\n  font-weight: 900;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.18rem;\n  box-sizing: border-box;\n}\n.ui-text-card--status-success[_ngcontent-%COMP%]   .ui-text-card__status-badge[_ngcontent-%COMP%] {\n  border-color: rgba(38, 124, 83, 0.24);\n  color: #22684c;\n  background: #e9f7ee;\n}\n.ui-text-card--status-stage[_ngcontent-%COMP%]   .ui-text-card__status-badge[_ngcontent-%COMP%] {\n  height: 25px;\n  min-height: 25px;\n  border-color: rgba(255, 255, 255, 0.9);\n  background:\n    linear-gradient(\n      180deg,\n      hsl(var(--ui-text-card-accent-hue), 76%, 54%) 0%,\n      hsl(var(--ui-text-card-accent-hue), 72%, 42%) 100%);\n  color: #ffffff;\n  text-shadow: 0 1px 1px hsl(var(--ui-text-card-accent-hue), 70%, 22%, 0.3);\n  box-shadow: 0 7px 16px hsl(var(--ui-text-card-accent-hue), 52%, 34%, 0.34), inset 0 0 0 1px hsl(var(--ui-text-card-accent-hue), 70%, 34%, 0.54);\n}\n.ui-text-card--status-warning[_ngcontent-%COMP%]   .ui-text-card__status-badge[_ngcontent-%COMP%] {\n  border-color: rgba(168, 117, 35, 0.28);\n  color: #865812;\n  background: #fff3d8;\n}\n.ui-text-card--status-danger[_ngcontent-%COMP%]   .ui-text-card__status-badge[_ngcontent-%COMP%] {\n  border-color: rgba(180, 72, 82, 0.26);\n  color: #8a2c38;\n  background: #ffe8eb;\n}\n.ui-text-card--status-muted[_ngcontent-%COMP%]   .ui-text-card__status-badge[_ngcontent-%COMP%] {\n  border-color: rgba(105, 119, 140, 0.24);\n  color: #667186;\n  background: #f1f3f7;\n}\n.ui-text-card--status-public[_ngcontent-%COMP%]   .ui-text-card__status-badge[_ngcontent-%COMP%] {\n  height: 28px;\n  min-height: 28px;\n  padding: 0 0.58rem;\n  border-width: 2px;\n  border-color: rgba(46, 111, 178, 0.4);\n  background:\n    linear-gradient(\n      180deg,\n      #eef7ff 0%,\n      #dcecff 100%);\n  color: #2f6cae;\n  box-shadow: 0 7px 16px rgba(35, 89, 149, 0.18);\n}\n.ui-text-card--status-public[_ngcontent-%COMP%]   .ui-text-card__status-badge[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  color: #2d7d47;\n  box-shadow: inset 0 0 0 1px rgba(44, 126, 72, 0.32);\n  font-size: 14px;\n  line-height: 16px;\n}\n.ui-text-card--status-blocked[_ngcontent-%COMP%]   .ui-text-card__status-badge[_ngcontent-%COMP%] {\n  height: 28px;\n  min-height: 28px;\n  padding: 0 0.58rem;\n  border-width: 2px;\n  border-color: rgba(255, 255, 255, 0.96);\n  background:\n    linear-gradient(\n      180deg,\n      #e45f66 0%,\n      #bd2635 100%);\n  color: #ffffff;\n  text-shadow: 0 1px 1px rgba(80, 0, 8, 0.28);\n  box-shadow: 0 8px 18px rgba(128, 23, 34, 0.36), inset 0 0 0 1px rgba(137, 17, 29, 0.5);\n}\n.ui-text-card--status-blocked[_ngcontent-%COMP%]   .ui-text-card__status-badge[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.22);\n  color: #ffffff;\n  font-size: 14px;\n  line-height: 16px;\n}\n.ui-text-card__actions[_ngcontent-%COMP%] {\n  align-self: start;\n  justify-self: end;\n  display: grid;\n  gap: 0.42rem;\n  justify-items: end;\n  min-width: 0;\n}\n.ui-text-card--with-badge[_ngcontent-%COMP%]   .ui-text-card__actions[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.52rem;\n  right: 0.52rem;\n}\n.ui-text-card--with-status-badge[_ngcontent-%COMP%]   .ui-text-card__actions[_ngcontent-%COMP%] {\n  top: 2.35rem;\n}\n.ui-text-card--with-actions[_ngcontent-%COMP%]   .ui-text-card__copy[_ngcontent-%COMP%] {\n  padding-right: 2.6rem;\n}\n@container (max-width: 9rem) {\n  .ui-text-card__status-badge[_ngcontent-%COMP%] {\n    width: 28px;\n    min-width: 28px;\n    max-width: 28px;\n    padding-inline: 0;\n    align-items: center;\n    justify-content: center;\n  }\n  .ui-text-card__status-badge[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    margin: 0;\n    text-align: center;\n  }\n  .ui-text-card__status-badge[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .ui-text-card--with-status-badge[_ngcontent-%COMP%]   .ui-text-card__badge[_ngcontent-%COMP%] {\n    max-width: calc(100% - 3rem);\n  }\n}\n.ui-text-card__select-action[_ngcontent-%COMP%] {\n  appearance: none;\n  -webkit-appearance: none;\n  width: 2.18rem;\n  height: 2.18rem;\n  border: 1px solid rgba(17, 33, 56, 0.2);\n  border-radius: 999px;\n  color: #46566f;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.96) 0%,\n      rgba(239, 242, 247, 0.96) 100%);\n  box-shadow: 0 6px 14px rgba(8, 18, 34, 0.16);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  box-sizing: border-box;\n  transition:\n    transform 0.14s ease,\n    box-shadow 0.14s ease,\n    border-color 0.2s ease;\n}\n.ui-text-card__select-action--palette-picker[_ngcontent-%COMP%] {\n  border-color: rgba(37, 88, 144, 0.22);\n  color: #2f5f91;\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #edf4fb 100%);\n  box-shadow: 0 6px 14px rgba(28, 60, 96, 0.14);\n}\n.ui-text-card__select-action--palette-muted[_ngcontent-%COMP%] {\n  border-color: rgba(90, 108, 130, 0.24);\n  color: #5c6a7f;\n  background:\n    linear-gradient(\n      180deg,\n      #f8fafc 0%,\n      #edf1f6 100%);\n  box-shadow: 0 5px 12px rgba(55, 75, 101, 0.12);\n}\n.ui-text-card__select-action[_ngcontent-%COMP%]:hover:not(:disabled) {\n  transform: translateY(-1px);\n  box-shadow: 0 8px 17px rgba(8, 18, 34, 0.2);\n}\n.ui-text-card__select-action--selected[_ngcontent-%COMP%] {\n  color: #2c7c52;\n  background:\n    linear-gradient(\n      180deg,\n      #e9f7ee 0%,\n      #d6f0de 100%);\n  border-color: rgba(44, 124, 82, 0.28);\n  box-shadow: 0 6px 14px rgba(44, 124, 82, 0.16), inset 0 0 0 1px rgba(255, 255, 255, 0.58);\n}\n.ui-text-card__select-action[_ngcontent-%COMP%]:disabled {\n  opacity: 0.54;\n  cursor: not-allowed;\n}\n.ui-text-card__select-action[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 1.14rem;\n  height: 1.14rem;\n  font-size: 1.14rem;\n  line-height: 1.14rem;\n}\n@media (max-width: 560px) {\n  .ui-text-card[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .ui-text-card__actions[_ngcontent-%COMP%] {\n    position: absolute;\n    top: 0.5rem;\n    right: 0.5rem;\n  }\n  .ui-text-card__copy[_ngcontent-%COMP%] {\n    padding-right: 2.2rem;\n  }\n}\n/*# sourceMappingURL=text-card.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TextCardComponent, [{
    type: Component,
    args: [{ selector: "app-text-card", standalone: true, imports: [
      CommonModule,
      MatIconModule,
      AppMenuComponent,
      AppMenuTriggerComponent
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `<article
  [ngClass]="rootClassList()"
  [style.--ui-text-card-accent-hue]="resolvedAccentHue()"
>
  @if (resolvedBadge()) {
    @if (badgeClickable) {
      <button
        type="button"
        class="ui-text-card__badge ui-text-card__badge--button"
        [attr.aria-label]="resolvedBadgeAriaLabel()"
        (click)="emitBadgeClick($event)"
      >
        @if (resolvedBadgeIcon()) {
          <mat-icon aria-hidden="true">{{ resolvedBadgeIcon() }}</mat-icon>
        }
        <span>{{ resolvedBadge() }}</span>
      </button>
    } @else {
      <span class="ui-text-card__badge" [attr.aria-label]="resolvedBadgeAriaLabel()">
        @if (resolvedBadgeIcon()) {
          <mat-icon aria-hidden="true">{{ resolvedBadgeIcon() }}</mat-icon>
        }
        <span>{{ resolvedBadge() }}</span>
      </span>
    }
  }

  @if (resolvedStatusBadge()) {
    <span class="ui-text-card__status-badge" [attr.aria-label]="resolvedStatusBadgeAriaLabel()">
      @if (resolvedStatusBadgeIcon()) {
        <mat-icon aria-hidden="true">{{ resolvedStatusBadgeIcon() }}</mat-icon>
      }
      <span>{{ resolvedStatusBadge() }}</span>
    </span>
  }

  <div class="ui-text-card__main">
    @if (resolvedIcon()) {
      <span class="ui-text-card__icon" aria-hidden="true">
        <mat-icon>{{ resolvedIcon() }}</mat-icon>
      </span>
    }
    <span class="ui-text-card__copy">
      <strong class="ui-text-card__title">{{ resolvedTitle() }}</strong>
      @if (resolvedSubtitle()) {
        <span class="ui-text-card__subtitle">{{ resolvedSubtitle() }}</span>
      }
      @if (resolvedMeta()) {
        <span class="ui-text-card__meta">{{ resolvedMeta() }}</span>
      }
      @if (resolvedDetail()) {
        <span class="ui-text-card__detail">{{ resolvedDetail() }}</span>
      }
    </span>
  </div>

  @if (hasActions()) {
    <div class="ui-text-card__actions">
      @if (hasSelectAction()) {
        <button
          type="button"
          [ngClass]="selectActionClassList()"
          [disabled]="selectDisabled"
          [attr.aria-label]="resolvedSelectAriaLabel()"
          (click)="toggleSelection($event)"
        >
          <mat-icon>{{ selectActionIcon() }}</mat-icon>
        </button>
      }

      @if (hasMenu()) {
        @if (useSharedMenuTrigger) {
          <app-menu-trigger
            class="ui-text-card__menu"
            kind="select"
            [menuId]="resolvedSharedMenuId()"
            [title]="resolvedMenuTitle()"
            [trigger]="menuTrigger()"
            [items]="menuItems"
            [context]="sharedMenuContext"
          ></app-menu-trigger>
        } @else {
          <app-menu
            class="ui-text-card__menu"
            kind="select"
            layout="list"
            [title]="resolvedMenuTitle()"
            [trigger]="menuTrigger()"
            [items]="menuItems"
            [panelAlign]="'auto'"
            [mobileBreakpointPx]="900"
            (itemSelect)="menuSelect.emit($event)"
          ></app-menu>
        }
      }
    </div>
  }
</article>
`, styles: ["/* src/app/shared/ui/components/core/smart-list/card/text-card/text-card.component.scss */\n:host {\n  display: block;\n  height: 100%;\n  min-width: 0;\n}\n.ui-text-card {\n  --ui-text-card-accent-hue: 210;\n  container-type: inline-size;\n  position: relative;\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: start;\n  gap: 0.62rem;\n  min-width: 0;\n  height: 100%;\n  border: 1px solid rgba(74, 101, 136, 0.22);\n  border-radius: 12px;\n  padding: 0.62rem;\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #f6f9fd 100%);\n  box-shadow: 0 8px 18px rgba(26, 43, 66, 0.08);\n  overflow: visible;\n  box-sizing: border-box;\n}\n.ui-text-card--tone-blue {\n  border-color: rgba(57, 122, 198, 0.32);\n  background:\n    radial-gradient(\n      circle at 8% 0%,\n      rgba(255, 255, 255, 0.82),\n      transparent 35%),\n    linear-gradient(\n      180deg,\n      #f3f9ff 0%,\n      #e7f2ff 100%);\n}\n.ui-text-card--tone-draft {\n  border-color: rgba(96, 108, 136, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #fafbff 0%,\n      #f0f3fb 100%);\n  box-shadow: 0 8px 18px rgba(74, 88, 118, 0.08);\n}\n.ui-text-card--tone-stage {\n  border-color: hsl(var(--ui-text-card-accent-hue), 54%, 58%, 0.52);\n  background:\n    radial-gradient(\n      circle at 10% 4%,\n      hsl(var(--ui-text-card-accent-hue), 90%, 98%, 0.86),\n      transparent 36%),\n    linear-gradient(\n      180deg,\n      hsl(var(--ui-text-card-accent-hue), 82%, 97%) 0%,\n      hsl(var(--ui-text-card-accent-hue), 64%, 92%) 100%);\n  box-shadow: 0 8px 18px hsl(var(--ui-text-card-accent-hue), 42%, 36%, 0.12);\n}\n.ui-text-card--tone-subevent-light {\n  border-color: hsl(var(--ui-text-card-accent-hue), 44%, 66%, 0.38);\n  background:\n    radial-gradient(\n      circle at 10% 4%,\n      hsl(var(--ui-text-card-accent-hue), 92%, 99%, 0.9),\n      transparent 38%),\n    linear-gradient(\n      180deg,\n      hsl(var(--ui-text-card-accent-hue), 78%, 98%) 0%,\n      hsl(var(--ui-text-card-accent-hue), 54%, 94%) 100%);\n  box-shadow: 0 7px 16px hsl(var(--ui-text-card-accent-hue), 34%, 40%, 0.08);\n}\n.ui-text-card--tone-subevent-strong {\n  border-color: hsl(var(--ui-text-card-accent-hue), 56%, 54%, 0.52);\n  background:\n    radial-gradient(\n      circle at 10% 4%,\n      hsl(var(--ui-text-card-accent-hue), 88%, 97%, 0.82),\n      transparent 36%),\n    linear-gradient(\n      180deg,\n      hsl(var(--ui-text-card-accent-hue), 72%, 95%) 0%,\n      hsl(var(--ui-text-card-accent-hue), 54%, 87%) 100%);\n  box-shadow: 0 8px 18px hsl(var(--ui-text-card-accent-hue), 42%, 34%, 0.15);\n}\n.ui-text-card--tone-subevent-light .ui-text-card__icon,\n.ui-text-card--tone-subevent-strong .ui-text-card__icon {\n  border: 1px solid hsl(var(--ui-text-card-accent-hue), 52%, 56%, 0.36);\n  background:\n    linear-gradient(\n      180deg,\n      hsl(var(--ui-text-card-accent-hue), 88%, 96%) 0%,\n      hsl(var(--ui-text-card-accent-hue), 72%, 90%) 100%);\n  color: hsl(var(--ui-text-card-accent-hue), 64%, 40%);\n  box-shadow: 0 4px 10px hsl(var(--ui-text-card-accent-hue), 38%, 34%, 0.12);\n}\n.ui-text-card--tone-stage .ui-text-card__icon {\n  border: 1px solid hsl(var(--ui-text-card-accent-hue), 54%, 58%, 0.42);\n  background:\n    linear-gradient(\n      180deg,\n      hsl(var(--ui-text-card-accent-hue), 92%, 94%) 0%,\n      hsl(var(--ui-text-card-accent-hue), 84%, 88%) 100%);\n  color: hsl(var(--ui-text-card-accent-hue), 66%, 42%);\n  box-shadow: 0 5px 12px hsl(var(--ui-text-card-accent-hue), 42%, 34%, 0.16);\n}\n.ui-text-card--tone-slot {\n  border-color: rgba(42, 148, 96, 0.32);\n  background:\n    radial-gradient(\n      circle at 8% 0%,\n      rgba(255, 255, 255, 0.86),\n      transparent 35%),\n    linear-gradient(\n      180deg,\n      #f3fff8 0%,\n      #def4e8 100%);\n}\n.ui-text-card--tone-cyan {\n  border-color: rgba(38, 138, 158, 0.3);\n  background:\n    radial-gradient(\n      circle at 8% 0%,\n      rgba(255, 255, 255, 0.82),\n      transparent 35%),\n    linear-gradient(\n      180deg,\n      #f3fcff 0%,\n      #e1f5f8 100%);\n}\n.ui-text-card--tone-teal {\n  border-color: rgba(32, 137, 124, 0.3);\n  background:\n    radial-gradient(\n      circle at 8% 0%,\n      rgba(255, 255, 255, 0.82),\n      transparent 35%),\n    linear-gradient(\n      180deg,\n      #f2fffb 0%,\n      #dcf5ee 100%);\n}\n.ui-text-card--tone-green {\n  border-color: rgba(48, 142, 86, 0.28);\n  background:\n    linear-gradient(\n      180deg,\n      #f5fcf8 0%,\n      #e7f5ec 100%);\n}\n.ui-text-card--tone-violet {\n  border-color: rgba(125, 88, 196, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      #fbf7ff 0%,\n      #efe7ff 100%);\n}\n.ui-text-card--tone-pink {\n  border-color: rgba(190, 83, 142, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      #fff7fb 0%,\n      #f8e6f0 100%);\n}\n.ui-text-card--tone-orange {\n  border-color: rgba(203, 112, 42, 0.32);\n  background:\n    linear-gradient(\n      180deg,\n      #fff8f1 0%,\n      #fde8d4 100%);\n}\n.ui-text-card--tone-amber {\n  border-color: rgba(194, 137, 44, 0.32);\n  background:\n    linear-gradient(\n      180deg,\n      #fffaf0 0%,\n      #fff0d5 100%);\n}\n.ui-text-card--tone-gold {\n  border-color: rgba(196, 151, 35, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #fffcee 0%,\n      #faefbd 100%);\n}\n.ui-text-card--tone-danger {\n  border-color: rgba(188, 67, 78, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      #fff7f7 0%,\n      #fde8ea 100%);\n}\n.ui-text-card--tone-muted {\n  border-color: rgba(105, 119, 140, 0.26);\n  background:\n    linear-gradient(\n      180deg,\n      #f9fafc 0%,\n      #eef1f6 100%);\n}\n.ui-text-card--disabled {\n  border-color: rgba(118, 118, 118, 0.24);\n  background:\n    linear-gradient(\n      180deg,\n      #f8f8f8 0%,\n      #eeeeee 100%);\n}\n.ui-text-card--disabled .ui-text-card__main {\n  filter: grayscale(0.72);\n  opacity: 0.76;\n}\n.ui-text-card--selected {\n  border-color: rgba(32, 137, 93, 0.46);\n  box-shadow: 0 9px 20px rgba(35, 116, 77, 0.12);\n}\n.ui-text-card--with-badge {\n  min-height: 128px;\n  padding-top: 2.45rem;\n}\n.ui-text-card__main {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr);\n  align-items: start;\n  gap: 0.52rem;\n  min-width: 0;\n}\n.ui-text-card__icon {\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: #285f91;\n  background: rgba(255, 255, 255, 0.76);\n  box-shadow: inset 0 0 0 1px rgba(69, 104, 143, 0.18);\n}\n.ui-text-card__icon .mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n.ui-text-card__copy {\n  display: grid;\n  gap: 0.08rem;\n  min-width: 0;\n}\n.ui-text-card__title,\n.ui-text-card__subtitle,\n.ui-text-card__meta,\n.ui-text-card__detail {\n  min-width: 0;\n  overflow-wrap: anywhere;\n}\n.ui-text-card__title {\n  display: block;\n  color: #213e63;\n  font-size: 0.9rem;\n  line-height: 1.18;\n  font-weight: 900;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  overflow-wrap: normal;\n}\n.ui-text-card__subtitle {\n  color: rgba(34, 57, 88, 0.78);\n  font-size: 0.78rem;\n  line-height: 1.28;\n  font-weight: 800;\n}\n.ui-text-card__meta {\n  color: rgba(34, 57, 88, 0.76);\n  font-size: 0.8rem;\n  line-height: 1.35;\n}\n.ui-text-card__detail {\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n  margin-top: 0.16rem;\n  color: rgba(34, 57, 88, 0.64);\n  font-size: 0.76rem;\n  line-height: 1.35;\n  white-space: normal;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.ui-text-card__badge {\n  appearance: none;\n  -webkit-appearance: none;\n  position: absolute;\n  z-index: 2;\n  top: 0.58rem;\n  left: 0.62rem;\n  max-width: calc(100% - 6.3rem);\n  border: 0;\n  padding: 0.22rem 0.48rem;\n  border-radius: 999px;\n  color: #102f4f;\n  background: rgba(255, 255, 255, 0.9);\n  box-shadow: inset 0 0 0 1px rgba(74, 101, 136, 0.2);\n  font-size: 0.72rem;\n  line-height: 1.2;\n  font-weight: 900;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  box-sizing: border-box;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.18rem;\n}\n.ui-text-card__badge .mat-icon,\n.ui-text-card__status-badge .mat-icon {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 1;\n  flex: 0 0 auto;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  margin: 0;\n  text-align: center;\n}\n.ui-text-card__badge > span {\n  display: inline-flex;\n  align-items: center;\n  font-weight: 900;\n  line-height: 1;\n}\n.ui-text-card--with-status-badge .ui-text-card__badge {\n  max-width: calc(100% - 8.2rem);\n}\n.ui-text-card--badge-price .ui-text-card__badge {\n  color: #7c4a05;\n  background:\n    linear-gradient(\n      180deg,\n      #fff7d7 0%,\n      #ffd978 100%);\n  box-shadow: 0 5px 12px rgba(132, 82, 8, 0.18), inset 0 0 0 1px rgba(181, 117, 20, 0.28);\n}\n.ui-text-card--badge-success .ui-text-card__badge {\n  color: #17663f;\n  background: #e6f9ed;\n  box-shadow: inset 0 0 0 1px rgba(36, 150, 82, 0.24);\n}\n.ui-text-card--badge-warning .ui-text-card__badge {\n  color: #865812;\n  background: #fff3d8;\n  box-shadow: inset 0 0 0 1px rgba(168, 117, 35, 0.24);\n}\n.ui-text-card--badge-danger .ui-text-card__badge {\n  color: #8a2c38;\n  background: #ffe8eb;\n  box-shadow: inset 0 0 0 1px rgba(180, 72, 82, 0.24);\n}\n.ui-text-card--badge-muted .ui-text-card__badge {\n  color: #667186;\n  background: #f1f3f7;\n  box-shadow: inset 0 0 0 1px rgba(105, 119, 140, 0.22);\n}\n.ui-text-card__badge--button {\n  cursor: pointer;\n  transition:\n    transform 0.14s ease,\n    box-shadow 0.14s ease,\n    filter 0.14s ease;\n}\n.ui-text-card__badge--button:hover {\n  transform: translateY(-1px);\n  filter: saturate(1.06);\n}\n.ui-text-card__badge--button:focus-visible {\n  outline: 2px solid rgba(48, 116, 186, 0.32);\n  outline-offset: 2px;\n}\n.ui-text-card__status-badge {\n  position: absolute;\n  z-index: 2;\n  top: 0.58rem;\n  right: 0.62rem;\n  max-width: 5.9rem;\n  padding: 0.22rem 0.48rem;\n  border-radius: 999px;\n  border: 1px solid rgba(74, 101, 136, 0.2);\n  color: #2d415d;\n  background: rgba(255, 255, 255, 0.9);\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.54);\n  font-size: 0.72rem;\n  line-height: 1.2;\n  font-weight: 900;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.18rem;\n  box-sizing: border-box;\n}\n.ui-text-card--status-success .ui-text-card__status-badge {\n  border-color: rgba(38, 124, 83, 0.24);\n  color: #22684c;\n  background: #e9f7ee;\n}\n.ui-text-card--status-stage .ui-text-card__status-badge {\n  height: 25px;\n  min-height: 25px;\n  border-color: rgba(255, 255, 255, 0.9);\n  background:\n    linear-gradient(\n      180deg,\n      hsl(var(--ui-text-card-accent-hue), 76%, 54%) 0%,\n      hsl(var(--ui-text-card-accent-hue), 72%, 42%) 100%);\n  color: #ffffff;\n  text-shadow: 0 1px 1px hsl(var(--ui-text-card-accent-hue), 70%, 22%, 0.3);\n  box-shadow: 0 7px 16px hsl(var(--ui-text-card-accent-hue), 52%, 34%, 0.34), inset 0 0 0 1px hsl(var(--ui-text-card-accent-hue), 70%, 34%, 0.54);\n}\n.ui-text-card--status-warning .ui-text-card__status-badge {\n  border-color: rgba(168, 117, 35, 0.28);\n  color: #865812;\n  background: #fff3d8;\n}\n.ui-text-card--status-danger .ui-text-card__status-badge {\n  border-color: rgba(180, 72, 82, 0.26);\n  color: #8a2c38;\n  background: #ffe8eb;\n}\n.ui-text-card--status-muted .ui-text-card__status-badge {\n  border-color: rgba(105, 119, 140, 0.24);\n  color: #667186;\n  background: #f1f3f7;\n}\n.ui-text-card--status-public .ui-text-card__status-badge {\n  height: 28px;\n  min-height: 28px;\n  padding: 0 0.58rem;\n  border-width: 2px;\n  border-color: rgba(46, 111, 178, 0.4);\n  background:\n    linear-gradient(\n      180deg,\n      #eef7ff 0%,\n      #dcecff 100%);\n  color: #2f6cae;\n  box-shadow: 0 7px 16px rgba(35, 89, 149, 0.18);\n}\n.ui-text-card--status-public .ui-text-card__status-badge .mat-icon {\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  color: #2d7d47;\n  box-shadow: inset 0 0 0 1px rgba(44, 126, 72, 0.32);\n  font-size: 14px;\n  line-height: 16px;\n}\n.ui-text-card--status-blocked .ui-text-card__status-badge {\n  height: 28px;\n  min-height: 28px;\n  padding: 0 0.58rem;\n  border-width: 2px;\n  border-color: rgba(255, 255, 255, 0.96);\n  background:\n    linear-gradient(\n      180deg,\n      #e45f66 0%,\n      #bd2635 100%);\n  color: #ffffff;\n  text-shadow: 0 1px 1px rgba(80, 0, 8, 0.28);\n  box-shadow: 0 8px 18px rgba(128, 23, 34, 0.36), inset 0 0 0 1px rgba(137, 17, 29, 0.5);\n}\n.ui-text-card--status-blocked .ui-text-card__status-badge .mat-icon {\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.22);\n  color: #ffffff;\n  font-size: 14px;\n  line-height: 16px;\n}\n.ui-text-card__actions {\n  align-self: start;\n  justify-self: end;\n  display: grid;\n  gap: 0.42rem;\n  justify-items: end;\n  min-width: 0;\n}\n.ui-text-card--with-badge .ui-text-card__actions {\n  position: absolute;\n  top: 0.52rem;\n  right: 0.52rem;\n}\n.ui-text-card--with-status-badge .ui-text-card__actions {\n  top: 2.35rem;\n}\n.ui-text-card--with-actions .ui-text-card__copy {\n  padding-right: 2.6rem;\n}\n@container (max-width: 9rem) {\n  .ui-text-card__status-badge {\n    width: 28px;\n    min-width: 28px;\n    max-width: 28px;\n    padding-inline: 0;\n    align-items: center;\n    justify-content: center;\n  }\n  .ui-text-card__status-badge .mat-icon {\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    margin: 0;\n    text-align: center;\n  }\n  .ui-text-card__status-badge > span {\n    display: none;\n  }\n  .ui-text-card--with-status-badge .ui-text-card__badge {\n    max-width: calc(100% - 3rem);\n  }\n}\n.ui-text-card__select-action {\n  appearance: none;\n  -webkit-appearance: none;\n  width: 2.18rem;\n  height: 2.18rem;\n  border: 1px solid rgba(17, 33, 56, 0.2);\n  border-radius: 999px;\n  color: #46566f;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.96) 0%,\n      rgba(239, 242, 247, 0.96) 100%);\n  box-shadow: 0 6px 14px rgba(8, 18, 34, 0.16);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  box-sizing: border-box;\n  transition:\n    transform 0.14s ease,\n    box-shadow 0.14s ease,\n    border-color 0.2s ease;\n}\n.ui-text-card__select-action--palette-picker {\n  border-color: rgba(37, 88, 144, 0.22);\n  color: #2f5f91;\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #edf4fb 100%);\n  box-shadow: 0 6px 14px rgba(28, 60, 96, 0.14);\n}\n.ui-text-card__select-action--palette-muted {\n  border-color: rgba(90, 108, 130, 0.24);\n  color: #5c6a7f;\n  background:\n    linear-gradient(\n      180deg,\n      #f8fafc 0%,\n      #edf1f6 100%);\n  box-shadow: 0 5px 12px rgba(55, 75, 101, 0.12);\n}\n.ui-text-card__select-action:hover:not(:disabled) {\n  transform: translateY(-1px);\n  box-shadow: 0 8px 17px rgba(8, 18, 34, 0.2);\n}\n.ui-text-card__select-action--selected {\n  color: #2c7c52;\n  background:\n    linear-gradient(\n      180deg,\n      #e9f7ee 0%,\n      #d6f0de 100%);\n  border-color: rgba(44, 124, 82, 0.28);\n  box-shadow: 0 6px 14px rgba(44, 124, 82, 0.16), inset 0 0 0 1px rgba(255, 255, 255, 0.58);\n}\n.ui-text-card__select-action:disabled {\n  opacity: 0.54;\n  cursor: not-allowed;\n}\n.ui-text-card__select-action .mat-icon {\n  width: 1.14rem;\n  height: 1.14rem;\n  font-size: 1.14rem;\n  line-height: 1.14rem;\n}\n@media (max-width: 560px) {\n  .ui-text-card {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .ui-text-card__actions {\n    position: absolute;\n    top: 0.5rem;\n    right: 0.5rem;\n  }\n  .ui-text-card__copy {\n    padding-right: 2.2rem;\n  }\n}\n/*# sourceMappingURL=text-card.component.css.map */\n"] }]
  }], null, { title: [{
    type: Input
  }], subtitle: [{
    type: Input
  }], meta: [{
    type: Input
  }], detail: [{
    type: Input
  }], icon: [{
    type: Input
  }], tone: [{
    type: Input
  }], accentHue: [{
    type: Input
  }], disabled: [{
    type: Input
  }], badge: [{
    type: Input
  }], badgeIcon: [{
    type: Input
  }], badgeAriaLabel: [{
    type: Input
  }], badgeTone: [{
    type: Input
  }], badgeClickable: [{
    type: Input
  }], statusBadge: [{
    type: Input
  }], statusBadgeIcon: [{
    type: Input
  }], statusBadgeAriaLabel: [{
    type: Input
  }], statusBadgeTone: [{
    type: Input
  }], menuTitle: [{
    type: Input
  }], menuPalette: [{
    type: Input
  }], menuCounter: [{
    type: Input
  }], menuItems: [{
    type: Input
  }], useSharedMenuTrigger: [{
    type: Input
  }], sharedMenuId: [{
    type: Input
  }], sharedMenuContext: [{
    type: Input
  }], selectable: [{
    type: Input
  }], selected: [{
    type: Input
  }], selectDisabled: [{
    type: Input
  }], selectPalette: [{
    type: Input
  }], selectIcon: [{
    type: Input
  }], selectedIcon: [{
    type: Input
  }], selectAriaLabel: [{
    type: Input
  }], menuSelect: [{
    type: Output
  }], selectionToggle: [{
    type: Output
  }], badgeClick: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TextCardComponent, { className: "TextCardComponent", filePath: "app/shared/ui/components/core/smart-list/card/text-card/text-card.component.ts", lineNumber: 68 });
})();

// src/app/shared/ui/components/core/smart-list/card/warp-image-card/warp-image-card.component.ts
function WarpImageCardComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 0)(1, "div", 1)(2, "span", 2);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 3)(5, "h3");
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p");
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "i18n");
    \u0275\u0275elementEnd()()();
    \u0275\u0275element(11, "div", 4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", ctx_r0.rootClassList());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.card.index);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(7, 5, ctx_r0.card.titleKey, ctx_r0.card.title));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(10, 8, ctx_r0.card.messageKey, ctx_r0.card.message));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngStyle", ctx_r0.visualStyle());
  }
}
var WarpImageCardComponent = class _WarpImageCardComponent {
  card = null;
  rootClassList() {
    return [
      "experience-item-card",
      "ui-warp-image-card",
      `ui-warp-image-card--${this.resolvedTone()}`
    ];
  }
  resolvedTone() {
    const tone = this.card?.tone;
    return tone === "blue" || tone === "purple" || tone === "pink" || tone === "orange" ? tone : "blue";
  }
  visualStyle() {
    return {
      "--warp-image-slice-x": `${this.card?.sliceX ?? "0%"}`,
      "--warp-image-slice-y": `${this.card?.sliceY ?? "0%"}`
    };
  }
  static \u0275fac = function WarpImageCardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _WarpImageCardComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _WarpImageCardComponent, selectors: [["app-warp-image-card"]], inputs: { card: "card" }, decls: 1, vars: 1, consts: [[3, "ngClass"], [1, "ui-warp-image-card__headline"], [1, "ui-warp-image-card__index"], [1, "ui-warp-image-card__copy"], ["aria-hidden", "true", 1, "ui-warp-image-card__visual", 3, "ngStyle"]], template: function WarpImageCardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, WarpImageCardComponent_Conditional_0_Template, 12, 11, "article", 0);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.card ? 0 : -1);
    }
  }, dependencies: [CommonModule, NgClass, NgStyle, I18nPipe], styles: ['\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n  width: 100%;\n}\n.ui-warp-image-card[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  min-width: 0;\n  height: 100%;\n  box-sizing: border-box;\n  border: 2px solid color-mix(in srgb, var(--deployment-card-blue, #3e7de5) 30%, transparent);\n  border-radius: 26px;\n  background: var(--deployment-card-background, linear-gradient(180deg, #eef5ff 0%, #ffffff 100%));\n  box-shadow: 0 8px 18px color-mix(in srgb, var(--deployment-brand-shadow, rgba(21, 42, 79, 0.2)) 25%, transparent);\n}\n.ui-warp-image-card[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  height: 3px;\n  background: var(--deployment-card-blue, #3d85e7);\n}\n.ui-warp-image-card__headline[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  padding: 0.78rem 0.9rem 0.16rem;\n  display: flex;\n  align-items: flex-start;\n  gap: 0.52rem;\n}\n.ui-warp-image-card__index[_ngcontent-%COMP%] {\n  min-width: 42px;\n  min-height: 42px;\n  border-radius: 12px;\n  padding: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 1.12rem;\n  font-weight: 800;\n  line-height: 1;\n  letter-spacing: 0.01em;\n  color: var(--deployment-card-blue, #2f76d8);\n  background: color-mix(in srgb, var(--deployment-card-blue, #2f76d8) 13%, #ffffff);\n}\n.ui-warp-image-card__copy[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.ui-warp-image-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--deployment-text-main, #1a3d6f);\n  font-size: clamp(1.04rem, 1.28vw, 1.28rem);\n  line-height: 1.14;\n  letter-spacing: 0;\n  font-weight: 780;\n  text-wrap: balance;\n  overflow-wrap: normal;\n}\n.ui-warp-image-card__copy[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.24rem 0 0;\n  color: var(--deployment-text-muted, #3a3f6c);\n  font-size: clamp(0.74rem, 0.9vw, 0.86rem);\n  line-height: 1.28;\n  font-weight: 600;\n}\n.ui-warp-image-card__visual[_ngcontent-%COMP%] {\n  position: relative;\n  margin-top: auto;\n  flex: 0 0 auto;\n  height: 178px;\n  border-top: 1px solid rgba(63, 86, 131, 0.08);\n  overflow: hidden;\n  background: #f4f7ff;\n}\n.ui-warp-image-card__visual[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  inset: 0;\n  background-image: url("./media/cards_no_edges.png");\n  background-repeat: no-repeat;\n  background-size: 200% 200%;\n  background-position: var(--warp-image-slice-x, 0%) var(--warp-image-slice-y, 0%);\n}\n.ui-warp-image-card__visual[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  height: 9px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0),\n      #ffffff 72%);\n  pointer-events: none;\n}\n.ui-warp-image-card--purple[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      color-mix(in srgb, var(--deployment-card-purple, #785ae4) 12%, #ffffff) 0%,\n      #ffffff 100%);\n  border-color: color-mix(in srgb, var(--deployment-card-purple, #785ae4) 30%, transparent);\n}\n.ui-warp-image-card--purple[_ngcontent-%COMP%]::before {\n  background: var(--deployment-card-purple, #6752dd);\n}\n.ui-warp-image-card--purple[_ngcontent-%COMP%]   .ui-warp-image-card__index[_ngcontent-%COMP%] {\n  color: var(--deployment-card-purple, #6848d1);\n  background: color-mix(in srgb, var(--deployment-card-purple, #6848d1) 13%, #ffffff);\n}\n.ui-warp-image-card--pink[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      color-mix(in srgb, var(--deployment-card-pink, #e253a8) 12%, #ffffff) 0%,\n      #ffffff 100%);\n  border-color: color-mix(in srgb, var(--deployment-card-pink, #e253a8) 30%, transparent);\n}\n.ui-warp-image-card--pink[_ngcontent-%COMP%]::before {\n  background: var(--deployment-card-pink, #db4ea8);\n}\n.ui-warp-image-card--pink[_ngcontent-%COMP%]   .ui-warp-image-card__index[_ngcontent-%COMP%] {\n  color: var(--deployment-card-pink, #d14699);\n  background: color-mix(in srgb, var(--deployment-card-pink, #d14699) 13%, #ffffff);\n}\n.ui-warp-image-card--orange[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      color-mix(in srgb, var(--deployment-card-orange, #ef6c4a) 12%, #ffffff) 0%,\n      #ffffff 100%);\n  border-color: color-mix(in srgb, var(--deployment-card-orange, #ef6c4a) 30%, transparent);\n}\n.ui-warp-image-card--orange[_ngcontent-%COMP%]::before {\n  background: var(--deployment-card-orange, #eb6745);\n}\n.ui-warp-image-card--orange[_ngcontent-%COMP%]   .ui-warp-image-card__index[_ngcontent-%COMP%] {\n  color: var(--deployment-card-orange, #dc5b3c);\n  background: color-mix(in srgb, var(--deployment-card-orange, #dc5b3c) 13%, #ffffff);\n}\n@media (max-width: 760px) {\n  .ui-warp-image-card[_ngcontent-%COMP%] {\n    border-radius: 24px;\n  }\n  .ui-warp-image-card__visual[_ngcontent-%COMP%] {\n    height: 162px;\n  }\n  .ui-warp-image-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n    font-size: clamp(1.04rem, 4.8vw, 1.16rem);\n    line-height: 1.16;\n  }\n  .ui-warp-image-card__copy[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n    font-size: clamp(0.82rem, 3.3vw, 0.94rem);\n    line-height: 1.28;\n  }\n  .ui-warp-image-card__index[_ngcontent-%COMP%] {\n    min-width: 42px;\n    min-height: 42px;\n    font-size: 1.06rem;\n  }\n}\n/*# sourceMappingURL=warp-image-card.component.css.map */'], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WarpImageCardComponent, [{
    type: Component,
    args: [{ selector: "app-warp-image-card", standalone: true, imports: [
      CommonModule,
      I18nPipe
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: '@if (card) {\n  <article [ngClass]="rootClassList()">\n    <div class="ui-warp-image-card__headline">\n      <span class="ui-warp-image-card__index">{{ card.index }}</span>\n      <div class="ui-warp-image-card__copy">\n        <h3>{{ card.titleKey | i18n: card.title }}</h3>\n        <p>{{ card.messageKey | i18n: card.message }}</p>\n      </div>\n    </div>\n    <div class="ui-warp-image-card__visual" [ngStyle]="visualStyle()" aria-hidden="true"></div>\n  </article>\n}\n', styles: ['/* src/app/shared/ui/components/core/smart-list/card/warp-image-card/warp-image-card.component.scss */\n:host {\n  display: block;\n  min-width: 0;\n  width: 100%;\n}\n.ui-warp-image-card {\n  position: relative;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  min-width: 0;\n  height: 100%;\n  box-sizing: border-box;\n  border: 2px solid color-mix(in srgb, var(--deployment-card-blue, #3e7de5) 30%, transparent);\n  border-radius: 26px;\n  background: var(--deployment-card-background, linear-gradient(180deg, #eef5ff 0%, #ffffff 100%));\n  box-shadow: 0 8px 18px color-mix(in srgb, var(--deployment-brand-shadow, rgba(21, 42, 79, 0.2)) 25%, transparent);\n}\n.ui-warp-image-card::before {\n  content: "";\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  height: 3px;\n  background: var(--deployment-card-blue, #3d85e7);\n}\n.ui-warp-image-card__headline {\n  box-sizing: border-box;\n  padding: 0.78rem 0.9rem 0.16rem;\n  display: flex;\n  align-items: flex-start;\n  gap: 0.52rem;\n}\n.ui-warp-image-card__index {\n  min-width: 42px;\n  min-height: 42px;\n  border-radius: 12px;\n  padding: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 1.12rem;\n  font-weight: 800;\n  line-height: 1;\n  letter-spacing: 0.01em;\n  color: var(--deployment-card-blue, #2f76d8);\n  background: color-mix(in srgb, var(--deployment-card-blue, #2f76d8) 13%, #ffffff);\n}\n.ui-warp-image-card__copy {\n  min-width: 0;\n}\n.ui-warp-image-card h3 {\n  margin: 0;\n  color: var(--deployment-text-main, #1a3d6f);\n  font-size: clamp(1.04rem, 1.28vw, 1.28rem);\n  line-height: 1.14;\n  letter-spacing: 0;\n  font-weight: 780;\n  text-wrap: balance;\n  overflow-wrap: normal;\n}\n.ui-warp-image-card__copy p {\n  margin: 0.24rem 0 0;\n  color: var(--deployment-text-muted, #3a3f6c);\n  font-size: clamp(0.74rem, 0.9vw, 0.86rem);\n  line-height: 1.28;\n  font-weight: 600;\n}\n.ui-warp-image-card__visual {\n  position: relative;\n  margin-top: auto;\n  flex: 0 0 auto;\n  height: 178px;\n  border-top: 1px solid rgba(63, 86, 131, 0.08);\n  overflow: hidden;\n  background: #f4f7ff;\n}\n.ui-warp-image-card__visual::before {\n  content: "";\n  position: absolute;\n  inset: 0;\n  background-image: url("./media/cards_no_edges.png");\n  background-repeat: no-repeat;\n  background-size: 200% 200%;\n  background-position: var(--warp-image-slice-x, 0%) var(--warp-image-slice-y, 0%);\n}\n.ui-warp-image-card__visual::after {\n  content: "";\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  height: 9px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0),\n      #ffffff 72%);\n  pointer-events: none;\n}\n.ui-warp-image-card--purple {\n  background:\n    linear-gradient(\n      180deg,\n      color-mix(in srgb, var(--deployment-card-purple, #785ae4) 12%, #ffffff) 0%,\n      #ffffff 100%);\n  border-color: color-mix(in srgb, var(--deployment-card-purple, #785ae4) 30%, transparent);\n}\n.ui-warp-image-card--purple::before {\n  background: var(--deployment-card-purple, #6752dd);\n}\n.ui-warp-image-card--purple .ui-warp-image-card__index {\n  color: var(--deployment-card-purple, #6848d1);\n  background: color-mix(in srgb, var(--deployment-card-purple, #6848d1) 13%, #ffffff);\n}\n.ui-warp-image-card--pink {\n  background:\n    linear-gradient(\n      180deg,\n      color-mix(in srgb, var(--deployment-card-pink, #e253a8) 12%, #ffffff) 0%,\n      #ffffff 100%);\n  border-color: color-mix(in srgb, var(--deployment-card-pink, #e253a8) 30%, transparent);\n}\n.ui-warp-image-card--pink::before {\n  background: var(--deployment-card-pink, #db4ea8);\n}\n.ui-warp-image-card--pink .ui-warp-image-card__index {\n  color: var(--deployment-card-pink, #d14699);\n  background: color-mix(in srgb, var(--deployment-card-pink, #d14699) 13%, #ffffff);\n}\n.ui-warp-image-card--orange {\n  background:\n    linear-gradient(\n      180deg,\n      color-mix(in srgb, var(--deployment-card-orange, #ef6c4a) 12%, #ffffff) 0%,\n      #ffffff 100%);\n  border-color: color-mix(in srgb, var(--deployment-card-orange, #ef6c4a) 30%, transparent);\n}\n.ui-warp-image-card--orange::before {\n  background: var(--deployment-card-orange, #eb6745);\n}\n.ui-warp-image-card--orange .ui-warp-image-card__index {\n  color: var(--deployment-card-orange, #dc5b3c);\n  background: color-mix(in srgb, var(--deployment-card-orange, #dc5b3c) 13%, #ffffff);\n}\n@media (max-width: 760px) {\n  .ui-warp-image-card {\n    border-radius: 24px;\n  }\n  .ui-warp-image-card__visual {\n    height: 162px;\n  }\n  .ui-warp-image-card h3 {\n    font-size: clamp(1.04rem, 4.8vw, 1.16rem);\n    line-height: 1.16;\n  }\n  .ui-warp-image-card__copy p {\n    font-size: clamp(0.82rem, 3.3vw, 0.94rem);\n    line-height: 1.28;\n  }\n  .ui-warp-image-card__index {\n    min-width: 42px;\n    min-height: 42px;\n    font-size: 1.06rem;\n  }\n}\n/*# sourceMappingURL=warp-image-card.component.css.map */\n'] }]
  }], null, { card: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(WarpImageCardComponent, { className: "WarpImageCardComponent", filePath: "app/shared/ui/components/core/smart-list/card/warp-image-card/warp-image-card.component.ts", lineNumber: 31 });
})();

// src/app/shared/ui/components/core/smart-list/card/rate-card.helpers.ts
function buildSingleRateCardData(input) {
  return {
    rowId: input.rowId,
    groupLabel: input.groupLabel ?? null,
    slides: buildSingleRateSlides(input),
    profileView: profileViewForUser(input.primaryUser),
    stackClasses: input.stackClasses ?? [],
    badge: input.badge ?? null,
    contextBadge: input.contextBadge ?? null,
    presentation: input.presentation ?? "list",
    state: input.state ?? "default"
  };
}
function buildPairRateCardData(input) {
  const presentation = input.presentation ?? "list";
  return {
    rowId: input.rowId,
    groupLabel: input.groupLabel ?? null,
    slots: buildPairRateSlots(input),
    stackClasses: input.stackClasses ?? [],
    badge: input.badge ?? null,
    presentation,
    state: input.state ?? "default"
  };
}
function buildSingleRateSlides(input) {
  const user = input.primaryUser;
  const seededImages = input.singleImageUrls ?? buildSeededPortraitUrls({
    rowId: input.rowId,
    seedUserId: user?.id ?? "rate-fallback",
    gender: user?.gender ?? input.fallbackGender,
    count: clampSingleRateImageCount(input.rowId, input.direction, user?.id)
  });
  const cards = [
    user ? {
      primary: `${user.name}, ${user.age}`,
      secondary: `${user.city} \xB7 ${input.distanceKm} km`
    } : {
      primary: input.title,
      secondary: `${input.distanceKm} km`
    },
    {
      primary: `${input.mode === "pair" ? "Pair" : "Single"} \xB7 ${capitalize(input.direction)}`,
      secondary: `${input.eventName} \xB7 ${input.happenedOnLabel}`
    }
  ];
  return seededImages.map((imageUrl, index) => ({
    imageUrl,
    primaryLine: cards[index]?.primary ?? "",
    secondaryLine: cards[index]?.secondary ?? ""
  }));
}
function buildPairRateSlots(input) {
  if (input.pairSlots && input.pairSlots.length > 0) {
    return input.pairSlots;
  }
  return ["woman", "man"].map((slot) => {
    const user = resolvePairSlotUser(input, slot);
    const slides = user ? buildSeededPortraitUrls({
      rowId: `${input.rowId}-${slot}`,
      seedUserId: user.id,
      gender: user.gender,
      count: 2 + hashText(`pair-rate-photo-count:${input.rowId}:${slot}:${user.id}`) % 2
    }).map((imageUrl) => ({
      imageUrl,
      primaryLine: `${user.name}, ${user.age}`,
      secondaryLine: `${user.city} \xB7 ${input.distanceKm} km`,
      placeholderLabel: initialsFromText(user.name)
    })) : [{
      imageUrl: "",
      primaryLine: `${slot === "woman" ? "Woman" : "Man"} \xB7 waiting`,
      secondaryLine: "No pair card yet",
      placeholderLabel: "\u2205"
    }];
    return {
      key: slot,
      label: slot === "woman" ? "Woman" : "Man",
      tone: slot,
      slides,
      profileView: profileViewForUser(user)
    };
  });
}
function profileViewForUser(user) {
  const userId = `${user?.id ?? ""}`.trim();
  if (!userId) {
    return null;
  }
  return {
    userId,
    label: user?.name ?? null
  };
}
function resolvePairSlotUser(input, gender) {
  const pairUsers = input.pairUsers ?? [];
  const directMatch = pairUsers.find((user) => user.gender === gender) ?? null;
  if (directMatch) {
    return directMatch;
  }
  const primary = pairUsers[0] ?? null;
  const candidates = (input.availableUsers ?? []).filter((user) => user.gender === gender && !pairUsers.some((pairUser) => pairUser.id === user.id));
  if (candidates.length > 0) {
    const seed = hashText(`pair-rate-slot:${input.rowId}:${gender}`);
    return candidates[seed % candidates.length] ?? null;
  }
  if (primary && primary.gender !== gender) {
    return primary;
  }
  return null;
}
function buildSeededPortraitUrls(options) {
  const normalizedCount = Math.max(1, Math.min(4, Math.trunc(options.count)));
  return Array.from({ length: normalizedCount }, () => "");
}
function clampSingleRateImageCount(rowId, direction, userId) {
  const seededCount = 1 + hashText(`rate-photo-count:${userId ?? rowId}`) % 4;
  const desiredCount = direction === "met" ? Math.min(2, seededCount) : seededCount;
  return Math.max(1, Math.min(4, desiredCount));
}
function initialsFromText(value) {
  const tokens = value.split(/\s+/).map((token) => token.trim()).filter(Boolean);
  if (tokens.length === 0) {
    return "\u2205";
  }
  return tokens.slice(0, 2).map((token) => token.charAt(0).toUpperCase()).join("");
}
function capitalize(value) {
  return value.length > 0 ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value;
}
function hashText(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index) | 0;
  }
  return Math.abs(hash);
}

export {
  SingleCardComponent,
  SingleRowComponent,
  PairCardComponent,
  ImageCardComponent,
  WarpImageCardComponent,
  HeaderCardComponent,
  TextCardComponent,
  buildSingleRateCardData,
  buildPairRateCardData
};
//# sourceMappingURL=chunk-XXLX3JOX.js.map
