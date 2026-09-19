import {
  PaymentMethodsPopupStore
} from "./chunk-EJ5KWFDD.js";
import {
  PaymentCardComponent
} from "./chunk-7FJOOQKP.js";
import {
  DeploymentConfigurationService
} from "./chunk-MOUXN75Y.js";
import {
  I18nPipe,
  MatIcon,
  MatIconModule
} from "./chunk-L6HJFJOR.js";
import {
  CommonModule
} from "./chunk-SCHUURLR.js";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  setClassMetadata,
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
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-EV3I3YNV.js";

// src/app/activity/components/event-editor-popup/event-payment-input/event-payment-input.component.ts
function EventPaymentInputComponent_Conditional_12_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 8);
    \u0275\u0275element(1, "img", 9);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const providerLabel_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("src", ctx, \u0275\u0275sanitizeUrl)("alt", providerLabel_r1);
  }
}
function EventPaymentInputComponent_Conditional_12_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const providerLabel_r1 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.paymentProviderIcon());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 2, providerLabel_r1));
  }
}
function EventPaymentInputComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 7);
    \u0275\u0275pipe(1, "i18n");
    \u0275\u0275conditionalCreate(2, EventPaymentInputComponent_Conditional_12_Conditional_2_Template, 2, 2, "span", 8)(3, EventPaymentInputComponent_Conditional_12_Conditional_3_Template, 5, 4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("event-payment-provider-badge--logo-only", ctx_r1.paymentProviderLogo());
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(1, 4, ctx));
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_4_0 = ctx_r1.paymentProviderLogo()) ? 2 : 3, tmp_4_0);
  }
}
function EventPaymentInputComponent_Conditional_27_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 12);
    \u0275\u0275pipe(1, "i18n");
    \u0275\u0275listener("click", function EventPaymentInputComponent_Conditional_27_Conditional_1_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openPaymentMethodPicker($event));
    });
    \u0275\u0275element(2, "app-payment-card", 13);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r1.paymentMethodReadOnly || ctx_r1.paymentMethodSelectionDisabled);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(1, 5, "payment.card.change.aria"));
    \u0275\u0275advance(2);
    \u0275\u0275property("card", ctx)("selectable", false)("showMenu", false);
  }
}
function EventPaymentInputComponent_Conditional_27_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 14);
    \u0275\u0275pipe(1, "i18n");
    \u0275\u0275listener("click", function EventPaymentInputComponent_Conditional_27_Conditional_2_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openPaymentMethodPicker($event));
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r1.paymentMethodSelectionDisabled);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(1, 3, "payment.card.select.aria"));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(6, 5, "payment.card.select"));
  }
}
function EventPaymentInputComponent_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275conditionalCreate(1, EventPaymentInputComponent_Conditional_27_Conditional_1_Template, 3, 7, "button", 10)(2, EventPaymentInputComponent_Conditional_27_Conditional_2_Template, 7, 7, "button", 11);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_1_0 = ctx_r1.paymentCard()) ? 1 : !ctx_r1.paymentMethodReadOnly ? 2 : -1, tmp_1_0);
  }
}
var EventPaymentInputComponent = class _EventPaymentInputComponent {
  paymentMethodsPopupStore = inject(PaymentMethodsPopupStore);
  deploymentConfiguration = inject(DeploymentConfigurationService);
  config = {};
  totalAmount = 0;
  currency = "USD";
  tone = "payment";
  provider = "";
  providerLabel = "";
  statusLabel = "";
  statusTone = "neutral";
  note = "";
  paymentMethod = null;
  paymentMethodSelectionDisabled = false;
  paymentMethodReadOnly = false;
  paymentMethodChange = new EventEmitter();
  title() {
    return this.config.title ?? "event.editor.payment.title";
  }
  subtitle() {
    return this.config.subtitle ?? "event.editor.payment.subtitle";
  }
  paymentCard() {
    const method = this.paymentMethod;
    return method ? {
      id: method.id,
      provider: method.provider,
      brand: method.brand,
      last4: method.last4,
      expiryMonth: method.expiryMonth,
      expiryYear: method.expiryYear,
      cardholderName: method.cardholderName,
      artworkUrl: method.artworkUrl,
      selected: false,
      disabled: this.paymentMethodReadOnly,
      updateNeeded: this.paymentMethodUpdateNeeded()
    } : null;
  }
  openPaymentMethodPicker(event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.paymentMethodReadOnly || this.paymentMethodSelectionDisabled)
      return;
    void this.paymentMethodsPopupStore.openPicker({
      selectedPaymentMethodId: this.paymentMethod?.id ?? null,
      onSelect: (paymentMethod) => this.paymentMethodChange.emit(paymentMethod)
    });
  }
  formatMoney(amount, currency = this.currency) {
    const value = Number(amount) || 0;
    const formattedAmount = new Intl.NumberFormat(void 0, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
    return `${this.currencySymbol(currency)}${formattedAmount}`;
  }
  paymentProviderLabel() {
    return this.paymentProviderName() || this.providerLabel.trim() || "event.editor.payment.cash.only";
  }
  paymentProviderLogo() {
    const provider = this.paymentProvider();
    return provider ? `assets/payment-providers/${provider}.svg` : null;
  }
  paymentProviderIcon() {
    return this.providerLabel.trim() ? "verified" : "payments";
  }
  paymentStatusLabel() {
    return this.statusLabel.trim() || (this.cashOnly() ? "event.editor.payment.cash.status" : this.config.paymentIntegrationEnabled ? "event.editor.payment.ready.redirect" : "event.editor.payment.review.before.confirm");
  }
  paymentStatusMessage() {
    if (this.statusTone === "success") {
      return this.paymentStatusLabel();
    }
    return this.paymentNote() || this.paymentStatusLabel();
  }
  paymentNote() {
    return this.note.trim() || (this.cashOnly() ? "" : this.config.paymentIntegrationEnabled ? "event.editor.payment.gateway.note" : "event.editor.payment.demo.note");
  }
  showPaymentMethod() {
    return Boolean(this.paymentMethod) || Boolean(this.providerLabel.trim()) || !this.cashOnly();
  }
  cashOnly() {
    return !this.providerLabel.trim() && this.paymentProvider() === null;
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
  paymentProvider() {
    const explicitProvider = this.provider.trim().toLowerCase();
    if (explicitProvider === "stripe" || explicitProvider === "barion") {
      return explicitProvider;
    }
    if (this.providerLabel.trim()) {
      return null;
    }
    const provider = `${this.deploymentConfiguration.paymentProviderId() ?? ""}`.trim().toLowerCase();
    return provider === "stripe" || provider === "barion" ? provider : null;
  }
  paymentProviderName() {
    const provider = this.paymentProvider();
    return provider ? provider.charAt(0).toUpperCase() + provider.slice(1) : "";
  }
  paymentMethodUpdateNeeded() {
    if (!this.paymentMethod || this.paymentMethodReadOnly) {
      return false;
    }
    const tokenProvider = `${this.paymentMethod.provider ?? ""}`.trim().toLowerCase();
    const currentProvider = this.paymentProvider();
    return Boolean(tokenProvider && tokenProvider !== (currentProvider ?? "cash-only"));
  }
  static \u0275fac = function EventPaymentInputComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EventPaymentInputComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EventPaymentInputComponent, selectors: [["app-event-payment-input"]], inputs: { config: "config", totalAmount: "totalAmount", currency: "currency", tone: "tone", provider: "provider", providerLabel: "providerLabel", statusLabel: "statusLabel", statusTone: "statusTone", note: "note", paymentMethod: "paymentMethod", paymentMethodSelectionDisabled: "paymentMethodSelectionDisabled", paymentMethodReadOnly: "paymentMethodReadOnly" }, outputs: { paymentMethodChange: "paymentMethodChange" }, decls: 28, vars: 32, consts: [[1, "event-payment-input-card"], [1, "event-payment-input-head"], [1, "event-payment-panel-title"], [1, "event-payment-provider-badge", 3, "event-payment-provider-badge--logo-only"], [1, "event-payment-status-grid"], [1, "event-payment-status"], [1, "event-payment-method-shell"], [1, "event-payment-provider-badge"], [1, "event-payment-provider-badge__image"], [3, "src", "alt"], ["type", "button", 1, "event-payment-method-button", "event-payment-method-button--card", 3, "disabled"], ["type", "button", 1, "event-payment-method-button", "event-payment-method-button--empty", 3, "disabled"], ["type", "button", 1, "event-payment-method-button", "event-payment-method-button--card", 3, "click", "disabled"], [3, "card", "selectable", "showMenu"], ["type", "button", 1, "event-payment-method-button", "event-payment-method-button--empty", 3, "click", "disabled"]], template: function EventPaymentInputComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "mat-icon");
      \u0275\u0275text(4, "payments");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div")(6, "h3");
      \u0275\u0275text(7);
      \u0275\u0275pipe(8, "i18n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "p");
      \u0275\u0275text(10);
      \u0275\u0275pipe(11, "i18n");
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(12, EventPaymentInputComponent_Conditional_12_Template, 4, 6, "span", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 4)(14, "article")(15, "span");
      \u0275\u0275text(16);
      \u0275\u0275pipe(17, "i18n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "strong");
      \u0275\u0275text(19);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(20, "article", 5)(21, "span");
      \u0275\u0275text(22);
      \u0275\u0275pipe(23, "i18n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "strong");
      \u0275\u0275text(25);
      \u0275\u0275pipe(26, "i18n");
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(27, EventPaymentInputComponent_Conditional_27_Template, 3, 1, "div", 6);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_6_0;
      \u0275\u0275classProp("event-payment-input-card--ready", ctx.tone === "ready")("event-payment-input-card--payment", ctx.tone === "payment")("event-payment-input-card--waiting", ctx.tone === "waiting")("event-payment-input-card--approval", ctx.tone === "approval");
      \u0275\u0275advance(7);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 22, ctx.title()));
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(11, 24, ctx.subtitle()));
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_6_0 = ctx.paymentProviderLabel()) ? 12 : -1, tmp_6_0);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(17, 26, "event.editor.payment.amount"));
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.formatMoney(ctx.totalAmount, ctx.currency));
      \u0275\u0275advance();
      \u0275\u0275classProp("event-payment-status--success", ctx.statusTone === "success")("event-payment-status--danger", ctx.statusTone === "danger")("event-payment-status--refund", ctx.statusTone === "refund");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(23, 28, "event.editor.payment.status"));
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(26, 30, ctx.paymentStatusMessage()));
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.showPaymentMethod() ? 27 : -1);
    }
  }, dependencies: [
    CommonModule,
    MatIconModule,
    MatIcon,
    PaymentCardComponent,
    I18nPipe
  ], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  grid-column: 1/-1;\n}\n.event-payment-panel[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.86rem;\n  min-width: 0;\n  border: 1px solid rgba(93, 108, 128, 0.3);\n  border-radius: 16px;\n  background:\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #eef5f5 100%);\n  box-shadow: 0 4px 12px rgba(39, 53, 72, 0.08);\n  padding: 0.78rem;\n  box-sizing: border-box;\n}\n.event-payment-panel-head[_ngcontent-%COMP%], \n.event-payment-layout[_ngcontent-%COMP%], \n.event-payment-section-head[_ngcontent-%COMP%], \n.event-payment-context[_ngcontent-%COMP%], \n.event-payment-item[_ngcontent-%COMP%], \n.event-payment-receipt-row[_ngcontent-%COMP%], \n.event-payment-receipt-total[_ngcontent-%COMP%], \n.event-payment-input-head[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.75rem;\n  min-width: 0;\n}\n.event-payment-panel-title[_ngcontent-%COMP%] {\n  display: inline-grid;\n  grid-template-columns: auto minmax(0, 1fr);\n  align-items: center;\n  gap: 0.58rem;\n  min-width: 0;\n}\n.event-payment-panel-title[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 22px;\n  height: 22px;\n  font-size: 22px;\n  color: #257a69;\n}\n.event-payment-panel-title[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%], \n.event-payment-input-head[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #173b5c;\n  font-size: 1rem;\n  line-height: 1.2;\n}\n.event-payment-panel-title[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n.event-payment-input-head[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.18rem 0 0;\n  color: rgba(43, 64, 96, 0.72);\n  font-size: 0.82rem;\n  line-height: 1.35;\n}\n.event-payment-total[_ngcontent-%COMP%] {\n  display: grid;\n  justify-items: end;\n  gap: 0.16rem;\n  min-width: max-content;\n}\n.event-payment-total[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.event-payment-status-grid[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.event-payment-section-head[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: rgba(43, 64, 96, 0.66);\n  font-size: 0.76rem;\n  font-weight: 800;\n  text-transform: uppercase;\n}\n.event-payment-total[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #16836f;\n  font-size: 1.34rem;\n  line-height: 1.1;\n}\n.event-payment-layout[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 1.05fr) minmax(280px, 0.95fr);\n  align-items: start;\n}\n.event-payment-summary[_ngcontent-%COMP%], \n.event-payment-input-card[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.72rem;\n  min-width: 0;\n  border: 1px solid rgba(191, 212, 233, 0.72);\n  border-radius: 14px;\n  background: rgba(255, 255, 255, 0.84);\n  padding: 0.78rem;\n}\n.event-payment-input-card--ready[_ngcontent-%COMP%] {\n  border-color: rgba(55, 132, 169, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(244, 251, 255, 0.96) 0%,\n      rgba(233, 245, 250, 0.96) 100%);\n}\n.event-payment-input-card--payment[_ngcontent-%COMP%] {\n  border-color: rgba(82, 94, 192, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(246, 247, 255, 0.96) 0%,\n      rgba(237, 240, 255, 0.96) 100%);\n}\n.event-payment-input-card--waiting[_ngcontent-%COMP%], \n.event-payment-input-card--approval[_ngcontent-%COMP%] {\n  border-color: rgba(205, 143, 53, 0.36);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 250, 240, 0.96) 0%,\n      rgba(250, 241, 222, 0.96) 100%);\n}\n.event-payment-context[_ngcontent-%COMP%] {\n  border: 1px solid rgba(89, 137, 151, 0.22);\n  border-radius: 12px;\n  background: rgba(238, 250, 248, 0.74);\n  padding: 0.68rem 0.74rem;\n}\n.event-payment-context-main[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.18rem;\n  min-width: 0;\n}\n.event-payment-context-main[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.event-payment-item[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]:first-child, \n.event-payment-section-head[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.event-payment-receipt-row[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.event-payment-receipt-total[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.event-payment-status-grid[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #183a5a;\n  font-weight: 900;\n}\n.event-payment-context-main[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.event-payment-context-time[_ngcontent-%COMP%], \n.event-payment-item[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.event-payment-item[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.event-payment-receipt-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: rgba(42, 64, 96, 0.72);\n  font-size: 0.82rem;\n  line-height: 1.35;\n}\n.event-payment-context-time[_ngcontent-%COMP%] {\n  justify-self: end;\n  text-align: right;\n  font-weight: 800;\n}\n.event-payment-item-list[_ngcontent-%COMP%], \n.event-payment-receipt[_ngcontent-%COMP%], \n.event-payment-status-grid[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.56rem;\n  min-width: 0;\n}\n.event-payment-item[_ngcontent-%COMP%], \n.event-payment-empty[_ngcontent-%COMP%], \n.event-payment-receipt[_ngcontent-%COMP%] {\n  border: 1px solid rgba(192, 212, 232, 0.72);\n  border-radius: 12px;\n  background: rgba(249, 252, 255, 0.9);\n}\n.event-payment-item[_ngcontent-%COMP%] {\n  padding: 0.62rem 0.68rem;\n}\n.event-payment-item[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.14rem;\n  min-width: 0;\n}\n.event-payment-item[_ngcontent-%COMP%]    > strong[_ngcontent-%COMP%] {\n  justify-self: end;\n  color: #16836f;\n  white-space: nowrap;\n}\n.event-payment-empty[_ngcontent-%COMP%] {\n  padding: 0.76rem;\n  color: #24476f;\n  font-weight: 800;\n}\n.event-payment-receipt[_ngcontent-%COMP%] {\n  padding: 0.64rem 0.72rem;\n}\n.event-payment-receipt-row[_ngcontent-%COMP%], \n.event-payment-receipt-total[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 1fr) auto;\n  gap: 0.68rem;\n}\n.event-payment-receipt-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-wrap: wrap;\n  align-items: baseline;\n  gap: 0.32rem;\n  min-width: 0;\n  color: rgba(42, 64, 96, 0.78);\n}\n.event-payment-receipt-total[_ngcontent-%COMP%] {\n  margin-top: 0.18rem;\n  padding-top: 0.52rem;\n  border-top: 1px solid rgba(89, 137, 151, 0.22);\n}\n.event-payment-receipt-total[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #16836f;\n  font-size: 1.12rem;\n}\n.event-payment-provider-badge[_ngcontent-%COMP%] {\n  justify-self: end;\n  min-height: 32px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.42rem;\n  border: 1px solid rgba(97, 158, 137, 0.42);\n  border-radius: 999px;\n  background: rgba(232, 249, 243, 0.95);\n  color: #2a7057;\n  padding: 0 0.72rem;\n  font-size: 0.78rem;\n  font-weight: 900;\n  white-space: nowrap;\n}\n.event-payment-provider-badge[_ngcontent-%COMP%]    > mat-icon[_ngcontent-%COMP%] {\n  width: 1.08rem;\n  height: 1.08rem;\n  font-size: 1.08rem;\n  line-height: 1.08rem;\n}\n.event-payment-provider-badge--logo-only[_ngcontent-%COMP%] {\n  padding: 0 0.38rem;\n}\n.event-payment-provider-badge__image[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 2.4rem;\n  height: 1.36rem;\n  overflow: hidden;\n  border: 1px solid rgba(255, 255, 255, 0.76);\n  border-radius: 7px;\n  background: rgba(255, 255, 255, 0.78);\n  padding: 0.12rem;\n}\n.event-payment-provider-badge__image[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 100%;\n  object-fit: contain;\n}\n.event-payment-status-grid[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n.event-payment-status-grid[_ngcontent-%COMP%]   article[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.2rem;\n  border: 1px solid rgba(192, 212, 232, 0.72);\n  border-radius: 12px;\n  background: rgba(249, 252, 255, 0.9);\n  padding: 0.62rem 0.68rem;\n}\n.event-payment-status-grid[_ngcontent-%COMP%]   .event-payment-status--success[_ngcontent-%COMP%] {\n  border-color: rgba(34, 146, 93, 0.48);\n  background: rgba(225, 247, 235, 0.96);\n}\n.event-payment-status-grid[_ngcontent-%COMP%]   .event-payment-status--success[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.event-payment-status-grid[_ngcontent-%COMP%]   .event-payment-status--success[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #12663f;\n}\n.event-payment-status-grid[_ngcontent-%COMP%]   .event-payment-status--danger[_ngcontent-%COMP%] {\n  border-color: rgba(214, 55, 68, 0.5);\n  background: rgba(255, 232, 235, 0.97);\n}\n.event-payment-status-grid[_ngcontent-%COMP%]   .event-payment-status--danger[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.event-payment-status-grid[_ngcontent-%COMP%]   .event-payment-status--danger[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #a7192d;\n}\n.event-payment-status-grid[_ngcontent-%COMP%]   .event-payment-status--refund[_ngcontent-%COMP%] {\n  border-color: rgba(109, 91, 208, 0.5);\n  background: rgba(239, 236, 255, 0.97);\n}\n.event-payment-status-grid[_ngcontent-%COMP%]   .event-payment-status--refund[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.event-payment-status-grid[_ngcontent-%COMP%]   .event-payment-status--refund[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #5140ad;\n}\n.event-payment-method-shell[_ngcontent-%COMP%] {\n  width: min(100%, 34rem);\n  min-width: 0;\n  justify-self: center;\n}\n.event-payment-method-button[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  min-width: 0;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  font: inherit;\n  text-align: inherit;\n}\n.event-payment-method-button[_ngcontent-%COMP%]:not(:disabled) {\n  cursor: pointer;\n}\n.event-payment-method-button[_ngcontent-%COMP%]:focus-visible {\n  outline: 3px solid rgba(58, 121, 222, 0.72);\n  outline-offset: 4px;\n  border-radius: 1.05rem;\n}\n.event-payment-method-button[_ngcontent-%COMP%]:disabled {\n  opacity: 0.65;\n}\n.event-payment-method-button--empty[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  align-content: center;\n  gap: 0.55rem;\n  aspect-ratio: 1.586/1;\n  border: 2px dashed rgba(64, 105, 164, 0.5);\n  border-radius: 1.05rem;\n  background:\n    linear-gradient(\n      145deg,\n      rgba(246, 250, 255, 0.98),\n      rgba(226, 237, 252, 0.94));\n  color: #234d80;\n}\n.event-payment-method-button--empty[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 2.4rem;\n  height: 2.4rem;\n  font-size: 2.4rem;\n}\n.event-payment-method-button--empty[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.92rem;\n}\n@media (max-width: 860px) {\n  .event-payment-panel-head[_ngcontent-%COMP%], \n   .event-payment-layout[_ngcontent-%COMP%], \n   .event-payment-context[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .event-payment-total[_ngcontent-%COMP%], \n   .event-payment-context-time[_ngcontent-%COMP%], \n   .event-payment-context-time[_ngcontent-%COMP%] {\n    justify-self: start;\n    text-align: left;\n  }\n}\n@media (max-width: 640px) {\n  .event-payment-status-grid[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .event-payment-item[_ngcontent-%COMP%], \n   .event-payment-receipt-row[_ngcontent-%COMP%], \n   .event-payment-receipt-total[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .event-payment-item[_ngcontent-%COMP%]    > strong[_ngcontent-%COMP%], \n   .event-payment-receipt-row[_ngcontent-%COMP%]    > strong[_ngcontent-%COMP%], \n   .event-payment-receipt-total[_ngcontent-%COMP%]    > strong[_ngcontent-%COMP%] {\n    justify-self: start;\n  }\n}\n/*# sourceMappingURL=event-payment-input.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EventPaymentInputComponent, [{
    type: Component,
    args: [{ selector: "app-event-payment-input", standalone: true, imports: [
      CommonModule,
      MatIconModule,
      PaymentCardComponent,
      I18nPipe
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `<section
  class="event-payment-input-card"
  [class.event-payment-input-card--ready]="tone === 'ready'"
  [class.event-payment-input-card--payment]="tone === 'payment'"
  [class.event-payment-input-card--waiting]="tone === 'waiting'"
  [class.event-payment-input-card--approval]="tone === 'approval'"
>
  <div class="event-payment-input-head">
    <div class="event-payment-panel-title">
      <mat-icon>payments</mat-icon>
      <div>
        <h3>{{ title() | i18n }}</h3>
        <p>{{ subtitle() | i18n }}</p>
      </div>
    </div>
    @if (paymentProviderLabel(); as providerLabel) {
      <span
        class="event-payment-provider-badge"
        [class.event-payment-provider-badge--logo-only]="paymentProviderLogo()"
        [attr.aria-label]="providerLabel | i18n"
      >
        @if (paymentProviderLogo(); as providerLogo) {
          <span class="event-payment-provider-badge__image">
            <img [src]="providerLogo" [alt]="providerLabel" />
          </span>
        } @else {
          <mat-icon>{{ paymentProviderIcon() }}</mat-icon>
          <span>{{ providerLabel | i18n }}</span>
        }
      </span>
    }
  </div>

  <div class="event-payment-status-grid">
    <article>
      <span>{{ 'event.editor.payment.amount' | i18n }}</span>
      <strong>{{ formatMoney(totalAmount, currency) }}</strong>
    </article>
    <article
      class="event-payment-status"
      [class.event-payment-status--success]="statusTone === 'success'"
      [class.event-payment-status--danger]="statusTone === 'danger'"
      [class.event-payment-status--refund]="statusTone === 'refund'"
    >
      <span>{{ 'event.editor.payment.status' | i18n }}</span>
      <strong>{{ paymentStatusMessage() | i18n }}</strong>
    </article>
  </div>

  @if (showPaymentMethod()) {
  <div class="event-payment-method-shell">
    @if (paymentCard(); as card) {
      <button
        type="button"
        class="event-payment-method-button event-payment-method-button--card"
        [disabled]="paymentMethodReadOnly || paymentMethodSelectionDisabled"
        [attr.aria-label]="'payment.card.change.aria' | i18n"
        (click)="openPaymentMethodPicker($event)"
      >
        <app-payment-card [card]="card" [selectable]="false" [showMenu]="false"></app-payment-card>
      </button>
    } @else if (!paymentMethodReadOnly) {
      <button
        type="button"
        class="event-payment-method-button event-payment-method-button--empty"
        [disabled]="paymentMethodSelectionDisabled"
        [attr.aria-label]="'payment.card.select.aria' | i18n"
        (click)="openPaymentMethodPicker($event)"
      >
        <mat-icon>add</mat-icon>
        <strong>{{ 'payment.card.select' | i18n }}</strong>
      </button>
    }
  </div>
  }
</section>
`, styles: ["/* src/app/activity/components/event-editor-popup/event-payment-input/event-payment-input.component.scss */\n:host {\n  display: block;\n  grid-column: 1/-1;\n}\n.event-payment-panel {\n  display: grid;\n  gap: 0.86rem;\n  min-width: 0;\n  border: 1px solid rgba(93, 108, 128, 0.3);\n  border-radius: 16px;\n  background:\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #eef5f5 100%);\n  box-shadow: 0 4px 12px rgba(39, 53, 72, 0.08);\n  padding: 0.78rem;\n  box-sizing: border-box;\n}\n.event-payment-panel-head,\n.event-payment-layout,\n.event-payment-section-head,\n.event-payment-context,\n.event-payment-item,\n.event-payment-receipt-row,\n.event-payment-receipt-total,\n.event-payment-input-head {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.75rem;\n  min-width: 0;\n}\n.event-payment-panel-title {\n  display: inline-grid;\n  grid-template-columns: auto minmax(0, 1fr);\n  align-items: center;\n  gap: 0.58rem;\n  min-width: 0;\n}\n.event-payment-panel-title .mat-icon {\n  width: 22px;\n  height: 22px;\n  font-size: 22px;\n  color: #257a69;\n}\n.event-payment-panel-title h3,\n.event-payment-input-head h4 {\n  margin: 0;\n  color: #173b5c;\n  font-size: 1rem;\n  line-height: 1.2;\n}\n.event-payment-panel-title p,\n.event-payment-input-head p {\n  margin: 0.18rem 0 0;\n  color: rgba(43, 64, 96, 0.72);\n  font-size: 0.82rem;\n  line-height: 1.35;\n}\n.event-payment-total {\n  display: grid;\n  justify-items: end;\n  gap: 0.16rem;\n  min-width: max-content;\n}\n.event-payment-total span,\n.event-payment-status-grid span,\n.event-payment-section-head span {\n  color: rgba(43, 64, 96, 0.66);\n  font-size: 0.76rem;\n  font-weight: 800;\n  text-transform: uppercase;\n}\n.event-payment-total strong {\n  color: #16836f;\n  font-size: 1.34rem;\n  line-height: 1.1;\n}\n.event-payment-layout {\n  grid-template-columns: minmax(0, 1.05fr) minmax(280px, 0.95fr);\n  align-items: start;\n}\n.event-payment-summary,\n.event-payment-input-card {\n  display: grid;\n  gap: 0.72rem;\n  min-width: 0;\n  border: 1px solid rgba(191, 212, 233, 0.72);\n  border-radius: 14px;\n  background: rgba(255, 255, 255, 0.84);\n  padding: 0.78rem;\n}\n.event-payment-input-card--ready {\n  border-color: rgba(55, 132, 169, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(244, 251, 255, 0.96) 0%,\n      rgba(233, 245, 250, 0.96) 100%);\n}\n.event-payment-input-card--payment {\n  border-color: rgba(82, 94, 192, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(246, 247, 255, 0.96) 0%,\n      rgba(237, 240, 255, 0.96) 100%);\n}\n.event-payment-input-card--waiting,\n.event-payment-input-card--approval {\n  border-color: rgba(205, 143, 53, 0.36);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 250, 240, 0.96) 0%,\n      rgba(250, 241, 222, 0.96) 100%);\n}\n.event-payment-context {\n  border: 1px solid rgba(89, 137, 151, 0.22);\n  border-radius: 12px;\n  background: rgba(238, 250, 248, 0.74);\n  padding: 0.68rem 0.74rem;\n}\n.event-payment-context-main {\n  display: grid;\n  gap: 0.18rem;\n  min-width: 0;\n}\n.event-payment-context-main strong,\n.event-payment-item strong:first-child,\n.event-payment-section-head strong,\n.event-payment-receipt-row strong,\n.event-payment-receipt-total strong,\n.event-payment-status-grid strong {\n  color: #183a5a;\n  font-weight: 900;\n}\n.event-payment-context-main span,\n.event-payment-context-time,\n.event-payment-item span,\n.event-payment-item small,\n.event-payment-receipt-row span small {\n  color: rgba(42, 64, 96, 0.72);\n  font-size: 0.82rem;\n  line-height: 1.35;\n}\n.event-payment-context-time {\n  justify-self: end;\n  text-align: right;\n  font-weight: 800;\n}\n.event-payment-item-list,\n.event-payment-receipt,\n.event-payment-status-grid {\n  display: grid;\n  gap: 0.56rem;\n  min-width: 0;\n}\n.event-payment-item,\n.event-payment-empty,\n.event-payment-receipt {\n  border: 1px solid rgba(192, 212, 232, 0.72);\n  border-radius: 12px;\n  background: rgba(249, 252, 255, 0.9);\n}\n.event-payment-item {\n  padding: 0.62rem 0.68rem;\n}\n.event-payment-item div {\n  display: grid;\n  gap: 0.14rem;\n  min-width: 0;\n}\n.event-payment-item > strong {\n  justify-self: end;\n  color: #16836f;\n  white-space: nowrap;\n}\n.event-payment-empty {\n  padding: 0.76rem;\n  color: #24476f;\n  font-weight: 800;\n}\n.event-payment-receipt {\n  padding: 0.64rem 0.72rem;\n}\n.event-payment-receipt-row,\n.event-payment-receipt-total {\n  grid-template-columns: minmax(0, 1fr) auto;\n  gap: 0.68rem;\n}\n.event-payment-receipt-row span {\n  display: inline-flex;\n  flex-wrap: wrap;\n  align-items: baseline;\n  gap: 0.32rem;\n  min-width: 0;\n  color: rgba(42, 64, 96, 0.78);\n}\n.event-payment-receipt-total {\n  margin-top: 0.18rem;\n  padding-top: 0.52rem;\n  border-top: 1px solid rgba(89, 137, 151, 0.22);\n}\n.event-payment-receipt-total strong {\n  color: #16836f;\n  font-size: 1.12rem;\n}\n.event-payment-provider-badge {\n  justify-self: end;\n  min-height: 32px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.42rem;\n  border: 1px solid rgba(97, 158, 137, 0.42);\n  border-radius: 999px;\n  background: rgba(232, 249, 243, 0.95);\n  color: #2a7057;\n  padding: 0 0.72rem;\n  font-size: 0.78rem;\n  font-weight: 900;\n  white-space: nowrap;\n}\n.event-payment-provider-badge > mat-icon {\n  width: 1.08rem;\n  height: 1.08rem;\n  font-size: 1.08rem;\n  line-height: 1.08rem;\n}\n.event-payment-provider-badge--logo-only {\n  padding: 0 0.38rem;\n}\n.event-payment-provider-badge__image {\n  box-sizing: border-box;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 2.4rem;\n  height: 1.36rem;\n  overflow: hidden;\n  border: 1px solid rgba(255, 255, 255, 0.76);\n  border-radius: 7px;\n  background: rgba(255, 255, 255, 0.78);\n  padding: 0.12rem;\n}\n.event-payment-provider-badge__image img {\n  display: block;\n  width: 100%;\n  height: 100%;\n  object-fit: contain;\n}\n.event-payment-status-grid {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n.event-payment-status-grid article {\n  display: grid;\n  gap: 0.2rem;\n  border: 1px solid rgba(192, 212, 232, 0.72);\n  border-radius: 12px;\n  background: rgba(249, 252, 255, 0.9);\n  padding: 0.62rem 0.68rem;\n}\n.event-payment-status-grid .event-payment-status--success {\n  border-color: rgba(34, 146, 93, 0.48);\n  background: rgba(225, 247, 235, 0.96);\n}\n.event-payment-status-grid .event-payment-status--success span,\n.event-payment-status-grid .event-payment-status--success strong {\n  color: #12663f;\n}\n.event-payment-status-grid .event-payment-status--danger {\n  border-color: rgba(214, 55, 68, 0.5);\n  background: rgba(255, 232, 235, 0.97);\n}\n.event-payment-status-grid .event-payment-status--danger span,\n.event-payment-status-grid .event-payment-status--danger strong {\n  color: #a7192d;\n}\n.event-payment-status-grid .event-payment-status--refund {\n  border-color: rgba(109, 91, 208, 0.5);\n  background: rgba(239, 236, 255, 0.97);\n}\n.event-payment-status-grid .event-payment-status--refund span,\n.event-payment-status-grid .event-payment-status--refund strong {\n  color: #5140ad;\n}\n.event-payment-method-shell {\n  width: min(100%, 34rem);\n  min-width: 0;\n  justify-self: center;\n}\n.event-payment-method-button {\n  display: block;\n  width: 100%;\n  min-width: 0;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  font: inherit;\n  text-align: inherit;\n}\n.event-payment-method-button:not(:disabled) {\n  cursor: pointer;\n}\n.event-payment-method-button:focus-visible {\n  outline: 3px solid rgba(58, 121, 222, 0.72);\n  outline-offset: 4px;\n  border-radius: 1.05rem;\n}\n.event-payment-method-button:disabled {\n  opacity: 0.65;\n}\n.event-payment-method-button--empty {\n  display: grid;\n  place-items: center;\n  align-content: center;\n  gap: 0.55rem;\n  aspect-ratio: 1.586/1;\n  border: 2px dashed rgba(64, 105, 164, 0.5);\n  border-radius: 1.05rem;\n  background:\n    linear-gradient(\n      145deg,\n      rgba(246, 250, 255, 0.98),\n      rgba(226, 237, 252, 0.94));\n  color: #234d80;\n}\n.event-payment-method-button--empty mat-icon {\n  width: 2.4rem;\n  height: 2.4rem;\n  font-size: 2.4rem;\n}\n.event-payment-method-button--empty strong {\n  font-size: 0.92rem;\n}\n@media (max-width: 860px) {\n  .event-payment-panel-head,\n  .event-payment-layout,\n  .event-payment-context {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .event-payment-total,\n  .event-payment-context-time,\n  .event-payment-context-time {\n    justify-self: start;\n    text-align: left;\n  }\n}\n@media (max-width: 640px) {\n  .event-payment-status-grid {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .event-payment-item,\n  .event-payment-receipt-row,\n  .event-payment-receipt-total {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .event-payment-item > strong,\n  .event-payment-receipt-row > strong,\n  .event-payment-receipt-total > strong {\n    justify-self: start;\n  }\n}\n/*# sourceMappingURL=event-payment-input.component.css.map */\n"] }]
  }], null, { config: [{
    type: Input
  }], totalAmount: [{
    type: Input
  }], currency: [{
    type: Input
  }], tone: [{
    type: Input
  }], provider: [{
    type: Input
  }], providerLabel: [{
    type: Input
  }], statusLabel: [{
    type: Input
  }], statusTone: [{
    type: Input
  }], note: [{
    type: Input
  }], paymentMethod: [{
    type: Input
  }], paymentMethodSelectionDisabled: [{
    type: Input
  }], paymentMethodReadOnly: [{
    type: Input
  }], paymentMethodChange: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EventPaymentInputComponent, { className: "EventPaymentInputComponent", filePath: "app/activity/components/event-editor-popup/event-payment-input/event-payment-input.component.ts", lineNumber: 33 });
})();

export {
  EventPaymentInputComponent
};
//# sourceMappingURL=chunk-B5J272XF.js.map
