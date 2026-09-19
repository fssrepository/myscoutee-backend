import {
  CARD_MENU_ACTIONS
} from "./chunk-7FYNT6CO.js";
import {
  LazyBgImageDirective
} from "./chunk-5VDIJXBA.js";
import {
  AppMenuTriggerComponent
} from "./chunk-EAXEH725.js";
import {
  AppMenuComponent,
  IndicatorComponent
} from "./chunk-53UGBDSO.js";
import {
  CounterBadgePipe,
  I18nPipe,
  MatIcon,
  MatIconModule
} from "./chunk-L6HJFJOR.js";
import {
  I18nService
} from "./chunk-AOUY6FNC.js";
import {
  CommonModule,
  NgClass,
  NgStyle
} from "./chunk-SCHUURLR.js";
import {
  AppUtils
} from "./chunk-CYVMX3LD.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  __spreadProps,
  __spreadValues,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵcomponentInstance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-EV3I3YNV.js";

// src/app/shared/ui/components/core/smart-list/card/single-row/single-row.component.ts
var _c0 = () => [];
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
    \u0275\u0275repeater((ctx_r1.row == null ? null : ctx_r1.row.metaRows) ?? \u0275\u0275pureFunction0(0, _c0));
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
  ], styles: ['\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n.ui-single-row[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  min-width: 0;\n  min-height: 80px;\n  box-sizing: border-box;\n  border: 1px solid rgba(33, 51, 78, 0.14);\n  border-radius: 8px;\n  background: #fff;\n  padding: 0.48rem 0.55rem;\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  gap: 0.5rem;\n  align-items: center;\n  isolation: isolate;\n  transition:\n    box-shadow 0.16s ease,\n    background-color 0.16s ease,\n    border-color 0.16s ease,\n    color 0.16s ease;\n}\n.ui-single-row--with-top-right[_ngcontent-%COMP%] {\n  padding-top: 0.48rem;\n  padding-bottom: 0.62rem;\n}\n.ui-single-row--no-leading[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 1fr) auto;\n}\n.ui-single-row--clickable[_ngcontent-%COMP%] {\n  cursor: pointer;\n  -webkit-tap-highlight-color: transparent;\n}\n.ui-single-row--clickable[_ngcontent-%COMP%]:hover {\n  box-shadow: 0 10px 22px rgba(30, 52, 84, 0.12);\n}\n.ui-single-row__progress-ring[_ngcontent-%COMP%] {\n  inset: -2px;\n  z-index: 4;\n}\n.ui-single-row--progress-ring[_ngcontent-%COMP%]    > [_ngcontent-%COMP%]:not(.ui-single-row__progress-ring) {\n  opacity: 0.9;\n}\n.ui-single-row--tone-neutral[_ngcontent-%COMP%], \n.ui-single-row--tone-muted[_ngcontent-%COMP%] {\n  border-color: rgba(74, 88, 108, 0.18);\n  background: #f7f9fc;\n}\n.ui-single-row--tone-info[_ngcontent-%COMP%] {\n  border-color: rgba(45, 111, 181, 0.26);\n  background: #f3f8ff;\n}\n.ui-single-row--tone-accent[_ngcontent-%COMP%] {\n  border-color: rgba(122, 86, 190, 0.24);\n  background: #f8f5ff;\n}\n.ui-single-row--tone-success[_ngcontent-%COMP%] {\n  border-color: rgba(40, 132, 89, 0.24);\n  background: #f2fbf6;\n}\n.ui-single-row--tone-warning[_ngcontent-%COMP%] {\n  border-color: rgba(190, 129, 38, 0.28);\n  background: #fff8ed;\n}\n.ui-single-row--tone-danger[_ngcontent-%COMP%] {\n  border-color: rgba(190, 60, 76, 0.28);\n  background: #fff4f5;\n}\n.ui-single-row__top-right[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.7rem;\n  right: 0.7rem;\n  z-index: 2;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.2rem;\n  max-width: min(58%, 18rem);\n}\n.ui-single-row--with-top-right.ui-single-row--with-menu-actions[_ngcontent-%COMP%]   .ui-single-row__top-right[_ngcontent-%COMP%] {\n  right: 0.7rem;\n  max-width: min(46%, 18rem);\n}\n.ui-single-row__top-right[_ngcontent-%COMP%]   .ui-single-row__badge-pill[_ngcontent-%COMP%] {\n  min-width: 0;\n  max-width: 100%;\n}\n.ui-single-row__avatar[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  color: #fff;\n  background:\n    linear-gradient(\n      180deg,\n      #6ca6ff 0%,\n      #3d78d8 100%);\n  font-size: 11px;\n  font-weight: 800;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  overflow: hidden;\n  flex: 0 0 auto;\n}\n.ui-single-row__avatar.notification-system-avatar[_ngcontent-%COMP%] {\n  color: #fff;\n  border: 1px solid rgba(116, 226, 255, 0.72);\n  background:\n    radial-gradient(\n      circle at 30% 20%,\n      rgba(103, 232, 255, 0.96),\n      transparent 42%),\n    linear-gradient(\n      145deg,\n      #3948c8 0%,\n      #8a3fc0 58%,\n      #e94791 100%);\n  box-shadow: 0 4px 12px rgba(67, 48, 163, 0.3);\n}\n.ui-single-row__avatar.notification-stage-avatar[_ngcontent-%COMP%] {\n  position: relative;\n  color: hsl(var(--ui-single-row-accent-hue, 210), 72%, 30%);\n  border: 1px solid hsl(var(--ui-single-row-accent-hue, 210), 54%, 58%, 0.58);\n  background:\n    radial-gradient(\n      circle at 28% 18%,\n      hsl(var(--ui-single-row-accent-hue, 210), 90%, 98%, 0.9),\n      transparent 42%),\n    linear-gradient(\n      180deg,\n      hsl(var(--ui-single-row-accent-hue, 210), 82%, 97%) 0%,\n      hsl(var(--ui-single-row-accent-hue, 210), 64%, 86%) 100%);\n  box-shadow: 0 4px 12px hsl(var(--ui-single-row-accent-hue, 210), 42%, 36%, 0.2);\n}\n.ui-single-row__avatar.notification-stage-avatar--positive[_ngcontent-%COMP%] {\n  box-shadow:\n    0 0 0 3px hsl(var(--ui-single-row-accent-hue, 210), 78%, 70%, 0.2),\n    0 0 17px hsl(var(--ui-single-row-accent-hue, 210), 86%, 54%, 0.46),\n    0 5px 13px hsl(var(--ui-single-row-accent-hue, 210), 42%, 34%, 0.25);\n}\n.ui-single-row__avatar.notification-stage-avatar--negative[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  width: 28px;\n  height: 2px;\n  border-radius: 999px;\n  background: hsl(var(--ui-single-row-accent-hue, 210), 74%, 28%, 0.82);\n  box-shadow: 0 0 0 1px hsl(var(--ui-single-row-accent-hue, 210), 88%, 96%, 0.72);\n  transform: rotate(-45deg);\n}\n.ui-single-row__avatar--circle[_ngcontent-%COMP%] {\n  border-radius: 50%;\n}\n.ui-single-row__avatar--rounded[_ngcontent-%COMP%] {\n  border-radius: 8px;\n}\n.ui-single-row__avatar--square[_ngcontent-%COMP%] {\n  border-radius: 4px;\n}\n.ui-single-row__avatar[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n.ui-single-row__avatar[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.ui-single-row__badge-pill[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.ui-single-row__menu-trigger[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.ui-single-row__main[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.08rem;\n}\n.ui-single-row.notification-row.ui-single-row--with-top-right[_ngcontent-%COMP%]   .ui-single-row__main[_ngcontent-%COMP%] {\n  padding-right: min(28%, 6.25rem);\n}\n.ui-single-row__headline[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.36rem;\n  overflow: hidden;\n}\n.ui-single-row__title[_ngcontent-%COMP%], \n.ui-single-row__subtitle[_ngcontent-%COMP%], \n.ui-single-row__detail[_ngcontent-%COMP%], \n.ui-single-row__meta[_ngcontent-%COMP%] {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.ui-single-row__title[_ngcontent-%COMP%] {\n  font-size: 0.84rem;\n  font-weight: 850;\n  color: #1f3658;\n  flex: 0 1 auto;\n}\n.ui-single-row__corner-counter[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  min-width: 24px;\n  height: 24px;\n  padding: 0 0.46rem;\n  border-radius: 999px;\n  border: 1px solid rgba(255, 221, 170, 0.92);\n  background:\n    linear-gradient(\n      180deg,\n      #f2a33a 0%,\n      #cc7a19 100%);\n  color: #fff7e8;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.72rem;\n  font-weight: 850;\n  line-height: 1;\n  white-space: nowrap;\n  box-shadow: 0 5px 12px rgba(173, 101, 21, 0.22);\n}\n.ui-single-row__subtitle[_ngcontent-%COMP%] {\n  font-size: 0.76rem;\n  color: rgba(20, 36, 58, 0.75);\n}\n.ui-single-row__detail[_ngcontent-%COMP%], \n.ui-single-row__meta[_ngcontent-%COMP%] {\n  font-size: 0.73rem;\n  color: rgba(20, 36, 58, 0.64);\n}\n.ui-single-row__meta[_ngcontent-%COMP%] {\n  display: inline-flex;\n  gap: 0.32rem;\n}\n.ui-single-row__inline-badges[_ngcontent-%COMP%], \n.ui-single-row__side-badges[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n}\n.ui-single-row__inline-badges[_ngcontent-%COMP%] {\n  flex: 0 1 auto;\n  overflow: hidden;\n}\n.ui-single-row__side[_ngcontent-%COMP%] {\n  justify-self: end;\n  align-self: center;\n  min-width: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.34rem;\n}\n.ui-single-row--with-top-right[_ngcontent-%COMP%]   .ui-single-row__side[_ngcontent-%COMP%] {\n  align-self: center;\n  padding-top: 0;\n}\n.ui-single-row--with-top-right.ui-single-row--with-menu-actions[_ngcontent-%COMP%]   .ui-single-row__side[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 2.48rem;\n  right: 0.7rem;\n  z-index: 2;\n}\n.ui-single-row__badge-pill[_ngcontent-%COMP%] {\n  min-height: 26px;\n  border-radius: 999px;\n  border: 1px solid rgba(33, 51, 78, 0.12);\n  background: rgba(255, 255, 255, 0.88);\n  color: #233a5b;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.22rem;\n  font-size: 0.72rem;\n  font-weight: 800;\n  padding: 0 0.56rem;\n  white-space: nowrap;\n  box-shadow: 0 5px 12px rgba(30, 52, 84, 0.08);\n}\n.ui-single-row__badge-pill[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  min-width: 0;\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.ui-single-row__badge-pill--inverse[_ngcontent-%COMP%] {\n  border-color: rgba(255, 255, 255, 0.88);\n  background: rgba(26, 45, 71, 0.84);\n  color: #fff;\n}\n.ui-single-row__badge-pill--info[_ngcontent-%COMP%] {\n  border-color: rgba(45, 111, 181, 0.22);\n  background: #eaf3ff;\n  color: #24598f;\n}\n.ui-single-row__badge-pill--accent[_ngcontent-%COMP%] {\n  border-color: rgba(122, 86, 190, 0.22);\n  background: #f1ebff;\n  color: #6544a0;\n}\n.ui-single-row__badge-pill--success[_ngcontent-%COMP%] {\n  border-color: rgba(40, 132, 89, 0.22);\n  background: #e7f7ee;\n  color: #28774e;\n}\n.ui-single-row__badge-pill--warning[_ngcontent-%COMP%] {\n  border-color: rgba(190, 129, 38, 0.24);\n  background: #fff1d9;\n  color: #8c5a16;\n}\n.ui-single-row__badge-pill--danger[_ngcontent-%COMP%] {\n  border-color: rgba(190, 60, 76, 0.24);\n  background: #ffe7ea;\n  color: #9c3040;\n}\n.ui-single-row__menu-trigger[_ngcontent-%COMP%] {\n  position: relative;\n  width: 32px;\n  min-width: 32px;\n  height: 32px;\n  border: 1px solid rgba(33, 51, 78, 0.14);\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.94);\n  color: #2d4b73;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.24rem;\n  padding: 0;\n  cursor: pointer;\n  transition:\n    background-color 0.16s ease,\n    border-color 0.16s ease,\n    color 0.16s ease,\n    transform 0.16s ease;\n}\n.ui-single-row__menu-trigger[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n}\n.ui-single-row__menu-trigger[_ngcontent-%COMP%]:disabled {\n  cursor: wait;\n  transform: none;\n}\n.ui-single-row__menu-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -0.35rem;\n  right: -0.35rem;\n}\n.ui-single-row__menu[_ngcontent-%COMP%], \n.ui-single-row__menu-trigger[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex: 0 0 auto;\n}\n.ui-single-row--with-top-right[_ngcontent-%COMP%]   .ui-single-row__menu[_ngcontent-%COMP%], \n.ui-single-row--with-top-right[_ngcontent-%COMP%]   .ui-single-row__menu-trigger[_ngcontent-%COMP%] {\n  margin-top: 0;\n}\n@media (max-width: 760px) {\n  .ui-single-row.notification-row.ui-single-row--with-top-right[_ngcontent-%COMP%]   .ui-single-row__headline[_ngcontent-%COMP%] {\n    padding-inline-end: 4rem;\n  }\n  .ui-single-row[_ngcontent-%COMP%] {\n    grid-template-columns: auto minmax(0, 1fr);\n  }\n  .ui-single-row--no-leading[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .ui-single-row__side[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n    justify-self: stretch;\n    justify-content: flex-start;\n    flex-wrap: wrap;\n  }\n  .ui-single-row--with-top-right[_ngcontent-%COMP%]   .ui-single-row__side[_ngcontent-%COMP%] {\n    position: absolute;\n    top: 2.48rem;\n    right: 0.7rem;\n    grid-column: auto;\n    width: auto;\n    justify-self: end;\n    justify-content: flex-end;\n    flex-wrap: nowrap;\n    padding-top: 0;\n    z-index: 2;\n  }\n  .ui-single-row--with-top-right[_ngcontent-%COMP%]   .ui-single-row__menu[_ngcontent-%COMP%], \n   .ui-single-row--with-top-right[_ngcontent-%COMP%]   .ui-single-row__menu-trigger[_ngcontent-%COMP%] {\n    margin-top: 0;\n  }\n  .ui-single-row__top-right[_ngcontent-%COMP%] {\n    max-width: 80%;\n  }\n}\n/*# sourceMappingURL=single-row.component.css.map */'], changeDetection: 0 });
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
`, styles: ['/* src/app/shared/ui/components/core/smart-list/card/single-row/single-row.component.scss */\n:host {\n  display: block;\n  min-width: 0;\n}\n.ui-single-row {\n  position: relative;\n  width: 100%;\n  min-width: 0;\n  min-height: 80px;\n  box-sizing: border-box;\n  border: 1px solid rgba(33, 51, 78, 0.14);\n  border-radius: 8px;\n  background: #fff;\n  padding: 0.48rem 0.55rem;\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  gap: 0.5rem;\n  align-items: center;\n  isolation: isolate;\n  transition:\n    box-shadow 0.16s ease,\n    background-color 0.16s ease,\n    border-color 0.16s ease,\n    color 0.16s ease;\n}\n.ui-single-row--with-top-right {\n  padding-top: 0.48rem;\n  padding-bottom: 0.62rem;\n}\n.ui-single-row--no-leading {\n  grid-template-columns: minmax(0, 1fr) auto;\n}\n.ui-single-row--clickable {\n  cursor: pointer;\n  -webkit-tap-highlight-color: transparent;\n}\n.ui-single-row--clickable:hover {\n  box-shadow: 0 10px 22px rgba(30, 52, 84, 0.12);\n}\n.ui-single-row__progress-ring {\n  inset: -2px;\n  z-index: 4;\n}\n.ui-single-row--progress-ring > :not(.ui-single-row__progress-ring) {\n  opacity: 0.9;\n}\n.ui-single-row--tone-neutral,\n.ui-single-row--tone-muted {\n  border-color: rgba(74, 88, 108, 0.18);\n  background: #f7f9fc;\n}\n.ui-single-row--tone-info {\n  border-color: rgba(45, 111, 181, 0.26);\n  background: #f3f8ff;\n}\n.ui-single-row--tone-accent {\n  border-color: rgba(122, 86, 190, 0.24);\n  background: #f8f5ff;\n}\n.ui-single-row--tone-success {\n  border-color: rgba(40, 132, 89, 0.24);\n  background: #f2fbf6;\n}\n.ui-single-row--tone-warning {\n  border-color: rgba(190, 129, 38, 0.28);\n  background: #fff8ed;\n}\n.ui-single-row--tone-danger {\n  border-color: rgba(190, 60, 76, 0.28);\n  background: #fff4f5;\n}\n.ui-single-row__top-right {\n  position: absolute;\n  top: 0.7rem;\n  right: 0.7rem;\n  z-index: 2;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.2rem;\n  max-width: min(58%, 18rem);\n}\n.ui-single-row--with-top-right.ui-single-row--with-menu-actions .ui-single-row__top-right {\n  right: 0.7rem;\n  max-width: min(46%, 18rem);\n}\n.ui-single-row__top-right .ui-single-row__badge-pill {\n  min-width: 0;\n  max-width: 100%;\n}\n.ui-single-row__avatar {\n  width: 36px;\n  height: 36px;\n  color: #fff;\n  background:\n    linear-gradient(\n      180deg,\n      #6ca6ff 0%,\n      #3d78d8 100%);\n  font-size: 11px;\n  font-weight: 800;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  overflow: hidden;\n  flex: 0 0 auto;\n}\n.ui-single-row__avatar.notification-system-avatar {\n  color: #fff;\n  border: 1px solid rgba(116, 226, 255, 0.72);\n  background:\n    radial-gradient(\n      circle at 30% 20%,\n      rgba(103, 232, 255, 0.96),\n      transparent 42%),\n    linear-gradient(\n      145deg,\n      #3948c8 0%,\n      #8a3fc0 58%,\n      #e94791 100%);\n  box-shadow: 0 4px 12px rgba(67, 48, 163, 0.3);\n}\n.ui-single-row__avatar.notification-stage-avatar {\n  position: relative;\n  color: hsl(var(--ui-single-row-accent-hue, 210), 72%, 30%);\n  border: 1px solid hsl(var(--ui-single-row-accent-hue, 210), 54%, 58%, 0.58);\n  background:\n    radial-gradient(\n      circle at 28% 18%,\n      hsl(var(--ui-single-row-accent-hue, 210), 90%, 98%, 0.9),\n      transparent 42%),\n    linear-gradient(\n      180deg,\n      hsl(var(--ui-single-row-accent-hue, 210), 82%, 97%) 0%,\n      hsl(var(--ui-single-row-accent-hue, 210), 64%, 86%) 100%);\n  box-shadow: 0 4px 12px hsl(var(--ui-single-row-accent-hue, 210), 42%, 36%, 0.2);\n}\n.ui-single-row__avatar.notification-stage-avatar--positive {\n  box-shadow:\n    0 0 0 3px hsl(var(--ui-single-row-accent-hue, 210), 78%, 70%, 0.2),\n    0 0 17px hsl(var(--ui-single-row-accent-hue, 210), 86%, 54%, 0.46),\n    0 5px 13px hsl(var(--ui-single-row-accent-hue, 210), 42%, 34%, 0.25);\n}\n.ui-single-row__avatar.notification-stage-avatar--negative::after {\n  content: "";\n  position: absolute;\n  width: 28px;\n  height: 2px;\n  border-radius: 999px;\n  background: hsl(var(--ui-single-row-accent-hue, 210), 74%, 28%, 0.82);\n  box-shadow: 0 0 0 1px hsl(var(--ui-single-row-accent-hue, 210), 88%, 96%, 0.72);\n  transform: rotate(-45deg);\n}\n.ui-single-row__avatar--circle {\n  border-radius: 50%;\n}\n.ui-single-row__avatar--rounded {\n  border-radius: 8px;\n}\n.ui-single-row__avatar--square {\n  border-radius: 4px;\n}\n.ui-single-row__avatar img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n.ui-single-row__avatar .mat-icon,\n.ui-single-row__badge-pill .mat-icon,\n.ui-single-row__menu-trigger .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.ui-single-row__main {\n  min-width: 0;\n  display: grid;\n  gap: 0.08rem;\n}\n.ui-single-row.notification-row.ui-single-row--with-top-right .ui-single-row__main {\n  padding-right: min(28%, 6.25rem);\n}\n.ui-single-row__headline {\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.36rem;\n  overflow: hidden;\n}\n.ui-single-row__title,\n.ui-single-row__subtitle,\n.ui-single-row__detail,\n.ui-single-row__meta {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.ui-single-row__title {\n  font-size: 0.84rem;\n  font-weight: 850;\n  color: #1f3658;\n  flex: 0 1 auto;\n}\n.ui-single-row__corner-counter {\n  flex: 0 0 auto;\n  min-width: 24px;\n  height: 24px;\n  padding: 0 0.46rem;\n  border-radius: 999px;\n  border: 1px solid rgba(255, 221, 170, 0.92);\n  background:\n    linear-gradient(\n      180deg,\n      #f2a33a 0%,\n      #cc7a19 100%);\n  color: #fff7e8;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.72rem;\n  font-weight: 850;\n  line-height: 1;\n  white-space: nowrap;\n  box-shadow: 0 5px 12px rgba(173, 101, 21, 0.22);\n}\n.ui-single-row__subtitle {\n  font-size: 0.76rem;\n  color: rgba(20, 36, 58, 0.75);\n}\n.ui-single-row__detail,\n.ui-single-row__meta {\n  font-size: 0.73rem;\n  color: rgba(20, 36, 58, 0.64);\n}\n.ui-single-row__meta {\n  display: inline-flex;\n  gap: 0.32rem;\n}\n.ui-single-row__inline-badges,\n.ui-single-row__side-badges {\n  min-width: 0;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n}\n.ui-single-row__inline-badges {\n  flex: 0 1 auto;\n  overflow: hidden;\n}\n.ui-single-row__side {\n  justify-self: end;\n  align-self: center;\n  min-width: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.34rem;\n}\n.ui-single-row--with-top-right .ui-single-row__side {\n  align-self: center;\n  padding-top: 0;\n}\n.ui-single-row--with-top-right.ui-single-row--with-menu-actions .ui-single-row__side {\n  position: absolute;\n  top: 2.48rem;\n  right: 0.7rem;\n  z-index: 2;\n}\n.ui-single-row__badge-pill {\n  min-height: 26px;\n  border-radius: 999px;\n  border: 1px solid rgba(33, 51, 78, 0.12);\n  background: rgba(255, 255, 255, 0.88);\n  color: #233a5b;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.22rem;\n  font-size: 0.72rem;\n  font-weight: 800;\n  padding: 0 0.56rem;\n  white-space: nowrap;\n  box-shadow: 0 5px 12px rgba(30, 52, 84, 0.08);\n}\n.ui-single-row__badge-pill span {\n  min-width: 0;\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.ui-single-row__badge-pill--inverse {\n  border-color: rgba(255, 255, 255, 0.88);\n  background: rgba(26, 45, 71, 0.84);\n  color: #fff;\n}\n.ui-single-row__badge-pill--info {\n  border-color: rgba(45, 111, 181, 0.22);\n  background: #eaf3ff;\n  color: #24598f;\n}\n.ui-single-row__badge-pill--accent {\n  border-color: rgba(122, 86, 190, 0.22);\n  background: #f1ebff;\n  color: #6544a0;\n}\n.ui-single-row__badge-pill--success {\n  border-color: rgba(40, 132, 89, 0.22);\n  background: #e7f7ee;\n  color: #28774e;\n}\n.ui-single-row__badge-pill--warning {\n  border-color: rgba(190, 129, 38, 0.24);\n  background: #fff1d9;\n  color: #8c5a16;\n}\n.ui-single-row__badge-pill--danger {\n  border-color: rgba(190, 60, 76, 0.24);\n  background: #ffe7ea;\n  color: #9c3040;\n}\n.ui-single-row__menu-trigger {\n  position: relative;\n  width: 32px;\n  min-width: 32px;\n  height: 32px;\n  border: 1px solid rgba(33, 51, 78, 0.14);\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.94);\n  color: #2d4b73;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.24rem;\n  padding: 0;\n  cursor: pointer;\n  transition:\n    background-color 0.16s ease,\n    border-color 0.16s ease,\n    color 0.16s ease,\n    transform 0.16s ease;\n}\n.ui-single-row__menu-trigger:hover {\n  transform: translateY(-1px);\n}\n.ui-single-row__menu-trigger:disabled {\n  cursor: wait;\n  transform: none;\n}\n.ui-single-row__menu-badge {\n  position: absolute;\n  top: -0.35rem;\n  right: -0.35rem;\n}\n.ui-single-row__menu,\n.ui-single-row__menu-trigger {\n  display: inline-flex;\n  flex: 0 0 auto;\n}\n.ui-single-row--with-top-right .ui-single-row__menu,\n.ui-single-row--with-top-right .ui-single-row__menu-trigger {\n  margin-top: 0;\n}\n@media (max-width: 760px) {\n  .ui-single-row.notification-row.ui-single-row--with-top-right .ui-single-row__headline {\n    padding-inline-end: 4rem;\n  }\n  .ui-single-row {\n    grid-template-columns: auto minmax(0, 1fr);\n  }\n  .ui-single-row--no-leading {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .ui-single-row__side {\n    grid-column: 1/-1;\n    justify-self: stretch;\n    justify-content: flex-start;\n    flex-wrap: wrap;\n  }\n  .ui-single-row--with-top-right .ui-single-row__side {\n    position: absolute;\n    top: 2.48rem;\n    right: 0.7rem;\n    grid-column: auto;\n    width: auto;\n    justify-self: end;\n    justify-content: flex-end;\n    flex-wrap: nowrap;\n    padding-top: 0;\n    z-index: 2;\n  }\n  .ui-single-row--with-top-right .ui-single-row__menu,\n  .ui-single-row--with-top-right .ui-single-row__menu-trigger {\n    margin-top: 0;\n  }\n  .ui-single-row__top-right {\n    max-width: 80%;\n  }\n}\n/*# sourceMappingURL=single-row.component.css.map */\n'] }]
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
      `ui-image-card--layout-${this.resolvedLayout()}`,
      `ui-image-card--frame-${this.resolvedFrame()}`,
      `ui-image-card--media-fit-${this.resolvedMediaFit()}`
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
  resolvedFrame() {
    return this.card?.frame ?? "fluid";
  }
  resolvedMediaFit() {
    return this.card?.mediaFit ?? "cover";
  }
  resolvedImageUrl() {
    return AppUtils.mediaImageVariantUrl(`${this.card?.imageUrl ?? this.card?.singleImageUrls?.[0] ?? this.imageUrl ?? ""}`.trim(), "medium");
  }
  resolvedAspectRatio() {
    const aspectRatio = `${this.card?.aspectRatio ?? ""}`.trim();
    return aspectRatio || null;
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
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ImageCardComponent, selectors: [["app-image-card"]], inputs: { card: "card", imageUrl: "imageUrl", title: "title", subtitle: "subtitle", detail: "detail", label: "label", placeholder: "placeholder", mediaActions: "mediaActions", menuId: "menuId", menuTitle: "menuTitle", sharedMenuTrigger: "sharedMenuTrigger", sharedMenuItems: "sharedMenuItems", sharedMenuContext: "sharedMenuContext" }, outputs: { mediaAction: "mediaAction" }, decls: 3, vars: 5, consts: [[3, "ngClass", "appLazyBgImage"], [1, "ui-image-card__media", 3, "appLazyBgImage"], ["aria-hidden", "true", 1, "ui-image-card__image-loader"], [1, "ui-image-card__placeholder"], [1, "ui-image-card__label"], [1, "ui-image-card__body"], [1, "ui-image-card__title"], [1, "ui-image-card__subtitle"], [1, "ui-image-card__detail"], ["kind", "spinner-ring"], ["aria-hidden", "true", 1, "ui-image-card__image-loader", "ui-image-card__image-loader--overlay"], ["aria-hidden", "true", 1, "ui-image-card__overlay-placeholder"], [1, "ui-image-card__label", "ui-image-card__label--overlay"], [3, "ngClass"], [1, "ui-image-card__overlay-meta"], [1, "ui-image-card__actions", 3, "ngClass"], ["type", "button", 3, "ngClass", "disabled"], ["kind", "select", 1, "ui-image-card__menu-trigger", 3, "menuId", "title", "trigger", "items", "context"], ["type", "button", 3, "click", "ngClass", "disabled"]], template: function ImageCardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "article", 0);
      \u0275\u0275conditionalCreate(1, ImageCardComponent_Conditional_1_Template, 9, 7)(2, ImageCardComponent_Conditional_2_Template, 15, 11);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275styleProp("aspect-ratio", ctx.resolvedAspectRatio());
      \u0275\u0275property("ngClass", ctx.rootClassList())("appLazyBgImage", ctx.resolvedLayout() === "overlay" ? ctx.resolvedImageUrl() || null : null);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.resolvedLayout() === "stacked" ? 1 : 2);
    }
  }, dependencies: [CommonModule, NgClass, MatIconModule, MatIcon, LazyBgImageDirective, AppMenuTriggerComponent, IndicatorComponent], styles: ['\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n.form-flow__step-image-card[_nghost-%COMP%]   .ui-image-card[_ngcontent-%COMP%] {\n  height: 100%;\n  min-height: 100%;\n}\n.form-flow__step-image-card[_nghost-%COMP%]   .ui-image-card--layout-overlay[_ngcontent-%COMP%] {\n  min-height: 100%;\n}\n.ui-image-card[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: hidden;\n  box-sizing: border-box;\n  border: 1px solid rgba(34, 54, 84, 0.18);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      #f9fbff 0%,\n      #eef4ff 100%);\n  box-shadow: 0 8px 20px rgba(15, 33, 58, 0.08);\n}\n.ui-image-card--frame-compact[_ngcontent-%COMP%] {\n  width: min(320px, 100%);\n  max-width: 100%;\n}\n.ui-image-card--layout-overlay[_ngcontent-%COMP%] {\n  min-height: 250px;\n  border-radius: 13px;\n  background-color: #dfe8f7;\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n  isolation: isolate;\n}\n.ui-image-card--layout-overlay.ui-image-card--media-fit-contain[_ngcontent-%COMP%], \n.ui-image-card--media-fit-contain[_ngcontent-%COMP%]   .ui-image-card__media[_ngcontent-%COMP%] {\n  background-size: contain;\n  background-repeat: no-repeat;\n}\n.ui-image-card--layout-overlay[_ngcontent-%COMP%]::before, \n.ui-image-card--layout-overlay[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n}\n.ui-image-card--layout-overlay[_ngcontent-%COMP%]::before {\n  z-index: 0;\n}\n.ui-image-card--layout-overlay[_ngcontent-%COMP%]::after {\n  z-index: 1;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(8, 16, 28, 0.14) 0%,\n      rgba(8, 15, 28, 0.82) 100%);\n}\n.ui-image-card--layout-overlay.ui-image-card--deleted[_ngcontent-%COMP%]::before {\n  -webkit-backdrop-filter: grayscale(0.86) saturate(0.48) contrast(0.9);\n  backdrop-filter: grayscale(0.86) saturate(0.48) contrast(0.9);\n  background: rgba(72, 78, 88, 0.16);\n}\n.ui-image-card__media[_ngcontent-%COMP%] {\n  position: relative;\n  min-height: 180px;\n  background-size: cover;\n  background-position: center;\n  background-color: #dfe8f7;\n}\n.ui-image-card__image-loader[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  z-index: 2;\n  display: grid;\n  place-items: center;\n  pointer-events: none;\n  opacity: 0;\n  transition: opacity 120ms ease;\n}\n.ui-image-card__image-loader[_ngcontent-%COMP%]   app-indicator[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n}\n.ui-image-card__media.lazy-bg-loading[_ngcontent-%COMP%]   .ui-image-card__image-loader[_ngcontent-%COMP%], \n.ui-image-card.lazy-bg-loading[_ngcontent-%COMP%]    > .ui-image-card__image-loader[_ngcontent-%COMP%] {\n  opacity: 1;\n}\n.ui-image-card__media.lazy-bg-loaded[_ngcontent-%COMP%]   .ui-image-card__image-loader[_ngcontent-%COMP%], \n.ui-image-card.lazy-bg-loaded[_ngcontent-%COMP%]    > .ui-image-card__image-loader[_ngcontent-%COMP%], \n.ui-image-card__media.lazy-bg-error[_ngcontent-%COMP%]   .ui-image-card__image-loader[_ngcontent-%COMP%], \n.ui-image-card.lazy-bg-error[_ngcontent-%COMP%]    > .ui-image-card__image-loader[_ngcontent-%COMP%] {\n  opacity: 0;\n}\n.ui-image-card__placeholder[_ngcontent-%COMP%], \n.ui-image-card__overlay-placeholder[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 50% auto auto 50%;\n  transform: translate(-50%, -50%);\n  width: 68px;\n  height: 68px;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  background:\n    linear-gradient(\n      145deg,\n      #4f7cff,\n      #7a3eff 60%,\n      #f04eab);\n  color: #fff;\n  font-size: 1.2rem;\n  font-weight: 800;\n}\n.ui-image-card__overlay-placeholder[_ngcontent-%COMP%] {\n  z-index: 2;\n  width: 58px;\n  height: 58px;\n  border: 1px solid rgba(255, 255, 255, 0.72);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.94) 0%,\n      rgba(226, 236, 250, 0.9) 100%);\n  color: #42618c;\n  box-shadow: 0 10px 24px rgba(10, 26, 48, 0.18);\n}\n.ui-image-card__overlay-placeholder[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 28px;\n  height: 28px;\n  font-size: 28px;\n  line-height: 28px;\n}\n.ui-image-card__overlay-placeholder[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: auto auto -1.15rem 50%;\n  transform: translateX(-50%);\n  color: rgba(255, 255, 255, 0.92);\n  font-size: 0.68rem;\n  white-space: nowrap;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);\n}\n.ui-image-card__overlay-placeholder--has-image[_ngcontent-%COMP%] {\n  display: none;\n}\n.ui-image-card--layout-overlay.lazy-bg-error[_ngcontent-%COMP%]   .ui-image-card__overlay-placeholder--has-image[_ngcontent-%COMP%] {\n  display: inline-flex;\n}\n.ui-image-card__label[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.65rem;\n  left: 0.65rem;\n  border-radius: 999px;\n  padding: 0.18rem 0.48rem;\n  background: rgba(9, 20, 39, 0.7);\n  color: #fff;\n  font-size: 0.68rem;\n  font-weight: 700;\n}\n.ui-image-card__label--overlay[_ngcontent-%COMP%] {\n  z-index: 3;\n}\n.ui-image-card__body[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.22rem;\n  padding: 0.78rem 0.82rem 0.88rem;\n}\n.ui-image-card__overlay-meta[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 0.58rem;\n  right: 0.58rem;\n  bottom: 0.52rem;\n  z-index: 2;\n  min-width: 0;\n}\n.ui-image-card--with-bottom-right-controls[_ngcontent-%COMP%]   .ui-image-card__overlay-meta[_ngcontent-%COMP%] {\n  right: 3.2rem;\n}\n.ui-image-card__title[_ngcontent-%COMP%], \n.ui-image-card__subtitle[_ngcontent-%COMP%], \n.ui-image-card__detail[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.ui-image-card__title[_ngcontent-%COMP%] {\n  color: #173356;\n  font-size: 0.95rem;\n  font-weight: 800;\n}\n.ui-image-card__subtitle[_ngcontent-%COMP%] {\n  color: #35577f;\n  font-size: 0.8rem;\n  font-weight: 700;\n}\n.ui-image-card__detail[_ngcontent-%COMP%] {\n  color: #5d7391;\n  font-size: 0.76rem;\n  line-height: 1.45;\n}\n.ui-image-card--layout-overlay[_ngcontent-%COMP%]   .ui-image-card__title[_ngcontent-%COMP%] {\n  color: #fff;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);\n}\n.ui-image-card--layout-overlay[_ngcontent-%COMP%]   .ui-image-card__subtitle[_ngcontent-%COMP%], \n.ui-image-card--layout-overlay[_ngcontent-%COMP%]   .ui-image-card__detail[_ngcontent-%COMP%] {\n  color: rgba(245, 249, 255, 0.96);\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.58);\n}\n.ui-image-card__actions[_ngcontent-%COMP%] {\n  position: absolute;\n  z-index: 4;\n  display: flex;\n  align-items: center;\n  gap: 0.42rem;\n}\n.ui-image-card__actions--top-left[_ngcontent-%COMP%] {\n  top: 0.48rem;\n  left: 0.48rem;\n}\n.ui-image-card__actions--top-right[_ngcontent-%COMP%] {\n  top: 0.48rem;\n  right: 0.48rem;\n}\n.ui-image-card__actions--bottom-left[_ngcontent-%COMP%] {\n  bottom: 0.48rem;\n  left: 0.48rem;\n}\n.ui-image-card__actions--bottom-right[_ngcontent-%COMP%] {\n  right: 0.48rem;\n  bottom: 0.48rem;\n}\n.ui-image-card__action[_ngcontent-%COMP%] {\n  appearance: none;\n  -webkit-appearance: none;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  border: 1px solid rgba(255, 255, 255, 0.86);\n  background: rgba(243, 249, 255, 0.92);\n  color: #275b98;\n  box-shadow: 0 6px 14px rgba(8, 18, 34, 0.2);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n}\n.ui-image-card__action[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.ui-image-card__action[_ngcontent-%COMP%]:disabled {\n  cursor: wait;\n  opacity: 0.82;\n}\n.ui-image-card__action--info[_ngcontent-%COMP%] {\n  border-color: rgba(41, 99, 143, 0.24);\n  background: rgba(232, 246, 251, 0.94);\n  color: #226d83;\n}\n.ui-image-card__action--success[_ngcontent-%COMP%], \n.ui-image-card__action--success.is-selected[_ngcontent-%COMP%] {\n  border-color: rgba(255, 255, 255, 0.92);\n  background:\n    linear-gradient(\n      180deg,\n      #2f9a59 0%,\n      #237846 100%);\n  color: #fff;\n  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.72), 0 6px 16px rgba(20, 84, 46, 0.3);\n}\n.ui-image-card__action--accent[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef7ff 0%,\n      #dcecff 100%);\n  color: #2c5d9e;\n}\n.ui-image-card__action--warning[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff5de 0%,\n      #ffe7b4 100%);\n  color: #9c6419;\n}\n.ui-image-card__action--destructive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff0f0 0%,\n      #ffe1e1 100%);\n  color: #bc3d45;\n}\n.ui-image-card__status-chip[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.48rem;\n  left: 0.48rem;\n  z-index: 3;\n  min-width: 28px;\n  height: 28px;\n  border-radius: 999px;\n  border: 1px solid rgba(255, 255, 255, 0.86);\n  background: rgba(26, 45, 71, 0.82);\n  color: #fff;\n  box-shadow: 0 6px 14px rgba(8, 18, 34, 0.22);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.26rem;\n  padding: 0 0.36rem;\n  font-size: 0.68rem;\n  font-weight: 800;\n}\n.ui-image-card__status-chip--with-label[_ngcontent-%COMP%] {\n  padding: 0 0.58rem;\n}\n.ui-image-card__status-chip[_ngcontent-%COMP%]:not(.ui-image-card__status-chip--with-label) {\n  width: 32px;\n  height: 32px;\n  padding: 0;\n  border-radius: 50%;\n}\n.ui-image-card__status-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.ui-image-card__status-chip--success[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #2f9a59 0%,\n      #237846 100%);\n}\n.ui-image-card__status-chip--warning[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #bd7a22 0%,\n      #9b5c17 100%);\n}\n.ui-image-card__status-chip--destructive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #bc4b55 0%,\n      #95343e 100%);\n}\n.ui-image-card__status-chip--palette-blue[_ngcontent-%COMP%], \n.ui-image-card__status-chip--palette-sky[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f0ff 0%,\n      #d9e7ff 100%);\n  color: #2b5d9d;\n}\n.ui-image-card__status-chip--palette-green[_ngcontent-%COMP%], \n.ui-image-card__status-chip--palette-success[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ecfaef 0%,\n      #dcf2e2 100%);\n  color: #2a7644;\n}\n.ui-image-card__status-chip--palette-gold[_ngcontent-%COMP%], \n.ui-image-card__status-chip--palette-amber[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff8e8 0%,\n      #fbeecf 100%);\n  color: #956215;\n}\n.ui-image-card__status-chip--palette-orange[_ngcontent-%COMP%], \n.ui-image-card__status-chip--palette-warning[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff6e8 0%,\n      #ffe8c9 100%);\n  color: #9c6121;\n}\n.ui-image-card__status-chip--palette-red[_ngcontent-%COMP%], \n.ui-image-card__status-chip--palette-danger[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff0f3 0%,\n      #ffdce3 100%);\n  color: #a93046;\n}\n.ui-image-card__status-chip--palette-muted[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4edf1 0%,\n      #e3d4dc 100%);\n  color: #6c3348;\n}\n.ui-image-card__badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.62rem;\n  right: 0.48rem;\n  z-index: 4;\n  min-height: 22px;\n  max-width: calc(100% - 0.96rem);\n  border-radius: 999px;\n  border: 1px solid rgba(255, 255, 255, 0.86);\n  padding: 0 0.52rem;\n  background:\n    linear-gradient(\n      180deg,\n      #eef2f7 0%,\n      #dbe2ec 100%);\n  color: #4e5d72;\n  box-shadow: 0 6px 14px rgba(28, 40, 58, 0.18);\n  font-size: 0.64rem;\n  font-weight: 800;\n  line-height: 1;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.ui-image-card--with-top-right-controls[_ngcontent-%COMP%]   .ui-image-card__badge[_ngcontent-%COMP%] {\n  right: 2.82rem;\n  max-width: calc(100% - 3.3rem);\n}\n.ui-image-card__badge--active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ecfaef 0%,\n      #dcf2e2 100%);\n  color: #2a7644;\n}\n.ui-image-card__badge--pending[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff6e8 0%,\n      #ffe8c9 100%);\n  color: #9c6121;\n}\n.ui-image-card__badge--disabled[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f6f9 0%,\n      #dfe5ec 100%);\n  color: #59677a;\n}\n.ui-image-card__badge--danger[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff0f3 0%,\n      #ffdce3 100%);\n  color: #a93046;\n  border-color: rgba(188, 76, 98, 0.36);\n  box-shadow: 0 6px 14px rgba(142, 40, 58, 0.18);\n}\n.ui-image-card__menu-trigger[_ngcontent-%COMP%] {\n  display: block;\n}\n@media (max-width: 760px) {\n  .ui-image-card--layout-overlay[_ngcontent-%COMP%] {\n    min-height: 190px;\n  }\n}\n/*# sourceMappingURL=image-card.component.css.map */'], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ImageCardComponent, [{
    type: Component,
    args: [{ selector: "app-image-card", standalone: true, imports: [CommonModule, MatIconModule, LazyBgImageDirective, AppMenuTriggerComponent, IndicatorComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: `<article
  [ngClass]="rootClassList()"
  [style.aspect-ratio]="resolvedAspectRatio()"
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
`, styles: ['/* src/app/shared/ui/components/core/smart-list/card/image-card/image-card.component.scss */\n:host {\n  display: block;\n  min-width: 0;\n}\n:host(.form-flow__step-image-card) .ui-image-card {\n  height: 100%;\n  min-height: 100%;\n}\n:host(.form-flow__step-image-card) .ui-image-card--layout-overlay {\n  min-height: 100%;\n}\n.ui-image-card {\n  position: relative;\n  overflow: hidden;\n  box-sizing: border-box;\n  border: 1px solid rgba(34, 54, 84, 0.18);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      #f9fbff 0%,\n      #eef4ff 100%);\n  box-shadow: 0 8px 20px rgba(15, 33, 58, 0.08);\n}\n.ui-image-card--frame-compact {\n  width: min(320px, 100%);\n  max-width: 100%;\n}\n.ui-image-card--layout-overlay {\n  min-height: 250px;\n  border-radius: 13px;\n  background-color: #dfe8f7;\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n  isolation: isolate;\n}\n.ui-image-card--layout-overlay.ui-image-card--media-fit-contain,\n.ui-image-card--media-fit-contain .ui-image-card__media {\n  background-size: contain;\n  background-repeat: no-repeat;\n}\n.ui-image-card--layout-overlay::before,\n.ui-image-card--layout-overlay::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n}\n.ui-image-card--layout-overlay::before {\n  z-index: 0;\n}\n.ui-image-card--layout-overlay::after {\n  z-index: 1;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(8, 16, 28, 0.14) 0%,\n      rgba(8, 15, 28, 0.82) 100%);\n}\n.ui-image-card--layout-overlay.ui-image-card--deleted::before {\n  -webkit-backdrop-filter: grayscale(0.86) saturate(0.48) contrast(0.9);\n  backdrop-filter: grayscale(0.86) saturate(0.48) contrast(0.9);\n  background: rgba(72, 78, 88, 0.16);\n}\n.ui-image-card__media {\n  position: relative;\n  min-height: 180px;\n  background-size: cover;\n  background-position: center;\n  background-color: #dfe8f7;\n}\n.ui-image-card__image-loader {\n  position: absolute;\n  inset: 0;\n  z-index: 2;\n  display: grid;\n  place-items: center;\n  pointer-events: none;\n  opacity: 0;\n  transition: opacity 120ms ease;\n}\n.ui-image-card__image-loader app-indicator {\n  position: relative;\n  z-index: 1;\n}\n.ui-image-card__media.lazy-bg-loading .ui-image-card__image-loader,\n.ui-image-card.lazy-bg-loading > .ui-image-card__image-loader {\n  opacity: 1;\n}\n.ui-image-card__media.lazy-bg-loaded .ui-image-card__image-loader,\n.ui-image-card.lazy-bg-loaded > .ui-image-card__image-loader,\n.ui-image-card__media.lazy-bg-error .ui-image-card__image-loader,\n.ui-image-card.lazy-bg-error > .ui-image-card__image-loader {\n  opacity: 0;\n}\n.ui-image-card__placeholder,\n.ui-image-card__overlay-placeholder {\n  position: absolute;\n  inset: 50% auto auto 50%;\n  transform: translate(-50%, -50%);\n  width: 68px;\n  height: 68px;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  background:\n    linear-gradient(\n      145deg,\n      #4f7cff,\n      #7a3eff 60%,\n      #f04eab);\n  color: #fff;\n  font-size: 1.2rem;\n  font-weight: 800;\n}\n.ui-image-card__overlay-placeholder {\n  z-index: 2;\n  width: 58px;\n  height: 58px;\n  border: 1px solid rgba(255, 255, 255, 0.72);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.94) 0%,\n      rgba(226, 236, 250, 0.9) 100%);\n  color: #42618c;\n  box-shadow: 0 10px 24px rgba(10, 26, 48, 0.18);\n}\n.ui-image-card__overlay-placeholder .mat-icon {\n  width: 28px;\n  height: 28px;\n  font-size: 28px;\n  line-height: 28px;\n}\n.ui-image-card__overlay-placeholder span {\n  position: absolute;\n  inset: auto auto -1.15rem 50%;\n  transform: translateX(-50%);\n  color: rgba(255, 255, 255, 0.92);\n  font-size: 0.68rem;\n  white-space: nowrap;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);\n}\n.ui-image-card__overlay-placeholder--has-image {\n  display: none;\n}\n.ui-image-card--layout-overlay.lazy-bg-error .ui-image-card__overlay-placeholder--has-image {\n  display: inline-flex;\n}\n.ui-image-card__label {\n  position: absolute;\n  top: 0.65rem;\n  left: 0.65rem;\n  border-radius: 999px;\n  padding: 0.18rem 0.48rem;\n  background: rgba(9, 20, 39, 0.7);\n  color: #fff;\n  font-size: 0.68rem;\n  font-weight: 700;\n}\n.ui-image-card__label--overlay {\n  z-index: 3;\n}\n.ui-image-card__body {\n  display: grid;\n  gap: 0.22rem;\n  padding: 0.78rem 0.82rem 0.88rem;\n}\n.ui-image-card__overlay-meta {\n  position: absolute;\n  left: 0.58rem;\n  right: 0.58rem;\n  bottom: 0.52rem;\n  z-index: 2;\n  min-width: 0;\n}\n.ui-image-card--with-bottom-right-controls .ui-image-card__overlay-meta {\n  right: 3.2rem;\n}\n.ui-image-card__title,\n.ui-image-card__subtitle,\n.ui-image-card__detail {\n  margin: 0;\n}\n.ui-image-card__title {\n  color: #173356;\n  font-size: 0.95rem;\n  font-weight: 800;\n}\n.ui-image-card__subtitle {\n  color: #35577f;\n  font-size: 0.8rem;\n  font-weight: 700;\n}\n.ui-image-card__detail {\n  color: #5d7391;\n  font-size: 0.76rem;\n  line-height: 1.45;\n}\n.ui-image-card--layout-overlay .ui-image-card__title {\n  color: #fff;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);\n}\n.ui-image-card--layout-overlay .ui-image-card__subtitle,\n.ui-image-card--layout-overlay .ui-image-card__detail {\n  color: rgba(245, 249, 255, 0.96);\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.58);\n}\n.ui-image-card__actions {\n  position: absolute;\n  z-index: 4;\n  display: flex;\n  align-items: center;\n  gap: 0.42rem;\n}\n.ui-image-card__actions--top-left {\n  top: 0.48rem;\n  left: 0.48rem;\n}\n.ui-image-card__actions--top-right {\n  top: 0.48rem;\n  right: 0.48rem;\n}\n.ui-image-card__actions--bottom-left {\n  bottom: 0.48rem;\n  left: 0.48rem;\n}\n.ui-image-card__actions--bottom-right {\n  right: 0.48rem;\n  bottom: 0.48rem;\n}\n.ui-image-card__action {\n  appearance: none;\n  -webkit-appearance: none;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  border: 1px solid rgba(255, 255, 255, 0.86);\n  background: rgba(243, 249, 255, 0.92);\n  color: #275b98;\n  box-shadow: 0 6px 14px rgba(8, 18, 34, 0.2);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n}\n.ui-image-card__action .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.ui-image-card__action:disabled {\n  cursor: wait;\n  opacity: 0.82;\n}\n.ui-image-card__action--info {\n  border-color: rgba(41, 99, 143, 0.24);\n  background: rgba(232, 246, 251, 0.94);\n  color: #226d83;\n}\n.ui-image-card__action--success,\n.ui-image-card__action--success.is-selected {\n  border-color: rgba(255, 255, 255, 0.92);\n  background:\n    linear-gradient(\n      180deg,\n      #2f9a59 0%,\n      #237846 100%);\n  color: #fff;\n  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.72), 0 6px 16px rgba(20, 84, 46, 0.3);\n}\n.ui-image-card__action--accent {\n  background:\n    linear-gradient(\n      180deg,\n      #eef7ff 0%,\n      #dcecff 100%);\n  color: #2c5d9e;\n}\n.ui-image-card__action--warning {\n  background:\n    linear-gradient(\n      180deg,\n      #fff5de 0%,\n      #ffe7b4 100%);\n  color: #9c6419;\n}\n.ui-image-card__action--destructive {\n  background:\n    linear-gradient(\n      180deg,\n      #fff0f0 0%,\n      #ffe1e1 100%);\n  color: #bc3d45;\n}\n.ui-image-card__status-chip {\n  position: absolute;\n  top: 0.48rem;\n  left: 0.48rem;\n  z-index: 3;\n  min-width: 28px;\n  height: 28px;\n  border-radius: 999px;\n  border: 1px solid rgba(255, 255, 255, 0.86);\n  background: rgba(26, 45, 71, 0.82);\n  color: #fff;\n  box-shadow: 0 6px 14px rgba(8, 18, 34, 0.22);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.26rem;\n  padding: 0 0.36rem;\n  font-size: 0.68rem;\n  font-weight: 800;\n}\n.ui-image-card__status-chip--with-label {\n  padding: 0 0.58rem;\n}\n.ui-image-card__status-chip:not(.ui-image-card__status-chip--with-label) {\n  width: 32px;\n  height: 32px;\n  padding: 0;\n  border-radius: 50%;\n}\n.ui-image-card__status-chip .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.ui-image-card__status-chip--success {\n  background:\n    linear-gradient(\n      180deg,\n      #2f9a59 0%,\n      #237846 100%);\n}\n.ui-image-card__status-chip--warning {\n  background:\n    linear-gradient(\n      180deg,\n      #bd7a22 0%,\n      #9b5c17 100%);\n}\n.ui-image-card__status-chip--destructive {\n  background:\n    linear-gradient(\n      180deg,\n      #bc4b55 0%,\n      #95343e 100%);\n}\n.ui-image-card__status-chip--palette-blue,\n.ui-image-card__status-chip--palette-sky {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f0ff 0%,\n      #d9e7ff 100%);\n  color: #2b5d9d;\n}\n.ui-image-card__status-chip--palette-green,\n.ui-image-card__status-chip--palette-success {\n  background:\n    linear-gradient(\n      180deg,\n      #ecfaef 0%,\n      #dcf2e2 100%);\n  color: #2a7644;\n}\n.ui-image-card__status-chip--palette-gold,\n.ui-image-card__status-chip--palette-amber {\n  background:\n    linear-gradient(\n      180deg,\n      #fff8e8 0%,\n      #fbeecf 100%);\n  color: #956215;\n}\n.ui-image-card__status-chip--palette-orange,\n.ui-image-card__status-chip--palette-warning {\n  background:\n    linear-gradient(\n      180deg,\n      #fff6e8 0%,\n      #ffe8c9 100%);\n  color: #9c6121;\n}\n.ui-image-card__status-chip--palette-red,\n.ui-image-card__status-chip--palette-danger {\n  background:\n    linear-gradient(\n      180deg,\n      #fff0f3 0%,\n      #ffdce3 100%);\n  color: #a93046;\n}\n.ui-image-card__status-chip--palette-muted {\n  background:\n    linear-gradient(\n      180deg,\n      #f4edf1 0%,\n      #e3d4dc 100%);\n  color: #6c3348;\n}\n.ui-image-card__badge {\n  position: absolute;\n  top: 0.62rem;\n  right: 0.48rem;\n  z-index: 4;\n  min-height: 22px;\n  max-width: calc(100% - 0.96rem);\n  border-radius: 999px;\n  border: 1px solid rgba(255, 255, 255, 0.86);\n  padding: 0 0.52rem;\n  background:\n    linear-gradient(\n      180deg,\n      #eef2f7 0%,\n      #dbe2ec 100%);\n  color: #4e5d72;\n  box-shadow: 0 6px 14px rgba(28, 40, 58, 0.18);\n  font-size: 0.64rem;\n  font-weight: 800;\n  line-height: 1;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.ui-image-card--with-top-right-controls .ui-image-card__badge {\n  right: 2.82rem;\n  max-width: calc(100% - 3.3rem);\n}\n.ui-image-card__badge--active {\n  background:\n    linear-gradient(\n      180deg,\n      #ecfaef 0%,\n      #dcf2e2 100%);\n  color: #2a7644;\n}\n.ui-image-card__badge--pending {\n  background:\n    linear-gradient(\n      180deg,\n      #fff6e8 0%,\n      #ffe8c9 100%);\n  color: #9c6121;\n}\n.ui-image-card__badge--disabled {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f6f9 0%,\n      #dfe5ec 100%);\n  color: #59677a;\n}\n.ui-image-card__badge--danger {\n  background:\n    linear-gradient(\n      180deg,\n      #fff0f3 0%,\n      #ffdce3 100%);\n  color: #a93046;\n  border-color: rgba(188, 76, 98, 0.36);\n  box-shadow: 0 6px 14px rgba(142, 40, 58, 0.18);\n}\n.ui-image-card__menu-trigger {\n  display: block;\n}\n@media (max-width: 760px) {\n  .ui-image-card--layout-overlay {\n    min-height: 190px;\n  }\n}\n/*# sourceMappingURL=image-card.component.css.map */\n'] }]
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ImageCardComponent, { className: "ImageCardComponent", filePath: "app/shared/ui/components/core/smart-list/card/image-card/image-card.component.ts", lineNumber: 36 });
})();

// src/app/shared/ui/components/core/smart-list/card/payment-card/payment-card.component.ts
function PaymentCardComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r0.card.loadingLabel));
  }
}
function PaymentCardComponent_Conditional_5_Conditional_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 13);
    \u0275\u0275pipe(1, "i18n");
    \u0275\u0275listener("pointerdown", function PaymentCardComponent_Conditional_5_Conditional_0_Conditional_0_Template_button_pointerdown_0_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.captureMenuRect($event));
    })("click", function PaymentCardComponent_Conditional_5_Conditional_0_Conditional_0_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.openMenu($event));
    });
    \u0275\u0275elementStart(2, "mat-icon", 14);
    \u0275\u0275text(3, "event_busy");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementStart(6, "mat-icon", 15);
    \u0275\u0275text(7, "chevron_right");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(1, 2, "payment.card.actions.open"));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(5, 4, "payment.card.expired"), " ");
  }
}
function PaymentCardComponent_Conditional_5_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 12)(1, "mat-icon", 14);
    \u0275\u0275text(2, "event_busy");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(4, 1, "payment.card.expired"), " ");
  }
}
function PaymentCardComponent_Conditional_5_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, PaymentCardComponent_Conditional_5_Conditional_0_Conditional_0_Template, 8, 6, "button", 11)(1, PaymentCardComponent_Conditional_5_Conditional_0_Conditional_1_Template, 5, 3, "span", 12);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(ctx_r0.showMenu && ((ctx_r0.card.paymentMenuActions == null ? null : ctx_r0.card.paymentMenuActions.length) ?? 0) > 0 ? 0 : 1);
  }
}
function PaymentCardComponent_Conditional_5_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 18);
    \u0275\u0275pipe(1, "i18n");
    \u0275\u0275listener("pointerdown", function PaymentCardComponent_Conditional_5_Conditional_1_Conditional_0_Template_button_pointerdown_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.captureMenuRect($event));
    })("click", function PaymentCardComponent_Conditional_5_Conditional_1_Conditional_0_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.openMenu($event));
    });
    \u0275\u0275elementStart(2, "mat-icon", 14);
    \u0275\u0275text(3, "published_with_changes");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementStart(6, "mat-icon", 15);
    \u0275\u0275text(7, "chevron_right");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(1, 2, "payment.card.actions.open"));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(5, 4, "payment.card.reconnect"), " ");
  }
}
function PaymentCardComponent_Conditional_5_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 17)(1, "mat-icon", 14);
    \u0275\u0275text(2, "published_with_changes");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(4, 1, "payment.card.reconnect"), " ");
  }
}
function PaymentCardComponent_Conditional_5_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, PaymentCardComponent_Conditional_5_Conditional_1_Conditional_0_Template, 8, 6, "button", 16)(1, PaymentCardComponent_Conditional_5_Conditional_1_Conditional_1_Template, 5, 3, "span", 17);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(ctx_r0.showMenu && ((ctx_r0.card.paymentMenuActions == null ? null : ctx_r0.card.paymentMenuActions.length) ?? 0) > 0 ? 0 : 1);
  }
}
function PaymentCardComponent_Conditional_5_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 4)(1, "mat-icon", 14);
    \u0275\u0275text(2, "published_with_changes");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(4, 1, "payment.card.update.needed"), " ");
  }
}
function PaymentCardComponent_Conditional_5_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 19);
    \u0275\u0275pipe(1, "i18n");
    \u0275\u0275listener("pointerdown", function PaymentCardComponent_Conditional_5_Conditional_3_Template_button_pointerdown_0_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.captureMenuRect($event));
    })("click", function PaymentCardComponent_Conditional_5_Conditional_3_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.openMenu($event));
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "more_vert");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(1, 1, "payment.card.actions.open"));
  }
}
function PaymentCardComponent_Conditional_5_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 6);
    \u0275\u0275pipe(1, "i18n");
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "check");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(1, 1, "payment.card.selected"));
  }
}
function PaymentCardComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, PaymentCardComponent_Conditional_5_Conditional_0_Template, 2, 1);
    \u0275\u0275conditionalCreate(1, PaymentCardComponent_Conditional_5_Conditional_1_Template, 2, 1);
    \u0275\u0275conditionalCreate(2, PaymentCardComponent_Conditional_5_Conditional_2_Template, 5, 3, "span", 4);
    \u0275\u0275conditionalCreate(3, PaymentCardComponent_Conditional_5_Conditional_3_Template, 4, 3, "button", 5);
    \u0275\u0275conditionalCreate(4, PaymentCardComponent_Conditional_5_Conditional_4_Template, 4, 3, "span", 6);
    \u0275\u0275elementStart(5, "div", 7)(6, "span", 8);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 9)(9, "span")(10, "small");
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "strong");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "span")(16, "small");
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "strong");
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "span", 10);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r0.card.expired ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.card.expired && ctx_r0.card.requiresRetokenization ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.card.expired && !ctx_r0.card.requiresRetokenization && ctx_r0.card.updateNeeded ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.card.expired && !ctx_r0.card.requiresRetokenization && !ctx_r0.card.updateNeeded && ctx_r0.showMenu && ((ctx_r0.card.paymentMenuActions == null ? null : ctx_r0.card.paymentMenuActions.length) ?? 0) > 0 ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.card.selected ? 4 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.maskedNumber());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(12, 11, "payment.card.cardholder"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.card.cardholderName);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(18, 13, "payment.card.expires"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.expiry());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.resolvedBrandLabel());
  }
}
var PaymentCardComponent = class _PaymentCardComponent {
  i18n = inject(I18nService);
  card;
  selectable = false;
  showMenu = true;
  cardSelect = new EventEmitter();
  menuRequest = new EventEmitter();
  menuOpen = false;
  menuTriggerRect = null;
  maskedNumber() {
    return `\u2022\u2022\u2022\u2022  \u2022\u2022\u2022\u2022  \u2022\u2022\u2022\u2022  ${this.card.last4}`;
  }
  expiry() {
    return `${String(this.card.expiryMonth).padStart(2, "0")}/${String(this.card.expiryYear).slice(-2)}`;
  }
  resolvedBrandLabel() {
    return this.i18n.translateParams("payment.card.ending", {
      brand: this.card.brand,
      last4: this.card.last4
    });
  }
  ariaLabel() {
    const label = this.card.loading ? this.i18n.translate(this.card.loadingLabel || "payment.registration.pending") : this.resolvedBrandLabel();
    if (this.card.expired) {
      return `${label}. ${this.i18n.translate("payment.card.expired")}.`;
    }
    if (this.card.requiresRetokenization) {
      return `${label}. ${this.i18n.translate("payment.card.reconnect")}.`;
    }
    return this.card.updateNeeded ? `${label}. ${this.i18n.translate("payment.card.update.needed")}.` : label;
  }
  onSelect(event) {
    if (!this.selectable || this.card.disabled)
      return;
    this.cardSelect.emit(event);
  }
  onKeydown(event) {
    if (!this.selectable || this.card.disabled || event.key !== "Enter" && event.key !== " ")
      return;
    event.preventDefault();
    this.cardSelect.emit(event);
  }
  captureMenuRect(event) {
    event.stopPropagation();
    this.menuTriggerRect = this.rect(event.currentTarget instanceof HTMLElement ? event.currentTarget : null);
  }
  openMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.card.paymentMenuActions?.length)
      return;
    const trigger = event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
    this.menuTriggerRect = this.menuTriggerRect ?? this.rect(trigger);
    this.menuOpen = true;
    this.menuRequest.emit({
      id: `payment-card-menu-${this.card.id}`,
      kind: "select",
      title: this.resolvedBrandLabel(),
      items: this.card.paymentMenuActions.map((action) => ({
        id: action.id,
        label: action.label,
        icon: action.icon,
        palette: action.tone === "destructive" ? "danger" : action.tone === "warning" ? "amber" : "blue",
        context: { paymentMethodId: this.card.id, actionId: action.id }
      })),
      triggerRect: this.menuTriggerRect,
      panelAlign: "end",
      closeTrigger: () => {
        this.menuOpen = false;
        this.menuTriggerRect = null;
      }
    });
  }
  rect(element) {
    if (!element)
      return null;
    const value = element.getBoundingClientRect();
    return { left: value.left, top: value.top, right: value.right, bottom: value.bottom, width: value.width, height: value.height };
  }
  static \u0275fac = function PaymentCardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PaymentCardComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PaymentCardComponent, selectors: [["app-payment-card"]], inputs: { card: "card", selectable: "selectable", showMenu: "showMenu" }, outputs: { cardSelect: "cardSelect", menuRequest: "menuRequest" }, decls: 6, vars: 21, consts: [[1, "payment-card", 3, "click", "keydown", "appLazyBgImage"], [1, "payment-card__loader"], ["kind", "spinner-ring"], ["aria-hidden", "true", 1, "payment-card__shade"], [1, "payment-card__status", "payment-card__status--update-needed"], ["type", "button", 1, "payment-card__menu"], [1, "payment-card__selected"], [1, "payment-card__content"], [1, "payment-card__number"], [1, "payment-card__footer"], [1, "payment-card__brand"], ["type", "button", 1, "payment-card__status", "payment-card__status--expired", "payment-card__status--action"], [1, "payment-card__status", "payment-card__status--expired"], ["type", "button", 1, "payment-card__status", "payment-card__status--expired", "payment-card__status--action", 3, "pointerdown", "click"], ["aria-hidden", "true"], ["aria-hidden", "true", 1, "payment-card__status-chevron"], ["type", "button", 1, "payment-card__status", "payment-card__status--retokenize", "payment-card__status--action"], [1, "payment-card__status", "payment-card__status--retokenize"], ["type", "button", 1, "payment-card__status", "payment-card__status--retokenize", "payment-card__status--action", 3, "pointerdown", "click"], ["type", "button", 1, "payment-card__menu", 3, "pointerdown", "click"]], template: function PaymentCardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "article", 0);
      \u0275\u0275listener("click", function PaymentCardComponent_Template_article_click_0_listener($event) {
        return ctx.onSelect($event);
      })("keydown", function PaymentCardComponent_Template_article_keydown_0_listener($event) {
        return ctx.onKeydown($event);
      });
      \u0275\u0275elementStart(1, "span", 1);
      \u0275\u0275element(2, "app-indicator", 2);
      \u0275\u0275conditionalCreate(3, PaymentCardComponent_Conditional_3_Template, 3, 3, "strong");
      \u0275\u0275elementEnd();
      \u0275\u0275element(4, "span", 3);
      \u0275\u0275conditionalCreate(5, PaymentCardComponent_Conditional_5_Template, 23, 15);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275classProp("payment-card--selectable", ctx.selectable)("payment-card--selected", ctx.card.selected)("payment-card--disabled", ctx.card.disabled && !ctx.card.expired && !ctx.card.requiresRetokenization)("payment-card--expired", ctx.card.expired)("payment-card--retokenize", ctx.card.requiresRetokenization)("payment-card--pending", ctx.card.loading);
      \u0275\u0275property("appLazyBgImage", ctx.card.artworkUrl || null);
      \u0275\u0275attribute("role", ctx.selectable ? "button" : null)("tabindex", ctx.selectable && !ctx.card.disabled ? 0 : null)("aria-pressed", ctx.selectable ? ctx.card.selected === true : null)("data-motion", ctx.selectable ? "none" : null)("aria-label", ctx.ariaLabel());
      \u0275\u0275advance();
      \u0275\u0275attribute("aria-hidden", ctx.card.loading ? null : true);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.card.loadingLabel ? 3 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(!ctx.card.loading ? 5 : -1);
    }
  }, dependencies: [CommonModule, MatIconModule, MatIcon, LazyBgImageDirective, IndicatorComponent, I18nPipe], styles: ['\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n.payment-card[_ngcontent-%COMP%] {\n  position: relative;\n  isolation: isolate;\n  overflow: hidden;\n  width: 100%;\n  aspect-ratio: 1.586/1;\n  border: 1px solid rgba(255, 255, 255, 0.42);\n  border-radius: 1.05rem;\n  background: #1c3156 center/cover no-repeat;\n  background-size: 104% 104%;\n  color: #fff;\n  box-shadow: 0 0.8rem 1.8rem rgba(12, 25, 48, 0.2);\n}\n.payment-card--selectable[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n.payment-card--selectable[_ngcontent-%COMP%]:focus-visible {\n  outline: 3px solid #6aa6ff;\n  outline-offset: 3px;\n}\n.payment-card--disabled[_ngcontent-%COMP%] {\n  filter: saturate(0.82) brightness(1.12);\n  opacity: 0.76;\n  cursor: default;\n}\n.payment-card--expired[_ngcontent-%COMP%] {\n  cursor: default;\n}\n.payment-card--expired[_ngcontent-%COMP%]::after {\n  position: absolute;\n  z-index: 2;\n  inset: 0;\n  background: rgba(255, 255, 255, 0.58);\n  content: "";\n  pointer-events: none;\n}\n.payment-card--retokenize[_ngcontent-%COMP%] {\n  cursor: default;\n}\n.payment-card--retokenize[_ngcontent-%COMP%]::after {\n  position: absolute;\n  z-index: 2;\n  inset: 0;\n  background: rgba(255, 255, 255, 0.58);\n  content: "";\n  pointer-events: none;\n}\n.payment-card__shade[_ngcontent-%COMP%] {\n  position: absolute;\n  z-index: -1;\n  inset: 0;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(3, 10, 25, 0.08),\n      rgba(3, 10, 25, 0.42));\n}\n.payment-card__loader[_ngcontent-%COMP%] {\n  position: absolute;\n  z-index: 5;\n  inset: 0;\n  display: grid;\n  place-content: center;\n  justify-items: center;\n  gap: 0.65rem;\n  opacity: 0;\n  pointer-events: none;\n}\n.payment-card__loader[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.82rem;\n  letter-spacing: 0.02em;\n  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.55);\n}\n.payment-card.lazy-bg-loading[_ngcontent-%COMP%]   .payment-card__loader[_ngcontent-%COMP%] {\n  opacity: 1;\n}\n.payment-card.lazy-bg-loaded[_ngcontent-%COMP%]   .payment-card__loader[_ngcontent-%COMP%], \n.payment-card.lazy-bg-error[_ngcontent-%COMP%]   .payment-card__loader[_ngcontent-%COMP%] {\n  opacity: 0;\n}\n.payment-card--pending[_ngcontent-%COMP%] {\n  border-color: rgba(77, 126, 190, 0.34);\n  background:\n    linear-gradient(\n      135deg,\n      #6e87a8,\n      #344b6d);\n  box-shadow: 0 0.55rem 1.25rem rgba(12, 25, 48, 0.14);\n}\n.payment-card--pending[_ngcontent-%COMP%]   .payment-card__loader[_ngcontent-%COMP%], \n.payment-card--pending.lazy-bg-loaded[_ngcontent-%COMP%]   .payment-card__loader[_ngcontent-%COMP%], \n.payment-card--pending.lazy-bg-error[_ngcontent-%COMP%]   .payment-card__loader[_ngcontent-%COMP%] {\n  opacity: 1;\n}\n.payment-card__brand[_ngcontent-%COMP%] {\n  text-transform: uppercase;\n  letter-spacing: 0.1em;\n  font-size: clamp(0.62rem, 1.5vw, 0.78rem);\n  font-weight: 850;\n  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);\n}\n.payment-card__menu[_ngcontent-%COMP%] {\n  position: absolute;\n  z-index: 4;\n  top: 0.72rem;\n  right: 0.72rem;\n  width: 2.2rem;\n  height: 2.2rem;\n  display: grid;\n  place-items: center;\n  border: 1px solid rgba(255, 255, 255, 0.68);\n  border-radius: 50%;\n  background: rgba(7, 18, 38, 0.55);\n  color: #fff;\n  cursor: pointer;\n}\n.payment-card__menu[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 1.2rem;\n  height: 1.2rem;\n  font-size: 1.2rem;\n  line-height: 1.2rem;\n}\n.payment-card__selected[_ngcontent-%COMP%] {\n  position: absolute;\n  z-index: 3;\n  top: 0.72rem;\n  right: 0.72rem;\n  width: 2.2rem;\n  height: 2.2rem;\n  display: grid;\n  place-items: center;\n  border-radius: 50%;\n  background: #fff;\n  color: #1a5fb4;\n  box-shadow: 0 0.25rem 0.8rem rgba(0, 0, 0, 0.25);\n}\n.payment-card__status[_ngcontent-%COMP%] {\n  position: absolute;\n  z-index: 4;\n  top: 0.72rem;\n  right: 0.72rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  min-height: 2.2rem;\n  padding: 0.35rem 0.62rem;\n  border: 1px solid rgba(255, 255, 255, 0.74);\n  border-radius: 999px;\n  color: #fff;\n  font-size: 0.72rem;\n  font-weight: 850;\n  letter-spacing: 0.025em;\n  box-shadow: 0 0.25rem 0.8rem rgba(0, 0, 0, 0.24);\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);\n}\n.payment-card__status[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 1rem;\n  height: 1rem;\n  font-size: 1rem;\n  line-height: 1rem;\n}\n.payment-card__status[_ngcontent-%COMP%]   .payment-card__status-chevron[_ngcontent-%COMP%] {\n  margin-left: -0.12rem;\n}\n.payment-card__status--expired[_ngcontent-%COMP%] {\n  background: #d62839;\n}\n.payment-card__status--retokenize[_ngcontent-%COMP%], \n.payment-card__status--update-needed[_ngcontent-%COMP%] {\n  background: #2563b8;\n}\n.payment-card__status--action[_ngcontent-%COMP%] {\n  font: inherit;\n  cursor: pointer;\n  transition:\n    transform 0.14s ease,\n    background-color 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.payment-card__status--action[_ngcontent-%COMP%]:hover {\n  background: #ed3145;\n  box-shadow: 0 0.35rem 1rem rgba(160, 22, 40, 0.34);\n  transform: translateY(-1px);\n}\n.payment-card__status--retokenize.payment-card__status--action[_ngcontent-%COMP%]:hover {\n  background: #1d4f96;\n  box-shadow: 0 0.35rem 1rem rgba(29, 79, 150, 0.34);\n}\n.payment-card__status--action[_ngcontent-%COMP%]:focus-visible {\n  outline: 3px solid rgba(255, 255, 255, 0.96);\n  outline-offset: 2px;\n}\n.payment-card__content[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: auto 1.25rem 1.1rem;\n  display: grid;\n  gap: 0.8rem;\n  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.68);\n}\n.payment-card__number[_ngcontent-%COMP%] {\n  font:\n    760 clamp(0.9rem, 3.2vw, 1.4rem) ui-monospace,\n    SFMono-Regular,\n    Menlo,\n    monospace;\n  letter-spacing: 0.065em;\n  white-space: nowrap;\n}\n.payment-card__footer[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr auto;\n  gap: 1rem;\n  align-items: end;\n}\n.payment-card__footer[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: grid;\n  min-width: 0;\n  gap: 0.12rem;\n}\n.payment-card__footer[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.76);\n  font-size: clamp(0.48rem, 1.2vw, 0.6rem);\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.09em;\n}\n.payment-card__footer[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  overflow: hidden;\n  font-size: clamp(0.64rem, 1.8vw, 0.82rem);\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.payment-card__brand[_ngcontent-%COMP%] {\n  justify-self: end;\n}\n@media (max-width: 520px) {\n  .payment-card__content[_ngcontent-%COMP%] {\n    inset: auto 1rem 0.82rem;\n    gap: 0.55rem;\n  }\n}\n/*# sourceMappingURL=payment-card.component.css.map */'], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PaymentCardComponent, [{
    type: Component,
    args: [{ selector: "app-payment-card", standalone: true, imports: [CommonModule, MatIconModule, LazyBgImageDirective, IndicatorComponent, I18nPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `<article
  class="payment-card"
  [class.payment-card--selectable]="selectable"
  [class.payment-card--selected]="card.selected"
  [class.payment-card--disabled]="card.disabled && !card.expired && !card.requiresRetokenization"
  [class.payment-card--expired]="card.expired"
  [class.payment-card--retokenize]="card.requiresRetokenization"
  [class.payment-card--pending]="card.loading"
  [attr.role]="selectable ? 'button' : null"
  [attr.tabindex]="selectable && !card.disabled ? 0 : null"
  [attr.aria-pressed]="selectable ? (card.selected === true) : null"
  [attr.data-motion]="selectable ? 'none' : null"
  [attr.aria-label]="ariaLabel()"
  [appLazyBgImage]="card.artworkUrl || null"
  (click)="onSelect($event)"
  (keydown)="onKeydown($event)"
