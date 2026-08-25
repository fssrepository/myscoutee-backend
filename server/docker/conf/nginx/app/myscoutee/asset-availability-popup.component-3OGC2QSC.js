import {
  AssetAvailabilityPopupStore
} from "./chunk-RKNUQ7BV.js";
import "./chunk-GNEKNDCW.js";
import {
  DialogComponent
} from "./chunk-EFOSAJ7V.js";
import "./chunk-K46F5X52.js";
import "./chunk-DCIHJJ5Y.js";
import "./chunk-PA3YBM43.js";
import "./chunk-FJ66QUKQ.js";
import "./chunk-SYKOEE4K.js";
import "./chunk-KQF6FQ63.js";
import {
  AssetStore
} from "./chunk-PM3I2T2H.js";
import {
  SmartListComponent
} from "./chunk-QGX3AOF4.js";
import {
  SubEventResourcePopupStore
} from "./chunk-7YBTTPXY.js";
import "./chunk-ECWKXWGH.js";
import "./chunk-QNXIGSHX.js";
import "./chunk-UNJZCHXH.js";
import "./chunk-JEQIAF2O.js";
import "./chunk-U7SHZOGZ.js";
import {
  AssetAvailabilitySingleRowConverter
} from "./chunk-52WP4I47.js";
import "./chunk-RJSPRCFL.js";
import {
  SingleRowComponent
} from "./chunk-XXLX3JOX.js";
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
import "./chunk-QD6QQNQX.js";
import "./chunk-OAYWPJGG.js";
import {
  DialogStore
} from "./chunk-6TR3Z2F3.js";
import "./chunk-U46O4F4Y.js";
import "./chunk-EDHGCWPF.js";
import "./chunk-CUDLB52K.js";
import "./chunk-NJTJOLRZ.js";
import "./chunk-ZJ74HL3J.js";
import {
  AssetsService
} from "./chunk-C2QYRRDX.js";
import "./chunk-Y3NEBFNQ.js";
import "./chunk-PB4YNHSN.js";
import "./chunk-VUN7WUNQ.js";
import "./chunk-5PHTFUHA.js";
import {
  APP_STATIC_DATA,
  AssetCardBuilder
} from "./chunk-Y2Y4ZDHH.js";
import {
  I18nService
} from "./chunk-B7YPVC5F.js";
import {
  AppUtils,
  isAssetType
} from "./chunk-XQ4NDAVX.js";
import "./chunk-4FWVIYNI.js";
import "./chunk-MS7VTGLY.js";
import {
  CommonModule,
  NgComponentOutlet
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
  ChangeDetectorRef,
  Component,
  ViewChild,
  __spreadProps,
  __spreadValues,
  computed,
  effect,
  from,
  inject,
  map,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
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
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵviewQuery
} from "./chunk-XJL7SWH7.js";

