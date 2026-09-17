import {
  AppMenuComponent,
  DefaultValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgControlStatus,
  NgModel,
  RequiredValidator
} from "./chunk-J4QS2YUJ.js";
import {
  AppUtils
} from "./chunk-QZPIQIRC.js";
import {
  I18nService
} from "./chunk-I52TUHFM.js";
import {
  CommonModule
} from "./chunk-JMCIB2VE.js";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  __spreadProps,
  __spreadValues,
  forwardRef,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-FMXFYYCS.js";

// src/app/shared/ui/components/core/form/inputs/link-input/link-input.component.ts
function LinkInputComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 2);
    \u0275\u0275text(1, "*");
    \u0275\u0275elementEnd();
  }
}
function LinkInputComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 6);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.clipboardError());
  }
}
var LinkInputComponent = class _LinkInputComponent {
  config = {};
  readOnly = false;
  textReadOnly = false;
  disabled = false;
  value = "";
  clipboardError = signal("", ...ngDevMode ? [{ debugName: "clipboardError" }] : (
    /* istanbul ignore next */
    []
  ));
  i18n = inject(I18nService);
  controlDisabled = false;
  onValueChange = () => void 0;
  onTouched = () => void 0;
  writeValue(value) {
    this.value = this.toText(value).trim();
  }
  registerOnChange(fn) {
    this.onValueChange = fn;
  }
  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled) {
    this.controlDisabled = isDisabled;
  }
  label() {
    return this.toText(this.config.label).trim() || "Source link";
  }
  placeholder() {
    return this.toText(this.config.placeholder).trim() || "https://...";
  }
  required() {
    return this.config.required === true;
  }
  maxLength() {
    const value = Math.trunc(Number(this.config.maxLength));
    return Number.isFinite(value) && value > 0 ? value : null;
  }
  inputDisabled() {
    return this.disabled || this.controlDisabled;
  }
  inputReadOnly() {
    return this.readOnly || this.textReadOnly;
  }
  normalizedUrl() {
    return AppUtils.normalizeHttpUrl(this.value);
  }
  actionItems() {
    const disabled = this.inputDisabled();
    const normalizedUrl = this.normalizedUrl();
    const items = [];
    const availableUrlItems = this.availableUrlItems();
    if (availableUrlItems.length > 0) {
      items.push({
        id: "link-input-select",
        icon: "list_alt",
        openIcon: "list_alt",
        layout: "action",
        kind: "branch",
        palette: "violet",
        ariaLabel: this.toText(this.config.availableUrlsAriaLabel).trim() || "Select an available URL",
        disabled: disabled || this.readOnly,
        items: availableUrlItems
      });
    }
    items.push({
      id: "link-input-paste",
      icon: "content_paste",
      layout: "action",
      palette: "blue",
      ariaLabel: this.toText(this.config.pasteAriaLabel).trim() || "Paste link",
      disabled: disabled || this.readOnly,
      context: { action: "paste" }
    }, {
      id: "link-input-open",
      icon: "link",
      layout: "action",
      palette: "teal",
      ariaLabel: this.toText(this.config.openAriaLabel).trim() || "Open link",
      disabled: disabled || !normalizedUrl,
      context: { action: "open" }
    }, {
      id: "link-input-delete",
      icon: "delete",
      layout: "action",
      palette: "danger",
      ariaLabel: this.toText(this.config.deleteAriaLabel).trim() || "Remove link",
      disabled: disabled || this.readOnly || !this.value.trim(),
      context: { action: "delete" }
    });
    return this.readOnly ? items.filter((item) => item.context?.action === "open") : items;
  }
  onInput(value) {
    if (this.inputDisabled() || this.inputReadOnly()) {
      return;
    }
    this.setValue(this.toText(value), false);
  }
  onPaste(event) {
    if (this.inputDisabled() || this.inputReadOnly()) {
      return;
    }
    const text = event.clipboardData?.getData("text") ?? "";
    if (!text.trim()) {
      return;
    }
    event.preventDefault();
    this.setValue(text, true);
  }
  onBlur() {
    if (!this.inputDisabled() && !this.inputReadOnly()) {
      const trimmed = this.value.trim();
      const normalized = AppUtils.normalizeHttpUrl(trimmed);
      this.setValue(normalized || trimmed, false);
    }
    this.onTouched();
  }
  onAction(event) {
    this.onTouched();
    const action = event.context?.action;
    if (action === "select") {
      this.setValue(event.context?.url ?? "", true);
      return;
    }
    if (action === "paste") {
      void this.pasteFromClipboard();
      return;
    }
    if (action === "open") {
      this.openLink();
      return;
    }
    if (action === "delete") {
      this.setValue("", false);
    }
  }
  async pasteFromClipboard() {
    if (this.inputDisabled() || this.readOnly) {
      return;
    }
    this.clipboardError.set("");
    try {
      if (typeof navigator === "undefined" || !navigator.clipboard?.readText) {
        throw new Error("Clipboard unavailable");
      }
      this.setValue(await navigator.clipboard.readText(), true);
    } catch {
      this.clipboardError.set(this.i18n.translate("clipboard.paste.permission.help"));
    }
  }
  openLink() {
    const normalizedUrl = this.normalizedUrl();
    if (!normalizedUrl) {
      return;
    }
    AppUtils.openExternalUrl(normalizedUrl);
  }
  availableUrlItems() {
    const currentUrl = this.normalizedUrl();
    const seen = /* @__PURE__ */ new Set();
    return (this.config.availableUrls ?? []).map((option) => this.availableUrl(option)).filter((option) => {
      if (!option.normalizedUrl || seen.has(option.normalizedUrl)) {
        return false;
      }
      seen.add(option.normalizedUrl);
      return true;
    }).map((option, index) => ({
      id: `link-input-url-${index}`,
      label: this.toText(option.label).trim() || option.normalizedUrl,
      description: this.toText(option.description).trim() || option.normalizedUrl,
      icon: "link",
      kind: "radio",
      palette: "violet",
      surface: "tinted",
      active: currentUrl === option.normalizedUrl,
      checked: currentUrl === option.normalizedUrl,
      disabled: option.disabled === true,
      context: {
        action: "select",
        url: option.normalizedUrl
      }
    }));
  }
  availableUrl(option) {
    const source = typeof option === "string" ? { url: option } : option;
    return __spreadProps(__spreadValues({}, source), {
      normalizedUrl: AppUtils.normalizeHttpUrl(source.url)
    });
  }
  setValue(value, normalize) {
    if (this.inputDisabled() || this.readOnly) {
      return;
    }
    const source = this.toText(value);
    const raw = normalize ? source.trim() : source;
    const nextValue = normalize && raw ? AppUtils.normalizeHttpUrl(raw) : raw;
    this.value = nextValue;
    this.onValueChange(nextValue);
  }
  toText(value) {
    return `${value ?? ""}`;
  }
  static \u0275fac = function LinkInputComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LinkInputComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LinkInputComponent, selectors: [["app-link-input"]], inputs: { config: "config", readOnly: "readOnly", textReadOnly: "textReadOnly", disabled: "disabled" }, features: [\u0275\u0275ProvidersFeature([
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => _LinkInputComponent),
      multi: true
    }
  ])], decls: 9, vars: 15, consts: [[1, "link-input"], [1, "link-input__label"], [1, "link-input__required"], [1, "link-input__row"], ["type", "url", "inputmode", "url", "spellcheck", "false", 3, "ngModelChange", "paste", "blur", "ngModel", "readonly", "disabled", "placeholder", "required"], ["kind", "inline", 1, "link-input__actions", 3, "itemSelect", "panelMode", "items"], ["role", "alert", 1, "link-input__error"]], template: function LinkInputComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "label", 0)(1, "span", 1)(2, "span");
      \u0275\u0275text(3);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(4, LinkInputComponent_Conditional_4_Template, 2, 0, "span", 2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "span", 3)(6, "input", 4);
      \u0275\u0275listener("ngModelChange", function LinkInputComponent_Template_input_ngModelChange_6_listener($event) {
        return ctx.onInput($event);
      })("paste", function LinkInputComponent_Template_input_paste_6_listener($event) {
        return ctx.onPaste($event);
      })("blur", function LinkInputComponent_Template_input_blur_6_listener() {
        return ctx.onBlur();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "app-menu", 5);
      \u0275\u0275listener("itemSelect", function LinkInputComponent_Template_app_menu_itemSelect_7_listener($event) {
        return ctx.onAction($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(8, LinkInputComponent_Conditional_8_Template, 2, 1, "span", 6);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275classProp("link-input--readonly", ctx.inputReadOnly())("link-input--disabled", ctx.inputDisabled());
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.label());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.required() ? 4 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngModel", ctx.value)("readonly", ctx.inputReadOnly())("disabled", ctx.inputDisabled())("placeholder", ctx.placeholder())("required", ctx.required());
      \u0275\u0275attribute("maxlength", ctx.maxLength());
      \u0275\u0275advance();
      \u0275\u0275property("panelMode", ctx.config.panelMode ?? "auto")("items", ctx.actionItems());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.clipboardError() ? 8 : -1);
    }
  }, dependencies: [CommonModule, FormsModule, DefaultValueAccessor, NgControlStatus, RequiredValidator, NgModel, AppMenuComponent], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n.link-input[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.38rem;\n  min-width: 0;\n}\n.link-input__label[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: baseline;\n  gap: 0.18rem;\n  color: #223550;\n  font-size: var(--link-input-label-font-size, 0.86rem);\n  font-weight: 800;\n}\n.link-input__required[_ngcontent-%COMP%] {\n  color: #b93243;\n}\n.link-input__row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.62rem;\n  min-width: 0;\n}\n.link-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  width: 100%;\n  min-width: 0;\n  min-height: 40px;\n  border: 1px solid rgba(136, 156, 186, 0.5);\n  border-radius: 10px;\n  background: #fff;\n  color: #1d3556;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  transition: border-color 0.15s ease, box-shadow 0.15s ease;\n}\n.link-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n  outline: 0;\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n}\n.form-flow__control.is-required-missing[_nghost-%COMP%]   .link-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], .form-flow__control.is-required-missing   [_nghost-%COMP%]   .link-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  border-color: #ef9a9a;\n  background: #fff1f1;\n}\n.link-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:read-only, \n.link-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:disabled {\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9fc 0%,\n      #edf2f7 100%);\n  border-color: rgba(122, 140, 168, 0.42);\n  color: rgba(58, 76, 103, 0.9);\n  -webkit-text-fill-color: rgba(58, 76, 103, 0.9);\n}\n.link-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:read-only:focus, \n.link-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:disabled:focus {\n  border-color: rgba(122, 140, 168, 0.42);\n  box-shadow: none;\n}\n.link-input__actions[_ngcontent-%COMP%] {\n  min-width: 108px;\n}\n.link-input--disabled[_ngcontent-%COMP%] {\n  opacity: 0.72;\n}\n.link-input__error[_ngcontent-%COMP%] {\n  color: #a12828;\n  font-size: 0.8rem;\n  overflow-wrap: anywhere;\n}\n/*# sourceMappingURL=link-input.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LinkInputComponent, [{
    type: Component,
    args: [{ selector: "app-link-input", standalone: true, imports: [CommonModule, FormsModule, AppMenuComponent], providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => LinkInputComponent),
        multi: true
      }
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `<label
  class="link-input"
  [class.link-input--readonly]="inputReadOnly()"
  [class.link-input--disabled]="inputDisabled()"
>
  <span class="link-input__label">
    <span>{{ label() }}</span>
    @if (required()) {
      <span class="link-input__required">*</span>
    }
  </span>
  <span class="link-input__row">
    <input
      type="url"
      [ngModel]="value"
      [readonly]="inputReadOnly()"
      [disabled]="inputDisabled()"
      [placeholder]="placeholder()"
      [required]="required()"
      [attr.maxlength]="maxLength()"
      inputmode="url"
      spellcheck="false"
      (ngModelChange)="onInput($event)"
      (paste)="onPaste($event)"
      (blur)="onBlur()"
      />
    <app-menu
      class="link-input__actions"
      kind="inline"
      [panelMode]="config.panelMode ?? 'auto'"
      [items]="actionItems()"
      (itemSelect)="onAction($event)"
    ></app-menu>
  </span>
  @if (clipboardError()) {
    <span class="link-input__error" role="alert">{{ clipboardError() }}</span>
  }
</label>
`, styles: ["/* src/app/shared/ui/components/core/form/inputs/link-input/link-input.component.scss */\n:host {\n  display: block;\n  min-width: 0;\n}\n.link-input {\n  display: grid;\n  gap: 0.38rem;\n  min-width: 0;\n}\n.link-input__label {\n  display: inline-flex;\n  align-items: baseline;\n  gap: 0.18rem;\n  color: #223550;\n  font-size: var(--link-input-label-font-size, 0.86rem);\n  font-weight: 800;\n}\n.link-input__required {\n  color: #b93243;\n}\n.link-input__row {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.62rem;\n  min-width: 0;\n}\n.link-input input {\n  box-sizing: border-box;\n  width: 100%;\n  min-width: 0;\n  min-height: 40px;\n  border: 1px solid rgba(136, 156, 186, 0.5);\n  border-radius: 10px;\n  background: #fff;\n  color: #1d3556;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  transition: border-color 0.15s ease, box-shadow 0.15s ease;\n}\n.link-input input:focus {\n  outline: 0;\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n}\n:host-context(.form-flow__control.is-required-missing) .link-input input {\n  border-color: #ef9a9a;\n  background: #fff1f1;\n}\n.link-input input:read-only,\n.link-input input:disabled {\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9fc 0%,\n      #edf2f7 100%);\n  border-color: rgba(122, 140, 168, 0.42);\n  color: rgba(58, 76, 103, 0.9);\n  -webkit-text-fill-color: rgba(58, 76, 103, 0.9);\n}\n.link-input input:read-only:focus,\n.link-input input:disabled:focus {\n  border-color: rgba(122, 140, 168, 0.42);\n  box-shadow: none;\n}\n.link-input__actions {\n  min-width: 108px;\n}\n.link-input--disabled {\n  opacity: 0.72;\n}\n.link-input__error {\n  color: #a12828;\n  font-size: 0.8rem;\n  overflow-wrap: anywhere;\n}\n/*# sourceMappingURL=link-input.component.css.map */\n"] }]
  }], null, { config: [{
    type: Input
  }], readOnly: [{
    type: Input
  }], textReadOnly: [{
    type: Input
  }], disabled: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LinkInputComponent, { className: "LinkInputComponent", filePath: "app/shared/ui/components/core/form/inputs/link-input/link-input.component.ts", lineNumber: 56 });
})();

export {
  LinkInputComponent
};
//# sourceMappingURL=chunk-A6AM4Z6L.js.map
