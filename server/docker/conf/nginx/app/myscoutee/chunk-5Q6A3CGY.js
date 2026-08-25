import {
  I18nPipe
} from "./chunk-QD6QQNQX.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-EDHGCWPF.js";
import {
  CommonModule
} from "./chunk-J7IJFFQ2.js";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-XJL7SWH7.js";

// src/app/activity/components/event-editor-popup/event-payment-input/event-payment-input.component.ts
var EventPaymentInputComponent = class _EventPaymentInputComponent {
  title = "event.editor.payment.title";
  subtitle = "event.editor.payment.subtitle";
  eventTitle = "";
  eventLocation = "";
  eventTimeframe = "";
  items = [];
  pricingSummaryRows = [];
  totalAmount = 0;
  currency = "USD";
  paymentIntegrationEnabled = false;
  tone = "payment";
  providerLabel = "";
  statusLabel = "";
  note = "";
  itemTrackId(_index, item) {
    return item.id;
  }
  rowTrackId(_index, row) {
    return row.key;
  }
  formatMoney(amount, currency = this.currency) {
    const value = Number(amount) || 0;
    return `${this.currencySymbol(currency)}${value.toFixed(2)}`;
  }
  rowAmountLabel(row) {
    if (!Number.isFinite(row.amount)) {
      return "";
    }
    return this.formatMoney(row.amount, row.currency || this.currency);
  }
  rowDetailLabel(row) {
    const parts = [];
    const detail = `${row.detail ?? ""}`.trim();
    if (detail) {
      parts.push(detail);
    }
    const multiplier = Math.max(1, Math.trunc(Number(row.multiplier) || 1));
    if (multiplier > 1) {
      parts.push(`affected by x${multiplier}`);
    }
    return parts.join(" \xB7 ");
  }
  itemAmountLabel(item) {
    const quantity = Math.max(1, Math.trunc(Number(item.quantity) || 1));
    const amount = (Number(item.amount) || 0) * quantity;
    return amount > 0 ? this.formatMoney(amount, item.currency || this.currency) : "included";
  }
  resolvedEventTitle() {
    return `${this.eventTitle ?? ""}`.trim() || "event";
  }
  resolvedEventLocation() {
    return `${this.eventLocation ?? ""}`.trim() || "event.editor.location.not.set";
  }
  resolvedEventTimeframe() {
    return `${this.eventTimeframe ?? ""}`.trim() || "event.editor.date.not.set";
  }
  paymentProviderLabel() {
    return this.providerLabel.trim() || (this.paymentIntegrationEnabled ? "event.editor.payment.gateway" : "event.editor.payment.demo");
  }
  paymentStatusLabel() {
    return this.statusLabel.trim() || (this.paymentIntegrationEnabled ? "event.editor.payment.ready.redirect" : "event.editor.payment.review.before.confirm");
  }
  paymentNote() {
    return this.note.trim() || (this.paymentIntegrationEnabled ? "event.editor.payment.gateway.note" : "event.editor.payment.demo.note");
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
  static \u0275fac = function EventPaymentInputComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EventPaymentInputComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EventPaymentInputComponent, selectors: [["app-event-payment-input"]], inputs: { title: "title", subtitle: "subtitle", eventTitle: "eventTitle", eventLocation: "eventLocation", eventTimeframe: "eventTimeframe", items: "items", pricingSummaryRows: "pricingSummaryRows", totalAmount: "totalAmount", currency: "currency", paymentIntegrationEnabled: "paymentIntegrationEnabled", tone: "tone", providerLabel: "providerLabel", statusLabel: "statusLabel", note: "note" }, decls: 53, vars: 42, consts: [[1, "event-payment-input-card"], [1, "event-payment-input-head"], [1, "event-payment-panel-title"], [1, "event-payment-status-grid"], [1, "event-payment-note"], [1, "event-payment-field-grid"], ["type", "text", "value", "4242 4242 4242 4242", "disabled", ""], ["type", "text", "value", "Demo User", "disabled", ""], ["type", "text", "value", "12 / 30", "disabled", ""], ["type", "text", "value", "123", "disabled", ""]], template: function EventPaymentInputComponent_Template(rf, ctx) {
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
      \u0275\u0275elementStart(12, "span");
      \u0275\u0275text(13);
      \u0275\u0275pipe(14, "i18n");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(15, "div", 3)(16, "article")(17, "span");
      \u0275\u0275text(18);
      \u0275\u0275pipe(19, "i18n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "strong");
      \u0275\u0275text(21);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(22, "article")(23, "span");
      \u0275\u0275text(24);
      \u0275\u0275pipe(25, "i18n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "strong");
      \u0275\u0275text(27);
      \u0275\u0275pipe(28, "i18n");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(29, "p", 4);
      \u0275\u0275text(30);
      \u0275\u0275pipe(31, "i18n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "div", 5)(33, "label")(34, "span");
      \u0275\u0275text(35);
      \u0275\u0275pipe(36, "i18n");
      \u0275\u0275elementEnd();
      \u0275\u0275element(37, "input", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(38, "label")(39, "span");
      \u0275\u0275text(40);
      \u0275\u0275pipe(41, "i18n");
      \u0275\u0275elementEnd();
      \u0275\u0275element(42, "input", 7);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(43, "label")(44, "span");
      \u0275\u0275text(45);
      \u0275\u0275pipe(46, "i18n");
      \u0275\u0275elementEnd();
      \u0275\u0275element(47, "input", 8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(48, "label")(49, "span");
      \u0275\u0275text(50);
      \u0275\u0275pipe(51, "i18n");
      \u0275\u0275elementEnd();
      \u0275\u0275element(52, "input", 9);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275classProp("event-payment-input-card--ready", ctx.tone === "ready")("event-payment-input-card--payment", ctx.tone === "payment")("event-payment-input-card--waiting", ctx.tone === "waiting")("event-payment-input-card--approval", ctx.tone === "approval");
      \u0275\u0275advance(7);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 20, ctx.title));
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(11, 22, ctx.subtitle));
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(14, 24, ctx.paymentProviderLabel()));
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(19, 26, "event.editor.payment.amount"));
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.formatMoney(ctx.totalAmount, ctx.currency));
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(25, 28, "event.editor.payment.status"));
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(28, 30, ctx.paymentStatusLabel()));
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(31, 32, ctx.paymentNote()));
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(36, 34, "event.editor.payment.card.number"));
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(41, 36, "event.editor.payment.card.name"));
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(46, 38, "event.editor.payment.card.expiry"));
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(51, 40, "event.editor.payment.card.cvc"));
    }
  }, dependencies: [
    CommonModule,
    MatIconModule,
    MatIcon,
    I18nPipe
  ], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  grid-column: 1/-1;\n}\n.event-payment-panel[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.86rem;\n  min-width: 0;\n  border: 1px solid rgba(93, 108, 128, 0.3);\n  border-radius: 16px;\n  background:\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #eef5f5 100%);\n  box-shadow: 0 4px 12px rgba(39, 53, 72, 0.08);\n  padding: 0.78rem;\n  box-sizing: border-box;\n}\n.event-payment-panel-head[_ngcontent-%COMP%], \n.event-payment-layout[_ngcontent-%COMP%], \n.event-payment-section-head[_ngcontent-%COMP%], \n.event-payment-context[_ngcontent-%COMP%], \n.event-payment-item[_ngcontent-%COMP%], \n.event-payment-receipt-row[_ngcontent-%COMP%], \n.event-payment-receipt-total[_ngcontent-%COMP%], \n.event-payment-input-head[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.75rem;\n  min-width: 0;\n}\n.event-payment-panel-title[_ngcontent-%COMP%] {\n  display: inline-grid;\n  grid-template-columns: auto minmax(0, 1fr);\n  align-items: center;\n  gap: 0.58rem;\n  min-width: 0;\n}\n.event-payment-panel-title[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 22px;\n  height: 22px;\n  font-size: 22px;\n  color: #257a69;\n}\n.event-payment-panel-title[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%], \n.event-payment-input-head[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #173b5c;\n  font-size: 1rem;\n  line-height: 1.2;\n}\n.event-payment-panel-title[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n.event-payment-input-head[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.18rem 0 0;\n  color: rgba(43, 64, 96, 0.72);\n  font-size: 0.82rem;\n  line-height: 1.35;\n}\n.event-payment-total[_ngcontent-%COMP%] {\n  display: grid;\n  justify-items: end;\n  gap: 0.16rem;\n  min-width: max-content;\n}\n.event-payment-total[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.event-payment-status-grid[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.event-payment-section-head[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: rgba(43, 64, 96, 0.66);\n  font-size: 0.76rem;\n  font-weight: 800;\n  text-transform: uppercase;\n}\n.event-payment-total[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #16836f;\n  font-size: 1.34rem;\n  line-height: 1.1;\n}\n.event-payment-layout[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 1.05fr) minmax(280px, 0.95fr);\n  align-items: start;\n}\n.event-payment-summary[_ngcontent-%COMP%], \n.event-payment-input-card[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.72rem;\n  min-width: 0;\n  border: 1px solid rgba(191, 212, 233, 0.72);\n  border-radius: 14px;\n  background: rgba(255, 255, 255, 0.84);\n  padding: 0.78rem;\n}\n.event-payment-input-card--ready[_ngcontent-%COMP%] {\n  border-color: rgba(55, 132, 169, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(244, 251, 255, 0.96) 0%,\n      rgba(233, 245, 250, 0.96) 100%);\n}\n.event-payment-input-card--payment[_ngcontent-%COMP%] {\n  border-color: rgba(82, 94, 192, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(246, 247, 255, 0.96) 0%,\n      rgba(237, 240, 255, 0.96) 100%);\n}\n.event-payment-input-card--waiting[_ngcontent-%COMP%], \n.event-payment-input-card--approval[_ngcontent-%COMP%] {\n  border-color: rgba(205, 143, 53, 0.36);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 250, 240, 0.96) 0%,\n      rgba(250, 241, 222, 0.96) 100%);\n}\n.event-payment-context[_ngcontent-%COMP%] {\n  border: 1px solid rgba(89, 137, 151, 0.22);\n  border-radius: 12px;\n  background: rgba(238, 250, 248, 0.74);\n  padding: 0.68rem 0.74rem;\n}\n.event-payment-context-main[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.18rem;\n  min-width: 0;\n}\n.event-payment-context-main[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.event-payment-item[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]:first-child, \n.event-payment-section-head[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.event-payment-receipt-row[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.event-payment-receipt-total[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.event-payment-status-grid[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #183a5a;\n  font-weight: 900;\n}\n.event-payment-context-main[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.event-payment-context-time[_ngcontent-%COMP%], \n.event-payment-item[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.event-payment-item[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.event-payment-receipt-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: rgba(42, 64, 96, 0.72);\n  font-size: 0.82rem;\n  line-height: 1.35;\n}\n.event-payment-context-time[_ngcontent-%COMP%] {\n  justify-self: end;\n  text-align: right;\n  font-weight: 800;\n}\n.event-payment-item-list[_ngcontent-%COMP%], \n.event-payment-receipt[_ngcontent-%COMP%], \n.event-payment-field-grid[_ngcontent-%COMP%], \n.event-payment-status-grid[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.56rem;\n  min-width: 0;\n}\n.event-payment-item[_ngcontent-%COMP%], \n.event-payment-empty[_ngcontent-%COMP%], \n.event-payment-receipt[_ngcontent-%COMP%] {\n  border: 1px solid rgba(192, 212, 232, 0.72);\n  border-radius: 12px;\n  background: rgba(249, 252, 255, 0.9);\n}\n.event-payment-item[_ngcontent-%COMP%] {\n  padding: 0.62rem 0.68rem;\n}\n.event-payment-item[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.14rem;\n  min-width: 0;\n}\n.event-payment-item[_ngcontent-%COMP%]    > strong[_ngcontent-%COMP%] {\n  justify-self: end;\n  color: #16836f;\n  white-space: nowrap;\n}\n.event-payment-empty[_ngcontent-%COMP%] {\n  padding: 0.76rem;\n  color: #24476f;\n  font-weight: 800;\n}\n.event-payment-receipt[_ngcontent-%COMP%] {\n  padding: 0.64rem 0.72rem;\n}\n.event-payment-receipt-row[_ngcontent-%COMP%], \n.event-payment-receipt-total[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 1fr) auto;\n  gap: 0.68rem;\n}\n.event-payment-receipt-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-wrap: wrap;\n  align-items: baseline;\n  gap: 0.32rem;\n  min-width: 0;\n  color: rgba(42, 64, 96, 0.78);\n}\n.event-payment-receipt-total[_ngcontent-%COMP%] {\n  margin-top: 0.18rem;\n  padding-top: 0.52rem;\n  border-top: 1px solid rgba(89, 137, 151, 0.22);\n}\n.event-payment-receipt-total[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #16836f;\n  font-size: 1.12rem;\n}\n.event-payment-input-head[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  justify-self: end;\n  min-height: 32px;\n  display: inline-flex;\n  align-items: center;\n  border: 1px solid rgba(97, 158, 137, 0.42);\n  border-radius: 999px;\n  background: rgba(232, 249, 243, 0.95);\n  color: #2a7057;\n  padding: 0 0.72rem;\n  font-size: 0.78rem;\n  font-weight: 900;\n  white-space: nowrap;\n}\n.event-payment-status-grid[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n.event-payment-status-grid[_ngcontent-%COMP%]   article[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.2rem;\n  border: 1px solid rgba(192, 212, 232, 0.72);\n  border-radius: 12px;\n  background: rgba(249, 252, 255, 0.9);\n  padding: 0.62rem 0.68rem;\n}\n.event-payment-field-grid[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n.event-payment-field-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.3rem;\n  color: #24476f;\n  font-size: 0.8rem;\n  font-weight: 800;\n}\n.event-payment-field-grid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  height: 42px;\n  border: 1px solid rgba(192, 212, 232, 0.9);\n  border-radius: 12px;\n  background: #f3f6fa;\n  color: rgba(58, 76, 103, 0.9);\n  padding: 0 0.76rem;\n  box-sizing: border-box;\n}\n@media (max-width: 860px) {\n  .event-payment-panel-head[_ngcontent-%COMP%], \n   .event-payment-layout[_ngcontent-%COMP%], \n   .event-payment-context[_ngcontent-%COMP%], \n   .event-payment-input-head[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .event-payment-total[_ngcontent-%COMP%], \n   .event-payment-context-time[_ngcontent-%COMP%], \n   .event-payment-input-head[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n    justify-self: start;\n    text-align: left;\n  }\n}\n@media (max-width: 640px) {\n  .event-payment-field-grid[_ngcontent-%COMP%], \n   .event-payment-status-grid[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .event-payment-item[_ngcontent-%COMP%], \n   .event-payment-receipt-row[_ngcontent-%COMP%], \n   .event-payment-receipt-total[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .event-payment-item[_ngcontent-%COMP%]    > strong[_ngcontent-%COMP%], \n   .event-payment-receipt-row[_ngcontent-%COMP%]    > strong[_ngcontent-%COMP%], \n   .event-payment-receipt-total[_ngcontent-%COMP%]    > strong[_ngcontent-%COMP%] {\n    justify-self: start;\n  }\n}\n/*# sourceMappingURL=event-payment-input.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EventPaymentInputComponent, [{
    type: Component,
    args: [{ selector: "app-event-payment-input", standalone: true, imports: [
      CommonModule,
      MatIconModule,
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
        <h3>{{ title | i18n }}</h3>
        <p>{{ subtitle | i18n }}</p>
      </div>
    </div>
    <span>{{ paymentProviderLabel() | i18n }}</span>
  </div>

  <div class="event-payment-status-grid">
    <article>
      <span>{{ 'event.editor.payment.amount' | i18n }}</span>
      <strong>{{ formatMoney(totalAmount, currency) }}</strong>
    </article>
    <article>
      <span>{{ 'event.editor.payment.status' | i18n }}</span>
      <strong>{{ paymentStatusLabel() | i18n }}</strong>
    </article>
  </div>

  <p class="event-payment-note">{{ paymentNote() | i18n }}</p>

  <div class="event-payment-field-grid">
    <label>
      <span>{{ 'event.editor.payment.card.number' | i18n }}</span>
      <input type="text" value="4242 4242 4242 4242" disabled />
    </label>
    <label>
      <span>{{ 'event.editor.payment.card.name' | i18n }}</span>
      <input type="text" value="Demo User" disabled />
    </label>
    <label>
      <span>{{ 'event.editor.payment.card.expiry' | i18n }}</span>
      <input type="text" value="12 / 30" disabled />
    </label>
    <label>
      <span>{{ 'event.editor.payment.card.cvc' | i18n }}</span>
      <input type="text" value="123" disabled />
    </label>
  </div>
</section>
`, styles: ["/* src/app/activity/components/event-editor-popup/event-payment-input/event-payment-input.component.scss */\n:host {\n  display: block;\n  grid-column: 1/-1;\n}\n.event-payment-panel {\n  display: grid;\n  gap: 0.86rem;\n  min-width: 0;\n  border: 1px solid rgba(93, 108, 128, 0.3);\n  border-radius: 16px;\n  background:\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #eef5f5 100%);\n  box-shadow: 0 4px 12px rgba(39, 53, 72, 0.08);\n  padding: 0.78rem;\n  box-sizing: border-box;\n}\n.event-payment-panel-head,\n.event-payment-layout,\n.event-payment-section-head,\n.event-payment-context,\n.event-payment-item,\n.event-payment-receipt-row,\n.event-payment-receipt-total,\n.event-payment-input-head {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.75rem;\n  min-width: 0;\n}\n.event-payment-panel-title {\n  display: inline-grid;\n  grid-template-columns: auto minmax(0, 1fr);\n  align-items: center;\n  gap: 0.58rem;\n  min-width: 0;\n}\n.event-payment-panel-title .mat-icon {\n  width: 22px;\n  height: 22px;\n  font-size: 22px;\n  color: #257a69;\n}\n.event-payment-panel-title h3,\n.event-payment-input-head h4 {\n  margin: 0;\n  color: #173b5c;\n  font-size: 1rem;\n  line-height: 1.2;\n}\n.event-payment-panel-title p,\n.event-payment-input-head p {\n  margin: 0.18rem 0 0;\n  color: rgba(43, 64, 96, 0.72);\n  font-size: 0.82rem;\n  line-height: 1.35;\n}\n.event-payment-total {\n  display: grid;\n  justify-items: end;\n  gap: 0.16rem;\n  min-width: max-content;\n}\n.event-payment-total span,\n.event-payment-status-grid span,\n.event-payment-section-head span {\n  color: rgba(43, 64, 96, 0.66);\n  font-size: 0.76rem;\n  font-weight: 800;\n  text-transform: uppercase;\n}\n.event-payment-total strong {\n  color: #16836f;\n  font-size: 1.34rem;\n  line-height: 1.1;\n}\n.event-payment-layout {\n  grid-template-columns: minmax(0, 1.05fr) minmax(280px, 0.95fr);\n  align-items: start;\n}\n.event-payment-summary,\n.event-payment-input-card {\n  display: grid;\n  gap: 0.72rem;\n  min-width: 0;\n  border: 1px solid rgba(191, 212, 233, 0.72);\n  border-radius: 14px;\n  background: rgba(255, 255, 255, 0.84);\n  padding: 0.78rem;\n}\n.event-payment-input-card--ready {\n  border-color: rgba(55, 132, 169, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(244, 251, 255, 0.96) 0%,\n      rgba(233, 245, 250, 0.96) 100%);\n}\n.event-payment-input-card--payment {\n  border-color: rgba(82, 94, 192, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(246, 247, 255, 0.96) 0%,\n      rgba(237, 240, 255, 0.96) 100%);\n}\n.event-payment-input-card--waiting,\n.event-payment-input-card--approval {\n  border-color: rgba(205, 143, 53, 0.36);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 250, 240, 0.96) 0%,\n      rgba(250, 241, 222, 0.96) 100%);\n}\n.event-payment-context {\n  border: 1px solid rgba(89, 137, 151, 0.22);\n  border-radius: 12px;\n  background: rgba(238, 250, 248, 0.74);\n  padding: 0.68rem 0.74rem;\n}\n.event-payment-context-main {\n  display: grid;\n  gap: 0.18rem;\n  min-width: 0;\n}\n.event-payment-context-main strong,\n.event-payment-item strong:first-child,\n.event-payment-section-head strong,\n.event-payment-receipt-row strong,\n.event-payment-receipt-total strong,\n.event-payment-status-grid strong {\n  color: #183a5a;\n  font-weight: 900;\n}\n.event-payment-context-main span,\n.event-payment-context-time,\n.event-payment-item span,\n.event-payment-item small,\n.event-payment-receipt-row span small {\n  color: rgba(42, 64, 96, 0.72);\n  font-size: 0.82rem;\n  line-height: 1.35;\n}\n.event-payment-context-time {\n  justify-self: end;\n  text-align: right;\n  font-weight: 800;\n}\n.event-payment-item-list,\n.event-payment-receipt,\n.event-payment-field-grid,\n.event-payment-status-grid {\n  display: grid;\n  gap: 0.56rem;\n  min-width: 0;\n}\n.event-payment-item,\n.event-payment-empty,\n.event-payment-receipt {\n  border: 1px solid rgba(192, 212, 232, 0.72);\n  border-radius: 12px;\n  background: rgba(249, 252, 255, 0.9);\n}\n.event-payment-item {\n  padding: 0.62rem 0.68rem;\n}\n.event-payment-item div {\n  display: grid;\n  gap: 0.14rem;\n  min-width: 0;\n}\n.event-payment-item > strong {\n  justify-self: end;\n  color: #16836f;\n  white-space: nowrap;\n}\n.event-payment-empty {\n  padding: 0.76rem;\n  color: #24476f;\n  font-weight: 800;\n}\n.event-payment-receipt {\n  padding: 0.64rem 0.72rem;\n}\n.event-payment-receipt-row,\n.event-payment-receipt-total {\n  grid-template-columns: minmax(0, 1fr) auto;\n  gap: 0.68rem;\n}\n.event-payment-receipt-row span {\n  display: inline-flex;\n  flex-wrap: wrap;\n  align-items: baseline;\n  gap: 0.32rem;\n  min-width: 0;\n  color: rgba(42, 64, 96, 0.78);\n}\n.event-payment-receipt-total {\n  margin-top: 0.18rem;\n  padding-top: 0.52rem;\n  border-top: 1px solid rgba(89, 137, 151, 0.22);\n}\n.event-payment-receipt-total strong {\n  color: #16836f;\n  font-size: 1.12rem;\n}\n.event-payment-input-head > span {\n  justify-self: end;\n  min-height: 32px;\n  display: inline-flex;\n  align-items: center;\n  border: 1px solid rgba(97, 158, 137, 0.42);\n  border-radius: 999px;\n  background: rgba(232, 249, 243, 0.95);\n  color: #2a7057;\n  padding: 0 0.72rem;\n  font-size: 0.78rem;\n  font-weight: 900;\n  white-space: nowrap;\n}\n.event-payment-status-grid {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n.event-payment-status-grid article {\n  display: grid;\n  gap: 0.2rem;\n  border: 1px solid rgba(192, 212, 232, 0.72);\n  border-radius: 12px;\n  background: rgba(249, 252, 255, 0.9);\n  padding: 0.62rem 0.68rem;\n}\n.event-payment-field-grid {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n.event-payment-field-grid label {\n  display: grid;\n  gap: 0.3rem;\n  color: #24476f;\n  font-size: 0.8rem;\n  font-weight: 800;\n}\n.event-payment-field-grid input {\n  width: 100%;\n  min-width: 0;\n  height: 42px;\n  border: 1px solid rgba(192, 212, 232, 0.9);\n  border-radius: 12px;\n  background: #f3f6fa;\n  color: rgba(58, 76, 103, 0.9);\n  padding: 0 0.76rem;\n  box-sizing: border-box;\n}\n@media (max-width: 860px) {\n  .event-payment-panel-head,\n  .event-payment-layout,\n  .event-payment-context,\n  .event-payment-input-head {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .event-payment-total,\n  .event-payment-context-time,\n  .event-payment-input-head > span {\n    justify-self: start;\n    text-align: left;\n  }\n}\n@media (max-width: 640px) {\n  .event-payment-field-grid,\n  .event-payment-status-grid {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .event-payment-item,\n  .event-payment-receipt-row,\n  .event-payment-receipt-total {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .event-payment-item > strong,\n  .event-payment-receipt-row > strong,\n  .event-payment-receipt-total > strong {\n    justify-self: start;\n  }\n}\n/*# sourceMappingURL=event-payment-input.component.css.map */\n"] }]
  }], null, { title: [{
    type: Input
  }], subtitle: [{
    type: Input
  }], eventTitle: [{
    type: Input
  }], eventLocation: [{
    type: Input
  }], eventTimeframe: [{
    type: Input
  }], items: [{
    type: Input
  }], pricingSummaryRows: [{
    type: Input
  }], totalAmount: [{
    type: Input
  }], currency: [{
    type: Input
  }], paymentIntegrationEnabled: [{
    type: Input
  }], tone: [{
    type: Input
  }], providerLabel: [{
    type: Input
  }], statusLabel: [{
    type: Input
  }], note: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EventPaymentInputComponent, { className: "EventPaymentInputComponent", filePath: "app/activity/components/event-editor-popup/event-payment-input/event-payment-input.component.ts", lineNumber: 38 });
})();

export {
  EventPaymentInputComponent
};
//# sourceMappingURL=chunk-5Q6A3CGY.js.map
