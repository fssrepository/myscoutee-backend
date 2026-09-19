import {
  AssetPopupStore
} from "./chunk-PUXHWXJS.js";
import {
  AssetBorrowDraftStore,
  assetBorrowSelectionSignature
} from "./chunk-J3OZLXYA.js";
import {
  ProfileStore
} from "./chunk-O6ZAHHD6.js";
import {
  SubEventResourcePopupStore
} from "./chunk-22BOAOHJ.js";
import {
  AssetInfoCardConverter
} from "./chunk-2QZ4HDFE.js";
import "./chunk-2XAMZBDM.js";
import {
  SmartListComponent
} from "./chunk-QPGRMBRW.js";
import {
  AssetStore
} from "./chunk-OYOBMUF7.js";
import {
  ActivitiesPopupStore,
  eventChatHeaderStateFromChat,
  eventChatPopupRequestFromChat
} from "./chunk-5GUOJYST.js";
import {
  DialogStore
} from "./chunk-4DNL6LXE.js";
import {
  ChatPopupHeaderContextConverter
} from "./chunk-RFTK2A34.js";
import {
  CARD_MENU_ACTIONS,
  InfoCardComponent
} from "./chunk-7FYNT6CO.js";
import "./chunk-IPHHDSOR.js";
import "./chunk-EA3MO7BB.js";
import "./chunk-5VDIJXBA.js";
import "./chunk-Z7T4C7EV.js";
import {
  ActivityResourcesService,
  AssetsService,
  ChatsService,
  ContactsService
} from "./chunk-JNYVIKB6.js";
import {
  ShareTokensService
} from "./chunk-522CXB3E.js";
import {
  PaymentAuthorizationService
} from "./chunk-HWWKH4YJ.js";
import {
  EventsService
} from "./chunk-LFVP4M73.js";
import "./chunk-2DMDD7ZZ.js";
import {
  PopupComponent
} from "./chunk-ERGA5DCY.js";
import "./chunk-ADBOYRJ7.js";
import "./chunk-EAXEH725.js";
import {
  AppMenuComponent,
  AppMenuDispatcher,
  AppMenuOutletComponent
} from "./chunk-53UGBDSO.js";
import {
  DeploymentConfigurationService
} from "./chunk-MOUXN75Y.js";
import {
  FormsModule,
  MatIcon,
  MatIconModule
} from "./chunk-L6HJFJOR.js";
import "./chunk-LFBAVSTX.js";
import {
  GameService,
  UsersService
} from "./chunk-RP5GBSNO.js";
import "./chunk-HGLCBXAR.js";
import "./chunk-OY7NWTMT.js";
import {
  AssetCardBuilder,
  AssetDefaultsBuilder
} from "./chunk-EWHSEKAB.js";
import {
  ActivityResourceBuilder,
  PricingBuilder
} from "./chunk-LM6UNLJK.js";
import "./chunk-NOXIMZYO.js";
import "./chunk-UR2UG3BQ.js";
import "./chunk-7B4ZHEVS.js";
import "./chunk-6SKBB3AJ.js";
import "./chunk-YXATI2WQ.js";
import "./chunk-QXOIA7DH.js";
import "./chunk-EVFFULVM.js";
import "./chunk-7WMBE6WE.js";
import {
  ActivityStore,
  UserProfileStore
} from "./chunk-IEWB22H3.js";
import "./chunk-UKS3QROH.js";
import "./chunk-C6JV7CA3.js";
import {
  ASSET_TYPES,
  ASSET_TYPE_ACCOMMODATION,
  ASSET_TYPE_SUPPLIES,
  ASSET_TYPE_TRANSPORT
} from "./chunk-N7OBXPJA.js";
import {
  I18nService
} from "./chunk-AOUY6FNC.js";
import {
  CommonModule,
  NgComponentOutlet
} from "./chunk-SCHUURLR.js";
import {
  AppUtils
} from "./chunk-CYVMX3LD.js";
import "./chunk-HDBJPOT3.js";
import "./chunk-LDZENZ35.js";
import "./chunk-DZ6OOOZN.js";
import "./chunk-ODJSNRFC.js";
import {
  Component,
  HostListener,
  Input,
  ViewChild,
  ViewEncapsulation,
  __spreadProps,
  __spreadValues,
  computed,
  effect,
  from,
  inject,
  setClassMetadata,
  untracked,
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
  ɵɵpureFunction1,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵresetView,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵviewQuery
} from "./chunk-EV3I3YNV.js";

