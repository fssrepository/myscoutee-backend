import {
  AssetPopupStore
} from "./chunk-PUXHWXJS.js";
import {
  EventCheckoutDialogStore
} from "./chunk-4KZT4WAB.js";
import "./chunk-SYKOEE4K.js";
import {
  PaymentMethodsPopupStore
} from "./chunk-EJ5KWFDD.js";
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
  PaymentCardComponent,
  SingleRowComponent
} from "./chunk-7FJOOQKP.js";
import "./chunk-KO4GQHHA.js";
import "./chunk-Z4E5Y2UC.js";
import {
  ChatPopupHeaderContextConverter
} from "./chunk-RFTK2A34.js";
import "./chunk-7FYNT6CO.js";
import "./chunk-IPHHDSOR.js";
import "./chunk-EA3MO7BB.js";
import "./chunk-5VDIJXBA.js";
import "./chunk-Z7T4C7EV.js";
import {
  AssetsService,
  PaymentMethodsService
} from "./chunk-JNYVIKB6.js";
import "./chunk-522CXB3E.js";
import "./chunk-HWWKH4YJ.js";
import {
  EventsService
} from "./chunk-LFVP4M73.js";
import "./chunk-2DMDD7ZZ.js";
import {
  PopupComponent
} from "./chunk-ERGA5DCY.js";
import "./chunk-ADBOYRJ7.js";
import "./chunk-EAXEH725.js";
import "./chunk-53UGBDSO.js";
import {
  DeploymentConfigurationService
} from "./chunk-MOUXN75Y.js";
import {
  I18nPipe
} from "./chunk-L6HJFJOR.js";
import {
  DomSanitizer
} from "./chunk-LFBAVSTX.js";
import {
  UsersService
} from "./chunk-RP5GBSNO.js";
import "./chunk-HGLCBXAR.js";
import "./chunk-OY7NWTMT.js";
import {
  AssetCardBuilder
} from "./chunk-EWHSEKAB.js";
import "./chunk-LM6UNLJK.js";
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
  ASSET_TYPES
} from "./chunk-N7OBXPJA.js";
import {
  I18nService
} from "./chunk-AOUY6FNC.js";
import "./chunk-SCHUURLR.js";
import "./chunk-CYVMX3LD.js";
import "./chunk-HDBJPOT3.js";
import "./chunk-LDZENZ35.js";
import "./chunk-DZ6OOOZN.js";
import "./chunk-ODJSNRFC.js";
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  __spreadProps,
  __spreadValues,
  computed,
  from,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
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
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵsanitizeResourceUrl,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-EV3I3YNV.js";

