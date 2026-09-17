import {
  I18nPipe,
  MatIcon,
  MatIconModule
} from "./chunk-J4QS2YUJ.js";
import {
  I18nService
} from "./chunk-I52TUHFM.js";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-FMXFYYCS.js";

// src/app/shared/ui/components/payment-refund-policy/payment-refund-policy.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function PaymentRefundPolicyComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "payment.summary.error.open"));
  }
}
function PaymentRefundPolicyComponent_Conditional_8_For_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const rule_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.ruleWindow(rule_r1));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.ruleRefund(rule_r1));
  }
}
function PaymentRefundPolicyComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "div")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "strong");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275repeaterCreate(9, PaymentRefundPolicyComponent_Conditional_8_For_10_Template, 5, 2, "div", 1, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    const current_r3 = ctx_r1.summary();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 3, "asset.borrow.current.reimbursement"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(current_r3.note);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.money(current_r3.amount));
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.rules());
  }
}
var PaymentRefundPolicyComponent = class _PaymentRefundPolicyComponent {
  i18n = inject(I18nService);
  policy = null;
  bookingStartAtIso = "";
  totalAmount = 0;
  currency = "USD";
  preview = null;
  unavailable = false;
  rules() {
    return this.policy?.enabled ? this.policy.rules ?? [] : [];
  }
  money(amount) {
    return new Intl.NumberFormat(void 0, { style: "currency", currency: this.currency }).format(amount);
  }
  ruleWindow(rule) {
    const value = Math.max(0, Number(rule.offsetValue) || 0);
    const unit = rule.offsetUnit || "days";
    return this.i18n.translateParams("asset.borrow.cancellation.window", {
      value,
      unit: this.i18n.translate(`asset.borrow.unit.${value === 1 ? unit.replace(/s$/, "") : unit}`)
    });
  }
  ruleRefund(rule) {
    if (rule.refundKind === "full")
      return this.i18n.translate("full.refund");
    if (rule.refundKind === "none")
      return this.i18n.translate("no.refund");
    if (rule.refundKind === "fixed_amount")
      return this.money(Math.max(0, Number(rule.refundValue) || 0));
    return this.i18n.translateParams("asset.borrow.refund.percent", { percent: rule.refundValue ?? 0 });
  }
  summary() {
    if (this.preview) {
      const rule = this.rules().find((item) => item.id === this.preview?.ruleId);
      return {
        amount: this.preview.refundableAmount,
        note: rule ? this.describe(rule) : this.preview.ruleDescription || this.i18n.translate(this.rules().length ? "asset.borrow.cancellation.windows.passed" : "payment.history.refund.preview.no.policy")
      };
    }
    if (!this.rules().length) {
      return { amount: 0, note: this.i18n.translate("payment.history.refund.preview.no.policy") };
    }
    const startText = this.bookingStartAtIso.trim();
    const start = new Date(/(?:Z|[+-]\d{2}:\d{2})$/.test(startText) ? startText : `${startText}Z`);
    const eligible = this.rules().map((rule) => ({ rule, deadline: this.deadline(rule, start) })).filter((item) => Number.isFinite(item.deadline) && Date.now() <= item.deadline).sort((a, b) => a.deadline - b.deadline)[0]?.rule;
    if (!eligible) {
      return { amount: 0, note: this.i18n.translate("asset.borrow.cancellation.windows.passed") };
    }
    const paid = Math.max(0, this.totalAmount);
    const value = Math.max(0, Number(eligible.refundValue) || 0);
    const amount = eligible.refundKind === "full" ? paid : eligible.refundKind === "none" ? 0 : eligible.refundKind === "fixed_amount" ? Math.min(paid, value) : paid * Math.min(100, value) / 100;
    return { amount: Math.round(amount * 100) / 100, note: this.describe(eligible) };
  }
  describe(rule) {
    return this.i18n.translateParams("asset.borrow.cancellation.rule.description", {
      refund: this.ruleRefund(rule),
      window: this.ruleWindow(rule)
    });
  }
  deadline(rule, start) {
    const date = new Date(start.getTime());
    const offset = Math.max(0, Math.trunc(Number(rule.offsetValue) || 0));
    if (rule.offsetUnit === "months") {
      const day = date.getUTCDate();
      date.setUTCDate(1);
      date.setUTCMonth(date.getUTCMonth() - offset);
      const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
      date.setUTCDate(Math.min(day, lastDay));
    } else if (rule.offsetUnit === "hours") {
      date.setUTCHours(date.getUTCHours() - offset);
    } else {
      date.setUTCDate(date.getUTCDate() - offset * (rule.offsetUnit === "weeks" ? 7 : 1));
    }
    return date.getTime();
  }
  static \u0275fac = function PaymentRefundPolicyComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PaymentRefundPolicyComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PaymentRefundPolicyComponent, selectors: [["app-payment-refund-policy"]], inputs: { policy: "policy", bookingStartAtIso: "bookingStartAtIso", totalAmount: "totalAmount", currency: "currency", preview: "preview", unavailable: "unavailable" }, decls: 9, vars: 4, consts: [[1, "refund-policy"], [1, "refund-policy__row"]], template: function PaymentRefundPolicyComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0)(1, "header")(2, "mat-icon");
      \u0275\u0275text(3, "currency_exchange");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "h3");
      \u0275\u0275text(5);
      \u0275\u0275pipe(6, "i18n");
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(7, PaymentRefundPolicyComponent_Conditional_7_Template, 3, 3, "p")(8, PaymentRefundPolicyComponent_Conditional_8_Template, 11, 5);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(6, 2, "asset.borrow.cancellation.title"));
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.unavailable ? 7 : 8);
    }
  }, dependencies: [MatIconModule, MatIcon, I18nPipe], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n.refund-policy[_ngcontent-%COMP%] {\n  padding: 16px;\n  border: 1px solid #d6e1ef;\n  border-radius: 18px;\n  background:\n    linear-gradient(\n      145deg,\n      #fff,\n      #f5faff);\n  color: #244363;\n}\nheader[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-bottom: 12px;\n}\nh3[_ngcontent-%COMP%], \np[_ngcontent-%COMP%] {\n  margin: 0;\n}\nh3[_ngcontent-%COMP%] {\n  font-size: 14px;\n}\np[_ngcontent-%COMP%] {\n  margin-top: 4px;\n  color: #647b98;\n  font-size: 12px;\n  overflow-wrap: anywhere;\n}\n.refund-policy__row[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-between;\n  align-items: start;\n  gap: 8px 16px;\n  padding: 10px 0;\n  font-size: 13px;\n}\n.refund-policy__row[_ngcontent-%COMP%]    + .refund-policy__row[_ngcontent-%COMP%] {\n  border-top: 1px solid #dfe8f2;\n}\n.refund-policy__row[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  flex: 1 1 180px;\n  min-width: 0;\n}\n/*# sourceMappingURL=payment-refund-policy.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PaymentRefundPolicyComponent, [{
    type: Component,
    args: [{ selector: "app-payment-refund-policy", standalone: true, imports: [MatIconModule, I18nPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `<section class="refund-policy">
  <header><mat-icon>currency_exchange</mat-icon><h3>{{ 'asset.borrow.cancellation.title' | i18n }}</h3></header>
  @if (unavailable) {
    <p>{{ 'payment.summary.error.open' | i18n }}</p>
  } @else {
    @let current = summary();
    <div class="refund-policy__row">
      <div><strong>{{ 'asset.borrow.current.reimbursement' | i18n }}</strong><p>{{ current.note }}</p></div>
      <strong>{{ money(current.amount) }}</strong>
    </div>
    @for (rule of rules(); track rule.id) {
      <div class="refund-policy__row"><span>{{ ruleWindow(rule) }}</span><strong>{{ ruleRefund(rule) }}</strong></div>
    }
  }
</section>
`, styles: ["/* src/app/shared/ui/components/payment-refund-policy/payment-refund-policy.component.scss */\n:host {\n  display: block;\n  min-width: 0;\n}\n.refund-policy {\n  padding: 16px;\n  border: 1px solid #d6e1ef;\n  border-radius: 18px;\n  background:\n    linear-gradient(\n      145deg,\n      #fff,\n      #f5faff);\n  color: #244363;\n}\nheader {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-bottom: 12px;\n}\nh3,\np {\n  margin: 0;\n}\nh3 {\n  font-size: 14px;\n}\np {\n  margin-top: 4px;\n  color: #647b98;\n  font-size: 12px;\n  overflow-wrap: anywhere;\n}\n.refund-policy__row {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-between;\n  align-items: start;\n  gap: 8px 16px;\n  padding: 10px 0;\n  font-size: 13px;\n}\n.refund-policy__row + .refund-policy__row {\n  border-top: 1px solid #dfe8f2;\n}\n.refund-policy__row > div {\n  flex: 1 1 180px;\n  min-width: 0;\n}\n/*# sourceMappingURL=payment-refund-policy.component.css.map */\n"] }]
  }], null, { policy: [{
    type: Input
  }], bookingStartAtIso: [{
    type: Input
  }], totalAmount: [{
    type: Input
  }], currency: [{
    type: Input
  }], preview: [{
    type: Input
  }], unavailable: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PaymentRefundPolicyComponent, { className: "PaymentRefundPolicyComponent", filePath: "app/shared/ui/components/payment-refund-policy/payment-refund-policy.component.ts", lineNumber: 16 });
})();

export {
  PaymentRefundPolicyComponent
};
//# sourceMappingURL=chunk-XGYD22PL.js.map
