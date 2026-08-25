import {
  EventSubeventsPopupStore
} from "./chunk-3UFDLV5Y.js";
import "./chunk-GNEKNDCW.js";
import "./chunk-WYVDSPFZ.js";
import "./chunk-64GWAN6R.js";
import "./chunk-ZIP4R74W.js";
import "./chunk-I6EOSNBR.js";
import "./chunk-3HTTRAEW.js";
import "./chunk-SYKOEE4K.js";
import {
  MemberMenuStore
} from "./chunk-KQF6FQ63.js";
import {
  ActivitiesPopupStore
} from "./chunk-AELPOWOL.js";
import {
  SmartListComponent
} from "./chunk-IJVUZ62I.js";
import {
  SubEventResourcePopupStore
} from "./chunk-2RBWDI2Q.js";
import "./chunk-XIFXW5X2.js";
import "./chunk-2K5TOPNO.js";
import "./chunk-654Z7UJY.js";
import "./chunk-H3IGIWEC.js";
import "./chunk-RRRWUAB3.js";
import {
  ActivityChatSingleRowConverter,
  EventSubeventRuntimeInfoCardConverter,
  EventSubeventRuntimeMenuConverter,
  EventSubeventsListContextMenuConverter,
  EventSubeventsSlotConverter
} from "./chunk-EWJPTHFE.js";
import "./chunk-RJSPRCFL.js";
import "./chunk-BEAS7CFC.js";
import "./chunk-EGWJQCT5.js";
import {
  InfoCardComponent
} from "./chunk-YTMD6HU4.js";
import "./chunk-4VYYFWRA.js";
import "./chunk-QEZI4ZBE.js";
import "./chunk-MEY2M2U3.js";
import "./chunk-ZBJCMF52.js";
import {
  PopupComponent
} from "./chunk-3VXLUVWM.js";
import "./chunk-VEYRCVMX.js";
import "./chunk-MVR37RGJ.js";
import "./chunk-FOAFZS65.js";
import "./chunk-OAYWPJGG.js";
import {
  DialogStore
} from "./chunk-6TR3Z2F3.js";
import "./chunk-U46O4F4Y.js";
import "./chunk-EDHGCWPF.js";
import "./chunk-CUDLB52K.js";
import "./chunk-4WZBG7IG.js";
import "./chunk-ZJ74HL3J.js";
import "./chunk-QE3AUXWT.js";
import {
  EventsService
} from "./chunk-2LVO4Z3J.js";
import "./chunk-PK4DOAMC.js";
import "./chunk-4M7S3PHB.js";
import "./chunk-5PHTFUHA.js";
import {
  APP_STATIC_DATA,
  tournamentCurrentStageFromSubEvents
} from "./chunk-F4WY6ECV.js";
import {
  I18nService
} from "./chunk-Q3344WPR.js";
import {
  AppUtils
} from "./chunk-XQ4NDAVX.js";
import "./chunk-4FWVIYNI.js";
import "./chunk-7MTG4XZU.js";
import {
  CommonModule,
  NgClass,
  NgComponentOutlet
} from "./chunk-J7IJFFQ2.js";
import "./chunk-XQACYBVS.js";
import "./chunk-YKC4KBEC.js";
import "./chunk-B2DKYQGD.js";
import {
  ActivityStore,
  UserProfileStore
} from "./chunk-KLUOB5SD.js";
import "./chunk-6POEHVT7.js";
import "./chunk-2ENBQWLU.js";
import "./chunk-LERGHE7K.js";
import "./chunk-D6ZHKNYF.js";
import "./chunk-SKAK727J.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  ViewChild,
  ViewChildren,
  __spreadProps,
  __spreadValues,
  effect,
  from,
  inject,
  of,
  setClassMetadata,
  untracked,
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
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵviewQuery
} from "./chunk-XJL7SWH7.js";

