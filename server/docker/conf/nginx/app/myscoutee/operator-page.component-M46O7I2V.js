import {
  OperatorWorkspaceStore
} from "./chunk-FIIXR2FL.js";
import "./chunk-BGAUSF4L.js";
import {
  OperatorLeaderboardStore,
  OperatorRegistryStore
} from "./chunk-ZC76NM3J.js";
import {
  OperatorMenuStore
} from "./chunk-ZCVNJBPR.js";
import "./chunk-AP4X7E7Y.js";
import {
  DeploymentBrandComponent
} from "./chunk-22I4RYEC.js";
import "./chunk-SYKOEE4K.js";
import {
  SmartListComponent
} from "./chunk-QPGRMBRW.js";
import {
  SingleRowComponent
} from "./chunk-7FJOOQKP.js";
import "./chunk-KO4GQHHA.js";
import "./chunk-Z4E5Y2UC.js";
import "./chunk-7FYNT6CO.js";
import "./chunk-IPHHDSOR.js";
import "./chunk-EA3MO7BB.js";
import "./chunk-5VDIJXBA.js";
import "./chunk-Z7T4C7EV.js";
import "./chunk-JNYVIKB6.js";
import "./chunk-522CXB3E.js";
import "./chunk-HWWKH4YJ.js";
import "./chunk-LFVP4M73.js";
import "./chunk-ADBOYRJ7.js";
import "./chunk-EAXEH725.js";
import {
  AppMenuComponent,
  IndicatorComponent
} from "./chunk-53UGBDSO.js";
import "./chunk-ETJ7G4VT.js";
import {
  DeploymentConfigurationService
} from "./chunk-MOUXN75Y.js";
import "./chunk-ULZAFSSC.js";
import {
  I18nPipe,
  MatIcon,
  MatIconModule
} from "./chunk-L6HJFJOR.js";
import "./chunk-LFBAVSTX.js";
import {
  AppRuntimeStore,
  USER_BY_ID_LOAD_CONTEXT_KEY
} from "./chunk-RP5GBSNO.js";
import "./chunk-HGLCBXAR.js";
import "./chunk-OY7NWTMT.js";
import "./chunk-EWHSEKAB.js";
import "./chunk-LM6UNLJK.js";
import "./chunk-NOXIMZYO.js";
import "./chunk-UR2UG3BQ.js";
import "./chunk-7B4ZHEVS.js";
import "./chunk-6SKBB3AJ.js";
import "./chunk-YXATI2WQ.js";
import "./chunk-QXOIA7DH.js";
import "./chunk-EVFFULVM.js";
import "./chunk-7WMBE6WE.js";
import "./chunk-IEWB22H3.js";
import "./chunk-UKS3QROH.js";
import "./chunk-C6JV7CA3.js";
import "./chunk-N7OBXPJA.js";
import {
  I18nService
} from "./chunk-AOUY6FNC.js";
import {
  NgComponentOutlet
} from "./chunk-SCHUURLR.js";
import "./chunk-CYVMX3LD.js";
import "./chunk-HDBJPOT3.js";
import "./chunk-LDZENZ35.js";
import "./chunk-DZ6OOOZN.js";
import "./chunk-ODJSNRFC.js";
import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  __spreadProps,
  __spreadValues,
  computed,
  effect,
  from,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
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
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵviewQuery
} from "./chunk-EV3I3YNV.js";

