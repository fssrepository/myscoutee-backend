import {
  EventBasketInputComponent
} from "./chunk-R3OVHAC3.js";
import {
  EventCheckoutDraftStore,
  EventCheckoutSlotPickerStore
} from "./chunk-F5B73CZX.js";
import "./chunk-BRGZDNX3.js";
import "./chunk-XA4QEJLP.js";
import "./chunk-7UZYVY3Z.js";
import "./chunk-VBRGMXSL.js";
import "./chunk-2VFJ327H.js";
import "./chunk-4TXXTGDV.js";
import "./chunk-FS6LNZZ4.js";
import "./chunk-NX6X6SL6.js";
import "./chunk-SYKOEE4K.js";
import "./chunk-IMU76WCC.js";
import "./chunk-IRJFXW7R.js";
import "./chunk-EFQHKYZD.js";
import "./chunk-HDRPEKFL.js";
import {
  SmartListComponent
} from "./chunk-JWRKXGRX.js";
import "./chunk-LWXWCSPP.js";
import "./chunk-T6NM4FOV.js";
import "./chunk-2FA72P6F.js";
import "./chunk-A6AM4Z6L.js";
import "./chunk-DR3RAUWL.js";
import "./chunk-DDIPOAA4.js";
import {
  TextCardComponent
} from "./chunk-MDKC4NXB.js";
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
  MatIconModule
} from "./chunk-J4QS2YUJ.js";
import "./chunk-XCPZRRU5.js";
import {
  EventsService
} from "./chunk-LGGVU5AE.js";
import "./chunk-6RAUJLMB.js";
import "./chunk-JQCFZPHN.js";
import "./chunk-J5KOSTYM.js";
import "./chunk-MC3W6CB7.js";
import {
  APP_STATIC_DATA
} from "./chunk-FAW3YKWN.js";
import {
  AppUtils
} from "./chunk-QZPIQIRC.js";
import "./chunk-LCSKRGZO.js";
import "./chunk-I52TUHFM.js";
import "./chunk-WWXJW2FL.js";
import "./chunk-NB6L6NLP.js";
import "./chunk-U4O3FETT.js";
import {
  CommonModule
} from "./chunk-JMCIB2VE.js";
import "./chunk-DP7O5TZ4.js";
import "./chunk-OJADXSXP.js";
import "./chunk-52XNNRXY.js";
import "./chunk-27OFLLFL.js";
import "./chunk-SXVGSFEZ.js";
import "./chunk-YO3STUCM.js";
import "./chunk-ZBAABSP3.js";
import "./chunk-ON23DQAQ.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  __spreadProps,
  __spreadValues,
  effect,
  from,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-FMXFYYCS.js";