>
  <span class="payment-card__loader" [attr.aria-hidden]="card.loading ? null : true">
    <app-indicator kind="spinner-ring"></app-indicator>
    @if (card.loadingLabel) { <strong>{{ card.loadingLabel | i18n }}</strong> }
  </span>
  <span class="payment-card__shade" aria-hidden="true"></span>
  @if (!card.loading) {
  @if (card.expired) {
    @if (showMenu && (card.paymentMenuActions?.length ?? 0) > 0) {
    <button
      type="button"
      class="payment-card__status payment-card__status--expired payment-card__status--action"
      [attr.aria-label]="'payment.card.actions.open' | i18n"
      (pointerdown)="captureMenuRect($event)"
      (click)="openMenu($event)"
    >
      <mat-icon aria-hidden="true">event_busy</mat-icon>
      {{ 'payment.card.expired' | i18n }}
      <mat-icon class="payment-card__status-chevron" aria-hidden="true">chevron_right</mat-icon>
    </button>
    } @else {
      <span class="payment-card__status payment-card__status--expired">
        <mat-icon aria-hidden="true">event_busy</mat-icon>
        {{ 'payment.card.expired' | i18n }}
      </span>
    }
  }
  @if (!card.expired && card.requiresRetokenization) {
    @if (showMenu && (card.paymentMenuActions?.length ?? 0) > 0) {
    <button
      type="button"
      class="payment-card__status payment-card__status--retokenize payment-card__status--action"
      [attr.aria-label]="'payment.card.actions.open' | i18n"
      (pointerdown)="captureMenuRect($event)"
      (click)="openMenu($event)"
    >
      <mat-icon aria-hidden="true">published_with_changes</mat-icon>
      {{ 'payment.card.reconnect' | i18n }}
      <mat-icon class="payment-card__status-chevron" aria-hidden="true">chevron_right</mat-icon>
    </button>
    } @else {
      <span class="payment-card__status payment-card__status--retokenize">
        <mat-icon aria-hidden="true">published_with_changes</mat-icon>
        {{ 'payment.card.reconnect' | i18n }}
      </span>
    }
  }
  @if (!card.expired && !card.requiresRetokenization && card.updateNeeded) {
    <span class="payment-card__status payment-card__status--update-needed">
      <mat-icon aria-hidden="true">published_with_changes</mat-icon>
      {{ 'payment.card.update.needed' | i18n }}
    </span>
  }
  @if (!card.expired && !card.requiresRetokenization && !card.updateNeeded && showMenu && (card.paymentMenuActions?.length ?? 0) > 0) {
    <button
      type="button"
      class="payment-card__menu"
      [attr.aria-label]="'payment.card.actions.open' | i18n"
      (pointerdown)="captureMenuRect($event)"
      (click)="openMenu($event)"
    ><mat-icon>more_vert</mat-icon></button>
  }

  @if (card.selected) {
    <span class="payment-card__selected" [attr.aria-label]="'payment.card.selected' | i18n"><mat-icon>check</mat-icon></span>
  }

  <div class="payment-card__content">
    <span class="payment-card__number">{{ maskedNumber() }}</span>
    <div class="payment-card__footer">
      <span><small>{{ 'payment.card.cardholder' | i18n }}</small><strong>{{ card.cardholderName }}</strong></span>
      <span><small>{{ 'payment.card.expires' | i18n }}</small><strong>{{ expiry() }}</strong></span>
    </div>
    <span class="payment-card__brand">{{ resolvedBrandLabel() }}</span>
  </div>
  }