// src/app/asset/components/asset-availability-popup/asset-availability-popup.component.ts
var _c0 = ["availabilitySmartList"];
var _c1 = ["dayListSmartList"];
function AssetAvailabilityPopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 4)(1, "app-smart-list", 6, 2);
    \u0275\u0275listener("viewChange", function AssetAvailabilityPopupComponent_Conditional_0_Template_app_smart_list_viewChange_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onViewChange($event));
    })("itemSelect", function AssetAvailabilityPopupComponent_Conditional_0_Template_app_smart_list_itemSelect_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onCalendarItemSelect($event));
    })("menuItemSelect", function AssetAvailabilityPopupComponent_Conditional_0_Template_app_smart_list_menuItemSelect_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSharedRowMenuAction($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    const availabilityRowTemplate_r3 = \u0275\u0275reference(7);
    \u0275\u0275property("model", ctx_r1.availabilityPopupModel())("zIndex", ctx_r1.availabilityPopupZIndex);
    \u0275\u0275advance();
    \u0275\u0275property("config", ctx_r1.availabilitySmartListConfig)("loadPage", ctx_r1.availabilitySmartListLoadPage)("query", ctx_r1.availabilityQuery())("view", ctx_r1.availabilityView())("itemTemplate", availabilityRowTemplate_r3);
  }
}
function AssetAvailabilityPopupComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 5)(1, "app-smart-list", 7, 3);
    \u0275\u0275listener("menuItemSelect", function AssetAvailabilityPopupComponent_Conditional_1_Template_app_smart_list_menuItemSelect_1_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSharedRowMenuAction($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    const dayRowTemplate_r5 = \u0275\u0275reference(9);
    \u0275\u0275property("model", ctx_r1.dayListPopupModel())("zIndex", ctx_r1.dayListPopupZIndex);
    \u0275\u0275advance();
    \u0275\u0275property("config", ctx_r1.dayListSmartListConfig)("loadPage", ctx_r1.dayListSmartListLoadPage)("query", ctx_r1.dayListQuery())("view", "day")("itemTemplate", dayRowTemplate_r5);
  }
}
function AssetAvailabilityPopupComponent_Conditional_2_Conditional_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function AssetAvailabilityPopupComponent_Conditional_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, AssetAvailabilityPopupComponent_Conditional_2_Conditional_0_ng_container_0_Template, 1, 0, "ng-container", 8);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngComponentOutlet", ctx)("ngComponentOutletInputs", ctx_r1.resourcePopupOutletInputs());
  }
}
function AssetAvailabilityPopupComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AssetAvailabilityPopupComponent_Conditional_2_Conditional_0_Template, 1, 2, "ng-container");
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_3_0 = ctx_r1.resourcePopupStore.eventResourcePopupComponent()) ? 0 : -1, tmp_3_0);
  }
}
function AssetAvailabilityPopupComponent_Conditional_3_Conditional_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function AssetAvailabilityPopupComponent_Conditional_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, AssetAvailabilityPopupComponent_Conditional_3_Conditional_0_ng_container_0_Template, 1, 0, "ng-container", 8);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngComponentOutlet", ctx)("ngComponentOutletInputs", ctx_r1.assetExplorePopupOutletInputs());
  }
}
function AssetAvailabilityPopupComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AssetAvailabilityPopupComponent_Conditional_3_Conditional_0_Template, 1, 2, "ng-container");
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_3_0 = ctx_r1.resourcePopupStore.eventResourceAssetExploreComponent()) ? 0 : -1, tmp_3_0);
  }
}
function AssetAvailabilityPopupComponent_Conditional_4_Conditional_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function AssetAvailabilityPopupComponent_Conditional_4_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, AssetAvailabilityPopupComponent_Conditional_4_Conditional_0_ng_container_0_Template, 1, 0, "ng-container", 9);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function AssetAvailabilityPopupComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AssetAvailabilityPopupComponent_Conditional_4_Conditional_0_Template, 1, 1, "ng-container");
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_3_0 = ctx_r1.resourcePopupStore.eventSupplyContributionsPopupComponent()) ? 0 : -1, tmp_3_0);
  }
}
function AssetAvailabilityPopupComponent_ng_template_6_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "single-row", 11);
    \u0275\u0275listener("menuRequest", function AssetAvailabilityPopupComponent_ng_template_6_Conditional_0_Template_single_row_menuRequest_0_listener($event) {
      \u0275\u0275restoreView(_r6);
      const openMenu_r7 = \u0275\u0275nextContext().openMenu;
      return \u0275\u0275resetView(openMenu_r7($event));
    })("menuAction", function AssetAvailabilityPopupComponent_ng_template_6_Conditional_0_Template_single_row_menuAction_0_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onRowMenuAction($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r7 = \u0275\u0275nextContext();
    const item_r9 = ctx_r7.$implicit;
    const groupLabel_r10 = ctx_r7.groupLabel;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("row", ctx_r1.availabilityRow(item_r9, groupLabel_r10))("useSharedMenu", true);
  }
}
function AssetAvailabilityPopupComponent_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AssetAvailabilityPopupComponent_ng_template_6_Conditional_0_Template, 1, 2, "single-row", 10);
  }
  if (rf & 2) {
    const item_r9 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r1.isAvailabilityRow(item_r9) ? 0 : -1);
  }
}
function AssetAvailabilityPopupComponent_ng_template_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "single-row", 11);
    \u0275\u0275listener("menuRequest", function AssetAvailabilityPopupComponent_ng_template_8_Template_single_row_menuRequest_0_listener($event) {
      const openMenu_r12 = \u0275\u0275restoreView(_r11).openMenu;
      return \u0275\u0275resetView(openMenu_r12($event));
    })("menuAction", function AssetAvailabilityPopupComponent_ng_template_8_Template_single_row_menuAction_0_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onRowMenuAction($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r13 = ctx.$implicit;
    const groupLabel_r14 = ctx.groupLabel;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("row", ctx_r1.availabilityRow(row_r13, groupLabel_r14))("useSharedMenu", true);
  }
}
var AssetAvailabilityPopupComponent = class _AssetAvailabilityPopupComponent {
  availabilityPopupZIndex = 12100;
  dayListPopupZIndex = 12200;
  assetsService = inject(AssetsService);
  i18n = inject(I18nService);
  assetStore = inject(AssetStore);
  userProfileStore = inject(UserProfileStore);
  dialogStore = inject(DialogStore);
  resourcePopupStore = inject(SubEventResourcePopupStore);
  availabilityPopupStore = inject(AssetAvailabilityPopupStore);
  cdr = inject(ChangeDetectorRef);
  availabilityRevision = signal(0, ...ngDevMode ? [{ debugName: "availabilityRevision" }] : (
    /* istanbul ignore next */
    []
  ));
  dayListRevision = signal(0, ...ngDevMode ? [{ debugName: "dayListRevision" }] : (
    /* istanbul ignore next */
    []
  ));
  availabilityViewOverride = signal(null, ...ngDevMode ? [{ debugName: "availabilityViewOverride" }] : (
    /* istanbul ignore next */
    []
  ));
  availabilityOrderOverride = signal(null, ...ngDevMode ? [{ debugName: "availabilityOrderOverride" }] : (
    /* istanbul ignore next */
    []
  ));
  availabilityFilterOverride = signal(null, ...ngDevMode ? [{ debugName: "availabilityFilterOverride" }] : (
    /* istanbul ignore next */
    []
  ));
  dayListFilterOverride = signal(null, ...ngDevMode ? [{ debugName: "dayListFilterOverride" }] : (
    /* istanbul ignore next */
    []
  ));
  availabilitySmartList;
  dayListSmartList;
  availabilityView = computed(() => {
    const request = this.availabilityPopupStore.availabilityPopup();
    return this.scopedOverrideValue(this.availabilityViewOverride(), this.requestIdentity(request), request?.view ?? "day");
  }, ...ngDevMode ? [{ debugName: "availabilityView" }] : (
    /* istanbul ignore next */
    []
  ));
  availabilityOrder = computed(() => {
    const request = this.availabilityPopupStore.availabilityPopup();
    return this.scopedOverrideValue(this.availabilityOrderOverride(), this.requestIdentity(request), "later");
  }, ...ngDevMode ? [{ debugName: "availabilityOrder" }] : (
    /* istanbul ignore next */
    []
  ));
  availabilityFilter = computed(() => {
    const request = this.availabilityPopupStore.availabilityPopup();
    return this.scopedOverrideValue(this.availabilityFilterOverride(), this.requestIdentity(request), request?.filter ?? "all");
  }, ...ngDevMode ? [{ debugName: "availabilityFilter" }] : (
    /* istanbul ignore next */
    []
  ));
  dayListFilter = computed(() => {
    const request = this.availabilityPopupStore.dayListPopup();
    return this.scopedOverrideValue(this.dayListFilterOverride(), this.requestIdentity(request), request?.filter ?? "all");
  }, ...ngDevMode ? [{ debugName: "dayListFilter" }] : (
    /* istanbul ignore next */
    []
  ));
  availabilityQuery = computed(() => {
    const request = this.availabilityPopupStore.availabilityPopup();
    const view = this.availabilityView();
    return this.buildQuery(view, this.availabilityFilter(), request?.initialDateIso ?? null, request?.rangeStart ?? null, request?.rangeEnd ?? null, this.availabilityRevision(), this.isCalendarAvailabilityView(view) ? null : this.availabilityOrder());
  }, ...ngDevMode ? [{ debugName: "availabilityQuery" }] : (
    /* istanbul ignore next */
    []
  ));
  dayListQuery = computed(() => {
    const request = this.availabilityPopupStore.dayListPopup();
    return this.buildQuery("day", this.dayListFilter(), request?.initialDateIso ?? null, request?.rangeStart ?? null, request?.rangeEnd ?? null, this.dayListRevision(), this.availabilityOrder());
  }, ...ngDevMode ? [{ debugName: "dayListQuery" }] : (
    /* istanbul ignore next */
    []
  ));
  availabilityHeader = computed(() => this.availabilityPopupStore.availabilityHeader(), ...ngDevMode ? [{ debugName: "availabilityHeader" }] : (
    /* istanbul ignore next */
    []
  ));
  dayListHeader = computed(() => this.availabilityPopupStore.dayListHeader() ?? this.availabilityPopupStore.availabilityHeader(), ...ngDevMode ? [{ debugName: "dayListHeader" }] : (
    /* istanbul ignore next */
    []
  ));
  dayListDateRangeInputModel = {
    mode: "range",
    precision: "date",
    valueFormat: "iso-date",
    range: {
      layout: "compact",
      start: {
        placeholder: "Start date"
      },
      end: {
        placeholder: "End date"
      }
    }
  };
  dayListDateRangeInputValue = computed(() => {
    const request = this.availabilityPopupStore.dayListPopup();
    const fallback = this.dateInputDateKey(request?.initialDateIso) ?? AppUtils.toIsoDate(/* @__PURE__ */ new Date());
    const startAt = this.dateInputDateKey(request?.rangeStart) ?? fallback;
    const endAt = this.dateInputDateKey(request?.rangeEnd) ?? startAt;
    return {
      startAt,
      endAt,
      precision: "date"
    };
  }, ...ngDevMode ? [{ debugName: "dayListDateRangeInputValue" }] : (
    /* istanbul ignore next */
    []
  ));
  resourcePopupOutletInputs = computed(() => ({
    parentZIndex: this.resourcePopupParentZIndex()
  }), ...ngDevMode ? [{ debugName: "resourcePopupOutletInputs" }] : (
    /* istanbul ignore next */
    []
  ));
  assetExplorePopupOutletInputs = computed(() => ({
    parentZIndex: this.resourcePopupParentZIndex()
  }), ...ngDevMode ? [{ debugName: "assetExplorePopupOutletInputs" }] : (
    /* istanbul ignore next */
    []
  ));
  rowBusyKey = "";
  constructor() {
    effect(() => {
      const request = this.resourcePopupStore.subEventResourcePopupRequest();
      if (!request || !this.isAnyAvailabilityPopupOpen()) {
        return;
      }
      void this.resourcePopupStore.ensureEventResourcePopupLoaded();
    });
    effect(() => {
      if (!this.shouldHostResourcePopup()) {
        return;
      }
      void this.resourcePopupStore.ensureEventResourcePopupLoaded();
    });
    effect(() => {
      if (!this.shouldHostResourcePopup() || !this.resourcePopupStore.assetExplorePopupRef()) {
        return;
      }
      void this.resourcePopupStore.ensureEventResourceAssetExploreLoaded();
    });
    effect(() => {
      if (!this.shouldHostSupplyContributionsPopup()) {
        return;
      }
      void this.resourcePopupStore.ensureEventSupplyContributionsPopupLoaded();
    });
    effect(() => {
      const update = this.resourcePopupStore.subEventResourceMetricsUpdate();
      if (!update || !this.isAnyAvailabilityPopupOpen()) {
        return;
      }
      this.applyResourceAssignmentQuantityUpdate(update);
    });
  }
  availabilitySmartListConfig = {
    pageSize: 40,
    initialPageSize: 40,
    defaultView: "day",
    views: [
      { key: "month", label: "Month", mode: "month", pageSize: 42 },
      { key: "week", label: "Week", mode: "week", pageSize: 14 },
      { key: "day", label: "Day", mode: "list", pageSize: 20 }
    ],
    calendarVariant: (query) => query.view === "week" || query.view === "month" ? "counter" : "default",
    calendar: {
      weekdayLabels: APP_STATIC_DATA.calendarWeekdayLabels,
      weekStartHour: 0,
      weekEndHour: 23,
      anchorRadius: 1,
      counterGranularity: "day",
      initialAnchor: (query) => query.filters?.dateIso ?? null,
      resolveDateRange: (item) => this.availabilityDateRange(item),
      dayCounter: (day) => this.availabilityDayCounter(day)
    },
    emptyLabel: "asset.requests.empty.availability.label",
    emptyDescription: (query) => this.assetAvailabilityEmptyDescription(query),
    headerProgress: {
      enabled: true,
      state: "active"
    },
    listLayout: "card-grid",
    desktopColumns: 1,
    snapMode: "mandatory",
    showStickyHeader: true,
    showGroupMarker: ({ groupIndex, scrollable }) => groupIndex > 0 || scrollable,
    groupBy: (item, query) => this.groupLabelForItem(item, query.view),
    trackBy: (index, item) => this.availabilityItemKey(item, index)
  };
  dayListSmartListConfig = {
    pageSize: 20,
    defaultView: "day",
    views: [
      { key: "day", label: "Day", mode: "list", pageSize: 20 }
    ],
    emptyLabel: "asset.requests.empty.day.label",
    emptyDescription: (query) => this.assetAvailabilityEmptyDescription(query),
    headerProgress: {
      enabled: true,
      state: "active"
    },
    listLayout: "card-grid",
    desktopColumns: 1,
    snapMode: "proximity",
    showStickyHeader: false,
    showGroupMarker: () => false,
    groupBy: (item) => this.groupLabelForDate(item.dateIso, "day"),
    trackBy: (_index, item) => item.id
  };
  isAvailabilityOpen() {
    return this.availabilityPopupStore.availabilityPopup() !== null;
  }
  isDayListOpen() {
    return this.availabilityPopupStore.dayListPopup() !== null;
  }
  shouldHostResourcePopup() {
    return this.isAnyAvailabilityPopupOpen() && (this.resourcePopupStore.subEventResourcePopupRequest() !== null || this.resourcePopupStore.popupContextRef()?.origin === "subEventResource");
  }
  shouldHostSupplyContributionsPopup() {
    return this.shouldHostResourcePopup() && !this.resourcePopupStore.assetExploreOnlyRef() && this.resourcePopupStore.supplyPopupRef() !== null;
  }
  isAnyAvailabilityPopupOpen() {
    return this.isAvailabilityOpen() || this.isDayListOpen();
  }
  resourcePopupParentZIndex() {
    return Math.max(this.availabilityPopupZIndex, this.dayListPopupZIndex);
  }
  availabilityPopupModel() {
    const header = this.availabilityHeader();
    return {
      title: header?.title ?? "Asset availability",
      subtitle: this.availabilitySubtitle(),
      secondarySubtitle: null,
      size: "wide",
      height: "full",
      bodyLayout: "fill",
      closeAriaLabel: "Close asset availability",
      headerControls: this.availabilityHeaderControls(),
      toolbarControls: this.availabilityToolbarControls(),
      onClose: () => this.availabilityPopupStore.closeAvailabilityPopup(),
      onMenuSelect: (event) => this.onPopupMenuSelect(event)
    };
  }
  dayListPopupModel() {
    const header = this.dayListHeader();
    return {
      title: header?.title ?? "Availability items",
      subtitle: header?.subtitle ?? null,
      size: "wide",
      height: "full",
      bodyLayout: "fill",
      backdropTone: "dim",
      closeAriaLabel: "Close day availability",
      toolbarControls: this.dayListToolbarControls(),
      onClose: () => this.availabilityPopupStore.closeDayListPopup(),
      onMenuSelect: (event) => this.onPopupMenuSelect(event),
      onDateInputChange: (event) => this.onPopupDateInputChange(event)
    };
  }
  availabilitySmartListLoadPage = (query, context) => {
    if (query.view === "week" || query.view === "month") {
      return this.loadStatsPage(query, context);
    }
    return this.loadRowsPage(query, context);
  };
  loadStatsPage = (query, context) => {
    const request = this.availabilityPopupStore.availabilityPopup();
    if (!request) {
      return from([this.emptyPage()]);
    }
    return from(this.assetsService.loadStatByAssetId({
      userId: request.ownerUserId,
      assetId: request.assetId,
      rangeStart: query.rangeStart ?? query.filters?.dateIso ?? void 0,
      rangeEnd: query.rangeEnd ?? query.filters?.dateIso ?? void 0,
      filter: query.filters?.filter ?? request.filter,
      order: void 0,
      page: query.page,
      pageSize: query.pageSize,
      cursor: query.cursor ?? null
    }, { signal: context?.signal })).pipe(map((result) => ({
      items: result.items,
      total: result.total,
      nextCursor: result.nextCursor ?? null
    })));
  };
  loadRowsPage = (query, context) => {
    const request = this.availabilityPopupStore.availabilityPopup();
    if (!request) {
      return from([this.emptyPage()]);
    }
    return from(this.assetsService.loadOccupancyByAssetId({
      userId: request.ownerUserId,
      assetId: request.assetId,
      dateIso: query.filters?.dateIso ?? request.initialDateIso ?? void 0,
      rangeStart: query.rangeStart ?? query.filters?.rangeStart ?? request.rangeStart ?? void 0,
      rangeEnd: query.rangeEnd ?? query.filters?.rangeEnd ?? request.rangeEnd ?? void 0,
      filter: query.filters?.filter ?? request.filter,
      order: query.filters?.order ?? this.orderFromDirection(query.direction),
      page: query.page,
      pageSize: query.pageSize,
      cursor: query.cursor ?? null
    }, { signal: context?.signal })).pipe(map((result) => ({
      items: result.items,
      total: result.total,
      nextCursor: result.nextCursor ?? null
    })));
  };
  dayListSmartListLoadPage = (query, context) => {
    const request = this.availabilityPopupStore.dayListPopup();
    if (!request) {
      return from([this.emptyPage()]);
    }
    return from(this.assetsService.loadOccupancyByAssetId({
      userId: request.ownerUserId,
      assetId: request.assetId,
      dateIso: query.filters?.dateIso ?? request.initialDateIso ?? void 0,
      rangeStart: query.rangeStart ?? query.filters?.rangeStart ?? request.rangeStart ?? void 0,
      rangeEnd: query.rangeEnd ?? query.filters?.rangeEnd ?? request.rangeEnd ?? void 0,
      filter: query.filters?.filter ?? request.filter,
      order: query.filters?.order ?? this.orderFromDirection(query.direction),
      page: query.page,
      pageSize: query.pageSize,
      cursor: query.cursor ?? null
    }, { signal: context?.signal })).pipe(map((result) => ({
      items: result.items,
      total: result.total,
      nextCursor: result.nextCursor ?? null
    })));
  };
  isAvailabilityRow(item) {
    return "requestKind" in item;
  }
  availabilityRow(row, groupLabel) {
    const converted = AssetAvailabilitySingleRowConverter.convert(row, {
      groupLabel,
      translate: (key, fallback) => this.i18n.translate(key, fallback)
    });
    return __spreadProps(__spreadValues({}, converted), {
      menuActions: this.rowMenuActions(row)
    });
  }
  applyResourceAssignmentQuantityUpdate(update) {
    const updates = update.assignmentQuantityUpdates ?? [];
    if (updates.length === 0) {
      return;
    }
    let patched = false;
    for (const item of updates) {
      const assetId = `${item.assetId ?? ""}`.trim();
      const subEventId = `${item.subEventId ?? ""}`.trim();
      const quantity = Math.max(1, Math.trunc(Number(item.quantity) || 1));
      if (!assetId || !subEventId) {
        continue;
      }
      const patchRow = (row) => {
        const previousQuantity = Math.max(1, Math.trunc(Number(row.quantity) || 1));
        const previousCapacity = Math.max(0, Math.trunc(Number(row.capacity) || 0));
        const baseCapacity = Math.max(0, Math.trunc(previousCapacity / previousQuantity));
        const capacity = baseCapacity * quantity;
        const occupied = Math.max(0, Math.trunc(Number(row.occupied) || 0));
        return __spreadProps(__spreadValues({}, row), {
          quantity,
          capacity,
          occupied,
          remaining: Math.max(0, capacity - occupied)
        });
      };
      const predicate = (row) => `${row.assetId ?? ""}`.trim() === assetId && `${row.subEventId ?? ""}`.trim() === subEventId && row.requestKind === "manual";
      patched = this.availabilitySmartList?.patchVisibleItem((row) => this.isAvailabilityRow(row) && predicate(row), (row) => this.isAvailabilityRow(row) ? patchRow(row) : row) === true || patched;
      patched = this.dayListSmartList?.patchVisibleItem((row) => predicate(row), (row) => patchRow(row)) === true || patched;
    }
    if (this.isCalendarAvailabilityView(this.availabilityView())) {
      this.availabilityRevision.update((revision) => revision + 1);
    }
    if (patched) {
      this.cdr.markForCheck();
    }
  }
  async onRowMenuAction(event) {
    const row = this.rowDetail(event.card.eagerDetail);
    const action = event.actionId;
    if (!row || action !== "accept" && action !== "remove" && action !== "makeManager" && action !== "revokeManager" && action !== "manage") {
      return;
    }
    if (action === "manage") {
      this.openAvailabilityResourceManager(row);
      return;
    }
    if (action === "accept" || action === "remove") {
      this.openAssetRequestActionConfirmation(row, action);
      return;
    }
    this.openAssetRequestActionConfirmation(row, action);
  }
  openAssetRequestActionConfirmation(row, action) {
    const accepting = action === "accept";
    const promoting = action === "makeManager";
    const revoking = action === "revokeManager";
    const requester = `${row.title ?? ""}`.trim() || this.i18n.translate("member", "Member");
    const asset = this.availabilityHeader()?.title || this.dayListHeader()?.title || this.i18n.translate("asset", "Asset");
    this.dialogStore.open({
      title: this.i18n.translate(accepting ? "asset.requests.confirm.accept.title" : promoting ? "asset.requests.promote.to.manager" : revoking ? "Visszavon\xE1s" : "asset.requests.confirm.reject.title"),
      message: promoting || revoking ? `${this.i18n.translate(promoting ? "asset.requests.promote.to.manager" : "Visszavon\xE1s")} \u2014 ${requester} \xB7 ${asset}` : this.i18n.translateParams(accepting ? "asset.requests.confirm.accept.message" : "asset.requests.confirm.reject.message", { requester, asset }),
      cancelLabel: this.i18n.translate("cancel", "Cancel"),
      confirmLabel: this.i18n.translate(promoting ? "asset.requests.promote.to.manager" : revoking ? "Visszavon\xE1s" : accepting ? "accept" : "reject"),
      busyConfirmLabel: this.i18n.translate(promoting ? "asset.requests.promoting" : revoking ? "Visszavon\xE1s..." : accepting ? "accepting" : "asset.requests.rejecting"),
      confirmTone: accepting || promoting ? "accent" : revoking ? "warning" : "danger",
      failureMessage: this.i18n.translate("asset.requests.confirm.failure"),
      onConfirm: async () => {
        try {
          await this.executeRowAction(row, action);
        } catch {
          throw new Error(this.i18n.translate("asset.requests.confirm.failure"));
        }
      }
    });
  }
  async executeRowAction(row, action) {
    const busyKey = `${row.assetId}:${row.id}:${action}`;
    this.rowBusyKey = busyKey;
    this.cdr.markForCheck();
    try {
      if (action === "makeManager") {
        await this.promoteAssetRequestToManager(row);
      } else if (action === "revokeManager") {
        await this.revokeAssetRequestManager(row);
      } else {
        await this.applyAssetRequestAction(row, action);
      }
      this.patchRequestCounterDelta(row, action);
      if (action === "makeManager" || action === "revokeManager") {
        this.patchVisibleManagerState(row, action === "makeManager");
      } else {
        this.reloadLists();
      }
    } finally {
      if (this.rowBusyKey === busyKey) {
        this.rowBusyKey = "";
      }
      this.cdr.markForCheck();
    }
  }
  onSharedRowMenuAction(event) {
    const context = event.context;
    const row = context?.row ?? context?.card ?? null;
    const actionId = `${context?.action?.id ?? event.id ?? ""}`.trim();
    if (!row || !actionId) {
      return;
    }
    void this.onRowMenuAction({
      id: row.id,
      actionId,
      action: {
        id: actionId
      },
      card: row
    });
  }
  onCalendarItemSelect(event) {
    const request = this.availabilityPopupStore.availabilityPopup();
    const dateIso = this.dateInputDateKey(event.calendarDateIso ?? event.calendarDate) ?? this.dateInputDateKey(event.item.dateIso) ?? `${event.item.dateIso ?? ""}`.trim();
    if (!request || !dateIso) {
      return;
    }
    const rangeStart = this.dateInputDateKey(dateIso) ?? dateIso;
    const rangeEnd = rangeStart;
    this.availabilityPopupStore.openDayListPopup({
      instanceId: `asset-availability-day:${request.assetId}:${rangeStart}:${rangeEnd}`,
      assetId: request.assetId,
      ownerUserId: request.ownerUserId,
      initialDateIso: rangeStart,
      rangeStart,
      rangeEnd,
      filter: this.availabilityFilter(),
      view: "day",
      source: "calendar-cell"
    }, this.availabilityHeader());
    void this.availabilityPopupStore.ensureAssetAvailabilityPopupLoaded();
  }
  onViewChange(view) {
    if (view === "day" || view === "week" || view === "month") {
      this.selectAvailabilityView(view);
    }
  }
  onPopupDateInputChange(event) {
    if (event.control.id !== "day-list-date-range") {
      return;
    }
    this.selectDayListRange(event.value);
  }
  onPopupMenuSelect(event) {
    const context = event.itemSelect.item?.context;
    if (!context) {
      return;
    }
    if (context.menu === "order") {
      this.selectAvailabilityOrder(context.order);
      return;
    }
    if (context.menu === "view") {
      this.selectAvailabilityView(context.view);
      return;
    }
    if (context.menu === "filter") {
      if (context.target === "day-list") {
        this.selectDayListFilter(context.filter);
        return;
      }
      this.selectAvailabilityFilter(context.filter);
    }
  }
  selectAvailabilityView(view) {
    if (this.availabilityView() === view) {
      return;
    }
    const request = this.availabilityPopupStore.availabilityPopup();
    this.availabilityViewOverride.set({
      requestIdentity: this.requestIdentity(request),
      value: view
    });
    this.availabilityRevision.update((revision) => revision + 1);
  }
  selectAvailabilityOrder(order) {
    if (this.availabilityOrder() === order) {
      return;
    }
    const request = this.availabilityPopupStore.availabilityPopup();
    this.availabilityOrderOverride.set({
      requestIdentity: this.requestIdentity(request),
      value: order
    });
    this.availabilityRevision.update((revision) => revision + 1);
    this.dayListRevision.update((revision) => revision + 1);
  }
  selectAvailabilityFilter(filter) {
    if (this.availabilityFilter() === filter) {
      return;
    }
    const request = this.availabilityPopupStore.availabilityPopup();
    this.availabilityFilterOverride.set({
      requestIdentity: this.requestIdentity(request),
      value: filter
    });
    this.availabilityRevision.update((revision) => revision + 1);
  }
  selectDayListFilter(filter) {
    if (this.dayListFilter() === filter) {
      return;
    }
    const request = this.availabilityPopupStore.dayListPopup();
    this.dayListFilterOverride.set({
      requestIdentity: this.requestIdentity(request),
      value: filter
    });
    this.dayListRevision.update((revision) => revision + 1);
  }
  selectDayListRange(value) {
    if (!this.isDateInputRangeValue(value)) {
      return;
    }
    const startAt = this.dateInputDateKey(value.startAt) ?? this.dateInputDateKey(value.endAt);
    const endAt = this.dateInputDateKey(value.endAt) ?? startAt;
    if (!startAt || !endAt) {
      return;
    }
    const request = this.availabilityPopupStore.dayListPopup();
    if (this.dateInputDateKey(request?.rangeStart) === startAt && this.dateInputDateKey(request?.rangeEnd) === endAt) {
      return;
    }
    this.availabilityPopupStore.updateDayListRange(startAt, endAt, this.dayListFilter());
  }
  availabilityHeaderControls() {
    const controls = [];
    if (this.availabilityView() === "day") {
      controls.push({
        kind: "menu",
        id: "order",
        trigger: this.orderMenuTrigger(),
        items: this.orderMenuItems()
      });
    }
    controls.push({
      kind: "menu",
      id: "view",
      trigger: this.viewMenuTrigger(),
      items: this.viewMenuItems()
    });
    return controls;
  }
  availabilityToolbarControls() {
    return [{
      kind: "menu",
      id: "filter",
      align: "end",
      trigger: this.filterMenuTrigger(this.availabilityFilter(), "availability"),
      items: this.filterMenuItems("availability")
    }];
  }
  dayListToolbarControls() {
    return [
      {
        kind: "date-input",
        id: "day-list-date-range",
        model: this.dayListDateRangeInputModel,
        value: this.dayListDateRangeInputValue()
      },
      {
        kind: "menu",
        id: "day-list-filter",
        align: "end",
        trigger: this.filterMenuTrigger(this.dayListFilter(), "day-list"),
        items: this.filterMenuItems("day-list")
      }
    ];
  }
  viewMenuTrigger() {
    const view = this.availabilityView();
    const option = APP_STATIC_DATA.activitiesViewOptions.find((item) => item.key === view);
    return this.availabilitySelectTrigger({
      label: option?.label ?? "View",
      icon: option?.icon ?? "view_agenda",
      palette: this.viewPalette(view),
      ariaLabel: "Open availability view",
      collapsible: true
    });
  }
  orderMenuTrigger() {
    const order = this.availabilityOrder();
    const option = this.orderMenuOptions().find((item) => item.key === order) ?? this.orderMenuOptions()[0];
    return this.availabilitySelectTrigger({
      label: option.label,
      icon: option.icon,
      palette: this.orderPalette(order),
      ariaLabel: "asset.requests.order.open",
      collapsible: true
    });
  }
  orderMenuItems() {
    const activeOrder = this.availabilityOrder();
    return this.orderMenuOptions().map((option) => ({
      id: `asset-availability-order:${option.key}`,
      label: option.label,
      icon: option.icon,
      kind: "radio",
      active: option.key === activeOrder,
      palette: this.orderPalette(option.key),
      surface: "tinted",
      context: { menu: "order", order: option.key }
    }));
  }
  orderMenuOptions() {
    return [
      { key: "earlier", label: "asset.requests.order.earlier", icon: "history" },
      { key: "later", label: "asset.requests.order.later", icon: "schedule" }
    ];
  }
  viewMenuItems() {
    return APP_STATIC_DATA.activitiesViewOptions.filter((option) => option.key === "month" || option.key === "week" || option.key === "day").map((option) => {
      const view = option.key;
      return {
        id: `availability-view:${option.key}`,
        label: option.label,
        icon: option.icon,
        kind: "radio",
        active: view === this.availabilityView(),
        palette: this.viewPalette(view),
        surface: "tinted",
        context: { menu: "view", view }
      };
    });
  }
  filterMenuTrigger(filter, target) {
    const option = this.filterOptions().find((item) => item.key === filter) ?? this.filterOptions()[0];
    return this.availabilitySelectTrigger({
      label: option.label,
      icon: option.icon,
      palette: this.filterPalette(filter),
      ariaLabel: "asset.requests.filter.open",
      counter: this.filterCounter(filter, target)
    });
  }
  filterMenuItems(target) {
    const activeFilter = target === "day-list" ? this.dayListFilter() : this.availabilityFilter();
    return this.filterOptions().map((option) => ({
      id: `asset-availability-filter:${target}:${option.key}`,
      label: option.label,
      icon: option.icon,
      kind: "radio",
      active: option.key === activeFilter,
      palette: this.filterPalette(option.key),
      surface: "tinted",
      counter: this.menuCounter(this.filterCounter(option.key, target)),
      context: { menu: "filter", target, filter: option.key }
    }));
  }
  filterOptions() {
    return [
      { key: "all", label: "all", icon: "view_list" },
      { key: "active-items", label: "asset.requests.filter.active.items", icon: "inventory_2" },
      { key: "pending-requests", label: "asset.requests.filter.pending.requests", icon: "pending_actions" },
      { key: "borrowed-items", label: "asset.requests.filter.borrowed.items", icon: "assignment_returned" }
    ];
  }
  availabilitySelectTrigger(options) {
    const counter = Math.max(0, Math.trunc(Number(options.counter) || 0));
    return {
      label: options.label,
      icon: options.icon,
      palette: options.palette,
      layout: options.layout ?? "pill",
      hideLabel: options.hideLabel,
      collapsible: options.collapsible,
      ariaLabel: options.ariaLabel,
      counter: counter > 0 ? { value: counter, max: 99 } : null
    };
  }
  menuCounter(count) {
    const normalized = Math.max(0, Math.trunc(Number(count) || 0));
    return normalized > 0 ? { value: normalized, max: 99 } : null;
  }
  filterCounter(filter, target) {
    if (target !== "availability") {
      return 0;
    }
    const metrics = this.availabilityHeader()?.metrics;
    if (!metrics) {
      return 0;
    }
    switch (filter) {
      case "active-items":
        return this.normalizeCount(metrics.activeItems);
      case "pending-requests":
        return this.normalizeCount(metrics.pendingItems);
      case "borrowed-items":
        return this.normalizeCount(metrics.borrowedItems);
      case "all":
      default:
        return this.normalizeCount(metrics.activeItems) + this.normalizeCount(metrics.pendingItems);
    }
  }
  normalizeCount(value) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? Math.max(0, Math.trunc(numeric)) : 0;
  }
  viewPalette(view) {
    switch (view) {
      case "month":
        return "blue";
      case "week":
        return "violet";
      case "day":
        return "green";
      default:
        return "default";
    }
  }
  orderPalette(order) {
    return order === "later" ? "blue" : "slate";
  }
  assetAvailabilityEmptyDescription(query) {
    if (this.isCalendarAvailabilityView(query.view)) {
      return "";
    }
    const order = query.filters?.order ?? this.orderFromDirection(query.direction);
    return order === "earlier" ? "asset.requests.empty.earlier.description" : "asset.requests.empty.later.description";
  }
  filterPalette(filter) {
    switch (filter) {
      case "pending-requests":
        return "amber";
      case "borrowed-items":
        return "violet";
      case "active-items":
        return "green";
      case "all":
      default:
        return "blue";
    }
  }
  availabilityDayCounter(day) {
    const stat = day.items.find((item) => this.isAvailabilityStat(item)) ?? null;
    if (!stat) {
      return null;
    }
    const capacity = stat.capacity > 0 ? stat.capacity : this.availabilityHeader()?.capacity ?? 0;
    return {
      label: `${stat.occupied}/${capacity}`,
      ariaLabel: `${stat.occupied} occupied of ${capacity} capacity`,
      alertLabel: stat.pendingCount > 0 ? `${stat.pendingCount}` : null,
      alertAriaLabel: stat.pendingCount > 0 ? `${stat.pendingCount} pending` : null,
      toneClass: this.counterTone(stat, capacity)
    };
  }
  counterTone(stat, capacity = stat.capacity) {
    if (stat.occupied <= 0) {
      return "calendar-counter-empty";
    }
    if (stat.occupied > capacity) {
      return "calendar-counter-over";
    }
    if (capacity > 0 && stat.occupied >= capacity) {
      return "calendar-counter-full";
    }
    return "";
  }
  availabilityDateRange(item) {
    const start = AppUtils.parseDate(item.startAtIso) ?? AppUtils.parseDateOnlyLocal(item.dateIso);
    if (!start) {
      return null;
    }
    if (this.isAvailabilityStat(item)) {
      const day = AppUtils.parseDateOnlyLocal(item.dateIso) ?? AppUtils.dateOnly(start);
      return { start: day, end: day };
    }
    const end = AppUtils.parseDate(item.endAtIso) ?? AppUtils.addDays(start, 1);
    return { start, end };
  }
  isAvailabilityStat(item) {
    return "itemCount" in item;
  }
  rowMenuActions(row) {
    const actions = row.menuActions ?? [];
    if (!this.rowBusyKey.startsWith(`${row.assetId}:${row.id}:`)) {
      return [...actions];
    }
    return [];
  }
  openAvailabilityResourceManager(row) {
    const ownerId = `${row.eventId ?? ""}`.trim();
    const subEventId = `${row.subEventId ?? ""}`.trim();
    const type = this.availabilityResourceType(row);
    if (!ownerId || !subEventId || !type) {
      return;
    }
    const eventTitle = `${row.eventTitle ?? ""}`.trim() || this.availabilityHeader()?.title || "Event";
    const subEventTitle = `${row.subEventTitle ?? ""}`.trim() || "Sub Event";
    const startAt = `${row.subEventStartAtIso ?? row.startAtIso ?? ""}`.trim();
    const endAt = `${row.subEventEndAtIso ?? row.endAtIso ?? ""}`.trim();
    const timeframe = AppUtils.dateTimeRangeLabel(startAt, endAt, "");
    this.resourcePopupStore.requestSubEventResourcePopup({
      type,
      ownerId,
      parentTitle: eventTitle,
      subEventId,
      popupHeader: {
        title: this.joinDistinctResourcePopupHeaderLabels([eventTitle, subEventTitle]) || eventTitle,
        subtitle: timeframe || null
      },
      subEventHeader: {
        name: subEventTitle,
        title: subEventTitle,
        startAt: startAt || null,
        endAt: endAt || null
      }
    });
    void this.resourcePopupStore.ensureEventResourcePopupLoaded();
  }
  joinDistinctResourcePopupHeaderLabels(parts) {
    const seen = /* @__PURE__ */ new Set();
    const labels = [];
    for (const part of parts) {
      const value = `${part ?? ""}`.trim();
      const key = value.toLocaleLowerCase();
      if (!value || seen.has(key)) {
        continue;
      }
      seen.add(key);
      labels.push(value);
    }
    return labels.join(" - ");
  }
  availabilityResourceType(row) {
    const headerType = `${this.availabilityHeader()?.type ?? this.dayListHeader()?.type ?? ""}`.trim();
    if (this.isAssetResourceType(headerType)) {
      return headerType;
    }
    const assetType = this.assetStore.findAsset(row.assetId)?.type ?? "";
    return this.isAssetResourceType(assetType) ? assetType : null;
  }
  isAssetResourceType(value) {
    return isAssetType(value);
  }
  async applyAssetRequestAction(row, action) {
    const assetDetail = await this.assetsService.loadOwnedAssetDetailById(row.ownerUserId, row.assetId);
    if (!assetDetail) {
      throw new Error("The asset could not be loaded.");
    }
    let nextQuantity = AssetCardBuilder.storedQuantityValue(assetDetail);
    let targetFound = false;
    const nextRequests = assetDetail.requests.map((request) => AssetCardBuilder.cloneRequest(request)).filter((request) => {
      if (request.id !== row.id) {
        return true;
      }
      targetFound = true;
      if (action === "remove") {
        if (request.requestKind !== "manual" && request.booking?.inventoryApplied === true) {
          const capacityTotal = Math.max(0, Math.trunc(Number(assetDetail.capacityTotal) || 0));
          const restoredQuantity = nextQuantity + this.assetRequestQuantity(request);
          nextQuantity = capacityTotal > 0 ? Math.min(capacityTotal, restoredQuantity) : restoredQuantity;
        }
        return false;
      }
      request.status = "accepted";
      request.note = request.requestKind === "manual" ? "Reserved and assigned by the owner." : "Borrow request approved by the owner.";
      if (request.requestKind !== "manual" && request.booking?.inventoryApplied !== true) {
        nextQuantity = Math.max(0, nextQuantity - this.assetRequestQuantity(request));
        request.booking = request.booking ? __spreadProps(__spreadValues({}, request.booking), {
          inventoryApplied: true
        }) : null;
      }
      return true;
    });
    if (!targetFound) {
      throw new Error("The asset request could not be found.");
    }
    const savedCard = await this.assetsService.saveOwnedAsset(row.ownerUserId, __spreadProps(__spreadValues({}, assetDetail), {
      quantity: nextQuantity,
      requests: nextRequests
    }));
    const savedRequest = savedCard.requests.find((request) => request.id === row.id) ?? null;
    if (action === "accept" && savedRequest?.status !== "accepted" || action === "remove" && savedRequest !== null) {
      throw new Error("The asset request update was not persisted.");
    }
    this.replaceAssetCardIfVisible(savedCard, row.ownerUserId);
  }
  async promoteAssetRequestToManager(row) {
    const assetDetail = await this.assetsService.loadOwnedAssetDetailById(row.ownerUserId, row.assetId);
    const targetUserId = `${row.userId || this.assetRequestById(row)?.userId || assetDetail?.requests.find((request) => request.id === row.id)?.userId || ""}`.trim();
    if (!targetUserId || !assetDetail) {
      throw new Error("The asset request could not be found.");
    }
    const actorUserId = this.userProfileStore.getActiveUserId().trim();
    if (!actorUserId) {
      throw new Error("The active user could not be resolved.");
    }
    const savedCard = await this.assetsService.makeAssetManager(actorUserId, row.assetId, targetUserId);
    if (!savedCard) {
      throw new Error("Unable to promote this person to asset manager.");
    }
    this.replaceAssetCardIfVisible(savedCard, row.ownerUserId);
  }
  async revokeAssetRequestManager(row) {
    const actorUserId = this.userProfileStore.getActiveUserId().trim();
    const targetUserId = `${row.userId ?? ""}`.trim();
    const savedCard = await this.assetsService.revokeAssetManager(actorUserId, row.assetId, targetUserId);
    if (!savedCard) {
      throw new Error("Unable to revoke this asset manager.");
    }
    this.replaceAssetCardIfVisible(savedCard, row.ownerUserId);
  }
  patchVisibleManagerState(row, isManager) {
    const patch = (item) => __spreadProps(__spreadValues({}, item), {
      isManager,
      menuActions: (item.menuActions ?? []).map((action) => action === "makeManager" || action === "revokeManager" ? isManager ? "revokeManager" : "makeManager" : action)
    });
    this.availabilitySmartList?.patchVisibleItem((item) => this.isAvailabilityRow(item) && item.id === row.id && item.assetId === row.assetId, (item) => this.isAvailabilityRow(item) ? patch(item) : item);
    this.dayListSmartList?.patchVisibleItem((item) => item.id === row.id && item.assetId === row.assetId, patch);
    this.cdr.markForCheck();
  }
  patchRequestCounterDelta(row, action) {
    if (action === "revokeManager") {
      return;
    }
    if (row.status !== "pending" || row.requestKind === "manual") {
      return;
    }
    if (action === "remove") {
      this.availabilityPopupStore.patchRequestMetrics({ allItems: -1, pendingItems: -1 });
      return;
    }
    this.availabilityPopupStore.patchRequestMetrics({
      activeItems: 1,
      borrowedItems: 1,
      pendingItems: -1
    });
  }
  assetRequestById(row) {
    const visible = this.assetStore.findAsset(row.assetId)?.requests.find((request) => request.id === row.id) ?? null;
    if (visible) {
      return visible;
    }
    return null;
  }
  replaceAssetCardIfVisible(card, ownerUserId) {
    if (this.assetStore.isActiveOwnerUser(ownerUserId)) {
      this.assetStore.replaceAssetCard(card, { reloadList: false, mutation: true });
      this.assetStore.touchUiState();
    }
  }
  assetRequestQuantity(request) {
    return Math.max(1, Math.trunc(Number(request.booking?.quantity) || 0));
  }
  reloadLists() {
    this.availabilityRevision.update((revision) => revision + 1);
    this.dayListRevision.update((revision) => revision + 1);
  }
  emptyPage() {
    return { items: [], total: 0, nextCursor: null };
  }
  buildQuery(view, filter, dateIso, rangeStart, rangeEnd, revision = 0, order = "later") {
    const isCalendarView = this.isCalendarAvailabilityView(view);
    const normalizedRangeStart = `${rangeStart ?? ""}`.trim() || void 0;
    const normalizedRangeEnd = `${rangeEnd ?? ""}`.trim() || void 0;
    return __spreadProps(__spreadValues(__spreadValues({
      view,
      direction: isCalendarView ? void 0 : order === "earlier" ? "desc" : "asc"
    }, normalizedRangeStart ? { rangeStart: normalizedRangeStart } : {}), normalizedRangeEnd ? { rangeEnd: normalizedRangeEnd } : {}), {
      filters: __spreadProps(__spreadValues({
        revision,
        filter
      }, isCalendarView || !order ? {} : { order }), {
        dateIso: `${dateIso ?? ""}`.trim() || null,
        rangeStart: normalizedRangeStart ?? null,
        rangeEnd: normalizedRangeEnd ?? null
      })
    });
  }
  isCalendarAvailabilityView(view) {
    return view === "week" || view === "month";
  }
  orderFromDirection(direction) {
    return direction === "desc" ? "earlier" : "later";
  }
  isDateInputRangeValue(value) {
    return !!value && typeof value === "object" && "startAt" in value && "endAt" in value;
  }
  dateInputDateKey(value) {
    const parsed = AppUtils.parseDateOnlyLocal(value);
    return parsed ? AppUtils.toIsoDate(parsed) : null;
  }
  scopedOverrideValue(override, requestIdentity, fallback) {
    return override?.requestIdentity === requestIdentity ? override.value : fallback;
  }
  requestIdentity(request) {
    if (!request) {
      return "";
    }
    return [
      request.instanceId,
      request.assetId,
      request.ownerUserId,
      request.initialDateIso ?? "",
      request.rangeStart ?? "",
      request.rangeEnd ?? "",
      request.filter,
      request.view,
      request.updatedMs
    ].join(":");
  }
  availabilityItemKey(item, index) {
    return `${item.assetId}:${item.dateIso}:${item.id}:${index}`;
  }
  availabilitySubtitle() {
    const header = this.availabilityHeader();
    if (!header) {
      return "Time-based requests and assignments";
    }
    return header.subtitle || "Time-based requests and assignments";
  }
  groupLabelForItem(item, view) {
    return this.groupLabelForDate(item.dateIso, view);
  }
  groupLabelForDate(dateIso, view) {
    const parsed = AppUtils.parseDateOnlyLocal(dateIso) ?? AppUtils.parseDate(dateIso);
    if (!parsed) {
      return "Availability";
    }
    if (view === "month") {
      return parsed.toLocaleDateString(void 0, { month: "long", year: "numeric" });
    }
    return parsed.toLocaleDateString(void 0, {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  }
  rowDetail(value) {
    if (!value || typeof value !== "object") {
      return null;
    }
    return "requestKind" in value && "assetId" in value && "ownerUserId" in value ? value : null;
  }
  static \u0275fac = function AssetAvailabilityPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AssetAvailabilityPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AssetAvailabilityPopupComponent, selectors: [["app-asset-availability-popup"]], viewQuery: function AssetAvailabilityPopupComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5)(_c1, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.availabilitySmartList = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.dayListSmartList = _t.first);
    }
  }, decls: 10, vars: 5, consts: [["availabilityRowTemplate", ""], ["dayRowTemplate", ""], ["availabilitySmartList", ""], ["dayListSmartList", ""], [1, "asset-availability-popup", 3, "model", "zIndex"], [1, "asset-availability-popup", "asset-availability-popup--day-list", 3, "model", "zIndex"], [1, "asset-availability-popup__list", 3, "viewChange", "itemSelect", "menuItemSelect", "config", "loadPage", "query", "view", "itemTemplate"], [1, "asset-availability-popup__list", 3, "menuItemSelect", "config", "loadPage", "query", "view", "itemTemplate"], [4, "ngComponentOutlet", "ngComponentOutletInputs"], [4, "ngComponentOutlet"], [3, "row", "useSharedMenu"], [3, "menuRequest", "menuAction", "row", "useSharedMenu"]], template: function AssetAvailabilityPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, AssetAvailabilityPopupComponent_Conditional_0_Template, 3, 7, "app-popup", 4);
      \u0275\u0275conditionalCreate(1, AssetAvailabilityPopupComponent_Conditional_1_Template, 3, 7, "app-popup", 5);
      \u0275\u0275conditionalCreate(2, AssetAvailabilityPopupComponent_Conditional_2_Template, 1, 1);
      \u0275\u0275conditionalCreate(3, AssetAvailabilityPopupComponent_Conditional_3_Template, 1, 1);
      \u0275\u0275conditionalCreate(4, AssetAvailabilityPopupComponent_Conditional_4_Template, 1, 1);
      \u0275\u0275element(5, "app-dialog");
      \u0275\u0275template(6, AssetAvailabilityPopupComponent_ng_template_6_Template, 1, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor)(8, AssetAvailabilityPopupComponent_ng_template_8_Template, 1, 2, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.isAvailabilityOpen() ? 0 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isDayListOpen() ? 1 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.shouldHostResourcePopup() ? 2 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.shouldHostResourcePopup() && ctx.resourcePopupStore.assetExplorePopupRef() ? 3 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.shouldHostSupplyContributionsPopup() ? 4 : -1);
    }
  }, dependencies: [
    CommonModule,
    NgComponentOutlet,
    PopupComponent,
    DialogComponent,
    SmartListComponent,
    SingleRowComponent
  ], styles: ["\n[_nghost-%COMP%] {\n  display: contents;\n}\n.asset-availability-popup[_ngcontent-%COMP%]   .ui-popup__toolbar[_ngcontent-%COMP%] {\n  justify-content: flex-end;\n}\n.asset-availability-popup--day-list[_ngcontent-%COMP%]   .ui-popup__panel[_ngcontent-%COMP%] {\n  max-width: min(720px, 100vw - 1.5rem);\n}\n/*# sourceMappingURL=asset-availability-popup.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AssetAvailabilityPopupComponent, [{
    type: Component,
    args: [{ selector: "app-asset-availability-popup", standalone: true, imports: [
      CommonModule,
      PopupComponent,
      DialogComponent,
      SmartListComponent,
      SingleRowComponent
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `@if (isAvailabilityOpen()) {
  <app-popup
    class="asset-availability-popup"
    [model]="availabilityPopupModel()"
    [zIndex]="availabilityPopupZIndex"
  >
    <app-smart-list
      #availabilitySmartList
      class="asset-availability-popup__list"
      [config]="availabilitySmartListConfig"
      [loadPage]="availabilitySmartListLoadPage"
      [query]="availabilityQuery()"
      [view]="availabilityView()"
      [itemTemplate]="availabilityRowTemplate"
      (viewChange)="onViewChange($event)"
      (itemSelect)="onCalendarItemSelect($event)"
      (menuItemSelect)="onSharedRowMenuAction($event)"
    ></app-smart-list>
  </app-popup>
}

@if (isDayListOpen()) {
  <app-popup
    class="asset-availability-popup asset-availability-popup--day-list"
    [model]="dayListPopupModel()"
    [zIndex]="dayListPopupZIndex"
  >
    <app-smart-list
      #dayListSmartList
      class="asset-availability-popup__list"
      [config]="dayListSmartListConfig"
      [loadPage]="dayListSmartListLoadPage"
      [query]="dayListQuery()"
      [view]="'day'"
      [itemTemplate]="dayRowTemplate"
      (menuItemSelect)="onSharedRowMenuAction($event)"
    ></app-smart-list>
  </app-popup>
}

@if (shouldHostResourcePopup()) {
  @if (resourcePopupStore.eventResourcePopupComponent(); as resourcePopupComponent) {
    <ng-container *ngComponentOutlet="resourcePopupComponent; inputs: resourcePopupOutletInputs()"></ng-container>
  }
}

@if (shouldHostResourcePopup() && resourcePopupStore.assetExplorePopupRef()) {
  @if (resourcePopupStore.eventResourceAssetExploreComponent(); as assetExplorePopupComponent) {
    <ng-container *ngComponentOutlet="assetExplorePopupComponent; inputs: assetExplorePopupOutletInputs()"></ng-container>
  }
}

@if (shouldHostSupplyContributionsPopup()) {
  @if (resourcePopupStore.eventSupplyContributionsPopupComponent(); as supplyContributionsPopupComponent) {
    <ng-container *ngComponentOutlet="supplyContributionsPopupComponent"></ng-container>
  }
}

<app-dialog></app-dialog>

<ng-template #availabilityRowTemplate let-item let-groupLabel="groupLabel" let-openMenu="openMenu">
  @if (isAvailabilityRow(item)) {
    <single-row
      [row]="availabilityRow(item, groupLabel)"
      [useSharedMenu]="true"
      (menuRequest)="openMenu($event)"
      (menuAction)="onRowMenuAction($event)"
    ></single-row>
  }
</ng-template>

<ng-template #dayRowTemplate let-row let-groupLabel="groupLabel" let-openMenu="openMenu">
  <single-row
    [row]="availabilityRow(row, groupLabel)"
    [useSharedMenu]="true"
    (menuRequest)="openMenu($event)"
    (menuAction)="onRowMenuAction($event)"
  ></single-row>
</ng-template>
`, styles: ["/* src/app/asset/components/asset-availability-popup/asset-availability-popup.component.scss */\n:host {\n  display: contents;\n}\n.asset-availability-popup .ui-popup__toolbar {\n  justify-content: flex-end;\n}\n.asset-availability-popup--day-list .ui-popup__panel {\n  max-width: min(720px, 100vw - 1.5rem);\n}\n/*# sourceMappingURL=asset-availability-popup.component.css.map */\n"] }]
  }], () => [], { availabilitySmartList: [{
    type: ViewChild,
    args: ["availabilitySmartList"]
  }], dayListSmartList: [{
    type: ViewChild,
    args: ["dayListSmartList"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AssetAvailabilityPopupComponent, { className: "AssetAvailabilityPopupComponent", filePath: "app/asset/components/asset-availability-popup/asset-availability-popup.component.ts", lineNumber: 104 });
})();
export {
  AssetAvailabilityPopupComponent
};
//# sourceMappingURL=asset-availability-popup.component-3OGC2QSC.js.map
