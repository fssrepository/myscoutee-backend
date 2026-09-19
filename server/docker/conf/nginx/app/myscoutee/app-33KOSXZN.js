import {
  HomeHeaderComponent
} from "./chunk-6EWA7OZ4.js";
import {
  AppLocationService,
  AppSetupStore
} from "./chunk-6ZREMSFX.js";
import {
  PwaService
} from "./chunk-BGAUSF4L.js";
import "./chunk-22I4RYEC.js";
import {
  NavigationCancel,
  NavigationCancellationCode,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet
} from "./chunk-666FMAP4.js";
import {
  DialogStore
} from "./chunk-4DNL6LXE.js";
import {
  PaymentAuthorizationService
} from "./chunk-HWWKH4YJ.js";
import "./chunk-2DMDD7ZZ.js";
import {
  PopupComponent
} from "./chunk-ERGA5DCY.js";
import {
  PopupPresenceStore
} from "./chunk-ADBOYRJ7.js";
import "./chunk-EAXEH725.js";
import {
  AppMenuComponent
} from "./chunk-53UGBDSO.js";
import "./chunk-ETJ7G4VT.js";
import {
  DeploymentConfigurationService
} from "./chunk-MOUXN75Y.js";
import "./chunk-ULZAFSSC.js";
import {
  I18nPipe
} from "./chunk-L6HJFJOR.js";
import {
  DomSanitizer
} from "./chunk-LFBAVSTX.js";
import "./chunk-UR2UG3BQ.js";
import "./chunk-7B4ZHEVS.js";
import "./chunk-6SKBB3AJ.js";
import "./chunk-YXATI2WQ.js";
import "./chunk-QXOIA7DH.js";
import "./chunk-IEWB22H3.js";
import {
  APP_SETUP_CONFIG
} from "./chunk-UKS3QROH.js";
import "./chunk-C6JV7CA3.js";
import "./chunk-N7OBXPJA.js";
import {
  I18nService
} from "./chunk-AOUY6FNC.js";
import {
  NgComponentOutlet
} from "./chunk-SCHUURLR.js";
import {
  AppUtils
} from "./chunk-CYVMX3LD.js";
import {
  OfflineCacheService,
  SessionService
} from "./chunk-HDBJPOT3.js";
import "./chunk-LDZENZ35.js";
import "./chunk-DZ6OOOZN.js";
import "./chunk-ODJSNRFC.js";
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  ViewChild,
  computed,
  effect,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
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
  ɵɵpureFunction1,
  ɵɵqueryRefresh,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵresolveDocument,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵsanitizeResourceUrl,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵviewQuery
} from "./chunk-EV3I3YNV.js";

