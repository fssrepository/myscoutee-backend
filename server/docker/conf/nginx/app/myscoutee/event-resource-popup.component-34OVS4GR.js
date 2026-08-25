import {
  AssetPopupStore
} from "./chunk-URPQXVSP.js";
import {
  MemberMenuStore
} from "./chunk-KQF6FQ63.js";
import {
  ActivitiesPopupStore,
  AssetStore,
  ProfileStore,
  eventChatHeaderStateFromChat,
  eventChatPopupRequestFromChat
} from "./chunk-VUKE3O6U.js";
import {
  SmartListComponent
} from "./chunk-QGX3AOF4.js";
import {
  SubEventResourcePopupStore
} from "./chunk-R7DDCU2I.js";
import {
  ActivityChatSingleRowConverter,
  ActivitySubEventResourceInfoCardConverter
} from "./chunk-52WP4I47.js";
import "./chunk-RJSPRCFL.js";
import "./chunk-XXLX3JOX.js";
import "./chunk-BN6P7BIB.js";
import {
  CARD_MENU_ACTIONS,
  InfoCardComponent
} from "./chunk-LXXIK2TC.js";
import "./chunk-RB7FL7JP.js";
import {
  PopupComponent
} from "./chunk-GBRBIJ5J.js";
import "./chunk-VEYRCVMX.js";
import "./chunk-MVR37RGJ.js";
import {
  AppMenuComponent,
  AppMenuDispatcher,
  AppMenuOutletComponent,
  FormsModule
} from "./chunk-QD6QQNQX.js";
import {
  DialogStore
} from "./chunk-6TR3Z2F3.js";
import "./chunk-EDHGCWPF.js";
import "./chunk-CUDLB52K.js";
import {
  ActivityResourcesService,
  AssetsService,
  ChatsService
} from "./chunk-C2QYRRDX.js";
import {
  EventsService,
  ShareTokensService
} from "./chunk-Y3NEBFNQ.js";
import "./chunk-PB4YNHSN.js";
import {
  UsersService
} from "./chunk-VUN7WUNQ.js";
import "./chunk-5PHTFUHA.js";
import {
  APP_STATIC_DATA,
  ActivityResourceBuilder,
  AssetCardBuilder,
  AssetDefaultsBuilder,
  PricingBuilder
} from "./chunk-Y2Y4ZDHH.js";
import {
  I18nService
} from "./chunk-B7YPVC5F.js";
import {
  ASSET_TYPES,
  ASSET_TYPE_ACCOMMODATION,
  ASSET_TYPE_SUPPLIES,
  ASSET_TYPE_TRANSPORT,
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
  ActivityStore,
  UserProfileStore
} from "./chunk-INZQPXQM.js";
import "./chunk-IECLTXM5.js";
import "./chunk-333NTD7D.js";
import "./chunk-LERGHE7K.js";
import "./chunk-D6ZHKNYF.js";
import "./chunk-SKAK727J.js";
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
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
  ɵɵclassProp,
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
  ɵɵreference,
  ɵɵresetView,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵviewQuery
} from "./chunk-XJL7SWH7.js";

// src/app/activity/components/event-resource-popup/resource-list/event-resource-list.component.ts
var _c0 = ["resourceSmartList"];
function EventResourceListComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-info-card", 8);
    \u0275\u0275listener("mediaStartClick", function EventResourceListComponent_ng_template_0_Template_app_info_card_mediaStartClick_0_listener() {
      const item_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.openResourceCardMap(item_r2));
    })("mediaEndClick", function EventResourceListComponent_ng_template_0_Template_app_info_card_mediaEndClick_0_listener() {
      const item_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.openResourceCardBadgeDetails(item_r2));
    })("menuAction", function EventResourceListComponent_ng_template_0_Template_app_info_card_menuAction_0_listener($event) {
      const item_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onResourceCardMenuAction(item_r2, $event));
    })("menuRequest", function EventResourceListComponent_ng_template_0_Template_app_info_card_menuRequest_0_listener($event) {
      const item_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.openResourceInfoCardMenu(item_r2, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r2 = ctx.$implicit;
    \u0275\u0275property("card", item_r2.infoCard)("useSharedMenu", true);
  }
}
var EMPTY_FILTER_COUNTS = {
  [ASSET_TYPE_TRANSPORT]: 0,
  [ASSET_TYPE_ACCOMMODATION]: 0,
  [ASSET_TYPE_SUPPLIES]: 0
};
var EMPTY_MODEL = {
  filter: ASSET_TYPE_TRANSPORT,
  metricIdentity: "",
  filterCounts: EMPTY_FILTER_COUNTS,
  items: []
};
var EventResourceListComponent = class _EventResourceListComponent {
  model = null;
  filterSelected = new EventEmitter();
  assignRequested = new EventEmitter();
  exploreRequested = new EventEmitter();
  mapRequested = new EventEmitter();
  badgeDetailsRequested = new EventEmitter();
  cardActionRequested = new EventEmitter();
  appMenuDispatcher = inject(AppMenuDispatcher);
  activityResourcesService = inject(ActivityResourcesService);
  lastItemsSignature = "";
  lastContextKey = "";
  lastItemCount = 0;
  resourceListReady = false;
  resourceListVisibleCount = 0;
  resourceFilterOptions = ASSET_TYPES;
  resourceSmartListQuery = {
    filters: {
      revision: 0,
      contextKey: ""
    }
  };
  resourceSmartList;
  resourceSmartListLoadPage = (query) => from(this.loadResourceSmartListPage(query));
  resourceSmartListConfig = {
    pageSize: 18,
    defaultView: "list",
    headerProgress: {
      enabled: true
    },
    emptyLabel: "No assigned resources yet.",
    emptyDescription: () => this.currentModel().canAssign === false ? "The organizer has not published resources for this category." : "Assign current-user assets to see them here.",
    showStickyHeader: false,
    showGroupMarker: () => false,
    listLayout: "card-grid",
    desktopColumns: 3,
    snapMode: "none",
    containerClass: {
      "experience-card-list": true,
      "assets-card-list": true,
      "subevent-resource-card-list": true
    },
    trackBy: (_index, item) => item.card.id
  };
  ngDoCheck() {
    const model = this.currentModel();
    const contextKey = model.filter;
    const signature = `${contextKey}:${model.items.map((item) => this.itemSignature(item)).join("|")}`;
    if (contextKey !== this.lastContextKey) {
      this.lastContextKey = contextKey;
      this.lastItemsSignature = signature;
      this.lastItemCount = model.items.length;
      this.resourceListReady = false;
      this.resourceListVisibleCount = 0;
      this.resourceSmartListQuery = {
        filters: {
          revision: Date.now(),
          contextKey
        }
      };
    } else if (signature !== this.lastItemsSignature) {
      const previousItemCount = this.lastItemCount;
      this.lastItemsSignature = signature;
      this.lastItemCount = model.items.length;
      this.syncVisibleResourceItems(model.items, previousItemCount);
    }
  }
  onResourceSmartListStateChange(change) {
    this.resourceListVisibleCount = change.items.length;
    this.resourceListReady = !change.initialLoading;
    if (!this.resourceListReady) {
      return;
    }
    const items = this.currentModel().items;
    if (change.total !== items.length) {
      this.syncVisibleResourceItems(items, change.total);
    }
  }
  resourceFilterMenuTrigger() {
    const model = this.currentModel();
    const count = this.resourceFilterCount(model.filter);
    return {
      label: this.resourceTypeLabel(model.filter).toLowerCase(),
      icon: this.resourceTypeIcon(model.filter),
      ariaLabel: "Open asset filter",
      palette: this.resourceTypePalette(model.filter),
      counter: count > 0 ? { value: count, max: 99 } : null,
      layout: "pill"
    };
  }
  resourceFilterMenuItems() {
    const active = this.currentModel().filter;
    return this.resourceFilterOptions.map((option) => {
      const count = this.resourceFilterCount(option);
      return {
        id: `resource-filter-${option}`,
        label: this.resourceTypeLabel(option).toLowerCase(),
        icon: this.resourceTypeIcon(option),
        kind: "radio",
        active: option === active,
        checked: option === active,
        palette: this.resourceTypePalette(option),
        surface: "tinted",
        counter: count > 0 ? { value: count, max: 99 } : null,
        context: { menu: "resource-filter", filter: option }
      };
    });
  }
  quickActionsMenuTrigger() {
    return {
      icon: "add",
      closeIcon: "close",
      ariaLabel: "Open sub-event asset actions",
      hideLabel: true,
      palette: "green",
      layout: "icon"
    };
  }
  quickActionsMenuItems() {
    const actions = [];
    if (this.currentModel().canAssign !== false) {
      actions.push({
        id: "quick-assign",
        label: "Assign",
        icon: "assignment_ind",
        palette: "blue",
        surface: "tinted",
        context: { menu: "quick-action", action: "assign" }
      });
    }
    actions.push({
      id: "quick-explore",
      label: "Explore",
      icon: "explore",
      palette: "green",
      surface: "tinted",
      context: { menu: "quick-action", action: "explore" }
    });
    return actions;
  }
  onEventResourceMenuSelect(event) {
    const context = event.context;
    if (!context) {
      return;
    }
    switch (context.menu) {
      case "resource-filter":
        event.sourceEvent.stopPropagation();
        this.filterSelected.emit(context.filter);
        return;
      case "quick-action":
        if (context.action === "assign") {
          this.assignRequested.emit(event.sourceEvent);
          return;
        }
        this.exploreRequested.emit(event.sourceEvent);
        return;
      case "resource-card":
        this.cardActionRequested.emit({
          card: context.card,
          event: {
            id: context.infoCard.id,
            actionId: context.action.id,
            action: context.action,
            card: context.infoCard
          }
        });
        return;
      default:
        return;
    }
  }
  openResourceInfoCardMenu(item, request) {
    const menuId = `event-resource-card:${request.id}`;
    if (this.appMenuDispatcher.isOpen(menuId)) {
      this.appMenuDispatcher.close(menuId);
      return;
    }
    this.appMenuDispatcher.open({
      id: menuId,
      kind: "select",
      title: this.infoCardMenuTitle(request.card),
      items: this.infoCardMenuItems(item.card, request),
      triggerRect: request.triggerRect,
      openUp: request.openUp,
      panelAlign: "auto",
      closeOnSelect: true,
      onClose: request.closeTrigger
    }, null);
  }
  openResourceCardMap(item) {
    this.mapRequested.emit(item.card);
  }
  openResourceCardBadgeDetails(item) {
    this.badgeDetailsRequested.emit(item.card);
  }
  onResourceCardMenuAction(item, event) {
    this.cardActionRequested.emit({
      card: item.card,
      event
    });
  }
  async loadResourceSmartListPage(query) {
    await this.activityResourcesService.waitForResourceRouteDelay();
    const items = this.currentModel().items;
    const page = Math.max(0, Math.trunc(Number(query.page) || 0));
    const pageSize = Math.max(1, Math.trunc(Number(query.pageSize) || 1));
    const start = page * pageSize;
    return {
      items: items.slice(start, start + pageSize),
      total: items.length
    };
  }
  syncVisibleResourceItems(items, previousItemCount) {
    if (!this.resourceListReady || !this.resourceSmartList) {
      return;
    }
    const visibleCount = Math.max(this.resourceListVisibleCount, this.resourceSmartList.itemsSnapshot().length);
    const allItemsWereVisible = visibleCount >= previousItemCount;
    let nextVisibleCount = Math.min(items.length, visibleCount);
    if (items.length > previousItemCount && allItemsWereVisible) {
      nextVisibleCount = Math.min(items.length, visibleCount + (items.length - previousItemCount));
    }
    this.resourceSmartList.syncVisibleItems(items.slice(0, nextVisibleCount), {
      total: items.length,
      trackBy: (_index, item) => item.card.id,
      equals: (current, next) => this.itemSignature(current) === this.itemSignature(next)
    });
  }
  itemSignature(item) {
    return [
      item.card.id,
      item.card.accepted,
      item.card.pending,
      item.card.capacityTotal,
      ...item.card.routes ?? [],
      item.infoCard.title,
      item.infoCard.mediaSubtitle,
      item.infoCard.description,
      ...item.infoCard.detailRows ?? [],
      ...item.infoCard.menuActions ?? []
    ].join(":");
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
      const context = {
        menu: "resource-card",
        card,
        infoCard: request.card,
        action
      };
      return [{
        id: actionId,
        label: config.label,
        icon: config.icon,
        palette: this.infoCardActionPalette(config.tone),
        surface: "tinted",
        context
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
  resourceFilterCount(type) {
    return this.currentModel().filterCounts[type] ?? 0;
  }
  currentModel() {
    return this.model ?? EMPTY_MODEL;
  }
  resourceTypeIcon(type) {
    return type === "Members" ? "groups" : AssetDefaultsBuilder.assetTypeIcon(type);
  }
  resourceTypeLabel(type) {
    return APP_STATIC_DATA.subEventResourceFilterLabels[type];
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
  static \u0275fac = function EventResourceListComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EventResourceListComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EventResourceListComponent, selectors: [["app-event-resource-list"]], viewQuery: function EventResourceListComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.resourceSmartList = _t.first);
    }
  }, inputs: { model: "model" }, outputs: { filterSelected: "filterSelected", assignRequested: "assignRequested", exploreRequested: "exploreRequested", mapRequested: "mapRequested", badgeDetailsRequested: "badgeDetailsRequested", cardActionRequested: "cardActionRequested" }, features: [\u0275\u0275ProvidersFeature([AppMenuDispatcher])], decls: 9, vars: 8, consts: [["resourceItemTemplate", ""], ["resourceSmartList", ""], [1, "experience-toolbar", "assets-toolbar"], ["kind", "select", 1, "subevent-resource-filter-menu", 3, "itemSelect", "trigger", "items"], [1, "subevent-assets-toolbar-actions"], ["kind", "select", 1, "subevent-assets-quick-actions", 3, "itemSelect", "trigger", "items"], [1, "subevent-assets-scroll-list", 3, "stateChange", "config", "loadPage", "itemTemplate", "query"], [3, "itemSelect"], [3, "mediaStartClick", "mediaEndClick", "menuAction", "menuRequest", "card", "useSharedMenu"]], template: function EventResourceListComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, EventResourceListComponent_ng_template_0_Template, 1, 2, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementStart(2, "div", 2)(3, "app-menu", 3);
      \u0275\u0275listener("itemSelect", function EventResourceListComponent_Template_app_menu_itemSelect_3_listener($event) {
        return ctx.onEventResourceMenuSelect($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div", 4)(5, "app-menu", 5);
      \u0275\u0275listener("itemSelect", function EventResourceListComponent_Template_app_menu_itemSelect_5_listener($event) {
        return ctx.onEventResourceMenuSelect($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(6, "app-smart-list", 6, 1);
      \u0275\u0275listener("stateChange", function EventResourceListComponent_Template_app_smart_list_stateChange_6_listener($event) {
        return ctx.onResourceSmartListStateChange($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "app-menu-outlet", 7);
      \u0275\u0275listener("itemSelect", function EventResourceListComponent_Template_app_menu_outlet_itemSelect_8_listener($event) {
        return ctx.onEventResourceMenuSelect($event);
      });
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      const resourceItemTemplate_r4 = \u0275\u0275reference(1);
      \u0275\u0275advance(3);
      \u0275\u0275property("trigger", ctx.resourceFilterMenuTrigger())("items", ctx.resourceFilterMenuItems());
      \u0275\u0275advance(2);
      \u0275\u0275property("trigger", ctx.quickActionsMenuTrigger())("items", ctx.quickActionsMenuItems());
      \u0275\u0275advance();
      \u0275\u0275property("config", ctx.resourceSmartListConfig)("loadPage", ctx.resourceSmartListLoadPage)("itemTemplate", resourceItemTemplate_r4)("query", ctx.resourceSmartListQuery);
    }
  }, dependencies: [
    CommonModule,
    AppMenuComponent,
    AppMenuOutletComponent,
    InfoCardComponent,
    SmartListComponent
  ], styles: ["/* src/app/activity/components/event-resource-popup/resource-list/event-resource-list.component.scss */\n:host {\n  --interactive-motion-duration: 160ms;\n  --interactive-motion-ease: cubic-bezier(0.22, 1, 0.36, 1);\n  --interactive-hover-lift: -1px;\n  --interactive-hover-scale: 1.01;\n  --interactive-hover-brightness: 1.01;\n  --interactive-press-scale: 0.97;\n  --interactive-press-brightness: 0.97;\n}\n:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]) {\n  -webkit-tap-highlight-color: transparent;\n  transition:\n    transform var(--interactive-motion-duration) var(--interactive-motion-ease),\n    filter var(--interactive-motion-duration) var(--interactive-motion-ease),\n    box-shadow var(--interactive-motion-duration) var(--interactive-motion-ease),\n    background-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    border-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    color var(--interactive-motion-duration) var(--interactive-motion-ease);\n  transform-origin: center;\n}\n:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):focus-visible {\n  outline: 2px solid rgba(66, 110, 182, 0.44);\n  outline-offset: 2px;\n}\n@media (hover: hover) and (pointer: fine) {\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):hover {\n    transform: translateY(var(--interactive-hover-lift)) scale(var(--interactive-hover-scale));\n    filter: brightness(var(--interactive-hover-brightness));\n  }\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  :where(.motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):hover {\n    box-shadow: 0 3px 10px rgba(16, 29, 48, 0.14);\n  }\n}\n@keyframes shared-mobile-touch-feedback {\n  0% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n  45% {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  100% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n}\n@media (hover: none), (pointer: coarse) {\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    animation: shared-mobile-touch-feedback 0.2s ease;\n  }\n}\napp-event-resource-list {\n  display: contents;\n}\n.event-resource-popup-shell .assets-toolbar {\n  position: relative;\n  z-index: 4;\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  flex-wrap: wrap;\n}\n.event-resource-popup-shell .assets-toolbar .profile-status-select-wrap {\n  position: relative;\n  overflow: visible;\n}\n.event-resource-popup-shell .assets-toolbar .status-option-content {\n  gap: 0.34rem;\n}\n.event-resource-popup-shell .subevent-assets-toolbar-actions {\n  margin-left: auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n}\n.event-resource-popup-shell .subevent-assets-quick-actions {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n}\n.event-resource-popup-shell app-smart-list.subevent-assets-scroll-list {\n  position: relative;\n  z-index: 0;\n  display: flex;\n  flex: 1 1 auto;\n  min-height: 0;\n}\n.event-resource-popup-shell .subevent-resource-card-list {\n  min-height: 0;\n  padding-bottom: 0.3rem;\n}\n.event-resource-popup-shell .assets-toolbar .profile-status-select-wrap:focus-within {\n  outline: none;\n}\n.event-resource-popup-shell .assets-toolbar .profile-status-select-wrap.asset-filter-open {\n  outline: none;\n  box-shadow: 0 5px 14px rgba(30, 64, 106, 0.2);\n}\n.event-resource-popup-shell .assets-toolbar .profile-status-select-wrap.asset-filter-transport.asset-filter-open {\n  background:\n    linear-gradient(\n      180deg,\n      #d6e8ff 0%,\n      #c7dcfa 100%);\n  color: #173d69;\n}\n.event-resource-popup-shell .assets-toolbar .profile-status-select-wrap.asset-filter-accommodation.asset-filter-open {\n  background:\n    linear-gradient(\n      180deg,\n      #d7efe2 0%,\n      #c8e3d4 100%);\n  color: #164936;\n}\n.event-resource-popup-shell .assets-toolbar .profile-status-select-wrap.asset-filter-supplies.asset-filter-open {\n  background:\n    linear-gradient(\n      180deg,\n      #ffe6ce 0%,\n      #f5d4b2 100%);\n  color: #633917;\n}\n.event-resource-popup-shell .subevent-assets-quick-actions-trigger.is-open .mat-icon {\n  transform: rotate(45deg);\n}\n.event-resource-popup-shell .experience-filter-select.asset-filter-transport,\n.event-resource-popup-shell .experience-type-select.asset-filter-transport {\n  background:\n    linear-gradient(\n      180deg,\n      #eef6ff 0%,\n      #e2efff 100%);\n  border-color: rgba(43, 111, 179, 0.32);\n}\n.event-resource-popup-shell .experience-filter-select.asset-filter-accommodation,\n.event-resource-popup-shell .experience-type-select.asset-filter-accommodation {\n  background:\n    linear-gradient(\n      180deg,\n      #edf9f4 0%,\n      #e1f3ea 100%);\n  border-color: rgba(37, 127, 95, 0.32);\n}\n.event-resource-popup-shell .experience-filter-select.asset-filter-supplies,\n.event-resource-popup-shell .experience-type-select.asset-filter-supplies {\n  background:\n    linear-gradient(\n      180deg,\n      #fff5ec 0%,\n      #feead9 100%);\n  border-color: rgba(151, 92, 41, 0.32);\n}\n.event-resource-popup-shell .asset-filter-transport {\n  color: #295d96;\n}\n.event-resource-popup-shell .asset-filter-accommodation {\n  color: #236d51;\n}\n.event-resource-popup-shell .asset-filter-supplies {\n  color: #8a5428;\n}\n.event-resource-popup-shell .subevent-resource-card-list app-info-card [class*=avatar],\n.event-resource-popup-shell .subevent-resource-card-list app-info-card [class*=media-start] {\n  background:\n    linear-gradient(\n      180deg,\n      #ffe8cc 0%,\n      #ffd7af 100%) !important;\n  border: 1px solid rgba(179, 108, 42, 0.54) !important;\n  color: #8c4f18 !important;\n  transition:\n    transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),\n    box-shadow 0.2s ease,\n    filter 0.2s ease !important;\n}\n.event-resource-popup-shell .subevent-resource-card-list app-info-card [class*=avatar] .mat-icon,\n.event-resource-popup-shell .subevent-resource-card-list app-info-card [class*=media-start] .mat-icon {\n  color: #8c4f18 !important;\n}\n.event-resource-popup-shell .subevent-resource-card-list app-info-card [class*=avatar]:hover,\n.event-resource-popup-shell .subevent-resource-card-list app-info-card [class*=media-start]:hover {\n  transform: scale(1.08) translateY(-1px) !important;\n  box-shadow: 0 4px 12px rgba(179, 108, 42, 0.25) !important;\n  filter: brightness(1.05) !important;\n}\n.event-resource-popup-shell .subevent-resource-card-list app-info-card [class*=avatar]:active,\n.event-resource-popup-shell .subevent-resource-card-list app-info-card [class*=media-start]:active {\n  transform: scale(0.95) !important;\n  box-shadow: 0 1px 4px rgba(179, 108, 42, 0.15) !important;\n}\n/*# sourceMappingURL=event-resource-list.component.css.map */\n"], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EventResourceListComponent, [{
    type: Component,
    args: [{ selector: "app-event-resource-list", standalone: true, imports: [
      CommonModule,
      AppMenuComponent,
      AppMenuOutletComponent,
      InfoCardComponent,
      SmartListComponent
    ], encapsulation: ViewEncapsulation.None, providers: [AppMenuDispatcher], template: '<ng-template #resourceItemTemplate let-item>\n  <app-info-card\n    [card]="item.infoCard"\n    [useSharedMenu]="true"\n    (mediaStartClick)="openResourceCardMap(item)"\n    (mediaEndClick)="openResourceCardBadgeDetails(item)"\n    (menuAction)="onResourceCardMenuAction(item, $event)"\n    (menuRequest)="openResourceInfoCardMenu(item, $event)"\n  ></app-info-card>\n</ng-template>\n\n<div class="experience-toolbar assets-toolbar">\n  <app-menu\n    class="subevent-resource-filter-menu"\n    kind="select"\n    [trigger]="resourceFilterMenuTrigger()"\n    [items]="resourceFilterMenuItems()"\n    (itemSelect)="onEventResourceMenuSelect($event)"\n  ></app-menu>\n\n  <div class="subevent-assets-toolbar-actions">\n    <app-menu\n      class="subevent-assets-quick-actions"\n      kind="select"\n      [trigger]="quickActionsMenuTrigger()"\n      [items]="quickActionsMenuItems()"\n      (itemSelect)="onEventResourceMenuSelect($event)"\n    ></app-menu>\n  </div>\n</div>\n\n<app-smart-list\n  #resourceSmartList\n  class="subevent-assets-scroll-list"\n  [config]="resourceSmartListConfig"\n  [loadPage]="resourceSmartListLoadPage"\n  [itemTemplate]="resourceItemTemplate"\n  [query]="resourceSmartListQuery"\n  (stateChange)="onResourceSmartListStateChange($event)"\n></app-smart-list>\n\n<app-menu-outlet\n  (itemSelect)="onEventResourceMenuSelect($event)"\n></app-menu-outlet>\n', styles: ["/* src/app/activity/components/event-resource-popup/resource-list/event-resource-list.component.scss */\n:host {\n  --interactive-motion-duration: 160ms;\n  --interactive-motion-ease: cubic-bezier(0.22, 1, 0.36, 1);\n  --interactive-hover-lift: -1px;\n  --interactive-hover-scale: 1.01;\n  --interactive-hover-brightness: 1.01;\n  --interactive-press-scale: 0.97;\n  --interactive-press-brightness: 0.97;\n}\n:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]) {\n  -webkit-tap-highlight-color: transparent;\n  transition:\n    transform var(--interactive-motion-duration) var(--interactive-motion-ease),\n    filter var(--interactive-motion-duration) var(--interactive-motion-ease),\n    box-shadow var(--interactive-motion-duration) var(--interactive-motion-ease),\n    background-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    border-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    color var(--interactive-motion-duration) var(--interactive-motion-ease);\n  transform-origin: center;\n}\n:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):focus-visible {\n  outline: 2px solid rgba(66, 110, 182, 0.44);\n  outline-offset: 2px;\n}\n@media (hover: hover) and (pointer: fine) {\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):hover {\n    transform: translateY(var(--interactive-hover-lift)) scale(var(--interactive-hover-scale));\n    filter: brightness(var(--interactive-hover-brightness));\n  }\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  :where(.motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):hover {\n    box-shadow: 0 3px 10px rgba(16, 29, 48, 0.14);\n  }\n}\n@keyframes shared-mobile-touch-feedback {\n  0% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n  45% {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  100% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n}\n@media (hover: none), (pointer: coarse) {\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    animation: shared-mobile-touch-feedback 0.2s ease;\n  }\n}\napp-event-resource-list {\n  display: contents;\n}\n.event-resource-popup-shell .assets-toolbar {\n  position: relative;\n  z-index: 4;\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  flex-wrap: wrap;\n}\n.event-resource-popup-shell .assets-toolbar .profile-status-select-wrap {\n  position: relative;\n  overflow: visible;\n}\n.event-resource-popup-shell .assets-toolbar .status-option-content {\n  gap: 0.34rem;\n}\n.event-resource-popup-shell .subevent-assets-toolbar-actions {\n  margin-left: auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n}\n.event-resource-popup-shell .subevent-assets-quick-actions {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n}\n.event-resource-popup-shell app-smart-list.subevent-assets-scroll-list {\n  position: relative;\n  z-index: 0;\n  display: flex;\n  flex: 1 1 auto;\n  min-height: 0;\n}\n.event-resource-popup-shell .subevent-resource-card-list {\n  min-height: 0;\n  padding-bottom: 0.3rem;\n}\n.event-resource-popup-shell .assets-toolbar .profile-status-select-wrap:focus-within {\n  outline: none;\n}\n.event-resource-popup-shell .assets-toolbar .profile-status-select-wrap.asset-filter-open {\n  outline: none;\n  box-shadow: 0 5px 14px rgba(30, 64, 106, 0.2);\n}\n.event-resource-popup-shell .assets-toolbar .profile-status-select-wrap.asset-filter-transport.asset-filter-open {\n  background:\n    linear-gradient(\n      180deg,\n      #d6e8ff 0%,\n      #c7dcfa 100%);\n  color: #173d69;\n}\n.event-resource-popup-shell .assets-toolbar .profile-status-select-wrap.asset-filter-accommodation.asset-filter-open {\n  background:\n    linear-gradient(\n      180deg,\n      #d7efe2 0%,\n      #c8e3d4 100%);\n  color: #164936;\n}\n.event-resource-popup-shell .assets-toolbar .profile-status-select-wrap.asset-filter-supplies.asset-filter-open {\n  background:\n    linear-gradient(\n      180deg,\n      #ffe6ce 0%,\n      #f5d4b2 100%);\n  color: #633917;\n}\n.event-resource-popup-shell .subevent-assets-quick-actions-trigger.is-open .mat-icon {\n  transform: rotate(45deg);\n}\n.event-resource-popup-shell .experience-filter-select.asset-filter-transport,\n.event-resource-popup-shell .experience-type-select.asset-filter-transport {\n  background:\n    linear-gradient(\n      180deg,\n      #eef6ff 0%,\n      #e2efff 100%);\n  border-color: rgba(43, 111, 179, 0.32);\n}\n.event-resource-popup-shell .experience-filter-select.asset-filter-accommodation,\n.event-resource-popup-shell .experience-type-select.asset-filter-accommodation {\n  background:\n    linear-gradient(\n      180deg,\n      #edf9f4 0%,\n      #e1f3ea 100%);\n  border-color: rgba(37, 127, 95, 0.32);\n}\n.event-resource-popup-shell .experience-filter-select.asset-filter-supplies,\n.event-resource-popup-shell .experience-type-select.asset-filter-supplies {\n  background:\n    linear-gradient(\n      180deg,\n      #fff5ec 0%,\n      #feead9 100%);\n  border-color: rgba(151, 92, 41, 0.32);\n}\n.event-resource-popup-shell .asset-filter-transport {\n  color: #295d96;\n}\n.event-resource-popup-shell .asset-filter-accommodation {\n  color: #236d51;\n}\n.event-resource-popup-shell .asset-filter-supplies {\n  color: #8a5428;\n}\n.event-resource-popup-shell .subevent-resource-card-list app-info-card [class*=avatar],\n.event-resource-popup-shell .subevent-resource-card-list app-info-card [class*=media-start] {\n  background:\n    linear-gradient(\n      180deg,\n      #ffe8cc 0%,\n      #ffd7af 100%) !important;\n  border: 1px solid rgba(179, 108, 42, 0.54) !important;\n  color: #8c4f18 !important;\n  transition:\n    transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),\n    box-shadow 0.2s ease,\n    filter 0.2s ease !important;\n}\n.event-resource-popup-shell .subevent-resource-card-list app-info-card [class*=avatar] .mat-icon,\n.event-resource-popup-shell .subevent-resource-card-list app-info-card [class*=media-start] .mat-icon {\n  color: #8c4f18 !important;\n}\n.event-resource-popup-shell .subevent-resource-card-list app-info-card [class*=avatar]:hover,\n.event-resource-popup-shell .subevent-resource-card-list app-info-card [class*=media-start]:hover {\n  transform: scale(1.08) translateY(-1px) !important;\n  box-shadow: 0 4px 12px rgba(179, 108, 42, 0.25) !important;\n  filter: brightness(1.05) !important;\n}\n.event-resource-popup-shell .subevent-resource-card-list app-info-card [class*=avatar]:active,\n.event-resource-popup-shell .subevent-resource-card-list app-info-card [class*=media-start]:active {\n  transform: scale(0.95) !important;\n  box-shadow: 0 1px 4px rgba(179, 108, 42, 0.15) !important;\n}\n/*# sourceMappingURL=event-resource-list.component.css.map */\n"] }]
  }], null, { model: [{
    type: Input
  }], filterSelected: [{
    type: Output
  }], assignRequested: [{
    type: Output
  }], exploreRequested: [{
    type: Output
  }], mapRequested: [{
    type: Output
  }], badgeDetailsRequested: [{
    type: Output
  }], cardActionRequested: [{
    type: Output
  }], resourceSmartList: [{
    type: ViewChild,
    args: ["resourceSmartList"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EventResourceListComponent, { className: "EventResourceListComponent", filePath: "app/activity/components/event-resource-popup/resource-list/event-resource-list.component.ts", lineNumber: 105 });
})();

// src/app/activity/components/event-resource-popup/event-resource-popup.component.ts
function EventResourcePopupComponent_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-event-resource-list", 4);
    \u0275\u0275listener("filterSelected", function EventResourcePopupComponent_Conditional_0_Conditional_2_Template_app_event_resource_list_filterSelected_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.selectResourceFilter($event));
    })("assignRequested", function EventResourcePopupComponent_Conditional_0_Conditional_2_Template_app_event_resource_list_assignRequested_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openAssignPopup($event));
    })("exploreRequested", function EventResourcePopupComponent_Conditional_0_Conditional_2_Template_app_event_resource_list_exploreRequested_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openExplorePopup($event));
    })("mapRequested", function EventResourcePopupComponent_Conditional_0_Conditional_2_Template_app_event_resource_list_mapRequested_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openResourceMap($event));
    })("badgeDetailsRequested", function EventResourcePopupComponent_Conditional_0_Conditional_2_Template_app_event_resource_list_badgeDetailsRequested_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openResourceBadgeDetails($event));
    })("cardActionRequested", function EventResourcePopupComponent_Conditional_0_Conditional_2_Template_app_event_resource_list_cardActionRequested_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onResourceCardMenuAction($event.card, $event.event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("model", ctx_r1.resourceListModel());
  }
}
function EventResourcePopupComponent_Conditional_0_Conditional_3_Conditional_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function EventResourcePopupComponent_Conditional_0_Conditional_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, EventResourcePopupComponent_Conditional_0_Conditional_3_Conditional_0_ng_container_0_Template, 1, 0, "ng-container", 5);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("ngComponentOutlet", ctx)("ngComponentOutletInputs", ctx_r1.resourceAssetViewOutletInputs());
  }
}
function EventResourcePopupComponent_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, EventResourcePopupComponent_Conditional_0_Conditional_3_Conditional_0_Template, 1, 2, "ng-container");
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional((tmp_2_0 = ctx_r1.resourcePopupStore.eventResourceAssetViewComponent()) ? 0 : -1, tmp_2_0);
  }
}
function EventResourcePopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-popup", 1)(1, "div", 2);
    \u0275\u0275conditionalCreate(2, EventResourcePopupComponent_Conditional_0_Conditional_2_Template, 1, 1, "app-event-resource-list", 3);
    \u0275\u0275conditionalCreate(3, EventResourcePopupComponent_Conditional_0_Conditional_3_Template, 1, 1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("event-resource-popup-shell--standalone-asset-view", ctx_r1.resourcePopupStore.resourceAssetViewReturnToChatRef())("event-resource-popup-shell--asset-explore-view", ctx_r1.resourcePopupStore.assetExploreOnlyRef() && ctx_r1.resourceAssetView());
    \u0275\u0275property("model", ctx_r1.resourcePopupModel())("zIndex", ctx_r1.resourcePopupZIndex());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r1.resourcePopupStore.resourceAssetViewReturnToChatRef() && !ctx_r1.resourcePopupStore.assetExploreOnlyRef() ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.resourceAssetView() ? 3 : -1);
  }
}
function EventResourcePopupComponent_Conditional_1_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function EventResourcePopupComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, EventResourcePopupComponent_Conditional_1_ng_container_0_Template, 1, 0, "ng-container", 5);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("ngComponentOutlet", ctx)("ngComponentOutletInputs", ctx_r1.membersPopupOutletInputs());
  }
}
var EventResourcePopupComponent = class _EventResourcePopupComponent {
  resourcePopupStore = inject(SubEventResourcePopupStore);
  activitiesStore = inject(ActivitiesPopupStore);
  userProfileStore = inject(UserProfileStore);
  memberMenuStore = inject(MemberMenuStore);
  assetPopupStore = inject(AssetPopupStore);
  assetStore = inject(AssetStore);
  assetsService = inject(AssetsService);
  eventsService = inject(EventsService);
  usersService = inject(UsersService);
  profileStore = inject(ProfileStore);
  dialogStore = inject(DialogStore);
  shareTokensService = inject(ShareTokensService);
  activityResourcesService = inject(ActivityResourcesService);
  chatsService = inject(ChatsService);
  activityStore = inject(ActivityStore);
  i18n = inject(I18nService);
  parentZIndex = 2500;
  get users() {
    return this.usersService.peekCachedUsers();
  }
  ownedAssetCards() {
    return this.assetStore.assetCards();
  }
  get userById() {
    return new Map(this.users.map((user) => [user.id, user]));
  }
  pendingAssignSaveAbortController = null;
  pendingAssignSaveRequestVersion = 0;
  lastResourcePopupOutletActionRequestId = 0;
  ownedAssetsHydrationLoadedUserId = "";
  ownedAssetsHydrationLoadingUserId = "";
  resourceAssetViewOutletInputs = computed(() => ({
    view: this.resourceAssetView(),
    parentZIndex: this.resourcePopupZIndex()
  }), ...ngDevMode ? [{ debugName: "resourceAssetViewOutletInputs" }] : (
    /* istanbul ignore next */
    []
  ));
  membersPopupOutletInputs = computed(() => ({
    parentZIndex: this.resourcePopupZIndex()
  }), ...ngDevMode ? [{ debugName: "membersPopupOutletInputs" }] : (
    /* istanbul ignore next */
    []
  ));
  resourcePopupZIndex() {
    return this.parentZIndex + 100;
  }
  constructor() {
    effect(() => {
      const deletedAssetEvent = this.assetStore.deletedAssetEvent();
      if (!deletedAssetEvent) {
        return;
      }
      this.handleOwnedAssetDeleted(deletedAssetEvent.cardId);
    });
    effect(() => {
      const request = this.memberMenuStore.activitiesNavigationRequest();
      if (!request || request.type !== "chatResource" && request.type !== "assetExplore") {
        return;
      }
      this.memberMenuStore.clearActivitiesNavigationRequest();
      if (request.type === "assetExplore") {
        this.openStandaloneAssetExploreRequest(request);
        return;
      }
      this.openFromChatRequest(request);
    });
    effect(() => {
      const request = this.memberMenuStore.activitiesNavigationRequest();
      if (!request || request.type !== "members" && request.type !== "eventEditorMembers") {
        return;
      }
      void this.activitiesStore.ensureEventMembersPopupLoaded();
    });
    effect(() => {
      const request = this.resourcePopupStore.subEventResourcePopupRequest();
      if (!request) {
        return;
      }
      this.resourcePopupStore.clearSubEventResourcePopupRequest();
      this.openFromSubEventResourceRequest(request);
    });
    effect(() => {
      if (this.resourceAssetView()) {
        void this.resourcePopupStore.ensureEventResourceAssetViewLoaded();
      }
    });
    effect(() => {
      const request = this.resourcePopupStore.eventResourcePopupOutletActionRequest();
      if (!request || request.requestId <= this.lastResourcePopupOutletActionRequestId) {
        return;
      }
      this.lastResourcePopupOutletActionRequestId = request.requestId;
      untracked(() => this.handleResourcePopupOutletActionRequest(request));
    });
  }
  handleResourcePopupOutletActionRequest(request) {
    switch (request.kind) {
      case "assetViewClose":
        this.closeResourceAssetView(request.event);
        return;
      case "assetViewMembers":
        this.openAssetViewMembers(request.view, request.event);
        return;
      case "assignedAssetJoinClose":
        this.closeAssignedAssetJoinDialog(request.event);
        return;
      case "assignedAssetJoinPolicyToggle":
        this.toggleAssignedAssetJoinPolicy(request.policyId);
        return;
      case "assignedAssetJoinConfirm":
        this.confirmAssignedAssetJoin(request.event);
        return;
    }
  }
  resourcePopupModel() {
    const showHeader = !this.resourcePopupStore.resourceAssetViewReturnToChatRef() && !this.resourcePopupStore.assetExploreOnlyRef();
    return {
      title: this.popupTitle(),
      subtitle: this.popupSubtitle(),
      secondarySubtitle: this.popupSummary(),
      size: "wide",
      height: "full",
      bodyLayout: "fill",
      backdropTone: "dim",
      showHeader,
      closeAriaLabel: "Close resource assignment",
      onClose: () => this.closeResourcePopup()
    };
  }
  resourceListModel() {
    const cards = this.resourceCards();
    const context = this.resourcePopupStore.popupContextRef();
    const memberSyncByOwnerId = this.activityStore.activityMembersSyncByOwnerId();
    const converterOptions = this.resourceInfoCardConverterOptions(memberSyncByOwnerId);
    return {
      filter: this.resourcePopupStore.resourceFilterRef(),
      metricIdentity: context ? this.chatMetricIdentity(context) : "",
      filterCounts: this.resourceFilterCounts(),
      canAssign: context?.viewOnly !== true,
      items: cards.map((card) => {
        const candidateMemberSync = card.sourceAssetId ? memberSyncByOwnerId[card.sourceAssetId] : null;
        const memberSync = candidateMemberSync?.memberStatusChange && !this.assignedAssetMemberStatusChange(card.sourceAssetId ?? "", context) ? null : candidateMemberSync;
        const displayCard = memberSync ? __spreadProps(__spreadValues({}, card), {
          accepted: memberSync.acceptedMembers,
          pending: memberSync.pendingMembers
        }) : card;
        return {
          card: displayCard,
          infoCard: ActivitySubEventResourceInfoCardConverter.convert(displayCard, converterOptions)
        };
      })
    };
  }
  chatMetricIdentity(context) {
    return this.chatMetricIdentityFromParts(context.ownerId, context.subEvent.id, context.groupId);
  }
  chatMetricIdentityFromParts(ownerIdValue, subEventIdValue, groupIdValue) {
    const ownerId = `${ownerIdValue ?? ""}`.trim();
    const subEventId = `${subEventIdValue ?? ""}`.trim();
    if (!ownerId || !subEventId) {
      return "";
    }
    const groupId = `${groupIdValue ?? ""}`.trim();
    const channelType = groupId ? "groupSubEvent" : "optionalSubEvent";
    const chatOwnerId = groupId ? this.scopedGroupOwnerId(ownerId, subEventId, groupId) : `${ownerId}:${subEventId}`;
    return ActivityChatSingleRowConverter.smartListKeyForIdentity(channelType, chatOwnerId, chatOwnerId);
  }
  memberOwnerIdFromParts(ownerIdValue, subEventIdValue, groupIdValue) {
    const ownerId = `${ownerIdValue ?? ""}`.trim();
    const subEventId = `${subEventIdValue ?? ""}`.trim();
    const groupId = `${groupIdValue ?? ""}`.trim();
    if (ownerId && subEventId && groupId) {
      return this.scopedGroupOwnerId(ownerId, subEventId, groupId);
    }
    if (ownerId && subEventId) {
      return `${ownerId}:${subEventId}`;
    }
    return groupId || subEventId || ownerId;
  }
  scopedGroupOwnerId(ownerId, subEventId, groupId) {
    const suffix = `:${subEventId}:${groupId}`;
    return ownerId.endsWith(suffix) ? ownerId : `${ownerId}${suffix}`;
  }
  parentEventOwnerId(ownerIdValue, subEventIdValue, groupIdValue) {
    const ownerId = `${ownerIdValue ?? ""}`.trim();
    const subEventId = `${subEventIdValue ?? ""}`.trim();
    const groupId = `${groupIdValue ?? ""}`.trim();
    const suffix = subEventId ? groupId ? `:${subEventId}:${groupId}` : `:${subEventId}` : "";
    return suffix && ownerId.endsWith(suffix) ? ownerId.slice(0, -suffix.length) : ownerId;
  }
  resourceMemberParent(context) {
    if (`${context.groupId ?? ""}`.trim()) {
      return {
        ownerId: context.ownerId.trim(),
        ownerType: "group"
      };
    }
    return {
      ownerId: this.memberOwnerIdFromParts(context.ownerId, context.subEvent.id),
      ownerType: "subEvent"
    };
  }
  resourceInfoCardConverterOptions(memberSyncByOwnerId = this.activityStore.activityMembersSyncByOwnerId()) {
    const context = this.resourcePopupStore.popupContextRef();
    const activeUserId = this.activeUser().id.trim();
    const eventRecord = context ? this.eventsService.peekKnownRecordById(activeUserId, context.ownerId) : null;
    return {
      context,
      activeUserId,
      activeUserAssets: this.ownedAssetCards(),
      assetSettingsByKey: this.resourcePopupStore.assignedAssetSettingsByKey,
      users: this.users,
      eventCreatorUserId: eventRecord?.creatorUserId ?? context?.assetOwnerUserId ?? null,
      memberSyncByOwnerId
    };
  }
  openAssetViewMembers(view, event) {
    event.stopPropagation();
    this.openAssetMembersPopup(view.card, event);
  }
  onResourceCardMenuAction(card, event) {
    if (event.actionId === "viewAsset") {
      this.openResourceAssetView(card, "view", new Event("click"));
      return;
    }
    if (event.actionId === "editAsset") {
      this.openResourceAssetView(card, "edit", new Event("click"));
      return;
    }
    if (event.actionId === "joinResource") {
      this.join(card, new Event("click"));
      return;
    }
    if (event.actionId === "leaveResource") {
      this.leave(card, new Event("click"));
      return;
    }
    if (event.actionId === "route") {
      this.openResourceAssetView(card, "edit", new Event("click"));
      return;
    }
    if (event.actionId === "askOrganizer") {
      void this.openResourceServiceChat(card, new Event("click"));
      return;
    }
    if (event.actionId === "shareAsset") {
      this.openResourceShareDialog(card);
      return;
    }
    if (event.actionId === "paymentSummary") {
      void this.openBorrowedAssetPaymentSummary(card, new Event("click"));
      return;
    }
    if (event.actionId === "reportManager" || event.actionId === "reportOrganizer") {
      this.reportResourceManager(card, new Event("click"));
      return;
    }
    if (event.actionId === "removeAssignment" || event.actionId === "delete") {
      this.requestDeleteResourceCard(card, new Event("click"));
    }
  }
  onEscapePressed(event) {
    const keyboardEvent = event;
    if (keyboardEvent.defaultPrevented) {
      return;
    }
    if (this.resourcePopupStore.assignedAssetJoinDialogRef()) {
      keyboardEvent.preventDefault();
      keyboardEvent.stopPropagation();
      this.closeAssignedAssetJoinDialog();
      return;
    }
    if (this.resourceAssetView()) {
      keyboardEvent.preventDefault();
      keyboardEvent.stopPropagation();
      this.closeResourceAssetView();
      return;
    }
  }
  openResourceShareDialog(card) {
    const sourceAssetId = `${card.sourceAssetId ?? ""}`.trim();
    if (!sourceAssetId || !isAssetType(card.type)) {
      void this.shareTokensService.createToken({
        kind: "asset",
        entityId: card.id,
        assetType: card.type
      }).then((token) => this.openShareLinkDialog("Share asset", token));
      return;
    }
    void this.shareTokensService.createToken({
      kind: "asset",
      entityId: sourceAssetId,
      assetType: card.type
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
  async openResourceServiceChat(card, event) {
    event.stopPropagation();
    const context = this.resourcePopupStore.popupContextRef();
    const activeUserId = this.activeUser().id.trim();
    if (!context || !activeUserId) {
      return;
    }
    const sourceCard = card.sourceAssetId && card.type !== "Members" ? this.resolveSubEventAssignedAssetCard(context.subEvent.id, card.type, card.sourceAssetId) : null;
    const managerUserId = sourceCard?.ownerUserId?.trim() || (card.type === ASSET_TYPE_TRANSPORT || card.type === ASSET_TYPE_ACCOMMODATION ? this.assignedAssetManagerUserId(context.subEvent.id, card.type, card.sourceAssetId || "") : null);
    const target = this.resolveResourceReportTarget(card);
    const targetUserId = target?.userId.trim() || managerUserId || "";
    if (!targetUserId || targetUserId === activeUserId) {
      return;
    }
    const titlePrefix = sourceCard ? "Asset Service" : "Event Service";
    const chat = await this.chatsService.ensureServiceChat({
      serviceContext: sourceCard ? "asset" : "event",
      eventId: context.ownerId,
      subEventId: context.subEvent.id,
      assetId: sourceCard?.id ?? null,
      targetUserId,
      title: `${titlePrefix} \xB7 ${card.title}`,
      lastMessage: sourceCard ? `Service chat with the ${card.type.toLowerCase()} manager for ${card.title}.` : `Service chat with the organizer for ${context.parentTitle}.`,
      avatarSource: sourceCard?.ownerName || target?.name || sourceCard?.title || card.title
    });
    if (!chat) {
      this.dialogStore.open({
        title: "Unable to open chat",
        message: "The service chat could not be created. Please try again.",
        confirmLabel: "OK"
      });
      return;
    }
    await this.openStackedResourceServiceChat(chat);
  }
  async openStackedResourceServiceChat(chat) {
    await this.activitiesStore.ensureEventChatPopupLoaded();
    this.activitiesStore.openStackedEventChat(__spreadProps(__spreadValues({}, eventChatPopupRequestFromChat(chat)), {
      parentZIndex: this.resourcePopupZIndex()
    }), eventChatHeaderStateFromChat(chat));
  }
  reportResourceManager(card, event) {
    event.stopPropagation();
    const context = this.resourcePopupStore.popupContextRef();
    const target = this.resolveResourceReportTarget(card);
    if (!context || !target || target.userId === this.activeUser().id.trim()) {
      return;
    }
    this.profileStore.openReportUserPopup({
      targetUserId: target.userId,
      targetName: target.name,
      eventId: context.ownerId,
      eventTitle: target.ownerType === "asset" ? card.title : context.parentTitle,
      eventStartAtIso: context.subEvent.startAt,
      eventTimeframe: this.reportContextTimeframe(context),
      ownerType: target.ownerType
    });
  }
  resolveResourceReportTarget(card) {
    const context = this.resourcePopupStore.popupContextRef();
    if (!context) {
      return null;
    }
    const sourceCard = card.sourceAssetId && card.type !== "Members" ? this.resolveSubEventAssignedAssetCard(context.subEvent.id, card.type, card.sourceAssetId) : null;
    const managerUserId = sourceCard?.ownerUserId?.trim() || (card.type === ASSET_TYPE_TRANSPORT || card.type === ASSET_TYPE_ACCOMMODATION ? this.assignedAssetManagerUserId(context.subEvent.id, card.type, card.sourceAssetId || "") : "");
    if (managerUserId) {
      return {
        userId: managerUserId,
        name: sourceCard?.ownerName?.trim() || this.reportTargetName(managerUserId, "Manager"),
        ownerType: "asset"
      };
    }
    const eventRecord = this.eventsService.peekKnownRecordById(this.activeUser().id.trim(), context.ownerId);
    const organizerUserId = `${eventRecord?.creatorUserId ?? context.subEvent.createdByUserId ?? ""}`.trim();
    if (!organizerUserId) {
      return null;
    }
    return {
      userId: organizerUserId,
      name: eventRecord?.creatorName?.trim() || this.reportTargetName(organizerUserId, "Organizer"),
      ownerType: "event"
    };
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
  activeUser() {
    const activeUserId = this.userProfileStore.activeUserId().trim();
    return this.userProfileStore.activeUserProfile() ?? this.usersService.peekCachedUserById(activeUserId) ?? this.users[0] ?? this.createFallbackUser(activeUserId);
  }
  openFromChatRequest(request) {
    if (request.resourceType === "Members") {
      const ownerId = `${request.item.ownerId ?? ""}`.trim() || this.memberOwnerIdFromParts(request.ownerId, request.subEvent.id, request.group?.id);
      const ownerType = request.item.channelType === "groupSubEvent" ? "group" : "subEvent";
      const parentOwnerId = this.parentEventOwnerId(ownerId, request.subEvent.id, request.group?.id);
      const bucket = request.item.metrics?.members ?? null;
      this.memberMenuStore.requestActivitiesNavigation({
        type: "members",
        ownerId,
        ownerType,
        parentOwnerId,
        parentOwnerType: "event",
        eventId: parentOwnerId,
        subEventId: request.subEvent.id,
        subtitle: `${request.group?.groupLabel ?? request.subEvent.name ?? request.item.title ?? ""}`.trim() || "Members",
        canManage: request.group?.canManage === true,
        viewOnly: request.group?.id ? request.group.canManage !== true : void 0,
        acceptedMembers: Math.max(0, Math.trunc(Number(bucket?.accepted ?? request.group?.accepted ?? request.subEvent.membersAccepted) || 0)),
        pendingMembers: Math.max(0, Math.trunc(Number(bucket?.pending ?? request.group?.pending ?? request.subEvent.membersPending) || 0)),
        capacityTotal: Math.max(0, Math.trunc(Number(bucket?.capacityMax ?? request.group?.capacityMax ?? request.subEvent.capacityMax) || 0)),
        metricIdentity: ActivityChatSingleRowConverter.smartListKeyForIdentity(request.item.channelType ?? null, ownerId, request.item.id)
      });
      return;
    }
    const context = this.buildPopupContext("chat", request.ownerId?.trim() || request.item.ownerId?.trim() || "", request.item.title, request.resourceType, request.subEvent, request.group ?? null, request.assetCardsByType, request.popupHeader ?? null);
    this.seedAssignmentsFromRequest(context.subEvent.id, request.assetAssignmentIds, context.fallbackCardsByType);
    this.openPopupContext(context, request.resourceType);
    this.resourcePopupStore.assetExploreOnlyRef.set(request.openExplore === true);
    this.resourcePopupStore.resourceAssetViewIdRef.set(request.assetViewId?.trim() || null);
    if (request.openExplore) {
      this.openInitialExplorePopup();
    }
  }
  openStandaloneAssetExploreRequest(request) {
    const type = request.assetType === ASSET_TYPE_ACCOMMODATION || request.assetType === ASSET_TYPE_SUPPLIES ? request.assetType : ASSET_TYPE_TRANSPORT;
    const now = /* @__PURE__ */ new Date();
    const end = new Date(now);
    end.setHours(end.getHours() + 2);
    const subEvent = {
      id: `asset-explore-${this.activeUser().id || "user"}`,
      name: "Asset Explore",
      description: "",
      startAt: AppUtils.toIsoDateTimeLocal(now),
      endAt: AppUtils.toIsoDateTimeLocal(end),
      optional: true,
      capacityMin: 0,
      capacityMax: 0,
      membersAccepted: 0,
      membersPending: 0,
      carsPending: 0,
      accommodationPending: 0,
      suppliesPending: 0,
      carsAccepted: 0,
      accommodationAccepted: 0,
      suppliesAccepted: 0
    };
    this.openPopupContext({
      origin: "chat",
      ownerId: this.activeUser().id,
      parentTitle: "Assets",
      popupHeader: { title: "Assets", subtitle: null },
      subEvent,
      fallbackCardsByType: request.fallbackAsset ? { [type]: [this.cloneAsset(request.fallbackAsset)] } : {}
    }, type, { hydrate: !request.viewOnly });
    this.resourcePopupStore.assetExploreOnlyRef.set(!request.viewOnly);
    if (request.viewOnly && request.assetId) {
      this.resourcePopupStore.assignedAssetIdsByKey[ActivityResourceBuilder.subEventAssetAssignmentKey(subEvent.id, type)] = [request.assetId];
      this.resourcePopupStore.resourceAssetViewIdRef.set(request.assetId);
      this.resourcePopupStore.resourceAssetViewModeRef.set("view");
      this.resourcePopupStore.resourceAssetViewReturnToChatRef.set(true);
      return;
    }
    this.openInitialExplorePopup();
  }
  openFromSubEventResourceRequest(request) {
    if (request.type === "Members") {
      const group = request.group ?? null;
      const ownerId = this.memberOwnerIdFromParts(request.ownerId, request.subEventId, group?.id);
      const parentOwnerId = this.parentEventOwnerId(request.ownerId, request.subEventId, group?.id);
      const groupLabel = group?.groupLabel?.trim() ?? "";
      const subEventTitle = this.requestSubEventTitle(request);
      this.memberMenuStore.requestActivitiesNavigation({
        type: "members",
        ownerId,
        ownerType: group?.id ? "group" : "subEvent",
        parentOwnerId,
        parentOwnerType: "event",
        eventId: parentOwnerId,
        subEventId: `${request.subEventId ?? ""}`.trim(),
        subtitle: groupLabel || subEventTitle || request.parentTitle?.trim() || "Event",
        canManage: group?.canManage === true,
        viewOnly: group?.id ? group.canManage !== true : void 0,
        acceptedMembers: Math.max(0, Math.trunc(Number(group?.accepted) || 0)),
        pendingMembers: Math.max(0, Math.trunc(Number(group?.pending) || 0)),
        capacityTotal: Math.max(0, Math.trunc(Number(group?.capacityMax) || 0)),
        metricIdentity: this.chatMetricIdentityFromParts(request.ownerId, request.subEventId, group?.id),
        onMembersChanged: group?.onMembersChanged
      });
      return;
    }
    const subEvent = this.subEventFromResourceRequest(request);
    if (!subEvent) {
      return;
    }
    const context = this.buildPopupContext("subEventResource", request.ownerId.trim(), request.parentTitle?.trim() || "Event", request.type, subEvent, request.group ?? null, void 0, request.popupHeader ?? null, request.assetOwnerUserId, request.viewOnly);
    this.openPopupContext(context, request.type);
  }
  subEventFromResourceRequest(request) {
    const subEventId = `${request.subEventId ?? ""}`.trim();
    if (!subEventId) {
      return null;
    }
    const header = request.subEventHeader ?? null;
    const name = this.requestSubEventTitle(request) || "Sub Event";
    return {
      id: subEventId,
      name,
      description: `${header?.description ?? ""}`.trim(),
      location: `${header?.location ?? ""}`.trim(),
      startAt: `${header?.startAt ?? ""}`.trim(),
      endAt: `${header?.endAt ?? ""}`.trim(),
      optional: true,
      capacityMin: 0,
      capacityMax: 0,
      membersAccepted: 0,
      membersPending: 0,
      carsPending: 0,
      accommodationPending: 0,
      suppliesPending: 0,
      carsAccepted: 0,
      accommodationAccepted: 0,
      suppliesAccepted: 0
    };
  }
  requestSubEventTitle(request) {
    const header = request.subEventHeader ?? null;
    return `${header?.title ?? header?.name ?? ""}`.trim();
  }
  buildPopupContext(origin, ownerId, parentTitle, type, rawSubEvent, group, fallbackCardsByType, popupHeader, assetOwnerUserId, viewOnly = false) {
    const subEvent = this.cloneSubEvent(rawSubEvent);
    const scopedSubEvent = group?.id ? this.applyGroupScopedAssetSnapshot(subEvent, type, group) : subEvent;
    return {
      origin,
      ownerId: ownerId.trim(),
      assetOwnerUserId: `${assetOwnerUserId ?? ""}`.trim() || void 0,
      viewOnly,
      parentTitle: parentTitle.trim() || "Event",
      popupHeader: this.normalizePopupHeader(popupHeader, parentTitle),
      subEvent: scopedSubEvent,
      groupId: group?.id?.trim() || void 0,
      groupName: group?.groupLabel?.trim() || void 0,
      fallbackCardsByType: this.cloneFallbackCards(fallbackCardsByType)
    };
  }
  normalizePopupHeader(popupHeader, fallbackTitle) {
    const title = `${popupHeader?.title ?? ""}`.trim() || fallbackTitle.trim() || "Event";
    const subtitle = `${popupHeader?.subtitle ?? ""}`.trim();
    return {
      title,
      subtitle: subtitle || null
    };
  }
  openPopupContext(context, type, options = {}) {
    this.hydrateOwnedAssetsForResourcePopup();
    this.resourcePopupStore.openResourcePopup(context, type);
    this.closeAssignPopup(false);
    if (options.hydrate !== false) {
      this.hydratePopupResourceState(context);
    }
  }
  openInitialExplorePopup() {
    const context = this.resourcePopupStore.popupContextRef();
    if (!context) {
      return;
    }
    const type = this.resourcePopupStore.resourceFilterRef();
    const { startAtIso, endAtIso } = ActivityResourceBuilder.defaultAssetExploreRange(context.subEvent);
    this.closeAssignedAssetJoinDialog();
    this.resourcePopupStore.assetExploreBorrowDialogRef.set(null);
    this.resourcePopupStore.assetExplorePopupRef.set({
      subEventId: context.subEvent.id,
      type,
      category: AssetDefaultsBuilder.defaultCategory(type),
      startAtIso,
      endAtIso,
      loading: true,
      error: null,
      cards: []
    });
  }
  hydratePopupResourceState(context) {
    const ownerId = context.ownerId.trim();
    const subEventId = context.subEvent.id.trim();
    const assetOwnerUserId = `${context.assetOwnerUserId ?? this.activeUser().id}`.trim();
    if (!ownerId || !subEventId || !assetOwnerUserId) {
      return;
    }
    const applyState = (state) => {
      const activeContext = this.resourcePopupStore.popupContextRef();
      const activeAssetOwnerUserId = `${activeContext?.assetOwnerUserId ?? this.activeUser().id}`.trim();
      if (!state || !activeContext || activeContext.ownerId !== ownerId || activeContext.subEvent.id !== subEventId || activeAssetOwnerUserId !== assetOwnerUserId || state.assetOwnerUserId !== assetOwnerUserId) {
        return;
      }
      this.applyPersistedPopupState(state);
      this.hydrateOwnedAssetsForResourcePopup();
    };
    applyState(this.activityResourcesService.peekSubEventResourceState(ownerId, subEventId, assetOwnerUserId));
    void this.activityResourcesService.querySubEventResourceState(ownerId, subEventId, assetOwnerUserId).then((state) => applyState(state));
  }
  hydrateOwnedAssetsForResourcePopup() {
    const activeUserId = this.activeUser().id.trim();
    if (!activeUserId) {
      return;
    }
    const peekedCards = this.assetsService.peekOwnedAssetsByUser(activeUserId);
    const ownerChanged = this.assetStore.activeOwnerUserIdRef().trim() !== activeUserId;
    if (ownerChanged) {
      this.assetStore.setActiveOwnerUserId(activeUserId);
    }
    if (ownerChanged || this.assetStore.assetCards().length === 0 && peekedCards.length > 0) {
      this.assetStore.applyAssetCards(peekedCards, { reloadList: false });
    }
    if (this.ownedAssetsHydrationLoadedUserId === activeUserId || this.ownedAssetsHydrationLoadingUserId === activeUserId) {
      return;
    }
    this.ownedAssetsHydrationLoadingUserId = activeUserId;
    void this.assetsService.queryOwnedAssetsByUser(activeUserId).then((cards) => {
      if (this.activeUser().id.trim() !== activeUserId) {
        return;
      }
      this.assetStore.setActiveOwnerUserId(activeUserId);
      this.assetStore.applyAssetCards(cards, { reloadList: false });
      this.ownedAssetsHydrationLoadedUserId = activeUserId;
    }).finally(() => {
      if (this.ownedAssetsHydrationLoadingUserId === activeUserId) {
        this.ownedAssetsHydrationLoadingUserId = "";
      }
    });
  }
  closeAssignPopup(apply = false) {
    if (apply) {
      return;
    }
    this.abortPendingAssignSaveRequest();
    this.resourcePopupStore.pendingAssignSaveRef.set(null);
    this.resourcePopupStore.assignContextRef.set(null);
    this.resourcePopupStore.selectedAssignAssetIdsRef.set([]);
    this.assetPopupStore.basketVisibleRef.set(false);
    this.assetStore.closeAssetPopup();
    this.assetPopupStore.resetTicketState();
    this.assetPopupStore.primaryVisibleRef.set(false);
  }
  applyPersistedPopupState(state) {
    const normalizedState = ActivityResourceBuilder.normalizeState(state, state);
    if (!normalizedState) {
      return;
    }
    const activeContext = this.resourcePopupStore.popupContextRef();
    const nextContext = activeContext && activeContext.ownerId === normalizedState.ownerId && activeContext.subEvent.id === normalizedState.subEventId ? __spreadProps(__spreadValues({}, activeContext), {
      fallbackCardsByType: this.mergePersistedFallbackCards(activeContext.fallbackCardsByType, normalizedState.fallbackAssetCardsByType, normalizedState.subEventId)
    }) : null;
    for (const type of ASSET_TYPES) {
      this.resourcePopupStore.assignedAssetIdsByKey[ActivityResourceBuilder.subEventAssetAssignmentKey(normalizedState.subEventId, type)] = [
        ...normalizedState.assetAssignmentIds[type] ?? []
      ];
      this.resourcePopupStore.assignedAssetSettingsByKey[ActivityResourceBuilder.subEventAssetAssignmentKey(normalizedState.subEventId, type)] = __spreadValues({}, normalizedState.assetSettingsByType[type] ?? {});
    }
    for (const key of Object.keys(this.resourcePopupStore.supplyContributionEntriesByAssignmentKey)) {
      if (key.startsWith(`${normalizedState.subEventId}:`)) {
        delete this.resourcePopupStore.supplyContributionEntriesByAssignmentKey[key];
      }
    }
    for (const [assetId, entries] of Object.entries(normalizedState.supplyContributionEntriesByAssetId)) {
      this.resourcePopupStore.supplyContributionEntriesByAssignmentKey[ActivityResourceBuilder.subEventSupplyAssignmentKey(normalizedState.subEventId, assetId)] = entries.map((entry) => __spreadValues({}, entry));
    }
    if (nextContext) {
      this.resourcePopupStore.popupContextRef.set(nextContext);
    }
  }
  persistPopupResourceState(context = this.resourcePopupStore.popupContextRef()) {
    if (context?.viewOnly) {
      return;
    }
    const nextState = this.buildPopupResourceState(context);
    if (!nextState) {
      return;
    }
    void this.activityResourcesService.replaceSubEventResourceState(nextState);
  }
  buildPopupResourceState(context = this.resourcePopupStore.popupContextRef()) {
    if (!context) {
      return null;
    }
    const ownerId = context.ownerId.trim();
    const subEventId = context.subEvent.id.trim();
    const assetOwnerUserId = `${context.assetOwnerUserId ?? this.activeUser().id}`.trim();
    if (!ownerId || !subEventId || !assetOwnerUserId) {
      return null;
    }
    return {
      ownerId,
      subEventId,
      assetOwnerUserId,
      assetAssignmentIds: {
        [ASSET_TYPE_TRANSPORT]: [...this.resolveSubEventAssignedAssetIds(subEventId, ASSET_TYPE_TRANSPORT)],
        [ASSET_TYPE_ACCOMMODATION]: [...this.resolveSubEventAssignedAssetIds(subEventId, ASSET_TYPE_ACCOMMODATION)],
        [ASSET_TYPE_SUPPLIES]: [...this.resolveSubEventAssignedAssetIds(subEventId, ASSET_TYPE_SUPPLIES)]
      },
      assetSettingsByType: {
        [ASSET_TYPE_TRANSPORT]: __spreadValues({}, this.getSubEventAssignedAssetSettings(subEventId, ASSET_TYPE_TRANSPORT)),
        [ASSET_TYPE_ACCOMMODATION]: __spreadValues({}, this.getSubEventAssignedAssetSettings(subEventId, ASSET_TYPE_ACCOMMODATION)),
        [ASSET_TYPE_SUPPLIES]: __spreadValues({}, this.getSubEventAssignedAssetSettings(subEventId, ASSET_TYPE_SUPPLIES))
      },
      supplyContributionEntriesByAssetId: Object.fromEntries(this.resolveSubEventAssignedAssetIds(subEventId, ASSET_TYPE_SUPPLIES).map((assetId) => [
        assetId,
        this.subEventSupplyContributionEntries(subEventId, assetId).map((entry) => __spreadValues({}, entry))
      ])),
      fallbackAssetCardsByType: {
        [ASSET_TYPE_TRANSPORT]: this.persistedAssignedFallbackCards(context, ASSET_TYPE_TRANSPORT),
        [ASSET_TYPE_ACCOMMODATION]: this.persistedAssignedFallbackCards(context, ASSET_TYPE_ACCOMMODATION),
        [ASSET_TYPE_SUPPLIES]: this.persistedAssignedFallbackCards(context, ASSET_TYPE_SUPPLIES)
      }
    };
  }
  closeResourcePopup() {
    this.resourcePopupStore.closeResourcePopup();
    this.abortPendingAssignSaveRequest();
    this.resourcePopupStore.pendingAssignSaveRef.set(null);
    this.resourcePopupStore.assignContextRef.set(null);
    this.resourcePopupStore.selectedAssignAssetIdsRef.set([]);
    this.assetPopupStore.basketVisibleRef.set(false);
    this.assetStore.closeAssetPopup();
    this.assetPopupStore.resetTicketState();
    this.assetPopupStore.primaryVisibleRef.set(false);
  }
  popupTitle() {
    const context = this.resourcePopupStore.popupContextRef();
    const typeLabel = APP_STATIC_DATA.assetTypeLabels[this.resourcePopupStore.resourceFilterRef()];
    return `${context?.popupHeader?.title ?? ""}`.trim() || typeLabel;
  }
  popupSubtitle() {
    const context = this.resourcePopupStore.popupContextRef();
    return `${context?.popupHeader?.subtitle ?? ""}`.trim();
  }
  popupSummary() {
    const context = this.resourcePopupStore.popupContextRef();
    if (!context) {
      return null;
    }
    const metrics = this.subEventAssetCapacityMetrics(context.subEvent, this.resourcePopupStore.resourceFilterRef(), {
      normalizeStore: false
    });
    if (metrics.joined <= 0 && metrics.pending <= 0) {
      return null;
    }
    if (metrics.pending <= 0) {
      return `${metrics.joined} members`;
    }
    return `${metrics.joined} members \xB7 ${metrics.pending} pending`;
  }
  openResourceBadgeDetails(card, event) {
    event?.stopPropagation();
    if (card.type === ASSET_TYPE_TRANSPORT || card.type === ASSET_TYPE_ACCOMMODATION) {
      void this.openAssetMembersPopup(card);
      return;
    }
    if (card.type === ASSET_TYPE_SUPPLIES) {
      this.openSupplyContributionsPopup(card, event);
    }
  }
  resourceAssetView() {
    const viewId = `${this.resourcePopupStore.resourceAssetViewIdRef() ?? ""}`.trim();
    if (!viewId) {
      return null;
    }
    const context = this.resourcePopupStore.popupContextRef();
    const card = this.resourceCards().find((item) => item.id === viewId || `${item.sourceAssetId ?? ""}`.trim() === viewId) ?? null;
    if (card && context) {
      const source = card.sourceAssetId ? this.resolveSubEventAssignedAssetCard(context.subEvent.id, card.type, card.sourceAssetId) : null;
      return {
        card,
        mode: this.resourcePopupStore.resourceAssetViewModeRef(),
        source
      };
    }
    return null;
  }
  openResourceAssetView(card, _mode, event) {
    event?.stopPropagation();
    void this.openReadonlyResourceAssetEditor(card);
  }
  async openReadonlyResourceAssetEditor(card) {
    const context = this.resourcePopupStore.popupContextRef();
    const assetId = `${card.sourceAssetId ?? ""}`.trim();
    if (!context || !assetId || !this.isAssignableAssetType(card.type)) {
      return;
    }
    const sourceCard = this.resolveSubEventAssignedAssetCard(context.subEvent.id, card.type, assetId);
    if (!sourceCard) {
      return;
    }
    this.resourcePopupStore.resourceAssetViewIdRef.set(null);
    this.resourcePopupStore.resourceAssetViewModeRef.set("view");
    this.resourcePopupStore.assetExplorePopupRef.set(null);
    const ownerUserId = `${sourceCard.ownerUserId ?? ""}`.trim();
    const generation = this.assetStore.openAssetEditorEdit({
      cardId: sourceCard.id,
      form: AssetCardBuilder.buildAssetFormFromCard(sourceCard),
      visibility: AssetCardBuilder.visibilityFromCard(sourceCard),
      loading: Boolean(ownerUserId),
      readOnly: true,
      parentZIndex: this.resourcePopupZIndex(),
      runtimeRoute: this.assignedAssetRuntimeRouteState(context.subEvent.id, card, sourceCard),
      runtimeAssignment: this.assignedAssetRuntimeAssignmentState(context.subEvent.id, card, sourceCard)
    });
    void this.assetPopupStore.ensureAssetPopupLoaded();
    if (!ownerUserId) {
      this.assetStore.setAssetEditorLoading(false);
      return;
    }
    try {
      const loadedCard = await this.assetsService.loadOwnedAssetDetailById(ownerUserId, sourceCard.id);
      if (!this.assetStore.isCurrentAssetEditorLoad(generation, sourceCard.id)) {
        return;
      }
      if (loadedCard) {
        this.assetStore.applyAssetEditorForm(loadedCard.id, AssetCardBuilder.visibilityFromCard(loadedCard), AssetCardBuilder.buildAssetFormFromCard(loadedCard));
      }
      this.assetStore.setAssetEditorLoading(false);
    } catch {
      if (this.assetStore.isCurrentAssetEditorLoad(generation, sourceCard.id)) {
        this.assetStore.setAssetEditorLoading(false);
      }
    }
  }
  async openBorrowedAssetPaymentSummary(card, event) {
    event?.stopPropagation();
    const context = this.resourcePopupStore.popupContextRef();
    const assetId = `${card.sourceAssetId ?? ""}`.trim();
    if (!context || !assetId || !this.isAssignableAssetType(card.type)) {
      return;
    }
    const sourceCard = this.resolveSubEventAssignedAssetCard(context.subEvent.id, card.type, assetId);
    const request = sourceCard ? this.findBorrowedAssetRequest(sourceCard, context.subEvent.id) : null;
    if (!sourceCard || !request) {
      return;
    }
    const defaultRange = ActivityResourceBuilder.defaultAssetExploreRange(context.subEvent);
    const startAtIso = `${request.booking?.startAtIso ?? defaultRange.startAtIso}`.trim() || defaultRange.startAtIso;
    const endAtIso = `${request.booking?.endAtIso ?? defaultRange.endAtIso}`.trim() || defaultRange.endAtIso;
    const quantity = Math.max(1, Math.trunc(Number(request.booking?.quantity) || 1));
    const paymentSessionId = `${request.booking?.paymentSessionId ?? ""}`.trim();
    const paymentAudit = paymentSessionId ? await this.eventsService.loadCheckoutPaymentAudit(this.activeUser().id, sourceCard.id, paymentSessionId) : null;
    const calculatedPricing = PricingBuilder.resolveAssetBorrowPricing({
      pricing: sourceCard.pricing,
      totalQuantity: this.assignedBorrowTotalQuantity(sourceCard, request),
      requestedQuantity: quantity,
      startAtIso,
      endAtIso,
      requests: sourceCard.requests
    });
    const amount = paymentAudit ? Math.max(0, Number(paymentAudit.amount) || 0) : Number.isFinite(request.booking?.totalAmount) ? Math.max(0, Number(request.booking?.totalAmount)) : calculatedPricing.amount;
    const currency = `${paymentAudit?.currency ?? request.booking?.currency ?? calculatedPricing.currency ?? "USD"}`.trim() || "USD";
    const timeframe = ActivityResourceBuilder.assetRequestTimeframeLabel(startAtIso, endAtIso);
    const auditRows = paymentAudit ? paymentAudit.pricingSummaryRows.length > 0 ? paymentAudit.pricingSummaryRows.map((row) => __spreadValues({}, row)) : paymentAudit.lineItems.map((lineItem, index) => ({
      key: `base-payment-audit-${lineItem.id || index}`,
      label: lineItem.label,
      detail: lineItem.detail || timeframe,
      amount: Math.max(0, Number(lineItem.amount) || 0),
      currency: lineItem.currency?.trim() || currency,
      multiplier: null
    })) : [];
    const useCalculatedRows = !paymentAudit && (!Number.isFinite(request.booking?.totalAmount) || amount === calculatedPricing.amount);
    const checkout = {
      sourceId: sourceCard.id,
      mode: "payment-summary",
      phase: "payment",
      title: this.i18n.translate("event.checkout.payment.summary"),
      subtitle: sourceCard.title,
      dateRange: {
        startAt: startAtIso,
        endAt: endAtIso,
        precision: "minute"
      },
      dateRangeModel: {
        mode: "range",
        precision: "minute",
        valueFormat: "iso-date-time",
        range: {
          start: { label: this.i18n.translate("asset.borrow.start") },
          end: { label: this.i18n.translate("asset.borrow.end") }
        }
      },
      availableQuantity: quantity,
      pricingPreview: {
        rows: paymentAudit ? auditRows.length > 0 ? auditRows : [{
          key: "base-payment-audit",
          label: sourceCard.title,
          detail: timeframe,
          amount,
          currency
        }] : useCalculatedRows ? calculatedPricing.rows.map((row) => __spreadValues({}, row)) : [{
          key: "base-borrow",
          label: "pricing.base",
          detail: timeframe,
          amount,
          currency
        }],
        totalAmount: amount,
        currency
      },
      acceptedPolicyIds: [...request.booking?.acceptedPolicyIds ?? []],
      footerItems: [],
      busy: false,
      error: null,
      paymentProviderLabel: paymentAudit ? "event.editor.payment.recorded" : null,
      paymentStatusLabel: paymentAudit ? paymentAudit.auditKind === "booking_price_revision" ? "event.editor.payment.recorded.revised" : paymentAudit.status === "approved" || paymentAudit.bookingStatus === "joined" ? "event.editor.payment.recorded.approved" : paymentAudit.status : null,
      paymentNote: paymentAudit ? paymentAudit.auditKind === "booking_price_revision" ? "event.editor.payment.recorded.revision.note" : "event.editor.payment.recorded.note" : null
    };
    const ownerUserId = `${sourceCard.ownerUserId ?? ""}`.trim();
    const generation = this.assetStore.openAssetEditorEdit({
      cardId: sourceCard.id,
      form: AssetCardBuilder.buildAssetFormFromCard(sourceCard),
      visibility: AssetCardBuilder.visibilityFromCard(sourceCard),
      loading: Boolean(ownerUserId),
      readOnly: true,
      parentZIndex: this.resourcePopupZIndex(),
      runtimeAssignment: {
        quantity,
        quantityMax: quantity,
        quantityLabel: this.i18n.translate("quantity"),
        quantityDescription: timeframe,
        editable: false
      },
      checkout
    });
    void this.assetPopupStore.ensureAssetPopupLoaded();
    if (!ownerUserId) {
      this.assetStore.setAssetEditorLoading(false);
      return;
    }
    try {
      const loadedCard = await this.assetsService.loadOwnedAssetDetailById(ownerUserId, sourceCard.id);
      if (!this.assetStore.isCurrentAssetEditorLoad(generation, sourceCard.id)) {
        return;
      }
      if (loadedCard) {
        this.assetStore.applyAssetEditorForm(loadedCard.id, AssetCardBuilder.visibilityFromCard(loadedCard), AssetCardBuilder.buildAssetFormFromCard(loadedCard));
      }
      this.assetStore.setAssetEditorLoading(false);
    } catch {
      if (this.assetStore.isCurrentAssetEditorLoad(generation, sourceCard.id)) {
        this.assetStore.setAssetEditorLoading(false);
      }
    }
  }
  assignedAssetRuntimeRouteState(subEventId, card, sourceCard) {
    const assetId = `${card.sourceAssetId ?? sourceCard.id ?? ""}`.trim();
    if (card.type !== ASSET_TYPE_TRANSPORT || sourceCard.type !== ASSET_TYPE_TRANSPORT || !assetId) {
      return null;
    }
    const settings = this.getSubEventAssignedAssetSettings(subEventId, ASSET_TYPE_TRANSPORT);
    const routeSettings = settings[assetId] ?? null;
    const routes = this.resolveViewableCarRoutes(routeSettings?.routes, card.routes, this.assetRouteValues(sourceCard)).map((stop) => stop.trim()).filter(Boolean);
    return {
      routeEnabled: routeSettings?.routeEnabled ?? routes.length > 0,
      routes,
      editable: this.canEditAssignedAssetRuntimeRoute(subEventId, sourceCard, assetId),
      title: this.i18n.translate("route"),
      subtitle: this.i18n.translate("asset.assignment.route.subtitle"),
      openLabel: this.i18n.translate("asset.assignment.route.open"),
      emptyLabel: this.i18n.translate("asset.assignment.route.empty"),
      readOnlyEmptyLabel: this.i18n.translate("asset.assignment.route.empty"),
      popupTitle: this.i18n.translateParams("asset.assignment.route.popup.title", { asset: card.title }),
      popupSubtitle: this.i18n.translate("asset.assignment.route.popup.subtitle"),
      parentZIndex: this.resourcePopupZIndex()
    };
  }
  assignedAssetRuntimeAssignmentState(subEventId, card, sourceCard) {
    const assetId = `${card.sourceAssetId ?? sourceCard.id ?? ""}`.trim();
    if (!assetId || !this.isAssignableAssetType(card.type) || sourceCard.type !== card.type) {
      return null;
    }
    const type = card.type;
    const settings = this.getSubEventAssignedAssetSettings(subEventId, type);
    const assignment = settings[assetId];
    const bounds = this.assignedRuntimeQuantityBounds(sourceCard, subEventId, assignment);
    const quantity = this.normalizeAssignedRuntimeQuantity(assignment?.quantity, bounds.quantityMax, bounds.reservedQuantity);
    return {
      quantity,
      quantityMax: bounds.quantityMax,
      quantityLabel: this.i18n.translate("asset.assignment.quantity"),
      quantityDescription: this.assignedRuntimeQuantityDescription(bounds.quantityMax, quantity, sourceCard, bounds.reservation),
      editable: this.canEditAssignedAssetRuntimeAssignment(subEventId, sourceCard, assetId),
      onChange: (nextQuantity) => {
        this.assetStore.setAssetEditorRuntimeAssignmentState({
          quantityDescription: this.assignedRuntimeQuantityDescription(bounds.quantityMax, nextQuantity, sourceCard, bounds.reservation)
        });
      },
      onSave: (state) => this.saveAssignedAssetRuntimeAssignment(subEventId, type, assetId, state)
    };
  }
  canEditAssignedAssetRuntimeRoute(subEventId, sourceCard, assetId) {
    return this.canEditAssignedAssetRuntimeAssignment(subEventId, sourceCard, assetId);
  }
  canEditAssignedAssetRuntimeAssignment(subEventId, sourceCard, assetId) {
    const activeUserId = this.activeUser().id.trim();
    if (!activeUserId) {
      return false;
    }
    if (this.isAssetOwnedByActiveUser(sourceCard, activeUserId)) {
      return true;
    }
    const managerUserId = this.assignedAssetManagerUserId(subEventId, sourceCard.type, assetId);
    if (managerUserId === activeUserId) {
      return true;
    }
    const request = this.findAssignedAssetJoinRequest(sourceCard, subEventId, activeUserId);
    return request !== null;
  }
  closeResourceAssetView(event) {
    event?.stopPropagation();
    if (this.resourcePopupStore.resourceAssetViewReturnToChatRef()) {
      this.closeResourcePopup();
      return;
    }
    this.resourcePopupStore.resourceAssetViewIdRef.set(null);
    this.resourcePopupStore.resourceAssetViewModeRef.set("view");
  }
  async openAssetMembersPopup(card, event) {
    event?.stopPropagation();
    const context = this.resourcePopupStore.popupContextRef();
    if (!context || !card.sourceAssetId || !isAssetType(card.type)) {
      return;
    }
    const sourceCard = this.resolveSubEventAssignedAssetCard(context.subEvent.id, card.type, card.sourceAssetId);
    if (!sourceCard) {
      return;
    }
    const assetType = card.type;
    const settings = this.getSubEventAssignedAssetSettings(context.subEvent.id, assetType);
    const managerUserId = settings[card.sourceAssetId]?.addedByUserId?.trim() || null;
    const fallbackMembers = this.assetMemberEntries(sourceCard, managerUserId, context.subEvent.id, context.ownerId);
    const acceptedMembers = fallbackMembers.filter((member) => member.status === "accepted").length;
    const pendingMembers = fallbackMembers.filter((member) => member.status === "pending").length;
    const capacityTotal = this.assignedAssetOccupancyCapacityTotal(sourceCard, settings[card.sourceAssetId]);
    const subtitle = `${sourceCard.title} \xB7 ${this.subEventDisplayName(context.subEvent) || "Sub Event"}`;
    const parentOwner = this.resourceMemberParent(context);
    this.memberMenuStore.requestActivitiesNavigation({
      type: "members",
      ownerId: sourceCard.id,
      ownerType: "asset",
      parentOwnerId: parentOwner.ownerId,
      parentOwnerType: parentOwner.ownerType,
      eventId: context.ownerId,
      subEventId: context.subEvent.id,
      subtitle,
      canManage: this.canManageAssignedAssetMembers(sourceCard, context.subEvent.id),
      acceptedMembers,
      pendingMembers,
      capacityTotal,
      members: fallbackMembers
    });
  }
  openSupplyContributionsPopup(card, event) {
    event?.stopPropagation();
    const context = this.resourcePopupStore.popupContextRef();
    if (!context || card.type !== ASSET_TYPE_SUPPLIES || !card.sourceAssetId) {
      return;
    }
    this.resourcePopupStore.supplyPopupRef.set({
      subEventId: context.subEvent.id,
      assetId: card.sourceAssetId,
      title: card.title
    });
    this.resourcePopupStore.bringDialogRef.set(null);
  }
  selectResourceFilter(filter) {
    if (filter === "Members") {
      return;
    }
    this.resourcePopupStore.resourceFilterRef.set(filter);
    this.resourcePopupStore.resourceAssetViewIdRef.set(null);
    this.resourcePopupStore.resourceAssetViewModeRef.set("view");
    this.closeAssignedAssetJoinDialog();
    this.resourcePopupStore.assetExploreBorrowDialogRef.set(null);
    this.resourcePopupStore.assetExplorePopupRef.set(null);
  }
  resourceCards() {
    const context = this.resourcePopupStore.popupContextRef();
    if (!context) {
      return [];
    }
    const type = this.resourcePopupStore.resourceFilterRef();
    const assignedIds = this.resolveSubEventAssignedAssetIds(context.subEvent.id, type, {
      normalizeStore: false
    });
    const settings = this.getSubEventAssignedAssetSettings(context.subEvent.id, type, {
      normalizeStore: false
    });
    const fallbackCards = context.fallbackCardsByType[type] ?? [];
    const fallbackCardById = new Map(fallbackCards.map((card) => [card.id, card]));
    return assignedIds.map((id) => this.ownedAssetCards().find((card) => card.id === id && card.type === type) ?? fallbackCardById.get(id) ?? null).filter((card) => card !== null).map((card) => {
      const assignmentSettings = settings[card.id];
      const managerUserId = isAssetType(type) ? `${assignmentSettings?.addedByUserId ?? ""}`.trim() || null : null;
      return {
        id: `subevent-${card.id}`,
        type: card.type,
        sourceAssetId: card.id,
        title: card.title,
        subtitle: card.subtitle,
        city: card.city,
        details: ActivityResourceBuilder.assetDetailText(card),
        imageUrl: card.imageUrl,
        sourceLink: ActivityResourceBuilder.assetSourceLink(card),
        routes: this.assignedResourceCardRoutes(card, assignmentSettings),
        capacityTotal: this.assignedAssetOccupancyCapacityTotal(card, assignmentSettings),
        accepted: card.type === ASSET_TYPE_SUPPLIES ? this.subEventSupplyProvidedCount(card.id, context.subEvent.id) : this.assetAcceptedCount(card, context.subEvent.id, managerUserId),
        pending: this.assetPendingCount(card, context.subEvent.id, managerUserId),
        isMembers: false
      };
    });
  }
  assignedResourceCardRoutes(card, settings) {
    if (card.type === ASSET_TYPE_ACCOMMODATION) {
      return ActivityResourceBuilder.normalizeAssetRoutes(card.type, card.routes);
    }
    if (card.type !== ASSET_TYPE_TRANSPORT) {
      return ActivityResourceBuilder.normalizeAssetRoutes(card.type, settings?.routes ?? card.routes);
    }
    const routes = ActivityResourceBuilder.normalizeAssetRoutes(card.type, settings?.routes ?? card.routes);
    const routeEnabled = settings?.routeEnabled ?? routes.length > 0;
    return routeEnabled ? routes : [];
  }
  assignedAssetManagerUserId(subEventId, type, assetId) {
    const settings = this.getSubEventAssignedAssetSettings(subEventId, type);
    const managerUserId = `${settings[assetId]?.addedByUserId ?? ""}`.trim();
    return managerUserId || null;
  }
  isAssetOwnedByActiveUser(card, activeUserId = this.activeUser().id.trim(), ownerUserId = `${card.ownerUserId ?? ""}`.trim()) {
    return ownerUserId.length > 0 ? ownerUserId === activeUserId : this.ownedAssetCards().some((item) => item.id === card.id && item.type === card.type);
  }
  canManageAssignedAssetMembers(card, subEventId, activeUserId = this.activeUser().id.trim()) {
    if (!activeUserId) {
      return false;
    }
    if (this.isAssetOwnedByActiveUser(card, activeUserId)) {
      return true;
    }
    return this.findBorrowedAssetRequest(card, subEventId, activeUserId)?.status === "accepted";
  }
  isSubEventScopedAssetRequest(request, subEventId, eventId = `${this.resourcePopupStore.popupContextRef()?.ownerId ?? ""}`.trim()) {
    return ActivityResourceBuilder.isSubEventScopedAssetRequest(request, subEventId, eventId);
  }
  subEventScopedAssetRequests(card, subEventId, eventId = `${this.resourcePopupStore.popupContextRef()?.ownerId ?? ""}`.trim()) {
    return card.requests.filter((request) => this.isSubEventScopedAssetRequest(request, subEventId, eventId)).map((request) => __spreadProps(__spreadValues({}, request), {
      booking: request.booking ? __spreadProps(__spreadValues({}, request.booking), {
        acceptedPolicyIds: [...request.booking.acceptedPolicyIds ?? []]
      }) : null
    }));
  }
  findAssignedAssetJoinRequest(card, subEventId, activeUserId = this.activeUser().id) {
    return this.subEventScopedAssetRequests(card, subEventId).find((request) => request.requestKind !== "manual" && AppUtils.resolveAssetRequestUserId(request, this.users) === activeUserId) ?? null;
  }
  findBorrowedAssetRequest(card, subEventId, activeUserId = this.activeUser().id) {
    return this.subEventScopedAssetRequests(card, subEventId).find((request) => request.requestKind === "borrow" && AppUtils.resolveAssetRequestUserId(request, this.users) === activeUserId) ?? null;
  }
  assignedAssetJoinMemberCounts(card, subEventId, activeUserId = this.activeUser().id, managerUserId = null) {
    const relevantRequests = this.assetRequestsForView(card, subEventId, managerUserId);
    const relevantUserIds = new Set(relevantRequests.filter((request) => request.status === "accepted" || request.status === "pending" || request.requestKind === "manual").map((request) => AppUtils.resolveAssetRequestUserId(request, this.users) || request.userId || request.id).filter((value) => `${value ?? ""}`.trim().length > 0));
    if (`${activeUserId ?? ""}`.trim().length > 0) {
      relevantUserIds.add(activeUserId);
    }
    return {
      accepted: relevantRequests.filter((request) => request.status === "accepted").length,
      pending: relevantRequests.filter((request) => request.status === "pending").length,
      shareMemberCount: Math.max(1, relevantUserIds.size)
    };
  }
  assetRequestsForView(card, subEventId, managerUserId = null, eventId = `${this.resourcePopupStore.popupContextRef()?.ownerId ?? ""}`.trim()) {
    const requests = this.subEventScopedAssetRequests(card, subEventId, eventId);
    const normalizedManagerUserId = `${managerUserId ?? ""}`.trim();
    if (!normalizedManagerUserId) {
      return requests;
    }
    const ownerUserId = `${card.ownerUserId ?? ""}`.trim();
    const managerOwnsAsset = this.isAssetOwnedByActiveUser(card, normalizedManagerUserId, ownerUserId);
    const visibleRequests = managerOwnsAsset ? requests.filter((request) => {
      const requestUserId = AppUtils.resolveAssetRequestUserId(request, this.users) || `${request.userId ?? ""}`.trim();
      if (requestUserId !== normalizedManagerUserId) {
        return true;
      }
      return request.status === "accepted" || request.requestKind === "manual";
    }) : requests;
    const hasManagerRequest = visibleRequests.some((request) => AppUtils.resolveAssetRequestUserId(request, this.users) === normalizedManagerUserId || `${request.userId ?? ""}`.trim() === normalizedManagerUserId);
    if (hasManagerRequest) {
      return visibleRequests;
    }
    const managerUser = this.userById.get(normalizedManagerUserId) ?? this.createFallbackUser(normalizedManagerUserId);
    return [
      {
        id: `manual:${subEventId}:${card.id}`,
        userId: managerUser.id,
        name: managerUser.name,
        initials: managerUser.initials,
        gender: managerUser.gender,
        status: managerOwnsAsset ? "accepted" : "pending",
        note: managerOwnsAsset ? "Managing this asset for the sub-event." : "Waiting for lender approval.",
        requestKind: managerOwnsAsset ? "manual" : "borrow",
        requestedAtIso: "",
        booking: {
          subEventId
        }
      },
      ...visibleRequests
    ];
  }
  resolveAssignedAssetJoinPricing(card, subEvent, activeUserId = this.activeUser().id, managerUserId = null) {
    const startAtIso = `${subEvent.startAt ?? ""}`.trim();
    const endAtIso = `${subEvent.endAt ?? ""}`.trim();
    const normalized = PricingBuilder.compactPricingConfig(card.pricing, {
      context: "asset",
      allowSlotFeatures: false
    });
    const basePricing = PricingBuilder.resolveAssetBorrowPricing({
      pricing: card.pricing,
      totalQuantity: AssetCardBuilder.storedQuantityValue(card),
      requestedQuantity: 1,
      startAtIso,
      endAtIso,
      requests: card.requests
    });
    const shareMemberCount = this.assignedAssetJoinMemberCounts(card, subEvent.id, activeUserId, managerUserId).shareMemberCount;
    if (!normalized.enabled || basePricing.amount <= 0) {
      return {
        totalAmount: 0,
        shareAmount: 0,
        shareMemberCount,
        currency: basePricing.currency,
        chargeType: normalized.chargeType ?? null
      };
    }
    const totalAmount = normalized.chargeType === "per_attendee" ? Math.round(basePricing.amount * shareMemberCount * 100) / 100 : basePricing.amount;
    const shareAmount = normalized.chargeType === "per_attendee" ? basePricing.amount : Math.round(totalAmount / Math.max(1, shareMemberCount) * 100) / 100;
    return {
      totalAmount,
      shareAmount,
      shareMemberCount,
      currency: basePricing.currency,
      chargeType: normalized.chargeType ?? null
    };
  }
  openResourceMap(card, event) {
    event?.stopPropagation();
    if (card.type !== ASSET_TYPE_TRANSPORT && card.type !== ASSET_TYPE_ACCOMMODATION) {
      return;
    }
    const routes = ActivityResourceBuilder.normalizeAssetRoutes(card.type, card.routes);
    if (card.type === ASSET_TYPE_ACCOMMODATION) {
      this.openGoogleMapsSearch(routes[0] ?? card.city);
      return;
    }
    this.openGoogleMapsDirections(routes);
  }
  join(card, event) {
    event.stopPropagation();
    const context = this.resourcePopupStore.popupContextRef();
    if (!context || !card.sourceAssetId) {
      return;
    }
    const type = card.type === ASSET_TYPE_TRANSPORT || card.type === ASSET_TYPE_ACCOMMODATION ? card.type : null;
    if (!type) {
      return;
    }
    const sourceCard = this.resolveSubEventAssignedAssetCard(context.subEvent.id, type, card.sourceAssetId);
    if (!sourceCard) {
      return;
    }
    const existingRequest = this.findAssignedAssetJoinRequest(sourceCard, context.subEvent.id, this.activeUser().id);
    const activePolicies = AssetCardBuilder.assetPoliciesEnabled(sourceCard) ? sourceCard.policies ?? [] : [];
    const validPolicyIds = new Set(activePolicies.map((policy) => policy.id));
    const dialog = {
      cardId: card.id,
      type,
      sourceAssetId: sourceCard.id,
      acceptedPolicyIds: [...new Set(existingRequest?.booking?.acceptedPolicyIds ?? [])].map((item) => `${item ?? ""}`.trim()).filter((item) => item.length > 0 && validPolicyIds.has(item)),
      busy: false,
      error: null
    };
    this.resourcePopupStore.assignedAssetJoinDialogRef.set(dialog);
    void this.openAssignedAssetJoinCheckoutEditor(card, sourceCard, dialog);
  }
  async openAssignedAssetJoinCheckoutEditor(resourceCard, sourceCard, dialog, options = {}) {
    const context = this.resourcePopupStore.popupContextRef();
    if (!context || this.resourcePopupStore.assignedAssetJoinDialogRef()?.sourceAssetId !== sourceCard.id) {
      return;
    }
    const runtimeRoute = this.assignedAssetRuntimeRouteState(context.subEvent.id, resourceCard, sourceCard);
    const ownerUserId = `${sourceCard.ownerUserId ?? ""}`.trim();
    const loadDetail = ownerUserId.length > 0 && options.loadDetail !== false;
    const generation = this.assetStore.openAssetEditorEdit({
      cardId: sourceCard.id,
      form: AssetCardBuilder.buildAssetFormFromCard(sourceCard),
      visibility: AssetCardBuilder.visibilityFromCard(sourceCard),
      loading: loadDetail,
      readOnly: true,
      parentZIndex: this.resourcePopupZIndex(),
      runtimeRoute: runtimeRoute ? __spreadProps(__spreadValues({}, runtimeRoute), { editable: false }) : null,
      checkout: this.assignedAssetJoinCheckoutState(sourceCard, dialog, context)
    });
    void this.assetPopupStore.ensureAssetPopupLoaded();
    if (!loadDetail) {
      this.assetStore.setAssetEditorLoading(false);
      return;
    }
    try {
      const loadedCard = await this.assetsService.loadOwnedAssetDetailById(ownerUserId, sourceCard.id);
      if (!this.assetStore.isCurrentAssetEditorLoad(generation, sourceCard.id)) {
        return;
      }
      if (loadedCard) {
        this.assetStore.applyAssetEditorForm(loadedCard.id, AssetCardBuilder.visibilityFromCard(loadedCard), AssetCardBuilder.buildAssetFormFromCard(loadedCard));
      }
      this.assetStore.setAssetEditorLoading(false);
    } catch {
      if (this.assetStore.isCurrentAssetEditorLoad(generation, sourceCard.id)) {
        this.assetStore.setAssetEditorLoading(false);
      }
    }
  }
  assignedAssetJoinCheckoutState(sourceCard, dialog, context) {
    const startAtIso = `${context.subEvent.startAt ?? ""}`.trim();
    const endAtIso = `${context.subEvent.endAt ?? ""}`.trim();
    const timeframe = ActivityResourceBuilder.assetRequestTimeframeLabel(startAtIso, endAtIso);
    const managerUserId = this.assignedAssetManagerUserId(context.subEvent.id, dialog.type, dialog.sourceAssetId);
    const pricing = this.resolveAssignedAssetJoinPricing(sourceCard, context.subEvent, this.activeUser().id, managerUserId);
    const hasError = !dialog.busy && Boolean(dialog.error);
    return {
      sourceId: sourceCard.id,
      mode: "join",
      phase: "review",
      title: `Join ${sourceCard.title}`,
      subtitle: this.popupSubtitle(),
      dateRange: {
        startAt: startAtIso,
        endAt: endAtIso,
        precision: "minute"
      },
      dateRangeModel: {
        mode: "range",
        precision: "minute",
        valueFormat: "iso-date-time",
        range: {
          start: { label: this.i18n.translate("asset.borrow.start") },
          end: { label: this.i18n.translate("asset.borrow.end") }
        }
      },
      availableQuantity: 1,
      pricingPreview: {
        rows: [{
          key: `assigned-asset-join:${sourceCard.id}`,
          label: pricing.chargeType === "per_attendee" ? "Per-member price" : "Your share",
          detail: timeframe,
          amount: pricing.shareAmount,
          currency: pricing.currency
        }],
        totalAmount: pricing.shareAmount,
        currency: pricing.currency
      },
      acceptedPolicyIds: [...dialog.acceptedPolicyIds],
      footerItems: [
        {
          id: "join-cancel",
          label: this.i18n.translate("cancel"),
          layout: "action",
          palette: "neutral",
          disabled: dialog.busy
        },
        {
          id: "join-confirm",
          label: dialog.busy ? "Sending request..." : "Send join request",
          layout: "action",
          palette: hasError ? "danger" : "blue",
          disabled: !this.canSubmitAssignedAssetJoin(),
          progress: dialog.busy || hasError ? {
            state: dialog.busy ? "loading" : "error",
            shape: "button"
          } : null
        }
      ],
      pendingFooterItemId: "join-confirm",
      pendingFooterLabel: "Sending request...",
      busy: dialog.busy,
      error: dialog.error,
      onPolicyToggle: (policyId) => this.toggleAssignedAssetJoinPolicy(policyId),
      onFooterItemSelect: (itemId, sourceEvent) => {
        if (itemId === "join-cancel") {
          this.closeAssignedAssetJoinDialog(sourceEvent);
          return;
        }
        void this.confirmAssignedAssetJoin(sourceEvent);
      },
      onClose: () => this.closeAssignedAssetJoinDialog()
    };
  }
  syncAssignedAssetJoinCheckoutEditor(dialog) {
    const checkout = this.assetStore.assetFormCheckout();
    const context = this.resourcePopupStore.popupContextRef();
    if (checkout?.mode !== "join" || checkout.sourceId !== dialog.sourceAssetId || !context) {
      return;
    }
    const sourceCard = this.resolveSubEventAssignedAssetCard(context.subEvent.id, dialog.type, dialog.sourceAssetId);
    if (!sourceCard) {
      return;
    }
    this.assetStore.setAssetEditorCheckoutState(this.assignedAssetJoinCheckoutState(sourceCard, dialog, context));
  }
  restoreAssignedAssetJoinAfterFailure(dialog) {
    this.assetStore.setAssetEditorCheckoutPending(false);
    this.resourcePopupStore.assignedAssetJoinDialogRef.set(dialog);
    this.syncAssignedAssetJoinCheckoutEditor(dialog);
  }
  leave(card, event) {
    event.stopPropagation();
    const context = this.resourcePopupStore.popupContextRef();
    if (!context || !card.sourceAssetId || card.type !== ASSET_TYPE_TRANSPORT && card.type !== ASSET_TYPE_ACCOMMODATION) {
      return;
    }
    const sourceCard = this.resolveSubEventAssignedAssetCard(context.subEvent.id, card.type, card.sourceAssetId);
    if (!sourceCard) {
      return;
    }
    const currentRequest = this.findAssignedAssetJoinRequest(sourceCard, context.subEvent.id, this.activeUser().id);
    const syncedStatus = this.assignedAssetMemberStatusChange(sourceCard.id, context)?.status ?? null;
    if (!currentRequest && syncedStatus !== "accepted" && syncedStatus !== "pending") {
      return;
    }
    const isPending = syncedStatus === "pending" || !syncedStatus && currentRequest?.status === "pending";
    this.dialogStore.open({
      title: `Leave ${sourceCard.title}?`,
      message: isPending ? "You will leave this asset and withdraw your pending request." : "You will leave this asset.",
      cancelLabel: "Cancel",
      confirmLabel: "Leave",
      busyConfirmLabel: "Leaving...",
      confirmTone: "danger",
      failureMessage: "Unable to leave this asset.",
      onConfirm: () => this.confirmAssignedAssetLeave(sourceCard.id, sourceCard.type, context.ownerId, context.subEvent.id)
    });
  }
  async confirmAssignedAssetLeave(assetId, assetType, eventId, subEventId) {
    const activeUserId = this.activeUser().id.trim();
    if (!activeUserId) {
      throw new Error("Unable to resolve the active member.");
    }
    const change = await this.assetsService.applyMemberStatusChange({
      assetId,
      eventId,
      subEventId,
      actorUserId: activeUserId,
      action: "leave"
    });
    if (!change || change.status !== "deleted") {
      throw new Error("The asset membership was not removed.");
    }
    this.applyAssignedAssetMemberStatusChange(assetType, change);
    if (this.resourcePopupStore.assignedAssetJoinDialogRef()?.sourceAssetId === assetId) {
      this.closeAssignedAssetJoinDialog();
    }
  }
  closeAssignedAssetJoinDialog(event) {
    event?.stopPropagation();
    const dialog = this.resourcePopupStore.assignedAssetJoinDialogRef();
    this.resourcePopupStore.assignedAssetJoinDialogRef.set(null);
    this.assetStore.setAssetEditorCheckoutPending(false);
    const checkout = this.assetStore.assetFormCheckout();
    if (checkout?.mode === "join" && (!dialog || checkout.sourceId === dialog.sourceAssetId)) {
      this.assetStore.closeAssetEditor();
    }
  }
  toggleAssignedAssetJoinPolicy(policyId) {
    const dialog = this.resourcePopupStore.assignedAssetJoinDialogRef();
    if (!dialog || dialog.busy) {
      return;
    }
    const normalizedPolicyId = `${policyId ?? ""}`.trim();
    if (!normalizedPolicyId) {
      return;
    }
    const nextAccepted = new Set(dialog.acceptedPolicyIds.map((item) => item.trim()).filter(Boolean));
    if (nextAccepted.has(normalizedPolicyId)) {
      nextAccepted.delete(normalizedPolicyId);
    } else {
      nextAccepted.add(normalizedPolicyId);
    }
    const nextDialog = __spreadProps(__spreadValues({}, dialog), {
      acceptedPolicyIds: [...nextAccepted],
      error: null
    });
    this.resourcePopupStore.assignedAssetJoinDialogRef.set(nextDialog);
    this.syncAssignedAssetJoinCheckoutEditor(nextDialog);
  }
  canSubmitAssignedAssetJoin() {
    const dialog = this.resourcePopupStore.assignedAssetJoinDialogRef();
    const context = this.resourcePopupStore.popupContextRef();
    if (!dialog || !context || dialog.busy) {
      return false;
    }
    const sourceCard = this.resolveSubEventAssignedAssetCard(context.subEvent.id, dialog.type, dialog.sourceAssetId);
    if (!sourceCard) {
      return false;
    }
    const acceptedPolicyIds = new Set(dialog.acceptedPolicyIds.map((item) => item.trim()).filter(Boolean));
    return !(AssetCardBuilder.assetPoliciesEnabled(sourceCard) ? sourceCard.policies ?? [] : []).some((policy) => policy.required !== false && !acceptedPolicyIds.has(policy.id));
  }
  async confirmAssignedAssetJoin(event) {
    event?.stopPropagation();
    const dialog = this.resourcePopupStore.assignedAssetJoinDialogRef();
    const context = this.resourcePopupStore.popupContextRef();
    if (!dialog || !context) {
      return;
    }
    const sourceCard = this.resolveSubEventAssignedAssetCard(context.subEvent.id, dialog.type, dialog.sourceAssetId);
    if (!sourceCard) {
      const nextDialog = __spreadProps(__spreadValues({}, dialog), {
        busy: false,
        error: "This asset is no longer available in the resource popup."
      });
      this.resourcePopupStore.assignedAssetJoinDialogRef.set(nextDialog);
      this.syncAssignedAssetJoinCheckoutEditor(nextDialog);
      return;
    }
    if (!this.canSubmitAssignedAssetJoin()) {
      return;
    }
    const activeUser = this.activeUser();
    const pricing = this.resolveAssignedAssetJoinPricing(sourceCard, context.subEvent, activeUser.id);
    const activePolicies = AssetCardBuilder.assetPoliciesEnabled(sourceCard) ? sourceCard.policies ?? [] : [];
    const validPolicyIds = new Set(activePolicies.map((policy) => policy.id));
    const acceptedPolicyIds = [...new Set(dialog.acceptedPolicyIds.map((item) => item.trim()).filter(Boolean))].filter((item) => validPolicyIds.has(item));
    const existingRequest = this.findAssignedAssetJoinRequest(sourceCard, context.subEvent.id, activeUser.id);
    const startAtIso = `${context.subEvent.startAt ?? ""}`.trim();
    const endAtIso = `${context.subEvent.endAt ?? ""}`.trim();
    const nextRequest = {
      id: existingRequest?.id ?? `borrow:${activeUser.id}:${sourceCard.id}:${context.subEvent.id}`,
      userId: activeUser.id,
      name: activeUser.name,
      initials: activeUser.initials,
      gender: activeUser.gender,
      status: "pending",
      note: "Join request from sub-event assets.",
      requestKind: "borrow",
      requestedAtIso: existingRequest?.requestedAtIso ?? (/* @__PURE__ */ new Date()).toISOString(),
      booking: this.assetRequestBookingForRange(context.subEvent, context.ownerId, context.parentTitle, startAtIso, endAtIso, 1, {
        totalAmount: pricing.shareAmount,
        currency: pricing.currency,
        acceptedPolicyIds
      })
    };
    const busyDialog = __spreadProps(__spreadValues({}, dialog), {
      acceptedPolicyIds,
      busy: true,
      error: null
    });
    this.resourcePopupStore.assignedAssetJoinDialogRef.set(busyDialog);
    this.assetStore.setAssetEditorCheckoutPending(true);
    const activeContext = this.resourcePopupStore.popupContextRef();
    if (!activeContext || activeContext.subEvent.id !== context.subEvent.id) {
      this.restoreAssignedAssetJoinAfterFailure(__spreadProps(__spreadValues({}, dialog), {
        acceptedPolicyIds,
        busy: false,
        error: "Unable to save the join request."
      }));
      return;
    }
    try {
      const change = await this.assetsService.applyMemberStatusChange({
        assetId: sourceCard.id,
        eventId: context.ownerId,
        subEventId: context.subEvent.id,
        actorUserId: activeUser.id,
        action: "join",
        request: nextRequest
      });
      if (!change || change.status !== "pending" && change.status !== "accepted") {
        throw new Error("The asset join request was not saved.");
      }
      this.applyAssignedAssetMemberStatusChange(sourceCard.type, change);
      this.closeAssignedAssetJoinDialog();
    } catch {
      const nextDialog = __spreadProps(__spreadValues({}, dialog), {
        acceptedPolicyIds,
        busy: false,
        error: "Unable to save the join request."
      });
      this.restoreAssignedAssetJoinAfterFailure(nextDialog);
    }
  }
  resolveViewableCarRoutes(settingsRoutes, cardRoutes, sourceRoutes) {
    const candidates = [settingsRoutes, cardRoutes, sourceRoutes].map((routes) => ActivityResourceBuilder.normalizeAssetRoutes(ASSET_TYPE_TRANSPORT, routes).filter((stop) => stop.trim().length > 0));
    return candidates.find((routes) => routes.length > 0) ?? [""];
  }
  assignedRuntimeQuantityMax(card) {
    return Math.max(1, AssetCardBuilder.storedQuantityValue(card));
  }
  assignedRuntimeQuantityBounds(card, subEventId, settings) {
    const remainingQuantity = Math.max(0, AssetCardBuilder.storedQuantityValue(card));
    const reservation = this.assignedAssetReservationRequest(card, subEventId, settings?.addedByUserId);
    const reservedQuantity = reservation ? this.assignedRuntimeQuantityValue(reservation.booking?.quantity, settings?.quantity) : 0;
    const reservedInventoryQuantity = reservation?.booking?.inventoryApplied === true ? reservedQuantity : 0;
    return {
      quantityMax: Math.max(1, remainingQuantity + reservedInventoryQuantity),
      reservedQuantity,
      reservation
    };
  }
  assignedAssetReservationRequest(card, subEventId, assignedByUserId) {
    const scopedRequests = this.subEventScopedAssetRequests(card, subEventId);
    const normalizedAssignedByUserId = `${assignedByUserId ?? ""}`.trim();
    const assignedByRequest = normalizedAssignedByUserId ? scopedRequests.find((request) => (request.requestKind === "borrow" || request.requestKind === "manual") && AppUtils.resolveAssetRequestUserId(request, this.users) === normalizedAssignedByUserId) ?? null : null;
    return assignedByRequest ?? scopedRequests.find((request) => request.requestKind === "borrow" && request.booking?.inventoryApplied === true) ?? scopedRequests.find((request) => request.requestKind === "manual") ?? null;
  }
  assignedRuntimeQuantityDescription(quantityMax, quantity, card, reservation) {
    const availableLabel = this.i18n.translateParams("asset.assignment.available", {
      count: Math.max(0, Math.trunc(quantityMax) - Math.max(1, Math.trunc(quantity)))
    });
    const priceDelta = this.assignedRuntimeQuantityPriceDelta(card, reservation, quantity);
    if (!priceDelta || Math.abs(priceDelta.amount) < 5e-3) {
      return availableLabel;
    }
    return this.i18n.translateParams("asset.assignment.available.price", {
      available: availableLabel,
      price: this.signedCurrencyAmount(priceDelta.amount, priceDelta.currency)
    });
  }
  assignedRuntimeQuantityPriceDelta(card, reservation, nextQuantity) {
    if (!card || !reservation?.booking?.paymentSessionId) {
      return null;
    }
    const currentQuantity = this.assignedRuntimeQuantityValue(reservation.booking.quantity);
    const normalizedNextQuantity = this.assignedRuntimeQuantityValue(nextQuantity);
    if (currentQuantity === normalizedNextQuantity) {
      return null;
    }
    const startAtIso = `${reservation.booking.startAtIso ?? ""}`.trim();
    const endAtIso = `${reservation.booking.endAtIso ?? ""}`.trim();
    const pricingOptions = {
      pricing: card.pricing,
      totalQuantity: this.assignedBorrowTotalQuantity(card, reservation),
      startAtIso,
      endAtIso,
      requests: card.requests
    };
    const currentPricing = PricingBuilder.resolveAssetBorrowPricing(__spreadProps(__spreadValues({}, pricingOptions), {
      requestedQuantity: currentQuantity
    }));
    const nextPricing = PricingBuilder.resolveAssetBorrowPricing(__spreadProps(__spreadValues({}, pricingOptions), {
      requestedQuantity: normalizedNextQuantity
    }));
    return {
      amount: Math.round((nextPricing.amount - currentPricing.amount) * 100) / 100,
      currency: nextPricing.currency || currentPricing.currency || "USD"
    };
  }
  signedCurrencyAmount(amount, currency) {
    const sign = amount > 0 ? "+" : amount < 0 ? "-" : "";
    const absoluteAmount = Math.abs(Number(amount) || 0);
    try {
      return `${sign}${new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: `${currency ?? "USD"}`.trim() || "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(absoluteAmount)}`;
    } catch {
      return `${sign}${`${currency ?? "USD"}`.trim() || "USD"} ${absoluteAmount.toFixed(2)}`;
    }
  }
  assignedRuntimeQuantityValue(value, fallback = 1) {
    const parsed = Math.trunc(Number(value));
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
    const fallbackValue = Math.trunc(Number(fallback));
    return Number.isFinite(fallbackValue) && fallbackValue > 0 ? fallbackValue : 1;
  }
  assignedAssetOccupancyCapacityTotal(card, settings) {
    const capacity = Math.max(0, Math.trunc(Number(card.capacityTotal) || 0));
    return capacity * this.assignedRuntimeQuantityValue(settings?.quantity);
  }
  normalizeAssignedRuntimeQuantity(value, max, fallback = 1) {
    const parsedMax = Math.trunc(Number(max));
    const limit = Number.isFinite(parsedMax) && parsedMax > 0 ? parsedMax : 1;
    const parsed = Math.trunc(Number(value));
    const fallbackValue = Math.trunc(Number(fallback));
    const resolved = Number.isFinite(parsed) && parsed > 0 ? parsed : Number.isFinite(fallbackValue) && fallbackValue > 0 ? fallbackValue : 1;
    return Math.min(limit, Math.max(1, resolved));
  }
  async saveAssignedAssetRuntimeAssignment(subEventId, type, assetId, state, signal) {
    const context = this.resourcePopupStore.popupContextRef();
    const normalizedSubEventId = subEventId.trim();
    const normalizedAssetId = assetId.trim();
    if (!context || context.subEvent.id !== normalizedSubEventId || !normalizedAssetId) {
      throw new Error("Unable to save route changes.");
    }
    const nextState = this.buildPopupResourceState(context);
    if (!nextState) {
      throw new Error("Unable to save route changes.");
    }
    const normalizedRoutes = ActivityResourceBuilder.normalizeAssetRoutes(type, state.routes);
    const nextSettings = __spreadValues({}, nextState.assetSettingsByType[type] ?? {});
    const source = this.resolveSubEventAssignedAssetCard(normalizedSubEventId, type, normalizedAssetId) ?? this.ownedAssetCards().find((item) => item.id === normalizedAssetId && item.type === type) ?? null;
    const currentSettings = nextSettings[normalizedAssetId];
    const quantityBounds = source ? this.assignedRuntimeQuantityBounds(source, normalizedSubEventId, currentSettings) : { quantityMax: 1, reservedQuantity: 0, reservation: null };
    const quantityMax = quantityBounds.quantityMax;
    const quantity = this.normalizeAssignedRuntimeQuantity(state.quantity, quantityMax, quantityBounds.reservedQuantity);
    const persistedSource = source ? await this.persistAssignedBorrowQuantity(source, normalizedSubEventId, quantityBounds.reservation, quantity) : null;
    const current = nextSettings[normalizedAssetId] ?? {
      capacityMin: 0,
      capacityMax: Math.max(0, source?.capacityTotal ?? 0),
      quantity,
      addedByUserId: this.activeUser().id,
      routeEnabled: false,
      routes: []
    };
    nextSettings[normalizedAssetId] = __spreadProps(__spreadValues({}, current), {
      quantity,
      routeEnabled: type === ASSET_TYPE_TRANSPORT && state.routeEnabled === true,
      routes: type === ASSET_TYPE_TRANSPORT ? normalizedRoutes : []
    });
    nextState.assetSettingsByType = __spreadProps(__spreadValues({}, nextState.assetSettingsByType), {
      [type]: nextSettings
    });
    if (persistedSource && !this.ownedAssetCards().some((item) => item.id === normalizedAssetId && item.type === type)) {
      nextState.fallbackAssetCardsByType = __spreadProps(__spreadValues({}, nextState.fallbackAssetCardsByType ?? {}), {
        [type]: [
          ...(nextState.fallbackAssetCardsByType?.[type] ?? []).filter((item) => item.id !== normalizedAssetId),
          this.toAssetDetailDto(this.assignedFallbackAssetSnapshot(normalizedSubEventId, persistedSource))
        ]
      });
    }
    const savedState = await this.activityResourcesService.replaceSubEventResourceState(nextState, signal);
    const resolvedState = ActivityResourceBuilder.normalizeState(savedState, nextState) ?? nextState;
    this.applyPersistedPopupState(resolvedState);
    this.syncSubEventManualAssetRequests(context.subEvent, true);
    this.syncPopupSubEventMetrics({
      assignmentQuantityUpdates: [{
        assetId: normalizedAssetId,
        type,
        subEventId: normalizedSubEventId,
        quantity
      }]
    });
    const savedSettings = resolvedState.assetSettingsByType[type]?.[normalizedAssetId] ?? null;
    return {
      quantity: this.normalizeAssignedRuntimeQuantity(savedSettings?.quantity ?? quantity, quantityMax),
      routeEnabled: type === ASSET_TYPE_TRANSPORT && (savedSettings?.routeEnabled ?? state.routeEnabled === true),
      routes: type === ASSET_TYPE_TRANSPORT ? ActivityResourceBuilder.normalizeAssetRoutes(type, savedSettings?.routes ?? normalizedRoutes) : []
    };
  }
  async persistAssignedBorrowQuantity(card, subEventId, reservation, quantity) {
    if (!reservation || reservation.requestKind !== "borrow" || !reservation.booking) {
      return card;
    }
    const previousQuantity = this.assignedRuntimeQuantityValue(reservation.booking.quantity);
    if (quantity === previousQuantity) {
      return card;
    }
    const quantityDelta = quantity - previousQuantity;
    const remainingQuantity = Math.max(0, AssetCardBuilder.storedQuantityValue(card));
    if (reservation.booking.inventoryApplied === true && quantityDelta > remainingQuantity) {
      throw new Error("The requested quantity is no longer available.");
    }
    const nextRemainingQuantity = reservation.booking.inventoryApplied === true ? Math.max(0, remainingQuantity - quantityDelta) : remainingQuantity;
    const startAtIso = `${reservation.booking.startAtIso ?? ""}`.trim();
    const endAtIso = `${reservation.booking.endAtIso ?? ""}`.trim();
    const pricing = PricingBuilder.resolveAssetBorrowPricing({
      pricing: card.pricing,
      totalQuantity: this.assignedBorrowTotalQuantity(card, reservation),
      requestedQuantity: quantity,
      startAtIso,
      endAtIso,
      requests: card.requests
    });
    const previousPricing = PricingBuilder.resolveAssetBorrowPricing({
      pricing: card.pricing,
      totalQuantity: this.assignedBorrowTotalQuantity(card, reservation),
      requestedQuantity: previousQuantity,
      startAtIso,
      endAtIso,
      requests: card.requests
    });
    const nextRequests = card.requests.map((request) => request.id === reservation.id ? __spreadProps(__spreadValues({}, request), {
      booking: request.booking ? __spreadProps(__spreadValues({}, request.booking), {
        quantity,
        totalAmount: pricing.amount,
        previousTotalAmount: previousPricing.amount,
        currency: pricing.currency,
        acceptedPolicyIds: [...request.booking.acceptedPolicyIds ?? []]
      }) : null
    }) : __spreadProps(__spreadValues({}, request), {
      booking: request.booking ? __spreadProps(__spreadValues({}, request.booking), {
        acceptedPolicyIds: [...request.booking.acceptedPolicyIds ?? []]
      }) : null
    }));
    const nextCard = __spreadProps(__spreadValues({}, card), {
      quantity: nextRemainingQuantity,
      requests: nextRequests
    });
    await this.persistLocalAssignedBorrowPriceRevision(card, reservation, quantity, pricing);
    const ownerUserId = `${card.ownerUserId ?? ""}`.trim();
    if (!ownerUserId) {
      return nextCard;
    }
    const savedCard = await this.assetsService.saveOwnedAsset(ownerUserId, this.toAssetDetailDto(nextCard));
    const persistedCard = __spreadProps(__spreadValues(__spreadValues({}, nextCard), savedCard), {
      sourceLink: nextCard.sourceLink,
      routes: [...nextCard.routes ?? []],
      topics: [...nextCard.topics ?? []],
      policiesEnabled: nextCard.policiesEnabled,
      policies: (nextCard.policies ?? []).map((policy) => __spreadValues({}, policy)),
      pricing: nextCard.pricing ? PricingBuilder.clonePricingConfig(nextCard.pricing) : nextCard.pricing,
      requests: savedCard.requests.map((request) => __spreadProps(__spreadValues({}, request), {
        booking: request.booking ? __spreadProps(__spreadValues({}, request.booking), {
          acceptedPolicyIds: [...request.booking.acceptedPolicyIds ?? []]
        }) : null
      }))
    });
    if (this.ownedAssetCards().some((item) => item.id === card.id && item.type === card.type)) {
      this.assetStore.replaceAssetCard(persistedCard, { mutation: true, reloadList: false });
    }
    return persistedCard;
  }
  async persistLocalAssignedBorrowPriceRevision(card, reservation, quantity, pricing) {
    const booking = reservation.booking;
    const userId = AppUtils.resolveAssetRequestUserId(reservation, this.users) || `${reservation.userId ?? ""}`.trim();
    const paymentSessionId = `${booking?.paymentSessionId ?? ""}`.trim();
    if (!this.eventsService.localModeEnabled || !booking || !userId || !paymentSessionId) {
      return;
    }
    const timeframe = ActivityResourceBuilder.assetRequestTimeframeLabel(`${booking.startAtIso ?? ""}`.trim(), `${booking.endAtIso ?? ""}`.trim());
    await this.eventsService.saveCheckoutBasket({
      userId,
      sourceId: card.id,
      slotSourceId: null,
      optionalSubEventIds: [],
      assetSelections: booking.subEventId ? [{ subEventId: booking.subEventId, resourceType: card.type }] : [],
      acceptedPolicyIds: [...booking.acceptedPolicyIds ?? []],
      appliedPromoCodes: [],
      basketItems: [],
      pricingSummaryRows: pricing.rows.map((row) => __spreadValues({}, row)),
      checkoutState: "pay",
      lineItems: [{
        id: `resource:${card.id}`,
        kind: "resource",
        label: card.title,
        detail: quantity > 1 ? this.i18n.translateParams("asset.borrow.quantity.detail", {
          timeframe,
          quantity
        }) : timeframe,
        amount: pricing.amount,
        currency: pricing.currency
      }],
      totalAmount: pricing.amount,
      currency: pricing.currency
    });
    await this.eventsService.updateCheckoutBasketState({
      userId,
      sourceId: card.id,
      slotSourceId: null,
      checkoutState: "pay",
      resultState: "succeeded",
      checkoutSessionId: paymentSessionId
    });
  }
  assignedBorrowTotalQuantity(card, reservation) {
    const remainingQuantity = Math.max(0, AssetCardBuilder.storedQuantityValue(card));
    const reservedQuantity = reservation.booking?.inventoryApplied === true ? this.assignedRuntimeQuantityValue(reservation.booking.quantity) : 0;
    return Math.max(1, remainingQuantity + reservedQuantity);
  }
  abortPendingAssignSaveRequest() {
    this.pendingAssignSaveRequestVersion += 1;
    const controller = this.pendingAssignSaveAbortController;
    this.pendingAssignSaveAbortController = null;
    controller?.abort();
  }
  requestDeleteResourceCard(card, event) {
    event.stopPropagation();
    const context = this.resourcePopupStore.popupContextRef();
    if (!context || !card.sourceAssetId || !this.isAssignableAssetType(card.type)) {
      return;
    }
    const sourceCard = this.resolveSubEventAssignedAssetCard(context.subEvent.id, card.type, card.sourceAssetId);
    if (!sourceCard || !this.canRemoveAssignedAsset(context.subEvent.id, sourceCard, card.sourceAssetId)) {
      return;
    }
    const pending = {
      assetId: card.sourceAssetId,
      type: card.type,
      title: card.title
    };
    this.dialogStore.open({
      title: "Remove assignment",
      message: `Remove "${pending.title}" from this event assignment?`,
      cancelLabel: "Cancel",
      confirmLabel: "Remove",
      busyConfirmLabel: "Removing...",
      confirmTone: "danger",
      failureMessage: "Unable to remove assignment.",
      onConfirm: () => this.removeResourceAssignment(pending)
    });
  }
  canRemoveAssignedAsset(subEventId, sourceCard, assetId) {
    const activeUserId = this.activeUser().id.trim();
    return activeUserId.length > 0 && (this.isAssetOwnedByActiveUser(sourceCard, activeUserId) || this.assignedAssetManagerUserId(subEventId, sourceCard.type, assetId) === activeUserId);
  }
  async removeResourceAssignment(pending) {
    const nextState = this.buildResourceAssignmentRemovalState(pending);
    if (!nextState) {
      throw new Error("Unable to remove assignment.");
    }
    const savedState = await this.activityResourcesService.replaceSubEventResourceState(nextState);
    const resolvedState = ActivityResourceBuilder.normalizeState(savedState, nextState) ?? nextState;
    this.applyPersistedPopupState(resolvedState);
    this.syncPopupSubEventMetrics({ persistAssetRequests: true });
  }
  buildResourceAssignmentRemovalState(pending) {
    const context = this.resourcePopupStore.popupContextRef();
    const nextState = this.buildPopupResourceState(context);
    if (!context || !nextState) {
      return null;
    }
    const currentIds = nextState.assetAssignmentIds[pending.type] ?? [];
    const nextIds = currentIds.filter((assetId) => assetId !== pending.assetId);
    if (nextIds.length === currentIds.length) {
      return null;
    }
    const nextSettings = __spreadValues({}, nextState.assetSettingsByType[pending.type] ?? {});
    delete nextSettings[pending.assetId];
    nextState.assetAssignmentIds = __spreadProps(__spreadValues({}, nextState.assetAssignmentIds), {
      [pending.type]: nextIds
    });
    nextState.assetSettingsByType = __spreadProps(__spreadValues({}, nextState.assetSettingsByType), {
      [pending.type]: nextSettings
    });
    if (pending.type === ASSET_TYPE_SUPPLIES) {
      const nextSupplyEntries = __spreadValues({}, nextState.supplyContributionEntriesByAssetId);
      delete nextSupplyEntries[pending.assetId];
      nextState.supplyContributionEntriesByAssetId = nextSupplyEntries;
    }
    return nextState;
  }
  isAssignableAssetType(type) {
    return isAssetType(type);
  }
  openAssignPopup(event) {
    event?.stopPropagation();
    const context = this.resourcePopupStore.popupContextRef();
    if (!context || context.viewOnly) {
      return;
    }
    this.abortPendingAssignSaveRequest();
    this.resourcePopupStore.pendingAssignSaveRef.set(null);
    const type = this.resourcePopupStore.resourceFilterRef();
    this.resourcePopupStore.assignContextRef.set({ subEventId: context.subEvent.id, type });
    this.resourcePopupStore.selectedAssignAssetIdsRef.set([...this.resolveSubEventAssignedAssetIds(context.subEvent.id, type)]);
    this.assetStore.openAssetPopup(type);
    this.assetPopupStore.primaryVisibleRef.set(true);
    this.assetPopupStore.stackedVisibleRef.set(false);
    this.assetPopupStore.basketVisibleRef.set(true);
  }
  openExplorePopup(event) {
    event?.stopPropagation();
    const context = this.resourcePopupStore.popupContextRef();
    if (!context) {
      return;
    }
    const type = this.resourcePopupStore.resourceFilterRef();
    const { startAtIso, endAtIso } = ActivityResourceBuilder.defaultAssetExploreRange(context.subEvent);
    this.closeAssignedAssetJoinDialog();
    this.resourcePopupStore.assetExploreBorrowDialogRef.set(null);
    this.resourcePopupStore.assetExplorePopupRef.set({
      subEventId: context.subEvent.id,
      type,
      category: AssetDefaultsBuilder.defaultCategory(type),
      startAtIso,
      endAtIso,
      loading: true,
      error: null,
      cards: []
    });
  }
  resourceFilterCounts() {
    const context = this.resourcePopupStore.popupContextRef();
    if (!context) {
      return {
        [ASSET_TYPE_TRANSPORT]: 0,
        [ASSET_TYPE_ACCOMMODATION]: 0,
        [ASSET_TYPE_SUPPLIES]: 0
      };
    }
    return {
      [ASSET_TYPE_TRANSPORT]: this.subEventAssetCapacityMetrics(context.subEvent, ASSET_TYPE_TRANSPORT, { normalizeStore: false }).pending,
      [ASSET_TYPE_ACCOMMODATION]: this.subEventAssetCapacityMetrics(context.subEvent, ASSET_TYPE_ACCOMMODATION, { normalizeStore: false }).pending,
      [ASSET_TYPE_SUPPLIES]: this.subEventAssetCapacityMetrics(context.subEvent, ASSET_TYPE_SUPPLIES, { normalizeStore: false }).pending
    };
  }
  subEventAssignedAssetCards(subEventId, type, options = {}) {
    return this.resolveSubEventAssignedAssetIds(subEventId, type, options).map((id) => this.resolveSubEventAssignedAssetCard(subEventId, type, id)).filter((card) => card !== null);
  }
  getSubEventAssignedAssetSettings(subEventId, type, options = {}) {
    const key = ActivityResourceBuilder.subEventAssetAssignmentKey(subEventId, type);
    const normalizeStore = options.normalizeStore !== false;
    const assignedIds = this.resolveSubEventAssignedAssetIds(subEventId, type, { normalizeStore });
    const existing = this.resourcePopupStore.assignedAssetSettingsByKey[key] ?? {};
    const next = {};
    for (const assetId of assignedIds) {
      const source = this.resolveSubEventAssignedAssetCard(subEventId, type, assetId);
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
        quantity: this.assignedRuntimeQuantityValue(previous?.quantity),
        addedByUserId: previous?.addedByUserId ?? this.activeUser().id,
        routeEnabled: previous?.routeEnabled ?? ActivityResourceBuilder.normalizeAssetRoutes(type, previous?.routes).length > 0,
        routes: ActivityResourceBuilder.normalizeAssetRoutes(type, previous?.routes)
      };
    }
    if (normalizeStore) {
      this.resourcePopupStore.assignedAssetSettingsByKey[key] = next;
    }
    return next;
  }
  resolveSubEventAssignedAssetIds(subEventId, type, options = {}) {
    const key = ActivityResourceBuilder.subEventAssetAssignmentKey(subEventId, type);
    const normalizeStore = options.normalizeStore !== false;
    const eligibleIds = [
      ...this.ownedAssetCards().filter((card) => card.type === type).map((card) => card.id),
      ...this.subEventFallbackAssetCards(subEventId, type).map((card) => card.id)
    ];
    const eligible = new Set(eligibleIds);
    const stored = this.resourcePopupStore.assignedAssetIdsByKey[key];
    if (!stored) {
      if (normalizeStore) {
        this.resourcePopupStore.assignedAssetIdsByKey[key] = [];
      }
      return [];
    }
    const normalized = stored.filter((id) => eligible.has(id));
    if (normalizeStore && normalized.length !== stored.length) {
      this.resourcePopupStore.assignedAssetIdsByKey[key] = [...normalized];
    }
    return normalized;
  }
  resolveSubEventAssignedAssetCard(subEventId, type, assetId) {
    return this.ownedAssetCards().find((card) => card.id === assetId && card.type === type) ?? this.subEventFallbackAssetCards(subEventId, type).find((card) => card.id === assetId && card.type === type) ?? null;
  }
  subEventFallbackAssetCards(subEventId, type) {
    const context = this.resourcePopupStore.popupContextRef();
    if (context?.subEvent.id !== subEventId) {
      return [];
    }
    return context.fallbackCardsByType[type] ?? [];
  }
  seedAssignmentsFromRequest(subEventId, assetAssignmentIds, fallbackCardsByType) {
    if (!subEventId || !assetAssignmentIds) {
      return;
    }
    for (const type of ASSET_TYPES) {
      const raw = assetAssignmentIds[type];
      if (!Array.isArray(raw)) {
        continue;
      }
      const allowedIds = /* @__PURE__ */ new Set([
        ...this.ownedAssetCards().filter((card) => card.type === type).map((card) => card.id),
        ...(fallbackCardsByType[type] ?? []).map((card) => card.id)
      ]);
      const normalized = raw.filter((id, index, arr) => typeof id === "string" && arr.indexOf(id) === index && allowedIds.has(id));
      this.resourcePopupStore.assignedAssetIdsByKey[ActivityResourceBuilder.subEventAssetAssignmentKey(subEventId, type)] = [...normalized];
    }
  }
  subEventAssetCapacityMetrics(subEvent, type, options = {}) {
    const cards = this.subEventAssignedAssetCards(subEvent.id, type, options);
    const settings = this.getSubEventAssignedAssetSettings(subEvent.id, type, options);
    const memberCount = (card, status) => {
      const memberSync = this.activityStore.activityMembersSyncByOwnerId()[card.id];
      const statusChange = this.assignedAssetMemberStatusChange(card.id);
      if (memberSync && statusChange?.subEventId === subEvent.id) {
        return status === "accepted" ? memberSync.acceptedMembers : memberSync.pendingMembers;
      }
      const managerUserId = `${settings[card.id]?.addedByUserId ?? ""}`.trim() || null;
      return status === "accepted" ? this.assetAcceptedCount(card, subEvent.id, managerUserId) : this.assetPendingCount(card, subEvent.id, managerUserId);
    };
    const capacityMax = cards.reduce((sum, card) => sum + (settings[card.id]?.capacityMax ?? Math.max(0, card.capacityTotal)), 0);
    const capacityMin = cards.reduce((sum, card) => sum + (settings[card.id]?.capacityMin ?? 0), 0);
    const pending = type === ASSET_TYPE_SUPPLIES ? 0 : cards.reduce((sum, card) => sum + memberCount(card, "pending"), 0);
    if (type === ASSET_TYPE_SUPPLIES) {
      return {
        joined: cards.reduce((sum, card) => sum + this.subEventSupplyProvidedCount(card.id, subEvent.id), 0),
        capacityMin,
        capacityMax,
        pending
      };
    }
    return {
      joined: cards.reduce((sum, card) => sum + memberCount(card, "accepted"), 0),
      capacityMin,
      capacityMax,
      pending
    };
  }
  syncPopupSubEventMetrics(options = false) {
    const context = this.resourcePopupStore.popupContextRef();
    if (!context) {
      return;
    }
    const persistResourceState = typeof options === "boolean" ? options : options.persistResourceState === true;
    const persistAssetRequests = typeof options === "boolean" ? options : options.persistAssetRequests === true;
    const syncManualAssetRequests = typeof options === "boolean" || options.syncManualAssetRequests !== false;
    const activityDelta = typeof options === "boolean" || options.activityDelta === void 0 ? void 0 : Math.trunc(Number(options.activityDelta) || 0);
    const assignmentQuantityUpdates = typeof options === "boolean" ? [] : [...options.assignmentQuantityUpdates ?? []];
    const nextSubEvent = this.cloneSubEvent(context.subEvent);
    const cars = this.subEventAssetCapacityMetrics(nextSubEvent, ASSET_TYPE_TRANSPORT, { normalizeStore: false });
    const accommodation = this.subEventAssetCapacityMetrics(nextSubEvent, ASSET_TYPE_ACCOMMODATION, { normalizeStore: false });
    const supplies = this.subEventAssetCapacityMetrics(nextSubEvent, ASSET_TYPE_SUPPLIES, { normalizeStore: false });
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
    const metricsChanged = context.subEvent.carsAccepted !== nextSubEvent.carsAccepted || context.subEvent.carsPending !== nextSubEvent.carsPending || context.subEvent.carsCapacityMin !== nextSubEvent.carsCapacityMin || context.subEvent.carsCapacityMax !== nextSubEvent.carsCapacityMax || context.subEvent.accommodationAccepted !== nextSubEvent.accommodationAccepted || context.subEvent.accommodationPending !== nextSubEvent.accommodationPending || context.subEvent.accommodationCapacityMin !== nextSubEvent.accommodationCapacityMin || context.subEvent.accommodationCapacityMax !== nextSubEvent.accommodationCapacityMax || context.subEvent.suppliesAccepted !== nextSubEvent.suppliesAccepted || context.subEvent.suppliesPending !== nextSubEvent.suppliesPending || context.subEvent.suppliesCapacityMin !== nextSubEvent.suppliesCapacityMin || context.subEvent.suppliesCapacityMax !== nextSubEvent.suppliesCapacityMax;
    const nextContext = metricsChanged ? __spreadProps(__spreadValues({}, context), {
      subEvent: nextSubEvent
    }) : context;
    if (metricsChanged) {
      this.resourcePopupStore.popupContextRef.set(nextContext);
    }
    if (metricsChanged || assignmentQuantityUpdates.length > 0 || activityDelta !== void 0) {
      this.resourcePopupStore.publishSubEventResourceMetrics(nextContext, {
        activityDelta,
        assignmentQuantityUpdates
      });
    }
    if (syncManualAssetRequests) {
      this.syncSubEventManualAssetRequests(nextContext.subEvent, persistAssetRequests);
    }
    if (persistResourceState) {
      this.persistPopupResourceState(nextContext);
    }
  }
  applyAssignedAssetMemberStatusChange(assetType, change) {
    const context = this.resourcePopupStore.popupContextRef();
    if (!context || change.eventId !== context.ownerId || change.subEventId !== context.subEvent.id || change.userId !== this.activeUser().id.trim()) {
      return;
    }
    const card = this.resourceCards().find((item) => item.sourceAssetId === change.assetId && item.type === assetType) ?? null;
    if (!card) {
      return;
    }
    const memberSync = this.activityStore.cacheActivityMemberStatusChange(change, {
      acceptedMembers: card.accepted,
      pendingMembers: card.pending,
      capacityTotal: card.capacityTotal
    });
    if (!memberSync) {
      return;
    }
    if (change.acceptedMemberDelta === 0 && change.pendingMemberDelta === 0) {
      return;
    }
    this.syncPopupSubEventMetrics({
      syncManualAssetRequests: false,
      activityDelta: change.pendingMemberDelta
    });
  }
  assignedAssetMemberStatusChange(assetId, context = this.resourcePopupStore.popupContextRef()) {
    const change = this.activityStore.activityMembersSyncByOwnerId()[assetId]?.memberStatusChange ?? null;
    if (!context || !change || change.assetId !== assetId || change.eventId !== context.ownerId || change.subEventId !== context.subEvent.id || change.userId !== this.activeUser().id.trim()) {
      return null;
    }
    return change;
  }
  assetRequestBookingForSubEvent(subEvent, quantity, ownerId, parentTitle) {
    const startAtIso = `${subEvent.startAt ?? ""}`.trim();
    const endAtIso = `${subEvent.endAt ?? ""}`.trim();
    return this.assetRequestBookingForRange(subEvent, ownerId, parentTitle, startAtIso, endAtIso, quantity);
  }
  assetRequestBookingForRange(subEvent, ownerId, parentTitle, startAtIso, endAtIso, quantity, options = {}) {
    return {
      eventId: ownerId,
      eventTitle: parentTitle,
      subEventId: subEvent.id,
      subEventTitle: subEvent.name,
      slotKey: subEvent.id,
      slotLabel: subEvent.name,
      timeframe: ActivityResourceBuilder.assetRequestTimeframeLabel(startAtIso, endAtIso),
      startAtIso: startAtIso || void 0,
      endAtIso: endAtIso || void 0,
      quantity,
      totalAmount: options.totalAmount ?? null,
      currency: options.currency ?? null,
      acceptedPolicyIds: [...options.acceptedPolicyIds ?? []],
      paymentSessionId: options.paymentSessionId ?? null,
      inventoryApplied: options.inventoryApplied === true ? true : null
    };
  }
  syncSubEventManualAssetRequests(subEvent, persist = false) {
    const context = this.resourcePopupStore.popupContextRef();
    if (!context) {
      return;
    }
    const activeUser = this.activeUser();
    let changed = false;
    const dirtyCards = [];
    const nextCards = this.ownedAssetCards().map((card) => {
      const nextManualRequest = this.buildManualAssignmentRequest(card, subEvent, context.ownerId, context.parentTitle, activeUser);
      const preservedRequests = card.requests.filter((request) => !ActivityResourceBuilder.isSubEventManualAssignmentRequest(request, subEvent.id)).map((request) => __spreadProps(__spreadValues({}, request), {
        booking: request.booking ? __spreadProps(__spreadValues({}, request.booking), {
          acceptedPolicyIds: [...request.booking.acceptedPolicyIds ?? []]
        }) : null
      }));
      if (nextManualRequest) {
        preservedRequests.unshift(nextManualRequest);
      }
      const sameRequests = preservedRequests.length === card.requests.length && preservedRequests.every((request, index) => ActivityResourceBuilder.assetRequestSyncSignature(request) === ActivityResourceBuilder.assetRequestSyncSignature(card.requests[index]));
      if (sameRequests) {
        return card;
      }
      changed = true;
      const nextCard = __spreadProps(__spreadValues({}, card), {
        requests: preservedRequests
      });
      dirtyCards.push(nextCard);
      return nextCard;
    });
    if (changed) {
      this.assetStore.applyAssetCards(nextCards, { mutation: persist });
      if (persist) {
        for (const dirtyCard of dirtyCards) {
          void this.assetsService.saveOwnedAsset(activeUser.id, this.toAssetDetailDto(dirtyCard));
        }
      }
    }
  }
  buildManualAssignmentRequest(card, subEvent, ownerId, parentTitle, activeUser) {
    if (card.type === ASSET_TYPE_SUPPLIES) {
      const assignedSupplyIds = new Set(this.resolveSubEventAssignedAssetIds(subEvent.id, ASSET_TYPE_SUPPLIES));
      if (!assignedSupplyIds.has(card.id)) {
        return null;
      }
      const settings2 = this.getSubEventAssignedAssetSettings(subEvent.id, ASSET_TYPE_SUPPLIES)[card.id];
      const quantityMax = this.assignedRuntimeQuantityMax(card);
      const quantity2 = this.subEventSupplyProvidedCount(card.id, subEvent.id) || this.normalizeAssignedRuntimeQuantity(settings2?.quantity, quantityMax);
      if (quantity2 <= 0) {
        return null;
      }
      const existing2 = card.requests.find((request) => ActivityResourceBuilder.isSubEventManualAssignmentRequest(request, subEvent.id)) ?? null;
      return {
        id: existing2?.id ?? `manual:${subEvent.id}:${card.id}`,
        userId: activeUser.id,
        name: activeUser.name,
        initials: activeUser.initials,
        gender: activeUser.gender,
        status: "accepted",
        note: "Reserved and assigned by the owner.",
        requestKind: "manual",
        requestedAtIso: existing2?.requestedAtIso ?? (/* @__PURE__ */ new Date()).toISOString(),
        booking: this.assetRequestBookingForSubEvent(subEvent, quantity2, ownerId, parentTitle)
      };
    }
    if (card.type !== ASSET_TYPE_TRANSPORT && card.type !== ASSET_TYPE_ACCOMMODATION) {
      return null;
    }
    const assignedIds = new Set(this.resolveSubEventAssignedAssetIds(subEvent.id, card.type));
    if (!assignedIds.has(card.id)) {
      return null;
    }
    const settings = this.getSubEventAssignedAssetSettings(subEvent.id, card.type)[card.id];
    const quantity = this.normalizeAssignedRuntimeQuantity(settings?.quantity, this.assignedRuntimeQuantityMax(card));
    const existing = card.requests.find((request) => ActivityResourceBuilder.isSubEventManualAssignmentRequest(request, subEvent.id)) ?? null;
    return {
      id: existing?.id ?? `manual:${subEvent.id}:${card.id}`,
      userId: activeUser.id,
      name: activeUser.name,
      initials: activeUser.initials,
      gender: activeUser.gender,
      status: "accepted",
      note: "Reserved and assigned by the owner.",
      requestKind: "manual",
      requestedAtIso: existing?.requestedAtIso ?? (/* @__PURE__ */ new Date()).toISOString(),
      booking: this.assetRequestBookingForSubEvent(subEvent, quantity, ownerId, parentTitle)
    };
  }
  assetMemberEntries(card, ownerUserId, subEventId, eventId) {
    const seedBaseDate = /* @__PURE__ */ new Date("2026-02-24T12:00:00");
    const requests = subEventId ? this.assetRequestsForView(card, subEventId, ownerUserId, eventId) : [...card.requests];
    void this.usersService.warmCachedUsers(requests.map((request) => AppUtils.resolveAssetRequestUserId(request, this.users)).filter((userId) => `${userId}`.trim().length > 0));
    const entries = requests.map((request) => {
      const requestUserId = AppUtils.resolveAssetRequestUserId(request, this.users);
      const matchedUser = this.users.find((user) => user.id === requestUserId) ?? this.users.find((user) => user.name === request.name && user.initials === request.initials) ?? this.users.find((user) => user.name === request.name) ?? null;
      const userId = matchedUser?.id ?? requestUserId;
      const note = `${request.note ?? ""}`.toLowerCase();
      const pendingRequiresAdminApproval = request.status === "pending" && !note.includes("owner approval") && !note.includes("join request");
      const pendingSource = request.status === "pending" ? pendingRequiresAdminApproval ? "admin" : "member" : null;
      const requestKind = request.status === "pending" ? pendingRequiresAdminApproval ? "invite" : "join" : null;
      const seed = AppUtils.hashText(`asset-members:${card.id}:${request.id}:${userId}`);
      const actionAtIso = AppUtils.toIsoDateTime(AppUtils.addDays(seedBaseDate, -(seed % 90 + 1)));
      return {
        id: request.id,
        userId,
        name: request.name,
        initials: request.initials,
        gender: request.gender,
        city: matchedUser?.city ?? card.city,
        statusText: request.note,
        role: ownerUserId && userId === ownerUserId ? "Manager" : "Member",
        status: request.status,
        pendingSource,
        requestKind,
        invitedByUserId: pendingRequiresAdminApproval ? ownerUserId : null,
        invitedByActiveUser: pendingRequiresAdminApproval && ownerUserId === this.activeUser().id,
        metAtIso: actionAtIso,
        actionAtIso,
        metWhere: card.title,
        avatarUrl: AppUtils.firstImageUrl(matchedUser?.images),
        profile: matchedUser ?? null
      };
    });
    return entries;
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
  handleOwnedAssetDeleted(cardId) {
    for (const key of Object.keys(this.resourcePopupStore.supplyContributionEntriesByAssignmentKey)) {
      if (key.endsWith(`:${cardId}`)) {
        delete this.resourcePopupStore.supplyContributionEntriesByAssignmentKey[key];
      }
    }
    for (const key of Object.keys(this.resourcePopupStore.assignedAssetIdsByKey)) {
      this.resourcePopupStore.assignedAssetIdsByKey[key] = this.resourcePopupStore.assignedAssetIdsByKey[key].filter((id) => id !== cardId);
    }
    for (const key of Object.keys(this.resourcePopupStore.assignedAssetSettingsByKey)) {
      if (!this.resourcePopupStore.assignedAssetSettingsByKey[key][cardId]) {
        continue;
      }
      const next = __spreadValues({}, this.resourcePopupStore.assignedAssetSettingsByKey[key]);
      delete next[cardId];
      this.resourcePopupStore.assignedAssetSettingsByKey[key] = next;
    }
    const supplyContext = this.resourcePopupStore.supplyPopupRef();
    if (supplyContext?.assetId === cardId) {
      this.resourcePopupStore.supplyPopupRef.set(null);
      this.resourcePopupStore.bringDialogRef.set(null);
    }
    this.syncPopupSubEventMetrics();
  }
  cloneSubEvent(subEvent) {
    return __spreadProps(__spreadValues({}, subEvent), {
      pricing: subEvent.pricing ? PricingBuilder.clonePricingConfig(subEvent.pricing) : void 0
    });
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
  assetRouteValues(card) {
    return "routes" in (card ?? {}) && Array.isArray(card.routes) ? [...card.routes ?? []] : void 0;
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
      details: ActivityResourceBuilder.assetDetailText(card),
      imageUrl: card.imageUrl,
      sourceLink: ActivityResourceBuilder.assetSourceLink(card),
      routes: ActivityResourceBuilder.normalizeAssetRoutes(card.type, card.routes),
      topics: [...card.topics ?? []],
      policiesEnabled: AssetCardBuilder.assetPoliciesEnabled(card),
      policies: (card.policies ?? []).map((policy) => __spreadValues({}, policy)),
      pricing: card.pricing ? PricingBuilder.clonePricingConfig(card.pricing) : card.pricing,
      visibility: card.visibility,
      status: card.status,
      ownerUserId: card.ownerUserId,
      ownerName: card.ownerName,
      requests: card.requests.map((request) => __spreadProps(__spreadValues({}, request), {
        booking: request.booking ? __spreadProps(__spreadValues({}, request.booking), {
          acceptedPolicyIds: [...request.booking.acceptedPolicyIds ?? []]
        }) : null
      })),
      menuActions: card.menuActions ? [...card.menuActions] : void 0
    };
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
  mergePersistedFallbackCards(current, persisted, subEventId) {
    const next = this.cloneFallbackCards(current);
    for (const type of ASSET_TYPES) {
      const cards = persisted?.[type];
      if (!Array.isArray(cards) || cards.length === 0) {
        continue;
      }
      const nextById = new Map((next[type] ?? []).map((card) => [card.id, this.cloneAsset(card)]));
      for (const card of cards) {
        nextById.set(card.id, this.assignedFallbackAssetSnapshot(subEventId, card));
      }
      next[type] = [...nextById.values()];
    }
    return next;
  }
  persistedAssignedFallbackCards(context, type) {
    const assignedIds = new Set(this.resolveSubEventAssignedAssetIds(context.subEvent.id, type));
    const ownedIds = new Set(this.ownedAssetCards().filter((card) => card.type === type).map((card) => card.id));
    return (context.fallbackCardsByType[type] ?? []).filter((card) => assignedIds.has(card.id) && !ownedIds.has(card.id)).map((card) => this.toAssetDetailDto(this.assignedFallbackAssetSnapshot(context.subEvent.id, card)));
  }
  assignedFallbackAssetSnapshot(subEventId, card, options = {}) {
    const nextCard = this.cloneAsset(card);
    if (options.clearRequests) {
      return __spreadProps(__spreadValues({}, nextCard), {
        requests: []
      });
    }
    return __spreadProps(__spreadValues({}, nextCard), {
      requests: nextCard.requests.filter((request) => this.isSubEventScopedAssetRequest(request, subEventId))
    });
  }
  applyGroupScopedAssetSnapshot(subEvent, type, group) {
    const scopedPending = Number.isFinite(Number(group.pending)) ? Math.max(0, Math.trunc(Number(group.pending))) : void 0;
    const scopedMin = Number.isFinite(Number(group.capacityMin)) ? Math.max(0, Math.trunc(Number(group.capacityMin))) : void 0;
    const scopedMax = Number.isFinite(Number(group.capacityMax)) ? Math.max(0, Math.trunc(Number(group.capacityMax))) : void 0;
    if (type === ASSET_TYPE_TRANSPORT) {
      return __spreadProps(__spreadValues({}, subEvent), {
        carsPending: scopedPending ?? subEvent.carsPending,
        carsCapacityMin: scopedMin ?? subEvent.carsCapacityMin,
        carsCapacityMax: scopedMax ?? subEvent.carsCapacityMax
      });
    }
    if (type === ASSET_TYPE_ACCOMMODATION) {
      return __spreadProps(__spreadValues({}, subEvent), {
        accommodationPending: scopedPending ?? subEvent.accommodationPending,
        accommodationCapacityMin: scopedMin ?? subEvent.accommodationCapacityMin,
        accommodationCapacityMax: scopedMax ?? subEvent.accommodationCapacityMax
      });
    }
    return __spreadProps(__spreadValues({}, subEvent), {
      suppliesPending: scopedPending ?? subEvent.suppliesPending,
      suppliesCapacityMin: scopedMin ?? subEvent.suppliesCapacityMin,
      suppliesCapacityMax: scopedMax ?? subEvent.suppliesCapacityMax
    });
  }
  assetPendingCount(card, subEventId, managerUserId = null) {
    const requests = subEventId ? this.assetRequestsForView(card, subEventId, managerUserId) : card.requests;
    return requests.filter((request) => request.status === "pending").length;
  }
  assetAcceptedCount(card, subEventId, managerUserId = null) {
    const requests = subEventId ? this.assetRequestsForView(card, subEventId, managerUserId) : card.requests;
    return requests.filter((request) => request.status === "accepted").length;
  }
  subEventSupplyContributionEntries(subEventId, cardId) {
    return this.resourcePopupStore.supplyContributionEntriesByAssignmentKey[ActivityResourceBuilder.subEventSupplyAssignmentKey(subEventId, cardId)] ?? [];
  }
  subEventSupplyProvidedCount(cardId, subEventId) {
    return this.subEventSupplyContributionEntries(subEventId, cardId).reduce((sum, entry) => sum + AppUtils.clampNumber(Math.trunc(entry.quantity), 0, Number.MAX_SAFE_INTEGER), 0);
  }
  subEventDisplayName(subEvent) {
    return `${subEvent?.name ?? ""}`.trim();
  }
  subEventStageLabel(subEvent) {
    const name = this.subEventDisplayName(subEvent);
    return name || "Sub Event";
  }
  isAbortError(error) {
    return !!error && typeof error === "object" && "name" in error && error.name === "AbortError";
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
  static \u0275fac = function EventResourcePopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EventResourcePopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EventResourcePopupComponent, selectors: [["app-event-resource-popup"]], hostBindings: function EventResourcePopupComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("keydown.escape", function EventResourcePopupComponent_keydown_escape_HostBindingHandler($event) {
        return ctx.onEscapePressed($event);
      }, \u0275\u0275resolveWindow);
    }
  }, inputs: { parentZIndex: "parentZIndex" }, decls: 2, vars: 2, consts: [[1, "event-resource-popup-shell", 3, "event-resource-popup-shell--standalone-asset-view", "event-resource-popup-shell--asset-explore-view", "model", "zIndex"], [1, "event-resource-popup-shell", 3, "model", "zIndex"], [1, "experience-popup", "assets-popup", "subevent-assets-popup"], [3, "model"], [3, "filterSelected", "assignRequested", "exploreRequested", "mapRequested", "badgeDetailsRequested", "cardActionRequested", "model"], [4, "ngComponentOutlet", "ngComponentOutletInputs"]], template: function EventResourcePopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, EventResourcePopupComponent_Conditional_0_Template, 4, 8, "app-popup", 0);
      \u0275\u0275conditionalCreate(1, EventResourcePopupComponent_Conditional_1_Template, 1, 2, "ng-container");
    }
    if (rf & 2) {
      let tmp_1_0;
      \u0275\u0275conditional(!ctx.resourcePopupStore.assetExploreOnlyRef() || ctx.resourceAssetView() ? 0 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_1_0 = ctx.activitiesStore.eventMembersPopupComponent()) ? 1 : -1, tmp_1_0);
    }
  }, dependencies: [
    CommonModule,
    NgComponentOutlet,
    FormsModule,
    PopupComponent,
    EventResourceListComponent
  ], styles: ['\n[_nghost-%COMP%] {\n  display: contents;\n  --line: rgba(23, 33, 54, 0.12);\n  --line-strong: rgba(23, 33, 54, 0.2);\n  --text-main: #22324a;\n  --text-muted: rgba(23, 41, 66, 0.72);\n}\n.app-popup[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 2300;\n  display: flex;\n  align-items: flex-start;\n  justify-content: center;\n  padding: 1rem;\n}\n.app-popup-backdrop[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  background: #e9edf5;\n}\n.app-popup-panel[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  width: min(1080px, 100vw - 1.2rem);\n  max-height: calc(100vh - 1.2rem);\n  max-height: calc(100dvh - 1.2rem);\n  border-radius: 14px;\n  background: #fff;\n  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.26);\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n}\n.app-popup-panel.popup-panel-wide[_ngcontent-%COMP%] {\n  width: min(1080px, 100vw - 1.2rem);\n}\n.app-popup-panel.popup-panel-full-height[_ngcontent-%COMP%] {\n  height: calc(100vh - 1.2rem);\n  height: calc(100dvh - 1.2rem);\n  max-height: calc(100vh - 1.2rem);\n  max-height: calc(100dvh - 1.2rem);\n}\n.app-popup-panel.popup-panel-image-editor[_ngcontent-%COMP%] {\n  height: calc(100vh - 1.2rem);\n  height: calc(100dvh - 1.2rem);\n}\n.app-popup-panel.popup-panel-profile-editor[_ngcontent-%COMP%] {\n  width: min(1080px, 100vw - 1.2rem);\n  height: calc(100vh - 1.2rem);\n  height: calc(100dvh - 1.2rem);\n}\n.app-popup-panel.popup-panel-profile-selector[_ngcontent-%COMP%] {\n  width: min(1080px, 100vw - 1.2rem);\n  height: calc(100vh - 1.2rem);\n  height: calc(100dvh - 1.2rem);\n}\n.popup-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 0.4rem;\n  padding: 0.58rem 0.4rem;\n  border-bottom: 1px solid var(--line);\n  position: relative;\n}\n.popup-header[_ngcontent-%COMP%]    > .popup-title[_ngcontent-%COMP%] {\n  min-width: 0;\n  flex: 1 1 auto;\n}\n.popup-header.popup-header-with-back[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n}\n.popup-title[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.05rem;\n  color: var(--text-main);\n  font-weight: 700;\n}\n.popup-subtitle[_ngcontent-%COMP%], \n.popup-subtitle-activities[_ngcontent-%COMP%] {\n  margin: 0.14rem 0 0;\n  font-size: 0.74rem;\n  font-weight: 700;\n  color: rgba(21, 39, 62, 0.72);\n}\n.popup-subtitle-secondary[_ngcontent-%COMP%], \n.popup-subtitle-activities-secondary[_ngcontent-%COMP%] {\n  margin-top: 0.04rem;\n  font-size: 0.68rem;\n  font-weight: 800;\n  letter-spacing: 0.01em;\n  color: rgba(21, 39, 62, 0.58);\n}\n.popup-body[_ngcontent-%COMP%] {\n  padding: 0.4rem;\n  overflow-y: auto;\n  overflow-x: hidden;\n  display: flex;\n  flex-direction: column;\n  gap: 0.72rem;\n  flex: 1 1 auto;\n  min-height: 0;\n}\n.popup-body.popup-body-experience[_ngcontent-%COMP%] {\n  position: relative;\n  padding-bottom: 0.74rem;\n}\n.popup-close[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  width: 34px;\n  height: 34px;\n  min-width: 34px;\n  min-height: 34px;\n  border: 1px solid rgba(47, 86, 139, 0.2);\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.92);\n  color: rgba(38, 67, 105, 0.92);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  padding: 0;\n  line-height: 0;\n  box-sizing: border-box;\n  box-shadow: 0 8px 18px rgba(37, 62, 95, 0.12);\n  --mdc-icon-button-state-layer-size: 34px;\n}\n.popup-close[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 21px;\n  height: 21px;\n  font-size: 21px;\n  line-height: 21px;\n  margin: 0;\n}\n.popup-close[_ngcontent-%COMP%]:not(:disabled):not([aria-disabled=true]):hover {\n  border-color: rgba(47, 86, 139, 0.32);\n  background: #fff;\n  color: rgba(24, 50, 84, 0.98);\n}\n.popup-close[_ngcontent-%COMP%]:not(:disabled):not([aria-disabled=true]):active {\n  background: rgba(239, 245, 252, 0.96);\n}\n.popup-close[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid rgba(61, 108, 186, 0.35);\n  outline-offset: 1px;\n}\n.popup-close[_ngcontent-%COMP%]:disabled, \n.popup-close[aria-disabled=true][_ngcontent-%COMP%] {\n  opacity: 0.56;\n  cursor: default;\n}\n.popup-header-with-progress[_ngcontent-%COMP%], \n.popup-header-with-activities-progress[_ngcontent-%COMP%] {\n  border-bottom-color: rgba(46, 114, 184, 0.2);\n}\n.popup-surface-overlay[_ngcontent-%COMP%], \n.experience-form-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 15;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0.9rem;\n}\n.popup-surface-overlay-backdrop[_ngcontent-%COMP%], \n.experience-form-overlay-backdrop[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  background: rgba(8, 16, 30, 0.76);\n}\n.popup-surface[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  width: min(860px, 100vw - 2rem);\n  max-height: calc(100vh - 1.8rem);\n  overflow: hidden;\n  border-radius: 16px;\n  background: #fff;\n  box-sizing: border-box;\n  border: 1px solid rgba(42, 66, 102, 0.28);\n  box-shadow: 0 24px 60px rgba(14, 32, 58, 0.26);\n  display: flex;\n  flex-direction: column;\n  contain: layout paint;\n}\n.popup-surface-header[_ngcontent-%COMP%], \n.experience-form-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.6rem;\n  padding: 0.82rem 1rem;\n  border-bottom: 1px solid var(--line);\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #f4f8ff 100%);\n}\n.popup-surface-header-title[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: inline-flex;\n  flex-direction: column;\n  gap: 0.08rem;\n}\n.popup-surface-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%], \n.experience-form-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.12rem;\n  color: var(--text-main);\n  font-weight: 700;\n}\n.popup-surface-header-title[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.78rem;\n  color: rgba(53, 79, 114, 0.86);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.popup-surface-header-controls[_ngcontent-%COMP%], \n.experience-form-header-controls[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.44rem;\n}\n.popup-header-add-btn[_ngcontent-%COMP%] {\n  width: 30px;\n  height: 30px;\n  border: 1px solid rgba(30, 88, 152, 0.46);\n  border-radius: 50%;\n  background:\n    linear-gradient(\n      180deg,\n      #e2f0ff 0%,\n      #c5dbf8 100%);\n  color: #15457c;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  box-shadow: 0 2px 8px rgba(31, 79, 132, 0.18);\n}\n.popup-header-add-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  pointer-events: none;\n}\n.popup-header-add-btn[_ngcontent-%COMP%]:hover {\n  background:\n    linear-gradient(\n      180deg,\n      #d4e8ff 0%,\n      #b5d1f3 100%);\n  border-color: rgba(27, 74, 130, 0.6);\n  color: #103966;\n  box-shadow: 0 4px 10px rgba(28, 69, 114, 0.24);\n}\n.popup-header-add-btn[_ngcontent-%COMP%]:active:not(:disabled) {\n  box-shadow: 0 1px 4px rgba(36, 74, 121, 0.2);\n}\n.popup-header-add-btn.subevent-leaderboard-save-btn[_ngcontent-%COMP%] {\n  border-color: rgba(46, 121, 69, 0.46);\n  background:\n    linear-gradient(\n      180deg,\n      #e6faec 0%,\n      #c9f0d5 100%);\n  color: #1f6f39;\n}\n.popup-header-add-btn.subevent-leaderboard-save-btn[_ngcontent-%COMP%]:hover {\n  border-color: rgba(38, 98, 58, 0.64);\n  background:\n    linear-gradient(\n      180deg,\n      #d8f5e2 0%,\n      #b8e8c8 100%);\n  color: #175a2d;\n}\n.popup-header-add-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.54;\n  cursor: not-allowed;\n  box-shadow: 0 2px 8px rgba(31, 79, 132, 0.12);\n}\n.popup-header-add-btn.form-save-invalid[_ngcontent-%COMP%], \n.popup-header-add-btn.form-save-invalid[_ngcontent-%COMP%]:disabled {\n  border-color: rgba(147, 31, 31, 0.86);\n  background:\n    linear-gradient(\n      180deg,\n      #ef5c5c 0%,\n      #cb2f2f 100%);\n  color: #fff;\n  opacity: 1;\n  box-shadow: 0 2px 8px rgba(122, 25, 25, 0.22);\n}\n.popup-surface-close-btn[_ngcontent-%COMP%], \n.experience-form-close-btn[_ngcontent-%COMP%] {\n  width: 34px;\n  height: 34px;\n  border: 0;\n  border-radius: 50%;\n  background: transparent;\n  color: rgba(42, 57, 77, 0.88);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  padding: 0;\n}\n.popup-surface-close-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.experience-form-close-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  pointer-events: none;\n}\n.popup-surface-close-btn[_ngcontent-%COMP%]:not(:disabled):not([aria-disabled=true]):hover, \n.experience-form-close-btn[_ngcontent-%COMP%]:not(:disabled):not([aria-disabled=true]):hover {\n  background: rgba(110, 124, 145, 0.18);\n  color: rgba(28, 40, 57, 0.94);\n}\n.popup-surface-close-btn[_ngcontent-%COMP%]:not(:disabled):not([aria-disabled=true]):active, \n.experience-form-close-btn[_ngcontent-%COMP%]:not(:disabled):not([aria-disabled=true]):active {\n  background: rgba(96, 111, 134, 0.24);\n}\n.popup-surface-body[_ngcontent-%COMP%], \n.experience-form-panel[_ngcontent-%COMP%] {\n  border: 1px solid rgba(43, 71, 107, 0.2);\n  border-radius: 14px;\n  background: #f8fbff;\n  padding: 0.74rem;\n  display: grid;\n  gap: 0.78rem;\n  margin: 0;\n  box-sizing: border-box;\n  flex: 1 1 auto;\n  min-height: 0;\n  align-items: start;\n  align-content: start;\n  overflow-y: auto;\n  overflow-x: hidden;\n  -webkit-overflow-scrolling: touch;\n  scrollbar-gutter: stable;\n}\n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 2800;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 1rem;\n}\n.mobile-profile-selector-backdrop[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  background: rgba(8, 16, 30, 0.5);\n}\n.mobile-profile-selector-sheet[_ngcontent-%COMP%] {\n  position: relative;\n  width: fit-content;\n  min-width: 230px;\n  max-width: min(92vw, 420px);\n  max-height: min(78vh, 620px);\n  border-radius: 16px;\n  border: 1px solid #d6deea;\n  background: #fff;\n  box-shadow: 0 16px 32px rgba(15, 29, 52, 0.24);\n  padding: 0.4rem 0.6rem 0.58rem;\n  display: flex;\n  flex-direction: column;\n}\n.mobile-profile-selector-sheet.mobile-profile-selector-sheet-language[_ngcontent-%COMP%] {\n  width: min(94vw, 620px);\n  min-width: 340px;\n  max-width: min(94vw, 620px);\n  height: min(78vh, 620px);\n  max-height: min(78vh, 620px);\n}\n.mobile-profile-selector-sheet.mobile-profile-selector-sheet-language[_ngcontent-%COMP%]   .mobile-profile-selector-title[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet.mobile-profile-selector-sheet-language[_ngcontent-%COMP%]   .mobile-profile-language-entry[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  width: 100%;\n}\n.mobile-profile-selector-sheet.mobile-profile-selector-sheet-language[_ngcontent-%COMP%]   .mobile-profile-language-chips[_ngcontent-%COMP%] {\n  width: 100%;\n  align-content: flex-start;\n}\n.mobile-profile-selector-sheet.mobile-profile-selector-sheet-language[_ngcontent-%COMP%]   .mobile-profile-selector-options[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  overflow-x: hidden;\n  overflow-y: auto;\n  margin-top: 0.18rem;\n  justify-items: stretch;\n  align-content: start;\n  grid-auto-rows: max-content;\n}\n.mobile-profile-selector-sheet.mobile-profile-selector-sheet-language[_ngcontent-%COMP%]   .mobile-profile-selector-option[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  min-height: 46px;\n}\n.mobile-profile-selector-handle[_ngcontent-%COMP%] {\n  width: 42px;\n  height: 4px;\n  border-radius: 999px;\n  background: rgba(44, 67, 100, 0.24);\n  margin: 0.08rem auto 0.52rem;\n}\n.mobile-profile-selector-title[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  padding: 0 0.14rem;\n  color: #1c3354;\n  font-size: 0.94rem;\n  font-weight: 800;\n  position: relative;\n}\n.mobile-profile-selector-close-btn[_ngcontent-%COMP%] {\n  margin-left: auto;\n  width: 34px;\n  height: 34px;\n  border: 0;\n  border-radius: 50%;\n  background: transparent;\n  color: rgba(42, 57, 77, 0.88);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  cursor: pointer;\n}\n.mobile-profile-selector-close-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.mobile-profile-selector-close-btn[_ngcontent-%COMP%]:not(:disabled):not([aria-disabled=true]):hover {\n  background: rgba(110, 124, 145, 0.18);\n  color: rgba(28, 40, 57, 0.94);\n}\n.mobile-profile-selector-close-btn[_ngcontent-%COMP%]:not(:disabled):not([aria-disabled=true]):active {\n  background: rgba(96, 111, 134, 0.24);\n}\n.mobile-profile-selector-options[_ngcontent-%COMP%] {\n  margin-top: 0.42rem;\n  display: grid;\n  gap: 0.32rem;\n  justify-items: center;\n  max-height: min(64vh, 520px);\n  overflow: auto;\n  overscroll-behavior: contain;\n}\n.mobile-profile-selector-option[_ngcontent-%COMP%] {\n  width: max-content;\n  min-width: 220px;\n  max-width: 100%;\n  border: 1px solid rgba(58, 81, 114, 0.24);\n  border-radius: 12px;\n  background: #f7f9fd;\n  color: #1f3f67;\n  min-height: 42px;\n  padding: 0.46rem 0.62rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: space-between;\n}\n.mobile-profile-selector-option-main[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n  min-width: 0;\n  text-align: left;\n}\n.mobile-profile-selector-option.active[_ngcontent-%COMP%] {\n  box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.24);\n  filter: brightness(0.95);\n}\n@media (max-width: 760px) {\n  .app-popup[_ngcontent-%COMP%] {\n    padding: 0;\n    align-items: stretch;\n  }\n  .app-popup-panel[_ngcontent-%COMP%], \n   .app-popup-panel.popup-panel-profile-editor[_ngcontent-%COMP%], \n   .app-popup-panel.popup-panel-profile-selector[_ngcontent-%COMP%], \n   .app-popup-panel.popup-panel-image-editor[_ngcontent-%COMP%] {\n    width: 100vw !important;\n    max-width: 100vw !important;\n    height: 100vh !important;\n    height: 100dvh !important;\n    max-height: 100vh !important;\n    max-height: 100dvh !important;\n    min-height: 100dvh;\n    margin: 0 !important;\n    border-radius: 0;\n    box-shadow: none;\n  }\n  .experience-form-overlay[_ngcontent-%COMP%] {\n    padding: 0;\n    align-items: stretch;\n    justify-content: stretch;\n  }\n  .experience-form-popup[_ngcontent-%COMP%] {\n    width: 100vw;\n    max-width: 100vw;\n    height: 100svh;\n    height: 100vh;\n    height: 100dvh;\n    max-height: 100svh;\n    max-height: 100vh;\n    max-height: 100dvh;\n    border-radius: 0;\n  }\n  .experience-form-panel[_ngcontent-%COMP%] {\n    min-height: 0;\n    flex: 1 1 auto;\n    border-radius: 0;\n  }\n  .app-popup-panel.popup-panel-profile-editor[_ngcontent-%COMP%]   .popup-body[_ngcontent-%COMP%] {\n    display: flex !important;\n    flex-direction: column;\n    min-height: 0;\n    height: 100%;\n    overflow: hidden !important;\n    overflow-x: hidden !important;\n    padding-bottom: 0;\n  }\n  .app-popup-panel.popup-panel-profile-editor[_ngcontent-%COMP%]   .profile-editor-wrap[_ngcontent-%COMP%] {\n    display: grid;\n    grid-template-rows: auto minmax(0, 1fr);\n    min-height: 0;\n    height: 100%;\n    overflow: hidden;\n  }\n  .app-popup-panel.popup-panel-profile-editor[_ngcontent-%COMP%]   .profile-editor-scroll-area[_ngcontent-%COMP%] {\n    flex: 1 1 auto;\n    min-height: 0;\n    max-height: none;\n    overflow-y: auto !important;\n    overflow-x: hidden !important;\n    padding-bottom: calc(0.74rem + env(safe-area-inset-bottom));\n    scroll-padding-bottom: calc(0.74rem + env(safe-area-inset-bottom));\n    overscroll-behavior: contain;\n    -webkit-overflow-scrolling: touch;\n  }\n  .popup-surface-overlay[_ngcontent-%COMP%], \n   .experience-form-overlay[_ngcontent-%COMP%] {\n    padding: 0;\n    align-items: stretch;\n    justify-content: stretch;\n  }\n  .popup-surface[_ngcontent-%COMP%], \n   .experience-form-popup[_ngcontent-%COMP%] {\n    width: 100%;\n    max-width: 100%;\n    min-width: 0;\n    height: 100dvh;\n    max-height: 100dvh;\n    border-radius: 0;\n  }\n  .popup-surface-body[_ngcontent-%COMP%], \n   .experience-form-panel[_ngcontent-%COMP%] {\n    min-height: 0;\n    flex: 1 1 auto;\n    border-radius: 0;\n  }\n  .mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%] {\n    display: block;\n    padding: 0;\n  }\n  .mobile-profile-selector-sheet[_ngcontent-%COMP%] {\n    position: absolute;\n    left: 0.65rem;\n    right: 0.65rem;\n    bottom: 0;\n    width: auto;\n    box-sizing: border-box;\n    min-width: 0;\n    max-width: 100vw;\n    max-height: calc(100dvh - 0.4rem);\n    border-radius: 16px 16px 0 0;\n    border-bottom: 0;\n    box-shadow: 0 -16px 32px rgba(15, 29, 52, 0.24);\n    padding: 0.4rem 0.6rem max(0.58rem, env(safe-area-inset-bottom));\n  }\n  .mobile-profile-selector-sheet.mobile-profile-selector-sheet-language[_ngcontent-%COMP%] {\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    width: 100vw;\n    max-width: 100vw;\n    height: var(--mobile-language-sheet-height, 100svh);\n    max-height: var(--mobile-language-sheet-height, 100svh);\n    border-radius: 0;\n    padding: max(0.4rem, env(safe-area-inset-top)) 0.6rem max(0.58rem, env(safe-area-inset-bottom));\n    display: flex;\n    flex-direction: column;\n  }\n  .mobile-profile-selector-options[_ngcontent-%COMP%] {\n    justify-items: stretch;\n    max-height: none;\n    flex: 1 1 auto;\n  }\n  .mobile-profile-selector-option[_ngcontent-%COMP%] {\n    width: 100%;\n    min-width: 0;\n  }\n  .app-popup-panel.popup-panel-image-editor[_ngcontent-%COMP%] {\n    height: 100vh !important;\n    height: 100dvh !important;\n  }\n  .popup-body.popup-body-image-editor[_ngcontent-%COMP%] {\n    height: calc(100vh - 58px);\n    height: calc(100dvh - 58px);\n    padding: 0.45rem;\n  }\n}\n[_nghost-%COMP%] {\n  --interactive-motion-duration: 160ms;\n  --interactive-motion-ease: cubic-bezier(0.22, 1, 0.36, 1);\n  --interactive-hover-lift: -1px;\n  --interactive-hover-scale: 1.01;\n  --interactive-hover-brightness: 1.01;\n  --interactive-press-scale: 0.97;\n  --interactive-press-brightness: 0.97;\n}\n[_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]) {\n  -webkit-tap-highlight-color: transparent;\n  transition:\n    transform var(--interactive-motion-duration) var(--interactive-motion-ease),\n    filter var(--interactive-motion-duration) var(--interactive-motion-ease),\n    box-shadow var(--interactive-motion-duration) var(--interactive-motion-ease),\n    background-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    border-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    color var(--interactive-motion-duration) var(--interactive-motion-ease);\n  transform-origin: center;\n}\n[_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):focus-visible {\n  outline: 2px solid rgba(66, 110, 182, 0.44);\n  outline-offset: 2px;\n}\n@media (hover: hover) and (pointer: fine) {\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):hover {\n    transform: translateY(var(--interactive-hover-lift)) scale(var(--interactive-hover-scale));\n    filter: brightness(var(--interactive-hover-brightness));\n  }\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  [_ngcontent-%COMP%]:where(.motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):hover {\n    box-shadow: 0 3px 10px rgba(16, 29, 48, 0.14);\n  }\n}\n@keyframes _ngcontent-%COMP%_shared-mobile-touch-feedback {\n  0% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n  45% {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  100% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n}\n@media (hover: none), (pointer: coarse) {\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    animation: _ngcontent-%COMP%_shared-mobile-touch-feedback 0.2s ease;\n  }\n}\n.app-popup[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%] {\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.app-popup[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%] {\n  font-family: inherit;\n}\n.popup-filter-picker[_ngcontent-%COMP%], \n.activities-view-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 60;\n  margin-left: auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-filter-picker-secondary[_ngcontent-%COMP%], \n.activities-secondary-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 61;\n}\n.selector-like[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%] {\n  width: fit-content !important;\n  min-width: 0 !important;\n  max-width: 100%;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: auto !important;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%] {\n  width: auto !important;\n  flex: 0 1 auto;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: auto !important;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%] {\n  margin-left: 0.28rem;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%] {\n  min-width: 174px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  border: 1px solid #c8d3e2;\n  border-radius: 999px;\n  box-shadow: 0 2px 6px rgba(38, 60, 92, 0.08);\n  padding: 0.12rem 0.5rem 0.12rem 0.84rem;\n  background: #f8f9fb;\n}\n.profile-status-select-wrap.selector-like[_ngcontent-%COMP%] {\n  min-height: 36px;\n}\n.status-option-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.2rem;\n  text-transform: lowercase;\n  width: 100%;\n  min-width: 0;\n}\n.status-option-content[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child {\n  white-space: nowrap;\n}\n.status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  flex: 0 0 16px;\n}\n.rate-filter-count-badge[_ngcontent-%COMP%] {\n  margin-left: auto;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  border: 1px solid #fff;\n  background: #d84d4d;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  font-size: 0.68rem;\n  font-weight: 800;\n  line-height: 1;\n  box-shadow: 0 2px 8px rgba(120, 24, 24, 0.22);\n}\n.rate-filter-trigger-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  margin-left: 0;\n  z-index: 2;\n}\n.popup-filter-control[_ngcontent-%COMP%], \n.activities-rate-filter-select[_ngcontent-%COMP%], \n.activities-primary-filter-select[_ngcontent-%COMP%], \n.activities-event-scope-filter-select[_ngcontent-%COMP%], \n.activities-chat-context-filter-select[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: visible;\n}\n.popup-filter-panel[_ngcontent-%COMP%], \n.activities-view-picker-panel[_ngcontent-%COMP%] {\n  position: absolute;\n  top: calc(100% + 0.32rem);\n  right: 0;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 10px;\n  background: #fff;\n  box-shadow: 0 10px 24px rgba(17, 29, 48, 0.22);\n  padding: 0.24rem;\n  min-width: 128px;\n  z-index: 40;\n  display: grid;\n  gap: 0.16rem;\n}\n.popup-filter-option[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%] {\n  border: 0;\n  background: #fff;\n  border-radius: 8px;\n  min-height: 32px;\n  padding: 0.34rem 0.44rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.34rem;\n  color: #1e3658;\n  cursor: pointer;\n  text-align: left;\n}\n.popup-filter-option[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-filter-option[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.popup-filter-option[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:not(.rate-filter-count-badge), \n.activities-view-option[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:not(.rate-filter-count-badge) {\n  flex: 1 1 auto;\n  min-width: 0;\n  text-align: left;\n}\n.popup-mobile-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-primary-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-event-scope-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-chat-context-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-rate-filter-picker[_ngcontent-%COMP%] {\n  position: relative;\n}\n.popup-mobile-filter-panel[_ngcontent-%COMP%], \n.activities-mobile-filter-panel[_ngcontent-%COMP%], \n.activities-mobile-rate-filter-panel[_ngcontent-%COMP%] {\n  top: calc(100% + 0.24rem);\n  right: 0;\n  min-width: 210px;\n  z-index: 65;\n}\n.popup-mobile-sheet-title[_ngcontent-%COMP%], \n.activities-mobile-sheet-title[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  padding: 0 0.14rem;\n  color: #1c3354;\n  font-size: 0.94rem;\n  font-weight: 800;\n}\n.popup-mobile-sheet-title[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.activities-mobile-sheet-title[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n:is(.popup-filter-bar[_ngcontent-%COMP%], .experience-toolbar[_ngcontent-%COMP%], .assets-toolbar[_ngcontent-%COMP%])   .popup-view-fab[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child, \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%] {\n  font-weight: 400 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option .status-option-content {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  width: 100%;\n  min-width: 0;\n  column-gap: 0.34rem;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option .rate-filter-count-badge {\n  margin-left: 0;\n  justify-self: end;\n}\n[_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.selector-options-panel), \n[_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.status-options-panel) {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n@media (max-width: 760px) {\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%] {\n    width: 100%;\n    min-width: 0;\n    box-sizing: border-box;\n    border: 1px solid rgba(58, 81, 114, 0.24);\n    border-radius: 12px;\n    background: #f7f9fd;\n    min-height: 42px;\n    padding: 0.46rem 0.62rem;\n    justify-content: flex-start;\n    gap: 0.36rem;\n  }\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%] {\n    box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.24);\n    filter: brightness(0.95);\n  }\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%] {\n    margin-left: auto;\n    flex: 0 0 auto;\n  }\n  [_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.profile-bottom-sheet-panel) {\n    position: fixed !important;\n    left: 0 !important;\n    right: 0 !important;\n    bottom: 0 !important;\n    top: auto !important;\n    width: 100vw !important;\n    max-width: 100vw !important;\n    transform: none !important;\n  }\n  [_nghost-%COMP%]     .mat-mdc-select-panel.profile-bottom-sheet-panel {\n    width: 100vw !important;\n    max-width: 100vw !important;\n    max-height: min(54vh, 420px) !important;\n    margin: 0 !important;\n    border-radius: 16px 16px 0 0 !important;\n    border: 1px solid #d6deea;\n    border-bottom: 0;\n    box-shadow: 0 -14px 28px rgba(15, 29, 52, 0.24);\n    padding-top: 0.38rem;\n    padding-bottom: max(0.55rem, env(safe-area-inset-bottom));\n  }\n}\n.popup-view-fab[_ngcontent-%COMP%] {\n  height: 34px;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 999px;\n  background: #f3f7ff;\n  color: #2c4c74;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0 0.62rem;\n  cursor: pointer;\n}\n.popup-view-fab[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-view-fab[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.74rem;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.event-visibility-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 22;\n  margin-left: auto;\n  flex: 0 0 auto;\n}\n.event-visibility-trigger[_ngcontent-%COMP%] {\n  flex-wrap: nowrap;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-public[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-public[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e6f6ef);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-friends[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-friends[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e8f1fd);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-host[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-host[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6efe2);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-inactive[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-inactive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f2f3f5);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-public[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-public[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-friends[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-friends[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-host[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-host[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-inactive[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-inactive[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.48rem 0.56rem;\n  font: inherit;\n  color: var(--text-main);\n  background: #fff;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  resize: vertical;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n  outline: 0;\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n}\n.popup-surface-form-grid[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  max-width: none;\n  width: 100%;\n  margin: 0;\n  justify-content: stretch;\n  align-content: start;\n  align-items: start;\n  column-gap: 1rem;\n  row-gap: 0.9rem;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-rows: min-content;\n  gap: 0;\n  font-weight: 600;\n  color: rgba(26, 44, 69, 0.88);\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  min-height: 40px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  min-height: 96px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   .profile-status-select-wrap.selector-like[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   .profile-status-select-wrap.selector-like[_ngcontent-%COMP%] {\n  min-height: 40px;\n  height: 40px;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  min-height: 32px;\n}\n.popup-surface-description-field[_ngcontent-%COMP%], \n.experience-description-field[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.popup-surface-actions[_ngcontent-%COMP%], \n.experience-form-actions[_ngcontent-%COMP%] {\n  justify-content: center;\n  padding-top: 0.2rem;\n}\n.popup-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.link-btn[_ngcontent-%COMP%] {\n  border: 1px solid var(--line-strong);\n  border-radius: 999px;\n  background: #fff;\n  color: #1f3350;\n  font: inherit;\n  font-size: 0.83rem;\n  padding: 0.38rem 0.76rem;\n  cursor: pointer;\n}\n.neutral-btn[_ngcontent-%COMP%] {\n  background: #f2f4fa;\n  border-color: rgba(23, 33, 54, 0.12);\n}\n.primary-btn[_ngcontent-%COMP%] {\n  background: #4776b7;\n  border-color: #4776b7;\n  color: #fff;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.date-picker-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: #566b86;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  min-width: 80px;\n  width: 100%;\n  font-size: 0.8rem;\n  font-weight: 700;\n  text-transform: lowercase;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-content: flex-start;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%] {\n  margin-left: auto;\n}\n.status-public[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.status-friends[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.status-host[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.status-inactive[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-public[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-friends[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-host[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-inactive[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.profile-status-select-wrap.status-public[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.profile-status-select-wrap.status-friends[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.profile-status-select-wrap.status-host[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.profile-status-select-wrap.status-inactive[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.profile-details-values-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: rgba(44, 67, 100, 0.72);\n}\n.profile-details-values-btn[_ngcontent-%COMP%] {\n  min-height: 36px;\n  height: 36px;\n  box-sizing: border-box;\n  padding-top: 0;\n  padding-bottom: 0;\n}\n.profile-details-values-btn[_ngcontent-%COMP%]   .status-option-content.profile-details-selected-badges[_ngcontent-%COMP%] {\n  display: inline-grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  column-gap: 0.26rem;\n  min-width: 0;\n  width: 100%;\n}\n.profile-details-values-btn.profile-details-values-tone-values[_ngcontent-%COMP%]   .profile-details-inline-chip[_ngcontent-%COMP%] {\n  max-width: calc(100% - 2.6rem);\n}\n.profile-details-values-btn.profile-details-values-tone-interest[_ngcontent-%COMP%]   .profile-details-inline-chip[_ngcontent-%COMP%] {\n  max-width: calc((100% - 3.2rem) / 2);\n}\n.profile-details-values-btn.profile-details-values-tone-values[_ngcontent-%COMP%]   .profile-details-inline-overflow[_ngcontent-%COMP%] {\n  color: #1e6b5a;\n}\n.profile-details-values-btn.profile-details-values-tone-interest[_ngcontent-%COMP%]   .profile-details-inline-overflow[_ngcontent-%COMP%] {\n  color: #2e5a90;\n}\n.values-header-chips[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.28rem;\n  flex: 0 0 100%;\n  margin-left: 0;\n  margin-top: 0.34rem;\n  max-width: 100%;\n  overflow: visible;\n  white-space: normal;\n  padding-bottom: 0;\n}\n.popup-title-values[_ngcontent-%COMP%] {\n  margin-right: 0.38rem;\n}\n.values-selected-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(76, 99, 136, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9ff 0%,\n      #eef3ff 100%);\n  color: #24416a;\n  border-radius: 999px;\n  min-height: 26px;\n  padding: 0.18rem 0.46rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-size: 0.7rem;\n  font-weight: 700;\n  cursor: pointer;\n  flex: 0 0 auto;\n}\n.values-selected-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.values-selected-chip.section-family[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1ea 0%,\n      #ffe6dd 100%);\n  border-color: rgba(160, 90, 51, 0.32);\n  color: #8b4d2b;\n}\n.values-selected-chip.section-ambition[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff7e8 0%,\n      #ffefd7 100%);\n  border-color: rgba(160, 106, 20, 0.32);\n  color: #9a6614;\n}\n.values-selected-chip.section-lifestyle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f5 0%,\n      #e0f2ee 100%);\n  border-color: rgba(45, 125, 120, 0.32);\n  color: #2a6e6a;\n}\n.values-selected-chip.section-beliefs[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f0ecff 0%,\n      #e8e1fa 100%);\n  border-color: rgba(95, 78, 160, 0.32);\n  color: #564793;\n}\n.values-selected-chip.section-social[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n  color: #2d5ea8;\n}\n.values-selected-chip.section-arts[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2edfb 0%,\n      #e9e2f9 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n  color: #654ca1;\n}\n.values-selected-chip.section-food[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4e8 0%,\n      #fee9d6 100%);\n  border-color: rgba(170, 97, 28, 0.32);\n  color: #9d611c;\n}\n.values-selected-chip.section-active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.values-selected-chip.section-mind[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f6 0%,\n      #def1ee 100%);\n  border-color: rgba(37, 124, 118, 0.32);\n  color: #2d7d78;\n}\n.values-selected-chip.section-identity[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n  border-color: rgba(88, 78, 159, 0.32);\n  color: #5a4ea0;\n}\n.readonly-select[_ngcontent-%COMP%] {\n  width: fit-content;\n  min-width: 0;\n  max-width: 130px;\n  justify-content: center;\n  margin-top: 2px;\n  padding-left: 0.44rem;\n  padding-right: 0.44rem;\n}\n.readonly-field[_ngcontent-%COMP%] {\n  min-height: 34px;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.4rem 0.56rem;\n  background: #f7fafe;\n  color: #23476f;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-weight: 700;\n}\n.readonly-field[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.zodiac-symbol[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  font-weight: 800;\n  line-height: 1;\n}\n.zodiac-label[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  font-weight: 700;\n  min-width: 0;\n  text-align: center;\n}\n.readonly-select.zodiac-aries[_ngcontent-%COMP%] {\n  background: #fdf1f1;\n  color: #9f2f2f;\n}\n.readonly-select.zodiac-taurus[_ngcontent-%COMP%] {\n  background: #f7f3eb;\n  color: #6e4b2b;\n}\n.readonly-select.zodiac-gemini[_ngcontent-%COMP%] {\n  background: #fdf8e9;\n  color: #7d5a12;\n}\n.readonly-select.zodiac-cancer[_ngcontent-%COMP%] {\n  background: #eef4ff;\n  color: #2d5b8e;\n}\n.readonly-select.zodiac-leo[_ngcontent-%COMP%] {\n  background: #fff3e8;\n  color: #8f4b0d;\n}\n.readonly-select.zodiac-virgo[_ngcontent-%COMP%] {\n  background: #edf8ef;\n  color: #2b6b3d;\n}\n.readonly-select.zodiac-libra[_ngcontent-%COMP%] {\n  background: #f2eefc;\n  color: #60439d;\n}\n.readonly-select.zodiac-scorpio[_ngcontent-%COMP%] {\n  background: #f9edf2;\n  color: #7b3150;\n}\n.readonly-select.zodiac-sagittarius[_ngcontent-%COMP%] {\n  background: #eef1ff;\n  color: #2f4a9a;\n}\n.readonly-select.zodiac-capricorn[_ngcontent-%COMP%] {\n  background: #eff2f5;\n  color: #364653;\n}\n.readonly-select.zodiac-aquarius[_ngcontent-%COMP%] {\n  background: #ebf7fb;\n  color: #1d5f7a;\n}\n.readonly-select.zodiac-pisces[_ngcontent-%COMP%] {\n  background: #eef2ff;\n  color: #294b8f;\n}\n.physique-slim[_ngcontent-%COMP%] {\n  color: #3f7ab3;\n}\n.physique-lean[_ngcontent-%COMP%] {\n  color: #3f8f5f;\n}\n.physique-athletic[_ngcontent-%COMP%] {\n  color: #2f7e4d;\n}\n.physique-fit[_ngcontent-%COMP%] {\n  color: #465fbb;\n}\n.physique-curvy[_ngcontent-%COMP%] {\n  color: #a14875;\n}\n.physique-muscular[_ngcontent-%COMP%] {\n  color: #7d4f24;\n}\n.physique-average[_ngcontent-%COMP%] {\n  color: #4d667f;\n}\n.physique-select-wrap.physique-slim[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf3fb 0%,\n      #dfebf8 100%);\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.physique-select-wrap.physique-lean[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf6ee 0%,\n      #def0e5 100%);\n  border-color: rgba(63, 143, 95, 0.34);\n}\n.physique-select-wrap.physique-athletic[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f5ec 0%,\n      #dff0e6 100%);\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.physique-select-wrap.physique-fit[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ebf0ff 0%,\n      #e1e8fc 100%);\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.physique-select-wrap.physique-curvy[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f7edf3 0%,\n      #f0e3ec 100%);\n  border-color: rgba(161, 72, 117, 0.36);\n}\n.physique-select-wrap.physique-muscular[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe9 0%,\n      #ede3d8 100%);\n  border-color: rgba(125, 79, 36, 0.36);\n}\n.physique-select-wrap.physique-average[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef2f6 0%,\n      #e5ebf1 100%);\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.physique-select-wrap.physique-slim[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #3f7ab3;\n}\n.physique-select-wrap.physique-lean[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #3f8f5f;\n}\n.physique-select-wrap.physique-athletic[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f7e4d;\n}\n.physique-select-wrap.physique-fit[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #465fbb;\n}\n.physique-select-wrap.physique-curvy[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #a14875;\n}\n.physique-select-wrap.physique-muscular[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #7d4f24;\n}\n.physique-select-wrap.physique-average[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #4d667f;\n}\n.experience-filter-all[_ngcontent-%COMP%] {\n  color: #694ea6;\n}\n.experience-filter-workspace[_ngcontent-%COMP%] {\n  color: #a1485a;\n}\n.experience-filter-school[_ngcontent-%COMP%] {\n  color: #2d5ea8;\n}\n.experience-filter-online[_ngcontent-%COMP%] {\n  color: #2d7d47;\n}\n.experience-filter-project[_ngcontent-%COMP%] {\n  color: #6550a0;\n}\n.experience-filter-select.experience-filter-all[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-project[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #efe8ff 0%,\n      #e8defc 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n}\n.experience-filter-select.experience-filter-workspace[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-workspace[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f3 0%,\n      #ffe6ea 100%);\n  border-color: rgba(169, 72, 90, 0.32);\n}\n.experience-filter-select.experience-filter-school[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-school[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n}\n.experience-type-select.experience-filter-online[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n}\n.experience-type-select.experience-filter-project[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n}\n.experience-type-select[_ngcontent-%COMP%] {\n  min-width: 0;\n  max-width: 100%;\n  min-height: 40px;\n}\n.experience-type-field[_ngcontent-%COMP%], \n.experience-title-field[_ngcontent-%COMP%], \n.experience-city-field[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-org-field[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-type-select[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.experience-date-range-field[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: none;\n  margin: 0;\n  background: transparent;\n}\n.experience-date-range-label[_ngcontent-%COMP%] {\n  grid-column: 1/2;\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-text-field-wrapper[_ngcontent-%COMP%] {\n  min-height: 42px;\n  border-radius: 10px;\n  background: #fff;\n  border: 1px solid rgba(136, 156, 186, 0.5);\n  box-shadow: none;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-subscript-wrapper[_ngcontent-%COMP%] {\n  margin-top: 0.24rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  border: 0 !important;\n  box-shadow: none !important;\n  border-radius: 0 !important;\n  background: transparent !important;\n  min-width: 0;\n  width: 100%;\n  padding: 0 !important;\n  min-height: 0 !important;\n  height: auto !important;\n  line-height: 1.25;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-datepicker-toggle[_ngcontent-%COMP%] {\n  margin-right: 0.2rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-hint-wrapper[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-hint[_ngcontent-%COMP%] {\n  color: rgba(30, 49, 74, 0.65);\n  font-size: 0.72rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-container[_ngcontent-%COMP%] {\n  width: 100%;\n  display: grid;\n  grid-template-columns: minmax(96px, 1fr) auto minmax(96px, 1fr);\n  align-items: center;\n  column-gap: 0.34rem;\n  min-width: 0;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-separator[_ngcontent-%COMP%] {\n  margin: 0 0.28rem;\n  flex: 0 0 auto;\n  white-space: nowrap;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-start-wrapper[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-end-wrapper[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  overflow: visible;\n  min-width: 0;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-inner[_ngcontent-%COMP%] {\n  font-size: 0.96rem;\n  min-width: 0 !important;\n  width: 100% !important;\n  text-overflow: clip;\n  white-space: nowrap;\n  line-height: 1.25;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-flex[_ngcontent-%COMP%] {\n  min-width: 0;\n  border-bottom: 0 !important;\n  box-shadow: none !important;\n  align-items: center !important;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-infix[_ngcontent-%COMP%] {\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  min-height: 34px !important;\n  height: 34px;\n  display: flex;\n  align-items: center;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-line-ripple[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple--deactivating[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple--active[_ngcontent-%COMP%] {\n  display: none !important;\n  opacity: 0 !important;\n  transform: scaleX(0) !important;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-all {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efe8ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-workspace {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1f3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-school {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf4ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-online {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf8ee);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-project {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f4f0ff);\n}\n.mobile-profile-language-chip.language-tone-1[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-1[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-1 {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n  color: #2f6090;\n}\n.mobile-profile-language-chip.language-tone-2[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-2[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-2 {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n  color: #2f695b;\n}\n.mobile-profile-language-chip.language-tone-3[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-3[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-3 {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n  color: #394f9c;\n}\n.mobile-profile-language-chip.language-tone-4[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-4[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-4 {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n  color: #8d3f66;\n}\n.mobile-profile-language-chip.language-tone-5[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-5[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-5 {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n  color: #704822;\n}\n.mobile-profile-language-chip.language-tone-6[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-6[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-6 {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n  color: #415872;\n}\n.mobile-profile-language-chip.language-tone-7[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-7[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-7 {\n  background: #f7f5ea;\n  border-color: rgba(128, 109, 66, 0.34);\n  color: #746237;\n}\n.mobile-profile-language-chip.language-tone-8[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-8[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-8 {\n  background: #edf5ff;\n  border-color: rgba(45, 122, 160, 0.34);\n  color: #2f6782;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf2ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #ebf7ef);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1e3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efecfc);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3f8e9);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fceef3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf7ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6f2e9);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-1 .status-option-content {\n  color: #2d63a9;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-2 .status-option-content {\n  color: #2a7a49;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-3 .status-option-content {\n  color: #9b6018;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-4 .status-option-content {\n  color: #6153a2;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-5 .status-option-content {\n  color: #61812a;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-6 .status-option-content {\n  color: #9f446d;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-7 .status-option-content {\n  color: #2e7898;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-8 .status-option-content {\n  color: #806c3f;\n}\n.mobile-profile-selector-option.detail-tone-1[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef5ff 0%,\n      #e3eefc 100%);\n  border-color: rgba(46, 102, 181, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-2[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef9f3 0%,\n      #e3f4ea 100%);\n  border-color: rgba(40, 125, 72, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-3[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ea 0%,\n      #ffecdd 100%);\n  border-color: rgba(165, 94, 24, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-4[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f1ff 0%,\n      #e8e5fb 100%);\n  border-color: rgba(97, 82, 164, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-5[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f9ef 0%,\n      #edf3e1 100%);\n  border-color: rgba(95, 128, 36, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-6[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #f9e6ed 100%);\n  border-color: rgba(160, 70, 111, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-7[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ff 0%,\n      #e2f0fb 100%);\n  border-color: rgba(45, 122, 160, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-8[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f3ea 0%,\n      #eee9dc 100%);\n  border-color: rgba(128, 109, 66, 0.32);\n}\n.mobile-profile-selector-option.status-public[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e6f6ef 0%,\n      #d9f0e6 100%);\n  border-color: rgba(47, 143, 102, 0.34);\n}\n.mobile-profile-selector-option.status-friends[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f1fd 0%,\n      #dfeaf9 100%);\n  border-color: rgba(27, 87, 161, 0.34);\n}\n.mobile-profile-selector-option.status-host[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe2 0%,\n      #eee4d2 100%);\n  border-color: rgba(135, 88, 15, 0.36);\n}\n.mobile-profile-selector-option.status-inactive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3f5 0%,\n      #e8ebef 100%);\n  border-color: rgba(91, 101, 115, 0.32);\n}\n.mobile-profile-selector-option.physique-slim[_ngcontent-%COMP%] {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.mobile-profile-selector-option.physique-lean[_ngcontent-%COMP%] {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n}\n.mobile-profile-selector-option.physique-athletic[_ngcontent-%COMP%] {\n  background: #e8f5ec;\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.mobile-profile-selector-option.physique-fit[_ngcontent-%COMP%] {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.mobile-profile-selector-option.physique-curvy[_ngcontent-%COMP%] {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n}\n.mobile-profile-selector-option.physique-muscular[_ngcontent-%COMP%] {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n}\n.mobile-profile-selector-option.physique-average[_ngcontent-%COMP%] {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .values-selector-popup.profile-selector-popup[_ngcontent-%COMP%] {\n  gap: 0.56rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.44rem;\n  padding-bottom: 0.22rem;\n  border-bottom: 1px solid rgba(74, 102, 139, 0.22);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-head-label[_ngcontent-%COMP%] {\n  color: #203c64;\n  font-size: 0.82rem;\n  font-weight: 800;\n  line-height: 1.2;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-clear[_ngcontent-%COMP%] {\n  border: 1px solid rgba(41, 73, 110, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.82);\n  color: #284970;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.3rem 0.52rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-clear.is-hidden[_ngcontent-%COMP%] {\n  visibility: hidden;\n  pointer-events: none;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-selected[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(35, 68, 107, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.92);\n  color: #234368;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.26rem 0.48rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.16rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-empty[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.74rem;\n  color: rgba(31, 54, 86, 0.62);\n  font-style: italic;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.34rem;\n  border: 1px solid transparent;\n  border-radius: 12px;\n  padding: 0.4rem 0.42rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-head[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag[_ngcontent-%COMP%] {\n  border-radius: 999px;\n  border: 1px solid rgba(52, 86, 128, 0.28);\n  background: rgba(255, 255, 255, 0.74);\n  color: #2f527d;\n  font-size: 0.67rem;\n  font-weight: 800;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.2rem 0.52rem;\n  text-transform: uppercase;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 1px;\n  background: rgba(84, 111, 147, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip-grid[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.36rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(41, 70, 106, 0.22);\n  border-radius: 999px;\n  background: #f4f8ff;\n  color: #234066;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 700;\n  padding: 0.3rem 0.58rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  cursor: pointer;\n  transition:\n    background-color 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip.active[_ngcontent-%COMP%] {\n  border-color: rgba(27, 85, 158, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #dcebff 0%,\n      #cfe3ff 100%);\n  color: #123e70;\n  box-shadow: inset 0 0 0 1px rgba(30, 73, 127, 0.24), 0 1px 2px rgba(24, 53, 86, 0.16);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-family[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 232, 219, 0.52) 0%,\n      rgba(255, 232, 219, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-ambition[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 242, 216, 0.52) 0%,\n      rgba(255, 242, 216, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-lifestyle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(221, 241, 239, 0.56) 0%,\n      rgba(221, 241, 239, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-beliefs[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-social[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(223, 236, 255, 0.5) 0%,\n      rgba(223, 236, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-arts[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(235, 227, 255, 0.5) 0%,\n      rgba(235, 227, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-food[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 236, 221, 0.52) 0%,\n      rgba(255, 236, 221, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(222, 243, 231, 0.56) 0%,\n      rgba(222, 243, 231, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-mind[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(219, 242, 238, 0.56) 0%,\n      rgba(219, 242, 238, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-identity[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-family[_ngcontent-%COMP%] {\n  border-color: rgba(156, 94, 51, 0.34);\n  color: #9c5e33;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-ambition[_ngcontent-%COMP%] {\n  border-color: rgba(160, 106, 20, 0.34);\n  color: #9b6717;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-lifestyle[_ngcontent-%COMP%] {\n  border-color: rgba(47, 123, 119, 0.34);\n  color: #2f7b77;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-beliefs[_ngcontent-%COMP%] {\n  border-color: rgba(95, 78, 160, 0.34);\n  color: #5f4ea0;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-social[_ngcontent-%COMP%] {\n  border-color: rgba(47, 106, 175, 0.36);\n  color: #2f6aaf;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-arts[_ngcontent-%COMP%] {\n  border-color: rgba(106, 87, 168, 0.36);\n  color: #6a57a8;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-food[_ngcontent-%COMP%] {\n  border-color: rgba(170, 97, 28, 0.34);\n  color: #a55e18;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-active[_ngcontent-%COMP%] {\n  border-color: rgba(49, 124, 82, 0.36);\n  color: #317c52;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-mind[_ngcontent-%COMP%] {\n  border-color: rgba(37, 124, 118, 0.34);\n  color: #2b7c76;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-identity[_ngcontent-%COMP%] {\n  border-color: rgba(98, 84, 163, 0.34);\n  color: #6254a3;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-family[_ngcontent-%COMP%] {\n  background: rgba(156, 94, 51, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-ambition[_ngcontent-%COMP%] {\n  background: rgba(160, 106, 20, 0.32);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-lifestyle[_ngcontent-%COMP%] {\n  background: rgba(47, 123, 119, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-beliefs[_ngcontent-%COMP%] {\n  background: rgba(95, 78, 160, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-social[_ngcontent-%COMP%] {\n  background: rgba(47, 106, 175, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-arts[_ngcontent-%COMP%] {\n  background: rgba(106, 87, 168, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-food[_ngcontent-%COMP%] {\n  background: rgba(170, 97, 28, 0.32);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-active[_ngcontent-%COMP%] {\n  background: rgba(49, 124, 82, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-mind[_ngcontent-%COMP%] {\n  background: rgba(37, 124, 118, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-identity[_ngcontent-%COMP%] {\n  background: rgba(98, 84, 163, 0.3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.status-option) {\n  background: #f0f5fc;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.mdc-list-item--selected:not(.mdc-list-item--disabled) {\n  filter: brightness(0.95);\n  box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.2);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option {\n  background: #fff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option:not(:last-child) {\n  border-bottom: 1px solid #e6edf7;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.hide-selected-option, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.hide-selected-option {\n  min-height: 0 !important;\n  height: 0 !important;\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  border: 0 !important;\n  margin: 0 !important;\n  opacity: 0 !important;\n  pointer-events: none !important;\n  overflow: hidden !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option {\n  background: #fff;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel {\n  margin-top: 8px !important;\n  margin-bottom: 8px !important;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .cdk-overlay-pane .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .cdk-overlay-pane .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above {\n  margin-top: 0 !important;\n  margin-bottom: 18px !important;\n  transform: translateY(-10px) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public {\n  --mdc-list-list-item-container-color: #def3e9;\n  --mat-mdc-option-selected-container-color: #def3e9;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #def3e9) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends {\n  --mdc-list-list-item-container-color: #e3eefb;\n  --mat-mdc-option-selected-container-color: #e3eefb;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e3eefb) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host {\n  --mdc-list-list-item-container-color: #f3ead8;\n  --mat-mdc-option-selected-container-color: #f3ead8;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3ead8) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive {\n  --mdc-list-list-item-container-color: #eceff3;\n  --mat-mdc-option-selected-container-color: #eceff3;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eceff3) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon {\n  color: #2f8f66 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon {\n  color: #1b57a1 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon {\n  color: #87580f !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon {\n  color: #5b6573 !important;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-slim {\n  background: #eaf4ff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-lean {\n  background: #edf8f4;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-athletic {\n  background: #e8f5ec;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-fit {\n  background: #f1f2ff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-curvy {\n  background: #fff2f8;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-muscular {\n  background: #fbf4ea;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-average {\n  background: #eff4f9;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-slim .status-option-content {\n  color: #3f7ab3;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-lean .status-option-content {\n  color: #3f8f5f;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-athletic .status-option-content {\n  color: #2f7e4d;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-fit .status-option-content {\n  color: #465fbb;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-curvy .status-option-content {\n  color: #a14875;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-muscular .status-option-content {\n  color: #7d4f24;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-average .status-option-content {\n  color: #4d667f;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.physique-options-panel {\n  width: auto !important;\n  max-width: 220px !important;\n  min-width: 0 !important;\n}\n[_nghost-%COMP%]     .physique-options-panel .mat-mdc-option {\n  padding-right: 8px;\n}\n[_nghost-%COMP%]     .physique-options-panel .mat-mdc-option .mat-pseudo-checkbox {\n  margin-left: 4px;\n}\n@media (max-width: 760px) {\n  .experience-form-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    max-width: none;\n    justify-content: stretch;\n    row-gap: 0.72rem;\n  }\n  .experience-date-range-label[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n  }\n  .experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-container[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);\n  }\n  .profile-details-privacy-fab[_ngcontent-%COMP%]   .privacy-fab-actions[_ngcontent-%COMP%] {\n    position: fixed;\n    left: 0.5rem;\n    right: 0.5rem;\n    bottom: max(0.5rem, env(safe-area-inset-bottom));\n    top: auto;\n    transform: translateY(12px) scale(0.98);\n    transform-origin: bottom center;\n    justify-content: center;\n    gap: 0.46rem;\n    padding: 0.46rem 0.56rem;\n    border: 1px solid rgba(42, 68, 102, 0.2);\n    border-radius: 14px;\n    background: #fff;\n    box-shadow: 0 -12px 24px rgba(18, 31, 51, 0.22);\n  }\n  .profile-details-privacy-fab.open[_ngcontent-%COMP%]   .privacy-fab-actions[_ngcontent-%COMP%] {\n    transform: translateY(0) scale(1);\n  }\n}\n[_nghost-%COMP%] {\n  --event-resource-shell-gap: 0.6rem;\n  --event-resource-panel-max-width: 1080px;\n  display: contents;\n}\n  .cdk-drag-preview.asset-route-row {\n  display: grid !important;\n  grid-template-columns: auto minmax(0, 1fr) auto auto !important;\n  align-items: center !important;\n  gap: 0.62rem !important;\n  box-sizing: border-box !important;\n  background: #fff;\n  border-radius: 8px;\n  box-shadow: 0 8px 24px rgba(14, 32, 58, 0.15);\n  padding: 0.25rem 0.5rem;\n}\n  .cdk-drag-preview.asset-route-row input {\n  width: 100%;\n  min-width: 0;\n  border: 1px solid rgba(42, 66, 102, 0.28);\n  border-radius: 4px;\n  padding: 0.4rem 0.6rem;\n  font-family: inherit;\n  box-sizing: border-box;\n}\n  .cdk-drag-preview.asset-route-row {\n}\n  .cdk-drag-preview.asset-route-row .experience-action-btn {\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  border: 1px solid rgba(42, 67, 101, 0.26);\n  background: rgba(255, 255, 255, 0.88);\n  color: #2d5ea8;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  cursor: pointer;\n}\n  .cdk-drag-preview.asset-route-row .experience-action-btn .mat-icon {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n  line-height: 15px;\n}\n  .cdk-drag-preview.asset-route-row .experience-action-btn.asset-route-drag-btn {\n  cursor: grabbing;\n}\n  .cdk-drag-preview.asset-route-row .experience-action-btn.asset-route-map-btn {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f7fc 0%,\n      #e8eef9 100%);\n  border-color: rgba(53, 91, 140, 0.26);\n  color: #315e9a;\n}\n  .cdk-drag-preview.asset-route-row .experience-action-btn.asset-route-delete-btn {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f1 0%,\n      #ffe4e4 100%);\n  border-color: rgba(177, 40, 40, 0.32);\n  color: #b12828;\n}\n  .subevent-resource-card-list app-info-card [class*=avatar], \n  .subevent-resource-card-list app-info-card [class*=media-start] {\n  background:\n    linear-gradient(\n      180deg,\n      #ffe8cc 0%,\n      #ffd7af 100%) !important;\n  border: 1px solid rgba(179, 108, 42, 0.54) !important;\n  color: #8c4f18 !important;\n  transition:\n    transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),\n    box-shadow 0.2s ease,\n    filter 0.2s ease !important;\n}\n  .subevent-resource-card-list app-info-card [class*=avatar] .mat-icon, \n  .subevent-resource-card-list app-info-card [class*=media-start] .mat-icon {\n  color: #8c4f18 !important;\n}\n  .subevent-resource-card-list app-info-card [class*=avatar], \n  .subevent-resource-card-list app-info-card [class*=media-start] {\n}\n  .subevent-resource-card-list app-info-card [class*=avatar]:hover, \n  .subevent-resource-card-list app-info-card [class*=media-start]:hover {\n  transform: scale(1.08) translateY(-1px) !important;\n  box-shadow: 0 4px 12px rgba(179, 108, 42, 0.25) !important;\n  filter: brightness(1.05) !important;\n}\n  .subevent-resource-card-list app-info-card [class*=avatar], \n  .subevent-resource-card-list app-info-card [class*=media-start] {\n}\n  .subevent-resource-card-list app-info-card [class*=avatar]:active, \n  .subevent-resource-card-list app-info-card [class*=media-start]:active {\n  transform: scale(0.95) !important;\n  box-shadow: 0 1px 4px rgba(179, 108, 42, 0.15) !important;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-assets-popup[_ngcontent-%COMP%] {\n  position: relative;\n  isolation: isolate;\n  display: grid;\n  grid-template-rows: auto minmax(0, 1fr);\n  gap: 0.62rem;\n  height: 100%;\n  min-height: 0;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .assets-toolbar[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 4;\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  flex-wrap: wrap;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .assets-toolbar[_ngcontent-%COMP%]   .profile-status-select-wrap[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: visible;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .assets-toolbar[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%] {\n  gap: 0.34rem;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-resource-mobile-filter-picker[_ngcontent-%COMP%] {\n  position: relative;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-filter-select.asset-filter-transport[_ngcontent-%COMP%], \n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-type-select.asset-filter-transport[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef6ff 0%,\n      #e2efff 100%);\n  border-color: rgba(43, 111, 179, 0.32);\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-filter-select.asset-filter-accommodation[_ngcontent-%COMP%], \n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-type-select.asset-filter-accommodation[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf9f4 0%,\n      #e1f3ea 100%);\n  border-color: rgba(37, 127, 95, 0.32);\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-filter-select.asset-filter-supplies[_ngcontent-%COMP%], \n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-type-select.asset-filter-supplies[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff5ec 0%,\n      #feead9 100%);\n  border-color: rgba(151, 92, 41, 0.32);\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .asset-filter-transport[_ngcontent-%COMP%] {\n  color: #295d96;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .asset-filter-accommodation[_ngcontent-%COMP%] {\n  color: #236d51;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .asset-filter-supplies[_ngcontent-%COMP%] {\n  color: #8a5428;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-filter-select.asset-category-camping[_ngcontent-%COMP%], \n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-type-select.asset-category-camping[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f3e7 0%,\n      #ece3c5 100%);\n  border-color: rgba(129, 110, 53, 0.3);\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-filter-select.asset-category-cooking[_ngcontent-%COMP%], \n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-type-select.asset-category-cooking[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff3e6 0%,\n      #ffe2c2 100%);\n  border-color: rgba(165, 96, 33, 0.3);\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-filter-select.asset-category-games[_ngcontent-%COMP%], \n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-type-select.asset-category-games[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f3edff 0%,\n      #e5d8ff 100%);\n  border-color: rgba(102, 76, 171, 0.3);\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-filter-select.asset-category-audio[_ngcontent-%COMP%], \n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-type-select.asset-category-audio[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf8ff 0%,\n      #d9effb 100%);\n  border-color: rgba(43, 118, 155, 0.3);\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-filter-select.asset-category-sports[_ngcontent-%COMP%], \n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-type-select.asset-category-sports[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1eb 0%,\n      #ffd7ca 100%);\n  border-color: rgba(176, 78, 46, 0.3);\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-filter-select.asset-category-safety[_ngcontent-%COMP%], \n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-type-select.asset-category-safety[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff2f3 0%,\n      #ffdfe3 100%);\n  border-color: rgba(182, 73, 101, 0.3);\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-filter-select.asset-category-decor[_ngcontent-%COMP%], \n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-type-select.asset-category-decor[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f8 0%,\n      #ffe0ef 100%);\n  border-color: rgba(169, 82, 131, 0.3);\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-filter-select.asset-category-tech[_ngcontent-%COMP%], \n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-type-select.asset-category-tech[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef4ff 0%,\n      #dde9ff 100%);\n  border-color: rgba(56, 99, 174, 0.3);\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .asset-category-camping[_ngcontent-%COMP%] {\n  color: #7a6423;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .asset-category-cooking[_ngcontent-%COMP%] {\n  color: #9a531c;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .asset-category-games[_ngcontent-%COMP%] {\n  color: #5f43a5;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .asset-category-audio[_ngcontent-%COMP%] {\n  color: #2a7196;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .asset-category-sports[_ngcontent-%COMP%] {\n  color: #a34d28;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .asset-category-safety[_ngcontent-%COMP%] {\n  color: #a84360;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .asset-category-decor[_ngcontent-%COMP%] {\n  color: #9c4a79;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .asset-category-tech[_ngcontent-%COMP%] {\n  color: #2f5fa8;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .assets-toolbar[_ngcontent-%COMP%]   .profile-status-select-wrap[_ngcontent-%COMP%]:focus-within {\n  outline: none;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .assets-toolbar[_ngcontent-%COMP%]   .profile-status-select-wrap.asset-filter-open[_ngcontent-%COMP%] {\n  outline: none;\n  box-shadow: 0 5px 14px rgba(30, 64, 106, 0.2);\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .assets-toolbar[_ngcontent-%COMP%]   .profile-status-select-wrap.asset-filter-transport.asset-filter-open[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #d6e8ff 0%,\n      #c7dcfa 100%);\n  color: #173d69;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .assets-toolbar[_ngcontent-%COMP%]   .profile-status-select-wrap.asset-filter-accommodation.asset-filter-open[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #d7efe2 0%,\n      #c8e3d4 100%);\n  color: #164936;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .assets-toolbar[_ngcontent-%COMP%]   .profile-status-select-wrap.asset-filter-supplies.asset-filter-open[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ffe6ce 0%,\n      #f5d4b2 100%);\n  color: #633917;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   app-smart-list.subevent-assets-scroll-list[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 0;\n  display: flex;\n  flex: 1 1 auto;\n  min-height: 0;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-resource-card-list[_ngcontent-%COMP%] {\n  min-height: 0;\n  padding-bottom: 0.3rem;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-assets-toolbar-actions[_ngcontent-%COMP%] {\n  margin-left: auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-assets-quick-actions[_ngcontent-%COMP%] {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-assets-quick-actions-trigger.is-open[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  transform: rotate(45deg);\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-assets-quick-actions-trigger[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  transition: transform 0.16s ease;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-assets-quick-actions-panel[_ngcontent-%COMP%] {\n  right: 0;\n  min-width: 184px;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-assets-quick-actions-panel[_ngcontent-%COMP%]   .subevent-assets-quick-action-option[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n  width: 100%;\n  border-radius: 12px;\n  min-height: 40px;\n  padding: 0.46rem 0.62rem;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-assets-quick-actions-panel[_ngcontent-%COMP%]   .subevent-assets-quick-action-option-assign[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff7ea 0%,\n      #ffeed1 100%);\n  border: 1px solid rgba(168, 111, 36, 0.28);\n  color: #9b5e1f;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-assets-quick-actions-panel[_ngcontent-%COMP%]   .subevent-assets-quick-action-option-assign[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #ae661f;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-assets-quick-actions-panel[_ngcontent-%COMP%]   .subevent-assets-quick-action-option-explore[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef4ff 0%,\n      #e2ebff 100%);\n  border: 1px solid rgba(74, 108, 182, 0.28);\n  color: #4164a8;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-assets-quick-actions-panel[_ngcontent-%COMP%]   .subevent-assets-quick-action-option-explore[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #4b73bf;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .chat-members-stack[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  min-width: 0;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  font: inherit;\n  gap: 0.34rem;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .chat-header-members[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: visible;\n  cursor: pointer;\n  border-radius: 999px;\n  transition:\n    background-color 0.16s ease,\n    border-color 0.16s ease,\n    box-shadow 0.16s ease,\n    color 0.16s ease;\n  padding: 2px 4px 2px 2px;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .event-editor-members-trigger[_ngcontent-%COMP%] {\n  border: 1px solid rgba(160, 106, 44, 0.36);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 246, 228, 0.98) 0%,\n      rgba(252, 236, 201, 0.95) 100%);\n  min-height: 34px;\n  padding: 2px 10px 2px 4px;\n  box-shadow: 0 2px 6px rgba(74, 44, 14, 0.08);\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .event-editor-members-trigger[_ngcontent-%COMP%]:hover {\n  border-color: rgba(167, 103, 34, 0.52);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 250, 237, 0.99) 0%,\n      rgba(253, 241, 214, 0.97) 100%);\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .event-editor-members-trigger-members[_ngcontent-%COMP%] {\n  border-color: rgba(64, 103, 150, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(237, 246, 255, 0.98) 0%,\n      rgba(219, 234, 252, 0.95) 100%);\n  box-shadow: 0 2px 6px rgba(32, 72, 120, 0.08);\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .event-editor-members-trigger-members[_ngcontent-%COMP%]:hover {\n  border-color: rgba(52, 102, 164, 0.48);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(246, 251, 255, 0.99) 0%,\n      rgba(226, 239, 255, 0.97) 100%);\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .event-editor-members-trigger-members[_ngcontent-%COMP%]   .event-editor-members-invite[_ngcontent-%COMP%] {\n  color: rgba(29, 63, 102, 0.95);\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .event-editor-members-trigger-members[_ngcontent-%COMP%]   .event-editor-members-invite[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2e689f;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .event-editor-members-pending-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -12px;\n  right: -10px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  min-width: 20px;\n  height: 20px;\n  padding: 0 5px;\n  border-radius: 999px;\n  background: #e5484d;\n  color: #fff;\n  font-size: 10px;\n  font-weight: 700;\n  line-height: 1;\n  border: 1px solid #fff;\n  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.76);\n  z-index: 2;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-assets-assign-trigger[_ngcontent-%COMP%] {\n  margin-left: 0;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .event-editor-members-invite[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.32rem;\n  padding: 0 2px;\n  color: rgba(97, 57, 22, 0.95);\n  font-size: 0.75rem;\n  font-weight: 700;\n  line-height: 1;\n  white-space: nowrap;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .event-editor-members-invite[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: #ae661f;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-shell-panel[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-rows: auto minmax(0, 1fr);\n  overflow: hidden;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-shell-header[_ngcontent-%COMP%] {\n  z-index: 32;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-header-controls[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  margin-left: auto;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-order-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 20;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-shell-body[_ngcontent-%COMP%] {\n  padding: 0.4rem 0.4rem 0.4rem 0.2rem;\n  gap: 0.46rem;\n  position: relative;\n  overflow: visible;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-popup-screen[_ngcontent-%COMP%] {\n  position: relative;\n  display: grid;\n  grid-template-rows: auto minmax(0, 1fr);\n  height: 100%;\n  min-height: 0;\n  gap: 0.46rem;\n  overflow: visible;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-panel[_ngcontent-%COMP%], \n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-panel[_ngcontent-%COMP%] {\n  min-height: 0;\n  display: grid;\n  gap: 0.9rem;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-panel[_ngcontent-%COMP%] {\n  padding: 0.95rem 1rem 1rem;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-filter-bar[_ngcontent-%COMP%] {\n  min-height: 2.2rem;\n  height: auto;\n  display: flex;\n  align-items: center;\n  gap: 0.18rem;\n  flex-wrap: nowrap;\n  overflow-x: auto;\n  overflow-y: visible;\n  padding: 0.08rem 0;\n  scrollbar-width: none;\n  -ms-overflow-style: none;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-filter-bar[_ngcontent-%COMP%]::-webkit-scrollbar {\n  display: none;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-category-field[_ngcontent-%COMP%] {\n  min-height: 36px;\n  width: fit-content !important;\n  min-width: 0 !important;\n  flex: 0 0 auto;\n  overflow: visible;\n  padding-left: 0.62rem !important;\n  padding-right: 0.34rem !important;\n  gap: 0.22rem !important;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-category-field[_ngcontent-%COMP%]     .status-option-content {\n  gap: 0.14rem !important;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-category-field[_ngcontent-%COMP%]     .mat-mdc-select-arrow-wrapper {\n  margin-left: 0.14rem !important;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-progress-strip[_ngcontent-%COMP%] {\n  margin-top: -0.08rem;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-progress-strip[_ngcontent-%COMP%]   app-header-progress-bar[_ngcontent-%COMP%] {\n  display: block;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-grid[_ngcontent-%COMP%] {\n  min-height: 0;\n  height: 100%;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-smart-list[_ngcontent-%COMP%] {\n  min-height: 0;\n  height: 100%;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-card-list[_ngcontent-%COMP%] {\n  min-height: 0;\n  padding-right: 0.12rem;\n  padding-bottom: 0.3rem;\n  overscroll-behavior-y: contain;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-panel[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 0;\n  min-height: 0;\n  padding: 0;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-empty-state[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n  display: grid;\n  place-items: center;\n  gap: 0.55rem;\n  min-height: 220px;\n  border: 1px dashed rgba(118, 137, 165, 0.34);\n  border-radius: 18px;\n  background: rgba(255, 255, 255, 0.76);\n  color: rgba(51, 72, 103, 0.78);\n  text-align: center;\n  padding: 1.2rem;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-empty-state[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 26px;\n  height: 26px;\n  font-size: 26px;\n  line-height: 26px;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-empty-state-error[_ngcontent-%COMP%] {\n  border-color: rgba(185, 79, 79, 0.34);\n  color: rgba(146, 45, 45, 0.84);\n  background: rgba(255, 244, 244, 0.88);\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-sticky-header[_ngcontent-%COMP%] {\n  z-index: 18;\n  margin-bottom: 0;\n  box-shadow: 0 0.34rem 0 rgba(255, 255, 255, 0.98);\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-basket[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 0.75rem;\n  bottom: 0.9rem;\n  z-index: 18;\n  display: grid;\n  gap: 0.6rem;\n  justify-items: end;\n  pointer-events: none;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-basket-fab[_ngcontent-%COMP%], \n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-basket-panel[_ngcontent-%COMP%], \n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-basket-panel__close[_ngcontent-%COMP%], \n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-basket-item__btn[_ngcontent-%COMP%] {\n  pointer-events: auto;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-basket-fab[_ngcontent-%COMP%] {\n  width: 58px;\n  height: 58px;\n  border: 1px solid rgba(201, 145, 54, 0.48);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 248, 225, 0.99) 0%,\n      rgba(255, 218, 148, 0.99) 100%);\n  color: #8f4d0c;\n  box-shadow: 0 18px 34px rgba(122, 74, 18, 0.24);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n  cursor: pointer;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-basket-fab.is-open[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(244, 141, 79, 0.99) 0%,\n      rgba(214, 95, 48, 0.99) 100%);\n  color: #fff;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-basket-fab[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 24px;\n  height: 24px;\n  font-size: 24px;\n  line-height: 24px;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-basket-fab__count[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -4px;\n  right: -3px;\n  min-width: 24px;\n  height: 24px;\n  padding: 0 0.35rem;\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #ff8a5f 0%,\n      #e0583f 100%);\n  color: #fff;\n  font-size: 0.78rem;\n  font-weight: 800;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 10px 18px rgba(148, 55, 38, 0.28);\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-basket-panel[_ngcontent-%COMP%] {\n  width: min(340px, 100vw - 2rem);\n  border-radius: 20px;\n  border: 1px solid rgba(211, 184, 128, 0.84);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 252, 244, 0.99) 0%,\n      rgba(255, 244, 224, 0.98) 100%);\n  box-shadow: 0 22px 46px rgba(82, 54, 22, 0.2);\n  padding: 0.9rem;\n  display: grid;\n  gap: 0.8rem;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-basket-panel__head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: start;\n  justify-content: space-between;\n  gap: 0.75rem;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-basket-panel__head[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: block;\n  color: #1f3f68;\n  font-size: 0.98rem;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-basket-panel__head[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 0.15rem;\n  color: rgba(31, 63, 104, 0.68);\n  font-size: 0.8rem;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-basket-panel__close[_ngcontent-%COMP%] {\n  width: 34px;\n  height: 34px;\n  border-radius: 999px;\n  border: 1px solid rgba(186, 205, 229, 0.88);\n  background: rgba(248, 251, 255, 0.95);\n  color: #4b688b;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-basket-panel__close[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  margin: 0;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-basket-panel__list[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.65rem;\n  max-height: min(46vh, 320px);\n  overflow: auto;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-basket-item[_ngcontent-%COMP%] {\n  border-radius: 16px;\n  border: 1px solid rgba(190, 211, 232, 0.84);\n  background: rgba(255, 255, 255, 0.94);\n  padding: 0.8rem;\n  display: grid;\n  gap: 0.65rem;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-basket-item__copy[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.18rem;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-basket-item__copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #264a73;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-basket-item__copy[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: rgba(39, 72, 109, 0.76);\n  font-size: 0.82rem;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-basket-item__actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.45rem;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-basket-item__btn[_ngcontent-%COMP%] {\n  min-height: 34px;\n  padding: 0 0.8rem;\n  border-radius: 999px;\n  border: 1px solid rgba(182, 202, 226, 0.88);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(249, 252, 255, 0.98) 0%,\n      rgba(236, 244, 252, 0.98) 100%);\n  color: #2f5d96;\n  font-weight: 800;\n  cursor: pointer;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-basket-item__btn--clear[_ngcontent-%COMP%] {\n  color: #a04844;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-overlay[_ngcontent-%COMP%] {\n  z-index: 24;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-popup[_ngcontent-%COMP%] {\n  width: min(760px, 100vw - 1.6rem);\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-form[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.95rem;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-slot[_ngcontent-%COMP%], \n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-quantity-field[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.38rem;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-slot__label[_ngcontent-%COMP%], \n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-quantity-field[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  font-weight: 800;\n  color: rgba(29, 48, 75, 0.78);\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-slot__row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(148px, 176px);\n  gap: 0.72rem;\n  align-items: center;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-quantity-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 40px;\n  padding: 0 0.9rem;\n  border: 1px solid rgba(136, 156, 186, 0.5);\n  border-radius: 12px;\n  background: #fff;\n  color: #1d3556;\n  font: inherit;\n  font-weight: 700;\n  box-sizing: border-box;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-quantity-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n  outline: none;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-availability[_ngcontent-%COMP%] {\n  margin: 0.1rem 0 0;\n  font-size: 0.84rem;\n  font-weight: 700;\n  color: rgba(48, 87, 56, 0.82);\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-review-card[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.7rem;\n  padding: 0.85rem 0.95rem;\n  border: 1px solid rgba(202, 219, 237, 0.9);\n  border-radius: 16px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(250, 253, 255, 0.98) 0%,\n      rgba(240, 247, 255, 0.96) 100%);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-review-card--payment[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(251, 247, 239, 0.98) 0%,\n      rgba(247, 239, 224, 0.98) 100%);\n  border-color: rgba(224, 191, 142, 0.78);\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-review-card__head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 0.75rem;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-review-card__head[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.22rem;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-review-card__head[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.94rem;\n  font-weight: 800;\n  color: #214168;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-review-card__head[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: rgba(35, 57, 88, 0.74);\n  font-size: 0.8rem;\n  font-weight: 600;\n  line-height: 1.28;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-review-card__head[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #214168;\n  font-size: 0.94rem;\n  font-weight: 800;\n  white-space: nowrap;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-review-card__list[_ngcontent-%COMP%], \n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-policy-list[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.55rem;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-review-card__item[_ngcontent-%COMP%], \n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-policy-card[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 0.75rem;\n  padding: 0.78rem 0.85rem;\n  border-radius: 14px;\n  border: 1px solid rgba(203, 219, 238, 0.92);\n  background: rgba(255, 255, 255, 0.95);\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-review-card__item[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%], \n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-policy-card[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.24rem;\n  min-width: 0;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-review-card__item[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-policy-card[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #24456d;\n  font-size: 0.9rem;\n  font-weight: 800;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-review-card__item[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-policy-card[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: rgba(35, 57, 88, 0.74);\n  font-size: 0.8rem;\n  line-height: 1.3;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-policy-card[_ngcontent-%COMP%] {\n  align-items: center;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-policy-card[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  margin: 0.1rem 0 0;\n  accent-color: #3467b6;\n  flex: 0 0 auto;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-policy-card.is-required[_ngcontent-%COMP%] {\n  border-color: rgba(228, 189, 122, 0.78);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 251, 244, 0.98) 0%,\n      rgba(255, 247, 233, 0.96) 100%);\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-policy-card[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  color: #9e6422;\n  font-size: 0.74rem;\n  font-style: normal;\n  font-weight: 800;\n  white-space: nowrap;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-payment-summary[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.65rem;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-payment-summary[_ngcontent-%COMP%]   article[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.24rem;\n  padding: 0.75rem 0.8rem;\n  border-radius: 14px;\n  border: 1px solid rgba(228, 194, 145, 0.82);\n  background: rgba(255, 255, 255, 0.9);\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-payment-summary[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: rgba(86, 60, 31, 0.76);\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-payment-summary[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #6a4a1c;\n  font-size: 0.94rem;\n  font-weight: 800;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-payment-note[_ngcontent-%COMP%] {\n  margin: 0;\n  color: rgba(86, 60, 31, 0.76);\n  font-size: 0.8rem;\n  line-height: 1.35;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-payment-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.7rem;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-payment-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.35rem;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-payment-grid[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: rgba(86, 60, 31, 0.76);\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-payment-grid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  height: 46px;\n  border-radius: 16px;\n  border: 1px solid rgba(192, 212, 232, 0.9);\n  background: rgba(244, 248, 252, 0.96);\n  color: rgba(64, 83, 110, 0.9);\n  padding: 0 0.9rem;\n  box-sizing: border-box;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.7rem;\n  padding-top: 0.1rem;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-confirm-shell[_ngcontent-%COMP%] {\n  position: relative;\n  display: inline-flex;\n  align-items: stretch;\n  justify-content: center;\n  min-width: 176px;\n  height: 50px;\n  border-radius: 999px;\n  padding: 2px;\n  box-sizing: border-box;\n  overflow: hidden;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-confirm-ring[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-actions__btn[_ngcontent-%COMP%] {\n  min-height: 42px;\n  padding: 0 1rem;\n  border-radius: 999px;\n  border: 1px solid rgba(182, 202, 226, 0.88);\n  font: inherit;\n  font-size: 0.84rem;\n  font-weight: 800;\n  cursor: pointer;\n  transition:\n    transform 120ms ease,\n    box-shadow 120ms ease,\n    background 120ms ease;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-actions__btn[_ngcontent-%COMP%]:disabled {\n  cursor: not-allowed;\n  opacity: 0.55;\n  transform: none;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-actions__btn--secondary[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.96);\n  color: #496789;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-actions__btn--primary[_ngcontent-%COMP%] {\n  min-width: 164px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(138, 181, 236, 0.96) 0%,\n      rgba(102, 151, 217, 0.96) 100%);\n  border-color: rgba(93, 138, 202, 0.92);\n  color: #fff;\n  box-shadow: 0 10px 24px rgba(52, 103, 182, 0.22);\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-actions__btn--confirm[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  width: 100%;\n  min-width: 176px;\n  height: 100%;\n  min-height: 46px;\n  border-color: transparent;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-confirm-shell.is-loading[_ngcontent-%COMP%]   .asset-explore-borrow-actions__btn--confirm[_ngcontent-%COMP%], \n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-confirm-shell.is-loading[_ngcontent-%COMP%]   .asset-explore-borrow-actions__btn--confirm[_ngcontent-%COMP%]:hover, \n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-confirm-shell.is-loading[_ngcontent-%COMP%]   .asset-explore-borrow-actions__btn--confirm[_ngcontent-%COMP%]:disabled {\n  border-color: rgba(181, 117, 23, 0.76);\n  background:\n    linear-gradient(\n      180deg,\n      #ffe7bf 0%,\n      #ffd085 100%);\n  color: #8e4f0d;\n  opacity: 1;\n  cursor: wait;\n  box-shadow: none;\n  transform: none;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-confirm-shell.is-error[_ngcontent-%COMP%]   .asset-explore-borrow-actions__btn--confirm[_ngcontent-%COMP%], \n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-confirm-shell.is-error[_ngcontent-%COMP%]   .asset-explore-borrow-actions__btn--confirm[_ngcontent-%COMP%]:hover {\n  border-color: rgba(176, 31, 46, 0.82);\n  background:\n    linear-gradient(\n      180deg,\n      #f36a79 0%,\n      #d4374a 100%);\n  color: #fff;\n  opacity: 1;\n  box-shadow: none;\n  transform: none;\n}\n.asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-actions__btn[_ngcontent-%COMP%]:not(:disabled):hover {\n  transform: translateY(-1px);\n}\n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-date-field, \n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-time-field {\n  width: 100%;\n  --mat-form-field-filled-container-color: transparent;\n  --mdc-filled-text-field-container-color: transparent;\n  --mat-form-field-state-layer-color: transparent;\n  --mat-form-field-hover-state-layer-opacity: 0;\n  --mat-form-field-focus-state-layer-opacity: 0;\n  --mat-form-field-outlined-outline-width: 0;\n  --mat-form-field-outlined-focus-outline-width: 0;\n  --mdc-outlined-text-field-outline-color: transparent;\n  --mdc-outlined-text-field-focus-outline-color: transparent;\n  --mdc-outlined-text-field-hover-outline-color: transparent;\n  margin: 0 !important;\n}\n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-date-field .mat-mdc-text-field-wrapper, \n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-time-field .mat-mdc-text-field-wrapper, \n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-date-field .mdc-text-field, \n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-time-field .mdc-text-field {\n  min-height: 42px;\n  border: 0 !important;\n  box-shadow: none !important;\n  background: transparent !important;\n  padding: 0;\n}\n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-date-field .mdc-notched-outline__leading, \n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-date-field .mdc-notched-outline__notch, \n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-date-field .mdc-notched-outline__trailing, \n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-time-field .mdc-notched-outline__leading, \n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-time-field .mdc-notched-outline__notch, \n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-time-field .mdc-notched-outline__trailing, \n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-date-field .mdc-line-ripple, \n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-time-field .mdc-line-ripple, \n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-date-field .mat-mdc-form-field-line-ripple, \n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-time-field .mat-mdc-form-field-line-ripple, \n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-date-field .mat-mdc-form-field-bottom-align, \n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-time-field .mat-mdc-form-field-bottom-align, \n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-date-field .mat-mdc-form-field-subscript-wrapper, \n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-time-field .mat-mdc-form-field-subscript-wrapper {\n  display: none !important;\n}\n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-date-field .mat-mdc-form-field-infix, \n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-time-field .mat-mdc-form-field-infix {\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  min-height: 40px !important;\n  display: flex;\n  align-items: center;\n}\n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-date-field .mat-mdc-form-field-flex, \n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-time-field .mat-mdc-form-field-flex {\n  align-items: center !important;\n}\n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-date-field input.mat-mdc-input-element, \n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-time-field input.mat-mdc-input-element {\n  border: 1px solid rgba(136, 156, 186, 0.5) !important;\n  border-radius: 12px;\n  background: #fff !important;\n  color: #1d3556;\n  min-height: 40px;\n  padding: 0 0.85rem;\n  box-sizing: border-box;\n  box-shadow: none !important;\n  outline: none !important;\n  font-weight: 700;\n}\n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-date-field input.mat-mdc-input-element:focus, \n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-time-field input.mat-mdc-input-element:focus {\n  border-color: rgba(52, 103, 182, 0.72) !important;\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14) !important;\n}\n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-date-field .mat-datepicker-toggle, \n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-time-field .mat-timepicker-toggle {\n  margin: 0 !important;\n  align-self: center !important;\n}\n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-date-field .mat-datepicker-toggle .mat-mdc-icon-button, \n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-time-field .mat-timepicker-toggle .mat-mdc-icon-button {\n  width: 36px;\n  height: 36px;\n  border-radius: 999px;\n  padding: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: #496789;\n}\n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-date-field .mat-datepicker-toggle .mat-mdc-icon-button:hover, \n[_nghost-%COMP%]     .asset-explore-borrow-panel .event-time-field .mat-timepicker-toggle .mat-mdc-icon-button:hover {\n  background: rgba(73, 103, 137, 0.1);\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-form-overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  z-index: 20;\n  display: flex;\n  align-items: center;\n  padding: 0;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-form-overlay.subevent-asset-route-overlay[_ngcontent-%COMP%] {\n  z-index: 96;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-form-overlay-backdrop[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  background: rgba(8, 16, 30, 0.54);\n  -webkit-backdrop-filter: blur(2px);\n  backdrop-filter: blur(2px);\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-form-popup[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  width: min(620px, 100% - 2rem);\n  max-width: min(620px, 100vw - 2rem);\n  max-height: calc(100% - 1.8rem);\n  border-radius: 16px;\n  border: 1px solid rgba(42, 66, 102, 0.28);\n  background: #fff;\n  box-shadow: 0 24px 60px rgba(14, 32, 58, 0.26);\n  overflow: hidden;\n  box-sizing: border-box;\n  display: flex;\n  flex-direction: column;\n  font-family: inherit;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-group-popup[_ngcontent-%COMP%] {\n  width: min(620px, 100% - 2rem);\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-form-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.6rem;\n  padding: 0.82rem 1rem;\n  border-bottom: 1px solid rgba(187, 199, 217, 0.7);\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #f4f8ff 100%);\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-form-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #1e385a;\n  font-size: 1.12rem;\n  font-weight: 700;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-group-header[_ngcontent-%COMP%] {\n  align-items: flex-start;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-group-header-main[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.3rem;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-group-stage-subtitle[_ngcontent-%COMP%] {\n  margin: 0;\n  color: rgba(35, 57, 88, 0.76);\n  font-size: 0.8rem;\n  font-weight: 600;\n  line-height: 1.24;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-form-header-controls[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.44rem;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-form-panel[_ngcontent-%COMP%] {\n  border: 1px solid rgba(43, 71, 107, 0.2);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #f4f8ff 100%);\n  padding: 0.74rem;\n  display: grid;\n  gap: 0.78rem;\n  margin: 0;\n  box-sizing: border-box;\n  flex: 1 1 auto;\n  min-height: 0;\n  overflow-y: auto;\n  overflow-x: hidden;\n  -webkit-overflow-scrolling: touch;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-group-form-panel[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f1f9ff 0%,\n      #e8f3ff 100%);\n  border-color: rgba(63, 118, 188, 0.28);\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .experience-form-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  max-width: none;\n  width: 100%;\n  margin: 0;\n  justify-content: stretch;\n  column-gap: 1rem;\n  row-gap: 0.9rem;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-group-form-grid[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 1fr);\n  align-content: start;\n  align-items: start;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-group-form-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: stretch;\n  gap: 0.22rem !important;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-capacity-range-field[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-capacity-range[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);\n  align-items: center;\n  gap: 0.42rem;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-capacity-range[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-capacity-separator[_ngcontent-%COMP%] {\n  font-size: 0.92rem;\n  font-weight: 800;\n  color: rgba(31, 56, 89, 0.72);\n  line-height: 1;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .asset-route-toolbar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.48rem;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .asset-route-toolbar-actions[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, 30px);\n  justify-content: end;\n  align-items: center;\n  gap: 0.46rem;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .asset-route-toolbar-actions.asset-route-toolbar-actions-single[_ngcontent-%COMP%] {\n  grid-template-columns: 30px;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .asset-route-toolbar-separator[_ngcontent-%COMP%] {\n  height: 1px;\n  width: 100%;\n  background: rgba(38, 65, 99, 0.16);\n  margin: 0.36rem 0 0.5rem;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .asset-route-list[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.5rem;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .asset-route-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto auto;\n  align-items: center;\n  gap: 0.62rem;\n  width: 100%;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .asset-route-row[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .asset-route-drag-btn[_ngcontent-%COMP%], \n.event-resource-popup-shell[_ngcontent-%COMP%]   .asset-route-map-btn[_ngcontent-%COMP%], \n.event-resource-popup-shell[_ngcontent-%COMP%]   .asset-route-delete-btn[_ngcontent-%COMP%], \n.event-resource-popup-shell[_ngcontent-%COMP%]   .asset-route-add-btn[_ngcontent-%COMP%] {\n  width: 30px;\n  height: 30px;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-asset-capacity-overlay[_ngcontent-%COMP%]   .experience-action-btn[_ngcontent-%COMP%] {\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  border: 1px solid rgba(42, 67, 101, 0.26);\n  background: rgba(255, 255, 255, 0.88);\n  color: #2d5ea8;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-asset-capacity-overlay[_ngcontent-%COMP%]   .experience-action-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n  line-height: 15px;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-asset-capacity-overlay[_ngcontent-%COMP%]   .experience-action-btn.asset-route-map-btn[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f7fc 0%,\n      #e8eef9 100%);\n  border-color: rgba(53, 91, 140, 0.26);\n  color: #315e9a;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-asset-capacity-overlay[_ngcontent-%COMP%]   .experience-action-btn.asset-route-main-map-btn[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ffe8cc 0%,\n      #ffd7af 100%);\n  border-color: rgba(179, 108, 42, 0.54);\n  color: #8c4f18;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-asset-capacity-overlay[_ngcontent-%COMP%]   .experience-action-btn.asset-route-main-map-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.75;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .asset-route-drag-btn[_ngcontent-%COMP%] {\n  cursor: grab;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .asset-route-drag-btn[_ngcontent-%COMP%]:active {\n  cursor: grabbing;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .asset-route-add-btn[_ngcontent-%COMP%] {\n  color: #2f5ea0;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .asset-route-delete-btn[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f1 0%,\n      #ffe4e4 100%);\n  border-color: rgba(177, 40, 40, 0.32);\n  color: #b12828;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-resource-editor-error[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #9b2c37;\n  font-size: 0.74rem;\n  font-weight: 700;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-asset-capacity-overlay[_ngcontent-%COMP%]   .experience-action-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.72;\n  cursor: not-allowed;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel {\n  min-width: 220px;\n  margin-top: 8px !important;\n  margin-bottom: 8px !important;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .cdk-overlay-pane .mat-mdc-select-panel.subevent-resource-options-panel.mat-mdc-select-panel-above {\n  margin-top: 0 !important;\n  margin-bottom: 18px !important;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-filter-transport, \n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-filter-transport .status-option-content, \n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-filter-transport .status-option-content .mat-icon {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eef6ff);\n  color: #295d96;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-filter-accommodation, \n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-filter-accommodation .status-option-content, \n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-filter-accommodation .status-option-content .mat-icon {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf9f4);\n  color: #236d51;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-filter-supplies, \n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-filter-supplies .status-option-content, \n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-filter-supplies .status-option-content .mat-icon {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff5ec);\n  color: #8a5428;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-camping, \n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-camping .status-option-content, \n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-camping .status-option-content .mat-icon {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6f3e7);\n  color: #7a6423;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-cooking, \n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-cooking .status-option-content, \n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-cooking .status-option-content .mat-icon {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff3e6);\n  color: #9a531c;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-games, \n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-games .status-option-content, \n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-games .status-option-content .mat-icon {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3edff);\n  color: #5f43a5;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-audio, \n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-audio .status-option-content, \n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-audio .status-option-content .mat-icon {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #ecf8ff);\n  color: #2a7196;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-sports, \n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-sports .status-option-content, \n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-sports .status-option-content .mat-icon {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1eb);\n  color: #a34d28;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-safety, \n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-safety .status-option-content, \n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-safety .status-option-content .mat-icon {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff2f3);\n  color: #a84360;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-decor, \n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-decor .status-option-content, \n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-decor .status-option-content .mat-icon {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1f8);\n  color: #9c4a79;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-tech, \n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-tech .status-option-content, \n[_nghost-%COMP%]     .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-tech .status-option-content .mat-icon {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eef4ff);\n  color: #2f5fa8;\n}\n.subevent-asset-view-popup[_ngcontent-%COMP%] {\n  width: min(560px, 100vw - 2rem);\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-asset-view-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  top: var(--event-resource-shell-gap);\n  left: 50%;\n  z-index: 80;\n  width: min(var(--event-resource-panel-max-width), 100vw - var(--event-resource-shell-gap) * 2);\n  height: calc(100vh - var(--event-resource-shell-gap) * 2);\n  height: calc(100dvh - var(--event-resource-shell-gap) * 2);\n  padding: 0;\n  transform: translateX(-50%);\n  align-items: stretch;\n  justify-content: stretch;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-asset-view-popup[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  height: 100%;\n  max-height: 100%;\n  border-radius: 14px;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-asset-view-media[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  height: 186px;\n  aspect-ratio: auto;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-asset-view-grid.experience-form-grid[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  column-gap: 1rem;\n  row-gap: 0.9rem;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-asset-view-grid[_ngcontent-%COMP%]   .experience-description-field[_ngcontent-%COMP%], \n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-asset-view-summary-panel[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-asset-view-summary-body[_ngcontent-%COMP%]   .event-slots-open-btn[_ngcontent-%COMP%] {\n  width: fit-content;\n  min-width: 170px;\n  justify-self: start;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-asset-view-pricing[_ngcontent-%COMP%]   .subevent-asset-view-summary-body[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  align-items: stretch;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-asset-view-pricing[_ngcontent-%COMP%]   .subevent-asset-view-summary-card[_ngcontent-%COMP%] {\n  min-height: 188px;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-asset-view-policies[_ngcontent-%COMP%]   .subevent-asset-view-summary-body[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(170px, max-content) minmax(0, 1fr);\n  align-items: start;\n}\n.event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-asset-view-policies[_ngcontent-%COMP%]   .event-slots-summary[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.subevent-asset-view-members-btn[_ngcontent-%COMP%] {\n  min-height: 34px;\n  flex: 0 0 auto;\n}\n.subevent-asset-view-panel[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.95rem;\n}\n.subevent-asset-view-media[_ngcontent-%COMP%] {\n  border: 1px solid rgba(33, 54, 82, 0.14);\n  border-radius: 10px;\n  overflow: hidden;\n  background: rgba(236, 243, 252, 0.72);\n}\n.subevent-asset-view-media[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: clamp(168px, 42vw, 210px);\n  object-fit: cover;\n}\n.subevent-asset-view-grid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:disabled, \n.subevent-asset-view-grid[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:disabled {\n  border-color: rgba(126, 142, 164, 0.28);\n  color: rgba(34, 50, 74, 0.62);\n  -webkit-text-fill-color: rgba(34, 50, 74, 0.62);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9fc 0%,\n      #edf1f6 100%);\n  box-shadow: none;\n  opacity: 1;\n  cursor: default;\n}\n.subevent-asset-view-grid[_ngcontent-%COMP%]   .subevent-asset-view-selector[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 42px;\n  box-sizing: border-box;\n  border-color: rgba(126, 142, 164, 0.28) !important;\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9fc 0%,\n      #edf1f6 100%) !important;\n  color: rgba(34, 50, 74, 0.62) !important;\n  box-shadow: none !important;\n  filter: grayscale(0.12);\n  opacity: 1;\n  pointer-events: none;\n  cursor: default;\n}\n.subevent-asset-view-grid[_ngcontent-%COMP%]   .subevent-asset-view-selector[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.subevent-asset-view-grid[_ngcontent-%COMP%]   .subevent-asset-view-selector[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.subevent-asset-view-grid[_ngcontent-%COMP%]   .subevent-asset-view-selector[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.subevent-asset-view-grid[_ngcontent-%COMP%]   .subevent-asset-view-selector[_ngcontent-%COMP%]    > .mat-icon[_ngcontent-%COMP%]:last-child {\n  color: rgba(34, 50, 74, 0.62) !important;\n  opacity: 1;\n}\n.subevent-asset-view-grid.experience-form-grid[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 1fr);\n}\n.subevent-asset-view-image-field[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.35rem;\n  color: #344660;\n  font-weight: 800;\n}\n.subevent-asset-view-source-field[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.35rem;\n  color: #344660;\n  font-weight: 800;\n}\n.subevent-asset-view-source-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:disabled {\n  width: 100%;\n  min-width: 0;\n  min-height: 42px;\n  border: 1px solid rgba(126, 142, 164, 0.28);\n  border-radius: 10px;\n  padding: 0.58rem 0.72rem;\n  color: rgba(34, 50, 74, 0.62);\n  -webkit-text-fill-color: rgba(34, 50, 74, 0.62);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9fc 0%,\n      #edf1f6 100%);\n  font: inherit;\n  font-weight: 800;\n  box-shadow: none;\n  box-sizing: border-box;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  opacity: 1;\n  cursor: default;\n}\n.subevent-asset-view-summary-panel[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.7rem;\n  padding: 0.95rem;\n  border: 1px solid rgba(33, 54, 82, 0.13);\n  border-radius: 14px;\n  background: rgba(255, 255, 255, 0.68);\n}\n.subevent-asset-view-pricing[_ngcontent-%COMP%] {\n  border-color: rgba(40, 133, 112, 0.2);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(236, 251, 245, 0.84),\n      rgba(247, 252, 250, 0.74));\n}\n.subevent-asset-view-policies[_ngcontent-%COMP%] {\n  border-color: rgba(119, 82, 166, 0.18);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(247, 240, 255, 0.84),\n      rgba(252, 249, 255, 0.72));\n}\n.subevent-asset-view-route[_ngcontent-%COMP%] {\n  border-color: rgba(52, 103, 170, 0.18);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(239, 246, 255, 0.9),\n      rgba(248, 251, 255, 0.74));\n}\n.subevent-asset-view-summary-panel[_ngcontent-%COMP%]   .event-policies-panel-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 0.75rem;\n}\n.subevent-asset-view-summary-panel[_ngcontent-%COMP%]   .event-policies-panel-title-wrap[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.18rem;\n}\n.subevent-asset-view-summary-panel[_ngcontent-%COMP%]   .event-policies-panel-title[_ngcontent-%COMP%] {\n  display: inline-grid;\n  grid-template-columns: 20px minmax(0, auto);\n  align-items: center;\n  justify-content: start;\n  line-height: 1.15;\n}\n.subevent-asset-view-summary-panel[_ngcontent-%COMP%]   .event-policies-panel-title[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 20px;\n  height: 20px;\n  font-size: 20px;\n  line-height: 20px;\n  align-self: center;\n}\n.subevent-asset-view-summary-panel[_ngcontent-%COMP%]   .event-policies-panel-title[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  align-self: center;\n}\n.subevent-asset-view-summary-body[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.65rem;\n}\n.subevent-asset-view-summary-body[_ngcontent-%COMP%]   .event-slots-open-btn[_ngcontent-%COMP%], \n.subevent-asset-view-policy-popup-body[_ngcontent-%COMP%]   .event-slots-open-btn[_ngcontent-%COMP%] {\n  min-width: 138px;\n  min-height: 38px;\n  padding: 0.42rem 0.82rem;\n  border-radius: 999px;\n  border: 1px solid rgba(65, 129, 205, 0.34);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.34rem;\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #e8f3ff 100%);\n  color: #1f5f9e;\n  font-size: 0.8rem;\n  font-weight: 800;\n  cursor: pointer;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92), 0 3px 9px rgba(35, 83, 145, 0.12);\n}\n.subevent-asset-view-summary-body[_ngcontent-%COMP%]   .event-slots-open-btn[_ngcontent-%COMP%]:disabled, \n.subevent-asset-view-policy-popup-body[_ngcontent-%COMP%]   .event-slots-open-btn[_ngcontent-%COMP%]:disabled {\n  cursor: default;\n  border-color: rgba(128, 149, 176, 0.18);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9fc 0%,\n      #eef3f8 100%);\n  color: #8a9ab0;\n  box-shadow: none;\n  opacity: 1;\n}\n.subevent-asset-view-summary-body[_ngcontent-%COMP%]   .event-slots-open-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.subevent-asset-view-policy-popup-body[_ngcontent-%COMP%]   .event-slots-open-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n@media (hover: hover) and (pointer: fine) {\n  .subevent-asset-view-summary-body[_ngcontent-%COMP%]   .event-slots-open-btn[_ngcontent-%COMP%]:not(:disabled):hover, \n   .subevent-asset-view-policy-popup-body[_ngcontent-%COMP%]   .event-slots-open-btn[_ngcontent-%COMP%]:not(:disabled):hover {\n    transform: translateY(-1px);\n    border-color: rgba(48, 111, 190, 0.46);\n    background:\n      linear-gradient(\n        180deg,\n        #ffffff 0%,\n        #dcecff 100%);\n    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.96), 0 6px 14px rgba(35, 83, 145, 0.16);\n  }\n}\n.subevent-asset-view-summary-body[_ngcontent-%COMP%]   .event-slots-summary[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.55rem;\n}\n.subevent-asset-view-summary-body[_ngcontent-%COMP%]   .event-slots-summary-block[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.4rem;\n  padding: 0.8rem 0.92rem;\n  border: 1px solid rgba(33, 54, 82, 0.12);\n  border-radius: 12px;\n  background: rgba(255, 255, 255, 0.76);\n}\n.subevent-asset-view-summary-body[_ngcontent-%COMP%]   .event-slots-summary-label[_ngcontent-%COMP%] {\n  color: #61708a;\n  font-size: 0.72rem;\n  font-weight: 900;\n  text-transform: uppercase;\n}\n.subevent-asset-view-summary-body[_ngcontent-%COMP%]   .event-slots-summary-list[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.45rem;\n}\n.subevent-asset-view-summary-body[_ngcontent-%COMP%]   .event-slots-summary-item[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.14rem;\n}\n.subevent-asset-view-summary-body[_ngcontent-%COMP%]   .event-slots-summary-title[_ngcontent-%COMP%] {\n  color: #233653;\n  font-weight: 900;\n}\n.subevent-asset-view-summary-body[_ngcontent-%COMP%]   .event-slots-summary-meta[_ngcontent-%COMP%], \n.subevent-asset-view-summary-body[_ngcontent-%COMP%]   .event-slots-summary-note[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #60708a;\n  line-height: 1.4;\n}\n.subevent-asset-view-summary-status[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 54px;\n  min-height: 30px;\n  padding: 0.25rem 0.7rem;\n  border-radius: 999px;\n  border: 1px solid rgba(36, 135, 92, 0.32);\n  background: rgba(217, 247, 226, 0.78);\n  color: #196b45;\n  font-size: 0.78rem;\n  font-weight: 900;\n}\n.subevent-asset-view-summary-status.is-off[_ngcontent-%COMP%] {\n  border-color: rgba(120, 132, 150, 0.22);\n  background: rgba(241, 245, 249, 0.86);\n  color: #5a6b7f;\n}\n.subevent-asset-view-summary-card[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.45rem;\n  padding: 0.85rem 1rem;\n  border: 1px solid rgba(33, 54, 82, 0.12);\n  border-radius: 12px;\n  background: rgba(255, 255, 255, 0.84);\n  color: #22324a;\n}\n.subevent-asset-view-summary-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #60708a;\n  line-height: 1.4;\n}\n.subevent-asset-view-summary-card-muted[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.58);\n}\n.subevent-asset-view-price-row[_ngcontent-%COMP%], \n.subevent-asset-view-price-final[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.75rem;\n}\n.subevent-asset-view-price-row[_ngcontent-%COMP%] {\n  padding-bottom: 0.4rem;\n  border-bottom: 1px solid rgba(33, 54, 82, 0.1);\n}\n.subevent-asset-view-price-final[_ngcontent-%COMP%] {\n  font-size: 1.08rem;\n  font-weight: 900;\n}\n.subevent-asset-view-price-final[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #168061;\n  font-size: 1.4rem;\n}\n.subevent-asset-view-policy-summary[_ngcontent-%COMP%] {\n  padding: 0.55rem 0.7rem;\n  border: 1px solid rgba(116, 78, 158, 0.13);\n  border-radius: 10px;\n  background: rgba(255, 255, 255, 0.72);\n  color: #5a4b7c;\n  font-weight: 900;\n}\n.subevent-asset-view-policy-list[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.55rem;\n}\n.subevent-asset-view-policy-row[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.35rem;\n  padding: 0.7rem 0.8rem;\n  border: 1px solid rgba(116, 78, 158, 0.14);\n  border-radius: 10px;\n  background: rgba(255, 255, 255, 0.82);\n}\n.subevent-asset-view-policy-row[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.75rem;\n}\n.subevent-asset-view-policy-row[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  min-width: 0;\n  color: #22324a;\n}\n.subevent-asset-view-policy-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  padding: 0.18rem 0.5rem;\n  border-radius: 999px;\n  background: rgba(239, 232, 255, 0.9);\n  color: #60468e;\n  font-size: 0.72rem;\n  font-weight: 900;\n}\n.subevent-asset-view-policy-row[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #62728a;\n  line-height: 1.4;\n}\n.subevent-asset-view-policy-backdrop[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  z-index: 14;\n  border-radius: inherit;\n  background: rgba(24, 35, 52, 0.28);\n  -webkit-backdrop-filter: blur(2px);\n  backdrop-filter: blur(2px);\n}\n.subevent-asset-view-policy-popup[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  z-index: 15;\n  width: min(500px, 100% - 2rem);\n  max-height: min(620px, 100% - 2rem);\n  transform: translate(-50%, -50%);\n  display: grid;\n  grid-template-rows: auto minmax(0, 1fr);\n  overflow: hidden;\n  border: 1px solid rgba(33, 54, 82, 0.15);\n  border-radius: 16px;\n  background: #ffffff;\n  box-shadow: 0 18px 42px rgba(28, 42, 66, 0.22);\n}\n.subevent-asset-view-policy-popup-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.75rem;\n  padding: 0.9rem 1rem;\n  border-bottom: 1px solid rgba(33, 54, 82, 0.12);\n}\n.subevent-asset-view-policy-popup-head[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.15rem;\n}\n.subevent-asset-view-policy-popup-title[_ngcontent-%COMP%] {\n  color: #17243a;\n  font-size: 1.08rem;\n  font-weight: 900;\n}\n.subevent-asset-view-policy-popup-subtitle[_ngcontent-%COMP%] {\n  color: #60708a;\n  font-size: 0.82rem;\n  font-weight: 700;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.subevent-asset-view-policy-popup-body[_ngcontent-%COMP%] {\n  min-height: 0;\n  overflow: auto;\n  padding: 0.9rem;\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff,\n      #f8fbff);\n}\n.subevent-asset-view-route-list[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.45rem;\n}\n.subevent-asset-view-route-list[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.55rem;\n  padding: 0.6rem 0.75rem;\n  border: 1px solid rgba(33, 54, 82, 0.14);\n  border-radius: 8px;\n  background: rgba(255, 255, 255, 0.82);\n  color: #22324a;\n  font-weight: 700;\n}\n.subevent-asset-view-route-list[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n@media (hover: hover) and (pointer: fine) {\n  .event-resource-popup-shell[_ngcontent-%COMP%]   .assets-toolbar[_ngcontent-%COMP%]   .profile-status-select-wrap[_ngcontent-%COMP%]:hover, \n   .event-resource-popup-shell[_ngcontent-%COMP%]   .assets-toolbar[_ngcontent-%COMP%]   .profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%]:hover, \n   .event-resource-popup-shell[_ngcontent-%COMP%]   .event-editor-members-trigger[_ngcontent-%COMP%]:hover, \n   .event-resource-popup-shell[_ngcontent-%COMP%]   .event-editor-members-trigger[_ngcontent-%COMP%]:active, \n   .event-resource-popup-shell[_ngcontent-%COMP%]   .assets-toolbar[_ngcontent-%COMP%]   .profile-status-select-wrap[_ngcontent-%COMP%]:active, \n   .event-resource-popup-shell[_ngcontent-%COMP%]   .assets-toolbar[_ngcontent-%COMP%]   .profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%]:active {\n    transform: none;\n    filter: none;\n  }\n  .event-resource-popup-shell[_ngcontent-%COMP%]   .assets-toolbar[_ngcontent-%COMP%]   .profile-status-select-wrap[_ngcontent-%COMP%]:hover {\n    box-shadow: 0 4px 11px rgba(37, 72, 116, 0.16);\n  }\n}\n@media (max-width: 760px) {\n  .event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-asset-view-popup[_ngcontent-%COMP%] {\n    width: min(100vw - 1rem, 420px);\n  }\n  .subevent-asset-view-panel[_ngcontent-%COMP%] {\n    gap: 0.78rem;\n    padding: 0.72rem;\n  }\n  .event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-asset-view-media[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n    height: clamp(158px, 44vw, 178px);\n  }\n  .event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-asset-view-grid.experience-form-grid[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n    row-gap: 0.72rem;\n  }\n  .event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-asset-view-grid.experience-form-grid[_ngcontent-%COMP%]    > label[_ngcontent-%COMP%], \n   .event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-asset-view-grid[_ngcontent-%COMP%]   .experience-description-field[_ngcontent-%COMP%], \n   .event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-asset-view-summary-panel[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n  }\n  .event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-asset-view-summary-panel[_ngcontent-%COMP%] {\n    padding: 0.78rem;\n    border-radius: 14px;\n  }\n  .subevent-asset-view-route[_ngcontent-%COMP%] {\n    gap: 0.5rem;\n  }\n  .subevent-asset-view-route[_ngcontent-%COMP%]   .event-policies-panel-title-wrap[_ngcontent-%COMP%] {\n    gap: 0.24rem;\n  }\n  .subevent-asset-view-route[_ngcontent-%COMP%]   .event-policies-panel-subtitle[_ngcontent-%COMP%] {\n    margin-bottom: 0.12rem;\n  }\n  .subevent-asset-view-route[_ngcontent-%COMP%]   .subevent-asset-view-summary-body[_ngcontent-%COMP%] {\n    gap: 0.48rem;\n  }\n  .event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-asset-view-pricing[_ngcontent-%COMP%]   .subevent-asset-view-summary-body[_ngcontent-%COMP%], \n   .event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-asset-view-policies[_ngcontent-%COMP%]   .subevent-asset-view-summary-body[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-asset-view-pricing[_ngcontent-%COMP%]   .subevent-asset-view-summary-card[_ngcontent-%COMP%] {\n    min-height: 0;\n  }\n  .event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-asset-view-summary-body[_ngcontent-%COMP%]   .event-slots-open-btn[_ngcontent-%COMP%], \n   .event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-asset-view-policy-popup-body[_ngcontent-%COMP%]   .event-slots-open-btn[_ngcontent-%COMP%] {\n    justify-self: start;\n    width: auto;\n  }\n  .subevent-asset-view-policy-popup[_ngcontent-%COMP%] {\n    inset: auto 0 0 0;\n    top: auto;\n    left: 0;\n    width: 100%;\n    max-height: min(70dvh, 560px);\n    transform: none;\n    border-radius: 18px 18px 0 0;\n  }\n  .event-resource-popup-shell[_ngcontent-%COMP%]   .experience-form-overlay[_ngcontent-%COMP%] {\n    position: fixed;\n    inset: 0;\n    z-index: 80;\n    width: auto;\n    height: auto;\n    padding: 0;\n    transform: none;\n    align-items: stretch;\n    justify-content: stretch;\n  }\n  .event-resource-popup-shell[_ngcontent-%COMP%]   .experience-form-popup[_ngcontent-%COMP%], \n   .event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-group-popup[_ngcontent-%COMP%] {\n    width: 100vw;\n    max-width: 100vw;\n    height: 100dvh;\n    max-height: 100dvh;\n    min-height: 100dvh;\n    border-radius: 0;\n  }\n  .event-resource-popup-shell[_ngcontent-%COMP%]   .experience-form-panel[_ngcontent-%COMP%] {\n    min-height: 0;\n    flex: 1 1 auto;\n    border-radius: 0;\n  }\n  .event-resource-popup-shell[_ngcontent-%COMP%]   .asset-route-row[_ngcontent-%COMP%] {\n    gap: 0.48rem;\n  }\n  .event-resource-popup-shell[_ngcontent-%COMP%]   .asset-route-drag-btn[_ngcontent-%COMP%], \n   .event-resource-popup-shell[_ngcontent-%COMP%]   .asset-route-map-btn[_ngcontent-%COMP%], \n   .event-resource-popup-shell[_ngcontent-%COMP%]   .asset-route-delete-btn[_ngcontent-%COMP%], \n   .event-resource-popup-shell[_ngcontent-%COMP%]   .asset-route-add-btn[_ngcontent-%COMP%], \n   .event-resource-popup-shell[_ngcontent-%COMP%]   .subevent-asset-capacity-overlay[_ngcontent-%COMP%]   .experience-action-btn[_ngcontent-%COMP%] {\n    width: 28px;\n    height: 28px;\n  }\n  .event-resource-popup-shell[_ngcontent-%COMP%]   .asset-route-toolbar-actions[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, 28px);\n    gap: 0.38rem;\n  }\n  .asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-popup[_ngcontent-%COMP%] {\n    width: 100vw;\n    max-width: 100vw;\n    height: 100dvh;\n    max-height: 100dvh;\n    min-height: 100dvh;\n    border-radius: 0;\n  }\n  .asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-panel[_ngcontent-%COMP%] {\n    padding: 0.85rem 0.8rem calc(1rem + env(safe-area-inset-bottom));\n    border-radius: 0;\n  }\n  .asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-slot__row[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n    gap: 0.5rem;\n  }\n  .asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-review-card__head[_ngcontent-%COMP%], \n   .asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-review-card__item[_ngcontent-%COMP%], \n   .asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-policy-card[_ngcontent-%COMP%], \n   .asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-actions[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: stretch;\n  }\n  .asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-payment-summary[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-payment-grid[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-confirm-shell[_ngcontent-%COMP%], \n   .asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-borrow-actions__btn--primary[_ngcontent-%COMP%] {\n    min-width: 0;\n  }\n  .asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-category-field[_ngcontent-%COMP%] {\n    width: fit-content !important;\n    min-width: 0 !important;\n    max-width: 154px;\n  }\n  .asset-explore-shell[_ngcontent-%COMP%]   .assets-badge-form-field[_ngcontent-%COMP%] {\n    width: min(286px, 100vw - 8rem);\n    min-width: min(286px, 100vw - 8rem);\n    max-width: none;\n  }\n  .asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-smart-list[_ngcontent-%COMP%], \n   .asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-card-list[_ngcontent-%COMP%] {\n    min-height: 0;\n  }\n  .asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-basket[_ngcontent-%COMP%] {\n    right: 0.55rem;\n    bottom: 0.7rem;\n  }\n  .asset-explore-shell[_ngcontent-%COMP%]   .asset-explore-basket-panel[_ngcontent-%COMP%] {\n    width: min(320px, 100vw - 1.2rem);\n  }\n}\n/*# sourceMappingURL=event-resource-popup.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EventResourcePopupComponent, [{
    type: Component,
    args: [{ selector: "app-event-resource-popup", standalone: true, imports: [
      CommonModule,
      FormsModule,
      PopupComponent,
      EventResourceListComponent
    ], template: '@if (!resourcePopupStore.assetExploreOnlyRef() || resourceAssetView()) {\n  <app-popup\n    class="event-resource-popup-shell"\n    [class.event-resource-popup-shell--standalone-asset-view]="resourcePopupStore.resourceAssetViewReturnToChatRef()"\n    [class.event-resource-popup-shell--asset-explore-view]="resourcePopupStore.assetExploreOnlyRef() && resourceAssetView()"\n    [model]="resourcePopupModel()"\n    [zIndex]="resourcePopupZIndex()"\n  >\n    <div class="experience-popup assets-popup subevent-assets-popup">\n      @if (!resourcePopupStore.resourceAssetViewReturnToChatRef() && !resourcePopupStore.assetExploreOnlyRef()) {\n        <app-event-resource-list\n          [model]="resourceListModel()"\n          (filterSelected)="selectResourceFilter($event)"\n          (assignRequested)="openAssignPopup($event)"\n          (exploreRequested)="openExplorePopup($event)"\n          (mapRequested)="openResourceMap($event)"\n          (badgeDetailsRequested)="openResourceBadgeDetails($event)"\n          (cardActionRequested)="onResourceCardMenuAction($event.card, $event.event)"\n        ></app-event-resource-list>\n      }\n\n      @if (resourceAssetView()) {\n        @if (resourcePopupStore.eventResourceAssetViewComponent(); as assetViewComponent) {\n          <ng-container *ngComponentOutlet="assetViewComponent; inputs: resourceAssetViewOutletInputs()"></ng-container>\n        }\n      }\n\n    </div>\n  </app-popup>\n}\n\n@if (activitiesStore.eventMembersPopupComponent(); as membersComponent) {\n  <ng-container *ngComponentOutlet="membersComponent; inputs: membersPopupOutletInputs()"></ng-container>\n}\n', styles: ['/* src/app/activity/components/event-resource-popup/event-resource-popup.component.scss */\n:host {\n  display: contents;\n  --line: rgba(23, 33, 54, 0.12);\n  --line-strong: rgba(23, 33, 54, 0.2);\n  --text-main: #22324a;\n  --text-muted: rgba(23, 41, 66, 0.72);\n}\n.app-popup {\n  position: fixed;\n  inset: 0;\n  z-index: 2300;\n  display: flex;\n  align-items: flex-start;\n  justify-content: center;\n  padding: 1rem;\n}\n.app-popup-backdrop {\n  position: absolute;\n  inset: 0;\n  background: #e9edf5;\n}\n.app-popup-panel {\n  position: relative;\n  z-index: 1;\n  width: min(1080px, 100vw - 1.2rem);\n  max-height: calc(100vh - 1.2rem);\n  max-height: calc(100dvh - 1.2rem);\n  border-radius: 14px;\n  background: #fff;\n  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.26);\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n}\n.app-popup-panel.popup-panel-wide {\n  width: min(1080px, 100vw - 1.2rem);\n}\n.app-popup-panel.popup-panel-full-height {\n  height: calc(100vh - 1.2rem);\n  height: calc(100dvh - 1.2rem);\n  max-height: calc(100vh - 1.2rem);\n  max-height: calc(100dvh - 1.2rem);\n}\n.app-popup-panel.popup-panel-image-editor {\n  height: calc(100vh - 1.2rem);\n  height: calc(100dvh - 1.2rem);\n}\n.app-popup-panel.popup-panel-profile-editor {\n  width: min(1080px, 100vw - 1.2rem);\n  height: calc(100vh - 1.2rem);\n  height: calc(100dvh - 1.2rem);\n}\n.app-popup-panel.popup-panel-profile-selector {\n  width: min(1080px, 100vw - 1.2rem);\n  height: calc(100vh - 1.2rem);\n  height: calc(100dvh - 1.2rem);\n}\n.popup-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 0.4rem;\n  padding: 0.58rem 0.4rem;\n  border-bottom: 1px solid var(--line);\n  position: relative;\n}\n.popup-header > .popup-title {\n  min-width: 0;\n  flex: 1 1 auto;\n}\n.popup-header.popup-header-with-back {\n  justify-content: flex-start;\n}\n.popup-title h2 {\n  margin: 0;\n  font-size: 1.05rem;\n  color: var(--text-main);\n  font-weight: 700;\n}\n.popup-subtitle,\n.popup-subtitle-activities {\n  margin: 0.14rem 0 0;\n  font-size: 0.74rem;\n  font-weight: 700;\n  color: rgba(21, 39, 62, 0.72);\n}\n.popup-subtitle-secondary,\n.popup-subtitle-activities-secondary {\n  margin-top: 0.04rem;\n  font-size: 0.68rem;\n  font-weight: 800;\n  letter-spacing: 0.01em;\n  color: rgba(21, 39, 62, 0.58);\n}\n.popup-body {\n  padding: 0.4rem;\n  overflow-y: auto;\n  overflow-x: hidden;\n  display: flex;\n  flex-direction: column;\n  gap: 0.72rem;\n  flex: 1 1 auto;\n  min-height: 0;\n}\n.popup-body.popup-body-experience {\n  position: relative;\n  padding-bottom: 0.74rem;\n}\n.popup-close {\n  flex: 0 0 auto;\n  width: 34px;\n  height: 34px;\n  min-width: 34px;\n  min-height: 34px;\n  border: 1px solid rgba(47, 86, 139, 0.2);\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.92);\n  color: rgba(38, 67, 105, 0.92);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  padding: 0;\n  line-height: 0;\n  box-sizing: border-box;\n  box-shadow: 0 8px 18px rgba(37, 62, 95, 0.12);\n  --mdc-icon-button-state-layer-size: 34px;\n}\n.popup-close .mat-icon {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 21px;\n  height: 21px;\n  font-size: 21px;\n  line-height: 21px;\n  margin: 0;\n}\n.popup-close:not(:disabled):not([aria-disabled=true]):hover {\n  border-color: rgba(47, 86, 139, 0.32);\n  background: #fff;\n  color: rgba(24, 50, 84, 0.98);\n}\n.popup-close:not(:disabled):not([aria-disabled=true]):active {\n  background: rgba(239, 245, 252, 0.96);\n}\n.popup-close:focus-visible {\n  outline: 2px solid rgba(61, 108, 186, 0.35);\n  outline-offset: 1px;\n}\n.popup-close:disabled,\n.popup-close[aria-disabled=true] {\n  opacity: 0.56;\n  cursor: default;\n}\n.popup-header-with-progress,\n.popup-header-with-activities-progress {\n  border-bottom-color: rgba(46, 114, 184, 0.2);\n}\n.popup-surface-overlay,\n.experience-form-overlay {\n  position: fixed;\n  inset: 0;\n  z-index: 15;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0.9rem;\n}\n.popup-surface-overlay-backdrop,\n.experience-form-overlay-backdrop {\n  position: absolute;\n  inset: 0;\n  background: rgba(8, 16, 30, 0.76);\n}\n.popup-surface,\n.experience-form-popup {\n  position: relative;\n  z-index: 1;\n  width: min(860px, 100vw - 2rem);\n  max-height: calc(100vh - 1.8rem);\n  overflow: hidden;\n  border-radius: 16px;\n  background: #fff;\n  box-sizing: border-box;\n  border: 1px solid rgba(42, 66, 102, 0.28);\n  box-shadow: 0 24px 60px rgba(14, 32, 58, 0.26);\n  display: flex;\n  flex-direction: column;\n  contain: layout paint;\n}\n.popup-surface-header,\n.experience-form-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.6rem;\n  padding: 0.82rem 1rem;\n  border-bottom: 1px solid var(--line);\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #f4f8ff 100%);\n}\n.popup-surface-header-title {\n  min-width: 0;\n  display: inline-flex;\n  flex-direction: column;\n  gap: 0.08rem;\n}\n.popup-surface-header h3,\n.experience-form-header h3 {\n  margin: 0;\n  font-size: 1.12rem;\n  color: var(--text-main);\n  font-weight: 700;\n}\n.popup-surface-header-title p {\n  margin: 0;\n  font-size: 0.78rem;\n  color: rgba(53, 79, 114, 0.86);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.popup-surface-header-controls,\n.experience-form-header-controls {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.44rem;\n}\n.popup-header-add-btn {\n  width: 30px;\n  height: 30px;\n  border: 1px solid rgba(30, 88, 152, 0.46);\n  border-radius: 50%;\n  background:\n    linear-gradient(\n      180deg,\n      #e2f0ff 0%,\n      #c5dbf8 100%);\n  color: #15457c;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  box-shadow: 0 2px 8px rgba(31, 79, 132, 0.18);\n}\n.popup-header-add-btn .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  pointer-events: none;\n}\n.popup-header-add-btn:hover {\n  background:\n    linear-gradient(\n      180deg,\n      #d4e8ff 0%,\n      #b5d1f3 100%);\n  border-color: rgba(27, 74, 130, 0.6);\n  color: #103966;\n  box-shadow: 0 4px 10px rgba(28, 69, 114, 0.24);\n}\n.popup-header-add-btn:active:not(:disabled) {\n  box-shadow: 0 1px 4px rgba(36, 74, 121, 0.2);\n}\n.popup-header-add-btn.subevent-leaderboard-save-btn {\n  border-color: rgba(46, 121, 69, 0.46);\n  background:\n    linear-gradient(\n      180deg,\n      #e6faec 0%,\n      #c9f0d5 100%);\n  color: #1f6f39;\n}\n.popup-header-add-btn.subevent-leaderboard-save-btn:hover {\n  border-color: rgba(38, 98, 58, 0.64);\n  background:\n    linear-gradient(\n      180deg,\n      #d8f5e2 0%,\n      #b8e8c8 100%);\n  color: #175a2d;\n}\n.popup-header-add-btn:disabled {\n  opacity: 0.54;\n  cursor: not-allowed;\n  box-shadow: 0 2px 8px rgba(31, 79, 132, 0.12);\n}\n.popup-header-add-btn.form-save-invalid,\n.popup-header-add-btn.form-save-invalid:disabled {\n  border-color: rgba(147, 31, 31, 0.86);\n  background:\n    linear-gradient(\n      180deg,\n      #ef5c5c 0%,\n      #cb2f2f 100%);\n  color: #fff;\n  opacity: 1;\n  box-shadow: 0 2px 8px rgba(122, 25, 25, 0.22);\n}\n.popup-surface-close-btn,\n.experience-form-close-btn {\n  width: 34px;\n  height: 34px;\n  border: 0;\n  border-radius: 50%;\n  background: transparent;\n  color: rgba(42, 57, 77, 0.88);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  padding: 0;\n}\n.popup-surface-close-btn .mat-icon,\n.experience-form-close-btn .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  pointer-events: none;\n}\n.popup-surface-close-btn:not(:disabled):not([aria-disabled=true]):hover,\n.experience-form-close-btn:not(:disabled):not([aria-disabled=true]):hover {\n  background: rgba(110, 124, 145, 0.18);\n  color: rgba(28, 40, 57, 0.94);\n}\n.popup-surface-close-btn:not(:disabled):not([aria-disabled=true]):active,\n.experience-form-close-btn:not(:disabled):not([aria-disabled=true]):active {\n  background: rgba(96, 111, 134, 0.24);\n}\n.popup-surface-body,\n.experience-form-panel {\n  border: 1px solid rgba(43, 71, 107, 0.2);\n  border-radius: 14px;\n  background: #f8fbff;\n  padding: 0.74rem;\n  display: grid;\n  gap: 0.78rem;\n  margin: 0;\n  box-sizing: border-box;\n  flex: 1 1 auto;\n  min-height: 0;\n  align-items: start;\n  align-content: start;\n  overflow-y: auto;\n  overflow-x: hidden;\n  -webkit-overflow-scrolling: touch;\n  scrollbar-gutter: stable;\n}\n.mobile-profile-selector-sheet-wrap {\n  position: fixed;\n  inset: 0;\n  z-index: 2800;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 1rem;\n}\n.mobile-profile-selector-backdrop {\n  position: absolute;\n  inset: 0;\n  background: rgba(8, 16, 30, 0.5);\n}\n.mobile-profile-selector-sheet {\n  position: relative;\n  width: fit-content;\n  min-width: 230px;\n  max-width: min(92vw, 420px);\n  max-height: min(78vh, 620px);\n  border-radius: 16px;\n  border: 1px solid #d6deea;\n  background: #fff;\n  box-shadow: 0 16px 32px rgba(15, 29, 52, 0.24);\n  padding: 0.4rem 0.6rem 0.58rem;\n  display: flex;\n  flex-direction: column;\n}\n.mobile-profile-selector-sheet.mobile-profile-selector-sheet-language {\n  width: min(94vw, 620px);\n  min-width: 340px;\n  max-width: min(94vw, 620px);\n  height: min(78vh, 620px);\n  max-height: min(78vh, 620px);\n}\n.mobile-profile-selector-sheet.mobile-profile-selector-sheet-language .mobile-profile-selector-title,\n.mobile-profile-selector-sheet.mobile-profile-selector-sheet-language .mobile-profile-language-entry {\n  flex: 0 0 auto;\n  width: 100%;\n}\n.mobile-profile-selector-sheet.mobile-profile-selector-sheet-language .mobile-profile-language-chips {\n  width: 100%;\n  align-content: flex-start;\n}\n.mobile-profile-selector-sheet.mobile-profile-selector-sheet-language .mobile-profile-selector-options {\n  flex: 1 1 auto;\n  overflow-x: hidden;\n  overflow-y: auto;\n  margin-top: 0.18rem;\n  justify-items: stretch;\n  align-content: start;\n  grid-auto-rows: max-content;\n}\n.mobile-profile-selector-sheet.mobile-profile-selector-sheet-language .mobile-profile-selector-option {\n  width: 100%;\n  min-width: 0;\n  min-height: 46px;\n}\n.mobile-profile-selector-handle {\n  width: 42px;\n  height: 4px;\n  border-radius: 999px;\n  background: rgba(44, 67, 100, 0.24);\n  margin: 0.08rem auto 0.52rem;\n}\n.mobile-profile-selector-title {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  padding: 0 0.14rem;\n  color: #1c3354;\n  font-size: 0.94rem;\n  font-weight: 800;\n  position: relative;\n}\n.mobile-profile-selector-close-btn {\n  margin-left: auto;\n  width: 34px;\n  height: 34px;\n  border: 0;\n  border-radius: 50%;\n  background: transparent;\n  color: rgba(42, 57, 77, 0.88);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  cursor: pointer;\n}\n.mobile-profile-selector-close-btn .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.mobile-profile-selector-close-btn:not(:disabled):not([aria-disabled=true]):hover {\n  background: rgba(110, 124, 145, 0.18);\n  color: rgba(28, 40, 57, 0.94);\n}\n.mobile-profile-selector-close-btn:not(:disabled):not([aria-disabled=true]):active {\n  background: rgba(96, 111, 134, 0.24);\n}\n.mobile-profile-selector-options {\n  margin-top: 0.42rem;\n  display: grid;\n  gap: 0.32rem;\n  justify-items: center;\n  max-height: min(64vh, 520px);\n  overflow: auto;\n  overscroll-behavior: contain;\n}\n.mobile-profile-selector-option {\n  width: max-content;\n  min-width: 220px;\n  max-width: 100%;\n  border: 1px solid rgba(58, 81, 114, 0.24);\n  border-radius: 12px;\n  background: #f7f9fd;\n  color: #1f3f67;\n  min-height: 42px;\n  padding: 0.46rem 0.62rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: space-between;\n}\n.mobile-profile-selector-option-main {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n  min-width: 0;\n  text-align: left;\n}\n.mobile-profile-selector-option.active {\n  box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.24);\n  filter: brightness(0.95);\n}\n@media (max-width: 760px) {\n  .app-popup {\n    padding: 0;\n    align-items: stretch;\n  }\n  .app-popup-panel,\n  .app-popup-panel.popup-panel-profile-editor,\n  .app-popup-panel.popup-panel-profile-selector,\n  .app-popup-panel.popup-panel-image-editor {\n    width: 100vw !important;\n    max-width: 100vw !important;\n    height: 100vh !important;\n    height: 100dvh !important;\n    max-height: 100vh !important;\n    max-height: 100dvh !important;\n    min-height: 100dvh;\n    margin: 0 !important;\n    border-radius: 0;\n    box-shadow: none;\n  }\n  .experience-form-overlay {\n    padding: 0;\n    align-items: stretch;\n    justify-content: stretch;\n  }\n  .experience-form-popup {\n    width: 100vw;\n    max-width: 100vw;\n    height: 100svh;\n    height: 100vh;\n    height: 100dvh;\n    max-height: 100svh;\n    max-height: 100vh;\n    max-height: 100dvh;\n    border-radius: 0;\n  }\n  .experience-form-panel {\n    min-height: 0;\n    flex: 1 1 auto;\n    border-radius: 0;\n  }\n  .app-popup-panel.popup-panel-profile-editor .popup-body {\n    display: flex !important;\n    flex-direction: column;\n    min-height: 0;\n    height: 100%;\n    overflow: hidden !important;\n    overflow-x: hidden !important;\n    padding-bottom: 0;\n  }\n  .app-popup-panel.popup-panel-profile-editor .profile-editor-wrap {\n    display: grid;\n    grid-template-rows: auto minmax(0, 1fr);\n    min-height: 0;\n    height: 100%;\n    overflow: hidden;\n  }\n  .app-popup-panel.popup-panel-profile-editor .profile-editor-scroll-area {\n    flex: 1 1 auto;\n    min-height: 0;\n    max-height: none;\n    overflow-y: auto !important;\n    overflow-x: hidden !important;\n    padding-bottom: calc(0.74rem + env(safe-area-inset-bottom));\n    scroll-padding-bottom: calc(0.74rem + env(safe-area-inset-bottom));\n    overscroll-behavior: contain;\n    -webkit-overflow-scrolling: touch;\n  }\n  .popup-surface-overlay,\n  .experience-form-overlay {\n    padding: 0;\n    align-items: stretch;\n    justify-content: stretch;\n  }\n  .popup-surface,\n  .experience-form-popup {\n    width: 100%;\n    max-width: 100%;\n    min-width: 0;\n    height: 100dvh;\n    max-height: 100dvh;\n    border-radius: 0;\n  }\n  .popup-surface-body,\n  .experience-form-panel {\n    min-height: 0;\n    flex: 1 1 auto;\n    border-radius: 0;\n  }\n  .mobile-profile-selector-sheet-wrap {\n    display: block;\n    padding: 0;\n  }\n  .mobile-profile-selector-sheet {\n    position: absolute;\n    left: 0.65rem;\n    right: 0.65rem;\n    bottom: 0;\n    width: auto;\n    box-sizing: border-box;\n    min-width: 0;\n    max-width: 100vw;\n    max-height: calc(100dvh - 0.4rem);\n    border-radius: 16px 16px 0 0;\n    border-bottom: 0;\n    box-shadow: 0 -16px 32px rgba(15, 29, 52, 0.24);\n    padding: 0.4rem 0.6rem max(0.58rem, env(safe-area-inset-bottom));\n  }\n  .mobile-profile-selector-sheet.mobile-profile-selector-sheet-language {\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    width: 100vw;\n    max-width: 100vw;\n    height: var(--mobile-language-sheet-height, 100svh);\n    max-height: var(--mobile-language-sheet-height, 100svh);\n    border-radius: 0;\n    padding: max(0.4rem, env(safe-area-inset-top)) 0.6rem max(0.58rem, env(safe-area-inset-bottom));\n    display: flex;\n    flex-direction: column;\n  }\n  .mobile-profile-selector-options {\n    justify-items: stretch;\n    max-height: none;\n    flex: 1 1 auto;\n  }\n  .mobile-profile-selector-option {\n    width: 100%;\n    min-width: 0;\n  }\n  .app-popup-panel.popup-panel-image-editor {\n    height: 100vh !important;\n    height: 100dvh !important;\n  }\n  .popup-body.popup-body-image-editor {\n    height: calc(100vh - 58px);\n    height: calc(100dvh - 58px);\n    padding: 0.45rem;\n  }\n}\n:host {\n  --interactive-motion-duration: 160ms;\n  --interactive-motion-ease: cubic-bezier(0.22, 1, 0.36, 1);\n  --interactive-hover-lift: -1px;\n  --interactive-hover-scale: 1.01;\n  --interactive-hover-brightness: 1.01;\n  --interactive-press-scale: 0.97;\n  --interactive-press-brightness: 0.97;\n}\n:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]) {\n  -webkit-tap-highlight-color: transparent;\n  transition:\n    transform var(--interactive-motion-duration) var(--interactive-motion-ease),\n    filter var(--interactive-motion-duration) var(--interactive-motion-ease),\n    box-shadow var(--interactive-motion-duration) var(--interactive-motion-ease),\n    background-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    border-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    color var(--interactive-motion-duration) var(--interactive-motion-ease);\n  transform-origin: center;\n}\n:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):focus-visible {\n  outline: 2px solid rgba(66, 110, 182, 0.44);\n  outline-offset: 2px;\n}\n@media (hover: hover) and (pointer: fine) {\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):hover {\n    transform: translateY(var(--interactive-hover-lift)) scale(var(--interactive-hover-scale));\n    filter: brightness(var(--interactive-hover-brightness));\n  }\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  :where(.motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):hover {\n    box-shadow: 0 3px 10px rgba(16, 29, 48, 0.14);\n  }\n}\n@keyframes shared-mobile-touch-feedback {\n  0% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n  45% {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  100% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n}\n@media (hover: none), (pointer: coarse) {\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    animation: shared-mobile-touch-feedback 0.2s ease;\n  }\n}\n.app-popup,\n.mobile-profile-selector-sheet-wrap,\n.popup-surface,\n.experience-form-popup {\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.app-popup button,\n.app-popup input,\n.app-popup textarea,\n.app-popup select,\n.app-popup .mat-mdc-select,\n.app-popup .mat-mdc-select-value-text,\n.app-popup .mat-mdc-option,\n.popup-surface button,\n.popup-surface input,\n.popup-surface textarea,\n.popup-surface select,\n.popup-surface .mat-mdc-select,\n.popup-surface .mat-mdc-select-value-text,\n.popup-surface .mat-mdc-option,\n.experience-form-popup button,\n.experience-form-popup input,\n.experience-form-popup textarea,\n.experience-form-popup select,\n.experience-form-popup .mat-mdc-select,\n.experience-form-popup .mat-mdc-select-value-text,\n.experience-form-popup .mat-mdc-option,\n.mobile-profile-selector-sheet-wrap button,\n.mobile-profile-selector-sheet-wrap input,\n.mobile-profile-selector-sheet-wrap .mat-mdc-option {\n  font-family: inherit;\n}\n.popup-filter-picker,\n.activities-view-picker {\n  position: relative;\n  z-index: 60;\n  margin-left: auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-filter-picker-secondary,\n.activities-secondary-picker {\n  position: relative;\n  z-index: 61;\n}\n.selector-like {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n}\n.profile-status-select-wrap.popup-compact-select,\n.profile-status-select-wrap.activities-compact-select,\n.profile-status-select-wrap.assets-compact-select {\n  width: fit-content !important;\n  min-width: 0 !important;\n  max-width: 100%;\n}\n.profile-status-select-wrap.popup-compact-select .mat-mdc-select,\n.profile-status-select-wrap.activities-compact-select .mat-mdc-select,\n.profile-status-select-wrap.assets-compact-select .mat-mdc-select {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select .mat-mdc-select-trigger,\n.profile-status-select-wrap.activities-compact-select .mat-mdc-select-trigger,\n.profile-status-select-wrap.assets-compact-select .mat-mdc-select-trigger {\n  width: auto !important;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select .status-option-content,\n.profile-status-select-wrap.activities-compact-select .status-option-content,\n.profile-status-select-wrap.assets-compact-select .status-option-content {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge,\n.profile-status-select-wrap.activities-filter-no-badge {\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge .status-option-content,\n.profile-status-select-wrap.activities-filter-no-badge .status-option-content {\n  width: auto !important;\n  flex: 0 1 auto;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select-trigger,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select-trigger {\n  width: auto !important;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select-arrow-wrapper,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select-arrow-wrapper {\n  margin-left: 0.28rem;\n}\n.profile-status-select-wrap {\n  min-width: 174px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  border: 1px solid #c8d3e2;\n  border-radius: 999px;\n  box-shadow: 0 2px 6px rgba(38, 60, 92, 0.08);\n  padding: 0.12rem 0.5rem 0.12rem 0.84rem;\n  background: #f8f9fb;\n}\n.profile-status-select-wrap.selector-like {\n  min-height: 36px;\n}\n.status-option-content {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.2rem;\n  text-transform: lowercase;\n  width: 100%;\n  min-width: 0;\n}\n.status-option-content span:last-child {\n  white-space: nowrap;\n}\n.status-option-content .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  flex: 0 0 16px;\n}\n.rate-filter-count-badge {\n  margin-left: auto;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  border: 1px solid #fff;\n  background: #d84d4d;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  font-size: 0.68rem;\n  font-weight: 800;\n  line-height: 1;\n  box-shadow: 0 2px 8px rgba(120, 24, 24, 0.22);\n}\n.rate-filter-trigger-badge {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  margin-left: 0;\n  z-index: 2;\n}\n.popup-filter-control,\n.activities-rate-filter-select,\n.activities-primary-filter-select,\n.activities-event-scope-filter-select,\n.activities-chat-context-filter-select {\n  position: relative;\n  overflow: visible;\n}\n.popup-filter-panel,\n.activities-view-picker-panel {\n  position: absolute;\n  top: calc(100% + 0.32rem);\n  right: 0;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 10px;\n  background: #fff;\n  box-shadow: 0 10px 24px rgba(17, 29, 48, 0.22);\n  padding: 0.24rem;\n  min-width: 128px;\n  z-index: 40;\n  display: grid;\n  gap: 0.16rem;\n}\n.popup-filter-option,\n.activities-view-option {\n  border: 0;\n  background: #fff;\n  border-radius: 8px;\n  min-height: 32px;\n  padding: 0.34rem 0.44rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.34rem;\n  color: #1e3658;\n  cursor: pointer;\n  text-align: left;\n}\n.popup-filter-option .mat-icon,\n.activities-view-option .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-filter-option span,\n.activities-view-option span {\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.popup-filter-option > span:not(.rate-filter-count-badge),\n.activities-view-option > span:not(.rate-filter-count-badge) {\n  flex: 1 1 auto;\n  min-width: 0;\n  text-align: left;\n}\n.popup-mobile-filter-picker,\n.activities-mobile-primary-filter-picker,\n.activities-mobile-event-scope-filter-picker,\n.activities-mobile-chat-context-filter-picker,\n.activities-mobile-rate-filter-picker {\n  position: relative;\n}\n.popup-mobile-filter-panel,\n.activities-mobile-filter-panel,\n.activities-mobile-rate-filter-panel {\n  top: calc(100% + 0.24rem);\n  right: 0;\n  min-width: 210px;\n  z-index: 65;\n}\n.popup-mobile-sheet-title,\n.activities-mobile-sheet-title {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  padding: 0 0.14rem;\n  color: #1c3354;\n  font-size: 0.94rem;\n  font-weight: 800;\n}\n.popup-mobile-sheet-title .mat-icon,\n.activities-mobile-sheet-title .mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .popup-view-fab span,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .mat-mdc-select,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .status-option-content span:last-child,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .mat-mdc-select-value-text {\n  font-weight: 400 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option .status-option-content {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  width: 100%;\n  min-width: 0;\n  column-gap: 0.34rem;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option .rate-filter-count-badge {\n  margin-left: 0;\n  justify-self: end;\n}\n:host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.selector-options-panel),\n:host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.status-options-panel) {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n@media (max-width: 760px) {\n  .popup-mobile-filter-panel .popup-filter-option,\n  .popup-mobile-filter-panel .activities-view-option,\n  .activities-mobile-filter-panel .popup-filter-option,\n  .activities-mobile-filter-panel .activities-view-option,\n  .activities-mobile-rate-filter-panel .popup-filter-option,\n  .activities-mobile-rate-filter-panel .activities-view-option {\n    width: 100%;\n    min-width: 0;\n    box-sizing: border-box;\n    border: 1px solid rgba(58, 81, 114, 0.24);\n    border-radius: 12px;\n    background: #f7f9fd;\n    min-height: 42px;\n    padding: 0.46rem 0.62rem;\n    justify-content: flex-start;\n    gap: 0.36rem;\n  }\n  .popup-mobile-filter-panel .popup-filter-option.active,\n  .popup-mobile-filter-panel .activities-view-option.active,\n  .activities-mobile-filter-panel .popup-filter-option.active,\n  .activities-mobile-filter-panel .activities-view-option.active,\n  .activities-mobile-rate-filter-panel .popup-filter-option.active,\n  .activities-mobile-rate-filter-panel .activities-view-option.active {\n    box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.24);\n    filter: brightness(0.95);\n  }\n  .popup-mobile-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .popup-mobile-filter-panel .activities-view-option .rate-filter-count-badge,\n  .activities-mobile-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .activities-mobile-filter-panel .activities-view-option .rate-filter-count-badge,\n  .activities-mobile-rate-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .activities-mobile-rate-filter-panel .activities-view-option .rate-filter-count-badge {\n    margin-left: auto;\n    flex: 0 0 auto;\n  }\n  :host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.profile-bottom-sheet-panel) {\n    position: fixed !important;\n    left: 0 !important;\n    right: 0 !important;\n    bottom: 0 !important;\n    top: auto !important;\n    width: 100vw !important;\n    max-width: 100vw !important;\n    transform: none !important;\n  }\n  :host ::ng-deep .mat-mdc-select-panel.profile-bottom-sheet-panel {\n    width: 100vw !important;\n    max-width: 100vw !important;\n    max-height: min(54vh, 420px) !important;\n    margin: 0 !important;\n    border-radius: 16px 16px 0 0 !important;\n    border: 1px solid #d6deea;\n    border-bottom: 0;\n    box-shadow: 0 -14px 28px rgba(15, 29, 52, 0.24);\n    padding-top: 0.38rem;\n    padding-bottom: max(0.55rem, env(safe-area-inset-bottom));\n  }\n}\n.popup-view-fab {\n  height: 34px;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 999px;\n  background: #f3f7ff;\n  color: #2c4c74;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0 0.62rem;\n  cursor: pointer;\n}\n.popup-view-fab .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-view-fab span {\n  font-size: 0.74rem;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.event-visibility-picker {\n  position: relative;\n  z-index: 22;\n  margin-left: auto;\n  flex: 0 0 auto;\n}\n.event-visibility-trigger {\n  flex-wrap: nowrap;\n}\n.profile-status-header-picker .event-visibility-trigger.status-public,\n.profile-status-header-picker .activities-view-option.status-public {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e6f6ef);\n}\n.profile-status-header-picker .event-visibility-trigger.status-friends,\n.profile-status-header-picker .activities-view-option.status-friends {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e8f1fd);\n}\n.profile-status-header-picker .event-visibility-trigger.status-host,\n.profile-status-header-picker .activities-view-option.status-host {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6efe2);\n}\n.profile-status-header-picker .event-visibility-trigger.status-inactive,\n.profile-status-header-picker .activities-view-option.status-inactive {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f2f3f5);\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-public,\n.profile-status-header-picker .activities-view-option.status-public .mat-icon {\n  color: #2f8f66;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-friends,\n.profile-status-header-picker .activities-view-option.status-friends .mat-icon {\n  color: #1b57a1;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-host,\n.profile-status-header-picker .activities-view-option.status-host .mat-icon {\n  color: #87580f;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-inactive,\n.profile-status-header-picker .activities-view-option.status-inactive .mat-icon {\n  color: #5b6573;\n}\n.app-popup textarea,\n.app-popup input,\n.app-popup select,\n.popup-surface textarea,\n.popup-surface input,\n.popup-surface select,\n.experience-form-popup textarea,\n.experience-form-popup input,\n.experience-form-popup select,\n.mobile-profile-selector-sheet-wrap input {\n  width: 100%;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.48rem 0.56rem;\n  font: inherit;\n  color: var(--text-main);\n  background: #fff;\n}\n.app-popup textarea,\n.popup-surface textarea,\n.experience-form-popup textarea {\n  resize: vertical;\n}\n.app-popup textarea:focus,\n.app-popup input:focus,\n.app-popup select:focus,\n.popup-surface textarea:focus,\n.popup-surface input:focus,\n.popup-surface select:focus,\n.experience-form-popup textarea:focus,\n.experience-form-popup input:focus,\n.experience-form-popup select:focus,\n.mobile-profile-selector-sheet-wrap input:focus {\n  outline: 0;\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n}\n.popup-surface-form-grid,\n.experience-form-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  max-width: none;\n  width: 100%;\n  margin: 0;\n  justify-content: stretch;\n  align-content: start;\n  align-items: start;\n  column-gap: 1rem;\n  row-gap: 0.9rem;\n}\n.popup-surface-form-grid label,\n.experience-form-grid label {\n  display: grid;\n  grid-template-rows: min-content;\n  gap: 0;\n  font-weight: 600;\n  color: rgba(26, 44, 69, 0.88);\n}\n.popup-surface-form-grid input,\n.experience-form-grid input {\n  min-height: 40px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid textarea,\n.experience-form-grid textarea {\n  min-height: 96px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid .profile-status-select-wrap.selector-like,\n.experience-form-grid .profile-status-select-wrap.selector-like {\n  min-height: 40px;\n  height: 40px;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid .mat-mdc-select-trigger,\n.experience-form-grid .mat-mdc-select-trigger {\n  min-height: 32px;\n}\n.popup-surface-description-field,\n.experience-description-field {\n  grid-column: 1/-1;\n}\n.popup-surface-actions,\n.experience-form-actions {\n  justify-content: center;\n  padding-top: 0.2rem;\n}\n.popup-actions {\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.link-btn {\n  border: 1px solid var(--line-strong);\n  border-radius: 999px;\n  background: #fff;\n  color: #1f3350;\n  font: inherit;\n  font-size: 0.83rem;\n  padding: 0.38rem 0.76rem;\n  cursor: pointer;\n}\n.neutral-btn {\n  background: #f2f4fa;\n  border-color: rgba(23, 33, 54, 0.12);\n}\n.primary-btn {\n  background: #4776b7;\n  border-color: #4776b7;\n  color: #fff;\n}\n.profile-status-select-wrap .mat-icon,\n.date-picker-btn .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: #566b86;\n}\n.profile-status-select-wrap .mat-mdc-select {\n  min-width: 80px;\n  width: 100%;\n  font-size: 0.8rem;\n  font-weight: 700;\n  text-transform: lowercase;\n}\n.profile-status-select-wrap .mat-mdc-select-trigger {\n  width: 100%;\n  justify-content: flex-start;\n}\n.profile-status-select-wrap .mat-mdc-select-arrow-wrapper {\n  margin-left: auto;\n}\n.status-public {\n  color: #2f8f66;\n}\n.status-friends {\n  color: #1b57a1;\n}\n.status-host {\n  color: #87580f;\n}\n.status-inactive {\n  color: #5b6573;\n}\n.status-option-content .status-public {\n  color: #2f8f66;\n}\n.status-option-content .status-friends {\n  color: #1b57a1;\n}\n.status-option-content .status-host {\n  color: #87580f;\n}\n.status-option-content .status-inactive {\n  color: #5b6573;\n}\n.profile-status-select-wrap.status-public .status-option-content .mat-icon {\n  color: #2f8f66;\n}\n.profile-status-select-wrap.status-friends .status-option-content .mat-icon {\n  color: #1b57a1;\n}\n.profile-status-select-wrap.status-host .status-option-content .mat-icon {\n  color: #87580f;\n}\n.profile-status-select-wrap.status-inactive .status-option-content .mat-icon {\n  color: #5b6573;\n}\n.profile-details-values-btn .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: rgba(44, 67, 100, 0.72);\n}\n.profile-details-values-btn {\n  min-height: 36px;\n  height: 36px;\n  box-sizing: border-box;\n  padding-top: 0;\n  padding-bottom: 0;\n}\n.profile-details-values-btn .status-option-content.profile-details-selected-badges {\n  display: inline-grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  column-gap: 0.26rem;\n  min-width: 0;\n  width: 100%;\n}\n.profile-details-values-btn.profile-details-values-tone-values .profile-details-inline-chip {\n  max-width: calc(100% - 2.6rem);\n}\n.profile-details-values-btn.profile-details-values-tone-interest .profile-details-inline-chip {\n  max-width: calc((100% - 3.2rem) / 2);\n}\n.profile-details-values-btn.profile-details-values-tone-values .profile-details-inline-overflow {\n  color: #1e6b5a;\n}\n.profile-details-values-btn.profile-details-values-tone-interest .profile-details-inline-overflow {\n  color: #2e5a90;\n}\n.values-header-chips {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.28rem;\n  flex: 0 0 100%;\n  margin-left: 0;\n  margin-top: 0.34rem;\n  max-width: 100%;\n  overflow: visible;\n  white-space: normal;\n  padding-bottom: 0;\n}\n.popup-title-values {\n  margin-right: 0.38rem;\n}\n.values-selected-chip {\n  border: 1px solid rgba(76, 99, 136, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9ff 0%,\n      #eef3ff 100%);\n  color: #24416a;\n  border-radius: 999px;\n  min-height: 26px;\n  padding: 0.18rem 0.46rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-size: 0.7rem;\n  font-weight: 700;\n  cursor: pointer;\n  flex: 0 0 auto;\n}\n.values-selected-chip .mat-icon {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.values-selected-chip.section-family {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1ea 0%,\n      #ffe6dd 100%);\n  border-color: rgba(160, 90, 51, 0.32);\n  color: #8b4d2b;\n}\n.values-selected-chip.section-ambition {\n  background:\n    linear-gradient(\n      180deg,\n      #fff7e8 0%,\n      #ffefd7 100%);\n  border-color: rgba(160, 106, 20, 0.32);\n  color: #9a6614;\n}\n.values-selected-chip.section-lifestyle {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f5 0%,\n      #e0f2ee 100%);\n  border-color: rgba(45, 125, 120, 0.32);\n  color: #2a6e6a;\n}\n.values-selected-chip.section-beliefs {\n  background:\n    linear-gradient(\n      180deg,\n      #f0ecff 0%,\n      #e8e1fa 100%);\n  border-color: rgba(95, 78, 160, 0.32);\n  color: #564793;\n}\n.values-selected-chip.section-social {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n  color: #2d5ea8;\n}\n.values-selected-chip.section-arts {\n  background:\n    linear-gradient(\n      180deg,\n      #f2edfb 0%,\n      #e9e2f9 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n  color: #654ca1;\n}\n.values-selected-chip.section-food {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4e8 0%,\n      #fee9d6 100%);\n  border-color: rgba(170, 97, 28, 0.32);\n  color: #9d611c;\n}\n.values-selected-chip.section-active {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.values-selected-chip.section-mind {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f6 0%,\n      #def1ee 100%);\n  border-color: rgba(37, 124, 118, 0.32);\n  color: #2d7d78;\n}\n.values-selected-chip.section-identity {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n  border-color: rgba(88, 78, 159, 0.32);\n  color: #5a4ea0;\n}\n.readonly-select {\n  width: fit-content;\n  min-width: 0;\n  max-width: 130px;\n  justify-content: center;\n  margin-top: 2px;\n  padding-left: 0.44rem;\n  padding-right: 0.44rem;\n}\n.readonly-field {\n  min-height: 34px;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.4rem 0.56rem;\n  background: #f7fafe;\n  color: #23476f;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-weight: 700;\n}\n.readonly-field .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.zodiac-symbol {\n  font-size: 1.1rem;\n  font-weight: 800;\n  line-height: 1;\n}\n.zodiac-label {\n  font-size: 0.9rem;\n  font-weight: 700;\n  min-width: 0;\n  text-align: center;\n}\n.readonly-select.zodiac-aries {\n  background: #fdf1f1;\n  color: #9f2f2f;\n}\n.readonly-select.zodiac-taurus {\n  background: #f7f3eb;\n  color: #6e4b2b;\n}\n.readonly-select.zodiac-gemini {\n  background: #fdf8e9;\n  color: #7d5a12;\n}\n.readonly-select.zodiac-cancer {\n  background: #eef4ff;\n  color: #2d5b8e;\n}\n.readonly-select.zodiac-leo {\n  background: #fff3e8;\n  color: #8f4b0d;\n}\n.readonly-select.zodiac-virgo {\n  background: #edf8ef;\n  color: #2b6b3d;\n}\n.readonly-select.zodiac-libra {\n  background: #f2eefc;\n  color: #60439d;\n}\n.readonly-select.zodiac-scorpio {\n  background: #f9edf2;\n  color: #7b3150;\n}\n.readonly-select.zodiac-sagittarius {\n  background: #eef1ff;\n  color: #2f4a9a;\n}\n.readonly-select.zodiac-capricorn {\n  background: #eff2f5;\n  color: #364653;\n}\n.readonly-select.zodiac-aquarius {\n  background: #ebf7fb;\n  color: #1d5f7a;\n}\n.readonly-select.zodiac-pisces {\n  background: #eef2ff;\n  color: #294b8f;\n}\n.physique-slim {\n  color: #3f7ab3;\n}\n.physique-lean {\n  color: #3f8f5f;\n}\n.physique-athletic {\n  color: #2f7e4d;\n}\n.physique-fit {\n  color: #465fbb;\n}\n.physique-curvy {\n  color: #a14875;\n}\n.physique-muscular {\n  color: #7d4f24;\n}\n.physique-average {\n  color: #4d667f;\n}\n.physique-select-wrap.physique-slim {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf3fb 0%,\n      #dfebf8 100%);\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.physique-select-wrap.physique-lean {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf6ee 0%,\n      #def0e5 100%);\n  border-color: rgba(63, 143, 95, 0.34);\n}\n.physique-select-wrap.physique-athletic {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f5ec 0%,\n      #dff0e6 100%);\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.physique-select-wrap.physique-fit {\n  background:\n    linear-gradient(\n      180deg,\n      #ebf0ff 0%,\n      #e1e8fc 100%);\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.physique-select-wrap.physique-curvy {\n  background:\n    linear-gradient(\n      180deg,\n      #f7edf3 0%,\n      #f0e3ec 100%);\n  border-color: rgba(161, 72, 117, 0.36);\n}\n.physique-select-wrap.physique-muscular {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe9 0%,\n      #ede3d8 100%);\n  border-color: rgba(125, 79, 36, 0.36);\n}\n.physique-select-wrap.physique-average {\n  background:\n    linear-gradient(\n      180deg,\n      #eef2f6 0%,\n      #e5ebf1 100%);\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.physique-select-wrap.physique-slim .status-option-content .mat-icon {\n  color: #3f7ab3;\n}\n.physique-select-wrap.physique-lean .status-option-content .mat-icon {\n  color: #3f8f5f;\n}\n.physique-select-wrap.physique-athletic .status-option-content .mat-icon {\n  color: #2f7e4d;\n}\n.physique-select-wrap.physique-fit .status-option-content .mat-icon {\n  color: #465fbb;\n}\n.physique-select-wrap.physique-curvy .status-option-content .mat-icon {\n  color: #a14875;\n}\n.physique-select-wrap.physique-muscular .status-option-content .mat-icon {\n  color: #7d4f24;\n}\n.physique-select-wrap.physique-average .status-option-content .mat-icon {\n  color: #4d667f;\n}\n.experience-filter-all {\n  color: #694ea6;\n}\n.experience-filter-workspace {\n  color: #a1485a;\n}\n.experience-filter-school {\n  color: #2d5ea8;\n}\n.experience-filter-online {\n  color: #2d7d47;\n}\n.experience-filter-project {\n  color: #6550a0;\n}\n.experience-filter-select.experience-filter-all,\n.experience-type-select.experience-filter-project {\n  background:\n    linear-gradient(\n      180deg,\n      #efe8ff 0%,\n      #e8defc 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n}\n.experience-filter-select.experience-filter-workspace,\n.experience-type-select.experience-filter-workspace {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f3 0%,\n      #ffe6ea 100%);\n  border-color: rgba(169, 72, 90, 0.32);\n}\n.experience-filter-select.experience-filter-school,\n.experience-type-select.experience-filter-school {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n}\n.experience-type-select.experience-filter-online {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n}\n.experience-type-select.experience-filter-project {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n}\n.experience-type-select {\n  min-width: 0;\n  max-width: 100%;\n  min-height: 40px;\n}\n.experience-type-field,\n.experience-title-field,\n.experience-city-field {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-org-field {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-type-select {\n  width: 100%;\n}\n.experience-date-range-field {\n  width: 100%;\n  max-width: none;\n  margin: 0;\n  background: transparent;\n}\n.experience-date-range-label {\n  grid-column: 1/2;\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-date-range-field .mat-mdc-text-field-wrapper {\n  min-height: 42px;\n  border-radius: 10px;\n  background: #fff;\n  border: 1px solid rgba(136, 156, 186, 0.5);\n  box-shadow: none;\n}\n.experience-date-range-field .mat-mdc-form-field-subscript-wrapper {\n  margin-top: 0.24rem;\n}\n.experience-date-range-field input {\n  border: 0 !important;\n  box-shadow: none !important;\n  border-radius: 0 !important;\n  background: transparent !important;\n  min-width: 0;\n  width: 100%;\n  padding: 0 !important;\n  min-height: 0 !important;\n  height: auto !important;\n  line-height: 1.25;\n}\n.experience-date-range-field .mat-datepicker-toggle {\n  margin-right: 0.2rem;\n}\n.experience-date-range-field .mat-mdc-form-field-hint-wrapper,\n.experience-date-range-field .mat-mdc-form-field-hint {\n  color: rgba(30, 49, 74, 0.65);\n  font-size: 0.72rem;\n}\n.experience-date-range-field .mat-date-range-input-container {\n  width: 100%;\n  display: grid;\n  grid-template-columns: minmax(96px, 1fr) auto minmax(96px, 1fr);\n  align-items: center;\n  column-gap: 0.34rem;\n  min-width: 0;\n}\n.experience-date-range-field .mat-date-range-input-separator {\n  margin: 0 0.28rem;\n  flex: 0 0 auto;\n  white-space: nowrap;\n}\n.experience-date-range-field .mat-date-range-input-start-wrapper,\n.experience-date-range-field .mat-date-range-input-end-wrapper {\n  width: 100%;\n  max-width: 100%;\n  overflow: visible;\n  min-width: 0;\n}\n.experience-date-range-field .mat-date-range-input-inner {\n  font-size: 0.96rem;\n  min-width: 0 !important;\n  width: 100% !important;\n  text-overflow: clip;\n  white-space: nowrap;\n  line-height: 1.25;\n}\n.experience-date-range-field .mat-mdc-form-field-flex {\n  min-width: 0;\n  border-bottom: 0 !important;\n  box-shadow: none !important;\n  align-items: center !important;\n}\n.experience-date-range-field .mat-mdc-form-field-infix {\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  min-height: 34px !important;\n  height: 34px;\n  display: flex;\n  align-items: center;\n}\n.experience-date-range-field .mdc-line-ripple,\n.experience-date-range-field .mat-mdc-form-field-line-ripple,\n.experience-date-range-field .mdc-line-ripple--deactivating,\n.experience-date-range-field .mdc-line-ripple--active {\n  display: none !important;\n  opacity: 0 !important;\n  transform: scaleX(0) !important;\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-all {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efe8ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-workspace {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1f3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-school {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf4ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-online {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf8ee);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-project {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f4f0ff);\n}\n.mobile-profile-language-chip.language-tone-1,\n.mobile-profile-selector-option.language-tone-1,\n:host ::ng-deep .mat-mdc-option.language-tone-1 {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n  color: #2f6090;\n}\n.mobile-profile-language-chip.language-tone-2,\n.mobile-profile-selector-option.language-tone-2,\n:host ::ng-deep .mat-mdc-option.language-tone-2 {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n  color: #2f695b;\n}\n.mobile-profile-language-chip.language-tone-3,\n.mobile-profile-selector-option.language-tone-3,\n:host ::ng-deep .mat-mdc-option.language-tone-3 {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n  color: #394f9c;\n}\n.mobile-profile-language-chip.language-tone-4,\n.mobile-profile-selector-option.language-tone-4,\n:host ::ng-deep .mat-mdc-option.language-tone-4 {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n  color: #8d3f66;\n}\n.mobile-profile-language-chip.language-tone-5,\n.mobile-profile-selector-option.language-tone-5,\n:host ::ng-deep .mat-mdc-option.language-tone-5 {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n  color: #704822;\n}\n.mobile-profile-language-chip.language-tone-6,\n.mobile-profile-selector-option.language-tone-6,\n:host ::ng-deep .mat-mdc-option.language-tone-6 {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n  color: #415872;\n}\n.mobile-profile-language-chip.language-tone-7,\n.mobile-profile-selector-option.language-tone-7,\n:host ::ng-deep .mat-mdc-option.language-tone-7 {\n  background: #f7f5ea;\n  border-color: rgba(128, 109, 66, 0.34);\n  color: #746237;\n}\n.mobile-profile-language-chip.language-tone-8,\n.mobile-profile-selector-option.language-tone-8,\n:host ::ng-deep .mat-mdc-option.language-tone-8 {\n  background: #edf5ff;\n  border-color: rgba(45, 122, 160, 0.34);\n  color: #2f6782;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf2ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #ebf7ef);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1e3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efecfc);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3f8e9);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fceef3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf7ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6f2e9);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-1 .status-option-content {\n  color: #2d63a9;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-2 .status-option-content {\n  color: #2a7a49;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-3 .status-option-content {\n  color: #9b6018;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-4 .status-option-content {\n  color: #6153a2;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-5 .status-option-content {\n  color: #61812a;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-6 .status-option-content {\n  color: #9f446d;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-7 .status-option-content {\n  color: #2e7898;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-8 .status-option-content {\n  color: #806c3f;\n}\n.mobile-profile-selector-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      180deg,\n      #eef5ff 0%,\n      #e3eefc 100%);\n  border-color: rgba(46, 102, 181, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      180deg,\n      #eef9f3 0%,\n      #e3f4ea 100%);\n  border-color: rgba(40, 125, 72, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ea 0%,\n      #ffecdd 100%);\n  border-color: rgba(165, 94, 24, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f1ff 0%,\n      #e8e5fb 100%);\n  border-color: rgba(97, 82, 164, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f9ef 0%,\n      #edf3e1 100%);\n  border-color: rgba(95, 128, 36, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #f9e6ed 100%);\n  border-color: rgba(160, 70, 111, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ff 0%,\n      #e2f0fb 100%);\n  border-color: rgba(45, 122, 160, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f3ea 0%,\n      #eee9dc 100%);\n  border-color: rgba(128, 109, 66, 0.32);\n}\n.mobile-profile-selector-option.status-public {\n  background:\n    linear-gradient(\n      180deg,\n      #e6f6ef 0%,\n      #d9f0e6 100%);\n  border-color: rgba(47, 143, 102, 0.34);\n}\n.mobile-profile-selector-option.status-friends {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f1fd 0%,\n      #dfeaf9 100%);\n  border-color: rgba(27, 87, 161, 0.34);\n}\n.mobile-profile-selector-option.status-host {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe2 0%,\n      #eee4d2 100%);\n  border-color: rgba(135, 88, 15, 0.36);\n}\n.mobile-profile-selector-option.status-inactive {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3f5 0%,\n      #e8ebef 100%);\n  border-color: rgba(91, 101, 115, 0.32);\n}\n.mobile-profile-selector-option.physique-slim {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.mobile-profile-selector-option.physique-lean {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n}\n.mobile-profile-selector-option.physique-athletic {\n  background: #e8f5ec;\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.mobile-profile-selector-option.physique-fit {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.mobile-profile-selector-option.physique-curvy {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n}\n.mobile-profile-selector-option.physique-muscular {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n}\n.mobile-profile-selector-option.physique-average {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.popup-panel-profile-selector .values-selector-popup.profile-selector-popup {\n  gap: 0.56rem;\n}\n.popup-panel-profile-selector .profile-filter-selector-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.44rem;\n  padding-bottom: 0.22rem;\n  border-bottom: 1px solid rgba(74, 102, 139, 0.22);\n}\n.popup-panel-profile-selector .profile-filter-selector-head-label {\n  color: #203c64;\n  font-size: 0.82rem;\n  font-weight: 800;\n  line-height: 1.2;\n}\n.popup-panel-profile-selector .profile-filter-selector-clear {\n  border: 1px solid rgba(41, 73, 110, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.82);\n  color: #284970;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.3rem 0.52rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector .profile-filter-selector-clear.is-hidden {\n  visibility: hidden;\n  pointer-events: none;\n}\n.popup-panel-profile-selector .profile-filter-selector-selected {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector .profile-filter-selector-chip {\n  border: 1px solid rgba(35, 68, 107, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.92);\n  color: #234368;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.26rem 0.48rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.16rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector .profile-filter-selector-chip .mat-icon {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n}\n.popup-panel-profile-selector .profile-filter-selector-empty {\n  margin: 0;\n  font-size: 0.74rem;\n  color: rgba(31, 54, 86, 0.62);\n  font-style: italic;\n}\n.popup-panel-profile-selector .profile-selector-option-group {\n  display: grid;\n  gap: 0.34rem;\n  border: 1px solid transparent;\n  border-radius: 12px;\n  padding: 0.4rem 0.42rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-head {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag {\n  border-radius: 999px;\n  border: 1px solid rgba(52, 86, 128, 0.28);\n  background: rgba(255, 255, 255, 0.74);\n  color: #2f527d;\n  font-size: 0.67rem;\n  font-weight: 800;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.2rem 0.52rem;\n  text-transform: uppercase;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag-icon {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.popup-panel-profile-selector .profile-selector-option-group-line {\n  display: block;\n  width: 100%;\n  height: 1px;\n  background: rgba(84, 111, 147, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-chip-grid {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.36rem;\n}\n.popup-panel-profile-selector .profile-selector-chip {\n  border: 1px solid rgba(41, 70, 106, 0.22);\n  border-radius: 999px;\n  background: #f4f8ff;\n  color: #234066;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 700;\n  padding: 0.3rem 0.58rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  cursor: pointer;\n  transition:\n    background-color 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.popup-panel-profile-selector .profile-selector-chip.active {\n  border-color: rgba(27, 85, 158, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #dcebff 0%,\n      #cfe3ff 100%);\n  color: #123e70;\n  box-shadow: inset 0 0 0 1px rgba(30, 73, 127, 0.24), 0 1px 2px rgba(24, 53, 86, 0.16);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-family {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 232, 219, 0.52) 0%,\n      rgba(255, 232, 219, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-ambition {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 242, 216, 0.52) 0%,\n      rgba(255, 242, 216, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-lifestyle {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(221, 241, 239, 0.56) 0%,\n      rgba(221, 241, 239, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-beliefs {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-social {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(223, 236, 255, 0.5) 0%,\n      rgba(223, 236, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-arts {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(235, 227, 255, 0.5) 0%,\n      rgba(235, 227, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-food {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 236, 221, 0.52) 0%,\n      rgba(255, 236, 221, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-active {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(222, 243, 231, 0.56) 0%,\n      rgba(222, 243, 231, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-mind {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(219, 242, 238, 0.56) 0%,\n      rgba(219, 242, 238, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-identity {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-family {\n  border-color: rgba(156, 94, 51, 0.34);\n  color: #9c5e33;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-ambition {\n  border-color: rgba(160, 106, 20, 0.34);\n  color: #9b6717;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-lifestyle {\n  border-color: rgba(47, 123, 119, 0.34);\n  color: #2f7b77;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-beliefs {\n  border-color: rgba(95, 78, 160, 0.34);\n  color: #5f4ea0;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-social {\n  border-color: rgba(47, 106, 175, 0.36);\n  color: #2f6aaf;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-arts {\n  border-color: rgba(106, 87, 168, 0.36);\n  color: #6a57a8;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-food {\n  border-color: rgba(170, 97, 28, 0.34);\n  color: #a55e18;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-active {\n  border-color: rgba(49, 124, 82, 0.36);\n  color: #317c52;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-mind {\n  border-color: rgba(37, 124, 118, 0.34);\n  color: #2b7c76;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-identity {\n  border-color: rgba(98, 84, 163, 0.34);\n  color: #6254a3;\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-family {\n  background: rgba(156, 94, 51, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-ambition {\n  background: rgba(160, 106, 20, 0.32);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-lifestyle {\n  background: rgba(47, 123, 119, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-beliefs {\n  background: rgba(95, 78, 160, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-social {\n  background: rgba(47, 106, 175, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-arts {\n  background: rgba(106, 87, 168, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-food {\n  background: rgba(170, 97, 28, 0.32);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-active {\n  background: rgba(49, 124, 82, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-mind {\n  background: rgba(37, 124, 118, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-identity {\n  background: rgba(98, 84, 163, 0.3);\n}\n:host ::ng-deep .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.status-option) {\n  background: #f0f5fc;\n}\n:host ::ng-deep .mat-mdc-option.status-option.mdc-list-item--selected:not(.mdc-list-item--disabled) {\n  filter: brightness(0.95);\n  box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.2);\n}\n:host ::ng-deep .mat-mdc-option.status-option {\n  background: #fff;\n}\n:host ::ng-deep .mat-mdc-option.status-option:not(:last-child) {\n  border-bottom: 1px solid #e6edf7;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.hide-selected-option,\n:host ::ng-deep .status-options-panel .mat-mdc-option.hide-selected-option {\n  min-height: 0 !important;\n  height: 0 !important;\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  border: 0 !important;\n  margin: 0 !important;\n  opacity: 0 !important;\n  pointer-events: none !important;\n  overflow: hidden !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option {\n  background: #fff;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel {\n  margin-top: 8px !important;\n  margin-bottom: 8px !important;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .cdk-overlay-pane .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .cdk-overlay-pane .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above {\n  margin-top: 0 !important;\n  margin-bottom: 18px !important;\n  transform: translateY(-10px) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public {\n  --mdc-list-list-item-container-color: #def3e9;\n  --mat-mdc-option-selected-container-color: #def3e9;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #def3e9) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends {\n  --mdc-list-list-item-container-color: #e3eefb;\n  --mat-mdc-option-selected-container-color: #e3eefb;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e3eefb) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host {\n  --mdc-list-list-item-container-color: #f3ead8;\n  --mat-mdc-option-selected-container-color: #f3ead8;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3ead8) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive {\n  --mdc-list-list-item-container-color: #eceff3;\n  --mat-mdc-option-selected-container-color: #eceff3;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eceff3) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon {\n  color: #2f8f66 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon {\n  color: #1b57a1 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon {\n  color: #87580f !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon {\n  color: #5b6573 !important;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-slim {\n  background: #eaf4ff;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-lean {\n  background: #edf8f4;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-athletic {\n  background: #e8f5ec;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-fit {\n  background: #f1f2ff;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-curvy {\n  background: #fff2f8;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-muscular {\n  background: #fbf4ea;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-average {\n  background: #eff4f9;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-slim .status-option-content {\n  color: #3f7ab3;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-lean .status-option-content {\n  color: #3f8f5f;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-athletic .status-option-content {\n  color: #2f7e4d;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-fit .status-option-content {\n  color: #465fbb;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-curvy .status-option-content {\n  color: #a14875;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-muscular .status-option-content {\n  color: #7d4f24;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-average .status-option-content {\n  color: #4d667f;\n}\n:host ::ng-deep .mat-mdc-select-panel.physique-options-panel {\n  width: auto !important;\n  max-width: 220px !important;\n  min-width: 0 !important;\n}\n:host ::ng-deep .physique-options-panel .mat-mdc-option {\n  padding-right: 8px;\n}\n:host ::ng-deep .physique-options-panel .mat-mdc-option .mat-pseudo-checkbox {\n  margin-left: 4px;\n}\n@media (max-width: 760px) {\n  .experience-form-grid {\n    grid-template-columns: 1fr;\n    max-width: none;\n    justify-content: stretch;\n    row-gap: 0.72rem;\n  }\n  .experience-date-range-label {\n    grid-column: 1/-1;\n  }\n  .experience-date-range-field .mat-date-range-input-container {\n    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);\n  }\n  .profile-details-privacy-fab .privacy-fab-actions {\n    position: fixed;\n    left: 0.5rem;\n    right: 0.5rem;\n    bottom: max(0.5rem, env(safe-area-inset-bottom));\n    top: auto;\n    transform: translateY(12px) scale(0.98);\n    transform-origin: bottom center;\n    justify-content: center;\n    gap: 0.46rem;\n    padding: 0.46rem 0.56rem;\n    border: 1px solid rgba(42, 68, 102, 0.2);\n    border-radius: 14px;\n    background: #fff;\n    box-shadow: 0 -12px 24px rgba(18, 31, 51, 0.22);\n  }\n  .profile-details-privacy-fab.open .privacy-fab-actions {\n    transform: translateY(0) scale(1);\n  }\n}\n:host {\n  --event-resource-shell-gap: 0.6rem;\n  --event-resource-panel-max-width: 1080px;\n  display: contents;\n}\n::ng-deep .cdk-drag-preview.asset-route-row {\n  display: grid !important;\n  grid-template-columns: auto minmax(0, 1fr) auto auto !important;\n  align-items: center !important;\n  gap: 0.62rem !important;\n  box-sizing: border-box !important;\n  background: #fff;\n  border-radius: 8px;\n  box-shadow: 0 8px 24px rgba(14, 32, 58, 0.15);\n  padding: 0.25rem 0.5rem;\n}\n::ng-deep .cdk-drag-preview.asset-route-row input {\n  width: 100%;\n  min-width: 0;\n  border: 1px solid rgba(42, 66, 102, 0.28);\n  border-radius: 4px;\n  padding: 0.4rem 0.6rem;\n  font-family: inherit;\n  box-sizing: border-box;\n}\n::ng-deep .cdk-drag-preview.asset-route-row {\n}\n::ng-deep .cdk-drag-preview.asset-route-row .experience-action-btn {\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  border: 1px solid rgba(42, 67, 101, 0.26);\n  background: rgba(255, 255, 255, 0.88);\n  color: #2d5ea8;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  cursor: pointer;\n}\n::ng-deep .cdk-drag-preview.asset-route-row .experience-action-btn .mat-icon {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n  line-height: 15px;\n}\n::ng-deep .cdk-drag-preview.asset-route-row .experience-action-btn.asset-route-drag-btn {\n  cursor: grabbing;\n}\n::ng-deep .cdk-drag-preview.asset-route-row .experience-action-btn.asset-route-map-btn {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f7fc 0%,\n      #e8eef9 100%);\n  border-color: rgba(53, 91, 140, 0.26);\n  color: #315e9a;\n}\n::ng-deep .cdk-drag-preview.asset-route-row .experience-action-btn.asset-route-delete-btn {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f1 0%,\n      #ffe4e4 100%);\n  border-color: rgba(177, 40, 40, 0.32);\n  color: #b12828;\n}\n::ng-deep .subevent-resource-card-list app-info-card [class*=avatar],\n::ng-deep .subevent-resource-card-list app-info-card [class*=media-start] {\n  background:\n    linear-gradient(\n      180deg,\n      #ffe8cc 0%,\n      #ffd7af 100%) !important;\n  border: 1px solid rgba(179, 108, 42, 0.54) !important;\n  color: #8c4f18 !important;\n  transition:\n    transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),\n    box-shadow 0.2s ease,\n    filter 0.2s ease !important;\n}\n::ng-deep .subevent-resource-card-list app-info-card [class*=avatar] .mat-icon,\n::ng-deep .subevent-resource-card-list app-info-card [class*=media-start] .mat-icon {\n  color: #8c4f18 !important;\n}\n::ng-deep .subevent-resource-card-list app-info-card [class*=avatar],\n::ng-deep .subevent-resource-card-list app-info-card [class*=media-start] {\n}\n::ng-deep .subevent-resource-card-list app-info-card [class*=avatar]:hover,\n::ng-deep .subevent-resource-card-list app-info-card [class*=media-start]:hover {\n  transform: scale(1.08) translateY(-1px) !important;\n  box-shadow: 0 4px 12px rgba(179, 108, 42, 0.25) !important;\n  filter: brightness(1.05) !important;\n}\n::ng-deep .subevent-resource-card-list app-info-card [class*=avatar],\n::ng-deep .subevent-resource-card-list app-info-card [class*=media-start] {\n}\n::ng-deep .subevent-resource-card-list app-info-card [class*=avatar]:active,\n::ng-deep .subevent-resource-card-list app-info-card [class*=media-start]:active {\n  transform: scale(0.95) !important;\n  box-shadow: 0 1px 4px rgba(179, 108, 42, 0.15) !important;\n}\n.event-resource-popup-shell .subevent-assets-popup {\n  position: relative;\n  isolation: isolate;\n  display: grid;\n  grid-template-rows: auto minmax(0, 1fr);\n  gap: 0.62rem;\n  height: 100%;\n  min-height: 0;\n}\n.event-resource-popup-shell .assets-toolbar {\n  position: relative;\n  z-index: 4;\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  flex-wrap: wrap;\n}\n.event-resource-popup-shell .assets-toolbar .profile-status-select-wrap {\n  position: relative;\n  overflow: visible;\n}\n.event-resource-popup-shell .assets-toolbar .status-option-content {\n  gap: 0.34rem;\n}\n.event-resource-popup-shell .subevent-resource-mobile-filter-picker {\n  position: relative;\n}\n.event-resource-popup-shell .experience-filter-select.asset-filter-transport,\n.event-resource-popup-shell .experience-type-select.asset-filter-transport {\n  background:\n    linear-gradient(\n      180deg,\n      #eef6ff 0%,\n      #e2efff 100%);\n  border-color: rgba(43, 111, 179, 0.32);\n}\n.event-resource-popup-shell .experience-filter-select.asset-filter-accommodation,\n.event-resource-popup-shell .experience-type-select.asset-filter-accommodation {\n  background:\n    linear-gradient(\n      180deg,\n      #edf9f4 0%,\n      #e1f3ea 100%);\n  border-color: rgba(37, 127, 95, 0.32);\n}\n.event-resource-popup-shell .experience-filter-select.asset-filter-supplies,\n.event-resource-popup-shell .experience-type-select.asset-filter-supplies {\n  background:\n    linear-gradient(\n      180deg,\n      #fff5ec 0%,\n      #feead9 100%);\n  border-color: rgba(151, 92, 41, 0.32);\n}\n.event-resource-popup-shell .asset-filter-transport {\n  color: #295d96;\n}\n.event-resource-popup-shell .asset-filter-accommodation {\n  color: #236d51;\n}\n.event-resource-popup-shell .asset-filter-supplies {\n  color: #8a5428;\n}\n.event-resource-popup-shell .experience-filter-select.asset-category-camping,\n.event-resource-popup-shell .experience-type-select.asset-category-camping {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f3e7 0%,\n      #ece3c5 100%);\n  border-color: rgba(129, 110, 53, 0.3);\n}\n.event-resource-popup-shell .experience-filter-select.asset-category-cooking,\n.event-resource-popup-shell .experience-type-select.asset-category-cooking {\n  background:\n    linear-gradient(\n      180deg,\n      #fff3e6 0%,\n      #ffe2c2 100%);\n  border-color: rgba(165, 96, 33, 0.3);\n}\n.event-resource-popup-shell .experience-filter-select.asset-category-games,\n.event-resource-popup-shell .experience-type-select.asset-category-games {\n  background:\n    linear-gradient(\n      180deg,\n      #f3edff 0%,\n      #e5d8ff 100%);\n  border-color: rgba(102, 76, 171, 0.3);\n}\n.event-resource-popup-shell .experience-filter-select.asset-category-audio,\n.event-resource-popup-shell .experience-type-select.asset-category-audio {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf8ff 0%,\n      #d9effb 100%);\n  border-color: rgba(43, 118, 155, 0.3);\n}\n.event-resource-popup-shell .experience-filter-select.asset-category-sports,\n.event-resource-popup-shell .experience-type-select.asset-category-sports {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1eb 0%,\n      #ffd7ca 100%);\n  border-color: rgba(176, 78, 46, 0.3);\n}\n.event-resource-popup-shell .experience-filter-select.asset-category-safety,\n.event-resource-popup-shell .experience-type-select.asset-category-safety {\n  background:\n    linear-gradient(\n      180deg,\n      #fff2f3 0%,\n      #ffdfe3 100%);\n  border-color: rgba(182, 73, 101, 0.3);\n}\n.event-resource-popup-shell .experience-filter-select.asset-category-decor,\n.event-resource-popup-shell .experience-type-select.asset-category-decor {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f8 0%,\n      #ffe0ef 100%);\n  border-color: rgba(169, 82, 131, 0.3);\n}\n.event-resource-popup-shell .experience-filter-select.asset-category-tech,\n.event-resource-popup-shell .experience-type-select.asset-category-tech {\n  background:\n    linear-gradient(\n      180deg,\n      #eef4ff 0%,\n      #dde9ff 100%);\n  border-color: rgba(56, 99, 174, 0.3);\n}\n.event-resource-popup-shell .asset-category-camping {\n  color: #7a6423;\n}\n.event-resource-popup-shell .asset-category-cooking {\n  color: #9a531c;\n}\n.event-resource-popup-shell .asset-category-games {\n  color: #5f43a5;\n}\n.event-resource-popup-shell .asset-category-audio {\n  color: #2a7196;\n}\n.event-resource-popup-shell .asset-category-sports {\n  color: #a34d28;\n}\n.event-resource-popup-shell .asset-category-safety {\n  color: #a84360;\n}\n.event-resource-popup-shell .asset-category-decor {\n  color: #9c4a79;\n}\n.event-resource-popup-shell .asset-category-tech {\n  color: #2f5fa8;\n}\n.event-resource-popup-shell .assets-toolbar .profile-status-select-wrap:focus-within {\n  outline: none;\n}\n.event-resource-popup-shell .assets-toolbar .profile-status-select-wrap.asset-filter-open {\n  outline: none;\n  box-shadow: 0 5px 14px rgba(30, 64, 106, 0.2);\n}\n.event-resource-popup-shell .assets-toolbar .profile-status-select-wrap.asset-filter-transport.asset-filter-open {\n  background:\n    linear-gradient(\n      180deg,\n      #d6e8ff 0%,\n      #c7dcfa 100%);\n  color: #173d69;\n}\n.event-resource-popup-shell .assets-toolbar .profile-status-select-wrap.asset-filter-accommodation.asset-filter-open {\n  background:\n    linear-gradient(\n      180deg,\n      #d7efe2 0%,\n      #c8e3d4 100%);\n  color: #164936;\n}\n.event-resource-popup-shell .assets-toolbar .profile-status-select-wrap.asset-filter-supplies.asset-filter-open {\n  background:\n    linear-gradient(\n      180deg,\n      #ffe6ce 0%,\n      #f5d4b2 100%);\n  color: #633917;\n}\n.event-resource-popup-shell app-smart-list.subevent-assets-scroll-list {\n  position: relative;\n  z-index: 0;\n  display: flex;\n  flex: 1 1 auto;\n  min-height: 0;\n}\n.event-resource-popup-shell .subevent-resource-card-list {\n  min-height: 0;\n  padding-bottom: 0.3rem;\n}\n.event-resource-popup-shell .subevent-assets-toolbar-actions {\n  margin-left: auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n}\n.event-resource-popup-shell .subevent-assets-quick-actions {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n}\n.event-resource-popup-shell .subevent-assets-quick-actions-trigger.is-open .mat-icon {\n  transform: rotate(45deg);\n}\n.event-resource-popup-shell .subevent-assets-quick-actions-trigger .mat-icon {\n  transition: transform 0.16s ease;\n}\n.event-resource-popup-shell .subevent-assets-quick-actions-panel {\n  right: 0;\n  min-width: 184px;\n}\n.event-resource-popup-shell .subevent-assets-quick-actions-panel .subevent-assets-quick-action-option {\n  justify-content: flex-start;\n  width: 100%;\n  border-radius: 12px;\n  min-height: 40px;\n  padding: 0.46rem 0.62rem;\n}\n.event-resource-popup-shell .subevent-assets-quick-actions-panel .subevent-assets-quick-action-option-assign {\n  background:\n    linear-gradient(\n      180deg,\n      #fff7ea 0%,\n      #ffeed1 100%);\n  border: 1px solid rgba(168, 111, 36, 0.28);\n  color: #9b5e1f;\n}\n.event-resource-popup-shell .subevent-assets-quick-actions-panel .subevent-assets-quick-action-option-assign .mat-icon {\n  color: #ae661f;\n}\n.event-resource-popup-shell .subevent-assets-quick-actions-panel .subevent-assets-quick-action-option-explore {\n  background:\n    linear-gradient(\n      180deg,\n      #eef4ff 0%,\n      #e2ebff 100%);\n  border: 1px solid rgba(74, 108, 182, 0.28);\n  color: #4164a8;\n}\n.event-resource-popup-shell .subevent-assets-quick-actions-panel .subevent-assets-quick-action-option-explore .mat-icon {\n  color: #4b73bf;\n}\n.event-resource-popup-shell .chat-members-stack {\n  display: inline-flex;\n  align-items: center;\n  min-width: 0;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  font: inherit;\n  gap: 0.34rem;\n}\n.event-resource-popup-shell .chat-header-members {\n  position: relative;\n  overflow: visible;\n  cursor: pointer;\n  border-radius: 999px;\n  transition:\n    background-color 0.16s ease,\n    border-color 0.16s ease,\n    box-shadow 0.16s ease,\n    color 0.16s ease;\n  padding: 2px 4px 2px 2px;\n}\n.event-resource-popup-shell .event-editor-members-trigger {\n  border: 1px solid rgba(160, 106, 44, 0.36);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 246, 228, 0.98) 0%,\n      rgba(252, 236, 201, 0.95) 100%);\n  min-height: 34px;\n  padding: 2px 10px 2px 4px;\n  box-shadow: 0 2px 6px rgba(74, 44, 14, 0.08);\n}\n.event-resource-popup-shell .event-editor-members-trigger:hover {\n  border-color: rgba(167, 103, 34, 0.52);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 250, 237, 0.99) 0%,\n      rgba(253, 241, 214, 0.97) 100%);\n}\n.event-resource-popup-shell .event-editor-members-trigger-members {\n  border-color: rgba(64, 103, 150, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(237, 246, 255, 0.98) 0%,\n      rgba(219, 234, 252, 0.95) 100%);\n  box-shadow: 0 2px 6px rgba(32, 72, 120, 0.08);\n}\n.event-resource-popup-shell .event-editor-members-trigger-members:hover {\n  border-color: rgba(52, 102, 164, 0.48);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(246, 251, 255, 0.99) 0%,\n      rgba(226, 239, 255, 0.97) 100%);\n}\n.event-resource-popup-shell .event-editor-members-trigger-members .event-editor-members-invite {\n  color: rgba(29, 63, 102, 0.95);\n}\n.event-resource-popup-shell .event-editor-members-trigger-members .event-editor-members-invite .mat-icon {\n  color: #2e689f;\n}\n.event-resource-popup-shell .event-editor-members-pending-badge {\n  position: absolute;\n  top: -12px;\n  right: -10px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  min-width: 20px;\n  height: 20px;\n  padding: 0 5px;\n  border-radius: 999px;\n  background: #e5484d;\n  color: #fff;\n  font-size: 10px;\n  font-weight: 700;\n  line-height: 1;\n  border: 1px solid #fff;\n  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.76);\n  z-index: 2;\n}\n.event-resource-popup-shell .subevent-assets-assign-trigger {\n  margin-left: 0;\n}\n.event-resource-popup-shell .event-editor-members-invite {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.32rem;\n  padding: 0 2px;\n  color: rgba(97, 57, 22, 0.95);\n  font-size: 0.75rem;\n  font-weight: 700;\n  line-height: 1;\n  white-space: nowrap;\n}\n.event-resource-popup-shell .event-editor-members-invite .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: #ae661f;\n}\n.asset-explore-shell .asset-explore-shell-panel {\n  display: grid;\n  grid-template-rows: auto minmax(0, 1fr);\n  overflow: hidden;\n}\n.asset-explore-shell .asset-explore-shell-header {\n  z-index: 32;\n}\n.asset-explore-shell .asset-explore-header-controls {\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  margin-left: auto;\n}\n.asset-explore-shell .asset-explore-order-picker {\n  position: relative;\n  z-index: 20;\n}\n.asset-explore-shell .asset-explore-shell-body {\n  padding: 0.4rem 0.4rem 0.4rem 0.2rem;\n  gap: 0.46rem;\n  position: relative;\n  overflow: visible;\n}\n.asset-explore-shell .asset-explore-popup-screen {\n  position: relative;\n  display: grid;\n  grid-template-rows: auto minmax(0, 1fr);\n  height: 100%;\n  min-height: 0;\n  gap: 0.46rem;\n  overflow: visible;\n}\n.asset-explore-shell .asset-explore-panel,\n.asset-explore-shell .asset-explore-borrow-panel {\n  min-height: 0;\n  display: grid;\n  gap: 0.9rem;\n}\n.asset-explore-shell .asset-explore-borrow-panel {\n  padding: 0.95rem 1rem 1rem;\n}\n.asset-explore-shell .asset-explore-filter-bar {\n  min-height: 2.2rem;\n  height: auto;\n  display: flex;\n  align-items: center;\n  gap: 0.18rem;\n  flex-wrap: nowrap;\n  overflow-x: auto;\n  overflow-y: visible;\n  padding: 0.08rem 0;\n  scrollbar-width: none;\n  -ms-overflow-style: none;\n}\n.asset-explore-shell .asset-explore-filter-bar::-webkit-scrollbar {\n  display: none;\n}\n.asset-explore-shell .asset-explore-category-field {\n  min-height: 36px;\n  width: fit-content !important;\n  min-width: 0 !important;\n  flex: 0 0 auto;\n  overflow: visible;\n  padding-left: 0.62rem !important;\n  padding-right: 0.34rem !important;\n  gap: 0.22rem !important;\n}\n.asset-explore-shell .asset-explore-category-field ::ng-deep .status-option-content {\n  gap: 0.14rem !important;\n}\n.asset-explore-shell .asset-explore-category-field ::ng-deep .mat-mdc-select-arrow-wrapper {\n  margin-left: 0.14rem !important;\n}\n.asset-explore-shell .asset-explore-progress-strip {\n  margin-top: -0.08rem;\n}\n.asset-explore-shell .asset-explore-progress-strip app-header-progress-bar {\n  display: block;\n}\n.asset-explore-shell .asset-explore-grid {\n  min-height: 0;\n  height: 100%;\n}\n.asset-explore-shell .asset-explore-smart-list {\n  min-height: 0;\n  height: 100%;\n}\n.asset-explore-shell .asset-explore-card-list {\n  min-height: 0;\n  padding-right: 0.12rem;\n  padding-bottom: 0.3rem;\n  overscroll-behavior-y: contain;\n}\n.asset-explore-shell .asset-explore-panel {\n  position: relative;\n  z-index: 0;\n  min-height: 0;\n  padding: 0;\n}\n.asset-explore-shell .asset-explore-empty-state {\n  grid-column: 1/-1;\n  display: grid;\n  place-items: center;\n  gap: 0.55rem;\n  min-height: 220px;\n  border: 1px dashed rgba(118, 137, 165, 0.34);\n  border-radius: 18px;\n  background: rgba(255, 255, 255, 0.76);\n  color: rgba(51, 72, 103, 0.78);\n  text-align: center;\n  padding: 1.2rem;\n}\n.asset-explore-shell .asset-explore-empty-state .mat-icon {\n  width: 26px;\n  height: 26px;\n  font-size: 26px;\n  line-height: 26px;\n}\n.asset-explore-shell .asset-explore-empty-state-error {\n  border-color: rgba(185, 79, 79, 0.34);\n  color: rgba(146, 45, 45, 0.84);\n  background: rgba(255, 244, 244, 0.88);\n}\n.asset-explore-shell .asset-explore-sticky-header {\n  z-index: 18;\n  margin-bottom: 0;\n  box-shadow: 0 0.34rem 0 rgba(255, 255, 255, 0.98);\n}\n.asset-explore-shell .asset-explore-basket {\n  position: absolute;\n  right: 0.75rem;\n  bottom: 0.9rem;\n  z-index: 18;\n  display: grid;\n  gap: 0.6rem;\n  justify-items: end;\n  pointer-events: none;\n}\n.asset-explore-shell .asset-explore-basket-fab,\n.asset-explore-shell .asset-explore-basket-panel,\n.asset-explore-shell .asset-explore-basket-panel__close,\n.asset-explore-shell .asset-explore-basket-item__btn {\n  pointer-events: auto;\n}\n.asset-explore-shell .asset-explore-basket-fab {\n  width: 58px;\n  height: 58px;\n  border: 1px solid rgba(201, 145, 54, 0.48);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 248, 225, 0.99) 0%,\n      rgba(255, 218, 148, 0.99) 100%);\n  color: #8f4d0c;\n  box-shadow: 0 18px 34px rgba(122, 74, 18, 0.24);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n  cursor: pointer;\n}\n.asset-explore-shell .asset-explore-basket-fab.is-open {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(244, 141, 79, 0.99) 0%,\n      rgba(214, 95, 48, 0.99) 100%);\n  color: #fff;\n}\n.asset-explore-shell .asset-explore-basket-fab .mat-icon {\n  width: 24px;\n  height: 24px;\n  font-size: 24px;\n  line-height: 24px;\n}\n.asset-explore-shell .asset-explore-basket-fab__count {\n  position: absolute;\n  top: -4px;\n  right: -3px;\n  min-width: 24px;\n  height: 24px;\n  padding: 0 0.35rem;\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #ff8a5f 0%,\n      #e0583f 100%);\n  color: #fff;\n  font-size: 0.78rem;\n  font-weight: 800;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 10px 18px rgba(148, 55, 38, 0.28);\n}\n.asset-explore-shell .asset-explore-basket-panel {\n  width: min(340px, 100vw - 2rem);\n  border-radius: 20px;\n  border: 1px solid rgba(211, 184, 128, 0.84);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 252, 244, 0.99) 0%,\n      rgba(255, 244, 224, 0.98) 100%);\n  box-shadow: 0 22px 46px rgba(82, 54, 22, 0.2);\n  padding: 0.9rem;\n  display: grid;\n  gap: 0.8rem;\n}\n.asset-explore-shell .asset-explore-basket-panel__head {\n  display: flex;\n  align-items: start;\n  justify-content: space-between;\n  gap: 0.75rem;\n}\n.asset-explore-shell .asset-explore-basket-panel__head strong {\n  display: block;\n  color: #1f3f68;\n  font-size: 0.98rem;\n}\n.asset-explore-shell .asset-explore-basket-panel__head span {\n  display: block;\n  margin-top: 0.15rem;\n  color: rgba(31, 63, 104, 0.68);\n  font-size: 0.8rem;\n}\n.asset-explore-shell .asset-explore-basket-panel__close {\n  width: 34px;\n  height: 34px;\n  border-radius: 999px;\n  border: 1px solid rgba(186, 205, 229, 0.88);\n  background: rgba(248, 251, 255, 0.95);\n  color: #4b688b;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n}\n.asset-explore-shell .asset-explore-basket-panel__close .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  margin: 0;\n}\n.asset-explore-shell .asset-explore-basket-panel__list {\n  display: grid;\n  gap: 0.65rem;\n  max-height: min(46vh, 320px);\n  overflow: auto;\n}\n.asset-explore-shell .asset-explore-basket-item {\n  border-radius: 16px;\n  border: 1px solid rgba(190, 211, 232, 0.84);\n  background: rgba(255, 255, 255, 0.94);\n  padding: 0.8rem;\n  display: grid;\n  gap: 0.65rem;\n}\n.asset-explore-shell .asset-explore-basket-item__copy {\n  display: grid;\n  gap: 0.18rem;\n}\n.asset-explore-shell .asset-explore-basket-item__copy strong {\n  color: #264a73;\n}\n.asset-explore-shell .asset-explore-basket-item__copy span {\n  color: rgba(39, 72, 109, 0.76);\n  font-size: 0.82rem;\n}\n.asset-explore-shell .asset-explore-basket-item__actions {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.45rem;\n}\n.asset-explore-shell .asset-explore-basket-item__btn {\n  min-height: 34px;\n  padding: 0 0.8rem;\n  border-radius: 999px;\n  border: 1px solid rgba(182, 202, 226, 0.88);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(249, 252, 255, 0.98) 0%,\n      rgba(236, 244, 252, 0.98) 100%);\n  color: #2f5d96;\n  font-weight: 800;\n  cursor: pointer;\n}\n.asset-explore-shell .asset-explore-basket-item__btn--clear {\n  color: #a04844;\n}\n.asset-explore-shell .asset-explore-borrow-overlay {\n  z-index: 24;\n}\n.asset-explore-shell .asset-explore-borrow-popup {\n  width: min(760px, 100vw - 1.6rem);\n}\n.asset-explore-shell .asset-explore-borrow-form {\n  display: grid;\n  gap: 0.95rem;\n}\n.asset-explore-shell .asset-explore-borrow-slot,\n.asset-explore-shell .asset-explore-borrow-quantity-field {\n  display: grid;\n  gap: 0.38rem;\n}\n.asset-explore-shell .asset-explore-borrow-slot__label,\n.asset-explore-shell .asset-explore-borrow-quantity-field > span {\n  font-size: 0.8rem;\n  font-weight: 800;\n  color: rgba(29, 48, 75, 0.78);\n}\n.asset-explore-shell .asset-explore-borrow-slot__row {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(148px, 176px);\n  gap: 0.72rem;\n  align-items: center;\n}\n.asset-explore-shell .asset-explore-borrow-quantity-field input {\n  width: 100%;\n  min-height: 40px;\n  padding: 0 0.9rem;\n  border: 1px solid rgba(136, 156, 186, 0.5);\n  border-radius: 12px;\n  background: #fff;\n  color: #1d3556;\n  font: inherit;\n  font-weight: 700;\n  box-sizing: border-box;\n}\n.asset-explore-shell .asset-explore-borrow-quantity-field input:focus {\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n  outline: none;\n}\n.asset-explore-shell .asset-explore-borrow-availability {\n  margin: 0.1rem 0 0;\n  font-size: 0.84rem;\n  font-weight: 700;\n  color: rgba(48, 87, 56, 0.82);\n}\n.asset-explore-shell .asset-explore-borrow-review-card {\n  display: grid;\n  gap: 0.7rem;\n  padding: 0.85rem 0.95rem;\n  border: 1px solid rgba(202, 219, 237, 0.9);\n  border-radius: 16px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(250, 253, 255, 0.98) 0%,\n      rgba(240, 247, 255, 0.96) 100%);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);\n}\n.asset-explore-shell .asset-explore-borrow-review-card--payment {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(251, 247, 239, 0.98) 0%,\n      rgba(247, 239, 224, 0.98) 100%);\n  border-color: rgba(224, 191, 142, 0.78);\n}\n.asset-explore-shell .asset-explore-borrow-review-card__head {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 0.75rem;\n}\n.asset-explore-shell .asset-explore-borrow-review-card__head > div {\n  display: grid;\n  gap: 0.22rem;\n}\n.asset-explore-shell .asset-explore-borrow-review-card__head h4 {\n  margin: 0;\n  font-size: 0.94rem;\n  font-weight: 800;\n  color: #214168;\n}\n.asset-explore-shell .asset-explore-borrow-review-card__head span {\n  color: rgba(35, 57, 88, 0.74);\n  font-size: 0.8rem;\n  font-weight: 600;\n  line-height: 1.28;\n}\n.asset-explore-shell .asset-explore-borrow-review-card__head strong {\n  color: #214168;\n  font-size: 0.94rem;\n  font-weight: 800;\n  white-space: nowrap;\n}\n.asset-explore-shell .asset-explore-borrow-review-card__list,\n.asset-explore-shell .asset-explore-borrow-policy-list {\n  display: grid;\n  gap: 0.55rem;\n}\n.asset-explore-shell .asset-explore-borrow-review-card__item,\n.asset-explore-shell .asset-explore-borrow-policy-card {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 0.75rem;\n  padding: 0.78rem 0.85rem;\n  border-radius: 14px;\n  border: 1px solid rgba(203, 219, 238, 0.92);\n  background: rgba(255, 255, 255, 0.95);\n}\n.asset-explore-shell .asset-explore-borrow-review-card__item > div,\n.asset-explore-shell .asset-explore-borrow-policy-card > div {\n  display: grid;\n  gap: 0.24rem;\n  min-width: 0;\n}\n.asset-explore-shell .asset-explore-borrow-review-card__item strong,\n.asset-explore-shell .asset-explore-borrow-policy-card strong {\n  color: #24456d;\n  font-size: 0.9rem;\n  font-weight: 800;\n}\n.asset-explore-shell .asset-explore-borrow-review-card__item span,\n.asset-explore-shell .asset-explore-borrow-policy-card span {\n  color: rgba(35, 57, 88, 0.74);\n  font-size: 0.8rem;\n  line-height: 1.3;\n}\n.asset-explore-shell .asset-explore-borrow-policy-card {\n  align-items: center;\n}\n.asset-explore-shell .asset-explore-borrow-policy-card input {\n  width: 18px;\n  height: 18px;\n  margin: 0.1rem 0 0;\n  accent-color: #3467b6;\n  flex: 0 0 auto;\n}\n.asset-explore-shell .asset-explore-borrow-policy-card.is-required {\n  border-color: rgba(228, 189, 122, 0.78);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 251, 244, 0.98) 0%,\n      rgba(255, 247, 233, 0.96) 100%);\n}\n.asset-explore-shell .asset-explore-borrow-policy-card em {\n  color: #9e6422;\n  font-size: 0.74rem;\n  font-style: normal;\n  font-weight: 800;\n  white-space: nowrap;\n}\n.asset-explore-shell .asset-explore-borrow-payment-summary {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.65rem;\n}\n.asset-explore-shell .asset-explore-borrow-payment-summary article {\n  display: grid;\n  gap: 0.24rem;\n  padding: 0.75rem 0.8rem;\n  border-radius: 14px;\n  border: 1px solid rgba(228, 194, 145, 0.82);\n  background: rgba(255, 255, 255, 0.9);\n}\n.asset-explore-shell .asset-explore-borrow-payment-summary span {\n  color: rgba(86, 60, 31, 0.76);\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.asset-explore-shell .asset-explore-borrow-payment-summary strong {\n  color: #6a4a1c;\n  font-size: 0.94rem;\n  font-weight: 800;\n}\n.asset-explore-shell .asset-explore-borrow-payment-note {\n  margin: 0;\n  color: rgba(86, 60, 31, 0.76);\n  font-size: 0.8rem;\n  line-height: 1.35;\n}\n.asset-explore-shell .asset-explore-borrow-payment-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.7rem;\n}\n.asset-explore-shell .asset-explore-borrow-payment-grid label {\n  display: grid;\n  gap: 0.35rem;\n}\n.asset-explore-shell .asset-explore-borrow-payment-grid span {\n  color: rgba(86, 60, 31, 0.76);\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.asset-explore-shell .asset-explore-borrow-payment-grid input {\n  height: 46px;\n  border-radius: 16px;\n  border: 1px solid rgba(192, 212, 232, 0.9);\n  background: rgba(244, 248, 252, 0.96);\n  color: rgba(64, 83, 110, 0.9);\n  padding: 0 0.9rem;\n  box-sizing: border-box;\n}\n.asset-explore-shell .asset-explore-borrow-actions {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.7rem;\n  padding-top: 0.1rem;\n}\n.asset-explore-shell .asset-explore-borrow-confirm-shell {\n  position: relative;\n  display: inline-flex;\n  align-items: stretch;\n  justify-content: center;\n  min-width: 176px;\n  height: 50px;\n  border-radius: 999px;\n  padding: 2px;\n  box-sizing: border-box;\n  overflow: hidden;\n}\n.asset-explore-shell .asset-explore-borrow-confirm-ring {\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n}\n.asset-explore-shell .asset-explore-borrow-actions__btn {\n  min-height: 42px;\n  padding: 0 1rem;\n  border-radius: 999px;\n  border: 1px solid rgba(182, 202, 226, 0.88);\n  font: inherit;\n  font-size: 0.84rem;\n  font-weight: 800;\n  cursor: pointer;\n  transition:\n    transform 120ms ease,\n    box-shadow 120ms ease,\n    background 120ms ease;\n}\n.asset-explore-shell .asset-explore-borrow-actions__btn:disabled {\n  cursor: not-allowed;\n  opacity: 0.55;\n  transform: none;\n}\n.asset-explore-shell .asset-explore-borrow-actions__btn--secondary {\n  background: rgba(255, 255, 255, 0.96);\n  color: #496789;\n}\n.asset-explore-shell .asset-explore-borrow-actions__btn--primary {\n  min-width: 164px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(138, 181, 236, 0.96) 0%,\n      rgba(102, 151, 217, 0.96) 100%);\n  border-color: rgba(93, 138, 202, 0.92);\n  color: #fff;\n  box-shadow: 0 10px 24px rgba(52, 103, 182, 0.22);\n}\n.asset-explore-shell .asset-explore-borrow-actions__btn--confirm {\n  position: relative;\n  z-index: 1;\n  width: 100%;\n  min-width: 176px;\n  height: 100%;\n  min-height: 46px;\n  border-color: transparent;\n}\n.asset-explore-shell .asset-explore-borrow-confirm-shell.is-loading .asset-explore-borrow-actions__btn--confirm,\n.asset-explore-shell .asset-explore-borrow-confirm-shell.is-loading .asset-explore-borrow-actions__btn--confirm:hover,\n.asset-explore-shell .asset-explore-borrow-confirm-shell.is-loading .asset-explore-borrow-actions__btn--confirm:disabled {\n  border-color: rgba(181, 117, 23, 0.76);\n  background:\n    linear-gradient(\n      180deg,\n      #ffe7bf 0%,\n      #ffd085 100%);\n  color: #8e4f0d;\n  opacity: 1;\n  cursor: wait;\n  box-shadow: none;\n  transform: none;\n}\n.asset-explore-shell .asset-explore-borrow-confirm-shell.is-error .asset-explore-borrow-actions__btn--confirm,\n.asset-explore-shell .asset-explore-borrow-confirm-shell.is-error .asset-explore-borrow-actions__btn--confirm:hover {\n  border-color: rgba(176, 31, 46, 0.82);\n  background:\n    linear-gradient(\n      180deg,\n      #f36a79 0%,\n      #d4374a 100%);\n  color: #fff;\n  opacity: 1;\n  box-shadow: none;\n  transform: none;\n}\n.asset-explore-shell .asset-explore-borrow-actions__btn:not(:disabled):hover {\n  transform: translateY(-1px);\n}\n:host ::ng-deep .asset-explore-borrow-panel .event-date-field,\n:host ::ng-deep .asset-explore-borrow-panel .event-time-field {\n  width: 100%;\n  --mat-form-field-filled-container-color: transparent;\n  --mdc-filled-text-field-container-color: transparent;\n  --mat-form-field-state-layer-color: transparent;\n  --mat-form-field-hover-state-layer-opacity: 0;\n  --mat-form-field-focus-state-layer-opacity: 0;\n  --mat-form-field-outlined-outline-width: 0;\n  --mat-form-field-outlined-focus-outline-width: 0;\n  --mdc-outlined-text-field-outline-color: transparent;\n  --mdc-outlined-text-field-focus-outline-color: transparent;\n  --mdc-outlined-text-field-hover-outline-color: transparent;\n  margin: 0 !important;\n}\n:host ::ng-deep .asset-explore-borrow-panel .event-date-field .mat-mdc-text-field-wrapper,\n:host ::ng-deep .asset-explore-borrow-panel .event-time-field .mat-mdc-text-field-wrapper,\n:host ::ng-deep .asset-explore-borrow-panel .event-date-field .mdc-text-field,\n:host ::ng-deep .asset-explore-borrow-panel .event-time-field .mdc-text-field {\n  min-height: 42px;\n  border: 0 !important;\n  box-shadow: none !important;\n  background: transparent !important;\n  padding: 0;\n}\n:host ::ng-deep .asset-explore-borrow-panel .event-date-field .mdc-notched-outline__leading,\n:host ::ng-deep .asset-explore-borrow-panel .event-date-field .mdc-notched-outline__notch,\n:host ::ng-deep .asset-explore-borrow-panel .event-date-field .mdc-notched-outline__trailing,\n:host ::ng-deep .asset-explore-borrow-panel .event-time-field .mdc-notched-outline__leading,\n:host ::ng-deep .asset-explore-borrow-panel .event-time-field .mdc-notched-outline__notch,\n:host ::ng-deep .asset-explore-borrow-panel .event-time-field .mdc-notched-outline__trailing,\n:host ::ng-deep .asset-explore-borrow-panel .event-date-field .mdc-line-ripple,\n:host ::ng-deep .asset-explore-borrow-panel .event-time-field .mdc-line-ripple,\n:host ::ng-deep .asset-explore-borrow-panel .event-date-field .mat-mdc-form-field-line-ripple,\n:host ::ng-deep .asset-explore-borrow-panel .event-time-field .mat-mdc-form-field-line-ripple,\n:host ::ng-deep .asset-explore-borrow-panel .event-date-field .mat-mdc-form-field-bottom-align,\n:host ::ng-deep .asset-explore-borrow-panel .event-time-field .mat-mdc-form-field-bottom-align,\n:host ::ng-deep .asset-explore-borrow-panel .event-date-field .mat-mdc-form-field-subscript-wrapper,\n:host ::ng-deep .asset-explore-borrow-panel .event-time-field .mat-mdc-form-field-subscript-wrapper {\n  display: none !important;\n}\n:host ::ng-deep .asset-explore-borrow-panel .event-date-field .mat-mdc-form-field-infix,\n:host ::ng-deep .asset-explore-borrow-panel .event-time-field .mat-mdc-form-field-infix {\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  min-height: 40px !important;\n  display: flex;\n  align-items: center;\n}\n:host ::ng-deep .asset-explore-borrow-panel .event-date-field .mat-mdc-form-field-flex,\n:host ::ng-deep .asset-explore-borrow-panel .event-time-field .mat-mdc-form-field-flex {\n  align-items: center !important;\n}\n:host ::ng-deep .asset-explore-borrow-panel .event-date-field input.mat-mdc-input-element,\n:host ::ng-deep .asset-explore-borrow-panel .event-time-field input.mat-mdc-input-element {\n  border: 1px solid rgba(136, 156, 186, 0.5) !important;\n  border-radius: 12px;\n  background: #fff !important;\n  color: #1d3556;\n  min-height: 40px;\n  padding: 0 0.85rem;\n  box-sizing: border-box;\n  box-shadow: none !important;\n  outline: none !important;\n  font-weight: 700;\n}\n:host ::ng-deep .asset-explore-borrow-panel .event-date-field input.mat-mdc-input-element:focus,\n:host ::ng-deep .asset-explore-borrow-panel .event-time-field input.mat-mdc-input-element:focus {\n  border-color: rgba(52, 103, 182, 0.72) !important;\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14) !important;\n}\n:host ::ng-deep .asset-explore-borrow-panel .event-date-field .mat-datepicker-toggle,\n:host ::ng-deep .asset-explore-borrow-panel .event-time-field .mat-timepicker-toggle {\n  margin: 0 !important;\n  align-self: center !important;\n}\n:host ::ng-deep .asset-explore-borrow-panel .event-date-field .mat-datepicker-toggle .mat-mdc-icon-button,\n:host ::ng-deep .asset-explore-borrow-panel .event-time-field .mat-timepicker-toggle .mat-mdc-icon-button {\n  width: 36px;\n  height: 36px;\n  border-radius: 999px;\n  padding: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: #496789;\n}\n:host ::ng-deep .asset-explore-borrow-panel .event-date-field .mat-datepicker-toggle .mat-mdc-icon-button:hover,\n:host ::ng-deep .asset-explore-borrow-panel .event-time-field .mat-timepicker-toggle .mat-mdc-icon-button:hover {\n  background: rgba(73, 103, 137, 0.1);\n}\n.event-resource-popup-shell .experience-form-overlay {\n  position: absolute;\n  inset: 0;\n  z-index: 20;\n  display: flex;\n  align-items: center;\n  padding: 0;\n}\n.event-resource-popup-shell .experience-form-overlay.subevent-asset-route-overlay {\n  z-index: 96;\n}\n.event-resource-popup-shell .experience-form-overlay-backdrop {\n  position: absolute;\n  inset: 0;\n  background: rgba(8, 16, 30, 0.54);\n  -webkit-backdrop-filter: blur(2px);\n  backdrop-filter: blur(2px);\n}\n.event-resource-popup-shell .experience-form-popup {\n  position: relative;\n  z-index: 1;\n  width: min(620px, 100% - 2rem);\n  max-width: min(620px, 100vw - 2rem);\n  max-height: calc(100% - 1.8rem);\n  border-radius: 16px;\n  border: 1px solid rgba(42, 66, 102, 0.28);\n  background: #fff;\n  box-shadow: 0 24px 60px rgba(14, 32, 58, 0.26);\n  overflow: hidden;\n  box-sizing: border-box;\n  display: flex;\n  flex-direction: column;\n  font-family: inherit;\n}\n.event-resource-popup-shell .subevent-group-popup {\n  width: min(620px, 100% - 2rem);\n}\n.event-resource-popup-shell .experience-form-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.6rem;\n  padding: 0.82rem 1rem;\n  border-bottom: 1px solid rgba(187, 199, 217, 0.7);\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #f4f8ff 100%);\n}\n.event-resource-popup-shell .experience-form-header h3 {\n  margin: 0;\n  color: #1e385a;\n  font-size: 1.12rem;\n  font-weight: 700;\n}\n.event-resource-popup-shell .subevent-group-header {\n  align-items: flex-start;\n}\n.event-resource-popup-shell .subevent-group-header-main {\n  min-width: 0;\n  display: grid;\n  gap: 0.3rem;\n}\n.event-resource-popup-shell .subevent-group-stage-subtitle {\n  margin: 0;\n  color: rgba(35, 57, 88, 0.76);\n  font-size: 0.8rem;\n  font-weight: 600;\n  line-height: 1.24;\n}\n.event-resource-popup-shell .experience-form-header-controls {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.44rem;\n}\n.event-resource-popup-shell .experience-form-panel {\n  border: 1px solid rgba(43, 71, 107, 0.2);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #f4f8ff 100%);\n  padding: 0.74rem;\n  display: grid;\n  gap: 0.78rem;\n  margin: 0;\n  box-sizing: border-box;\n  flex: 1 1 auto;\n  min-height: 0;\n  overflow-y: auto;\n  overflow-x: hidden;\n  -webkit-overflow-scrolling: touch;\n}\n.event-resource-popup-shell .subevent-group-form-panel {\n  background:\n    linear-gradient(\n      180deg,\n      #f1f9ff 0%,\n      #e8f3ff 100%);\n  border-color: rgba(63, 118, 188, 0.28);\n}\n.event-resource-popup-shell .experience-form-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  max-width: none;\n  width: 100%;\n  margin: 0;\n  justify-content: stretch;\n  column-gap: 1rem;\n  row-gap: 0.9rem;\n}\n.event-resource-popup-shell .subevent-group-form-grid {\n  grid-template-columns: minmax(0, 1fr);\n  align-content: start;\n  align-items: start;\n}\n.event-resource-popup-shell .subevent-group-form-grid label {\n  display: flex;\n  flex-direction: column;\n  align-items: stretch;\n  gap: 0.22rem !important;\n}\n.event-resource-popup-shell .subevent-capacity-range-field {\n  width: 100%;\n}\n.event-resource-popup-shell .subevent-capacity-range {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);\n  align-items: center;\n  gap: 0.42rem;\n}\n.event-resource-popup-shell .subevent-capacity-range input {\n  width: 100%;\n}\n.event-resource-popup-shell .subevent-capacity-separator {\n  font-size: 0.92rem;\n  font-weight: 800;\n  color: rgba(31, 56, 89, 0.72);\n  line-height: 1;\n}\n.event-resource-popup-shell .asset-route-toolbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.48rem;\n}\n.event-resource-popup-shell .asset-route-toolbar-actions {\n  display: grid;\n  grid-template-columns: repeat(2, 30px);\n  justify-content: end;\n  align-items: center;\n  gap: 0.46rem;\n}\n.event-resource-popup-shell .asset-route-toolbar-actions.asset-route-toolbar-actions-single {\n  grid-template-columns: 30px;\n}\n.event-resource-popup-shell .asset-route-toolbar-separator {\n  height: 1px;\n  width: 100%;\n  background: rgba(38, 65, 99, 0.16);\n  margin: 0.36rem 0 0.5rem;\n}\n.event-resource-popup-shell .asset-route-list {\n  display: grid;\n  gap: 0.5rem;\n}\n.event-resource-popup-shell .asset-route-row {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto auto;\n  align-items: center;\n  gap: 0.62rem;\n  width: 100%;\n}\n.event-resource-popup-shell .asset-route-row input {\n  width: 100%;\n  min-width: 0;\n}\n.event-resource-popup-shell .asset-route-drag-btn,\n.event-resource-popup-shell .asset-route-map-btn,\n.event-resource-popup-shell .asset-route-delete-btn,\n.event-resource-popup-shell .asset-route-add-btn {\n  width: 30px;\n  height: 30px;\n}\n.event-resource-popup-shell .subevent-asset-capacity-overlay .experience-action-btn {\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  border: 1px solid rgba(42, 67, 101, 0.26);\n  background: rgba(255, 255, 255, 0.88);\n  color: #2d5ea8;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n}\n.event-resource-popup-shell .subevent-asset-capacity-overlay .experience-action-btn .mat-icon {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n  line-height: 15px;\n}\n.event-resource-popup-shell .subevent-asset-capacity-overlay .experience-action-btn.asset-route-map-btn {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f7fc 0%,\n      #e8eef9 100%);\n  border-color: rgba(53, 91, 140, 0.26);\n  color: #315e9a;\n}\n.event-resource-popup-shell .subevent-asset-capacity-overlay .experience-action-btn.asset-route-main-map-btn {\n  background:\n    linear-gradient(\n      180deg,\n      #ffe8cc 0%,\n      #ffd7af 100%);\n  border-color: rgba(179, 108, 42, 0.54);\n  color: #8c4f18;\n}\n.event-resource-popup-shell .subevent-asset-capacity-overlay .experience-action-btn.asset-route-main-map-btn:disabled {\n  opacity: 0.75;\n}\n.event-resource-popup-shell .asset-route-drag-btn {\n  cursor: grab;\n}\n.event-resource-popup-shell .asset-route-drag-btn:active {\n  cursor: grabbing;\n}\n.event-resource-popup-shell .asset-route-add-btn {\n  color: #2f5ea0;\n}\n.event-resource-popup-shell .asset-route-delete-btn {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f1 0%,\n      #ffe4e4 100%);\n  border-color: rgba(177, 40, 40, 0.32);\n  color: #b12828;\n}\n.event-resource-popup-shell .subevent-resource-editor-error {\n  margin: 0;\n  color: #9b2c37;\n  font-size: 0.74rem;\n  font-weight: 700;\n}\n.event-resource-popup-shell .subevent-asset-capacity-overlay .experience-action-btn:disabled {\n  opacity: 0.72;\n  cursor: not-allowed;\n}\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel {\n  min-width: 220px;\n  margin-top: 8px !important;\n  margin-bottom: 8px !important;\n}\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .cdk-overlay-pane .mat-mdc-select-panel.subevent-resource-options-panel.mat-mdc-select-panel-above {\n  margin-top: 0 !important;\n  margin-bottom: 18px !important;\n}\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-filter-transport,\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-filter-transport .status-option-content,\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-filter-transport .status-option-content .mat-icon {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eef6ff);\n  color: #295d96;\n}\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-filter-accommodation,\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-filter-accommodation .status-option-content,\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-filter-accommodation .status-option-content .mat-icon {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf9f4);\n  color: #236d51;\n}\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-filter-supplies,\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-filter-supplies .status-option-content,\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-filter-supplies .status-option-content .mat-icon {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff5ec);\n  color: #8a5428;\n}\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-camping,\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-camping .status-option-content,\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-camping .status-option-content .mat-icon {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6f3e7);\n  color: #7a6423;\n}\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-cooking,\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-cooking .status-option-content,\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-cooking .status-option-content .mat-icon {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff3e6);\n  color: #9a531c;\n}\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-games,\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-games .status-option-content,\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-games .status-option-content .mat-icon {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3edff);\n  color: #5f43a5;\n}\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-audio,\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-audio .status-option-content,\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-audio .status-option-content .mat-icon {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #ecf8ff);\n  color: #2a7196;\n}\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-sports,\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-sports .status-option-content,\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-sports .status-option-content .mat-icon {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1eb);\n  color: #a34d28;\n}\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-safety,\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-safety .status-option-content,\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-safety .status-option-content .mat-icon {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff2f3);\n  color: #a84360;\n}\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-decor,\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-decor .status-option-content,\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-decor .status-option-content .mat-icon {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1f8);\n  color: #9c4a79;\n}\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-tech,\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-tech .status-option-content,\n:host ::ng-deep .mat-mdc-select-panel.subevent-resource-options-panel .mat-mdc-option.status-option.asset-category-tech .status-option-content .mat-icon {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eef4ff);\n  color: #2f5fa8;\n}\n.subevent-asset-view-popup {\n  width: min(560px, 100vw - 2rem);\n}\n.event-resource-popup-shell .subevent-asset-view-overlay {\n  position: fixed;\n  top: var(--event-resource-shell-gap);\n  left: 50%;\n  z-index: 80;\n  width: min(var(--event-resource-panel-max-width), 100vw - var(--event-resource-shell-gap) * 2);\n  height: calc(100vh - var(--event-resource-shell-gap) * 2);\n  height: calc(100dvh - var(--event-resource-shell-gap) * 2);\n  padding: 0;\n  transform: translateX(-50%);\n  align-items: stretch;\n  justify-content: stretch;\n}\n.event-resource-popup-shell .subevent-asset-view-popup {\n  width: 100%;\n  max-width: 100%;\n  height: 100%;\n  max-height: 100%;\n  border-radius: 14px;\n}\n.event-resource-popup-shell .subevent-asset-view-media img {\n  height: 186px;\n  aspect-ratio: auto;\n}\n.event-resource-popup-shell .subevent-asset-view-grid.experience-form-grid {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  column-gap: 1rem;\n  row-gap: 0.9rem;\n}\n.event-resource-popup-shell .subevent-asset-view-grid .experience-description-field,\n.event-resource-popup-shell .subevent-asset-view-summary-panel {\n  grid-column: 1/-1;\n}\n.event-resource-popup-shell .subevent-asset-view-summary-body .event-slots-open-btn {\n  width: fit-content;\n  min-width: 170px;\n  justify-self: start;\n}\n.event-resource-popup-shell .subevent-asset-view-pricing .subevent-asset-view-summary-body {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  align-items: stretch;\n}\n.event-resource-popup-shell .subevent-asset-view-pricing .subevent-asset-view-summary-card {\n  min-height: 188px;\n}\n.event-resource-popup-shell .subevent-asset-view-policies .subevent-asset-view-summary-body {\n  grid-template-columns: minmax(170px, max-content) minmax(0, 1fr);\n  align-items: start;\n}\n.event-resource-popup-shell .subevent-asset-view-policies .event-slots-summary {\n  grid-column: 1/-1;\n}\n.subevent-asset-view-members-btn {\n  min-height: 34px;\n  flex: 0 0 auto;\n}\n.subevent-asset-view-panel {\n  display: grid;\n  gap: 0.95rem;\n}\n.subevent-asset-view-media {\n  border: 1px solid rgba(33, 54, 82, 0.14);\n  border-radius: 10px;\n  overflow: hidden;\n  background: rgba(236, 243, 252, 0.72);\n}\n.subevent-asset-view-media img {\n  display: block;\n  width: 100%;\n  height: clamp(168px, 42vw, 210px);\n  object-fit: cover;\n}\n.subevent-asset-view-grid input:disabled,\n.subevent-asset-view-grid textarea:disabled {\n  border-color: rgba(126, 142, 164, 0.28);\n  color: rgba(34, 50, 74, 0.62);\n  -webkit-text-fill-color: rgba(34, 50, 74, 0.62);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9fc 0%,\n      #edf1f6 100%);\n  box-shadow: none;\n  opacity: 1;\n  cursor: default;\n}\n.subevent-asset-view-grid .subevent-asset-view-selector {\n  width: 100%;\n  min-height: 42px;\n  box-sizing: border-box;\n  border-color: rgba(126, 142, 164, 0.28) !important;\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9fc 0%,\n      #edf1f6 100%) !important;\n  color: rgba(34, 50, 74, 0.62) !important;\n  box-shadow: none !important;\n  filter: grayscale(0.12);\n  opacity: 1;\n  pointer-events: none;\n  cursor: default;\n}\n.subevent-asset-view-grid .subevent-asset-view-selector .status-option-content,\n.subevent-asset-view-grid .subevent-asset-view-selector .status-option-content span,\n.subevent-asset-view-grid .subevent-asset-view-selector .status-option-content .mat-icon,\n.subevent-asset-view-grid .subevent-asset-view-selector > .mat-icon:last-child {\n  color: rgba(34, 50, 74, 0.62) !important;\n  opacity: 1;\n}\n.subevent-asset-view-grid.experience-form-grid {\n  grid-template-columns: minmax(0, 1fr);\n}\n.subevent-asset-view-image-field {\n  display: grid;\n  gap: 0.35rem;\n  color: #344660;\n  font-weight: 800;\n}\n.subevent-asset-view-source-field {\n  display: grid;\n  gap: 0.35rem;\n  color: #344660;\n  font-weight: 800;\n}\n.subevent-asset-view-source-field input:disabled {\n  width: 100%;\n  min-width: 0;\n  min-height: 42px;\n  border: 1px solid rgba(126, 142, 164, 0.28);\n  border-radius: 10px;\n  padding: 0.58rem 0.72rem;\n  color: rgba(34, 50, 74, 0.62);\n  -webkit-text-fill-color: rgba(34, 50, 74, 0.62);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9fc 0%,\n      #edf1f6 100%);\n  font: inherit;\n  font-weight: 800;\n  box-shadow: none;\n  box-sizing: border-box;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  opacity: 1;\n  cursor: default;\n}\n.subevent-asset-view-summary-panel {\n  display: grid;\n  gap: 0.7rem;\n  padding: 0.95rem;\n  border: 1px solid rgba(33, 54, 82, 0.13);\n  border-radius: 14px;\n  background: rgba(255, 255, 255, 0.68);\n}\n.subevent-asset-view-pricing {\n  border-color: rgba(40, 133, 112, 0.2);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(236, 251, 245, 0.84),\n      rgba(247, 252, 250, 0.74));\n}\n.subevent-asset-view-policies {\n  border-color: rgba(119, 82, 166, 0.18);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(247, 240, 255, 0.84),\n      rgba(252, 249, 255, 0.72));\n}\n.subevent-asset-view-route {\n  border-color: rgba(52, 103, 170, 0.18);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(239, 246, 255, 0.9),\n      rgba(248, 251, 255, 0.74));\n}\n.subevent-asset-view-summary-panel .event-policies-panel-head {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 0.75rem;\n}\n.subevent-asset-view-summary-panel .event-policies-panel-title-wrap {\n  min-width: 0;\n  display: grid;\n  gap: 0.18rem;\n}\n.subevent-asset-view-summary-panel .event-policies-panel-title {\n  display: inline-grid;\n  grid-template-columns: 20px minmax(0, auto);\n  align-items: center;\n  justify-content: start;\n  line-height: 1.15;\n}\n.subevent-asset-view-summary-panel .event-policies-panel-title .mat-icon {\n  width: 20px;\n  height: 20px;\n  font-size: 20px;\n  line-height: 20px;\n  align-self: center;\n}\n.subevent-asset-view-summary-panel .event-policies-panel-title span {\n  align-self: center;\n}\n.subevent-asset-view-summary-body {\n  display: grid;\n  gap: 0.65rem;\n}\n.subevent-asset-view-summary-body .event-slots-open-btn,\n.subevent-asset-view-policy-popup-body .event-slots-open-btn {\n  min-width: 138px;\n  min-height: 38px;\n  padding: 0.42rem 0.82rem;\n  border-radius: 999px;\n  border: 1px solid rgba(65, 129, 205, 0.34);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.34rem;\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #e8f3ff 100%);\n  color: #1f5f9e;\n  font-size: 0.8rem;\n  font-weight: 800;\n  cursor: pointer;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92), 0 3px 9px rgba(35, 83, 145, 0.12);\n}\n.subevent-asset-view-summary-body .event-slots-open-btn:disabled,\n.subevent-asset-view-policy-popup-body .event-slots-open-btn:disabled {\n  cursor: default;\n  border-color: rgba(128, 149, 176, 0.18);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9fc 0%,\n      #eef3f8 100%);\n  color: #8a9ab0;\n  box-shadow: none;\n  opacity: 1;\n}\n.subevent-asset-view-summary-body .event-slots-open-btn .mat-icon,\n.subevent-asset-view-policy-popup-body .event-slots-open-btn .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n@media (hover: hover) and (pointer: fine) {\n  .subevent-asset-view-summary-body .event-slots-open-btn:not(:disabled):hover,\n  .subevent-asset-view-policy-popup-body .event-slots-open-btn:not(:disabled):hover {\n    transform: translateY(-1px);\n    border-color: rgba(48, 111, 190, 0.46);\n    background:\n      linear-gradient(\n        180deg,\n        #ffffff 0%,\n        #dcecff 100%);\n    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.96), 0 6px 14px rgba(35, 83, 145, 0.16);\n  }\n}\n.subevent-asset-view-summary-body .event-slots-summary {\n  display: grid;\n  gap: 0.55rem;\n}\n.subevent-asset-view-summary-body .event-slots-summary-block {\n  display: grid;\n  gap: 0.4rem;\n  padding: 0.8rem 0.92rem;\n  border: 1px solid rgba(33, 54, 82, 0.12);\n  border-radius: 12px;\n  background: rgba(255, 255, 255, 0.76);\n}\n.subevent-asset-view-summary-body .event-slots-summary-label {\n  color: #61708a;\n  font-size: 0.72rem;\n  font-weight: 900;\n  text-transform: uppercase;\n}\n.subevent-asset-view-summary-body .event-slots-summary-list {\n  display: grid;\n  gap: 0.45rem;\n}\n.subevent-asset-view-summary-body .event-slots-summary-item {\n  display: grid;\n  gap: 0.14rem;\n}\n.subevent-asset-view-summary-body .event-slots-summary-title {\n  color: #233653;\n  font-weight: 900;\n}\n.subevent-asset-view-summary-body .event-slots-summary-meta,\n.subevent-asset-view-summary-body .event-slots-summary-note {\n  margin: 0;\n  color: #60708a;\n  line-height: 1.4;\n}\n.subevent-asset-view-summary-status {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 54px;\n  min-height: 30px;\n  padding: 0.25rem 0.7rem;\n  border-radius: 999px;\n  border: 1px solid rgba(36, 135, 92, 0.32);\n  background: rgba(217, 247, 226, 0.78);\n  color: #196b45;\n  font-size: 0.78rem;\n  font-weight: 900;\n}\n.subevent-asset-view-summary-status.is-off {\n  border-color: rgba(120, 132, 150, 0.22);\n  background: rgba(241, 245, 249, 0.86);\n  color: #5a6b7f;\n}\n.subevent-asset-view-summary-card {\n  display: grid;\n  gap: 0.45rem;\n  padding: 0.85rem 1rem;\n  border: 1px solid rgba(33, 54, 82, 0.12);\n  border-radius: 12px;\n  background: rgba(255, 255, 255, 0.84);\n  color: #22324a;\n}\n.subevent-asset-view-summary-card p {\n  margin: 0;\n  color: #60708a;\n  line-height: 1.4;\n}\n.subevent-asset-view-summary-card-muted {\n  background: rgba(255, 255, 255, 0.58);\n}\n.subevent-asset-view-price-row,\n.subevent-asset-view-price-final {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.75rem;\n}\n.subevent-asset-view-price-row {\n  padding-bottom: 0.4rem;\n  border-bottom: 1px solid rgba(33, 54, 82, 0.1);\n}\n.subevent-asset-view-price-final {\n  font-size: 1.08rem;\n  font-weight: 900;\n}\n.subevent-asset-view-price-final strong {\n  color: #168061;\n  font-size: 1.4rem;\n}\n.subevent-asset-view-policy-summary {\n  padding: 0.55rem 0.7rem;\n  border: 1px solid rgba(116, 78, 158, 0.13);\n  border-radius: 10px;\n  background: rgba(255, 255, 255, 0.72);\n  color: #5a4b7c;\n  font-weight: 900;\n}\n.subevent-asset-view-policy-list {\n  display: grid;\n  gap: 0.55rem;\n}\n.subevent-asset-view-policy-row {\n  display: grid;\n  gap: 0.35rem;\n  padding: 0.7rem 0.8rem;\n  border: 1px solid rgba(116, 78, 158, 0.14);\n  border-radius: 10px;\n  background: rgba(255, 255, 255, 0.82);\n}\n.subevent-asset-view-policy-row div {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.75rem;\n}\n.subevent-asset-view-policy-row strong {\n  min-width: 0;\n  color: #22324a;\n}\n.subevent-asset-view-policy-row span {\n  flex: 0 0 auto;\n  padding: 0.18rem 0.5rem;\n  border-radius: 999px;\n  background: rgba(239, 232, 255, 0.9);\n  color: #60468e;\n  font-size: 0.72rem;\n  font-weight: 900;\n}\n.subevent-asset-view-policy-row p {\n  margin: 0;\n  color: #62728a;\n  line-height: 1.4;\n}\n.subevent-asset-view-policy-backdrop {\n  position: absolute;\n  inset: 0;\n  z-index: 14;\n  border-radius: inherit;\n  background: rgba(24, 35, 52, 0.28);\n  -webkit-backdrop-filter: blur(2px);\n  backdrop-filter: blur(2px);\n}\n.subevent-asset-view-policy-popup {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  z-index: 15;\n  width: min(500px, 100% - 2rem);\n  max-height: min(620px, 100% - 2rem);\n  transform: translate(-50%, -50%);\n  display: grid;\n  grid-template-rows: auto minmax(0, 1fr);\n  overflow: hidden;\n  border: 1px solid rgba(33, 54, 82, 0.15);\n  border-radius: 16px;\n  background: #ffffff;\n  box-shadow: 0 18px 42px rgba(28, 42, 66, 0.22);\n}\n.subevent-asset-view-policy-popup-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.75rem;\n  padding: 0.9rem 1rem;\n  border-bottom: 1px solid rgba(33, 54, 82, 0.12);\n}\n.subevent-asset-view-policy-popup-head div {\n  min-width: 0;\n  display: grid;\n  gap: 0.15rem;\n}\n.subevent-asset-view-policy-popup-title {\n  color: #17243a;\n  font-size: 1.08rem;\n  font-weight: 900;\n}\n.subevent-asset-view-policy-popup-subtitle {\n  color: #60708a;\n  font-size: 0.82rem;\n  font-weight: 700;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.subevent-asset-view-policy-popup-body {\n  min-height: 0;\n  overflow: auto;\n  padding: 0.9rem;\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff,\n      #f8fbff);\n}\n.subevent-asset-view-route-list {\n  display: grid;\n  gap: 0.45rem;\n}\n.subevent-asset-view-route-list span {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.55rem;\n  padding: 0.6rem 0.75rem;\n  border: 1px solid rgba(33, 54, 82, 0.14);\n  border-radius: 8px;\n  background: rgba(255, 255, 255, 0.82);\n  color: #22324a;\n  font-weight: 700;\n}\n.subevent-asset-view-route-list span span {\n  min-width: 0;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n@media (hover: hover) and (pointer: fine) {\n  .event-resource-popup-shell .assets-toolbar .profile-status-select-wrap:hover,\n  .event-resource-popup-shell .assets-toolbar .profile-status-select-wrap .mat-mdc-select-trigger:hover,\n  .event-resource-popup-shell .event-editor-members-trigger:hover,\n  .event-resource-popup-shell .event-editor-members-trigger:active,\n  .event-resource-popup-shell .assets-toolbar .profile-status-select-wrap:active,\n  .event-resource-popup-shell .assets-toolbar .profile-status-select-wrap .mat-mdc-select-trigger:active {\n    transform: none;\n    filter: none;\n  }\n  .event-resource-popup-shell .assets-toolbar .profile-status-select-wrap:hover {\n    box-shadow: 0 4px 11px rgba(37, 72, 116, 0.16);\n  }\n}\n@media (max-width: 760px) {\n  .event-resource-popup-shell .subevent-asset-view-popup {\n    width: min(100vw - 1rem, 420px);\n  }\n  .subevent-asset-view-panel {\n    gap: 0.78rem;\n    padding: 0.72rem;\n  }\n  .event-resource-popup-shell .subevent-asset-view-media img {\n    height: clamp(158px, 44vw, 178px);\n  }\n  .event-resource-popup-shell .subevent-asset-view-grid.experience-form-grid {\n    grid-template-columns: minmax(0, 1fr);\n    row-gap: 0.72rem;\n  }\n  .event-resource-popup-shell .subevent-asset-view-grid.experience-form-grid > label,\n  .event-resource-popup-shell .subevent-asset-view-grid .experience-description-field,\n  .event-resource-popup-shell .subevent-asset-view-summary-panel {\n    grid-column: 1/-1;\n  }\n  .event-resource-popup-shell .subevent-asset-view-summary-panel {\n    padding: 0.78rem;\n    border-radius: 14px;\n  }\n  .subevent-asset-view-route {\n    gap: 0.5rem;\n  }\n  .subevent-asset-view-route .event-policies-panel-title-wrap {\n    gap: 0.24rem;\n  }\n  .subevent-asset-view-route .event-policies-panel-subtitle {\n    margin-bottom: 0.12rem;\n  }\n  .subevent-asset-view-route .subevent-asset-view-summary-body {\n    gap: 0.48rem;\n  }\n  .event-resource-popup-shell .subevent-asset-view-pricing .subevent-asset-view-summary-body,\n  .event-resource-popup-shell .subevent-asset-view-policies .subevent-asset-view-summary-body {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .event-resource-popup-shell .subevent-asset-view-pricing .subevent-asset-view-summary-card {\n    min-height: 0;\n  }\n  .event-resource-popup-shell .subevent-asset-view-summary-body .event-slots-open-btn,\n  .event-resource-popup-shell .subevent-asset-view-policy-popup-body .event-slots-open-btn {\n    justify-self: start;\n    width: auto;\n  }\n  .subevent-asset-view-policy-popup {\n    inset: auto 0 0 0;\n    top: auto;\n    left: 0;\n    width: 100%;\n    max-height: min(70dvh, 560px);\n    transform: none;\n    border-radius: 18px 18px 0 0;\n  }\n  .event-resource-popup-shell .experience-form-overlay {\n    position: fixed;\n    inset: 0;\n    z-index: 80;\n    width: auto;\n    height: auto;\n    padding: 0;\n    transform: none;\n    align-items: stretch;\n    justify-content: stretch;\n  }\n  .event-resource-popup-shell .experience-form-popup,\n  .event-resource-popup-shell .subevent-group-popup {\n    width: 100vw;\n    max-width: 100vw;\n    height: 100dvh;\n    max-height: 100dvh;\n    min-height: 100dvh;\n    border-radius: 0;\n  }\n  .event-resource-popup-shell .experience-form-panel {\n    min-height: 0;\n    flex: 1 1 auto;\n    border-radius: 0;\n  }\n  .event-resource-popup-shell .asset-route-row {\n    gap: 0.48rem;\n  }\n  .event-resource-popup-shell .asset-route-drag-btn,\n  .event-resource-popup-shell .asset-route-map-btn,\n  .event-resource-popup-shell .asset-route-delete-btn,\n  .event-resource-popup-shell .asset-route-add-btn,\n  .event-resource-popup-shell .subevent-asset-capacity-overlay .experience-action-btn {\n    width: 28px;\n    height: 28px;\n  }\n  .event-resource-popup-shell .asset-route-toolbar-actions {\n    grid-template-columns: repeat(2, 28px);\n    gap: 0.38rem;\n  }\n  .asset-explore-shell .asset-explore-borrow-popup {\n    width: 100vw;\n    max-width: 100vw;\n    height: 100dvh;\n    max-height: 100dvh;\n    min-height: 100dvh;\n    border-radius: 0;\n  }\n  .asset-explore-shell .asset-explore-borrow-panel {\n    padding: 0.85rem 0.8rem calc(1rem + env(safe-area-inset-bottom));\n    border-radius: 0;\n  }\n  .asset-explore-shell .asset-explore-borrow-slot__row {\n    grid-template-columns: minmax(0, 1fr);\n    gap: 0.5rem;\n  }\n  .asset-explore-shell .asset-explore-borrow-review-card__head,\n  .asset-explore-shell .asset-explore-borrow-review-card__item,\n  .asset-explore-shell .asset-explore-borrow-policy-card,\n  .asset-explore-shell .asset-explore-borrow-actions {\n    flex-direction: column;\n    align-items: stretch;\n  }\n  .asset-explore-shell .asset-explore-borrow-payment-summary {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .asset-explore-shell .asset-explore-borrow-payment-grid {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .asset-explore-shell .asset-explore-borrow-confirm-shell,\n  .asset-explore-shell .asset-explore-borrow-actions__btn--primary {\n    min-width: 0;\n  }\n  .asset-explore-shell .asset-explore-category-field {\n    width: fit-content !important;\n    min-width: 0 !important;\n    max-width: 154px;\n  }\n  .asset-explore-shell .assets-badge-form-field {\n    width: min(286px, 100vw - 8rem);\n    min-width: min(286px, 100vw - 8rem);\n    max-width: none;\n  }\n  .asset-explore-shell .asset-explore-smart-list,\n  .asset-explore-shell .asset-explore-card-list {\n    min-height: 0;\n  }\n  .asset-explore-shell .asset-explore-basket {\n    right: 0.55rem;\n    bottom: 0.7rem;\n  }\n  .asset-explore-shell .asset-explore-basket-panel {\n    width: min(320px, 100vw - 1.2rem);\n  }\n}\n/*# sourceMappingURL=event-resource-popup.component.css.map */\n'] }]
  }], () => [], { parentZIndex: [{
    type: Input
  }], onEscapePressed: [{
    type: HostListener,
    args: ["window:keydown.escape", ["$event"]]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EventResourcePopupComponent, { className: "EventResourcePopupComponent", filePath: "app/activity/components/event-resource-popup/event-resource-popup.component.ts", lineNumber: 137 });
})();
export {
  EventResourcePopupComponent
};
//# sourceMappingURL=event-resource-popup.component-34OVS4GR.js.map
