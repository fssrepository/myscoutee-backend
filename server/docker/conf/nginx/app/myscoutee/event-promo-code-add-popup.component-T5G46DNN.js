import {
  EventPromoCodePopupStore
} from "./chunk-SCP4YCCD.js";
import "./chunk-F5B73CZX.js";
import "./chunk-BRGZDNX3.js";
import "./chunk-XA4QEJLP.js";
import "./chunk-7UZYVY3Z.js";
import "./chunk-VBRGMXSL.js";
import "./chunk-2VFJ327H.js";
import "./chunk-4TXXTGDV.js";
import "./chunk-FS6LNZZ4.js";
import "./chunk-NX6X6SL6.js";
import "./chunk-SYKOEE4K.js";
import "./chunk-IMU76WCC.js";
import "./chunk-IRJFXW7R.js";
import "./chunk-EFQHKYZD.js";
import "./chunk-HDRPEKFL.js";
import "./chunk-JWRKXGRX.js";
import "./chunk-LWXWCSPP.js";
import "./chunk-T6NM4FOV.js";
import {
  FormFlowComponent
} from "./chunk-2FA72P6F.js";
import "./chunk-A6AM4Z6L.js";
import "./chunk-DR3RAUWL.js";
import "./chunk-DDIPOAA4.js";
import "./chunk-MDKC4NXB.js";
import "./chunk-JJACTKXS.js";
import "./chunk-AQO6U4VN.js";
import "./chunk-V477GJDH.js";
import "./chunk-3KSYFEWX.js";
import "./chunk-QM6YAR3P.js";
import "./chunk-4DIW3NKM.js";
import "./chunk-GQZWVH6M.js";
import "./chunk-TGJIGH66.js";
import "./chunk-4VYYFWRA.js";
import "./chunk-FNZUUWCJ.js";
import {
  PopupComponent
} from "./chunk-LN2XQVUC.js";
import "./chunk-E63MLHVM.js";
import "./chunk-T5TB7V7K.js";
import {
  FormsModule,
  I18nPipe,
  NgControlStatus,
  NgModel
} from "./chunk-J4QS2YUJ.js";
import "./chunk-XCPZRRU5.js";
import "./chunk-LGGVU5AE.js";
import "./chunk-6RAUJLMB.js";
import "./chunk-JQCFZPHN.js";
import "./chunk-J5KOSTYM.js";
import "./chunk-MC3W6CB7.js";
import "./chunk-FAW3YKWN.js";
import "./chunk-QZPIQIRC.js";
import "./chunk-LCSKRGZO.js";
import "./chunk-I52TUHFM.js";
import "./chunk-WWXJW2FL.js";
import "./chunk-NB6L6NLP.js";
import "./chunk-U4O3FETT.js";
import "./chunk-JMCIB2VE.js";
import "./chunk-DP7O5TZ4.js";
import "./chunk-OJADXSXP.js";
import "./chunk-52XNNRXY.js";
import "./chunk-27OFLLFL.js";
import "./chunk-SXVGSFEZ.js";
import "./chunk-YO3STUCM.js";
import "./chunk-ZBAABSP3.js";
import "./chunk-ON23DQAQ.js";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate1
} from "./chunk-FMXFYYCS.js";