// src/app/activity/components/event-checkout-slot-picker-popup/event-checkout-slot-picker-popup.component.ts
var _c0 = () => [];
function EventCheckoutSlotPickerPopupComponent_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.errorMessage);
  }
}
function EventCheckoutSlotPickerPopupComponent_Conditional_0_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 6)(1, "app-smart-list", 7);
    \u0275\u0275listener("itemSelect", function EventCheckoutSlotPickerPopupComponent_Conditional_0_Conditional_5_Template_app_smart_list_itemSelect_1_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onMonthDaySelect($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("config", ctx_r1.monthListConfig)("loadPage", ctx_r1.monthLoadPage)("query", ctx_r1.monthListQuery)("view", "month");
  }
}
function EventCheckoutSlotPickerPopupComponent_Conditional_0_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 8)(1, "app-text-card", 9);
    \u0275\u0275listener("selectionToggle", function EventCheckoutSlotPickerPopupComponent_Conditional_0_ng_template_6_Template_app_text_card_selectionToggle_1_listener($event) {
      const selectItem_r5 = \u0275\u0275restoreView(_r4).selectItem;
      return \u0275\u0275resetView(selectItem_r5($event));
    })("badgeClick", function EventCheckoutSlotPickerPopupComponent_Conditional_0_ng_template_6_Template_app_text_card_badgeClick_1_listener($event) {
      const slot_r6 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openPricingSummary(slot_r6, $event));
    })("menuSelect", function EventCheckoutSlotPickerPopupComponent_Conditional_0_ng_template_6_Template_app_text_card_menuSelect_1_listener($event) {
      const slot_r6 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onSlotMenuSelect(slot_r6, $event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const slot_r6 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("is-selected", ctx_r1.isSelected(slot_r6))("is-booked", ctx_r1.isSlotBooked(slot_r6));
    \u0275\u0275advance();
    \u0275\u0275classProp("has-slot-badge-space", true);
    \u0275\u0275property("tone", ctx_r1.slotCardTone(slot_r6))("disabled", ctx_r1.isSlotUnavailable(slot_r6))("title", slot_r6.title)("subtitle", slot_r6.timeframe)("meta", "")("detail", ctx_r1.selectedOptionalLabel(slot_r6))("badge", ctx_r1.slotPriceLabel(slot_r6))("badgeClickable", ctx_r1.slotShowsPrice(slot_r6))("badgeAriaLabel", "Show price summary for " + slot_r6.title)("statusBadge", ctx_r1.slotCapacityBadge(slot_r6))("statusBadgeTone", ctx_r1.slotCapacityBadgeTone(slot_r6))("menuTitle", slot_r6.title)("menuItems", ctx_r1.slotActionsDisabled(slot_r6) ? \u0275\u0275pureFunction0(23, _c0) : ctx_r1.slotMenuItems(slot_r6))("selectable", !ctx_r1.slotActionsDisabled(slot_r6))("selected", ctx_r1.isSelected(slot_r6))("selectDisabled", ctx_r1.saving || ctx_r1.slotActionsDisabled(slot_r6))("selectAriaLabel", ctx_r1.isSelected(slot_r6) ? "Remove slot from basket" : "Add slot to basket");
  }
}
function EventCheckoutSlotPickerPopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 1)(1, "div", 2);
    \u0275\u0275conditionalCreate(2, EventCheckoutSlotPickerPopupComponent_Conditional_0_Conditional_2_Template, 2, 1, "p", 3);
    \u0275\u0275elementStart(3, "div", 4)(4, "app-smart-list", 5);
    \u0275\u0275listener("itemSelect", function EventCheckoutSlotPickerPopupComponent_Conditional_0_Template_app_smart_list_itemSelect_4_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSlotItemSelect($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, EventCheckoutSlotPickerPopupComponent_Conditional_0_Conditional_5_Template, 2, 4, "section", 6);
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, EventCheckoutSlotPickerPopupComponent_Conditional_0_ng_template_6_Template, 2, 24, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const slotItemTemplate_r7 = \u0275\u0275reference(7);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.popupModel())("zIndex", 4920);
    \u0275\u0275advance();
    \u0275\u0275classProp("is-saving", ctx_r1.saving)("is-month-view", ctx_r1.isMonthView());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.errorMessage ? 2 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("config", ctx_r1.slotListConfig)("loadPage", ctx_r1.slotLoadPage)("itemTemplate", slotItemTemplate_r7)("query", ctx_r1.slotListQuery);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isMonthView() ? 5 : -1);
  }
}
function EventCheckoutSlotPickerPopupComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-popup", 1);
    \u0275\u0275element(1, "app-event-basket-input", 10);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.pricingSummaryPopupModel())("zIndex", 4930);
    \u0275\u0275advance();
    \u0275\u0275property("config", ctx_r1.pricingSummaryBasketConfig)("items", ctx_r1.pricingSummaryItems(ctx_r1.pricingSummarySlot))("pricingSummaryRows", ctx_r1.pricingSummaryRows(ctx_r1.pricingSummarySlot))("totalAmount", ctx_r1.pricingSummaryTotalAmount(ctx_r1.pricingSummarySlot))("currency", ctx_r1.pricingSummaryCurrency(ctx_r1.pricingSummarySlot));
  }
}
var EventCheckoutSlotPickerPopupComponent = class _EventCheckoutSlotPickerPopupComponent {
  static CHECKOUT_BASKET_TTL_MS = 10 * 60 * 1e3;
  store = inject(EventCheckoutSlotPickerStore);
  eventsService = inject(EventsService);
  checkoutDraftStore = inject(EventCheckoutDraftStore);
  cdr = inject(ChangeDetectorRef);
  selectedDateKey = this.todayKey();
  basketMode = false;
  monthOverlayOpen = false;
  saving = false;
  errorMessage = "";
  pricingSummarySlot = null;
  monthAnchor = this.monthStart(this.selectedDateKey);
  monthListQuery = this.buildMonthListQuery();
  queryRevision = 0;
  selectionRevision = 0;
  selectionsBySlotId = /* @__PURE__ */ new Map();
  removedCountedSlotIds = /* @__PURE__ */ new Set();
  baselineSelectionSignature = "";
  optionalSubEventOptions = [];
  checkoutBasketHydrated = false;
  slotListQuery = this.buildSlotListQuery();
  pricingSummaryBasketConfig = {
    title: "Pricing",
    subtitle: "Read-only checkout price review",
    readOnly: true,
    showAdd: false,
    showItemMenu: false,
    showPricingSummary: true
  };
  dateInputModel = {
    mode: "single",
    precision: "date",
    valueFormat: "iso-date",
    field: {
      placeholder: "YYYY/MM/DD"
    }
  };
  slotListConfig = {
    pageSize: 15,
    initialPageSize: 15,
    defaultView: "list",
    presentation: "list",
    listLayout: "card-grid",
    desktopColumns: 3,
    selectMode: true,
    headerProgress: {
      enabled: true
    },
    loadingDelayMs: 0,
    showBackgroundLoadingProgress: true,
    emptyLabel: () => this.basketMode ? "No basket items yet." : "No available slots for this date.",
    trackBy: (_index, item) => item.id,
    groupBy: (item) => this.formatDateGroup(item.startAtIso),
    showGroupMarker: ({ groupIndex }) => groupIndex > 0,
    containerClass: {
      "event-checkout-slot-picker-list": true
    }
  };
  monthListConfig = {
    pageSize: 240,
    initialPageSize: 240,
    defaultView: "month",
    views: [
      { key: "month", label: "Month", mode: "month", pageSize: 240 }
    ],
    calendarVariant: "counter",
    calendar: {
      weekdayLabels: APP_STATIC_DATA.calendarWeekdayLabels,
      weekStartHour: 0,
      weekEndHour: 23,
      anchorRadius: 2,
      counterGranularity: "day",
      initialAnchor: (query) => query.filters?.anchor ?? this.monthAnchor,
      resolveDateRange: (item) => this.monthDateRange(item),
      dayCounter: (day) => this.monthDayCounter(day)
    },
    headerProgress: {
      enabled: true
    },
    loadingDelayMs: 0,
    showBackgroundLoadingProgress: true,
    showStickyHeader: true,
    trackBy: (_index, item) => item.dateKey,
    emptyLabel: "No slots in this month."
  };
  slotLoadPage = (query) => query.filters?.view === "basket" ? from(this.loadBasketSlotPage(query)) : from(this.loadSlotPage(query));
  monthLoadPage = (_query) => from(this.loadMonthPage(_query));
  constructor() {
    effect(() => {
      const state = this.store.popup();
      if (!state) {
        return;
      }
      this.initializeFromState(state.record, state.checkoutBasket ?? null, state.selectedDateKey ?? null);
    });
  }
  popupState() {
    return this.store.popup();
  }
  popupModel() {
    const state = this.popupState();
    return {
      title: state?.record.title ?? "Slots",
      subtitle: this.formatRecordRange(state?.record ?? null),
      ariaLabel: "Select checkout slots",
      closeAriaLabel: "Close slot picker",
      closeOnBackdrop: !this.saving,
      showClose: true,
      size: "wide",
      height: "full",
      headerTone: "accent",
      bodyLayout: "fill",
      backdropTone: "dim",
      headerControls: [
        {
          kind: "menu",
          id: "slot-picker-actions",
          align: "end",
          menuKind: "inline",
          items: this.headerMenuItems(),
          panelAlign: "end",
          mobileBreakpointPx: 900,
          closeOnSelect: false
        }
      ],
      toolbarControls: [
        {
          kind: "date-input",
          id: "slot-picker-date",
          align: "end",
          model: this.dateInputModel,
          value: this.selectedDateValue()
        },
        {
          id: "slot-picker-calendar",
          align: "end",
          icon: "calendar_month",
          ariaLabel: "Open slot calendar",
          palette: this.monthOverlayOpen ? "teal" : "neutral",
          active: this.monthOverlayOpen
        }
      ],
      onClose: (event) => this.close(event),
      onAction: (event) => this.onPopupAction(event),
      onMenuSelect: (event) => this.onPopupMenuSelect(event),
      onDateInputChange: (event) => {
        if (event.control.id === "slot-picker-date") {
          this.onDateChange(event.value);
        }
      }
    };
  }
  selectedCount() {
    return this.selectionsBySlotId.size;
  }
  headerMenuItems() {
    const selectedCount = this.selectedCount();
    const hasSelectionChanges = this.hasSelectionChanges();
    return [
      {
        id: "basket",
        icon: "shopping_basket",
        kind: "action",
        palette: this.basketMode ? "blue" : "neutral",
        counter: selectedCount,
        active: this.basketMode,
        closeOnSelect: false,
        ariaLabel: selectedCount === 1 ? "Show selected basket item" : `Show ${selectedCount} selected basket items`
      },
      {
        id: "save",
        icon: "done",
        kind: "action",
        palette: this.errorMessage || hasSelectionChanges ? "danger" : "success",
        disabled: this.saving || !hasSelectionChanges,
        closeOnSelect: false,
        ariaLabel: "Save basket",
        progress: {
          state: () => this.saving ? "loading" : this.errorMessage ? "error" : null,
          shape: "circle"
        }
      }
    ];
  }
  selectedDateValue() {
    return this.selectedDateKey;
  }
  onDateChange(value) {
    const dateKey = typeof value === "string" ? value.slice(0, 10) : "";
    if (!dateKey) {
      return;
    }
    this.selectedDateKey = dateKey;
    this.monthAnchor = this.monthStart(dateKey);
    this.basketMode = false;
    this.monthOverlayOpen = false;
    this.refreshSlotQuery();
    this.refreshMonthQuery();
  }
  toggleMonthView(event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.monthOverlayOpen = !this.monthOverlayOpen;
    this.monthAnchor = this.monthStart(this.selectedDateKey);
    if (this.monthOverlayOpen && this.basketMode) {
      this.basketMode = false;
      this.refreshSlotQuery();
    }
    this.refreshMonthQuery();
  }
  toggleBasketView(event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.basketMode = !this.basketMode;
    if (this.basketMode) {
      this.monthOverlayOpen = false;
    }
    this.queryRevision += 1;
    this.refreshSlotQuery();
  }
  onMonthDaySelect(event) {
    this.selectMonthSummaryDay(event.item, event.sourceEvent);
  }
  onSlotItemSelect(event) {
    if (!event.selectMode) {
      return;
    }
    this.toggleSlot(event.item, event.sourceEvent);
  }
  selectMonthSummaryDay(day, event) {
    event?.preventDefault();
    event?.stopPropagation();
    if (!day) {
      return;
    }
    this.selectedDateKey = day.dateKey;
    this.monthAnchor = this.monthStart(day.dateKey);
    this.basketMode = false;
    this.monthOverlayOpen = false;
    this.refreshSlotQuery();
    this.refreshMonthQuery();
  }
  isMonthView() {
    return this.monthOverlayOpen;
  }
  isSelected(slot) {
    return this.selectionsBySlotId.has(slot.id);
  }
  isSlotUnavailable(slot) {
    return !this.isSlotBooked(slot) && !this.isSelected(slot) && !this.removedCountedSlotIds.has(slot.id) && this.slotAvailableCount(slot) <= 0;
  }
  isSlotBooked(slot) {
    return slot.bookedByViewer === true;
  }
  slotActionsDisabled(slot) {
    return this.isSlotBooked(slot) || this.isSlotUnavailable(slot);
  }
  slotShowsPrice(slot) {
    return !this.isSlotFullyUnavailable(slot);
  }
  slotCardTone(slot) {
    if (this.isSlotBooked(slot)) {
      return "orange";
    }
    return this.isSlotUnavailable(slot) ? "muted" : "slot";
  }
  slotCapacityBadge(slot) {
    if (this.isSlotBooked(slot)) {
      return this.isBookedSlotFull(slot) ? "Fully booked" : "Booked";
    }
    const capacity = this.slotCapacityTotal(slot);
    const available = this.slotAvailableCount(slot);
    const selected = this.isSelected(slot);
    const selectedOccupancyDelta = selected && !this.selectionOccupancyCounted(slot) ? 1 : 0;
    const removedOccupancyDelta = !selected && this.removedCountedSlotIds.has(slot.id) ? -1 : 0;
    const availableIncludingSelection = available + (selected ? 1 : 0) + (removedOccupancyDelta < 0 ? 1 : 0);
    if (capacity <= 0 || availableIncludingSelection <= 0) {
      return "Unavailable";
    }
    const used = capacity - available + selectedOccupancyDelta + removedOccupancyDelta;
    return `${Math.max(0, Math.min(capacity, used))} / ${capacity}`;
  }
  slotCapacityBadgeTone(slot) {
    return this.isSlotBooked(slot) ? "danger" : "muted";
  }
  selectedOptionalLabel(slot) {
    const selectedIds = this.selectionsBySlotId.get(slot.id)?.optionalSubEventIds ?? [];
    if (selectedIds.length === 0) {
      return "";
    }
    const names = this.optionalSubEvents().filter((item) => selectedIds.includes(item.id)).map((item) => item.name || item.id);
    return names.length ? `Optional: ${names.join(", ")}` : "";
  }
  toggleSlot(slot, event) {
    event?.preventDefault();
    event?.stopPropagation();
    if (this.slotActionsDisabled(slot)) {
      return;
    }
    const existing = this.selectionsBySlotId.get(slot.id);
    if (existing) {
      this.selectionsBySlotId.delete(slot.id);
      if (existing.occupancyCounted) {
        this.removedCountedSlotIds.add(slot.id);
      }
    } else {
      const wasCountedBeforeRemoval = this.removedCountedSlotIds.delete(slot.id);
      this.selectionsBySlotId.set(slot.id, {
        slot,
        optionalSubEventIds: [],
        countedOptionalSubEventIds: [],
        occupancyCounted: wasCountedBeforeRemoval
      });
    }
    this.selectionRevision += 1;
    if (this.basketMode) {
      this.queryRevision += 1;
      this.refreshSlotQuery();
      return;
    }
    this.cdr.markForCheck();
  }
  slotMenuItems(slot) {
    const selection = this.selectionsBySlotId.get(slot.id);
    const optionalItems = this.optionalSubEvents().map((subEvent) => {
      const selected = selection?.optionalSubEventIds.includes(subEvent.id) === true;
      const unavailable = this.isOptionalSubEventDisabled(slot, subEvent) && !selected;
      return {
        id: `optional:${subEvent.id}`,
        label: subEvent.name || subEvent.id,
        description: subEvent.description || null,
        icon: unavailable ? "block" : selected ? "check_box" : "check_box_outline_blank",
        kind: "checkbox",
        checked: () => this.selectionsBySlotId.get(slot.id)?.optionalSubEventIds.includes(subEvent.id) === true,
        showCheck: false,
        disabled: () => this.isOptionalSubEventDisabled(slot, subEvent),
        palette: unavailable ? "muted" : "mint",
        surface: "tinted",
        headerBadge: this.optionalSubEventPriceLabel(subEvent),
        counter: unavailable ? "Unavailable" : this.optionalSubEventCapacityBadge(subEvent),
        detail: unavailable ? null : void 0,
        closeOnSelect: false,
        context: { menu: "slot", slot }
      };
    });
    return [
      ...optionalItems,
      ...optionalItems.length > 0 ? [{
        id: `divider:${slot.id}`,
        kind: "divider",
        context: { menu: "slot", slot }
      }] : [],
      {
        id: "pricing",
        label: "Price summary",
        icon: "price_check",
        palette: "gold",
        surface: "tinted",
        headerBadge: this.slotPriceLabel(slot),
        context: { menu: "slot", slot }
      }
    ];
  }
  onSlotMenuSelect(slot, event) {
    event.sourceEvent.preventDefault();
    event.sourceEvent.stopPropagation();
    if (event.id === "pricing") {
      this.openPricingSummary(slot, event.sourceEvent);
      return;
    }
    if (event.id.startsWith("optional:")) {
      this.toggleOptionalSlotEvent(slot, event.id.slice("optional:".length));
    }
  }
  slotPriceLabel(slot) {
    if (!this.slotShowsPrice(slot)) {
      return "";
    }
    return this.formatMoney(this.slotTotalAmount(slot), this.slotCurrency(slot));
  }
  slotAvailabilityLabel(slot) {
    return this.slotCapacityBadge(slot);
  }
  initializeFromState(record, basket, selectedDateKey) {
    this.selectionsBySlotId.clear();
    this.removedCountedSlotIds.clear();
    this.optionalSubEventOptions = [];
    this.selectionRevision = 0;
    this.queryRevision += 1;
    this.checkoutBasketHydrated = false;
    const activeItems = (basket?.items ?? []).filter((item) => this.isActiveBasketItem(item));
    const eventItems = activeItems.filter((item) => item.kind === "event" && item.slotSourceId?.trim());
    for (const item of eventItems) {
      const slot = this.slotFromBasketItem(record, item);
      if (!slot) {
        continue;
      }
      const optionalSubEventIds = activeItems.filter((candidate) => candidate.kind === "sub_event" && candidate.slotSourceId === item.slotSourceId && candidate.subEventId).map((candidate) => candidate.subEventId).filter(Boolean);
      this.selectionsBySlotId.set(slot.id, {
        slot,
        optionalSubEventIds,
        countedOptionalSubEventIds: optionalSubEventIds,
        occupancyCounted: this.checkoutItemOccupancyCounted(item)
      });
    }
    this.selectedDateKey = this.initialSelectedDateKey(record, basket, eventItems, selectedDateKey);
    this.monthAnchor = this.monthStart(this.selectedDateKey);
    this.basketMode = false;
    this.monthOverlayOpen = false;
    this.pricingSummarySlot = null;
    this.errorMessage = "";
    this.saving = false;
    this.refreshBaselineSelection();
    this.refreshSlotQuery();
    this.refreshMonthQuery();
  }
  async loadSlotPage(query) {
    const state = this.popupState();
    if (!state) {
      return { items: [], total: 0 };
    }
    const result = await this.eventsService.loadCheckoutSlots({
      userId: state.userId,
      eventId: state.record.id,
      view: "day",
      order: "upcoming",
      rangeStart: this.selectedDateKey,
      rangeEnd: this.selectedDateKey,
      limit: query.pageSize || 15,
      cursor: query.cursor ?? null
    });
    this.applyCheckoutSlotsContext(state.record, result);
    return {
      items: result?.slots ?? [],
      total: result?.total ?? 0,
      nextCursor: result?.nextCursor ?? null
    };
  }
  async loadBasketSlotPage(query) {
    const state = this.popupState();
    if (!state) {
      return { items: [], total: 0 };
    }
    const result = await this.eventsService.loadCheckoutSlots({
      userId: state.userId,
      eventId: state.record.id,
      view: "basket",
      order: "upcoming",
      limit: query.pageSize || 15,
      cursor: query.cursor ?? null
    });
    this.applyCheckoutSlotsContext(state.record, result);
    const mergedById = /* @__PURE__ */ new Map();
    for (const slot of result?.slots ?? []) {
      mergedById.set(slot.id, slot);
    }
    for (const slot of this.selectedSlotsPage().items) {
      mergedById.set(slot.id, mergedById.get(slot.id) ?? slot);
    }
    const items = [...mergedById.values()].sort((left, right) => this.sortableDateMs(left.startAtIso) - this.sortableDateMs(right.startAtIso));
    return {
      items,
      total: Math.max(result?.total ?? 0, items.length),
      nextCursor: result?.nextCursor ?? null
    };
  }
  selectedSlotsPage() {
    const items = [...this.selectionsBySlotId.values()].map((selection) => selection.slot).sort((left, right) => this.sortableDateMs(left.startAtIso) - this.sortableDateMs(right.startAtIso));
    return {
      items,
      total: items.length
    };
  }
  applyCheckoutSlotsContext(record, result) {
    if (Array.isArray(result?.optionalSubEvents)) {
      this.optionalSubEventOptions = result.optionalSubEvents;
    }
    if (!this.checkoutBasketHydrated) {
      this.hydrateSelectionsFromBasket(record, result?.checkoutBasket ?? null, result?.slots ?? []);
      this.checkoutBasketHydrated = true;
      if (this.selectionRevision === 0) {
        this.refreshBaselineSelection();
      }
    }
    this.cdr.markForCheck();
  }
  hydrateSelectionsFromBasket(record, basket, slots) {
    const activeItems = (basket?.items ?? []).filter((item) => this.isActiveBasketItem(item));
    const slotsById = new Map(slots.map((slot) => [slot.id, slot]));
    for (const item of activeItems.filter((candidate) => candidate.kind === "event" && candidate.slotSourceId?.trim())) {
      const slotId = item.slotSourceId.trim();
      const slot = slotsById.get(slotId) ?? this.slotFromBasketItem(record, item);
      if (!slot) {
        continue;
      }
      const selectedOptionalIds = activeItems.filter((candidate) => candidate.kind === "sub_event" && candidate.slotSourceId === slotId && candidate.subEventId).map((candidate) => candidate.subEventId).filter(Boolean);
      const existing = this.selectionsBySlotId.get(slot.id);
      this.selectionsBySlotId.set(slot.id, {
        slot,
        optionalSubEventIds: [.../* @__PURE__ */ new Set([
          ...existing?.optionalSubEventIds ?? [],
          ...selectedOptionalIds
        ])],
        countedOptionalSubEventIds: [.../* @__PURE__ */ new Set([
          ...existing?.countedOptionalSubEventIds ?? [],
          ...selectedOptionalIds
        ])],
        occupancyCounted: existing?.occupancyCounted ?? this.checkoutItemOccupancyCounted(item)
      });
    }
  }
  async loadMonthPage(query) {
    const state = this.popupState();
    if (!state) {
      return { items: [], total: 0 };
    }
    const anchor = query.filters?.anchor ?? query.anchorDate ?? this.monthAnchor;
    const rangeStart = query.rangeStart ?? this.monthStart(anchor);
    const rangeEnd = query.rangeEnd ?? this.monthEnd(anchor);
    const result = await this.eventsService.loadCheckoutSlots({
      userId: state.userId,
      eventId: state.record.id,
      view: "day",
      order: "upcoming",
      rangeStart,
      rangeEnd,
      limit: 1
    });
    this.applyCheckoutSlotsContext(state.record, result);
    return {
      items: result?.days ?? [],
      total: result?.days?.length ?? 0
    };
  }
  monthDateRange(day) {
    const date = this.parseDateKey(day.dateKey);
    if (!date) {
      return null;
    }
    return { start: date, end: date };
  }
  monthDayCounter(day) {
    const summary = day.items[0] ?? null;
    if (!summary) {
      return null;
    }
    const priceLabel = this.formatMoney(summary.lowestAmount, summary.currency);
    const slotCount = Math.max(0, Math.trunc(Number(summary.slotCount) || 0));
    const availableSlots = Math.max(0, Math.trunc(Number(summary.availableSlots) || 0));
    if (slotCount > 0 && availableSlots <= 0) {
      const bookedByViewer = summary.bookedByViewer === true;
      const label = bookedByViewer ? "Fully booked" : "Unavailable";
      return {
        label,
        ariaLabel: `${label}, ${slotCount} slots`,
        alertLabel: `${slotCount}`,
        alertAriaLabel: `${slotCount} slots`,
        toneClass: bookedByViewer ? "calendar-counter-booked-full" : "calendar-counter-full"
      };
    }
    return {
      label: priceLabel,
      ariaLabel: `${priceLabel}, ${slotCount} slots`,
      alertLabel: `${slotCount}`,
      alertAriaLabel: `${slotCount} slots`,
      toneClass: slotCount > 0 ? null : "calendar-counter-empty"
    };
  }
  onPopupAction(event) {
    event.sourceEvent.preventDefault();
    event.sourceEvent.stopPropagation();
    if (event.action.id === "slot-picker-calendar") {
      this.toggleMonthView(event.sourceEvent);
    }
  }
  onPopupMenuSelect(event) {
    event.itemSelect.sourceEvent.preventDefault();
    event.itemSelect.sourceEvent.stopPropagation();
    if (event.itemSelect.id === "save") {
      void this.saveBasket();
      return;
    }
    if (event.itemSelect.id === "basket") {
      this.toggleBasketView(event.itemSelect.sourceEvent);
    }
  }
  openPricingSummary(slot, event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.pricingSummarySlot = slot;
    this.cdr.markForCheck();
  }
  pricingSummaryPopupModel() {
    const slot = this.pricingSummarySlot;
    return {
      title: "Price summary",
      subtitle: slot?.title ?? null,
      secondarySubtitle: slot?.timeframe ?? null,
      ariaLabel: "Slot price summary",
      closeAriaLabel: "Close price summary",
      closeOnBackdrop: true,
      showClose: true,
      size: "default",
      height: "auto",
      headerTone: "accent",
      backdropTone: "dim",
      onClose: (event) => this.closePricingSummary(event)
    };
  }
  pricingSummaryRows(slot) {
    if (!slot) {
      return [];
    }
    const slotRows = (slot.pricingSummaryRows ?? []).length > 0 ? slot.pricingSummaryRows : [{
      key: `slot:${slot.id}:base`,
      label: "Base price",
      detail: null,
      amount: slot.amount,
      currency: slot.currency,
      multiplier: 1
    }];
    return [
      ...slotRows,
      ...this.selectedOptionalSubEvents(slot).flatMap((subEvent) => this.resolveOptionalSubEventPricing(subEvent).rows)
    ];
  }
  pricingSummaryItems(slot) {
    if (!slot) {
      return [];
    }
    const items = [{
      id: `event:${slot.parentEventId}:${slot.id}`,
      title: slot.title || "Selected slot",
      meta: slot.timeframe || this.formatDateGroup(slot.startAtIso),
      detail: null,
      amount: slot.amount,
      currency: slot.currency,
      quantity: 1,
      status: this.isSelected(slot) ? "confirmed" : "draft",
      pricingSummaryRows: (slot.pricingSummaryRows ?? []).length > 0 ? slot.pricingSummaryRows : this.pricingSummaryRows(slot).filter((row) => `${row.key ?? ""}`.startsWith(`slot:${slot.id}`))
    }];
    for (const subEvent of this.selectedOptionalSubEvents(slot)) {
      const pricing = this.resolveOptionalSubEventPricing(subEvent);
      items.push({
        id: `subevent:${subEvent.id}:${slot.id}`,
        title: subEvent.name || "Optional sub event",
        meta: "Optional add-on",
        detail: subEvent.description || null,
        amount: pricing.amount,
        currency: pricing.currency,
        quantity: 1,
        status: "draft",
        pricingSummaryRows: pricing.rows
      });
    }
    return items;
  }
  pricingSummaryTotalAmount(slot) {
    return slot ? this.slotTotalAmount(slot) : 0;
  }
  pricingSummaryCurrency(slot) {
    return slot ? this.slotCurrency(slot) : "USD";
  }
  closePricingSummary(event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.pricingSummarySlot = null;
    this.cdr.markForCheck();
  }
  toggleOptionalSlotEvent(slot, subEventId) {
    const option = this.optionalSubEvents().find((item) => item.id === subEventId);
    if (option && this.isOptionalSubEventDisabled(slot, option)) {
      return;
    }
    const current = this.selectionsBySlotId.get(slot.id) ?? {
      slot,
      optionalSubEventIds: [],
      countedOptionalSubEventIds: [],
      occupancyCounted: false
    };
    const optionalSubEventIds = current.optionalSubEventIds.includes(subEventId) ? current.optionalSubEventIds.filter((item) => item !== subEventId) : [...current.optionalSubEventIds, subEventId];
    this.selectionsBySlotId.set(slot.id, {
      slot,
      optionalSubEventIds,
      countedOptionalSubEventIds: current.countedOptionalSubEventIds,
      occupancyCounted: current.occupancyCounted
    });
    this.selectionRevision += 1;
    this.cdr.markForCheck();
  }
  slotCapacityTotal(slot) {
    return Math.max(0, Math.trunc(Number(slot.capacityTotal) || 0));
  }
  slotAvailableCount(slot) {
    return Math.max(0, Math.trunc(Number(slot.availableSlots) || 0));
  }
  isSlotFullyUnavailable(slot) {
    return this.slotCapacityTotal(slot) > 0 && !this.isSelected(slot) && !this.removedCountedSlotIds.has(slot.id) && this.slotAvailableCount(slot) <= 0;
  }
  isBookedSlotFull(slot) {
    return this.slotCapacityTotal(slot) > 0 && this.slotAvailableCount(slot) <= 0;
  }
  optionalSubEventCapacityTotal(subEvent) {
    return Math.max(0, Math.trunc(Number(subEvent.capacityTotal) || 0));
  }
  optionalSubEventUsedCount(subEvent) {
    const reserved = Math.max(0, Math.trunc(Number(subEvent.reservedCount) || 0));
    return Math.max(0, reserved + this.selectedOptionalSubEventDelta(subEvent.id));
  }
  optionalSubEventAvailableCount(subEvent) {
    const capacity = this.optionalSubEventCapacityTotal(subEvent);
    return Math.max(0, capacity - this.optionalSubEventUsedCount(subEvent));
  }
  optionalSubEventCapacityBadge(subEvent) {
    const capacity = this.optionalSubEventCapacityTotal(subEvent);
    if (capacity <= 0) {
      return "Unavailable";
    }
    return `${Math.min(capacity, this.optionalSubEventUsedCount(subEvent))} / ${capacity}`;
  }
  optionalSubEventPriceLabel(subEvent) {
    return this.formatMoney(subEvent.amount, subEvent.currency);
  }
  selectedOptionalSubEvents(slot) {
    const selectedIds = this.selectionsBySlotId.get(slot.id)?.optionalSubEventIds ?? [];
    if (selectedIds.length === 0) {
      return [];
    }
    const selectedIdSet = new Set(selectedIds);
    return this.optionalSubEvents().filter((item) => selectedIdSet.has(item.id));
  }
  selectedOptionalSubEventAmount(slot) {
    return this.selectedOptionalSubEvents(slot).reduce((sum, subEvent) => sum + (Number(subEvent.amount) || 0), 0);
  }
  slotTotalAmount(slot) {
    return this.roundMoney((Number(slot.amount) || 0) + this.selectedOptionalSubEventAmount(slot));
  }
  slotCurrency(slot) {
    return slot.currency || this.selectedOptionalSubEvents(slot).find((item) => item.currency)?.currency || "USD";
  }
  selectedOptionalSubEventDelta(subEventId) {
    return [...this.selectionsBySlotId.values()].reduce((sum, selection) => {
      const selected = selection.optionalSubEventIds.includes(subEventId);
      const counted = selection.countedOptionalSubEventIds.includes(subEventId);
      if (selected && !counted) {
        return sum + 1;
      }
      if (!selected && counted) {
        return sum - 1;
      }
      return sum;
    }, 0);
  }
  isOptionalSubEventDisabled(slot, subEvent) {
    const selectedIds = this.selectionsBySlotId.get(slot.id)?.optionalSubEventIds ?? [];
    if (selectedIds.includes(subEvent.id)) {
      return false;
    }
    return this.isSlotUnavailable(slot) || this.optionalSubEventAvailableCount(subEvent) <= 0;
  }
  hasSelectionChanges() {
    return this.selectionSignature() !== this.baselineSelectionSignature;
  }
  selectionOccupancyCounted(slot) {
    return this.selectionsBySlotId.get(slot.id)?.occupancyCounted === true;
  }
  checkoutItemOccupancyCounted(item) {
    return this.isActiveBasketItem(item);
  }
  refreshBaselineSelection() {
    this.baselineSelectionSignature = this.selectionSignature();
  }
  isActiveBasketItem(item) {
    return this.isActiveCheckoutStatus(item.status) && !this.isInactiveCheckoutResultState(item.resultState) && !this.isExpiredBasketItem(item);
  }
  isActiveCheckoutStatus(status) {
    return status === "draft" || status === "confirmed" || status === "waiting" || status === "approval-pending" || status === "approved" || status === "pay";
  }
  isInactiveCheckoutResultState(resultState) {
    return resultState === "deleted" || resultState === "succeeded";
  }
  isExpiredBasketItem(item) {
    const expiresAtMs = Date.parse(`${item.expiresAtIso ?? ""}`.trim());
    return Number.isFinite(expiresAtMs) && expiresAtMs <= Date.now();
  }
  selectionSignature() {
    return [...this.selectionsBySlotId.values()].map((selection) => {
      const optionals = [...new Set(selection.optionalSubEventIds)].map((item) => item.trim()).filter(Boolean).sort();
      return `${selection.slot.id}::${optionals.join(",")}`;
    }).sort().join("|");
  }
  async saveBasket() {
    const state = this.popupState();
    if (!state || this.saving || !this.hasSelectionChanges()) {
      return;
    }
    this.saving = true;
    this.errorMessage = "";
    this.cdr.markForCheck();
    try {
      const request = this.buildCheckoutRequest(state.userId, state.record);
      const savedBasket = await this.eventsService.saveCheckoutBasket(request);
      this.checkoutDraftStore.save({
        userId: state.userId,
        sourceId: state.record.id,
        eventTitle: state.record.title,
        eventTimeframe: state.record.timeframe,
        slotSourceId: request.slotSourceId ?? null,
        selectedDateKey: request.basketItems?.[0]?.selectedDateKey ?? this.selectedDateKey,
        optionalSubEventIds: request.optionalSubEventIds,
        acceptedPolicyIds: [],
        appliedPromoCodes: [...request.appliedPromoCodes],
        basketItems: request.basketItems ?? [],
        pricingSummaryRows: request.pricingSummaryRows ?? [],
        checkoutState: request.checkoutState ?? "draft",
        lineItems: request.lineItems,
        totalAmount: request.totalAmount,
        currency: request.currency,
        checkoutSessionId: null,
        expiresAtIso: request.basketItems?.find((item) => item.expiresAtIso)?.expiresAtIso ?? null,
        pendingReason: null,
        updatedAtMs: Date.now()
      });
      await state.onSave?.(savedBasket, request.basketItems ?? []);
      this.refreshBaselineSelection();
      this.store.close();
    } catch (error) {
      this.errorMessage = error instanceof Error && error.message.trim() ? error.message.trim() : "Unable to save checkout basket.";
    } finally {
      this.saving = false;
      this.cdr.markForCheck();
    }
  }
  buildCheckoutRequest(userId, record) {
    const items = this.buildBasketItems(record);
    const lineItems = this.lineItemsFromBasketItems(items);
    const currency = items.find((item) => item.currency)?.currency ?? record.pricing?.currency ?? "USD";
    return {
      userId,
      sourceId: record.id,
      slotSourceId: items.find((item) => item.slotSourceId)?.slotSourceId ?? null,
      optionalSubEventIds: [...new Set(items.map((item) => item.subEventId).filter((item) => Boolean(item)))],
      assetSelections: [],
      acceptedPolicyIds: [],
      appliedPromoCodes: [...this.popupState()?.checkoutBasket?.appliedPromoCodes ?? []],
      basketItems: items,
      pricingSummaryRows: this.aggregatePricingSummaryRows(items.flatMap((item) => item.pricingSummaryRows ?? []), currency),
      checkoutState: "draft",
      lineItems,
      totalAmount: this.totalAmountFromLineItems(lineItems),
      currency,
      pendingReason: null
    };
  }
  buildBasketItems(record) {
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    const expiresAtIso = new Date(Date.now() + _EventCheckoutSlotPickerPopupComponent.CHECKOUT_BASKET_TTL_MS).toISOString();
    const items = [];
    for (const selection of this.selectionsBySlotId.values()) {
      const slot = selection.slot;
      const selectedDateKey = this.checkoutDateKey(slot.startAtIso);
      items.push({
        id: `event:${record.id}:${slot.id}`,
        kind: "event",
        sourceId: record.id,
        slotSourceId: slot.id,
        slotTemplateId: slot.slotTemplateId ?? null,
        selectedDateKey,
        subEventId: null,
        resourceType: null,
        label: record.title,
        detail: slot.timeframe || record.timeframe || "Main event",
        amount: slot.amount,
        currency: slot.currency,
        quantity: 1,
        status: "draft",
        resultState: "pending",
        pricingSummaryRows: slot.pricingSummaryRows ?? [],
        checkoutSessionId: null,
        createdAtIso: nowIso,
        updatedAtIso: nowIso,
        expiresAtIso
      });
      for (const subEvent of this.optionalSubEvents().filter((item) => selection.optionalSubEventIds.includes(item.id))) {
        const pricing = this.resolveOptionalSubEventPricing(subEvent);
        items.push({
          id: `subevent:${subEvent.id}:${slot.id}`,
          kind: "sub_event",
          sourceId: record.id,
          slotSourceId: slot.id,
          slotTemplateId: slot.slotTemplateId ?? null,
          selectedDateKey,
          subEventId: subEvent.id,
          resourceType: null,
          label: subEvent.name,
          detail: subEvent.description || "Optional sub event",
          amount: pricing.amount,
          currency: pricing.currency,
          quantity: 1,
          status: "draft",
          resultState: "pending",
          pricingSummaryRows: pricing.rows,
          checkoutSessionId: null,
          createdAtIso: nowIso,
          updatedAtIso: nowIso,
          expiresAtIso
        });
      }
    }
    return items;
  }
  resolveOptionalSubEventPricing(subEvent) {
    const amount = Math.max(0, Number(subEvent.amount) || 0);
    const currency = subEvent.currency || "USD";
    return {
      amount,
      currency,
      rows: subEvent.pricingSummaryRows?.length ? subEvent.pricingSummaryRows : [{
        key: `subevent:${subEvent.id}:base`,
        label: subEvent.name || "Optional sub event",
        detail: null,
        amount,
        currency,
        multiplier: 1
      }]
    };
  }
  lineItemsFromBasketItems(items) {
    return items.map((item) => ({
      id: item.id,
      kind: item.kind,
      label: item.label,
      detail: item.detail,
      amount: this.roundMoney((Number(item.amount) || 0) * Math.max(1, Math.trunc(Number(item.quantity) || 1))),
      currency: item.currency
    }));
  }
  aggregatePricingSummaryRows(rows, fallbackCurrency) {
    const grouped = /* @__PURE__ */ new Map();
    for (const row of rows) {
      const label = `${row.label ?? ""}`.trim();
      if (!label) {
        continue;
      }
      const amount = Number.isFinite(row.amount) ? Number(row.amount) : null;
      const currency = `${row.currency ?? fallbackCurrency ?? "USD"}`.trim() || "USD";
      const detail = `${row.detail ?? ""}`.trim();
      const key = `${row.key || label}:${detail}:${amount ?? "none"}:${currency}`;
      const multiplier = Math.max(1, Math.trunc(Number(row.multiplier) || 1));
      const existing = grouped.get(key);
      if (!existing) {
        grouped.set(key, {
          key,
          label,
          detail: detail || null,
          amount: amount === null ? null : this.roundMoney(amount * multiplier),
          currency,
          multiplier
        });
        continue;
      }
      grouped.set(key, __spreadProps(__spreadValues({}, existing), {
        multiplier: Math.max(1, Math.trunc(Number(existing.multiplier) || 1)) + multiplier,
        amount: existing.amount !== null && amount !== null ? this.roundMoney(Number(existing.amount) + amount * multiplier) : existing.amount ?? amount
      }));
    }
    return [...grouped.values()];
  }
  totalAmountFromLineItems(items) {
    return this.roundMoney(items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0));
  }
  slotFromBasketItem(record, item) {
    const slotId = item.slotSourceId?.trim();
    if (!slotId) {
      return null;
    }
    const existing = (record.upcomingSlots ?? []).find((slot) => slot.id === slotId);
    if (existing) {
      return {
        id: existing.id,
        parentEventId: existing.parentEventId || record.id,
        slotSourceId: existing.id,
        slotTemplateId: existing.slotTemplateId ?? null,
        title: existing.title || record.title,
        timeframe: existing.timeframe || item.detail,
        startAtIso: existing.startAtIso,
        endAtIso: existing.endAtIso,
        capacityTotal: existing.capacityTotal,
        acceptedMembers: existing.acceptedMembers,
        pendingMembers: existing.pendingMembers,
        availableSlots: Math.max(0, existing.capacityTotal - existing.acceptedMembers - existing.pendingMembers),
        amount: item.amount,
        currency: item.currency,
        pricingSummaryRows: item.pricingSummaryRows ?? []
      };
    }
    return {
      id: slotId,
      parentEventId: record.id,
      slotSourceId: slotId,
      slotTemplateId: item.slotTemplateId ?? null,
      title: record.title,
      timeframe: item.detail,
      startAtIso: item.selectedDateKey ? `${item.selectedDateKey}T00:00:00.000Z` : record.startAtIso,
      endAtIso: item.selectedDateKey ? `${item.selectedDateKey}T23:59:59.000Z` : record.endAtIso,
      capacityTotal: 0,
      acceptedMembers: 0,
      pendingMembers: 0,
      availableSlots: 0,
      amount: item.amount,
      currency: item.currency,
      pricingSummaryRows: item.pricingSummaryRows ?? []
    };
  }
  optionalSubEvents() {
    return this.optionalSubEventOptions;
  }
  refreshSlotQuery(reset = true) {
    this.slotListQuery = this.buildSlotListQuery(reset ? null : this.slotListQuery.cursor ?? null);
    this.cdr.markForCheck();
  }
  refreshMonthQuery() {
    this.monthListQuery = this.buildMonthListQuery();
    this.cdr.markForCheck();
  }
  buildSlotListQuery(cursor = null) {
    return {
      cursor,
      filters: {
        dateKey: this.selectedDateKey,
        view: this.basketMode ? "basket" : "day",
        revision: this.queryRevision
      }
    };
  }
  initialSelectedDateKey(record, basket, eventItems, selectedDateKey) {
    const availableDateKeys = new Set((record.upcomingSlots ?? []).map((slot) => this.checkoutDateKey(slot.startAtIso)).filter(Boolean));
    const selectedItemDateKeys = new Set(eventItems.map((item) => item.selectedDateKey?.slice(0, 10) ?? "").filter(Boolean));
    const candidates = [
      selectedDateKey?.slice(0, 10) ?? "",
      basket?.selectedDateKey?.slice(0, 10) ?? "",
      eventItems[0]?.selectedDateKey?.slice(0, 10) ?? ""
    ];
    for (const candidate of candidates) {
      if (candidate && (availableDateKeys.size === 0 || availableDateKeys.has(candidate) || selectedItemDateKeys.has(candidate))) {
        return candidate;
      }
    }
    return [...availableDateKeys].sort()[0] ?? this.todayKey();
  }
  buildMonthListQuery() {
    const anchor = this.monthStart(this.selectedDateKey);
    return {
      anchorDate: anchor,
      rangeStart: this.monthStart(anchor),
      rangeEnd: this.monthEnd(anchor),
      filters: {
        anchor,
        revision: this.queryRevision
      }
    };
  }
  close(event) {
    event?.preventDefault();
    event?.stopPropagation();
    if (this.saving) {
      return;
    }
    this.store.close();
  }
  formatRecordRange(record) {
    if (!record) {
      return "";
    }
    const timeframe = record.timeframe?.trim() || this.formatDateGroup(record.startAtIso);
    const range = this.formatRecordDateRange(record);
    return range ? `${timeframe} \u2022 ${range}` : timeframe;
  }
  formatRecordDateRange(record) {
    const start = AppUtils.isoLocalDateTimeToDate(record.startAtIso);
    const end = AppUtils.isoLocalDateTimeToDate(record.endAtIso);
    if (!start || !end) {
      return "";
    }
    if (start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    const sameYear = start.getFullYear() === end.getFullYear();
    const startLabel = start.toLocaleDateString("en-US", __spreadValues({
      month: "short",
      day: "numeric"
    }, sameYear ? {} : { year: "numeric" }));
    const endLabel = end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    return `${startLabel} - ${endLabel}`;
  }
  formatDateGroup(value) {
    const parsed = AppUtils.isoLocalDateTimeToDate(value);
    return parsed ? parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : value.slice(0, 10);
  }
  formatMoney(amount, currency) {
    const normalizedCurrency = `${currency || "USD"}`.trim().toUpperCase();
    if (normalizedCurrency === "EUR") {
      return `EUR ${this.roundMoney(amount).toFixed(2)}`;
    }
    if (normalizedCurrency === "GBP") {
      return `GBP ${this.roundMoney(amount).toFixed(2)}`;
    }
    return `$${this.roundMoney(amount).toFixed(2)}`;
  }
  monthStart(dateKey) {
    const date = this.parseDateKey(dateKey) ?? /* @__PURE__ */ new Date();
    return this.dateKey(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1)));
  }
  monthEnd(dateKey) {
    const date = this.parseDateKey(dateKey) ?? /* @__PURE__ */ new Date();
    return this.dateKey(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)));
  }
  todayKey() {
    return this.dateKey(/* @__PURE__ */ new Date());
  }
  parseDateKey(value) {
    const ms = Date.parse(`${value}T00:00:00.000Z`);
    return Number.isFinite(ms) ? new Date(ms) : null;
  }
  checkoutDateKey(value) {
    const ms = this.sortableDateMs(value);
    return ms ? this.dateKey(new Date(ms)) : "";
  }
  dateKey(value) {
    return value.toISOString().slice(0, 10);
  }
  sortableDateMs(value) {
    const ms = Date.parse(`${value ?? ""}`.trim());
    return Number.isFinite(ms) ? ms : 0;
  }
  roundMoney(value) {
    return Math.round((Number(value) || 0) * 100) / 100;
  }
  static \u0275fac = function EventCheckoutSlotPickerPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EventCheckoutSlotPickerPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EventCheckoutSlotPickerPopupComponent, selectors: [["app-event-checkout-slot-picker-popup"]], decls: 2, vars: 2, consts: [["slotItemTemplate", ""], [3, "model", "zIndex"], [1, "event-checkout-slot-picker"], [1, "event-checkout-slot-picker__error"], [1, "event-checkout-slot-picker__viewport"], [1, "event-checkout-slot-picker__slots", 3, "itemSelect", "config", "loadPage", "itemTemplate", "query"], ["aria-label", "Available slot calendar", 1, "event-checkout-slot-picker__month-overlay"], [1, "event-checkout-slot-picker__month-list", 3, "itemSelect", "config", "loadPage", "query", "view"], [1, "event-checkout-slot-picker__slot-card"], ["icon", "event_seat", "badgeTone", "price", "menuPalette", "muted", "selectPalette", "picker", "selectIcon", "add", "selectedIcon", "check", 1, "event-checkout-slot-picker__text-card", 3, "selectionToggle", "badgeClick", "menuSelect", "tone", "disabled", "title", "subtitle", "meta", "detail", "badge", "badgeClickable", "badgeAriaLabel", "statusBadge", "statusBadgeTone", "menuTitle", "menuItems", "selectable", "selected", "selectDisabled", "selectAriaLabel"], ["tone", "ready", 1, "event-checkout-slot-picker__pricing-summary", 3, "config", "items", "pricingSummaryRows", "totalAmount", "currency"]], template: function EventCheckoutSlotPickerPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, EventCheckoutSlotPickerPopupComponent_Conditional_0_Template, 8, 12, "app-popup", 1);
      \u0275\u0275conditionalCreate(1, EventCheckoutSlotPickerPopupComponent_Conditional_1_Template, 2, 7, "app-popup", 1);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.popupState() ? 0 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.pricingSummarySlot ? 1 : -1);
    }
  }, dependencies: [
    CommonModule,
    MatIconModule,
    PopupComponent,
    SmartListComponent,
    TextCardComponent,
    EventBasketInputComponent
  ], styles: ["\n[_nghost-%COMP%] {\n  display: contents;\n}\n.event-checkout-slot-picker[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  gap: 0.85rem;\n  min-height: 0;\n  height: 100%;\n  padding: 0.85rem;\n  box-sizing: border-box;\n}\n[_nghost-%COMP%]     .ui-popup__toolbar .ui-popup__date-input .date-input__toggle {\n  display: none;\n}\n.event-checkout-slot-picker__error[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  margin: 0;\n  padding: 0.58rem 0.72rem;\n  border: 1px solid rgba(185, 67, 79, 0.28);\n  border-radius: 8px;\n  color: #8b2935;\n  background: #fff6f7;\n  font-size: 0.82rem;\n  line-height: 1.35;\n  font-weight: 800;\n}\n.event-checkout-slot-picker__viewport[_ngcontent-%COMP%] {\n  position: relative;\n  flex: 1 1 auto;\n  display: flex;\n  min-height: 0;\n  min-width: 0;\n}\n.event-checkout-slot-picker__slots[_ngcontent-%COMP%], \n.event-checkout-slot-picker__month-list[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  min-height: 0;\n  min-width: 0;\n}\n.event-checkout-slot-picker__month-overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  z-index: 40;\n  inset: 0;\n  display: flex;\n  min-width: 0;\n  min-height: 0;\n  background: #ffffff;\n  isolation: isolate;\n  overflow: hidden;\n}\n.event-checkout-slot-picker.is-month-view[_ngcontent-%COMP%]   .event-checkout-slot-picker__slots[_ngcontent-%COMP%] {\n  visibility: hidden;\n  pointer-events: none;\n}\n[_nghost-%COMP%]     .event-checkout-slot-picker__month-list .smart-list__surface, \n[_nghost-%COMP%]     .event-checkout-slot-picker__month-list .smart-list__stage, \n[_nghost-%COMP%]     .event-checkout-slot-picker__month-list .smart-list__page-shell, \n[_nghost-%COMP%]     .event-checkout-slot-picker__month-list .smart-list--page, \n[_nghost-%COMP%]     .event-checkout-slot-picker__month-list .calendar-card__pages {\n  background: #ffffff;\n}\n[_nghost-%COMP%]     .event-checkout-slot-picker__slots .smart-list__surface, \n[_nghost-%COMP%]     .event-checkout-slot-picker__slots .smart-list__stage, \n[_nghost-%COMP%]     .event-checkout-slot-picker__slots .smart-list__stage-list-shell, \n[_nghost-%COMP%]     .event-checkout-slot-picker__slots .smart-list, \n[_nghost-%COMP%]     .event-checkout-slot-picker__month-list .smart-list__surface, \n[_nghost-%COMP%]     .event-checkout-slot-picker__month-list .smart-list__stage, \n[_nghost-%COMP%]     .event-checkout-slot-picker__month-list .smart-list__stage-list-shell, \n[_nghost-%COMP%]     .event-checkout-slot-picker__month-list .smart-list__page-shell, \n[_nghost-%COMP%]     .event-checkout-slot-picker__month-list .calendar-card__pages {\n  height: 100%;\n  min-height: 0;\n}\n[_nghost-%COMP%]     .event-checkout-slot-picker-list {\n  gap: 0.66rem;\n  padding: 0.1rem 0 0.5rem;\n}\n.event-checkout-slot-picker__slot-card[_ngcontent-%COMP%] {\n  position: relative;\n  min-width: 0;\n  height: 100%;\n}\n.event-checkout-slot-picker__text-card[_ngcontent-%COMP%] {\n  display: block;\n  height: 100%;\n}\n[_nghost-%COMP%]     .event-checkout-slot-picker__text-card.has-slot-badge-space .ui-text-card {\n  min-height: 128px;\n  padding-top: 2.45rem;\n}\n.event-checkout-slot-picker__pricing-summary[_ngcontent-%COMP%] {\n  display: block;\n  padding: 0.78rem;\n  min-width: min(460px, 100vw - 2.4rem);\n  box-sizing: border-box;\n}\n@media (max-width: 720px) {\n  .event-checkout-slot-picker[_ngcontent-%COMP%] {\n    padding: 0.7rem;\n  }\n}\n/*# sourceMappingURL=event-checkout-slot-picker-popup.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EventCheckoutSlotPickerPopupComponent, [{
    type: Component,
    args: [{ selector: "app-event-checkout-slot-picker-popup", standalone: true, imports: [
      CommonModule,
      MatIconModule,
      PopupComponent,
      SmartListComponent,
      TextCardComponent,
      EventBasketInputComponent
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `@if (popupState()) {
  <app-popup [model]="popupModel()" [zIndex]="4920">
    <div class="event-checkout-slot-picker" [class.is-saving]="saving" [class.is-month-view]="isMonthView()">
      @if (errorMessage) {
        <p class="event-checkout-slot-picker__error">{{ errorMessage }}</p>
      }

      <div class="event-checkout-slot-picker__viewport">
        <app-smart-list
          class="event-checkout-slot-picker__slots"
          [config]="slotListConfig"
          [loadPage]="slotLoadPage"
          [itemTemplate]="slotItemTemplate"
          [query]="slotListQuery"
          (itemSelect)="onSlotItemSelect($event)"
        ></app-smart-list>

        @if (isMonthView()) {
          <section class="event-checkout-slot-picker__month-overlay" aria-label="Available slot calendar">
            <app-smart-list
              class="event-checkout-slot-picker__month-list"
              [config]="monthListConfig"
              [loadPage]="monthLoadPage"
              [query]="monthListQuery"
              [view]="'month'"
              (itemSelect)="onMonthDaySelect($event)"
            ></app-smart-list>
          </section>
        }
      </div>

      <ng-template #slotItemTemplate let-slot let-selectItem="selectItem">
        <article
          class="event-checkout-slot-picker__slot-card"
          [class.is-selected]="isSelected(slot)"
          [class.is-booked]="isSlotBooked(slot)"
        >
          <app-text-card
            class="event-checkout-slot-picker__text-card"
            [class.has-slot-badge-space]="true"
            [tone]="slotCardTone(slot)"
            [disabled]="isSlotUnavailable(slot)"
            icon="event_seat"
            [title]="slot.title"
            [subtitle]="slot.timeframe"
            [meta]="''"
            [detail]="selectedOptionalLabel(slot)"
            [badge]="slotPriceLabel(slot)"
            badgeTone="price"
            [badgeClickable]="slotShowsPrice(slot)"
            [badgeAriaLabel]="'Show price summary for ' + slot.title"
            [statusBadge]="slotCapacityBadge(slot)"
            [statusBadgeTone]="slotCapacityBadgeTone(slot)"
            [menuTitle]="slot.title"
            menuPalette="muted"
            [menuItems]="slotActionsDisabled(slot) ? [] : slotMenuItems(slot)"
            [selectable]="!slotActionsDisabled(slot)"
            [selected]="isSelected(slot)"
            [selectDisabled]="saving || slotActionsDisabled(slot)"
            selectPalette="picker"
            selectIcon="add"
            selectedIcon="check"
            [selectAriaLabel]="isSelected(slot) ? 'Remove slot from basket' : 'Add slot to basket'"
            (selectionToggle)="selectItem($event)"
            (badgeClick)="openPricingSummary(slot, $event)"
            (menuSelect)="onSlotMenuSelect(slot, $event)"
          ></app-text-card>
        </article>
      </ng-template>
    </div>
  </app-popup>
}

@if (pricingSummarySlot) {
  <app-popup [model]="pricingSummaryPopupModel()" [zIndex]="4930">
    <app-event-basket-input
      class="event-checkout-slot-picker__pricing-summary"
      [config]="pricingSummaryBasketConfig"
      [items]="pricingSummaryItems(pricingSummarySlot)"
      [pricingSummaryRows]="pricingSummaryRows(pricingSummarySlot)"
      [totalAmount]="pricingSummaryTotalAmount(pricingSummarySlot)"
      [currency]="pricingSummaryCurrency(pricingSummarySlot)"
      tone="ready"
    ></app-event-basket-input>
  </app-popup>
}
`, styles: ["/* src/app/activity/components/event-checkout-slot-picker-popup/event-checkout-slot-picker-popup.component.scss */\n:host {\n  display: contents;\n}\n.event-checkout-slot-picker {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  gap: 0.85rem;\n  min-height: 0;\n  height: 100%;\n  padding: 0.85rem;\n  box-sizing: border-box;\n}\n:host ::ng-deep .ui-popup__toolbar .ui-popup__date-input .date-input__toggle {\n  display: none;\n}\n.event-checkout-slot-picker__error {\n  flex: 0 0 auto;\n  margin: 0;\n  padding: 0.58rem 0.72rem;\n  border: 1px solid rgba(185, 67, 79, 0.28);\n  border-radius: 8px;\n  color: #8b2935;\n  background: #fff6f7;\n  font-size: 0.82rem;\n  line-height: 1.35;\n  font-weight: 800;\n}\n.event-checkout-slot-picker__viewport {\n  position: relative;\n  flex: 1 1 auto;\n  display: flex;\n  min-height: 0;\n  min-width: 0;\n}\n.event-checkout-slot-picker__slots,\n.event-checkout-slot-picker__month-list {\n  flex: 1 1 auto;\n  min-height: 0;\n  min-width: 0;\n}\n.event-checkout-slot-picker__month-overlay {\n  position: absolute;\n  z-index: 40;\n  inset: 0;\n  display: flex;\n  min-width: 0;\n  min-height: 0;\n  background: #ffffff;\n  isolation: isolate;\n  overflow: hidden;\n}\n.event-checkout-slot-picker.is-month-view .event-checkout-slot-picker__slots {\n  visibility: hidden;\n  pointer-events: none;\n}\n:host ::ng-deep .event-checkout-slot-picker__month-list .smart-list__surface,\n:host ::ng-deep .event-checkout-slot-picker__month-list .smart-list__stage,\n:host ::ng-deep .event-checkout-slot-picker__month-list .smart-list__page-shell,\n:host ::ng-deep .event-checkout-slot-picker__month-list .smart-list--page,\n:host ::ng-deep .event-checkout-slot-picker__month-list .calendar-card__pages {\n  background: #ffffff;\n}\n:host ::ng-deep .event-checkout-slot-picker__slots .smart-list__surface,\n:host ::ng-deep .event-checkout-slot-picker__slots .smart-list__stage,\n:host ::ng-deep .event-checkout-slot-picker__slots .smart-list__stage-list-shell,\n:host ::ng-deep .event-checkout-slot-picker__slots .smart-list,\n:host ::ng-deep .event-checkout-slot-picker__month-list .smart-list__surface,\n:host ::ng-deep .event-checkout-slot-picker__month-list .smart-list__stage,\n:host ::ng-deep .event-checkout-slot-picker__month-list .smart-list__stage-list-shell,\n:host ::ng-deep .event-checkout-slot-picker__month-list .smart-list__page-shell,\n:host ::ng-deep .event-checkout-slot-picker__month-list .calendar-card__pages {\n  height: 100%;\n  min-height: 0;\n}\n:host ::ng-deep .event-checkout-slot-picker-list {\n  gap: 0.66rem;\n  padding: 0.1rem 0 0.5rem;\n}\n.event-checkout-slot-picker__slot-card {\n  position: relative;\n  min-width: 0;\n  height: 100%;\n}\n.event-checkout-slot-picker__text-card {\n  display: block;\n  height: 100%;\n}\n:host ::ng-deep .event-checkout-slot-picker__text-card.has-slot-badge-space .ui-text-card {\n  min-height: 128px;\n  padding-top: 2.45rem;\n}\n.event-checkout-slot-picker__pricing-summary {\n  display: block;\n  padding: 0.78rem;\n  min-width: min(460px, 100vw - 2.4rem);\n  box-sizing: border-box;\n}\n@media (max-width: 720px) {\n  .event-checkout-slot-picker {\n    padding: 0.7rem;\n  }\n}\n/*# sourceMappingURL=event-checkout-slot-picker-popup.component.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EventCheckoutSlotPickerPopupComponent, { className: "EventCheckoutSlotPickerPopupComponent", filePath: "app/activity/components/event-checkout-slot-picker-popup/event-checkout-slot-picker-popup.component.ts", lineNumber: 85 });
})();
export {
  EventCheckoutSlotPickerPopupComponent
};
//# sourceMappingURL=event-checkout-slot-picker-popup.component-POKFWO6T.js.map
