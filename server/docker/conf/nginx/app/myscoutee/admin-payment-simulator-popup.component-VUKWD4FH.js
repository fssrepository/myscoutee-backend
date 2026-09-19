import {
  AdminMenuStore
} from "./chunk-EEP5RO7H.js";
import "./chunk-Z7T4C7EV.js";
import "./chunk-2DMDD7ZZ.js";
import {
  PopupComponent
} from "./chunk-ERGA5DCY.js";
import "./chunk-ADBOYRJ7.js";
import "./chunk-EAXEH725.js";
import {
  IndicatorComponent
} from "./chunk-53UGBDSO.js";
import {
  DeploymentConfigurationService
} from "./chunk-MOUXN75Y.js";
import {
  I18nPipe,
  MatIcon,
  MatIconModule
} from "./chunk-L6HJFJOR.js";
import {
  DomSanitizer
} from "./chunk-LFBAVSTX.js";
import "./chunk-7B4ZHEVS.js";
import "./chunk-6SKBB3AJ.js";
import "./chunk-YXATI2WQ.js";
import "./chunk-QXOIA7DH.js";
import {
  RouteDelayService
} from "./chunk-UKS3QROH.js";
import "./chunk-AOUY6FNC.js";
import {
  CommonModule
} from "./chunk-SCHUURLR.js";
import "./chunk-HDBJPOT3.js";
import "./chunk-LDZENZ35.js";
import {
  HttpClient
} from "./chunk-DZ6OOOZN.js";
import "./chunk-ODJSNRFC.js";
import {
  Component,
  HostListener,
  Injectable,
  computed,
  effect,
  environment,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
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
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵsanitizeResourceUrl,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-EV3I3YNV.js";

// src/app/shared/core/http/services/payment-simulator-admin.service.ts
var HttpPaymentSimulatorAdminService = class _HttpPaymentSimulatorAdminService {
  static CONFIGURATION_ROUTE = "/admin/payment-simulator/configuration-access";
  static AUTHORIZATION_ROUTE = "/admin/payment-simulator/authorization-access";
  http = inject(HttpClient);
  routeDelay = inject(RouteDelayService);
  async createConfigurationAccess() {
    const endpoint = `${environment.paymentSimulatorConfigUrl ?? ""}`.trim();
    if (!endpoint) {
      throw new Error("admin.payment.simulator.unavailable");
    }
    const response = await this.routeDelay.withRequestTimeout(_HttpPaymentSimulatorAdminService.CONFIGURATION_ROUTE, this.http.post(endpoint, {}).toPromise(), "admin.payment.simulator.timeout");
    const url = `${response?.url ?? ""}`.trim();
    const expiresAt = `${response?.expiresAt ?? ""}`.trim();
    if (!url || !expiresAt || !this.isAllowedUrl(url)) {
      throw new Error("admin.payment.simulator.unavailable");
    }
    return { url, expiresAt };
  }
  async createAuthorizationAccess() {
    const configurationEndpoint = `${environment.paymentSimulatorConfigUrl ?? ""}`.trim();
    if (!configurationEndpoint) {
      throw new Error("admin.payment.simulator.authorization.unavailable");
    }
    const endpoint = `${environment.apiBaseUrl}${_HttpPaymentSimulatorAdminService.AUTHORIZATION_ROUTE}`;
    const response = await this.routeDelay.withRequestTimeout(_HttpPaymentSimulatorAdminService.AUTHORIZATION_ROUTE, this.http.post(endpoint, {}).toPromise(), "admin.payment.simulator.authorization.timeout");
    const url = `${response?.url ?? ""}`.trim();
    const expiresAt = `${response?.expiresAt ?? ""}`.trim();
    if (!url || !expiresAt || !this.isAllowedUrl(url)) {
      throw new Error("admin.payment.simulator.authorization.unavailable");
    }
    return { url, expiresAt };
  }
  isAllowedUrl(value) {
    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }
  static \u0275fac = function HttpPaymentSimulatorAdminService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HttpPaymentSimulatorAdminService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _HttpPaymentSimulatorAdminService, factory: _HttpPaymentSimulatorAdminService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HttpPaymentSimulatorAdminService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/admin/components/payment-simulator-popup/admin-payment-simulator-popup.component.ts
function AdminPaymentSimulatorPopupComponent_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "iframe", 5);
    \u0275\u0275pipe(1, "i18n");
    \u0275\u0275listener("load", function AdminPaymentSimulatorPopupComponent_Conditional_0_Conditional_2_Template_iframe_load_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.frameLoaded());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("src", ctx, \u0275\u0275sanitizeResourceUrl);
    \u0275\u0275attribute("title", \u0275\u0275pipeBind1(1, 2, ctx_r1.titleKey()));
  }
}
function AdminPaymentSimulatorPopupComponent_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3);
    \u0275\u0275element(1, "app-indicator", 6);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 1, ctx_r1.loadingKey()));
  }
}
function AdminPaymentSimulatorPopupComponent_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 4)(1, "mat-icon");
    \u0275\u0275text(2, "warning");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 7);
    \u0275\u0275listener("click", function AdminPaymentSimulatorPopupComponent_Conditional_0_Conditional_4_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.retry());
    });
    \u0275\u0275elementStart(7, "mat-icon");
    \u0275\u0275text(8, "refresh");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span");
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "i18n");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 2, ctx_r1.errorKey()));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(11, 4, "admin.payment.simulator.retry"));
  }
}
function AdminPaymentSimulatorPopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-popup", 0)(1, "div", 1);
    \u0275\u0275conditionalCreate(2, AdminPaymentSimulatorPopupComponent_Conditional_0_Conditional_2_Template, 2, 4, "iframe", 2);
    \u0275\u0275conditionalCreate(3, AdminPaymentSimulatorPopupComponent_Conditional_0_Conditional_3_Template, 5, 3, "div", 3)(4, AdminPaymentSimulatorPopupComponent_Conditional_0_Conditional_4_Template, 12, 6, "div", 4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.popupModel());
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_2_0 = ctx_r1.frameVisible() && ctx_r1.sourceUrl()) ? 2 : -1, tmp_2_0);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.loading() ? 3 : ctx_r1.errorKey() ? 4 : -1);
  }
}
var AdminPaymentSimulatorPopupComponent = class _AdminPaymentSimulatorPopupComponent {
  admin = inject(AdminMenuStore);
  simulator = inject(HttpPaymentSimulatorAdminService);
  deploymentConfiguration = inject(DeploymentConfigurationService);
  sanitizer = inject(DomSanitizer);
  sourceUrl = signal(null, ...ngDevMode ? [{ debugName: "sourceUrl" }] : (
    /* istanbul ignore next */
    []
  ));
  loading = signal(false, ...ngDevMode ? [{ debugName: "loading" }] : (
    /* istanbul ignore next */
    []
  ));
  errorKey = signal("", ...ngDevMode ? [{ debugName: "errorKey" }] : (
    /* istanbul ignore next */
    []
  ));
  frameVisible = computed(() => this.sourceUrl() !== null && !this.errorKey(), ...ngDevMode ? [{ debugName: "frameVisible" }] : (
    /* istanbul ignore next */
    []
  ));
  authorizationSurface = computed(() => this.admin.activePopup() === "payment-authorizations", ...ngDevMode ? [{ debugName: "authorizationSurface" }] : (
    /* istanbul ignore next */
    []
  ));
  titleKey = computed(() => this.authorizationSurface() ? "admin.payment.simulator.authorization" : "admin.payment.simulator", ...ngDevMode ? [{ debugName: "titleKey" }] : (
    /* istanbul ignore next */
    []
  ));
  loadingKey = computed(() => this.authorizationSurface() ? "admin.payment.simulator.authorization.loading" : "admin.payment.simulator.loading", ...ngDevMode ? [{ debugName: "loadingKey" }] : (
    /* istanbul ignore next */
    []
  ));
  activeSurface = null;
  requestGeneration = 0;
  simulatorOrigin = "";
  constructor() {
    effect(() => {
      const activePopup = this.admin.activePopup();
      const surface = activePopup === "payment-simulator" || activePopup === "payment-authorizations" ? activePopup : null;
      if (surface === this.activeSurface) {
        return;
      }
      this.activeSurface = surface;
      this.requestGeneration += 1;
      this.sourceUrl.set(null);
      this.simulatorOrigin = "";
      this.loading.set(false);
      this.errorKey.set("");
      if (surface) {
        queueMicrotask(() => void this.loadConfiguration());
      }
    });
  }
  popupModel() {
    const authorizationSurface = this.authorizationSurface();
    return {
      title: authorizationSurface ? "admin.payment.simulator.authorization" : "admin.payment.simulator",
      subtitle: authorizationSurface ? "admin.payment.simulator.authorization.subtitle" : "admin.payment.simulator.subtitle",
      ariaLabel: authorizationSurface ? "admin.payment.simulator.authorization" : "admin.payment.simulator",
      closeAriaLabel: "close",
      size: "wide",
      height: "full",
      headerTone: "accent",
      bodyLayout: "flush",
      onClose: () => this.close()
    };
  }
  close() {
    this.admin.closePopup();
  }
  retry() {
    void this.loadConfiguration();
  }
  frameLoaded() {
    this.loading.set(false);
  }
  onSimulatorMessage(event) {
    if (this.admin.activePopup() !== "payment-simulator" || !this.simulatorOrigin || event.origin !== this.simulatorOrigin) {
      return;
    }
    const payload = event.data;
    const provider = `${payload?.provider ?? ""}`.trim().toLowerCase();
    if (payload?.source !== "myscoutee-payment-simulator" || payload.type !== "configuration" || !["none", "stripe", "barion"].includes(provider)) {
      return;
    }
    this.deploymentConfiguration.applyPaymentProviderId(provider === "none" ? null : provider);
  }
  async loadConfiguration() {
    const generation = ++this.requestGeneration;
    const authorizationSurface = this.authorizationSurface();
    this.loading.set(true);
    this.errorKey.set("");
    this.sourceUrl.set(null);
    try {
      const access = authorizationSurface ? await this.simulator.createAuthorizationAccess() : await this.simulator.createConfigurationAccess();
      if (generation !== this.requestGeneration || this.authorizationSurface() !== authorizationSurface) {
        return;
      }
      this.simulatorOrigin = new URL(access.url).origin;
      this.sourceUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(access.url));
    } catch (error) {
      if (generation !== this.requestGeneration || this.authorizationSurface() !== authorizationSurface) {
        return;
      }
      const message = error instanceof Error ? error.message.trim() : "";
      this.errorKey.set(message.startsWith("admin.payment.simulator.") ? message : authorizationSurface ? "admin.payment.simulator.authorization.unavailable" : "admin.payment.simulator.unavailable");
      this.loading.set(false);
    }
  }
  static \u0275fac = function AdminPaymentSimulatorPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminPaymentSimulatorPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminPaymentSimulatorPopupComponent, selectors: [["app-admin-payment-simulator-popup"]], hostBindings: function AdminPaymentSimulatorPopupComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("message", function AdminPaymentSimulatorPopupComponent_message_HostBindingHandler($event) {
        return ctx.onSimulatorMessage($event);
      }, \u0275\u0275resolveWindow);
    }
  }, decls: 1, vars: 1, consts: [[1, "payment-simulator-popup", 3, "model"], [1, "payment-simulator-body"], ["sandbox", "allow-forms allow-scripts allow-same-origin", 1, "payment-simulator-frame", 3, "src"], ["aria-busy", "true", 1, "payment-simulator-state"], ["role", "alert", 1, "payment-simulator-state", "payment-simulator-state--error"], ["sandbox", "allow-forms allow-scripts allow-same-origin", 1, "payment-simulator-frame", 3, "load", "src"], ["kind", "load-ring", "state", "loading"], ["type", "button", 3, "click"]], template: function AdminPaymentSimulatorPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, AdminPaymentSimulatorPopupComponent_Conditional_0_Template, 5, 3, "app-popup", 0);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.admin.activePopup() === "payment-simulator" || ctx.admin.activePopup() === "payment-authorizations" ? 0 : -1);
    }
  }, dependencies: [CommonModule, MatIconModule, MatIcon, IndicatorComponent, PopupComponent, I18nPipe], styles: ["\n[_nghost-%COMP%] {\n  display: contents;\n}\n.payment-simulator-body[_ngcontent-%COMP%] {\n  position: relative;\n  min-width: 0;\n  min-height: 0;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  background: #eef3f9;\n}\n.payment-simulator-frame[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 100%;\n  border: 0;\n  background: #eef3f9;\n}\n.payment-simulator-state[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  display: grid;\n  place-content: center;\n  justify-items: center;\n  gap: 0.75rem;\n  padding: 1rem;\n  color: #294b76;\n  background: #eef3f9;\n  font-size: 0.86rem;\n  font-weight: 850;\n  text-align: center;\n}\n.payment-simulator-state--error[_ngcontent-%COMP%] {\n  color: #9b3345;\n  background: #fff7f7;\n}\n.payment-simulator-state[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.4rem;\n  min-height: 36px;\n  border: 1px solid rgba(48, 103, 169, 0.24);\n  border-radius: 8px;\n  padding: 0.42rem 0.72rem;\n  color: #24598f;\n  background: #fff;\n  font: inherit;\n  cursor: pointer;\n}\n.payment-simulator-state[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n/*# sourceMappingURL=admin-payment-simulator-popup.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminPaymentSimulatorPopupComponent, [{
    type: Component,
    args: [{ selector: "app-admin-payment-simulator-popup", standalone: true, imports: [CommonModule, MatIconModule, IndicatorComponent, I18nPipe, PopupComponent], template: `@if (admin.activePopup() === 'payment-simulator' || admin.activePopup() === 'payment-authorizations') {
  <app-popup class="payment-simulator-popup" [model]="popupModel()">
    <div class="payment-simulator-body">
      @if (frameVisible() && sourceUrl(); as url) {
        <iframe
          class="payment-simulator-frame"
          [src]="url"
          [attr.title]="titleKey() | i18n"
          sandbox="allow-forms allow-scripts allow-same-origin"
          (load)="frameLoaded()"
        ></iframe>
      }
      @if (loading()) {
        <div class="payment-simulator-state" aria-busy="true">
          <app-indicator kind="load-ring" state="loading"></app-indicator>
          <span>{{ loadingKey() | i18n }}</span>
        </div>
      } @else if (errorKey()) {
        <div class="payment-simulator-state payment-simulator-state--error" role="alert">
          <mat-icon>warning</mat-icon>
          <span>{{ errorKey() | i18n }}</span>
          <button type="button" (click)="retry()">
            <mat-icon>refresh</mat-icon>
            <span>{{ 'admin.payment.simulator.retry' | i18n }}</span>
          </button>
        </div>
      }
    </div>
  </app-popup>
}
`, styles: ["/* src/app/admin/components/payment-simulator-popup/admin-payment-simulator-popup.component.scss */\n:host {\n  display: contents;\n}\n.payment-simulator-body {\n  position: relative;\n  min-width: 0;\n  min-height: 0;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  background: #eef3f9;\n}\n.payment-simulator-frame {\n  display: block;\n  width: 100%;\n  height: 100%;\n  border: 0;\n  background: #eef3f9;\n}\n.payment-simulator-state {\n  position: absolute;\n  inset: 0;\n  display: grid;\n  place-content: center;\n  justify-items: center;\n  gap: 0.75rem;\n  padding: 1rem;\n  color: #294b76;\n  background: #eef3f9;\n  font-size: 0.86rem;\n  font-weight: 850;\n  text-align: center;\n}\n.payment-simulator-state--error {\n  color: #9b3345;\n  background: #fff7f7;\n}\n.payment-simulator-state button {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.4rem;\n  min-height: 36px;\n  border: 1px solid rgba(48, 103, 169, 0.24);\n  border-radius: 8px;\n  padding: 0.42rem 0.72rem;\n  color: #24598f;\n  background: #fff;\n  font: inherit;\n  cursor: pointer;\n}\n.payment-simulator-state button mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n/*# sourceMappingURL=admin-payment-simulator-popup.component.css.map */\n"] }]
  }], () => [], { onSimulatorMessage: [{
    type: HostListener,
    args: ["window:message", ["$event"]]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminPaymentSimulatorPopupComponent, { className: "AdminPaymentSimulatorPopupComponent", filePath: "app/admin/components/payment-simulator-popup/admin-payment-simulator-popup.component.ts", lineNumber: 20 });
})();
export {
  AdminPaymentSimulatorPopupComponent
};
//# sourceMappingURL=admin-payment-simulator-popup.component-VUKWD4FH.js.map