// src/app/activity/components/event-checkout-popup/event-promo-code-popup/event-promo-code-add-popup.component.ts
function EventPromoCodeAddPopupComponent_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(2, 1, ctx_r1.errorMessageKey || ctx_r1.errorMessage, ctx_r1.errorMessage), " ");
  }
}
function EventPromoCodeAddPopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 0)(1, "div", 1)(2, "app-form-flow", 2);
    \u0275\u0275listener("ngModelChange", function EventPromoCodeAddPopupComponent_Conditional_0_Template_app_form_flow_ngModelChange_2_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.updateDraft($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, EventPromoCodeAddPopupComponent_Conditional_0_Conditional_3_Template, 3, 4, "p", 3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const editor_r3 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.popupModel(editor_r3))("zIndex", editor_r3.zIndex);
    \u0275\u0275advance(2);
    \u0275\u0275property("model", ctx_r1.flowModel(editor_r3))("ngModel", ctx_r1.draftValue)("disabled", editor_r3.busy);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.errorMessageKey || ctx_r1.errorMessage ? 3 : -1);
  }
}
var EventPromoCodeAddPopupComponent = class _EventPromoCodeAddPopupComponent {
  popup = null;
  draftValue = this.emptyDraft();
  errorMessageKey = "";
  errorMessage = "";
  popupStore = inject(EventPromoCodePopupStore);
  activeOwnerId = "";
  ngOnChanges(changes) {
    if (!changes["popup"] || !this.popup) {
      return;
    }
    if (this.popup.ownerId !== this.activeOwnerId) {
      this.activeOwnerId = this.popup.ownerId;
      this.draftValue = this.emptyDraft();
      this.errorMessageKey = "";
      this.errorMessage = "";
    }
    this.errorMessageKey = this.popup.validationErrorKey;
    this.errorMessage = this.popup.validationError;
  }
  popupModel(popup) {
    return {
      title: popup.title,
      subtitle: popup.subtitle,
      ariaLabel: "event.checkout.promo.add.aria",
      closeAriaLabel: "event.checkout.promo.add.close.aria",
      closeOnBackdrop: !popup.busy,
      size: "default",
      height: "auto",
      headerTone: "accent",
      backdropTone: "dim",
      headerControls: this.headerControls(popup),
      onClose: (event) => this.close(popup, event),
      onMenuSelect: (event) => this.onMenuSelect(popup, event)
    };
  }
  flowModel(popup) {
    return {
      title: popup.title,
      subtitle: popup.subtitle,
      layout: "grouped",
      header: false,
      summary: { enabled: false },
      completion: { controls: "required" },
      save: null,
      loadingLabel: "event.checkout.promo.validating",
      steps: [{
        id: "promo-code",
        title: "",
        chrome: "none",
        controls: [{
          id: "code",
          bind: "code",
          kind: "text",
          layout: "wide",
          label: "event.checkout.promo.input.label",
          placeholder: "event.checkout.promo.input.placeholder",
          description: "event.checkout.promo.input.hint",
          maxLength: 64,
          required: true
        }]
      }]
    };
  }
  updateDraft(value) {
    const record = value && typeof value === "object" ? value : {};
    this.draftValue = {
      code: `${record["code"] ?? ""}`.toUpperCase()
    };
    this.errorMessageKey = "";
    this.errorMessage = "";
  }
  headerControls(popup) {
    return [{
      kind: "menu",
      id: "promo-code-add-actions",
      menuKind: "inline",
      closeOnSelect: false,
      items: [{
        id: "promo-code-add-verify",
        icon: "done",
        kind: "action",
        palette: "green",
        disabled: popup.busy || !this.normalizeCode(this.draftValue.code),
        closeOnSelect: false,
        ariaLabel: "event.checkout.promo.add.verify.aria",
        progress: {
          state: popup.busy ? "loading" : null,
          shape: "circle"
        }
      }]
    }];
  }
  onMenuSelect(popup, event) {
    if (event.itemSelect.id !== "promo-code-add-verify" || popup.busy) {
      return;
    }
    event.itemSelect.sourceEvent.preventDefault();
    event.itemSelect.sourceEvent.stopPropagation();
    const code = this.validateDraft(popup);
    if (!code) {
      return;
    }
    this.errorMessageKey = "";
    this.errorMessage = "";
    this.popupStore.requestAddPopupVerification(popup.ownerId, code, event.itemSelect.sourceEvent);
  }
  close(popup, event) {
    if (popup.busy) {
      return;
    }
    event?.preventDefault();
    event?.stopPropagation();
    this.popupStore.requestAddPopupClose(popup.ownerId, event);
  }
  validateDraft(popup) {
    const code = this.normalizeCode(this.draftValue.code);
    if (!code) {
      this.errorMessageKey = "event.checkout.promo.required";
      this.errorMessage = "";
      return "";
    }
    if (this.normalizedAppliedCodes(popup).includes(code)) {
      this.errorMessageKey = "event.checkout.promo.duplicate";
      this.errorMessage = "";
      return "";
    }
    return code;
  }
  normalizedAppliedCodes(popup) {
    return [...new Set((popup.appliedPromoCodes ?? []).map((code) => this.normalizeCode(code)).filter(Boolean))];
  }
  emptyDraft() {
    return { code: "" };
  }
  normalizeCode(value) {
    return `${value ?? ""}`.trim().toUpperCase();
  }
  static \u0275fac = function EventPromoCodeAddPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EventPromoCodeAddPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EventPromoCodeAddPopupComponent, selectors: [["app-event-promo-code-add-popup"]], inputs: { popup: "popup" }, features: [\u0275\u0275NgOnChangesFeature], decls: 1, vars: 1, consts: [[3, "model", "zIndex"], [1, "event-promo-code-add-body"], [3, "ngModelChange", "model", "ngModel", "disabled"], ["role", "alert", 1, "event-promo-code-add-error"]], template: function EventPromoCodeAddPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, EventPromoCodeAddPopupComponent_Conditional_0_Template, 4, 6, "app-popup", 0);
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275conditional((tmp_0_0 = ctx.popup) ? 0 : -1, tmp_0_0);
    }
  }, dependencies: [
    FormsModule,
    NgControlStatus,
    NgModel,
    FormFlowComponent,
    PopupComponent,
    I18nPipe
  ], styles: ["\n[_nghost-%COMP%] {\n  display: contents;\n}\n.event-promo-code-add-body[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.event-promo-code-add-error[_ngcontent-%COMP%] {\n  margin: 0.16rem 1rem 1rem;\n  color: #ad3444;\n  font-size: 0.8rem;\n  font-weight: 800;\n  line-height: 1.4;\n}\n/*# sourceMappingURL=event-promo-code-add-popup.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EventPromoCodeAddPopupComponent, [{
    type: Component,
    args: [{ selector: "app-event-promo-code-add-popup", standalone: true, imports: [
      FormsModule,
      FormFlowComponent,
      I18nPipe,
      PopupComponent
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: '@if (popup; as editor) {\n  <app-popup [model]="popupModel(editor)" [zIndex]="editor.zIndex">\n    <div class="event-promo-code-add-body">\n      <app-form-flow\n        [model]="flowModel(editor)"\n        [ngModel]="draftValue"\n        (ngModelChange)="updateDraft($event)"\n        [disabled]="editor.busy"\n      ></app-form-flow>\n      @if (errorMessageKey || errorMessage) {\n        <p class="event-promo-code-add-error" role="alert">\n          {{ (errorMessageKey || errorMessage) | i18n: errorMessage }}\n        </p>\n      }\n    </div>\n  </app-popup>\n}\n', styles: ["/* src/app/activity/components/event-checkout-popup/event-promo-code-popup/event-promo-code-add-popup.component.scss */\n:host {\n  display: contents;\n}\n.event-promo-code-add-body {\n  min-width: 0;\n}\n.event-promo-code-add-error {\n  margin: 0.16rem 1rem 1rem;\n  color: #ad3444;\n  font-size: 0.8rem;\n  font-weight: 800;\n  line-height: 1.4;\n}\n/*# sourceMappingURL=event-promo-code-add-popup.component.css.map */\n"] }]
  }], null, { popup: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EventPromoCodeAddPopupComponent, { className: "EventPromoCodeAddPopupComponent", filePath: "app/activity/components/event-checkout-popup/event-promo-code-popup/event-promo-code-add-popup.component.ts", lineNumber: 35 });
})();
export {
  EventPromoCodeAddPopupComponent
};
//# sourceMappingURL=event-promo-code-add-popup.component-T5G46DNN.js.map