// src/app/shared/ui/converters/operator-leaderboard-single-row.converter.ts
var OperatorLeaderboardSingleRowConverter = class {
  convert(entry, ...optionsArg) {
    const options = optionsArg[0] ?? {};
    const locale = `${options.locale ?? ""}`.trim() || void 0;
    const units = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0
    }).format(Math.max(0, entry.verifiedWeight));
    const share = new Intl.NumberFormat(locale, {
      minimumFractionDigits: entry.sharePercent > 0 && entry.sharePercent < 1 ? 2 : 1,
      maximumFractionDigits: 2
    }).format(Math.max(0, entry.sharePercent));
    const claimantName = `${entry.claimantName ?? ""}`.trim();
    const shareLabel = `${options.shareLabel ?? ""}`.trim() || "share";
    const unitsLabel = `${options.unitsLabel ?? ""}`.trim() || "contribution units";
    const deploymentCount = Math.max(1, Math.trunc(Number(entry.deploymentCount) || 1));
    const deploymentLabel = deploymentCount === 1 ? `${options.deploymentLabel ?? ""}`.trim() || "deployment" : `${options.deploymentsLabel ?? ""}`.trim() || "deployments";
    const claimedNodeLabel = `${options.claimedNodeLabel ?? ""}`.trim();
    const unclaimedNodeLabel = `${options.unclaimedNodeLabel ?? ""}`.trim();
    const pendingReview = entry.claimVerificationStatus === "PENDING_REVIEW";
    const pendingReviewLabel = `${options.pendingReviewLabel ?? ""}`.trim() || "Under review";
    const rejectedReview = entry.claimVerificationStatus === "REJECTED";
    const rejectedReviewLabel = `${options.rejectedReviewLabel ?? ""}`.trim() || "Review rejected";
    const suspended = entry.group === "CLAIMED" && entry.eligibilityStatus === "SUSPENDED";
    const partiallySuspended = entry.group === "CLAIMED" && entry.eligibilityStatus === "PARTIALLY_SUSPENDED";
    const inactive = entry.group === "CLAIMED" && entry.eligibilityStatus === "INACTIVE";
    const suspendedEligibilityLabel = `${options.suspendedEligibilityLabel ?? ""}`.trim() || "Suspended";
    const partiallySuspendedEligibilityLabel = `${options.partiallySuspendedEligibilityLabel ?? ""}`.trim() || "Partially suspended";
    const inactiveEligibilityLabel = `${options.inactiveEligibilityLabel ?? ""}`.trim() || "Not eligible";
    const shareBadge = {
      label: `${share}%`,
      icon: "pie_chart",
      ariaLabel: `${share}% ${shareLabel}`,
      title: `${share}% ${shareLabel}`,
      tone: entry.sharePercent > 0 ? "accent" : "muted",
      position: "top-right"
    };
    const badges = rejectedReview ? [{
      label: rejectedReviewLabel,
      icon: "block",
      ariaLabel: rejectedReviewLabel,
      title: rejectedReviewLabel,
      tone: "danger",
      position: "top-right"
    }] : pendingReview ? [{
      label: pendingReviewLabel,
      icon: "pending_actions",
      ariaLabel: pendingReviewLabel,
      title: pendingReviewLabel,
      tone: "warning",
      position: "top-right"
    }, shareBadge] : suspended ? [{
      label: suspendedEligibilityLabel,
      icon: "pause_circle",
      ariaLabel: suspendedEligibilityLabel,
      title: suspendedEligibilityLabel,
      tone: "danger",
      position: "top-right"
    }, shareBadge] : partiallySuspended ? [{
      label: partiallySuspendedEligibilityLabel,
      icon: "warning",
      ariaLabel: partiallySuspendedEligibilityLabel,
      title: partiallySuspendedEligibilityLabel,
      tone: "warning",
      position: "top-right"
    }, shareBadge] : inactive ? [{
      label: inactiveEligibilityLabel,
      icon: "gpp_maybe",
      ariaLabel: inactiveEligibilityLabel,
      title: inactiveEligibilityLabel,
      tone: "muted",
      position: "top-right"
    }] : [shareBadge];
    return {
      id: entry.id,
      title: entry.label,
      subtitle: entry.group === "CLAIMED" ? `${deploymentCount} ${deploymentLabel}` : entry.group === "FOUNDER" ? unitsLabel : entry.claimed ? claimedNodeLabel : unclaimedNodeLabel,
      detail: `${units} ${unitsLabel}`,
      avatarUrl: `${entry.claimantAvatarUrl ?? ""}`.trim() || null,
      avatarInitials: claimantName ? this.initials(claimantName) : null,
      avatarAriaLabel: claimantName || entry.label,
      icon: claimantName ? null : entry.group === "FOUNDER" ? "favorite" : entry.claimed ? "verified" : "dns",
      surfaceTone: entry.group === "FOUNDER" ? "accent" : rejectedReview ? "danger" : pendingReview ? "warning" : suspended ? "danger" : partiallySuspended ? "warning" : inactive ? "muted" : entry.claimed ? "success" : "muted",
      toneClass: [
        "operator-leaderboard-row",
        `operator-leaderboard-row--${entry.group.toLowerCase()}`,
        pendingReview ? "operator-leaderboard-row--pending-review" : "",
        rejectedReview ? "operator-leaderboard-row--rejected" : "",
        suspended ? "operator-leaderboard-row--suspended" : "",
        partiallySuspended ? "operator-leaderboard-row--partially-suspended" : "",
        inactive ? "operator-leaderboard-row--inactive" : ""
      ].filter(Boolean).join(" "),
      badges,
      eagerDetail: structuredClone(entry)
    };
  }
  initials(value) {
    return value.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
  }
};