// src/app/shared/ui/components/payment-methods-popup/payment-methods-popup.component.ts
var _forTrack0 = ($index, $item) => $item.tone + ":" + $item.text;
function PaymentMethodsPopupComponent_Conditional_0_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 4);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r1.error()));
  }
}
function PaymentMethodsPopupComponent_Conditional_0_Conditional_0_Conditional_3_Conditional_0_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const total_r3 = ctx.$implicit;
    \u0275\u0275classProp("payment-methods-popup__history-total--expense", total_r3.tone === "expense")("payment-methods-popup__history-total--income", total_r3.tone === "income");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(total_r3.text);
  }
}
function PaymentMethodsPopupComponent_Conditional_0_Conditional_0_Conditional_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275pipe(1, "i18n");
    \u0275\u0275repeaterCreate(2, PaymentMethodsPopupComponent_Conditional_0_Conditional_0_Conditional_3_Conditional_0_For_3_Template, 2, 5, "span", 7, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const totals_r4 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(1, 1, "payment.history.totals"));
    \u0275\u0275advance(2);
    \u0275\u0275repeater(totals_r4);
  }
}
function PaymentMethodsPopupComponent_Conditional_0_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, PaymentMethodsPopupComponent_Conditional_0_Conditional_0_Conditional_3_Conditional_0_Template, 4, 3, "div", 6);
  }
  if (rf & 2) {
    \u0275\u0275conditional(ctx.length ? 0 : -1);
  }
}
function PaymentMethodsPopupComponent_Conditional_0_Conditional_0_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "single-row", 9);
    \u0275\u0275listener("menuRequest", function PaymentMethodsPopupComponent_Conditional_0_Conditional_0_ng_template_5_Template_single_row_menuRequest_0_listener($event) {
      const openMenu_r6 = \u0275\u0275restoreView(_r5).openMenu;
      return \u0275\u0275resetView(openMenu_r6($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r7 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("row", ctx_r1.historyRow(item_r7, true))("useSharedMenu", true);
  }
}
function PaymentMethodsPopupComponent_Conditional_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 2)(1, "section", 3);
    \u0275\u0275conditionalCreate(2, PaymentMethodsPopupComponent_Conditional_0_Conditional_0_Conditional_2_Template, 3, 3, "p", 4);
    \u0275\u0275conditionalCreate(3, PaymentMethodsPopupComponent_Conditional_0_Conditional_0_Conditional_3_Template, 1, 1);
    \u0275\u0275elementStart(4, "app-smart-list", 5);
    \u0275\u0275listener("menuItemSelect", function PaymentMethodsPopupComponent_Conditional_0_Conditional_0_Template_app_smart_list_menuItemSelect_4_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onPaymentHistoryMenuSelect($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, PaymentMethodsPopupComponent_Conditional_0_Conditional_0_ng_template_5_Template, 1, 2, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_6_0;
    const paymentHistoryTemplate_r8 = \u0275\u0275reference(6);
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("model", ctx_r1.mainPopupModel())("zIndex", 22200);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.error() ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_6_0 = ctx_r1.historyHeaderTotals()) ? 3 : -1, tmp_6_0);
    \u0275\u0275advance();
    \u0275\u0275property("config", ctx_r1.allHistoryListConfig)("loadPage", ctx_r1.loadAllHistory)("query", ctx_r1.allHistoryQuery())("itemTemplate", paymentHistoryTemplate_r8);
  }
}
function PaymentMethodsPopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, PaymentMethodsPopupComponent_Conditional_0_Conditional_0_Template, 7, 8, "app-popup", 2);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(!ctx_r1.pickerMode() ? 0 : -1);
  }
}
function PaymentMethodsPopupComponent_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 4);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r1.error()));
  }
}
function PaymentMethodsPopupComponent_Conditional_1_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-payment-card", 10);
    \u0275\u0275listener("cardSelect", function PaymentMethodsPopupComponent_Conditional_1_ng_template_4_Template_app_payment_card_cardSelect_0_listener($event) {
      const method_r11 = \u0275\u0275restoreView(_r10).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.selectCard(method_r11, $event));
    })("menuRequest", function PaymentMethodsPopupComponent_Conditional_1_ng_template_4_Template_app_payment_card_menuRequest_0_listener($event) {
      const openMenu_r12 = \u0275\u0275restoreView(_r10).openMenu;
      return \u0275\u0275resetView(openMenu_r12($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const method_r11 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("card", ctx_r1.paymentCard(method_r11))("selectable", ctx_r1.pickerMode())("showMenu", true);
  }
}
function PaymentMethodsPopupComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 2)(1, "section", 3);
    \u0275\u0275conditionalCreate(2, PaymentMethodsPopupComponent_Conditional_1_Conditional_2_Template, 3, 3, "p", 4);
    \u0275\u0275elementStart(3, "app-smart-list", 5);
    \u0275\u0275listener("menuItemSelect", function PaymentMethodsPopupComponent_Conditional_1_Template_app_smart_list_menuItemSelect_3_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onCardMenuSelect($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, PaymentMethodsPopupComponent_Conditional_1_ng_template_4_Template, 1, 3, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const paymentCardTemplate_r13 = \u0275\u0275reference(5);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.cardsPopupModel())("zIndex", 22400);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.error() ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("config", ctx_r1.cardListConfig)("loadPage", ctx_r1.loadCards)("query", ctx_r1.query())("itemTemplate", paymentCardTemplate_r13);
  }
}
function PaymentMethodsPopupComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-popup", 2)(1, "section", 11)(2, "div", 12);
    \u0275\u0275element(3, "img", 13);
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "iframe", 14);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const providerRegistration_r14 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.registrationPopupModel())("zIndex", 22800);
    \u0275\u0275advance(3);
    \u0275\u0275property("src", ctx_r1.registrationProviderLogo(providerRegistration_r14.provider), \u0275\u0275sanitizeUrl)("alt", ctx_r1.registrationProviderLabel(providerRegistration_r14.provider));
    \u0275\u0275advance();
    \u0275\u0275property("src", providerRegistration_r14.safeUrl, \u0275\u0275sanitizeResourceUrl)("title", \u0275\u0275pipeBind1(5, 6, "payment.registration.frame.title"));
  }
}
var PaymentMethodsPopupComponent = class _PaymentMethodsPopupComponent {
  store = inject(PaymentMethodsPopupStore);
  userProfileStore = inject(UserProfileStore);
  users = inject(UsersService);
  activityStore = inject(ActivityStore);
  paymentMethods = inject(PaymentMethodsService);
  deploymentConfiguration = inject(DeploymentConfigurationService);
  events = inject(EventsService);
  activities = inject(ActivitiesPopupStore);
  eventCheckoutDialog = inject(EventCheckoutDialogStore);
  assets = inject(AssetsService);
  assetStore = inject(AssetStore);
  assetPopup = inject(AssetPopupStore);
  dialogStore = inject(DialogStore);
  sanitizer = inject(DomSanitizer);
  i18n = inject(I18nService);
  revisionRef = signal(0, ...ngDevMode ? [{ debugName: "revisionRef" }] : (
    /* istanbul ignore next */
    []
  ));
  canAddRef = signal(false, ...ngDevMode ? [{ debugName: "canAddRef" }] : (
    /* istanbul ignore next */
    []
  ));
  cardsOpenRef = signal(false, ...ngDevMode ? [{ debugName: "cardsOpenRef" }] : (
    /* istanbul ignore next */
    []
  ));
  registrationRef = signal(null, ...ngDevMode ? [{ debugName: "registrationRef" }] : (
    /* istanbul ignore next */
    []
  ));
  registrationFrameOpenRef = signal(false, ...ngDevMode ? [{ debugName: "registrationFrameOpenRef" }] : (
    /* istanbul ignore next */
    []
  ));
  busyRef = signal(false, ...ngDevMode ? [{ debugName: "busyRef" }] : (
    /* istanbul ignore next */
    []
  ));
  errorRef = signal("", ...ngDevMode ? [{ debugName: "errorRef" }] : (
    /* istanbul ignore next */
    []
  ));
  spendingTotalsRef = signal({}, ...ngDevMode ? [{ debugName: "spendingTotalsRef" }] : (
    /* istanbul ignore next */
    []
  ));
  incomeTotalsRef = signal({}, ...ngDevMode ? [{ debugName: "incomeTotalsRef" }] : (
    /* istanbul ignore next */
    []
  ));
  historyDirectionRef = signal("all", ...ngDevMode ? [{ debugName: "historyDirectionRef" }] : (
    /* istanbul ignore next */
    []
  ));
  pendingRefundCountRef = signal(0, ...ngDevMode ? [{ debugName: "pendingRefundCountRef" }] : (
    /* istanbul ignore next */
    []
  ));
  historyTotalsLoadedRef = signal(false, ...ngDevMode ? [{ debugName: "historyTotalsLoadedRef" }] : (
    /* istanbul ignore next */
    []
  ));
  loadedCardsById = /* @__PURE__ */ new Map();
  registrationPoll = null;
  registrationRefreshInFlight = false;
  cardsOpen = this.cardsOpenRef.asReadonly();
  registration = this.registrationRef.asReadonly();
  registrationFrameOpen = this.registrationFrameOpenRef.asReadonly();
  busy = this.busyRef.asReadonly();
  error = this.errorRef.asReadonly();
  spendingTotals = this.spendingTotalsRef.asReadonly();
  historyDirection = this.historyDirectionRef.asReadonly();
  localMode = this.paymentMethods.localModeEnabled;
  pickerMode = computed(() => this.store.picker() !== null, ...ngDevMode ? [{ debugName: "pickerMode" }] : (
    /* istanbul ignore next */
    []
  ));
  query = computed(() => ({
    page: 0,
    pageSize: 6,
    sort: "createdAt",
    direction: "desc",
    filters: { revision: this.revisionRef() }
  }), ...ngDevMode ? [{ debugName: "query" }] : (
    /* istanbul ignore next */
    []
  ));
  allHistoryQuery = computed(() => ({
    page: 0,
    pageSize: 20,
    sort: "createdDate",
    direction: "desc",
    filters: { revision: this.revisionRef(), direction: this.historyDirectionRef() }
  }), ...ngDevMode ? [{ debugName: "allHistoryQuery" }] : (
    /* istanbul ignore next */
    []
  ));
  cardListConfig = {
    pageSize: 6,
    defaultView: "list",
    showStickyHeader: false,
    emptyLabel: "payment.cards.empty",
    emptyDescription: this.localMode ? "payment.cards.empty.local.description" : "payment.cards.empty.description",
    listLayout: "card-grid",
    desktopColumns: 2,
    mobileColumns: 1,
    snapMode: "none",
    headerProgress: { enabled: true, placement: "inline", tone: "accent" },
    containerClass: { "payment-method-card-list": true },
    trackBy: (_index, item) => item.id
  };
  allHistoryListConfig = {
    pageSize: 20,
    defaultView: "list",
    showStickyHeader: false,
    emptyLabel: "payment.history.empty",
    emptyDescription: "payment.history.empty.description",
    listLayout: "stack",
    snapMode: "none",
    groupBy: (item) => `${item.createdAtIso ?? ""}`.slice(0, 10),
    showFirstGroupMarker: true,
    headerProgress: { enabled: true, placement: "inline", tone: "accent" },
    trackBy: (_index, item) => item.id
  };
  loadCards = (query, context) => from(this.paymentMethods.queryPage(this.activeUserId(), query, context?.signal).then((page) => {
    if (page.currentProvider) {
      this.deploymentConfiguration.applyPaymentProviderId(page.currentProvider === "none" ? null : page.currentProvider);
    }
    const orderedItems = this.orderPaymentMethods(page.items);
    this.loadedCardsById.clear();
    orderedItems.forEach((item) => this.loadedCardsById.set(item.id, __spreadValues({}, item)));
    this.canAddRef.set(page.canAdd === true);
    if (page.pendingRegistration?.status === "pending") {
      this.trackRegistration(page.pendingRegistration, false);
    }
    const pending = page.pendingRegistration?.status === "pending" ? this.pendingPaymentMethod(page.pendingRegistration) : null;
    if (!pending)
      return __spreadProps(__spreadValues({}, page), { items: orderedItems });
    const replacedId = page.pendingRegistration?.replacesPaymentMethodId?.trim() || null;
    const replaced = Boolean(replacedId && orderedItems.some((item) => item.id === replacedId));
    const items = replaced ? orderedItems.map((item) => item.id === replacedId ? pending : item) : [...orderedItems, pending];
    return __spreadProps(__spreadValues({}, page), { items, total: Math.min(6, page.total + (replaced ? 0 : 1)) });
  }));
  loadAllHistory = (query, context) => from(this.paymentMethods.queryAllHistory(this.activeUserId(), query, context?.signal).then((page) => {
    this.spendingTotalsRef.set(__spreadValues({}, page.spendingTotals));
    this.incomeTotalsRef.set(__spreadValues({}, page.incomeTotals));
    this.historyTotalsLoadedRef.set(true);
    this.pendingRefundCountRef.set(Math.max(0, Math.trunc(Number(page.pendingRefundCount) || 0)));
    return page;
  }));
  mainPopupModel() {
    return {
      title: "payment.history.title",
      subtitle: "payment.history.subtitle",
      ariaLabel: "payment.history.title",
      closeAriaLabel: "payment.history.close",
      size: "wide",
      height: "full",
      bodyLayout: "fill",
      headerTone: "accent",
      headerPalette: "blue",
      headerControls: [this.historyFilterControl(), this.headerActionControl({
        id: "open-cards",
        icon: "credit_card",
        label: "payment.cards.open",
        ariaLabel: "payment.cards.open.aria",
        palette: "blue",
        layout: "pill",
        action: "custom",
        context: { action: "open-cards" }
      })],
      onMenuSelect: (event) => this.onHeaderMenuSelect(event),
      onClose: () => this.closeAll()
    };
  }
  cardsPopupModel() {
    const headerControls = [this.headerActionControl({
      id: "add-card",
      icon: "add",
      label: "payment.cards.add",
      ariaLabel: "payment.cards.add.aria",
      disabled: this.localMode || !this.canAddRef() || this.busyRef() || this.registrationRef() !== null,
      palette: "green",
      layout: "pill",
      action: "custom",
      context: { action: "add-card" }
    })];
    if (this.pickerMode()) {
      headerControls.push(this.headerActionControl({
        id: "confirm-card",
        icon: "done",
        ariaLabel: "payment.cards.select.confirm",
        disabled: !this.selectedPaymentMethod(),
        palette: "green",
        layout: "icon",
        action: "custom",
        context: { action: "confirm-card" }
      }));
    }
    return {
      title: this.pickerMode() ? "payment.cards.select.title" : "payment.cards.title",
      subtitle: this.localMode ? "payment.cards.subtitle.local" : "payment.cards.subtitle",
      ariaLabel: this.pickerMode() ? "payment.cards.select.aria" : "payment.cards.manage.aria",
      closeAriaLabel: "payment.cards.close",
      size: "wide",
      height: "full",
      bodyLayout: "fill",
      headerTone: "accent",
      headerPalette: "blue",
      headerControls,
      onMenuSelect: (event) => this.onHeaderMenuSelect(event),
      onClose: () => this.closeCards()
    };
  }
  registrationPopupModel() {
    return {
      title: "payment.registration.title",
      subtitle: "payment.registration.subtitle",
      ariaLabel: "payment.registration.aria",
      closeAriaLabel: "payment.registration.close",
      size: "default",
      height: "full",
      bodyLayout: "flush",
      headerTone: "accent",
      headerPalette: "green",
      onClose: () => this.closeRegistration()
    };
  }
  registrationProviderLogo(provider) {
    return `assets/payment-providers/${provider}.svg`;
  }
  registrationProviderLabel(provider) {
    return provider === "barion" ? "Barion" : "Stripe";
  }
  paymentCard(method) {
    const loading = method.status === "registering";
    const expired = this.paymentMethodExpired(method);
    const requiresRetokenization = !this.localMode && !loading && !expired && this.paymentMethodRequiresRetokenization(method);
    const deleteAction = {
      id: "delete-payment-card",
      label: "payment.cards.delete",
      icon: "delete",
      tone: "destructive"
    };
    return {
      id: method.id,
      provider: method.provider,
      brand: method.brand,
      last4: method.last4,
      expiryMonth: method.expiryMonth,
      expiryYear: method.expiryYear,
      cardholderName: method.cardholderName,
      artworkUrl: method.artworkUrl,
      loading,
      loadingLabel: loading ? "payment.registration.pending" : void 0,
      disabled: loading || expired || requiresRetokenization,
      expired,
      requiresRetokenization,
      selected: !expired && !requiresRetokenization && this.pickerMode() && this.store.selectedPaymentMethodId() === method.id,
      paymentMenuActions: loading ? [] : expired ? [deleteAction] : requiresRetokenization ? [
        {
          id: "retokenize-payment-card",
          label: "payment.cards.retokenize",
          icon: "published_with_changes",
          tone: "warning"
        },
        deleteAction
      ] : this.pickerMode() ? [] : [
        {
          id: "replace-payment-card",
          label: "payment.cards.replace",
          icon: "published_with_changes",
          tone: "accent"
        },
        deleteAction
      ]
    };
  }
  historyRow(item, withMenu = false) {
    const refundAudit = item.auditKind === "refund";
    const amount = this.formatSignedCurrency(Number(item.amount) || 0, item.currency || "HUF", item.direction === "income" ? "+" : "\u2212");
    const date = new Date(item.createdAtIso);
    const statusLabel = this.paymentStatusLabel(item.status);
    return {
      id: item.id,
      title: amount,
      surfaceTone: item.direction === "income" ? "success" : "danger",
      subtitle: item.sourceId || this.i18n.translate("payment"),
      detail: Number.isNaN(date.getTime()) ? null : date.toLocaleString(void 0, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }),
      icon: item.status === "captured" ? "check_circle" : refundAudit ? "currency_exchange" : "payments",
      avatarToneClass: `payment-history-avatar payment-history-avatar--${item.status === "failed" ? "failed" : item.direction}`,
      badges: [
        {
          label: item.provider,
          icon: item.provider.toLowerCase() === "stripe" ? "payment" : "account_balance_wallet",
          tone: item.provider.toLowerCase() === "stripe" ? "info" : "accent",
          position: "inline"
        },
        {
          label: statusLabel,
          tone: item.direction === "income" ? "success" : "danger",
          className: item.direction === "income" ? "payment-history-status-badge--success" : "payment-history-status-badge--danger",
          position: "top-right"
        },
        ...!refundAudit && item.refundRequestStatus === "pending" ? [{
          label: this.i18n.translate("payment.history.refund.pending"),
          icon: "pending_actions",
          tone: "warning",
          position: "inline"
        }] : []
      ],
      menuActions: withMenu ? this.paymentHistoryMenuActions(item) : [],
      eagerDetail: item
    };
  }
  onPaymentHistoryMenuSelect(event) {
    const row = event.context?.row;
    const item = row?.eagerDetail;
    if (!item)
      return;
    if (event.id === "paymentSummary") {
      void this.openPaymentSummary(item);
    } else if (event.id === "requestRefund") {
      this.confirmRefundRequest(item);
    } else if (event.id === "approveRefund") {
      this.confirmRefundApproval(item);
    } else if (event.id === "askAssetOwner" || event.id === "askOrganizer") {
      void this.openPaymentServiceChat(item);
    }
  }
  selectCard(method, event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.pickerMode() || method.status !== "active" || this.paymentMethodExpired(method) || this.paymentMethodRequiresRetokenization(method))
      return;
    this.store.togglePickerSelection(method.id);
  }
  onCardMenuSelect(event) {
    const context = event.context;
    const paymentMethodId = `${context?.paymentMethodId ?? context?.item?.id ?? ""}`.trim();
    const method = context?.item ?? this.loadedCardsById.get(paymentMethodId) ?? null;
    if (!method)
      return;
    event.sourceEvent.preventDefault();
    event.sourceEvent.stopPropagation();
    if (event.id === "replace-payment-card" || event.id === "retokenize-payment-card") {
      void this.beginRegistration(method.id);
    } else if (event.id === "delete-payment-card") {
      this.confirmDelete(method);
    }
  }
  confirmDelete(method) {
    this.dialogStore.open({
      title: "payment.cards.delete.title",
      message: this.i18n.translateParams("payment.cards.delete.message", {
        brand: method.brand,
        last4: method.last4
      }),
      cancelLabel: "cancel",
      confirmLabel: "payment.cards.delete",
      busyConfirmLabel: "payment.cards.delete.busy",
      confirmTone: "danger",
      failureMessage: "payment.cards.delete.error",
      onConfirm: async () => {
        await this.paymentMethods.deletePaymentMethod(this.activeUserId(), method.id);
        this.loadedCardsById.delete(method.id);
        this.errorRef.set("");
        this.revisionRef.update((value) => value + 1);
      }
    });
  }
  onProviderMessage(event) {
    const registration = this.registrationRef();
    if (!registration || event.origin !== this.origin(registration.url))
      return;
    const payload = event.data;
    if (payload?.type !== "myscoutee:payment-method-registration" || payload.registrationId !== registration.id)
      return;
    if (payload.status === "completed" || payload.status === "cancelled" || payload.status === "expired" || payload.status === "failed") {
      this.registrationFrameOpenRef.set(false);
      void this.refreshRegistration();
    }
  }
  onHeaderMenuSelect(event) {
    event.itemSelect.sourceEvent.preventDefault();
    event.itemSelect.sourceEvent.stopPropagation();
    const action = event.itemSelect.context?.action;
    if (action === "set-history-direction") {
      const direction = event.itemSelect.context?.direction;
      if (direction && direction !== this.historyDirectionRef()) {
        this.historyDirectionRef.set(direction);
        this.revisionRef.update((value) => value + 1);
      }
      return;
    }
    if (action === "add-card") {
      void this.beginRegistration(null);
      return;
    }
    if (action === "open-cards") {
      this.errorRef.set("");
      this.cardsOpenRef.set(true);
      return;
    }
    if (action === "confirm-card") {
      const selected = this.selectedPaymentMethod();
      if (selected)
        this.store.confirm(selected);
    }
  }
  selectedPaymentMethod() {
    const selectedId = this.store.selectedPaymentMethodId();
    const selected = selectedId ? this.loadedCardsById.get(selectedId) ?? null : null;
    return selected?.status === "active" && !this.paymentMethodExpired(selected) && !this.paymentMethodRequiresRetokenization(selected) ? selected : null;
  }
  paymentMethodRequiresRetokenization(method) {
    const activeProvider = `${this.deploymentConfiguration.paymentProviderId() ?? ""}`.trim().toLowerCase();
    const tokenProvider = `${method.provider ?? ""}`.trim().toLowerCase();
    return Boolean(activeProvider && tokenProvider && activeProvider !== tokenProvider);
  }
  orderPaymentMethods(methods) {
    return methods.map((method, index) => ({ method, index })).sort((left, right) => this.paymentMethodDisplayRank(left.method) - this.paymentMethodDisplayRank(right.method) || left.index - right.index).map(({ method }) => method);
  }
  paymentMethodDisplayRank(method) {
    if (this.paymentMethodExpired(method))
      return 2;
    return this.paymentMethodRequiresRetokenization(method) ? 1 : 0;
  }
  paymentMethodExpired(method) {
    if (`${method.status ?? ""}`.trim().toLowerCase() === "expired")
      return true;
    const year = Number(method.expiryYear);
    const month = Number(method.expiryMonth);
    if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12)
      return true;
    return Date.now() >= Date.UTC(year, month, 1);
  }
  async beginRegistration(replacesPaymentMethodId) {
    if (this.localMode || this.busyRef())
      return;
    this.busyRef.set(true);
    this.errorRef.set("");
    try {
      const registration = await this.paymentMethods.beginRegistration(this.activeUserId(), {
        replacesPaymentMethodId
      });
      this.trackRegistration(registration, true);
      this.revisionRef.update((value) => value + 1);
    } catch (error) {
      if (error instanceof Error && "error" in error) {
        this.deploymentConfiguration.applyPaymentProviderChangeResponse(error.error);
      }
      this.errorRef.set(this.errorKey(error, "payment.registration.error.start"));
    } finally {
      this.busyRef.set(false);
    }
  }
  startRegistrationPolling() {
    this.stopRegistrationPolling();
    this.registrationPoll = setTimeout(() => void this.refreshRegistration(), 1500);
  }
  async refreshRegistration() {
    const current = this.registrationRef();
    if (!current || this.registrationRefreshInFlight)
      return;
    this.registrationRefreshInFlight = true;
    try {
      const registration = await this.paymentMethods.refreshRegistration(this.activeUserId(), current.id);
      if (registration.status === "pending") {
        if (this.registrationExpired(current.expiresAtIso))
          this.finishRegistration("expired");
        return;
      }
      if (registration.status === "completed" && registration.paymentMethod) {
        this.loadedCardsById.set(registration.paymentMethod.id, __spreadValues({}, registration.paymentMethod));
        if (this.pickerMode()) {
          this.store.selectPickerPaymentMethod(registration.paymentMethod.id);
        }
      }
      this.finishRegistration(registration.status);
      if (registration.status === "completed") {
        this.errorRef.set("");
      } else if (registration.status === "cancelled") {
        this.errorRef.set("payment.registration.error.cancelled");
      } else if (registration.status === "expired") {
        this.errorRef.set("payment.registration.error.expired");
      } else {
        this.errorRef.set("payment.registration.error.failed");
      }
    } catch (error) {
      if (error instanceof Error && "error" in error) {
        this.deploymentConfiguration.applyPaymentProviderChangeResponse(error.error);
      }
      this.errorRef.set(this.errorKey(error, "payment.registration.error.status"));
      if (this.registrationExpired(current.expiresAtIso))
        this.finishRegistration("expired");
    } finally {
      this.registrationRefreshInFlight = false;
      if (this.registrationRef()?.id === current.id)
        this.startRegistrationPolling();
    }
  }
  closeRegistration() {
    this.registrationFrameOpenRef.set(false);
  }
  closeAll() {
    this.closeRegistration();
    this.cardsOpenRef.set(false);
    this.errorRef.set("");
    this.historyTotalsLoadedRef.set(false);
    this.spendingTotalsRef.set({});
    this.incomeTotalsRef.set({});
    this.store.close();
  }
  closeCards() {
    this.closeRegistration();
    if (this.pickerMode()) {
      this.closeAll();
    } else {
      this.cardsOpenRef.set(false);
    }
  }
  stopRegistrationPolling() {
    if (this.registrationPoll !== null) {
      clearTimeout(this.registrationPoll);
      this.registrationPoll = null;
    }
  }
  trackRegistration(registration, openFrame) {
    if (registration.status !== "pending") {
      this.finishRegistration(registration.status);
      return;
    }
    const paymentUrl = registration.paymentUrl?.trim() || "";
    if (!paymentUrl)
      throw new Error("payment.registration.error.page");
    const current = this.registrationRef();
    if (current?.id !== registration.id) {
      this.registrationRef.set({
        id: registration.id,
        url: paymentUrl,
        safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(paymentUrl),
        provider: registration.provider,
        expiresAtIso: registration.expiresAtIso,
        replacesPaymentMethodId: registration.replacesPaymentMethodId?.trim() || null
      });
      this.startRegistrationPolling();
    }
    if (openFrame)
      this.registrationFrameOpenRef.set(true);
  }
  finishRegistration(status) {
    this.stopRegistrationPolling();
    this.registrationFrameOpenRef.set(false);
    this.registrationRef.set(null);
    this.revisionRef.update((value) => value + 1);
    if (status === "expired") {
      this.errorRef.set("payment.registration.error.expired");
    }
  }
  registrationExpired(expiresAtIso) {
    const expiry = Date.parse(expiresAtIso);
    return Number.isFinite(expiry) && Date.now() >= expiry;
  }
  pendingPaymentMethod(registration) {
    return {
      id: `registration:${registration.id}`,
      provider: registration.provider,
      brand: "",
      last4: "",
      expiryMonth: 1,
      expiryYear: 2e3,
      cardholderName: "",
      artworkKey: "",
      artworkUrl: "",
      status: "registering",
      createdAtIso: "",
      updatedAtIso: ""
    };
  }
  activeUserId() {
    const userId = this.userProfileStore.activeUserId().trim();
    if (!userId)
      throw new Error("payment.error.user.required");
    return userId;
  }
  errorKey(error, fallback) {
    const message = error instanceof Error ? error.message.trim() : "";
    return message.startsWith("payment.") ? message : fallback;
  }
  origin(url) {
    try {
      return new URL(url, window.location.href).origin;
    } catch {
      return "";
    }
  }
  headerActionControl(trigger) {
    return { kind: "menu", id: trigger.id ?? "payment-header-action", trigger };
  }
  paymentStatusLabel(status) {
    const normalized = `${status ?? ""}`.trim().toLowerCase();
    return normalized ? this.i18n.translate(`payment.status.${normalized}`, status) : "";
  }
  paymentStatusTone(status) {
    switch (`${status ?? ""}`.trim().toLowerCase()) {
      case "failed":
      case "declined":
      case "expired":
        return "danger";
      case "captured":
      case "approved":
      case "succeeded":
      case "authorized":
        return "success";
      case "released":
      case "refunded":
        return "refund";
      default:
        return "neutral";
    }
  }
  isRefundedPaymentStatus(status) {
    const normalized = `${status ?? ""}`.trim().toLowerCase();
    return normalized === "released" || normalized === "refunded" || normalized === "partially_refunded";
  }
  historyHeaderTotals() {
    const stored = this.userProfileStore.activeUserProfile()?.paymentTotals;
    const loadedOutgoing = this.spendingTotalsRef();
    const loadedIncoming = this.incomeTotalsRef();
    const outgoing = this.historyTotalsLoadedRef() ? loadedOutgoing : stored?.outgoing ?? {};
    const incoming = this.historyTotalsLoadedRef() ? loadedIncoming : stored?.incoming ?? {};
    const currencies = [.../* @__PURE__ */ new Set([...Object.keys(outgoing), ...Object.keys(incoming)])].map((currency) => currency.trim().toUpperCase()).filter(Boolean).sort((left, right) => left.localeCompare(right));
    return (currencies.length > 0 ? currencies : ["HUF"]).flatMap((currency) => [
      {
        text: this.formatSignedCurrency(Number(outgoing[currency]) || 0, currency, "\u2212"),
        tone: "expense"
      },
      {
        text: this.formatSignedCurrency(Number(incoming[currency]) || 0, currency, "+"),
        tone: "income"
      }
    ]);
  }
  historyFilterControl() {
    const direction = this.historyDirectionRef();
    const labels = {
      all: "payment.history.filter.all",
      expenses: "payment.history.filter.expenses",
      income: "payment.history.filter.income"
    };
    const pendingRefundCount = this.pendingRefundCountRef();
    const items = ["all", "expenses", "income"].map((value) => ({
      id: `payment-history-${value}`,
      label: labels[value],
      icon: value === "all" ? "swap_vert" : value === "income" ? "south_west" : "north_east",
      kind: "radio",
      palette: value === "income" ? "green" : value === "expenses" ? "red" : "blue",
      active: value === direction,
      checked: value === direction,
      counter: value === "all" || value === "expenses" ? pendingRefundCount || void 0 : void 0,
      context: { action: "set-history-direction", direction: value }
    }));
    return {
      kind: "menu",
      id: "payment-history-filter",
      menuKind: "select",
      title: "payment.history.filter.title",
      trigger: {
        id: "payment-history-filter-trigger",
        label: labels[direction],
        icon: "filter_list",
        trailingIcon: "expand_more",
        counter: pendingRefundCount || void 0,
        palette: direction === "income" ? "green" : direction === "expenses" ? "red" : "blue",
        layout: "pill",
        ariaLabel: "payment.history.filter.title"
      },
      items,
      panelAlign: "end",
      closeOnSelect: true
    };
  }
  paymentHistoryMenuActions(item) {
    if (item.auditKind === "refund") {
      return item.canApproveRefund === true ? ["approveRefund"] : [];
    }
    const actions = ["paymentSummary"];
    if (item.direction === "expense" && `${item.recipientUserId ?? ""}`.trim()) {
      actions.push(item.serviceContext === "asset" ? "askAssetOwner" : "askOrganizer");
    }
    if (item.canRequestRefund === true)
      actions.push("requestRefund");
    if (item.canApproveRefund === true)
      actions.push("approveRefund");
    return actions;
  }
  confirmRefundRequest(item) {
    this.dialogStore.open({
      title: "payment.history.refund.request.title",
      message: this.refundConfirmationMessage(item, "payment.history.refund.request.message"),
      cancelLabel: "cancel",
      confirmLabel: "payment.history.refund.request",
      confirmTone: "warning",
      failureMessage: "payment.history.refund.request.error",
      onConfirm: async () => this.applyPaymentHistoryMutation(await this.paymentMethods.requestRefund(this.activeUserId(), item.id))
    });
  }
  confirmRefundApproval(item) {
    this.dialogStore.open({
      title: "payment.history.refund.approve.title",
      message: this.refundConfirmationMessage(item, "payment.history.refund.approve.message"),
      cancelLabel: "cancel",
      confirmLabel: "payment.history.refund.approve",
      confirmTone: "accent",
      failureMessage: "payment.history.refund.approve.error",
      onConfirm: async () => this.applyPaymentHistoryMutation(await this.paymentMethods.approveRefund(this.activeUserId(), item.id))
    });
  }
  refundConfirmationMessage(item, leadKey) {
    const preview = item.refundPreview;
    if (!preview)
      return this.i18n.translate(leadKey);
    const currency = preview.currency || item.currency || "HUF";
    return [
      this.i18n.translate(leadKey),
      this.i18n.translateParams("payment.history.refund.preview.amount", {
        amount: this.formatSignedCurrency(preview.refundableAmount, currency, "+")
      }),
      this.i18n.translateParams("payment.history.refund.preview.retained", {
        amount: this.formatSignedCurrency(preview.retainedAmount, currency, "\u2212")
      }),
      this.refundPolicyBasis(item)
    ].filter(Boolean).join("\n");
  }
  refundPolicyBasis(item) {
    const preview = item.refundPreview;
    if (preview?.ruleId === "assignment-manager-takeover") {
      return this.i18n.translate("payment.history.refund.preview.takeover");
    }
    if (!preview?.ruleId) {
      return preview?.ruleDescription || this.i18n.translate("payment.history.refund.preview.no.policy");
    }
    const currency = preview.currency || item.currency || "HUF";
    const refund = preview.refundKind === "full" ? this.i18n.translate("payment.history.refund.preview.full") : preview.refundKind === "fixed_amount" ? this.formatSignedCurrency(Number(preview.refundValue) || 0, currency, "+") : preview.refundKind === "none" ? this.i18n.translate("payment.history.refund.preview.none") : this.i18n.translateParams("payment.history.refund.preview.percent", {
      percent: Number(preview.refundValue) || 0
    });
    return this.i18n.translateParams("payment.history.refund.preview.policy", {
      refund,
      offset: Math.max(0, Number(preview.ruleOffsetValue) || 0),
      unit: this.i18n.translate(`payment.history.refund.preview.unit.${preview.ruleOffsetUnit || "days"}`)
    });
  }
  applyPaymentHistoryMutation(mutation) {
    const userId = this.activeUserId();
    const pendingRefundCount = Math.max(0, Math.trunc(Number(mutation.pendingRefundCount) || 0));
    this.spendingTotalsRef.set(__spreadValues({}, mutation.spendingTotals));
    this.incomeTotalsRef.set(__spreadValues({}, mutation.incomeTotals));
    this.historyTotalsLoadedRef.set(true);
    this.pendingRefundCountRef.set(pendingRefundCount);
    this.activityStore.patchUserCounterOverrides(userId, { paymentRefundsPending: pendingRefundCount });
    this.userProfileStore.patchActiveUserProfile((current) => ({
      paymentTotals: {
        outgoing: __spreadValues({}, mutation.spendingTotals),
        incoming: __spreadValues({}, mutation.incomeTotals),
        all: this.mergePaymentTotals(mutation.spendingTotals, mutation.incomeTotals)
      },
      activities: __spreadProps(__spreadValues({}, current.activities), {
        paymentRefundsPending: pendingRefundCount
      })
    }));
    this.revisionRef.update((value) => value + 1);
  }
  mergePaymentTotals(spending, income) {
    const currencies = /* @__PURE__ */ new Set([...Object.keys(spending), ...Object.keys(income)]);
    return Object.fromEntries([...currencies].map((currency) => [
      currency,
      Math.round(((Number(spending[currency]) || 0) + (Number(income[currency]) || 0)) * 100) / 100
    ]));
  }
  async openPaymentServiceChat(item) {
    const activeUserId = this.activeUserId();
    const targetUserId = `${item.recipientUserId ?? ""}`.trim();
    const serviceContext = item.serviceContext === "asset" ? "asset" : "event";
    let eventId = `${item.contextEventId ?? (serviceContext === "event" ? item.sourceId : "")}`.trim();
    let subEventId = `${item.contextSubEventId ?? ""}`.trim();
    const assetId = `${item.contextAssetId ?? (serviceContext === "asset" ? item.sourceId : "")}`.trim();
    let title = item.sourceId;
    let assetCard = null;
    if (serviceContext === "asset") {
      assetCard = await this.findPaymentAsset(activeUserId, assetId);
      title = assetCard?.title ?? item.sourceId;
      if (!eventId || !subEventId) {
        const request = (assetCard?.requests ?? []).find((candidate) => `${candidate.userId ?? ""}`.trim() === activeUserId && (!item.checkoutSessionId || candidate.booking?.paymentSessionId === item.checkoutSessionId));
        eventId = `${request?.booking?.eventId ?? eventId}`.trim();
        subEventId = `${request?.booking?.subEventId ?? subEventId}`.trim();
      }
    } else {
      title = item.sourceId;
    }
    if (!activeUserId || !targetUserId || targetUserId === activeUserId || !eventId || serviceContext === "asset" && (!assetId || !subEventId)) {
      this.errorRef.set("payment.history.ask.owner.error");
      return;
    }
    if (serviceContext === "event") {
      await this.users.warmCachedUsers([targetUserId]);
    }
    const activeUser = this.userProfileStore.activeUserProfile() ?? this.users.peekCachedUserById(activeUserId);
    const targetUser = serviceContext === "asset" ? null : this.users.peekCachedUserById(targetUserId);
    const chat = {
      id: serviceContext === "asset" ? `c-service-asset-${assetId}-${subEventId}-${activeUserId}` : `c-service-event-${eventId}-${activeUserId}`,
      avatar: targetUserId.slice(0, 2).toUpperCase(),
      title: serviceContext === "asset" ? `Ask Asset Owner \xB7 ${title}` : `Contact Organizer \xB7 ${title}`,
      lastMessage: serviceContext === "asset" ? `Service chat with the asset owner for ${title}.` : `Service chat with the organizer for ${title}.`,
      lastSenderId: targetUserId,
      memberIds: [activeUserId, targetUserId],
      members: ChatPopupHeaderContextConverter.memberSummaries([
        { id: activeUserId, user: activeUser },
        {
          id: targetUserId,
          user: targetUser,
          fallbackName: serviceContext === "asset" ? assetCard?.ownerName || "Asset owner" : "Organizer",
          imageUrl: serviceContext === "asset" ? assetCard?.ownerAvatarUrl : null
        }
      ]),
      unread: 0,
      dateIso: (/* @__PURE__ */ new Date()).toISOString(),
      channelType: "serviceEvent",
      serviceContext,
      assetId: serviceContext === "asset" ? assetId : void 0,
      ownerId: serviceContext === "asset" ? assetId : eventId,
      ownerUserId: activeUserId,
      eventId,
      subEventId: subEventId || void 0
    };
    await this.activities.ensureEventChatPopupLoaded();
    this.activities.openStackedEventChat(__spreadProps(__spreadValues({}, eventChatPopupRequestFromChat(chat)), { parentZIndex: 22200 }), eventChatHeaderStateFromChat(chat));
  }
  formatSignedCurrency(amount, currency, sign) {
    const normalizedCurrency = `${currency ?? ""}`.trim().toUpperCase() || "HUF";
    const currencyFormatter = new Intl.NumberFormat(void 0, {
      style: "currency",
      currency: normalizedCurrency
    });
    const digits = currencyFormatter.resolvedOptions().maximumFractionDigits;
    const value = new Intl.NumberFormat(void 0, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    }).format(Math.abs(Number(amount) || 0));
    return `${normalizedCurrency} ${sign}${value}`;
  }
  async openPaymentSummary(item) {
    this.errorRef.set("");
    const userId = this.activeUserId();
    let paymentMethod = null;
    try {
      paymentMethod = await this.paymentMethodForHistoryItem(userId, item);
    } catch {
    }
    if (item.fulfillmentKind === "client") {
      await this.openAssetPaymentSummary(item, paymentMethod);
      return;
    }
    try {
      await this.activities.ensureActivitiesPopupLoaded();
      const detail = await this.events.loadEventDetailById(userId, item.sourceId);
      const record = detail ? detail : await this.events.queryKnownRecordById(userId, item.sourceId);
      if (!record) {
        this.errorRef.set("payment.summary.error.source.unavailable");
        return;
      }
      this.eventCheckoutDialog.open({
        mode: "join",
        userId,
        record,
        readOnlySummary: true,
        preloadedCheckoutBasket: await this.paymentSummaryBasket(userId, item, record.title),
        paymentMethod,
        paymentProvider: item.provider,
        paymentStatusLabel: this.paymentStatusLabel(item.status),
        paymentStatusTone: this.paymentStatusTone(item.status),
        paymentNote: this.paymentHistoryNote(item),
        title: "event.checkout.payment.summary",
        subtitle: record.timeframe,
        failureMessage: this.i18n.translate("payment.summary.error.open"),
        onSubmit: () => void 0
      });
    } catch {
      this.errorRef.set("payment.summary.error.open");
    }
  }
  async openAssetPaymentSummary(item, paymentMethod) {
    this.errorRef.set("");
    const userId = this.activeUserId();
    try {
      const card = await this.findPaymentAsset(userId, item.sourceId);
      if (!card) {
        this.errorRef.set("payment.summary.error.asset.unavailable");
        return;
      }
      const request = (card.requests ?? []).find((candidate) => `${candidate.userId ?? ""}`.trim() === userId && (!item.checkoutSessionId || `${candidate.booking?.paymentSessionId ?? ""}`.trim() === item.checkoutSessionId)) ?? (card.requests ?? []).find((candidate) => `${candidate.userId ?? ""}`.trim() === userId) ?? null;
      const audit = item.checkoutSessionId ? await this.events.loadCheckoutPaymentAudit(userId, card.id, item.checkoutSessionId) : null;
      const startAtIso = `${audit?.bookingStartAtIso ?? request?.booking?.startAtIso ?? item.createdAtIso}`.trim();
      const endAtIso = `${audit?.bookingEndAtIso ?? request?.booking?.endAtIso ?? startAtIso}`.trim();
      const quantity = Math.max(1, Math.trunc(Number(audit?.bookingQuantity ?? request?.booking?.quantity) || 1));
      const currency = `${audit?.currency ?? item.currency ?? "USD"}`.trim() || "USD";
      const rows = audit?.pricingSummaryRows?.length ? audit.pricingSummaryRows.map((row) => __spreadValues({}, row)) : audit?.lineItems?.length ? audit.lineItems.map((line, index) => ({
        key: `payment-history-${line.id || index}`,
        label: line.label,
        detail: line.detail,
        amount: line.amount,
        currency: line.currency,
        multiplier: null
      })) : [{
        key: `payment-history-${item.id}`,
        label: card.title,
        detail: request?.booking?.timeframe ?? null,
        amount: item.amount,
        currency,
        multiplier: null
      }];
      await this.assetPopup.ensureAssetPopupLoaded();
      this.assetStore.openAssetEditorEdit({
        cardId: card.id,
        form: AssetCardBuilder.buildAssetFormFromCard(card),
        visibility: AssetCardBuilder.visibilityFromCard(card),
        loading: false,
        readOnly: true,
        runtimeAssignment: {
          quantity,
          quantityMax: quantity,
          quantityLabel: this.i18n.translate("quantity"),
          quantityDescription: request?.booking?.timeframe ?? void 0,
          editable: false
        },
        checkout: {
          sourceId: card.id,
          mode: "payment-summary",
          phase: "payment",
          cancellationPolicy: audit?.cancellationPolicy ?? null,
          refundPreview: audit?.refundPreview ?? item.refundPreview ?? null,
          refundPolicyUnavailable: !audit,
          title: this.i18n.translate("event.checkout.payment.summary"),
          subtitle: card.title,
          dateRange: { startAt: startAtIso, endAt: endAtIso, precision: "minute" },
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
            rows,
            totalAmount: Number(audit?.amount ?? item.amount) || 0,
            currency
          },
          acceptedPolicyIds: [...request?.booking?.acceptedPolicyIds ?? []],
          footerItems: [],
          busy: false,
          error: null,
          paymentProvider: item.provider,
          paymentProviderLabel: "event.editor.payment.recorded",
          paymentStatusLabel: audit?.auditKind === "booking_price_revision" ? "event.editor.payment.recorded.revised" : this.paymentStatusLabel(audit?.status ?? item.status),
          paymentStatusTone: this.paymentStatusTone(audit?.status ?? item.status),
          paymentNote: this.paymentHistoryNote(item),
          paymentMethod
        }
      });
    } catch {
      this.errorRef.set("payment.summary.error.open");
    }
  }
  async paymentMethodForHistoryItem(userId, item) {
    if (item.paymentMethod) {
      return __spreadValues({}, item.paymentMethod);
    }
    const paymentMethodId = `${item.paymentMethodId ?? ""}`.trim();
    if (!paymentMethodId) {
      throw new Error("payment.summary.error.method.unavailable");
    }
    const cached = this.loadedCardsById.get(paymentMethodId);
    if (cached) {
      return __spreadValues({}, cached);
    }
    const page = await this.paymentMethods.queryPage(userId, {
      page: 0,
      pageSize: 6,
      sort: "createdAt",
      direction: "desc"
    });
    page.items.forEach((method2) => this.loadedCardsById.set(method2.id, __spreadValues({}, method2)));
    const method = this.loadedCardsById.get(paymentMethodId);
    if (!method) {
      throw new Error("payment.summary.error.method.unavailable");
    }
    return __spreadValues({}, method);
  }
  paymentHistoryNote(item) {
    const failureReason = `${item.failureReason ?? ""}`.trim();
    if (item.status.trim().toLowerCase() === "failed" && failureReason)
      return failureReason;
    if (!this.isRefundedPaymentStatus(item.status) || !item.refundPreview)
      return "";
    const preview = item.refundPreview;
    return [
      this.i18n.translateParams("payment.history.refund.preview.amount", {
        amount: this.formatSignedCurrency(preview.refundableAmount, preview.currency || item.currency || "HUF", "+")
      }),
      this.refundPolicyBasis(item)
    ].filter(Boolean).join("\n");
  }
  async findPaymentAsset(userId, sourceId) {
    const normalizedSourceId = sourceId.trim();
    if (!normalizedSourceId)
      return null;
    const cached = this.assets.peekOwnedAssetById(userId, normalizedSourceId);
    if (cached)
      return cached;
    const detail = await this.assets.loadOwnedAssetDetailById(userId, normalizedSourceId);
    if (detail)
      return detail;
    const visibleByType = await Promise.all(ASSET_TYPES.map((type) => this.assets.queryVisibleAssets({ userId, type })));
    const visible = visibleByType.flat().find((card) => card.id === normalizedSourceId) ?? null;
    if (!visible)
      return null;
    return await this.assets.loadOwnedAssetDetailById(userId, visible.id) ?? visible;
  }
  async paymentSummaryBasket(userId, item, fallbackLabel) {
    const audit = item.checkoutSessionId ? await this.events.loadCheckoutPaymentAudit(userId, item.sourceId, item.checkoutSessionId) : null;
    const currency = `${audit?.currency ?? item.currency ?? "USD"}`.trim() || "USD";
    const amount = Number(audit?.amount ?? item.amount) || 0;
    const items = audit?.basketItems?.length ? audit.basketItems.map((basketItem) => __spreadValues({}, basketItem)) : [{
      id: `payment-history-${item.id}`,
      kind: "event",
      sourceId: item.sourceId,
      label: fallbackLabel,
      detail: "",
      amount,
      currency,
      quantity: 1,
      status: "confirmed",
      resultState: item.status === "failed" ? "failed" : "succeeded",
      pricingSummaryRows: audit?.pricingSummaryRows?.map((row) => __spreadValues({}, row)) ?? [],
      checkoutSessionId: item.checkoutSessionId ?? null,
      createdAtIso: item.createdAtIso
    }];
    return {
      userId,
      sourceId: item.sourceId,
      status: "confirmed",
      items,
      pricingSummaryRows: audit?.pricingSummaryRows?.map((row) => __spreadValues({}, row)) ?? [],
      lineItems: audit?.lineItems?.map((line) => __spreadValues({}, line)) ?? [],
      totalAmount: amount,
      currency,
      checkoutSessionId: item.checkoutSessionId ?? null,
      appliedPromoCodes: []
    };
  }
  ngOnDestroy() {
    this.stopRegistrationPolling();
  }
  static \u0275fac = function PaymentMethodsPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PaymentMethodsPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PaymentMethodsPopupComponent, selectors: [["app-payment-methods-popup"]], hostBindings: function PaymentMethodsPopupComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("message", function PaymentMethodsPopupComponent_message_HostBindingHandler($event) {
        return ctx.onProviderMessage($event);
      }, \u0275\u0275resolveWindow);
    }
  }, decls: 3, vars: 3, consts: [["paymentHistoryTemplate", ""], ["paymentCardTemplate", ""], [3, "model", "zIndex"], [1, "payment-methods-popup__body"], ["role", "alert", 1, "payment-methods-popup__error"], [1, "payment-methods-popup__list", 3, "menuItemSelect", "config", "loadPage", "query", "itemTemplate"], [1, "payment-methods-popup__history-totals"], [1, "payment-methods-popup__history-total", 3, "payment-methods-popup__history-total--expense", "payment-methods-popup__history-total--income"], [1, "payment-methods-popup__history-total"], [3, "menuRequest", "row", "useSharedMenu"], [3, "cardSelect", "menuRequest", "card", "selectable", "showMenu"], [1, "payment-methods-popup__provider-shell"], [1, "payment-methods-popup__provider-brand"], [3, "src", "alt"], ["referrerpolicy", "strict-origin-when-cross-origin", "allow", "payment", 1, "payment-methods-popup__provider-frame", 3, "src", "title"]], template: function PaymentMethodsPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, PaymentMethodsPopupComponent_Conditional_0_Template, 1, 1);
      \u0275\u0275conditionalCreate(1, PaymentMethodsPopupComponent_Conditional_1_Template, 6, 7, "app-popup", 2);
      \u0275\u0275conditionalCreate(2, PaymentMethodsPopupComponent_Conditional_2_Template, 6, 8, "app-popup", 2);
    }
    if (rf & 2) {
      let tmp_2_0;
      \u0275\u0275conditional(ctx.store.isOpen() ? 0 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.store.isOpen() && (ctx.pickerMode() || ctx.cardsOpen()) ? 1 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_2_0 = ctx.registrationFrameOpen() && ctx.registration()) ? 2 : -1, tmp_2_0);
    }
  }, dependencies: [PopupComponent, SmartListComponent, PaymentCardComponent, SingleRowComponent, I18nPipe], styles: ["\n[_nghost-%COMP%] {\n  display: contents;\n}\n.payment-methods-popup__body[_ngcontent-%COMP%] {\n  height: 100%;\n  min-height: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 0.65rem;\n}\n.payment-methods-popup__list[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  min-height: 0;\n  height: 100%;\n}\n.payment-methods-popup__history-totals[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  flex-wrap: wrap;\n  gap: 0.4rem;\n  min-height: 1.9rem;\n  font-size: 0.82rem;\n  font-weight: 900;\n}\n.payment-methods-popup__history-total[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  min-height: 1.8rem;\n  padding: 0.2rem 0.62rem;\n  border: 1px solid currentColor;\n  border-radius: 999px;\n  white-space: nowrap;\n}\n.payment-methods-popup__history-total--expense[_ngcontent-%COMP%] {\n  color: #c4313c;\n  background: #fff1f2;\n}\n.payment-methods-popup__history-total--income[_ngcontent-%COMP%] {\n  color: #16845b;\n  background: #edf9f3;\n}\n.payment-methods-popup__error[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 0.68rem 0.8rem;\n  border: 1px solid rgba(180, 35, 24, 0.22);\n  border-radius: 0.7rem;\n  background: #fff1f0;\n  color: #a82c22;\n  font-size: 0.8rem;\n  font-weight: 700;\n}\n.payment-methods-popup__provider-shell[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-rows: auto minmax(0, 1fr);\n  width: 100%;\n  height: 100%;\n  min-height: 0;\n}\n.payment-methods-popup__provider-brand[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 3rem;\n  padding: 0.6rem 1rem;\n  border-bottom: 1px solid rgba(67, 91, 132, 0.14);\n  background: #fff;\n}\n.payment-methods-popup__provider-brand[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  display: block;\n  width: auto;\n  max-width: 7.5rem;\n  height: 1.8rem;\n  object-fit: contain;\n}\n.payment-methods-popup__provider-frame[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 100%;\n  min-height: 0;\n  border: 0;\n  background: #f5f7fb;\n}\n[_nghost-%COMP%]     .payment-method-card-list .smart-list__list {\n  align-content: start;\n}\n[_nghost-%COMP%]     .payment-history-status-badge--success {\n  border-color: #16845b;\n  background: #ccefdc;\n  color: #0e633f;\n  box-shadow: 0 5px 12px rgba(22, 132, 91, 0.16);\n}\n[_nghost-%COMP%]     .payment-history-status-badge--danger {\n  border-color: #c4313c;\n  background: #ffd6da;\n  color: #9f1f2b;\n  box-shadow: 0 5px 12px rgba(196, 49, 60, 0.16);\n}\n[_nghost-%COMP%]     .payment-history-status-badge--refunded {\n  border-color: #6d5bd0;\n  background: #e5dfff;\n  color: #4c3ca7;\n  box-shadow: 0 5px 12px rgba(109, 91, 208, 0.18);\n}\n[_nghost-%COMP%]     .payment-history-avatar {\n  border: 1px solid rgba(255, 255, 255, 0.82);\n  box-shadow: 0 4px 11px rgba(31, 54, 88, 0.16);\n}\n[_nghost-%COMP%]     .ui-single-row__avatar.payment-history-avatar--expense {\n  background:\n    linear-gradient(\n      180deg,\n      #ef6472 0%,\n      #c4313c 100%);\n}\n[_nghost-%COMP%]     .ui-single-row__avatar.payment-history-avatar--income {\n  background:\n    linear-gradient(\n      180deg,\n      #3db981 0%,\n      #16845b 100%);\n}\n[_nghost-%COMP%]     .ui-single-row__avatar.payment-history-avatar--failed {\n  background:\n    linear-gradient(\n      180deg,\n      #dc4050 0%,\n      #991f2b 100%);\n}\n[_nghost-%COMP%]     .payment-history-avatar--refunded {\n  background:\n    linear-gradient(\n      180deg,\n      #8b78e8 0%,\n      #5a48bd 100%);\n}\n/*# sourceMappingURL=payment-methods-popup.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PaymentMethodsPopupComponent, [{
    type: Component,
    args: [{ selector: "app-payment-methods-popup", standalone: true, imports: [PopupComponent, SmartListComponent, PaymentCardComponent, SingleRowComponent, I18nPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `@if (store.isOpen()) {
  @if (!pickerMode()) {
  <app-popup [model]="mainPopupModel()" [zIndex]="22200">
    <section class="payment-methods-popup__body">
      @if (error()) {
        <p class="payment-methods-popup__error" role="alert">{{ error() | i18n }}</p>
      }
      @if (historyHeaderTotals(); as totals) {
        @if (totals.length) {
          <div class="payment-methods-popup__history-totals" [attr.aria-label]="'payment.history.totals' | i18n">
            @for (total of totals; track total.tone + ':' + total.text) {
              <span
                class="payment-methods-popup__history-total"
                [class.payment-methods-popup__history-total--expense]="total.tone === 'expense'"
                [class.payment-methods-popup__history-total--income]="total.tone === 'income'"
              >{{ total.text }}</span>
            }
          </div>
        }
      }
      <app-smart-list
        class="payment-methods-popup__list"
        [config]="allHistoryListConfig"
        [loadPage]="loadAllHistory"
        [query]="allHistoryQuery()"
        [itemTemplate]="paymentHistoryTemplate"
        (menuItemSelect)="onPaymentHistoryMenuSelect($event)"
      ></app-smart-list>
      <ng-template #paymentHistoryTemplate let-item let-openMenu="openMenu">
        <single-row
          [row]="historyRow(item, true)"
          [useSharedMenu]="true"
          (menuRequest)="openMenu($event)"
        ></single-row>
      </ng-template>
    </section>
  </app-popup>
  }
}

@if (store.isOpen() && (pickerMode() || cardsOpen())) {
  <app-popup [model]="cardsPopupModel()" [zIndex]="22400">
    <section class="payment-methods-popup__body">
      @if (error()) {
        <p class="payment-methods-popup__error" role="alert">{{ error() | i18n }}</p>
      }
      <app-smart-list
        class="payment-methods-popup__list"
        [config]="cardListConfig"
        [loadPage]="loadCards"
        [query]="query()"
        [itemTemplate]="paymentCardTemplate"
        (menuItemSelect)="onCardMenuSelect($event)"
      ></app-smart-list>
      <ng-template #paymentCardTemplate let-method let-openMenu="openMenu">
        <app-payment-card
          [card]="paymentCard(method)"
          [selectable]="pickerMode()"
          [showMenu]="true"
          (cardSelect)="selectCard(method, $event)"
          (menuRequest)="openMenu($event)"
        ></app-payment-card>
      </ng-template>
    </section>
  </app-popup>
}

@if (registrationFrameOpen() && registration(); as providerRegistration) {
  <app-popup [model]="registrationPopupModel()" [zIndex]="22800">
    <section class="payment-methods-popup__provider-shell">
      <div class="payment-methods-popup__provider-brand">
        <img
          [src]="registrationProviderLogo(providerRegistration.provider)"
          [alt]="registrationProviderLabel(providerRegistration.provider)"
        />
      </div>
      <iframe
        class="payment-methods-popup__provider-frame"
        [src]="providerRegistration.safeUrl"
        [title]="'payment.registration.frame.title' | i18n"
        referrerpolicy="strict-origin-when-cross-origin"
        allow="payment"
      ></iframe>
    </section>
  </app-popup>
}
`, styles: ["/* src/app/shared/ui/components/payment-methods-popup/payment-methods-popup.component.scss */\n:host {\n  display: contents;\n}\n.payment-methods-popup__body {\n  height: 100%;\n  min-height: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 0.65rem;\n}\n.payment-methods-popup__list {\n  flex: 1 1 auto;\n  min-height: 0;\n  height: 100%;\n}\n.payment-methods-popup__history-totals {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  flex-wrap: wrap;\n  gap: 0.4rem;\n  min-height: 1.9rem;\n  font-size: 0.82rem;\n  font-weight: 900;\n}\n.payment-methods-popup__history-total {\n  display: inline-flex;\n  align-items: center;\n  min-height: 1.8rem;\n  padding: 0.2rem 0.62rem;\n  border: 1px solid currentColor;\n  border-radius: 999px;\n  white-space: nowrap;\n}\n.payment-methods-popup__history-total--expense {\n  color: #c4313c;\n  background: #fff1f2;\n}\n.payment-methods-popup__history-total--income {\n  color: #16845b;\n  background: #edf9f3;\n}\n.payment-methods-popup__error {\n  margin: 0;\n  padding: 0.68rem 0.8rem;\n  border: 1px solid rgba(180, 35, 24, 0.22);\n  border-radius: 0.7rem;\n  background: #fff1f0;\n  color: #a82c22;\n  font-size: 0.8rem;\n  font-weight: 700;\n}\n.payment-methods-popup__provider-shell {\n  display: grid;\n  grid-template-rows: auto minmax(0, 1fr);\n  width: 100%;\n  height: 100%;\n  min-height: 0;\n}\n.payment-methods-popup__provider-brand {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 3rem;\n  padding: 0.6rem 1rem;\n  border-bottom: 1px solid rgba(67, 91, 132, 0.14);\n  background: #fff;\n}\n.payment-methods-popup__provider-brand img {\n  display: block;\n  width: auto;\n  max-width: 7.5rem;\n  height: 1.8rem;\n  object-fit: contain;\n}\n.payment-methods-popup__provider-frame {\n  display: block;\n  width: 100%;\n  height: 100%;\n  min-height: 0;\n  border: 0;\n  background: #f5f7fb;\n}\n:host ::ng-deep .payment-method-card-list .smart-list__list {\n  align-content: start;\n}\n:host ::ng-deep .payment-history-status-badge--success {\n  border-color: #16845b;\n  background: #ccefdc;\n  color: #0e633f;\n  box-shadow: 0 5px 12px rgba(22, 132, 91, 0.16);\n}\n:host ::ng-deep .payment-history-status-badge--danger {\n  border-color: #c4313c;\n  background: #ffd6da;\n  color: #9f1f2b;\n  box-shadow: 0 5px 12px rgba(196, 49, 60, 0.16);\n}\n:host ::ng-deep .payment-history-status-badge--refunded {\n  border-color: #6d5bd0;\n  background: #e5dfff;\n  color: #4c3ca7;\n  box-shadow: 0 5px 12px rgba(109, 91, 208, 0.18);\n}\n:host ::ng-deep .payment-history-avatar {\n  border: 1px solid rgba(255, 255, 255, 0.82);\n  box-shadow: 0 4px 11px rgba(31, 54, 88, 0.16);\n}\n:host ::ng-deep .ui-single-row__avatar.payment-history-avatar--expense {\n  background:\n    linear-gradient(\n      180deg,\n      #ef6472 0%,\n      #c4313c 100%);\n}\n:host ::ng-deep .ui-single-row__avatar.payment-history-avatar--income {\n  background:\n    linear-gradient(\n      180deg,\n      #3db981 0%,\n      #16845b 100%);\n}\n:host ::ng-deep .ui-single-row__avatar.payment-history-avatar--failed {\n  background:\n    linear-gradient(\n      180deg,\n      #dc4050 0%,\n      #991f2b 100%);\n}\n:host ::ng-deep .payment-history-avatar--refunded {\n  background:\n    linear-gradient(\n      180deg,\n      #8b78e8 0%,\n      #5a48bd 100%);\n}\n/*# sourceMappingURL=payment-methods-popup.component.css.map */\n"] }]
  }], null, { onProviderMessage: [{
    type: HostListener,
    args: ["window:message", ["$event"]]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PaymentMethodsPopupComponent, { className: "PaymentMethodsPopupComponent", filePath: "app/shared/ui/components/payment-methods-popup/payment-methods-popup.component.ts", lineNumber: 71 });
})();
export {
  PaymentMethodsPopupComponent
};
//# sourceMappingURL=payment-methods-popup.component-WVB6J3RB.js.map
