import {
  AdminHelpSessionPageComponent
} from "./chunk-VGZQQI5U.js";
import {
  DialogComponent
} from "./chunk-EFOSAJ7V.js";
import {
  DemoBootstrapSelectorStore
} from "./chunk-PA3YBM43.js";
import "./chunk-KQF6FQ63.js";
import {
  DeploymentBrandComponent
} from "./chunk-QNXIGSHX.js";
import {
  MatRipple,
  MatRippleModule
} from "./chunk-VEYRCVMX.js";
import "./chunk-QD6QQNQX.js";
import "./chunk-6TR3Z2F3.js";
import {
  Router,
  RouterModule
} from "./chunk-U46O4F4Y.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-EDHGCWPF.js";
import "./chunk-CUDLB52K.js";
import {
  AdminWorkspaceStore
} from "./chunk-NJTJOLRZ.js";
import {
  AdminMenuStore
} from "./chunk-ZJ74HL3J.js";
import {
  HelpCenterService
} from "./chunk-C2QYRRDX.js";
import {
  AdminWorkspaceDataService
} from "./chunk-Y3NEBFNQ.js";
import {
  DeploymentConfigurationService
} from "./chunk-PB4YNHSN.js";
import "./chunk-VUN7WUNQ.js";
import "./chunk-5PHTFUHA.js";
import "./chunk-Y2Y4ZDHH.js";
import "./chunk-B7YPVC5F.js";
import "./chunk-XQ4NDAVX.js";
import "./chunk-4FWVIYNI.js";
import "./chunk-MS7VTGLY.js";
import {
  CommonModule,
  NgComponentOutlet
} from "./chunk-J7IJFFQ2.js";
import "./chunk-XQACYBVS.js";
import "./chunk-2IE5VYAT.js";
import "./chunk-B2DKYQGD.js";
import "./chunk-INZQPXQM.js";
import "./chunk-IECLTXM5.js";
import {
  SessionService
} from "./chunk-333NTD7D.js";
import "./chunk-LERGHE7K.js";
import "./chunk-D6ZHKNYF.js";
import "./chunk-SKAK727J.js";
import {
  Component,
  DOCUMENT,
  HostListener,
  NgModule,
  effect,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-XJL7SWH7.js";

// src/app/admin/components/admin-page/admin-page.component.ts
function AdminPageComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 0)(1, "div", 3)(2, "header", 4)(3, "a", 5);
    \u0275\u0275element(4, "app-deployment-brand", 6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "section", 7)(6, "p", 8);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "h1");
    \u0275\u0275text(9, "Moderation workspace");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 9);
    \u0275\u0275text(11, "Review reported users, support chats, and application feedback with the same app tools.");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275attribute("aria-label", ctx_r0.deploymentBranding().productName + " admin");
    \u0275\u0275advance();
    \u0275\u0275property("branding", ctx_r0.deploymentBranding());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", ctx_r0.deploymentBranding().productName, " admin");
  }
}
function AdminPageComponent_Conditional_1_Conditional_12_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function AdminPageComponent_Conditional_1_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, AdminPageComponent_Conditional_1_Conditional_12_ng_container_0_Template, 1, 0, "ng-container", 10);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function AdminPageComponent_Conditional_1_Conditional_13_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function AdminPageComponent_Conditional_1_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, AdminPageComponent_Conditional_1_Conditional_13_ng_container_0_Template, 1, 0, "ng-container", 10);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function AdminPageComponent_Conditional_1_Conditional_14_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function AdminPageComponent_Conditional_1_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, AdminPageComponent_Conditional_1_Conditional_14_ng_container_0_Template, 1, 0, "ng-container", 10);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function AdminPageComponent_Conditional_1_Conditional_15_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function AdminPageComponent_Conditional_1_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, AdminPageComponent_Conditional_1_Conditional_15_ng_container_0_Template, 1, 0, "ng-container", 10);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function AdminPageComponent_Conditional_1_Conditional_16_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function AdminPageComponent_Conditional_1_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, AdminPageComponent_Conditional_1_Conditional_16_ng_container_0_Template, 1, 0, "ng-container", 10);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function AdminPageComponent_Conditional_1_Conditional_17_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function AdminPageComponent_Conditional_1_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, AdminPageComponent_Conditional_1_Conditional_17_ng_container_0_Template, 1, 0, "ng-container", 10);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function AdminPageComponent_Conditional_1_Conditional_18_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function AdminPageComponent_Conditional_1_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, AdminPageComponent_Conditional_1_Conditional_18_ng_container_0_Template, 1, 0, "ng-container", 10);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function AdminPageComponent_Conditional_1_Conditional_19_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function AdminPageComponent_Conditional_1_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, AdminPageComponent_Conditional_1_Conditional_19_ng_container_0_Template, 1, 0, "ng-container", 10);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function AdminPageComponent_Conditional_1_Conditional_20_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function AdminPageComponent_Conditional_1_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, AdminPageComponent_Conditional_1_Conditional_20_ng_container_0_Template, 1, 0, "ng-container", 10);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function AdminPageComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 1)(1, "div", 3)(2, "header", 4)(3, "a", 5);
    \u0275\u0275element(4, "app-deployment-brand", 6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "section", 7)(6, "p", 8);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "h1");
    \u0275\u0275text(9, "Moderation workspace");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 9);
    \u0275\u0275text(11, "Review reported users, support chats, and application feedback with the same app tools.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(12, AdminPageComponent_Conditional_1_Conditional_12_Template, 1, 1, "ng-container");
    \u0275\u0275conditionalCreate(13, AdminPageComponent_Conditional_1_Conditional_13_Template, 1, 1, "ng-container");
    \u0275\u0275conditionalCreate(14, AdminPageComponent_Conditional_1_Conditional_14_Template, 1, 1, "ng-container");
    \u0275\u0275conditionalCreate(15, AdminPageComponent_Conditional_1_Conditional_15_Template, 1, 1, "ng-container");
    \u0275\u0275conditionalCreate(16, AdminPageComponent_Conditional_1_Conditional_16_Template, 1, 1, "ng-container");
    \u0275\u0275conditionalCreate(17, AdminPageComponent_Conditional_1_Conditional_17_Template, 1, 1, "ng-container");
    \u0275\u0275conditionalCreate(18, AdminPageComponent_Conditional_1_Conditional_18_Template, 1, 1, "ng-container");
    \u0275\u0275conditionalCreate(19, AdminPageComponent_Conditional_1_Conditional_19_Template, 1, 1, "ng-container");
    \u0275\u0275conditionalCreate(20, AdminPageComponent_Conditional_1_Conditional_20_Template, 1, 1, "ng-container");
    \u0275\u0275element(21, "app-dialog");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_5_0;
    let tmp_6_0;
    let tmp_7_0;
    let tmp_8_0;
    let tmp_9_0;
    let tmp_10_0;
    let tmp_11_0;
    let tmp_12_0;
    let tmp_13_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275attribute("aria-label", ctx_r0.deploymentBranding().productName + " admin");
    \u0275\u0275advance();
    \u0275\u0275property("branding", ctx_r0.deploymentBranding());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", ctx_r0.deploymentBranding().productName, " admin");
    \u0275\u0275advance(5);
    \u0275\u0275conditional((tmp_5_0 = ctx_r0.reportsPopupComponent()) ? 12 : -1, tmp_5_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_6_0 = ctx_r0.feedbackPopupComponent()) ? 13 : -1, tmp_6_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_7_0 = ctx_r0.helpEditorPopupComponent()) ? 14 : -1, tmp_7_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_8_0 = ctx_r0.ideaEditorPopupComponent()) ? 15 : -1, tmp_8_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_9_0 = ctx_r0.notificationsPopupComponent()) ? 16 : -1, tmp_9_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_10_0 = ctx_r0.paramsPopupComponent()) ? 17 : -1, tmp_10_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_11_0 = ctx_r0.statsPopupComponent()) ? 18 : -1, tmp_11_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_12_0 = ctx_r0.affinityGraphPopupComponent()) ? 19 : -1, tmp_12_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_13_0 = ctx_r0.monitoringPopupComponent()) ? 20 : -1, tmp_13_0);
  }
}
function AdminPageComponent_Conditional_2_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.workspace.error());
  }
}
function AdminPageComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 2)(1, "div", 11)(2, "header", 12)(3, "a", 5);
    \u0275\u0275element(4, "app-deployment-brand", 6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 13);
    \u0275\u0275listener("click", function AdminPageComponent_Conditional_2_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.requestAdminLogin());
    });
    \u0275\u0275elementStart(6, "mat-icon");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span");
    \u0275\u0275text(9, "Admin login");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "section", 14)(11, "p", 8);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "h1");
    \u0275\u0275text(14, "Moderation workspace");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "p", 9);
    \u0275\u0275text(16, "Review reported users, support chats, and application feedback with the same app tools.");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(17, AdminPageComponent_Conditional_2_Conditional_17_Template, 2, 1, "p", 15);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275attribute("aria-label", ctx_r0.deploymentBranding().productName + " admin landing");
    \u0275\u0275advance();
    \u0275\u0275property("branding", ctx_r0.deploymentBranding());
    \u0275\u0275advance();
    \u0275\u0275property("matRippleColor", "rgba(255, 255, 255, 0.2)");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.isFirebaseAdminMode ? "login" : "group");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", ctx_r0.deploymentBranding().productName, " admin");
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r0.workspace.error() ? 17 : -1);
  }
}
function AdminPageComponent_Conditional_3_Conditional_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function AdminPageComponent_Conditional_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, AdminPageComponent_Conditional_3_Conditional_0_ng_container_0_Template, 1, 0, "ng-container", 10);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function AdminPageComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AdminPageComponent_Conditional_3_Conditional_0_Template, 1, 1, "ng-container");
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_1_0 = ctx_r0.demoBootstrapSelectorComponent()) ? 0 : -1, tmp_1_0);
  }
}
var AdminPageComponent = class _AdminPageComponent {
  deploymentBranding = inject(DeploymentConfigurationService).branding;
  workspace = inject(AdminWorkspaceStore);
  adminMenu = inject(AdminMenuStore);
  sessionService = inject(SessionService);
  workspaceData = inject(AdminWorkspaceDataService);
  helpCenter = inject(HelpCenterService);
  document = inject(DOCUMENT);
  router = inject(Router);
  demoBootstrapSelectorStore = inject(DemoBootstrapSelectorStore);
  reportsPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "reportsPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  feedbackPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "feedbackPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  helpEditorPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "helpEditorPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  ideaEditorPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "ideaEditorPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  notificationsPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "notificationsPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  paramsPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "paramsPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  statsPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "statsPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  affinityGraphPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "affinityGraphPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  monitoringPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "monitoringPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  restoringWorkspace = signal(this.currentRouteIsAdminShell(), ...ngDevMode ? [{ debugName: "restoringWorkspace" }] : (
    /* istanbul ignore next */
    []
  ));
  reportsPopupComponent = this.reportsPopupComponentRef.asReadonly();
  feedbackPopupComponent = this.feedbackPopupComponentRef.asReadonly();
  helpEditorPopupComponent = this.helpEditorPopupComponentRef.asReadonly();
  ideaEditorPopupComponent = this.ideaEditorPopupComponentRef.asReadonly();
  notificationsPopupComponent = this.notificationsPopupComponentRef.asReadonly();
  paramsPopupComponent = this.paramsPopupComponentRef.asReadonly();
  statsPopupComponent = this.statsPopupComponentRef.asReadonly();
  affinityGraphPopupComponent = this.affinityGraphPopupComponentRef.asReadonly();
  monitoringPopupComponent = this.monitoringPopupComponentRef.asReadonly();
  demoBootstrapSelector = this.demoBootstrapSelectorStore.demoBootstrapSelector;
  demoBootstrapSelectorComponent = this.demoBootstrapSelectorStore.demoBootstrapSelectorComponent;
  constructor() {
    this.document.documentElement.classList.add("admin-document-no-scroll");
    this.document.body.classList.add("admin-document-no-scroll");
    effect(() => {
      switch (this.adminMenu.activePopup()) {
        case "reports":
          void this.ensureReportsPopupLoaded();
          break;
        case "feedback":
          void this.ensureFeedbackPopupLoaded();
          break;
        case "help-editor":
          void this.ensureHelpEditorPopupLoaded();
          break;
        case "idea-editor":
          void this.ensureIdeaEditorPopupLoaded();
          break;
        case "notifications":
          void this.ensureNotificationsPopupLoaded();
          break;
        case "params":
          void this.ensureParamsPopupLoaded();
          break;
        case "stats":
          void this.ensureStatsPopupLoaded();
          break;
        case "affinity-graph":
          void this.ensureAffinityGraphPopupLoaded();
          break;
        case "monitoring":
          void this.ensureMonitoringPopupLoaded();
          break;
      }
    });
  }
  async ngOnInit() {
    if (!this.workspace.dashboard()) {
      const session = await this.sessionService.ensureSession();
      if (session) {
        this.restoringWorkspace.set(true);
        const dashboard = await this.bootstrapAdmin(session.kind === "demo" ? session.userId : void 0);
        this.restoringWorkspace.set(false);
        if (dashboard) {
          return;
        }
      }
    }
    if (!this.isAdminShellRoute() || this.workspace.dashboard()) {
      this.restoringWorkspace.set(false);
      return;
    }
    this.restoringWorkspace.set(true);
    const restored = await this.restoreAdminSession();
    this.restoringWorkspace.set(false);
    if (!restored) {
      await this.router.navigate(["/entry"], {
        queryParams: { redirect: this.router.url },
        replaceUrl: true
      });
    }
  }
  ngOnDestroy() {
    this.document.documentElement.classList.remove("admin-document-no-scroll");
    this.document.body.classList.remove("admin-document-no-scroll");
  }
  async requestAdminLogin() {
    if (!this.isFirebaseAdminMode) {
      this.openAdminSelector();
      return;
    }
    const session = await this.sessionService.startFirebaseSession();
    if (!session) {
      return;
    }
    const dashboard = await this.bootstrapAdmin();
    if (dashboard) {
      await this.router.navigateByUrl("/admin", { replaceUrl: true });
      return;
    }
    if (this.workspace.accessDenied()) {
      await this.router.navigateByUrl("/admin", { replaceUrl: true });
    }
  }
  get isFirebaseAdminMode() {
    return this.workspaceData.isFirebaseAdminMode;
  }
  prepareSelectedAdminSession(adminUserId) {
    const normalizedAdminUserId = this.workspace.prepareSelectedAdminSession(adminUserId);
    if (!normalizedAdminUserId) {
      return;
    }
    this.workspaceData.prepareSelectedAdminSession(normalizedAdminUserId);
  }
  async restoreAdminSession() {
    const adminId = this.workspace.readStoredAdminId();
    if (!adminId) {
      return false;
    }
    try {
      const session = await this.sessionService.ensureSession();
      if (!session) {
        this.clearAdminSession();
        return false;
      }
      if (session.kind === "demo" && session.userId.trim() !== adminId) {
        this.clearAdminSession();
        return false;
      }
      this.prepareSelectedAdminSession(adminId);
      return Boolean(await this.bootstrapAdmin(session.kind === "demo" ? session.userId : void 0));
    } catch {
      this.clearAdminSession();
      return false;
    }
  }
  async bootstrapAdmin(adminUserId, onProgress) {
    if (this.workspace.busy()) {
      return this.workspace.dashboard();
    }
    this.workspace.setBusy(true);
    this.workspace.clearError();
    this.workspace.setAccessDenied(false);
    try {
      const dashboard = this.workspace.applyDashboard(await this.workspaceData.loadDashboard(adminUserId, onProgress));
      await this.refreshAdminMenuCountersFromUserRecord(dashboard.activeAdmin.id);
      void this.helpCenter.preloadAll();
      this.workspace.persistAdminSession(dashboard.activeAdmin.id);
      return dashboard;
    } catch (error) {
      if (this.workspace.isAdminAccessDenied(error)) {
        this.handleAdminAccessDenied();
        return null;
      }
      this.workspace.setError(this.workspace.adminErrorMessage(error));
      return null;
    } finally {
      this.workspace.setBusy(false);
    }
  }
  clearAdminSession() {
    this.workspace.clearAdminSessionState();
  }
  handleAdminAccessDenied() {
    const session = this.sessionService.currentSession();
    this.workspace.handleAdminAccessDeniedState(session?.kind === "firebase" ? session.profile.id.trim() : "");
  }
  async refreshAdminMenuCountersFromUserRecord(adminUserId) {
    try {
      const counters = await this.workspaceData.loadDashboardMenuCounters(adminUserId);
      if (counters) {
        this.workspace.applyAdminMenuCounters(adminUserId, counters);
      }
    } catch {
    }
  }
  openAdminSelector() {
    this.demoBootstrapSelectorStore.openDemoBootstrapSelector({
      mode: "admin",
      title: "select.admin.user",
      subtitle: "demo.admin.selector.subtitle",
      onSelect: (adminUserId) => this.openSelectedAdmin(adminUserId)
    });
  }
  openSelectedAdmin(adminUserId) {
    const normalizedAdminUserId = adminUserId.trim();
    if (!normalizedAdminUserId) {
      return false;
    }
    this.prepareSelectedAdminSession(normalizedAdminUserId);
    void this.navigateToAdminAfterSelectorClose();
    return true;
  }
  async navigateToAdminAfterSelectorClose() {
    await this.waitForDemoSelectorClose();
    await this.router.navigateByUrl("/admin", { replaceUrl: true });
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
  onAdminLogoutRequested() {
    this.clearAdminSession();
  }
  onAdminAccessDenied() {
    this.handleAdminAccessDenied();
    if (this.router.url.split("?")[0].startsWith("/admin")) {
      void this.router.navigateByUrl("/admin", { replaceUrl: true });
    }
  }
  isAdminShellRoute() {
    return this.currentRouteIsAdminShell();
  }
  currentRouteIsAdminShell() {
    const route = this.router.url.split("?")[0];
    return route === "/admin" || route === "/admin/workspace";
  }
  async ensureReportsPopupLoaded() {
    if (this.reportsPopupComponentRef()) {
      return;
    }
    const module = await import("./admin-reports-popup.component-WFP362RO.js");
    this.reportsPopupComponentRef.set(module.AdminReportsPopupComponent);
  }
  async ensureFeedbackPopupLoaded() {
    if (this.feedbackPopupComponentRef()) {
      return;
    }
    const module = await import("./admin-feedback-popup.component-J4KLV5D4.js");
    this.feedbackPopupComponentRef.set(module.AdminFeedbackPopupComponent);
  }
  async ensureHelpEditorPopupLoaded() {
    if (this.helpEditorPopupComponentRef()) {
      return;
    }
    const module = await import("./admin-help-editor-popup.component-LFVBDOHY.js");
    this.helpEditorPopupComponentRef.set(module.AdminHelpEditorPopupComponent);
  }
  async ensureIdeaEditorPopupLoaded() {
    if (this.ideaEditorPopupComponentRef()) {
      return;
    }
    const module = await import("./admin-idea-editor-popup.component-KWNSJT64.js");
    this.ideaEditorPopupComponentRef.set(module.AdminIdeaEditorPopupComponent);
  }
  async ensureNotificationsPopupLoaded() {
    if (this.notificationsPopupComponentRef()) {
      return;
    }
    const module = await import("./admin-notifications-popup.component-CHY3YKXZ.js");
    this.notificationsPopupComponentRef.set(module.AdminNotificationsPopupComponent);
  }
  async ensureParamsPopupLoaded() {
    if (this.paramsPopupComponentRef()) {
      return;
    }
    const module = await import("./admin-params-popup.component-4EW5IUQD.js");
    this.paramsPopupComponentRef.set(module.AdminParamsPopupComponent);
  }
  async ensureStatsPopupLoaded() {
    if (this.statsPopupComponentRef()) {
      return;
    }
    const module = await import("./admin-stats-popup.component-C2TYTVGB.js");
    this.statsPopupComponentRef.set(module.AdminStatsPopupComponent);
  }
  async ensureAffinityGraphPopupLoaded() {
    if (this.affinityGraphPopupComponentRef()) {
      return;
    }
    const module = await import("./admin-affinity-graph-popup.component-CQ7HOXY4.js");
    this.affinityGraphPopupComponentRef.set(module.AdminAffinityGraphPopupComponent);
  }
  async ensureMonitoringPopupLoaded() {
    if (this.monitoringPopupComponentRef()) {
      return;
    }
    const module = await import("./admin-monitoring-popup.component-S2PY5YBY.js");
    this.monitoringPopupComponentRef.set(module.AdminMonitoringPopupComponent);
  }
  static \u0275fac = function AdminPageComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminPageComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminPageComponent, selectors: [["app-admin-page"]], hostBindings: function AdminPageComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("adminLogoutRequested", function AdminPageComponent_adminLogoutRequested_HostBindingHandler() {
        return ctx.onAdminLogoutRequested();
      }, \u0275\u0275resolveWindow)("adminAccessDenied", function AdminPageComponent_adminAccessDenied_HostBindingHandler() {
        return ctx.onAdminAccessDenied();
      }, \u0275\u0275resolveWindow);
    }
  }, decls: 4, vars: 2, consts: [["aria-busy", "true", 1, "admin-workspace", "admin-workspace-restoring"], [1, "admin-workspace"], [1, "admin-entry-shell"], [1, "admin-home-panel"], [1, "admin-home-header"], [1, "admin-brand"], [3, "branding"], [1, "admin-entry-hero", "admin-home-hero"], [1, "admin-eyebrow"], [1, "admin-entry-lead"], [4, "ngComponentOutlet"], [1, "admin-entry-panel"], [1, "admin-entry-header"], ["type", "button", "matRipple", "", 1, "admin-login-btn", 3, "click", "matRippleColor"], [1, "admin-entry-hero"], [1, "admin-entry-error"]], template: function AdminPageComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, AdminPageComponent_Conditional_0_Template, 12, 3, "section", 0)(1, AdminPageComponent_Conditional_1_Template, 22, 12, "section", 1)(2, AdminPageComponent_Conditional_2_Template, 18, 6, "section", 2);
      \u0275\u0275conditionalCreate(3, AdminPageComponent_Conditional_3_Template, 1, 1);
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275conditional(ctx.restoringWorkspace() ? 0 : (tmp_0_0 = ctx.workspace.dashboard()) ? 1 : 2, tmp_0_0);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.demoBootstrapSelector() ? 3 : -1);
    }
  }, dependencies: [
    CommonModule,
    NgComponentOutlet,
    DeploymentBrandComponent,
    MatIconModule,
    MatIcon,
    MatRippleModule,
    MatRipple,
    DialogComponent
  ], styles: ['\n[_nghost-%COMP%] {\n  display: block;\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n  color: #22324a;\n}\n.admin-entry-shell[_ngcontent-%COMP%], \n.admin-workspace[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  padding: 1rem;\n  box-sizing: border-box;\n}\n.admin-entry-panel[_ngcontent-%COMP%], \n.admin-home-panel[_ngcontent-%COMP%] {\n  width: min(1160px, 100vw - 2rem);\n  margin: 0 auto;\n  border: 1px solid rgba(30, 51, 85, 0.16);\n  border-radius: 18px;\n  background: #f5f6fb;\n  box-shadow: 0 24px 50px rgba(13, 27, 57, 0.09);\n}\n.admin-entry-panel[_ngcontent-%COMP%] {\n  min-height: calc(100vh - 2rem);\n  display: flex;\n  flex-direction: column;\n}\n.admin-home-panel[_ngcontent-%COMP%] {\n  min-height: calc(100vh - 2rem);\n  display: flex;\n  flex-direction: column;\n}\n.admin-entry-header[_ngcontent-%COMP%], \n.admin-home-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.8rem;\n  padding: 0.9rem;\n}\n.admin-brand[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: flex-end;\n  text-decoration: none;\n  color: var(--deployment-brand-text);\n  font-weight: 900;\n  background-image:\n    linear-gradient(\n      90deg,\n      var(--deployment-brand-primary),\n      var(--deployment-brand-secondary),\n      var(--deployment-brand-accent));\n  background-repeat: no-repeat;\n  background-size: 100% 3px;\n  background-position: 0 100%;\n  --deployment-brand-logo-size: 38px;\n  font-size: 2rem;\n  line-height: 0.8;\n}\n.admin-login-btn[_ngcontent-%COMP%] {\n  min-height: 40px;\n  border: 0;\n  border-radius: 999px;\n  padding: 0 0.95rem;\n  background:\n    linear-gradient(\n      135deg,\n      var(--deployment-brand-primary) 0%,\n      var(--deployment-brand-secondary) 55%,\n      var(--deployment-brand-accent) 100%);\n  color: #fff;\n  font: inherit;\n  font-weight: 800;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.42rem;\n  cursor: pointer;\n  box-shadow: 0 8px 20px var(--deployment-brand-shadow);\n}\n.admin-login-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.62;\n  cursor: default;\n}\n.admin-login-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.admin-entry-hero[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  margin: 0.9rem;\n  border-radius: 14px;\n  padding: clamp(2rem, 8vw, 5rem) 1.2rem;\n  background:\n    radial-gradient(\n      circle,\n      rgba(255, 255, 255, 0.2) 1px,\n      transparent 1px),\n    linear-gradient(\n      125deg,\n      var(--deployment-brand-primary) 0%,\n      var(--deployment-brand-secondary) 52%,\n      var(--deployment-brand-accent) 100%);\n  background-size: 18px 18px, auto;\n  color: #fff;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n.admin-eyebrow[_ngcontent-%COMP%] {\n  margin: 0 0 0.6rem;\n  color: var(--deployment-brand-soft);\n  font-size: 0.82rem;\n  font-weight: 800;\n  text-transform: uppercase;\n  letter-spacing: 0.12em;\n}\n.admin-entry-hero[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: clamp(2rem, 4vw, 3.4rem);\n  line-height: 1.03;\n}\n.admin-entry-lead[_ngcontent-%COMP%], \n.admin-entry-error[_ngcontent-%COMP%] {\n  max-width: 58ch;\n  margin: 0.85rem 0 0;\n  font-size: 1rem;\n  line-height: 1.55;\n}\n.admin-entry-error[_ngcontent-%COMP%] {\n  width: fit-content;\n  max-width: min(100%, 58ch);\n  border: 1px solid rgba(255, 255, 255, 0.7);\n  border-radius: 12px;\n  padding: 0.75rem 0.9rem;\n  background: rgba(255, 255, 255, 0.94);\n  color: #8f1732;\n  font-weight: 800;\n  box-shadow: 0 14px 30px rgba(91, 45, 129, 0.22);\n}\n.admin-workspace[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n}\n.admin-home-hero[_ngcontent-%COMP%] {\n  min-height: 0;\n}\n.admin-workspace-restoring[_ngcontent-%COMP%] {\n  position: relative;\n  min-height: 100vh;\n}\n.admin-restore-avatar-button[_ngcontent-%COMP%] {\n  position: fixed;\n  top: max(0.95rem, env(safe-area-inset-top));\n  right: max(1rem, env(safe-area-inset-right));\n  width: 58px;\n  height: 58px;\n  border: 0;\n  border-radius: 50%;\n  background: transparent;\n  padding: 5px;\n  display: inline-grid;\n  place-items: center;\n  box-shadow: none;\n  cursor: default;\n  z-index: 30;\n}\n.admin-restore-button-ring[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n}\n.admin-restore-button-avatar[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  width: 48px;\n  height: 48px;\n  border-radius: 50%;\n  background:\n    linear-gradient(\n      180deg,\n      #c8653b 0%,\n      #a84c28 100%);\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 16px;\n  font-weight: 700;\n  box-shadow: 0 8px 20px rgba(13, 24, 44, 0.26);\n}\n.admin-restore-button-avatar.user-color-woman[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f089b0 0%,\n      #df5d87 100%);\n}\n.admin-restore-button-avatar.user-color-man[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #5b84aa 0%,\n      #365873 100%);\n}\n.admin-restore-button-avatar.is-placeholder[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #d9e2f2 0%,\n      #c9d4e8 100%);\n  color: rgba(29, 51, 83, 0.72);\n}\n.admin-restore-button-avatar[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 22px;\n  height: 22px;\n  font-size: 22px;\n  line-height: 22px;\n}\n@media (max-width: 760px) {\n  .admin-entry-shell[_ngcontent-%COMP%], \n   .admin-workspace[_ngcontent-%COMP%] {\n    padding: 0.55rem;\n  }\n  .admin-entry-panel[_ngcontent-%COMP%], \n   .admin-home-panel[_ngcontent-%COMP%] {\n    width: 100%;\n    min-height: calc(100vh - 1.1rem);\n  }\n  .admin-restore-avatar-button[_ngcontent-%COMP%] {\n    top: max(0.7rem, env(safe-area-inset-top));\n    right: max(0.7rem, env(safe-area-inset-right));\n  }\n}\n/*# sourceMappingURL=admin-page.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminPageComponent, [{
    type: Component,
    args: [{ selector: "app-admin-page", standalone: true, imports: [
      CommonModule,
      DeploymentBrandComponent,
      MatIconModule,
      MatRippleModule,
      DialogComponent
    ], template: `@if (restoringWorkspace()) {
  <section class="admin-workspace admin-workspace-restoring" aria-busy="true">
    <div class="admin-home-panel">
      <header class="admin-home-header">
        <a class="admin-brand" [attr.aria-label]="deploymentBranding().productName + ' admin'">
          <app-deployment-brand [branding]="deploymentBranding()"></app-deployment-brand>
        </a>
      </header>

      <section class="admin-entry-hero admin-home-hero">
        <p class="admin-eyebrow">{{ deploymentBranding().productName }} admin</p>
        <h1>Moderation workspace</h1>
        <p class="admin-entry-lead">Review reported users, support chats, and application feedback with the same app tools.</p>
      </section>
    </div>
  </section>
} @else if (workspace.dashboard(); as dashboard) {
  <section class="admin-workspace">
    <div class="admin-home-panel">
      <header class="admin-home-header">
        <a class="admin-brand" [attr.aria-label]="deploymentBranding().productName + ' admin'">
          <app-deployment-brand [branding]="deploymentBranding()"></app-deployment-brand>
        </a>
      </header>

      <section class="admin-entry-hero admin-home-hero">
        <p class="admin-eyebrow">{{ deploymentBranding().productName }} admin</p>
        <h1>Moderation workspace</h1>
        <p class="admin-entry-lead">Review reported users, support chats, and application feedback with the same app tools.</p>
      </section>
    </div>

    @if (reportsPopupComponent(); as reportsComponent) {
      <ng-container *ngComponentOutlet="reportsComponent"></ng-container>
    }
    @if (feedbackPopupComponent(); as feedbackComponent) {
      <ng-container *ngComponentOutlet="feedbackComponent"></ng-container>
    }
    @if (helpEditorPopupComponent(); as helpEditorComponent) {
      <ng-container *ngComponentOutlet="helpEditorComponent"></ng-container>
    }
    @if (ideaEditorPopupComponent(); as ideaEditorComponent) {
      <ng-container *ngComponentOutlet="ideaEditorComponent"></ng-container>
    }
    @if (notificationsPopupComponent(); as notificationsComponent) {
      <ng-container *ngComponentOutlet="notificationsComponent"></ng-container>
    }
    @if (paramsPopupComponent(); as paramsComponent) {
      <ng-container *ngComponentOutlet="paramsComponent"></ng-container>
    }
    @if (statsPopupComponent(); as statsComponent) {
      <ng-container *ngComponentOutlet="statsComponent"></ng-container>
    }
    @if (affinityGraphPopupComponent(); as affinityGraphComponent) {
      <ng-container *ngComponentOutlet="affinityGraphComponent"></ng-container>
    }
    @if (monitoringPopupComponent(); as monitoringComponent) {
      <ng-container *ngComponentOutlet="monitoringComponent"></ng-container>
    }
    <app-dialog></app-dialog>
  </section>
} @else {
  <section class="admin-entry-shell">
    <div class="admin-entry-panel">
      <header class="admin-entry-header">
        <a class="admin-brand" [attr.aria-label]="deploymentBranding().productName + ' admin landing'">
          <app-deployment-brand [branding]="deploymentBranding()"></app-deployment-brand>
        </a>
        <button
          type="button"
          class="admin-login-btn"
          matRipple
          [matRippleColor]="'rgba(255, 255, 255, 0.2)'"
          (click)="requestAdminLogin()"
        >
          <mat-icon>{{ isFirebaseAdminMode ? 'login' : 'group' }}</mat-icon>
          <span>Admin login</span>
        </button>
      </header>
      <section class="admin-entry-hero">
        <p class="admin-eyebrow">{{ deploymentBranding().productName }} admin</p>
        <h1>Moderation workspace</h1>
        <p class="admin-entry-lead">Review reported users, support chats, and application feedback with the same app tools.</p>
        @if (workspace.error()) {
          <p class="admin-entry-error">{{ workspace.error() }}</p>
        }
      </section>
    </div>
  </section>
}

@if (demoBootstrapSelector()) {
  @if (demoBootstrapSelectorComponent(); as component) {
    <ng-container *ngComponentOutlet="component"></ng-container>
  }
}
`, styles: ['/* src/app/admin/components/admin-page/admin-page.component.scss */\n:host {\n  display: block;\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n  color: #22324a;\n}\n.admin-entry-shell,\n.admin-workspace {\n  min-height: 100vh;\n  padding: 1rem;\n  box-sizing: border-box;\n}\n.admin-entry-panel,\n.admin-home-panel {\n  width: min(1160px, 100vw - 2rem);\n  margin: 0 auto;\n  border: 1px solid rgba(30, 51, 85, 0.16);\n  border-radius: 18px;\n  background: #f5f6fb;\n  box-shadow: 0 24px 50px rgba(13, 27, 57, 0.09);\n}\n.admin-entry-panel {\n  min-height: calc(100vh - 2rem);\n  display: flex;\n  flex-direction: column;\n}\n.admin-home-panel {\n  min-height: calc(100vh - 2rem);\n  display: flex;\n  flex-direction: column;\n}\n.admin-entry-header,\n.admin-home-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.8rem;\n  padding: 0.9rem;\n}\n.admin-brand {\n  display: inline-flex;\n  align-items: flex-end;\n  text-decoration: none;\n  color: var(--deployment-brand-text);\n  font-weight: 900;\n  background-image:\n    linear-gradient(\n      90deg,\n      var(--deployment-brand-primary),\n      var(--deployment-brand-secondary),\n      var(--deployment-brand-accent));\n  background-repeat: no-repeat;\n  background-size: 100% 3px;\n  background-position: 0 100%;\n  --deployment-brand-logo-size: 38px;\n  font-size: 2rem;\n  line-height: 0.8;\n}\n.admin-login-btn {\n  min-height: 40px;\n  border: 0;\n  border-radius: 999px;\n  padding: 0 0.95rem;\n  background:\n    linear-gradient(\n      135deg,\n      var(--deployment-brand-primary) 0%,\n      var(--deployment-brand-secondary) 55%,\n      var(--deployment-brand-accent) 100%);\n  color: #fff;\n  font: inherit;\n  font-weight: 800;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.42rem;\n  cursor: pointer;\n  box-shadow: 0 8px 20px var(--deployment-brand-shadow);\n}\n.admin-login-btn:disabled {\n  opacity: 0.62;\n  cursor: default;\n}\n.admin-login-btn .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.admin-entry-hero {\n  flex: 1 1 auto;\n  margin: 0.9rem;\n  border-radius: 14px;\n  padding: clamp(2rem, 8vw, 5rem) 1.2rem;\n  background:\n    radial-gradient(\n      circle,\n      rgba(255, 255, 255, 0.2) 1px,\n      transparent 1px),\n    linear-gradient(\n      125deg,\n      var(--deployment-brand-primary) 0%,\n      var(--deployment-brand-secondary) 52%,\n      var(--deployment-brand-accent) 100%);\n  background-size: 18px 18px, auto;\n  color: #fff;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n.admin-eyebrow {\n  margin: 0 0 0.6rem;\n  color: var(--deployment-brand-soft);\n  font-size: 0.82rem;\n  font-weight: 800;\n  text-transform: uppercase;\n  letter-spacing: 0.12em;\n}\n.admin-entry-hero h1 {\n  margin: 0;\n  font-size: clamp(2rem, 4vw, 3.4rem);\n  line-height: 1.03;\n}\n.admin-entry-lead,\n.admin-entry-error {\n  max-width: 58ch;\n  margin: 0.85rem 0 0;\n  font-size: 1rem;\n  line-height: 1.55;\n}\n.admin-entry-error {\n  width: fit-content;\n  max-width: min(100%, 58ch);\n  border: 1px solid rgba(255, 255, 255, 0.7);\n  border-radius: 12px;\n  padding: 0.75rem 0.9rem;\n  background: rgba(255, 255, 255, 0.94);\n  color: #8f1732;\n  font-weight: 800;\n  box-shadow: 0 14px 30px rgba(91, 45, 129, 0.22);\n}\n.admin-workspace {\n  display: flex;\n  align-items: flex-start;\n}\n.admin-home-hero {\n  min-height: 0;\n}\n.admin-workspace-restoring {\n  position: relative;\n  min-height: 100vh;\n}\n.admin-restore-avatar-button {\n  position: fixed;\n  top: max(0.95rem, env(safe-area-inset-top));\n  right: max(1rem, env(safe-area-inset-right));\n  width: 58px;\n  height: 58px;\n  border: 0;\n  border-radius: 50%;\n  background: transparent;\n  padding: 5px;\n  display: inline-grid;\n  place-items: center;\n  box-shadow: none;\n  cursor: default;\n  z-index: 30;\n}\n.admin-restore-button-ring {\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n}\n.admin-restore-button-avatar {\n  position: relative;\n  z-index: 1;\n  width: 48px;\n  height: 48px;\n  border-radius: 50%;\n  background:\n    linear-gradient(\n      180deg,\n      #c8653b 0%,\n      #a84c28 100%);\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 16px;\n  font-weight: 700;\n  box-shadow: 0 8px 20px rgba(13, 24, 44, 0.26);\n}\n.admin-restore-button-avatar.user-color-woman {\n  background:\n    linear-gradient(\n      180deg,\n      #f089b0 0%,\n      #df5d87 100%);\n}\n.admin-restore-button-avatar.user-color-man {\n  background:\n    linear-gradient(\n      180deg,\n      #5b84aa 0%,\n      #365873 100%);\n}\n.admin-restore-button-avatar.is-placeholder {\n  background:\n    linear-gradient(\n      180deg,\n      #d9e2f2 0%,\n      #c9d4e8 100%);\n  color: rgba(29, 51, 83, 0.72);\n}\n.admin-restore-button-avatar .mat-icon {\n  width: 22px;\n  height: 22px;\n  font-size: 22px;\n  line-height: 22px;\n}\n@media (max-width: 760px) {\n  .admin-entry-shell,\n  .admin-workspace {\n    padding: 0.55rem;\n  }\n  .admin-entry-panel,\n  .admin-home-panel {\n    width: 100%;\n    min-height: calc(100vh - 1.1rem);\n  }\n  .admin-restore-avatar-button {\n    top: max(0.7rem, env(safe-area-inset-top));\n    right: max(0.7rem, env(safe-area-inset-right));\n  }\n}\n/*# sourceMappingURL=admin-page.component.css.map */\n'] }]
  }], () => [], { onAdminLogoutRequested: [{
    type: HostListener,
    args: ["window:adminLogoutRequested"]
  }], onAdminAccessDenied: [{
    type: HostListener,
    args: ["window:adminAccessDenied"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminPageComponent, { className: "AdminPageComponent", filePath: "app/admin/components/admin-page/admin-page.component.ts", lineNumber: 65 });
})();

// src/app/admin/admin.module.ts
var AdminModule = class _AdminModule {
  static \u0275fac = function AdminModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _AdminModule });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [
    CommonModule,
    AdminPageComponent,
    RouterModule.forChild([
      {
        path: "help/:token",
        component: AdminHelpSessionPageComponent
      },
      {
        path: "workspace",
        redirectTo: "",
        pathMatch: "full"
      },
      {
        path: "",
        component: AdminPageComponent
      }
    ])
  ] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminModule, [{
    type: NgModule,
    args: [{
      imports: [
        CommonModule,
        AdminHelpSessionPageComponent,
        AdminPageComponent,
        RouterModule.forChild([
          {
            path: "help/:token",
            component: AdminHelpSessionPageComponent
          },
          {
            path: "workspace",
            redirectTo: "",
            pathMatch: "full"
          },
          {
            path: "",
            component: AdminPageComponent
          }
        ])
      ],
      exports: [
        AdminHelpSessionPageComponent,
        AdminPageComponent
      ]
    }]
  }], null, null);
})();
export {
  AdminModule
};
//# sourceMappingURL=admin.module-AQWFSSIY.js.map
