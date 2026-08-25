import {
  DemoBootstrapSelectorStore
} from "./chunk-2VWK4OSJ.js";
import {
  MemberMenuStore
} from "./chunk-KQF6FQ63.js";
import {
  ActivatedRoute,
  Router
} from "./chunk-U46O4F4Y.js";
import {
  AdminWorkspaceDataService,
  EventsService
} from "./chunk-4AR3TCEY.js";
import {
  AssetDefaultsBuilder
} from "./chunk-BHFMDA67.js";
import {
  ASSET_TYPE_ACCOMMODATION,
  ASSET_TYPE_SUPPLIES,
  ASSET_TYPE_TRANSPORT
} from "./chunk-ILMZK7SM.js";
import {
  NgComponentOutlet
} from "./chunk-J7IJFFQ2.js";
import {
  SessionService
} from "./chunk-2ENBQWLU.js";
import {
  Component,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-XJL7SWH7.js";

// src/app/admin/components/admin-help-session-page/admin-help-session-page.component.ts
function AdminHelpSessionPageComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 0)(1, "div", 1)(2, "p");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 2)(5, "button", 3);
    \u0275\u0275listener("click", function AdminHelpSessionPageComponent_Conditional_0_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.retry());
    });
    \u0275\u0275text(6, "Try again");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 3);
    \u0275\u0275listener("click", function AdminHelpSessionPageComponent_Conditional_0_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.goAdmin());
    });
    \u0275\u0275text(8, "Admin");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.error);
  }
}
function AdminHelpSessionPageComponent_Conditional_1_Conditional_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function AdminHelpSessionPageComponent_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, AdminHelpSessionPageComponent_Conditional_1_Conditional_0_ng_container_0_Template, 1, 0, "ng-container", 4);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function AdminHelpSessionPageComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AdminHelpSessionPageComponent_Conditional_1_Conditional_0_Template, 1, 1, "ng-container");
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_1_0 = ctx_r1.demoBootstrapSelectorComponent()) ? 0 : -1, tmp_1_0);
  }
}
var AdminHelpSessionPageComponent = class _AdminHelpSessionPageComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  sessionService = inject(SessionService);
  workspaceData = inject(AdminWorkspaceDataService);
  eventsService = inject(EventsService);
  demoBootstrapSelectorStore = inject(DemoBootstrapSelectorStore);
  memberMenuStore = inject(MemberMenuStore);
  error = "";
  demoBootstrapSelector = this.demoBootstrapSelectorStore.demoBootstrapSelector;
  demoBootstrapSelectorComponent = this.demoBootstrapSelectorStore.demoBootstrapSelectorComponent;
  async ngOnInit() {
    await this.openSharedUserView();
  }
  async retry() {
    this.error = "";
    await this.openSharedUserView();
  }
  async goAdmin() {
    await this.router.navigateByUrl("/admin", { replaceUrl: true });
  }
  async openSharedUserView() {
    const token = this.resolveTokenFromRoute();
    if (!token) {
      this.fail("This support link is missing its token.");
      return;
    }
    const resolved = await this.resolveAdminHelpToken(token);
    if (!resolved || resolved.kind !== "adminHelp" || !resolved.ownerUserId?.trim()) {
      this.fail("This support link expired or is no longer available.");
      return;
    }
    const userId = resolved.ownerUserId.trim();
    const targetUrl = this.safeTargetUrl(resolved.url || resolved.entityId || "/game");
    this.openSharedUserSelector(userId, targetUrl);
  }
  resolveTokenFromRoute() {
    const rawToken = `${this.route.snapshot.paramMap.get("token") ?? ""}`.trim();
    try {
      return decodeURIComponent(rawToken);
    } catch {
      return rawToken;
    }
  }
  safeTargetUrl(value) {
    const normalized = `${value ?? ""}`.trim();
    if (!normalized || normalized.startsWith("http:") || normalized.startsWith("https:") || normalized.startsWith("//")) {
      return "/game";
    }
    return normalized.startsWith("/") ? normalized : `/${normalized}`;
  }
  async resolveAdminHelpToken(token) {
    return await this.workspaceData.resolveAdminHelpToken(token);
  }
  openSharedUserSelector(userId, targetUrl) {
    this.demoBootstrapSelectorStore.openDemoBootstrapSelector({
      mode: "member",
      title: "select.demo.user",
      subtitle: "demo.user.selector.perspective.subtitle",
      autoSelectUserId: userId,
      onSelect: (selectedUserId) => this.openSelectedSharedUser(selectedUserId, targetUrl),
      onClose: () => {
        void this.goAdmin();
      }
    });
  }
  openSelectedSharedUser(userId, targetUrl) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId || !this.sessionService.startDemoSession(normalizedUserId, {
      supportContext: {
        kind: "admin-support",
        targetUrl: this.safeTargetUrl(targetUrl)
      }
    })) {
      return false;
    }
    void this.navigateToSharedTargetAfterSelectorClose(normalizedUserId, targetUrl);
    return true;
  }
  async navigateToSharedTargetAfterSelectorClose(userId, targetUrl) {
    await this.waitForDemoSelectorClose();
    await this.router.navigateByUrl(await this.queueSharedSupportTarget(userId, targetUrl), { replaceUrl: true });
  }
  fail(message) {
    this.demoBootstrapSelectorStore.closeDemoBootstrapSelector();
    this.error = message;
  }
  waitForDemoSelectorClose() {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
        window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve()));
        return;
      }
      setTimeout(resolve, 0);
    });
  }
  async queueSharedSupportTarget(userId, targetUrl) {
    const normalized = this.safeTargetUrl(targetUrl);
    const parsed = this.parseRelativeUrl(normalized);
    if (!parsed) {
      return normalized;
    }
    const supportTarget = `${parsed.searchParams.get("supportTarget") ?? ""}`.trim();
    if (supportTarget === "service-chat" || supportTarget === "chats" || supportTarget === "chat-message") {
      this.memberMenuStore.openNavigatorActivitiesRequest("chats");
    } else if (supportTarget === "member") {
      const ownerId = `${parsed.searchParams.get("ownerId") ?? ""}`.trim();
      if (ownerId) {
        this.memberMenuStore.requestActivitiesNavigation({
          type: "members",
          ownerId,
          ownerType: "event",
          viewOnly: true,
          canManage: false,
          subtitle: "Reported member context"
        });
      } else {
        this.memberMenuStore.openNavigatorActivitiesRequest("events");
      }
    } else if (supportTarget === "event") {
      const eventId = `${parsed.searchParams.get("eventId") ?? ""}`.trim();
      const eventRecord = eventId ? await this.eventsService.queryKnownRecordById(userId, eventId) : null;
      if (eventRecord) {
        this.memberMenuStore.requestActivitiesNavigation({
          type: "eventEditor",
          eventId: eventRecord.id,
          target: eventRecord.type === "hosting" || eventRecord.creatorUserId === userId ? "hosting" : "events",
          readOnly: true
        });
      } else {
        this.memberMenuStore.openNavigatorActivitiesRequest("events");
      }
    } else if (supportTarget === "events") {
      this.memberMenuStore.openNavigatorActivitiesRequest("events");
    } else if (supportTarget === "rates") {
      this.memberMenuStore.openNavigatorActivitiesRequest("rates");
    } else if (supportTarget === "asset") {
      const assetFilter = this.toAssetFilter(parsed.searchParams.get("assetFilter"));
      if (assetFilter) {
        const assetId = `${parsed.searchParams.get("assetId") ?? ""}`.trim();
        this.memberMenuStore.requestActivitiesNavigation({
          type: "assetExplore",
          assetType: assetFilter,
          assetId: assetId || void 0,
          viewOnly: Boolean(assetId),
          fallbackAsset: this.buildSupportFallbackAsset(assetFilter, parsed)
        });
      }
    }
    return parsed.pathname || "/game";
  }
  buildSupportFallbackAsset(assetType, parsed) {
    const assetId = `${parsed.searchParams.get("assetId") ?? ""}`.trim();
    if (!assetId) {
      return void 0;
    }
    const title = `${parsed.searchParams.get("assetTitle") ?? ""}`.trim() || "Shared asset";
    const subtitle = `${parsed.searchParams.get("assetSubtitle") ?? ""}`.trim();
    const city = `${parsed.searchParams.get("assetCity") ?? ""}`.trim();
    const details = `${parsed.searchParams.get("assetDetails") ?? ""}`.trim();
    const category = AssetDefaultsBuilder.normalizeCategory(assetType, `${parsed.searchParams.get("assetCategory") ?? ""}`.trim());
    const imageUrl = this.safeImageUrl(parsed.searchParams.get("assetPreview")) || this.defaultSupportAssetImage(assetType, assetId || title);
    return {
      id: assetId,
      type: assetType,
      title,
      subtitle,
      category,
      city: city || this.defaultSupportAssetCity(assetType),
      capacityTotal: this.positiveIntegerParam(parsed, "assetCapacity") || (assetType === ASSET_TYPE_SUPPLIES ? 4 : 1),
      quantity: this.positiveIntegerParam(parsed, "assetQuantity") || (assetType === ASSET_TYPE_SUPPLIES ? 4 : 1),
      description: details || subtitle || title,
      imageUrl,
      visibility: "Public",
      ownerUserId: "",
      requests: []
    };
  }
  positiveIntegerParam(parsed, key) {
    return Math.max(0, Math.trunc(Number(parsed.searchParams.get(key)) || 0));
  }
  defaultSupportAssetCity(assetType) {
    return assetType === ASSET_TYPE_SUPPLIES ? "Austin" : "";
  }
  defaultSupportAssetImage(assetType, seed) {
    const flavor = assetType === ASSET_TYPE_TRANSPORT ? "transport" : assetType === ASSET_TYPE_ACCOMMODATION ? "property" : "gear";
    const normalizedSeed = encodeURIComponent(`${assetType.toLowerCase()}-${flavor}-${seed || assetType.toLowerCase()}`);
    return `https://picsum.photos/seed/${normalizedSeed}/1200/700`;
  }
  safeImageUrl(value) {
    const normalized = `${value ?? ""}`.trim();
    if (!normalized) {
      return "";
    }
    return normalized.startsWith("http://") || normalized.startsWith("https://") || normalized.startsWith("/") ? normalized : "";
  }
  parseRelativeUrl(value) {
    try {
      const origin = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "http://localhost";
      return new URL(value, origin);
    } catch {
      return null;
    }
  }
  toAssetFilter(value) {
    switch (`${value ?? ""}`.trim()) {
      case ASSET_TYPE_TRANSPORT:
        return ASSET_TYPE_TRANSPORT;
      case ASSET_TYPE_ACCOMMODATION:
        return ASSET_TYPE_ACCOMMODATION;
      case ASSET_TYPE_SUPPLIES:
        return ASSET_TYPE_SUPPLIES;
      default:
        return null;
    }
  }
  static \u0275fac = function AdminHelpSessionPageComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminHelpSessionPageComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminHelpSessionPageComponent, selectors: [["app-admin-help-session-page"]], decls: 2, vars: 2, consts: [["role", "alert", 1, "admin-help-session-error"], [1, "admin-help-session-error__panel"], [1, "admin-help-session-error__actions"], ["type", "button", 3, "click"], [4, "ngComponentOutlet"]], template: function AdminHelpSessionPageComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, AdminHelpSessionPageComponent_Conditional_0_Template, 9, 1, "section", 0);
      \u0275\u0275conditionalCreate(1, AdminHelpSessionPageComponent_Conditional_1_Template, 1, 1);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.error ? 0 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.demoBootstrapSelector() ? 1 : -1);
    }
  }, dependencies: [NgComponentOutlet], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  min-height: 100vh;\n  background: #eef3fb;\n}\n.admin-help-session-error[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  display: grid;\n  place-items: center;\n  padding: 24px;\n}\n.admin-help-session-error__panel[_ngcontent-%COMP%] {\n  width: min(420px, 100%);\n  padding: 20px;\n  border: 1px solid rgba(86, 112, 150, 0.22);\n  border-radius: 8px;\n  background: #fff;\n  color: #243145;\n  box-shadow: 0 18px 48px rgba(36, 49, 69, 0.12);\n}\n.admin-help-session-error__actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  flex-wrap: wrap;\n  margin-top: 16px;\n}\n.admin-help-session-error__actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  min-height: 36px;\n  padding: 0 14px;\n  border: 1px solid rgba(86, 112, 150, 0.24);\n  border-radius: 8px;\n  background: #f7f9fc;\n  color: #243145;\n  cursor: pointer;\n}\n/*# sourceMappingURL=admin-help-session-page.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminHelpSessionPageComponent, [{
    type: Component,
    args: [{ selector: "app-admin-help-session-page", standalone: true, imports: [NgComponentOutlet], template: '@if (error) {\n  <section class="admin-help-session-error" role="alert">\n    <div class="admin-help-session-error__panel">\n      <p>{{ error }}</p>\n      <div class="admin-help-session-error__actions">\n        <button type="button" (click)="retry()">Try again</button>\n        <button type="button" (click)="goAdmin()">Admin</button>\n      </div>\n    </div>\n  </section>\n}\n\n@if (demoBootstrapSelector()) {\n  @if (demoBootstrapSelectorComponent(); as component) {\n    <ng-container *ngComponentOutlet="component"></ng-container>\n  }\n}\n', styles: ["/* src/app/admin/components/admin-help-session-page/admin-help-session-page.component.scss */\n:host {\n  display: block;\n  min-height: 100vh;\n  background: #eef3fb;\n}\n.admin-help-session-error {\n  min-height: 100vh;\n  display: grid;\n  place-items: center;\n  padding: 24px;\n}\n.admin-help-session-error__panel {\n  width: min(420px, 100%);\n  padding: 20px;\n  border: 1px solid rgba(86, 112, 150, 0.22);\n  border-radius: 8px;\n  background: #fff;\n  color: #243145;\n  box-shadow: 0 18px 48px rgba(36, 49, 69, 0.12);\n}\n.admin-help-session-error__actions {\n  display: flex;\n  gap: 10px;\n  flex-wrap: wrap;\n  margin-top: 16px;\n}\n.admin-help-session-error__actions button {\n  min-height: 36px;\n  padding: 0 14px;\n  border: 1px solid rgba(86, 112, 150, 0.24);\n  border-radius: 8px;\n  background: #f7f9fc;\n  color: #243145;\n  cursor: pointer;\n}\n/*# sourceMappingURL=admin-help-session-page.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminHelpSessionPageComponent, { className: "AdminHelpSessionPageComponent", filePath: "app/admin/components/admin-help-session-page/admin-help-session-page.component.ts", lineNumber: 40 });
})();

export {
  AdminHelpSessionPageComponent
};
//# sourceMappingURL=chunk-IXSAOEMA.js.map