// src/app/shared/ui/components/app-setup-popup/app-setup-popup.component.ts
var _c0 = (a0) => [a0];
var _forTrack0 = ($index, $item) => $item.id;
function AppSetupPopupComponent_Conditional_0_For_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-menu", 9);
    \u0275\u0275listener("itemSelect", function AppSetupPopupComponent_Conditional_0_For_10_Template_app_menu_itemSelect_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggle($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r4 = ctx.$implicit;
    \u0275\u0275property("items", \u0275\u0275pureFunction1(1, _c0, item_r4));
  }
}
function AppSetupPopupComponent_Conditional_0_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 6);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.store.error());
  }
}
function AppSetupPopupComponent_Conditional_0_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-menu", 10);
    \u0275\u0275listener("itemSelect", function AppSetupPopupComponent_Conditional_0_Conditional_12_Template_app_menu_itemSelect_0_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.action($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("model", ctx_r1.actionModel)("items", ctx_r1.permissionActions());
  }
}
function AppSetupPopupComponent_Conditional_0_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 8)(1, "h3", 11);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "app-menu", 10);
    \u0275\u0275listener("itemSelect", function AppSetupPopupComponent_Conditional_0_Conditional_13_Template_app_menu_itemSelect_7_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.action($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 4, "install.app"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(6, 6, "app.setup.description"));
    \u0275\u0275advance(2);
    \u0275\u0275property("model", ctx_r1.actionModel)("items", ctx_r1.installActions());
  }
}
function AppSetupPopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 1);
    \u0275\u0275listener("close", function AppSetupPopupComponent_Conditional_0_Template_app_popup_close_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.store.close());
    });
    \u0275\u0275elementStart(1, "div", 2)(2, "section", 3)(3, "h3", 4);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(9, AppSetupPopupComponent_Conditional_0_For_10_Template, 1, 3, "app-menu", 5, _forTrack0);
    \u0275\u0275conditionalCreate(11, AppSetupPopupComponent_Conditional_0_Conditional_11_Template, 2, 1, "p", 6);
    \u0275\u0275conditionalCreate(12, AppSetupPopupComponent_Conditional_0_Conditional_12_Template, 1, 2, "app-menu", 7);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(13, AppSetupPopupComponent_Conditional_0_Conditional_13_Template, 8, 8, "section", 8);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.model);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 6, "app.setup.permissions"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 8, "app.setup.permission.help"));
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.toggles());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.store.error() ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.showPermissionAction() ? 12 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.installActions().length ? 13 : -1);
  }
}
var AppSetupPopupComponent = class _AppSetupPopupComponent {
  store = inject(AppSetupStore);
  dialogs = inject(DialogStore);
  presence = inject(PopupPresenceStore);
  actionModel = { actionSizing: "content" };
  model = {
    title: "app.setup.title",
    size: "small",
    height: "auto",
    mobilePresentation: "compact",
    headerTone: "accent",
    headerPalette: "violet",
    showClose: true,
    closeOnBackdrop: false,
    backdropTone: "dim"
  };
  toggles = computed(() => [
    {
      id: "location",
      kind: "toggle",
      layout: "pill",
      icon: "location_on",
      label: "app.setup.location",
      palette: "blue",
      togglePalette: this.store.locationPermission() === "granted" ? "green" : this.store.locationPermission() === "denied" ? "red" : this.store.locationSelected() ? "blue" : "slate",
      checked: this.store.locationSelected(),
      showToggleIndicator: true,
      disabled: this.store.actionPending() || this.store.locationGranted()
    },
    {
      id: "notifications",
      kind: "toggle",
      layout: "pill",
      icon: "notifications",
      label: "app.setup.notifications",
      palette: "violet",
      togglePalette: this.store.notificationsSelected() && this.store.messaging.notificationPermission() === "granted" ? "green" : this.store.messaging.notificationPermission() === "denied" ? "red" : this.store.notificationsSelected() ? "blue" : "slate",
      checked: this.store.notificationsSelected(),
      showToggleIndicator: true,
      disabled: this.store.actionPending() || this.store.notificationConfigurationPending() || !this.store.messaging.notificationsConfigured
    }
  ], ...ngDevMode ? [{ debugName: "toggles" }] : (
    /* istanbul ignore next */
    []
  ));
  installActions = computed(() => [
    ...this.store.pwa.installAvailable() || this.store.pwa.installActionPending() ? [{
      id: "install",
      icon: "install_desktop",
      layout: "action",
      label: "install.app",
      palette: "violet",
      disabled: this.store.actionPending() || this.store.pwa.installActionPending(),
      progress: { state: this.store.pwa.installBusy() ? "loading" : null }
    }] : []
  ], ...ngDevMode ? [{ debugName: "installActions" }] : (
    /* istanbul ignore next */
    []
  ));
  showPermissionAction = computed(() => this.store.actionPending() || this.toggles().some((item) => !item.disabled), ...ngDevMode ? [{ debugName: "showPermissionAction" }] : (
    /* istanbul ignore next */
    []
  ));
  permissionActionPending = computed(() => this.store.busy() || this.store.notificationConfigurationPending(), ...ngDevMode ? [{ debugName: "permissionActionPending" }] : (
    /* istanbul ignore next */
    []
  ));
  permissionActions = computed(() => [
    {
      id: "allow",
      icon: this.permissionActionPending() ? "hourglass_empty" : this.store.saveSucceeded() ? "check_circle" : "check",
      label: this.permissionActionPending() ? "entry.permissions.checking" : "app.setup.update",
      layout: "action",
      palette: this.store.error() ? "danger" : this.store.saveSucceeded() ? "green" : "blue",
      disabled: this.store.allowDisabled(),
      progress: this.permissionActionPending() || this.store.error() ? {
        state: this.permissionActionPending() ? "loading" : "error",
        shape: "button",
        perimeter: 100,
        durationMs: APP_SETUP_CONFIG.locationRequestTimeoutMs
      } : this.store.saveSucceeded() ? { state: "success", durationMs: 1e3 } : null
    }
  ], ...ngDevMode ? [{ debugName: "permissionActions" }] : (
    /* istanbul ignore next */
    []
  ));
  constructor() {
    effect(() => {
      if (this.store.pwa.installPromptVisible() && !this.store.isOpen() && !this.dialogs.dialog() && !this.presence.visible())
        this.store.open();
    });
  }
  refreshPermissions() {
    if (this.store.isOpen())
      void this.store.refreshPermissions();
  }
  toggle(event) {
    if (this.store.actionPending())
      return;
    if (event.id === "location" && !this.store.locationGranted()) {
      this.store.locationSelected.update((value) => !value);
    } else if (event.id === "notifications") {
      this.store.toggleNotifications();
    }
  }
  action(event) {
    if (event.id === "install")
      this.store.install();
    if (event.id === "allow")
      void this.store.allow();
  }
  static \u0275fac = function AppSetupPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppSetupPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppSetupPopupComponent, selectors: [["app-setup-popup"]], hostBindings: function AppSetupPopupComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("focus", function AppSetupPopupComponent_focus_HostBindingHandler() {
        return ctx.refreshPermissions();
      }, \u0275\u0275resolveWindow);
    }
  }, decls: 1, vars: 1, consts: [[3, "model"], [3, "close", "model"], [1, "app-setup-content"], ["aria-labelledby", "setup-permissions", 1, "app-setup-section"], ["id", "setup-permissions"], ["kind", "inline", 1, "app-setup-toggle", 3, "items"], ["role", "alert", 1, "app-setup-error"], ["kind", "inline", 1, "app-setup-action", 3, "model", "items"], ["aria-labelledby", "setup-install", 1, "app-setup-section", "app-setup-install"], ["kind", "inline", 1, "app-setup-toggle", 3, "itemSelect", "items"], ["kind", "inline", 1, "app-setup-action", 3, "itemSelect", "model", "items"], ["id", "setup-install"]], template: function AppSetupPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, AppSetupPopupComponent_Conditional_0_Template, 14, 10, "app-popup", 0);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.store.isOpen() ? 0 : -1);
    }
  }, dependencies: [PopupComponent, AppMenuComponent, I18nPipe], styles: ["\n[_nghost-%COMP%] {\n  --app-popup-small-width: 340px;\n}\n.app-setup-content[_ngcontent-%COMP%], \n.app-setup-section[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr);\n  min-width: 0;\n  gap: 0.65rem;\n}\n.app-setup-content[_ngcontent-%COMP%] {\n  padding: 0.5rem;\n  color: #28415f;\n  line-height: 1.4;\n}\nh3[_ngcontent-%COMP%], \np[_ngcontent-%COMP%] {\n  margin: 0;\n}\nh3[_ngcontent-%COMP%] {\n  font-size: 0.95rem;\n}\np[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  overflow-wrap: anywhere;\n}\n.app-setup-install[_ngcontent-%COMP%] {\n  border-top: 1px solid #dce3ed;\n  padding-top: 0.8rem;\n  margin-top: 0.3rem;\n}\n.app-setup-error[_ngcontent-%COMP%] {\n  color: #a32035;\n}\napp-menu[_ngcontent-%COMP%] {\n  max-width: 100%;\n}\n.app-setup-action[_ngcontent-%COMP%] {\n  justify-self: end;\n}\n.app-setup-toggle[_ngcontent-%COMP%] {\n  --app-menu-row-item-width: 14rem;\n  --app-menu-row-item-justify: space-between;\n}\n/*# sourceMappingURL=app-setup-popup.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppSetupPopupComponent, [{
    type: Component,
    args: [{ selector: "app-setup-popup", imports: [PopupComponent, AppMenuComponent, I18nPipe], template: `@if (store.isOpen()) {
  <app-popup [model]="model" (close)="store.close()">
    <div class="app-setup-content">
      <section class="app-setup-section" aria-labelledby="setup-permissions">
        <h3 id="setup-permissions">{{ 'app.setup.permissions' | i18n }}</h3>
        <p>{{ 'app.setup.permission.help' | i18n }}</p>
        @for (item of toggles(); track item.id) {
          <app-menu class="app-setup-toggle" kind="inline" [items]="[item]" (itemSelect)="toggle($event)"></app-menu>
        }
        @if (store.error()) { <p class="app-setup-error" role="alert">{{ store.error() }}</p> }
        @if (showPermissionAction()) {
          <app-menu class="app-setup-action" kind="inline" [model]="actionModel" [items]="permissionActions()" (itemSelect)="action($event)"></app-menu>
        }
      </section>
      @if (installActions().length) {
        <section class="app-setup-section app-setup-install" aria-labelledby="setup-install">
          <h3 id="setup-install">{{ 'install.app' | i18n }}</h3>
          <p>{{ 'app.setup.description' | i18n }}</p>
          <app-menu class="app-setup-action" kind="inline" [model]="actionModel" [items]="installActions()" (itemSelect)="action($event)"></app-menu>
        </section>
      }
    </div>
  </app-popup>
}
`, styles: ["/* src/app/shared/ui/components/app-setup-popup/app-setup-popup.component.scss */\n:host {\n  --app-popup-small-width: 340px;\n}\n.app-setup-content,\n.app-setup-section {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr);\n  min-width: 0;\n  gap: 0.65rem;\n}\n.app-setup-content {\n  padding: 0.5rem;\n  color: #28415f;\n  line-height: 1.4;\n}\nh3,\np {\n  margin: 0;\n}\nh3 {\n  font-size: 0.95rem;\n}\np {\n  font-size: 0.9rem;\n  overflow-wrap: anywhere;\n}\n.app-setup-install {\n  border-top: 1px solid #dce3ed;\n  padding-top: 0.8rem;\n  margin-top: 0.3rem;\n}\n.app-setup-error {\n  color: #a32035;\n}\napp-menu {\n  max-width: 100%;\n}\n.app-setup-action {\n  justify-self: end;\n}\n.app-setup-toggle {\n  --app-menu-row-item-width: 14rem;\n  --app-menu-row-item-justify: space-between;\n}\n/*# sourceMappingURL=app-setup-popup.component.css.map */\n"] }]
  }], () => [], { refreshPermissions: [{
    type: HostListener,
    args: ["window:focus"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppSetupPopupComponent, { className: "AppSetupPopupComponent", filePath: "app/shared/ui/components/app-setup-popup/app-setup-popup.component.ts", lineNumber: 16 });
})();

// src/app/shared/ui/components/payment-authorization-popup/payment-authorization-popup.component.ts
var _c02 = ["providerFrame"];
function PaymentAuthorizationPopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-popup", 1);
    \u0275\u0275element(1, "iframe", 2, 0);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r0.popupModel())("zIndex", 25200);
    \u0275\u0275advance();
    \u0275\u0275property("src", ctx, \u0275\u0275sanitizeResourceUrl);
    \u0275\u0275attribute("title", \u0275\u0275pipeBind1(3, 4, "payment.authorization.waiting.title"));
  }
}
var PaymentAuthorizationPopupComponent = class _PaymentAuthorizationPopupComponent {
  providerFrame;
  authorization = inject(PaymentAuthorizationService);
  sanitizer = inject(DomSanitizer);
  sourceUrl = computed(() => {
    const url = this.authorization.waitingSurface()?.url;
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  }, ...ngDevMode ? [{ debugName: "sourceUrl" }] : (
    /* istanbul ignore next */
    []
  ));
  popupModel() {
    return {
      title: "payment.authorization.waiting.title",
      subtitle: "payment.authorization.waiting.subtitle",
      ariaLabel: "payment.authorization.waiting.title",
      closeAriaLabel: "close",
      size: "wide",
      height: "full",
      headerTone: "accent",
      bodyLayout: "flush",
      closeOnBackdrop: false,
      onClose: () => this.authorization.closeWaitingSurface()
    };
  }
  onProviderMessage(event) {
    const waiting = this.authorization.waitingSurface();
    if (!waiting || event.source !== this.providerFrame?.nativeElement.contentWindow) {
      return;
    }
    let expectedOrigin = "";
    try {
      expectedOrigin = new URL(waiting.url, window.location.href).origin;
    } catch {
      return;
    }
    const message = event.data;
    if (event.origin !== expectedOrigin || message?.source !== "myscoutee-payment-simulator" || message.type !== "payment-authorization") {
      return;
    }
    this.authorization.receiveProviderStatus(`${message.id ?? ""}`, `${message.status ?? ""}`);
  }
  static \u0275fac = function PaymentAuthorizationPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PaymentAuthorizationPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PaymentAuthorizationPopupComponent, selectors: [["app-payment-authorization-popup"]], viewQuery: function PaymentAuthorizationPopupComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c02, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.providerFrame = _t.first);
    }
  }, hostBindings: function PaymentAuthorizationPopupComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("message", function PaymentAuthorizationPopupComponent_message_HostBindingHandler($event) {
        return ctx.onProviderMessage($event);
      }, \u0275\u0275resolveWindow);
    }
  }, decls: 1, vars: 1, consts: [["providerFrame", ""], [1, "payment-authorization-popup", 3, "model", "zIndex"], ["sandbox", "allow-scripts allow-same-origin", 1, "payment-authorization-popup__frame", 3, "src"]], template: function PaymentAuthorizationPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, PaymentAuthorizationPopupComponent_Conditional_0_Template, 4, 6, "app-popup", 1);
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275conditional((tmp_0_0 = ctx.authorization.waitingSurface() && ctx.sourceUrl()) ? 0 : -1, tmp_0_0);
    }
  }, dependencies: [PopupComponent, I18nPipe], styles: ["\n[_nghost-%COMP%] {\n  display: contents;\n}\n.payment-authorization-popup__frame[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 100%;\n  min-height: 26rem;\n  border: 0;\n  background: #eef3f9;\n}\n/*# sourceMappingURL=payment-authorization-popup.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PaymentAuthorizationPopupComponent, [{
    type: Component,
    args: [{ selector: "app-payment-authorization-popup", standalone: true, imports: [I18nPipe, PopupComponent], template: `@if (authorization.waitingSurface() && sourceUrl(); as url) {
  <app-popup class="payment-authorization-popup" [model]="popupModel()" [zIndex]="25200">
    <iframe
      #providerFrame
      class="payment-authorization-popup__frame"
      [src]="url"
      [attr.title]="'payment.authorization.waiting.title' | i18n"
      sandbox="allow-scripts allow-same-origin"
    ></iframe>
  </app-popup>
}
`, styles: ["/* src/app/shared/ui/components/payment-authorization-popup/payment-authorization-popup.component.scss */\n:host {\n  display: contents;\n}\n.payment-authorization-popup__frame {\n  display: block;\n  width: 100%;\n  height: 100%;\n  min-height: 26rem;\n  border: 0;\n  background: #eef3f9;\n}\n/*# sourceMappingURL=payment-authorization-popup.component.css.map */\n"] }]
  }], null, { providerFrame: [{
    type: ViewChild,
    args: ["providerFrame"]
  }], onProviderMessage: [{
    type: HostListener,
    args: ["window:message", ["$event"]]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PaymentAuthorizationPopupComponent, { className: "PaymentAuthorizationPopupComponent", filePath: "app/shared/ui/components/payment-authorization-popup/payment-authorization-popup.component.ts", lineNumber: 15 });
})();

