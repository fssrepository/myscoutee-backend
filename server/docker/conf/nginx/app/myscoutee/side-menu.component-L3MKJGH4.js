import {
  AppSetupStore
} from "./chunk-6ZREMSFX.js";
import {
  PwaService
} from "./chunk-BGAUSF4L.js";
import {
  AssetPopupStore
} from "./chunk-PUXHWXJS.js";
import {
  resolveSideMenuPresentation
} from "./chunk-3NMEXGBG.js";
import {
  ActivityInvitePopupStore,
  EventEditorPopupStore
} from "./chunk-SO4H7EEV.js";
import {
  DialogComponent
} from "./chunk-A5EFM5SA.js";
import {
  OperatorMenuStore
} from "./chunk-ZCVNJBPR.js";
import {
  NotificationCenterStore
} from "./chunk-WECUVFZO.js";
import {
  AdminWorkspaceStore
} from "./chunk-SWOC25HB.js";
import {
  AdminMenuStore
} from "./chunk-EEP5RO7H.js";
import {
  MemberMenuStore
} from "./chunk-DMX7RGEB.js";
import {
  ProfileStore
} from "./chunk-O6ZAHHD6.js";
import {
  SubEventResourcePopupStore
} from "./chunk-22BOAOHJ.js";
import {
  NavigationEnd,
  Router
} from "./chunk-666FMAP4.js";
import {
  ProfileHeaderCardConverter
} from "./chunk-QTZRA7AZ.js";
import "./chunk-2XAMZBDM.js";
import {
  PaymentMethodsPopupStore
} from "./chunk-EJ5KWFDD.js";
import {
  AssetStore
} from "./chunk-OYOBMUF7.js";
import {
  ActivitiesPopupStore,
  eventChatHeaderStateFromChat,
  eventChatPopupRequestFromChat
} from "./chunk-5GUOJYST.js";
import {
  DialogStore
} from "./chunk-4DNL6LXE.js";
import {
  HeaderCardComponent
} from "./chunk-Z4E5Y2UC.js";
import {
  UiPollCoordinator,
  UiTaskScheduler
} from "./chunk-EA3MO7BB.js";
import "./chunk-Z7T4C7EV.js";
import {
  ChatsService,
  ExplanationGuideService,
  HelpCenterService,
  PrivacyPolicyService,
  TermsPolicyService
} from "./chunk-JNYVIKB6.js";
import "./chunk-522CXB3E.js";
import "./chunk-HWWKH4YJ.js";
import "./chunk-LFVP4M73.js";
import {
  PopupComponent
} from "./chunk-ERGA5DCY.js";
import {
  PopupPresenceStore
} from "./chunk-ADBOYRJ7.js";
import "./chunk-EAXEH725.js";
import {
  AppMenuComponent,
  IndicatorComponent
} from "./chunk-53UGBDSO.js";
import {
  backendUnavailable
} from "./chunk-67ETDNJE.js";
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
  USER_BY_ID_LOAD_CONTEXT_KEY,
  USER_LOGOUT_CONTEXT_KEY,
  USER_PROFILE_SAVE_CONTEXT_KEY,
  UsersService
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
import {
  ActivityStore,
  UserProfileStore,
  cloneEventCounters,
  cloneSupportCaseCounters
} from "./chunk-IEWB22H3.js";
import "./chunk-UKS3QROH.js";
import "./chunk-C6JV7CA3.js";
import {
  ASSET_FILTER_TICKET,
  ASSET_TYPE_ACCOMMODATION,
  ASSET_TYPE_SUPPLIES,
  ASSET_TYPE_TRANSPORT
} from "./chunk-N7OBXPJA.js";
import {
  I18nService
} from "./chunk-AOUY6FNC.js";
import {
  CommonModule,
  NgComponentOutlet
} from "./chunk-SCHUURLR.js";
import {
  AppUtils
} from "./chunk-CYVMX3LD.js";
import {
  SessionService
} from "./chunk-HDBJPOT3.js";
import {
  APP_STORAGE_KEYS
} from "./chunk-LDZENZ35.js";
import "./chunk-DZ6OOOZN.js";
import "./chunk-ODJSNRFC.js";
import {
  Component,
  HostListener,
  ViewChild,
  __objRest,
  __spreadProps,
  __spreadValues,
  computed,
  effect,
  environment,
  inject,
  setClassMetadata,
  setClassMetadataAsync,
  signal,
  untracked,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefer,
  ɵɵdeferWhen,
  ɵɵdefineComponent,
  ɵɵdomTemplate,
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
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵresetView,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵviewQuery
} from "./chunk-EV3I3YNV.js";

// src/app/shared/ui/components/side-menu/navigator-hydration-route.ts
function isNavigatorHydrationRoute(routeUrl) {
  const path = AppUtils.normalizeRoutePath(routeUrl);
  return path !== "/" && !path.startsWith("/entry") && !path.startsWith("/admin");
}

// src/app/shared/ui/components/side-menu/user-realtime-popup-policy.ts
function shouldApplyUserRealtimeDomainSnapshot(popupVisible) {
  return popupVisible !== true;
}

// src/app/shared/ui/components/side-menu/session-active-user-sync.ts
function installSessionActiveUserSync(session, activeUserId, setActiveUserId) {
  let previousSessionKey = null;
  effect(() => {
    const currentSession = session();
    const sessionUserId = currentSession?.kind === "firebase" ? currentSession.profile.id.trim() : currentSession?.kind === "demo" ? currentSession.userId.trim() : "";
    const sessionKey = currentSession?.kind === "operator-bootstrap" ? `operator-bootstrap:${currentSession.email.trim()}` : currentSession ? `${currentSession.kind}:${sessionUserId}` : "none";
    if (previousSessionKey === sessionKey) {
      return;
    }
    previousSessionKey = sessionKey;
    if (currentSession?.kind === "operator-bootstrap") {
      return;
    }
    const currentActiveUserId = untracked(activeUserId).trim();
    if (currentActiveUserId === sessionUserId) {
      return;
    }
    setActiveUserId(sessionUserId);
  });
}

