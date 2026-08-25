import {
  FormFlowComponent
} from "./chunk-4YDRPLS7.js";
import "./chunk-H3IGIWEC.js";
import "./chunk-WFNQJ567.js";
import "./chunk-VNTNCRGK.js";
import "./chunk-RJSPRCFL.js";
import "./chunk-BEAS7CFC.js";
import "./chunk-EGWJQCT5.js";
import "./chunk-YTMD6HU4.js";
import "./chunk-4VYYFWRA.js";
import "./chunk-QEZI4ZBE.js";
import "./chunk-LTMPUKCR.js";
import {
  FormFlowPopupStore
} from "./chunk-5EHS4ACX.js";
import {
  PopupComponent
} from "./chunk-3VXLUVWM.js";
import "./chunk-VEYRCVMX.js";
import "./chunk-MVR37RGJ.js";
import {
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-FOAFZS65.js";
import "./chunk-EDHGCWPF.js";
import "./chunk-CUDLB52K.js";
import "./chunk-FJQMGJUW.js";
import "./chunk-HUL5TV72.js";
import "./chunk-PK4DOAMC.js";
import "./chunk-GEAUBJJD.js";
import "./chunk-5PHTFUHA.js";
import "./chunk-F4WY6ECV.js";
import "./chunk-Q3344WPR.js";
import "./chunk-XQ4NDAVX.js";
import "./chunk-4FWVIYNI.js";
import "./chunk-7MTG4XZU.js";
import "./chunk-J7IJFFQ2.js";
import "./chunk-XQACYBVS.js";
import "./chunk-YKC4KBEC.js";
import "./chunk-B2DKYQGD.js";
import "./chunk-KLUOB5SD.js";
import "./chunk-6POEHVT7.js";
import "./chunk-2ENBQWLU.js";
import "./chunk-LERGHE7K.js";
import "./chunk-D6ZHKNYF.js";
import "./chunk-SKAK727J.js";
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
} from "./chunk-XJL7SWH7.js";

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
//# sourceMappingURL=policies-input-popup.component-OALEC56Q.js.map