// src/app/app.ts
function App_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3);
    \u0275\u0275element(1, "app-home-header", 7);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("branding", ctx_r0.deploymentBranding());
  }
}
function App_Conditional_5_Conditional_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function App_Conditional_5_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, App_Conditional_5_Conditional_0_ng_container_0_Template, 1, 0, "ng-container", 8);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function App_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, App_Conditional_5_Conditional_0_Template, 1, 1, "ng-container");
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_1_0 = ctx_r0.sideMenuComponent()) ? 0 : -1, tmp_1_0);
  }
}
function App_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-menu", 5);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("items", ctx_r0.loadingAvatarItems());
  }
}
function App_Conditional_9_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 11);
  }
  if (rf & 2) {
    \u0275\u0275property("src", ctx, \u0275\u0275sanitizeUrl);
  }
}
function App_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 6)(1, "span", 9);
    \u0275\u0275element(2, "span", 10);
    \u0275\u0275conditionalCreate(3, App_Conditional_9_Conditional_3_Template, 1, 1, "img", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 12);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", "Loading " + ctx_r0.deploymentBranding().productName);
    \u0275\u0275advance(3);
    \u0275\u0275conditional((tmp_2_0 = ctx_r0.deploymentBranding().logoUrl) ? 3 : -1, tmp_2_0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.deploymentBranding().productName);
  }
}
var App = class _App {
  static ROUTE_WARMUP_WATCHDOG_DELAY_MS = 6e3;
  static MOBILE_RESUME_RECOVERY_DELAY_MS = 280;
  static ACTION_WAVE_TARGET_SELECTOR = [
    'button[class*="close" i]',
    'button[class*="back" i]',
    'button[aria-label*="close" i]',
    'button[aria-label*="back" i]',
    'button[aria-label*="cancel" i]',
    'button[aria-label*="dismiss" i]',
    'button[aria-label*="bez\xE1r" i]',
    'button[aria-label*="vissza" i]',
    'button[aria-label*="m\xE9gsem" i]',
    'button[title*="close" i]',
    'button[title*="cancel" i]',
    'button[data-close-action="true"]',
    'button[data-action-wave="true"]'
  ].join(",");
  static ACTION_WAVE_DURATION_MS = 520;
  router = inject(Router);
  sessionService = inject(SessionService);
  offlineCache = inject(OfflineCacheService);
  changeDetectorRef = inject(ChangeDetectorRef);
  pwaService = inject(PwaService);
  i18nService = inject(I18nService);
  appLocationService = inject(AppLocationService);
  deploymentConfiguration = inject(DeploymentConfigurationService);
  routerEventsSubscription;
  sideMenuComponentRef = signal(null, ...ngDevMode ? [{ debugName: "sideMenuComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  sideMenuComponentLoadPromise = null;
  routeWarmupHideTimer = null;
  routeWarmupWatchdogTimer = null;
  mobileResumeRecoveryTimer = null;
  initialLandingWarmupPending = false;
  showSideMenu = false;
  sideMenuComponent = this.sideMenuComponentRef.asReadonly();
  routeWarmupVisible = false;
  gameStartupVisible = false;
  loadingAvatarItems = computed(() => {
    const session = this.sessionService.currentSession();
    const userId = session?.kind === "firebase" ? session.profile.id : session?.kind === "demo" ? session.userId : "";
    const cached = userId ? this.offlineCache.readUser(userId)?.user : null;
    const imageUrl = session?.kind === "firebase" ? session.avatarImageDataUrl : cached?.id === userId ? AppUtils.firstImageUrl(cached.images) : "";
    return [{
      id: "navigator-avatar",
      kind: "action",
      layout: "image",
      palette: "neutral",
      imageUrl: AppUtils.mediaImageVariantUrl(imageUrl, "small"),
      icon: "schedule",
      disabled: true,
      ariaLabel: "Loading profile",
      imageAlt: "Loading profile",
      progress: { state: "loading", shape: "circle", durationMs: 3e3 }
    }];
  }, ...ngDevMode ? [{ debugName: "loadingAvatarItems" }] : (
    /* istanbul ignore next */
    []
  ));
  deploymentBranding = this.deploymentConfiguration.branding;
  constructor() {
    const initialRouteUrl = this.resolveInitialRouteUrl();
    this.i18nService.initialize();
    this.appLocationService.initialize();
    void this.deploymentConfiguration.initialize();
    void this.pwaService.initialize();
    this.syncSideMenuVisibility(initialRouteUrl);
    this.initialLandingWarmupPending = true;
    this.routeWarmupVisible = this.initialLandingWarmupPending;
    this.syncGameStartup(initialRouteUrl);
    if (this.routeWarmupVisible) {
      this.scheduleRouteWarmupWatchdog();
    }
    this.routerEventsSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.syncSideMenuVisibility(event.url);
        this.syncGameStartup(event.url);
        if (this.initialLandingWarmupPending) {
          this.showRouteWarmup();
        } else {
          this.hideRouteWarmup(0);
        }
        return;
      }
      if (event instanceof NavigationEnd) {
        this.syncSideMenuVisibility(event.urlAfterRedirects);
        this.completeInitialLandingWarmup();
        return;
      }
      if (event instanceof NavigationCancel || event instanceof NavigationError) {
        if (event instanceof NavigationCancel && (event.code === NavigationCancellationCode.Redirect || event.code === NavigationCancellationCode.SupersededByNewNavigation)) {
          return;
        }
        this.completeInitialLandingWarmup(0);
      }
    });
  }
  ngOnDestroy() {
    this.clearRouteWarmupHideTimer();
    this.clearRouteWarmupWatchdogTimer();
    this.clearMobileResumeRecoveryTimer();
    this.routerEventsSubscription.unsubscribe();
  }
  onPageShow() {
    this.scheduleMobileResumeRecovery();
  }
  onWindowFocus() {
    this.scheduleMobileResumeRecovery();
  }
  onDocumentVisibilityChange() {
    this.scheduleMobileResumeRecovery();
  }
  onDocumentPointerDown(event) {
    this.showActionWave(event);
  }
  syncSideMenuVisibility(url) {
    this.showSideMenu = this.shouldShowSideMenu(url);
    this.changeDetectorRef.markForCheck();
    if (this.showSideMenu) {
      void this.ensureSideMenuComponentLoaded();
    }
  }
  async ensureSideMenuComponentLoaded() {
    if (this.sideMenuComponentRef()) {
      return;
    }
    if (this.sideMenuComponentLoadPromise) {
      return this.sideMenuComponentLoadPromise;
    }
    this.sideMenuComponentLoadPromise = import("./side-menu.component-L3MKJGH4.js").then((module) => {
      this.sideMenuComponentRef.set(module.SideMenuComponent);
    }).finally(() => {
      this.sideMenuComponentLoadPromise = null;
    });
    return this.sideMenuComponentLoadPromise;
  }
  showActionWave(event) {
    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest(_App.ACTION_WAVE_TARGET_SELECTOR);
    if (!button || button.disabled || button.getAttribute("aria-disabled") === "true") {
      return;
    }
    if (button.querySelector(".navigator-action-ripple, .mat-ripple, .mat-mdc-button-persistent-ripple")) {
      return;
    }
    const surface = button.querySelector('[data-action-wave-surface="true"]') ?? button;
    const rect = surface.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }
    const size = Math.max(rect.width, rect.height) * 2.4;
    const ripple = document.createElement("span");
    ripple.className = "app-global-action-wave";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    surface.appendChild(ripple);
    setTimeout(() => ripple.remove(), _App.ACTION_WAVE_DURATION_MS);
  }
  shouldShowSideMenu(url) {
    const normalizedPath = (url || "/").split("?")[0].trim() || "/";
    return normalizedPath !== "/" && !normalizedPath.startsWith("/entry") && !normalizedPath.startsWith("/admin/help");
  }
  onRouteActivated() {
    this.completeInitialLandingWarmup(0);
  }
  syncGameStartup(url) {
    const path = url.split(/[?#]/)[0].replace(/\/$/, "") || "/";
    const session = this.sessionService.currentSession();
    this.gameStartupVisible = this.initialLandingWarmupPending && Boolean(session && session.kind !== "operator-bootstrap") && (path === "/" || path === "/game" || path === "/home");
  }
  completeWarmupIfNavigationSettled() {
    if (this.routeWarmupVisible && this.router.navigated && !this.router.getCurrentNavigation()) {
      this.completeInitialLandingWarmup();
    }
  }
  showRouteWarmup() {
    this.clearRouteWarmupHideTimer();
    this.routeWarmupVisible = true;
    this.scheduleRouteWarmupWatchdog();
  }
  completeInitialLandingWarmup(delayMs = 120) {
    this.initialLandingWarmupPending = false;
    this.gameStartupVisible = false;
    this.hideRouteWarmup(delayMs);
  }
  hideRouteWarmup(delayMs = 120) {
    this.clearRouteWarmupHideTimer();
    this.clearRouteWarmupWatchdogTimer();
    if (delayMs <= 0) {
      this.routeWarmupVisible = false;
      this.changeDetectorRef.detectChanges();
      return;
    }
    this.routeWarmupHideTimer = setTimeout(() => {
      this.routeWarmupVisible = false;
      this.routeWarmupHideTimer = null;
      this.changeDetectorRef.detectChanges();
    }, delayMs);
  }
  clearRouteWarmupHideTimer() {
    if (!this.routeWarmupHideTimer) {
      return;
    }
    clearTimeout(this.routeWarmupHideTimer);
    this.routeWarmupHideTimer = null;
  }
  scheduleRouteWarmupWatchdog() {
    this.clearRouteWarmupWatchdogTimer();
    this.routeWarmupWatchdogTimer = setTimeout(() => {
      this.routeWarmupWatchdogTimer = null;
      this.completeWarmupIfNavigationSettled();
    }, _App.ROUTE_WARMUP_WATCHDOG_DELAY_MS);
  }
  clearRouteWarmupWatchdogTimer() {
    if (!this.routeWarmupWatchdogTimer) {
      return;
    }
    clearTimeout(this.routeWarmupWatchdogTimer);
    this.routeWarmupWatchdogTimer = null;
  }
  scheduleMobileResumeRecovery() {
    if (typeof document !== "undefined" && document.visibilityState === "hidden") {
      return;
    }
    this.clearMobileResumeRecoveryTimer();
    this.mobileResumeRecoveryTimer = setTimeout(() => {
      this.mobileResumeRecoveryTimer = null;
      this.recoverAfterMobileResume();
    }, _App.MOBILE_RESUME_RECOVERY_DELAY_MS);
  }
  recoverAfterMobileResume() {
    if (typeof document !== "undefined" && document.visibilityState === "hidden") {
      return;
    }
    this.syncSideMenuVisibility(this.resolveInitialRouteUrl());
    this.completeWarmupIfNavigationSettled();
  }
  clearMobileResumeRecoveryTimer() {
    if (!this.mobileResumeRecoveryTimer) {
      return;
    }
    clearTimeout(this.mobileResumeRecoveryTimer);
    this.mobileResumeRecoveryTimer = null;
  }
  resolveInitialRouteUrl() {
    if (typeof window === "undefined") {
      return this.router.url || "/";
    }
    const routePath = this.stripBasePath(window.location.pathname || "/");
    return `${routePath}${window.location.search}${window.location.hash}` || "/";
  }
  stripBasePath(pathname) {
    const normalizedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;
    const baseHref = document.querySelector("base")?.getAttribute("href") ?? "/";
    try {
      const basePath = new URL(baseHref, window.location.origin).pathname;
      if (basePath !== "/" && normalizedPathname.startsWith(basePath)) {
        return `/${normalizedPathname.slice(basePath.length)}`.replace("//", "/") || "/";
      }
    } catch {
      return normalizedPathname;
    }
    return normalizedPathname;
  }
  static \u0275fac = function App_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _App)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _App, selectors: [["app-root"]], hostBindings: function App_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("pageshow", function App_pageshow_HostBindingHandler() {
        return ctx.onPageShow();
      }, \u0275\u0275resolveWindow)("focus", function App_focus_HostBindingHandler() {
        return ctx.onWindowFocus();
      }, \u0275\u0275resolveWindow)("visibilitychange", function App_visibilitychange_HostBindingHandler() {
        return ctx.onDocumentVisibilityChange();
      }, \u0275\u0275resolveDocument)("pointerdown", function App_pointerdown_HostBindingHandler($event) {
        return ctx.onDocumentPointerDown($event);
      }, \u0275\u0275resolveDocument);
    }
  }, decls: 10, vars: 14, consts: [[1, "main"], [1, "content"], [1, "content-area"], ["aria-busy", "true", 1, "game-page", "game-startup"], [3, "activate"], ["kind", "inline", "layout", "row", 1, "game-startup-avatar", "user-selector-menu", 3, "items"], ["role", "status", "aria-live", "polite", 1, "app-route-warmup"], [3, "branding"], [4, "ngComponentOutlet"], [1, "app-route-warmup__mark"], ["aria-hidden", "true", 1, "app-route-warmup__ring"], ["alt", "", 3, "src"], [1, "app-route-warmup__label"]], template: function App_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "main", 0)(1, "div", 1)(2, "section", 2);
      \u0275\u0275conditionalCreate(3, App_Conditional_3_Template, 2, 1, "div", 3);
      \u0275\u0275elementStart(4, "router-outlet", 4);
      \u0275\u0275listener("activate", function App_Template_router_outlet_activate_4_listener() {
        return ctx.onRouteActivated();
      });
      \u0275\u0275elementEnd()()()();
      \u0275\u0275conditionalCreate(5, App_Conditional_5_Template, 1, 1);
      \u0275\u0275conditionalCreate(6, App_Conditional_6_Template, 1, 1, "app-menu", 5);
      \u0275\u0275element(7, "app-setup-popup")(8, "app-payment-authorization-popup");
      \u0275\u0275conditionalCreate(9, App_Conditional_9_Template, 6, 3, "section", 6);
    }
    if (rf & 2) {
      \u0275\u0275classProp("main-public", !ctx.showSideMenu && !ctx.gameStartupVisible);
      \u0275\u0275advance();
      \u0275\u0275classProp("content-single", ctx.showSideMenu || ctx.gameStartupVisible)("content-public", !ctx.showSideMenu && !ctx.gameStartupVisible);
      \u0275\u0275advance();
      \u0275\u0275classProp("content-area-full", ctx.showSideMenu || ctx.gameStartupVisible)("content-area-public", !ctx.showSideMenu && !ctx.gameStartupVisible);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.gameStartupVisible ? 3 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.showSideMenu && !ctx.gameStartupVisible ? 5 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.gameStartupVisible || ctx.showSideMenu && !ctx.sideMenuComponent() ? 6 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.routeWarmupVisible && !ctx.gameStartupVisible ? 9 : -1);
    }
  }, dependencies: [
    RouterOutlet,
    NgComponentOutlet,
    AppSetupPopupComponent,
    PaymentAuthorizationPopupComponent,
    HomeHeaderComponent,
    AppMenuComponent
  ], styles: ['\n.game-page[_ngcontent-%COMP%] {\n  width: min(1160px, 100vw - 2rem);\n  margin: 0 auto;\n  min-height: calc(100vh - 2rem);\n  display: flex;\n  flex-direction: column;\n  border: 1px solid rgba(21, 38, 62, 0.14);\n  border-radius: 18px;\n  padding: 0.9rem;\n  box-sizing: border-box;\n  background:\n    radial-gradient(\n      circle at 20% -10%,\n      var(--deployment-brand-shadow),\n      transparent 36%),\n    radial-gradient(\n      circle at 95% 0%,\n      color-mix(in srgb, var(--deployment-brand-secondary) 14%, transparent),\n      transparent 34%),\n    #f8faff;\n}\n@media (max-width: 760px) {\n  .game-page[_ngcontent-%COMP%] {\n    width: 100%;\n    min-height: 100%;\n    height: 100%;\n    max-height: 100%;\n    border-radius: 18px;\n    padding: 0.9rem;\n    box-sizing: border-box;\n    overflow: hidden;\n  }\n}\n[_nghost-%COMP%] {\n  display: block;\n  --bg-soft: #f3f6ff;\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.app-route-warmup[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 3000;\n  min-height: 100vh;\n  min-height: 100dvh;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 1rem;\n  box-sizing: border-box;\n  padding: 1.25rem;\n  background:\n    linear-gradient(\n      145deg,\n      rgba(255, 255, 255, 0.94) 0%,\n      rgba(245, 247, 253, 0.96) 46%,\n      rgba(239, 244, 255, 0.98) 100%);\n  color: #1f3a63;\n  text-align: center;\n}\n.app-route-warmup__mark[_ngcontent-%COMP%] {\n  position: relative;\n  width: 76px;\n  height: 76px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n  background: #ffffff;\n  box-shadow: 0 18px 34px rgba(36, 65, 110, 0.16);\n}\n.app-route-warmup__mark[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  width: 46px;\n  height: 46px;\n  display: block;\n  object-fit: contain;\n}\n.app-route-warmup__ring[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: -5px;\n  border-radius: inherit;\n  background:\n    conic-gradient(\n      from 40deg,\n      #4f7cff 0deg,\n      #7b5cff 120deg,\n      #ff4d8d 230deg,\n      rgba(79, 124, 255, 0.08) 310deg,\n      #4f7cff 360deg);\n  animation: _ngcontent-%COMP%_app-route-warmup-spin 0.95s linear infinite;\n}\n.app-route-warmup__ring[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  inset: 6px;\n  border-radius: inherit;\n  background: #ffffff;\n}\n.app-route-warmup__label[_ngcontent-%COMP%] {\n  color: var(--deployment-brand-text);\n  font-size: 1rem;\n  font-weight: 900;\n  letter-spacing: 0;\n}\n@keyframes _ngcontent-%COMP%_app-route-warmup-spin {\n  to {\n    transform: rotate(1turn);\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .app-route-warmup__ring[_ngcontent-%COMP%] {\n    animation-duration: 1.8s;\n  }\n}\n.main[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 100vh;\n  height: 100vh;\n  display: flex;\n  justify-content: flex-start;\n  align-items: flex-start;\n  box-sizing: inherit;\n  position: relative;\n  background:\n    radial-gradient(\n      circle at 15% 10%,\n      rgba(73, 111, 182, 0.16),\n      transparent 35%),\n    radial-gradient(\n      circle at 85% 0%,\n      rgba(80, 174, 199, 0.12),\n      transparent 32%),\n    var(--bg-soft);\n}\n.main.main-public[_ngcontent-%COMP%] {\n  height: auto;\n  min-height: 100vh;\n  background: transparent;\n}\n.content[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n  width: 100%;\n  overflow: hidden;\n  height: 100dvh;\n}\n.content.content-single[_ngcontent-%COMP%] {\n  max-width: 1260px;\n  margin: 0 auto;\n  padding: 0 0.8rem;\n}\n.content.content-public[_ngcontent-%COMP%] {\n  max-width: 1320px;\n  margin: 0 auto;\n  padding: 0;\n  min-height: 100vh;\n  height: auto;\n}\n.content-area[_ngcontent-%COMP%] {\n  top: 0;\n  flex: 1;\n  background: transparent;\n  min-height: 420px;\n  padding-top: 0.75rem;\n}\n.content-area.content-area-full[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 1180px;\n  margin: 0 auto;\n  padding: 0.9rem 0.35rem 1rem;\n}\n.content-area.content-area-public[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  margin: 0;\n  padding: 0;\n  min-height: 100vh;\n}\n@media (max-width: 760px) {\n  .content[_ngcontent-%COMP%] {\n    overflow-x: hidden;\n  }\n  .content-area[_ngcontent-%COMP%] {\n    box-sizing: border-box;\n  }\n  .content.content-single[_ngcontent-%COMP%] {\n    padding: 0 0.45rem;\n  }\n  .content.content-public[_ngcontent-%COMP%] {\n    padding: 0;\n  }\n  .content-area.content-area-full[_ngcontent-%COMP%] {\n    padding: 0.7rem 0 0.85rem;\n  }\n}\n.game-startup-avatar[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0.95rem;\n  right: 1rem;\n  z-index: 1480;\n}\n@media (max-width: 900px) {\n  .game-startup-avatar[_ngcontent-%COMP%] {\n    top: 0.7rem;\n    right: 0.7rem;\n  }\n}\n.game-startup-avatar[_ngcontent-%COMP%] {\n  --app-menu-image-button-size: 48px;\n  --app-menu-image-ring-inset: -5px;\n}\n/*# sourceMappingURL=app.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(App, [{
    type: Component,
    args: [{ selector: "app-root", imports: [
      RouterOutlet,
      NgComponentOutlet,
      AppSetupPopupComponent,
      PaymentAuthorizationPopupComponent,
      HomeHeaderComponent,
      AppMenuComponent
    ], template: `<main class="main" [class.main-public]="!showSideMenu && !gameStartupVisible">
  <div class="content" [class.content-single]="showSideMenu || gameStartupVisible" [class.content-public]="!showSideMenu && !gameStartupVisible">
    <section class="content-area" [class.content-area-full]="showSideMenu || gameStartupVisible" [class.content-area-public]="!showSideMenu && !gameStartupVisible">
      @if (gameStartupVisible) {
        <div class="game-page game-startup" aria-busy="true">
          <app-home-header [branding]="deploymentBranding()"></app-home-header>
        </div>
      }
      <router-outlet (activate)="onRouteActivated()"></router-outlet>
    </section>
  </div>
</main>

@if (showSideMenu && !gameStartupVisible) {
  @if (sideMenuComponent(); as component) {
    <ng-container *ngComponentOutlet="component"></ng-container>
  }
}

@if (gameStartupVisible || (showSideMenu && !sideMenuComponent())) {
  <app-menu class="game-startup-avatar user-selector-menu" kind="inline" layout="row"
    [items]="loadingAvatarItems()"></app-menu>
}

<app-setup-popup></app-setup-popup>

<app-payment-authorization-popup></app-payment-authorization-popup>

@if (routeWarmupVisible && !gameStartupVisible) {
  <section
    class="app-route-warmup"
    role="status"
    aria-live="polite"
    [attr.aria-label]="'Loading ' + deploymentBranding().productName"
  >
    <span class="app-route-warmup__mark">
      <span class="app-route-warmup__ring" aria-hidden="true"></span>
      @if (deploymentBranding().logoUrl; as logoUrl) {
        <img [src]="logoUrl" alt="" />
      }
    </span>
    <span class="app-route-warmup__label">{{ deploymentBranding().productName }}</span>
  </section>
}
`, styles: ['/* src/app/app.scss */\n.game-page {\n  width: min(1160px, 100vw - 2rem);\n  margin: 0 auto;\n  min-height: calc(100vh - 2rem);\n  display: flex;\n  flex-direction: column;\n  border: 1px solid rgba(21, 38, 62, 0.14);\n  border-radius: 18px;\n  padding: 0.9rem;\n  box-sizing: border-box;\n  background:\n    radial-gradient(\n      circle at 20% -10%,\n      var(--deployment-brand-shadow),\n      transparent 36%),\n    radial-gradient(\n      circle at 95% 0%,\n      color-mix(in srgb, var(--deployment-brand-secondary) 14%, transparent),\n      transparent 34%),\n    #f8faff;\n}\n@media (max-width: 760px) {\n  .game-page {\n    width: 100%;\n    min-height: 100%;\n    height: 100%;\n    max-height: 100%;\n    border-radius: 18px;\n    padding: 0.9rem;\n    box-sizing: border-box;\n    overflow: hidden;\n  }\n}\n:host {\n  display: block;\n  --bg-soft: #f3f6ff;\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.app-route-warmup {\n  position: fixed;\n  inset: 0;\n  z-index: 3000;\n  min-height: 100vh;\n  min-height: 100dvh;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 1rem;\n  box-sizing: border-box;\n  padding: 1.25rem;\n  background:\n    linear-gradient(\n      145deg,\n      rgba(255, 255, 255, 0.94) 0%,\n      rgba(245, 247, 253, 0.96) 46%,\n      rgba(239, 244, 255, 0.98) 100%);\n  color: #1f3a63;\n  text-align: center;\n}\n.app-route-warmup__mark {\n  position: relative;\n  width: 76px;\n  height: 76px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n  background: #ffffff;\n  box-shadow: 0 18px 34px rgba(36, 65, 110, 0.16);\n}\n.app-route-warmup__mark img {\n  position: relative;\n  z-index: 1;\n  width: 46px;\n  height: 46px;\n  display: block;\n  object-fit: contain;\n}\n.app-route-warmup__ring {\n  position: absolute;\n  inset: -5px;\n  border-radius: inherit;\n  background:\n    conic-gradient(\n      from 40deg,\n      #4f7cff 0deg,\n      #7b5cff 120deg,\n      #ff4d8d 230deg,\n      rgba(79, 124, 255, 0.08) 310deg,\n      #4f7cff 360deg);\n  animation: app-route-warmup-spin 0.95s linear infinite;\n}\n.app-route-warmup__ring::after {\n  content: "";\n  position: absolute;\n  inset: 6px;\n  border-radius: inherit;\n  background: #ffffff;\n}\n.app-route-warmup__label {\n  color: var(--deployment-brand-text);\n  font-size: 1rem;\n  font-weight: 900;\n  letter-spacing: 0;\n}\n@keyframes app-route-warmup-spin {\n  to {\n    transform: rotate(1turn);\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .app-route-warmup__ring {\n    animation-duration: 1.8s;\n  }\n}\n.main {\n  width: 100%;\n  min-height: 100vh;\n  height: 100vh;\n  display: flex;\n  justify-content: flex-start;\n  align-items: flex-start;\n  box-sizing: inherit;\n  position: relative;\n  background:\n    radial-gradient(\n      circle at 15% 10%,\n      rgba(73, 111, 182, 0.16),\n      transparent 35%),\n    radial-gradient(\n      circle at 85% 0%,\n      rgba(80, 174, 199, 0.12),\n      transparent 32%),\n    var(--bg-soft);\n}\n.main.main-public {\n  height: auto;\n  min-height: 100vh;\n  background: transparent;\n}\n.content {\n  display: flex;\n  gap: 1rem;\n  width: 100%;\n  overflow: hidden;\n  height: 100dvh;\n}\n.content.content-single {\n  max-width: 1260px;\n  margin: 0 auto;\n  padding: 0 0.8rem;\n}\n.content.content-public {\n  max-width: 1320px;\n  margin: 0 auto;\n  padding: 0;\n  min-height: 100vh;\n  height: auto;\n}\n.content-area {\n  top: 0;\n  flex: 1;\n  background: transparent;\n  min-height: 420px;\n  padding-top: 0.75rem;\n}\n.content-area.content-area-full {\n  width: 100%;\n  max-width: 1180px;\n  margin: 0 auto;\n  padding: 0.9rem 0.35rem 1rem;\n}\n.content-area.content-area-public {\n  width: 100%;\n  max-width: 100%;\n  margin: 0;\n  padding: 0;\n  min-height: 100vh;\n}\n@media (max-width: 760px) {\n  .content {\n    overflow-x: hidden;\n  }\n  .content-area {\n    box-sizing: border-box;\n  }\n  .content.content-single {\n    padding: 0 0.45rem;\n  }\n  .content.content-public {\n    padding: 0;\n  }\n  .content-area.content-area-full {\n    padding: 0.7rem 0 0.85rem;\n  }\n}\n.game-startup-avatar {\n  position: fixed;\n  top: 0.95rem;\n  right: 1rem;\n  z-index: 1480;\n}\n@media (max-width: 900px) {\n  .game-startup-avatar {\n    top: 0.7rem;\n    right: 0.7rem;\n  }\n}\n.game-startup-avatar {\n  --app-menu-image-button-size: 48px;\n  --app-menu-image-ring-inset: -5px;\n}\n/*# sourceMappingURL=app.css.map */\n'] }]
  }], () => [], { onPageShow: [{
    type: HostListener,
    args: ["window:pageshow"]
  }], onWindowFocus: [{
    type: HostListener,
    args: ["window:focus"]
  }], onDocumentVisibilityChange: [{
    type: HostListener,
    args: ["document:visibilitychange"]
  }], onDocumentPointerDown: [{
    type: HostListener,
    args: ["document:pointerdown", ["$event"]]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(App, { className: "App", filePath: "app/app.ts", lineNumber: 39 });
})();
export {
  App
};
//# sourceMappingURL=app-33KOSXZN.js.map
