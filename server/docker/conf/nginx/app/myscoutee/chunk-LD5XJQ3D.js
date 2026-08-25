import {
  TextCardComponent
} from "./chunk-CHNSKMNQ.js";
import {
  AppMenuComponent,
  I18nPipe
} from "./chunk-FOAFZS65.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-EDHGCWPF.js";
import {
  CommonModule
} from "./chunk-J7IJFFQ2.js";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵcomponentInstance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate2
} from "./chunk-XJL7SWH7.js";

// src/app/activity/components/event-editor-popup/event-basket-input/event-basket-input.component.ts
var _forTrack0 = ($index, $item) => $item.key || $item.label;
function EventBasketInputComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 5);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r0.subtitle));
  }
}
function EventBasketInputComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 6)(1, "app-menu", 11);
    \u0275\u0275listener("itemSelect", function EventBasketInputComponent_Conditional_11_Template_app_menu_itemSelect_1_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onAddSelect($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("items", ctx_r0.addMenuItems());
  }
}
function EventBasketInputComponent_Conditional_13_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.contextTitle);
  }
}
function EventBasketInputComponent_Conditional_13_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.contextMeta);
  }
}
function EventBasketInputComponent_Conditional_13_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.contextDetail);
  }
}
function EventBasketInputComponent_Conditional_13_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.contextAmountLabel());
  }
}
function EventBasketInputComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 8)(1, "div");
    \u0275\u0275conditionalCreate(2, EventBasketInputComponent_Conditional_13_Conditional_2_Template, 2, 1, "strong");
    \u0275\u0275conditionalCreate(3, EventBasketInputComponent_Conditional_13_Conditional_3_Template, 2, 1, "span");
    \u0275\u0275conditionalCreate(4, EventBasketInputComponent_Conditional_13_Conditional_4_Template, 2, 1, "small");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, EventBasketInputComponent_Conditional_13_Conditional_5_Template, 2, 1, "strong");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.contextTitle ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.contextMeta ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.contextDetail ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.contextAmountLabel() ? 5 : -1);
  }
}
function EventBasketInputComponent_Conditional_14_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 3, "event.editor.basket.selected.items"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", ctx_r0.items.length, " ", \u0275\u0275pipeBind1(6, 5, ctx_r0.items.length === 1 ? "item" : "items"));
  }
}
function EventBasketInputComponent_Conditional_14_For_3_Conditional_0_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r3 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.itemDetail(item_r3));
  }
}
function EventBasketInputComponent_Conditional_14_For_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 14)(1, "div")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, EventBasketInputComponent_Conditional_14_For_3_Conditional_0_Conditional_6_Template, 2, 1, "small");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "strong");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r3 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r3.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r3.meta);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.itemDetail(item_r3) ? 6 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.itemAmountLabel(item_r3));
  }
}
function EventBasketInputComponent_Conditional_14_For_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-text-card", 16);
    \u0275\u0275listener("menuSelect", function EventBasketInputComponent_Conditional_14_For_3_Conditional_1_Template_app_text_card_menuSelect_0_listener($event) {
      \u0275\u0275restoreView(_r4);
      const item_r3 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.onItemMenuSelect(item_r3, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r3 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("tone", ctx_r0.itemTone(item_r3))("title", item_r3.title)("subtitle", ctx_r0.itemSubtitle(item_r3))("meta", item_r3.meta)("detail", ctx_r0.itemDetail(item_r3))("menuTitle", item_r3.title)("menuPalette", ctx_r0.itemMenuPalette(item_r3))("menuItems", ctx_r0.itemMenuItems());
  }
}
function EventBasketInputComponent_Conditional_14_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, EventBasketInputComponent_Conditional_14_For_3_Conditional_0_Template, 9, 4, "article", 14)(1, EventBasketInputComponent_Conditional_14_For_3_Conditional_1_Template, 1, 8, "app-text-card", 15);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(ctx_r0.readOnly ? 0 : 1);
  }
}
function EventBasketInputComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, EventBasketInputComponent_Conditional_14_Conditional_0_Template, 7, 7, "div", 12);
    \u0275\u0275elementStart(1, "div", 13);
    \u0275\u0275repeaterCreate(2, EventBasketInputComponent_Conditional_14_For_3_Template, 2, 1, null, null, \u0275\u0275componentInstance().itemTrackId, true);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r0.readOnly ? 0 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.items);
  }
}
function EventBasketInputComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r0.emptyLabel));
  }
}
function EventBasketInputComponent_Conditional_16_For_9_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, row_r5.detail));
  }
}
function EventBasketInputComponent_Conditional_16_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18)(1, "span", 21)(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, EventBasketInputComponent_Conditional_16_For_9_Conditional_5_Template, 3, 3, "small");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "strong");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r5 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 3, row_r5.label));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(row_r5.detail ? 5 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.pricingSummaryAmountLabel(row_r5));
  }
}
function EventBasketInputComponent_Conditional_16_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 19);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "event.editor.basket.no.selected.items"));
  }
}
function EventBasketInputComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 10);
    \u0275\u0275pipe(1, "i18n");
    \u0275\u0275elementStart(2, "div", 17)(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "mat-icon");
    \u0275\u0275text(7, "price_check");
    \u0275\u0275elementEnd()();
    \u0275\u0275repeaterCreate(8, EventBasketInputComponent_Conditional_16_For_9_Template, 8, 5, "div", 18, _forTrack0);
    \u0275\u0275conditionalCreate(10, EventBasketInputComponent_Conditional_16_Conditional_10_Template, 3, 3, "p", 19);
    \u0275\u0275elementStart(11, "div", 20)(12, "span");
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "strong");
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(1, 5, "event.editor.pricing.current.review"));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 7, "event.editor.pricing.current.review"));
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r0.visiblePricingSummaryRows());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.visiblePricingSummaryRows().length === 0 ? 10 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(14, 9, "event.editor.pricing.final.price"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.pricingSummaryTotalLabel());
  }
}
var EventBasketInputComponent = class _EventBasketInputComponent {
  title = "event.editor.basket.title";
  subtitle = "event.editor.basket.selected.items.subtitle";
  contextTitle = "";
  contextMeta = "";
  contextDetail = "";
  contextAmount = null;
  items = [];
  pricingSummaryRows = [];
  totalAmount = 0;
  currency = "USD";
  addDisabled = false;
  readOnly = false;
  showAdd = true;
  showItemMenu = true;
  showPricingSummary = false;
  addIcon = "edit";
  addAriaLabel = "event.editor.basket.edit.aria";
  emptyLabel = "event.editor.basket.empty";
  tone = "neutral";
  addSelect = new EventEmitter();
  itemMenuSelect = new EventEmitter();
  addMenuItems() {
    return [{
      id: "add",
      icon: this.addIcon,
      ariaLabel: this.addAriaLabel,
      palette: "amber",
      layout: "action",
      disabled: this.addDisabled
    }];
  }
  onAddSelect(event) {
    event.sourceEvent.preventDefault();
    event.sourceEvent.stopPropagation();
    if (event.id !== "add" || this.readOnly || this.addDisabled) {
      return;
    }
    this.addSelect.emit(event.sourceEvent);
  }
  itemTrackId(_index, item) {
    return item.id;
  }
  itemTone(item) {
    if (item.status === "pay") {
      return "violet";
    }
    if (item.status === "waiting") {
      return "amber";
    }
    if (item.status === "confirmed") {
      return "slot";
    }
    return "slot";
  }
  itemMenuPalette(item) {
    return item.status === "pay" ? "violet" : item.status === "waiting" ? "amber" : "blue";
  }
  itemMenuItems() {
    if (this.readOnly || !this.showItemMenu) {
      return [];
    }
    return [
      {
        id: "view",
        label: "view",
        icon: "visibility",
        palette: "teal",
        surface: "tinted"
      },
      {
        id: "remove",
        label: "remove",
        icon: "delete",
        palette: "danger",
        surface: "tinted"
      }
    ];
  }
  onItemMenuSelect(item, menuEvent) {
    if (this.readOnly || !this.showItemMenu) {
      return;
    }
    this.itemMenuSelect.emit({ item, menuEvent });
  }
  itemSubtitle(item) {
    const quantity = this.itemQuantity(item);
    const status = item.status === "pay" ? "paid" : item.status === "waiting" ? "waiting.list" : item.status === "confirmed" ? "confirmed" : "";
    if (!status) {
      return quantity > 1 ? `${quantity} items` : "";
    }
    return quantity > 1 ? `${status} \xB7 ${quantity} items` : status;
  }
  itemDetail(item) {
    return item.detail?.trim() || "";
  }
  itemQuantity(item) {
    return Math.max(1, Math.trunc(Number(item.quantity) || 1));
  }
  hasContext() {
    return Boolean(this.contextTitle?.trim() || this.contextMeta?.trim() || this.contextDetail?.trim());
  }
  contextAmountLabel() {
    return Number.isFinite(this.contextAmount) ? this.formatMoney(Number(this.contextAmount), this.currency) : "";
  }
  itemAmountLabel(item) {
    const quantity = this.itemQuantity(item);
    const amount = (Number(item.amount) || 0) * quantity;
    return amount > 0 ? this.formatMoney(amount, item.currency || this.currency) : "included";
  }
  visiblePricingSummaryRows() {
    const rows = (this.pricingSummaryRows ?? []).length > 0 ? this.pricingSummaryRows : this.items.flatMap((item) => item.pricingSummaryRows ?? []);
    return rows.map((row) => ({
      key: `${row.key ?? row.label ?? ""}`.trim() || "pricing",
      label: `${row.label ?? ""}`.trim() || "Pricing",
      detail: `${row.detail ?? ""}`.trim() || null,
      amount: Number.isFinite(row.amount) ? Number(row.amount) : null,
      currency: `${row.currency ?? this.currency ?? "USD"}`.trim() || "USD",
      multiplier: Number.isFinite(row.multiplier) ? Math.max(1, Math.trunc(Number(row.multiplier))) : null
    })).filter((row) => row.label);
  }
  hasPricingSummary() {
    return this.showPricingSummary === true && (this.visiblePricingSummaryRows().length > 0 || this.items.length > 0 || Number(this.totalAmount) > 0);
  }
  pricingSummaryAmountLabel(row) {
    if (row.amount === null || row.amount === void 0) {
      return "";
    }
    const amount = Number(row.amount) || 0;
    const sign = amount < 0 ? "-" : amount > 0 && !`${row.key ?? ""}`.startsWith("base") ? "+" : "";
    return `${sign}${this.formatMoney(Math.abs(amount), row.currency || this.currency)}`;
  }
  pricingSummaryTotalLabel() {
    return this.formatMoney(Number(this.totalAmount) || 0, this.currency);
  }
  formatMoney(amount, currency) {
    const symbol = this.currencySymbol(currency);
    return `${symbol}${(Number(amount) || 0).toFixed(2)}`;
  }
  currencySymbol(currency) {
    switch ((currency || "").trim().toUpperCase()) {
      case "EUR":
        return "EUR ";
      case "GBP":
        return "GBP ";
      default:
        return "$";
    }
  }
  static \u0275fac = function EventBasketInputComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EventBasketInputComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EventBasketInputComponent, selectors: [["app-event-basket-input"]], inputs: { title: "title", subtitle: "subtitle", contextTitle: "contextTitle", contextMeta: "contextMeta", contextDetail: "contextDetail", contextAmount: "contextAmount", items: "items", pricingSummaryRows: "pricingSummaryRows", totalAmount: "totalAmount", currency: "currency", addDisabled: "addDisabled", readOnly: "readOnly", showAdd: "showAdd", showItemMenu: "showItemMenu", showPricingSummary: "showPricingSummary", addIcon: "addIcon", addAriaLabel: "addAriaLabel", emptyLabel: "emptyLabel", tone: "tone" }, outputs: { addSelect: "addSelect", itemMenuSelect: "itemMenuSelect" }, decls: 17, vars: 18, consts: [[1, "event-basket-panel"], [1, "event-basket-panel-head"], [1, "event-basket-panel-title-wrap"], [1, "event-basket-panel-title"], [1, "event-basket-panel-title-line"], [1, "event-basket-panel-subtitle"], [1, "event-basket-panel-actions"], [1, "event-basket-panel-body"], [1, "event-basket-context"], [1, "event-basket-empty"], [1, "event-basket-pricing-summary"], ["kind", "inline", 1, "event-basket-add-menu", 3, "itemSelect", "items"], [1, "event-basket-section-head"], [1, "event-basket-list"], [1, "event-basket-readonly-row"], ["icon", "event_seat", 1, "event-basket-card", 3, "tone", "title", "subtitle", "meta", "detail", "menuTitle", "menuPalette", "menuItems"], ["icon", "event_seat", 1, "event-basket-card", 3, "menuSelect", "tone", "title", "subtitle", "meta", "detail", "menuTitle", "menuPalette", "menuItems"], [1, "event-basket-pricing-summary-head"], [1, "event-basket-pricing-row"], [1, "event-basket-pricing-empty"], [1, "event-basket-pricing-total"], [1, "event-basket-pricing-label"]], template: function EventBasketInputComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "span", 3)(4, "span", 4)(5, "mat-icon");
      \u0275\u0275text(6, "shopping_basket");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "span");
      \u0275\u0275text(8);
      \u0275\u0275pipe(9, "i18n");
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(10, EventBasketInputComponent_Conditional_10_Template, 3, 3, "p", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(11, EventBasketInputComponent_Conditional_11_Template, 2, 1, "div", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "div", 7);
      \u0275\u0275conditionalCreate(13, EventBasketInputComponent_Conditional_13_Template, 6, 4, "article", 8);
      \u0275\u0275conditionalCreate(14, EventBasketInputComponent_Conditional_14_Template, 4, 1)(15, EventBasketInputComponent_Conditional_15_Template, 3, 3, "div", 9);
      \u0275\u0275conditionalCreate(16, EventBasketInputComponent_Conditional_16_Template, 17, 11, "section", 10);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275classProp("event-basket-panel--ready", ctx.tone === "ready")("event-basket-panel--payment", ctx.tone === "payment")("event-basket-panel--waiting", ctx.tone === "waiting")("event-basket-panel--approval", ctx.tone === "approval")("event-basket-panel--changed", ctx.tone === "changed");
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(9, 16, ctx.title));
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.subtitle ? 10 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showAdd && !ctx.readOnly ? 11 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.hasContext() ? 13 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.items.length > 0 ? 14 : 15);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.hasPricingSummary() ? 16 : -1);
    }
  }, dependencies: [
    CommonModule,
    MatIconModule,
    MatIcon,
    AppMenuComponent,
    TextCardComponent,
    I18nPipe
  ], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  grid-column: 1/-1;\n}\n.event-basket-panel[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n  border: 1px solid rgba(93, 108, 128, 0.3);\n  border-radius: 16px;\n  background:\n    radial-gradient(\n      circle at 7% 8%,\n      rgba(255, 255, 255, 0.78),\n      transparent 34%),\n    linear-gradient(\n      180deg,\n      #f8fafc 0%,\n      #eef5f5 100%);\n  box-shadow: 0 4px 12px rgba(39, 53, 72, 0.08);\n  padding: 0.62rem 0.72rem;\n  display: grid;\n  gap: 0.62rem;\n}\n.event-basket-panel--ready[_ngcontent-%COMP%] {\n  border-color: rgba(55, 132, 169, 0.34);\n  background:\n    radial-gradient(\n      circle at 7% 8%,\n      rgba(255, 255, 255, 0.82),\n      transparent 34%),\n    linear-gradient(\n      180deg,\n      #f3fbff 0%,\n      #e8f4f8 100%);\n}\n.event-basket-panel--payment[_ngcontent-%COMP%] {\n  border-color: rgba(82, 94, 192, 0.34);\n  background:\n    radial-gradient(\n      circle at 7% 8%,\n      rgba(255, 255, 255, 0.82),\n      transparent 34%),\n    linear-gradient(\n      180deg,\n      #f5f6ff 0%,\n      #ecefff 100%);\n}\n.event-basket-panel--waiting[_ngcontent-%COMP%], \n.event-basket-panel--approval[_ngcontent-%COMP%] {\n  border-color: rgba(205, 143, 53, 0.36);\n  background:\n    radial-gradient(\n      circle at 7% 8%,\n      rgba(255, 255, 255, 0.82),\n      transparent 34%),\n    linear-gradient(\n      180deg,\n      #fff9ed 0%,\n      #f9efd9 100%);\n}\n.event-basket-panel--changed[_ngcontent-%COMP%] {\n  border-color: rgba(218, 137, 38, 0.42);\n  background:\n    radial-gradient(\n      circle at 7% 8%,\n      rgba(255, 255, 255, 0.84),\n      transparent 34%),\n    linear-gradient(\n      180deg,\n      #fff7e8 0%,\n      #f8ead0 100%);\n}\n.event-basket-panel-head[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: start;\n  gap: 0.75rem;\n}\n.event-basket-panel-title-wrap[_ngcontent-%COMP%], \n.event-basket-panel-body[_ngcontent-%COMP%], \n.event-basket-list[_ngcontent-%COMP%], \n.event-basket-pricing-summary[_ngcontent-%COMP%] {\n  display: grid;\n}\n.event-basket-panel-title-wrap[_ngcontent-%COMP%] {\n  gap: 0.26rem;\n}\n.event-basket-panel-title[_ngcontent-%COMP%], \n.event-basket-panel-title-line[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.5rem;\n  min-width: 0;\n}\n.event-basket-panel-title-line[_ngcontent-%COMP%] {\n  color: #526174;\n  font-weight: 900;\n}\n.event-basket-panel-title-line[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.event-basket-panel-subtitle[_ngcontent-%COMP%] {\n  margin: 0;\n  color: rgba(37, 58, 88, 0.74);\n  font-size: 0.8rem;\n  line-height: 1.4;\n}\n.event-basket-panel-actions[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-end;\n  min-width: 0;\n}\n.event-basket-add-menu[_ngcontent-%COMP%] {\n  justify-self: end;\n}\n.event-basket-panel-body[_ngcontent-%COMP%] {\n  gap: 0.72rem;\n}\n.event-basket-context[_ngcontent-%COMP%], \n.event-basket-section-head[_ngcontent-%COMP%], \n.event-basket-readonly-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.75rem;\n  min-width: 0;\n}\n.event-basket-context[_ngcontent-%COMP%], \n.event-basket-readonly-row[_ngcontent-%COMP%] {\n  border: 1px solid rgba(192, 212, 232, 0.72);\n  border-radius: 12px;\n  background: rgba(249, 252, 255, 0.9);\n  padding: 0.64rem 0.72rem;\n}\n.event-basket-context[_ngcontent-%COMP%] {\n  background: rgba(238, 250, 248, 0.72);\n  border-color: rgba(89, 137, 151, 0.22);\n}\n.event-basket-context[_ngcontent-%COMP%]   div[_ngcontent-%COMP%], \n.event-basket-readonly-row[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.15rem;\n  min-width: 0;\n}\n.event-basket-context[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.event-basket-readonly-row[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.event-basket-section-head[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #183a5a;\n  font-weight: 900;\n}\n.event-basket-context[_ngcontent-%COMP%]    > strong[_ngcontent-%COMP%], \n.event-basket-readonly-row[_ngcontent-%COMP%]    > strong[_ngcontent-%COMP%] {\n  justify-self: end;\n  color: #16836f;\n  white-space: nowrap;\n}\n.event-basket-context[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.event-basket-context[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.event-basket-readonly-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.event-basket-readonly-row[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: rgba(42, 64, 96, 0.72);\n  font-size: 0.82rem;\n  line-height: 1.35;\n}\n.event-basket-section-head[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: rgba(43, 64, 96, 0.66);\n  font-size: 0.76rem;\n  font-weight: 800;\n  text-transform: uppercase;\n}\n.event-basket-list[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  align-items: stretch;\n  gap: 0.56rem;\n  min-width: 0;\n}\n.event-basket-card[_ngcontent-%COMP%] {\n  display: block;\n  height: 100%;\n  min-width: 0;\n}\n.event-basket-empty[_ngcontent-%COMP%] {\n  justify-self: start;\n  min-width: min(100%, 252px);\n  padding: 1rem 1.2rem;\n  border: 1px dashed rgba(128, 149, 176, 0.36);\n  border-radius: 14px;\n  color: #102a4a;\n  background: rgba(255, 255, 255, 0.58);\n  font-size: 0.9rem;\n  line-height: 1.35;\n  font-weight: 800;\n  box-sizing: border-box;\n}\n.event-basket-pricing-summary[_ngcontent-%COMP%] {\n  gap: 0.34rem;\n  padding: 0.62rem 0.72rem;\n  border: 1px solid rgba(89, 137, 151, 0.24);\n  border-radius: 12px;\n  background: rgba(255, 255, 255, 0.68);\n}\n.event-basket-pricing-summary-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.75rem;\n  color: #20395d;\n  font-size: 0.86rem;\n  font-weight: 900;\n}\n.event-basket-pricing-summary-head[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  color: #2d4f7c;\n}\n.event-basket-pricing-row[_ngcontent-%COMP%], \n.event-basket-pricing-total[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.75rem;\n  min-width: 0;\n  color: rgba(36, 58, 88, 0.78);\n  font-size: 0.8rem;\n  line-height: 1.35;\n}\n.event-basket-pricing-empty[_ngcontent-%COMP%] {\n  margin: 0.2rem 0 0.1rem;\n  color: rgba(42, 64, 96, 0.68);\n  font-size: 0.78rem;\n  line-height: 1.35;\n  font-weight: 750;\n}\n.event-basket-pricing-label[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-wrap: wrap;\n  align-items: baseline;\n  gap: 0.32rem;\n  min-width: 0;\n  overflow-wrap: anywhere;\n}\n.event-basket-pricing-label[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: rgba(36, 58, 88, 0.56);\n  font-size: 0.72rem;\n  font-weight: 700;\n}\n.event-basket-pricing-row[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #24476f;\n  font-size: 0.8rem;\n  font-weight: 900;\n  white-space: nowrap;\n}\n.event-basket-pricing-total[_ngcontent-%COMP%] {\n  margin-top: 0.2rem;\n  padding-top: 0.46rem;\n  border-top: 1px solid rgba(89, 137, 151, 0.22);\n  color: #183653;\n  font-size: 0.9rem;\n  font-weight: 900;\n}\n.event-basket-pricing-total[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #16836f;\n  font-size: 1rem;\n  white-space: nowrap;\n}\n@media (max-width: 760px) {\n  .event-basket-list[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .event-basket-context[_ngcontent-%COMP%], \n   .event-basket-readonly-row[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .event-basket-context[_ngcontent-%COMP%]    > strong[_ngcontent-%COMP%], \n   .event-basket-readonly-row[_ngcontent-%COMP%]    > strong[_ngcontent-%COMP%] {\n    justify-self: start;\n  }\n  .event-basket-panel-actions[_ngcontent-%COMP%] {\n    justify-self: end;\n  }\n}\n/*# sourceMappingURL=event-basket-input.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EventBasketInputComponent, [{
    type: Component,
    args: [{ selector: "app-event-basket-input", standalone: true, imports: [
      CommonModule,
      MatIconModule,
      AppMenuComponent,
      TextCardComponent,
      I18nPipe
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `<section
  class="event-basket-panel"
  [class.event-basket-panel--ready]="tone === 'ready'"
  [class.event-basket-panel--payment]="tone === 'payment'"
  [class.event-basket-panel--waiting]="tone === 'waiting'"
  [class.event-basket-panel--approval]="tone === 'approval'"
  [class.event-basket-panel--changed]="tone === 'changed'"
>
  <div class="event-basket-panel-head">
    <div class="event-basket-panel-title-wrap">
      <span class="event-basket-panel-title">
        <span class="event-basket-panel-title-line">
          <mat-icon>shopping_basket</mat-icon>
          <span>{{ title | i18n }}</span>
        </span>
      </span>
      @if (subtitle) {
        <p class="event-basket-panel-subtitle">{{ subtitle | i18n }}</p>
      }
    </div>
    @if (showAdd && !readOnly) {
    <div class="event-basket-panel-actions">
      <app-menu
        class="event-basket-add-menu"
        kind="inline"
        [items]="addMenuItems()"
        (itemSelect)="onAddSelect($event)"
      ></app-menu>
    </div>
    }
  </div>

  <div class="event-basket-panel-body">
    @if (hasContext()) {
      <article class="event-basket-context">
        <div>
          @if (contextTitle) {
            <strong>{{ contextTitle }}</strong>
          }
          @if (contextMeta) {
            <span>{{ contextMeta }}</span>
          }
          @if (contextDetail) {
            <small>{{ contextDetail }}</small>
          }
        </div>
        @if (contextAmountLabel()) {
          <strong>{{ contextAmountLabel() }}</strong>
        }
      </article>
    }

    @if (items.length > 0) {
      @if (readOnly) {
        <div class="event-basket-section-head">
          <span>{{ 'event.editor.basket.selected.items' | i18n }}</span>
          <strong>{{ items.length }} {{ (items.length === 1 ? 'item' : 'items') | i18n }}</strong>
        </div>
      }
      <div class="event-basket-list">
        @for (item of items; track itemTrackId($index, item)) {
          @if (readOnly) {
            <article class="event-basket-readonly-row">
              <div>
                <strong>{{ item.title }}</strong>
                <span>{{ item.meta }}</span>
                @if (itemDetail(item)) {
                  <small>{{ itemDetail(item) }}</small>
                }
              </div>
              <strong>{{ itemAmountLabel(item) }}</strong>
            </article>
          } @else {
          <app-text-card
            class="event-basket-card"
            [tone]="itemTone(item)"
            icon="event_seat"
            [title]="item.title"
            [subtitle]="itemSubtitle(item)"
            [meta]="item.meta"
            [detail]="itemDetail(item)"
            [menuTitle]="item.title"
            [menuPalette]="itemMenuPalette(item)"
            [menuItems]="itemMenuItems()"
            (menuSelect)="onItemMenuSelect(item, $event)"
          ></app-text-card>
          }
        }
      </div>
    } @else {
      <div class="event-basket-empty">{{ emptyLabel | i18n }}</div>
    }

    @if (hasPricingSummary()) {
      <section class="event-basket-pricing-summary" [attr.aria-label]="'event.editor.pricing.current.review' | i18n">
        <div class="event-basket-pricing-summary-head">
          <span>{{ 'event.editor.pricing.current.review' | i18n }}</span>
          <mat-icon>price_check</mat-icon>
        </div>
        @for (row of visiblePricingSummaryRows(); track row.key || row.label) {
          <div class="event-basket-pricing-row">
            <span class="event-basket-pricing-label">
              <span>{{ row.label | i18n }}</span>
              @if (row.detail) {
                <small>{{ row.detail | i18n }}</small>
              }
            </span>
            <strong>{{ pricingSummaryAmountLabel(row) }}</strong>
          </div>
        }
        @if (visiblePricingSummaryRows().length === 0) {
          <p class="event-basket-pricing-empty">{{ 'event.editor.basket.no.selected.items' | i18n }}</p>
        }
        <div class="event-basket-pricing-total">
          <span>{{ 'event.editor.pricing.final.price' | i18n }}</span>
          <strong>{{ pricingSummaryTotalLabel() }}</strong>
        </div>
      </section>
    }
  </div>
</section>
`, styles: ["/* src/app/activity/components/event-editor-popup/event-basket-input/event-basket-input.component.scss */\n:host {\n  display: block;\n  grid-column: 1/-1;\n}\n.event-basket-panel {\n  grid-column: 1/-1;\n  border: 1px solid rgba(93, 108, 128, 0.3);\n  border-radius: 16px;\n  background:\n    radial-gradient(\n      circle at 7% 8%,\n      rgba(255, 255, 255, 0.78),\n      transparent 34%),\n    linear-gradient(\n      180deg,\n      #f8fafc 0%,\n      #eef5f5 100%);\n  box-shadow: 0 4px 12px rgba(39, 53, 72, 0.08);\n  padding: 0.62rem 0.72rem;\n  display: grid;\n  gap: 0.62rem;\n}\n.event-basket-panel--ready {\n  border-color: rgba(55, 132, 169, 0.34);\n  background:\n    radial-gradient(\n      circle at 7% 8%,\n      rgba(255, 255, 255, 0.82),\n      transparent 34%),\n    linear-gradient(\n      180deg,\n      #f3fbff 0%,\n      #e8f4f8 100%);\n}\n.event-basket-panel--payment {\n  border-color: rgba(82, 94, 192, 0.34);\n  background:\n    radial-gradient(\n      circle at 7% 8%,\n      rgba(255, 255, 255, 0.82),\n      transparent 34%),\n    linear-gradient(\n      180deg,\n      #f5f6ff 0%,\n      #ecefff 100%);\n}\n.event-basket-panel--waiting,\n.event-basket-panel--approval {\n  border-color: rgba(205, 143, 53, 0.36);\n  background:\n    radial-gradient(\n      circle at 7% 8%,\n      rgba(255, 255, 255, 0.82),\n      transparent 34%),\n    linear-gradient(\n      180deg,\n      #fff9ed 0%,\n      #f9efd9 100%);\n}\n.event-basket-panel--changed {\n  border-color: rgba(218, 137, 38, 0.42);\n  background:\n    radial-gradient(\n      circle at 7% 8%,\n      rgba(255, 255, 255, 0.84),\n      transparent 34%),\n    linear-gradient(\n      180deg,\n      #fff7e8 0%,\n      #f8ead0 100%);\n}\n.event-basket-panel-head {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: start;\n  gap: 0.75rem;\n}\n.event-basket-panel-title-wrap,\n.event-basket-panel-body,\n.event-basket-list,\n.event-basket-pricing-summary {\n  display: grid;\n}\n.event-basket-panel-title-wrap {\n  gap: 0.26rem;\n}\n.event-basket-panel-title,\n.event-basket-panel-title-line {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.5rem;\n  min-width: 0;\n}\n.event-basket-panel-title-line {\n  color: #526174;\n  font-weight: 900;\n}\n.event-basket-panel-title-line .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.event-basket-panel-subtitle {\n  margin: 0;\n  color: rgba(37, 58, 88, 0.74);\n  font-size: 0.8rem;\n  line-height: 1.4;\n}\n.event-basket-panel-actions {\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-end;\n  min-width: 0;\n}\n.event-basket-add-menu {\n  justify-self: end;\n}\n.event-basket-panel-body {\n  gap: 0.72rem;\n}\n.event-basket-context,\n.event-basket-section-head,\n.event-basket-readonly-row {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.75rem;\n  min-width: 0;\n}\n.event-basket-context,\n.event-basket-readonly-row {\n  border: 1px solid rgba(192, 212, 232, 0.72);\n  border-radius: 12px;\n  background: rgba(249, 252, 255, 0.9);\n  padding: 0.64rem 0.72rem;\n}\n.event-basket-context {\n  background: rgba(238, 250, 248, 0.72);\n  border-color: rgba(89, 137, 151, 0.22);\n}\n.event-basket-context div,\n.event-basket-readonly-row div {\n  display: grid;\n  gap: 0.15rem;\n  min-width: 0;\n}\n.event-basket-context strong,\n.event-basket-readonly-row strong,\n.event-basket-section-head strong {\n  color: #183a5a;\n  font-weight: 900;\n}\n.event-basket-context > strong,\n.event-basket-readonly-row > strong {\n  justify-self: end;\n  color: #16836f;\n  white-space: nowrap;\n}\n.event-basket-context span,\n.event-basket-context small,\n.event-basket-readonly-row span,\n.event-basket-readonly-row small {\n  color: rgba(42, 64, 96, 0.72);\n  font-size: 0.82rem;\n  line-height: 1.35;\n}\n.event-basket-section-head span {\n  color: rgba(43, 64, 96, 0.66);\n  font-size: 0.76rem;\n  font-weight: 800;\n  text-transform: uppercase;\n}\n.event-basket-list {\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  align-items: stretch;\n  gap: 0.56rem;\n  min-width: 0;\n}\n.event-basket-card {\n  display: block;\n  height: 100%;\n  min-width: 0;\n}\n.event-basket-empty {\n  justify-self: start;\n  min-width: min(100%, 252px);\n  padding: 1rem 1.2rem;\n  border: 1px dashed rgba(128, 149, 176, 0.36);\n  border-radius: 14px;\n  color: #102a4a;\n  background: rgba(255, 255, 255, 0.58);\n  font-size: 0.9rem;\n  line-height: 1.35;\n  font-weight: 800;\n  box-sizing: border-box;\n}\n.event-basket-pricing-summary {\n  gap: 0.34rem;\n  padding: 0.62rem 0.72rem;\n  border: 1px solid rgba(89, 137, 151, 0.24);\n  border-radius: 12px;\n  background: rgba(255, 255, 255, 0.68);\n}\n.event-basket-pricing-summary-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.75rem;\n  color: #20395d;\n  font-size: 0.86rem;\n  font-weight: 900;\n}\n.event-basket-pricing-summary-head .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  color: #2d4f7c;\n}\n.event-basket-pricing-row,\n.event-basket-pricing-total {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.75rem;\n  min-width: 0;\n  color: rgba(36, 58, 88, 0.78);\n  font-size: 0.8rem;\n  line-height: 1.35;\n}\n.event-basket-pricing-empty {\n  margin: 0.2rem 0 0.1rem;\n  color: rgba(42, 64, 96, 0.68);\n  font-size: 0.78rem;\n  line-height: 1.35;\n  font-weight: 750;\n}\n.event-basket-pricing-label {\n  display: inline-flex;\n  flex-wrap: wrap;\n  align-items: baseline;\n  gap: 0.32rem;\n  min-width: 0;\n  overflow-wrap: anywhere;\n}\n.event-basket-pricing-label small {\n  color: rgba(36, 58, 88, 0.56);\n  font-size: 0.72rem;\n  font-weight: 700;\n}\n.event-basket-pricing-row strong {\n  color: #24476f;\n  font-size: 0.8rem;\n  font-weight: 900;\n  white-space: nowrap;\n}\n.event-basket-pricing-total {\n  margin-top: 0.2rem;\n  padding-top: 0.46rem;\n  border-top: 1px solid rgba(89, 137, 151, 0.22);\n  color: #183653;\n  font-size: 0.9rem;\n  font-weight: 900;\n}\n.event-basket-pricing-total strong {\n  color: #16836f;\n  font-size: 1rem;\n  white-space: nowrap;\n}\n@media (max-width: 760px) {\n  .event-basket-list {\n    grid-template-columns: 1fr;\n  }\n  .event-basket-context,\n  .event-basket-readonly-row {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .event-basket-context > strong,\n  .event-basket-readonly-row > strong {\n    justify-self: start;\n  }\n  .event-basket-panel-actions {\n    justify-self: end;\n  }\n}\n/*# sourceMappingURL=event-basket-input.component.css.map */\n"] }]
  }], null, { title: [{
    type: Input
  }], subtitle: [{
    type: Input
  }], contextTitle: [{
    type: Input
  }], contextMeta: [{
    type: Input
  }], contextDetail: [{
    type: Input
  }], contextAmount: [{
    type: Input
  }], items: [{
    type: Input
  }], pricingSummaryRows: [{
    type: Input
  }], totalAmount: [{
    type: Input
  }], currency: [{
    type: Input
  }], addDisabled: [{
    type: Input
  }], readOnly: [{
    type: Input
  }], showAdd: [{
    type: Input
  }], showItemMenu: [{
    type: Input
  }], showPricingSummary: [{
    type: Input
  }], addIcon: [{
    type: Input
  }], addAriaLabel: [{
    type: Input
  }], emptyLabel: [{
    type: Input
  }], tone: [{
    type: Input
  }], addSelect: [{
    type: Output
  }], itemMenuSelect: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EventBasketInputComponent, { className: "EventBasketInputComponent", filePath: "app/activity/components/event-editor-popup/event-basket-input/event-basket-input.component.ts", lineNumber: 50 });
})();

export {
  EventBasketInputComponent
};
//# sourceMappingURL=chunk-LD5XJQ3D.js.map