// src/app/operator/components/operator-page/operator-page.component.ts
var _c0 = ["leaderboardSmartList"];
function OperatorPageComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 7);
    \u0275\u0275element(1, "app-indicator", 8);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 1, "operator.workspace.loading"));
  }
}
function OperatorPageComponent_Conditional_6_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 9)(1, "mat-icon");
    \u0275\u0275text(2, "error_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 1, ctx_r1.errorMessage()));
  }
}
function OperatorPageComponent_Conditional_6_ng_template_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "single-row", 16);
    \u0275\u0275listener("rowClick", function OperatorPageComponent_Conditional_6_ng_template_17_Template_single_row_rowClick_0_listener($event) {
      const selectItem_r4 = \u0275\u0275restoreView(_r3).selectItem;
      return \u0275\u0275resetView(selectItem_r4($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const entry_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("row", ctx_r1.leaderboardRow(entry_r5))("ariaLabel", ctx_r1.leaderboardRowAriaLabel(entry_r5));
  }
}
function OperatorPageComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275conditionalCreate(0, OperatorPageComponent_Conditional_6_Conditional_0_Template, 6, 3, "p", 9);
    \u0275\u0275elementStart(1, "section", 10);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementStart(3, "app-menu", 11);
    \u0275\u0275listener("itemSelect", function OperatorPageComponent_Conditional_6_Template_app_menu_itemSelect_3_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openAction($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "section", 12)(5, "header", 13)(6, "span")(7, "small");
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "h1", 14);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "i18n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "mat-icon");
    \u0275\u0275text(14, "leaderboard");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "app-smart-list", 15, 0);
    \u0275\u0275listener("itemSelect", function OperatorPageComponent_Conditional_6_Template_app_smart_list_itemSelect_15_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openLeaderboardDeployments($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(17, OperatorPageComponent_Conditional_6_ng_template_17_Template, 1, 2, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const leaderboardRowTemplate_r6 = \u0275\u0275reference(18);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r1.errorMessage() ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(2, 9, "operator.actions"));
    \u0275\u0275advance(2);
    \u0275\u0275property("items", ctx_r1.actionItems());
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(9, 11, "operator.leaderboard.network"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(12, 13, "operator.leaderboard"));
    \u0275\u0275advance(4);
    \u0275\u0275property("config", ctx_r1.leaderboardConfig)("loadPage", ctx_r1.loadLeaderboardPage)("query", ctx_r1.leaderboardQuery())("itemTemplate", leaderboardRowTemplate_r6);
  }
}
function OperatorPageComponent_Conditional_7_Conditional_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function OperatorPageComponent_Conditional_7_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, OperatorPageComponent_Conditional_7_Conditional_0_ng_container_0_Template, 1, 0, "ng-container", 17);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function OperatorPageComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, OperatorPageComponent_Conditional_7_Conditional_0_Template, 1, 1, "ng-container");
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_1_0 = ctx_r1.registrationPopupComponent()) ? 0 : -1, tmp_1_0);
  }
}
function OperatorPageComponent_Conditional_8_Conditional_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function OperatorPageComponent_Conditional_8_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, OperatorPageComponent_Conditional_8_Conditional_0_ng_container_0_Template, 1, 0, "ng-container", 17);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function OperatorPageComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, OperatorPageComponent_Conditional_8_Conditional_0_Template, 1, 1, "ng-container");
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_1_0 = ctx_r1.actionPopupComponent()) ? 0 : -1, tmp_1_0);
  }
}
var OperatorPageComponent = class _OperatorPageComponent {
  deploymentBranding = inject(DeploymentConfigurationService).branding;
  registry = inject(OperatorRegistryStore);
  operatorMenu = inject(OperatorMenuStore);
  workspace = inject(OperatorWorkspaceStore);
  leaderboard = inject(OperatorLeaderboardStore);
  runtimeStore = inject(AppRuntimeStore);
  i18n = inject(I18nService);
  profileLoadState = this.runtimeStore.selectLoadingState(USER_BY_ID_LOAD_CONTEXT_KEY);
  registrationPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "registrationPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  actionPopupComponentRef = signal(null, ...ngDevMode ? [{ debugName: "actionPopupComponentRef" }] : (
    /* istanbul ignore next */
    []
  ));
  leaderboardSmartListRef = signal(null, ...ngDevMode ? [{ debugName: "leaderboardSmartListRef" }] : (
    /* istanbul ignore next */
    []
  ));
  rowConverter = new OperatorLeaderboardSingleRowConverter();
  initialWorkspaceLoaded = signal(false, ...ngDevMode ? [{ debugName: "initialWorkspaceLoaded" }] : (
    /* istanbul ignore next */
    []
  ));
  set leaderboardSmartList(value) {
    this.leaderboardSmartListRef.set(value ?? null);
  }
  status = this.registry.status;
  registrationPopupComponent = this.registrationPopupComponentRef.asReadonly();
  actionPopupComponent = this.actionPopupComponentRef.asReadonly();
  activePopup = this.operatorMenu.activePopup;
  loading = computed(() => this.profileLoadState().status === "idle" || this.profileLoadState().status === "loading" || !this.initialWorkspaceLoaded() || !this.status() && !this.errorMessage(), ...ngDevMode ? [{ debugName: "loading" }] : (
    /* istanbul ignore next */
    []
  ));
  errorMessage = computed(() => {
    const storeError = this.registry.error().trim();
    if (storeError) {
      return storeError;
    }
    const status = this.status();
    return status?.lastError?.message?.trim() || (status?.lifecycle === "ERROR" ? "operator.registration.status.error" : "");
  }, ...ngDevMode ? [{ debugName: "errorMessage" }] : (
    /* istanbul ignore next */
    []
  ));
  actionItems = computed(() => {
    const claim = this.workspace.claimStatus();
    const registryActive = this.status()?.enabled === true && this.status()?.lifecycle === "REGISTERED";
    const claimPendingReview = registryActive && claim?.verificationStatus === "PENDING_REVIEW";
    const claimRejected = registryActive && claim?.verificationStatus === "REJECTED";
    const claimSuspended = registryActive && claim?.claimed && claim.eligibilityStatus === "SUSPENDED";
    const claimInactive = registryActive && claim?.claimed && claim.eligibilityStatus === "INACTIVE" && !claimPendingReview && !claimRejected;
    return [
      {
        id: "updates",
        label: "operator.action.updates",
        detail: this.workspace.deploymentUpdate()?.updateAvailable ? "operator.action.updates.available" : "operator.action.updates.detail",
        icon: "system_update_alt",
        palette: "teal",
        kind: "action",
        layout: "big",
        counter: this.workspace.deploymentUpdate()?.updateAvailable ? 1 : null,
        counterTone: "alert"
      },
      {
        id: "configuration",
        label: "operator.action.configuration",
        detail: "operator.action.configuration.detail",
        icon: "tune",
        palette: "blue",
        kind: "action",
        layout: "big"
      },
      {
        id: "registration",
        label: "operator.action.node.registration",
        detail: this.status()?.enabled && this.status()?.lifecycle === "REGISTERED" ? "operator.action.node.registration.registered" : "operator.action.node.registration.detail",
        icon: "app_registration",
        palette: "violet",
        kind: "action",
        layout: "big"
      },
      {
        id: "claim",
        label: "operator.action.claim.share",
        detail: claimRejected ? "operator.action.claim.share.rejected" : claimPendingReview ? "operator.action.claim.share.pending" : claimSuspended ? "operator.action.claim.share.suspended" : claimInactive ? "operator.action.claim.share.inactive" : registryActive && claim?.claimed ? "operator.action.claim.share.claimed" : "operator.action.claim.share.detail",
        icon: claimRejected ? "block" : claimPendingReview ? "pending_actions" : claimSuspended ? "pause_circle" : claimInactive ? "gpp_maybe" : "redeem",
        palette: claimRejected || claimSuspended ? "red" : claimPendingReview || claimInactive ? "orange" : "amber",
        kind: "action",
        layout: "big"
      },
      {
        id: "revenue",
        label: "operator.action.revenue",
        detail: "operator.action.revenue.detail",
        icon: "payments",
        palette: "green",
        kind: "action",
        layout: "big"
      }
    ];
  }, ...ngDevMode ? [{ debugName: "actionItems" }] : (
    /* istanbul ignore next */
    []
  ));
  leaderboardQuery = computed(() => ({
    page: 0,
    pageSize: 8,
    sort: "share",
    direction: "desc",
    filters: { revision: this.leaderboard.revision() }
  }), ...ngDevMode ? [{ debugName: "leaderboardQuery" }] : (
    /* istanbul ignore next */
    []
  ));
  leaderboardConfig = {
    pageSize: 8,
    defaultView: "list",
    defaultSort: "share",
    defaultDirection: "desc",
    defaultFilters: { revision: 0 },
    emptyLabel: "operator.leaderboard.empty",
    emptyDescription: "operator.leaderboard.empty.description",
    showStickyHeader: false,
    showFirstGroupMarker: true,
    listLayout: "stack",
    snapMode: "none",
    preloadOffsetPx: 180,
    headerProgress: {
      enabled: true,
      placement: "inline",
      tone: "accent"
    },
    cacheable: {
      identity: (item) => item.id
    },
    sortable: {
      sortKey: (item) => [
        item.group === "FOUNDER" ? 0 : item.group === "CLAIMED" ? 1 : 2,
        -Math.max(0, Number(item.sharePercent) || 0),
        -Math.max(0, Number(item.verifiedWeight) || 0),
        item.label,
        item.id
      ]
    },
    groupBy: (item) => this.leaderboardGroupTitle(item.group),
    containerClass: {
      "operator-leaderboard-smart-list": true
    },
    trackBy: (_index, item) => item.id
  };
  loadLeaderboardPage = (query, context) => from(this.leaderboard.queryPage(query, context?.signal));
  constructor() {
    effect(() => {
      const popup = this.activePopup();
      if (popup === "registration") {
        void this.ensureRegistrationPopupLoaded();
      } else if (popup) {
        void this.ensureActionPopupLoaded();
      }
    });
    effect(() => {
      const smartList = this.leaderboardSmartListRef();
      const mutation = this.leaderboard.latestCacheMutation();
      if (!smartList || !mutation) {
        return;
      }
      for (const id of mutation.removedEntryIds) {
        smartList.removeVisibleItemByIdentity(id, { totalDelta: 0 });
      }
      for (const entry of mutation.leaderboardUpserts) {
        if (smartList.patchVisibleItem((item) => item.id === entry.id, () => entry)) {
          continue;
        }
        smartList.reinsertVisibleItem(entry, {
          totalDelta: 0,
          loadedRange: "any"
        });
      }
      smartList.adjustVisibleTotal(mutation.leaderboardTotalDelta);
      this.leaderboard.consumeCacheMutation(mutation.sequence);
    });
  }
  ngOnInit() {
    void this.loadInitialWorkspace();
  }
  openAction(event) {
    this.operatorMenu.open(event.id);
  }
  leaderboardRow(entry) {
    const row = this.rowConverter.convert(__spreadProps(__spreadValues({}, entry), {
      label: this.i18n.translate(entry.label)
    }), {
      locale: this.i18n.currentLanguage(),
      shareLabel: this.i18n.translate("operator.leaderboard.share"),
      unitsLabel: this.i18n.translate("operator.leaderboard.contribution.units"),
      deploymentLabel: this.i18n.translate("operator.leaderboard.deployment"),
      deploymentsLabel: this.i18n.translate("operator.leaderboard.deployments"),
      claimedNodeLabel: this.i18n.translate("operator.leaderboard.claimed.node"),
      unclaimedNodeLabel: this.i18n.translate("operator.leaderboard.unclaimed.node"),
      pendingReviewLabel: this.i18n.translate("operator.claim.verification.pending.action"),
      rejectedReviewLabel: this.i18n.translate("operator.claim.verification.rejected.action"),
      suspendedEligibilityLabel: this.i18n.translate("operator.claim.eligibility.suspended"),
      partiallySuspendedEligibilityLabel: this.i18n.translate("operator.claim.eligibility.partially.suspended"),
      inactiveEligibilityLabel: this.i18n.translate("operator.claim.eligibility.inactive")
    });
    return __spreadProps(__spreadValues({}, row), {
      clickable: this.canOpenLeaderboardDeployments(entry)
    });
  }
  openLeaderboardDeployments(event) {
    if (!this.canOpenLeaderboardDeployments(event.item)) {
      return;
    }
    this.operatorMenu.openLeaderboardDeployments(event.item);
  }
  leaderboardRowAriaLabel(entry) {
    if (!this.canOpenLeaderboardDeployments(entry)) {
      return null;
    }
    return [
      this.i18n.translate("operator.leaderboard.deployments.open"),
      this.i18n.translate(entry.label)
    ].join(": ");
  }
  leaderboardGroupTitle(group) {
    const labelKey = group === "FOUNDER" ? "operator.leaderboard.group.founder" : group === "CLAIMED" ? "operator.leaderboard.group.claimed.nodes" : "operator.leaderboard.group.unclaimed.nodes";
    return this.i18n.translate(labelKey);
  }
  canOpenLeaderboardDeployments(entry) {
    return entry.group === "CLAIMED" && Boolean(entry.operatorGroupId?.trim());
  }
  async ensureRegistrationPopupLoaded() {
    if (this.registrationPopupComponentRef()) {
      return;
    }
    const module = await import("./operator-registry-popup.component-QT5JAH3T.js");
    this.registrationPopupComponentRef.set(module.OperatorRegistryPopupComponent);
  }
  async ensureActionPopupLoaded() {
    if (this.actionPopupComponentRef()) {
      return;
    }
    const module = await import("./operator-action-popup.component-LRRQNN72.js");
    this.actionPopupComponentRef.set(module.OperatorActionPopupComponent);
  }
  async loadInitialWorkspace() {
    try {
      await Promise.all([
        this.registry.loadStatus(),
        this.workspace.loadInitialWorkspace()
      ]);
    } finally {
      this.initialWorkspaceLoaded.set(true);
    }
  }
  static \u0275fac = function OperatorPageComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OperatorPageComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _OperatorPageComponent, selectors: [["app-operator-page"]], viewQuery: function OperatorPageComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.leaderboardSmartList = _t.first);
    }
  }, decls: 9, vars: 5, consts: [["leaderboardSmartList", ""], ["leaderboardRowTemplate", ""], [1, "operator-page-scroll"], [1, "operator-home"], [1, "operator-home-header"], [1, "operator-brand"], [3, "branding"], ["aria-busy", "true", "aria-live", "polite", 1, "operator-home-loading"], ["kind", "load-ring", "state", "loading"], ["role", "alert", 1, "operator-state-message", "operator-state-message--error"], [1, "operator-actions"], ["kind", "inline", "layout", "row", 3, "itemSelect", "items"], ["aria-labelledby", "operator-leaderboard-title", 1, "operator-leaderboard"], [1, "operator-leaderboard__header"], ["id", "operator-leaderboard-title"], [1, "operator-leaderboard__list", 3, "itemSelect", "config", "loadPage", "query", "itemTemplate"], [3, "rowClick", "row", "ariaLabel"], [4, "ngComponentOutlet"]], template: function OperatorPageComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 2)(1, "main", 3)(2, "header", 4)(3, "a", 5);
      \u0275\u0275element(4, "app-deployment-brand", 6);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(5, OperatorPageComponent_Conditional_5_Template, 5, 3, "section", 7)(6, OperatorPageComponent_Conditional_6_Template, 19, 15);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(7, OperatorPageComponent_Conditional_7_Template, 1, 1)(8, OperatorPageComponent_Conditional_8_Template, 1, 1);
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275attribute("aria-busy", ctx.loading());
      \u0275\u0275advance(2);
      \u0275\u0275attribute("aria-label", ctx.deploymentBranding().productName);
      \u0275\u0275advance();
      \u0275\u0275property("branding", ctx.deploymentBranding());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading() ? 5 : 6);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.activePopup() === "registration" ? 7 : ctx.activePopup() ? 8 : -1);
    }
  }, dependencies: [
    AppMenuComponent,
    DeploymentBrandComponent,
    IndicatorComponent,
    MatIconModule,
    MatIcon,
    NgComponentOutlet,
    SingleRowComponent,
    SmartListComponent,
    I18nPipe
  ], styles: ['\n[_nghost-%COMP%] {\n  display: block;\n  height: 100%;\n  min-height: 0;\n  overflow: hidden;\n  color: #22324a;\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n*[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n}\n.operator-page-scroll[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  min-height: 0;\n  padding: 0.1rem;\n  display: flex;\n  overflow: hidden;\n}\n.operator-home[_ngcontent-%COMP%] {\n  width: min(1160px, 100%);\n  height: 100%;\n  min-height: 0;\n  margin: 0 auto;\n  padding: 0.9rem;\n  border: 1px solid rgba(30, 51, 85, 0.14);\n  border-radius: 18px;\n  background:\n    radial-gradient(\n      circle at 8% -8%,\n      var(--deployment-brand-shadow),\n      transparent 26rem),\n    radial-gradient(\n      circle at 96% 5%,\n      color-mix(in srgb, var(--deployment-brand-secondary) 12%, transparent),\n      transparent 23rem),\n    #f5f6fb;\n  box-shadow: 0 24px 50px rgba(13, 27, 57, 0.08);\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n.operator-home-header[_ngcontent-%COMP%] {\n  min-height: 54px;\n  padding: 0.1rem 0.15rem 0.9rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.8rem;\n}\n.operator-brand[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: flex-end;\n  color: var(--deployment-brand-text);\n  font-weight: 900;\n  line-height: 0.8;\n  text-decoration: none;\n  background-image:\n    linear-gradient(\n      90deg,\n      var(--deployment-brand-primary),\n      var(--deployment-brand-secondary),\n      var(--deployment-brand-accent));\n  background-repeat: no-repeat;\n  background-position: 0 100%;\n  background-size: 100% 3px;\n  --deployment-brand-logo-size: 38px;\n  font-size: 2rem;\n}\n.operator-home-loading[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  min-height: 280px;\n  display: grid;\n  place-items: center;\n  align-content: center;\n  gap: 0.5rem;\n  color: rgba(34, 55, 84, 0.78);\n  font-size: 0.84rem;\n  font-weight: 900;\n  text-align: center;\n}\n.operator-state-message[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  min-height: 38px;\n  margin: 0 0 0.72rem;\n  padding: 0.58rem 0.72rem;\n  border: 1px solid rgba(178, 58, 78, 0.24);\n  border-radius: 12px;\n  background: rgba(255, 239, 242, 0.94);\n  color: #8d2d3d;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-size: 0.78rem;\n  font-weight: 800;\n}\n.operator-state-message[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.operator-actions[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  min-width: 0;\n}\n.operator-leaderboard[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  min-height: 0;\n  margin-top: 0.8rem;\n  padding: 0.85rem;\n  border: 1px solid rgba(36, 59, 92, 0.12);\n  border-radius: 16px;\n  background: rgba(255, 255, 255, 0.95);\n  box-shadow: 0 12px 28px rgba(22, 40, 70, 0.05);\n  display: grid;\n  grid-template-rows: auto minmax(0, 1fr);\n  gap: 0.65rem;\n  overflow: hidden;\n}\n.operator-leaderboard__header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.7rem;\n}\n.operator-leaderboard__header[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.08rem;\n}\n.operator-leaderboard__header[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: #6d57c7;\n  font-size: 0.66rem;\n  font-weight: 900;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n}\n.operator-leaderboard__header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #213958;\n  font-size: 1rem;\n}\n.operator-leaderboard__header[_ngcontent-%COMP%]    > .mat-icon[_ngcontent-%COMP%] {\n  color: #7058df;\n}\n.operator-leaderboard__list[_ngcontent-%COMP%] {\n  grid-row: 2;\n  display: flex;\n  min-height: 0;\n  height: 100%;\n  overflow: hidden;\n}\n@media (max-width: 760px) {\n  .operator-page-scroll[_ngcontent-%COMP%] {\n    padding: 0;\n  }\n  .operator-home[_ngcontent-%COMP%] {\n    padding: 0.7rem;\n    border-radius: 16px;\n  }\n  .operator-home-header[_ngcontent-%COMP%] {\n    min-height: 48px;\n    padding-right: calc(114px + 0.52rem);\n    padding-bottom: 0.7rem;\n  }\n  .operator-brand[_ngcontent-%COMP%] {\n    min-width: 0;\n  }\n  .operator-brand-mark[_ngcontent-%COMP%] {\n    flex: 0 0 auto;\n    width: 32px;\n    height: 32px;\n  }\n  .operator-brand-text[_ngcontent-%COMP%] {\n    min-width: 0;\n    font-size: 1.7rem;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n  }\n  .operator-actions[_ngcontent-%COMP%]   app-menu[_ngcontent-%COMP%] {\n    --app-menu-mobile-big-columns: 2;\n  }\n  .operator-leaderboard[_ngcontent-%COMP%] {\n    min-height: 0;\n    padding: 0.65rem;\n    grid-template-rows: auto minmax(0, 1fr);\n  }\n}\n/*# sourceMappingURL=operator-page.component.css.map */'], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OperatorPageComponent, [{
    type: Component,
    args: [{ selector: "app-operator-page", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, imports: [
      AppMenuComponent,
      DeploymentBrandComponent,
      IndicatorComponent,
      I18nPipe,
      MatIconModule,
      NgComponentOutlet,
      SingleRowComponent,
      SmartListComponent
    ], template: `<div class="operator-page-scroll">
  <main class="operator-home" [attr.aria-busy]="loading()">
    <header class="operator-home-header">
      <a class="operator-brand" [attr.aria-label]="deploymentBranding().productName">
        <app-deployment-brand
          [branding]="deploymentBranding()"
        ></app-deployment-brand>
      </a>
    </header>

    @if (loading()) {
      <section class="operator-home-loading" aria-busy="true" aria-live="polite">
        <app-indicator kind="load-ring" state="loading"></app-indicator>
        <span>{{ 'operator.workspace.loading' | i18n }}</span>
      </section>
    } @else {
      @if (errorMessage()) {
        <p class="operator-state-message operator-state-message--error" role="alert">
          <mat-icon>error_outline</mat-icon>
          <span>{{ errorMessage() | i18n }}</span>
        </p>
      }

      <section class="operator-actions" [attr.aria-label]="'operator.actions' | i18n">
        <app-menu
          kind="inline"
          layout="row"
          [items]="actionItems()"
          (itemSelect)="openAction($event)"
        ></app-menu>
      </section>

      <section class="operator-leaderboard" aria-labelledby="operator-leaderboard-title">
        <header class="operator-leaderboard__header">
          <span>
            <small>{{ 'operator.leaderboard.network' | i18n }}</small>
            <h1 id="operator-leaderboard-title">{{ 'operator.leaderboard' | i18n }}</h1>
          </span>
          <mat-icon>leaderboard</mat-icon>
        </header>

        <app-smart-list
          #leaderboardSmartList
          class="operator-leaderboard__list"
          [config]="leaderboardConfig"
          [loadPage]="loadLeaderboardPage"
          [query]="leaderboardQuery()"
          [itemTemplate]="leaderboardRowTemplate"
          (itemSelect)="openLeaderboardDeployments($event)"
        ></app-smart-list>

        <ng-template
          #leaderboardRowTemplate
          let-entry
          let-selectItem="selectItem"
        >
          <single-row
            [row]="leaderboardRow(entry)"
            [ariaLabel]="leaderboardRowAriaLabel(entry)"
            (rowClick)="selectItem($event)"
          ></single-row>
        </ng-template>
      </section>
    }
  </main>
</div>

@if (activePopup() === 'registration') {
  @if (registrationPopupComponent(); as component) {
    <ng-container *ngComponentOutlet="component"></ng-container>
  }
} @else if (activePopup()) {
  @if (actionPopupComponent(); as component) {
    <ng-container *ngComponentOutlet="component"></ng-container>
  }
}
`, styles: ['/* src/app/operator/components/operator-page/operator-page.component.scss */\n:host {\n  display: block;\n  height: 100%;\n  min-height: 0;\n  overflow: hidden;\n  color: #22324a;\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n* {\n  box-sizing: border-box;\n}\n.operator-page-scroll {\n  width: 100%;\n  height: 100%;\n  min-height: 0;\n  padding: 0.1rem;\n  display: flex;\n  overflow: hidden;\n}\n.operator-home {\n  width: min(1160px, 100%);\n  height: 100%;\n  min-height: 0;\n  margin: 0 auto;\n  padding: 0.9rem;\n  border: 1px solid rgba(30, 51, 85, 0.14);\n  border-radius: 18px;\n  background:\n    radial-gradient(\n      circle at 8% -8%,\n      var(--deployment-brand-shadow),\n      transparent 26rem),\n    radial-gradient(\n      circle at 96% 5%,\n      color-mix(in srgb, var(--deployment-brand-secondary) 12%, transparent),\n      transparent 23rem),\n    #f5f6fb;\n  box-shadow: 0 24px 50px rgba(13, 27, 57, 0.08);\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n.operator-home-header {\n  min-height: 54px;\n  padding: 0.1rem 0.15rem 0.9rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.8rem;\n}\n.operator-brand {\n  display: inline-flex;\n  align-items: flex-end;\n  color: var(--deployment-brand-text);\n  font-weight: 900;\n  line-height: 0.8;\n  text-decoration: none;\n  background-image:\n    linear-gradient(\n      90deg,\n      var(--deployment-brand-primary),\n      var(--deployment-brand-secondary),\n      var(--deployment-brand-accent));\n  background-repeat: no-repeat;\n  background-position: 0 100%;\n  background-size: 100% 3px;\n  --deployment-brand-logo-size: 38px;\n  font-size: 2rem;\n}\n.operator-home-loading {\n  flex: 1 1 auto;\n  min-height: 280px;\n  display: grid;\n  place-items: center;\n  align-content: center;\n  gap: 0.5rem;\n  color: rgba(34, 55, 84, 0.78);\n  font-size: 0.84rem;\n  font-weight: 900;\n  text-align: center;\n}\n.operator-state-message {\n  flex: 0 0 auto;\n  min-height: 38px;\n  margin: 0 0 0.72rem;\n  padding: 0.58rem 0.72rem;\n  border: 1px solid rgba(178, 58, 78, 0.24);\n  border-radius: 12px;\n  background: rgba(255, 239, 242, 0.94);\n  color: #8d2d3d;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-size: 0.78rem;\n  font-weight: 800;\n}\n.operator-state-message .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.operator-actions {\n  flex: 0 0 auto;\n  min-width: 0;\n}\n.operator-leaderboard {\n  flex: 1 1 auto;\n  min-height: 0;\n  margin-top: 0.8rem;\n  padding: 0.85rem;\n  border: 1px solid rgba(36, 59, 92, 0.12);\n  border-radius: 16px;\n  background: rgba(255, 255, 255, 0.95);\n  box-shadow: 0 12px 28px rgba(22, 40, 70, 0.05);\n  display: grid;\n  grid-template-rows: auto minmax(0, 1fr);\n  gap: 0.65rem;\n  overflow: hidden;\n}\n.operator-leaderboard__header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.7rem;\n}\n.operator-leaderboard__header span {\n  display: grid;\n  gap: 0.08rem;\n}\n.operator-leaderboard__header small {\n  color: #6d57c7;\n  font-size: 0.66rem;\n  font-weight: 900;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n}\n.operator-leaderboard__header h1 {\n  margin: 0;\n  color: #213958;\n  font-size: 1rem;\n}\n.operator-leaderboard__header > .mat-icon {\n  color: #7058df;\n}\n.operator-leaderboard__list {\n  grid-row: 2;\n  display: flex;\n  min-height: 0;\n  height: 100%;\n  overflow: hidden;\n}\n@media (max-width: 760px) {\n  .operator-page-scroll {\n    padding: 0;\n  }\n  .operator-home {\n    padding: 0.7rem;\n    border-radius: 16px;\n  }\n  .operator-home-header {\n    min-height: 48px;\n    padding-right: calc(114px + 0.52rem);\n    padding-bottom: 0.7rem;\n  }\n  .operator-brand {\n    min-width: 0;\n  }\n  .operator-brand-mark {\n    flex: 0 0 auto;\n    width: 32px;\n    height: 32px;\n  }\n  .operator-brand-text {\n    min-width: 0;\n    font-size: 1.7rem;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n  }\n  .operator-actions app-menu {\n    --app-menu-mobile-big-columns: 2;\n  }\n  .operator-leaderboard {\n    min-height: 0;\n    padding: 0.65rem;\n    grid-template-rows: auto minmax(0, 1fr);\n  }\n}\n/*# sourceMappingURL=operator-page.component.css.map */\n'] }]
  }], () => [], { leaderboardSmartList: [{
    type: ViewChild,
    args: ["leaderboardSmartList"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(OperatorPageComponent, { className: "OperatorPageComponent", filePath: "app/operator/components/operator-page/operator-page.component.ts", lineNumber: 75 });
})();
export {
  OperatorPageComponent
};
//# sourceMappingURL=operator-page.component-M46O7I2V.js.map
