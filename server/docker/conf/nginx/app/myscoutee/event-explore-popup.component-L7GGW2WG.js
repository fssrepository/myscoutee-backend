import {
  EventCheckoutDialogStore,
  EventCheckoutDraftStore,
  EventSubeventsPopupStore
} from "./chunk-JZOSMND3.js";
import "./chunk-GNEKNDCW.js";
import "./chunk-WYVDSPFZ.js";
import "./chunk-7OVYX4QT.js";
import "./chunk-HJS66YQ3.js";
import "./chunk-NM7JYLPY.js";
import "./chunk-LDEYTBOX.js";
import "./chunk-SYKOEE4K.js";
import {
  MemberMenuStore
} from "./chunk-KQF6FQ63.js";
import {
  ActivitiesPopupStore,
  ProfileStore,
  eventChatHeaderStateFromChat,
  eventChatPopupRequestFromChat
} from "./chunk-IUITYJTC.js";
import {
  SmartListComponent
} from "./chunk-IJVUZ62I.js";
import "./chunk-PS2YJ6IH.js";
import "./chunk-D742Q5CX.js";
import "./chunk-2K5TOPNO.js";
import "./chunk-4YDRPLS7.js";
import "./chunk-H3IGIWEC.js";
import "./chunk-WFNQJ567.js";
import {
  EventExploreInfoCardConverter
} from "./chunk-VNTNCRGK.js";
import "./chunk-RJSPRCFL.js";
import "./chunk-BEAS7CFC.js";
import "./chunk-EGWJQCT5.js";
import {
  CARD_MENU_ACTIONS,
  InfoCardComponent
} from "./chunk-YTMD6HU4.js";
import "./chunk-4VYYFWRA.js";
import "./chunk-QEZI4ZBE.js";
import "./chunk-LTMPUKCR.js";
import "./chunk-5EHS4ACX.js";
import {
  PopupComponent
} from "./chunk-3VXLUVWM.js";
import "./chunk-VEYRCVMX.js";
import "./chunk-MVR37RGJ.js";
import {
  AppMenuComponent,
  AppMenuDispatcher,
  AppMenuOutletComponent,
  appMenuPaletteFromToneClass,
  buildTabbedMenuModel
} from "./chunk-FOAFZS65.js";
import "./chunk-OAYWPJGG.js";
import {
  DialogStore
} from "./chunk-6TR3Z2F3.js";
import "./chunk-U46O4F4Y.js";
import {
  MatIconModule
} from "./chunk-EDHGCWPF.js";
import "./chunk-CUDLB52K.js";
import "./chunk-FS6Q4LOC.js";
import "./chunk-ZJ74HL3J.js";
import {
  ActivitiesService,
  ActivityMembersService
} from "./chunk-FJQMGJUW.js";
import {
  EventsService,
  ShareTokensService
} from "./chunk-HUL5TV72.js";
import "./chunk-PK4DOAMC.js";
import {
  AppRuntimeStore,
  GameService,
  UsersService
} from "./chunk-GEAUBJJD.js";
import "./chunk-5PHTFUHA.js";
import {
  APP_STATIC_DATA,
  ActivityMembersBuilder
} from "./chunk-F4WY6ECV.js";
import "./chunk-Q3344WPR.js";
import {
  AppUtils
} from "./chunk-XQ4NDAVX.js";
import "./chunk-4FWVIYNI.js";
import "./chunk-7MTG4XZU.js";
import {
  CommonModule,
  NgComponentOutlet
} from "./chunk-J7IJFFQ2.js";
import "./chunk-XQACYBVS.js";
import "./chunk-YKC4KBEC.js";
import "./chunk-B2DKYQGD.js";
import {
  ActivityStore,
  UserProfileStore
} from "./chunk-KLUOB5SD.js";
import {
  ActivityEventDetailDTO
} from "./chunk-6POEHVT7.js";
import "./chunk-2ENBQWLU.js";
import "./chunk-LERGHE7K.js";
import "./chunk-D6ZHKNYF.js";
import "./chunk-SKAK727J.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  TemplateRef,
  ViewChild,
  __spreadProps,
  __spreadValues,
  effect,
  from,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵresetView,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵviewQuery
} from "./chunk-XJL7SWH7.js";