// src/app/activity/components/event-subevents-list-popup/event-subevents-list-popup.component.ts
var _c0 = ["subeventsSmartList"];
var _c1 = ["slotSectionSmartList"];
function EventSubeventsListPopupComponent_Conditional_0_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 6)(1, "app-smart-list", 7, 3);
    \u0275\u0275listener("menuItemSelect", function EventSubeventsListPopupComponent_Conditional_0_ng_template_3_Template_app_smart_list_menuItemSelect_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onSubEventMenuSelect($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const section_r3 = ctx.$implicit;
    \u0275\u0275nextContext();
    const subEventTemplate_r4 = \u0275\u0275reference(6);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", ctx_r1.slotSectionToneClass(section_r3));
    \u0275\u0275advance();
    \u0275\u0275property("config", ctx_r1.slotSectionSmartListConfigFor(section_r3))("loadPage", ctx_r1.slotSectionLoadPage(section_r3))("query", ctx_r1.slotSectionQuery)("itemTemplate", subEventTemplate_r4);
  }
}
function EventSubeventsListPopupComponent_Conditional_0_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-info-card", 8);
    \u0275\u0275listener("menuRequest", function EventSubeventsListPopupComponent_Conditional_0_ng_template_5_Template_app_info_card_menuRequest_0_listener($event) {
      const openMenu_r6 = \u0275\u0275restoreView(_r5).openMenu;
      return \u0275\u0275resetView(openMenu_r6($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r7 = ctx.$implicit;
    const groupLabel_r8 = ctx.groupLabel;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("card", ctx_r1.cardFor(item_r7, groupLabel_r8))("useSharedMenu", true)("useSharedMenuTrigger", false)("sharedMenuContext", ctx_r1.subEventMenuContext(item_r7));
  }
}
function EventSubeventsListPopupComponent_Conditional_0_Conditional_7_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function EventSubeventsListPopupComponent_Conditional_0_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, EventSubeventsListPopupComponent_Conditional_0_Conditional_7_ng_container_0_Template, 1, 0, "ng-container", 9);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function EventSubeventsListPopupComponent_Conditional_0_Conditional_8_Conditional_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function EventSubeventsListPopupComponent_Conditional_0_Conditional_8_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, EventSubeventsListPopupComponent_Conditional_0_Conditional_8_Conditional_0_ng_container_0_Template, 1, 0, "ng-container", 9);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function EventSubeventsListPopupComponent_Conditional_0_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, EventSubeventsListPopupComponent_Conditional_0_Conditional_8_Conditional_0_Template, 1, 1, "ng-container");
  }
  if (rf & 2) {
    let tmp_5_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional((tmp_5_0 = ctx_r1.resourcePopupStore.eventResourcePopupComponent()) ? 0 : -1, tmp_5_0);
  }
}
function EventSubeventsListPopupComponent_Conditional_0_Conditional_9_Conditional_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function EventSubeventsListPopupComponent_Conditional_0_Conditional_9_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, EventSubeventsListPopupComponent_Conditional_0_Conditional_9_Conditional_0_ng_container_0_Template, 1, 0, "ng-container", 9);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function EventSubeventsListPopupComponent_Conditional_0_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, EventSubeventsListPopupComponent_Conditional_0_Conditional_9_Conditional_0_Template, 1, 1, "ng-container");
  }
  if (rf & 2) {
    let tmp_5_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional((tmp_5_0 = ctx_r1.resourcePopupStore.eventResourceAssetExploreComponent()) ? 0 : -1, tmp_5_0);
  }
}
function EventSubeventsListPopupComponent_Conditional_0_Conditional_10_Conditional_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function EventSubeventsListPopupComponent_Conditional_0_Conditional_10_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, EventSubeventsListPopupComponent_Conditional_0_Conditional_10_Conditional_0_ng_container_0_Template, 1, 0, "ng-container", 9);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function EventSubeventsListPopupComponent_Conditional_0_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, EventSubeventsListPopupComponent_Conditional_0_Conditional_10_Conditional_0_Template, 1, 1, "ng-container");
  }
  if (rf & 2) {
    let tmp_5_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional((tmp_5_0 = ctx_r1.resourcePopupStore.eventSupplyContributionsPopupComponent()) ? 0 : -1, tmp_5_0);
  }
}
function EventSubeventsListPopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-popup", 4);
    \u0275\u0275element(1, "app-smart-list", 5, 0);
    \u0275\u0275template(3, EventSubeventsListPopupComponent_Conditional_0_ng_template_3_Template, 3, 5, "ng-template", null, 1, \u0275\u0275templateRefExtractor)(5, EventSubeventsListPopupComponent_Conditional_0_ng_template_5_Template, 1, 4, "ng-template", null, 2, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, EventSubeventsListPopupComponent_Conditional_0_Conditional_7_Template, 1, 1, "ng-container");
    \u0275\u0275conditionalCreate(8, EventSubeventsListPopupComponent_Conditional_0_Conditional_8_Template, 1, 1);
    \u0275\u0275conditionalCreate(9, EventSubeventsListPopupComponent_Conditional_0_Conditional_9_Template, 1, 1);
    \u0275\u0275conditionalCreate(10, EventSubeventsListPopupComponent_Conditional_0_Conditional_10_Template, 1, 1);
  }
  if (rf & 2) {
    let tmp_10_0;
    const slotSectionTemplate_r9 = \u0275\u0275reference(4);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.popupModel())("zIndex", 2400);
    \u0275\u0275advance();
    \u0275\u0275property("config", ctx_r1.smartListConfig)("loadPage", ctx_r1.loadSubEventsPage)("itemTemplate", slotSectionTemplate_r9)("query", ctx_r1.query);
    \u0275\u0275advance(6);
    \u0275\u0275conditional((tmp_10_0 = ctx_r1.eventSubeventsStore.eventTournamentGroupsPopupComponent()) ? 7 : -1, tmp_10_0);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.shouldHostResourcePopup() ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.shouldHostResourcePopup() && ctx_r1.resourcePopupStore.assetExplorePopupRef() ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.shouldHostSupplyContributionsPopup() ? 10 : -1);
  }
}
var EventSubeventsListPopupComponent = class _EventSubeventsListPopupComponent {
  subeventsSmartList;
  slotSectionSmartLists;
  eventsService = inject(EventsService);
  i18n = inject(I18nService);
  dialogStore = inject(DialogStore);
  userProfileStore = inject(UserProfileStore);
  activityStore = inject(ActivityStore);
  activitiesStore = inject(ActivitiesPopupStore);
  memberMenuStore = inject(MemberMenuStore);
  resourcePopupStore = inject(SubEventResourcePopupStore);
  eventSubeventsStore = inject(EventSubeventsPopupStore);
  cdr = inject(ChangeDetectorRef);
  isLoading = false;
  event = null;
  items = [];
  slotSections = [];
  view = "day";
  order = "upcoming";
  participantOnly = false;
  isMobileView = false;
  query = {
    view: "day",
    filters: { revision: 0 }
  };
  slotSectionQuery = {
    filters: { revision: 0 }
  };
  revision = 0;
  lastLoadedEventId = "";
  loadedEventId = "";
  loadingEventId = "";
  loadedQueryKey = "";
  loadingQueryKey = "";
  loadingPromise = null;
  loadedPageTotal = null;
  loadedPageNextCursor = null;
  handledGroupsUpdateMs = 0;
  handledMembersSyncMs = 0;
  handledResourceMetricsRevision = 0;
  compactToolbarMenuModel = {
    density: "compact"
  };
  slotSectionLoaders = /* @__PURE__ */ new Map();
  slotSectionConfigs = /* @__PURE__ */ new Map();
  slotSectionHeaderLabels = /* @__PURE__ */ new Map();
  smartListConfig = {
    pageSize: 12,
    defaultView: "day",
    views: [
      { key: "day", label: "Day", mode: "list", pageSize: 12 },
      { key: "week", label: "Week", mode: "week", pageSize: 240 },
      { key: "month", label: "Month", mode: "month", pageSize: 240 }
    ],
    calendar: {
      weekdayLabels: APP_STATIC_DATA.calendarWeekdayLabels,
      weekStartHour: 0,
      weekEndHour: 23,
      anchorRadius: 2,
      initialAnchor: () => this.calendarInitialAnchor(),
      resolveDateRange: (section) => this.slotSectionCalendarRange(section),
      badgeLabel: (section) => section.title,
      badgeToneClass: (section) => `event-subevents-calendar-badge--${section.tone}`
    },
    showStickyHeader: true,
    emptyLabel: "event.subevents.empty.label",
    emptyDescription: () => this.subEventsEmptyDescription(),
    listLayout: "card-grid",
    desktopColumns: 1,
    snapMode: "mandatory",
    scrollPaddingTop: "2.6rem",
    headerProgress: { enabled: true, placement: "inline", tone: "accent" },
    groupBy: (section, query) => this.groupLabel(section.startAt, query.view),
    showGroupMarker: ({ groupIndex, scrollable }) => groupIndex > 0 || scrollable,
    trackBy: (_index, section) => section.id
  };
  baseSlotSectionSmartListConfig = {
    pageSize: 120,
    defaultView: "list",
    showStickyHeader: true,
    showGroupMarker: () => false,
    emptyLabel: "event.subevents.empty.slot.label",
    emptyDescription: () => this.subEventsEmptyDescription(),
    listLayout: "card-grid",
    orientation: "horizontal",
    desktopColumns: 3,
    snapMode: "mandatory",
    mobileStepper: true,
    cacheable: {
      identity: (item, index) => this.subEventItemKey(item, index)
    },
    stickyHeaderClass: "smart-list__sticky--slot-section",
    pagination: {
      mode: "arrows",
      step: "page",
      headerControls: true
    },
    groupBy: (item) => this.slotHeaderLabel(item),
    menuItems: (context) => context.item ? this.subEventMenuItems(context.item) : [],
    trackBy: (index, item) => this.subEventItemKey(item, index)
  };
  flatSubEventsSmartListConfig = {
    pageSize: 120,
    defaultView: "list",
    showStickyHeader: false,
    showGroupMarker: () => false,
    emptyLabel: "event.subevents.empty.event.label",
    emptyDescription: () => this.subEventsEmptyDescription(),
    listLayout: "card-grid",
    desktopColumns: 3,
    snapMode: "proximity",
    cacheable: {
      identity: (item, index) => this.subEventItemKey(item, index)
    },
    menuItems: (context) => context.item ? this.subEventMenuItems(context.item) : [],
    trackBy: (index, item) => this.subEventItemKey(item, index)
  };
  loadSubEventsPage = (query) => {
    return from(this.loadSubEventsPageResult(query));
  };
  constructor() {
    this.syncMobileViewFromViewport();
    effect(() => {
      const request = this.eventSubeventsStore.eventSubeventsListPopup();
      if (!request) {
        this.lastLoadedEventId = "";
        this.loadedEventId = "";
        this.loadingEventId = "";
        this.loadedQueryKey = "";
        this.loadingQueryKey = "";
        this.loadingPromise = null;
        this.loadedPageTotal = null;
        this.loadedPageNextCursor = null;
        this.event = null;
        this.items = [];
        this.slotSections = [];
        this.participantOnly = false;
        this.slotSectionLoaders.clear();
        this.slotSectionConfigs.clear();
        this.slotSectionHeaderLabels.clear();
        return;
      }
      if (request.eventId === this.lastLoadedEventId) {
        return;
      }
      this.lastLoadedEventId = request.eventId;
      this.loadedEventId = "";
      this.loadingEventId = "";
      this.loadedQueryKey = "";
      this.loadingQueryKey = "";
      this.loadingPromise = null;
      this.loadedPageTotal = null;
      this.loadedPageNextCursor = null;
      this.event = this.parentContextFromRequest(request.eventId);
      this.items = [];
      this.slotSections = [];
      this.participantOnly = false;
      this.slotSectionLoaders.clear();
      this.slotSectionConfigs.clear();
      this.slotSectionHeaderLabels.clear();
      this.bumpQuery();
    });
    effect(() => {
      const request = this.eventSubeventsStore.eventTournamentGroupsPopup();
      if (!request || !this.isOpen()) {
        return;
      }
      void this.eventSubeventsStore.ensureEventTournamentGroupsPopupLoaded();
    });
    effect(() => {
      const update = this.eventSubeventsStore.eventTournamentGroupsUpdate();
      if (!update || update.updatedMs === this.handledGroupsUpdateMs) {
        return;
      }
      this.handledGroupsUpdateMs = update.updatedMs;
      this.applyTournamentGroupsUpdate(update);
    });
    effect(() => {
      const request = this.resourcePopupStore.subEventResourcePopupRequest();
      if (!request || !this.isOpen()) {
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
      if (!this.shouldHostResourcePopup() || this.resourcePopupStore.assetExploreOnlyRef() || !this.resourcePopupStore.supplyPopupRef()) {
        return;
      }
      void this.resourcePopupStore.ensureEventSupplyContributionsPopupLoaded();
    });
    effect(() => {
      const update = this.resourcePopupStore.subEventResourceMetricsUpdate();
      if (!update || !this.isOpen() || update.revision <= this.handledResourceMetricsRevision) {
        return;
      }
      this.handledResourceMetricsRevision = update.revision;
      untracked(() => this.applySubEventResourceMetricsUpdate(update));
    });
    effect(() => {
      const sync = this.activityStore.activityMembersSync();
      if (!sync || !this.isOpen() || sync.updatedMs === this.handledMembersSyncMs) {
        return;
      }
      this.handledMembersSyncMs = sync.updatedMs;
      this.applySubEventMembersSync(sync);
    });
    effect(() => {
      const sync = this.activitiesStore.activityEventSave();
      const request = this.eventSubeventsStore.eventSubeventsListPopup();
      if (!sync || !request || !this.isOpen()) {
        return;
      }
      const savedEventId = `${sync.id ?? ""}`.trim();
      const openEventId = `${request.eventId ?? ""}`.trim();
      if (!savedEventId || savedEventId !== openEventId) {
        return;
      }
      if (request.canEdit) {
        if (sync.status === "DR") {
          this.eventSubeventsStore.updateEventSubeventsEditorAction(openEventId, "edit");
        } else if (sync.status === "A") {
          this.eventSubeventsStore.updateEventSubeventsEditorAction(openEventId, "manage");
        }
      }
      this.invalidateLoadedRuntime();
    });
  }
  onWindowResize() {
    this.syncMobileViewFromViewport();
  }
  isOpen() {
    return Boolean(this.eventSubeventsStore.eventSubeventsListPopup());
  }
  shouldHostResourcePopup() {
    return this.isOpen() && (this.resourcePopupStore.subEventResourcePopupRequest() !== null || this.resourcePopupStore.popupContextRef()?.origin === "subEventResource");
  }
  shouldHostSupplyContributionsPopup() {
    return this.shouldHostResourcePopup() && !this.resourcePopupStore.assetExploreOnlyRef() && this.resourcePopupStore.supplyPopupRef() !== null;
  }
  close() {
    this.eventSubeventsStore.closeEventSubeventsListPopup();
  }
  popupModel() {
    return {
      title: this.popupSubtitle(),
      subtitle: this.popupHeaderSubtitle(),
      ariaLabel: this.popupSubtitle(),
      closeAriaLabel: "Close",
      size: "wide",
      height: "full",
      headerTone: "accent",
      bodyLayout: "fill",
      headerControls: this.popupHeaderControls(),
      toolbarControls: this.popupToolbarControls(),
      onClose: () => this.close(),
      onMenuSelect: (event) => this.onPopupMenuSelect(event)
    };
  }
  popupTitle() {
    return "Sub Events";
  }
  popupSubtitle() {
    const requestTitle = this.eventSubeventsStore.eventSubeventsListPopup()?.title ?? "";
    return this.event?.title || requestTitle || "Event";
  }
  subEventsEmptyDescription() {
    return this.order === "past" ? "event.subevents.empty.past.description" : "event.subevents.empty.upcoming.description";
  }
  popupHeaderSubtitle() {
    return this.eventRangeLabel() || this.popupTitle();
  }
  eventRangeLabel() {
    const event = this.event;
    if (!event) {
      return "";
    }
    return AppUtils.dateTimeRangeLabel(event.startAtIso, event.endAtIso, event.timeframe || "");
  }
  popupHeaderControls() {
    return [
      {
        kind: "menu",
        id: "order",
        trigger: this.orderTrigger(),
        items: this.orderMenuItems()
      },
      {
        kind: "menu",
        id: "view",
        trigger: this.viewTrigger(),
        items: this.viewMenuItems()
      }
    ];
  }
  popupToolbarControls() {
    return [
      {
        kind: "menu",
        id: "context",
        align: "end",
        menuKind: "inline",
        model: this.compactToolbarMenuModel,
        items: this.contextMenuItems()
      }
    ];
  }
  onPopupMenuSelect(event) {
    const context = event.itemSelect.context;
    if (!context) {
      return;
    }
    switch (context.menu) {
      case "order":
        this.selectOrder(context.order);
        return;
      case "view":
        this.selectView(context.view);
        return;
      case "context":
        this.selectContextAction(context.action);
        return;
    }
  }
  orderTrigger() {
    const item = this.orderMenuItems().find((option) => option.id === this.order);
    return {
      icon: item?.icon ?? "schedule",
      label: item?.label ?? "Upcoming",
      palette: item?.palette ?? "blue",
      layout: "pill",
      hideLabel: this.isMobileView
    };
  }
  orderMenuItems() {
    return [
      {
        id: "upcoming",
        label: "Upcoming",
        icon: "schedule",
        palette: "blue",
        surface: "tinted",
        context: { menu: "order", order: "upcoming" }
      },
      {
        id: "past",
        label: "Past",
        icon: "history",
        palette: "slate",
        surface: "tinted",
        context: { menu: "order", order: "past" }
      }
    ];
  }
  selectOrder(order) {
    this.order = order;
    this.bumpQuery();
  }
  viewTrigger() {
    const item = this.viewMenuItems().find((option) => option.id === this.view);
    return {
      icon: item?.icon ?? "today",
      label: item?.label ?? "Day",
      palette: item?.palette ?? "blue",
      layout: "pill",
      hideLabel: this.isMobileView
    };
  }
  viewMenuItems() {
    return [
      {
        id: "month",
        label: "Month",
        icon: "calendar_month",
        palette: "gold",
        surface: "tinted",
        context: { menu: "view", view: "month" }
      },
      {
        id: "week",
        label: "Week",
        icon: "date_range",
        palette: "green",
        surface: "tinted",
        context: { menu: "view", view: "week" }
      },
      {
        id: "day",
        label: "Day",
        icon: "today",
        palette: "blue",
        surface: "tinted",
        context: { menu: "view", view: "day" }
      }
    ];
  }
  selectView(view) {
    this.view = view;
    this.bumpQuery();
  }
  contextMenuItems() {
    const editorAction = this.eventSubeventsStore.eventSubeventsListPopup()?.editorAction ?? "view";
    return EventSubeventsListContextMenuConverter.convert({
      participantOnly: this.participantOnly,
      editorAction,
      pendingMembers: this.eventPendingMembersCount(),
      membersDisabled: this.membersDisabled()
    });
  }
  selectContextAction(action) {
    if (action === "participantFilter") {
      this.toggleParticipantFilter();
      return;
    }
    if (action === "members") {
      this.openMembers();
      return;
    }
    this.openEventEditor();
  }
  toggleParticipantFilter() {
    this.participantOnly = !this.participantOnly;
    this.invalidateLoadedRuntime();
  }
  openEventEditor() {
    const request = this.eventSubeventsStore.eventSubeventsListPopup();
    if (!request) {
      return;
    }
    this.memberMenuStore.requestActivitiesNavigation({
      type: "eventEditor",
      eventId: request.eventId,
      target: request.target ?? "events",
      readOnly: request.editorAction === "view"
    });
  }
  openMembers() {
    const event = this.event;
    if (!event || this.membersDisabled()) {
      return;
    }
    const sync = this.activityStore.activityMembersSyncByOwnerId()[event.id] ?? null;
    this.memberMenuStore.requestActivitiesNavigation({
      type: "members",
      ownerId: event.id,
      ownerType: "event",
      subtitle: event.title ?? "",
      canManage: this.eventSubeventsStore.eventSubeventsListPopup()?.canEdit === true,
      acceptedMembers: Math.max(0, Math.trunc(Number(sync?.acceptedMembers ?? event.acceptedMembers) || 0)),
      pendingMembers: Math.max(0, Math.trunc(Number(sync?.pendingMembers ?? event.pendingMembers) || 0)),
      capacityTotal: Math.max(0, Math.trunc(Number(sync?.capacityTotal ?? event.capacityTotal) || 0))
    });
  }
  membersDisabled() {
    return this.isLoading || !`${this.event?.id ?? ""}`.trim();
  }
  eventPendingMembersCount() {
    const event = this.event;
    if (!event) {
      return 0;
    }
    const eventId = `${event.id ?? ""}`.trim();
    const sync = this.activityStore.activityMembersSyncByOwnerId()[eventId] ?? null;
    const pendingRaw = sync ? sync.pendingMembers : event.pendingMembersCount ?? event.pendingCount ?? event.pendingMembers ?? event.pending ?? event.pendingInvites ?? 0;
    const pendingCount = Number(pendingRaw);
    if (!Number.isFinite(pendingCount) || pendingCount <= 0) {
      return 0;
    }
    return Math.floor(pendingCount);
  }
  cardFor(item, groupLabel) {
    const section = this.slotSectionForItem(item);
    const sequence = this.subEventSequence(item);
    return EventSubeventRuntimeInfoCardConverter.convert(item, {
      event: this.event,
      mode: this.event?.mode,
      cardId: this.subEventItemKey(item),
      slotTimeframe: section?.slot.timeframe ?? null,
      groupLabel,
      sequenceNumber: sequence.number,
      sequenceTotal: sequence.total,
      hasMenuOptions: true,
      menuTitle: item.name,
      translateParams: (key, values, fallback) => this.i18n.translateParams(key, values, fallback)
    });
  }
  subEventMenuContext(item) {
    return { itemKey: this.subEventItemKey(item) };
  }
  subEventMenuItems(item) {
    const section = this.slotSectionForItem(item);
    const sequence = this.subEventSequence(item);
    return EventSubeventRuntimeMenuConverter.convert(item, {
      event: this.event,
      mode: this.event?.mode,
      canManageTournament: this.canManageRuntimeActions(),
      parentEventId: section?.slot.parentEventId ?? this.event?.id ?? null,
      slotId: section?.slot.slotSourceId ?? null,
      sourceId: this.subEventOwnerId(item),
      subEventIndex: this.subEventIndex(item),
      stageNumber: sequence.number,
      siblingItems: this.subEventSiblings(item),
      nowMs: Date.now()
    });
  }
  onSubEventMenuSelect(event) {
    const menuEvent = event;
    const context = menuEvent.context;
    if (!context) {
      return;
    }
    menuEvent.sourceEvent.stopPropagation();
    switch (context.scope) {
      case "stage-status":
        this.requestStageStatusAction(context);
        return;
      case "stage-dashboard":
        this.openTournamentGroupsPopup(context, menuEvent.sourceEvent);
        return;
      case "resource":
        this.openSubEventResourcePopup(context, menuEvent.sourceEvent);
        return;
      default:
        return;
    }
  }
  requestStageStatusAction(context) {
    if (!this.canManageRuntimeActions()) {
      return;
    }
    this.dialogStore.open({
      title: context.title,
      message: context.description,
      cancelLabel: "Cancel",
      confirmLabel: context.confirmLabel,
      busyConfirmLabel: context.busyLabel,
      confirmTone: context.destructive ? "danger" : "accent",
      confirmPalette: context.confirmPalette,
      failureMessage: "Action failed.",
      onConfirm: async () => {
        await this.applyStageStatusAction(context);
      }
    });
  }
  async applyStageStatusAction(context) {
    const userId = this.activeUserId();
    const section = this.slotSectionForItem(context.item);
    const sourceId = `${context.parentEventId ?? section?.slot.parentEventId ?? this.event?.id ?? context.sourceId ?? ""}`.trim();
    const slotSourceId = `${context.slotId ?? section?.slot.slotSourceId ?? ""}`.trim() || null;
    const action = `${context.action ?? ""}`.trim();
    if (!userId || !sourceId || !action) {
      throw new Error("Missing stage action target.");
    }
    const result = await this.eventsService.applyStageAction({
      userId,
      sourceId,
      slotSourceId,
      subEventId: context.subEventId,
      subEventIndex: context.subEventIndex,
      action,
      reason: context.reason
    });
    if (!result) {
      throw new Error("Stage action was not applied.");
    }
    if (`${result.stageStatus ?? ""}`.trim() !== context.nextStatus) {
      throw new Error("Stage action was not applied.");
    }
    this.patchSubEventStageActionResult(context.item, result);
  }
  patchSubEventStageActionResult(item, result) {
    const resultId = `${result.subEventId ?? ""}`.trim();
    const itemId = `${item.id ?? ""}`.trim();
    const index = this.subEventIndex(item);
    if (resultId && itemId && resultId !== itemId) {
      return;
    }
    if (!resultId && Number.isFinite(Number(result.subEventIndex)) && Math.trunc(Number(result.subEventIndex)) !== index) {
      return;
    }
    item.stageStatus = `${result.stageStatus ?? ""}`.trim() || item.stageStatus;
    item.stageStatusReason = `${result.stageStatusReason ?? ""}`.trim() || null;
    item.stageStatusUpdatedAt = `${result.stageStatusUpdatedAt ?? ""}`.trim() || null;
    item.stageFinalizedAt = `${result.stageFinalizedAt ?? ""}`.trim() || null;
    item.stageFinalizedByUserId = `${result.stageFinalizedByUserId ?? ""}`.trim() || null;
    item.stageResultRevision = Math.max(0, Math.trunc(Number(result.stageResultRevision) || 0));
    if (this.event && result.autoInviter !== void 0 && result.autoInviter !== null) {
      this.event.autoInviter = result.autoInviter === true;
    }
    const eventId = `${this.event?.id ?? result.sourceId ?? ""}`.trim();
    if (eventId) {
      this.activityStore.emitActivityEventRuntimeSync({
        eventId,
        subEventId: resultId || itemId,
        activityDelta: 0,
        currentStage: tournamentCurrentStageFromSubEvents(this.items),
        source: "stage"
      });
    }
    this.cdr.markForCheck();
  }
  openSubEventResourcePopup(context, event) {
    event.stopPropagation();
    if (context.resourceType === "Members") {
      this.openSubEventMembersPopup(context);
      return;
    }
    const ownerId = `${context.sourceId ?? ""}`.trim();
    const item = context.item;
    if (!ownerId) {
      return;
    }
    const parentTitle = this.popupSubtitle();
    const itemTitle = `${item.name ?? ""}`.trim();
    const timeframe = AppUtils.dateTimeRangeLabel(item.startAt, item.endAt, "");
    this.resourcePopupStore.requestSubEventResourcePopup({
      type: context.resourceType,
      ownerId,
      assetOwnerUserId: this.event?.creatorUserId ?? null,
      viewOnly: this.eventSubeventsStore.eventSubeventsListPopup()?.editorAction === "view",
      parentTitle: this.popupSubtitle(),
      subEventId: `${item.id ?? ""}`.trim(),
      subEventIndex: context.subEventIndex,
      popupHeader: {
        title: this.joinDistinctResourcePopupHeaderLabels([parentTitle, itemTitle]) || parentTitle || itemTitle || "Event",
        subtitle: timeframe || null
      },
      subEventHeader: {
        name: item.name,
        description: item.description,
        location: item.location,
        startAt: item.startAt,
        endAt: item.endAt
      }
    });
  }
  openSubEventMembersPopup(context) {
    const ownerId = `${context.sourceId ?? ""}`.trim();
    const item = context.item;
    const subEventId = `${item.id ?? ""}`.trim();
    const memberOwnerId = this.memberOwnerIdFromParts(ownerId, subEventId);
    if (!memberOwnerId) {
      return;
    }
    const acceptedMembers = this.nonNegativeInteger(item.membersAccepted);
    const pendingMembers = this.nonNegativeInteger(item.membersPending);
    const capacityTotal = Math.max(acceptedMembers, pendingMembers + acceptedMembers, this.nonNegativeInteger(item.capacityMax));
    void this.activitiesStore.ensureEventMembersPopupLoaded();
    this.memberMenuStore.requestActivitiesNavigation({
      type: "members",
      ownerId: memberOwnerId,
      ownerType: "subEvent",
      parentOwnerId: ownerId,
      parentOwnerType: "event",
      eventId: ownerId,
      subEventId,
      subtitle: `${item.name ?? ""}`.trim() || this.popupSubtitle(),
      canManage: this.eventSubeventsStore.eventSubeventsListPopup()?.canEdit === true,
      acceptedMembers,
      pendingMembers,
      capacityTotal,
      metricIdentity: this.chatMetricIdentityFromParts(ownerId, subEventId)
    });
  }
  memberOwnerIdFromParts(ownerIdValue, subEventIdValue) {
    const ownerId = `${ownerIdValue ?? ""}`.trim();
    const subEventId = `${subEventIdValue ?? ""}`.trim();
    if (ownerId && subEventId) {
      return `${ownerId}:${subEventId}`;
    }
    return subEventId || ownerId;
  }
  chatMetricIdentityFromParts(ownerIdValue, subEventIdValue) {
    const ownerId = `${ownerIdValue ?? ""}`.trim();
    const subEventId = `${subEventIdValue ?? ""}`.trim();
    if (!ownerId || !subEventId) {
      return "";
    }
    const chatOwnerId = `${ownerId}:${subEventId}`;
    return ActivityChatSingleRowConverter.smartListKeyForIdentity("optionalSubEvent", chatOwnerId, chatOwnerId);
  }
  nonNegativeInteger(value) {
    if (!Number.isFinite(Number(value))) {
      return 0;
    }
    return Math.max(0, Math.trunc(Number(value)));
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
  openTournamentGroupsPopup(context, event) {
    event.stopPropagation();
    const eventId = `${context.parentEventId ?? this.event?.id ?? ""}`.trim();
    if (!eventId) {
      return;
    }
    this.eventSubeventsStore.openEventTournamentGroupsPopup({
      eventId,
      slotId: context.slotId,
      title: this.popupSubtitle(),
      canManage: this.canManageRuntimeActions(),
      stages: this.subEventSiblings(context.item).map((stage, index) => this.subEventTournamentStage(stage, index)),
      selectedStageId: `${context.item.id ?? ""}`.trim() || null
    });
  }
  subEventTournamentStage(item, index) {
    const stageNumber = Math.max(1, index + 1);
    return {
      subEventId: `${item.id ?? `stage-${stageNumber}`}`.trim() || `stage-${stageNumber}`,
      title: `${item.name ?? `Stage ${stageNumber}`}`.trim() || `Stage ${stageNumber}`,
      description: `${item.description ?? ""}`.trim(),
      location: `${item.location ?? ""}`.trim(),
      startAt: `${item.startAt ?? ""}`.trim(),
      endAt: `${item.endAt ?? ""}`.trim(),
      stageNumber,
      stageStatus: `${item.stageStatus ?? ""}`.trim(),
      leaderboardType: item.tournamentLeaderboardType === "Fifa" ? "Fifa" : "Score",
      advancePerGroup: Math.max(0, Math.trunc(Number(item.tournamentAdvancePerGroup) || 0)),
      groups: []
    };
  }
  subEventOwnerId(item) {
    const section = this.slotSectionForItem(item);
    return section ? EventSubeventsSlotConverter.slotOwnerId(section) : `${this.event?.id ?? ""}`.trim();
  }
  applyTournamentGroupsUpdate(update) {
    const openEventId = `${this.eventSubeventsStore.eventSubeventsListPopup()?.eventId ?? ""}`.trim();
    const eventId = `${update.eventId ?? ""}`.trim();
    const ownerId = `${update.slotId ?? eventId}`.trim();
    const stageId = `${update.stageId ?? ""}`.trim();
    if (!eventId || eventId !== openEventId || !ownerId || !stageId) {
      return;
    }
    let changed = false;
    const patchItem = (item) => {
      if (this.subEventOwnerId(item) !== ownerId || `${item.id ?? ""}`.trim() !== stageId) {
        return item;
      }
      changed = true;
      return __spreadProps(__spreadValues({}, item), {
        groupsCount: Math.max(0, Math.trunc(Number(update.groupsCount) || 0)),
        groupsPending: Math.max(0, Math.trunc(Number(update.groupsPending) || 0))
      });
    };
    const nextSections = this.slotSections.map((section) => {
      const nextItems2 = section.items.map(patchItem);
      return __spreadProps(__spreadValues({}, section), {
        items: nextItems2,
        slot: __spreadProps(__spreadValues({}, section.slot), {
          subEventItems: nextItems2
        })
      });
    });
    const nextItems = nextSections.length > 0 ? nextSections.flatMap((section) => section.items) : this.items.map(patchItem);
    if (!changed) {
      return;
    }
    this.slotSections = nextSections;
    this.items = nextItems;
    this.syncSubEventSmartListCaches(nextSections);
    this.activityStore.emitActivityEventRuntimeSync({
      eventId,
      subEventId: stageId,
      activityDelta: update.groupsPendingDelta,
      source: "groups"
    });
    this.cdr.markForCheck();
  }
  syncSubEventSmartListCaches(sections) {
    this.subeventsSmartList?.syncVisibleItems(sections, {
      total: sections.length,
      trackBy: (_index, section) => section.id,
      equals: (current, next) => current === next
    });
    const sectionLists = this.slotSectionSmartLists?.toArray() ?? [];
    sections.forEach((section, index) => {
      sectionLists[index]?.syncVisibleItems(section.items, {
        total: section.items.length,
        trackBy: (itemIndex, item) => this.subEventItemKey(item, itemIndex),
        equals: (current, next) => current === next
      });
    });
  }
  applySubEventResourceMetricsUpdate(update) {
    const ownerId = `${update.ownerId ?? ""}`.trim();
    const subEventId = `${update.subEventId ?? ""}`.trim();
    if (!ownerId || !subEventId) {
      return;
    }
    let changed = false;
    let inferredActivityDelta = 0;
    const patchItem = (item) => {
      const itemOwnerId = this.subEventOwnerId(item);
      const itemId = `${item.id ?? ""}`.trim();
      if (itemOwnerId !== ownerId || itemId !== subEventId) {
        return item;
      }
      const metricsUnchanged = item.carsAccepted === update.subEvent.carsAccepted && item.carsPending === update.subEvent.carsPending && item.carsCapacityMin === update.subEvent.carsCapacityMin && item.carsCapacityMax === update.subEvent.carsCapacityMax && item.accommodationAccepted === update.subEvent.accommodationAccepted && item.accommodationPending === update.subEvent.accommodationPending && item.accommodationCapacityMin === update.subEvent.accommodationCapacityMin && item.accommodationCapacityMax === update.subEvent.accommodationCapacityMax && item.suppliesAccepted === update.subEvent.suppliesAccepted && item.suppliesPending === update.subEvent.suppliesPending && item.suppliesCapacityMin === update.subEvent.suppliesCapacityMin && item.suppliesCapacityMax === update.subEvent.suppliesCapacityMax;
      if (metricsUnchanged) {
        return item;
      }
      const nextItem = __spreadProps(__spreadValues({}, item), {
        carsAccepted: update.subEvent.carsAccepted,
        carsPending: update.subEvent.carsPending,
        carsCapacityMin: update.subEvent.carsCapacityMin,
        carsCapacityMax: update.subEvent.carsCapacityMax,
        accommodationAccepted: update.subEvent.accommodationAccepted,
        accommodationPending: update.subEvent.accommodationPending,
        accommodationCapacityMin: update.subEvent.accommodationCapacityMin,
        accommodationCapacityMax: update.subEvent.accommodationCapacityMax,
        suppliesAccepted: update.subEvent.suppliesAccepted,
        suppliesPending: update.subEvent.suppliesPending,
        suppliesCapacityMin: update.subEvent.suppliesCapacityMin,
        suppliesCapacityMax: update.subEvent.suppliesCapacityMax
      });
      changed = true;
      inferredActivityDelta += this.runtimeBadgeCount(nextItem) - this.runtimeBadgeCount(item);
      return nextItem;
    };
    const nextSlotSections = this.slotSections.map((section) => {
      const nextItems2 = section.items.map(patchItem);
      return __spreadProps(__spreadValues({}, section), {
        items: nextItems2,
        slot: __spreadProps(__spreadValues({}, section.slot), {
          subEventItems: nextItems2
        })
      });
    });
    const nextItems = nextSlotSections.length > 0 ? nextSlotSections.flatMap((section) => section.items) : this.items.map(patchItem);
    const activityDelta = update.activityDelta === void 0 ? inferredActivityDelta : Math.trunc(Number(update.activityDelta) || 0);
    if (!changed && activityDelta === 0) {
      return;
    }
    if (changed) {
      this.slotSections = nextSlotSections;
      this.items = nextItems;
      this.syncSubEventSmartListCaches(nextSlotSections);
    }
    if (activityDelta !== 0) {
      this.activityStore.emitActivityEventRuntimeSync({
        eventId: `${this.event?.id ?? ""}`.trim(),
        subEventId,
        activityDelta,
        source: "resources"
      });
    }
    if (changed) {
      this.cdr.markForCheck();
    }
  }
  applySubEventMembersSync(sync) {
    const memberOwnerId = `${sync.id ?? ""}`.trim();
    if (!memberOwnerId) {
      return;
    }
    let changed = false;
    let activityDelta = 0;
    let changedSubEventId = "";
    const patchItem = (item) => {
      const itemMemberOwnerId = this.memberOwnerIdFromParts(this.subEventOwnerId(item), `${item.id ?? ""}`.trim());
      if (itemMemberOwnerId !== memberOwnerId) {
        return item;
      }
      const nextItem = __spreadProps(__spreadValues({}, item), {
        membersAccepted: Math.max(0, Math.trunc(Number(sync.acceptedMembers) || 0)),
        membersPending: Math.max(0, Math.trunc(Number(sync.pendingMembers) || 0))
      });
      changed = true;
      changedSubEventId = `${item.id ?? ""}`.trim();
      activityDelta += this.runtimeBadgeCount(nextItem) - this.runtimeBadgeCount(item);
      return nextItem;
    };
    const nextSlotSections = this.slotSections.map((section) => {
      const nextItems2 = section.items.map(patchItem);
      return __spreadProps(__spreadValues({}, section), {
        items: nextItems2,
        slot: __spreadProps(__spreadValues({}, section.slot), {
          subEventItems: nextItems2
        })
      });
    });
    const nextItems = nextSlotSections.length > 0 ? nextSlotSections.flatMap((section) => section.items) : this.items.map(patchItem);
    if (!changed) {
      return;
    }
    this.slotSections = nextSlotSections;
    this.items = nextItems;
    this.syncSubEventSmartListCaches(nextSlotSections);
    this.activityStore.emitActivityEventRuntimeSync({
      eventId: `${this.event?.id ?? ""}`.trim(),
      subEventId: changedSubEventId,
      activityDelta,
      source: "members"
    });
    this.cdr.markForCheck();
  }
  runtimeBadgeCount(item) {
    return EventSubeventRuntimeMenuConverter.runtimeBadgeCount(item, {
      event: this.event,
      mode: this.event?.mode
    });
  }
  subEventIndex(item) {
    const siblings = this.subEventSiblings(item);
    const index = siblings.findIndex((candidate) => candidate === item);
    return index >= 0 ? index : 0;
  }
  subEventSiblings(item) {
    const sourceId = this.subEventOwnerId(item);
    const section = this.slotSectionForItem(item);
    const scoped = section?.items ?? this.items.filter((candidate) => this.subEventOwnerId(candidate) === sourceId);
    return [...scoped].sort((left, right) => this.dateMs(left.startAt) - this.dateMs(right.startAt));
  }
  canManageRuntimeActions() {
    if (this.eventSubeventsStore.eventSubeventsListPopup()?.canEdit === true) {
      return true;
    }
    const event = this.event;
    const activeUserId = this.activeUserId();
    if (!event || !activeUserId) {
      return false;
    }
    const creatorId = `${event.creatorUserId ?? event.userId ?? ""}`.trim();
    const ownerId = `${event.userId ?? ""}`.trim();
    const adminIds = Array.isArray(event.adminIds) ? event.adminIds.map((id) => `${id}`.trim()) : [];
    return activeUserId === creatorId || activeUserId === ownerId || adminIds.includes(activeUserId);
  }
  activeUserId() {
    return this.userProfileStore.activeUserProfile()?.id?.trim() || this.userProfileStore.activeUserId().trim() || this.userProfileStore.getActiveUserId().trim();
  }
  trackBySubEventItem(index, item) {
    return this.subEventItemKey(item, index);
  }
  slotSectionLoadPage(section) {
    const sectionId = section.id;
    const existing = this.slotSectionLoaders.get(sectionId);
    if (existing) {
      return existing;
    }
    const loader = (query) => of(this.slotSectionPageResult(sectionId, query));
    this.slotSectionLoaders.set(sectionId, loader);
    return loader;
  }
  slotSectionSmartListConfigFor(section) {
    const sectionId = section.id;
    const existing = this.slotSectionConfigs.get(sectionId);
    if (existing) {
      return existing;
    }
    const config = section.isSlot ? __spreadValues({}, this.baseSlotSectionSmartListConfig) : __spreadValues({}, this.flatSubEventsSmartListConfig);
    this.slotSectionConfigs.set(sectionId, config);
    return config;
  }
  async loadSubEventsPageResult(query) {
    const eventId = this.eventSubeventsStore.eventSubeventsListPopup()?.eventId.trim() ?? "";
    if (!eventId) {
      return { items: [], total: 0, nextCursor: null };
    }
    await this.ensureSubEventsLoaded(eventId, query);
    if (this.loadedPageTotal !== null) {
      return {
        items: this.slotSections,
        total: this.loadedPageTotal,
        nextCursor: this.loadedPageNextCursor
      };
    }
    const sorted = this.slotSections;
    const page = Math.max(0, Math.trunc(Number(query.page) || 0));
    const pageSize = Math.max(1, Math.trunc(Number(query.pageSize) || 12));
    const start = page * pageSize;
    return {
      items: sorted.slice(start, start + pageSize),
      total: sorted.length,
      nextCursor: start + pageSize < sorted.length ? `${page + 1}` : null
    };
  }
  async ensureSubEventsLoaded(eventId, query) {
    const queryKey = this.subEventsLoadQueryKey(eventId, query);
    if (this.loadedEventId === eventId && this.loadedQueryKey === queryKey) {
      return;
    }
    if (this.loadingEventId === eventId && this.loadingQueryKey === queryKey && this.loadingPromise) {
      return this.loadingPromise;
    }
    const userId = this.userProfileStore.activeUserProfile()?.id?.trim() ?? "";
    if (!userId) {
      this.event = null;
      this.items = [];
      this.slotSections = [];
      this.slotSectionHeaderLabels.clear();
      this.loadedPageTotal = null;
      this.loadedPageNextCursor = null;
      this.loadedEventId = eventId;
      this.loadedQueryKey = queryKey;
      return;
    }
    this.loadingEventId = eventId;
    this.loadingQueryKey = queryKey;
    this.isLoading = true;
    this.cdr.markForCheck();
    this.loadingPromise = (async () => {
      const result = await this.eventsService.loadSubEventsById(userId, eventId, this.subEventsLoadQuery(eventId, query));
      if (this.eventSubeventsStore.eventSubeventsListPopup()?.eventId !== eventId) {
        return;
      }
      this.applyLoadedSubEventsSlots(eventId, result, query);
    })().finally(() => {
      if (this.loadingEventId === eventId && this.loadingQueryKey === queryKey) {
        this.loadingEventId = "";
        this.loadingQueryKey = "";
        this.loadingPromise = null;
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
    return this.loadingPromise;
  }
  applyLoadedSubEventsSlots(eventId, result, query) {
    const requestEvent = this.parentContextFromRequest(eventId);
    const event = __spreadProps(__spreadValues({}, requestEvent), {
      mode: result?.mode ?? null
    });
    const slots = result?.slots ?? [];
    this.event = event;
    this.slotSections = EventSubeventsSlotConverter.convertList(slots, {
      event,
      order: this.order
    });
    this.syncSlotSectionHeaderLabels(this.slotSections);
    this.items = this.slotSections.flatMap((section) => section.items);
    this.loadedPageTotal = Number.isFinite(result?.total) ? Math.max(0, Math.trunc(Number(result?.total))) : null;
    this.loadedPageNextCursor = typeof result?.nextCursor === "string" && result.nextCursor.trim().length > 0 ? result.nextCursor : null;
    this.loadedEventId = eventId;
    this.loadedQueryKey = this.subEventsLoadQueryKey(eventId, query);
    this.cdr.markForCheck();
  }
  parentContextFromRequest(eventId) {
    const request = this.eventSubeventsStore.eventSubeventsListPopup();
    return {
      id: eventId,
      title: request?.title ?? null,
      timeframe: request?.timeframe ?? null,
      startAtIso: request?.startAtIso ?? null,
      endAtIso: request?.endAtIso ?? null,
      mode: request?.mode ?? null,
      acceptedMembers: request?.acceptedMembers ?? 0,
      pendingMembers: request?.pendingMembers ?? 0,
      capacityTotal: request?.capacityTotal ?? 0,
      creatorUserId: request?.resourceOwnerUserId ?? null
    };
  }
  slotSectionPageResult(sectionId, query) {
    const section = this.slotSections.find((candidate) => candidate.id === sectionId) ?? null;
    const items = section?.items ?? [];
    const page = Math.max(0, Math.trunc(Number(query.page) || 0));
    const pageSize = Math.max(1, Math.trunc(Number(query.pageSize) || 120));
    const start = page * pageSize;
    return {
      items: items.slice(start, start + pageSize),
      total: items.length,
      nextCursor: start + pageSize < items.length ? `${page + 1}` : null
    };
  }
  subEventSequence(item) {
    const section = this.slotSectionForItem(item);
    const items = section?.items ?? this.items;
    const index = items.findIndex((candidate) => candidate === item);
    return {
      number: index >= 0 ? index + 1 : 1,
      total: Math.max(items.length, 1)
    };
  }
  slotSectionForItem(item) {
    return this.slotSections.find((section) => section.items.some((candidate) => candidate === item)) ?? null;
  }
  subEventItemKey(item, fallbackIndex = 0) {
    const section = this.slotSectionForItem(item);
    if (!section) {
      return `${item.id ?? ""}`.trim() || `subevent-${fallbackIndex + 1}`;
    }
    const itemIndex = section.items.findIndex((candidate) => candidate === item);
    return EventSubeventsSlotConverter.itemKey(section, item, itemIndex >= 0 ? itemIndex : fallbackIndex);
  }
  slotHeaderLabel(item) {
    const mapped = this.slotSectionHeaderLabels.get(this.subEventItemKey(item));
    if (mapped) {
      return mapped;
    }
    const section = this.slotSectionForItem(item);
    return section ? EventSubeventsSlotConverter.headerLabel(section) : "Sub events";
  }
  syncSlotSectionHeaderLabels(sections) {
    this.slotSectionHeaderLabels.clear();
    sections.forEach((section) => {
      const label = EventSubeventsSlotConverter.headerLabel(section);
      section.items.forEach((item, index) => {
        this.slotSectionHeaderLabels.set(EventSubeventsSlotConverter.itemKey(section, item, index), label);
      });
    });
  }
  slotSectionToneClass(section) {
    return {
      [`event-subevents-slot-section--${section.tone}`]: true,
      "event-subevents-slot-section--flat": !section.isSlot
    };
  }
  syncMobileViewFromViewport() {
    const next = typeof window !== "undefined" && window.innerWidth <= 760;
    if (next === this.isMobileView) {
      return;
    }
    this.isMobileView = next;
    this.cdr.markForCheck();
  }
  groupLabel(value, view) {
    const date = AppUtils.parseDate(value);
    if (!date) {
      return "Date unavailable";
    }
    if (view === "month") {
      return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    }
    if (view === "week") {
      const start = AppUtils.startOfWeekMonday(date);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `${AppUtils.shortMonthDayLabel(start)} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    }
    return AppUtils.smartListDayLabel(date);
  }
  dateMs(value) {
    return AppUtils.parseDate(value)?.getTime() ?? Number.POSITIVE_INFINITY;
  }
  slotSectionCalendarRange(section) {
    const start = AppUtils.parseDate(section.startAt);
    const end = AppUtils.parseDate(section.endAt) ?? start;
    if (!start || !end) {
      return null;
    }
    return {
      start,
      end: end.getTime() >= start.getTime() ? end : start
    };
  }
  calendarInitialAnchor() {
    const event = this.event;
    if (!event) {
      return null;
    }
    const today = AppUtils.dateOnly(/* @__PURE__ */ new Date());
    const start = AppUtils.parseDate(event.startAtIso);
    const end = AppUtils.parseDate(event.endAtIso);
    if (this.order === "past") {
      if (end && end.getTime() < today.getTime()) {
        return end;
      }
      return start && start.getTime() > today.getTime() ? start : today;
    }
    if (start && start.getTime() > today.getTime()) {
      return start;
    }
    return end && end.getTime() < today.getTime() ? end : today;
  }
  subEventsLoadQueryKey(eventId, query) {
    const loadQuery = this.subEventsLoadQuery(eventId, query);
    return [
      loadQuery.eventId,
      loadQuery.order ?? "",
      loadQuery.view ?? "",
      loadQuery.anchorDate ?? "",
      loadQuery.rangeStart ?? "",
      loadQuery.rangeEnd ?? "",
      loadQuery.participantOnly === true ? "participantOnly" : "allParts",
      loadQuery.page ?? 0,
      loadQuery.pageSize ?? 12,
      loadQuery.cursor ?? ""
    ].join("|");
  }
  subEventsLoadQuery(eventId, query) {
    return {
      userId: this.userProfileStore.activeUserProfile()?.id?.trim() ?? "",
      eventId,
      order: this.order,
      view: query.view ?? this.view,
      anchorDate: query.anchorDate ?? null,
      rangeStart: query.rangeStart ?? null,
      rangeEnd: query.rangeEnd ?? null,
      participantOnly: this.participantOnly,
      page: query.page,
      pageSize: query.pageSize,
      cursor: query.cursor ?? null
    };
  }
  invalidateLoadedRuntime() {
    this.loadedEventId = "";
    this.loadedQueryKey = "";
    this.loadingEventId = "";
    this.loadingQueryKey = "";
    this.loadingPromise = null;
    this.loadedPageTotal = null;
    this.loadedPageNextCursor = null;
    this.bumpQuery();
    this.cdr.markForCheck();
  }
  bumpQuery() {
    this.revision += 1;
    const revisionFilter = { revision: this.revision };
    this.query = __spreadProps(__spreadValues({}, this.query), {
      view: this.view,
      direction: this.order === "past" ? "desc" : "asc",
      filters: revisionFilter
    });
    this.slotSectionQuery = {
      filters: revisionFilter
    };
  }
  static \u0275fac = function EventSubeventsListPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EventSubeventsListPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EventSubeventsListPopupComponent, selectors: [["app-event-subevents-list-popup"]], viewQuery: function EventSubeventsListPopupComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5)(_c1, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.subeventsSmartList = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.slotSectionSmartLists = _t);
    }
  }, hostBindings: function EventSubeventsListPopupComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("resize", function EventSubeventsListPopupComponent_resize_HostBindingHandler() {
        return ctx.onWindowResize();
      }, \u0275\u0275resolveWindow);
    }
  }, decls: 1, vars: 1, consts: [["subeventsSmartList", ""], ["slotSectionTemplate", ""], ["subEventTemplate", ""], ["slotSectionSmartList", ""], [3, "model", "zIndex"], [1, "event-subevents-list-smart-list", 3, "config", "loadPage", "itemTemplate", "query"], [1, "event-subevents-slot-section", 3, "ngClass"], [1, "event-subevents-slot-section-list", 3, "menuItemSelect", "config", "loadPage", "query", "itemTemplate"], [3, "menuRequest", "card", "useSharedMenu", "useSharedMenuTrigger", "sharedMenuContext"], [4, "ngComponentOutlet"]], template: function EventSubeventsListPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, EventSubeventsListPopupComponent_Conditional_0_Template, 11, 10);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.isOpen() ? 0 : -1);
    }
  }, dependencies: [
    CommonModule,
    NgClass,
    NgComponentOutlet,
    PopupComponent,
    SmartListComponent,
    InfoCardComponent
  ], styles: ["\n.smart-list-stage[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  min-height: 0;\n  overflow: hidden;\n}\n.smart-list-stage__list-shell[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  min-height: 0;\n  height: 100%;\n  overflow: hidden;\n}\n.smart-list-stage__list-shell[_ngcontent-%COMP%]    > app-smart-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex: 1 1 auto;\n  min-height: 0;\n}\n.smart-list-stage__list-shell.is-occluded[_ngcontent-%COMP%] {\n  opacity: 0;\n  pointer-events: none;\n}\n.smart-list-stage__overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  z-index: 4;\n  display: flex;\n  flex-direction: column;\n  min-height: 0;\n  pointer-events: none;\n}\n.smart-list-stage__overlay[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%] {\n  pointer-events: auto;\n}\n[_nghost-%COMP%] {\n  display: contents;\n}\n.event-subevents-list-smart-list[_ngcontent-%COMP%] {\n  min-height: 0;\n  flex: 1 1 auto;\n  width: 100%;\n}\n.event-subevents-slot-section[_ngcontent-%COMP%] {\n  --event-subevents-slot-section-border: rgba(64, 105, 157, 0.24);\n  --event-subevents-slot-section-bg-start: rgba(241, 247, 255, 0.94);\n  --event-subevents-slot-section-bg-end: rgba(248, 251, 255, 0.88);\n  --event-subevents-slot-section-shadow: rgba(64, 105, 157, 0.08);\n  --smart-list-slot-header-border: var(--event-subevents-slot-section-border);\n  --smart-list-slot-header-bg:\n    linear-gradient(\n      \n      135deg,\n      var(--event-subevents-slot-section-bg-start) 0%,\n      var(--event-subevents-slot-section-bg-end) 100% );\n  --smart-list-slot-header-color: #254a78;\n  --smart-list-slot-header-action-border: var(--event-subevents-slot-section-border);\n  --smart-list-slot-header-action-bg: rgba(255, 255, 255, 0.92);\n  --smart-list-slot-header-action-color: #254a78;\n  display: flex;\n  width: 100%;\n  min-width: 0;\n  min-height: 0;\n  padding: 0.52rem;\n  border: 1px solid var(--event-subevents-slot-section-border);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      var(--event-subevents-slot-section-bg-start) 0%,\n      var(--event-subevents-slot-section-bg-end) 100%);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.76), 0 8px 22px var(--event-subevents-slot-section-shadow);\n  scroll-snap-align: start;\n  scroll-snap-stop: always;\n  box-sizing: border-box;\n}\n.event-subevents-slot-section--green[_ngcontent-%COMP%] {\n  --event-subevents-slot-section-border: rgba(54, 156, 106, 0.28);\n  --event-subevents-slot-section-bg-start: rgba(232, 249, 240, 0.96);\n  --event-subevents-slot-section-bg-end: rgba(244, 252, 247, 0.9);\n  --event-subevents-slot-section-shadow: rgba(54, 156, 106, 0.09);\n  --smart-list-slot-header-color: #166c45;\n  --smart-list-slot-header-action-color: #166c45;\n}\n.event-subevents-slot-section--cyan[_ngcontent-%COMP%] {\n  --event-subevents-slot-section-border: rgba(40, 148, 164, 0.28);\n  --event-subevents-slot-section-bg-start: rgba(226, 248, 251, 0.96);\n  --event-subevents-slot-section-bg-end: rgba(242, 252, 253, 0.9);\n  --event-subevents-slot-section-shadow: rgba(40, 148, 164, 0.09);\n  --smart-list-slot-header-color: #146b78;\n  --smart-list-slot-header-action-color: #146b78;\n}\n.event-subevents-slot-section--violet[_ngcontent-%COMP%] {\n  --event-subevents-slot-section-border: rgba(128, 83, 209, 0.3);\n  --event-subevents-slot-section-bg-start: rgba(241, 233, 255, 0.96);\n  --event-subevents-slot-section-bg-end: rgba(249, 245, 255, 0.9);\n  --event-subevents-slot-section-shadow: rgba(128, 83, 209, 0.09);\n  --smart-list-slot-header-color: #6640a8;\n  --smart-list-slot-header-action-color: #6640a8;\n}\n.event-subevents-slot-section--amber[_ngcontent-%COMP%] {\n  --event-subevents-slot-section-border: rgba(195, 124, 42, 0.3);\n  --event-subevents-slot-section-bg-start: rgba(255, 241, 221, 0.96);\n  --event-subevents-slot-section-bg-end: rgba(255, 249, 240, 0.9);\n  --event-subevents-slot-section-shadow: rgba(195, 124, 42, 0.09);\n  --smart-list-slot-header-color: #804c11;\n  --smart-list-slot-header-action-color: #804c11;\n}\n.event-subevents-slot-section--gold[_ngcontent-%COMP%] {\n  --event-subevents-slot-section-border: rgba(196, 151, 35, 0.3);\n  --event-subevents-slot-section-bg-start: rgba(255, 247, 202, 0.96);\n  --event-subevents-slot-section-bg-end: rgba(255, 252, 232, 0.9);\n  --event-subevents-slot-section-shadow: rgba(196, 151, 35, 0.09);\n  --smart-list-slot-header-color: #765915;\n  --smart-list-slot-header-action-color: #765915;\n}\n.event-subevents-slot-section--flat[_ngcontent-%COMP%] {\n  min-height: 0;\n  padding: 0;\n  border: 0;\n  border-radius: 0;\n  background: transparent;\n  box-shadow: none;\n}\n.event-subevents-slot-section-list[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  min-width: 0;\n  min-height: 0;\n}\n[_nghost-%COMP%]     .event-subevents-slot-section-list .ui-info-card {\n  width: 100%;\n}\n[_nghost-%COMP%]     .event-subevents-slot-section-list .ui-info-card__detail-row {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n@media (max-width: 760px) {\n  .event-subevents-slot-section[_ngcontent-%COMP%]:not(.event-subevents-slot-section--flat) {\n    min-height: 0;\n  }\n}\n@media (min-width: 761px) {\n  [_nghost-%COMP%]     .event-subevents-slot-section-list .smart-list__stage, \n   [_nghost-%COMP%]     .event-subevents-slot-section-list .smart-list__list {\n    align-self: stretch;\n  }\n  [_nghost-%COMP%]     .event-subevents-slot-section-list .smart-list__item-shell, \n   [_nghost-%COMP%]     .event-subevents-slot-section-list app-info-card {\n    display: flex;\n    align-self: flex-start;\n    min-height: 0;\n  }\n  [_nghost-%COMP%]     .event-subevents-slot-section-list .ui-info-card {\n    height: auto;\n    min-height: 15.35rem;\n  }\n}\n/*# sourceMappingURL=event-subevents-list-popup.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EventSubeventsListPopupComponent, [{
    type: Component,
    args: [{ selector: "app-event-subevents-list-popup", standalone: true, imports: [
      CommonModule,
      PopupComponent,
      SmartListComponent,
      InfoCardComponent
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: '@if (isOpen()) {\n  <app-popup [model]="popupModel()" [zIndex]="2400">\n    <app-smart-list\n      #subeventsSmartList\n      class="event-subevents-list-smart-list"\n      [config]="smartListConfig"\n      [loadPage]="loadSubEventsPage"\n      [itemTemplate]="slotSectionTemplate"\n      [query]="query"\n    ></app-smart-list>\n\n    <ng-template #slotSectionTemplate let-section>\n      <section class="event-subevents-slot-section" [ngClass]="slotSectionToneClass(section)">\n        <app-smart-list\n          #slotSectionSmartList\n          class="event-subevents-slot-section-list"\n          [config]="slotSectionSmartListConfigFor(section)"\n          [loadPage]="slotSectionLoadPage(section)"\n          [query]="slotSectionQuery"\n          [itemTemplate]="subEventTemplate"\n          (menuItemSelect)="onSubEventMenuSelect($event)"\n        ></app-smart-list>\n      </section>\n    </ng-template>\n\n    <ng-template #subEventTemplate let-item let-groupLabel="groupLabel" let-openMenu="openMenu">\n      <app-info-card\n        [card]="cardFor(item, groupLabel)"\n        [useSharedMenu]="true"\n        [useSharedMenuTrigger]="false"\n        [sharedMenuContext]="subEventMenuContext(item)"\n        (menuRequest)="openMenu($event)"\n      ></app-info-card>\n    </ng-template>\n  </app-popup>\n\n  @if (eventSubeventsStore.eventTournamentGroupsPopupComponent(); as tournamentGroupsPopupComponent) {\n    <ng-container *ngComponentOutlet="tournamentGroupsPopupComponent"></ng-container>\n  }\n  @if (shouldHostResourcePopup()) {\n    @if (resourcePopupStore.eventResourcePopupComponent(); as resourcePopupComponent) {\n      <ng-container *ngComponentOutlet="resourcePopupComponent"></ng-container>\n    }\n  }\n  @if (shouldHostResourcePopup() && resourcePopupStore.assetExplorePopupRef()) {\n    @if (resourcePopupStore.eventResourceAssetExploreComponent(); as assetExplorePopupComponent) {\n      <ng-container *ngComponentOutlet="assetExplorePopupComponent"></ng-container>\n    }\n  }\n  @if (shouldHostSupplyContributionsPopup()) {\n    @if (resourcePopupStore.eventSupplyContributionsPopupComponent(); as supplyContributionsPopupComponent) {\n      <ng-container *ngComponentOutlet="supplyContributionsPopupComponent"></ng-container>\n    }\n  }\n}\n', styles: ["/* src/app/activity/components/event-subevents-list-popup/event-subevents-list-popup.component.scss */\n.smart-list-stage {\n  position: relative;\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  min-height: 0;\n  overflow: hidden;\n}\n.smart-list-stage__list-shell {\n  position: relative;\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  min-height: 0;\n  height: 100%;\n  overflow: hidden;\n}\n.smart-list-stage__list-shell > app-smart-list {\n  display: flex;\n  flex: 1 1 auto;\n  min-height: 0;\n}\n.smart-list-stage__list-shell.is-occluded {\n  opacity: 0;\n  pointer-events: none;\n}\n.smart-list-stage__overlay {\n  position: absolute;\n  inset: 0;\n  z-index: 4;\n  display: flex;\n  flex-direction: column;\n  min-height: 0;\n  pointer-events: none;\n}\n.smart-list-stage__overlay > * {\n  pointer-events: auto;\n}\n:host {\n  display: contents;\n}\n.event-subevents-list-smart-list {\n  min-height: 0;\n  flex: 1 1 auto;\n  width: 100%;\n}\n.event-subevents-slot-section {\n  --event-subevents-slot-section-border: rgba(64, 105, 157, 0.24);\n  --event-subevents-slot-section-bg-start: rgba(241, 247, 255, 0.94);\n  --event-subevents-slot-section-bg-end: rgba(248, 251, 255, 0.88);\n  --event-subevents-slot-section-shadow: rgba(64, 105, 157, 0.08);\n  --smart-list-slot-header-border: var(--event-subevents-slot-section-border);\n  --smart-list-slot-header-bg:\n    linear-gradient(\n      \n      135deg,\n      var(--event-subevents-slot-section-bg-start) 0%,\n      var(--event-subevents-slot-section-bg-end) 100% );\n  --smart-list-slot-header-color: #254a78;\n  --smart-list-slot-header-action-border: var(--event-subevents-slot-section-border);\n  --smart-list-slot-header-action-bg: rgba(255, 255, 255, 0.92);\n  --smart-list-slot-header-action-color: #254a78;\n  display: flex;\n  width: 100%;\n  min-width: 0;\n  min-height: 0;\n  padding: 0.52rem;\n  border: 1px solid var(--event-subevents-slot-section-border);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      var(--event-subevents-slot-section-bg-start) 0%,\n      var(--event-subevents-slot-section-bg-end) 100%);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.76), 0 8px 22px var(--event-subevents-slot-section-shadow);\n  scroll-snap-align: start;\n  scroll-snap-stop: always;\n  box-sizing: border-box;\n}\n.event-subevents-slot-section--green {\n  --event-subevents-slot-section-border: rgba(54, 156, 106, 0.28);\n  --event-subevents-slot-section-bg-start: rgba(232, 249, 240, 0.96);\n  --event-subevents-slot-section-bg-end: rgba(244, 252, 247, 0.9);\n  --event-subevents-slot-section-shadow: rgba(54, 156, 106, 0.09);\n  --smart-list-slot-header-color: #166c45;\n  --smart-list-slot-header-action-color: #166c45;\n}\n.event-subevents-slot-section--cyan {\n  --event-subevents-slot-section-border: rgba(40, 148, 164, 0.28);\n  --event-subevents-slot-section-bg-start: rgba(226, 248, 251, 0.96);\n  --event-subevents-slot-section-bg-end: rgba(242, 252, 253, 0.9);\n  --event-subevents-slot-section-shadow: rgba(40, 148, 164, 0.09);\n  --smart-list-slot-header-color: #146b78;\n  --smart-list-slot-header-action-color: #146b78;\n}\n.event-subevents-slot-section--violet {\n  --event-subevents-slot-section-border: rgba(128, 83, 209, 0.3);\n  --event-subevents-slot-section-bg-start: rgba(241, 233, 255, 0.96);\n  --event-subevents-slot-section-bg-end: rgba(249, 245, 255, 0.9);\n  --event-subevents-slot-section-shadow: rgba(128, 83, 209, 0.09);\n  --smart-list-slot-header-color: #6640a8;\n  --smart-list-slot-header-action-color: #6640a8;\n}\n.event-subevents-slot-section--amber {\n  --event-subevents-slot-section-border: rgba(195, 124, 42, 0.3);\n  --event-subevents-slot-section-bg-start: rgba(255, 241, 221, 0.96);\n  --event-subevents-slot-section-bg-end: rgba(255, 249, 240, 0.9);\n  --event-subevents-slot-section-shadow: rgba(195, 124, 42, 0.09);\n  --smart-list-slot-header-color: #804c11;\n  --smart-list-slot-header-action-color: #804c11;\n}\n.event-subevents-slot-section--gold {\n  --event-subevents-slot-section-border: rgba(196, 151, 35, 0.3);\n  --event-subevents-slot-section-bg-start: rgba(255, 247, 202, 0.96);\n  --event-subevents-slot-section-bg-end: rgba(255, 252, 232, 0.9);\n  --event-subevents-slot-section-shadow: rgba(196, 151, 35, 0.09);\n  --smart-list-slot-header-color: #765915;\n  --smart-list-slot-header-action-color: #765915;\n}\n.event-subevents-slot-section--flat {\n  min-height: 0;\n  padding: 0;\n  border: 0;\n  border-radius: 0;\n  background: transparent;\n  box-shadow: none;\n}\n.event-subevents-slot-section-list {\n  flex: 1 1 auto;\n  min-width: 0;\n  min-height: 0;\n}\n:host ::ng-deep .event-subevents-slot-section-list .ui-info-card {\n  width: 100%;\n}\n:host ::ng-deep .event-subevents-slot-section-list .ui-info-card__detail-row {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n@media (max-width: 760px) {\n  .event-subevents-slot-section:not(.event-subevents-slot-section--flat) {\n    min-height: 0;\n  }\n}\n@media (min-width: 761px) {\n  :host ::ng-deep .event-subevents-slot-section-list .smart-list__stage,\n  :host ::ng-deep .event-subevents-slot-section-list .smart-list__list {\n    align-self: stretch;\n  }\n  :host ::ng-deep .event-subevents-slot-section-list .smart-list__item-shell,\n  :host ::ng-deep .event-subevents-slot-section-list app-info-card {\n    display: flex;\n    align-self: flex-start;\n    min-height: 0;\n  }\n  :host ::ng-deep .event-subevents-slot-section-list .ui-info-card {\n    height: auto;\n    min-height: 15.35rem;\n  }\n}\n/*# sourceMappingURL=event-subevents-list-popup.component.css.map */\n"] }]
  }], () => [], { subeventsSmartList: [{
    type: ViewChild,
    args: ["subeventsSmartList"]
  }], slotSectionSmartLists: [{
    type: ViewChildren,
    args: ["slotSectionSmartList"]
  }], onWindowResize: [{
    type: HostListener,
    args: ["window:resize"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EventSubeventsListPopupComponent, { className: "EventSubeventsListPopupComponent", filePath: "app/activity/components/event-subevents-list-popup/event-subevents-list-popup.component.ts", lineNumber: 125 });
})();
export {
  EventSubeventsListPopupComponent
};
//# sourceMappingURL=event-subevents-list-popup.component-DWUVELUZ.js.map
