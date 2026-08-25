import "./chunk-AN73Y4IE.js";
import "./chunk-GNEKNDCW.js";
import "./chunk-WYVDSPFZ.js";
import "./chunk-BUOFGNAG.js";
import "./chunk-KRAZWVUD.js";
import "./chunk-2VWK4OSJ.js";
import "./chunk-ES5OB5SK.js";
import "./chunk-SYKOEE4K.js";
import "./chunk-KQF6FQ63.js";
import {
  AssetStore
} from "./chunk-3YAFT4SR.js";
import {
  SmartListComponent
} from "./chunk-Y4B3F23A.js";
import {
  SubEventResourcePopupStore
} from "./chunk-QYKZJD5O.js";
import "./chunk-RED67KQG.js";
import "./chunk-2K5TOPNO.js";
import {
  FormFlowComponent
} from "./chunk-P2HUD7M2.js";
import "./chunk-K3APHISM.js";
import "./chunk-6Y23C6K6.js";
import "./chunk-LMBNG6A3.js";
import "./chunk-G54GNJUE.js";
import {
  SingleRowComponent
} from "./chunk-CHNSKMNQ.js";
import "./chunk-MCKAV5IN.js";
import "./chunk-TKEWFTMJ.js";
import "./chunk-4VYYFWRA.js";
import "./chunk-QEZI4ZBE.js";
import "./chunk-HM5TGMNU.js";
import "./chunk-NG77W5PE.js";
import {
  PopupComponent
} from "./chunk-JP2VWQOK.js";
import "./chunk-VEYRCVMX.js";
import "./chunk-MVR37RGJ.js";
import {
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-FOAFZS65.js";
import "./chunk-OAYWPJGG.js";
import {
  DialogStore
} from "./chunk-6TR3Z2F3.js";
import "./chunk-U46O4F4Y.js";
import "./chunk-EDHGCWPF.js";
import "./chunk-CUDLB52K.js";
import "./chunk-DZBHLGEX.js";
import "./chunk-ZJ74HL3J.js";
import {
  ActivityResourcesService
} from "./chunk-4TW3IAAR.js";
import "./chunk-4AR3TCEY.js";
import "./chunk-PK4DOAMC.js";
import {
  UsersService
} from "./chunk-XDZ3ISNV.js";
import "./chunk-XQJEDEHI.js";
import {
  APP_STATIC_DATA,
  ActivityResourceBuilder
} from "./chunk-BHFMDA67.js";
import "./chunk-Q3344WPR.js";
import {
  ASSET_TYPES,
  ASSET_TYPE_ACCOMMODATION,
  ASSET_TYPE_SUPPLIES,
  ASSET_TYPE_TRANSPORT,
  AppUtils
} from "./chunk-ILMZK7SM.js";
import "./chunk-4FWVIYNI.js";
import "./chunk-7MTG4XZU.js";
import "./chunk-J7IJFFQ2.js";
import "./chunk-XQACYBVS.js";
import "./chunk-YKC4KBEC.js";
import "./chunk-B2DKYQGD.js";
import {
  UserProfileStore
} from "./chunk-KLUOB5SD.js";
import "./chunk-6POEHVT7.js";
import "./chunk-2ENBQWLU.js";
import "./chunk-LERGHE7K.js";
import "./chunk-D6ZHKNYF.js";
import "./chunk-SKAK727J.js";
import {
  Component,
  TemplateRef,
  ViewChild,
  __spreadProps,
  __spreadValues,
  from,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵviewQuery
} from "./chunk-XJL7SWH7.js";

// src/app/activity/components/event-supply-contributions-popup/event-supply-contributions-popup.component.ts
var _c0 = ["supplyContributionSmartList"];
var _c1 = ["supplyContributionItemTemplate"];
function EventSupplyContributionsPopupComponent_Conditional_0_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "single-row", 6);
    \u0275\u0275listener("menuRequest", function EventSupplyContributionsPopupComponent_Conditional_0_ng_template_5_Template_single_row_menuRequest_0_listener($event) {
      const openMenu_r4 = \u0275\u0275restoreView(_r3).openMenu;
      return \u0275\u0275resetView(openMenu_r4($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("row", ctx_r1.supplyContributionSingleRow(row_r5))("useSharedMenu", true);
  }
}
function EventSupplyContributionsPopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 2)(1, "div", 3)(2, "div", 4)(3, "app-smart-list", 5, 0);
    \u0275\u0275listener("menuItemSelect", function EventSupplyContributionsPopupComponent_Conditional_0_Template_app_smart_list_menuItemSelect_3_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSupplyContributionSharedMenuSelect($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, EventSupplyContributionsPopupComponent_Conditional_0_ng_template_5_Template, 1, 2, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.supplyContributionsPopupModel())("zIndex", ctx_r1.supplyContributionsPopupZIndex());
    \u0275\u0275advance(3);
    \u0275\u0275property("config", ctx_r1.supplyContributionSmartListConfig)("loadPage", ctx_r1.supplyContributionSmartListLoadPage)("itemTemplate", ctx_r1.supplyContributionItemTemplateRef ?? null)("query", ctx_r1.supplyContributionSmartListQuery);
  }
}
function EventSupplyContributionsPopupComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 2)(1, "app-form-flow", 7);
    \u0275\u0275listener("ngModelChange", function EventSupplyContributionsPopupComponent_Conditional_1_Template_app_form_flow_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onBringItemsFlowValueChange($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const dialog_r7 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.bringItemsPopupModel(dialog_r7))("zIndex", ctx_r1.bringItemsPopupZIndex());
    \u0275\u0275advance();
    \u0275\u0275property("model", ctx_r1.bringItemsFlowModel(dialog_r7))("ngModel", dialog_r7)("disabled", dialog_r7.busy);
  }
}
var EventSupplyContributionsPopupComponent = class _EventSupplyContributionsPopupComponent {
  resourcePopupStore = inject(SubEventResourcePopupStore);
  userProfileStore = inject(UserProfileStore);
  assetStore = inject(AssetStore);
  activityResourcesService = inject(ActivityResourcesService);
  usersService = inject(UsersService);
  dialogStore = inject(DialogStore);
  pendingSupplyBringAbortController = null;
  pendingSupplyBringRequestVersion = 0;
  lastContextKey = "";
  get users() {
    return this.usersService.peekCachedUsers();
  }
  ownedAssetCards() {
    return this.assetStore.assetCards();
  }
  get userById() {
    return new Map(this.users.map((user) => [user.id, user]));
  }
  supplyContributionSmartListQuery = {
    filters: {
      revision: 0,
      contextKey: ""
    }
  };
  supplyContributionSmartList;
  supplyContributionItemTemplateRef;
  set supplyContributionItemTemplate(value) {
    this.supplyContributionItemTemplateRef = value;
  }
  supplyContributionSmartListLoadPage = (query) => from(this.loadSupplyContributionRowsPage(query));
  supplyContributionSmartListConfig = {
    pageSize: 12,
    defaultView: "list",
    headerProgress: {
      enabled: true
    },
    showStickyHeader: false,
    showGroupMarker: () => false,
    emptyLabel: "No quantity added yet",
    emptyDescription: "Use the + button in the header to add your quantity row.",
    listLayout: "card-grid",
    desktopColumns: 1,
    snapMode: "none",
    containerClass: {
      "experience-card-list": true,
      "assets-card-list": true,
      "subevent-supply-contribution-list": true
    },
    trackBy: (_index, row) => row.id,
    cacheable: {
      identity: (row) => row.id,
      equals: (current, next) => current.id === next.id && current.userId === next.userId && current.quantity === next.quantity && current.addedAtIso === next.addedAtIso
    },
    sortable: {
      sortKey: (row) => [-AppUtils.toSortableDate(row.addedAtIso), row.id]
    }
  };
  ngDoCheck() {
    const popup = this.resourcePopupStore.popupContextRef();
    const supply = this.resourcePopupStore.supplyPopupRef();
    const contextKey = popup && supply ? `${popup.ownerId}:${supply.subEventId}:${supply.assetId}:${this.activeUser().id}` : "";
    if (contextKey === this.lastContextKey) {
      return;
    }
    this.lastContextKey = contextKey;
    this.supplyContributionSmartListQuery = {
      filters: {
        revision: Date.now(),
        contextKey
      }
    };
  }
  supplyContributionSingleRow(row) {
    return {
      id: row.id,
      title: `${row.name}, ${row.age} \xB7 ${row.city}`,
      subtitle: this.addedLabel(row.addedAtIso),
      avatarInitials: row.initials,
      avatarAriaLabel: row.name,
      badges: [{
        label: this.quantityLabel(row.quantity),
        ariaLabel: this.quantityLabel(row.quantity),
        tone: "inverse",
        position: "top-right"
      }],
      menuActions: this.canDeleteSupplyContribution(row) ? ["delete"] : []
    };
  }
  onSupplyContributionSharedMenuSelect(event) {
    const context = event.context;
    const menuRow = context?.row ?? context?.card;
    const row = menuRow ? this.supplyContributionSmartList?.findVisibleItem((item) => item.id === menuRow.id) : null;
    if (!row || context?.action?.id !== "delete" || !this.canDeleteSupplyContribution(row)) {
      return;
    }
    this.requestDeleteSupplyContribution(row);
  }
  supplyPopupTitle() {
    const context = this.resourcePopupStore.supplyPopupRef();
    const popup = this.resourcePopupStore.popupContextRef();
    if (!context || !popup) {
      return APP_STATIC_DATA.assetTypeLabels.Supplies;
    }
    const stageLabel = this.subEventStageLabel(popup.subEvent);
    return stageLabel ? `${context.title} - ${stageLabel}` : context.title;
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
  supplyContributionsPopupModel() {
    const title = this.supplyPopupTitle();
    return {
      title,
      subtitle: this.popupSubtitle(),
      translateTitle: false,
      translateSubtitle: false,
      ariaLabel: title,
      closeAriaLabel: "Close",
      size: "wide",
      height: "full",
      headerTone: "accent",
      bodyLayout: "fill",
      backdropTone: "dim",
      headerActions: [{
        id: "add-supply-quantity",
        icon: "add",
        ariaLabel: "Add supply quantity row",
        palette: "blue"
      }],
      onClose: () => this.closeSupplyContributionsPopup(),
      onAction: (event) => this.onSupplyContributionsPopupAction(event)
    };
  }
  supplyContributionsPopupZIndex() {
    return 3200;
  }
  bringItemsPopupModel(dialog) {
    return {
      title: "Bring Items",
      subtitle: dialog.title,
      translateSubtitle: false,
      ariaLabel: "Bring Items",
      closeAriaLabel: "Close bring items",
      size: "small",
      height: "auto",
      headerTone: "accent",
      backdropTone: "dim",
      headerControls: this.bringItemsPopupHeaderControls(dialog),
      onClose: () => this.cancelBringDialog(),
      onMenuSelect: (event) => this.onBringItemsMenuSelect(event.itemSelect)
    };
  }
  bringItemsPopupHeaderControls(dialog) {
    return [{
      kind: "menu",
      id: "bring-items-save",
      menuKind: "inline",
      items: this.bringItemsSaveMenuItems(dialog),
      closeOnSelect: false
    }];
  }
  bringItemsSaveMenuItems(dialog) {
    const canSave = this.canSubmitBringDialog();
    return [{
      id: "save-supply-quantity",
      icon: "done",
      kind: "action",
      palette: "green",
      disabled: !canSave || dialog.busy,
      ariaLabel: "Save supply quantity",
      progress: dialog.busy ? {
        state: "loading",
        shape: "circle"
      } : dialog.error ? {
        state: "error",
        shape: "circle"
      } : null
    }];
  }
  onBringItemsMenuSelect(event) {
    if (event.item.id === "save-supply-quantity") {
      this.confirmBringDialog(event.sourceEvent);
    }
  }
  bringItemsPopupZIndex() {
    return 3300;
  }
  bringItemsFlowModel(dialog) {
    const controls = [{
      id: "quantity",
      bind: "quantity",
      kind: "number",
      layout: "wide",
      label: "Items",
      description: `Range: ${dialog.min} - ${dialog.max}`,
      required: true,
      min: dialog.min,
      max: dialog.max,
      step: 1,
      disabled: dialog.busy
    }];
    const errorMessage = this.bringErrorMessage();
    if (errorMessage) {
      controls.push({
        id: "save-error",
        kind: "static",
        layout: "wide",
        label: "Unable to save quantity",
        summary: {
          hidden: true,
          value: () => errorMessage
        }
      });
    }
    return {
      title: "Bring Items",
      layout: "grouped",
      tone: errorMessage ? "orange" : "blue",
      header: false,
      summary: { enabled: false },
      completion: { controls: "none" },
      save: null,
      steps: [{
        id: "quantity",
        title: "",
        chrome: "none",
        controls
      }]
    };
  }
  onBringItemsFlowValueChange(value) {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return;
    }
    this.onBringQuantityChange(value["quantity"]);
  }
  onSupplyContributionsPopupAction(event) {
    if (event.action.id === "add-supply-quantity") {
      this.openBringDialog(event.sourceEvent);
    }
  }
  async loadSupplyContributionRowsPage(query) {
    const popup = this.resourcePopupStore.popupContextRef();
    const supply = this.resourcePopupStore.supplyPopupRef();
    if (!popup || !supply) {
      return {
        items: [],
        total: 0
      };
    }
    const page = Math.max(0, Math.trunc(Number(query.page) || 0));
    const pageSize = Math.max(1, Math.trunc(Number(query.pageSize) || 1));
    const result = await this.activityResourcesService.querySupplyContributionPage(popup.ownerId, supply.subEventId, supply.assetId, page, pageSize, this.activeUser().id);
    await this.usersService.warmCachedUsers(result.items.map((entry) => entry.userId));
    return {
      items: this.buildSupplyContributionRows(result.items),
      total: result.total
    };
  }
  closeSupplyContributionsPopup() {
    this.abortPendingSupplyBringRequest();
    this.resourcePopupStore.supplyPopupRef.set(null);
    this.resourcePopupStore.bringDialogRef.set(null);
  }
  openBringDialog(event) {
    event?.stopPropagation();
    const context = this.resourcePopupStore.supplyPopupRef();
    if (!context) {
      return;
    }
    const source = this.ownedAssetCards().find((card) => card.id === context.assetId && card.type === ASSET_TYPE_SUPPLIES);
    const settings = this.getSubEventAssignedAssetSettings(context.subEventId, ASSET_TYPE_SUPPLIES);
    const max = Math.max(1, settings[context.assetId]?.capacityMax ?? source?.capacityTotal ?? 1);
    this.resourcePopupStore.bringDialogRef.set({
      subEventId: context.subEventId,
      cardId: context.assetId,
      title: context.title,
      quantity: 1,
      min: 0,
      max,
      busy: false,
      error: null
    });
  }
  cancelBringDialog() {
    this.abortPendingSupplyBringRequest();
    this.resourcePopupStore.bringDialogRef.set(null);
  }
  canSubmitBringDialog() {
    const dialog = this.resourcePopupStore.bringDialogRef();
    return !!dialog && !dialog.busy && dialog.quantity >= dialog.min && dialog.quantity <= dialog.max;
  }
  onBringQuantityChange(value) {
    const dialog = this.resourcePopupStore.bringDialogRef();
    if (!dialog || dialog.busy) {
      return;
    }
    const parsed = Number(value);
    const quantity = AppUtils.clampNumber(Number.isFinite(parsed) ? Math.trunc(parsed) : dialog.quantity, dialog.min, dialog.max);
    if (quantity === dialog.quantity && !dialog.error) {
      return;
    }
    this.resourcePopupStore.bringDialogRef.set(__spreadProps(__spreadValues({}, dialog), {
      quantity,
      error: null
    }));
  }
  confirmBringDialog(event) {
    event?.stopPropagation();
    const dialog = this.resourcePopupStore.bringDialogRef();
    if (!dialog || dialog.busy || !this.canSubmitBringDialog()) {
      return;
    }
    if (dialog.quantity <= 0) {
      this.resourcePopupStore.bringDialogRef.set(null);
      return;
    }
    const nextState = this.buildPopupResourceState();
    if (!nextState) {
      return;
    }
    const nextEntry = {
      id: `subevent-supply-row-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      userId: this.activeUser().id,
      quantity: dialog.quantity,
      addedAtIso: AppUtils.toIsoDateTime(/* @__PURE__ */ new Date())
    };
    const currentEntries = nextState.supplyContributionEntriesByAssetId[dialog.cardId] ?? [];
    nextState.supplyContributionEntriesByAssetId = __spreadProps(__spreadValues({}, nextState.supplyContributionEntriesByAssetId), {
      [dialog.cardId]: [nextEntry, ...currentEntries]
    });
    const requestVersion = ++this.pendingSupplyBringRequestVersion;
    const abortController = new AbortController();
    this.pendingSupplyBringAbortController = abortController;
    this.resourcePopupStore.bringDialogRef.set(__spreadProps(__spreadValues({}, dialog), {
      busy: true,
      error: null
    }));
    void this.activityResourcesService.replaceSubEventResourceState(nextState, abortController.signal).then((savedState) => {
      if (this.pendingSupplyBringAbortController === abortController) {
        this.pendingSupplyBringAbortController = null;
      }
      if (abortController.signal.aborted || requestVersion != this.pendingSupplyBringRequestVersion) {
        return;
      }
      const resolvedState = ActivityResourceBuilder.normalizeState(savedState, nextState) ?? nextState;
      this.applyPersistedPopupState(resolvedState);
      this.resourcePopupStore.bringDialogRef.set(null);
      this.insertVisibleSupplyContribution(nextEntry);
      this.syncPopupSubEventMetrics();
    }).catch((error) => {
      if (this.pendingSupplyBringAbortController === abortController) {
        this.pendingSupplyBringAbortController = null;
      }
      if (abortController.signal.aborted || this.isAbortError(error) || requestVersion != this.pendingSupplyBringRequestVersion) {
        return;
      }
      const currentDialog = this.resourcePopupStore.bringDialogRef();
      if (!currentDialog || currentDialog.cardId !== dialog.cardId || currentDialog.subEventId !== dialog.subEventId) {
        return;
      }
      this.resourcePopupStore.bringDialogRef.set(__spreadProps(__spreadValues({}, currentDialog), {
        busy: false,
        error: "Unable to save quantity row."
      }));
    });
  }
  bringErrorMessage() {
    return this.resourcePopupStore.bringDialogRef()?.error?.trim() ?? "";
  }
  canDeleteSupplyContribution(row) {
    return row.userId === this.activeUser().id;
  }
  requestDeleteSupplyContribution(row, event) {
    event?.stopPropagation();
    const context = this.resourcePopupStore.supplyPopupRef();
    if (!context || row.userId !== this.activeUser().id) {
      return;
    }
    const pending = {
      assetId: context.assetId,
      entryId: row.id,
      label: `${row.name} \xB7 ${row.quantity}`
    };
    this.dialogStore.open({
      title: "Delete quantity row",
      message: `Delete "${pending.label}" from supplies?`,
      cancelLabel: "Cancel",
      confirmLabel: "Delete",
      busyConfirmLabel: "Deleting...",
      confirmTone: "danger",
      failureMessage: "Unable to delete quantity row.",
      onConfirm: () => this.removeSupplyContribution(pending)
    });
  }
  async removeSupplyContribution(pending) {
    const nextState = this.buildPopupResourceState();
    if (!nextState) {
      throw new Error("Unable to delete quantity row.");
    }
    const currentEntries = nextState.supplyContributionEntriesByAssetId[pending.assetId] ?? [];
    const nextEntries = currentEntries.filter((entry) => entry.id !== pending.entryId);
    if (nextEntries.length === currentEntries.length) {
      throw new Error("This quantity row is no longer available.");
    }
    nextState.supplyContributionEntriesByAssetId = __spreadProps(__spreadValues({}, nextState.supplyContributionEntriesByAssetId), {
      [pending.assetId]: nextEntries
    });
    const savedState = await this.activityResourcesService.replaceSubEventResourceState(nextState);
    const resolvedState = ActivityResourceBuilder.normalizeState(savedState, nextState) ?? nextState;
    this.applyPersistedPopupState(resolvedState);
    this.supplyContributionSmartList?.removeVisibleItemByIdentity(pending.entryId, { totalDelta: -1 });
    this.syncPopupSubEventMetrics();
  }
  addedLabel(addedAtIso) {
    const parsed = new Date(addedAtIso);
    const value = Number.isNaN(parsed.getTime()) ? /* @__PURE__ */ new Date() : parsed;
    return value.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }
  quantityLabel(quantity) {
    const normalized = AppUtils.clampNumber(Math.trunc(quantity), 0, Number.MAX_SAFE_INTEGER);
    return normalized === 1 ? "1 item" : `${normalized} items`;
  }
  activeUser() {
    const activeUserId = this.userProfileStore.activeUserId().trim();
    return this.userProfileStore.activeUserProfile() ?? this.usersService.peekCachedUserById(activeUserId) ?? this.users[0] ?? this.createFallbackUser(activeUserId);
  }
  buildSupplyContributionRows(entries) {
    return entries.map((entry) => {
      const user = this.userById.get(entry.userId) ?? null;
      return {
        id: entry.id,
        userId: entry.userId,
        name: user?.name ?? "Unknown member",
        initials: user?.initials ?? AppUtils.initialsFromText(user?.name ?? "Unknown member"),
        gender: user?.gender ?? "woman",
        age: user?.age ?? 0,
        city: user?.city ?? "",
        addedAtIso: entry.addedAtIso,
        quantity: AppUtils.clampNumber(Math.trunc(entry.quantity), 0, Number.MAX_SAFE_INTEGER)
      };
    }).sort((a, b) => AppUtils.toSortableDate(b.addedAtIso) - AppUtils.toSortableDate(a.addedAtIso));
  }
  insertVisibleSupplyContribution(entry) {
    const smartList = this.supplyContributionSmartList;
    const row = this.buildSupplyContributionRows([entry])[0];
    if (!smartList || !row) {
      return;
    }
    smartList.reinsertVisibleItem(row, {
      totalDelta: 1,
      loadedRange: "before-or-within"
    });
  }
  buildPopupResourceState(context = this.resourcePopupStore.popupContextRef()) {
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
  applyPersistedPopupState(state) {
    const normalizedState = ActivityResourceBuilder.normalizeState(state, state);
    if (!normalizedState) {
      return;
    }
    const activeContext = this.resourcePopupStore.popupContextRef();
    if (activeContext && activeContext.ownerId === normalizedState.ownerId && activeContext.subEvent.id === normalizedState.subEventId) {
      this.resourcePopupStore.popupContextRef.set(__spreadProps(__spreadValues({}, activeContext), {
        fallbackCardsByType: this.mergePersistedFallbackCards(activeContext.fallbackCardsByType, normalizedState.fallbackAssetCardsByType, normalizedState.subEventId)
      }));
    }
    for (const type of ASSET_TYPES) {
      this.resourcePopupStore.assignedAssetIdsByKey[this.subEventAssetAssignmentKey(normalizedState.subEventId, type)] = [
        ...normalizedState.assetAssignmentIds[type] ?? []
      ];
      this.resourcePopupStore.assignedAssetSettingsByKey[this.subEventAssetAssignmentKey(normalizedState.subEventId, type)] = __spreadValues({}, normalizedState.assetSettingsByType[type] ?? {});
    }
    for (const key of Object.keys(this.resourcePopupStore.supplyContributionEntriesByAssignmentKey)) {
      if (key.startsWith(`${normalizedState.subEventId}:`)) {
        delete this.resourcePopupStore.supplyContributionEntriesByAssignmentKey[key];
      }
    }
    for (const [assetId, entries] of Object.entries(normalizedState.supplyContributionEntriesByAssetId)) {
      this.resourcePopupStore.supplyContributionEntriesByAssignmentKey[this.subEventSupplyAssignmentKey(normalizedState.subEventId, assetId)] = entries.map((entry) => __spreadValues({}, entry));
    }
  }
  syncPopupSubEventMetrics() {
    const context = this.resourcePopupStore.popupContextRef();
    if (!context) {
      return;
    }
    const nextSubEvent = this.cloneSubEvent(context.subEvent);
    const cars = this.subEventAssetCapacityMetrics(nextSubEvent, ASSET_TYPE_TRANSPORT);
    const accommodation = this.subEventAssetCapacityMetrics(nextSubEvent, ASSET_TYPE_ACCOMMODATION);
    const supplies = this.subEventAssetCapacityMetrics(nextSubEvent, ASSET_TYPE_SUPPLIES);
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
    const nextContext = __spreadProps(__spreadValues({}, context), {
      subEvent: nextSubEvent
    });
    this.resourcePopupStore.popupContextRef.set(nextContext);
    if (metricsChanged) {
      this.resourcePopupStore.publishSubEventResourceMetrics(nextContext);
    }
  }
  subEventAssetCapacityMetrics(subEvent, type) {
    const cards = this.subEventAssignedAssetCards(subEvent.id, type);
    const settings = this.getSubEventAssignedAssetSettings(subEvent.id, type);
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
  getSubEventAssignedAssetSettings(subEventId, type) {
    const key = this.subEventAssetAssignmentKey(subEventId, type);
    const assignedIds = this.resolveSubEventAssignedAssetIds(subEventId, type);
    const existing = this.resourcePopupStore.assignedAssetSettingsByKey[key] ?? {};
    const next = {};
    for (const assetId of assignedIds) {
      const source = this.resolveSubEventAssignedAssetCard(subEventId, type, assetId);
      const previous = existing[assetId];
      next[assetId] = {
        capacityMin: Math.max(0, Math.trunc(Number(previous?.capacityMin) || 0)),
        capacityMax: Math.max(0, Math.trunc(Number(previous?.capacityMax ?? source?.capacityTotal) || 0)),
        quantity: Math.max(1, Math.trunc(Number(previous?.quantity) || 1)),
        addedByUserId: `${previous?.addedByUserId ?? ""}`.trim() || this.activeUser().id,
        routeEnabled: previous?.routeEnabled ?? false,
        routes: Array.isArray(previous?.routes) ? [...previous.routes] : []
      };
    }
    this.resourcePopupStore.assignedAssetSettingsByKey[key] = next;
    return next;
  }
  resolveSubEventAssignedAssetIds(subEventId, type) {
    const key = this.subEventAssetAssignmentKey(subEventId, type);
    const eligibleIds = [
      ...this.ownedAssetCards().filter((card) => card.type === type).map((card) => card.id),
      ...this.subEventFallbackAssetCards(subEventId, type).map((card) => card.id)
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
  subEventAssignedAssetCards(subEventId, type) {
    return this.resolveSubEventAssignedAssetIds(subEventId, type).map((assetId) => this.resolveSubEventAssignedAssetCard(subEventId, type, assetId)).filter((card) => card !== null);
  }
  resolveSubEventAssignedAssetCard(subEventId, type, assetId) {
    return this.ownedAssetCards().find((card) => card.id === assetId && card.type === type) ?? this.subEventFallbackAssetCards(subEventId, type).find((card) => card.id === assetId) ?? null;
  }
  subEventFallbackAssetCards(subEventId, type) {
    const context = this.resourcePopupStore.popupContextRef();
    if (context?.subEvent.id !== subEventId) {
      return [];
    }
    return (context.fallbackCardsByType[type] ?? []).map((card) => this.cloneAsset(card));
  }
  persistedAssignedFallbackCards(context, type) {
    const assigned = new Set(this.resolveSubEventAssignedAssetIds(context.subEvent.id, type));
    return (context.fallbackCardsByType[type] ?? []).filter((card) => assigned.has(card.id) && !this.ownedAssetCards().some((item) => item.id === card.id && item.type === type)).map((card) => this.toAssetDetailDto(card));
  }
  mergePersistedFallbackCards(current, persisted, subEventId) {
    const next = {};
    for (const type of ASSET_TYPES) {
      const cardsById = /* @__PURE__ */ new Map();
      for (const card of current?.[type] ?? []) {
        cardsById.set(card.id, this.cloneAsset(card));
      }
      for (const card of persisted?.[type] ?? []) {
        cardsById.set(card.id, this.cloneAsset(card));
      }
      const assigned = new Set(this.resourcePopupStore.assignedAssetIdsByKey[this.subEventAssetAssignmentKey(subEventId, type)] ?? []);
      const cards = [...cardsById.values()].filter((card) => assigned.has(card.id));
      if (cards.length > 0) {
        next[type] = cards;
      }
    }
    return next;
  }
  subEventSupplyContributionEntries(subEventId, cardId) {
    return this.resourcePopupStore.supplyContributionEntriesByAssignmentKey[this.subEventSupplyAssignmentKey(subEventId, cardId)] ?? [];
  }
  subEventSupplyProvidedCount(cardId, subEventId) {
    return this.subEventSupplyContributionEntries(subEventId, cardId).reduce((sum, entry) => sum + AppUtils.clampNumber(Math.trunc(entry.quantity), 0, Number.MAX_SAFE_INTEGER), 0);
  }
  abortPendingSupplyBringRequest() {
    this.pendingSupplyBringRequestVersion += 1;
    const controller = this.pendingSupplyBringAbortController;
    this.pendingSupplyBringAbortController = null;
    controller?.abort();
  }
  isAbortError(error) {
    return !!error && typeof error === "object" && "name" in error && error.name === "AbortError";
  }
  subEventSupplyAssignmentKey(subEventId, cardId) {
    return this.resourcePopupStore.supplyAssignmentKey(subEventId, cardId);
  }
  subEventAssetAssignmentKey(subEventId, type) {
    return this.resourcePopupStore.assetAssignmentKey(subEventId, type);
  }
  cloneSubEvent(subEvent) {
    return __spreadValues({}, subEvent);
  }
  cloneAsset(card) {
    return __spreadProps(__spreadValues({}, card), {
      routes: [...card.routes ?? []],
      policies: (card.policies ?? []).map((policy) => __spreadValues({}, policy)),
      requests: card.requests.map((request) => __spreadProps(__spreadValues({}, request), {
        booking: request.booking ? __spreadProps(__spreadValues({}, request.booking), {
          acceptedPolicyIds: [...request.booking.acceptedPolicyIds ?? []]
        }) : null
      }))
    });
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
      quantity: Math.max(0, Math.trunc(Number(card.quantity) || 0)),
      details: `${card.details ?? card.description ?? ""}`.trim(),
      imageUrl: card.imageUrl,
      sourceLink: `${card.sourceLink ?? ""}`.trim(),
      routes: [...card.routes ?? []],
      topics: [...card.topics ?? []],
      policies: (card.policies ?? []).map((policy) => __spreadValues({}, policy)),
      pricing: card.pricing ?? void 0,
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
  subEventDisplayName(subEvent) {
    const name = `${subEvent?.name ?? ""}`.trim();
    return name || "Sub Event";
  }
  subEventStageLabel(subEvent) {
    const name = this.subEventDisplayName(subEvent);
    return name || "Sub Event";
  }
  static \u0275fac = function EventSupplyContributionsPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EventSupplyContributionsPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EventSupplyContributionsPopupComponent, selectors: [["app-event-supply-contributions-popup"]], viewQuery: function EventSupplyContributionsPopupComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5)(_c1, 5, TemplateRef);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.supplyContributionSmartList = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.supplyContributionItemTemplate = _t.first);
    }
  }, decls: 2, vars: 2, consts: [["supplyContributionSmartList", ""], ["supplyContributionItemTemplate", ""], [3, "model", "zIndex"], [1, "event-supply-contributions-popup-shell"], [1, "subevent-supply-contributions-popup"], [1, "subevent-supply-contribution-smart-list", 3, "menuItemSelect", "config", "loadPage", "itemTemplate", "query"], [3, "menuRequest", "row", "useSharedMenu"], [3, "ngModelChange", "model", "ngModel", "disabled"]], template: function EventSupplyContributionsPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, EventSupplyContributionsPopupComponent_Conditional_0_Template, 7, 6, "app-popup", 2);
      \u0275\u0275conditionalCreate(1, EventSupplyContributionsPopupComponent_Conditional_1_Template, 2, 5, "app-popup", 2);
    }
    if (rf & 2) {
      let tmp_1_0;
      \u0275\u0275conditional(ctx.resourcePopupStore.supplyPopupRef() ? 0 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_1_0 = ctx.resourcePopupStore.bringDialogRef()) ? 1 : -1, tmp_1_0);
    }
  }, dependencies: [
    FormsModule,
    NgControlStatus,
    NgModel,
    FormFlowComponent,
    PopupComponent,
    SingleRowComponent,
    SmartListComponent
  ], styles: ['\n[_nghost-%COMP%] {\n  --interactive-motion-duration: 160ms;\n  --interactive-motion-ease: cubic-bezier(0.22, 1, 0.36, 1);\n  --interactive-hover-lift: -1px;\n  --interactive-hover-scale: 1.01;\n  --interactive-hover-brightness: 1.01;\n  --interactive-press-scale: 0.97;\n  --interactive-press-brightness: 0.97;\n}\n[_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]) {\n  -webkit-tap-highlight-color: transparent;\n  transition:\n    transform var(--interactive-motion-duration) var(--interactive-motion-ease),\n    filter var(--interactive-motion-duration) var(--interactive-motion-ease),\n    box-shadow var(--interactive-motion-duration) var(--interactive-motion-ease),\n    background-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    border-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    color var(--interactive-motion-duration) var(--interactive-motion-ease);\n  transform-origin: center;\n}\n[_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):focus-visible {\n  outline: 2px solid rgba(66, 110, 182, 0.44);\n  outline-offset: 2px;\n}\n@media (hover: hover) and (pointer: fine) {\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):hover {\n    transform: translateY(var(--interactive-hover-lift)) scale(var(--interactive-hover-scale));\n    filter: brightness(var(--interactive-hover-brightness));\n  }\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  [_ngcontent-%COMP%]:where(.motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):hover {\n    box-shadow: 0 3px 10px rgba(16, 29, 48, 0.14);\n  }\n}\n@keyframes _ngcontent-%COMP%_shared-mobile-touch-feedback {\n  0% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n  45% {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  100% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n}\n@media (hover: none), (pointer: coarse) {\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    animation: _ngcontent-%COMP%_shared-mobile-touch-feedback 0.2s ease;\n  }\n}\n.app-popup[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%] {\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.app-popup[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%] {\n  font-family: inherit;\n}\n.popup-filter-picker[_ngcontent-%COMP%], \n.activities-view-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 60;\n  margin-left: auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-filter-picker-secondary[_ngcontent-%COMP%], \n.activities-secondary-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 61;\n}\n.selector-like[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%] {\n  width: fit-content !important;\n  min-width: 0 !important;\n  max-width: 100%;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: auto !important;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%] {\n  width: auto !important;\n  flex: 0 1 auto;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: auto !important;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%] {\n  margin-left: 0.28rem;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%] {\n  min-width: 174px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  border: 1px solid #c8d3e2;\n  border-radius: 999px;\n  box-shadow: 0 2px 6px rgba(38, 60, 92, 0.08);\n  padding: 0.12rem 0.5rem 0.12rem 0.84rem;\n  background: #f8f9fb;\n}\n.profile-status-select-wrap.selector-like[_ngcontent-%COMP%] {\n  min-height: 36px;\n}\n.status-option-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.2rem;\n  text-transform: lowercase;\n  width: 100%;\n  min-width: 0;\n}\n.status-option-content[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child {\n  white-space: nowrap;\n}\n.status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  flex: 0 0 16px;\n}\n.rate-filter-count-badge[_ngcontent-%COMP%] {\n  margin-left: auto;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  border: 1px solid #fff;\n  background: #d84d4d;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  font-size: 0.68rem;\n  font-weight: 800;\n  line-height: 1;\n  box-shadow: 0 2px 8px rgba(120, 24, 24, 0.22);\n}\n.rate-filter-trigger-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  margin-left: 0;\n  z-index: 2;\n}\n.popup-filter-control[_ngcontent-%COMP%], \n.activities-rate-filter-select[_ngcontent-%COMP%], \n.activities-primary-filter-select[_ngcontent-%COMP%], \n.activities-event-scope-filter-select[_ngcontent-%COMP%], \n.activities-chat-context-filter-select[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: visible;\n}\n.popup-filter-panel[_ngcontent-%COMP%], \n.activities-view-picker-panel[_ngcontent-%COMP%] {\n  position: absolute;\n  top: calc(100% + 0.32rem);\n  right: 0;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 10px;\n  background: #fff;\n  box-shadow: 0 10px 24px rgba(17, 29, 48, 0.22);\n  padding: 0.24rem;\n  min-width: 128px;\n  z-index: 40;\n  display: grid;\n  gap: 0.16rem;\n}\n.popup-filter-option[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%] {\n  border: 0;\n  background: #fff;\n  border-radius: 8px;\n  min-height: 32px;\n  padding: 0.34rem 0.44rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.34rem;\n  color: #1e3658;\n  cursor: pointer;\n  text-align: left;\n}\n.popup-filter-option[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-filter-option[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.popup-filter-option[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:not(.rate-filter-count-badge), \n.activities-view-option[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:not(.rate-filter-count-badge) {\n  flex: 1 1 auto;\n  min-width: 0;\n  text-align: left;\n}\n.popup-mobile-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-primary-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-event-scope-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-chat-context-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-rate-filter-picker[_ngcontent-%COMP%] {\n  position: relative;\n}\n.popup-mobile-filter-panel[_ngcontent-%COMP%], \n.activities-mobile-filter-panel[_ngcontent-%COMP%], \n.activities-mobile-rate-filter-panel[_ngcontent-%COMP%] {\n  top: calc(100% + 0.24rem);\n  right: 0;\n  min-width: 210px;\n  z-index: 65;\n}\n.popup-mobile-sheet-title[_ngcontent-%COMP%], \n.activities-mobile-sheet-title[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  padding: 0 0.14rem;\n  color: #1c3354;\n  font-size: 0.94rem;\n  font-weight: 800;\n}\n.popup-mobile-sheet-title[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.activities-mobile-sheet-title[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n:is(.popup-filter-bar[_ngcontent-%COMP%], .experience-toolbar[_ngcontent-%COMP%], .assets-toolbar[_ngcontent-%COMP%])   .popup-view-fab[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child, \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%] {\n  font-weight: 400 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option .status-option-content {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  width: 100%;\n  min-width: 0;\n  column-gap: 0.34rem;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option .rate-filter-count-badge {\n  margin-left: 0;\n  justify-self: end;\n}\n[_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.selector-options-panel), \n[_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.status-options-panel) {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n@media (max-width: 760px) {\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%] {\n    width: 100%;\n    min-width: 0;\n    box-sizing: border-box;\n    border: 1px solid rgba(58, 81, 114, 0.24);\n    border-radius: 12px;\n    background: #f7f9fd;\n    min-height: 42px;\n    padding: 0.46rem 0.62rem;\n    justify-content: flex-start;\n    gap: 0.36rem;\n  }\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%] {\n    box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.24);\n    filter: brightness(0.95);\n  }\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%] {\n    margin-left: auto;\n    flex: 0 0 auto;\n  }\n  [_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.profile-bottom-sheet-panel) {\n    position: fixed !important;\n    left: 0 !important;\n    right: 0 !important;\n    bottom: 0 !important;\n    top: auto !important;\n    width: 100vw !important;\n    max-width: 100vw !important;\n    transform: none !important;\n  }\n  [_nghost-%COMP%]     .mat-mdc-select-panel.profile-bottom-sheet-panel {\n    width: 100vw !important;\n    max-width: 100vw !important;\n    max-height: min(54vh, 420px) !important;\n    margin: 0 !important;\n    border-radius: 16px 16px 0 0 !important;\n    border: 1px solid #d6deea;\n    border-bottom: 0;\n    box-shadow: 0 -14px 28px rgba(15, 29, 52, 0.24);\n    padding-top: 0.38rem;\n    padding-bottom: max(0.55rem, env(safe-area-inset-bottom));\n  }\n}\n.popup-view-fab[_ngcontent-%COMP%] {\n  height: 34px;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 999px;\n  background: #f3f7ff;\n  color: #2c4c74;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0 0.62rem;\n  cursor: pointer;\n}\n.popup-view-fab[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-view-fab[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.74rem;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.event-visibility-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 22;\n  margin-left: auto;\n  flex: 0 0 auto;\n}\n.event-visibility-trigger[_ngcontent-%COMP%] {\n  flex-wrap: nowrap;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-public[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-public[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e6f6ef);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-friends[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-friends[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e8f1fd);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-host[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-host[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6efe2);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-inactive[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-inactive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f2f3f5);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-public[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-public[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-friends[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-friends[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-host[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-host[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-inactive[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-inactive[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.48rem 0.56rem;\n  font: inherit;\n  color: var(--text-main);\n  background: #fff;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  resize: vertical;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n  outline: 0;\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n}\n.popup-surface-form-grid[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  max-width: none;\n  width: 100%;\n  margin: 0;\n  justify-content: stretch;\n  align-content: start;\n  align-items: start;\n  column-gap: 1rem;\n  row-gap: 0.9rem;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-rows: min-content;\n  gap: 0;\n  font-weight: 600;\n  color: rgba(26, 44, 69, 0.88);\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  min-height: 40px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  min-height: 96px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   .profile-status-select-wrap.selector-like[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   .profile-status-select-wrap.selector-like[_ngcontent-%COMP%] {\n  min-height: 40px;\n  height: 40px;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  min-height: 32px;\n}\n.popup-surface-description-field[_ngcontent-%COMP%], \n.experience-description-field[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.popup-surface-actions[_ngcontent-%COMP%], \n.experience-form-actions[_ngcontent-%COMP%] {\n  justify-content: center;\n  padding-top: 0.2rem;\n}\n.popup-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.link-btn[_ngcontent-%COMP%] {\n  border: 1px solid var(--line-strong);\n  border-radius: 999px;\n  background: #fff;\n  color: #1f3350;\n  font: inherit;\n  font-size: 0.83rem;\n  padding: 0.38rem 0.76rem;\n  cursor: pointer;\n}\n.neutral-btn[_ngcontent-%COMP%] {\n  background: #f2f4fa;\n  border-color: rgba(23, 33, 54, 0.12);\n}\n.primary-btn[_ngcontent-%COMP%] {\n  background: #4776b7;\n  border-color: #4776b7;\n  color: #fff;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.date-picker-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: #566b86;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  min-width: 80px;\n  width: 100%;\n  font-size: 0.8rem;\n  font-weight: 700;\n  text-transform: lowercase;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-content: flex-start;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%] {\n  margin-left: auto;\n}\n.status-public[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.status-friends[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.status-host[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.status-inactive[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-public[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-friends[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-host[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-inactive[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.profile-status-select-wrap.status-public[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.profile-status-select-wrap.status-friends[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.profile-status-select-wrap.status-host[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.profile-status-select-wrap.status-inactive[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.profile-details-values-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: rgba(44, 67, 100, 0.72);\n}\n.profile-details-values-btn[_ngcontent-%COMP%] {\n  min-height: 36px;\n  height: 36px;\n  box-sizing: border-box;\n  padding-top: 0;\n  padding-bottom: 0;\n}\n.profile-details-values-btn[_ngcontent-%COMP%]   .status-option-content.profile-details-selected-badges[_ngcontent-%COMP%] {\n  display: inline-grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  column-gap: 0.26rem;\n  min-width: 0;\n  width: 100%;\n}\n.profile-details-values-btn.profile-details-values-tone-values[_ngcontent-%COMP%]   .profile-details-inline-chip[_ngcontent-%COMP%] {\n  max-width: calc(100% - 2.6rem);\n}\n.profile-details-values-btn.profile-details-values-tone-interest[_ngcontent-%COMP%]   .profile-details-inline-chip[_ngcontent-%COMP%] {\n  max-width: calc((100% - 3.2rem) / 2);\n}\n.profile-details-values-btn.profile-details-values-tone-values[_ngcontent-%COMP%]   .profile-details-inline-overflow[_ngcontent-%COMP%] {\n  color: #1e6b5a;\n}\n.profile-details-values-btn.profile-details-values-tone-interest[_ngcontent-%COMP%]   .profile-details-inline-overflow[_ngcontent-%COMP%] {\n  color: #2e5a90;\n}\n.values-header-chips[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.28rem;\n  flex: 0 0 100%;\n  margin-left: 0;\n  margin-top: 0.34rem;\n  max-width: 100%;\n  overflow: visible;\n  white-space: normal;\n  padding-bottom: 0;\n}\n.popup-title-values[_ngcontent-%COMP%] {\n  margin-right: 0.38rem;\n}\n.values-selected-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(76, 99, 136, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9ff 0%,\n      #eef3ff 100%);\n  color: #24416a;\n  border-radius: 999px;\n  min-height: 26px;\n  padding: 0.18rem 0.46rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-size: 0.7rem;\n  font-weight: 700;\n  cursor: pointer;\n  flex: 0 0 auto;\n}\n.values-selected-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.values-selected-chip.section-family[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1ea 0%,\n      #ffe6dd 100%);\n  border-color: rgba(160, 90, 51, 0.32);\n  color: #8b4d2b;\n}\n.values-selected-chip.section-ambition[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff7e8 0%,\n      #ffefd7 100%);\n  border-color: rgba(160, 106, 20, 0.32);\n  color: #9a6614;\n}\n.values-selected-chip.section-lifestyle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f5 0%,\n      #e0f2ee 100%);\n  border-color: rgba(45, 125, 120, 0.32);\n  color: #2a6e6a;\n}\n.values-selected-chip.section-beliefs[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f0ecff 0%,\n      #e8e1fa 100%);\n  border-color: rgba(95, 78, 160, 0.32);\n  color: #564793;\n}\n.values-selected-chip.section-social[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n  color: #2d5ea8;\n}\n.values-selected-chip.section-arts[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2edfb 0%,\n      #e9e2f9 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n  color: #654ca1;\n}\n.values-selected-chip.section-food[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4e8 0%,\n      #fee9d6 100%);\n  border-color: rgba(170, 97, 28, 0.32);\n  color: #9d611c;\n}\n.values-selected-chip.section-active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.values-selected-chip.section-mind[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f6 0%,\n      #def1ee 100%);\n  border-color: rgba(37, 124, 118, 0.32);\n  color: #2d7d78;\n}\n.values-selected-chip.section-identity[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n  border-color: rgba(88, 78, 159, 0.32);\n  color: #5a4ea0;\n}\n.readonly-select[_ngcontent-%COMP%] {\n  width: fit-content;\n  min-width: 0;\n  max-width: 130px;\n  justify-content: center;\n  margin-top: 2px;\n  padding-left: 0.44rem;\n  padding-right: 0.44rem;\n}\n.readonly-field[_ngcontent-%COMP%] {\n  min-height: 34px;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.4rem 0.56rem;\n  background: #f7fafe;\n  color: #23476f;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-weight: 700;\n}\n.readonly-field[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.zodiac-symbol[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  font-weight: 800;\n  line-height: 1;\n}\n.zodiac-label[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  font-weight: 700;\n  min-width: 0;\n  text-align: center;\n}\n.readonly-select.zodiac-aries[_ngcontent-%COMP%] {\n  background: #fdf1f1;\n  color: #9f2f2f;\n}\n.readonly-select.zodiac-taurus[_ngcontent-%COMP%] {\n  background: #f7f3eb;\n  color: #6e4b2b;\n}\n.readonly-select.zodiac-gemini[_ngcontent-%COMP%] {\n  background: #fdf8e9;\n  color: #7d5a12;\n}\n.readonly-select.zodiac-cancer[_ngcontent-%COMP%] {\n  background: #eef4ff;\n  color: #2d5b8e;\n}\n.readonly-select.zodiac-leo[_ngcontent-%COMP%] {\n  background: #fff3e8;\n  color: #8f4b0d;\n}\n.readonly-select.zodiac-virgo[_ngcontent-%COMP%] {\n  background: #edf8ef;\n  color: #2b6b3d;\n}\n.readonly-select.zodiac-libra[_ngcontent-%COMP%] {\n  background: #f2eefc;\n  color: #60439d;\n}\n.readonly-select.zodiac-scorpio[_ngcontent-%COMP%] {\n  background: #f9edf2;\n  color: #7b3150;\n}\n.readonly-select.zodiac-sagittarius[_ngcontent-%COMP%] {\n  background: #eef1ff;\n  color: #2f4a9a;\n}\n.readonly-select.zodiac-capricorn[_ngcontent-%COMP%] {\n  background: #eff2f5;\n  color: #364653;\n}\n.readonly-select.zodiac-aquarius[_ngcontent-%COMP%] {\n  background: #ebf7fb;\n  color: #1d5f7a;\n}\n.readonly-select.zodiac-pisces[_ngcontent-%COMP%] {\n  background: #eef2ff;\n  color: #294b8f;\n}\n.physique-slim[_ngcontent-%COMP%] {\n  color: #3f7ab3;\n}\n.physique-lean[_ngcontent-%COMP%] {\n  color: #3f8f5f;\n}\n.physique-athletic[_ngcontent-%COMP%] {\n  color: #2f7e4d;\n}\n.physique-fit[_ngcontent-%COMP%] {\n  color: #465fbb;\n}\n.physique-curvy[_ngcontent-%COMP%] {\n  color: #a14875;\n}\n.physique-muscular[_ngcontent-%COMP%] {\n  color: #7d4f24;\n}\n.physique-average[_ngcontent-%COMP%] {\n  color: #4d667f;\n}\n.physique-select-wrap.physique-slim[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf3fb 0%,\n      #dfebf8 100%);\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.physique-select-wrap.physique-lean[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf6ee 0%,\n      #def0e5 100%);\n  border-color: rgba(63, 143, 95, 0.34);\n}\n.physique-select-wrap.physique-athletic[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f5ec 0%,\n      #dff0e6 100%);\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.physique-select-wrap.physique-fit[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ebf0ff 0%,\n      #e1e8fc 100%);\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.physique-select-wrap.physique-curvy[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f7edf3 0%,\n      #f0e3ec 100%);\n  border-color: rgba(161, 72, 117, 0.36);\n}\n.physique-select-wrap.physique-muscular[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe9 0%,\n      #ede3d8 100%);\n  border-color: rgba(125, 79, 36, 0.36);\n}\n.physique-select-wrap.physique-average[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef2f6 0%,\n      #e5ebf1 100%);\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.physique-select-wrap.physique-slim[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #3f7ab3;\n}\n.physique-select-wrap.physique-lean[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #3f8f5f;\n}\n.physique-select-wrap.physique-athletic[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f7e4d;\n}\n.physique-select-wrap.physique-fit[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #465fbb;\n}\n.physique-select-wrap.physique-curvy[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #a14875;\n}\n.physique-select-wrap.physique-muscular[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #7d4f24;\n}\n.physique-select-wrap.physique-average[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #4d667f;\n}\n.experience-filter-all[_ngcontent-%COMP%] {\n  color: #694ea6;\n}\n.experience-filter-workspace[_ngcontent-%COMP%] {\n  color: #a1485a;\n}\n.experience-filter-school[_ngcontent-%COMP%] {\n  color: #2d5ea8;\n}\n.experience-filter-online[_ngcontent-%COMP%] {\n  color: #2d7d47;\n}\n.experience-filter-project[_ngcontent-%COMP%] {\n  color: #6550a0;\n}\n.experience-filter-select.experience-filter-all[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-project[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #efe8ff 0%,\n      #e8defc 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n}\n.experience-filter-select.experience-filter-workspace[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-workspace[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f3 0%,\n      #ffe6ea 100%);\n  border-color: rgba(169, 72, 90, 0.32);\n}\n.experience-filter-select.experience-filter-school[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-school[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n}\n.experience-type-select.experience-filter-online[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n}\n.experience-type-select.experience-filter-project[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n}\n.experience-type-select[_ngcontent-%COMP%] {\n  min-width: 0;\n  max-width: 100%;\n  min-height: 40px;\n}\n.experience-type-field[_ngcontent-%COMP%], \n.experience-title-field[_ngcontent-%COMP%], \n.experience-city-field[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-org-field[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-type-select[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.experience-date-range-field[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: none;\n  margin: 0;\n  background: transparent;\n}\n.experience-date-range-label[_ngcontent-%COMP%] {\n  grid-column: 1/2;\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-text-field-wrapper[_ngcontent-%COMP%] {\n  min-height: 42px;\n  border-radius: 10px;\n  background: #fff;\n  border: 1px solid rgba(136, 156, 186, 0.5);\n  box-shadow: none;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-subscript-wrapper[_ngcontent-%COMP%] {\n  margin-top: 0.24rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  border: 0 !important;\n  box-shadow: none !important;\n  border-radius: 0 !important;\n  background: transparent !important;\n  min-width: 0;\n  width: 100%;\n  padding: 0 !important;\n  min-height: 0 !important;\n  height: auto !important;\n  line-height: 1.25;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-datepicker-toggle[_ngcontent-%COMP%] {\n  margin-right: 0.2rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-hint-wrapper[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-hint[_ngcontent-%COMP%] {\n  color: rgba(30, 49, 74, 0.65);\n  font-size: 0.72rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-container[_ngcontent-%COMP%] {\n  width: 100%;\n  display: grid;\n  grid-template-columns: minmax(96px, 1fr) auto minmax(96px, 1fr);\n  align-items: center;\n  column-gap: 0.34rem;\n  min-width: 0;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-separator[_ngcontent-%COMP%] {\n  margin: 0 0.28rem;\n  flex: 0 0 auto;\n  white-space: nowrap;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-start-wrapper[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-end-wrapper[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  overflow: visible;\n  min-width: 0;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-inner[_ngcontent-%COMP%] {\n  font-size: 0.96rem;\n  min-width: 0 !important;\n  width: 100% !important;\n  text-overflow: clip;\n  white-space: nowrap;\n  line-height: 1.25;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-flex[_ngcontent-%COMP%] {\n  min-width: 0;\n  border-bottom: 0 !important;\n  box-shadow: none !important;\n  align-items: center !important;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-infix[_ngcontent-%COMP%] {\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  min-height: 34px !important;\n  height: 34px;\n  display: flex;\n  align-items: center;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-line-ripple[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple--deactivating[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple--active[_ngcontent-%COMP%] {\n  display: none !important;\n  opacity: 0 !important;\n  transform: scaleX(0) !important;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-all {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efe8ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-workspace {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1f3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-school {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf4ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-online {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf8ee);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-project {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f4f0ff);\n}\n.mobile-profile-language-chip.language-tone-1[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-1[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-1 {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n  color: #2f6090;\n}\n.mobile-profile-language-chip.language-tone-2[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-2[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-2 {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n  color: #2f695b;\n}\n.mobile-profile-language-chip.language-tone-3[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-3[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-3 {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n  color: #394f9c;\n}\n.mobile-profile-language-chip.language-tone-4[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-4[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-4 {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n  color: #8d3f66;\n}\n.mobile-profile-language-chip.language-tone-5[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-5[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-5 {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n  color: #704822;\n}\n.mobile-profile-language-chip.language-tone-6[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-6[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-6 {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n  color: #415872;\n}\n.mobile-profile-language-chip.language-tone-7[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-7[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-7 {\n  background: #f7f5ea;\n  border-color: rgba(128, 109, 66, 0.34);\n  color: #746237;\n}\n.mobile-profile-language-chip.language-tone-8[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-8[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-8 {\n  background: #edf5ff;\n  border-color: rgba(45, 122, 160, 0.34);\n  color: #2f6782;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf2ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #ebf7ef);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1e3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efecfc);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3f8e9);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fceef3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf7ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6f2e9);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-1 .status-option-content {\n  color: #2d63a9;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-2 .status-option-content {\n  color: #2a7a49;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-3 .status-option-content {\n  color: #9b6018;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-4 .status-option-content {\n  color: #6153a2;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-5 .status-option-content {\n  color: #61812a;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-6 .status-option-content {\n  color: #9f446d;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-7 .status-option-content {\n  color: #2e7898;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-8 .status-option-content {\n  color: #806c3f;\n}\n.mobile-profile-selector-option.detail-tone-1[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef5ff 0%,\n      #e3eefc 100%);\n  border-color: rgba(46, 102, 181, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-2[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef9f3 0%,\n      #e3f4ea 100%);\n  border-color: rgba(40, 125, 72, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-3[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ea 0%,\n      #ffecdd 100%);\n  border-color: rgba(165, 94, 24, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-4[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f1ff 0%,\n      #e8e5fb 100%);\n  border-color: rgba(97, 82, 164, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-5[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f9ef 0%,\n      #edf3e1 100%);\n  border-color: rgba(95, 128, 36, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-6[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #f9e6ed 100%);\n  border-color: rgba(160, 70, 111, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-7[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ff 0%,\n      #e2f0fb 100%);\n  border-color: rgba(45, 122, 160, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-8[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f3ea 0%,\n      #eee9dc 100%);\n  border-color: rgba(128, 109, 66, 0.32);\n}\n.mobile-profile-selector-option.status-public[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e6f6ef 0%,\n      #d9f0e6 100%);\n  border-color: rgba(47, 143, 102, 0.34);\n}\n.mobile-profile-selector-option.status-friends[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f1fd 0%,\n      #dfeaf9 100%);\n  border-color: rgba(27, 87, 161, 0.34);\n}\n.mobile-profile-selector-option.status-host[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe2 0%,\n      #eee4d2 100%);\n  border-color: rgba(135, 88, 15, 0.36);\n}\n.mobile-profile-selector-option.status-inactive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3f5 0%,\n      #e8ebef 100%);\n  border-color: rgba(91, 101, 115, 0.32);\n}\n.mobile-profile-selector-option.physique-slim[_ngcontent-%COMP%] {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.mobile-profile-selector-option.physique-lean[_ngcontent-%COMP%] {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n}\n.mobile-profile-selector-option.physique-athletic[_ngcontent-%COMP%] {\n  background: #e8f5ec;\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.mobile-profile-selector-option.physique-fit[_ngcontent-%COMP%] {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.mobile-profile-selector-option.physique-curvy[_ngcontent-%COMP%] {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n}\n.mobile-profile-selector-option.physique-muscular[_ngcontent-%COMP%] {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n}\n.mobile-profile-selector-option.physique-average[_ngcontent-%COMP%] {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .values-selector-popup.profile-selector-popup[_ngcontent-%COMP%] {\n  gap: 0.56rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.44rem;\n  padding-bottom: 0.22rem;\n  border-bottom: 1px solid rgba(74, 102, 139, 0.22);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-head-label[_ngcontent-%COMP%] {\n  color: #203c64;\n  font-size: 0.82rem;\n  font-weight: 800;\n  line-height: 1.2;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-clear[_ngcontent-%COMP%] {\n  border: 1px solid rgba(41, 73, 110, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.82);\n  color: #284970;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.3rem 0.52rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-clear.is-hidden[_ngcontent-%COMP%] {\n  visibility: hidden;\n  pointer-events: none;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-selected[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(35, 68, 107, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.92);\n  color: #234368;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.26rem 0.48rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.16rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-empty[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.74rem;\n  color: rgba(31, 54, 86, 0.62);\n  font-style: italic;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.34rem;\n  border: 1px solid transparent;\n  border-radius: 12px;\n  padding: 0.4rem 0.42rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-head[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag[_ngcontent-%COMP%] {\n  border-radius: 999px;\n  border: 1px solid rgba(52, 86, 128, 0.28);\n  background: rgba(255, 255, 255, 0.74);\n  color: #2f527d;\n  font-size: 0.67rem;\n  font-weight: 800;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.2rem 0.52rem;\n  text-transform: uppercase;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 1px;\n  background: rgba(84, 111, 147, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip-grid[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.36rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(41, 70, 106, 0.22);\n  border-radius: 999px;\n  background: #f4f8ff;\n  color: #234066;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 700;\n  padding: 0.3rem 0.58rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  cursor: pointer;\n  transition:\n    background-color 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip.active[_ngcontent-%COMP%] {\n  border-color: rgba(27, 85, 158, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #dcebff 0%,\n      #cfe3ff 100%);\n  color: #123e70;\n  box-shadow: inset 0 0 0 1px rgba(30, 73, 127, 0.24), 0 1px 2px rgba(24, 53, 86, 0.16);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-family[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 232, 219, 0.52) 0%,\n      rgba(255, 232, 219, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-ambition[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 242, 216, 0.52) 0%,\n      rgba(255, 242, 216, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-lifestyle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(221, 241, 239, 0.56) 0%,\n      rgba(221, 241, 239, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-beliefs[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-social[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(223, 236, 255, 0.5) 0%,\n      rgba(223, 236, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-arts[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(235, 227, 255, 0.5) 0%,\n      rgba(235, 227, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-food[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 236, 221, 0.52) 0%,\n      rgba(255, 236, 221, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(222, 243, 231, 0.56) 0%,\n      rgba(222, 243, 231, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-mind[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(219, 242, 238, 0.56) 0%,\n      rgba(219, 242, 238, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-identity[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-family[_ngcontent-%COMP%] {\n  border-color: rgba(156, 94, 51, 0.34);\n  color: #9c5e33;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-ambition[_ngcontent-%COMP%] {\n  border-color: rgba(160, 106, 20, 0.34);\n  color: #9b6717;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-lifestyle[_ngcontent-%COMP%] {\n  border-color: rgba(47, 123, 119, 0.34);\n  color: #2f7b77;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-beliefs[_ngcontent-%COMP%] {\n  border-color: rgba(95, 78, 160, 0.34);\n  color: #5f4ea0;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-social[_ngcontent-%COMP%] {\n  border-color: rgba(47, 106, 175, 0.36);\n  color: #2f6aaf;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-arts[_ngcontent-%COMP%] {\n  border-color: rgba(106, 87, 168, 0.36);\n  color: #6a57a8;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-food[_ngcontent-%COMP%] {\n  border-color: rgba(170, 97, 28, 0.34);\n  color: #a55e18;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-active[_ngcontent-%COMP%] {\n  border-color: rgba(49, 124, 82, 0.36);\n  color: #317c52;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-mind[_ngcontent-%COMP%] {\n  border-color: rgba(37, 124, 118, 0.34);\n  color: #2b7c76;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-identity[_ngcontent-%COMP%] {\n  border-color: rgba(98, 84, 163, 0.34);\n  color: #6254a3;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-family[_ngcontent-%COMP%] {\n  background: rgba(156, 94, 51, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-ambition[_ngcontent-%COMP%] {\n  background: rgba(160, 106, 20, 0.32);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-lifestyle[_ngcontent-%COMP%] {\n  background: rgba(47, 123, 119, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-beliefs[_ngcontent-%COMP%] {\n  background: rgba(95, 78, 160, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-social[_ngcontent-%COMP%] {\n  background: rgba(47, 106, 175, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-arts[_ngcontent-%COMP%] {\n  background: rgba(106, 87, 168, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-food[_ngcontent-%COMP%] {\n  background: rgba(170, 97, 28, 0.32);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-active[_ngcontent-%COMP%] {\n  background: rgba(49, 124, 82, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-mind[_ngcontent-%COMP%] {\n  background: rgba(37, 124, 118, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-identity[_ngcontent-%COMP%] {\n  background: rgba(98, 84, 163, 0.3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.status-option) {\n  background: #f0f5fc;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.mdc-list-item--selected:not(.mdc-list-item--disabled) {\n  filter: brightness(0.95);\n  box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.2);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option {\n  background: #fff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option:not(:last-child) {\n  border-bottom: 1px solid #e6edf7;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.hide-selected-option, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.hide-selected-option {\n  min-height: 0 !important;\n  height: 0 !important;\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  border: 0 !important;\n  margin: 0 !important;\n  opacity: 0 !important;\n  pointer-events: none !important;\n  overflow: hidden !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option {\n  background: #fff;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel {\n  margin-top: 8px !important;\n  margin-bottom: 8px !important;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .cdk-overlay-pane .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .cdk-overlay-pane .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above {\n  margin-top: 0 !important;\n  margin-bottom: 18px !important;\n  transform: translateY(-10px) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public {\n  --mdc-list-list-item-container-color: #def3e9;\n  --mat-mdc-option-selected-container-color: #def3e9;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #def3e9) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends {\n  --mdc-list-list-item-container-color: #e3eefb;\n  --mat-mdc-option-selected-container-color: #e3eefb;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e3eefb) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host {\n  --mdc-list-list-item-container-color: #f3ead8;\n  --mat-mdc-option-selected-container-color: #f3ead8;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3ead8) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive {\n  --mdc-list-list-item-container-color: #eceff3;\n  --mat-mdc-option-selected-container-color: #eceff3;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eceff3) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon {\n  color: #2f8f66 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon {\n  color: #1b57a1 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon {\n  color: #87580f !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon {\n  color: #5b6573 !important;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-slim {\n  background: #eaf4ff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-lean {\n  background: #edf8f4;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-athletic {\n  background: #e8f5ec;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-fit {\n  background: #f1f2ff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-curvy {\n  background: #fff2f8;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-muscular {\n  background: #fbf4ea;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-average {\n  background: #eff4f9;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-slim .status-option-content {\n  color: #3f7ab3;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-lean .status-option-content {\n  color: #3f8f5f;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-athletic .status-option-content {\n  color: #2f7e4d;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-fit .status-option-content {\n  color: #465fbb;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-curvy .status-option-content {\n  color: #a14875;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-muscular .status-option-content {\n  color: #7d4f24;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-average .status-option-content {\n  color: #4d667f;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.physique-options-panel {\n  width: auto !important;\n  max-width: 220px !important;\n  min-width: 0 !important;\n}\n[_nghost-%COMP%]     .physique-options-panel .mat-mdc-option {\n  padding-right: 8px;\n}\n[_nghost-%COMP%]     .physique-options-panel .mat-mdc-option .mat-pseudo-checkbox {\n  margin-left: 4px;\n}\n@media (max-width: 760px) {\n  .experience-form-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    max-width: none;\n    justify-content: stretch;\n    row-gap: 0.72rem;\n  }\n  .experience-date-range-label[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n  }\n  .experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-container[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);\n  }\n  .profile-details-privacy-fab[_ngcontent-%COMP%]   .privacy-fab-actions[_ngcontent-%COMP%] {\n    position: fixed;\n    left: 0.5rem;\n    right: 0.5rem;\n    bottom: max(0.5rem, env(safe-area-inset-bottom));\n    top: auto;\n    transform: translateY(12px) scale(0.98);\n    transform-origin: bottom center;\n    justify-content: center;\n    gap: 0.46rem;\n    padding: 0.46rem 0.56rem;\n    border: 1px solid rgba(42, 68, 102, 0.2);\n    border-radius: 14px;\n    background: #fff;\n    box-shadow: 0 -12px 24px rgba(18, 31, 51, 0.22);\n  }\n  .profile-details-privacy-fab.open[_ngcontent-%COMP%]   .privacy-fab-actions[_ngcontent-%COMP%] {\n    transform: translateY(0) scale(1);\n  }\n}\n[_nghost-%COMP%] {\n  display: contents;\n}\n.event-supply-contributions-popup-shell[_ngcontent-%COMP%], \n.subevent-supply-contributions-popup[_ngcontent-%COMP%] {\n  display: flex;\n  flex: 1 1 auto;\n  width: 100%;\n  height: 100%;\n  min-height: 0;\n}\napp-smart-list.subevent-supply-contribution-smart-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex: 1 1 auto;\n  width: 100%;\n  min-height: 0;\n}\n/*# sourceMappingURL=event-supply-contributions-popup.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EventSupplyContributionsPopupComponent, [{
    type: Component,
    args: [{ selector: "app-event-supply-contributions-popup", standalone: true, imports: [
      FormsModule,
      FormFlowComponent,
      PopupComponent,
      SingleRowComponent,
      SmartListComponent
    ], template: '@if (resourcePopupStore.supplyPopupRef()) {\n  <app-popup\n    [model]="supplyContributionsPopupModel()"\n    [zIndex]="supplyContributionsPopupZIndex()"\n  >\n    <div class="event-supply-contributions-popup-shell">\n      <div class="subevent-supply-contributions-popup">\n        <app-smart-list\n          #supplyContributionSmartList\n          class="subevent-supply-contribution-smart-list"\n          [config]="supplyContributionSmartListConfig"\n          [loadPage]="supplyContributionSmartListLoadPage"\n          [itemTemplate]="supplyContributionItemTemplateRef ?? null"\n          [query]="supplyContributionSmartListQuery"\n          (menuItemSelect)="onSupplyContributionSharedMenuSelect($event)"\n        ></app-smart-list>\n\n        <ng-template #supplyContributionItemTemplate let-row let-openMenu="openMenu">\n          <single-row\n            [row]="supplyContributionSingleRow(row)"\n            [useSharedMenu]="true"\n            (menuRequest)="openMenu($event)"\n          ></single-row>\n        </ng-template>\n      </div>\n    </div>\n  </app-popup>\n}\n\n@if (resourcePopupStore.bringDialogRef(); as dialog) {\n  <app-popup\n    [model]="bringItemsPopupModel(dialog)"\n    [zIndex]="bringItemsPopupZIndex()"\n  >\n    <app-form-flow\n      [model]="bringItemsFlowModel(dialog)"\n      [ngModel]="dialog"\n      [disabled]="dialog.busy"\n      (ngModelChange)="onBringItemsFlowValueChange($event)"\n    ></app-form-flow>\n  </app-popup>\n}\n', styles: ['/* src/app/activity/components/event-supply-contributions-popup/event-supply-contributions-popup.component.scss */\n:host {\n  --interactive-motion-duration: 160ms;\n  --interactive-motion-ease: cubic-bezier(0.22, 1, 0.36, 1);\n  --interactive-hover-lift: -1px;\n  --interactive-hover-scale: 1.01;\n  --interactive-hover-brightness: 1.01;\n  --interactive-press-scale: 0.97;\n  --interactive-press-brightness: 0.97;\n}\n:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]) {\n  -webkit-tap-highlight-color: transparent;\n  transition:\n    transform var(--interactive-motion-duration) var(--interactive-motion-ease),\n    filter var(--interactive-motion-duration) var(--interactive-motion-ease),\n    box-shadow var(--interactive-motion-duration) var(--interactive-motion-ease),\n    background-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    border-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    color var(--interactive-motion-duration) var(--interactive-motion-ease);\n  transform-origin: center;\n}\n:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):focus-visible {\n  outline: 2px solid rgba(66, 110, 182, 0.44);\n  outline-offset: 2px;\n}\n@media (hover: hover) and (pointer: fine) {\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):hover {\n    transform: translateY(var(--interactive-hover-lift)) scale(var(--interactive-hover-scale));\n    filter: brightness(var(--interactive-hover-brightness));\n  }\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  :where(.motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):hover {\n    box-shadow: 0 3px 10px rgba(16, 29, 48, 0.14);\n  }\n}\n@keyframes shared-mobile-touch-feedback {\n  0% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n  45% {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  100% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n}\n@media (hover: none), (pointer: coarse) {\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    animation: shared-mobile-touch-feedback 0.2s ease;\n  }\n}\n.app-popup,\n.mobile-profile-selector-sheet-wrap,\n.popup-surface,\n.experience-form-popup {\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.app-popup button,\n.app-popup input,\n.app-popup textarea,\n.app-popup select,\n.app-popup .mat-mdc-select,\n.app-popup .mat-mdc-select-value-text,\n.app-popup .mat-mdc-option,\n.popup-surface button,\n.popup-surface input,\n.popup-surface textarea,\n.popup-surface select,\n.popup-surface .mat-mdc-select,\n.popup-surface .mat-mdc-select-value-text,\n.popup-surface .mat-mdc-option,\n.experience-form-popup button,\n.experience-form-popup input,\n.experience-form-popup textarea,\n.experience-form-popup select,\n.experience-form-popup .mat-mdc-select,\n.experience-form-popup .mat-mdc-select-value-text,\n.experience-form-popup .mat-mdc-option,\n.mobile-profile-selector-sheet-wrap button,\n.mobile-profile-selector-sheet-wrap input,\n.mobile-profile-selector-sheet-wrap .mat-mdc-option {\n  font-family: inherit;\n}\n.popup-filter-picker,\n.activities-view-picker {\n  position: relative;\n  z-index: 60;\n  margin-left: auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-filter-picker-secondary,\n.activities-secondary-picker {\n  position: relative;\n  z-index: 61;\n}\n.selector-like {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n}\n.profile-status-select-wrap.popup-compact-select,\n.profile-status-select-wrap.activities-compact-select,\n.profile-status-select-wrap.assets-compact-select {\n  width: fit-content !important;\n  min-width: 0 !important;\n  max-width: 100%;\n}\n.profile-status-select-wrap.popup-compact-select .mat-mdc-select,\n.profile-status-select-wrap.activities-compact-select .mat-mdc-select,\n.profile-status-select-wrap.assets-compact-select .mat-mdc-select {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select .mat-mdc-select-trigger,\n.profile-status-select-wrap.activities-compact-select .mat-mdc-select-trigger,\n.profile-status-select-wrap.assets-compact-select .mat-mdc-select-trigger {\n  width: auto !important;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select .status-option-content,\n.profile-status-select-wrap.activities-compact-select .status-option-content,\n.profile-status-select-wrap.assets-compact-select .status-option-content {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge,\n.profile-status-select-wrap.activities-filter-no-badge {\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge .status-option-content,\n.profile-status-select-wrap.activities-filter-no-badge .status-option-content {\n  width: auto !important;\n  flex: 0 1 auto;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select-trigger,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select-trigger {\n  width: auto !important;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select-arrow-wrapper,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select-arrow-wrapper {\n  margin-left: 0.28rem;\n}\n.profile-status-select-wrap {\n  min-width: 174px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  border: 1px solid #c8d3e2;\n  border-radius: 999px;\n  box-shadow: 0 2px 6px rgba(38, 60, 92, 0.08);\n  padding: 0.12rem 0.5rem 0.12rem 0.84rem;\n  background: #f8f9fb;\n}\n.profile-status-select-wrap.selector-like {\n  min-height: 36px;\n}\n.status-option-content {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.2rem;\n  text-transform: lowercase;\n  width: 100%;\n  min-width: 0;\n}\n.status-option-content span:last-child {\n  white-space: nowrap;\n}\n.status-option-content .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  flex: 0 0 16px;\n}\n.rate-filter-count-badge {\n  margin-left: auto;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  border: 1px solid #fff;\n  background: #d84d4d;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  font-size: 0.68rem;\n  font-weight: 800;\n  line-height: 1;\n  box-shadow: 0 2px 8px rgba(120, 24, 24, 0.22);\n}\n.rate-filter-trigger-badge {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  margin-left: 0;\n  z-index: 2;\n}\n.popup-filter-control,\n.activities-rate-filter-select,\n.activities-primary-filter-select,\n.activities-event-scope-filter-select,\n.activities-chat-context-filter-select {\n  position: relative;\n  overflow: visible;\n}\n.popup-filter-panel,\n.activities-view-picker-panel {\n  position: absolute;\n  top: calc(100% + 0.32rem);\n  right: 0;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 10px;\n  background: #fff;\n  box-shadow: 0 10px 24px rgba(17, 29, 48, 0.22);\n  padding: 0.24rem;\n  min-width: 128px;\n  z-index: 40;\n  display: grid;\n  gap: 0.16rem;\n}\n.popup-filter-option,\n.activities-view-option {\n  border: 0;\n  background: #fff;\n  border-radius: 8px;\n  min-height: 32px;\n  padding: 0.34rem 0.44rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.34rem;\n  color: #1e3658;\n  cursor: pointer;\n  text-align: left;\n}\n.popup-filter-option .mat-icon,\n.activities-view-option .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-filter-option span,\n.activities-view-option span {\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.popup-filter-option > span:not(.rate-filter-count-badge),\n.activities-view-option > span:not(.rate-filter-count-badge) {\n  flex: 1 1 auto;\n  min-width: 0;\n  text-align: left;\n}\n.popup-mobile-filter-picker,\n.activities-mobile-primary-filter-picker,\n.activities-mobile-event-scope-filter-picker,\n.activities-mobile-chat-context-filter-picker,\n.activities-mobile-rate-filter-picker {\n  position: relative;\n}\n.popup-mobile-filter-panel,\n.activities-mobile-filter-panel,\n.activities-mobile-rate-filter-panel {\n  top: calc(100% + 0.24rem);\n  right: 0;\n  min-width: 210px;\n  z-index: 65;\n}\n.popup-mobile-sheet-title,\n.activities-mobile-sheet-title {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  padding: 0 0.14rem;\n  color: #1c3354;\n  font-size: 0.94rem;\n  font-weight: 800;\n}\n.popup-mobile-sheet-title .mat-icon,\n.activities-mobile-sheet-title .mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .popup-view-fab span,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .mat-mdc-select,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .status-option-content span:last-child,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .mat-mdc-select-value-text {\n  font-weight: 400 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option .status-option-content {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  width: 100%;\n  min-width: 0;\n  column-gap: 0.34rem;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option .rate-filter-count-badge {\n  margin-left: 0;\n  justify-self: end;\n}\n:host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.selector-options-panel),\n:host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.status-options-panel) {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n@media (max-width: 760px) {\n  .popup-mobile-filter-panel .popup-filter-option,\n  .popup-mobile-filter-panel .activities-view-option,\n  .activities-mobile-filter-panel .popup-filter-option,\n  .activities-mobile-filter-panel .activities-view-option,\n  .activities-mobile-rate-filter-panel .popup-filter-option,\n  .activities-mobile-rate-filter-panel .activities-view-option {\n    width: 100%;\n    min-width: 0;\n    box-sizing: border-box;\n    border: 1px solid rgba(58, 81, 114, 0.24);\n    border-radius: 12px;\n    background: #f7f9fd;\n    min-height: 42px;\n    padding: 0.46rem 0.62rem;\n    justify-content: flex-start;\n    gap: 0.36rem;\n  }\n  .popup-mobile-filter-panel .popup-filter-option.active,\n  .popup-mobile-filter-panel .activities-view-option.active,\n  .activities-mobile-filter-panel .popup-filter-option.active,\n  .activities-mobile-filter-panel .activities-view-option.active,\n  .activities-mobile-rate-filter-panel .popup-filter-option.active,\n  .activities-mobile-rate-filter-panel .activities-view-option.active {\n    box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.24);\n    filter: brightness(0.95);\n  }\n  .popup-mobile-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .popup-mobile-filter-panel .activities-view-option .rate-filter-count-badge,\n  .activities-mobile-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .activities-mobile-filter-panel .activities-view-option .rate-filter-count-badge,\n  .activities-mobile-rate-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .activities-mobile-rate-filter-panel .activities-view-option .rate-filter-count-badge {\n    margin-left: auto;\n    flex: 0 0 auto;\n  }\n  :host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.profile-bottom-sheet-panel) {\n    position: fixed !important;\n    left: 0 !important;\n    right: 0 !important;\n    bottom: 0 !important;\n    top: auto !important;\n    width: 100vw !important;\n    max-width: 100vw !important;\n    transform: none !important;\n  }\n  :host ::ng-deep .mat-mdc-select-panel.profile-bottom-sheet-panel {\n    width: 100vw !important;\n    max-width: 100vw !important;\n    max-height: min(54vh, 420px) !important;\n    margin: 0 !important;\n    border-radius: 16px 16px 0 0 !important;\n    border: 1px solid #d6deea;\n    border-bottom: 0;\n    box-shadow: 0 -14px 28px rgba(15, 29, 52, 0.24);\n    padding-top: 0.38rem;\n    padding-bottom: max(0.55rem, env(safe-area-inset-bottom));\n  }\n}\n.popup-view-fab {\n  height: 34px;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 999px;\n  background: #f3f7ff;\n  color: #2c4c74;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0 0.62rem;\n  cursor: pointer;\n}\n.popup-view-fab .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-view-fab span {\n  font-size: 0.74rem;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.event-visibility-picker {\n  position: relative;\n  z-index: 22;\n  margin-left: auto;\n  flex: 0 0 auto;\n}\n.event-visibility-trigger {\n  flex-wrap: nowrap;\n}\n.profile-status-header-picker .event-visibility-trigger.status-public,\n.profile-status-header-picker .activities-view-option.status-public {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e6f6ef);\n}\n.profile-status-header-picker .event-visibility-trigger.status-friends,\n.profile-status-header-picker .activities-view-option.status-friends {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e8f1fd);\n}\n.profile-status-header-picker .event-visibility-trigger.status-host,\n.profile-status-header-picker .activities-view-option.status-host {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6efe2);\n}\n.profile-status-header-picker .event-visibility-trigger.status-inactive,\n.profile-status-header-picker .activities-view-option.status-inactive {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f2f3f5);\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-public,\n.profile-status-header-picker .activities-view-option.status-public .mat-icon {\n  color: #2f8f66;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-friends,\n.profile-status-header-picker .activities-view-option.status-friends .mat-icon {\n  color: #1b57a1;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-host,\n.profile-status-header-picker .activities-view-option.status-host .mat-icon {\n  color: #87580f;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-inactive,\n.profile-status-header-picker .activities-view-option.status-inactive .mat-icon {\n  color: #5b6573;\n}\n.app-popup textarea,\n.app-popup input,\n.app-popup select,\n.popup-surface textarea,\n.popup-surface input,\n.popup-surface select,\n.experience-form-popup textarea,\n.experience-form-popup input,\n.experience-form-popup select,\n.mobile-profile-selector-sheet-wrap input {\n  width: 100%;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.48rem 0.56rem;\n  font: inherit;\n  color: var(--text-main);\n  background: #fff;\n}\n.app-popup textarea,\n.popup-surface textarea,\n.experience-form-popup textarea {\n  resize: vertical;\n}\n.app-popup textarea:focus,\n.app-popup input:focus,\n.app-popup select:focus,\n.popup-surface textarea:focus,\n.popup-surface input:focus,\n.popup-surface select:focus,\n.experience-form-popup textarea:focus,\n.experience-form-popup input:focus,\n.experience-form-popup select:focus,\n.mobile-profile-selector-sheet-wrap input:focus {\n  outline: 0;\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n}\n.popup-surface-form-grid,\n.experience-form-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  max-width: none;\n  width: 100%;\n  margin: 0;\n  justify-content: stretch;\n  align-content: start;\n  align-items: start;\n  column-gap: 1rem;\n  row-gap: 0.9rem;\n}\n.popup-surface-form-grid label,\n.experience-form-grid label {\n  display: grid;\n  grid-template-rows: min-content;\n  gap: 0;\n  font-weight: 600;\n  color: rgba(26, 44, 69, 0.88);\n}\n.popup-surface-form-grid input,\n.experience-form-grid input {\n  min-height: 40px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid textarea,\n.experience-form-grid textarea {\n  min-height: 96px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid .profile-status-select-wrap.selector-like,\n.experience-form-grid .profile-status-select-wrap.selector-like {\n  min-height: 40px;\n  height: 40px;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid .mat-mdc-select-trigger,\n.experience-form-grid .mat-mdc-select-trigger {\n  min-height: 32px;\n}\n.popup-surface-description-field,\n.experience-description-field {\n  grid-column: 1/-1;\n}\n.popup-surface-actions,\n.experience-form-actions {\n  justify-content: center;\n  padding-top: 0.2rem;\n}\n.popup-actions {\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.link-btn {\n  border: 1px solid var(--line-strong);\n  border-radius: 999px;\n  background: #fff;\n  color: #1f3350;\n  font: inherit;\n  font-size: 0.83rem;\n  padding: 0.38rem 0.76rem;\n  cursor: pointer;\n}\n.neutral-btn {\n  background: #f2f4fa;\n  border-color: rgba(23, 33, 54, 0.12);\n}\n.primary-btn {\n  background: #4776b7;\n  border-color: #4776b7;\n  color: #fff;\n}\n.profile-status-select-wrap .mat-icon,\n.date-picker-btn .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: #566b86;\n}\n.profile-status-select-wrap .mat-mdc-select {\n  min-width: 80px;\n  width: 100%;\n  font-size: 0.8rem;\n  font-weight: 700;\n  text-transform: lowercase;\n}\n.profile-status-select-wrap .mat-mdc-select-trigger {\n  width: 100%;\n  justify-content: flex-start;\n}\n.profile-status-select-wrap .mat-mdc-select-arrow-wrapper {\n  margin-left: auto;\n}\n.status-public {\n  color: #2f8f66;\n}\n.status-friends {\n  color: #1b57a1;\n}\n.status-host {\n  color: #87580f;\n}\n.status-inactive {\n  color: #5b6573;\n}\n.status-option-content .status-public {\n  color: #2f8f66;\n}\n.status-option-content .status-friends {\n  color: #1b57a1;\n}\n.status-option-content .status-host {\n  color: #87580f;\n}\n.status-option-content .status-inactive {\n  color: #5b6573;\n}\n.profile-status-select-wrap.status-public .status-option-content .mat-icon {\n  color: #2f8f66;\n}\n.profile-status-select-wrap.status-friends .status-option-content .mat-icon {\n  color: #1b57a1;\n}\n.profile-status-select-wrap.status-host .status-option-content .mat-icon {\n  color: #87580f;\n}\n.profile-status-select-wrap.status-inactive .status-option-content .mat-icon {\n  color: #5b6573;\n}\n.profile-details-values-btn .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: rgba(44, 67, 100, 0.72);\n}\n.profile-details-values-btn {\n  min-height: 36px;\n  height: 36px;\n  box-sizing: border-box;\n  padding-top: 0;\n  padding-bottom: 0;\n}\n.profile-details-values-btn .status-option-content.profile-details-selected-badges {\n  display: inline-grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  column-gap: 0.26rem;\n  min-width: 0;\n  width: 100%;\n}\n.profile-details-values-btn.profile-details-values-tone-values .profile-details-inline-chip {\n  max-width: calc(100% - 2.6rem);\n}\n.profile-details-values-btn.profile-details-values-tone-interest .profile-details-inline-chip {\n  max-width: calc((100% - 3.2rem) / 2);\n}\n.profile-details-values-btn.profile-details-values-tone-values .profile-details-inline-overflow {\n  color: #1e6b5a;\n}\n.profile-details-values-btn.profile-details-values-tone-interest .profile-details-inline-overflow {\n  color: #2e5a90;\n}\n.values-header-chips {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.28rem;\n  flex: 0 0 100%;\n  margin-left: 0;\n  margin-top: 0.34rem;\n  max-width: 100%;\n  overflow: visible;\n  white-space: normal;\n  padding-bottom: 0;\n}\n.popup-title-values {\n  margin-right: 0.38rem;\n}\n.values-selected-chip {\n  border: 1px solid rgba(76, 99, 136, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9ff 0%,\n      #eef3ff 100%);\n  color: #24416a;\n  border-radius: 999px;\n  min-height: 26px;\n  padding: 0.18rem 0.46rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-size: 0.7rem;\n  font-weight: 700;\n  cursor: pointer;\n  flex: 0 0 auto;\n}\n.values-selected-chip .mat-icon {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.values-selected-chip.section-family {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1ea 0%,\n      #ffe6dd 100%);\n  border-color: rgba(160, 90, 51, 0.32);\n  color: #8b4d2b;\n}\n.values-selected-chip.section-ambition {\n  background:\n    linear-gradient(\n      180deg,\n      #fff7e8 0%,\n      #ffefd7 100%);\n  border-color: rgba(160, 106, 20, 0.32);\n  color: #9a6614;\n}\n.values-selected-chip.section-lifestyle {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f5 0%,\n      #e0f2ee 100%);\n  border-color: rgba(45, 125, 120, 0.32);\n  color: #2a6e6a;\n}\n.values-selected-chip.section-beliefs {\n  background:\n    linear-gradient(\n      180deg,\n      #f0ecff 0%,\n      #e8e1fa 100%);\n  border-color: rgba(95, 78, 160, 0.32);\n  color: #564793;\n}\n.values-selected-chip.section-social {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n  color: #2d5ea8;\n}\n.values-selected-chip.section-arts {\n  background:\n    linear-gradient(\n      180deg,\n      #f2edfb 0%,\n      #e9e2f9 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n  color: #654ca1;\n}\n.values-selected-chip.section-food {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4e8 0%,\n      #fee9d6 100%);\n  border-color: rgba(170, 97, 28, 0.32);\n  color: #9d611c;\n}\n.values-selected-chip.section-active {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.values-selected-chip.section-mind {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f6 0%,\n      #def1ee 100%);\n  border-color: rgba(37, 124, 118, 0.32);\n  color: #2d7d78;\n}\n.values-selected-chip.section-identity {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n  border-color: rgba(88, 78, 159, 0.32);\n  color: #5a4ea0;\n}\n.readonly-select {\n  width: fit-content;\n  min-width: 0;\n  max-width: 130px;\n  justify-content: center;\n  margin-top: 2px;\n  padding-left: 0.44rem;\n  padding-right: 0.44rem;\n}\n.readonly-field {\n  min-height: 34px;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.4rem 0.56rem;\n  background: #f7fafe;\n  color: #23476f;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-weight: 700;\n}\n.readonly-field .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.zodiac-symbol {\n  font-size: 1.1rem;\n  font-weight: 800;\n  line-height: 1;\n}\n.zodiac-label {\n  font-size: 0.9rem;\n  font-weight: 700;\n  min-width: 0;\n  text-align: center;\n}\n.readonly-select.zodiac-aries {\n  background: #fdf1f1;\n  color: #9f2f2f;\n}\n.readonly-select.zodiac-taurus {\n  background: #f7f3eb;\n  color: #6e4b2b;\n}\n.readonly-select.zodiac-gemini {\n  background: #fdf8e9;\n  color: #7d5a12;\n}\n.readonly-select.zodiac-cancer {\n  background: #eef4ff;\n  color: #2d5b8e;\n}\n.readonly-select.zodiac-leo {\n  background: #fff3e8;\n  color: #8f4b0d;\n}\n.readonly-select.zodiac-virgo {\n  background: #edf8ef;\n  color: #2b6b3d;\n}\n.readonly-select.zodiac-libra {\n  background: #f2eefc;\n  color: #60439d;\n}\n.readonly-select.zodiac-scorpio {\n  background: #f9edf2;\n  color: #7b3150;\n}\n.readonly-select.zodiac-sagittarius {\n  background: #eef1ff;\n  color: #2f4a9a;\n}\n.readonly-select.zodiac-capricorn {\n  background: #eff2f5;\n  color: #364653;\n}\n.readonly-select.zodiac-aquarius {\n  background: #ebf7fb;\n  color: #1d5f7a;\n}\n.readonly-select.zodiac-pisces {\n  background: #eef2ff;\n  color: #294b8f;\n}\n.physique-slim {\n  color: #3f7ab3;\n}\n.physique-lean {\n  color: #3f8f5f;\n}\n.physique-athletic {\n  color: #2f7e4d;\n}\n.physique-fit {\n  color: #465fbb;\n}\n.physique-curvy {\n  color: #a14875;\n}\n.physique-muscular {\n  color: #7d4f24;\n}\n.physique-average {\n  color: #4d667f;\n}\n.physique-select-wrap.physique-slim {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf3fb 0%,\n      #dfebf8 100%);\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.physique-select-wrap.physique-lean {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf6ee 0%,\n      #def0e5 100%);\n  border-color: rgba(63, 143, 95, 0.34);\n}\n.physique-select-wrap.physique-athletic {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f5ec 0%,\n      #dff0e6 100%);\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.physique-select-wrap.physique-fit {\n  background:\n    linear-gradient(\n      180deg,\n      #ebf0ff 0%,\n      #e1e8fc 100%);\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.physique-select-wrap.physique-curvy {\n  background:\n    linear-gradient(\n      180deg,\n      #f7edf3 0%,\n      #f0e3ec 100%);\n  border-color: rgba(161, 72, 117, 0.36);\n}\n.physique-select-wrap.physique-muscular {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe9 0%,\n      #ede3d8 100%);\n  border-color: rgba(125, 79, 36, 0.36);\n}\n.physique-select-wrap.physique-average {\n  background:\n    linear-gradient(\n      180deg,\n      #eef2f6 0%,\n      #e5ebf1 100%);\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.physique-select-wrap.physique-slim .status-option-content .mat-icon {\n  color: #3f7ab3;\n}\n.physique-select-wrap.physique-lean .status-option-content .mat-icon {\n  color: #3f8f5f;\n}\n.physique-select-wrap.physique-athletic .status-option-content .mat-icon {\n  color: #2f7e4d;\n}\n.physique-select-wrap.physique-fit .status-option-content .mat-icon {\n  color: #465fbb;\n}\n.physique-select-wrap.physique-curvy .status-option-content .mat-icon {\n  color: #a14875;\n}\n.physique-select-wrap.physique-muscular .status-option-content .mat-icon {\n  color: #7d4f24;\n}\n.physique-select-wrap.physique-average .status-option-content .mat-icon {\n  color: #4d667f;\n}\n.experience-filter-all {\n  color: #694ea6;\n}\n.experience-filter-workspace {\n  color: #a1485a;\n}\n.experience-filter-school {\n  color: #2d5ea8;\n}\n.experience-filter-online {\n  color: #2d7d47;\n}\n.experience-filter-project {\n  color: #6550a0;\n}\n.experience-filter-select.experience-filter-all,\n.experience-type-select.experience-filter-project {\n  background:\n    linear-gradient(\n      180deg,\n      #efe8ff 0%,\n      #e8defc 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n}\n.experience-filter-select.experience-filter-workspace,\n.experience-type-select.experience-filter-workspace {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f3 0%,\n      #ffe6ea 100%);\n  border-color: rgba(169, 72, 90, 0.32);\n}\n.experience-filter-select.experience-filter-school,\n.experience-type-select.experience-filter-school {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n}\n.experience-type-select.experience-filter-online {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n}\n.experience-type-select.experience-filter-project {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n}\n.experience-type-select {\n  min-width: 0;\n  max-width: 100%;\n  min-height: 40px;\n}\n.experience-type-field,\n.experience-title-field,\n.experience-city-field {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-org-field {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-type-select {\n  width: 100%;\n}\n.experience-date-range-field {\n  width: 100%;\n  max-width: none;\n  margin: 0;\n  background: transparent;\n}\n.experience-date-range-label {\n  grid-column: 1/2;\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-date-range-field .mat-mdc-text-field-wrapper {\n  min-height: 42px;\n  border-radius: 10px;\n  background: #fff;\n  border: 1px solid rgba(136, 156, 186, 0.5);\n  box-shadow: none;\n}\n.experience-date-range-field .mat-mdc-form-field-subscript-wrapper {\n  margin-top: 0.24rem;\n}\n.experience-date-range-field input {\n  border: 0 !important;\n  box-shadow: none !important;\n  border-radius: 0 !important;\n  background: transparent !important;\n  min-width: 0;\n  width: 100%;\n  padding: 0 !important;\n  min-height: 0 !important;\n  height: auto !important;\n  line-height: 1.25;\n}\n.experience-date-range-field .mat-datepicker-toggle {\n  margin-right: 0.2rem;\n}\n.experience-date-range-field .mat-mdc-form-field-hint-wrapper,\n.experience-date-range-field .mat-mdc-form-field-hint {\n  color: rgba(30, 49, 74, 0.65);\n  font-size: 0.72rem;\n}\n.experience-date-range-field .mat-date-range-input-container {\n  width: 100%;\n  display: grid;\n  grid-template-columns: minmax(96px, 1fr) auto minmax(96px, 1fr);\n  align-items: center;\n  column-gap: 0.34rem;\n  min-width: 0;\n}\n.experience-date-range-field .mat-date-range-input-separator {\n  margin: 0 0.28rem;\n  flex: 0 0 auto;\n  white-space: nowrap;\n}\n.experience-date-range-field .mat-date-range-input-start-wrapper,\n.experience-date-range-field .mat-date-range-input-end-wrapper {\n  width: 100%;\n  max-width: 100%;\n  overflow: visible;\n  min-width: 0;\n}\n.experience-date-range-field .mat-date-range-input-inner {\n  font-size: 0.96rem;\n  min-width: 0 !important;\n  width: 100% !important;\n  text-overflow: clip;\n  white-space: nowrap;\n  line-height: 1.25;\n}\n.experience-date-range-field .mat-mdc-form-field-flex {\n  min-width: 0;\n  border-bottom: 0 !important;\n  box-shadow: none !important;\n  align-items: center !important;\n}\n.experience-date-range-field .mat-mdc-form-field-infix {\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  min-height: 34px !important;\n  height: 34px;\n  display: flex;\n  align-items: center;\n}\n.experience-date-range-field .mdc-line-ripple,\n.experience-date-range-field .mat-mdc-form-field-line-ripple,\n.experience-date-range-field .mdc-line-ripple--deactivating,\n.experience-date-range-field .mdc-line-ripple--active {\n  display: none !important;\n  opacity: 0 !important;\n  transform: scaleX(0) !important;\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-all {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efe8ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-workspace {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1f3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-school {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf4ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-online {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf8ee);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-project {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f4f0ff);\n}\n.mobile-profile-language-chip.language-tone-1,\n.mobile-profile-selector-option.language-tone-1,\n:host ::ng-deep .mat-mdc-option.language-tone-1 {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n  color: #2f6090;\n}\n.mobile-profile-language-chip.language-tone-2,\n.mobile-profile-selector-option.language-tone-2,\n:host ::ng-deep .mat-mdc-option.language-tone-2 {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n  color: #2f695b;\n}\n.mobile-profile-language-chip.language-tone-3,\n.mobile-profile-selector-option.language-tone-3,\n:host ::ng-deep .mat-mdc-option.language-tone-3 {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n  color: #394f9c;\n}\n.mobile-profile-language-chip.language-tone-4,\n.mobile-profile-selector-option.language-tone-4,\n:host ::ng-deep .mat-mdc-option.language-tone-4 {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n  color: #8d3f66;\n}\n.mobile-profile-language-chip.language-tone-5,\n.mobile-profile-selector-option.language-tone-5,\n:host ::ng-deep .mat-mdc-option.language-tone-5 {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n  color: #704822;\n}\n.mobile-profile-language-chip.language-tone-6,\n.mobile-profile-selector-option.language-tone-6,\n:host ::ng-deep .mat-mdc-option.language-tone-6 {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n  color: #415872;\n}\n.mobile-profile-language-chip.language-tone-7,\n.mobile-profile-selector-option.language-tone-7,\n:host ::ng-deep .mat-mdc-option.language-tone-7 {\n  background: #f7f5ea;\n  border-color: rgba(128, 109, 66, 0.34);\n  color: #746237;\n}\n.mobile-profile-language-chip.language-tone-8,\n.mobile-profile-selector-option.language-tone-8,\n:host ::ng-deep .mat-mdc-option.language-tone-8 {\n  background: #edf5ff;\n  border-color: rgba(45, 122, 160, 0.34);\n  color: #2f6782;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf2ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #ebf7ef);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1e3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efecfc);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3f8e9);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fceef3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf7ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6f2e9);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-1 .status-option-content {\n  color: #2d63a9;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-2 .status-option-content {\n  color: #2a7a49;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-3 .status-option-content {\n  color: #9b6018;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-4 .status-option-content {\n  color: #6153a2;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-5 .status-option-content {\n  color: #61812a;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-6 .status-option-content {\n  color: #9f446d;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-7 .status-option-content {\n  color: #2e7898;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-8 .status-option-content {\n  color: #806c3f;\n}\n.mobile-profile-selector-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      180deg,\n      #eef5ff 0%,\n      #e3eefc 100%);\n  border-color: rgba(46, 102, 181, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      180deg,\n      #eef9f3 0%,\n      #e3f4ea 100%);\n  border-color: rgba(40, 125, 72, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ea 0%,\n      #ffecdd 100%);\n  border-color: rgba(165, 94, 24, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f1ff 0%,\n      #e8e5fb 100%);\n  border-color: rgba(97, 82, 164, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f9ef 0%,\n      #edf3e1 100%);\n  border-color: rgba(95, 128, 36, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #f9e6ed 100%);\n  border-color: rgba(160, 70, 111, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ff 0%,\n      #e2f0fb 100%);\n  border-color: rgba(45, 122, 160, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f3ea 0%,\n      #eee9dc 100%);\n  border-color: rgba(128, 109, 66, 0.32);\n}\n.mobile-profile-selector-option.status-public {\n  background:\n    linear-gradient(\n      180deg,\n      #e6f6ef 0%,\n      #d9f0e6 100%);\n  border-color: rgba(47, 143, 102, 0.34);\n}\n.mobile-profile-selector-option.status-friends {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f1fd 0%,\n      #dfeaf9 100%);\n  border-color: rgba(27, 87, 161, 0.34);\n}\n.mobile-profile-selector-option.status-host {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe2 0%,\n      #eee4d2 100%);\n  border-color: rgba(135, 88, 15, 0.36);\n}\n.mobile-profile-selector-option.status-inactive {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3f5 0%,\n      #e8ebef 100%);\n  border-color: rgba(91, 101, 115, 0.32);\n}\n.mobile-profile-selector-option.physique-slim {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.mobile-profile-selector-option.physique-lean {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n}\n.mobile-profile-selector-option.physique-athletic {\n  background: #e8f5ec;\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.mobile-profile-selector-option.physique-fit {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.mobile-profile-selector-option.physique-curvy {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n}\n.mobile-profile-selector-option.physique-muscular {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n}\n.mobile-profile-selector-option.physique-average {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.popup-panel-profile-selector .values-selector-popup.profile-selector-popup {\n  gap: 0.56rem;\n}\n.popup-panel-profile-selector .profile-filter-selector-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.44rem;\n  padding-bottom: 0.22rem;\n  border-bottom: 1px solid rgba(74, 102, 139, 0.22);\n}\n.popup-panel-profile-selector .profile-filter-selector-head-label {\n  color: #203c64;\n  font-size: 0.82rem;\n  font-weight: 800;\n  line-height: 1.2;\n}\n.popup-panel-profile-selector .profile-filter-selector-clear {\n  border: 1px solid rgba(41, 73, 110, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.82);\n  color: #284970;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.3rem 0.52rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector .profile-filter-selector-clear.is-hidden {\n  visibility: hidden;\n  pointer-events: none;\n}\n.popup-panel-profile-selector .profile-filter-selector-selected {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector .profile-filter-selector-chip {\n  border: 1px solid rgba(35, 68, 107, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.92);\n  color: #234368;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.26rem 0.48rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.16rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector .profile-filter-selector-chip .mat-icon {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n}\n.popup-panel-profile-selector .profile-filter-selector-empty {\n  margin: 0;\n  font-size: 0.74rem;\n  color: rgba(31, 54, 86, 0.62);\n  font-style: italic;\n}\n.popup-panel-profile-selector .profile-selector-option-group {\n  display: grid;\n  gap: 0.34rem;\n  border: 1px solid transparent;\n  border-radius: 12px;\n  padding: 0.4rem 0.42rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-head {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag {\n  border-radius: 999px;\n  border: 1px solid rgba(52, 86, 128, 0.28);\n  background: rgba(255, 255, 255, 0.74);\n  color: #2f527d;\n  font-size: 0.67rem;\n  font-weight: 800;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.2rem 0.52rem;\n  text-transform: uppercase;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag-icon {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.popup-panel-profile-selector .profile-selector-option-group-line {\n  display: block;\n  width: 100%;\n  height: 1px;\n  background: rgba(84, 111, 147, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-chip-grid {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.36rem;\n}\n.popup-panel-profile-selector .profile-selector-chip {\n  border: 1px solid rgba(41, 70, 106, 0.22);\n  border-radius: 999px;\n  background: #f4f8ff;\n  color: #234066;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 700;\n  padding: 0.3rem 0.58rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  cursor: pointer;\n  transition:\n    background-color 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.popup-panel-profile-selector .profile-selector-chip.active {\n  border-color: rgba(27, 85, 158, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #dcebff 0%,\n      #cfe3ff 100%);\n  color: #123e70;\n  box-shadow: inset 0 0 0 1px rgba(30, 73, 127, 0.24), 0 1px 2px rgba(24, 53, 86, 0.16);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-family {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 232, 219, 0.52) 0%,\n      rgba(255, 232, 219, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-ambition {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 242, 216, 0.52) 0%,\n      rgba(255, 242, 216, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-lifestyle {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(221, 241, 239, 0.56) 0%,\n      rgba(221, 241, 239, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-beliefs {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-social {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(223, 236, 255, 0.5) 0%,\n      rgba(223, 236, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-arts {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(235, 227, 255, 0.5) 0%,\n      rgba(235, 227, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-food {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 236, 221, 0.52) 0%,\n      rgba(255, 236, 221, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-active {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(222, 243, 231, 0.56) 0%,\n      rgba(222, 243, 231, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-mind {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(219, 242, 238, 0.56) 0%,\n      rgba(219, 242, 238, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-identity {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-family {\n  border-color: rgba(156, 94, 51, 0.34);\n  color: #9c5e33;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-ambition {\n  border-color: rgba(160, 106, 20, 0.34);\n  color: #9b6717;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-lifestyle {\n  border-color: rgba(47, 123, 119, 0.34);\n  color: #2f7b77;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-beliefs {\n  border-color: rgba(95, 78, 160, 0.34);\n  color: #5f4ea0;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-social {\n  border-color: rgba(47, 106, 175, 0.36);\n  color: #2f6aaf;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-arts {\n  border-color: rgba(106, 87, 168, 0.36);\n  color: #6a57a8;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-food {\n  border-color: rgba(170, 97, 28, 0.34);\n  color: #a55e18;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-active {\n  border-color: rgba(49, 124, 82, 0.36);\n  color: #317c52;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-mind {\n  border-color: rgba(37, 124, 118, 0.34);\n  color: #2b7c76;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-identity {\n  border-color: rgba(98, 84, 163, 0.34);\n  color: #6254a3;\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-family {\n  background: rgba(156, 94, 51, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-ambition {\n  background: rgba(160, 106, 20, 0.32);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-lifestyle {\n  background: rgba(47, 123, 119, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-beliefs {\n  background: rgba(95, 78, 160, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-social {\n  background: rgba(47, 106, 175, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-arts {\n  background: rgba(106, 87, 168, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-food {\n  background: rgba(170, 97, 28, 0.32);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-active {\n  background: rgba(49, 124, 82, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-mind {\n  background: rgba(37, 124, 118, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-identity {\n  background: rgba(98, 84, 163, 0.3);\n}\n:host ::ng-deep .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.status-option) {\n  background: #f0f5fc;\n}\n:host ::ng-deep .mat-mdc-option.status-option.mdc-list-item--selected:not(.mdc-list-item--disabled) {\n  filter: brightness(0.95);\n  box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.2);\n}\n:host ::ng-deep .mat-mdc-option.status-option {\n  background: #fff;\n}\n:host ::ng-deep .mat-mdc-option.status-option:not(:last-child) {\n  border-bottom: 1px solid #e6edf7;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.hide-selected-option,\n:host ::ng-deep .status-options-panel .mat-mdc-option.hide-selected-option {\n  min-height: 0 !important;\n  height: 0 !important;\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  border: 0 !important;\n  margin: 0 !important;\n  opacity: 0 !important;\n  pointer-events: none !important;\n  overflow: hidden !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option {\n  background: #fff;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel {\n  margin-top: 8px !important;\n  margin-bottom: 8px !important;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .cdk-overlay-pane .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .cdk-overlay-pane .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above {\n  margin-top: 0 !important;\n  margin-bottom: 18px !important;\n  transform: translateY(-10px) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public {\n  --mdc-list-list-item-container-color: #def3e9;\n  --mat-mdc-option-selected-container-color: #def3e9;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #def3e9) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends {\n  --mdc-list-list-item-container-color: #e3eefb;\n  --mat-mdc-option-selected-container-color: #e3eefb;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e3eefb) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host {\n  --mdc-list-list-item-container-color: #f3ead8;\n  --mat-mdc-option-selected-container-color: #f3ead8;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3ead8) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive {\n  --mdc-list-list-item-container-color: #eceff3;\n  --mat-mdc-option-selected-container-color: #eceff3;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eceff3) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon {\n  color: #2f8f66 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon {\n  color: #1b57a1 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon {\n  color: #87580f !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon {\n  color: #5b6573 !important;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-slim {\n  background: #eaf4ff;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-lean {\n  background: #edf8f4;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-athletic {\n  background: #e8f5ec;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-fit {\n  background: #f1f2ff;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-curvy {\n  background: #fff2f8;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-muscular {\n  background: #fbf4ea;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-average {\n  background: #eff4f9;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-slim .status-option-content {\n  color: #3f7ab3;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-lean .status-option-content {\n  color: #3f8f5f;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-athletic .status-option-content {\n  color: #2f7e4d;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-fit .status-option-content {\n  color: #465fbb;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-curvy .status-option-content {\n  color: #a14875;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-muscular .status-option-content {\n  color: #7d4f24;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-average .status-option-content {\n  color: #4d667f;\n}\n:host ::ng-deep .mat-mdc-select-panel.physique-options-panel {\n  width: auto !important;\n  max-width: 220px !important;\n  min-width: 0 !important;\n}\n:host ::ng-deep .physique-options-panel .mat-mdc-option {\n  padding-right: 8px;\n}\n:host ::ng-deep .physique-options-panel .mat-mdc-option .mat-pseudo-checkbox {\n  margin-left: 4px;\n}\n@media (max-width: 760px) {\n  .experience-form-grid {\n    grid-template-columns: 1fr;\n    max-width: none;\n    justify-content: stretch;\n    row-gap: 0.72rem;\n  }\n  .experience-date-range-label {\n    grid-column: 1/-1;\n  }\n  .experience-date-range-field .mat-date-range-input-container {\n    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);\n  }\n  .profile-details-privacy-fab .privacy-fab-actions {\n    position: fixed;\n    left: 0.5rem;\n    right: 0.5rem;\n    bottom: max(0.5rem, env(safe-area-inset-bottom));\n    top: auto;\n    transform: translateY(12px) scale(0.98);\n    transform-origin: bottom center;\n    justify-content: center;\n    gap: 0.46rem;\n    padding: 0.46rem 0.56rem;\n    border: 1px solid rgba(42, 68, 102, 0.2);\n    border-radius: 14px;\n    background: #fff;\n    box-shadow: 0 -12px 24px rgba(18, 31, 51, 0.22);\n  }\n  .profile-details-privacy-fab.open .privacy-fab-actions {\n    transform: translateY(0) scale(1);\n  }\n}\n:host {\n  display: contents;\n}\n.event-supply-contributions-popup-shell,\n.subevent-supply-contributions-popup {\n  display: flex;\n  flex: 1 1 auto;\n  width: 100%;\n  height: 100%;\n  min-height: 0;\n}\napp-smart-list.subevent-supply-contribution-smart-list {\n  display: flex;\n  flex: 1 1 auto;\n  width: 100%;\n  min-height: 0;\n}\n/*# sourceMappingURL=event-supply-contributions-popup.component.css.map */\n'] }]
  }], null, { supplyContributionSmartList: [{
    type: ViewChild,
    args: ["supplyContributionSmartList"]
  }], supplyContributionItemTemplate: [{
    type: ViewChild,
    args: ["supplyContributionItemTemplate", { read: TemplateRef }]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EventSupplyContributionsPopupComponent, { className: "EventSupplyContributionsPopupComponent", filePath: "app/activity/components/event-supply-contributions-popup/event-supply-contributions-popup.component.ts", lineNumber: 102 });
})();
export {
  EventSupplyContributionsPopupComponent
};
//# sourceMappingURL=event-supply-contributions-popup.component-CLOMGWWA.js.map
