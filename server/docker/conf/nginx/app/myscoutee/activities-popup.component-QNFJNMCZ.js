import {
  EventPromoCodePopupStore
} from "./chunk-U44VYF5W.js";
import {
  EventCheckoutDialogStore,
  EventCheckoutDraftStore,
  EventCheckoutSlotPickerStore,
  EventEditorPopupStore,
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
  ActivitiesPopupStore,
  AssetStore,
  ProfileStore,
  eventChatHeaderStateFromChat,
  eventChatPopupRequestFromChat
} from "./chunk-AELPOWOL.js";
import {
  SmartListComponent
} from "./chunk-IJVUZ62I.js";
import "./chunk-2RBWDI2Q.js";
import "./chunk-XIFXW5X2.js";
import "./chunk-2K5TOPNO.js";
import "./chunk-654Z7UJY.js";
import "./chunk-H3IGIWEC.js";
import "./chunk-RRRWUAB3.js";
import {
  ActivityChatSingleRowConverter,
  ActivityEventInfoCardConverter,
  ActivityEventInfoCardMenuConverter,
  ActivityRateImageCardConverter,
  ActivityRateMenuConverter,
  ActivityRateMenuSelectionConverter,
  ActivityRatePairCardConverter,
  ActivityRateSingleCardConverter,
  isActivityRatePairCardRow
} from "./chunk-EWJPTHFE.js";
import "./chunk-RJSPRCFL.js";
import {
  PairCardComponent,
  SingleCardComponent,
  SingleRowComponent
} from "./chunk-BEAS7CFC.js";
import "./chunk-EGWJQCT5.js";
import {
  InfoCardComponent,
  UiPollCoordinator,
  UiTaskScheduler
} from "./chunk-YTMD6HU4.js";
import "./chunk-4VYYFWRA.js";
import "./chunk-QEZI4ZBE.js";
import "./chunk-MEY2M2U3.js";
import "./chunk-ZBJCMF52.js";
import {
  MatButtonModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  PopupComponent
} from "./chunk-3VXLUVWM.js";
import {
  MatNativeDateModule
} from "./chunk-VEYRCVMX.js";
import "./chunk-MVR37RGJ.js";
import {
  AppMenuDispatcher,
  FormsModule,
  I18nPipe,
  IndicatorComponent
} from "./chunk-FOAFZS65.js";
import "./chunk-OAYWPJGG.js";
import {
  DialogStore
} from "./chunk-6TR3Z2F3.js";
import "./chunk-U46O4F4Y.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-EDHGCWPF.js";
import "./chunk-CUDLB52K.js";
import "./chunk-4WZBG7IG.js";
import "./chunk-ZJ74HL3J.js";
import {
  ActivitiesService,
  ActivityMembersService,
  ActivityResourcesService,
  ChatsService,
  ExplanationGuideService,
  RatesService
} from "./chunk-QE3AUXWT.js";
import {
  EventsService,
  ShareTokensService
} from "./chunk-2LVO4Z3J.js";
import "./chunk-PK4DOAMC.js";
import {
  AppRuntimeStore,
  UsersService,
  resolveActivityRateOrder
} from "./chunk-4M7S3PHB.js";
import "./chunk-5PHTFUHA.js";
import {
  APP_STATIC_DATA,
  ActivityMembersBuilder,
  PricingBuilder
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
  ActivityEventDetailDTO,
  EVENT_CHECKOUT_PROMO_CODE_INVALID_MESSAGE_KEY
} from "./chunk-6POEHVT7.js";
import "./chunk-2ENBQWLU.js";
import "./chunk-LERGHE7K.js";
import {
  HttpErrorResponse
} from "./chunk-D6ZHKNYF.js";
import "./chunk-SKAK727J.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
  environment,
  from,
  inject,
  setClassMetadata,
  signal,
  untracked,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵcomponentInstance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdeclareLet,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵreadContextLet,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵresolveDocument,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵstoreLet,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵviewQuery
} from "./chunk-XJL7SWH7.js";

// src/app/activity/components/event-checkout-popup/event-promo-code-popup/event-promo-code-popup.component.ts
function EventPromoCodePopupComponent_Conditional_0_Conditional_4_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "single-row", 6);
    \u0275\u0275listener("menuAction", function EventPromoCodePopupComponent_Conditional_0_Conditional_4_For_2_Template_single_row_menuAction_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onPromoCodeMenuAction($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r3 = ctx.$implicit;
    \u0275\u0275property("row", row_r3);
  }
}
function EventPromoCodePopupComponent_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3);
    \u0275\u0275repeaterCreate(1, EventPromoCodePopupComponent_Conditional_0_Conditional_4_For_2_Template, 1, 1, "single-row", 5, \u0275\u0275componentInstance().trackPromoCode, true);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const rows_r4 = \u0275\u0275readContextLet(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(rows_r4);
  }
}
function EventPromoCodePopupComponent_Conditional_0_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "mat-icon");
    \u0275\u0275text(2, "local_offer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 1, "event.checkout.promo.empty"));
  }
}
function EventPromoCodePopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-popup", 0)(1, "div", 1);
    \u0275\u0275declareLet(2);
    \u0275\u0275elementStart(3, "section", 2);
    \u0275\u0275conditionalCreate(4, EventPromoCodePopupComponent_Conditional_0_Conditional_4_Template, 3, 0, "div", 3)(5, EventPromoCodePopupComponent_Conditional_0_Conditional_5_Template, 6, 3, "div", 4);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.popupModel())("zIndex", ctx_r1.popupZIndex());
    \u0275\u0275advance(2);
    const rows_r5 = \u0275\u0275storeLet(ctx_r1.promoCodeRows());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(rows_r5.length > 0 ? 4 : 5);
  }
}
function EventPromoCodePopupComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-popup", 0)(1, "div", 7);
    \u0275\u0275element(2, "app-indicator", 8);
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.addPopupLoadingModel())("zIndex", ctx_r1.addPopupZIndex());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 3, "event.checkout.promo.add.loading"));
  }
}
function EventPromoCodePopupComponent_Conditional_2_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function EventPromoCodePopupComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, EventPromoCodePopupComponent_Conditional_2_ng_container_0_Template, 1, 0, "ng-container", 9);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("ngComponentOutlet", ctx)("ngComponentOutletInputs", ctx_r1.addPopupOutletInputs());
  }
}
var EventPromoCodePopupComponent = class _EventPromoCodePopupComponent {
  static ownerSequence = 0;
  open = false;
  availablePromoCodes = [];
  appliedPromoCodes = [];
  validatePromoCode = null;
  closeSelect = new EventEmitter();
  addSelect = new EventEmitter();
  removeSelect = new EventEmitter();
  i18n = inject(I18nService);
  popupStore = inject(EventPromoCodePopupStore);
  ownerId = this.nextOwnerId();
  destroyEffects = [];
  lastAddPopupActionRequestId = 0;
  addPopupStateSignature = "";
  addPopupVerificationBusy = false;
  addPopupValidationErrorKey = "";
  addPopupValidationError = "";
  addPopupVerificationSequence = 0;
  addPopupOutletInputs = computed(() => {
    const popup = this.popupStore.addPopup();
    return {
      popup: popup?.ownerId === this.ownerId ? popup : null
    };
  }, ...ngDevMode ? [{ debugName: "addPopupOutletInputs" }] : (
    /* istanbul ignore next */
    []
  ));
  constructor() {
    this.destroyEffects.push(effect(() => {
      if (this.addPopupIsOpen()) {
        void this.popupStore.ensureAddPopupLoaded();
      }
    }), effect(() => {
      const request = this.popupStore.addPopupActionRequest();
      if (!request || request.requestId <= this.lastAddPopupActionRequestId) {
        return;
      }
      this.lastAddPopupActionRequestId = request.requestId;
      untracked(() => this.handleAddPopupActionRequest(request));
    }));
  }
  ngOnChanges(changes) {
    if (changes["open"] && !this.open) {
      this.closeAddPopup(void 0, true);
      return;
    }
    if (!this.addPopupIsOpen()) {
      return;
    }
    if (changes["availablePromoCodes"] || changes["appliedPromoCodes"]) {
      this.syncAddPopupState();
    }
  }
  ngOnDestroy() {
    this.destroyEffects.forEach((item) => item.destroy());
    if (this.addPopupIsOpen()) {
      this.closeAddPopup(void 0, true);
    }
  }
  handleEscape(event) {
    if (!this.open || this.addPopupVerificationBusy) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (this.addPopupIsOpen()) {
      this.closeAddPopup(event);
      return;
    }
    this.close(event);
  }
  popupModel() {
    return {
      title: "event.checkout.promo.setup.title",
      subtitle: "event.checkout.promo.setup.subtitle",
      ariaLabel: "event.checkout.promo.setup.aria",
      closeAriaLabel: "event.checkout.promo.setup.close.aria",
      closeOnBackdrop: true,
      size: "wide",
      height: "full",
      headerTone: "accent",
      bodyLayout: "fill",
      backdropTone: "dim",
      headerControls: this.headerControls(),
      onClose: (event) => this.close(event),
      onMenuSelect: (event) => this.onPopupMenuSelect(event)
    };
  }
  popupZIndex() {
    return 12800;
  }
  addPopupLoadingModel() {
    return {
      title: "event.checkout.promo.add.title",
      subtitle: "event.checkout.promo.add.subtitle",
      ariaLabel: "event.checkout.promo.add.aria",
      closeAriaLabel: "event.checkout.promo.add.close.aria",
      size: "default",
      height: "auto",
      headerTone: "accent",
      backdropTone: "dim",
      onClose: (event) => this.closeAddPopup(event)
    };
  }
  addPopupZIndex() {
    return 12900;
  }
  addPopupLoading() {
    return this.addPopupIsOpen() && this.popupStore.addPopupLoading() && !this.popupStore.addPopupComponent();
  }
  addPopupComponent() {
    return this.addPopupIsOpen() ? this.popupStore.addPopupComponent() : null;
  }
  promoCodeRows() {
    return this.normalizedAppliedCodes().map((code) => {
      const definition = this.promoDefinition(code);
      return {
        id: code,
        title: code,
        detail: this.i18n.translate("event.checkout.promo.applied.description"),
        icon: "redeem",
        avatarShape: "circle",
        surfaceTone: "success",
        badges: [{
          label: definition ? this.promoEffectLabel(definition.action) : this.i18n.translate("event.checkout.promo.applied"),
          tone: "success",
          position: "top-right"
        }],
        menuActions: ["delete"],
        eagerDetail: definition
      };
    });
  }
  onPromoCodeMenuAction(event) {
    if (event.actionId !== "delete") {
      return;
    }
    const code = this.normalizeCode(event.id);
    if (code) {
      this.removeSelect.emit(code);
    }
  }
  trackPromoCode(_index, row) {
    return row.id;
  }
  headerControls() {
    return [{
      kind: "menu",
      id: "promo-code-setup-actions",
      menuKind: "inline",
      closeOnSelect: false,
      items: [{
        id: "promo-code-add",
        icon: "add",
        kind: "action",
        palette: "blue",
        disabled: false,
        closeOnSelect: false,
        ariaLabel: "event.checkout.promo.add.aria",
        context: {
          menu: "promo-code-setup",
          action: "add"
        }
      }],
      panelAlign: "end",
      mobileBreakpointPx: 900
    }];
  }
  onPopupMenuSelect(event) {
    const context = event.itemSelect.context;
    if (context?.menu !== "promo-code-setup" || context.action !== "add") {
      return;
    }
    event.itemSelect.sourceEvent.preventDefault();
    event.itemSelect.sourceEvent.stopPropagation();
    this.openAddPopup();
  }
  openAddPopup() {
    if (!this.open || this.addPopupIsOpen()) {
      return;
    }
    this.addPopupValidationErrorKey = "";
    this.addPopupValidationError = "";
    const popup = this.buildAddPopupState();
    this.addPopupStateSignature = this.buildAddPopupStateSignature(popup);
    this.popupStore.openAddPopup(popup);
  }
  closeAddPopup(event, force = false) {
    event?.preventDefault();
    event?.stopPropagation();
    if (!force && this.addPopupVerificationBusy && this.addPopupIsOpen()) {
      return;
    }
    this.addPopupVerificationSequence += 1;
    this.addPopupVerificationBusy = false;
    this.addPopupValidationErrorKey = "";
    this.addPopupValidationError = "";
    this.addPopupStateSignature = "";
    this.popupStore.closeAddPopup(this.ownerId);
  }
  close(event) {
    if (this.addPopupVerificationBusy) {
      return;
    }
    event?.preventDefault();
    event?.stopPropagation();
    this.closeAddPopup();
    this.closeSelect.emit();
  }
  addPopupIsOpen() {
    return this.popupStore.addPopup()?.ownerId === this.ownerId;
  }
  syncAddPopupState() {
    if (!this.addPopupIsOpen()) {
      return;
    }
    const popup = this.buildAddPopupState();
    const signature = this.buildAddPopupStateSignature(popup);
    if (signature === this.addPopupStateSignature) {
      return;
    }
    this.addPopupStateSignature = signature;
    this.popupStore.updateAddPopup(popup);
  }
  buildAddPopupState() {
    return {
      ownerId: this.ownerId,
      title: "event.checkout.promo.add.title",
      subtitle: "event.checkout.promo.add.subtitle",
      zIndex: this.addPopupZIndex(),
      appliedPromoCodes: this.appliedPromoCodes ?? [],
      busy: this.addPopupVerificationBusy,
      validationErrorKey: this.addPopupValidationErrorKey,
      validationError: this.addPopupValidationError
    };
  }
  buildAddPopupStateSignature(popup) {
    return JSON.stringify({
      busy: popup.busy,
      validationErrorKey: popup.validationErrorKey,
      validationError: popup.validationError,
      applied: this.normalizedAppliedCodes()
    });
  }
  handleAddPopupActionRequest(request) {
    if (request.ownerId !== this.ownerId) {
      return;
    }
    switch (request.kind) {
      case "close":
        this.closeAddPopup(request.event);
        return;
      case "verify":
        if (this.addPopupVerificationBusy) {
          return;
        }
        void this.verifyAddPopupCode(request.code);
        return;
    }
  }
  async verifyAddPopupCode(code) {
    const normalizedInput = this.normalizeCode(code);
    if (!normalizedInput || !this.validatePromoCode || !this.addPopupIsOpen()) {
      this.addPopupValidationErrorKey = "event.checkout.promo.verify.failed";
      this.addPopupValidationError = "";
      this.syncAddPopupState();
      return;
    }
    const verificationSequence = ++this.addPopupVerificationSequence;
    this.addPopupVerificationBusy = true;
    this.addPopupValidationErrorKey = "";
    this.addPopupValidationError = "";
    this.syncAddPopupState();
    let result = null;
    try {
      result = await this.validatePromoCode(normalizedInput);
    } catch (error) {
      if (verificationSequence === this.addPopupVerificationSequence && this.addPopupIsOpen()) {
        const validationError = this.validationFailure(error);
        this.addPopupValidationErrorKey = validationError.key;
        this.addPopupValidationError = validationError.message;
      }
    }
    if (verificationSequence !== this.addPopupVerificationSequence || !this.addPopupIsOpen()) {
      return;
    }
    this.addPopupVerificationBusy = false;
    if (!result && (this.addPopupValidationErrorKey || this.addPopupValidationError)) {
      this.syncAddPopupState();
      return;
    }
    const canonicalCode = this.normalizeCode(result?.code);
    if (!result?.valid || !canonicalCode || !result.promoCode?.action) {
      const validationError = this.normalizedValidationError(result?.messageKey, result?.message);
      this.addPopupValidationErrorKey = validationError.key || EVENT_CHECKOUT_PROMO_CODE_INVALID_MESSAGE_KEY;
      this.addPopupValidationError = validationError.message;
      this.syncAddPopupState();
      return;
    }
    const validatedResult = __spreadProps(__spreadValues({}, result), {
      code: canonicalCode
    });
    this.closeAddPopup(void 0, true);
    this.addSelect.emit(validatedResult);
  }
  validationFailure(error) {
    if (error && typeof error === "object") {
      const record = error;
      const nested = record["error"];
      if (nested && typeof nested === "object") {
        const nestedRecord = nested;
        const validationError2 = this.normalizedValidationError(nestedRecord["messageKey"], nestedRecord["message"]);
        if (validationError2.key || validationError2.message) {
          return validationError2;
        }
      }
      const validationError = this.normalizedValidationError(record["messageKey"], record["message"]);
      if (validationError.key || validationError.message) {
        return validationError;
      }
    }
    return { key: "event.checkout.promo.verify.failed", message: "" };
  }
  normalizedValidationError(messageKey, message) {
    const normalizedMessageKey = `${messageKey ?? ""}`.trim();
    const normalizedMessage = `${message ?? ""}`.trim();
    return {
      key: normalizedMessageKey || (normalizedMessage === "A promo code is invalid or no longer active." ? EVENT_CHECKOUT_PROMO_CODE_INVALID_MESSAGE_KEY : ""),
      message: normalizedMessage
    };
  }
  normalizedAppliedCodes() {
    return [...new Set((this.appliedPromoCodes ?? []).map((code) => this.normalizeCode(code)).filter(Boolean))];
  }
  promoDefinition(code) {
    const normalizedCode = this.normalizeCode(code);
    return (this.availablePromoCodes ?? []).find((item) => this.normalizeCode(item.code) === normalizedCode) ?? null;
  }
  promoEffectLabel(action) {
    const value = Math.max(0, Number(action?.value) || 0);
    const formattedValue = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2
    }).format(value);
    switch (action?.kind) {
      case "decrease_percent":
        return `-${formattedValue}%`;
      case "increase_percent":
        return `+${formattedValue}%`;
      case "decrease_amount":
        return `-${formattedValue}`;
      case "increase_amount":
        return `+${formattedValue}`;
      default:
        return `= ${formattedValue}`;
    }
  }
  normalizeCode(value) {
    return `${value ?? ""}`.trim().toUpperCase();
  }
  nextOwnerId() {
    _EventPromoCodePopupComponent.ownerSequence += 1;
    return `event-promo-code-popup-${Date.now()}-${_EventPromoCodePopupComponent.ownerSequence}`;
  }
  static \u0275fac = function EventPromoCodePopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EventPromoCodePopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EventPromoCodePopupComponent, selectors: [["app-event-promo-code-popup"]], hostBindings: function EventPromoCodePopupComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("keydown.escape", function EventPromoCodePopupComponent_keydown_escape_HostBindingHandler($event) {
        return ctx.handleEscape($event);
      }, \u0275\u0275resolveDocument);
    }
  }, inputs: { open: "open", availablePromoCodes: "availablePromoCodes", appliedPromoCodes: "appliedPromoCodes", validatePromoCode: "validatePromoCode" }, outputs: { closeSelect: "closeSelect", addSelect: "addSelect", removeSelect: "removeSelect" }, features: [\u0275\u0275NgOnChangesFeature], decls: 3, vars: 3, consts: [[3, "model", "zIndex"], [1, "event-promo-code-popup-body"], [1, "event-promo-code-list-section"], [1, "event-promo-code-list"], [1, "event-promo-code-empty"], [3, "row"], [3, "menuAction", "row"], ["aria-busy", "true", 1, "event-promo-code-add-loading"], ["kind", "load-ring", "state", "loading"], [4, "ngComponentOutlet", "ngComponentOutletInputs"]], template: function EventPromoCodePopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, EventPromoCodePopupComponent_Conditional_0_Template, 6, 4, "app-popup", 0);
      \u0275\u0275conditionalCreate(1, EventPromoCodePopupComponent_Conditional_1_Template, 6, 5, "app-popup", 0);
      \u0275\u0275conditionalCreate(2, EventPromoCodePopupComponent_Conditional_2_Template, 1, 2, "ng-container");
    }
    if (rf & 2) {
      let tmp_2_0;
      \u0275\u0275conditional(ctx.open ? 0 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.addPopupLoading() ? 1 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_2_0 = ctx.addPopupComponent()) ? 2 : -1, tmp_2_0);
    }
  }, dependencies: [
    CommonModule,
    NgComponentOutlet,
    MatIconModule,
    MatIcon,
    IndicatorComponent,
    PopupComponent,
    SingleRowComponent,
    I18nPipe
  ], styles: ["\n[_nghost-%COMP%] {\n  display: contents;\n}\n.event-promo-code-popup-body[_ngcontent-%COMP%] {\n  position: relative;\n  flex: 1 1 auto;\n  min-height: 0;\n  overflow: auto;\n  padding: 0.12rem 0.12rem 0.72rem 0.04rem;\n  box-sizing: border-box;\n}\n.event-promo-code-list-section[_ngcontent-%COMP%] {\n  display: grid;\n  align-content: start;\n  min-width: 0;\n  padding: 0.82rem;\n  border: 1px solid rgba(103, 139, 181, 0.22);\n  border-radius: 16px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.96) 0%,\n      rgba(244, 249, 255, 0.94) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(107, 187, 165, 0.12),\n      transparent 40%);\n  box-sizing: border-box;\n}\n.event-promo-code-list[_ngcontent-%COMP%] {\n  display: grid;\n  align-content: start;\n  gap: 0.52rem;\n  min-width: 0;\n}\n.event-promo-code-empty[_ngcontent-%COMP%] {\n  min-height: 130px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  padding: 0.86rem;\n  border: 1px dashed rgba(128, 149, 176, 0.38);\n  border-radius: 14px;\n  background: rgba(255, 255, 255, 0.58);\n  color: rgba(35, 65, 99, 0.72);\n  font-size: 0.84rem;\n  font-weight: 800;\n  text-align: center;\n  box-sizing: border-box;\n}\n.event-promo-code-empty[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 20px;\n  height: 20px;\n  font-size: 20px;\n  line-height: 20px;\n}\n.event-promo-code-add-loading[_ngcontent-%COMP%] {\n  min-height: 170px;\n  display: grid;\n  place-content: center;\n  justify-items: center;\n  gap: 0.62rem;\n  padding: 1.2rem;\n  color: #365c82;\n  font-size: 0.82rem;\n  font-weight: 850;\n  text-align: center;\n  box-sizing: border-box;\n}\n@media (max-width: 640px) {\n  .event-promo-code-list-section[_ngcontent-%COMP%] {\n    padding: 0.68rem;\n  }\n}\n/*# sourceMappingURL=event-promo-code-popup.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EventPromoCodePopupComponent, [{
    type: Component,
    args: [{ selector: "app-event-promo-code-popup", standalone: true, imports: [
      CommonModule,
      MatIconModule,
      I18nPipe,
      IndicatorComponent,
      PopupComponent,
      SingleRowComponent
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `@if (open) {
  <app-popup [model]="popupModel()" [zIndex]="popupZIndex()">
    <div class="event-promo-code-popup-body">
      @let rows = promoCodeRows();
      <section class="event-promo-code-list-section">
        @if (rows.length > 0) {
          <div class="event-promo-code-list">
            @for (row of rows; track trackPromoCode($index, row)) {
              <single-row
                [row]="row"
                (menuAction)="onPromoCodeMenuAction($event)"
              ></single-row>
            }
          </div>
        } @else {
          <div class="event-promo-code-empty">
            <mat-icon>local_offer</mat-icon>
            <span>{{ 'event.checkout.promo.empty' | i18n }}</span>
          </div>
        }
      </section>
    </div>
  </app-popup>
}

@if (addPopupLoading()) {
  <app-popup [model]="addPopupLoadingModel()" [zIndex]="addPopupZIndex()">
    <div class="event-promo-code-add-loading" aria-busy="true">
      <app-indicator kind="load-ring" state="loading"></app-indicator>
      <span>{{ 'event.checkout.promo.add.loading' | i18n }}</span>
    </div>
  </app-popup>
}

@if (addPopupComponent(); as popupComponent) {
  <ng-container *ngComponentOutlet="popupComponent; inputs: addPopupOutletInputs()"></ng-container>
}
`, styles: ["/* src/app/activity/components/event-checkout-popup/event-promo-code-popup/event-promo-code-popup.component.scss */\n:host {\n  display: contents;\n}\n.event-promo-code-popup-body {\n  position: relative;\n  flex: 1 1 auto;\n  min-height: 0;\n  overflow: auto;\n  padding: 0.12rem 0.12rem 0.72rem 0.04rem;\n  box-sizing: border-box;\n}\n.event-promo-code-list-section {\n  display: grid;\n  align-content: start;\n  min-width: 0;\n  padding: 0.82rem;\n  border: 1px solid rgba(103, 139, 181, 0.22);\n  border-radius: 16px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.96) 0%,\n      rgba(244, 249, 255, 0.94) 100%),\n    radial-gradient(\n      circle at top right,\n      rgba(107, 187, 165, 0.12),\n      transparent 40%);\n  box-sizing: border-box;\n}\n.event-promo-code-list {\n  display: grid;\n  align-content: start;\n  gap: 0.52rem;\n  min-width: 0;\n}\n.event-promo-code-empty {\n  min-height: 130px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  padding: 0.86rem;\n  border: 1px dashed rgba(128, 149, 176, 0.38);\n  border-radius: 14px;\n  background: rgba(255, 255, 255, 0.58);\n  color: rgba(35, 65, 99, 0.72);\n  font-size: 0.84rem;\n  font-weight: 800;\n  text-align: center;\n  box-sizing: border-box;\n}\n.event-promo-code-empty .mat-icon {\n  width: 20px;\n  height: 20px;\n  font-size: 20px;\n  line-height: 20px;\n}\n.event-promo-code-add-loading {\n  min-height: 170px;\n  display: grid;\n  place-content: center;\n  justify-items: center;\n  gap: 0.62rem;\n  padding: 1.2rem;\n  color: #365c82;\n  font-size: 0.82rem;\n  font-weight: 850;\n  text-align: center;\n  box-sizing: border-box;\n}\n@media (max-width: 640px) {\n  .event-promo-code-list-section {\n    padding: 0.68rem;\n  }\n}\n/*# sourceMappingURL=event-promo-code-popup.component.css.map */\n"] }]
  }], () => [], { open: [{
    type: Input
  }], availablePromoCodes: [{
    type: Input
  }], appliedPromoCodes: [{
    type: Input
  }], validatePromoCode: [{
    type: Input
  }], closeSelect: [{
    type: Output
  }], addSelect: [{
    type: Output
  }], removeSelect: [{
    type: Output
  }], handleEscape: [{
    type: HostListener,
    args: ["document:keydown.escape", ["$event"]]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EventPromoCodePopupComponent, { className: "EventPromoCodePopupComponent", filePath: "app/activity/components/event-checkout-popup/event-promo-code-popup/event-promo-code-popup.component.ts", lineNumber: 65 });
})();

// src/app/activity/components/event-checkout-popup/event-checkout-popup.component.ts
function EventCheckoutPopupComponent_Conditional_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function EventCheckoutPopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, EventCheckoutPopupComponent_Conditional_0_ng_container_0_Template, 1, 0, "ng-container", 1);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
var EventCheckoutPopupComponent = class _EventCheckoutPopupComponent {
  static MAX_VISIBLE_SLOTS = 10;
  static CHECKOUT_BASKET_TTL_MS = 20 * 60 * 1e3;
  environment = environment;
  dialogStore = inject(EventCheckoutDialogStore);
  eventCheckoutSlotPickerStore = inject(EventCheckoutSlotPickerStore);
  eventEditorStore = inject(EventEditorPopupStore);
  eventsService = inject(EventsService);
  checkoutDraftStore = inject(EventCheckoutDraftStore);
  activitiesStore = inject(ActivitiesPopupStore);
  confirmationDialogStore = inject(DialogStore);
  activityStore = inject(ActivityStore);
  selectedSlotSourceId = null;
  selectedSlotDateValue = null;
  slotPageIndex = 0;
  selectedOptionalSubEventIds = /* @__PURE__ */ new Set();
  acceptedPolicyIds = /* @__PURE__ */ new Set();
  appliedPromoCodes = [];
  paymentStep = false;
  busy = false;
  errorMessage = "";
  promoCodePopupOpen = signal(false, ...ngDevMode ? [{ debugName: "promoCodePopupOpen" }] : (
    /* istanbul ignore next */
    []
  ));
  validatedPromoCodeDefinitions = /* @__PURE__ */ new Map();
  renderedDialogId = 0;
  renderedDialogLoading = false;
  checkoutReviewDialogId = 0;
  checkoutReviewLoadSequence = 0;
  checkoutReviewSourceRecord = null;
  checkoutReviewBodyLoading = signal(false, ...ngDevMode ? [{ debugName: "checkoutReviewBodyLoading" }] : (
    /* istanbul ignore next */
    []
  ));
  checkoutBusyActionId = null;
  checkoutSessionId = null;
  checkoutBasket = null;
  checkoutBaselineSignature = "";
  checkoutBaselinePendingReason = null;
  availableSlotsCache = [];
  availableSlotDateEntriesCache = [];
  availableSlotDateKeySet = /* @__PURE__ */ new Set();
  constructor() {
    effect(() => {
      const dialog = this.dialogStore.dialog();
      if (!dialog) {
        this.closeCheckoutReviewEditor();
        this.resetDialogState();
        return;
      }
      const dialogChanged = dialog.id !== this.renderedDialogId;
      const loadingResolved = !dialogChanged && this.renderedDialogLoading && !dialog.loading;
      if (!dialogChanged && !loadingResolved) {
        return;
      }
      if (dialogChanged) {
        this.validatedPromoCodeDefinitions.clear();
      }
      this.renderedDialogId = dialog.id;
      this.renderedDialogLoading = dialog.loading;
      this.initializeDialogState(dialog);
      void this.openCheckoutReviewEditor(dialog);
    });
  }
  onEscapePressed(event) {
    const keyboardEvent = event;
    const dialog = this.dialog();
    if (!dialog || keyboardEvent.defaultPrevented || !dialog.allowEscapeClose || this.busy) {
      return;
    }
    keyboardEvent.preventDefault();
    keyboardEvent.stopPropagation();
    if (this.paymentStep) {
      this.paymentStep = false;
      return;
    }
    this.close();
  }
  dialog() {
    return this.dialogStore.dialog();
  }
  close(event) {
    event?.stopPropagation();
    if (this.busy) {
      return;
    }
    this.closeCheckoutDialog();
  }
  async openCheckoutReviewEditor(dialog) {
    const dialogId = dialog.id;
    const loadSequence = ++this.checkoutReviewLoadSequence;
    this.checkoutReviewDialogId = dialogId;
    this.checkoutReviewBodyLoading.set(true);
    this.openCheckoutReviewEditorShell(dialog);
    await this.eventEditorStore.ensureEventEditorPopupLoaded();
    if (this.dialogStore.dialog()?.id !== dialogId || loadSequence !== this.checkoutReviewLoadSequence) {
      return;
    }
    this.openCheckoutReviewEditorShell(dialog);
    if (dialog.loading) {
      return;
    }
    await this.loadRuntimeCheckoutBasket(dialog);
    if (this.dialogStore.dialog()?.id !== dialogId || loadSequence !== this.checkoutReviewLoadSequence) {
      return;
    }
    this.checkoutReviewBodyLoading.set(false);
    this.openCheckoutReviewEditorShell(dialog);
  }
  openCheckoutReviewEditorShell(dialog) {
    const checkoutLoading = this.checkoutReviewBodyLoading();
    const presentation = {
      title: this.sectionTitle(),
      subtitle: dialog.record.title,
      checkoutPhase: this.checkoutEditorPhase(),
      hideSubEventsPanel: !this.showCheckoutSubEventDefinitionsPanel(dialog),
      hideSlotsPanel: true,
      hidePaymentPanel: this.isReadOnlyCheckoutSummary(),
      loading: checkoutLoading,
      showBasketPanel: true,
      showPricingPanel: this.showCheckoutPricingPanel(),
      basketTone: this.checkoutBasketSurfaceTone(),
      paymentTone: this.checkoutPaymentSurfaceTone(),
      basketItems: this.checkoutBasketPresentationItems(),
      basketPricingSummaryRows: this.checkoutBasketPricingSummaryRows(),
      basketTotalAmount: this.totalAmount(),
      basketCurrency: this.currency(),
      basketAddDisabled: this.checkoutBasketAddDisabled(),
      showPromoCodeAction: this.checkoutPromoCodeEntryEnabled(),
      appliedPromoCodeCount: this.appliedPromoCodes.length,
      acceptedPolicyIds: () => [...this.acceptedPolicyIds],
      policyApprovalDisabled: () => this.checkoutPolicyApprovalDisabled(),
      onPromoCodeAction: () => this.openPromoCodePopup(),
      onPolicyToggle: (policyId) => this.togglePolicy(policyId),
      onBasketAdd: (event) => this.addCheckoutBasketSlot(event),
      onBasketItemMenuSelect: (item, event) => this.onCheckoutBasketItemMenuSelect(item, event),
      footerItems: this.isReadOnlyCheckoutSummary() || checkoutLoading ? [] : this.checkoutFooterMenuItems(),
      onFooterItemSelect: (event) => this.onCheckoutActionMenuSelect(event),
      onClose: () => this.onCheckoutReviewEditorClose()
    };
    if (this.checkoutReviewSourceRecord === dialog.record && this.eventEditorStore.isOpen() && this.eventEditorStore.presentation().mode === "checkout-review") {
      this.eventEditorStore.updateCheckoutReviewPresentation(presentation);
      return;
    }
    this.checkoutReviewSourceRecord = dialog.record;
    this.eventEditorStore.openCheckoutReview(__spreadProps(__spreadValues({}, dialog.record), {
      checkoutBasket: this.checkoutBasket
    }), presentation);
  }
  switchCheckoutReviewPhase() {
    if (!this.eventEditorStore.isOpen() || this.eventEditorStore.presentation().mode !== "checkout-review") {
      return;
    }
    this.eventEditorStore.updateCheckoutReviewPhase(this.checkoutEditorPhase(), this.isReadOnlyCheckoutSummary() ? [] : this.checkoutFooterMenuItems());
  }
  showCheckoutSubEventDefinitionsPanel(dialog) {
    return dialog.record.subEventsEnabled !== false && (dialog.record.subEventDefinitions ?? []).length > 0;
  }
  setCheckoutErrorMessage(dialog, error, fallbackMessage) {
    this.errorMessage = this.resolveErrorMessage(error, fallbackMessage);
    queueMicrotask(() => {
      if (!dialog || this.dialog()?.id !== dialog.id || this.checkoutReviewDialogId !== dialog.id) {
        return;
      }
      this.openCheckoutReviewEditorShell(dialog);
    });
  }
  closeCheckoutDialog() {
    this.dialogStore.close();
    this.closeCheckoutReviewEditor();
  }
  closeCheckoutReviewEditor() {
    this.checkoutReviewLoadSequence += 1;
    this.checkoutReviewSourceRecord = null;
    if (!this.checkoutReviewDialogId) {
      return;
    }
    this.checkoutReviewDialogId = 0;
    this.checkoutReviewBodyLoading.set(false);
    if (this.eventEditorStore.presentation().mode === "checkout-review") {
      this.eventEditorStore.close();
    }
  }
  onCheckoutReviewEditorClose() {
    if (!this.checkoutReviewDialogId) {
      return;
    }
    this.requestCheckoutClose();
  }
  sectionTitle() {
    const dialog = this.dialog();
    if (!dialog) {
      return "Checkout";
    }
    if (dialog.mode === "invitation") {
      return this.totalAmount() > 0 ? "Accept Invitation & Pay" : "Accept Invitation";
    }
    if (dialog.readOnlySummary) {
      return "event.checkout.payment.summary";
    }
    if (this.isWaitingListSelection()) {
      return "Join Waiting List";
    }
    if (this.shouldAwaitApprovalBeforePayment()) {
      return "Review Join Request";
    }
    return this.totalAmount() > 0 ? "Review Booking & Pay" : "Join Event";
  }
  availableSlots() {
    return this.availableSlotsCache;
  }
  selectedSlot() {
    if (!this.selectedSlotSourceId) {
      return null;
    }
    return this.availableSlots().find((item) => item.id === this.selectedSlotSourceId) ?? null;
  }
  requiresSlotSelection() {
    return this.availableSlots().length > 0;
  }
  optionalSubEvents() {
    return (this.dialog()?.record.subEvents ?? []).filter((item) => item.optional);
  }
  slotCalendarFilter = (value) => {
    if (!value) {
      return false;
    }
    return this.availableSlotDateKeySet.has(this.slotDateKeyFromDate(value));
  };
  availableSlotDateEntries() {
    return this.availableSlotDateEntriesCache;
  }
  filteredSlots() {
    const selectedDateKey = this.selectedSlotDateKey();
    const all = [...this.availableSlots()];
    if (!selectedDateKey) {
      return all;
    }
    return all.filter((slot) => this.slotDateKeyFromIso(slot.startAtIso) === selectedDateKey);
  }
  pagedSlots() {
    const offset = this.slotPageIndex * _EventCheckoutPopupComponent.MAX_VISIBLE_SLOTS;
    return this.filteredSlots().slice(offset, offset + _EventCheckoutPopupComponent.MAX_VISIBLE_SLOTS);
  }
  slotPageCount() {
    return Math.max(1, Math.ceil(this.filteredSlots().length / _EventCheckoutPopupComponent.MAX_VISIBLE_SLOTS));
  }
  canGoToPreviousSlotPage() {
    return this.slotPageIndex > 0;
  }
  canGoToNextSlotPage() {
    return this.slotPageIndex < this.slotPageCount() - 1;
  }
  previousSlotPage() {
    if (!this.canGoToPreviousSlotPage()) {
      return;
    }
    this.slotPageIndex -= 1;
  }
  nextSlotPage() {
    if (!this.canGoToNextSlotPage()) {
      return;
    }
    this.slotPageIndex += 1;
  }
  slotPageSummary() {
    const filtered = this.filteredSlots();
    if (filtered.length === 0) {
      return "No slots";
    }
    const from2 = this.slotPageIndex * _EventCheckoutPopupComponent.MAX_VISIBLE_SLOTS + 1;
    const to = Math.min(filtered.length, from2 + _EventCheckoutPopupComponent.MAX_VISIBLE_SLOTS - 1);
    return `${from2}-${to} of ${filtered.length}`;
  }
  selectedSlotDateLabel() {
    const key = this.selectedSlotDateKey();
    if (!key) {
      return "All dates";
    }
    const parsed = this.selectedSlotDateValue ?? this.availableSlotDateEntries().find((item) => item.key === key)?.value ?? null;
    if (!parsed) {
      return key;
    }
    return parsed.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }
  selectedSlotBadgeLabel() {
    const slot = this.selectedSlot();
    if (!slot) {
      const dateLabel2 = this.selectedSlotDateLabel();
      return dateLabel2 === "All dates" ? "Choose a slot" : `${dateLabel2} \xB7 choose a slot`;
    }
    const start = AppUtils.isoLocalDateTimeToDate(slot.startAtIso);
    const end = AppUtils.isoLocalDateTimeToDate(slot.endAtIso);
    if (!start || !end) {
      return slot.timeframe || "Choose a slot";
    }
    const dateLabel = start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
    const startTime = start.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit"
    });
    const endTime = end.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit"
    });
    return `${dateLabel} \xB7 ${startTime} - ${endTime}`;
  }
  onSlotDateChange(value) {
    const normalized = value ? new Date(value.getFullYear(), value.getMonth(), value.getDate()) : null;
    if (normalized && !this.slotCalendarFilter(normalized)) {
      return;
    }
    this.selectedSlotDateValue = normalized;
    this.slotPageIndex = 0;
    this.invalidateCheckoutDraft();
  }
  policies() {
    const record = this.dialog()?.record ?? null;
    return record?.policiesEnabled === true ? record.policies ?? [] : [];
  }
  toggleSlot(slotId) {
    this.selectedSlotSourceId = this.selectedSlotSourceId === slotId ? null : slotId;
    this.invalidateCheckoutDraft();
  }
  isSelectedOptionalSubEvent(id) {
    return this.selectedOptionalSubEventIds.has(id);
  }
  toggleOptionalSubEvent(id) {
    if (this.selectedOptionalSubEventIds.has(id)) {
      this.selectedOptionalSubEventIds.delete(id);
    } else {
      this.selectedOptionalSubEventIds.add(id);
    }
    this.invalidateCheckoutDraft();
  }
  isAcceptedPolicy(id) {
    return this.acceptedPolicyIds.has(id);
  }
  togglePolicy(id) {
    const normalizedPolicyId = id.trim();
    const policy = this.policies().find((item) => item.id.trim() === normalizedPolicyId);
    if (!policy || policy.required !== false || this.checkoutPolicyApprovalDisabled()) {
      return;
    }
    if (this.acceptedPolicyIds.has(normalizedPolicyId)) {
      this.acceptedPolicyIds.delete(normalizedPolicyId);
    } else {
      this.acceptedPolicyIds.add(normalizedPolicyId);
    }
    this.switchCheckoutReviewPhase();
  }
  checkoutPolicyApprovalDisabled() {
    return this.isReadOnlyCheckoutSummary() || this.paymentStep || this.busy || this.dialog()?.loading === true || this.checkoutReviewBodyLoading();
  }
  showPromoCodePopup() {
    return this.promoCodePopupOpen();
  }
  availableCheckoutPromoCodes() {
    const dialog = this.dialog();
    if (!dialog) {
      return [];
    }
    const pricing = PricingBuilder.compactPricingConfig(dialog.record.pricing, {
      context: "event",
      slotCatalog: PricingBuilder.slotCatalogFromEventSlotTemplates(dialog.record.slotTemplates ?? []),
      allowSlotFeatures: (dialog.record.slotTemplates?.length ?? 0) > 0
    });
    if (!pricing.enabled || !pricing.audience.enabled) {
      return [];
    }
    const definitions = /* @__PURE__ */ new Map();
    for (const item of pricing.audience.promoCodes ?? []) {
      const definition = __spreadProps(__spreadValues({}, item), {
        code: this.normalizePromoCode(item.code),
        action: __spreadValues({}, item.action)
      });
      if (definition.code) {
        definitions.set(definition.code, definition);
      }
    }
    for (const [code, definition] of this.validatedPromoCodeDefinitions) {
      definitions.set(code, __spreadProps(__spreadValues({}, definition), {
        code,
        action: __spreadValues({}, definition.action)
      }));
    }
    return [...definitions.values()];
  }
  appliedCheckoutPromoCodes() {
    return [...this.appliedPromoCodes];
  }
  closePromoCodePopup() {
    this.promoCodePopupOpen.set(false);
  }
  validateCheckoutPromoCode = async (code) => {
    const dialog = this.dialog();
    const normalized = this.normalizePromoCode(code);
    if (!dialog || !normalized) {
      return null;
    }
    return this.eventsService.validateCheckoutPromoCode({
      sourceId: dialog.record.id,
      code: normalized
    });
  };
  addPromoCode(result) {
    const normalized = this.normalizePromoCode(result?.code);
    if (!result?.valid || !normalized || this.appliedPromoCodes.includes(normalized)) {
      return;
    }
    const definition = result.promoCode;
    if (definition?.action) {
      this.validatedPromoCodeDefinitions.set(normalized, __spreadProps(__spreadValues({}, definition), {
        code: normalized,
        action: __spreadValues({}, definition.action)
      }));
    }
    this.updateAppliedPromoCodes([...this.appliedPromoCodes, normalized]);
  }
  removePromoCode(code) {
    const normalized = this.normalizePromoCode(code);
    if (!normalized || !this.appliedPromoCodes.includes(normalized)) {
      return;
    }
    this.updateAppliedPromoCodes(this.appliedPromoCodes.filter((item) => item !== normalized));
  }
  openPromoCodePopup() {
    if (!this.checkoutPromoCodeEntryEnabled() || this.busy) {
      return;
    }
    this.promoCodePopupOpen.set(true);
  }
  checkoutPromoCodeEntryEnabled() {
    return !this.isReadOnlyCheckoutSummary() && this.availableCheckoutPromoCodes().length > 0;
  }
  updateAppliedPromoCodes(codes) {
    const nextCodes = this.validAppliedPromoCodes(codes);
    if (nextCodes.join("|") === this.appliedPromoCodes.join("|")) {
      return;
    }
    const dialog = this.dialog();
    if (!dialog) {
      return;
    }
    this.errorMessage = "";
    const currentItems = this.activeCheckoutBasketItems();
    this.resetCheckoutSubmissionForEdit();
    this.appliedPromoCodes = nextCodes;
    this.checkoutBasket = currentItems.length > 0 ? this.repriceCheckoutBasketItems(currentItems) : null;
    this.openCheckoutReviewEditorShell(dialog);
  }
  repriceCheckoutBasketItems(items) {
    const dialog = this.dialog();
    if (!dialog) {
      return null;
    }
    const optionalSubEventsById = new Map(this.optionalSubEvents().map((item) => [item.id, item]));
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    const repricedItems = items.map((item) => {
      const slot = (item.slotSourceId ? this.availableSlots().find((candidate) => candidate.id === item.slotSourceId) : null) ?? null;
      const slotTemplateId = item.slotTemplateId ?? slot?.slotTemplateId ?? null;
      const pricing = item.kind === "event" ? this.resolvePricing(dialog.record.pricing, dialog.record, slotTemplateId, slot, this.appliedPromoCodes) : item.kind === "sub_event" ? this.resolvePricing(optionalSubEventsById.get(item.subEventId ?? "")?.pricing, dialog.record, null, slot) : null;
      if (!pricing) {
        return __spreadProps(__spreadValues({}, item), { updatedAtIso: nowIso });
      }
      return __spreadProps(__spreadValues({}, item), {
        amount: pricing.amount,
        currency: pricing.currency,
        pricingSummaryRows: pricing.rows,
        updatedAtIso: nowIso
      });
    });
    return this.buildRuntimeBasketFromItems(repricedItems);
  }
  validAppliedPromoCodes(codes) {
    const available = new Set(this.availableCheckoutPromoCodes().map((item) => item.code));
    return this.normalizeAppliedPromoCodes(codes).filter((code) => available.has(code));
  }
  normalizeAppliedPromoCodes(codes) {
    return [...new Set((codes ?? []).map((code) => this.normalizePromoCode(code)).filter(Boolean))];
  }
  normalizePromoCode(code) {
    return `${code ?? ""}`.trim().toUpperCase();
  }
  lineItems() {
    const basket = this.checkoutBasketSnapshot();
    if (basket) {
      return basket.lineItems.map((item) => __spreadValues({}, item));
    }
    const dialog = this.dialog();
    if (!dialog) {
      return [];
    }
    if (this.requiresSlotSelection()) {
      return [];
    }
    const slot = this.selectedSlot();
    const slotId = slot?.slotTemplateId ?? null;
    const eventPricing = this.resolvePricing(dialog.record.pricing, dialog.record, slotId, slot, this.appliedPromoCodes);
    const items = [
      {
        id: `event:${dialog.record.id}`,
        kind: "event",
        label: dialog.record.title,
        detail: slot?.timeframe || dialog.record.timeframe || "Main event",
        amount: eventPricing.amount,
        currency: eventPricing.currency
      }
    ];
    for (const subEvent of this.optionalSubEvents()) {
      if (!this.selectedOptionalSubEventIds.has(subEvent.id)) {
        continue;
      }
      const pricing = this.resolvePricing(subEvent.pricing, dialog.record, null, slot);
      items.push({
        id: `subevent:${subEvent.id}`,
        kind: "sub_event",
        label: subEvent.name,
        detail: subEvent.description || "Optional sub event",
        amount: pricing.amount,
        currency: pricing.currency
      });
    }
    return items;
  }
  checkoutBasketItems(statusOverride, resultStateOverride) {
    const snapshot = this.checkoutBasketSnapshot();
    const sourceItems = this.isReadOnlyCheckoutSummary() ? (snapshot?.items ?? []).filter((item) => item.resultState !== "deleted") : (snapshot?.items ?? []).filter((item) => !this.isInactiveCheckoutResultState(item.resultState));
    return sourceItems.map((item) => __spreadProps(__spreadValues({}, item), {
      status: statusOverride ?? item.status,
      resultState: resultStateOverride ?? item.resultState ?? "pending",
      pricingSummaryRows: [...item.pricingSummaryRows ?? []]
    }));
  }
  activeCheckoutBasketItems() {
    const activeItems = (this.checkoutBasket?.items ?? []).filter((item) => !this.isInactiveCheckoutResultState(item.resultState));
    return activeItems.map((item) => __spreadProps(__spreadValues({}, item), { pricingSummaryRows: [...item.pricingSummaryRows ?? []] }));
  }
  checkoutSelectionSignature(pendingReasonOverride) {
    const fallbackCurrency = this.dialog()?.record.pricing?.currency?.trim() || "USD";
    const items = this.checkoutBasketItems();
    const itemParts = items.map((item) => {
      const itemCurrency = item.currency?.trim() || fallbackCurrency;
      const pricingRows = (item.pricingSummaryRows ?? []).map((row) => [
        `${row.key ?? ""}`.trim(),
        `${row.label ?? ""}`.trim(),
        `${row.detail ?? ""}`.trim(),
        Number.isFinite(row.amount) ? `${Math.round(Number(row.amount) * 100) / 100}` : "",
        `${row.currency ?? itemCurrency}`.trim(),
        Number.isFinite(row.multiplier) ? `${Math.max(1, Math.trunc(Number(row.multiplier)))}` : ""
      ].join("~")).sort().join(",");
      return [
        `${item.id ?? ""}`.trim(),
        `${item.kind ?? ""}`.trim(),
        `${item.sourceId ?? ""}`.trim(),
        `${item.slotSourceId ?? ""}`.trim(),
        `${item.slotTemplateId ?? ""}`.trim(),
        `${item.selectedDateKey ?? ""}`.trim(),
        `${item.subEventId ?? ""}`.trim(),
        `${item.resourceType ?? ""}`.trim(),
        `${item.label ?? ""}`.trim(),
        `${item.detail ?? ""}`.trim(),
        `${Math.round((Number(item.amount) || 0) * 100) / 100}`,
        itemCurrency,
        `${Math.max(1, Math.trunc(Number(item.quantity) || 1))}`,
        pricingRows
      ].join("|");
    }).sort();
    const totalAmount = items.reduce((sum, item) => sum + (Number(item.amount) || 0) * Math.max(1, Math.trunc(Number(item.quantity) || 1)), 0);
    const currency = items.find((item) => item.currency?.trim())?.currency?.trim() || fallbackCurrency;
    const optionalIds = [...this.selectedOptionalSubEventIds].map((item) => item.trim()).filter(Boolean).sort();
    const policyIds = [...this.acceptedPolicyIds].map((item) => item.trim()).filter(Boolean).sort();
    return JSON.stringify({
      pendingReason: pendingReasonOverride === void 0 ? this.checkoutActionPendingReason() : pendingReasonOverride,
      slotSourceId: this.selectedSlotSourceId?.trim() || null,
      selectedDateKey: this.selectedSlotDateValue ? this.slotDateKeyFromDate(this.selectedSlotDateValue) : null,
      optionalIds,
      policyIds,
      promoCodes: [...this.appliedPromoCodes],
      itemParts,
      totalAmount: Math.round(totalAmount * 100) / 100,
      currency
    });
  }
  checkoutBasketSnapshot() {
    if (this.isReadOnlyCheckoutSummary() && this.checkoutBasket?.items?.some((item) => item.resultState !== "deleted")) {
      return this.checkoutBasket;
    }
    if (this.checkoutBasket?.items?.some((item) => !this.isInactiveCheckoutResultState(item.resultState))) {
      return this.checkoutBasket;
    }
    if (this.shouldSuppressImplicitWaitlistBasket()) {
      return null;
    }
    if (this.requiresSlotSelection()) {
      return null;
    }
    const basket = this.buildRuntimeBasketFromCurrentSelection();
    this.checkoutBasket = basket;
    return basket;
  }
  isInactiveCheckoutResultState(resultState) {
    return resultState === "deleted" || resultState === "succeeded";
  }
  buildBasketItemsFromCurrentSelection() {
    const dialog = this.dialog();
    if (!dialog) {
      return [];
    }
    const slot = this.selectedSlot();
    if (this.requiresSlotSelection() && !slot) {
      return [];
    }
    const slotId = slot?.slotTemplateId ?? null;
    const selectedDateKey = slot?.startAtIso ? this.slotDateKeyFromIso(slot.startAtIso) : this.selectedSlotDateKey() || null;
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    const expiresAtIso = new Date(Date.now() + _EventCheckoutPopupComponent.CHECKOUT_BASKET_TTL_MS).toISOString();
    const eventPricing = this.resolvePricing(dialog.record.pricing, dialog.record, slotId, slot, this.appliedPromoCodes);
    const selectedOptionalSubEvents = this.optionalSubEvents().filter((subEvent) => this.selectedOptionalSubEventIds.has(subEvent.id)).map((subEvent) => ({
      subEvent,
      pricing: this.resolvePricing(subEvent.pricing, dialog.record, null, slot)
    }));
    const totalAmount = Math.round((eventPricing.amount + selectedOptionalSubEvents.reduce((sum, item) => sum + item.pricing.amount, 0)) * 100) / 100;
    const state = this.currentCheckoutState(totalAmount);
    const items = [
      {
        id: `event:${dialog.record.id}:${slot?.id ?? "main"}`,
        kind: "event",
        sourceId: dialog.record.id,
        slotSourceId: slot?.id ?? null,
        slotTemplateId: slot?.slotTemplateId ?? null,
        selectedDateKey,
        subEventId: null,
        resourceType: null,
        label: dialog.record.title,
        detail: slot?.timeframe || dialog.record.timeframe || "Main event",
        amount: eventPricing.amount,
        currency: eventPricing.currency,
        quantity: 1,
        status: state,
        resultState: "pending",
        pricingSummaryRows: eventPricing.rows,
        checkoutSessionId: this.checkoutSessionId,
        createdAtIso: nowIso,
        updatedAtIso: nowIso,
        expiresAtIso
      }
    ];
    for (const { subEvent, pricing } of selectedOptionalSubEvents) {
      items.push({
        id: `subevent:${subEvent.id}:${slot?.id ?? "main"}`,
        kind: "sub_event",
        sourceId: dialog.record.id,
        slotSourceId: slot?.id ?? null,
        slotTemplateId: slot?.slotTemplateId ?? null,
        selectedDateKey,
        subEventId: subEvent.id,
        resourceType: null,
        label: subEvent.name,
        detail: subEvent.description || "Optional sub event",
        amount: pricing.amount,
        currency: pricing.currency,
        quantity: 1,
        status: state,
        resultState: "pending",
        pricingSummaryRows: pricing.rows,
        checkoutSessionId: this.checkoutSessionId,
        createdAtIso: nowIso,
        updatedAtIso: nowIso,
        expiresAtIso
      });
    }
    return items;
  }
  checkoutBasketPresentationItems() {
    const groups = /* @__PURE__ */ new Map();
    const standalone = [];
    const items = this.checkoutBasketItems();
    items.forEach((item, index) => {
      const groupKey = this.checkoutBasketPresentationGroupKey(item);
      if (item.kind === "sub_event" && groupKey) {
        const group = groups.get(groupKey) ?? { order: index, slot: null, optionals: [] };
        group.order = Math.min(group.order, index);
        group.optionals.push(item);
        groups.set(groupKey, group);
        return;
      }
      if (item.kind === "event" && groupKey) {
        const group = groups.get(groupKey) ?? { order: index, slot: null, optionals: [] };
        group.order = Math.min(group.order, index);
        group.slot = item;
        groups.set(groupKey, group);
        return;
      }
      standalone.push({ order: index, item });
    });
    const groupedItems = [...groups.values()].sort((left, right) => left.order - right.order).flatMap((group) => this.checkoutBasketGroupedPresentationItems(group.slot, group.optionals));
    const standaloneItems = standalone.sort((left, right) => left.order - right.order).map((entry) => this.checkoutBasketPresentationItem(entry.item, []));
    return [...groupedItems, ...standaloneItems];
  }
  checkoutBasketGroupedPresentationItems(slot, optionals) {
    if (!slot) {
      return optionals.map((item) => this.checkoutBasketPresentationItem(item, []));
    }
    return [this.checkoutBasketPresentationItem(slot, optionals)];
  }
  checkoutBasketPresentationItem(item, optionals) {
    const optionalLabels = optionals.map((optional) => optional.label.trim()).filter(Boolean);
    const optionalDetail = optionalLabels.length > 0 ? `Optional: ${optionalLabels.join(", ")}` : null;
    const amount = [item, ...optionals].reduce((sum, current) => sum + (Number(current.amount) || 0) * Math.max(1, Math.trunc(Number(current.quantity) || 1)), 0);
    return {
      id: item.id,
      title: item.label,
      meta: item.detail,
      detail: optionalDetail,
      amount: Math.round(amount * 100) / 100,
      currency: item.currency || optionals.find((optional) => optional.currency)?.currency || this.currency(),
      quantity: 1,
      status: item.status,
      pricingSummaryRows: [item, ...optionals].flatMap((current) => current.pricingSummaryRows ?? [])
    };
  }
  checkoutBasketPresentationGroupKey(item) {
    const slotSourceId = `${item.slotSourceId ?? ""}`.trim();
    if (slotSourceId) {
      return slotSourceId;
    }
    const id = `${item.id ?? ""}`.trim();
    if (item.kind === "event" && id.startsWith("event:")) {
      return id.split(":").slice(2).join(":") || "main";
    }
    if (item.kind === "sub_event" && id.startsWith("subevent:")) {
      return id.split(":").slice(2).join(":") || "main";
    }
    return "";
  }
  checkoutBasketSurfaceTone() {
    if (this.checkoutDraftBasketChanged()) {
      return "changed";
    }
    const pendingReason = this.checkoutDecisionPendingReason();
    if (pendingReason === "waitlist") {
      return "waiting";
    }
    if (pendingReason === "approval") {
      return "approval";
    }
    if (this.paymentStep || this.checkoutSessionId || this.activeCheckoutBasketItems().some((item) => item.status === "pay")) {
      return "payment";
    }
    return this.totalAmount() > 0 ? "ready" : "neutral";
  }
  checkoutPaymentSurfaceTone() {
    const pendingReason = this.checkoutDecisionPendingReason();
    if (pendingReason === "waitlist") {
      return "waiting";
    }
    if (pendingReason === "approval") {
      return "approval";
    }
    return this.paymentStep || this.checkoutSessionId ? "payment" : "ready";
  }
  checkoutBasketPricingSummaryRows() {
    return (this.checkoutBasketSnapshot()?.pricingSummaryRows ?? []).map((row) => __spreadValues({}, row));
  }
  showCheckoutPricingPanel() {
    const dialog = this.dialog();
    if (!dialog) {
      return false;
    }
    return this.checkoutRecordPricingEnabled(dialog.record) || this.checkoutBasketHasPayableItems();
  }
  checkoutRecordPricingEnabled(record) {
    const slotCatalog = PricingBuilder.slotCatalogFromEventSlotTemplates(record.slotTemplates ?? []);
    return PricingBuilder.compactPricingConfig(record.pricing, {
      context: "event",
      slotCatalog,
      allowSlotFeatures: slotCatalog.length > 0
    }).enabled === true;
  }
  checkoutBasketHasPayableItems() {
    const basket = this.checkoutBasketSnapshot();
    if (Number(basket?.totalAmount) > 0) {
      return true;
    }
    if (this.checkoutBasketItems().some((item) => (Number(item.amount) || 0) * Math.max(1, Math.trunc(Number(item.quantity) || 1)) > 0)) {
      return true;
    }
    return this.checkoutBasketPricingSummaryRows().some((row) => Number(row.amount) > 0);
  }
  checkoutBasketAddDisabled() {
    return this.busy || this.checkoutReviewBodyLoading();
  }
  async addCheckoutBasketSlot(event) {
    event?.preventDefault();
    event?.stopPropagation();
    if (this.checkoutBasketAddDisabled()) {
      return;
    }
    const dialog = this.dialog();
    if (!dialog) {
      return;
    }
    const basketChangeContext = this.checkoutBasketChangeContext();
    await this.eventCheckoutSlotPickerStore.ensureSlotPickerPopupLoaded();
    this.eventCheckoutSlotPickerStore.open({
      userId: dialog.userId,
      record: dialog.record,
      checkoutBasket: this.checkoutBasketSnapshot(),
      checkoutSessionId: this.checkoutSessionId,
      selectedDateKey: this.checkoutSlotPickerSelectedDateKey(),
      onSave: (basket, items) => this.applyCheckoutSlotPickerSave(basket, items, basketChangeContext)
    });
  }
  checkoutBasketChangeContext() {
    const pendingReason = this.checkoutActionPendingReason();
    if (pendingReason) {
      return {
        checkoutState: pendingReason === "waitlist" ? "waiting" : "approval-pending",
        pendingReason
      };
    }
    const draft = this.currentCheckoutDraft();
    if (draft?.pendingReason === "waitlist" || draft?.checkoutState === "waiting") {
      return {
        checkoutState: "waiting",
        pendingReason: "waitlist"
      };
    }
    if (draft?.pendingReason === "approval" || draft?.checkoutState === "approval-pending") {
      return {
        checkoutState: "approval-pending",
        pendingReason: "approval"
      };
    }
    const basketState = this.checkoutBasket?.status ?? null;
    if (basketState === "waiting") {
      return {
        checkoutState: "waiting",
        pendingReason: "waitlist"
      };
    }
    if (basketState === "approval-pending") {
      return {
        checkoutState: "approval-pending",
        pendingReason: "approval"
      };
    }
    if (this.paymentStep || this.checkoutPaymentReviewStarted() || Boolean(this.checkoutSessionId) || this.dialog()?.approvalGranted === true || this.checkoutRecordAcceptedByCurrentUser() || draft?.checkoutState === "confirmed" || draft?.checkoutState === "pay" || basketState === "confirmed" || basketState === "pay") {
      return {
        checkoutState: "confirmed",
        pendingReason: null
      };
    }
    return null;
  }
  checkoutRecordAcceptedByCurrentUser() {
    const dialog = this.dialog();
    const userId = dialog?.userId.trim() ?? "";
    if (!userId) {
      return false;
    }
    return (dialog?.record.acceptedMemberUserIds ?? []).some((memberUserId) => memberUserId.trim() === userId);
  }
  checkoutSlotPickerSelectedDateKey() {
    const activeItems = this.activeCheckoutBasketItems();
    const activeDateKey = this.checkoutBasket?.selectedDateKey?.slice(0, 10) ?? activeItems.find((item) => item.selectedDateKey?.trim())?.selectedDateKey?.slice(0, 10) ?? null;
    if (activeItems.length > 0 && activeDateKey) {
      return activeDateKey;
    }
    const selectedDateKey = this.selectedSlotDateValue ? this.slotDateKeyFromDate(this.selectedSlotDateValue) : null;
    if (selectedDateKey && this.availableSlotDateKeySet.has(selectedDateKey)) {
      return selectedDateKey;
    }
    return this.availableSlotDateKeys()[0] ?? null;
  }
  applyCheckoutSlotPickerSave(basket, items, basketChangeContext = null) {
    this.paymentStep = false;
    this.checkoutSessionId = null;
    this.checkoutBasket = basket ?? this.buildRuntimeBasketFromItems(items);
    this.appliedPromoCodes = this.validAppliedPromoCodes(this.checkoutBasket?.appliedPromoCodes ?? this.appliedPromoCodes);
    const activeItems = this.activeCheckoutBasketItems();
    this.selectedSlotSourceId = this.checkoutBasket?.slotSourceId ?? activeItems.find((item) => item.slotSourceId?.trim())?.slotSourceId?.trim() ?? null;
    const selectedDateKey = this.checkoutBasket?.selectedDateKey ?? activeItems.find((item) => item.selectedDateKey?.trim())?.selectedDateKey?.trim() ?? null;
    this.selectedSlotDateValue = selectedDateKey ? this.slotDateValueFromKey(selectedDateKey) ?? this.selectedSlotDateValue : null;
    const validOptionalIds = new Set(this.optionalSubEvents().map((item) => item.id));
    this.selectedOptionalSubEventIds = new Set(activeItems.map((item) => item.subEventId?.trim() ?? "").filter((id) => Boolean(id) && validOptionalIds.has(id)));
    this.checkoutBasket = this.repriceCheckoutBasketItems(activeItems) ?? this.checkoutBasket;
    if (basketChangeContext) {
      this.markCheckoutDraftBasketChanged(basketChangeContext.checkoutState, basketChangeContext.pendingReason);
    }
    this.errorMessage = "";
    const dialog = this.dialog();
    if (dialog) {
      this.openCheckoutReviewEditorShell(dialog);
      void this.persistCheckoutDraft(true, null, "draft").catch((error) => {
        this.setCheckoutErrorMessage(dialog, error, "Unable to update checkout pricing.");
      });
    }
  }
  markCheckoutDraftBasketChanged(checkoutState, pendingReason) {
    const dialog = this.dialog();
    if (!dialog) {
      return;
    }
    const draft = this.checkoutDraftStore.read(dialog.userId, dialog.record.id);
    if (!draft) {
      return;
    }
    this.checkoutDraftStore.save(__spreadProps(__spreadValues({}, draft), {
      checkoutState,
      pendingReason,
      basketChanged: true,
      updatedAtMs: Date.now()
    }));
  }
  onCheckoutBasketItemMenuSelect(item, event) {
    event.sourceEvent.preventDefault();
    event.sourceEvent.stopPropagation();
    if (event.id === "remove") {
      this.requestRemoveCheckoutBasketItem(item.id);
    }
  }
  requestRemoveCheckoutBasketItem(itemId) {
    const normalizedItemId = itemId.trim();
    if (!normalizedItemId) {
      return;
    }
    const item = this.activeCheckoutBasketItems().find((current) => current.id === normalizedItemId);
    if (!item) {
      return;
    }
    this.confirmationDialogStore.open({
      title: this.checkoutRemoveItemTitle(item.status),
      message: item.label,
      warningMessage: this.checkoutRemoveItemWarning(item.status),
      cancelLabel: "Cancel",
      confirmLabel: this.checkoutRemoveItemLabel(item.status),
      busyConfirmLabel: `${this.checkoutRemoveItemLabel(item.status)}...`,
      confirmTone: "danger",
      confirmPalette: this.checkoutRemoveItemPalette(item.status),
      failureMessage: "Unable to remove this checkout item.",
      onConfirm: async () => this.removeCheckoutBasketItem(normalizedItemId)
    });
  }
  checkoutRemoveItemTitle(status) {
    if (status === "waiting") {
      return "Leave waitlist?";
    }
    if (status === "approval-pending" || status === "approved") {
      return "Cancel request?";
    }
    if (status === "pay") {
      return "Cancel payment item?";
    }
    return "Remove checkout item?";
  }
  checkoutRemoveItemWarning(status) {
    if (status === "waiting") {
      return "The waitlist item will be removed from the basket.";
    }
    if (status === "approval-pending" || status === "approved") {
      return "The pending request item will be removed from the basket.";
    }
    if (status === "pay") {
      return "The payment item will be removed from the basket.";
    }
    return "The item will be removed from the basket and from the runtime price summary.";
  }
  checkoutRemoveItemLabel(status) {
    if (status === "waiting") {
      return "Leave waitlist";
    }
    if (status === "approval-pending" || status === "approved") {
      return "Cancel request";
    }
    if (status === "pay") {
      return "Cancel payment";
    }
    return "remove";
  }
  checkoutRemoveItemPalette(status) {
    if (status === "waiting") {
      return "amber";
    }
    if (status === "approval-pending" || status === "approved") {
      return "orange";
    }
    return "danger";
  }
  async removeCheckoutBasketItem(itemId) {
    const normalizedItemId = itemId.trim();
    const dialog = this.dialog();
    if (!dialog || !normalizedItemId) {
      return;
    }
    const activeItems = this.activeCheckoutBasketItems();
    const previousSelectedDateKey = this.checkoutBasket?.selectedDateKey ?? activeItems.find((item2) => item2.selectedDateKey?.trim())?.selectedDateKey?.trim() ?? null;
    const previousExpiresAtIso = this.checkoutBasket?.expiresAtIso ?? activeItems.find((item2) => item2.expiresAtIso?.trim())?.expiresAtIso?.trim() ?? null;
    const item = activeItems.find((current) => current.id === normalizedItemId);
    const removedGroupKey = item ? this.checkoutBasketPresentationGroupKey(item) : "";
    const remainingItems = activeItems.filter((item2) => item2.id !== normalizedItemId).filter((item2) => !removedGroupKey || this.checkoutBasketPresentationGroupKey(item2) !== removedGroupKey);
    const basketChangeContext = this.checkoutBasketChangeContext();
    this.resetCheckoutSubmissionForEdit();
    this.checkoutBasket = this.buildRuntimeBasketFromItems(remainingItems);
    this.selectedSlotSourceId = remainingItems[0]?.slotSourceId ?? null;
    const savedBasket = await this.eventsService.saveCheckoutBasket(this.buildCheckoutRequest({
      checkoutState: "draft",
      pendingReason: null
    }));
    this.checkoutBasket = savedBasket ?? this.checkoutBasket;
    if (remainingItems.length === 0) {
      this.selectedSlotSourceId = null;
      this.selectedOptionalSubEventIds = /* @__PURE__ */ new Set();
      this.checkoutBasket = null;
      this.saveEmptyCheckoutDraft(dialog, previousSelectedDateKey, previousExpiresAtIso);
      if (basketChangeContext) {
        this.markCheckoutDraftBasketChanged(basketChangeContext.checkoutState, basketChangeContext.pendingReason);
      }
      this.openCheckoutReviewEditorShell(dialog);
      return;
    }
    await this.persistCheckoutDraft(false, null, "draft");
    if (basketChangeContext) {
      this.markCheckoutDraftBasketChanged(basketChangeContext.checkoutState, basketChangeContext.pendingReason);
    }
  }
  saveEmptyCheckoutDraft(dialog, selectedDateKey, expiresAtIso) {
    this.checkoutDraftStore.save({
      userId: dialog.userId,
      sourceId: dialog.record.id,
      eventTitle: dialog.record.title,
      eventTimeframe: dialog.record.timeframe,
      slotSourceId: null,
      selectedDateKey,
      optionalSubEventIds: [],
      acceptedPolicyIds: [...this.acceptedPolicyIds],
      appliedPromoCodes: [],
      basketItems: [],
      pricingSummaryRows: [],
      checkoutState: "draft",
      lineItems: [],
      totalAmount: 0,
      currency: dialog.record.pricing?.currency?.trim() || "USD",
      checkoutSessionId: null,
      expiresAtIso,
      pendingReason: null,
      updatedAtMs: Date.now()
    });
  }
  buildRuntimeBasketFromCurrentSelection() {
    const dialog = this.dialog();
    if (!dialog) {
      return null;
    }
    const items = this.buildBasketItemsFromCurrentSelection();
    if (items.length === 0) {
      return null;
    }
    const lineItems = this.lineItemsFromBasketItems(items);
    const totalAmount = this.totalAmountFromLineItems(lineItems);
    const currency = items.find((item) => item.currency)?.currency ?? dialog.record.pricing?.currency ?? "USD";
    const state = this.currentCheckoutState(totalAmount);
    return {
      userId: dialog.userId,
      sourceId: dialog.record.id,
      status: state,
      items: items.map((item) => __spreadProps(__spreadValues({}, item), { status: state })),
      pricingSummaryRows: this.aggregatePricingSummaryRows(items.flatMap((item) => item.pricingSummaryRows ?? []), currency),
      lineItems,
      totalAmount,
      currency,
      slotSourceId: items[0]?.slotSourceId ?? null,
      selectedDateKey: items[0]?.selectedDateKey ?? null,
      checkoutSessionId: this.checkoutSessionId,
      expiresAtIso: items.find((item) => item.expiresAtIso)?.expiresAtIso ?? null,
      appliedPromoCodes: [...this.appliedPromoCodes]
    };
  }
  buildRuntimeBasketFromItems(items) {
    const dialog = this.dialog();
    if (!dialog || items.length === 0) {
      return null;
    }
    const lineItems = this.lineItemsFromBasketItems(items);
    const totalAmount = this.totalAmountFromLineItems(lineItems);
    const currency = items.find((item) => item.currency)?.currency ?? dialog.record.pricing?.currency ?? "USD";
    const state = this.currentCheckoutState(totalAmount);
    return {
      userId: dialog.userId,
      sourceId: dialog.record.id,
      status: state,
      items: items.map((item) => __spreadProps(__spreadValues({}, item), { status: state })),
      pricingSummaryRows: this.aggregatePricingSummaryRows(items.flatMap((item) => item.pricingSummaryRows ?? []), currency),
      lineItems,
      totalAmount,
      currency,
      slotSourceId: items[0]?.slotSourceId ?? null,
      selectedDateKey: items[0]?.selectedDateKey ?? null,
      checkoutSessionId: this.checkoutSessionId,
      expiresAtIso: items.find((item) => item.expiresAtIso)?.expiresAtIso ?? null,
      appliedPromoCodes: [...this.appliedPromoCodes]
    };
  }
  lineItemsFromBasketItems(items) {
    return items.map((item) => ({
      id: item.id,
      kind: item.kind,
      label: item.label,
      detail: item.detail,
      amount: Math.round((Number(item.amount) || 0) * Math.max(1, Math.trunc(Number(item.quantity) || 1)) * 100) / 100,
      currency: item.currency
    }));
  }
  totalAmountFromLineItems(items) {
    return Math.round(items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0) * 100) / 100;
  }
  aggregatePricingSummaryRows(rows, fallbackCurrency) {
    const grouped = /* @__PURE__ */ new Map();
    for (const row of rows) {
      const label = `${row.label ?? ""}`.trim();
      if (!label) {
        continue;
      }
      const detail = `${row.detail ?? ""}`.trim();
      const amount = Number.isFinite(row.amount) ? Number(row.amount) : null;
      const currency = `${row.currency ?? fallbackCurrency ?? "USD"}`.trim() || "USD";
      const key = `${row.key || label}::${detail}::${amount ?? "none"}::${currency}`;
      const multiplier = Math.max(1, Math.trunc(Number(row.multiplier) || 1));
      const existing = grouped.get(key);
      if (existing) {
        const nextMultiplier = Math.max(1, Math.trunc(Number(existing.multiplier) || 1)) + multiplier;
        grouped.set(key, __spreadProps(__spreadValues({}, existing), {
          multiplier: nextMultiplier,
          amount: existing.amount !== null && amount !== null ? Math.round((Number(existing.amount) + amount * multiplier) * 100) / 100 : existing.amount ?? amount
        }));
        continue;
      }
      grouped.set(key, {
        key,
        label,
        detail: detail || null,
        amount: amount === null ? null : Math.round(amount * multiplier * 100) / 100,
        currency,
        multiplier
      });
    }
    return [...grouped.values()];
  }
  totalAmount() {
    return this.checkoutBasketSnapshot()?.totalAmount ?? Math.round(this.lineItems().reduce((sum, item) => sum + (Number(item.amount) || 0), 0) * 100) / 100;
  }
  showCancellationPolicyCard() {
    if (this.totalAmount() <= 0) {
      return false;
    }
    const dialog = this.dialog();
    if (!dialog) {
      return false;
    }
    const policy = PricingBuilder.compactPricingConfig(dialog.record.pricing, {
      context: "event",
      slotCatalog: PricingBuilder.slotCatalogFromEventSlotTemplates(dialog.record.slotTemplates ?? []),
      allowSlotFeatures: (dialog.record.slotTemplates?.length ?? 0) > 0
    }).cancellationPolicy;
    return policy.enabled && policy.rules.length > 0;
  }
  cancellationPreview() {
    const dialog = this.dialog();
    if (!dialog || this.totalAmount() <= 0) {
      return null;
    }
    const policy = PricingBuilder.compactPricingConfig(dialog.record.pricing, {
      context: "event",
      slotCatalog: PricingBuilder.slotCatalogFromEventSlotTemplates(dialog.record.slotTemplates ?? []),
      allowSlotFeatures: (dialog.record.slotTemplates?.length ?? 0) > 0
    }).cancellationPolicy;
    if (!policy.enabled || policy.rules.length === 0) {
      return null;
    }
    const startAtIso = this.selectedSlot()?.startAtIso ?? dialog.record.startAtIso;
    if (!startAtIso) {
      return null;
    }
    const applicableRule = this.resolveApplicableCancellationRule(policy.rules, startAtIso);
    if (!applicableRule) {
      return {
        refundAmount: 0,
        refundLabel: "No refund right now",
        note: "The selected booking is already inside the last reimbursement window."
      };
    }
    const refundAmount = this.calculateCancellationRefundAmount(applicableRule, this.totalAmount());
    return {
      refundAmount,
      refundLabel: refundAmount > 0 ? `${this.formatMoney(refundAmount)} refundable right now` : "No refund right now",
      note: this.describeCancellationRule(applicableRule)
    };
  }
  cancellationRules() {
    const dialog = this.dialog();
    if (!dialog) {
      return [];
    }
    const policy = PricingBuilder.compactPricingConfig(dialog.record.pricing, {
      context: "event",
      slotCatalog: PricingBuilder.slotCatalogFromEventSlotTemplates(dialog.record.slotTemplates ?? []),
      allowSlotFeatures: (dialog.record.slotTemplates?.length ?? 0) > 0
    }).cancellationPolicy;
    return policy.rules;
  }
  cancellationRuleWindowLabel(rule) {
    const value = Math.max(0, Number(rule.offsetValue) || 0);
    const unit = rule.offsetUnit === "hours" ? value === 1 ? "hour" : "hours" : rule.offsetUnit === "weeks" ? value === 1 ? "week" : "weeks" : rule.offsetUnit === "months" ? value === 1 ? "month" : "months" : value === 1 ? "day" : "days";
    return `${value} ${unit} before start`;
  }
  cancellationRuleRefundLabel(rule) {
    if (rule.refundKind === "full") {
      return "Full refund";
    }
    if (rule.refundKind === "none") {
      return "No refund";
    }
    if (rule.refundKind === "fixed_amount") {
      return this.formatMoney(Number(rule.refundValue) || 0, this.currency());
    }
    return `${Math.max(0, Number(rule.refundValue) || 0)}% refund`;
  }
  currency() {
    return this.checkoutBasketSnapshot()?.currency ?? this.lineItems().find((item) => item.currency)?.currency ?? this.dialog()?.record.pricing?.currency ?? "USD";
  }
  formatMoney(amount, currency = this.currency()) {
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
  continueLabel() {
    const dialog = this.dialog();
    if (!dialog) {
      return "Continue";
    }
    if (this.checkoutTargetUnavailable()) {
      return "Unavailable";
    }
    if (this.checkoutUpdateStepActive()) {
      return "Update";
    }
    if (this.paymentStep) {
      return "payment";
    }
    if (this.checkoutPaymentReviewStarted()) {
      return this.hasCheckoutSelectionChanges() ? "update" : "continue";
    }
    const pendingReason = this.checkoutActionPendingReason();
    if (pendingReason) {
      if (this.hasCheckoutSelectionChanges()) {
        return "Update";
      }
      return pendingReason === "waitlist" ? "waiting.list" : "event.editor.checkout.waiting.approval";
    }
    return "Join";
  }
  busyLabel() {
    const dialog = this.dialog();
    if (!dialog) {
      return "Working...";
    }
    if (this.checkoutUpdateStepActive()) {
      return "Updating...";
    }
    if (this.paymentStep) {
      return "event.checkout.paying";
    }
    if (this.checkoutPaymentReviewStarted()) {
      return this.hasCheckoutSelectionChanges() ? "updating" : "continuing";
    }
    const pendingReason = this.checkoutActionPendingReason();
    if (pendingReason) {
      return this.hasCheckoutSelectionChanges() ? "Updating..." : "Continuing...";
    }
    if (this.shouldAwaitApprovalBeforePayment() || this.isWaitingListSelection()) {
      return dialog.busyConfirmLabel;
    }
    if (this.totalAmount() > 0) {
      return "Join...";
    }
    return dialog.busyConfirmLabel;
  }
  checkoutActionsDisabled() {
    return this.isReadOnlyCheckoutSummary() || this.busy || this.dialog()?.loading === true || this.checkoutReviewBodyLoading();
  }
  checkoutActionProgressState(actionId) {
    return this.checkoutBusyActionId === actionId ? "loading" : null;
  }
  checkoutFooterMenuItems() {
    const footerState = this.checkoutFooterDecisionState();
    const actionsDisabled = this.checkoutActionsDisabled();
    const items = [];
    if (this.paymentStep) {
      items.push({
        id: "checkout-secondary",
        label: "Vissza",
        layout: "action",
        palette: "neutral",
        disabled: actionsDisabled,
        ariaLabel: "Vissza"
      });
    }
    if (this.showCheckoutLifecycleCancel()) {
      const cancelLabel = this.checkoutLifecycleCancelLabel();
      items.push({
        id: "checkout-cancel-lifecycle",
        label: cancelLabel,
        layout: "action",
        palette: "danger",
        disabled: actionsDisabled,
        ariaLabel: cancelLabel,
        progress: {
          state: this.checkoutActionProgressState("checkout-cancel-lifecycle"),
          shape: "button"
        }
      });
    }
    const confirmBusy = this.checkoutBusyActionId === "checkout-confirm";
    const confirmLabel = confirmBusy ? this.checkoutBusyLabel(footerState) : this.checkoutContinueLabel(footerState);
    items.push({
      id: "checkout-confirm",
      label: confirmLabel,
      layout: "action",
      palette: this.checkoutConfirmPalette(footerState),
      disabled: !this.canContinue(footerState) || actionsDisabled,
      ariaLabel: confirmLabel,
      progress: {
        state: confirmBusy ? "loading" : !this.busy && this.errorMessage ? "error" : null,
        shape: "button"
      }
    });
    return items;
  }
  checkoutFooterDecisionState() {
    const dialog = this.dialog();
    const targetUnavailable = this.checkoutTargetUnavailable();
    const updateStepActive = this.checkoutUpdateStepActive();
    const totalAmount = dialog ? this.totalAmount() : 0;
    const paymentReviewStateActive = dialog ? this.checkoutPaymentReviewStateActive() : false;
    const pendingReason = !dialog || dialog.approvalGranted || this.paymentStep || paymentReviewStateActive ? null : this.checkoutDecisionPendingReason() ?? this.checkoutBaselinePendingReason;
    const paymentReviewStarted = !updateStepActive && !this.paymentStep && totalAmount > 0 && paymentReviewStateActive;
    const selectionChanged = Boolean(dialog) && (updateStepActive || this.checkoutSelectionSignature(pendingReason) !== this.checkoutBaselineSignature);
    return {
      dialog,
      targetUnavailable,
      updateStepActive,
      paymentReviewStarted,
      pendingReason,
      selectionChanged,
      totalAmount
    };
  }
  checkoutContinueLabel(state) {
    if (!state.dialog) {
      return "Continue";
    }
    if (state.targetUnavailable) {
      return "Unavailable";
    }
    if (state.updateStepActive) {
      return "Update";
    }
    if (this.paymentStep) {
      return "payment";
    }
    if (state.paymentReviewStarted) {
      return state.selectionChanged ? "update" : "continue";
    }
    if (state.pendingReason) {
      if (state.selectionChanged) {
        return "Update";
      }
      return state.pendingReason === "waitlist" ? "waiting.list" : "event.editor.checkout.waiting.approval";
    }
    return "Join";
  }
  checkoutBusyLabel(state) {
    if (!state.dialog) {
      return "Working...";
    }
    if (state.updateStepActive) {
      return "Updating...";
    }
    if (this.paymentStep) {
      return "event.checkout.paying";
    }
    if (state.paymentReviewStarted) {
      return state.selectionChanged ? "updating" : "continuing";
    }
    if (state.pendingReason) {
      return state.selectionChanged ? "Updating..." : "Continuing...";
    }
    if (this.shouldAwaitApprovalBeforePaymentForAmount(state.totalAmount) || this.isWaitingListSelection()) {
      return state.dialog.busyConfirmLabel;
    }
    if (state.totalAmount > 0) {
      return "Join...";
    }
    return state.dialog.busyConfirmLabel;
  }
  checkoutConfirmPalette(state) {
    const footerState = state ?? this.checkoutFooterDecisionState();
    if (footerState.targetUnavailable) {
      return "neutral";
    }
    if (footerState.updateStepActive) {
      return "orange";
    }
    if (footerState.paymentReviewStarted) {
      return footerState.selectionChanged ? "orange" : "success";
    }
    if (footerState.pendingReason) {
      if (footerState.selectionChanged) {
        return "orange";
      }
      return footerState.pendingReason === "waitlist" ? "amber" : "orange";
    }
    return "blue";
  }
  showCheckoutLifecycleCancel() {
    if (this.activeCheckoutBasketItems().some((item) => item.status === "pay")) {
      return false;
    }
    return Boolean(this.checkoutSessionId) || this.checkoutDecisionPending() || this.checkoutLifecycleHasStarted() || this.checkoutDraftHasStarted();
  }
  checkoutLifecycleHasStarted() {
    const lifecycleStates = [
      "confirmed",
      "approval-pending",
      "approved",
      "waiting"
    ];
    return Boolean(this.checkoutBasket?.status && lifecycleStates.includes(this.checkoutBasket.status)) || this.activeCheckoutBasketItems().some((item) => lifecycleStates.includes(item.status));
  }
  checkoutDraftHasStarted() {
    return this.currentCheckoutDraft() !== null;
  }
  checkoutPaymentReviewStarted() {
    if (this.checkoutUpdateStepActive()) {
      return false;
    }
    if (this.paymentStep || this.totalAmount() <= 0) {
      return false;
    }
    if (!this.checkoutPaymentReviewStateActive() && this.checkoutActionPendingReason()) {
      return false;
    }
    return this.checkoutPaymentReviewStateActive();
  }
  checkoutPaymentReviewStateActive() {
    const draft = this.currentCheckoutDraft();
    const checkoutStates = ["confirmed", "pay"];
    return Boolean(draft?.checkoutState && checkoutStates.includes(draft.checkoutState)) || Boolean(this.checkoutBasket?.status && checkoutStates.includes(this.checkoutBasket.status)) || this.activeCheckoutBasketItems().some((item) => checkoutStates.includes(item.status)) || Boolean(this.checkoutSessionId);
  }
  isDraftOnlyCheckout() {
    return this.checkoutDraftHasStarted() && !this.checkoutDecisionPending() && !this.checkoutLifecycleHasStarted() && !this.paymentStep && !this.checkoutSessionId;
  }
  checkoutLifecycleCancelLabel() {
    if (this.checkoutDecisionPendingReason() === "approval") {
      return "Cancel request";
    }
    if (this.checkoutDecisionPendingReason() === "waitlist") {
      return "Leave waitlist";
    }
    if (this.paymentStep || this.checkoutSessionId) {
      return "Cancel payment";
    }
    return "Cancel checkout";
  }
  checkoutLifecycleCancelWarning() {
    return this.isDraftOnlyCheckout() ? "The draft checkout basket will be cancelled and removed." : "The current checkout lifecycle will be closed and kept as a cancelled audit record.";
  }
  requestCancelCheckoutLifecycle(event) {
    event?.preventDefault();
    event?.stopPropagation();
    if (this.busy || !this.showCheckoutLifecycleCancel()) {
      return;
    }
    this.confirmationDialogStore.open({
      title: `${this.checkoutLifecycleCancelLabel()}?`,
      message: this.dialog()?.record.title ?? "Checkout",
      warningMessage: this.checkoutLifecycleCancelWarning(),
      cancelLabel: "Back",
      confirmLabel: this.checkoutLifecycleCancelLabel(),
      busyConfirmLabel: "Cancelling...",
      confirmTone: "danger",
      confirmPalette: "danger",
      failureMessage: "Unable to cancel this checkout.",
      onConfirm: async () => this.cancelCheckoutLifecycle()
    });
  }
  async cancelCheckoutLifecycle() {
    const dialog = this.dialog();
    if (!dialog || this.activeCheckoutBasketItems().some((item) => item.status === "pay")) {
      return;
    }
    if (this.isDraftOnlyCheckout()) {
      await this.cancelDraftCheckout(dialog);
      return;
    }
    const memberDelta = this.checkoutCancelMemberDelta();
    const leaveResult = await this.eventsService.leaveEvent(dialog.userId, dialog.record.id, {
      slotSourceId: this.selectedSlotSourceId,
      removeMembershipOnly: true,
      checkoutState: "cancelled",
      checkoutResultState: "deleted",
      checkoutSessionId: this.checkoutSessionId
    });
    if (!leaveResult || leaveResult.changed === false && leaveResult.reason !== "already-applied" || leaveResult.membershipStatus === "unchanged") {
      throw new Error("Unable to leave event.");
    }
    if (leaveResult.changed !== false) {
      this.signalCheckoutCounterDelta(leaveResult.counterDelta ?? null);
    }
    this.emitCheckoutMembershipSync(dialog.record.id, leaveResult, memberDelta, true);
    this.emitCheckoutMembershipSync(this.selectedSlotSourceId, leaveResult, memberDelta, true);
    this.activitiesStore.emitActivityEventRemoval(dialog.record.id);
    this.checkoutDraftStore.clear(dialog.userId, dialog.record.id);
    this.paymentStep = false;
    this.checkoutSessionId = null;
    this.checkoutBasket = null;
    this.closeCheckoutDialog();
  }
  async cancelDraftCheckout(dialog) {
    await this.eventsService.saveCheckoutBasket(this.buildCheckoutRequest({
      checkoutState: "cancelled",
      resultState: "deleted",
      pendingReason: null
    }));
    this.checkoutDraftStore.clear(dialog.userId, dialog.record.id);
    this.paymentStep = false;
    this.checkoutSessionId = null;
    this.checkoutBasket = null;
    this.selectedSlotSourceId = null;
    this.selectedOptionalSubEventIds = /* @__PURE__ */ new Set();
    this.closeCheckoutDialog();
  }
  async persistCheckoutLifecycleState(checkoutState, resultState, pendingReason = null) {
    const basket = this.checkoutBasketSnapshot();
    if (!basket?.items?.length) {
      return;
    }
    if (this.runtimeCheckoutBasketExists()) {
      await this.eventsService.updateCheckoutBasketState(this.buildCheckoutStateChangeRequest(checkoutState, resultState, pendingReason, this.checkoutSessionId));
      return;
    }
    await this.eventsService.saveCheckoutBasket(this.buildCheckoutRequest({
      checkoutState,
      resultState,
      pendingReason
    }));
  }
  async markCheckoutFailed() {
    try {
      await this.persistCheckoutLifecycleState(this.currentCheckoutState(this.totalAmount()), "failed", this.checkoutDecisionPendingReason());
    } catch {
    }
  }
  successfulCheckoutLifecycleState(paymentSessionId) {
    if (paymentSessionId || this.checkoutSessionId || this.totalAmount() > 0) {
      return "pay";
    }
    if (this.isApprovedAfterOwnerReview()) {
      return "approved";
    }
    return "confirmed";
  }
  resetCheckoutSubmissionForEdit() {
    const dialog = this.dialog();
    if (this.activeCheckoutBasketItems().some((item) => item.status === "pay")) {
      return;
    }
    this.paymentStep = false;
    this.checkoutSessionId = null;
    if (dialog) {
      this.checkoutDraftStore.clear(dialog.userId, dialog.record.id);
    }
    if (!this.checkoutBasket) {
      return;
    }
    this.checkoutBasket = __spreadProps(__spreadValues({}, this.checkoutBasket), {
      status: "draft",
      checkoutSessionId: null,
      items: this.checkoutBasket.items.map((item) => this.isInactiveCheckoutResultState(item.resultState) ? item : __spreadProps(__spreadValues({}, item), {
        status: "draft",
        resultState: "pending",
        checkoutSessionId: null
      }))
    });
  }
  onCheckoutActionMenuSelect(event) {
    if (event.id === "checkout-secondary") {
      if (this.paymentStep) {
        this.requestCheckoutBackToDetails(event.sourceEvent);
      } else {
        this.requestCheckoutClose(event.sourceEvent);
      }
      return;
    }
    if (event.id === "checkout-cancel-lifecycle") {
      this.requestCancelCheckoutLifecycle(event.sourceEvent);
      return;
    }
    if (event.id === "checkout-confirm") {
      this.requestCheckoutConfirm(event.sourceEvent);
    }
  }
  requestCheckoutClose(event) {
    event?.preventDefault();
    event?.stopPropagation();
    if (this.busy) {
      return;
    }
    this.closeCheckoutDialog();
  }
  requestCheckoutBackToDetails(event) {
    event?.preventDefault();
    event?.stopPropagation();
    if (this.busy || !this.paymentStep) {
      return;
    }
    this.backToDetails(event);
  }
  requestCheckoutConfirm(event) {
    event?.preventDefault();
    event?.stopPropagation();
    if (!this.canContinue()) {
      return;
    }
    if (this.checkoutPaymentReviewStarted()) {
      void this.continuePaymentReviewCheckout();
      return;
    }
    if (this.isUnchangedPendingCheckout()) {
      this.closeCheckoutDialog();
      return;
    }
    const label = this.continueLabel();
    this.confirmationDialogStore.open({
      title: `${label}?`,
      message: this.dialog()?.record.title ?? "Checkout",
      warningMessage: this.checkoutConfirmWarningMessage(),
      cancelLabel: "Back",
      confirmLabel: label,
      busyConfirmLabel: this.busyLabel(),
      confirmTone: "accent",
      confirmPalette: this.checkoutConfirmPalette(),
      failureMessage: this.dialog()?.failureMessage ?? "Unable to continue checkout.",
      onConfirm: async () => this.submit()
    });
  }
  async continuePaymentReviewCheckout() {
    const dialog = this.dialog();
    if (!dialog || this.busy || !this.checkoutPaymentReviewStarted()) {
      return;
    }
    if (!this.hasCheckoutSelectionChanges()) {
      this.paymentStep = true;
      this.switchCheckoutReviewPhase();
      return;
    }
    this.busy = true;
    this.checkoutBusyActionId = "checkout-confirm";
    this.errorMessage = "";
    this.paymentStep = true;
    this.switchCheckoutReviewPhase();
    try {
      this.checkoutSessionId = null;
      await dialog.onSubmit(this.buildSelection(null, true, {
        checkoutState: "confirmed",
        pendingReason: null,
        includeBasketPayload: true
      }));
      await this.persistCheckoutDraft(false, null, "confirmed");
      this.refreshCheckoutBaseline();
    } catch (error) {
      this.paymentStep = false;
      this.setCheckoutErrorMessage(dialog, error, dialog.failureMessage);
    } finally {
      this.busy = false;
      this.checkoutBusyActionId = null;
      this.switchCheckoutReviewPhase();
    }
  }
  checkoutConfirmWarningMessage() {
    if (this.checkoutUpdateStepActive()) {
      return "The updated basket will be saved before continuing.";
    }
    if (this.checkoutPaymentReviewStarted() && this.hasCheckoutSelectionChanges()) {
      return "The updated basket will be saved before returning to payment.";
    }
    if (this.checkoutActionPendingReason() && this.hasCheckoutSelectionChanges()) {
      return "The updated basket will be sent to the organizer for review.";
    }
    if (this.isWaitingListSelection()) {
      return "The basket will join the waitlist and stay visible until it is cancelled or promoted.";
    }
    if (this.shouldAwaitApprovalBeforePayment()) {
      return "The basket will be submitted for approval and stay visible until it is cancelled or approved.";
    }
    if (!this.paymentStep && this.totalAmount() > 0) {
      return "The basket will be confirmed before opening payment.";
    }
    if (this.paymentStep || this.checkoutSessionId) {
      return "Payment will run for the selected basket item.";
    }
    return "The selected basket item will be joined.";
  }
  paymentDisabled() {
    return !environment.paymentIntegrationEnabled;
  }
  canContinue(state) {
    if (this.isReadOnlyCheckoutSummary()) {
      return false;
    }
    if (this.busy || this.dialog()?.loading || this.checkoutReviewBodyLoading()) {
      return false;
    }
    const footerState = state ?? this.checkoutFooterDecisionState();
    if (footerState.pendingReason && !footerState.selectionChanged) {
      return false;
    }
    if (footerState.targetUnavailable) {
      return false;
    }
    if (this.requiresSlotSelection() && this.checkoutBasketItems().length === 0) {
      return false;
    }
    return true;
  }
  currentCheckoutState(_totalAmount, pendingReasonOverride) {
    if (this.activeCheckoutBasketItems().some((item) => item.status === "pay")) {
      return "pay";
    }
    if (this.activeCheckoutBasketItems().some((item) => item.status === "waiting")) {
      return "waiting";
    }
    const pendingReason = pendingReasonOverride === void 0 ? this.checkoutDecisionPendingReason() : pendingReasonOverride;
    if (pendingReason === "approval") {
      return "approval-pending";
    }
    if (pendingReason === "waitlist") {
      return "waiting";
    }
    if (this.isApprovedAfterOwnerReview()) {
      return "approved";
    }
    if (this.paymentStep || this.checkoutSessionId) {
      return "confirmed";
    }
    return "draft";
  }
  isApprovedAfterOwnerReview() {
    const dialog = this.dialog();
    if (!dialog?.approvalGranted) {
      return false;
    }
    const draft = this.checkoutDraftStore.read(dialog.userId, dialog.record.id);
    return draft?.pendingReason === "approval" || draft?.checkoutState === "approval-pending" || draft?.checkoutState === "approved" || this.checkoutBasket?.status === "approval-pending" || this.checkoutBasket?.status === "approved";
  }
  shouldAwaitApprovalBeforePayment() {
    return this.shouldAwaitApprovalBeforePaymentForAmount(this.totalAmount());
  }
  shouldAwaitApprovalBeforePaymentForAmount(_totalAmount) {
    const dialog = this.dialog();
    if (!dialog) {
      return false;
    }
    return dialog.requiresApprovalBeforePayment && !dialog.approvalGranted;
  }
  checkoutDecisionPending() {
    return this.checkoutDecisionPendingReason() !== null;
  }
  checkoutActionPendingReason() {
    const dialog = this.dialog();
    if (!dialog || dialog.approvalGranted || this.paymentStep || this.checkoutPaymentReviewStateActive()) {
      return null;
    }
    return this.checkoutDecisionPendingReason() ?? this.checkoutBaselinePendingReason;
  }
  isUnchangedPendingCheckout() {
    return this.checkoutActionPendingReason() !== null && !this.hasCheckoutSelectionChanges();
  }
  checkoutUpdateStepActive() {
    return this.checkoutDraftBasketChanged();
  }
  checkoutEditorPhase() {
    return this.isReadOnlyCheckoutSummary() || this.paymentStep && !this.checkoutUpdateStepActive() ? "payment" : "review";
  }
  hasCheckoutSelectionChanges() {
    return this.checkoutDraftBasketChanged() || this.checkoutSelectionSignature() !== this.checkoutBaselineSignature;
  }
  checkoutDraftBasketChanged() {
    return this.currentCheckoutDraft()?.basketChanged === true;
  }
  refreshCheckoutBaseline() {
    this.checkoutBaselinePendingReason = this.checkoutPaymentReviewStateActive() ? null : this.checkoutDecisionPendingReason();
    this.checkoutBaselineSignature = this.checkoutSelectionSignature();
  }
  currentCheckoutDraft() {
    const dialog = this.dialog();
    return dialog ? this.checkoutDraftStore.read(dialog.userId, dialog.record.id) : null;
  }
  isReadOnlyCheckoutSummary() {
    return this.dialog()?.readOnlySummary === true;
  }
  checkoutHasStoredPendingMembership() {
    const pendingStates = ["waiting", "approval-pending", "approved"];
    const draft = this.currentCheckoutDraft();
    if (draft?.pendingReason === "waitlist" || draft?.pendingReason === "approval") {
      return true;
    }
    if (draft?.checkoutState && pendingStates.includes(draft.checkoutState)) {
      return true;
    }
    if (this.checkoutBasket?.status && pendingStates.includes(this.checkoutBasket.status)) {
      return true;
    }
    return this.activeCheckoutBasketItems().some((item) => pendingStates.includes(item.status));
  }
  checkoutSuccessMemberDelta() {
    return this.checkoutHasStoredPendingMembership() ? { acceptedMemberDelta: 1, pendingMemberDelta: -1 } : { acceptedMemberDelta: 1, pendingMemberDelta: 0 };
  }
  checkoutCancelMemberDelta() {
    if (this.checkoutHasStoredPendingMembership()) {
      return { acceptedMemberDelta: 0, pendingMemberDelta: -1 };
    }
    if (this.checkoutSessionId || this.activeCheckoutBasketItems().some((item) => item.status === "pay")) {
      return { acceptedMemberDelta: -1, pendingMemberDelta: 0 };
    }
    return null;
  }
  signalCheckoutCounterDelta(delta) {
    const dialog = this.dialog();
    if (!dialog || !delta) {
      return;
    }
    this.activityStore.patchUserCounterDeltas(dialog.userId, delta, null);
  }
  emitCheckoutActivityEventSync(dialog, result) {
    this.activitiesStore.emitActivityEventSync(this.buildCheckoutActivityEventSync(dialog, result));
  }
  buildCheckoutActivityEventSync(dialog, result) {
    const record = dialog.record;
    const activeUserId = dialog.userId.trim();
    const slot = this.checkoutActivityEventSlot(dialog, result);
    const startAtIso = slot?.startAtIso ?? record.startAtIso;
    const endAtIso = slot?.endAtIso ?? record.endAtIso ?? startAtIso;
    const acceptedMemberUserIds = this.uniqueCheckoutUserIds([
      ...record.acceptedMemberUserIds ?? [],
      activeUserId
    ]);
    const pendingMemberUserIds = this.uniqueCheckoutUserIds(record.pendingMemberUserIds ?? []).filter((userId) => userId !== activeUserId);
    const invitedMemberUserIds = this.uniqueCheckoutUserIds(record.invitedMemberUserIds ?? []).filter((userId) => userId !== activeUserId);
    const pendingRequestMemberUserIds = this.uniqueCheckoutUserIds(record.pendingRequestMemberUserIds ?? []).filter((userId) => userId !== activeUserId);
    const acceptedMembers = Math.max(this.nonNegativeCheckoutInteger(result.acceptedMembers), acceptedMemberUserIds.length);
    const pendingMembers = Math.max(this.nonNegativeCheckoutInteger(result.pendingMembers), pendingMemberUserIds.length, pendingRequestMemberUserIds.length);
    const capacityTotal = Math.max(acceptedMembers, this.nonNegativeCheckoutInteger(result.capacityTotal), this.nonNegativeCheckoutInteger(slot?.capacityTotal), this.nonNegativeCheckoutInteger(record.capacityTotal));
    return {
      id: record.id,
      userId: activeUserId || record.userId,
      type: record.type,
      status: record.status ?? "A",
      statusBeforeSuppression: record.statusBeforeSuppression ?? null,
      adminIds: [...record.adminIds ?? []],
      title: record.title,
      subtitle: record.subtitle,
      timeframe: slot?.timeframe ?? record.timeframe,
      inviter: record.inviter ?? null,
      activity: this.nonNegativeCheckoutInteger(record.activity),
      creatorUserId: record.creatorUserId,
      creatorName: record.creatorName,
      creatorInitials: record.creatorInitials,
      creatorCity: record.creatorCity,
      visibility: record.visibility,
      startAtIso,
      endAtIso,
      distanceKm: Number.isFinite(Number(record.distanceKm)) ? Number(record.distanceKm) : 0,
      imageUrl: record.imageUrl,
      location: record.location,
      capacityTotal,
      full: result.full === true || capacityTotal > 0 && acceptedMembers >= capacityTotal,
      capacityMin: record.capacityMin ?? null,
      capacityMax: record.capacityMax ?? null,
      eventType: record.eventType,
      mode: record.mode,
      slotsEnabled: record.slotsEnabled === true,
      acceptedMembers,
      pendingMembers,
      acceptedMemberUserIds,
      pendingMemberUserIds,
      invitedMemberUserIds,
      pendingRequestMemberUserIds,
      pendingReason: null,
      approvalRequired: record.approvalRequired === true,
      checkoutResultState: "succeeded",
      boost: this.nonNegativeCheckoutInteger(record.boost),
      subEventDefinitions: record.subEventDefinitions?.map((item) => __spreadValues({}, item))
    };
  }
  checkoutActivityEventSlot(dialog, result) {
    const slotSourceId = result.slotSourceId?.trim() || this.selectedSlotSourceId?.trim() || this.checkoutBasket?.slotSourceId?.trim() || this.activeCheckoutBasketItems().find((item) => item.slotSourceId?.trim())?.slotSourceId?.trim() || "";
    const slots = [
      ...this.availableSlotsCache,
      ...dialog.record.upcomingSlots ?? [],
      ...dialog.record.nextSlot ? [dialog.record.nextSlot] : []
    ];
    if (slotSourceId) {
      const direct = slots.find((slot) => slot.id === slotSourceId);
      if (direct) {
        return direct;
      }
    }
    const selectedDateKey = this.checkoutSlotPickerSelectedDateKey();
    return selectedDateKey ? slots.find((slot) => this.slotDateKeyFromIso(slot.startAtIso) === selectedDateKey) ?? null : null;
  }
  uniqueCheckoutUserIds(userIds) {
    return [...new Set(userIds.map((userId) => userId.trim()).filter(Boolean))];
  }
  nonNegativeCheckoutInteger(value) {
    return Math.max(0, Math.trunc(Number(value) || 0));
  }
  emitCheckoutMembershipSync(sourceId, result, memberDelta = null, viewerMembershipRemoved = false, checkoutResultState = null) {
    const dialog = this.dialog();
    const normalizedSourceId = sourceId?.trim() ?? "";
    if (!dialog || !normalizedSourceId) {
      return;
    }
    const record = this.eventsService.peekKnownRecordById(dialog.userId, normalizedSourceId);
    const matchingResult = result?.sourceId === normalizedSourceId ? result : null;
    const acceptedMembers = matchingResult?.acceptedMembers ?? record?.acceptedMembers ?? null;
    const pendingMembers = matchingResult?.pendingMembers ?? record?.pendingMembers ?? null;
    const capacityTotal = matchingResult?.capacityTotal ?? record?.capacityTotal ?? null;
    if (acceptedMembers == null || pendingMembers == null || capacityTotal == null) {
      return;
    }
    const full = matchingResult?.full === true || record?.full === true || Math.max(0, Math.trunc(Number(capacityTotal) || 0)) > 0 && Math.max(0, Math.trunc(Number(acceptedMembers) || 0)) >= Math.max(0, Math.trunc(Number(capacityTotal) || 0));
    this.activityStore.emitActivityMembersSync(__spreadValues(__spreadValues(__spreadValues(__spreadValues({
      id: normalizedSourceId,
      acceptedMembers,
      pendingMembers,
      capacityTotal
    }, full ? { full: true } : {}), checkoutResultState ? { checkoutResultState } : {}), viewerMembershipRemoved ? { viewerMembershipRemoved: true } : {}), memberDelta ?? {}));
  }
  pendingReasonForJoinRequest() {
    if (this.isWaitingListSelection()) {
      return "waitlist";
    }
    return this.shouldAwaitApprovalBeforePayment() ? "approval" : null;
  }
  checkoutDecisionPendingReason() {
    const dialog = this.dialog();
    if (!dialog || dialog.approvalGranted) {
      return null;
    }
    const draft = this.checkoutDraftStore.read(dialog.userId, dialog.record.id);
    const statePendingReason = this.checkoutStatePendingReason(draft?.checkoutState) ?? this.checkoutStatePendingReason(this.checkoutBasket?.status);
    if (statePendingReason) {
      return statePendingReason;
    }
    if (draft?.checkoutState || this.checkoutBasket?.status) {
      return null;
    }
    if (draft?.pendingReason === "approval" || draft?.pendingReason === "waitlist") {
      return draft.pendingReason;
    }
    return null;
  }
  checkoutStatePendingReason(checkoutState) {
    if (checkoutState === "waiting") {
      return "waitlist";
    }
    if (checkoutState === "approval-pending") {
      return "approval";
    }
    return null;
  }
  isWaitingListSelection() {
    const dialog = this.dialog();
    if (!dialog || dialog.approvalGranted) {
      return false;
    }
    const slot = this.selectedSlot();
    if (slot) {
      return this.isSlotFull(slot);
    }
    if (this.requiresSlotSelection()) {
      return dialog.pendingReason === "waitlist";
    }
    return this.isRecordFull(dialog.record) || dialog.pendingReason === "waitlist";
  }
  pendingNoticeTitle() {
    return this.isWaitingListSelection() ? "Waiting List" : "Approval Required";
  }
  pendingNoticeText() {
    if (this.isWaitingListSelection()) {
      return "Send the wait request now. Payment stays locked in the basket until a spot opens and the system invites you to finish checkout.";
    }
    return "Send the request now. Payment unlocks in the basket after the event admin approves it.";
  }
  slotCapacityLabel(slot) {
    return this.isSlotFull(slot) ? `${slot.acceptedMembers} / ${slot.capacityTotal} \xB7 full` : `${slot.acceptedMembers} / ${slot.capacityTotal}`;
  }
  async submit(event) {
    event?.stopPropagation();
    const dialog = this.dialog();
    if (!dialog || !this.canContinue()) {
      return;
    }
    if (this.checkoutTargetUnavailable()) {
      this.errorMessage = "This place is no longer available.";
      return;
    }
    const pendingActionReason = this.checkoutActionPendingReason();
    const selectionChanged = this.hasCheckoutSelectionChanges();
    if (pendingActionReason && !selectionChanged) {
      this.closeCheckoutDialog();
      return;
    }
    if (this.checkoutUpdateStepActive()) {
      this.busy = true;
      this.checkoutBusyActionId = "checkout-confirm";
      this.errorMessage = "";
      try {
        const draft = this.currentCheckoutDraft();
        const pendingReason = draft?.pendingReason ?? this.checkoutDecisionPendingReason();
        const checkoutState = draft?.checkoutState ?? this.currentCheckoutState(this.totalAmount(), pendingReason);
        this.checkoutSessionId = null;
        await this.syncRuntimeCheckoutBasket(checkoutState, pendingReason, true);
        await this.persistCheckoutDraft(false, pendingReason, checkoutState, false);
        this.refreshCheckoutBaseline();
        this.paymentStep = false;
        this.openCheckoutReviewEditorShell(dialog);
      } catch (error) {
        this.setCheckoutErrorMessage(dialog, error, dialog.failureMessage);
      } finally {
        this.busy = false;
        this.checkoutBusyActionId = null;
      }
      return;
    }
    let keepCheckoutReviewOpen = false;
    if (!this.paymentStep && (pendingActionReason || this.shouldAwaitApprovalBeforePayment() || this.isWaitingListSelection())) {
      this.busy = true;
      this.checkoutBusyActionId = "checkout-confirm";
      this.errorMessage = "";
      try {
        const pendingReason = pendingActionReason ?? this.pendingReasonForJoinRequest();
        const checkoutState = pendingReason === "approval" ? "approval-pending" : pendingReason === "waitlist" ? "waiting" : "confirmed";
        await dialog.onSubmit(this.buildSelection(null, false, {
          checkoutState,
          pendingReason,
          // The join write is the authoritative persistence boundary. A basket
          // assembled in this popup may only exist in the local draft store, so
          // its presence must not suppress the physical basket payload.
          includeBasketPayload: true
        }));
        await this.persistCheckoutDraft(false, pendingReason, checkoutState);
        this.refreshCheckoutBaseline();
        keepCheckoutReviewOpen = pendingReason === "waitlist";
        if (!keepCheckoutReviewOpen) {
          this.closeCheckoutDialog();
        }
      } catch (error) {
        this.setCheckoutErrorMessage(dialog, error, dialog.failureMessage);
      } finally {
        this.busy = false;
        this.checkoutBusyActionId = null;
        if (keepCheckoutReviewOpen && this.dialog()?.id === dialog.id) {
          this.paymentStep = false;
          this.openCheckoutReviewEditorShell(dialog);
        }
      }
      return;
    }
    if (!this.paymentStep && this.totalAmount() > 0) {
      this.busy = true;
      this.checkoutBusyActionId = "checkout-confirm";
      this.errorMessage = "";
      this.paymentStep = true;
      this.switchCheckoutReviewPhase();
      try {
        this.checkoutSessionId = null;
        await this.persistCheckoutDraft(true, null, "confirmed");
        this.refreshCheckoutBaseline();
      } catch (error) {
        this.paymentStep = false;
        this.setCheckoutErrorMessage(dialog, error, dialog.failureMessage);
      } finally {
        this.busy = false;
        this.checkoutBusyActionId = null;
        this.switchCheckoutReviewPhase();
      }
      return;
    }
    this.busy = true;
    this.checkoutBusyActionId = "checkout-confirm";
    this.errorMessage = "";
    try {
      const memberDelta = this.checkoutSuccessMemberDelta();
      const joinResult = await this.eventsService.payEventCheckout(this.buildCheckoutStateChangeRequest("pay", "succeeded", null, null));
      const paymentUrl = AppUtils.normalizeHttpUrl(joinResult?.paymentUrl);
      if (joinResult?.membershipStatus === "payment_pending" && paymentUrl) {
        this.checkoutSessionId = joinResult.paymentSessionId ?? null;
        window.location.assign(paymentUrl);
        return;
      }
      if (!joinResult || joinResult.membershipStatus !== "accepted") {
        throw new Error(dialog.failureMessage);
      }
      this.signalCheckoutCounterDelta(joinResult.counterDelta ?? null);
      this.emitCheckoutActivityEventSync(dialog, joinResult);
      this.emitCheckoutMembershipSync(dialog.record.id, joinResult, memberDelta, false, "succeeded");
      this.emitCheckoutMembershipSync(this.selectedSlotSourceId, joinResult, memberDelta);
      this.checkoutSessionId = joinResult.paymentSessionId ?? null;
      this.clearCheckoutDraft();
      this.closeCheckoutDialog();
    } catch (error) {
      this.setCheckoutErrorMessage(dialog, error, dialog.failureMessage);
    } finally {
      this.busy = false;
      this.checkoutBusyActionId = null;
    }
  }
  backToDetails(event) {
    event?.stopPropagation();
    if (this.busy) {
      return;
    }
    this.releaseUnpaidPaymentSession();
    this.switchCheckoutReviewPhase();
    this.errorMessage = "";
  }
  trackLineItem(_index, item) {
    return item.id;
  }
  trackPolicy(_index, item) {
    return item.id;
  }
  trackOptionalSubEvent(_index, item) {
    return item.id;
  }
  trackSlot(_index, item) {
    return item.id;
  }
  initializeDialogState(dialog) {
    this.rebuildSlotCaches(dialog.record.upcomingSlots ?? []);
    const firstSlot = dialog.record.upcomingSlots?.[0] ?? null;
    const draft = this.checkoutDraftStore.read(dialog.userId, dialog.record.id);
    const validOptionalIds = new Set(this.optionalSubEvents().map((item) => item.id));
    const validPolicyIds = new Set(this.policies().map((item) => item.id));
    const validSlotIds = new Set(this.availableSlots().map((item) => item.id));
    this.selectedSlotSourceId = draft?.slotSourceId && validSlotIds.has(draft.slotSourceId) ? draft.slotSourceId : null;
    const selectedSlot = this.selectedSlotSourceId ? this.availableSlots().find((item) => item.id === this.selectedSlotSourceId) ?? null : null;
    this.selectedSlotDateValue = selectedSlot ? this.slotDateValueFromIso(selectedSlot.startAtIso) : (draft?.selectedDateKey ? this.slotDateValueFromKey(draft.selectedDateKey) : null) ?? (firstSlot ? this.slotDateValueFromIso(firstSlot.startAtIso) : null);
    this.slotPageIndex = 0;
    this.selectedOptionalSubEventIds = new Set((draft?.optionalSubEventIds ?? []).filter((item) => validOptionalIds.has(item)));
    this.acceptedPolicyIds = new Set((draft?.acceptedPolicyIds ?? []).filter((item) => validPolicyIds.has(item)));
    this.appliedPromoCodes = this.validAppliedPromoCodes(draft?.appliedPromoCodes ?? []);
    const draftHasVisibleItems = this.hasVisibleCheckoutItems(draft?.basketItems);
    this.paymentStep = draftHasVisibleItems ? this.shouldOpenPaymentStepFromDraft(draft) : false;
    this.checkoutSessionId = draftHasVisibleItems ? draft?.checkoutSessionId ?? null : null;
    this.checkoutBasket = draftHasVisibleItems && draft?.basketItems?.length && !this.shouldSuppressStoredWaitlistBasket(dialog, draft.basketItems) ? {
      userId: dialog.userId,
      sourceId: dialog.record.id,
      status: draft.checkoutState,
      items: draft.basketItems,
      pricingSummaryRows: draft.pricingSummaryRows,
      lineItems: draft.lineItems,
      totalAmount: draft.totalAmount,
      currency: draft.currency,
      slotSourceId: draft.slotSourceId,
      selectedDateKey: draft.selectedDateKey,
      checkoutSessionId: draft.checkoutSessionId,
      expiresAtIso: draft.expiresAtIso,
      appliedPromoCodes: [...this.appliedPromoCodes]
    } : null;
    if (dialog.hasPreloadedCheckoutBasket && this.hasVisibleCheckoutItems(dialog.preloadedCheckoutBasket?.items)) {
      this.checkoutBasket = ActivityEventDetailDTO.cloneCheckoutBasket(dialog.preloadedCheckoutBasket);
      this.appliedPromoCodes = this.validAppliedPromoCodes(this.checkoutBasket?.appliedPromoCodes ?? []);
    }
    this.refreshCheckoutBaseline();
    this.busy = false;
    this.checkoutBusyActionId = null;
    this.errorMessage = "";
  }
  async loadRuntimeCheckoutBasket(dialog) {
    let queriedBasket = null;
    if (dialog.hasPreloadedCheckoutBasket) {
      queriedBasket = ActivityEventDetailDTO.cloneCheckoutBasket(dialog.preloadedCheckoutBasket);
    } else {
      try {
        queriedBasket = await this.eventsService.loadCheckoutBasketByEvent(dialog.userId, dialog.record.id);
      } catch {
        queriedBasket = null;
      }
    }
    const candidateBasket = queriedBasket ?? this.checkoutBasket;
    const basket = candidateBasket && this.shouldSuppressStoredWaitlistBasket(dialog, candidateBasket.items) ? null : candidateBasket;
    const basketHasVisibleItems = this.hasVisibleCheckoutItems(basket?.items);
    this.checkoutBasket = basketHasVisibleItems ? basket : null;
    if (!basket || !basketHasVisibleItems) {
      this.checkoutSessionId = null;
      this.paymentStep = false;
      this.refreshCheckoutBaseline();
      return;
    }
    this.appliedPromoCodes = this.validAppliedPromoCodes(basket.appliedPromoCodes ?? this.appliedPromoCodes);
    const firstSlotSourceId = basket.items.find((item) => item.slotSourceId?.trim())?.slotSourceId?.trim() ?? null;
    const validSlotIds = new Set(this.availableSlots().map((item) => item.id));
    this.selectedSlotSourceId = firstSlotSourceId && validSlotIds.has(firstSlotSourceId) ? firstSlotSourceId : this.selectedSlotSourceId;
    const selectedDateKey = basket.selectedDateKey ?? basket.items.find((item) => item.selectedDateKey?.trim())?.selectedDateKey ?? null;
    if (selectedDateKey) {
      this.selectedSlotDateValue = this.slotDateValueFromKey(selectedDateKey) ?? this.selectedSlotDateValue;
    }
    this.checkoutSessionId = basket.checkoutSessionId ?? this.checkoutSessionId;
    this.paymentStep = this.shouldOpenPaymentStepFromBasket(basket);
    this.refreshCheckoutBaseline();
  }
  shouldOpenPaymentStepFromDraft(draft) {
    if (this.isReadOnlyCheckoutSummary()) {
      return true;
    }
    if (!draft) {
      return false;
    }
    if (draft.basketChanged === true) {
      return false;
    }
    if (!this.hasActiveCheckoutItems(draft.basketItems)) {
      return false;
    }
    if (Boolean(draft.checkoutSessionId?.trim())) {
      return true;
    }
    return draft.checkoutState === "confirmed" && !draft.pendingReason && Math.max(0, Number(draft.totalAmount) || 0) > 0;
  }
  shouldOpenPaymentStepFromBasket(basket) {
    if (this.isReadOnlyCheckoutSummary()) {
      return true;
    }
    if (this.checkoutDraftBasketChanged()) {
      return false;
    }
    if (!basket) {
      return this.paymentStep;
    }
    if (!this.hasActiveCheckoutItems(basket.items)) {
      return false;
    }
    if (Boolean(basket.checkoutSessionId?.trim())) {
      return true;
    }
    return basket.status === "confirmed" && Math.max(0, Number(basket.totalAmount) || 0) > 0;
  }
  shouldSuppressImplicitWaitlistBasket() {
    const dialog = this.dialog();
    return Boolean(dialog && !dialog.approvalGranted && dialog.pendingReason === "waitlist");
  }
  shouldSuppressStoredWaitlistBasket(dialog, items) {
    if (dialog.approvalGranted || dialog.pendingReason !== "waitlist") {
      return false;
    }
    const activeItems = (items ?? []).filter((item) => !this.isInactiveCheckoutResultState(item.resultState));
    return activeItems.length > 0 && activeItems.every((item) => this.isImplicitMainEventBasketItem(dialog, item));
  }
  hasActiveCheckoutItems(items) {
    return (items ?? []).some((item) => !this.isInactiveCheckoutResultState(item.resultState));
  }
  hasVisibleCheckoutItems(items) {
    if (this.isReadOnlyCheckoutSummary()) {
      return (items ?? []).some((item) => item.resultState !== "deleted");
    }
    return this.hasActiveCheckoutItems(items);
  }
  isImplicitMainEventBasketItem(dialog, item) {
    return item.kind === "event" && (item.sourceId?.trim() ?? "") === dialog.record.id && !item.slotSourceId?.trim() && !item.subEventId?.trim() && !item.resourceType?.trim();
  }
  resetDialogState() {
    this.renderedDialogId = 0;
    this.renderedDialogLoading = false;
    this.availableSlotsCache = [];
    this.availableSlotDateEntriesCache = [];
    this.availableSlotDateKeySet = /* @__PURE__ */ new Set();
    this.selectedSlotSourceId = null;
    this.selectedSlotDateValue = null;
    this.slotPageIndex = 0;
    this.selectedOptionalSubEventIds = /* @__PURE__ */ new Set();
    this.acceptedPolicyIds = /* @__PURE__ */ new Set();
    this.appliedPromoCodes = [];
    this.validatedPromoCodeDefinitions.clear();
    this.promoCodePopupOpen.set(false);
    this.paymentStep = false;
    this.checkoutSessionId = null;
    this.checkoutBasket = null;
    this.checkoutBaselineSignature = "";
    this.checkoutBaselinePendingReason = null;
    this.busy = false;
    this.checkoutBusyActionId = null;
    this.errorMessage = "";
  }
  buildSelection(paymentSessionId, bookingConfirmed = true, options = {}) {
    const dialog = this.dialog();
    if (!dialog) {
      throw new Error("Checkout session is not available.");
    }
    const pendingReason = options.pendingReason === void 0 ? bookingConfirmed === false ? this.pendingReasonForJoinRequest() : null : options.pendingReason;
    const checkoutState = options.checkoutState ?? this.currentCheckoutState(this.totalAmount(), pendingReason);
    const includeBasketPayload = options.includeBasketPayload !== false;
    return __spreadProps(__spreadValues({
      sourceId: dialog.record.id,
      slotSourceId: this.selectedSlotSourceId,
      optionalSubEventIds: [...this.selectedOptionalSubEventIds],
      assetSelections: [],
      acceptedPolicyIds: [...this.acceptedPolicyIds],
      appliedPromoCodes: [...this.appliedPromoCodes]
    }, includeBasketPayload ? {
      basketItems: this.checkoutBasketItems(checkoutState, options.resultState),
      pricingSummaryRows: this.checkoutBasketPricingSummaryRows()
    } : {}), {
      checkoutState,
      lineItems: this.lineItems(),
      totalAmount: this.totalAmount(),
      currency: this.currency(),
      paymentSessionId,
      bookingConfirmed,
      pendingReason
    });
  }
  buildCheckoutRequest(options = {}) {
    const dialog = this.dialog();
    if (!dialog) {
      throw new Error("Checkout session is not available.");
    }
    const pendingReason = options.pendingReason === void 0 ? this.checkoutDecisionPendingReason() : options.pendingReason;
    const checkoutState = options.checkoutState ?? this.currentCheckoutState(this.totalAmount(), pendingReason);
    return {
      userId: dialog.userId,
      sourceId: dialog.record.id,
      slotSourceId: this.selectedSlotSourceId,
      optionalSubEventIds: [...this.selectedOptionalSubEventIds],
      assetSelections: [],
      acceptedPolicyIds: [...this.acceptedPolicyIds],
      appliedPromoCodes: [...this.appliedPromoCodes],
      basketItems: this.checkoutBasketItems(checkoutState, options.resultState),
      pricingSummaryRows: this.checkoutBasketPricingSummaryRows(),
      checkoutState,
      lineItems: this.lineItems(),
      totalAmount: this.totalAmount(),
      currency: this.currency(),
      pendingReason
    };
  }
  buildCheckoutStateChangeRequest(checkoutState, resultState = null, pendingReason = null, checkoutSessionId = null) {
    const dialog = this.dialog();
    if (!dialog) {
      throw new Error("Checkout session is not available.");
    }
    return {
      userId: dialog.userId,
      sourceId: dialog.record.id,
      slotSourceId: this.selectedSlotSourceId,
      checkoutState,
      resultState,
      pendingReason,
      checkoutSessionId,
      checkoutRequest: checkoutState === "pay" ? this.buildCheckoutRequest({
        checkoutState: "confirmed",
        pendingReason: null
      }) : null
    };
  }
  resolvePricing(pricing, record, slotId, slot, appliedPromoCodes = []) {
    const slotCatalog = PricingBuilder.slotCatalogFromEventSlotTemplates(record.slotTemplates ?? []);
    const normalized = PricingBuilder.compactPricingConfig(pricing, {
      context: "event",
      slotCatalog,
      allowSlotFeatures: slotCatalog.length > 0
    });
    if (!normalized.enabled) {
      return {
        amount: 0,
        currency: normalized.currency || "USD",
        rows: []
      };
    }
    const currency = normalized.currency || "USD";
    const previewBase = normalized.slotPricingEnabled && slotId ? normalized.slotOverrides.find((item) => item.slotId === slotId)?.price ?? normalized.basePrice : normalized.basePrice;
    const rows = [{
      key: normalized.slotPricingEnabled && slotId ? `base:${slotId}` : "base",
      label: normalized.slotPricingEnabled && slotId ? "Slot base price" : "Base price",
      detail: null,
      amount: previewBase,
      currency,
      multiplier: 1
    }];
    const capacityFilledPercent = record.capacityTotal > 0 ? Math.round(record.acceptedMembers / record.capacityTotal * 100) : 0;
    const hoursUntilStart = this.resolveHoursUntilStart(slot?.startAtIso ?? record.startAtIso);
    let nextPrice = previewBase;
    if ((normalized.mode === "demand-based" || normalized.mode === "hybrid") && normalized.demandRulesEnabled) {
      for (const rule of normalized.demandRules) {
        if (!this.matchesDemandRule(rule, capacityFilledPercent, slotId)) {
          continue;
        }
        const previousPrice = nextPrice;
        nextPrice = this.applyPricingAction(nextPrice, rule.action);
        rows.push({
          key: `demand:${rule.id}`,
          label: "Demand pricing",
          detail: this.describePricingAction(rule.action),
          amount: Math.round((nextPrice - previousPrice) * 100) / 100,
          currency,
          multiplier: 1
        });
      }
    }
    if ((normalized.mode === "time-based" || normalized.mode === "hybrid") && normalized.timeRulesEnabled) {
      for (const rule of normalized.timeRules) {
        if (!this.matchesTimeRule(rule, hoursUntilStart, slotId, slot?.startAtIso ?? record.startAtIso)) {
          continue;
        }
        const previousPrice = nextPrice;
        nextPrice = this.applyPricingAction(nextPrice, rule.action);
        rows.push({
          key: `time:${rule.id}`,
          label: "Time pricing",
          detail: this.describePricingAction(rule.action),
          amount: Math.round((nextPrice - previousPrice) * 100) / 100,
          currency,
          multiplier: 1
        });
      }
    }
    if (normalized.minPrice !== null) {
      const previousPrice = nextPrice;
      nextPrice = Math.max(normalized.minPrice, nextPrice);
      if (nextPrice !== previousPrice) {
        rows.push({
          key: "min-price",
          label: "Minimum price",
          detail: null,
          amount: Math.round((nextPrice - previousPrice) * 100) / 100,
          currency,
          multiplier: 1
        });
      }
    }
    if (normalized.maxPrice !== null) {
      const previousPrice = nextPrice;
      nextPrice = Math.min(normalized.maxPrice, nextPrice);
      if (nextPrice !== previousPrice) {
        rows.push({
          key: "max-price",
          label: "Maximum price",
          detail: null,
          amount: Math.round((nextPrice - previousPrice) * 100) / 100,
          currency,
          multiplier: 1
        });
      }
    }
    if (normalized.audience.enabled && appliedPromoCodes.length > 0) {
      const configuredPromoCodes = new Map((normalized.audience.promoCodes ?? []).map((item) => [this.normalizePromoCode(item.code), item]).filter(([code]) => Boolean(code)));
      for (const [code, definition] of this.validatedPromoCodeDefinitions) {
        configuredPromoCodes.set(code, definition);
      }
      for (const code of this.normalizeAppliedPromoCodes(appliedPromoCodes)) {
        const promo = configuredPromoCodes.get(code);
        if (!promo) {
          continue;
        }
        const previousPrice = nextPrice;
        nextPrice = this.applyPricingAction(nextPrice, promo.action);
        rows.push({
          key: `promo:${promo.id || code}`,
          label: `Promo code ${code}`,
          detail: this.describePricingAction(promo.action),
          amount: Math.round((nextPrice - previousPrice) * 100) / 100,
          currency,
          multiplier: 1
        });
      }
    }
    const roundedPrice = this.applyRounding(nextPrice, normalized.rounding);
    if (roundedPrice !== nextPrice) {
      rows.push({
        key: "rounding",
        label: "Rounding",
        detail: null,
        amount: Math.round((roundedPrice - nextPrice) * 100) / 100,
        currency,
        multiplier: 1
      });
    }
    return {
      amount: roundedPrice,
      currency,
      rows
    };
  }
  matchesDemandRule(rule, capacityFilledPercent, slotId) {
    if (rule.appliesTo === "selected_slots" && (!slotId || !(rule.slotIds ?? []).includes(slotId))) {
      return false;
    }
    if (rule.operator === "lte") {
      return capacityFilledPercent <= rule.capacityFilledPercent;
    }
    return capacityFilledPercent >= rule.capacityFilledPercent;
  }
  matchesTimeRule(rule, hoursUntilStart, slotId, comparisonIso) {
    if (rule.appliesTo === "selected_slots" && (!slotId || !(rule.slotIds ?? []).includes(slotId))) {
      return false;
    }
    if (rule.trigger === "specific_date") {
      const start = (rule.specificDateStart ?? "").trim();
      const end = (rule.specificDateEnd ?? "").trim();
      if (!start || !end || !comparisonIso) {
        return false;
      }
      const comparisonDate = comparisonIso.slice(0, 10);
      return comparisonDate >= start && comparisonDate <= end;
    }
    if (rule.trigger === "hours_before_start") {
      return hoursUntilStart <= Math.max(0, Number(rule.offsetValue) || 0);
    }
    const dayWindowHours = Math.max(0, Number(rule.offsetValue) || 0) * 24;
    return hoursUntilStart <= dayWindowHours;
  }
  applyPricingAction(currentPrice, action) {
    const value = Number(action.value) || 0;
    if (action.kind === "set_exact_price") {
      return Math.max(0, value);
    }
    if (action.kind === "increase_amount") {
      return Math.max(0, currentPrice + value);
    }
    if (action.kind === "decrease_amount") {
      return Math.max(0, currentPrice - value);
    }
    const percent = value / 100;
    if (action.kind === "decrease_percent") {
      return Math.max(0, currentPrice * (1 - percent));
    }
    return Math.max(0, currentPrice * (1 + percent));
  }
  describePricingAction(action) {
    const value = Number(action.value) || 0;
    switch (action.kind) {
      case "set_exact_price":
        return `Set to ${value}`;
      case "increase_amount":
        return `+${value}`;
      case "decrease_amount":
        return `-${value}`;
      case "decrease_percent":
        return `-${value}%`;
      default:
        return `+${value}%`;
    }
  }
  applyRounding(price, rounding) {
    if (rounding === "whole") {
      return Math.round(price);
    }
    if (rounding === "half") {
      return Math.round(price * 2) / 2;
    }
    return Math.round(price * 100) / 100;
  }
  resolveHoursUntilStart(startAtIso) {
    const start = AppUtils.isoLocalDateTimeToDate(startAtIso);
    if (!start) {
      return 0;
    }
    return Math.max(0, Math.round((start.getTime() - Date.now()) / (60 * 60 * 1e3)));
  }
  resolveApplicableCancellationRule(rules, startAtIso) {
    const start = AppUtils.isoLocalDateTimeToDate(startAtIso);
    if (!start) {
      return null;
    }
    const now = Date.now();
    let bestRule = null;
    let bestDeadlineMs = Number.POSITIVE_INFINITY;
    for (const rule of rules) {
      const deadline = this.cancellationRuleDeadlineMs(rule, start);
      if (deadline === null || now > deadline) {
        continue;
      }
      if (deadline < bestDeadlineMs) {
        bestRule = rule;
        bestDeadlineMs = deadline;
      }
    }
    return bestRule;
  }
  cancellationRuleDeadlineMs(rule, start) {
    const value = Math.max(0, Math.trunc(Number(rule.offsetValue) || 0));
    const next = new Date(start.getTime());
    if (rule.offsetUnit === "hours") {
      next.setHours(next.getHours() - value);
      return next.getTime();
    }
    if (rule.offsetUnit === "weeks") {
      next.setDate(next.getDate() - value * 7);
      return next.getTime();
    }
    if (rule.offsetUnit === "months") {
      next.setMonth(next.getMonth() - value);
      return next.getTime();
    }
    next.setDate(next.getDate() - value);
    return next.getTime();
  }
  calculateCancellationRefundAmount(rule, totalAmount) {
    const amount = Math.max(0, totalAmount);
    if (rule.refundKind === "full") {
      return amount;
    }
    if (rule.refundKind === "none") {
      return 0;
    }
    if (rule.refundKind === "fixed_amount") {
      return Math.min(amount, Math.round((Number(rule.refundValue) || 0) * 100) / 100);
    }
    return Math.round(amount * (Math.max(0, Math.min(100, Number(rule.refundValue) || 0)) / 100) * 100) / 100;
  }
  describeCancellationRule(rule) {
    return `${this.cancellationRuleRefundLabel(rule)} when cancelled at least ${this.cancellationRuleWindowLabel(rule)}.`;
  }
  resolveErrorMessage(error, fallback) {
    if (typeof error === "string" && error.trim().length > 0) {
      return error.trim();
    }
    if (this.isPaymentSessionConflict(error)) {
      return "Checkout details changed. A fresh payment session is needed.";
    }
    if (error instanceof HttpErrorResponse && typeof error.error?.message === "string" && error.error.message.trim()) {
      return error.error.message.trim();
    }
    if (error instanceof Error && error.message.trim().length > 0) {
      return error.message.trim();
    }
    return fallback;
  }
  async recoverStalePaymentSession(error) {
    if (!this.isPaymentSessionConflict(error) || this.totalAmount() <= 0) {
      return false;
    }
    this.clearCheckoutDraft();
    try {
      const session = await this.eventsService.createCheckoutSession(this.buildCheckoutRequest());
      if (!session?.id) {
        this.errorMessage = "Checkout details changed. Start checkout again.";
        return true;
      }
      this.checkoutSessionId = session.id;
      this.paymentStep = true;
      await this.persistCheckoutDraft(false);
      this.errorMessage = "Checkout details changed. A fresh payment session is ready.";
      return true;
    } catch (recoveryError) {
      this.errorMessage = this.resolveErrorMessage(recoveryError, "Checkout details changed. Start checkout again.");
      return true;
    }
  }
  isPaymentSessionConflict(error) {
    return error instanceof HttpErrorResponse && error.status === 409;
  }
  availableSlotDateKeys() {
    return this.availableSlotDateEntries().map((item) => item.key);
  }
  selectedSlotDateKey() {
    return this.selectedSlotDateValue ? this.slotDateKeyFromDate(this.selectedSlotDateValue) : this.availableSlotDateKeys()[0] ?? "";
  }
  slotDateValueFromIso(value) {
    const parsed = AppUtils.isoLocalDateTimeToDate(value);
    if (!parsed) {
      return null;
    }
    return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  }
  slotDateValueFromKey(value) {
    const [yearText, monthText, dayText] = value.split("-");
    const year = Number(yearText);
    const month = Number(monthText);
    const day = Number(dayText);
    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
      return null;
    }
    return new Date(year, month - 1, day);
  }
  slotDateKeyFromIso(value) {
    const parsed = AppUtils.isoLocalDateTimeToDate(value);
    return parsed ? this.slotDateKeyFromDate(parsed) : "";
  }
  slotDateKeyFromDate(value) {
    return `${value.getFullYear()}-${AppUtils.pad2(value.getMonth() + 1)}-${AppUtils.pad2(value.getDate())}`;
  }
  async persistCheckoutDraft(syncRuntimeBasket = true, pendingReasonOverride = void 0, checkoutStateOverride, basketChanged = false) {
    const dialog = this.dialog();
    const updateStepActive = this.checkoutUpdateStepActive();
    const pendingReason = pendingReasonOverride === void 0 ? this.checkoutDecisionPendingReason() : pendingReasonOverride;
    const checkoutState = checkoutStateOverride ?? this.currentCheckoutState(this.totalAmount(), pendingReason);
    const basketItems = this.checkoutBasketItems(checkoutState);
    if (!dialog || basketItems.length === 0 && this.totalAmount() <= 0 && !pendingReason) {
      return;
    }
    const basket = this.checkoutBasketSnapshot();
    this.checkoutDraftStore.save({
      userId: dialog.userId,
      sourceId: dialog.record.id,
      eventTitle: dialog.record.title,
      eventTimeframe: dialog.record.timeframe,
      slotSourceId: this.selectedSlotSourceId,
      selectedDateKey: this.selectedSlotDateValue ? this.slotDateKeyFromDate(this.selectedSlotDateValue) : null,
      optionalSubEventIds: [...this.selectedOptionalSubEventIds],
      acceptedPolicyIds: [...this.acceptedPolicyIds],
      appliedPromoCodes: [...this.appliedPromoCodes],
      basketItems,
      pricingSummaryRows: this.checkoutBasketPricingSummaryRows(),
      checkoutState,
      lineItems: this.lineItems(),
      totalAmount: this.totalAmount(),
      currency: this.currency(),
      checkoutSessionId: this.checkoutSessionId,
      expiresAtIso: basket?.expiresAtIso ?? null,
      pendingReason,
      basketChanged,
      updatedAtMs: Date.now()
    });
    if (syncRuntimeBasket) {
      await this.syncRuntimeCheckoutBasket(checkoutState, pendingReason, updateStepActive);
    }
  }
  async syncRuntimeCheckoutBasket(checkoutStateOverride, pendingReasonOverride = void 0, forceBasketPayload = false) {
    const dialog = this.dialog();
    const basketItems = this.checkoutBasketItems();
    if (!dialog || basketItems.length === 0) {
      return;
    }
    try {
      const shouldMutateStoredBasket = this.runtimeCheckoutBasketExists() && checkoutStateOverride != null && checkoutStateOverride !== "draft" && !forceBasketPayload;
      const basket = shouldMutateStoredBasket ? await this.eventsService.updateCheckoutBasketState(this.buildCheckoutStateChangeRequest(checkoutStateOverride, null, pendingReasonOverride === void 0 ? null : pendingReasonOverride, this.checkoutSessionId)) : await this.eventsService.saveCheckoutBasket(this.buildCheckoutRequest({
        checkoutState: checkoutStateOverride,
        pendingReason: pendingReasonOverride
      }));
      if (basket) {
        this.checkoutBasket = basket;
      }
    } catch {
    }
  }
  runtimeCheckoutBasketExists() {
    return (this.checkoutBasket?.items ?? []).some((item) => item.resultState !== "deleted" && item.resultState !== "succeeded" && Boolean(item.id?.trim()));
  }
  clearCheckoutDraft() {
    const dialog = this.dialog();
    if (!dialog) {
      return;
    }
    this.checkoutDraftStore.clear(dialog.userId, dialog.record.id);
    this.checkoutSessionId = null;
    this.checkoutBasket = null;
  }
  releaseUnpaidPaymentSession() {
    const paidItems = this.activeCheckoutBasketItems().some((item) => item.status === "pay");
    if (paidItems) {
      return;
    }
    const hadSession = this.paymentStep || Boolean(this.checkoutSessionId);
    this.paymentStep = false;
    this.checkoutSessionId = null;
    if (!hadSession || !this.checkoutBasket) {
      return;
    }
    const nextStatus = this.currentCheckoutState(this.checkoutBasket.totalAmount);
    this.checkoutBasket = __spreadProps(__spreadValues({}, this.checkoutBasket), {
      status: nextStatus,
      checkoutSessionId: null,
      items: this.checkoutBasket.items.map((item) => __spreadProps(__spreadValues({}, item), {
        status: nextStatus,
        checkoutSessionId: null
      }))
    });
  }
  invalidateCheckoutDraft() {
    this.checkoutBasket = null;
    if (!this.checkoutSessionId) {
      return;
    }
    this.clearCheckoutDraft();
  }
  rebuildSlotCaches(slots) {
    this.availableSlotsCache = [...slots].sort((left, right) => {
      const leftMs = AppUtils.isoLocalDateTimeToDate(left.startAtIso)?.getTime() ?? 0;
      const rightMs = AppUtils.isoLocalDateTimeToDate(right.startAtIso)?.getTime() ?? 0;
      return leftMs - rightMs;
    });
    const grouped = /* @__PURE__ */ new Map();
    for (const slot of this.availableSlotsCache) {
      const parsed = AppUtils.isoLocalDateTimeToDate(slot.startAtIso);
      if (!parsed) {
        continue;
      }
      const key = this.slotDateKeyFromDate(parsed);
      if (!grouped.has(key)) {
        grouped.set(key, {
          value: new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()),
          count: 0
        });
      }
      grouped.get(key).count += 1;
    }
    this.availableSlotDateEntriesCache = [...grouped.entries()].map(([key, item]) => ({
      key,
      value: item.value,
      label: item.value.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }),
      count: item.count
    }));
    this.availableSlotDateKeySet = new Set(this.availableSlotDateEntriesCache.map((item) => item.key));
  }
  isRecordFull(record) {
    return record.full === true;
  }
  checkoutTargetUnavailable() {
    const dialog = this.dialog();
    if (!dialog || this.isWaitingListSelection()) {
      return false;
    }
    const targetSourceId = this.selectedSlotSourceId?.trim() || dialog.record.id;
    const knownRecord = targetSourceId ? this.eventsService.peekKnownRecordById(dialog.userId, targetSourceId) : null;
    if (knownRecord && this.isRecordFull(knownRecord)) {
      return true;
    }
    const slot = this.selectedSlot();
    if (slot && this.isSlotFull(slot)) {
      return true;
    }
    return !this.requiresSlotSelection() && this.isRecordFull(dialog.record);
  }
  isSlotFull(slot) {
    return Math.max(0, Math.trunc(Number(slot.capacityTotal) || 0)) > 0 && Math.max(0, Math.trunc(Number(slot.acceptedMembers) || 0)) >= Math.max(0, Math.trunc(Number(slot.capacityTotal) || 0));
  }
  static \u0275fac = function EventCheckoutPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EventCheckoutPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EventCheckoutPopupComponent, selectors: [["app-event-checkout-popup"]], hostBindings: function EventCheckoutPopupComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("keydown.escape", function EventCheckoutPopupComponent_keydown_escape_HostBindingHandler($event) {
        return ctx.onEscapePressed($event);
      }, \u0275\u0275resolveWindow);
    }
  }, decls: 2, vars: 5, consts: [[3, "closeSelect", "addSelect", "removeSelect", "open", "availablePromoCodes", "appliedPromoCodes", "validatePromoCode"], [4, "ngComponentOutlet"]], template: function EventCheckoutPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, EventCheckoutPopupComponent_Conditional_0_Template, 1, 1, "ng-container");
      \u0275\u0275elementStart(1, "app-event-promo-code-popup", 0);
      \u0275\u0275listener("closeSelect", function EventCheckoutPopupComponent_Template_app_event_promo_code_popup_closeSelect_1_listener() {
        return ctx.closePromoCodePopup();
      })("addSelect", function EventCheckoutPopupComponent_Template_app_event_promo_code_popup_addSelect_1_listener($event) {
        return ctx.addPromoCode($event);
      })("removeSelect", function EventCheckoutPopupComponent_Template_app_event_promo_code_popup_removeSelect_1_listener($event) {
        return ctx.removePromoCode($event);
      });
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275conditional((tmp_0_0 = ctx.eventCheckoutSlotPickerStore.slotPickerPopupComponent()) ? 0 : -1, tmp_0_0);
      \u0275\u0275advance();
      \u0275\u0275property("open", ctx.showPromoCodePopup())("availablePromoCodes", ctx.availableCheckoutPromoCodes())("appliedPromoCodes", ctx.appliedCheckoutPromoCodes())("validatePromoCode", ctx.validateCheckoutPromoCode);
    }
  }, dependencies: [
    CommonModule,
    NgComponentOutlet,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    EventPromoCodePopupComponent
  ], styles: ["\n[_nghost-%COMP%] {\n  display: contents;\n}\n.event-checkout-dialog__content[_ngcontent-%COMP%] {\n  min-height: 0;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n}\n.event-checkout-dialog__body[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  min-height: 0;\n  overflow: auto;\n  padding: 1.15rem;\n  display: grid;\n  gap: 1rem;\n  box-sizing: border-box;\n}\n.event-checkout-summary-card[_ngcontent-%COMP%], \n.event-checkout-card[_ngcontent-%COMP%] {\n  border: 1px solid rgba(191, 212, 233, 0.78);\n  border-radius: 24px;\n  background: rgba(255, 255, 255, 0.9);\n  padding: 1rem 1.05rem;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65);\n}\n.event-checkout-summary-card[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(238, 250, 248, 0.96) 0%,\n      rgba(248, 255, 252, 0.98) 100%);\n}\n.event-checkout-summary-card__head[_ngcontent-%COMP%], \n.event-checkout-card__head[_ngcontent-%COMP%], \n.event-checkout-summary-card__item[_ngcontent-%COMP%], \n.event-checkout-dialog__footer[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.85rem;\n}\n.event-checkout-summary-card__head[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.event-checkout-card__head[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.event-checkout-summary-card__item[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.event-checkout-policy-card[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.event-checkout-payment-note[_ngcontent-%COMP%] {\n  color: rgba(49, 71, 104, 0.82);\n}\n.event-checkout-summary-card__list[_ngcontent-%COMP%], \n.event-checkout-option-list[_ngcontent-%COMP%], \n.event-checkout-policy-list[_ngcontent-%COMP%], \n.event-checkout-slot-list[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.75rem;\n  margin-top: 0.9rem;\n}\n.event-checkout-summary-card__item[_ngcontent-%COMP%], \n.event-checkout-slot-card[_ngcontent-%COMP%], \n.event-checkout-toggle-card[_ngcontent-%COMP%], \n.event-checkout-policy-card[_ngcontent-%COMP%] {\n  border-radius: 20px;\n  border: 1px solid rgba(192, 212, 232, 0.82);\n  background: rgba(255, 255, 255, 0.94);\n  padding: 0.9rem 0.95rem;\n  box-sizing: border-box;\n}\n.event-checkout-summary-card__item[_ngcontent-%COMP%]   div[_ngcontent-%COMP%], \n.event-checkout-toggle-card[_ngcontent-%COMP%]   div[_ngcontent-%COMP%], \n.event-checkout-policy-card[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.18rem;\n}\n.event-checkout-slot-list[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n}\n.event-checkout-card__head--slot[_ngcontent-%COMP%] {\n  align-items: center;\n}\n.event-checkout-card__head-copy[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.16rem;\n}\n.event-checkout-slot-selected-badge[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  width: fit-content;\n  max-width: min(320px, 100%);\n  min-width: 0;\n  min-height: 30px;\n  padding: 0 0.72rem;\n  border-radius: 999px;\n  border: 1px solid rgba(185, 208, 232, 0.9);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(246, 251, 255, 0.98) 0%,\n      rgba(236, 245, 255, 0.98) 100%);\n  color: #35547c;\n  font-size: 0.8rem;\n  font-weight: 800;\n  line-height: 1.2;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  box-sizing: border-box;\n}\n.event-checkout-slot-head-controls[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.55rem;\n  min-width: 0;\n  flex-wrap: wrap;\n}\n.event-checkout-slot-date-wrap[_ngcontent-%COMP%] {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  min-width: 0;\n}\n.event-checkout-slot-date-hidden[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  opacity: 0;\n  pointer-events: none;\n}\n.event-checkout-slot-date-trigger[_ngcontent-%COMP%] {\n  height: 38px;\n  min-width: 0;\n  max-width: min(220px, 42vw);\n  padding: 0 0.8rem;\n  border-radius: 999px;\n  border: 1px solid rgba(191, 212, 233, 0.88);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(250, 253, 255, 0.98) 0%,\n      rgba(237, 244, 252, 0.98) 100%);\n  color: #35547c;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.45rem;\n  cursor: pointer;\n  font-weight: 700;\n  box-sizing: border-box;\n  transition:\n    transform 140ms ease,\n    box-shadow 140ms ease,\n    border-color 140ms ease;\n}\n.event-checkout-slot-date-trigger[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  flex: 0 0 auto;\n}\n.event-checkout-slot-date-trigger[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.event-checkout-slot-date-trigger[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n  border-color: rgba(122, 162, 208, 0.88);\n  box-shadow: 0 12px 24px rgba(74, 108, 152, 0.14);\n}\n.event-checkout-slot-pager[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.45rem;\n}\n.event-checkout-slot-pager__summary[_ngcontent-%COMP%] {\n  color: rgba(39, 72, 109, 0.72);\n  font-size: 0.82rem;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.event-checkout-slot-pager__btn[_ngcontent-%COMP%] {\n  width: 38px;\n  height: 38px;\n  border-radius: 999px;\n  border: 1px solid rgba(191, 212, 233, 0.88);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(250, 253, 255, 0.98) 0%,\n      rgba(237, 244, 252, 0.98) 100%);\n  color: #35547c;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  transition:\n    transform 140ms ease,\n    box-shadow 140ms ease,\n    border-color 140ms ease;\n}\n.event-checkout-slot-pager__btn[_ngcontent-%COMP%]:hover:not(:disabled) {\n  transform: translateY(-1px);\n  border-color: rgba(122, 162, 208, 0.88);\n  box-shadow: 0 12px 24px rgba(74, 108, 152, 0.14);\n}\n.event-checkout-slot-pager__btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.52;\n  cursor: default;\n  transform: none;\n  box-shadow: none;\n}\n.event-checkout-slot-card[_ngcontent-%COMP%], \n.event-checkout-toggle-card[_ngcontent-%COMP%] {\n  width: 100%;\n  display: grid;\n  gap: 0.3rem;\n  text-align: left;\n  cursor: pointer;\n  transition:\n    transform 140ms ease,\n    border-color 140ms ease,\n    box-shadow 140ms ease,\n    background-color 140ms ease;\n}\n.event-checkout-slot-card[_ngcontent-%COMP%]:hover, \n.event-checkout-toggle-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n}\n.event-checkout-slot-card.is-selected[_ngcontent-%COMP%], \n.event-checkout-toggle-card.is-selected[_ngcontent-%COMP%] {\n  border-color: rgba(84, 155, 135, 0.82);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(236, 251, 246, 0.98) 0%,\n      rgba(228, 246, 239, 0.98) 100%);\n  box-shadow: 0 16px 30px rgba(84, 155, 135, 0.14);\n}\n.event-checkout-slot-card__title[_ngcontent-%COMP%], \n.event-checkout-slot-card__capacity[_ngcontent-%COMP%], \n.event-checkout-summary-card__item[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.event-checkout-toggle-card[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.event-checkout-policy-card[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.event-checkout-card__head[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: #27486d;\n}\n.event-checkout-slot-card__meta[_ngcontent-%COMP%] {\n  color: rgba(39, 72, 109, 0.74);\n}\n.event-checkout-payment-headline[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.18rem;\n}\n.event-checkout-payment-headline[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: rgba(49, 71, 104, 0.78);\n  font-size: 0.84rem;\n}\n.event-checkout-payment-disabled-warning[_ngcontent-%COMP%] {\n  margin: 0.85rem 0 0;\n  border: 1px solid rgba(196, 81, 95, 0.28);\n  border-radius: 16px;\n  background: rgba(255, 244, 246, 0.96);\n  color: #a93245;\n  padding: 0.72rem 0.82rem;\n  font-size: 0.86rem;\n  font-weight: 800;\n  line-height: 1.34;\n}\n.event-checkout-payment-provider[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 36px;\n  padding: 0 0.85rem;\n  border-radius: 999px;\n  border: 1px solid rgba(97, 158, 137, 0.42);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(232, 249, 243, 0.98) 0%,\n      rgba(220, 243, 235, 0.98) 100%);\n  color: #2a7057;\n  font-size: 0.82rem;\n  font-weight: 800;\n  white-space: nowrap;\n}\n.event-checkout-policy-card[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: auto 1fr auto;\n  gap: 0.85rem;\n  align-items: start;\n}\n.event-checkout-policy-card[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  margin-top: 0.2rem;\n}\n.event-checkout-policy-card[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  font-style: normal;\n  font-weight: 700;\n  color: #9d5c1d;\n}\n.event-checkout-policy-card.is-required[_ngcontent-%COMP%] {\n  border-color: rgba(218, 186, 132, 0.7);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 251, 240, 0.98) 0%,\n      rgba(255, 247, 228, 0.98) 100%);\n}\n.event-checkout-payment-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.85rem;\n  margin-top: 1rem;\n}\n.event-checkout-payment-summary[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));\n  gap: 0.75rem;\n  margin-top: 1rem;\n}\n.event-checkout-payment-summary[_ngcontent-%COMP%]   article[_ngcontent-%COMP%] {\n  border: 1px solid rgba(191, 212, 233, 0.82);\n  border-radius: 18px;\n  background: rgba(249, 252, 255, 0.95);\n  padding: 0.85rem 0.95rem;\n  display: grid;\n  gap: 0.3rem;\n}\n.event-checkout-payment-summary[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: rgba(49, 71, 104, 0.74);\n  font-size: 0.8rem;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n}\n.event-checkout-payment-summary[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #24476e;\n  font-size: 1rem;\n}\n.event-checkout-payment-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.35rem;\n}\n.event-checkout-payment-grid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  height: 46px;\n  border-radius: 16px;\n  border: 1px solid rgba(192, 212, 232, 0.9);\n  background: rgba(244, 248, 252, 0.96);\n  color: rgba(64, 83, 110, 0.9);\n  padding: 0 0.9rem;\n  box-sizing: border-box;\n}\n.event-checkout-dialog__error[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #9c2f40;\n  font-weight: 700;\n}\n.event-checkout-dialog__footer[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  justify-content: flex-end;\n  padding: 1rem 1.15rem 1.05rem;\n  border-top: 1px solid rgba(188, 210, 233, 0.7);\n  background: rgba(249, 252, 255, 0.95);\n}\n.event-checkout-action-menu[_ngcontent-%COMP%] {\n  display: inline-flex;\n  --app-menu-action-min-width: 138px;\n  --app-menu-action-height: 46px;\n  --app-menu-action-padding: 0 1rem;\n}\n@media (max-width: 760px) {\n  .event-checkout-dialog__body[_ngcontent-%COMP%] {\n    padding: 0.95rem;\n  }\n  .event-checkout-card__head[_ngcontent-%COMP%], \n   .event-checkout-summary-card__head[_ngcontent-%COMP%], \n   .event-checkout-summary-card__item[_ngcontent-%COMP%], \n   .event-checkout-dialog__footer[_ngcontent-%COMP%] {\n    flex-wrap: wrap;\n  }\n  .event-checkout-payment-summary[_ngcontent-%COMP%], \n   .event-checkout-slot-list[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .event-checkout-card__head--slot[_ngcontent-%COMP%] {\n    align-items: stretch;\n  }\n  .event-checkout-slot-head-controls[_ngcontent-%COMP%] {\n    width: 100%;\n    justify-content: space-between;\n  }\n  .event-checkout-slot-date-trigger[_ngcontent-%COMP%] {\n    max-width: none;\n    flex: 1 1 auto;\n  }\n  .event-checkout-slot-selected-badge[_ngcontent-%COMP%] {\n    max-width: 100%;\n  }\n  .event-checkout-slot-pager[_ngcontent-%COMP%] {\n    justify-content: flex-end;\n  }\n  .event-checkout-payment-grid[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .event-checkout-dialog__footer[_ngcontent-%COMP%] {\n    padding: 0.9rem 1rem 1rem;\n  }\n  .event-checkout-action-menu[_ngcontent-%COMP%] {\n    max-width: 100%;\n  }\n}\n/*# sourceMappingURL=event-checkout-popup.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EventCheckoutPopupComponent, [{
    type: Component,
    args: [{ selector: "app-event-checkout-popup", standalone: true, imports: [
      CommonModule,
      FormsModule,
      MatButtonModule,
      MatDatepickerModule,
      MatFormFieldModule,
      MatIconModule,
      MatInputModule,
      MatNativeDateModule,
      EventPromoCodePopupComponent
    ], template: '@if (eventCheckoutSlotPickerStore.slotPickerPopupComponent(); as slotPickerComponent) {\n  <ng-container *ngComponentOutlet="slotPickerComponent"></ng-container>\n}\n\n<app-event-promo-code-popup\n  [open]="showPromoCodePopup()"\n  [availablePromoCodes]="availableCheckoutPromoCodes()"\n  [appliedPromoCodes]="appliedCheckoutPromoCodes()"\n  [validatePromoCode]="validateCheckoutPromoCode"\n  (closeSelect)="closePromoCodePopup()"\n  (addSelect)="addPromoCode($event)"\n  (removeSelect)="removePromoCode($event)"\n></app-event-promo-code-popup>\n', styles: ["/* src/app/activity/components/event-checkout-popup/event-checkout-popup.component.scss */\n:host {\n  display: contents;\n}\n.event-checkout-dialog__content {\n  min-height: 0;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n}\n.event-checkout-dialog__body {\n  flex: 1 1 auto;\n  min-height: 0;\n  overflow: auto;\n  padding: 1.15rem;\n  display: grid;\n  gap: 1rem;\n  box-sizing: border-box;\n}\n.event-checkout-summary-card,\n.event-checkout-card {\n  border: 1px solid rgba(191, 212, 233, 0.78);\n  border-radius: 24px;\n  background: rgba(255, 255, 255, 0.9);\n  padding: 1rem 1.05rem;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65);\n}\n.event-checkout-summary-card {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(238, 250, 248, 0.96) 0%,\n      rgba(248, 255, 252, 0.98) 100%);\n}\n.event-checkout-summary-card__head,\n.event-checkout-card__head,\n.event-checkout-summary-card__item,\n.event-checkout-dialog__footer {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.85rem;\n}\n.event-checkout-summary-card__head span,\n.event-checkout-card__head span,\n.event-checkout-summary-card__item span,\n.event-checkout-policy-card span,\n.event-checkout-payment-note {\n  color: rgba(49, 71, 104, 0.82);\n}\n.event-checkout-summary-card__list,\n.event-checkout-option-list,\n.event-checkout-policy-list,\n.event-checkout-slot-list {\n  display: grid;\n  gap: 0.75rem;\n  margin-top: 0.9rem;\n}\n.event-checkout-summary-card__item,\n.event-checkout-slot-card,\n.event-checkout-toggle-card,\n.event-checkout-policy-card {\n  border-radius: 20px;\n  border: 1px solid rgba(192, 212, 232, 0.82);\n  background: rgba(255, 255, 255, 0.94);\n  padding: 0.9rem 0.95rem;\n  box-sizing: border-box;\n}\n.event-checkout-summary-card__item div,\n.event-checkout-toggle-card div,\n.event-checkout-policy-card div {\n  display: grid;\n  gap: 0.18rem;\n}\n.event-checkout-slot-list {\n  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n}\n.event-checkout-card__head--slot {\n  align-items: center;\n}\n.event-checkout-card__head-copy {\n  min-width: 0;\n  display: grid;\n  gap: 0.16rem;\n}\n.event-checkout-slot-selected-badge {\n  display: inline-flex;\n  align-items: center;\n  width: fit-content;\n  max-width: min(320px, 100%);\n  min-width: 0;\n  min-height: 30px;\n  padding: 0 0.72rem;\n  border-radius: 999px;\n  border: 1px solid rgba(185, 208, 232, 0.9);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(246, 251, 255, 0.98) 0%,\n      rgba(236, 245, 255, 0.98) 100%);\n  color: #35547c;\n  font-size: 0.8rem;\n  font-weight: 800;\n  line-height: 1.2;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  box-sizing: border-box;\n}\n.event-checkout-slot-head-controls {\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.55rem;\n  min-width: 0;\n  flex-wrap: wrap;\n}\n.event-checkout-slot-date-wrap {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  min-width: 0;\n}\n.event-checkout-slot-date-hidden {\n  position: absolute;\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  opacity: 0;\n  pointer-events: none;\n}\n.event-checkout-slot-date-trigger {\n  height: 38px;\n  min-width: 0;\n  max-width: min(220px, 42vw);\n  padding: 0 0.8rem;\n  border-radius: 999px;\n  border: 1px solid rgba(191, 212, 233, 0.88);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(250, 253, 255, 0.98) 0%,\n      rgba(237, 244, 252, 0.98) 100%);\n  color: #35547c;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.45rem;\n  cursor: pointer;\n  font-weight: 700;\n  box-sizing: border-box;\n  transition:\n    transform 140ms ease,\n    box-shadow 140ms ease,\n    border-color 140ms ease;\n}\n.event-checkout-slot-date-trigger .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  flex: 0 0 auto;\n}\n.event-checkout-slot-date-trigger span {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.event-checkout-slot-date-trigger:hover {\n  transform: translateY(-1px);\n  border-color: rgba(122, 162, 208, 0.88);\n  box-shadow: 0 12px 24px rgba(74, 108, 152, 0.14);\n}\n.event-checkout-slot-pager {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.45rem;\n}\n.event-checkout-slot-pager__summary {\n  color: rgba(39, 72, 109, 0.72);\n  font-size: 0.82rem;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.event-checkout-slot-pager__btn {\n  width: 38px;\n  height: 38px;\n  border-radius: 999px;\n  border: 1px solid rgba(191, 212, 233, 0.88);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(250, 253, 255, 0.98) 0%,\n      rgba(237, 244, 252, 0.98) 100%);\n  color: #35547c;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  transition:\n    transform 140ms ease,\n    box-shadow 140ms ease,\n    border-color 140ms ease;\n}\n.event-checkout-slot-pager__btn:hover:not(:disabled) {\n  transform: translateY(-1px);\n  border-color: rgba(122, 162, 208, 0.88);\n  box-shadow: 0 12px 24px rgba(74, 108, 152, 0.14);\n}\n.event-checkout-slot-pager__btn:disabled {\n  opacity: 0.52;\n  cursor: default;\n  transform: none;\n  box-shadow: none;\n}\n.event-checkout-slot-card,\n.event-checkout-toggle-card {\n  width: 100%;\n  display: grid;\n  gap: 0.3rem;\n  text-align: left;\n  cursor: pointer;\n  transition:\n    transform 140ms ease,\n    border-color 140ms ease,\n    box-shadow 140ms ease,\n    background-color 140ms ease;\n}\n.event-checkout-slot-card:hover,\n.event-checkout-toggle-card:hover {\n  transform: translateY(-1px);\n}\n.event-checkout-slot-card.is-selected,\n.event-checkout-toggle-card.is-selected {\n  border-color: rgba(84, 155, 135, 0.82);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(236, 251, 246, 0.98) 0%,\n      rgba(228, 246, 239, 0.98) 100%);\n  box-shadow: 0 16px 30px rgba(84, 155, 135, 0.14);\n}\n.event-checkout-slot-card__title,\n.event-checkout-slot-card__capacity,\n.event-checkout-summary-card__item strong,\n.event-checkout-toggle-card strong,\n.event-checkout-policy-card strong,\n.event-checkout-card__head h3 {\n  color: #27486d;\n}\n.event-checkout-slot-card__meta {\n  color: rgba(39, 72, 109, 0.74);\n}\n.event-checkout-payment-headline {\n  display: grid;\n  gap: 0.18rem;\n}\n.event-checkout-payment-headline p {\n  margin: 0;\n  color: rgba(49, 71, 104, 0.78);\n  font-size: 0.84rem;\n}\n.event-checkout-payment-disabled-warning {\n  margin: 0.85rem 0 0;\n  border: 1px solid rgba(196, 81, 95, 0.28);\n  border-radius: 16px;\n  background: rgba(255, 244, 246, 0.96);\n  color: #a93245;\n  padding: 0.72rem 0.82rem;\n  font-size: 0.86rem;\n  font-weight: 800;\n  line-height: 1.34;\n}\n.event-checkout-payment-provider {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 36px;\n  padding: 0 0.85rem;\n  border-radius: 999px;\n  border: 1px solid rgba(97, 158, 137, 0.42);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(232, 249, 243, 0.98) 0%,\n      rgba(220, 243, 235, 0.98) 100%);\n  color: #2a7057;\n  font-size: 0.82rem;\n  font-weight: 800;\n  white-space: nowrap;\n}\n.event-checkout-policy-card {\n  display: grid;\n  grid-template-columns: auto 1fr auto;\n  gap: 0.85rem;\n  align-items: start;\n}\n.event-checkout-policy-card input {\n  margin-top: 0.2rem;\n}\n.event-checkout-policy-card em {\n  font-style: normal;\n  font-weight: 700;\n  color: #9d5c1d;\n}\n.event-checkout-policy-card.is-required {\n  border-color: rgba(218, 186, 132, 0.7);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 251, 240, 0.98) 0%,\n      rgba(255, 247, 228, 0.98) 100%);\n}\n.event-checkout-payment-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.85rem;\n  margin-top: 1rem;\n}\n.event-checkout-payment-summary {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));\n  gap: 0.75rem;\n  margin-top: 1rem;\n}\n.event-checkout-payment-summary article {\n  border: 1px solid rgba(191, 212, 233, 0.82);\n  border-radius: 18px;\n  background: rgba(249, 252, 255, 0.95);\n  padding: 0.85rem 0.95rem;\n  display: grid;\n  gap: 0.3rem;\n}\n.event-checkout-payment-summary span {\n  color: rgba(49, 71, 104, 0.74);\n  font-size: 0.8rem;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n}\n.event-checkout-payment-summary strong {\n  color: #24476e;\n  font-size: 1rem;\n}\n.event-checkout-payment-grid label {\n  display: grid;\n  gap: 0.35rem;\n}\n.event-checkout-payment-grid input {\n  height: 46px;\n  border-radius: 16px;\n  border: 1px solid rgba(192, 212, 232, 0.9);\n  background: rgba(244, 248, 252, 0.96);\n  color: rgba(64, 83, 110, 0.9);\n  padding: 0 0.9rem;\n  box-sizing: border-box;\n}\n.event-checkout-dialog__error {\n  margin: 0;\n  color: #9c2f40;\n  font-weight: 700;\n}\n.event-checkout-dialog__footer {\n  flex: 0 0 auto;\n  justify-content: flex-end;\n  padding: 1rem 1.15rem 1.05rem;\n  border-top: 1px solid rgba(188, 210, 233, 0.7);\n  background: rgba(249, 252, 255, 0.95);\n}\n.event-checkout-action-menu {\n  display: inline-flex;\n  --app-menu-action-min-width: 138px;\n  --app-menu-action-height: 46px;\n  --app-menu-action-padding: 0 1rem;\n}\n@media (max-width: 760px) {\n  .event-checkout-dialog__body {\n    padding: 0.95rem;\n  }\n  .event-checkout-card__head,\n  .event-checkout-summary-card__head,\n  .event-checkout-summary-card__item,\n  .event-checkout-dialog__footer {\n    flex-wrap: wrap;\n  }\n  .event-checkout-payment-summary,\n  .event-checkout-slot-list {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .event-checkout-card__head--slot {\n    align-items: stretch;\n  }\n  .event-checkout-slot-head-controls {\n    width: 100%;\n    justify-content: space-between;\n  }\n  .event-checkout-slot-date-trigger {\n    max-width: none;\n    flex: 1 1 auto;\n  }\n  .event-checkout-slot-selected-badge {\n    max-width: 100%;\n  }\n  .event-checkout-slot-pager {\n    justify-content: flex-end;\n  }\n  .event-checkout-payment-grid {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .event-checkout-dialog__footer {\n    padding: 0.9rem 1rem 1rem;\n  }\n  .event-checkout-action-menu {\n    max-width: 100%;\n  }\n}\n/*# sourceMappingURL=event-checkout-popup.component.css.map */\n"] }]
  }], () => [], { onEscapePressed: [{
    type: HostListener,
    args: ["window:keydown.escape", ["$event"]]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EventCheckoutPopupComponent, { className: "EventCheckoutPopupComponent", filePath: "app/activity/components/event-checkout-popup/event-checkout-popup.component.ts", lineNumber: 78 });
})();

// src/app/activity/components/activities-popup/templates/chat/activities-chat-template.component.ts
function ActivitiesChatTemplateComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "single-row", 1);
    \u0275\u0275listener("rowClick", function ActivitiesChatTemplateComponent_Conditional_0_Template_single_row_rowClick_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onRowClick($event));
    })("menuAction", function ActivitiesChatTemplateComponent_Conditional_0_Template_single_row_menuAction_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSingleRowMenuAction($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("row", ctx_r1.singleRow)("clickable", true);
  }
}
var ActivitiesChatTemplateComponent = class _ActivitiesChatTemplateComponent {
  row = null;
  groupLabel = null;
  rowClick = new EventEmitter();
  supportCaseAction = new EventEmitter();
  singleRow = null;
  ngOnChanges() {
    const row = this.row;
    if (!row) {
      this.singleRow = null;
      return;
    }
    this.singleRow = __spreadProps(__spreadValues({}, row), {
      groupLabel: this.groupLabel
    });
  }
  onRowClick(event) {
    this.rowClick.emit(event);
  }
  onSingleRowMenuAction(event) {
    const action = this.supportCaseActionForMenuAction(event.actionId);
    if (!action) {
      return;
    }
    this.supportCaseAction.emit(action);
  }
  supportCaseActionForMenuAction(actionId) {
    switch (actionId) {
      case "supportPick":
        return "pick";
      case "supportUnpick":
        return "unpick";
      case "supportSolve":
        return "solve";
      case "supportBlock":
        return "block";
      case "supportReopen":
        return "reopen";
      default:
        return null;
    }
  }
  static \u0275fac = function ActivitiesChatTemplateComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ActivitiesChatTemplateComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ActivitiesChatTemplateComponent, selectors: [["app-activities-chat-template"]], inputs: { row: "row", groupLabel: "groupLabel" }, outputs: { rowClick: "rowClick", supportCaseAction: "supportCaseAction" }, features: [\u0275\u0275NgOnChangesFeature], decls: 1, vars: 1, consts: [[3, "row", "clickable"], [3, "rowClick", "menuAction", "row", "clickable"]], template: function ActivitiesChatTemplateComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, ActivitiesChatTemplateComponent_Conditional_0_Template, 1, 2, "single-row", 0);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.singleRow ? 0 : -1);
    }
  }, dependencies: [SingleRowComponent], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n/*# sourceMappingURL=activities-chat-template.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ActivitiesChatTemplateComponent, [{
    type: Component,
    args: [{ selector: "app-activities-chat-template", standalone: true, imports: [SingleRowComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: '@if (singleRow) {\n  <single-row\n    [row]="singleRow"\n    [clickable]="true"\n    (rowClick)="onRowClick($event)"\n    (menuAction)="onSingleRowMenuAction($event)"\n  ></single-row>\n}\n', styles: ["/* src/app/activity/components/activities-popup/templates/chat/activities-chat-template.component.scss */\n:host {\n  display: block;\n  min-width: 0;\n}\n/*# sourceMappingURL=activities-chat-template.component.css.map */\n"] }]
  }], null, { row: [{
    type: Input
  }], groupLabel: [{
    type: Input
  }], rowClick: [{
    type: Output
  }], supportCaseAction: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ActivitiesChatTemplateComponent, { className: "ActivitiesChatTemplateComponent", filePath: "app/activity/components/activities-popup/templates/chat/activities-chat-template.component.ts", lineNumber: 23 });
})();
var ActivitiesChatsController = class {
  host;
  constructor(host) {
    this.host = host;
  }
  get activeUser() {
    return this.host.activeUser;
  }
  get activitiesStore() {
    return this.host.activitiesStore;
  }
  chatChannelType(item) {
    if (item.channelType === "mainEvent" || item.channelType === "optionalSubEvent" || item.channelType === "groupSubEvent" || item.channelType === "serviceEvent" || item.channelType === "appSupport" || item.channelType === "supportCase") {
      return item.channelType;
    }
    return "general";
  }
  getChatMembers(item) {
    const explicitMembers = (item.memberIds ?? []).map((memberId) => this.resolveUserById(memberId)).filter((user) => Boolean(user));
    const lastSender = item.lastSenderId ? this.resolveUserById(item.lastSenderId) : null;
    const orderedMembers = [];
    if (lastSender) {
      orderedMembers.push(lastSender);
    }
    for (const member of explicitMembers) {
      if (!orderedMembers.some((item2) => item2.id === member.id)) {
        orderedMembers.push(member);
      }
    }
    if (!orderedMembers.some((item2) => item2.id === this.activeUser.id)) {
      orderedMembers.push(this.activeUser);
    }
    if (orderedMembers.length > 0) {
      return orderedMembers;
    }
    return [this.activeUser];
  }
  explicitChatMemberCount(item) {
    const uniqueIds = new Set((item?.memberIds ?? []).map((memberId) => `${memberId ?? ""}`.trim()).filter(Boolean));
    return uniqueIds.size;
  }
  getChatLastSender(item) {
    return this.resolveUserById(item.lastSenderId) ?? this.getChatMembers(item)[0] ?? this.activeUser;
  }
  resolveUserById(userId) {
    const normalizedUserId = `${userId ?? ""}`.trim();
    if (!normalizedUserId) {
      return null;
    }
    if (normalizedUserId === this.activeUser.id) {
      return this.activeUser;
    }
    return null;
  }
  getChatMemberCount(item) {
    const explicitCount = this.explicitChatMemberCount(item);
    if (explicitCount > 0) {
      return explicitCount;
    }
    return this.getChatMembers(item).length;
  }
  openActivityChat(chat) {
    this.activitiesStore.openEventChat(eventChatPopupRequestFromChat(chat), eventChatHeaderStateFromChat(chat));
  }
  activityChatContextFilterKey(item) {
    return this.activityChatContextFilterKeyFromChannelType(this.chatChannelType(item));
  }
  activityChatContextFilterKeyFromChannelType(channelType) {
    if (channelType === "mainEvent") {
      return "event";
    }
    if (channelType === "optionalSubEvent") {
      return "subEvent";
    }
    if (channelType === "groupSubEvent") {
      return "group";
    }
    if (channelType === "serviceEvent") {
      return "service";
    }
    if (channelType === "appSupport" || channelType === "supportCase") {
      return "appSupport";
    }
    return null;
  }
};

// src/app/activity/components/activities-popup/templates/event/activities-event-template.component.ts
function ActivitiesEventTemplateComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-info-card", 1);
    \u0275\u0275listener("mediaStartClick", function ActivitiesEventTemplateComponent_Conditional_0_Template_app_info_card_mediaStartClick_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onMediaStartClick());
    })("mediaEndClick", function ActivitiesEventTemplateComponent_Conditional_0_Template_app_info_card_mediaEndClick_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onMediaEndClick());
    })("menuAction", function ActivitiesEventTemplateComponent_Conditional_0_Template_app_info_card_menuAction_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onMenuAction($event));
    })("menuRequest", function ActivitiesEventTemplateComponent_Conditional_0_Template_app_info_card_menuRequest_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onMenuRequest($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("card", ctx_r1.card)("useSharedMenu", true);
  }
}
var ActivitiesEventTemplateComponent = class _ActivitiesEventTemplateComponent {
  row = null;
  groupLabel = null;
  cardRevision = 0;
  profileClick = new EventEmitter();
  mediaEndClick = new EventEmitter();
  menuAction = new EventEmitter();
  menuRequest = new EventEmitter();
  card = null;
  ngOnChanges(changes) {
    if (changes["row"] || changes["groupLabel"] || changes["cardRevision"]) {
      this.card = this.buildCard();
    }
  }
  buildCard() {
    const row = this.row;
    if (!row) {
      return null;
    }
    return __spreadProps(__spreadValues({}, row), {
      groupLabel: this.groupLabel
    });
  }
  onMediaEndClick() {
    this.mediaEndClick.emit();
  }
  onMediaStartClick() {
    const userId = `${this.card?.ownerUserId ?? this.card?.ownerId ?? ""}`.trim();
    if (!userId) {
      return;
    }
    this.profileClick.emit({
      userId,
      label: null
    });
  }
  onMenuAction(event) {
    this.menuAction.emit(event);
  }
  onMenuRequest(event) {
    this.menuRequest.emit(event);
  }
  static \u0275fac = function ActivitiesEventTemplateComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ActivitiesEventTemplateComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ActivitiesEventTemplateComponent, selectors: [["app-activities-event-template"]], inputs: { row: "row", groupLabel: "groupLabel", cardRevision: "cardRevision" }, outputs: { profileClick: "profileClick", mediaEndClick: "mediaEndClick", menuAction: "menuAction", menuRequest: "menuRequest" }, features: [\u0275\u0275NgOnChangesFeature], decls: 1, vars: 1, consts: [[3, "card", "useSharedMenu"], [3, "mediaStartClick", "mediaEndClick", "menuAction", "menuRequest", "card", "useSharedMenu"]], template: function ActivitiesEventTemplateComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, ActivitiesEventTemplateComponent_Conditional_0_Template, 1, 2, "app-info-card", 0);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.card ? 0 : -1);
    }
  }, dependencies: [InfoCardComponent], styles: ["\napp-activities-event-template[_ngcontent-%COMP%] {\n  display: contents;\n}\n/*# sourceMappingURL=activities-event-template.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ActivitiesEventTemplateComponent, [{
    type: Component,
    args: [{ selector: "app-activities-event-template", standalone: true, imports: [InfoCardComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: '@if (card) {\n  <app-info-card\n    [card]="card"\n    [useSharedMenu]="true"\n    (mediaStartClick)="onMediaStartClick()"\n    (mediaEndClick)="onMediaEndClick()"\n    (menuAction)="onMenuAction($event)"\n    (menuRequest)="onMenuRequest($event)"\n  ></app-info-card>\n}\n', styles: ["/* src/app/activity/components/activities-popup/templates/event/activities-event-template.component.scss */\napp-activities-event-template {\n  display: contents;\n}\n/*# sourceMappingURL=activities-event-template.component.css.map */\n"] }]
  }], null, { row: [{
    type: Input
  }], groupLabel: [{
    type: Input
  }], cardRevision: [{
    type: Input
  }], profileClick: [{
    type: Output
  }], mediaEndClick: [{
    type: Output
  }], menuAction: [{
    type: Output
  }], menuRequest: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ActivitiesEventTemplateComponent, { className: "ActivitiesEventTemplateComponent", filePath: "app/activity/components/activities-popup/templates/event/activities-event-template.component.ts", lineNumber: 54 });
})();
var ActivitiesEventsController = class {
  host;
  constructor(host) {
    this.host = host;
  }
  get activeUser() {
    return this.host.activeUser;
  }
  get activitiesEventScope() {
    return this.host.activitiesEventScope;
  }
  set activitiesEventScope(value) {
    this.host.activitiesEventScope = value;
  }
  get activitiesSmartList() {
    return this.host.activitiesSmartList;
  }
  get activityMembersByRowId() {
    return this.host.activityMembersByRowId;
  }
  get activityMembersService() {
    return this.host.activityMembersService;
  }
  get activityStore() {
    return this.host.activityStore;
  }
  get chatsService() {
    return this.host.chatsService;
  }
  get cdr() {
    return this.host.cdr;
  }
  get dialogStore() {
    return this.host.dialogStore;
  }
  get eventCheckoutDraftStore() {
    return this.host.eventCheckoutDraftStore;
  }
  get eventCheckoutDialogStore() {
    return this.host.eventCheckoutDialogStore;
  }
  get eventsService() {
    return this.host.eventsService;
  }
  get activitiesStore() {
    return this.host.activitiesStore;
  }
  get usersService() {
    return this.host.usersService;
  }
  get hostingPublicationFilter() {
    return this.host.hostingPublicationFilter;
  }
  get pendingActivityMemberDelete() {
    return this.host.pendingActivityMemberDelete;
  }
  set pendingActivityMemberDelete(value) {
    this.host.pendingActivityMemberDelete = value;
  }
  get memberMenuStore() {
    return this.host.memberMenuStore;
  }
  get eventSubeventsStore() {
    return this.host.eventSubeventsStore;
  }
  get profileStore() {
    return this.host.profileStore;
  }
  get shareTokensService() {
    return this.host.shareTokensService;
  }
  get activeHostingIds() {
    return this.host.activeHostingIds;
  }
  set activeHostingIds(value) {
    this.host.activeHostingIds = value;
  }
  get selectedActivityMembers() {
    return this.host.selectedActivityMembers;
  }
  set selectedActivityMembers(value) {
    this.host.selectedActivityMembers = value;
  }
  get selectedActivityMembersRow() {
    return this.host.selectedActivityMembersRow;
  }
  get selectedActivityMembersRowId() {
    return this.host.selectedActivityMembersRowId;
  }
  get trashedActivityRowsByKey() {
    return this.host.trashedActivityRowsByKey;
  }
  activityRowIdentity(row) {
    return this.host.activityRowIdentity(row);
  }
  chatCountValue(value) {
    return this.host.chatCountValue(value);
  }
  cloneSyncedSubEventForms(items) {
    return this.host.cloneSyncedSubEventForms(items);
  }
  openActivityChat(chat) {
    this.host.openActivityChat(chat);
  }
  persistSelectedActivityMembers() {
    this.host.persistSelectedActivityMembers();
  }
  refreshSectionBadges() {
    this.host.refreshSectionBadges();
  }
  applyActivityEventCounterDeltas(primaryDelta = {}, eventDelta = {}) {
    const activeUser = this.activeUser;
    const activeUserId = `${activeUser?.id ?? ""}`.trim();
    if (!activeUserId) {
      return;
    }
    const delta = this.activityCounterDeltaFromDeltas(primaryDelta, eventDelta);
    if (!delta) {
      return;
    }
    this.signalActivityCounterDelta(activeUserId, delta);
    void this.persistLocalActivityCounterDelta(activeUserId, delta);
  }
  activityCounterDeltaFromDeltas(primaryDelta, eventDelta) {
    const delta = {};
    for (const [key, value] of Object.entries(primaryDelta)) {
      if (!Number.isFinite(value) || Number(value) === 0) {
        continue;
      }
      delta[key] = Number(value);
    }
    if (Object.keys(eventDelta).length > 0) {
      const eventCounters = {};
      for (const [key, value] of Object.entries(eventDelta)) {
        if (!Number.isFinite(value) || Number(value) === 0) {
          continue;
        }
        eventCounters[key] = Number(value);
      }
      if (Object.keys(eventCounters).length > 0) {
        delta.event = eventCounters;
      }
    }
    return Object.keys(delta).length > 0 ? delta : null;
  }
  signalActivityCounterDelta(activeUserId, delta) {
    if (!delta) {
      return;
    }
    this.activityStore.patchUserCounterDeltas(activeUserId, delta, this.activeUser?.activities ?? null);
  }
  async persistLocalActivityCounterDelta(activeUserId, delta) {
    if (!delta || typeof this.usersService?.patchLocalUserActivityCounterDeltas !== "function") {
      return;
    }
    await this.usersService.patchLocalUserActivityCounterDeltas(activeUserId, delta);
  }
  uniqueUserIds(userIds) {
    const unique = [];
    for (const userId of userIds) {
      const normalizedUserId = `${userId ?? ""}`.trim();
      if (!normalizedUserId || unique.includes(normalizedUserId)) {
        continue;
      }
      unique.push(normalizedUserId);
    }
    return unique;
  }
  activityMemberUserIdsByStatus(members, status) {
    return this.uniqueUserIds(members.filter((member) => member.status === status).map((member) => member.userId));
  }
  activeUserId() {
    return `${this.activeUser?.id ?? ""}`.trim();
  }
  activityEventDTOForRow(row) {
    const fromHost = typeof this.host.activityEventDTOForRow === "function" ? this.host.activityEventDTOForRow(row) : null;
    if (fromHost) {
      return fromHost;
    }
    const visibleSource = this.activitiesSmartList?.sourceItemSnapshot?.(this.activityRowIdentity(row));
    if (visibleSource && typeof visibleSource === "object" && `${visibleSource.id ?? ""}`.trim() === row.id) {
      return visibleSource;
    }
    const activeUserId = this.activeUserId();
    return activeUserId ? this.eventsService.peekKnownItemById(activeUserId, row.id) ?? null : null;
  }
  isActivityEventListType(value) {
    return value === "events" || value === "hosting" || value === "invitations";
  }
  activityEventListTypeForRow(row) {
    if (this.activitiesEventScope === "drafts") {
      return "hosting";
    }
    const fromHost = typeof this.host.activityEventListTypeForRow === "function" ? this.host.activityEventListTypeForRow(row) : null;
    const dto = this.activityEventDTOForRow(row);
    if (dto && this.resolveActivityEventListTypeFromDTO(dto) === "hosting") {
      return "hosting";
    }
    if (this.isActivityEventListType(fromHost)) {
      return fromHost;
    }
    return dto ? this.resolveActivityEventListTypeFromDTO(dto) : "events";
  }
  resolveActivityEventListTypeFromDTO(dto) {
    const activeUserId = this.activeUserId();
    if (activeUserId && (dto.invitedMemberUserIds ?? []).includes(activeUserId)) {
      return "invitations";
    }
    if (activeUserId && (`${dto.creatorUserId ?? ""}`.trim() === activeUserId || (dto.adminIds ?? []).includes(activeUserId))) {
      return "hosting";
    }
    return "events";
  }
  isActivityRowAdmin(row) {
    if (this.activitiesEventScope === "drafts") {
      return true;
    }
    const dto = this.activityEventDTOForRow(row);
    const activeUserId = this.activeUserId();
    return !!activeUserId && (`${dto?.creatorUserId ?? ""}`.trim() === activeUserId || (dto?.adminIds ?? []).includes(activeUserId));
  }
  activityRowTimeframe(row) {
    const dto = this.activityEventDTOForRow(row);
    return dto?.timeframe?.trim() || row.metaRows?.[0]?.trim() || row.description?.trim() || null;
  }
  activityRowStartAt(row) {
    return this.activityEventDTOForRow(row)?.startAtIso ?? row.dateIso ?? null;
  }
  activityRowEndAt(row) {
    return this.activityEventDTOForRow(row)?.endAtIso ?? this.activityRowStartAt(row);
  }
  activityRowSubtitle(row) {
    const dto = this.activityEventDTOForRow(row);
    return dto?.subtitle?.trim() || row.description?.trim() || "";
  }
  activityRowActivityCount(row) {
    const dto = this.activityEventDTOForRow(row);
    return this.chatCountValue(dto?.activity ?? row.badgeCount);
  }
  activityRowCreatorInitials(row) {
    const dto = this.activityEventDTOForRow(row);
    return dto?.creatorInitials?.trim() || row.mediaStart?.label?.trim() || AppUtils.initialsFromText(dto?.creatorName ?? row.title);
  }
  activityRowVisibility(row) {
    return this.activityEventDTOForRow(row)?.visibility ?? "Public";
  }
  activityStatusCode(row) {
    const dto = this.activityEventDTOForRow(row);
    return this.normalizeActivityStatusCode(dto?.status ?? row.status);
  }
  isActivityDraftRow(row) {
    return this.activityStatusCode(row) === "DR" || this.activitiesEventScope === "drafts";
  }
  normalizeActivityStatusCode(statusValue) {
    const status = `${statusValue ?? ""}`.trim();
    switch (status) {
      case "A":
        return "A";
      case "DR":
        return "DR";
      case "T":
        return "T";
      case "UR":
        return "UR";
      case "B":
        return "B";
      case "D":
        return "D";
      case "I":
        return "I";
      default:
        return "A";
    }
  }
  isExitActivityRow(row) {
    return !this.isActivityRowAdmin(row) && !this.isActivityInvitationRow(row);
  }
  activityServiceChatActionLabel(row) {
    if (this.isActivityRowAdmin(row)) {
      return "Notify Participants";
    }
    if (this.isActivityInvitationRow(row)) {
      return "Ask Organizer";
    }
    return "Ask Organizer";
  }
  isActivityInvitationRow(row) {
    return this.activityEventListTypeForRow(row) === "invitations";
  }
  onActivityEventCardMenuAction(row, action) {
    switch (action.actionId) {
      case "publish":
        this.runActivityItemPublishAction(row, void 0, action.action);
        break;
      case "unpublish":
        this.runActivityItemUnpublishAction(row, void 0, action.action);
        break;
      case "takeOver":
        this.runActivityItemTakeOverAction(row, void 0, action.action);
        break;
      case "editEvent":
      case "manageEvent":
        this.runActivityItemPrimaryAction(row);
        break;
      case "viewInvitation":
      case "view":
        this.runActivityItemViewAction(row);
        break;
      case "continueBooking":
        this.runActivityItemCheckoutAction(row, false);
        break;
      case "paymentSummary":
        this.runActivityItemCheckoutAction(row, true);
        break;
      case "notifyParticipants":
      case "askOrganizer":
        this.runActivityItemServiceChatAction(row, action.card);
        break;
      case "shareEvent":
        this.runActivityItemShareAction(row, action.card);
        break;
      case "reportOrganizer":
        this.runActivityItemReportAction(row, action.card);
        break;
      case "accept":
        this.runActivityItemApproveAction(row);
        break;
      case "leaveEvent":
      case "deleteEvent":
      case "rejectInvitation":
        this.runActivityItemSecondaryAction(row, void 0, action.action);
        break;
      case "restore":
        this.runActivityItemRestoreAction(row, void 0, action.action);
        break;
    }
  }
  runActivityItemPrimaryAction(row, event) {
    event?.stopPropagation();
    this.openActivityRowInEventModule(row, false);
  }
  runActivityItemViewAction(row, event) {
    event?.stopPropagation();
    const dto = this.activityEventDTOForRow(row);
    const memberSummary = ActivityEventInfoCardConverter.toActivityMembersSummary(row);
    this.eventSubeventsStore.openEventSubeventsListPopup({
      eventId: row.id,
      host: "activities",
      target: this.isActivityRowAdmin(row) || this.activityEventListTypeForRow(row) === "hosting" ? "hosting" : "events",
      title: row.title,
      timeframe: this.activityRowTimeframe(row),
      startAtIso: this.activityRowStartAt(row),
      endAtIso: this.activityRowEndAt(row),
      mode: dto?.mode ?? null,
      acceptedMembers: memberSummary?.acceptedMembers,
      pendingMembers: memberSummary?.pendingMembers,
      capacityTotal: memberSummary?.capacityTotal,
      resourceOwnerUserId: dto?.creatorUserId ?? row.ownerUserId ?? null,
      editorAction: this.isActivityInvitationRow(row) ? "view" : this.activityEventEditorAction(row)
    });
  }
  activityEventEditorAction(row) {
    return ActivityEventInfoCardMenuConverter.eventEditorAction(this.activityEventMenuSubjectFromRow(row), {
      activeUserId: this.activeUser.id
    });
  }
  runActivityItemCheckoutAction(row, readOnlySummary, event) {
    event?.stopPropagation();
    void this.openActivityCheckout(row, readOnlySummary);
  }
  async openActivityCheckout(row, readOnlySummary) {
    const activeUserId = this.activeUserId();
    if (!activeUserId) {
      return;
    }
    const relatedSource = this.activityDisplaySourceForRow(row);
    const draft = this.eventCheckoutDraftStore.read(activeUserId, row.id);
    const loadingDialog = this.eventCheckoutDialogStore.open({
      mode: "join",
      userId: activeUserId,
      record: this.buildActivityCheckoutLoadingRecord(row, activeUserId, relatedSource),
      loading: true,
      readOnlySummary,
      title: readOnlySummary ? "event.checkout.payment.summary" : "event.checkout.continue.booking",
      confirmLabel: "Join",
      busyConfirmLabel: "Joining...",
      failureMessage: readOnlySummary ? "Unable to open payment summary." : "Unable to continue booking.",
      onSubmit: (selection) => this.submitActivityCheckoutContinuation(row, selection)
    });
    const loadingDialogId = loadingDialog?.id ?? null;
    const record = await this.eventsService.queryKnownRecordById(activeUserId, row.id);
    if (!this.eventCheckoutDialogStore.isCurrent(loadingDialogId)) {
      return;
    }
    if (!record) {
      this.eventCheckoutDialogStore.close();
      this.dialogStore.openInfo("This checkout can no longer be restored.", {
        title: "Basket unavailable",
        confirmTone: "neutral"
      });
      this.cdr.markForCheck();
      return;
    }
    const currentDraft = this.eventCheckoutDraftStore.read(activeUserId, row.id) ?? draft;
    const approvalGranted = readOnlySummary || this.activityCheckoutApprovalGranted(record, currentDraft, row);
    const pendingReason = readOnlySummary || approvalGranted ? null : this.activityCheckoutPendingReason(currentDraft, record);
    this.eventCheckoutDialogStore.update(loadingDialogId, {
      mode: "join",
      userId: activeUserId,
      record,
      readOnlySummary,
      requiresApprovalBeforePayment: this.activityCheckoutRequiresApprovalBeforePayment(record, currentDraft),
      approvalGranted,
      pendingReason,
      title: readOnlySummary ? "event.checkout.payment.summary" : "event.checkout.continue.booking",
      subtitle: record.timeframe,
      confirmLabel: "Join",
      busyConfirmLabel: "Joining...",
      failureMessage: readOnlySummary ? "Unable to open payment summary." : "Unable to continue booking.",
      onSubmit: (selection) => this.submitActivityCheckoutContinuation(row, selection)
    });
  }
  buildActivityCheckoutLoadingRecord(row, activeUserId, source) {
    return __spreadProps(__spreadValues({}, this.buildInvitationCheckoutLoadingRecord(row, activeUserId, source)), {
      type: this.activityEventListTypeForRow(row)
    });
  }
  activityCheckoutPendingReason(draft, record) {
    if (draft?.pendingReason === "waitlist" || draft?.checkoutState === "waiting") {
      return "waitlist";
    }
    if (draft?.pendingReason === "approval" || draft?.checkoutState === "approval-pending") {
      return "approval";
    }
    if (record?.pendingReason === "waitlist" || record?.pendingReason === "approval") {
      return record.pendingReason;
    }
    return null;
  }
  activityCheckoutRequiresApprovalBeforePayment(record, draft = null) {
    return record?.approvalRequired === true || draft?.pendingReason === "approval";
  }
  activityCheckoutApprovalGranted(record, draft, row) {
    const activeUserId = this.activeUserId();
    return (record.acceptedMemberUserIds ?? []).includes(activeUserId) || this.activityCheckoutMemberStatus(row.id) === "accepted" || draft?.checkoutState === "approved" || draft?.checkoutState === "confirmed" || draft?.checkoutState === "pay";
  }
  activityCheckoutMemberStatus(sourceId) {
    const activeUserId = this.activeUserId();
    const ownerId = sourceId.trim();
    if (!activeUserId || !ownerId) {
      return "none";
    }
    const members = this.activityMembersService.peekMembersByOwner({
      ownerType: "event",
      ownerId
    });
    const member = members.find((item) => item.userId === activeUserId);
    if (member?.status === "accepted") {
      return "accepted";
    }
    if (member?.status === "pending") {
      return "pending";
    }
    return "none";
  }
  async submitActivityCheckoutContinuation(row, selection) {
    const activeUserId = this.activeUserId();
    if (!activeUserId) {
      throw new Error("Unable to resolve active user.");
    }
    const joinResult = await this.eventsService.requestJoin(activeUserId, row.id, {
      slotSourceId: selection?.slotSourceId ?? null,
      optionalSubEventIds: selection?.optionalSubEventIds ?? [],
      assetSelections: selection?.assetSelections ?? [],
      acceptedPolicyIds: selection?.acceptedPolicyIds ?? [],
      appliedPromoCodes: selection?.appliedPromoCodes ?? [],
      paymentSessionId: selection?.paymentSessionId ?? null,
      bookingConfirmed: selection?.bookingConfirmed !== false,
      pendingReason: selection?.pendingReason ?? null,
      checkoutState: selection?.checkoutState,
      basketItems: selection?.basketItems?.length ? selection.basketItems : void 0,
      pricingSummaryRows: selection?.basketItems?.length ? selection.pricingSummaryRows ?? [] : void 0,
      lineItems: selection?.basketItems?.length ? selection.lineItems : void 0,
      totalAmount: selection?.basketItems?.length ? selection.totalAmount : void 0,
      currency: selection?.basketItems?.length ? selection.currency : void 0,
      skipLocalRouteDelay: Boolean(selection?.paymentSessionId)
    });
    if (joinResult?.reason === "tournament-registration-closed") {
      throw new Error("event.tournament.registration.closed.message");
    }
    if (!joinResult || joinResult.membershipStatus === "unchanged") {
      throw new Error("Unable to continue booking.");
    }
    this.emitAcceptedCheckoutActivityEventSync(row, activeUserId, joinResult);
  }
  emitAcceptedCheckoutActivityEventSync(row, activeUserId, result) {
    if (result.membershipStatus !== "accepted") {
      return;
    }
    const dto = this.activityEventDTOForRow(row);
    if (!dto) {
      return;
    }
    const acceptedMemberUserIds = this.uniqueUserIds([
      ...dto.acceptedMemberUserIds ?? [],
      activeUserId
    ]);
    const pendingMemberUserIds = this.uniqueUserIds(dto.pendingMemberUserIds ?? []).filter((userId) => userId !== activeUserId);
    const invitedMemberUserIds = this.uniqueUserIds(dto.invitedMemberUserIds ?? []).filter((userId) => userId !== activeUserId);
    const pendingRequestMemberUserIds = this.uniqueUserIds(dto.pendingRequestMemberUserIds ?? []).filter((userId) => userId !== activeUserId);
    const acceptedMembers = Math.max(this.nonNegativeInteger(result.acceptedMembers), acceptedMemberUserIds.length);
    const pendingMembers = Math.max(this.nonNegativeInteger(result.pendingMembers), pendingMemberUserIds.length, pendingRequestMemberUserIds.length);
    const capacityTotal = Math.max(acceptedMembers, this.nonNegativeInteger(result.capacityTotal), this.nonNegativeInteger(dto.capacityTotal));
    this.activitiesStore.emitActivityEventSync(__spreadProps(__spreadValues({}, dto), {
      status: dto.status ?? "A",
      acceptedMembers,
      pendingMembers,
      capacityTotal,
      full: result.full === true || capacityTotal > 0 && acceptedMembers >= capacityTotal,
      acceptedMemberUserIds,
      pendingMemberUserIds,
      invitedMemberUserIds,
      pendingRequestMemberUserIds,
      pendingReason: null,
      checkoutResultState: "succeeded"
    }));
  }
  nonNegativeInteger(value) {
    return Math.max(0, Math.trunc(Number(value) || 0));
  }
  activityEventMenuSubjectFromRow(row) {
    const dto = this.activityEventDTOForRow(row);
    const draft = this.eventCheckoutDraftStore.read(this.activeUserId(), row.id);
    return {
      menu: "activity-event-card",
      id: row.id,
      status: dto?.status ?? row.status ?? null,
      ownerUserId: dto?.creatorUserId ?? row.ownerUserId ?? row.ownerId ?? null,
      adminIds: [...dto?.adminIds ?? []],
      acceptedMemberUserIds: [...dto?.acceptedMemberUserIds ?? []],
      pendingMemberUserIds: [...dto?.pendingMemberUserIds ?? []],
      invitedMemberUserIds: [...dto?.invitedMemberUserIds ?? []],
      pendingRequestMemberUserIds: [...dto?.pendingRequestMemberUserIds ?? []],
      activity: dto?.activity ?? row.menuBadgeCount ?? 0,
      eventScope: this.activitiesEventScope,
      checkoutState: draft?.checkoutState ?? null
    };
  }
  runActivityItemServiceChatAction(row, card = null, event) {
    event?.stopPropagation();
    const chat = this.resolveActivityServiceChat(row, card);
    if (!chat) {
      return;
    }
    this.openActivityChat(chat);
  }
  runActivityItemShareAction(row, card = null, event) {
    event?.stopPropagation();
    const entityId = this.resolveActivityShareEntityId(row, card);
    if (!entityId) {
      return;
    }
    void this.shareTokensService.createToken({
      kind: "event",
      entityId,
      ownerUserId: this.activeUser.id.trim()
    }).then((token) => {
      if (!token) {
        return;
      }
      this.dialogStore.open({
        title: "Share event",
        message: token,
        confirmLabel: "Copy link",
        cancelLabel: "Cancel",
        confirmTone: "accent",
        onConfirm: async () => {
          await navigator.clipboard?.writeText(token);
        }
      });
    });
  }
  resolveActivityShareEntityId(row, card = null) {
    return `${this.activityInfoCardEntityId(card ?? this.activityInfoCardForRow(row)) || row.id || ""}`.trim();
  }
  runActivityItemReportAction(row, card = null, event) {
    event?.stopPropagation();
    const target = this.resolveActivityReportTarget(row, card ?? this.activityInfoCardForRow(row));
    if (!target || target.userId === this.activeUser.id.trim()) {
      return;
    }
    const entityId = this.resolveActivityShareEntityId(row, card);
    this.profileStore.openReportUserPopup({
      targetUserId: target.userId,
      targetName: target.name,
      eventId: entityId || row.id,
      eventTitle: row.title,
      eventStartAtIso: target.startAtIso,
      eventTimeframe: target.timeframe,
      ownerType: "event"
    });
    this.cdr.markForCheck();
  }
  resolveActivityReportTarget(row, card = null) {
    const source = this.activityDisplaySourceForRow(row);
    const ownerId = `${source?.creatorUserId ?? this.activityInfoCardOwnerId(card)}`.trim();
    if (!ownerId) {
      return null;
    }
    const ownerName = `${source?.creatorName ?? ""}`.trim() || (this.isActivityInvitationRow(row) ? `${source?.inviter ?? ""}`.trim() : "") || "Organizer";
    return {
      userId: ownerId,
      name: ownerName,
      startAtIso: source?.startAt ?? row.dateIso ?? null,
      timeframe: source?.timeframe ?? source?.when ?? this.activityRowTimeframe(row)
    };
  }
  resolveActivityServiceChat(row, card = null) {
    const activeUserId = this.activeUser.id.trim();
    if (!activeUserId) {
      return null;
    }
    const source = this.activityDisplaySourceForRow(row);
    const eventId = `${source?.id ?? this.resolveActivityShareEntityId(row, card)}`.trim();
    const ownerId = `${source?.creatorUserId ?? this.activityInfoCardOwnerId(card ?? this.activityInfoCardForRow(row))}`.trim();
    if (!eventId || !ownerId) {
      return null;
    }
    const title = row.title?.trim() || `${source?.title ?? source?.description ?? ""}`.trim() || card?.title?.trim() || this.activityInfoCardForRow(row)?.title?.trim() || "Event";
    return this.chatsService.buildActivityServiceChat({
      activeUserId,
      eventId,
      ownerId,
      title,
      actionLabel: this.activityServiceChatActionLabel(row),
      creatorName: source?.creatorName ?? null,
      hosting: this.isActivityRowAdmin(row),
      notification: this.isActivityRowAdmin(row)
    });
  }
  activityInfoCardEntityId(card) {
    return `${card?.id ?? ""}`.trim();
  }
  activityInfoCardOwnerId(card) {
    return `${card?.ownerId ?? ""}`.trim();
  }
  activityInfoCardForRow(row) {
    return row;
  }
  activityRowDistanceKm(row) {
    const meters = Number.isFinite(row.distanceMetersExact) ? Math.max(0, Math.trunc(Number(row.distanceMetersExact))) : 0;
    return Math.round(meters / 1e3 * 10) / 10;
  }
  activityDisplaySourceForRow(row) {
    const dto = this.activityEventDTOForRow(row);
    if (dto) {
      return __spreadProps(__spreadValues({}, dto), {
        avatar: dto.creatorInitials ?? "",
        description: dto.title,
        shortDescription: dto.subtitle,
        when: dto.timeframe,
        unread: dto.activity,
        isAdmin: this.isActivityRowAdmin(row),
        startAt: dto.startAtIso,
        endAt: dto.endAtIso,
        capacityMax: dto.capacityMax ?? dto.capacityTotal,
        capacityMin: dto.capacityMin ?? null
      });
    }
    return {
      id: row.id,
      avatar: this.activityRowCreatorInitials(row),
      title: row.title,
      description: row.title,
      shortDescription: this.activityRowSubtitle(row),
      timeframe: this.activityRowTimeframe(row),
      when: this.activityRowTimeframe(row),
      activity: this.activityRowActivityCount(row),
      unread: this.activityRowActivityCount(row),
      isAdmin: this.isActivityRowAdmin(row),
      creatorUserId: row.ownerId ?? row.ownerUserId ?? "",
      creatorName: row.description || row.title,
      startAt: this.activityRowStartAt(row),
      endAt: this.activityRowEndAt(row),
      distanceKm: this.activityRowDistanceKm(row),
      acceptedMembers: 0,
      pendingMembers: 0,
      capacityTotal: 0,
      capacityMin: null,
      capacityMax: null,
      imageUrl: row.imageUrl ?? "",
      visibility: this.activityRowVisibility(row)
    };
  }
  runActivityItemApproveAction(row, event) {
    event?.stopPropagation();
    void this.openInvitationApprovalFlow(row);
  }
  async openInvitationApprovalFlow(row) {
    const activeUserId = this.activeUser.id.trim();
    if (!activeUserId) {
      return;
    }
    const relatedSource = this.activityDisplaySourceForRow(row);
    const loadingDialog = this.eventCheckoutDialogStore.open({
      mode: "invitation",
      userId: activeUserId,
      record: this.buildInvitationCheckoutLoadingRecord(row, activeUserId, relatedSource),
      loading: true,
      title: "Accept invitation?",
      confirmLabel: "Accept",
      busyConfirmLabel: "Accepting...",
      failureMessage: "Unable to accept invitation.",
      onSubmit: (selection) => this.confirmActivityInvitationApproval(row, selection)
    });
    const loadingDialogId = loadingDialog?.id ?? null;
    const invitationContext = await this.eventsService.loadInvitationContext(activeUserId, row.id);
    const record = invitationContext?.record ?? null;
    const currentMembers = invitationContext?.members ?? [];
    const requiresAdminApproval = this.resolveInvitationRequiresAdminApprovalFromMembers(currentMembers, record?.creatorUserId ?? relatedSource.creatorUserId);
    if (!this.eventCheckoutDialogStore.isCurrent(loadingDialogId)) {
      return;
    }
    const approvalContext = {
      record,
      currentMembers,
      requiresAdminApproval
    };
    if (record && this.shouldUseCheckoutFlow(record)) {
      this.eventCheckoutDialogStore.update(loadingDialogId, {
        mode: "invitation",
        userId: activeUserId,
        record,
        preloadedCheckoutBasket: invitationContext?.checkoutBasket ?? null,
        requiresApprovalBeforePayment: requiresAdminApproval,
        title: "Accept invitation?",
        subtitle: record.timeframe,
        confirmLabel: "Accept",
        busyConfirmLabel: "Accepting...",
        failureMessage: "Unable to accept invitation.",
        onSubmit: (selection) => this.confirmActivityInvitationApproval(row, selection, approvalContext)
      });
      return;
    }
    this.eventCheckoutDialogStore.close();
    this.dialogStore.open({
      title: "Accept invitation?",
      message: row.title,
      cancelLabel: "Cancel",
      confirmLabel: "Accept",
      busyConfirmLabel: "Accepting...",
      confirmTone: "accent",
      failureMessage: "Unable to accept invitation.",
      onConfirm: () => this.confirmActivityInvitationApproval(row, null, approvalContext)
    });
  }
  buildInvitationCheckoutLoadingRecord(row, activeUserId, source) {
    const title = `${source?.title ?? row.title ?? ""}`.trim() || "Event";
    const timeframe = `${source?.timeframe ?? source?.when ?? this.activityRowTimeframe(row) ?? ""}`.trim();
    const startAtIso = `${source?.startAtIso ?? source?.startAt ?? this.activityRowStartAt(row) ?? ""}`.trim();
    const endAtIso = `${source?.endAtIso ?? source?.endAt ?? this.activityRowEndAt(row) ?? startAtIso}`.trim();
    const creatorName = `${source?.creatorName ?? row.description ?? title}`.trim() || title;
    const creatorInitials = `${source?.creatorInitials ?? source?.avatar ?? this.activityRowCreatorInitials(row)}`.trim() || AppUtils.initialsFromText(creatorName);
    const capacityTotal = this.chatCountValue(source?.capacityTotal ?? source?.capacityMax);
    const detail = new ActivityEventDetailDTO().apply({
      id: row.id,
      userId: activeUserId,
      type: "invitations",
      status: this.activityStatusCode(row),
      title,
      subtitle: `${source?.shortDescription ?? source?.subtitle ?? this.activityRowSubtitle(row)}`.trim(),
      timeframe,
      activity: this.chatCountValue(source?.activity ?? source?.unread ?? row.badgeCount),
      startAtIso,
      endAtIso,
      distanceKm: Number.isFinite(Number(source?.distanceKm)) ? Math.max(0, Number(source.distanceKm)) : this.activityRowDistanceKm(row),
      imageUrl: `${source?.imageUrl ?? row.imageUrl ?? ""}`.trim(),
      creatorUserId: `${source?.creatorUserId ?? row.ownerId ?? row.ownerUserId ?? ""}`.trim(),
      creatorName,
      creatorInitials,
      creatorGender: source?.creatorGender === "woman" ? "woman" : "man",
      creatorCity: `${source?.creatorCity ?? ""}`.trim(),
      visibility: source?.visibility ?? this.activityRowVisibility(row),
      blindMode: source?.blindMode ?? "Open Event",
      sourceLink: `${source?.sourceLink ?? ""}`.trim(),
      location: `${source?.location ?? ""}`.trim(),
      locationCoordinates: source?.locationCoordinates ?? null,
      capacityMin: source?.capacityMin ?? null,
      capacityMax: source?.capacityMax ?? capacityTotal,
      capacityTotal,
      autoInviter: source?.autoInviter === true,
      frequency: source?.frequency ?? "One-time",
      ticketing: source?.ticketing === true,
      approvalRequired: source?.approvalRequired === true,
      pricing: source?.pricing ?? null,
      policiesEnabled: source?.policiesEnabled === true,
      policies: Array.isArray(source?.policies) ? source.policies.map((item) => __spreadValues({}, item)) : [],
      slotsEnabled: source?.slotsEnabled === true,
      slotTemplates: Array.isArray(source?.slotTemplates) ? source.slotTemplates.map((item) => __spreadValues({}, item)) : [],
      parentEventId: source?.parentEventId ?? null,
      slotTemplateId: source?.slotTemplateId ?? null,
      generated: source?.generated === true,
      eventType: source?.eventType ?? "main",
      nextSlot: source?.nextSlot ? __spreadValues({}, source.nextSlot) : null,
      upcomingSlots: Array.isArray(source?.upcomingSlots) ? source.upcomingSlots.map((item) => __spreadValues({}, item)) : [],
      acceptedMembers: this.chatCountValue(source?.acceptedMembers),
      pendingMembers: this.chatCountValue(source?.pendingMembers),
      acceptedMemberUserIds: [...source?.acceptedMemberUserIds ?? []],
      pendingMemberUserIds: [...source?.pendingMemberUserIds ?? []],
      invitedMemberUserIds: [...source?.invitedMemberUserIds ?? []],
      pendingRequestMemberUserIds: [...source?.pendingRequestMemberUserIds ?? []],
      pendingReason: source?.pendingReason,
      topics: [...source?.topics ?? []],
      subEventsEnabled: source?.subEventsEnabled ?? true,
      subEventDefinitions: [...source?.subEventDefinitions ?? []],
      subEvents: Array.isArray(source?.subEvents) ? this.cloneSyncedSubEventForms(source.subEvents) : [],
      mode: source?.mode ?? "Casual",
      rating: this.chatCountValue(source?.rating),
      boost: this.chatCountValue(source?.boost),
      affinity: this.chatCountValue(source?.affinity)
    });
    return __spreadProps(__spreadValues({}, detail), {
      userId: activeUserId,
      type: "invitations",
      avatar: `${source?.avatar ?? creatorInitials}`.trim(),
      inviter: source?.inviter ?? null,
      unread: this.chatCountValue(source?.unread ?? source?.activity ?? row.badgeCount),
      trashedAtIso: null,
      creatorGender: source?.creatorGender === "woman" ? "woman" : "man",
      adminIds: [...source?.adminIds ?? []]
    });
  }
  runActivityItemRestoreAction(row, event, action) {
    event?.stopPropagation();
    this.dialogStore.open({
      title: "Restore event?",
      message: row.title,
      cancelLabel: "Cancel",
      confirmLabel: "Restore",
      busyConfirmLabel: "Restoring...",
      confirmTone: "accent",
      confirmPalette: this.confirmationPaletteForCardAction(action),
      failureMessage: "Unable to restore event.",
      onConfirm: () => this.restoreActivityRow(row)
    });
  }
  runActivityItemSecondaryAction(row, event, action) {
    event?.stopPropagation();
    const isRejectInvitation = action?.id === "rejectInvitation" || this.isActivityInvitationRow(row);
    this.dialogStore.open({
      title: this.activitySecondaryConfirmTitle(row, isRejectInvitation),
      message: row.title,
      cancelLabel: "Cancel",
      confirmLabel: this.activitySecondaryConfirmActionLabel(row, isRejectInvitation),
      busyConfirmLabel: this.activitySecondaryConfirmBusyLabel(row, isRejectInvitation),
      confirmTone: "danger",
      confirmPalette: this.confirmationPaletteForCardAction(action),
      failureMessage: this.activitySecondaryConfirmFailureMessage(row, isRejectInvitation),
      onConfirm: () => this.confirmActivitySecondaryAction(row, isRejectInvitation)
    });
  }
  runActivityItemPublishAction(row, event, action) {
    event?.stopPropagation();
    this.dialogStore.open({
      title: "Publish event?",
      message: row.title,
      cancelLabel: "Cancel",
      confirmLabel: "Publish",
      busyConfirmLabel: "Publishing...",
      confirmTone: "accent",
      confirmPalette: this.confirmationPaletteForCardAction(action),
      failureMessage: "Unable to publish event.",
      onConfirm: () => this.confirmActivityPublish(row)
    });
  }
  runActivityItemUnpublishAction(row, event, action) {
    event?.stopPropagation();
    this.dialogStore.open({
      title: "Unpublish event?",
      message: row.title,
      cancelLabel: "Cancel",
      confirmLabel: "Unpublish",
      busyConfirmLabel: "Unpublishing...",
      confirmTone: "neutral",
      confirmPalette: this.confirmationPaletteForCardAction(action),
      failureMessage: "Unable to unpublish event.",
      onConfirm: () => this.confirmActivityUnpublish(row)
    });
  }
  runActivityItemTakeOverAction(row, event, action) {
    event?.stopPropagation();
    this.dialogStore.open({
      title: "Take over event?",
      message: row.title,
      cancelLabel: "Cancel",
      confirmLabel: "Take Over",
      busyConfirmLabel: "Taking over...",
      confirmTone: "accent",
      confirmPalette: this.confirmationPaletteForCardAction(action),
      failureMessage: "Unable to take over event.",
      onConfirm: () => this.confirmActivityTakeOver(row)
    });
  }
  async confirmActivityTakeOver(row) {
    await this.eventsService.takeOverItem(this.activeUser.id, row.id);
    const nextStatus = this.restoredActivityStatus();
    this.applyActivityEventCounterDeltas({}, { pending: -1 });
    if (this.activitiesEventScope === "pending") {
      this.activitiesSmartList?.removeVisibleItemByIdentity(this.activityRowIdentity(row));
    } else {
      this.activitiesSmartList?.patchVisibleItem((item) => item.id === row.id, { status: nextStatus });
    }
    this.refreshSectionBadges();
    this.cdr.markForCheck();
  }
  restoredActivityStatus() {
    return "A";
  }
  confirmationPaletteForCardAction(action) {
    switch (action?.tone) {
      case "accent":
        return "brown";
      case "warning":
      case "review":
        return "orange";
      case "destructive":
        return "danger";
      default:
        return null;
    }
  }
  async confirmActivityPublish(row) {
    const activeUserId = this.activeUserId();
    const result = await this.eventsService.publishItem(this.activeUser.id, row.id);
    if (!result || result.changed === false) {
      throw new Error(result?.reason === "forbidden" ? "You are not allowed to publish this event." : "Unable to publish event.");
    }
    this.activeHostingIds = /* @__PURE__ */ new Set([...this.activeHostingIds, row.id]);
    if (this.shouldRemovePublishedRowFromCurrentScope()) {
      this.activitiesSmartList?.removeVisibleItemByIdentity(this.activityRowIdentity(row));
    } else {
      this.patchVisiblePublicationState(row, "A");
    }
    this.signalActivityCounterDelta(activeUserId, result.counterDelta ?? null);
    this.refreshSectionBadges();
    this.cdr.markForCheck();
  }
  async confirmActivityUnpublish(row) {
    const activeUserId = this.activeUserId();
    const result = await this.eventsService.unpublishItem(this.activeUser.id, row.id);
    if (!result || result.changed === false) {
      throw new Error(result?.reason === "forbidden" ? "You are not allowed to unpublish this event." : "Unable to unpublish event.");
    }
    const nextActiveIds = new Set(this.activeHostingIds);
    nextActiveIds.delete(row.id);
    this.activeHostingIds = nextActiveIds;
    this.patchVisiblePublicationState(row, "DR");
    this.signalActivityCounterDelta(activeUserId, result.counterDelta ?? null);
    this.refreshSectionBadges();
    this.cdr.markForCheck();
  }
  patchVisiblePublicationState(row, status) {
    const source = this.activityEventDTOForRow(row);
    if (source) {
      this.activitiesStore.emitActivityEventSync(__spreadProps(__spreadValues({}, source), {
        status
      }));
      return;
    }
    const identity = this.activityRowIdentity(row);
    this.activitiesSmartList?.patchVisibleItem((item) => this.activityRowIdentity(item) === identity, (item) => __spreadProps(__spreadValues({}, item), {
      status,
      surfaceTone: status === "DR" ? "draft" : "published",
      mediaEnd: item.mediaEnd ? __spreadProps(__spreadValues({}, item.mediaEnd), {
        tone: status === "DR" ? "inactive" : item.mediaEnd.tone
      }) : item.mediaEnd
    }));
  }
  shouldRemovePublishedRowFromCurrentScope() {
    return this.activitiesEventScope === "drafts" || this.activitiesEventScope === "my-events" && this.hostingPublicationFilter === "drafts";
  }
  activitySecondaryConfirmTitle(row, isRejectInvitation = false) {
    if (isRejectInvitation) {
      return "Reject invitation?";
    }
    if (!this.isActivityRowAdmin(row)) {
      return "Leave event?";
    }
    return "Delete event?";
  }
  activitySecondaryConfirmActionLabel(row, isRejectInvitation = false) {
    if (isRejectInvitation) {
      return "Reject Invitation";
    }
    if (!this.isActivityRowAdmin(row)) {
      return "Leave";
    }
    return "Delete";
  }
  activitySecondaryConfirmBusyLabel(row, isRejectInvitation = false) {
    if (isRejectInvitation) {
      return "Rejecting...";
    }
    if (!this.isActivityRowAdmin(row)) {
      return "Leaving...";
    }
    return "Deleting...";
  }
  activitySecondaryConfirmFailureMessage(row, isRejectInvitation = false) {
    if (isRejectInvitation) {
      return "Unable to reject invitation.";
    }
    if (!this.isActivityRowAdmin(row)) {
      return "Unable to leave event.";
    }
    return "Unable to delete event.";
  }
  async confirmActivitySecondaryAction(row, isRejectInvitation = false) {
    if (isRejectInvitation || !this.isActivityRowAdmin(row) && !this.isActivityInvitationRow(row)) {
      await this.confirmActivityLeave(row);
      return;
    }
    const activeUserId = this.activeUserId();
    const result = await this.persistActivityRowTrash(row);
    this.activitiesStore.emitActivityEventRemoval(row.id);
    this.signalActivityCounterDelta(activeUserId, result.counterDelta ?? null);
    this.cdr.markForCheck();
  }
  async confirmActivityLeave(row) {
    const activeUserId = this.activeUser.id.trim();
    if (!activeUserId) {
      return;
    }
    const leaveResult = await this.eventsService.leaveEvent(activeUserId, row.id, {
      removeMembershipOnly: true,
      checkoutState: "cancelled",
      checkoutResultState: "deleted"
    });
    if (!leaveResult || leaveResult.changed === false && leaveResult.reason !== "already-applied" || leaveResult.membershipStatus === "unchanged") {
      throw new Error("Unable to leave event.");
    }
    if (leaveResult.changed !== false) {
      this.signalActivityCounterDelta(activeUserId, leaveResult.counterDelta ?? null);
    }
    if (this.selectedActivityMembersRowId === this.activityRowIdentity(row)) {
      this.selectedActivityMembers = this.selectedActivityMembers.filter((member) => member.userId !== activeUserId);
      this.activityMembersByRowId[this.selectedActivityMembersRowId] = [...this.selectedActivityMembers];
    }
    this.emitActivityLeaveMembersSync(row, leaveResult);
    this.eventCheckoutDraftStore.clear(activeUserId, row.id);
    this.cdr.markForCheck();
  }
  emitActivityLeaveMembersSync(row, result) {
    const sourceId = `${result?.sourceId ?? row.id ?? ""}`.trim();
    if (!sourceId || !result) {
      return;
    }
    const acceptedMembers = Math.max(0, Math.trunc(Number(result.acceptedMembers) || 0));
    const pendingMembers = Math.max(0, Math.trunc(Number(result.pendingMembers) || 0));
    this.activityStore.emitActivityMembersSync({
      id: sourceId,
      acceptedMembers,
      pendingMembers,
      capacityTotal: Math.max(acceptedMembers, Math.trunc(Number(result.capacityTotal) || 0)),
      viewerMembershipRemoved: true
    });
  }
  shouldUseCheckoutFlow(record) {
    if ((record?.upcomingSlots?.length ?? 0) > 0) {
      return true;
    }
    if (record?.policiesEnabled === true && (record?.policies?.length ?? 0) > 0) {
      return true;
    }
    if ((record?.subEvents ?? []).some((item) => item.optional)) {
      return true;
    }
    return Boolean(record?.pricing?.enabled && (Number(record?.pricing?.basePrice) || 0) > 0);
  }
  async confirmActivityInvitationApproval(row, selection, context) {
    const activeUserId = this.activeUserId();
    const { eventDetailDTO } = await this.buildAcceptedInvitationSaveResult(row, selection, context);
    const pendingReason = this.acceptedInvitationPendingReason(activeUserId, eventDetailDTO, selection);
    const joinResult = await this.eventsService.requestJoin(activeUserId, eventDetailDTO.id, {
      slotSourceId: selection?.slotSourceId ?? null,
      optionalSubEventIds: selection?.optionalSubEventIds ?? [],
      assetSelections: selection?.assetSelections ?? [],
      acceptedPolicyIds: selection?.acceptedPolicyIds ?? [],
      appliedPromoCodes: selection?.appliedPromoCodes ?? [],
      paymentSessionId: selection?.paymentSessionId ?? null,
      bookingConfirmed: pendingReason == null && selection?.bookingConfirmed !== false,
      pendingReason,
      checkoutState: selection?.checkoutState,
      basketItems: selection?.basketItems?.length ? selection.basketItems : void 0,
      pricingSummaryRows: selection?.basketItems?.length ? selection.pricingSummaryRows ?? [] : void 0,
      lineItems: selection?.basketItems?.length ? selection.lineItems : void 0,
      totalAmount: selection?.basketItems?.length ? selection.totalAmount : void 0,
      currency: selection?.basketItems?.length ? selection.currency : void 0,
      skipLocalRouteDelay: Boolean(selection?.paymentSessionId)
    });
    if (joinResult?.reason === "tournament-registration-closed") {
      throw new Error("event.tournament.registration.closed.message");
    }
    if (!joinResult || joinResult.membershipStatus === "unchanged") {
      throw new Error("Unable to accept invitation.");
    }
    this.emitAcceptedCheckoutActivityEventSync(row, activeUserId, joinResult);
    this.removeInvitationItem(eventDetailDTO.id);
    this.activitiesSmartList?.removeVisibleItemByIdentity(this.activityRowIdentity(row));
    this.signalActivityCounterDelta(activeUserId, joinResult.counterDelta ?? null);
    this.cdr.markForCheck();
  }
  acceptedInvitationPendingReason(activeUserId, detail, selection) {
    if (selection?.pendingReason === "waitlist") {
      return "waitlist";
    }
    if (selection?.pendingReason === "approval") {
      return "approval";
    }
    const movedToPending = activeUserId.length > 0 && (detail.pendingRequestMemberUserIds ?? []).includes(activeUserId) && !(detail.acceptedMemberUserIds ?? []).includes(activeUserId);
    return movedToPending ? "approval" : null;
  }
  async buildAcceptedInvitationSaveResult(row, selection, context) {
    const activeUserId = this.activeUser.id.trim();
    if (!activeUserId) {
      throw new Error("Unable to resolve active user.");
    }
    const relatedSource = this.activityDisplaySourceForRow(row);
    const invitationContext = context ? null : await this.eventsService.loadInvitationContext(activeUserId, row.id);
    const record = context?.record ?? invitationContext?.record ?? null;
    const currentMembers = context?.currentMembers ?? invitationContext?.members ?? [];
    const activeInviteEntry = currentMembers.find((member) => member.userId === activeUserId && member.status === "pending" && member.requestKind === "invite") ?? null;
    const requiresAdminApproval = context?.requiresAdminApproval ?? this.invitationRequiresAdminApproval(activeInviteEntry, currentMembers, record?.creatorUserId ?? relatedSource.creatorUserId);
    const existingAcceptedMemberUserIds = this.activityMemberUserIdsByStatus(currentMembers, "accepted");
    const existingPendingMemberUserIds = this.activityMemberUserIdsByStatus(currentMembers, "pending").filter((userId) => !existingAcceptedMemberUserIds.includes(userId));
    const activeUserWasAccepted = existingAcceptedMemberUserIds.includes(activeUserId);
    const activeUserWasPending = existingPendingMemberUserIds.includes(activeUserId);
    const nextAcceptedMemberUserIds = requiresAdminApproval ? existingAcceptedMemberUserIds.filter((userId) => userId !== activeUserId) : activeUserWasAccepted ? [...existingAcceptedMemberUserIds] : this.uniqueUserIds([...existingAcceptedMemberUserIds, activeUserId]);
    const nextPendingMemberUserIds = requiresAdminApproval ? this.uniqueUserIds([...existingPendingMemberUserIds, activeUserId]) : existingPendingMemberUserIds.filter((userId) => userId !== activeUserId);
    const existingInvitedMemberUserIds = this.uniqueUserIds([
      ...record?.invitedMemberUserIds ?? [],
      ...relatedSource.invitedMemberUserIds ?? []
    ]);
    const existingPendingRequestMemberUserIds = this.uniqueUserIds([
      ...record?.pendingRequestMemberUserIds ?? [],
      ...relatedSource.pendingRequestMemberUserIds ?? [],
      ...existingPendingMemberUserIds
    ]);
    const nextInvitedMemberUserIds = existingInvitedMemberUserIds.filter((userId) => userId !== activeUserId);
    const nextPendingRequestMemberUserIds = requiresAdminApproval ? this.uniqueUserIds([
      ...existingPendingRequestMemberUserIds.filter((userId) => userId !== activeUserId),
      activeUserId
    ]) : existingPendingRequestMemberUserIds.filter((userId) => userId !== activeUserId);
    const acceptedMembersBase = Math.max(this.chatCountValue(record?.acceptedMembers ?? relatedSource.acceptedMembers), existingAcceptedMemberUserIds.length);
    const pendingMembersBase = this.chatCountValue(record?.pendingMembers ?? relatedSource.pendingMembers ?? (activeUserWasPending ? 1 : existingPendingMemberUserIds.length));
    const nextAcceptedMembers = Math.max(nextAcceptedMemberUserIds.length, acceptedMembersBase + (nextAcceptedMemberUserIds.length - existingAcceptedMemberUserIds.length));
    const nextPendingMembers = Math.max(nextPendingMemberUserIds.length, pendingMembersBase + (nextPendingMemberUserIds.length - existingPendingMemberUserIds.length));
    const title = record?.title ?? relatedSource.title ?? relatedSource.description ?? row.title;
    const shortDescription = record?.subtitle ?? relatedSource.shortDescription ?? this.activityRowSubtitle(row) ?? `Invited by ${relatedSource.inviter ?? relatedSource.creatorName ?? row.title}`;
    const timeframe = record?.timeframe ?? relatedSource.timeframe ?? relatedSource.when ?? this.activityRowTimeframe(row);
    const startAt = record?.startAtIso ?? relatedSource.startAt ?? this.activityRowStartAt(row);
    const endAt = record?.endAtIso ?? relatedSource.endAt ?? this.activityRowEndAt(row) ?? startAt;
    const distanceKmRaw = record?.distanceKm ?? relatedSource.distanceKm ?? this.activityRowDistanceKm(row);
    const distanceKm = Number.isFinite(Number(distanceKmRaw)) ? Math.max(0, Number(distanceKmRaw)) : 0;
    const creatorName = record?.creatorName?.trim() || `${relatedSource.inviter ?? relatedSource.creatorName ?? ""}`.trim() || title;
    const creatorInitials = record?.creatorInitials?.trim() || relatedSource.avatar?.trim() || AppUtils.initialsFromText(creatorName);
    const capacityTotal = Math.max(nextAcceptedMembers, this.chatCountValue(record?.capacityTotal ?? relatedSource.capacityTotal ?? relatedSource.capacityMax));
    const selectedSlot = selection?.slotSourceId ? (record?.upcomingSlots ?? []).find((item) => item.id === selection.slotSourceId) ?? null : null;
    return {
      eventDetailDTO: new ActivityEventDetailDTO().apply({
        id: row.id,
        type: "events",
        title,
        subtitle: shortDescription,
        timeframe,
        activity: this.chatCountValue(record?.activity ?? relatedSource.activity ?? relatedSource.unread ?? this.activityRowActivityCount(row)),
        startAtIso: startAt,
        endAtIso: endAt,
        distanceKm,
        imageUrl: record?.imageUrl ?? relatedSource.imageUrl ?? row.imageUrl ?? "",
        acceptedMembers: nextAcceptedMembers,
        pendingMembers: nextPendingMembers,
        capacityTotal,
        capacityMin: record?.capacityMin ?? relatedSource.capacityMin ?? null,
        capacityMax: record?.capacityMax ?? relatedSource.capacityMax ?? capacityTotal,
        autoInviter: record?.autoInviter ?? relatedSource.autoInviter,
        frequency: record?.frequency ?? relatedSource.frequency,
        ticketing: record?.ticketing ?? relatedSource.ticketing,
        approvalRequired: record?.approvalRequired ?? relatedSource.approvalRequired,
        pricing: record?.pricing ?? relatedSource.pricing,
        policiesEnabled: record?.policiesEnabled ?? relatedSource.policiesEnabled ?? false,
        policies: Array.isArray(record?.policies) ? record.policies.map((item) => __spreadValues({}, item)) : Array.isArray(relatedSource.policies) ? relatedSource.policies.map((item) => __spreadValues({}, item)) : void 0,
        slotsEnabled: record?.slotsEnabled ?? relatedSource.slotsEnabled,
        slotTemplates: Array.isArray(record?.slotTemplates) ? record.slotTemplates.map((item) => __spreadValues({}, item)) : Array.isArray(relatedSource.slotTemplates) ? relatedSource.slotTemplates.map((item) => __spreadValues({}, item)) : void 0,
        parentEventId: record?.parentEventId ?? relatedSource.parentEventId,
        slotTemplateId: record?.slotTemplateId ?? relatedSource.slotTemplateId,
        generated: record?.generated ?? relatedSource.generated,
        eventType: record?.eventType ?? relatedSource.eventType,
        nextSlot: selectedSlot ? __spreadValues({}, selectedSlot) : record?.nextSlot ? __spreadValues({}, record.nextSlot) : relatedSource.nextSlot ? __spreadValues({}, relatedSource.nextSlot) : void 0,
        upcomingSlots: Array.isArray(record?.upcomingSlots) ? record.upcomingSlots.map((item) => __spreadValues({}, item)) : Array.isArray(relatedSource.upcomingSlots) ? relatedSource.upcomingSlots.map((item) => __spreadValues({}, item)) : void 0,
        visibility: record?.visibility ?? relatedSource.visibility,
        blindMode: record?.blindMode ?? relatedSource.blindMode,
        status: "A",
        statusBeforeSuppression: null,
        trashedAtIso: null,
        creatorUserId: record?.creatorUserId ?? relatedSource.creatorUserId,
        creatorName,
        creatorInitials,
        creatorGender: record?.creatorGender,
        creatorCity: record?.creatorCity,
        location: record?.location ?? relatedSource.location,
        locationCoordinates: record?.locationCoordinates ?? relatedSource.locationCoordinates,
        sourceLink: record?.sourceLink ?? relatedSource.sourceLink,
        topics: [...record?.topics ?? relatedSource.topics ?? []],
        acceptedMemberUserIds: nextAcceptedMemberUserIds,
        pendingMemberUserIds: nextPendingMemberUserIds,
        invitedMemberUserIds: nextInvitedMemberUserIds,
        pendingRequestMemberUserIds: nextPendingRequestMemberUserIds,
        pendingReason: requiresAdminApproval ? "approval" : void 0,
        subEvents: Array.isArray(record?.subEvents) ? this.cloneSyncedSubEventForms(record.subEvents) : Array.isArray(relatedSource.subEvents) ? this.cloneSyncedSubEventForms(relatedSource.subEvents) : void 0,
        mode: record?.mode ?? relatedSource.mode,
        paymentSessionId: selection?.paymentSessionId ?? null
      }),
      nextMembers: this.buildAcceptedInvitationMembers(currentMembers, activeUserId, requiresAdminApproval),
      capacityTotal
    };
  }
  resolveInvitationRequiresAdminApprovalFromMembers(currentMembers, creatorUserId) {
    const activeUserId = this.activeUser.id.trim();
    if (!activeUserId) {
      return false;
    }
    const activeInviteEntry = currentMembers.find((member) => member.userId === activeUserId && member.status === "pending" && member.requestKind === "invite") ?? null;
    return this.invitationRequiresAdminApproval(activeInviteEntry, currentMembers, creatorUserId);
  }
  invitationRequiresAdminApproval(activeInviteEntry, currentMembers, creatorUserId) {
    const inviterUserId = `${activeInviteEntry?.invitedByUserId ?? ""}`.trim();
    if (!inviterUserId) {
      return false;
    }
    if (inviterUserId === `${creatorUserId ?? ""}`.trim()) {
      return false;
    }
    const inviterEntry = currentMembers.find((member) => member.userId === inviterUserId && member.status === "accepted");
    return inviterEntry?.role !== "Admin";
  }
  buildAcceptedInvitationMembers(members, activeUserId, requiresAdminApproval) {
    const nowIso = AppUtils.toIsoDateTime(/* @__PURE__ */ new Date());
    let didUpdate = false;
    const nextMembers = members.map((member) => {
      if (member.userId !== activeUserId) {
        return __spreadValues({}, member);
      }
      didUpdate = true;
      if (requiresAdminApproval) {
        return __spreadProps(__spreadValues({}, member), {
          status: "pending",
          pendingSource: "admin",
          requestKind: "join",
          invitedByUserId: null,
          invitedByActiveUser: false,
          statusText: "Waiting for admin approval.",
          actionAtIso: nowIso
        });
      }
      return __spreadProps(__spreadValues({}, member), {
        status: "accepted",
        pendingSource: null,
        requestKind: null,
        invitedByUserId: null,
        invitedByActiveUser: false,
        statusText: member.statusText?.trim() || "Accepted",
        actionAtIso: nowIso
      });
    });
    return didUpdate ? nextMembers : null;
  }
  removeInvitationItem(sourceId) {
    delete this.activityMembersByRowId[`invitations:${sourceId}`];
  }
  isActivityIdentityTrashed(type, id) {
    return Boolean(this.trashedActivityRowsByKey[`${type}:${id}`]);
  }
  isActivityRowTrashed(row) {
    const status = this.activityStatusCode(row);
    if (status === "T" || status === "D" || status === "I") {
      return true;
    }
    return this.isActivityIdentityTrashed(this.activityEventListTypeForRow(row), row.id);
  }
  async persistActivityRowTrash(row) {
    const result = await this.eventsService.trashItem(this.activeUser.id, row.id);
    if (!result || result.changed === false) {
      throw new Error(result?.reason === "forbidden" ? "You are not allowed to delete this event." : "Unable to delete event.");
    }
    return result;
  }
  async restoreActivityRow(row) {
    const activeUserId = this.activeUserId();
    const restoreResult = await this.eventsService.restoreItem(this.activeUser.id, row.id);
    if (!restoreResult || restoreResult.changed === false || restoreResult.membershipStatus === "unchanged") {
      throw new Error(restoreResult?.reason === "forbidden" ? "You are not allowed to restore this event." : "Unable to restore event participation.");
    }
    this.activitiesStore.emitActivityEventRemoval(row.id);
    this.signalActivityCounterDelta(activeUserId, restoreResult.counterDelta ?? null);
    this.cdr.markForCheck();
  }
  onActivityRowClick(row, event) {
    event?.stopPropagation();
    this.openActivityRowInEventModule(row, true);
  }
  openActivityMembers(row, event) {
    event?.stopPropagation();
    this.memberMenuStore.requestActivitiesNavigation({
      type: "members",
      ownerId: row.id,
      ownerType: "event",
      subtitle: row.title,
      canManage: this.isActivityRowAdmin(row)
    });
  }
  canApproveActivityMember(entry) {
    if (!this.selectedActivityMembersRow || !this.isActivityRowAdmin(this.selectedActivityMembersRow)) {
      return false;
    }
    return entry.status === "pending" && this.isActivityJoinRequest(entry);
  }
  canDeleteActivityMember(entry) {
    if (this.isActivityWaitlistMember(entry)) {
      return false;
    }
    if (this.selectedActivityMembersRow && this.isActivityRowAdmin(this.selectedActivityMembersRow)) {
      return true;
    }
    return entry.status === "pending" && entry.requestKind === "invite" && entry.invitedByActiveUser === true;
  }
  activityMemberMenuDeleteLabel(entry) {
    if (entry.status === "accepted") {
      return "Remove member";
    }
    if (entry.requestKind === "join") {
      return "Reject request";
    }
    return "Delete invitation";
  }
  isActivityJoinRequest(entry) {
    return entry.requestKind === "join" || entry.requestKind == null && entry.pendingSource === "member";
  }
  isActivityWaitlistMember(entry) {
    return entry.requestKind === "waitlist" || entry.requestKind === "waitlist-invite";
  }
  approveActivityMember(entry, event) {
    event?.stopPropagation();
    if (!this.selectedActivityMembersRowId || !this.canApproveActivityMember(entry)) {
      return;
    }
    const nowIso = AppUtils.toIsoDateTime(/* @__PURE__ */ new Date());
    this.selectedActivityMembers = this.selectedActivityMembers.map((item) => item.id === entry.id ? __spreadProps(__spreadValues({}, item), {
      status: "accepted",
      pendingSource: null,
      requestKind: null,
      actionAtIso: nowIso
    }) : item);
    this.activityMembersByRowId[this.selectedActivityMembersRowId] = [...this.selectedActivityMembers];
    this.persistSelectedActivityMembers();
  }
  removeActivityMember(entry, event) {
    event?.stopPropagation();
    if (!this.selectedActivityMembersRowId || !this.canDeleteActivityMember(entry)) {
      return;
    }
    this.pendingActivityMemberDelete = entry;
  }
  openActivityRowInEventModule(row, readOnly) {
    this.memberMenuStore.requestActivitiesNavigation({
      type: "eventEditor",
      eventId: row.id,
      target: this.isActivityRowAdmin(row) || this.activityEventListTypeForRow(row) === "hosting" ? "hosting" : "events",
      readOnly: this.isActivityInvitationRow(row) ? true : readOnly
    });
  }
};

// src/app/activity/components/activities-popup/templates/rate/activities-rate-editor.presenter.ts
var ActivitiesRateEditorPresenter = class {
  deps;
  constructor(deps) {
    this.deps = deps;
  }
  selectedValue() {
    const row = this.deps.getFocusedRow();
    return row ? this.deps.getOwnRatingValue(row) : 0;
  }
  barConfig() {
    return {
      scale: this.deps.getRatingScale(),
      readonly: this.isSelectedReadOnly(),
      label: this.selectedBarLabel(),
      actionLabel: "save",
      dock: {
        enabled: !this.deps.isFullscreenModeActive(),
        state: this.deps.isEditorClosing() ? "closing" : this.deps.isEditorOpen() ? "open" : "hidden"
      }
    };
  }
  selectedModeLabel() {
    const row = this.deps.getSelectedRow();
    if (!row) {
      return this.deps.getActivitiesRateFilter().startsWith("individual") ? "Single" : "Pair";
    }
    return row.mode === "pair" ? "Pair" : "Single";
  }
  selectedTitle() {
    return this.deps.getSelectedRow()?.title ?? "Rate";
  }
  selectedBarLabel() {
    if (this.deps.isFullscreenModeActive()) {
      return null;
    }
    return `Affinity \xB7 ${this.selectedModeLabel()} \xB7 ${this.selectedTitle()}`;
  }
  isSelectedReadOnly() {
    const row = this.deps.getFocusedRow();
    return !!row && this.deps.isPairReceivedRateRow(row);
  }
};

// src/app/activity/components/activities-popup/templates/rate/activities-rate-blink.presenter.ts
function isActivitiesRateBlinking(row, blinkUntilByRowId) {
  const until = blinkUntilByRowId[row.id] ?? 0;
  return until > Date.now();
}
function triggerActivitiesRateBlink(rowId, blinkUntilByRowId, blinkTimeoutByRowId, markForCheck, onStart) {
  const durationMs = 420;
  const existingTimer = blinkTimeoutByRowId[rowId];
  if (existingTimer) {
    clearTimeout(existingTimer);
  }
  delete blinkUntilByRowId[rowId];
  markForCheck();
  const startBlink = () => {
    blinkUntilByRowId[rowId] = Date.now() + durationMs;
    onStart?.();
    markForCheck();
    blinkTimeoutByRowId[rowId] = setTimeout(() => {
      if ((blinkUntilByRowId[rowId] ?? 0) <= Date.now()) {
        delete blinkUntilByRowId[rowId];
      }
      const timer = blinkTimeoutByRowId[rowId];
      if (timer) {
        clearTimeout(timer);
      }
      delete blinkTimeoutByRowId[rowId];
      markForCheck();
    }, durationMs + 32);
  };
  if (typeof globalThis.requestAnimationFrame === "function") {
    globalThis.requestAnimationFrame(() => startBlink());
    return;
  }
  setTimeout(() => startBlink(), 0);
}

// src/app/activity/components/activities-popup/templates/rate/activities-rate-motion.presenter.ts
function animateActivitiesRateEditorScrollTo(scrollElement, targetTop, slideDurationMs, onAnimationFrameChange, onComplete) {
  const startTop = scrollElement.scrollTop;
  const delta = targetTop - startTop;
  if (Math.abs(delta) <= 0.5) {
    scrollElement.scrollTop = targetTop;
    onComplete?.();
    return;
  }
  if (typeof globalThis.requestAnimationFrame !== "function" || typeof globalThis.performance === "undefined") {
    scrollElement.scrollTop = targetTop;
    onComplete?.();
    return;
  }
  const startTime = globalThis.performance.now();
  const step = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / slideDurationMs);
    scrollElement.scrollTop = startTop + delta * activitiesRateEditorLiftEasedProgress(progress);
    if (progress < 1) {
      onAnimationFrameChange(globalThis.requestAnimationFrame(step));
      return;
    }
    onAnimationFrameChange(null);
    scrollElement.scrollTop = targetTop;
    onComplete?.();
  };
  step(startTime);
}
function syncActivitiesRatesListPositionToRow(scrollElement, rowId, isMobileView, markForCheck) {
  const targetRow = scrollElement.querySelector(`[data-activity-rate-row-id="${rowId}"]`);
  if (!targetRow) {
    return;
  }
  const stickyHeaderHeight = scrollElement.querySelector(".smart-list__sticky")?.offsetHeight ?? 0;
  const targetTop = Math.max(0, targetRow.offsetTop - stickyHeaderHeight - (isMobileView ? 4 : 6));
  if (Math.abs(scrollElement.scrollTop - targetTop) <= 1) {
    return;
  }
  const previousSnapType = scrollElement.style.scrollSnapType;
  scrollElement.style.scrollSnapType = "none";
  scrollElement.scrollTop = targetTop;
  const releaseSnap = () => {
    scrollElement.style.scrollSnapType = previousSnapType;
    markForCheck();
  };
  if (typeof globalThis.requestAnimationFrame === "function") {
    globalThis.requestAnimationFrame(() => releaseSnap());
    return;
  }
  setTimeout(releaseSnap, 0);
}
function activitiesRateEditorLiftEasedProgress(progress) {
  return sampleCubicBezierYForX(AppUtils.clampNumber(progress, 0, 1), 0.22, 1, 0.36, 1);
}
function sampleCubicBezierYForX(x, x1, y1, x2, y2) {
  if (x <= 0) {
    return 0;
  }
  if (x >= 1) {
    return 1;
  }
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleCurveX = (t2) => ((ax * t2 + bx) * t2 + cx) * t2;
  const sampleCurveY = (t2) => ((ay * t2 + by) * t2 + cy) * t2;
  const sampleCurveDerivativeX = (t2) => (3 * ax * t2 + 2 * bx) * t2 + cx;
  let t = x;
  for (let index = 0; index < 4; index += 1) {
    const currentX = sampleCurveX(t) - x;
    const derivative = sampleCurveDerivativeX(t);
    if (Math.abs(currentX) < 1e-4 || Math.abs(derivative) < 1e-4) {
      break;
    }
    t -= currentX / derivative;
  }
  let lowerBound = 0;
  let upperBound = 1;
  while (upperBound - lowerBound > 1e-4) {
    const currentX = sampleCurveX(t);
    if (Math.abs(currentX - x) < 1e-4) {
      break;
    }
    if (currentX > x) {
      upperBound = t;
    } else {
      lowerBound = t;
    }
    t = (lowerBound + upperBound) / 2;
  }
  return sampleCurveY(AppUtils.clampNumber(t, 0, 1));
}

// src/app/activity/components/activities-popup/templates/rate/activities-rate-state.presenter.ts
function matchesActivitiesRateFilter(item, filter, socialBadgeEnabled) {
  const [modeKey, directionKey] = filter.split("-");
  if (item.mode !== modeKey || item.direction !== directionKey) {
    return false;
  }
  if (modeKey === "individual") {
    return socialBadgeEnabled ? item.socialContext === "friends-in-common" : item.socialContext !== "friends-in-common";
  }
  return socialBadgeEnabled ? item.socialContext === "separated-friends" : item.socialContext !== "separated-friends";
}
function pendingActivitiesRateDirectionAfterRating(item) {
  const direction = item.direction;
  if (item.mode === "individual") {
    if (direction === "given") {
      return "given";
    }
    if (direction === "received") {
      return "mutual";
    }
    return null;
  }
  if (direction === "received" || direction === "met") {
    return "given";
  }
  return null;
}
function selectedActivitiesRateRow(selectedRateId, filteredRows) {
  if (!selectedRateId) {
    return null;
  }
  return filteredRows.find((row) => row.id === selectedRateId) ?? null;
}
function normalizeActivitiesRateScore(value) {
  return Math.min(10, Math.max(1, Math.round(value)));
}
function activitiesRateOwnScore(item) {
  if (Number.isFinite(item.scoreGiven) && item.scoreGiven > 0) {
    return normalizeActivitiesRateScore(item.scoreGiven);
  }
  return 5;
}
function activitiesRateHasOwnRating(item) {
  if (item.direction === "received") {
    return false;
  }
  return Number.isFinite(item.scoreGiven) && item.scoreGiven > 0;
}
function activitiesPairReceivedAverageScore(item, rateItems) {
  const matching = rateItems.filter((candidate) => candidate.mode === "pair" && sameActivitiesRatePairUsers(candidate, item) && candidate.direction === "received" && Number.isFinite(candidate.scoreReceived) && candidate.scoreReceived > 0);
  if (matching.length === 0) {
    return 0;
  }
  const total = matching.reduce((sum, candidate) => sum + candidate.scoreReceived, 0);
  return normalizeActivitiesRateScore(total / matching.length);
}
function isActivitiesPairReceivedRateItem(item) {
  return item.mode === "pair" && item.direction === "received";
}
function activitiesRateOwnRatingValue(item, rateItems) {
  if (!item) {
    return 0;
  }
  if (!activitiesRateHasOwnRating(item)) {
    if (item.direction === "received" && item.mode === "pair") {
      return activitiesPairReceivedAverageScore(item, rateItems);
    }
    return 0;
  }
  return activitiesRateOwnScore(item);
}
function sameActivitiesRatePairUsers(left, right) {
  const leftIds = [left.userId, left.secondaryUserId ?? ""].filter((id) => id.trim().length > 0).sort();
  const rightIds = [right.userId, right.secondaryUserId ?? ""].filter((id) => id.trim().length > 0).sort();
  return leftIds.length === rightIds.length && leftIds.every((id, index) => id === rightIds[index]);
}

// src/app/activity/components/activities-popup/templates/rate/activities-rate-template.component.ts
function ActivitiesRateTemplateComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-pair-card", 1);
    \u0275\u0275listener("menuRequest", function ActivitiesRateTemplateComponent_Conditional_0_Template_app_pair_card_menuRequest_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onMenuRequest($event));
    })("detailClick", function ActivitiesRateTemplateComponent_Conditional_0_Template_app_pair_card_detailClick_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onDetailClick($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("card", ctx_r1.pairCard)("showSplitHandle", ctx_r1.showSplitHandle());
  }
}
function ActivitiesRateTemplateComponent_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-single-card", 3);
    \u0275\u0275listener("menuRequest", function ActivitiesRateTemplateComponent_Conditional_1_Conditional_0_Template_app_single_card_menuRequest_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onMenuRequest($event));
    })("detailClick", function ActivitiesRateTemplateComponent_Conditional_1_Conditional_0_Template_app_single_card_detailClick_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onDetailClick($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("card", ctx_r1.singleCard);
  }
}
function ActivitiesRateTemplateComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, ActivitiesRateTemplateComponent_Conditional_1_Conditional_0_Template, 1, 1, "app-single-card", 2);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r1.singleCard ? 0 : -1);
  }
}
var ActivitiesRateTemplateComponent = class _ActivitiesRateTemplateComponent {
  row = null;
  groupLabel = null;
  presentation = "list";
  state = "default";
  context = null;
  openMenu = null;
  cardRevision = 0;
  detailClick = new EventEmitter();
  pairCard = null;
  singleCard = null;
  ngOnChanges(changes) {
    if (changes["row"] || changes["groupLabel"] || changes["presentation"] || changes["state"] || changes["context"] || changes["cardRevision"]) {
      this.rebuildCards();
    }
  }
  onMenuRequest(event) {
    const row = this.row;
    const context = this.context;
    if (!row || !context || !this.openMenu) {
      return;
    }
    const items = context.getActivityRateMenuItems(row);
    if (items.length === 0) {
      return;
    }
    this.openMenu({
      id: row.id,
      kind: "select",
      items,
      triggerRect: event.triggerRect,
      openUp: false,
      panelMode: "dock",
      closeOnSelect: true,
      closeTrigger: event.closeTrigger
    });
  }
  onDetailClick(event) {
    this.detailClick.emit(event);
  }
  showSplitHandle() {
    return !this.context?.isFullscreenPaginationAnimating();
  }
  rebuildCards() {
    const row = this.row;
    const context = this.context;
    if (!row || !context) {
      this.pairCard = null;
      this.singleCard = null;
      return;
    }
    const sharedOptions = {
      groupLabel: this.groupLabel,
      presentation: this.presentation,
      state: this.state,
      displayedDirection: this.displayedDirectionForRow(row, context),
      activeUserGender: context.getActiveUserGender()
    };
    if (isActivityRatePairCardRow(row)) {
      this.pairCard = ActivityRatePairCardConverter.convert(row, __spreadProps(__spreadValues({}, sharedOptions), {
        badge: this.activityRateBadgeConfig(row, context, {
          layout: this.presentation === "fullscreen" ? "pair-overlap" : "between",
          interactive: this.presentation !== "fullscreen",
          forceActive: this.presentation === "fullscreen"
        })
      }));
      this.singleCard = null;
      return;
    }
    this.singleCard = ActivityRateSingleCardConverter.convert(row, __spreadProps(__spreadValues({}, sharedOptions), {
      badge: this.activityRateBadgeConfig(row, context, {
        layout: "floating",
        interactive: this.presentation !== "fullscreen",
        forceActive: this.presentation === "fullscreen"
      })
    }));
    this.pairCard = null;
  }
  isPairReceivedRateRow(row, context) {
    const rate = this.rateItemForRow(row, context);
    if (rate) {
      return rate.mode === "pair" && context.getDisplayedDirection(rate) === "received";
    }
    return row.mode === "pair" && this.displayedDirectionForRow(row, context) === "received";
  }
  activityRateBadgeConfig(row, context, options) {
    return {
      label: this.activityRateBadgeLabel(row, context),
      ariaLabel: this.activityRateBadgeAriaLabel(row, context),
      active: options?.forceActive ? true : context.isSelectedActivityRateRow(row),
      pending: this.isActivityRatePending(row, context),
      disabled: this.isPairReceivedRateRow(row, context),
      blink: context.isActivityRateBlinking(row),
      interactive: options?.interactive ?? true,
      menuRequest: options?.interactive ?? true,
      layout: options?.layout ?? "floating"
    };
  }
  activityOwnRatingValue(row, context) {
    const item = this.rateItemForRow(row, context);
    if (!item) {
      return Number.isFinite(row.scoreGiven) ? context.normalizeRateScore(Number(row.scoreGiven)) : 0;
    }
    if (!context.hasOwnRating(item)) {
      if (context.getDisplayedDirection(item) === "received" && item.mode === "pair") {
        return context.pairReceivedAverageScore(item);
      }
      return 0;
    }
    return context.rateOwnScore(item);
  }
  activityOwnRatingLabel(row, context) {
    const value = this.activityOwnRatingValue(row, context);
    return value > 0 ? `${value}` : "";
  }
  isActivityRatePending(row, context) {
    const item = this.rateItemForRow(row, context);
    if (!item) {
      return false;
    }
    if (context.getDisplayedDirection(item) === "met") {
      return false;
    }
    if (!context.hasOwnRating(item) && context.getDisplayedDirection(item) === "received" && item.mode === "pair") {
      return context.pairReceivedAverageScore(item) <= 0;
    }
    return !context.hasOwnRating(item);
  }
  activityRateBadgeLabel(row, context) {
    const ownLabel = this.activityOwnRatingLabel(row, context);
    return ownLabel ? ownLabel : "Rate";
  }
  activityRateBadgeAriaLabel(row, context) {
    if (this.isPairReceivedRateRow(row, context)) {
      return "Received pair rating";
    }
    return this.isActivityRatePending(row, context) ? "Add your rating" : "Edit your rating";
  }
  rateItemForRow(row, context) {
    return context.getRateItemById(row.id);
  }
  displayedDirectionForRow(row, context) {
    const item = this.rateItemForRow(row, context);
    if (item) {
      return context.getDisplayedDirection(item);
    }
    if (row.displayedDirection === "received" || row.displayedDirection === "mutual" || row.displayedDirection === "met") {
      return row.displayedDirection;
    }
    if (row.direction === "received" || row.direction === "mutual" || row.direction === "met") {
      return row.direction;
    }
    return "given";
  }
  static \u0275fac = function ActivitiesRateTemplateComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ActivitiesRateTemplateComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ActivitiesRateTemplateComponent, selectors: [["app-activities-rate-template"]], inputs: { row: "row", groupLabel: "groupLabel", presentation: "presentation", state: "state", context: "context", openMenu: "openMenu", cardRevision: "cardRevision" }, outputs: { detailClick: "detailClick" }, features: [\u0275\u0275NgOnChangesFeature], decls: 2, vars: 1, consts: [[3, "card", "showSplitHandle"], [3, "menuRequest", "detailClick", "card", "showSplitHandle"], [3, "card"], [3, "menuRequest", "detailClick", "card"]], template: function ActivitiesRateTemplateComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, ActivitiesRateTemplateComponent_Conditional_0_Template, 1, 2, "app-pair-card", 0)(1, ActivitiesRateTemplateComponent_Conditional_1_Template, 1, 1);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.pairCard ? 0 : 1);
    }
  }, dependencies: [SingleCardComponent, PairCardComponent], styles: ["/* src/app/activity/components/activities-popup/templates/rate/activities-rate-template.component.scss */\napp-activities-rate-template {\n  display: block;\n  width: 100%;\n  min-width: 0;\n}\n.activities-rate-profile-card.is-rate-editor-selected {\n  border-color: rgba(214, 160, 42, 0.68);\n  box-shadow: 0 10px 24px rgba(147, 105, 25, 0.34);\n}\n.activities-rate-profile-card.is-rate-editor-selected .activities-rate-profile-layer {\n  border-color: rgba(238, 196, 92, 0.78);\n  box-shadow: 0 0 0 2px rgba(246, 220, 144, 0.56), 0 14px 28px rgba(8, 20, 38, 0.42);\n}\n.activities-rate-profile-stack-pair.activities-rate-profile-stack-given .activities-rate-profile-layer {\n  border-color: rgba(141, 93, 201, 0.52);\n}\n.activities-rate-profile-stack-pair.activities-rate-profile-stack-received .activities-rate-profile-layer {\n  border-color: rgba(197, 92, 150, 0.52);\n}\n.activities-rate-editor-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n  margin-bottom: 0.36rem;\n}\n.activities-rate-editor-head span {\n  font-size: 0.78rem;\n  font-weight: 800;\n  color: #1f3658;\n}\n.activities-rate-editor-close {\n  width: 26px;\n  height: 26px;\n  border-radius: 50%;\n  border: 1px solid rgba(35, 58, 90, 0.22);\n  background: #f5f8fe;\n  color: #2a4a73;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  padding: 0;\n}\n.activities-rate-editor-close .mat-icon {\n  width: 14px;\n  height: 14px;\n  font-size: 14px;\n  line-height: 14px;\n}\n.activities-rate-editor-stars {\n  display: grid;\n  grid-template-columns: repeat(10, minmax(0, 1fr));\n  gap: 0.28rem;\n}\n.activities-rate-editor-stars.is-blink {\n  animation: game-rating-stars-blink 0.42s ease-in-out 1;\n}\n@keyframes game-rating-stars-blink {\n  0%, 100% {\n    filter: brightness(1);\n  }\n  50% {\n    filter: brightness(1.12) saturate(1.1);\n  }\n}\n.activities-rate-editor-stars.is-readonly {\n  opacity: 0.92;\n}\n.activities-rate-star-btn {\n  min-height: 28px;\n  border-radius: 999px;\n  border: 1px solid rgba(22, 40, 64, 0.22);\n  background: #fff;\n  color: rgba(96, 111, 133, 0.9);\n  font-size: 1rem;\n  line-height: 1;\n  cursor: pointer;\n}\n.activities-rate-star-btn.is-disabled {\n  border-color: rgba(130, 143, 160, 0.3);\n  color: rgba(109, 123, 142, 0.74);\n  cursor: default;\n}\n.activities-rate-star-btn.filled {\n  color: #f2ba31;\n  border-color: rgba(193, 145, 34, 0.44);\n  background:\n    linear-gradient(\n      180deg,\n      #fff9e9 0%,\n      #fff2d0 100%);\n}\n/*# sourceMappingURL=activities-rate-template.component.css.map */\n"], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ActivitiesRateTemplateComponent, [{
    type: Component,
    args: [{ selector: "app-activities-rate-template", standalone: true, imports: [SingleCardComponent, PairCardComponent], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: '@if (pairCard) {\n  <app-pair-card\n    [card]="pairCard"\n    [showSplitHandle]="showSplitHandle()"\n    (menuRequest)="onMenuRequest($event)"\n    (detailClick)="onDetailClick($event)"\n  ></app-pair-card>\n} @else {\n  @if (singleCard) {\n    <app-single-card\n      [card]="singleCard"\n      (menuRequest)="onMenuRequest($event)"\n      (detailClick)="onDetailClick($event)"\n    ></app-single-card>\n  }\n}\n', styles: ["/* src/app/activity/components/activities-popup/templates/rate/activities-rate-template.component.scss */\napp-activities-rate-template {\n  display: block;\n  width: 100%;\n  min-width: 0;\n}\n.activities-rate-profile-card.is-rate-editor-selected {\n  border-color: rgba(214, 160, 42, 0.68);\n  box-shadow: 0 10px 24px rgba(147, 105, 25, 0.34);\n}\n.activities-rate-profile-card.is-rate-editor-selected .activities-rate-profile-layer {\n  border-color: rgba(238, 196, 92, 0.78);\n  box-shadow: 0 0 0 2px rgba(246, 220, 144, 0.56), 0 14px 28px rgba(8, 20, 38, 0.42);\n}\n.activities-rate-profile-stack-pair.activities-rate-profile-stack-given .activities-rate-profile-layer {\n  border-color: rgba(141, 93, 201, 0.52);\n}\n.activities-rate-profile-stack-pair.activities-rate-profile-stack-received .activities-rate-profile-layer {\n  border-color: rgba(197, 92, 150, 0.52);\n}\n.activities-rate-editor-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n  margin-bottom: 0.36rem;\n}\n.activities-rate-editor-head span {\n  font-size: 0.78rem;\n  font-weight: 800;\n  color: #1f3658;\n}\n.activities-rate-editor-close {\n  width: 26px;\n  height: 26px;\n  border-radius: 50%;\n  border: 1px solid rgba(35, 58, 90, 0.22);\n  background: #f5f8fe;\n  color: #2a4a73;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  padding: 0;\n}\n.activities-rate-editor-close .mat-icon {\n  width: 14px;\n  height: 14px;\n  font-size: 14px;\n  line-height: 14px;\n}\n.activities-rate-editor-stars {\n  display: grid;\n  grid-template-columns: repeat(10, minmax(0, 1fr));\n  gap: 0.28rem;\n}\n.activities-rate-editor-stars.is-blink {\n  animation: game-rating-stars-blink 0.42s ease-in-out 1;\n}\n@keyframes game-rating-stars-blink {\n  0%, 100% {\n    filter: brightness(1);\n  }\n  50% {\n    filter: brightness(1.12) saturate(1.1);\n  }\n}\n.activities-rate-editor-stars.is-readonly {\n  opacity: 0.92;\n}\n.activities-rate-star-btn {\n  min-height: 28px;\n  border-radius: 999px;\n  border: 1px solid rgba(22, 40, 64, 0.22);\n  background: #fff;\n  color: rgba(96, 111, 133, 0.9);\n  font-size: 1rem;\n  line-height: 1;\n  cursor: pointer;\n}\n.activities-rate-star-btn.is-disabled {\n  border-color: rgba(130, 143, 160, 0.3);\n  color: rgba(109, 123, 142, 0.74);\n  cursor: default;\n}\n.activities-rate-star-btn.filled {\n  color: #f2ba31;\n  border-color: rgba(193, 145, 34, 0.44);\n  background:\n    linear-gradient(\n      180deg,\n      #fff9e9 0%,\n      #fff2d0 100%);\n}\n/*# sourceMappingURL=activities-rate-template.component.css.map */\n"] }]
  }], null, { row: [{
    type: Input
  }], groupLabel: [{
    type: Input
  }], presentation: [{
    type: Input
  }], state: [{
    type: Input
  }], context: [{
    type: Input
  }], openMenu: [{
    type: Input
  }], cardRevision: [{
    type: Input
  }], detailClick: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ActivitiesRateTemplateComponent, { className: "ActivitiesRateTemplateComponent", filePath: "app/activity/components/activities-popup/templates/rate/activities-rate-template.component.ts", lineNumber: 79 });
})();
var ActivitiesRatesController = class _ActivitiesRatesController {
  deps;
  static SCORE_SELECTION_DOCK_GUARD_MS = 220;
  static EDITOR_DOCK_VISIBILITY_HOLD_MS = 120;
  ratingBarBlinkTimeout = null;
  isRatingBarBlinking = false;
  templateContext = {
    getActiveUserGender: () => this.deps.getActiveUserGender(),
    getRateItemById: (itemId) => this.rateItemById(itemId),
    getDisplayedDirection: (item) => this.displayedDirection(item),
    isSelectedActivityRateRow: (row) => this.isSelectedRow(row),
    isActivityRateBlinking: (row) => this.isBlinking(row),
    normalizeRateScore: (value) => this.normalizeScore(value),
    hasOwnRating: (item) => this.hasOwnRating(item),
    pairReceivedAverageScore: (item) => this.pairReceivedAverageScore(item),
    rateOwnScore: (item) => this.rateOwnScore(item),
    getActivityRateMenuItems: (row) => this.activityRateMenuItems(row),
    isFullscreenPaginationAnimating: () => this.deps.isFullscreenPaginationAnimating()
  };
  rateEditorPresenter;
  selectedListRateRow = null;
  suppressDockCloseUntilMs = 0;
  dockVisibilityHoldUntilMs = 0;
  dockVisibilityHoldTimer = null;
  constructor(deps) {
    this.deps = deps;
    this.rateEditorPresenter = new ActivitiesRateEditorPresenter({
      getActivitiesRateFilter: () => this.deps.getActivitiesRateFilter(),
      getSelectedRow: () => this.selectedRow(),
      getFocusedRow: () => this.isFullscreenModeActive() ? this.currentFullscreenRow() : this.selectedRow(),
      isFullscreenModeActive: () => this.isFullscreenModeActive(),
      isEditorClosing: () => this.isEditorClosing(),
      isEditorOpen: () => this.isEditorOpen(),
      getRatingScale: () => this.deps.getRatingScale(),
      getOwnRatingValue: (row) => this.ownRatingValue(row),
      isPairReceivedRateRow: (row) => this.isPairReceivedRow(row)
    });
  }
  ratingBarConfig() {
    return __spreadProps(__spreadValues({}, this.rateEditorPresenter.barConfig()), {
      blinkOnSelect: false,
      animation: this.isRatingBarBlinking ? "blink" : "default"
    });
  }
  ratingMenuConfig(row) {
    const modeLabel = row.mode === "pair" ? "Pair" : "Single";
    return {
      scale: this.deps.getRatingScale(),
      value: this.ownRatingValue(row),
      readonly: this.isPairReceivedRow(row),
      label: `Affinity \xB7 ${modeLabel} \xB7 ${row.title || "Rate"}`,
      actionLabel: "save",
      blinkOnSelect: false,
      animation: this.isRatingBarBlinking ? "blink" : "default",
      dock: null
    };
  }
  activityRateMenuItems(row) {
    if (this.isPairReceivedRow(row)) {
      return [];
    }
    return ActivityRateMenuConverter.convert({
      menu: "activity-rate-card",
      id: row.id,
      value: this.ownRatingValue(row),
      ratingBarConfig: this.ratingMenuConfig(row)
    });
  }
  handleMenuSelect(event) {
    const selection = ActivityRateMenuSelectionConverter.convert(event);
    if (!selection) {
      return false;
    }
    this.setOwnRatingForRowId(selection.rowId, selection.value);
    return true;
  }
  ratingBarValue() {
    return this.rateEditorPresenter.selectedValue();
  }
  openEditor(row, event) {
    event?.stopPropagation();
    if (this.isPairReceivedRow(row)) {
      return;
    }
    this.cancelEditorCloseTransition();
    this.cancelDockVisibilityHold();
    const wasOpen = this.isEditorOpen();
    if (this.selectedRateId() === row.id) {
      if (this.isSuppressingDockClose()) {
        return;
      }
      this.clearEditorState();
      return;
    }
    const scrollElement = this.deps.getActivitiesListScrollElement();
    if (!wasOpen) {
      this.deps.setEditorOpenScrollTop(scrollElement ? scrollElement.scrollTop : null);
    }
    this.selectedListRateRow = row;
    this.setSelectedRateId(row.id);
    this.deps.setEditorClosing(false);
    this.cancelEditorLiftAnimation();
    this.deps.runAfterNextPaint(() => {
      if (!this.isEditorOpen() || this.selectedRateId() !== row.id) {
        return;
      }
      this.smoothRevealSelectedRateRowWhenNeeded(row.id);
    });
  }
  closeEditorFromUserScroll(event) {
    const target = event?.target;
    if (this.deps.isPaginationMenuTarget(target)) {
      return;
    }
    if (!this.isEditorOpen()) {
      return;
    }
    this.clearEditorState(true);
  }
  isEditorDockVisible() {
    if (this.isFullscreenModeActive()) {
      if (this.isFullscreenReadOnlyNavigation()) {
        return false;
      }
      return this.currentFullscreenRow() !== null;
    }
    return this.deps.getActivitiesPrimaryFilter() === "rates" && (!!this.selectedRateId() || this.isEditorClosing() || this.isHoldingDockVisibility());
  }
  shouldRenderEditorDock() {
    if (this.deps.isCalendarLayoutView() || this.deps.getActivitiesPrimaryFilter() !== "rates") {
      return false;
    }
    if (!this.isFullscreenModeActive()) {
      return true;
    }
    if (this.isFullscreenReadOnlyNavigation()) {
      return false;
    }
    return this.currentFullscreenRow() !== null;
  }
  isEditorOpen() {
    if (this.isFullscreenModeActive()) {
      return true;
    }
    return this.deps.getActivitiesPrimaryFilter() === "rates" && !!this.selectedRateId() && !this.isEditorClosing();
  }
  isEditorClosing() {
    if (this.isSuppressingDockClose()) {
      return false;
    }
    return this.deps.getEditorClosing();
  }
  editorSpacerHeight() {
    if (this.deps.getActivitiesPrimaryFilter() !== "rates" || this.deps.isCalendarLayoutView() || this.isFullscreenModeActive()) {
      return null;
    }
    return this.isEditorDockVisible() ? "calc(5.2rem + env(safe-area-inset-bottom))" : "0px";
  }
  isSelectedRow(row) {
    return this.isEditorOpen() && this.selectedRateId() === row.id;
  }
  setSelectedOwnRating(score) {
    const row = this.isFullscreenModeActive() ? this.currentFullscreenRow() : this.selectedRow();
    if (!row) {
      return;
    }
    this.recordOwnRatingForRow(row, score, true);
  }
  setOwnRatingForRowId(rowId, score) {
    const normalizedRowId = rowId.trim();
    if (!normalizedRowId) {
      return;
    }
    const row = selectedActivitiesRateRow(normalizedRowId, this.deps.getFilteredActivityRows()) ?? (this.selectedListRateRow?.id === normalizedRowId ? this.selectedListRateRow : null);
    if (!row) {
      return;
    }
    this.recordOwnRatingForRow(row, score, false);
  }
  recordOwnRatingForRow(row, score, syncSelectedEditor) {
    if (this.isPairReceivedRow(row)) {
      return;
    }
    const rateItem = this.rateItemForRow(row);
    if (!rateItem) {
      return;
    }
    const normalized = this.normalizeScore(score);
    if (syncSelectedEditor) {
      this.holdDockOpenForScoreSelection();
      this.setSelectedRateId(row.id);
    }
    const nextDirection = this.pendingDirectionAfterRating(rateItem);
    this.deps.recordActivityRate(rateItem, normalized, nextDirection ?? rateItem.direction);
    const syncedRateItem = this.rateItemById(rateItem.id) ?? __spreadProps(__spreadValues({}, rateItem), {
      direction: nextDirection ?? rateItem.direction,
      scoreGiven: normalized
    });
    this.deps.syncVisibleRateItem(syncedRateItem);
    this.refreshRateCards(row.id);
    this.triggerRatingBarBlink();
    this.triggerBlinks(row.id);
    if (syncSelectedEditor) {
      this.closeEditorAfterScoreCommit();
    }
  }
  clearEditorState(preserveScrollPosition = true) {
    if (this.isFullscreenModeActive()) {
      return;
    }
    if (this.isSuppressingDockClose()) {
      return;
    }
    if (!this.selectedRateId() && !this.isEditorClosing()) {
      return;
    }
    if (this.isEditorClosing()) {
      return;
    }
    const scrollElement = this.deps.getActivitiesListScrollElement();
    const restoreTop = this.deps.getEditorOpenScrollTop();
    const hasRestoreTop = Number.isFinite(restoreTop);
    const shouldReverseLift = !preserveScrollPosition && this.deps.getActivitiesPrimaryFilter() === "rates" && !!scrollElement && (hasRestoreTop ? scrollElement.scrollTop > restoreTop + 0.5 : this.deps.getLastEditorLiftDelta() > 0);
    const previousInlineSnapType = shouldReverseLift ? scrollElement.style.scrollSnapType : "";
    const reverseDelta = this.deps.getLastEditorLiftDelta();
    this.deps.setEditorClosing(true);
    this.cancelEditorCloseTransition();
    this.cancelEditorLiftAnimation();
    this.deps.setEditorCloseTimer(setTimeout(() => {
      this.deps.setEditorCloseTimer(null);
      this.deps.setEditorClosing(false);
      this.holdDockVisibilityAfterClose();
      this.setSelectedRateId(null);
      this.selectedListRateRow = null;
      this.deps.setLastIndicatorPulseRowId(null);
      this.deps.setLastEditorLiftDelta(0);
      this.deps.setEditorOpenScrollTop(null);
    }, this.deps.getActivityRateEditorSlideDurationMs()));
    if (!shouldReverseLift || !scrollElement) {
      return;
    }
    this.deps.runAfterRender(() => {
      const targetTop = Number.isFinite(restoreTop) ? Math.max(0, restoreTop) : Math.max(0, scrollElement.scrollTop - reverseDelta);
      scrollElement.style.scrollSnapType = "none";
      this.animateEditorScrollTo(scrollElement, targetTop, () => {
        scrollElement.style.scrollSnapType = previousInlineSnapType;
      });
    });
  }
  isBlinking(row) {
    return isActivitiesRateBlinking(row, this.deps.getActivityRateBlinkUntilByRowId());
  }
  isFullscreenReadOnlyNavigation() {
    return this.isFullscreenModeActive() && this.deps.getActivitiesRateFilter() === "pair-received";
  }
  currentFullscreenRow() {
    if (!this.isFullscreenModeActive()) {
      return null;
    }
    return this.deps.getSmartListCursorItem();
  }
  toggleFullscreenMode(event) {
    event.stopPropagation();
    if (!this.deps.shouldShowFullscreenToggle()) {
      return;
    }
    if (this.deps.getFullscreenMode()) {
      this.disableFullscreenMode();
      return;
    }
    this.resetEditorStateForFullscreenEntry();
    this.setFullscreenMode(true);
    this.deps.runAfterNextPaint(() => {
      this.syncFullscreenSelection();
      this.deps.markForCheck();
    });
    this.deps.markForCheck();
  }
  disableFullscreenMode() {
    if (!this.deps.getFullscreenMode()) {
      return;
    }
    const selectedRateId = this.selectedRateId();
    this.setFullscreenMode(false);
    this.deps.setEditorClosing(false);
    this.deps.setLastEditorLiftDelta(0);
    this.deps.setLastIndicatorPulseRowId(null);
    this.deps.setSelectedRateIdInContext(this.selectedRateId());
    this.deps.markForCheck();
    if (!selectedRateId) {
      return;
    }
    this.deps.runAfterNextPaint(() => {
      this.syncListPositionToRow(selectedRateId);
      this.smoothRevealSelectedRateRowWhenNeeded(selectedRateId);
    });
  }
  syncFullscreenSelection() {
    if (!this.deps.getFullscreenMode()) {
      return;
    }
    const currentRow = this.currentFullscreenRow();
    if (!currentRow) {
      this.selectedListRateRow = null;
      this.setSelectedRateId(null);
      return;
    }
    this.selectedListRateRow = currentRow;
    this.setSelectedRateId(currentRow.id);
  }
  matchesFilter(item, filter) {
    return matchesActivitiesRateFilter(item, filter, this.deps.getActivitiesRateSocialBadgeEnabledForFilter(filter));
  }
  displayedDirection(item) {
    return item.direction;
  }
  selectedRow() {
    const selectedRateId = this.selectedRateId();
    const fromVisibleRows = selectedActivitiesRateRow(selectedRateId, this.deps.getFilteredActivityRows());
    if (fromVisibleRows) {
      this.selectedListRateRow = fromVisibleRows;
      return fromVisibleRows;
    }
    return this.selectedListRateRow && this.selectedListRateRow.id === selectedRateId ? this.selectedListRateRow : null;
  }
  normalizeScore(value) {
    return normalizeActivitiesRateScore(value);
  }
  rateOwnScore(item) {
    return activitiesRateOwnScore(item);
  }
  hasOwnRating(item) {
    return activitiesRateHasOwnRating(item);
  }
  pairReceivedAverageScore(item) {
    return activitiesPairReceivedAverageScore(item, this.deps.getRateItems());
  }
  isPairReceivedRow(row) {
    const item = this.rateItemForRow(row);
    return item ? isActivitiesPairReceivedRateItem(item) : false;
  }
  ownRatingValue(row) {
    return activitiesRateOwnRatingValue(this.rateItemForRow(row), this.deps.getRateItems());
  }
  isFullscreenModeActive() {
    return this.deps.shouldShowFullscreenToggle() && this.deps.getFullscreenMode();
  }
  cancelEditorCloseTransition() {
    const timer = this.deps.getEditorCloseTimer();
    if (timer) {
      clearTimeout(timer);
      this.deps.setEditorCloseTimer(null);
    }
  }
  holdDockOpenForScoreSelection() {
    this.suppressDockCloseUntilMs = Date.now() + _ActivitiesRatesController.SCORE_SELECTION_DOCK_GUARD_MS;
    this.cancelEditorCloseTransition();
    this.cancelDockVisibilityHold();
    this.deps.setEditorClosing(false);
  }
  isSuppressingDockClose() {
    return Date.now() < this.suppressDockCloseUntilMs;
  }
  holdDockVisibilityAfterClose() {
    this.cancelDockVisibilityHold();
    this.dockVisibilityHoldUntilMs = Date.now() + _ActivitiesRatesController.EDITOR_DOCK_VISIBILITY_HOLD_MS;
    this.dockVisibilityHoldTimer = setTimeout(() => {
      this.dockVisibilityHoldTimer = null;
      this.dockVisibilityHoldUntilMs = 0;
      this.deps.markForCheck();
    }, _ActivitiesRatesController.EDITOR_DOCK_VISIBILITY_HOLD_MS);
  }
  cancelDockVisibilityHold() {
    this.dockVisibilityHoldUntilMs = 0;
    if (!this.dockVisibilityHoldTimer) {
      return;
    }
    clearTimeout(this.dockVisibilityHoldTimer);
    this.dockVisibilityHoldTimer = null;
  }
  isHoldingDockVisibility() {
    return Date.now() < this.dockVisibilityHoldUntilMs;
  }
  closeEditorAfterScoreCommit() {
    if (this.isFullscreenModeActive()) {
      return;
    }
    this.suppressDockCloseUntilMs = 0;
    this.clearEditorState(true);
  }
  cancelEditorLiftAnimation() {
    const frameId = this.deps.getEditorLiftAnimationFrame();
    if (frameId !== null && typeof globalThis.cancelAnimationFrame === "function") {
      globalThis.cancelAnimationFrame(frameId);
    }
    this.deps.setEditorLiftAnimationFrame(null);
  }
  smoothRevealSelectedRateRowWhenNeeded(rowId, attempt = 0) {
    if (!this.isEditorOpen()) {
      return;
    }
    const scrollElement = this.deps.getActivitiesListScrollElement();
    if (!scrollElement) {
      return;
    }
    const targetRow = scrollElement.querySelector(`[data-activity-rate-row-id="${rowId}"]`);
    if (!targetRow) {
      return;
    }
    const rateRows = Array.from(scrollElement.querySelectorAll(".activities-rate-profile-card.activities-row-item"));
    const rowTop = targetRow.offsetTop;
    const sameRowCards = rateRows.filter((card) => Math.abs(card.offsetTop - rowTop) <= 1);
    const scrollRect = scrollElement.getBoundingClientRect();
    const rowBottom = (sameRowCards.length > 0 ? sameRowCards : [targetRow]).reduce((maxBottom, card) => {
      return Math.max(maxBottom, card.getBoundingClientRect().bottom);
    }, targetRow.getBoundingClientRect().bottom);
    const dockHeight = Math.max(72, this.deps.getPaginationMenuHeight() || 72);
    const dockTop = scrollRect.bottom - dockHeight;
    const breathingRoom = this.deps.isMobileView() ? 6 : 8;
    const revealBottom = dockTop - breathingRoom;
    if (rowBottom <= revealBottom) {
      if (!Number.isFinite(this.deps.getEditorOpenScrollTop())) {
        this.deps.setLastEditorLiftDelta(0);
      }
      return;
    }
    const delta = rowBottom - revealBottom;
    const startTop = scrollElement.scrollTop;
    const targetTop = startTop + delta;
    if (targetTop <= scrollElement.scrollTop + 0.5) {
      this.deps.setLastEditorLiftDelta(0);
      if (attempt < 1) {
        setTimeout(() => this.smoothRevealSelectedRateRowWhenNeeded(rowId, attempt + 1), 120);
      }
      return;
    }
    const previousSnapType = scrollElement.style.scrollSnapType;
    scrollElement.style.scrollSnapType = "none";
    this.animateEditorScrollTo(scrollElement, targetTop, () => {
      this.deps.setLastEditorLiftDelta(Math.max(0, scrollElement.scrollTop - startTop));
      scrollElement.style.scrollSnapType = previousSnapType;
    });
  }
  animateEditorScrollTo(scrollElement, targetTop, onComplete) {
    this.cancelEditorLiftAnimation();
    animateActivitiesRateEditorScrollTo(scrollElement, targetTop, this.deps.getActivityRateEditorSlideDurationMs(), (frameId) => {
      this.deps.setEditorLiftAnimationFrame(frameId);
    }, onComplete);
  }
  triggerBlinks(rowId, onStart) {
    triggerActivitiesRateBlink(rowId, this.deps.getActivityRateBlinkUntilByRowId(), this.deps.getActivityRateBlinkTimeoutByRowId(), () => this.deps.markForCheck(), onStart);
  }
  pendingDirectionAfterRating(item) {
    return pendingActivitiesRateDirectionAfterRating(item);
  }
  resetEditorStateForFullscreenEntry() {
    this.cancelEditorCloseTransition();
    this.cancelDockVisibilityHold();
    this.cancelEditorLiftAnimation();
    this.deps.setEditorClosing(false);
    this.deps.setEditorOpenScrollTop(null);
    this.deps.setLastEditorLiftDelta(0);
    this.deps.setLastIndicatorPulseRowId(null);
    if (!this.selectedRateId()) {
      return;
    }
    this.setSelectedRateId(null);
  }
  syncListPositionToRow(rowId) {
    const scrollElement = this.deps.getActivitiesListScrollElement();
    if (!scrollElement) {
      return;
    }
    syncActivitiesRatesListPositionToRow(scrollElement, rowId, this.deps.isMobileView(), () => this.deps.markForCheck());
  }
  selectedRateId() {
    return this.deps.getSelectedRateId();
  }
  setSelectedRateId(value) {
    const previousValue = this.deps.getSelectedRateId();
    if (!value) {
      this.selectedListRateRow = null;
    }
    if (previousValue === value) {
      return;
    }
    this.deps.setSelectedRateId(value);
    this.deps.setSelectedRateIdInContext(value);
    this.refreshRateCards();
  }
  rateItemForRow(row) {
    return this.rateItemById(row.id);
  }
  rateItemById(itemId) {
    const normalizedId = itemId.trim();
    if (!normalizedId) {
      return null;
    }
    return this.deps.getRateItems().find((item) => item.id === normalizedId) ?? null;
  }
  setFullscreenMode(value) {
    if (this.deps.getFullscreenMode() === value) {
      return;
    }
    this.deps.setFullscreenMode(value);
    this.deps.setFullscreenModeInContext(value);
    this.refreshRateCards();
  }
  refreshRateCards(rowId) {
    this.deps.refreshRateCards(rowId);
  }
  triggerRatingBarBlink() {
    if (this.ratingBarBlinkTimeout) {
      clearTimeout(this.ratingBarBlinkTimeout);
      this.ratingBarBlinkTimeout = null;
    }
    this.isRatingBarBlinking = false;
    this.deps.markForCheck();
    const startBlink = () => {
      this.isRatingBarBlinking = true;
      this.deps.markForCheck();
      this.ratingBarBlinkTimeout = setTimeout(() => {
        this.isRatingBarBlinking = false;
        this.ratingBarBlinkTimeout = null;
        this.deps.markForCheck();
      }, 420);
    };
    if (typeof globalThis.requestAnimationFrame === "function") {
      globalThis.requestAnimationFrame(() => startBlink());
      return;
    }
    setTimeout(() => startBlink(), 0);
  }
};

// src/app/activity/components/activities-popup/activities-event-bucket-state-policy.ts
function shouldApplyActivitiesEventBucketLoad(context) {
  return !context.aborted && context.currentView !== "week" && context.currentView !== "month" && context.currentPrimaryFilter === "events" && context.queryPrimaryFilter === context.currentPrimaryFilter && context.queryEventScope === context.currentEventScope;
}

// src/app/activity/components/activities-popup/activities-popup.component.ts
var _c0 = ["activitiesSmartList"];
function ActivitiesPopupComponent_Conditional_0_ng_template_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-activities-rate-template", 9);
    \u0275\u0275listener("detailClick", function ActivitiesPopupComponent_Conditional_0_ng_template_2_Conditional_0_Template_app_activities_rate_template_detailClick_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.openProfileView($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    const row_r5 = ctx_r3.$implicit;
    const renderState_r6 = ctx_r3.renderState;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("row", row_r5)("presentation", "fullscreen")("state", renderState_r6)("context", ctx_r1.activitiesRateTemplateContext)("cardRevision", ctx_r1.activitiesRateCardRevisionForRow(row_r5));
  }
}
function ActivitiesPopupComponent_Conditional_0_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, ActivitiesPopupComponent_Conditional_0_ng_template_2_Conditional_0_Template, 1, 5, "app-activities-rate-template", 8);
  }
  if (rf & 2) {
    const row_r5 = ctx.$implicit;
    \u0275\u0275conditional(row_r5 ? 0 : -1);
  }
}
function ActivitiesPopupComponent_Conditional_0_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-activities-event-template", 10);
    \u0275\u0275listener("profileClick", function ActivitiesPopupComponent_Conditional_0_ng_template_6_Template_app_activities_event_template_profileClick_0_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openProfileView($event));
    })("mediaEndClick", function ActivitiesPopupComponent_Conditional_0_ng_template_6_Template_app_activities_event_template_mediaEndClick_0_listener() {
      const row_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openActivityMembers(row_r8));
    })("menuAction", function ActivitiesPopupComponent_Conditional_0_ng_template_6_Template_app_activities_event_template_menuAction_0_listener($event) {
      const row_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onActivityEventCardMenuAction(row_r8, $event));
    })("menuRequest", function ActivitiesPopupComponent_Conditional_0_ng_template_6_Template_app_activities_event_template_menuRequest_0_listener($event) {
      const openMenu_r9 = \u0275\u0275restoreView(_r7).openMenu;
      return \u0275\u0275resetView(openMenu_r9($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r8 = ctx.$implicit;
    const groupLabel_r10 = ctx.groupLabel;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("row", row_r8)("groupLabel", groupLabel_r10)("cardRevision", ctx_r1.activitiesEventCardRevisionForRow(row_r8));
  }
}
function ActivitiesPopupComponent_Conditional_0_ng_template_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-activities-chat-template", 11);
    \u0275\u0275listener("rowClick", function ActivitiesPopupComponent_Conditional_0_ng_template_8_Template_app_activities_chat_template_rowClick_0_listener($event) {
      const selectItem_r12 = \u0275\u0275restoreView(_r11).selectItem;
      return \u0275\u0275resetView(selectItem_r12($event));
    })("supportCaseAction", function ActivitiesPopupComponent_Conditional_0_ng_template_8_Template_app_activities_chat_template_supportCaseAction_0_listener($event) {
      const sourceItem_r13 = \u0275\u0275restoreView(_r11).sourceItem;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onSupportCaseAction(sourceItem_r13, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r14 = ctx.$implicit;
    const groupLabel_r15 = ctx.groupLabel;
    \u0275\u0275property("row", row_r14)("groupLabel", groupLabel_r15);
  }
}
function ActivitiesPopupComponent_Conditional_0_ng_template_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-activities-rate-template", 12);
    \u0275\u0275listener("detailClick", function ActivitiesPopupComponent_Conditional_0_ng_template_10_Template_app_activities_rate_template_detailClick_0_listener($event) {
      \u0275\u0275restoreView(_r16);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openProfileView($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r17 = ctx.$implicit;
    const groupLabel_r18 = ctx.groupLabel;
    const openMenu_r19 = ctx.openMenu;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("row", row_r17)("groupLabel", groupLabel_r18)("context", ctx_r1.activitiesRateTemplateContext)("openMenu", openMenu_r19)("cardRevision", ctx_r1.activitiesRateCardRevisionForRow(row_r17));
  }
}
function ActivitiesPopupComponent_Conditional_0_Conditional_12_Conditional_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function ActivitiesPopupComponent_Conditional_0_Conditional_12_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ActivitiesPopupComponent_Conditional_0_Conditional_12_Conditional_0_ng_container_0_Template, 1, 0, "ng-container", 13);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function ActivitiesPopupComponent_Conditional_0_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, ActivitiesPopupComponent_Conditional_0_Conditional_12_Conditional_0_Template, 1, 1, "ng-container");
  }
  if (rf & 2) {
    let tmp_7_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional((tmp_7_0 = ctx_r1.eventSubeventsStore.eventSubeventsListPopupComponent()) ? 0 : -1, tmp_7_0);
  }
}
function ActivitiesPopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 5)(1, "div", 6);
    \u0275\u0275listener("click", function ActivitiesPopupComponent_Conditional_0_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onActivitiesPopupSurfaceClick($event));
    });
    \u0275\u0275template(2, ActivitiesPopupComponent_Conditional_0_ng_template_2_Template, 1, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementStart(4, "app-smart-list", 7, 1);
    \u0275\u0275listener("itemSelect", function ActivitiesPopupComponent_Conditional_0_Template_app_smart_list_itemSelect_4_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onActivityRowClick($event));
    })("menuItemSelect", function ActivitiesPopupComponent_Conditional_0_Template_app_smart_list_menuItemSelect_4_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onActivityEventSharedMenuSelect($event));
    })("stateChange", function ActivitiesPopupComponent_Conditional_0_Template_app_smart_list_stateChange_4_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onActivitiesSmartListStateChange($event));
    })("wheel", function ActivitiesPopupComponent_Conditional_0_Template_app_smart_list_wheel_4_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.activitiesRates.closeEditorFromUserScroll($event));
    })("touchmove", function ActivitiesPopupComponent_Conditional_0_Template_app_smart_list_touchmove_4_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.activitiesRates.closeEditorFromUserScroll($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, ActivitiesPopupComponent_Conditional_0_ng_template_6_Template, 1, 3, "ng-template", null, 2, \u0275\u0275templateRefExtractor)(8, ActivitiesPopupComponent_Conditional_0_ng_template_8_Template, 1, 2, "ng-template", null, 3, \u0275\u0275templateRefExtractor)(10, ActivitiesPopupComponent_Conditional_0_ng_template_10_Template, 1, 5, "ng-template", null, 4, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(12, ActivitiesPopupComponent_Conditional_0_Conditional_12_Template, 1, 1);
  }
  if (rf & 2) {
    let tmp_16_0;
    const activitiesRateFullscreenSmartListItemTemplate_r20 = \u0275\u0275reference(3);
    const activitiesEventSmartListItemTemplate_r21 = \u0275\u0275reference(7);
    const activitiesChatSmartListItemTemplate_r22 = \u0275\u0275reference(9);
    const activitiesRateSmartListItemTemplate_r23 = \u0275\u0275reference(11);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.activitiesPopupModel());
    \u0275\u0275advance();
    \u0275\u0275classProp("activities-popup-rates-fullscreen", ctx_r1.activitiesSmartListPresentation() === "fullscreen")("activities-popup-blocked-user", ctx_r1.isBlockedUser);
    \u0275\u0275advance(3);
    \u0275\u0275property("config", ctx_r1.activitiesSmartListConfig)("loadPage", ctx_r1.activitiesSmartListLoadPage)("itemTemplate", ctx_r1.activitiesPrimaryFilter === "rates" ? activitiesRateSmartListItemTemplate_r23 : ctx_r1.activitiesPrimaryFilter === "chats" ? activitiesChatSmartListItemTemplate_r22 : activitiesEventSmartListItemTemplate_r21)("fullscreenItemTemplate", activitiesRateFullscreenSmartListItemTemplate_r20)("presentation", ctx_r1.activitiesSmartListPresentation())("view", ctx_r1.activitiesView)("query", ctx_r1.activitiesSmartListQuery);
    \u0275\u0275advance(8);
    \u0275\u0275conditional(((tmp_16_0 = ctx_r1.eventSubeventsStore.eventSubeventsListPopup()) == null ? null : tmp_16_0.host) === "activities" ? 12 : -1);
  }
}
var ActivitiesPopupComponent = class _ActivitiesPopupComponent {
  static EVENT_ACTIVITY_POLL_INTERVAL_MS = 3e4;
  static ADMIN_SUPPORT_BOARD_POLL_INTERVAL_MS = 3e4;
  // ── injected ──────────────────────────────────────────────────────────────
  cdr = inject(ChangeDetectorRef);
  activitiesStore = inject(ActivitiesPopupStore);
  activitiesService = inject(ActivitiesService);
  eventEditorStore = inject(EventEditorPopupStore);
  ratesService = inject(RatesService);
  activityMembersService = inject(ActivityMembersService);
  activityResourcesService = inject(ActivityResourcesService);
  chatsService = inject(ChatsService);
  pollCoordinator = inject(UiPollCoordinator);
  eventsService = inject(EventsService);
  usersService = inject(UsersService);
  shareTokensService = inject(ShareTokensService);
  userProfileStore = inject(UserProfileStore);
  runtimeStore = inject(AppRuntimeStore);
  activityStore = inject(ActivityStore);
  memberMenuStore = inject(MemberMenuStore);
  eventSubeventsStore = inject(EventSubeventsPopupStore);
  assetStore = inject(AssetStore);
  dialogStore = inject(DialogStore);
  profileStore = inject(ProfileStore);
  eventCheckoutDraftStore = inject(EventCheckoutDraftStore);
  eventCheckoutDialogStore = inject(EventCheckoutDialogStore);
  i18nService = inject(I18nService);
  explanationGuide = inject(ExplanationGuideService);
  activitiesRates = new ActivitiesRatesController({
    getActiveUserGender: () => this.activeUser.gender,
    getActivitiesPrimaryFilter: () => this.activitiesPrimaryFilter,
    getActivitiesRateFilter: () => this.activitiesRateFilter,
    getActivitiesRateSocialBadgeEnabled: () => this.activitiesRateSocialBadgeEnabled,
    getActivitiesRateSocialBadgeEnabledForFilter: (filter) => filter.startsWith("pair") ? this.activitiesPairRateSocialBadgeEnabled : this.activitiesIndividualRateSocialBadgeEnabled,
    getFilteredActivityRows: () => this.filteredActivityRows,
    getRateItems: () => this.ratesService.peekRateItemsByUser(this.activeUser.id),
    getSmartListCursorItem: () => this.activitiesSmartList?.cursorItem() ?? null,
    getActivitiesListScrollElement: () => this.activitiesSmartList?.scrollElement() ?? null,
    getPaginationMenuHeight: () => this.activitiesSmartList?.paginationMenuHeightPx() ?? 0,
    isPaginationMenuTarget: (target) => this.activitiesSmartList?.isPaginationMenuTarget(target) ?? false,
    isMobileView: () => this.isMobileView,
    isCalendarLayoutView: () => this.isCalendarLayoutView(),
    shouldShowFullscreenToggle: () => this.shouldShowRatesFullscreenToggle(),
    isFullscreenPaginationAnimating: () => this.activitiesSmartList?.isFullscreenPaginationAnimating() ?? false,
    getRatingScale: () => this.activityRatingScale,
    getActivityRateEditorSlideDurationMs: () => this.activityRateEditorSlideDurationMs,
    getSelectedRateId: () => this.selectedActivityRateId,
    setSelectedRateId: (value) => {
      this.selectedActivityRateId = value;
    },
    getEditorClosing: () => this.activityRateEditorClosing,
    setEditorClosing: (value) => {
      this.activityRateEditorClosing = value;
    },
    getEditorCloseTimer: () => this.activityRateEditorCloseTimer,
    setEditorCloseTimer: (value) => {
      this.activityRateEditorCloseTimer = value;
    },
    getEditorLiftAnimationFrame: () => this.activityRateEditorLiftAnimationFrame,
    setEditorLiftAnimationFrame: (value) => {
      this.activityRateEditorLiftAnimationFrame = value;
    },
    getEditorOpenScrollTop: () => this.activityRateEditorOpenScrollTop,
    setEditorOpenScrollTop: (value) => {
      this.activityRateEditorOpenScrollTop = value;
    },
    getLastEditorLiftDelta: () => this.lastActivityRateEditorLiftDelta,
    setLastEditorLiftDelta: (value) => {
      this.lastActivityRateEditorLiftDelta = value;
    },
    getLastIndicatorPulseRowId: () => this.lastRateIndicatorPulseRowId,
    setLastIndicatorPulseRowId: (value) => {
      this.lastRateIndicatorPulseRowId = value;
    },
    getFullscreenMode: () => this.activitiesRatesFullscreenMode,
    setFullscreenMode: (value) => {
      this.activitiesRatesFullscreenMode = value;
    },
    getActivityRateBlinkUntilByRowId: () => this.activityRateBlinkUntilByRowId,
    getActivityRateBlinkTimeoutByRowId: () => this.activityRateBlinkTimeoutByRowId,
    setSelectedRateIdInContext: (value) => this.activitiesStore.setActivitiesSelectedRateId(value),
    setFullscreenModeInContext: (value) => this.activitiesStore.setActivitiesRatesFullscreenMode(value),
    recordActivityRate: (item, score, direction) => this.ratesService.recordActivityRate(this.activeUser.id, item, score, direction),
    syncVisibleRateItem: (item) => this.syncVisibleRateItem(item),
    refreshRateCards: (rowId) => this.refreshActivitiesRateCards(rowId),
    markForCheck: () => this.cdr.markForCheck(),
    runAfterNextPaint: (task) => this.runAfterActivitiesNextPaint(task),
    runAfterRender: (task) => this.runAfterActivitiesRender(task)
  });
  activitiesEvents = new ActivitiesEventsController(this);
  activitiesChats = new ActivitiesChatsController(this);
  activitiesRateTemplateContext = this.activitiesRates.templateContext;
  // ── Self-contained data state (no host inputs) ───────────────────────────
  isMobileView = false;
  get activeUser() {
    return this.userProfileStore.activeUserProfile() ?? this.createFallbackActiveUser();
  }
  get chatBadge() {
    return this.activityCounterValue("chats");
  }
  get eventsBadge() {
    return this.activityCounterValue("events");
  }
  get allEventsScopeBadge() {
    return this.eventCounterValue("all");
  }
  get pendingBadge() {
    return this.eventCounterValue("pending");
  }
  get hostingBadge() {
    return this.activityCounterValue("hosting");
  }
  get invitationsBadge() {
    return this.activityCounterValue("invitations");
  }
  get draftsBadge() {
    return this.eventCounterValue("drafts");
  }
  get trashBadge() {
    return this.eventCounterValue("trash");
  }
  get gameBadge() {
    return this.activityCounterValue("game");
  }
  activeHostingIds = /* @__PURE__ */ new Set();
  activityDateTimeRangeById = {};
  eventDatesById = {};
  hostingDatesById = {};
  eventDistanceById = {};
  hostingDistanceById = {};
  activityImageById = {};
  activityCapacityById = {};
  activityPendingMembersById = {};
  eventVisibilityById = {};
  eventCapacityById = {};
  activityMembersByRowId = {};
  activitiesEventCardRevision = 0;
  activitiesEventCardRevisionByRowId = {};
  activitiesRateCardRevision = 0;
  activityRateCardRevisionByRowId = {};
  leavingActivityRowIds = /* @__PURE__ */ new Set();
  activityRowExitAnimationMs = 180;
  lastAppliedActivityMembersUpdatedMs = 0;
  lastAppliedActivityRuntimeUpdatedMs = 0;
  lastAppliedActivityChatMetricBucketPatchUpdatedMs = 0;
  activityChatListPollScopeKey = null;
  unregisterActivitiesExplanationContext = null;
  activitiesExplanationContextKey = null;
  get assetCards() {
    return this.assetStore.assetCards();
  }
  activityCounterValue(key) {
    const activeUser = this.userProfileStore.activeUserProfile();
    const activeUserId = activeUser?.id?.trim() ?? "";
    if (!activeUser || !activeUserId) {
      return 0;
    }
    const overrides = this.activityStore.getUserCounterOverrides(activeUserId);
    return this.normalizeBadgeCounter(overrides[key] ?? activeUser.activities?.[key]);
  }
  eventCounterValue(key) {
    const activeUser = this.userProfileStore.activeUserProfile();
    const activeUserId = activeUser?.id?.trim() ?? "";
    if (!activeUser || !activeUserId) {
      return 0;
    }
    const overrides = this.activityStore.getUserCounterOverrides(activeUserId);
    return this.normalizeBadgeCounter(overrides.event?.[key] ?? activeUser.activities?.event?.[key]);
  }
  normalizeBadgeCounter(value) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
      return 0;
    }
    return Math.max(0, Math.trunc(numericValue));
  }
  // ── ViewChild refs ────────────────────────────────────────────────────────
  activitiesSmartList;
  // ── Static data ───────────────────────────────────────────────────────────
  activityRatingScale = APP_STATIC_DATA.activityRatingScale;
  activitiesRateSocialBadgeEnabled = false;
  activitiesIndividualRateSocialBadgeEnabled = false;
  activitiesPairRateSocialBadgeEnabled = false;
  get isBlockedUser() {
    return this.userProfileStore.activeUserProfile()?.profileStatus === "blocked";
  }
  // ── Filter / view state – backed by popup store signals ───────────
  // Local copies are kept in sync via an effect() so that OnPush CD fires
  // correctly without needing toSignal() everywhere in the template.
  activitiesPrimaryFilter = "chats";
  activitiesEventScope = "active-events";
  activitiesChatContextFilter = "all";
  activitiesSupportCaseFilter = "all";
  activitiesSecondaryFilter = "recent";
  hostingPublicationFilter = "all";
  activitiesRateFilter = "individual-given";
  activitiesView = "day";
  showActivitiesViewPicker = false;
  showActivitiesSecondaryPicker = false;
  showActivitiesPrimaryPicker = false;
  showActivitiesEventScopePicker = false;
  showActivitiesChatContextPicker = false;
  showActivitiesRatePicker = false;
  showActivitiesQuickActionsMenu = false;
  activitiesSmartListQuery = {};
  activitySmartListItemConverter = {
    convert: (source, query) => this.convertActivitySmartListItem(source, query),
    convertList: (sources, query) => this.convertActivitySmartListItems(sources, query)
  };
  activitiesSmartListConfig = {
    pageSize: 10,
    initialPageSize: 20,
    defaultView: "day",
    containerClass: () => this.activitiesSmartListClassMap(),
    listLayout: "card-grid",
    desktopColumns: () => this.activitiesPrimaryFilter === "chats" ? 1 : 3,
    snapMode: () => {
      if (this.activitiesPrimaryFilter === "chats") {
        return "none";
      }
      if (this.activitiesPrimaryFilter === "rates") {
        return "mandatory";
      }
      return "mandatory";
    },
    scrollPaddingTop: "2.6rem",
    footerSpacerHeight: null,
    pollIntervalMs: () => this.activitiesSmartListPollIntervalMs(),
    headerProgress: {
      enabled: true,
      state: () => this.runtimeStore.isOnline() ? "active" : "inactive"
    },
    pagination: {
      mode: () => {
        if (this.activitiesPrimaryFilter !== "rates") {
          return "scroll";
        }
        if (this.activitiesRates.isFullscreenModeActive()) {
          return this.activitiesRates.isFullscreenReadOnlyNavigation() ? "arrows" : "rating-stars";
        }
        return "scroll";
      },
      ratingBarConfig: (row) => row ? this.activitiesRates.ratingBarConfig() : null,
      ratingBarValue: () => this.activitiesRates.ratingBarValue(),
      onRatingSelect: (_item, score) => this.activitiesRates.setSelectedOwnRating(score)
    },
    calendarVariant: () => this.activitiesPrimaryFilter === "rates" ? "counter" : "default",
    views: [
      { key: "day", label: "Day", mode: "list", pageSize: 10 },
      { key: "distance", label: "Distance", mode: "list", pageSize: 10 },
      { key: "week", label: "Week", mode: "week", pageSize: 240 },
      { key: "month", label: "Month", mode: "month", pageSize: 240 }
    ],
    cacheable: true,
    sortable: {
      sortKey: (row) => this.activityRowLocalSortKey(row)
    },
    converter: this.activitySmartListItemConverter,
    groupBy: (row) => AppUtils.activityGroupLabel(row, this.activitiesView, APP_STATIC_DATA.activityGroupLabels),
    calendar: {
      weekdayLabels: APP_STATIC_DATA.calendarWeekdayLabels,
      weekStartHour: 0,
      weekEndHour: 23,
      anchorRadius: 2,
      resolveDateRange: (row) => this.activityCalendarDateRange(row),
      badgeLabel: (row) => row.title,
      badgeToneClass: (row) => this.calendarBadgeToneClass(row)
    },
    emptyLabel: () => this.activitiesEmptyLabel,
    emptyStickyLabel: () => this.activitiesView === "distance" ? "5 km" : "No items",
    showGroupMarker: ({ groupIndex, scrollable }) => {
      if (groupIndex > 0) {
        return true;
      }
      if (this.activitiesPrimaryFilter === "chats") {
        return false;
      }
      if (this.isEventActivitiesPrimaryFilter() && !scrollable) {
        return false;
      }
      if (!scrollable) {
        return false;
      }
      return true;
    },
    menuItems: (context) => this.activitySmartListMenuItems(context)
  };
  activitiesSmartListLoadPage = (query, context) => from(this.loadActivitiesSmartListPage(query, context));
  activityChatListPollScheduler = new UiTaskScheduler({
    intervalMs: () => this.shouldPollActivityChatList() ? this.chatsService.pollIntervalMs() : 0,
    state: () => this.activityChatListPollState(),
    task: ({ state, signal: signal2 }) => this.pollActivityChatList(state, signal2),
    pollCoordinator: this.pollCoordinator,
    pollPriority: "foreground"
  });
  // ── Scroll / sticky ───────────────────────────────────────────────────────
  activitiesListScrollable = true;
  activitiesStickyValue = "";
  activitiesInitialLoadPending = false;
  lastHandledActivitiesOpenRevision = 0;
  activitiesPageSize = 10;
  // ── Rates state ───────────────────────────────────────────────────────────
  selectedActivityRateId = null;
  activityRateEditorClosing = false;
  activityRateEditorCloseTimer = null;
  activityRateEditorLiftAnimationFrame = null;
  activityRateEditorSlideDurationMs = 180;
  activityRateEditorOpenScrollTop = null;
  lastActivityRateEditorLiftDelta = 0;
  activityRateBlinkUntilByRowId = {};
  activityRateBlinkTimeoutByRowId = {};
  lastRateIndicatorPulseRowId = null;
  // ── Rates fullscreen state ────────────────────────────────────────────────
  activitiesRatesFullscreenMode = false;
  // ── Delete / publish confirms ─────────────────────────────────────────────
  stackedActivitiesPopup = null;
  activityMembersReadOnly = false;
  activityMembersPendingOnly = false;
  pendingActivityMemberDelete = null;
  selectedActivityMembers = [];
  selectedActivityMembersTitle = "";
  selectedActivityMembersRow = null;
  selectedActivityMembersRowId = null;
  trashedActivityRowsByKey = {};
  getChatLastSender(item) {
    return this.activitiesChats.getChatLastSender(item);
  }
  getChatMemberCount(item) {
    return this.activitiesChats.getChatMemberCount(item);
  }
  chatChannelType(item) {
    return this.activitiesChats.chatChannelType(item);
  }
  activityChatContextFilterKey(item) {
    return this.activitiesChats.activityChatContextFilterKey(item);
  }
  openActivityChat(chat) {
    this.activitiesChats.openActivityChat(chat);
  }
  openActivityChatForRow(sourceItem) {
    const chat = this.chatRecordForSourceItem(sourceItem);
    if (chat) {
      this.openActivityChat(chat);
    }
  }
  onActivityRowClick(event) {
    const row = event.item;
    if (this.activitiesPrimaryFilter === "chats") {
      this.openActivityChatForRow(event.sourceItem);
      return;
    }
    if (this.activitiesPrimaryFilter === "rates") {
      this.activitiesRates.openEditor(row, event.sourceEvent);
      return;
    }
    if (this.activitiesView === "month" || this.activitiesView === "week") {
      this.activitiesEvents.runActivityItemViewAction(row, event.sourceEvent);
      return;
    }
    this.activitiesEvents.onActivityRowClick(row, event.sourceEvent);
  }
  openActivityMembers(row, event) {
    event?.stopPropagation();
    if (!this.isEventStyleActivity(row)) {
      return;
    }
    if (this.activityEventListTypeForRow(row) !== "invitations") {
      this.activitiesEvents.openActivityMembers(row, event);
      return;
    }
    const membersRow = this.resolveInvitationActivityMembersRow(row);
    if (this.activityEventListTypeForRow(membersRow) !== "invitations") {
      this.activitiesEvents.openActivityMembers(membersRow, event);
      return;
    }
    const owner = ActivityEventInfoCardConverter.toActivityMembersOwner(membersRow);
    const summary = this.resolveActivityMembersPopupSummary(membersRow);
    this.memberMenuStore.requestActivitiesNavigation({
      type: "members",
      ownerId: owner.ownerId,
      ownerType: owner.ownerType,
      subtitle: membersRow.title,
      canManage: this.activityEventDTOIsAdmin(this.eventsService.peekKnownItemById(this.activeUser.id, membersRow.id)),
      acceptedMembers: summary?.acceptedMembers,
      pendingMembers: summary?.pendingMembers,
      capacityTotal: summary?.capacityTotal
    });
  }
  onActivityEventCardMenuAction(row, action) {
    if (!this.isEventStyleActivity(row)) {
      return;
    }
    this.activitiesEvents.onActivityEventCardMenuAction(row, action);
  }
  activitySmartListMenuItems(context) {
    const subject = this.activityEventMenuSubjectFromRow(context.item);
    if (!subject) {
      return context.menu.items;
    }
    const activeUserId = this.userProfileStore.activeUserId().trim() || this.activeUser.id;
    return ActivityEventInfoCardMenuConverter.convert(subject, {
      activeUserId,
      hiddenActions: ["editEvent", "manageEvent"]
    });
  }
  onActivityEventSharedMenuSelect(event) {
    if (this.activitiesRates.handleMenuSelect(event)) {
      return;
    }
    const context = event.context;
    if (context?.menu !== "activity-event-card") {
      return;
    }
    const row = this.activityEventRowFromMenuSubject(context.subject);
    if (!row) {
      return;
    }
    this.onActivityEventCardMenuAction(row, {
      id: row.id,
      actionId: context.action.id,
      action: context.action,
      card: row
    });
  }
  activityEventMenuSubjectFromRow(row) {
    if (!row || !this.isEventStyleActivity(row)) {
      return null;
    }
    const activeUserId = this.userProfileStore.activeUserId().trim() || this.activeUser.id.trim();
    const dto = this.activityEventDTOFromVisibleSource(row) ?? this.eventsService.peekKnownItemById(activeUserId, row.id);
    const record = this.eventsService.peekKnownRecordById(activeUserId, row.id);
    const draft = activeUserId ? this.eventCheckoutDraftStore.read(activeUserId, row.id) : null;
    const pendingForActiveUser = this.activityCheckoutPendingForActiveUser(activeUserId, dto, record);
    return {
      menu: "activity-event-card",
      id: row.id,
      status: dto?.status ?? row.status ?? null,
      ownerUserId: dto?.creatorUserId ?? row.ownerUserId ?? row.ownerId ?? null,
      adminIds: [...dto?.adminIds ?? []],
      acceptedMemberUserIds: [...dto?.acceptedMemberUserIds ?? []],
      pendingMemberUserIds: [...dto?.pendingMemberUserIds ?? []],
      invitedMemberUserIds: [...dto?.invitedMemberUserIds ?? []],
      pendingRequestMemberUserIds: [...dto?.pendingRequestMemberUserIds ?? []],
      activity: dto?.activity ?? row.menuBadgeCount ?? 0,
      eventScope: this.activitiesEventScope,
      checkoutState: draft?.checkoutState ?? record?.checkoutBasket?.status ?? null,
      checkoutMenuAction: this.activityCheckoutMenuAction(draft, record?.checkoutBasket ?? null, pendingForActiveUser, dto?.checkoutResultState ?? null)
    };
  }
  activityEventDTOFromVisibleSource(row) {
    const source = this.activitiesSmartList?.sourceItemSnapshot(this.activityRowIdentity(row));
    if (!source || typeof source !== "object") {
      return null;
    }
    const dto = source;
    return `${dto.id ?? ""}`.trim() === row.id ? dto : null;
  }
  activityCheckoutMenuAction(draft, basket, pendingForActiveUser = false, fallbackResultState = null) {
    const draftResult = this.activityCheckoutDraftResultState(draft);
    if (draftResult === "succeeded") {
      return "paymentSummary";
    }
    if (draftResult && draftResult !== "deleted") {
      return "continueBooking";
    }
    const basketResult = this.activityCheckoutBasketResultState(basket) ?? fallbackResultState;
    if (basketResult === "succeeded") {
      return "paymentSummary";
    }
    if (basketResult && basketResult !== "deleted") {
      return "continueBooking";
    }
    if (pendingForActiveUser) {
      return "continueBooking";
    }
    return null;
  }
  activityCheckoutPendingForActiveUser(activeUserId, dto, record) {
    const userId = activeUserId.trim();
    if (!userId) {
      return false;
    }
    const pendingRequestUserIds = [
      ...dto?.pendingRequestMemberUserIds ?? [],
      ...record?.pendingRequestMemberUserIds ?? []
    ].map((candidate) => `${candidate ?? ""}`.trim());
    if (pendingRequestUserIds.some((candidate) => candidate === userId)) {
      return true;
    }
    const invitedUserIds = new Set([
      ...dto?.invitedMemberUserIds ?? [],
      ...record?.invitedMemberUserIds ?? []
    ].map((candidate) => `${candidate ?? ""}`.trim()).filter(Boolean));
    if (invitedUserIds.has(userId)) {
      return false;
    }
    const pendingReason = `${dto?.pendingReason ?? record?.pendingReason ?? ""}`.trim();
    if (pendingReason === "waitlist" || pendingReason === "approval") {
      return true;
    }
    return [
      ...dto?.pendingMemberUserIds ?? [],
      ...record?.pendingMemberUserIds ?? []
    ].some((candidate) => {
      const candidateUserId = `${candidate ?? ""}`.trim();
      return candidateUserId === userId && !invitedUserIds.has(candidateUserId);
    });
  }
  activityCheckoutDraftResultState(draft) {
    return draft ? this.activityCheckoutBasketResultState({ items: draft.basketItems }) : null;
  }
  activityCheckoutBasketResultState(basket) {
    const resultStates = (basket?.items ?? []).map((item) => item.resultState ?? "pending");
    if (resultStates.length === 0) {
      return null;
    }
    if (resultStates.some((resultState) => resultState === "failed")) {
      return "failed";
    }
    if (resultStates.every((resultState) => resultState === "deleted")) {
      return "deleted";
    }
    if (resultStates.every((resultState) => resultState === "deleted" || resultState === "succeeded")) {
      return "succeeded";
    }
    return "pending";
  }
  activityEventRowFromMenuSubject(subject) {
    const row = this.activitiesSmartList?.findVisibleItem((item) => item.id === subject.id) ?? null;
    if (!row || !this.isEventStyleActivity(row)) {
      return null;
    }
    return row;
  }
  openProfileView(profileView) {
    this.profileStore.openProfileView(profileView);
  }
  isActivityIdentityTrashed(type, id) {
    return this.activitiesEvents.isActivityIdentityTrashed(type, id);
  }
  openActivityRowInEventModule(row, readOnly) {
    if (!this.isEventStyleActivity(row)) {
      return;
    }
    this.activitiesEvents.openActivityRowInEventModule(row, readOnly);
  }
  // =========================================================================
  // Lifecycle
  // =========================================================================
  constructor() {
    this.hydrateStandaloneFallbackState();
    this.syncMobileViewFromViewport();
    effect(() => {
      const store = this.activitiesStore;
      this.activitiesPrimaryFilter = store.activitiesPrimaryFilter();
      this.activitiesEventScope = store.activitiesEventScope();
      this.activitiesChatContextFilter = store.activitiesChatContextFilter();
      this.activitiesSupportCaseFilter = store.activitiesSupportCaseFilter();
      this.activitiesSecondaryFilter = store.activitiesSecondaryFilter();
      this.hostingPublicationFilter = store.activitiesHostingPublicationFilter();
      this.activitiesRateFilter = store.activitiesRateFilter();
      this.activitiesRateSocialBadgeEnabled = store.activitiesRateSocialBadgeEnabled();
      this.activitiesIndividualRateSocialBadgeEnabled = store.activitiesIndividualRateSocialBadgeEnabled();
      this.activitiesPairRateSocialBadgeEnabled = store.activitiesPairRateSocialBadgeEnabled();
      this.activitiesView = store.activitiesView();
      this.showActivitiesViewPicker = store.activitiesShowViewPicker();
      this.showActivitiesSecondaryPicker = store.activitiesShowSecondaryPicker();
      this.activitiesStickyValue = store.activitiesStickyValue();
      this.activitiesRatesFullscreenMode = store.activitiesRatesFullscreenMode();
      this.selectedActivityRateId = store.activitiesSelectedRateId();
      this.syncActivitiesSmartListQuery();
      this.cdr.markForCheck();
    });
    effect(() => {
      this.userProfileStore.activeUserProfile();
      this.bumpActivitiesEventCardRevision();
      this.refreshSectionBadges();
      this.cdr.markForCheck();
    });
    effect(() => {
      const isOpen = this.activitiesStore.activitiesOpen();
      const primaryFilter = this.activitiesStore.activitiesPrimaryFilter();
      const contextKey = isOpen && primaryFilter === "rates" ? "activities.rates" : isOpen && primaryFilter === "chats" ? "chats" : isOpen && primaryFilter === "events" ? "events" : null;
      this.setActivitiesExplanationContext(contextKey);
    });
    effect(() => {
      const request = this.eventSubeventsStore.eventSubeventsListPopup();
      if (!request || request.host !== "activities" || !this.activitiesStore.activitiesOpen()) {
        return;
      }
      void this.eventSubeventsStore.ensureEventSubeventsListPopupLoaded();
    });
    effect(() => {
      const patch = this.activitiesStore.eventChatRowPatch();
      if (!patch) {
        return;
      }
      untracked(() => {
        this.applyEventChatRowPatch(patch);
        this.refreshSectionBadges();
        this.cdr.markForCheck();
      });
    });
    effect(() => {
      const scopeKey = this.activityChatListPollScope();
      if (scopeKey === this.activityChatListPollScopeKey) {
        return;
      }
      this.activityChatListPollScopeKey = scopeKey || null;
      if (scopeKey) {
        this.activityChatListPollScheduler.restart();
      } else {
        this.activityChatListPollScheduler.stop({ abort: true });
      }
    });
    effect(() => {
      if (this.isEventActivitiesPrimaryFilter() && this.activitiesSecondaryFilter === "relevant") {
        this.activitiesStore.setActivitiesSecondaryFilter("recent");
      }
    });
    effect(() => {
      const isOpen = this.activitiesStore.activitiesOpen();
      const openRevision = this.activitiesStore.activitiesOpenRevision();
      if (!isOpen) {
        this.lastHandledActivitiesOpenRevision = openRevision;
        return;
      }
      if (openRevision !== this.lastHandledActivitiesOpenRevision) {
        this.lastHandledActivitiesOpenRevision = openRevision;
        this.onActivitiesOpened();
      }
    });
    effect(() => {
      const message = this.activitiesStore.activityEventSync();
      if (!message) {
        return;
      }
      this.applyActivityEventSyncMessage(message);
      this.activitiesStore.clearActivityEventSync();
      this.cdr.markForCheck();
    });
    effect(() => {
      this.eventCheckoutDraftStore.drafts();
      this.bumpActivitiesEventCardRevision();
      this.refreshSectionBadges();
      this.cdr.markForCheck();
    });
    effect(() => {
      const sync = this.activityStore.activityMembersSync();
      if (!sync || sync.updatedMs <= this.lastAppliedActivityMembersUpdatedMs) {
        return;
      }
      this.lastAppliedActivityMembersUpdatedMs = sync.updatedMs;
      this.applyActivityMembersSyncState(sync);
      this.cdr.markForCheck();
    });
    effect(() => {
      const sync = this.activityStore.activityEventRuntimeSync();
      if (!sync || sync.updatedMs <= this.lastAppliedActivityRuntimeUpdatedMs) {
        return;
      }
      this.lastAppliedActivityRuntimeUpdatedMs = sync.updatedMs;
      if (!this.activitiesStore.activitiesOpen() || !this.isEventActivitiesPrimaryFilter()) {
        return;
      }
      this.applyActivityEventRuntimeSync(sync);
      this.cdr.markForCheck();
    });
    effect(() => {
      const patch = this.activityStore.activityChatMetricBucketPatch();
      if (!patch || patch.updatedMs <= this.lastAppliedActivityChatMetricBucketPatchUpdatedMs) {
        return;
      }
      this.lastAppliedActivityChatMetricBucketPatchUpdatedMs = patch.updatedMs;
      this.applyActivityChatMetricBucketPatch(patch);
      this.cdr.markForCheck();
    });
    effect(() => {
      this.assetStore.assetListRevision();
      this.cdr.markForCheck();
    });
  }
  onEscapePressed(event) {
    const keyboardEvent = event;
    if (keyboardEvent.defaultPrevented) {
      return;
    }
    if (!this.activitiesStore.activitiesOpen()) {
      return;
    }
    if (this.dialogStore.dialog()) {
      return;
    }
    if (this.eventEditorStore.isOpen()) {
      return;
    }
    event.stopPropagation();
    this.closeActivitiesPopup();
  }
  onViewportResize() {
    this.syncMobileViewFromViewport();
  }
  /** Called once each time the service opens the popup. */
  onActivitiesOpened() {
    this.resetActivitiesStateForOpen();
    this.activitiesRates.clearEditorState();
    this.resetActivitiesScroll();
  }
  resetActivitiesStateForOpen() {
    this.activitiesSmartList?.replaceVisibleItems([], { total: 0 });
    this.activitiesStickyValue = "";
    this.lastRateIndicatorPulseRowId = null;
    this.showActivitiesPrimaryPicker = false;
    this.showActivitiesEventScopePicker = false;
    this.showActivitiesChatContextPicker = false;
    this.showActivitiesRatePicker = false;
    this.showActivitiesQuickActionsMenu = false;
  }
  ngOnDestroy() {
    this.activityChatListPollScheduler.destroy();
    this.activitiesRates.clearEditorState();
    this.activitiesSmartList?.clearHostedLoading();
    this.clearActivitiesExplanationContext();
  }
  setActivitiesExplanationContext(contextKey) {
    if (this.activitiesExplanationContextKey === contextKey) {
      return;
    }
    this.clearActivitiesExplanationContext();
    if (!contextKey) {
      return;
    }
    this.activitiesExplanationContextKey = contextKey;
    this.unregisterActivitiesExplanationContext = this.explanationGuide.registerContext(contextKey);
  }
  clearActivitiesExplanationContext() {
    this.unregisterActivitiesExplanationContext?.();
    this.unregisterActivitiesExplanationContext = null;
    this.activitiesExplanationContextKey = null;
  }
  createFallbackActiveUser() {
    return {
      id: this.userProfileStore.activeUserId().trim(),
      name: "Demo User",
      age: 0,
      birthday: "",
      city: "",
      height: "",
      physique: "",
      languages: [],
      horoscope: "",
      initials: "DU",
      gender: "woman",
      statusText: "",
      hostTier: "",
      traitLabel: "",
      completion: 0,
      headline: "",
      about: "",
      images: [],
      profileStatus: "public",
      activities: { game: 0, chats: 0, invitations: 0, events: 0, hosting: 0 }
    };
  }
  hydrateStandaloneFallbackState() {
    this.refreshSectionBadges();
  }
  activitiesSmartListPollIntervalMs() {
    if (this.activitiesStore.activitiesOpen() && this.isEventActivitiesPrimaryFilter() && !this.isCalendarLayoutView() && !this.dialogStore.dialog() && !this.activitiesStore.eventChatSession()) {
      return _ActivitiesPopupComponent.EVENT_ACTIVITY_POLL_INTERVAL_MS;
    }
    return this.activitiesStore.activitiesOpen() && this.isAdminServiceChatMode() && this.activitiesPrimaryFilter === "chats" && !this.isCalendarLayoutView() && !this.dialogStore.dialog() && !this.activitiesStore.eventChatSession() ? _ActivitiesPopupComponent.ADMIN_SUPPORT_BOARD_POLL_INTERVAL_MS : 0;
  }
  shouldPollActivityChatList() {
    return this.activitiesStore.activitiesOpen() && this.activitiesPrimaryFilter === "chats" && !this.isAdminServiceChatMode() && !this.isCalendarLayoutView() && !this.dialogStore.dialog() && !this.activitiesStore.eventChatSession();
  }
  activityChatListPollState() {
    if (!this.shouldPollActivityChatList()) {
      return { scopeKey: "", targets: [] };
    }
    return {
      scopeKey: this.activityChatListPollScope(),
      targets: (this.activitiesSmartList?.itemsSnapshot() ?? []).filter((row) => this.isActivityChatRow(row)).map((row) => ({
        chatId: `${row.id ?? ""}`.trim(),
        ownerId: `${row.ownerId ?? ""}`.trim() || null,
        channelType: this.activityChatChannelTypeFromRow(row),
        revision: Math.max(1, Math.trunc(Number(row.chatRevision) || 1))
      })).filter((target) => target.chatId.length > 0)
    };
  }
  async pollActivityChatList(state, signal2) {
    if (!state.scopeKey || state.scopeKey !== this.activityChatListPollScope()) {
      return;
    }
    for (const target of state.targets) {
      if (signal2?.aborted || state.scopeKey !== this.activityChatListPollScope()) {
        return;
      }
      const result = await this.chatsService.syncChatHeader(target.chatId, target.revision, signal2);
      if (!result.changed || signal2?.aborted || state.scopeKey !== this.activityChatListPollScope()) {
        continue;
      }
      this.activitiesStore.emitEventChatRowPatch({
        chatId: target.chatId,
        ownerId: target.ownerId,
        channelType: target.channelType,
        ownerStatus: result.ownerStatus ?? null,
        headerRevision: result.revision
      });
    }
  }
  activityChatListPollScope() {
    if (!this.shouldPollActivityChatList()) {
      return "";
    }
    return [
      this.activeUser.id,
      this.activitiesChatContextFilter,
      this.activitiesSecondaryFilter,
      this.activitiesView
    ].join(":");
  }
  activityChatChannelTypeFromRow(row) {
    const status = `${row.status ?? ""}`.trim();
    return status === "general" || status === "mainEvent" || status === "optionalSubEvent" || status === "groupSubEvent" || status === "serviceEvent" || status === "appSupport" || status === "supportCase" ? status : null;
  }
  applyEventChatRowPatch(patch) {
    const smartList = this.activitiesSmartList;
    const chatId = `${patch.chatId ?? ""}`.trim();
    const ownerId = `${patch.ownerId ?? ""}`.trim();
    const channelType = `${patch.channelType ?? ""}`.trim();
    if (!smartList || !chatId && !ownerId || this.activitiesPrimaryFilter !== "chats" || this.isCalendarLayoutView()) {
      return;
    }
    smartList.patchVisibleItem((row) => this.matchesEventChatRowPatch(row, chatId, ownerId, channelType), (row) => this.patchActivityChatRow(row, patch));
  }
  matchesEventChatRowPatch(row, chatId, ownerId, channelType) {
    if (chatId) {
      return `${row.id ?? ""}`.trim() === chatId;
    }
    if (ownerId) {
      return `${row.ownerId ?? ""}`.trim() === ownerId && this.matchesEventChatRowChannelType(row, channelType);
    }
    return false;
  }
  matchesEventChatRowChannelType(row, channelType) {
    if (!channelType) {
      return true;
    }
    const rowStatus = `${row.status ?? ""}`.trim();
    if (rowStatus === channelType) {
      return true;
    }
    return channelType === "supportCase" && this.supportStatusFromRowStatus(rowStatus) !== null;
  }
  patchActivityChatRow(row, patch) {
    let next = row;
    const cloneNext = () => next === row ? __spreadValues({}, row) : next;
    if (patch.unread !== void 0) {
      const unread = this.normalizeBadgeCounter(patch.unread);
      if ((next.unread ?? 0) !== unread || (next.badgeCount ?? 0) !== unread) {
        next = cloneNext();
        next.unread = unread;
        next.badgeCount = unread;
      }
    }
    if (patch.lastMessage !== void 0) {
      const detail = `${patch.lastMessage ?? ""}`.trim();
      if ((next.detail ?? "") !== detail) {
        next = cloneNext();
        next.detail = detail;
      }
    }
    if (patch.dateIso !== void 0) {
      const dateIso = `${patch.dateIso ?? ""}`.trim() || void 0;
      if ((next.dateIso ?? void 0) !== dateIso) {
        next = cloneNext();
        next.dateIso = dateIso;
      }
    }
    if (patch.lastSenderId !== void 0) {
      const senderName = this.resolveActivityChatRowSenderName(patch.lastSenderId);
      if (senderName && next.title !== senderName) {
        next = cloneNext();
        next.title = senderName;
      }
    }
    if (patch.ownerStatus !== void 0 || patch.headerRevision !== void 0) {
      const ownerStatus = patch.ownerStatus === void 0 ? next.chatOwnerStatus ?? null : patch.ownerStatus;
      const headerRevision = patch.headerRevision === void 0 ? next.chatRevision : Math.max(1, Math.trunc(Number(patch.headerRevision) || 1));
      if (next.chatOwnerStatus !== ownerStatus || next.chatRevision !== headerRevision) {
        next = cloneNext();
        next.chatOwnerStatus = ownerStatus;
        next.chatRevision = headerRevision;
        const retainedBadges = (next.badges ?? []).filter((badge) => badge.className !== "event-chat-owner-status-badge");
        next.badges = ownerStatus === "DR" ? [...retainedBadges, {
          label: this.i18nService.translate("activities.chat.event.status.underReview"),
          title: this.i18nService.translate("activities.chat.event.status.underReview"),
          tone: "warning",
          position: "inline",
          className: "event-chat-owner-status-badge"
        }] : retainedBadges;
      }
    }
    return next;
  }
  resolveActivityChatRowSenderName(senderId) {
    const normalizedSenderId = `${senderId ?? ""}`.trim();
    if (!normalizedSenderId) {
      return null;
    }
    if (normalizedSenderId === this.activeUser.id) {
      return this.activeUser.name;
    }
    return this.usersService.peekCachedUserById(normalizedSenderId)?.name ?? null;
  }
  doesChatMatchActiveContextFilter(chat) {
    if (this.activitiesChatContextFilter === "all") {
      return this.doesChatMatchActiveSupportCaseFilter(chat);
    }
    return this.activitiesChats.activityChatContextFilterKey(chat) === this.activitiesChatContextFilter && this.doesChatMatchActiveSupportCaseFilter(chat);
  }
  isAdminServiceChatMode() {
    return this.activitiesStore.activitiesAdminServiceOnly();
  }
  activitiesPopupModel() {
    return {
      title: "Activities",
      subtitle: this.activitiesHeaderLineOne(),
      secondarySubtitle: this.activitiesHeaderLineTwo(),
      ariaLabel: "Activities",
      closeAriaLabel: "Close activities",
      size: "wide",
      height: "full",
      headerTone: "accent",
      bodyLayout: "fill",
      headerControls: this.activitiesPopupHeaderControls(),
      toolbarControls: this.activitiesPopupToolbarControls(),
      onClose: () => this.closeActivitiesPopup(),
      onAction: (event) => this.onActivitiesPopupAction(event),
      onMenuSelect: (event) => this.onActivitiesPopupMenuSelect(event)
    };
  }
  onActivitiesPopupAction(event) {
    switch (event.action.id) {
      case "event-explore":
        this.requestOpenEventExplore();
        return;
      case "rates-fullscreen-toggle":
        this.activitiesRates.toggleFullscreenMode(event.sourceEvent);
        return;
      default:
        return;
    }
  }
  onActivitiesPopupMenuSelect(event) {
    const context = event.itemSelect.context;
    if (!context) {
      return;
    }
    switch (context.menu) {
      case "primary":
        this.selectActivitiesPrimaryFilter(context.value);
        return;
      case "event-scope":
        this.selectActivitiesEventScope(context.value);
        return;
      case "chat-context":
        this.selectActivitiesChatContextFilter(context.value);
        return;
      case "rate":
        this.selectActivitiesRateFilter(context.value);
        return;
      case "rate-social":
        this.toggleRateSocialBadgeForGroup(context.value);
        return;
      case "secondary":
        this.selectActivitiesSecondaryFilter(context.value);
        return;
      case "view":
        this.setActivitiesView(context.value, event.itemSelect.sourceEvent);
        return;
      case "support-case":
        this.selectActivitiesSupportCaseFilter(context.value);
        return;
      case "quick-action":
        if (context.value === "explore") {
          this.requestOpenEventExplore();
          return;
        }
        this.requestOpenEventEditor();
        return;
      default:
        return;
    }
  }
  activitiesPopupHeaderControls() {
    const controls = [];
    if (this.activitiesPrimaryFilter === "chats" && this.isAdminServiceChatMode()) {
      controls.push({
        kind: "menu",
        id: "support-case",
        trigger: this.activitiesSupportCaseMenuTrigger(),
        items: this.activitiesSupportCaseMenuItems()
      });
    }
    if (!this.isCalendarLayoutView() && this.activitiesPrimaryFilter !== "chats") {
      controls.push({
        kind: "menu",
        id: "secondary",
        trigger: this.activitiesSecondaryMenuTrigger(),
        items: this.activitiesSecondaryMenuItems()
      });
    }
    if (this.activitiesPrimaryFilter !== "chats") {
      controls.push({
        kind: "menu",
        id: "view",
        trigger: this.activitiesViewMenuTrigger(),
        items: this.activitiesViewMenuItems()
      });
    }
    return controls;
  }
  activitiesPopupToolbarControls() {
    const controls = [];
    if (!this.isAdminServiceChatMode()) {
      controls.push({
        kind: "menu",
        id: "primary",
        trigger: this.activitiesPrimaryMenuTrigger(),
        items: this.activitiesPrimaryMenuItems()
      });
    }
    if (this.isEventActivitiesPrimaryFilter()) {
      controls.push({
        kind: "menu",
        id: "event-scope",
        trigger: this.activitiesEventScopeMenuTrigger(),
        items: this.activitiesEventScopeMenuItems()
      });
    }
    if (this.activitiesPrimaryFilter === "chats" && !this.isAdminServiceChatMode()) {
      controls.push({
        kind: "menu",
        id: "chat-context",
        trigger: this.activitiesChatContextMenuTrigger(),
        items: this.activitiesChatContextMenuItems()
      });
    }
    if (this.activitiesPrimaryFilter === "rates") {
      controls.push({
        kind: "menu",
        id: "rate",
        trigger: this.activitiesRateMenuTrigger(),
        model: this.activitiesRateMenuModel()
      });
    }
    if (this.shouldShowStandaloneEventExploreAction()) {
      controls.push({
        id: "event-explore",
        align: "end",
        icon: "explore",
        label: "Explore",
        ariaLabel: "Open event explore",
        palette: "violet",
        compactOnMobile: true
      });
    }
    if (this.shouldShowRatesFullscreenToggle()) {
      controls.push({
        id: "rates-fullscreen-toggle",
        align: "end",
        icon: this.isRatesFullscreenModeActive() ? "fullscreen_exit" : "fullscreen",
        ariaLabel: this.isRatesFullscreenModeActive() ? "Exit rates fullscreen mode" : "Open rates fullscreen mode",
        palette: this.isRatesFullscreenModeActive() ? "blue" : "gold",
        active: this.isRatesFullscreenModeActive()
      });
    }
    if (this.shouldShowActivitiesQuickActions()) {
      controls.push({
        kind: "menu",
        id: "quick-actions",
        align: "end",
        trigger: this.activitiesQuickActionsMenuTrigger(),
        items: this.activitiesQuickActionsMenuItems(),
        panelAlign: "end"
      });
    }
    return controls;
  }
  activitiesHeaderLineOne() {
    if (this.activitiesPrimaryFilter === "chats") {
      return this.activitiesChatsHeaderLabel();
    }
    if (this.activitiesPrimaryFilter === "rates") {
      const group = this.rateGroupLabelKeyForKey(this.activitiesRateFilter);
      const label = this.rateFilterLabelForKey(this.activitiesRateFilter);
      return `${group} \xB7 ${label}`;
    }
    if (this.isEventActivitiesPrimaryFilter()) {
      if (this.isCalendarLayoutView()) {
        return `Events \xB7 ${this.activitiesEventScopeLabel()}`;
      }
      return this.activitiesEventScopeLabel();
    }
    if (this.isCalendarLayoutView()) {
      return this.activitiesPrimaryFilterLabel();
    }
    return `${this.activitiesPrimaryFilterLabel()} \xB7 ${this.activitiesSecondaryFilterLabel()}`;
  }
  activitiesHeaderLineTwo() {
    return "";
  }
  activitiesSupportCaseMenuTrigger() {
    return this.activitiesSelectTrigger({
      label: this.supportCaseFilterLabelKey(),
      icon: this.supportCaseFilterIcon(),
      palette: this.supportCasePalette(this.activitiesSupportCaseFilter),
      counter: this.supportCaseFilterCount(this.activitiesSupportCaseFilter),
      layout: "pill"
    });
  }
  activitiesSupportCaseMenuItems() {
    return this.activitiesSupportCaseFilters().map((option) => this.activitiesMenuItem({
      id: `support-case:${option.key}`,
      label: option.labelKey,
      icon: option.icon,
      palette: this.supportCasePalette(option.key),
      counter: this.supportCaseFilterCount(option.key),
      active: option.key === this.activitiesSupportCaseFilter,
      context: { menu: "support-case", value: option.key }
    }));
  }
  activitiesPrimaryMenuTrigger() {
    return this.activitiesSelectTrigger({
      label: this.activitiesPrimaryFilterLabel(),
      icon: this.activitiesPrimaryFilterIcon(),
      palette: this.activitiesPrimaryPalette(this.activitiesPrimaryFilter),
      counter: this.activitiesPrimaryFilterCount(this.activitiesPrimaryFilter)
    });
  }
  activitiesPrimaryMenuItems() {
    return this.activitiesPrimaryFilters().map((option) => this.activitiesMenuItem({
      id: `primary:${option.key}`,
      label: option.label,
      icon: option.icon,
      palette: this.activitiesPrimaryPalette(option.key),
      counter: this.activitiesPrimaryFilterCount(option.key),
      active: option.key === this.activitiesPrimaryFilter,
      context: { menu: "primary", value: option.key }
    }));
  }
  activitiesEventScopeMenuTrigger() {
    return this.activitiesSelectTrigger({
      label: this.activitiesEventScopeLabel(),
      icon: this.activitiesEventScopeIcon(),
      palette: this.activitiesEventScopePalette(this.activitiesEventScope),
      counter: this.activitiesEventScopeCount(this.activitiesEventScope)
    });
  }
  activitiesEventScopeMenuItems() {
    return this.activitiesEventScopeFilters().map((option) => this.activitiesMenuItem({
      id: `event-scope:${option.key}`,
      label: option.label,
      icon: option.icon,
      palette: this.activitiesEventScopePalette(option.key),
      counter: this.activitiesEventScopeCount(option.key),
      active: option.key === this.activitiesEventScope,
      context: { menu: "event-scope", value: option.key }
    }));
  }
  activitiesChatContextMenuTrigger() {
    return this.activitiesSelectTrigger({
      label: this.activitiesChatContextFilterLabel(),
      icon: this.activitiesChatContextFilterIcon(),
      palette: this.activitiesChatContextPalette(this.activitiesChatContextFilter),
      counter: this.activitiesChatContextFilterCount(this.activitiesChatContextFilter)
    });
  }
  activitiesChatContextMenuItems() {
    return APP_STATIC_DATA.activitiesChatContextFilters.map((option) => this.activitiesMenuItem({
      id: `chat-context:${option.key}`,
      label: option.label,
      icon: option.icon,
      palette: this.activitiesChatContextPalette(option.key),
      counter: this.activitiesChatContextFilterCount(option.key),
      active: option.key === this.activitiesChatContextFilter,
      context: { menu: "chat-context", value: option.key }
    }));
  }
  activitiesRateMenuTrigger() {
    return this.activitiesSelectTrigger({
      label: this.activitiesRateFilterLabel(),
      icon: this.activitiesRateFilterIcon(this.activitiesRateFilter),
      palette: this.activitiesRatePalette(this.activitiesRateFilter),
      counter: this.rateFilterCount(this.activitiesRateFilter)
    });
  }
  activitiesRateMenuModel() {
    const nodes = [];
    let currentNode = null;
    for (const option of APP_STATIC_DATA.rateFilterEntries) {
      if (option.kind === "group") {
        const groupLabel = option.label;
        const groupPalette = this.activitiesRateGroupPalette(groupLabel);
        currentNode = {
          id: `rate-group:${groupLabel}`,
          label: this.rateGroupOptionLabelKey(groupLabel),
          icon: this.rateSocialBadgeGroupIconForGroup(groupLabel),
          palette: groupPalette,
          items: [],
          headerActions: this.shouldShowRateSocialBadgeToggleForGroup(groupLabel) ? [{
            id: `rate-social:${groupLabel}`,
            label: this.rateSocialBadgeButtonLabelForGroup(groupLabel),
            icon: this.rateSocialBadgeToggleIconForGroup(groupLabel),
            kind: "toggle",
            active: this.isRateSocialBadgeToggleActiveForGroup(groupLabel),
            closeOnSelect: false,
            palette: groupPalette,
            context: { menu: "rate-social", value: groupLabel }
          }] : []
        };
        nodes.push(currentNode);
        continue;
      }
      if (!currentNode) {
        currentNode = {
          id: "rate-group:default",
          label: "rate.type",
          icon: "list",
          palette: "gold",
          items: []
        };
        nodes.push(currentNode);
      }
      currentNode.items.push(this.activitiesMenuItem({
        id: `rate:${option.key}`,
        label: this.rateFilterOptionLabel(option.key),
        icon: this.activitiesRateFilterIcon(option.key),
        palette: this.activitiesRatePalette(option.key),
        counter: this.rateFilterCount(option.key),
        active: option.key === this.activitiesRateFilter,
        context: { menu: "rate", value: option.key }
      }));
    }
    return { nodes };
  }
  activitiesSecondaryMenuTrigger() {
    const filter = this.effectiveActivitiesSecondaryFilter();
    return this.activitiesSelectTrigger({
      label: this.activitiesSecondaryFilterLabel(),
      icon: this.activitiesSecondaryFilterIcon(),
      palette: this.activitiesSecondaryPalette(filter),
      layout: "pill",
      collapsible: true
    });
  }
  activitiesSecondaryMenuItems() {
    return this.availableActivitiesSecondaryFilters().map((option) => this.activitiesMenuItem({
      id: `secondary:${option.key}`,
      label: this.activitiesSecondaryFilterOptionLabel(option.key),
      icon: option.icon,
      palette: this.activitiesSecondaryPalette(option.key),
      active: option.key === this.effectiveActivitiesSecondaryFilter(),
      context: { menu: "secondary", value: option.key }
    }));
  }
  activitiesViewMenuTrigger() {
    return this.activitiesSelectTrigger({
      label: this.activityViewLabel(),
      icon: APP_STATIC_DATA.activitiesViewOptions.find((option) => option.key === this.activitiesView)?.icon ?? "view_agenda",
      palette: this.activitiesViewPalette(this.activitiesView),
      layout: "pill",
      collapsible: true
    });
  }
  activitiesViewMenuItems() {
    return APP_STATIC_DATA.activitiesViewOptions.map((option) => this.activitiesMenuItem({
      id: `view:${option.key}`,
      label: option.label,
      icon: option.icon,
      palette: this.activitiesViewPalette(option.key),
      active: option.key === this.activitiesView,
      context: { menu: "view", value: option.key }
    }));
  }
  activitiesQuickActionsMenuTrigger() {
    return {
      icon: "add",
      closeIcon: "close",
      ariaLabel: "Open event actions",
      hideLabel: true,
      layout: "icon",
      palette: "green"
    };
  }
  activitiesQuickActionsMenuItems() {
    return [
      {
        id: "quick-action:explore",
        label: "Explore",
        icon: "explore",
        palette: "violet",
        surface: "tinted",
        context: { menu: "quick-action", value: "explore" }
      },
      {
        id: "quick-action:create",
        label: "Create Event",
        icon: "add_circle",
        palette: "green",
        surface: "tinted",
        context: { menu: "quick-action", value: "create" }
      }
    ];
  }
  shouldShowStandaloneEventExploreAction() {
    return this.isEventActivitiesPrimaryFilter() && (this.activitiesEventScope === "all" || this.activitiesEventScope === "active-events");
  }
  activitiesSupportCaseFilters() {
    return [
      { key: "all", labelKey: "activities.support.case.filter.all", icon: "list" },
      { key: "pending", labelKey: "activities.support.case.filter.pending", icon: "pending_actions" },
      { key: "warned", labelKey: "activities.support.case.filter.warned", icon: "chat" },
      { key: "picked", labelKey: "activities.support.case.filter.picked", icon: "assignment_ind" },
      { key: "solved", labelKey: "activities.support.case.filter.solved", icon: "check_circle" },
      { key: "blocked", labelKey: "activities.support.case.filter.blocked", icon: "block" }
    ];
  }
  activitiesPrimaryFilters() {
    return [
      { key: "rates", label: "Rates", icon: "star" },
      { key: "chats", label: "Chats", icon: "chat" },
      { key: "events", label: "Events", icon: "event" }
    ];
  }
  activitiesEventScopeFilters() {
    return [
      { key: "all", label: "All", icon: "widgets" },
      { key: "active-events", label: "Active Events", icon: "event" },
      { key: "pending", label: "Pending", icon: "pending_actions" },
      { key: "invitations", label: "Invitations", icon: "mail" },
      { key: "my-events", label: "My Events", icon: "stadium" },
      { key: "drafts", label: "Drafts", icon: "drafts" },
      { key: "trash", label: "Trash", icon: "delete" }
    ];
  }
  supportCaseFilterLabelKey(filter = this.activitiesSupportCaseFilter) {
    return this.activitiesSupportCaseFilters().find((option) => option.key === filter)?.labelKey ?? "activities.support.case.filter.all";
  }
  supportCaseFilterIcon(filter = this.activitiesSupportCaseFilter) {
    return this.activitiesSupportCaseFilters().find((option) => option.key === filter)?.icon ?? "list";
  }
  activitiesPrimaryFilterLabel() {
    return this.activitiesPrimaryFilters().find((option) => option.key === this.activitiesPrimaryFilter)?.label ?? "Chats";
  }
  activitiesPrimaryFilterIcon() {
    return this.activitiesPrimaryFilters().find((option) => option.key === this.activitiesPrimaryFilter)?.icon ?? "chat";
  }
  activitiesPrimaryFilterCount(filter) {
    return this.countFrom(this.activitiesToolbarPrimaryCounts(), filter);
  }
  activitiesEventScopeIcon() {
    return this.activitiesEventScopeFilters().find((option) => option.key === this.activitiesEventScope)?.icon ?? "event";
  }
  activitiesEventScopeCount(scope = this.activitiesEventScope) {
    return this.countFrom(this.activitiesToolbarEventScopeCounts(), scope);
  }
  activitiesChatContextFilterLabel() {
    return APP_STATIC_DATA.activitiesChatContextFilters.find((option) => option.key === this.activitiesChatContextFilter)?.label ?? "All";
  }
  activitiesChatContextFilterIcon() {
    return APP_STATIC_DATA.activitiesChatContextFilters.find((option) => option.key === this.activitiesChatContextFilter)?.icon ?? "forum";
  }
  activitiesChatsHeaderLabel() {
    const primary = this.activitiesPrimaryFilterLabel();
    if (this.activitiesChatContextFilter === "all") {
      return primary;
    }
    return `${primary} \xB7 ${this.activitiesChatContextFilterLabel()}`;
  }
  activitiesSecondaryFilterLabel() {
    return this.activitiesSecondaryFilterOptionLabel(this.effectiveActivitiesSecondaryFilter());
  }
  activitiesSecondaryFilterOptionLabel(filter) {
    if (filter === "recent") {
      return this.activitiesPrimaryFilter === "rates" ? "Recent" : "Upcoming";
    }
    return APP_STATIC_DATA.activitiesSecondaryFilters.find((option) => option.key === filter)?.label ?? "Relevant";
  }
  activitiesSecondaryFilterIcon() {
    return APP_STATIC_DATA.activitiesSecondaryFilters.find((option) => option.key === this.effectiveActivitiesSecondaryFilter())?.icon ?? "schedule";
  }
  activitiesRateFilterLabel() {
    const label = this.rateFilterLabelForKey(this.activitiesRateFilter);
    if (!label) {
      return `${this.rateGroupLabelKeyForKey("individual-given")} \xB7 Given`;
    }
    const group = this.rateGroupLabelKeyForKey(this.activitiesRateFilter);
    return `${group} \xB7 ${label}`;
  }
  rateFilterOptionLabel(key) {
    return this.rateFilterLabelForKey(key);
  }
  rateGroupOptionLabelKey(label) {
    const normalized = label.trim().toLowerCase();
    if (normalized === "preferences") {
      return "activity.rates.group.preferences";
    }
    if (normalized === "suggestions") {
      return "activity.rates.group.suggestions";
    }
    return label;
  }
  activitiesRateFilterIcon(key = this.activitiesRateFilter) {
    const icons = {
      "individual-given": "north_east",
      "individual-received": "south_west",
      "individual-mutual": "sync_alt",
      "individual-met": "handshake",
      "pair-given": "group_add",
      "pair-received": "groups_2"
    };
    return icons[key] ?? "star";
  }
  shouldShowRateSocialBadgeToggle() {
    return this.activitiesPrimaryFilter === "rates";
  }
  shouldShowRateSocialBadgeToggleForGroup(label) {
    if (!this.shouldShowRateSocialBadgeToggle()) {
      return false;
    }
    const normalized = label.trim().toLowerCase();
    return normalized === "individual" || normalized === "pair" || normalized === "preferences" || normalized === "suggestions" || normalized === this.rateGroupLabelKeyForKey("individual-given") || normalized === this.rateGroupLabelKeyForKey("pair-given");
  }
  rateSocialBadgeButtonLabelForGroup(label) {
    return this.isRateSocialBadgeToggleActiveForGroup(label) ? "Social on" : "Social off";
  }
  rateSocialBadgeToggleIconForGroup(label) {
    return this.isRateSocialBadgeToggleActiveForGroup(label) ? "sell" : "sell_off";
  }
  rateSocialBadgeGroupIconForGroup(label) {
    return this.rateSocialGroupForLabel(label) === "pair" ? "groups_2" : "person";
  }
  isRateSocialBadgeToggleActiveForGroup(label) {
    const group = this.rateSocialGroupForLabel(label);
    return group === "pair" ? this.activitiesPairRateSocialBadgeEnabled : this.activitiesIndividualRateSocialBadgeEnabled;
  }
  rateFilterLabelForKey(key) {
    return APP_STATIC_DATA.rateFilters.find((option) => option.key === key)?.label ?? "Given";
  }
  rateGroupLabelKeyForKey(key) {
    return key.startsWith("individual") ? "activity.rates.group.preferences" : "activity.rates.group.suggestions";
  }
  activityViewLabel() {
    return APP_STATIC_DATA.activitiesViewOptions.find((option) => option.key === this.activitiesView)?.label ?? "View";
  }
  availableActivitiesSecondaryFilters() {
    return this.isEventActivitiesPrimaryFilter() ? APP_STATIC_DATA.activitiesSecondaryFilters.filter((option) => option.key !== "relevant") : APP_STATIC_DATA.activitiesSecondaryFilters;
  }
  activitiesSelectTrigger(options) {
    const counter = Math.max(0, Math.trunc(Number(options.counter) || 0));
    return {
      label: options.label,
      icon: options.icon,
      palette: options.palette,
      layout: options.layout ?? "pill",
      hideLabel: options.hideLabel,
      collapsible: options.collapsible,
      counter: counter > 0 ? { value: counter, max: 99 } : null
    };
  }
  activitiesMenuItem(options) {
    const counter = Math.max(0, Math.trunc(Number(options.counter) || 0));
    return {
      id: options.id,
      label: options.label,
      icon: options.icon,
      kind: "radio",
      active: options.active,
      palette: options.palette,
      surface: "tinted",
      counter: counter > 0 ? { value: counter, max: 99 } : null,
      context: options.context
    };
  }
  activitiesPrimaryPalette(filter) {
    switch (filter) {
      case "rates":
        return "gold";
      case "events":
        return "orange";
      case "hosting":
        return "green";
      case "invitations":
        return "violet";
      case "chats":
      default:
        return "blue";
    }
  }
  activitiesEventScopePalette(scope) {
    switch (scope) {
      case "trash":
        return "danger";
      case "drafts":
        return "slate";
      case "invitations":
        return "violet";
      case "my-events":
        return "green";
      case "pending":
        return "amber";
      case "all":
        return "blue";
      case "active-events":
      default:
        return "orange";
    }
  }
  activitiesChatContextPalette(filter) {
    switch (filter) {
      case "event":
        return "orange";
      case "subEvent":
        return "violet";
      case "group":
        return "green";
      case "service":
        return "slate";
      case "appSupport":
        return "blue";
      case "all":
      default:
        return "blue";
    }
  }
  activitiesViewPalette(view) {
    switch (view) {
      case "distance":
        return "teal";
      case "month":
        return "gold";
      case "week":
        return "green";
      case "day":
      default:
        return "blue";
    }
  }
  activitiesSecondaryPalette(filter) {
    switch (filter) {
      case "past":
        return "slate";
      case "relevant":
        return "violet";
      case "recent":
      default:
        return "blue";
    }
  }
  activitiesRatePalette(filter) {
    switch (filter) {
      case "individual-given":
        return "pink";
      case "individual-received":
        return "blue";
      case "individual-mutual":
        return "violet";
      case "individual-met":
        return "green";
      case "pair-given":
        return "brown";
      case "pair-received":
      default:
        return "success";
    }
  }
  supportCasePalette(filter) {
    switch (filter) {
      case "pending":
        return "amber";
      case "warned":
        return "gold";
      case "picked":
        return "blue";
      case "solved":
        return "green";
      case "blocked":
        return "danger";
      case "all":
      default:
        return "neutral";
    }
  }
  activitiesRateGroupPalette(label) {
    return this.rateSocialGroupForLabel(label) === "pair" ? "violet" : "blue";
  }
  countFrom(counts, key) {
    const value = Number(counts[key] ?? 0);
    if (!Number.isFinite(value)) {
      return 0;
    }
    return Math.max(0, Math.trunc(value));
  }
  activitiesToolbarPrimaryCounts() {
    return {
      chats: this.chatBadge,
      events: this.eventsBadge,
      rates: this.gameBadge
    };
  }
  activitiesToolbarEventScopeCounts() {
    return {
      all: this.allEventsScopeBadge,
      "active-events": this.eventsBadge,
      pending: this.pendingBadge,
      invitations: this.invitationsBadge,
      "my-events": this.hostingBadge,
      drafts: this.draftsBadge,
      trash: this.trashBadge
    };
  }
  activitiesToolbarChatContextCounts() {
    return this.chatContextUnreadCountsForActiveUser();
  }
  activitiesToolbarSupportCaseCounts() {
    return {
      all: this.supportCaseFilterCount("all"),
      pending: this.supportCaseFilterCount("pending"),
      warned: this.supportCaseFilterCount("warned"),
      picked: this.supportCaseFilterCount("picked"),
      solved: this.supportCaseFilterCount("solved"),
      blocked: this.supportCaseFilterCount("blocked")
    };
  }
  activitiesToolbarRateFilterCounts() {
    return APP_STATIC_DATA.rateFilters.reduce((counts, option) => {
      counts[option.key] = this.rateFilterCount(option.key);
      return counts;
    }, {});
  }
  activitiesChatContextFilterCount(filter) {
    if (this.activitiesPrimaryFilter !== "chats") {
      return 0;
    }
    return this.normalizeBadgeCounter(this.chatContextUnreadCountsForActiveUser()[filter]);
  }
  chatContextUnreadCountsForActiveUser() {
    if (this.activitiesPrimaryFilter !== "chats") {
      return this.emptyChatContextUnreadCounts();
    }
    const activeUserId = `${this.activeUser.id ?? ""}`.trim();
    const activeUser = this.userProfileStore.activeUserProfile();
    if (!activeUserId || !activeUser) {
      return this.emptyChatContextUnreadCounts();
    }
    const overrides = this.activityStore.getUserCounterOverrides(activeUserId);
    const profile = overrides.chat ?? activeUser.activities?.chat;
    return {
      all: this.normalizeBadgeCounter(profile?.all),
      event: this.normalizeBadgeCounter(profile?.event),
      subEvent: this.normalizeBadgeCounter(profile?.subEvent),
      group: this.normalizeBadgeCounter(profile?.group),
      service: this.normalizeBadgeCounter(profile?.service),
      appSupport: this.normalizeBadgeCounter(profile?.appSupport)
    };
  }
  emptyChatContextUnreadCounts() {
    return {
      all: 0,
      event: 0,
      subEvent: 0,
      group: 0,
      service: 0,
      appSupport: 0
    };
  }
  supportCaseFilterCount(filter) {
    const normalized = this.normalizeSupportCaseFilter(filter);
    const smartList = this.activitiesSmartList;
    const supportCases = (smartList?.itemsSnapshot() ?? []).map((row) => this.chatRecordFromSourceItem(smartList?.sourceItemSnapshot(this.activityRowIdentity(row)))).filter((chat) => Boolean(chat?.supportCase));
    if (normalized === "all") {
      return supportCases.length;
    }
    return supportCases.filter((chat) => this.normalizeSupportCaseFilter(chat.supportCase?.status ?? null) === normalized).length;
  }
  selectActivitiesSupportCaseFilter(filter) {
    if (!this.isAdminServiceChatMode()) {
      return;
    }
    const normalizedFilter = this.normalizeSupportCaseFilter(filter);
    const currentFilter = this.normalizeSupportCaseFilter(this.activitiesStore.activitiesSupportCaseFilter());
    if (currentFilter === normalizedFilter) {
      this.showActivitiesPrimaryPicker = false;
      this.showActivitiesEventScopePicker = false;
      this.showActivitiesChatContextPicker = false;
      this.showActivitiesRatePicker = false;
      this.showActivitiesQuickActionsMenu = false;
      return;
    }
    this.activitiesStore.setActivitiesSupportCaseFilter(normalizedFilter);
    this.showActivitiesPrimaryPicker = false;
    this.showActivitiesEventScopePicker = false;
    this.showActivitiesChatContextPicker = false;
    this.showActivitiesRatePicker = false;
    this.showActivitiesQuickActionsMenu = false;
    this.resetActivitiesScroll();
    this.cdr.markForCheck();
  }
  normalizeSupportCaseFilter(filter) {
    return filter === "pending" || filter === "warned" || filter === "picked" || filter === "solved" || filter === "blocked" ? filter : "all";
  }
  doesChatMatchActiveSupportCaseFilter(chat) {
    if (!this.isAdminServiceChatMode()) {
      return true;
    }
    const normalized = this.normalizeSupportCaseFilter(this.activitiesSupportCaseFilter);
    return normalized === "all" || this.normalizeSupportCaseFilter(chat.supportCase?.status ?? null) === normalized;
  }
  onSupportCaseAction(sourceItem, action) {
    if (!this.isAdminServiceChatMode()) {
      return;
    }
    const chat = this.chatRecordForSourceItem(sourceItem);
    if (!chat?.supportCase) {
      return;
    }
    const config = this.supportCaseActionDialogConfig(action);
    this.dialogStore.open({
      title: this.i18n(config.titleKey),
      message: this.i18n(config.messageKey),
      cancelLabel: this.i18n("cancel"),
      confirmLabel: this.i18n(config.confirmLabelKey),
      busyConfirmLabel: this.i18n(config.busyConfirmLabelKey),
      confirmTone: config.tone,
      failureMessage: this.i18n("activities.support.case.error.update"),
      onConfirm: async () => {
        const updated = await this.chatsService.updateSupportCase(chat, action);
        if (!updated) {
          throw new Error("The support case could not be updated.");
        }
        this.applySupportCaseUpdate(updated);
      }
    });
  }
  supportCaseActionDialogConfig(action) {
    if (action === "pick") {
      return {
        titleKey: "activities.support.case.confirm.pick.title",
        messageKey: "activities.support.case.confirm.pick.message",
        confirmLabelKey: "activities.support.case.action.pick",
        busyConfirmLabelKey: "activities.support.case.action.pick.busy",
        tone: "accent"
      };
    }
    if (action === "unpick") {
      return {
        titleKey: "activities.support.case.confirm.unpick.title",
        messageKey: "activities.support.case.confirm.unpick.message",
        confirmLabelKey: "activities.support.case.action.unpick",
        busyConfirmLabelKey: "activities.support.case.action.unpick.busy",
        tone: "neutral"
      };
    }
    if (action === "solve") {
      return {
        titleKey: "activities.support.case.confirm.solve.title",
        messageKey: "activities.support.case.confirm.solve.message",
        confirmLabelKey: "activities.support.case.action.solve",
        busyConfirmLabelKey: "activities.support.case.action.solve.busy",
        tone: "accent"
      };
    }
    if (action === "block") {
      return {
        titleKey: "activities.support.case.confirm.block.title",
        messageKey: "activities.support.case.confirm.block.message",
        confirmLabelKey: "activities.support.case.action.block",
        busyConfirmLabelKey: "activities.support.case.action.block.busy",
        tone: "danger"
      };
    }
    return {
      titleKey: "activities.support.case.confirm.reopen.title",
      messageKey: "activities.support.case.confirm.reopen.message",
      confirmLabelKey: "activities.support.case.action.reopen",
      busyConfirmLabelKey: "activities.support.case.action.reopen.busy",
      tone: "accent"
    };
  }
  i18n(key) {
    return this.i18nService.translate(key);
  }
  applySupportCaseUpdate(chat) {
    const nextChat = this.cloneChatRecord(chat);
    const smartList = this.activitiesSmartList;
    if (smartList && this.activitiesPrimaryFilter === "chats" && !this.isCalendarLayoutView()) {
      if (this.doesChatMatchActiveContextFilter(nextChat)) {
        smartList.patchConvertedVisibleItem(nextChat);
      } else {
        smartList.removeVisibleItemByIdentity(`chats:${nextChat.id}`);
      }
    }
    this.refreshSectionBadges();
    this.cdr.markForCheck();
  }
  applyActivityChatMetricBucketPatch(patch) {
    const smartList = this.activitiesSmartList;
    if (!smartList || this.activitiesPrimaryFilter !== "chats" || this.isCalendarLayoutView()) {
      return;
    }
    const sourceChat = this.chatRecordFromSourceItem(smartList.sourceItemSnapshot(patch.identity));
    if (!sourceChat) {
      return;
    }
    const nextChat = this.cloneChatRecord(sourceChat);
    nextChat.metrics = this.chatMetricsWithBucket(nextChat.metrics, patch);
    if (this.doesChatMatchActiveContextFilter(nextChat)) {
      smartList.patchConvertedVisibleItem(nextChat);
    } else {
      smartList.removeVisibleItemByIdentity(patch.identity);
    }
    this.refreshSectionBadges();
  }
  applyActivityEventRuntimeSync(sync) {
    const smartList = this.activitiesSmartList;
    const eventId = `${sync.eventId ?? ""}`.trim();
    if (!smartList || !eventId) {
      return;
    }
    const source = smartList.sourceItemsSnapshot().find((item) => Boolean(item) && typeof item === "object" && `${item.id ?? ""}`.trim() === eventId) ?? null;
    if (!source) {
      return;
    }
    smartList.patchConvertedVisibleItem(__spreadProps(__spreadValues({}, source), {
      activity: Math.max(0, Math.trunc(Number(source.activity) || 0) + Math.trunc(Number(sync.activityDelta) || 0)),
      currentStage: sync.currentStage === void 0 ? source.currentStage : sync.currentStage ? __spreadValues({}, sync.currentStage) : null
    }), {
      predicate: (row) => this.isEventStyleActivity(row) && row.id === eventId
    });
    this.refreshSectionBadges();
  }
  resolveActivityEventCardTypeFromDTO(dto) {
    if (dto.type === "invitations") {
      return "invitations";
    }
    if (this.activityEventDTOIsAdmin(dto)) {
      return "hosting";
    }
    return dto.type === "hosting" ? "hosting" : "events";
  }
  convertActivitySmartListItem(source, query) {
    const primaryFilter = query.filters?.primaryFilter ?? this.activitiesPrimaryFilter;
    const eventScope = query.filters?.eventScopeFilter ?? this.activitiesEventScope;
    if (primaryFilter === "rates") {
      return ActivityRateImageCardConverter.convert(source, {
        ratedUsers: query.context?.rateUsers ?? [],
        order: resolveActivityRateOrder(query)
      });
    }
    if (primaryFilter === "events" || primaryFilter === "hosting" || primaryFilter === "invitations") {
      return ActivityEventInfoCardConverter.convert(source, this.activityEventInfoCardConverterOptions(eventScope));
    }
    return ActivityChatSingleRowConverter.convert(source, {
      activeUser: this.activeUser,
      resolveUserById: (userId) => this.usersService.peekCachedUserById(userId),
      adminServiceMode: query.filters?.adminServiceOnly === true,
      translate: (key) => this.i18nService.translate(key)
    });
  }
  convertActivitySmartListItems(sources, query) {
    const primaryFilter = query.filters?.primaryFilter ?? this.activitiesPrimaryFilter;
    const eventScope = query.filters?.eventScopeFilter ?? this.activitiesEventScope;
    if (primaryFilter === "rates") {
      return ActivityRateImageCardConverter.convertList(sources, {
        ratedUsers: query.context?.rateUsers ?? [],
        order: resolveActivityRateOrder(query)
      });
    }
    if (primaryFilter === "events" || primaryFilter === "hosting" || primaryFilter === "invitations") {
      return ActivityEventInfoCardConverter.convertList(sources, this.activityEventInfoCardConverterOptions(eventScope));
    }
    return ActivityChatSingleRowConverter.convertList(sources, {
      activeUser: this.activeUser,
      resolveUserById: (userId) => this.usersService.peekCachedUserById(userId),
      adminServiceMode: query.filters?.adminServiceOnly === true,
      translate: (key) => this.i18nService.translate(key)
    });
  }
  activityEventInfoCardConverterOptions(eventScope = this.activitiesEventScope) {
    return {
      activeUserId: this.activeUser.id,
      trashView: eventScope === "trash",
      translateParams: (key, values, fallback) => this.i18nService.translateParams(key, values, fallback)
    };
  }
  chatRowMetricScore(row) {
    const chatRow = row;
    return Number.isFinite(chatRow.sortScore) ? Math.max(0, Number(chatRow.sortScore)) : Math.max(0, Math.trunc(Number(chatRow.unread) || 0)) * 10 + Math.max(0, Math.trunc(Number(chatRow.memberCount) || 0));
  }
  cloneChatRecord(chat) {
    return __spreadProps(__spreadValues({}, chat), {
      memberIds: [...chat.memberIds ?? []],
      members: (chat.members ?? []).map((member) => __spreadValues({}, member)),
      supportCase: this.cloneChatSupportCase(chat.supportCase),
      metrics: this.cloneChatMetrics(chat.metrics)
    });
  }
  chatRecordForSourceItem(sourceItem) {
    const sourceChat = this.chatRecordFromSourceItem(sourceItem);
    return sourceChat ? this.cloneChatRecord(sourceChat) : null;
  }
  chatRecordFromSourceItem(sourceItem) {
    const candidate = sourceItem;
    if (!candidate || typeof candidate !== "object") {
      return null;
    }
    const chat = candidate;
    return typeof chat.id === "string" && Array.isArray(chat.memberIds) && typeof chat.lastMessage === "string" ? chat : null;
  }
  supportStatusFromRowStatus(status) {
    return status === "pending" || status === "warned" || status === "picked" || status === "solved" || status === "blocked" ? status : null;
  }
  cloneChatSupportCase(supportCase) {
    if (!supportCase) {
      return supportCase;
    }
    return __spreadProps(__spreadValues({}, supportCase), {
      assignee: supportCase.assignee ? __spreadValues({}, supportCase.assignee) : supportCase.assignee
    });
  }
  cloneChatMetrics(metrics) {
    return metrics ? {
      members: metrics.members ? __spreadValues({}, metrics.members) : null,
      transport: metrics.transport ? __spreadValues({}, metrics.transport) : null,
      accommodation: metrics.accommodation ? __spreadValues({}, metrics.accommodation) : null,
      supplies: metrics.supplies ? __spreadValues({}, metrics.supplies) : null,
      groupsCount: metrics.groupsCount ?? null,
      pendingTotal: Math.max(0, Math.trunc(Number(metrics.pendingTotal) || 0))
    } : metrics;
  }
  chatMetricsWithBucket(metrics, patch) {
    const next = this.cloneChatMetrics(metrics) ?? {
      members: null,
      transport: null,
      accommodation: null,
      supplies: null,
      groupsCount: null,
      pendingTotal: 0
    };
    next[patch.bucketType] = __spreadValues({}, patch.bucket);
    next.pendingTotal = this.chatMetricPendingTotal(next);
    return next;
  }
  chatMetricPendingTotal(metrics) {
    return ["members", "transport", "accommodation", "supplies"].reduce((sum, key) => sum + Math.max(0, Math.trunc(Number(metrics[key]?.pending) || 0)), 0);
  }
  syncActivityEventMetadata(item) {
    if (item.startAtIso) {
      this.activityDateTimeRangeById[item.id] = {
        startIso: item.startAtIso,
        endIso: item.endAtIso ?? item.startAtIso
      };
    }
    this.eventDatesById[item.id] = item.startAtIso;
    this.hostingDatesById[item.id] = item.startAtIso;
    this.eventDistanceById[item.id] = item.distanceKm;
    this.hostingDistanceById[item.id] = item.distanceKm;
    if (this.activityEventStatusCode(item) === "T") {
      const row = ActivityEventInfoCardConverter.convert(item, this.activityEventInfoCardConverterOptions());
      this.trashedActivityRowsByKey[this.activityRowIdentity(row)] = row;
    } else {
      delete this.trashedActivityRowsByKey[`events:${item.id}`];
      delete this.trashedActivityRowsByKey[`hosting:${item.id}`];
      delete this.trashedActivityRowsByKey[`invitations:${item.id}`];
    }
    if (item.imageUrl?.trim()) {
      this.activityImageById[item.id] = item.imageUrl;
    } else {
      delete this.activityImageById[item.id];
    }
    this.activityCapacityById[item.id] = `${item.acceptedMembers} / ${item.capacityTotal}`;
    this.activityPendingMembersById[item.id] = item.pendingMembers;
    this.eventVisibilityById[item.id] = item.visibility;
    this.eventCapacityById[item.id] = { min: item.capacityMin ?? null, max: item.capacityMax ?? null };
  }
  applyActivityEventDTO(update) {
    const existingDTO = this.eventsService.peekKnownItemById(this.activeUser.id, update.id);
    const nextDTO = existingDTO ? this.patchActivityEventDTO(existingDTO, update) : this.cloneActivityEventDTO(update);
    this.syncActivityEventMetadata(nextDTO);
    return nextDTO;
  }
  cloneActivityEventDTO(item) {
    return __spreadProps(__spreadValues({}, item), {
      adminIds: [...item.adminIds ?? []],
      acceptedMemberUserIds: [...item.acceptedMemberUserIds ?? []],
      pendingMemberUserIds: [...item.pendingMemberUserIds ?? []],
      invitedMemberUserIds: [...item.invitedMemberUserIds ?? []],
      pendingRequestMemberUserIds: [...item.pendingRequestMemberUserIds ?? []]
    });
  }
  patchActivityEventDTO(item, update) {
    const acceptedMembers = Math.max(0, Math.trunc(Number(update.acceptedMembers ?? item.acceptedMembers) || 0));
    const pendingMembers = Math.max(0, Math.trunc(Number(update.pendingMembers ?? item.pendingMembers) || 0));
    const capacityTotal = Math.max(acceptedMembers, Math.max(0, Math.trunc(Number(update.capacityTotal ?? item.capacityTotal) || 0)));
    return this.cloneActivityEventDTO(__spreadProps(__spreadValues(__spreadValues({}, item), update), {
      endAtIso: update.endAtIso ?? (update.startAtIso ? update.startAtIso : item.endAtIso),
      acceptedMembers,
      pendingMembers,
      capacityTotal
    }));
  }
  upsertVisibleEventRowFromSync(sync, options = {}) {
    if (!this.isEventActivitiesPrimaryFilter() || this.activitiesView === "week" || this.activitiesView === "month") {
      return;
    }
    const smartList = this.activitiesSmartList;
    if (!smartList) {
      return;
    }
    const shouldShow = this.activityEventSyncMatchesCurrentScope(sync);
    const removedExisting = smartList.removeVisibleItems((row) => this.activityEventSyncMatchesVisibleRow(row, sync), { totalDelta: shouldShow ? 0 : -1 });
    if (!shouldShow) {
      return;
    }
    smartList.upsertConvertedVisibleItem(sync, {
      predicate: (row) => this.activityEventSyncMatchesVisibleRow(row, sync),
      totalDelta: removedExisting ? 0 : 1,
      loadedRange: options.loadedRange
    });
  }
  activityEventSyncMatchesVisibleRow(row, sync) {
    if (!this.isEventStyleActivity(row)) {
      return false;
    }
    const eventId = `${sync.id ?? ""}`.trim();
    if (!eventId) {
      return false;
    }
    const rowIdentity = this.activityRowIdentity(row);
    return row.id === eventId || rowIdentity === eventId || rowIdentity === `events:${eventId}` || rowIdentity === `hosting:${eventId}` || rowIdentity === `invitations:${eventId}`;
  }
  activityEventSyncMatchesCurrentScope(sync) {
    const status = this.activityEventStatusCode(sync);
    const activeUserId = this.activeUser.id.trim();
    const isTrashed = status === "T";
    const isAdmin = this.activityEventDTOIsAdmin(sync);
    const isInvited = activeUserId.length > 0 && (sync.invitedMemberUserIds ?? []).includes(activeUserId);
    const isAccepted = activeUserId.length > 0 && (sync.acceptedMemberUserIds ?? []).includes(activeUserId);
    const isPending = activeUserId.length > 0 && (sync.pendingRequestMemberUserIds ?? []).includes(activeUserId);
    const isPendingReview = status === "UR" || status === "B";
    if (this.activitiesEventScope === "trash") {
      return isTrashed;
    }
    if (isTrashed) {
      return false;
    }
    switch (this.activitiesEventScope) {
      case "all":
        return isAdmin || isInvited || isAccepted || isPending;
      case "pending":
        return isAdmin && isPendingReview || !isAdmin && isPending;
      case "invitations":
        return isInvited;
      case "my-events":
        return isAdmin;
      case "drafts":
        return isAdmin && status === "DR";
      case "active-events":
      default:
        return !isAdmin && !isInvited && isAccepted && !isPendingReview;
    }
  }
  activityRowLocalSortKey(row) {
    if (this.activitiesPrimaryFilter === "chats" && !this.isCalendarLayoutView()) {
      return this.chatRowLocalSortKey(row);
    }
    if (this.isEventActivitiesPrimaryFilter() && !this.isCalendarLayoutView()) {
      return this.eventRowLocalSortKey(row);
    }
    return row.localSortKey ?? [this.activityRowIdentity(row)];
  }
  chatRowLocalSortKey(row) {
    const secondaryFilter = this.effectiveActivitiesSecondaryFilter();
    const timestamp = AppUtils.toSortableDate(row.dateIso ?? "");
    if (secondaryFilter === "relevant") {
      return [
        -this.chatRowMetricScore(row),
        -timestamp,
        this.activityRowIdentity(row)
      ];
    }
    return [
      -timestamp,
      this.activityRowIdentity(row)
    ];
  }
  eventRowLocalSortKey(row) {
    const secondaryFilter = this.effectiveActivitiesSecondaryFilter();
    if (this.activitiesView === "distance") {
      if (secondaryFilter === "relevant") {
        return [
          this.activityRowDistanceOrderValue(row),
          -this.activityRowBoostOrderValue(row),
          -this.activityRowTimestampOrderValue(row),
          this.activityRowIdentity(row)
        ];
      }
      return [
        this.activityRowDistanceOrderValue(row),
        -this.activityRowTimestampOrderValue(row),
        this.activityRowIdentity(row)
      ];
    }
    if (secondaryFilter === "relevant") {
      return [
        this.activityRowDayOrderValue(row),
        -this.activityRowBoostOrderValue(row),
        -this.activityRowTimestampOrderValue(row),
        this.activityRowIdentity(row)
      ];
    }
    if (secondaryFilter === "past") {
      return [
        -this.activityRowDayOrderValue(row),
        -this.activityRowTimestampOrderValue(row),
        this.activityRowIdentity(row)
      ];
    }
    return [
      this.activityRowDayOrderValue(row),
      this.activityRowTimestampOrderValue(row),
      this.activityRowIdentity(row)
    ];
  }
  activityRowDistanceOrderValue(row) {
    return row.distanceMetersExact ?? 0;
  }
  activityRowBoostOrderValue(row) {
    const sourceBoost = Number(this.isEventStyleActivity(row) ? this.eventsService.peekKnownItemById(this.activeUser.id, row.id)?.boost : row.sortScore);
    if (Number.isFinite(sourceBoost)) {
      return Math.max(0, sourceBoost);
    }
    return Math.max(0, Number(row.sortScore) || 0);
  }
  activityRowTimestampOrderValue(row) {
    const startAtIso = this.isEventStyleActivity(row) ? this.eventsService.peekKnownItemById(this.activeUser.id, row.id)?.startAtIso : null;
    return AppUtils.toSortableDate(startAtIso ?? row.dateIso ?? "");
  }
  activityRowDayOrderValue(row) {
    const timestamp = this.activityRowTimestampOrderValue(row);
    if (!Number.isFinite(timestamp)) {
      return 0;
    }
    return AppUtils.dateOnly(new Date(timestamp)).getTime();
  }
  refreshSectionBadges() {
    this.cdr.markForCheck();
  }
  activityEventStatusCode(item) {
    const status = `${item.status ?? ""}`.trim();
    switch (status) {
      case "DR":
      case "T":
      case "UR":
      case "B":
      case "D":
      case "I":
        return status;
      default:
        return "A";
    }
  }
  activityEventDTOIsAdmin(item) {
    const activeUserId = this.activeUser?.id?.trim() ?? "";
    return !!activeUserId && (`${item?.creatorUserId ?? ""}`.trim() === activeUserId || (item?.adminIds ?? []).includes(activeUserId));
  }
  isOwnedActivityEventSync(sync) {
    const activeUserId = this.activeUser?.id?.trim() ?? "";
    if (!activeUserId) {
      return false;
    }
    return `${sync.creatorUserId ?? ""}`.trim() === activeUserId || (sync.adminIds ?? []).includes(activeUserId);
  }
  syncMobileViewFromViewport() {
    if (typeof window === "undefined") {
      this.isMobileView = false;
      return;
    }
    const next = window.innerWidth <= 760;
    if (next === this.isMobileView) {
      return;
    }
    this.isMobileView = next;
    this.cdr.markForCheck();
  }
  // =========================================================================
  // Close
  // =========================================================================
  closeActivitiesPopup() {
    this.activitiesStore.closeActivities();
  }
  // =========================================================================
  // Derived lists (computed on demand – no signals here for compat)
  // =========================================================================
  get filteredActivityRows() {
    return [...this.activitiesSmartList?.itemsSnapshot() ?? []];
  }
  // =========================================================================
  // Template helpers – toolbar
  // =========================================================================
  isEventActivitiesPrimaryFilter() {
    return this.activitiesPrimaryFilter === "events";
  }
  activitiesEventScopeLabel() {
    switch (this.activitiesEventScope) {
      case "all":
        return "All";
      case "pending":
        return "Pending";
      case "invitations":
        return "Invitations";
      case "my-events":
        return "My Events";
      case "drafts":
        return "Drafts";
      case "trash":
        return "Trash";
      case "active-events":
      default:
        return "Active Events";
    }
  }
  shouldShowRatesFullscreenToggle() {
    return this.activitiesPrimaryFilter === "rates" && !this.isCalendarLayoutView();
  }
  isRatesFullscreenModeActive() {
    return this.activitiesRates.isFullscreenModeActive();
  }
  activitiesSmartListPresentation() {
    return this.activitiesRates.isFullscreenModeActive() ? "fullscreen" : "list";
  }
  isCalendarLayoutView() {
    return this.activitiesView === "month" || this.activitiesView === "week";
  }
  effectiveActivitiesSecondaryFilter() {
    return this.isEventActivitiesPrimaryFilter() && this.activitiesSecondaryFilter === "relevant" ? "recent" : this.activitiesSecondaryFilter;
  }
  rateFilterCount(filter) {
    return this.ratesService.peekRateItemsByUser(this.activeUser.id).filter((item) => this.activitiesRates.matchesFilter(item, filter)).length;
  }
  toggleRateSocialBadgeForGroup(labelOrGroup) {
    const group = this.rateSocialGroupForLabel(labelOrGroup);
    const nextEnabled = group === "pair" ? !this.activitiesPairRateSocialBadgeEnabled : !this.activitiesIndividualRateSocialBadgeEnabled;
    if (group === "pair") {
      this.activitiesPairRateSocialBadgeEnabled = nextEnabled;
    } else {
      this.activitiesIndividualRateSocialBadgeEnabled = nextEnabled;
    }
    if (this.activitiesRateFilter.startsWith(group)) {
      this.activitiesRateSocialBadgeEnabled = nextEnabled;
    }
    this.activitiesStore.setActivitiesRateSocialBadgeEnabledForGroup(group, nextEnabled);
    if (this.activitiesRateFilter.startsWith(group)) {
      this.lastRateIndicatorPulseRowId = null;
      this.selectedActivityRateId = null;
      this.activitiesStore.setActivitiesSelectedRateId(null);
      this.resetActivitiesScroll();
      this.syncActivitiesSmartListQuery();
      this.activitiesSmartList?.reload();
    }
    this.cdr.markForCheck();
  }
  rateSocialGroupForLabel(labelOrGroup) {
    const normalized = labelOrGroup.trim().toLowerCase();
    if (normalized === "pair" || normalized === "suggestions" || normalized === "activity.rates.group.suggestions") {
      return "pair";
    }
    return "individual";
  }
  isHostingPublicationFilterVisible() {
    return false;
  }
  shouldShowActivitiesQuickActions() {
    return this.isEventActivitiesPrimaryFilter() && this.activitiesEventScope !== "all" && this.activitiesEventScope !== "active-events" && this.activitiesEventScope !== "pending" && this.activitiesEventScope !== "invitations" && this.activitiesEventScope !== "trash";
  }
  selectActivitiesPrimaryFilter(filter) {
    const currentFilter = this.activitiesStore.activitiesPrimaryFilter();
    if (currentFilter === filter) {
      this.showActivitiesPrimaryPicker = false;
      this.showActivitiesEventScopePicker = false;
      this.showActivitiesChatContextPicker = false;
      this.showActivitiesRatePicker = false;
      this.showActivitiesQuickActionsMenu = false;
      return;
    }
    if (filter !== "rates") {
      this.activitiesRates.disableFullscreenMode();
    }
    this.activitiesStore.setActivitiesPrimaryFilter(filter);
    if (filter === "events" && this.activitiesSecondaryFilter === "relevant") {
      this.activitiesStore.setActivitiesSecondaryFilter("recent");
    }
    this.lastRateIndicatorPulseRowId = null;
    this.showActivitiesPrimaryPicker = false;
    this.showActivitiesEventScopePicker = false;
    this.showActivitiesChatContextPicker = false;
    this.showActivitiesRatePicker = false;
    this.showActivitiesQuickActionsMenu = false;
    this.resetActivitiesScroll();
    this.cdr.markForCheck();
  }
  toggleActivitiesEventScopePicker(event) {
    if (!this.isEventActivitiesPrimaryFilter()) {
      return;
    }
    event.stopPropagation();
    this.showActivitiesPrimaryPicker = false;
    this.showActivitiesChatContextPicker = false;
    this.showActivitiesRatePicker = false;
    this.showActivitiesViewPicker = false;
    this.showActivitiesSecondaryPicker = false;
    this.showActivitiesQuickActionsMenu = false;
    this.showActivitiesEventScopePicker = !this.showActivitiesEventScopePicker;
  }
  selectActivitiesEventScope(scope) {
    const currentScope = this.activitiesStore.activitiesEventScope();
    if (!this.isEventActivitiesPrimaryFilter() || currentScope === scope) {
      this.showActivitiesEventScopePicker = false;
      return;
    }
    this.activitiesStore.setActivitiesEventScope(scope);
    this.lastRateIndicatorPulseRowId = null;
    this.showActivitiesPrimaryPicker = false;
    this.showActivitiesEventScopePicker = false;
    this.showActivitiesChatContextPicker = false;
    this.showActivitiesRatePicker = false;
    this.showActivitiesQuickActionsMenu = false;
    this.resetActivitiesScroll();
    this.cdr.markForCheck();
  }
  selectActivitiesChatContextFilter(filter) {
    if (this.activitiesPrimaryFilter !== "chats") {
      return;
    }
    const currentFilter = this.activitiesStore.activitiesChatContextFilter();
    if (currentFilter === filter) {
      this.showActivitiesChatContextPicker = false;
      this.showActivitiesPrimaryPicker = false;
      this.showActivitiesEventScopePicker = false;
      this.showActivitiesRatePicker = false;
      this.showActivitiesQuickActionsMenu = false;
      return;
    }
    this.activitiesStore.setActivitiesChatContextFilter(filter);
    this.showActivitiesChatContextPicker = false;
    this.showActivitiesPrimaryPicker = false;
    this.showActivitiesEventScopePicker = false;
    this.showActivitiesRatePicker = false;
    this.showActivitiesQuickActionsMenu = false;
    this.resetActivitiesScroll();
    this.cdr.markForCheck();
  }
  selectHostingPublicationFilter(filter) {
    if (!this.isHostingPublicationFilterVisible() || this.hostingPublicationFilter === filter) {
      return;
    }
    this.activitiesStore.setActivitiesHostingPublicationFilter(filter);
    this.resetActivitiesScroll();
    this.cdr.markForCheck();
  }
  selectActivitiesSecondaryFilter(filter) {
    const normalizedFilter = this.isEventActivitiesPrimaryFilter() && filter === "relevant" ? "recent" : filter;
    const currentFilter = this.activitiesStore.activitiesSecondaryFilter();
    if (currentFilter === normalizedFilter) {
      this.showActivitiesPrimaryPicker = false;
      this.showActivitiesEventScopePicker = false;
      this.showActivitiesChatContextPicker = false;
      this.showActivitiesRatePicker = false;
      this.showActivitiesQuickActionsMenu = false;
      return;
    }
    this.activitiesStore.setActivitiesSecondaryFilter(normalizedFilter);
    this.lastRateIndicatorPulseRowId = null;
    this.showActivitiesPrimaryPicker = false;
    this.showActivitiesEventScopePicker = false;
    this.showActivitiesChatContextPicker = false;
    this.showActivitiesRatePicker = false;
    this.showActivitiesQuickActionsMenu = false;
    this.resetActivitiesScroll();
    this.cdr.markForCheck();
  }
  selectActivitiesRateFilter(filter) {
    const currentFilter = this.activitiesStore.activitiesRateFilter();
    if (currentFilter === filter) {
      this.showActivitiesPrimaryPicker = false;
      this.showActivitiesEventScopePicker = false;
      this.showActivitiesChatContextPicker = false;
      this.showActivitiesSecondaryPicker = false;
      this.showActivitiesRatePicker = false;
      this.showActivitiesQuickActionsMenu = false;
      return;
    }
    this.activitiesStore.setActivitiesRateFilter(filter);
    this.lastRateIndicatorPulseRowId = null;
    this.selectedActivityRateId = null;
    this.activitiesStore.setActivitiesSelectedRateId(null);
    this.showActivitiesPrimaryPicker = false;
    this.showActivitiesEventScopePicker = false;
    this.showActivitiesChatContextPicker = false;
    this.showActivitiesSecondaryPicker = false;
    this.showActivitiesRatePicker = false;
    this.showActivitiesQuickActionsMenu = false;
    this.resetActivitiesScroll();
    this.cdr.markForCheck();
  }
  toggleActivitiesViewPicker(event) {
    event.stopPropagation();
    if (this.activitiesPrimaryFilter === "chats") {
      return;
    }
    this.showActivitiesPrimaryPicker = false;
    this.showActivitiesEventScopePicker = false;
    this.showActivitiesChatContextPicker = false;
    this.showActivitiesRatePicker = false;
    this.showActivitiesQuickActionsMenu = false;
    this.activitiesStore.toggleActivitiesViewPicker();
  }
  toggleActivitiesSecondaryPicker(event) {
    event.stopPropagation();
    if (this.activitiesPrimaryFilter === "chats") {
      return;
    }
    this.showActivitiesPrimaryPicker = false;
    this.showActivitiesEventScopePicker = false;
    this.showActivitiesChatContextPicker = false;
    this.showActivitiesRatePicker = false;
    this.showActivitiesQuickActionsMenu = false;
    this.activitiesStore.toggleActivitiesSecondaryPicker();
  }
  setActivitiesView(view, event) {
    event?.stopPropagation();
    const currentView = this.activitiesStore.activitiesView();
    if (currentView === view) {
      this.showActivitiesViewPicker = false;
      this.showActivitiesSecondaryPicker = false;
      this.showActivitiesPrimaryPicker = false;
      this.showActivitiesEventScopePicker = false;
      this.showActivitiesChatContextPicker = false;
      this.showActivitiesRatePicker = false;
      this.showActivitiesQuickActionsMenu = false;
      return;
    }
    if (view !== "distance") {
      this.activitiesRates.disableFullscreenMode();
    }
    this.activitiesStore.setActivitiesView(view);
    this.lastRateIndicatorPulseRowId = null;
    this.showActivitiesViewPicker = false;
    this.showActivitiesSecondaryPicker = false;
    this.showActivitiesPrimaryPicker = false;
    this.showActivitiesEventScopePicker = false;
    this.showActivitiesChatContextPicker = false;
    this.showActivitiesRatePicker = false;
    this.showActivitiesQuickActionsMenu = false;
    this.resetActivitiesScroll();
    this.cdr.markForCheck();
  }
  toggleActivitiesQuickActionsMenu(event) {
    if (!this.shouldShowActivitiesQuickActions()) {
      return;
    }
    event.stopPropagation();
    this.showActivitiesPrimaryPicker = false;
    this.showActivitiesEventScopePicker = false;
    this.showActivitiesChatContextPicker = false;
    this.showActivitiesRatePicker = false;
    this.showActivitiesViewPicker = false;
    this.showActivitiesSecondaryPicker = false;
    this.showActivitiesQuickActionsMenu = !this.showActivitiesQuickActionsMenu;
  }
  openMobileActivitiesPrimaryFilterSelector(event) {
    if (!this.isMobileView) {
      return;
    }
    event.stopPropagation();
    this.showActivitiesEventScopePicker = false;
    this.showActivitiesChatContextPicker = false;
    this.showActivitiesRatePicker = false;
    this.showActivitiesViewPicker = false;
    this.showActivitiesSecondaryPicker = false;
    this.showActivitiesQuickActionsMenu = false;
    this.showActivitiesPrimaryPicker = !this.showActivitiesPrimaryPicker;
  }
  openMobileActivitiesEventScopeSelector(event) {
    if (!this.isMobileView || !this.isEventActivitiesPrimaryFilter()) {
      return;
    }
    event.stopPropagation();
    this.showActivitiesPrimaryPicker = false;
    this.showActivitiesChatContextPicker = false;
    this.showActivitiesRatePicker = false;
    this.showActivitiesViewPicker = false;
    this.showActivitiesSecondaryPicker = false;
    this.showActivitiesQuickActionsMenu = false;
    this.showActivitiesEventScopePicker = !this.showActivitiesEventScopePicker;
  }
  openMobileActivitiesChatContextFilterSelector(event) {
    if (!this.isMobileView || this.activitiesPrimaryFilter !== "chats") {
      return;
    }
    event.stopPropagation();
    this.showActivitiesPrimaryPicker = false;
    this.showActivitiesEventScopePicker = false;
    this.showActivitiesRatePicker = false;
    this.showActivitiesViewPicker = false;
    this.showActivitiesSecondaryPicker = false;
    this.showActivitiesQuickActionsMenu = false;
    this.showActivitiesChatContextPicker = !this.showActivitiesChatContextPicker;
  }
  openMobileActivitiesRateFilterSelector(event) {
    event.stopPropagation();
    if (!this.isMobileView || this.activitiesPrimaryFilter !== "rates") {
      return;
    }
    this.showActivitiesPrimaryPicker = false;
    this.showActivitiesEventScopePicker = false;
    this.showActivitiesChatContextPicker = false;
    this.showActivitiesViewPicker = false;
    this.showActivitiesSecondaryPicker = false;
    this.showActivitiesQuickActionsMenu = false;
    this.showActivitiesRatePicker = !this.showActivitiesRatePicker;
  }
  requestOpenEventEditor() {
    const target = this.isEventActivitiesPrimaryFilter() ? this.activitiesEventScope === "my-events" || this.activitiesEventScope === "drafts" ? "hosting" : "events" : "events";
    this.showActivitiesQuickActionsMenu = false;
    this.memberMenuStore.requestActivitiesNavigation({
      type: "eventEditorCreate",
      target
    });
  }
  requestOpenEventEditorForRow(row, readOnly = false, stacked = true) {
    void stacked;
    this.openActivityRowInEventModule(row, readOnly);
  }
  requestOpenEventExplore() {
    this.showActivitiesQuickActionsMenu = false;
    this.memberMenuStore.requestActivitiesNavigation({ type: "eventExplore" });
  }
  // =========================================================================
  // Row rendering helpers
  // =========================================================================
  get activitiesEmptyLabel() {
    if (this.activitiesPrimaryFilter === "rates") {
      return "No rate interactions for this filter yet.";
    }
    if (this.activitiesEventScope === "drafts") {
      return "No drafts in My Events yet.";
    }
    if (this.isEventActivitiesPrimaryFilter()) {
      if (this.activitiesEventScope === "trash") {
        return "Trash is empty.";
      }
      if (this.activitiesEventScope === "all") {
        return "No event activity items in this filter.";
      }
      return `No ${this.activitiesEventScopeLabel().toLowerCase()} items in this filter.`;
    }
    return `No ${this.activitiesPrimaryFilter} items in this filter.`;
  }
  trackByActivityGroup(_index, group) {
    return group.label;
  }
  trackByActivityRow(_index, row) {
    return this.activityRowIdentity(row);
  }
  trackByRateCardImage(_index, imageUrl) {
    return imageUrl;
  }
  activitiesRateCardRevisionForRow(row) {
    const rowRevision = row ? this.activityRateCardRevisionByRowId[row.id] ?? 0 : 0;
    return `${this.activitiesRateCardRevision}:${rowRevision}`;
  }
  activitiesSmartListClassMap() {
    return {
      "experience-card-list": true,
      "assets-card-list": true
    };
  }
  isEventStyleActivity(row) {
    return this.isEventActivitiesPrimaryFilter() || !!this.eventsService.peekKnownItemById(this.activeUser.id, row.id);
  }
  activityEventDTOForRow(row) {
    const visibleSource = this.activitiesSmartList?.sourceItemSnapshot(this.activityRowIdentity(row));
    if (this.isActivityEventDTOSource(visibleSource, row.id)) {
      return visibleSource;
    }
    return this.activityEventDTOById(row.id);
  }
  activityEventDTOById(eventId) {
    const normalizedEventId = eventId.trim();
    if (!normalizedEventId) {
      return null;
    }
    const visibleSource = this.activitiesSmartList?.sourceItemsSnapshot().find((source) => this.isActivityEventDTOSource(source, normalizedEventId));
    if (this.isActivityEventDTOSource(visibleSource, normalizedEventId)) {
      return visibleSource;
    }
    return this.eventsService.peekKnownItemById(this.activeUser.id, normalizedEventId) ?? null;
  }
  isActivityEventDTOSource(source, eventId) {
    return source != null && typeof source === "object" && `${source.id ?? ""}`.trim() === eventId;
  }
  isActivityChatRow(row) {
    return this.activitiesPrimaryFilter === "chats" && !!row;
  }
  activityRowBadge(row) {
    if (this.isActivityChatRow(row)) {
      return row.unread ?? 0;
    }
    return 0;
  }
  // ── Event-style rows ───────────────────────────────────────────────────────
  withActivityEventInfoCard(row) {
    if (!this.isEventStyleActivity(row)) {
      return row;
    }
    const dto = this.activityEventDTOForRow(row);
    if (dto) {
      return ActivityEventInfoCardConverter.convert(dto, this.activityEventInfoCardConverterOptions());
    }
    return row;
  }
  activityEventListTypeForRow(row) {
    const rowType = this.activityEventListTypeFromSmartListKey(row.smartListKey);
    if (rowType) {
      return rowType;
    }
    const dto = this.eventsService.peekKnownItemById(this.activeUser.id, row.id);
    if (dto) {
      return this.resolveActivityEventCardTypeFromDTO(dto);
    }
    switch (this.activitiesEventScope) {
      case "invitations":
        return "invitations";
      case "my-events":
      case "drafts":
        return "hosting";
      default:
        return "events";
    }
  }
  activityEventListTypeFromSmartListKey(key) {
    const prefix = `${key ?? ""}`.trim().split(":")[0];
    return prefix === "events" || prefix === "hosting" || prefix === "invitations" ? prefix : null;
  }
  resolveActivityMembersPopupSummary(row) {
    const persistedSummary = this.activityMembersService.peekSummaryByOwner(ActivityEventInfoCardConverter.toActivityMembersOwner(row));
    if (persistedSummary) {
      return __spreadProps(__spreadValues({}, persistedSummary), {
        acceptedMemberUserIds: [...persistedSummary.acceptedMemberUserIds],
        pendingMemberUserIds: [...persistedSummary.pendingMemberUserIds]
      });
    }
    return ActivityEventInfoCardConverter.toActivityMembersSummary(row, {
      capacityByRowId: this.activityCapacityById,
      pendingMembersByRowId: this.activityPendingMembersById,
      capacityTotal: this.activityCapacityTotal(row)
    });
  }
  activityCapacityTotal(row, fallbackBase = 0) {
    const dto = this.eventsService.peekKnownItemById(this.activeUser.id, row.id);
    const dtoCapacityMax = Number(dto?.capacityMax);
    if (Number.isFinite(dtoCapacityMax) && dtoCapacityMax >= 0) {
      return Math.max(fallbackBase, Math.trunc(dtoCapacityMax));
    }
    const dtoCapacityTotal = Number(dto?.capacityTotal);
    if (Number.isFinite(dtoCapacityTotal) && dtoCapacityTotal >= 0) {
      return Math.max(fallbackBase, Math.trunc(dtoCapacityTotal));
    }
    const source = this.activityCapacityById[row.id];
    if (source) {
      const parts = source.split("/").map((part) => Number.parseInt(part.trim(), 10));
      if (parts.length >= 2 && Number.isFinite(parts[1]) && parts[1] >= 0) {
        return parts[1];
      }
    }
    return fallbackBase;
  }
  activityCalendarDateRange(row) {
    if (this.activitiesPrimaryFilter === "rates") {
      const point = new Date(row.dateIso ?? "");
      if (Number.isNaN(point.getTime())) {
        return null;
      }
      return { start: point, end: new Date(point.getTime() + 60 * 1e3) };
    }
    const explicit = this.activityDateTimeRangeById[row.id];
    if (explicit) {
      const start = new Date(explicit.startIso);
      const end = new Date(explicit.endIso);
      if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end.getTime() > start.getTime()) {
        return { start, end };
      }
    }
    const parsed = new Date(row.dateIso ?? "");
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }
    return { start: parsed, end: new Date(parsed.getTime() + 2 * 60 * 60 * 1e3) };
  }
  resolveInvitationActivityMembersRow(row) {
    if (this.activityEventListTypeForRow(row) !== "invitations") {
      return row;
    }
    const matchingDTO = this.activityEventDTOForRow(row);
    if (matchingDTO) {
      return ActivityEventInfoCardConverter.convert(matchingDTO, this.activityEventInfoCardConverterOptions());
    }
    return row;
  }
  applyActivityMembersSummary(row, summary) {
    this.activityCapacityById[row.id] = `${summary.acceptedMembers} / ${summary.capacityTotal}`;
    this.activityPendingMembersById[row.id] = summary.pendingMembers;
    this.applyActivityMembersSummaryToRow(row, summary);
    this.bumpActivitiesEventCardRevision(row);
  }
  applyActivityMembersSyncState(sync) {
    if (sync.viewerMembershipRemoved) {
      this.activitiesStore.clearActivityEventSave();
    }
    if (sync.viewerMembershipRemoved && this.removeVisibleActivityMembershipRow(sync.id)) {
      this.bumpActivitiesEventCardRevision(`events:${sync.id}`);
      this.bumpActivitiesEventCardRevision(`invitations:${sync.id}`);
      return;
    }
    const capacityParts = `${this.activityCapacityById[sync.id] ?? ""}`.split("/");
    const hasCurrentAcceptedMembers = (capacityParts[0] ?? "").trim().length > 0;
    const fallbackAcceptedMembers = Math.max(0, Math.trunc(Number(sync.acceptedMembers) || 0));
    const currentAcceptedMembers = hasCurrentAcceptedMembers ? Math.max(0, Math.trunc(Number(capacityParts[0]) || 0)) : fallbackAcceptedMembers;
    const eventDTO = this.activityEventDTOById(sync.id);
    const knownCapacityTotal = Math.max(0, Math.trunc(Number(eventDTO?.capacityTotal) || 0), Math.trunc(Number(eventDTO?.capacityMax) || 0));
    const currentCapacityTotal = Math.max(currentAcceptedMembers, Math.trunc(Number(capacityParts[1]) || 0), Math.trunc(Number(sync.capacityTotal) || 0), knownCapacityTotal);
    const hasCurrentPendingMembers = this.activityPendingMembersById[sync.id] !== void 0;
    const fallbackPendingMembers = Math.max(0, Math.trunc(Number(sync.pendingMembers) || 0));
    const currentPendingMembers = hasCurrentPendingMembers ? Math.max(0, Math.trunc(Number(this.activityPendingMembersById[sync.id]) || 0)) : fallbackPendingMembers;
    const acceptedMembers = Number.isFinite(Number(sync.acceptedMemberDelta)) ? Math.max(0, currentAcceptedMembers + Math.trunc(Number(sync.acceptedMemberDelta))) : Math.max(0, Math.trunc(Number(sync.acceptedMembers) || 0));
    const pendingMembers = Number.isFinite(Number(sync.pendingMemberDelta)) ? Math.max(0, currentPendingMembers + Math.trunc(Number(sync.pendingMemberDelta))) : Math.max(0, Math.trunc(Number(sync.pendingMembers) || 0));
    const capacityTotal = Math.max(acceptedMembers, currentCapacityTotal);
    this.activityCapacityById[sync.id] = `${acceptedMembers} / ${capacityTotal}`;
    this.activityPendingMembersById[sync.id] = pendingMembers;
    const matchesEvent = (row) => row.id === sync.id && this.isEventStyleActivity(row);
    const patchedEventDTO = eventDTO ? this.patchActivityEventDTO(eventDTO, {
      acceptedMembers,
      pendingMembers,
      capacityTotal
    }) : null;
    const patchedFromSource = patchedEventDTO ? this.activitiesSmartList?.patchConvertedVisibleItem(patchedEventDTO, {
      predicate: (row) => matchesEvent(row)
    }) === true : false;
    if (!patchedFromSource) {
      this.activitiesSmartList?.patchVisibleItem((row) => matchesEvent(row), (row) => this.patchActivityEventInfoCardMembers(row, acceptedMembers, pendingMembers, capacityTotal));
    }
    this.bumpActivitiesEventCardRevision(`events:${sync.id}`);
    this.bumpActivitiesEventCardRevision(`hosting:${sync.id}`);
    this.bumpActivitiesEventCardRevision(`invitations:${sync.id}`);
  }
  patchActivityEventInfoCardMembers(row, acceptedMembers, pendingMembers, capacityTotal) {
    const eventRow = row;
    if (!eventRow.mediaEnd || eventRow.mediaEnd.interactive !== true) {
      return row;
    }
    return __spreadProps(__spreadValues({}, eventRow), {
      mediaEnd: __spreadProps(__spreadValues({}, eventRow.mediaEnd), {
        label: `${acceptedMembers} / ${capacityTotal}`,
        pendingCount: pendingMembers
      })
    });
  }
  removeVisibleActivityMembershipRow(sourceId) {
    if (!this.activitiesSmartList || !this.shouldRemoveVisibleActivityMembershipRow()) {
      return false;
    }
    return this.removeVisibleActivityEventRow(sourceId);
  }
  removeVisibleActivityEventRow(sourceId) {
    if (!this.activitiesSmartList) {
      return false;
    }
    const normalizedSourceId = sourceId.trim();
    const matchingIdentities = /* @__PURE__ */ new Set([
      normalizedSourceId,
      `events:${normalizedSourceId}`,
      `hosting:${normalizedSourceId}`,
      `invitations:${normalizedSourceId}`
    ]);
    return this.activitiesSmartList.removeVisibleItems((row) => this.isEventStyleActivity(row) && (row.id === normalizedSourceId || matchingIdentities.has(this.activityRowIdentity(row))), { totalDelta: -1 });
  }
  shouldRemoveVisibleActivityMembershipRow() {
    if (!this.isEventActivitiesPrimaryFilter()) {
      return false;
    }
    return this.activitiesEventScope === "all" || this.activitiesEventScope === "active-events" || this.activitiesEventScope === "pending" || this.activitiesEventScope === "invitations" || this.activitiesEventScope === "my-events" || this.activitiesEventScope === "drafts";
  }
  applyActivityMembersSummaryToRow(row, summary) {
    const dto = this.eventsService.peekKnownItemById(this.activeUser.id, row.id);
    if (!dto) {
      return;
    }
    Object.assign(row, ActivityEventInfoCardConverter.convert(this.patchActivityEventDTO(dto, {
      acceptedMembers: summary.acceptedMembers,
      pendingMembers: summary.pendingMembers,
      capacityTotal: summary.capacityTotal
    }), this.activityEventInfoCardConverterOptions()));
  }
  persistSelectedActivityMembers() {
    if (!this.selectedActivityMembersRow || !this.selectedActivityMembersRowId) {
      return;
    }
    const owner = ActivityEventInfoCardConverter.toActivityMembersOwner(this.selectedActivityMembersRow);
    if (!owner) {
      return;
    }
    const acceptedMembers = this.selectedActivityMembers.filter((member) => member.status === "accepted").length;
    const summary = ActivityMembersBuilder.buildActivityMembersSummary(owner, this.selectedActivityMembers, this.activityCapacityTotal(this.selectedActivityMembersRow, acceptedMembers));
    this.applyActivityMembersSummary(this.selectedActivityMembersRow, summary);
    void this.activityMembersService.replaceMembersByOwner(owner, this.selectedActivityMembers, summary.capacityTotal);
  }
  maybeDismissActivityRateEditor(target) {
    if (!this.activitiesRates.isEditorOpen()) {
      return;
    }
    if (this.activitiesSmartList?.isPaginationMenuTarget(target) || target.closest(".activities-rate-score-badge") || target.closest(".activities-rate-profile-card.is-rate-editor-selected")) {
      return;
    }
    this.activitiesRates.clearEditorState();
  }
  runAfterActivitiesRender(task) {
    if (typeof globalThis.requestAnimationFrame === "function") {
      globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(task));
      return;
    }
    setTimeout(task, 0);
  }
  runAfterActivitiesNextPaint(task) {
    if (typeof globalThis.requestAnimationFrame === "function") {
      globalThis.requestAnimationFrame(task);
      return;
    }
    setTimeout(task, 0);
  }
  // =========================================================================
  // Calendar – SmartList config helpers
  // =========================================================================
  calendarBadgeToneClass(row) {
    const paletteSize = 8;
    const toneIndex = AppUtils.hashText(row.id) % paletteSize + 1;
    return `calendar-badge-tone-${toneIndex}`;
  }
  // =========================================================================
  // SmartList state reset
  // =========================================================================
  resetActivitiesScroll() {
    this.activitiesSmartList?.clearHostedLoading();
    this.activitiesSmartList?.replaceVisibleItems([], { total: 0 });
    this.activitiesStickyValue = "";
    this.activitiesStore.setActivitiesStickyValue("");
    this.activitiesListScrollable = true;
    this.activitiesInitialLoadPending = true;
    this.cdr.markForCheck();
  }
  // =========================================================================
  // Surface click (closes pickers / menus)
  // =========================================================================
  onActivitiesPopupSurfaceClick(event) {
    const target = event.target;
    if (target instanceof Element && this.isInsideActivitiesFilterSurface(target)) {
      return;
    }
    if (this.showActivitiesViewPicker || this.showActivitiesSecondaryPicker || this.showActivitiesPrimaryPicker || this.showActivitiesEventScopePicker || this.showActivitiesChatContextPicker || this.showActivitiesRatePicker || this.showActivitiesQuickActionsMenu) {
      this.showActivitiesViewPicker = false;
      this.showActivitiesSecondaryPicker = false;
      this.showActivitiesPrimaryPicker = false;
      this.showActivitiesEventScopePicker = false;
      this.showActivitiesChatContextPicker = false;
      this.showActivitiesRatePicker = false;
      this.showActivitiesQuickActionsMenu = false;
      this.cdr.markForCheck();
    }
    if (!(target instanceof Element)) {
      return;
    }
    this.maybeDismissActivityRateEditor(target);
  }
  // =========================================================================
  // Private helpers
  // =========================================================================
  isInsideActivitiesFilterSurface(target) {
    return !!target.closest(".popup-filter-picker, .popup-filter-panel, .activities-view-picker-panel, .popup-mobile-filter-picker, .popup-mobile-filter-panel, .popup-view-fab");
  }
  chatCountValue(value) {
    return Math.max(0, Math.trunc(Number(value) || 0));
  }
  applyActivityEventSync(sync) {
    const dto = this.applyActivityEventDTO(sync);
    const status = this.activityEventStatusCode(dto);
    const isOwned = this.isOwnedActivityEventSync(sync);
    this.activityDateTimeRangeById[dto.id] = {
      startIso: dto.startAtIso,
      endIso: dto.endAtIso ?? dto.startAtIso
    };
    this.eventDatesById[dto.id] = dto.startAtIso;
    this.hostingDatesById[dto.id] = dto.startAtIso;
    this.eventDistanceById[dto.id] = dto.distanceKm;
    this.hostingDistanceById[dto.id] = dto.distanceKm;
    if (isOwned) {
      const nextActiveIds = new Set(this.activeHostingIds);
      if (status === "A") {
        nextActiveIds.add(dto.id);
      } else {
        nextActiveIds.delete(dto.id);
      }
      this.activeHostingIds = nextActiveIds;
    }
    if (dto.imageUrl.trim().length > 0) {
      this.activityImageById[dto.id] = dto.imageUrl;
    } else {
      delete this.activityImageById[dto.id];
    }
    if (dto.visibility) {
      this.eventVisibilityById[dto.id] = dto.visibility;
    }
    if (dto.capacityMin !== void 0 || dto.capacityMax !== void 0) {
      const existingCapacity = this.eventCapacityById[dto.id] ?? { min: 0, max: 0 };
      this.eventCapacityById[dto.id] = {
        min: dto.capacityMin ?? existingCapacity.min,
        max: dto.capacityMax ?? existingCapacity.max
      };
    }
    this.clearInvitationMemberCacheFromActivityEventSync(dto);
    this.upsertVisibleEventRowFromSync(dto, { loadedRange: "before-or-within" });
    this.applyActivitiesEventMemberSnapshot(dto);
    this.bumpActivitiesEventCardRevision(`events:${dto.id}`);
    this.bumpActivitiesEventCardRevision(`hosting:${dto.id}`);
    this.bumpActivitiesEventCardRevision(`invitations:${dto.id}`);
    this.refreshSectionBadges();
  }
  applyActivityEventSyncMessage(message) {
    if (message.kind === "remove") {
      this.removeVisibleActivityEventRow(message.sourceId);
      this.bumpActivitiesEventCardRevision(`events:${message.sourceId}`);
      this.bumpActivitiesEventCardRevision(`hosting:${message.sourceId}`);
      this.bumpActivitiesEventCardRevision(`invitations:${message.sourceId}`);
      return;
    }
    this.applyActivityEventSync(message.event);
  }
  activitiesEventCardRevisionForRow(row) {
    return this.activitiesEventCardRevision + (this.activitiesEventCardRevisionByRowId[this.activityRowIdentity(row)] ?? 0);
  }
  bumpActivitiesEventCardRevision(row) {
    if (!row) {
      this.activitiesEventCardRevision += 1;
      return;
    }
    const rowId = typeof row === "string" ? row : this.activityRowIdentity(row);
    this.activitiesEventCardRevisionByRowId[rowId] = (this.activitiesEventCardRevisionByRowId[rowId] ?? 0) + 1;
  }
  refreshActivitiesRateCards(rowId) {
    const normalizedRowId = `${rowId ?? ""}`.trim();
    if (normalizedRowId) {
      this.activityRateCardRevisionByRowId[normalizedRowId] = (this.activityRateCardRevisionByRowId[normalizedRowId] ?? 0) + 1;
    } else {
      this.activitiesRateCardRevision += 1;
    }
    this.cdr.markForCheck();
  }
  syncVisibleRateItem(item) {
    const smartList = this.activitiesSmartList;
    if (!smartList || this.activitiesPrimaryFilter !== "rates") {
      return;
    }
    if (this.activitiesRates.matchesFilter(item, this.activitiesRateFilter)) {
      smartList.patchConvertedVisibleItem(item);
      return;
    }
    smartList.removeVisibleItemByIdentity(`rates:${item.id}`);
  }
  clearInvitationMemberCacheFromActivityEventSync(sync) {
    const activeUserId = this.activeUser.id.trim();
    if (!activeUserId) {
      return;
    }
    delete this.activityMembersByRowId[`invitations:${sync.id}`];
  }
  cloneSyncedSubEventForms(items) {
    return items.map((item) => __spreadValues({}, item));
  }
  cloneSyncedSlotTemplates(items) {
    if (!Array.isArray(items)) {
      return void 0;
    }
    return items.map((item) => __spreadValues({}, item));
  }
  applyActivitiesEventMemberSnapshot(sync) {
    const dto = sync;
    const acceptedRaw = Number(dto.acceptedMembers);
    const pendingRaw = Number(dto.pendingMembers);
    const hasAccepted = Number.isFinite(acceptedRaw);
    const hasPending = Number.isFinite(pendingRaw);
    if (!hasAccepted && !hasPending) {
      return;
    }
    const acceptedMembers = hasAccepted ? Math.max(0, Math.trunc(acceptedRaw)) : 0;
    const pendingMembers = hasPending ? Math.max(0, Math.trunc(pendingRaw)) : 0;
    const capacityRaw = Number(dto.capacityTotal);
    const capacityTotal = Number.isFinite(capacityRaw) ? Math.max(acceptedMembers, Math.trunc(capacityRaw)) : acceptedMembers;
    this.activityCapacityById[sync.id] = `${acceptedMembers} / ${capacityTotal}`;
    this.activityPendingMembersById[sync.id] = pendingMembers;
    const eventRow = ActivityEventInfoCardConverter.convert(dto, this.activityEventInfoCardConverterOptions());
    const summary = {
      ownerType: "event",
      ownerId: sync.id,
      acceptedMembers,
      pendingMembers,
      capacityTotal,
      acceptedMemberUserIds: [],
      pendingMemberUserIds: []
    };
    this.applyActivityMembersSummary(eventRow, summary);
    delete this.activityMembersByRowId[`events:${sync.id}`];
    delete this.activityMembersByRowId[`hosting:${sync.id}`];
    delete this.activityMembersByRowId[`invitations:${sync.id}`];
  }
  syncActivitiesSmartListQuery() {
    const nextFilters = {
      primaryFilter: this.activitiesPrimaryFilter,
      eventScopeFilter: this.activitiesEventScope,
      secondaryFilter: this.activitiesSecondaryFilter,
      chatContextFilter: this.activitiesChatContextFilter,
      supportCaseFilter: this.activitiesSupportCaseFilter,
      hostingPublicationFilter: this.hostingPublicationFilter,
      rateFilter: this.activitiesRateFilter,
      rateSocialBadgeEnabled: this.activitiesRateSocialBadgeEnabled,
      adminServiceOnly: this.activitiesStore.activitiesAdminServiceOnly()
    };
    const currentFilters = this.activitiesSmartListQuery.filters ?? {};
    if (currentFilters["primaryFilter"] === nextFilters["primaryFilter"] && currentFilters["eventScopeFilter"] === nextFilters["eventScopeFilter"] && currentFilters["secondaryFilter"] === nextFilters["secondaryFilter"] && currentFilters["chatContextFilter"] === nextFilters["chatContextFilter"] && currentFilters["supportCaseFilter"] === nextFilters["supportCaseFilter"] && currentFilters["hostingPublicationFilter"] === nextFilters["hostingPublicationFilter"] && currentFilters["rateFilter"] === nextFilters["rateFilter"] && currentFilters["rateSocialBadgeEnabled"] === nextFilters["rateSocialBadgeEnabled"] && currentFilters["adminServiceOnly"] === nextFilters["adminServiceOnly"]) {
      return;
    }
    this.activitiesSmartListQuery = {
      filters: nextFilters
    };
  }
  onActivitiesSmartListStateChange(change) {
    let shouldMarkForCheck = false;
    if (this.activitiesInitialLoadPending !== change.initialLoading) {
      this.activitiesInitialLoadPending = change.initialLoading;
      shouldMarkForCheck = true;
    }
    if (this.activitiesListScrollable !== change.scrollable) {
      this.activitiesListScrollable = change.scrollable;
      shouldMarkForCheck = true;
    }
    if (this.activitiesStickyValue !== change.stickyLabel) {
      this.activitiesStickyValue = change.stickyLabel;
      this.activitiesStore.setActivitiesStickyValue(change.stickyLabel);
      shouldMarkForCheck = true;
    }
    if (this.isRatesFullscreenModeActive()) {
      this.activitiesRates.syncFullscreenSelection();
    }
    if (shouldMarkForCheck) {
      this.cdr.markForCheck();
    }
  }
  activityRowIdentity(row) {
    const smartListKey = `${row.smartListKey ?? ""}`.trim();
    if (smartListKey) {
      return smartListKey;
    }
    if (this.activitiesPrimaryFilter === "chats") {
      return `chats:${row.id}`;
    }
    if (this.activitiesPrimaryFilter === "rates") {
      return `rates:${row.id}`;
    }
    if (this.isEventActivitiesPrimaryFilter()) {
      return `${this.activityEventListTypeForRow(row)}:${row.id}`;
    }
    return row.id;
  }
  async loadActivitiesSmartListPage(query, context) {
    const requestedPrimaryFilter = query.filters?.primaryFilter ?? this.activitiesPrimaryFilter;
    if (requestedPrimaryFilter === "rates") {
      const page2 = await this.activitiesService.loadActivityRates(query, {
        signal: context?.signal
      });
      return {
        items: this.activitiesSmartList?.convertItems(page2.items, {
          rateUsers: page2.context?.users ?? []
        }) ?? [],
        total: page2.total,
        nextCursor: page2.nextCursor ?? null
      };
    }
    if (requestedPrimaryFilter === "events" || requestedPrimaryFilter === "hosting" || requestedPrimaryFilter === "invitations") {
      const page2 = await this.eventsService.loadActivityEvents(query, {
        signal: context?.signal
      });
      const queryEventScope = query.filters?.eventScopeFilter ?? this.activitiesEventScope;
      if (shouldApplyActivitiesEventBucketLoad({
        currentPrimaryFilter: this.activitiesPrimaryFilter,
        currentEventScope: this.activitiesEventScope,
        queryPrimaryFilter: requestedPrimaryFilter,
        queryEventScope,
        aborted: context?.signal?.aborted === true,
        currentView: query.view ?? null
      })) {
        if (page2.context?.eventCounters) {
          this.activityStore.signalUserEventCounterSnapshot(this.activeUser.id, page2.context.eventCounters);
        } else {
          this.activityStore.signalUserEventBucketCount(this.activeUser.id, queryEventScope, page2.total, this.activeUser.activities);
        }
      }
      return {
        items: this.activitiesSmartList?.convertItems(page2.items) ?? [],
        total: page2.total,
        nextCursor: page2.nextCursor ?? null
      };
    }
    const page = await this.activitiesService.loadActivityChats(query, { signal: context?.signal });
    return {
      items: this.activitiesSmartList?.convertItems(page.items) ?? [],
      total: page.total,
      nextCursor: page.nextCursor ?? null
    };
  }
  static \u0275fac = function ActivitiesPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ActivitiesPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ActivitiesPopupComponent, selectors: [["app-activities-popup"]], viewQuery: function ActivitiesPopupComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.activitiesSmartList = _t.first);
    }
  }, hostBindings: function ActivitiesPopupComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("keydown.escape", function ActivitiesPopupComponent_keydown_escape_HostBindingHandler($event) {
        return ctx.onEscapePressed($event);
      }, \u0275\u0275resolveWindow)("resize", function ActivitiesPopupComponent_resize_HostBindingHandler() {
        return ctx.onViewportResize();
      }, \u0275\u0275resolveWindow);
    }
  }, features: [\u0275\u0275ProvidersFeature([AppMenuDispatcher])], decls: 2, vars: 1, consts: [["activitiesRateFullscreenSmartListItemTemplate", ""], ["activitiesSmartList", ""], ["activitiesEventSmartListItemTemplate", ""], ["activitiesChatSmartListItemTemplate", ""], ["activitiesRateSmartListItemTemplate", ""], [3, "model"], [1, "activities-popup", 3, "click"], [3, "itemSelect", "menuItemSelect", "stateChange", "wheel", "touchmove", "config", "loadPage", "itemTemplate", "fullscreenItemTemplate", "presentation", "view", "query"], [3, "row", "presentation", "state", "context", "cardRevision"], [3, "detailClick", "row", "presentation", "state", "context", "cardRevision"], [3, "profileClick", "mediaEndClick", "menuAction", "menuRequest", "row", "groupLabel", "cardRevision"], [3, "rowClick", "supportCaseAction", "row", "groupLabel"], [3, "detailClick", "row", "groupLabel", "context", "openMenu", "cardRevision"], [4, "ngComponentOutlet"]], template: function ActivitiesPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, ActivitiesPopupComponent_Conditional_0_Template, 13, 13);
      \u0275\u0275element(1, "app-event-checkout-popup");
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.activitiesStore.activitiesOpenBoolean() ? 0 : -1);
    }
  }, dependencies: [
    CommonModule,
    NgComponentOutlet,
    MatIconModule,
    SmartListComponent,
    ActivitiesEventTemplateComponent,
    ActivitiesChatTemplateComponent,
    ActivitiesRateTemplateComponent,
    EventCheckoutPopupComponent,
    PopupComponent
  ], styles: ['\n[_nghost-%COMP%] {\n  --interactive-motion-duration: 160ms;\n  --interactive-motion-ease: cubic-bezier(0.22, 1, 0.36, 1);\n  --interactive-hover-lift: -1px;\n  --interactive-hover-scale: 1.01;\n  --interactive-hover-brightness: 1.01;\n  --interactive-press-scale: 0.97;\n  --interactive-press-brightness: 0.97;\n}\n[_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]) {\n  -webkit-tap-highlight-color: transparent;\n  transition:\n    transform var(--interactive-motion-duration) var(--interactive-motion-ease),\n    filter var(--interactive-motion-duration) var(--interactive-motion-ease),\n    box-shadow var(--interactive-motion-duration) var(--interactive-motion-ease),\n    background-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    border-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    color var(--interactive-motion-duration) var(--interactive-motion-ease);\n  transform-origin: center;\n}\n[_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):focus-visible {\n  outline: 2px solid rgba(66, 110, 182, 0.44);\n  outline-offset: 2px;\n}\n@media (hover: hover) and (pointer: fine) {\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):hover {\n    transform: translateY(var(--interactive-hover-lift)) scale(var(--interactive-hover-scale));\n    filter: brightness(var(--interactive-hover-brightness));\n  }\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  [_ngcontent-%COMP%]:where(.motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):hover {\n    box-shadow: 0 3px 10px rgba(16, 29, 48, 0.14);\n  }\n}\n@keyframes _ngcontent-%COMP%_shared-mobile-touch-feedback {\n  0% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n  45% {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  100% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n}\n@media (hover: none), (pointer: coarse) {\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    animation: _ngcontent-%COMP%_shared-mobile-touch-feedback 0.2s ease;\n  }\n}\n.app-popup[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%] {\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.app-popup[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%] {\n  font-family: inherit;\n}\n.popup-filter-picker[_ngcontent-%COMP%], \n.activities-view-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 60;\n  margin-left: auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-filter-picker-secondary[_ngcontent-%COMP%], \n.activities-secondary-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 61;\n}\n.selector-like[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%] {\n  width: fit-content !important;\n  min-width: 0 !important;\n  max-width: 100%;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: auto !important;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%] {\n  width: auto !important;\n  flex: 0 1 auto;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: auto !important;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%] {\n  margin-left: 0.28rem;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%] {\n  min-width: 174px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  border: 1px solid #c8d3e2;\n  border-radius: 999px;\n  box-shadow: 0 2px 6px rgba(38, 60, 92, 0.08);\n  padding: 0.12rem 0.5rem 0.12rem 0.84rem;\n  background: #f8f9fb;\n}\n.profile-status-select-wrap.selector-like[_ngcontent-%COMP%] {\n  min-height: 36px;\n}\n.status-option-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.2rem;\n  text-transform: lowercase;\n  width: 100%;\n  min-width: 0;\n}\n.status-option-content[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child {\n  white-space: nowrap;\n}\n.status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  flex: 0 0 16px;\n}\n.rate-filter-count-badge[_ngcontent-%COMP%] {\n  margin-left: auto;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  border: 1px solid #fff;\n  background: #d84d4d;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  font-size: 0.68rem;\n  font-weight: 800;\n  line-height: 1;\n  box-shadow: 0 2px 8px rgba(120, 24, 24, 0.22);\n}\n.rate-filter-trigger-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  margin-left: 0;\n  z-index: 2;\n}\n.popup-filter-control[_ngcontent-%COMP%], \n.activities-rate-filter-select[_ngcontent-%COMP%], \n.activities-primary-filter-select[_ngcontent-%COMP%], \n.activities-event-scope-filter-select[_ngcontent-%COMP%], \n.activities-chat-context-filter-select[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: visible;\n}\n.popup-filter-panel[_ngcontent-%COMP%], \n.activities-view-picker-panel[_ngcontent-%COMP%] {\n  position: absolute;\n  top: calc(100% + 0.32rem);\n  right: 0;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 10px;\n  background: #fff;\n  box-shadow: 0 10px 24px rgba(17, 29, 48, 0.22);\n  padding: 0.24rem;\n  min-width: 128px;\n  z-index: 40;\n  display: grid;\n  gap: 0.16rem;\n}\n.popup-filter-option[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%] {\n  border: 0;\n  background: #fff;\n  border-radius: 8px;\n  min-height: 32px;\n  padding: 0.34rem 0.44rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.34rem;\n  color: #1e3658;\n  cursor: pointer;\n  text-align: left;\n}\n.popup-filter-option[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-filter-option[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.popup-filter-option[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:not(.rate-filter-count-badge), \n.activities-view-option[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:not(.rate-filter-count-badge) {\n  flex: 1 1 auto;\n  min-width: 0;\n  text-align: left;\n}\n.popup-mobile-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-primary-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-event-scope-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-chat-context-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-rate-filter-picker[_ngcontent-%COMP%] {\n  position: relative;\n}\n.popup-mobile-filter-panel[_ngcontent-%COMP%], \n.activities-mobile-filter-panel[_ngcontent-%COMP%], \n.activities-mobile-rate-filter-panel[_ngcontent-%COMP%] {\n  top: calc(100% + 0.24rem);\n  right: 0;\n  min-width: 210px;\n  z-index: 65;\n}\n.popup-mobile-sheet-title[_ngcontent-%COMP%], \n.activities-mobile-sheet-title[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  padding: 0 0.14rem;\n  color: #1c3354;\n  font-size: 0.94rem;\n  font-weight: 800;\n}\n.popup-mobile-sheet-title[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.activities-mobile-sheet-title[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n:is(.popup-filter-bar[_ngcontent-%COMP%], .experience-toolbar[_ngcontent-%COMP%], .assets-toolbar[_ngcontent-%COMP%])   .popup-view-fab[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child, \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%] {\n  font-weight: 400 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option .status-option-content {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  width: 100%;\n  min-width: 0;\n  column-gap: 0.34rem;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option .rate-filter-count-badge {\n  margin-left: 0;\n  justify-self: end;\n}\n[_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.selector-options-panel), \n[_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.status-options-panel) {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n@media (max-width: 760px) {\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%] {\n    width: 100%;\n    min-width: 0;\n    box-sizing: border-box;\n    border: 1px solid rgba(58, 81, 114, 0.24);\n    border-radius: 12px;\n    background: #f7f9fd;\n    min-height: 42px;\n    padding: 0.46rem 0.62rem;\n    justify-content: flex-start;\n    gap: 0.36rem;\n  }\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%] {\n    box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.24);\n    filter: brightness(0.95);\n  }\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%] {\n    margin-left: auto;\n    flex: 0 0 auto;\n  }\n  [_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.profile-bottom-sheet-panel) {\n    position: fixed !important;\n    left: 0 !important;\n    right: 0 !important;\n    bottom: 0 !important;\n    top: auto !important;\n    width: 100vw !important;\n    max-width: 100vw !important;\n    transform: none !important;\n  }\n  [_nghost-%COMP%]     .mat-mdc-select-panel.profile-bottom-sheet-panel {\n    width: 100vw !important;\n    max-width: 100vw !important;\n    max-height: min(54vh, 420px) !important;\n    margin: 0 !important;\n    border-radius: 16px 16px 0 0 !important;\n    border: 1px solid #d6deea;\n    border-bottom: 0;\n    box-shadow: 0 -14px 28px rgba(15, 29, 52, 0.24);\n    padding-top: 0.38rem;\n    padding-bottom: max(0.55rem, env(safe-area-inset-bottom));\n  }\n}\n.popup-view-fab[_ngcontent-%COMP%] {\n  height: 34px;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 999px;\n  background: #f3f7ff;\n  color: #2c4c74;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0 0.62rem;\n  cursor: pointer;\n}\n.popup-view-fab[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-view-fab[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.74rem;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.event-visibility-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 22;\n  margin-left: auto;\n  flex: 0 0 auto;\n}\n.event-visibility-trigger[_ngcontent-%COMP%] {\n  flex-wrap: nowrap;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-public[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-public[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e6f6ef);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-friends[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-friends[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e8f1fd);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-host[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-host[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6efe2);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-inactive[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-inactive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f2f3f5);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-public[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-public[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-friends[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-friends[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-host[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-host[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-inactive[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-inactive[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.48rem 0.56rem;\n  font: inherit;\n  color: var(--text-main);\n  background: #fff;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  resize: vertical;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n  outline: 0;\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n}\n.popup-surface-form-grid[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  max-width: none;\n  width: 100%;\n  margin: 0;\n  justify-content: stretch;\n  align-content: start;\n  align-items: start;\n  column-gap: 1rem;\n  row-gap: 0.9rem;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-rows: min-content;\n  gap: 0;\n  font-weight: 600;\n  color: rgba(26, 44, 69, 0.88);\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  min-height: 40px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  min-height: 96px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   .profile-status-select-wrap.selector-like[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   .profile-status-select-wrap.selector-like[_ngcontent-%COMP%] {\n  min-height: 40px;\n  height: 40px;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  min-height: 32px;\n}\n.popup-surface-description-field[_ngcontent-%COMP%], \n.experience-description-field[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.popup-surface-actions[_ngcontent-%COMP%], \n.experience-form-actions[_ngcontent-%COMP%] {\n  justify-content: center;\n  padding-top: 0.2rem;\n}\n.popup-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.link-btn[_ngcontent-%COMP%] {\n  border: 1px solid var(--line-strong);\n  border-radius: 999px;\n  background: #fff;\n  color: #1f3350;\n  font: inherit;\n  font-size: 0.83rem;\n  padding: 0.38rem 0.76rem;\n  cursor: pointer;\n}\n.neutral-btn[_ngcontent-%COMP%] {\n  background: #f2f4fa;\n  border-color: rgba(23, 33, 54, 0.12);\n}\n.primary-btn[_ngcontent-%COMP%] {\n  background: #4776b7;\n  border-color: #4776b7;\n  color: #fff;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.date-picker-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: #566b86;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  min-width: 80px;\n  width: 100%;\n  font-size: 0.8rem;\n  font-weight: 700;\n  text-transform: lowercase;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-content: flex-start;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%] {\n  margin-left: auto;\n}\n.status-public[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.status-friends[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.status-host[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.status-inactive[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-public[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-friends[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-host[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-inactive[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.profile-status-select-wrap.status-public[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.profile-status-select-wrap.status-friends[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.profile-status-select-wrap.status-host[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.profile-status-select-wrap.status-inactive[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.profile-details-values-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: rgba(44, 67, 100, 0.72);\n}\n.profile-details-values-btn[_ngcontent-%COMP%] {\n  min-height: 36px;\n  height: 36px;\n  box-sizing: border-box;\n  padding-top: 0;\n  padding-bottom: 0;\n}\n.profile-details-values-btn[_ngcontent-%COMP%]   .status-option-content.profile-details-selected-badges[_ngcontent-%COMP%] {\n  display: inline-grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  column-gap: 0.26rem;\n  min-width: 0;\n  width: 100%;\n}\n.profile-details-values-btn.profile-details-values-tone-values[_ngcontent-%COMP%]   .profile-details-inline-chip[_ngcontent-%COMP%] {\n  max-width: calc(100% - 2.6rem);\n}\n.profile-details-values-btn.profile-details-values-tone-interest[_ngcontent-%COMP%]   .profile-details-inline-chip[_ngcontent-%COMP%] {\n  max-width: calc((100% - 3.2rem) / 2);\n}\n.profile-details-values-btn.profile-details-values-tone-values[_ngcontent-%COMP%]   .profile-details-inline-overflow[_ngcontent-%COMP%] {\n  color: #1e6b5a;\n}\n.profile-details-values-btn.profile-details-values-tone-interest[_ngcontent-%COMP%]   .profile-details-inline-overflow[_ngcontent-%COMP%] {\n  color: #2e5a90;\n}\n.values-header-chips[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.28rem;\n  flex: 0 0 100%;\n  margin-left: 0;\n  margin-top: 0.34rem;\n  max-width: 100%;\n  overflow: visible;\n  white-space: normal;\n  padding-bottom: 0;\n}\n.popup-title-values[_ngcontent-%COMP%] {\n  margin-right: 0.38rem;\n}\n.values-selected-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(76, 99, 136, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9ff 0%,\n      #eef3ff 100%);\n  color: #24416a;\n  border-radius: 999px;\n  min-height: 26px;\n  padding: 0.18rem 0.46rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-size: 0.7rem;\n  font-weight: 700;\n  cursor: pointer;\n  flex: 0 0 auto;\n}\n.values-selected-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.values-selected-chip.section-family[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1ea 0%,\n      #ffe6dd 100%);\n  border-color: rgba(160, 90, 51, 0.32);\n  color: #8b4d2b;\n}\n.values-selected-chip.section-ambition[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff7e8 0%,\n      #ffefd7 100%);\n  border-color: rgba(160, 106, 20, 0.32);\n  color: #9a6614;\n}\n.values-selected-chip.section-lifestyle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f5 0%,\n      #e0f2ee 100%);\n  border-color: rgba(45, 125, 120, 0.32);\n  color: #2a6e6a;\n}\n.values-selected-chip.section-beliefs[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f0ecff 0%,\n      #e8e1fa 100%);\n  border-color: rgba(95, 78, 160, 0.32);\n  color: #564793;\n}\n.values-selected-chip.section-social[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n  color: #2d5ea8;\n}\n.values-selected-chip.section-arts[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2edfb 0%,\n      #e9e2f9 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n  color: #654ca1;\n}\n.values-selected-chip.section-food[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4e8 0%,\n      #fee9d6 100%);\n  border-color: rgba(170, 97, 28, 0.32);\n  color: #9d611c;\n}\n.values-selected-chip.section-active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.values-selected-chip.section-mind[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f6 0%,\n      #def1ee 100%);\n  border-color: rgba(37, 124, 118, 0.32);\n  color: #2d7d78;\n}\n.values-selected-chip.section-identity[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n  border-color: rgba(88, 78, 159, 0.32);\n  color: #5a4ea0;\n}\n.readonly-select[_ngcontent-%COMP%] {\n  width: fit-content;\n  min-width: 0;\n  max-width: 130px;\n  justify-content: center;\n  margin-top: 2px;\n  padding-left: 0.44rem;\n  padding-right: 0.44rem;\n}\n.readonly-field[_ngcontent-%COMP%] {\n  min-height: 34px;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.4rem 0.56rem;\n  background: #f7fafe;\n  color: #23476f;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-weight: 700;\n}\n.readonly-field[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.zodiac-symbol[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  font-weight: 800;\n  line-height: 1;\n}\n.zodiac-label[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  font-weight: 700;\n  min-width: 0;\n  text-align: center;\n}\n.readonly-select.zodiac-aries[_ngcontent-%COMP%] {\n  background: #fdf1f1;\n  color: #9f2f2f;\n}\n.readonly-select.zodiac-taurus[_ngcontent-%COMP%] {\n  background: #f7f3eb;\n  color: #6e4b2b;\n}\n.readonly-select.zodiac-gemini[_ngcontent-%COMP%] {\n  background: #fdf8e9;\n  color: #7d5a12;\n}\n.readonly-select.zodiac-cancer[_ngcontent-%COMP%] {\n  background: #eef4ff;\n  color: #2d5b8e;\n}\n.readonly-select.zodiac-leo[_ngcontent-%COMP%] {\n  background: #fff3e8;\n  color: #8f4b0d;\n}\n.readonly-select.zodiac-virgo[_ngcontent-%COMP%] {\n  background: #edf8ef;\n  color: #2b6b3d;\n}\n.readonly-select.zodiac-libra[_ngcontent-%COMP%] {\n  background: #f2eefc;\n  color: #60439d;\n}\n.readonly-select.zodiac-scorpio[_ngcontent-%COMP%] {\n  background: #f9edf2;\n  color: #7b3150;\n}\n.readonly-select.zodiac-sagittarius[_ngcontent-%COMP%] {\n  background: #eef1ff;\n  color: #2f4a9a;\n}\n.readonly-select.zodiac-capricorn[_ngcontent-%COMP%] {\n  background: #eff2f5;\n  color: #364653;\n}\n.readonly-select.zodiac-aquarius[_ngcontent-%COMP%] {\n  background: #ebf7fb;\n  color: #1d5f7a;\n}\n.readonly-select.zodiac-pisces[_ngcontent-%COMP%] {\n  background: #eef2ff;\n  color: #294b8f;\n}\n.physique-slim[_ngcontent-%COMP%] {\n  color: #3f7ab3;\n}\n.physique-lean[_ngcontent-%COMP%] {\n  color: #3f8f5f;\n}\n.physique-athletic[_ngcontent-%COMP%] {\n  color: #2f7e4d;\n}\n.physique-fit[_ngcontent-%COMP%] {\n  color: #465fbb;\n}\n.physique-curvy[_ngcontent-%COMP%] {\n  color: #a14875;\n}\n.physique-muscular[_ngcontent-%COMP%] {\n  color: #7d4f24;\n}\n.physique-average[_ngcontent-%COMP%] {\n  color: #4d667f;\n}\n.physique-select-wrap.physique-slim[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf3fb 0%,\n      #dfebf8 100%);\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.physique-select-wrap.physique-lean[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf6ee 0%,\n      #def0e5 100%);\n  border-color: rgba(63, 143, 95, 0.34);\n}\n.physique-select-wrap.physique-athletic[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f5ec 0%,\n      #dff0e6 100%);\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.physique-select-wrap.physique-fit[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ebf0ff 0%,\n      #e1e8fc 100%);\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.physique-select-wrap.physique-curvy[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f7edf3 0%,\n      #f0e3ec 100%);\n  border-color: rgba(161, 72, 117, 0.36);\n}\n.physique-select-wrap.physique-muscular[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe9 0%,\n      #ede3d8 100%);\n  border-color: rgba(125, 79, 36, 0.36);\n}\n.physique-select-wrap.physique-average[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef2f6 0%,\n      #e5ebf1 100%);\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.physique-select-wrap.physique-slim[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #3f7ab3;\n}\n.physique-select-wrap.physique-lean[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #3f8f5f;\n}\n.physique-select-wrap.physique-athletic[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f7e4d;\n}\n.physique-select-wrap.physique-fit[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #465fbb;\n}\n.physique-select-wrap.physique-curvy[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #a14875;\n}\n.physique-select-wrap.physique-muscular[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #7d4f24;\n}\n.physique-select-wrap.physique-average[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #4d667f;\n}\n.experience-filter-all[_ngcontent-%COMP%] {\n  color: #694ea6;\n}\n.experience-filter-workspace[_ngcontent-%COMP%] {\n  color: #a1485a;\n}\n.experience-filter-school[_ngcontent-%COMP%] {\n  color: #2d5ea8;\n}\n.experience-filter-online[_ngcontent-%COMP%] {\n  color: #2d7d47;\n}\n.experience-filter-project[_ngcontent-%COMP%] {\n  color: #6550a0;\n}\n.experience-filter-select.experience-filter-all[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-project[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #efe8ff 0%,\n      #e8defc 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n}\n.experience-filter-select.experience-filter-workspace[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-workspace[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f3 0%,\n      #ffe6ea 100%);\n  border-color: rgba(169, 72, 90, 0.32);\n}\n.experience-filter-select.experience-filter-school[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-school[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n}\n.experience-type-select.experience-filter-online[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n}\n.experience-type-select.experience-filter-project[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n}\n.experience-type-select[_ngcontent-%COMP%] {\n  min-width: 0;\n  max-width: 100%;\n  min-height: 40px;\n}\n.experience-type-field[_ngcontent-%COMP%], \n.experience-title-field[_ngcontent-%COMP%], \n.experience-city-field[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-org-field[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-type-select[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.experience-date-range-field[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: none;\n  margin: 0;\n  background: transparent;\n}\n.experience-date-range-label[_ngcontent-%COMP%] {\n  grid-column: 1/2;\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-text-field-wrapper[_ngcontent-%COMP%] {\n  min-height: 42px;\n  border-radius: 10px;\n  background: #fff;\n  border: 1px solid rgba(136, 156, 186, 0.5);\n  box-shadow: none;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-subscript-wrapper[_ngcontent-%COMP%] {\n  margin-top: 0.24rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  border: 0 !important;\n  box-shadow: none !important;\n  border-radius: 0 !important;\n  background: transparent !important;\n  min-width: 0;\n  width: 100%;\n  padding: 0 !important;\n  min-height: 0 !important;\n  height: auto !important;\n  line-height: 1.25;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-datepicker-toggle[_ngcontent-%COMP%] {\n  margin-right: 0.2rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-hint-wrapper[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-hint[_ngcontent-%COMP%] {\n  color: rgba(30, 49, 74, 0.65);\n  font-size: 0.72rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-container[_ngcontent-%COMP%] {\n  width: 100%;\n  display: grid;\n  grid-template-columns: minmax(96px, 1fr) auto minmax(96px, 1fr);\n  align-items: center;\n  column-gap: 0.34rem;\n  min-width: 0;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-separator[_ngcontent-%COMP%] {\n  margin: 0 0.28rem;\n  flex: 0 0 auto;\n  white-space: nowrap;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-start-wrapper[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-end-wrapper[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  overflow: visible;\n  min-width: 0;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-inner[_ngcontent-%COMP%] {\n  font-size: 0.96rem;\n  min-width: 0 !important;\n  width: 100% !important;\n  text-overflow: clip;\n  white-space: nowrap;\n  line-height: 1.25;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-flex[_ngcontent-%COMP%] {\n  min-width: 0;\n  border-bottom: 0 !important;\n  box-shadow: none !important;\n  align-items: center !important;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-infix[_ngcontent-%COMP%] {\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  min-height: 34px !important;\n  height: 34px;\n  display: flex;\n  align-items: center;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-line-ripple[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple--deactivating[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple--active[_ngcontent-%COMP%] {\n  display: none !important;\n  opacity: 0 !important;\n  transform: scaleX(0) !important;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-all {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efe8ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-workspace {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1f3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-school {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf4ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-online {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf8ee);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-project {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f4f0ff);\n}\n.mobile-profile-language-chip.language-tone-1[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-1[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-1 {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n  color: #2f6090;\n}\n.mobile-profile-language-chip.language-tone-2[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-2[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-2 {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n  color: #2f695b;\n}\n.mobile-profile-language-chip.language-tone-3[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-3[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-3 {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n  color: #394f9c;\n}\n.mobile-profile-language-chip.language-tone-4[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-4[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-4 {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n  color: #8d3f66;\n}\n.mobile-profile-language-chip.language-tone-5[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-5[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-5 {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n  color: #704822;\n}\n.mobile-profile-language-chip.language-tone-6[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-6[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-6 {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n  color: #415872;\n}\n.mobile-profile-language-chip.language-tone-7[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-7[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-7 {\n  background: #f7f5ea;\n  border-color: rgba(128, 109, 66, 0.34);\n  color: #746237;\n}\n.mobile-profile-language-chip.language-tone-8[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-8[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-8 {\n  background: #edf5ff;\n  border-color: rgba(45, 122, 160, 0.34);\n  color: #2f6782;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf2ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #ebf7ef);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1e3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efecfc);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3f8e9);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fceef3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf7ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6f2e9);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-1 .status-option-content {\n  color: #2d63a9;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-2 .status-option-content {\n  color: #2a7a49;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-3 .status-option-content {\n  color: #9b6018;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-4 .status-option-content {\n  color: #6153a2;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-5 .status-option-content {\n  color: #61812a;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-6 .status-option-content {\n  color: #9f446d;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-7 .status-option-content {\n  color: #2e7898;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-8 .status-option-content {\n  color: #806c3f;\n}\n.mobile-profile-selector-option.detail-tone-1[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef5ff 0%,\n      #e3eefc 100%);\n  border-color: rgba(46, 102, 181, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-2[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef9f3 0%,\n      #e3f4ea 100%);\n  border-color: rgba(40, 125, 72, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-3[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ea 0%,\n      #ffecdd 100%);\n  border-color: rgba(165, 94, 24, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-4[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f1ff 0%,\n      #e8e5fb 100%);\n  border-color: rgba(97, 82, 164, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-5[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f9ef 0%,\n      #edf3e1 100%);\n  border-color: rgba(95, 128, 36, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-6[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #f9e6ed 100%);\n  border-color: rgba(160, 70, 111, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-7[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ff 0%,\n      #e2f0fb 100%);\n  border-color: rgba(45, 122, 160, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-8[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f3ea 0%,\n      #eee9dc 100%);\n  border-color: rgba(128, 109, 66, 0.32);\n}\n.mobile-profile-selector-option.status-public[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e6f6ef 0%,\n      #d9f0e6 100%);\n  border-color: rgba(47, 143, 102, 0.34);\n}\n.mobile-profile-selector-option.status-friends[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f1fd 0%,\n      #dfeaf9 100%);\n  border-color: rgba(27, 87, 161, 0.34);\n}\n.mobile-profile-selector-option.status-host[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe2 0%,\n      #eee4d2 100%);\n  border-color: rgba(135, 88, 15, 0.36);\n}\n.mobile-profile-selector-option.status-inactive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3f5 0%,\n      #e8ebef 100%);\n  border-color: rgba(91, 101, 115, 0.32);\n}\n.mobile-profile-selector-option.physique-slim[_ngcontent-%COMP%] {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.mobile-profile-selector-option.physique-lean[_ngcontent-%COMP%] {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n}\n.mobile-profile-selector-option.physique-athletic[_ngcontent-%COMP%] {\n  background: #e8f5ec;\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.mobile-profile-selector-option.physique-fit[_ngcontent-%COMP%] {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.mobile-profile-selector-option.physique-curvy[_ngcontent-%COMP%] {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n}\n.mobile-profile-selector-option.physique-muscular[_ngcontent-%COMP%] {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n}\n.mobile-profile-selector-option.physique-average[_ngcontent-%COMP%] {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .values-selector-popup.profile-selector-popup[_ngcontent-%COMP%] {\n  gap: 0.56rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.44rem;\n  padding-bottom: 0.22rem;\n  border-bottom: 1px solid rgba(74, 102, 139, 0.22);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-head-label[_ngcontent-%COMP%] {\n  color: #203c64;\n  font-size: 0.82rem;\n  font-weight: 800;\n  line-height: 1.2;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-clear[_ngcontent-%COMP%] {\n  border: 1px solid rgba(41, 73, 110, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.82);\n  color: #284970;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.3rem 0.52rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-clear.is-hidden[_ngcontent-%COMP%] {\n  visibility: hidden;\n  pointer-events: none;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-selected[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(35, 68, 107, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.92);\n  color: #234368;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.26rem 0.48rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.16rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-empty[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.74rem;\n  color: rgba(31, 54, 86, 0.62);\n  font-style: italic;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.34rem;\n  border: 1px solid transparent;\n  border-radius: 12px;\n  padding: 0.4rem 0.42rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-head[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag[_ngcontent-%COMP%] {\n  border-radius: 999px;\n  border: 1px solid rgba(52, 86, 128, 0.28);\n  background: rgba(255, 255, 255, 0.74);\n  color: #2f527d;\n  font-size: 0.67rem;\n  font-weight: 800;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.2rem 0.52rem;\n  text-transform: uppercase;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 1px;\n  background: rgba(84, 111, 147, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip-grid[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.36rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(41, 70, 106, 0.22);\n  border-radius: 999px;\n  background: #f4f8ff;\n  color: #234066;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 700;\n  padding: 0.3rem 0.58rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  cursor: pointer;\n  transition:\n    background-color 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip.active[_ngcontent-%COMP%] {\n  border-color: rgba(27, 85, 158, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #dcebff 0%,\n      #cfe3ff 100%);\n  color: #123e70;\n  box-shadow: inset 0 0 0 1px rgba(30, 73, 127, 0.24), 0 1px 2px rgba(24, 53, 86, 0.16);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-family[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 232, 219, 0.52) 0%,\n      rgba(255, 232, 219, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-ambition[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 242, 216, 0.52) 0%,\n      rgba(255, 242, 216, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-lifestyle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(221, 241, 239, 0.56) 0%,\n      rgba(221, 241, 239, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-beliefs[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-social[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(223, 236, 255, 0.5) 0%,\n      rgba(223, 236, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-arts[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(235, 227, 255, 0.5) 0%,\n      rgba(235, 227, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-food[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 236, 221, 0.52) 0%,\n      rgba(255, 236, 221, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(222, 243, 231, 0.56) 0%,\n      rgba(222, 243, 231, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-mind[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(219, 242, 238, 0.56) 0%,\n      rgba(219, 242, 238, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-identity[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-family[_ngcontent-%COMP%] {\n  border-color: rgba(156, 94, 51, 0.34);\n  color: #9c5e33;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-ambition[_ngcontent-%COMP%] {\n  border-color: rgba(160, 106, 20, 0.34);\n  color: #9b6717;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-lifestyle[_ngcontent-%COMP%] {\n  border-color: rgba(47, 123, 119, 0.34);\n  color: #2f7b77;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-beliefs[_ngcontent-%COMP%] {\n  border-color: rgba(95, 78, 160, 0.34);\n  color: #5f4ea0;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-social[_ngcontent-%COMP%] {\n  border-color: rgba(47, 106, 175, 0.36);\n  color: #2f6aaf;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-arts[_ngcontent-%COMP%] {\n  border-color: rgba(106, 87, 168, 0.36);\n  color: #6a57a8;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-food[_ngcontent-%COMP%] {\n  border-color: rgba(170, 97, 28, 0.34);\n  color: #a55e18;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-active[_ngcontent-%COMP%] {\n  border-color: rgba(49, 124, 82, 0.36);\n  color: #317c52;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-mind[_ngcontent-%COMP%] {\n  border-color: rgba(37, 124, 118, 0.34);\n  color: #2b7c76;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-identity[_ngcontent-%COMP%] {\n  border-color: rgba(98, 84, 163, 0.34);\n  color: #6254a3;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-family[_ngcontent-%COMP%] {\n  background: rgba(156, 94, 51, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-ambition[_ngcontent-%COMP%] {\n  background: rgba(160, 106, 20, 0.32);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-lifestyle[_ngcontent-%COMP%] {\n  background: rgba(47, 123, 119, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-beliefs[_ngcontent-%COMP%] {\n  background: rgba(95, 78, 160, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-social[_ngcontent-%COMP%] {\n  background: rgba(47, 106, 175, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-arts[_ngcontent-%COMP%] {\n  background: rgba(106, 87, 168, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-food[_ngcontent-%COMP%] {\n  background: rgba(170, 97, 28, 0.32);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-active[_ngcontent-%COMP%] {\n  background: rgba(49, 124, 82, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-mind[_ngcontent-%COMP%] {\n  background: rgba(37, 124, 118, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-identity[_ngcontent-%COMP%] {\n  background: rgba(98, 84, 163, 0.3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.status-option) {\n  background: #f0f5fc;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.mdc-list-item--selected:not(.mdc-list-item--disabled) {\n  filter: brightness(0.95);\n  box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.2);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option {\n  background: #fff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option:not(:last-child) {\n  border-bottom: 1px solid #e6edf7;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.hide-selected-option, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.hide-selected-option {\n  min-height: 0 !important;\n  height: 0 !important;\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  border: 0 !important;\n  margin: 0 !important;\n  opacity: 0 !important;\n  pointer-events: none !important;\n  overflow: hidden !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option {\n  background: #fff;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel {\n  margin-top: 8px !important;\n  margin-bottom: 8px !important;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .cdk-overlay-pane .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .cdk-overlay-pane .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above {\n  margin-top: 0 !important;\n  margin-bottom: 18px !important;\n  transform: translateY(-10px) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public {\n  --mdc-list-list-item-container-color: #def3e9;\n  --mat-mdc-option-selected-container-color: #def3e9;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #def3e9) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends {\n  --mdc-list-list-item-container-color: #e3eefb;\n  --mat-mdc-option-selected-container-color: #e3eefb;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e3eefb) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host {\n  --mdc-list-list-item-container-color: #f3ead8;\n  --mat-mdc-option-selected-container-color: #f3ead8;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3ead8) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive {\n  --mdc-list-list-item-container-color: #eceff3;\n  --mat-mdc-option-selected-container-color: #eceff3;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eceff3) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon {\n  color: #2f8f66 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon {\n  color: #1b57a1 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon {\n  color: #87580f !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon {\n  color: #5b6573 !important;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-slim {\n  background: #eaf4ff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-lean {\n  background: #edf8f4;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-athletic {\n  background: #e8f5ec;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-fit {\n  background: #f1f2ff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-curvy {\n  background: #fff2f8;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-muscular {\n  background: #fbf4ea;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-average {\n  background: #eff4f9;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-slim .status-option-content {\n  color: #3f7ab3;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-lean .status-option-content {\n  color: #3f8f5f;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-athletic .status-option-content {\n  color: #2f7e4d;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-fit .status-option-content {\n  color: #465fbb;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-curvy .status-option-content {\n  color: #a14875;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-muscular .status-option-content {\n  color: #7d4f24;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-average .status-option-content {\n  color: #4d667f;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.physique-options-panel {\n  width: auto !important;\n  max-width: 220px !important;\n  min-width: 0 !important;\n}\n[_nghost-%COMP%]     .physique-options-panel .mat-mdc-option {\n  padding-right: 8px;\n}\n[_nghost-%COMP%]     .physique-options-panel .mat-mdc-option .mat-pseudo-checkbox {\n  margin-left: 4px;\n}\n@media (max-width: 760px) {\n  .experience-form-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    max-width: none;\n    justify-content: stretch;\n    row-gap: 0.72rem;\n  }\n  .experience-date-range-label[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n  }\n  .experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-container[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);\n  }\n  .profile-details-privacy-fab[_ngcontent-%COMP%]   .privacy-fab-actions[_ngcontent-%COMP%] {\n    position: fixed;\n    left: 0.5rem;\n    right: 0.5rem;\n    bottom: max(0.5rem, env(safe-area-inset-bottom));\n    top: auto;\n    transform: translateY(12px) scale(0.98);\n    transform-origin: bottom center;\n    justify-content: center;\n    gap: 0.46rem;\n    padding: 0.46rem 0.56rem;\n    border: 1px solid rgba(42, 68, 102, 0.2);\n    border-radius: 14px;\n    background: #fff;\n    box-shadow: 0 -12px 24px rgba(18, 31, 51, 0.22);\n  }\n  .profile-details-privacy-fab.open[_ngcontent-%COMP%]   .privacy-fab-actions[_ngcontent-%COMP%] {\n    transform: translateY(0) scale(1);\n  }\n}\n.smart-list-stage[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  min-height: 0;\n  overflow: hidden;\n}\n.smart-list-stage__list-shell[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  min-height: 0;\n  height: 100%;\n  overflow: hidden;\n}\n.smart-list-stage__list-shell[_ngcontent-%COMP%]    > app-smart-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex: 1 1 auto;\n  min-height: 0;\n}\n.smart-list-stage__list-shell.is-occluded[_ngcontent-%COMP%] {\n  opacity: 0;\n  pointer-events: none;\n}\n.smart-list-stage__overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  z-index: 4;\n  display: flex;\n  flex-direction: column;\n  min-height: 0;\n  pointer-events: none;\n}\n.smart-list-stage__overlay[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%] {\n  pointer-events: auto;\n}\n[_nghost-%COMP%] {\n  --activities-shell-z-index: 2300;\n  display: contents;\n}\n.activities-mobile-rate-filter-group[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n  cursor: default;\n  pointer-events: auto;\n  font-size: 0.72rem;\n  font-weight: 800;\n  letter-spacing: 0.01em;\n  color: rgba(25, 48, 79, 0.62);\n  background:\n    linear-gradient(\n      180deg,\n      #f6f9ff 0%,\n      #edf3ff 100%);\n}\n.activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-mobile-rate-filter-group.rate-filter-group-single[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef3fb 0%,\n      #e7edf8 100%);\n  border-color: rgba(84, 104, 136, 0.3);\n  color: #3f5779;\n}\n.activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-mobile-rate-filter-group.rate-filter-group-pair[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef8f5 0%,\n      #e5f2ee 100%);\n  border-color: rgba(47, 142, 125, 0.3);\n  color: #2a6c61;\n  margin-top: 0.28rem;\n}\n.activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-mobile-rate-filter-group[_ngcontent-%COMP%] {\n  width: fit-content;\n  min-width: 0;\n  justify-self: start;\n  justify-content: flex-start;\n  border-radius: 7px;\n  min-height: 26px;\n  padding: 0.18rem 0.44rem;\n  padding-left: 0;\n  padding-right: 0;\n  font-size: 0.64rem;\n  font-weight: 800;\n  letter-spacing: 0.03em;\n  text-transform: uppercase;\n  box-shadow: none;\n  filter: none;\n}\n.activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-mobile-rate-filter-group[_ngcontent-%COMP%]   .mobile-profile-selector-option-main[_ngcontent-%COMP%] {\n  gap: 0.26rem;\n  padding-left: 0.44rem;\n  padding-right: 0.44rem;\n}\n.activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-mobile-rate-filter-group[_ngcontent-%COMP%]   .mobile-profile-selector-option-main[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-mobile-rate-filter-group.is-group-separator-mobile[_ngcontent-%COMP%] {\n  padding-top: 0.18rem;\n}\n.activities-mobile-rate-filter-group-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.42rem;\n  width: 100%;\n  padding-top: 0.28rem;\n}\n.activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-mobile-rate-filter-group-row[_ngcontent-%COMP%]   .activities-mobile-rate-filter-group[_ngcontent-%COMP%] {\n  margin-top: 0;\n}\n.activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .mobile-profile-selector-option-main[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n  min-width: 0;\n  text-align: left;\n}\n.activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .mobile-profile-selector-option-main[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.activity-filter-rates[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff7df 0%,\n      #ffefc8 100%);\n  border-color: rgba(200, 146, 30, 0.34);\n}\n.activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.activity-filter-chat[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f7ff 0%,\n      #e8f2ff 100%);\n  border-color: rgba(63, 116, 178, 0.32);\n}\n.activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.activity-filter-invitations[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f4ff 0%,\n      #efeafd 100%);\n  border-color: rgba(115, 88, 176, 0.32);\n}\n.activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.activity-filter-events[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff7f0 0%,\n      #ffefdf 100%);\n  border-color: rgba(208, 125, 51, 0.32);\n}\n.activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.activity-filter-hosting[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f1fbfa 0%,\n      #e6f5f2 100%);\n  border-color: rgba(47, 142, 157, 0.32);\n}\n.activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.activity-filter-drafts[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f8fc 0%,\n      #ebeff7 100%);\n  border-color: rgba(91, 102, 127, 0.32);\n}\n.activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.activity-filter-trash[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4f6 0%,\n      #ffe9ee 100%);\n  border-color: rgba(177, 73, 92, 0.32);\n}\n.activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.chat-context-filter-all[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f6fb 0%,\n      #edf2f8 100%);\n  border-color: rgba(84, 110, 145, 0.28);\n}\n.activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.chat-context-filter-event[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f7ff 0%,\n      #e8f2ff 100%);\n  border-color: rgba(63, 116, 178, 0.32);\n}\n.activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.chat-context-filter-sub-event[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff5ec 0%,\n      #feead9 100%);\n  border-color: rgba(151, 92, 41, 0.32);\n}\n.activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.chat-context-filter-group[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf9f4 0%,\n      #e1f3ea 100%);\n  border-color: rgba(37, 127, 95, 0.32);\n}\n.activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.support-case-filter-all[_ngcontent-%COMP%], \n.activities-support-case-filter-select.support-case-filter-all[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f7fb 0%,\n      #edf3f8 100%);\n  border-color: rgba(76, 104, 140, 0.28);\n}\n.activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.support-case-filter-pending[_ngcontent-%COMP%], \n.activities-support-case-filter-select.support-case-filter-pending[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff5ef 0%,\n      #ffe9df 100%);\n  border-color: rgba(209, 102, 67, 0.34);\n}\n.activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.support-case-filter-picked[_ngcontent-%COMP%], \n.activities-support-case-filter-select.support-case-filter-picked[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eff6ff 0%,\n      #e3effb 100%);\n  border-color: rgba(73, 128, 190, 0.32);\n}\n.activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.support-case-filter-solved[_ngcontent-%COMP%], \n.activities-support-case-filter-select.support-case-filter-solved[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eefbf3 0%,\n      #e0f4e8 100%);\n  border-color: rgba(65, 155, 105, 0.32);\n}\n.activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.support-case-filter-blocked[_ngcontent-%COMP%], \n.activities-support-case-filter-select.support-case-filter-blocked[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f3 0%,\n      #ffe4e8 100%);\n  border-color: rgba(176, 73, 85, 0.32);\n}\n.activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option.rate-filter-item-individual-given[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f3 0%,\n      #ffe6ea 100%);\n  border-color: rgba(169, 72, 90, 0.32);\n  color: #a1485a;\n}\n.activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option.rate-filter-item-individual-received[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n  color: #2d5ea8;\n}\n.activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option.rate-filter-item-individual-mutual[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3ff 0%,\n      #e8eafb 100%);\n  border-color: rgba(79, 104, 168, 0.32);\n  color: #4f68a8;\n}\n.activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option.rate-filter-item-individual-met[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option.rate-filter-item-pair-given[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff5ec 0%,\n      #feead9 100%);\n  border-color: rgba(151, 92, 41, 0.32);\n  color: #8a5428;\n}\n.activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option.rate-filter-item-pair-received[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf9f4 0%,\n      #e1f3ea 100%);\n  border-color: rgba(37, 127, 95, 0.32);\n  color: #236d51;\n}\n.activities-rate-social-badge-toggle[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .activities-rate-social-badge-toggle {\n  appearance: none;\n  -webkit-appearance: none;\n  border: 1px solid rgba(82, 106, 143, 0.28);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #eef3fb 100%);\n  color: #355178;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.12rem;\n  min-height: 24px;\n  padding: 0.16rem 0.44rem;\n  font: inherit;\n  font-size: 0.64rem;\n  font-weight: 800;\n  line-height: 1;\n  white-space: nowrap;\n  cursor: pointer;\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.7), 0 1px 2px rgba(24, 42, 68, 0.08);\n  transition:\n    background 0.18s ease,\n    border-color 0.18s ease,\n    color 0.18s ease,\n    box-shadow 0.18s ease,\n    transform 0.14s ease;\n  text-transform: none;\n  letter-spacing: 0;\n}\n.activities-rate-social-badge-toggle[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .activities-rate-social-badge-toggle .mat-icon {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n  flex: 0 0 13px;\n  margin-right: 0px;\n}\n.activities-rate-social-badge-toggle[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .activities-rate-social-badge-toggle > span {\n  display: inline-flex;\n  align-items: center;\n  font-size: inherit;\n  font-weight: inherit;\n  line-height: 1;\n  letter-spacing: 0;\n  text-transform: none;\n  white-space: nowrap;\n}\n.activities-rate-social-badge-toggle-inline[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .activities-rate-social-badge-toggle-inline {\n  min-height: 22px;\n  padding: 0.1rem 0.38rem;\n  font-size: 0.6rem;\n  margin-left: auto;\n  flex: 0 0 auto;\n}\n.activities-rate-social-badge-toggle-mobile[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  margin-top: 0.28rem;\n}\n.activities-rate-social-badge-toggle.is-active[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .activities-rate-social-badge-toggle.is-active {\n  border-color: rgba(42, 101, 177, 0.52);\n  background:\n    linear-gradient(\n      180deg,\n      #dfedff 0%,\n      #d1e4ff 100%);\n  color: #174b84;\n  box-shadow:\n    inset 0 0 0 1px rgba(255, 255, 255, 0.78),\n    0 0 0 1px rgba(52, 108, 180, 0.16),\n    0 5px 12px rgba(45, 92, 154, 0.16);\n}\n@media (hover: hover) and (pointer: fine) {\n  .activities-rate-social-badge-toggle[_ngcontent-%COMP%]:hover, \n   [_nghost-%COMP%]     .activities-rate-social-badge-toggle:hover {\n    border-color: rgba(63, 94, 138, 0.4);\n    transform: translateY(-1px);\n  }\n  .activities-rate-social-badge-toggle.is-active[_ngcontent-%COMP%]:hover, \n   [_nghost-%COMP%]     .activities-rate-social-badge-toggle.is-active:hover {\n    border-color: rgba(38, 94, 165, 0.6);\n  }\n}\n.activities-rate-social-badge-toggle[_ngcontent-%COMP%]:active, \n[_nghost-%COMP%]     .activities-rate-social-badge-toggle:active {\n  transform: translateY(0);\n}\n.activities-popup[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  gap: 0.45rem;\n  height: 100%;\n  min-height: 0;\n  touch-action: pan-y;\n}\n.activities-popup.activities-popup-rates-fullscreen[_ngcontent-%COMP%] {\n  background:\n    radial-gradient(\n      120% 88% at 10% 0%,\n      rgba(220, 234, 255, 0.72) 0%,\n      rgba(220, 234, 255, 0) 56%),\n    linear-gradient(\n      180deg,\n      #f9fbff 0%,\n      #eef4ff 58%,\n      #eaf1ff 100%);\n}\n.asset-item-card[_ngcontent-%COMP%] {\n  cursor: pointer;\n  width: auto;\n  max-width: 100%;\n  box-sizing: border-box;\n  transition:\n    transform 0.14s ease,\n    box-shadow 0.16s ease,\n    filter 0.16s ease;\n}\n.asset-item-card.activities-row-item[_ngcontent-%COMP%] {\n  cursor: default;\n}\n.activities-card[_ngcontent-%COMP%] {\n  position: relative;\n  border: 1px solid rgba(33, 51, 78, 0.14);\n  border-radius: 12px;\n  background: #fff;\n  padding: 0.45rem 0.5rem;\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto auto;\n  gap: 0.48rem;\n  align-items: center;\n  cursor: pointer;\n  width: 100%;\n  box-sizing: border-box;\n  will-change: transform;\n  transition: transform 0.14s ease, box-shadow 0.16s ease;\n}\n.activities-card-btn[_ngcontent-%COMP%] {\n  appearance: none;\n  -webkit-appearance: none;\n  font: inherit;\n  text-align: left;\n}\n.activities-card-chat[_ngcontent-%COMP%] {\n  grid-template-columns: auto minmax(0, 1fr) auto;\n}\n.activities-card-chat-main-event[_ngcontent-%COMP%] {\n  border-color: rgba(43, 97, 161, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #f4f9ff 0%,\n      #ebf3ff 100%);\n}\n.activities-card-chat-optional-sub-event[_ngcontent-%COMP%] {\n  border-color: rgba(143, 84, 26, 0.32);\n  background:\n    linear-gradient(\n      180deg,\n      #fff9f0 0%,\n      #fff3e1 100%);\n}\n.activities-card-chat-group-sub-event[_ngcontent-%COMP%] {\n  border-color: rgba(51, 131, 92, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #f3fcf5 0%,\n      #e9f7ee 100%);\n}\n.activities-card-chat-service-event[_ngcontent-%COMP%] {\n  border-color: rgba(202, 213, 226, 0.9);\n  background: #ffffff;\n}\n.activities-card-chat-service-asset[_ngcontent-%COMP%] {\n  border-color: rgba(190, 199, 210, 0.82);\n  background:\n    linear-gradient(\n      180deg,\n      #fbfcfd 0%,\n      #f3f6f8 100%);\n}\n.activities-card-chat-service-notification[_ngcontent-%COMP%] {\n  border-color: rgba(173, 55, 66, 0.32);\n  background:\n    linear-gradient(\n      180deg,\n      #fff7f7 0%,\n      #fdecec 100%);\n}\n.activities-card-chat-main-event[_ngcontent-%COMP%]   .activities-card-title[_ngcontent-%COMP%] {\n  color: #224d7f;\n}\n.activities-card-chat-optional-sub-event[_ngcontent-%COMP%]   .activities-card-title[_ngcontent-%COMP%] {\n  color: #86521f;\n}\n.activities-card-chat-group-sub-event[_ngcontent-%COMP%]   .activities-card-title[_ngcontent-%COMP%] {\n  color: #216b4e;\n}\n.activities-card-chat-service-event[_ngcontent-%COMP%]   .activities-card-title[_ngcontent-%COMP%] {\n  color: #163763;\n}\n.activities-card-chat-service-asset[_ngcontent-%COMP%]   .activities-card-title[_ngcontent-%COMP%] {\n  color: #324456;\n}\n.activities-card-chat-service-notification[_ngcontent-%COMP%]   .activities-card-title[_ngcontent-%COMP%] {\n  color: #9b2f3a;\n}\n.activities-card-avatar[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  border-radius: 50%;\n  color: #fff;\n  font-size: 11px;\n  font-weight: 700;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.activities-card-main[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding-right: 0;\n}\n.user-color-woman[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #d3754c,\n      #ac4a24);\n}\n.user-color-man[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #3572a4,\n      #194364);\n}\n.activities-card-title[_ngcontent-%COMP%], \n.activities-card-subtitle[_ngcontent-%COMP%], \n.activities-card-detail[_ngcontent-%COMP%] {\n  margin: 0;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.activities-card-title[_ngcontent-%COMP%] {\n  font-size: 0.83rem;\n  font-weight: 800;\n  color: #1f3658;\n}\n.activities-card-subtitle[_ngcontent-%COMP%] {\n  margin-top: 0.09rem;\n  font-size: 0.76rem;\n  color: rgba(20, 36, 58, 0.75);\n}\n.activities-card-detail[_ngcontent-%COMP%] {\n  margin-top: 0.08rem;\n  font-size: 0.73rem;\n  color: rgba(20, 36, 58, 0.64);\n}\n.activities-card-badge[_ngcontent-%COMP%] {\n  position: static;\n  justify-self: end;\n  align-self: start;\n  margin-right: 0.08rem;\n}\n.activities-chat-members-badge[_ngcontent-%COMP%] {\n  align-self: baseline;\n  justify-self: end;\n  position: relative;\n  min-width: 72px;\n  height: 28px;\n  border-radius: 999px;\n  border: 1px solid rgba(255, 255, 255, 0.86);\n  background: rgba(26, 45, 71, 0.82);\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.72rem;\n  font-weight: 800;\n  padding: 0 0.58rem;\n  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.7), 0 8px 16px rgba(255, 255, 255, 0.42);\n  white-space: nowrap;\n  margin-right: 0.4rem;\n}\n.activities-chat-unread-badge[_ngcontent-%COMP%] {\n  top: -6px;\n  right: -6px;\n  min-width: 20px;\n  height: 20px;\n  border-radius: 999px;\n  border: 1px solid #fff;\n  z-index: 2;\n}\n.activities-card-actions[_ngcontent-%COMP%] {\n  align-self: center;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.2rem;\n}\n.activities-card-action[_ngcontent-%COMP%] {\n  border: 1px solid rgba(33, 51, 78, 0.2);\n  border-radius: 999px;\n  background: #f7f9fd;\n  color: #26466d;\n  min-height: 26px;\n  padding: 0 0.52rem;\n  font-size: 0.69rem;\n  font-weight: 700;\n  cursor: pointer;\n}\n.activities-card-action-delete[_ngcontent-%COMP%] {\n  color: #8f2f32;\n  border-color: rgba(161, 56, 60, 0.28);\n  background: #fff4f4;\n}\n.activity-filter-chat[_ngcontent-%COMP%] {\n  color: #3f74b2;\n}\n.activity-filter-invitations[_ngcontent-%COMP%] {\n  color: #7358b0;\n}\n.activity-filter-events[_ngcontent-%COMP%] {\n  color: #d07d33;\n}\n.activity-filter-hosting[_ngcontent-%COMP%] {\n  color: #2f8e9d;\n}\n.activity-filter-drafts[_ngcontent-%COMP%] {\n  color: #5b667f;\n}\n.activity-filter-trash[_ngcontent-%COMP%] {\n  color: #b44c60;\n}\n.activity-filter-rates[_ngcontent-%COMP%] {\n  color: #c8921e;\n}\n.activity-filter-secondary[_ngcontent-%COMP%] {\n  color: #4f668a;\n}\n.activities-hosting-draft-toggle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4f5 0%,\n      #ffe8eb 100%);\n  border-color: rgba(183, 88, 104, 0.42);\n  color: #9b3345;\n  min-width: 108px;\n  height: 36px;\n  min-height: 36px;\n  box-sizing: content-box;\n  appearance: none;\n  -webkit-appearance: none;\n  line-height: inherit;\n  padding: 0.12rem 0.64rem 0.12rem 0.78rem;\n  position: relative;\n  overflow: visible;\n}\n.activities-hosting-draft-toggle[_ngcontent-%COMP%]   .activities-toggle-icon[_ngcontent-%COMP%] {\n  color: #a0364a;\n  opacity: 1;\n}\n.activities-hosting-draft-content[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-content: center;\n  gap: 0.26rem;\n}\n.activities-hosting-draft-label[_ngcontent-%COMP%] {\n  font-weight: 700;\n  letter-spacing: 0.01em;\n}\n.activities-toggle-icon[_ngcontent-%COMP%] {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n  line-height: 15px;\n  opacity: 0.9;\n}\n.activities-hosting-draft-toggle.is-active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f7dde1 0%,\n      #f2c8ce 100%);\n  border-color: rgba(167, 45, 66, 0.56);\n  color: #8b1f32;\n  box-shadow: 0 4px 12px rgba(186, 65, 86, 0.24);\n}\n.activities-hosting-draft-toggle.is-active[_ngcontent-%COMP%]   .activities-toggle-icon[_ngcontent-%COMP%] {\n  color: #7f1a2f;\n  font-variation-settings: "FILL" 1;\n}\n.activities-source-avatar[_ngcontent-%COMP%] {\n  font-size: 0.64rem;\n  font-weight: 800;\n  line-height: 1;\n  color: #ffffff;\n  border-color: rgba(255, 255, 255, 0.94);\n  box-shadow: 0 6px 14px rgba(8, 18, 34, 0.34);\n  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.22);\n  transition:\n    transform 0.16s ease,\n    box-shadow 0.2s ease,\n    filter 0.2s ease;\n  cursor: default;\n  pointer-events: none;\n}\n.activities-source-avatar.user-color-man[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #3572a4,\n      #194364);\n}\n.activities-source-avatar.user-color-woman[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #d3754c,\n      #ac4a24);\n}\n.activities-source-avatar.activities-source-tone-1[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #3572a4,\n      #194364);\n}\n.activities-source-avatar.activities-source-tone-2[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #c56841,\n      #8f381d);\n}\n.activities-source-avatar.activities-source-tone-3[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #3c9d78,\n      #1f6450);\n}\n.activities-source-avatar.activities-source-tone-4[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #7b63c7,\n      #4d3a8f);\n}\n.activities-source-avatar.activities-source-tone-5[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #bf5f8f,\n      #883b65);\n}\n.activities-source-avatar.activities-source-tone-6[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #4895ad,\n      #285c79);\n}\n.activities-source-avatar.activities-source-tone-7[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #b47c3b,\n      #7e5325);\n}\n.activities-source-avatar.activities-source-tone-8[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #5673bf,\n      #324a8a);\n}\n.activities-source-avatar[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  text-transform: uppercase;\n}\n.activities-row-item[_ngcontent-%COMP%]   .asset-occupancy-badge[_ngcontent-%COMP%] {\n  transition:\n    transform 0.16s ease,\n    box-shadow 0.2s ease,\n    filter 0.2s ease,\n    border-color 0.2s ease;\n}\n.activities-row-item.activities-row-item-full[_ngcontent-%COMP%] {\n  border-color: rgba(201, 83, 83, 0.42);\n  background:\n    linear-gradient(\n      180deg,\n      #fff8f8 0%,\n      #fff1f1 100%);\n}\n.activities-row-item.activities-row-item-draft[_ngcontent-%COMP%] {\n  border-color: rgba(96, 108, 136, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #fafbff 0%,\n      #f0f3fb 100%);\n  box-shadow: 0 8px 18px rgba(74, 88, 118, 0.08);\n}\n.activities-row-item.activities-row-item-draft[_ngcontent-%COMP%]   .experience-item-meta[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%], \n.activities-row-item.activities-row-item-draft[_ngcontent-%COMP%]   .activities-event-meta-row[_ngcontent-%COMP%] {\n  color: #52617d;\n}\n.activities-row-item.activities-row-item-draft[_ngcontent-%COMP%]   .experience-item-icon[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef2fa 0%,\n      #e2e8f4 100%);\n  border-color: rgba(94, 107, 135, 0.26);\n}\n.activities-row-item[_ngcontent-%COMP%]   .asset-occupancy-badge.asset-occupancy-badge-full[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #b84f4f 0%,\n      #963636 100%);\n  box-shadow: 0 7px 16px rgba(72, 24, 24, 0.36), inset 0 0 0 1px rgba(111, 38, 38, 0.6);\n}\n@media (hover: hover) and (pointer: fine) {\n  .activities-row-item[_ngcontent-%COMP%]   .asset-occupancy-badge[_ngcontent-%COMP%]:hover {\n    transform: translateY(-1px) scale(1.03);\n    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.82), 0 11px 24px rgba(255, 255, 255, 0.62);\n    filter: brightness(1.08) saturate(1.04);\n  }\n}\n.activities-row-item[_ngcontent-%COMP%]   .asset-occupancy-badge[_ngcontent-%COMP%]:active {\n  transform: scale(0.94);\n}\n.popup-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.link-btn[_ngcontent-%COMP%] {\n  border: 1px solid var(--line-strong);\n  border-radius: 999px;\n  background: #fff;\n  color: #1f3350;\n  font: inherit;\n  font-size: 0.83rem;\n  padding: 0.38rem 0.76rem;\n  cursor: pointer;\n}\n.neutral-btn[_ngcontent-%COMP%] {\n  background: #f2f4fa;\n  border-color: rgba(23, 33, 54, 0.12);\n}\n.badge-dot[_ngcontent-%COMP%], \n.card-badge[_ngcontent-%COMP%] {\n  min-width: 22px;\n  height: 22px;\n  border-radius: 50%;\n  background: #d84d4d;\n  color: #fff;\n  font-size: 11px;\n  font-weight: 700;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.experience-item-card[_ngcontent-%COMP%] {\n  position: relative;\n  border: 1px solid rgba(58, 81, 114, 0.24);\n  border-radius: 12px;\n  padding: 0.58rem 0.62rem;\n  display: grid;\n  gap: 0.32rem;\n}\n.experience-item-head[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: flex-start;\n  gap: 0.46rem;\n}\n.experience-item-icon[_ngcontent-%COMP%] {\n  width: 28px;\n  height: 28px;\n  margin-top: 1px;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(255, 255, 255, 0.76);\n  border: 1px solid rgba(58, 81, 114, 0.18);\n}\n.experience-item-icon[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.experience-item-icon.experience-item-icon-event-visibility-public[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef7ff 0%,\n      #e5f2ff 100%);\n  border-color: rgba(46, 111, 178, 0.34);\n}\n.experience-item-icon.experience-item-icon-event-visibility-friends[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f1f8ef 0%,\n      #e9f3e6 100%);\n  border-color: rgba(54, 129, 72, 0.34);\n}\n.experience-item-icon.experience-item-icon-event-visibility-invitation[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff5ea 0%,\n      #ffe9d9 100%);\n  border-color: rgba(185, 113, 45, 0.36);\n}\n.experience-item-icon.experience-item-icon-event-visibility-public[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f6cae;\n}\n.experience-item-icon.experience-item-icon-event-visibility-friends[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #368148;\n}\n.experience-item-icon.experience-item-icon-event-visibility-invitation[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #b9712d;\n}\n.experience-item-meta[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.experience-item-meta[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.84rem;\n  font-weight: 800;\n  color: #223d62;\n}\n.experience-item-meta[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.04rem 0 0;\n  font-size: 0.74rem;\n  color: rgba(23, 41, 66, 0.72);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.experience-item-meta[_ngcontent-%COMP%]   p.activities-event-meta-row[_ngcontent-%COMP%] {\n  margin-top: 0.03rem;\n  font-weight: 700;\n}\n.experience-item-meta[_ngcontent-%COMP%]   p.activities-event-meta-row-date[_ngcontent-%COMP%] {\n  color: rgba(23, 41, 66, 0.75);\n}\n.experience-item-meta[_ngcontent-%COMP%]   p.activities-event-meta-row-location[_ngcontent-%COMP%] {\n  color: rgba(23, 41, 66, 0.64);\n}\n.experience-item-description[_ngcontent-%COMP%] {\n  font-size: 0.76rem;\n  color: rgba(20, 37, 61, 0.84);\n}\n.experience-item-actions[_ngcontent-%COMP%] {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n}\n.asset-item-card[_ngcontent-%COMP%]   .experience-item-head[_ngcontent-%COMP%] {\n  grid-template-columns: auto minmax(0, 1fr) auto auto;\n}\n.asset-card-image[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 130px;\n  border-radius: 10px;\n  border: 1px solid rgba(36, 64, 98, 0.2);\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n  position: relative;\n  transition: opacity 100ms ease-in;\n}\n.asset-card-image.lazy-bg-loading[_ngcontent-%COMP%] {\n  opacity: 0;\n}\n.asset-card-image.lazy-bg-loaded[_ngcontent-%COMP%] {\n  opacity: 1;\n}\n.asset-occupancy-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.38rem;\n  right: 0.38rem;\n  min-width: 36px;\n  height: 28px;\n  border-radius: 999px;\n  border: 1px solid rgba(255, 255, 255, 0.86);\n  background: rgba(26, 45, 71, 0.82);\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.72rem;\n  font-weight: 800;\n  padding: 0 0.58rem;\n  cursor: pointer;\n  position: absolute;\n  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.7), 0 8px 16px rgba(255, 255, 255, 0.42);\n  transition:\n    transform 0.14s ease,\n    box-shadow 0.14s ease,\n    filter 0.14s ease;\n  overflow: visible;\n}\n.asset-occupancy-badge[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.82), 0 10px 22px rgba(255, 255, 255, 0.58);\n  filter: brightness(1.06);\n}\n.asset-occupancy-badge[_ngcontent-%COMP%]:active {\n  transform: scale(0.96);\n}\n.asset-occupancy-badge.asset-occupancy-badge-static[_ngcontent-%COMP%] {\n  cursor: default;\n  border: 0;\n  box-shadow: none;\n}\n.asset-occupancy-badge.asset-occupancy-badge-static[_ngcontent-%COMP%]:hover, \n.asset-occupancy-badge.asset-occupancy-badge-static[_ngcontent-%COMP%]:active {\n  transform: none;\n  filter: none;\n  box-shadow: none;\n}\n.asset-occupancy-badge[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.asset-request-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -12px;\n  right: -12px;\n  min-width: 20px;\n  height: 20px;\n  border-radius: 999px;\n  border: 1px solid #fff;\n  z-index: 2;\n}\n.asset-source-icon[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.38rem;\n  left: 0.38rem;\n  width: 28px;\n  min-width: 28px;\n  height: 28px;\n  border-radius: 50%;\n  border: 1px solid rgba(255, 255, 255, 0.9);\n  background: rgba(244, 248, 255, 0.9);\n  color: #2d5ea8;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 2;\n  padding: 0;\n  cursor: pointer;\n  text-decoration: none;\n}\n.asset-source-icon.activities-source-avatar[_ngcontent-%COMP%] {\n  color: #fff;\n  cursor: default;\n}\n.asset-source-icon[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.image-stack-indicators[_ngcontent-%COMP%] {\n  position: absolute;\n  width: auto !important;\n  top: -0.1rem;\n  left: 0.25rem;\n  right: 0.25rem;\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));\n  gap: 4px;\n  width: 100%;\n}\n.image-stack-hit-area[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 10px;\n  left: 10px;\n  right: 10px;\n  bottom: 10px;\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));\n  gap: 4px;\n  z-index: 2;\n}\n.image-stack-hit-segment[_ngcontent-%COMP%] {\n  border: 0;\n  background: transparent;\n  padding: 0;\n  cursor: pointer;\n}\n.activities-chat-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.52rem;\n  border: 1px solid rgba(43, 97, 161, 0.28);\n  border-radius: 12px;\n  background:\n    linear-gradient(\n      180deg,\n      #f7fbff 0%,\n      #edf4ff 100%);\n  padding: 0.54rem 0.6rem;\n}\n.activities-row-item-clickable[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n.activities-chat-avatar[_ngcontent-%COMP%] {\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  border: 1px solid rgba(255, 255, 255, 0.86);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.66rem;\n  font-weight: 800;\n  color: #fff;\n}\n.activities-chat-meta[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.04rem;\n}\n.activities-chat-meta-top[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.44rem;\n}\n.activities-chat-title[_ngcontent-%COMP%] {\n  min-width: 0;\n  font-size: 0.82rem;\n  font-weight: 800;\n  color: #1e3658;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.activities-chat-time[_ngcontent-%COMP%] {\n  font-size: 0.69rem;\n  font-weight: 700;\n  color: rgba(22, 40, 64, 0.68);\n  white-space: nowrap;\n}\n.activities-chat-preview[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.74rem;\n  color: rgba(22, 40, 64, 0.72);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.activities-chat-badge[_ngcontent-%COMP%] {\n  min-width: 22px;\n  height: 22px;\n  font-size: 11px;\n}\n.activities-rates-fullscreen-nav[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.44rem;\n  padding: 0.1rem 0.08rem 0.12rem;\n}\n.activities-rates-fullscreen-counter[_ngcontent-%COMP%] {\n  font-size: 0.76rem;\n  font-weight: 800;\n  color: #203c61;\n}\n.activities-rates-fullscreen-empty[_ngcontent-%COMP%] {\n  height: 100%;\n  display: grid;\n  place-items: center;\n  color: rgba(24, 44, 72, 0.72);\n  font-size: 0.84rem;\n  font-weight: 700;\n}\n.activities-rate-pair-split-handle[_ngcontent-%COMP%] {\n  position: absolute;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  left: var(--activities-pair-split);\n  top: var(--activities-pair-pad);\n  bottom: var(--activities-pair-pad);\n  width: 20px;\n  transform: translateX(-50%);\n  border: 0;\n  padding: 0;\n  margin: 0;\n  background: transparent;\n  z-index: 26;\n  touch-action: none;\n  cursor: ew-resize;\n}\n.activities-rate-pair-split-handle[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  inset: 0;\n}\n.activities-rate-pair-split-handle[_ngcontent-%COMP%]::after {\n  content: "";\n  width: 4px;\n  height: 36%;\n  min-height: 52px;\n  border-radius: 999px;\n  border: 1px solid rgba(166, 196, 232, 0.74);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(241, 247, 255, 0.94) 0%,\n      rgba(218, 232, 249, 0.9) 100%);\n  box-shadow: 0 0 0 1px rgba(9, 22, 40, 0.14), 0 8px 14px rgba(6, 18, 36, 0.34);\n}\n.rate-filter-group-label[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.4rem;\n  width: 100%;\n  font-weight: 800;\n  font-size: 0.64rem;\n  color: #1f3658;\n  text-transform: uppercase;\n  letter-spacing: 0.03em;\n}\n.rate-filter-group-label-with-toggle[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n  align-items: center;\n  gap: 0.28rem;\n}\n.rate-filter-group-title[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.rate-filter-group-title-chip[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  min-height: 22px;\n  padding: 0.12rem 0.44rem;\n  border-radius: 7px;\n  background:\n    linear-gradient(\n      180deg,\n      #eef3fb 0%,\n      #e7edf8 100%);\n  border: 1px solid rgba(84, 104, 136, 0.24);\n  color: #3f5779;\n  flex: 0 0 auto;\n  margin-right: auto;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.rate-filter-group-option.is-group-separator .rate-filter-group-title-chip {\n  background:\n    linear-gradient(\n      180deg,\n      #eef8f5 0%,\n      #e5f2ee 100%);\n  border-color: rgba(47, 142, 125, 0.24);\n  color: #2a6c61;\n}\n.rate-filter-item-individual-given[_ngcontent-%COMP%] {\n  color: #a1485a;\n}\n.rate-filter-item-individual-received[_ngcontent-%COMP%] {\n  color: #2d5ea8;\n}\n.rate-filter-item-individual-mutual[_ngcontent-%COMP%] {\n  color: #4f68a8;\n}\n.rate-filter-item-individual-met[_ngcontent-%COMP%] {\n  color: #2d7d47;\n}\n.rate-filter-item-pair-given[_ngcontent-%COMP%] {\n  color: #8a5428;\n}\n.rate-filter-item-pair-received[_ngcontent-%COMP%] {\n  color: #236d51;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option {\n  background: #fff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option:not(:last-child) {\n  border-bottom: 1px solid #e6edf7;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.activity-filter-chat {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eef5ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.activity-filter-invitations {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f4efff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.activity-filter-events {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff5ec);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.activity-filter-hosting {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf9f4);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.activity-filter-drafts {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eef2f9);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.activity-filter-trash {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff0f3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.activity-filter-rates {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff6df);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.chat-context-filter-all {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f1f4fa);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.chat-context-filter-event {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eef5ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.chat-context-filter-sub-event {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff5ec);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.chat-context-filter-group {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf9f4);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.rate-filter-group-option {\n  background: #fff;\n  opacity: 1;\n  pointer-events: auto;\n  min-height: 28px;\n  cursor: default;\n  padding-left: 0;\n  padding-right: 0;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.rate-filter-group-option.mdc-list-item--disabled, \n[_nghost-%COMP%]     .mat-mdc-option.status-option.rate-filter-group-option[aria-disabled=true] {\n  opacity: 1;\n  color: inherit;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.rate-filter-group-option.is-group-separator {\n  border-top: 1px solid rgba(92, 110, 140, 0.28);\n  margin-top: 0.28rem;\n  padding-top: 0.34rem;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.rate-filter-group-option .mdc-list-item__primary-text {\n  width: 100%;\n  opacity: 1;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.rate-filter-group-option .activities-rate-social-badge-toggle {\n  pointer-events: auto;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.rate-filter-item-individual-given {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1f3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.rate-filter-item-individual-received {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf4ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.rate-filter-item-individual-mutual {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f2f3ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.rate-filter-item-individual-met {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf8ee);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.rate-filter-item-pair-given {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff5ec);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.rate-filter-item-pair-received {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf9f4);\n}\n@media (max-width: 760px) {\n  .activities-mobile-filter-panel[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%] {\n    position: fixed;\n    left: 0.65rem !important;\n    right: 0.65rem !important;\n    top: auto !important;\n    bottom: 0;\n    width: auto;\n    max-width: calc(100vw - 1.3rem);\n    max-height: min(54vh, 420px);\n    min-width: 0;\n    border-radius: 16px 16px 0 0;\n    border: 1px solid #d6deea;\n    border-bottom: 0;\n    box-shadow: 0 -14px 28px rgba(15, 29, 52, 0.24);\n    padding: 0.84rem 0.6rem max(0.62rem, env(safe-area-inset-bottom));\n    gap: 0.32rem;\n    overflow-x: hidden;\n    overflow-y: auto;\n    z-index: 2805;\n  }\n  .activities-mobile-rate-filter-panel[_ngcontent-%COMP%] {\n    max-height: min(100dvh - 4.6rem, 560px);\n  }\n  .activities-mobile-filter-panel[_ngcontent-%COMP%]::before, \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]::before {\n    content: "";\n    position: sticky;\n    top: 0;\n    display: block;\n    width: 42px;\n    height: 4px;\n    border-radius: 999px;\n    background: rgba(44, 67, 100, 0.24);\n    margin: 0 auto 0.52rem;\n    z-index: 1;\n  }\n  .experience-item-head[_ngcontent-%COMP%] {\n    grid-template-columns: auto minmax(0, 1fr) auto;\n    grid-template-areas: "icon meta actions";\n    row-gap: 0.32rem;\n  }\n  .experience-item-icon[_ngcontent-%COMP%] {\n    grid-area: icon;\n  }\n  .experience-item-meta[_ngcontent-%COMP%] {\n    grid-area: meta;\n  }\n  .experience-item-actions[_ngcontent-%COMP%] {\n    justify-self: end;\n  }\n}\n/*# sourceMappingURL=activities-popup.component.css.map */'], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ActivitiesPopupComponent, [{
    type: Component,
    args: [{ selector: "app-activities-popup", standalone: true, imports: [
      CommonModule,
      MatIconModule,
      SmartListComponent,
      ActivitiesEventTemplateComponent,
      ActivitiesChatTemplateComponent,
      ActivitiesRateTemplateComponent,
      EventCheckoutPopupComponent,
      PopupComponent
    ], providers: [AppMenuDispatcher], changeDetection: ChangeDetectionStrategy.OnPush, template: `@if (activitiesStore.activitiesOpenBoolean()) {
  <app-popup [model]="activitiesPopupModel()">
    <div class="activities-popup" [class.activities-popup-rates-fullscreen]="activitiesSmartListPresentation() === 'fullscreen'" [class.activities-popup-blocked-user]="isBlockedUser" (click)="onActivitiesPopupSurfaceClick($event)">
      <ng-template #activitiesRateFullscreenSmartListItemTemplate let-row let-renderState="renderState">
        @if (row) {
          <app-activities-rate-template
            [row]="row"
            [presentation]="'fullscreen'"
            [state]="renderState"
            [context]="activitiesRateTemplateContext"
            [cardRevision]="activitiesRateCardRevisionForRow(row)"
            (detailClick)="openProfileView($event)"
          ></app-activities-rate-template>
        }
      </ng-template>
      <app-smart-list
        #activitiesSmartList
        [config]="activitiesSmartListConfig"
        [loadPage]="activitiesSmartListLoadPage"
        [itemTemplate]="activitiesPrimaryFilter === 'rates'
          ? activitiesRateSmartListItemTemplate
          : (activitiesPrimaryFilter === 'chats'
            ? activitiesChatSmartListItemTemplate
            : activitiesEventSmartListItemTemplate)"
        [fullscreenItemTemplate]="activitiesRateFullscreenSmartListItemTemplate"
        [presentation]="activitiesSmartListPresentation()"
        [view]="activitiesView"
        [query]="activitiesSmartListQuery"
        (itemSelect)="onActivityRowClick($event)"
        (menuItemSelect)="onActivityEventSharedMenuSelect($event)"
        (stateChange)="onActivitiesSmartListStateChange($event)"
        (wheel)="activitiesRates.closeEditorFromUserScroll($event)"
        (touchmove)="activitiesRates.closeEditorFromUserScroll($event)"
      ></app-smart-list>
      <ng-template #activitiesEventSmartListItemTemplate let-row let-groupLabel="groupLabel" let-openMenu="openMenu">
        <app-activities-event-template
          [row]="row"
          [groupLabel]="groupLabel"
          [cardRevision]="activitiesEventCardRevisionForRow(row)"
          (profileClick)="openProfileView($event)"
          (mediaEndClick)="openActivityMembers(row)"
          (menuAction)="onActivityEventCardMenuAction(row, $event)"
          (menuRequest)="openMenu($event)"
        ></app-activities-event-template>
      </ng-template>
      <ng-template
        #activitiesChatSmartListItemTemplate
        let-row
        let-groupLabel="groupLabel"
        let-selectItem="selectItem"
        let-sourceItem="sourceItem"
      >
        <app-activities-chat-template
          [row]="row"
          [groupLabel]="groupLabel"
          (rowClick)="selectItem($event)"
          (supportCaseAction)="onSupportCaseAction(sourceItem, $event)"
        ></app-activities-chat-template>
      </ng-template>
      <ng-template #activitiesRateSmartListItemTemplate let-row let-groupLabel="groupLabel" let-openMenu="openMenu">
        <app-activities-rate-template
          [row]="row"
          [groupLabel]="groupLabel"
          [context]="activitiesRateTemplateContext"
          [openMenu]="openMenu"
          [cardRevision]="activitiesRateCardRevisionForRow(row)"
          (detailClick)="openProfileView($event)"
        ></app-activities-rate-template>
      </ng-template>
    </div>
  </app-popup>

  @if (eventSubeventsStore.eventSubeventsListPopup()?.host === 'activities') {
    @if (eventSubeventsStore.eventSubeventsListPopupComponent(); as subeventsPopupComponent) {
      <ng-container *ngComponentOutlet="subeventsPopupComponent"></ng-container>
    }
  }
}

<app-event-checkout-popup></app-event-checkout-popup>
`, styles: ['/* src/app/activity/components/activities-popup/activities-popup.component.scss */\n:host {\n  --interactive-motion-duration: 160ms;\n  --interactive-motion-ease: cubic-bezier(0.22, 1, 0.36, 1);\n  --interactive-hover-lift: -1px;\n  --interactive-hover-scale: 1.01;\n  --interactive-hover-brightness: 1.01;\n  --interactive-press-scale: 0.97;\n  --interactive-press-brightness: 0.97;\n}\n:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]) {\n  -webkit-tap-highlight-color: transparent;\n  transition:\n    transform var(--interactive-motion-duration) var(--interactive-motion-ease),\n    filter var(--interactive-motion-duration) var(--interactive-motion-ease),\n    box-shadow var(--interactive-motion-duration) var(--interactive-motion-ease),\n    background-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    border-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    color var(--interactive-motion-duration) var(--interactive-motion-ease);\n  transform-origin: center;\n}\n:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):focus-visible {\n  outline: 2px solid rgba(66, 110, 182, 0.44);\n  outline-offset: 2px;\n}\n@media (hover: hover) and (pointer: fine) {\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):hover {\n    transform: translateY(var(--interactive-hover-lift)) scale(var(--interactive-hover-scale));\n    filter: brightness(var(--interactive-hover-brightness));\n  }\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  :where(.motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):hover {\n    box-shadow: 0 3px 10px rgba(16, 29, 48, 0.14);\n  }\n}\n@keyframes shared-mobile-touch-feedback {\n  0% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n  45% {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  100% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n}\n@media (hover: none), (pointer: coarse) {\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    animation: shared-mobile-touch-feedback 0.2s ease;\n  }\n}\n.app-popup,\n.mobile-profile-selector-sheet-wrap,\n.popup-surface,\n.experience-form-popup {\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.app-popup button,\n.app-popup input,\n.app-popup textarea,\n.app-popup select,\n.app-popup .mat-mdc-select,\n.app-popup .mat-mdc-select-value-text,\n.app-popup .mat-mdc-option,\n.popup-surface button,\n.popup-surface input,\n.popup-surface textarea,\n.popup-surface select,\n.popup-surface .mat-mdc-select,\n.popup-surface .mat-mdc-select-value-text,\n.popup-surface .mat-mdc-option,\n.experience-form-popup button,\n.experience-form-popup input,\n.experience-form-popup textarea,\n.experience-form-popup select,\n.experience-form-popup .mat-mdc-select,\n.experience-form-popup .mat-mdc-select-value-text,\n.experience-form-popup .mat-mdc-option,\n.mobile-profile-selector-sheet-wrap button,\n.mobile-profile-selector-sheet-wrap input,\n.mobile-profile-selector-sheet-wrap .mat-mdc-option {\n  font-family: inherit;\n}\n.popup-filter-picker,\n.activities-view-picker {\n  position: relative;\n  z-index: 60;\n  margin-left: auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-filter-picker-secondary,\n.activities-secondary-picker {\n  position: relative;\n  z-index: 61;\n}\n.selector-like {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n}\n.profile-status-select-wrap.popup-compact-select,\n.profile-status-select-wrap.activities-compact-select,\n.profile-status-select-wrap.assets-compact-select {\n  width: fit-content !important;\n  min-width: 0 !important;\n  max-width: 100%;\n}\n.profile-status-select-wrap.popup-compact-select .mat-mdc-select,\n.profile-status-select-wrap.activities-compact-select .mat-mdc-select,\n.profile-status-select-wrap.assets-compact-select .mat-mdc-select {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select .mat-mdc-select-trigger,\n.profile-status-select-wrap.activities-compact-select .mat-mdc-select-trigger,\n.profile-status-select-wrap.assets-compact-select .mat-mdc-select-trigger {\n  width: auto !important;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select .status-option-content,\n.profile-status-select-wrap.activities-compact-select .status-option-content,\n.profile-status-select-wrap.assets-compact-select .status-option-content {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge,\n.profile-status-select-wrap.activities-filter-no-badge {\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge .status-option-content,\n.profile-status-select-wrap.activities-filter-no-badge .status-option-content {\n  width: auto !important;\n  flex: 0 1 auto;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select-trigger,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select-trigger {\n  width: auto !important;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select-arrow-wrapper,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select-arrow-wrapper {\n  margin-left: 0.28rem;\n}\n.profile-status-select-wrap {\n  min-width: 174px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  border: 1px solid #c8d3e2;\n  border-radius: 999px;\n  box-shadow: 0 2px 6px rgba(38, 60, 92, 0.08);\n  padding: 0.12rem 0.5rem 0.12rem 0.84rem;\n  background: #f8f9fb;\n}\n.profile-status-select-wrap.selector-like {\n  min-height: 36px;\n}\n.status-option-content {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.2rem;\n  text-transform: lowercase;\n  width: 100%;\n  min-width: 0;\n}\n.status-option-content span:last-child {\n  white-space: nowrap;\n}\n.status-option-content .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  flex: 0 0 16px;\n}\n.rate-filter-count-badge {\n  margin-left: auto;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  border: 1px solid #fff;\n  background: #d84d4d;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  font-size: 0.68rem;\n  font-weight: 800;\n  line-height: 1;\n  box-shadow: 0 2px 8px rgba(120, 24, 24, 0.22);\n}\n.rate-filter-trigger-badge {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  margin-left: 0;\n  z-index: 2;\n}\n.popup-filter-control,\n.activities-rate-filter-select,\n.activities-primary-filter-select,\n.activities-event-scope-filter-select,\n.activities-chat-context-filter-select {\n  position: relative;\n  overflow: visible;\n}\n.popup-filter-panel,\n.activities-view-picker-panel {\n  position: absolute;\n  top: calc(100% + 0.32rem);\n  right: 0;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 10px;\n  background: #fff;\n  box-shadow: 0 10px 24px rgba(17, 29, 48, 0.22);\n  padding: 0.24rem;\n  min-width: 128px;\n  z-index: 40;\n  display: grid;\n  gap: 0.16rem;\n}\n.popup-filter-option,\n.activities-view-option {\n  border: 0;\n  background: #fff;\n  border-radius: 8px;\n  min-height: 32px;\n  padding: 0.34rem 0.44rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.34rem;\n  color: #1e3658;\n  cursor: pointer;\n  text-align: left;\n}\n.popup-filter-option .mat-icon,\n.activities-view-option .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-filter-option span,\n.activities-view-option span {\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.popup-filter-option > span:not(.rate-filter-count-badge),\n.activities-view-option > span:not(.rate-filter-count-badge) {\n  flex: 1 1 auto;\n  min-width: 0;\n  text-align: left;\n}\n.popup-mobile-filter-picker,\n.activities-mobile-primary-filter-picker,\n.activities-mobile-event-scope-filter-picker,\n.activities-mobile-chat-context-filter-picker,\n.activities-mobile-rate-filter-picker {\n  position: relative;\n}\n.popup-mobile-filter-panel,\n.activities-mobile-filter-panel,\n.activities-mobile-rate-filter-panel {\n  top: calc(100% + 0.24rem);\n  right: 0;\n  min-width: 210px;\n  z-index: 65;\n}\n.popup-mobile-sheet-title,\n.activities-mobile-sheet-title {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  padding: 0 0.14rem;\n  color: #1c3354;\n  font-size: 0.94rem;\n  font-weight: 800;\n}\n.popup-mobile-sheet-title .mat-icon,\n.activities-mobile-sheet-title .mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .popup-view-fab span,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .mat-mdc-select,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .status-option-content span:last-child,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .mat-mdc-select-value-text {\n  font-weight: 400 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option .status-option-content {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  width: 100%;\n  min-width: 0;\n  column-gap: 0.34rem;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option .rate-filter-count-badge {\n  margin-left: 0;\n  justify-self: end;\n}\n:host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.selector-options-panel),\n:host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.status-options-panel) {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n@media (max-width: 760px) {\n  .popup-mobile-filter-panel .popup-filter-option,\n  .popup-mobile-filter-panel .activities-view-option,\n  .activities-mobile-filter-panel .popup-filter-option,\n  .activities-mobile-filter-panel .activities-view-option,\n  .activities-mobile-rate-filter-panel .popup-filter-option,\n  .activities-mobile-rate-filter-panel .activities-view-option {\n    width: 100%;\n    min-width: 0;\n    box-sizing: border-box;\n    border: 1px solid rgba(58, 81, 114, 0.24);\n    border-radius: 12px;\n    background: #f7f9fd;\n    min-height: 42px;\n    padding: 0.46rem 0.62rem;\n    justify-content: flex-start;\n    gap: 0.36rem;\n  }\n  .popup-mobile-filter-panel .popup-filter-option.active,\n  .popup-mobile-filter-panel .activities-view-option.active,\n  .activities-mobile-filter-panel .popup-filter-option.active,\n  .activities-mobile-filter-panel .activities-view-option.active,\n  .activities-mobile-rate-filter-panel .popup-filter-option.active,\n  .activities-mobile-rate-filter-panel .activities-view-option.active {\n    box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.24);\n    filter: brightness(0.95);\n  }\n  .popup-mobile-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .popup-mobile-filter-panel .activities-view-option .rate-filter-count-badge,\n  .activities-mobile-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .activities-mobile-filter-panel .activities-view-option .rate-filter-count-badge,\n  .activities-mobile-rate-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .activities-mobile-rate-filter-panel .activities-view-option .rate-filter-count-badge {\n    margin-left: auto;\n    flex: 0 0 auto;\n  }\n  :host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.profile-bottom-sheet-panel) {\n    position: fixed !important;\n    left: 0 !important;\n    right: 0 !important;\n    bottom: 0 !important;\n    top: auto !important;\n    width: 100vw !important;\n    max-width: 100vw !important;\n    transform: none !important;\n  }\n  :host ::ng-deep .mat-mdc-select-panel.profile-bottom-sheet-panel {\n    width: 100vw !important;\n    max-width: 100vw !important;\n    max-height: min(54vh, 420px) !important;\n    margin: 0 !important;\n    border-radius: 16px 16px 0 0 !important;\n    border: 1px solid #d6deea;\n    border-bottom: 0;\n    box-shadow: 0 -14px 28px rgba(15, 29, 52, 0.24);\n    padding-top: 0.38rem;\n    padding-bottom: max(0.55rem, env(safe-area-inset-bottom));\n  }\n}\n.popup-view-fab {\n  height: 34px;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 999px;\n  background: #f3f7ff;\n  color: #2c4c74;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0 0.62rem;\n  cursor: pointer;\n}\n.popup-view-fab .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-view-fab span {\n  font-size: 0.74rem;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.event-visibility-picker {\n  position: relative;\n  z-index: 22;\n  margin-left: auto;\n  flex: 0 0 auto;\n}\n.event-visibility-trigger {\n  flex-wrap: nowrap;\n}\n.profile-status-header-picker .event-visibility-trigger.status-public,\n.profile-status-header-picker .activities-view-option.status-public {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e6f6ef);\n}\n.profile-status-header-picker .event-visibility-trigger.status-friends,\n.profile-status-header-picker .activities-view-option.status-friends {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e8f1fd);\n}\n.profile-status-header-picker .event-visibility-trigger.status-host,\n.profile-status-header-picker .activities-view-option.status-host {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6efe2);\n}\n.profile-status-header-picker .event-visibility-trigger.status-inactive,\n.profile-status-header-picker .activities-view-option.status-inactive {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f2f3f5);\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-public,\n.profile-status-header-picker .activities-view-option.status-public .mat-icon {\n  color: #2f8f66;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-friends,\n.profile-status-header-picker .activities-view-option.status-friends .mat-icon {\n  color: #1b57a1;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-host,\n.profile-status-header-picker .activities-view-option.status-host .mat-icon {\n  color: #87580f;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-inactive,\n.profile-status-header-picker .activities-view-option.status-inactive .mat-icon {\n  color: #5b6573;\n}\n.app-popup textarea,\n.app-popup input,\n.app-popup select,\n.popup-surface textarea,\n.popup-surface input,\n.popup-surface select,\n.experience-form-popup textarea,\n.experience-form-popup input,\n.experience-form-popup select,\n.mobile-profile-selector-sheet-wrap input {\n  width: 100%;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.48rem 0.56rem;\n  font: inherit;\n  color: var(--text-main);\n  background: #fff;\n}\n.app-popup textarea,\n.popup-surface textarea,\n.experience-form-popup textarea {\n  resize: vertical;\n}\n.app-popup textarea:focus,\n.app-popup input:focus,\n.app-popup select:focus,\n.popup-surface textarea:focus,\n.popup-surface input:focus,\n.popup-surface select:focus,\n.experience-form-popup textarea:focus,\n.experience-form-popup input:focus,\n.experience-form-popup select:focus,\n.mobile-profile-selector-sheet-wrap input:focus {\n  outline: 0;\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n}\n.popup-surface-form-grid,\n.experience-form-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  max-width: none;\n  width: 100%;\n  margin: 0;\n  justify-content: stretch;\n  align-content: start;\n  align-items: start;\n  column-gap: 1rem;\n  row-gap: 0.9rem;\n}\n.popup-surface-form-grid label,\n.experience-form-grid label {\n  display: grid;\n  grid-template-rows: min-content;\n  gap: 0;\n  font-weight: 600;\n  color: rgba(26, 44, 69, 0.88);\n}\n.popup-surface-form-grid input,\n.experience-form-grid input {\n  min-height: 40px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid textarea,\n.experience-form-grid textarea {\n  min-height: 96px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid .profile-status-select-wrap.selector-like,\n.experience-form-grid .profile-status-select-wrap.selector-like {\n  min-height: 40px;\n  height: 40px;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid .mat-mdc-select-trigger,\n.experience-form-grid .mat-mdc-select-trigger {\n  min-height: 32px;\n}\n.popup-surface-description-field,\n.experience-description-field {\n  grid-column: 1/-1;\n}\n.popup-surface-actions,\n.experience-form-actions {\n  justify-content: center;\n  padding-top: 0.2rem;\n}\n.popup-actions {\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.link-btn {\n  border: 1px solid var(--line-strong);\n  border-radius: 999px;\n  background: #fff;\n  color: #1f3350;\n  font: inherit;\n  font-size: 0.83rem;\n  padding: 0.38rem 0.76rem;\n  cursor: pointer;\n}\n.neutral-btn {\n  background: #f2f4fa;\n  border-color: rgba(23, 33, 54, 0.12);\n}\n.primary-btn {\n  background: #4776b7;\n  border-color: #4776b7;\n  color: #fff;\n}\n.profile-status-select-wrap .mat-icon,\n.date-picker-btn .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: #566b86;\n}\n.profile-status-select-wrap .mat-mdc-select {\n  min-width: 80px;\n  width: 100%;\n  font-size: 0.8rem;\n  font-weight: 700;\n  text-transform: lowercase;\n}\n.profile-status-select-wrap .mat-mdc-select-trigger {\n  width: 100%;\n  justify-content: flex-start;\n}\n.profile-status-select-wrap .mat-mdc-select-arrow-wrapper {\n  margin-left: auto;\n}\n.status-public {\n  color: #2f8f66;\n}\n.status-friends {\n  color: #1b57a1;\n}\n.status-host {\n  color: #87580f;\n}\n.status-inactive {\n  color: #5b6573;\n}\n.status-option-content .status-public {\n  color: #2f8f66;\n}\n.status-option-content .status-friends {\n  color: #1b57a1;\n}\n.status-option-content .status-host {\n  color: #87580f;\n}\n.status-option-content .status-inactive {\n  color: #5b6573;\n}\n.profile-status-select-wrap.status-public .status-option-content .mat-icon {\n  color: #2f8f66;\n}\n.profile-status-select-wrap.status-friends .status-option-content .mat-icon {\n  color: #1b57a1;\n}\n.profile-status-select-wrap.status-host .status-option-content .mat-icon {\n  color: #87580f;\n}\n.profile-status-select-wrap.status-inactive .status-option-content .mat-icon {\n  color: #5b6573;\n}\n.profile-details-values-btn .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: rgba(44, 67, 100, 0.72);\n}\n.profile-details-values-btn {\n  min-height: 36px;\n  height: 36px;\n  box-sizing: border-box;\n  padding-top: 0;\n  padding-bottom: 0;\n}\n.profile-details-values-btn .status-option-content.profile-details-selected-badges {\n  display: inline-grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  column-gap: 0.26rem;\n  min-width: 0;\n  width: 100%;\n}\n.profile-details-values-btn.profile-details-values-tone-values .profile-details-inline-chip {\n  max-width: calc(100% - 2.6rem);\n}\n.profile-details-values-btn.profile-details-values-tone-interest .profile-details-inline-chip {\n  max-width: calc((100% - 3.2rem) / 2);\n}\n.profile-details-values-btn.profile-details-values-tone-values .profile-details-inline-overflow {\n  color: #1e6b5a;\n}\n.profile-details-values-btn.profile-details-values-tone-interest .profile-details-inline-overflow {\n  color: #2e5a90;\n}\n.values-header-chips {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.28rem;\n  flex: 0 0 100%;\n  margin-left: 0;\n  margin-top: 0.34rem;\n  max-width: 100%;\n  overflow: visible;\n  white-space: normal;\n  padding-bottom: 0;\n}\n.popup-title-values {\n  margin-right: 0.38rem;\n}\n.values-selected-chip {\n  border: 1px solid rgba(76, 99, 136, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9ff 0%,\n      #eef3ff 100%);\n  color: #24416a;\n  border-radius: 999px;\n  min-height: 26px;\n  padding: 0.18rem 0.46rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-size: 0.7rem;\n  font-weight: 700;\n  cursor: pointer;\n  flex: 0 0 auto;\n}\n.values-selected-chip .mat-icon {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.values-selected-chip.section-family {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1ea 0%,\n      #ffe6dd 100%);\n  border-color: rgba(160, 90, 51, 0.32);\n  color: #8b4d2b;\n}\n.values-selected-chip.section-ambition {\n  background:\n    linear-gradient(\n      180deg,\n      #fff7e8 0%,\n      #ffefd7 100%);\n  border-color: rgba(160, 106, 20, 0.32);\n  color: #9a6614;\n}\n.values-selected-chip.section-lifestyle {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f5 0%,\n      #e0f2ee 100%);\n  border-color: rgba(45, 125, 120, 0.32);\n  color: #2a6e6a;\n}\n.values-selected-chip.section-beliefs {\n  background:\n    linear-gradient(\n      180deg,\n      #f0ecff 0%,\n      #e8e1fa 100%);\n  border-color: rgba(95, 78, 160, 0.32);\n  color: #564793;\n}\n.values-selected-chip.section-social {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n  color: #2d5ea8;\n}\n.values-selected-chip.section-arts {\n  background:\n    linear-gradient(\n      180deg,\n      #f2edfb 0%,\n      #e9e2f9 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n  color: #654ca1;\n}\n.values-selected-chip.section-food {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4e8 0%,\n      #fee9d6 100%);\n  border-color: rgba(170, 97, 28, 0.32);\n  color: #9d611c;\n}\n.values-selected-chip.section-active {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.values-selected-chip.section-mind {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f6 0%,\n      #def1ee 100%);\n  border-color: rgba(37, 124, 118, 0.32);\n  color: #2d7d78;\n}\n.values-selected-chip.section-identity {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n  border-color: rgba(88, 78, 159, 0.32);\n  color: #5a4ea0;\n}\n.readonly-select {\n  width: fit-content;\n  min-width: 0;\n  max-width: 130px;\n  justify-content: center;\n  margin-top: 2px;\n  padding-left: 0.44rem;\n  padding-right: 0.44rem;\n}\n.readonly-field {\n  min-height: 34px;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.4rem 0.56rem;\n  background: #f7fafe;\n  color: #23476f;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-weight: 700;\n}\n.readonly-field .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.zodiac-symbol {\n  font-size: 1.1rem;\n  font-weight: 800;\n  line-height: 1;\n}\n.zodiac-label {\n  font-size: 0.9rem;\n  font-weight: 700;\n  min-width: 0;\n  text-align: center;\n}\n.readonly-select.zodiac-aries {\n  background: #fdf1f1;\n  color: #9f2f2f;\n}\n.readonly-select.zodiac-taurus {\n  background: #f7f3eb;\n  color: #6e4b2b;\n}\n.readonly-select.zodiac-gemini {\n  background: #fdf8e9;\n  color: #7d5a12;\n}\n.readonly-select.zodiac-cancer {\n  background: #eef4ff;\n  color: #2d5b8e;\n}\n.readonly-select.zodiac-leo {\n  background: #fff3e8;\n  color: #8f4b0d;\n}\n.readonly-select.zodiac-virgo {\n  background: #edf8ef;\n  color: #2b6b3d;\n}\n.readonly-select.zodiac-libra {\n  background: #f2eefc;\n  color: #60439d;\n}\n.readonly-select.zodiac-scorpio {\n  background: #f9edf2;\n  color: #7b3150;\n}\n.readonly-select.zodiac-sagittarius {\n  background: #eef1ff;\n  color: #2f4a9a;\n}\n.readonly-select.zodiac-capricorn {\n  background: #eff2f5;\n  color: #364653;\n}\n.readonly-select.zodiac-aquarius {\n  background: #ebf7fb;\n  color: #1d5f7a;\n}\n.readonly-select.zodiac-pisces {\n  background: #eef2ff;\n  color: #294b8f;\n}\n.physique-slim {\n  color: #3f7ab3;\n}\n.physique-lean {\n  color: #3f8f5f;\n}\n.physique-athletic {\n  color: #2f7e4d;\n}\n.physique-fit {\n  color: #465fbb;\n}\n.physique-curvy {\n  color: #a14875;\n}\n.physique-muscular {\n  color: #7d4f24;\n}\n.physique-average {\n  color: #4d667f;\n}\n.physique-select-wrap.physique-slim {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf3fb 0%,\n      #dfebf8 100%);\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.physique-select-wrap.physique-lean {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf6ee 0%,\n      #def0e5 100%);\n  border-color: rgba(63, 143, 95, 0.34);\n}\n.physique-select-wrap.physique-athletic {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f5ec 0%,\n      #dff0e6 100%);\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.physique-select-wrap.physique-fit {\n  background:\n    linear-gradient(\n      180deg,\n      #ebf0ff 0%,\n      #e1e8fc 100%);\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.physique-select-wrap.physique-curvy {\n  background:\n    linear-gradient(\n      180deg,\n      #f7edf3 0%,\n      #f0e3ec 100%);\n  border-color: rgba(161, 72, 117, 0.36);\n}\n.physique-select-wrap.physique-muscular {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe9 0%,\n      #ede3d8 100%);\n  border-color: rgba(125, 79, 36, 0.36);\n}\n.physique-select-wrap.physique-average {\n  background:\n    linear-gradient(\n      180deg,\n      #eef2f6 0%,\n      #e5ebf1 100%);\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.physique-select-wrap.physique-slim .status-option-content .mat-icon {\n  color: #3f7ab3;\n}\n.physique-select-wrap.physique-lean .status-option-content .mat-icon {\n  color: #3f8f5f;\n}\n.physique-select-wrap.physique-athletic .status-option-content .mat-icon {\n  color: #2f7e4d;\n}\n.physique-select-wrap.physique-fit .status-option-content .mat-icon {\n  color: #465fbb;\n}\n.physique-select-wrap.physique-curvy .status-option-content .mat-icon {\n  color: #a14875;\n}\n.physique-select-wrap.physique-muscular .status-option-content .mat-icon {\n  color: #7d4f24;\n}\n.physique-select-wrap.physique-average .status-option-content .mat-icon {\n  color: #4d667f;\n}\n.experience-filter-all {\n  color: #694ea6;\n}\n.experience-filter-workspace {\n  color: #a1485a;\n}\n.experience-filter-school {\n  color: #2d5ea8;\n}\n.experience-filter-online {\n  color: #2d7d47;\n}\n.experience-filter-project {\n  color: #6550a0;\n}\n.experience-filter-select.experience-filter-all,\n.experience-type-select.experience-filter-project {\n  background:\n    linear-gradient(\n      180deg,\n      #efe8ff 0%,\n      #e8defc 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n}\n.experience-filter-select.experience-filter-workspace,\n.experience-type-select.experience-filter-workspace {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f3 0%,\n      #ffe6ea 100%);\n  border-color: rgba(169, 72, 90, 0.32);\n}\n.experience-filter-select.experience-filter-school,\n.experience-type-select.experience-filter-school {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n}\n.experience-type-select.experience-filter-online {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n}\n.experience-type-select.experience-filter-project {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n}\n.experience-type-select {\n  min-width: 0;\n  max-width: 100%;\n  min-height: 40px;\n}\n.experience-type-field,\n.experience-title-field,\n.experience-city-field {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-org-field {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-type-select {\n  width: 100%;\n}\n.experience-date-range-field {\n  width: 100%;\n  max-width: none;\n  margin: 0;\n  background: transparent;\n}\n.experience-date-range-label {\n  grid-column: 1/2;\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-date-range-field .mat-mdc-text-field-wrapper {\n  min-height: 42px;\n  border-radius: 10px;\n  background: #fff;\n  border: 1px solid rgba(136, 156, 186, 0.5);\n  box-shadow: none;\n}\n.experience-date-range-field .mat-mdc-form-field-subscript-wrapper {\n  margin-top: 0.24rem;\n}\n.experience-date-range-field input {\n  border: 0 !important;\n  box-shadow: none !important;\n  border-radius: 0 !important;\n  background: transparent !important;\n  min-width: 0;\n  width: 100%;\n  padding: 0 !important;\n  min-height: 0 !important;\n  height: auto !important;\n  line-height: 1.25;\n}\n.experience-date-range-field .mat-datepicker-toggle {\n  margin-right: 0.2rem;\n}\n.experience-date-range-field .mat-mdc-form-field-hint-wrapper,\n.experience-date-range-field .mat-mdc-form-field-hint {\n  color: rgba(30, 49, 74, 0.65);\n  font-size: 0.72rem;\n}\n.experience-date-range-field .mat-date-range-input-container {\n  width: 100%;\n  display: grid;\n  grid-template-columns: minmax(96px, 1fr) auto minmax(96px, 1fr);\n  align-items: center;\n  column-gap: 0.34rem;\n  min-width: 0;\n}\n.experience-date-range-field .mat-date-range-input-separator {\n  margin: 0 0.28rem;\n  flex: 0 0 auto;\n  white-space: nowrap;\n}\n.experience-date-range-field .mat-date-range-input-start-wrapper,\n.experience-date-range-field .mat-date-range-input-end-wrapper {\n  width: 100%;\n  max-width: 100%;\n  overflow: visible;\n  min-width: 0;\n}\n.experience-date-range-field .mat-date-range-input-inner {\n  font-size: 0.96rem;\n  min-width: 0 !important;\n  width: 100% !important;\n  text-overflow: clip;\n  white-space: nowrap;\n  line-height: 1.25;\n}\n.experience-date-range-field .mat-mdc-form-field-flex {\n  min-width: 0;\n  border-bottom: 0 !important;\n  box-shadow: none !important;\n  align-items: center !important;\n}\n.experience-date-range-field .mat-mdc-form-field-infix {\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  min-height: 34px !important;\n  height: 34px;\n  display: flex;\n  align-items: center;\n}\n.experience-date-range-field .mdc-line-ripple,\n.experience-date-range-field .mat-mdc-form-field-line-ripple,\n.experience-date-range-field .mdc-line-ripple--deactivating,\n.experience-date-range-field .mdc-line-ripple--active {\n  display: none !important;\n  opacity: 0 !important;\n  transform: scaleX(0) !important;\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-all {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efe8ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-workspace {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1f3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-school {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf4ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-online {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf8ee);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-project {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f4f0ff);\n}\n.mobile-profile-language-chip.language-tone-1,\n.mobile-profile-selector-option.language-tone-1,\n:host ::ng-deep .mat-mdc-option.language-tone-1 {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n  color: #2f6090;\n}\n.mobile-profile-language-chip.language-tone-2,\n.mobile-profile-selector-option.language-tone-2,\n:host ::ng-deep .mat-mdc-option.language-tone-2 {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n  color: #2f695b;\n}\n.mobile-profile-language-chip.language-tone-3,\n.mobile-profile-selector-option.language-tone-3,\n:host ::ng-deep .mat-mdc-option.language-tone-3 {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n  color: #394f9c;\n}\n.mobile-profile-language-chip.language-tone-4,\n.mobile-profile-selector-option.language-tone-4,\n:host ::ng-deep .mat-mdc-option.language-tone-4 {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n  color: #8d3f66;\n}\n.mobile-profile-language-chip.language-tone-5,\n.mobile-profile-selector-option.language-tone-5,\n:host ::ng-deep .mat-mdc-option.language-tone-5 {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n  color: #704822;\n}\n.mobile-profile-language-chip.language-tone-6,\n.mobile-profile-selector-option.language-tone-6,\n:host ::ng-deep .mat-mdc-option.language-tone-6 {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n  color: #415872;\n}\n.mobile-profile-language-chip.language-tone-7,\n.mobile-profile-selector-option.language-tone-7,\n:host ::ng-deep .mat-mdc-option.language-tone-7 {\n  background: #f7f5ea;\n  border-color: rgba(128, 109, 66, 0.34);\n  color: #746237;\n}\n.mobile-profile-language-chip.language-tone-8,\n.mobile-profile-selector-option.language-tone-8,\n:host ::ng-deep .mat-mdc-option.language-tone-8 {\n  background: #edf5ff;\n  border-color: rgba(45, 122, 160, 0.34);\n  color: #2f6782;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf2ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #ebf7ef);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1e3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efecfc);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3f8e9);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fceef3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf7ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6f2e9);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-1 .status-option-content {\n  color: #2d63a9;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-2 .status-option-content {\n  color: #2a7a49;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-3 .status-option-content {\n  color: #9b6018;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-4 .status-option-content {\n  color: #6153a2;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-5 .status-option-content {\n  color: #61812a;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-6 .status-option-content {\n  color: #9f446d;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-7 .status-option-content {\n  color: #2e7898;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-8 .status-option-content {\n  color: #806c3f;\n}\n.mobile-profile-selector-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      180deg,\n      #eef5ff 0%,\n      #e3eefc 100%);\n  border-color: rgba(46, 102, 181, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      180deg,\n      #eef9f3 0%,\n      #e3f4ea 100%);\n  border-color: rgba(40, 125, 72, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ea 0%,\n      #ffecdd 100%);\n  border-color: rgba(165, 94, 24, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f1ff 0%,\n      #e8e5fb 100%);\n  border-color: rgba(97, 82, 164, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f9ef 0%,\n      #edf3e1 100%);\n  border-color: rgba(95, 128, 36, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #f9e6ed 100%);\n  border-color: rgba(160, 70, 111, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ff 0%,\n      #e2f0fb 100%);\n  border-color: rgba(45, 122, 160, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f3ea 0%,\n      #eee9dc 100%);\n  border-color: rgba(128, 109, 66, 0.32);\n}\n.mobile-profile-selector-option.status-public {\n  background:\n    linear-gradient(\n      180deg,\n      #e6f6ef 0%,\n      #d9f0e6 100%);\n  border-color: rgba(47, 143, 102, 0.34);\n}\n.mobile-profile-selector-option.status-friends {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f1fd 0%,\n      #dfeaf9 100%);\n  border-color: rgba(27, 87, 161, 0.34);\n}\n.mobile-profile-selector-option.status-host {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe2 0%,\n      #eee4d2 100%);\n  border-color: rgba(135, 88, 15, 0.36);\n}\n.mobile-profile-selector-option.status-inactive {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3f5 0%,\n      #e8ebef 100%);\n  border-color: rgba(91, 101, 115, 0.32);\n}\n.mobile-profile-selector-option.physique-slim {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.mobile-profile-selector-option.physique-lean {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n}\n.mobile-profile-selector-option.physique-athletic {\n  background: #e8f5ec;\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.mobile-profile-selector-option.physique-fit {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.mobile-profile-selector-option.physique-curvy {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n}\n.mobile-profile-selector-option.physique-muscular {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n}\n.mobile-profile-selector-option.physique-average {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.popup-panel-profile-selector .values-selector-popup.profile-selector-popup {\n  gap: 0.56rem;\n}\n.popup-panel-profile-selector .profile-filter-selector-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.44rem;\n  padding-bottom: 0.22rem;\n  border-bottom: 1px solid rgba(74, 102, 139, 0.22);\n}\n.popup-panel-profile-selector .profile-filter-selector-head-label {\n  color: #203c64;\n  font-size: 0.82rem;\n  font-weight: 800;\n  line-height: 1.2;\n}\n.popup-panel-profile-selector .profile-filter-selector-clear {\n  border: 1px solid rgba(41, 73, 110, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.82);\n  color: #284970;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.3rem 0.52rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector .profile-filter-selector-clear.is-hidden {\n  visibility: hidden;\n  pointer-events: none;\n}\n.popup-panel-profile-selector .profile-filter-selector-selected {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector .profile-filter-selector-chip {\n  border: 1px solid rgba(35, 68, 107, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.92);\n  color: #234368;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.26rem 0.48rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.16rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector .profile-filter-selector-chip .mat-icon {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n}\n.popup-panel-profile-selector .profile-filter-selector-empty {\n  margin: 0;\n  font-size: 0.74rem;\n  color: rgba(31, 54, 86, 0.62);\n  font-style: italic;\n}\n.popup-panel-profile-selector .profile-selector-option-group {\n  display: grid;\n  gap: 0.34rem;\n  border: 1px solid transparent;\n  border-radius: 12px;\n  padding: 0.4rem 0.42rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-head {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag {\n  border-radius: 999px;\n  border: 1px solid rgba(52, 86, 128, 0.28);\n  background: rgba(255, 255, 255, 0.74);\n  color: #2f527d;\n  font-size: 0.67rem;\n  font-weight: 800;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.2rem 0.52rem;\n  text-transform: uppercase;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag-icon {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.popup-panel-profile-selector .profile-selector-option-group-line {\n  display: block;\n  width: 100%;\n  height: 1px;\n  background: rgba(84, 111, 147, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-chip-grid {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.36rem;\n}\n.popup-panel-profile-selector .profile-selector-chip {\n  border: 1px solid rgba(41, 70, 106, 0.22);\n  border-radius: 999px;\n  background: #f4f8ff;\n  color: #234066;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 700;\n  padding: 0.3rem 0.58rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  cursor: pointer;\n  transition:\n    background-color 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.popup-panel-profile-selector .profile-selector-chip.active {\n  border-color: rgba(27, 85, 158, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #dcebff 0%,\n      #cfe3ff 100%);\n  color: #123e70;\n  box-shadow: inset 0 0 0 1px rgba(30, 73, 127, 0.24), 0 1px 2px rgba(24, 53, 86, 0.16);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-family {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 232, 219, 0.52) 0%,\n      rgba(255, 232, 219, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-ambition {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 242, 216, 0.52) 0%,\n      rgba(255, 242, 216, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-lifestyle {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(221, 241, 239, 0.56) 0%,\n      rgba(221, 241, 239, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-beliefs {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-social {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(223, 236, 255, 0.5) 0%,\n      rgba(223, 236, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-arts {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(235, 227, 255, 0.5) 0%,\n      rgba(235, 227, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-food {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 236, 221, 0.52) 0%,\n      rgba(255, 236, 221, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-active {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(222, 243, 231, 0.56) 0%,\n      rgba(222, 243, 231, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-mind {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(219, 242, 238, 0.56) 0%,\n      rgba(219, 242, 238, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-identity {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-family {\n  border-color: rgba(156, 94, 51, 0.34);\n  color: #9c5e33;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-ambition {\n  border-color: rgba(160, 106, 20, 0.34);\n  color: #9b6717;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-lifestyle {\n  border-color: rgba(47, 123, 119, 0.34);\n  color: #2f7b77;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-beliefs {\n  border-color: rgba(95, 78, 160, 0.34);\n  color: #5f4ea0;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-social {\n  border-color: rgba(47, 106, 175, 0.36);\n  color: #2f6aaf;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-arts {\n  border-color: rgba(106, 87, 168, 0.36);\n  color: #6a57a8;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-food {\n  border-color: rgba(170, 97, 28, 0.34);\n  color: #a55e18;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-active {\n  border-color: rgba(49, 124, 82, 0.36);\n  color: #317c52;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-mind {\n  border-color: rgba(37, 124, 118, 0.34);\n  color: #2b7c76;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-identity {\n  border-color: rgba(98, 84, 163, 0.34);\n  color: #6254a3;\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-family {\n  background: rgba(156, 94, 51, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-ambition {\n  background: rgba(160, 106, 20, 0.32);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-lifestyle {\n  background: rgba(47, 123, 119, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-beliefs {\n  background: rgba(95, 78, 160, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-social {\n  background: rgba(47, 106, 175, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-arts {\n  background: rgba(106, 87, 168, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-food {\n  background: rgba(170, 97, 28, 0.32);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-active {\n  background: rgba(49, 124, 82, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-mind {\n  background: rgba(37, 124, 118, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-identity {\n  background: rgba(98, 84, 163, 0.3);\n}\n:host ::ng-deep .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.status-option) {\n  background: #f0f5fc;\n}\n:host ::ng-deep .mat-mdc-option.status-option.mdc-list-item--selected:not(.mdc-list-item--disabled) {\n  filter: brightness(0.95);\n  box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.2);\n}\n:host ::ng-deep .mat-mdc-option.status-option {\n  background: #fff;\n}\n:host ::ng-deep .mat-mdc-option.status-option:not(:last-child) {\n  border-bottom: 1px solid #e6edf7;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.hide-selected-option,\n:host ::ng-deep .status-options-panel .mat-mdc-option.hide-selected-option {\n  min-height: 0 !important;\n  height: 0 !important;\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  border: 0 !important;\n  margin: 0 !important;\n  opacity: 0 !important;\n  pointer-events: none !important;\n  overflow: hidden !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option {\n  background: #fff;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel {\n  margin-top: 8px !important;\n  margin-bottom: 8px !important;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .cdk-overlay-pane .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .cdk-overlay-pane .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above {\n  margin-top: 0 !important;\n  margin-bottom: 18px !important;\n  transform: translateY(-10px) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public {\n  --mdc-list-list-item-container-color: #def3e9;\n  --mat-mdc-option-selected-container-color: #def3e9;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #def3e9) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends {\n  --mdc-list-list-item-container-color: #e3eefb;\n  --mat-mdc-option-selected-container-color: #e3eefb;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e3eefb) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host {\n  --mdc-list-list-item-container-color: #f3ead8;\n  --mat-mdc-option-selected-container-color: #f3ead8;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3ead8) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive {\n  --mdc-list-list-item-container-color: #eceff3;\n  --mat-mdc-option-selected-container-color: #eceff3;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eceff3) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon {\n  color: #2f8f66 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon {\n  color: #1b57a1 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon {\n  color: #87580f !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon {\n  color: #5b6573 !important;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-slim {\n  background: #eaf4ff;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-lean {\n  background: #edf8f4;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-athletic {\n  background: #e8f5ec;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-fit {\n  background: #f1f2ff;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-curvy {\n  background: #fff2f8;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-muscular {\n  background: #fbf4ea;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-average {\n  background: #eff4f9;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-slim .status-option-content {\n  color: #3f7ab3;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-lean .status-option-content {\n  color: #3f8f5f;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-athletic .status-option-content {\n  color: #2f7e4d;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-fit .status-option-content {\n  color: #465fbb;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-curvy .status-option-content {\n  color: #a14875;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-muscular .status-option-content {\n  color: #7d4f24;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-average .status-option-content {\n  color: #4d667f;\n}\n:host ::ng-deep .mat-mdc-select-panel.physique-options-panel {\n  width: auto !important;\n  max-width: 220px !important;\n  min-width: 0 !important;\n}\n:host ::ng-deep .physique-options-panel .mat-mdc-option {\n  padding-right: 8px;\n}\n:host ::ng-deep .physique-options-panel .mat-mdc-option .mat-pseudo-checkbox {\n  margin-left: 4px;\n}\n@media (max-width: 760px) {\n  .experience-form-grid {\n    grid-template-columns: 1fr;\n    max-width: none;\n    justify-content: stretch;\n    row-gap: 0.72rem;\n  }\n  .experience-date-range-label {\n    grid-column: 1/-1;\n  }\n  .experience-date-range-field .mat-date-range-input-container {\n    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);\n  }\n  .profile-details-privacy-fab .privacy-fab-actions {\n    position: fixed;\n    left: 0.5rem;\n    right: 0.5rem;\n    bottom: max(0.5rem, env(safe-area-inset-bottom));\n    top: auto;\n    transform: translateY(12px) scale(0.98);\n    transform-origin: bottom center;\n    justify-content: center;\n    gap: 0.46rem;\n    padding: 0.46rem 0.56rem;\n    border: 1px solid rgba(42, 68, 102, 0.2);\n    border-radius: 14px;\n    background: #fff;\n    box-shadow: 0 -12px 24px rgba(18, 31, 51, 0.22);\n  }\n  .profile-details-privacy-fab.open .privacy-fab-actions {\n    transform: translateY(0) scale(1);\n  }\n}\n.smart-list-stage {\n  position: relative;\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  min-height: 0;\n  overflow: hidden;\n}\n.smart-list-stage__list-shell {\n  position: relative;\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  min-height: 0;\n  height: 100%;\n  overflow: hidden;\n}\n.smart-list-stage__list-shell > app-smart-list {\n  display: flex;\n  flex: 1 1 auto;\n  min-height: 0;\n}\n.smart-list-stage__list-shell.is-occluded {\n  opacity: 0;\n  pointer-events: none;\n}\n.smart-list-stage__overlay {\n  position: absolute;\n  inset: 0;\n  z-index: 4;\n  display: flex;\n  flex-direction: column;\n  min-height: 0;\n  pointer-events: none;\n}\n.smart-list-stage__overlay > * {\n  pointer-events: auto;\n}\n:host {\n  --activities-shell-z-index: 2300;\n  display: contents;\n}\n.activities-mobile-rate-filter-group {\n  justify-content: flex-start;\n  cursor: default;\n  pointer-events: auto;\n  font-size: 0.72rem;\n  font-weight: 800;\n  letter-spacing: 0.01em;\n  color: rgba(25, 48, 79, 0.62);\n  background:\n    linear-gradient(\n      180deg,\n      #f6f9ff 0%,\n      #edf3ff 100%);\n}\n.activities-mobile-rate-filter-panel .activities-mobile-rate-filter-group.rate-filter-group-single {\n  background:\n    linear-gradient(\n      180deg,\n      #eef3fb 0%,\n      #e7edf8 100%);\n  border-color: rgba(84, 104, 136, 0.3);\n  color: #3f5779;\n}\n.activities-mobile-rate-filter-panel .activities-mobile-rate-filter-group.rate-filter-group-pair {\n  background:\n    linear-gradient(\n      180deg,\n      #eef8f5 0%,\n      #e5f2ee 100%);\n  border-color: rgba(47, 142, 125, 0.3);\n  color: #2a6c61;\n  margin-top: 0.28rem;\n}\n.activities-mobile-rate-filter-panel .activities-mobile-rate-filter-group {\n  width: fit-content;\n  min-width: 0;\n  justify-self: start;\n  justify-content: flex-start;\n  border-radius: 7px;\n  min-height: 26px;\n  padding: 0.18rem 0.44rem;\n  padding-left: 0;\n  padding-right: 0;\n  font-size: 0.64rem;\n  font-weight: 800;\n  letter-spacing: 0.03em;\n  text-transform: uppercase;\n  box-shadow: none;\n  filter: none;\n}\n.activities-mobile-rate-filter-panel .activities-mobile-rate-filter-group .mobile-profile-selector-option-main {\n  gap: 0.26rem;\n  padding-left: 0.44rem;\n  padding-right: 0.44rem;\n}\n.activities-mobile-rate-filter-panel .activities-mobile-rate-filter-group .mobile-profile-selector-option-main .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.activities-mobile-rate-filter-panel .activities-mobile-rate-filter-group.is-group-separator-mobile {\n  padding-top: 0.18rem;\n}\n.activities-mobile-rate-filter-group-row {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.42rem;\n  width: 100%;\n  padding-top: 0.28rem;\n}\n.activities-mobile-rate-filter-panel .activities-mobile-rate-filter-group-row .activities-mobile-rate-filter-group {\n  margin-top: 0;\n}\n.activities-mobile-rate-filter-panel .mobile-profile-selector-option-main {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n  min-width: 0;\n  text-align: left;\n}\n.activities-mobile-rate-filter-panel .mobile-profile-selector-option-main .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.activities-mobile-filter-panel .activities-view-option.activity-filter-rates {\n  background:\n    linear-gradient(\n      180deg,\n      #fff7df 0%,\n      #ffefc8 100%);\n  border-color: rgba(200, 146, 30, 0.34);\n}\n.activities-mobile-filter-panel .activities-view-option.activity-filter-chat {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f7ff 0%,\n      #e8f2ff 100%);\n  border-color: rgba(63, 116, 178, 0.32);\n}\n.activities-mobile-filter-panel .activities-view-option.activity-filter-invitations {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f4ff 0%,\n      #efeafd 100%);\n  border-color: rgba(115, 88, 176, 0.32);\n}\n.activities-mobile-filter-panel .activities-view-option.activity-filter-events {\n  background:\n    linear-gradient(\n      180deg,\n      #fff7f0 0%,\n      #ffefdf 100%);\n  border-color: rgba(208, 125, 51, 0.32);\n}\n.activities-mobile-filter-panel .activities-view-option.activity-filter-hosting {\n  background:\n    linear-gradient(\n      180deg,\n      #f1fbfa 0%,\n      #e6f5f2 100%);\n  border-color: rgba(47, 142, 157, 0.32);\n}\n.activities-mobile-filter-panel .activities-view-option.activity-filter-drafts {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f8fc 0%,\n      #ebeff7 100%);\n  border-color: rgba(91, 102, 127, 0.32);\n}\n.activities-mobile-filter-panel .activities-view-option.activity-filter-trash {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4f6 0%,\n      #ffe9ee 100%);\n  border-color: rgba(177, 73, 92, 0.32);\n}\n.activities-mobile-filter-panel .activities-view-option.chat-context-filter-all {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f6fb 0%,\n      #edf2f8 100%);\n  border-color: rgba(84, 110, 145, 0.28);\n}\n.activities-mobile-filter-panel .activities-view-option.chat-context-filter-event {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f7ff 0%,\n      #e8f2ff 100%);\n  border-color: rgba(63, 116, 178, 0.32);\n}\n.activities-mobile-filter-panel .activities-view-option.chat-context-filter-sub-event {\n  background:\n    linear-gradient(\n      180deg,\n      #fff5ec 0%,\n      #feead9 100%);\n  border-color: rgba(151, 92, 41, 0.32);\n}\n.activities-mobile-filter-panel .activities-view-option.chat-context-filter-group {\n  background:\n    linear-gradient(\n      180deg,\n      #edf9f4 0%,\n      #e1f3ea 100%);\n  border-color: rgba(37, 127, 95, 0.32);\n}\n.activities-mobile-filter-panel .activities-view-option.support-case-filter-all,\n.activities-support-case-filter-select.support-case-filter-all {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f7fb 0%,\n      #edf3f8 100%);\n  border-color: rgba(76, 104, 140, 0.28);\n}\n.activities-mobile-filter-panel .activities-view-option.support-case-filter-pending,\n.activities-support-case-filter-select.support-case-filter-pending {\n  background:\n    linear-gradient(\n      180deg,\n      #fff5ef 0%,\n      #ffe9df 100%);\n  border-color: rgba(209, 102, 67, 0.34);\n}\n.activities-mobile-filter-panel .activities-view-option.support-case-filter-picked,\n.activities-support-case-filter-select.support-case-filter-picked {\n  background:\n    linear-gradient(\n      180deg,\n      #eff6ff 0%,\n      #e3effb 100%);\n  border-color: rgba(73, 128, 190, 0.32);\n}\n.activities-mobile-filter-panel .activities-view-option.support-case-filter-solved,\n.activities-support-case-filter-select.support-case-filter-solved {\n  background:\n    linear-gradient(\n      180deg,\n      #eefbf3 0%,\n      #e0f4e8 100%);\n  border-color: rgba(65, 155, 105, 0.32);\n}\n.activities-mobile-filter-panel .activities-view-option.support-case-filter-blocked,\n.activities-support-case-filter-select.support-case-filter-blocked {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f3 0%,\n      #ffe4e8 100%);\n  border-color: rgba(176, 73, 85, 0.32);\n}\n.activities-mobile-rate-filter-panel .activities-view-option.rate-filter-item-individual-given {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f3 0%,\n      #ffe6ea 100%);\n  border-color: rgba(169, 72, 90, 0.32);\n  color: #a1485a;\n}\n.activities-mobile-rate-filter-panel .activities-view-option.rate-filter-item-individual-received {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n  color: #2d5ea8;\n}\n.activities-mobile-rate-filter-panel .activities-view-option.rate-filter-item-individual-mutual {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3ff 0%,\n      #e8eafb 100%);\n  border-color: rgba(79, 104, 168, 0.32);\n  color: #4f68a8;\n}\n.activities-mobile-rate-filter-panel .activities-view-option.rate-filter-item-individual-met {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.activities-mobile-rate-filter-panel .activities-view-option.rate-filter-item-pair-given {\n  background:\n    linear-gradient(\n      180deg,\n      #fff5ec 0%,\n      #feead9 100%);\n  border-color: rgba(151, 92, 41, 0.32);\n  color: #8a5428;\n}\n.activities-mobile-rate-filter-panel .activities-view-option.rate-filter-item-pair-received {\n  background:\n    linear-gradient(\n      180deg,\n      #edf9f4 0%,\n      #e1f3ea 100%);\n  border-color: rgba(37, 127, 95, 0.32);\n  color: #236d51;\n}\n.activities-rate-social-badge-toggle,\n:host ::ng-deep .activities-rate-social-badge-toggle {\n  appearance: none;\n  -webkit-appearance: none;\n  border: 1px solid rgba(82, 106, 143, 0.28);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #eef3fb 100%);\n  color: #355178;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.12rem;\n  min-height: 24px;\n  padding: 0.16rem 0.44rem;\n  font: inherit;\n  font-size: 0.64rem;\n  font-weight: 800;\n  line-height: 1;\n  white-space: nowrap;\n  cursor: pointer;\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.7), 0 1px 2px rgba(24, 42, 68, 0.08);\n  transition:\n    background 0.18s ease,\n    border-color 0.18s ease,\n    color 0.18s ease,\n    box-shadow 0.18s ease,\n    transform 0.14s ease;\n  text-transform: none;\n  letter-spacing: 0;\n}\n.activities-rate-social-badge-toggle .mat-icon,\n:host ::ng-deep .activities-rate-social-badge-toggle .mat-icon {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n  flex: 0 0 13px;\n  margin-right: 0px;\n}\n.activities-rate-social-badge-toggle > span,\n:host ::ng-deep .activities-rate-social-badge-toggle > span {\n  display: inline-flex;\n  align-items: center;\n  font-size: inherit;\n  font-weight: inherit;\n  line-height: 1;\n  letter-spacing: 0;\n  text-transform: none;\n  white-space: nowrap;\n}\n.activities-rate-social-badge-toggle-inline,\n:host ::ng-deep .activities-rate-social-badge-toggle-inline {\n  min-height: 22px;\n  padding: 0.1rem 0.38rem;\n  font-size: 0.6rem;\n  margin-left: auto;\n  flex: 0 0 auto;\n}\n.activities-rate-social-badge-toggle-mobile {\n  flex: 0 0 auto;\n  margin-top: 0.28rem;\n}\n.activities-rate-social-badge-toggle.is-active,\n:host ::ng-deep .activities-rate-social-badge-toggle.is-active {\n  border-color: rgba(42, 101, 177, 0.52);\n  background:\n    linear-gradient(\n      180deg,\n      #dfedff 0%,\n      #d1e4ff 100%);\n  color: #174b84;\n  box-shadow:\n    inset 0 0 0 1px rgba(255, 255, 255, 0.78),\n    0 0 0 1px rgba(52, 108, 180, 0.16),\n    0 5px 12px rgba(45, 92, 154, 0.16);\n}\n@media (hover: hover) and (pointer: fine) {\n  .activities-rate-social-badge-toggle:hover,\n  :host ::ng-deep .activities-rate-social-badge-toggle:hover {\n    border-color: rgba(63, 94, 138, 0.4);\n    transform: translateY(-1px);\n  }\n  .activities-rate-social-badge-toggle.is-active:hover,\n  :host ::ng-deep .activities-rate-social-badge-toggle.is-active:hover {\n    border-color: rgba(38, 94, 165, 0.6);\n  }\n}\n.activities-rate-social-badge-toggle:active,\n:host ::ng-deep .activities-rate-social-badge-toggle:active {\n  transform: translateY(0);\n}\n.activities-popup {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  gap: 0.45rem;\n  height: 100%;\n  min-height: 0;\n  touch-action: pan-y;\n}\n.activities-popup.activities-popup-rates-fullscreen {\n  background:\n    radial-gradient(\n      120% 88% at 10% 0%,\n      rgba(220, 234, 255, 0.72) 0%,\n      rgba(220, 234, 255, 0) 56%),\n    linear-gradient(\n      180deg,\n      #f9fbff 0%,\n      #eef4ff 58%,\n      #eaf1ff 100%);\n}\n.asset-item-card {\n  cursor: pointer;\n  width: auto;\n  max-width: 100%;\n  box-sizing: border-box;\n  transition:\n    transform 0.14s ease,\n    box-shadow 0.16s ease,\n    filter 0.16s ease;\n}\n.asset-item-card.activities-row-item {\n  cursor: default;\n}\n.activities-card {\n  position: relative;\n  border: 1px solid rgba(33, 51, 78, 0.14);\n  border-radius: 12px;\n  background: #fff;\n  padding: 0.45rem 0.5rem;\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto auto;\n  gap: 0.48rem;\n  align-items: center;\n  cursor: pointer;\n  width: 100%;\n  box-sizing: border-box;\n  will-change: transform;\n  transition: transform 0.14s ease, box-shadow 0.16s ease;\n}\n.activities-card-btn {\n  appearance: none;\n  -webkit-appearance: none;\n  font: inherit;\n  text-align: left;\n}\n.activities-card-chat {\n  grid-template-columns: auto minmax(0, 1fr) auto;\n}\n.activities-card-chat-main-event {\n  border-color: rgba(43, 97, 161, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #f4f9ff 0%,\n      #ebf3ff 100%);\n}\n.activities-card-chat-optional-sub-event {\n  border-color: rgba(143, 84, 26, 0.32);\n  background:\n    linear-gradient(\n      180deg,\n      #fff9f0 0%,\n      #fff3e1 100%);\n}\n.activities-card-chat-group-sub-event {\n  border-color: rgba(51, 131, 92, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #f3fcf5 0%,\n      #e9f7ee 100%);\n}\n.activities-card-chat-service-event {\n  border-color: rgba(202, 213, 226, 0.9);\n  background: #ffffff;\n}\n.activities-card-chat-service-asset {\n  border-color: rgba(190, 199, 210, 0.82);\n  background:\n    linear-gradient(\n      180deg,\n      #fbfcfd 0%,\n      #f3f6f8 100%);\n}\n.activities-card-chat-service-notification {\n  border-color: rgba(173, 55, 66, 0.32);\n  background:\n    linear-gradient(\n      180deg,\n      #fff7f7 0%,\n      #fdecec 100%);\n}\n.activities-card-chat-main-event .activities-card-title {\n  color: #224d7f;\n}\n.activities-card-chat-optional-sub-event .activities-card-title {\n  color: #86521f;\n}\n.activities-card-chat-group-sub-event .activities-card-title {\n  color: #216b4e;\n}\n.activities-card-chat-service-event .activities-card-title {\n  color: #163763;\n}\n.activities-card-chat-service-asset .activities-card-title {\n  color: #324456;\n}\n.activities-card-chat-service-notification .activities-card-title {\n  color: #9b2f3a;\n}\n.activities-card-avatar {\n  width: 36px;\n  height: 36px;\n  border-radius: 50%;\n  color: #fff;\n  font-size: 11px;\n  font-weight: 700;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.activities-card-main {\n  min-width: 0;\n  padding-right: 0;\n}\n.user-color-woman {\n  background:\n    linear-gradient(\n      145deg,\n      #d3754c,\n      #ac4a24);\n}\n.user-color-man {\n  background:\n    linear-gradient(\n      145deg,\n      #3572a4,\n      #194364);\n}\n.activities-card-title,\n.activities-card-subtitle,\n.activities-card-detail {\n  margin: 0;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.activities-card-title {\n  font-size: 0.83rem;\n  font-weight: 800;\n  color: #1f3658;\n}\n.activities-card-subtitle {\n  margin-top: 0.09rem;\n  font-size: 0.76rem;\n  color: rgba(20, 36, 58, 0.75);\n}\n.activities-card-detail {\n  margin-top: 0.08rem;\n  font-size: 0.73rem;\n  color: rgba(20, 36, 58, 0.64);\n}\n.activities-card-badge {\n  position: static;\n  justify-self: end;\n  align-self: start;\n  margin-right: 0.08rem;\n}\n.activities-chat-members-badge {\n  align-self: baseline;\n  justify-self: end;\n  position: relative;\n  min-width: 72px;\n  height: 28px;\n  border-radius: 999px;\n  border: 1px solid rgba(255, 255, 255, 0.86);\n  background: rgba(26, 45, 71, 0.82);\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.72rem;\n  font-weight: 800;\n  padding: 0 0.58rem;\n  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.7), 0 8px 16px rgba(255, 255, 255, 0.42);\n  white-space: nowrap;\n  margin-right: 0.4rem;\n}\n.activities-chat-unread-badge {\n  top: -6px;\n  right: -6px;\n  min-width: 20px;\n  height: 20px;\n  border-radius: 999px;\n  border: 1px solid #fff;\n  z-index: 2;\n}\n.activities-card-actions {\n  align-self: center;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.2rem;\n}\n.activities-card-action {\n  border: 1px solid rgba(33, 51, 78, 0.2);\n  border-radius: 999px;\n  background: #f7f9fd;\n  color: #26466d;\n  min-height: 26px;\n  padding: 0 0.52rem;\n  font-size: 0.69rem;\n  font-weight: 700;\n  cursor: pointer;\n}\n.activities-card-action-delete {\n  color: #8f2f32;\n  border-color: rgba(161, 56, 60, 0.28);\n  background: #fff4f4;\n}\n.activity-filter-chat {\n  color: #3f74b2;\n}\n.activity-filter-invitations {\n  color: #7358b0;\n}\n.activity-filter-events {\n  color: #d07d33;\n}\n.activity-filter-hosting {\n  color: #2f8e9d;\n}\n.activity-filter-drafts {\n  color: #5b667f;\n}\n.activity-filter-trash {\n  color: #b44c60;\n}\n.activity-filter-rates {\n  color: #c8921e;\n}\n.activity-filter-secondary {\n  color: #4f668a;\n}\n.activities-hosting-draft-toggle {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4f5 0%,\n      #ffe8eb 100%);\n  border-color: rgba(183, 88, 104, 0.42);\n  color: #9b3345;\n  min-width: 108px;\n  height: 36px;\n  min-height: 36px;\n  box-sizing: content-box;\n  appearance: none;\n  -webkit-appearance: none;\n  line-height: inherit;\n  padding: 0.12rem 0.64rem 0.12rem 0.78rem;\n  position: relative;\n  overflow: visible;\n}\n.activities-hosting-draft-toggle .activities-toggle-icon {\n  color: #a0364a;\n  opacity: 1;\n}\n.activities-hosting-draft-content {\n  width: 100%;\n  justify-content: center;\n  gap: 0.26rem;\n}\n.activities-hosting-draft-label {\n  font-weight: 700;\n  letter-spacing: 0.01em;\n}\n.activities-toggle-icon {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n  line-height: 15px;\n  opacity: 0.9;\n}\n.activities-hosting-draft-toggle.is-active {\n  background:\n    linear-gradient(\n      180deg,\n      #f7dde1 0%,\n      #f2c8ce 100%);\n  border-color: rgba(167, 45, 66, 0.56);\n  color: #8b1f32;\n  box-shadow: 0 4px 12px rgba(186, 65, 86, 0.24);\n}\n.activities-hosting-draft-toggle.is-active .activities-toggle-icon {\n  color: #7f1a2f;\n  font-variation-settings: "FILL" 1;\n}\n.activities-source-avatar {\n  font-size: 0.64rem;\n  font-weight: 800;\n  line-height: 1;\n  color: #ffffff;\n  border-color: rgba(255, 255, 255, 0.94);\n  box-shadow: 0 6px 14px rgba(8, 18, 34, 0.34);\n  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.22);\n  transition:\n    transform 0.16s ease,\n    box-shadow 0.2s ease,\n    filter 0.2s ease;\n  cursor: default;\n  pointer-events: none;\n}\n.activities-source-avatar.user-color-man {\n  background:\n    linear-gradient(\n      145deg,\n      #3572a4,\n      #194364);\n}\n.activities-source-avatar.user-color-woman {\n  background:\n    linear-gradient(\n      145deg,\n      #d3754c,\n      #ac4a24);\n}\n.activities-source-avatar.activities-source-tone-1 {\n  background:\n    linear-gradient(\n      145deg,\n      #3572a4,\n      #194364);\n}\n.activities-source-avatar.activities-source-tone-2 {\n  background:\n    linear-gradient(\n      145deg,\n      #c56841,\n      #8f381d);\n}\n.activities-source-avatar.activities-source-tone-3 {\n  background:\n    linear-gradient(\n      145deg,\n      #3c9d78,\n      #1f6450);\n}\n.activities-source-avatar.activities-source-tone-4 {\n  background:\n    linear-gradient(\n      145deg,\n      #7b63c7,\n      #4d3a8f);\n}\n.activities-source-avatar.activities-source-tone-5 {\n  background:\n    linear-gradient(\n      145deg,\n      #bf5f8f,\n      #883b65);\n}\n.activities-source-avatar.activities-source-tone-6 {\n  background:\n    linear-gradient(\n      145deg,\n      #4895ad,\n      #285c79);\n}\n.activities-source-avatar.activities-source-tone-7 {\n  background:\n    linear-gradient(\n      145deg,\n      #b47c3b,\n      #7e5325);\n}\n.activities-source-avatar.activities-source-tone-8 {\n  background:\n    linear-gradient(\n      145deg,\n      #5673bf,\n      #324a8a);\n}\n.activities-source-avatar > span {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  text-transform: uppercase;\n}\n.activities-row-item .asset-occupancy-badge {\n  transition:\n    transform 0.16s ease,\n    box-shadow 0.2s ease,\n    filter 0.2s ease,\n    border-color 0.2s ease;\n}\n.activities-row-item.activities-row-item-full {\n  border-color: rgba(201, 83, 83, 0.42);\n  background:\n    linear-gradient(\n      180deg,\n      #fff8f8 0%,\n      #fff1f1 100%);\n}\n.activities-row-item.activities-row-item-draft {\n  border-color: rgba(96, 108, 136, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #fafbff 0%,\n      #f0f3fb 100%);\n  box-shadow: 0 8px 18px rgba(74, 88, 118, 0.08);\n}\n.activities-row-item.activities-row-item-draft .experience-item-meta h4,\n.activities-row-item.activities-row-item-draft .activities-event-meta-row {\n  color: #52617d;\n}\n.activities-row-item.activities-row-item-draft .experience-item-icon {\n  background:\n    linear-gradient(\n      180deg,\n      #eef2fa 0%,\n      #e2e8f4 100%);\n  border-color: rgba(94, 107, 135, 0.26);\n}\n.activities-row-item .asset-occupancy-badge.asset-occupancy-badge-full {\n  background:\n    linear-gradient(\n      180deg,\n      #b84f4f 0%,\n      #963636 100%);\n  box-shadow: 0 7px 16px rgba(72, 24, 24, 0.36), inset 0 0 0 1px rgba(111, 38, 38, 0.6);\n}\n@media (hover: hover) and (pointer: fine) {\n  .activities-row-item .asset-occupancy-badge:hover {\n    transform: translateY(-1px) scale(1.03);\n    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.82), 0 11px 24px rgba(255, 255, 255, 0.62);\n    filter: brightness(1.08) saturate(1.04);\n  }\n}\n.activities-row-item .asset-occupancy-badge:active {\n  transform: scale(0.94);\n}\n.popup-actions {\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.link-btn {\n  border: 1px solid var(--line-strong);\n  border-radius: 999px;\n  background: #fff;\n  color: #1f3350;\n  font: inherit;\n  font-size: 0.83rem;\n  padding: 0.38rem 0.76rem;\n  cursor: pointer;\n}\n.neutral-btn {\n  background: #f2f4fa;\n  border-color: rgba(23, 33, 54, 0.12);\n}\n.badge-dot,\n.card-badge {\n  min-width: 22px;\n  height: 22px;\n  border-radius: 50%;\n  background: #d84d4d;\n  color: #fff;\n  font-size: 11px;\n  font-weight: 700;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.experience-item-card {\n  position: relative;\n  border: 1px solid rgba(58, 81, 114, 0.24);\n  border-radius: 12px;\n  padding: 0.58rem 0.62rem;\n  display: grid;\n  gap: 0.32rem;\n}\n.experience-item-head {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: flex-start;\n  gap: 0.46rem;\n}\n.experience-item-icon {\n  width: 28px;\n  height: 28px;\n  margin-top: 1px;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(255, 255, 255, 0.76);\n  border: 1px solid rgba(58, 81, 114, 0.18);\n}\n.experience-item-icon .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.experience-item-icon.experience-item-icon-event-visibility-public {\n  background:\n    linear-gradient(\n      180deg,\n      #eef7ff 0%,\n      #e5f2ff 100%);\n  border-color: rgba(46, 111, 178, 0.34);\n}\n.experience-item-icon.experience-item-icon-event-visibility-friends {\n  background:\n    linear-gradient(\n      180deg,\n      #f1f8ef 0%,\n      #e9f3e6 100%);\n  border-color: rgba(54, 129, 72, 0.34);\n}\n.experience-item-icon.experience-item-icon-event-visibility-invitation {\n  background:\n    linear-gradient(\n      180deg,\n      #fff5ea 0%,\n      #ffe9d9 100%);\n  border-color: rgba(185, 113, 45, 0.36);\n}\n.experience-item-icon.experience-item-icon-event-visibility-public .mat-icon {\n  color: #2f6cae;\n}\n.experience-item-icon.experience-item-icon-event-visibility-friends .mat-icon {\n  color: #368148;\n}\n.experience-item-icon.experience-item-icon-event-visibility-invitation .mat-icon {\n  color: #b9712d;\n}\n.experience-item-meta {\n  min-width: 0;\n}\n.experience-item-meta h4 {\n  margin: 0;\n  font-size: 0.84rem;\n  font-weight: 800;\n  color: #223d62;\n}\n.experience-item-meta p {\n  margin: 0.04rem 0 0;\n  font-size: 0.74rem;\n  color: rgba(23, 41, 66, 0.72);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.experience-item-meta p.activities-event-meta-row {\n  margin-top: 0.03rem;\n  font-weight: 700;\n}\n.experience-item-meta p.activities-event-meta-row-date {\n  color: rgba(23, 41, 66, 0.75);\n}\n.experience-item-meta p.activities-event-meta-row-location {\n  color: rgba(23, 41, 66, 0.64);\n}\n.experience-item-description {\n  font-size: 0.76rem;\n  color: rgba(20, 37, 61, 0.84);\n}\n.experience-item-actions {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n}\n.asset-item-card .experience-item-head {\n  grid-template-columns: auto minmax(0, 1fr) auto auto;\n}\n.asset-card-image {\n  width: 100%;\n  height: 130px;\n  border-radius: 10px;\n  border: 1px solid rgba(36, 64, 98, 0.2);\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n  position: relative;\n  transition: opacity 100ms ease-in;\n}\n.asset-card-image.lazy-bg-loading {\n  opacity: 0;\n}\n.asset-card-image.lazy-bg-loaded {\n  opacity: 1;\n}\n.asset-occupancy-badge {\n  position: absolute;\n  top: 0.38rem;\n  right: 0.38rem;\n  min-width: 36px;\n  height: 28px;\n  border-radius: 999px;\n  border: 1px solid rgba(255, 255, 255, 0.86);\n  background: rgba(26, 45, 71, 0.82);\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.72rem;\n  font-weight: 800;\n  padding: 0 0.58rem;\n  cursor: pointer;\n  position: absolute;\n  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.7), 0 8px 16px rgba(255, 255, 255, 0.42);\n  transition:\n    transform 0.14s ease,\n    box-shadow 0.14s ease,\n    filter 0.14s ease;\n  overflow: visible;\n}\n.asset-occupancy-badge:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.82), 0 10px 22px rgba(255, 255, 255, 0.58);\n  filter: brightness(1.06);\n}\n.asset-occupancy-badge:active {\n  transform: scale(0.96);\n}\n.asset-occupancy-badge.asset-occupancy-badge-static {\n  cursor: default;\n  border: 0;\n  box-shadow: none;\n}\n.asset-occupancy-badge.asset-occupancy-badge-static:hover,\n.asset-occupancy-badge.asset-occupancy-badge-static:active {\n  transform: none;\n  filter: none;\n  box-shadow: none;\n}\n.asset-occupancy-badge .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.asset-request-badge {\n  position: absolute;\n  top: -12px;\n  right: -12px;\n  min-width: 20px;\n  height: 20px;\n  border-radius: 999px;\n  border: 1px solid #fff;\n  z-index: 2;\n}\n.asset-source-icon {\n  position: absolute;\n  top: 0.38rem;\n  left: 0.38rem;\n  width: 28px;\n  min-width: 28px;\n  height: 28px;\n  border-radius: 50%;\n  border: 1px solid rgba(255, 255, 255, 0.9);\n  background: rgba(244, 248, 255, 0.9);\n  color: #2d5ea8;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 2;\n  padding: 0;\n  cursor: pointer;\n  text-decoration: none;\n}\n.asset-source-icon.activities-source-avatar {\n  color: #fff;\n  cursor: default;\n}\n.asset-source-icon .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.image-stack-indicators {\n  position: absolute;\n  width: auto !important;\n  top: -0.1rem;\n  left: 0.25rem;\n  right: 0.25rem;\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));\n  gap: 4px;\n  width: 100%;\n}\n.image-stack-hit-area {\n  position: absolute;\n  top: 10px;\n  left: 10px;\n  right: 10px;\n  bottom: 10px;\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));\n  gap: 4px;\n  z-index: 2;\n}\n.image-stack-hit-segment {\n  border: 0;\n  background: transparent;\n  padding: 0;\n  cursor: pointer;\n}\n.activities-chat-row {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.52rem;\n  border: 1px solid rgba(43, 97, 161, 0.28);\n  border-radius: 12px;\n  background:\n    linear-gradient(\n      180deg,\n      #f7fbff 0%,\n      #edf4ff 100%);\n  padding: 0.54rem 0.6rem;\n}\n.activities-row-item-clickable {\n  cursor: pointer;\n}\n.activities-chat-avatar {\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  border: 1px solid rgba(255, 255, 255, 0.86);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.66rem;\n  font-weight: 800;\n  color: #fff;\n}\n.activities-chat-meta {\n  min-width: 0;\n  display: grid;\n  gap: 0.04rem;\n}\n.activities-chat-meta-top {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.44rem;\n}\n.activities-chat-title {\n  min-width: 0;\n  font-size: 0.82rem;\n  font-weight: 800;\n  color: #1e3658;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.activities-chat-time {\n  font-size: 0.69rem;\n  font-weight: 700;\n  color: rgba(22, 40, 64, 0.68);\n  white-space: nowrap;\n}\n.activities-chat-preview {\n  margin: 0;\n  font-size: 0.74rem;\n  color: rgba(22, 40, 64, 0.72);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.activities-chat-badge {\n  min-width: 22px;\n  height: 22px;\n  font-size: 11px;\n}\n.activities-rates-fullscreen-nav {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.44rem;\n  padding: 0.1rem 0.08rem 0.12rem;\n}\n.activities-rates-fullscreen-counter {\n  font-size: 0.76rem;\n  font-weight: 800;\n  color: #203c61;\n}\n.activities-rates-fullscreen-empty {\n  height: 100%;\n  display: grid;\n  place-items: center;\n  color: rgba(24, 44, 72, 0.72);\n  font-size: 0.84rem;\n  font-weight: 700;\n}\n.activities-rate-pair-split-handle {\n  position: absolute;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  left: var(--activities-pair-split);\n  top: var(--activities-pair-pad);\n  bottom: var(--activities-pair-pad);\n  width: 20px;\n  transform: translateX(-50%);\n  border: 0;\n  padding: 0;\n  margin: 0;\n  background: transparent;\n  z-index: 26;\n  touch-action: none;\n  cursor: ew-resize;\n}\n.activities-rate-pair-split-handle::before {\n  content: "";\n  position: absolute;\n  inset: 0;\n}\n.activities-rate-pair-split-handle::after {\n  content: "";\n  width: 4px;\n  height: 36%;\n  min-height: 52px;\n  border-radius: 999px;\n  border: 1px solid rgba(166, 196, 232, 0.74);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(241, 247, 255, 0.94) 0%,\n      rgba(218, 232, 249, 0.9) 100%);\n  box-shadow: 0 0 0 1px rgba(9, 22, 40, 0.14), 0 8px 14px rgba(6, 18, 36, 0.34);\n}\n.rate-filter-group-label {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.4rem;\n  width: 100%;\n  font-weight: 800;\n  font-size: 0.64rem;\n  color: #1f3658;\n  text-transform: uppercase;\n  letter-spacing: 0.03em;\n}\n.rate-filter-group-label-with-toggle {\n  justify-content: flex-start;\n  align-items: center;\n  gap: 0.28rem;\n}\n.rate-filter-group-title {\n  min-width: 0;\n}\n.rate-filter-group-title-chip {\n  display: inline-flex;\n  align-items: center;\n  min-height: 22px;\n  padding: 0.12rem 0.44rem;\n  border-radius: 7px;\n  background:\n    linear-gradient(\n      180deg,\n      #eef3fb 0%,\n      #e7edf8 100%);\n  border: 1px solid rgba(84, 104, 136, 0.24);\n  color: #3f5779;\n  flex: 0 0 auto;\n  margin-right: auto;\n}\n:host ::ng-deep .mat-mdc-option.status-option.rate-filter-group-option.is-group-separator .rate-filter-group-title-chip {\n  background:\n    linear-gradient(\n      180deg,\n      #eef8f5 0%,\n      #e5f2ee 100%);\n  border-color: rgba(47, 142, 125, 0.24);\n  color: #2a6c61;\n}\n.rate-filter-item-individual-given {\n  color: #a1485a;\n}\n.rate-filter-item-individual-received {\n  color: #2d5ea8;\n}\n.rate-filter-item-individual-mutual {\n  color: #4f68a8;\n}\n.rate-filter-item-individual-met {\n  color: #2d7d47;\n}\n.rate-filter-item-pair-given {\n  color: #8a5428;\n}\n.rate-filter-item-pair-received {\n  color: #236d51;\n}\n:host ::ng-deep .mat-mdc-option.status-option {\n  background: #fff;\n}\n:host ::ng-deep .mat-mdc-option.status-option:not(:last-child) {\n  border-bottom: 1px solid #e6edf7;\n}\n:host ::ng-deep .mat-mdc-option.status-option.activity-filter-chat {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eef5ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.activity-filter-invitations {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f4efff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.activity-filter-events {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff5ec);\n}\n:host ::ng-deep .mat-mdc-option.status-option.activity-filter-hosting {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf9f4);\n}\n:host ::ng-deep .mat-mdc-option.status-option.activity-filter-drafts {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eef2f9);\n}\n:host ::ng-deep .mat-mdc-option.status-option.activity-filter-trash {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff0f3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.activity-filter-rates {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff6df);\n}\n:host ::ng-deep .mat-mdc-option.status-option.chat-context-filter-all {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f1f4fa);\n}\n:host ::ng-deep .mat-mdc-option.status-option.chat-context-filter-event {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eef5ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.chat-context-filter-sub-event {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff5ec);\n}\n:host ::ng-deep .mat-mdc-option.status-option.chat-context-filter-group {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf9f4);\n}\n:host ::ng-deep .mat-mdc-option.status-option.rate-filter-group-option {\n  background: #fff;\n  opacity: 1;\n  pointer-events: auto;\n  min-height: 28px;\n  cursor: default;\n  padding-left: 0;\n  padding-right: 0;\n}\n:host ::ng-deep .mat-mdc-option.status-option.rate-filter-group-option.mdc-list-item--disabled,\n:host ::ng-deep .mat-mdc-option.status-option.rate-filter-group-option[aria-disabled=true] {\n  opacity: 1;\n  color: inherit;\n}\n:host ::ng-deep .mat-mdc-option.status-option.rate-filter-group-option.is-group-separator {\n  border-top: 1px solid rgba(92, 110, 140, 0.28);\n  margin-top: 0.28rem;\n  padding-top: 0.34rem;\n}\n:host ::ng-deep .mat-mdc-option.status-option.rate-filter-group-option .mdc-list-item__primary-text {\n  width: 100%;\n  opacity: 1;\n}\n:host ::ng-deep .mat-mdc-option.status-option.rate-filter-group-option .activities-rate-social-badge-toggle {\n  pointer-events: auto;\n}\n:host ::ng-deep .mat-mdc-option.status-option.rate-filter-item-individual-given {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1f3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.rate-filter-item-individual-received {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf4ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.rate-filter-item-individual-mutual {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f2f3ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.rate-filter-item-individual-met {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf8ee);\n}\n:host ::ng-deep .mat-mdc-option.status-option.rate-filter-item-pair-given {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff5ec);\n}\n:host ::ng-deep .mat-mdc-option.status-option.rate-filter-item-pair-received {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf9f4);\n}\n@media (max-width: 760px) {\n  .activities-mobile-filter-panel,\n  .activities-mobile-rate-filter-panel {\n    position: fixed;\n    left: 0.65rem !important;\n    right: 0.65rem !important;\n    top: auto !important;\n    bottom: 0;\n    width: auto;\n    max-width: calc(100vw - 1.3rem);\n    max-height: min(54vh, 420px);\n    min-width: 0;\n    border-radius: 16px 16px 0 0;\n    border: 1px solid #d6deea;\n    border-bottom: 0;\n    box-shadow: 0 -14px 28px rgba(15, 29, 52, 0.24);\n    padding: 0.84rem 0.6rem max(0.62rem, env(safe-area-inset-bottom));\n    gap: 0.32rem;\n    overflow-x: hidden;\n    overflow-y: auto;\n    z-index: 2805;\n  }\n  .activities-mobile-rate-filter-panel {\n    max-height: min(100dvh - 4.6rem, 560px);\n  }\n  .activities-mobile-filter-panel::before,\n  .activities-mobile-rate-filter-panel::before {\n    content: "";\n    position: sticky;\n    top: 0;\n    display: block;\n    width: 42px;\n    height: 4px;\n    border-radius: 999px;\n    background: rgba(44, 67, 100, 0.24);\n    margin: 0 auto 0.52rem;\n    z-index: 1;\n  }\n  .experience-item-head {\n    grid-template-columns: auto minmax(0, 1fr) auto;\n    grid-template-areas: "icon meta actions";\n    row-gap: 0.32rem;\n  }\n  .experience-item-icon {\n    grid-area: icon;\n  }\n  .experience-item-meta {\n    grid-area: meta;\n  }\n  .experience-item-actions {\n    justify-self: end;\n  }\n}\n/*# sourceMappingURL=activities-popup.component.css.map */\n'] }]
  }], () => [], { activitiesSmartList: [{
    type: ViewChild,
    args: ["activitiesSmartList"]
  }], onEscapePressed: [{
    type: HostListener,
    args: ["window:keydown.escape", ["$event"]]
  }], onViewportResize: [{
    type: HostListener,
    args: ["window:resize"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ActivitiesPopupComponent, { className: "ActivitiesPopupComponent", filePath: "app/activity/components/activities-popup/activities-popup.component.ts", lineNumber: 222 });
})();
export {
  ActivitiesPopupComponent
};
//# sourceMappingURL=activities-popup.component-QNFJNMCZ.js.map