// src/app/activity/components/event-resource-popup/asset-explore/event-resource-asset-explore.component.ts
var _c0 = ["assetExploreSmartList"];
var _c1 = (a0) => ({ groupLabel: a0 });
function EventResourceAssetExploreComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-info-card", 3);
    \u0275\u0275listener("mediaStartClick", function EventResourceAssetExploreComponent_ng_template_0_Template_app_info_card_mediaStartClick_0_listener() {
      const card_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.openOwnerImpressions(card_r2));
    })("mediaEndClick", function EventResourceAssetExploreComponent_ng_template_0_Template_app_info_card_mediaEndClick_0_listener() {
      const card_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.openBorrowFromBadge(card_r2));
    })("menuAction", function EventResourceAssetExploreComponent_ng_template_0_Template_app_info_card_menuAction_0_listener($event) {
      const card_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onCardMenuAction(card_r2, $event));
    })("menuRequest", function EventResourceAssetExploreComponent_ng_template_0_Template_app_info_card_menuRequest_0_listener($event) {
      const card_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.openInfoCardMenu(card_r2, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const card_r2 = ctx.$implicit;
    const groupLabel_r4 = ctx.groupLabel;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("card", ctx_r2.itemInfoCard(card_r2, \u0275\u0275pureFunction1(2, _c1, groupLabel_r4)))("useSharedMenu", true);
  }
}
function EventResourceAssetExploreComponent_Conditional_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 7)(1, "mat-icon");
    \u0275\u0275text(2, "error");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const explore_r6 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(explore_r6.error);
  }
}
function EventResourceAssetExploreComponent_Conditional_2_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 7)(1, "mat-icon");
    \u0275\u0275text(2, "error");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const explore_r6 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(explore_r6.error);
  }
}
function EventResourceAssetExploreComponent_Conditional_2_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 8)(1, "mat-icon");
    \u0275\u0275text(2, "travel_explore");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "No visible assets match this date range and category yet.");
    \u0275\u0275elementEnd()();
  }
}
function EventResourceAssetExploreComponent_Conditional_2_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-smart-list", 12, 1);
    \u0275\u0275listener("stateChange", function EventResourceAssetExploreComponent_Conditional_2_Conditional_7_Template_app_smart_list_stateChange_0_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onSmartListStateChange($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    const assetExploreItemTemplate_r8 = \u0275\u0275reference(1);
    \u0275\u0275property("config", ctx_r2.smartListConfig)("loadPage", ctx_r2.smartListLoadPage)("itemTemplate", assetExploreItemTemplate_r8)("query", ctx_r2.smartListQuery);
  }
}
function EventResourceAssetExploreComponent_Conditional_2_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-menu", 13);
    \u0275\u0275listener("itemSelect", function EventResourceAssetExploreComponent_Conditional_2_Conditional_8_Template_app_menu_itemSelect_0_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onMenuSelect($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("trigger", ctx_r2.borrowDraftMenuTrigger())("items", ctx_r2.borrowDraftMenuItems())("panelAlign", "end")("mobileBreakpointPx", 900);
  }
}
function EventResourceAssetExploreComponent_Conditional_2_Conditional_9_Conditional_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function EventResourceAssetExploreComponent_Conditional_2_Conditional_9_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, EventResourceAssetExploreComponent_Conditional_2_Conditional_9_Conditional_0_ng_container_0_Template, 1, 0, "ng-container", 14);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275property("ngComponentOutlet", ctx)("ngComponentOutletInputs", ctx_r2.assetViewOutletInputs());
  }
}
function EventResourceAssetExploreComponent_Conditional_2_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, EventResourceAssetExploreComponent_Conditional_2_Conditional_9_Conditional_0_Template, 1, 2, "ng-container");
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional((tmp_4_0 = ctx_r2.resourcePopupStore.eventResourceAssetViewComponent()) ? 0 : -1, tmp_4_0);
  }
}
function EventResourceAssetExploreComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 2)(1, "div", 4)(2, "section", 5)(3, "div", 6);
    \u0275\u0275conditionalCreate(4, EventResourceAssetExploreComponent_Conditional_2_Conditional_4_Template, 5, 1, "section", 7);
    \u0275\u0275conditionalCreate(5, EventResourceAssetExploreComponent_Conditional_2_Conditional_5_Template, 5, 1, "section", 7)(6, EventResourceAssetExploreComponent_Conditional_2_Conditional_6_Template, 5, 0, "section", 8)(7, EventResourceAssetExploreComponent_Conditional_2_Conditional_7_Template, 2, 4, "app-smart-list", 9);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(8, EventResourceAssetExploreComponent_Conditional_2_Conditional_8_Template, 1, 4, "app-menu", 10);
    \u0275\u0275conditionalCreate(9, EventResourceAssetExploreComponent_Conditional_2_Conditional_9_Template, 1, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "app-menu-outlet", 11);
    \u0275\u0275listener("itemSelect", function EventResourceAssetExploreComponent_Conditional_2_Template_app_menu_outlet_itemSelect_10_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onMenuSelect($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const explore_r6 = ctx;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r2.assetExplorePopupModel(explore_r6))("zIndex", ctx_r2.assetExplorePopupZIndex());
    \u0275\u0275advance(4);
    \u0275\u0275conditional(explore_r6.error && explore_r6.cards.length > 0 ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(explore_r6.error && explore_r6.cards.length === 0 ? 5 : explore_r6.cards.length === 0 && !explore_r6.loading ? 6 : 7);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r2.borrowDraftCount() > 0 ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.assetView() ? 9 : -1);
  }
}
var ASSET_EXPLORE_ORDER_OPTIONS = [
  { key: "availability", label: "Available first", icon: "inventory_2" },
  { key: "lowest-price", label: "Lowest price", icon: "payments" },
  { key: "fewest-policies", label: "Fewest policies", icon: "policy" }
];
var EventResourceAssetExploreComponent = class _EventResourceAssetExploreComponent {
  static BORROW_BASKET_TTL_MS = 10 * 60 * 1e3;
  static BORROW_QUANTITY = 1;
  resourcePopupStore = inject(SubEventResourcePopupStore);
  userProfileStore = inject(UserProfileStore);
  activityStore = inject(ActivityStore);
  activitiesStore = inject(ActivitiesPopupStore);
  activityResourcesService = inject(ActivityResourcesService);
  chatsService = inject(ChatsService);
  contactsService = inject(ContactsService);
  assetsService = inject(AssetsService);
  eventsService = inject(EventsService);
  deploymentConfiguration = inject(DeploymentConfigurationService);
  paymentAuthorization = inject(PaymentAuthorizationService);
  gameService = inject(GameService);
  usersService = inject(UsersService);
  assetStore = inject(AssetStore);
  assetPopupStore = inject(AssetPopupStore);
  assetBorrowDraftStore = inject(AssetBorrowDraftStore);
  dialogStore = inject(DialogStore);
  shareTokensService = inject(ShareTokensService);
  profileStore = inject(ProfileStore);
  appMenuDispatcher = inject(AppMenuDispatcher);
  i18n = inject(I18nService);
  lastCardsSignature = "";
  lastContextKey = "";
  lastCardCount = 0;
  listReady = false;
  listVisibleCount = 0;
  listTotal = 0;
  pendingBorrowRequestVersion = 0;
  lastAssetExploreOutletActionRequestId = 0;
  localReservationsByKey = /* @__PURE__ */ new Map();
  parentZIndex = 2530;
  order = "availability";
  orderOptions = ASSET_EXPLORE_ORDER_OPTIONS;
  assetViewOutletInputs = computed(() => ({
    view: this.assetView(),
    parentZIndex: this.assetExplorePopupZIndex()
  }), ...ngDevMode ? [{ debugName: "assetViewOutletInputs" }] : (
    /* istanbul ignore next */
    []
  ));
  smartListQuery = {
    filters: {
      revision: 0,
      contextKey: ""
    }
  };
  smartList;
  smartListLoadPage = (query) => from(this.loadSmartListPage(query));
  smartListConfig = {
    pageSize: 10,
    initialPageSize: 20,
    defaultView: "list",
    presentation: "list",
    headerProgress: {
      enabled: true
    },
    emptyLabel: "No visible assets right now.",
    emptyDescription: "Try another date range or category.",
    showStickyHeader: true,
    showGroupMarker: ({ groupIndex, scrollable }) => groupIndex > 0 || scrollable,
    groupBy: (card) => this.groupLabel(card),
    listLayout: "card-grid",
    desktopColumns: 3,
    snapMode: "mandatory",
    scrollPaddingTop: "2.6rem",
    stickyHeaderClass: "asset-explore-sticky-header",
    containerClass: {
      "experience-card-list": true,
      "assets-card-list": true,
      "asset-explore-card-list": true
    },
    trackBy: (_index, card) => card.id
  };
  popupViewState = computed(() => {
    const popup = this.resourcePopupStore.assetExplorePopupRef();
    const context = this.resourcePopupStore.popupContextRef();
    if (!popup || !context) {
      return null;
    }
    const stageLabel = this.subEventStageLabel(context.subEvent);
    const windowRange = this.defaultRange(context.subEvent);
    const dateRangeModel = this.assetExploreDateRangeModel(windowRange);
    return {
      title: stageLabel ? `Explore - ${stageLabel}` : "Explore",
      subtitle: this.popupSubtitle(),
      type: popup.type,
      category: popup.category,
      categoryOptions: ASSET_TYPES.flatMap((type) => AssetDefaultsBuilder.assetCategoryOptions(type)),
      dateRange: {
        startAt: popup.startAtIso,
        endAt: popup.endAtIso,
        precision: "date"
      },
      dateRangeModel,
      startDate: AppUtils.isoLocalDateTimeToDate(popup.startAtIso),
      endDate: AppUtils.isoLocalDateTimeToDate(popup.endAtIso),
      startTime: AppUtils.isoLocalTimePart(popup.startAtIso),
      endTime: AppUtils.isoLocalTimePart(popup.endAtIso),
      loading: popup.loading,
      error: popup.error,
      cards: popup.cards
    };
  }, ...ngDevMode ? [{ debugName: "popupViewState" }] : (
    /* istanbul ignore next */
    []
  ));
  borrowDialogViewState = computed(() => {
    this.i18n.revision();
    const dialog = this.resourcePopupStore.assetExploreBorrowDialogRef();
    const popup = this.resourcePopupStore.assetExplorePopupRef();
    const context = this.resourcePopupStore.popupContextRef();
    if (!dialog || !popup || !context) {
      return null;
    }
    const card = this.resolveCard(dialog.cardId);
    if (!card) {
      return null;
    }
    const timeframe = this.timeframeLabel(dialog.startAtIso, dialog.endAtIso);
    const pricing = this.resolveBorrowPricing(card, dialog.startAtIso, dialog.endAtIso, _EventResourceAssetExploreComponent.BORROW_QUANTITY);
    const cancellationPolicy = PricingBuilder.compactPricingConfig(card.pricing, {
      context: "asset",
      allowSlotFeatures: false
    }).cancellationPolicy;
    return {
      title: this.i18n.translateParams("asset.borrow.title", { asset: card.title }),
      subtitle: this.popupSubtitle(),
      timeframe,
      quantity: _EventResourceAssetExploreComponent.BORROW_QUANTITY,
      availableQuantity: dialog.availableQuantity,
      dateRange: {
        startAt: dialog.startAtIso,
        endAt: dialog.endAtIso,
        precision: "minute"
      },
      lineItems: [
        {
          id: `resource:${card.id}`,
          kind: "resource",
          label: card.title,
          detail: timeframe || this.i18n.translate("asset.borrow.request"),
          amount: pricing.amount,
          currency: pricing.currency
        }
      ],
      totalAmount: pricing.amount,
      currency: pricing.currency,
      bookingStartAtIso: dialog.startAtIso,
      cancellationPolicy,
      policies: (AssetCardBuilder.assetPoliciesEnabled(card) ? card.policies ?? [] : []).map((item) => __spreadValues({}, item)),
      acceptedPolicyIds: [...dialog.acceptedPolicyIds],
      payable: pricing.amount > 0,
      paymentStep: dialog.paymentStep,
      submitLabel: pricing.amount > 0 ? this.borrowSubmitLabel(dialog) : this.i18n.translate("asset.borrow.send.request"),
      busyLabel: pricing.amount > 0 ? this.borrowBusyLabel(dialog) : this.i18n.translate("asset.borrow.sending.request"),
      busy: dialog.busy,
      error: dialog.error
    };
  }, ...ngDevMode ? [{ debugName: "borrowDialogViewState" }] : (
    /* istanbul ignore next */
    []
  ));
  borrowDraftsViewState = computed(() => {
    const popup = this.resourcePopupStore.assetExplorePopupRef();
    const context = this.resourcePopupStore.popupContextRef();
    const activeUserId = this.activeUser().id.trim();
    if (!popup || !context || !activeUserId) {
      return [];
    }
    return this.listBorrowDrafts(activeUserId, context.subEvent.id).map((draft) => {
      const card = popup.cards.find((item) => item.id === draft.cardId) ?? null;
      return {
        cardId: draft.cardId,
        title: card?.title ?? draft.title,
        timeframe: this.timeframeLabel(draft.startAtIso || popup.startAtIso, draft.endAtIso || popup.endAtIso),
        quantity: Math.max(1, Math.trunc(Number(draft.quantity) || 1)),
        availabilityLabel: card ? this.availabilityLabel(card) : "Unavailable for this time"
      };
    }).sort((left, right) => left.title.localeCompare(right.title) || left.cardId.localeCompare(right.cardId));
  }, ...ngDevMode ? [{ debugName: "borrowDraftsViewState" }] : (
    /* istanbul ignore next */
    []
  ));
  constructor() {
    effect(() => {
      if (this.assetView()) {
        void this.resourcePopupStore.ensureEventResourceAssetViewLoaded();
      }
    });
    effect(() => {
      const request = this.resourcePopupStore.eventResourceAssetExploreOutletActionRequest();
      if (!request || request.requestId <= this.lastAssetExploreOutletActionRequestId) {
        return;
      }
      this.lastAssetExploreOutletActionRequestId = request.requestId;
      untracked(() => this.handleAssetExploreOutletActionRequest(request));
    });
    effect(() => {
      const dialog = this.resourcePopupStore.assetExploreBorrowDialogRef();
      if (!dialog) {
        return;
      }
      untracked(() => this.syncBorrowCheckoutEditor(dialog));
    });
  }
  assetExplorePopupZIndex() {
    return this.parentZIndex + 100;
  }
  assetExplorePopupModel(explore) {
    return {
      title: explore.title,
      subtitle: explore.subtitle,
      ariaLabel: explore.title,
      closeAriaLabel: "Close asset explore",
      closeOnBackdrop: true,
      size: "wide",
      height: "full",
      headerTone: "accent",
      bodyLayout: "fill",
      backdropTone: "dim",
      headerControls: [
        {
          kind: "menu",
          id: "asset-explore-order",
          menuKind: "select",
          trigger: this.orderMenuTrigger(),
          items: this.orderMenuItems(),
          panelAlign: "end",
          mobileBreakpointPx: 900
        }
      ],
      toolbarControls: [
        {
          kind: "menu",
          id: "asset-explore-category",
          menuKind: "select",
          trigger: this.categoryMenuTrigger(explore),
          items: this.categoryMenuItems(explore),
          panelAlign: "start",
          mobileBreakpointPx: 900
        },
        {
          kind: "date-input",
          id: "asset-explore-date-range",
          align: "end",
          model: explore.dateRangeModel,
          value: explore.dateRange
        }
      ],
      onClose: (event) => this.closeExplorePopup(event),
      onMenuSelect: (event) => this.onMenuSelect(event.itemSelect),
      onDateInputChange: (event) => this.onDateInputRangeChange(event.value)
    };
  }
  handleAssetExploreOutletActionRequest(request) {
    switch (request.kind) {
      case "assetViewClose":
        this.closeAssetView(request.event);
        return;
      case "borrowDialogClose":
        this.closeBorrowDialog(request.event);
        return;
      case "borrowDialogBack":
        this.backToBorrowDetails(request.event);
        return;
      case "borrowDateRangeChange":
        this.setBorrowDateRange(request.start, request.end);
        return;
      case "borrowTimeChange":
        this.setBorrowTime(request.edge, request.value);
        return;
      case "borrowQuantityChange":
        this.onBorrowQuantityChange(request.value);
        return;
      case "borrowQuantityBlur":
        this.normalizeBorrowQuantityOnBlur(request.value);
        return;
      case "borrowPolicyToggle":
        this.toggleBorrowPolicy(request.policyId);
        return;
      case "borrowConfirm":
        this.confirmBorrow(request.event);
        return;
    }
  }
  ngDoCheck() {
    const explore = this.popupViewState();
    if (!explore) {
      this.resourcePopupStore.assetExploreAssetViewIdRef.set(null);
    }
    const cards = explore?.cards ?? [];
    const contextKey = explore ? [
      explore.title,
      explore.subtitle,
      explore.type,
      explore.category,
      this.order,
      explore.startDate?.getTime() ?? "start",
      explore.endDate?.getTime() ?? "end",
      explore.startTime,
      explore.endTime
    ].join(":") : "";
    const signature = `${contextKey}:${cards.map((card) => [
      card.id,
      card.quantity ?? "",
      card.capacityTotal,
      card.requests.length,
      this.availabilityLabel(card)
    ].join(":")).join("|")}`;
    if (contextKey !== this.lastContextKey) {
      this.lastContextKey = contextKey;
      this.lastCardsSignature = signature;
      this.lastCardCount = cards.length;
      this.listReady = false;
      this.listVisibleCount = 0;
      this.listTotal = 0;
      this.smartListQuery = {
        filters: {
          revision: Date.now(),
          contextKey
        }
      };
      return;
    }
    if (signature === this.lastCardsSignature) {
      return;
    }
    const previousCardCount = this.lastCardCount;
    this.lastCardsSignature = signature;
    this.lastCardCount = cards.length;
    if (cards.length <= previousCardCount) {
      this.syncVisibleCards(cards, previousCardCount);
    }
  }
  onEscapePressed(event) {
    const keyboardEvent = event;
    if (keyboardEvent.defaultPrevented) {
      return;
    }
    if (this.borrowDialogViewState()) {
      keyboardEvent.preventDefault();
      keyboardEvent.stopPropagation();
      if (this.borrowDialogViewState()?.paymentStep) {
        this.backToBorrowDetails();
        return;
      }
      this.closeBorrowDialog();
      return;
    }
    if (this.assetView()) {
      keyboardEvent.preventDefault();
      keyboardEvent.stopPropagation();
      this.closeAssetView();
      return;
    }
    if (this.popupViewState()) {
      keyboardEvent.preventDefault();
      keyboardEvent.stopPropagation();
      this.closeExplorePopup();
    }
  }
  onSmartListStateChange(change) {
    this.listVisibleCount = change.items.length;
    this.listTotal = change.total;
    this.listReady = !change.initialLoading;
  }
  itemInfoCard(card, options = {}) {
    return AssetInfoCardConverter.convert(this.toAssetDto(card), {
      variant: "explore",
      groupLabel: options?.groupLabel ?? null,
      ownerAvatarUrl: this.ownerAvatarUrl(card),
      availabilityLabel: this.availabilityLabel(card),
      canBorrow: this.availableQuantity(card) > 0,
      canReportOwner: this.canReportOwner(card)
    });
  }
  openInfoCardMenu(card, request) {
    const menuId = `asset-explore-card:${request.id}`;
    if (this.appMenuDispatcher.isOpen(menuId)) {
      this.appMenuDispatcher.close(menuId);
      return;
    }
    this.appMenuDispatcher.open({
      id: menuId,
      kind: "select",
      title: this.infoCardMenuTitle(request.card),
      items: this.infoCardMenuItems(card, request),
      triggerRect: request.triggerRect,
      openUp: request.openUp,
      panelAlign: "auto",
      closeOnSelect: true,
      onClose: request.closeTrigger
    }, null);
  }
  openOwnerImpressions(card) {
    const ownerUserId = `${card.ownerUserId ?? ""}`.trim();
    if (!ownerUserId) {
      return;
    }
    const owner = this.resolveOwnerUser(card);
    this.userProfileStore.setUserProfile(owner);
    void this.loadOwnerProfile(ownerUserId);
    this.profileStore.openImpressionsPopup(ownerUserId, {
      contextLabel: "Asset Owner",
      sourceLabel: card.title
    });
  }
  onMenuSelect(event) {
    const context = event.context;
    if (!context) {
      return;
    }
    if (context.menu === "asset-explore-order") {
      this.selectOrder(context.order, event.sourceEvent);
      return;
    }
    if (context.menu === "asset-explore-category") {
      event.sourceEvent.stopPropagation();
      this.selectCategory(context.type, context.category, event.sourceEvent);
      return;
    }
    if (context.menu === "asset-explore-borrow-draft") {
      if (event.action === "remove") {
        this.clearBorrowDraft(context.entry.cardId, event.sourceEvent);
        return;
      }
      this.continueBorrowDraft(context.entry.cardId, event.sourceEvent);
      return;
    }
    this.onCardMenuAction(context.card, {
      id: context.infoCard.id,
      actionId: context.action.id,
      action: context.action,
      card: context.infoCard
    });
  }
  orderMenuTrigger() {
    return {
      label: this.orderLabel(),
      icon: this.orderIcon(),
      ariaLabel: "Open asset explore order",
      palette: this.orderPalette(this.order),
      layout: "pill"
    };
  }
  orderMenuItems() {
    return this.orderOptions.map((option) => ({
      id: `asset-explore-order-${option.key}`,
      label: option.label,
      icon: option.icon,
      kind: "radio",
      active: option.key === this.order,
      checked: option.key === this.order,
      palette: this.orderPalette(option.key),
      surface: "tinted",
      context: { menu: "asset-explore-order", order: option.key }
    }));
  }
  categoryMenuTrigger(explore) {
    const wholeType = !`${explore.category ?? ""}`.trim();
    return {
      label: wholeType ? AssetDefaultsBuilder.assetTypeLabel(explore.type) : AssetDefaultsBuilder.assetCategoryLabel(explore.category),
      icon: wholeType ? AssetDefaultsBuilder.assetTypeIcon(explore.type) : AssetDefaultsBuilder.assetCategoryIcon(explore.category),
      ariaLabel: "Open asset explore category",
      palette: wholeType ? this.assetTypeAggregatePalette(explore.type) : this.assetCategoryPalette(explore.category),
      layout: "pill"
    };
  }
  categoryMenuItems(explore) {
    const selectedType = explore.type;
    const items = [];
    for (const type of ASSET_TYPES) {
      const options = explore.categoryOptions.filter((option) => AssetDefaultsBuilder.assetCategoryType(option) === type);
      if (options.length === 0) {
        continue;
      }
      items.push({
        id: `asset-explore-category-${type.toLowerCase()}`,
        label: AssetDefaultsBuilder.assetTypeLabel(type),
        icon: AssetDefaultsBuilder.assetTypeIcon(type),
        kind: "branch",
        active: selectedType === type,
        palette: this.resourceTypePalette(type),
        surface: "tinted",
        items: [
          this.wholeAssetTypeMenuItem(type, explore),
          ...options.map((option) => this.categoryMenuItem(type, option, explore))
        ]
      });
    }
    return items;
  }
  categoryMenuItem(type, option, explore) {
    const active = explore.type === type && option === explore.category;
    return {
      id: `asset-explore-category-${option}`,
      label: AssetDefaultsBuilder.assetCategoryLabel(option),
      icon: AssetDefaultsBuilder.assetCategoryIcon(option),
      kind: "radio",
      active,
      checked: active,
      showCheck: true,
      palette: this.assetCategoryPalette(option),
      surface: "tinted",
      context: { menu: "asset-explore-category", type, category: option }
    };
  }
  wholeAssetTypeMenuItem(type, explore) {
    const active = explore.type === type && !`${explore.category ?? ""}`.trim();
    return {
      id: `asset-explore-category-all-${type.toLowerCase()}`,
      label: `All ${AssetDefaultsBuilder.assetTypeLabel(type)}`,
      description: `Show every ${AssetDefaultsBuilder.assetTypeLabel(type).toLowerCase()} category`,
      icon: AssetDefaultsBuilder.assetTypeIcon(type),
      kind: "radio",
      active,
      checked: active,
      showCheck: true,
      palette: this.assetTypeAggregatePalette(type),
      surface: "tinted",
      context: { menu: "asset-explore-category", type, category: "" }
    };
  }
  selectOrder(order, event) {
    event.stopPropagation();
    this.order = order;
    const cards = this.popupViewState()?.cards ?? [];
    this.syncVisibleCards(cards, this.lastCardCount);
  }
  orderLabel(order = this.order) {
    return this.orderOptions.find((option) => option.key === order)?.label ?? "Available first";
  }
  orderIcon(order = this.order) {
    return this.orderOptions.find((option) => option.key === order)?.icon ?? "inventory_2";
  }
  onDateInputRangeChange(value) {
    if (!this.isDateInputRangeValue(value)) {
      return;
    }
    this.setDateRange(AppUtils.isoLocalDateTimeToDate(value.startAt), AppUtils.isoLocalDateTimeToDate(value.endAt));
  }
  openBorrowFromBadge(card) {
    if (this.availableQuantity(card) <= 0) {
      return;
    }
    this.openBorrowDialog(card);
  }
  onCardMenuAction(card, event) {
    if (event.actionId === "viewAsset") {
      this.openAssetView(card, new Event("click"));
      return;
    }
    if (event.actionId === "contactOwner") {
      void this.openServiceChat(card, new Event("click"));
      return;
    }
    if (event.actionId === "shareAsset") {
      this.openShareDialog(card);
      return;
    }
    if (event.actionId === "reportOwner") {
      this.reportOwner(card, new Event("click"));
      return;
    }
    if (event.actionId === "borrowAsset") {
      this.openBorrowDialog(card, new Event("click"));
    }
  }
  borrowDrafts() {
    return this.borrowDraftsViewState();
  }
  borrowDraftCount() {
    return this.borrowDrafts().length;
  }
  borrowDraftMenuTrigger() {
    const count = this.borrowDraftCount();
    return {
      icon: "shopping_basket",
      closeIcon: "close",
      ariaLabel: count === 1 ? "Open borrow basket with 1 request" : `Open borrow basket with ${count} requests`,
      counter: count,
      hideLabel: true,
      layout: "icon",
      palette: "orange"
    };
  }
  borrowDraftMenuItems() {
    return this.borrowDrafts().map((entry) => ({
      id: `borrow-draft-${entry.cardId}`,
      label: entry.title,
      description: [
        entry.timeframe || "Pending borrow window",
        `Quantity ${entry.quantity} \xB7 ${entry.availabilityLabel}`
      ].join("\n"),
      detail: this.borrowDraftMenuStatusLabel(entry),
      icon: "assignment_return",
      kind: "action",
      palette: this.borrowDraftMenuPalette(entry),
      surface: "tinted",
      layout: "pill",
      removable: true,
      removeIcon: "close",
      removeAriaLabel: `Clear ${entry.title}`,
      context: { menu: "asset-explore-borrow-draft", entry }
    }));
  }
  borrowDraftMenuStatusLabel(entry) {
    return this.borrowDraftUnavailable(entry) ? this.i18n.translate("asset.borrow.review") : this.i18n.translate("asset.borrow.continue");
  }
  borrowDraftMenuPalette(entry) {
    return this.borrowDraftUnavailable(entry) ? "amber" : "orange";
  }
  borrowDraftUnavailable(entry) {
    const availability = entry.availabilityLabel.trim().toLowerCase();
    return availability.startsWith("0 ") || availability.includes("unavailable");
  }
  continueBorrowDraft(cardId, event) {
    event?.stopPropagation();
    this.resumeBorrowDraft(cardId, event);
  }
  assetView() {
    const viewId = `${this.resourcePopupStore.assetExploreAssetViewIdRef() ?? ""}`.trim();
    const context = this.resourcePopupStore.popupContextRef();
    if (!viewId || !context) {
      return null;
    }
    const card = this.resourcePopupStore.assetExplorePopupRef()?.cards.find((item) => item.id === viewId) ?? null;
    if (!card) {
      return null;
    }
    const resourceCard = this.assetCardToResourceCard(card, context.subEvent.id);
    return {
      card: resourceCard,
      mode: "view",
      source: this.cloneAsset(card)
    };
  }
  openAssetView(card, event) {
    event?.stopPropagation();
    this.resourcePopupStore.assetExploreAssetViewIdRef.set(null);
    this.resourcePopupStore.assetExploreBorrowDialogRef.set(null);
    void this.openReadonlyAssetEditor(card);
  }
  async openReadonlyAssetEditor(card) {
    const viewerUserId = `${this.activeUser().id ?? ""}`.trim();
    const generation = this.assetStore.openAssetEditorEdit({
      cardId: card.id,
      form: AssetCardBuilder.buildAssetFormFromCard(card),
      visibility: AssetCardBuilder.visibilityFromCard(card),
      loading: Boolean(viewerUserId),
      readOnly: true,
      parentZIndex: this.assetExplorePopupZIndex()
    });
    void this.assetPopupStore.ensureAssetPopupLoaded();
    if (!viewerUserId) {
      this.assetStore.setAssetEditorLoading(false);
      return;
    }
    try {
      const loadedCard = await this.assetsService.loadOwnedAssetDetailById(viewerUserId, card.id);
      if (!this.assetStore.isCurrentAssetEditorLoad(generation, card.id)) {
        return;
      }
      if (loadedCard) {
        this.assetStore.applyAssetEditorForm(loadedCard.id, AssetCardBuilder.visibilityFromCard(loadedCard), AssetCardBuilder.buildAssetFormFromCard(loadedCard));
      }
      this.assetStore.setAssetEditorLoading(false);
    } catch {
      if (this.assetStore.isCurrentAssetEditorLoad(generation, card.id)) {
        this.assetStore.setAssetEditorLoading(false);
      }
    }
  }
  closeAssetView(event) {
    event?.stopPropagation();
    this.resourcePopupStore.assetExploreAssetViewIdRef.set(null);
  }
  closeExplorePopup(event) {
    event?.stopPropagation();
    this.resourcePopupStore.assetExploreAssetViewIdRef.set(null);
    if (this.resourcePopupStore.assetExploreOnlyRef()) {
      this.resourcePopupStore.closeResourcePopup();
      return;
    }
    this.resourcePopupStore.assetExploreBorrowDialogRef.set(null);
    this.resourcePopupStore.assetExplorePopupRef.set(null);
  }
  setDateRange(start, end) {
    const popup = this.resourcePopupStore.assetExplorePopupRef();
    if (!popup) {
      return;
    }
    const dateUnchanged = (current, selected) => {
      if (!selected) {
        return true;
      }
      const previous = AppUtils.isoLocalDateTimeToDate(current);
      return previous !== null && previous.getFullYear() === selected.getFullYear() && previous.getMonth() === selected.getMonth() && previous.getDate() === selected.getDate();
    };
    if (dateUnchanged(popup.startAtIso, start) && dateUnchanged(popup.endAtIso, end)) {
      return;
    }
    this.resourcePopupStore.assetExplorePopupRef.set(this.resolvePopupState(__spreadProps(__spreadValues({}, popup), {
      startAtIso: AppUtils.applyDatePartToIsoLocal(popup.startAtIso, start),
      endAtIso: AppUtils.applyDatePartToIsoLocal(popup.endAtIso, end)
    })));
  }
  assetExploreDateRangeModel(bounds) {
    return {
      mode: "range",
      precision: "date",
      valueFormat: "iso-date-time",
      range: {
        layout: "compact",
        bounds: {
          start: bounds.startAtIso,
          end: bounds.endAtIso
        },
        start: {
          placeholder: "Start date",
          min: bounds.startAtIso,
          max: bounds.endAtIso
        },
        end: {
          placeholder: "End date",
          min: bounds.startAtIso,
          max: bounds.endAtIso
        }
      }
    };
  }
  isDateInputRangeValue(value) {
    return !!value && typeof value === "object" && "startAt" in value && "endAt" in value;
  }
  setBorrowDateRange(start, end) {
    const dialog = this.resourcePopupStore.assetExploreBorrowDialogRef();
    if (!dialog || !dialog.borrowWindow) {
      return;
    }
    const card = this.resolveCard(dialog.cardId);
    if (!card) {
      return;
    }
    const normalizedWindow = this.normalizeBorrowSelectionToWindow(start ? AppUtils.toIsoDateTimeLocal(start) : dialog.startAtIso, end ? AppUtils.toIsoDateTimeLocal(end) : dialog.endAtIso, dialog.borrowWindow);
    if (!normalizedWindow) {
      return;
    }
    const { startAtIso, endAtIso } = normalizedWindow;
    const availableQuantity = this.availableQuantityForWindow(card, startAtIso, endAtIso);
    const invalidated = this.invalidateBorrowCheckout(dialog);
    const quantity = _EventResourceAssetExploreComponent.BORROW_QUANTITY;
    this.resourcePopupStore.assetExploreBorrowDialogRef.set(__spreadProps(__spreadValues({}, invalidated), {
      startAtIso,
      endAtIso,
      availableQuantity,
      quantity,
      acceptedPolicyIds: [...invalidated.acceptedPolicyIds],
      error: this.borrowAvailabilityError(quantity, availableQuantity)
    }));
    this.persistChangedBorrowDraft();
  }
  setBorrowTime(edge, value) {
    const dialog = this.resourcePopupStore.assetExploreBorrowDialogRef();
    if (!dialog || !dialog.borrowWindow) {
      return;
    }
    const card = this.resolveCard(dialog.cardId);
    if (!card) {
      return;
    }
    const normalizedWindow = this.normalizeBorrowSelectionToWindow(edge === "start" ? AppUtils.applyTimePartToIsoLocal(dialog.startAtIso, value) : dialog.startAtIso, edge === "end" ? AppUtils.applyTimePartToIsoLocal(dialog.endAtIso, value) : dialog.endAtIso, dialog.borrowWindow);
    if (!normalizedWindow) {
      return;
    }
    const { startAtIso, endAtIso } = normalizedWindow;
    const availableQuantity = this.availableQuantityForWindow(card, startAtIso, endAtIso);
    const invalidated = this.invalidateBorrowCheckout(dialog);
    const quantity = _EventResourceAssetExploreComponent.BORROW_QUANTITY;
    this.resourcePopupStore.assetExploreBorrowDialogRef.set(__spreadProps(__spreadValues({}, invalidated), {
      startAtIso,
      endAtIso,
      availableQuantity,
      quantity,
      acceptedPolicyIds: [...invalidated.acceptedPolicyIds],
      error: this.borrowAvailabilityError(quantity, availableQuantity)
    }));
    this.persistChangedBorrowDraft();
  }
  onBorrowQuantityChange(value) {
    const dialog = this.resourcePopupStore.assetExploreBorrowDialogRef();
    if (!dialog || dialog.busy) {
      return;
    }
    void value;
    this.resourcePopupStore.assetExploreBorrowDialogRef.set(__spreadProps(__spreadValues({}, dialog), {
      quantity: _EventResourceAssetExploreComponent.BORROW_QUANTITY,
      error: this.borrowAvailabilityError(_EventResourceAssetExploreComponent.BORROW_QUANTITY, dialog.availableQuantity)
    }));
  }
  normalizeBorrowQuantityOnBlur(value) {
    this.onBorrowQuantityChange(value);
  }
  toggleBorrowPolicy(policyId) {
    const dialog = this.resourcePopupStore.assetExploreBorrowDialogRef();
    if (!dialog || dialog.busy) {
      return;
    }
    const normalizedPolicyId = `${policyId ?? ""}`.trim();
    if (!normalizedPolicyId) {
      return;
    }
    const card = this.resolveCard(dialog.cardId);
    const policy = (card && AssetCardBuilder.assetPoliciesEnabled(card) ? card.policies ?? [] : []).find((item) => `${item.id ?? ""}`.trim() === normalizedPolicyId);
    if (!policy || policy.required !== false) {
      return;
    }
    const nextAccepted = new Set(dialog.acceptedPolicyIds);
    if (nextAccepted.has(normalizedPolicyId)) {
      nextAccepted.delete(normalizedPolicyId);
    } else {
      nextAccepted.add(normalizedPolicyId);
    }
    const invalidated = this.invalidateBorrowCheckout(dialog);
    this.resourcePopupStore.assetExploreBorrowDialogRef.set(__spreadProps(__spreadValues({}, invalidated), {
      acceptedPolicyIds: [...nextAccepted],
      error: null
    }));
    this.persistChangedBorrowDraft();
  }
  backToBorrowDetails(event) {
    event?.stopPropagation();
    const dialog = this.resourcePopupStore.assetExploreBorrowDialogRef();
    if (!dialog || dialog.busy || !dialog.paymentStep) {
      return;
    }
    this.resourcePopupStore.assetExploreBorrowDialogRef.set(__spreadProps(__spreadValues({}, dialog), {
      paymentStep: false,
      error: null
    }));
  }
  canSubmitBorrow() {
    const dialog = this.resourcePopupStore.assetExploreBorrowDialogRef();
    if (!dialog || dialog.busy || dialog.availableQuantity <= 0) {
      return false;
    }
    const card = this.resolveCard(dialog.cardId);
    if (!card) {
      return false;
    }
    const acceptedPolicyIds = new Set(dialog.acceptedPolicyIds.map((item) => item.trim()).filter(Boolean));
    if ((AssetCardBuilder.assetPoliciesEnabled(card) ? card.policies ?? [] : []).some((policy) => policy.required !== false && !acceptedPolicyIds.has(`${policy.id ?? ""}`.trim()))) {
      return false;
    }
    const pricing = this.resolveBorrowPricing(card, dialog.startAtIso, dialog.endAtIso, _EventResourceAssetExploreComponent.BORROW_QUANTITY);
    if (dialog.paymentStep && !this.cashOnly() && pricing.amount > 0 && !dialog.paymentMethod) {
      return false;
    }
    const borrowWindow = dialog.borrowWindow;
    return borrowWindow !== null && this.isBorrowSelectionWithinWindow(dialog.startAtIso, dialog.endAtIso, borrowWindow);
  }
  confirmBorrow(event) {
    event?.stopPropagation();
    const dialog = this.resourcePopupStore.assetExploreBorrowDialogRef();
    const popup = this.resourcePopupStore.assetExplorePopupRef();
    const context = this.resourcePopupStore.popupContextRef();
    if (!dialog || !popup || !context) {
      return;
    }
    const card = this.resolveCard(dialog.cardId);
    if (!card) {
      this.resourcePopupStore.assetExplorePopupRef.set(__spreadProps(__spreadValues({}, popup), {
        error: this.i18n.translate("asset.borrow.error.no.longer.available")
      }));
      this.resourcePopupStore.assetExploreBorrowDialogRef.set(null);
      return;
    }
    const availableQuantity = this.availableQuantityForWindow(card, dialog.startAtIso, dialog.endAtIso);
    const quantity = _EventResourceAssetExploreComponent.BORROW_QUANTITY;
    const availabilityError = this.borrowAvailabilityError(quantity, availableQuantity);
    if (availabilityError) {
      const invalidated = this.invalidateBorrowCheckout(dialog);
      this.resourcePopupStore.assetExploreBorrowDialogRef.set(__spreadProps(__spreadValues({}, invalidated), {
        availableQuantity,
        quantity,
        acceptedPolicyIds: [...invalidated.acceptedPolicyIds],
        error: availabilityError
      }));
      return;
    }
    if (!this.canSubmitBorrow()) {
      return;
    }
    const activeUser = this.activeUser();
    const requestVersion = ++this.pendingBorrowRequestVersion;
    const pricing = this.resolveBorrowPricing(card, dialog.startAtIso, dialog.endAtIso, quantity);
    const paymentRequired = pricing.amount > 0;
    const onlinePayment = paymentRequired && !this.cashOnly();
    const lineItems = [
      {
        id: `resource:${card.id}`,
        kind: "resource",
        label: card.title,
        detail: this.timeframeLabel(dialog.startAtIso, dialog.endAtIso) || this.i18n.translate("asset.borrow.request"),
        amount: pricing.amount,
        currency: pricing.currency
      }
    ];
    const pricingSummaryRows = pricing.rows.map((row) => __spreadValues({}, row));
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    const expiresAtIso = new Date(Date.now() + _EventResourceAssetExploreComponent.BORROW_BASKET_TTL_MS).toISOString();
    const checkoutRequest = paymentRequired ? {
      userId: activeUser.id,
      sourceId: card.id,
      slotSourceId: null,
      optionalSubEventIds: [],
      assetSelections: [
        {
          subEventId: context.subEvent.id,
          resourceType: card.type
        }
      ],
      acceptedPolicyIds: [...dialog.acceptedPolicyIds],
      appliedPromoCodes: [],
      basketItems: [
        {
          id: `resource:${card.id}:${context.subEvent.id}`,
          kind: "resource",
          sourceId: card.id,
          slotSourceId: null,
          subEventId: context.subEvent.id,
          resourceType: card.type,
          label: card.title,
          detail: lineItems[0].detail,
          amount: pricing.amount,
          currency: pricing.currency,
          quantity,
          status: "confirmed",
          resultState: "pending",
          pricingSummaryRows,
          createdAtIso: nowIso,
          updatedAtIso: nowIso,
          expiresAtIso
        }
      ],
      pricingSummaryRows,
      checkoutState: "confirmed",
      lineItems,
      totalAmount: pricing.amount,
      currency: pricing.currency,
      paymentMethodId: onlinePayment ? dialog.paymentMethod?.id ?? null : null
    } : null;
    if (paymentRequired && !dialog.paymentStep) {
      if (this.borrowPaymentReviewStarted(dialog) && !this.borrowSelectionChanged(dialog)) {
        const nextDialog = __spreadProps(__spreadValues({}, dialog), {
          checkoutSessionId: null,
          paymentStep: true,
          busy: false,
          error: null
        });
        this.resourcePopupStore.assetExploreBorrowDialogRef.set(nextDialog);
        this.saveBorrowDraft(activeUser.id, context.subEvent.id, nextDialog);
        return;
      }
      this.resourcePopupStore.assetExploreBorrowDialogRef.set(__spreadProps(__spreadValues({}, dialog), {
        checkoutSessionId: null,
        paymentStep: false,
        busy: true,
        error: null
      }));
      void this.eventsService.saveCheckoutBasket(checkoutRequest).then((savedBasket) => {
        const currentDialog = this.resourcePopupStore.assetExploreBorrowDialogRef();
        if (!savedBasket || !currentDialog || requestVersion !== this.pendingBorrowRequestVersion) {
          throw new Error(this.i18n.translate("asset.borrow.error.checkout"));
        }
        const nextDialog = __spreadProps(__spreadValues({}, currentDialog), {
          checkoutSessionId: null,
          paymentStep: true,
          confirmedSelectionSignature: this.borrowSelectionSignature(currentDialog),
          expiresAtIso: savedBasket.expiresAtIso?.trim() || savedBasket.items.find((item) => item.expiresAtIso?.trim())?.expiresAtIso?.trim() || expiresAtIso,
          busy: false,
          error: null
        });
        this.resourcePopupStore.assetExploreBorrowDialogRef.set(nextDialog);
        this.saveBorrowDraft(activeUser.id, context.subEvent.id, nextDialog);
      }).catch((error) => {
        const currentDialog = this.resourcePopupStore.assetExploreBorrowDialogRef();
        if (!currentDialog || requestVersion !== this.pendingBorrowRequestVersion) {
          return;
        }
        this.resourcePopupStore.assetExploreBorrowDialogRef.set(__spreadProps(__spreadValues({}, currentDialog), {
          busy: false,
          error: this.errorMessage(error, this.i18n.translate("asset.borrow.error.checkout"))
        }));
      });
      return;
    }
    const providerWindow = onlinePayment ? this.paymentAuthorization.openProviderWindow() : null;
    let submittedRequestId = null;
    this.resourcePopupStore.assetExploreBorrowDialogRef.set(__spreadProps(__spreadValues({}, dialog), {
      busy: true,
      error: null
    }));
    const checkoutSessionPromise = onlinePayment ? this.eventsService.authorizeCheckout(checkoutRequest) : Promise.resolve(null);
    void checkoutSessionPromise.then(async (session) => {
      if (onlinePayment && (!session || !session.id)) {
        throw new Error(this.i18n.translate("asset.borrow.error.payment"));
      }
      if (onlinePayment && session) {
        const currentDialog = this.resourcePopupStore.assetExploreBorrowDialogRef();
        if (!currentDialog || requestVersion !== this.pendingBorrowRequestVersion) {
          throw new Error(this.i18n.translate("asset.borrow.error.payment"));
        }
        const pendingDialog = __spreadProps(__spreadValues({}, currentDialog), {
          checkoutSessionId: session.id,
          paymentStep: true,
          busy: true,
          error: null
        });
        this.resourcePopupStore.assetExploreBorrowDialogRef.set(pendingDialog);
        this.saveBorrowDraft(activeUser.id, context.subEvent.id, pendingDialog);
        await this.paymentAuthorization.completeCustomerAction(session, activeUser.id, card.id, providerWindow);
      }
      submittedRequestId = this.newBorrowRequestId(activeUser.id, card.id, context.subEvent.id);
      const nextRequest = {
        id: submittedRequestId,
        userId: activeUser.id,
        name: activeUser.name,
        initials: activeUser.initials,
        gender: activeUser.gender,
        status: "pending",
        note: onlinePayment ? this.i18n.translate("asset.borrow.note.payment.approved") : paymentRequired ? this.i18n.translate("asset.borrow.note.cash.payment") : this.i18n.translate("asset.borrow.note.awaiting.owner"),
        requestKind: "borrow",
        requestedAtIso: (/* @__PURE__ */ new Date()).toISOString(),
        booking: this.bookingForRange(context.subEvent, context.ownerId, context.parentTitle, dialog.startAtIso, dialog.endAtIso, quantity, {
          totalAmount: pricing.amount,
          currency: pricing.currency,
          acceptedPolicyIds: dialog.acceptedPolicyIds,
          paymentSessionId: session?.id ?? dialog.checkoutSessionId ?? null,
          inventoryApplied: false
        })
      };
      const nextCard = __spreadProps(__spreadValues({}, card), {
        quantity: AssetCardBuilder.storedQuantityValue(card),
        requests: [
          nextRequest,
          ...card.requests.filter((request) => request.id !== nextRequest.id).map((request) => __spreadProps(__spreadValues({}, request), {
            booking: request.booking ? __spreadProps(__spreadValues({}, request.booking), {
              acceptedPolicyIds: [...request.booking.acceptedPolicyIds ?? []]
            }) : null
          }))
        ]
      });
      return this.assetsService.saveOwnedAsset(dialog.ownerUserId, this.toAssetDetailDto(nextCard));
    }).then(async (savedCard) => {
      const currentDialog = this.resourcePopupStore.assetExploreBorrowDialogRef();
      const currentPopup = this.resourcePopupStore.assetExplorePopupRef();
      if (!currentDialog || !currentPopup || requestVersion !== this.pendingBorrowRequestVersion) {
        return;
      }
      const persistedState = await this.persistBorrowedAssetAssignment(context, savedCard);
      const persistedDialog = this.resourcePopupStore.assetExploreBorrowDialogRef();
      const persistedPopup = this.resourcePopupStore.assetExplorePopupRef();
      if (!persistedDialog || !persistedPopup || requestVersion !== this.pendingBorrowRequestVersion) {
        return;
      }
      if (checkoutRequest) {
        await this.eventsService.updateCheckoutBasketState({
          userId: activeUser.id,
          sourceId: card.id,
          slotSourceId: null,
          checkoutState: onlinePayment ? "pay" : "confirmed",
          resultState: "succeeded",
          checkoutSessionId: persistedDialog.checkoutSessionId,
          checkoutRequest
        });
      }
      this.clearBorrowDraftState(activeUser.id, context.subEvent.id, currentDialog.cardId);
      this.signalBorrowedAssetMemberDelta(context, savedCard, persistedState, submittedRequestId);
      this.attachBoughtAssetToSubEventLocally(context, savedCard, persistedState);
      this.clearLocalReservation(context.subEvent.id, savedCard.id);
      const remainingAvailability = this.availableQuantityForWindow(savedCard, currentDialog.startAtIso, currentDialog.endAtIso);
      const nextCards = remainingAvailability <= 0 ? persistedPopup.cards.filter((cardItem) => cardItem.id !== savedCard.id) : persistedPopup.cards.map((cardItem) => cardItem.id === savedCard.id ? this.cloneAsset(savedCard) : cardItem);
      this.resourcePopupStore.assetExplorePopupRef.set(__spreadProps(__spreadValues({}, persistedPopup), {
        cards: nextCards
      }));
      this.dismissBorrowDialog(persistedDialog);
    }).catch((error) => {
      const currentDialog = this.resourcePopupStore.assetExploreBorrowDialogRef();
      if (!currentDialog || requestVersion !== this.pendingBorrowRequestVersion) {
        return;
      }
      if (checkoutRequest) {
        void this.eventsService.updateCheckoutBasketState({
          userId: activeUser.id,
          sourceId: card.id,
          slotSourceId: null,
          checkoutState: onlinePayment ? "pay" : "confirmed",
          resultState: "failed",
          checkoutSessionId: currentDialog.checkoutSessionId,
          checkoutRequest
        });
      }
      this.resourcePopupStore.assetExploreBorrowDialogRef.set(__spreadProps(__spreadValues({}, currentDialog), {
        busy: false,
        error: this.errorMessage(error, this.i18n.translate("asset.borrow.error.send"))
      }));
    }).finally(() => this.paymentAuthorization.closeProviderWindow(providerWindow));
  }
  closeBorrowDialog(event) {
    event?.stopPropagation();
    const dialog = this.resourcePopupStore.assetExploreBorrowDialogRef();
    if (dialog?.busy) {
      return;
    }
    const context = this.resourcePopupStore.popupContextRef();
    const activeUserId = this.activeUser().id.trim();
    if (dialog && context && !dialog.busy && this.shouldPersistBorrowDraft(dialog, context.subEvent.id, activeUserId)) {
      this.saveBorrowDraft(activeUserId, context.subEvent.id, dialog);
    }
    this.dismissBorrowDialog(dialog);
  }
  dismissBorrowDialog(dialog) {
    this.resourcePopupStore.assetExploreBorrowDialogRef.set(null);
    const checkout = this.assetStore.assetFormCheckout();
    if (checkout?.mode === "borrow" && (!dialog || checkout.sourceId === dialog.cardId)) {
      this.assetStore.closeAssetEditor();
    }
  }
  requestCancelBorrowLifecycle(event) {
    event?.preventDefault();
    event?.stopPropagation();
    const dialog = this.resourcePopupStore.assetExploreBorrowDialogRef();
    if (!dialog || dialog.busy) {
      return;
    }
    const context = this.resourcePopupStore.popupContextRef();
    const activeUserId = this.activeUser().id.trim();
    const persistedDraft = context && activeUserId ? this.readBorrowDraft(activeUserId, context.subEvent.id, dialog.cardId) : null;
    const lifecycleStarted = Boolean(dialog.confirmedSelectionSignature || dialog.checkoutSessionId || dialog.paymentStep || persistedDraft?.confirmedSelectionSignature);
    if (!lifecycleStarted) {
      this.dismissBorrowDialog(dialog);
      return;
    }
    const card = this.resolveCard(dialog.cardId);
    this.dialogStore.open({
      title: "Cancel borrow?",
      message: card?.title ?? "Borrow",
      warningMessage: "The current borrow basket will be cancelled and removed.",
      cancelLabel: "Back",
      confirmLabel: "Cancel borrow",
      busyConfirmLabel: "Cancelling...",
      confirmTone: "danger",
      confirmPalette: "danger",
      failureMessage: "Unable to cancel this borrow.",
      onConfirm: async () => this.cancelBorrowLifecycle(dialog)
    });
  }
  async cancelBorrowLifecycle(dialog) {
    const currentDialog = this.resourcePopupStore.assetExploreBorrowDialogRef();
    const context = this.resourcePopupStore.popupContextRef();
    const activeUserId = this.activeUser().id.trim();
    if (!currentDialog || currentDialog.cardId !== dialog.cardId || !context || !activeUserId) {
      throw new Error("Unable to resolve the current borrow basket.");
    }
    await this.eventsService.updateCheckoutBasketState({
      userId: activeUserId,
      sourceId: dialog.cardId,
      slotSourceId: null,
      checkoutState: "cancelled",
      resultState: "deleted",
      checkoutSessionId: currentDialog.checkoutSessionId
    });
    this.clearBorrowDraftState(activeUserId, context.subEvent.id, dialog.cardId);
    this.dismissBorrowDialog(currentDialog);
  }
  resumeBorrowDraft(cardId, event) {
    event?.stopPropagation();
    const card = this.resolveCard(cardId);
    if (!card) {
      const popup = this.resourcePopupStore.assetExplorePopupRef();
      if (popup) {
        this.resourcePopupStore.assetExplorePopupRef.set(__spreadProps(__spreadValues({}, popup), {
          error: "This basket item is no longer available for the selected date range."
        }));
      }
      return;
    }
    this.openBorrowDialog(card, event);
  }
  clearBorrowDraft(cardId, event) {
    event?.stopPropagation();
    const context = this.resourcePopupStore.popupContextRef();
    const activeUserId = this.activeUser().id.trim();
    if (!context || !activeUserId) {
      return;
    }
    this.clearBorrowDraftState(activeUserId, context.subEvent.id, cardId);
    if (this.resourcePopupStore.assetExploreBorrowDialogRef()?.cardId === cardId) {
      this.resourcePopupStore.assetExploreBorrowDialogRef.set(null);
    }
  }
  async loadSmartListPage(query) {
    const popup = this.resourcePopupStore.assetExplorePopupRef();
    if (!popup) {
      return {
        items: [],
        total: 0,
        nextCursor: null
      };
    }
    const page = Math.max(0, Math.trunc(Number(query.page) || 0));
    const pageSize = Math.max(1, Math.trunc(Number(query.pageSize) || 1));
    const basePageSize = Math.max(1, Math.trunc(Number(query.pageSize) || Number(this.smartListConfig.pageSize) || 1));
    const initialPageSize = this.initialPageSize(basePageSize);
    const size = page === 0 ? Math.max(pageSize, initialPageSize) : pageSize;
    const pageQuery = __spreadProps(__spreadValues({}, this.queryFromPopup(popup)), {
      page,
      pageSize: size,
      cursor: query.cursor ?? null,
      order: this.order
    });
    const requestKey = this.queryKey(pageQuery, pageQuery.order);
    try {
      const result = await this.assetsService.queryVisibleAssetsPage(pageQuery);
      const current = this.resourcePopupStore.assetExplorePopupRef();
      if (!current || this.queryKey(this.queryFromPopup(current), pageQuery.order) !== requestKey) {
        return {
          items: [],
          total: 0,
          nextCursor: null
        };
      }
      if (result.checkoutResultStates !== void 0) {
        this.assetBorrowDraftStore.reconcileServerCheckoutStates(this.activeUser().id, current.subEventId, result.items.map((card) => card.id), result.checkoutResultStates);
      }
      const items = result.items.map((card) => this.cloneAsset(card));
      this.mergeLoadedPage(current, items, pageQuery);
      return {
        items,
        total: result.total,
        nextCursor: result.nextCursor ?? null
      };
    } catch {
      const current = this.resourcePopupStore.assetExplorePopupRef();
      if (current && this.queryKey(this.queryFromPopup(current), pageQuery.order) === requestKey) {
        this.resourcePopupStore.assetExplorePopupRef.set(__spreadProps(__spreadValues({}, current), {
          loading: false,
          error: current.cards.length > 0 ? null : "Unable to load visible assets right now."
        }));
      }
      return {
        items: [],
        total: 0,
        nextCursor: null
      };
    }
  }
  syncVisibleCards(cards, previousCardCount) {
    if (!this.listReady || !this.smartList) {
      return;
    }
    const visibleCount = Math.max(this.listVisibleCount, this.smartList.itemsSnapshot().length);
    const allCardsWereVisible = visibleCount >= previousCardCount;
    let nextVisibleCount = Math.min(cards.length, visibleCount);
    if (cards.length > previousCardCount && allCardsWereVisible) {
      nextVisibleCount = Math.min(cards.length, visibleCount + (cards.length - previousCardCount));
    }
    const orderedCards = this.cardsForView(cards);
    this.smartList.replaceVisibleItems(orderedCards.slice(0, nextVisibleCount), {
      total: Math.max(orderedCards.length, this.listTotal)
    });
  }
  mergeLoadedPage(popup, items, query) {
    const replace = Math.max(0, Math.trunc(Number(query.page) || 0)) === 0 && !`${query.cursor ?? ""}`.trim();
    const nextById = /* @__PURE__ */ new Map();
    const source = replace ? [] : popup.cards;
    for (const card of source) {
      nextById.set(card.id, this.cloneAsset(card));
    }
    for (const card of items) {
      nextById.set(card.id, this.cloneAsset(card));
    }
    this.resourcePopupStore.assetExplorePopupRef.set(__spreadProps(__spreadValues({}, popup), {
      loading: false,
      error: null,
      cards: [...nextById.values()]
    }));
  }
  cardsForView(source = this.popupViewState()?.cards ?? []) {
    const availability = (card) => this.availableQuantity(card);
    const cards = [...source].filter((card) => availability(card) > 0);
    const price = (card) => this.priceAmount(card);
    const policyCount = (card) => AssetCardBuilder.assetPoliciesEnabled(card) ? (card.policies ?? []).length : 0;
    cards.sort((left, right) => {
      if (this.order === "lowest-price") {
        const priceDelta = price(left) - price(right);
        if (priceDelta !== 0) {
          return priceDelta;
        }
        const availabilityDelta = availability(right) - availability(left);
        if (availabilityDelta !== 0) {
          return availabilityDelta;
        }
      } else if (this.order === "fewest-policies") {
        const policyDelta = policyCount(left) - policyCount(right);
        if (policyDelta !== 0) {
          return policyDelta;
        }
        const availabilityDelta = availability(right) - availability(left);
        if (availabilityDelta !== 0) {
          return availabilityDelta;
        }
      } else {
        const availabilityDelta = availability(right) - availability(left);
        if (availabilityDelta !== 0) {
          return availabilityDelta;
        }
        const priceDelta = price(left) - price(right);
        if (priceDelta !== 0) {
          return priceDelta;
        }
      }
      return left.title.localeCompare(right.title) || (left.ownerName ?? "").localeCompare(right.ownerName ?? "") || left.id.localeCompare(right.id);
    });
    return cards;
  }
  groupLabel(card) {
    if (this.order === "lowest-price") {
      const amount = this.priceAmount(card);
      if (amount <= 0) {
        return "Free borrow";
      }
      if (amount < 20) {
        return "Under $20";
      }
      if (amount < 40) {
        return "$20 - $39";
      }
      return "$40 and up";
    }
    if (this.order === "fewest-policies") {
      const count = AssetCardBuilder.assetPoliciesEnabled(card) ? (card.policies ?? []).length : 0;
      if (count <= 0) {
        return "No policies";
      }
      if (count === 1) {
        return "1 policy";
      }
      return "2+ policies";
    }
    const available = this.availableQuantity(card);
    if (available <= 0) {
      return "Booked out";
    }
    if (available === 1) {
      return "1 left";
    }
    if (available <= 3) {
      return "2-3 left";
    }
    return "4+ left";
  }
  selectCategory(type, category, event) {
    event?.stopPropagation();
    const popup = this.resourcePopupStore.assetExplorePopupRef();
    if (!popup) {
      return;
    }
    const normalizedCategory = AssetDefaultsBuilder.assetCategoryLabel(category);
    const nextCategory = normalizedCategory ? AssetDefaultsBuilder.normalizeCategory(type, normalizedCategory) : "";
    if (type === popup.type && nextCategory === popup.category) {
      return;
    }
    this.resourcePopupStore.assetExplorePopupRef.set(this.resolvePopupState(__spreadProps(__spreadValues({}, popup), {
      type,
      category: nextCategory
    })));
  }
  resolvePopupState(popup) {
    return __spreadProps(__spreadValues({}, popup), {
      loading: true,
      error: null,
      cards: []
    });
  }
  queryFromPopup(popup) {
    return {
      userId: this.activeUser().id,
      type: popup.type,
      category: popup.category,
      startAtIso: popup.startAtIso,
      endAtIso: popup.endAtIso
    };
  }
  queryKey(query, order = this.order) {
    return [
      query.userId.trim(),
      query.type,
      `${query.category ?? ""}`.trim(),
      `${query.startAtIso ?? ""}`.trim(),
      `${query.endAtIso ?? ""}`.trim(),
      order
    ].join("|");
  }
  availabilityLabel(card) {
    const available = this.availableQuantity(card);
    if (available <= 0) {
      return "0 left";
    }
    return `${available} left`;
  }
  availableQuantity(card) {
    const popup = this.resourcePopupStore.assetExplorePopupRef();
    if (!popup) {
      return 0;
    }
    return this.availableQuantityForWindow(card, popup.startAtIso, popup.endAtIso);
  }
  availableQuantityForWindow(card, startAtIso, endAtIso) {
    const totalQuantity = AssetCardBuilder.storedQuantityValue(card);
    const overlappingCommitted = card.requests.filter((request) => request.status === "accepted" || request.requestKind === "manual" || request.status === "pending" && request.requestKind === "borrow").filter((request) => request.booking?.inventoryApplied !== true).filter((request) => this.isWindowOverlap(request, startAtIso, endAtIso)).reduce((sum, request) => sum + this.requestQuantity(request), 0);
    const locallyReserved = this.localReservedQuantity(card, startAtIso, endAtIso);
    return Math.max(0, totalQuantity - overlappingCommitted - locallyReserved);
  }
  localReservedQuantity(card, startAtIso, endAtIso) {
    const subEventId = `${this.resourcePopupStore.popupContextRef()?.subEvent.id ?? ""}`.trim();
    if (!subEventId) {
      return 0;
    }
    const reservation = this.localReservationsByKey.get(this.localReservationKey(subEventId, card.id));
    if (!reservation) {
      return 0;
    }
    return this.isRangeOverlap(reservation.startAtIso, reservation.endAtIso, startAtIso, endAtIso) ? reservation.quantity : 0;
  }
  rememberLocalReservation(subEventId, assetId, startAtIso, endAtIso, quantity) {
    const normalizedSubEventId = subEventId.trim();
    const normalizedAssetId = assetId.trim();
    if (!normalizedSubEventId || !normalizedAssetId) {
      return;
    }
    this.localReservationsByKey.set(this.localReservationKey(normalizedSubEventId, normalizedAssetId), {
      startAtIso: startAtIso.trim(),
      endAtIso: endAtIso.trim(),
      quantity: Math.max(1, Math.trunc(Number(quantity) || 1))
    });
  }
  clearLocalReservation(subEventId, assetId) {
    const normalizedSubEventId = subEventId.trim();
    const normalizedAssetId = assetId.trim();
    if (!normalizedSubEventId || !normalizedAssetId) {
      return;
    }
    this.localReservationsByKey.delete(this.localReservationKey(normalizedSubEventId, normalizedAssetId));
  }
  localReservationKey(subEventId, assetId) {
    return `${subEventId}:${assetId}`;
  }
  async openServiceChat(card, event) {
    event?.stopPropagation();
    const context = this.resourcePopupStore.popupContextRef();
    const activeUserId = this.activeUser().id.trim();
    const ownerUserId = `${card.ownerUserId ?? ""}`.trim();
    if (!context || !activeUserId || !ownerUserId || ownerUserId === activeUserId) {
      return;
    }
    const activeUser = this.activeUser();
    const eventId = ActivityResourceBuilder.runtimeResourceScopeIdentity({
      ownerId: context.ownerId,
      subEventId: context.subEvent.id,
      groupId: context.groupId,
      runtimeKind: context.subEvent.runtimeKind,
      eventId: context.subEvent.eventId
    }).eventId;
    const chat = {
      id: `c-service-asset-${card.id}-${context.subEvent.id}-${activeUserId}`,
      avatar: AppUtils.initialsFromText(card.ownerName || card.title),
      title: `Ask Asset Owner \xB7 ${card.title}`,
      lastMessage: `Service chat with the asset owner for ${card.title}.`,
      lastSenderId: ownerUserId,
      memberIds: [activeUserId, ownerUserId],
      members: ChatPopupHeaderContextConverter.memberSummaries([
        { id: activeUserId, user: activeUser },
        {
          id: ownerUserId,
          fallbackName: card.ownerName,
          imageUrl: card.ownerAvatarUrl
        }
      ]),
      unread: 0,
      dateIso: (/* @__PURE__ */ new Date()).toISOString(),
      channelType: "serviceEvent",
      serviceContext: "asset",
      assetId: card.id,
      ownerId: card.id,
      ownerUserId: activeUserId,
      eventId,
      subEventId: context.subEvent.id
    };
    await this.openStackedServiceChat(chat);
  }
  async openStackedServiceChat(chat) {
    await this.activitiesStore.ensureEventChatPopupLoaded();
    this.activitiesStore.openStackedEventChat(__spreadProps(__spreadValues({}, eventChatPopupRequestFromChat(chat)), {
      parentZIndex: this.assetExplorePopupZIndex()
    }), eventChatHeaderStateFromChat(chat));
  }
  openBorrowDialog(card, event) {
    event?.stopPropagation();
    const popup = this.resourcePopupStore.assetExplorePopupRef();
    const context = this.resourcePopupStore.popupContextRef();
    if (!popup || !context) {
      return;
    }
    const ownerUserId = `${card.ownerUserId ?? ""}`.trim();
    if (!ownerUserId) {
      return;
    }
    const activeUserId = this.activeUser().id.trim();
    const draft = this.readBorrowDraft(activeUserId, context.subEvent.id, card.id);
    const startAtIso = `${draft?.startAtIso ?? popup.startAtIso}`.trim() || popup.startAtIso;
    const endAtIso = `${draft?.endAtIso ?? popup.endAtIso}`.trim() || popup.endAtIso;
    const availableQuantity = this.availableQuantityForWindow(card, startAtIso, endAtIso);
    const requestedQuantity = _EventResourceAssetExploreComponent.BORROW_QUANTITY;
    const activePolicies = AssetCardBuilder.assetPoliciesEnabled(card) ? card.policies ?? [] : [];
    const validPolicyIds = new Set(activePolicies.map((policy) => `${policy.id ?? ""}`.trim()).filter(Boolean));
    const requiredPolicyIds = activePolicies.filter((policy) => policy.required !== false).map((policy) => `${policy.id ?? ""}`.trim()).filter(Boolean);
    if (popup.error) {
      this.resourcePopupStore.assetExplorePopupRef.set(__spreadProps(__spreadValues({}, popup), {
        error: null
      }));
    }
    const nextDialog = {
      cardId: card.id,
      ownerUserId,
      quantity: requestedQuantity,
      startAtIso,
      endAtIso,
      borrowWindow: null,
      availableQuantity,
      acceptedPolicyIds: [.../* @__PURE__ */ new Set([
        ...requiredPolicyIds,
        ...draft?.acceptedPolicyIds ?? []
      ])].map((policyId) => `${policyId ?? ""}`.trim()).filter((policyId) => validPolicyIds.has(policyId)),
      checkoutSessionId: `${draft?.checkoutSessionId ?? ""}`.trim() || null,
      paymentMethod: draft?.paymentMethod ? __spreadValues({}, draft.paymentMethod) : null,
      paymentStep: Boolean(draft?.confirmedSelectionSignature && !this.borrowDraftSelectionChanged(draft)),
      confirmedSelectionSignature: draft?.confirmedSelectionSignature ?? null,
      expiresAtIso: draft?.expiresAtIso ?? null,
      busy: false,
      error: this.borrowAvailabilityError(requestedQuantity, availableQuantity)
    };
    this.resourcePopupStore.assetExploreBorrowDialogRef.set(nextDialog);
    void this.openBorrowCheckoutEditor(card, nextDialog);
  }
  async openBorrowCheckoutEditor(card, dialog) {
    const ownerUserId = `${card.ownerUserId ?? dialog.ownerUserId ?? ""}`.trim();
    const generation = this.assetStore.openAssetEditorEdit({
      cardId: card.id,
      form: AssetCardBuilder.buildAssetFormFromCard(card),
      visibility: AssetCardBuilder.visibilityFromCard(card),
      loading: Boolean(ownerUserId),
      readOnly: true,
      parentZIndex: this.assetExplorePopupZIndex(),
      runtimeAssignment: this.borrowRuntimeAssignmentState(dialog),
      checkout: this.borrowCheckoutState(card, dialog)
    });
    void this.assetPopupStore.ensureAssetPopupLoaded();
    if (!ownerUserId) {
      this.assetStore.setAssetEditorLoading(false);
      return;
    }
    try {
      const context = this.resourcePopupStore.popupContextRef();
      if (!context) {
        throw new Error(this.i18n.translate("asset.borrow.error.checkout"));
      }
      const eventId = ActivityResourceBuilder.runtimeResourceScopeIdentity({
        ownerId: context.ownerId,
        subEventId: context.subEvent.id,
        groupId: context.groupId,
        runtimeKind: context.subEvent.runtimeKind,
        eventId: context.subEvent.eventId
      }).eventId;
      const loadedCard = await this.assetsService.loadOwnedAssetDetailById(ownerUserId, card.id, {
        eventId,
        subEventId: context.subEvent.id
      });
      if (!this.assetStore.isCurrentAssetEditorLoad(generation, card.id)) {
        return;
      }
      const loadedBorrowWindow = loadedCard?.borrowWindow;
      const borrowWindow = loadedBorrowWindow?.eventId.trim() === eventId && loadedBorrowWindow.subEventId.trim() === context.subEvent.id.trim() ? loadedBorrowWindow : null;
      const normalizedSelection = borrowWindow ? this.normalizeBorrowSelectionToWindow(dialog.startAtIso, dialog.endAtIso, borrowWindow) : null;
      if (loadedCard && borrowWindow && normalizedSelection) {
        this.assetStore.applyAssetEditorForm(loadedCard.id, AssetCardBuilder.visibilityFromCard(loadedCard), AssetCardBuilder.buildAssetFormFromCard(loadedCard));
        const popup = this.resourcePopupStore.assetExplorePopupRef();
        if (popup) {
          this.resourcePopupStore.assetExplorePopupRef.set(__spreadProps(__spreadValues({}, popup), {
            cards: popup.cards.map((item) => item.id === loadedCard.id ? this.cloneAsset(loadedCard) : item)
          }));
        }
        const currentDialog = this.resourcePopupStore.assetExploreBorrowDialogRef();
        if (currentDialog?.cardId === loadedCard.id) {
          const activePolicies = AssetCardBuilder.assetPoliciesEnabled(loadedCard) ? loadedCard.policies ?? [] : [];
          const validPolicyIds = new Set(activePolicies.map((policy) => `${policy.id ?? ""}`.trim()).filter(Boolean));
          const requiredPolicyIds = activePolicies.filter((policy) => policy.required !== false).map((policy) => `${policy.id ?? ""}`.trim()).filter(Boolean);
          const availableQuantity = this.availableQuantityForWindow(loadedCard, normalizedSelection.startAtIso, normalizedSelection.endAtIso);
          const quantity = _EventResourceAssetExploreComponent.BORROW_QUANTITY;
          this.resourcePopupStore.assetExploreBorrowDialogRef.set(__spreadProps(__spreadValues({}, currentDialog), {
            startAtIso: normalizedSelection.startAtIso,
            endAtIso: normalizedSelection.endAtIso,
            borrowWindow: __spreadValues({}, borrowWindow),
            availableQuantity,
            quantity,
            acceptedPolicyIds: [.../* @__PURE__ */ new Set([
              ...requiredPolicyIds,
              ...currentDialog.acceptedPolicyIds
            ])].filter((policyId) => validPolicyIds.has(policyId)),
            error: this.borrowAvailabilityError(quantity, availableQuantity)
          }));
        }
      } else {
        const currentDialog = this.resourcePopupStore.assetExploreBorrowDialogRef();
        if (currentDialog?.cardId === card.id) {
          this.resourcePopupStore.assetExploreBorrowDialogRef.set(__spreadProps(__spreadValues({}, currentDialog), {
            borrowWindow: null,
            error: this.i18n.translate("asset.borrow.error.checkout")
          }));
        }
      }
      this.assetStore.setAssetEditorLoading(false);
    } catch {
      if (this.assetStore.isCurrentAssetEditorLoad(generation, card.id)) {
        const currentDialog = this.resourcePopupStore.assetExploreBorrowDialogRef();
        if (currentDialog?.cardId === card.id) {
          this.resourcePopupStore.assetExploreBorrowDialogRef.set(__spreadProps(__spreadValues({}, currentDialog), {
            borrowWindow: null,
            error: this.i18n.translate("asset.borrow.error.checkout")
          }));
        }
        this.assetStore.setAssetEditorLoading(false);
      }
    }
  }
  syncBorrowCheckoutEditor(dialog) {
    const checkout = this.assetStore.assetFormCheckout();
    if (!this.assetStore.showAssetForm() || checkout?.mode !== "borrow" || checkout.sourceId !== dialog.cardId) {
      return;
    }
    const card = this.resolveCard(dialog.cardId);
    if (!card) {
      return;
    }
    const assignment = this.borrowRuntimeAssignmentState(dialog);
    this.assetStore.setAssetEditorRuntimeAssignmentState({
      quantity: assignment.quantity,
      quantityMax: assignment.quantityMax,
      quantityLabel: assignment.quantityLabel,
      quantityDescription: assignment.quantityDescription,
      editable: assignment.editable
    });
    this.assetStore.setAssetEditorCheckoutState(this.borrowCheckoutState(card, dialog));
  }
  borrowRuntimeAssignmentState(dialog) {
    const availableQuantity = Math.max(0, Math.trunc(Number(dialog.availableQuantity) || 0));
    return {
      quantity: _EventResourceAssetExploreComponent.BORROW_QUANTITY,
      quantityMax: _EventResourceAssetExploreComponent.BORROW_QUANTITY,
      quantityLabel: this.i18n.translate("quantity"),
      quantityDescription: this.i18n.translateParams(availableQuantity === 1 ? "asset.borrow.available.one" : "asset.borrow.available.many", { count: availableQuantity }),
      editable: false
    };
  }
  selectBorrowPaymentMethod(paymentMethod) {
    const dialog = this.resourcePopupStore.assetExploreBorrowDialogRef();
    if (!dialog || dialog.busy)
      return;
    this.resourcePopupStore.assetExploreBorrowDialogRef.set(__spreadProps(__spreadValues({}, dialog), {
      paymentMethod: __spreadValues({}, paymentMethod),
      checkoutSessionId: null,
      error: null
    }));
    this.persistChangedBorrowDraft();
  }
  borrowCheckoutState(card, dialog) {
    return {
      sourceId: card.id,
      mode: "borrow",
      phase: dialog.paymentStep ? "payment" : "review",
      cancellationPolicy: PricingBuilder.compactPricingConfig(card.pricing, {
        context: "asset",
        allowSlotFeatures: false
      }).cancellationPolicy,
      title: this.i18n.translateParams("asset.borrow.title", { asset: card.title }),
      subtitle: this.popupSubtitle(),
      dateRange: {
        startAt: dialog.startAtIso,
        endAt: dialog.endAtIso,
        precision: "minute"
      },
      dateRangeModel: this.borrowCheckoutDateRangeModel(dialog),
      availableQuantity: dialog.availableQuantity,
      pricingPreview: this.borrowPricingRuntimePreview(card, dialog.startAtIso, dialog.endAtIso, _EventResourceAssetExploreComponent.BORROW_QUANTITY),
      acceptedPolicyIds: [...dialog.acceptedPolicyIds],
      paymentMethod: dialog.paymentMethod ? __spreadValues({}, dialog.paymentMethod) : null,
      footerItems: this.borrowCheckoutFooterItems(card, dialog),
      busy: dialog.busy,
      error: dialog.error,
      onDateRangeChange: (value) => this.onBorrowCheckoutDateRangeChange(value),
      onPolicyToggle: (policyId) => this.toggleBorrowPolicy(policyId),
      onPaymentMethodChange: (paymentMethod) => this.selectBorrowPaymentMethod(paymentMethod),
      onFooterItemSelect: (itemId, sourceEvent) => {
        if (itemId === "borrow-cancel") {
          this.requestCancelBorrowLifecycle(sourceEvent);
          return;
        }
        if (itemId === "borrow-back") {
          this.backToBorrowDetails(sourceEvent);
          return;
        }
        this.confirmBorrow(sourceEvent);
      },
      onClose: () => this.closeBorrowDialog()
    };
  }
  borrowCheckoutFooterItems(card, dialog) {
    const pricing = this.resolveBorrowPricing(card, dialog.startAtIso, dialog.endAtIso, _EventResourceAssetExploreComponent.BORROW_QUANTITY);
    const submitLabel = dialog.busy ? pricing.amount > 0 ? this.borrowBusyLabel(dialog) : this.i18n.translate("asset.borrow.sending.request") : pricing.amount > 0 ? this.borrowSubmitLabel(dialog) : this.i18n.translate("asset.borrow.send.request");
    const hasError = !dialog.busy && Boolean(dialog.error);
    const paymentReviewStarted = pricing.amount > 0 && this.borrowPaymentReviewStarted(dialog);
    const items = [];
    if (dialog.paymentStep) {
      items.push({
        id: "borrow-back",
        label: this.i18n.translate("back"),
        layout: "action",
        palette: "neutral",
        disabled: dialog.busy
      });
    }
    items.push({
      id: "borrow-cancel",
      label: this.i18n.translate("cancel"),
      layout: "action",
      palette: "danger",
      disabled: dialog.busy
    }, {
      id: "borrow-confirm",
      label: submitLabel,
      layout: "action",
      palette: hasError ? "danger" : paymentReviewStarted ? this.borrowSelectionChanged(dialog) ? "orange" : "success" : "blue",
      disabled: !this.canSubmitBorrow() || dialog.busy || pricing.amount > 0 && dialog.paymentStep && !this.cashOnly() && !dialog.paymentMethod,
      progress: dialog.busy || hasError ? {
        state: dialog.busy ? "loading" : "error",
        shape: "button"
      } : null
    });
    return items;
  }
  cashOnly() {
    return !`${this.deploymentConfiguration.paymentProviderId() ?? ""}`.trim();
  }
  borrowSubmitLabel(dialog) {
    if (dialog.paymentStep) {
      return this.cashOnly() ? this.i18n.translate("event.editor.payment.cash.confirm") : this.i18n.translate("asset.borrow.pay");
    }
    if (this.borrowPaymentReviewStarted(dialog)) {
      return this.i18n.translate(this.borrowSelectionChanged(dialog) ? "asset.borrow.update" : "asset.borrow.continue");
    }
    return this.i18n.translate("asset.borrow.confirm");
  }
  borrowBusyLabel(dialog) {
    if (dialog.paymentStep) {
      return this.cashOnly() ? this.i18n.translate("event.editor.payment.cash.confirming") : this.i18n.translate("asset.borrow.paying");
    }
    if (this.borrowPaymentReviewStarted(dialog)) {
      return this.i18n.translate(this.borrowSelectionChanged(dialog) ? "asset.borrow.updating" : "asset.borrow.continuing");
    }
    return this.i18n.translate("asset.borrow.confirming");
  }
  borrowCheckoutDateRangeModel(dialog) {
    const borrowWindow = dialog?.borrowWindow ?? null;
    return {
      mode: "range",
      precision: "minute",
      valueFormat: "iso-date-time",
      disabled: dialog !== void 0 && (!borrowWindow || dialog.paymentStep === true || dialog.busy === true),
      range: {
        bounds: borrowWindow ? { start: borrowWindow.startAtIso, end: borrowWindow.endAtIso } : null,
        start: {
          label: this.i18n.translate("asset.borrow.start"),
          min: borrowWindow?.startAtIso,
          max: borrowWindow?.endAtIso
        },
        end: {
          label: this.i18n.translate("asset.borrow.end"),
          min: borrowWindow?.startAtIso,
          max: borrowWindow?.endAtIso
        }
      }
    };
  }
  onBorrowCheckoutDateRangeChange(value) {
    this.setBorrowDateRange(AppUtils.isoLocalDateTimeToDate(value.startAt), AppUtils.isoLocalDateTimeToDate(value.endAt));
  }
  borrowPricingRuntimePreview(card, startAtIso, endAtIso, quantity, storedAmount, storedCurrency, paymentAudit) {
    if (paymentAudit) {
      const currency2 = `${paymentAudit.currency ?? "USD"}`.trim() || "USD";
      const auditRows = paymentAudit.pricingSummaryRows.length > 0 ? paymentAudit.pricingSummaryRows.map((row) => __spreadValues({}, row)) : paymentAudit.lineItems.map((lineItem, index) => ({
        key: `base-payment-audit-${lineItem.id || index}`,
        label: lineItem.label,
        detail: lineItem.detail || this.timeframeLabel(startAtIso, endAtIso),
        amount: Math.max(0, Number(lineItem.amount) || 0),
        currency: lineItem.currency?.trim() || currency2,
        multiplier: null
      }));
      return {
        rows: auditRows.length > 0 ? auditRows : [{
          key: "base-payment-audit",
          label: card.title,
          detail: this.timeframeLabel(startAtIso, endAtIso),
          amount: Math.max(0, Number(paymentAudit.amount) || 0),
          currency: currency2
        }],
        totalAmount: Math.max(0, Number(paymentAudit.amount) || 0),
        currency: currency2
      };
    }
    const calculated = this.resolveBorrowPricing(card, startAtIso, endAtIso, quantity);
    const amount = Number.isFinite(storedAmount) ? Math.max(0, Number(storedAmount)) : calculated.amount;
    const currency = `${storedCurrency ?? calculated.currency ?? "USD"}`.trim() || "USD";
    const useCalculatedRows = !Number.isFinite(storedAmount) || amount === calculated.amount;
    return {
      rows: useCalculatedRows ? calculated.rows.map((row) => __spreadValues({}, row)) : [{
        key: "base-borrow",
        label: "pricing.base",
        detail: this.timeframeLabel(startAtIso, endAtIso),
        amount,
        currency
      }],
      totalAmount: amount,
      currency
    };
  }
  invalidateBorrowCheckout(dialog) {
    if (!dialog.paymentStep && !dialog.checkoutSessionId) {
      return dialog;
    }
    return __spreadProps(__spreadValues({}, dialog), {
      checkoutSessionId: null,
      paymentStep: false
    });
  }
  borrowPaymentReviewStarted(dialog) {
    return !dialog.paymentStep && Boolean(dialog.confirmedSelectionSignature?.trim());
  }
  borrowSelectionSignature(dialog) {
    return assetBorrowSelectionSignature(dialog);
  }
  borrowSelectionChanged(dialog) {
    const baseline = dialog.confirmedSelectionSignature?.trim() ?? "";
    return Boolean(baseline) && this.borrowSelectionSignature(dialog) !== baseline;
  }
  borrowDraftSelectionChanged(draft) {
    const baseline = draft.confirmedSelectionSignature?.trim() ?? "";
    return Boolean(baseline) && assetBorrowSelectionSignature(draft) !== baseline;
  }
  persistChangedBorrowDraft() {
    const dialog = this.resourcePopupStore.assetExploreBorrowDialogRef();
    const context = this.resourcePopupStore.popupContextRef();
    const activeUserId = this.activeUser().id.trim();
    if (!dialog || !context || !activeUserId || !dialog.confirmedSelectionSignature) {
      return;
    }
    this.saveBorrowDraft(activeUserId, context.subEvent.id, dialog);
  }
  borrowAvailabilityError(requestedQuantity, availableQuantity) {
    if (availableQuantity <= 0) {
      return "This asset is no longer available for the selected date range.";
    }
    if (requestedQuantity > availableQuantity) {
      return availableQuantity === 1 ? "Only 1 item is still available for the selected date range." : `Only ${availableQuantity} items are still available for the selected date range.`;
    }
    return null;
  }
  listBorrowDrafts(userId, subEventId) {
    return this.assetBorrowDraftStore.list(userId, subEventId);
  }
  readBorrowDraft(userId, subEventId, cardId) {
    return this.assetBorrowDraftStore.read(userId, subEventId, cardId);
  }
  saveBorrowDraft(userId, subEventId, dialog) {
    if (!userId.trim() || !subEventId.trim() || !dialog.cardId.trim()) {
      return;
    }
    const card = this.resolveCard(dialog.cardId);
    const next = {
      userId: userId.trim(),
      subEventId: subEventId.trim(),
      cardId: dialog.cardId,
      ownerUserId: dialog.ownerUserId,
      title: card?.title?.trim() || "Borrow draft",
      quantity: _EventResourceAssetExploreComponent.BORROW_QUANTITY,
      startAtIso: dialog.startAtIso,
      endAtIso: dialog.endAtIso,
      acceptedPolicyIds: [...new Set(dialog.acceptedPolicyIds)].map((item) => item.trim()).filter(Boolean),
      checkoutSessionId: dialog.checkoutSessionId?.trim() || null,
      paymentMethod: dialog.paymentMethod ? __spreadValues({}, dialog.paymentMethod) : null,
      paymentStep: dialog.paymentStep,
      confirmedSelectionSignature: dialog.confirmedSelectionSignature?.trim() || null,
      expiresAtIso: dialog.expiresAtIso?.trim() || null,
      updatedAtMs: Date.now()
    };
    this.assetBorrowDraftStore.save(next);
  }
  clearBorrowDraftState(userId, subEventId, cardId) {
    this.assetBorrowDraftStore.clear(userId, subEventId, cardId);
  }
  shouldPersistBorrowDraft(dialog, subEventId, userId) {
    return Boolean(dialog.checkoutSessionId || dialog.paymentStep || dialog.confirmedSelectionSignature || this.readBorrowDraft(userId, subEventId, dialog.cardId));
  }
  activeUser() {
    const activeUserId = this.userProfileStore.activeUserId().trim();
    return this.userProfileStore.activeUserProfile() ?? this.usersService.peekCachedUserById(activeUserId) ?? this.users[0] ?? this.createFallbackUser(activeUserId);
  }
  ownerAvatarUrl(card) {
    const projectedOwnerAvatarUrl = `${card.ownerAvatarUrl ?? ""}`.trim();
    if (projectedOwnerAvatarUrl) {
      return projectedOwnerAvatarUrl;
    }
    const ownerUserId = `${card.ownerUserId ?? ""}`.trim();
    if (!ownerUserId) {
      return null;
    }
    const owner = this.resolveOwnerUser(card);
    return owner?.images?.map((image) => image.trim()).find(Boolean) ?? null;
  }
  resolveOwnerUser(card) {
    const ownerUserId = `${card.ownerUserId ?? ""}`.trim();
    return this.userProfileStore.getUserProfile(ownerUserId) ?? this.gameService.getGameCardsUsersSnapshot().find((user) => user.id === ownerUserId) ?? this.usersService.peekCachedUserById(ownerUserId) ?? __spreadProps(__spreadValues({}, this.createFallbackUser(ownerUserId)), {
      name: card.ownerName?.trim() || "Asset owner",
      initials: AppUtils.initialsFromText(card.ownerName?.trim() || "Asset owner")
    });
  }
  async loadOwnerProfile(ownerUserId) {
    const normalizedOwnerUserId = ownerUserId.trim();
    if (!normalizedOwnerUserId) {
      return;
    }
    const cached = this.userProfileStore.getUserProfile(normalizedOwnerUserId);
    if (cached?.images?.some((image) => image.trim().length > 0)) {
      return;
    }
    try {
      const profile = await this.contactsService.loadContactProfile(normalizedOwnerUserId);
      if (profile.user?.id?.trim() === normalizedOwnerUserId) {
        this.userProfileStore.setUserProfile(profile.user);
      }
    } catch {
    }
  }
  get users() {
    return this.usersService.peekCachedUsers();
  }
  ownedAssetCards() {
    return this.assetStore.assetCards();
  }
  popupSubtitle() {
    const context = this.resourcePopupStore.popupContextRef();
    if (!context) {
      return "Event";
    }
    const subEventName = this.subEventDisplayName(context.subEvent);
    if (context.parentTitle && subEventName) {
      return `${context.parentTitle} - ${subEventName}`;
    }
    return context.parentTitle || subEventName || "Event";
  }
  defaultRange(subEvent) {
    const startAtIso = `${subEvent.startAt ?? ""}`.trim() || AppUtils.toIsoDateTimeLocal(/* @__PURE__ */ new Date());
    const endAtIso = `${subEvent.endAt ?? ""}`.trim();
    if (endAtIso) {
      return {
        startAtIso,
        endAtIso
      };
    }
    const base = AppUtils.isoLocalDateTimeToDate(startAtIso) ?? /* @__PURE__ */ new Date();
    const nextEnd = new Date(base);
    nextEnd.setHours(nextEnd.getHours() + 2);
    return {
      startAtIso,
      endAtIso: AppUtils.toIsoDateTimeLocal(nextEnd)
    };
  }
  resolveCard(cardId) {
    const normalizedCardId = cardId.trim();
    if (!normalizedCardId) {
      return null;
    }
    return this.resourcePopupStore.assetExplorePopupRef()?.cards.find((card) => card.id === normalizedCardId) ?? null;
  }
  assetCardToResourceCard(card, subEventId) {
    const managerUserId = `${card.ownerUserId ?? ""}`.trim() || null;
    return {
      id: `asset-explore-view-${card.id}`,
      type: card.type,
      sourceAssetId: card.id,
      title: card.title,
      subtitle: card.subtitle,
      city: card.city,
      details: this.assetDetailText(card),
      imageUrl: card.imageUrl,
      sourceLink: this.assetSourceLink(card),
      routes: this.normalizeRoutes(card.type, card.routes),
      capacityTotal: Math.max(0, card.capacityTotal),
      accepted: card.type === ASSET_TYPE_SUPPLIES ? this.subEventSupplyProvidedCount(card.id, subEventId) : this.assetAcceptedCount(card, subEventId, managerUserId),
      pending: this.assetPendingCount(card, subEventId, managerUserId),
      isMembers: false
    };
  }
  resolveBorrowPricing(card, startAtIso, endAtIso, quantity) {
    return PricingBuilder.resolveAssetBorrowPricing({
      pricing: card.pricing,
      totalQuantity: AssetCardBuilder.storedQuantityValue(card),
      requestedQuantity: quantity,
      startAtIso,
      endAtIso,
      requests: card.requests
    });
  }
  attachBoughtAssetToSubEventLocally(context, card, persistedState) {
    const persistedCards = persistedState.fallbackAssetCardsByType?.[card.type] ?? [];
    const nextPersistedState = __spreadProps(__spreadValues({}, persistedState), {
      fallbackAssetCardsByType: __spreadProps(__spreadValues({}, persistedState.fallbackAssetCardsByType ?? {}), {
        [card.type]: [
          ...persistedCards.filter((item) => item.id !== card.id),
          this.toAssetDetailDto(card)
        ]
      })
    });
    this.resourcePopupStore.upsertVisibleResourceState(nextPersistedState);
    for (const type of ASSET_TYPES) {
      const key = this.assignmentKey(context.subEvent.id, type);
      this.resourcePopupStore.assignedAssetIdsByKey[key] = [...nextPersistedState.assetAssignmentIds[type] ?? []];
      this.resourcePopupStore.assignedAssetSettingsByKey[key] = __spreadValues({}, nextPersistedState.assetSettingsByType[type] ?? {});
    }
    for (const key of Object.keys(this.resourcePopupStore.supplyContributionEntriesByAssignmentKey)) {
      if (key.startsWith(`${context.subEvent.id}:`)) {
        delete this.resourcePopupStore.supplyContributionEntriesByAssignmentKey[key];
      }
    }
    for (const [assetId, entries] of Object.entries(nextPersistedState.supplyContributionEntriesByAssetId)) {
      this.resourcePopupStore.supplyContributionEntriesByAssignmentKey[this.supplyAssignmentKey(context.subEvent.id, assetId)] = entries.map((entry) => __spreadValues({}, entry));
    }
    const activeContext = this.resourcePopupStore.popupContextRef();
    if (activeContext?.subEvent.id === context.subEvent.id) {
      const nextFallbackCards = this.cloneFallbackCards(activeContext.fallbackCardsByType);
      const existingCards = nextFallbackCards[card.type] ?? [];
      nextFallbackCards[card.type] = [
        ...existingCards.filter((item) => item.id !== card.id),
        this.assignedFallbackAssetSnapshot(context.subEvent.id, card)
      ];
      const nextContext = __spreadProps(__spreadValues({}, activeContext), {
        fallbackCardsByType: nextFallbackCards
      });
      this.resourcePopupStore.popupContextRef.set(nextContext);
      this.syncMetrics(false, nextPersistedState, false);
      return;
    }
    this.syncMetrics(false, nextPersistedState, false);
  }
  signalBorrowedAssetMemberDelta(context, card, persistedState, requestId) {
    if (card.type === ASSET_TYPE_SUPPLIES) {
      return;
    }
    const activeUserId = this.activeUser().id.trim();
    const previousMemberSync = this.activityStore.activityMembersSyncByOwnerId()[card.id];
    const previousMemberSyncMatchesScope = previousMemberSync?.eventId === context.ownerId && previousMemberSync.subEventId === context.subEvent.id;
    this.activityStore.cacheActivityMemberStatusChange({
      assetId: card.id,
      requestId,
      eventId: context.ownerId,
      subEventId: context.subEvent.id,
      userId: activeUserId,
      previousStatus: null,
      status: "pending",
      acceptedMemberDelta: 0,
      pendingMemberDelta: 1
    }, {
      acceptedMembers: previousMemberSyncMatchesScope ? previousMemberSync.acceptedMembers : 0,
      pendingMembers: previousMemberSyncMatchesScope ? previousMemberSync.pendingMembers : 0,
      capacityTotal: Math.max(0, Math.trunc(Number(card.capacityTotal) || 0))
    });
    const persistedMetrics = persistedState.resourceMetricsByType?.[card.type];
    const previousMetrics = this.subEventResourceMetrics(context.subEvent, card.type);
    this.activityStore.emitActivityResourceMemberDeltaSync({
      ownerId: context.ownerId,
      subEventId: context.subEvent.id,
      assetId: card.id,
      resourceType: card.type,
      acceptedMemberDelta: 0,
      pendingMemberDelta: 1,
      capacityMinDelta: persistedMetrics ? Math.max(0, Math.trunc(Number(persistedMetrics.capacityMin) || 0)) - previousMetrics.capacityMin : 0,
      capacityMaxDelta: persistedMetrics ? Math.max(0, Math.trunc(Number(persistedMetrics.capacityMax) || 0)) - previousMetrics.capacityMax : 0
    });
  }
  subEventResourceMetrics(subEvent, type) {
    if (type === ASSET_TYPE_TRANSPORT) {
      return {
        capacityMin: Math.max(0, Math.trunc(Number(subEvent.carsCapacityMin) || 0)),
        capacityMax: Math.max(0, Math.trunc(Number(subEvent.carsCapacityMax) || 0))
      };
    }
    if (type === ASSET_TYPE_ACCOMMODATION) {
      return {
        capacityMin: Math.max(0, Math.trunc(Number(subEvent.accommodationCapacityMin) || 0)),
        capacityMax: Math.max(0, Math.trunc(Number(subEvent.accommodationCapacityMax) || 0))
      };
    }
    return {
      capacityMin: Math.max(0, Math.trunc(Number(subEvent.suppliesCapacityMin) || 0)),
      capacityMax: Math.max(0, Math.trunc(Number(subEvent.suppliesCapacityMax) || 0))
    };
  }
  async persistBorrowedAssetAssignment(context, card) {
    const currentState = this.buildResourceState(context);
    if (!currentState) {
      throw new Error(this.i18n.translate("asset.borrow.error.send"));
    }
    const type = card.type;
    const currentIds = currentState.assetAssignmentIds[type] ?? [];
    const currentSettings = currentState.assetSettingsByType[type] ?? {};
    const capacityLimit = Math.max(0, card.capacityTotal);
    const activeUserId = this.activeUser().id;
    const assignedItemCount = card.requests.filter((request) => request.requestKind === "borrow" && (request.status === "pending" || request.status === "accepted") && ActivityResourceBuilder.isSubEventScopedAssetRequest(request, context.subEvent.id, context.ownerId) && AppUtils.resolveAssetRequestUserId(request, this.users) === activeUserId).length;
    const currentAssignment = currentSettings[card.id];
    const nextState = __spreadProps(__spreadValues({}, currentState), {
      assetAssignmentIds: __spreadProps(__spreadValues({}, currentState.assetAssignmentIds), {
        [type]: currentIds.includes(card.id) ? [...currentIds] : [...currentIds, card.id]
      }),
      assetSettingsByType: __spreadProps(__spreadValues({}, currentState.assetSettingsByType), {
        [type]: __spreadProps(__spreadValues({}, currentSettings), {
          [card.id]: __spreadProps(__spreadValues({}, currentAssignment), {
            capacityMin: 0,
            capacityMax: currentAssignment?.capacityMax ?? capacityLimit,
            quantity: Math.max(_EventResourceAssetExploreComponent.BORROW_QUANTITY, assignedItemCount),
            addedByUserId: currentAssignment?.addedByUserId ?? activeUserId,
            routeEnabled: currentAssignment?.routeEnabled ?? (type === ASSET_TYPE_TRANSPORT && this.normalizeRoutes(type, card.routes).length > 0),
            routes: currentAssignment?.routes ?? this.normalizeRoutes(type, card.routes)
          })
        })
      }),
      supplyContributionEntriesByAssetId: type === ASSET_TYPE_SUPPLIES ? __spreadProps(__spreadValues({}, currentState.supplyContributionEntriesByAssetId), {
        [card.id]: [
          {
            id: `subevent-supply-row-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            userId: activeUserId,
            quantity: _EventResourceAssetExploreComponent.BORROW_QUANTITY,
            addedAtIso: AppUtils.toIsoDateTime(/* @__PURE__ */ new Date())
          },
          ...currentState.supplyContributionEntriesByAssetId[card.id] ?? []
        ]
      }) : __spreadValues({}, currentState.supplyContributionEntriesByAssetId),
      fallbackAssetCardsByType: __spreadProps(__spreadValues({}, currentState.fallbackAssetCardsByType ?? {}), {
        [type]: [
          ...(currentState.fallbackAssetCardsByType?.[type] ?? []).filter((existing) => existing.id !== card.id),
          this.toAssetDetailDto(this.assignedFallbackAssetSnapshot(context.subEvent.id, card))
        ]
      })
    });
    const savedState = await this.activityResourcesService.replaceSubEventResourceState(nextState, void 0, {
      emitActivityResourceSync: false
    });
    if (!savedState?.assetAssignmentIds[type]?.includes(card.id)) {
      throw new Error(this.i18n.translate("asset.borrow.error.send"));
    }
    return savedState;
  }
  syncMetrics(persistResourceState = false, persistedState = null, publishUpdate = true) {
    const context = this.resourcePopupStore.popupContextRef();
    if (!context) {
      return;
    }
    const previousPendingActivity = this.resourcePendingActivityCount(context.subEvent);
    let nextSubEvent = this.cloneSubEvent(context.subEvent);
    const cars = this.capacityMetrics(nextSubEvent, ASSET_TYPE_TRANSPORT);
    const accommodation = this.capacityMetrics(nextSubEvent, ASSET_TYPE_ACCOMMODATION);
    const supplies = this.capacityMetrics(nextSubEvent, ASSET_TYPE_SUPPLIES);
    nextSubEvent.carsAccepted = cars.joined;
    nextSubEvent.carsPending = cars.pending;
    nextSubEvent.carsCapacityMin = cars.capacityMin;
    nextSubEvent.carsCapacityMax = cars.capacityMax;
    nextSubEvent.accommodationAccepted = accommodation.joined;
    nextSubEvent.accommodationPending = accommodation.pending;
    nextSubEvent.accommodationCapacityMin = accommodation.capacityMin;
    nextSubEvent.accommodationCapacityMax = accommodation.capacityMax;
    nextSubEvent.suppliesAccepted = supplies.joined;
    nextSubEvent.suppliesPending = supplies.pending;
    nextSubEvent.suppliesCapacityMin = supplies.capacityMin;
    nextSubEvent.suppliesCapacityMax = supplies.capacityMax;
    nextSubEvent = ActivityResourceBuilder.withPersistedResourceMetrics(nextSubEvent, persistedState);
    const nextContext = __spreadProps(__spreadValues({}, context), {
      subEvent: nextSubEvent
    });
    this.resourcePopupStore.popupContextRef.set(nextContext);
    if (publishUpdate) {
      this.resourcePopupStore.publishSubEventResourceMetrics(nextContext, {
        activityDelta: this.resourcePendingActivityCount(nextSubEvent) - previousPendingActivity
      });
    }
    if (persistResourceState) {
      this.persistResourceState(nextContext);
    }
  }
  resourcePendingActivityCount(subEvent) {
    return [
      subEvent.carsPending,
      subEvent.accommodationPending,
      subEvent.suppliesPending
    ].reduce((sum, value) => sum + Math.max(0, Math.trunc(Number(value) || 0)), 0);
  }
  persistResourceState(context = this.resourcePopupStore.popupContextRef()) {
    const nextState = this.buildResourceState(context);
    if (!nextState) {
      return;
    }
    void this.activityResourcesService.replaceSubEventResourceState(nextState);
  }
  buildResourceState(context) {
    if (!context) {
      return null;
    }
    const ownerId = context.ownerId.trim();
    const subEventId = context.subEvent.id.trim();
    const assetOwnerUserId = this.activeUser().id;
    if (!ownerId || !subEventId || !assetOwnerUserId) {
      return null;
    }
    return {
      ownerId,
      subEventId,
      assetOwnerUserId,
      assetAssignmentIds: {
        [ASSET_TYPE_TRANSPORT]: [...this.resolveAssignedAssetIds(subEventId, ASSET_TYPE_TRANSPORT)],
        [ASSET_TYPE_ACCOMMODATION]: [...this.resolveAssignedAssetIds(subEventId, ASSET_TYPE_ACCOMMODATION)],
        [ASSET_TYPE_SUPPLIES]: [...this.resolveAssignedAssetIds(subEventId, ASSET_TYPE_SUPPLIES)]
      },
      assetSettingsByType: {
        [ASSET_TYPE_TRANSPORT]: __spreadValues({}, this.getAssignedAssetSettings(subEventId, ASSET_TYPE_TRANSPORT)),
        [ASSET_TYPE_ACCOMMODATION]: __spreadValues({}, this.getAssignedAssetSettings(subEventId, ASSET_TYPE_ACCOMMODATION)),
        [ASSET_TYPE_SUPPLIES]: __spreadValues({}, this.getAssignedAssetSettings(subEventId, ASSET_TYPE_SUPPLIES))
      },
      supplyContributionEntriesByAssetId: Object.fromEntries(this.resolveAssignedAssetIds(subEventId, ASSET_TYPE_SUPPLIES).map((assetId) => [
        assetId,
        this.supplyContributionEntries(subEventId, assetId).map((entry) => __spreadValues({}, entry))
      ])),
      fallbackAssetCardsByType: {
        [ASSET_TYPE_TRANSPORT]: this.persistedFallbackCards(context, ASSET_TYPE_TRANSPORT),
        [ASSET_TYPE_ACCOMMODATION]: this.persistedFallbackCards(context, ASSET_TYPE_ACCOMMODATION),
        [ASSET_TYPE_SUPPLIES]: this.persistedFallbackCards(context, ASSET_TYPE_SUPPLIES)
      }
    };
  }
  capacityMetrics(subEvent, type) {
    const cards = this.assignedAssetCards(subEvent.id, type);
    const settings = this.getAssignedAssetSettings(subEvent.id, type);
    const capacityMax = cards.reduce((sum, card) => sum + (settings[card.id]?.capacityMax ?? Math.max(0, card.capacityTotal)), 0);
    const capacityMin = cards.reduce((sum, card) => sum + (settings[card.id]?.capacityMin ?? 0), 0);
    const pending = type === ASSET_TYPE_SUPPLIES ? 0 : cards.reduce((sum, card) => sum + ActivityResourceBuilder.subEventOccupancyRequestCount(card, subEvent.id, "pending"), 0);
    if (type === ASSET_TYPE_SUPPLIES) {
      return {
        joined: cards.reduce((sum, card) => sum + this.subEventSupplyProvidedCount(card.id, subEvent.id), 0),
        capacityMin,
        capacityMax,
        pending
      };
    }
    return {
      joined: cards.reduce((sum, card) => sum + ActivityResourceBuilder.subEventOccupancyRequestCount(card, subEvent.id, "accepted"), 0),
      capacityMin,
      capacityMax,
      pending
    };
  }
  assignedAssetCards(subEventId, type) {
    return this.resolveAssignedAssetIds(subEventId, type).map((id) => this.resolveAssignedAssetCard(subEventId, type, id)).filter((card) => card !== null);
  }
  getAssignedAssetSettings(subEventId, type) {
    const key = this.assignmentKey(subEventId, type);
    const assignedIds = this.resolveAssignedAssetIds(subEventId, type);
    const existing = this.resourcePopupStore.assignedAssetSettingsByKey[key] ?? {};
    const next = {};
    for (const assetId of assignedIds) {
      const source = this.resolveAssignedAssetCard(subEventId, type, assetId);
      if (!source) {
        continue;
      }
      const previous = existing[assetId];
      const capacityLimit = Math.max(0, source.capacityTotal);
      const capacityMax = AppUtils.clampNumber(Math.trunc(previous?.capacityMax ?? capacityLimit), 0, capacityLimit);
      const capacityMin = AppUtils.clampNumber(Math.trunc(previous?.capacityMin ?? 0), 0, capacityMax);
      next[assetId] = {
        capacityMin,
        capacityMax,
        quantity: Math.max(1, Math.trunc(Number(previous?.quantity) || 1)),
        addedByUserId: previous?.addedByUserId ?? this.activeUser().id,
        routeEnabled: previous?.routeEnabled ?? this.normalizeRoutes(type, previous?.routes).length > 0,
        routes: this.normalizeRoutes(type, previous?.routes)
      };
    }
    this.resourcePopupStore.assignedAssetSettingsByKey[key] = next;
    return next;
  }
  resolveAssignedAssetIds(subEventId, type) {
    const key = this.assignmentKey(subEventId, type);
    const eligibleIds = [
      ...this.ownedAssetCards().filter((card) => card.type === type).map((card) => card.id),
      ...this.fallbackAssetCards(subEventId, type).map((card) => card.id)
    ];
    const eligible = new Set(eligibleIds);
    const stored = this.resourcePopupStore.assignedAssetIdsByKey[key];
    if (!stored) {
      this.resourcePopupStore.assignedAssetIdsByKey[key] = [];
      return [];
    }
    const normalized = stored.filter((id) => eligible.has(id));
    if (normalized.length !== stored.length) {
      this.resourcePopupStore.assignedAssetIdsByKey[key] = [...normalized];
    }
    return normalized;
  }
  resolveAssignedAssetCard(subEventId, type, assetId) {
    return this.ownedAssetCards().find((card) => card.id === assetId && card.type === type) ?? this.fallbackAssetCards(subEventId, type).find((card) => card.id === assetId && card.type === type) ?? null;
  }
  fallbackAssetCards(subEventId, type) {
    const context = this.resourcePopupStore.popupContextRef();
    if (context?.subEvent.id !== subEventId) {
      return [];
    }
    return context.fallbackCardsByType[type] ?? [];
  }
  persistedFallbackCards(context, type) {
    const assignedIds = new Set(this.resolveAssignedAssetIds(context.subEvent.id, type));
    const ownedIds = new Set(this.ownedAssetCards().filter((card) => card.type === type).map((card) => card.id));
    return (context.fallbackCardsByType[type] ?? []).filter((card) => assignedIds.has(card.id) && !ownedIds.has(card.id)).map((card) => this.toAssetDetailDto(this.assignedFallbackAssetSnapshot(context.subEvent.id, card)));
  }
  assignedFallbackAssetSnapshot(subEventId, card) {
    const nextCard = this.cloneAsset(card);
    return __spreadProps(__spreadValues({}, nextCard), {
      requests: nextCard.requests.filter((request) => this.isSubEventScopedAssetRequest(request, subEventId))
    });
  }
  cloneFallbackCards(fallbackCardsByType) {
    const next = {};
    for (const type of ASSET_TYPES) {
      const cards = fallbackCardsByType?.[type];
      if (!Array.isArray(cards) || cards.length === 0) {
        continue;
      }
      next[type] = cards.map((card) => this.cloneAsset(card));
    }
    return next;
  }
  bookingForRange(subEvent, ownerId, parentTitle, startAtIso, endAtIso, quantity, options = {}) {
    const absoluteStartAtIso = AppUtils.isoLocalDateTimeToDate(startAtIso)?.toISOString();
    const absoluteEndAtIso = AppUtils.isoLocalDateTimeToDate(endAtIso)?.toISOString();
    return {
      eventId: ownerId,
      eventTitle: parentTitle,
      subEventId: subEvent.id,
      subEventTitle: subEvent.name,
      slotKey: subEvent.id,
      slotLabel: subEvent.name,
      timeframe: this.timeframeLabel(startAtIso, endAtIso),
      startAtIso: absoluteStartAtIso,
      endAtIso: absoluteEndAtIso,
      quantity,
      totalAmount: options.totalAmount ?? null,
      currency: options.currency ?? null,
      acceptedPolicyIds: [...options.acceptedPolicyIds ?? []],
      paymentSessionId: options.paymentSessionId ?? null,
      inventoryApplied: options.inventoryApplied === true ? true : null
    };
  }
  newBorrowRequestId(userId, assetId, subEventId) {
    const generation = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    return `borrow:${userId}:${assetId}:${subEventId}:${generation}`;
  }
  requestQuantity(request) {
    return Math.max(1, Math.trunc(Number(request.booking?.quantity) || 0));
  }
  isSubEventScopedAssetRequest(request, subEventId) {
    return ActivityResourceBuilder.isSubEventScopedAssetRequest(request, subEventId);
  }
  assetRequestsForView(card, subEventId, managerUserId = null) {
    const requests = card.requests.filter((request) => this.isSubEventScopedAssetRequest(request, subEventId)).map((request) => __spreadProps(__spreadValues({}, request), {
      booking: request.booking ? __spreadProps(__spreadValues({}, request.booking), {
        acceptedPolicyIds: [...request.booking.acceptedPolicyIds ?? []]
      }) : null
    }));
    const normalizedManagerUserId = `${managerUserId ?? ""}`.trim();
    if (!normalizedManagerUserId) {
      return requests;
    }
    return requests;
  }
  assetPendingCount(card, subEventId, managerUserId = null) {
    const requests = subEventId ? this.assetRequestsForView(card, subEventId, managerUserId) : card.requests;
    return requests.filter((request) => request.status === "pending").length;
  }
  assetAcceptedCount(card, subEventId, managerUserId = null) {
    const requests = subEventId ? this.assetRequestsForView(card, subEventId, managerUserId) : card.requests;
    return requests.filter((request) => request.status === "accepted").length;
  }
  isWindowOverlap(request, startAtIso, endAtIso) {
    const requestStart = this.parseLocalDateMs(request.booking?.startAtIso);
    const requestEnd = this.parseLocalDateMs(request.booking?.endAtIso);
    const windowStart = this.parseLocalDateMs(startAtIso);
    const windowEnd = this.parseLocalDateMs(endAtIso);
    if (requestStart !== null && requestEnd !== null && windowStart !== null && windowEnd !== null) {
      return requestStart < windowEnd && windowStart < requestEnd;
    }
    const requestWindow = [
      `${request.booking?.eventId ?? ""}`.trim(),
      `${request.booking?.subEventId ?? ""}`.trim(),
      `${request.booking?.slotKey ?? ""}`.trim(),
      `${request.booking?.timeframe ?? ""}`.trim()
    ].filter(Boolean).join("|");
    const targetWindow = [startAtIso.trim(), endAtIso.trim()].filter(Boolean).join("|");
    if (requestWindow && targetWindow) {
      return requestWindow === targetWindow;
    }
    return true;
  }
  isRangeOverlap(leftStartAtIso, leftEndAtIso, rightStartAtIso, rightEndAtIso) {
    const leftStart = this.parseLocalDateMs(leftStartAtIso);
    const leftEnd = this.parseLocalDateMs(leftEndAtIso);
    const rightStart = this.parseLocalDateMs(rightStartAtIso);
    const rightEnd = this.parseLocalDateMs(rightEndAtIso);
    if (leftStart !== null && leftEnd !== null && rightStart !== null && rightEnd !== null) {
      return leftStart < rightEnd && rightStart < leftEnd;
    }
    const leftWindow = [leftStartAtIso.trim(), leftEndAtIso.trim()].filter(Boolean).join("|");
    const rightWindow = [rightStartAtIso.trim(), rightEndAtIso.trim()].filter(Boolean).join("|");
    if (leftWindow && rightWindow) {
      return leftWindow === rightWindow;
    }
    return true;
  }
  isValidWindow(startAtIso, endAtIso) {
    const start = AppUtils.isoLocalDateTimeToDate(startAtIso);
    const end = AppUtils.isoLocalDateTimeToDate(endAtIso);
    return !!start && !!end && start.getTime() < end.getTime();
  }
  isBorrowSelectionWithinWindow(startAtIso, endAtIso, borrowWindow) {
    const start = this.parseLocalDateMinute(startAtIso);
    const end = this.parseLocalDateMinute(endAtIso);
    const lowerBound = this.parseLocalDateMinute(borrowWindow.startAtIso);
    const upperBound = this.parseLocalDateMinute(borrowWindow.endAtIso);
    return start !== null && end !== null && lowerBound !== null && upperBound !== null && lowerBound < upperBound && lowerBound <= start && start < end && end <= upperBound;
  }
  normalizeBorrowSelectionToWindow(startAtIso, endAtIso, borrowWindow) {
    const lowerBound = AppUtils.isoLocalDateTimeToDate(borrowWindow.startAtIso);
    const upperBound = AppUtils.isoLocalDateTimeToDate(borrowWindow.endAtIso);
    if (!lowerBound || !upperBound || lowerBound.getTime() >= upperBound.getTime()) {
      return null;
    }
    const lowerMs = lowerBound.getTime();
    const upperMs = upperBound.getTime();
    const minimumDurationMs = 60 * 60 * 1e3;
    const requestedStart = AppUtils.isoLocalDateTimeToDate(startAtIso)?.getTime() ?? lowerMs;
    const requestedEnd = AppUtils.isoLocalDateTimeToDate(endAtIso)?.getTime() ?? upperMs;
    let safeStartMs = Math.min(upperMs, Math.max(lowerMs, requestedStart));
    let safeEndMs = Math.min(upperMs, Math.max(lowerMs, requestedEnd));
    if (safeEndMs <= safeStartMs) {
      if (safeStartMs + minimumDurationMs <= upperMs) {
        safeEndMs = safeStartMs + minimumDurationMs;
      } else {
        safeStartMs = Math.max(lowerMs, upperMs - minimumDurationMs);
        safeEndMs = upperMs;
      }
    }
    return safeStartMs < safeEndMs ? {
      startAtIso: AppUtils.toIsoDateTimeLocal(new Date(safeStartMs)),
      endAtIso: AppUtils.toIsoDateTimeLocal(new Date(safeEndMs))
    } : null;
  }
  parseLocalDateMs(value) {
    const parsed = AppUtils.isoLocalDateTimeToDate(`${value ?? ""}`.trim());
    return parsed ? parsed.getTime() : null;
  }
  parseLocalDateMinute(value) {
    const parsedMs = this.parseLocalDateMs(value);
    return parsedMs === null ? null : Math.floor(parsedMs / 6e4);
  }
  priceAmount(card) {
    if (!card.pricing?.enabled) {
      return 0;
    }
    return Math.max(0, Number(card.pricing.basePrice) || 0);
  }
  priceLabel(card) {
    const amount = this.priceAmount(card);
    const currency = card.pricing?.currency || "USD";
    if (amount <= 0) {
      return "Free borrow";
    }
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0
      }).format(amount);
    } catch {
      return `${currency} ${amount.toFixed(0)}`;
    }
  }
  toAssetDto(card) {
    return {
      id: card.id,
      type: card.type,
      title: card.title,
      subtitle: card.subtitle,
      category: card.category,
      city: card.city,
      capacityTotal: card.capacityTotal,
      quantity: AssetCardBuilder.storedQuantityValue(card),
      description: this.assetDetailText(card),
      imageUrl: card.imageUrl,
      locationLabel: card.locationLabel ?? (card.type === ASSET_TYPE_ACCOMMODATION ? this.normalizeRoutes(card.type, card.routes).find(Boolean) : card.city),
      priceLabel: card.priceLabel ?? this.priceLabel(card),
      policiesEnabled: AssetCardBuilder.assetPoliciesEnabled(card),
      policyCount: AssetCardBuilder.assetPoliciesEnabled(card) ? card.policyCount ?? (card.policies ?? []).length : 0,
      visibility: card.visibility,
      status: card.status,
      ownerUserId: card.ownerUserId,
      ownerName: card.ownerName,
      ownerAvatarUrl: card.ownerAvatarUrl ?? null,
      requests: card.requests.map((request) => __spreadProps(__spreadValues({}, request), {
        booking: request.booking ? __spreadProps(__spreadValues({}, request.booking), {
          acceptedPolicyIds: [...request.booking.acceptedPolicyIds ?? []]
        }) : null
      })),
      menuActions: card.menuActions ? [...card.menuActions] : void 0
    };
  }
  toAssetDetailDto(card) {
    return {
      id: card.id,
      type: card.type,
      title: card.title,
      subtitle: card.subtitle,
      category: card.category,
      city: card.city,
      capacityTotal: card.capacityTotal,
      quantity: AssetCardBuilder.storedQuantityValue(card),
      details: this.assetDetailText(card),
      imageUrl: card.imageUrl,
      sourceLink: this.assetSourceLink(card),
      routes: this.normalizeRoutes(card.type, card.routes),
      topics: [...card.topics ?? []],
      policiesEnabled: AssetCardBuilder.assetPoliciesEnabled(card),
      policies: (card.policies ?? []).map((policy) => __spreadValues({}, policy)),
      pricing: card.pricing ? PricingBuilder.clonePricingConfig(card.pricing) : card.pricing,
      visibility: card.visibility,
      status: card.status,
      ownerUserId: card.ownerUserId,
      ownerName: card.ownerName,
      ownerAvatarUrl: card.ownerAvatarUrl ?? null,
      requests: card.requests.map((request) => __spreadProps(__spreadValues({}, request), {
        booking: request.booking ? __spreadProps(__spreadValues({}, request.booking), {
          acceptedPolicyIds: [...request.booking.acceptedPolicyIds ?? []]
        }) : null
      })),
      menuActions: card.menuActions ? [...card.menuActions] : void 0
    };
  }
  cloneAsset(card) {
    return __spreadProps(__spreadValues({}, card), {
      routes: [...card.routes ?? []],
      pricing: card.pricing ? PricingBuilder.clonePricingConfig(card.pricing) : void 0,
      requests: card.requests.map((request) => __spreadProps(__spreadValues({}, request), {
        booking: request.booking ? __spreadProps(__spreadValues({}, request.booking), {
          acceptedPolicyIds: [...request.booking.acceptedPolicyIds ?? []]
        }) : null
      }))
    });
  }
  cloneSubEvent(subEvent) {
    return __spreadProps(__spreadValues({}, subEvent), {
      pricing: subEvent.pricing ? PricingBuilder.clonePricingConfig(subEvent.pricing) : void 0
    });
  }
  normalizeRoutes(type, routes) {
    if (type === ASSET_TYPE_SUPPLIES) {
      return [];
    }
    const cleaned = (routes ?? []).map((value) => value.trim()).filter((value, index, arr) => value.length > 0 && arr.indexOf(value) === index);
    if (type === ASSET_TYPE_ACCOMMODATION) {
      return cleaned.length > 0 ? [cleaned[0]] : [""];
    }
    return cleaned.length > 0 ? cleaned : [""];
  }
  assetDetailText(card) {
    return `${card.details ?? card.description ?? ""}`.trim();
  }
  assetSourceLink(card) {
    return `${card.sourceLink ?? ""}`.trim();
  }
  supplyAssignmentKey(subEventId, cardId) {
    return `${subEventId}:${cardId}`;
  }
  supplyContributionEntries(subEventId, cardId) {
    return this.resourcePopupStore.supplyContributionEntriesByAssignmentKey[this.supplyAssignmentKey(subEventId, cardId)] ?? [];
  }
  subEventSupplyProvidedCount(cardId, subEventId) {
    return this.supplyContributionEntries(subEventId, cardId).reduce((sum, entry) => sum + AppUtils.clampNumber(Math.trunc(entry.quantity), 0, Number.MAX_SAFE_INTEGER), 0);
  }
  assignmentKey(subEventId, type) {
    return `${subEventId}:${type}`;
  }
  timeframeLabel(startAtIso, endAtIso) {
    const start = AppUtils.isoLocalDateTimeToDate(startAtIso);
    const end = AppUtils.isoLocalDateTimeToDate(endAtIso);
    if (!start || !end) {
      return "";
    }
    const locale = this.i18n.currentLanguage() === "hu" ? "hu-HU" : "en-US";
    const sameDay = start.toDateString() === end.toDateString();
    const startDate = start.toLocaleDateString(locale, { month: "short", day: "numeric" });
    const endDate = end.toLocaleDateString(locale, { month: "short", day: "numeric" });
    const startTime = start.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
    const endTime = end.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
    return sameDay ? `${startDate} \xB7 ${startTime} - ${endTime}` : `${startDate} ${startTime} - ${endDate} ${endTime}`;
  }
  openShareDialog(card) {
    void this.shareTokensService.createToken({
      kind: "asset",
      entityId: card.id,
      assetType: card.type,
      ownerUserId: card.ownerUserId ?? null
    }).then((token) => this.openShareLinkDialog("Share asset", token));
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
  canReportOwner(card) {
    const activeUserId = this.activeUser().id.trim();
    const ownerUserId = `${card.ownerUserId ?? ""}`.trim();
    return !!this.resourcePopupStore.popupContextRef() && !!ownerUserId && ownerUserId !== activeUserId;
  }
  reportOwner(card, event) {
    event?.stopPropagation();
    const context = this.resourcePopupStore.popupContextRef();
    const activeUserId = this.activeUser().id.trim();
    const ownerUserId = `${card.ownerUserId ?? ""}`.trim();
    if (!context || !ownerUserId || ownerUserId === activeUserId) {
      return;
    }
    this.profileStore.openReportUserPopup({
      targetUserId: ownerUserId,
      targetName: card.ownerName?.trim() || this.reportTargetName(ownerUserId, "Owner"),
      eventId: context.ownerId,
      eventTitle: card.title,
      eventStartAtIso: context.subEvent.startAt,
      eventTimeframe: this.reportContextTimeframe(context),
      ownerType: "asset"
    });
  }
  reportTargetName(userId, fallback) {
    const normalizedUserId = userId.trim();
    return this.userProfileStore.getUserProfile(normalizedUserId)?.name?.trim() || (normalizedUserId === this.activeUser().id.trim() ? this.activeUser().name?.trim() : "") || fallback;
  }
  reportContextTimeframe(context) {
    const start = context.subEvent.startAt?.trim();
    const end = context.subEvent.endAt?.trim();
    if (start && end) {
      return `${start} - ${end}`;
    }
    return start || end || "";
  }
  infoCardMenuTitle(card) {
    if (card.menuTitle === null) {
      return null;
    }
    return `${card.menuTitle ?? card.title ?? ""}`.trim();
  }
  infoCardMenuItems(card, request) {
    return (request.actions ?? []).flatMap((actionId) => {
      const config = CARD_MENU_ACTIONS[actionId];
      if (!config) {
        return [];
      }
      const action = __spreadValues({
        id: actionId
      }, config);
      const continueBorrow = actionId === "borrowAsset" && this.hasBorrowDraft(card.id);
      return [{
        id: actionId,
        label: continueBorrow ? this.i18n.translate("asset.borrow.continue") : config.label,
        icon: continueBorrow ? "shopping_basket" : config.icon,
        palette: continueBorrow ? "orange" : this.infoCardActionPalette(config.tone),
        surface: "tinted",
        context: {
          menu: "asset-explore-card",
          card,
          infoCard: request.card,
          action
        }
      }];
    });
  }
  hasBorrowDraft(cardId) {
    const context = this.resourcePopupStore.popupContextRef();
    const activeUserId = this.activeUser().id.trim();
    return Boolean(context && activeUserId && this.readBorrowDraft(activeUserId, context.subEvent.id, cardId)?.confirmedSelectionSignature);
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
  orderPalette(order) {
    if (order === "lowest-price") {
      return "gold";
    }
    if (order === "fewest-policies") {
      return "violet";
    }
    return "green";
  }
  assetCategoryPalette(category) {
    return this.resourceTypePalette(AssetDefaultsBuilder.assetCategoryType(category));
  }
  assetTypeAggregatePalette(type) {
    switch (type) {
      case ASSET_TYPE_TRANSPORT:
        return "blue";
      case ASSET_TYPE_ACCOMMODATION:
        return "teal";
      case ASSET_TYPE_SUPPLIES:
        return "orange";
      default:
        return "default";
    }
  }
  resourceTypePalette(type) {
    switch (type) {
      case "Members":
        return "blue";
      case ASSET_TYPE_TRANSPORT:
        return "sky";
      case ASSET_TYPE_ACCOMMODATION:
        return "green";
      case ASSET_TYPE_SUPPLIES:
        return "brown";
      default:
        return "default";
    }
  }
  initialPageSize(basePageSize) {
    const configuredInitialPageSize = Math.max(basePageSize, Math.trunc(Number(this.smartListConfig.initialPageSize ?? basePageSize)));
    if (!this.isMobileViewport()) {
      return configuredInitialPageSize;
    }
    return basePageSize;
  }
  isMobileViewport() {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia("(max-width: 760px)").matches;
  }
  errorMessage(error, fallback) {
    if (typeof error === "string" && error.trim().length > 0) {
      return error.trim();
    }
    if (error instanceof Error && error.message.trim().length > 0) {
      return error.message.trim();
    }
    return fallback;
  }
  subEventDisplayName(subEvent) {
    return `${subEvent?.name ?? ""}`.trim();
  }
  subEventStageLabel(subEvent) {
    return this.subEventDisplayName(subEvent) || "Sub Event";
  }
  createFallbackUser(userId) {
    return {
      id: userId.trim(),
      name: "User",
      age: 0,
      birthday: "",
      city: "",
      height: "",
      physique: "",
      languages: [],
      horoscope: "",
      initials: "U",
      gender: "woman",
      statusText: "",
      hostTier: "",
      traitLabel: "",
      completion: 0,
      headline: "",
      about: "",
      images: [],
      profileStatus: "public",
      activities: {
        game: 0,
        chats: 0,
        invitations: 0,
        events: 0,
        hosting: 0,
        cars: 0,
        accommodation: 0,
        supplies: 0,
        tickets: 0,
        contacts: 0,
        feedback: 0
      }
    };
  }
  openGoogleMapsSearch(query) {
    const trimmed = query.trim();
    if (!trimmed || typeof window === "undefined") {
      return;
    }
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`, "_blank", "noopener,noreferrer");
  }
  openGoogleMapsDirections(stops) {
    const normalized = stops.map((stop) => stop.trim()).filter(Boolean);
    if (normalized.length === 0 || typeof window === "undefined") {
      return;
    }
    if (normalized.length === 1) {
      this.openGoogleMapsSearch(normalized[0]);
      return;
    }
    const origin = normalized[0];
    const destination = normalized[normalized.length - 1];
    const waypoints = normalized.slice(1, -1);
    let url = `https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
    if (waypoints.length > 0) {
      url += `&waypoints=${encodeURIComponent(waypoints.join("|"))}`;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }
  static \u0275fac = function EventResourceAssetExploreComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EventResourceAssetExploreComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EventResourceAssetExploreComponent, selectors: [["app-event-resource-asset-explore"]], viewQuery: function EventResourceAssetExploreComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.smartList = _t.first);
    }
  }, hostBindings: function EventResourceAssetExploreComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("keydown.escape", function EventResourceAssetExploreComponent_keydown_escape_HostBindingHandler($event) {
        return ctx.onEscapePressed($event);
      }, \u0275\u0275resolveWindow);
    }
  }, inputs: { parentZIndex: "parentZIndex" }, features: [\u0275\u0275ProvidersFeature([AppMenuDispatcher])], decls: 3, vars: 1, consts: [["assetExploreItemTemplate", ""], ["assetExploreSmartList", ""], [3, "model", "zIndex"], [3, "mediaStartClick", "mediaEndClick", "menuAction", "menuRequest", "card", "useSharedMenu"], [1, "asset-explore-popup-screen"], [1, "asset-explore-panel"], [1, "asset-explore-grid"], [1, "asset-explore-empty-state", "asset-explore-empty-state-error"], [1, "asset-explore-empty-state"], [1, "asset-explore-smart-list", 3, "config", "loadPage", "itemTemplate", "query"], ["kind", "fab", "title", "Borrow Basket", 1, "asset-explore-basket-menu", 3, "trigger", "items", "panelAlign", "mobileBreakpointPx"], [3, "itemSelect"], [1, "asset-explore-smart-list", 3, "stateChange", "config", "loadPage", "itemTemplate", "query"], ["kind", "fab", "title", "Borrow Basket", 1, "asset-explore-basket-menu", 3, "itemSelect", "trigger", "items", "panelAlign", "mobileBreakpointPx"], [4, "ngComponentOutlet", "ngComponentOutletInputs"]], template: function EventResourceAssetExploreComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, EventResourceAssetExploreComponent_ng_template_0_Template, 1, 4, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
      \u0275\u0275conditionalCreate(2, EventResourceAssetExploreComponent_Conditional_2_Template, 11, 6, "app-popup", 2);
    }
    if (rf & 2) {
      let tmp_1_0;
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_1_0 = ctx.popupViewState()) ? 2 : -1, tmp_1_0);
    }
  }, dependencies: [
    CommonModule,
    NgComponentOutlet,
    FormsModule,
    MatIconModule,
    MatIcon,
    AppMenuComponent,
    AppMenuOutletComponent,
    PopupComponent,
    InfoCardComponent,
    SmartListComponent
  ], styles: ["/* src/app/activity/components/event-resource-popup/asset-explore/event-resource-asset-explore.component.scss */\napp-event-resource-asset-explore {\n  display: contents;\n}\napp-event-resource-asset-explore .asset-explore-popup-screen {\n  position: relative;\n  display: grid;\n  grid-template-rows: minmax(0, 1fr);\n  height: 100%;\n  min-height: 0;\n  overflow: hidden;\n}\napp-event-resource-asset-explore .asset-explore-panel {\n  position: relative;\n  z-index: 0;\n  min-height: 0;\n  padding: 0;\n  display: grid;\n  gap: 0.9rem;\n}\napp-event-resource-asset-explore .asset-explore-grid,\napp-event-resource-asset-explore .asset-explore-smart-list {\n  min-height: 0;\n  height: 100%;\n}\napp-event-resource-asset-explore .asset-explore-card-list {\n  min-height: 0;\n  padding-right: 0.12rem;\n  padding-bottom: 0.3rem;\n  overscroll-behavior-y: contain;\n}\napp-event-resource-asset-explore .asset-explore-empty-state {\n  grid-column: 1/-1;\n  display: grid;\n  place-items: center;\n  gap: 0.55rem;\n  min-height: 220px;\n  border: 1px dashed rgba(118, 137, 165, 0.34);\n  border-radius: 18px;\n  background: rgba(255, 255, 255, 0.76);\n  color: rgba(51, 72, 103, 0.78);\n  text-align: center;\n  padding: 1.2rem;\n}\napp-event-resource-asset-explore .asset-explore-empty-state .mat-icon {\n  width: 26px;\n  height: 26px;\n  font-size: 26px;\n  line-height: 26px;\n}\napp-event-resource-asset-explore .asset-explore-empty-state-error {\n  border-color: rgba(185, 79, 79, 0.34);\n  color: rgba(146, 45, 45, 0.84);\n  background: rgba(255, 244, 244, 0.88);\n}\napp-event-resource-asset-explore .asset-explore-sticky-header {\n  z-index: 18;\n  margin-bottom: 0;\n  box-shadow: 0 0.34rem 0 rgba(255, 255, 255, 0.98);\n}\napp-event-resource-asset-explore .asset-explore-basket-menu {\n  position: absolute;\n  right: 0.75rem;\n  bottom: 0.9rem;\n  z-index: 18;\n  display: inline-flex;\n  --app-menu-panel-gap: 0.6rem;\n}\n@media (max-width: 760px) {\n  app-event-resource-asset-explore .asset-explore-smart-list,\n  app-event-resource-asset-explore .asset-explore-card-list {\n    min-height: 0;\n  }\n  app-event-resource-asset-explore .asset-explore-basket-menu {\n    right: 0.55rem;\n    bottom: 0.7rem;\n  }\n}\n/*# sourceMappingURL=event-resource-asset-explore.component.css.map */\n"], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EventResourceAssetExploreComponent, [{
    type: Component,
    args: [{ selector: "app-event-resource-asset-explore", standalone: true, imports: [
      CommonModule,
      FormsModule,
      MatIconModule,
      AppMenuComponent,
      AppMenuOutletComponent,
      PopupComponent,
      InfoCardComponent,
      SmartListComponent
    ], encapsulation: ViewEncapsulation.None, providers: [AppMenuDispatcher], template: `<ng-template #assetExploreItemTemplate let-card let-groupLabel="groupLabel">
  <app-info-card
    [card]="itemInfoCard(card, { groupLabel })"
    [useSharedMenu]="true"
    (mediaStartClick)="openOwnerImpressions(card)"
    (mediaEndClick)="openBorrowFromBadge(card)"
    (menuAction)="onCardMenuAction(card, $event)"
    (menuRequest)="openInfoCardMenu(card, $event)"
  ></app-info-card>
</ng-template>

@if (popupViewState(); as explore) {
  <app-popup [model]="assetExplorePopupModel(explore)" [zIndex]="assetExplorePopupZIndex()">
    <div class="asset-explore-popup-screen">
      <section class="asset-explore-panel">
        <div class="asset-explore-grid">
          @if (explore.error && explore.cards.length > 0) {
            <section class="asset-explore-empty-state asset-explore-empty-state-error">
              <mat-icon>error</mat-icon>
              <span>{{ explore.error }}</span>
            </section>
          }
          @if (explore.error && explore.cards.length === 0) {
            <section class="asset-explore-empty-state asset-explore-empty-state-error">
              <mat-icon>error</mat-icon>
              <span>{{ explore.error }}</span>
            </section>
          } @else if (explore.cards.length === 0 && !explore.loading) {
            <section class="asset-explore-empty-state">
              <mat-icon>travel_explore</mat-icon>
              <span>No visible assets match this date range and category yet.</span>
            </section>
          } @else {
            <app-smart-list
              #assetExploreSmartList
              class="asset-explore-smart-list"
              [config]="smartListConfig"
              [loadPage]="smartListLoadPage"
              [itemTemplate]="assetExploreItemTemplate"
              [query]="smartListQuery"
              (stateChange)="onSmartListStateChange($event)"
            ></app-smart-list>
          }
        </div>
      </section>

      @if (borrowDraftCount() > 0) {
        <app-menu
          class="asset-explore-basket-menu"
          kind="fab"
          title="Borrow Basket"
          [trigger]="borrowDraftMenuTrigger()"
          [items]="borrowDraftMenuItems()"
          [panelAlign]="'end'"
          [mobileBreakpointPx]="900"
          (itemSelect)="onMenuSelect($event)"
        ></app-menu>
      }

      @if (assetView()) {
        @if (resourcePopupStore.eventResourceAssetViewComponent(); as assetViewComponent) {
          <ng-container *ngComponentOutlet="assetViewComponent; inputs: assetViewOutletInputs()"></ng-container>
        }
      }

    </div>

    <app-menu-outlet (itemSelect)="onMenuSelect($event)"></app-menu-outlet>
  </app-popup>
}
`, styles: ["/* src/app/activity/components/event-resource-popup/asset-explore/event-resource-asset-explore.component.scss */\napp-event-resource-asset-explore {\n  display: contents;\n}\napp-event-resource-asset-explore .asset-explore-popup-screen {\n  position: relative;\n  display: grid;\n  grid-template-rows: minmax(0, 1fr);\n  height: 100%;\n  min-height: 0;\n  overflow: hidden;\n}\napp-event-resource-asset-explore .asset-explore-panel {\n  position: relative;\n  z-index: 0;\n  min-height: 0;\n  padding: 0;\n  display: grid;\n  gap: 0.9rem;\n}\napp-event-resource-asset-explore .asset-explore-grid,\napp-event-resource-asset-explore .asset-explore-smart-list {\n  min-height: 0;\n  height: 100%;\n}\napp-event-resource-asset-explore .asset-explore-card-list {\n  min-height: 0;\n  padding-right: 0.12rem;\n  padding-bottom: 0.3rem;\n  overscroll-behavior-y: contain;\n}\napp-event-resource-asset-explore .asset-explore-empty-state {\n  grid-column: 1/-1;\n  display: grid;\n  place-items: center;\n  gap: 0.55rem;\n  min-height: 220px;\n  border: 1px dashed rgba(118, 137, 165, 0.34);\n  border-radius: 18px;\n  background: rgba(255, 255, 255, 0.76);\n  color: rgba(51, 72, 103, 0.78);\n  text-align: center;\n  padding: 1.2rem;\n}\napp-event-resource-asset-explore .asset-explore-empty-state .mat-icon {\n  width: 26px;\n  height: 26px;\n  font-size: 26px;\n  line-height: 26px;\n}\napp-event-resource-asset-explore .asset-explore-empty-state-error {\n  border-color: rgba(185, 79, 79, 0.34);\n  color: rgba(146, 45, 45, 0.84);\n  background: rgba(255, 244, 244, 0.88);\n}\napp-event-resource-asset-explore .asset-explore-sticky-header {\n  z-index: 18;\n  margin-bottom: 0;\n  box-shadow: 0 0.34rem 0 rgba(255, 255, 255, 0.98);\n}\napp-event-resource-asset-explore .asset-explore-basket-menu {\n  position: absolute;\n  right: 0.75rem;\n  bottom: 0.9rem;\n  z-index: 18;\n  display: inline-flex;\n  --app-menu-panel-gap: 0.6rem;\n}\n@media (max-width: 760px) {\n  app-event-resource-asset-explore .asset-explore-smart-list,\n  app-event-resource-asset-explore .asset-explore-card-list {\n    min-height: 0;\n  }\n  app-event-resource-asset-explore .asset-explore-basket-menu {\n    right: 0.55rem;\n    bottom: 0.7rem;\n  }\n}\n/*# sourceMappingURL=event-resource-asset-explore.component.css.map */\n"] }]
  }], () => [], { parentZIndex: [{
    type: Input
  }], smartList: [{
    type: ViewChild,
    args: ["assetExploreSmartList"]
  }], onEscapePressed: [{
    type: HostListener,
    args: ["window:keydown.escape", ["$event"]]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EventResourceAssetExploreComponent, { className: "EventResourceAssetExploreComponent", filePath: "app/activity/components/event-resource-popup/asset-explore/event-resource-asset-explore.component.ts", lineNumber: 255 });
})();
export {
  EventResourceAssetExploreComponent
};
//# sourceMappingURL=event-resource-asset-explore.component-P76CF3WS.js.map