// src/app/activity/components/event-explore-popup/event-explore-popup.component.ts
var _c0 = ["eventExploreSmartList"];
var _c1 = ["eventExploreItemTemplate"];
function EventExplorePopupComponent_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-menu", 7);
    \u0275\u0275listener("itemSelect", function EventExplorePopupComponent_Conditional_0_Conditional_4_Template_app_menu_itemSelect_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onEventExploreMenuSelect($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("trigger", ctx_r1.checkoutDraftMenuTrigger())("items", ctx_r1.checkoutDraftMenuItems())("panelAlign", "end")("mobileBreakpointPx", 900);
  }
}
function EventExplorePopupComponent_Conditional_0_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-info-card", 8);
    \u0275\u0275listener("mediaStartClick", function EventExplorePopupComponent_Conditional_0_ng_template_5_Template_app_info_card_mediaStartClick_0_listener() {
      const record_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openHostImpressions(record_r5));
    })("mediaEndClick", function EventExplorePopupComponent_Conditional_0_ng_template_5_Template_app_info_card_mediaEndClick_0_listener() {
      const record_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openEventExploreMembers(record_r5));
    })("menuAction", function EventExplorePopupComponent_Conditional_0_ng_template_5_Template_app_info_card_menuAction_0_listener($event) {
      const record_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onEventExploreCardMenuAction(record_r5, $event));
    })("menuRequest", function EventExplorePopupComponent_Conditional_0_ng_template_5_Template_app_info_card_menuRequest_0_listener($event) {
      const record_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openEventExploreInfoCardMenu(record_r5, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const record_r5 = ctx.$implicit;
    const groupLabel_r6 = ctx.groupLabel;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("card", ctx_r1.eventExploreInfoCard(record_r5, groupLabel_r6))("useSharedMenu", true);
  }
}
function EventExplorePopupComponent_Conditional_0_Conditional_8_Conditional_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function EventExplorePopupComponent_Conditional_0_Conditional_8_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, EventExplorePopupComponent_Conditional_0_Conditional_8_Conditional_0_ng_container_0_Template, 1, 0, "ng-container", 9);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function EventExplorePopupComponent_Conditional_0_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, EventExplorePopupComponent_Conditional_0_Conditional_8_Conditional_0_Template, 1, 1, "ng-container");
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional((tmp_4_0 = ctx_r1.eventSubeventsStore.eventSubeventsListPopupComponent()) ? 0 : -1, tmp_4_0);
  }
}
function EventExplorePopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 2)(1, "div", 3)(2, "app-smart-list", 4, 0);
    \u0275\u0275listener("stateChange", function EventExplorePopupComponent_Conditional_0_Template_app_smart_list_stateChange_2_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onEventExploreSmartListStateChange($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, EventExplorePopupComponent_Conditional_0_Conditional_4_Template, 1, 4, "app-menu", 5);
    \u0275\u0275template(5, EventExplorePopupComponent_Conditional_0_ng_template_5_Template, 1, 2, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "app-menu-outlet", 6);
    \u0275\u0275listener("itemSelect", function EventExplorePopupComponent_Conditional_0_Template_app_menu_outlet_itemSelect_7_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onEventExploreMenuSelect($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(8, EventExplorePopupComponent_Conditional_0_Conditional_8_Template, 1, 1);
  }
  if (rf & 2) {
    let tmp_10_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.eventExplorePopupModel())("zIndex", ctx_r1.eventExplorePopupZIndex());
    \u0275\u0275advance(2);
    \u0275\u0275property("config", ctx_r1.eventExploreSmartListConfig)("loadPage", ctx_r1.eventExploreLoadPage)("itemTemplate", ctx_r1.eventExploreItemTemplateRef ?? null)("query", ctx_r1.eventExploreSmartListQuery);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.checkoutDraftCount() > 0 ? 4 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(((tmp_10_0 = ctx_r1.eventSubeventsStore.eventSubeventsListPopup()) == null ? null : tmp_10_0.host) === "eventExplore" ? 8 : -1);
  }
}
var EventExplorePopupComponent = class _EventExplorePopupComponent {
  cdr = inject(ChangeDetectorRef);
  activityMembersService = inject(ActivityMembersService);
  activitiesService = inject(ActivitiesService);
  eventsService = inject(EventsService);
  gameService = inject(GameService);
  shareTokensService = inject(ShareTokensService);
  usersService = inject(UsersService);
  profileStore = inject(ProfileStore);
  dialogStore = inject(DialogStore);
  appMenuDispatcher = inject(AppMenuDispatcher);
  eventCheckoutDraftStore = inject(EventCheckoutDraftStore);
  eventCheckoutDialogStore = inject(EventCheckoutDialogStore);
  userProfileStore = inject(UserProfileStore);
  runtimeStore = inject(AppRuntimeStore);
  activityStore = inject(ActivityStore);
  memberMenuStore = inject(MemberMenuStore);
  activitiesStore = inject(ActivitiesPopupStore);
  eventSubeventsStore = inject(EventSubeventsPopupStore);
  eventExploreOrderOptions = APP_STATIC_DATA.eventExploreOrderOptions;
  eventExploreViewOptions = APP_STATIC_DATA.activitiesViewOptions.filter((option) => option.key === "day" || option.key === "distance");
  topicFilterGroups = APP_STATIC_DATA.interestOptionGroups;
  users = [];
  userByIdMap = /* @__PURE__ */ new Map();
  isOpen = false;
  eventExploreOrder = "upcoming";
  eventExploreView = "day";
  eventExploreFilterFriendsOnly = false;
  eventExploreFilterHasRooms = false;
  eventExploreFilterTopic = "";
  eventExploreHeaderProgress = 0;
  eventExploreHeaderProgressLoading = false;
  eventExploreHeaderLoadingProgress = 0;
  eventExploreHeaderLoadingOverdue = false;
  eventExploreStickyLabel = "No items";
  selectedMembers = [];
  selectedMembersTitle = "";
  selectedMembersPendingOnly = false;
  selectedMembersRecord = null;
  activeUserId = "";
  eventEditorPrewarmStarted = false;
  leavingEventExploreRecordIds = /* @__PURE__ */ new Set();
  eventExploreExitAnimationMs = 180;
  lastAppliedActivityMembersUpdatedMs = 0;
  lastAppliedActivityRuntimeUpdatedMs = 0;
  lastPendingCheckoutDraftSourceIds = /* @__PURE__ */ new Set();
  locallyTrackedMembershipSourceIds = /* @__PURE__ */ new Set();
  checkoutDraftClearSaveSourceIds = /* @__PURE__ */ new Set();
  checkoutDraftReleaseSourceIds = /* @__PURE__ */ new Set();
  eventExploreSmartListQuery = {};
  eventExploreSmartList;
  eventExploreItemTemplateRef;
  set eventExploreItemTemplate(value) {
    this.eventExploreItemTemplateRef = value;
    this.cdr.markForCheck();
  }
  eventExploreLoadPage = (query) => from(this.loadEventExplorePage(query));
  eventExploreCompactMenuModel = {
    density: "compact"
  };
  eventExploreSmartListConfig = {
    pageSize: 10,
    initialPageSize: 20,
    defaultView: "list",
    emptyLabel: "No visible events right now.",
    emptyDescription: "Try another filter or check back later.",
    headerProgress: {
      enabled: true,
      state: () => this.runtimeStore.isOnline() ? "active" : "inactive"
    },
    presentation: "list",
    listLayout: "card-grid",
    desktopColumns: 3,
    snapMode: "mandatory",
    scrollPaddingTop: "2.6rem",
    cacheable: true,
    containerClass: {
      "experience-card-list": true,
      "assets-card-list": true
    },
    stickyHeaderClass: "event-explore-sticky-header",
    trackBy: (_index, record) => `${record.type}:${record.id}`,
    sortable: {
      sortKey: (record) => this.eventExploreRecordLocalSortKey(record)
    },
    showGroupMarker: ({ groupIndex, scrollable }) => {
      if (groupIndex > 0) {
        return true;
      }
      return scrollable;
    },
    groupBy: (record, query) => this.buildEventExploreGroupLabel(record, query.filters?.view ?? this.eventExploreView)
  };
  constructor() {
    this.refreshUsersDirectory();
    effect(() => {
      const request = this.memberMenuStore.activitiesNavigationRequest();
      if (!request || request.type !== "eventExplore" && request.type !== "eventCheckoutDraft") {
        return;
      }
      this.memberMenuStore.clearActivitiesNavigationRequest();
      if (request.type === "eventCheckoutDraft") {
        void this.continueCheckoutDraftBySourceId(request.sourceId);
        return;
      }
      this.openEventExplore();
    });
    effect(() => {
      const nextActiveUserId = this.userProfileStore.activeUserId().trim();
      if (nextActiveUserId === this.activeUserId) {
        return;
      }
      this.activeUserId = nextActiveUserId;
      this.locallyTrackedMembershipSourceIds.clear();
      this.syncEventExploreQuery();
      if (this.isOpen) {
        this.reloadEventExploreSmartList();
      }
      this.cdr.markForCheck();
    });
    effect(() => {
      const sync = this.activityStore.activityMembersSync();
      if (!sync || sync.updatedMs <= this.lastAppliedActivityMembersUpdatedMs) {
        return;
      }
      this.lastAppliedActivityMembersUpdatedMs = sync.updatedMs;
      this.applyActivityMembersSyncState(sync);
    });
    effect(() => {
      const sync = this.activityStore.activityEventRuntimeSync();
      if (!sync || sync.updatedMs <= this.lastAppliedActivityRuntimeUpdatedMs) {
        return;
      }
      this.lastAppliedActivityRuntimeUpdatedMs = sync.updatedMs;
      if (this.isOpen) {
        this.eventExploreSmartList?.patchVisibleItem((record) => record.id === sync.eventId, (record) => __spreadProps(__spreadValues({}, record), {
          activity: Math.max(0, Math.trunc(Number(record.activity) || 0) + Math.trunc(Number(sync.activityDelta) || 0))
        }));
        this.cdr.markForCheck();
      }
    });
    effect(() => {
      const sync = this.activitiesStore.activityEventSave();
      if (!sync) {
        return;
      }
      this.applyActivityEventSave(sync);
    });
    effect(() => {
      const request = this.eventSubeventsStore.eventSubeventsListPopup();
      if (!request || request.host !== "eventExplore" || !this.isOpen) {
        return;
      }
      void this.eventSubeventsStore.ensureEventSubeventsListPopupLoaded();
    });
    effect(() => {
      this.eventCheckoutDraftStore.drafts();
      if (this.isOpen) {
        this.cdr.markForCheck();
      }
    });
  }
  onEscapePressed(event) {
    const keyboardEvent = event;
    if (!this.isOpen || keyboardEvent.defaultPrevented) {
      return;
    }
    keyboardEvent.preventDefault();
    keyboardEvent.stopPropagation();
    if (this.selectedMembersRecord) {
      this.closeMembersPopup();
      return;
    }
    this.closeEventExplore();
  }
  onEventExploreSmartListStateChange(state) {
    this.eventExploreHeaderProgress = state.progress;
    this.eventExploreHeaderProgressLoading = state.loading;
    this.eventExploreHeaderLoadingProgress = state.loadingProgress;
    this.eventExploreHeaderLoadingOverdue = state.loadingOverdue;
    this.eventExploreStickyLabel = state.stickyLabel || "No items";
    this.cdr.markForCheck();
  }
  eventExplorePopupModel() {
    return {
      title: this.eventExploreHeaderTitle(),
      ariaLabel: this.eventExploreHeaderTitle(),
      closeAriaLabel: "Close event explore",
      size: "wide",
      height: "full",
      headerTone: "accent",
      bodyLayout: "fill",
      headerControls: [
        {
          kind: "menu",
          id: "event-explore-order",
          menuKind: "select",
          model: this.eventExploreCompactMenuModel,
          trigger: this.eventExploreOrderMenuTrigger(),
          items: this.eventExploreOrderMenuItems()
        },
        {
          kind: "menu",
          id: "event-explore-view",
          menuKind: "select",
          model: this.eventExploreCompactMenuModel,
          trigger: this.eventExploreViewMenuTrigger(),
          items: this.eventExploreViewMenuItems()
        }
      ],
      toolbarControls: [
        {
          kind: "menu",
          id: "event-explore-filters",
          menuKind: "inline",
          model: this.eventExploreCompactMenuModel,
          items: this.eventExploreFilterMenuItems()
        }
      ],
      onClose: () => this.closeEventExplore(),
      onMenuSelect: (event) => this.onEventExploreMenuSelect(event.itemSelect)
    };
  }
  eventExplorePopupZIndex() {
    return 2400;
  }
  closeEventExplore() {
    this.isOpen = false;
    this.closeEventExploreSubeventsPopup();
    this.closeMembersPopup();
    this.resetHeaderState();
    this.cdr.markForCheck();
  }
  selectEventExploreOrder(order, event) {
    event?.stopPropagation();
    if (this.eventExploreOrder === order) {
      this.cdr.markForCheck();
      return;
    }
    this.eventExploreOrder = order;
    this.syncEventExploreQuery();
    this.reloadEventExploreSmartList();
  }
  selectEventExploreView(view, event) {
    event?.stopPropagation();
    if (this.eventExploreView === view) {
      this.cdr.markForCheck();
      return;
    }
    this.eventExploreView = view;
    this.syncEventExploreQuery();
    this.reloadEventExploreSmartList();
  }
  toggleEventExploreFriendsOnly(event) {
    event?.stopPropagation();
    this.eventExploreFilterFriendsOnly = !this.eventExploreFilterFriendsOnly;
    this.syncEventExploreQuery();
    this.reloadEventExploreSmartList();
  }
  toggleEventExploreHasRooms(event) {
    event?.stopPropagation();
    this.eventExploreFilterHasRooms = !this.eventExploreFilterHasRooms;
    this.syncEventExploreQuery();
    this.reloadEventExploreSmartList();
  }
  selectEventExploreTopicFilter(topic, event) {
    event?.stopPropagation();
    const normalizedTopic = this.normalizeTopic(topic);
    this.eventExploreFilterTopic = normalizedTopic === this.normalizeTopic(this.eventExploreFilterTopic) ? "" : topic;
    this.syncEventExploreQuery();
    this.reloadEventExploreSmartList();
  }
  eventExploreTopicLabel(topic) {
    return topic.replace(/^#+\s*/, "");
  }
  eventExploreOrderMenuTrigger() {
    return {
      label: this.eventExploreOrderLabel(),
      icon: this.eventExploreOrderIcon(),
      ariaLabel: "Open event explore order",
      palette: this.eventExploreOrderPalette(this.eventExploreOrder),
      layout: "pill"
    };
  }
  eventExploreOrderMenuItems() {
    return this.eventExploreOrderOptions.map((option) => ({
      id: `order-${option.key}`,
      label: option.label,
      icon: option.icon,
      kind: "radio",
      active: option.key === this.eventExploreOrder,
      checked: option.key === this.eventExploreOrder,
      palette: this.eventExploreOrderPalette(option.key),
      surface: "tinted",
      context: { menu: "order", order: option.key }
    }));
  }
  eventExploreViewMenuTrigger() {
    return {
      label: this.eventExploreCurrentViewLabel(),
      icon: this.eventExploreCurrentViewIcon(),
      ariaLabel: "Open event explore view",
      palette: this.eventExploreViewPalette(this.eventExploreView),
      layout: "pill"
    };
  }
  eventExploreViewMenuItems() {
    return this.eventExploreViewOptions.map((option) => ({
      id: `view-${option.key}`,
      label: option.label,
      icon: option.icon,
      kind: "radio",
      active: option.key === this.eventExploreView,
      checked: option.key === this.eventExploreView,
      palette: this.eventExploreViewPalette(option.key),
      surface: "tinted",
      context: { menu: "view", view: option.key }
    }));
  }
  eventExploreFilterMenuItems() {
    return [
      {
        id: "filter-friends-going",
        label: "Friends going",
        icon: "groups",
        kind: "toggle",
        layout: "pill",
        active: this.eventExploreFilterFriendsOnly,
        checked: this.eventExploreFilterFriendsOnly,
        closeOnSelect: false,
        palette: "green",
        context: { menu: "filter-toggle", filter: "friends" }
      },
      {
        id: "filter-open-spots",
        label: "Open spots",
        icon: "hotel",
        kind: "toggle",
        layout: "pill",
        active: this.eventExploreFilterHasRooms,
        checked: this.eventExploreFilterHasRooms,
        closeOnSelect: false,
        palette: "blue",
        context: { menu: "filter-toggle", filter: "open-spots" }
      },
      {
        id: "filter-topic",
        label: this.eventExploreFilterTopic ? `#${this.eventExploreTopicLabel(this.eventExploreFilterTopic)}` : "Topic",
        icon: "sell",
        kind: "select-trigger",
        layout: "pill",
        active: !!this.eventExploreFilterTopic,
        checked: !!this.eventExploreFilterTopic,
        closeOnSelect: false,
        palette: this.eventExploreTopicPalette(this.eventExploreFilterTopic),
        ariaLabel: "Open topic filter",
        filterable: true,
        model: this.eventExploreTopicMenuModel()
      }
    ];
  }
  eventExploreTopicMenuModel() {
    return buildTabbedMenuModel({
      idPrefix: "topic",
      groups: this.topicFilterGroups,
      selected: this.eventExploreFilterTopic ? [this.eventExploreFilterTopic] : [],
      maxSelected: 1,
      kind: "radio",
      context: (topic) => ({ menu: "topic-filter", topic }),
      itemLabel: (topic) => `#${this.eventExploreTopicLabel(topic)}`,
      removeAriaLabel: (topic) => `Clear ${topic}`,
      summary: {
        emptyLabel: "Topic",
        maxLabels: 1,
        counter: "none"
      }
    });
  }
  onEventExploreMenuSelect(event) {
    const context = event.context;
    if (!context) {
      return;
    }
    if (context.menu === "info-card") {
      this.onEventExploreCardMenuAction(context.record, {
        id: context.card.id,
        actionId: context.action.id,
        action: context.action,
        card: context.card
      });
      return;
    }
    if (context.menu === "order") {
      this.selectEventExploreOrder(context.order, event.sourceEvent);
      return;
    }
    if (context.menu === "view") {
      this.selectEventExploreView(context.view, event.sourceEvent);
      return;
    }
    if (context.menu === "filter-toggle") {
      if (context.filter === "friends") {
        this.toggleEventExploreFriendsOnly(event.sourceEvent);
        return;
      }
      this.toggleEventExploreHasRooms(event.sourceEvent);
      return;
    }
    if (context.menu === "checkout-draft") {
      if (event.action === "remove") {
        this.requestClearCheckoutDraft(context.entry.draft, event.sourceEvent);
        return;
      }
      void this.openCheckoutDraftForm(context.entry, event.sourceEvent);
      return;
    }
    if (context.menu === "topic-filter") {
      if (event.action === "remove") {
        event.sourceEvent.stopPropagation();
        if (this.normalizeTopic(context.topic) !== this.normalizeTopic(this.eventExploreFilterTopic)) {
          return;
        }
        this.eventExploreFilterTopic = "";
        this.syncEventExploreQuery();
        this.reloadEventExploreSmartList();
        return;
      }
      this.selectEventExploreTopicFilter(context.topic, event.sourceEvent);
    }
  }
  openEventExploreInfoCardMenu(record, request) {
    const menuId = `event-explore-card:${request.id}`;
    if (this.appMenuDispatcher.isOpen(menuId)) {
      this.appMenuDispatcher.close(menuId);
      return;
    }
    this.appMenuDispatcher.open({
      id: menuId,
      kind: "select",
      title: this.infoCardMenuTitle(request.card),
      items: this.infoCardMenuItems(record, request),
      triggerRect: request.triggerRect,
      openUp: request.openUp,
      panelAlign: "auto",
      closeOnSelect: true,
      onClose: request.closeTrigger
    }, null);
  }
  infoCardMenuTitle(card) {
    if (card.menuTitle === null) {
      return null;
    }
    return `${card.menuTitle ?? card.title ?? ""}`.trim();
  }
  infoCardMenuItems(record, request) {
    return (request.actions ?? []).flatMap((actionId) => {
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
        palette: this.infoCardActionPalette(config.tone),
        surface: "tinted",
        context: {
          menu: "info-card",
          record,
          card: request.card,
          action
        }
      }];
    });
  }
  infoCardActionPalette(tone) {
    switch (tone) {
      case "accent":
        return "green";
      case "review":
        return "violet";
      case "warning":
        return "warning";
      case "destructive":
        return "danger";
      default:
        return "neutral";
    }
  }
  eventExploreOrderLabel(order = this.eventExploreOrder) {
    return this.eventExploreOrderOptions.find((option) => option.key === order)?.label ?? "Upcoming";
  }
  eventExploreOrderIcon(order = this.eventExploreOrder) {
    return this.eventExploreOrderOptions.find((option) => option.key === order)?.icon ?? "event_upcoming";
  }
  eventExploreCurrentViewLabel(view = this.eventExploreView) {
    return this.eventExploreViewOptions.find((option) => option.key === view)?.label ?? "Day";
  }
  eventExploreCurrentViewIcon(view = this.eventExploreView) {
    return this.eventExploreViewOptions.find((option) => option.key === view)?.icon ?? "today";
  }
  eventExploreOrderPalette(order) {
    switch (order) {
      case "upcoming":
        return "blue";
      case "past-events":
        return "slate";
      case "nearby":
        return "green";
      case "top-rated":
        return "gold";
      default:
        return "violet";
    }
  }
  eventExploreViewPalette(view) {
    return view === "distance" ? "teal" : "blue";
  }
  eventExploreTopicPalette(topic) {
    const normalizedTopic = this.normalizeTopic(topic);
    if (!normalizedTopic) {
      return "neutral";
    }
    const group = this.topicFilterGroups.find((item) => item.options.some((option) => this.normalizeTopic(option) === normalizedTopic));
    return appMenuPaletteFromToneClass(group?.toneClass);
  }
  eventExploreHeaderTitle() {
    return "Event Explore";
  }
  openEventExploreMembers(record, event) {
    this.stopDomEvent(event);
    if (!this.canPreviewEventExploreMembers(record)) {
      return;
    }
    this.memberMenuStore.requestActivitiesNavigation({
      type: "members",
      ownerId: record.id,
      ownerType: "event",
      subtitle: record.title,
      canManage: false,
      viewOnly: true
    });
    this.cdr.markForCheck();
  }
  closeMembersPopup() {
    this.selectedMembersRecord = null;
    this.selectedMembers = [];
    this.selectedMembersTitle = "";
    this.selectedMembersPendingOnly = false;
  }
  activityMembersPendingCount() {
    return this.selectedMembers.filter((member) => member.status === "pending").length;
  }
  activityMembersHeaderSummary() {
    const pendingCount = this.activityMembersPendingCount();
    const acceptedCount = this.selectedMembers.length - pendingCount;
    if (pendingCount <= 0) {
      return `${acceptedCount} members`;
    }
    return `${acceptedCount} members \xB7 ${pendingCount} pending`;
  }
  get activityMembersOrdered() {
    if (!this.selectedMembersPendingOnly) {
      return [...this.selectedMembers];
    }
    return this.selectedMembers.filter((member) => member.status === "pending");
  }
  handleMembersTogglePendingOnly() {
    this.selectedMembersPendingOnly = !this.selectedMembersPendingOnly;
  }
  runEventExploreViewAction(record, event) {
    this.stopDomEvent(event);
    this.eventSubeventsStore.openEventSubeventsListPopup({
      eventId: record.id,
      host: "eventExplore",
      target: record.type === "hosting" ? "hosting" : "events",
      title: record.title,
      timeframe: record.slotsEnabled && record.nextSlot ? record.nextSlot.timeframe : record.timeframe,
      startAtIso: record.startAtIso,
      endAtIso: record.endAtIso,
      mode: record.mode ?? null,
      acceptedMembers: record.acceptedMembers,
      pendingMembers: record.pendingMembers,
      capacityTotal: record.capacityTotal,
      resourceOwnerUserId: record.creatorUserId,
      editorAction: "view"
    });
    this.cdr.markForCheck();
  }
  closeEventExploreSubeventsPopup() {
    if (this.eventSubeventsStore.eventSubeventsListPopup()?.host !== "eventExplore") {
      return;
    }
    this.eventSubeventsStore.closeEventSubeventsListPopup();
  }
  runEventExploreJoinAction(record, event) {
    this.stopDomEvent(event);
    const activeUserId = this.activeUserId.trim();
    if (!activeUserId) {
      return;
    }
    if (record.creatorUserId === activeUserId) {
      this.dialogStore.openInfo(`You already host ${record.title}.`, {
        title: "Already hosting",
        confirmTone: "neutral"
      });
      return;
    }
    const existingDraft = this.trackableCheckoutDraft(record.id, activeUserId);
    if (existingDraft) {
      void this.openCheckoutDraftForm({ draft: existingDraft, record }, event);
      return;
    }
    if (this.hasTrackedMembership(record, activeUserId)) {
      const membershipStatus = this.eventExploreMembershipStatus(record, activeUserId);
      this.openEventExploreCheckout(record, {
        approvalGranted: membershipStatus === "accepted",
        pendingReason: membershipStatus === "accepted" ? null : this.eventExploreCheckoutPendingReason(record)
      });
      return;
    }
    if (this.shouldUseCheckoutFlow(record)) {
      this.openEventExploreCheckout(record);
      return;
    }
    this.dialogStore.open({
      title: this.eventExploreJoinDialogTitle(record),
      message: record.title,
      cancelLabel: "Cancel",
      confirmLabel: this.eventExploreJoinConfirmLabel(record),
      busyConfirmLabel: this.eventExploreJoinBusyLabel(record),
      confirmTone: "accent",
      failureMessage: this.eventExploreJoinFailureMessage(record),
      onConfirm: () => this.submitEventExploreJoinRequest(record)
    });
  }
  openHostImpressions(record, event) {
    this.stopDomEvent(event);
    this.userProfileStore.setUserProfile(this.resolveUser(record.creatorUserId, record));
    void this.usersService.loadUserById(record.creatorUserId);
    this.profileStore.openImpressionsPopup(record.creatorUserId);
  }
  canPreviewEventExploreMembers(record) {
    return record.blindMode === "Open Event";
  }
  onEventExploreCardMenuAction(record, action) {
    if (action.actionId === "view") {
      this.runEventExploreViewAction(record);
      return;
    }
    if (action.actionId === "continueBooking" || action.actionId === "continueBookingPending") {
      const activeUserId = this.activeUserId.trim();
      const draft = activeUserId ? this.trackableCheckoutDraft(record.id, activeUserId) : null;
      if (draft) {
        void this.openCheckoutDraftForm({ draft, record });
        return;
      }
      this.openEventExploreCheckout(record, {
        approvalGranted: false,
        pendingReason: this.eventExploreCheckoutPendingReason(record)
      });
      return;
    }
    if (this.isEventExploreJoinMenuAction(action.actionId)) {
      this.runEventExploreJoinAction(record);
      return;
    }
    if (action.actionId === "askOrganizer") {
      this.runEventExploreServiceChatAction(record);
      return;
    }
    if (action.actionId === "notifyParticipants") {
      this.runEventExploreServiceChatAction(record);
      return;
    }
    if (action.actionId === "shareEvent") {
      this.runEventExploreShareAction(record);
      return;
    }
    if (action.actionId === "reportOrganizer") {
      this.runEventExploreReportAction(record);
    }
  }
  checkoutDraftCount() {
    return this.checkoutDraftEntries().length;
  }
  checkoutDraftEntries() {
    const activeUserId = this.activeUserId.trim();
    return this.eventCheckoutDraftStore.listByUser(activeUserId).sort((left, right) => right.updatedAtMs - left.updatedAtMs).map((draft) => ({
      draft,
      record: this.visibleEventExploreRecordById(draft.sourceId) ?? this.eventsService.peekKnownRecordById(activeUserId, draft.sourceId)
    }));
  }
  canContinueCheckoutDraft(entry) {
    if (this.isCheckoutDraftClearing(entry.draft.sourceId)) {
      return false;
    }
    if (entry.draft.pendingReason === "waitlist" || entry.draft.checkoutState === "waiting") {
      return false;
    }
    if (Boolean(entry.draft.checkoutSessionId?.trim())) {
      return true;
    }
    if (!this.requiresApprovalBeforePayment(entry.record, entry.draft)) {
      return true;
    }
    return this.resolveCheckoutDraftMembershipStatus(entry.draft.sourceId, entry.record) === "accepted";
  }
  checkoutDraftMenuTrigger() {
    const entries = this.checkoutDraftEntries();
    const count = entries.length;
    const changedCount = entries.filter((entry) => entry.draft.basketChanged === true).length;
    return {
      icon: "shopping_basket",
      closeIcon: "close",
      ariaLabel: changedCount > 0 ? changedCount === 1 ? "Open basket with 1 changed item" : `Open basket with ${changedCount} changed items` : count === 1 ? "Open basket with 1 item" : `Open basket with ${count} items`,
      counter: changedCount > 0 ? changedCount : count,
      hideLabel: true,
      layout: "icon",
      palette: changedCount > 0 ? "orange" : "green"
    };
  }
  checkoutDraftMenuItems() {
    return this.checkoutDraftEntries().map((entry) => {
      const clearing = this.isCheckoutDraftClearing(entry.draft.sourceId);
      const itemCount = this.checkoutDraftBasketItemCount(entry.draft);
      return {
        id: `checkout-draft-${entry.draft.sourceId}`,
        label: entry.draft.eventTitle,
        description: [
          entry.draft.eventTimeframe || entry.record?.timeframe || "Pending checkout",
          `${itemCount} elem \xB7 ${entry.draft.currency} ${entry.draft.totalAmount.toFixed(2)}`
        ].join("\n"),
        detail: clearing ? "Releasing..." : this.checkoutDraftMenuStatusLabel(entry),
        icon: this.checkoutDraftMenuIcon(entry),
        kind: "action",
        palette: this.checkoutDraftMenuPalette(entry),
        headerBadge: entry.draft.basketChanged === true ? "Update" : null,
        surface: "tinted",
        layout: "pill",
        disabled: clearing,
        removable: true,
        removeIcon: "close",
        removeAriaLabel: `Clear ${entry.draft.eventTitle}`,
        context: { menu: "checkout-draft", entry }
      };
    });
  }
  checkoutDraftBasketItemCount(draft) {
    const activeItems = (draft.basketItems ?? []).filter((item) => item.resultState !== "deleted" && item.resultState !== "succeeded");
    const primaryItems = activeItems.filter((item) => item.kind !== "sub_event");
    if (primaryItems.length === 0) {
      return activeItems.length > 0 ? 1 : Math.max(0, draft.lineItems.length);
    }
    const groupKeys = new Set(primaryItems.map((item) => this.checkoutDraftBasketItemGroupKey(item)));
    return Math.max(1, groupKeys.size);
  }
  checkoutDraftBasketItemGroupKey(item) {
    const slotSourceId = item.slotSourceId?.trim() ?? "";
    if (slotSourceId) {
      return slotSourceId;
    }
    return item.id?.trim() || item.label?.trim() || "checkout-item";
  }
  isCheckoutDraftClearing(sourceId) {
    return this.checkoutDraftReleaseSourceIds.has(sourceId.trim());
  }
  checkoutDraftMenuStatusLabel(entry) {
    return this.checkoutDraftMenuVisual(entry).label;
  }
  checkoutDraftMenuIcon(entry) {
    return this.checkoutDraftMenuVisual(entry).icon;
  }
  checkoutDraftMenuPalette(entry) {
    return this.checkoutDraftMenuVisual(entry).palette;
  }
  checkoutDraftMenuVisual(entry) {
    if (this.isCheckoutDraftClearing(entry.draft.sourceId)) {
      return {
        label: "event.checkout.releasing",
        icon: "hourglass_empty",
        palette: "warning"
      };
    }
    const resultState = this.checkoutDraftResultState(entry.draft);
    if (resultState === "failed") {
      return {
        label: "Sikertelen",
        icon: "error",
        palette: "danger"
      };
    }
    if (entry.draft.checkoutState === "cancelled") {
      return {
        label: "Lemondva",
        icon: "block",
        palette: "neutral"
      };
    }
    if (entry.draft.checkoutState === "rejected") {
      return {
        label: "rejected",
        icon: "block",
        palette: "danger"
      };
    }
    if (entry.draft.basketChanged === true) {
      return {
        label: "event.checkout.update.required",
        icon: "edit_note",
        palette: "orange"
      };
    }
    if (entry.draft.pendingReason === "waitlist" || entry.draft.checkoutState === "waiting") {
      return {
        label: "waiting.list",
        icon: "hourglass_empty",
        palette: "amber"
      };
    }
    if (entry.draft.pendingReason === "approval" || entry.draft.checkoutState === "approval-pending") {
      return {
        label: "event.editor.checkout.waiting.approval",
        icon: "pending_actions",
        palette: "orange"
      };
    }
    if (entry.draft.checkoutState === "confirmed") {
      return Math.max(0, Number(entry.draft.totalAmount) || 0) > 0 ? {
        label: "event.checkout.ready.for.payment",
        icon: "payments",
        palette: "green"
      } : {
        label: "confirmed",
        icon: "event_available",
        palette: "green"
      };
    }
    if (entry.draft.checkoutState === "approved") {
      return Math.max(0, Number(entry.draft.totalAmount) || 0) > 0 ? {
        label: "event.checkout.ready.for.payment",
        icon: "payments",
        palette: "green"
      } : {
        label: "approved",
        icon: "verified",
        palette: "success"
      };
    }
    if (entry.draft.checkoutState === "pay") {
      return {
        label: "event.checkout.payment.in.progress",
        icon: "payments",
        palette: "green"
      };
    }
    if (this.canContinueCheckoutDraft(entry)) {
      return {
        label: "event.checkout.can.continue",
        icon: "event_available",
        palette: "teal"
      };
    }
    return {
      label: "Piszkozat",
      icon: "shopping_basket",
      palette: "blue"
    };
  }
  checkoutDraftResultState(draft) {
    const resultStates = (draft.basketItems ?? []).map((item) => item.resultState ?? "pending");
    if (resultStates.some((resultState) => resultState === "failed")) {
      return "failed";
    }
    if (resultStates.length > 0 && resultStates.every((resultState) => resultState === "deleted")) {
      return "deleted";
    }
    if (resultStates.length > 0 && resultStates.every((resultState) => resultState === "deleted" || resultState === "succeeded")) {
      return "succeeded";
    }
    return "pending";
  }
  async continueCheckoutDraft(entry, event) {
    this.stopDomEvent(event);
    if (!this.canContinueCheckoutDraft(entry)) {
      return;
    }
    const { draft } = entry;
    const record = entry.record ?? this.visibleEventExploreRecordById(draft.sourceId) ?? this.eventsService.peekKnownRecordById(this.activeUserId, draft.sourceId) ?? await this.eventsService.queryKnownRecordById(this.activeUserId, draft.sourceId);
    if (!record) {
      this.eventCheckoutDraftStore.clear(this.activeUserId, draft.sourceId);
      this.dialogStore.openInfo("This checkout draft can no longer be restored.", {
        title: "Basket unavailable",
        confirmTone: "neutral"
      });
      this.cdr.markForCheck();
      return;
    }
    const pendingReason = this.checkoutDraftPendingReason(draft);
    this.openEventExploreCheckout(record, {
      approvalGranted: pendingReason ? false : this.canContinueCheckoutDraft({ draft, record }),
      pendingReason
    });
  }
  async openCheckoutDraftForm(entry, event) {
    this.stopDomEvent(event);
    if (this.isCheckoutDraftClearing(entry.draft.sourceId)) {
      return;
    }
    const { draft } = entry;
    const record = entry.record ?? this.visibleEventExploreRecordById(draft.sourceId) ?? this.eventsService.peekKnownRecordById(this.activeUserId, draft.sourceId) ?? await this.eventsService.queryKnownRecordById(this.activeUserId, draft.sourceId);
    if (!record) {
      this.eventCheckoutDraftStore.clear(this.activeUserId, draft.sourceId);
      this.dialogStore.openInfo("This checkout draft can no longer be restored.", {
        title: "Basket unavailable",
        confirmTone: "neutral"
      });
      this.cdr.markForCheck();
      return;
    }
    const pendingReason = this.checkoutDraftPendingReason(draft);
    this.openEventExploreCheckout(record, {
      approvalGranted: pendingReason ? false : this.canContinueCheckoutDraft({ draft, record }),
      pendingReason
    });
  }
  async continueCheckoutDraftBySourceId(sourceId) {
    const normalizedSourceId = sourceId.trim();
    if (!normalizedSourceId) {
      return;
    }
    const activeUserId = this.activeUserId.trim() || this.userProfileStore.activeUserId().trim() || this.userProfileStore.getActiveUserId().trim();
    if (!activeUserId) {
      return;
    }
    this.activeUserId = activeUserId;
    const draft = this.eventCheckoutDraftStore.read(activeUserId, normalizedSourceId);
    if (!draft) {
      return;
    }
    const entry = {
      draft,
      record: this.visibleEventExploreRecordById(normalizedSourceId) ?? this.eventsService.peekKnownRecordById(activeUserId, normalizedSourceId) ?? await this.eventsService.queryKnownRecordById(activeUserId, normalizedSourceId)
    };
    await this.continueCheckoutDraft(entry);
  }
  async viewCheckoutDraftEvent(entry, event) {
    this.stopDomEvent(event);
    if (this.isCheckoutDraftClearing(entry.draft.sourceId)) {
      return;
    }
    const sourceId = entry.draft.sourceId.trim();
    const record = entry.record ?? this.eventsService.peekKnownRecordById(this.activeUserId, sourceId) ?? await this.eventsService.queryKnownRecordById(this.activeUserId, sourceId);
    if (!record) {
      this.dialogStore.openInfo("This event can no longer be opened.", {
        title: "Event unavailable",
        confirmTone: "neutral"
      });
      this.cdr.markForCheck();
      return;
    }
    this.runEventExploreViewAction(record);
  }
  async clearCheckoutDraft(draft, event) {
    this.stopDomEvent(event);
    const activeUserId = this.activeUserId.trim();
    const sourceId = draft.sourceId.trim();
    if (!activeUserId || !sourceId) {
      this.eventCheckoutDraftStore.clear(activeUserId, sourceId);
      this.cdr.markForCheck();
      return;
    }
    if (this.checkoutDraftReleaseSourceIds.has(sourceId)) {
      return;
    }
    this.checkoutDraftReleaseSourceIds.add(sourceId);
    this.cdr.markForCheck();
    try {
      const slotSourceId = draft.basketItems.map((item) => item.slotSourceId?.trim() ?? "").find(Boolean) ?? null;
      const leaveResult = await this.eventsService.leaveEvent(activeUserId, sourceId, {
        slotSourceId,
        removeMembershipOnly: true,
        checkoutState: "cancelled",
        checkoutResultState: "deleted",
        checkoutSessionId: draft.checkoutSessionId ?? null
      });
      if (!leaveResult || leaveResult.changed === false && leaveResult.reason !== "already-applied" || leaveResult.membershipStatus === "unchanged") {
        throw new Error("Unable to leave event.");
      }
      if (leaveResult.changed !== false) {
        this.signalEventExploreCounterDelta(activeUserId, leaveResult.counterDelta ?? null);
      }
      const memberDelta = this.checkoutDraftCancelMemberDelta(draft);
      this.emitCheckoutDraftMembersSync(sourceId, leaveResult, memberDelta, true);
      this.activitiesStore.emitActivityEventRemoval(sourceId);
      this.eventCheckoutDraftStore.clear(activeUserId, sourceId);
      this.locallyTrackedMembershipSourceIds.delete(sourceId);
    } finally {
      this.checkoutDraftReleaseSourceIds.delete(sourceId);
      this.cdr.markForCheck();
    }
  }
  checkoutDraftCancelMemberDelta(draft) {
    const pendingReason = this.checkoutDraftPendingReason(draft);
    return pendingReason === "waitlist" || pendingReason === "approval" ? { acceptedMemberDelta: 0, pendingMemberDelta: -1 } : { acceptedMemberDelta: -1, pendingMemberDelta: 0 };
  }
  emitCheckoutDraftMembersSync(sourceId, result, memberDelta = null, viewerMembershipRemoved = false) {
    const normalizedSourceId = sourceId?.trim() ?? "";
    if (!normalizedSourceId) {
      return;
    }
    const record = this.eventsService.peekKnownRecordById(this.activeUserId, normalizedSourceId);
    const matchingResult = result?.sourceId === normalizedSourceId ? result : null;
    const acceptedMembers = matchingResult?.acceptedMembers ?? record?.acceptedMembers;
    const pendingMembers = matchingResult?.pendingMembers ?? record?.pendingMembers;
    const capacityTotal = matchingResult?.capacityTotal ?? record?.capacityTotal;
    if (acceptedMembers == null || pendingMembers == null || capacityTotal == null) {
      return;
    }
    this.activityStore.emitActivityMembersSync(__spreadValues(__spreadValues(__spreadValues({
      id: normalizedSourceId,
      acceptedMembers,
      pendingMembers,
      capacityTotal
    }, viewerMembershipRemoved ? { viewerMembershipRemoved: true } : {}), matchingResult?.membershipStatus ? { currentUserMembershipStatus: this.normalizeCurrentUserMembershipStatus(matchingResult.membershipStatus) } : {}), memberDelta ?? {}));
  }
  normalizeCurrentUserMembershipStatus(value) {
    return value === "accepted" || value === "pending" || value === "invited" || value === "trashed" || value === "suppressed" || value === "deleted" || value === "unchanged" ? value : "none";
  }
  withEventExploreResultSummary(record, result) {
    if (!result || result.sourceId !== record.id) {
      return record;
    }
    return __spreadProps(__spreadValues({}, record), {
      acceptedMembers: Math.max(0, Math.trunc(Number(result.acceptedMembers) || 0)),
      pendingMembers: Math.max(0, Math.trunc(Number(result.pendingMembers) || 0)),
      capacityTotal: record.capacityTotal
    });
  }
  requestClearCheckoutDraft(draft, event) {
    this.stopDomEvent(event);
    if (this.isCheckoutDraftClearing(draft.sourceId)) {
      return;
    }
    const visual = this.checkoutDraftMenuVisual({ draft, record: null });
    const title = visual.label === "waiting.list" ? "Leave waitlist?" : visual.label === "event.editor.checkout.waiting.approval" ? "Cancel request?" : visual.label === "event.checkout.ready.for.payment" || visual.label === "event.checkout.payment.in.progress" ? "Cancel payment?" : "Clear basket?";
    const confirmLabel = visual.label === "waiting.list" ? "Leave waitlist" : visual.label === "event.editor.checkout.waiting.approval" ? "Cancel request" : visual.label === "event.checkout.ready.for.payment" || visual.label === "event.checkout.payment.in.progress" ? "Cancel payment" : "Clear basket";
    this.dialogStore.open({
      title,
      message: draft.eventTitle,
      warningMessage: "The basket item will be cancelled and removed from the visible checkout basket.",
      cancelLabel: "Back",
      confirmLabel,
      busyConfirmLabel: `${confirmLabel}...`,
      confirmTone: visual.palette === "danger" ? "danger" : "accent",
      confirmPalette: visual.palette,
      failureMessage: "Unable to cancel this basket item.",
      onConfirm: async () => this.clearCheckoutDraft(draft)
    });
  }
  async loadEventExplorePage(query) {
    const page = await this.activitiesService.loadExplore(__spreadProps(__spreadValues({}, query), {
      filters: {
        userId: query.filters?.userId ?? this.activeUserId,
        order: query.filters?.order ?? this.eventExploreOrder,
        view: query.filters?.view ?? this.eventExploreView,
        friendsOnly: query.filters?.friendsOnly === true,
        openSpotsOnly: query.filters?.openSpotsOnly === true,
        topic: query.filters?.topic ?? this.normalizeTopic(this.eventExploreFilterTopic)
      }
    }));
    return page;
  }
  eventExploreInfoCard(record, groupLabel) {
    const card = EventExploreInfoCardConverter.convert(record, {
      groupLabel,
      topicToneGroups: this.topicFilterGroups,
      activeUserId: this.activeUserId,
      state: this.isEventExploreRecordLeaving(record) ? "leaving" : "default"
    });
    return this.withEventExploreCheckoutMenuActions(card, record);
  }
  withEventExploreCheckoutMenuActions(card, record) {
    const activeUserId = this.activeUserId.trim();
    if (!activeUserId || !this.trackableCheckoutDraft(record.id, activeUserId)) {
      return card;
    }
    return __spreadProps(__spreadValues({}, card), {
      menuActions: (card.menuActions ?? []).map((actionId) => this.isEventExploreJoinMenuAction(actionId) ? "continueBookingPending" : actionId)
    });
  }
  isEventExploreJoinMenuAction(actionId) {
    return actionId === "joinWaitlist" || actionId === "bookEvent" || actionId === "requestJoin";
  }
  visibleEventExploreRecordById(sourceId) {
    const normalizedSourceId = sourceId.trim();
    if (!normalizedSourceId) {
      return null;
    }
    return this.eventExploreSmartList?.itemsSnapshot().find((record) => record.id === normalizedSourceId) ?? null;
  }
  buildEventExploreGroupLabel(record, view) {
    if (view === "distance") {
      const bucket = Math.max(5, Math.ceil(record.distanceKm / 5) * 5);
      return `${bucket} km`;
    }
    const parsed = new Date(record.startAtIso);
    if (Number.isNaN(parsed.getTime())) {
      return "Date unavailable";
    }
    return AppUtils.smartListDayLabel(parsed);
  }
  runEventExploreServiceChatAction(record) {
    const chat = this.buildEventExploreServiceChat(record);
    if (!chat) {
      return;
    }
    void this.openStackedEventExploreServiceChat(chat);
  }
  async openStackedEventExploreServiceChat(chat) {
    await this.activitiesStore.ensureEventChatPopupLoaded();
    this.activitiesStore.openStackedEventChat(__spreadProps(__spreadValues({}, eventChatPopupRequestFromChat(chat)), {
      parentZIndex: this.eventExplorePopupZIndex()
    }), eventChatHeaderStateFromChat(chat));
  }
  buildEventExploreServiceChat(record) {
    const activeUserId = this.activeUserId.trim();
    if (!activeUserId) {
      return null;
    }
    const organizerUserId = `${record.creatorUserId ?? ""}`.trim();
    const memberIds = [activeUserId, organizerUserId].filter(Boolean);
    return {
      id: `c-service-event-${record.id}-${activeUserId}`,
      avatar: AppUtils.initialsFromText(record.creatorName?.trim() || record.title),
      title: `Contact Organizer \xB7 ${record.title}`,
      lastMessage: `Service chat with the organizer for ${record.title}.`,
      lastSenderId: organizerUserId || activeUserId,
      memberIds: [...new Set(memberIds)],
      unread: 0,
      dateIso: (/* @__PURE__ */ new Date()).toISOString(),
      channelType: "serviceEvent",
      serviceContext: "event",
      ownerId: record.id,
      ownerUserId: activeUserId
    };
  }
  runEventExploreReportAction(record) {
    const targetUserId = `${record.creatorUserId ?? ""}`.trim();
    if (!targetUserId || targetUserId === this.activeUserId.trim()) {
      return;
    }
    this.profileStore.openReportUserPopup({
      targetUserId,
      targetName: record.creatorName?.trim() || "Organizer",
      eventId: record.id,
      eventTitle: record.title,
      eventStartAtIso: record.startAtIso,
      eventTimeframe: record.timeframe,
      ownerType: "event"
    });
    this.cdr.markForCheck();
  }
  runEventExploreShareAction(record) {
    void this.shareTokensService.createToken({
      kind: "event",
      entityId: record.id,
      ownerUserId: this.activeUserId.trim()
    }).then((token) => this.openShareLinkDialog("Share event", token));
  }
  openShareLinkDialog(title, shareToken) {
    this.dialogStore.open({
      title,
      message: shareToken,
      confirmLabel: "Copy link",
      cancelLabel: "Cancel",
      confirmTone: "accent",
      onConfirm: async () => {
        await navigator.clipboard?.writeText(shareToken);
      }
    });
  }
  openEventExplore() {
    this.isOpen = true;
    this.prewarmEventEditorPopup();
    this.refreshUsersDirectory();
    this.closeMembersPopup();
    this.syncEventExploreQuery();
    this.reloadEventExploreSmartList();
  }
  syncEventExploreQuery() {
    this.eventExploreSmartListQuery = {
      filters: {
        userId: this.activeUserId,
        order: this.eventExploreOrder,
        view: this.eventExploreView,
        friendsOnly: this.eventExploreFilterFriendsOnly,
        openSpotsOnly: this.eventExploreFilterHasRooms,
        topic: this.normalizeTopic(this.eventExploreFilterTopic)
      }
    };
  }
  applyActivityMembersSyncState(sync) {
    let changed = false;
    if (this.selectedMembersRecord?.id === sync.id) {
      this.selectedMembersRecord = __spreadProps(__spreadValues({}, this.selectedMembersRecord), {
        acceptedMembers: Math.max(0, Math.trunc(Number(sync.acceptedMembers) || 0)),
        pendingMembers: Math.max(0, Math.trunc(Number(sync.pendingMembers) || 0)),
        capacityTotal: Math.max(Math.max(0, Math.trunc(Number(sync.acceptedMembers) || 0)), Math.trunc(Number(sync.capacityTotal) || 0))
      });
      changed = true;
    }
    if (this.isOpen && this.applyVisibleEventExploreMembersSync(sync)) {
      changed = true;
    }
    if (this.isOpen && sync.checkoutResultState === "succeeded") {
      void this.restorePaidCheckoutEventExploreRecord(sync.id);
    }
    if (changed) {
      this.cdr.markForCheck();
    }
  }
  emitActivityEventSave(payload) {
    return this.eventsService.saveActivityEvent(payload).then((displaySync) => {
      if (displaySync) {
        this.activitiesStore.emitActivityEventSaveResult(displaySync);
      }
    }).catch(() => {
    });
  }
  applyActivityEventSave(sync) {
    const dto = sync;
    const userJoinedEvent = this.locallyTrackedMembershipSourceIds.has(sync.id);
    if (userJoinedEvent) {
      this.locallyTrackedMembershipSourceIds.add(sync.id);
    } else {
      this.locallyTrackedMembershipSourceIds.delete(sync.id);
    }
    if (!this.eventExploreSmartList) {
      return;
    }
    const currentItems = [...this.eventExploreSmartList.itemsSnapshot()];
    const currentIndex = currentItems.findIndex((record) => record.id === sync.id);
    if (currentIndex >= 0) {
      this.checkoutDraftClearSaveSourceIds.delete(sync.id);
      const existing = currentItems[currentIndex];
      if (existing) {
        if (dto.full === true && this.eventExploreFilterHasRooms) {
          this.removeVisibleEventExploreRecord(existing);
          this.cdr.markForCheck();
          return;
        }
        const nextEndIso = dto.endAtIso ?? dto.startAtIso;
        const acceptedMembers = Number.isFinite(Number(dto.acceptedMembers)) ? Math.max(0, Math.trunc(Number(dto.acceptedMembers))) : Math.max(0, existing.acceptedMembers);
        currentItems[currentIndex] = __spreadProps(__spreadValues({}, existing), {
          title: dto.title,
          subtitle: dto.subtitle,
          startAtIso: dto.startAtIso,
          endAtIso: nextEndIso,
          distanceKm: dto.distanceKm,
          visibility: dto.visibility ?? existing.visibility,
          imageUrl: dto.imageUrl.trim(),
          location: dto.location?.trim() || existing.location,
          acceptedMembers,
          pendingMembers: Number.isFinite(Number(dto.pendingMembers)) ? Math.max(0, Math.trunc(Number(dto.pendingMembers))) : existing.pendingMembers,
          capacityMin: dto.capacityMin ?? existing.capacityMin,
          capacityMax: dto.capacityMax ?? existing.capacityMax,
          capacityTotal: Math.max(acceptedMembers, dto.capacityTotal ?? existing.capacityTotal),
          full: dto.full ?? existing.full,
          eventType: dto.eventType ?? existing.eventType,
          status: dto.status ?? existing.status
        });
        this.eventExploreSmartList.replaceVisibleItems(currentItems);
        this.cdr.markForCheck();
      }
      return;
    }
    if (!this.isOpen || userJoinedEvent) {
      return;
    }
    if (this.checkoutDraftClearSaveSourceIds.delete(sync.id.trim())) {
      return;
    }
    if (this.checkoutDraftReleaseSourceIds.has(sync.id.trim())) {
      return;
    }
    this.reloadEventExploreSmartList();
  }
  eventMembersOwner(record) {
    return {
      ownerType: "event",
      ownerId: record.id
    };
  }
  activityMemberSource(record) {
    return {
      id: record.id,
      type: record.type,
      isAdmin: true
    };
  }
  buildMemberEntries(record) {
    const source = this.activityMemberSource(record);
    const rowKey = `${source.type}:${source.id}`;
    const summary = this.activityMembersService.peekSummaryByOwner(this.eventMembersOwner(record));
    const acceptedUserIds = this.ensureMemberUserIds(summary?.acceptedMemberUserIds ?? [], record.acceptedMembers, record, /* @__PURE__ */ new Set(), true);
    const pendingUserIds = this.ensureMemberUserIds(summary?.pendingMemberUserIds ?? [], record.pendingMembers, record, new Set(acceptedUserIds), false);
    const entries = [];
    for (const userId of acceptedUserIds) {
      const user = this.resolveUser(userId, record);
      const base = ActivityMembersBuilder.toActivityMemberDTO(user, source, rowKey, record.creatorUserId, { status: "accepted", pendingSource: null, invitedByActiveUser: false }, APP_STATIC_DATA.activityMemberMetPlaces);
      entries.push(__spreadProps(__spreadValues({}, base), {
        role: user.id === record.creatorUserId ? "Admin" : "Member"
      }));
    }
    for (const userId of pendingUserIds) {
      const user = this.resolveUser(userId, record);
      const base = ActivityMembersBuilder.toActivityMemberDTO(user, source, rowKey, record.creatorUserId, { status: "pending", pendingSource: "admin", invitedByActiveUser: false }, APP_STATIC_DATA.activityMemberMetPlaces);
      entries.push(__spreadProps(__spreadValues({}, base), {
        requestKind: "invite",
        statusText: "Invitation pending."
      }));
    }
    return entries;
  }
  hasTrackedMembership(record, userId) {
    if (userId === this.activeUserId.trim() && this.locallyTrackedMembershipSourceIds.has(record.id)) {
      return true;
    }
    if (this.hasPendingCheckoutDraft(record.id, userId)) {
      return true;
    }
    if (record.currentUserMembershipStatus === "accepted" || record.currentUserMembershipStatus === "pending" || record.currentUserMembershipStatus === "invited") {
      return true;
    }
    if (record.currentUserMembershipStatus) {
      return false;
    }
    return this.activityMembersService.peekMembersByOwner(this.eventMembersOwner(record)).some((member) => member.userId === userId);
  }
  eventExploreMembershipStatus(record, userId) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return "none";
    }
    if (record.currentUserMembershipStatus === "accepted") {
      return "accepted";
    }
    if (record.currentUserMembershipStatus === "pending" || record.currentUserMembershipStatus === "invited") {
      return "pending";
    }
    if (record.currentUserMembershipStatus) {
      return "none";
    }
    const existingMember = this.activityMembersService.peekMembersByOwner(this.eventMembersOwner(record)).find((member) => member.userId === normalizedUserId);
    if (existingMember?.status === "accepted" || (record.acceptedMemberUserIds ?? []).includes(normalizedUserId)) {
      return "accepted";
    }
    if (existingMember?.status === "pending" || (record.pendingMemberUserIds ?? []).includes(normalizedUserId) || (record.pendingRequestMemberUserIds ?? []).includes(normalizedUserId)) {
      return "pending";
    }
    return "none";
  }
  hasPendingCheckoutDraft(sourceId, userId) {
    return this.trackableCheckoutDraft(sourceId, userId) !== null;
  }
  trackableCheckoutDraft(sourceId, userId) {
    const draft = this.eventCheckoutDraftStore.read(userId, sourceId);
    return this.isTrackableCheckoutDraft(draft) ? draft : null;
  }
  pendingCheckoutDraftSourceIds() {
    const activeUserId = this.activeUserId.trim();
    if (!activeUserId) {
      return /* @__PURE__ */ new Set();
    }
    return new Set(this.eventCheckoutDraftStore.listByUser(activeUserId).filter((draft) => this.isTrackableCheckoutDraft(draft)).map((draft) => draft.sourceId.trim()).filter((sourceId) => sourceId.length > 0));
  }
  requiresApprovalBeforePayment(record, draft = null) {
    if (record?.approvalRequired === true) {
      return true;
    }
    return draft?.pendingReason === "approval";
  }
  checkoutDraftPendingReason(draft) {
    if (draft?.pendingReason === "waitlist" || draft?.checkoutState === "waiting") {
      return "waitlist";
    }
    if (draft?.pendingReason === "approval" || draft?.checkoutState === "approval-pending") {
      return "approval";
    }
    return null;
  }
  resolveCheckoutDraftMembershipStatus(sourceId, _record) {
    const activeUserId = this.activeUserId.trim();
    const ownerId = sourceId.trim();
    if (!activeUserId || !ownerId) {
      return "none";
    }
    const memberEntries = this.activityMembersService.peekMembersByOwner({
      ownerType: "event",
      ownerId
    });
    const existingEntry = memberEntries.find((member) => member.userId === activeUserId);
    if (existingEntry?.status === "accepted") {
      return "accepted";
    }
    if (existingEntry?.status === "pending") {
      return "pending";
    }
    return "none";
  }
  isTrackableCheckoutDraft(draft) {
    if (!draft) {
      return false;
    }
    const resultState = this.checkoutDraftResultState(draft);
    if (resultState === "deleted" || resultState === "succeeded") {
      return false;
    }
    if (resultState === "failed") {
      return true;
    }
    return Math.max(0, Number(draft?.totalAmount) || 0) > 0 || draft?.pendingReason === "waitlist" || draft?.pendingReason === "approval" || draft?.checkoutState === "waiting" || draft?.checkoutState === "approval-pending";
  }
  eventExploreJoinDialogTitle(record, options = {}) {
    if (this.isEventExploreRecordFull(record) && options.approvalGranted !== true) {
      return "Join waiting list?";
    }
    if (this.requiresApprovalBeforePayment(record) && options.approvalGranted !== true) {
      return "Request to join?";
    }
    return record.ticketing ? "Continue booking?" : "Request to join?";
  }
  eventExploreJoinConfirmLabel(record, options = {}) {
    if (this.isEventExploreRecordFull(record) && options.approvalGranted !== true) {
      return "Join waiting list";
    }
    if (this.requiresApprovalBeforePayment(record) && options.approvalGranted !== true) {
      return "Send request";
    }
    return record.ticketing ? "Continue" : "Send request";
  }
  eventExploreJoinBusyLabel(record, options = {}) {
    if (this.isEventExploreRecordFull(record) && options.approvalGranted !== true) {
      return "Joining waitlist...";
    }
    if (this.requiresApprovalBeforePayment(record) && options.approvalGranted !== true) {
      return "Sending request...";
    }
    return record.ticketing ? "Continuing..." : "Sending request...";
  }
  eventExploreJoinFailureMessage(record, options = {}) {
    if (this.isEventExploreRecordFull(record) && options.approvalGranted !== true) {
      return "Unable to join the waiting list right now.";
    }
    if (this.requiresApprovalBeforePayment(record) && options.approvalGranted !== true) {
      return "Unable to send request.";
    }
    return record.ticketing ? "Unable to continue booking right now." : "Unable to send request.";
  }
  shouldUseCheckoutFlow(record) {
    if (this.isEventExploreRecordFull(record)) {
      return true;
    }
    if (record.approvalRequired === true) {
      return true;
    }
    if ((record.upcomingSlots?.length ?? 0) > 0) {
      return true;
    }
    if (record.policiesEnabled === true && (record.policies?.length ?? 0) > 0) {
      return true;
    }
    if ((record.subEvents ?? []).some((item) => item.optional)) {
      return true;
    }
    return Boolean(record.pricing?.enabled && (Number(record.pricing?.basePrice) || 0) > 0);
  }
  openEventExploreCheckout(record, options = {}) {
    const dialogOptions = {
      approvalGranted: options.approvalGranted === true
    };
    const pendingReason = options.pendingReason !== void 0 ? options.pendingReason : this.eventExploreCheckoutPendingReason(record);
    this.eventCheckoutDialogStore.open({
      mode: "join",
      userId: this.activeUserId,
      record,
      requiresApprovalBeforePayment: this.requiresApprovalBeforePayment(record),
      approvalGranted: dialogOptions.approvalGranted,
      pendingReason,
      title: this.eventExploreJoinDialogTitle(record, dialogOptions),
      subtitle: record.timeframe,
      confirmLabel: this.eventExploreJoinConfirmLabel(record, dialogOptions),
      busyConfirmLabel: this.eventExploreJoinBusyLabel(record, dialogOptions),
      failureMessage: this.eventExploreJoinFailureMessage(record, dialogOptions),
      onSubmit: (selection) => this.submitEventExploreJoinRequest(record, selection)
    });
  }
  eventExploreCheckoutPendingReason(record) {
    if (record.pendingReason === "waitlist" || this.isEventExploreRecordFull(record)) {
      return "waitlist";
    }
    if (this.requiresApprovalBeforePayment(record)) {
      return "approval";
    }
    return null;
  }
  async submitEventExploreJoinRequest(record, selection) {
    const activeUserId = this.activeUserId.trim();
    if (!activeUserId) {
      return;
    }
    const owner = this.eventMembersOwner(record);
    const peekedMembers = this.activityMembersService.peekMembersByOwner(owner);
    const existingMembers = peekedMembers.length > 0 ? peekedMembers : this.buildMemberEntries(record);
    const existingEntry = existingMembers.find((member) => member.userId === activeUserId);
    const checkoutUpdateRequested = Boolean(selection?.basketItems?.length && (selection.checkoutState === "waiting" || selection.checkoutState === "approval-pending" || selection.checkoutState === "approved" || selection.checkoutState === "confirmed" || selection.checkoutState === "pay" || selection.pendingReason === "waitlist" || selection.pendingReason === "approval"));
    if (existingEntry && existingEntry.status !== "deleted" && !checkoutUpdateRequested) {
      if (this.selectedMembersRecord?.id === record.id) {
        this.selectedMembers = [...existingMembers];
      }
      this.cdr.markForCheck();
      return;
    }
    const pendingReason = selection?.pendingReason ?? (this.isEventExploreSelectionFull(record, selection) ? "waitlist" : null);
    const isAcceptedBooking = this.isConfirmedEventExploreBooking(record, selection);
    const updatesExistingMember = Boolean(existingEntry && existingEntry.status !== "deleted");
    const optimisticExistingMembers = existingEntry?.status === "deleted" ? existingMembers.filter((member) => !(member.userId === activeUserId && member.status === "deleted")) : existingMembers;
    const joinRequestEntry = this.buildJoinRequestEntry(record, isAcceptedBooking, pendingReason);
    const nextMembers = updatesExistingMember ? [
      ...optimisticExistingMembers.filter((member) => member.userId !== activeUserId),
      joinRequestEntry
    ] : [
      ...optimisticExistingMembers,
      joinRequestEntry
    ];
    try {
      const joinResult = await this.eventsService.requestJoin(activeUserId, record.id, {
        slotSourceId: selection?.slotSourceId ?? null,
        optionalSubEventIds: selection?.optionalSubEventIds ?? [],
        assetSelections: selection?.assetSelections ?? [],
        acceptedPolicyIds: selection?.acceptedPolicyIds ?? [],
        appliedPromoCodes: selection?.appliedPromoCodes ?? [],
        paymentSessionId: selection?.paymentSessionId ?? null,
        bookingConfirmed: isAcceptedBooking,
        pendingReason,
        checkoutState: selection?.checkoutState,
        basketItems: selection?.basketItems?.length ? selection.basketItems : void 0,
        pricingSummaryRows: selection?.basketItems?.length ? selection.pricingSummaryRows ?? [] : void 0,
        lineItems: selection?.basketItems?.length ? selection.lineItems : void 0,
        totalAmount: selection?.basketItems?.length ? selection.totalAmount : void 0,
        currency: selection?.basketItems?.length ? selection.currency : void 0
      });
      if (joinResult?.reason === "tournament-registration-closed") {
        throw new Error("event.tournament.registration.closed.message");
      }
      if (!joinResult || joinResult.membershipStatus === "unchanged" && !checkoutUpdateRequested) {
        throw new Error(this.eventExploreJoinFailureMessage(record));
      }
      const persistedMembers = this.activityMembersService.peekMembersByOwner(owner);
      const displayMembers = [...persistedMembers.length > 0 ? persistedMembers : nextMembers];
      const nextRecord = this.withEventExploreMemberDelta(record, {
        acceptedMemberDelta: updatesExistingMember ? 0 : isAcceptedBooking ? 1 : 0,
        pendingMemberDelta: updatesExistingMember ? 0 : isAcceptedBooking ? 0 : 1
      }, displayMembers, pendingReason, this.normalizeCurrentUserMembershipStatus(joinResult.membershipStatus));
      this.locallyTrackedMembershipSourceIds.add(record.id);
      this.restoreVisibleEventExploreRecord(nextRecord);
      this.activitiesStore.emitActivityEventSaveResult(this.buildActivityEventDetailDTO(nextRecord, displayMembers, joinResult.paymentSessionId ?? selection?.paymentSessionId ?? null));
      this.signalEventExploreCounterDelta(activeUserId, joinResult.counterDelta ?? null);
      if (this.selectedMembersRecord?.id === record.id) {
        this.selectedMembersRecord = nextRecord;
        this.selectedMembers = displayMembers;
      }
      this.cdr.markForCheck();
    } catch (error) {
      this.locallyTrackedMembershipSourceIds.delete(record.id);
      this.restoreVisibleEventExploreRecord(record);
      throw error;
    }
  }
  signalEventExploreCounterDelta(activeUserId, delta) {
    if (!delta) {
      return;
    }
    this.activityStore.patchUserCounterDeltas(activeUserId, delta, null);
  }
  applyVisibleEventExploreMembersSync(sync) {
    if (!this.eventExploreSmartList) {
      return false;
    }
    const currentItems = [...this.eventExploreSmartList.itemsSnapshot()];
    const currentIndex = currentItems.findIndex((record) => record.id === sync.id);
    if (currentIndex < 0) {
      return false;
    }
    const currentRecord = currentItems[currentIndex];
    if (!currentRecord) {
      return false;
    }
    if (sync.full === true && this.eventExploreFilterHasRooms) {
      this.removeVisibleEventExploreRecord(currentRecord);
      return true;
    }
    const acceptedMemberDelta = Number.isFinite(Number(sync.acceptedMemberDelta)) ? Math.trunc(Number(sync.acceptedMemberDelta)) : Math.max(0, Math.trunc(Number(sync.acceptedMembers) || 0)) - Math.max(0, Math.trunc(Number(currentRecord.acceptedMembers) || 0));
    const pendingMemberDelta = Number.isFinite(Number(sync.pendingMemberDelta)) ? Math.trunc(Number(sync.pendingMemberDelta)) : Math.max(0, Math.trunc(Number(sync.pendingMembers) || 0)) - Math.max(0, Math.trunc(Number(currentRecord.pendingMembers) || 0));
    currentItems[currentIndex] = __spreadValues(__spreadValues(__spreadProps(__spreadValues({}, currentRecord), {
      acceptedMembers: Math.max(0, Math.trunc(Number(currentRecord.acceptedMembers) || 0) + acceptedMemberDelta),
      pendingMembers: Math.max(0, Math.trunc(Number(currentRecord.pendingMembers) || 0) + pendingMemberDelta),
      capacityTotal: currentRecord.capacityTotal,
      full: sync.full === true ? true : currentRecord.full
    }), sync.currentUserMembershipStatus ? { currentUserMembershipStatus: sync.currentUserMembershipStatus } : {}), sync.viewerMembershipRemoved ? {
      checkoutBasket: null,
      checkoutResultState: "deleted",
      pendingReason: null
    } : {});
    this.eventExploreSmartList.replaceVisibleItems(currentItems, {
      total: this.eventExploreSmartList.cursorState().total
    });
    return true;
  }
  removeVisibleEventExploreRecord(record) {
    if (!this.eventExploreSmartList) {
      return;
    }
    this.eventExploreSmartList.removeVisibleItems((item) => item.id === record.id, { totalDelta: -1 });
  }
  restoreVisibleEventExploreRecord(record, options = {}) {
    if (!this.isOpen || !this.eventExploreSmartList || !this.shouldShowRestoredEventExploreRecord(record)) {
      return;
    }
    const currentItems = [...this.eventExploreSmartList.itemsSnapshot()];
    const currentIndex = currentItems.findIndex((item) => item.id === record.id);
    if (currentIndex >= 0) {
      this.eventExploreSmartList.replaceVisibleItems(currentItems.map((item) => item.id === record.id ? record : item), { total: this.eventExploreSmartList.cursorState().total });
      return;
    }
    this.eventExploreSmartList.reinsertVisibleItem(record, {
      totalDelta: 1,
      loadedRange: options.loadedRange ?? "any"
    });
  }
  async restorePaidCheckoutEventExploreRecord(sourceId) {
    const activeUserId = this.activeUserId.trim();
    const normalizedSourceId = sourceId.trim();
    if (!this.isOpen || !activeUserId || !normalizedSourceId) {
      return;
    }
    const record = this.eventsService.peekKnownRecordById(activeUserId, normalizedSourceId) ?? await this.eventsService.queryKnownRecordById(activeUserId, normalizedSourceId);
    if (!record || !this.isOpen) {
      return;
    }
    this.restoreVisibleEventExploreRecord(record, { loadedRange: "before-or-within" });
    this.cdr.markForCheck();
  }
  restoreVisibleEventExploreRecordsById(sourceIds) {
    const activeUserId = this.activeUserId.trim();
    if (!activeUserId) {
      return;
    }
    sourceIds.forEach((sourceId) => {
      const record = this.eventsService.peekKnownRecordById(activeUserId, sourceId.trim());
      if (record) {
        this.restoreVisibleEventExploreRecord(record);
      }
    });
  }
  shouldShowRestoredEventExploreRecord(record) {
    if (this.eventExploreFilterFriendsOnly) {
      return false;
    }
    if (this.eventExploreFilterHasRooms && this.isEventExploreRecordFull(record)) {
      return false;
    }
    const selectedTopic = this.normalizeTopic(this.eventExploreFilterTopic);
    if (selectedTopic && !record.topics.some((topic) => this.normalizeTopic(topic) === selectedTopic)) {
      return false;
    }
    return true;
  }
  sortVisibleEventExploreRecords(records) {
    return [...records].sort((left, right) => {
      const byOrder = this.compareEventExploreRecords(left, right);
      if (byOrder !== 0) {
        return byOrder;
      }
      return left.title.localeCompare(right.title);
    });
  }
  eventExploreRecordLocalSortKey(record) {
    const startAt = AppUtils.toSortableDate(record.startAtIso);
    const fallback = [record.title, record.id];
    switch (this.eventExploreOrder) {
      case "nearby":
        return [Number(record.distanceKm) || 0, startAt, ...fallback];
      case "top-rated":
        return [-(Number(record.rating) || 0), startAt, ...fallback];
      case "most-relevant":
        return [-(Number(record.affinity) || 0), startAt, ...fallback];
      case "past-events":
        return [-startAt, ...fallback];
      case "upcoming":
      default:
        return [startAt, ...fallback];
    }
  }
  compareEventExploreRecords(left, right) {
    switch (this.eventExploreOrder) {
      case "nearby":
        return (Number(left.distanceKm) || 0) - (Number(right.distanceKm) || 0);
      case "top-rated":
        return (Number(right.rating) || 0) - (Number(left.rating) || 0);
      case "most-relevant":
        return (Number(right.affinity) || 0) - (Number(left.affinity) || 0);
      case "past-events":
        return AppUtils.toSortableDate(right.startAtIso) - AppUtils.toSortableDate(left.startAtIso);
      case "upcoming":
      default:
        return AppUtils.toSortableDate(left.startAtIso) - AppUtils.toSortableDate(right.startAtIso);
    }
  }
  pruneVisibleTrackedEventExploreRecords() {
  }
  isEventExploreRecordLeaving(record) {
    return this.leavingEventExploreRecordIds.has(record.id);
  }
  async runEventExploreExitTransition(record, onExited) {
    const isVisible = this.eventExploreSmartList?.itemsSnapshot().some((item) => item.id === record.id) ?? false;
    if (!isVisible) {
      onExited();
      return;
    }
    this.leavingEventExploreRecordIds.add(record.id);
    this.cdr.markForCheck();
    await this.waitForEventExploreDelay(this.eventExploreExitAnimationMs);
    onExited();
    this.leavingEventExploreRecordIds.delete(record.id);
    this.cdr.markForCheck();
  }
  waitForEventExploreDelay(durationMs) {
    return new Promise((resolve) => {
      setTimeout(resolve, Math.max(0, durationMs));
    });
  }
  ensureMemberUserIds(sourceUserIds, count, record, excluded, includeCreatorFirst) {
    const normalizedCount = Math.max(0, Math.trunc(Number(count) || 0));
    if (normalizedCount <= 0) {
      return [];
    }
    const result = [];
    const seen = new Set(excluded);
    const tryAdd = (userId) => {
      const normalized = `${userId ?? ""}`.trim();
      if (!normalized || seen.has(normalized)) {
        return;
      }
      seen.add(normalized);
      result.push(normalized);
    };
    if (includeCreatorFirst) {
      tryAdd(record.creatorUserId);
    }
    for (const userId of sourceUserIds) {
      tryAdd(userId);
      if (result.length >= normalizedCount) {
        return result.slice(0, normalizedCount);
      }
    }
    const pool = [record.creatorUserId, ...this.users.map((user) => user.id)];
    const seed = AppUtils.hashText(`event-explore-members:${record.id}:${record.type}:${includeCreatorFirst ? "accepted" : "pending"}`);
    for (let index = 0; result.length < normalizedCount && index < pool.length * 3; index += 1) {
      tryAdd(pool[(seed + index) % pool.length]);
    }
    return result.slice(0, normalizedCount);
  }
  resolveUser(userId, record) {
    return this.userByIdMap.get(userId) ?? {
      id: userId,
      name: record.creatorName,
      age: 30,
      birthday: "1996-01-01",
      city: record.creatorCity || "Austin",
      height: "175 cm",
      physique: "Athletic",
      languages: ["English"],
      horoscope: "Aries",
      initials: AppUtils.initialsFromText(record.creatorName),
      gender: record.creatorGender,
      statusText: "Recently Active",
      hostTier: "Host",
      traitLabel: "Reliable",
      completion: 60,
      headline: "",
      about: "",
      profileStatus: "public",
      activities: { game: 0, chats: 0, invitations: 0, events: 0, hosting: 0 }
    };
  }
  buildJoinRequestEntry(record, accepted = false, pendingReason = null) {
    const user = this.resolveUser(this.activeUserId, record);
    const source = this.activityMemberSource(record);
    const entry = ActivityMembersBuilder.toActivityMemberDTO(user, source, `${source.type}:${source.id}`, record.creatorUserId, {
      status: accepted ? "accepted" : "pending",
      pendingSource: accepted ? null : "member",
      invitedByActiveUser: false
    }, APP_STATIC_DATA.activityMemberMetPlaces);
    return __spreadProps(__spreadValues({}, entry), {
      role: "Member",
      requestKind: accepted ? null : pendingReason === "waitlist" ? "waitlist" : pendingReason === "approval" ? "approval" : "join",
      statusText: accepted ? "Joined event." : pendingReason === "waitlist" ? "Waiting list." : "Waiting for admin approval."
    });
  }
  isConfirmedEventExploreBooking(record, selection) {
    if (this.isEventExploreSelectionFull(record, selection)) {
      return false;
    }
    if (record.ticketing !== true) {
      return false;
    }
    if (selection?.bookingConfirmed === true) {
      return true;
    }
    return !selection && !this.shouldUseCheckoutFlow(record);
  }
  isEventExploreSelectionFull(record, selection) {
    const slotSourceId = `${selection?.slotSourceId ?? ""}`.trim();
    if (slotSourceId) {
      const slot = (record.upcomingSlots ?? []).find((item) => item.id === slotSourceId) ?? null;
      return slot ? this.isEventExploreSlotFull(slot) : this.isEventExploreRecordFull(record);
    }
    if ((record.upcomingSlots?.length ?? 0) > 0) {
      return false;
    }
    return this.isEventExploreRecordFull(record);
  }
  isEventExploreRecordFull(record) {
    return record?.full === true;
  }
  isEventExploreSlotFull(slot) {
    const capacityTotal = Math.max(0, Math.trunc(Number(slot.capacityTotal) || 0));
    if (capacityTotal <= 0) {
      return false;
    }
    return Math.max(0, Math.trunc(Number(slot.acceptedMembers) || 0)) >= capacityTotal;
  }
  buildActivityEventDetailDTO(record, members, paymentSessionId = null) {
    const summary = ActivityMembersBuilder.buildActivityMembersSummary(this.eventMembersOwner(record), members, record.capacityTotal);
    return new ActivityEventDetailDTO().apply({
      id: record.id,
      type: "events",
      title: record.title,
      subtitle: record.subtitle,
      timeframe: record.timeframe,
      activity: Math.max(0, Math.trunc(Number(record.activity) || 0)),
      startAtIso: record.startAtIso,
      endAtIso: record.endAtIso,
      distanceKm: record.distanceKm,
      imageUrl: record.imageUrl,
      acceptedMembers: summary.acceptedMembers,
      pendingMembers: summary.pendingMembers,
      capacityTotal: summary.capacityTotal,
      acceptedMemberUserIds: [...summary.acceptedMemberUserIds],
      pendingMemberUserIds: [...summary.pendingMemberUserIds],
      pendingRequestMemberUserIds: this.pendingRequestMemberUserIdsFromMembers(members),
      capacityMin: record.capacityMin,
      capacityMax: record.capacityMax,
      autoInviter: record.autoInviter,
      frequency: record.frequency,
      ticketing: record.ticketing,
      approvalRequired: record.approvalRequired === true,
      visibility: record.visibility,
      blindMode: record.blindMode,
      status: record.status ?? "A",
      creatorUserId: record.creatorUserId,
      creatorName: record.creatorName,
      creatorInitials: record.creatorInitials,
      creatorGender: record.creatorGender,
      creatorCity: record.creatorCity,
      location: record.location,
      locationCoordinates: record.locationCoordinates ?? null,
      sourceLink: record.sourceLink,
      pendingReason: this.eventExplorePendingReasonFromMembers(members),
      topics: [...record.topics],
      subEvents: Array.isArray(record.subEvents) ? record.subEvents.map((item) => __spreadValues({}, item)) : void 0,
      mode: record.mode,
      paymentSessionId
    });
  }
  withEventExploreMemberSummary(record, members) {
    const summary = ActivityMembersBuilder.buildActivityMembersSummary(this.eventMembersOwner(record), members, record.capacityTotal);
    return __spreadProps(__spreadValues({}, record), {
      acceptedMembers: summary.acceptedMembers,
      pendingMembers: summary.pendingMembers,
      capacityTotal: record.capacityTotal,
      acceptedMemberUserIds: [...summary.acceptedMemberUserIds],
      pendingMemberUserIds: [...summary.pendingMemberUserIds],
      pendingRequestMemberUserIds: this.pendingRequestMemberUserIdsFromMembers(members),
      pendingReason: this.eventExplorePendingReasonFromMembers(members),
      currentUserMembershipStatus: this.eventExploreCurrentUserMembershipStatusFromMembers(members)
    });
  }
  withEventExploreMemberDelta(record, memberDelta, members = [], pendingReason = null, currentUserMembershipStatus = "none") {
    const acceptedMemberDelta = Math.trunc(Number(memberDelta.acceptedMemberDelta) || 0);
    const pendingMemberDelta = Math.trunc(Number(memberDelta.pendingMemberDelta) || 0);
    const hasMembers = members.length > 0;
    return __spreadProps(__spreadValues(__spreadProps(__spreadValues({}, record), {
      acceptedMembers: Math.max(0, Math.trunc(Number(record.acceptedMembers) || 0) + acceptedMemberDelta),
      pendingMembers: Math.max(0, Math.trunc(Number(record.pendingMembers) || 0) + pendingMemberDelta),
      capacityTotal: record.capacityTotal
    }), hasMembers ? {
      acceptedMemberUserIds: members.filter((member) => member.status === "accepted").map((member) => member.userId.trim()).filter((userId) => userId.length > 0),
      pendingMemberUserIds: members.filter((member) => member.status === "pending").map((member) => member.userId.trim()).filter((userId) => userId.length > 0),
      pendingRequestMemberUserIds: this.pendingRequestMemberUserIdsFromMembers(members)
    } : {}), {
      pendingReason: pendingReason ?? (hasMembers ? this.eventExplorePendingReasonFromMembers(members) : null),
      currentUserMembershipStatus
    });
  }
  eventExploreCurrentUserMembershipStatusFromMembers(members) {
    const activeUserId = this.activeUserId.trim();
    const member = members.find((item) => item.userId.trim() === activeUserId);
    if (member?.status === "accepted") {
      return "accepted";
    }
    if (member?.status === "pending") {
      return member.requestKind === "invite" ? "invited" : "pending";
    }
    if (member?.status === "deleted") {
      return "deleted";
    }
    return "none";
  }
  eventExplorePendingReasonFromMembers(members) {
    if (members.some((member) => member.status === "pending" && member.requestKind === "waitlist")) {
      return "waitlist";
    }
    if (members.some((member) => member.status === "pending" && member.requestKind === "approval")) {
      return "approval";
    }
    return null;
  }
  pendingRequestMemberUserIdsFromMembers(members) {
    return Array.from(new Set(members.filter((member) => member.status === "pending").filter((member) => member.requestKind !== "invite" && member.requestKind !== "waitlist-invite").map((member) => member.userId.trim()).filter((userId) => userId.length > 0)));
  }
  stopDomEvent(event) {
    event?.preventDefault?.();
    event?.stopPropagation?.();
  }
  refreshUsersDirectory() {
    const users = this.gameService.getGameCardsUsersSnapshot();
    const activeProfile = this.userProfileStore.activeUserProfile();
    const nextUsers = [...users];
    if (activeProfile && !nextUsers.some((user) => user.id === activeProfile.id)) {
      nextUsers.push(activeProfile);
    }
    this.users = nextUsers;
    this.userByIdMap = new Map(nextUsers.map((user) => [user.id, user]));
  }
  prewarmEventEditorPopup() {
    if (this.eventEditorPrewarmStarted) {
      return;
    }
    this.eventEditorPrewarmStarted = true;
    void import("./event-editor-popup.component-YOGR7QAI.js");
  }
  reloadEventExploreSmartList() {
    this.resetHeaderState();
    this.eventExploreSmartList?.reload();
    this.cdr.markForCheck();
  }
  resetHeaderState() {
    this.eventExploreHeaderProgress = 0;
    this.eventExploreHeaderProgressLoading = false;
    this.eventExploreHeaderLoadingProgress = 0;
    this.eventExploreHeaderLoadingOverdue = false;
    this.eventExploreStickyLabel = "No items";
  }
  normalizeTopic(topic) {
    return AppUtils.normalizeText(`${topic ?? ""}`.replace(/^#+\s*/, "").trim());
  }
  static \u0275fac = function EventExplorePopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EventExplorePopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EventExplorePopupComponent, selectors: [["app-event-explore-popup"]], viewQuery: function EventExplorePopupComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5)(_c1, 5, TemplateRef);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.eventExploreSmartList = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.eventExploreItemTemplate = _t.first);
    }
  }, hostBindings: function EventExplorePopupComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("keydown.escape", function EventExplorePopupComponent_keydown_escape_HostBindingHandler($event) {
        return ctx.onEscapePressed($event);
      }, \u0275\u0275resolveWindow);
    }
  }, features: [\u0275\u0275ProvidersFeature([AppMenuDispatcher])], decls: 1, vars: 1, consts: [["eventExploreSmartList", ""], ["eventExploreItemTemplate", ""], [3, "model", "zIndex"], [1, "event-explore-popup"], [3, "stateChange", "config", "loadPage", "itemTemplate", "query"], ["kind", "fab", "title", "Basket", 1, "event-explore-basket-menu", 3, "trigger", "items", "panelAlign", "mobileBreakpointPx"], [3, "itemSelect"], ["kind", "fab", "title", "Basket", 1, "event-explore-basket-menu", 3, "itemSelect", "trigger", "items", "panelAlign", "mobileBreakpointPx"], [3, "mediaStartClick", "mediaEndClick", "menuAction", "menuRequest", "card", "useSharedMenu"], [4, "ngComponentOutlet"]], template: function EventExplorePopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, EventExplorePopupComponent_Conditional_0_Template, 9, 8);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.isOpen ? 0 : -1);
    }
  }, dependencies: [
    CommonModule,
    NgComponentOutlet,
    MatIconModule,
    AppMenuComponent,
    AppMenuOutletComponent,
    InfoCardComponent,
    PopupComponent,
    SmartListComponent
  ], styles: ['\n[_nghost-%COMP%] {\n  --interactive-motion-duration: 160ms;\n  --interactive-motion-ease: cubic-bezier(0.22, 1, 0.36, 1);\n  --interactive-hover-lift: -1px;\n  --interactive-hover-scale: 1.01;\n  --interactive-hover-brightness: 1.01;\n  --interactive-press-scale: 0.97;\n  --interactive-press-brightness: 0.97;\n}\n[_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]) {\n  -webkit-tap-highlight-color: transparent;\n  transition:\n    transform var(--interactive-motion-duration) var(--interactive-motion-ease),\n    filter var(--interactive-motion-duration) var(--interactive-motion-ease),\n    box-shadow var(--interactive-motion-duration) var(--interactive-motion-ease),\n    background-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    border-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    color var(--interactive-motion-duration) var(--interactive-motion-ease);\n  transform-origin: center;\n}\n[_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):focus-visible {\n  outline: 2px solid rgba(66, 110, 182, 0.44);\n  outline-offset: 2px;\n}\n@media (hover: hover) and (pointer: fine) {\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):hover {\n    transform: translateY(var(--interactive-hover-lift)) scale(var(--interactive-hover-scale));\n    filter: brightness(var(--interactive-hover-brightness));\n  }\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  [_ngcontent-%COMP%]:where(.motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):hover {\n    box-shadow: 0 3px 10px rgba(16, 29, 48, 0.14);\n  }\n}\n@keyframes _ngcontent-%COMP%_shared-mobile-touch-feedback {\n  0% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n  45% {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  100% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n}\n@media (hover: none), (pointer: coarse) {\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    animation: _ngcontent-%COMP%_shared-mobile-touch-feedback 0.2s ease;\n  }\n}\n.app-popup[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%] {\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.app-popup[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%] {\n  font-family: inherit;\n}\n.popup-filter-picker[_ngcontent-%COMP%], \n.activities-view-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 60;\n  margin-left: auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-filter-picker-secondary[_ngcontent-%COMP%], \n.activities-secondary-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 61;\n}\n.selector-like[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%] {\n  width: fit-content !important;\n  min-width: 0 !important;\n  max-width: 100%;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: auto !important;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%] {\n  width: auto !important;\n  flex: 0 1 auto;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: auto !important;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%] {\n  margin-left: 0.28rem;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%] {\n  min-width: 174px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  border: 1px solid #c8d3e2;\n  border-radius: 999px;\n  box-shadow: 0 2px 6px rgba(38, 60, 92, 0.08);\n  padding: 0.12rem 0.5rem 0.12rem 0.84rem;\n  background: #f8f9fb;\n}\n.profile-status-select-wrap.selector-like[_ngcontent-%COMP%] {\n  min-height: 36px;\n}\n.status-option-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.2rem;\n  text-transform: lowercase;\n  width: 100%;\n  min-width: 0;\n}\n.status-option-content[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child {\n  white-space: nowrap;\n}\n.status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  flex: 0 0 16px;\n}\n.rate-filter-count-badge[_ngcontent-%COMP%] {\n  margin-left: auto;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  border: 1px solid #fff;\n  background: #d84d4d;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  font-size: 0.68rem;\n  font-weight: 800;\n  line-height: 1;\n  box-shadow: 0 2px 8px rgba(120, 24, 24, 0.22);\n}\n.rate-filter-trigger-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  margin-left: 0;\n  z-index: 2;\n}\n.popup-filter-control[_ngcontent-%COMP%], \n.activities-rate-filter-select[_ngcontent-%COMP%], \n.activities-primary-filter-select[_ngcontent-%COMP%], \n.activities-event-scope-filter-select[_ngcontent-%COMP%], \n.activities-chat-context-filter-select[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: visible;\n}\n.popup-filter-panel[_ngcontent-%COMP%], \n.activities-view-picker-panel[_ngcontent-%COMP%] {\n  position: absolute;\n  top: calc(100% + 0.32rem);\n  right: 0;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 10px;\n  background: #fff;\n  box-shadow: 0 10px 24px rgba(17, 29, 48, 0.22);\n  padding: 0.24rem;\n  min-width: 128px;\n  z-index: 40;\n  display: grid;\n  gap: 0.16rem;\n}\n.popup-filter-option[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%] {\n  border: 0;\n  background: #fff;\n  border-radius: 8px;\n  min-height: 32px;\n  padding: 0.34rem 0.44rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.34rem;\n  color: #1e3658;\n  cursor: pointer;\n  text-align: left;\n}\n.popup-filter-option[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-filter-option[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.popup-filter-option[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:not(.rate-filter-count-badge), \n.activities-view-option[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:not(.rate-filter-count-badge) {\n  flex: 1 1 auto;\n  min-width: 0;\n  text-align: left;\n}\n.popup-mobile-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-primary-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-event-scope-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-chat-context-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-rate-filter-picker[_ngcontent-%COMP%] {\n  position: relative;\n}\n.popup-mobile-filter-panel[_ngcontent-%COMP%], \n.activities-mobile-filter-panel[_ngcontent-%COMP%], \n.activities-mobile-rate-filter-panel[_ngcontent-%COMP%] {\n  top: calc(100% + 0.24rem);\n  right: 0;\n  min-width: 210px;\n  z-index: 65;\n}\n.popup-mobile-sheet-title[_ngcontent-%COMP%], \n.activities-mobile-sheet-title[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  padding: 0 0.14rem;\n  color: #1c3354;\n  font-size: 0.94rem;\n  font-weight: 800;\n}\n.popup-mobile-sheet-title[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.activities-mobile-sheet-title[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n:is(.popup-filter-bar[_ngcontent-%COMP%], .experience-toolbar[_ngcontent-%COMP%], .assets-toolbar[_ngcontent-%COMP%])   .popup-view-fab[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child, \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%] {\n  font-weight: 400 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option .status-option-content {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  width: 100%;\n  min-width: 0;\n  column-gap: 0.34rem;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option .rate-filter-count-badge {\n  margin-left: 0;\n  justify-self: end;\n}\n[_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.selector-options-panel), \n[_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.status-options-panel) {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n@media (max-width: 760px) {\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%] {\n    width: 100%;\n    min-width: 0;\n    box-sizing: border-box;\n    border: 1px solid rgba(58, 81, 114, 0.24);\n    border-radius: 12px;\n    background: #f7f9fd;\n    min-height: 42px;\n    padding: 0.46rem 0.62rem;\n    justify-content: flex-start;\n    gap: 0.36rem;\n  }\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%] {\n    box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.24);\n    filter: brightness(0.95);\n  }\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%] {\n    margin-left: auto;\n    flex: 0 0 auto;\n  }\n  [_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.profile-bottom-sheet-panel) {\n    position: fixed !important;\n    left: 0 !important;\n    right: 0 !important;\n    bottom: 0 !important;\n    top: auto !important;\n    width: 100vw !important;\n    max-width: 100vw !important;\n    transform: none !important;\n  }\n  [_nghost-%COMP%]     .mat-mdc-select-panel.profile-bottom-sheet-panel {\n    width: 100vw !important;\n    max-width: 100vw !important;\n    max-height: min(54vh, 420px) !important;\n    margin: 0 !important;\n    border-radius: 16px 16px 0 0 !important;\n    border: 1px solid #d6deea;\n    border-bottom: 0;\n    box-shadow: 0 -14px 28px rgba(15, 29, 52, 0.24);\n    padding-top: 0.38rem;\n    padding-bottom: max(0.55rem, env(safe-area-inset-bottom));\n  }\n}\n.popup-view-fab[_ngcontent-%COMP%] {\n  height: 34px;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 999px;\n  background: #f3f7ff;\n  color: #2c4c74;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0 0.62rem;\n  cursor: pointer;\n}\n.popup-view-fab[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-view-fab[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.74rem;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.event-visibility-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 22;\n  margin-left: auto;\n  flex: 0 0 auto;\n}\n.event-visibility-trigger[_ngcontent-%COMP%] {\n  flex-wrap: nowrap;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-public[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-public[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e6f6ef);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-friends[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-friends[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e8f1fd);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-host[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-host[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6efe2);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-inactive[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-inactive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f2f3f5);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-public[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-public[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-friends[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-friends[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-host[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-host[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-inactive[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-inactive[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.48rem 0.56rem;\n  font: inherit;\n  color: var(--text-main);\n  background: #fff;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  resize: vertical;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n  outline: 0;\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n}\n.popup-surface-form-grid[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  max-width: none;\n  width: 100%;\n  margin: 0;\n  justify-content: stretch;\n  align-content: start;\n  align-items: start;\n  column-gap: 1rem;\n  row-gap: 0.9rem;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-rows: min-content;\n  gap: 0;\n  font-weight: 600;\n  color: rgba(26, 44, 69, 0.88);\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  min-height: 40px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  min-height: 96px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   .profile-status-select-wrap.selector-like[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   .profile-status-select-wrap.selector-like[_ngcontent-%COMP%] {\n  min-height: 40px;\n  height: 40px;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  min-height: 32px;\n}\n.popup-surface-description-field[_ngcontent-%COMP%], \n.experience-description-field[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.popup-surface-actions[_ngcontent-%COMP%], \n.experience-form-actions[_ngcontent-%COMP%] {\n  justify-content: center;\n  padding-top: 0.2rem;\n}\n.popup-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.link-btn[_ngcontent-%COMP%] {\n  border: 1px solid var(--line-strong);\n  border-radius: 999px;\n  background: #fff;\n  color: #1f3350;\n  font: inherit;\n  font-size: 0.83rem;\n  padding: 0.38rem 0.76rem;\n  cursor: pointer;\n}\n.neutral-btn[_ngcontent-%COMP%] {\n  background: #f2f4fa;\n  border-color: rgba(23, 33, 54, 0.12);\n}\n.primary-btn[_ngcontent-%COMP%] {\n  background: #4776b7;\n  border-color: #4776b7;\n  color: #fff;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.date-picker-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: #566b86;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  min-width: 80px;\n  width: 100%;\n  font-size: 0.8rem;\n  font-weight: 700;\n  text-transform: lowercase;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-content: flex-start;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%] {\n  margin-left: auto;\n}\n.status-public[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.status-friends[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.status-host[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.status-inactive[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-public[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-friends[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-host[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-inactive[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.profile-status-select-wrap.status-public[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.profile-status-select-wrap.status-friends[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.profile-status-select-wrap.status-host[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.profile-status-select-wrap.status-inactive[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.profile-details-values-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: rgba(44, 67, 100, 0.72);\n}\n.profile-details-values-btn[_ngcontent-%COMP%] {\n  min-height: 36px;\n  height: 36px;\n  box-sizing: border-box;\n  padding-top: 0;\n  padding-bottom: 0;\n}\n.profile-details-values-btn[_ngcontent-%COMP%]   .status-option-content.profile-details-selected-badges[_ngcontent-%COMP%] {\n  display: inline-grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  column-gap: 0.26rem;\n  min-width: 0;\n  width: 100%;\n}\n.profile-details-values-btn.profile-details-values-tone-values[_ngcontent-%COMP%]   .profile-details-inline-chip[_ngcontent-%COMP%] {\n  max-width: calc(100% - 2.6rem);\n}\n.profile-details-values-btn.profile-details-values-tone-interest[_ngcontent-%COMP%]   .profile-details-inline-chip[_ngcontent-%COMP%] {\n  max-width: calc((100% - 3.2rem) / 2);\n}\n.profile-details-values-btn.profile-details-values-tone-values[_ngcontent-%COMP%]   .profile-details-inline-overflow[_ngcontent-%COMP%] {\n  color: #1e6b5a;\n}\n.profile-details-values-btn.profile-details-values-tone-interest[_ngcontent-%COMP%]   .profile-details-inline-overflow[_ngcontent-%COMP%] {\n  color: #2e5a90;\n}\n.values-header-chips[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.28rem;\n  flex: 0 0 100%;\n  margin-left: 0;\n  margin-top: 0.34rem;\n  max-width: 100%;\n  overflow: visible;\n  white-space: normal;\n  padding-bottom: 0;\n}\n.popup-title-values[_ngcontent-%COMP%] {\n  margin-right: 0.38rem;\n}\n.values-selected-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(76, 99, 136, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9ff 0%,\n      #eef3ff 100%);\n  color: #24416a;\n  border-radius: 999px;\n  min-height: 26px;\n  padding: 0.18rem 0.46rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-size: 0.7rem;\n  font-weight: 700;\n  cursor: pointer;\n  flex: 0 0 auto;\n}\n.values-selected-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.values-selected-chip.section-family[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1ea 0%,\n      #ffe6dd 100%);\n  border-color: rgba(160, 90, 51, 0.32);\n  color: #8b4d2b;\n}\n.values-selected-chip.section-ambition[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff7e8 0%,\n      #ffefd7 100%);\n  border-color: rgba(160, 106, 20, 0.32);\n  color: #9a6614;\n}\n.values-selected-chip.section-lifestyle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f5 0%,\n      #e0f2ee 100%);\n  border-color: rgba(45, 125, 120, 0.32);\n  color: #2a6e6a;\n}\n.values-selected-chip.section-beliefs[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f0ecff 0%,\n      #e8e1fa 100%);\n  border-color: rgba(95, 78, 160, 0.32);\n  color: #564793;\n}\n.values-selected-chip.section-social[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n  color: #2d5ea8;\n}\n.values-selected-chip.section-arts[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2edfb 0%,\n      #e9e2f9 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n  color: #654ca1;\n}\n.values-selected-chip.section-food[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4e8 0%,\n      #fee9d6 100%);\n  border-color: rgba(170, 97, 28, 0.32);\n  color: #9d611c;\n}\n.values-selected-chip.section-active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.values-selected-chip.section-mind[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f6 0%,\n      #def1ee 100%);\n  border-color: rgba(37, 124, 118, 0.32);\n  color: #2d7d78;\n}\n.values-selected-chip.section-identity[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n  border-color: rgba(88, 78, 159, 0.32);\n  color: #5a4ea0;\n}\n.readonly-select[_ngcontent-%COMP%] {\n  width: fit-content;\n  min-width: 0;\n  max-width: 130px;\n  justify-content: center;\n  margin-top: 2px;\n  padding-left: 0.44rem;\n  padding-right: 0.44rem;\n}\n.readonly-field[_ngcontent-%COMP%] {\n  min-height: 34px;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.4rem 0.56rem;\n  background: #f7fafe;\n  color: #23476f;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-weight: 700;\n}\n.readonly-field[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.zodiac-symbol[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  font-weight: 800;\n  line-height: 1;\n}\n.zodiac-label[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  font-weight: 700;\n  min-width: 0;\n  text-align: center;\n}\n.readonly-select.zodiac-aries[_ngcontent-%COMP%] {\n  background: #fdf1f1;\n  color: #9f2f2f;\n}\n.readonly-select.zodiac-taurus[_ngcontent-%COMP%] {\n  background: #f7f3eb;\n  color: #6e4b2b;\n}\n.readonly-select.zodiac-gemini[_ngcontent-%COMP%] {\n  background: #fdf8e9;\n  color: #7d5a12;\n}\n.readonly-select.zodiac-cancer[_ngcontent-%COMP%] {\n  background: #eef4ff;\n  color: #2d5b8e;\n}\n.readonly-select.zodiac-leo[_ngcontent-%COMP%] {\n  background: #fff3e8;\n  color: #8f4b0d;\n}\n.readonly-select.zodiac-virgo[_ngcontent-%COMP%] {\n  background: #edf8ef;\n  color: #2b6b3d;\n}\n.readonly-select.zodiac-libra[_ngcontent-%COMP%] {\n  background: #f2eefc;\n  color: #60439d;\n}\n.readonly-select.zodiac-scorpio[_ngcontent-%COMP%] {\n  background: #f9edf2;\n  color: #7b3150;\n}\n.readonly-select.zodiac-sagittarius[_ngcontent-%COMP%] {\n  background: #eef1ff;\n  color: #2f4a9a;\n}\n.readonly-select.zodiac-capricorn[_ngcontent-%COMP%] {\n  background: #eff2f5;\n  color: #364653;\n}\n.readonly-select.zodiac-aquarius[_ngcontent-%COMP%] {\n  background: #ebf7fb;\n  color: #1d5f7a;\n}\n.readonly-select.zodiac-pisces[_ngcontent-%COMP%] {\n  background: #eef2ff;\n  color: #294b8f;\n}\n.physique-slim[_ngcontent-%COMP%] {\n  color: #3f7ab3;\n}\n.physique-lean[_ngcontent-%COMP%] {\n  color: #3f8f5f;\n}\n.physique-athletic[_ngcontent-%COMP%] {\n  color: #2f7e4d;\n}\n.physique-fit[_ngcontent-%COMP%] {\n  color: #465fbb;\n}\n.physique-curvy[_ngcontent-%COMP%] {\n  color: #a14875;\n}\n.physique-muscular[_ngcontent-%COMP%] {\n  color: #7d4f24;\n}\n.physique-average[_ngcontent-%COMP%] {\n  color: #4d667f;\n}\n.physique-select-wrap.physique-slim[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf3fb 0%,\n      #dfebf8 100%);\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.physique-select-wrap.physique-lean[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf6ee 0%,\n      #def0e5 100%);\n  border-color: rgba(63, 143, 95, 0.34);\n}\n.physique-select-wrap.physique-athletic[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f5ec 0%,\n      #dff0e6 100%);\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.physique-select-wrap.physique-fit[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ebf0ff 0%,\n      #e1e8fc 100%);\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.physique-select-wrap.physique-curvy[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f7edf3 0%,\n      #f0e3ec 100%);\n  border-color: rgba(161, 72, 117, 0.36);\n}\n.physique-select-wrap.physique-muscular[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe9 0%,\n      #ede3d8 100%);\n  border-color: rgba(125, 79, 36, 0.36);\n}\n.physique-select-wrap.physique-average[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef2f6 0%,\n      #e5ebf1 100%);\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.physique-select-wrap.physique-slim[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #3f7ab3;\n}\n.physique-select-wrap.physique-lean[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #3f8f5f;\n}\n.physique-select-wrap.physique-athletic[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f7e4d;\n}\n.physique-select-wrap.physique-fit[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #465fbb;\n}\n.physique-select-wrap.physique-curvy[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #a14875;\n}\n.physique-select-wrap.physique-muscular[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #7d4f24;\n}\n.physique-select-wrap.physique-average[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #4d667f;\n}\n.experience-filter-all[_ngcontent-%COMP%] {\n  color: #694ea6;\n}\n.experience-filter-workspace[_ngcontent-%COMP%] {\n  color: #a1485a;\n}\n.experience-filter-school[_ngcontent-%COMP%] {\n  color: #2d5ea8;\n}\n.experience-filter-online[_ngcontent-%COMP%] {\n  color: #2d7d47;\n}\n.experience-filter-project[_ngcontent-%COMP%] {\n  color: #6550a0;\n}\n.experience-filter-select.experience-filter-all[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-project[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #efe8ff 0%,\n      #e8defc 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n}\n.experience-filter-select.experience-filter-workspace[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-workspace[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f3 0%,\n      #ffe6ea 100%);\n  border-color: rgba(169, 72, 90, 0.32);\n}\n.experience-filter-select.experience-filter-school[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-school[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n}\n.experience-type-select.experience-filter-online[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n}\n.experience-type-select.experience-filter-project[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n}\n.experience-type-select[_ngcontent-%COMP%] {\n  min-width: 0;\n  max-width: 100%;\n  min-height: 40px;\n}\n.experience-type-field[_ngcontent-%COMP%], \n.experience-title-field[_ngcontent-%COMP%], \n.experience-city-field[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-org-field[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-type-select[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.experience-date-range-field[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: none;\n  margin: 0;\n  background: transparent;\n}\n.experience-date-range-label[_ngcontent-%COMP%] {\n  grid-column: 1/2;\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-text-field-wrapper[_ngcontent-%COMP%] {\n  min-height: 42px;\n  border-radius: 10px;\n  background: #fff;\n  border: 1px solid rgba(136, 156, 186, 0.5);\n  box-shadow: none;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-subscript-wrapper[_ngcontent-%COMP%] {\n  margin-top: 0.24rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  border: 0 !important;\n  box-shadow: none !important;\n  border-radius: 0 !important;\n  background: transparent !important;\n  min-width: 0;\n  width: 100%;\n  padding: 0 !important;\n  min-height: 0 !important;\n  height: auto !important;\n  line-height: 1.25;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-datepicker-toggle[_ngcontent-%COMP%] {\n  margin-right: 0.2rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-hint-wrapper[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-hint[_ngcontent-%COMP%] {\n  color: rgba(30, 49, 74, 0.65);\n  font-size: 0.72rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-container[_ngcontent-%COMP%] {\n  width: 100%;\n  display: grid;\n  grid-template-columns: minmax(96px, 1fr) auto minmax(96px, 1fr);\n  align-items: center;\n  column-gap: 0.34rem;\n  min-width: 0;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-separator[_ngcontent-%COMP%] {\n  margin: 0 0.28rem;\n  flex: 0 0 auto;\n  white-space: nowrap;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-start-wrapper[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-end-wrapper[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  overflow: visible;\n  min-width: 0;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-inner[_ngcontent-%COMP%] {\n  font-size: 0.96rem;\n  min-width: 0 !important;\n  width: 100% !important;\n  text-overflow: clip;\n  white-space: nowrap;\n  line-height: 1.25;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-flex[_ngcontent-%COMP%] {\n  min-width: 0;\n  border-bottom: 0 !important;\n  box-shadow: none !important;\n  align-items: center !important;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-infix[_ngcontent-%COMP%] {\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  min-height: 34px !important;\n  height: 34px;\n  display: flex;\n  align-items: center;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-line-ripple[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple--deactivating[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple--active[_ngcontent-%COMP%] {\n  display: none !important;\n  opacity: 0 !important;\n  transform: scaleX(0) !important;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-all {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efe8ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-workspace {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1f3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-school {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf4ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-online {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf8ee);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-project {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f4f0ff);\n}\n.mobile-profile-language-chip.language-tone-1[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-1[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-1 {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n  color: #2f6090;\n}\n.mobile-profile-language-chip.language-tone-2[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-2[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-2 {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n  color: #2f695b;\n}\n.mobile-profile-language-chip.language-tone-3[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-3[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-3 {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n  color: #394f9c;\n}\n.mobile-profile-language-chip.language-tone-4[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-4[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-4 {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n  color: #8d3f66;\n}\n.mobile-profile-language-chip.language-tone-5[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-5[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-5 {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n  color: #704822;\n}\n.mobile-profile-language-chip.language-tone-6[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-6[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-6 {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n  color: #415872;\n}\n.mobile-profile-language-chip.language-tone-7[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-7[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-7 {\n  background: #f7f5ea;\n  border-color: rgba(128, 109, 66, 0.34);\n  color: #746237;\n}\n.mobile-profile-language-chip.language-tone-8[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-8[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-8 {\n  background: #edf5ff;\n  border-color: rgba(45, 122, 160, 0.34);\n  color: #2f6782;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf2ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #ebf7ef);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1e3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efecfc);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3f8e9);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fceef3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf7ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6f2e9);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-1 .status-option-content {\n  color: #2d63a9;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-2 .status-option-content {\n  color: #2a7a49;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-3 .status-option-content {\n  color: #9b6018;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-4 .status-option-content {\n  color: #6153a2;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-5 .status-option-content {\n  color: #61812a;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-6 .status-option-content {\n  color: #9f446d;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-7 .status-option-content {\n  color: #2e7898;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-8 .status-option-content {\n  color: #806c3f;\n}\n.mobile-profile-selector-option.detail-tone-1[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef5ff 0%,\n      #e3eefc 100%);\n  border-color: rgba(46, 102, 181, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-2[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef9f3 0%,\n      #e3f4ea 100%);\n  border-color: rgba(40, 125, 72, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-3[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ea 0%,\n      #ffecdd 100%);\n  border-color: rgba(165, 94, 24, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-4[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f1ff 0%,\n      #e8e5fb 100%);\n  border-color: rgba(97, 82, 164, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-5[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f9ef 0%,\n      #edf3e1 100%);\n  border-color: rgba(95, 128, 36, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-6[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #f9e6ed 100%);\n  border-color: rgba(160, 70, 111, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-7[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ff 0%,\n      #e2f0fb 100%);\n  border-color: rgba(45, 122, 160, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-8[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f3ea 0%,\n      #eee9dc 100%);\n  border-color: rgba(128, 109, 66, 0.32);\n}\n.mobile-profile-selector-option.status-public[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e6f6ef 0%,\n      #d9f0e6 100%);\n  border-color: rgba(47, 143, 102, 0.34);\n}\n.mobile-profile-selector-option.status-friends[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f1fd 0%,\n      #dfeaf9 100%);\n  border-color: rgba(27, 87, 161, 0.34);\n}\n.mobile-profile-selector-option.status-host[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe2 0%,\n      #eee4d2 100%);\n  border-color: rgba(135, 88, 15, 0.36);\n}\n.mobile-profile-selector-option.status-inactive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3f5 0%,\n      #e8ebef 100%);\n  border-color: rgba(91, 101, 115, 0.32);\n}\n.mobile-profile-selector-option.physique-slim[_ngcontent-%COMP%] {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.mobile-profile-selector-option.physique-lean[_ngcontent-%COMP%] {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n}\n.mobile-profile-selector-option.physique-athletic[_ngcontent-%COMP%] {\n  background: #e8f5ec;\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.mobile-profile-selector-option.physique-fit[_ngcontent-%COMP%] {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.mobile-profile-selector-option.physique-curvy[_ngcontent-%COMP%] {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n}\n.mobile-profile-selector-option.physique-muscular[_ngcontent-%COMP%] {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n}\n.mobile-profile-selector-option.physique-average[_ngcontent-%COMP%] {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .values-selector-popup.profile-selector-popup[_ngcontent-%COMP%] {\n  gap: 0.56rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.44rem;\n  padding-bottom: 0.22rem;\n  border-bottom: 1px solid rgba(74, 102, 139, 0.22);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-head-label[_ngcontent-%COMP%] {\n  color: #203c64;\n  font-size: 0.82rem;\n  font-weight: 800;\n  line-height: 1.2;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-clear[_ngcontent-%COMP%] {\n  border: 1px solid rgba(41, 73, 110, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.82);\n  color: #284970;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.3rem 0.52rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-clear.is-hidden[_ngcontent-%COMP%] {\n  visibility: hidden;\n  pointer-events: none;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-selected[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(35, 68, 107, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.92);\n  color: #234368;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.26rem 0.48rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.16rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-empty[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.74rem;\n  color: rgba(31, 54, 86, 0.62);\n  font-style: italic;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.34rem;\n  border: 1px solid transparent;\n  border-radius: 12px;\n  padding: 0.4rem 0.42rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-head[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag[_ngcontent-%COMP%] {\n  border-radius: 999px;\n  border: 1px solid rgba(52, 86, 128, 0.28);\n  background: rgba(255, 255, 255, 0.74);\n  color: #2f527d;\n  font-size: 0.67rem;\n  font-weight: 800;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.2rem 0.52rem;\n  text-transform: uppercase;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 1px;\n  background: rgba(84, 111, 147, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip-grid[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.36rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(41, 70, 106, 0.22);\n  border-radius: 999px;\n  background: #f4f8ff;\n  color: #234066;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 700;\n  padding: 0.3rem 0.58rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  cursor: pointer;\n  transition:\n    background-color 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip.active[_ngcontent-%COMP%] {\n  border-color: rgba(27, 85, 158, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #dcebff 0%,\n      #cfe3ff 100%);\n  color: #123e70;\n  box-shadow: inset 0 0 0 1px rgba(30, 73, 127, 0.24), 0 1px 2px rgba(24, 53, 86, 0.16);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-family[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 232, 219, 0.52) 0%,\n      rgba(255, 232, 219, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-ambition[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 242, 216, 0.52) 0%,\n      rgba(255, 242, 216, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-lifestyle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(221, 241, 239, 0.56) 0%,\n      rgba(221, 241, 239, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-beliefs[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-social[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(223, 236, 255, 0.5) 0%,\n      rgba(223, 236, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-arts[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(235, 227, 255, 0.5) 0%,\n      rgba(235, 227, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-food[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 236, 221, 0.52) 0%,\n      rgba(255, 236, 221, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(222, 243, 231, 0.56) 0%,\n      rgba(222, 243, 231, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-mind[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(219, 242, 238, 0.56) 0%,\n      rgba(219, 242, 238, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-identity[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-family[_ngcontent-%COMP%] {\n  border-color: rgba(156, 94, 51, 0.34);\n  color: #9c5e33;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-ambition[_ngcontent-%COMP%] {\n  border-color: rgba(160, 106, 20, 0.34);\n  color: #9b6717;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-lifestyle[_ngcontent-%COMP%] {\n  border-color: rgba(47, 123, 119, 0.34);\n  color: #2f7b77;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-beliefs[_ngcontent-%COMP%] {\n  border-color: rgba(95, 78, 160, 0.34);\n  color: #5f4ea0;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-social[_ngcontent-%COMP%] {\n  border-color: rgba(47, 106, 175, 0.36);\n  color: #2f6aaf;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-arts[_ngcontent-%COMP%] {\n  border-color: rgba(106, 87, 168, 0.36);\n  color: #6a57a8;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-food[_ngcontent-%COMP%] {\n  border-color: rgba(170, 97, 28, 0.34);\n  color: #a55e18;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-active[_ngcontent-%COMP%] {\n  border-color: rgba(49, 124, 82, 0.36);\n  color: #317c52;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-mind[_ngcontent-%COMP%] {\n  border-color: rgba(37, 124, 118, 0.34);\n  color: #2b7c76;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-identity[_ngcontent-%COMP%] {\n  border-color: rgba(98, 84, 163, 0.34);\n  color: #6254a3;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-family[_ngcontent-%COMP%] {\n  background: rgba(156, 94, 51, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-ambition[_ngcontent-%COMP%] {\n  background: rgba(160, 106, 20, 0.32);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-lifestyle[_ngcontent-%COMP%] {\n  background: rgba(47, 123, 119, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-beliefs[_ngcontent-%COMP%] {\n  background: rgba(95, 78, 160, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-social[_ngcontent-%COMP%] {\n  background: rgba(47, 106, 175, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-arts[_ngcontent-%COMP%] {\n  background: rgba(106, 87, 168, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-food[_ngcontent-%COMP%] {\n  background: rgba(170, 97, 28, 0.32);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-active[_ngcontent-%COMP%] {\n  background: rgba(49, 124, 82, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-mind[_ngcontent-%COMP%] {\n  background: rgba(37, 124, 118, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-identity[_ngcontent-%COMP%] {\n  background: rgba(98, 84, 163, 0.3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.status-option) {\n  background: #f0f5fc;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.mdc-list-item--selected:not(.mdc-list-item--disabled) {\n  filter: brightness(0.95);\n  box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.2);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option {\n  background: #fff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option:not(:last-child) {\n  border-bottom: 1px solid #e6edf7;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.hide-selected-option, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.hide-selected-option {\n  min-height: 0 !important;\n  height: 0 !important;\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  border: 0 !important;\n  margin: 0 !important;\n  opacity: 0 !important;\n  pointer-events: none !important;\n  overflow: hidden !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option {\n  background: #fff;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel {\n  margin-top: 8px !important;\n  margin-bottom: 8px !important;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .cdk-overlay-pane .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .cdk-overlay-pane .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above {\n  margin-top: 0 !important;\n  margin-bottom: 18px !important;\n  transform: translateY(-10px) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public {\n  --mdc-list-list-item-container-color: #def3e9;\n  --mat-mdc-option-selected-container-color: #def3e9;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #def3e9) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends {\n  --mdc-list-list-item-container-color: #e3eefb;\n  --mat-mdc-option-selected-container-color: #e3eefb;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e3eefb) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host {\n  --mdc-list-list-item-container-color: #f3ead8;\n  --mat-mdc-option-selected-container-color: #f3ead8;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3ead8) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive {\n  --mdc-list-list-item-container-color: #eceff3;\n  --mat-mdc-option-selected-container-color: #eceff3;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eceff3) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon {\n  color: #2f8f66 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon {\n  color: #1b57a1 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon {\n  color: #87580f !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon {\n  color: #5b6573 !important;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-slim {\n  background: #eaf4ff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-lean {\n  background: #edf8f4;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-athletic {\n  background: #e8f5ec;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-fit {\n  background: #f1f2ff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-curvy {\n  background: #fff2f8;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-muscular {\n  background: #fbf4ea;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-average {\n  background: #eff4f9;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-slim .status-option-content {\n  color: #3f7ab3;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-lean .status-option-content {\n  color: #3f8f5f;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-athletic .status-option-content {\n  color: #2f7e4d;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-fit .status-option-content {\n  color: #465fbb;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-curvy .status-option-content {\n  color: #a14875;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-muscular .status-option-content {\n  color: #7d4f24;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-average .status-option-content {\n  color: #4d667f;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.physique-options-panel {\n  width: auto !important;\n  max-width: 220px !important;\n  min-width: 0 !important;\n}\n[_nghost-%COMP%]     .physique-options-panel .mat-mdc-option {\n  padding-right: 8px;\n}\n[_nghost-%COMP%]     .physique-options-panel .mat-mdc-option .mat-pseudo-checkbox {\n  margin-left: 4px;\n}\n@media (max-width: 760px) {\n  .experience-form-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    max-width: none;\n    justify-content: stretch;\n    row-gap: 0.72rem;\n  }\n  .experience-date-range-label[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n  }\n  .experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-container[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);\n  }\n  .profile-details-privacy-fab[_ngcontent-%COMP%]   .privacy-fab-actions[_ngcontent-%COMP%] {\n    position: fixed;\n    left: 0.5rem;\n    right: 0.5rem;\n    bottom: max(0.5rem, env(safe-area-inset-bottom));\n    top: auto;\n    transform: translateY(12px) scale(0.98);\n    transform-origin: bottom center;\n    justify-content: center;\n    gap: 0.46rem;\n    padding: 0.46rem 0.56rem;\n    border: 1px solid rgba(42, 68, 102, 0.2);\n    border-radius: 14px;\n    background: #fff;\n    box-shadow: 0 -12px 24px rgba(18, 31, 51, 0.22);\n  }\n  .profile-details-privacy-fab.open[_ngcontent-%COMP%]   .privacy-fab-actions[_ngcontent-%COMP%] {\n    transform: translateY(0) scale(1);\n  }\n}\n[_nghost-%COMP%] {\n  display: contents;\n}\n.event-explore-popup[_ngcontent-%COMP%] {\n  position: relative;\n  height: 100%;\n  min-height: 0;\n  display: flex;\n  flex-direction: column;\n}\n.event-explore-basket-menu[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 0.75rem;\n  bottom: 0.9rem;\n  z-index: 18;\n  display: inline-flex;\n  --app-menu-panel-gap: 0.6rem;\n}\n.event-explore-sticky-header[_ngcontent-%COMP%] {\n  z-index: 26;\n  margin-bottom: 0;\n  box-shadow: 0 0.34rem 0 rgba(255, 255, 255, 0.98);\n}\n@media (max-width: 760px) {\n  .event-explore-basket-menu[_ngcontent-%COMP%] {\n    right: 0.55rem;\n    bottom: 0.7rem;\n  }\n}\n/*# sourceMappingURL=event-explore-popup.component.css.map */'], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EventExplorePopupComponent, [{
    type: Component,
    args: [{ selector: "app-event-explore-popup", standalone: true, imports: [
      CommonModule,
      MatIconModule,
      AppMenuComponent,
      AppMenuOutletComponent,
      InfoCardComponent,
      PopupComponent,
      SmartListComponent
    ], providers: [AppMenuDispatcher], changeDetection: ChangeDetectionStrategy.OnPush, template: `@if (isOpen) {
  <app-popup [model]="eventExplorePopupModel()" [zIndex]="eventExplorePopupZIndex()">
    <div class="event-explore-popup">
      <app-smart-list
        #eventExploreSmartList
        [config]="eventExploreSmartListConfig"
        [loadPage]="eventExploreLoadPage"
        [itemTemplate]="eventExploreItemTemplateRef ?? null"
        [query]="eventExploreSmartListQuery"
        (stateChange)="onEventExploreSmartListStateChange($event)"
      ></app-smart-list>
      @if (checkoutDraftCount() > 0) {
        <app-menu
          class="event-explore-basket-menu"
          kind="fab"
          title="Basket"
          [trigger]="checkoutDraftMenuTrigger()"
          [items]="checkoutDraftMenuItems()"
          [panelAlign]="'end'"
          [mobileBreakpointPx]="900"
          (itemSelect)="onEventExploreMenuSelect($event)"
        ></app-menu>
      }
      <ng-template #eventExploreItemTemplate let-record let-groupLabel="groupLabel">
        <app-info-card
          [card]="eventExploreInfoCard(record, groupLabel)"
          [useSharedMenu]="true"
          (mediaStartClick)="openHostImpressions(record)"
          (mediaEndClick)="openEventExploreMembers(record)"
          (menuAction)="onEventExploreCardMenuAction(record, $event)"
          (menuRequest)="openEventExploreInfoCardMenu(record, $event)"
        ></app-info-card>
      </ng-template>
    </div>
    <app-menu-outlet
      (itemSelect)="onEventExploreMenuSelect($event)"
    ></app-menu-outlet>
  </app-popup>

  @if (eventSubeventsStore.eventSubeventsListPopup()?.host === 'eventExplore') {
    @if (eventSubeventsStore.eventSubeventsListPopupComponent(); as subeventsPopupComponent) {
      <ng-container *ngComponentOutlet="subeventsPopupComponent"></ng-container>
    }
  }
}
`, styles: ['/* src/app/activity/components/event-explore-popup/event-explore-popup.component.scss */\n:host {\n  --interactive-motion-duration: 160ms;\n  --interactive-motion-ease: cubic-bezier(0.22, 1, 0.36, 1);\n  --interactive-hover-lift: -1px;\n  --interactive-hover-scale: 1.01;\n  --interactive-hover-brightness: 1.01;\n  --interactive-press-scale: 0.97;\n  --interactive-press-brightness: 0.97;\n}\n:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]) {\n  -webkit-tap-highlight-color: transparent;\n  transition:\n    transform var(--interactive-motion-duration) var(--interactive-motion-ease),\n    filter var(--interactive-motion-duration) var(--interactive-motion-ease),\n    box-shadow var(--interactive-motion-duration) var(--interactive-motion-ease),\n    background-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    border-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    color var(--interactive-motion-duration) var(--interactive-motion-ease);\n  transform-origin: center;\n}\n:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):focus-visible {\n  outline: 2px solid rgba(66, 110, 182, 0.44);\n  outline-offset: 2px;\n}\n@media (hover: hover) and (pointer: fine) {\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):hover {\n    transform: translateY(var(--interactive-hover-lift)) scale(var(--interactive-hover-scale));\n    filter: brightness(var(--interactive-hover-brightness));\n  }\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  :where(.motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):hover {\n    box-shadow: 0 3px 10px rgba(16, 29, 48, 0.14);\n  }\n}\n@keyframes shared-mobile-touch-feedback {\n  0% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n  45% {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  100% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n}\n@media (hover: none), (pointer: coarse) {\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    animation: shared-mobile-touch-feedback 0.2s ease;\n  }\n}\n.app-popup,\n.mobile-profile-selector-sheet-wrap,\n.popup-surface,\n.experience-form-popup {\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.app-popup button,\n.app-popup input,\n.app-popup textarea,\n.app-popup select,\n.app-popup .mat-mdc-select,\n.app-popup .mat-mdc-select-value-text,\n.app-popup .mat-mdc-option,\n.popup-surface button,\n.popup-surface input,\n.popup-surface textarea,\n.popup-surface select,\n.popup-surface .mat-mdc-select,\n.popup-surface .mat-mdc-select-value-text,\n.popup-surface .mat-mdc-option,\n.experience-form-popup button,\n.experience-form-popup input,\n.experience-form-popup textarea,\n.experience-form-popup select,\n.experience-form-popup .mat-mdc-select,\n.experience-form-popup .mat-mdc-select-value-text,\n.experience-form-popup .mat-mdc-option,\n.mobile-profile-selector-sheet-wrap button,\n.mobile-profile-selector-sheet-wrap input,\n.mobile-profile-selector-sheet-wrap .mat-mdc-option {\n  font-family: inherit;\n}\n.popup-filter-picker,\n.activities-view-picker {\n  position: relative;\n  z-index: 60;\n  margin-left: auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-filter-picker-secondary,\n.activities-secondary-picker {\n  position: relative;\n  z-index: 61;\n}\n.selector-like {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n}\n.profile-status-select-wrap.popup-compact-select,\n.profile-status-select-wrap.activities-compact-select,\n.profile-status-select-wrap.assets-compact-select {\n  width: fit-content !important;\n  min-width: 0 !important;\n  max-width: 100%;\n}\n.profile-status-select-wrap.popup-compact-select .mat-mdc-select,\n.profile-status-select-wrap.activities-compact-select .mat-mdc-select,\n.profile-status-select-wrap.assets-compact-select .mat-mdc-select {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select .mat-mdc-select-trigger,\n.profile-status-select-wrap.activities-compact-select .mat-mdc-select-trigger,\n.profile-status-select-wrap.assets-compact-select .mat-mdc-select-trigger {\n  width: auto !important;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select .status-option-content,\n.profile-status-select-wrap.activities-compact-select .status-option-content,\n.profile-status-select-wrap.assets-compact-select .status-option-content {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge,\n.profile-status-select-wrap.activities-filter-no-badge {\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge .status-option-content,\n.profile-status-select-wrap.activities-filter-no-badge .status-option-content {\n  width: auto !important;\n  flex: 0 1 auto;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select-trigger,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select-trigger {\n  width: auto !important;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select-arrow-wrapper,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select-arrow-wrapper {\n  margin-left: 0.28rem;\n}\n.profile-status-select-wrap {\n  min-width: 174px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  border: 1px solid #c8d3e2;\n  border-radius: 999px;\n  box-shadow: 0 2px 6px rgba(38, 60, 92, 0.08);\n  padding: 0.12rem 0.5rem 0.12rem 0.84rem;\n  background: #f8f9fb;\n}\n.profile-status-select-wrap.selector-like {\n  min-height: 36px;\n}\n.status-option-content {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.2rem;\n  text-transform: lowercase;\n  width: 100%;\n  min-width: 0;\n}\n.status-option-content span:last-child {\n  white-space: nowrap;\n}\n.status-option-content .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  flex: 0 0 16px;\n}\n.rate-filter-count-badge {\n  margin-left: auto;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  border: 1px solid #fff;\n  background: #d84d4d;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  font-size: 0.68rem;\n  font-weight: 800;\n  line-height: 1;\n  box-shadow: 0 2px 8px rgba(120, 24, 24, 0.22);\n}\n.rate-filter-trigger-badge {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  margin-left: 0;\n  z-index: 2;\n}\n.popup-filter-control,\n.activities-rate-filter-select,\n.activities-primary-filter-select,\n.activities-event-scope-filter-select,\n.activities-chat-context-filter-select {\n  position: relative;\n  overflow: visible;\n}\n.popup-filter-panel,\n.activities-view-picker-panel {\n  position: absolute;\n  top: calc(100% + 0.32rem);\n  right: 0;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 10px;\n  background: #fff;\n  box-shadow: 0 10px 24px rgba(17, 29, 48, 0.22);\n  padding: 0.24rem;\n  min-width: 128px;\n  z-index: 40;\n  display: grid;\n  gap: 0.16rem;\n}\n.popup-filter-option,\n.activities-view-option {\n  border: 0;\n  background: #fff;\n  border-radius: 8px;\n  min-height: 32px;\n  padding: 0.34rem 0.44rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.34rem;\n  color: #1e3658;\n  cursor: pointer;\n  text-align: left;\n}\n.popup-filter-option .mat-icon,\n.activities-view-option .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-filter-option span,\n.activities-view-option span {\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.popup-filter-option > span:not(.rate-filter-count-badge),\n.activities-view-option > span:not(.rate-filter-count-badge) {\n  flex: 1 1 auto;\n  min-width: 0;\n  text-align: left;\n}\n.popup-mobile-filter-picker,\n.activities-mobile-primary-filter-picker,\n.activities-mobile-event-scope-filter-picker,\n.activities-mobile-chat-context-filter-picker,\n.activities-mobile-rate-filter-picker {\n  position: relative;\n}\n.popup-mobile-filter-panel,\n.activities-mobile-filter-panel,\n.activities-mobile-rate-filter-panel {\n  top: calc(100% + 0.24rem);\n  right: 0;\n  min-width: 210px;\n  z-index: 65;\n}\n.popup-mobile-sheet-title,\n.activities-mobile-sheet-title {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  padding: 0 0.14rem;\n  color: #1c3354;\n  font-size: 0.94rem;\n  font-weight: 800;\n}\n.popup-mobile-sheet-title .mat-icon,\n.activities-mobile-sheet-title .mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .popup-view-fab span,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .mat-mdc-select,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .status-option-content span:last-child,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .mat-mdc-select-value-text {\n  font-weight: 400 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option .status-option-content {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  width: 100%;\n  min-width: 0;\n  column-gap: 0.34rem;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option .rate-filter-count-badge {\n  margin-left: 0;\n  justify-self: end;\n}\n:host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.selector-options-panel),\n:host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.status-options-panel) {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n@media (max-width: 760px) {\n  .popup-mobile-filter-panel .popup-filter-option,\n  .popup-mobile-filter-panel .activities-view-option,\n  .activities-mobile-filter-panel .popup-filter-option,\n  .activities-mobile-filter-panel .activities-view-option,\n  .activities-mobile-rate-filter-panel .popup-filter-option,\n  .activities-mobile-rate-filter-panel .activities-view-option {\n    width: 100%;\n    min-width: 0;\n    box-sizing: border-box;\n    border: 1px solid rgba(58, 81, 114, 0.24);\n    border-radius: 12px;\n    background: #f7f9fd;\n    min-height: 42px;\n    padding: 0.46rem 0.62rem;\n    justify-content: flex-start;\n    gap: 0.36rem;\n  }\n  .popup-mobile-filter-panel .popup-filter-option.active,\n  .popup-mobile-filter-panel .activities-view-option.active,\n  .activities-mobile-filter-panel .popup-filter-option.active,\n  .activities-mobile-filter-panel .activities-view-option.active,\n  .activities-mobile-rate-filter-panel .popup-filter-option.active,\n  .activities-mobile-rate-filter-panel .activities-view-option.active {\n    box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.24);\n    filter: brightness(0.95);\n  }\n  .popup-mobile-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .popup-mobile-filter-panel .activities-view-option .rate-filter-count-badge,\n  .activities-mobile-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .activities-mobile-filter-panel .activities-view-option .rate-filter-count-badge,\n  .activities-mobile-rate-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .activities-mobile-rate-filter-panel .activities-view-option .rate-filter-count-badge {\n    margin-left: auto;\n    flex: 0 0 auto;\n  }\n  :host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.profile-bottom-sheet-panel) {\n    position: fixed !important;\n    left: 0 !important;\n    right: 0 !important;\n    bottom: 0 !important;\n    top: auto !important;\n    width: 100vw !important;\n    max-width: 100vw !important;\n    transform: none !important;\n  }\n  :host ::ng-deep .mat-mdc-select-panel.profile-bottom-sheet-panel {\n    width: 100vw !important;\n    max-width: 100vw !important;\n    max-height: min(54vh, 420px) !important;\n    margin: 0 !important;\n    border-radius: 16px 16px 0 0 !important;\n    border: 1px solid #d6deea;\n    border-bottom: 0;\n    box-shadow: 0 -14px 28px rgba(15, 29, 52, 0.24);\n    padding-top: 0.38rem;\n    padding-bottom: max(0.55rem, env(safe-area-inset-bottom));\n  }\n}\n.popup-view-fab {\n  height: 34px;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 999px;\n  background: #f3f7ff;\n  color: #2c4c74;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0 0.62rem;\n  cursor: pointer;\n}\n.popup-view-fab .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-view-fab span {\n  font-size: 0.74rem;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.event-visibility-picker {\n  position: relative;\n  z-index: 22;\n  margin-left: auto;\n  flex: 0 0 auto;\n}\n.event-visibility-trigger {\n  flex-wrap: nowrap;\n}\n.profile-status-header-picker .event-visibility-trigger.status-public,\n.profile-status-header-picker .activities-view-option.status-public {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e6f6ef);\n}\n.profile-status-header-picker .event-visibility-trigger.status-friends,\n.profile-status-header-picker .activities-view-option.status-friends {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e8f1fd);\n}\n.profile-status-header-picker .event-visibility-trigger.status-host,\n.profile-status-header-picker .activities-view-option.status-host {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6efe2);\n}\n.profile-status-header-picker .event-visibility-trigger.status-inactive,\n.profile-status-header-picker .activities-view-option.status-inactive {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f2f3f5);\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-public,\n.profile-status-header-picker .activities-view-option.status-public .mat-icon {\n  color: #2f8f66;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-friends,\n.profile-status-header-picker .activities-view-option.status-friends .mat-icon {\n  color: #1b57a1;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-host,\n.profile-status-header-picker .activities-view-option.status-host .mat-icon {\n  color: #87580f;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-inactive,\n.profile-status-header-picker .activities-view-option.status-inactive .mat-icon {\n  color: #5b6573;\n}\n.app-popup textarea,\n.app-popup input,\n.app-popup select,\n.popup-surface textarea,\n.popup-surface input,\n.popup-surface select,\n.experience-form-popup textarea,\n.experience-form-popup input,\n.experience-form-popup select,\n.mobile-profile-selector-sheet-wrap input {\n  width: 100%;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.48rem 0.56rem;\n  font: inherit;\n  color: var(--text-main);\n  background: #fff;\n}\n.app-popup textarea,\n.popup-surface textarea,\n.experience-form-popup textarea {\n  resize: vertical;\n}\n.app-popup textarea:focus,\n.app-popup input:focus,\n.app-popup select:focus,\n.popup-surface textarea:focus,\n.popup-surface input:focus,\n.popup-surface select:focus,\n.experience-form-popup textarea:focus,\n.experience-form-popup input:focus,\n.experience-form-popup select:focus,\n.mobile-profile-selector-sheet-wrap input:focus {\n  outline: 0;\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n}\n.popup-surface-form-grid,\n.experience-form-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  max-width: none;\n  width: 100%;\n  margin: 0;\n  justify-content: stretch;\n  align-content: start;\n  align-items: start;\n  column-gap: 1rem;\n  row-gap: 0.9rem;\n}\n.popup-surface-form-grid label,\n.experience-form-grid label {\n  display: grid;\n  grid-template-rows: min-content;\n  gap: 0;\n  font-weight: 600;\n  color: rgba(26, 44, 69, 0.88);\n}\n.popup-surface-form-grid input,\n.experience-form-grid input {\n  min-height: 40px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid textarea,\n.experience-form-grid textarea {\n  min-height: 96px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid .profile-status-select-wrap.selector-like,\n.experience-form-grid .profile-status-select-wrap.selector-like {\n  min-height: 40px;\n  height: 40px;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid .mat-mdc-select-trigger,\n.experience-form-grid .mat-mdc-select-trigger {\n  min-height: 32px;\n}\n.popup-surface-description-field,\n.experience-description-field {\n  grid-column: 1/-1;\n}\n.popup-surface-actions,\n.experience-form-actions {\n  justify-content: center;\n  padding-top: 0.2rem;\n}\n.popup-actions {\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.link-btn {\n  border: 1px solid var(--line-strong);\n  border-radius: 999px;\n  background: #fff;\n  color: #1f3350;\n  font: inherit;\n  font-size: 0.83rem;\n  padding: 0.38rem 0.76rem;\n  cursor: pointer;\n}\n.neutral-btn {\n  background: #f2f4fa;\n  border-color: rgba(23, 33, 54, 0.12);\n}\n.primary-btn {\n  background: #4776b7;\n  border-color: #4776b7;\n  color: #fff;\n}\n.profile-status-select-wrap .mat-icon,\n.date-picker-btn .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: #566b86;\n}\n.profile-status-select-wrap .mat-mdc-select {\n  min-width: 80px;\n  width: 100%;\n  font-size: 0.8rem;\n  font-weight: 700;\n  text-transform: lowercase;\n}\n.profile-status-select-wrap .mat-mdc-select-trigger {\n  width: 100%;\n  justify-content: flex-start;\n}\n.profile-status-select-wrap .mat-mdc-select-arrow-wrapper {\n  margin-left: auto;\n}\n.status-public {\n  color: #2f8f66;\n}\n.status-friends {\n  color: #1b57a1;\n}\n.status-host {\n  color: #87580f;\n}\n.status-inactive {\n  color: #5b6573;\n}\n.status-option-content .status-public {\n  color: #2f8f66;\n}\n.status-option-content .status-friends {\n  color: #1b57a1;\n}\n.status-option-content .status-host {\n  color: #87580f;\n}\n.status-option-content .status-inactive {\n  color: #5b6573;\n}\n.profile-status-select-wrap.status-public .status-option-content .mat-icon {\n  color: #2f8f66;\n}\n.profile-status-select-wrap.status-friends .status-option-content .mat-icon {\n  color: #1b57a1;\n}\n.profile-status-select-wrap.status-host .status-option-content .mat-icon {\n  color: #87580f;\n}\n.profile-status-select-wrap.status-inactive .status-option-content .mat-icon {\n  color: #5b6573;\n}\n.profile-details-values-btn .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: rgba(44, 67, 100, 0.72);\n}\n.profile-details-values-btn {\n  min-height: 36px;\n  height: 36px;\n  box-sizing: border-box;\n  padding-top: 0;\n  padding-bottom: 0;\n}\n.profile-details-values-btn .status-option-content.profile-details-selected-badges {\n  display: inline-grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  column-gap: 0.26rem;\n  min-width: 0;\n  width: 100%;\n}\n.profile-details-values-btn.profile-details-values-tone-values .profile-details-inline-chip {\n  max-width: calc(100% - 2.6rem);\n}\n.profile-details-values-btn.profile-details-values-tone-interest .profile-details-inline-chip {\n  max-width: calc((100% - 3.2rem) / 2);\n}\n.profile-details-values-btn.profile-details-values-tone-values .profile-details-inline-overflow {\n  color: #1e6b5a;\n}\n.profile-details-values-btn.profile-details-values-tone-interest .profile-details-inline-overflow {\n  color: #2e5a90;\n}\n.values-header-chips {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.28rem;\n  flex: 0 0 100%;\n  margin-left: 0;\n  margin-top: 0.34rem;\n  max-width: 100%;\n  overflow: visible;\n  white-space: normal;\n  padding-bottom: 0;\n}\n.popup-title-values {\n  margin-right: 0.38rem;\n}\n.values-selected-chip {\n  border: 1px solid rgba(76, 99, 136, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9ff 0%,\n      #eef3ff 100%);\n  color: #24416a;\n  border-radius: 999px;\n  min-height: 26px;\n  padding: 0.18rem 0.46rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-size: 0.7rem;\n  font-weight: 700;\n  cursor: pointer;\n  flex: 0 0 auto;\n}\n.values-selected-chip .mat-icon {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.values-selected-chip.section-family {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1ea 0%,\n      #ffe6dd 100%);\n  border-color: rgba(160, 90, 51, 0.32);\n  color: #8b4d2b;\n}\n.values-selected-chip.section-ambition {\n  background:\n    linear-gradient(\n      180deg,\n      #fff7e8 0%,\n      #ffefd7 100%);\n  border-color: rgba(160, 106, 20, 0.32);\n  color: #9a6614;\n}\n.values-selected-chip.section-lifestyle {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f5 0%,\n      #e0f2ee 100%);\n  border-color: rgba(45, 125, 120, 0.32);\n  color: #2a6e6a;\n}\n.values-selected-chip.section-beliefs {\n  background:\n    linear-gradient(\n      180deg,\n      #f0ecff 0%,\n      #e8e1fa 100%);\n  border-color: rgba(95, 78, 160, 0.32);\n  color: #564793;\n}\n.values-selected-chip.section-social {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n  color: #2d5ea8;\n}\n.values-selected-chip.section-arts {\n  background:\n    linear-gradient(\n      180deg,\n      #f2edfb 0%,\n      #e9e2f9 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n  color: #654ca1;\n}\n.values-selected-chip.section-food {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4e8 0%,\n      #fee9d6 100%);\n  border-color: rgba(170, 97, 28, 0.32);\n  color: #9d611c;\n}\n.values-selected-chip.section-active {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.values-selected-chip.section-mind {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f6 0%,\n      #def1ee 100%);\n  border-color: rgba(37, 124, 118, 0.32);\n  color: #2d7d78;\n}\n.values-selected-chip.section-identity {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n  border-color: rgba(88, 78, 159, 0.32);\n  color: #5a4ea0;\n}\n.readonly-select {\n  width: fit-content;\n  min-width: 0;\n  max-width: 130px;\n  justify-content: center;\n  margin-top: 2px;\n  padding-left: 0.44rem;\n  padding-right: 0.44rem;\n}\n.readonly-field {\n  min-height: 34px;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.4rem 0.56rem;\n  background: #f7fafe;\n  color: #23476f;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-weight: 700;\n}\n.readonly-field .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.zodiac-symbol {\n  font-size: 1.1rem;\n  font-weight: 800;\n  line-height: 1;\n}\n.zodiac-label {\n  font-size: 0.9rem;\n  font-weight: 700;\n  min-width: 0;\n  text-align: center;\n}\n.readonly-select.zodiac-aries {\n  background: #fdf1f1;\n  color: #9f2f2f;\n}\n.readonly-select.zodiac-taurus {\n  background: #f7f3eb;\n  color: #6e4b2b;\n}\n.readonly-select.zodiac-gemini {\n  background: #fdf8e9;\n  color: #7d5a12;\n}\n.readonly-select.zodiac-cancer {\n  background: #eef4ff;\n  color: #2d5b8e;\n}\n.readonly-select.zodiac-leo {\n  background: #fff3e8;\n  color: #8f4b0d;\n}\n.readonly-select.zodiac-virgo {\n  background: #edf8ef;\n  color: #2b6b3d;\n}\n.readonly-select.zodiac-libra {\n  background: #f2eefc;\n  color: #60439d;\n}\n.readonly-select.zodiac-scorpio {\n  background: #f9edf2;\n  color: #7b3150;\n}\n.readonly-select.zodiac-sagittarius {\n  background: #eef1ff;\n  color: #2f4a9a;\n}\n.readonly-select.zodiac-capricorn {\n  background: #eff2f5;\n  color: #364653;\n}\n.readonly-select.zodiac-aquarius {\n  background: #ebf7fb;\n  color: #1d5f7a;\n}\n.readonly-select.zodiac-pisces {\n  background: #eef2ff;\n  color: #294b8f;\n}\n.physique-slim {\n  color: #3f7ab3;\n}\n.physique-lean {\n  color: #3f8f5f;\n}\n.physique-athletic {\n  color: #2f7e4d;\n}\n.physique-fit {\n  color: #465fbb;\n}\n.physique-curvy {\n  color: #a14875;\n}\n.physique-muscular {\n  color: #7d4f24;\n}\n.physique-average {\n  color: #4d667f;\n}\n.physique-select-wrap.physique-slim {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf3fb 0%,\n      #dfebf8 100%);\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.physique-select-wrap.physique-lean {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf6ee 0%,\n      #def0e5 100%);\n  border-color: rgba(63, 143, 95, 0.34);\n}\n.physique-select-wrap.physique-athletic {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f5ec 0%,\n      #dff0e6 100%);\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.physique-select-wrap.physique-fit {\n  background:\n    linear-gradient(\n      180deg,\n      #ebf0ff 0%,\n      #e1e8fc 100%);\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.physique-select-wrap.physique-curvy {\n  background:\n    linear-gradient(\n      180deg,\n      #f7edf3 0%,\n      #f0e3ec 100%);\n  border-color: rgba(161, 72, 117, 0.36);\n}\n.physique-select-wrap.physique-muscular {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe9 0%,\n      #ede3d8 100%);\n  border-color: rgba(125, 79, 36, 0.36);\n}\n.physique-select-wrap.physique-average {\n  background:\n    linear-gradient(\n      180deg,\n      #eef2f6 0%,\n      #e5ebf1 100%);\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.physique-select-wrap.physique-slim .status-option-content .mat-icon {\n  color: #3f7ab3;\n}\n.physique-select-wrap.physique-lean .status-option-content .mat-icon {\n  color: #3f8f5f;\n}\n.physique-select-wrap.physique-athletic .status-option-content .mat-icon {\n  color: #2f7e4d;\n}\n.physique-select-wrap.physique-fit .status-option-content .mat-icon {\n  color: #465fbb;\n}\n.physique-select-wrap.physique-curvy .status-option-content .mat-icon {\n  color: #a14875;\n}\n.physique-select-wrap.physique-muscular .status-option-content .mat-icon {\n  color: #7d4f24;\n}\n.physique-select-wrap.physique-average .status-option-content .mat-icon {\n  color: #4d667f;\n}\n.experience-filter-all {\n  color: #694ea6;\n}\n.experience-filter-workspace {\n  color: #a1485a;\n}\n.experience-filter-school {\n  color: #2d5ea8;\n}\n.experience-filter-online {\n  color: #2d7d47;\n}\n.experience-filter-project {\n  color: #6550a0;\n}\n.experience-filter-select.experience-filter-all,\n.experience-type-select.experience-filter-project {\n  background:\n    linear-gradient(\n      180deg,\n      #efe8ff 0%,\n      #e8defc 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n}\n.experience-filter-select.experience-filter-workspace,\n.experience-type-select.experience-filter-workspace {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f3 0%,\n      #ffe6ea 100%);\n  border-color: rgba(169, 72, 90, 0.32);\n}\n.experience-filter-select.experience-filter-school,\n.experience-type-select.experience-filter-school {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n}\n.experience-type-select.experience-filter-online {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n}\n.experience-type-select.experience-filter-project {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n}\n.experience-type-select {\n  min-width: 0;\n  max-width: 100%;\n  min-height: 40px;\n}\n.experience-type-field,\n.experience-title-field,\n.experience-city-field {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-org-field {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-type-select {\n  width: 100%;\n}\n.experience-date-range-field {\n  width: 100%;\n  max-width: none;\n  margin: 0;\n  background: transparent;\n}\n.experience-date-range-label {\n  grid-column: 1/2;\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-date-range-field .mat-mdc-text-field-wrapper {\n  min-height: 42px;\n  border-radius: 10px;\n  background: #fff;\n  border: 1px solid rgba(136, 156, 186, 0.5);\n  box-shadow: none;\n}\n.experience-date-range-field .mat-mdc-form-field-subscript-wrapper {\n  margin-top: 0.24rem;\n}\n.experience-date-range-field input {\n  border: 0 !important;\n  box-shadow: none !important;\n  border-radius: 0 !important;\n  background: transparent !important;\n  min-width: 0;\n  width: 100%;\n  padding: 0 !important;\n  min-height: 0 !important;\n  height: auto !important;\n  line-height: 1.25;\n}\n.experience-date-range-field .mat-datepicker-toggle {\n  margin-right: 0.2rem;\n}\n.experience-date-range-field .mat-mdc-form-field-hint-wrapper,\n.experience-date-range-field .mat-mdc-form-field-hint {\n  color: rgba(30, 49, 74, 0.65);\n  font-size: 0.72rem;\n}\n.experience-date-range-field .mat-date-range-input-container {\n  width: 100%;\n  display: grid;\n  grid-template-columns: minmax(96px, 1fr) auto minmax(96px, 1fr);\n  align-items: center;\n  column-gap: 0.34rem;\n  min-width: 0;\n}\n.experience-date-range-field .mat-date-range-input-separator {\n  margin: 0 0.28rem;\n  flex: 0 0 auto;\n  white-space: nowrap;\n}\n.experience-date-range-field .mat-date-range-input-start-wrapper,\n.experience-date-range-field .mat-date-range-input-end-wrapper {\n  width: 100%;\n  max-width: 100%;\n  overflow: visible;\n  min-width: 0;\n}\n.experience-date-range-field .mat-date-range-input-inner {\n  font-size: 0.96rem;\n  min-width: 0 !important;\n  width: 100% !important;\n  text-overflow: clip;\n  white-space: nowrap;\n  line-height: 1.25;\n}\n.experience-date-range-field .mat-mdc-form-field-flex {\n  min-width: 0;\n  border-bottom: 0 !important;\n  box-shadow: none !important;\n  align-items: center !important;\n}\n.experience-date-range-field .mat-mdc-form-field-infix {\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  min-height: 34px !important;\n  height: 34px;\n  display: flex;\n  align-items: center;\n}\n.experience-date-range-field .mdc-line-ripple,\n.experience-date-range-field .mat-mdc-form-field-line-ripple,\n.experience-date-range-field .mdc-line-ripple--deactivating,\n.experience-date-range-field .mdc-line-ripple--active {\n  display: none !important;\n  opacity: 0 !important;\n  transform: scaleX(0) !important;\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-all {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efe8ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-workspace {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1f3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-school {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf4ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-online {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf8ee);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-project {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f4f0ff);\n}\n.mobile-profile-language-chip.language-tone-1,\n.mobile-profile-selector-option.language-tone-1,\n:host ::ng-deep .mat-mdc-option.language-tone-1 {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n  color: #2f6090;\n}\n.mobile-profile-language-chip.language-tone-2,\n.mobile-profile-selector-option.language-tone-2,\n:host ::ng-deep .mat-mdc-option.language-tone-2 {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n  color: #2f695b;\n}\n.mobile-profile-language-chip.language-tone-3,\n.mobile-profile-selector-option.language-tone-3,\n:host ::ng-deep .mat-mdc-option.language-tone-3 {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n  color: #394f9c;\n}\n.mobile-profile-language-chip.language-tone-4,\n.mobile-profile-selector-option.language-tone-4,\n:host ::ng-deep .mat-mdc-option.language-tone-4 {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n  color: #8d3f66;\n}\n.mobile-profile-language-chip.language-tone-5,\n.mobile-profile-selector-option.language-tone-5,\n:host ::ng-deep .mat-mdc-option.language-tone-5 {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n  color: #704822;\n}\n.mobile-profile-language-chip.language-tone-6,\n.mobile-profile-selector-option.language-tone-6,\n:host ::ng-deep .mat-mdc-option.language-tone-6 {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n  color: #415872;\n}\n.mobile-profile-language-chip.language-tone-7,\n.mobile-profile-selector-option.language-tone-7,\n:host ::ng-deep .mat-mdc-option.language-tone-7 {\n  background: #f7f5ea;\n  border-color: rgba(128, 109, 66, 0.34);\n  color: #746237;\n}\n.mobile-profile-language-chip.language-tone-8,\n.mobile-profile-selector-option.language-tone-8,\n:host ::ng-deep .mat-mdc-option.language-tone-8 {\n  background: #edf5ff;\n  border-color: rgba(45, 122, 160, 0.34);\n  color: #2f6782;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf2ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #ebf7ef);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1e3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efecfc);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3f8e9);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fceef3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf7ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6f2e9);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-1 .status-option-content {\n  color: #2d63a9;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-2 .status-option-content {\n  color: #2a7a49;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-3 .status-option-content {\n  color: #9b6018;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-4 .status-option-content {\n  color: #6153a2;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-5 .status-option-content {\n  color: #61812a;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-6 .status-option-content {\n  color: #9f446d;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-7 .status-option-content {\n  color: #2e7898;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-8 .status-option-content {\n  color: #806c3f;\n}\n.mobile-profile-selector-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      180deg,\n      #eef5ff 0%,\n      #e3eefc 100%);\n  border-color: rgba(46, 102, 181, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      180deg,\n      #eef9f3 0%,\n      #e3f4ea 100%);\n  border-color: rgba(40, 125, 72, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ea 0%,\n      #ffecdd 100%);\n  border-color: rgba(165, 94, 24, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f1ff 0%,\n      #e8e5fb 100%);\n  border-color: rgba(97, 82, 164, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f9ef 0%,\n      #edf3e1 100%);\n  border-color: rgba(95, 128, 36, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #f9e6ed 100%);\n  border-color: rgba(160, 70, 111, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ff 0%,\n      #e2f0fb 100%);\n  border-color: rgba(45, 122, 160, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f3ea 0%,\n      #eee9dc 100%);\n  border-color: rgba(128, 109, 66, 0.32);\n}\n.mobile-profile-selector-option.status-public {\n  background:\n    linear-gradient(\n      180deg,\n      #e6f6ef 0%,\n      #d9f0e6 100%);\n  border-color: rgba(47, 143, 102, 0.34);\n}\n.mobile-profile-selector-option.status-friends {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f1fd 0%,\n      #dfeaf9 100%);\n  border-color: rgba(27, 87, 161, 0.34);\n}\n.mobile-profile-selector-option.status-host {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe2 0%,\n      #eee4d2 100%);\n  border-color: rgba(135, 88, 15, 0.36);\n}\n.mobile-profile-selector-option.status-inactive {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3f5 0%,\n      #e8ebef 100%);\n  border-color: rgba(91, 101, 115, 0.32);\n}\n.mobile-profile-selector-option.physique-slim {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.mobile-profile-selector-option.physique-lean {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n}\n.mobile-profile-selector-option.physique-athletic {\n  background: #e8f5ec;\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.mobile-profile-selector-option.physique-fit {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.mobile-profile-selector-option.physique-curvy {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n}\n.mobile-profile-selector-option.physique-muscular {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n}\n.mobile-profile-selector-option.physique-average {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.popup-panel-profile-selector .values-selector-popup.profile-selector-popup {\n  gap: 0.56rem;\n}\n.popup-panel-profile-selector .profile-filter-selector-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.44rem;\n  padding-bottom: 0.22rem;\n  border-bottom: 1px solid rgba(74, 102, 139, 0.22);\n}\n.popup-panel-profile-selector .profile-filter-selector-head-label {\n  color: #203c64;\n  font-size: 0.82rem;\n  font-weight: 800;\n  line-height: 1.2;\n}\n.popup-panel-profile-selector .profile-filter-selector-clear {\n  border: 1px solid rgba(41, 73, 110, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.82);\n  color: #284970;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.3rem 0.52rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector .profile-filter-selector-clear.is-hidden {\n  visibility: hidden;\n  pointer-events: none;\n}\n.popup-panel-profile-selector .profile-filter-selector-selected {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector .profile-filter-selector-chip {\n  border: 1px solid rgba(35, 68, 107, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.92);\n  color: #234368;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.26rem 0.48rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.16rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector .profile-filter-selector-chip .mat-icon {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n}\n.popup-panel-profile-selector .profile-filter-selector-empty {\n  margin: 0;\n  font-size: 0.74rem;\n  color: rgba(31, 54, 86, 0.62);\n  font-style: italic;\n}\n.popup-panel-profile-selector .profile-selector-option-group {\n  display: grid;\n  gap: 0.34rem;\n  border: 1px solid transparent;\n  border-radius: 12px;\n  padding: 0.4rem 0.42rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-head {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag {\n  border-radius: 999px;\n  border: 1px solid rgba(52, 86, 128, 0.28);\n  background: rgba(255, 255, 255, 0.74);\n  color: #2f527d;\n  font-size: 0.67rem;\n  font-weight: 800;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.2rem 0.52rem;\n  text-transform: uppercase;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag-icon {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.popup-panel-profile-selector .profile-selector-option-group-line {\n  display: block;\n  width: 100%;\n  height: 1px;\n  background: rgba(84, 111, 147, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-chip-grid {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.36rem;\n}\n.popup-panel-profile-selector .profile-selector-chip {\n  border: 1px solid rgba(41, 70, 106, 0.22);\n  border-radius: 999px;\n  background: #f4f8ff;\n  color: #234066;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 700;\n  padding: 0.3rem 0.58rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  cursor: pointer;\n  transition:\n    background-color 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.popup-panel-profile-selector .profile-selector-chip.active {\n  border-color: rgba(27, 85, 158, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #dcebff 0%,\n      #cfe3ff 100%);\n  color: #123e70;\n  box-shadow: inset 0 0 0 1px rgba(30, 73, 127, 0.24), 0 1px 2px rgba(24, 53, 86, 0.16);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-family {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 232, 219, 0.52) 0%,\n      rgba(255, 232, 219, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-ambition {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 242, 216, 0.52) 0%,\n      rgba(255, 242, 216, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-lifestyle {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(221, 241, 239, 0.56) 0%,\n      rgba(221, 241, 239, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-beliefs {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-social {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(223, 236, 255, 0.5) 0%,\n      rgba(223, 236, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-arts {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(235, 227, 255, 0.5) 0%,\n      rgba(235, 227, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-food {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 236, 221, 0.52) 0%,\n      rgba(255, 236, 221, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-active {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(222, 243, 231, 0.56) 0%,\n      rgba(222, 243, 231, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-mind {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(219, 242, 238, 0.56) 0%,\n      rgba(219, 242, 238, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-identity {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-family {\n  border-color: rgba(156, 94, 51, 0.34);\n  color: #9c5e33;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-ambition {\n  border-color: rgba(160, 106, 20, 0.34);\n  color: #9b6717;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-lifestyle {\n  border-color: rgba(47, 123, 119, 0.34);\n  color: #2f7b77;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-beliefs {\n  border-color: rgba(95, 78, 160, 0.34);\n  color: #5f4ea0;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-social {\n  border-color: rgba(47, 106, 175, 0.36);\n  color: #2f6aaf;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-arts {\n  border-color: rgba(106, 87, 168, 0.36);\n  color: #6a57a8;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-food {\n  border-color: rgba(170, 97, 28, 0.34);\n  color: #a55e18;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-active {\n  border-color: rgba(49, 124, 82, 0.36);\n  color: #317c52;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-mind {\n  border-color: rgba(37, 124, 118, 0.34);\n  color: #2b7c76;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-identity {\n  border-color: rgba(98, 84, 163, 0.34);\n  color: #6254a3;\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-family {\n  background: rgba(156, 94, 51, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-ambition {\n  background: rgba(160, 106, 20, 0.32);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-lifestyle {\n  background: rgba(47, 123, 119, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-beliefs {\n  background: rgba(95, 78, 160, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-social {\n  background: rgba(47, 106, 175, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-arts {\n  background: rgba(106, 87, 168, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-food {\n  background: rgba(170, 97, 28, 0.32);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-active {\n  background: rgba(49, 124, 82, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-mind {\n  background: rgba(37, 124, 118, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-identity {\n  background: rgba(98, 84, 163, 0.3);\n}\n:host ::ng-deep .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.status-option) {\n  background: #f0f5fc;\n}\n:host ::ng-deep .mat-mdc-option.status-option.mdc-list-item--selected:not(.mdc-list-item--disabled) {\n  filter: brightness(0.95);\n  box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.2);\n}\n:host ::ng-deep .mat-mdc-option.status-option {\n  background: #fff;\n}\n:host ::ng-deep .mat-mdc-option.status-option:not(:last-child) {\n  border-bottom: 1px solid #e6edf7;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.hide-selected-option,\n:host ::ng-deep .status-options-panel .mat-mdc-option.hide-selected-option {\n  min-height: 0 !important;\n  height: 0 !important;\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  border: 0 !important;\n  margin: 0 !important;\n  opacity: 0 !important;\n  pointer-events: none !important;\n  overflow: hidden !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option {\n  background: #fff;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel {\n  margin-top: 8px !important;\n  margin-bottom: 8px !important;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .cdk-overlay-pane .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .cdk-overlay-pane .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above {\n  margin-top: 0 !important;\n  margin-bottom: 18px !important;\n  transform: translateY(-10px) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public {\n  --mdc-list-list-item-container-color: #def3e9;\n  --mat-mdc-option-selected-container-color: #def3e9;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #def3e9) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends {\n  --mdc-list-list-item-container-color: #e3eefb;\n  --mat-mdc-option-selected-container-color: #e3eefb;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e3eefb) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host {\n  --mdc-list-list-item-container-color: #f3ead8;\n  --mat-mdc-option-selected-container-color: #f3ead8;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3ead8) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive {\n  --mdc-list-list-item-container-color: #eceff3;\n  --mat-mdc-option-selected-container-color: #eceff3;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eceff3) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon {\n  color: #2f8f66 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon {\n  color: #1b57a1 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon {\n  color: #87580f !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon {\n  color: #5b6573 !important;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-slim {\n  background: #eaf4ff;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-lean {\n  background: #edf8f4;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-athletic {\n  background: #e8f5ec;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-fit {\n  background: #f1f2ff;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-curvy {\n  background: #fff2f8;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-muscular {\n  background: #fbf4ea;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-average {\n  background: #eff4f9;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-slim .status-option-content {\n  color: #3f7ab3;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-lean .status-option-content {\n  color: #3f8f5f;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-athletic .status-option-content {\n  color: #2f7e4d;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-fit .status-option-content {\n  color: #465fbb;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-curvy .status-option-content {\n  color: #a14875;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-muscular .status-option-content {\n  color: #7d4f24;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-average .status-option-content {\n  color: #4d667f;\n}\n:host ::ng-deep .mat-mdc-select-panel.physique-options-panel {\n  width: auto !important;\n  max-width: 220px !important;\n  min-width: 0 !important;\n}\n:host ::ng-deep .physique-options-panel .mat-mdc-option {\n  padding-right: 8px;\n}\n:host ::ng-deep .physique-options-panel .mat-mdc-option .mat-pseudo-checkbox {\n  margin-left: 4px;\n}\n@media (max-width: 760px) {\n  .experience-form-grid {\n    grid-template-columns: 1fr;\n    max-width: none;\n    justify-content: stretch;\n    row-gap: 0.72rem;\n  }\n  .experience-date-range-label {\n    grid-column: 1/-1;\n  }\n  .experience-date-range-field .mat-date-range-input-container {\n    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);\n  }\n  .profile-details-privacy-fab .privacy-fab-actions {\n    position: fixed;\n    left: 0.5rem;\n    right: 0.5rem;\n    bottom: max(0.5rem, env(safe-area-inset-bottom));\n    top: auto;\n    transform: translateY(12px) scale(0.98);\n    transform-origin: bottom center;\n    justify-content: center;\n    gap: 0.46rem;\n    padding: 0.46rem 0.56rem;\n    border: 1px solid rgba(42, 68, 102, 0.2);\n    border-radius: 14px;\n    background: #fff;\n    box-shadow: 0 -12px 24px rgba(18, 31, 51, 0.22);\n  }\n  .profile-details-privacy-fab.open .privacy-fab-actions {\n    transform: translateY(0) scale(1);\n  }\n}\n:host {\n  display: contents;\n}\n.event-explore-popup {\n  position: relative;\n  height: 100%;\n  min-height: 0;\n  display: flex;\n  flex-direction: column;\n}\n.event-explore-basket-menu {\n  position: absolute;\n  right: 0.75rem;\n  bottom: 0.9rem;\n  z-index: 18;\n  display: inline-flex;\n  --app-menu-panel-gap: 0.6rem;\n}\n.event-explore-sticky-header {\n  z-index: 26;\n  margin-bottom: 0;\n  box-shadow: 0 0.34rem 0 rgba(255, 255, 255, 0.98);\n}\n@media (max-width: 760px) {\n  .event-explore-basket-menu {\n    right: 0.55rem;\n    bottom: 0.7rem;\n  }\n}\n/*# sourceMappingURL=event-explore-popup.component.css.map */\n'] }]
  }], () => [], { eventExploreSmartList: [{
    type: ViewChild,
    args: ["eventExploreSmartList"]
  }], eventExploreItemTemplate: [{
    type: ViewChild,
    args: ["eventExploreItemTemplate", { read: TemplateRef }]
  }], onEscapePressed: [{
    type: HostListener,
    args: ["window:keydown.escape", ["$event"]]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EventExplorePopupComponent, { className: "EventExplorePopupComponent", filePath: "app/activity/components/event-explore-popup/event-explore-popup.component.ts", lineNumber: 144 });
})();
export {
  EventExplorePopupComponent
};
//# sourceMappingURL=event-explore-popup.component-L7GGW2WG.js.map