</article>
`, styles: ['/* src/app/shared/ui/components/core/smart-list/card/payment-card/payment-card.component.scss */\n:host {\n  display: block;\n  min-width: 0;\n}\n.payment-card {\n  position: relative;\n  isolation: isolate;\n  overflow: hidden;\n  width: 100%;\n  aspect-ratio: 1.586/1;\n  border: 1px solid rgba(255, 255, 255, 0.42);\n  border-radius: 1.05rem;\n  background: #1c3156 center/cover no-repeat;\n  background-size: 104% 104%;\n  color: #fff;\n  box-shadow: 0 0.8rem 1.8rem rgba(12, 25, 48, 0.2);\n}\n.payment-card--selectable {\n  cursor: pointer;\n}\n.payment-card--selectable:focus-visible {\n  outline: 3px solid #6aa6ff;\n  outline-offset: 3px;\n}\n.payment-card--disabled {\n  filter: saturate(0.82) brightness(1.12);\n  opacity: 0.76;\n  cursor: default;\n}\n.payment-card--expired {\n  cursor: default;\n}\n.payment-card--expired::after {\n  position: absolute;\n  z-index: 2;\n  inset: 0;\n  background: rgba(255, 255, 255, 0.58);\n  content: "";\n  pointer-events: none;\n}\n.payment-card--retokenize {\n  cursor: default;\n}\n.payment-card--retokenize::after {\n  position: absolute;\n  z-index: 2;\n  inset: 0;\n  background: rgba(255, 255, 255, 0.58);\n  content: "";\n  pointer-events: none;\n}\n.payment-card__shade {\n  position: absolute;\n  z-index: -1;\n  inset: 0;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(3, 10, 25, 0.08),\n      rgba(3, 10, 25, 0.42));\n}\n.payment-card__loader {\n  position: absolute;\n  z-index: 5;\n  inset: 0;\n  display: grid;\n  place-content: center;\n  justify-items: center;\n  gap: 0.65rem;\n  opacity: 0;\n  pointer-events: none;\n}\n.payment-card__loader strong {\n  font-size: 0.82rem;\n  letter-spacing: 0.02em;\n  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.55);\n}\n.payment-card.lazy-bg-loading .payment-card__loader {\n  opacity: 1;\n}\n.payment-card.lazy-bg-loaded .payment-card__loader,\n.payment-card.lazy-bg-error .payment-card__loader {\n  opacity: 0;\n}\n.payment-card--pending {\n  border-color: rgba(77, 126, 190, 0.34);\n  background:\n    linear-gradient(\n      135deg,\n      #6e87a8,\n      #344b6d);\n  box-shadow: 0 0.55rem 1.25rem rgba(12, 25, 48, 0.14);\n}\n.payment-card--pending .payment-card__loader,\n.payment-card--pending.lazy-bg-loaded .payment-card__loader,\n.payment-card--pending.lazy-bg-error .payment-card__loader {\n  opacity: 1;\n}\n.payment-card__brand {\n  text-transform: uppercase;\n  letter-spacing: 0.1em;\n  font-size: clamp(0.62rem, 1.5vw, 0.78rem);\n  font-weight: 850;\n  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);\n}\n.payment-card__menu {\n  position: absolute;\n  z-index: 4;\n  top: 0.72rem;\n  right: 0.72rem;\n  width: 2.2rem;\n  height: 2.2rem;\n  display: grid;\n  place-items: center;\n  border: 1px solid rgba(255, 255, 255, 0.68);\n  border-radius: 50%;\n  background: rgba(7, 18, 38, 0.55);\n  color: #fff;\n  cursor: pointer;\n}\n.payment-card__menu mat-icon {\n  width: 1.2rem;\n  height: 1.2rem;\n  font-size: 1.2rem;\n  line-height: 1.2rem;\n}\n.payment-card__selected {\n  position: absolute;\n  z-index: 3;\n  top: 0.72rem;\n  right: 0.72rem;\n  width: 2.2rem;\n  height: 2.2rem;\n  display: grid;\n  place-items: center;\n  border-radius: 50%;\n  background: #fff;\n  color: #1a5fb4;\n  box-shadow: 0 0.25rem 0.8rem rgba(0, 0, 0, 0.25);\n}\n.payment-card__status {\n  position: absolute;\n  z-index: 4;\n  top: 0.72rem;\n  right: 0.72rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  min-height: 2.2rem;\n  padding: 0.35rem 0.62rem;\n  border: 1px solid rgba(255, 255, 255, 0.74);\n  border-radius: 999px;\n  color: #fff;\n  font-size: 0.72rem;\n  font-weight: 850;\n  letter-spacing: 0.025em;\n  box-shadow: 0 0.25rem 0.8rem rgba(0, 0, 0, 0.24);\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);\n}\n.payment-card__status mat-icon {\n  width: 1rem;\n  height: 1rem;\n  font-size: 1rem;\n  line-height: 1rem;\n}\n.payment-card__status .payment-card__status-chevron {\n  margin-left: -0.12rem;\n}\n.payment-card__status--expired {\n  background: #d62839;\n}\n.payment-card__status--retokenize,\n.payment-card__status--update-needed {\n  background: #2563b8;\n}\n.payment-card__status--action {\n  font: inherit;\n  cursor: pointer;\n  transition:\n    transform 0.14s ease,\n    background-color 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.payment-card__status--action:hover {\n  background: #ed3145;\n  box-shadow: 0 0.35rem 1rem rgba(160, 22, 40, 0.34);\n  transform: translateY(-1px);\n}\n.payment-card__status--retokenize.payment-card__status--action:hover {\n  background: #1d4f96;\n  box-shadow: 0 0.35rem 1rem rgba(29, 79, 150, 0.34);\n}\n.payment-card__status--action:focus-visible {\n  outline: 3px solid rgba(255, 255, 255, 0.96);\n  outline-offset: 2px;\n}\n.payment-card__content {\n  position: absolute;\n  inset: auto 1.25rem 1.1rem;\n  display: grid;\n  gap: 0.8rem;\n  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.68);\n}\n.payment-card__number {\n  font:\n    760 clamp(0.9rem, 3.2vw, 1.4rem) ui-monospace,\n    SFMono-Regular,\n    Menlo,\n    monospace;\n  letter-spacing: 0.065em;\n  white-space: nowrap;\n}\n.payment-card__footer {\n  display: grid;\n  grid-template-columns: 1fr auto;\n  gap: 1rem;\n  align-items: end;\n}\n.payment-card__footer span {\n  display: grid;\n  min-width: 0;\n  gap: 0.12rem;\n}\n.payment-card__footer small {\n  color: rgba(255, 255, 255, 0.76);\n  font-size: clamp(0.48rem, 1.2vw, 0.6rem);\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.09em;\n}\n.payment-card__footer strong {\n  overflow: hidden;\n  font-size: clamp(0.64rem, 1.8vw, 0.82rem);\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.payment-card__brand {\n  justify-self: end;\n}\n@media (max-width: 520px) {\n  .payment-card__content {\n    inset: auto 1rem 0.82rem;\n    gap: 0.55rem;\n  }\n}\n/*# sourceMappingURL=payment-card.component.css.map */\n'] }]
  }], null, { card: [{
    type: Input,
    args: [{ required: true }]
  }], selectable: [{
    type: Input
  }], showMenu: [{
    type: Input
  }], cardSelect: [{
    type: Output
  }], menuRequest: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PaymentCardComponent, { className: "PaymentCardComponent", filePath: "app/shared/ui/components/core/smart-list/card/payment-card/payment-card.component.ts", lineNumber: 30 });
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
    \u0275\u0275elementStart(11, "div", 4)(12, "div", 5)(13, "span", 6);
    \u0275\u0275element(14, "app-indicator", 7);
    \u0275\u0275elementEnd()()()();
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
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _WarpImageCardComponent, selectors: [["app-warp-image-card"]], inputs: { card: "card" }, decls: 1, vars: 1, consts: [[3, "ngClass"], [1, "ui-warp-image-card__headline"], [1, "ui-warp-image-card__index"], [1, "ui-warp-image-card__copy"], ["aria-hidden", "true", 1, "ui-warp-image-card__visual", 3, "ngStyle"], ["appLazyBgImage", "assets/logo/cards_no_edges.png", 1, "ui-warp-image-card__visual-image"], [1, "ui-warp-image-card__image-loader"], ["kind", "spinner-ring", "size", "sm"]], template: function WarpImageCardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, WarpImageCardComponent_Conditional_0_Template, 15, 11, "article", 0);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.card ? 0 : -1);
    }
  }, dependencies: [
    CommonModule,
    NgClass,
    NgStyle,
    LazyBgImageDirective,
    IndicatorComponent,
    I18nPipe
  ], styles: ['\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n  width: 100%;\n}\n.ui-warp-image-card[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  min-width: 0;\n  height: 100%;\n  box-sizing: border-box;\n  border: 2px solid color-mix(in srgb, var(--deployment-card-blue, #3e7de5) 30%, transparent);\n  border-radius: 26px;\n  background: var(--deployment-card-background, linear-gradient(180deg, #eef5ff 0%, #ffffff 100%));\n  box-shadow: 0 8px 18px color-mix(in srgb, var(--deployment-brand-shadow, rgba(21, 42, 79, 0.2)) 25%, transparent);\n}\n.ui-warp-image-card[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  height: 3px;\n  background: var(--deployment-card-blue, #3d85e7);\n}\n.ui-warp-image-card__headline[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  padding: 0.78rem 0.9rem 0.16rem;\n  display: flex;\n  align-items: flex-start;\n  gap: 0.52rem;\n}\n.ui-warp-image-card__index[_ngcontent-%COMP%] {\n  min-width: 42px;\n  min-height: 42px;\n  border-radius: 12px;\n  padding: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 1.12rem;\n  font-weight: 800;\n  line-height: 1;\n  letter-spacing: 0.01em;\n  color: var(--deployment-card-blue, #2f76d8);\n  background: color-mix(in srgb, var(--deployment-card-blue, #2f76d8) 13%, #ffffff);\n}\n.ui-warp-image-card__copy[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.ui-warp-image-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--deployment-text-main, #1a3d6f);\n  font-size: clamp(1.04rem, 1.28vw, 1.28rem);\n  line-height: 1.14;\n  letter-spacing: 0;\n  font-weight: 780;\n  text-wrap: balance;\n  overflow-wrap: normal;\n}\n.ui-warp-image-card__copy[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.24rem 0 0;\n  color: var(--deployment-text-muted, #3a3f6c);\n  font-size: clamp(0.74rem, 0.9vw, 0.86rem);\n  line-height: 1.28;\n  font-weight: 600;\n}\n.ui-warp-image-card__visual[_ngcontent-%COMP%] {\n  position: relative;\n  margin-top: auto;\n  flex: 0 0 auto;\n  height: 178px;\n  border-top: 1px solid rgba(63, 86, 131, 0.08);\n  overflow: hidden;\n  background: #f4f7ff;\n}\n.ui-warp-image-card__visual-image[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  background-repeat: no-repeat;\n  background-size: 200% 200%;\n  background-position: var(--warp-image-slice-x, 0%) var(--warp-image-slice-y, 0%);\n}\n.ui-warp-image-card__image-loader[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  display: none;\n  place-items: center;\n  pointer-events: none;\n}\n.lazy-bg-loading[_ngcontent-%COMP%]    > .ui-warp-image-card__image-loader[_ngcontent-%COMP%] {\n  display: grid;\n}\n.ui-warp-image-card__visual[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  height: 9px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0),\n      #ffffff 72%);\n  pointer-events: none;\n}\n.ui-warp-image-card--purple[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      color-mix(in srgb, var(--deployment-card-purple, #785ae4) 12%, #ffffff) 0%,\n      #ffffff 100%);\n  border-color: color-mix(in srgb, var(--deployment-card-purple, #785ae4) 30%, transparent);\n}\n.ui-warp-image-card--purple[_ngcontent-%COMP%]::before {\n  background: var(--deployment-card-purple, #6752dd);\n}\n.ui-warp-image-card--purple[_ngcontent-%COMP%]   .ui-warp-image-card__index[_ngcontent-%COMP%] {\n  color: var(--deployment-card-purple, #6848d1);\n  background: color-mix(in srgb, var(--deployment-card-purple, #6848d1) 13%, #ffffff);\n}\n.ui-warp-image-card--pink[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      color-mix(in srgb, var(--deployment-card-pink, #e253a8) 12%, #ffffff) 0%,\n      #ffffff 100%);\n  border-color: color-mix(in srgb, var(--deployment-card-pink, #e253a8) 30%, transparent);\n}\n.ui-warp-image-card--pink[_ngcontent-%COMP%]::before {\n  background: var(--deployment-card-pink, #db4ea8);\n}\n.ui-warp-image-card--pink[_ngcontent-%COMP%]   .ui-warp-image-card__index[_ngcontent-%COMP%] {\n  color: var(--deployment-card-pink, #d14699);\n  background: color-mix(in srgb, var(--deployment-card-pink, #d14699) 13%, #ffffff);\n}\n.ui-warp-image-card--orange[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      color-mix(in srgb, var(--deployment-card-orange, #ef6c4a) 12%, #ffffff) 0%,\n      #ffffff 100%);\n  border-color: color-mix(in srgb, var(--deployment-card-orange, #ef6c4a) 30%, transparent);\n}\n.ui-warp-image-card--orange[_ngcontent-%COMP%]::before {\n  background: var(--deployment-card-orange, #eb6745);\n}\n.ui-warp-image-card--orange[_ngcontent-%COMP%]   .ui-warp-image-card__index[_ngcontent-%COMP%] {\n  color: var(--deployment-card-orange, #dc5b3c);\n  background: color-mix(in srgb, var(--deployment-card-orange, #dc5b3c) 13%, #ffffff);\n}\n@media (max-width: 760px) {\n  .ui-warp-image-card[_ngcontent-%COMP%] {\n    border-radius: 24px;\n  }\n  .ui-warp-image-card__visual[_ngcontent-%COMP%] {\n    height: 162px;\n  }\n  .ui-warp-image-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n    font-size: clamp(1.04rem, 4.8vw, 1.16rem);\n    line-height: 1.16;\n  }\n  .ui-warp-image-card__copy[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n    font-size: clamp(0.82rem, 3.3vw, 0.94rem);\n    line-height: 1.28;\n  }\n  .ui-warp-image-card__index[_ngcontent-%COMP%] {\n    min-width: 42px;\n    min-height: 42px;\n    font-size: 1.06rem;\n  }\n}\n/*# sourceMappingURL=warp-image-card.component.css.map */'], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WarpImageCardComponent, [{
    type: Component,
    args: [{ selector: "app-warp-image-card", standalone: true, imports: [
      CommonModule,
      I18nPipe,
      LazyBgImageDirective,
      IndicatorComponent
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: '@if (card) {\n  <article [ngClass]="rootClassList()">\n    <div class="ui-warp-image-card__headline">\n      <span class="ui-warp-image-card__index">{{ card.index }}</span>\n      <div class="ui-warp-image-card__copy">\n        <h3>{{ card.titleKey | i18n: card.title }}</h3>\n        <p>{{ card.messageKey | i18n: card.message }}</p>\n      </div>\n    </div>\n    <div class="ui-warp-image-card__visual" [ngStyle]="visualStyle()" aria-hidden="true">\n      <div class="ui-warp-image-card__visual-image" appLazyBgImage="assets/logo/cards_no_edges.png">\n        <span class="ui-warp-image-card__image-loader">\n          <app-indicator kind="spinner-ring" size="sm"></app-indicator>\n        </span>\n      </div>\n    </div>\n  </article>\n}\n', styles: ['/* src/app/shared/ui/components/core/smart-list/card/warp-image-card/warp-image-card.component.scss */\n:host {\n  display: block;\n  min-width: 0;\n  width: 100%;\n}\n.ui-warp-image-card {\n  position: relative;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  min-width: 0;\n  height: 100%;\n  box-sizing: border-box;\n  border: 2px solid color-mix(in srgb, var(--deployment-card-blue, #3e7de5) 30%, transparent);\n  border-radius: 26px;\n  background: var(--deployment-card-background, linear-gradient(180deg, #eef5ff 0%, #ffffff 100%));\n  box-shadow: 0 8px 18px color-mix(in srgb, var(--deployment-brand-shadow, rgba(21, 42, 79, 0.2)) 25%, transparent);\n}\n.ui-warp-image-card::before {\n  content: "";\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  height: 3px;\n  background: var(--deployment-card-blue, #3d85e7);\n}\n.ui-warp-image-card__headline {\n  box-sizing: border-box;\n  padding: 0.78rem 0.9rem 0.16rem;\n  display: flex;\n  align-items: flex-start;\n  gap: 0.52rem;\n}\n.ui-warp-image-card__index {\n  min-width: 42px;\n  min-height: 42px;\n  border-radius: 12px;\n  padding: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 1.12rem;\n  font-weight: 800;\n  line-height: 1;\n  letter-spacing: 0.01em;\n  color: var(--deployment-card-blue, #2f76d8);\n  background: color-mix(in srgb, var(--deployment-card-blue, #2f76d8) 13%, #ffffff);\n}\n.ui-warp-image-card__copy {\n  min-width: 0;\n}\n.ui-warp-image-card h3 {\n  margin: 0;\n  color: var(--deployment-text-main, #1a3d6f);\n  font-size: clamp(1.04rem, 1.28vw, 1.28rem);\n  line-height: 1.14;\n  letter-spacing: 0;\n  font-weight: 780;\n  text-wrap: balance;\n  overflow-wrap: normal;\n}\n.ui-warp-image-card__copy p {\n  margin: 0.24rem 0 0;\n  color: var(--deployment-text-muted, #3a3f6c);\n  font-size: clamp(0.74rem, 0.9vw, 0.86rem);\n  line-height: 1.28;\n  font-weight: 600;\n}\n.ui-warp-image-card__visual {\n  position: relative;\n  margin-top: auto;\n  flex: 0 0 auto;\n  height: 178px;\n  border-top: 1px solid rgba(63, 86, 131, 0.08);\n  overflow: hidden;\n  background: #f4f7ff;\n}\n.ui-warp-image-card__visual-image {\n  position: absolute;\n  inset: 0;\n  background-repeat: no-repeat;\n  background-size: 200% 200%;\n  background-position: var(--warp-image-slice-x, 0%) var(--warp-image-slice-y, 0%);\n}\n.ui-warp-image-card__image-loader {\n  position: absolute;\n  inset: 0;\n  display: none;\n  place-items: center;\n  pointer-events: none;\n}\n.lazy-bg-loading > .ui-warp-image-card__image-loader {\n  display: grid;\n}\n.ui-warp-image-card__visual::after {\n  content: "";\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  height: 9px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0),\n      #ffffff 72%);\n  pointer-events: none;\n}\n.ui-warp-image-card--purple {\n  background:\n    linear-gradient(\n      180deg,\n      color-mix(in srgb, var(--deployment-card-purple, #785ae4) 12%, #ffffff) 0%,\n      #ffffff 100%);\n  border-color: color-mix(in srgb, var(--deployment-card-purple, #785ae4) 30%, transparent);\n}\n.ui-warp-image-card--purple::before {\n  background: var(--deployment-card-purple, #6752dd);\n}\n.ui-warp-image-card--purple .ui-warp-image-card__index {\n  color: var(--deployment-card-purple, #6848d1);\n  background: color-mix(in srgb, var(--deployment-card-purple, #6848d1) 13%, #ffffff);\n}\n.ui-warp-image-card--pink {\n  background:\n    linear-gradient(\n      180deg,\n      color-mix(in srgb, var(--deployment-card-pink, #e253a8) 12%, #ffffff) 0%,\n      #ffffff 100%);\n  border-color: color-mix(in srgb, var(--deployment-card-pink, #e253a8) 30%, transparent);\n}\n.ui-warp-image-card--pink::before {\n  background: var(--deployment-card-pink, #db4ea8);\n}\n.ui-warp-image-card--pink .ui-warp-image-card__index {\n  color: var(--deployment-card-pink, #d14699);\n  background: color-mix(in srgb, var(--deployment-card-pink, #d14699) 13%, #ffffff);\n}\n.ui-warp-image-card--orange {\n  background:\n    linear-gradient(\n      180deg,\n      color-mix(in srgb, var(--deployment-card-orange, #ef6c4a) 12%, #ffffff) 0%,\n      #ffffff 100%);\n  border-color: color-mix(in srgb, var(--deployment-card-orange, #ef6c4a) 30%, transparent);\n}\n.ui-warp-image-card--orange::before {\n  background: var(--deployment-card-orange, #eb6745);\n}\n.ui-warp-image-card--orange .ui-warp-image-card__index {\n  color: var(--deployment-card-orange, #dc5b3c);\n  background: color-mix(in srgb, var(--deployment-card-orange, #dc5b3c) 13%, #ffffff);\n}\n@media (max-width: 760px) {\n  .ui-warp-image-card {\n    border-radius: 24px;\n  }\n  .ui-warp-image-card__visual {\n    height: 162px;\n  }\n  .ui-warp-image-card h3 {\n    font-size: clamp(1.04rem, 4.8vw, 1.16rem);\n    line-height: 1.16;\n  }\n  .ui-warp-image-card__copy p {\n    font-size: clamp(0.82rem, 3.3vw, 0.94rem);\n    line-height: 1.28;\n  }\n  .ui-warp-image-card__index {\n    min-width: 42px;\n    min-height: 42px;\n    font-size: 1.06rem;\n  }\n}\n/*# sourceMappingURL=warp-image-card.component.css.map */\n'] }]
  }], null, { card: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(WarpImageCardComponent, { className: "WarpImageCardComponent", filePath: "app/shared/ui/components/core/smart-list/card/warp-image-card/warp-image-card.component.ts", lineNumber: 35 });
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
  SingleRowComponent,
  ImageCardComponent,
  PaymentCardComponent,
  WarpImageCardComponent,
  TextCardComponent,
  buildSingleRateCardData,
  buildPairRateCardData
};
//# sourceMappingURL=chunk-7FJOOQKP.js.map
