import {
  DeploymentConfigurationService
} from "./chunk-PB4YNHSN.js";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomProperty,
  ɵɵnextContext,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-XJL7SWH7.js";

// src/app/shared/ui/components/core/deployment-brand/deployment-brand.component.ts
function DeploymentBrandComponent_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "span", 2);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElement(2, "img", 3);
  }
  if (rf & 2) {
    const model_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(model_r1.beforeLogo);
    \u0275\u0275advance();
    \u0275\u0275domProperty("src", model_r1.branding.logoUrl, \u0275\u0275sanitizeUrl);
  }
}
function DeploymentBrandComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "span", 1);
    \u0275\u0275conditionalCreate(1, DeploymentBrandComponent_Conditional_0_Conditional_1_Template, 3, 2);
    \u0275\u0275domElementStart(2, "span", 2);
    \u0275\u0275text(3);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const model_r1 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("deployment-brand--inline-logo", model_r1.inlineLogo);
    \u0275\u0275attribute("aria-label", ctx_r1.ariaLabel || model_r1.branding.productName);
    \u0275\u0275advance();
    \u0275\u0275conditional(model_r1.inlineLogo ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(model_r1.inlineLogo ? model_r1.afterLogo : model_r1.beforeLogo);
  }
}
var DeploymentBrandComponent = class _DeploymentBrandComponent {
  deploymentConfiguration = inject(DeploymentConfigurationService);
  branding = null;
  ariaLabel = null;
  renderModel() {
    const branding = this.branding ?? this.deploymentConfiguration.branding();
    const characters = Array.from(branding.productName);
    const index = branding.logoCharacterIndex ?? 0;
    const inlineLogo = Boolean(branding.logoUrl.trim()) && index >= 0;
    return {
      branding,
      inlineLogo,
      beforeLogo: inlineLogo ? characters.slice(0, index).join("") : branding.productName,
      afterLogo: inlineLogo ? characters.slice(index + 1).join("") : ""
    };
  }
  static \u0275fac = function DeploymentBrandComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DeploymentBrandComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DeploymentBrandComponent, selectors: [["app-deployment-brand"]], inputs: { branding: "branding", ariaLabel: "ariaLabel" }, decls: 1, vars: 1, consts: [[1, "deployment-brand", 3, "deployment-brand--inline-logo"], [1, "deployment-brand"], ["aria-hidden", "true", 1, "deployment-brand__text"], ["alt", "", "aria-hidden", "true", 1, "deployment-brand__logo", 3, "src"]], template: function DeploymentBrandComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, DeploymentBrandComponent_Conditional_0_Template, 4, 5, "span", 0);
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275conditional((tmp_0_0 = ctx.renderModel()) ? 0 : -1, tmp_0_0);
    }
  }, styles: ["\n[_nghost-%COMP%] {\n  display: inline-flex;\n  min-width: 0;\n  max-width: 100%;\n}\n.deployment-brand[_ngcontent-%COMP%] {\n  min-width: 0;\n  max-width: 100%;\n  display: inline-flex;\n  align-items: var(--deployment-brand-align, flex-end);\n  gap: var(--deployment-brand-gap, 0);\n  color: inherit;\n  font: inherit;\n  font-weight: inherit;\n  line-height: inherit;\n  letter-spacing: inherit;\n  white-space: nowrap;\n}\n.deployment-brand--inline-logo[_ngcontent-%COMP%] {\n  align-items: center;\n  gap: var(--deployment-brand-character-gap, 0.02em);\n}\n.deployment-brand__logo[_ngcontent-%COMP%] {\n  width: var(--deployment-brand-logo-size, 1.2em);\n  height: var(--deployment-brand-logo-size, 1.2em);\n  flex: 0 0 auto;\n  display: block;\n  object-fit: contain;\n}\n.deployment-brand__text[_ngcontent-%COMP%] {\n  min-width: 0;\n  color: inherit;\n  font: inherit;\n  font-weight: inherit;\n  line-height: inherit;\n  letter-spacing: inherit;\n}\n/*# sourceMappingURL=deployment-brand.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DeploymentBrandComponent, [{
    type: Component,
    args: [{ selector: "app-deployment-brand", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, template: '@if (renderModel(); as model) {\n  <span\n    class="deployment-brand"\n    [class.deployment-brand--inline-logo]="model.inlineLogo"\n    [attr.aria-label]="ariaLabel || model.branding.productName"\n  >\n    @if (model.inlineLogo) {\n      <span class="deployment-brand__text" aria-hidden="true">{{ model.beforeLogo }}</span>\n      <img\n        class="deployment-brand__logo"\n        [src]="model.branding.logoUrl"\n        alt=""\n        aria-hidden="true"\n      />\n    }\n    <span class="deployment-brand__text" aria-hidden="true">{{ model.inlineLogo ? model.afterLogo : model.beforeLogo }}</span>\n  </span>\n}\n', styles: ["/* src/app/shared/ui/components/core/deployment-brand/deployment-brand.component.scss */\n:host {\n  display: inline-flex;\n  min-width: 0;\n  max-width: 100%;\n}\n.deployment-brand {\n  min-width: 0;\n  max-width: 100%;\n  display: inline-flex;\n  align-items: var(--deployment-brand-align, flex-end);\n  gap: var(--deployment-brand-gap, 0);\n  color: inherit;\n  font: inherit;\n  font-weight: inherit;\n  line-height: inherit;\n  letter-spacing: inherit;\n  white-space: nowrap;\n}\n.deployment-brand--inline-logo {\n  align-items: center;\n  gap: var(--deployment-brand-character-gap, 0.02em);\n}\n.deployment-brand__logo {\n  width: var(--deployment-brand-logo-size, 1.2em);\n  height: var(--deployment-brand-logo-size, 1.2em);\n  flex: 0 0 auto;\n  display: block;\n  object-fit: contain;\n}\n.deployment-brand__text {\n  min-width: 0;\n  color: inherit;\n  font: inherit;\n  font-weight: inherit;\n  line-height: inherit;\n  letter-spacing: inherit;\n}\n/*# sourceMappingURL=deployment-brand.component.css.map */\n"] }]
  }], null, { branding: [{
    type: Input
  }], ariaLabel: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DeploymentBrandComponent, { className: "DeploymentBrandComponent", filePath: "app/shared/ui/components/core/deployment-brand/deployment-brand.component.ts", lineNumber: 25 });
})();

export {
  DeploymentBrandComponent
};
//# sourceMappingURL=chunk-QNXIGSHX.js.map
