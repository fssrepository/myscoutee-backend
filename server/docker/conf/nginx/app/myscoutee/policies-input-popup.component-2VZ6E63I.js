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
import {
  FormFlowPopupStore
} from "./chunk-QM6YAR3P.js";
import "./chunk-4VYYFWRA.js";
import "./chunk-FNZUUWCJ.js";
import {
  PopupComponent
} from "./chunk-LN2XQVUC.js";
import "./chunk-E63MLHVM.js";
import "./chunk-T5TB7V7K.js";
import {
  FormsModule,
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
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView
} from "./chunk-FMXFYYCS.js";

// src/app/shared/ui/components/core/form/inputs/policies-input/policies-input-popup/policies-input-popup.component.ts
function PoliciesInputPopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 0)(1, "app-form-flow", 1);
    \u0275\u0275listener("ngModelChange", function PoliciesInputPopupComponent_Conditional_0_Template_app_form_flow_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.updateDraft($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const editor_r3 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.popupModel(editor_r3))("zIndex", editor_r3.zIndex);
    \u0275\u0275advance();
    \u0275\u0275property("model", ctx_r1.flowModel(editor_r3))("ngModel", ctx_r1.draftValue)("disabled", editor_r3.readOnly);
  }
}
var PoliciesInputPopupComponent = class _PoliciesInputPopupComponent {
  popup = null;
  draftValue = this.emptyValue();
  popupStore = inject(FormFlowPopupStore);
  ngOnChanges(changes) {
    if (changes["popup"] && this.popup) {
      this.draftValue = this.normalizeValue(this.popup.value);
    }
  }
  popupModel(popup) {
    return {
      title: popup.title,
      subtitle: popup.subtitle,
      ariaLabel: popup.title,
      closeAriaLabel: "event.editor.policy.form.close.aria",
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
      steps: [{
        id: "policy",
        title: "",
        chrome: "none",
        controls: [
          {
            id: "title",
            bind: "title",
            kind: "text",
            layout: "wide",
            label: "title",
            placeholder: "event.editor.policy.title.placeholder",
            required: true
          },
          {
            id: "description",
            bind: "description",
            kind: "textarea",
            layout: "wide",
            label: "description",
            placeholder: "event.editor.policy.description.placeholder",
            rows: 6,
            required: true
          },
          {
            id: "required",
            bind: "required",
            kind: "checkbox",
            layout: "wide",
            label: popup.requiredCheckboxLabel
          }
        ]
      }]
    };
  }
  updateDraft(value) {
    this.draftValue = this.normalizeValue(value, this.draftValue.id);
  }
  headerControls(popup) {
    if (popup.readOnly) {
      return [];
    }
    return [{
      kind: "menu",
      id: "policy-editor-actions",
      menuKind: "inline",
      closeOnSelect: false,
      items: [{
        id: "policy-save",
        icon: "done",
        kind: "action",
        palette: "green",
        disabled: !this.canSave(),
        closeOnSelect: false,
        ariaLabel: "event.editor.policy.save.aria"
      }]
    }];
  }
  onMenuSelect(popup, event) {
    if (event.itemSelect.id === "policy-save" && this.canSave()) {
      this.popupStore.requestPolicyEditorPopupSave(popup.ownerId, this.draftValue, event.itemSelect.sourceEvent);
    }
  }
  close(popup, event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.popupStore.requestPolicyEditorPopupClose(popup.ownerId, event);
  }
  canSave() {
    return this.draftValue.title.trim().length > 0 && this.draftValue.description.trim().length > 0;
  }
  normalizeValue(value, fallbackId = "") {
    const record = value && typeof value === "object" ? value : {};
    return {
      id: `${record["id"] ?? fallbackId}`,
      title: `${record["title"] ?? ""}`,
      description: `${record["description"] ?? ""}`,
      required: record["required"] !== false
    };
  }
  emptyValue() {
    return {
      id: "",
      title: "",
      description: "",
      required: true
    };
  }
  static \u0275fac = function PoliciesInputPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PoliciesInputPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PoliciesInputPopupComponent, selectors: [["app-policies-input-popup"]], inputs: { popup: "popup" }, features: [\u0275\u0275NgOnChangesFeature], decls: 1, vars: 1, consts: [[3, "model", "zIndex"], [3, "ngModelChange", "model", "ngModel", "disabled"]], template: function PoliciesInputPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, PoliciesInputPopupComponent_Conditional_0_Template, 2, 5, "app-popup", 0);
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
    PopupComponent
  ], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PoliciesInputPopupComponent, [{
    type: Component,
    args: [{ selector: "app-policies-input-popup", standalone: true, imports: [
      FormsModule,
      FormFlowComponent,
      PopupComponent
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: '@if (popup; as editor) {\n  <app-popup [model]="popupModel(editor)" [zIndex]="editor.zIndex">\n    <app-form-flow\n      [model]="flowModel(editor)"\n      [ngModel]="draftValue"\n      (ngModelChange)="updateDraft($event)"\n      [disabled]="editor.readOnly"\n    ></app-form-flow>\n  </app-popup>\n}\n' }]
  }], null, { popup: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PoliciesInputPopupComponent, { className: "PoliciesInputPopupComponent", filePath: "app/shared/ui/components/core/form/inputs/policies-input/policies-input-popup/policies-input-popup.component.ts", lineNumber: 37 });
})();
export {
  PoliciesInputPopupComponent
};
//# sourceMappingURL=policies-input-popup.component-2VZ6E63I.js.map