// src/app/shared/ui/components/side-menu/side-menu.component.ts
var _c0 = ["notificationDismissTarget"];
var SideMenuComponent_Defer_4_DepsFn = () => [import("./settings-popups.component-YBZMLK6H.js").then((m) => m.ProfileSettingsPopupsComponent)];
var SideMenuComponent_Defer_12_DepsFn = () => [import("./notification-center-popup.component-DC3JMADS.js").then((m) => m.NotificationCenterPopupComponent)];
function SideMenuComponent_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-menu", 8);
    \u0275\u0275listener("itemSelect", function SideMenuComponent_Conditional_0_Conditional_2_Template_app_menu_itemSelect_0_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onOperatorCommunityMenuSelect($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("model", ctx_r2.operatorCommunityMenuModel());
  }
}
function SideMenuComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 4)(1, "div", 5);
    \u0275\u0275conditionalCreate(2, SideMenuComponent_Conditional_0_Conditional_2_Template, 1, 1, "app-menu", 6);
    \u0275\u0275elementStart(3, "app-menu", 7);
    \u0275\u0275listener("itemSelect", function SideMenuComponent_Conditional_0_Template_app_menu_itemSelect_3_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onAvatarMenuSelect($event));
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classProp("is-open", ctx_r2.isMenuOpen())("is-covered", ctx_r2.isCoveredByAssetPopup())("is-notification-open", ctx_r2.notificationCenterStore.isOpen());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.isOperatorMode() ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("items", ctx_r2.avatarMenuItems());
  }
}
function SideMenuComponent_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12, 0)(2, "mat-icon");
    \u0275\u0275text(3, "close");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("is-over", ctx_r2.notificationDismissTargeted());
  }
}
function SideMenuComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 9)(1, "app-menu", 10);
    \u0275\u0275listener("dragPositionChange", function SideMenuComponent_Conditional_1_Template_app_menu_dragPositionChange_1_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onNotificationDragPositionChange($event));
    })("dragStateChange", function SideMenuComponent_Conditional_1_Template_app_menu_dragStateChange_1_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onNotificationDragStateChange($event));
    })("itemSelect", function SideMenuComponent_Conditional_1_Template_app_menu_itemSelect_1_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onNotificationAttentionSelect($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(2, SideMenuComponent_Conditional_1_Conditional_2_Template, 4, 2, "div", 11);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classProp("is-chat-open", ctx_r2.activitiesStore.eventChatOpen() || ctx_r2.activitiesStore.stackedEventChatOpen())("is-checkout-open", ctx_r2.eventEditorStore.isOpen() && ctx_r2.eventEditorStore.presentation().mode === "checkout-review")("is-popup-open", ctx_r2.popupPresenceStore.visible());
    \u0275\u0275advance();
    \u0275\u0275property("draggable", true)("dragActivationDelayMs", ctx_r2.notificationDragActivationDelayMs)("dragPosition", ctx_r2.notificationCenterStore.dragPosition())("trigger", ctx_r2.notificationAttentionTrigger());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.notificationDismissDragging() ? 2 : -1);
  }
}
function SideMenuComponent_Conditional_2_Conditional_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 24);
    \u0275\u0275listener("click", function SideMenuComponent_Conditional_2_Conditional_0_Conditional_0_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.onCloseMenu());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ui_r7 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("open", ui_r7.open)("is-covered", ctx_r2.isCoveredByAssetPopup());
  }
}
function SideMenuComponent_Conditional_2_Conditional_0_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-menu", 25);
    \u0275\u0275listener("itemSelect", function SideMenuComponent_Conditional_2_Conditional_0_Conditional_16_Template_app_menu_itemSelect_0_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.onAdminNavigatorMenuSelect($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275property("model", ctx_r2.adminNavigatorMenuModel())("value", ctx_r2.adminNavigatorMenuValues());
  }
}
function SideMenuComponent_Conditional_2_Conditional_0_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-menu", 25);
    \u0275\u0275listener("itemSelect", function SideMenuComponent_Conditional_2_Conditional_0_Conditional_17_Template_app_menu_itemSelect_0_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.onNavigatorMenuSelect($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275property("model", ctx_r2.navigatorMenuModel())("value", ctx_r2.navigatorMenuValues());
  }
}
function SideMenuComponent_Conditional_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275conditionalCreate(0, SideMenuComponent_Conditional_2_Conditional_0_Conditional_0_Template, 1, 4, "div", 13);
    \u0275\u0275elementStart(1, "aside", 14)(2, "div", 15)(3, "div", 16)(4, "button", 17);
    \u0275\u0275listener("click", function SideMenuComponent_Conditional_2_Conditional_0_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.openAppSetup());
    });
    \u0275\u0275elementStart(5, "mat-icon");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "app-header-card", 18);
    \u0275\u0275listener("edit", function SideMenuComponent_Conditional_2_Conditional_0_Template_app_header_card_edit_9_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.openNavigatorHeaderProfile($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 19)(11, "app-menu", 20);
    \u0275\u0275listener("itemSelect", function SideMenuComponent_Conditional_2_Conditional_0_Template_app_menu_itemSelect_11_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onNavigatorHeaderActionMenuSelect($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "button", 21);
    \u0275\u0275listener("click", function SideMenuComponent_Conditional_2_Conditional_0_Template_button_click_12_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext(2);
      $event.stopPropagation();
      return \u0275\u0275resetView(ctx_r2.onCloseMenu());
    });
    \u0275\u0275elementStart(13, "mat-icon");
    \u0275\u0275text(14, "close");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(15, "div", 22);
    \u0275\u0275conditionalCreate(16, SideMenuComponent_Conditional_2_Conditional_0_Conditional_16_Template, 1, 2, "app-menu", 23)(17, SideMenuComponent_Conditional_2_Conditional_0_Conditional_17_Template, 1, 2, "app-menu", 23);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ui_r7 = ctx;
    const user_r10 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ui_r7.open ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275classProp("open", ui_r7.open)("is-covered", ctx_r2.isCoveredByAssetPopup());
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.pwaService.installAvailable() ? "install_desktop" : "settings");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.installLabel());
    \u0275\u0275advance();
    \u0275\u0275property("model", ctx_r2.navigatorHeaderCardModel(user_r10));
    \u0275\u0275advance(2);
    \u0275\u0275property("model", ctx_r2.navigatorHeaderActionMenuModel());
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r2.isAdminMode() ? 16 : !ctx_r2.isOperatorMode() ? 17 : -1);
  }
}
function SideMenuComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, SideMenuComponent_Conditional_2_Conditional_0_Template, 18, 10);
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_2_0 = ctx_r2.menuUiState()) ? 0 : -1, tmp_2_0);
  }
}
function SideMenuComponent_Defer_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-profile-settings-popups");
  }
}
function SideMenuComponent_Conditional_6_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function SideMenuComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, SideMenuComponent_Conditional_6_ng_container_0_Template, 1, 0, "ng-container", 26);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function SideMenuComponent_Conditional_7_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1, "error_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 17);
    \u0275\u0275listener("click", function SideMenuComponent_Conditional_7_Conditional_2_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.profileStore.ensureProfileEditorLoaded());
    });
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 1, "try.again"));
  }
}
function SideMenuComponent_Conditional_7_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-indicator", 28);
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(3, 1, "loading.profile", "Loading profile"));
  }
}
function SideMenuComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-popup", 2)(1, "div", 27);
    \u0275\u0275conditionalCreate(2, SideMenuComponent_Conditional_7_Conditional_2_Template, 5, 3)(3, SideMenuComponent_Conditional_7_Conditional_3_Template, 4, 4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r2.profileEditorLoadingModel);
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-busy", !ctx_r2.profileStore.profileEditorLoadFailed());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.profileStore.profileEditorLoadFailed() ? 2 : 3);
  }
}
function SideMenuComponent_Conditional_8_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function SideMenuComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, SideMenuComponent_Conditional_8_ng_container_0_Template, 1, 0, "ng-container", 26);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function SideMenuComponent_Conditional_9_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function SideMenuComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, SideMenuComponent_Conditional_9_ng_container_0_Template, 1, 0, "ng-container", 26);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function SideMenuComponent_Defer_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-notification-center-popup");
  }
}
function SideMenuComponent_Conditional_14_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function SideMenuComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, SideMenuComponent_Conditional_14_ng_container_0_Template, 1, 0, "ng-container", 26);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function SideMenuComponent_Conditional_15_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function SideMenuComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, SideMenuComponent_Conditional_15_ng_container_0_Template, 1, 0, "ng-container", 26);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function SideMenuComponent_Conditional_16_Conditional_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function SideMenuComponent_Conditional_16_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, SideMenuComponent_Conditional_16_Conditional_0_ng_container_0_Template, 1, 0, "ng-container", 26);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function SideMenuComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, SideMenuComponent_Conditional_16_Conditional_0_Template, 1, 1, "ng-container");
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_1_0 = ctx_r2.subEventResourceStore.eventResourcePopupComponent()) ? 0 : -1, tmp_1_0);
  }
}
function SideMenuComponent_Conditional_17_Conditional_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function SideMenuComponent_Conditional_17_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, SideMenuComponent_Conditional_17_Conditional_0_ng_container_0_Template, 1, 0, "ng-container", 26);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function SideMenuComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, SideMenuComponent_Conditional_17_Conditional_0_Template, 1, 1, "ng-container");
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_1_0 = ctx_r2.subEventResourceStore.eventResourceAssetExploreComponent()) ? 0 : -1, tmp_1_0);
  }
}
function SideMenuComponent_Conditional_18_Conditional_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function SideMenuComponent_Conditional_18_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, SideMenuComponent_Conditional_18_Conditional_0_ng_container_0_Template, 1, 0, "ng-container", 26);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function SideMenuComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, SideMenuComponent_Conditional_18_Conditional_0_Template, 1, 1, "ng-container");
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_1_0 = ctx_r2.subEventResourceStore.eventSupplyContributionsPopupComponent()) ? 0 : -1, tmp_1_0);
  }
}
function SideMenuComponent_Conditional_19_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function SideMenuComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, SideMenuComponent_Conditional_19_ng_container_0_Template, 1, 0, "ng-container", 26);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function SideMenuComponent_Conditional_20_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function SideMenuComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, SideMenuComponent_Conditional_20_ng_container_0_Template, 1, 0, "ng-container", 26);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function SideMenuComponent_Conditional_21_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function SideMenuComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, SideMenuComponent_Conditional_21_ng_container_0_Template, 1, 0, "ng-container", 26);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function SideMenuComponent_Conditional_22_Conditional_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function SideMenuComponent_Conditional_22_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, SideMenuComponent_Conditional_22_Conditional_0_ng_container_0_Template, 1, 0, "ng-container", 26);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function SideMenuComponent_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, SideMenuComponent_Conditional_22_Conditional_0_Template, 1, 1, "ng-container");
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_1_0 = ctx_r2.activitiesStore.eventChatPopupComponent()) ? 0 : -1, tmp_1_0);
  }
}
function SideMenuComponent_Conditional_23_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function SideMenuComponent_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, SideMenuComponent_Conditional_23_ng_container_0_Template, 1, 0, "ng-container", 26);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function SideMenuComponent_Conditional_24_Conditional_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function SideMenuComponent_Conditional_24_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, SideMenuComponent_Conditional_24_Conditional_0_ng_container_0_Template, 1, 0, "ng-container", 29);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngComponentOutlet", ctx)("ngComponentOutletInputs", ctx_r2.stackedEventChatPopupInputs());
  }
}
function SideMenuComponent_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, SideMenuComponent_Conditional_24_Conditional_0_Template, 1, 2, "ng-container");
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_1_0 = ctx_r2.activitiesStore.eventChatPopupComponent()) ? 0 : -1, tmp_1_0);
  }
}
function SideMenuComponent_Conditional_25_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function SideMenuComponent_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, SideMenuComponent_Conditional_25_ng_container_0_Template, 1, 0, "ng-container", 26);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function SideMenuComponent_Conditional_26_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function SideMenuComponent_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, SideMenuComponent_Conditional_26_ng_container_0_Template, 1, 0, "ng-container", 26);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function SideMenuComponent_Conditional_27_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function SideMenuComponent_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, SideMenuComponent_Conditional_27_ng_container_0_Template, 1, 0, "ng-container", 26);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function SideMenuComponent_Conditional_28_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function SideMenuComponent_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, SideMenuComponent_Conditional_28_ng_container_0_Template, 1, 0, "ng-container", 26);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function SideMenuComponent_Conditional_29_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function SideMenuComponent_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, SideMenuComponent_Conditional_29_ng_container_0_Template, 1, 0, "ng-container", 26);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
var SideMenuComponent = class _SideMenuComponent {
  static ACCOUNT_REACTIVATION_WINDOW_MS = 30 * 24 * 60 * 60 * 1e3;
  static ADMIN_SESSION_STORAGE_KEY = APP_STORAGE_KEYS.adminSession;
  static USER_MENU_LOAD_DURATION_MS = 3e3;
  static NOTIFICATION_DRAG_ACTIVATION_DELAY_MS = 350;
  static NOTIFICATION_DISMISS_TARGET_PADDING_PX = 10;
  notificationDismissTargetRef;
  router = inject(Router);
  userProfileStore = inject(UserProfileStore);
  runtimeStore = inject(AppRuntimeStore);
  activityStore = inject(ActivityStore);
  memberMenuStore = inject(MemberMenuStore);
  activityInviteStore = inject(ActivityInvitePopupStore);
  adminMenuStore = inject(AdminMenuStore);
  adminWorkspaceStore = inject(AdminWorkspaceStore);
  operatorMenuStore = inject(OperatorMenuStore);
  deploymentConfiguration = inject(DeploymentConfigurationService);
  deploymentBranding = this.deploymentConfiguration.branding;
  explanationGuide = inject(ExplanationGuideService);
  helpCenterService = inject(HelpCenterService);
  privacyPolicy = inject(PrivacyPolicyService);
  termsPolicy = inject(TermsPolicyService);
  i18n = inject(I18nService);
  pwaService = inject(PwaService);
  appSetupStore = inject(AppSetupStore);
  installLabel = computed(() => {
    this.i18n.revision();
    return this.i18n.translate(this.pwaService.installAvailable() ? "install.app" : "app.setup.permissions");
  }, ...ngDevMode ? [{ debugName: "installLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  openAppSetup() {
    this.appSetupStore.open();
  }
  usersService = inject(UsersService);
  sessionService = inject(SessionService);
  chatsService = inject(ChatsService);
  dialogStore = inject(DialogStore);
  notificationCenterStore = inject(NotificationCenterStore);
  popupPresenceStore = inject(PopupPresenceStore);
  paymentMethodsPopupStore = inject(PaymentMethodsPopupStore);
  pollCoordinator = inject(UiPollCoordinator);
  profileStore = inject(ProfileStore);
  profileEditorLoadingModel = {
    title: "Profile",
    ariaLabel: "Profile",
    size: "wide",
    height: "full",
    bodyLayout: "fill",
    onClose: () => this.profileStore.closeProfileEditor()
  };
  activitiesStore = inject(ActivitiesPopupStore);
  assetPopupStore = inject(AssetPopupStore);
  assetStore = inject(AssetStore);
  eventEditorStore = inject(EventEditorPopupStore);
  subEventResourceStore = inject(SubEventResourcePopupStore);
  stackedEventChatPopupInputs = computed(() => ({
    chatSession: this.activitiesStore.stackedEventChatSession(),
    chatHeader: this.activitiesStore.stackedEventChatHeader(),
    closeHostedChat: () => this.activitiesStore.closeStackedEventChat()
  }), ...ngDevMode ? [{ debugName: "stackedEventChatPopupInputs" }] : (
    /* istanbul ignore next */
    []
  ));
  notificationRouteUrl = signal(this.router.url, ...ngDevMode ? [{ debugName: "notificationRouteUrl" }] : (
    /* istanbul ignore next */
    []
  ));
  openingNotificationChat = "";
  currentRoutePathRef = signal(AppUtils.normalizeRoutePath(this.router.url), ...ngDevMode ? [{ debugName: "currentRoutePathRef" }] : (
    /* istanbul ignore next */
    []
  ));
  menuOpenRef = signal(false, ...ngDevMode ? [{ debugName: "menuOpenRef" }] : (
    /* istanbul ignore next */
    []
  ));
  notificationDismissDraggingRef = signal(false, ...ngDevMode ? [{ debugName: "notificationDismissDraggingRef" }] : (
    /* istanbul ignore next */
    []
  ));
  notificationDismissTargetedRef = signal(false, ...ngDevMode ? [{ debugName: "notificationDismissTargetedRef" }] : (
    /* istanbul ignore next */
    []
  ));
  userMenuLoadOverdueRef = signal(false, ...ngDevMode ? [{ debugName: "userMenuLoadOverdueRef" }] : (
    /* istanbul ignore next */
    []
  ));
  activeUserLoadState = this.runtimeStore.selectLoadingState(USER_BY_ID_LOAD_CONTEXT_KEY);
  profileSaveLoadState = this.runtimeStore.selectLoadingState(USER_PROFILE_SAVE_CONTEXT_KEY);
  userLogoutLoadState = this.runtimeStore.selectLoadingState(USER_LOGOUT_CONTEXT_KEY);
  routerEventsSubscription;
  hydrationRequestKeyRef = signal("", ...ngDevMode ? [{ debugName: "hydrationRequestKeyRef" }] : (
    /* istanbul ignore next */
    []
  ));
  privacyConsentCheckKeyRef = signal("", ...ngDevMode ? [{ debugName: "privacyConsentCheckKeyRef" }] : (
    /* istanbul ignore next */
    []
  ));
  profileBindings = {};
  lastHandledActivitiesRequestMs = 0;
  lastHandledAssetRequestMs = 0;
  lastHandledEventFeedbackRequestMs = 0;
  hydrationRequestVersion = 0;
  userRealtimeScheduler = new UiTaskScheduler({
    intervalMs: () => this.userRealtimePollIntervalMs(),
    state: () => this.userProfileStore.activeUserId().trim(),
    task: ({ state, signal: signal2 }) => this.runUserRealtimeLongPollTick(state, signal2),
    pollCoordinator: this.pollCoordinator,
    pollPriority: "notification"
  });
  reactivationPromptUserId = "";
  privacyConsentCheckToken = 0;
  userMenuLoadOverdueTimer = null;
  avatarState = computed(() => {
    const user = this.userProfileStore.activeUserProfile();
    const session = this.sessionService.currentSession();
    const profileImage = AppUtils.firstImageUrl(user?.images);
    const previewMatches = session?.kind === "firebase" && (!this.canToggleAvatarMenu() || session.avatarImageUrl === profileImage);
    const previewImage = previewMatches ? session.avatarImageDataUrl ?? session.avatarImageUrl : void 0;
    return {
      badgeCount: user ? this.resolveUserBadgeCount(user) : 0,
      imageUrl: AppUtils.mediaImageVariantUrl(previewImage ?? profileImage, "small") || null
    };
  }, ...ngDevMode ? [{ debugName: "avatarState" }] : (
    /* istanbul ignore next */
    []
  ));
  menuUiState = computed(() => ({
    open: this.menuOpenRef()
  }), ...ngDevMode ? [{ debugName: "menuUiState" }] : (
    /* istanbul ignore next */
    []
  ));
  notificationDismissDragging = this.notificationDismissDraggingRef.asReadonly();
  notificationDismissTargeted = this.notificationDismissTargetedRef.asReadonly();
  notificationDragActivationDelayMs = _SideMenuComponent.NOTIFICATION_DRAG_ACTIVATION_DELAY_MS;
  isCoveredByAssetPopup = computed(() => this.assetPopupStore.visible() || this.activityInviteStore.activityInvitePopup() !== null, ...ngDevMode ? [{ debugName: "isCoveredByAssetPopup" }] : (
    /* istanbul ignore next */
    []
  ));
  avatarVisible = computed(() => {
    const path = this.currentRoutePathRef();
    const activeUserId = this.userProfileStore.activeUserId().trim();
    return Boolean(activeUserId) && path !== "/" && !path.startsWith("/entry");
  }, ...ngDevMode ? [{ debugName: "avatarVisible" }] : (
    /* istanbul ignore next */
    []
  ));
  hasBindings = computed(() => this.profileStore.bindings() !== null, ...ngDevMode ? [{ debugName: "hasBindings" }] : (
    /* istanbul ignore next */
    []
  ));
  isMenuOpen = computed(() => this.menuUiState().open, ...ngDevMode ? [{ debugName: "isMenuOpen" }] : (
    /* istanbul ignore next */
    []
  ));
  hasOfflineProfile = computed(() => this.connectionOffline() && this.userProfileStore.activeUserProfile() !== null, ...ngDevMode ? [{ debugName: "hasOfflineProfile" }] : (
    /* istanbul ignore next */
    []
  ));
  canToggleAvatarMenu = computed(() => this.avatarVisible() && this.hasBindings() && (this.activeUserLoadState().status === "success" || this.hasOfflineProfile()), ...ngDevMode ? [{ debugName: "canToggleAvatarMenu" }] : (
    /* istanbul ignore next */
    []
  ));
  isProfileSaving = computed(() => this.profileSaveLoadState().status === "loading", ...ngDevMode ? [{ debugName: "isProfileSaving" }] : (
    /* istanbul ignore next */
    []
  ));
  hasProfileSaveError = computed(() => {
    const status = this.profileSaveLoadState().status;
    return status === "error" || status === "timeout";
  }, ...ngDevMode ? [{ debugName: "hasProfileSaveError" }] : (
    /* istanbul ignore next */
    []
  ));
  isLoggingOut = computed(() => this.userLogoutLoadState().status === "loading", ...ngDevMode ? [{ debugName: "isLoggingOut" }] : (
    /* istanbul ignore next */
    []
  ));
  isAvatarRingLoading = computed(() => this.isProfileSaving() || this.isLoggingOut(), ...ngDevMode ? [{ debugName: "isAvatarRingLoading" }] : (
    /* istanbul ignore next */
    []
  ));
  showProfileSaveRing = computed(() => this.isAvatarRingLoading() || this.hasProfileSaveError(), ...ngDevMode ? [{ debugName: "showProfileSaveRing" }] : (
    /* istanbul ignore next */
    []
  ));
  profileSaveAvatarTitle = computed(() => {
    if (this.isLoggingOut()) {
      return "Logging out";
    }
    if (this.isProfileSaving()) {
      return "Saving profile";
    }
    if (this.hasProfileSaveError()) {
      return this.profileSaveLoadState().status === "timeout" ? "Profile save timed out" : "Profile was not able to save";
    }
    return null;
  }, ...ngDevMode ? [{ debugName: "profileSaveAvatarTitle" }] : (
    /* istanbul ignore next */
    []
  ));
  avatarLoading = computed(() => {
    if (!this.avatarVisible()) {
      return false;
    }
    if (!this.hasBindings()) {
      return true;
    }
    if (this.hasOfflineProfile()) {
      return this.isProfileSaving();
    }
    const status = this.activeUserLoadState().status;
    return status === "idle" || status === "loading" || this.isProfileSaving();
  }, ...ngDevMode ? [{ debugName: "avatarLoading" }] : (
    /* istanbul ignore next */
    []
  ));
  avatarLoadError = computed(() => {
    if (!this.avatarVisible() || !this.hasBindings()) {
      return false;
    }
    if (this.hasOfflineProfile()) {
      return this.hasProfileSaveError();
    }
    const status = this.activeUserLoadState().status;
    return status === "error" || status === "timeout" || this.userMenuLoadOverdueRef() || this.hasProfileSaveError();
  }, ...ngDevMode ? [{ debugName: "avatarLoadError" }] : (
    /* istanbul ignore next */
    []
  ));
  showAvatarLoadRing = computed(() => this.avatarVisible() && (!this.canToggleAvatarMenu() || this.isProfileSaving() || this.hasProfileSaveError()), ...ngDevMode ? [{ debugName: "showAvatarLoadRing" }] : (
    /* istanbul ignore next */
    []
  ));
  avatarBadgeCount = computed(() => this.canToggleAvatarMenu() ? this.avatarState().badgeCount : 0, ...ngDevMode ? [{ debugName: "avatarBadgeCount" }] : (
    /* istanbul ignore next */
    []
  ));
  avatarAriaLabel = computed(() => {
    if (this.canToggleAvatarMenu() && this.isProfileSaving()) {
      return "Saving profile";
    }
    if (this.canToggleAvatarMenu() && this.hasProfileSaveError()) {
      return "Profile save failed";
    }
    if (this.canToggleAvatarMenu()) {
      return this.isMenuOpen() ? "Close user menu" : "Open user menu";
    }
    if (this.avatarLoadError()) {
      return "Profile failed to load";
    }
    return "Loading profile";
  }, ...ngDevMode ? [{ debugName: "avatarAriaLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  avatarMenuItems = computed(() => {
    const user = this.userProfileStore.activeUserProfile();
    const canToggle = this.canToggleAvatarMenu();
    const imageUrl = this.avatarState().imageUrl ?? "";
    const icon = this.avatarLoading() ? "schedule" : this.avatarLoadError() ? "person_off" : "";
    const badgeCount = this.avatarBadgeCount();
    return [{
      id: "navigator-avatar",
      kind: "action",
      layout: "image",
      palette: canToggle && user?.gender === "man" ? "blue" : canToggle ? "pink" : "neutral",
      imageUrl,
      imageAlt: this.avatarAriaLabel(),
      imageFallback: !imageUrl && canToggle ? user?.initials ?? "" : "",
      icon,
      ariaLabel: this.avatarAriaLabel(),
      disabled: !canToggle,
      counter: canToggle && badgeCount > 0 ? { value: badgeCount, max: 9 } : null,
      progress: this.showAvatarLoadRing() ? {
        state: this.avatarLoadError() ? "error" : "loading",
        shape: "circle",
        durationMs: _SideMenuComponent.USER_MENU_LOAD_DURATION_MS
      } : null,
      context: { kind: "toggle-menu" }
    }];
  }, ...ngDevMode ? [{ debugName: "avatarMenuItems" }] : (
    /* istanbul ignore next */
    []
  ));
  operatorCommunityMenuModel = computed(() => ({
    layout: "grid",
    density: "compact",
    groups: [{
      id: "operator-community-launcher",
      items: [{
        id: "operator-community",
        label: "operator.community",
        icon: "forum",
        palette: "teal",
        active: this.operatorMenuStore.activePopup() === "community",
        disabled: !this.canToggleAvatarMenu(),
        ariaLabel: "operator.community.open"
      }]
    }]
  }), ...ngDevMode ? [{ debugName: "operatorCommunityMenuModel" }] : (
    /* istanbul ignore next */
    []
  ));
  offlineAttentionDismissed = signal(false, ...ngDevMode ? [{ debugName: "offlineAttentionDismissed" }] : (
    /* istanbul ignore next */
    []
  ));
  connectionOffline = computed(() => !this.runtimeStore.isOnline() || backendUnavailable(), ...ngDevMode ? [{ debugName: "connectionOffline" }] : (
    /* istanbul ignore next */
    []
  ));
  serverActionsUnavailable = computed(() => !this.runtimeStore.isDataSourceAvailable() || this.userProfileStore.activeUserLocationMissing() || environment.activitiesDataSource === "http" && backendUnavailable(), ...ngDevMode ? [{ debugName: "serverActionsUnavailable" }] : (
    /* istanbul ignore next */
    []
  ));
  notificationAttentionVisible = computed(() => this.notificationCenterStore.attentionVisible() || this.connectionOffline() && !this.offlineAttentionDismissed() && !this.notificationCenterStore.isOpen(), ...ngDevMode ? [{ debugName: "notificationAttentionVisible" }] : (
    /* istanbul ignore next */
    []
  ));
  notificationAttentionTrigger = computed(() => {
    const unreadCount = this.notificationCenterStore.unreadCount();
    const offline = this.connectionOffline();
    return {
      id: "notification-attention",
      icon: offline ? "cloud_off" : "notifications_active",
      palette: offline ? "offline" : "violet",
      action: "custom",
      hideLabel: true,
      counter: unreadCount > 0 ? { value: unreadCount, max: 99 } : null,
      ariaLabel: this.notificationLauncherAriaLabel(unreadCount, false) + (offline ? " \u2014 Offline" : "")
    };
  }, ...ngDevMode ? [{ debugName: "notificationAttentionTrigger" }] : (
    /* istanbul ignore next */
    []
  ));
  menuUser = computed(() => {
    const activeUser = this.userProfileStore.activeUserProfile();
    if (!activeUser) {
      return null;
    }
    const activityOverrides = this.activityStore.getUserCounterOverrides(activeUser.id);
    const eventCounters = activityOverrides.event ?? activeUser.activities?.event;
    const mergedActivities = __spreadProps(__spreadValues({
      game: activityOverrides.game ?? activeUser.activities?.game ?? 0,
      chats: activityOverrides.chats ?? activeUser.activities?.chats ?? 0,
      invitations: activityOverrides.invitations ?? activeUser.activities?.invitations ?? 0,
      events: activityOverrides.events ?? activeUser.activities?.events ?? 0,
      hosting: activityOverrides.hosting ?? activeUser.activities?.hosting ?? 0,
      cars: activityOverrides.cars ?? activeUser.activities?.cars ?? 0,
      accommodation: activityOverrides.accommodation ?? activeUser.activities?.accommodation ?? 0,
      supplies: activityOverrides.supplies ?? activeUser.activities?.supplies ?? 0,
      tickets: activityOverrides.tickets ?? activeUser.activities?.tickets ?? 0,
      contacts: activityOverrides.contacts ?? activeUser.activities?.contacts ?? 0,
      feedback: activityOverrides.feedback ?? activeUser.activities?.feedback ?? 0,
      notifications: activityOverrides.notifications ?? activeUser.activities?.notifications ?? 0,
      paymentRefundsPending: activityOverrides.paymentRefundsPending ?? activeUser.activities?.paymentRefundsPending ?? 0,
      chat: {
        all: activityOverrides.chat?.all ?? activeUser.activities?.chat?.all ?? 0,
        event: activityOverrides.chat?.event ?? activeUser.activities?.chat?.event ?? 0,
        subEvent: activityOverrides.chat?.subEvent ?? activeUser.activities?.chat?.subEvent ?? 0,
        group: activityOverrides.chat?.group ?? activeUser.activities?.chat?.group ?? 0,
        service: activityOverrides.chat?.service ?? activeUser.activities?.chat?.service ?? 0,
        appSupport: activityOverrides.chat?.appSupport ?? activeUser.activities?.chat?.appSupport ?? 0,
        supportCases: cloneSupportCaseCounters(activityOverrides.chat?.supportCases ?? activeUser.activities?.chat?.supportCases)
      }
    }, eventCounters ? { event: cloneEventCounters(eventCounters) } : {}), {
      adminJobs: activityOverrides.adminJobs ?? activeUser.activities?.adminJobs ?? 0,
      adminMetrics: activityOverrides.adminMetrics ?? activeUser.activities?.adminMetrics ?? 0
    });
    const impressionChangeFlags = this.userProfileStore.getUserImpressionChangeFlags(activeUser.id);
    const traitPresentation = resolveSideMenuPresentation("trait", activeUser.traitLabel ?? "");
    return __spreadProps(__spreadValues({}, activeUser), {
      completion: this.resolveCompletionPercent(activeUser),
      impressions: this.userProfileStore.getUserImpressions(activeUser.id) ?? activeUser.impressions,
      activities: mergedActivities,
      impressionChangeFlags,
      memberImpressionTitle: traitPresentation.memberTitle ?? "Attendee"
    });
  }, ...ngDevMode ? [{ debugName: "menuUser" }] : (
    /* istanbul ignore next */
    []
  ));
  settingsMenuItems = computed(() => {
    const items = [];
    if (!this.isPrivilegedWorkspaceMode()) {
      items.push({
        id: "permissions",
        label: "app.setup.permissions",
        icon: "tune",
        ariaLabel: "app.setup.permissions"
      });
    }
    items.push({
      id: "help",
      label: "Help",
      icon: "help_outline",
      counter: this.helpCenterService.activeVersionLabel(),
      disabled: !this.helpCenterService.hasActiveRevision(),
      ariaLabel: "Open help"
    });
    if (!this.isPrivilegedWorkspaceMode()) {
      items.push({
        id: "feedback",
        label: "Send Feedback",
        icon: "feedback",
        ariaLabel: "Send feedback"
      });
    }
    items.push({
      id: "report-bugs",
      label: "Report Bugs",
      icon: "bug_report",
      href: "https://github.com/fssrepository/myscoutee/issues",
      target: "_blank",
      rel: "noopener noreferrer",
      ariaLabel: "Report bugs"
    }, {
      id: "privacy",
      label: "Privacy",
      icon: "policy",
      counter: this.privacyPolicy.activeVersionLabel(),
      ariaLabel: "Open privacy"
    }, {
      id: "terms",
      label: "Terms",
      icon: "rule",
      counter: this.termsPolicy.activeVersionLabel(),
      ariaLabel: "Open terms"
    });
    if (!this.isPrivilegedWorkspaceMode()) {
      items.push({
        id: "delete-account",
        label: "Delete account",
        icon: "delete_forever",
        palette: "danger",
        ariaLabel: "Delete account"
      });
    }
    items.push({
      id: "logout",
      label: "Logout",
      icon: "logout",
      ariaLabel: "Logout"
    });
    return items;
  }, ...ngDevMode ? [{ debugName: "settingsMenuItems" }] : (
    /* istanbul ignore next */
    []
  ));
  navigatorHeaderActionMenuModel = computed(() => {
    const notificationCount = this.notificationCenterStore.unreadCount();
    const notificationsMuted = this.notificationCenterStore.muted();
    const items = [];
    if (!this.isOperatorMode()) {
      items.push({
        id: "notifications",
        label: "Notifications",
        disabled: this.notificationCenterStore.permissionActionPending(),
        progress: { state: this.notificationCenterStore.permissionBusy() ? "loading" : null },
        icon: this.connectionOffline() ? "cloud_off" : notificationsMuted ? "notifications_off" : "notifications",
        palette: this.connectionOffline() ? "offline" : notificationsMuted ? "slate" : notificationCount > 0 ? "violet" : "neutral",
        counter: notificationCount > 0 ? { value: notificationCount, max: 99 } : null,
        counterTone: "alert",
        ariaLabel: this.notificationLauncherAriaLabel(notificationCount, notificationsMuted) + (this.connectionOffline() ? " \u2014 Offline" : "")
      });
    }
    if (!this.isPrivilegedWorkspaceMode()) {
      items.push({
        id: "explanations",
        label: "Explanations",
        icon: "tips_and_updates",
        kind: "toggle",
        checked: this.explanationGuide.enabled(),
        ariaLabel: this.explanationGuide.enabled() ? "Turn explanations off" : "Turn explanations on"
      }, {
        id: "share",
        label: `Share ${this.deploymentBranding().productName}`,
        icon: "share",
        ariaLabel: `Share ${this.deploymentBranding().productName}`
      });
    }
    items.push({
      id: "settings",
      label: "Settings",
      icon: "settings",
      ariaLabel: this.isOperatorMode() ? "Open operator settings menu" : this.isAdminMode() ? "Open admin settings menu" : "Open settings menu",
      items: this.settingsMenuItems()
    });
    return {
      nodes: [
        {
          id: "navigator-header-actions",
          items
        }
      ]
    };
  }, ...ngDevMode ? [{ debugName: "navigatorHeaderActionMenuModel" }] : (
    /* istanbul ignore next */
    []
  ));
  navigatorMenuValues = computed(() => {
    const user = this.menuUser();
    if (!user) {
      return {};
    }
    return {
      impressions: this.impressionShortcutBadgeCount(user),
      feedback: user.activities.feedback,
      rates: user.activities.game,
      chat: user.activities.chats,
      invitations: user.activities.invitations,
      events: user.activities.event?.all ?? 0,
      transport: user.activities.cars,
      accommodation: user.activities.accommodation,
      supplies: user.activities.supplies,
      tickets: user.activities.tickets,
      contacts: user.activities.contacts
    };
  }, ...ngDevMode ? [{ debugName: "navigatorMenuValues" }] : (
    /* istanbul ignore next */
    []
  ));
  adminNavigatorMenuValues = computed(() => {
    const user = this.menuUser();
    if (!user) {
      return {};
    }
    const reviewCounts = this.adminWorkspaceStore.menuReviewCounts();
    return {
      adminReports: reviewCounts.reports,
      adminFeedback: reviewCounts.feedback,
      adminChat: this.adminSupportCaseMenuCount(user.activities.chat),
      adminJobs: user.activities.adminJobs,
      adminMetrics: user.activities.adminMetrics
    };
  }, ...ngDevMode ? [{ debugName: "adminNavigatorMenuValues" }] : (
    /* istanbul ignore next */
    []
  ));
  adminSupportCaseMenuCount(chat) {
    const counters = chat?.supportCases;
    const count = (value) => Math.max(0, Math.trunc(Number(value) || 0));
    return count(counters?.pending) + count(counters?.warned) + count(counters?.picked) + count(counters?.blocked);
  }
  adminNavigatorBadgeCount(activities) {
    const reviewCounts = this.adminWorkspaceStore.menuReviewCounts();
    return reviewCounts.reports + reviewCounts.feedback + this.adminSupportCaseMenuCount(activities.chat) + activities.adminJobs + activities.adminMetrics;
  }
  navigatorMenuModel = computed(() => {
    const user = this.menuUser();
    if (!user) {
      return { nodes: [] };
    }
    const hostTierPresentation = resolveSideMenuPresentation("hostTier", user.hostTier);
    const traitPresentation = resolveSideMenuPresentation("trait", user.traitLabel);
    const primaryDisabled = this.isPrimaryMenuDisabled(user);
    return {
      nodes: [
        {
          id: "impressions",
          label: "Impressions",
          icon: "psychology",
          palette: "violet",
          items: [
            {
              id: "impressions",
              span: 4,
              ariaLabel: "Open impressions",
              disabled: primaryDisabled,
              segments: [
                {
                  id: "host",
                  label: user.hostTier.replace(" Host", ""),
                  description: "Host",
                  icon: hostTierPresentation.icon,
                  palette: hostTierPresentation.menuPalette
                },
                {
                  id: "member",
                  label: user.memberImpressionTitle.replace(" Attendee", ""),
                  description: "Attendee",
                  icon: traitPresentation.icon,
                  palette: traitPresentation.menuPalette
                }
              ]
            },
            {
              id: "feedback",
              label: "Feedback",
              icon: "rate_review",
              palette: "purple",
              ariaLabel: "Open feedback",
              disabled: primaryDisabled
            }
          ]
        },
        {
          id: "activities",
          label: "Activities",
          icon: "local_activity",
          palette: "blue",
          items: [
            {
              id: "rates",
              label: "Rates",
              icon: "star",
              palette: "gold",
              ariaLabel: "Open rates",
              disabled: primaryDisabled
            },
            {
              id: "chat",
              label: "Chats",
              icon: "chat",
              palette: "blue",
              ariaLabel: "Open chat",
              disabled: this.serverActionsUnavailable()
            },
            {
              id: "invitations",
              label: "Invitations",
              icon: "mail",
              palette: "purple",
              ariaLabel: "Open invitations",
              disabled: primaryDisabled
            },
            {
              id: "events",
              label: "Events",
              icon: "event",
              palette: "blue",
              ariaLabel: "Open events",
              disabled: primaryDisabled
            },
            {
              id: "payment-history",
              label: "payment.history.menu",
              icon: "receipt_long",
              palette: "green",
              counter: this.menuUser()?.activities?.paymentRefundsPending || void 0,
              ariaLabel: "payment.history.open",
              disabled: primaryDisabled
            }
          ]
        },
        {
          id: "assets",
          label: "My Assets",
          icon: "inventory_2",
          palette: "brown",
          items: [
            {
              id: "transport",
              label: ASSET_TYPE_TRANSPORT,
              icon: "directions_car",
              palette: "blue",
              ariaLabel: ASSET_TYPE_TRANSPORT,
              disabled: primaryDisabled
            },
            {
              id: "accommodation",
              label: ASSET_TYPE_ACCOMMODATION,
              icon: "apartment",
              palette: "green",
              ariaLabel: ASSET_TYPE_ACCOMMODATION,
              disabled: primaryDisabled
            },
            {
              id: "supplies",
              label: ASSET_TYPE_SUPPLIES,
              icon: "inventory_2",
              palette: "brown",
              ariaLabel: ASSET_TYPE_SUPPLIES,
              disabled: primaryDisabled
            },
            {
              id: "tickets",
              label: ASSET_FILTER_TICKET,
              icon: "qr_code_2",
              palette: "blue",
              ariaLabel: ASSET_FILTER_TICKET,
              disabled: this.isBlockedUser(user)
            },
            {
              id: "contacts",
              label: "Contacts",
              icon: "contacts",
              palette: "teal",
              ariaLabel: "Contacts",
              disabled: primaryDisabled
            }
          ]
        }
      ]
    };
  }, ...ngDevMode ? [{ debugName: "navigatorMenuModel" }] : (
    /* istanbul ignore next */
    []
  ));
  adminNavigatorMenuModel = computed(() => {
    const disabled = this.serverActionsUnavailable();
    const paymentSimulatorConfigUrl = `${environment.paymentSimulatorConfigUrl ?? ""}`.trim();
    const activeSession = this.sessionService.session();
    const activeUserId = activeSession?.kind === "demo" ? activeSession.userId.trim() : "";
    const showPaymentSimulator = activeUserId.startsWith("admin-demo-");
    return {
      nodes: [
        {
          id: "admin-moderation",
          label: "Moderation & support",
          icon: "admin_panel_settings",
          palette: "orange",
          items: [
            {
              id: "adminReports",
              label: "Reports",
              icon: "report",
              palette: "orange",
              ariaLabel: "Open reports",
              disabled
            },
            {
              id: "adminFeedback",
              label: "Feedback",
              icon: "feedback",
              palette: "purple",
              ariaLabel: "Open application feedback",
              disabled
            },
            {
              id: "adminChat",
              label: "Chats",
              icon: "chat",
              palette: "blue",
              ariaLabel: "Open admin chats",
              disabled
            }
          ]
        },
        {
          id: "admin-configuration",
          label: "Configuration",
          icon: "tune",
          palette: "teal",
          items: [
            {
              id: "adminJobs",
              label: "jobs",
              icon: "pending_actions",
              palette: "blue",
              ariaLabel: "Open jobs",
              disabled
            },
            {
              id: "adminParams",
              label: "params",
              icon: "tune",
              palette: "purple",
              ariaLabel: "Open parameters",
              disabled
            },
            {
              id: "adminContent",
              label: "Content",
              icon: "edit_note",
              palette: "green",
              ariaLabel: "Open content editor",
              disabled
            },
            {
              id: "adminArticle",
              label: "Article",
              icon: "tips_and_updates",
              palette: "gold",
              ariaLabel: "Open article editor",
              disabled
            }
          ]
        },
        {
          id: "admin-monitoring",
          label: "monitoring",
          icon: "monitoring",
          palette: "blue",
          items: [
            {
              id: "adminStats",
              label: "stats",
              icon: "query_stats",
              palette: "green",
              ariaLabel: "Open stats",
              disabled
            },
            {
              id: "adminMetrics",
              label: "metrics",
              icon: "monitoring",
              palette: "cyan",
              ariaLabel: "Open monitoring metrics",
              disabled
            },
            {
              id: "adminGraph",
              label: "Graph",
              icon: "hub",
              palette: "violet",
              ariaLabel: "Open affinity graph",
              disabled
            }
          ]
        },
        ...showPaymentSimulator ? [{
          id: "admin-testing",
          label: "admin.testing",
          icon: "science",
          palette: "cyan",
          items: [{
            id: "adminPaymentSimulator",
            label: "admin.payment.simulator",
            icon: "credit_card_gear",
            palette: "cyan",
            ariaLabel: "admin.payment.simulator.open",
            disabled: disabled || !paymentSimulatorConfigUrl
          }, {
            id: "adminPaymentAuthorizations",
            label: "admin.payment.simulator.3ds",
            icon: "verified_user",
            palette: "green",
            ariaLabel: "admin.payment.simulator.authorization.open",
            disabled: disabled || !paymentSimulatorConfigUrl
          }]
        }] : []
      ]
    };
  }, ...ngDevMode ? [{ debugName: "adminNavigatorMenuModel" }] : (
    /* istanbul ignore next */
    []
  ));
  constructor() {
    effect(() => {
      if (this.sessionService.session() && this.userProfileStore.activeUserId()) {
        this.pwaService.offerInstallAfterLogin();
      }
    });
    effect(() => {
      if (!this.connectionOffline())
        this.offlineAttentionDismissed.set(false);
    });
    this.profileStore.registerBindings(this.profileBindings);
    this.routerEventsSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoutePathRef.set(AppUtils.normalizeRoutePath(event.urlAfterRedirects));
        this.notificationRouteUrl.set(event.urlAfterRedirects);
      }
    });
    effect(() => {
      const userId = this.userProfileStore.activeUserId().trim();
      const url = this.notificationRouteUrl();
      if (userId && this.userProfileStore.activeUserProfile()?.id === userId) {
        void this.openNotificationChatTarget(url, userId);
      }
    });
    installSessionActiveUserSync(this.sessionService.session, this.userProfileStore.activeUserId, (userId) => this.userProfileStore.setActiveUserId(userId));
    effect(() => {
      const session = this.sessionService.session();
      const activeUserId = this.userProfileStore.activeUserId().trim();
      const routeUrl = this.currentRoutePathRef();
      if (!session) {
        this.clearHydrationState();
        return;
      }
      if (this.isAdminWorkspaceRoute(routeUrl) || !this.isNavigatorHydrationRoute(routeUrl)) {
        this.clearHydrationState();
        return;
      }
      const requestKey = session.kind === "firebase" ? `firebase:${session.profile.id}` : session.kind === "operator-bootstrap" ? `operator-bootstrap:${session.email}` : activeUserId ? `demo:${activeUserId}` : "";
      if (!requestKey || this.hydrationRequestKeyRef() === requestKey) {
        return;
      }
      this.hydrationRequestKeyRef.set(requestKey);
      void this.hydrateUserAfterLogin(activeUserId || void 0);
    });
    effect(() => {
      const session = this.sessionService.session();
      const activeUserId = this.userProfileStore.activeUserId().trim();
      if (!session || !activeUserId) {
        this.stopUserRealtimeLongPoll();
        this.profileStore.closeImpressionsPopup();
        this.profileStore.closeContactsPopup();
        return;
      }
      if (this.isOperatorMode()) {
        this.stopUserRealtimeLongPoll();
        this.profileStore.closeImpressionsPopup();
        this.profileStore.closeContactsPopup();
        return;
      }
      if (this.isAdminWorkspaceRoute() || this.userProfileStore.activeUserIsAdmin()) {
        this.profileStore.closeImpressionsPopup();
        this.profileStore.closeContactsPopup();
        this.activateUserRealtimeLongPoll(activeUserId);
        return;
      }
      this.activateUserRealtimeLongPoll(activeUserId);
    });
    effect(() => {
      const session = this.sessionService.session();
      const user = this.userProfileStore.activeUserProfile();
      const activeUserId = this.userProfileStore.activeUserId().trim();
      if (this.isOperatorMode() || !session || !user || !activeUserId || user.id.trim() !== activeUserId) {
        this.notificationCenterStore.reset();
        return;
      }
      void this.notificationCenterStore.initialize(activeUserId, Math.max(0, Math.trunc(Number(user.activities?.notifications) || 0)), user.notificationPreferences?.muted === true);
    });
    effect(() => {
      if (this.popupPresenceStore.visible() && !this.notificationCenterStore.isOpen()) {
        this.notificationCenterStore.requestAttention();
      }
    });
    effect(() => {
      const session = this.sessionService.session();
      const activeUserId = this.userProfileStore.activeUserId().trim();
      const revision = this.privacyPolicy.activeRevision();
      const shouldCheckPrivacyConsent = Boolean(activeUserId) && (Boolean(session) || this.isAdminWorkspaceRoute());
      if (!shouldCheckPrivacyConsent) {
        this.privacyConsentCheckKeyRef.set("");
        this.profileStore.clearPrivacyConsentRequirement();
        return;
      }
      if (!revision) {
        void this.privacyPolicy.prepareOpen();
        return;
      }
      const checkKey = this.privacyConsentKey(activeUserId, revision);
      if (this.privacyConsentCheckKeyRef() === checkKey) {
        return;
      }
      this.privacyConsentCheckKeyRef.set(checkKey);
      void this.ensureActivePrivacyConsent(activeUserId, revision, checkKey);
    });
    effect(() => {
      const isInternal = this.avatarVisible();
      const hasBindings = this.hasBindings();
      const status = this.activeUserLoadState().status;
      if (!isInternal) {
        this.closeSideMenu();
        this.clearUserMenuLoadState();
        return;
      }
      if (!hasBindings || status === "loading" || status === "idle") {
        void this.helpCenterService.preloadAll();
        this.beginUserMenuLoadWindow();
        return;
      }
      if (status === "success") {
        this.clearUserMenuLoadState();
        return;
      }
      this.markUserMenuLoadOverdue();
    });
    effect(() => {
      const isOpen = this.profileStore.impressionsPopupOpen();
      if (isOpen) {
        void this.profileStore.ensureImpressionsPopupLoaded();
      }
    });
    effect(() => {
      const isOpen = this.profileStore.profileEditorOpen();
      if (isOpen) {
        void this.profileStore.ensureProfileEditorLoaded();
      }
    });
    effect(() => {
      const isOpen = this.profileStore.profileViewOpen();
      if (isOpen) {
        void this.profileStore.ensureProfileViewPopupLoaded();
      }
    });
    effect(() => {
      const isOpen = this.eventEditorStore.isOpen();
      if (isOpen) {
        void this.eventEditorStore.ensureEventEditorPopupLoaded();
      }
    });
    effect(() => {
      const request = this.memberMenuStore.activitiesNavigationRequest();
      if (!request || request.type !== "eventEditorCreate" && request.type !== "eventEditor") {
        return;
      }
      void this.eventEditorStore.ensureEventEditorPopupLoaded();
    });
    effect(() => {
      const request = this.memberMenuStore.activitiesNavigationRequest();
      if (!request || request.type !== "members" && request.type !== "eventEditorMembers") {
        return;
      }
      void this.activitiesStore.ensureEventMembersPopupLoaded();
    });
    effect(() => {
      const request = this.memberMenuStore.activitiesNavigationRequest();
      if (!request || request.type !== "eventExplore" && request.type !== "eventCheckoutDraft") {
        return;
      }
      void this.activitiesStore.ensureActivitiesPopupLoaded();
      void this.activitiesStore.ensureEventExplorePopupLoaded();
    });
    effect(() => {
      const request = this.memberMenuStore.activitiesNavigationRequest();
      if (!request || request.type !== "assetExplore" || this.activitiesStore.eventChatSession()) {
        return;
      }
      void this.subEventResourceStore.ensureEventResourcePopupLoaded();
    });
    effect(() => {
      const session = this.activitiesStore.eventChatSession();
      if (session) {
        void this.activitiesStore.ensureEventChatPopupLoaded();
      }
    });
    effect(() => {
      const isActivitiesOpen = this.activitiesStore.activitiesOpen();
      if (isActivitiesOpen) {
        void this.activitiesStore.ensureActivitiesPopupLoaded();
      }
    });
    effect(() => {
      const isContactsOpen = this.profileStore.contactsPopupOpen();
      if (isContactsOpen) {
        void this.profileStore.ensureContactsPopupLoaded();
      }
    });
    effect(() => {
      const isAssetPopupVisible = this.assetPopupStore.visible() || this.assetStore.showAssetForm();
      if (isAssetPopupVisible) {
        void this.assetPopupStore.ensureAssetPopupLoaded();
      }
    });
    effect(() => {
      const resourcePopupVisible = !this.activitiesStore.eventChatSession() && this.subEventResourceStore.popupContextRef()?.origin === "chat";
      if (resourcePopupVisible) {
        void this.subEventResourceStore.ensureEventResourcePopupLoaded();
      }
    });
    effect(() => {
      const assetExploreVisible = !this.activitiesStore.eventChatSession() && this.subEventResourceStore.popupContextRef()?.origin === "chat" && this.subEventResourceStore.assetExplorePopupRef() !== null;
      if (assetExploreVisible) {
        void this.subEventResourceStore.ensureEventResourceAssetExploreLoaded();
      }
    });
    effect(() => {
      const supplyContributionsVisible = !this.activitiesStore.eventChatSession() && this.subEventResourceStore.popupContextRef()?.origin === "chat" && !this.subEventResourceStore.assetExploreOnlyRef() && this.subEventResourceStore.supplyPopupRef() !== null;
      if (supplyContributionsVisible) {
        void this.subEventResourceStore.ensureEventSupplyContributionsPopupLoaded();
      }
    });
    effect(() => {
      const activityInvitePopup = this.activityInviteStore.activityInvitePopup();
      if (activityInvitePopup?.ownerId?.trim()) {
        void this.activityInviteStore.ensureAssetMemberPickerPopupLoaded();
      }
    });
    effect(() => {
      const request = this.memberMenuStore.navigatorActivitiesRequest();
      if (!request || request.updatedMs <= this.lastHandledActivitiesRequestMs) {
        return;
      }
      this.lastHandledActivitiesRequestMs = request.updatedMs;
      this.activitiesStore.openActivities(request.primaryFilter, request.eventScope, void 0, false, {
        adminServiceOnly: request.adminServiceOnly === true
      });
      this.memberMenuStore.clearNavigatorActivitiesRequest();
    });
    effect(() => {
      const request = this.memberMenuStore.navigatorAssetRequest();
      if (!request || request.updatedMs <= this.lastHandledAssetRequestMs) {
        return;
      }
      this.lastHandledAssetRequestMs = request.updatedMs;
      this.assetStore.openAssetPopup(request.assetFilter);
      this.assetPopupStore.primaryVisibleRef.set(true);
      this.memberMenuStore.clearNavigatorAssetRequest();
    });
    effect(() => {
      const request = this.memberMenuStore.navigatorEventFeedbackRequest();
      if (!request || request.updatedMs <= this.lastHandledEventFeedbackRequestMs) {
        return;
      }
      this.lastHandledEventFeedbackRequestMs = request.updatedMs;
      void this.openEventFeedbackPopupFromNavigatorRequest();
    });
    effect(() => {
      const isVisible = this.explanationGuide.hasVisiblePopup();
      if (isVisible) {
        void this.profileStore.ensureExplanationPopupLoaded();
      }
    });
  }
  closeLoadingProfile(event) {
    if (this.profileStore.profileEditorOpen() && !this.profileStore.profileEditorComponent()) {
      event.stopPropagation();
      this.profileStore.closeProfileEditor();
    }
  }
  onWindowOnline() {
    this.runtimeStore.setOnlineState(true);
  }
  onWindowOffline() {
    this.runtimeStore.setOnlineState(false);
  }
  onAvatarMenuSelect(event) {
    if (event.context?.kind !== "toggle-menu" || !this.canToggleAvatarMenu()) {
      return;
    }
    this.menuOpenRef.update((open) => !open);
  }
  onOperatorCommunityMenuSelect(event) {
    if (event.id !== "operator-community" || !this.canToggleAvatarMenu()) {
      return;
    }
    event.sourceEvent.stopPropagation();
    this.operatorMenuStore.open("community");
  }
  onNotificationAttentionSelect(event) {
    if (event.id !== "notification-attention") {
      return;
    }
    this.openNotificationCenter(event.sourceEvent);
  }
  onNotificationDragPositionChange(position) {
    this.notificationCenterStore.setDragPosition(position);
  }
  onNotificationDragStateChange(event) {
    switch (event.phase) {
      case "start":
        this.notificationDismissDraggingRef.set(true);
        this.notificationDismissTargetedRef.set(false);
        return;
      case "move":
        this.notificationDismissTargetedRef.set(this.isNotificationDismissTargetHit(event));
        return;
      case "cancel":
        this.clearNotificationDismissDragState();
        return;
      case "end": {
        const shouldDismiss = this.isNotificationDismissTargetHit(event);
        this.clearNotificationDismissDragState();
        if (!shouldDismiss) {
          return;
        }
        this.notificationCenterStore.setDragPosition({ x: 0, y: 0 });
        this.notificationCenterStore.dismissAttention();
        this.offlineAttentionDismissed.set(true);
      }
    }
  }
  isNotificationDismissTargetHit(event) {
    const target = this.notificationDismissTargetRef?.nativeElement;
    if (!target) {
      return false;
    }
    const rect = target.getBoundingClientRect();
    const targetCenterX = rect.left + rect.width / 2;
    const targetCenterY = rect.top + rect.height / 2;
    const hitRadius = Math.max(rect.width, rect.height) / 2 + _SideMenuComponent.NOTIFICATION_DISMISS_TARGET_PADDING_PX;
    return Math.hypot(event.centerX - targetCenterX, event.centerY - targetCenterY) <= hitRadius;
  }
  clearNotificationDismissDragState() {
    this.notificationDismissDraggingRef.set(false);
    this.notificationDismissTargetedRef.set(false);
  }
  onCloseMenu() {
    this.closeSideMenu();
  }
  onNavigatorHeaderActionMenuSelect(event) {
    switch (event.id) {
      case "notifications":
        this.openNotificationCenter(event.sourceEvent);
        return;
      case "explanations":
        this.onToggleExplanationGuide(event.sourceEvent);
        return;
      case "share":
        this.onShareProfile(event.sourceEvent);
        return;
      case "settings":
        return;
      case "permissions":
        this.openAppSetup();
        return;
      case "help":
      case "feedback":
      case "privacy":
      case "terms":
        this.openSettingsPopup(event.id);
        return;
      case "delete-account":
        this.openDeleteAccountConfirm();
        return;
      case "logout":
        this.openLogoutConfirm();
        return;
      case "report-bugs":
        return;
    }
  }
  onNavigatorMenuSelect(event) {
    switch (event.id) {
      case "impressions":
        this.openImpressions(event.sourceEvent);
        return;
      case "feedback":
        this.openEventFeedbackPopup(event.sourceEvent);
        return;
      case "rates":
        this.openRatesShortcut(event.sourceEvent);
        return;
      case "chat":
        this.openChatShortcut(event.sourceEvent);
        return;
      case "invitations":
        this.openInvitationShortcut(event.sourceEvent);
        return;
      case "events":
        this.openEventShortcut(event.sourceEvent);
        return;
      case "payment-history":
        this.openPaymentHistoryShortcut(event.sourceEvent);
        return;
      case "transport":
        this.openAssetTransportPopup(event.sourceEvent);
        return;
      case "accommodation":
        this.openAssetAccommodationPopup(event.sourceEvent);
        return;
      case "supplies":
        this.openAssetSuppliesPopup(event.sourceEvent);
        return;
      case "tickets":
        this.openAssetTicketsPopup(event.sourceEvent);
        return;
      case "contacts":
        this.openContactsPopup(event.sourceEvent);
        return;
    }
  }
  onAdminNavigatorMenuSelect(event) {
    switch (event.id) {
      case "adminReports":
        this.openAdminReportsShortcut(event.sourceEvent);
        return;
      case "adminFeedback":
        this.openAdminFeedbackShortcut(event.sourceEvent);
        return;
      case "adminChat":
        this.openAdminChatShortcut(event.sourceEvent);
        return;
      case "adminJobs":
        this.openAdminNotificationsShortcut(event.sourceEvent);
        return;
      case "adminParams":
        this.openAdminParamsShortcut(event.sourceEvent);
        return;
      case "adminPaymentSimulator":
        this.openAdminPaymentSimulatorShortcut(event.sourceEvent);
        return;
      case "adminPaymentAuthorizations":
        this.openAdminPaymentAuthorizationsShortcut(event.sourceEvent);
        return;
      case "adminContent":
        this.openAdminHelpEditorShortcut(event.sourceEvent);
        return;
      case "adminArticle":
        this.openAdminIdeaEditorShortcut(event.sourceEvent);
        return;
      case "adminStats":
        this.openAdminStatsShortcut(event.sourceEvent);
        return;
      case "adminMetrics":
        this.openAdminMonitoringShortcut(event.sourceEvent);
        return;
      case "adminGraph":
        this.openAdminAffinityGraphShortcut(event.sourceEvent);
        return;
    }
  }
  onShareProfile(event) {
    event.stopPropagation();
    const baseHref = document.querySelector("base")?.getAttribute("href") ?? "/";
    const url = new URL(baseHref, window.location.origin).toString();
    const title = this.deploymentBranding().productName;
    const text = "Connect with people through shared activities and experiences.";
    if (navigator.share) {
      void navigator.share({ title, text, url });
      return;
    }
    const shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}

${url}`)}`;
    window.location.href = shareUrl;
  }
  onToggleExplanationGuide(event) {
    event.stopPropagation();
    this.explanationGuide.toggleEnabled();
  }
  navigatorHeaderCardModel(user) {
    const admin = this.isAdminMode();
    if (this.isOperatorMode()) {
      return __spreadProps(__spreadValues({}, ProfileHeaderCardConverter.convert(user, {
        admin: true,
        headline: this.i18n.translate("operator.workspace.title"),
        showEdit: !this.serverActionsUnavailable(),
        editDisabled: false,
        editAriaLabel: this.i18n.translate("operator.profile.open")
      })), {
        badgeLabel: this.i18n.translate("operator"),
        meta: this.i18n.translate("operator.workspace.title"),
        metaIcon: "settings_input_component"
      });
    }
    return ProfileHeaderCardConverter.convert(user, {
      admin,
      showEdit: !this.serverActionsUnavailable(),
      editDisabled: admin ? this.serverActionsUnavailable() : this.serverActionsUnavailable() || this.isBlockedUser(user),
      editAriaLabel: admin ? "Open admin profile" : "Open profile editor",
      showRing: !admin && this.showProfileSaveRing(),
      ringState: this.hasProfileSaveError() ? "error" : "loading",
      ringTitle: admin ? null : this.profileSaveAvatarTitle()
    });
  }
  openNavigatorHeaderProfile(event) {
    if (this.isOperatorMode()) {
      event.stopPropagation();
      if (this.serverActionsUnavailable()) {
        return;
      }
      this.operatorMenuStore.closePopup();
      this.closeSideMenu();
      this.profileStore.openProfileEditor();
      return;
    }
    if (this.isAdminMode()) {
      this.openAdminProfileShortcut(event);
      return;
    }
    this.openProfileEditor(event);
  }
  isBlockedUser(user = this.menuUser()) {
    return user?.profileStatus === "blocked";
  }
  isPrimaryMenuDisabled(user) {
    return this.serverActionsUnavailable() || this.isBlockedUser(user);
  }
  openProfileEditor(event) {
    event?.stopPropagation();
    if (this.serverActionsUnavailable() || this.isBlockedUser()) {
      return;
    }
    if (this.isAdminMode()) {
      this.profileStore.openProfileEditor();
      return;
    }
    this.profileStore.openProfileEditor();
  }
  impressionShortcutBadgeCount(user) {
    return Number(user.impressionChangeFlags.host) + Number(user.impressionChangeFlags.member);
  }
  openImpressions(event) {
    event?.stopPropagation();
    if (this.serverActionsUnavailable() || this.isBlockedUser()) {
      return;
    }
    this.openImpressionsPopup();
  }
  openRatesShortcut(event) {
    event?.stopPropagation();
    this.openActivitiesShortcut("rates");
  }
  openChatShortcut(event) {
    event?.stopPropagation();
    if (this.isBlockedUser()) {
      this.openBlockedUserSupportChat();
      return;
    }
    this.openActivitiesShortcut("chats");
  }
  openInvitationShortcut(event) {
    event?.stopPropagation();
    this.openActivitiesShortcut("events", "invitations");
  }
  openEventShortcut(event) {
    event?.stopPropagation();
    this.openActivitiesShortcut("events", "all");
  }
  openPaymentHistoryShortcut(event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.closeSideMenu();
    void this.paymentMethodsPopupStore.openHistory();
  }
  openAssetTransportPopup(event) {
    event?.stopPropagation();
    if (this.serverActionsUnavailable() || this.isBlockedUser()) {
      return;
    }
    this.memberMenuStore.openNavigatorAssetRequest(ASSET_TYPE_TRANSPORT);
  }
  openAssetAccommodationPopup(event) {
    event?.stopPropagation();
    if (this.serverActionsUnavailable() || this.isBlockedUser()) {
      return;
    }
    this.memberMenuStore.openNavigatorAssetRequest(ASSET_TYPE_ACCOMMODATION);
  }
  openAssetSuppliesPopup(event) {
    event?.stopPropagation();
    if (this.serverActionsUnavailable() || this.isBlockedUser()) {
      return;
    }
    this.memberMenuStore.openNavigatorAssetRequest(ASSET_TYPE_SUPPLIES);
  }
  openAssetTicketsPopup(event) {
    event?.stopPropagation();
    this.memberMenuStore.openNavigatorAssetRequest(ASSET_FILTER_TICKET);
  }
  openContactsPopup(event) {
    event?.stopPropagation();
    if (this.userProfileStore.activeUserId().trim()) {
      this.profileStore.openContactsPopup();
    }
  }
  openEventFeedbackPopup(event) {
    event?.stopPropagation();
    if (this.serverActionsUnavailable() || this.isBlockedUser()) {
      return;
    }
    this.memberMenuStore.openNavigatorEventFeedbackRequest();
  }
  isAdminMode() {
    return this.currentRoutePathRef().startsWith("/admin");
  }
  isOperatorMode() {
    return this.currentRoutePathRef().startsWith("/operator");
  }
  isPrivilegedWorkspaceMode() {
    return this.isAdminMode() || this.isOperatorMode();
  }
  openAdminReportsShortcut(event) {
    event?.stopPropagation();
    if (this.serverActionsUnavailable()) {
      return;
    }
    this.adminMenuStore.openReports();
  }
  openAdminFeedbackShortcut(event) {
    event?.stopPropagation();
    if (this.serverActionsUnavailable()) {
      return;
    }
    this.adminMenuStore.openFeedback();
  }
  openAdminChatShortcut(event) {
    event?.stopPropagation();
    if (this.serverActionsUnavailable()) {
      return;
    }
    this.memberMenuStore.openNavigatorActivitiesRequest("chats", void 0, { adminServiceOnly: true });
  }
  openAdminProfileShortcut(event) {
    event?.stopPropagation();
    if (this.serverActionsUnavailable()) {
      return;
    }
    this.profileStore.openProfileEditor();
  }
  openAdminHelpEditorShortcut(event) {
    event?.stopPropagation();
    if (this.serverActionsUnavailable()) {
      return;
    }
    this.adminMenuStore.openHelpEditor();
  }
  openAdminIdeaEditorShortcut(event) {
    event?.stopPropagation();
    if (this.serverActionsUnavailable()) {
      return;
    }
    this.adminMenuStore.openIdeaEditor();
  }
  openAdminNotificationsShortcut(event) {
    event?.stopPropagation();
    if (this.serverActionsUnavailable()) {
      return;
    }
    this.adminMenuStore.openNotifications();
  }
  openAdminParamsShortcut(event) {
    event?.stopPropagation();
    if (this.serverActionsUnavailable()) {
      return;
    }
    this.adminMenuStore.openParams();
  }
  openAdminPaymentSimulatorShortcut(event) {
    event?.stopPropagation();
    if (this.serverActionsUnavailable()) {
      return;
    }
    this.adminMenuStore.openPaymentSimulator();
  }
  openAdminPaymentAuthorizationsShortcut(event) {
    event?.stopPropagation();
    if (this.serverActionsUnavailable()) {
      return;
    }
    this.adminMenuStore.openPaymentAuthorizations();
  }
  openAdminStatsShortcut(event) {
    event?.stopPropagation();
    if (this.serverActionsUnavailable()) {
      return;
    }
    this.adminMenuStore.openStats();
  }
  openAdminAffinityGraphShortcut(event) {
    event?.stopPropagation();
    if (this.serverActionsUnavailable()) {
      return;
    }
    this.adminMenuStore.openAffinityGraph();
  }
  openAdminMonitoringShortcut(event) {
    event?.stopPropagation();
    if (this.serverActionsUnavailable()) {
      return;
    }
    this.adminMenuStore.openMonitoring();
  }
  ngOnDestroy() {
    this.routerEventsSubscription.unsubscribe();
    this.profileStore.clearBindings(this.profileBindings);
    this.userRealtimeScheduler.destroy();
    this.userProfileStore.setUserRealtimePollInFlight(false);
    this.clearUserMenuLoadState();
  }
  async hydrateUserAfterLogin(userId) {
    if (this.isAdminWorkspaceRoute()) {
      return null;
    }
    const requestVersion = ++this.hydrationRequestVersion;
    const sessionKind = this.sessionService.currentSession()?.kind;
    const serverIdentifiedSession = sessionKind === "firebase" || sessionKind === "operator-bootstrap";
    const loadedProfileExt = await this.usersService.loadProfileExtById(serverIdentifiedSession ? void 0 : userId);
    const loadedUser = loadedProfileExt?.profile ?? null;
    if (!loadedUser || requestVersion !== this.hydrationRequestVersion) {
      return null;
    }
    if (this.shouldPromptDeletedAccountReactivation(loadedUser)) {
      this.profileStore.setDeletedAccountReactivationPending(true);
      this.openDeletedAccountReactivationPrompt(loadedUser, requestVersion);
      return loadedUser;
    }
    this.syncHydratedUser(loadedUser);
    void this.helpCenterService.preload("help");
    return loadedUser;
  }
  shouldPromptDeletedAccountReactivation(user) {
    if (user.profileStatus !== "deleted") {
      return false;
    }
    const deletedAtMs = Date.parse(`${user.deletedAtIso ?? ""}`.trim());
    if (!Number.isFinite(deletedAtMs)) {
      return true;
    }
    return Date.now() - deletedAtMs <= _SideMenuComponent.ACCOUNT_REACTIVATION_WINDOW_MS;
  }
  openDeletedAccountReactivationPrompt(user, requestVersion) {
    const userId = user.id.trim();
    if (!userId || this.reactivationPromptUserId === userId) {
      return;
    }
    this.reactivationPromptUserId = userId;
    this.dialogStore.open({
      title: "Reactivate account?",
      message: this.i18n.translateParams("account.reactivation.message", { productName: this.deploymentBranding().productName }),
      cancelLabel: "Cancel",
      confirmLabel: "Reactivate",
      busyConfirmLabel: "Reactivating...",
      confirmTone: "accent",
      allowBackdropClose: false,
      allowEscapeClose: false,
      failureMessage: "Unable to reactivate account.",
      onCancel: async () => {
        this.reactivationPromptUserId = "";
        this.profileStore.setDeletedAccountReactivationPending(false);
        this.clearHydratedUser();
        await this.sessionService.logout().finally(() => this.router.navigate(["/entry"]));
      },
      onConfirm: async () => {
        const restoredProfileStatus = this.resolveReactivatedProfileStatus(user);
        const reactivatedUser = __spreadProps(__spreadValues({}, user), {
          profileStatus: restoredProfileStatus,
          previousProfileStatus: null,
          deletedAtIso: null
        });
        const saved = await this.usersService.saveUserProfile(reactivatedUser);
        if (!saved) {
          throw new Error("Unable to reactivate account.");
        }
        this.reactivationPromptUserId = "";
        setTimeout(() => {
          if (requestVersion === this.hydrationRequestVersion) {
            this.syncHydratedUser(saved);
          }
          this.profileStore.setDeletedAccountReactivationPending(false);
        }, 0);
      }
    });
  }
  async ensureActivePrivacyConsent(userId, revision, checkKey) {
    const requestToken = ++this.privacyConsentCheckToken;
    try {
      const existingConsent = await this.privacyPolicy.loadConsent(userId, revision.id, revision.version);
      if (!this.isCurrentPrivacyConsentCheck(checkKey, requestToken)) {
        return;
      }
      if (this.isPrivacyConsentCurrent(existingConsent, revision)) {
        this.profileStore.clearPrivacyConsentRequirement();
        return;
      }
      const syncedAnonymousConsent = await this.privacyPolicy.syncAnonymousEntryConsent(userId, revision);
      if (!this.isCurrentPrivacyConsentCheck(checkKey, requestToken)) {
        return;
      }
      if (syncedAnonymousConsent) {
        this.profileStore.clearPrivacyConsentRequirement();
        return;
      }
      this.profileStore.setPrivacyConsentRequiredKey(checkKey);
      this.openSettingsPopup("privacy");
    } catch {
      if (this.isCurrentPrivacyConsentCheck(checkKey, requestToken)) {
        this.profileStore.setPrivacyConsentRequiredKey(checkKey);
        this.openSettingsPopup("privacy");
      }
    }
  }
  isCurrentPrivacyConsentCheck(checkKey, requestToken) {
    return this.privacyConsentCheckToken === requestToken && this.privacyConsentCheckKeyRef() === checkKey;
  }
  isPrivacyConsentCurrent(consent, revision) {
    if (!consent) {
      return false;
    }
    const consentRevisionId = `${consent.revisionId ?? ""}`.trim();
    const consentVersion = Math.trunc(Number(consent.revisionVersion) || 0);
    const currentVersion = Math.trunc(Number(revision.version) || 0);
    return consentRevisionId === revision.id && consentVersion >= currentVersion && currentVersion > 0;
  }
  privacyConsentKey(userId, revision) {
    return `${userId.trim()}::${revision.id}:v${revision.version}`;
  }
  isActivePrivacyConsentRequired() {
    const requiredKey = this.profileStore.privacyConsentRequiredKey();
    const activeUserId = this.userProfileStore.activeUserId().trim();
    const revision = this.privacyPolicy.activeRevision();
    if (!requiredKey || !activeUserId || !revision) {
      return false;
    }
    return requiredKey === this.privacyConsentKey(activeUserId, revision);
  }
  resolveReactivatedProfileStatus(user) {
    switch (user.previousProfileStatus) {
      case "blocked":
      case "friends only":
      case "host only":
      case "inactive":
      case "public":
        return user.previousProfileStatus;
      default:
        return "public";
    }
  }
  syncHydratedUser(user) {
    this.userProfileStore.setActiveUserProfile(user);
    this.profileStore.bindings()?.syncHydratedUser?.(user);
  }
  clearHydrationState() {
    this.hydrationRequestVersion += 1;
    this.hydrationRequestKeyRef.set("");
    this.profileStore.setDeletedAccountReactivationPending(false);
  }
  clearHydratedUser() {
    this.clearHydrationState();
  }
  closeSettingsPopup() {
    this.profileStore.closeSettingsPopup({
      keepPrivacyOpen: this.isActivePrivacyConsentRequired()
    });
  }
  closeSideMenu() {
    this.menuOpenRef.set(false);
  }
  openImpressionsPopup(userId) {
    const normalizedUserId = `${userId ?? ""}`.trim() || this.userProfileStore.activeUserId().trim();
    const activeUserId = this.userProfileStore.activeUserId().trim();
    const cachedUser = normalizedUserId ? this.userProfileStore.getUserProfile(normalizedUserId) ?? (normalizedUserId === activeUserId ? this.userProfileStore.activeUserProfile() : null) : null;
    if (normalizedUserId && !cachedUser) {
      void this.usersService.loadUserById(normalizedUserId);
    }
    this.profileStore.openImpressionsPopup(normalizedUserId, {
      contextLabel: "My Impressions"
    });
  }
  openDeleteAccountConfirm() {
    const activeUserName = this.userProfileStore.activeUserProfile()?.name?.trim() || "this account";
    this.dialogStore.open({
      title: "Delete account?",
      message: activeUserName,
      warningMessage: "You can reactivate within 30 days. After that, the account is permanently purged.",
      cancelLabel: "Cancel",
      confirmLabel: "Delete",
      confirmTone: "danger",
      onConfirm: async () => {
        this.closeSideMenu();
        this.closeSettingsPopup();
        this.profileStore.closeProfileEditor();
        this.closeImpressionsPopup();
        this.profileStore.closeContactsPopup();
        if (AppUtils.normalizeRoutePath(this.router.url).startsWith("/admin")) {
          this.clearHydratedUser();
          if (typeof localStorage !== "undefined") {
            localStorage.removeItem(_SideMenuComponent.ADMIN_SESSION_STORAGE_KEY);
          }
          window.dispatchEvent(new CustomEvent("adminLogoutRequested"));
          await this.sessionService.logout().finally(() => this.router.navigate(["/"]));
          return;
        }
        const activeUserId = this.userProfileStore.activeUserId().trim();
        if (activeUserId) {
          const result = await this.usersService.deleteUser(activeUserId);
          if (!result.submitted) {
            this.dialogStore.openInfo(result.message ?? "Unable to delete account.", {
              title: "Delete account",
              confirmLabel: "OK",
              confirmTone: "danger"
            });
            return;
          }
        }
        this.clearHydratedUser();
        await this.sessionService.logout().finally(() => this.router.navigate(["/entry"]));
      }
    });
  }
  openLogoutConfirm() {
    const activeUserName = this.userProfileStore.activeUserProfile()?.name?.trim() || "";
    this.dialogStore.open({
      title: "Logout?",
      message: activeUserName,
      cancelLabel: "Cancel",
      confirmLabel: "Logout",
      confirmTone: "accent",
      onConfirm: async () => {
        this.closeSideMenu();
        this.closeSettingsPopup();
        this.profileStore.closeProfileEditor();
        this.closeImpressionsPopup();
        this.profileStore.closeContactsPopup();
        const activeUserId = this.userProfileStore.activeUserId().trim();
        if (AppUtils.normalizeRoutePath(this.router.url).startsWith("/admin")) {
          if (activeUserId) {
            const result = await this.usersService.logoutUser(activeUserId);
            if (!result.submitted) {
              this.dialogStore.openInfo(result.message ?? "Unable to log out.", {
                title: "Logout",
                confirmLabel: "OK",
                confirmTone: "neutral"
              });
              return;
            }
          }
          this.clearHydratedUser();
          if (typeof localStorage !== "undefined") {
            localStorage.removeItem(_SideMenuComponent.ADMIN_SESSION_STORAGE_KEY);
          }
          window.dispatchEvent(new CustomEvent("adminLogoutRequested"));
          await this.sessionService.logout().finally(() => this.router.navigate(["/"]));
          return;
        }
        if (activeUserId) {
          const result = await this.usersService.logoutUser(activeUserId);
          if (!result.submitted) {
            this.dialogStore.openInfo(result.message ?? "Unable to log out.", {
              title: "Logout",
              confirmLabel: "OK",
              confirmTone: "neutral"
            });
            return;
          }
        }
        this.clearHydratedUser();
        await this.sessionService.logout().finally(() => this.router.navigate(["/entry"]));
      }
    });
  }
  closeImpressionsPopup() {
    const userId = this.profileStore.impressionsPopupUserId().trim() || this.userProfileStore.activeUserId().trim();
    this.userProfileStore.markUserRealtimeImpressionsClosed(userId);
    this.profileStore.closeImpressionsPopup();
  }
  activateUserRealtimeLongPoll(userId) {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId || this.userProfileStore.activeUserId().trim() !== normalizedUserId) {
      return;
    }
    this.userRealtimeScheduler.restart();
  }
  stopUserRealtimeLongPoll() {
    this.userRealtimeScheduler.stop({ abort: true });
    this.userProfileStore.setUserRealtimePollInFlight(false);
  }
  userRealtimePollIntervalMs() {
    return this.sessionService.session() && this.userProfileStore.activeUserId().trim() ? this.usersService.realtimePollIntervalMs() : 0;
  }
  isAdminWorkspaceRoute(routeUrl = this.currentRoutePathRef()) {
    const path = AppUtils.normalizeRoutePath(routeUrl);
    return path === "/admin" || path === "/admin/" || path === "/admin/workspace" || path === "/admin/workspace/";
  }
  isNavigatorHydrationRoute(routeUrl = this.currentRoutePathRef()) {
    return isNavigatorHydrationRoute(routeUrl);
  }
  async runUserRealtimeLongPollTick(userId, signal2) {
    if (!userId || signal2?.aborted) {
      return;
    }
    const notificationSyncToken = this.notificationCenterStore.captureUnreadSyncToken();
    const counterSyncToken = this.activityStore.captureUserCounterSyncToken(userId);
    this.userProfileStore.setUserRealtimePollInFlight(true);
    try {
      const cursor = this.userProfileStore.getUserRealtimeCursor(userId);
      const snapshot = await this.usersService.pollUserRealtimeSnapshot(userId, cursor);
      if (!snapshot || this.userProfileStore.activeUserId().trim() !== userId || signal2?.aborted) {
        return;
      }
      this.userProfileStore.applyUserRealtimeProfileStatus(snapshot.userId, snapshot.profileStatus);
      this.userProfileStore.applyUserRealtimeLocation(snapshot.userId, snapshot.locationCoordinates);
      this.userProfileStore.applyUserRealtimeNotificationDevices(snapshot.userId, snapshot.notificationDevices);
      const nextNotificationCount = Number(snapshot.counters?.notifications);
      const _a = snapshot.counters, { notifications: _notificationCount } = _a, nonNotificationCounters = __objRest(_a, ["notifications"]);
      const nonNotificationSnapshot = __spreadProps(__spreadValues({}, snapshot), {
        counters: nonNotificationCounters
      });
      if (shouldApplyUserRealtimeDomainSnapshot(this.popupPresenceStore.visible())) {
        this.userProfileStore.applyUserRealtimeSnapshot(userId, __spreadValues({}, nonNotificationSnapshot), counterSyncToken);
      } else if (this.activitiesStore.activitiesOpen()) {
        this.activityStore.applyInactiveActivitiesCounterSnapshot(counterSyncToken, nonNotificationCounters, this.activitiesStore.activitiesPrimaryFilter());
      }
      if (Number.isFinite(nextNotificationCount)) {
        this.notificationCenterStore.applyRealtimeUnreadCount(notificationSyncToken, nextNotificationCount);
      }
    } finally {
      this.userProfileStore.setUserRealtimePollInFlight(false);
    }
  }
  beginUserMenuLoadWindow() {
    if (this.userMenuLoadOverdueTimer || this.userMenuLoadOverdueRef()) {
      return;
    }
    this.userMenuLoadOverdueRef.set(false);
    this.userMenuLoadOverdueTimer = setTimeout(() => {
      this.userMenuLoadOverdueTimer = null;
      this.userMenuLoadOverdueRef.set(true);
    }, _SideMenuComponent.USER_MENU_LOAD_DURATION_MS);
  }
  clearUserMenuLoadState() {
    if (this.userMenuLoadOverdueTimer) {
      clearTimeout(this.userMenuLoadOverdueTimer);
      this.userMenuLoadOverdueTimer = null;
    }
    this.userMenuLoadOverdueRef.set(false);
  }
  markUserMenuLoadOverdue() {
    if (this.userMenuLoadOverdueTimer) {
      clearTimeout(this.userMenuLoadOverdueTimer);
      this.userMenuLoadOverdueTimer = null;
    }
    this.userMenuLoadOverdueRef.set(true);
  }
  resolveUserBadgeCount(user) {
    if (this.userProfileStore.isAdminUserProfile(user)) {
      const activityOverrides2 = this.activityStore.getUserCounterOverrides(user.id);
      return this.adminNavigatorBadgeCount({
        chat: activityOverrides2.chat ?? user.activities?.chat,
        adminJobs: this.resolveActivityBadge(user, "adminJobs"),
        adminMetrics: this.resolveActivityBadge(user, "adminMetrics")
      });
    }
    const impressionFlags = this.userProfileStore.getUserImpressionChangeFlags(user.id);
    const activityOverrides = this.activityStore.getUserCounterOverrides(user.id);
    return (impressionFlags.host ? 1 : 0) + (impressionFlags.member ? 1 : 0) + this.resolveActivityBadge(user, "game") + this.resolveActivityBadge(user, "chats") + (activityOverrides.event?.all ?? user.activities?.event?.all ?? 0) + this.resolveActivityBadge(user, "cars") + this.resolveActivityBadge(user, "accommodation") + this.resolveActivityBadge(user, "supplies") + this.resolveActivityBadge(user, "tickets") + this.resolveActivityBadge(user, "contacts") + this.resolveActivityBadge(user, "feedback");
  }
  notificationLauncherAriaLabel(unreadCount, muted) {
    const normalizedCount = Math.max(0, Math.trunc(Number(unreadCount) || 0));
    if (normalizedCount > 0) {
      return `Open notifications, ${normalizedCount} new${muted ? ", alerts muted" : ""}`;
    }
    return muted ? "Open notifications, alerts muted" : "Open notifications";
  }
  openNotificationCenter(event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.closeSideMenu();
    this.notificationCenterStore.open();
  }
  resolveActivityBadge(user, key) {
    const override = this.activityStore.getUserCounterOverride(user.id, key);
    if (override !== null) {
      return override;
    }
    return user.activities?.[key] ?? 0;
  }
  openSettingsPopup(popup) {
    if (popup === "help" && !this.helpCenterService.hasActiveRevision()) {
      return;
    }
    if (popup === "permissions" || popup === "report-bugs" || popup === "delete-account" || popup === "logout") {
      return;
    }
    if (popup === "privacy") {
      void this.privacyPolicy.prepareOpen();
    }
    if (popup === "terms") {
      void this.termsPolicy.prepareOpen();
    }
    if (popup === "help") {
      void this.helpCenterService.preload("help");
    }
    this.profileStore.openSettingsPopup(popup);
  }
  openActivitiesShortcut(primaryFilter, eventScope) {
    if (this.serverActionsUnavailable() || primaryFilter !== "chats" && this.isBlockedUser()) {
      return;
    }
    this.memberMenuStore.openNavigatorActivitiesRequest(primaryFilter, eventScope);
  }
  async openNotificationChatTarget(url, userId) {
    if (AppUtils.normalizeRoutePath(url) !== "/game")
      return;
    const tree = this.router.parseUrl(url);
    const chatId = `${tree.queryParams["chatId"] ?? ""}`.trim();
    const targetMessageId = `${tree.queryParams["messageId"] ?? ""}`.trim();
    if (!chatId)
      return;
    const key = `${userId}:${chatId}:${targetMessageId}`;
    if (this.openingNotificationChat === key)
      return;
    this.openingNotificationChat = key;
    try {
      const chat = await this.chatsService.queryChatById(chatId);
      if (this.userProfileStore.activeUserId() !== userId || this.router.url !== url)
        return;
      if (!chat)
        return;
      await this.activitiesStore.ensureEventChatPopupLoaded();
      if (this.userProfileStore.activeUserId() !== userId || this.router.url !== url)
        return;
      delete tree.queryParams["chatId"];
      delete tree.queryParams["messageId"];
      await this.router.navigateByUrl(tree, { replaceUrl: true });
      if (this.userProfileStore.activeUserId() !== userId)
        return;
      this.activitiesStore.openEventChat(__spreadProps(__spreadValues({}, eventChatPopupRequestFromChat(chat)), { targetMessageId: targetMessageId || null }), eventChatHeaderStateFromChat(chat));
    } finally {
      if (this.openingNotificationChat === key)
        this.openingNotificationChat = "";
    }
  }
  async openBlockedUserSupportChat() {
    const user = this.menuUser();
    if (!user || this.serverActionsUnavailable()) {
      return;
    }
    const activeUserId = user.id.trim();
    if (!activeUserId) {
      return;
    }
    const chat = await this.chatsService.queryChatById(`c-support-admin-${activeUserId}`).catch(() => null);
    if (!chat) {
      this.dialogStore.openInfo("The support chat could not be found. Please contact MyScoutee support.", {
        title: "Unable to open support chat"
      });
      return;
    }
    this.activitiesStore.openActivities("chats");
    this.activitiesStore.openEventChat(eventChatPopupRequestFromChat(chat), eventChatHeaderStateFromChat(chat));
  }
  resolveCompletionPercent(user) {
    return Number.isFinite(user?.completion) ? Math.max(0, Math.trunc(Number(user?.completion))) : 0;
  }
  async openEventFeedbackPopupFromNavigatorRequest() {
    await this.activitiesStore.ensureEventFeedbackPopupLoaded();
  }
  onGlobalPopupRequest(event) {
    const popupEvent = event;
    if (popupEvent.detail?.type === "eventExplore") {
      this.memberMenuStore.requestActivitiesNavigation({ type: "eventExplore" });
      void this.activitiesStore.ensureEventExplorePopupLoaded();
      return;
    }
    if (popupEvent.detail?.type !== "eventEditor") {
      return;
    }
    this.memberMenuStore.requestActivitiesNavigation({
      type: "eventEditorCreate",
      target: "events"
    });
    void this.eventEditorStore.ensureEventEditorPopupLoaded();
  }
  static \u0275fac = function SideMenuComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SideMenuComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SideMenuComponent, selectors: [["app-side-menu"]], viewQuery: function SideMenuComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.notificationDismissTargetRef = _t.first);
    }
  }, hostBindings: function SideMenuComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("keydown.escape", function SideMenuComponent_keydown_escape_HostBindingHandler($event) {
        return ctx.closeLoadingProfile($event);
      }, \u0275\u0275resolveWindow)("online", function SideMenuComponent_online_HostBindingHandler() {
        return ctx.onWindowOnline();
      }, \u0275\u0275resolveWindow)("offline", function SideMenuComponent_offline_HostBindingHandler() {
        return ctx.onWindowOffline();
      }, \u0275\u0275resolveWindow)("openFeaturePopup", function SideMenuComponent_openFeaturePopup_HostBindingHandler($event) {
        return ctx.onGlobalPopupRequest($event);
      }, \u0275\u0275resolveWindow);
    }
  }, decls: 30, vars: 26, consts: [["notificationDismissTarget", ""], [1, "navigator-trigger-rail", 3, "is-open", "is-covered", "is-notification-open"], [3, "model"], [3, "zIndex"], [1, "navigator-trigger-rail"], [1, "navigator-trigger-rail-inner"], ["kind", "inline", "layout", "grid", 1, "operator-community-menu", 2, "--app-menu-grid-columns", "1", "--app-menu-grid-gap", "0", "--app-menu-tile-height", "48px", "--app-menu-tile-label-white-space", "nowrap", "--app-menu-tile-label-overflow-wrap", "normal", 3, "model"], ["kind", "inline", "layout", "row", 1, "user-selector-menu", 3, "itemSelect", "items"], ["kind", "inline", "layout", "grid", 1, "operator-community-menu", 2, "--app-menu-grid-columns", "1", "--app-menu-grid-gap", "0", "--app-menu-tile-height", "48px", "--app-menu-tile-label-white-space", "nowrap", "--app-menu-tile-label-overflow-wrap", "normal", 3, "itemSelect", "model"], [1, "notification-attention-launcher"], ["kind", "fab", 1, "notification-attention-menu", 3, "dragPositionChange", "dragStateChange", "itemSelect", "draggable", "dragActivationDelayMs", "dragPosition", "trigger"], ["aria-hidden", "true", 1, "notification-attention-dismiss-target", 3, "is-over"], ["aria-hidden", "true", 1, "notification-attention-dismiss-target"], [1, "user-menu-backdrop", 3, "open", "is-covered"], [1, "user-menu-panel"], [1, "navigator-menu-header"], [1, "navigator-install-action"], ["type", "button", 3, "click"], [1, "navigator-menu-header-card", 3, "edit", "model"], [1, "navigator-header-actions"], ["kind", "inline", 1, "navigator-header-actions-menu", 3, "itemSelect", "model"], ["type", "button", "aria-label", "Close menu", 1, "user-menu-close-btn", 3, "click"], [1, "user-menu-content"], ["kind", "inline", "layout", "grid", 3, "model", "value"], [1, "user-menu-backdrop", 3, "click"], ["kind", "inline", "layout", "grid", 3, "itemSelect", "model", "value"], [4, "ngComponentOutlet"], ["role", "status", 1, "profile-editor-loading"], ["kind", "spinner-ring", "state", "loading"], [4, "ngComponentOutlet", "ngComponentOutletInputs"]], template: function SideMenuComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, SideMenuComponent_Conditional_0_Template, 4, 8, "div", 1);
      \u0275\u0275conditionalCreate(1, SideMenuComponent_Conditional_1_Template, 3, 11);
      \u0275\u0275conditionalCreate(2, SideMenuComponent_Conditional_2_Template, 1, 1);
      \u0275\u0275domTemplate(3, SideMenuComponent_Defer_3_Template, 1, 0);
      \u0275\u0275defer(4, 3, SideMenuComponent_Defer_4_DepsFn);
      \u0275\u0275conditionalCreate(6, SideMenuComponent_Conditional_6_Template, 1, 1, "ng-container");
      \u0275\u0275conditionalCreate(7, SideMenuComponent_Conditional_7_Template, 4, 3, "app-popup", 2);
      \u0275\u0275conditionalCreate(8, SideMenuComponent_Conditional_8_Template, 1, 1, "ng-container");
      \u0275\u0275conditionalCreate(9, SideMenuComponent_Conditional_9_Template, 1, 1, "ng-container");
      \u0275\u0275element(10, "app-dialog", 3);
      \u0275\u0275domTemplate(11, SideMenuComponent_Defer_11_Template, 1, 0);
      \u0275\u0275defer(12, 11, SideMenuComponent_Defer_12_DepsFn);
      \u0275\u0275conditionalCreate(14, SideMenuComponent_Conditional_14_Template, 1, 1, "ng-container");
      \u0275\u0275conditionalCreate(15, SideMenuComponent_Conditional_15_Template, 1, 1, "ng-container");
      \u0275\u0275conditionalCreate(16, SideMenuComponent_Conditional_16_Template, 1, 1);
      \u0275\u0275conditionalCreate(17, SideMenuComponent_Conditional_17_Template, 1, 1);
      \u0275\u0275conditionalCreate(18, SideMenuComponent_Conditional_18_Template, 1, 1);
      \u0275\u0275conditionalCreate(19, SideMenuComponent_Conditional_19_Template, 1, 1, "ng-container");
      \u0275\u0275conditionalCreate(20, SideMenuComponent_Conditional_20_Template, 1, 1, "ng-container");
      \u0275\u0275conditionalCreate(21, SideMenuComponent_Conditional_21_Template, 1, 1, "ng-container");
      \u0275\u0275conditionalCreate(22, SideMenuComponent_Conditional_22_Template, 1, 1);
      \u0275\u0275conditionalCreate(23, SideMenuComponent_Conditional_23_Template, 1, 1, "ng-container");
      \u0275\u0275conditionalCreate(24, SideMenuComponent_Conditional_24_Template, 1, 1);
      \u0275\u0275conditionalCreate(25, SideMenuComponent_Conditional_25_Template, 1, 1, "ng-container");
      \u0275\u0275conditionalCreate(26, SideMenuComponent_Conditional_26_Template, 1, 1, "ng-container");
      \u0275\u0275conditionalCreate(27, SideMenuComponent_Conditional_27_Template, 1, 1, "ng-container");
      \u0275\u0275conditionalCreate(28, SideMenuComponent_Conditional_28_Template, 1, 1, "ng-container");
      \u0275\u0275conditionalCreate(29, SideMenuComponent_Conditional_29_Template, 1, 1, "ng-container");
    }
    if (rf & 2) {
      let tmp_2_0;
      let tmp_4_0;
      let tmp_6_0;
      let tmp_7_0;
      let tmp_10_0;
      let tmp_11_0;
      let tmp_12_0;
      let tmp_13_0;
      let tmp_14_0;
      let tmp_15_0;
      let tmp_16_0;
      let tmp_17_0;
      let tmp_19_0;
      let tmp_21_0;
      let tmp_22_0;
      let tmp_23_0;
      let tmp_24_0;
      let tmp_25_0;
      \u0275\u0275conditional(ctx.avatarVisible() ? 0 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.avatarVisible() && !ctx.isOperatorMode() && ctx.notificationAttentionVisible() ? 1 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_2_0 = ctx.menuUser()) ? 2 : -1, tmp_2_0);
      \u0275\u0275advance(2);
      \u0275\u0275deferWhen(ctx.profileStore.settingsPopup());
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_4_0 = ctx.profileStore.impressionsPopupComponent()) ? 6 : -1, tmp_4_0);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.profileStore.profileEditorOpen() && !ctx.profileStore.profileEditorComponent() ? 7 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_6_0 = ctx.profileStore.profileEditorComponent()) ? 8 : -1, tmp_6_0);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_7_0 = ctx.profileStore.profileViewPopupComponent()) ? 9 : -1, tmp_7_0);
      \u0275\u0275advance();
      \u0275\u0275property("zIndex", ctx.notificationCenterStore.isOpen() || ctx.paymentMethodsPopupStore.isOpen() ? 24e3 : null);
      \u0275\u0275advance(2);
      \u0275\u0275deferWhen(ctx.notificationCenterStore.isOpen());
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_10_0 = ctx.paymentMethodsPopupStore.component()) ? 14 : -1, tmp_10_0);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_11_0 = !ctx.subEventResourceStore.popupContextRef() && ctx.activitiesStore.eventMembersPopupComponent()) ? 15 : -1, tmp_11_0);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.activitiesStore.eventChatSession() && ((tmp_12_0 = ctx.subEventResourceStore.popupContextRef()) == null ? null : tmp_12_0.origin) === "chat" ? 16 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.activitiesStore.eventChatSession() && ((tmp_13_0 = ctx.subEventResourceStore.popupContextRef()) == null ? null : tmp_13_0.origin) === "chat" && ctx.subEventResourceStore.assetExplorePopupRef() ? 17 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.activitiesStore.eventChatSession() && ((tmp_14_0 = ctx.subEventResourceStore.popupContextRef()) == null ? null : tmp_14_0.origin) === "chat" && !ctx.subEventResourceStore.assetExploreOnlyRef() && ctx.subEventResourceStore.supplyPopupRef() ? 18 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_15_0 = ctx.activityInviteStore.assetMemberPickerPopupComponent()) ? 19 : -1, tmp_15_0);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_16_0 = ctx.profileStore.contactsPopupComponent()) ? 20 : -1, tmp_16_0);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_17_0 = ctx.activitiesStore.activitiesPopupComponent()) ? 21 : -1, tmp_17_0);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.activitiesStore.eventChatSession() ? 22 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_19_0 = ctx.activitiesStore.eventExplorePopupComponent()) ? 23 : -1, tmp_19_0);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.activitiesStore.stackedEventChatSession() && ctx.activitiesStore.stackedEventChatHeader() ? 24 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_21_0 = ctx.eventEditorStore.eventEditorPopupComponent()) ? 25 : -1, tmp_21_0);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_22_0 = ctx.activitiesStore.eventFeedbackPopupComponent()) ? 26 : -1, tmp_22_0);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_23_0 = ctx.activitiesStore.eventFeedbackRatedDetailPopupComponent()) ? 27 : -1, tmp_23_0);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_24_0 = ctx.assetPopupStore.assetPopupComponent()) ? 28 : -1, tmp_24_0);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_25_0 = ctx.profileStore.explanationPopupComponent()) ? 29 : -1, tmp_25_0);
    }
  }, dependencies: [
    CommonModule,
    NgComponentOutlet,
    MatIconModule,
    MatIcon,
    AppMenuComponent,
    HeaderCardComponent,
    DialogComponent,
    PopupComponent,
    IndicatorComponent,
    I18nPipe
  ], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n}\n.navigator-trigger-rail[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0.95rem;\n  right: 1rem;\n  z-index: 1480;\n}\n@media (max-width: 900px) {\n  .navigator-trigger-rail[_ngcontent-%COMP%] {\n    top: 0.7rem;\n    right: 0.7rem;\n  }\n}\n.navigator-trigger-rail[_ngcontent-%COMP%] {\n  pointer-events: none;\n  transition: transform 0.16s ease, opacity 0.16s ease;\n}\n.navigator-trigger-rail.is-open[_ngcontent-%COMP%] {\n  opacity: 0;\n  transform: scale(0.88);\n  pointer-events: none;\n}\n.navigator-trigger-rail.is-notification-open[_ngcontent-%COMP%] {\n  opacity: 0;\n  transform: scale(0.88);\n  pointer-events: none;\n}\n.navigator-trigger-rail.is-covered[_ngcontent-%COMP%] {\n  visibility: hidden;\n  pointer-events: none;\n}\n.navigator-trigger-rail-inner[_ngcontent-%COMP%] {\n  width: auto;\n  margin: 0;\n  padding: 0;\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.52rem;\n}\n.user-selector-menu[_ngcontent-%COMP%] {\n  pointer-events: auto;\n  --app-menu-image-button-size: 48px;\n  --app-menu-image-ring-inset: -5px;\n  --app-menu-image-counter-size: 22px;\n  --app-menu-image-counter-top: -4px;\n  --app-menu-image-counter-right: -2px;\n  --app-menu-image-counter-font-size: 11px;\n}\n.operator-community-menu[_ngcontent-%COMP%] {\n  width: 66px;\n  min-width: 66px;\n  max-width: 66px;\n  pointer-events: auto;\n}\n.notification-attention-launcher[_ngcontent-%COMP%] {\n  position: fixed;\n  right: 1.4rem;\n  bottom: 1.4rem;\n  z-index: 23000;\n  pointer-events: none;\n}\n.notification-attention-launcher.is-chat-open[_ngcontent-%COMP%], \n.notification-attention-launcher.is-checkout-open[_ngcontent-%COMP%], \n.notification-attention-launcher.is-popup-open[_ngcontent-%COMP%] {\n  bottom: calc(4.4rem + env(safe-area-inset-bottom, 0px));\n}\n.notification-attention-menu[_ngcontent-%COMP%] {\n  pointer-events: auto;\n  --notification-attention-corner-size: 1.22rem;\n  --app-menu-counter-min-width: var(--notification-attention-corner-size);\n  --app-menu-counter-height: var(--notification-attention-corner-size);\n  --app-menu-counter-padding: 0;\n  --app-menu-draggable-cursor: pointer;\n  --app-menu-trigger-counter-top: -0.58rem;\n  --app-menu-trigger-counter-right: -0.48rem;\n}\n.notification-attention-dismiss-target[_ngcontent-%COMP%] {\n  position: fixed;\n  left: 50%;\n  bottom: calc(1rem + env(safe-area-inset-bottom, 0px));\n  z-index: 22990;\n  width: 4rem;\n  height: 4rem;\n  box-sizing: border-box;\n  border: 2px solid rgba(255, 255, 255, 0.92);\n  border-radius: 50%;\n  display: grid;\n  place-items: center;\n  transform: translateX(-50%);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(96, 115, 143, 0.97),\n      rgba(53, 73, 103, 0.98));\n  color: #fff;\n  box-shadow: 0 0 0 7px rgba(77, 96, 126, 0.12), 0 10px 28px rgba(15, 30, 51, 0.34);\n  pointer-events: none;\n  animation: _ngcontent-%COMP%_notification-dismiss-target-in 0.18s ease-out both;\n  transition:\n    transform 0.14s ease,\n    border-color 0.14s ease,\n    background 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.notification-attention-dismiss-target.is-over[_ngcontent-%COMP%] {\n  transform: translateX(-50%) scale(1.14);\n  border-color: rgb(255, 255, 255);\n  background:\n    linear-gradient(\n      180deg,\n      #ef6472,\n      #c72e48);\n  box-shadow: 0 0 0 10px rgba(218, 57, 81, 0.18), 0 12px 32px rgba(112, 20, 38, 0.42);\n}\n.notification-attention-dismiss-target[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  display: block;\n  width: 1.55rem;\n  height: 1.55rem;\n  font-size: 1.55rem;\n  line-height: 1.55rem;\n}\n@keyframes _ngcontent-%COMP%_notification-dismiss-target-in {\n  from {\n    opacity: 0;\n    transform: translateX(-50%) translateY(0.8rem) scale(0.82);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(-50%);\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .notification-attention-dismiss-target[_ngcontent-%COMP%] {\n    animation: none;\n    transition: none;\n  }\n}\n.user-menu-backdrop[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 1490;\n  background: rgba(9, 18, 33, 0.48);\n  opacity: 0;\n  pointer-events: none;\n  transition: opacity 0.2s ease;\n}\n.user-menu-backdrop.open[_ngcontent-%COMP%] {\n  opacity: 1;\n  pointer-events: auto;\n}\n.user-menu-backdrop.is-covered[_ngcontent-%COMP%] {\n  visibility: hidden;\n  pointer-events: none;\n}\n.user-menu-panel[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 1500;\n  width: min(444px, 95vw);\n  display: flex;\n  flex-direction: column;\n  background: #f8faff;\n  border-left: 1px solid rgba(255, 255, 255, 0.55);\n  box-shadow: -10px 0 34px rgba(10, 20, 38, 0.3);\n  opacity: 1;\n  transform: translateX(100%);\n  transition: transform 0.24s ease;\n}\n.user-menu-panel.open[_ngcontent-%COMP%] {\n  transform: translateX(0);\n}\n.user-menu-panel.is-covered[_ngcontent-%COMP%] {\n  visibility: hidden;\n  pointer-events: none;\n}\n.navigator-menu-header[_ngcontent-%COMP%] {\n  position: relative;\n}\n.navigator-install-action[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 0.75rem;\n  bottom: 0.55rem;\n  z-index: 7;\n}\n.navigator-install-action[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.3rem;\n  min-height: 32px;\n  padding: 0.35rem 0.65rem;\n  border: 1px solid #c4b5fd;\n  border-radius: 999px;\n  background: #ede9fe;\n  color: #5b21b6;\n  font: inherit;\n  font-size: 0.75rem;\n  font-weight: 700;\n  cursor: pointer;\n}\n.navigator-install-action[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.navigator-menu-header-card[_ngcontent-%COMP%] {\n  display: block;\n  border-bottom: 1px solid rgba(23, 33, 54, 0.12);\n  --app-header-card-radius: 0;\n  --app-header-card-padding-top: 1.25rem;\n  --app-header-card-text-padding-top: 1.15rem;\n}\n.navigator-header-actions[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.88rem;\n  right: 0.58rem;\n  z-index: 7;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.navigator-header-actions-menu[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.user-menu-close-btn[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 32px;\n  border: 0;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.72);\n  color: rgba(31, 58, 90, 0.86);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  transition:\n    transform 0.16s ease,\n    background-color 0.16s ease,\n    color 0.16s ease;\n}\n.user-menu-close-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.user-menu-content[_ngcontent-%COMP%] {\n  flex: 1;\n  overflow-y: auto;\n  display: flex;\n  flex-direction: column;\n  gap: 0.54rem;\n  padding: 0.86rem;\n}\n[_ngcontent-%COMP%]:where(.user-menu-close-btn):focus-visible {\n  outline: 2px solid rgba(66, 110, 182, 0.44);\n  outline-offset: 2px;\n}\n@media (hover: hover) and (pointer: fine) {\n  .user-menu-close-btn[_ngcontent-%COMP%]:hover {\n    transform: translateY(-1px) scale(1.01);\n    background: rgba(255, 255, 255, 0.92);\n  }\n  .user-menu-close-btn[_ngcontent-%COMP%]:active {\n    transform: scale(0.98);\n  }\n}\napp-activities-popup[_ngcontent-%COMP%], \napp-event-feedback-popup[_ngcontent-%COMP%], \napp-asset-popup[_ngcontent-%COMP%], \napp-contacts-popup[_ngcontent-%COMP%], \napp-profile-settings-popups[_ngcontent-%COMP%], \napp-profile-impressions-popup[_ngcontent-%COMP%], \napp-profile-editor[_ngcontent-%COMP%], \napp-event-members-popup[_ngcontent-%COMP%], \napp-event-resource-popup[_ngcontent-%COMP%], \napp-event-supply-contributions-popup[_ngcontent-%COMP%] {\n  display: contents;\n}\n@media (max-width: 900px) {\n  .navigator-trigger-rail-inner[_ngcontent-%COMP%] {\n    flex-wrap: nowrap;\n  }\n  .operator-community-menu[_ngcontent-%COMP%] {\n    flex: 0 0 66px;\n    order: 0;\n  }\n  .user-selector-menu[_ngcontent-%COMP%] {\n    flex: 0 0 48px;\n    order: 1;\n  }\n  .notification-attention-launcher[_ngcontent-%COMP%] {\n    right: 1rem;\n    bottom: 1rem;\n  }\n  .notification-attention-launcher.is-chat-open[_ngcontent-%COMP%], \n   .notification-attention-launcher.is-checkout-open[_ngcontent-%COMP%], \n   .notification-attention-launcher.is-popup-open[_ngcontent-%COMP%] {\n    bottom: calc(3.6rem + 5px + env(safe-area-inset-bottom, 0px));\n  }\n  .user-menu-panel[_ngcontent-%COMP%] {\n    width: 100vw;\n    max-width: none;\n    border-left: 0;\n  }\n}\n.profile-editor-loading[_ngcontent-%COMP%] {\n  flex: 1;\n  display: grid;\n  place-content: center;\n  justify-items: center;\n  gap: 12px;\n  min-height: 240px;\n  color: #536a84;\n}\n/*# sourceMappingURL=side-menu.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadataAsync(SideMenuComponent, () => [import("./settings-popups.component-YBZMLK6H.js").then((m) => m.ProfileSettingsPopupsComponent), import("./notification-center-popup.component-DC3JMADS.js").then((m) => m.NotificationCenterPopupComponent)], (ProfileSettingsPopupsComponent, NotificationCenterPopupComponent) => {
    setClassMetadata(SideMenuComponent, [{
      type: Component,
      args: [{ selector: "app-side-menu", standalone: true, imports: [
        CommonModule,
        MatIconModule,
        AppMenuComponent,
        HeaderCardComponent,
        ProfileSettingsPopupsComponent,
        DialogComponent,
        NotificationCenterPopupComponent,
        PopupComponent,
        IndicatorComponent,
        I18nPipe
      ], template: `@if (avatarVisible()) {
  <div
    class="navigator-trigger-rail"
    [class.is-open]="isMenuOpen()"
    [class.is-covered]="isCoveredByAssetPopup()"
    [class.is-notification-open]="notificationCenterStore.isOpen()"
  >
    <div class="navigator-trigger-rail-inner">
      @if (isOperatorMode()) {
        <app-menu
          class="operator-community-menu"
          kind="inline"
          layout="grid"
          style="
            --app-menu-grid-columns: 1;
            --app-menu-grid-gap: 0;
            --app-menu-tile-height: 48px;
            --app-menu-tile-label-white-space: nowrap;
            --app-menu-tile-label-overflow-wrap: normal;
          "
          [model]="operatorCommunityMenuModel()"
          (itemSelect)="onOperatorCommunityMenuSelect($event)"
        ></app-menu>
      }
      <app-menu
        class="user-selector-menu"
        kind="inline"
        layout="row"
        [items]="avatarMenuItems()"
        (itemSelect)="onAvatarMenuSelect($event)"
      ></app-menu>
    </div>
  </div>
}

@if (avatarVisible() && !isOperatorMode() && notificationAttentionVisible()) {
  <div
    class="notification-attention-launcher"
    [class.is-chat-open]="activitiesStore.eventChatOpen() || activitiesStore.stackedEventChatOpen()"
    [class.is-checkout-open]="eventEditorStore.isOpen() && eventEditorStore.presentation().mode === 'checkout-review'"
    [class.is-popup-open]="popupPresenceStore.visible()"
  >
    <app-menu
      class="notification-attention-menu"
      kind="fab"
      [draggable]="true"
      [dragActivationDelayMs]="notificationDragActivationDelayMs"
      [dragPosition]="notificationCenterStore.dragPosition()"
      [trigger]="notificationAttentionTrigger()"
      (dragPositionChange)="onNotificationDragPositionChange($event)"
      (dragStateChange)="onNotificationDragStateChange($event)"
      (itemSelect)="onNotificationAttentionSelect($event)"
    ></app-menu>
  </div>
  @if (notificationDismissDragging()) {
    <div
      #notificationDismissTarget
      class="notification-attention-dismiss-target"
      [class.is-over]="notificationDismissTargeted()"
      aria-hidden="true"
    >
      <mat-icon>close</mat-icon>
    </div>
  }
}

@if (menuUser(); as user) {
  @if (menuUiState(); as ui) {
    @if (ui.open) {
      <div class="user-menu-backdrop" [class.open]="ui.open" [class.is-covered]="isCoveredByAssetPopup()" (click)="onCloseMenu()"></div>
    }
    <aside
      class="user-menu-panel"
      [class.open]="ui.open"
      [class.is-covered]="isCoveredByAssetPopup()"
    >
      <div class="navigator-menu-header">
        <div class="navigator-install-action">
          <button type="button" (click)="openAppSetup()">
            <mat-icon>{{ pwaService.installAvailable() ? 'install_desktop' : 'settings' }}</mat-icon>
            <span>{{ installLabel() }}</span>
          </button>
        </div>
        <app-header-card
          class="navigator-menu-header-card"
          [model]="navigatorHeaderCardModel(user)"
          (edit)="openNavigatorHeaderProfile($event)"
        ></app-header-card>
        <div class="navigator-header-actions">
          <app-menu
            class="navigator-header-actions-menu"
            kind="inline"
            [model]="navigatorHeaderActionMenuModel()"
            (itemSelect)="onNavigatorHeaderActionMenuSelect($event)"
          ></app-menu>
          <button
            type="button"
            class="user-menu-close-btn"
            aria-label="Close menu"
            (click)="$event.stopPropagation(); onCloseMenu()"
          >
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>
      <div class="user-menu-content">
        @if (isAdminMode()) {
          <app-menu
            kind="inline"
            layout="grid"
            [model]="adminNavigatorMenuModel()"
            [value]="adminNavigatorMenuValues()"
            (itemSelect)="onAdminNavigatorMenuSelect($event)"
          ></app-menu>
        } @else if (!isOperatorMode()) {
          <app-menu
            kind="inline"
            layout="grid"
            [model]="navigatorMenuModel()"
            [value]="navigatorMenuValues()"
            (itemSelect)="onNavigatorMenuSelect($event)"
          ></app-menu>
        }
      </div>
    </aside>
  }
}
@defer (when profileStore.settingsPopup()) {
  <app-profile-settings-popups></app-profile-settings-popups>
}
@if (profileStore.impressionsPopupComponent(); as impressionsComponent) {
  <ng-container *ngComponentOutlet="impressionsComponent"></ng-container>
}
@if (profileStore.profileEditorOpen() && !profileStore.profileEditorComponent()) {
  <app-popup [model]="profileEditorLoadingModel">
    <div class="profile-editor-loading" role="status" [attr.aria-busy]="!profileStore.profileEditorLoadFailed()">
      @if (profileStore.profileEditorLoadFailed()) {
        <mat-icon>error_outline</mat-icon>
        <button type="button" (click)="profileStore.ensureProfileEditorLoaded()">{{ 'try.again' | i18n }}</button>
      } @else {
        <app-indicator kind="spinner-ring" state="loading"></app-indicator>
        <span>{{ 'loading.profile' | i18n: 'Loading profile' }}</span>
      }
    </div>
  </app-popup>
}
@if (profileStore.profileEditorComponent(); as profileComponent) {
  <ng-container *ngComponentOutlet="profileComponent"></ng-container>
}
@if (profileStore.profileViewPopupComponent(); as profileViewComponent) {
  <ng-container *ngComponentOutlet="profileViewComponent"></ng-container>
}

<app-dialog [zIndex]="notificationCenterStore.isOpen() || paymentMethodsPopupStore.isOpen() ? 24000 : null"></app-dialog>

@defer (when notificationCenterStore.isOpen()) {
  <app-notification-center-popup></app-notification-center-popup>
}

@if (paymentMethodsPopupStore.component(); as paymentMethodsComponent) {
  <ng-container *ngComponentOutlet="paymentMethodsComponent"></ng-container>
}

@if (!subEventResourceStore.popupContextRef() && activitiesStore.eventMembersPopupComponent(); as membersComponent) {
  <ng-container *ngComponentOutlet="membersComponent"></ng-container>
}
@if (!activitiesStore.eventChatSession() && subEventResourceStore.popupContextRef()?.origin === 'chat') {
  @if (subEventResourceStore.eventResourcePopupComponent(); as resourceComponent) {
    <ng-container *ngComponentOutlet="resourceComponent"></ng-container>
  }
}
@if (!activitiesStore.eventChatSession() && subEventResourceStore.popupContextRef()?.origin === 'chat' && subEventResourceStore.assetExplorePopupRef()) {
  @if (subEventResourceStore.eventResourceAssetExploreComponent(); as assetExploreComponent) {
    <ng-container *ngComponentOutlet="assetExploreComponent"></ng-container>
  }
}
@if (!activitiesStore.eventChatSession() && subEventResourceStore.popupContextRef()?.origin === 'chat' && !subEventResourceStore.assetExploreOnlyRef() && subEventResourceStore.supplyPopupRef()) {
  @if (subEventResourceStore.eventSupplyContributionsPopupComponent(); as supplyContributionsComponent) {
    <ng-container *ngComponentOutlet="supplyContributionsComponent"></ng-container>
  }
}
@if (activityInviteStore.assetMemberPickerPopupComponent(); as assetMemberPickerComponent) {
  <ng-container *ngComponentOutlet="assetMemberPickerComponent"></ng-container>
}
@if (profileStore.contactsPopupComponent(); as contactsComponent) {
  <ng-container *ngComponentOutlet="contactsComponent"></ng-container>
}

@if (activitiesStore.activitiesPopupComponent(); as activitiesComponent) {
  <ng-container *ngComponentOutlet="activitiesComponent"></ng-container>
}
@if (activitiesStore.eventChatSession()) {
  @if (activitiesStore.eventChatPopupComponent(); as chatComponent) {
    <ng-container *ngComponentOutlet="chatComponent"></ng-container>
  }
}
@if (activitiesStore.eventExplorePopupComponent(); as exploreComponent) {
  <ng-container *ngComponentOutlet="exploreComponent"></ng-container>
}
@if (activitiesStore.stackedEventChatSession() && activitiesStore.stackedEventChatHeader()) {
  @if (activitiesStore.eventChatPopupComponent(); as stackedChatComponent) {
    <ng-container *ngComponentOutlet="stackedChatComponent; inputs: stackedEventChatPopupInputs()"></ng-container>
  }
}
@if (eventEditorStore.eventEditorPopupComponent(); as popupComponent) {
  <ng-container *ngComponentOutlet="popupComponent"></ng-container>
}
@if (activitiesStore.eventFeedbackPopupComponent(); as feedbackComponent) {
  <ng-container *ngComponentOutlet="feedbackComponent"></ng-container>
}
@if (activitiesStore.eventFeedbackRatedDetailPopupComponent(); as ratedFeedbackComponent) {
  <ng-container *ngComponentOutlet="ratedFeedbackComponent"></ng-container>
}

@if (assetPopupStore.assetPopupComponent(); as assetComponent) {
  <ng-container *ngComponentOutlet="assetComponent"></ng-container>
}

@if (profileStore.explanationPopupComponent(); as explanationComponent) {
  <ng-container *ngComponentOutlet="explanationComponent"></ng-container>
}
`, styles: ["/* src/app/shared/ui/components/side-menu/side-menu.component.scss */\n:host {\n  display: block;\n}\n.navigator-trigger-rail {\n  position: fixed;\n  top: 0.95rem;\n  right: 1rem;\n  z-index: 1480;\n}\n@media (max-width: 900px) {\n  .navigator-trigger-rail {\n    top: 0.7rem;\n    right: 0.7rem;\n  }\n}\n.navigator-trigger-rail {\n  pointer-events: none;\n  transition: transform 0.16s ease, opacity 0.16s ease;\n}\n.navigator-trigger-rail.is-open {\n  opacity: 0;\n  transform: scale(0.88);\n  pointer-events: none;\n}\n.navigator-trigger-rail.is-notification-open {\n  opacity: 0;\n  transform: scale(0.88);\n  pointer-events: none;\n}\n.navigator-trigger-rail.is-covered {\n  visibility: hidden;\n  pointer-events: none;\n}\n.navigator-trigger-rail-inner {\n  width: auto;\n  margin: 0;\n  padding: 0;\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.52rem;\n}\n.user-selector-menu {\n  pointer-events: auto;\n  --app-menu-image-button-size: 48px;\n  --app-menu-image-ring-inset: -5px;\n  --app-menu-image-counter-size: 22px;\n  --app-menu-image-counter-top: -4px;\n  --app-menu-image-counter-right: -2px;\n  --app-menu-image-counter-font-size: 11px;\n}\n.operator-community-menu {\n  width: 66px;\n  min-width: 66px;\n  max-width: 66px;\n  pointer-events: auto;\n}\n.notification-attention-launcher {\n  position: fixed;\n  right: 1.4rem;\n  bottom: 1.4rem;\n  z-index: 23000;\n  pointer-events: none;\n}\n.notification-attention-launcher.is-chat-open,\n.notification-attention-launcher.is-checkout-open,\n.notification-attention-launcher.is-popup-open {\n  bottom: calc(4.4rem + env(safe-area-inset-bottom, 0px));\n}\n.notification-attention-menu {\n  pointer-events: auto;\n  --notification-attention-corner-size: 1.22rem;\n  --app-menu-counter-min-width: var(--notification-attention-corner-size);\n  --app-menu-counter-height: var(--notification-attention-corner-size);\n  --app-menu-counter-padding: 0;\n  --app-menu-draggable-cursor: pointer;\n  --app-menu-trigger-counter-top: -0.58rem;\n  --app-menu-trigger-counter-right: -0.48rem;\n}\n.notification-attention-dismiss-target {\n  position: fixed;\n  left: 50%;\n  bottom: calc(1rem + env(safe-area-inset-bottom, 0px));\n  z-index: 22990;\n  width: 4rem;\n  height: 4rem;\n  box-sizing: border-box;\n  border: 2px solid rgba(255, 255, 255, 0.92);\n  border-radius: 50%;\n  display: grid;\n  place-items: center;\n  transform: translateX(-50%);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(96, 115, 143, 0.97),\n      rgba(53, 73, 103, 0.98));\n  color: #fff;\n  box-shadow: 0 0 0 7px rgba(77, 96, 126, 0.12), 0 10px 28px rgba(15, 30, 51, 0.34);\n  pointer-events: none;\n  animation: notification-dismiss-target-in 0.18s ease-out both;\n  transition:\n    transform 0.14s ease,\n    border-color 0.14s ease,\n    background 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.notification-attention-dismiss-target.is-over {\n  transform: translateX(-50%) scale(1.14);\n  border-color: rgb(255, 255, 255);\n  background:\n    linear-gradient(\n      180deg,\n      #ef6472,\n      #c72e48);\n  box-shadow: 0 0 0 10px rgba(218, 57, 81, 0.18), 0 12px 32px rgba(112, 20, 38, 0.42);\n}\n.notification-attention-dismiss-target .mat-icon {\n  display: block;\n  width: 1.55rem;\n  height: 1.55rem;\n  font-size: 1.55rem;\n  line-height: 1.55rem;\n}\n@keyframes notification-dismiss-target-in {\n  from {\n    opacity: 0;\n    transform: translateX(-50%) translateY(0.8rem) scale(0.82);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(-50%);\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .notification-attention-dismiss-target {\n    animation: none;\n    transition: none;\n  }\n}\n.user-menu-backdrop {\n  position: fixed;\n  inset: 0;\n  z-index: 1490;\n  background: rgba(9, 18, 33, 0.48);\n  opacity: 0;\n  pointer-events: none;\n  transition: opacity 0.2s ease;\n}\n.user-menu-backdrop.open {\n  opacity: 1;\n  pointer-events: auto;\n}\n.user-menu-backdrop.is-covered {\n  visibility: hidden;\n  pointer-events: none;\n}\n.user-menu-panel {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 1500;\n  width: min(444px, 95vw);\n  display: flex;\n  flex-direction: column;\n  background: #f8faff;\n  border-left: 1px solid rgba(255, 255, 255, 0.55);\n  box-shadow: -10px 0 34px rgba(10, 20, 38, 0.3);\n  opacity: 1;\n  transform: translateX(100%);\n  transition: transform 0.24s ease;\n}\n.user-menu-panel.open {\n  transform: translateX(0);\n}\n.user-menu-panel.is-covered {\n  visibility: hidden;\n  pointer-events: none;\n}\n.navigator-menu-header {\n  position: relative;\n}\n.navigator-install-action {\n  position: absolute;\n  right: 0.75rem;\n  bottom: 0.55rem;\n  z-index: 7;\n}\n.navigator-install-action button {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.3rem;\n  min-height: 32px;\n  padding: 0.35rem 0.65rem;\n  border: 1px solid #c4b5fd;\n  border-radius: 999px;\n  background: #ede9fe;\n  color: #5b21b6;\n  font: inherit;\n  font-size: 0.75rem;\n  font-weight: 700;\n  cursor: pointer;\n}\n.navigator-install-action mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.navigator-menu-header-card {\n  display: block;\n  border-bottom: 1px solid rgba(23, 33, 54, 0.12);\n  --app-header-card-radius: 0;\n  --app-header-card-padding-top: 1.25rem;\n  --app-header-card-text-padding-top: 1.15rem;\n}\n.navigator-header-actions {\n  position: absolute;\n  top: 0.88rem;\n  right: 0.58rem;\n  z-index: 7;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.navigator-header-actions-menu {\n  min-width: 0;\n}\n.user-menu-close-btn {\n  width: 32px;\n  height: 32px;\n  border: 0;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.72);\n  color: rgba(31, 58, 90, 0.86);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  transition:\n    transform 0.16s ease,\n    background-color 0.16s ease,\n    color 0.16s ease;\n}\n.user-menu-close-btn .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.user-menu-content {\n  flex: 1;\n  overflow-y: auto;\n  display: flex;\n  flex-direction: column;\n  gap: 0.54rem;\n  padding: 0.86rem;\n}\n:where(.user-menu-close-btn):focus-visible {\n  outline: 2px solid rgba(66, 110, 182, 0.44);\n  outline-offset: 2px;\n}\n@media (hover: hover) and (pointer: fine) {\n  .user-menu-close-btn:hover {\n    transform: translateY(-1px) scale(1.01);\n    background: rgba(255, 255, 255, 0.92);\n  }\n  .user-menu-close-btn:active {\n    transform: scale(0.98);\n  }\n}\napp-activities-popup,\napp-event-feedback-popup,\napp-asset-popup,\napp-contacts-popup,\napp-profile-settings-popups,\napp-profile-impressions-popup,\napp-profile-editor,\napp-event-members-popup,\napp-event-resource-popup,\napp-event-supply-contributions-popup {\n  display: contents;\n}\n@media (max-width: 900px) {\n  .navigator-trigger-rail-inner {\n    flex-wrap: nowrap;\n  }\n  .operator-community-menu {\n    flex: 0 0 66px;\n    order: 0;\n  }\n  .user-selector-menu {\n    flex: 0 0 48px;\n    order: 1;\n  }\n  .notification-attention-launcher {\n    right: 1rem;\n    bottom: 1rem;\n  }\n  .notification-attention-launcher.is-chat-open,\n  .notification-attention-launcher.is-checkout-open,\n  .notification-attention-launcher.is-popup-open {\n    bottom: calc(3.6rem + 5px + env(safe-area-inset-bottom, 0px));\n  }\n  .user-menu-panel {\n    width: 100vw;\n    max-width: none;\n    border-left: 0;\n  }\n}\n.profile-editor-loading {\n  flex: 1;\n  display: grid;\n  place-content: center;\n  justify-items: center;\n  gap: 12px;\n  min-height: 240px;\n  color: #536a84;\n}\n/*# sourceMappingURL=side-menu.component.css.map */\n"] }]
    }], () => [], { notificationDismissTargetRef: [{
      type: ViewChild,
      args: ["notificationDismissTarget"]
    }], closeLoadingProfile: [{
      type: HostListener,
      args: ["window:keydown.escape", ["$event"]]
    }], onWindowOnline: [{
      type: HostListener,
      args: ["window:online"]
    }], onWindowOffline: [{
      type: HostListener,
      args: ["window:offline"]
    }], onGlobalPopupRequest: [{
      type: HostListener,
      args: ["window:openFeaturePopup", ["$event"]]
    }] });
  });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SideMenuComponent, { className: "SideMenuComponent", filePath: "app/shared/ui/components/side-menu/side-menu.component.ts", lineNumber: 225 });
})();
export {
  SideMenuComponent
};
//# sourceMappingURL=side-menu.component-L3MKJGH4.js.map
